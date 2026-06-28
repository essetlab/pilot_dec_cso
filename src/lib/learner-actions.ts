"use server";

import { prisma } from "./prisma";
import { getCurrentSession } from "./auth/server";
import {
  LessonProgressStatus,
  EnrollmentStatus,
  CourseStatus,
  CourseVisibility,
  QuizAttemptStatus,
  CertificateStatus,
} from "../generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { submitCourseFeedback } from "./feedback-workflow";

export type ActionState = {
  success: boolean;
  error?: string;
};

export async function markLessonCompleteAction(
  formData: FormData,
): Promise<ActionState> {
  try {
    const courseSlug = formData.get("courseSlug") as string;
    const lessonId = formData.get("lessonId") as string;

    if (!courseSlug || !lessonId) {
      return { success: false, error: "Missing required fields" };
    }

    // 1. Authenticated session exists
    const session = await getCurrentSession();
    if (!session) {
      return { success: false, error: "Unauthorized: No active session" };
    }

    // 2. DB User exists
    const dbUser = await prisma.user.findUnique({
      where: { email: session.email },
    });
    if (!dbUser) {
      return { success: false, error: "Unauthorized: User not found" };
    }

    // 3. Course exists
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        versions: {
          where: { status: CourseStatus.PUBLISHED },
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
      },
    });

    if (!course || course.archivedAt) {
      return { success: false, error: "Course not found" };
    }

    // 4. Latest published version exists
    const latestVersion = course.versions[0];
    if (!latestVersion) {
      return { success: false, error: "No published version available" };
    }

    // 5. Learner still has access to the course (visibility constraints)
    if (course.visibility === CourseVisibility.ASSIGNED_ONLY) {
      const orConditions = [
        { targetUserId: dbUser.id },
        ...(dbUser.primaryCohortId ? [{ targetCohortId: dbUser.primaryCohortId }] : []),
        ...(dbUser.organizationId ? [{ targetOrganizationId: dbUser.organizationId }] : []),
      ];

      const assignment = await prisma.courseAssignment.findFirst({
        where: {
          courseId: course.id,
          isActive: true,
          OR: orConditions,
        },
      });

      if (!assignment) {
        return { success: false, error: "Access denied: No active assignment" };
      }
    } else if (course.visibility === CourseVisibility.PRIVATE) {
      return { success: false, error: "Access denied: Course is private" };
    }

    // 6. Enrollment exists, belongs to the current user, and is for the latest published course version
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseVersionId: {
          userId: dbUser.id,
          courseVersionId: latestVersion.id,
        },
      },
      include: {
        lessonProgress: true,
      },
    });

    if (!enrollment) {
      return { success: false, error: "Enrollment not found for this course version" };
    }

    // Get all lessons from this published version in order
    const modules = await prisma.module.findMany({
      where: { courseVersionId: latestVersion.id },
      orderBy: { order: "asc" },
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
      },
    });

    const allLessons = modules.flatMap((m) => m.lessons);

    // 7. Target lesson belongs to that same published version (not from another course/version)
    const targetLesson = allLessons.find((l) => l.id === lessonId);
    if (!targetLesson) {
      return { success: false, error: "Lesson does not belong to this course version" };
    }

    // 8. Target lesson is the first incomplete lesson
    const progressMap = new Map(enrollment.lessonProgress.map((lp) => [lp.lessonId, lp]));
    const firstIncompleteLesson = allLessons.find((l) => {
      const progress = progressMap.get(l.id);
      return !progress || progress.status !== LessonProgressStatus.COMPLETED;
    });

    if (!firstIncompleteLesson) {
      return { success: false, error: "All lessons are already completed" };
    }

    if (firstIncompleteLesson.id !== lessonId) {
      return { success: false, error: "Lesson must be completed in sequential order" };
    }

    const currentProgressRow = progressMap.get(lessonId);
    if (!currentProgressRow) {
      return { success: false, error: "Lesson progress record not found" };
    }

    // Update LessonProgress and Enrollment in transaction
    await prisma.$transaction(async (tx) => {
      // Update lesson progress status, completedAt and lastAccessedAt
      await tx.lessonProgress.update({
        where: { id: currentProgressRow.id },
        data: {
          status: LessonProgressStatus.COMPLETED,
          completedAt: new Date(),
          lastAccessedAt: new Date(),
        },
      });

      const allProgressRows = await tx.lessonProgress.findMany({
        where: { enrollmentId: enrollment.id },
      });

      const completedCount = allProgressRows.filter(
        (lp) =>
          lp.id === currentProgressRow.id || lp.status === LessonProgressStatus.COMPLETED,
      ).length;
      const totalCount = allProgressRows.length;
      const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      const isFullyCompleted = completedCount === totalCount;

      await tx.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progressPercent,
          status: isFullyCompleted ? EnrollmentStatus.COMPLETED : EnrollmentStatus.IN_PROGRESS,
          completedAt: isFullyCompleted ? new Date() : null,
          lastAccessedAt: new Date(),
        },
      });
    });

    // Revalidate paths to refresh learner rendering content
    try {
      revalidatePath(`/learn/courses/${courseSlug}`);
      revalidatePath(`/learn`);
      revalidatePath(`/learn/my-courses`);
    } catch {
      // Gracefully handle Next.js static generation store missing in offline/script tests
    }

    return { success: true };
  } catch (error) {
    console.error("Error in markLessonCompleteAction:", error);
    return { success: false, error: "An internal server error occurred" };
  }
}

