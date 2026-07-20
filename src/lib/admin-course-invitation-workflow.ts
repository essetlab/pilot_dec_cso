import {
  CourseInvitationStatus,
  CourseStatus,
  CourseVisibility,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import type { AuthSession } from "./auth/session-codec";
import { isControlledRegion } from "./controlled-options";
import {
  createManagedCourseInvitation,
  prepareManagedCourseInvitationResend,
} from "./course-invitation-workflow";
import { prisma } from "./prisma";

const LIST_LIMIT = 100;
const INVITATION_STATUSES = new Set(Object.values(CourseInvitationStatus));

export type AdminCourseInvitationFilters = {
  cohortId?: string;
  courseId?: string;
  created?: "7d" | "30d" | "90d" | "all";
  organizationId?: string;
  query?: string;
  status?: string;
};

export type CourseInvitationDeliveryResult =
  | {
      code: string;
      success: false;
    }
  | {
      deliveryUrl: string;
      invitation: {
        expiresAt: Date;
        id: string;
        status: CourseInvitationStatus;
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
        visibility: CourseVisibility.ASSIGNED_ONLY,
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
    ...(status && INVITATION_STATUSES.has(status as CourseInvitationStatus)
      ? { status: status as CourseInvitationStatus }
      : {}),
  };

  const [records, total, options] = await Promise.all([
    prisma.courseInvitation.findMany({
      include: {
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

  return {
    filters,
    limit: LIST_LIMIT,
    options,
    records: records.map((record) => ({
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
      status: record.status,
      version: record.courseVersion
        ? `Version ${record.courseVersion.versionNumber}`
        : "No version",
    })),
    total,
  };
}

export async function getAdminCourseInvitationDetail(
  invitationId: string,
  session: AuthSession | null,
) {
  await requireInvitationManager(session);

  const invitation = await prisma.courseInvitation.findUnique({
    include: {
      activatedUser: { select: { fullName: true } },
      cohort: { select: { name: true } },
      course: { select: { slug: true, title: true } },
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
    canConfirmDelivery: new Set<CourseInvitationStatus>([
      CourseInvitationStatus.DRAFT,
      CourseInvitationStatus.PENDING,
    ]).has(invitation.status),
    canPrepareLink: new Set<CourseInvitationStatus>([
      CourseInvitationStatus.DRAFT,
      CourseInvitationStatus.SENT,
      CourseInvitationStatus.FAILED,
    ]).has(invitation.status),
    cancelledAt: formatDate(invitation.cancelledAt),
    cohort: invitation.cohort?.name ?? "Not assigned",
    course: invitation.course.title,
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
    invitedName: invitation.invitedName,
    invitedRoleOrPosition: invitation.invitedRoleOrPosition,
    organization: invitation.organization.name,
    sentAt: formatDate(invitation.sentAt),
    status: invitation.status,
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
  const url = new URL("/course-invitations/accept", origin);
  url.searchParams.set("token", plaintextToken);
  return url.toString();
}

export async function createAdminCourseInvitation(input: {
  cohortId?: string | null;
  courseId: string;
  courseVersionId: string;
  expiresAt: Date;
  invitedEmail: string;
  invitedName: string;
  invitedRoleOrPosition?: string | null;
  organizationId: string;
  region?: string;
  session: AuthSession | null;
}): Promise<CourseInvitationDeliveryResult> {
  const origin = getTrustedCourseInvitationOrigin();
  if (!origin) {
    return { code: "missing-app-origin", success: false };
  }

  await requireInvitationManager(input.session);
  const organization = await prisma.organization.findFirst({
    select: { region: true },
    where: { id: input.organizationId, status: OrganizationStatus.ACTIVE },
  });
  if (!organization) {
    return { code: "unknown-organization", success: false };
  }
  const expectedRegion = organization.region && isControlledRegion(organization.region)
    ? organization.region
    : "Other / not listed";
  if (input.region !== undefined && (!isControlledRegion(input.region) || input.region !== expectedRegion)) {
    return { code: "invalid-region", success: false };
  }

  const result = await createManagedCourseInvitation(input);
  if (!result.success) {
    return result;
  }
  if (!result.plaintextToken) {
    return { code: "unavailable", success: false };
  }

  return {
    deliveryUrl: deliveryUrl(origin, result.plaintextToken),
    invitation: result.invitation,
    success: true,
  };
}

export async function prepareAdminCourseInvitationLink(input: {
  expiresAt: Date;
  invitationId: string;
  session: AuthSession | null;
}): Promise<CourseInvitationDeliveryResult> {
  const origin = getTrustedCourseInvitationOrigin();
  if (!origin) {
    return { code: "missing-app-origin", success: false };
  }

  const result = await prepareManagedCourseInvitationResend(input);
  if (!result.success) {
    return result;
  }
  if (!result.plaintextToken) {
    return { code: "unavailable", success: false };
  }

  return {
    deliveryUrl: deliveryUrl(origin, result.plaintextToken),
    invitation: result.invitation,
    success: true,
  };
}
