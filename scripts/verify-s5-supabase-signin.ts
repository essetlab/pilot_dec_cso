import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { UserStatus } from "../src/generated/prisma/enums";
import { buildAuthSessionFromHubUser } from "../src/lib/auth/hub-session";
import { readSupabasePublicConfig } from "../src/lib/supabase/config";

const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function restoreEnv() {
  if (originalSupabaseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
  }

  if (originalSupabaseKey === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalSupabaseKey;
  }
}

function readSource(path: string) {
  return readFileSync(path, "utf8");
}

try {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  assert.equal(readSupabasePublicConfig(), null);

  process.env.NEXT_PUBLIC_SUPABASE_URL = "[supabase-project-url]";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "[supabase-publishable-key]";
  assert.equal(readSupabasePublicConfig(), null);

  process.env.NEXT_PUBLIC_SUPABASE_URL = "ftp://example.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-test-key";
  assert.equal(readSupabasePublicConfig(), null);

  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-test-key";
  assert.deepEqual(readSupabasePublicConfig(), {
    publishableKey: "publishable-test-key",
    url: "https://example.supabase.co",
  });

  const mappedSession = buildAuthSessionFromHubUser(
    {
      authProviderId: "supabase-user-id",
      email: "learner@example.org",
      fullName: "Pilot Learner",
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

  assert.equal(mappedSession.success, true);
  assert.equal(mappedSession.success && mappedSession.linkedBy, "authProviderId");
  assert.deepEqual(
    mappedSession.success && mappedSession.session,
    {
      email: "learner@example.org",
      issuedAt: "2026-07-06T00:00:00.000Z",
      name: "Pilot Learner",
      roles: ["PARTICIPANT"],
      userId: "hub-user-id",
    },
  );

  const missingRoles = buildAuthSessionFromHubUser(
    {
      authProviderId: "supabase-user-id",
      email: "learner@example.org",
      fullName: "Pilot Learner",
      id: "hub-user-id",
      roleAssignments: [],
      status: UserStatus.ACTIVE,
    },
    "2026-07-06T00:00:00.000Z",
  );

  assert.deepEqual(missingRoles, {
    code: "missing-roles",
    success: false,
  });

  const inactiveUser = buildAuthSessionFromHubUser(
    {
      authProviderId: "supabase-user-id",
      email: "learner@example.org",
      fullName: "Pilot Learner",
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

  assert.deepEqual(inactiveUser, {
    code: "inactive-user",
    success: false,
  });

  const signInActions = readSource("src/app/(auth)/sign-in/actions.ts");
  assert.match(signInActions, /readSupabasePublicConfig\(\)/);
  assert.match(signInActions, /signInWithPassword/);
  assert.match(signInActions, /resolveSupabaseHubSession/);
  assert.match(signInActions, /supabase\.auth\.signOut\(\)/);
  assert.match(signInActions, /clearCurrentSession\(\)/);
  assert.match(signInActions, /verifyPassword/);

  const authServer = readSource("src/lib/auth/server.ts");
  assert.match(authServer, /supabase\.auth\.getUser\(\)/);
  assert.match(authServer, /linkEmailFallback: false/);
  assert.match(authServer, /parseSessionCookieValue/);

  const hubSession = readSource("src/lib/auth/hub-session.ts");
  assert.match(hubSession, /where: \{ authProviderId: input\.supabaseUserId \}/);
  assert.match(hubSession, /code: "hub-profile-missing"/);
  assert.match(hubSession, /authProvider: "supabase"/);

  const signOutRoute = readSource("src/app/(auth)/sign-out/route.ts");
  assert.match(signOutRoute, /supabase\.auth\.signOut\(\)/);
  assert.match(signOutRoute, /clearCurrentSession\(\)/);

  console.log("S5 Supabase sign-in verification passed.");
} finally {
  restoreEnv();
}
