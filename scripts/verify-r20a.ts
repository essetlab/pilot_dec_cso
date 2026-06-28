import "dotenv/config";

import type { AuthSession } from "../src/lib/auth/session-codec";
import { getAdminCourseDetail, getAdminCourseListData } from "../src/lib/admin-course-workflow";
import { saveCreatorCourseSetup } from "../src/lib/creator-course-workflow";
import { addCreatorResource, saveCreatorOutcomes } from "../src/lib/creator-materials-workflow";
import { prisma } from "../src/lib/prisma";

const testTitle = "R20A Admin Course Operations Verification";
const testSlug = "r20a-admin-course-operations-verification";

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
  console.log("=== R20A Verification: Admin Course Operations ===");
  await cleanup();

  const [admin, creator, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);
  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");

  const capacityArea = await prisma.capacityArea.findFirst({
    orderBy: { name: "asc" },
  });
  assert(capacityArea, "Missing capacity area seed data. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const creatorSession = sessionFor(creator, ["COURSE_CREATOR"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const createResult = await saveCreatorCourseSetup({
    accessType: "Restricted",
    capacityAreaId: capacityArea.id,
    certificateIncluded: "No",
    courseTitle: testTitle,
    coverImageUrl: "",
    duration: "35",
    finalTestRequired: "No",
    language: "English",
    learningNeed: "Verify admin course operations.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "Admin verification audience",
    session: creatorSession,
    shortDescription: "Temporary course for R20A verification.",
    targetProfile: "Verification CSOs",
  });
  assert(createResult.success && createResult.courseId, `Expected course create success, got ${createResult.code}.`);

  const outcomesResult = await saveCreatorOutcomes({
    courseIdOrSlug: createResult.courseId,
    session: creatorSession,
    statements: [
      "Review an operational course record from the admin portal.",
      "Confirm course readiness data is visible to administrators.",
    ],
  });
  assert(outcomesResult.success, `Expected outcomes save success, got ${outcomesResult.code}.`);

  const resourceResult = await addCreatorResource({
    accessibilityChecked: true,
    accessibilityNotes: "Checked for R20A verification.",
    courseIdOrSlug: createResult.courseId,
    description: "Admin course operations verification resource.",
    downloadLabel: "Open R20A resource",
    fileName: "r20a-resource.pdf",
    fileType: "PDF",
    fileUrl: "/resources/r20a/resource.pdf",
    session: creatorSession,
    title: "R20A Verification Resource",
  });
  assert(resourceResult.success, `Expected resource add success, got ${resourceResult.code}.`);
  console.log("PASS: fixture course created with outcomes and resource.");

  const listData = await getAdminCourseListData(adminSession);
  const listItem = listData.courses.find((course) => course.title === testTitle);
  assert(listItem, "Expected admin course list to include fixture course.");
  assert(listData.metrics.total >= 1, "Expected admin course metrics to include courses.");
  assert(listData.metrics.draft >= 1, "Expected draft course metric to include fixture course.");
  assert(listItem.resources === "1", `Expected resource count 1, got ${listItem.resources}.`);
  assert(listItem.certificateEligible === "No", "Expected certificate flag to be No.");
  console.log("PASS: admin course list and metrics are DB-backed.");

  const detail = await getAdminCourseDetail(createResult.courseId, adminSession);
  assert(detail, "Expected admin course detail to load.");
  assert(detail.course.title === testTitle, "Expected detail title to match fixture course.");
  assert(detail.outcomes.length === 2, `Expected two outcomes, got ${detail.outcomes.length}.`);
  assert(detail.course.resourceCount === 1, `Expected one active resource, got ${detail.course.resourceCount}.`);
  assert(detail.versionSummary.versionNumber === 1, "Expected version summary to show v1.");
  assert(detail.versionSummary.lessonCount === 0, "Expected new course to have zero lessons.");
  console.log("PASS: admin course detail exposes setup, outcomes, resources, and version summary.");

  const participantList = await getAdminCourseListData(participantSession);
  const participantDetail = await getAdminCourseDetail(createResult.courseId, participantSession);
  assert(participantList.courses.length === 0, "Expected participant admin list access to return no courses.");
  assert(participantDetail === null, "Expected participant admin detail access to return null.");
  console.log("PASS: participant cannot read admin course operations data.");

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL R20A CHECKS PASSED.");
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
