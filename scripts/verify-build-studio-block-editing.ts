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
import { canAccessPath } from "../src/lib/auth/permissions";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { getBuildStudioCourse } from "../src/lib/build-studio-data";
import { getCreatorPreviewData } from "../src/lib/creator-preview-data";
import { prisma } from "../src/lib/prisma";

const fixtureCourseId = "build-studio-block-editing-fixture";
const fixtureSlug = "build-studio-block-editing-fixture";
const fixtureVersionId = "build-studio-block-editing-version";
const fixtureModuleId = "build-studio-block-editing-module";
const fixtureLessonId = "build-studio-block-editing-lesson";

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
type BuildStudioActions = Record<string, (formData: FormData) => Promise<void>>;

type FixtureBlock = {
  id: string;
  order: number;
  title: string;
  type: SupportedBlockType;
  initialConfig: JsonObject;
  editedConfig: JsonObject;
  expectedKeys: string[];
};

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
  return `build-studio-block-editing-${type.toLowerCase()}`;
}

function loadBuildStudioActions() {
  const jiti = createJiti(import.meta.url, {
    alias: {
      "@": resolve("./src"),
      "server-only": resolve("./scripts/server-only-stub.js"),
    },
  });

  return jiti(resolve("./src/lib/build-studio-actions.ts")) as BuildStudioActions;
}

function formDataFromEntries(entries: Record<string, string | number | boolean | null | undefined>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    if (value === null || value === undefined || value === false) {
      continue;
    }

    formData.append(key, value === true ? "on" : String(value));
  }

  return formData;
}

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

function isScriptOnlyRevalidatePathError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("static generation store missing in revalidatePath")
  );
}

async function runAction(
  actions: BuildStudioActions,
  actionName: string,
  entries: Record<string, string | number | boolean | null | undefined>,
) {
  const action = actions[actionName];

  assert(action, `Missing Build Studio action ${actionName}.`);

  try {
    await action(formDataFromEntries(entries));
  } catch (error) {
    if (isNextRedirect(error) || isScriptOnlyRevalidatePathError(error)) {
      return;
    }

    throw error;
  }
}

function baseBlockEntries(block: FixtureBlock) {
  return {
    blockId: block.id,
    courseId: fixtureCourseId,
    isRequired: true,
    lessonId: fixtureLessonId,
    title: `Verified ${block.title}`,
  };
}

