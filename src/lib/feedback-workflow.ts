import {
  CourseStatus,
  FeedbackType,
  LessonProgressStatus,
} from "../generated/prisma/enums";
import { canAccessAdmin, canAccessLearner, canAccessMonitoring } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";
import { hasLearnerCourseEntitlement } from "./course-entitlement";

export type CourseFeedbackState = {
  attemptsCount: number;
  existingFeedback?: {
    certificateProcessRating: number | null;
    consentToUseAnonymizedFeedback: boolean;
    contentClarityRating: number | null;
    easeOfUseRating: number | null;
    improvementSuggestion: string;
    mostUseful: string;
    overallRating: number | null;
    technicalIssue: string;
    usefulnessRating: number | null;
  };
  existingFeedbackId: string | null;
  lessonsComplete: boolean;
  message: string;
  status: "eligible" | "locked" | "submitted";
  submittedAt: string | null;
};

export type FeedbackSubmissionInput = {
  certificateProcessRating: number | null;
  consentToUseAnonymizedFeedback: boolean;
  contentClarityRating: number | null;
  courseSlug: string;
  easeOfUseRating: number | null;
  improvementSuggestion: string;
  mostUseful: string;
  overallRating: number | null;
  session: AuthSession | null;
  technicalIssue: string;
  usefulnessRating: number | null;
};

export type FeedbackSubmissionResult = {
  code:
    | "created"
    | "invalid-course"
    | "invalid-rating"
    | "locked"
    | "not-enrolled"
    | "updated"
    | "unauthorized";
  error?: string;
  feedbackId?: string;
  success: boolean;
};

export type FeedbackSummaryCourse = {
  accessibilityIssues: number;
  averageClarity: string;
  averageRating: string;
  averageUsefulness: string;
  courseId: string;
  courseTitle: string;
  feedbackCount: number;
  latestFeedbackAt: string | null;
};

export type FeedbackSummaryComment = {
  comment: string;
  courseTitle: string;
  createdAt: string;
  rating: number | null;
};

export type FeedbackSummaryData = {
  averageClarity: string;
  averageRating: string;
  averageUsefulness: string;
  courses: FeedbackSummaryCourse[];
  recentComments: FeedbackSummaryComment[];
  showComments: boolean;
  totalAccessibilityIssues: number;
  totalFeedback: number;
};

export type FeedbackSummaryFilters = {
  cohortId?: string;
  courseId?: string;
  dateRange?: "30d" | "quarter" | "year" | "all";
  organizationId?: string;
};

type FeedbackContext =
  | {
      code: "ok";
      attemptsCount: number;
      courseId: string;
      existingFeedback: {
        certificateProcessRating: number | null;
        clarityRating: number | null;
        consentToUseAnonymizedFeedback: boolean;
        easeOfUseRating: number | null;
        id: string;
        createdAt: Date;
        improvementSuggestion: string | null;
        mostUseful: string | null;
        rating: number | null;
        technicalIssue: string | null;
        usefulnessRating: number | null;
        updatedAt: Date;
      } | null;
      enrollmentId: string;
      lessonsComplete: boolean;
      userId: string;
    }
  | {
      code: "invalid-course" | "not-enrolled" | "unauthorized";
      message: string;
    };

function isRating(value: number | null) {
  return Number.isInteger(value) && value !== null && value >= 1 && value <= 5;
}

function average(values: Array<number | null>) {
  const numericValues = values.filter((value): value is number => typeof value === "number");
  if (numericValues.length === 0) {
    return "N/A";
  }

  const total = numericValues.reduce((sum, value) => sum + value, 0);
  return (total / numericValues.length).toFixed(1);
}

function normalizeDateRange(value: FeedbackSummaryFilters["dateRange"]) {
  return value && ["30d", "quarter", "year", "all"].includes(value) ? value : "all";
}

function rangeStart(value: Required<FeedbackSummaryFilters>["dateRange"]) {
  const now = new Date();
  if (value === "all") {
    return null;
  }

  if (value === "year") {
    return new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  }

  if (value === "quarter") {
    const quarterStartMonth = Math.floor(now.getUTCMonth() / 3) * 3;
    return new Date(Date.UTC(now.getUTCFullYear(), quarterStartMonth, 1));
  }

  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - 30);
  return start;
}

