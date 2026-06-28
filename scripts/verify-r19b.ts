import "dotenv/config";

import { AuditActionType } from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { saveCreatorCourseSetup } from "../src/lib/creator-course-workflow";
import {
  addCreatorResource,
  archiveCreatorResource,
  getCreatorOutcomesData,
  getCreatorResourcesData,
  saveCreatorOutcomes,
} from "../src/lib/creator-materials-workflow";
import { prisma } from "../src/lib/prisma";

const testTitle = "R19B Materials Verification";
const testSlug = "r19b-materials-verification";

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
  console.log("=== R19B Verification: Outcomes and Resources Persistence ===");
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

  const createResult = await saveCreatorCourseSetup({
    accessType: "Restricted",
    capacityAreaId: capacityArea.id,
    certificateIncluded: "No",
    courseTitle: testTitle,
    coverImageUrl: "",
    duration: "30",
    finalTestRequired: "No",
    language: "English",
    learningNeed: "Verify materials persistence.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "Verification audience",
    session: creatorSession,
    shortDescription: "Temporary course for R19B verification.",
    targetProfile: "Verification CSOs",
  });
  assert(createResult.success && createResult.courseId, `Expected course create success, got ${createResult.code}.`);
  console.log("PASS: fixture draft course created through creator setup workflow.");

  const invalidOutcomes = await saveCreatorOutcomes({
    courseIdOrSlug: createResult.courseId,
    session: creatorSession,
    statements: ["", "   "],
  });
  assert(!invalidOutcomes.success && invalidOutcomes.code === "invalid", "Expected empty outcomes rejection.");
  console.log("PASS: empty outcomes are rejected.");

  const saveOutcomesResult = await saveCreatorOutcomes({
    courseIdOrSlug: createResult.courseId,
    session: creatorSession,
    statements: [
      "Describe how resource planning supports a practical CSO learning activity.",
      "Prepare a learner-facing resource list for a draft course.",
      "",
      "Review resource accessibility before publication.",
    ],
  });
  assert(saveOutcomesResult.success, `Expected outcomes save success, got ${saveOutcomesResult.code}.`);
  const outcomesData = await getCreatorOutcomesData(createResult.courseId, creatorSession);
  assert(outcomesData, "Expected outcomes data to load.");
  assert(outcomesData.outcomes.length === 3, `Expected 3 outcomes, got ${outcomesData.outcomes.length}.`);
  assert(outcomesData.outcomes[0]?.order === 1, "Expected first outcome order to be 1.");
  console.log("PASS: outcomes are saved, ordered, and readable.");

  const unauthorizedOutcomes = await saveCreatorOutcomes({
    courseIdOrSlug: createResult.courseId,
    session: participantSession,
    statements: ["Unauthorized learner update."],
  });
  assert(!unauthorizedOutcomes.success && unauthorizedOutcomes.code === "not-found", "Expected participant outcome update rejection.");
  console.log("PASS: participant cannot update creator outcomes.");

  const invalidResource = await addCreatorResource({
    accessibilityChecked: false,
    accessibilityNotes: "",
    courseIdOrSlug: createResult.courseId,
    description: "Invalid resource should not persist.",
    downloadLabel: "Open",
    fileName: "",
    fileType: "PDF",
    fileUrl: "",
    session: creatorSession,
    title: "Invalid resource",
  });
  assert(!invalidResource.success && invalidResource.code === "invalid", "Expected invalid resource rejection.");
  console.log("PASS: invalid resource is rejected.");

  const addResourceResult = await addCreatorResource({
    accessibilityChecked: true,
    accessibilityNotes: "Checked for descriptive file name and readable format.",
    courseIdOrSlug: createResult.courseId,
    description: "A temporary resource used to verify persistence.",
    downloadLabel: "Open verification resource",
    fileName: "r19b-resource.pdf",
    fileType: "PDF",
    fileUrl: "/resources/r19b/resource.pdf",
    session: creatorSession,
    title: "R19B Verification Resource",
  });
  assert(addResourceResult.success, `Expected resource add success, got ${addResourceResult.code}.`);
  const resourcesData = await getCreatorResourcesData(createResult.courseId, creatorSession);
  assert(resourcesData, "Expected resources data to load.");
  assert(resourcesData.resources.length === 1, `Expected 1 active resource, got ${resourcesData.resources.length}.`);
  assert(resourcesData.resources[0]?.accessibilityChecked, "Expected accessibility check flag to persist.");
  console.log("PASS: resource is saved and readable.");

  const archiveResult = await archiveCreatorResource({
    courseIdOrSlug: createResult.courseId,
    resourceId: resourcesData.resources[0]?.id ?? "",
    session: creatorSession,
  });
  assert(archiveResult.success && archiveResult.code === "archived", `Expected archive success, got ${archiveResult.code}.`);
  const resourcesAfterArchive = await getCreatorResourcesData(createResult.courseId, creatorSession);
  assert(resourcesAfterArchive, "Expected resources data after archive to load.");
  assert(resourcesAfterArchive.resources.length === 0, "Expected archived resource to disappear from active resource list.");
  console.log("PASS: resource archive hides it from active list.");

  const updateAuditCount = await prisma.auditLog.count({
    where: {
      actionType: AuditActionType.COURSE_UPDATED,
      entityId: createResult.courseId,
      entityType: "Course",
    },
  });
  assert(updateAuditCount >= 3, `Expected at least 3 course update audit rows, got ${updateAuditCount}.`);
  console.log("PASS: outcomes/resource changes write course update audit rows.");

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL R19B CHECKS PASSED.");
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
