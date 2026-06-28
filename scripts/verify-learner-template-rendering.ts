import "dotenv/config";

import {
  ContentBlockType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
} from "../src/generated/prisma/enums";
import type { Prisma } from "../src/generated/prisma/client";
import { resolve } from "node:path";
import { createJiti } from "jiti";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  getLearnerTemplateOptions,
  resolveLearnerTemplateSelection,
} from "../src/lib/learner-template";
import { prisma } from "../src/lib/prisma";

const fixtureCourseId = "learner-template-rendering-fixture";
const fixtureSlug = "learner-template-rendering-fixture";
const fixtureVersionId = "learner-template-rendering-version";
const fixtureModuleId = "learner-template-rendering-module";
const fixtureLessonId = "learner-template-rendering-lesson";
const fallbackCourseId = "learner-template-default-fixture";
const fallbackSlug = "learner-template-default-fixture";
const fallbackVersionId = "learner-template-default-version";

type CourseDataModule = typeof import("../src/lib/course-data");
type CreatorPreviewDataModule = typeof import("../src/lib/creator-preview-data");

function loadDataModules() {
  const jiti = createJiti(import.meta.url, {
    alias: {
      "@": resolve("./src"),
      "server-only": resolve("./scripts/server-only-stub.js"),
    },
  });

  return {
    courseData: jiti(resolve("./src/lib/course-data.ts")) as CourseDataModule,
    creatorPreviewData: jiti(
      resolve("./src/lib/creator-preview-data.ts"),
    ) as CreatorPreviewDataModule,
  };
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

async function ensureFixtureCourse({
  courseId,
  slug,
  versionId,
  metadata,
  title,
}: {
  courseId: string;
  metadata: Prisma.InputJsonValue | null;
  slug: string;
  title: string;
  versionId: string;
}) {
  const creator = await prisma.user.upsert({
    create: {
      email: "learner-template-creator@demo.local",
      fullName: "Learner Template Creator",
    },
    update: { fullName: "Learner Template Creator" },
    where: { email: "learner-template-creator@demo.local" },
  });
  const participant = await prisma.user.upsert({
    create: {
      email: "learner-template-participant@demo.local",
      fullName: "Learner Template Participant",
    },
    update: { fullName: "Learner Template Participant" },
    where: { email: "learner-template-participant@demo.local" },
  });

  let capacityArea = await prisma.capacityArea.findUnique({
    where: { slug: "learner-template-rendering" },
  });

  if (!capacityArea) {
    capacityArea = await prisma.capacityArea.create({
      data: {
        description: "Learner template rendering verification capacity area.",
        name: "Learner Template Rendering",
        slug: "learner-template-rendering",
      },
    });
  }

  await prisma.course.deleteMany({
    where: {
      OR: [{ id: courseId }, { slug }],
    },
  });

  await prisma.course.create({
    data: {
      analysisMetadataJson: metadata ?? undefined,
      assignedCreatorId: creator.id,
      certificateEligible: false,
      createdById: creator.id,
      estimatedDurationMinutes: 45,
      finalTestRequired: false,
      id: courseId,
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription: `${title} confirms selected learner template rendering.`,
      shortDescription: `${title} verification course.`,
      slug,
      status: CourseStatus.PUBLISHED,
      targetAudience: "Local CSO participants",
      title,
      visibility: CourseVisibility.PUBLIC,
    },
  });

  await prisma.courseCapacityArea.create({
    data: {
      capacityAreaId: capacityArea.id,
      courseId,
    },
  });

  await prisma.courseVersion.create({
    data: {
      courseId,
      createdById: creator.id,
      id: versionId,
      publishedAt: new Date(),
      publishedById: creator.id,
      status: CourseStatus.PUBLISHED,
      versionNumber: 1,
    },
  });

  const moduleId =
    courseId === fixtureCourseId ? fixtureModuleId : `${courseId}-module`;
  const lessonId =
    courseId === fixtureCourseId ? fixtureLessonId : `${courseId}-lesson`;

  await prisma.module.create({
    data: {
      courseVersionId: versionId,
      id: moduleId,
      order: 1,
      title: "Template rendering module",
    },
  });

  await prisma.lesson.create({
    data: {
      description: "This lesson renders through the selected learner template.",
      id: lessonId,
      moduleId,
      order: 1,
      title: "Template-rendered lesson",
    },
  });

  await prisma.contentBlock.create({
    data: {
      configJson: {
        body: "This text block confirms the shared learner renderer can load saved Build Studio content.",
        heading: "Shared learner renderer",
      } as Prisma.InputJsonValue,
      id: `${courseId}-text-block`,
      lessonId,
      order: 1,
      title: "Shared renderer text",
      type: ContentBlockType.TEXT,
    },
  });

  return {
    creatorSession: sessionFor(creator, ["COURSE_CREATOR"]),
    participant,
  };
}

async function main() {
  const templateOptions = getLearnerTemplateOptions();
  assert(templateOptions.length === 4, "Expected four Phase 1 learner templates.");
  assert(
    resolveLearnerTemplateSelection(null).templateId === "LT-GUIDED-LESSON",
    "Expected missing metadata to inherit the guided lesson template.",
  );

  const metadata = {
    template: {
      selectedNavigationStyleId: "SIDEBAR_OUTLINE",
      selectedTemplateId: "LT-PRACTICE-SCENARIO",
      selectedThemeId: "DEC_DEFAULT",
    },
  } as Prisma.InputJsonValue;

  const { creatorSession, participant } = await ensureFixtureCourse({
    courseId: fixtureCourseId,
    metadata,
    slug: fixtureSlug,
    title: "Practice Scenario Template Fixture",
    versionId: fixtureVersionId,
  });
  await ensureFixtureCourse({
    courseId: fallbackCourseId,
    metadata: null,
    slug: fallbackSlug,
    title: "Default Template Fixture",
    versionId: fallbackVersionId,
  });

  const { courseData, creatorPreviewData } = loadDataModules();

  courseData.setMockSession({ email: participant.email });
  const learnerCourse = await courseData.getLearnerCourseBySlug(fixtureSlug);
  const fallbackCourse = await courseData.getLearnerCourseBySlug(fallbackSlug);
  courseData.setMockSession(null);

  assert(learnerCourse, "Expected participant learner course to resolve.");
  assert(
    learnerCourse.template.templateId === "LT-PRACTICE-SCENARIO",
    "Expected learner course to use selected practice scenario template.",
  );
  assert(
    learnerCourse.modules[0]?.lessons[0]?.blocks[0]?.type === ContentBlockType.TEXT,
    "Expected saved Build Studio block to render through learner data.",
  );

  assert(fallbackCourse, "Expected fallback template course to resolve.");
  assert(
    fallbackCourse.template.templateId === "LT-GUIDED-LESSON",
    "Expected course without template metadata to inherit guided lesson template.",
  );

  const previewData = await creatorPreviewData.getCreatorPreviewData(
    fixtureCourseId,
    creatorSession,
  );
  assert(previewData, "Expected creator preview data to resolve.");
  assert(
    previewData.template.templateId === learnerCourse.template.templateId,
    "Expected creator preview and learner player to share template selection.",
  );

  console.log(
    JSON.stringify(
      {
        creatorPreviewTemplate: previewData.template.templateId,
        defaultTemplate: fallbackCourse.template.templateId,
        learnerBlocks: learnerCourse.modules[0]?.lessons[0]?.blocks.length ?? 0,
        learnerTemplate: learnerCourse.template.templateId,
        phase1Templates: templateOptions.map((template) => template.templateId),
        status: "ok",
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
