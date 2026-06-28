import "dotenv/config";

import {
  buildCreatorCourseNav,
  creatorCourseWorkflowSteps,
  creatorNav,
} from "../src/lib/routes";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  console.log("=== R22B Verification: Creator Navigation Cleanup ===");

  assert(creatorNav.length === 1, "Expected global creator nav to contain only generic My Courses.");
  assert(creatorNav[0]?.href === "/creator/courses", "Expected global creator nav to point to My Courses.");
  assert(
    !creatorNav.some((item) => item.href.includes("demo-course")),
    "Expected global creator nav to contain no demo-course workflow links.",
  );
  console.log("PASS: global creator nav is generic and has no hard-coded demo course links.");

  const courseId = "course-r22b-verification";
  const workflowNav = buildCreatorCourseNav(courseId);
  assert(
    workflowNav.length === creatorCourseWorkflowSteps.length,
    "Expected workflow nav to include each configured creator workflow step.",
  );
  assert(
    workflowNav.every((item) => item.href.startsWith(`/creator/courses/${courseId}/`)),
    "Expected generated workflow links to use the selected course id.",
  );
  assert(
    workflowNav.some((item) => item.href === `/creator/courses/${courseId}/metadata`),
    "Expected generated workflow nav to include Metadata.",
  );
  assert(
    workflowNav.some((item) => item.href === `/creator/courses/${courseId}/submit`),
    "Expected generated workflow nav to include Submit / Feedback.",
  );
  assert(
    !workflowNav.some((item) => item.href.includes("demo-course")),
    "Expected generated workflow nav to avoid demo-course unless it is the selected course id.",
  );
  console.log("PASS: course workflow nav is generated from the selected course id.");

  console.log("ALL R22B CHECKS PASSED.");
}

main();
