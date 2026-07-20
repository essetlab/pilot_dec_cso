import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function source(path: string) {
  return readFileSync(path, "utf8");
}

const entitlement = source("src/lib/course-entitlement.ts");
assert.match(entitlement, /assignmentType: "USER"/);
assert.match(entitlement, /targetUserId: userId/);
assert.match(entitlement, /isHrbaCourseSlug/);

const external = source("src/lib/external-course-workflow.ts");
assert.match(external, /visibility: CourseVisibility\.ASSIGNED_ONLY/g);
assert.equal((external.match(/hasLearnerCourseEntitlement/g) ?? []).length >= 2, true);

for (const path of [
  "src/lib/course-data.ts",
  "src/lib/learner-actions.ts",
  "src/lib/feedback-workflow.ts",
  "src/lib/certificate-workflow.ts",
]) {
  assert.match(source(path), /hasLearnerCourseEntitlement/, `${path} must enforce entitlement.`);
}

const catalogue = source("src/lib/public-course-catalogue.ts");
assert.match(catalogue, /accessState: "invitation_required"/);
const detail = source("src/components/public/CourseDetailPage.tsx");
assert.match(detail, /Invitation required/);
assert.match(detail, /Assigned/);
const publicRoute = source("src/app/(public)/courses/[[...segments]]/page.tsx");
assert.match(publicRoute, /Invitation required/);
assert.match(publicRoute, /Continue course/);

console.log("HRBA assignment-boundary source verification passed.");
