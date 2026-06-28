import "dotenv/config";

import { ContentBlockType, CourseStatus } from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  getCreatorCourseMetadata,
  saveCreatorCourseMetadata,
  saveCreatorCourseSetup,
} from "../src/lib/creator-course-workflow";
import { getCreatorPreviewData } from "../src/lib/creator-preview-data";
import { prisma } from "../src/lib/prisma";
import { resolve } from "node:path";
import { createJiti } from "jiti";

const testTitle = "Learner Template Selector Verification";
const testSlugPrefix = "learner-template-selector-verification";

type CourseDataModule = typeof import("../src/lib/course-data");

function loadCourseDataModule() {
  const jiti = createJiti(import.meta.url, {
    alias: {
      "@": resolve("./src"),
      "server-only": resolve("./scripts/server-only-stub.js"),
    },
  });

  return jiti(resolve("./src/lib/course-data.ts")) as CourseDataModule;
}

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

  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");
  assert(indicator?.capacityArea, "Missing seeded indicator with capacity area.");
  assert(indicator.csoPractice, "Missing seeded indicator with CSO practice.");
  assert(indicator.standardFamily, "Missing seeded indicator with standard family.");

  const creatorSession = sessionFor(creator, ["COURSE_CREATOR"]);

  const created = await saveCreatorCourseSetup({
    accessType: "Public",
    capacityAreaId: indicator.capacityArea.id,
    certificateIncluded: "No",
    courseTitle: testTitle,
    coverImageUrl: "",
    duration: "35",
    finalTestRequired: "No",
    language: "English",
    learningNeed: "Creators need to choose the right participant learning template.",
    level: "Foundational",
    passScore: "80",
    primaryAudience: "Template selector verification learners",
    session: creatorSession,
    shortDescription: "Temporary course for learner template selector verification.",
    targetProfile: "Local CSO staff",
  });
  assert(created.success && created.courseId && created.slug, `Expected course creation, got ${created.code}.`);

  const defaultMetadata = await getCreatorCourseMetadata(created.courseId, creatorSession);
  assert(defaultMetadata, "Expected creator metadata to load.");
  assert(
    defaultMetadata.learnerTemplate.templateId === "LT-GUIDED-LESSON",
    "Expected new course metadata to default to guided lesson.",
  );

  await prisma.course.update({
    data: {
      analysisMetadataJson: {
        keepExistingAnalysis: "preserve me",
        template: {
          selectedNavigationStyleId: "SIDEBAR_OUTLINE",
          selectedTemplateId: "LT-GUIDED-LESSON",
          selectedThemeId: "DEC_DEFAULT",
        },
      },
    },
    where: { id: created.courseId },
  });

  const saved = await saveCreatorCourseMetadata({
    accessibilityNote: "Keep template screens readable on narrow devices.",
    capacityGapAddressed: "Creators need a clear participant-facing course template.",
    courseFitDecision: "RDI-ROUTE-COURSE",
    courseFitNote: "A short course can address this need.",
    courseId: created.courseId,
    csoPracticeId: indicator.csoPractice.id,
    currentPracticeBaseline: "Creators preview courses with a default template only.",
    desiredPractice: "Creators select the learner template that fits the course.",
    indicatorId: indicator.id,
    intendedPracticeImprovement: "Creators can select and preview the selected learner template.",
    ksmePrimary: "RDI-CAUSE-K",
    ksmeSecondary: "",
    learnerTemplateId: "LT-RESOURCE-TOOLKIT",
    learningCanHelp: "RDI-LCH-YES",
    primaryCapacityAreaId: indicator.capacityArea.id,
    recommendedPrerequisites: "Bring one course outline.",
    relatedFollowUpSupport: "Review template selection before publication.",
    rootCauseSummary: "The course needs an explicit learner experience choice.",
    safeguardingNote: "Avoid sensitive examples in verification content.",
    secondaryCapacityAreaId: "",
    session: creatorSession,
    standardFamilyId: indicator.standardFamilyId,
    targetCsoProfile: "Local CSO course creators.",
  });
  assert(saved.success, `Expected metadata save, got ${saved.code}.`);

  const reloaded = await getCreatorCourseMetadata(created.courseId, creatorSession);
  assert(reloaded, "Expected metadata to reload after save.");
  assert(
    reloaded.learnerTemplate.templateId === "LT-RESOURCE-TOOLKIT",
    "Expected selected learner template to reload from metadata.",
  );

  const persisted = await prisma.course.findUnique({
    select: {
      analysisMetadataJson: true,
      versions: { orderBy: { versionNumber: "desc" }, take: 1 },
    },
    where: { id: created.courseId },
  });
  const metadata = persisted?.analysisMetadataJson as Record<string, unknown> | null;
  const template = metadata?.template as Record<string, unknown> | undefined;
  assert(metadata?.keepExistingAnalysis === "preserve me", "Expected existing analysis metadata to be preserved.");
  assert(template?.selectedTemplateId === "LT-RESOURCE-TOOLKIT", "Expected selectedTemplateId in course metadata.");
  assert(template?.selectedThemeId === "DEC_DEFAULT", "Expected selectedThemeId in course metadata.");
  assert(template?.selectedNavigationStyleId === "SIDEBAR_OUTLINE", "Expected selectedNavigationStyleId in course metadata.");

  const version = persisted?.versions[0];
  assert(version, "Expected draft version to exist.");
  const moduleRecord = await prisma.module.create({
    data: {
      courseVersionId: version.id,
      order: 1,
      title: "Template selector module",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      description: "This lesson verifies template selector persistence.",
      moduleId: moduleRecord.id,
      order: 1,
      title: "Template selector lesson",
    },
  });
  await prisma.contentBlock.create({
    data: {
      configJson: {
        body: "Saved Build Studio content should render through the selected toolkit template.",
        highlightedNote: "The selected learner template is stored on the course metadata.",
      },
      lessonId: lesson.id,
      order: 1,
      title: "Template selector text",
      type: ContentBlockType.TEXT,
    },
  });
  await prisma.courseVersion.update({
    data: {
      publishedAt: new Date(),
      publishedById: creator.id,
      status: CourseStatus.PUBLISHED,
    },
    where: { id: version.id },
  });
  await prisma.course.update({
    data: { status: CourseStatus.PUBLISHED },
    where: { id: created.courseId },
  });

  const preview = await getCreatorPreviewData(created.courseId, creatorSession);
  assert(preview?.template.templateId === "LT-RESOURCE-TOOLKIT", "Expected creator preview to use saved template.");

  const courseData = loadCourseDataModule();
  courseData.setMockSession({ email: participant.email });
  const learnerCourse = await courseData.getLearnerCourseBySlug(created.slug);
  courseData.setMockSession(null);
  assert(learnerCourse?.template.templateId === "LT-RESOURCE-TOOLKIT", "Expected learner route data to use saved template.");

  await cleanup();

  console.log(
    JSON.stringify(
      {
        creatorPreviewTemplate: preview.template.templateId,
        learnerTemplate: learnerCourse.template.templateId,
        preservedMetadata: metadata.keepExistingAnalysis,
        status: "ok",
      },
      null,
      2,
    ),
  );
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
