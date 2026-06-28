import "dotenv/config";

import { existsSync } from "node:fs";
import path from "node:path";
import { resolve } from "node:path";
import { createJiti } from "jiti";
import {
  ContentBlockType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  EnrollmentStatus,
  LessonProgressStatus,
} from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  HRBA_COURSE_ID,
  HRBA_COURSE_SLUG,
  HRBA_VERSION_ID,
  importHrbaAdvocacyCourse,
} from "./import-hrba-advocacy-course";
import { prisma } from "../src/lib/prisma";

type CourseDataModule = typeof import("../src/lib/course-data");
type CreatorPreviewDataModule = typeof import("../src/lib/creator-preview-data");
type LearnerActionsModule = typeof import("../src/lib/learner-actions");

const requiredDemoFiles = [
  "00_import_manifest.csv",
  "01_course_setup_enhanced.csv",
  "02_course_metadata_enhanced.csv",
  "03_learning_outcomes_enhanced.csv",
  "04_modules_lessons_enhanced.csv",
  "05_build_studio_blocks_enhanced.csv",
  "06_final_test_enhanced.csv",
  "07_asset_manifest_enhanced.csv",
  "08_catalog_preview_data.csv",
  "09_course_preview_qa.csv",
  "10_codex_import_prompt.md",
] as const;

const requiredReferenceFiles = [
  "CapacityArea.csv",
  "CSOPractice.csv",
  "StandardFamily.csv",
  "Indicator.csv",
  "_Lists.csv",
] as const;

const requiredBlockTypes = [
  ContentBlockType.TEXT,
  ContentBlockType.KEY_MESSAGE,
  ContentBlockType.IMAGE,
  ContentBlockType.RESOURCE,
  ContentBlockType.CASE_STUDY,
  ContentBlockType.ACCORDION,
  ContentBlockType.FLASHCARD,
  ContentBlockType.KNOWLEDGE_CHECK,
  ContentBlockType.BRANCHING_SCENARIO,
  ContentBlockType.REFLECTION_PROMPT,
  ContentBlockType.PRACTICAL_ACTIVITY_PROMPT,
  ContentBlockType.VIDEO,
] as const;

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
    learnerActions: jiti(resolve("./src/lib/learner-actions.ts")) as LearnerActionsModule,
  };
}

function assertFilesExist(baseDir: string, files: readonly string[]) {
  const missing = files.filter((fileName) => !existsSync(path.join(baseDir, fileName)));
  assert(missing.length === 0, `Missing required file(s): ${missing.join(", ")}`);
}

async function completeParticipantLessons(participantId: string, lessonIds: string[]) {
  const enrollment = await prisma.enrollment.upsert({
    create: {
      courseId: HRBA_COURSE_ID,
      courseVersionId: HRBA_VERSION_ID,
      progressPercent: 100,
      startedAt: new Date(),
      status: EnrollmentStatus.COMPLETED,
      completedAt: new Date(),
      userId: participantId,
    },
    update: {
      completedAt: new Date(),
      progressPercent: 100,
      status: EnrollmentStatus.COMPLETED,
    },
    where: {
      userId_courseVersionId: {
        courseVersionId: HRBA_VERSION_ID,
        userId: participantId,
      },
    },
  });

  for (const lessonId of lessonIds) {
    await prisma.lessonProgress.upsert({
      create: {
        completedAt: new Date(),
        enrollmentId: enrollment.id,
        lessonId,
        progressJson: { source: "HRBA import verifier" },
        startedAt: new Date(),
        status: LessonProgressStatus.COMPLETED,
      },
      update: {
        completedAt: new Date(),
        progressJson: { source: "HRBA import verifier" },
        status: LessonProgressStatus.COMPLETED,
      },
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
    });
  }
}

