import {
  CourseInvitationStatus,
  CourseStatus,
  CourseVisibility,
  EnrollmentStatus,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import type { AuthSession } from "./auth/session-codec";
import { isControlledRegion } from "./controlled-options";
import {
  createManagedCourseInvitation,
  markCourseInvitationFailed,
  markManagedCourseInvitationSent,
  prepareManagedCourseInvitationResend,
} from "./course-invitation-workflow";
import { sendCourseInvitationEmail } from "./email";
import {
  createCourseInvitationExpiry,
  isControlledHubAccess,
} from "./hub-access-policy";
import { prisma } from "./prisma";

const LIST_LIMIT = 100;

export type AdminCourseInvitationFilters = {
  cohortId?: string;
  courseId?: string;
  created?: "7d" | "30d" | "90d" | "all";
  organizationId?: string;
  query?: string;
  status?: string;
};

export type AdminCourseInvitationDisplayStatus =
  | "ACTIVATED"
  | "CANCELLED"
  | "COMPLETED"
  | "DELIVERY_FAILED"
  | "IN_PROGRESS"
  | "INVITATION_EXPIRED"
  | "INVITED";

export type CourseInvitationDeliveryResult =
  | {
      code: string;
      success: false;
    }
  | {
      delivered: boolean;
      invitation: {
        expiresAt: Date;
        id: string;
        status: CourseInvitationStatus;
      };
      summary?: {
        courseTitle: string;
        invitedEmail: string;
        invitedName: string;
        organizationName: string;
      };
      success: true;
    };

function clean(value: string | null | undefined) {
  return value?.trim() || undefined;
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function invitationStatusWhere(status?: string): Prisma.CourseInvitationWhereInput {
  const now = new Date();
  if (status === "INVITED") {
    return {
      expiresAt: { gt: now },
      status: {
        in: [
          CourseInvitationStatus.DRAFT,
          CourseInvitationStatus.PENDING,
          CourseInvitationStatus.SENT,
        ],
      },
    };
  }
  if (status === "INVITATION_EXPIRED") {
    return {
      OR: [
        { status: CourseInvitationStatus.EXPIRED },
        {
          expiresAt: { lte: now },
          status: {
            in: [
              CourseInvitationStatus.DRAFT,
              CourseInvitationStatus.PENDING,
              CourseInvitationStatus.SENT,
            ],
          },
        },
      ],
    };
  }
  if (status === "DELIVERY_FAILED") return { status: CourseInvitationStatus.FAILED };
  if (status === "CANCELLED") return { status: CourseInvitationStatus.CANCELLED };
  if (["ACTIVATED", "IN_PROGRESS", "COMPLETED"].includes(status ?? "")) {
    return { status: CourseInvitationStatus.ACTIVATED };
  }
  return {};
}

async function requireInvitationManager(session: AuthSession | null) {
  if (!session?.userId || !session.email) {
    throw new Error("course-invitation-management-unavailable");
  }

  const now = new Date();
  const actor = await prisma.user.findFirst({
    select: { id: true },
    where: {
      email: session.email.trim().toLowerCase(),
      id: session.userId,
      roleAssignments: {
        some: {
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          role: { key: { in: [RoleKey.PLATFORM_ADMIN, RoleKey.SUPER_ADMIN] } },
        },
      },
      status: UserStatus.ACTIVE,
    },
  });

  if (!actor) {
    throw new Error("course-invitation-management-unavailable");
  }

  return actor;
}

function createdSince(filter: AdminCourseInvitationFilters["created"]) {
  if (!filter || filter === "all") {
    return undefined;
  }

  const days = filter === "7d" ? 7 : filter === "30d" ? 30 : 90;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function getAdminCourseInvitationOptions(session: AuthSession | null) {
  await requireInvitationManager(session);

  const [organizations, courses, cohorts] = await Promise.all([
    prisma.organization.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, region: true },
      where: { status: OrganizationStatus.ACTIVE },
    }),
    prisma.course.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        versions: {
          orderBy: { versionNumber: "desc" },
          select: { id: true, versionNumber: true },
          where: { archivedAt: null, status: CourseStatus.PUBLISHED },
        },
      },
      where: {
        archivedAt: null,
        status: CourseStatus.PUBLISHED,
        visibility: isControlledHubAccess()
          ? { in: [CourseVisibility.ASSIGNED_ONLY, CourseVisibility.PUBLIC] }
          : CourseVisibility.ASSIGNED_ONLY,
        versions: { some: { archivedAt: null, status: CourseStatus.PUBLISHED } },
      },
    }),
    prisma.cohort.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        organizationLinks: { select: { organizationId: true } },
      },
      where: { status: OrganizationStatus.ACTIVE },
    }),
  ]);

  return { cohorts, courses, organizations };
}

