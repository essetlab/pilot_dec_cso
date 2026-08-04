import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  HRBA_CANONICAL_LEARNER_LAUNCH_PATH,
  HRBA_LEGACY_COURSE_SLUG,
  getHrbaLegacyLearnerLaunchRedirect,
} from "../src/lib/hrba-learner-route";
import { HRBA_EXTERNAL_COURSE_SLUG } from "../src/lib/external-course-config";

const verifierScriptName = "verify:hrba-legacy-learner-route";
const verifierScriptCommand =
  "node --import jiti/register scripts/verify-hrba-legacy-learner-route.ts";
const legacySegments = ["courses", HRBA_LEGACY_COURSE_SLUG, "external"];
const canonicalSegments = ["courses", HRBA_EXTERNAL_COURSE_SLUG, "external"];
const canonicalRedirect = getHrbaLegacyLearnerLaunchRedirect(legacySegments);

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts?: Record<string, string>;
};
assert.equal(
  packageJson.scripts?.[verifierScriptName],
  verifierScriptCommand,
  "package.json must expose exactly the focused legacy-route verifier command.",
);

assert.equal(
  canonicalRedirect,
  `/learn/courses/${HRBA_EXTERNAL_COURSE_SLUG}/external`,
  "The legacy HRBA learner launch route must redirect to the canonical route.",
);
assert.equal(
  HRBA_CANONICAL_LEARNER_LAUNCH_PATH,
  `/learn/courses/${HRBA_EXTERNAL_COURSE_SLUG}/external`,
);
assert.equal(
  getHrbaLegacyLearnerLaunchRedirect(canonicalSegments),
  null,
  "The canonical HRBA learner launch route must not redirect.",
);

for (const unrelatedSegments of [
  ["courses", "project-management-local-grassroots-csos", "external"],
  ["courses", "governance-and-leadership", "external"],
  ["courses", "unknown-course", "external"],
  ["courses", HRBA_LEGACY_COURSE_SLUG],
  ["courses", HRBA_LEGACY_COURSE_SLUG, "feedback"],
  ["courses", HRBA_LEGACY_COURSE_SLUG, "final-test"],
  ["courses", HRBA_LEGACY_COURSE_SLUG, "external", "unexpected"],
  ["courses", HRBA_LEGACY_COURSE_SLUG.toUpperCase(), "external"],
]) {
  assert.equal(
    getHrbaLegacyLearnerLaunchRedirect(unrelatedSegments),
    null,
    `Unrelated route must not be rewritten: ${unrelatedSegments.join("/")}`,
  );
}

