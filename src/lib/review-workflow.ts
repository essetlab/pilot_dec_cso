import {
  AuditActionType,
  ContentBlockType,
  CourseStatus,
  CourseVisibility,
} from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import { canAccessAdmin, canAccessCreator, canAccessReview, hasAnyRole } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import { cleanPresentationText } from "./presentation-text";
import { prisma } from "./prisma";

export type BadgeTone = "blue" | "green" | "gray" | "orange" | "red" | "purple" | "gold";

export type ReviewReadinessItem = {
  label: string;
  status: string;
  tone: BadgeTone;
  severity: "pass" | "warning" | "error";
};

export type ReviewCourseSummary = {
  assignedCreator: string;
  capacityArea: string;
  certificateEligibleLabel: string;
  finalTestLabel: string;
  href: string;
  id: string;
  lessonCount: number;
  resourceCount: number;
  readinessErrors: number;
  readinessItems: ReviewReadinessItem[];
  readinessWarnings: number;
  reviewerFeedback: string | null;
  slug: string;
  status: CourseStatus;
  statusLabel: string;
  statusTone: BadgeTone;
  submitHref: string;
  title: string;
  versionId: string | null;
  versionNumber: number | null;
};

export type ReviewQueueData = {
  courses: ReviewCourseSummary[];
  metrics: {
    approved: number;
    published: number;
    returned: number;
    readyForReview: number;
  };
  selectedCourse: ReviewCourseSummary | null;
};

export type AuditEntrySummary = {
  actionLabel: string;
  actorName: string;
  area: string;
  createdAtLabel: string;
  description: string;
  entityId: string;
  entityType: string;
  id: string;
  reference: string;
  statusLabel: string;
  statusTone: BadgeTone;
};

export type ReviewCourseDetail = {
  auditEntries: AuditEntrySummary[];
  course: ReviewCourseSummary;
};

export type AuditLogData = {
  entries: AuditEntrySummary[];
  filterOptions: {
    actors: { id: string; label: string }[];
    areas: { id: string; label: string }[];
    dateRanges: { id: string; label: string }[];
  };
  filters: Required<AuditLogFilters>;
  metrics: {
    adminActions: number;
    courseEvents: number;
    recentEvents: number;
    accessEvents: number;
  };
  selectedEntry: AuditEntrySummary | null;
};

export type AuditLogFilters = {
  actor?: string;
  area?: string;
  dateRange?: string;
  query?: string;
};

type WorkflowCourseRecord = Awaited<ReturnType<typeof queryWorkflowCourse>>;
type WorkflowVersion = NonNullable<WorkflowCourseRecord>["versions"][number];
type WorkflowBlock = WorkflowVersion["modules"][number]["lessons"][number]["contentBlocks"][number];

