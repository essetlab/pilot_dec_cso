import { CertificateStatus, EnrollmentStatus } from "../generated/prisma/enums";
import { ROLE_LABELS, type RoleKey } from "./auth/roles";
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatOptional(value: string | null | undefined) {
  return value?.trim() || "Not provided";
}

function roleLabel(role: string) {
  return ROLE_LABELS[role as RoleKey] ?? role.replaceAll("_", " ");
}

function statusLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export type LearnerProfileCourseSummary = {
  href: string;
  lastAccessedAt: string;
  progressPercent: number;
  status: string;
  title: string;
};

export type LearnerProfileCertificateSummary = {
  certificateCode: string;
  href: string;
  issuedAt: string;
  status: string;
  title: string;
};

export type LearnerProfileData = {
  account: {
    createdAt: string;
    department: string;
    email: string;
    fullName: string;
    jobTitle: string;
    lastActivityAt: string;
    phone: string;
    preferredLanguage: string;
    region: string;
    roles: string[];
    status: string;
  };
  certificates: {
    earned: number;
    revokedOrInactive: number;
    recent: LearnerProfileCertificateSummary[];
  };
  courses: {
    completed: number;
    inProgress: number;
    notStarted: number;
    recent: LearnerProfileCourseSummary[];
    total: number;
  };
  organization: {
    cohortName: string;
    name: string;
    region: string;
    status: string;
  };
};

export async function getLearnerProfileData(
  session: AuthSession | null,
): Promise<LearnerProfileData | null> {
  if (!session?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    include: {
      certificates: {
        orderBy: { issuedAt: "desc" },
        select: {
          certificateCode: true,
          course: {
            select: {
              slug: true,
              title: true,
            },
          },
          courseTitleSnapshot: true,
          issuedAt: true,
          status: true,
        },
        take: 3,
      },
      enrollments: {
        include: {
          course: {
            select: {
              slug: true,
              title: true,
            },
          },
        },
        orderBy: [{ lastAccessedAt: "desc" }, { updatedAt: "desc" }],
        take: 4,
      },
      organization: {
        select: {
          name: true,
          region: true,
          status: true,
        },
      },
      primaryCohort: {
        select: {
          name: true,
        },
      },
      roleAssignments: {
        include: {
          role: {
            select: {
              key: true,
            },
          },
        },
        where: {
          isActive: true,
        },
      },
    },
    where: { email: session.email },
  });

  if (!user) {
    return null;
  }

  const [totalEnrollments, inProgress, completed, notStarted, issuedCertificates, inactiveCertificates] =
    await Promise.all([
      prisma.enrollment.count({ where: { userId: user.id } }),
      prisma.enrollment.count({
        where: { status: EnrollmentStatus.IN_PROGRESS, userId: user.id },
      }),
      prisma.enrollment.count({
        where: { status: EnrollmentStatus.COMPLETED, userId: user.id },
      }),
      prisma.enrollment.count({
        where: { status: EnrollmentStatus.NOT_STARTED, userId: user.id },
      }),
      prisma.certificate.count({
        where: { status: CertificateStatus.ISSUED, userId: user.id },
      }),
      prisma.certificate.count({
        where: {
          status: { in: [CertificateStatus.EXPIRED, CertificateStatus.REVOKED] },
          userId: user.id,
        },
      }),
    ]);

  const latestEnrollmentActivity = user.enrollments
    .map((enrollment) => enrollment.lastAccessedAt ?? enrollment.updatedAt)
    .filter(Boolean)
    .sort((left, right) => right.getTime() - left.getTime())[0];
  const lastActivityAt = latestEnrollmentActivity ?? user.lastLoginAt ?? user.updatedAt;

  return {
    account: {
      createdAt: formatDate(user.createdAt),
      department: formatOptional(user.department),
      email: user.email,
      fullName: user.fullName,
      jobTitle: formatOptional(user.jobTitle),
      lastActivityAt: formatDate(lastActivityAt),
      phone: formatOptional(user.phone),
      preferredLanguage: formatOptional(user.preferredLanguage),
      region: formatOptional(user.region),
      roles: user.roleAssignments.map((assignment) => roleLabel(assignment.role.key)),
      status: statusLabel(user.status),
    },
    certificates: {
      earned: issuedCertificates,
      recent: user.certificates.map((certificate) => ({
        certificateCode: certificate.certificateCode,
        href: `/learn/certificates/${encodeURIComponent(certificate.certificateCode)}`,
        issuedAt: formatDate(certificate.issuedAt),
        status: statusLabel(certificate.status),
        title: certificate.courseTitleSnapshot ?? certificate.course.title,
      })),
      revokedOrInactive: inactiveCertificates,
    },
    courses: {
      completed,
      inProgress,
      notStarted,
      recent: user.enrollments.map((enrollment) => ({
        href: `/learn/courses/${enrollment.course.slug}`,
        lastAccessedAt: formatDate(enrollment.lastAccessedAt ?? enrollment.updatedAt),
        progressPercent: enrollment.progressPercent,
        status: statusLabel(enrollment.status),
        title: enrollment.course.title,
      })),
      total: totalEnrollments,
    },
    organization: {
      cohortName: formatOptional(user.primaryCohort?.name),
      name: formatOptional(user.organization?.name),
      region: formatOptional(user.organization?.region),
      status: user.organization ? statusLabel(user.organization.status) : "Not linked",
    },
  };
}
