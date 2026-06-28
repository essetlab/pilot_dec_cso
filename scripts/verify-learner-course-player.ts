import "dotenv/config";

import {
  ContentBlockType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  QuizQuestionType,
} from "../src/generated/prisma/enums";
import type { Prisma } from "../src/generated/prisma/client";
import { resolve } from "node:path";
import { createJiti } from "jiti";
import { canAccessPath } from "../src/lib/auth/permissions";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { prisma } from "../src/lib/prisma";

const fixtureCourseId = "learner-course-player-fixture";
const fixtureSlug = "learner-course-player-fixture";
const fixtureVersionId = "learner-course-player-version";
const fixtureModuleId = "learner-course-player-module";
const fixtureLessonId = "learner-course-player-lesson";
const draftCourseId = "learner-course-player-draft-fixture";
const draftSlug = "learner-course-player-draft-fixture";

const supportedTypes = [
  ContentBlockType.TEXT,
  ContentBlockType.VIDEO,
  ContentBlockType.IMAGE,
  ContentBlockType.RESOURCE,
  ContentBlockType.CASE_STUDY,
  ContentBlockType.KEY_MESSAGE,
  ContentBlockType.ACCORDION,
  ContentBlockType.FLASHCARD,
  ContentBlockType.KNOWLEDGE_CHECK,
  ContentBlockType.BRANCHING_SCENARIO,
  ContentBlockType.REFLECTION_PROMPT,
  ContentBlockType.PRACTICAL_ACTIVITY_PROMPT,
  ContentBlockType.EXTERNAL_LINK,
] as const;

type SupportedBlockType = (typeof supportedTypes)[number];
type JsonObject = Record<string, unknown>;
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

function blockId(type: SupportedBlockType) {
  return `learner-course-player-${type.toLowerCase()}`;
}

const blockConfigs: Record<SupportedBlockType, JsonObject> = {
  [ContentBlockType.TEXT]: {
    body: "Published learner text block body.\n\nA second paragraph checks readable formatting.",
    heading: "Published text heading",
    readingTimeMinutes: 4,
  },
  [ContentBlockType.VIDEO]: {
    captionsAvailable: true,
    description: "Published video description.",
    durationMinutes: 6,
    sourceType: "external_link",
    sourceUrl: "https://example.org/published-video",
    title: "Published video",
    transcript: "Published transcript for learner preview safety.",
  },
  [ContentBlockType.IMAGE]: {
    altText: "Published image alt text.",
    caption: "Published image caption.",
    displaySize: "wide",
    imageUrl: "https://example.org/published-image.png",
    title: "Published image",
  },
  [ContentBlockType.RESOURCE]: {
    buttonLabel: "Download resource",
    description: "Published resource description.",
    fileName: "published-resource.pdf",
    fileSizeLabel: "200 KB",
    resourceType: "pdf",
    sourceType: "external_link",
    sourceUrl: "https://example.org/published-resource.pdf",
    title: "Published resource",
  },
  [ContentBlockType.CASE_STUDY]: {
    context: "Published case context.",
    guidingQuestion: "What should the team consider first?",
    learningPoint: "A good case links context to a practical learning point.",
    scenario: "Published case scenario text.",
    title: "Published case study",
  },
  [ContentBlockType.KEY_MESSAGE]: {
    message: "Published key message.",
    style: "success",
    supportingText: "Published supporting text.",
    tone: "success",
  },
  [ContentBlockType.ACCORDION]: {
    allowMultipleOpen: true,
    introduction: "Published accordion introduction.",
    items: [
      { body: "Published accordion body A.", id: "item-a", title: "Accordion item A" },
      { body: "Published accordion body B.", id: "item-b", title: "Accordion item B" },
    ],
    title: "Published accordion",
  },
  [ContentBlockType.FLASHCARD]: {
    cards: [
      { back: "Published flashcard back A.", front: "Published flashcard front A", id: "card-a" },
      { back: "Published flashcard back B.", front: "Published flashcard front B", id: "card-b" },
    ],
    displayMode: "grid",
    instructions: "Published flashcard instructions.",
    title: "Published flashcards",
  },
  [ContentBlockType.KNOWLEDGE_CHECK]: {
    correctFeedback: "Published correct feedback.",
    correctOptionId: "option-b",
    helperText: "Published helper text.",
    incorrectFeedback: "Published incorrect feedback.",
    options: [
      { feedback: "Try again.", id: "option-a", isCorrect: false, label: "Option A", text: "Option A" },
      { feedback: "Correct.", id: "option-b", isCorrect: true, label: "Option B", text: "Option B" },
    ],
    question: "Which option is correct?",
    retryAllowed: true,
  },
  [ContentBlockType.BRANCHING_SCENARIO]: {
    allowRetry: true,
    bestOptionId: "choice-b",
    choices: [
      {
        consequence: "Published consequence A.",
        feedback: "Published consequence A.",
        id: "choice-a",
        label: "Choice A",
        outcomeTone: "neutral",
        quality: "neutral",
        text: "Choice A",
      },
      {
        consequence: "Published consequence B.",
        feedback: "Published consequence B.",
        id: "choice-b",
        label: "Choice B",
        outcomeTone: "positive",
        quality: "positive",
        text: "Choice B",
      },
    ],
    context: "Published branching scenario context.",
    decisionPrompt: "Which choice is stronger?",
    decisionQuestion: "Which choice is stronger?",
    learningPoint: "Published branching learning point.",
    scenario: "Published branching scenario context.",
  },
  [ContentBlockType.REFLECTION_PROMPT]: {
    guidanceText: "Published reflection guidance.",
    privacyNote: "Published private response note.",
    prompt: "What will you apply after this course?",
    question: "What will you apply after this course?",
    responseMode: "private_note",
  },
  [ContentBlockType.PRACTICAL_ACTIVITY_PROMPT]: {
    completionGuidance: "Published activity guidance.",
    estimatedTimeMinutes: 20,
    expectedOutput: "Published expected output.",
    guidance: "Published activity guidance.",
    instruction: "Published practical activity instruction.",
    linkedResourceBlockId: blockId(ContentBlockType.RESOURCE),
    materialsNeeded: "Published activity materials.",
    taskInstructions: "Published practical activity instruction.",
    title: "Published practical activity",
  },
  [ContentBlockType.EXTERNAL_LINK]: {
    buttonLabel: "Open link",
    description: "Published external link description.",
    label: "Open link",
    openInNewTab: true,
    title: "Published external link",
    url: "https://example.org/published-link",
  },
};

