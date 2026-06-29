import {
  CertificateStatus,
  CourseStatus,
  EnrollmentStatus,
  FeedbackType,
  OrganizationStatus,
  QuizAttemptStatus,
  UserStatus,
} from "../generated/prisma/enums";
import { canAccessAdmin } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";

export type PilotMonitoringSummary = {
  activeLearners: number;
  certificatesIssued: number;
  failedAttempts: number;
  feedbackSubmitted: number;
  finalAssessmentAttempts: number;
  learnersCompleted: number;
  learnersInProgress: number;
  learnersNotStarted: number;
  organizations: number;
  passedAttempts: number;
  registeredLearners: number;
  totalEnrollments: number;
};

export type PilotMonitoringCourseSummary = {
  averageClarityRating: string;
  averageEaseOfUseRating: string;
  averageOverallRating: string;
  averageProgress: string;
  averageUsefulnessRating: string;
  certificatesIssued: number;
  completedLearners: number;
  courseTitle: string;
  enrolledLearners: number;
  feedbackSubmitted: number;
  startedLearners: number;
};

export type PilotMonitoringData = {
  courseSummaries: PilotMonitoringCourseSummary[];
  generatedAt: string;
  summary: PilotMonitoringSummary;
};

const emptyPilotMonitoringData: PilotMonitoringData = {
  courseSummaries: [],
  generatedAt: new Date(0).toISOString(),
  summary: {
    activeLearners: 0,
    certificatesIssued: 0,
    failedAttempts: 0,
    feedbackSubmitted: 0,
    finalAssessmentAttempts: 0,
    learnersCompleted: 0,
    learnersInProgress: 0,
    learnersNotStarted: 0,
    organizations: 0,
    passedAttempts: 0,
    registeredLearners: 0,
    totalEnrollments: 0,
  },
};

function average(values: Array<number | null>) {
  const numeric = values.filter((value): value is number => typeof value === "number");

  if (numeric.length === 0) {
    return "N/A";
  }

  return (numeric.reduce((total, value) => total + value, 0) / numeric.length).toFixed(1);
}