const fixtureBlocks: FixtureBlock[] = [
  {
    editedConfig: {
      body: "Verified edited body for the draft fixture text block.",
      heading: "Verified text heading",
      readingTimeMinutes: 4,
      width: "standard",
    },
    expectedKeys: ["heading", "body", "readingTimeMinutes"],
    id: blockId(ContentBlockType.TEXT),
    initialConfig: {
      body: "Initial text body.",
      heading: "Initial text heading",
      readingTimeMinutes: 2,
      width: "standard",
    },
    order: 1,
    title: "Text verification block",
    type: ContentBlockType.TEXT,
  },
  {
    editedConfig: {
      captionsAvailable: true,
      description: "Verified video description.",
      durationMinutes: 7,
      sourceType: "external_link",
      sourceUrl: "https://example.org/verified-video",
      thumbnailUrl: "https://example.org/verified-video.jpg",
      title: "Verified video title",
      transcript: "Verified transcript for the Build Studio video block.",
    },
    expectedKeys: ["sourceUrl", "transcript", "durationMinutes"],
    id: blockId(ContentBlockType.VIDEO),
    initialConfig: {
      captionsAvailable: false,
      description: "Initial video description.",
      durationMinutes: 3,
      sourceType: "external_link",
      sourceUrl: "https://example.org/initial-video",
      thumbnailUrl: "",
      title: "Initial video title",
      transcript: "Initial transcript.",
    },
    order: 2,
    title: "Video verification block",
    type: ContentBlockType.VIDEO,
  },
  {
    editedConfig: {
      altText: "Verified alt text describing the fixture image.",
      caption: "Verified image caption.",
      displaySize: "wide",
      imageUrl: "https://example.org/verified-image.png",
      title: "Verified image title",
    },
    expectedKeys: ["imageUrl", "altText", "caption"],
    id: blockId(ContentBlockType.IMAGE),
    initialConfig: {
      altText: "Initial alt text.",
      caption: "Initial image caption.",
      displaySize: "standard",
      imageUrl: "https://example.org/initial-image.png",
      title: "Initial image title",
    },
    order: 3,
    title: "Image verification block",
    type: ContentBlockType.IMAGE,
  },
  {
    editedConfig: {
      buttonLabel: "Download verified resource",
      description: "Verified resource description.",
      fileName: "verified-resource.pdf",
      fileSizeLabel: "240 KB",
      resourceType: "pdf",
      sourceType: "external_link",
      sourceUrl: "https://example.org/verified-resource.pdf",
      title: "Verified resource title",
    },
    expectedKeys: ["description", "sourceUrl", "buttonLabel"],
    id: blockId(ContentBlockType.RESOURCE),
    initialConfig: {
      buttonLabel: "Open resource",
      description: "Initial resource description.",
      fileName: "initial-resource.pdf",
      fileSizeLabel: "100 KB",
      resourceType: "pdf",
      sourceType: "external_link",
      sourceUrl: "https://example.org/initial-resource.pdf",
      title: "Initial resource title",
    },
    order: 4,
    title: "Resource verification block",
    type: ContentBlockType.RESOURCE,
  },
  {
    editedConfig: {
      context: "Verified CSO context for the case study.",
      discussionQuestion: "How would your team adapt this approach?",
      guidingQuestion: "What risk should the CSO handle first?",
      learningPoint: "A fundable case links evidence to practical action.",
      scenario: "Verified scenario text for the case study block.",
      title: "Verified case study title",
    },
    expectedKeys: ["context", "scenario", "guidingQuestion", "learningPoint"],
    id: blockId(ContentBlockType.CASE_STUDY),
    initialConfig: {
      context: "Initial case context.",
      discussionQuestion: "Initial discussion question?",
      guidingQuestion: "Initial guiding question?",
      learningPoint: "Initial learning point.",
      scenario: "Initial scenario.",
      title: "Initial case title",
    },
    order: 5,
    title: "Case study verification block",
    type: ContentBlockType.CASE_STUDY,
  },
  {
    editedConfig: {
      message: "Verified key message learners should remember.",
      style: "success",
      supportingText: "Verified supporting text for the key message.",
      tone: "success",
    },
    expectedKeys: ["message", "supportingText", "style", "tone"],
    id: blockId(ContentBlockType.KEY_MESSAGE),
    initialConfig: {
      message: "Initial key message.",
      style: "info",
      supportingText: "Initial supporting text.",
      tone: "info",
    },
    order: 6,
    title: "Key message verification block",
    type: ContentBlockType.KEY_MESSAGE,
  },
  {
    editedConfig: {
      allowMultipleOpen: true,
      introduction: "Verified accordion introduction.",
      items: [
        {
          body: "Verified accordion body A.",
          id: "item-a",
          title: "Verified accordion item A",
        },
        {
          body: "Verified accordion body C after remove.",
          id: "item-c",
          title: "Verified accordion item C",
        },
      ],
      title: "Verified accordion title",
    },
    expectedKeys: ["introduction", "items", "allowMultipleOpen"],
    id: blockId(ContentBlockType.ACCORDION),
    initialConfig: {
      allowMultipleOpen: false,
      introduction: "Initial accordion introduction.",
      items: [
        { body: "Initial accordion body A.", id: "item-a", title: "Initial item A" },
      ],
      title: "Initial accordion title",
    },
    order: 7,
    title: "Accordion verification block",
    type: ContentBlockType.ACCORDION,
  },
  {
    editedConfig: {
      cards: [
        {
          back: "Verified flashcard back A.",
          front: "Verified flashcard front A",
          id: "card-a",
        },
        {
          back: "Verified flashcard back C after remove.",
          front: "Verified flashcard front C",
          id: "card-c",
        },
      ],
      displayMode: "stack",
      instructions: "Verified flashcard instructions.",
      title: "Verified flashcards title",
    },
    expectedKeys: ["instructions", "cards", "displayMode"],
    id: blockId(ContentBlockType.FLASHCARD),
    initialConfig: {
      cards: [
        {
          back: "Initial flashcard back A.",
          front: "Initial flashcard front A",
          id: "card-a",
        },
      ],
      displayMode: "grid",
      instructions: "Initial flashcard instructions.",
      title: "Initial flashcards title",
    },
    order: 8,
    title: "Flashcards verification block",
    type: ContentBlockType.FLASHCARD,
  },
  {
    editedConfig: {
      correctFeedback: "Verified correct feedback.",
      correctOptionId: "option-c",
      helperText: "Verified helper text.",
      incorrectFeedback: "Verified incorrect feedback.",
      options: [
        {
          feedback: "Verified feedback for option A.",
          id: "option-a",
          isCorrect: false,
          label: "Verified option A",
          text: "Verified option A",
        },
        {
          feedback: "Verified feedback for option C.",
          id: "option-c",
          isCorrect: true,
          label: "Verified option C",
          text: "Verified option C",
        },
      ],
      question: "Which option is verified as correct?",
      questionType: "single_choice",
      retryAllowed: true,
    },
    expectedKeys: ["question", "options", "correctOptionId", "correctFeedback"],
    id: blockId(ContentBlockType.KNOWLEDGE_CHECK),
    initialConfig: {
      correctFeedback: "Initial correct feedback.",
      correctOptionId: "option-a",
      helperText: "Initial helper text.",
      incorrectFeedback: "Initial incorrect feedback.",
      options: [
        {
          feedback: "Initial feedback A.",
          id: "option-a",
          isCorrect: true,
          label: "Initial option A",
          text: "Initial option A",
        },
        {
          feedback: "Initial feedback B.",
          id: "option-b",
          isCorrect: false,
          label: "Initial option B",
          text: "Initial option B",
        },
      ],
      question: "Initial knowledge check question?",
      questionType: "single_choice",
      retryAllowed: false,
    },
    order: 9,
    title: "Knowledge check verification block",
    type: ContentBlockType.KNOWLEDGE_CHECK,
  },
  {
    editedConfig: {
      allowRetry: true,
      bestOptionId: "choice-c",
      choices: [
        {
          consequence: "Verified consequence for choice A.",
          feedback: "Verified consequence for choice A.",
          id: "choice-a",
          label: "Verified choice A",
          outcomeTone: "neutral",
          quality: "neutral",
          text: "Verified choice A",
        },
        {
          consequence: "Verified consequence for choice C.",
          feedback: "Verified consequence for choice C.",
          id: "choice-c",
          label: "Verified choice C",
          outcomeTone: "positive",
          quality: "positive",
          text: "Verified choice C",
        },
      ],
      context: "Verified branching scenario context.",
      decisionPrompt: "Which verified option should the learner choose?",
      decisionQuestion: "Which verified option should the learner choose?",
      learningPoint: "Verified branching learning point.",
      options: [
        {
          consequence: "Verified consequence for choice A.",
          feedback: "Verified consequence for choice A.",
          id: "choice-a",
          label: "Verified choice A",
          outcomeTone: "neutral",
          quality: "neutral",
          text: "Verified choice A",
        },
        {
          consequence: "Verified consequence for choice C.",
          feedback: "Verified consequence for choice C.",
          id: "choice-c",
          label: "Verified choice C",
          outcomeTone: "positive",
          quality: "positive",
          text: "Verified choice C",
        },
      ],
      retryAllowed: true,
      scenario: "Verified branching scenario context.",
    },
    expectedKeys: ["context", "decisionQuestion", "choices", "bestOptionId"],
    id: blockId(ContentBlockType.BRANCHING_SCENARIO),
    initialConfig: {
      allowRetry: false,
      bestOptionId: "choice-a",
      choices: [
        {
          consequence: "Initial consequence A.",
          feedback: "Initial consequence A.",
          id: "choice-a",
          label: "Initial choice A",
          outcomeTone: "positive",
          quality: "positive",
          text: "Initial choice A",
        },
        {
          consequence: "Initial consequence B.",
          feedback: "Initial consequence B.",
          id: "choice-b",
          label: "Initial choice B",
          outcomeTone: "caution",
          quality: "caution",
          text: "Initial choice B",
        },
      ],
      context: "Initial branching context.",
      decisionPrompt: "Initial decision prompt?",
      decisionQuestion: "Initial decision prompt?",
      learningPoint: "Initial branching learning point.",
      options: [],
      retryAllowed: false,
      scenario: "Initial branching context.",
    },
    order: 10,
    title: "Branching scenario verification block",
    type: ContentBlockType.BRANCHING_SCENARIO,
  },
  {
    editedConfig: {
      guidanceText: "Verified reflection guidance.",
      privateToParticipant: true,
      privacyNote: "Verified private response note.",
      prompt: "What verified idea will you apply next?",
      question: "What verified idea will you apply next?",
      responseMode: "private_note",
      responseRequired: true,
      title: "Verified reflection title",
    },
    expectedKeys: ["question", "prompt", "guidanceText", "privacyNote"],
    id: blockId(ContentBlockType.REFLECTION_PROMPT),
    initialConfig: {
      guidanceText: "Initial reflection guidance.",
      privateToParticipant: false,
      privacyNote: "Initial privacy note.",
      prompt: "Initial reflection prompt?",
      question: "Initial reflection prompt?",
      responseMode: "thinking_only",
      responseRequired: false,
      title: "Initial reflection title",
    },
    order: 11,
    title: "Reflection verification block",
    type: ContentBlockType.REFLECTION_PROMPT,
  },
  {
    editedConfig: {
      completionGuidance: "Verified guidance after completing the activity.",
      estimatedTimeMinutes: 25,
      expectedOutput: "Verified expected output.",
      guidance: "Verified guidance after completing the activity.",
      instruction: "Verified practical activity instructions.",
      linkedResourceBlockId: blockId(ContentBlockType.RESOURCE),
      materialsNeeded: "Verified activity materials.",
      taskInstructions: "Verified practical activity instructions.",
      title: "Verified practical activity title",
    },
    expectedKeys: ["taskInstructions", "instruction", "expectedOutput", "estimatedTimeMinutes"],
    id: blockId(ContentBlockType.PRACTICAL_ACTIVITY_PROMPT),
    initialConfig: {
      completionGuidance: "Initial activity guidance.",
      estimatedTimeMinutes: 15,
      expectedOutput: "Initial expected output.",
      guidance: "Initial activity guidance.",
      instruction: "Initial practical activity instructions.",
      linkedResourceBlockId: "",
      materialsNeeded: "Initial activity materials.",
      taskInstructions: "Initial practical activity instructions.",
      title: "Initial practical activity title",
    },
    order: 12,
    title: "Practical activity verification block",
    type: ContentBlockType.PRACTICAL_ACTIVITY_PROMPT,
  },
  {
    editedConfig: {
      buttonLabel: "Open verified link",
      description: "Verified external link description.",
      label: "Open verified link",
      openInNewTab: true,
      title: "Verified external link title",
      url: "https://example.org/verified-link",
    },
    expectedKeys: ["url", "description", "buttonLabel", "label"],
    id: blockId(ContentBlockType.EXTERNAL_LINK),
    initialConfig: {
      buttonLabel: "Open link",
      description: "Initial external link description.",
      label: "Open link",
      openInNewTab: true,
      title: "Initial external link title",
      url: "https://example.org/initial-link",
    },
    order: 13,
    title: "External link verification block",
    type: ContentBlockType.EXTERNAL_LINK,
  },
];

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value as JsonObject)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function assertConfigValue(
  actualConfig: unknown,
  expectedConfig: JsonObject,
  key: string,
  blockType: SupportedBlockType,
) {
  assert(actualConfig && typeof actualConfig === "object", `${blockType} config must be an object.`);

  const actualValue = (actualConfig as JsonObject)[key];
  const expectedValue = expectedConfig[key];

  assert(
    stableStringify(actualValue) === stableStringify(expectedValue),
    `${blockType} expected ${key}=${stableStringify(expectedValue)}, got ${stableStringify(actualValue)}.`,
  );
}