export const reviewNoticeLabels: Record<string, string> = {
  approved: "Course approved.",
  archived: "Course archived.",
  blocked: "Resolve the blocking readiness items before submitting.",
  "invalid-transition": "This course is not in the right status for that action.",
  "not-found": "Course not found or access denied.",
  published: "Course published for participants.",
  returned: "Course returned for revision.",
  submitted: "Course submitted for review.",
  unauthorized: "You do not have permission for that action.",
  unpublished: "Course unpublished.",
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

const statusTones: Record<CourseStatus, BadgeTone> = {
  APPROVED: "green",
  ARCHIVED: "gray",
  DRAFT: "blue",
  PUBLISHED: "green",
  READY_FOR_REVIEW: "purple",
  RETURNED_FOR_REVISION: "gold",
  UNPUBLISHED: "orange",
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

const reviewQueueStatuses = [
  CourseStatus.READY_FOR_REVIEW,
  CourseStatus.APPROVED,
  CourseStatus.PUBLISHED,
  CourseStatus.RETURNED_FOR_REVISION,
  CourseStatus.UNPUBLISHED,
];

const actionLabels: Record<AuditActionType, string> = {
  CERTIFICATE_ISSUED: "Certificate issued",
  CERTIFICATE_REVOKED: "Certificate revoked",
  COHORT_CREATED: "Cohort created",
  COHORT_UPDATED: "Cohort updated",
  COURSE_APPROVED: "Course approved",
  COURSE_ARCHIVED: "Course archived",
  COURSE_CREATED: "Course created",
  COURSE_PUBLISHED: "Course published",
  COURSE_RETURNED_FOR_REVISION: "Course returned",
  COURSE_STATUS_CHANGED: "Course status changed",
  COURSE_SUBMITTED_FOR_REVIEW: "Course submitted",
  COURSE_UNPUBLISHED: "Course unpublished",
  COURSE_UPDATED: "Course updated",
  LOGIN: "User sign-in",
  LOGOUT: "User sign-out",
  ORGANIZATION_CREATED: "Organization created",
  ORGANIZATION_UPDATED: "Organization updated",
  REFERENCE_DATA_UPDATED: "Reference data updated",
  ROLE_ASSIGNED: "Role assigned",
  ROLE_REMOVED: "Role removed",
  USER_CREATED: "User created",
  USER_DEACTIVATED: "User deactivated",
  USER_UPDATED: "User updated",
};

function getAuditArea(actionType: AuditActionType) {
  if (actionType.startsWith("COURSE_")) {
    return actionType === AuditActionType.COURSE_SUBMITTED_FOR_REVIEW ||
      actionType === AuditActionType.COURSE_RETURNED_FOR_REVISION ||
      actionType === AuditActionType.COURSE_APPROVED
      ? "Review"
      : "Courses";
  }

  if (actionType.startsWith("CERTIFICATE_")) {
    return "Certificates";
  }

  if (actionType === AuditActionType.LOGIN || actionType === AuditActionType.LOGOUT) {
    return "Access";
  }

  if (actionType.startsWith("ORGANIZATION_")) {
    return "Organizations";
  }

  if (actionType.startsWith("COHORT_")) {
    return "Cohorts";
  }

  if (actionType.startsWith("USER_") || actionType.startsWith("ROLE_")) {
    return "Users";
  }

  return "Platform";
}

const auditDateRanges = [
  { id: "", label: "Recent activity" },
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

function auditRangeStart(value: string) {
  const now = new Date();

  if (value === "today") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }

  if (value === "7d" || value === "30d") {
    const start = new Date(now);
    start.setUTCDate(start.getUTCDate() - (value === "7d" ? 7 : 30));
    return start;
  }

  return null;
}

function auditActionTypesForArea(area: string) {
  if (!area) {
    return [];
  }

  return Object.values(AuditActionType).filter((actionType) => getAuditArea(actionType) === area);
}

function getAuditTone(actionType: AuditActionType): BadgeTone {
  if (
    actionType === AuditActionType.COURSE_RETURNED_FOR_REVISION ||
    actionType === AuditActionType.COURSE_ARCHIVED
  ) {
    return "gold";
  }

  if (
    actionType === AuditActionType.COURSE_APPROVED ||
    actionType === AuditActionType.COURSE_PUBLISHED ||
    actionType === AuditActionType.CERTIFICATE_ISSUED
  ) {
    return "green";
  }

  if (actionType === AuditActionType.LOGIN || actionType === AuditActionType.LOGOUT) {
    return "blue";
  }

  if (actionType.startsWith("COURSE_")) {
    return "purple";
  }

  return "gray";
}

function formatAuditDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
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

function getMetadataString(metadataJson: unknown, key: string) {
  if (!metadataJson || typeof metadataJson !== "object" || Array.isArray(metadataJson)) {
    return "";
  }

  const value = (metadataJson as Record<string, unknown>)[key];

  return typeof value === "string" ? value.trim() : "";
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

      return label ? { feedback, id, label } : null;
    })
    .filter(
      (
        choice,
      ): choice is {
        feedback: string;
        id: string;
        label: string;
      } => Boolean(choice),
    );
}

