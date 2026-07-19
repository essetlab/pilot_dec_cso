import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { OrganizationStatus, UserStatus } from "../src/generated/prisma/enums";
import { activeRoleKeys, canUsePilotAccount } from "../src/lib/auth/hub-session";

function source(path: string) {
  return readFileSync(path, "utf8");
}

assert.equal(canUsePilotAccount({
  organizationStatus: OrganizationStatus.ACTIVE,
  roles: ["PARTICIPANT"],
  status: UserStatus.ACTIVE,
}), true);

for (const status of [UserStatus.INVITED, UserStatus.SUSPENDED, UserStatus.DEACTIVATED]) {
  assert.equal(canUsePilotAccount({
    organizationStatus: OrganizationStatus.ACTIVE,
    roles: ["PARTICIPANT"],
    status,
  }), false, `${status} learners must be blocked`);
}

for (const organizationStatus of [OrganizationStatus.INACTIVE, OrganizationStatus.ARCHIVED]) {
  assert.equal(canUsePilotAccount({
    organizationStatus,
    roles: ["PARTICIPANT"],
    status: UserStatus.ACTIVE,
  }), false, `Learners in ${organizationStatus} organizations must be blocked`);
}

assert.deepEqual(activeRoleKeys([
  { expiresAt: new Date(Date.now() - 60_000), isActive: true, role: { key: "PARTICIPANT" } },
  { expiresAt: null, isActive: true, role: { key: "CSO_FOCAL_PERSON" } },
  { expiresAt: null, isActive: false, role: { key: "PLATFORM_ADMIN" } },
]), ["CSO_FOCAL_PERSON"]);

const registration = source("src/lib/pilot-registration-workflow.ts");
assert.doesNotMatch(registration, /organization\.upsert/);
assert.match(registration, /status: OrganizationStatus\.ACTIVE/);
assert.match(registration, /organization-not-approved/);
assert.match(registration, /registration-not-completed/);
assert.match(registration, /process\.env\.NODE_ENV === "production" \? ""/);

const authServer = source("src/lib/auth/server.ts");
assert.match(authServer, /if \(readSupabasePublicConfig\(\)\)/);
assert.match(authServer, /return sessionResult\.success \? sessionResult\.session : null/);

const recoveryRequest = source("src/app/(auth)/forgot-password/actions.ts");
assert.match(recoveryRequest, /resetPasswordForEmail/);
assert.match(recoveryRequest, /password-reset:/);
assert.match(recoveryRequest, /redirect\("\/forgot-password\?notice=sent"\)/);

const recoveryUpdate = source("src/app/(auth)/reset-password/actions.ts");
assert.match(recoveryUpdate, /validatePasswordPolicy/);
assert.match(recoveryUpdate, /supabase\.auth\.updateUser\(\{ password \}\)/);
assert.match(recoveryUpdate, /supabase\.auth\.signOut\(\)/);

const authCallback = source("src/app/(auth)/auth/callback/route.ts");
assert.match(authCallback, /exchangeCodeForSession/);
assert.match(authCallback, /invalid-link/);

const externalCourse = source("src/lib/external-course-workflow.ts");
assert.match(externalCourse, /user\.status !== UserStatus\.ACTIVE/);
assert.match(externalCourse, /organization\?\.status !== OrganizationStatus\.ACTIVE/);
assert.match(externalCourse, /tokenRecord\.userId !== user\.id/);
assert.match(externalCourse, /enrollment\.userId !== user\.id/);

const schema = source("prisma/schema.prisma");
assert.match(schema, /@@unique\(\[userId, courseVersionId\]\)/);
assert.match(schema, /@@unique\(\[enrollmentId, lessonId\]\)/);

const adminPeople = source("src/lib/admin-people-workflow.ts");
assert.match(adminPeople, /status: UserStatus\.ACTIVE/);
assert.match(adminPeople, /RoleKey\.SUPER_ADMIN, RoleKey\.PLATFORM_ADMIN/);
assert.match(adminPeople, /previousOrganizationId/);
assert.match(adminPeople, /previousStatus/);

console.log("P2D controlled onboarding and access verification passed.");
