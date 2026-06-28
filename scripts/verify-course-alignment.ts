import "dotenv/config";

import { ContentBlockType } from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { getBuildStudioCourse } from "../src/lib/build-studio-data";
import {
  getCreatorCourseMetadata,
  saveCreatorCourseMetadata,
  saveCreatorCourseSetup,
} from "../src/lib/creator-course-workflow";
import { saveCreatorOutcomes } from "../src/lib/creator-materials-workflow";
import { prisma } from "../src/lib/prisma";

const testTitle = "Course Alignment Foundation Verification";
const testSlugPrefix = "course-alignment-foundation-verification";

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
    where: { entityId: { in: ids }, entityType: "Course" },
  });
  await prisma.course.deleteMany({
    where: { id: { in: ids } },
  });
}

async function main() {
  console.log("=== Course Alignment Verification ===");
  await cleanup();

  const [creator, participant, indicator] = await Promise.all([
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
    prisma.indicator.findFirst({
      include: {
        capacityArea: true,
        csoPractice: true,
        standardFamily: true,
      },
      orderBy: { indicatorCode: "asc" },
      where: {
        csoPracticeId: { not: null },
        isActive: true,
      },
    }),
  ]);

  assert(creator, "Missing Course Creator user. Run npm run db:seed first.");
  assert(participant, "Missing participant user. Run npm run db:seed first.");
  assert(indicator?.capacityArea, "Missing CSV-seeded indicator with capacity area.");
  assert(indicator.csoPractice, "Missing CSV-seeded indicator with CSO practice.");
  assert(indicator.standardFamily, "Missing CSV-seeded indicator with standard family.");

  const capacityArea = indicator.capacityArea;
  const practice = indicator.csoPractice;

  const creatorSession = sessionFor(creator, ["COURSE_CREATOR"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const created = await saveCreatorCourseSetup({
    accessType: "Restricted",
    capacityAreaId: capacityArea.id,
    certificateIncluded: "No",
    courseTitle: testTitle,
    coverImageUrl: "",
    duration: "45",
    finalTestRequired: "No",
    language: "English",
    learningNeed: "Teams need a clearer trace from practice gap to learning content.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "Course alignment verification learners",
    session: creatorSession,
    shortDescription: "Temporary course for alignment verification.",
    targetProfile: "Local CSO staff",
  });
  assert(created.success && created.courseId, `Expected course creation, got ${created.code}.`);

  const metadataSaved = await saveCreatorCourseMetadata({
    accessibilityNote: "Keep examples usable in low bandwidth settings.",
    capacityGapAddressed: "Reports do not clearly connect learning content to practice improvement.",
    courseFitDecision: "RDI-ROUTE-COURSE",
    courseFitNote: "The need can be addressed through a focused course.",
    courseId: created.courseId,
    csoPracticeId: practice.id,
    currentPracticeBaseline: "Creators write outcomes separately from lesson activities.",
    desiredPractice: "Creators align outcomes, indicators, and blocks.",
    indicatorId: indicator.id,
    intendedPracticeImprovement: "Creators can align at least one outcome and block.",
    ksmePrimary: "RDI-CAUSE-K",
    ksmeSecondary: "RDI-CAUSE-S",
    learningCanHelp: "RDI-LCH-YES",
    learnerTemplateId: "LT-GUIDED-LESSON",
    primaryCapacityAreaId: capacityArea.id,
    recommendedPrerequisites: "Bring a draft outcome.",
    relatedFollowUpSupport: "Review during course quality check.",
    rootCauseSummary: "The course needs explicit authoring prompts.",
    safeguardingNote: "Avoid sensitive personal disclosure prompts.",
    secondaryCapacityAreaId: "",
    standardFamilyId: indicator.standardFamilyId,
    session: creatorSession,
    targetCsoProfile: "Course creators designing CSO learning.",
  });
  assert(metadataSaved.success, `Expected metadata save, got ${metadataSaved.code}.`);

  const metadata = await getCreatorCourseMetadata(created.courseId, creatorSession);
  assert(metadata?.csoPracticeId === practice.id, "Expected CSO practice to reload.");
  assert(metadata?.indicatorId === indicator.id, "Expected indicator to reload.");

  const outcomesSaved = await saveCreatorOutcomes({
    courseIdOrSlug: created.courseId,
    outcomes: [
      {
        assessmentMethod: "RDI-MMETH-KCHECK",
        capacityAreaId: capacityArea.id,
        csoPracticeId: practice.id,
        evidenceType: "RDI-SRC-DOCREVIEW",
        indicatorId: indicator.id,
        localOutcomeStatement: "Creator drafts one aligned outcome.",
        measurementLevel: "RDI-MLEV-LEARN",
        observableAction: "Link an outcome to a lesson block.",
        standardFamilyId: indicator.standardFamilyId,
        statement: "Participants will be able to align one learning outcome to a course block.",
        successCriterion: "Outcome includes capacity area, practice, and assessment method.",
      },
    ],
    session: creatorSession,
    statements: [],
  });
  assert(outcomesSaved.success, `Expected outcomes save, got ${outcomesSaved.code}.`);

  const course = await prisma.course.findUnique({
    include: {
      learningOutcomes: { orderBy: { order: "asc" } },
      versions: { orderBy: { versionNumber: "desc" } },
    },
    where: { id: created.courseId },
  });
  const version = course?.versions[0];
  const outcome = course?.learningOutcomes[0];
  assert(version, "Expected draft version.");
  assert(outcome, "Expected aligned outcome.");

  const moduleRecord = await prisma.module.create({
    data: {
      courseVersionId: version.id,
      order: 1,
      title: "Alignment module",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      alignmentMetadataJson: {
        outcomeIds: [outcome.id],
      },
      moduleId: moduleRecord.id,
      order: 1,
      title: "Alignment lesson",
    },
  });
  const block = await prisma.contentBlock.create({
    data: {
      configJson: {
        alignment: {
          expectedLearnerAction: "Compare the outcome to the activity.",
          learningFunction: "APPLY",
          linkedOutcomeId: outcome.id,
        },
        body: "A short aligned learning block.",
      },
      lessonId: lesson.id,
      order: 1,
      title: "Aligned text block",
      type: ContentBlockType.TEXT,
    },
  });

  const studio = await getBuildStudioCourse(
    created.courseId,
    creatorSession,
    lesson.id,
    block.id,
  );
  assert(studio.selectedBlock?.alignment.linkedOutcomeId === outcome.id, "Expected block outcome link.");
  assert(studio.selectedBlock.alignment.indicatorId === indicator.id, "Expected block to inherit indicator.");
  assert(
    studio.selectedLesson?.linkedOutcomeIds.includes(outcome.id),
    "Expected lesson outcome link.",
  );

  const participantRead = await getCreatorCourseMetadata(created.courseId, participantSession);
  assert(participantRead === null, "Expected participant creator-route data access to be blocked.");

  await cleanup();
  console.log("ALL COURSE ALIGNMENT CHECKS PASSED.");
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
