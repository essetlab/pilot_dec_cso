export const EXTERNAL_COURSE_PROGRESS_MESSAGE = "cso-learning-hub:external-course-progress";

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

export type ExternalCourseLaunchData = {
  allowedOrigin: string;
  courseSlug: string;
  courseTitle: string;
  iframeSrc: string;
  launchToken: string;
};
