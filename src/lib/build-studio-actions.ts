"use server";

import { ContentBlockType, CourseStatus, QuizQuestionType } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import { canAccessCreator, hasAnyRole } from "@/lib/auth/permissions";
import { getCurrentSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type EditableCourse = {
  courseId: string;
  versionId: string;
};

type EditableLesson = EditableCourse & {
  lessonId: string;
};

const editableVersionStatuses: CourseStatus[] = [
  CourseStatus.DRAFT,
  CourseStatus.RETURNED_FOR_REVISION,
];

const approvedBlockTypes: ContentBlockType[] = [
  ContentBlockType.TEXT,
  ContentBlockType.VIDEO,
  ContentBlockType.RESOURCE,
  ContentBlockType.EXTERNAL_LINK,
  ContentBlockType.IMAGE,
  ContentBlockType.CASE_STUDY,
  ContentBlockType.KEY_MESSAGE,
  ContentBlockType.ACCORDION,
  ContentBlockType.FLASHCARD,
  ContentBlockType.KNOWLEDGE_CHECK,
  ContentBlockType.BRANCHING_SCENARIO,
  ContentBlockType.REFLECTION_PROMPT,
  ContentBlockType.PRACTICAL_ACTIVITY_PROMPT,
];

const blockLabels: Record<ContentBlockType, string> = {
  ACCORDION: "Accordion",
  AUDIO: "Audio",
  BRANCHING_SCENARIO: "Branching Scenario",
  BUTTON_CTA: "Button",
  CASE_STUDY: "Case Study",
  EXTERNAL_LINK: "External Link",
  FLASHCARD: "Flashcards",
  IMAGE: "Image",
  KEY_MESSAGE: "Key Message",
  KNOWLEDGE_CHECK: "Knowledge Check",
  MULTIPLE_CHOICE_QUESTION: "Multiple Choice Question",
  PRACTICAL_ACTIVITY_PROMPT: "Practical Activity",
  REFLECTION_PROMPT: "Reflection",
  RESOURCE: "Resource",
  SHORT_ANSWER_PROMPT: "Short Answer Prompt",
  TEXT: "Text",
  TRUE_FALSE_QUESTION: "True/False Question",
  VIDEO: "Video",
};

function formString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function formStrings(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeTitle(value: string) {
  return value.replace(/\s+/g, " ").slice(0, 140);
}

function normalizeOptionalText(value: string, maxLength = 1000) {
  const normalized = value.replace(/\s+/g, " ").trim();

  return normalized ? normalized.slice(0, maxLength) : null;
}

function normalizeLongFormText(value: string, maxLength = 8000) {
  const normalized = value
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return normalized.slice(0, maxLength);
}

function parseOptionalPositiveInteger(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return Math.min(parsed, 999);
}

function parseApprovedBlockType(value: string) {
  const type = approvedBlockTypes.find((blockType) => blockType === value);

  return type ?? null;
}

function parseKeyMessageStyle(value: string) {
  const styles = ["info", "success", "warning", "neutral"] as const;

  return styles.find((style) => style === value) ?? "info";
}

function parseResourceSourceType(value: string) {
  const sourceTypes = ["external_link", "uploaded_file"] as const;

  return sourceTypes.find((sourceType) => sourceType === value) ?? "external_link";
}

function parseResourceType(value: string) {
  const resourceTypes = [
    "pdf",
    "doc",
    "spreadsheet",
    "presentation",
    "template",
    "link",
    "other",
  ] as const;

  return resourceTypes.find((resourceType) => resourceType === value) ?? "link";
}

function parseImageDisplaySize(value: string) {
  const displaySizes = ["standard", "wide"] as const;

  return displaySizes.find((displaySize) => displaySize === value) ?? "standard";
}

function parseVideoSourceType(value: string) {
  const sourceTypes = ["embed_url", "uploaded_file", "external_link"] as const;

  return sourceTypes.find((sourceType) => sourceType === value) ?? "embed_url";
}

function parsePositiveInteger(value: string, fallback = 0) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return Math.min(parsed, 999);
}

function parseFlashcardDisplayMode(value: string) {
  const displayModes = ["grid", "stack"] as const;

  return displayModes.find((displayMode) => displayMode === value) ?? "grid";
}

function parseLearningFunction(value: string) {
  const learningFunctions = [
    "EXPLAIN",
    "INVESTIGATE",
    "REFLECT",
    "PRACTICE",
    "APPLY",
    "PRODUCE",
    "ASSESS",
    "SUPPORT_ACCESS",
  ] as const;

  return learningFunctions.find((learningFunction) => learningFunction === value) ?? "";
}

function getExistingAlignment(configJson: unknown) {
  if (!configJson || typeof configJson !== "object") {
    return {};
  }

  const alignment = (configJson as Record<string, unknown>).alignment;

  return alignment && typeof alignment === "object" && !Array.isArray(alignment)
    ? (alignment as Record<string, unknown>)
    : {};
}

function getExistingConfig(configJson: unknown) {
  return configJson && typeof configJson === "object" && !Array.isArray(configJson)
    ? (configJson as Record<string, unknown>)
    : {};
}

function getBlockAlignmentFromForm(formData: FormData, configJson: unknown) {
  const hasAlignmentFields =
    formData.has("alignmentOutcomeId") ||
    formData.has("learningFunction") ||
    formData.has("expectedLearnerAction") ||
    formData.has("alignmentIndicatorId");

  if (!hasAlignmentFields) {
    return getExistingAlignment(configJson);
  }

  return {
    expectedLearnerAction:
      normalizeOptionalText(formString(formData, "expectedLearnerAction"), 600) ?? "",
    indicatorId: formString(formData, "alignmentIndicatorId"),
    learningFunction: parseLearningFunction(formString(formData, "learningFunction")),
    linkedOutcomeId: formString(formData, "alignmentOutcomeId"),
  };
}

function mergeBlockAlignment(
  formData: FormData,
  existingConfigJson: unknown,
  nextConfig: Record<string, unknown>,
) {
  const existingConfig = getExistingConfig(existingConfigJson);

  return {
    ...existingConfig,
    ...nextConfig,
    alignment: getBlockAlignmentFromForm(formData, existingConfigJson),
  };
}

type SharedBlockSource = {
  accessibilityNotes: string | null;
  hasAccessibilityWarning: boolean;
};

function getSharedBlockData(
  formData: FormData,
  hasAccessibilityWarning = false,
  existingBlock?: SharedBlockSource,
) {
  return {
    accessibilityNotes: formData.has("accessibilityNotes")
      ? normalizeOptionalText(formString(formData, "accessibilityNotes"))
      : existingBlock?.accessibilityNotes ?? null,
    hasAccessibilityWarning:
      hasAccessibilityWarning ||
      (formData.has("hasAccessibilityWarning")
        ? formString(formData, "hasAccessibilityWarning") === "on"
        : existingBlock?.hasAccessibilityWarning ?? false),
    isRequired: formString(formData, "isRequired") === "on",
  };
}

function getStableItemId(value: string, prefix: string, index: number) {
  const normalized = value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);

  return normalized || `${prefix}-${index + 1}`;
}

