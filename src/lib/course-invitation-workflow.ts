import { createHash, randomBytes } from "node:crypto";
import {
  AuditActionType,
  CourseInvitationStatus,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
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
  | "duplicate-active-invitation"
  | "inactive-organization"
  | "invalid-email"
  | "invalid-expiry"
  | "invalid-input"
  | "invalid-transition"
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

export type CourseInvitationResolution =
  | {
      code: "cancelled" | "expired" | "invalid-token" | "not-sent";
      success: false;
    }
  | {
      context: {
        cohortId: string | null;
        course: {
          id: string;
          slug: string;
          title: string;
        };
        courseVersionId: string | null;
        expiresAt: Date;
        id: string;
        invitedEmail: string;
        invitedName: string;
        invitedRoleOrPosition: string | null;
        organization: {
          id: string;
          name: string;
        };
      };
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

export async function createDraftCourseInvitation(input: {
  cohortId?: string | null;
  courseId: string;
  courseVersionId?: string | null;
  expiresAt?: Date;
  invitedEmail: string;
  invitedName: string;
  invitedRoleOrPosition?: string | null;
  organizationId: string;
  session: AuthSession | null;
}): Promise<CourseInvitationMutationResult> {
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

  try {
    const invitation = await prisma.$transaction(
      async (tx) => {
        const actor = await resolveAuthorizedAdministrator(tx as typeof prisma, input.session);
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
    return failureResult(error);
  }
}

async function updateInvitationStatus(input: {
  actionType: AuditActionType;
  description: string;
  invitationId: string;
  session: AuthSession | null;
  targetStatus: CourseInvitationStatus;
  timestampField?: "cancelledAt" | "expiredAt" | "sentAt";
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

export async function prepareCourseInvitationResend(input: {
  expiresAt?: Date;
  invitationId: string;
  session: AuthSession | null;
}): Promise<CourseInvitationMutationResult> {
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
      course: { select: { id: true, slug: true, title: true } },
      organization: { select: { id: true, name: true } },
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
      course: invitation.course,
      courseVersionId: invitation.courseVersionId,
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
