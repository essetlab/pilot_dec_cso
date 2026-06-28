import "dotenv/config";

import {
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  EnrollmentStatus,
  FeedbackType,
  LessonProgressStatus,
} from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  getCourseFeedbackState,
  getFeedbackSummaryData,
  submitCourseFeedback,
} from "../src/lib/feedback-workflow";
import { prisma } from "../src/lib/prisma";

const testSlug = "r17-feedback-verification";
const testCourseId = "r17-feedback-verification-course";
const testVersionId = "r17-feedback-verification-version";
const testLessonId = "r17-feedback-verification-lesson";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function sessionFor(user: { email: string; fullName: string | null; id: string }, roles: AuthSession["roles"]): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName ?? user.email,
    roles,
    userId: user.id,
  };
}

async function cleanup() {
  await prisma.course.deleteMany({
    where: {
      OR: [{ id: testCourseId }, { slug: testSlug }],
    },
  });
}

async function createFixture() {
  const [admin, meViewer, creator, completedParticipant, lockedParticipant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "meviewer@demo.local" } }),
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant3@demo.local" } }),
  ]);

  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(meViewer, "Missing seeded M&E Viewer user. Run npm run db:seed first.");
  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(completedParticipant, "Missing seeded completed participant. Run npm run db:seed first.");
  assert(lockedParticipant, "Missing seeded new participant. Run npm run db:seed first.");

  let capacityArea = await prisma.capacityArea.findFirst({
    orderBy: { name: "asc" },
  });

  if (!capacityArea) {
    capacityArea = await prisma.capacityArea.create({
      data: {
        description: "R17 verification capacity area",
        name: "R17 Verification",
        slug: "r17-verification",
      },
    });
  }

  const course = await prisma.course.create({
    data: {
      assignedCreatorId: creator.id,
      capacityGapAddressed: "Verify participant feedback submission.",
      certificateEligible: false,
      createdById: creator.id,
      defaultPassThreshold: 80,
      finalTestRequired: false,
      id: testCourseId,
      intendedPracticeImprovement: "Confirm course teams can read feedback metrics.",
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription: "Temporary course created by R17 verification.",
      shortDescription: "Temporary course created by R17 verification.",
      slug: testSlug,
      status: CourseStatus.PUBLISHED,
      targetAudience: "Verification participants",
      targetCsoProfile: "Verification participants",
      title: "R17 Feedback Verification",
      visibility: CourseVisibility.PUBLIC,
    },
  });

  await prisma.courseCapacityArea.create({
    data: {
      capacityAreaId: capacityArea.id,
      courseId: course.id,
    },
  });

  const version = await prisma.courseVersion.create({
    data: {
      changeNotes: "R17 verification version",
      courseId: course.id,
      createdById: creator.id,
      id: testVersionId,
      publishedAt: new Date(),
      publishedById: admin.id,
      status: CourseStatus.PUBLISHED,
      versionNumber: 1,
    },
  });

  const courseModule = await prisma.module.create({
    data: {
      courseVersionId: version.id,
      order: 1,
      title: "Feedback readiness",
    },
  });

  await prisma.lesson.create({
    data: {
      completionRequired: true,
      id: testLessonId,
      moduleId: courseModule.id,
      order: 1,
      title: "Feedback-ready lesson",
    },
  });

  const completedEnrollment = await prisma.enrollment.create({
    data: {
      completedAt: new Date(),
      courseId: course.id,
      courseVersionId: version.id,
      progressPercent: 100,
      status: EnrollmentStatus.COMPLETED,
      userId: completedParticipant.id,
    },
  });

  await prisma.lessonProgress.create({
    data: {
      completedAt: new Date(),
      enrollmentId: completedEnrollment.id,
      lessonId: testLessonId,
      status: LessonProgressStatus.COMPLETED,
    },
  });

  const lockedEnrollment = await prisma.enrollment.create({
    data: {
      courseId: course.id,
      courseVersionId: version.id,
      progressPercent: 0,
      status: EnrollmentStatus.IN_PROGRESS,
      userId: lockedParticipant.id,
    },
  });

  await prisma.lessonProgress.create({
    data: {
      enrollmentId: lockedEnrollment.id,
      lessonId: testLessonId,
      status: LessonProgressStatus.NOT_STARTED,
    },
  });

  return {
    adminSession: sessionFor(admin, ["PLATFORM_ADMIN"]),
    completedParticipantSession: sessionFor(completedParticipant, ["PARTICIPANT"]),
    lockedParticipantSession: sessionFor(lockedParticipant, ["PARTICIPANT"]),
    meViewerSession: sessionFor(meViewer, ["ME_VIEWER"]),
  };
}

