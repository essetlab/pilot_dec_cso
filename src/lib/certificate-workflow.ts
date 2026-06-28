import {
  CertificateStatus,
  CourseStatus,
  CourseVisibility,
  EnrollmentStatus,
} from "../generated/prisma/enums";
import { canAccessAdmin } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import {
  CERTIFICATE_PASS_THRESHOLD,
  CERTIFICATE_PASS_THRESHOLD_LABEL,
  formatCertificateThresholdRule,
} from "./demo-data";
import { cleanPresentationText } from "./presentation-text";
import { prisma } from "./prisma";

export type CertificateRecordStatus = "Issued" | "Locked";

export type LearnerCertificateSummary = {
  certificateCode: string | null;
  certificateHref: string;
  courseHref: string;
  courseTitle: string;
  issuedAt: string;
  participantName: string;
  status: CertificateRecordStatus;
};

export type LearnerCertificateListData = {
  certificates: LearnerCertificateSummary[];
  metrics: {
    earned: number;
    eligible: number;
    inProgress: number;
    requiredPassScore: string;
  };
};

export type LearnerCertificateDetailData = {
  certificateCode: string | null;
  completionDate: string | null;
  courseHref: string;
  courseSlug: string;
  courseTitle: string;
  finalTestHref: string;
  issuedAt: string | null;
  issuerName: string;
  participantName: string;
  passThresholdLabel: string;
  passThresholdRule: string;
  status: CertificateRecordStatus;
};

export type AdminCertificateRow = {
  certificateCode: string;
  courseTitle: string;
  href: string;
  issuedAt: string;
  organization: string;
  participant: string;
  status: string;
};

export type AdminCertificateListData = {
  certificates: AdminCertificateRow[];
  metrics: {
    issued: number;
    eligible: number;
    pendingCompletion: number;
    requiredPassScore: string;
  };
};

export type AdminCertificateDetailData = AdminCertificateRow & {
  completionDate: string | null;
  issuerName: string;
  passThresholdLabel: string;
  quizPercentage: string;
  quizScore: string;
};

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

function certificateKey(certificate: { certificateCode: string }) {
  return encodeURIComponent(certificate.certificateCode);
}

async function getSessionUser(session: AuthSession | null) {
  if (!session?.email) {
    return null;
  }

  return prisma.user.findUnique({
    select: {
      email: true,
      fullName: true,
      id: true,
      organization: {
        select: {
          name: true,
        },
      },
    },
    where: { email: session.email },
  });
}

function mapIssuedCertificate(certificate: {
  certificateCode: string;
  completionDate: Date | null;
  course: { slug: string; title: string };
  courseTitleSnapshot: string | null;
  issuedAt: Date;
  issuerNameSnapshot: string | null;
  participantNameSnapshot: string | null;
}): LearnerCertificateDetailData {
  return {
    certificateCode: cleanPresentationText(certificate.certificateCode),
    completionDate: formatDate(certificate.completionDate),
    courseHref: `/learn/courses/${certificate.course.slug}`,
    courseSlug: certificate.course.slug,
    courseTitle: certificate.courseTitleSnapshot ?? certificate.course.title,
    finalTestHref: `/learn/courses/${certificate.course.slug}/final-test`,
    issuedAt: formatDate(certificate.issuedAt),
    issuerName:
      certificate.issuerNameSnapshot ?? "DEC / WHH CSF+ CSO Learning Hub",
    participantName: cleanPresentationText(certificate.participantNameSnapshot ?? "Participant"),
    passThresholdLabel: CERTIFICATE_PASS_THRESHOLD_LABEL,
    passThresholdRule: formatCertificateThresholdRule(),
    status: "Issued",
  };
}