function feedbackStateFromContext(context: Extract<FeedbackContext, { code: "ok" }>): CourseFeedbackState {
  if (context.existingFeedback) {
    return {
      attemptsCount: context.attemptsCount,
      existingFeedback: {
        certificateProcessRating: context.existingFeedback.certificateProcessRating,
        consentToUseAnonymizedFeedback:
          context.existingFeedback.consentToUseAnonymizedFeedback,
        contentClarityRating: context.existingFeedback.clarityRating,
        easeOfUseRating: context.existingFeedback.easeOfUseRating,
        improvementSuggestion: context.existingFeedback.improvementSuggestion ?? "",
        mostUseful: context.existingFeedback.mostUseful ?? "",
        overallRating: context.existingFeedback.rating,
        technicalIssue: context.existingFeedback.technicalIssue ?? "",
        usefulnessRating: context.existingFeedback.usefulnessRating,
      },
      existingFeedbackId: context.existingFeedback.id,
      lessonsComplete: context.lessonsComplete,
      message: "Your feedback has been submitted for this course. You can update it if needed.",
      status: "submitted",
      submittedAt: context.existingFeedback.updatedAt.toISOString(),
    };
  }

  if (!context.lessonsComplete && context.attemptsCount === 0) {
    return {
      attemptsCount: context.attemptsCount,
      existingFeedbackId: null,
      lessonsComplete: context.lessonsComplete,
      message: "Complete the course lessons or take the final test before submitting feedback.",
      status: "locked",
      submittedAt: null,
    };
  }

  return {
    attemptsCount: context.attemptsCount,
    existingFeedbackId: null,
    lessonsComplete: context.lessonsComplete,
    message: "Feedback is available for this course.",
    status: "eligible",
    submittedAt: null,
  };
}

async function resolveCourseFeedbackContext(
  courseSlug: string,
  session: AuthSession | null,
): Promise<FeedbackContext> {
  if (!courseSlug || !session || !canAccessLearner(session)) {
    return { code: "unauthorized", message: "Sign in with learner access to submit feedback." };
  }

  const dbUser = await prisma.user.findUnique({
    select: {
      id: true,
      organizationId: true,
      primaryCohortId: true,
    },
    where: { id: session.userId },
  });

  if (!dbUser) {
    return { code: "unauthorized", message: "User account was not found." };
  }

  const course = await prisma.course.findUnique({
    select: {
      archivedAt: true,
      id: true,
      slug: true,
      status: true,
      visibility: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        select: { id: true },
        take: 1,
        where: { status: CourseStatus.PUBLISHED },
      },
    },
    where: { slug: courseSlug },
  });

  const latestVersion = course?.versions[0];
  if (!course || course.archivedAt || course.status !== CourseStatus.PUBLISHED || !latestVersion) {
    return { code: "invalid-course", message: "Course is not available for feedback." };
  }

  if (!(await hasLearnerCourseEntitlement({
    courseId: course.id,
    courseSlug: course.slug,
    organizationId: dbUser.organizationId,
    primaryCohortId: dbUser.primaryCohortId,
    userId: dbUser.id,
    visibility: course.visibility,
  }))) {
    return { code: "unauthorized", message: "This course is not assigned to your account." };
  }

  const enrollment = await prisma.enrollment.findUnique({
    include: {
      lessonProgress: {
        select: { status: true },
      },
    },
    where: {
      userId_courseVersionId: {
        courseVersionId: latestVersion.id,
        userId: dbUser.id,
      },
    },
  });

  if (!enrollment) {
    return { code: "not-enrolled", message: "Enroll in the course before submitting feedback." };
  }

  const completedLessons = enrollment.lessonProgress.filter(
    (progress) => progress.status === LessonProgressStatus.COMPLETED,
  ).length;
  const lessonsComplete =
    enrollment.lessonProgress.length > 0 && completedLessons === enrollment.lessonProgress.length;

  const [attemptsCount, existingFeedback] = await Promise.all([
    prisma.quizAttempt.count({
      where: {
        courseVersionId: latestVersion.id,
        userId: dbUser.id,
      },
    }),
    prisma.feedback.findFirst({
      orderBy: { createdAt: "desc" },
      where: {
        courseId: course.id,
        type: FeedbackType.COURSE_FEEDBACK,
        userId: dbUser.id,
      },
      select: {
        certificateProcessRating: true,
        clarityRating: true,
        consentToUseAnonymizedFeedback: true,
        createdAt: true,
        easeOfUseRating: true,
        id: true,
        improvementSuggestion: true,
        mostUseful: true,
        rating: true,
        technicalIssue: true,
        updatedAt: true,
        usefulnessRating: true,
      },
    }),
  ]);

  return {
    attemptsCount,
    code: "ok",
    courseId: course.id,
    enrollmentId: enrollment.id,
    existingFeedback,
    lessonsComplete,
    userId: dbUser.id,
  };
}

export async function getCourseFeedbackState(
  courseSlug: string,
  session: AuthSession | null,
): Promise<CourseFeedbackState> {
  const context = await resolveCourseFeedbackContext(courseSlug, session);

  if (context.code !== "ok") {
    return {
      attemptsCount: 0,
      existingFeedbackId: null,
      lessonsComplete: false,
      message: context.message,
      status: "locked",
      submittedAt: null,
    };
  }

  return feedbackStateFromContext(context);
}

