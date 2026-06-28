import {
  AuditActionType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
} from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import { canAccessCreator, hasAnyRole } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import { DEMO_COURSE_ID, DEMO_COURSE_SLUG } from "./demo-data";
import type { LearnerTemplateSelection } from "./learner-template";
import {
  getLearnerTemplateOptions,
  resolveLearnerTemplateSelection,
  toLearnerTemplateMetadata,
} from "./learner-template";
import { prisma } from "./prisma";

export type CreatorCourseListItem = {
  capacityArea: string;
  primaryAction: string;
  primaryHref: string;
  readiness: string;
  secondaryAction: string;
  secondaryHref: string;
  status: string;
  title: string;
  updated: string;
};

export type CreatorCourseListData = {
  courses: CreatorCourseListItem[];
  metrics: {
    draft: number;
    published: number;
    readyForReview: number;
    returned: number;
  };
};

export type CreatorCourseSetupData = {
  accessType: string;
  capacityAreaId: string;
  capacityAreaName: string;
  capacityOptions: Array<{ id: string; name: string }>;
  certificateIncluded: string;
  courseId: string | null;
  courseTitle: string;
  coverImageUrl: string;
  duration: string;
  finalTestRequired: string;
  language: string;
  learningNeed: string;
  level: string;
  mode: "existing" | "new";
  passScore: string;
  primaryAudience: string;
  questionCount: string;
  shortDescription: string;
  status: string;
  targetProfile: string;
};

export type CreatorCourseSetupInput = {
  accessType: string;
  capacityAreaId: string;
  certificateIncluded: string;
  courseId?: string | null;
  courseTitle: string;
  coverImageUrl: string;
  duration: string;
  finalTestRequired: string;
  language: string;
  learningNeed: string;
  level: string;
  passScore: string;
  primaryAudience: string;
  session: AuthSession | null;
  shortDescription: string;
  targetProfile: string;
};

export type CreatorCourseSetupResult = {
  code: "created" | "invalid" | "not-found" | "saved" | "unauthorized";
  courseId?: string;
  slug?: string;
  success: boolean;
};

export type CreatorCourseMetadataData = {
  capacityOptions: Array<{ id: string; name: string }>;
  courseFitDecision: string;
  courseFitDecisionOptions: Array<{ id: string; label: string }>;
  courseFitNote: string;
  courseId: string;
  courseTitle: string;
  csoPracticeId: string;
  csoPracticeOptions: Array<{
    capacityAreaId: string;
    description: string;
    id: string;
    name: string;
  }>;
  currentPracticeBaseline: string;
  desiredPractice: string;
  indicatorId: string;
  indicatorOptions: Array<{
    capacityAreaId: string;
    csoPracticeId: string;
    evidenceType: string;
    id: string;
    indicatorCode: string;
    measurementLevel: string;
    name: string;
    standardFamilyId: string;
  }>;
  intendedPracticeImprovement: string;
  ksmePrimary: string;
  ksmeSecondary: string;
  ksmeOptions: Array<{ id: string; label: string }>;
  learningCanHelp: string;
  learningCanHelpOptions: Array<{ id: string; label: string }>;
  learnerTemplate: LearnerTemplateSelection;
  learnerTemplateOptions: LearnerTemplateSelection[];
  primaryCapacityAreaId: string;
  primaryCapacityAreaName: string;
  recommendedPrerequisites: string;
  relatedFollowUpSupport: string;
  rootCauseSummary: string;
  accessibilityNote: string;
  safeguardingNote: string;
  secondaryCapacityAreaId: string;
  standardFamilyId: string;
  standardFamilyOptions: Array<{ id: string; name: string }>;
  status: string;
  targetCsoProfile: string;
  capacityGapAddressed: string;
};

