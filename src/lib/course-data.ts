import {
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  QuizQuestionType,
  EnrollmentStatus,
  LessonProgressStatus,
} from "../generated/prisma/enums";
import {
  CERTIFICATE_PASS_THRESHOLD_LABEL,
  DEMO_COURSE_MODULES,
  DEMO_COURSE_OUTCOMES,
  DEMO_COURSES,
  DEMO_FINAL_TEST_QUESTIONS,
  DEMO_PROPOSAL_COURSE,
  formatCertificateThresholdRule,
} from "./demo-data";
import {
  defaultLearnerTemplateSelection,
  resolveLearnerTemplateSelection,
} from "./learner-template";
import { isExternalHrbaCourseMetadata } from "./external-course-config";
import { prisma } from "./prisma";
import { getCurrentSession } from "./auth/server";
import { cleanPresentationText } from "./presentation-text";

let mockSession: { email: string } | null = null;
export function setMockSession(session: { email: string } | null) {
  mockSession = session;
}
import type {
  CourseTone,
  LearnerContentBlock,
  LearnerCourseDetail,
  LearnerCourseModule,
  LearnerCourseSummary,
  LearnerFinalTestQuestion,
  LearnerLessonStatus,
  PublicCourseDetail,
  PublicCourseModule,
  PublicCourseSummary,
} from "./course-types";

type DatabaseCourseRecord = Awaited<
  ReturnType<typeof queryPublicCourseRecords>
>[number];

export type PublicCourseFilters = {
  access?: string;
  capacityArea?: string;
  certificate?: string;
  level?: string;
  search?: string;
};

const levelLabels: Record<CourseLevel, string> = {
  ADVANCED: "Advanced",
  FOUNDATIONAL: "Foundational",
  INTERMEDIATE: "Intermediate",
  INTRODUCTORY: "Introductory",
  MIXED: "Mixed",
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

const blockTypeLabels: Record<string, string> = {
  ACCORDION: "Accordion",
  CASE_STUDY: "Case Study",
  EXTERNAL_LINK: "External Link",
  FLASHCARD: "Flashcards",
  IMAGE: "Image",
  KNOWLEDGE_CHECK: "Knowledge Check",
  KEY_MESSAGE: "Key Message",
  PRACTICAL_ACTIVITY_PROMPT: "Practical Activity",
  REFLECTION_PROMPT: "Reflection",
  RESOURCE: "Resource",
  TEXT: "Text",
  VIDEO: "Video",
};

function toDemoSummary(
  course: (typeof DEMO_COURSES)[number],
): PublicCourseSummary {
  return {
    ...course,
    href: `/courses/${course.slug}`,
  };
}

function getDemoSummaries() {
  return DEMO_COURSES.map(toDemoSummary);
}

function getDemoCourseBySlug(slug: string) {
  return DEMO_COURSES.find((course) => course.slug === slug) ?? DEMO_PROPOSAL_COURSE;
}

function getDemoDetail(slug: string): PublicCourseDetail {
  const course = getDemoCourseBySlug(slug);

  return {
    ...toDemoSummary(course),
    modules: DEMO_COURSE_MODULES.map((module) => ({
      lessons: [...module.lessons],
      title: module.title,
    })),
    outcomes: [...DEMO_COURSE_OUTCOMES],
    longDescription: course.description,
    shortDescription:
      "Learn the essential steps for turning a community problem into a clear, fundable project idea and basic proposal structure.",
  };
}

function getDemoFinalTestQuestions(slug: string): LearnerFinalTestQuestion[] {
  const course = getDemoCourseBySlug(slug);

  if (course.slug === DEMO_PROPOSAL_COURSE.slug) {
    return DEMO_FINAL_TEST_QUESTIONS.map((question) => ({
      options: [...question.options],
      text: question.text,
      type: question.type,
    }));
  }

  return [
    {
      options: [
        "Apply the learning to practical CSO work",
        "Skip the course activities",
        "Replace team discussion",
        "Remove the final review step",
      ],
      text: `What is the main purpose of ${course.shortTitle}?`,
      type: "Multiple choice",
    },
  ];
}

function getFallbackForSlug(slug: string) {
  return getDemoSummaries().find((course) => course.slug === slug) ?? getDemoSummaries()[0];
}

function formatDuration(minutes: number | null, fallback: string) {
  if (!minutes || minutes < 1) {
    return fallback;
  }

  return `${minutes} minutes`;
}

function getTone(capacityArea: string, fallback: CourseTone): CourseTone {
  if (capacityArea === "Financial Management") {
    return "green";
  }

  if (capacityArea === "Safeguarding") {
    return "gold";
  }

  if (capacityArea === "Organizational Development") {
    return "navy";
  }

  return fallback;
}

function getShortTitle(title: string) {
  return title
    .replace(" for Grassroots CSOs", "")
    .replace(" for Local CSOs", "")
    .replace(" in Practice", "");
}

const courseSelectFields = {
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
  defaultPassThreshold: true,
  estimatedDurationMinutes: true,
  finalTestRequired: true,
  coverImageUrl: true,
  id: true,
  language: true,
  learningOutcomes: {
    orderBy: { order: "asc" },
    select: {
      statement: true,
    },
  },
  level: true,
  longDescription: true,
  resources: {
    select: {
      id: true,
    },
    where: {
      archivedAt: null,
    },
  },
  shortDescription: true,
  slug: true,
  status: true,
  targetAudience: true,
  title: true,
  versions: {
    where: {
      status: CourseStatus.PUBLISHED,
    },
    orderBy: { versionNumber: "desc" },
    select: {
      id: true,
      modules: {
        orderBy: { order: "asc" },
        select: {
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
              title: true,
            },
          },
          title: true,
        },
      },
      quizzes: {
        select: {
          id: true,
          passThreshold: true,
          retakeAllowed: true,
          maxAttempts: true,
          questions: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              configJson: true,
              questionText: true,
              type: true,
            },
          },
        },
        take: 1,
        where: {
          isFinalTest: true,
        },
      },
    },
    take: 1,
  },
  visibility: true,
} as const;

