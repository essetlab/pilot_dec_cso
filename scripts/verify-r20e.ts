import "dotenv/config";

import { AuditActionType, CourseLevel, CourseStatus, CourseVisibility } from "../src/generated/prisma/enums";
import {
  assignAdminCourse,
  deactivateAdminCourseAssignment,
  getAdminCourseAssignmentOptions,
  getAdminCourseDetail,
} from "../src/lib/admin-course-workflow";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { prisma } from "../src/lib/prisma";

const testTitle = "R20E Admin Course Assignment Verification";
const testSlug = "r20e-admin-course-assignment-verification";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function sessionFor(
  user: { email: string; fullName: string | null; id: string },
  roles: AuthSession["roles"],
): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName ?? user.email,
    roles,
    userId: user.id,
  };
}

async function cleanup() {
  const courses = await prisma.course.findMany({
    select: { id: true },
    where: { OR: [{ slug: testSlug }, { title: testTitle }] },
  });
  const courseIds = courses.map((course) => course.id);

  if (courseIds.length > 0) {
    await prisma.auditLog.deleteMany({
      where: {
        entityId: { in: courseIds },
        entityType: "Course",
      },
    });
    await prisma.courseAssignment.deleteMany({
      where: { courseId: { in: courseIds } },
    });
    await prisma.course.deleteMany({
      where: { id: { in: courseIds } },
    });
  }
}

async function auditCount(courseId: string) {
  return prisma.auditLog.count({
    where: {
      actionType: AuditActionType.COURSE_UPDATED,
      entityId: courseId,
      entityType: "Course",
    },
  });
}

async function main() {
  console.log("=== R20E Verification: Admin Course Assignments ===");
  await cleanup();

  const [admin, creator, participant, organization, cohort] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
    prisma.organization.findFirst({ orderBy: { name: "asc" } }),
    prisma.cohort.findFirst({ orderBy: { name: "asc" } }),
  ]);
  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");
  assert(organization, "Missing seeded organization. Run npm run db:seed first.");
  assert(cohort, "Missing seeded cohort. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const course = await prisma.course.create({
    data: {
      assignedCreatorId: creator.id,
      certificateEligible: false,
      createdById: creator.id,
      defaultPassThreshold: 80,
      finalTestRequired: false,
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      shortDescription: "Temporary course for R20E assignment verification.",
      slug: testSlug,
      status: CourseStatus.PUBLISHED,
      targetAudience: "Verification audience",
      title: testTitle,
      visibility: CourseVisibility.ASSIGNED_ONLY,
    },
  });

  const options = await getAdminCourseAssignmentOptions(adminSession);
  assert(options.users.length > 0, "Expected user assignment options.");
  assert(options.organizations.length > 0, "Expected organization assignment options.");
  assert(options.cohorts.length > 0, "Expected cohort assignment options.");
  console.log("PASS: admin assignment options load users, organizations, and cohorts.");

  const userAssignment = await assignAdminCourse({
    courseId: course.id,
    dueDate: "2026-12-31",
    session: adminSession,
    targetId: participant.id,
    targetType: "USER",
  });
  assert(userAssignment.success && userAssignment.assignmentId, `Expected user assignment success, got ${userAssignment.code}.`);

  const organizationAssignment = await assignAdminCourse({
    courseId: course.id,
    session: adminSession,
    targetId: organization.id,
    targetType: "ORGANIZATION",
  });
  assert(
    organizationAssignment.success && organizationAssignment.assignmentId,
    `Expected organization assignment success, got ${organizationAssignment.code}.`,
  );

  const cohortAssignment = await assignAdminCourse({
    courseId: course.id,
    session: adminSession,
    targetId: cohort.id,
    targetType: "COHORT",
  });
  assert(cohortAssignment.success && cohortAssignment.assignmentId, `Expected cohort assignment success, got ${cohortAssignment.code}.`);
  assert((await auditCount(course.id)) === 3, "Expected one audit log per assignment.");
  console.log("PASS: admin can assign course to user, organization, and cohort with audit logging.");

  const duplicate = await assignAdminCourse({
    courseId: course.id,
    session: adminSession,
    targetId: participant.id,
    targetType: "USER",
  });
  assert(duplicate.success, `Expected duplicate assignment no-op success, got ${duplicate.code}.`);
  assert(duplicate.code === "course-assignment-already-active", `Expected already-active code, got ${duplicate.code}.`);
  console.log("PASS: duplicate active assignment is handled as a no-op.");

  const detail = await getAdminCourseDetail(course.id, adminSession);
  assert(detail, "Expected admin course detail to load.");
  assert(detail.assignments.length === 3, `Expected three active assignments, got ${detail.assignments.length}.`);
  console.log("PASS: admin course detail exposes active assignment summaries.");

  const removal = await deactivateAdminCourseAssignment({
    assignmentId: userAssignment.assignmentId,
    session: adminSession,
  });
  assert(removal.success, `Expected assignment removal success, got ${removal.code}.`);
  const inactive = await prisma.courseAssignment.findUnique({
    where: { id: userAssignment.assignmentId },
  });
  assert(inactive?.isActive === false, "Expected assignment to be inactive after removal.");
  assert((await auditCount(course.id)) === 4, "Expected removal audit log.");
  console.log("PASS: admin can deactivate assignment without deleting history.");

  const denied = await assignAdminCourse({
    courseId: course.id,
    session: participantSession,
    targetId: participant.id,
    targetType: "USER",
  });
  assert(!denied.success, "Expected participant assignment mutation to be denied.");
  assert(denied.code === "unauthorized", `Expected unauthorized, got ${denied.code}.`);
  console.log("PASS: participant cannot perform admin course assignment mutations.");

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL R20E CHECKS PASSED.");
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