async function createFixture() {
  const [creator, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);

  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(participant, "Missing seeded Participant user. Run npm run db:seed first.");

  let capacityArea = await prisma.capacityArea.findFirst({
    orderBy: { name: "asc" },
  });

  if (!capacityArea) {
    capacityArea = await prisma.capacityArea.create({
      data: {
        description: "Build Studio block editing verification capacity area.",
        name: "Build Studio Verification",
        slug: "build-studio-verification",
      },
    });
  }

  await prisma.course.deleteMany({
    where: {
      OR: [{ id: fixtureCourseId }, { slug: fixtureSlug }],
    },
  });

  const course = await prisma.course.create({
    data: {
      assignedCreatorId: creator.id,
      capacityGapAddressed: "Verify Build Studio block editing and persistence.",
      certificateEligible: false,
      createdById: creator.id,
      defaultPassThreshold: 80,
      estimatedDurationMinutes: 90,
      finalTestRequired: false,
      id: fixtureCourseId,
      intendedPracticeImprovement: "Creators can safely configure every supported lesson block.",
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription: "Temporary draft fixture for Build Studio block editing verification.",
      shortDescription: "Draft fixture for verifying Build Studio block editing.",
      slug: fixtureSlug,
      status: CourseStatus.DRAFT,
      targetAudience: "Course creators",
      targetCsoProfile: "Verification course",
      title: "Build Studio Block Editing Fixture",
      visibility: CourseVisibility.PRIVATE,
    },
  });

  await prisma.courseCapacityArea.create({
    data: {
      capacityAreaId: capacityArea.id,
      courseId: course.id,
    },
  });

  await prisma.learningOutcome.create({
    data: {
      courseId: course.id,
      order: 1,
      statement: "Configure and preview each supported Build Studio block type.",
    },
  });

  await prisma.courseVersion.create({
    data: {
      changeNotes: "Build Studio block editing verification version.",
      courseId: course.id,
      createdById: creator.id,
      id: fixtureVersionId,
      status: CourseStatus.DRAFT,
      versionNumber: 1,
    },
  });

  await prisma.module.create({
    data: {
      courseVersionId: fixtureVersionId,
      description: "Single-module fixture for block editing checks.",
      estimatedDurationMinutes: 90,
      id: fixtureModuleId,
      order: 1,
      title: "Build Studio verification module",
    },
  });

  await prisma.lesson.create({
    data: {
      completionRequired: true,
      description: "Contains one block of each supported Build Studio type.",
      estimatedDurationMinutes: 90,
      id: fixtureLessonId,
      moduleId: fixtureModuleId,
      order: 1,
      title: "All supported block types",
    },
  });

  await prisma.contentBlock.createMany({
    data: fixtureBlocks.map((block) => ({
      configJson: block.initialConfig as Prisma.InputJsonValue,
      estimatedDurationMinutes: block.type === ContentBlockType.TEXT ? 2 : 5,
      id: block.id,
      isRequired: true,
      lessonId: fixtureLessonId,
      order: block.order,
      title: block.title,
      type: block.type,
    })),
  });

  return {
    creatorSession: sessionFor(creator, ["COURSE_CREATOR"]),
    participantSession: sessionFor(participant, ["PARTICIPANT"]),
  };
}

