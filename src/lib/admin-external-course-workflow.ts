import "server-only";

import { Prisma } from "../generated/prisma/client";
import {
  AuditActionType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
} from "../generated/prisma/enums";
import { canAccessAdmin } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import {
  EXTERNAL_COURSE_MANAGER_SCHEMA_VERSION,
  getManagedExternalCourseMetadata,
  mergeManagedExternalCourseMetadata,
  type ManagedExternalCourseAvailability,
  type ManagedExternalCourseEditorInput,
  type ManagedExternalCourseMetadata,
  type ManagedExternalCourseMode,
  type ManagedExternalCourseOpenBehavior,
  validateManagedExternalCourseInput,
} from "./external-course-manager";
import { HRBA_EXTERNAL_COURSE_SLUG } from "./external-course-config";
import { prisma } from "./prisma";
import { PUBLIC_CATALOGUE_CAPACITY_AREAS } from "./public-course-catalogue";

export type AdminExternalCourseIntent = "publish" | "save_draft" | "unpublish";

export type AdminExternalCourseEditorData = {
  capacityAreas: { id: string; label: string }[];
  course: {
    approvedOrigin: string;
    assessmentSupported: boolean;
    availability: ManagedExternalCourseAvailability;
    certificateEligible: boolean;
    completionRule: string;
    courseId: string | null;
    courseVersion: string;
    displayOrder: number;
    estimatedDurationMinutes: number | null;
    externalUrl: string;
    featured: boolean;
    fullDescription: string;
    imageUrl: string;
    integrationMode: ManagedExternalCourseMode;
    language: string;
    learningOutcomes: string[];
    level: CourseLevel;
    openBehavior: ManagedExternalCourseOpenBehavior;
    passThreshold: number | null;
    primaryCapacityAreaId: string;
    progressTrackingSupported: boolean;
    publicHref: string | null;
    secondaryCapacityAreaIds: string[];
    shortDescription: string;
    slug: string;
    statusLabel: string;
    targetAudience: string;
    title: string;
  };
};

export type AdminExternalCourseMutationResult = {
  code: string;
  courseId?: string;
  slug?: string;
  success: boolean;
};

