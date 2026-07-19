import type { CourseLevel } from "../generated/prisma/enums";

export const EXTERNAL_COURSE_MANAGER_METADATA_KEY = "externalCourseManager";
export const EXTERNAL_COURSE_MANAGER_SCHEMA_VERSION = 1;

export type ManagedExternalCourseAvailability =
  | "draft"
  | "coming_soon"
  | "available"
  | "unpublished";

export type ManagedExternalCourseMode =
  | "external_link"
  | "embedded"
  | "hub_tracked";

export type ManagedExternalCourseOpenBehavior = "new_tab" | "inside_hub";

export type ManagedExternalCourseMetadata = {
  approvedOrigin: string | null;
  assessmentSupported: boolean;
  availability: ManagedExternalCourseAvailability;
  completionRule: string | null;
  courseVersion: string | null;
  displayOrder: number;
  externalUrl: string | null;
  featured: boolean;
  integrationMode: ManagedExternalCourseMode;
  openBehavior: ManagedExternalCourseOpenBehavior;
  passThreshold: number | null;
  primaryCapacityAreaId: string;
  progressTrackingSupported: boolean;
  schemaVersion: 1;
  secondaryCapacityAreaIds: string[];
};

export type ManagedExternalCourseEditorInput = {
  approvedOrigin: string;
  assessmentSupported: boolean;
  availability: ManagedExternalCourseAvailability;
  certificateEligible: boolean;
  completionRule: string;
  courseId?: string;
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
  secondaryCapacityAreaIds: string[];
  shortDescription: string;
  slug: string;
  targetAudience: string;
  title: string;
};

export type ManagedExternalCourseValidationResult =
  | { success: true; input: ManagedExternalCourseEditorInput }
  | { success: false; code: string };

const managedAvailability = new Set<ManagedExternalCourseAvailability>([
  "available",
  "coming_soon",
  "draft",
  "unpublished",
]);
const managedModes = new Set<ManagedExternalCourseMode>([
  "embedded",
  "external_link",
  "hub_tracked",
]);
const managedOpenBehaviors = new Set<ManagedExternalCourseOpenBehavior>([
  "inside_hub",
  "new_tab",
]);
const courseLevels = new Set<CourseLevel>([
  "ADVANCED",
  "FOUNDATIONAL",
  "INTERMEDIATE",
  "INTRODUCTORY",
  "MIXED",
]);

function recordValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];
}

export function getManagedExternalCourseMetadata(
  value: unknown,
): ManagedExternalCourseMetadata | null {
  const root = recordValue(value);
  const metadata = recordValue(root?.[EXTERNAL_COURSE_MANAGER_METADATA_KEY]);

  if (!metadata || metadata.schemaVersion !== EXTERNAL_COURSE_MANAGER_SCHEMA_VERSION) {
    return null;
  }

  const availability = metadata.availability;
  const integrationMode = metadata.integrationMode;
  const openBehavior = metadata.openBehavior;
  const displayOrder = Number(metadata.displayOrder);
  const primaryCapacityAreaId = optionalString(metadata.primaryCapacityAreaId);

  if (
    typeof availability !== "string" ||
    !managedAvailability.has(availability as ManagedExternalCourseAvailability) ||
    typeof integrationMode !== "string" ||
    !managedModes.has(integrationMode as ManagedExternalCourseMode) ||
    typeof openBehavior !== "string" ||
    !managedOpenBehaviors.has(openBehavior as ManagedExternalCourseOpenBehavior) ||
    !Number.isInteger(displayOrder) ||
    displayOrder < 1 ||
    !primaryCapacityAreaId
  ) {
    return null;
  }

  const passThresholdValue = Number(metadata.passThreshold);

  return {
    approvedOrigin: optionalString(metadata.approvedOrigin),
    assessmentSupported: metadata.assessmentSupported === true,
    availability: availability as ManagedExternalCourseAvailability,
    completionRule: optionalString(metadata.completionRule),
    courseVersion: optionalString(metadata.courseVersion),
    displayOrder,
    externalUrl: optionalString(metadata.externalUrl),
    featured: metadata.featured === true,
    integrationMode: integrationMode as ManagedExternalCourseMode,
    openBehavior: openBehavior as ManagedExternalCourseOpenBehavior,
    passThreshold:
      Number.isInteger(passThresholdValue) && passThresholdValue >= 1 && passThresholdValue <= 100
        ? passThresholdValue
        : null,
    primaryCapacityAreaId,
    progressTrackingSupported: metadata.progressTrackingSupported === true,
    schemaVersion: EXTERNAL_COURSE_MANAGER_SCHEMA_VERSION,
    secondaryCapacityAreaIds: Array.from(new Set(stringArray(metadata.secondaryCapacityAreaIds))).filter(
      (id) => id !== primaryCapacityAreaId,
    ),
  };
}

export function mergeManagedExternalCourseMetadata(
  currentValue: unknown,
  metadata: ManagedExternalCourseMetadata,
) {
  const current = recordValue(currentValue) ?? {};

  return {
    ...current,
    [EXTERNAL_COURSE_MANAGER_METADATA_KEY]: metadata,
  };
}

function isAllowedLocalHttpUrl(url: URL) {
  return (
    url.protocol === "http:" &&
    ["127.0.0.1", "::1", "localhost"].includes(url.hostname)
  );
}