async function assertFixtureShape(creatorSession: AuthSession) {
  const studioCourse = await getBuildStudioCourse(
    fixtureCourseId,
    creatorSession,
    fixtureLessonId,
    fixtureBlocks[0]?.id,
  );

  assert(studioCourse.source === "database", "Expected fixture to load from database.");
  assert(studioCourse.canEditOutline, "Expected fixture draft course to be editable.");
  assert(studioCourse.modules.length === 1, "Expected one fixture module.");
  assert(studioCourse.modules[0]?.lessons.length === 1, "Expected one fixture lesson.");
  assert(studioCourse.selectedLesson?.id === fixtureLessonId, "Expected fixture lesson to be selected.");
  assert(studioCourse.selectedBlock?.id === fixtureBlocks[0]?.id, "Expected selected block state to resolve.");

  const blocks = studioCourse.modules.flatMap((module) =>
    module.lessons.flatMap((lesson) => lesson.blocks),
  );
  const actualTypes = new Set(blocks.map((block) => block.type));

  for (const type of supportedTypes) {
    assert(actualTypes.has(type), `Expected fixture to include ${type}.`);
  }

  assert(
    blocks.every((block) => block.typeLabel && typeof block.summary === "string"),
    "Expected every fixture block to expose a canvas label and summary.",
  );
}