function getBlockReadinessWarning(block: WorkflowBlock) {
  const { configJson, type } = block;
  const blockLabel = blockTypeLabels[type] ?? "Learning block";

  if (type === ContentBlockType.TEXT && !getConfigString(configJson, "body")) {
    return `${blockLabel}: add text content.`;
  }

  if (type === ContentBlockType.KEY_MESSAGE && !getConfigString(configJson, "message")) {
    return `${blockLabel}: add a key message.`;
  }

  if (type === ContentBlockType.CASE_STUDY) {
    if (!getConfigString(configJson, "scenario")) {
      return `${blockLabel}: add a case scenario.`;
    }

    if (!getConfigString(configJson, "learningPoint")) {
      return `${blockLabel}: add the learning point.`;
    }
  }

  if (type === ContentBlockType.RESOURCE && !getConfigString(configJson, "sourceUrl")) {
    return `${blockLabel}: add a resource link or file reference.`;
  }

  if (type === ContentBlockType.EXTERNAL_LINK && !getConfigString(configJson, "url")) {
    return `${blockLabel}: add a link URL.`;
  }

  if (type === ContentBlockType.IMAGE) {
    if (!getConfigString(configJson, "imageUrl")) {
      return `${blockLabel}: add an image URL or file reference.`;
    }

    if (!getConfigString(configJson, "altText")) {
      return `${blockLabel}: add alt text.`;
    }
  }

  if (type === ContentBlockType.VIDEO) {
    if (!getConfigString(configJson, "sourceUrl")) {
      return `${blockLabel}: add a video source.`;
    }

    if (!getConfigString(configJson, "transcript")) {
      return `${blockLabel}: add a transcript.`;
    }

    const captionsAvailable =
      configJson && typeof configJson === "object"
        ? (configJson as Record<string, unknown>).captionsAvailable
        : false;

    if (captionsAvailable !== true) {
      return `${blockLabel}: confirm captions.`;
    }
  }

  if (type === ContentBlockType.ACCORDION && !hasCompleteAccordionItem(configJson)) {
    return `${blockLabel}: add at least one complete item.`;
  }

  if (type === ContentBlockType.FLASHCARD && !hasCompleteFlashcard(configJson)) {
    return `${blockLabel}: add at least one complete card.`;
  }

  if (type === ContentBlockType.KNOWLEDGE_CHECK) {
    if (!getConfigString(configJson, "question")) {
      return `${blockLabel}: add a question.`;
    }

    if (getKnowledgeCheckOptions(configJson).length < 2) {
      return `${blockLabel}: add at least two answer options.`;
    }

    if (!hasKnowledgeCheckCorrectAnswer(configJson)) {
      return `${blockLabel}: select the correct answer.`;
    }
  }

  if (type === ContentBlockType.BRANCHING_SCENARIO) {
    const scenarioContext =
      getConfigString(configJson, "context") ||
      getConfigString(configJson, "scenario");

    if (!scenarioContext) {
      return `${blockLabel}: add scenario context.`;
    }

    if (!getConfigStringAny(configJson, ["decisionQuestion", "decisionPrompt"])) {
      return `${blockLabel}: add a decision question.`;
    }

    const branchingChoices = getBranchingChoices(configJson);

    if (branchingChoices.length < 2) {
      return `${blockLabel}: add at least two choices.`;
    }

    if (branchingChoices.some((choice) => !choice.feedback)) {
      return `${blockLabel}: add feedback for every choice.`;
    }

    if (!getConfigString(configJson, "learningPoint")) {
      return `${blockLabel}: add the learning point.`;
    }
  }

  if (type === ContentBlockType.REFLECTION_PROMPT) {
    const question = getConfigStringAny(configJson, ["question", "prompt"]);
    if (!question) {
      return `${blockLabel}: add a reflection question.`;
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

    if (sensitiveKeywords.some((keyword) => questionText.includes(keyword))) {
      return `${blockLabel}: review sensitive wording before publication.`;
    }
  }

  if (type === ContentBlockType.PRACTICAL_ACTIVITY_PROMPT) {
    if (!getConfigString(configJson, "title")) {
      return `${blockLabel}: add a practical activity title.`;
    }

    if (!getConfigStringAny(configJson, ["taskInstructions", "instruction"])) {
      return `${blockLabel}: add task instructions.`;
    }
  }

  return null;
}

async function queryWorkflowCourse(courseIdOrSlug: string, session?: AuthSession | null) {
  const dbUser = session?.email
    ? await prisma.user.findUnique({
        select: { id: true },
        where: { email: session.email },
      })
    : null;
  const isAdmin = hasAnyRole(session ?? null, ["SUPER_ADMIN", "PLATFORM_ADMIN"]);
  const creatorScope =
    dbUser && !isAdmin && canAccessCreator(session ?? null)
      ? [{ OR: [{ assignedCreatorId: dbUser.id }, { createdById: dbUser.id }] }]
      : [];

  return prisma.course.findFirst({
    select: {
      assignedCreator: {
        select: {
          fullName: true,
        },
      },
      analysisMetadataJson: true,
      capacityAreas: {
        select: {
          capacityArea: {
            select: {
              name: true,
            },
          },
        },
      },
      certificateEligible: true,
      capacityGapAddressed: true,
      createdById: true,
      defaultPassThreshold: true,
      finalTestRequired: true,
      id: true,
      learningOutcomes: {
        select: {
          alignmentMetadataJson: true,
          id: true,
        },
      },
      resources: {
        select: {
          id: true,
        },
        where: {
          archivedAt: null,
        },
      },
      shortDescription: true,
      intendedPracticeImprovement: true,
      slug: true,
      status: true,
      title: true,
      visibility: true,
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
              lessons: {
                orderBy: {
                  order: "asc",
                },
                select: {
                  contentBlocks: {
                    orderBy: {
                      order: "asc",
                    },
                    select: {
                      configJson: true,
                      id: true,
                      title: true,
                      type: true,
                    },
                  },
                  id: true,
                  title: true,
                },
              },
              title: true,
            },
          },
          publishedAt: true,
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
}

function getWorkflowVersion(
  versions: WorkflowVersion[],
  preferredStatuses?: CourseStatus[],
) {
  if (preferredStatuses) {
    const preferredVersion = versions.find((version) =>
      preferredStatuses.includes(version.status),
    );

    if (preferredVersion) {
      return preferredVersion;
    }
  }

  return (
    versions.find((version) => version.status === CourseStatus.DRAFT) ??
    versions.find((version) => version.status === CourseStatus.RETURNED_FOR_REVISION) ??
    versions.find((version) => version.status === CourseStatus.READY_FOR_REVIEW) ??
    versions.find((version) => version.status === CourseStatus.APPROVED) ??
    versions.find((version) => version.status === CourseStatus.PUBLISHED) ??
    versions[0] ??
    null
  );
}

function buildItem(
  label: string,
  passed: boolean,
  issueLabel: string,
): ReviewReadinessItem {
  return passed
    ? {
        label,
        severity: "pass",
        status: "Ready",
        tone: "green",
      }
    : {
        label,
        severity: "error",
        status: issueLabel,
        tone: "red",
      };
}

function warningItem(label: string, status: string): ReviewReadinessItem {
  return {
    label,
    severity: "warning",
    status,
    tone: "gold",
  };
}

function getReadinessItems(course: NonNullable<WorkflowCourseRecord>, version: WorkflowVersion | null) {
  const modules = version?.modules ?? [];
  const lessons = modules.flatMap((module) => module.lessons);
  const blocks = lessons.flatMap((lesson) => lesson.contentBlocks);
  const finalTest = version
    ? {
        configured: false,
      }
    : null;

  const items: ReviewReadinessItem[] = [
    buildItem("Course title", Boolean(course.title.trim()), "Missing"),
    buildItem("Course description", Boolean(course.shortDescription.trim()), "Missing"),
    buildItem("Capacity area", course.capacityAreas.length > 0, "Select capacity area"),
    buildItem(
      "CSO practice",
      Boolean(getMetadataString(course.analysisMetadataJson, "csoPracticeId")),
      "Select practice",
    ),
    buildItem(
      "Capacity gap",
      Boolean(course.capacityGapAddressed?.trim()),
      "Describe gap",
    ),
    buildItem(
      "Practice improvement",
      Boolean(course.intendedPracticeImprovement?.trim()),
      "Describe improvement",
    ),
    buildItem(
      "Learning barrier",
      Boolean(getMetadataString(course.analysisMetadataJson, "ksmePrimary")),
      "Select primary factor",
    ),
    buildItem(
      "Course fit",
      Boolean(getMetadataString(course.analysisMetadataJson, "courseFitDecision")),
      "Select fit",
    ),
    buildItem("Learning outcomes", course.learningOutcomes.length > 0, "Add outcomes"),
    buildItem(
      "Outcome alignment",
      course.learningOutcomes.length > 0 &&
        course.learningOutcomes.every(
          (outcome) =>
            Boolean(getMetadataString(outcome.alignmentMetadataJson, "capacityAreaId")) &&
            Boolean(getMetadataString(outcome.alignmentMetadataJson, "csoPracticeId")),
        ),
      "Link outcomes",
    ),
    buildItem(
      "Outcome evidence",
      course.learningOutcomes.some(
        (outcome) =>
          Boolean(getMetadataString(outcome.alignmentMetadataJson, "assessmentMethod")) ||
          Boolean(getMetadataString(outcome.alignmentMetadataJson, "indicatorId")),
      ),
      "Add assessment",
    ),
    buildItem("Course modules", modules.length > 0, "Add module"),
    buildItem("Course lessons", lessons.length > 0, "Add lesson"),
    buildItem("Lesson content", lessons.length > 0 && lessons.every((lesson) => lesson.contentBlocks.length > 0), "Add blocks"),
  ];

  for (const block of blocks) {
    const warning = getBlockReadinessWarning(block);

    if (warning) {
      items.push(warningItem(block.title || blockTypeLabels[block.type] || "Learning block", warning));
    }
  }

  if (course.finalTestRequired) {
    const hasFinalTest = version ? false : Boolean(finalTest?.configured);
    items.push(
      buildItem(
        "Final test",
        hasFinalTest,
        "Add questions",
      ),
    );
  } else {
    items.push({
      label: "Final test",
      severity: "pass",
      status: "Not required",
      tone: "gray",
    });
  }

  return items;
}

async function getFinalTestInfo(versionId: string | null) {
  if (!versionId) {
    return {
      label: "Not configured",
      questionCount: 0,
    };
  }

  const quiz = await prisma.quiz.findFirst({
    select: {
      passThreshold: true,
      questions: {
        select: {
          id: true,
        },
      },
    },
    where: {
      courseVersionId: versionId,
      isFinalTest: true,
    },
  });

  const questionCount = quiz?.questions.length ?? 0;

  return {
    label:
      questionCount > 0
        ? `${questionCount} questions, ${quiz?.passThreshold ?? 80}% pass`
        : "Not configured",
    questionCount,
  };
}

async function getLatestReviewerFeedback(courseId: string) {
  const auditLog = await prisma.auditLog.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      description: true,
      metadataJson: true,
    },
    where: {
      actionType: AuditActionType.COURSE_RETURNED_FOR_REVISION,
      entityId: courseId,
      entityType: "Course",
    },
  });

  if (!auditLog) {
    return null;
  }

  if (
    auditLog.metadataJson &&
    typeof auditLog.metadataJson === "object" &&
    "comment" in auditLog.metadataJson
  ) {
    const comment = auditLog.metadataJson.comment;

    if (typeof comment === "string" && comment.trim()) {
      return comment;
    }
  }

  return auditLog.description;
}

