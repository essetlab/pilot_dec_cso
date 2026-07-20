import fs from "node:fs";
import path from "node:path";

import {
  isConfiguredPilotEmail,
  isPilotAccessCodeValid,
  resolvePilotRegistrationMode,
} from "../src/lib/pilot-registration-config";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const strictEnvironment = {
  PILOT_ACCESS_CODE: "  Pilot-Code-2026  ",
  PILOT_INVITED_EMAILS: " Invited.One@Example.org, invited.two@example.org ",
  PILOT_REGISTRATION_MODE: " STRICT ",
};

const strictMode = resolvePilotRegistrationMode(strictEnvironment);
assert(strictMode.mode === "strict", "Expected normalized strict mode.");
assert(
  strictMode.label === "Strict invited-email and access-code mode",
  "Expected the learner-facing strict-mode label.",
);
assert(
  isConfiguredPilotEmail("  INVITED.ONE@example.org ", strictEnvironment),
  "Expected invited-email normalization.",
);
assert(
  !isConfiguredPilotEmail("uninvited@example.org", strictEnvironment),
  "Expected an uninvited email to be denied.",
);
assert(
  !isConfiguredPilotEmail("", strictEnvironment) &&
    !isConfiguredPilotEmail("malformed-email", strictEnvironment),
  "Expected empty and malformed input emails to be denied.",
);
assert(
  isPilotAccessCodeValid(" pilot-code-2026 ", strictEnvironment),
  "Expected access-code normalization.",
);
assert(
  !isPilotAccessCodeValid("incorrect-code", strictEnvironment),
  "Expected an incorrect access code to be denied.",
);

const simpleMode = resolvePilotRegistrationMode({
  PILOT_REGISTRATION_MODE: " simple ",
});
assert(simpleMode.mode === "simple", "Expected explicit simple mode.");
assert(simpleMode.label === "Simple access-code mode", "Expected the simple-mode label.");

const defaultMode = resolvePilotRegistrationMode({});
assert(defaultMode.mode === "simple", "Expected missing mode to retain the simple default.");

for (const environment of [
  { PILOT_REGISTRATION_MODE: "strict" },
  { PILOT_INVITED_EMAILS: "", PILOT_REGISTRATION_MODE: "strict" },
  { PILOT_INVITED_EMAILS: "not-an-email", PILOT_REGISTRATION_MODE: "strict" },
  { PILOT_INVITED_EMAILS: "invited@example.org", PILOT_REGISTRATION_MODE: "unexpected" },
]) {
  const resolution = resolvePilotRegistrationMode(environment);
  assert(resolution.mode === "unavailable", "Expected invalid configuration to fail closed.");
  assert(
    resolution.label === "Registration temporarily unavailable",
    "Expected the unavailable-mode label.",
  );
}

const repositoryRoot = process.cwd();
const registerPage = fs.readFileSync(
  path.join(repositoryRoot, "src/app/(auth)/register/page.tsx"),
  "utf8",
);
const workflow = fs.readFileSync(
  path.join(repositoryRoot, "src/lib/pilot-registration-workflow.ts"),
  "utf8",
);

assert(
  registerPage.includes('export const dynamic = "force-dynamic"'),
  "Expected registration mode to be evaluated per request.",
);
assert(
  registerPage.includes("resolvePilotRegistrationMode()"),
  "Expected the registration UI to use the shared mode resolver.",
);
assert(
  workflow.includes("resolvePilotRegistrationMode()"),
  "Expected server registration enforcement to use the shared mode resolver.",
);
assert(
  !registerPage.includes("PILOT_INVITED_EMAILS"),
  "The registration page must not read or expose the invited-email allowlist.",
);

console.log("Pilot registration mode verification passed.");
