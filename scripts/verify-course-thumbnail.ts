import "dotenv/config";

import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  getCreatorCourseSetup,
  saveCreatorCourseSetup,
} from "../src/lib/creator-course-workflow";
import { getCreatorPreviewData } from "../src/lib/creator-preview-data";
import { prisma } from "../src/lib/prisma";

const testTitle = "Course Thumbnail Verification";
const testSlugPrefix = "course-thumbnail-verification";
const thumbnailPath = "/assets/demo/hrba-advocacy-course-thumbnail.svg";
const updatedThumbnailPath = "/assets/demo/hrba-advocacy-course-thumbnail.svg?variant=updated";
const seededHrbaSlug = "human-rights-based-approach-practice";

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
    where: {
      OR: [
        { slug: { startsWith: testSlugPrefix } },
        { title: { startsWith: testTitle } },
      ],
    },
  });
  const courseIds = courses.map((course) => course.id);
  if (courseIds.length === 0) {
    return;
  }

  await prisma.auditLog.deleteMany({
    where: {
      entityId: { in: courseIds },
      entityType: "Course",
    },
  });
  await prisma.course.deleteMany({
    where: { id: { in: courseIds } },
  });
}

async function main() {
  console.log("=== Course Thumbnail Verification ===");
  await cleanup();

  const [creator, capacityArea] = await Promise.all([
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.capacityArea.findFirst({
      orderBy: { name: "asc" },
      select: { id: true },
      where: { isActive: true },
    }),
  ]);
  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(capacityArea, "Missing active capacity area. Run npm run db:seed first.");

  const creatorSession = sessionFor(creator, ["COURSE_CREATOR"]);
  const createResult = await saveCreatorCourseSetup({
    accessType: "Restricted",
    capacityAreaId: capacityArea.id,
    certificateIncluded: "No",
    courseTitle: testTitle,
    coverImageUrl: thumbnailPath,
    duration: "35",
    finalTestRequired: "No",
    language: "English",
    learningNeed: "Verify course-level thumbnail persistence.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "Course creators verifying thumbnail setup.",
    session: creatorSession,
    shortDescription: "Temporary course for course thumbnail verification.",
    targetProfile: "Local CSO staff",
  });
  assert(createResult.success && createResult.courseId, `Expected course create success, got ${createResult.code}.`);

  const createdSetup = await getCreatorCourseSetup(createResult.courseId, creatorSession);
  assert(createdSetup?.coverImageUrl === thumbnailPath, "Expected setup reload to include saved thumbnail path.");
  console.log("PASS: creator setup saves and reloads course thumbnail value.");

  const updateResult = await saveCreatorCourseSetup({
    accessType: "Restricted",
    capacityAreaId: capacityArea.id,
    certificateIncluded: "No",
    courseId: createResult.courseId,
    courseTitle: testTitle,
    coverImageUrl: updatedThumbnailPath,
    duration: "35",
    finalTestRequired: "No",
    language: "English",
    learningNeed: "Verify course-level thumbnail update.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "Course creators verifying thumbnail update.",
    session: creatorSession,
    shortDescription: "Temporary course for course thumbnail verification.",
    targetProfile: "Local CSO staff",
  });
  assert(updateResult.success, `Expected course thumbnail update success, got ${updateResult.code}.`);
  const updatedSetup = await getCreatorCourseSetup(createResult.courseId, creatorSession);
  assert(updatedSetup?.coverImageUrl === updatedThumbnailPath, "Expected updated thumbnail path to reload in setup.");
  console.log("PASS: creator setup updates persisted thumbnail value.");

  const seededCourse = await prisma.course.findUnique({
    select: { coverImageUrl: true },
    where: { slug: seededHrbaSlug },
  });
  assert(seededCourse?.coverImageUrl === thumbnailPath, "Expected seeded HRBA course thumbnail path.");
  console.log("PASS: seed data provides a stable course thumbnail path.");

  const creatorPreview = await getCreatorPreviewData(seededHrbaSlug, creatorSession);
  assert(creatorPreview?.coverImageUrl === thumbnailPath, "Expected creator preview data to include saved thumbnail.");
  console.log("PASS: creator preview data includes the saved thumbnail.");

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL COURSE THUMBNAIL CHECKS PASSED.");
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
