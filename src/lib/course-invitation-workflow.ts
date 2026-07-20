import { createHash, randomBytes } from "node:crypto";
import {
  AuditActionType,
  CourseStatus,
  CourseVisibility,
  CourseInvitationStatus,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_INVITATION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const ACTIVE_INVITATION_STATUSES = [
  CourseInvitationStatus.DRAFT,
  CourseInvitationStatus.PENDING,
  CourseInvitationStatus.SENT,
  CourseInvitationStatus.FAILED,
] as const;
const activationQueues = new Map<string, Promise<void>>();

export const COURSE_INVITATION_ALLOWED_TRANSITIONS = {
  [CourseInvitationStatus.DRAFT]: [
    CourseInvitationStatus.PENDING,
    CourseInvitationStatus.SENT,
    CourseInvitationStatus.EXPIRED,
    CourseInvitationStatus.CANCELLED,
    CourseInvitationStatus.FAILED,
  ],
  [CourseInvitationStatus.PENDING]: [
    CourseInvitationStatus.SENT,
    CourseInvitationStatus.EXPIRED,
    CourseInvitationStatus.CANCELLED,
    CourseInvitationStatus.FAILED,
  ],
  [CourseInvitationStatus.SENT]: [
    // SENT -> PENDING is reserved for secure resend preparation.
    CourseInvitationStatus.PENDING,
    CourseInvitationStatus.ACTIVATED,
    CourseInvitationStatus.EXPIRED,
    CourseInvitationStatus.CANCELLED,
    CourseInvitationStatus.FAILED,
  ],
  [CourseInvitationStatus.FAILED]: [
    CourseInvitationStatus.PENDING,
    CourseInvitationStatus.EXPIRED,
    CourseInvitationStatus.CANCELLED,
  ],
  [CourseInvitationStatus.ACTIVATED]: [],
  [CourseInvitationStatus.EXPIRED]: [],
  [CourseInvitationStatus.CANCELLED]: [],
} satisfies Record<CourseInvitationStatus, CourseInvitationStatus[]>;

type CourseInvitationFailureCode =
  | "already-assigned"
  | "conflicting-assignment"
  | "conflicting-organization"
  | "duplicate-active-invitation"
  | "elevated-user"
  | "inactive-cohort"
  | "inactive-organization"
  | "inactive-user"
  | "ineligible-user"
  | "invalid-email"
  | "invalid-expiry"
  | "invalid-input"
  | "invalid-course-state"
  | "invalid-transition"
  | "invalid-version-state"
  | "not-expired"
  | "not-found"
  | "unknown-cohort"
  | "unknown-course"
  | "unknown-course-version"
  | "unknown-organization"
  | "unauthorized"
  | "unavailable";

type CourseInvitationFailure = {
  code: CourseInvitationFailureCode;
  success: false;
};

type CourseInvitationMutationSuccess = {
  invitation: {
    expiresAt: Date;
    id: string;
    status: CourseInvitationStatus;
  };
  plaintextToken?: string;
  success: true;
};

export type CourseInvitationMutationResult =
  | CourseInvitationFailure
  | CourseInvitationMutationSuccess;

type CourseInvitationCreationInput = {
  cohortId?: string | null;
  courseId: string;
  courseVersionId?: string | null;
  expiresAt?: Date;
  invitedEmail: string;
  invitedName: string;
  invitedRoleOrPosition?: string | null;
  organizationId: string;
  session: AuthSession | null;
};

export type CourseInvitationResolution =
  | {
      code: "cancelled" | "expired" | "invalid-token" | "not-sent";
      success: false;
    }
  | {
      context: {
        cohortId: string | null;
        cohortName: string | null;
        course: {
          id: string;
          slug: string;
          title: string;
        };
        courseVersionId: string | null;
        courseVersionNumber: number | null;
        expiresAt: Date;
        id: string;
        invitedEmail: string;
        invitedName: string;
        invitedRoleOrPosition: string | null;
        organization: {
          id: string;
          name: string;
          region: string | null;
        };
      };
      success: true;
    };

export type CourseInvitationActivationResult =
  | {
      access: {
        courseId: string;
        courseSlug: string;
        courseVersionId: string;
      };
      code: "activated" | "already-activated";
      success: true;
    }
  | {
      code: "integrity-error" | "invalid-or-unavailable" | "unauthorized" | "unavailable";
      success: false;
    };

export type CourseInvitationAcceptanceResolution =
  | {
      state: "cancelled" | "expired" | "unavailable";
      success: false;
    }
  | {
      authentication: "matching" | "mismatch" | "required";
      context: {
        courseSlug: string;
        courseTitle: string;
        expiresAt: Date;
        organizationName: string;
      };
      state: "available";
      success: true;
    }
  | {
      context: {
        courseSlug: string;
        courseTitle: string;
        organizationName: string;
      };
      state: "already-activated";
      success: true;
    };

class CourseInvitationWorkflowError extends Error {
  constructor(readonly code: CourseInvitationFailureCode) {
    super(code);
  }
}

export function normalizeCourseInvitationEmail(value: string) {
  return value.trim().toLowerCase();
}

export function createCourseInvitationToken() {
  return randomBytes(32).toString("base64url");
}

export function hashCourseInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function canTransitionCourseInvitation(
  from: CourseInvitationStatus,
  to: CourseInvitationStatus,
) {
  return (
    COURSE_INVITATION_ALLOWED_TRANSITIONS[from] as readonly CourseInvitationStatus[]
  ).includes(to);
}

function cleanText(value: string | null | undefined, maxLength = 160) {
  return value?.trim().slice(0, maxLength) || null;
}

function requireTransition(
  from: CourseInvitationStatus,
  to: CourseInvitationStatus,
) {
  if (!canTransitionCourseInvitation(from, to)) {
    throw new CourseInvitationWorkflowError("invalid-transition");
  }
}

async function resolveAuthorizedAdministrator(
  tx: typeof prisma,
  session: AuthSession | null,
) {
  if (!session?.userId || !session.email) {
    throw new CourseInvitationWorkflowError("unauthorized");
  }

  const actor = await tx.user.findFirst({
    select: { id: true },
    where: {
      email: normalizeCourseInvitationEmail(session.email),
      id: session.userId,
      roleAssignments: {
        some: {
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          role: {
            key: { in: [RoleKey.SUPER_ADMIN, RoleKey.PLATFORM_ADMIN] },
          },
        },
      },
      status: UserStatus.ACTIVE,
    },
  });

  if (!actor) {
    throw new CourseInvitationWorkflowError("unauthorized");
  }

  return actor;
}

function auditMetadata(input: {
  courseId: string;
  expiresAt?: Date;
  organizationId: string;
  previousStatus?: CourseInvitationStatus;
  status: CourseInvitationStatus;
}) {
  return {
    courseId: input.courseId,
    ...(input.expiresAt ? { expiresAt: input.expiresAt.toISOString() } : {}),
    organizationId: input.organizationId,
    ...(input.previousStatus ? { previousStatus: input.previousStatus } : {}),
    status: input.status,
  };
}

function successResult(invitation: {
  expiresAt: Date;
  id: string;
  status: CourseInvitationStatus;
}, plaintextToken?: string): CourseInvitationMutationSuccess {
  return {
    invitation: {
      expiresAt: invitation.expiresAt,
      id: invitation.id,
      status: invitation.status,
    },
    ...(plaintextToken ? { plaintextToken } : {}),
    success: true,
  };
}

function failureResult(error: unknown): CourseInvitationFailure {
  if (error instanceof CourseInvitationWorkflowError) {
    return { code: error.code, success: false };
  }

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "P2034"
  ) {
    return { code: "duplicate-active-invitation", success: false };
  }

  return { code: "unavailable", success: false };
}

