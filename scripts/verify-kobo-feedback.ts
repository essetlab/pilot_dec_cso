import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const learnerMyCourses = readFileSync(
  "src/components/learner/LearnerMyCourses.tsx",
  "utf8",
);

assert.match(
  learnerMyCourses,
  /const HRBA_PILOT_FEEDBACK_URL = "https:\/\/ee\.kobotoolbox\.org\/x\/8Plk5gtY"/,
);
assert.match(learnerMyCourses, /slug === HRBA_EXTERNAL_COURSE_SLUG/);
assert.match(
  learnerMyCourses,
  /isCertificateIssued \|\| statusLabel === "Completed"/,
);
assert.match(learnerMyCourses, /target="_blank"/);
assert.match(learnerMyCourses, /rel="noopener noreferrer"/);
assert.doesNotMatch(learnerMyCourses, /HRBA_PILOT_FEEDBACK_URL.*learner/i);

console.log(
  "Kobo feedback verification passed: completion-only HRBA action uses the authoritative anonymous external URL.",
);