export type CreatorCourseMetadataInput = {
  capacityGapAddressed: string;
  courseFitDecision: string;
  courseFitNote: string;
  courseId: string;
  csoPracticeId: string;
  currentPracticeBaseline: string;
  desiredPractice: string;
  indicatorId: string;
  intendedPracticeImprovement: string;
  ksmePrimary: string;
  ksmeSecondary: string;
  learningCanHelp: string;
  learnerTemplateId: string;
  primaryCapacityAreaId: string;
  recommendedPrerequisites: string;
  relatedFollowUpSupport: string;
  rootCauseSummary: string;
  accessibilityNote: string;
  safeguardingNote: string;
  secondaryCapacityAreaId: string;
  standardFamilyId: string;
  session: AuthSession | null;
  targetCsoProfile: string;
};

export type CreatorCourseMetadataResult = {
  code: "invalid" | "not-found" | "saved" | "unauthorized";
  courseId?: string;
  slug?: string;
  success: boolean;
};

type DbCreator = {
  id: string;
};

const editableCourseStatuses = new Set<CourseStatus>([
  CourseStatus.DRAFT,
  CourseStatus.RETURNED_FOR_REVISION,
]);

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

const levelByLabel: Record<string, CourseLevel> = {
  Advanced: CourseLevel.ADVANCED,
  Foundational: CourseLevel.FOUNDATIONAL,
  Intermediate: CourseLevel.INTERMEDIATE,
  Introductory: CourseLevel.INTRODUCTORY,
  Mixed: CourseLevel.MIXED,
};

const visibilityLabels: Record<CourseVisibility, string> = {
  ASSIGNED_ONLY: "Assigned",
  PRIVATE: "Restricted",
  PUBLIC: "Public",
};

const visibilityByLabel: Record<string, CourseVisibility> = {
  Assigned: CourseVisibility.ASSIGNED_ONLY,
  Public: CourseVisibility.PUBLIC,
  Restricted: CourseVisibility.PRIVATE,
};

function normalizeCourseId(value: string) {
  return value === DEMO_COURSE_ID ? DEMO_COURSE_SLUG : value;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

function parsePositiveInteger(value: string, fallback: number | null) {
  const parsed = Number.parseInt(value.replace(/[^0-9]/g, ""), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

async function uniqueSlug(title: string) {
  const baseSlug = slugify(title) || "new-course";
  let slug = baseSlug;
  let index = 2;

  while (await prisma.course.findUnique({ select: { id: true }, where: { slug } })) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return slug;
}

async function getCreator(session: AuthSession | null): Promise<{
  creator: DbCreator | null;
  isAdmin: boolean;
}> {
  if (!canAccessCreator(session)) {
    return { creator: null, isAdmin: false };
  }

  const creator = session?.email
    ? await prisma.user.findUnique({
        select: { id: true },
        where: { email: session.email },
      })
    : null;

  return {
    creator,
    isAdmin: hasAnyRole(session, ["SUPER_ADMIN", "PLATFORM_ADMIN"]),
  };
}

async function getCapacityOptions() {
  return prisma.capacityArea.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
    },
    where: { isActive: true },
  });
}