function getRepeatableCount(
  formData: FormData,
  key: string,
  fallback: number,
  max: number,
) {
  return Math.min(Math.max(parsePositiveInteger(formString(formData, key), fallback), 0), max);
}

function getRemoveIndex(formData: FormData, prefix: string) {
  const intent = formString(formData, "repeatableIntent");

  if (!intent.startsWith(prefix)) {
    return null;
  }

  return parsePositiveInteger(intent.slice(prefix.length), -1);
}

function getAccordionItems(formData: FormData) {
  const currentCount = getRepeatableCount(formData, "itemCount", 1, 8);
  const shouldAdd = formString(formData, "repeatableIntent") === "add-accordion-item";
  const removeIndex = getRemoveIndex(formData, "remove-accordion-item-");
  const nextCount = Math.min(currentCount + (shouldAdd ? 1 : 0), 8);

  return Array.from({ length: nextCount }, (_, index) => {
    if (removeIndex === index) {
      return null;
    }

    const title = normalizeTitle(formString(formData, `itemTitle-${index}`));
    const body = normalizeLongFormText(
      formString(formData, `itemBody-${index}`),
      4000,
    );
    const id = getStableItemId(
      formString(formData, `itemId-${index}`),
      "item",
      index,
    );

    return title || body || (shouldAdd && index === currentCount)
      ? { body, id, title }
      : null;
  }).filter((item): item is { body: string; id: string; title: string } =>
    Boolean(item),
  );
}

function getFlashcards(formData: FormData) {
  const currentCount = getRepeatableCount(formData, "cardCount", 1, 8);
  const shouldAdd = formString(formData, "repeatableIntent") === "add-flashcard";
  const removeIndex = getRemoveIndex(formData, "remove-flashcard-");
  const nextCount = Math.min(currentCount + (shouldAdd ? 1 : 0), 8);

  return Array.from({ length: nextCount }, (_, index) => {
    if (removeIndex === index) {
      return null;
    }

    const front = normalizeLongFormText(
      formString(formData, `cardFront-${index}`),
      2000,
    );
    const back = normalizeLongFormText(
      formString(formData, `cardBack-${index}`),
      3000,
    );
    const id = getStableItemId(
      formString(formData, `cardId-${index}`),
      "card",
      index,
    );

    return front || back || (shouldAdd && index === currentCount)
      ? { back, front, id }
      : null;
  }).filter((card): card is { back: string; front: string; id: string } =>
    Boolean(card),
  );
}

function getKnowledgeCheckOptions(formData: FormData) {
  const correctOptionId = formString(formData, "correctOptionId");
  const currentCount = getRepeatableCount(formData, "optionCount", 2, 6);
  const shouldAdd = formString(formData, "repeatableIntent") === "add-knowledge-option";
  const removeIndex = getRemoveIndex(formData, "remove-knowledge-option-");
  const nextCount = Math.min(currentCount + (shouldAdd ? 1 : 0), 6);

  return Array.from({ length: nextCount }, (_, index) => {
    if (removeIndex === index) {
      return null;
    }

    const label = normalizeLongFormText(
      formString(formData, `optionLabel-${index}`),
      1000,
    );
    const feedback = normalizeLongFormText(
      formString(formData, `optionFeedback-${index}`),
      1200,
    );
    const id = getStableItemId(
      formString(formData, `optionId-${index}`),
      "option",
      index,
    );

    return label || (shouldAdd && index === currentCount)
      ? {
          feedback,
          id,
          isCorrect: id === correctOptionId,
          label,
          text: label,
        }
      : null;
  }).filter(
    (
      option,
    ): option is {
      feedback: string;
      id: string;
      isCorrect: boolean;
      label: string;
      text: string;
    } => Boolean(option),
  );
}

function getDefaultBlockConfig(type: ContentBlockType) {
  switch (type) {
    case ContentBlockType.TEXT:
      return {
        body: "",
        heading: "",
        readingTimeMinutes: null,
        width: "standard",
      };
    case ContentBlockType.VIDEO:
      return {
        description: "",
        durationMinutes: null,
        sourceType: "embed_url",
        sourceUrl: "",
        transcript: "",
        captionsAvailable: false,
        thumbnailUrl: "",
        title: "",
      };
    case ContentBlockType.RESOURCE:
      return {
        buttonLabel: "",
        description: "",
        fileName: "",
        fileSizeLabel: "",
        resourceType: "link",
        sourceType: "external_link",
        sourceUrl: "",
        title: "",
      };
    case ContentBlockType.EXTERNAL_LINK:
      return {
        buttonLabel: "Open link",
        description: "",
        openInNewTab: true,
        title: "",
        url: "",
      };
    case ContentBlockType.IMAGE:
      return {
        altText: "",
        caption: "",
        displaySize: "standard",
        imageUrl: "",
        title: "",
      };
    case ContentBlockType.CASE_STUDY:
      return {
        context: "",
        discussionQuestion: "",
        guidingQuestion: "",
        learningPoint: "",
        scenario: "",
        title: "",
      };
    case ContentBlockType.KEY_MESSAGE:
      return { message: "", style: "info" };
    case ContentBlockType.ACCORDION:
      return { allowMultipleOpen: true, introduction: "", items: [], title: "" };
    case ContentBlockType.FLASHCARD:
      return { cards: [], displayMode: "grid", instructions: "", title: "" };
    case ContentBlockType.KNOWLEDGE_CHECK:
      return {
        question: "",
        helperText: "",
        questionType: "single_choice",
        options: [],
        correctOptionId: "",
        correctFeedback: "",
        incorrectFeedback: "",
        retryAllowed: true,
      };
    case ContentBlockType.BRANCHING_SCENARIO:
      return {
        allowRetry: true,
        bestOptionId: "",
        choices: [],
        decisionQuestion: "",
        learningPoint: "",
        scenario: "",
      };
    case ContentBlockType.REFLECTION_PROMPT:
      return {
        prompt: "",
        question: "",
        guidanceText: "",
        privateToParticipant: true,
        responseRequired: false,
        responseMode: "thinking_only",
      };
    case ContentBlockType.PRACTICAL_ACTIVITY_PROMPT:
      return {
        guidance: "",
        instruction: "",
        taskInstructions: "",
        expectedOutput: "",
        estimatedTimeMinutes: 0,
      };
    default:
      return {};
  }
}

