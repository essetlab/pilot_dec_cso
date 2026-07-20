import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { UserStatus } from "../src/generated/prisma/enums";
import { activeRoleKeys, canUseHubAccount } from "../src/lib/auth/hub-session";

function source(path: string) {
  return readFileSync(path, "utf8");
}

assert.equal(canUseHubAccount({
  organizationStatus: null,
  roles: ["PARTICIPANT"],
  status: UserStatus.ACTIVE,
}), true);
for (const status of [UserStatus.INVITED, UserStatus.SUSPENDED, UserStatus.DEACTIVATED]) {
  assert.equal(canUseHubAccount({ organizationStatus: null, roles: ["PARTICIPANT"], status }), false);
}
assert.deepEqual(activeRoleKeys([
  { expiresAt: new Date(Date.now() - 60_000), isActive: true, role: { key: "PARTICIPANT" } },
  { expiresAt: null, isActive: true, role: { key: "PARTICIPANT" } },
  { expiresAt: null, isActive: false, role: { key: "PLATFORM_ADMIN" } },
]), ["PARTICIPANT"]);

const registration = source("src/lib/open-registration-workflow.ts");
assert.match(registration, /selfReportedOrganizationName/);
assert.match(registration, /organizationId: null/);
assert.doesNotMatch(registration, /PILOT_|onboardingInvitation|OrganizationStatus/);
assert.match(registration, /registration-not-completed/);

const authServer = source("src/lib/auth/server.ts");
assert.match(authServer, /if \(readSupabasePublicConfig\(\)\)/);
assert.match(authServer, /return sessionResult\.success \? sessionResult\.session : null/);

const authCallback = source("src/app/(auth)/auth/callback/route.ts");
assert.match(authCallback, /exchangeCodeForSession/);
assert.match(authCallback, /invalid-link/);

const externalCourse = source("src/lib/external-course-workflow.ts");
assert.match(externalCourse, /user\.status !== UserStatus\.ACTIVE/);
assert.match(externalCourse, /hasLearnerCourseEntitlement/);
assert.match(externalCourse, /tokenRecord\.userId !== user\.id/);
assert.match(externalCourse, /enrollment\.userId !== user\.id/);

const schema = source("prisma/schema.prisma");
assert.match(schema, /selfReportedOrganizationName\s+String\?/);
assert.match(schema, /@@unique\(\[userId, courseVersionId\]\)/);
assert.match(schema, /@@unique\(\[enrollmentId, lessonId\]\)/);

console.log("P2D open registration and restricted-course access verification passed.");
