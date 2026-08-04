import type { LearnerCourseSummary } from "@/lib/course-types";

export type DashboardActionKind =
  | "assessment"
  | "in-progress"
  | "feedback"
  | "certificate"
  | "not-started"
  | "my-courses"
  | "support";

export type DashboardNextAction = {
  actionHref: string;
  actionLabel: string;
  course?: LearnerCourseSummary;
  kind: DashboardActionKind;
};

export function isAssessmentReady(course: LearnerCourseSummary) {
  return (
    course.statusLabel === "Final assessment available" ||
    course.certificateStatus === "Final assessment"
  );
}

export function hasPendingFeedback(course: LearnerCourseSummary) {
  return (
    !isAssessmentReady(course) &&
    ["Completed", "Certificate issued"].includes(course.statusLabel) &&
    course.feedbackStatus === "Feedback not submitted"
  );
}

function courseAction(
  kind: DashboardActionKind,
  course: LearnerCourseSummary,
): DashboardNextAction {
  if (kind === "feedback") {
    return {
      actionHref: course.feedbackHref,
      actionLabel: "Give feedback",
      course,
      kind,
    };
  }

  return {
    actionHref: course.primaryActionHref,
    actionLabel: course.primaryAction,
    course,
    kind,
  };
}

export function selectDashboardNextAction(
  courses: LearnerCourseSummary[],
): DashboardNextAction {
  const assessment = courses.find(isAssessmentReady);
  if (assessment) return courseAction("assessment", assessment);

  const inProgress = courses.find((course) => course.statusLabel === "In progress");
  if (inProgress) return courseAction("in-progress", inProgress);

  const feedback = courses.find(hasPendingFeedback);
  if (feedback) return courseAction("feedback", feedback);

  const certificate = courses.find((course) => course.statusLabel === "Certificate issued");
  if (certificate) return courseAction("certificate", certificate);

  const notStarted = courses.find((course) => course.statusLabel === "Not started");
  if (notStarted) return courseAction("not-started", notStarted);

  if (courses.length > 0) {
    return {
      actionHref: "/learn/my-courses",
      actionLabel: "Open My Courses",
      kind: "my-courses",
    };
  }

  return {
    actionHref: "/support",
    actionLabel: "Contact support",
    kind: "support",
  };
}

function isPrimaryDuplicate(
  candidate: DashboardNextAction,
  primary: DashboardNextAction,
) {
  return (
    candidate.course?.id === primary.course?.id &&
    candidate.actionHref === primary.actionHref
  );
}

export function selectDashboardAttention(
  courses: LearnerCourseSummary[],
  primary: DashboardNextAction,
): DashboardNextAction | undefined {
  const candidates = [
    ...courses.filter(isAssessmentReady).map((course) => courseAction("assessment", course)),
    ...courses.filter(hasPendingFeedback).map((course) => courseAction("feedback", course)),
    ...courses
      .filter((course) => course.statusLabel === "Certificate issued")
      .map((course) => courseAction("certificate", course)),
  ];

  return candidates.find((candidate) => !isPrimaryDuplicate(candidate, primary));
}
