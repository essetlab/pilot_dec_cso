import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { registerOpenLearner } from "../src/lib/open-registration-workflow";

const email = `open-registration-${Date.now()}@example.test`;
const normalizedEmail = email.toLowerCase();
const selfReportedOrganizationName = `Self-reported CSO ${Date.now()}`;
const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const originalPilotValues = {
  accessCode: process.env.PILOT_ACCESS_CODE,
  invitedEmails: process.env.PILOT_INVITED_EMAILS,
  mode: process.env.PILOT_REGISTRATION_MODE,
};

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

async function cleanup() {
  const user = await prisma.user.findUnique({ select: { id: true }, where: { email: normalizedEmail } });
  if (!user) return;
  await prisma.$transaction([
    prisma.auditLog.deleteMany({ where: { OR: [{ actorUserId: user.id }, { entityId: user.id }] } }),
    prisma.userRoleAssignment.deleteMany({ where: { userId: user.id } }),
    prisma.courseAssignment.deleteMany({ where: { targetUserId: user.id } }),
    prisma.enrollment.deleteMany({ where: { userId: user.id } }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);
}

try {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  process.env.PILOT_ACCESS_CODE = "must-not-be-read";
  process.env.PILOT_INVITED_EMAILS = "somebody-else@example.test";
  process.env.PILOT_REGISTRATION_MODE = "unavailable";

  await cleanup();
  const organizationCountBefore = await prisma.organization.count({
    where: { name: selfReportedOrganizationName },
  });

  const result = await registerOpenLearner({
    confirmPassword: "StrongPass123",
    consentAccepted: true,
    email: `  ${email.toUpperCase()}  `,
    fullName: "  Fictional Open Learner  ",
    jobTitle: "  Programme officer  ",
    organizationName: `  ${selfReportedOrganizationName}  `,
    password: "StrongPass123",
    region: "  Oromia  ",
  });
  assert(result.success, "Expected arbitrary valid unused email registration to succeed.");

  const user = await prisma.user.findUnique({
    include: { roleAssignments: { include: { role: true } } },
    where: { email: normalizedEmail },
  });
  assert(user, "Expected a Hub user to be created.");
  assert.equal(user.organizationId, null);
  assert.equal(user.selfReportedOrganizationName, selfReportedOrganizationName);
  assert.equal(user.passwordHash?.startsWith("scrypt$"), true);
  assert.equal(user.roleAssignments.some((assignment) => assignment.role.key === "PARTICIPANT"), true);
  assert.equal(await prisma.organization.count({ where: { name: selfReportedOrganizationName } }), organizationCountBefore);
  assert.equal(await prisma.courseAssignment.count({ where: { targetUserId: user.id } }), 0);
  assert.equal(await prisma.enrollment.count({ where: { userId: user.id } }), 0);

  const duplicate = await registerOpenLearner({
    confirmPassword: "StrongPass123",
    consentAccepted: true,
    email,
    fullName: "Fictional Open Learner",
    jobTitle: "Programme officer",
    organizationName: selfReportedOrganizationName,
    password: "StrongPass123",
    region: "Oromia",
  });
  assert.deepEqual(duplicate, { code: "registration-not-completed", success: false });

  const noConsent = await registerOpenLearner({
    confirmPassword: "StrongPass123",
    consentAccepted: false,
    email: "another-open-learner@example.test",
    fullName: "Another Learner",
    jobTitle: "Coordinator",
    organizationName: "Another CSO",
    password: "StrongPass123",
    region: "Somali",
  });
  assert.deepEqual(noConsent, { code: "terms-required", success: false });

  console.log("Open registration persistence verification passed.");
} finally {
  await cleanup();
  restore("NEXT_PUBLIC_SUPABASE_URL", originalSupabaseUrl);
  restore("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", originalSupabaseKey);
  restore("PILOT_ACCESS_CODE", originalPilotValues.accessCode);
  restore("PILOT_INVITED_EMAILS", originalPilotValues.invitedEmails);
  restore("PILOT_REGISTRATION_MODE", originalPilotValues.mode);
  await prisma.$disconnect();
}
