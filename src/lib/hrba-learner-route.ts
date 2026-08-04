import { HRBA_EXTERNAL_COURSE_SLUG } from "./external-course-config";

export const HRBA_LEGACY_COURSE_SLUG =
  "human-rights-based-approach-practice";

export const HRBA_CANONICAL_LEARNER_LAUNCH_PATH =
  `/learn/courses/${HRBA_EXTERNAL_COURSE_SLUG}/external`;

export function getHrbaLegacyLearnerLaunchRedirect(
  segments: readonly string[],
) {
  return segments.length === 3 &&
    segments[0] === "courses" &&
    segments[1] === HRBA_LEGACY_COURSE_SLUG &&
    segments[2] === "external"
    ? HRBA_CANONICAL_LEARNER_LAUNCH_PATH
    : null;
}
