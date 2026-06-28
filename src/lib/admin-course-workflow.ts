import {
  AuditActionType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  OrganizationStatus,
  UserStatus,
} from "../generated/prisma/enums";
import { canAccessAdmin } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";
import { cleanPresentationEmail, cleanPresentationText } from "./presentation-text";
import { getReviewCourseDetail, type ReviewCourseSummary } from "./review-workflow";

export type AdminCourseListItem = {
  capacityArea: string;
  certificateEligible: string;
  creator: string;
  href: string;
  lastUpdated: string;
  level: string;
  lessons: string;
  publishedAt: string;
  resources: string;
  status: string;
  statusTone: "blue" | "green" | "gray" | "orange" | "red" | "purple" | "gold";
  title: string;
  visibility: string;
};

export type AdminCourseListData = {
  courses: AdminCourseListItem[];
  filterOptions: {
    capacityAreas: { id: string; label: string }[];
    creators: { id: string; label: string }[];
    statuses: { id: string; label: string }[];
  };
  filters: Required<AdminCourseFilters>;
  metrics: {
    draft: number;
    published: number;
    readyForReview: number;
    total: number;
  };
  selectedCourse: AdminCourseListItem | null;
};

export type AdminCourseFilters = {
  capacityArea?: string;
  certificate?: string;
  creator?: string;
  query?: string;
  status?: string;
};

export type AdminCourseDetail = {
  assignments: AdminCourseAssignmentItem[];
  course: ReviewCourseSummary;
  description: string;
  longDescription: string;
  outcomes: string[];
  targetAudience: string;
  versionSummary: {
    blockCount: number;
    lessonCount: number;
    moduleCount: number;
    status: string;
    versionNumber: number | null;
  };
  visibility: string;
};

export type AdminCourseAssignmentTargetType = "USER" | "ORGANIZATION" | "COHORT";

export type AdminCourseAssignmentItem = {
  assignedAt: string;
  assignedBy: string;
  dueDate: string;
  id: string;
  target: string;
  targetHref: string;
  type: AdminCourseAssignmentTargetType;
};

export type AdminCourseAssignmentOptions = {
  cohorts: {
    id: string;
    label: string;
  }[];
  organizations: {
    id: string;
    label: string;
  }[];
  users: {
    id: string;
    label: string;
  }[];
};

export type AdminCourseAssignmentMutationResult = {
  assignmentId?: string;
  code: string;
  courseId?: string;
  success: boolean;
  targetHref?: string;
};

const statusLabels: Record<CourseStatus, string> = {
  APPROVED: "Approved",
  ARCHIVED: "Archived",
  DRAFT: "Draft",
  PUBLISHED: "Published",
  READY_FOR_REVIEW: "Ready for review",
  RETURNED_FOR_REVISION: "Returned for revision",
  UNPUBLISHED: "Unpublished",
};

const statusTones: Record<CourseStatus, AdminCourseListItem["statusTone"]> = {
  APPROVED: "green",
  ARCHIVED: "gray",
  DRAFT: "blue",
  PUBLISHED: "green",
  READY_FOR_REVIEW: "purple",
  RETURNED_FOR_REVISION: "orange",
  UNPUBLISHED: "gray",
};

const levelLabels: Record<CourseLevel, string> = {
  ADVANCED: "Advanced",
  FOUNDATIONAL: "Foundational",
  INTERMEDIATE: "Intermediate",
  INTRODUCTORY: "Introductory",
  MIXED: "Mixed",
};

const visibilityLabels: Record<CourseVisibility, string> = {
  ASSIGNED_ONLY: "Assigned",
  PRIVATE: "Restricted",
  PUBLIC: "Public",
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

function nullableDate(value: string | null | undefined) {
  if (!value) {
    return { date: null as Date | null, valid: true };
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return { date, valid: !Number.isNaN(date.getTime()) };
}

type AdminCourseRecord = Awaited<ReturnType<typeof queryAdminCourses>>[number];

async function queryAdminCourses() {
  return prisma.course.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      assignedCreator: {
        select: {
          fullName: true,
        },
      },
      capacityAreas: {
        select: {
          capacityArea: {
            select: {
              name: true,
            },
          },
        },
        take: 1,
      },
      certificateEligible: true,
      id: true,
      level: true,
      resources: {
        select: { id: true },
        where: { archivedAt: null },
      },
      status: true,
      title: true,
      updatedAt: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        select: {
          modules: {
            select: {
              lessons: {
                select: {
                  contentBlocks: {
                    select: { id: true },
                  },
                  id: true,
                },
              },
            },
          },
          publishedAt: true,
          status: true,
          versionNumber: true,
        },
        take: 1,
      },
      visibility: true,
    },
    where: {
      archivedAt: null,
      status: { not: CourseStatus.ARCHIVED },
    },
  });
}