function redirectIfWrongBlockType(
  actualType: ContentBlockType,
  expectedType: ContentBlockType,
  courseId: string,
  lessonId: string,
  blockId: string,
) {
  if (actualType !== expectedType) {
    redirectToBuildStudio(courseId, lessonId, "unsupported-block-settings", blockId);
  }
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

function buildStudioPath(
  courseId: string,
  selectedLessonId?: string,
  notice?: string,
  selectedBlockId?: string,
) {
  const params = new URLSearchParams();

  if (selectedLessonId) {
    params.set("lessonId", selectedLessonId);
  }

  if (selectedBlockId) {
    params.set("blockId", selectedBlockId);
  }

  if (notice) {
    params.set("studioNotice", notice);
  }

  const query = params.toString();

  return `/creator/courses/${courseId}/build${query ? `?${query}` : ""}`;
}

function redirectToBuildStudio(
  courseId: string,
  selectedLessonId?: string,
  notice?: string,
  selectedBlockId?: string,
): never {
  redirect(buildStudioPath(courseId, selectedLessonId, notice, selectedBlockId));
}

async function getSessionDbUserId() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/sign-in?next=/creator/courses");
  }

  if (!canAccessCreator(session)) {
    redirect("/unauthorized?from=/creator/courses");
  }

  if (!session.email) {
    return {
      dbUserId: null,
      isAdmin: hasAnyRole(session, ["SUPER_ADMIN", "PLATFORM_ADMIN"]),
    };
  }

  const dbUser = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email: session.email,
    },
  });

  return {
    dbUserId: dbUser?.id ?? null,
    isAdmin: hasAnyRole(session, ["SUPER_ADMIN", "PLATFORM_ADMIN"]),
  };
}

async function getEditableCourse(
  courseIdOrSlug: string,
  selectedLessonId?: string,
): Promise<EditableCourse> {
  const { dbUserId, isAdmin } = await getSessionDbUserId();
  const creatorScope =
    dbUserId && !isAdmin
      ? [
          {
            OR: [{ assignedCreatorId: dbUserId }, { createdById: dbUserId }],
          },
        ]
      : [];

  const course = await prisma.course.findFirst({
    select: {
      id: true,
      versions: {
        orderBy: {
          versionNumber: "desc",
        },
        select: {
          id: true,
          status: true,
        },
      },
    },
    where: {
      AND: [
        {
          OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }],
        },
        ...creatorScope,
      ],
      archivedAt: null,
    },
  });

  if (!course) {
    redirectToBuildStudio(courseIdOrSlug, selectedLessonId, "not-found");
  }

  const editableVersion = course.versions.find((version) =>
    editableVersionStatuses.includes(version.status),
  );

  if (!editableVersion) {
    redirectToBuildStudio(course.id, selectedLessonId, "read-only-course");
  }

  return {
    courseId: course.id,
    versionId: editableVersion.id,
  };
}

async function getEditableLesson(
  courseIdOrSlug: string,
  lessonId: string,
  selectedBlockId?: string,
): Promise<EditableLesson> {
  const course = await getEditableCourse(courseIdOrSlug, lessonId);
  const lesson = await prisma.lesson.findFirst({
    select: {
      id: true,
    },
    where: {
      id: lessonId,
      module: {
        courseVersionId: course.versionId,
      },
    },
  });

  if (!lesson) {
    redirectToBuildStudio(
      course.courseId,
      undefined,
      "not-found",
      selectedBlockId,
    );
  }

  return {
    ...course,
    lessonId: lesson.id,
  };
}

async function getEditableContentBlock(
  courseIdOrSlug: string,
  lessonId: string,
  blockId: string,
) {
  const lesson = await getEditableLesson(courseIdOrSlug, lessonId, blockId);
  const block = await prisma.contentBlock.findFirst({
    select: {
      accessibilityNotes: true,
      configJson: true,
      estimatedDurationMinutes: true,
      hasAccessibilityWarning: true,
      id: true,
      isRequired: true,
      lessonId: true,
      order: true,
      title: true,
      type: true,
    },
    where: {
      id: blockId,
      lessonId: lesson.lessonId,
    },
  });

  if (!block) {
    redirectToBuildStudio(lesson.courseId, lesson.lessonId, "not-found");
  }

  return {
    block,
    courseId: lesson.courseId,
    lessonId: lesson.lessonId,
    versionId: lesson.versionId,
  };
}

export async function createBuildStudioModule(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const selectedLessonId = formString(formData, "selectedLessonId");
  const title = normalizeTitle(formString(formData, "title"));

  if (!courseId || !title) {
    redirectToBuildStudio(courseId, selectedLessonId, "title-required");
  }

  const course = await getEditableCourse(courseId, selectedLessonId);

  await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.module.aggregate({
      _max: {
        order: true,
      },
      where: {
        courseVersionId: course.versionId,
      },
    });

    await tx.module.create({
      data: {
        courseVersionId: course.versionId,
        order: (nextOrder._max.order ?? 0) + 1,
        title,
      },
    });

    await tx.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: course.versionId,
      },
    });
  });

  revalidatePath(buildStudioPath(course.courseId));
  redirectToBuildStudio(course.courseId, selectedLessonId, "module-created");
}

