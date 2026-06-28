export type CourseTone = "blue" | "green" | "gold" | "navy";

export type LearnerTemplateSelection = {
  navigationStyleId: "SIDEBAR_OUTLINE";
  templateId: string;
  templateLabel: string;
  templateSummary: string;
  themeId: "DEC_DEFAULT";
};

export type PublicCourseSummary = {
  access: string;
  audience: string;
  capacityArea: string;
  certificate: string;
  certificateEligible: string;
  creator: string;
  currentLesson: string;
  currentModule: string;
  description: string;
  duration: string;
  finalTest: string;
  href: string;
  id: string;
  imageAlt: string;
  imageUrl: string | null;
  isExternalCourse?: boolean;
  language: string;
  lastUpdated: string;
  lessons: string;
  lessonsCount: number;
  level: string;
  progress: number;
  resources: string;
  reviewStatus: string;
  shortTitle: string;
  slug: string;
  status: string;
  title: string;
  tone: CourseTone;
};

export type PublicCourseModule = {
  lessons: string[];
  title: string;
};

export type PublicCourseDetail = PublicCourseSummary & {
  longDescription: string;
  modules: PublicCourseModule[];
  outcomes: string[];
  shortDescription: string;
};

export type LearnerLessonStatus = "Completed" | "Current" | "Next";

export type LearnerLesson = {
  blocks: LearnerContentBlock[];
  description?: string | null;
  estimatedDurationMinutes?: number | null;
  id: string;
  status: LearnerLessonStatus;
  title: string;
};

export type LearnerContentBlock = {
  configJson: unknown;
  estimatedDurationMinutes: number | null;
  id: string;
  order: number;
  title: string;
  type: string;
  typeLabel: string;
};

export type LearnerCourseModule = {
  id?: string;
  lessons: LearnerLesson[];
  title: string;
};

export type LearnerFinalTestQuestion = {
  id?: string;
  options: string[];
  text: string;
  type: string;
};

export type LearnerCourseSummary = PublicCourseSummary & {
  certificateStatus: string;
  learnerHref: string;
  finalTestHref: string;
  primaryAction: string;
  secondaryAction: string;
  statusLabel: string;
};

export type LearnerCourseDetail = Omit<PublicCourseDetail, "modules"> & {
  certificateHref: string;
  certificateStatus: string;
  finalTestHref: string;
  finalTestQuestions: LearnerFinalTestQuestion[];
  modules: LearnerCourseModule[];
  passThresholdLabel: string;
  passThresholdRule: string;
  statusLabel: string;
  template: LearnerTemplateSelection;
  quizId?: string;
  courseVersionId?: string;
  retakeAllowed?: boolean;
  maxAttempts?: number | null;
  certificateCode?: string;
  certificateIssuedAt?: string;
  certificateParticipantName?: string;
  certificateCourseTitle?: string;
  certificateIssuerName?: string;
  certificateCompletionDate?: string;
};