function latestVersion(record: AdminCourseRecord) {
  return record.versions[0] ?? null;
}

function lessonCount(record: AdminCourseRecord) {
  return latestVersion(record)?.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  ) ?? 0;
}

function mapCourseRecord(record: AdminCourseRecord): AdminCourseListItem {
  const version = latestVersion(record);
  const status = version?.status ?? record.status;

  return {
    capacityArea: record.capacityAreas[0]?.capacityArea.name ?? "No capacity area",
    certificateEligible: record.certificateEligible ? "Yes" : "No",
    creator: cleanPresentationText(record.assignedCreator.fullName),
    href: `/admin/courses/${record.id}`,
    lastUpdated: formatDate(record.updatedAt),
    level: levelLabels[record.level],
    lessons: String(lessonCount(record)),
    publishedAt: formatDate(version?.publishedAt ?? null),
    resources: String(record.resources.length),
    status: statusLabels[status],
    statusTone: statusTones[status],
    title: record.title,
    visibility: visibilityLabels[record.visibility],
  };
}

export async function getAdminCourseListData(
  session: AuthSession | null,
  filters: AdminCourseFilters = {},
): Promise<AdminCourseListData> {
  const selectedFilters: Required<AdminCourseFilters> = {
    capacityArea: filters.capacityArea ?? "",
    certificate: filters.certificate ?? "",
    creator: filters.creator ?? "",
    query: filters.query ?? "",
    status: filters.status ?? "",
  };

  if (!canAccessAdmin(session)) {
    return {
      courses: [],
      filterOptions: { capacityAreas: [], creators: [], statuses: [] },
      filters: selectedFilters,
      metrics: {
        draft: 0,
        published: 0,
        readyForReview: 0,
        total: 0,
      },
      selectedCourse: null,
    };
  }

  const records = await queryAdminCourses();
  const courses = records.map(mapCourseRecord);
  const query = selectedFilters.query.trim().toLowerCase();
  const filteredCourses = courses.filter((course) => {
    const searchable = [
      course.title,
      course.creator,
      course.capacityArea,
      course.level,
      course.status,
      course.visibility,
    ].join(" ").toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!selectedFilters.status || course.status === selectedFilters.status) &&
      (!selectedFilters.capacityArea || course.capacityArea === selectedFilters.capacityArea) &&
      (!selectedFilters.creator || course.creator === selectedFilters.creator) &&
      (!selectedFilters.certificate ||
        (selectedFilters.certificate === "eligible" && course.certificateEligible === "Yes") ||
        (selectedFilters.certificate === "none" && course.certificateEligible === "No"))
    );
  });

  return {
    courses: filteredCourses,
    filterOptions: {
      capacityAreas: Array.from(new Set(courses.map((course) => course.capacityArea)))
        .sort()
        .map((value) => ({ id: value, label: value })),
      creators: Array.from(new Set(courses.map((course) => course.creator)))
        .sort()
        .map((value) => ({ id: value, label: value })),
      statuses: Array.from(new Set(courses.map((course) => course.status)))
        .sort()
        .map((value) => ({ id: value, label: value })),
    },
    filters: selectedFilters,
    metrics: {
      draft: records.filter((course) => course.status === CourseStatus.DRAFT).length,
      published: records.filter((course) => course.status === CourseStatus.PUBLISHED).length,
      readyForReview: records.filter((course) => course.status === CourseStatus.READY_FOR_REVIEW).length,
      total: records.length,
    },
    selectedCourse: filteredCourses[0] ?? null,
  };
}

