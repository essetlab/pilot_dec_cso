import "dotenv/config";

import { AuditActionType, CourseVisibility } from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  getCreatorCourseList,
  getCreatorCourseSetup,
  saveCreatorCourseSetup,
} from "../src/lib/creator-course-workflow";
import { prisma } from "../src/lib/prisma";

const testTitle = "R19A Creator Setup Verification";
const updatedTitle = "R19A Creator Setup Verification Updated";
const testSlug = "r19a-creator-setup-verification";

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
  const courses = await prisma.course.findMany({
    select: { id: true },
    where: {
      OR: [
        { slug: { startsWith: testSlug } },
        { title: { startsWith: testTitle } },
        { title: { startsWith: updatedTitle } },
      ],
    },
  });

  const ids = courses.map((course) => course.id);
  if (ids.length > 0) {
    await prisma.auditLog.deleteMany({
      where: {
        entityId: { in: ids },
        entityType: "Course",
      },
    });
    await prisma.course.deleteMany({
      where: { id: { in: ids } },
    });
  }
}

async function main() {
  console.log("=== R19A Verification: Creator Course Setup Persistence ===");
  await cleanup();

  const [creator, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);

  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");

  const capacityArea = await prisma.capacityArea.findFirst({
    orderBy: { name: "asc" },
  });
  assert(capacityArea, "Missing capacity area seed data. Run npm run db:seed first.");

  const creatorSession = sessionFor(creator, ["COURSE_CREATOR"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const invalidResult = await saveCreatorCourseSetup({
    accessType: "Public",
    capacityAreaId: capacityArea.id,
    certificateIncluded: "No",
    courseTitle: "",
    coverImageUrl: "",
    duration: "45",
    finalTestRequired: "No",
    language: "English",
    learningNeed: "Invalid course should not persist.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "Verification audience",
    session: creatorSession,
    shortDescription: "",
    targetProfile: "Verification profile",
  });
  assert(!invalidResult.success && invalidResult.code === "invalid", "Expected invalid setup rejection.");
  console.log("PASS: invalid setup is rejected.");

  const createResult = await saveCreatorCourseSetup({
    accessType: "Public",
    capacityAreaId: capacityArea.id,
    certificateIncluded: "Yes",
    courseTitle: testTitle,
    coverImageUrl: "",
    duration: "45",
    finalTestRequired: "Yes",
    language: "English",
    learningNeed: "Verify creator setup persistence.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "Course creators verifying setup persistence",
    session: creatorSession,
    shortDescription: "Temporary course created by R19A verification.",
    targetProfile: "Verification CSOs",
  });
  assert(createResult.success && createResult.courseId, `Expected create success, got ${createResult.code}.`);
  console.log("PASS: creator setup creates a draft course.");

  const createdCourse = await prisma.course.findUnique({
    include: {
      capacityAreas: true,
      versions: true,
    },
    where: { id: createResult.courseId },
  });
  assert(createdCourse, "Expected created course to exist.");
  assert(createdCourse.slug === testSlug, `Expected slug ${testSlug}, got ${createdCourse.slug}.`);
  assert(createdCourse.visibility === CourseVisibility.PUBLIC, `Expected PUBLIC visibility, got ${createdCourse.visibility}.`);
  assert(createdCourse.versions.length === 1, "Expected initial draft version to be created.");
  assert(createdCourse.capacityAreas[0]?.capacityAreaId === capacityArea.id, "Expected selected capacity area link.");
  const createAuditCount = await prisma.auditLog.count({
    where: {
      actionType: AuditActionType.COURSE_CREATED,
      entityId: createdCourse.id,
      entityType: "Course",
    },
  });
  assert(createAuditCount === 1, `Expected one course-created audit row, got ${createAuditCount}.`);
  console.log("PASS: create persisted slug, version, capacity link, and audit row.");

  const list = await getCreatorCourseList(creatorSession);
  assert(list.courses.some((course) => course.title === testTitle), "Expected creator course list to include created course.");
  console.log("PASS: creator course list reads the new course.");

  const setup = await getCreatorCourseSetup(createdCourse.id, creatorSession);
  assert(setup, "Expected creator setup read to return the new course.");
  assert(setup.courseTitle === testTitle, "Expected setup read to include course title.");
  assert(setup.capacityAreaId === capacityArea.id, "Expected setup read to include selected capacity area.");
  console.log("PASS: setup page data reads persisted values.");

  const updateResult = await saveCreatorCourseSetup({
    accessType: "Restricted",
    capacityAreaId: "",
    certificateIncluded: "No",
    courseId: createdCourse.id,
    courseTitle: updatedTitle,
    coverImageUrl: "",
    duration: "60",
    finalTestRequired: "No",
    language: "Amharic",
    learningNeed: "Updated setup persistence check.",
    level: "Intermediate",
    passScore: "75",
    primaryAudience: "Updated verification audience",
    session: creatorSession,
    shortDescription: "Temporary course updated by R19A verification.",
    targetProfile: "Updated verification CSOs",
  });
  assert(updateResult.success && updateResult.code === "saved", `Expected update success, got ${updateResult.code}.`);

  const updatedCourse = await prisma.course.findUnique({
    include: { capacityAreas: true },
    where: { id: createdCourse.id },
  });
  assert(updatedCourse, "Expected updated course to exist.");
  assert(updatedCourse.title === updatedTitle, "Expected title update to persist.");
  assert(updatedCourse.estimatedDurationMinutes === 60, "Expected duration update to persist.");
  assert(updatedCourse.visibility === CourseVisibility.PRIVATE, "Expected restricted access to persist as PRIVATE.");
  assert(updatedCourse.capacityAreas.length === 0, "Expected capacity area to be cleared.");
  const updateAuditCount = await prisma.auditLog.count({
    where: {
      actionType: AuditActionType.COURSE_UPDATED,
      entityId: createdCourse.id,
      entityType: "Course",
    },
  });
  assert(updateAuditCount === 1, `Expected one course-updated audit row, got ${updateAuditCount}.`);
  console.log("PASS: setup update persists fields, capacity changes, and audit row.");

  const unauthorizedResult = await saveCreatorCourseSetup({
    accessType: "Public",
    capacityAreaId: "",
    certificateIncluded: "No",
    courseId: createdCourse.id,
    courseTitle: "Unauthorized update",
    coverImageUrl: "",
    duration: "15",
    finalTestRequired: "No",
    language: "English",
    learningNeed: "Should not save.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "Unauthorized",
    session: participantSession,
    shortDescription: "Should not save.",
    targetProfile: "Unauthorized",
  });
  assert(!unauthorizedResult.success && unauthorizedResult.code === "unauthorized", "Expected participant update rejection.");
  console.log("PASS: participant cannot create or update creator setup.");

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL R19A CHECKS PASSED.");
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