async function queryPublicCourseRecords() {
  return prisma.course.findMany({
    orderBy: { title: "asc" },
    select: courseSelectFields,
    where: {
      archivedAt: null,
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.PUBLIC,
    },
  });
}

async function queryLearnerCourseRecords() {
  return prisma.course.findMany({
    orderBy: { title: "asc" },
    select: courseSelectFields,
    where: {
      archivedAt: null,
      status: CourseStatus.PUBLISHED,
      visibility: {
        in: [CourseVisibility.PUBLIC, CourseVisibility.ASSIGNED_ONLY],
      },
    },
  });
}


function getLessonCount(record: DatabaseCourseRecord, fallback: PublicCourseSummary) {
  const lessonCount = record.versions[0]?.modules.reduce(
    (count, module) => count + module.lessons.length,
    0,
  );

  return lessonCount && lessonCount > 0 ? lessonCount : fallback.lessonsCount;
}

function getModules(record: DatabaseCourseRecord): PublicCourseModule[] {
  return record.versions[0]?.modules.map((module) => ({
    lessons: module.lessons.map((lesson) => lesson.title),
    title: module.title,
  })) ?? [];
}

function toLessonId(title: string, index: number) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || `lesson-${index + 1}`;
}

function getLearnerLessonStatus(
  course: PublicCourseSummary,
  lessonGlobalIndex: number,
): LearnerLessonStatus {
  if (course.progress <= 0) {
    return lessonGlobalIndex === 0 ? "Current" : "Next";
  }

  if (lessonGlobalIndex === 0) {
    return "Completed";
  }

  if (lessonGlobalIndex === 1) {
    return "Current";
  }

  return "Next";
}

function toLearnerModules(
  course: PublicCourseSummary,
  modules: PublicCourseModule[],
): LearnerCourseModule[] {
  let lessonGlobalIndex = 0;

  return modules.map((module) => ({
    lessons: module.lessons.map((lessonTitle) => {
      const lesson = {
        blocks: [],
        description: null,
        estimatedDurationMinutes: null,
        id: toLessonId(lessonTitle, lessonGlobalIndex),
        status: getLearnerLessonStatus(course, lessonGlobalIndex),
        title: lessonTitle,
      };

      lessonGlobalIndex += 1;

      return lesson;
    }),
    title: module.title,
  }));
}

function mapDatabaseContentBlock(
  block: DatabaseCourseRecord["versions"][number]["modules"][number]["lessons"][number]["contentBlocks"][number],
): LearnerContentBlock {
  return {
    configJson: block.configJson,
    estimatedDurationMinutes: block.estimatedDurationMinutes,
    id: block.id,
    order: block.order,
    title: block.title,
    type: block.type,
    typeLabel: blockTypeLabels[block.type] ?? "Learning block",
  };
}


