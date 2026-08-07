export const HRBA_EXTERNAL_COURSE_SLUG =
  "applying-human-rights-based-approach-in-cso-practice";

export const HRBA_EXTERNAL_COURSE_ID = "COURSE-HRBA-EXTERNAL-VITE-V1";
export const HRBA_EXTERNAL_COURSE_VERSION_ID = "PCV-HRBA-EXTERNAL-VITE-V1";
export const HRBA_EXTERNAL_COURSE_MODULE_ID = "MOD-HRBA-EXTERNAL-VITE";
export const HRBA_EXTERNAL_COURSE_LESSON_ID = "LES-HRBA-EXTERNAL-VITE";
export const HRBA_EXTERNAL_COURSE_QUIZ_ID = "QUIZ-HRBA-EXTERNAL-COMPLETION";
export const HRBA_EXTERNAL_COURSE_QUESTION_ID = "QQ-HRBA-EXTERNAL-COMPLETION";

export const HRBA_PRODUCTION_COURSE_URL =
  "https://enhanced-hrba-pilot.vercel.app";
export const HRBA_PRODUCTION_COURSE_ORIGIN =
  new URL(HRBA_PRODUCTION_COURSE_URL).origin;
export const DEFAULT_HRBA_EXTERNAL_COURSE_URL = HRBA_PRODUCTION_COURSE_URL;

const OBSOLETE_HRBA_EXTERNAL_COURSE_ORIGINS = new Set([
  "https://pilot-hrba-e-learn-v1-wajj.vercel.app",
]);

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

function normalizeAllowedOrigin(value: string) {
  const parsed = new URL(value);
  const normalizedValue = value.endsWith("/") ? value.slice(0, -1) : value;

  if (
    !["http:", "https:"].includes(parsed.protocol) ||
    parsed.origin !== normalizedValue ||
    OBSOLETE_HRBA_EXTERNAL_COURSE_ORIGINS.has(parsed.origin)
  ) {
    throw new Error(`Invalid HRBA external course origin: ${value}`);
  }

  return parsed.origin;
}

function normalizeLaunchUrl(value: string) {
  const parsed = new URL(value);

  if (
    !["http:", "https:"].includes(parsed.protocol) ||
    OBSOLETE_HRBA_EXTERNAL_COURSE_ORIGINS.has(parsed.origin)
  ) {
    throw new Error(`Invalid HRBA external course URL: ${value}`);
  }

  return value;
}

export function getHrbaExternalCourseUrl() {
  return normalizeLaunchUrl(
    process.env.HRBA_EXTERNAL_COURSE_URL?.trim() || DEFAULT_HRBA_EXTERNAL_COURSE_URL,
  );
}

export function getHrbaExternalCourseAllowedOrigins() {
  const launchOrigin = new URL(getHrbaExternalCourseUrl()).origin;

  return Array.from(
    new Set([
      launchOrigin,
      ...splitOrigins(process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS).map(
        normalizeAllowedOrigin,
      ),
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

  let launchUrl: string;
  let allowedOrigins: string[];

  try {
    launchUrl = normalizeLaunchUrl(metadata.launchUrl);
    allowedOrigins = metadata.allowedOrigins
      .filter((origin): origin is string => typeof origin === "string" && origin.length > 0)
      .map(normalizeAllowedOrigin);
  } catch {
    return null;
  }

  if (
    allowedOrigins.length === 0 ||
    !allowedOrigins.includes(new URL(launchUrl).origin)
  ) {
    return null;
  }

  return {
    provider: "hrba-vite",
    launchUrl,
    allowedOrigins: Array.from(new Set(allowedOrigins)),
  };
}

export function isExternalHrbaCourseMetadata(value: unknown) {
  return getExternalCourseMetadata(value)?.provider === "hrba-vite";
}