function averagePercent(values: number[]) {
  if (values.length === 0) {
    return "N/A";
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return `${Math.round(total / values.length)}%`;
}

function isStarted(enrollment: {
  lastAccessedAt: Date | null;
  progressPercent: number;
  startedAt: Date | null;
  status: EnrollmentStatus;
}) {
  return (
    enrollment.progressPercent > 0 ||
    enrollment.startedAt !== null ||
    enrollment.lastAccessedAt !== null ||
    enrollment.status === EnrollmentStatus.IN_PROGRESS ||
    enrollment.status === EnrollmentStatus.COMPLETED
  );
}

function isCompleted(enrollment: {
  progressPercent: number;
  status: EnrollmentStatus;
}) {
  return enrollment.status === EnrollmentStatus.COMPLETED || enrollment.progressPercent >= 100;
}

function isInProgress(enrollment: {
  lastAccessedAt: Date | null;
  progressPercent: number;
  startedAt: Date | null;
  status: EnrollmentStatus;
}) {
  return isStarted(enrollment) && !isCompleted(enrollment);
}

export async function getPilotMonitoringData(
  session: AuthSession | null,
): Promise<PilotMonitoringData> {
  if (!canAccessAdmin(session)) {
    return emptyPilotMonitoringData;
  }

  const [
    registeredLearners,
    organizations,
    enrollments,
    attempts,
    certificates,
    feedback,
    courses,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        roleAssignments: { some: { isActive: true, role: { key: "PARTICIPANT" } } },
        status: { in: [UserStatus.ACTIVE, UserStatus.INVITED] },
      },
    }),
    prisma.organization.count({
      where: { status: OrganizationStatus.ACTIVE },
    }),
    prisma.enrollment.findMany({
      select: {
        courseId: true,
        lastAccessedAt: true,
        progressPercent: true,
        startedAt: true,
        status: true,
        userId: true,
      },
    }),
    prisma.quizAttempt.findMany({
      select: {
        courseId: true,
        passed: true,
        status: true,
      },
      where: {
        quiz: { isFinalTest: true },
        status: {
          in: [
            QuizAttemptStatus.SUBMITTED,
            QuizAttemptStatus.PASSED,
            QuizAttemptStatus.FAILED,
          ],
        },
      },
    }),
    prisma.certificate.findMany({
      select: {
        courseId: true,
        userId: true,
      },
      where: { status: CertificateStatus.ISSUED },
    }),
    prisma.feedback.findMany({
      select: {
        clarityRating: true,
        courseId: true,
        easeOfUseRating: true,
        rating: true,
        usefulnessRating: true,
        userId: true,
      },
      where: {
        courseId: { not: null },
        type: FeedbackType.COURSE_FEEDBACK,
      },
    }),
    prisma.course.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
      },
      where: {
        archivedAt: null,
        status: CourseStatus.PUBLISHED,
      },
    }),
  ]);

  const activeLearnerIds = new Set(
    enrollments.filter(isStarted).map((enrollment) => enrollment.userId),
  );
  const completedLearnerIds = new Set(
    enrollments.filter(isCompleted).map((enrollment) => enrollment.userId),
  );
  const inProgressLearnerIds = new Set(
    enrollments.filter(isInProgress).map((enrollment) => enrollment.userId),
  );
  const enrolledLearnerIds = new Set(enrollments.map((enrollment) => enrollment.userId));
  const notStartedLearnerIds = new Set(
    enrollments
      .filter((enrollment) => !isStarted(enrollment))
      .map((enrollment) => enrollment.userId),
  );
  const learnersNotStarted = registeredLearners - enrolledLearnerIds.size + notStartedLearnerIds.size;
  const passedAttempts = attempts.filter(
    (attempt) => attempt.passed || attempt.status === QuizAttemptStatus.PASSED,
  ).length;
  const failedAttempts = attempts.filter(
    (attempt) => !attempt.passed && attempt.status === QuizAttemptStatus.FAILED,
  ).length;

  const courseSummaries = courses.map((course) => {
    const courseEnrollments = enrollments.filter(
      (enrollment) => enrollment.courseId === course.id,
    );
    const courseCertificates = certificates.filter(
      (certificate) => certificate.courseId === course.id,
    );
    const courseFeedback = feedback.filter((entry) => entry.courseId === course.id);

    return {
      averageClarityRating: average(courseFeedback.map((entry) => entry.clarityRating)),
      averageEaseOfUseRating: average(
        courseFeedback.map((entry) => entry.easeOfUseRating),
      ),
      averageOverallRating: average(courseFeedback.map((entry) => entry.rating)),
      averageProgress: averagePercent(
        courseEnrollments.map((enrollment) => enrollment.progressPercent),
      ),
      averageUsefulnessRating: average(
        courseFeedback.map((entry) => entry.usefulnessRating),
      ),
      certificatesIssued: courseCertificates.length,
      completedLearners: courseEnrollments.filter(isCompleted).length,
      courseTitle: course.title,
      enrolledLearners: courseEnrollments.length,
      feedbackSubmitted: courseFeedback.length,
      startedLearners: courseEnrollments.filter(isStarted).length,
    };
  });

  return {
    courseSummaries,
    generatedAt: new Date().toISOString(),
    summary: {
      activeLearners: activeLearnerIds.size,
      certificatesIssued: certificates.length,
      failedAttempts,
      feedbackSubmitted: feedback.length,
      finalAssessmentAttempts: attempts.length,
      learnersCompleted: completedLearnerIds.size,
      learnersInProgress: inProgressLearnerIds.size,
      learnersNotStarted: Math.max(0, learnersNotStarted),
      organizations,
      passedAttempts,
      registeredLearners,
      totalEnrollments: enrollments.length,
    },
  };
}