export async function renameBuildStudioModule(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const moduleId = formString(formData, "moduleId");
  const selectedLessonId = formString(formData, "selectedLessonId");
  const title = normalizeTitle(formString(formData, "title"));

  if (!courseId || !moduleId || !title) {
    redirectToBuildStudio(courseId, selectedLessonId, "title-required");
  }

  const course = await getEditableCourse(courseId, selectedLessonId);

  const moduleRecord = await prisma.module.findFirst({
    select: {
      id: true,
    },
    where: {
      courseVersionId: course.versionId,
      id: moduleId,
    },
  });

  if (!moduleRecord) {
    redirectToBuildStudio(course.courseId, selectedLessonId, "not-found");
  }

  await prisma.$transaction([
    prisma.module.update({
      data: {
        title,
      },
      where: {
        id: moduleRecord.id,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: course.versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(course.courseId));
  redirectToBuildStudio(course.courseId, selectedLessonId, "module-saved");
}

export async function moveBuildStudioModule(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const moduleId = formString(formData, "moduleId");
  const selectedLessonId = formString(formData, "selectedLessonId");
  const direction = formString(formData, "direction");

  if (!courseId || !moduleId || !["up", "down"].includes(direction)) {
    redirectToBuildStudio(courseId, selectedLessonId);
  }

  const course = await getEditableCourse(courseId, selectedLessonId);
  const current = await prisma.module.findFirst({
    select: {
      id: true,
      order: true,
    },
    where: {
      courseVersionId: course.versionId,
      id: moduleId,
    },
  });

  if (!current) {
    redirectToBuildStudio(course.courseId, selectedLessonId, "not-found");
  }

  const target = await prisma.module.findFirst({
    select: {
      id: true,
      order: true,
    },
    where: {
      courseVersionId: course.versionId,
      order: direction === "up" ? current.order - 1 : current.order + 1,
    },
  });

  if (!target) {
    redirectToBuildStudio(course.courseId, selectedLessonId);
  }

  await prisma.$transaction([
    prisma.module.update({
      data: {
        order: -1,
      },
      where: {
        id: current.id,
      },
    }),
    prisma.module.update({
      data: {
        order: current.order,
      },
      where: {
        id: target.id,
      },
    }),
    prisma.module.update({
      data: {
        order: target.order,
      },
      where: {
        id: current.id,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: course.versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(course.courseId));
  redirectToBuildStudio(course.courseId, selectedLessonId, "module-moved");
}

export async function deleteBuildStudioModule(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const moduleId = formString(formData, "moduleId");
  const selectedLessonId = formString(formData, "selectedLessonId");

  if (!courseId || !moduleId) {
    redirectToBuildStudio(courseId, selectedLessonId);
  }

  const course = await getEditableCourse(courseId, selectedLessonId);
  const moduleRecord = await prisma.module.findFirst({
    select: {
      _count: {
        select: {
          lessons: true,
        },
      },
      id: true,
      order: true,
    },
    where: {
      courseVersionId: course.versionId,
      id: moduleId,
    },
  });

  if (!moduleRecord) {
    redirectToBuildStudio(course.courseId, selectedLessonId, "not-found");
  }

  if (moduleRecord._count.lessons > 0) {
    redirectToBuildStudio(course.courseId, selectedLessonId, "module-not-empty");
  }

  await prisma.$transaction([
    prisma.module.delete({
      where: {
        id: moduleRecord.id,
      },
    }),
    prisma.module.updateMany({
      data: {
        order: {
          decrement: 1,
        },
      },
      where: {
        courseVersionId: course.versionId,
        order: {
          gt: moduleRecord.order,
        },
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: course.versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(course.courseId));
  redirectToBuildStudio(course.courseId, selectedLessonId, "module-deleted");
}

export async function createBuildStudioLesson(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const moduleId = formString(formData, "moduleId");
  const title = normalizeTitle(formString(formData, "title"));

  if (!courseId || !moduleId || !title) {
    redirectToBuildStudio(courseId, undefined, "title-required");
  }

  const course = await getEditableCourse(courseId);
  const moduleRecord = await prisma.module.findFirst({
    select: {
      id: true,
    },
    where: {
      courseVersionId: course.versionId,
      id: moduleId,
    },
  });

  if (!moduleRecord) {
    redirectToBuildStudio(course.courseId, undefined, "not-found");
  }

  const lesson = await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.lesson.aggregate({
      _max: {
        order: true,
      },
      where: {
        moduleId: moduleRecord.id,
      },
    });

    const createdLesson = await tx.lesson.create({
      data: {
        moduleId: moduleRecord.id,
        order: (nextOrder._max.order ?? 0) + 1,
        title,
      },
      select: {
        id: true,
      },
    });

    await tx.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: course.versionId,
      },
    });

    return createdLesson;
  });

  revalidatePath(buildStudioPath(course.courseId));
  redirectToBuildStudio(course.courseId, lesson.id, "lesson-created");
}

export async function renameBuildStudioLesson(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const selectedLessonId = formString(formData, "selectedLessonId") || lessonId;
  const title = normalizeTitle(formString(formData, "title"));

  if (!courseId || !lessonId || !title) {
    redirectToBuildStudio(courseId, selectedLessonId, "title-required");
  }

  const course = await getEditableCourse(courseId, selectedLessonId);
  const lesson = await prisma.lesson.findFirst({
    select: {
      id: true,
    },
    where: {
      id: lessonId,
      module: {
        courseVersionId: course.versionId,
      },
    },
  });

  if (!lesson) {
    redirectToBuildStudio(course.courseId, selectedLessonId, "not-found");
  }

  await prisma.$transaction([
    prisma.lesson.update({
      data: {
        alignmentMetadataJson: toInputJson({
          outcomeIds: formStrings(formData, "lessonOutcomeIds"),
        }),
        title,
      },
      where: {
        id: lesson.id,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: course.versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(course.courseId));
  redirectToBuildStudio(course.courseId, selectedLessonId, "lesson-saved");
}

export async function moveBuildStudioLesson(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const selectedLessonId = formString(formData, "selectedLessonId") || lessonId;
  const direction = formString(formData, "direction");

  if (!courseId || !lessonId || !["up", "down"].includes(direction)) {
    redirectToBuildStudio(courseId, selectedLessonId);
  }

  const course = await getEditableCourse(courseId, selectedLessonId);
  const current = await prisma.lesson.findFirst({
    select: {
      id: true,
      moduleId: true,
      order: true,
    },
    where: {
      id: lessonId,
      module: {
        courseVersionId: course.versionId,
      },
    },
  });

  if (!current) {
    redirectToBuildStudio(course.courseId, selectedLessonId, "not-found");
  }

  const target = await prisma.lesson.findFirst({
    select: {
      id: true,
      order: true,
    },
    where: {
      moduleId: current.moduleId,
      order: direction === "up" ? current.order - 1 : current.order + 1,
    },
  });

  if (!target) {
    redirectToBuildStudio(course.courseId, selectedLessonId);
  }

  await prisma.$transaction([
    prisma.lesson.update({
      data: {
        order: -1,
      },
      where: {
        id: current.id,
      },
    }),
    prisma.lesson.update({
      data: {
        order: current.order,
      },
      where: {
        id: target.id,
      },
    }),
    prisma.lesson.update({
      data: {
        order: target.order,
      },
      where: {
        id: current.id,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: course.versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(course.courseId));
  redirectToBuildStudio(course.courseId, selectedLessonId, "lesson-moved");
}

export async function deleteBuildStudioLesson(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const selectedLessonId = formString(formData, "selectedLessonId") || lessonId;

  if (!courseId || !lessonId) {
    redirectToBuildStudio(courseId, selectedLessonId);
  }

  const course = await getEditableCourse(courseId, selectedLessonId);
  const lesson = await prisma.lesson.findFirst({
    select: {
      _count: {
        select: {
          contentBlocks: true,
          feedback: true,
          learningOutcomes: true,
          lessonProgress: true,
        },
      },
      id: true,
      moduleId: true,
      order: true,
    },
    where: {
      id: lessonId,
      module: {
        courseVersionId: course.versionId,
      },
    },
  });

  if (!lesson) {
    redirectToBuildStudio(course.courseId, selectedLessonId, "not-found");
  }

  const hasLinkedRecords =
    lesson._count.contentBlocks > 0 ||
    lesson._count.feedback > 0 ||
    lesson._count.learningOutcomes > 0 ||
    lesson._count.lessonProgress > 0;

  if (hasLinkedRecords) {
    redirectToBuildStudio(course.courseId, selectedLessonId, "lesson-not-empty");
  }

  await prisma.$transaction([
    prisma.lesson.delete({
      where: {
        id: lesson.id,
      },
    }),
    prisma.lesson.updateMany({
      data: {
        order: {
          decrement: 1,
        },
      },
      where: {
        moduleId: lesson.moduleId,
        order: {
          gt: lesson.order,
        },
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: course.versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(course.courseId));
  redirectToBuildStudio(course.courseId, undefined, "lesson-deleted");
}

export async function createBuildStudioBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const type = parseApprovedBlockType(formString(formData, "type"));

  if (!courseId || !lessonId || !type) {
    redirectToBuildStudio(courseId, lessonId, "block-type-required");
  }

  const lesson = await getEditableLesson(courseId, lessonId);
  const createdBlock = await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.contentBlock.aggregate({
      _max: {
        order: true,
      },
      where: {
        lessonId: lesson.lessonId,
      },
    });

    const block = await tx.contentBlock.create({
      data: {
        configJson: toInputJson(getDefaultBlockConfig(type)),
        hasAccessibilityWarning: true,
        isRequired: true,
        lessonId: lesson.lessonId,
        order: (nextOrder._max.order ?? 0) + 1,
        title: `Untitled ${blockLabels[type]}`,
        type,
      },
      select: {
        id: true,
      },
    });

    await tx.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: lesson.versionId,
      },
    });

    return block;
  });

  revalidatePath(buildStudioPath(lesson.courseId, lesson.lessonId));
  redirectToBuildStudio(
    lesson.courseId,
    lesson.lessonId,
    "block-created",
    createdBlock.id,
  );
}

export async function updateBuildStudioBlockSettings(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );
  const accessibilityNotes = normalizeOptionalText(
    formString(formData, "accessibilityNotes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const existingConfig =
    block.configJson && typeof block.configJson === "object" && !Array.isArray(block.configJson)
      ? (block.configJson as Record<string, unknown>)
      : {};

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        accessibilityNotes,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, existingConfig)),
        estimatedDurationMinutes,
        hasAccessibilityWarning:
          formString(formData, "hasAccessibilityWarning") === "on",
        isRequired: formString(formData, "isRequired") === "on",
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "block-saved",
    blockId,
  );
}

export async function updateBuildStudioTextBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const heading = normalizeTitle(formString(formData, "heading"));
  const body = normalizeLongFormText(formString(formData, "body"));
  const readingTimeMinutes = parseOptionalPositiveInteger(
    formString(formData, "readingTimeMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.TEXT,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          body,
          heading,
          readingTimeMinutes,
          width: "standard",
        })),
        estimatedDurationMinutes: readingTimeMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "text-block-saved",
    blockId,
  );
}

export async function updateBuildStudioKeyMessageBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const message = normalizeLongFormText(formString(formData, "message"), 3000);
  const supportingText = normalizeLongFormText(
    formString(formData, "supportingText"),
    2000,
  );
  const style = parseKeyMessageStyle(formString(formData, "style"));
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.KEY_MESSAGE,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          message,
          style,
          supportingText,
          tone: style,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "key-message-block-saved",
    blockId,
  );
}

export async function updateBuildStudioExternalLinkBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const url = normalizeLongFormText(formString(formData, "url"), 1000);
  const description = normalizeLongFormText(
    formString(formData, "description"),
    2000,
  );
  const buttonLabel = normalizeTitle(formString(formData, "buttonLabel"));
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );
  const openInNewTab = formString(formData, "openInNewTab") === "on";

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.EXTERNAL_LINK,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          buttonLabel,
          description,
          label: buttonLabel,
          openInNewTab,
          title,
          url,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "external-link-block-saved",
    blockId,
  );
}

export async function updateBuildStudioCaseStudyBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const context = normalizeLongFormText(formString(formData, "context"), 3000);
  const scenario = normalizeLongFormText(formString(formData, "scenario"), 6000);
  const guidingQuestion = normalizeLongFormText(
    formString(formData, "guidingQuestion"),
    1000,
  );
  const learningPoint = normalizeLongFormText(
    formString(formData, "learningPoint"),
    2000,
  );
  const discussionQuestion = normalizeLongFormText(
    formString(formData, "discussionQuestion"),
    1000,
  );
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.CASE_STUDY,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          context,
          discussionQuestion,
          guidingQuestion,
          learningPoint,
          scenario,
          title,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "case-study-block-saved",
    blockId,
  );
}

export async function updateBuildStudioResourceBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const description = normalizeLongFormText(
    formString(formData, "description"),
    2000,
  );
  const sourceType = parseResourceSourceType(formString(formData, "sourceType"));
  const sourceUrl = normalizeLongFormText(formString(formData, "sourceUrl"), 1000);
  const resourceType = parseResourceType(formString(formData, "resourceType"));
  const fileName = normalizeTitle(formString(formData, "fileName"));
  const fileSizeLabel = normalizeTitle(formString(formData, "fileSizeLabel"));
  const buttonLabel = normalizeTitle(formString(formData, "buttonLabel"));
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.RESOURCE,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          buttonLabel,
          description,
          fileName,
          fileSizeLabel,
          resourceType,
          sourceType,
          sourceUrl,
          title,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "resource-block-saved",
    blockId,
  );
}

