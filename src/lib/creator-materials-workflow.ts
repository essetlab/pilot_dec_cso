import { AuditActionType, CourseStatus } from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import { canAccessCreator, hasAnyRole } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import { DEMO_COURSE_ID, DEMO_COURSE_SLUG } from "./demo-data";
import { prisma } from "./prisma";

type DbCreator = {
  id: string;
};

type CreatorCourseContext = {
  capacityArea: string;
  courseId: string;
  isEditable: boolean;
  latestVersionId: string | null;
  slug: string;
  status: CourseStatus;
  title: string;
};

export type CreatorOutcomeItem = {
  alignment: {
    assessmentMethod: string;
    capacityAreaId: string;
    csoPracticeId: string;
    evidenceType: string;
    indicatorId: string;
    localOutcomeStatement: string;
    measurementLevel: string;
    observableAction: string;
    standardFamilyId: string;
    successCriterion: string;
  };
  id: string;
  order: number;
  statement: string;
};

export type CreatorOutcomesData = CreatorCourseContext & {
  capacityOptions: Array<{ id: string; name: string }>;
  csoPracticeOptions: Array<{ capacityAreaId: string; id: string; name: string }>;
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
  assessmentMethodOptions: Array<{ id: string; label: string }>;
  evidenceTypeOptions: Array<{ id: string; label: string }>;
  measurementLevelOptions: Array<{ id: string; label: string }>;
  outcomes: CreatorOutcomeItem[];
  standardFamilyOptions: Array<{ id: string; name: string }>;
};

export type CreatorOutcomeInput = {
  assessmentMethod: string;
  capacityAreaId: string;
  csoPracticeId: string;
  evidenceType: string;
  indicatorId: string;
  localOutcomeStatement: string;
  measurementLevel: string;
  observableAction: string;
  standardFamilyId: string;
  statement: string;
  successCriterion: string;
};

export type CreatorResourceItem = {
  accessibilityChecked: boolean;
  accessibilityNotes: string;
  description: string;
  downloadLabel: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  id: string;
  title: string;
  uploadedAt: string;
};

export type CreatorResourcesData = CreatorCourseContext & {
  resources: CreatorResourceItem[];
};

export type WorkflowResult = {
  code: "archived" | "created" | "invalid" | "missing-version" | "not-found" | "saved" | "unauthorized";
  success: boolean;
};

const editableCourseStatuses = new Set<CourseStatus>([
  CourseStatus.DRAFT,
  CourseStatus.RETURNED_FOR_REVISION,
]);

function normalizeCourseId(value: string) {
  return value === DEMO_COURSE_ID ? DEMO_COURSE_SLUG : value;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
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

function creatorScope(creator: DbCreator | null, isAdmin: boolean) {
  return creator && !isAdmin
    ? [{ OR: [{ assignedCreatorId: creator.id }, { createdById: creator.id }] }]
    : [];
}

function jsonRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function metadataString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];

  return typeof value === "string" ? value : "";
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

async function getReferenceOptions(category: string) {
  const items = await prisma.referenceDataItem.findMany({
    orderBy: [{ order: "asc" }, { label: "asc" }],
    select: { key: true, label: true },
    where: { category, isActive: true },
  });

  return items.map((item) => ({ id: item.key, label: item.label }));
}

async function getOutcomeReferenceOptions() {
  const [
    capacityOptions,
    csoPracticeOptions,
    standardFamilyOptions,
    indicatorOptions,
    measurementLevelOptions,
    assessmentMethodOptions,
    evidenceTypeOptions,
  ] = await Promise.all([
    prisma.capacityArea.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
      where: { isActive: true },
    }),
    prisma.cSOPractice.findMany({
      orderBy: { name: "asc" },
      select: { capacityAreaId: true, id: true, name: true },
      where: { isActive: true, capacityArea: { isActive: true } },
    }),
    prisma.standardFamily.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
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
    getReferenceOptions("measurement-level"),
    getReferenceOptions("measurement-method"),
    getReferenceOptions("evidence-source-type"),
  ]);

  return {
    assessmentMethodOptions,
    capacityOptions,
    csoPracticeOptions,
    evidenceTypeOptions,
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
    measurementLevelOptions,
    standardFamilyOptions,
  };
}

async function getCreatorCourseContext(
  courseIdOrSlug: string,
  session: AuthSession | null,
): Promise<(CreatorCourseContext & { dbUserId: string | null; isAdmin: boolean }) | null> {
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
            select: { name: true },
          },
        },
        take: 1,
      },
      id: true,
      slug: true,
      status: true,
      title: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        select: {
          id: true,
          status: true,
        },
        take: 1,
      },
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

  return {
    capacityArea: course.capacityAreas[0]?.capacityArea.name ?? "No capacity area",
    courseId: course.id,
    dbUserId: creator?.id ?? null,
    isAdmin,
    isEditable: isAdmin || editableCourseStatuses.has(course.status),
    latestVersionId: course.versions[0]?.id ?? null,
    slug: course.slug,
    status: course.status,
    title: course.title,
  };
}