export async function getAdminCourseDetail(
  courseIdOrSlug: string,
  session: AuthSession | null,
): Promise<AdminCourseDetail | null> {
  if (!canAccessAdmin(session)) {
    return null;
  }

  const [reviewDetail, course] = await Promise.all([
    getReviewCourseDetail(courseIdOrSlug, session),
    prisma.course.findFirst({
      select: {
        learningOutcomes: {
          orderBy: { order: "asc" },
          select: { statement: true },
        },
        assignments: {
          orderBy: { assignedAt: "desc" },
          select: {
            assignedAt: true,
            assignedBy: { select: { fullName: true } },
            assignmentType: true,
            dueDate: true,
            id: true,
            targetCohort: { select: { id: true, name: true } },
            targetOrganization: { select: { id: true, name: true } },
            targetUser: { select: { fullName: true, id: true } },
          },
          where: { isActive: true },
        },
        id: true,
        longDescription: true,
        shortDescription: true,
        status: true,
        targetAudience: true,
        versions: {
          orderBy: { versionNumber: "desc" },
          select: {
            modules: {
              select: {
                lessons: {
                  select: {
                    contentBlocks: {
                      select: { id: true },
                    },
                    id: true,
                  },
                },
              },
            },
            status: true,
            versionNumber: true,
          },
          take: 1,
        },
        visibility: true,
      },
      where: {
        OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }],
        archivedAt: null,
      },
    }),
  ]);

  if (!reviewDetail || !course) {
    return null;
  }

  const version = course.versions[0] ?? null;
  const detailLessonCount =
    version?.modules.reduce((total, module) => total + module.lessons.length, 0) ?? 0;
  const detailBlockCount =
    version?.modules.reduce(
      (moduleTotal, module) =>
        moduleTotal +
        module.lessons.reduce(
          (lessonTotal, lesson) => lessonTotal + lesson.contentBlocks.length,
          0,
        ),
      0,
    ) ?? 0;

  return {
    assignments: course.assignments.map((assignment) => {
      const type = assignment.assignmentType as AdminCourseAssignmentTargetType;
      const target = assignment.targetUser
        ? cleanPresentationText(assignment.targetUser.fullName)
        : assignment.targetOrganization?.name ?? assignment.targetCohort?.name ?? "Unknown target";
      const targetHref = assignment.targetUser
        ? `/admin/users/${assignment.targetUser.id}`
        : assignment.targetOrganization
          ? `/admin/organizations/${assignment.targetOrganization.id}`
          : assignment.targetCohort
            ? `/admin/cohorts/${assignment.targetCohort.id}`
            : `/admin/courses/${course.id}`;

      return {
        assignedAt: formatDate(assignment.assignedAt),
        assignedBy: cleanPresentationText(assignment.assignedBy.fullName),
        dueDate: formatDate(assignment.dueDate),
        id: assignment.id,
        target,
        targetHref,
        type,
      };
    }),
    course: reviewDetail.course,
    description: course.shortDescription,
    longDescription: course.longDescription ?? course.shortDescription,
    outcomes: course.learningOutcomes.map((outcome) => outcome.statement),
    targetAudience: course.targetAudience ?? "Not specified",
    versionSummary: {
      blockCount: detailBlockCount,
      lessonCount: detailLessonCount,
      moduleCount: version?.modules.length ?? 0,
      status: version ? statusLabels[version.status] : statusLabels[course.status],
      versionNumber: version?.versionNumber ?? null,
    },
    visibility: visibilityLabels[course.visibility],
  };
}

export async function getAdminCourseAssignmentOptions(
  session: AuthSession | null,
): Promise<AdminCourseAssignmentOptions> {
  if (!canAccessAdmin(session)) {
    return { cohorts: [], organizations: [], users: [] };
  }

  const [users, organizations, cohorts] = await Promise.all([
    prisma.user.findMany({
      orderBy: { fullName: "asc" },
      select: {
        email: true,
        fullName: true,
        id: true,
        organization: { select: { name: true } },
      },
      where: { status: UserStatus.ACTIVE },
    }),
    prisma.organization.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, region: true },
      where: { status: { not: OrganizationStatus.ARCHIVED } },
    }),
    prisma.cohort.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, region: true },
      where: { status: { not: OrganizationStatus.ARCHIVED } },
    }),
  ]);

  return {
    cohorts: cohorts.map((cohort) => ({
      id: cohort.id,
      label: cohort.region ? `${cohort.name} (${cohort.region})` : cohort.name,
    })),
    organizations: organizations.map((organization) => ({
      id: organization.id,
      label: organization.region
        ? `${organization.name} (${organization.region})`
        : organization.name,
    })),
    users: users.map((user) => ({
      id: user.id,
      label: user.organization?.name
        ? `${cleanPresentationText(user.fullName)} (${user.organization.name})`
        : `${cleanPresentationText(user.fullName)} (${cleanPresentationEmail(user.email)})`,
    })),
  };
}

async function resolveActorUser(session: AuthSession | null) {
  if (!canAccessAdmin(session)) {
    return null;
  }

  return prisma.user.findFirst({
    select: { id: true },
    where: {
      OR: [{ id: session?.userId }, { email: session?.email }],
    },
  });
}

function targetWhere(targetType: AdminCourseAssignmentTargetType, targetId: string) {
  if (targetType === "USER") {
    return { targetUserId: targetId };
  }

  if (targetType === "ORGANIZATION") {
    return { targetOrganizationId: targetId };
  }

  return { targetCohortId: targetId };
}

function targetData(targetType: AdminCourseAssignmentTargetType, targetId: string) {
  return {
    targetCohortId: targetType === "COHORT" ? targetId : null,
    targetOrganizationId: targetType === "ORGANIZATION" ? targetId : null,
    targetUserId: targetType === "USER" ? targetId : null,
  };
}