export async function updateBuildStudioImageBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const imageUrl = normalizeLongFormText(formString(formData, "imageUrl"), 1000);
  const altText = normalizeLongFormText(formString(formData, "altText"), 1000);
  const caption = normalizeLongFormText(formString(formData, "caption"), 2000);
  const displaySize = parseImageDisplaySize(formString(formData, "displaySize"));
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, !altText, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.IMAGE,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          altText,
          caption,
          displaySize,
          imageUrl,
          title,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "image-block-saved",
    blockId,
  );
}

export async function updateBuildStudioVideoBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const description = normalizeLongFormText(
    formString(formData, "description"),
    2000,
  );
  const sourceType = parseVideoSourceType(formString(formData, "sourceType"));
  const sourceUrl = normalizeLongFormText(formString(formData, "sourceUrl"), 1000);
  const durationMinutes = parseOptionalPositiveInteger(
    formString(formData, "durationMinutes"),
  );
  const transcript = normalizeLongFormText(
    formString(formData, "transcript"),
    12000,
  );
  const thumbnailUrl = normalizeLongFormText(
    formString(formData, "thumbnailUrl"),
    1000,
  );
  const captionsAvailable = formString(formData, "captionsAvailable") === "on";

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(
    formData,
    !transcript || !captionsAvailable,
    block,
  );

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.VIDEO,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          captionsAvailable,
          description,
          durationMinutes,
          sourceType,
          sourceUrl,
          thumbnailUrl,
          title,
          transcript,
        })),
        estimatedDurationMinutes: durationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "video-block-saved",
    blockId,
  );
}

export async function updateBuildStudioAccordionBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const introduction = normalizeLongFormText(
    formString(formData, "introduction"),
    2000,
  );
  const items = getAccordionItems(formData);
  const allowMultipleOpen = formString(formData, "allowMultipleOpen") === "on";
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.ACCORDION,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          allowMultipleOpen,
          introduction,
          items,
          title,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "accordion-block-saved",
    blockId,
  );
}

export async function updateBuildStudioFlashcardsBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const instructions = normalizeLongFormText(
    formString(formData, "instructions"),
    2000,
  );
  const displayMode = parseFlashcardDisplayMode(
    formString(formData, "displayMode"),
  );
  const cards = getFlashcards(formData);
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.FLASHCARD,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          cards,
          displayMode,
          instructions,
          title,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "flashcards-block-saved",
    blockId,
  );
}

export async function updateBuildStudioKnowledgeCheckBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const question = normalizeLongFormText(formString(formData, "question"), 2000);
  const helperText = normalizeLongFormText(
    formString(formData, "helperText"),
    1200,
  );
  const options = getKnowledgeCheckOptions(formData);
  const correctFeedback = normalizeLongFormText(
    formString(formData, "correctFeedback"),
    1200,
  );
  const incorrectFeedback = normalizeLongFormText(
    formString(formData, "incorrectFeedback"),
    1200,
  );
  const retryAllowed = formString(formData, "retryAllowed") === "on";
  const correctOptionId = formString(formData, "correctOptionId");
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.KNOWLEDGE_CHECK,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          correctOptionId,
          correctFeedback,
          helperText,
          incorrectFeedback,
          options,
          question,
          questionType: "single_choice",
          retryAllowed,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "knowledge-check-block-saved",
    blockId,
  );
}

function parseOutcomeTone(value: string) {
  const tones = ["positive", "caution", "neutral"] as const;

  return tones.find((tone) => tone === value) ?? "neutral";
}

function getBranchingChoices(formData: FormData) {
  const currentCount = getRepeatableCount(formData, "choiceCount", 2, 6);
  const shouldAdd = formString(formData, "repeatableIntent") === "add-branching-choice";
  const removeIndex = getRemoveIndex(formData, "remove-branching-choice-");
  const nextCount = Math.min(currentCount + (shouldAdd ? 1 : 0), 6);

  return Array.from({ length: nextCount }, (_, index) => {
    if (removeIndex === index) {
      return null;
    }

    const label = normalizeLongFormText(
      formString(formData, `choiceLabel-${index}`),
      1000,
    );
    const feedback = normalizeLongFormText(
      formString(formData, `choiceFeedback-${index}`),
      1200,
    );
    const outcomeTone = parseOutcomeTone(
      formString(formData, `choiceOutcomeTone-${index}`),
    );
    const id = getStableItemId(
      formString(formData, `choiceId-${index}`),
      "choice",
      index,
    );

    return label || (shouldAdd && index === currentCount)
      ? {
          consequence: feedback,
          feedback,
          id,
          label,
          outcomeTone,
          quality: outcomeTone,
          text: label,
        }
      : null;
  }).filter(
    (
      choice,
    ): choice is {
      feedback: string;
      id: string;
      label: string;
      outcomeTone: "positive" | "caution" | "neutral";
      consequence: string;
      quality: "positive" | "caution" | "neutral";
      text: string;
    } => Boolean(choice),
  );
}

export async function updateBuildStudioBranchingScenarioBlock(
  formData: FormData,
) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const context = normalizeLongFormText(
    formString(formData, "context"),
    4000,
  );
  const decisionQuestion = normalizeLongFormText(
    formString(formData, "decisionQuestion"),
    2000,
  );
  const choices = getBranchingChoices(formData);
  const bestOptionId = formString(formData, "bestOptionId");
  const learningPoint = normalizeLongFormText(
    formString(formData, "learningPoint"),
    2000,
  );
  const allowRetry = formString(formData, "allowRetry") === "on";
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const {
    block,
    courseId: resolvedCourseId,
    lessonId: resolvedLessonId,
    versionId,
  } = await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.BRANCHING_SCENARIO,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          allowRetry,
          bestOptionId,
          choices,
          context,
          decisionQuestion,
          decisionPrompt: decisionQuestion,
          learningPoint,
          options: choices,
          retryAllowed: allowRetry,
          scenario: context,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "branching-scenario-block-saved",
    blockId,
  );
}

export async function updateBuildStudioReflectionBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const question = normalizeLongFormText(formString(formData, "question"), 2000);
  const guidanceText = normalizeLongFormText(formString(formData, "guidanceText"), 2000);
  const responseMode = formString(formData, "responseMode") === "private_note" ? "private_note" : "thinking_only";
  const privacyNote = normalizeLongFormText(formString(formData, "privacyNote"), 1000);
  const estimatedDurationMinutes = parseOptionalPositiveInteger(
    formString(formData, "estimatedDurationMinutes"),
  );

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.REFLECTION_PROMPT,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          guidanceText,
          privateToParticipant: responseMode === "private_note",
          prompt: question,
          privacyNote,
          question,
          responseRequired: responseMode === "private_note",
          responseMode,
          title,
        })),
        estimatedDurationMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "reflection-block-saved",
    blockId,
  );
}

export async function updateBuildStudioPracticalActivityBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const title = normalizeTitle(formString(formData, "title"));
  const taskInstructions = normalizeLongFormText(formString(formData, "taskInstructions"), 4000);
  const expectedOutput = normalizeLongFormText(formString(formData, "expectedOutput"), 2000);
  const estimatedTimeMinutes = parseOptionalPositiveInteger(formString(formData, "estimatedTimeMinutes"));
  const materialsNeeded = normalizeLongFormText(formString(formData, "materialsNeeded"), 2000);
  const linkedResourceBlockId = formString(formData, "linkedResourceBlockId");
  const completionGuidance = normalizeLongFormText(formString(formData, "completionGuidance"), 2000);

  if (!courseId || !lessonId || !blockId || !title) {
    redirectToBuildStudio(courseId, lessonId, "title-required", blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const shared = getSharedBlockData(formData, false, block);

  redirectIfWrongBlockType(
    block.type,
    ContentBlockType.PRACTICAL_ACTIVITY_PROMPT,
    resolvedCourseId,
    resolvedLessonId,
    blockId,
  );

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        ...shared,
        configJson: toInputJson(mergeBlockAlignment(formData, block.configJson, {
          completionGuidance,
          estimatedTimeMinutes,
          expectedOutput,
          guidance: completionGuidance,
          instruction: taskInstructions,
          linkedResourceBlockId,
          materialsNeeded,
          taskInstructions,
          title,
        })),
        estimatedDurationMinutes: estimatedTimeMinutes,
        title,
      },
      where: {
        id: blockId,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "practical-activity-block-saved",
    blockId,
  );
}

export async function moveBuildStudioBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");
  const direction = formString(formData, "direction");

  if (!courseId || !lessonId || !blockId || !["up", "down"].includes(direction)) {
    redirectToBuildStudio(courseId, lessonId, undefined, blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);
  const target = await prisma.contentBlock.findFirst({
    select: {
      id: true,
      order: true,
    },
    where: {
      lessonId: resolvedLessonId,
      order: direction === "up" ? block.order - 1 : block.order + 1,
    },
  });

  if (!target) {
    redirectToBuildStudio(resolvedCourseId, resolvedLessonId, undefined, blockId);
  }

  await prisma.$transaction([
    prisma.contentBlock.update({
      data: {
        order: -1,
      },
      where: {
        id: block.id,
      },
    }),
    prisma.contentBlock.update({
      data: {
        order: block.order,
      },
      where: {
        id: target.id,
      },
    }),
    prisma.contentBlock.update({
      data: {
        order: target.order,
      },
      where: {
        id: block.id,
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "block-moved",
    blockId,
  );
}

export async function duplicateBuildStudioBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");

  if (!courseId || !lessonId || !blockId) {
    redirectToBuildStudio(courseId, lessonId, undefined, blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);

  const duplicatedBlock = await prisma.$transaction(async (tx) => {
    const laterBlocks = await tx.contentBlock.findMany({
      orderBy: {
        order: "desc",
      },
      select: {
        id: true,
        order: true,
      },
      where: {
        lessonId: resolvedLessonId,
        order: {
          gt: block.order,
        },
      },
    });

    for (const laterBlock of laterBlocks) {
      await tx.contentBlock.update({
        data: {
          order: laterBlock.order + 1,
        },
        where: {
          id: laterBlock.id,
        },
      });
    }

    const copy = await tx.contentBlock.create({
      data: {
        accessibilityNotes: block.accessibilityNotes,
        configJson: toInputJson(block.configJson),
        estimatedDurationMinutes: block.estimatedDurationMinutes,
        hasAccessibilityWarning: block.hasAccessibilityWarning,
        isRequired: block.isRequired,
        lessonId: resolvedLessonId,
        order: block.order + 1,
        title: `${block.title} Copy`.slice(0, 140),
        type: block.type,
      },
      select: {
        id: true,
      },
    });

    await tx.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    });

    return copy;
  });

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(
    resolvedCourseId,
    resolvedLessonId,
    "block-duplicated",
    duplicatedBlock.id,
  );
}

export async function deleteBuildStudioBlock(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const lessonId = formString(formData, "lessonId");
  const blockId = formString(formData, "blockId");

  if (!courseId || !lessonId || !blockId) {
    redirectToBuildStudio(courseId, lessonId, undefined, blockId);
  }

  const { block, courseId: resolvedCourseId, lessonId: resolvedLessonId, versionId } =
    await getEditableContentBlock(courseId, lessonId, blockId);

  await prisma.$transaction([
    prisma.contentBlock.delete({
      where: {
        id: block.id,
      },
    }),
    prisma.contentBlock.updateMany({
      data: {
        order: {
          decrement: 1,
        },
      },
      where: {
        lessonId: resolvedLessonId,
        order: {
          gt: block.order,
        },
      },
    }),
    prisma.courseVersion.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: versionId,
      },
    }),
  ]);

  revalidatePath(buildStudioPath(resolvedCourseId, resolvedLessonId));
  redirectToBuildStudio(resolvedCourseId, resolvedLessonId, "block-deleted");
}

async function verifyCreatorAccess(courseIdOrSlug: string) {
  const session = await getCurrentSession();
  if (!session || !canAccessCreator(session)) {
    throw new Error("Unauthorized: Access denied");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.email },
  });
  if (!dbUser) {
    throw new Error("Unauthorized: User not found");
  }

  const isAdmin = hasAnyRole(session, ["SUPER_ADMIN", "PLATFORM_ADMIN"]);
  const creatorScope =
    dbUser && !isAdmin
      ? [
          {
            OR: [{ assignedCreatorId: dbUser.id }, { createdById: dbUser.id }],
          },
        ]
      : [];

  const course = await prisma.course.findFirst({
    where: {
      AND: [
        {
          OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }],
        },
        ...creatorScope,
      ],
      archivedAt: null,
    },
    include: {
      versions: {
        orderBy: { versionNumber: "desc" },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found or access denied");
  }

  const editableVersion = course.versions.find(
    (v) =>
      v.status === CourseStatus.DRAFT ||
      v.status === CourseStatus.RETURNED_FOR_REVISION,
  );

  if (!editableVersion) {
    throw new Error("No editable course version exists");
  }

  return { course, editableVersion, dbUser };
}

export async function saveQuizSettingsAction(
  courseSlug: string,
  quizId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { course } = await verifyCreatorAccess(courseSlug);

    const finalTestReqRaw = formData.get("finalTestRequired") ?? formData.get("final-test-final-test-required");
    const finalTestRequired = finalTestReqRaw === "Yes" || finalTestReqRaw === "true";

    const retakeAllowedRaw = formData.get("retakeAllowed") ?? formData.get("final-test-retake-rule");
    const retakeAllowed = retakeAllowedRaw !== "One attempt" && retakeAllowedRaw !== "No";

    const maxAttemptsRaw = formData.get("maxAttempts") ?? formData.get("final-test-max-attempts");
    let maxAttempts: number | null = null;
    if (maxAttemptsRaw) {
      const parsed = parseInt(maxAttemptsRaw as string, 10);
      if (!isNaN(parsed) && parsed > 0) {
        maxAttempts = parsed;
      }
    }

    await prisma.$transaction([
      prisma.course.update({
        where: { id: course.id },
        data: { finalTestRequired },
      }),
      prisma.quiz.update({
        where: { id: quizId },
        data: {
          retakeAllowed,
          maxAttempts,
        },
      }),
    ]);

    revalidatePath(`/creator/courses/${courseSlug}/quiz`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in saveQuizSettingsAction:", error);
    return { success: false, error: error instanceof Error ? error.message : "An internal error occurred" };
  }
}