async function applyEditedConfigsThroughActions(creatorSession: AuthSession) {
  (globalThis as { __mockSession?: AuthSession }).__mockSession = creatorSession;
  const actions = loadBuildStudioActions();
  const byType = new Map(fixtureBlocks.map((block) => [block.type, block]));

  const text = byType.get(ContentBlockType.TEXT);
  assert(text, "Missing TEXT fixture block.");
  await runAction(actions, "updateBuildStudioTextBlock", {
    ...baseBlockEntries(text),
    body: String(text.editedConfig.body),
    heading: String(text.editedConfig.heading),
    readingTimeMinutes: 4,
  });

  const video = byType.get(ContentBlockType.VIDEO);
  assert(video, "Missing VIDEO fixture block.");
  await runAction(actions, "updateBuildStudioVideoBlock", {
    ...baseBlockEntries(video),
    captionsAvailable: true,
    description: String(video.editedConfig.description),
    durationMinutes: 7,
    sourceType: String(video.editedConfig.sourceType),
    sourceUrl: String(video.editedConfig.sourceUrl),
    thumbnailUrl: String(video.editedConfig.thumbnailUrl),
    transcript: String(video.editedConfig.transcript),
  });

  const image = byType.get(ContentBlockType.IMAGE);
  assert(image, "Missing IMAGE fixture block.");
  await runAction(actions, "updateBuildStudioImageBlock", {
    ...baseBlockEntries(image),
    altText: String(image.editedConfig.altText),
    caption: String(image.editedConfig.caption),
    displaySize: String(image.editedConfig.displaySize),
    imageUrl: String(image.editedConfig.imageUrl),
  });

  const resource = byType.get(ContentBlockType.RESOURCE);
  assert(resource, "Missing RESOURCE fixture block.");
  await runAction(actions, "updateBuildStudioResourceBlock", {
    ...baseBlockEntries(resource),
    buttonLabel: String(resource.editedConfig.buttonLabel),
    description: String(resource.editedConfig.description),
    fileName: String(resource.editedConfig.fileName),
    fileSizeLabel: String(resource.editedConfig.fileSizeLabel),
    resourceType: String(resource.editedConfig.resourceType),
    sourceType: String(resource.editedConfig.sourceType),
    sourceUrl: String(resource.editedConfig.sourceUrl),
  });

  const caseStudy = byType.get(ContentBlockType.CASE_STUDY);
  assert(caseStudy, "Missing CASE_STUDY fixture block.");
  await runAction(actions, "updateBuildStudioCaseStudyBlock", {
    ...baseBlockEntries(caseStudy),
    context: String(caseStudy.editedConfig.context),
    discussionQuestion: String(caseStudy.editedConfig.discussionQuestion),
    guidingQuestion: String(caseStudy.editedConfig.guidingQuestion),
    learningPoint: String(caseStudy.editedConfig.learningPoint),
    scenario: String(caseStudy.editedConfig.scenario),
  });

  const keyMessage = byType.get(ContentBlockType.KEY_MESSAGE);
  assert(keyMessage, "Missing KEY_MESSAGE fixture block.");
  await runAction(actions, "updateBuildStudioKeyMessageBlock", {
    ...baseBlockEntries(keyMessage),
    message: String(keyMessage.editedConfig.message),
    style: String(keyMessage.editedConfig.style),
    supportingText: String(keyMessage.editedConfig.supportingText),
  });

  const accordion = byType.get(ContentBlockType.ACCORDION);
  assert(accordion, "Missing ACCORDION fixture block.");
  await runAction(actions, "updateBuildStudioAccordionBlock", {
    ...baseBlockEntries(accordion),
    allowMultipleOpen: true,
    introduction: String(accordion.editedConfig.introduction),
    itemBody: undefined,
    itemBody0: undefined,
    itemCount: 2,
    itemId: undefined,
    "itemBody-0": "Verified accordion body A.",
    "itemBody-1": "Temporary accordion body B.",
    "itemId-0": "item-a",
    "itemId-1": "item-b",
    "itemTitle-0": "Verified accordion item A",
    "itemTitle-1": "Temporary accordion item B",
    repeatableIntent: "add-accordion-item",
  });
  await runAction(actions, "updateBuildStudioAccordionBlock", {
    ...baseBlockEntries(accordion),
    allowMultipleOpen: true,
    introduction: String(accordion.editedConfig.introduction),
    itemCount: 3,
    "itemBody-0": "Verified accordion body A.",
    "itemBody-1": "Temporary accordion body B.",
    "itemBody-2": "Verified accordion body C after remove.",
    "itemId-0": "item-a",
    "itemId-1": "item-b",
    "itemId-2": "item-c",
    "itemTitle-0": "Verified accordion item A",
    "itemTitle-1": "Temporary accordion item B",
    "itemTitle-2": "Verified accordion item C",
    repeatableIntent: "remove-accordion-item-1",
  });

  const flashcard = byType.get(ContentBlockType.FLASHCARD);
  assert(flashcard, "Missing FLASHCARD fixture block.");
  await runAction(actions, "updateBuildStudioFlashcardsBlock", {
    ...baseBlockEntries(flashcard),
    cardCount: 2,
    "cardBack-0": "Verified flashcard back A.",
    "cardBack-1": "Temporary flashcard back B.",
    "cardFront-0": "Verified flashcard front A",
    "cardFront-1": "Temporary flashcard front B",
    "cardId-0": "card-a",
    "cardId-1": "card-b",
    displayMode: String(flashcard.editedConfig.displayMode),
    instructions: String(flashcard.editedConfig.instructions),
    repeatableIntent: "add-flashcard",
  });
  await runAction(actions, "updateBuildStudioFlashcardsBlock", {
    ...baseBlockEntries(flashcard),
    cardCount: 3,
    "cardBack-0": "Verified flashcard back A.",
    "cardBack-1": "Temporary flashcard back B.",
    "cardBack-2": "Verified flashcard back C after remove.",
    "cardFront-0": "Verified flashcard front A",
    "cardFront-1": "Temporary flashcard front B",
    "cardFront-2": "Verified flashcard front C",
    "cardId-0": "card-a",
    "cardId-1": "card-b",
    "cardId-2": "card-c",
    displayMode: String(flashcard.editedConfig.displayMode),
    instructions: String(flashcard.editedConfig.instructions),
    repeatableIntent: "remove-flashcard-1",
  });

  const knowledgeCheck = byType.get(ContentBlockType.KNOWLEDGE_CHECK);
  assert(knowledgeCheck, "Missing KNOWLEDGE_CHECK fixture block.");
  await runAction(actions, "updateBuildStudioKnowledgeCheckBlock", {
    ...baseBlockEntries(knowledgeCheck),
    correctFeedback: String(knowledgeCheck.editedConfig.correctFeedback),
    correctOptionId: "option-c",
    helperText: String(knowledgeCheck.editedConfig.helperText),
    incorrectFeedback: String(knowledgeCheck.editedConfig.incorrectFeedback),
    optionCount: 2,
    "optionFeedback-0": "Verified feedback for option A.",
    "optionFeedback-1": "Temporary feedback for option B.",
    "optionId-0": "option-a",
    "optionId-1": "option-b",
    "optionLabel-0": "Verified option A",
    "optionLabel-1": "Temporary option B",
    question: String(knowledgeCheck.editedConfig.question),
    repeatableIntent: "add-knowledge-option",
    retryAllowed: true,
  });
  await runAction(actions, "updateBuildStudioKnowledgeCheckBlock", {
    ...baseBlockEntries(knowledgeCheck),
    correctFeedback: String(knowledgeCheck.editedConfig.correctFeedback),
    correctOptionId: "option-c",
    helperText: String(knowledgeCheck.editedConfig.helperText),
    incorrectFeedback: String(knowledgeCheck.editedConfig.incorrectFeedback),
    optionCount: 3,
    "optionFeedback-0": "Verified feedback for option A.",
    "optionFeedback-1": "Temporary feedback for option B.",
    "optionFeedback-2": "Verified feedback for option C.",
    "optionId-0": "option-a",
    "optionId-1": "option-b",
    "optionId-2": "option-c",
    "optionLabel-0": "Verified option A",
    "optionLabel-1": "Temporary option B",
    "optionLabel-2": "Verified option C",
    question: String(knowledgeCheck.editedConfig.question),
    repeatableIntent: "remove-knowledge-option-1",
    retryAllowed: true,
  });

  const branching = byType.get(ContentBlockType.BRANCHING_SCENARIO);
  assert(branching, "Missing BRANCHING_SCENARIO fixture block.");
  await runAction(actions, "updateBuildStudioBranchingScenarioBlock", {
    ...baseBlockEntries(branching),
    allowRetry: true,
    bestOptionId: "choice-c",
    choiceCount: 2,
    "choiceFeedback-0": "Verified consequence for choice A.",
    "choiceFeedback-1": "Temporary consequence for choice B.",
    "choiceId-0": "choice-a",
    "choiceId-1": "choice-b",
    "choiceLabel-0": "Verified choice A",
    "choiceLabel-1": "Temporary choice B",
    "choiceOutcomeTone-0": "neutral",
    "choiceOutcomeTone-1": "caution",
    context: String(branching.editedConfig.context),
    decisionQuestion: String(branching.editedConfig.decisionQuestion),
    learningPoint: String(branching.editedConfig.learningPoint),
    repeatableIntent: "add-branching-choice",
  });
  await runAction(actions, "updateBuildStudioBranchingScenarioBlock", {
    ...baseBlockEntries(branching),
    allowRetry: true,
    bestOptionId: "choice-c",
    choiceCount: 3,
    "choiceFeedback-0": "Verified consequence for choice A.",
    "choiceFeedback-1": "Temporary consequence for choice B.",
    "choiceFeedback-2": "Verified consequence for choice C.",
    "choiceId-0": "choice-a",
    "choiceId-1": "choice-b",
    "choiceId-2": "choice-c",
    "choiceLabel-0": "Verified choice A",
    "choiceLabel-1": "Temporary choice B",
    "choiceLabel-2": "Verified choice C",
    "choiceOutcomeTone-0": "neutral",
    "choiceOutcomeTone-1": "caution",
    "choiceOutcomeTone-2": "positive",
    context: String(branching.editedConfig.context),
    decisionQuestion: String(branching.editedConfig.decisionQuestion),
    learningPoint: String(branching.editedConfig.learningPoint),
    repeatableIntent: "remove-branching-choice-1",
  });

  const reflection = byType.get(ContentBlockType.REFLECTION_PROMPT);
  assert(reflection, "Missing REFLECTION_PROMPT fixture block.");
  await runAction(actions, "updateBuildStudioReflectionBlock", {
    ...baseBlockEntries(reflection),
    guidanceText: String(reflection.editedConfig.guidanceText),
    privacyNote: String(reflection.editedConfig.privacyNote),
    question: String(reflection.editedConfig.question),
    responseMode: String(reflection.editedConfig.responseMode),
  });

  const practical = byType.get(ContentBlockType.PRACTICAL_ACTIVITY_PROMPT);
  assert(practical, "Missing PRACTICAL_ACTIVITY_PROMPT fixture block.");
  await runAction(actions, "updateBuildStudioPracticalActivityBlock", {
    ...baseBlockEntries(practical),
    completionGuidance: String(practical.editedConfig.completionGuidance),
    estimatedTimeMinutes: 25,
    expectedOutput: String(practical.editedConfig.expectedOutput),
    linkedResourceBlockId: String(practical.editedConfig.linkedResourceBlockId),
    materialsNeeded: String(practical.editedConfig.materialsNeeded),
    taskInstructions: String(practical.editedConfig.taskInstructions),
  });

  const externalLink = byType.get(ContentBlockType.EXTERNAL_LINK);
  assert(externalLink, "Missing EXTERNAL_LINK fixture block.");
  await runAction(actions, "updateBuildStudioExternalLinkBlock", {
    ...baseBlockEntries(externalLink),
    buttonLabel: String(externalLink.editedConfig.buttonLabel),
    description: String(externalLink.editedConfig.description),
    openInNewTab: true,
    url: String(externalLink.editedConfig.url),
  });

  delete (globalThis as { __mockSession?: AuthSession }).__mockSession;
}