export async function getAdminCourseInvitationList(
  session: AuthSession | null,
  filters: AdminCourseInvitationFilters = {},
) {
  await requireInvitationManager(session);

  const status = clean(filters.status);
  const since = createdSince(filters.created);
  const where: Prisma.CourseInvitationWhereInput = {
    ...(clean(filters.cohortId) ? { cohortId: clean(filters.cohortId) } : {}),
    ...(clean(filters.courseId) ? { courseId: clean(filters.courseId) } : {}),
    ...(since ? { createdAt: { gte: since } } : {}),
    ...(clean(filters.organizationId)
      ? { organizationId: clean(filters.organizationId) }
      : {}),
    ...(clean(filters.query)
      ? {
          invitedEmail: {
            contains: clean(filters.query),
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...invitationStatusWhere(status),
  };

  const [records, total, options] = await Promise.all([
    prisma.courseInvitation.findMany({
      include: {
        activatedUser: {
          select: {
            enrollments: {
              select: { courseId: true, progressPercent: true, status: true },
            },
          },
        },
        cohort: { select: { name: true } },
        course: { select: { title: true } },
        courseVersion: { select: { versionNumber: true } },
        invitedBy: { select: { fullName: true } },
        organization: { select: { name: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: LIST_LIMIT,
      where,
    }),
    prisma.courseInvitation.count({ where }),
    getAdminCourseInvitationOptions(session),
  ]);

  const mappedRecords = records.map((record) => ({
      activatedAt: formatDate(record.activatedAt),
      cohort: record.cohort?.name ?? "Not assigned",
      course: record.course.title,
      createdAt: formatDate(record.createdAt),
      createdBy: record.invitedBy.fullName,
      email: record.invitedEmail,
      expiresAt: formatDate(record.expiresAt),
      href: `/admin/course-invitations/${record.id}`,
      id: record.id,
      organization: record.organization.name,
      sentAt: formatDate(record.sentAt),
      status: displayStatus({
        courseId: record.courseId,
        enrollments: record.activatedUser?.enrollments ?? [],
        expiresAt: record.expiresAt,
        status: record.status,
      }),
      version: record.courseVersion
        ? `Version ${record.courseVersion.versionNumber}`
        : "No version",
    }));
  const progressStatuses = new Set(["ACTIVATED", "IN_PROGRESS", "COMPLETED"]);
  const effectiveRecords = status && progressStatuses.has(status)
    ? mappedRecords.filter((record) => record.status === status)
    : mappedRecords;

  return {
    filters,
    limit: LIST_LIMIT,
    options,
    records: effectiveRecords,
    total: status && progressStatuses.has(status) ? effectiveRecords.length : total,
  };
}

export async function getAdminCourseInvitationDetail(
  invitationId: string,
  session: AuthSession | null,
) {
  await requireInvitationManager(session);

  const invitation = await prisma.courseInvitation.findUnique({
    include: {
      activatedUser: {
        select: {
          enrollments: {
            select: { courseId: true, progressPercent: true, status: true },
          },
          fullName: true,
          id: true,
        },
      },
      cohort: { select: { name: true } },
      course: { select: { slug: true, title: true } },
      courseAssignment: { select: { id: true, isActive: true } },
      courseVersion: { select: { versionNumber: true } },
      invitedBy: { select: { fullName: true } },
      organization: { select: { name: true } },
    },
    where: { id: invitationId },
  });
  if (!invitation) {
    return null;
  }

  const history = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      actionType: true,
      actor: { select: { fullName: true } },
      createdAt: true,
      description: true,
    },
    where: { entityId: invitation.id, entityType: "CourseInvitation" },
  });

  return {
    activatedAt: formatDate(invitation.activatedAt),
    activatedUser: invitation.activatedUser?.fullName ?? null,
    canCancel: new Set<CourseInvitationStatus>([
      CourseInvitationStatus.DRAFT,
      CourseInvitationStatus.PENDING,
      CourseInvitationStatus.SENT,
      CourseInvitationStatus.FAILED,
    ]).has(invitation.status),
    canPrepareLink: new Set<CourseInvitationStatus>([
      CourseInvitationStatus.DRAFT,
      CourseInvitationStatus.PENDING,
      CourseInvitationStatus.SENT,
      CourseInvitationStatus.EXPIRED,
      CourseInvitationStatus.FAILED,
    ]).has(invitation.status),
    cancelledAt: formatDate(invitation.cancelledAt),
    cohort: invitation.cohort?.name ?? "Not assigned",
    course: invitation.course.title,
    adminCourseHref: `/admin/courses/${invitation.courseId}`,
    courseHref: `/learn/courses/${invitation.course.slug}`,
    createdAt: formatDate(invitation.createdAt),
    createdBy: invitation.invitedBy.fullName,
    email: invitation.invitedEmail,
    expiresAt: formatDate(invitation.expiresAt),
    history: history.map((entry) => ({
      action: entry.actionType,
      actor: entry.actor.fullName,
      createdAt: formatDate(entry.createdAt),
      description: entry.description,
    })),
    id: invitation.id,
    activatedUserId: invitation.activatedUser?.id ?? null,
    activatedUserHref: invitation.activatedUser
      ? `/admin/users/${invitation.activatedUser.id}`
      : null,
    courseAssignmentId: invitation.courseAssignment?.isActive
      ? invitation.courseAssignment.id
      : null,
    courseId: invitation.courseId,
    invitedName: invitation.invitedName,
    invitedRoleOrPosition: invitation.invitedRoleOrPosition,
    organization: invitation.organization.name,
    sentAt: formatDate(invitation.sentAt),
    status: displayStatus({
      courseId: invitation.courseId,
      enrollments: invitation.activatedUser?.enrollments ?? [],
      expiresAt: invitation.expiresAt,
      status: invitation.status,
    }),
    version: invitation.courseVersion
      ? `Version ${invitation.courseVersion.versionNumber}`
      : "No version",
  };
}

export function getTrustedCourseInvitationOrigin() {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim();
  if (!configured) {
    return null;
  }

  try {
    const url = new URL(configured);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(isLocal && url.protocol === "http:")) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

function deliveryUrl(origin: string, plaintextToken: string) {
  const url = new URL("/course-invitations/start", origin);
  url.searchParams.set("token", plaintextToken);
  return url.toString();
}

export async function createAdminCourseInvitation(input: {
  cohortId?: string | null;
  courseId: string;
  courseVersionId: string;
  expiresAt?: Date;
  invitedEmail: string;
  invitedName: string;
  invitedRoleOrPosition?: string | null;
  organizationId: string;
  region?: string;
  sendEmail?: typeof sendCourseInvitationEmail;
  session: AuthSession | null;
}): Promise<CourseInvitationDeliveryResult> {
  const origin = getTrustedCourseInvitationOrigin();
  if (!origin) {
    return { code: "missing-app-origin", success: false };
  }

  await requireInvitationManager(input.session);
  const [organization, course] = await Promise.all([
    prisma.organization.findFirst({
      select: { name: true, region: true },
      where: { id: input.organizationId, status: OrganizationStatus.ACTIVE },
    }),
    prisma.course.findFirst({
      select: { title: true },
      where: {
        archivedAt: null,
        id: input.courseId,
        status: CourseStatus.PUBLISHED,
        visibility: isControlledHubAccess()
          ? { in: [CourseVisibility.ASSIGNED_ONLY, CourseVisibility.PUBLIC] }
          : CourseVisibility.ASSIGNED_ONLY,
      },
    }),
  ]);
  if (!organization) {
    return { code: "unknown-organization", success: false };
  }
  if (!course) {
    return { code: "unknown-course", success: false };
  }
  const expectedRegion = organization.region && isControlledRegion(organization.region)
    ? organization.region
    : "Other / not listed";
  if (input.region !== undefined && (!isControlledRegion(input.region) || input.region !== expectedRegion)) {
    return { code: "invalid-region", success: false };
  }

  const result = await createManagedCourseInvitation({
    ...input,
    expiresAt: isControlledHubAccess()
      ? createCourseInvitationExpiry()
      : input.expiresAt,
  });
  if (!result.success) {
    return result;
  }
  if (!result.plaintextToken) {
    return { code: "unavailable", success: false };
  }

  const email = await (input.sendEmail ?? sendCourseInvitationEmail)({
    courseTitle: course.title,
    email: input.invitedEmail.trim().toLowerCase(),
    invitationUrl: deliveryUrl(origin, result.plaintextToken),
    invitedName: input.invitedName.trim(),
  });
  const deliveryStatus = email.delivered
    ? await markManagedCourseInvitationSent({
        invitationId: result.invitation.id,
        session: input.session,
      })
    : await markCourseInvitationFailed({
        invitationId: result.invitation.id,
        session: input.session,
      });
  if (!deliveryStatus.success) {
    return deliveryStatus;
  }

  return {
    delivered: email.delivered,
    invitation: deliveryStatus.invitation,
    summary: {
      courseTitle: course.title,
      invitedEmail: input.invitedEmail.trim().toLowerCase(),
      invitedName: input.invitedName.trim(),
      organizationName: organization.name,
    },
    success: true,
  };
}

export async function prepareAdminCourseInvitationLink(input: {
  expiresAt?: Date;
  invitationId: string;
  sendEmail?: typeof sendCourseInvitationEmail;
  session: AuthSession | null;
}): Promise<CourseInvitationDeliveryResult> {
  const origin = getTrustedCourseInvitationOrigin();
  if (!origin) {
    return { code: "missing-app-origin", success: false };
  }

  const current = await prisma.courseInvitation.findUnique({
    include: {
      course: { select: { title: true } },
      organization: { select: { name: true } },
    },
    where: { id: input.invitationId },
  });
  if (!current) {
    return { code: "not-found", success: false };
  }

  const result = await prepareManagedCourseInvitationResend({
    ...input,
    expiresAt: isControlledHubAccess()
      ? createCourseInvitationExpiry()
      : input.expiresAt,
  });
  if (!result.success) {
    return result;
  }
  if (!result.plaintextToken) {
    return { code: "unavailable", success: false };
  }

  const email = await (input.sendEmail ?? sendCourseInvitationEmail)({
    courseTitle: current.course.title,
    email: current.invitedEmail,
    invitationUrl: deliveryUrl(origin, result.plaintextToken),
    invitedName: current.invitedName,
  });
  const deliveryStatus = email.delivered
    ? await markManagedCourseInvitationSent({
        invitationId: result.invitation.id,
        session: input.session,
      })
    : await markCourseInvitationFailed({
        invitationId: result.invitation.id,
        session: input.session,
      });
  if (!deliveryStatus.success) {
    return deliveryStatus;
  }

  return {
    delivered: email.delivered,
    invitation: deliveryStatus.invitation,
    summary: {
      courseTitle: current.course.title,
      invitedEmail: current.invitedEmail,
      invitedName: current.invitedName,
      organizationName: current.organization.name,
    },
    success: true,
  };
}

function displayStatus(input: {
  courseId: string;
  enrollments: Array<{
    courseId: string;
    progressPercent: number;
    status: EnrollmentStatus;
  }>;
  expiresAt: Date;
  status: CourseInvitationStatus;
}): AdminCourseInvitationDisplayStatus {
  if (input.status === CourseInvitationStatus.ACTIVATED) {
    const enrollment = input.enrollments.find(
      (record) => record.courseId === input.courseId,
    );
    if (
      enrollment?.status === EnrollmentStatus.COMPLETED ||
      (enrollment?.progressPercent ?? 0) >= 100
    ) {
      return "COMPLETED";
    }
    return enrollment ? "IN_PROGRESS" : "ACTIVATED";
  }
  if (input.status === CourseInvitationStatus.CANCELLED) {
    return "CANCELLED";
  }
  if (input.status === CourseInvitationStatus.FAILED) {
    return "DELIVERY_FAILED";
  }
  if (
    input.status === CourseInvitationStatus.EXPIRED ||
    input.expiresAt.getTime() <= Date.now()
  ) {
    return "INVITATION_EXPIRED";
  }
  return "INVITED";
}
