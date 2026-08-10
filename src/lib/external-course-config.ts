export const HRBA_EXTERNAL_COURSE_SLUG =
  "applying-human-rights-based-approach-in-cso-practice";

export const HRBA_EXTERNAL_COURSE_ID = "COURSE-HRBA-EXTERNAL-VITE-V1";
export const HRBA_EXTERNAL_COURSE_VERSION_ID = "PCV-HRBA-EXTERNAL-VITE-V1";
export const HRBA_EXTERNAL_COURSE_MODULE_ID = "MOD-HRBA-EXTERNAL-VITE";
export const HRBA_EXTERNAL_COURSE_LESSON_ID = "LES-HRBA-EXTERNAL-VITE";
export const HRBA_EXTERNAL_COURSE_QUIZ_ID = "QUIZ-HRBA-EXTERNAL-COMPLETION";
export const HRBA_EXTERNAL_COURSE_QUESTION_ID = "QQ-HRBA-EXTERNAL-COMPLETION";

export const PM_EXTERNAL_COURSE_SLUG =
  "project-management-local-grassroots-csos";
export const PM_EXTERNAL_COURSE_INTERNAL_ID = "project-management";
export const PM_EXTERNAL_COURSE_ID = "COURSE-PM-EXTERNAL-VITE-V1";
export const PM_EXTERNAL_COURSE_VERSION_ID = "PCV-PM-EXTERNAL-VITE-V1";
export const PM_EXTERNAL_COURSE_MODULE_ID = "MOD-PM-EXTERNAL-VITE";
export const PM_EXTERNAL_COURSE_LESSON_ID = "LES-PM-EXTERNAL-VITE";
export const PM_EXTERNAL_COURSE_BLOCK_ID = "BLK-PM-EXTERNAL-VITE-LAUNCH";
export const PM_EXTERNAL_COURSE_TITLE =
  "Project Management for Local and Grassroots CSOs";
export const PM_EXTERNAL_COURSE_THUMBNAIL =
  "/images/courses/thumbnails/course-project-management-thumbnail-v2.webp";

export const PM_CANONICAL_SCREEN_IDS = [
  "PM-GL-01",
  "PM-M1-02",
  "PM-M1-03",
  "PM-M1-04",
  "PM-M1-05",
  "PM-M1-06",
  "PM-M1-07",
  "PM-M2-01",
  "PM-M2-02",
  "PM-M2-03",
  "PM-M2-04",
  "PM-M2-05",
  "PM-M3-01",
  "PM-M3-02",
  "PM-M3-03",
  "PM-M3-04",
  "PM-M3-05",
  "PM-M3-06",
  "PM-M3-07",
  "PM-M4-01",
  "PM-M4-02",
  "PM-M4-03",
  "PM-M4-04",
  "PM-M4-05",
  "PM-M4-06",
  "PM-M5-01",
  "PM-M5-02",
  "PM-M5-03",
  "PM-M5-04",
  "PM-M5-05",
  "PM-GL-02",
  "PM-GL-03",
] as const;

export const DEFAULT_HRBA_EXTERNAL_COURSE_URL =
  "https://pilot-hrba-e-learn-v1-wajj.vercel.app";
export const DEFAULT_PM_EXTERNAL_COURSE_URL = "http://localhost:5173";

const DEFAULT_HRBA_EXTERNAL_COURSE_ORIGINS = [
  "https://pilot-hrba-e-learn-v1-wajj.vercel.app",
  "http://localhost:5173",
];
const DEFAULT_PM_EXTERNAL_COURSE_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export type ExternalCourseProvider = "hrba-vite" | "project-management-vite";

export type ExternalCourseMetadata = {
  provider: ExternalCourseProvider;
  launchUrl: string;
  allowedOrigins: string[];
  internalCourseId?: string;
};

export type TrackedExternalCourseConfig = {
  courseId: string;
  courseSlug: string;
  courseVersionId: string;
  lessonId: string;
  moduleId: string;
  provider: ExternalCourseProvider;
  internalCourseId?: string;
  canonicalScreenIds?: readonly string[];
  enforceMonotonicProgress: boolean;
  supportsSecureNewTab: boolean;
};