async function mapCourseToSummary(
  course: NonNullable<WorkflowCourseRecord>,
  preferredStatuses?: CourseStatus[],
): Promise<ReviewCourseSummary> {
  const version = getWorkflowVersion(course.versions, preferredStatuses);
  const finalTestInfo = await getFinalTestInfo(version?.id ?? null);
  const readinessItems = getReadinessItems(course, version);

  if (course.finalTestRequired) {
    const finalTestItem = readinessItems.find((item) => item.label === "Final test");

    if (finalTestItem && finalTestInfo.questionCount > 0) {
      finalTestItem.severity = "pass";
      finalTestItem.status = "Ready";
      finalTestItem.tone = "green";
    }
  }

  const readinessErrors = readinessItems.filter((item) => item.severity === "error").length;
  const readinessWarnings = readinessItems.filter((item) => item.severity === "warning").length;
  const lessonCount =
    version?.modules.reduce((total, module) => total + module.lessons.length, 0) ?? 0;
  const status = version?.status ?? course.status;

  return {
    assignedCreator: cleanPresentationText(course.assignedCreator.fullName),
    capacityArea: course.capacityAreas[0]?.capacityArea.name ?? "Course content",
    certificateEligibleLabel: course.certificateEligible ? "Eligible" : "Not eligible",
    finalTestLabel: course.finalTestRequired ? finalTestInfo.label : "Not required",
    href: `/admin/review/${course.id}`,
    id: course.id,
    lessonCount,
    readinessErrors,
    readinessItems,
    readinessWarnings,
    resourceCount: course.resources.length,
    reviewerFeedback: await getLatestReviewerFeedback(course.id),
    slug: course.slug,
    status,
    statusLabel: statusLabels[status],
    statusTone: statusTones[status],
    submitHref: `/creator/courses/${course.id}/submit`,
    title: course.title,
    versionId: version?.id ?? null,
    versionNumber: version?.versionNumber ?? null,
  };
}