assert.ok(canonicalRedirect, "The exact legacy launch route must have a destination.");
assert.doesNotMatch(
  canonicalRedirect,
  /[?#]|launch[-_]?token|search[-_]?params/i,
  "The canonical redirect must not contain a query string, fragment, launch token, or search parameter.",
);

console.log(
  "[direct helper assertions] Exact legacy recognition, canonical stability, unrelated and unknown slug stability, non-launch rejection, extra-segment rejection, loop prevention, and query-free destination passed.",
);

const learnerRoute = readFileSync(
  "src/app/(learn)/learn/[[...segments]]/page.tsx",
  "utf8",
);
const helperSource = readFileSync("src/lib/hrba-learner-route.ts", "utf8");
const externalCourseWorkflow = readFileSync(
  "src/lib/external-course-workflow.ts",
  "utf8",
);
const sessionLookupIndex = learnerRoute.indexOf("await getCurrentSession()");
const authGuardIndex = learnerRoute.indexOf("if (!session)");
const roleGuardIndex = learnerRoute.indexOf("if (!canAccessPath(session, actualRoute))");
const compatibilityRedirectIndex = learnerRoute.indexOf(
  "getHrbaLegacyLearnerLaunchRedirect(segments)",
);
const compatibilityRedirectExecutionIndex = learnerRoute.indexOf(
  "redirect(hrbaLegacyLaunchRedirect)",
);
const managedLaunchHandlingIndex = learnerRoute.indexOf(
  "if (\n    managedExternalState &&",
);
const launchLookupIndex = learnerRoute.indexOf(
  "getExternalCourseLaunchData(segments[1], session)",
);

assert.ok(sessionLookupIndex >= 0, "The learner route must retain session authentication.");
assert.ok(
  authGuardIndex > sessionLookupIndex,
  "The learner route must enforce its authentication gate after session lookup.",
);
assert.ok(roleGuardIndex > authGuardIndex, "The learner route must retain its role gate.");
assert.ok(
  compatibilityRedirectIndex > roleGuardIndex,
  "Legacy canonicalization must not bypass authentication or route authorization.",
);
assert.ok(
  compatibilityRedirectExecutionIndex > compatibilityRedirectIndex,
  "The compatibility helper result must drive a Next.js redirect.",
);
assert.ok(
  managedLaunchHandlingIndex > compatibilityRedirectExecutionIndex,
  "Legacy canonicalization must occur before managed external-course launch handling.",
);
assert.ok(
  launchLookupIndex > compatibilityRedirectIndex,
  "Legacy canonicalization must occur before the existing launch lookup.",
);
assert.equal(
  [...learnerRoute.matchAll(/getHrbaLegacyLearnerLaunchRedirect\(([^)]*)\)/g)]
    .map((match) => match[1].trim())
    .join(","),
  "segments",
  "The route must invoke the helper exactly once and pass only path segments.",
);
assert.doesNotMatch(
  helperSource,
  /searchParams|headers\(|cookies\(|launch[-_]?token|console\.|process\.env/i,
  "The helper must not consume query values, headers, cookies, tokens, logs, or environment state.",
);

const publicCourseRoute = readFileSync(
  "src/app/(public)/courses/[[...segments]]/page.tsx",
  "utf8",
);
assert.match(
  publicCourseRoute,
  /`\/learn\/courses\/\$\{course\.slug\}\/external`/,
  "Public course-detail route construction must remain intact.",
);
assert.match(
  learnerRoute,
  /if \(!launchData\) \{\s*notFound\(\);\s*\}/,
  "The canonical launch route must keep the existing fail-closed launch behavior.",
);

const launchWorkflowIndex = externalCourseWorkflow.indexOf(
  "export async function getExternalCourseLaunchData",
);
const entitlementIndex = externalCourseWorkflow.indexOf(
  "hasLearnerCourseEntitlement({",
  launchWorkflowIndex,
);
const enrollmentMutationIndex = externalCourseWorkflow.indexOf(
  "prisma.enrollment.upsert({",
  launchWorkflowIndex,
);
const launchTokenCreationIndex = externalCourseWorkflow.indexOf(
  "createExternalCourseLaunchToken()",
  launchWorkflowIndex,
);
const launchContextPersistenceIndex = externalCourseWorkflow.indexOf(
  "prisma.externalCourseLaunchToken.create({",
  launchWorkflowIndex,
);

assert.ok(launchWorkflowIndex >= 0, "The canonical external-course launch workflow must exist.");
assert.ok(
  entitlementIndex > launchWorkflowIndex,
  "The canonical launch workflow must retain entitlement validation.",
);
assert.ok(
  enrollmentMutationIndex > entitlementIndex,
  "Entitlement validation must occur before enrollment mutation.",
);
assert.ok(
  launchTokenCreationIndex > entitlementIndex,
  "Entitlement validation must occur before launch-token creation.",
);
assert.ok(
  launchContextPersistenceIndex > launchTokenCreationIndex,
  "Launch context must be persisted only after entitlement validation and token creation.",
);

console.log(
  "[static source assertions] package script, authentication/role ordering, redirect ordering, path-only helper input, fail-closed lookup, public action stability, and entitlement-before-mutation ordering passed.",
);
console.log(
  "[scope note] Authentication, authorization, entitlement, and Next.js redirect checks above are static source assertions, not runtime request proofs.",
);
console.log("HRBA legacy learner-route verification passed.");
