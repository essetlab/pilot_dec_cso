import { ContentBlockType, CourseStatus, QuizQuestionType } from "../generated/prisma/enums";
import { hasAnyRole } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import {
  DEMO_CAPACITY_AREAS,
  DEMO_COURSE_MODULES,
  DEMO_PROPOSAL_COURSE,
} from "./demo-data";
import { prisma } from "./prisma";

export type BuildStudioBlock = {
  accessibilityNotes: string | null;
  alignment: {
    expectedLearnerAction: string;
    indicatorId: string;
    indicatorLabel: string;
    learningFunction: string;
    linkedOutcomeId: string;
  };
  configJson: unknown;
  estimatedDurationMinutes: number | null;
  hasAccessibilityWarning: boolean;
  id: string;
  isRequired: boolean;
  order: number;
  readinessWarning: string | null;
  summary: string;
  title: string;
  type: ContentBlockType;
  typeLabel: string;
};

export type BuildStudioOutcomeOption = {
  id: string;
  indicatorId: string;
  indicatorLabel: string;
  order: number;
  statement: string;
};

export type BuildStudioLesson = {
  blockCount: number;
  blocks: BuildStudioBlock[];
  canDelete: boolean;
  description: string | null;
  estimatedDurationMinutes: number | null;
  id: string;
  linkedOutcomeIds: string[];
  order: number;
  title: string;
};

export type BuildStudioModule = {
  canDelete: boolean;
  description: string | null;
  estimatedDurationMinutes: number | null;
  id: string;
  lessons: BuildStudioLesson[];
  order: number;
  title: string;
};

export type BuildStudioCourse = {
  capacityArea: string;
  canEditOutline: boolean;
  dbUserId: string | null;
  editDisabledReason: string | null;
  id: string;
  lastSavedLabel: string;
  modules: BuildStudioModule[];
  outcomeOptions: BuildStudioOutcomeOption[];
  previewHref: string;
  selectedBlock: BuildStudioBlock | null;
  selectedLesson: BuildStudioLesson | null;
  slug: string;
  source: "database" | "fallback";
  statusLabel: string;
  title: string;
  versionId: string | null;
};

const statusLabels: Record<CourseStatus, string> = {
  APPROVED: "Approved",
  ARCHIVED: "Archived",
  DRAFT: "Draft",
  PUBLISHED: "Published",
  READY_FOR_REVIEW: "Ready for review",
  RETURNED_FOR_REVISION: "Returned for revision",
  UNPUBLISHED: "Unpublished",
};

const blockTypeLabels: Partial<Record<ContentBlockType, string>> = {
  ACCORDION: "Accordion",
  BRANCHING_SCENARIO: "Branching Scenario",
  CASE_STUDY: "Case Study",
  EXTERNAL_LINK: "External Link",
  FLASHCARD: "Flashcards",
  IMAGE: "Image",
  KEY_MESSAGE: "Key Message",
  KNOWLEDGE_CHECK: "Knowledge Check",
  PRACTICAL_ACTIVITY_PROMPT: "Practical Activity",
  REFLECTION_PROMPT: "Reflection",
  RESOURCE: "Resource",
  TEXT: "Text",
  VIDEO: "Video",
};

const editableOutlineStatuses: CourseStatus[] = [
  CourseStatus.DRAFT,
  CourseStatus.RETURNED_FOR_REVISION,
];

const summaryKeys = [
  "summary",
  "description",
  "body",
  "message",
  "supportingText",
  "prompt",
  "context",
  "scenario",
  "decisionQuestion",
  "question",
  "instructions",
  "taskInstructions",
  "guidanceText",
  "caption",
  "downloadLabel",
  "externalLink",
  "url",
  "embedUrl",
];

function formatLastSaved(updatedAt: Date | null | undefined) {
  if (!updatedAt) {
    return "Saved recently";
  }

  const formatter = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `Saved ${formatter.format(updatedAt)}`;
}

function getBlockTypeLabel(type: ContentBlockType) {
  return blockTypeLabels[type] ?? "Learning block";
}

function getPreviewSummary(value: string, maxLength = 220) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

function getConfigSummary(configJson: unknown) {
  if (configJson && typeof configJson === "object") {
    const config = configJson as Record<string, unknown>;

    for (const key of summaryKeys) {
      const value = config[key];

      if (typeof value === "string" && value.trim()) {
        return getPreviewSummary(value);
      }
    }
  }

  return "Content details will appear here when this block is configured.";
}