export async function getCreatorOutcomesData(
  courseIdOrSlug: string,
  session: AuthSession | null,
): Promise<CreatorOutcomesData | null> {
  const [context, referenceOptions] = await Promise.all([
    getCreatorCourseContext(courseIdOrSlug, session),
    getOutcomeReferenceOptions(),
  ]);
  if (!context) {
    return null;
  }

  const outcomes = await prisma.learningOutcome.findMany({
    orderBy: { order: "asc" },
    select: {
      alignmentMetadataJson: true,
      id: true,
      order: true,
      statement: true,
    },
    where: {
      courseId: context.courseId,
    },
  });

  return {
    assessmentMethodOptions: referenceOptions.assessmentMethodOptions,
    capacityArea: context.capacityArea,
    capacityOptions: referenceOptions.capacityOptions,
    courseId: context.courseId,
    csoPracticeOptions: referenceOptions.csoPracticeOptions,
    evidenceTypeOptions: referenceOptions.evidenceTypeOptions,
    indicatorOptions: referenceOptions.indicatorOptions,
    isEditable: context.isEditable,
    latestVersionId: context.latestVersionId,
    measurementLevelOptions: referenceOptions.measurementLevelOptions,
    outcomes: outcomes.map((outcome) => {
      const alignment = jsonRecord(outcome.alignmentMetadataJson);

      return {
        alignment: {
          assessmentMethod: metadataString(alignment, "assessmentMethod"),
          capacityAreaId: metadataString(alignment, "capacityAreaId"),
          csoPracticeId: metadataString(alignment, "csoPracticeId"),
          evidenceType: metadataString(alignment, "evidenceType"),
          indicatorId: metadataString(alignment, "indicatorId"),
          localOutcomeStatement: metadataString(alignment, "localOutcomeStatement"),
          measurementLevel: metadataString(alignment, "measurementLevel"),
          observableAction: metadataString(alignment, "observableAction"),
          standardFamilyId: metadataString(alignment, "standardFamilyId"),
          successCriterion: metadataString(alignment, "successCriterion"),
        },
        id: outcome.id,
        order: outcome.order,
        statement: outcome.statement,
      };
    }),
    slug: context.slug,
    standardFamilyOptions: referenceOptions.standardFamilyOptions,
    status: context.status,
    title: context.title,
  };
}

export async function saveCreatorOutcomes(input: {
  courseIdOrSlug: string;
  outcomes?: CreatorOutcomeInput[];
  session: AuthSession | null;
  statements: string[];
}): Promise<WorkflowResult> {
  const context = await getCreatorCourseContext(input.courseIdOrSlug, input.session);
  if (!context) {
    return { code: "not-found", success: false };
  }

  if (!context.isEditable || !context.dbUserId) {
    return { code: "unauthorized", success: false };
  }
  const actorUserId = context.dbUserId;

  const outcomes = (input.outcomes?.length
    ? input.outcomes
    : input.statements.map((statement) => ({
        assessmentMethod: "",
        capacityAreaId: "",
        csoPracticeId: "",
        evidenceType: "",
        indicatorId: "",
        localOutcomeStatement: "",
        measurementLevel: "",
        observableAction: "",
        standardFamilyId: "",
        statement,
        successCriterion: "",
      }))
  )
    .map((outcome) => ({
      assessmentMethod: outcome.assessmentMethod.trim(),
      capacityAreaId: outcome.capacityAreaId.trim(),
      csoPracticeId: outcome.csoPracticeId.trim(),
      evidenceType: outcome.evidenceType.trim(),
      indicatorId: outcome.indicatorId.trim(),
      localOutcomeStatement: outcome.localOutcomeStatement.trim(),
      measurementLevel: outcome.measurementLevel.trim(),
      observableAction: outcome.observableAction.trim(),
      standardFamilyId: outcome.standardFamilyId.trim(),
      statement: outcome.statement.trim(),
      successCriterion: outcome.successCriterion.trim(),
    }))
    .filter((outcome) => outcome.statement)
    .slice(0, 8);

  if (outcomes.length === 0) {
    return { code: "invalid", success: false };
  }

  const invalidOutcome = outcomes.some(
    (outcome) =>
      (outcome.capacityAreaId && !outcome.csoPracticeId) ||
      (outcome.csoPracticeId && !outcome.capacityAreaId),
  );
  if (invalidOutcome) {
    return { code: "invalid", success: false };
  }

  await prisma.$transaction(async (tx) => {
    await tx.learningOutcome.deleteMany({
      where: { courseId: context.courseId },
    });

    await Promise.all(
      outcomes.map((outcome, index) =>
        tx.learningOutcome.create({
          data: {
            alignmentMetadataJson: toInputJson({
              assessmentMethod: outcome.assessmentMethod || null,
              capacityAreaId: outcome.capacityAreaId || null,
              csoPracticeId: outcome.csoPracticeId || null,
              evidenceType: outcome.evidenceType || null,
              indicatorId: outcome.indicatorId || null,
              localOutcomeStatement: outcome.localOutcomeStatement || null,
              measurementLevel: outcome.measurementLevel || null,
              observableAction: outcome.observableAction || null,
              standardFamilyId: outcome.standardFamilyId || null,
              successCriterion: outcome.successCriterion || null,
            }),
            courseId: context.courseId,
            order: index + 1,
            statement: outcome.statement,
          },
        }),
      ),
    );

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COURSE_UPDATED,
        actorUserId,
        description: `Learning outcomes updated for ${context.title}.`,
        entityId: context.courseId,
        entityType: "Course",
        metadataJson: {
          outcomeCount: outcomes.length,
        },
      },
    });
  });

  return { code: "saved", success: true };
}

