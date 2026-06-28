export const HRBA_EXTERNAL_COURSE_SLUG =
  "applying-human-rights-based-approach-in-cso-practice";

export const HRBA_EXTERNAL_COURSE_ID = "COURSE-HRBA-EXTERNAL-VITE-V1";
export const HRBA_EXTERNAL_COURSE_VERSION_ID = "PCV-HRBA-EXTERNAL-VITE-V1";
export const HRBA_EXTERNAL_COURSE_MODULE_ID = "MOD-HRBA-EXTERNAL-VITE";
export const HRBA_EXTERNAL_COURSE_LESSON_ID = "LES-HRBA-EXTERNAL-VITE";
export const HRBA_EXTERNAL_COURSE_QUIZ_ID = "QUIZ-HRBA-EXTERNAL-COMPLETION";
export const HRBA_EXTERNAL_COURSE_QUESTION_ID = "QQ-HRBA-EXTERNAL-COMPLETION";

export const DEFAULT_HRBA_EXTERNAL_COURSE_URL =
  "https://pilot-hrba-e-learn-v1-wajj.vercel.app";

const DEFAULT_HRBA_EXTERNAL_COURSE_ORIGINS = [
  "https://pilot-hrba-e-learn-v1-wajj.vercel.app",
  "http://localhost:5173",
];

export type ExternalCourseMetadata = {
  provider: "hrba-vite";
  launchUrl: string;
  allowedOrigins: string[];
};

function splitOrigins(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getHrbaExternalCourseUrl() {
  return (
    process.env.HRBA_EXTERNAL_COURSE_URL?.trim() ||
    DEFAULT_HRBA_EXTERNAL_COURSE_URL
  );
}

export function getHrbaExternalCourseAllowedOrigins() {
  return Array.from(
    new Set([
      ...DEFAULT_HRBA_EXTERNAL_COURSE_ORIGINS,
      ...splitOrigins(process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS),
      new URL(getHrbaExternalCourseUrl()).origin,
    ]),
  );
}

export function buildHrbaExternalCourseMetadata(): ExternalCourseMetadata {
  return {
    provider: "hrba-vite",
    launchUrl: getHrbaExternalCourseUrl(),
    allowedOrigins: getHrbaExternalCourseAllowedOrigins(),
  };
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
    metadata.provider !== "hrba-vite" ||
    typeof metadata.launchUrl !== "string" ||
    !Array.isArray(metadata.allowedOrigins)
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
    provider: "hrba-vite",
    launchUrl: metadata.launchUrl,
    allowedOrigins,
  };
}

export function isExternalHrbaCourseMetadata(value: unknown) {
  return getExternalCourseMetadata(value)?.provider === "hrba-vite";
}