async function verifyFinalTestSubmission(
  learnerActions: LearnerActionsModule,
  participant: { email: string; fullName: string | null; id: string },
  quiz: {
    id: string;
    questions: {
      configJson: unknown;
      id: string;
    }[];
  },
) {
  await prisma.certificate.deleteMany({
    where: {
      courseVersionId: HRBA_VERSION_ID,
      userId: participant.id,
    },
  });
  await prisma.quizAttempt.deleteMany({
    where: {
      quizId: quiz.id,
      userId: participant.id,
    },
  });

  const answers = Object.fromEntries(
    quiz.questions.map((question) => {
      const config = question.configJson as { correctAnswer?: string } | null;
      return [question.id, config?.correctAnswer ?? ""];
    }),
  );

  const formData = new FormData();
  formData.append("answersJson", JSON.stringify(answers));
  formData.append("courseSlug", HRBA_COURSE_SLUG);
  formData.append("quizId", quiz.id);

  const globalWithSession = globalThis as typeof globalThis & {
    __mockSession?: AuthSession;
  };
  globalWithSession.__mockSession = sessionFor(participant, ["PARTICIPANT"]);

  try {
    const result = await learnerActions.submitFinalTestAttemptAction(formData);
    assert(result.success, `Expected final test submission to succeed: ${result.error ?? "unknown error"}`);
    assert(result.attempt, "Expected final test submission to return an attempt.");
    assert(result.attempt.passed, "Expected final test submission to pass with correct answers.");
    assert(result.attempt.score === 8, "Expected final test score to be 8.");
    assert(result.attempt.maxScore === 8, "Expected final test max score to be 8.");
    assert(result.attempt.percentage === 100, "Expected final test percentage to be 100.");

    return result.attempt;
  } finally {
    delete globalWithSession.__mockSession;
  }
}