async function assertEditedConfigsPersisted(creatorSession: AuthSession) {
  for (const fixtureBlock of fixtureBlocks) {
    const block = await prisma.contentBlock.findUnique({
      select: {
        configJson: true,
        id: true,
        lessonId: true,
        title: true,
        type: true,
      },
      where: { id: fixtureBlock.id },
    });

    assert(block, `Expected saved ${fixtureBlock.type} block to exist.`);
    assert(block.type === fixtureBlock.type, `Expected ${fixtureBlock.type} type to remain unchanged.`);
    assert(block.lessonId === fixtureLessonId, `Expected ${fixtureBlock.type} lesson relation to remain unchanged.`);

    for (const key of fixtureBlock.expectedKeys) {
      assertConfigValue(block.configJson, fixtureBlock.editedConfig, key, fixtureBlock.type);
    }

    const studioCourse = await getBuildStudioCourse(
      fixtureCourseId,
      creatorSession,
      fixtureLessonId,
      fixtureBlock.id,
    );
    assert(
      studioCourse.selectedBlock?.id === fixtureBlock.id,
      `Expected ${fixtureBlock.type} to be selectable after reload.`,
    );
    assert(
      studioCourse.selectedBlock?.type === fixtureBlock.type,
      `Expected ${fixtureBlock.type} selected block type after reload.`,
    );
  }
}