export async function getCreatorReviewCourse(
  courseIdOrSlug: string,
  session: AuthSession | null,
) {
  if (!canAccessCreator(session)) {
    return null;
  }

  const course = await queryWorkflowCourse(courseIdOrSlug, session);

  if (!course) {
    return null;
  }

  return mapCourseToSummary(course, [
    CourseStatus.DRAFT,
    CourseStatus.RETURNED_FOR_REVISION,
    CourseStatus.READY_FOR_REVIEW,
    CourseStatus.APPROVED,
    CourseStatus.PUBLISHED,
  ]);
}

export async function getReviewQueueData(
  session: AuthSession | null,
): Promise<ReviewQueueData> {
  if (!canAccessReview(session) && !canAccessAdmin(session)) {
    return {
      courses: [],
      metrics: {
        approved: 0,
        published: 0,
        readyForReview: 0,
        returned: 0,
      },
      selectedCourse: null,
    };
  }

  const records = await prisma.course.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      assignedCreator: {
        select: {
          fullName: true,
        },
      },
      analysisMetadataJson: true,
      capacityAreas: {
        select: {
          capacityArea: {
            select: {
              name: true,
            },
          },
        },
      },
      capacityGapAddressed: true,
      certificateEligible: true,
      createdById: true,
      defaultPassThreshold: true,
      finalTestRequired: true,
      id: true,
      learningOutcomes: {
        select: {
          alignmentMetadataJson: true,
          id: true,
        },
      },
      resources: {
        select: {
          id: true,
        },
        where: {
          archivedAt: null,
        },
      },
      shortDescription: true,
      intendedPracticeImprovement: true,
      slug: true,
      status: true,
      title: true,
      visibility: true,
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
              lessons: {
                orderBy: {
                  order: "asc",
                },
                select: {
                  contentBlocks: {
                    orderBy: {
                      order: "asc",
                    },
                    select: {
                      configJson: true,
                      id: true,
                      title: true,
                      type: true,
                    },
                  },
                  id: true,
                  title: true,
                },
              },
              title: true,
            },
          },
          publishedAt: true,
          status: true,
          versionNumber: true,
        },
      },
    },
    where: {
      archivedAt: null,
      status: {
        in: reviewQueueStatuses,
      },
    },
  });

  const courses = await Promise.all(records.map((record) => mapCourseToSummary(record)));

  return {
    courses,
    metrics: {
      approved: courses.filter((course) => course.status === CourseStatus.APPROVED).length,
      published: courses.filter((course) => course.status === CourseStatus.PUBLISHED).length,
      readyForReview: courses.filter((course) => course.status === CourseStatus.READY_FOR_REVIEW).length,
      returned: courses.filter((course) => course.status === CourseStatus.RETURNED_FOR_REVISION).length,
    },
    selectedCourse: courses[0] ?? null,
  };
}