async function main() {
  const demoDir = path.resolve(
    process.cwd(),
    "docs/specs/phase-1-cso-learning-hub/demo-courses/hrba-advocacy",
  );
  const referenceDir = path.resolve(
    process.cwd(),
    "docs/specs/phase-1-cso-learning-hub/reference-data",
  );
  assertFilesExist(demoDir, requiredDemoFiles);
  assertFilesExist(referenceDir, requiredReferenceFiles);

  const importSummary = await importHrbaAdvocacyCourse();

  const course = await prisma.course.findUnique({
    include: {
      capacityAreas: true,
      learningOutcomes: true,
      resources: true,
      versions: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  contentBlocks: true,
                },
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
          quizzes: {
            include: {
              questions: {
                include: {
                  learningOutcomes: true,
                },
                orderBy: { order: "asc" },
              },
            },
            where: { isFinalTest: true },
          },
        },
        where: { id: HRBA_VERSION_ID },
      },
    },
    where: { id: HRBA_COURSE_ID },
  });

  assert(course, "Expected HRBA course to exist after import.");
  assert(course.slug === HRBA_COURSE_SLUG, "Expected canonical HRBA course slug.");
  assert(course.status === CourseStatus.PUBLISHED, "Expected HRBA course to be published for demo verification.");
  assert(course.visibility === CourseVisibility.PUBLIC, "Expected HRBA course to be public for catalogue/detail verification.");
  assert(course.defaultPassThreshold === 80, "Expected course pass threshold to remain 80.");
  assert(course.certificateEligible, "Expected HRBA course certificate eligibility.");
  assert(course.finalTestRequired, "Expected HRBA course final test requirement.");
  assert(
    course.capacityAreas.some((item) => item.capacityAreaId === "CAP-ADV"),
    "Expected CAP-ADV course capacity linkage.",
  );

  const metadata = course.analysisMetadataJson as Record<string, unknown> | null;
  const template = metadata?.template as Record<string, unknown> | undefined;
  assert(template?.selectedTemplateId === "LT-PRACTICE-SCENARIO", "Expected Practice Scenario learner template.");
  assert(
    Array.isArray(metadata?.standardFamilyIds) &&
      metadata.standardFamilyIds.includes("STD-HRBA"),
    "Expected STD-HRBA stored as standard family metadata.",
  );

  const version = course.versions[0];
  assert(version, "Expected HRBA course version.");
  assert(version.modules.length === 3, "Expected 3 HRBA modules.");
  const lessons = version.modules.flatMap((module) => module.lessons);
  assert(lessons.length === 6, "Expected 6 HRBA lessons.");
  const blocks = lessons.flatMap((lesson) => lesson.contentBlocks);
  assert(blocks.length === 23, "Expected 23 HRBA Build Studio blocks.");
  const blockTypes = new Set(blocks.map((block) => block.type));
  for (const blockType of requiredBlockTypes) {
    assert(blockTypes.has(blockType), `Expected HRBA block type ${blockType}.`);
  }

  const branchingScenario = blocks.find(
    (block) => block.type === ContentBlockType.BRANCHING_SCENARIO,
  );
  const branchingConfig = branchingScenario?.configJson as Record<string, unknown> | undefined;
  assert(branchingConfig?.bestOptionId === "C", "Expected HRBA branching scenario best option C.");
  assert(
    Array.isArray(branchingConfig?.options) && branchingConfig.options.length === 4,
    "Expected HRBA branching scenario to include 4 option cards.",
  );

  const quiz = version.quizzes[0];
  assert(quiz, "Expected HRBA final test quiz.");
  assert(quiz.passThreshold === 80, "Expected HRBA final test pass threshold to be 80.");
  assert(quiz.questions.length === 8, "Expected 8 HRBA final test questions.");
  assert(quiz.maxAttempts === 3, "Expected HRBA final test max attempts to be 3.");
  assert(quiz.questions.every((question) => question.learningOutcomes.length > 0), "Expected final test questions to link to outcomes.");

  const creator = await prisma.user.findUnique({ where: { email: "creator@demo.local" } });
  const participant = await prisma.user.findUnique({ where: { email: "participant2@demo.local" } });
  assert(creator, "Expected Course Creator demo user.");
  assert(participant, "Expected Participant demo user.");

  const { courseData, creatorPreviewData, learnerActions } = loadDataModules();
  const publicDetail = await courseData.getPublicCourseBySlug(HRBA_COURSE_SLUG);
  assert(publicDetail, "Expected HRBA public course detail to resolve.");
  assert(publicDetail.outcomes.length === 5, "Expected HRBA public detail to show 5 outcomes.");
  assert(publicDetail.modules.length === 3, "Expected HRBA public detail to show module outline.");

  const previewData = await creatorPreviewData.getCreatorPreviewData(
    HRBA_COURSE_ID,
    sessionFor(creator, ["COURSE_CREATOR"]),
  );
  assert(previewData, "Expected creator preview data to resolve.");
  assert(previewData.totalBlocks === 23, "Expected creator preview to use real HRBA blocks.");
  assert(previewData.template.templateId === "LT-PRACTICE-SCENARIO", "Expected creator preview selected template.");

  courseData.setMockSession({ email: participant.email });
  const learnerCourse = await courseData.getLearnerCourseBySlug(HRBA_COURSE_SLUG);
  courseData.setMockSession(null);
  assert(learnerCourse, "Expected participant learner course to resolve.");
  assert(learnerCourse.modules.length === 3, "Expected learner player to show HRBA modules.");
  assert(
    learnerCourse.modules.flatMap((module) => module.lessons).flatMap((lesson) => lesson.blocks).length === 23,
    "Expected learner player to render 23 HRBA blocks.",
  );
  assert(learnerCourse.finalTestQuestions.length === 8, "Expected learner final test to load 8 questions.");
  assert(learnerCourse.passThresholdLabel.includes("80"), "Expected learner final test to preserve 80% rule.");

  await completeParticipantLessons(
    participant.id,
    lessons.map((lesson) => lesson.id),
  );
  const finalTestAttempt = await verifyFinalTestSubmission(learnerActions, participant, quiz);

  const draftCourse = await prisma.course.upsert({
    create: {
      assignedCreatorId: creator.id,
      certificateEligible: false,
      createdById: creator.id,
      defaultPassThreshold: 80,
      finalTestRequired: false,
      id: "hrba-draft-visibility-fixture",
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription: "Draft visibility verification fixture.",
      shortDescription: "Draft visibility verification fixture.",
      slug: "hrba-draft-visibility-fixture",
      status: CourseStatus.DRAFT,
      targetAudience: "Internal verification",
      title: "HRBA Draft Visibility Fixture",
      visibility: CourseVisibility.PUBLIC,
    },
    update: {
      status: CourseStatus.DRAFT,
      visibility: CourseVisibility.PUBLIC,
    },
    where: { id: "hrba-draft-visibility-fixture" },
  });
  const hiddenDraft = await courseData.getPublicCourseBySlug(draftCourse.slug);
  assert(hiddenDraft === null, "Expected draft/unpublished course to remain hidden publicly.");

  console.log(JSON.stringify({
    assets: importSummary.assets,
    blockTypesVerified: [...blockTypes].sort(),
    blocksImported: blocks.length,
    courseId: course.id,
    courseSlug: course.slug,
    creatorPreviewBlocks: previewData.totalBlocks,
    draftHiddenFromPublic: hiddenDraft === null,
    finalTestAttempt: {
      passed: finalTestAttempt.passed,
      percentage: finalTestAttempt.percentage,
      score: finalTestAttempt.score,
    },
    finalTestQuestions: quiz.questions.length,
    learnerBlocks: learnerCourse.modules.flatMap((module) => module.lessons).flatMap((lesson) => lesson.blocks).length,
    modulesImported: version.modules.length,
    outcomesImported: course.learningOutcomes.length,
    participantProgressSeededComplete: true,
    publicDetail: publicDetail.slug,
    referenceDataVerified: importSummary.referenceDataVerified,
    resourcesImported: course.resources.length,
    status: "ok",
    template: template.selectedTemplateId,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