async function assertRepeatables() {
  const repeatableExpectations = [
    {
      block: fixtureBlocks.find((block) => block.type === ContentBlockType.ACCORDION),
      key: "items",
      name: "accordion items",
      removedId: "item-b",
      expectedLength: 2,
    },
    {
      block: fixtureBlocks.find((block) => block.type === ContentBlockType.FLASHCARD),
      key: "cards",
      name: "flashcards",
      removedId: "card-b",
      expectedLength: 2,
    },
    {
      block: fixtureBlocks.find((block) => block.type === ContentBlockType.KNOWLEDGE_CHECK),
      key: "options",
      name: "knowledge check options",
      removedId: "option-b",
      expectedLength: 2,
    },
    {
      block: fixtureBlocks.find((block) => block.type === ContentBlockType.BRANCHING_SCENARIO),
      key: "choices",
      name: "branching scenario choices",
      removedId: "choice-b",
      expectedLength: 2,
    },
  ];

  for (const expectation of repeatableExpectations) {
    assert(expectation.block, `Missing repeatable fixture for ${expectation.name}.`);
    const rows = (expectation.block.editedConfig[expectation.key] ?? []) as JsonObject[];

    assert(
      Array.isArray(rows) && rows.length === expectation.expectedLength,
      `Expected ${expectation.expectedLength} ${expectation.name}.`,
    );
    assert(
      rows.every((row) => row.id !== expectation.removedId),
      `Expected removed ${expectation.name} row ${expectation.removedId} to be absent.`,
    );
  }
}

