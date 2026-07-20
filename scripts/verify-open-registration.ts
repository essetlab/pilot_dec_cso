import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildOpenRegistrationUserCreateData,
  normalizeOpenRegistrationEmail,
} from "../src/lib/open-registration-workflow";

function source(path: string) {
  return readFileSync(path, "utf8");
}

assert.equal(normalizeOpenRegistrationEmail("  LEARNER@Example.org "), "learner@example.org");
const data = buildOpenRegistrationUserCreateData({
  authProvider: "supabase",
  authProviderId: "auth-user-id",
  email: "learner@example.org",
  fullName: "Fictional Learner",
  jobTitle: "Programme officer",
  preferredLanguage: "English",
  region: "Amhara",
  selfReportedOrganizationName: "Self-reported CSO",
});
assert.equal(data.organizationId, null);
assert.equal(data.selfReportedOrganizationName, "Self-reported CSO");
assert.equal(data.passwordHash, null);

const action = source("src/app/(auth)/register/actions.ts");
const page = source("src/app/(auth)/register/page.tsx");
const workflow = source("src/lib/open-registration-workflow.ts");
for (const current of [action, page, workflow]) {
  assert.doesNotMatch(current, /PILOT_ACCESS_CODE|PILOT_ACCESS_CODES|PILOT_INVITED_EMAILS|PILOT_REGISTRATION_MODE/);
  assert.doesNotMatch(current, /OnboardingInvitation|onboardingInvitation/);
}
assert.doesNotMatch(action, /accessCode/);
assert.match(action, /open-register:\$\{email\}/);
assert.match(action, /value\.startsWith\("\/"\)/);
assert.match(action, /!value\.startsWith\("\/\/"\)/);
assert.match(workflow, /selfReportedOrganizationName/);
assert.match(workflow, /organizationId: null/);
assert.doesNotMatch(workflow, /organization\.(create|upsert|findFirst|findUnique)/);
assert.match(workflow, /registration-not-completed/);
assert.match(workflow, /consentAcknowledged: true/);
assert.match(page, /Create your CSO Learning Hub account/);
assert.match(page, /does not grant access/);
assert.match(page, /Select your region/);
assert.match(page, /Preferred language/);

const migration = source(
  "prisma/migrations-postgres/20260720070000_open_registration_self_reported_organization/migration.sql",
);
assert.match(migration, /ADD COLUMN "selfReportedOrganizationName" TEXT/);
assert.doesNotMatch(migration, /DROP|DELETE|TRUNCATE|CREATE TABLE/i);

console.log("Open registration source verification passed.");
