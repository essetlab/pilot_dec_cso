export const EXTERNAL_COURSE_DIAGNOSTIC_MESSAGE =
  "cso-learning-hub:external-course-diagnostic";

export const RESUME_DIAGNOSTIC_STAGE_CODES = [
  "HRBA-1",
  "HRBA-2",
  "HRBA-3",
  "HRBA-4",
  "HUB-1",
  "HUB-2",
  "HUB-3",
  "HUB-4",
] as const;

export const RESUME_DIAGNOSTIC_ERROR_CATEGORIES = [
  "ack_invalid",
  "course_mismatch",
  "http_error",
  "invalid_response",
  "learner_context_mismatch",
  "message_invalid",
  "network_error",
  "origin_mismatch",
  "source_mismatch",
] as const;

export type ResumeDiagnosticStageCode =
  (typeof RESUME_DIAGNOSTIC_STAGE_CODES)[number];
export type ResumeDiagnosticErrorCategory =
  (typeof RESUME_DIAGNOSTIC_ERROR_CATEGORIES)[number];

export type ResumeDiagnosticCheckpoint = {
  stageCode: ResumeDiagnosticStageCode;
  timestamp: string;
  courseSlug: string;
  currentModuleId: string | null;
  currentScreenId: string | null;
  baseRevision: "null" | "present";
  result: "PASS" | "FAIL";
  httpStatus?: number;
  errorCategory?: ResumeDiagnosticErrorCategory;
  correlationId: string;
};

export type ExternalCourseDiagnosticMessage = {
  type: typeof EXTERNAL_COURSE_DIAGNOSTIC_MESSAGE;
  version: 1;
  diagnostic: ResumeDiagnosticCheckpoint;
};

const correlationIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const stageCodes = new Set<string>(RESUME_DIAGNOSTIC_STAGE_CODES);
const errorCategories = new Set<string>(RESUME_DIAGNOSTIC_ERROR_CATEGORIES);

function isSafeOptionalId(value: unknown): value is string | null {
  return value === null || (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 256
  );
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

export function isResumeDiagnosticCorrelationId(value: unknown): value is string {
  return typeof value === "string" && correlationIdPattern.test(value);
}

export function createResumeDiagnosticCorrelationId() {
  return crypto.randomUUID();
}

export function describeBaseRevision(value: unknown): "null" | "present" {
  return value === null || value === undefined ? "null" : "present";
}

export function validateResumeDiagnosticCheckpoint(
  value: unknown,
): ResumeDiagnosticCheckpoint | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.stageCode !== "string" ||
    !stageCodes.has(candidate.stageCode) ||
    !isIsoTimestamp(candidate.timestamp) ||
    typeof candidate.courseSlug !== "string" ||
    candidate.courseSlug.length === 0 ||
    candidate.courseSlug.length > 160 ||
    !isSafeOptionalId(candidate.currentModuleId) ||
    !isSafeOptionalId(candidate.currentScreenId) ||
    !["null", "present"].includes(String(candidate.baseRevision)) ||
    !["PASS", "FAIL"].includes(String(candidate.result)) ||
    !isResumeDiagnosticCorrelationId(candidate.correlationId) ||
    (candidate.httpStatus !== undefined && (
      !Number.isInteger(candidate.httpStatus) ||
      (candidate.httpStatus as number) < 100 ||
      (candidate.httpStatus as number) > 599
    )) ||
    (candidate.errorCategory !== undefined && (
      typeof candidate.errorCategory !== "string" ||
      !errorCategories.has(candidate.errorCategory)
    ))
  ) {
    return null;
  }

  return {
    stageCode: candidate.stageCode as ResumeDiagnosticStageCode,
    timestamp: candidate.timestamp as string,
    courseSlug: candidate.courseSlug,
    currentModuleId: candidate.currentModuleId as string | null,
    currentScreenId: candidate.currentScreenId as string | null,
    baseRevision: candidate.baseRevision as "null" | "present",
    result: candidate.result as "PASS" | "FAIL",
    ...(candidate.httpStatus === undefined
      ? {}
      : { httpStatus: candidate.httpStatus as number }),
    ...(candidate.errorCategory === undefined
      ? {}
      : {
          errorCategory:
            candidate.errorCategory as ResumeDiagnosticErrorCategory,
        }),
    correlationId: candidate.correlationId,
  };
}

export function isExternalCourseDiagnosticMessage(
  value: unknown,
): value is ExternalCourseDiagnosticMessage {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return candidate.type === EXTERNAL_COURSE_DIAGNOSTIC_MESSAGE &&
    candidate.version === 1 &&
    validateResumeDiagnosticCheckpoint(candidate.diagnostic) !== null;
}
