export const EXTERNAL_COURSE_PROGRESS_MESSAGE = "cso-learning-hub:external-course-progress";
export const EXTERNAL_COURSE_EVENT_MESSAGE = "cso-learning-hub:external-course-event";
export const EXTERNAL_COURSE_LAUNCH_CONTEXT_MESSAGE =
  "cso-learning-hub:external-course-launch-context";
export const EXTERNAL_COURSE_RESULT_MESSAGE =
  "cso-learning-hub:external-course-result";

const externalCourseEvidenceUuidV4Pattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const externalCourseEvidenceBase64UrlPattern =
  /^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/;
const prohibitedExternalCourseIdentifierKeys = new Set([
  "courseversionid",
  "enrollmentid",
  "learnerid",
  "organizationid",
  "orgid",
  "participantid",
  "userid",
]);

export function isValidExternalCourseEvidenceId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (
      externalCourseEvidenceUuidV4Pattern.test(value) ||
      externalCourseEvidenceBase64UrlPattern.test(value)
    )
  );
}

export function hasProhibitedExternalCourseIdentifier(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(hasProhibitedExternalCourseIdentifier);
  }

  return Object.entries(value).some(([key, nestedValue]) => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");

    return (
      prohibitedExternalCourseIdentifierKeys.has(normalizedKey) ||
      hasProhibitedExternalCourseIdentifier(nestedValue)
    );
  });
}

export type ExternalCourseEventName =
  | "course_ready"
  | "course_started"
  | "progress_updated"
  | "module_completed"
  | "assessment_completed"
  | "course_completed"
  | "integration_error";

export type ExternalCourseAssessmentResult = {
  attemptNumber?: number;
  evidenceId?: string;
  maxScore?: number;
  passed?: boolean;
  percentage?: number;
  score?: number;
  submittedAt?: string;
};

export type ExternalCourseAssessmentState = {
  attemptCount: number;
  evidenceId?: string;
  maxScore?: number;
  percentage?: number;
  retryAvailableAt?: string;
  score?: number;
  status: "not-started" | "locked" | "passed";
  submittedAt?: string;
};

export type ExternalCourseResultMessage = {
  type: typeof EXTERNAL_COURSE_RESULT_MESSAGE;
  version: 1;
  assessmentState?: ExternalCourseAssessmentState;
  certificateCode?: string | null;
  courseCompleted?: boolean;
  courseSlug: string;
  error?: string;
  event: "assessment_recorded" | "course_completed";
  evidenceId?: string;
  progressPercent?: number;
  success: boolean;
};

export type ExternalCoursePersistenceResult = {
  assessmentState?: ExternalCourseAssessmentState;
  certificateCode?: string | null;
  certificateStatus?:
    | "not-completed"
    | "assessment-missing"
    | "assessment-failed"
    | "issued"
    | "already-issued";
  completed?: boolean;
  error?: string;
  progressPercent?: number;
  success: boolean;
};

export type ExternalCourseProgressMessage = {
  type: typeof EXTERNAL_COURSE_PROGRESS_MESSAGE;
  version: 1;
  courseSlug: string;
  learnerStateKey: string;
  progressPercent: number;
  completed: boolean;
  completedModuleIds: string[];
  currentModuleId: string | null;
  currentScreenId: string | null;
  sentAt: string;
  assessment?: ExternalCourseAssessmentResult;
};

export type ExternalCourseEventMessage = {
  type: typeof EXTERNAL_COURSE_EVENT_MESSAGE;
  version: 1;
  courseSlug: string;
  learnerStateKey?: string;
  event: ExternalCourseEventName;
  sentAt: string;
  assessment?: ExternalCourseAssessmentResult;
  completedModuleIds?: string[];
  currentModuleId?: string | null;
  currentScreenId?: string | null;
  error?: {
    code: string;
    message?: string;
  };
  progressPercent?: number;
};

const externalCourseEvents = new Set<ExternalCourseEventName>([
  "assessment_completed",
  "course_completed",
  "course_ready",
  "course_started",
  "integration_error",
  "module_completed",
  "progress_updated",
]);

function optionalFiniteNumber(value: unknown) {
  return value === undefined || (typeof value === "number" && Number.isFinite(value));
}

export function isExternalCourseEventMessage(value: unknown): value is ExternalCourseEventMessage {
  if (
    !value ||
    typeof value !== "object" ||
    hasProhibitedExternalCourseIdentifier(value)
  ) {
    return false;
  }

  const message = value as Partial<ExternalCourseEventMessage>;
  if (
    message.type !== EXTERNAL_COURSE_EVENT_MESSAGE ||
    message.version !== 1 ||
    typeof message.courseSlug !== "string" ||
    !message.courseSlug ||
    (message.learnerStateKey !== undefined &&
      typeof message.learnerStateKey !== "string") ||
    typeof message.event !== "string" ||
    !externalCourseEvents.has(message.event as ExternalCourseEventName) ||
    typeof message.sentAt !== "string" ||
    !message.sentAt ||
    !optionalFiniteNumber(message.progressPercent) ||
    (message.progressPercent !== undefined &&
      (message.progressPercent < 0 || message.progressPercent > 100)) ||
    (message.completedModuleIds !== undefined &&
      (!Array.isArray(message.completedModuleIds) ||
        !message.completedModuleIds.every((id) => typeof id === "string")))
  ) {
    return false;
  }

  if (
    ["progress_updated", "module_completed", "assessment_completed"].includes(message.event) &&
    (
      typeof message.progressPercent !== "number" ||
      !message.learnerStateKey
    )
  ) {
    return false;
  }

  if (
    message.event === "course_completed" &&
    (message.progressPercent !== 100 || !message.learnerStateKey)
  ) {
    return false;
  }

  if (
    message.event === "integration_error" &&
    (!message.error || typeof message.error.code !== "string" || !message.error.code)
  ) {
    return false;
  }

  return true;
}

export type ExternalCourseLaunchData = {
  allowedOrigin: string;
  assessmentState?: ExternalCourseAssessmentState;
  certificateCode?: string | null;
  courseCompleted?: boolean;
  courseSlug: string;
  courseTitle: string;
  iframeSrc: string;
  initialProgressPercent?: number;
  launchToken: string;
  learnerStateKey: string;
  resumeScreenId?: string | null;
  supportsSecureNewTab?: boolean;
};

export type ExternalCourseLaunchContextMessage = {
  type: typeof EXTERNAL_COURSE_LAUNCH_CONTEXT_MESSAGE;
  version: 1;
  assessmentState?: ExternalCourseAssessmentState;
  certificateCode?: string | null;
  courseCompleted?: boolean;
  courseSlug: string;
  learnerStateKey: string;
  resumeScreenId?: string | null;
};