export function parseSafeExternalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { error: null, origin: null, url: null };
  }

  try {
    const url = new URL(trimmed);
    const allowedScheme = url.protocol === "https:" || isAllowedLocalHttpUrl(url);
    const sensitiveKeys = ["courseVersionId", "enrollmentId", "userId"];
    const exposesInternalId = sensitiveKeys.some((key) => url.searchParams.has(key));

    if (!allowedScheme || url.username || url.password || exposesInternalId) {
      return { error: "unsafe-external-url", origin: null, url: null };
    }

    return { error: null, origin: url.origin, url: url.toString() };
  } catch {
    return { error: "invalid-external-url", origin: null, url: null };
  }
}

export function parseSafeImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { error: null, url: null };
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return { error: null, url: trimmed };
  }

  const parsed = parseSafeExternalUrl(trimmed);
  return parsed.error
    ? { error: "invalid-image-url", url: null }
    : { error: null, url: parsed.url };
}

export function validateApprovedOrigin(value: string, expectedOrigin: string | null) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { error: null, origin: null };
  }

  const parsed = parseSafeExternalUrl(trimmed);
  if (parsed.error || !parsed.url || !parsed.origin) {
    return { error: "invalid-approved-origin", origin: null };
  }

  const normalized = new URL(parsed.url);
  if (
    normalized.toString() !== `${normalized.origin}/` ||
    (expectedOrigin && normalized.origin !== expectedOrigin)
  ) {
    return { error: "invalid-approved-origin", origin: null };
  }

  return { error: null, origin: normalized.origin };
}

export function validateManagedExternalCourseInput(
  input: ManagedExternalCourseEditorInput,
): ManagedExternalCourseValidationResult {
  const slug = input.slug.trim().toLowerCase();
  const title = input.title.trim();
  const shortDescription = input.shortDescription.trim();
  const fullDescription = input.fullDescription.trim();
  const targetAudience = input.targetAudience.trim();
  const language = input.language.trim();
  const primaryCapacityAreaId = input.primaryCapacityAreaId.trim();
  const secondaryCapacityAreaIds = Array.from(
    new Set(input.secondaryCapacityAreaIds.map((id) => id.trim()).filter(Boolean)),
  ).filter((id) => id !== primaryCapacityAreaId);

  if (
    !title ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !shortDescription ||
    !fullDescription ||
    !targetAudience ||
    !language ||
    !primaryCapacityAreaId ||
    !managedAvailability.has(input.availability) ||
    !managedModes.has(input.integrationMode) ||
    !managedOpenBehaviors.has(input.openBehavior) ||
    !courseLevels.has(input.level) ||
    !Number.isInteger(input.displayOrder) ||
    input.displayOrder < 1 ||
    (input.estimatedDurationMinutes !== null &&
      (!Number.isInteger(input.estimatedDurationMinutes) || input.estimatedDurationMinutes < 1))
  ) {
    return { code: "invalid-course-information", success: false };
  }

  const externalUrl = parseSafeExternalUrl(input.externalUrl);
  if (externalUrl.error) {
    return { code: externalUrl.error, success: false };
  }

  const approvedOrigin = validateApprovedOrigin(input.approvedOrigin, externalUrl.origin);
  if (approvedOrigin.error) {
    return { code: approvedOrigin.error, success: false };
  }

  const imageUrl = parseSafeImageUrl(input.imageUrl);
  if (imageUrl.error) {
    return { code: imageUrl.error, success: false };
  }

  if (
    input.passThreshold !== null &&
    (!Number.isInteger(input.passThreshold) || input.passThreshold < 1 || input.passThreshold > 100)
  ) {
    return { code: "invalid-pass-threshold", success: false };
  }

  if (input.availability === "available" && !externalUrl.url) {
    return { code: "external-url-required", success: false };
  }

  if (
    input.availability === "available" &&
    input.integrationMode !== "external_link" &&
    !approvedOrigin.origin
  ) {
    return { code: "approved-origin-required", success: false };
  }

  if (
    input.integrationMode === "external_link" &&
    (input.openBehavior !== "new_tab" ||
      input.progressTrackingSupported ||
      input.assessmentSupported ||
      input.certificateEligible)
  ) {
    return { code: "invalid-external-link-capabilities", success: false };
  }

  if (
    input.integrationMode === "embedded" &&
    (input.openBehavior !== "inside_hub" ||
      input.progressTrackingSupported ||
      input.assessmentSupported ||
      input.certificateEligible)
  ) {
    return { code: "invalid-embedded-capabilities", success: false };
  }

  if (input.integrationMode === "hub_tracked" && input.availability === "available") {
    return { code: "hub-tracked-adapter-required", success: false };
  }

  if (
    input.certificateEligible &&
    (!input.progressTrackingSupported || !input.assessmentSupported || input.passThreshold === null)
  ) {
    return { code: "invalid-certificate-capabilities", success: false };
  }

  return {
    input: {
      ...input,
      approvedOrigin: approvedOrigin.origin ?? "",
      completionRule: input.completionRule.trim(),
      courseVersion: input.courseVersion.trim(),
      externalUrl: externalUrl.url ?? "",
      fullDescription,
      imageUrl: imageUrl.url ?? "",
      language,
      learningOutcomes: input.learningOutcomes.map((outcome) => outcome.trim()).filter(Boolean),
      primaryCapacityAreaId,
      secondaryCapacityAreaIds,
      shortDescription,
      slug,
      targetAudience,
      title,
    },
    success: true,
  };
}