async function feedbackCount() {
  return prisma.feedback.count({
    where: {
      courseId: testCourseId,
      type: FeedbackType.COURSE_FEEDBACK,
    },
  });
}

async function main() {
  console.log("=== R17 Verification: Course Feedback Workflow ===");
  await cleanup();
  const {
    adminSession,
    completedParticipantSession,
    lockedParticipantSession,
    meViewerSession,
  } = await createFixture();

  const initialState = await getCourseFeedbackState(testSlug, completedParticipantSession);
  assert(initialState.status === "eligible", `Expected eligible feedback state, got ${initialState.status}.`);
  console.log("PASS: completed participant can access feedback form.");

  const invalidResult = await submitCourseFeedback({
    accessibilityIssue: false,
    clarityRating: 4,
    comment: "This invalid attempt should not persist.",
    courseSlug: testSlug,
    rating: 6,
    session: completedParticipantSession,
    usefulnessRating: 5,
  });
  assert(!invalidResult.success && invalidResult.code === "invalid-rating", "Expected invalid rating rejection.");
  assert((await feedbackCount()) === 0, "Invalid feedback submission should not create a record.");
  console.log("PASS: invalid rating rejected without persistence.");

  const validResult = await submitCourseFeedback({
    accessibilityIssue: true,
    clarityRating: 4,
    comment: "Useful course, but one handout needs a clearer accessible format.",
    courseSlug: testSlug,
    rating: 5,
    session: completedParticipantSession,
    usefulnessRating: 5,
  });
  assert(validResult.success, `Expected valid feedback submission, got ${validResult.code}.`);
  assert((await feedbackCount()) === 1, "Expected exactly one feedback record after valid submission.");
  console.log("PASS: valid feedback saved with ratings, accessibility issue, and comment.");

  const submittedState = await getCourseFeedbackState(testSlug, completedParticipantSession);
  assert(submittedState.status === "submitted", `Expected submitted feedback state, got ${submittedState.status}.`);
  assert(submittedState.existingFeedbackId, "Submitted state should include existing feedback id.");
  console.log("PASS: existing feedback returns submitted state.");

  const duplicateResult = await submitCourseFeedback({
    accessibilityIssue: false,
    clarityRating: 5,
    comment: "Duplicate submission should not persist.",
    courseSlug: testSlug,
    rating: 5,
    session: completedParticipantSession,
    usefulnessRating: 5,
  });
  assert(!duplicateResult.success && duplicateResult.code === "duplicate", "Expected duplicate submission rejection.");
  assert((await feedbackCount()) === 1, "Duplicate feedback submission should not create another record.");
  console.log("PASS: duplicate feedback is rejected.");

  const lockedState = await getCourseFeedbackState(testSlug, lockedParticipantSession);
  assert(lockedState.status === "locked", `Expected locked feedback state, got ${lockedState.status}.`);
  const lockedResult = await submitCourseFeedback({
    accessibilityIssue: false,
    clarityRating: 4,
    comment: "Locked participant submission should not persist.",
    courseSlug: testSlug,
    rating: 4,
    session: lockedParticipantSession,
    usefulnessRating: 4,
  });
  assert(!lockedResult.success && lockedResult.code === "locked", "Expected locked participant rejection.");
  assert((await feedbackCount()) === 1, "Locked feedback submission should not create a record.");
  console.log("PASS: incomplete learner is locked out of feedback submission.");

  const adminSummary = await getFeedbackSummaryData(adminSession);
  assert(adminSummary.totalFeedback >= 1, "Expected admin feedback summary to include the test feedback.");
  assert(adminSummary.totalAccessibilityIssues >= 1, "Expected admin feedback summary to include accessibility issue count.");
  assert(adminSummary.showComments, "Admins should be allowed to see protected recent comments.");
  assert(adminSummary.recentComments.some((comment) => comment.courseTitle === "R17 Feedback Verification"), "Expected protected comment in admin summary.");
  console.log("PASS: admin summary includes metrics and protected comments.");

  const meViewerSummary = await getFeedbackSummaryData(meViewerSession);
  assert(meViewerSummary.totalFeedback >= 1, "Expected M&E summary to include feedback metrics.");
  assert(!meViewerSummary.showComments, "M&E summary should hide protected comments.");
  assert(meViewerSummary.recentComments.length === 0, "M&E summary should not return protected comments.");
  console.log("PASS: M&E summary includes metrics without protected comments.");

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL R17 CHECKS PASSED.");
}

main()
  .catch(async (error) => {
    console.error(error);
    await cleanup();
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