export async function addQuizQuestionAction(
  courseSlug: string,
  quizId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyCreatorAccess(courseSlug);

    const questionText = ((formData.get("questionText") ?? formData.get("final-test-question-text") ?? "") as string).trim();
    const typeRaw = formData.get("type") ?? formData.get("final-test-question-type");
    const type = typeRaw === "True/False" ? QuizQuestionType.TRUE_FALSE : QuizQuestionType.MULTIPLE_CHOICE;

    const explanation = ((formData.get("explanation") ?? formData.get("final-test-linked-outcome") ?? "") as string).trim();

    let options: string[] = [];
    let correct = "";

    if (type === QuizQuestionType.TRUE_FALSE) {
      options = ["True", "False"];
      correct = ((formData.get("correctAnswer") ?? formData.get("final-test-correct-answer") ?? "") as string).trim();
    } else {
      const optionA = ((formData.get("optionA") ?? formData.get("final-test-option-a") ?? "") as string).trim();
      const optionB = ((formData.get("optionB") ?? formData.get("final-test-option-b") ?? "") as string).trim();
      const optionC = ((formData.get("optionC") ?? formData.get("final-test-option-c") ?? "") as string).trim();
      const optionD = ((formData.get("optionD") ?? formData.get("final-test-option-d") ?? "") as string).trim();

      options = [optionA, optionB, optionC, optionD].filter(Boolean);

      const correctRaw = ((formData.get("correctAnswer") ?? formData.get("final-test-correct-answer") ?? "") as string).trim();
      correct = correctRaw;
      if (correctRaw === "Option A") correct = optionA;
      else if (correctRaw === "Option B") correct = optionB;
      else if (correctRaw === "Option C") correct = optionC;
      else if (correctRaw === "Option D") correct = optionD;
    }

    const count = await prisma.quizQuestion.count({
      where: { quizId },
    });

    await prisma.quizQuestion.create({
      data: {
        quizId,
        type,
        questionText,
        order: count + 1,
        explanation,
        configJson: {
          options,
          correctAnswer: correct,
        },
      },
    });

    revalidatePath(`/creator/courses/${courseSlug}/quiz`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in addQuizQuestionAction:", error);
    return { success: false, error: error instanceof Error ? error.message : "An internal error occurred" };
  }
}

export async function editQuizQuestionAction(
  courseSlug: string,
  questionId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyCreatorAccess(courseSlug);

    const questionText = ((formData.get("questionText") ?? formData.get("final-test-question-text") ?? "") as string).trim();
    const typeRaw = formData.get("type") ?? formData.get("final-test-question-type");
    const type = typeRaw === "True/False" ? QuizQuestionType.TRUE_FALSE : QuizQuestionType.MULTIPLE_CHOICE;

    const explanation = ((formData.get("explanation") ?? formData.get("final-test-linked-outcome") ?? "") as string).trim();

    let options: string[] = [];
    let correct = "";

    if (type === QuizQuestionType.TRUE_FALSE) {
      options = ["True", "False"];
      correct = ((formData.get("correctAnswer") ?? formData.get("final-test-correct-answer") ?? "") as string).trim();
    } else {
      const optionA = ((formData.get("optionA") ?? formData.get("final-test-option-a") ?? "") as string).trim();
      const optionB = ((formData.get("optionB") ?? formData.get("final-test-option-b") ?? "") as string).trim();
      const optionC = ((formData.get("optionC") ?? formData.get("final-test-option-c") ?? "") as string).trim();
      const optionD = ((formData.get("optionD") ?? formData.get("final-test-option-d") ?? "") as string).trim();

      options = [optionA, optionB, optionC, optionD].filter(Boolean);

      const correctRaw = ((formData.get("correctAnswer") ?? formData.get("final-test-correct-answer") ?? "") as string).trim();
      correct = correctRaw;
      if (correctRaw === "Option A") correct = optionA;
      else if (correctRaw === "Option B") correct = optionB;
      else if (correctRaw === "Option C") correct = optionC;
      else if (correctRaw === "Option D") correct = optionD;
    }

    await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        type,
        questionText,
        explanation,
        configJson: {
          options,
          correctAnswer: correct,
        },
      },
    });

    revalidatePath(`/creator/courses/${courseSlug}/quiz`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in editQuizQuestionAction:", error);
    return { success: false, error: error instanceof Error ? error.message : "An internal error occurred" };
  }
}

export async function deleteQuizQuestionAction(
  courseSlug: string,
  questionId: string,
  quizId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyCreatorAccess(courseSlug);

    const target = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
    });

    if (!target) {
      return { success: false, error: "Question not found" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.quizQuestion.delete({
        where: { id: questionId },
      });

      const remaining = await tx.quizQuestion.findMany({
        where: { quizId },
        orderBy: { order: "asc" },
      });

      for (let i = 0; i < remaining.length; i++) {
        await tx.quizQuestion.update({
          where: { id: remaining[i].id },
          data: { order: i + 1 },
        });
      }
    });

    revalidatePath(`/creator/courses/${courseSlug}/quiz`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in deleteQuizQuestionAction:", error);
    return { success: false, error: error instanceof Error ? error.message : "An internal error occurred" };
  }
}

export async function duplicateQuizQuestionAction(
  courseSlug: string,
  questionId: string,
  quizId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyCreatorAccess(courseSlug);

    const target = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
    });

    if (!target) {
      return { success: false, error: "Question not found" };
    }

    const count = await prisma.quizQuestion.count({
      where: { quizId },
    });

    await prisma.quizQuestion.create({
      data: {
        quizId,
        type: target.type,
        questionText: `${target.questionText} (Copy)`,
        order: count + 1,
        explanation: target.explanation,
        configJson: target.configJson ?? {},
      },
    });

    revalidatePath(`/creator/courses/${courseSlug}/quiz`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in duplicateQuizQuestionAction:", error);
    return { success: false, error: error instanceof Error ? error.message : "An internal error occurred" };
  }
}