async function getMetadataReferenceOptions() {
  const [
    csoPracticeOptions,
    standardFamilyOptions,
    indicatorOptions,
    ksmeOptions,
    learningCanHelpOptions,
    courseFitDecisionOptions,
  ] = await Promise.all([
    prisma.cSOPractice.findMany({
      orderBy: { name: "asc" },
      select: {
        capacityAreaId: true,
        description: true,
        id: true,
        name: true,
      },
      where: { isActive: true, capacityArea: { isActive: true } },
    }),
    prisma.standardFamily.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
      where: { isActive: true },
    }),
    prisma.indicator.findMany({
      orderBy: [{ indicatorCode: "asc" }, { indicatorName: "asc" }],
      select: {
        capacityAreaId: true,
        csoPracticeId: true,
        evidenceType: true,
        id: true,
        indicatorCode: true,
        indicatorName: true,
        measurementLevel: true,
        standardFamilyId: true,
      },
      where: {
        capacityArea: { isActive: true },
        OR: [{ csoPracticeId: null }, { csoPractice: { isActive: true } }],
        isActive: true,
        standardFamily: { isActive: true },
      },
    }),
    getReferenceOptions("cause-type"),
    getReferenceOptions("learning-can-help"),
    getReferenceOptions("routing-type"),
  ]);

  return {
    courseFitDecisionOptions,
    csoPracticeOptions: csoPracticeOptions.map((option) => ({
      ...option,
      description: option.description ?? "",
    })),
    indicatorOptions: indicatorOptions.map((option) => ({
      capacityAreaId: option.capacityAreaId,
      csoPracticeId: option.csoPracticeId ?? "",
      evidenceType: option.evidenceType ?? "",
      id: option.id,
      indicatorCode: option.indicatorCode,
      measurementLevel: option.measurementLevel ?? "",
      name: option.indicatorName,
      standardFamilyId: option.standardFamilyId,
    })),
    ksmeOptions,
    learningCanHelpOptions,
    standardFamilyOptions,
  };
}

async function getReferenceOptions(category: string) {
  const items = await prisma.referenceDataItem.findMany({
    orderBy: [{ order: "asc" }, { label: "asc" }],
    select: {
      key: true,
      label: true,
    },
    where: {
      category,
      isActive: true,
    },
  });

  return items.map((item) => ({ id: item.key, label: item.label }));
}

function jsonRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function metadataString(
  metadata: Record<string, unknown>,
  key: string,
) {
  const value = metadata[key];

  return typeof value === "string" ? value : "";
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

function creatorScope(creator: DbCreator | null, isAdmin: boolean) {
  return creator && !isAdmin
    ? [{ OR: [{ assignedCreatorId: creator.id }, { createdById: creator.id }] }]
    : [];
}

function readinessLabel(course: {
  finalTestRequired: boolean;
  learningOutcomes: unknown[];
  status: CourseStatus;
  versions: Array<{
    modules: Array<{
      lessons: Array<{
        contentBlocks: unknown[];
      }>;
    }>;
  }>;
}) {
  if (course.status === CourseStatus.PUBLISHED) {
    return "Live for participants";
  }

  if (course.status === CourseStatus.READY_FOR_REVIEW) {
    return "Review package ready";
  }

  const latestVersion = course.versions[0];
  const blockCount =
    latestVersion?.modules.reduce(
      (total, module) =>
        total +
        module.lessons.reduce(
          (lessonTotal, lesson) => lessonTotal + lesson.contentBlocks.length,
          0,
        ),
      0,
    ) ?? 0;

  if (blockCount > 0 && course.learningOutcomes.length > 0) {
    return "Content build in progress";
  }

  if (course.learningOutcomes.length > 0) {
    return "Outcomes started";
  }

  return "Setup started";
}

function primaryAction(course: { status: CourseStatus }) {
  if (course.status === CourseStatus.READY_FOR_REVIEW) {
    return "Review Submission";
  }

  if (course.status === CourseStatus.PUBLISHED) {
    return "View Course";
  }

  return "Continue Editing";
}

function primaryHref(course: { id: string; slug: string; status: CourseStatus }) {
  if (course.status === CourseStatus.READY_FOR_REVIEW) {
    return `/creator/courses/${course.id}/submit`;
  }

  if (course.status === CourseStatus.PUBLISHED) {
    return `/courses/${course.slug}`;
  }

  return `/creator/courses/${course.id}/setup`;
}

export async function getCreatorCourseList(
  session: AuthSession | null,
): Promise<CreatorCourseListData> {
  const { creator, isAdmin } = await getCreator(session);
  if (!creator && !isAdmin) {
    return {
      courses: [],
      metrics: { draft: 0, published: 0, readyForReview: 0, returned: 0 },
    };
  }

  const courses = await prisma.course.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      capacityAreas: {
        select: {
          capacityArea: {
            select: { name: true },
          },
        },
      },
      finalTestRequired: true,
      id: true,
      learningOutcomes: {
        select: { id: true },
      },
      slug: true,
      status: true,
      title: true,
      updatedAt: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        select: {
          modules: {
            select: {
              lessons: {
                select: {
                  contentBlocks: {
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
        take: 1,
      },
    },
    where: {
      AND: creatorScope(creator, isAdmin),
      archivedAt: null,
    },
  });

  return {
    courses: courses.map((course) => ({
      capacityArea: course.capacityAreas[0]?.capacityArea.name ?? "No capacity area",
      primaryAction: primaryAction(course),
      primaryHref: primaryHref(course),
      readiness: readinessLabel(course),
      secondaryAction: "Preview",
      secondaryHref: `/creator/courses/${course.id}/preview`,
      status: statusLabels[course.status],
      title: course.title,
      updated: formatDate(course.updatedAt),
    })),
    metrics: {
      draft: courses.filter((course) => course.status === CourseStatus.DRAFT).length,
      published: courses.filter((course) => course.status === CourseStatus.PUBLISHED).length,
      readyForReview: courses.filter((course) => course.status === CourseStatus.READY_FOR_REVIEW).length,
      returned: courses.filter((course) => course.status === CourseStatus.RETURNED_FOR_REVISION).length,
    },
  };
}

export async function getCreatorCourseSetup(
  courseIdOrSlug: string | null,
  session: AuthSession | null,
): Promise<CreatorCourseSetupData | null> {
  const capacityOptions = await getCapacityOptions();

  if (!courseIdOrSlug) {
    return {
      accessType: "Public",
      capacityAreaId: "",
      capacityAreaName: "Not selected",
      capacityOptions,
      certificateIncluded: "No",
      courseId: null,
      courseTitle: "",
      coverImageUrl: "",
      duration: "",
      finalTestRequired: "No",
      language: "English",
      learningNeed: "",
      level: "Foundational",
      mode: "new",
      passScore: "80",
      primaryAudience: "",
      questionCount: "0",
      shortDescription: "",
      status: "Draft setup",
      targetProfile: "",
    };
  }

  const { creator, isAdmin } = await getCreator(session);
  const normalizedCourseId = normalizeCourseId(courseIdOrSlug);

  const course = await prisma.course.findFirst({
    select: {
      capacityAreas: {
        select: {
          capacityArea: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: 1,
      },
      capacityGapAddressed: true,
      certificateEligible: true,
      coverImageUrl: true,
      defaultPassThreshold: true,
      estimatedDurationMinutes: true,
      finalTestRequired: true,
      id: true,
      language: true,
      level: true,
      shortDescription: true,
      status: true,
      targetAudience: true,
      targetCsoProfile: true,
      title: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        select: {
          quizzes: {
            select: {
              questions: {
                select: { id: true },
              },
            },
            take: 1,
            where: { isFinalTest: true },
          },
        },
        take: 1,
      },
      visibility: true,
    },
    where: {
      AND: [
        {
          OR: [{ id: normalizedCourseId }, { slug: normalizedCourseId }],
        },
        ...creatorScope(creator, isAdmin),
      ],
      archivedAt: null,
    },
  });

  if (!course) {
    return null;
  }

  const capacityArea = course.capacityAreas[0]?.capacityArea;

  return {
    accessType: visibilityLabels[course.visibility],
    capacityAreaId: capacityArea?.id ?? "",
    capacityAreaName: capacityArea?.name ?? "Not selected",
    capacityOptions,
    certificateIncluded: course.certificateEligible ? "Yes" : "No",
    courseId: course.id,
    courseTitle: course.title,
    coverImageUrl: course.coverImageUrl ?? "",
    duration: course.estimatedDurationMinutes ? String(course.estimatedDurationMinutes) : "",
    finalTestRequired: course.finalTestRequired ? "Yes" : "No",
    language: course.language,
    learningNeed: course.capacityGapAddressed ?? "",
    level: levelLabels[course.level],
    mode: "existing",
    passScore: String(course.defaultPassThreshold),
    primaryAudience: course.targetAudience ?? "",
    questionCount: String(course.versions[0]?.quizzes[0]?.questions.length ?? 0),
    shortDescription: course.shortDescription,
    status: statusLabels[course.status],
    targetProfile: course.targetCsoProfile ?? "",
  };
}

export async function getCreatorCourseMetadata(
  courseIdOrSlug: string,
  session: AuthSession | null,
): Promise<CreatorCourseMetadataData | null> {
  const [capacityOptions, referenceOptions] = await Promise.all([
    getCapacityOptions(),
    getMetadataReferenceOptions(),
  ]);
  const { creator, isAdmin } = await getCreator(session);
  if (!creator && !isAdmin) {
    return null;
  }

  const normalizedCourseId = normalizeCourseId(courseIdOrSlug);
  const course = await prisma.course.findFirst({
    select: {
      capacityAreas: {
        select: {
          capacityArea: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: 2,
      },
      analysisMetadataJson: true,
      capacityGapAddressed: true,
      id: true,
      intendedPracticeImprovement: true,
      recommendedPrerequisites: true,
      relatedFollowUpSupport: true,
      status: true,
      targetCsoProfile: true,
      title: true,
    },
    where: {
      AND: [
        {
          OR: [{ id: normalizedCourseId }, { slug: normalizedCourseId }],
        },
        ...creatorScope(creator, isAdmin),
      ],
      archivedAt: null,
    },
  });

  if (!course) {
    return null;
  }

  const [primaryCapacityArea, secondaryCapacityArea] = course.capacityAreas.map(
    (link) => link.capacityArea,
  );
  const metadata = jsonRecord(course.analysisMetadataJson);
  const learnerTemplate = resolveLearnerTemplateSelection(course.analysisMetadataJson);
  const workflowCourseId =
    courseIdOrSlug === DEMO_COURSE_ID ? course.id : courseIdOrSlug;

  return {
    accessibilityNote: metadataString(metadata, "accessibilityNote"),
    capacityGapAddressed: course.capacityGapAddressed ?? "",
    capacityOptions,
    courseFitDecision: metadataString(metadata, "courseFitDecision"),
    courseFitDecisionOptions: referenceOptions.courseFitDecisionOptions,
    courseFitNote: metadataString(metadata, "courseFitNote"),
    courseId: workflowCourseId,
    courseTitle: course.title,
    csoPracticeId: metadataString(metadata, "csoPracticeId"),
    csoPracticeOptions: referenceOptions.csoPracticeOptions,
    currentPracticeBaseline: metadataString(metadata, "currentPracticeBaseline"),
    desiredPractice: metadataString(metadata, "desiredPractice"),
    indicatorId: metadataString(metadata, "indicatorId"),
    indicatorOptions: referenceOptions.indicatorOptions,
    intendedPracticeImprovement: course.intendedPracticeImprovement ?? "",
    ksmeOptions: referenceOptions.ksmeOptions,
    ksmePrimary: metadataString(metadata, "ksmePrimary"),
    ksmeSecondary: metadataString(metadata, "ksmeSecondary"),
    learningCanHelp: metadataString(metadata, "learningCanHelp"),
    learningCanHelpOptions: referenceOptions.learningCanHelpOptions,
    learnerTemplate,
    learnerTemplateOptions: getLearnerTemplateOptions(),
    primaryCapacityAreaId: primaryCapacityArea?.id ?? "",
    primaryCapacityAreaName: primaryCapacityArea?.name ?? "Not selected",
    recommendedPrerequisites: course.recommendedPrerequisites ?? "",
    relatedFollowUpSupport: course.relatedFollowUpSupport ?? "",
    rootCauseSummary: metadataString(metadata, "rootCauseSummary"),
    safeguardingNote: metadataString(metadata, "safeguardingNote"),
    secondaryCapacityAreaId: secondaryCapacityArea?.id ?? "",
    standardFamilyId: metadataString(metadata, "standardFamilyId"),
    standardFamilyOptions: referenceOptions.standardFamilyOptions,
    status: statusLabels[course.status],
    targetCsoProfile: course.targetCsoProfile ?? "",
  };
}

export async function saveCreatorCourseSetup(
  input: CreatorCourseSetupInput,
): Promise<CreatorCourseSetupResult> {
  const { creator, isAdmin } = await getCreator(input.session);
  if (!creator && !isAdmin) {
    return { code: "unauthorized", success: false };
  }

  const dbUserId = creator?.id;
  if (!dbUserId) {
    return { code: "unauthorized", success: false };
  }

  const title = input.courseTitle.trim();
  const shortDescription = input.shortDescription.trim();
  if (!title || !shortDescription) {
    return { code: "invalid", success: false };
  }

  const level = levelByLabel[input.level] ?? CourseLevel.FOUNDATIONAL;
  const visibility = visibilityByLabel[input.accessType] ?? CourseVisibility.PRIVATE;
  const estimatedDurationMinutes = parsePositiveInteger(input.duration, null);
  const defaultPassThreshold = parsePositiveInteger(input.passScore, 80) ?? 80;
  const capacityAreaId = input.capacityAreaId.trim();

  if (!input.courseId) {
    const slug = await uniqueSlug(title);

    const created = await prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          analysisMetadataJson: {
            template: {
              selectedNavigationStyleId: "SIDEBAR_OUTLINE",
              selectedTemplateId: "LT-GUIDED-LESSON",
              selectedThemeId: "DEC_DEFAULT",
            },
          },
          assignedCreatorId: dbUserId,
          capacityGapAddressed: input.learningNeed.trim() || null,
          certificateEligible: input.certificateIncluded === "Yes",
          coverImageUrl: input.coverImageUrl.trim() || null,
          createdById: dbUserId,
          defaultPassThreshold,
          estimatedDurationMinutes,
          finalTestRequired: input.finalTestRequired === "Yes",
          intendedPracticeImprovement: null,
          language: input.language.trim() || "English",
          level,
          longDescription: shortDescription,
          shortDescription,
          slug,
          status: CourseStatus.DRAFT,
          targetAudience: input.primaryAudience.trim() || null,
          targetCsoProfile: input.targetProfile.trim() || null,
          title,
          visibility,
        },
      });

      await tx.courseVersion.create({
        data: {
          changeNotes: "Initial draft setup.",
          courseId: course.id,
          createdById: dbUserId,
          status: CourseStatus.DRAFT,
          versionNumber: 1,
        },
      });

      if (capacityAreaId) {
        await tx.courseCapacityArea.create({
          data: {
            capacityAreaId,
            courseId: course.id,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actionType: AuditActionType.COURSE_CREATED,
          actorUserId: dbUserId,
          description: `Course created: ${title}.`,
          entityId: course.id,
          entityType: "Course",
          metadataJson: {
            slug,
            title,
          },
        },
      });

      return course;
    });

    return {
      code: "created",
      courseId: created.id,
      slug: created.slug,
      success: true,
    };
  }

  const normalizedCourseId = normalizeCourseId(input.courseId);
  const existing = await prisma.course.findFirst({
    select: {
      id: true,
      slug: true,
      status: true,
    },
    where: {
      AND: [
        {
          OR: [{ id: normalizedCourseId }, { slug: normalizedCourseId }],
        },
        ...creatorScope(creator, isAdmin),
      ],
      archivedAt: null,
    },
  });

  if (!existing) {
    return { code: "not-found", success: false };
  }

  if (!editableCourseStatuses.has(existing.status) && !isAdmin) {
    return { code: "unauthorized", success: false };
  }

  await prisma.$transaction(async (tx) => {
    await tx.course.update({
      data: {
        capacityGapAddressed: input.learningNeed.trim() || null,
        certificateEligible: input.certificateIncluded === "Yes",
        coverImageUrl: input.coverImageUrl.trim() || null,
        defaultPassThreshold,
        estimatedDurationMinutes,
        finalTestRequired: input.finalTestRequired === "Yes",
        language: input.language.trim() || "English",
        level,
        longDescription: shortDescription,
        shortDescription,
        targetAudience: input.primaryAudience.trim() || null,
        targetCsoProfile: input.targetProfile.trim() || null,
        title,
        visibility,
      },
      where: { id: existing.id },
    });

    await tx.courseCapacityArea.deleteMany({
      where: { courseId: existing.id },
    });

    if (capacityAreaId) {
      await tx.courseCapacityArea.create({
        data: {
          capacityAreaId,
          courseId: existing.id,
        },
      });
    }

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COURSE_UPDATED,
        actorUserId: dbUserId,
        description: `Course setup updated: ${title}.`,
        entityId: existing.id,
        entityType: "Course",
        metadataJson: {
          title,
        },
      },
    });
  });

  return {
    code: "saved",
    courseId: existing.id,
    slug: existing.slug,
    success: true,
  };
}