export async function submitFinalTestAttemptAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string; attempt?: {
  id: string;
  status: string;
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
  passed: boolean;
  submittedAt: string | null;
} }> {
  try {
    const courseSlug = formData.get("courseSlug") as string;
    const quizId = formData.get("quizId") as string;
    const answersJson = formData.get("answersJson") as string;

    if (!courseSlug || !quizId || !answersJson) {
      return { success: false, error: "Missing required fields" };
    }

    // 1. Authenticated session exists
    const session = await getCurrentSession();
    if (!session) {
      return { success: false, error: "Unauthorized: No active session" };
    }

    // 2. DB User exists
    const dbUser = await prisma.user.findUnique({
      where: { email: session.email },
    });
    if (!dbUser) {
      return { success: false, error: "Unauthorized: User not found" };
    }

    // 3. Course exists and is published
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        versions: {
          where: { status: CourseStatus.PUBLISHED },
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
      },
    });

    if (!course || course.archivedAt) {
      return { success: false, error: "Course not found" };
    }

    // 4. Latest published version exists
    const latestVersion = course.versions[0];
    if (!latestVersion) {
      return { success: false, error: "No published version available" };
    }

    // 5. Learner still has access to the course (visibility constraints)
    if (course.visibility === CourseVisibility.ASSIGNED_ONLY) {
      const orConditions = [
        { targetUserId: dbUser.id },
        ...(dbUser.primaryCohortId ? [{ targetCohortId: dbUser.primaryCohortId }] : []),
        ...(dbUser.organizationId ? [{ targetOrganizationId: dbUser.organizationId }] : []),
      ];

      const assignment = await prisma.courseAssignment.findFirst({
        where: {
          courseId: course.id,
          isActive: true,
          OR: orConditions,
        },
      });

      if (!assignment) {
        return { success: false, error: "Access denied: No active assignment" };
      }
    } else if (course.visibility === CourseVisibility.PRIVATE) {
      return { success: false, error: "Access denied: Course is private" };
    }

    // 6. Enrollment exists and belongs to the current user
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseVersionId: {
          userId: dbUser.id,
          courseVersionId: latestVersion.id,
        },
      },
    });

    if (!enrollment) {
      return { success: false, error: "Access denied: Not enrolled in this course version" };
    }

    // 7. Enforce lesson progress is 100%
    const allProgressRows = await prisma.lessonProgress.findMany({
      where: { enrollmentId: enrollment.id },
    });
    const completedCount = allProgressRows.filter(
      (lp) => lp.status === LessonProgressStatus.COMPLETED,
    ).length;
    const totalCount = allProgressRows.length;
    const isComplete = totalCount > 0 && completedCount === totalCount;

    if (!isComplete) {
      return { success: false, error: "Complete all lessons before taking the final test" };
    }

    // 8. Quiz belongs to this version and is the final test
    const quiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
        courseVersionId: latestVersion.id,
        isFinalTest: true,
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) {
      return { success: false, error: "Quiz not found or not associated with this course version" };
    }

    // 9. Enforce attempt limits / retake policy
    const existingAttemptsCount = await prisma.quizAttempt.count({
      where: {
        userId: dbUser.id,
        quizId: quiz.id,
      },
    });

    if (!quiz.retakeAllowed && existingAttemptsCount > 0) {
      return { success: false, error: "Retakes are not allowed for this final test" };
    }

    if (quiz.maxAttempts !== null && quiz.maxAttempts > 0 && existingAttemptsCount >= quiz.maxAttempts) {
      return { success: false, error: "Maximum attempts limit reached" };
    }

    // Parse answers
    let submittedAnswers: Record<string, string> = {};
    try {
      submittedAnswers = JSON.parse(answersJson) || {};
    } catch {
      return { success: false, error: "Invalid answers format" };
    }

    // 10. Validate that learner only submits answers for questions belonging to this quiz
    const quizQuestionIds = new Set(quiz.questions.map((q) => q.id));
    for (const questionId of Object.keys(submittedAnswers)) {
      if (!quizQuestionIds.has(questionId)) {
        return { success: false, error: "Invalid submission: question does not belong to this final test" };
      }
    }

    // 11. Evaluate scoring
    let score = 0;
    for (const question of quiz.questions) {
      const config = question.configJson as { options?: string[]; correctAnswer?: string } | null;
      const submittedAnswer = submittedAnswers[question.id];
      const correctAnswer = config?.correctAnswer;
      const questionPoints = question.points || 1;

      if (submittedAnswer && correctAnswer && submittedAnswer.trim() === correctAnswer.trim()) {
        score += questionPoints;
      }
    }

    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const passed = percentage >= quiz.passThreshold;
    const status = passed ? QuizAttemptStatus.PASSED : QuizAttemptStatus.FAILED;

    // 12. Create and persist attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: dbUser.id,
        courseId: course.id,
        courseVersionId: latestVersion.id,
        status,
        score,
        maxScore,
        percentage,
        passed,
        answersJson: submittedAnswers,
        submittedAt: new Date(),
      },
    });

    // 13. Auto-issue certificate if passed and not already issued
    if (passed) {
      const existingCertificate = await prisma.certificate.findUnique({
        where: {
          userId_courseVersionId: {
            userId: dbUser.id,
            courseVersionId: latestVersion.id,
          },
        },
      });

      if (!existingCertificate) {
        const versionSuffix = latestVersion.id.substring(Math.max(0, latestVersion.id.length - 4)).toUpperCase();
        const userSuffix = dbUser.id.substring(Math.max(0, dbUser.id.length - 4)).toUpperCase();
        const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const certificateCode = `CERT-${versionSuffix}-${userSuffix}-${randSuffix}`;

        await prisma.certificate.create({
          data: {
            certificateCode,
            userId: dbUser.id,
            courseId: course.id,
            courseVersionId: latestVersion.id,
            enrollmentId: enrollment.id,
            quizAttemptId: attempt.id,
            status: CertificateStatus.ISSUED,
            participantNameSnapshot: dbUser.fullName || dbUser.email,
            courseTitleSnapshot: course.title,
            issuerNameSnapshot: "DEC / WHH CSF+ CSO Learning Hub",
            completionDate: new Date(),
          },
        });
      }
    }

    // Revalidate paths
    try {
      revalidatePath(`/learn/courses/${courseSlug}`);
      revalidatePath(`/learn/courses/${courseSlug}/final-test`);
      revalidatePath(`/learn`);
      revalidatePath(`/learn/my-courses`);
      revalidatePath(`/learn/certificates`);
      revalidatePath(`/admin/certificates`);
    } catch {
      // Gracefully handle Next.js cache store missing in offline/script tests
    }

    return {
      success: true,
      attempt: {
        id: attempt.id,
        status: attempt.status,
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        passed: attempt.passed,
        submittedAt: attempt.submittedAt ? attempt.submittedAt.toISOString() : null,
      },
    };
  } catch (error) {
    console.error("Error in submitFinalTestAttemptAction:", error);
    return { success: false, error: "An internal server error occurred" };
  }
}