async function getAuditEntries(where?: Prisma.AuditLogWhereInput) {
  const entries = await prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      actionType: true,
      actor: {
        select: {
          fullName: true,
        },
      },
      createdAt: true,
      description: true,
      entityId: true,
      entityType: true,
      id: true,
    },
    take: 30,
    where,
  });
  const courseIds = entries
    .filter((entry) => entry.entityType === "Course")
    .map((entry) => entry.entityId);
  const courses =
    courseIds.length > 0
      ? await prisma.course.findMany({
          select: {
            id: true,
            title: true,
          },
          where: {
            id: {
              in: courseIds,
            },
          },
        })
      : [];
  const courseTitleById = new Map(courses.map((course) => [course.id, course.title]));

  return entries.map((entry): AuditEntrySummary => {
    const reference =
      entry.entityType === "Course"
        ? courseTitleById.get(entry.entityId) ?? entry.entityId
        : entry.entityId;

    return {
      actionLabel: actionLabels[entry.actionType],
      actorName: cleanPresentationText(entry.actor.fullName),
      area: getAuditArea(entry.actionType),
      createdAtLabel: formatAuditDate(entry.createdAt),
      description: cleanPresentationText(entry.description),
      entityId: cleanPresentationText(entry.entityId),
      entityType: entry.entityType,
      id: entry.id,
      reference: cleanPresentationText(reference),
      statusLabel: "Recorded",
      statusTone: getAuditTone(entry.actionType),
    };
  });
}