function getConfigString(configJson: unknown, key: string) {
  if (!configJson || typeof configJson !== "object") {
    return "";
  }

  const value = (configJson as Record<string, unknown>)[key];

  return typeof value === "string" ? value.trim() : "";
}

function getConfigStringAny(configJson: unknown, keys: string[]) {
  for (const key of keys) {
    const value = getConfigString(configJson, key);

    if (value) {
      return value;
    }
  }

  return "";
}

function getConfigRecord(configJson: unknown, key: string) {
  if (!configJson || typeof configJson !== "object") {
    return {};
  }

  const value = (configJson as Record<string, unknown>)[key];

  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getRecordString(record: Record<string, unknown>, key: string) {
  const value = record[key];

  return typeof value === "string" ? value.trim() : "";
}

function getOutcomeAlignment(value: unknown) {
  const alignment =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    indicatorId: getRecordString(alignment, "indicatorId"),
  };
}

function getLessonOutcomeIds(value: unknown) {
  const alignment =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const rawIds = alignment.outcomeIds;

  return Array.isArray(rawIds)
    ? rawIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0)
    : [];
}

function getBlockAlignment(
  configJson: unknown,
  indicatorLabelById: Map<string, string>,
  indicatorIdByOutcomeId: Map<string, string>,
) {
  const alignment = getConfigRecord(configJson, "alignment");
  const linkedOutcomeId = getRecordString(alignment, "linkedOutcomeId");
  const explicitIndicatorId = getRecordString(alignment, "indicatorId");
  const indicatorId = explicitIndicatorId || indicatorIdByOutcomeId.get(linkedOutcomeId) || "";

  return {
    expectedLearnerAction: getRecordString(alignment, "expectedLearnerAction"),
    indicatorId,
    indicatorLabel: indicatorLabelById.get(indicatorId) ?? "",
    learningFunction: getRecordString(alignment, "learningFunction"),
    linkedOutcomeId,
  };
}

function getConfigArray(configJson: unknown, key: string) {
  if (!configJson || typeof configJson !== "object") {
    return [];
  }

  const value = (configJson as Record<string, unknown>)[key];

  return Array.isArray(value) ? value : [];
}

function hasCompleteAccordionItem(configJson: unknown) {
  return getConfigArray(configJson, "items").some((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const record = item as Record<string, unknown>;

    return (
      typeof record.title === "string" &&
      record.title.trim() &&
      typeof record.body === "string" &&
      record.body.trim()
    );
  });
}

function hasCompleteFlashcard(configJson: unknown) {
  return getConfigArray(configJson, "cards").some((card) => {
    if (!card || typeof card !== "object") {
      return false;
    }

    const record = card as Record<string, unknown>;

    return (
      typeof record.front === "string" &&
      record.front.trim() &&
      typeof record.back === "string" &&
      record.back.trim()
    );
  });
}

function getKnowledgeCheckOptions(configJson: unknown) {
  return getConfigArray(configJson, "options").filter((option) => {
    if (!option || typeof option !== "object") {
      return false;
    }

    const record = option as Record<string, unknown>;
    const label = record.label ?? record.text;

    return typeof label === "string" && label.trim();
  });
}

function hasKnowledgeCheckCorrectAnswer(configJson: unknown) {
  const correctOptionId = getConfigString(configJson, "correctOptionId");

  return getKnowledgeCheckOptions(configJson).some((option) => {
    const record = option as Record<string, unknown>;
    const isCorrect = record.isCorrect;
    const id = typeof record.id === "string" ? record.id : "";

    return isCorrect === true || Boolean(correctOptionId && id === correctOptionId);
  });
}

function getBranchingChoices(configJson: unknown) {
  const choices = getConfigArray(configJson, "choices");
  const options = getConfigArray(configJson, "options");
  const items =
    choices.length > 0
      ? choices
      : options.length > 0
        ? options
        : getConfigArray(configJson, "decisions");

  return items
    .map((choice, index) => {
      if (!choice || typeof choice !== "object") {
        return null;
      }

      const record = choice as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : `choice-${index + 1}`;
      const rawLabel = record.label ?? record.text;
      const rawFeedback = record.feedback ?? record.consequence;
      const label = typeof rawLabel === "string" ? rawLabel.trim() : "";
      const feedback = typeof rawFeedback === "string" ? rawFeedback.trim() : "";
      const outcomeTone = typeof record.outcomeTone === "string" ? record.outcomeTone : "neutral";

      return label ? { feedback, id, label, outcomeTone } : null;
    })
    .filter(
      (
        choice,
      ): choice is {
        feedback: string;
        id: string;
        label: string;
        outcomeTone: string;
      } => Boolean(choice),
    );
}

