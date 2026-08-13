import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CourseVisibility } from "../src/generated/prisma/enums";
import {
  HRBA_EXTERNAL_COURSE_SLUG,
  PM_EXTERNAL_COURSE_SLUG,
} from "../src/lib/external-course-config";
import { resolveCourseAccessRequirement } from "../src/lib/course-entitlement";
import { selectDashboardNextAction } from "../src/components/learner/learner-dashboard-state";
import type { LearnerCourseSummary } from "../src/lib/course-types";

function learnerCourse(input: {
  id: string;
  statusLabel: LearnerCourseSummary["statusLabel"];
  title: string;
}): LearnerCourseSummary {
  return {
    certificateStatus: "Final assessment",
    feedbackStatus: "Feedback not submitted",
    id: input.id,
    primaryAction: "Continue learning",
    primaryActionHref: `/learn/courses/${input.id}/external`,
    statusLabel: input.statusLabel,
    title: input.title,
  } as LearnerCourseSummary;
}

assert.equal(
  resolveCourseAccessRequirement({
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    visibility: CourseVisibility.ASSIGNED_ONLY,
  }),
  "assignment",
);
assert.equal(
  resolveCourseAccessRequirement({
    courseSlug: PM_EXTERNAL_COURSE_SLUG,
    visibility: CourseVisibility.ASSIGNED_ONLY,
  }),
  "assignment",
);
assert.equal(
  resolveCourseAccessRequirement({
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    visibility: CourseVisibility.PUBLIC,
  }),
  "assignment",
);
assert.equal(
  resolveCourseAccessRequirement({
    courseSlug: "future-open-course",
    visibility: CourseVisibility.PUBLIC,
  }),
  "open",
);
assert.equal(
  resolveCourseAccessRequirement({
    courseSlug: "future-private-course",
    visibility: CourseVisibility.PRIVATE,
  }),
  "blocked",
);

const pm = learnerCourse({ id: PM_EXTERNAL_COURSE_SLUG, statusLabel: "In progress", title: "PM" });
const hrba = learnerCourse({ id: HRBA_EXTERNAL_COURSE_SLUG, statusLabel: "In progress", title: "HRBA" });
assert.equal(selectDashboardNextAction([pm]).course?.id, PM_EXTERNAL_COURSE_SLUG);
assert.equal(selectDashboardNextAction([hrba]).course?.id, HRBA_EXTERNAL_COURSE_SLUG);
assert.deepEqual(new Set([pm.id, hrba.id]), new Set([PM_EXTERNAL_COURSE_SLUG, HRBA_EXTERNAL_COURSE_SLUG]));

const signIn = readFileSync("src/app/(auth)/sign-in/actions.ts", "utf8");
assert.match(signIn, /return "\/learn";/);
assert.doesNotMatch(signIn, /HRBA_EXTERNAL_COURSE_SLUG|applying-human-rights-based-approach/);

const registration = readFileSync("src/lib/open-registration-workflow.ts", "utf8");
assert.doesNotMatch(registration, /tx\.courseAssignment\.(create|upsert)/);

console.log("Course entitlement and fresh sign-in routing verification passed.");
