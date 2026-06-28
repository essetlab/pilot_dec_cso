import {
  AuditActionType,
  CertificateStatus,
  CourseStatus,
  EnrollmentStatus,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import { canAccessAdmin } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import { cleanPresentationText } from "./presentation-text";
import { prisma } from "./prisma";

export type DashboardTone =
  | "blue"
  | "green"
  | "gray"
  | "orange"
  | "red"
  | "purple"
  | "gold";

export type AdminDashboardMetric = {
  helperText: string;
  label: string;
  tone: "blue" | "green" | "gray" | "orange" | "red";
  value: string;
};

export type AdminDashboardAttentionCourse = {
  action: string;
  detail: string;
  href: string;
  id: string;
  status: string;
  title: string;
  tone: DashboardTone;
};

export type AdminDashboardActivity = {
  action: string;
  actor: string;
  description: string;
  entityType: string;
  href: string | null;
  id: string;
  timestamp: string;
  tone: DashboardTone;
};

export type AdminDashboardCertificate = {
  certificateCode: string;
  courseTitle: string;
  href: string;
  id: string;
  issuedAt: string;
  participantName: string;
  status: string;
  tone: DashboardTone;
};

export type AdminDashboardData = {
  attentionCourses: AdminDashboardAttentionCourse[];
  focus: {
    certificatesIssued: string;
    coursesAwaitingReview: string;
    readyItems: string;
  };
  metrics: AdminDashboardMetric[];
  recentActivity: AdminDashboardActivity[];
  recentCertificates: AdminDashboardCertificate[];
};

const courseStatusLabels: Record<CourseStatus, string> = {
  APPROVED: "Approved",
  ARCHIVED: "Archived",
  DRAFT: "Draft",
  PUBLISHED: "Published",
  READY_FOR_REVIEW: "Ready for review",
  RETURNED_FOR_REVISION: "Returned for revision",
  UNPUBLISHED: "Unpublished",
};

const courseStatusTones: Record<CourseStatus, DashboardTone> = {
  APPROVED: "green",
  ARCHIVED: "gray",
  DRAFT: "blue",
  PUBLISHED: "green",
  READY_FOR_REVIEW: "purple",
  RETURNED_FOR_REVISION: "gold",
  UNPUBLISHED: "orange",
};

const actionLabels: Record<AuditActionType, string> = {
  CERTIFICATE_ISSUED: "Certificate issued",
  CERTIFICATE_REVOKED: "Certificate revoked",
  COHORT_CREATED: "Cohort created",
  COHORT_UPDATED: "Cohort updated",
  COURSE_APPROVED: "Course approved",
  COURSE_ARCHIVED: "Course archived",
  COURSE_CREATED: "Course created",
  COURSE_PUBLISHED: "Course published",
  COURSE_RETURNED_FOR_REVISION: "Course returned for revision",
  COURSE_STATUS_CHANGED: "Course status changed",
  COURSE_SUBMITTED_FOR_REVIEW: "Course submitted for review",
  COURSE_UNPUBLISHED: "Course unpublished",
  COURSE_UPDATED: "Course updated",
  LOGIN: "User sign-in",
  LOGOUT: "User sign-out",
  ORGANIZATION_CREATED: "Organization created",
  ORGANIZATION_UPDATED: "Organization updated",
  REFERENCE_DATA_UPDATED: "Reference data updated",
  ROLE_ASSIGNED: "Role assigned",
  ROLE_REMOVED: "Role removed",
  USER_CREATED: "User created",
  USER_DEACTIVATED: "User deactivated",
  USER_UPDATED: "User updated",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function certificateKey(certificate: { certificateCode: string }) {
  return encodeURIComponent(certificate.certificateCode);
}

function getActivityHref(entityType: string, entityId: string) {
  if (entityType === "Course") {
    return `/admin/courses/${entityId}`;
  }

  if (entityType === "User") {
    return `/admin/users/${entityId}`;
  }

  if (entityType === "Organization") {
    return `/admin/organizations/${entityId}`;
  }

  if (entityType === "Cohort") {
    return `/admin/cohorts/${entityId}`;
  }

  if (entityType === "Certificate") {
    return `/admin/certificates/${entityId}`;
  }

  return null;
}

function getActivityTone(actionType: AuditActionType): DashboardTone {
  if (
    actionType === AuditActionType.CERTIFICATE_ISSUED ||
    actionType === AuditActionType.COURSE_APPROVED ||
    actionType === AuditActionType.COURSE_PUBLISHED
  ) {
    return "green";
  }

  if (
    actionType === AuditActionType.COURSE_RETURNED_FOR_REVISION ||
    actionType === AuditActionType.COURSE_UNPUBLISHED ||
    actionType === AuditActionType.COURSE_ARCHIVED ||
    actionType === AuditActionType.USER_DEACTIVATED
  ) {
    return "gold";
  }

  if (actionType.startsWith("COURSE_")) {
    return "purple";
  }

  if (actionType.startsWith("CERTIFICATE_")) {
    return "gold";
  }

  if (actionType === AuditActionType.LOGIN || actionType === AuditActionType.LOGOUT) {
    return "blue";
  }

  return "gray";
}

function attentionAction(status: CourseStatus, courseId: string) {
  if (status === CourseStatus.READY_FOR_REVIEW || status === CourseStatus.APPROVED) {
    return {
      action: status === CourseStatus.APPROVED ? "Open publish gate" : "Open review",
      href: `/admin/review/${courseId}`,
    };
  }

  return {
    action: "View course",
    href: `/admin/courses/${courseId}`,
  };
}

function attentionDetail(status: CourseStatus, creatorName: string, capacityArea: string) {
  if (status === CourseStatus.READY_FOR_REVIEW) {
    return `Submitted by ${creatorName} for review in ${capacityArea}.`;
  }

  if (status === CourseStatus.APPROVED) {
    return `Approved course waiting for an admin publishing decision.`;
  }

  if (status === CourseStatus.RETURNED_FOR_REVISION) {
    return `Returned to ${creatorName} for revision before review can continue.`;
  }

  if (status === CourseStatus.UNPUBLISHED) {
    return `Unpublished course that may need a follow-up decision.`;
  }

  return `Draft course assigned to ${creatorName} in ${capacityArea}.`;
}

async function getDashboardCounts() {
  const [
    totalUsers,
    participants,
    organizations,
    cohorts,
    courses,
    publishedCourses,
    activeEnrollments,
    courseCompletions,
    certificatesIssued,
    coursesAwaitingReview,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        status: {
          not: UserStatus.DEACTIVATED,
        },
      },
    }),
    prisma.user.count({
      where: {
        roleAssignments: {
          some: {
            isActive: true,
            role: {
              key: RoleKey.PARTICIPANT,
            },
          },
        },
        status: {
          not: UserStatus.DEACTIVATED,
        },
      },
    }),
    prisma.organization.count({
      where: {
        status: {
          not: OrganizationStatus.ARCHIVED,
        },
      },
    }),
    prisma.cohort.count({
      where: {
        status: {
          not: OrganizationStatus.ARCHIVED,
        },
      },
    }),
    prisma.course.count({
      where: {
        archivedAt: null,
      },
    }),
    prisma.course.count({
      where: {
        archivedAt: null,
        status: CourseStatus.PUBLISHED,
      },
    }),
    prisma.enrollment.count({
      where: {
        status: EnrollmentStatus.IN_PROGRESS,
      },
    }),
    prisma.enrollment.count({
      where: {
        status: EnrollmentStatus.COMPLETED,
      },
    }),
    prisma.certificate.count({
      where: {
        status: CertificateStatus.ISSUED,
      },
    }),
    prisma.course.count({
      where: {
        archivedAt: null,
        status: {
          in: [CourseStatus.READY_FOR_REVIEW, CourseStatus.APPROVED],
        },
      },
    }),
  ]);

  return {
    activeEnrollments,
    certificatesIssued,
    cohortCount: cohorts,
    courseCompletions,
    courses,
    coursesAwaitingReview,
    organizations,
    participants,
    publishedCourses,
    totalUsers,
  };
}