const reservedHrbaSlugs = new Set([
  "human-rights-based-approach-practice",
  HRBA_EXTERNAL_COURSE_SLUG,
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

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

function emptyEditorData(): AdminExternalCourseEditorData {
  return {
    capacityAreas: PUBLIC_CATALOGUE_CAPACITY_AREAS.map((area) => ({
      id: area.id,
      label: area.name,
    })),
    course: {
      approvedOrigin: "",
      assessmentSupported: false,
      availability: "draft",
      certificateEligible: false,
      completionRule: "",
      courseId: null,
      courseVersion: "",
      displayOrder: 10,
      estimatedDurationMinutes: null,
      externalUrl: "",
      featured: false,
      fullDescription: "",
      imageUrl: "",
      integrationMode: "external_link",
      language: "English",
      learningOutcomes: [],
      level: CourseLevel.FOUNDATIONAL,
      openBehavior: "new_tab",
      passThreshold: null,
      primaryCapacityAreaId: PUBLIC_CATALOGUE_CAPACITY_AREAS[0]?.id ?? "",
      progressTrackingSupported: false,
      publicHref: null,
      secondaryCapacityAreaIds: [],
      shortDescription: "",
      slug: "",
      statusLabel: "New draft",
      targetAudience: "Local and grassroots CSO practitioners",
      title: "",
    },
  };
}

async function resolveAdminActor(session: AuthSession | null) {
  if (!canAccessAdmin(session)) {
    return null;
  }

  return prisma.user.findFirst({
    select: { id: true },
    where: {
      OR: [{ id: session?.userId }, { email: session?.email }],
    },
  });
}

export async function getAdminExternalCourseEditorData(
  courseId: string | null,
  session: AuthSession | null,
): Promise<AdminExternalCourseEditorData | null> {
  if (!canAccessAdmin(session)) {
    return null;
  }

  const fallback = emptyEditorData();
  if (!courseId) {
    return fallback;
  }

  const record = await prisma.course.findFirst({
    select: {
      analysisMetadataJson: true,
      certificateEligible: true,
      coverImageUrl: true,
      defaultPassThreshold: true,
      estimatedDurationMinutes: true,
      id: true,
      language: true,
      learningOutcomes: {
        orderBy: { order: "asc" },
        select: { statement: true },
      },
      level: true,
      longDescription: true,
      shortDescription: true,
      slug: true,
      status: true,
      targetAudience: true,
      title: true,
      visibility: true,
    },
    where: { archivedAt: null, id: courseId },
  });

  const metadata = getManagedExternalCourseMetadata(record?.analysisMetadataJson);
  if (!record || !metadata) {
    return null;
  }

  return {
    ...fallback,
    course: {
      approvedOrigin: metadata.approvedOrigin ?? "",
      assessmentSupported: metadata.assessmentSupported,
      availability: metadata.availability,
      certificateEligible: record.certificateEligible,
      completionRule: metadata.completionRule ?? "",
      courseId: record.id,
      courseVersion: metadata.courseVersion ?? "",
      displayOrder: metadata.displayOrder,
      estimatedDurationMinutes: record.estimatedDurationMinutes,
      externalUrl: metadata.externalUrl ?? "",
      featured: metadata.featured,
      fullDescription: record.longDescription ?? record.shortDescription,
      imageUrl: record.coverImageUrl ?? "",
      integrationMode: metadata.integrationMode,
      language: record.language,
      learningOutcomes: record.learningOutcomes.map((outcome) => outcome.statement),
      level: record.level,
      openBehavior: metadata.openBehavior,
      passThreshold: metadata.passThreshold ?? record.defaultPassThreshold,
      primaryCapacityAreaId: metadata.primaryCapacityAreaId,
      progressTrackingSupported: metadata.progressTrackingSupported,
      publicHref:
        record.status === CourseStatus.PUBLISHED && record.visibility === CourseVisibility.PUBLIC
          ? `/courses/${record.slug}`
          : null,
      secondaryCapacityAreaIds: metadata.secondaryCapacityAreaIds,
      shortDescription: record.shortDescription,
      slug: record.slug,
      statusLabel: statusLabels[record.status],
      targetAudience: record.targetAudience ?? "",
      title: record.title,
    },
  };
}

function stateForIntent(
  intent: AdminExternalCourseIntent,
  requestedAvailability: ManagedExternalCourseAvailability,
) {
  if (intent === "publish") {
    return {
      availability: requestedAvailability,
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.PUBLIC,
    };
  }

  if (intent === "unpublish") {
    return {
      availability: "unpublished" as const,
      status: CourseStatus.UNPUBLISHED,
      visibility: CourseVisibility.PRIVATE,
    };
  }

  return {
    availability: "draft" as const,
    status: CourseStatus.DRAFT,
    visibility: CourseVisibility.PRIVATE,
  };
}

export async function saveAdminExternalCourse({
  input,
  intent,
  session,
}: {
  input: ManagedExternalCourseEditorInput;
  intent: AdminExternalCourseIntent;
  session: AuthSession | null;
}): Promise<AdminExternalCourseMutationResult> {
  const actor = await resolveAdminActor(session);
  if (!actor) {
    return { code: "unauthorized", courseId: input.courseId, success: false };
  }

  if (!(["publish", "save_draft", "unpublish"] as string[]).includes(intent)) {
    return { code: "invalid-action", courseId: input.courseId, success: false };
  }

  if (
    intent === "publish" &&
    input.availability !== "coming_soon" &&
    input.availability !== "available"
  ) {
    return { code: "publish-state-required", courseId: input.courseId, success: false };
  }

  const state = stateForIntent(intent, input.availability);
  const validated = validateManagedExternalCourseInput({
    ...input,
    availability: state.availability,
  });
  if (!validated.success) {
    return { code: validated.code, courseId: input.courseId, success: false };
  }

  const normalized = validated.input;
  if (reservedHrbaSlugs.has(normalized.slug)) {
    return { code: "reserved-hrba-slug", courseId: input.courseId, success: false };
  }

  const capacityAreaIds = [
    normalized.primaryCapacityAreaId,
    ...normalized.secondaryCapacityAreaIds,
  ];
  const [activeCapacityAreas, slugConflict, existing] = await Promise.all([
    prisma.capacityArea.findMany({
      select: { id: true },
      where: { id: { in: capacityAreaIds }, isActive: true },
    }),
    prisma.course.findFirst({
      select: { id: true },
      where: {
        slug: normalized.slug,
        ...(normalized.courseId ? { id: { not: normalized.courseId } } : {}),
      },
    }),
    normalized.courseId
      ? prisma.course.findFirst({
          select: { analysisMetadataJson: true, id: true, title: true },
          where: { archivedAt: null, id: normalized.courseId },
        })
      : Promise.resolve(null),
  ]);

  if (activeCapacityAreas.length !== capacityAreaIds.length) {
    return { code: "invalid-capacity-area", courseId: input.courseId, success: false };
  }

  if (slugConflict) {
    return { code: "slug-in-use", courseId: input.courseId, success: false };
  }

  if (normalized.courseId && (!existing || !getManagedExternalCourseMetadata(existing.analysisMetadataJson))) {
    return { code: "managed-course-not-found", courseId: input.courseId, success: false };
  }

  const metadata: ManagedExternalCourseMetadata = {
    approvedOrigin: normalized.approvedOrigin || null,
    assessmentSupported: normalized.assessmentSupported,
    availability: state.availability,
    completionRule: normalized.completionRule || null,
    courseVersion: normalized.courseVersion || null,
    displayOrder: normalized.displayOrder,
    externalUrl: normalized.externalUrl || null,
    featured: normalized.featured,
    integrationMode: normalized.integrationMode,
    openBehavior: normalized.openBehavior,
    passThreshold: normalized.passThreshold,
    primaryCapacityAreaId: normalized.primaryCapacityAreaId,
    progressTrackingSupported: normalized.progressTrackingSupported,
    schemaVersion: EXTERNAL_COURSE_MANAGER_SCHEMA_VERSION,
    secondaryCapacityAreaIds: normalized.secondaryCapacityAreaIds,
  };

  const courseId = await prisma.$transaction(async (tx) => {
    const commonData = {
      analysisMetadataJson: toInputJson(
        mergeManagedExternalCourseMetadata(existing?.analysisMetadataJson, metadata),
      ),
      certificateEligible: normalized.certificateEligible,
      coverImageUrl: normalized.imageUrl || null,
      defaultPassThreshold: normalized.passThreshold ?? 80,
      estimatedDurationMinutes: normalized.estimatedDurationMinutes,
      finalTestRequired:
        normalized.integrationMode === "hub_tracked" && normalized.assessmentSupported,
      language: normalized.language,
      level: normalized.level,
      longDescription: normalized.fullDescription,
      shortDescription: normalized.shortDescription,
      slug: normalized.slug,
      status: state.status,
      targetAudience: normalized.targetAudience,
      title: normalized.title,
      visibility: state.visibility,
    };

    const course = existing
      ? await tx.course.update({
          data: commonData,
          select: { id: true },
          where: { id: existing.id },
        })
      : await tx.course.create({
          data: {
            ...commonData,
            assignedCreatorId: actor.id,
            createdById: actor.id,
          },
          select: { id: true },
        });

    await tx.courseCapacityArea.deleteMany({ where: { courseId: course.id } });
    await tx.courseCapacityArea.createMany({
      data: capacityAreaIds.map((capacityAreaId) => ({
        capacityAreaId,
        courseId: course.id,
      })),
    });
    await tx.learningOutcome.deleteMany({ where: { courseId: course.id } });
    if (normalized.learningOutcomes.length > 0) {
      await tx.learningOutcome.createMany({
        data: normalized.learningOutcomes.map((statement, index) => ({
          courseId: course.id,
          order: index + 1,
          statement,
        })),
      });
    }

    const actionType = existing
      ? intent === "publish"
        ? AuditActionType.COURSE_PUBLISHED
        : intent === "unpublish"
          ? AuditActionType.COURSE_UNPUBLISHED
          : AuditActionType.COURSE_UPDATED
      : AuditActionType.COURSE_CREATED;

    await tx.auditLog.create({
      data: {
        actionType,
        actorUserId: actor.id,
        description: `${existing ? "Updated" : "Created"} external course configuration: ${normalized.title}.`,
        entityId: course.id,
        entityType: "Course",
        metadataJson: {
          approvedOrigin: metadata.approvedOrigin,
          availability: metadata.availability,
          displayOrder: metadata.displayOrder,
          integrationMode: metadata.integrationMode,
          progressTrackingSupported: metadata.progressTrackingSupported,
          schemaVersion: metadata.schemaVersion,
        },
      },
    });

    return course.id;
  });

  return {
    code:
      intent === "publish"
        ? "published"
        : intent === "unpublish"
          ? "unpublished"
          : "draft-saved",
    courseId,
    slug: normalized.slug,
    success: true,
  };
}