export async function getCreatorResourcesData(
  courseIdOrSlug: string,
  session: AuthSession | null,
): Promise<CreatorResourcesData | null> {
  const context = await getCreatorCourseContext(courseIdOrSlug, session);
  if (!context) {
    return null;
  }

  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      accessibilityChecked: true,
      accessibilityNotes: true,
      createdAt: true,
      description: true,
      downloadLabel: true,
      fileName: true,
      fileType: true,
      fileUrl: true,
      id: true,
      title: true,
    },
    where: {
      archivedAt: null,
      courseId: context.courseId,
    },
  });

  return {
    capacityArea: context.capacityArea,
    courseId: context.courseId,
    isEditable: context.isEditable,
    latestVersionId: context.latestVersionId,
    resources: resources.map((resource) => ({
      accessibilityChecked: resource.accessibilityChecked,
      accessibilityNotes: resource.accessibilityNotes ?? "",
      description: resource.description ?? "",
      downloadLabel: resource.downloadLabel,
      fileName: resource.fileName,
      fileType: resource.fileType,
      fileUrl: resource.fileUrl,
      id: resource.id,
      title: resource.title,
      uploadedAt: formatDate(resource.createdAt),
    })),
    slug: context.slug,
    status: context.status,
    title: context.title,
  };
}

export async function addCreatorResource(input: {
  accessibilityChecked: boolean;
  accessibilityNotes: string;
  description: string;
  downloadLabel: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  session: AuthSession | null;
  courseIdOrSlug: string;
  title: string;
}): Promise<WorkflowResult> {
  const context = await getCreatorCourseContext(input.courseIdOrSlug, input.session);
  if (!context) {
    return { code: "not-found", success: false };
  }

  if (!context.isEditable || !context.dbUserId) {
    return { code: "unauthorized", success: false };
  }

  if (!context.latestVersionId) {
    return { code: "missing-version", success: false };
  }

  const title = input.title.trim();
  const fileUrl = input.fileUrl.trim();
  const fileName = input.fileName.trim();
  const fileType = input.fileType.trim();

  if (!title || !fileUrl || !fileName || !fileType) {
    return { code: "invalid", success: false };
  }

  await prisma.$transaction(async (tx) => {
    await tx.resource.create({
      data: {
        accessibilityChecked: input.accessibilityChecked,
        accessibilityNotes: input.accessibilityNotes.trim() || null,
        courseId: context.courseId,
        courseVersionId: context.latestVersionId as string,
        description: input.description.trim() || null,
        downloadLabel: input.downloadLabel.trim() || "Open resource",
        fileName,
        fileType,
        fileUrl,
        title,
        uploadedById: context.dbUserId as string,
      },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COURSE_UPDATED,
        actorUserId: context.dbUserId as string,
        description: `Resource added to ${context.title}.`,
        entityId: context.courseId,
        entityType: "Course",
        metadataJson: {
          resourceTitle: title,
        },
      },
    });
  });

  return { code: "created", success: true };
}

export async function archiveCreatorResource(input: {
  courseIdOrSlug: string;
  resourceId: string;
  session: AuthSession | null;
}): Promise<WorkflowResult> {
  const context = await getCreatorCourseContext(input.courseIdOrSlug, input.session);
  if (!context) {
    return { code: "not-found", success: false };
  }

  if (!context.isEditable || !context.dbUserId) {
    return { code: "unauthorized", success: false };
  }

  const resource = await prisma.resource.findFirst({
    select: {
      id: true,
      title: true,
    },
    where: {
      archivedAt: null,
      courseId: context.courseId,
      id: input.resourceId,
    },
  });

  if (!resource) {
    return { code: "not-found", success: false };
  }

  await prisma.$transaction(async (tx) => {
    await tx.resource.update({
      data: { archivedAt: new Date() },
      where: { id: resource.id },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COURSE_UPDATED,
        actorUserId: context.dbUserId as string,
        description: `Resource archived from ${context.title}.`,
        entityId: context.courseId,
        entityType: "Course",
        metadataJson: {
          resourceTitle: resource.title,
        },
      },
    });
  });

  return { code: "archived", success: true };
}