async function assertCreatorPreviewSafe(creatorSession: AuthSession) {
  const previewData = await getCreatorPreviewData(fixtureCourseId, creatorSession);

  assert(previewData, "Expected creator learner preview data for fixture.");
  assert(previewData.totalBlocks === supportedTypes.length, "Expected preview to include every fixture block.");

  const previewTypes = new Set(
    previewData.modules.flatMap((module) =>
      module.lessons.flatMap((lesson) => lesson.blocks.map((block) => block.type)),
    ),
  );

  for (const type of supportedTypes) {
    assert(previewTypes.has(type), `Expected preview data to include ${type}.`);
  }
}

async function main() {
  console.log("=== Build Studio Block Editing Verification ===");

  const { creatorSession, participantSession } = await createFixture();
  console.log("PASS: editable DRAFT fixture course created.");

  assert(
    !canAccessPath(participantSession, `/creator/courses/${fixtureCourseId}/build`),
    "Participant must not access creator Build Studio routes.",
  );
  console.log("PASS: participant route guard blocks fixture Build Studio route.");

  await assertFixtureShape(creatorSession);
  console.log("PASS: fixture includes one editable block for every supported type.");

  await applyEditedConfigsThroughActions(creatorSession);
  await assertEditedConfigsPersisted(creatorSession);
  console.log("PASS: edited configJson values reload for every supported block type.");

  await assertRepeatables();
  console.log("PASS: repeatable block data reflects add/remove target state.");

  await assertCreatorPreviewSafe(creatorSession);
  console.log("PASS: creator learner preview data includes configured fixture blocks.");

  console.log(`Fixture course: /creator/courses/${fixtureCourseId}/build`);
  console.log("ALL BUILD STUDIO BLOCK EDITING CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