export async function getAdminDashboardData(
  session: AuthSession | null,
): Promise<AdminDashboardData | null> {
  if (!canAccessAdmin(session)) {
    return null;
  }

  const [counts, attentionCourses, recentActivity, recentCertificates] =
    await Promise.all([
      getDashboardCounts(),
      prisma.course.findMany({
        orderBy: {
          updatedAt: "desc",
        },
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
          id: true,
          status: true,
          title: true,
          updatedAt: true,
        },
        take: 5,
        where: {
          archivedAt: null,
          status: {
            in: [
              CourseStatus.READY_FOR_REVIEW,
              CourseStatus.APPROVED,
              CourseStatus.RETURNED_FOR_REVISION,
              CourseStatus.UNPUBLISHED,
              CourseStatus.DRAFT,
            ],
          },
        },
      }),
      prisma.auditLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          actionType: true,
          actor: {
            select: {
              fullName: true,
            },
          },
          createdAt: true,
          description: true,
          entityId: true,
          entityType: true,
          id: true,
        },
        take: 6,
      }),
      prisma.certificate.findMany({
        orderBy: {
          issuedAt: "desc",
        },
        select: {
          certificateCode: true,
          course: {
            select: {
              title: true,
            },
          },
          courseTitleSnapshot: true,
          id: true,
          issuedAt: true,
          participantNameSnapshot: true,
          status: true,
          user: {
            select: {
              fullName: true,
            },
          },
        },
        take: 3,
        where: {
          status: CertificateStatus.ISSUED,
        },
      }),
    ]);

  const metrics: AdminDashboardMetric[] = [
    {
      helperText: "Active, invited, and suspended platform accounts",
      label: "Total users",
      tone: "blue",
      value: formatNumber(counts.totalUsers),
    },
    {
      helperText: "Registered learning participants",
      label: "Participants",
      tone: "green",
      value: formatNumber(counts.participants),
    },
    {
      helperText: "Active or inactive CSO organization records",
      label: "CSO organizations",
      tone: "blue",
      value: formatNumber(counts.organizations),
    },
    {
      helperText: "Active or inactive learning groups",
      label: "Cohorts",
      tone: "green",
      value: formatNumber(counts.cohortCount),
    },
    {
      helperText: "Non-archived courses across all statuses",
      label: "Total courses",
      tone: "blue",
      value: formatNumber(counts.courses),
    },
    {
      helperText: "Courses currently available after publishing",
      label: "Published courses",
      tone: "green",
      value: formatNumber(counts.publishedCourses),
    },
    {
      helperText: "Participants currently learning",
      label: "Active enrollments",
      tone: "blue",
      value: formatNumber(counts.activeEnrollments),
    },
    {
      helperText: "Enrollments marked complete",
      label: "Course completions",
      tone: "green",
      value: formatNumber(counts.courseCompletions),
    },
    {
      helperText: "Issued learning certificates",
      label: "Certificates issued",
      tone: "green",
      value: formatNumber(counts.certificatesIssued),
    },
    {
      helperText: "Courses waiting for review or publishing",
      label: "Awaiting review",
      tone: counts.coursesAwaitingReview > 0 ? "orange" : "gray",
      value: formatNumber(counts.coursesAwaitingReview),
    },
  ];

  return {
    attentionCourses: attentionCourses.map((course) => {
      const action = attentionAction(course.status, course.id);
      const creatorName = cleanPresentationText(course.assignedCreator.fullName);
      const capacityArea =
        course.capacityAreas[0]?.capacityArea.name ?? "course content";

      return {
        ...action,
        detail: attentionDetail(course.status, creatorName, capacityArea),
        id: course.id,
        status: courseStatusLabels[course.status],
        title: course.title,
        tone: courseStatusTones[course.status],
      };
    }),
    focus: {
      certificatesIssued: formatNumber(counts.certificatesIssued),
      coursesAwaitingReview: formatNumber(counts.coursesAwaitingReview),
      readyItems: formatNumber(
        counts.coursesAwaitingReview + counts.certificatesIssued,
      ),
    },
    metrics,
    recentActivity: recentActivity.map((activity) => ({
      action: actionLabels[activity.actionType],
      actor: cleanPresentationText(activity.actor.fullName),
      description: cleanPresentationText(activity.description),
      entityType: activity.entityType,
      href: getActivityHref(activity.entityType, activity.entityId),
      id: activity.id,
      timestamp: formatDate(activity.createdAt),
      tone: getActivityTone(activity.actionType),
    })),
    recentCertificates: recentCertificates.map((certificate) => ({
      certificateCode: cleanPresentationText(certificate.certificateCode),
      courseTitle: certificate.courseTitleSnapshot ?? certificate.course.title,
      href: `/admin/certificates/${certificateKey(certificate)}`,
      id: certificate.id,
      issuedAt: formatDate(certificate.issuedAt),
      participantName:
        cleanPresentationText(certificate.participantNameSnapshot ?? certificate.user.fullName),
      status:
        certificate.status === CertificateStatus.ISSUED
          ? "Issued"
          : certificate.status,
      tone:
        certificate.status === CertificateStatus.ISSUED ? "green" : "gray",
    })),
  };
}
