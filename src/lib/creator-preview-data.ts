import {
  ContentBlockType,
  CourseLevel,
  CourseStatus,
} from "../generated/prisma/enums";
import { hasAnyRole } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import type { LearnerTemplateSelection } from "./course-types";
import { resolveLearnerTemplateSelection } from "./learner-template";
import { prisma } from "./prisma";

export type CreatorPreviewBlock = {
  configJson: unknown;
  estimatedDurationMinutes: number | null;
  id: string;
  order: number;
  title: string;
  type: ContentBlockType;
  typeLabel: string;
};

export type CreatorPreviewLesson = {
  blocks: CreatorPreviewBlock[];
  description: string | null;
  estimatedDurationMinutes: number | null;
  id: string;
  order: number;
  title: string;
};

export type CreatorPreviewModule = {
  description: string | null;
  estimatedDurationMinutes: number | null;
  id: string;
  lessons: CreatorPreviewLesson[];
  order: number;
  title: string;
};

export type CreatorPreviewResource = {
  downloadLabel: string;
  fileType: string;
  fileUrl: string;
  id: string;
  title: string;
};

export type CreatorPreviewData = {
  capacityArea: string;
  certificateEligible: boolean;
  courseId: string;
  coverImageAlt: string;
  coverImageUrl: string | null;
  defaultPassThreshold: number;
  description: string;
  durationLabel: string;
  finalTestQuestionCount: number;
  finalTestRequired: boolean;
  language: string;
  level: string;
  modules: CreatorPreviewModule[];
  outcomes: string[];
  passThresholdLabel: string;
  resources: CreatorPreviewResource[];
  template: LearnerTemplateSelection;
  slug: string;
  status: string;
  title: string;
  totalBlocks: number;
  totalLessons: number;
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

const levelLabels: Record<CourseLevel, string> = {
  ADVANCED: "Advanced",
  FOUNDATIONAL: "Foundational",
  INTERMEDIATE: "Intermediate",
  INTRODUCTORY: "Introductory",
  MIXED: "Mixed",
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

function durationLabel(minutes: number | null) {
  return minutes && minutes > 0 ? `${minutes} minutes` : "Not set";
}

async function getSessionDbUser(session: AuthSession | null) {
  if (!session?.email) {
    return null;
  }

  return prisma.user.findUnique({
    select: { id: true },
    where: { email: session.email },
  });
}

export async function getCreatorPreviewData(
  courseIdOrSlug: string,
  session: AuthSession | null,
): Promise<CreatorPreviewData | null> {
  const dbUser = await getSessionDbUser(session);
  const isAdmin = hasAnyRole(session, ["SUPER_ADMIN", "PLATFORM_ADMIN"]);
  if (!dbUser && !isAdmin) {
    return null;
  }

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
            select: { name: true },
          },
        },
        take: 1,
      },
      analysisMetadataJson: true,
      certificateEligible: true,
      coverImageUrl: true,
      defaultPassThreshold: true,
      estimatedDurationMinutes: true,
      finalTestRequired: true,
      id: true,
      language: true,
      learningOutcomes: {
        orderBy: { order: "asc" },
        select: { statement: true },
      },
      level: true,
      shortDescription: true,
      slug: true,
      status: true,
      title: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        select: {
          modules: {
            orderBy: { order: "asc" },
            select: {
              description: true,
              estimatedDurationMinutes: true,
              id: true,
              lessons: {
                orderBy: { order: "asc" },
                select: {
                  contentBlocks: {
                    orderBy: { order: "asc" },
                    select: {
                      configJson: true,
                      estimatedDurationMinutes: true,
                      id: true,
                      order: true,
                      title: true,
                      type: true,
                    },
                  },
                  description: true,
                  estimatedDurationMinutes: true,
                  id: true,
                  order: true,
                  title: true,
                },
              },
              order: true,
              title: true,
            },
          },
          quizzes: {
            select: {
              questions: {
                select: { id: true },
              },
            },
            take: 1,
            where: { isFinalTest: true },
          },
          status: true,
        },
        take: 1,
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

  const version = course?.versions[0];
  if (!course || !version) {
    return null;
  }

  const modules = version.modules.map((module) => ({
    description: module.description,
    estimatedDurationMinutes: module.estimatedDurationMinutes,
    id: module.id,
    lessons: module.lessons.map((lesson) => ({
      blocks: lesson.contentBlocks.map((block) => ({
        configJson: block.configJson,
        estimatedDurationMinutes: block.estimatedDurationMinutes,
        id: block.id,
        order: block.order,
        title: block.title,
        type: block.type,
        typeLabel: blockTypeLabels[block.type] ?? "Learning block",
      })),
      description: lesson.description,
      estimatedDurationMinutes: lesson.estimatedDurationMinutes,
      id: lesson.id,
      order: lesson.order,
      title: lesson.title,
    })),
    order: module.order,
    title: module.title,
  }));
  const lessons = modules.flatMap((module) => module.lessons);
  const totalBlocks = lessons.reduce((count, lesson) => count + lesson.blocks.length, 0);

  const resources = await prisma.resource.findMany({
    orderBy: { title: "asc" },
    select: {
      downloadLabel: true,
      fileType: true,
      fileUrl: true,
      id: true,
      title: true,
    },
    where: {
      archivedAt: null,
      courseId: course.id,
    },
  });

  return {
    capacityArea: course.capacityAreas[0]?.capacityArea.name ?? "Course content",
    certificateEligible: course.certificateEligible,
    courseId: courseIdOrSlug,
    coverImageAlt: `Course cover for ${course.title}`,
    coverImageUrl: course.coverImageUrl,
    defaultPassThreshold: course.defaultPassThreshold,
    description: course.shortDescription,
    durationLabel: durationLabel(course.estimatedDurationMinutes),
    finalTestQuestionCount: version.quizzes[0]?.questions.length ?? 0,
    finalTestRequired: course.finalTestRequired,
    language: course.language,
    level: levelLabels[course.level],
    modules,
    outcomes: course.learningOutcomes.map((outcome) => outcome.statement),
    passThresholdLabel: `${course.defaultPassThreshold}%`,
    resources,
    template: resolveLearnerTemplateSelection(course.analysisMetadataJson),
    slug: course.slug,
    status: statusLabels[course.status],
    title: course.title,
    totalBlocks,
    totalLessons: lessons.length,
  };
}