export async function saveCreatorCourseMetadata(
  input: CreatorCourseMetadataInput,
): Promise<CreatorCourseMetadataResult> {
  const { creator, isAdmin } = await getCreator(input.session);
  if (!creator && !isAdmin) {
    return { code: "unauthorized", success: false };
  }

  const dbUserId = creator?.id;
  if (!dbUserId) {
    return { code: "unauthorized", success: false };
  }

  const courseId = input.courseId.trim();
  const primaryCapacityAreaId = input.primaryCapacityAreaId.trim();
  const secondaryCapacityAreaId = input.secondaryCapacityAreaId.trim();
  const targetCsoProfile = input.targetCsoProfile.trim();
  const capacityGapAddressed = input.capacityGapAddressed.trim();
  const intendedPracticeImprovement = input.intendedPracticeImprovement.trim();
  const recommendedPrerequisites = input.recommendedPrerequisites.trim();
  const relatedFollowUpSupport = input.relatedFollowUpSupport.trim();
  const csoPracticeId = input.csoPracticeId.trim();
  const standardFamilyId = input.standardFamilyId.trim();
  const indicatorId = input.indicatorId.trim();
  const currentPracticeBaseline = input.currentPracticeBaseline.trim();
  const desiredPractice = input.desiredPractice.trim();
  const rootCauseSummary = input.rootCauseSummary.trim();
  const ksmePrimary = input.ksmePrimary.trim();
  const ksmeSecondary = input.ksmeSecondary.trim();
  const learningCanHelp = input.learningCanHelp.trim();
  const learnerTemplate = toLearnerTemplateMetadata(input.learnerTemplateId);
  const courseFitDecision = input.courseFitDecision.trim();
  const courseFitNote = input.courseFitNote.trim();
  const accessibilityNote = input.accessibilityNote.trim();
  const safeguardingNote = input.safeguardingNote.trim();

  if (
    !courseId ||
    !primaryCapacityAreaId ||
    !csoPracticeId ||
    !targetCsoProfile ||
    !capacityGapAddressed ||
    !intendedPracticeImprovement ||
    !ksmePrimary ||
    !courseFitDecision ||
    primaryCapacityAreaId === secondaryCapacityAreaId
  ) {
    return { code: "invalid", courseId: courseId || undefined, success: false };
  }

  const selectedCapacityAreaIds = [
    primaryCapacityAreaId,
    ...(secondaryCapacityAreaId ? [secondaryCapacityAreaId] : []),
  ];
  const activeCapacityAreas = await prisma.capacityArea.findMany({
    select: { id: true },
    where: {
      id: { in: selectedCapacityAreaIds },
      isActive: true,
    },
  });
  if (activeCapacityAreas.length !== selectedCapacityAreaIds.length) {
    return { code: "invalid", courseId, success: false };
  }

  const [selectedPractice, selectedStandardFamily, selectedIndicator] = await Promise.all([
    prisma.cSOPractice.findFirst({
      select: { id: true },
      where: {
        capacityAreaId: primaryCapacityAreaId,
        id: csoPracticeId,
        isActive: true,
      },
    }),
    standardFamilyId
      ? prisma.standardFamily.findFirst({
          select: { id: true },
          where: { id: standardFamilyId, isActive: true },
        })
      : Promise.resolve(null),
    indicatorId
      ? prisma.indicator.findFirst({
          select: { id: true },
          where: {
            capacityAreaId: primaryCapacityAreaId,
            id: indicatorId,
            isActive: true,
            OR: [{ csoPracticeId }, { csoPracticeId: null }],
            ...(standardFamilyId ? { standardFamilyId } : {}),
          },
        })
      : Promise.resolve(null),
  ]);

  if (!selectedPractice || (standardFamilyId && !selectedStandardFamily) || (indicatorId && !selectedIndicator)) {
    return { code: "invalid", courseId, success: false };
  }

  const normalizedCourseId = normalizeCourseId(courseId);
  const existing = await prisma.course.findFirst({
    select: {
      analysisMetadataJson: true,
      id: true,
      slug: true,
      status: true,
      title: true,
    },
    where: {
      AND: [
        {
          OR: [{ id: normalizedCourseId }, { slug: normalizedCourseId }],
        },
        ...creatorScope(creator, isAdmin),
      ],
      archivedAt: null,
    },
  });

  if (!existing) {
    return { code: "not-found", courseId, success: false };
  }

  if (!editableCourseStatuses.has(existing.status) && !isAdmin) {
    return { code: "unauthorized", courseId: existing.id, success: false };
  }

  await prisma.$transaction(async (tx) => {
    const existingMetadata = jsonRecord(existing.analysisMetadataJson);
    await tx.course.update({
      data: {
        analysisMetadataJson: toInputJson({
          ...existingMetadata,
          accessibilityNote: accessibilityNote || null,
          courseFitDecision,
          courseFitNote: courseFitNote || null,
          csoPracticeId,
          currentPracticeBaseline: currentPracticeBaseline || null,
          desiredPractice: desiredPractice || null,
          indicatorId: indicatorId || null,
          ksmePrimary,
          ksmeSecondary: ksmeSecondary || null,
          learningCanHelp: learningCanHelp || null,
          rootCauseSummary: rootCauseSummary || null,
          safeguardingNote: safeguardingNote || null,
          standardFamilyId: standardFamilyId || null,
          template: {
            ...jsonRecord(existingMetadata.template),
            ...learnerTemplate,
          },
        }),
        capacityGapAddressed,
        intendedPracticeImprovement,
        recommendedPrerequisites: recommendedPrerequisites || null,
        relatedFollowUpSupport: relatedFollowUpSupport || null,
        targetCsoProfile,
      },
      where: { id: existing.id },
    });

    await tx.courseCapacityArea.deleteMany({
      where: { courseId: existing.id },
    });

    await tx.courseCapacityArea.createMany({
      data: selectedCapacityAreaIds.map((capacityAreaId) => ({
        capacityAreaId,
        courseId: existing.id,
      })),
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COURSE_UPDATED,
        actorUserId: dbUserId,
        description: `Course metadata updated: ${existing.title}.`,
        entityId: existing.id,
        entityType: "Course",
          metadataJson: {
            capacityAreaIds: selectedCapacityAreaIds,
            csoPracticeId,
            indicatorId: indicatorId || null,
            standardFamilyId: standardFamilyId || null,
          },
        },
      });
  });

  return { code: "saved", courseId: existing.id, slug: existing.slug, success: true };
}
