import {
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  QuizQuestionType,
  EnrollmentStatus,
  LessonProgressStatus,
  CertificateStatus,
  FeedbackType,
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
import {
  HRBA_EXTERNAL_COURSE_SLUG,
  PM_EXTERNAL_COURSE_SLUG,
  isTrackedExternalCourseMetadata,
} from "./external-course-config";
import { prisma } from "./prisma";
import { hasLearnerCourseEntitlement } from "./course-entitlement";
import { getCurrentSession } from "./auth/server";
import { isLocalQaFixtureAllowed } from "./local-qa-guard";
import { cleanPresentationText } from "./presentation-text";
import {
  getCatalogueCourseDefinition,
  getPublicCatalogueSummaries,
  HRBA_COURSE_OVERVIEW,
  HRBA_COURSE_PROMISE,
  HRBA_LEARNING_OUTCOMES,
  PUBLIC_CATALOGUE_CAPACITY_AREAS,
  toPublicCatalogueDetail,
} from "./public-course-catalogue";
import {
  getManagedExternalCourseMetadata,
  type ManagedExternalCourseMetadata,
} from "./external-course-manager";

let mockSession: { email: string; userId: string } | null = null;
export function setMockSession(session: { email: string; userId: string } | null) {
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
  PublicCatalogueCourseDetail,
  PublicCatalogueCourseSummary,
} from "./course-types";

type DatabaseCourseRecord = Awaited<
  ReturnType<typeof queryCatalogueCourseRecords>
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

const HRBA_PUBLIC_SLUGS = new Set([
  "human-rights-based-approach-practice",
  HRBA_EXTERNAL_COURSE_SLUG,
]);
const TRACKED_PUBLIC_SLUGS = new Set([
  ...HRBA_PUBLIC_SLUGS,
  PM_EXTERNAL_COURSE_SLUG,
]);

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

export function getDemoDetail(slug: string): PublicCourseDetail {
  const course = getDemoCourseBySlug(slug);

  if (HRBA_PUBLIC_SLUGS.has(course.slug)) {
    return {
      ...toDemoSummary(course),
      modules: [
        {
          lessons: [
            "Rights-holders, duty-bearers, and supporting actors",
            "Participation, inclusion, and non-discrimination",
          ],
          title: "HRBA foundations",
        },
        {
          lessons: [
            "Power, barriers, and accountability in practice",
            "Safe evidence for project-cycle decisions",
          ],
          title: "Applying HRBA in CSO work",
        },
        {
          lessons: ["Final assessment", "Certificate and continued learning"],
          title: "Final assessment and certificate",
        },
      ],
      outcomes: [...HRBA_LEARNING_OUTCOMES],
      longDescription: HRBA_COURSE_OVERVIEW,
      shortDescription: HRBA_COURSE_PROMISE,
    };
  }

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

function getFallbackReason(error: unknown) {
  if (error && typeof error === "object") {
    const record = error as { code?: unknown; name?: unknown };
    const code = typeof record.code === "string" ? record.code : null;
    const name = typeof record.name === "string" ? record.name : "Database error";

    return code ? `${name} (${code})` : name;
  }

  return "Database error";
}

function logCourseDataFallback(source: string, error: unknown) {
  console.warn(`${source}: using fallback course data. ${getFallbackReason(error)}.`);
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
          id: true,
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


function certificateKey(certificateCode: string) {
  return encodeURIComponent(certificateCode);
}

function getLearnerSummary(
  course: PublicCourseSummary,
  certificate?: {
    certificateCode: string;
    issuedAt: Date;
  } | null,
  hasFeedback = false,
): LearnerCourseSummary {
  const hasCertificate = Boolean(certificate);
  const isStarted = course.progress > 0;
  const isCompleted = course.status === "Completed" || course.progress >= 100;
  const finalAssessmentAvailable =
    !hasCertificate &&
    course.finalTest === "Configured" &&
    (course.progress >= 90 || isCompleted);
  const hasFinalAssessment = course.finalTest === "Configured";
  const learnerHref = course.isExternalCourse
    ? `/learn/courses/${course.slug}/external`
    : `/learn/courses/${course.slug}`;
  const certificateHref = certificate
    ? `/learn/certificates/${certificateKey(certificate.certificateCode)}`
    : `/learn/certificates/${course.slug}`;
  const certificateDownloadHref = certificate
    ? `/learn/certificates/${certificateKey(certificate.certificateCode)}/download`
    : undefined;
  const finalTestHref = `/learn/courses/${course.slug}/final-test`;
  const feedbackHref = `/learn/courses/${course.slug}/feedback`;
  const primaryAction = hasCertificate
    ? "View certificate"
    : finalAssessmentAvailable
      ? "Continue final assessment"
      : isStarted
        ? "Continue learning"
        : "Start course";
  const primaryActionHref = hasCertificate
    ? certificateHref
    : finalAssessmentAvailable
      ? (course.isExternalCourse ? learnerHref : finalTestHref)
      : learnerHref;
  const secondaryAction = hasCertificate
    ? "Download certificate"
    : finalAssessmentAvailable
      ? "Review course progress"
      : isStarted
        ? hasFinalAssessment ? "Final assessment" : "Review course"
        : hasFinalAssessment ? "View public course" : "Course details";
  const secondaryActionHref = hasCertificate
    ? certificateDownloadHref
    : finalAssessmentAvailable
      ? learnerHref
      : isStarted
        ? hasFinalAssessment
          ? (course.isExternalCourse ? learnerHref : finalTestHref)
          : learnerHref
        : hasFinalAssessment ? course.href : learnerHref;

  return {
    ...course,
    certificateCode: certificate?.certificateCode,
    certificateDownloadHref,
    certificateHref,
    certificateIssuedAt: certificate?.issuedAt.toISOString(),
    certificateStatus: hasCertificate
      ? "Certificate issued"
      : finalAssessmentAvailable
        ? "Final assessment"
        : course.certificateEligible === "No" ? "No certificate" : "Certificate path",
    feedbackHref,
    feedbackStatus: hasFeedback ? "Feedback submitted" : "Feedback not submitted",
    finalTestHref,
    learnerHref,
    primaryAction,
    primaryActionHref,
    secondaryAction,
    secondaryActionHref: secondaryActionHref ?? certificateHref,
    statusLabel: hasCertificate
      ? "Certificate issued"
      : isCompleted
        ? "Completed"
        : finalAssessmentAvailable
          ? "Final assessment available"
          : isStarted
            ? "In progress"
            : "Not started",
    verifyCertificateHref: certificate
      ? `/verify-certificate?code=${certificateKey(certificate.certificateCode)}`
      : undefined,
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

export function getLearnerDetail(course: PublicCourseDetail): LearnerCourseDetail {
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
  const firstModule = record.versions[0]?.modules[0];
  const firstLesson = firstModule?.lessons[0];
  const capacityArea = record.capacityAreas[0]?.capacityArea.name ?? "General CSO learning";
  const lessonCount = getLessonCount(record, fallback);
  const resourceCount = record.resources.length;
  const finalTest = record.finalTestRequired ? "Configured" : "Not required";

  return {
    access: record.visibility === CourseVisibility.PUBLIC ? "Available now" : fallback.access,
    audience: record.targetAudience ?? fallback.audience,
    capacityArea,
    certificate: record.certificateEligible
      ? "Certificate eligible"
      : "No certificate",
    certificateEligible: record.certificateEligible ? "Yes" : "No",
    creator: cleanPresentationText(record.assignedCreator.fullName),
    currentLesson: firstLesson?.title ?? "Course introduction",
    currentModule: firstModule?.title ?? "Course overview",
    description: HRBA_PUBLIC_SLUGS.has(record.slug)
      ? HRBA_COURSE_PROMISE
      : record.shortDescription,
    duration: formatDuration(record.estimatedDurationMinutes, fallback.duration),
    finalTest,
    href: `/courses/${record.slug}`,
    id: record.id,
    imageAlt: `Course cover for ${record.title}`,
    imageUrl: record.coverImageUrl,
    isExternalCourse: isTrackedExternalCourseMetadata(record.analysisMetadataJson),
    language: record.language,
    lastUpdated: fallback.lastUpdated,
    lessons: `${lessonCount} lessons`,
    lessonsCount: lessonCount,
    level: levelLabels[record.level],
    // Database-backed learner progress must come from the learner's enrollment,
    // never from partial demo catalogue data.
    progress: 0,
    resources: String(resourceCount),
    reviewStatus: statusLabels[record.status],
    shortTitle: HRBA_PUBLIC_SLUGS.has(record.slug)
      ? "Human Rights-Based Approach"
      : getShortTitle(record.title),
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
    longDescription: HRBA_PUBLIC_SLUGS.has(record.slug)
      ? HRBA_COURSE_OVERVIEW
      : record.longDescription || record.shortDescription,
    modules: modules.length > 0 ? modules : getDemoDetail(record.slug).modules,
    outcomes: HRBA_PUBLIC_SLUGS.has(record.slug)
      ? HRBA_LEARNING_OUTCOMES
      : outcomes.length > 0 ? outcomes : getDemoDetail(record.slug).outcomes,
    shortDescription: HRBA_PUBLIC_SLUGS.has(record.slug)
      ? HRBA_COURSE_PROMISE
      : record.shortDescription,
  };
}

function getManagedCapacityAreas(metadata: ManagedExternalCourseMetadata) {
  const byId = new Map(PUBLIC_CATALOGUE_CAPACITY_AREAS.map((area) => [area.id, area]));
  const primaryCapacityArea = byId.get(metadata.primaryCapacityAreaId);
  if (!primaryCapacityArea) {
    return null;
  }

  const secondaryCapacityAreas = metadata.secondaryCapacityAreaIds
    .map((id) => byId.get(id))
    .filter((area): area is NonNullable<typeof area> => Boolean(area));

  return {
    capacityAreas: [primaryCapacityArea, ...secondaryCapacityAreas],
    primaryCapacityArea,
    secondaryCapacityAreas,
  };
}

function managedDeliveryFormat(metadata: ManagedExternalCourseMetadata) {
  if (metadata.integrationMode === "external_link") {
    return "External course link";
  }

  if (metadata.integrationMode === "embedded") {
    return "Embedded external course";
  }

  return "Hub-tracked external course";
}

function mapManagedExternalCourseToSummary(
  record: DatabaseCourseRecord,
  metadata: ManagedExternalCourseMetadata,
): PublicCatalogueCourseSummary | null {
  if (
    record.status !== CourseStatus.PUBLISHED ||
    record.visibility !== CourseVisibility.PUBLIC ||
    (metadata.availability !== "available" && metadata.availability !== "coming_soon")
  ) {
    return null;
  }

  const areas = getManagedCapacityAreas(metadata);
  if (!areas) {
    return null;
  }

  const availability = metadata.availability;
  const tones: CourseTone[] = ["blue", "green", "gold", "navy"];

  return {
    accessState: availability === "available" ? "available_open" : "coming_soon",
    availability,
    ...areas,
    certificateLabel: record.certificateEligible
      ? "Certificate eligible"
      : "No automatic Hub certificate",
    deliveryFormat: managedDeliveryFormat(metadata),
    displayOrder: metadata.displayOrder,
    duration: formatDuration(record.estimatedDurationMinutes, "Duration to be confirmed"),
    featured: metadata.featured,
    href: `/courses/${record.slug}`,
    imageAlt: `Course cover for ${record.title}`,
    imageUrl: record.coverImageUrl,
    integrationStatus: availability === "available" ? "integrated" : "integration_pending",
    language: record.language,
    launchMode: metadata.integrationMode,
    shortDescription: record.shortDescription,
    slug: record.slug,
    title: record.title,
    tone: tones[(metadata.displayOrder - 1) % tones.length] ?? "blue",
  };
}

function mapManagedExternalCourseToDetail(
  record: DatabaseCourseRecord,
  metadata: ManagedExternalCourseMetadata,
): PublicCatalogueCourseDetail | null {
  const summary = mapManagedExternalCourseToSummary(record, metadata);
  if (!summary) {
    return null;
  }

  const outcomes = record.learningOutcomes.map((outcome) => outcome.statement);
  const trackingAvailable =
    metadata.integrationMode === "hub_tracked" && metadata.progressTrackingSupported;

  return {
    ...summary,
    assessmentStatus: metadata.assessmentSupported
      ? "Assessment events supported by the configured integration"
      : "No automatic Hub assessment",
    certificateStatus: record.certificateEligible
      ? "Certificate eligibility requires trusted completion and assessment"
      : "No automatic Hub certificate",
    completionRule: metadata.completionRule,
    externalUrl: metadata.externalUrl,
    fullDescription: record.longDescription ?? record.shortDescription,
    intendedLearners: record.targetAudience ?? "Local and grassroots CSO practitioners",
    learningApproach: [
      metadata.integrationMode === "external_link"
        ? "Learning takes place on the approved external course site."
        : "Learning opens inside a restricted Hub frame when the provider permits embedding.",
      trackingAvailable
        ? "Trusted progress events are validated by the Hub integration."
        : "The Hub does not claim reliable progress or completion for this integration.",
    ],
    learningOutcomes: outcomes,
    longDescription: record.longDescription ?? record.shortDescription,
    modules: [],
    openBehavior: metadata.openBehavior,
    outcomes,
    practicalOutputs: [],
    progressTrackingCapability: trackingAvailable
      ? "Hub-tracked progress supported"
      : "Progress tracking not available",
    proposedStructureSummary:
      "The detailed course structure is delivered and maintained by the approved external provider.",
    resourcesAndSupport:
      "Use the Hub Support page for access help. Course-content support remains with the external provider.",
  };
}

function mergeManagedExternalCatalogueRecords(
  records: DatabaseCourseRecord[],
  existingTrackedCourses: ReadonlyMap<string, PublicCourseSummary>,
) {
  const managedRecords = records
    .map((record) => ({
      metadata: getManagedExternalCourseMetadata(record.analysisMetadataJson),
      record,
    }))
    .filter(
      (item): item is { metadata: ManagedExternalCourseMetadata; record: DatabaseCourseRecord } =>
        Boolean(item.metadata),
    );
  const managedSlugs = new Set(managedRecords.map((item) => item.record.slug));
  const catalogue = getPublicCatalogueSummaries(existingTrackedCourses).filter(
    (course) => !managedSlugs.has(course.slug),
  );

  for (const item of managedRecords) {
    const course = mapManagedExternalCourseToSummary(item.record, item.metadata);
    if (course) {
      catalogue.push(course);
    }
  }

  return catalogue.sort(
    (left, right) =>
      left.displayOrder - right.displayOrder || left.title.localeCompare(right.title),
  );
}


function normalizeFilterValue(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

function filterPublicCatalogueSummaries(
  courses: PublicCatalogueCourseSummary[],
  filters: PublicCourseFilters = {},
) {
  const search = normalizeFilterValue(filters.search).toLowerCase();
  const capacityArea = normalizeFilterValue(filters.capacityArea);
  const access = normalizeFilterValue(filters.access);
  const certificate = normalizeFilterValue(filters.certificate);

  return courses.filter((course) => {
    const definition = getCatalogueCourseDefinition(course.slug);
    const matchesSearch =
      !search ||
      [
        course.title,
        course.shortDescription,
        ...course.capacityAreas.flatMap((area) => [area.id, area.name]),
        ...(definition?.legacyAliases ?? []),
      ].some((value) => value.toLowerCase().includes(search));
    const matchesCapacity =
      !capacityArea ||
      course.capacityAreas.some(
        (area) => area.id === capacityArea || area.name === capacityArea,
      );
    const accessLabel =
      course.availability === "available" ? "Available now" : "Coming soon";
    const matchesAccess = !access || access === accessLabel;
    const matchesCertificate =
      !certificate ||
      (certificate === "Certificate eligible" &&
        course.availability === "available");

    return matchesSearch && matchesCapacity && matchesAccess && matchesCertificate;
  });
}

async function queryCatalogueCourseRecords() {
  return prisma.course.findMany({
    orderBy: { title: "asc" },
    select: courseSelectFields,
    where: { archivedAt: null },
  });
}

export async function getPublicCourseSummaries(
  filters: PublicCourseFilters = {},
): Promise<PublicCatalogueCourseSummary[]> {
  let existingHrba: PublicCourseSummary | null = null;
  const existingTrackedCourses = new Map<string, PublicCourseSummary>();
  let catalogueRecords: DatabaseCourseRecord[] | null = null;

  try {
    catalogueRecords = await queryCatalogueCourseRecords();
    for (const record of catalogueRecords) {
      if (
        TRACKED_PUBLIC_SLUGS.has(record.slug) &&
        record.status === CourseStatus.PUBLISHED &&
        (record.visibility === CourseVisibility.PUBLIC ||
          record.visibility === CourseVisibility.ASSIGNED_ONLY) &&
        isTrackedExternalCourseMetadata(record.analysisMetadataJson)
      ) {
        const summary = mapDatabaseCourseToSummary(record);
        existingTrackedCourses.set(record.slug, summary);
        if (HRBA_PUBLIC_SLUGS.has(record.slug)) {
          existingHrba = summary;
        }
      }
    }
  } catch (error) {
    logCourseDataFallback("getPublicCourseSummaries", error);
  }

  if (!existingHrba) {
    const fallbackHrba = DEMO_COURSES.find(
      (course) =>
        HRBA_PUBLIC_SLUGS.has(course.slug) &&
        course.status === "Published" &&
        course.access === "Public",
    );
    existingHrba = fallbackHrba ? toDemoSummary(fallbackHrba) : null;
    if (existingHrba) {
      existingTrackedCourses.set(HRBA_EXTERNAL_COURSE_SLUG, existingHrba);
    }
  }

  const courses = catalogueRecords
    ? mergeManagedExternalCatalogueRecords(catalogueRecords, existingTrackedCourses)
    : getPublicCatalogueSummaries(existingTrackedCourses);

  return filterPublicCatalogueSummaries(
    courses,
    filters,
  );
}

export async function getPublicCourseBySlug(
  slug: string,
): Promise<PublicCatalogueCourseDetail | null> {
  const definition = getCatalogueCourseDefinition(slug);
  let catalogueRecords: DatabaseCourseRecord[] | null = null;

  try {
    catalogueRecords = await queryCatalogueCourseRecords();
    const managedRecord = catalogueRecords.find(
      (course) =>
        course.slug === slug &&
        Boolean(getManagedExternalCourseMetadata(course.analysisMetadataJson)),
    );

    if (managedRecord) {
      const metadata = getManagedExternalCourseMetadata(managedRecord.analysisMetadataJson);
      return metadata
        ? mapManagedExternalCourseToDetail(managedRecord, metadata)
        : null;
    }
  } catch (error) {
    logCourseDataFallback("getPublicCourseBySlug", error);
  }

  if (!definition) {
    return null;
  }

  if (definition.availability === "coming_soon") {
    return toPublicCatalogueDetail(definition);
  }

  const record = catalogueRecords?.find(
    (course) =>
      (course.slug === definition.slug ||
        (HRBA_PUBLIC_SLUGS.has(course.slug) &&
          HRBA_PUBLIC_SLUGS.has(definition.slug))) &&
      course.status === CourseStatus.PUBLISHED &&
      (course.visibility === CourseVisibility.PUBLIC ||
        course.visibility === CourseVisibility.ASSIGNED_ONLY) &&
      isTrackedExternalCourseMetadata(course.analysisMetadataJson),
  );

  if (record) {
    return toPublicCatalogueDetail(
      definition,
      mapDatabaseCourseToDetail(record),
    );
  }

  const demoCourse = DEMO_COURSES.find(
    (course) =>
      HRBA_PUBLIC_SLUGS.has(course.slug) &&
      course.status === "Published" &&
      course.access === "Public",
  );

  if (demoCourse) {
    return toPublicCatalogueDetail(
      definition,
      getDemoDetail(demoCourse.slug),
    );
  }

  return toPublicCatalogueDetail(definition);
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
      where: { id: session.userId },
    });
    if (!dbUser) {
      return getDemoSummaries()
        .filter((c) => c.status === "Published")
        .map((c) => getLearnerSummary(c));
    }

    const records = await queryLearnerCourseRecords();
    const entitledRecords = (
      await Promise.all(
        records.map(async (record) =>
          (await hasLearnerCourseEntitlement({
            courseId: record.id,
            courseSlug: record.slug,
            organizationId: dbUser.organizationId,
            primaryCohortId: dbUser.primaryCohortId,
            userId: dbUser.id,
            visibility: record.visibility,
          }))
            ? record
            : null,
        ),
      )
    ).filter((record): record is DatabaseCourseRecord => Boolean(record));

    if (records.length > 0) {
      const [enrollments, certificates, feedback] = await Promise.all([
        prisma.enrollment.findMany({
          where: { userId: dbUser.id },
          include: {
            lessonProgress: true,
          },
        }),
        prisma.certificate.findMany({
          where: {
            status: CertificateStatus.ISSUED,
            userId: dbUser.id,
          },
        }),
        prisma.feedback.findMany({
          select: { courseId: true },
          where: {
            courseId: { not: null },
            type: FeedbackType.COURSE_FEEDBACK,
            userId: dbUser.id,
          },
        }),
      ]);
      const feedbackCourseIds = new Set(
        feedback
          .map((entry) => entry.courseId)
          .filter((courseId): courseId is string => Boolean(courseId)),
      );

      return entitledRecords.map((record) => {
        const summary = mapDatabaseCourseToSummary(record);
        const latestVersionId = record.versions[0]?.id;
        const enrollment = enrollments.find(
          (e) => e.courseVersionId === latestVersionId,
        );
        const certificate = certificates.find(
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

        return getLearnerSummary(summary, certificate, feedbackCourseIds.has(record.id));
      });
    }
  } catch (error) {
    logCourseDataFallback("getLearnerCourseSummaries", error);
  }

  return getDemoSummaries()
    .filter((c) => c.status === "Published")
    .map((c) => getLearnerSummary(c));
}

export async function getLearnerCourseBySlug(
  slug: string,
  options: { initializeEnrollment?: boolean } = {},
): Promise<LearnerCourseDetail | null> {
  try {
    const initializeEnrollment = options.initializeEnrollment ?? true;
    const session = mockSession || await getCurrentSession();
    if (!session) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!dbUser) {
      return null;
    }

    const records = await queryLearnerCourseRecords();
    const record = records.find((course) => course.slug === slug);

    if (record) {
      if (!(await hasLearnerCourseEntitlement({
        courseId: record.id,
        courseSlug: record.slug,
        organizationId: dbUser.organizationId,
        primaryCohortId: dbUser.primaryCohortId,
        userId: dbUser.id,
        visibility: record.visibility,
      }))) {
        return null;
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
        if (!initializeEnrollment) {
          return getLearnerDetail(mapDatabaseCourseToDetail(record));
        }

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
        learnerEmail: dbUser.email,
        learnerName: dbUser.fullName ?? undefined,
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
          questions.length > 0
            ? questions
            : record.finalTestRequired
              ? getDemoFinalTestQuestions(record.slug)
              : [],
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
    logCourseDataFallback("getLearnerCourseBySlug", error);
    const allowFixtures = await isLocalQaFixtureAllowed();
    if (!allowFixtures) {
      throw error;
    }
  }

  const allowFixtures = await isLocalQaFixtureAllowed();
  if (allowFixtures) {
    const isDemoSlug = DEMO_COURSES.some((c) => c.slug === slug);
    if (isDemoSlug) {
      return getLearnerDetail(getDemoDetail(slug));
    }
  }

  return null;
}
