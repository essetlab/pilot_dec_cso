import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.join(import.meta.dirname, "..");
const framePath = path.join(
  projectRoot,
  "src",
  "components",
  "learner",
  "ExternalCourseFrame.tsx",
);
const pagePath = path.join(
  projectRoot,
  "src",
  "app",
  "(learn)",
  "learn",
  "[[...segments]]",
  "page.tsx",
);

const frame = fs.readFileSync(framePath, "utf8");
const page = fs.readFileSync(pagePath, "utf8");

console.log("=== Verification: Focused external-course learning view ===");

for (const learnerFacingTechnicalCopy of [
  "EXTERNAL COURSE CONTENT",
  "External Course Content",
  "COURSE APP",
  "Course app",
  "Interactive HRBA learning experience",
  "secure embedded frame",
  "completion signal",
  "Portal progress",
  "Open course in new tab",
  "Reload course",
  "Back to My Courses",
]) {
  assert.equal(
    frame.includes(learnerFacingTechnicalCopy),
    false,
    `learner view must not contain: ${learnerFacingTechnicalCopy}`,
  );
}

assert.match(frame, /Back to My Learning/);
assert.match(frame, /Course progress/);
assert.match(frame, /Progress saves automatically/);
assert.match(frame, /Exit Course/);
assert.match(frame, /h-dvh/);
assert.match(frame, /min-h-0 flex-1 overflow-hidden/);
assert.match(frame, /className={`block h-full min-h-0 w-full border-0/);
assert.doesNotMatch(frame, /href=\{launchData\.iframeSrc\}/);

const externalRouteStart = page.lastIndexOf('segments[2] === "external"');
assert.notEqual(externalRouteStart, -1, "authenticated external route must remain present");
const externalRoute = page.slice(externalRouteStart, page.indexOf('segments[2] === "final-test"', externalRouteStart));
assert.match(externalRoute, /return <ExternalCourseFrame launchData=\{launchData\} \/>;/);
assert.doesNotMatch(externalRoute, /CoursePlayerShell/);

assert.match(
  frame,
  /sandbox="allow-downloads allow-forms allow-popups allow-same-origin allow-scripts"/,
);
assert.match(frame, /src=\{launchData\.iframeSrc\}/);
assert.match(frame, /isTrustedExternalCourseMessageEvent\(/);
assert.match(frame, /courseFrame\.current\?\.contentWindow/);
assert.match(frame, /launchData\.allowedOrigin/);
assert.match(frame, /EXTERNAL_COURSE_LAUNCH_CONTEXT_MESSAGE/);
assert.match(frame, /learnerStateKey: launchData\.learnerStateKey/);
assert.match(frame, /launchToken: launchData\.launchToken/);
assert.match(frame, /fetch\("\/api\/external-course-progress"/);
assert.match(frame, /credentials: "same-origin"/);

console.log("PASS: learner-facing technical language and redundant controls are absent.");
console.log("PASS: the responsive shell uses the full remaining dynamic viewport.");
console.log("PASS: iframe, bridge, launch-context, and persistence safeguards remain present.");
console.log("ALL FOCUSED EXTERNAL-COURSE VIEW VERIFICATIONS PASSED.");