function getReadinessWarning(type: ContentBlockType, configJson: unknown) {
  if (type === ContentBlockType.TEXT && !getConfigString(configJson, "body")) {
    return "Add text content before this lesson can be reviewed.";
  }

  if (
    type === ContentBlockType.KEY_MESSAGE &&
    !getConfigString(configJson, "message")
  ) {
    return "Add a key message before this lesson can be reviewed.";
  }

  if (type === ContentBlockType.CASE_STUDY) {
    if (!getConfigString(configJson, "scenario")) {
      return "Add a case scenario before this lesson can be reviewed.";
    }

    if (!getConfigString(configJson, "learningPoint")) {
      return "Add the case learning point before this lesson can be reviewed.";
    }
  }

  if (type === ContentBlockType.RESOURCE && !getConfigString(configJson, "sourceUrl")) {
    return "Add a resource link or file reference before this lesson can be reviewed.";
  }

  if (type === ContentBlockType.EXTERNAL_LINK && !getConfigString(configJson, "url")) {
    return "Add a link URL before this lesson can be reviewed.";
  }

  if (type === ContentBlockType.IMAGE) {
    if (!getConfigString(configJson, "imageUrl")) {
      return "Add an image URL or file reference before this lesson can be reviewed.";
    }

    if (!getConfigString(configJson, "altText")) {
      return "Add alt text before this lesson can be reviewed.";
    }
  }

  if (type === ContentBlockType.VIDEO) {
    if (!getConfigString(configJson, "sourceUrl")) {
      return "Add a video source before this lesson can be reviewed.";
    }

    if (!getConfigString(configJson, "transcript")) {
      return "Add a transcript before this lesson can be reviewed.";
    }

    if (!configJson || typeof configJson !== "object") {
      return "Confirm captions before this lesson can be reviewed.";
    }

    const captionsAvailable = (configJson as Record<string, unknown>).captionsAvailable;

    if (captionsAvailable !== true) {
      return "Confirm captions before this lesson can be reviewed.";
    }
  }

  if (type === ContentBlockType.ACCORDION && !hasCompleteAccordionItem(configJson)) {
    return "Add at least one complete accordion item before this lesson can be reviewed.";
  }

  if (type === ContentBlockType.FLASHCARD && !hasCompleteFlashcard(configJson)) {
    return "Add at least one complete flashcard before this lesson can be reviewed.";
  }

  if (type === ContentBlockType.KNOWLEDGE_CHECK) {
    if (!getConfigString(configJson, "question")) {
      return "Add a knowledge check question before this lesson can be reviewed.";
    }

    if (getKnowledgeCheckOptions(configJson).length < 2) {
      return "Add at least two answer options before this lesson can be reviewed.";
    }

    if (!hasKnowledgeCheckCorrectAnswer(configJson)) {
      return "Select the correct answer before this lesson can be reviewed.";
    }
  }

  if (type === ContentBlockType.BRANCHING_SCENARIO) {
    const scenarioContext =
      getConfigString(configJson, "context") ||
      getConfigString(configJson, "scenario");

    if (!scenarioContext) {
      return "Add scenario context before this lesson can be reviewed.";
    }

    if (!getConfigStringAny(configJson, ["decisionQuestion", "decisionPrompt"])) {
      return "Add a decision question before this lesson can be reviewed.";
    }

    const branchingChoices = getBranchingChoices(configJson);

    if (branchingChoices.length < 2) {
      return "Add at least two choices before this lesson can be reviewed.";
    }

    if (branchingChoices.some((choice) => !choice.feedback)) {
      return "Add feedback for every choice before this lesson can be reviewed.";
    }

    if (!getConfigString(configJson, "learningPoint")) {
      return "Add the learning point before this lesson can be reviewed.";
    }
  }

  if (type === ContentBlockType.REFLECTION_PROMPT) {
    const question = getConfigStringAny(configJson, ["question", "prompt"]);
    if (!question) {
      return "Add a reflection question before this lesson can be reviewed.";
    }

    const questionText = question.toLowerCase();
    const sensitiveKeywords = [
      "personal",
      "sensitive",
      "confidential",
      "secret",
      "private info",
      "disclosure",
      "password",
      "identity",
      "financial",
      "private data",
      "credentials",
    ];
    if (sensitiveKeywords.some((kw) => questionText.includes(kw))) {
      return "This reflection question contains sensitive keywords. Ensure it does not request inappropriate personal disclosures.";
    }
  }

  if (type === ContentBlockType.PRACTICAL_ACTIVITY_PROMPT) {
    if (!getConfigString(configJson, "title")) {
      return "Add a practical activity title before this lesson can be reviewed.";
    }

    if (!getConfigStringAny(configJson, ["taskInstructions", "instruction"])) {
      return "Add task instructions before this lesson can be reviewed.";
    }
  }

  return null;
}