async function validateManagedInvitationScope(input: {
  cohortId: string | null;
  courseId: string;
  courseVersionId: string | null;
  invitedEmail: string;
  now: Date;
  organizationId: string;
  tx: Prisma.TransactionClient;
}) {
  const organization = await input.tx.organization.findUnique({
    select: { status: true },
    where: { id: input.organizationId },
  });
  if (!organization) {
    throw new CourseInvitationWorkflowError("unknown-organization");
  }
  if (organization.status !== OrganizationStatus.ACTIVE) {
    throw new CourseInvitationWorkflowError("inactive-organization");
  }

  const course = await input.tx.course.findUnique({
    select: { archivedAt: true, status: true, visibility: true },
    where: { id: input.courseId },
  });
  if (
    !course ||
    course.status !== CourseStatus.PUBLISHED ||
    course.visibility !== CourseVisibility.ASSIGNED_ONLY ||
    course.archivedAt
  ) {
    throw new CourseInvitationWorkflowError("invalid-course-state");
  }

  if (!input.courseVersionId) {
    throw new CourseInvitationWorkflowError("unknown-course-version");
  }
  const version = await input.tx.courseVersion.findUnique({
    select: { archivedAt: true, courseId: true, status: true },
    where: { id: input.courseVersionId },
  });
  if (
    !version ||
    version.courseId !== input.courseId ||
    version.status !== CourseStatus.PUBLISHED ||
    version.archivedAt
  ) {
    throw new CourseInvitationWorkflowError("invalid-version-state");
  }

  if (input.cohortId) {
    const cohort = await input.tx.cohort.findUnique({
      select: {
        organizationLinks: {
          select: { id: true },
          where: { organizationId: input.organizationId },
        },
        status: true,
      },
      where: { id: input.cohortId },
    });
    if (!cohort || cohort.status !== OrganizationStatus.ACTIVE) {
      throw new CourseInvitationWorkflowError("inactive-cohort");
    }
    if (cohort.organizationLinks.length !== 1) {
      throw new CourseInvitationWorkflowError("unknown-cohort");
    }
  }

  const existingUser = await input.tx.user.findUnique({
    select: {
      targetedCourseAssignments: {
        select: { courseVersionId: true, isActive: true },
        where: { courseId: input.courseId },
      },
      organizationId: true,
      roleAssignments: {
        select: { expiresAt: true, isActive: true, role: { select: { key: true } } },
      },
      status: true,
    },
    where: { email: input.invitedEmail },
  });
  if (!existingUser) {
    return;
  }
  if (existingUser.status !== UserStatus.ACTIVE) {
    throw new CourseInvitationWorkflowError("inactive-user");
  }

  const activeRoles = existingUser.roleAssignments
    .filter(
      (assignment) =>
        assignment.isActive &&
        (!assignment.expiresAt || assignment.expiresAt.getTime() > input.now.getTime()),
    )
    .map((assignment) => assignment.role.key);
  if (
    activeRoles.includes(RoleKey.PLATFORM_ADMIN) ||
    activeRoles.includes(RoleKey.SUPER_ADMIN)
  ) {
    throw new CourseInvitationWorkflowError("elevated-user");
  }
  if (!activeRoles.includes(RoleKey.PARTICIPANT)) {
    throw new CourseInvitationWorkflowError("ineligible-user");
  }
  if (
    existingUser.organizationId &&
    existingUser.organizationId !== input.organizationId
  ) {
    throw new CourseInvitationWorkflowError("conflicting-organization");
  }

  const exactAssignment = existingUser.targetedCourseAssignments.find(
    (assignment) => assignment.courseVersionId === input.courseVersionId,
  );
  if (exactAssignment?.isActive) {
    throw new CourseInvitationWorkflowError("already-assigned");
  }
  if (
    existingUser.targetedCourseAssignments.some(
      (assignment) => assignment.courseVersionId !== input.courseVersionId,
    )
  ) {
    throw new CourseInvitationWorkflowError("conflicting-assignment");
  }
}

