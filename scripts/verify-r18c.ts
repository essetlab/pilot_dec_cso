import "dotenv/config";

import {
  AuditActionType,
  ContentBlockType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  QuizQuestionType,
} from "../src/generated/prisma/enums";
import { prisma } from "../src/lib/prisma";
import { transitionCourseStatus } from "../src/lib/review-workflow";
import type { AuthSession } from "../src/lib/auth/session-codec";

const testSlug = "r18c-review-workflow-verification";
const testCourseId = "r18c-review-workflow-course";
const testVersionId = "r18c-review-workflow-version";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function cleanup() {
  await prisma.auditLog.deleteMany({
    where: {
      entityId: testCourseId,
      entityType: "Course",
    },
  });
  await prisma.course.deleteMany({
    where: {
      OR: [{ id: testCourseId }, { slug: testSlug }],
    },
  });
}

function sessionFor(user: { email: string; fullName: string; id: string }, roles: AuthSession["roles"]): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName,
    roles,
    userId: user.id,
  };
}

async function createFixture() {
  const [admin, creator, reviewer] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "reviewer@demo.local" } }),
  ]);

  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(reviewer, "Missing seeded Course Reviewer user. Run npm run db:seed first.");

  let capacityArea = await prisma.capacityArea.findFirst({
    orderBy: {
      name: "asc",
    },
  });

  if (!capacityArea) {
    capacityArea = await prisma.capacityArea.create({
      data: {
        description: "R18C verification capacity area",
        name: "R18C Verification",
        slug: "r18c-verification",
      },
    });
  }

  const course = await prisma.course.create({
    data: {
      assignedCreatorId: creator.id,
      capacityGapAddressed: "Verify course review workflow transitions.",
      certificateEligible: true,
      createdById: creator.id,
      defaultPassThreshold: 80,
      finalTestRequired: true,
      id: testCourseId,
      intendedPracticeImprovement: "Confirm review workflow can publish a ready course.",
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription: "Temporary course created by R18C verification.",
      shortDescription: "Temporary course created by R18C verification.",
      slug: testSlug,
      status: CourseStatus.DRAFT,
      targetAudience: "Verification users",
      targetCsoProfile: "Verification users",
      title: "R18C Review Workflow Verification",
      visibility: CourseVisibility.PRIVATE,
    },
  });

  await prisma.courseCapacityArea.create({
    data: {
      capacityAreaId: capacityArea.id,
      courseId: course.id,
    },
  });

  await prisma.learningOutcome.create({
    data: {
      courseId: course.id,
      order: 1,
      statement: "Verify the review workflow can submit, approve, publish, and unpublish.",
    },
  });

  const version = await prisma.courseVersion.create({
    data: {
      changeNotes: "R18C verification version",
      courseId: course.id,
      createdById: creator.id,
      id: testVersionId,
      status: CourseStatus.DRAFT,
      versionNumber: 1,
    },
  });

  const courseModule = await prisma.module.create({
    data: {
      courseVersionId: version.id,
      order: 1,
      title: "Workflow readiness",
    },
  });

  const lesson = await prisma.lesson.create({
    data: {
      completionRequired: true,
      moduleId: courseModule.id,
      order: 1,
      title: "Publish-ready lesson",
    },
  });

  await prisma.contentBlock.create({
    data: {
      configJson: {
        body: "This block makes the temporary verification lesson publication-ready.",
        heading: "Ready content",
        readingTimeMinutes: 1,
      },
      lessonId: lesson.id,
      order: 1,
      title: "Ready text block",
      type: ContentBlockType.TEXT,
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      courseVersionId: version.id,
      isFinalTest: true,
      passThreshold: 80,
      retakeAllowed: true,
      title: "R18C Final Test",
    },
  });

  await prisma.quizQuestion.create({
    data: {
      configJson: {
        correctAnswer: "A traceable status transition",
        options: [
          "A traceable status transition",
          "A deleted audit event",
          "A participant-only action",
        ],
      },
      order: 1,
      points: 1,
      questionText: "What should the review workflow create?",
      quizId: quiz.id,
      type: QuizQuestionType.MULTIPLE_CHOICE,
    },
  });

  return {
    adminSession: sessionFor(admin, ["PLATFORM_ADMIN"]),
    creatorSession: sessionFor(creator, ["COURSE_CREATOR"]),
    reviewerSession: sessionFor(reviewer, ["COURSE_REVIEWER"]),
  };
}