function getLearnerSummary(
  course: PublicCourseSummary,
  hasCertificate: boolean = false,
): LearnerCourseSummary {
  const isStarted = course.progress > 0;
  const isCompleted = course.status === "Completed";
  const learnerHref = course.isExternalCourse
    ? `/learn/courses/${course.slug}/external`
    : `/learn/courses/${course.slug}`;

  return {
    ...course,
    certificateStatus: hasCertificate ? "Issued" : "Certificate path",
    finalTestHref: `/learn/courses/${course.slug}/final-test`,
    learnerHref,
    primaryAction: isCompleted ? "Review Course" : (isStarted ? "Continue Learning" : "Start Course"),
    secondaryAction: isCompleted ? "View Certificate" : (isStarted ? "Final Test" : "View Public Course"),
    statusLabel: isCompleted ? "Completed" : (isStarted ? "In progress" : "Not started"),
  };
}

function getQuestionOptions(configJson: unknown) {
  if (
    configJson &&
    typeof configJson === "object" &&
    "options" in configJson &&
    Array.isArray(configJson.options)
  ) {
    return configJson.options
      .map((option) => {
        if (typeof option === "string") {
          return option;
        }

        if (option && typeof option === "object") {
          const record = option as Record<string, unknown>;
          const value = record.label ?? record.text;

          return typeof value === "string" ? value : "";
        }

        return "";
      })
      .filter(Boolean);
  }

  return [];
}

function getDatabaseFinalTestQuestions(
  record: DatabaseCourseRecord,
): LearnerFinalTestQuestion[] {
  const questions = record.versions[0]?.quizzes[0]?.questions ?? [];

  return questions.map((question) => ({
    id: question.id,
    options: getQuestionOptions(question.configJson),
    text: question.questionText,
    type:
      question.type === QuizQuestionType.TRUE_FALSE
        ? "True/false"
        : "Multiple choice",
  }));
}

function getLearnerDetail(course: PublicCourseDetail): LearnerCourseDetail {
  return {
    ...course,
    certificateHref: `/learn/certificates/${course.slug}`,
    certificateStatus: "Certificate path",
    finalTestHref: `/learn/courses/${course.slug}/final-test`,
    finalTestQuestions: getDemoFinalTestQuestions(course.slug),
    modules: toLearnerModules(course, course.modules),
    passThresholdLabel: CERTIFICATE_PASS_THRESHOLD_LABEL,
    passThresholdRule: formatCertificateThresholdRule(),
    statusLabel: course.progress > 0 ? "In progress" : "Not started",
    template: defaultLearnerTemplateSelection,
  };
}

function mapDatabaseCourseToSummary(
  record: DatabaseCourseRecord,
): PublicCourseSummary {
  const fallback = getFallbackForSlug(record.slug);
  const capacityArea = record.capacityAreas[0]?.capacityArea.name ?? fallback.capacityArea;
  const lessonCount = getLessonCount(record, fallback);
  const resourceCount = record.resources.length || Number(fallback.resources);
  const finalTest = record.finalTestRequired ? "Configured" : fallback.finalTest;

  return {
    access: record.visibility === CourseVisibility.PUBLIC ? "Public" : fallback.access,
    audience: record.targetAudience ?? fallback.audience,
    capacityArea,
    certificate: record.certificateEligible
      ? "Certificate included"
      : fallback.certificate,
    certificateEligible: record.certificateEligible ? "Yes" : "No",
    creator: cleanPresentationText(record.assignedCreator.fullName),
    currentLesson: fallback.currentLesson,
    currentModule: fallback.currentModule,
    description: record.shortDescription,
    duration: formatDuration(record.estimatedDurationMinutes, fallback.duration),
    finalTest,
    href: `/courses/${record.slug}`,
    id: record.id,
    imageAlt: `Course cover for ${record.title}`,
    imageUrl: record.coverImageUrl,
    isExternalCourse: isExternalHrbaCourseMetadata(record.analysisMetadataJson),
    language: record.language,
    lastUpdated: fallback.lastUpdated,
    lessons: `${lessonCount} lessons`,
    lessonsCount: lessonCount,
    level: levelLabels[record.level],
    progress: fallback.progress,
    resources: String(resourceCount),
    reviewStatus: statusLabels[record.status],
    shortTitle: getShortTitle(record.title),
    slug: record.slug,
    status: statusLabels[record.status],
    title: record.title,
    tone: getTone(capacityArea, fallback.tone),
  };
}

