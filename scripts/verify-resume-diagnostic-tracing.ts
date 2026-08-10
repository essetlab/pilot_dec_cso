import { readFileSync } from "node:fs";
import {
  validateResumeDiagnosticCheckpoint,
} from "../src/lib/external-course-diagnostics";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const diagnostic = validateResumeDiagnosticCheckpoint({
  stageCode: "HUB-4",
  timestamp: "2026-08-10T12:00:00.000Z",
  courseSlug: "applying-human-rights-based-approach-in-cso-practice",
  currentModuleId: "module_01_hrba_foundations",
  currentScreenId: "M1-PLAYER-00",
  baseRevision: "present",
  result: "PASS",
  httpStatus: 200,
  correlationId: "123e4567-e89b-42d3-a456-426614174000",
  learnerStateKey: "must-not-survive",
  resumeState: { answer: "must-not-survive" },
});

assert(diagnostic, "A valid diagnostic checkpoint was rejected.");
assert(
  JSON.stringify(diagnostic) === JSON.stringify({
    stageCode: "HUB-4",
    timestamp: "2026-08-10T12:00:00.000Z",
    courseSlug: "applying-human-rights-based-approach-in-cso-practice",
    currentModuleId: "module_01_hrba_foundations",
    currentScreenId: "M1-PLAYER-00",
    baseRevision: "present",
    result: "PASS",
    httpStatus: 200,
    correlationId: "123e4567-e89b-42d3-a456-426614174000",
  }),
  "The server-log payload was not reduced to the approved diagnostic fields.",
);
assert(
  validateResumeDiagnosticCheckpoint({
    ...diagnostic,
    correlationId: "not-random-launch-id",
  }) === null,
  "An invalid correlation ID was accepted.",
);

const routeSource = readFileSync(
  new URL("../src/app/api/external-course-diagnostic/route.ts", import.meta.url),
  "utf8",
);
assert(
  !routeSource.includes("prisma") &&
    !routeSource.includes("recordExternalCourseProgress"),
  "The diagnostic endpoint must not read or write learner progress.",
);

const frameSource = readFileSync(
  new URL("../src/components/learner/ExternalCourseFrame.tsx", import.meta.url),
  "utf8",
);
for (const stage of ["HUB-1", "HUB-2", "HUB-3", "HUB-4"]) {
  assert(frameSource.includes(`"${stage}"`), `Missing ${stage} checkpoint.`);
}

console.log("PASS: RESUME-8 diagnostic tracing is bounded, sanitized, and no-write.");