export async function getReviewCourseDetail(
  courseIdOrSlug: string,
  session: AuthSession | null,
): Promise<ReviewCourseDetail | null> {
  if (!canAccessReview(session) && !canAccessAdmin(session)) {
    return null;
  }

  const course = await queryWorkflowCourse(courseIdOrSlug, session);

  if (!course) {
    return null;
  }

  const summary = await mapCourseToSummary(course);
  const auditEntries = await getAuditEntries({
    entityId: summary.id,
    entityType: "Course",
  });

  return {
    auditEntries,
    course: summary,
  };
}

export async function getAuditLogData(
  session: AuthSession | null,
  filters: AuditLogFilters = {},
): Promise<AuditLogData> {
  const selectedFilters: Required<AuditLogFilters> = {
    actor: filters.actor ?? "",
    area: filters.area ?? "",
    dateRange: filters.dateRange ?? "",
    query: filters.query ?? "",
  };

  if (!canAccessAdmin(session)) {
    return {
      entries: [],
      filterOptions: { actors: [], areas: [], dateRanges: auditDateRanges },
      filters: selectedFilters,
      metrics: {
        accessEvents: 0,
        adminActions: 0,
        courseEvents: 0,
        recentEvents: 0,
      },
      selectedEntry: null,
    };
  }

  const actionTypes = auditActionTypesForArea(selectedFilters.area);
  const startedAt = auditRangeStart(selectedFilters.dateRange);
  const query = selectedFilters.query.trim();
  const actorFilterValues = selectedFilters.actor
    ? Array.from(new Set([selectedFilters.actor, `${selectedFilters.actor} Demo`]))
    : [];
  const where: Prisma.AuditLogWhereInput = {
    ...(actorFilterValues.length > 0 ? { actor: { fullName: { in: actorFilterValues } } } : {}),
    ...(actionTypes.length > 0 ? { actionType: { in: actionTypes } } : {}),
    ...(startedAt ? { createdAt: { gte: startedAt } } : {}),
    ...(query
      ? {
          OR: [
            { description: { contains: query } },
            { entityType: { contains: query } },
            { entityId: { contains: query } },
            { actor: { fullName: { contains: query } } },
          ],
        }
      : {}),
  };

  const [entries, optionEntries] = await Promise.all([
    getAuditEntries(where),
    prisma.auditLog.findMany({
      select: {
        actionType: true,
        actor: { select: { fullName: true } },
      },
    }),
  ]);
  const [recentEvents, courseEvents, accessEvents] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.count({
      where: {
        actionType: {
          in: [
            AuditActionType.COURSE_APPROVED,
            AuditActionType.COURSE_ARCHIVED,
            AuditActionType.COURSE_CREATED,
            AuditActionType.COURSE_PUBLISHED,
            AuditActionType.COURSE_RETURNED_FOR_REVISION,
            AuditActionType.COURSE_STATUS_CHANGED,
            AuditActionType.COURSE_SUBMITTED_FOR_REVIEW,
            AuditActionType.COURSE_UNPUBLISHED,
            AuditActionType.COURSE_UPDATED,
          ],
        },
      },
    }),
    prisma.auditLog.count({
      where: {
        actionType: {
          in: [AuditActionType.LOGIN, AuditActionType.LOGOUT],
        },
      },
    }),
  ]);

  return {
    entries,
    filterOptions: {
      actors: Array.from(new Set(optionEntries.map((entry) => entry.actor.fullName)))
        .sort()
        .map((value) => ({ id: cleanPresentationText(value), label: cleanPresentationText(value) })),
      areas: Array.from(new Set(optionEntries.map((entry) => getAuditArea(entry.actionType))))
        .sort()
        .map((value) => ({ id: value, label: value })),
      dateRanges: auditDateRanges,
    },
    filters: selectedFilters,
    metrics: {
      accessEvents,
      adminActions: Math.max(recentEvents - accessEvents, 0),
      courseEvents,
      recentEvents,
    },
    selectedEntry: entries[0] ?? null,
  };
}

