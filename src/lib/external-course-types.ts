export const EXTERNAL_COURSE_PROGRESS_MESSAGE = "cso-learning-hub:external-course-progress";
export const EXTERNAL_COURSE_EVENT_MESSAGE = "cso-learning-hub:external-course-event";

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
  maxScore?: number;
  passed?: boolean;
  percentage?: number;
  score?: number;
  submittedAt?: string;
};

export type ExternalCourseProgressMessage = {
  type: typeof EXTERNAL_COURSE_PROGRESS_MESSAGE;
  version: 1;
  courseSlug: string;
  userId?: string;
  enrollmentId?: string;
  courseVersionId?: string;
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
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<ExternalCourseEventMessage>;
  if (
    message.type !== EXTERNAL_COURSE_EVENT_MESSAGE ||
    message.version !== 1 ||
    typeof message.courseSlug !== "string" ||
    !message.courseSlug ||
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
    typeof message.progressPercent !== "number"
  ) {
    return false;
  }

  if (message.event === "course_completed" && message.progressPercent !== 100) {
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
  courseSlug: string;
  courseTitle: string;
  iframeSrc: string;
  launchToken: string;
};