export async function submitCourseFeedbackAction(
  formData: FormData,
): Promise<ActionState> {
  try {
    const courseSlug = formData.get("courseSlug") as string;
    const rating = parseRating(formData.get("rating"));
    const usefulnessRating = parseRating(formData.get("usefulnessRating"));
    const clarityRating = parseRating(formData.get("clarityRating"));
    const accessibilityIssue = parseAccessibilityIssue(formData.get("accessibilityIssue"));
    const comment = typeof formData.get("comment") === "string" ? String(formData.get("comment")) : "";

    if (!courseSlug) {
      return { success: false, error: "Missing course identifier" };
    }

    const session = await getCurrentSession();
    const result = await submitCourseFeedback({
      accessibilityIssue,
      clarityRating,
      comment,
      courseSlug,
      rating,
      session,
      usefulnessRating,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Revalidate paths
    try {
      revalidatePath(`/learn/courses/${courseSlug}`);
      revalidatePath(`/learn/courses/${courseSlug}/feedback`);
      revalidatePath(`/learn`);
      revalidatePath(`/learn/my-courses`);
      revalidatePath("/admin");
      revalidatePath("/admin/monitoring");
    } catch {
      // Gracefully handle Next.js cache store missing in offline/script tests
    }

    return { success: true };
  } catch (error) {
    console.error("Error in submitCourseFeedbackAction:", error);
    return { success: false, error: "An internal server error occurred" };
  }
}

function parseRating(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : null;
}

function parseAccessibilityIssue(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  if (value === "yes" || value === "true") {
    return true;
  }

  if (value === "no" || value === "false") {
    return false;
  }

  return null;
}