async function ensureUsers() {
  const creator = await prisma.user.upsert({
    create: {
      email: "learner-preview-creator@demo.local",
      fullName: "Learner Preview Creator",
    },
    update: { fullName: "Learner Preview Creator" },
    where: { email: "learner-preview-creator@demo.local" },
  });
  const participant = await prisma.user.upsert({
    create: {
      email: "learner-preview-participant@demo.local",
      fullName: "Learner Preview Participant",
    },
    update: { fullName: "Learner Preview Participant" },
    where: { email: "learner-preview-participant@demo.local" },
  });

  return { creator, participant };
}

async function createFixture() {
  const { creator, participant } = await ensureUsers();

  let capacityArea = await prisma.capacityArea.findUnique({
    where: { slug: "learner-course-player-verification" },
  });

  if (!capacityArea) {
    capacityArea = await prisma.capacityArea.create({
      data: {
        description: "Learner course player verification capacity area.",
        name: "Learner Course Player Verification",
        slug: "learner-course-player-verification",
      },
    });
  }

  await prisma.course.deleteMany({
    where: {
      OR: [
        { id: fixtureCourseId },
        { slug: fixtureSlug },
        { id: draftCourseId },
        { slug: draftSlug },
      ],
    },
  });

  const course = await prisma.course.create({
    data: {
      assignedCreatorId: creator.id,
      capacityGapAddressed: "Verify learner-facing course player rendering.",
      certificateEligible: true,
      createdById: creator.id,
      defaultPassThreshold: 80,
      estimatedDurationMinutes: 120,
      finalTestRequired: true,
      id: fixtureCourseId,
      intendedPracticeImprovement: "Participants can safely view every saved block type.",
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription:
        "Published fixture used to verify that saved Build Studio content renders as a participant-facing course.\n\nThe fixture includes one saved content block for every supported learner block renderer.",
      shortDescription:
        "Published fixture for verifying learner course player rendering.",
      slug: fixtureSlug,
      status: CourseStatus.PUBLISHED,
      targetAudience: "Local CSO participants",
      targetCsoProfile: "Verification participants",
      title: "Learner Course Player Fixture",
      visibility: CourseVisibility.PUBLIC,
    },
  });

  await prisma.courseCapacityArea.create({
    data: {
      capacityAreaId: capacityArea.id,
      courseId: course.id,
    },
  });

  await prisma.learningOutcome.createMany({
    data: [
      {
        courseId: course.id,
        order: 1,
        statement: "View saved course blocks in the learner course player.",
      },
      {
        courseId: course.id,
        order: 2,
        statement: "Use interactive checks and activities safely.",
      },
    ],
  });

  await prisma.courseVersion.create({
    data: {
      changeNotes: "Published learner player verification version.",
      courseId: course.id,
      createdById: creator.id,
      id: fixtureVersionId,
      publishedAt: new Date(),
      publishedById: creator.id,
      status: CourseStatus.PUBLISHED,
      versionNumber: 1,
    },
  });

  await prisma.module.create({
    data: {
      courseVersionId: fixtureVersionId,
      description: "Verification module for learner block rendering.",
      estimatedDurationMinutes: 120,
      id: fixtureModuleId,
      order: 1,
      title: "Learner renderer verification",
    },
  });

  await prisma.lesson.create({
    data: {
      completionRequired: true,
      description: "This lesson includes every supported learner block type.",
      estimatedDurationMinutes: 120,
      id: fixtureLessonId,
      moduleId: fixtureModuleId,
      order: 1,
      title: "All supported learner blocks",
    },
  });

  await prisma.contentBlock.createMany({
    data: supportedTypes.map((type, index) => ({
      configJson: blockConfigs[type] as Prisma.InputJsonValue,
      estimatedDurationMinutes: type === ContentBlockType.TEXT ? 4 : 6,
      id: blockId(type),
      isRequired: true,
      lessonId: fixtureLessonId,
      order: index + 1,
      title: `Published ${type.replace(/_/g, " ").toLowerCase()} block`,
      type,
    })),
  });

  const quiz = await prisma.quiz.create({
    data: {
      courseVersionId: fixtureVersionId,
      description: "Final test for learner course player verification.",
      id: "learner-course-player-final-test",
      isFinalTest: true,
      passThreshold: 80,
      retakeAllowed: true,
      title: "Final Test",
    },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        configJson: {
          correctAnswer: "Option B",
          options: ["Option A", "Option B", "Option C", "Option D"],
        } as Prisma.InputJsonValue,
        order: 1,
        points: 1,
        questionText: "Which option is correct for the learner fixture?",
        quizId: quiz.id,
        type: QuizQuestionType.MULTIPLE_CHOICE,
      },
      {
        configJson: {
          correctAnswer: "true",
          options: ["True", "False"],
        } as Prisma.InputJsonValue,
        order: 2,
        points: 1,
        questionText: "The learner fixture uses saved Build Studio blocks.",
        quizId: quiz.id,
        type: QuizQuestionType.TRUE_FALSE,
      },
    ],
  });

  await prisma.course.create({
    data: {
      assignedCreatorId: creator.id,
      certificateEligible: false,
      createdById: creator.id,
      id: draftCourseId,
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      shortDescription: "Draft course that must stay hidden from public routes.",
      slug: draftSlug,
      status: CourseStatus.DRAFT,
      title: "Draft Learner Course Player Fixture",
      visibility: CourseVisibility.PUBLIC,
    },
  });

  return {
    creatorSession: sessionFor(creator, ["COURSE_CREATOR"]),
    participant,
    participantSession: sessionFor(participant, ["PARTICIPANT"]),
  };
}