function getSelectedLesson(modules: BuildStudioModule[]) {
  return modules.find((module) => module.lessons.length > 0)?.lessons[0] ?? null;
}

function getSelectedLessonById(
  modules: BuildStudioModule[],
  selectedLessonId?: string,
) {
  if (selectedLessonId) {
    const selectedLesson = modules
      .flatMap((module) => module.lessons)
      .find((lesson) => lesson.id === selectedLessonId);

    if (selectedLesson) {
      return selectedLesson;
    }
  }

  return getSelectedLesson(modules);
}

function getSelectedBlockById(
  selectedLesson: BuildStudioLesson | null,
  selectedBlockId?: string,
) {
  if (!selectedLesson || !selectedBlockId) {
    return null;
  }

  return (
    selectedLesson.blocks.find((block) => block.id === selectedBlockId) ?? null
  );
}

async function getSessionDbUser(session: AuthSession | null) {
  if (!session?.email) {
    return null;
  }

  return prisma.user.findUnique({
    select: {
      email: true,
      id: true,
    },
    where: {
      email: session.email,
    },
  });
}

function getFallbackCourse(
  courseIdOrSlug: string,
  selectedLessonId?: string,
  selectedBlockId?: string,
): BuildStudioCourse {
  const modules = DEMO_COURSE_MODULES.map((module, moduleIndex) => ({
    description: `${module.title} learning sequence`,
    estimatedDurationMinutes: null,
    id: `fallback-module-${moduleIndex + 1}`,
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        blockCount: 0,
        blocks: [],
        canDelete: true,
        description: `${lesson} lesson`,
        estimatedDurationMinutes: null,
        id: `fallback-lesson-${moduleIndex + 1}-${lessonIndex + 1}`,
        linkedOutcomeIds: [],
        order: lessonIndex + 1,
        title: lesson,
      })),
    canDelete: false,
    order: moduleIndex + 1,
    title: module.title,
  }));

  const selectedLesson = getSelectedLessonById(modules, selectedLessonId);

  return {
    capacityArea: DEMO_CAPACITY_AREAS[0],
    canEditOutline: false,
    dbUserId: null,
    editDisabledReason: "This course is available in read-only mode.",
    id: courseIdOrSlug || DEMO_PROPOSAL_COURSE.id,
    lastSavedLabel: "Saved recently",
    modules,
    outcomeOptions: [],
    previewHref: `/creator/courses/${courseIdOrSlug || DEMO_PROPOSAL_COURSE.id}/preview`,
    selectedBlock: getSelectedBlockById(selectedLesson, selectedBlockId),
    selectedLesson,
    slug: DEMO_PROPOSAL_COURSE.slug,
    source: "fallback",
    statusLabel: "Draft",
    title: DEMO_PROPOSAL_COURSE.title,
    versionId: null,
  };
}

