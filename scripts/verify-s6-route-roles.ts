import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { UserStatus } from "../src/generated/prisma/enums";
import {
  canAccessAdmin,
  canAccessCreator,
  canAccessLearner,
  canAccessMonitoring,
  canAccessPath,
  canAccessReview,
  isProtectedPath,
} from "../src/lib/auth/permissions";
import { buildAuthSessionFromHubUser } from "../src/lib/auth/hub-session";
import type { AuthSession } from "../src/lib/auth/session-codec";
import type { RoleKey } from "../src/lib/auth/roles";

function sessionFor(roles: RoleKey[]): AuthSession {
  return {
    email: `${roles.join("-").toLowerCase() || "empty"}@example.test`,
    issuedAt: "2026-07-06T00:00:00.000Z",
    name: "Verification User",
    roles,
    userId: `verify-${roles.join("-").toLowerCase() || "empty"}`,
  };
}

function readSource(path: string) {
  return readFileSync(path, "utf8");
}

const participant = sessionFor(["PARTICIPANT"]);
const meViewer = sessionFor(["ME_VIEWER"]);
const creator = sessionFor(["COURSE_CREATOR"]);
const reviewer = sessionFor(["COURSE_REVIEWER"]);
const superAdmin = sessionFor(["SUPER_ADMIN"]);
const platformAdmin = sessionFor(["PLATFORM_ADMIN"]);
const noRoles = sessionFor([]);

for (const pathname of ["/learn", "/creator", "/admin", "/admin/monitoring"]) {
  assert.equal(isProtectedPath(pathname), true, `${pathname} should be protected`);
  assert.equal(canAccessPath(null, pathname), false, `${pathname} should fail closed`);
}

assert.equal(canAccessLearner(participant), true);
assert.equal(canAccessPath(participant, "/learn"), true);
assert.equal(canAccessCreator(participant), false);
assert.equal(canAccessPath(participant, "/creator"), false);
assert.equal(canAccessAdmin(participant), false);
assert.equal(canAccessPath(participant, "/admin"), false);
assert.equal(canAccessPath(participant, "/admin/monitoring"), false);

assert.equal(canAccessMonitoring(meViewer), true);
assert.equal(canAccessPath(meViewer, "/admin/monitoring"), true);
assert.equal(canAccessPath(meViewer, "/admin/pilot-monitoring"), true);
assert.equal(canAccessAdmin(meViewer), false);
assert.equal(canAccessPath(meViewer, "/admin"), false);
assert.equal(canAccessPath(meViewer, "/admin/users"), false);
assert.equal(canAccessCreator(meViewer), false);
assert.equal(canAccessPath(meViewer, "/creator"), false);

assert.equal(canAccessCreator(creator), true);
assert.equal(canAccessPath(creator, "/creator"), true);
assert.equal(canAccessAdmin(creator), false);
assert.equal(canAccessPath(creator, "/admin"), false);

assert.equal(canAccessReview(reviewer), true);
assert.equal(canAccessPath(reviewer, "/admin/review"), true);
assert.equal(canAccessAdmin(reviewer), false);
assert.equal(canAccessPath(reviewer, "/admin"), false);
assert.equal(canAccessPath(reviewer, "/admin/users"), false);

for (const adminSession of [superAdmin, platformAdmin]) {
  assert.equal(canAccessAdmin(adminSession), true);
  assert.equal(canAccessPath(adminSession, "/admin"), true);
  assert.equal(canAccessPath(adminSession, "/admin/users"), true);
  assert.equal(canAccessPath(adminSession, "/admin/monitoring"), true);
  assert.equal(canAccessPath(adminSession, "/admin/pilot-monitoring"), true);
  assert.equal(canAccessPath(adminSession, "/admin/review"), true);
}

assert.equal(canAccessPath(noRoles, "/learn"), false);
assert.equal(canAccessPath(noRoles, "/creator"), false);
assert.equal(canAccessPath(noRoles, "/admin"), false);

