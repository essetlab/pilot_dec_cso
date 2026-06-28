import "dotenv/config";

import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  getCreatorCourseMetadata,
  saveCreatorCourseMetadata,
  saveCreatorCourseSetup,
} from "../src/lib/creator-course-workflow";
import { prisma } from "../src/lib/prisma";

const testTitle = "R22A Creator Metadata Persistence Verification";
const testSlugPrefix = "r22a-creator-metadata-persistence-verification";

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

  const ids = courses.map((course) => course.id);
  if (ids.length === 0) {
    return;
  }

  await prisma.auditLog.deleteMany({
    where: {
      entityId: { in: ids },
      entityType: "Course",
    },
  });
  await prisma.courseCapacityArea.deleteMany({
    where: { courseId: { in: ids } },
  });
  await prisma.course.deleteMany({
    where: { id: { in: ids } },
  });
}

async function main() {
  console.log("=== R22A Verification: Creator Metadata Persistence ===");
  await cleanup();

  const [creator, admin, participant, capacityAreas] = await Promise.all([
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
    prisma.capacityArea.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
      take: 2,
      where: { isActive: true },
    }),
  ]);
  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");
  assert(capacityAreas.length >= 2, "Expected at least two active capacity areas.");

  const creatorSession = sessionFor(creator, ["COURSE_CREATOR"]);
  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);
  const indicator = await prisma.indicator.findFirst({
    include: {
      capacityArea: true,
      csoPractice: true,
    },
    orderBy: { indicatorCode: "asc" },
    where: {
      csoPracticeId: { not: null },
      isActive: true,
    },
  });
  assert(indicator?.capacityArea, "Expected CSV-seeded indicator with capacity area.");
  assert(indicator.csoPractice, "Expected CSV-seeded indicator with CSO practice.");
  const primaryCapacityArea = indicator.capacityArea;
  const secondaryCapacityArea = capacityAreas.find(
    (capacityArea) => capacityArea.id !== primaryCapacityArea.id,
  );
  assert(primaryCapacityArea, "Expected primary capacity area.");
  assert(secondaryCapacityArea, "Expected secondary capacity area.");

  const createResult = await saveCreatorCourseSetup({
    accessType: "Restricted",
    capacityAreaId: primaryCapacityArea.id,
    certificateIncluded: "No",
    courseTitle: testTitle,
    coverImageUrl: "",
    duration: "45",
    finalTestRequired: "No",
    language: "English",
    learningNeed: "Initial metadata verification need.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "R22A verification learners",
    session: creatorSession,
    shortDescription: "Temporary course for R22A metadata persistence verification.",
    targetProfile: "Local CSO staff",
  });
  assert(createResult.success && createResult.courseId, `Expected course create success, got ${createResult.code}.`);

  const courseId = createResult.courseId;
  const requiredMetadataFields = {
    accessibilityNote: "Keep examples usable on low bandwidth connections.",
    courseFitDecision: "RDI-ROUTE-COURSE",
    courseFitNote: "A focused course can address this need.",
    csoPracticeId: indicator.csoPractice.id,
    currentPracticeBaseline: "Creators do not yet connect learning needs to outcomes.",
    desiredPractice: "Creators link learning needs to outcomes and blocks.",
    indicatorId: indicator.id,
    ksmePrimary: "RDI-CAUSE-K",
    ksmeSecondary: "RDI-CAUSE-S",
    learningCanHelp: "RDI-LCH-YES",
    learnerTemplateId: "LT-GUIDED-LESSON",
    rootCauseSummary: "The design prompt needs a clearer learning trace.",
    safeguardingNote: "Avoid asking learners for sensitive personal disclosures.",
    standardFamilyId: indicator.standardFamilyId,
  };
  const creatorSave = await saveCreatorCourseMetadata({
    ...requiredMetadataFields,
    capacityGapAddressed: "CSOs need clearer linkage between learning needs and practical course outcomes.",
    courseId,
    intendedPracticeImprovement: "Creators can describe the practice improvement participants should apply after the course.",
    primaryCapacityAreaId: primaryCapacityArea.id,
    recommendedPrerequisites: "Bring an existing course idea or draft participant profile.",
    relatedFollowUpSupport: "Discuss the course metadata during internal quality review.",
    secondaryCapacityAreaId: secondaryCapacityArea.id,
    session: creatorSession,
    targetCsoProfile: "Local and grassroots CSO programme staff preparing short learning activities.",
  });
  assert(creatorSave.success, `Expected creator metadata save success, got ${creatorSave.code}.`);

  const reloadedForCreator = await getCreatorCourseMetadata(courseId, creatorSession);
  assert(reloadedForCreator, "Expected creator metadata page data to reload.");
  assert(reloadedForCreator.targetCsoProfile.includes("grassroots CSO"), "Expected target CSO profile to persist.");
  assert(reloadedForCreator.capacityGapAddressed.includes("learning needs"), "Expected capacity gap to persist.");
  assert(reloadedForCreator.intendedPracticeImprovement.includes("practice improvement"), "Expected practice improvement to persist.");
  assert(reloadedForCreator.recommendedPrerequisites.includes("course idea"), "Expected prerequisites to persist.");
  assert(reloadedForCreator.relatedFollowUpSupport.includes("quality review"), "Expected follow-up support to persist.");
  console.log("PASS: creator can save and reload DB-backed metadata fields.");

  const persistedCapacityAreaIds = (
    await prisma.courseCapacityArea.findMany({
      select: { capacityAreaId: true },
      where: { courseId },
    })
  ).map((link) => link.capacityAreaId);
  assert(
    persistedCapacityAreaIds.includes(primaryCapacityArea.id) &&
      persistedCapacityAreaIds.includes(secondaryCapacityArea.id),
    "Expected primary and secondary capacity area links to persist.",
  );
  console.log("PASS: metadata save updates course capacity area links.");

  const invalidSave = await saveCreatorCourseMetadata({
    ...requiredMetadataFields,
    capacityGapAddressed: "Invalid duplicate capacity area attempt.",
    courseId,
    intendedPracticeImprovement: "Invalid duplicate capacity area attempt.",
    primaryCapacityAreaId: primaryCapacityArea.id,
    recommendedPrerequisites: "",
    relatedFollowUpSupport: "",
    secondaryCapacityAreaId: primaryCapacityArea.id,
    session: creatorSession,
    targetCsoProfile: "Invalid duplicate capacity area attempt.",
  });
  assert(!invalidSave.success && invalidSave.code === "invalid", "Expected duplicate capacity areas to be rejected.");
  console.log("PASS: invalid metadata submissions are rejected before persistence.");

  const adminSave = await saveCreatorCourseMetadata({
    ...requiredMetadataFields,
    capacityGapAddressed: "Admin-confirmed capacity gap for R22A verification.",
    courseId,
    intendedPracticeImprovement: "Admin confirms creator metadata remains editable by authorized admins.",
    primaryCapacityAreaId: primaryCapacityArea.id,
    recommendedPrerequisites: "Admin review prerequisites.",
    relatedFollowUpSupport: "Admin review support note.",
    secondaryCapacityAreaId: "",
    session: adminSession,
    targetCsoProfile: "Admin-reviewed CSO participant profile.",
  });
  assert(adminSave.success, `Expected admin metadata save success, got ${adminSave.code}.`);

  const adminReload = await getCreatorCourseMetadata(courseId, adminSession);
  assert(adminReload?.targetCsoProfile === "Admin-reviewed CSO participant profile.", "Expected admin update to reload.");
  console.log("PASS: Platform Admin can read and update creator metadata.");

  const participantRead = await getCreatorCourseMetadata(courseId, participantSession);
  const participantSave = await saveCreatorCourseMetadata({
    ...requiredMetadataFields,
    capacityGapAddressed: "Participant should not update metadata.",
    courseId,
    intendedPracticeImprovement: "Participant should not update metadata.",
    primaryCapacityAreaId: primaryCapacityArea.id,
    recommendedPrerequisites: "",
    relatedFollowUpSupport: "",
    secondaryCapacityAreaId: "",
    session: participantSession,
    targetCsoProfile: "Participant should not update metadata.",
  });
  assert(participantRead === null, "Expected participant metadata read to be blocked.");
  assert(!participantSave.success && participantSave.code === "unauthorized", "Expected participant metadata save to be blocked.");
  console.log("PASS: participant cannot read or update creator metadata.");

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL R22A CHECKS PASSED.");
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