export async function getLearnerCertificateListData(
  session: AuthSession | null,
): Promise<LearnerCertificateListData> {
  const user = await getSessionUser(session);
  if (!user) {
    return {
      certificates: [],
      metrics: {
        earned: 0,
        eligible: 0,
        inProgress: 0,
        requiredPassScore: CERTIFICATE_PASS_THRESHOLD_LABEL,
      },
    };
  }

  const [certificates, eligibleCourses, inProgressEnrollments] = await Promise.all([
    prisma.certificate.findMany({
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
        participantNameSnapshot: true,
        status: true,
      },
      where: {
        status: CertificateStatus.ISSUED,
        userId: user.id,
      },
    }),
    prisma.course.count({
      where: {
        archivedAt: null,
        certificateEligible: true,
        status: CourseStatus.PUBLISHED,
        visibility: {
          in: [CourseVisibility.PUBLIC, CourseVisibility.ASSIGNED_ONLY],
        },
      },
    }),
    prisma.enrollment.count({
      where: {
        status: EnrollmentStatus.IN_PROGRESS,
        userId: user.id,
      },
    }),
  ]);

  return {
    certificates: certificates.map((certificate) => ({
      certificateCode: cleanPresentationText(certificate.certificateCode),
      certificateHref: `/learn/certificates/${certificateKey(certificate)}`,
      courseHref: `/learn/courses/${certificate.course.slug}`,
      courseTitle: certificate.courseTitleSnapshot ?? certificate.course.title,
      issuedAt: formatDate(certificate.issuedAt),
      participantName: cleanPresentationText(certificate.participantNameSnapshot ?? user.fullName),
      status: "Issued",
    })),
    metrics: {
      earned: certificates.length,
      eligible: eligibleCourses,
      inProgress: inProgressEnrollments,
      requiredPassScore: CERTIFICATE_PASS_THRESHOLD_LABEL,
    },
  };
}

export async function getLearnerCertificateDetailData(
  certificateIdOrSlug: string,
  session: AuthSession | null,
): Promise<LearnerCertificateDetailData | null> {
  const user = await getSessionUser(session);
  if (!user) {
    return null;
  }

  const decoded = decodeURIComponent(certificateIdOrSlug);
  const issuedCertificate = await prisma.certificate.findFirst({
    select: {
      certificateCode: true,
      completionDate: true,
      course: {
        select: {
          slug: true,
          title: true,
        },
      },
      courseTitleSnapshot: true,
      issuedAt: true,
      issuerNameSnapshot: true,
      participantNameSnapshot: true,
    },
    where: {
      OR: [
        { id: certificateIdOrSlug },
        { certificateCode: decoded },
        { course: { slug: certificateIdOrSlug } },
      ],
      status: CertificateStatus.ISSUED,
      userId: user.id,
    },
  });

  if (issuedCertificate) {
    return mapIssuedCertificate(issuedCertificate);
  }

  const lockedCourse = await prisma.course.findFirst({
    select: {
      slug: true,
      title: true,
    },
    where: {
      archivedAt: null,
      certificateEligible: true,
      slug: certificateIdOrSlug,
      status: CourseStatus.PUBLISHED,
      visibility: {
        in: [CourseVisibility.PUBLIC, CourseVisibility.ASSIGNED_ONLY],
      },
    },
  });

  if (!lockedCourse) {
    return null;
  }

  return {
    certificateCode: null,
    completionDate: null,
    courseHref: `/learn/courses/${lockedCourse.slug}`,
    courseSlug: lockedCourse.slug,
    courseTitle: lockedCourse.title,
    finalTestHref: `/learn/courses/${lockedCourse.slug}/final-test`,
    issuedAt: null,
    issuerName: "DEC / WHH CSF+ CSO Learning Hub",
    participantName: cleanPresentationText(user.fullName),
    passThresholdLabel: CERTIFICATE_PASS_THRESHOLD_LABEL,
    passThresholdRule: formatCertificateThresholdRule(),
    status: "Locked",
  };
}