async function main() {
  const { creatorSession, participant, participantSession } = await createFixture();
  const { courseData, creatorPreviewData } = loadDataModules();

  const publicDetail = await courseData.getPublicCourseBySlug(fixtureSlug);
  assert(publicDetail, "Expected published fixture to resolve on public detail.");
  assert(publicDetail.modules.length === 1, "Expected public detail module outline.");
  assert(publicDetail.outcomes.length === 2, "Expected public detail learning outcomes.");
  assert(publicDetail.longDescription.includes("saved Build Studio content"), "Expected public detail long description.");

  const draftDetail = await courseData.getPublicCourseBySlug(draftSlug);
  assert(!draftDetail, "Expected draft fixture to be hidden from public detail.");

  const publicSummaries = await courseData.getPublicCourseSummaries();
  assert(
    publicSummaries.some((course) => course.slug === fixtureSlug),
    "Expected published fixture in public catalogue data.",
  );
  assert(
    !publicSummaries.some((course) => course.slug === draftSlug),
    "Expected draft fixture to be hidden from public catalogue data.",
  );

  courseData.setMockSession({ email: participant.email });
  const learnerCourse = await courseData.getLearnerCourseBySlug(fixtureSlug);
  courseData.setMockSession(null);
  assert(learnerCourse, "Expected published fixture to resolve for participant.");
  assert(learnerCourse.finalTestQuestions.length === 2, "Expected final test questions.");
  assert(learnerCourse.modules.length === 1, "Expected learner module outline.");

  const learnerBlocks = learnerCourse.modules.flatMap((module) =>
    module.lessons.flatMap((lesson) => lesson.blocks),
  );
  const actualTypes = new Set(learnerBlocks.map((block) => block.type));
  for (const type of supportedTypes) {
    assert(actualTypes.has(type), `Expected learner course player data to include ${type}.`);
  }

  const previewData = await creatorPreviewData.getCreatorPreviewData(fixtureCourseId, creatorSession);
  assert(previewData, "Expected creator preview data for published fixture.");
  assert(previewData.totalBlocks === supportedTypes.length, "Expected creator preview to include all supported blocks.");
  assert(previewData.modules[0]?.lessons[0]?.blocks.length === supportedTypes.length, "Expected preview lesson block list.");

  assert(
    !canAccessPath(participantSession, `/creator/courses/${fixtureCourseId}/build`),
    "Expected participant to be blocked from creator Build Studio route.",
  );

  console.log(
    JSON.stringify(
      {
        blockTypesVerified: supportedTypes,
        creatorPreviewBlocks: previewData.totalBlocks,
        draftHiddenFromPublic: true,
        finalTestQuestions: learnerCourse.finalTestQuestions.length,
        learnerBlocks: learnerBlocks.length,
        participantCreatorAccessBlocked: true,
        publicDetail: publicDetail.slug,
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