function mapDatabaseCourseToDetail(
  record: DatabaseCourseRecord,
): PublicCourseDetail {
  const summary = mapDatabaseCourseToSummary(record);
  const modules = getModules(record);
  const outcomes = record.learningOutcomes.map((outcome) => outcome.statement);

  return {
    ...summary,
    longDescription: record.longDescription || record.shortDescription,
    modules: modules.length > 0 ? modules : getDemoDetail(record.slug).modules,
    outcomes: outcomes.length > 0 ? outcomes : getDemoDetail(record.slug).outcomes,
    shortDescription: record.shortDescription,
  };
}


function normalizeFilterValue(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

function filterPublicCourseSummaries(
  courses: PublicCourseSummary[],
  filters: PublicCourseFilters = {},
) {
  const search = normalizeFilterValue(filters.search).toLowerCase();
  const capacityArea = normalizeFilterValue(filters.capacityArea);
  const access = normalizeFilterValue(filters.access);
  const certificate = normalizeFilterValue(filters.certificate);
  const level = normalizeFilterValue(filters.level);

  return courses.filter((course) => {
    const matchesSearch =
      !search ||
      [
        course.title,
        course.shortTitle,
        course.description,
        course.capacityArea,
        course.level,
        course.creator,
      ].some((value) => value.toLowerCase().includes(search));
    const matchesCapacity = !capacityArea || course.capacityArea === capacityArea;
    const matchesAccess = !access || course.access === access;
    const matchesCertificate =
      !certificate ||
      (certificate === "Certificate included" && course.certificateEligible === "Yes");
    const matchesLevel = !level || course.level === level;

    return matchesSearch && matchesCapacity && matchesAccess && matchesCertificate && matchesLevel;
  });
}

export async function getPublicCourseSummaries(
  filters: PublicCourseFilters = {},
): Promise<PublicCourseSummary[]> {
  try {
    const records = await queryPublicCourseRecords();

    if (records.length > 0) {
      return filterPublicCourseSummaries(records.map(mapDatabaseCourseToSummary), filters);
    }
  } catch (error) {
    console.error("Error in getPublicCourseSummaries query:", error);
  }

  return filterPublicCourseSummaries(
    getDemoSummaries().filter(
      (c) => c.status === "Published" && c.access === "Public",
    ),
    filters,
  );
}

export async function getPublicCourseBySlug(
  slug: string,
): Promise<PublicCourseDetail | null> {
  try {
    const records = await queryPublicCourseRecords();
    const record = records.find((course) => course.slug === slug);

    if (record) {
      return mapDatabaseCourseToDetail(record);
    }

    const dbCourseExists = await prisma.course.findFirst({
      where: { slug, archivedAt: null },
      select: { id: true },
    });

    if (dbCourseExists) {
      return null;
    }
  } catch (error) {
    console.error("Error in getPublicCourseBySlug query:", error);
  }

  const demoCourse = DEMO_COURSES.find(
    (c) => c.slug === slug && c.status === "Published" && c.access === "Public"
  );
  if (demoCourse) {
    return getDemoDetail(slug);
  }

  return null;
}

function getLessonPlayerStatus(
  lessonId: string,
  progressMap: Map<string, { status: string }>,
  orderedLessonIds: string[],
): LearnerLessonStatus {
  const lp = progressMap.get(lessonId);
  if (lp?.status === "COMPLETED") {
    return "Completed";
  }

  const firstIncompleteId = orderedLessonIds.find(
    (id) => progressMap.get(id)?.status !== "COMPLETED",
  );

  if (lessonId === firstIncompleteId) {
    return "Current";
  }

  const index = orderedLessonIds.indexOf(lessonId);
  const firstIncompleteIndex = firstIncompleteId
    ? orderedLessonIds.indexOf(firstIncompleteId)
    : -1;

  if (firstIncompleteIndex !== -1 && index > firstIncompleteIndex) {
    return "Next";
  }

  return "Next";
}

export async function getLearnerCourseSummaries(): Promise<
  LearnerCourseSummary[]
> {
  try {
    const session = mockSession || await getCurrentSession();
    if (!session) {
      return getDemoSummaries()
        .filter((c) => c.status === "Published")
        .map((c) => getLearnerSummary(c));
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.email },
    });
    if (!dbUser) {
      return getDemoSummaries()
        .filter((c) => c.status === "Published")
        .map((c) => getLearnerSummary(c));
    }

    const records = await queryLearnerCourseRecords();

    if (records.length > 0) {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: dbUser.id },
        include: {
          lessonProgress: true,
        },
      });

      const certificates = await prisma.certificate.findMany({
        where: { userId: dbUser.id },
      });

      return records.map((record) => {
        const summary = mapDatabaseCourseToSummary(record);
        const latestVersionId = record.versions[0]?.id;
        const enrollment = enrollments.find(
          (e) => e.courseVersionId === latestVersionId,
        );
        const hasCert = certificates.some(
          (c) => c.courseVersionId === latestVersionId,
        );

        if (enrollment) {
          summary.progress = enrollment.progressPercent;
          summary.status = enrollment.status === EnrollmentStatus.COMPLETED ? "Completed" : "In progress";

          const orderedLessons = record.versions[0]?.modules.flatMap((m) => m.lessons) ?? [];
          const progressMap = new Map(enrollment.lessonProgress.map((lp) => [lp.lessonId, lp]));

          let currentLessonTitle = summary.currentLesson;
          let currentModuleTitle = summary.currentModule;

          let hasResumeLesson = false;

          for (const lesson of orderedLessons) {
            const lp = progressMap.get(lesson.id);
            if (!lp || lp.status !== LessonProgressStatus.COMPLETED) {
              hasResumeLesson = true;
              currentLessonTitle = lesson.title;
              const parentModule = record.versions[0]?.modules.find((m) =>
                m.lessons.some((l) => l.id === lesson.id),
              );
              if (parentModule) {
                currentModuleTitle = parentModule.title;
              }
              break;
            }
          }

          if (!hasResumeLesson && orderedLessons.length > 0) {
            const finalLesson = orderedLessons[orderedLessons.length - 1];
            currentLessonTitle = finalLesson.title;
            const parentModule = record.versions[0]?.modules.find((m) =>
              m.lessons.some((l) => l.id === finalLesson.id),
            );
            if (parentModule) {
              currentModuleTitle = parentModule.title;
            }
          }

          summary.currentLesson = currentLessonTitle;
          summary.currentModule = currentModuleTitle;
        }

        return getLearnerSummary(summary, hasCert);
      });
    }
  } catch (error) {
    console.error("Error in getLearnerCourseSummaries query:", error);
  }

  return getDemoSummaries()
    .filter((c) => c.status === "Published")
    .map((c) => getLearnerSummary(c));
}