async function expectStatus(courseStatus: CourseStatus, versionStatus = courseStatus) {
  const course = await prisma.course.findUnique({
    include: {
      versions: true,
    },
    where: {
      id: testCourseId,
    },
  });

  assert(course, "Expected verification course to exist.");
  assert(course.status === courseStatus, `Expected course status ${courseStatus}, got ${course.status}.`);
  assert(
    course.versions[0]?.status === versionStatus,
    `Expected version status ${versionStatus}, got ${course.versions[0]?.status}.`,
  );

  return course;
}

async function expectAuditCount(actionType: AuditActionType, expected: number) {
  const count = await prisma.auditLog.count({
    where: {
      actionType,
      entityId: testCourseId,
      entityType: "Course",
    },
  });

  assert(count === expected, `Expected ${expected} ${actionType} audit rows, got ${count}.`);
}

async function main() {
  console.log("=== R18C Verification: Review Workflow Transitions ===");
  await cleanup();
  const { adminSession, creatorSession, reviewerSession } = await createFixture();

  await expectStatus(CourseStatus.DRAFT);
  console.log("PASS: fixture course created as DRAFT.");

  const submitResult = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_SUBMITTED_FOR_REVIEW,
    allowedFrom: [CourseStatus.DRAFT, CourseStatus.RETURNED_FOR_REVISION],
    courseIdOrSlug: testCourseId,
    description: "R18C verification submitted course for review.",
    session: creatorSession,
    targetStatus: CourseStatus.READY_FOR_REVIEW,
  });
  assert(submitResult.success, `Submit failed with code ${submitResult.code}.`);
  await expectStatus(CourseStatus.READY_FOR_REVIEW);
  await expectAuditCount(AuditActionType.COURSE_SUBMITTED_FOR_REVIEW, 1);
  console.log("PASS: submit for review updated status and wrote audit row.");

  const approveResult = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_APPROVED,
    allowedFrom: [CourseStatus.READY_FOR_REVIEW],
    courseIdOrSlug: testCourseId,
    description: "R18C verification approved course.",
    session: reviewerSession,
    targetStatus: CourseStatus.APPROVED,
  });
  assert(approveResult.success, `Approve failed with code ${approveResult.code}.`);
  await expectStatus(CourseStatus.APPROVED);
  await expectAuditCount(AuditActionType.COURSE_APPROVED, 1);
  console.log("PASS: approve updated status and wrote audit row.");

  const publishResult = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_PUBLISHED,
    allowedFrom: [CourseStatus.APPROVED, CourseStatus.UNPUBLISHED],
    courseIdOrSlug: testCourseId,
    description: "R18C verification published course.",
    session: adminSession,
    targetStatus: CourseStatus.PUBLISHED,
  });
  assert(publishResult.success, `Publish failed with code ${publishResult.code}.`);
  const publishedCourse = await expectStatus(CourseStatus.PUBLISHED);
  assert(publishedCourse.visibility === CourseVisibility.PUBLIC, `Expected PUBLIC visibility after publish, got ${publishedCourse.visibility}.`);
  assert(publishedCourse.versions[0]?.publishedAt, "Expected publishedAt to be set.");
  assert(publishedCourse.versions[0]?.publishedById, "Expected publishedById to be set.");
  await expectAuditCount(AuditActionType.COURSE_PUBLISHED, 1);
  console.log("PASS: publish updated status, visibility, publish metadata, and audit row.");

  const unpublishResult = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_UNPUBLISHED,
    allowedFrom: [CourseStatus.PUBLISHED],
    courseIdOrSlug: testCourseId,
    description: "R18C verification unpublished course.",
    session: adminSession,
    targetStatus: CourseStatus.UNPUBLISHED,
  });
  assert(unpublishResult.success, `Unpublish failed with code ${unpublishResult.code}.`);
  await expectStatus(CourseStatus.UNPUBLISHED);
  await expectAuditCount(AuditActionType.COURSE_UNPUBLISHED, 1);
  console.log("PASS: unpublish updated status and wrote audit row.");

  const invalidPublishResult = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_PUBLISHED,
    allowedFrom: [CourseStatus.APPROVED],
    courseIdOrSlug: testCourseId,
    description: "R18C verification invalid publish attempt.",
    session: adminSession,
    targetStatus: CourseStatus.PUBLISHED,
  });
  assert(!invalidPublishResult.success && invalidPublishResult.code === "invalid-transition", "Expected invalid publish attempt to be rejected.");
  await expectAuditCount(AuditActionType.COURSE_PUBLISHED, 1);
  console.log("PASS: invalid transition rejected without extra audit row.");

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL R18C CHECKS PASSED.");
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
