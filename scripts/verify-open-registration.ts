import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildRegistrationConfirmationUrl,
  buildOpenRegistrationUserCreateData,
  createSupabaseSignupIdentity,
  normalizeOpenRegistrationEmail,
} from "../src/lib/open-registration-workflow";

function source(path: string) {
  return readFileSync(path, "utf8");
}

async function main() {

assert.equal(normalizeOpenRegistrationEmail("  LEARNER@Example.org "), "learner@example.org");
assert.equal(
  buildRegistrationConfirmationUrl(
    "https://hub.example.org",
    "fictional-token-hash",
    "/course-invitations/accept?token=secure-token",
  ),
  "https://hub.example.org/auth/confirm?token_hash=fictional-token-hash&type=signup&next=%2Fcourse-invitations%2Faccept%3Ftoken%3Dsecure-token",
);
assert.equal(
  buildRegistrationConfirmationUrl(
    "https://hub.example.org",
    "fictional-token-hash",
    "//attacker.example",
  ),
  "https://hub.example.org/auth/confirm?token_hash=fictional-token-hash&type=signup&next=%2Fsign-in%3Fnotice%3Demail-confirmed",
);

const signupCalls: Array<Record<string, string>> = [];
let confirmationUrl = "";
let deletedUserId = "";
const created = await createSupabaseSignupIdentity(
  {
    authOrigin: "https://hub.example.org",
    confirmationNextPath: "/course-invitations/accept?token=secure-token",
    email: "invited.learner@example.org",
    password: "LearnerPassword2026",
  },
  {
    deleteUser: async (userId) => {
      deletedUserId = userId;
      return { error: null };
    },
    generateSignupLink: async (input) => {
      signupCalls.push(input);
      return {
        data: {
          properties: { hashed_token: "fictional-token-hash" },
          user: { id: "auth-user-id" },
        },
        error: null,
      };
    },
    sendConfirmationEmail: async (input) => {
      confirmationUrl = input.confirmationUrl;
      return { delivered: true };
    },
  },
);
assert.deepEqual(created, {
  emailConfirmationRequired: true,
  provider: "supabase",
  success: true,
  userId: "auth-user-id",
});
assert.deepEqual(signupCalls, [
  {
    email: "invited.learner@example.org",
    password: "LearnerPassword2026",
    redirectTo: "https://hub.example.org/auth/confirm",
  },
]);
assert.equal(deletedUserId, "");
const confirmation = new URL(confirmationUrl);
assert.equal(confirmation.pathname, "/auth/confirm");
assert.equal(confirmation.searchParams.get("token_hash"), "fictional-token-hash");
assert.equal(confirmation.searchParams.get("type"), "signup");
assert.equal(
  confirmation.searchParams.get("next"),
  "/course-invitations/accept?token=secure-token",
);

let duplicateDeliveryAttempted = false;
const duplicate = await createSupabaseSignupIdentity(
  {
    authOrigin: "https://hub.example.org",
    email: "existing.learner@example.org",
    password: "LearnerPassword2026",
  },
  {
    deleteUser: async () => ({ error: null }),
    generateSignupLink: async () => ({
      data: null,
      error: { message: "User already registered", name: "AuthApiError" },
    }),
    sendConfirmationEmail: async () => {
      duplicateDeliveryAttempted = true;
      return { delivered: true };
    },
  },
);
assert.deepEqual(duplicate, {
  code: "registration-not-completed",
  provider: "supabase",
  success: false,
});
assert.equal(duplicateDeliveryAttempted, false);

let failedSignupCleanup = "";
const failedDelivery = await createSupabaseSignupIdentity(
  {
    authOrigin: "https://hub.example.org",
    confirmationNextPath: "/course-invitations/accept?token=still-pending",
    email: "delivery.failure@example.org",
    password: "LearnerPassword2026",
  },
  {
    deleteUser: async (userId) => {
      failedSignupCleanup = userId;
      return { error: null };
    },
    generateSignupLink: async () => ({
      data: {
        properties: { hashed_token: "cleanup-token-hash" },
        user: { id: "cleanup-auth-user-id" },
      },
      error: null,
    }),
    sendConfirmationEmail: async () => ({ delivered: false }),
  },
);
assert.deepEqual(failedDelivery, {
  code: "supabase-registration-failed",
  provider: "supabase",
  success: false,
});
assert.equal(failedSignupCleanup, "cleanup-auth-user-id");
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
const confirmationRoute = source("src/app/(auth)/auth/confirm/route.ts");
const signInAction = source("src/app/(auth)/sign-in/actions.ts");
const signOutRoute = source("src/app/(auth)/sign-out/route.ts");
const adminPeopleWorkflow = source("src/lib/admin-people-workflow.ts");
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
assert.match(
  action,
  /DATABASE_CONNECTIVITY_ERROR_CODES[\s\S]*"P1003"[\s\S]*DATABASE_CONNECTIVITY_ERROR_CODES\.has\(errorCode\)[\s\S]*\? "service-unavailable"/,
);
assert.match(workflow, /selfReportedOrganizationName/);
assert.match(workflow, /organizationId: null/);
assert.doesNotMatch(workflow, /organization\.(create|upsert|findFirst|findUnique)/);
assert.match(workflow, /registration-not-completed/);
assert.doesNotMatch(workflow, /HRBA_EXTERNAL_COURSE_ID|HRBA_EXTERNAL_COURSE_VERSION_ID/);
assert.doesNotMatch(workflow, /tx\.courseAssignment\.(create|upsert)/);
assert.match(workflow, /registrationChannel: input\.registrationChannel/);
assert.match(action, /registrationChannel = "course-invitation"/);
assert.doesNotMatch(action, /activateCourseInvitation|course-invitations\/activate/);
assert.doesNotMatch(workflow, /activateCourseInvitation|course-invitations\/activate/);
assert.match(confirmationRoute, /auth\.verifyOtp/);
assert.match(confirmationRoute, /type: "signup"/);
assert.match(confirmationRoute, /safeNextPath/);
assert.match(signInAction, /auth\.signInWithPassword/);
assert.match(signInAction, /resolveSupabaseHubSession/);
assert.match(signOutRoute, /auth\.signOut/);
assert.match(signOutRoute, /clearCurrentSession/);
assert.match(workflow, /consentAcknowledged: true/);
assert.match(adminPeopleWorkflow, /selfReportedOrganizationName: true/);
assert.match(
  adminPeopleWorkflow,
  /cleanPresentationText\(selfReportedOrganizationName\)/,
);
assert.match(page, /Create your account/);
assert.match(page, /Registration includes access to available courses\./);
assert.match(
  page,
  /Please note that some courses may require invitation or assignment from DEC\./,
);
assert.match(page, /Select your region/);
assert.match(page, /Preferred language/);

const migration = source(
  "prisma/migrations-postgres/20260720070000_open_registration_self_reported_organization/migration.sql",
);
assert.match(migration, /ADD COLUMN "selfReportedOrganizationName" TEXT/);
assert.doesNotMatch(migration, /DROP|DELETE|TRUNCATE|CREATE TABLE/i);

console.log("Open registration source verification passed.");
}

void main();