async function getDbUser(session: AuthSession | null) {
  if (!session?.email) {
    return null;
  }

  return prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email: session.email,
    },
  });
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

export async function transitionCourseStatus({
  actionType,
  allowedFrom,
  comment,
  courseIdOrSlug,
  description,
  session,
  targetStatus,
}: {
  actionType: AuditActionType;
  allowedFrom: CourseStatus[];
  comment?: string;
  courseIdOrSlug: string;
  description: string;
  session: AuthSession | null;
  targetStatus: CourseStatus;
}) {
  const dbUser = await getDbUser(session);

  if (!dbUser) {
    return { code: "unauthorized", success: false };
  }

  const course = await queryWorkflowCourse(courseIdOrSlug, session);

  if (!course) {
    return { code: "not-found", success: false };
  }

  const version = getWorkflowVersion(course.versions, allowedFrom);

  if (!version || !allowedFrom.includes(version.status)) {
    return { code: "invalid-transition", success: false };
  }

  if (
    (targetStatus === CourseStatus.READY_FOR_REVIEW ||
      targetStatus === CourseStatus.PUBLISHED) &&
    (await mapCourseToSummary(course, allowedFrom)).readinessErrors > 0
  ) {
    return { code: "blocked", success: false };
  }

  const now = new Date();
  const updates = [
    prisma.course.update({
      data: {
        archivedAt: targetStatus === CourseStatus.ARCHIVED ? now : undefined,
        status: targetStatus,
        visibility:
          targetStatus === CourseStatus.PUBLISHED &&
          course.visibility === CourseVisibility.PRIVATE
            ? CourseVisibility.PUBLIC
            : undefined,
      },
      where: {
        id: course.id,
      },
    }),
    prisma.courseVersion.update({
      data: {
        archivedAt: targetStatus === CourseStatus.ARCHIVED ? now : undefined,
        publishedAt: targetStatus === CourseStatus.PUBLISHED ? now : version.publishedAt,
        publishedById: targetStatus === CourseStatus.PUBLISHED ? dbUser.id : undefined,
        status: targetStatus,
      },
      where: {
        id: version.id,
      },
    }),
    prisma.auditLog.create({
      data: {
        actionType,
        actorUserId: dbUser.id,
        description,
        entityId: course.id,
        entityType: "Course",
        metadataJson: toInputJson({
          comment: comment?.trim() || null,
          fromStatus: version.status,
          targetStatus,
          versionId: version.id,
        }),
      },
    }),
  ];

  await prisma.$transaction(updates);

  return {
    code: "success",
    courseId: course.id,
    slug: course.slug,
    success: true,
  };
}