export async function getLearnerCourseBySlug(
  slug: string,
): Promise<LearnerCourseDetail | null> {
  try {
    const session = mockSession || await getCurrentSession();
    if (!session) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.email },
    });
    if (!dbUser) {
      return null;
    }

    const records = await queryLearnerCourseRecords();
    const record = records.find((course) => course.slug === slug);

    if (record) {
      if (record.visibility === CourseVisibility.ASSIGNED_ONLY) {
        const orConditions = [
          { targetUserId: dbUser.id },
          ...(dbUser.primaryCohortId ? [{ targetCohortId: dbUser.primaryCohortId }] : []),
          ...(dbUser.organizationId ? [{ targetOrganizationId: dbUser.organizationId }] : []),
        ];

        const assignment = await prisma.courseAssignment.findFirst({
          where: {
            courseId: record.id,
            isActive: true,
            OR: orConditions,
          },
        });

        if (!assignment) {
          return null;
        }
      }

      const latestVersion = record.versions[0];
      if (!latestVersion) {
        return null;
      }

      let enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseVersionId: {
            userId: dbUser.id,
            courseVersionId: latestVersion.id,
          },
        },
        include: {
          lessonProgress: true,
        },
      });

      if (!enrollment) {
        enrollment = await prisma.$transaction(async (tx) => {
          const existing = await tx.enrollment.findUnique({
            where: {
              userId_courseVersionId: {
                userId: dbUser.id,
                courseVersionId: latestVersion.id,
              },
            },
            include: {
              lessonProgress: true,
            },
          });
          if (existing) {
            return existing;
          }

          const created = await tx.enrollment.create({
            data: {
              userId: dbUser.id,
              courseId: record.id,
              courseVersionId: latestVersion.id,
              status: EnrollmentStatus.IN_PROGRESS,
              startedAt: new Date(),
              progressPercent: 0,
            },
          });

          const lessons = latestVersion.modules.flatMap((m) => m.lessons);
          for (const lesson of lessons) {
            await tx.lessonProgress.create({
              data: {
                enrollmentId: created.id,
                lessonId: lesson.id,
                status: LessonProgressStatus.NOT_STARTED,
              },
            });
          }

          return tx.enrollment.findUniqueOrThrow({
            where: { id: created.id },
            include: {
              lessonProgress: true,
            },
          });
        });
      }

      const courseDetail = mapDatabaseCourseToDetail(record);
      const learnerDetail = getLearnerDetail(courseDetail);

      learnerDetail.progress = enrollment.progressPercent;
      learnerDetail.statusLabel = enrollment.status === EnrollmentStatus.COMPLETED ? "Completed" : "In progress";

      const orderedLessonIds = latestVersion.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const progressMap = new Map(enrollment.lessonProgress.map((lp) => [lp.lessonId, lp]));

      const mappedModules = latestVersion.modules.map((module) => ({
        id: module.id,
        title: module.title,
        lessons: module.lessons.map((lesson) => ({
          blocks: lesson.contentBlocks.map(mapDatabaseContentBlock),
          description: lesson.description,
          estimatedDurationMinutes: lesson.estimatedDurationMinutes,
          id: lesson.id,
          status: getLessonPlayerStatus(lesson.id, progressMap, orderedLessonIds),
          title: lesson.title,
        })),
      }));

      let currentLessonTitle = learnerDetail.currentLesson;
      let currentModuleTitle = learnerDetail.currentModule;

      const lessonDisplayItems = mappedModules
        .flatMap((m) => m.lessons.map((l) => ({ lesson: l, moduleTitle: m.title })))
      const currentLessonObj = lessonDisplayItems.find((item) => item.lesson.status === "Current");

      if (currentLessonObj) {
        currentLessonTitle = currentLessonObj.lesson.title;
        currentModuleTitle = currentLessonObj.moduleTitle;
      } else {
        const fallbackLessonObj = lessonDisplayItems.find((item) => item.lesson.status !== "Completed")
          ?? lessonDisplayItems[lessonDisplayItems.length - 1];

        if (fallbackLessonObj) {
          currentLessonTitle = fallbackLessonObj.lesson.title;
          currentModuleTitle = fallbackLessonObj.moduleTitle;
        }
      }

      learnerDetail.currentLesson = currentLessonTitle;
      learnerDetail.currentModule = currentModuleTitle;

      const quiz = record.versions[0]?.quizzes[0];
      const quizId = quiz?.id;
      const courseVersionId = record.versions[0]?.id;
      const retakeAllowed = quiz?.retakeAllowed ?? true;
      const maxAttempts = quiz?.maxAttempts ?? null;
      const questions = getDatabaseFinalTestQuestions(record);

      const certificate = await prisma.certificate.findUnique({
        where: {
          userId_courseVersionId: {
            userId: dbUser.id,
            courseVersionId: latestVersion.id,
          },
        },
      });

      const certificateStatus = certificate ? "Issued" : "Certificate path";

      return {
        ...learnerDetail,
        quizId,
        courseVersionId,
        retakeAllowed,
        maxAttempts,
        certificateStatus,
        certificateHref: certificate ? `/learn/certificates/${encodeURIComponent(certificate.certificateCode)}` : learnerDetail.certificateHref,
        certificateCode: certificate ? cleanPresentationText(certificate.certificateCode) : undefined,
        certificateIssuedAt: certificate?.issuedAt?.toISOString(),
        certificateParticipantName: cleanPresentationText(certificate?.participantNameSnapshot || dbUser.fullName),
        certificateCourseTitle: certificate?.courseTitleSnapshot || record.title,
        certificateIssuerName: certificate?.issuerNameSnapshot || "DEC / WHH CSF+ CSO Learning Hub",
        certificateCompletionDate: certificate?.completionDate?.toISOString(),
        finalTestQuestions:
          questions.length > 0 ? questions : getDemoFinalTestQuestions(record.slug),
        modules: mappedModules,
        template: resolveLearnerTemplateSelection(record.analysisMetadataJson),
      };
    }

    const dbCourseExists = await prisma.course.findFirst({
      where: { slug, archivedAt: null },
      select: { id: true },
    });

    if (dbCourseExists) {
      return null;
    }
  } catch (error) {
    console.error("Error in getLearnerCourseBySlug query/enrollment:", error);
  }

  if (slug === DEMO_PROPOSAL_COURSE.slug) {
    return getLearnerDetail(getDemoDetail(slug));
  }

  return null;
}