export async function getAdminCertificateListData(
  session: AuthSession | null,
): Promise<AdminCertificateListData> {
  if (!canAccessAdmin(session)) {
    return {
      certificates: [],
      metrics: {
        eligible: 0,
        issued: 0,
        pendingCompletion: 0,
        requiredPassScore: CERTIFICATE_PASS_THRESHOLD_LABEL,
      },
    };
  }

  const [certificates, eligibleEnrollments, pendingCompletion] = await Promise.all([
    prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
      select: {
        certificateCode: true,
        course: {
          select: {
            title: true,
          },
        },
        courseTitleSnapshot: true,
        issuedAt: true,
        participantNameSnapshot: true,
        status: true,
        user: {
          select: {
            fullName: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      where: { status: CertificateStatus.ISSUED },
    }),
    prisma.enrollment.count({
      where: {
        course: { certificateEligible: true },
        progressPercent: { gte: 100 },
        status: EnrollmentStatus.COMPLETED,
      },
    }),
    prisma.enrollment.count({
      where: {
        course: { certificateEligible: true },
        status: { not: EnrollmentStatus.COMPLETED },
      },
    }),
  ]);

  return {
    certificates: certificates.map((certificate) => ({
      certificateCode: cleanPresentationText(certificate.certificateCode),
      courseTitle: certificate.courseTitleSnapshot ?? certificate.course.title,
      href: `/admin/certificates/${certificateKey(certificate)}`,
      issuedAt: formatDate(certificate.issuedAt),
      organization: certificate.user.organization?.name ?? "Not assigned",
      participant:
        cleanPresentationText(certificate.participantNameSnapshot ?? certificate.user.fullName),
      status: certificate.status === CertificateStatus.ISSUED ? "Issued" : certificate.status,
    })),
    metrics: {
      eligible: eligibleEnrollments,
      issued: certificates.length,
      pendingCompletion,
      requiredPassScore: CERTIFICATE_PASS_THRESHOLD_LABEL,
    },
  };
}

export async function getAdminCertificateDetailData(
  certificateIdOrCode: string,
  session: AuthSession | null,
): Promise<AdminCertificateDetailData | null> {
  if (!canAccessAdmin(session)) {
    return null;
  }

  const decoded = decodeURIComponent(certificateIdOrCode);
  const certificate = await prisma.certificate.findFirst({
    select: {
      certificateCode: true,
      completionDate: true,
      course: {
        select: { title: true },
      },
      courseTitleSnapshot: true,
      issuedAt: true,
      issuerNameSnapshot: true,
      participantNameSnapshot: true,
      quizAttempt: {
        select: {
          maxScore: true,
          percentage: true,
          score: true,
        },
      },
      status: true,
      user: {
        select: {
          fullName: true,
          organization: {
            select: { name: true },
          },
        },
      },
    },
    where: {
      OR: [{ id: certificateIdOrCode }, { certificateCode: decoded }],
    },
  });

  if (!certificate) {
    return null;
  }

  const percentage =
    certificate.quizAttempt.percentage === null
      ? "Not recorded"
      : `${Math.round(certificate.quizAttempt.percentage)}%`;

  return {
    certificateCode: cleanPresentationText(certificate.certificateCode),
    completionDate: formatDate(certificate.completionDate),
    courseTitle: certificate.courseTitleSnapshot ?? certificate.course.title,
    href: `/admin/certificates/${certificateKey(certificate)}`,
    issuedAt: formatDate(certificate.issuedAt),
    issuerName:
      certificate.issuerNameSnapshot ?? "DEC / WHH CSF+ CSO Learning Hub",
    organization: certificate.user.organization?.name ?? "Not assigned",
    participant:
      cleanPresentationText(certificate.participantNameSnapshot ?? certificate.user.fullName),
    passThresholdLabel: `${CERTIFICATE_PASS_THRESHOLD}%`,
    quizPercentage: percentage,
    quizScore: `${certificate.quizAttempt.score}/${certificate.quizAttempt.maxScore}`,
    status:
      certificate.status === CertificateStatus.ISSUED ? "Issued" : certificate.status,
  };
}