function splitOrigins(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function distinctOrigins(origins: string[]) {
  return Array.from(new Set(origins));
}

export function getHrbaExternalCourseUrl() {
  return (
    process.env.HRBA_EXTERNAL_COURSE_URL?.trim() ||
    DEFAULT_HRBA_EXTERNAL_COURSE_URL
  );
}

export function getHrbaExternalCourseAllowedOrigins() {
  return distinctOrigins([
    ...DEFAULT_HRBA_EXTERNAL_COURSE_ORIGINS,
    ...splitOrigins(process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS),
    new URL(getHrbaExternalCourseUrl()).origin,
  ]);
}

export function getPmExternalCourseUrl() {
  return (
    process.env.PM_EXTERNAL_COURSE_URL?.trim() ||
    DEFAULT_PM_EXTERNAL_COURSE_URL
  );
}

export function getPmExternalCourseAllowedOrigins() {
  return distinctOrigins([
    ...DEFAULT_PM_EXTERNAL_COURSE_ORIGINS,
    ...splitOrigins(process.env.PM_EXTERNAL_COURSE_ALLOWED_ORIGINS),
    new URL(getPmExternalCourseUrl()).origin,
  ]);
}

export function buildHrbaExternalCourseMetadata(): ExternalCourseMetadata {
  return {
    provider: "hrba-vite",
    launchUrl: getHrbaExternalCourseUrl(),
    allowedOrigins: getHrbaExternalCourseAllowedOrigins(),
  };
}

export function buildPmExternalCourseMetadata(): ExternalCourseMetadata {
  return {
    provider: "project-management-vite",
    launchUrl: getPmExternalCourseUrl(),
    allowedOrigins: getPmExternalCourseAllowedOrigins(),
    internalCourseId: PM_EXTERNAL_COURSE_INTERNAL_ID,
  };
}

const trackedExternalCourses: readonly TrackedExternalCourseConfig[] = [
  {
    courseId: HRBA_EXTERNAL_COURSE_ID,
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
    lessonId: HRBA_EXTERNAL_COURSE_LESSON_ID,
    moduleId: HRBA_EXTERNAL_COURSE_MODULE_ID,
    provider: "hrba-vite",
    enforceMonotonicProgress: false,
    supportsSecureNewTab: true,
  },
  {
    courseId: PM_EXTERNAL_COURSE_ID,
    courseSlug: PM_EXTERNAL_COURSE_SLUG,
    courseVersionId: PM_EXTERNAL_COURSE_VERSION_ID,
    lessonId: PM_EXTERNAL_COURSE_LESSON_ID,
    moduleId: PM_EXTERNAL_COURSE_MODULE_ID,
    provider: "project-management-vite",
    internalCourseId: PM_EXTERNAL_COURSE_INTERNAL_ID,
    canonicalScreenIds: PM_CANONICAL_SCREEN_IDS,
    enforceMonotonicProgress: true,
    supportsSecureNewTab: false,
  },
];

export function getTrackedExternalCourseConfig(courseSlug: string) {
  return trackedExternalCourses.find((course) => course.courseSlug === courseSlug) ?? null;
}

export function isCanonicalExternalCourseScreenId(
  config: TrackedExternalCourseConfig,
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    Boolean(config.canonicalScreenIds?.includes(value))
  );
}

export function getExternalCourseMetadata(
  value: unknown,
): ExternalCourseMetadata | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const externalCourse = record.externalCourse;

  if (!externalCourse || typeof externalCourse !== "object") {
    return null;
  }

  const metadata = externalCourse as Partial<ExternalCourseMetadata>;

  if (
    (metadata.provider !== "hrba-vite" &&
      metadata.provider !== "project-management-vite") ||
    typeof metadata.launchUrl !== "string" ||
    !Array.isArray(metadata.allowedOrigins) ||
    (metadata.internalCourseId !== undefined &&
      typeof metadata.internalCourseId !== "string")
  ) {
    return null;
  }

  const allowedOrigins = metadata.allowedOrigins.filter(
    (origin): origin is string => typeof origin === "string" && origin.length > 0,
  );

  if (allowedOrigins.length === 0) {
    return null;
  }

  return {
    provider: metadata.provider,
    launchUrl: metadata.launchUrl,
    allowedOrigins,
    ...(metadata.internalCourseId
      ? { internalCourseId: metadata.internalCourseId }
      : {}),
  };
}

export function isTrackedExternalCourseMetadata(value: unknown) {
  return getExternalCourseMetadata(value) !== null;
}

export function isExternalHrbaCourseMetadata(value: unknown) {
  return getExternalCourseMetadata(value)?.provider === "hrba-vite";
}