async function createCourseInvitation(
  input: CourseInvitationCreationInput,
  validateManagementScope: boolean,
): Promise<CourseInvitationMutationResult> {
  const invitedEmail = normalizeCourseInvitationEmail(input.invitedEmail);
  const invitedName = cleanText(input.invitedName);
  const invitedRoleOrPosition = cleanText(input.invitedRoleOrPosition);
  const organizationId = input.organizationId.trim();
  const courseId = input.courseId.trim();
  const courseVersionId = cleanText(input.courseVersionId);
  const cohortId = cleanText(input.cohortId);
  const now = new Date();
  const expiresAt =
    input.expiresAt ?? new Date(now.getTime() + DEFAULT_INVITATION_TTL_MS);

  if (!EMAIL_PATTERN.test(invitedEmail)) {
    return { code: "invalid-email", success: false };
  }
  if (!invitedName || !organizationId || !courseId) {
    return { code: "invalid-input", success: false };
  }
  if (
    expiresAt.getTime() <= now.getTime() ||
    expiresAt.getTime() > now.getTime() + MAX_INVITATION_TTL_MS
  ) {
    return { code: "invalid-expiry", success: false };
  }

  const plaintextToken = createCourseInvitationToken();
  const tokenHash = hashCourseInvitationToken(plaintextToken);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const invitation = await prisma.$transaction(
      async (tx) => {
        const actor = await resolveAuthorizedAdministrator(tx as typeof prisma, input.session);
        const invitationScopeLock = `course-invitation:${courseId}:${invitedEmail}`;
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${invitationScopeLock}))`;
        const organization = await tx.organization.findUnique({
          select: { id: true, status: true },
          where: { id: organizationId },
        });
        if (!organization) {
          throw new CourseInvitationWorkflowError("unknown-organization");
        }
        if (organization.status !== OrganizationStatus.ACTIVE) {
          throw new CourseInvitationWorkflowError("inactive-organization");
        }

        const course = await tx.course.findUnique({
          select: { id: true },
          where: { id: courseId },
        });
        if (!course) {
          throw new CourseInvitationWorkflowError("unknown-course");
        }

        if (courseVersionId) {
          const version = await tx.courseVersion.findFirst({
            select: { id: true },
            where: { courseId, id: courseVersionId },
          });
          if (!version) {
            throw new CourseInvitationWorkflowError("unknown-course-version");
          }
        }

        if (cohortId) {
          const cohort = await tx.cohort.findUnique({
            select: { id: true },
            where: { id: cohortId },
          });
          if (!cohort) {
            throw new CourseInvitationWorkflowError("unknown-cohort");
          }
        }

        if (validateManagementScope) {
          await validateManagedInvitationScope({
            cohortId,
            courseId,
            courseVersionId,
            invitedEmail,
            now,
            organizationId,
            tx,
          });
        }

        const duplicate = await tx.courseInvitation.findFirst({
          select: { id: true },
          where: {
            courseId,
            expiresAt: { gt: now },
            invitedEmail,
            status: { in: [...ACTIVE_INVITATION_STATUSES] },
          },
        });
        if (duplicate) {
          throw new CourseInvitationWorkflowError("duplicate-active-invitation");
        }

        const created = await tx.courseInvitation.create({
          data: {
            cohortId,
            courseId,
            courseVersionId,
            expiresAt,
            invitedByUserId: actor.id,
            invitedEmail,
            invitedName,
            invitedRoleOrPosition,
            organizationId,
            tokenHash,
          },
        });

        await tx.auditLog.create({
          data: {
            actionType: AuditActionType.COURSE_INVITATION_CREATED,
            actorUserId: actor.id,
            description: "Created a draft individual course invitation.",
            entityId: created.id,
            entityType: "CourseInvitation",
            metadataJson: auditMetadata({
              courseId,
              expiresAt,
              organizationId,
              status: created.status,
            }),
          },
        });

        return created;
      },
      { isolationLevel: "Serializable" },
    );

      return successResult(invitation, plaintextToken);
    } catch (error) {
      const failure = failureResult(error);
      if (failure.code !== "unavailable" || attempt === 2) {
        return failure;
      }
      await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
    }
  }

  return { code: "unavailable", success: false };
}

export function createDraftCourseInvitation(
  input: CourseInvitationCreationInput,
): Promise<CourseInvitationMutationResult> {
  return createCourseInvitation(input, false);
}

export function createManagedCourseInvitation(
  input: CourseInvitationCreationInput,
): Promise<CourseInvitationMutationResult> {
  return createCourseInvitation(input, true);
}

async function updateInvitationStatus(input: {
  actionType: AuditActionType;
  description: string;
  invitationId: string;
  session: AuthSession | null;
  targetStatus: CourseInvitationStatus;
  timestampField?: "cancelledAt" | "expiredAt" | "sentAt";
  validateManagementScope?: boolean;
}) {
  try {
    const invitation = await prisma.$transaction(async (tx) => {
      const actor = await resolveAuthorizedAdministrator(tx as typeof prisma, input.session);
      const current = await tx.courseInvitation.findUnique({
        where: { id: input.invitationId },
      });
      if (!current) {
        throw new CourseInvitationWorkflowError("not-found");
      }
      requireTransition(current.status, input.targetStatus);

      const now = new Date();
      if (input.validateManagementScope) {
        if (current.expiresAt.getTime() <= now.getTime()) {
          throw new CourseInvitationWorkflowError("invalid-expiry");
        }
        await validateManagedInvitationScope({
          cohortId: current.cohortId,
          courseId: current.courseId,
          courseVersionId: current.courseVersionId,
          invitedEmail: current.invitedEmail,
          now,
          organizationId: current.organizationId,
          tx,
        });
      }
      const updated = await tx.courseInvitation.update({
        data: {
          status: input.targetStatus,
          ...(input.timestampField ? { [input.timestampField]: now } : {}),
        },
        where: { id: current.id },
      });
      await tx.auditLog.create({
        data: {
          actionType: input.actionType,
          actorUserId: actor.id,
          description: input.description,
          entityId: current.id,
          entityType: "CourseInvitation",
          metadataJson: auditMetadata({
            courseId: current.courseId,
            organizationId: current.organizationId,
            previousStatus: current.status,
            status: updated.status,
          }),
        },
      });
      return updated;
    });

    return successResult(invitation);
  } catch (error) {
    return failureResult(error);
  }
}

export function markCourseInvitationSent(input: {
  invitationId: string;
  session: AuthSession | null;
}) {
  return updateInvitationStatus({
    actionType: AuditActionType.COURSE_INVITATION_SENT,
    description: "Marked an individual course invitation as sent.",
    invitationId: input.invitationId,
    session: input.session,
    targetStatus: CourseInvitationStatus.SENT,
    timestampField: "sentAt",
  });
}

export function markManagedCourseInvitationSent(input: {
  invitationId: string;
  session: AuthSession | null;
}) {
  return updateInvitationStatus({
    actionType: AuditActionType.COURSE_INVITATION_SENT,
    description: "Confirmed secure manual delivery of an individual course invitation.",
    invitationId: input.invitationId,
    session: input.session,
    targetStatus: CourseInvitationStatus.SENT,
    timestampField: "sentAt",
    validateManagementScope: true,
  });
}

async function prepareInvitationResend(input: {
  expiresAt?: Date;
  invitationId: string;
  session: AuthSession | null;
}, validateManagementScope: boolean): Promise<CourseInvitationMutationResult> {
  const now = new Date();
  const expiresAt =
    input.expiresAt ?? new Date(now.getTime() + DEFAULT_INVITATION_TTL_MS);
  if (
    expiresAt.getTime() <= now.getTime() ||
    expiresAt.getTime() > now.getTime() + MAX_INVITATION_TTL_MS
  ) {
    return { code: "invalid-expiry", success: false };
  }

  const plaintextToken = createCourseInvitationToken();
  const tokenHash = hashCourseInvitationToken(plaintextToken);

  try {
    const invitation = await prisma.$transaction(async (tx) => {
      const actor = await resolveAuthorizedAdministrator(tx as typeof prisma, input.session);
      const current = await tx.courseInvitation.findUnique({
        where: { id: input.invitationId },
      });
      if (!current) {
        throw new CourseInvitationWorkflowError("not-found");
      }
      requireTransition(current.status, CourseInvitationStatus.PENDING);

      if (validateManagementScope) {
        await validateManagedInvitationScope({
          cohortId: current.cohortId,
          courseId: current.courseId,
          courseVersionId: current.courseVersionId,
          invitedEmail: current.invitedEmail,
          now,
          organizationId: current.organizationId,
          tx,
        });
      }

      const updated = await tx.courseInvitation.update({
        data: {
          expiresAt,
          status: CourseInvitationStatus.PENDING,
          tokenHash,
        },
        where: { id: current.id },
      });
      await tx.auditLog.create({
        data: {
          actionType: AuditActionType.COURSE_INVITATION_RESENT,
          actorUserId: actor.id,
          description: "Prepared a new token for an individual course invitation.",
          entityId: current.id,
          entityType: "CourseInvitation",
          metadataJson: auditMetadata({
            courseId: current.courseId,
            expiresAt,
            organizationId: current.organizationId,
            previousStatus: current.status,
            status: updated.status,
          }),
        },
      });
      return updated;
    });

    return successResult(invitation, plaintextToken);
  } catch (error) {
    return failureResult(error);
  }
}

export function prepareCourseInvitationResend(input: {
  expiresAt?: Date;
  invitationId: string;
  session: AuthSession | null;
}): Promise<CourseInvitationMutationResult> {
  return prepareInvitationResend(input, false);
}

export function prepareManagedCourseInvitationResend(input: {
  expiresAt?: Date;
  invitationId: string;
  session: AuthSession | null;
}): Promise<CourseInvitationMutationResult> {
  return prepareInvitationResend(input, true);
}

export function cancelCourseInvitation(input: {
  invitationId: string;
  session: AuthSession | null;
}) {
  return updateInvitationStatus({
    actionType: AuditActionType.COURSE_INVITATION_CANCELLED,
    description: "Cancelled an individual course invitation.",
    invitationId: input.invitationId,
    session: input.session,
    targetStatus: CourseInvitationStatus.CANCELLED,
    timestampField: "cancelledAt",
  });
}

export function markCourseInvitationFailed(input: {
  invitationId: string;
  session: AuthSession | null;
}) {
  return updateInvitationStatus({
    actionType: AuditActionType.COURSE_INVITATION_FAILED,
    description: "Marked an individual course invitation as failed.",
    invitationId: input.invitationId,
    session: input.session,
    targetStatus: CourseInvitationStatus.FAILED,
  });
}

export async function expireCourseInvitation(input: {
  invitationId: string;
  now?: Date;
  session: AuthSession | null;
}): Promise<CourseInvitationMutationResult> {
  const now = input.now ?? new Date();

  try {
    const invitation = await prisma.$transaction(async (tx) => {
      const actor = await resolveAuthorizedAdministrator(tx as typeof prisma, input.session);
      const current = await tx.courseInvitation.findUnique({
        where: { id: input.invitationId },
      });
      if (!current) {
        throw new CourseInvitationWorkflowError("not-found");
      }
      if (current.status === CourseInvitationStatus.EXPIRED) {
        return current;
      }
      if (current.expiresAt.getTime() > now.getTime()) {
        throw new CourseInvitationWorkflowError("not-expired");
      }
      requireTransition(current.status, CourseInvitationStatus.EXPIRED);

      const updated = await tx.courseInvitation.update({
        data: {
          expiredAt: now,
          status: CourseInvitationStatus.EXPIRED,
        },
        where: { id: current.id },
      });
      await tx.auditLog.create({
        data: {
          actionType: AuditActionType.COURSE_INVITATION_EXPIRED,
          actorUserId: actor.id,
          description: "Expired an individual course invitation.",
          entityId: current.id,
          entityType: "CourseInvitation",
          metadataJson: auditMetadata({
            courseId: current.courseId,
            organizationId: current.organizationId,
            previousStatus: current.status,
            status: updated.status,
          }),
        },
      });
      return updated;
    });

    return successResult(invitation);
  } catch (error) {
    return failureResult(error);
  }
}

export async function resolveCourseInvitationToken(
  plaintextToken: string,
  now = new Date(),
): Promise<CourseInvitationResolution> {
  const token = plaintextToken.trim();
  if (!token) {
    return { code: "invalid-token", success: false };
  }

  const invitation = await prisma.courseInvitation.findUnique({
    include: {
      cohort: { select: { name: true } },
      course: { select: { id: true, slug: true, title: true } },
      courseVersion: { select: { versionNumber: true } },
      organization: { select: { id: true, name: true, region: true } },
    },
    where: { tokenHash: hashCourseInvitationToken(token) },
  });
  if (!invitation) {
    return { code: "invalid-token", success: false };
  }
  if (invitation.status === CourseInvitationStatus.CANCELLED) {
    return { code: "cancelled", success: false };
  }
  if (
    invitation.status === CourseInvitationStatus.EXPIRED ||
    invitation.expiresAt.getTime() <= now.getTime()
  ) {
    return { code: "expired", success: false };
  }
  if (invitation.status !== CourseInvitationStatus.SENT) {
    return { code: "not-sent", success: false };
  }

  return {
    context: {
      cohortId: invitation.cohortId,
      cohortName: invitation.cohort?.name ?? null,
      course: invitation.course,
      courseVersionId: invitation.courseVersionId,
      courseVersionNumber: invitation.courseVersion?.versionNumber ?? null,
      expiresAt: invitation.expiresAt,
      id: invitation.id,
      invitedEmail: invitation.invitedEmail,
      invitedName: invitation.invitedName,
      invitedRoleOrPosition: invitation.invitedRoleOrPosition,
      organization: invitation.organization,
    },
    success: true,
  };
}

export async function resolveCourseInvitationAcceptance(input: {
  plaintextToken: string;
  session: AuthSession | null;
  now?: Date;
}): Promise<CourseInvitationAcceptanceResolution> {
  const token = input.plaintextToken.trim();
  if (!token || token.length > 512) {
    return { state: "unavailable", success: false };
  }

  const now = input.now ?? new Date();
  const invitation = await prisma.courseInvitation.findUnique({
    include: {
      course: { select: { slug: true, title: true } },
      organization: { select: { name: true } },
    },
    where: { tokenHash: hashCourseInvitationToken(token) },
  });
  if (!invitation) {
    return { state: "unavailable", success: false };
  }
  if (invitation.status === CourseInvitationStatus.CANCELLED) {
    return { state: "cancelled", success: false };
  }
  if (
    invitation.status === CourseInvitationStatus.EXPIRED ||
    invitation.expiresAt.getTime() <= now.getTime()
  ) {
    return { state: "expired", success: false };
  }

  const sessionMatches = Boolean(
    input.session?.userId &&
      input.session.email &&
      normalizeCourseInvitationEmail(input.session.email) === invitation.invitedEmail,
  );
  if (invitation.status === CourseInvitationStatus.ACTIVATED) {
    if (!sessionMatches || invitation.activatedUserId !== input.session?.userId) {
      return { state: "unavailable", success: false };
    }
    return {
      context: {
        courseSlug: invitation.course.slug,
        courseTitle: invitation.course.title,
        organizationName: invitation.organization.name,
      },
      state: "already-activated",
      success: true,
    };
  }
  if (invitation.status !== CourseInvitationStatus.SENT) {
    return { state: "unavailable", success: false };
  }

  return {
    authentication: !input.session
      ? "required"
      : sessionMatches
        ? "matching"
        : "mismatch",
    context: {
      courseSlug: invitation.course.slug,
      courseTitle: invitation.course.title,
      expiresAt: invitation.expiresAt,
      organizationName: invitation.organization.name,
    },
    state: "available",
    success: true,
  };
}

function activeRoleWhere(now: Date) {
  return {
    isActive: true,
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
  };
}

async function resolveActivationLearner(
  tx: Prisma.TransactionClient,
  session: AuthSession | null,
  now: Date,
) {
  if (
    !session?.userId ||
    !session.email ||
    !session.issuedAt ||
    !Number.isFinite(Date.parse(session.issuedAt))
  ) {
    return null;
  }

  return tx.user.findFirst({
    select: {
      email: true,
      id: true,
      organizationId: true,
      primaryCohortId: true,
    },
    where: {
      email: normalizeCourseInvitationEmail(session.email),
      id: session.userId,
      status: UserStatus.ACTIVE,
      AND: [
        {
          roleAssignments: {
            some: {
              ...activeRoleWhere(now),
              role: { key: RoleKey.PARTICIPANT },
            },
          },
        },
        {
          roleAssignments: {
            none: {
              ...activeRoleWhere(now),
              role: {
                key: { in: [RoleKey.PLATFORM_ADMIN, RoleKey.SUPER_ADMIN] },
              },
            },
          },
        },
      ],
    },
  });
}

async function withCourseInvitationActivationLock<T>(
  tokenHash: string,
  operation: () => Promise<T>,
) {
  const previous = activationQueues.get(tokenHash) ?? Promise.resolve();
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = previous.then(() => gate);
  activationQueues.set(tokenHash, queued);

  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (activationQueues.get(tokenHash) === queued) {
      activationQueues.delete(tokenHash);
    }
  }
}

function activationAccess(input: {
  courseId: string;
  courseSlug: string;
  courseVersionId: string | null;
}) {
  if (!input.courseVersionId) {
    throw new CourseInvitationWorkflowError("unavailable");
  }

  return {
    courseId: input.courseId,
    courseSlug: input.courseSlug,
    courseVersionId: input.courseVersionId,
  };
}

function assignmentMatchesActivation(input: {
  assignment: {
    assignmentType: string;
    courseId: string;
    courseVersionId: string | null;
    isActive: boolean;
    targetCohortId: string | null;
    targetOrganizationId: string | null;
    targetUserId: string | null;
  };
  courseId: string;
  courseVersionId: string;
  userId: string;
}) {
  return (
    input.assignment.assignmentType === "USER" &&
    input.assignment.courseId === input.courseId &&
    input.assignment.courseVersionId === input.courseVersionId &&
    input.assignment.targetUserId === input.userId &&
    input.assignment.targetCohortId === null &&
    input.assignment.targetOrganizationId === null
  );
}

async function transitionCourseInvitationToActivated(input: {
  assignmentId: string;
  invitation: {
    activatedUserId: string | null;
    courseId: string;
    courseVersionId: string | null;
    id: string;
    organizationId: string;
    status: CourseInvitationStatus;
  };
  now: Date;
  tx: Prisma.TransactionClient;
  userId: string;
}) {
  requireTransition(input.invitation.status, CourseInvitationStatus.ACTIVATED);

  const activated = await input.tx.courseInvitation.update({
    data: {
      activatedAt: input.now,
      activatedUserId: input.userId,
      courseAssignmentId: input.assignmentId,
      status: CourseInvitationStatus.ACTIVATED,
    },
    where: {
      activatedUserId: input.invitation.activatedUserId,
      id: input.invitation.id,
      status: input.invitation.status,
    },
  });

  await input.tx.auditLog.create({
    data: {
      actionType: AuditActionType.COURSE_INVITATION_ACTIVATED,
      actorUserId: input.userId,
      description: "Activated an individual course invitation.",
      entityId: activated.id,
      entityType: "CourseInvitation",
      metadataJson: {
        activatedUserId: input.userId,
        assignmentId: input.assignmentId,
        courseId: input.invitation.courseId,
        courseVersionId: input.invitation.courseVersionId,
        organizationId: input.invitation.organizationId,
        status: CourseInvitationStatus.ACTIVATED,
      },
    },
  });

  return activated;
}

async function activateCourseInvitationTransaction(input: {
  now: Date;
  session: AuthSession | null;
  tokenHash: string;
}): Promise<CourseInvitationActivationResult> {
  return prisma.$transaction(
    async (tx) => {
      const learner = await resolveActivationLearner(tx, input.session, input.now);
      if (!learner) {
        return { code: "unauthorized", success: false };
      }

      const invitation = await tx.courseInvitation.findUnique({
        where: { tokenHash: input.tokenHash },
      });

      if (
        !invitation ||
        normalizeCourseInvitationEmail(learner.email) !== invitation.invitedEmail
      ) {
        return { code: "invalid-or-unavailable", success: false };
      }

      const organization = await tx.organization.findUnique({
        select: { id: true, status: true },
        where: { id: invitation.organizationId },
      });
      const course = await tx.course.findUnique({
        select: {
          archivedAt: true,
          id: true,
          slug: true,
          status: true,
          visibility: true,
        },
        where: { id: invitation.courseId },
      });
      const courseVersion = invitation.courseVersionId
        ? await tx.courseVersion.findUnique({
            select: { archivedAt: true, courseId: true, id: true, status: true },
            where: { id: invitation.courseVersionId },
          })
        : null;
      const cohort = invitation.cohortId
        ? await tx.cohort.findUnique({
            select: { id: true, status: true },
            where: { id: invitation.cohortId },
          })
        : null;
      const cohortOrganization = invitation.cohortId
        ? await tx.cohortOrganization.findUnique({
            select: { id: true },
            where: {
              cohortId_organizationId: {
                cohortId: invitation.cohortId,
                organizationId: invitation.organizationId,
              },
            },
          })
        : null;

      if (invitation.status === CourseInvitationStatus.ACTIVATED) {
        if (invitation.activatedUserId !== learner.id) {
          return { code: "invalid-or-unavailable", success: false };
        }

        const activatedAssignment = invitation.courseAssignmentId
          ? await tx.courseAssignment.findUnique({
              where: { id: invitation.courseAssignmentId },
            })
          : null;
        if (
          learner.organizationId !== invitation.organizationId ||
          (invitation.cohortId && learner.primaryCohortId !== invitation.cohortId) ||
          organization?.status !== OrganizationStatus.ACTIVE ||
          course?.status !== CourseStatus.PUBLISHED ||
          course.visibility !== CourseVisibility.ASSIGNED_ONLY ||
          course.archivedAt ||
          !invitation.courseVersionId ||
          !courseVersion ||
          courseVersion.courseId !== invitation.courseId ||
          courseVersion.status !== CourseStatus.PUBLISHED ||
          courseVersion.archivedAt ||
          !activatedAssignment ||
          !assignmentMatchesActivation({
            assignment: activatedAssignment,
            courseId: invitation.courseId,
            courseVersionId: invitation.courseVersionId,
            userId: learner.id,
          }) ||
          !activatedAssignment.isActive ||
          (invitation.cohortId &&
            (cohort?.status !== OrganizationStatus.ACTIVE || !cohortOrganization))
        ) {
          return { code: "integrity-error", success: false };
        }

        return {
          access: activationAccess({
            courseId: course.id,
            courseSlug: course.slug,
            courseVersionId: invitation.courseVersionId,
          }),
          code: "already-activated",
          success: true,
        };
      }

      if (
        invitation.status !== CourseInvitationStatus.SENT ||
        invitation.expiresAt.getTime() <= input.now.getTime() ||
        organization?.status !== OrganizationStatus.ACTIVE ||
        course?.status !== CourseStatus.PUBLISHED ||
        course.visibility !== CourseVisibility.ASSIGNED_ONLY ||
        course.archivedAt ||
        !invitation.courseVersionId ||
        !courseVersion ||
        courseVersion.courseId !== invitation.courseId ||
        courseVersion.status !== CourseStatus.PUBLISHED ||
        courseVersion.archivedAt ||
        (invitation.cohortId &&
          (cohort?.status !== OrganizationStatus.ACTIVE || !cohortOrganization))
      ) {
        return { code: "invalid-or-unavailable", success: false };
      }

      if (
        (learner.organizationId && learner.organizationId !== invitation.organizationId) ||
        (invitation.cohortId &&
          learner.primaryCohortId &&
          learner.primaryCohortId !== invitation.cohortId)
      ) {
        return { code: "integrity-error", success: false };
      }

      const existingAssignments = await tx.courseAssignment.findMany({
        where: {
          courseId: invitation.courseId,
          targetUserId: learner.id,
        },
      });
      if (existingAssignments.length > 1) {
        return { code: "integrity-error", success: false };
      }

      const existingAssignment = existingAssignments[0];
      if (
        existingAssignment &&
        !assignmentMatchesActivation({
          assignment: existingAssignment,
          courseId: invitation.courseId,
          courseVersionId: invitation.courseVersionId,
          userId: learner.id,
        })
      ) {
        return { code: "integrity-error", success: false };
      }

      if (
        learner.organizationId !== invitation.organizationId ||
        (invitation.cohortId && learner.primaryCohortId !== invitation.cohortId)
      ) {
        await tx.user.update({
          data: {
            organizationId: invitation.organizationId,
            ...(invitation.cohortId ? { primaryCohortId: invitation.cohortId } : {}),
          },
          where: {
            id: learner.id,
            organizationId: learner.organizationId,
            primaryCohortId: learner.primaryCohortId,
          },
        });
      }

      const assignment = existingAssignment
        ? await tx.courseAssignment.update({
            data: {
              assignedAt: input.now,
              assignedById: invitation.invitedByUserId,
              isActive: true,
            },
            where: { id: existingAssignment.id },
          })
        : await tx.courseAssignment.create({
            data: {
              assignedAt: input.now,
              assignedById: invitation.invitedByUserId,
              assignmentType: "USER",
              courseId: invitation.courseId,
              courseVersionId: invitation.courseVersionId,
              targetUserId: learner.id,
            },
          });

      await transitionCourseInvitationToActivated({
        assignmentId: assignment.id,
        invitation,
        now: input.now,
        tx,
        userId: learner.id,
      });

      return {
        access: activationAccess({
          courseId: course.id,
          courseSlug: course.slug,
          courseVersionId: invitation.courseVersionId,
        }),
        code: "activated",
        success: true,
      };
    },
    { isolationLevel: "Serializable", maxWait: 10_000, timeout: 30_000 },
  );
}

export async function activateCourseInvitation(input: {
  plaintextToken: string;
  session: AuthSession | null;
}): Promise<CourseInvitationActivationResult> {
  const token = input.plaintextToken.trim();
  if (!token) {
    return { code: "invalid-or-unavailable", success: false };
  }

  const tokenHash = hashCourseInvitationToken(token);
  return withCourseInvitationActivationLock(tokenHash, async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        return await activateCourseInvitationTransaction({
          now: new Date(),
          session: input.session,
          tokenHash,
        });
      } catch {
        // The transaction is atomic, so bounded retries safely resolve serialization,
        // unique-constraint, conditional-update, and indeterminate commit races.
        if (attempt === 4) {
          return { code: "unavailable", success: false };
        }
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    }

    return { code: "unavailable", success: false };
  });
}