export async function submitCourseFeedback(
  input: FeedbackSubmissionInput,
): Promise<FeedbackSubmissionResult> {
  const context = await resolveCourseFeedbackContext(input.courseSlug, input.session);

  if (context.code !== "ok") {
    return { code: context.code, error: context.message, success: false };
  }

  const state = feedbackStateFromContext(context);
  if (state.status === "locked") {
    return { code: "locked", error: state.message, success: false };
  }

  if (
    !isRating(input.overallRating) ||
    !isRating(input.usefulnessRating) ||
    !isRating(input.easeOfUseRating) ||
    !isRating(input.contentClarityRating) ||
    (input.certificateProcessRating !== null && !isRating(input.certificateProcessRating))
  ) {
    return {
      code: "invalid-rating",
      error: "Please complete required rating fields.",
      success: false,
    };
  }

  const mostUseful = input.mostUseful.trim().slice(0, 1200);
  const improvementSuggestion = input.improvementSuggestion.trim().slice(0, 1200);
  const technicalIssue = input.technicalIssue.trim().slice(0, 1200);
  const commentParts = [
    mostUseful ? `Most useful: ${mostUseful}` : "",
    improvementSuggestion ? `Improve: ${improvementSuggestion}` : "",
    technicalIssue ? `Technical issue: ${technicalIssue}` : "",
  ].filter(Boolean);
  const comment = commentParts.join("\n\n").slice(0, 2000);

  const data = {
    accessibilityIssue: false,
    certificateProcessRating: input.certificateProcessRating,
    clarityRating: input.contentClarityRating,
    comment: comment || null,
    consentToUseAnonymizedFeedback: input.consentToUseAnonymizedFeedback,
    courseId: context.courseId,
    easeOfUseRating: input.easeOfUseRating,
    enrollmentId: context.enrollmentId,
    improvementSuggestion: improvementSuggestion || null,
    mostUseful: mostUseful || null,
    rating: input.overallRating,
    technicalIssue: technicalIssue || null,
    type: FeedbackType.COURSE_FEEDBACK,
    usefulnessRating: input.usefulnessRating,
    userId: context.userId,
  };

  const feedback = state.existingFeedbackId
    ? await prisma.feedback.update({
        data,
        select: { id: true },
        where: { id: state.existingFeedbackId },
      })
    : await prisma.feedback.create({
        data,
        select: { id: true },
      });

  return {
    code: state.existingFeedbackId ? "updated" : "created",
    feedbackId: feedback.id,
    success: true,
  };
}

export async function getFeedbackSummaryData(
  session: AuthSession | null,
  filters: FeedbackSummaryFilters = {},
): Promise<FeedbackSummaryData> {
  const canSeeSummary = canAccessMonitoring(session);
  const showComments = canAccessAdmin(session);

  if (!canSeeSummary) {
    return {
      averageClarity: "N/A",
      averageRating: "N/A",
      averageUsefulness: "N/A",
      courses: [],
      recentComments: [],
      showComments: false,
      totalAccessibilityIssues: 0,
      totalFeedback: 0,
    };
  }

  const selectedDateRange = normalizeDateRange(filters.dateRange);
  const startedAt = rangeStart(selectedDateRange);

  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      accessibilityIssue: true,
      clarityRating: true,
      comment: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      courseId: true,
      createdAt: true,
      rating: true,
      usefulnessRating: true,
    },
    where: {
      courseId: { not: null },
      type: FeedbackType.COURSE_FEEDBACK,
      ...(filters.courseId ? { courseId: filters.courseId } : {}),
      ...(startedAt ? { createdAt: { gte: startedAt } } : {}),
      ...(filters.organizationId || filters.cohortId
        ? {
            user: {
              ...(filters.organizationId ? { organizationId: filters.organizationId } : {}),
              ...(filters.cohortId ? { primaryCohortId: filters.cohortId } : {}),
            },
          }
        : {}),
    },
  });

  const grouped = new Map<string, typeof feedback>();
  for (const entry of feedback) {
    if (!entry.courseId || !entry.course) {
      continue;
    }

    grouped.set(entry.courseId, [...(grouped.get(entry.courseId) ?? []), entry]);
  }

  const courses = Array.from(grouped.entries())
    .map(([courseId, entries]) => ({
      accessibilityIssues: entries.filter((entry) => entry.accessibilityIssue).length,
      averageClarity: average(entries.map((entry) => entry.clarityRating)),
      averageRating: average(entries.map((entry) => entry.rating)),
      averageUsefulness: average(entries.map((entry) => entry.usefulnessRating)),
      courseId,
      courseTitle: entries[0]?.course?.title ?? "Course",
      feedbackCount: entries.length,
      latestFeedbackAt: entries[0]?.createdAt.toISOString() ?? null,
    }))
    .sort((left, right) => right.feedbackCount - left.feedbackCount);

  return {
    averageClarity: average(feedback.map((entry) => entry.clarityRating)),
    averageRating: average(feedback.map((entry) => entry.rating)),
    averageUsefulness: average(feedback.map((entry) => entry.usefulnessRating)),
    courses,
    recentComments: showComments
      ? feedback
          .filter((entry) => entry.comment && entry.course)
          .slice(0, 5)
          .map((entry) => ({
            comment: entry.comment ?? "",
            courseTitle: entry.course?.title ?? "Course",
            createdAt: entry.createdAt.toISOString(),
            rating: entry.rating,
          }))
      : [],
    showComments,
    totalAccessibilityIssues: feedback.filter((entry) => entry.accessibilityIssue).length,
    totalFeedback: feedback.length,
  };
}