const linkedSupabaseUser = buildAuthSessionFromHubUser(
  {
    authProviderId: "supabase-user-id",
    email: "linked@example.test",
    fullName: "Linked Learner",
    id: "hub-user-id",
    roleAssignments: [
      {
        isActive: true,
        role: { key: "PARTICIPANT" },
      },
    ],
    status: UserStatus.ACTIVE,
  },
  "2026-07-06T00:00:00.000Z",
);
assert.equal(linkedSupabaseUser.success, true);
assert.equal(linkedSupabaseUser.success && linkedSupabaseUser.session.userId, "hub-user-id");

const inactiveSupabaseUser = buildAuthSessionFromHubUser(
  {
    authProviderId: "supabase-user-id",
    email: "inactive@example.test",
    fullName: "Inactive Learner",
    id: "hub-user-id",
    roleAssignments: [
      {
        isActive: true,
        role: { key: "PARTICIPANT" },
      },
    ],
    status: UserStatus.SUSPENDED,
  },
  "2026-07-06T00:00:00.000Z",
);
assert.deepEqual(inactiveSupabaseUser, {
  code: "inactive-user",
  success: false,
});

const missingRolesSupabaseUser = buildAuthSessionFromHubUser(
  {
    authProviderId: "supabase-user-id",
    email: "missing-roles@example.test",
    fullName: "Missing Roles",
    id: "hub-user-id",
    roleAssignments: [
      {
        isActive: false,
        role: { key: "PARTICIPANT" },
      },
    ],
    status: UserStatus.ACTIVE,
  },
  "2026-07-06T00:00:00.000Z",
);
assert.deepEqual(missingRolesSupabaseUser, {
  code: "missing-roles",
  success: false,
});

const authServer = readSource("src/lib/auth/server.ts");
assert.match(authServer, /linkEmailFallback: false/);
assert.match(authServer, /return sessionResult\.success \? sessionResult\.session : null/);

const hubSession = readSource("src/lib/auth/hub-session.ts");
assert.match(hubSession, /where: \{ authProviderId: input\.supabaseUserId \}/);
assert.match(hubSession, /return \{ code: "hub-profile-missing", success: false \}/);

const learnerPage = readSource("src/app/(learn)/learn/[[...segments]]/page.tsx");
const creatorPage = readSource("src/app/(creator)/creator/[[...segments]]/page.tsx");
const adminPage = readSource("src/app/(admin)/admin/[[...segments]]/page.tsx");

for (const pageSource of [learnerPage, creatorPage, adminPage]) {
  assert.match(pageSource, /getCurrentSession\(\)/);
  assert.match(pageSource, /redirect\(`\/sign-in\?next=\$\{encodeURIComponent\(actualRoute\)\}`\)/);
  assert.match(pageSource, /redirect\(`\/unauthorized\?from=\$\{encodeURIComponent\(actualRoute\)\}`\)/);
  assert.match(pageSource, /canAccessPath\(session, actualRoute\)/);
}

const hardenedSources = [
  "src/app/(learn)/learn/[[...segments]]/page.tsx",
  "src/lib/learner-actions.ts",
  "src/lib/learner-profile-workflow.ts",
  "src/lib/certificate-workflow.ts",
  "src/lib/course-data.ts",
  "src/lib/feedback-workflow.ts",
  "src/lib/upload-security.ts",
  "src/lib/creator-course-workflow.ts",
  "src/lib/creator-materials-workflow.ts",
  "src/lib/creator-preview-data.ts",
  "src/lib/build-studio-data.ts",
  "src/lib/build-studio-actions.ts",
  "src/lib/review-workflow.ts",
];

for (const path of hardenedSources) {
  assert.doesNotMatch(
    readSource(path),
    /where:\s*\{\s*email:\s*session\.email/,
    `${path} should not join the authenticated Hub user by session.email`,
  );
}

console.log("S6 route and role-boundary verification passed.");
