import "dotenv/config";

import { prisma } from "../src/lib/prisma";
import {
  buildPilotLearnerUserCreateData,
  registerPilotLearner,
} from "../src/lib/pilot-registration-workflow";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.local`;
}

async function cleanupUserAndOrg(email: string, organizationName: string) {
  const user = await prisma.user.findUnique({
    select: { id: true },
    where: { email },
  });

  if (user) {
    await prisma.auditLog.deleteMany({ where: { actorUserId: user.id } });
    await prisma.userRoleAssignment.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }

  await prisma.organization.deleteMany({ where: { name: organizationName } });
}

async function main() {
  const participantRoleBefore = await prisma.role.findUnique({
    select: { id: true },
    where: { key: "PARTICIPANT" },
  });
  const originalEnv = {
    invitedEmails: process.env.PILOT_INVITED_EMAILS,
    mode: process.env.PILOT_REGISTRATION_MODE,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    accessCode: process.env.PILOT_ACCESS_CODE,
    accessCodes: process.env.PILOT_ACCESS_CODES,
  };

  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  delete process.env.PILOT_ACCESS_CODES;
  delete process.env.PILOT_REGISTRATION_MODE;
  delete process.env.PILOT_INVITED_EMAILS;
  process.env.PILOT_ACCESS_CODE = "S4-VERIFY-CODE";

  const localEmail = uniqueEmail("s4-local");
  const localOrg = `S4 Local Verification ${Date.now()}`;

  try {
    await prisma.organization.create({
      data: { name: localOrg, region: "Verification", status: "ACTIVE" },
    });

    const localResult = await registerPilotLearner({
      accessCode: "S4-VERIFY-CODE",
      confirmPassword: "StrongPass123",
      consentAccepted: true,
      email: localEmail,
      fullName: "S4 Local Learner",
      jobTitle: "Programme officer",
      learnerType: "participant",
      organizationName: localOrg,
      password: "StrongPass123",
      region: "Verification",
    });

    assert(localResult.success, "Expected local fallback registration to succeed.");
    assert(localResult.authProvider === "local", "Expected local auth provider.");

    const localUser = await prisma.user.findUnique({
      select: {
        authProvider: true,
        authProviderId: true,
        passwordHash: true,
      },
      where: { email: localEmail },
    });

    assert(localUser, "Expected local user to be created.");
    assert(localUser.authProvider === "local", "Expected local user authProvider=local.");
    assert(localUser.authProviderId === null, "Expected local user authProviderId to be null.");
    assert(localUser.passwordHash, "Expected local user passwordHash to be set.");

    const invalidCodeEmail = uniqueEmail("s4-invalid-code");
    const invalidCodeResult = await registerPilotLearner({
      accessCode: "WRONG-CODE",
      confirmPassword: "StrongPass123",
      consentAccepted: true,
      email: invalidCodeEmail,
      fullName: "S4 Invalid Code",
      jobTitle: "Programme officer",
      learnerType: "participant",
      organizationName: "S4 Invalid Code Org",
      password: "StrongPass123",
      region: "Verification",
    });

    assert(!invalidCodeResult.success, "Expected invalid access code to fail.");
    assert(invalidCodeResult.code === "invalid-access-code", "Expected invalid access-code result.");
    assert(
      !(await prisma.user.findUnique({ where: { email: invalidCodeEmail } })),
      "Expected invalid access-code check to avoid user creation.",
    );

    process.env.PILOT_REGISTRATION_MODE = "strict";
    process.env.PILOT_INVITED_EMAILS = "invited-s4@example.local";
    const strictEmail = uniqueEmail("s4-strict");
    const strictResult = await registerPilotLearner({
      accessCode: "S4-VERIFY-CODE",
      confirmPassword: "StrongPass123",
      consentAccepted: true,
      email: strictEmail,
      fullName: "S4 Strict Learner",
      jobTitle: "Programme officer",
      learnerType: "participant",
      organizationName: "S4 Strict Org",
      password: "StrongPass123",
      region: "Verification",
    });

    assert(!strictResult.success, "Expected strict uninvited email to fail.");
    assert(strictResult.code === "email-not-invited", "Expected strict invited-email result.");
    assert(
      !(await prisma.user.findUnique({ where: { email: strictEmail } })),
      "Expected strict invited-email check to avoid user creation.",
    );

    const invitedResult = await registerPilotLearner({
      accessCode: " s4-verify-code ",
      confirmPassword: "StrongPass123",
      consentAccepted: true,
      email: "  INVITED-S4@example.local ",
      fullName: "S4 Invited Learner",
      jobTitle: "Programme officer",
      learnerType: "participant",
      organizationName: "S4 Missing Organization",
      password: "StrongPass123",
      region: "Verification",
    });

    assert(!invitedResult.success, "Expected the nonexistent organization to stop registration.");
    assert(
      invitedResult.code === "organization-not-approved",
      "Expected normalized invited email and access code to pass strict access checks.",
    );

    delete process.env.PILOT_INVITED_EMAILS;
    const unavailableResult = await registerPilotLearner({
      accessCode: "S4-VERIFY-CODE",
      confirmPassword: "StrongPass123",
      consentAccepted: true,
      email: "invited-s4@example.local",
      fullName: "S4 Unavailable Learner",
      jobTitle: "Programme officer",
      learnerType: "participant",
      organizationName: "S4 Missing Organization",
      password: "StrongPass123",
      region: "Verification",
    });
    assert(!unavailableResult.success, "Expected incomplete strict configuration to fail.");
    assert(
      unavailableResult.code === "registration-unavailable",
      "Expected incomplete strict configuration to fail closed.",
    );

    const supabaseUserData = buildPilotLearnerUserCreateData({
      authProvider: "supabase",
      authProviderId: "00000000-0000-4000-8000-000000000000",
      email: "s4-supabase@example.local",
      fullName: "S4 Supabase Learner",
      jobTitle: "Programme officer",
      learnerType: "participant",
      organizationId: "org-s4",
      passwordHash: null,
      region: "Verification",
    });

    assert(supabaseUserData.authProvider === "supabase", "Expected Supabase auth provider.");
    assert(
      supabaseUserData.authProviderId === "00000000-0000-4000-8000-000000000000",
      "Expected Supabase authProviderId to be persisted.",
    );
    assert(supabaseUserData.passwordHash === null, "Expected Supabase user passwordHash to be null.");

    console.log("S4 registration verification passed.");
  } finally {
    await cleanupUserAndOrg(localEmail, localOrg);

    if (!participantRoleBefore) {
      const participantRole = await prisma.role.findUnique({
        select: { id: true },
        where: { key: "PARTICIPANT" },
      });
      if (participantRole) {
        const assignmentCount = await prisma.userRoleAssignment.count({
          where: { roleId: participantRole.id },
        });
        if (assignmentCount === 0) {
          await prisma.role.delete({ where: { id: participantRole.id } });
        }
      }
    }

    const restoreEnvironment = (key: string, value: string | undefined) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    };

    restoreEnvironment("NEXT_PUBLIC_SUPABASE_URL", originalEnv.supabaseUrl);
    restoreEnvironment(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      originalEnv.supabaseKey,
    );
    restoreEnvironment("PILOT_ACCESS_CODE", originalEnv.accessCode);
    restoreEnvironment("PILOT_ACCESS_CODES", originalEnv.accessCodes);
    restoreEnvironment("PILOT_REGISTRATION_MODE", originalEnv.mode);
    restoreEnvironment("PILOT_INVITED_EMAILS", originalEnv.invitedEmails);
  }
}

await main();