export async function getBuildStudioCourse(
  courseIdOrSlug: string,
  session: AuthSession | null,
  selectedLessonId?: string,
  selectedBlockId?: string,
): Promise<BuildStudioCourse> {
  try {
    const dbUser = await getSessionDbUser(session);
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
      select: {
        capacityAreas: {
          select: {
            capacityArea: {
              select: {
                name: true,
              },
            },
          },
        },
        id: true,
        learningOutcomes: {
          orderBy: { order: "asc" },
          select: {
            alignmentMetadataJson: true,
            id: true,
            order: true,
            statement: true,
          },
        },
        slug: true,
        status: true,
        title: true,
        updatedAt: true,
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
          select: {
            id: true,
            modules: {
              orderBy: {
                order: "asc",
              },
              select: {
                description: true,
                estimatedDurationMinutes: true,
                id: true,
                lessons: {
                  orderBy: {
                    order: "asc",
                  },
                  select: {
                    _count: {
                      select: {
                        feedback: true,
                        learningOutcomes: true,
                        lessonProgress: true,
                      },
                    },
                    contentBlocks: {
                      orderBy: {
                        order: "asc",
                      },
                      select: {
                        accessibilityNotes: true,
                        configJson: true,
                        estimatedDurationMinutes: true,
                        hasAccessibilityWarning: true,
                        id: true,
                        isRequired: true,
                        order: true,
                        title: true,
                        type: true,
                      },
                    },
                    description: true,
                    estimatedDurationMinutes: true,
                    id: true,
                    alignmentMetadataJson: true,
                    order: true,
                    title: true,
                  },
                },
                order: true,
                title: true,
              },
            },
            status: true,
            updatedAt: true,
            versionNumber: true,
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
      return getFallbackCourse(courseIdOrSlug, selectedLessonId, selectedBlockId);
    }

    const selectedVersion =
      course.versions.find((version) => version.status === CourseStatus.DRAFT) ??
      course.versions.find(
        (version) => version.status === CourseStatus.RETURNED_FOR_REVISION,
      ) ??
      course.versions.find(
        (version) => version.status === CourseStatus.READY_FOR_REVIEW,
      ) ??
      course.versions.find((version) => version.status === CourseStatus.APPROVED) ??
      course.versions.find((version) => version.status === CourseStatus.PUBLISHED) ??
      course.versions[0] ??
      null;

    const outcomeIndicatorIds = course.learningOutcomes
      .map((outcome) => getOutcomeAlignment(outcome.alignmentMetadataJson).indicatorId)
      .filter(Boolean);
    const indicators =
      outcomeIndicatorIds.length > 0
        ? await prisma.indicator.findMany({
            select: {
              id: true,
              indicatorCode: true,
              indicatorName: true,
            },
            where: {
              id: { in: Array.from(new Set(outcomeIndicatorIds)) },
            },
          })
        : [];
    const indicatorLabelById = new Map(
      indicators.map((indicator) => [
        indicator.id,
        `${indicator.indicatorCode} - ${indicator.indicatorName}`,
      ]),
    );
    const outcomeOptions = course.learningOutcomes.map((outcome) => {
      const alignment = getOutcomeAlignment(outcome.alignmentMetadataJson);

      return {
        id: outcome.id,
        indicatorId: alignment.indicatorId,
        indicatorLabel: indicatorLabelById.get(alignment.indicatorId) ?? "",
        order: outcome.order,
        statement: outcome.statement,
      };
    });
    const indicatorIdByOutcomeId = new Map(
      outcomeOptions.map((outcome) => [outcome.id, outcome.indicatorId]),
    );

    const modules =
      selectedVersion?.modules.map((module) => ({
        description: module.description,
        estimatedDurationMinutes: module.estimatedDurationMinutes,
        id: module.id,
        lessons: module.lessons.map((lesson) => {
          const blocks = lesson.contentBlocks.map((block) => ({
            accessibilityNotes: block.accessibilityNotes,
            alignment: getBlockAlignment(
              block.configJson,
              indicatorLabelById,
              indicatorIdByOutcomeId,
            ),
            configJson: block.configJson,
            estimatedDurationMinutes: block.estimatedDurationMinutes,
            hasAccessibilityWarning: block.hasAccessibilityWarning,
            id: block.id,
            isRequired: block.isRequired,
            order: block.order,
            readinessWarning: getReadinessWarning(block.type, block.configJson),
            summary: getConfigSummary(block.configJson),
            title: block.title,
            type: block.type,
            typeLabel: getBlockTypeLabel(block.type),
          }));

          return {
            blockCount: blocks.length,
            blocks,
            canDelete:
              blocks.length === 0 &&
              lesson._count.feedback === 0 &&
              lesson._count.learningOutcomes === 0 &&
              lesson._count.lessonProgress === 0,
            description: lesson.description,
            estimatedDurationMinutes: lesson.estimatedDurationMinutes,
            id: lesson.id,
            linkedOutcomeIds: getLessonOutcomeIds(lesson.alignmentMetadataJson),
            order: lesson.order,
            title: lesson.title,
          };
        }),
        canDelete: module.lessons.length === 0,
        order: module.order,
        title: module.title,
      })) ?? [];

    const canEditOutline = selectedVersion
      ? editableOutlineStatuses.includes(selectedVersion.status)
      : false;
    const selectedLesson = getSelectedLessonById(modules, selectedLessonId);

    return {
      capacityArea: course.capacityAreas[0]?.capacityArea.name ?? "Course content",
      canEditOutline,
      dbUserId: dbUser?.id ?? null,
      editDisabledReason: canEditOutline
        ? null
        : "This course outline is read-only while the course is published or in review.",
      id: course.id,
      lastSavedLabel: formatLastSaved(selectedVersion?.updatedAt ?? course.updatedAt),
      modules,
      outcomeOptions,
      previewHref: `/creator/courses/${course.id}/preview`,
      selectedBlock: getSelectedBlockById(selectedLesson, selectedBlockId),
      selectedLesson,
      slug: course.slug,
      source: "database",
      statusLabel: statusLabels[selectedVersion?.status ?? course.status],
      title: course.title,
      versionId: selectedVersion?.id ?? null,
    };
  } catch {
    return getFallbackCourse(courseIdOrSlug, selectedLessonId, selectedBlockId);
  }
}

export type CreatorQuizData = {
  course: {
    id: string;
    slug: string;
    title: string;
    finalTestRequired: boolean;
    defaultPassThreshold: number;
    capacityArea: string;
  };
  version: {
    id: string;
    status: CourseStatus;
    versionNumber: number;
  };
  quiz: {
    id: string;
    title: string;
    description: string | null;
    isFinalTest: boolean;
    passThreshold: number;
    retakeAllowed: boolean;
    maxAttempts: number | null;
  } | null;
  questions: {
    id: string;
    type: QuizQuestionType;
    questionText: string;
    order: number;
    points: number;
    explanation: string | null;
    configJson: unknown;
  }[];
  learningOutcomes: {
    id: string;
    statement: string;
    order: number;
  }[];
  isEditable: boolean;
};

export async function getCreatorQuizData(
  courseIdOrSlug: string,
  session: AuthSession | null,
): Promise<CreatorQuizData | null> {
  try {
    const dbUser = await getSessionDbUser(session);
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
      select: {
        id: true,
        slug: true,
        title: true,
        finalTestRequired: true,
        defaultPassThreshold: true,
        capacityAreas: {
          select: {
            capacityArea: {
              select: {
                name: true,
              },
            },
          },
        },
        learningOutcomes: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            statement: true,
            order: true,
          },
        },
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
          select: {
            id: true,
            status: true,
            versionNumber: true,
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
      return null;
    }

    // Find the latest editable version (DRAFT or RETURNED_FOR_REVISION)
    let selectedVersion = course.versions.find(
      (v) =>
        v.status === CourseStatus.DRAFT ||
        v.status === CourseStatus.RETURNED_FOR_REVISION,
    );

    let isEditable = true;
    if (!selectedVersion) {
      isEditable = false;
      // If no editable version, look at the latest version
      selectedVersion = course.versions[0];
    }

    if (!selectedVersion) {
      return null;
    }

    let quiz = await prisma.quiz.findFirst({
      where: {
        courseVersionId: selectedVersion.id,
        isFinalTest: true,
      },
    });

    // Initialize/Create quiz if editable and not found
    if (!quiz && isEditable) {
      quiz = await prisma.quiz.create({
        data: {
          courseVersionId: selectedVersion.id,
          title: `${course.title} Final Test`,
          isFinalTest: true,
          passThreshold: 80,
          retakeAllowed: true,
          maxAttempts: 3,
        },
      });
    }

    const questions = quiz
      ? await prisma.quizQuestion.findMany({
          orderBy: { order: "asc" },
          where: {
            quizId: quiz.id,
          },
        })
      : [];

    return {
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        finalTestRequired: course.finalTestRequired,
        defaultPassThreshold: course.defaultPassThreshold,
        capacityArea: course.capacityAreas[0]?.capacityArea.name ?? "Course content",
      },
      version: {
        id: selectedVersion.id,
        status: selectedVersion.status,
        versionNumber: selectedVersion.versionNumber,
      },
      quiz: quiz
        ? {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            isFinalTest: quiz.isFinalTest,
            passThreshold: quiz.passThreshold,
            retakeAllowed: quiz.retakeAllowed,
            maxAttempts: quiz.maxAttempts,
          }
        : null,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type as QuizQuestionType,
        questionText: q.questionText,
        order: q.order,
        points: q.points,
        explanation: q.explanation,
        configJson: q.configJson,
      })),
      learningOutcomes: course.learningOutcomes,
      isEditable,
    };
  } catch (error) {
    console.error("Error loading creator quiz data:", error);
    return null;
  }
}