async function resolveAssignmentTarget(
  targetType: AdminCourseAssignmentTargetType,
  targetId: string,
) {
  if (targetType === "USER") {
    const user = await prisma.user.findUnique({
      select: { fullName: true, id: true },
      where: { id: targetId },
    });

    return user
      ? { href: `/admin/users/${user.id}`, id: user.id, label: cleanPresentationText(user.fullName) }
      : null;
  }

  if (targetType === "ORGANIZATION") {
    const organization = await prisma.organization.findUnique({
      select: { id: true, name: true },
      where: { id: targetId },
    });

    return organization
      ? {
          href: `/admin/organizations/${organization.id}`,
          id: organization.id,
          label: organization.name,
        }
      : null;
  }

  const cohort = await prisma.cohort.findUnique({
    select: { id: true, name: true },
    where: { id: targetId },
  });

  return cohort
    ? { href: `/admin/cohorts/${cohort.id}`, id: cohort.id, label: cohort.name }
    : null;
}

export async function assignAdminCourse({
  courseId,
  dueDate,
  session,
  targetId,
  targetType,
}: {
  courseId: string;
  dueDate?: string | null;
  session: AuthSession | null;
  targetId: string;
  targetType: AdminCourseAssignmentTargetType;
}): Promise<AdminCourseAssignmentMutationResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", courseId, success: false };
  }

  if (!["USER", "ORGANIZATION", "COHORT"].includes(targetType)) {
    return { code: "invalid-assignment-type", courseId, success: false };
  }

  const parsedDueDate = nullableDate(dueDate);
  if (!parsedDueDate.valid) {
    return { code: "invalid-due-date", courseId, success: false };
  }

  const [course, target] = await Promise.all([
    prisma.course.findFirst({
      select: { id: true, title: true },
      where: { archivedAt: null, id: courseId },
    }),
    resolveAssignmentTarget(targetType, targetId),
  ]);

  if (!course) {
    return { code: "course-not-found", courseId, success: false };
  }

  if (!target) {
    return { code: "assignment-target-not-found", courseId, success: false };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.courseAssignment.findFirst({
      select: { id: true, isActive: true },
      where: {
        assignmentType: targetType,
        courseId,
        ...targetWhere(targetType, targetId),
      },
    });

    if (existing?.isActive) {
      return {
        assignmentId: existing.id,
        code: "course-assignment-already-active",
        courseId,
        success: true,
        targetHref: target.href,
      };
    }

    const assignment = existing
      ? await tx.courseAssignment.update({
          data: {
            assignedAt: new Date(),
            assignedById: actor.id,
            dueDate: parsedDueDate.date,
            isActive: true,
          },
          select: { id: true },
          where: { id: existing.id },
        })
      : await tx.courseAssignment.create({
          data: {
            assignedById: actor.id,
            assignmentType: targetType,
            courseId,
            dueDate: parsedDueDate.date,
            ...targetData(targetType, targetId),
          },
          select: { id: true },
        });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COURSE_UPDATED,
        actorUserId: actor.id,
        description: `Assigned ${course.title} to ${target.label}.`,
        entityId: courseId,
        entityType: "Course",
        metadataJson: {
          assignmentId: assignment.id,
          assignmentType: targetType,
          targetId,
          targetLabel: target.label,
        },
      },
    });

    return {
      assignmentId: assignment.id,
      code: "course-assigned",
      courseId,
      success: true,
      targetHref: target.href,
    };
  });
}

export async function deactivateAdminCourseAssignment({
  assignmentId,
  session,
}: {
  assignmentId: string;
  session: AuthSession | null;
}): Promise<AdminCourseAssignmentMutationResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { assignmentId, code: "unauthorized", success: false };
  }

  return prisma.$transaction(async (tx) => {
    const assignment = await tx.courseAssignment.findUnique({
      select: {
        assignmentType: true,
        course: { select: { id: true, title: true } },
        id: true,
        isActive: true,
        targetCohort: { select: { id: true, name: true } },
        targetOrganization: { select: { id: true, name: true } },
        targetUser: { select: { fullName: true, id: true } },
      },
      where: { id: assignmentId },
    });

    if (!assignment) {
      return { assignmentId, code: "course-assignment-not-found", success: false };
    }

    if (!assignment.isActive) {
      return {
        assignmentId,
        code: "course-assignment-already-inactive",
        courseId: assignment.course.id,
        success: true,
      };
    }

    await tx.courseAssignment.update({
      data: { isActive: false },
      where: { id: assignmentId },
    });

    const target =
      assignment.targetUser?.fullName ??
      assignment.targetOrganization?.name ??
      assignment.targetCohort?.name ??
      "Unknown target";

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COURSE_UPDATED,
        actorUserId: actor.id,
        description: `Removed ${assignment.course.title} assignment from ${target}.`,
        entityId: assignment.course.id,
        entityType: "Course",
        metadataJson: {
          assignmentId,
          assignmentType: assignment.assignmentType,
          target,
        },
      },
    });

    return {
      assignmentId,
      code: "course-assignment-removed",
      courseId: assignment.course.id,
      success: true,
    };
  });
}
