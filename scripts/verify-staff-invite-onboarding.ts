import "dotenv/config";

import { RoleKey, UserStatus } from "../src/generated/prisma/enums";
import { inviteStaffMember } from "../src/lib/admin-people-workflow";
import { completeStaffRegistration, validateStaffInvitationToken } from "../src/lib/auth/staff-onboarding";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { prisma } from "../src/lib/prisma";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function sessionFor(user: { email: string; fullName: string; id: string }): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName,
    roles: ["SUPER_ADMIN"],
    userId: user.id,
  };
}

function tokenFromInvitationUrl(invitationUrl?: string) {
  assert(invitationUrl, "Missing invitation URL.");
  const parsed = new URL(invitationUrl);
  const token = parsed.searchParams.get("token");
  assert(token, "Invitation URL does not include token.");
  return token;
}

async function main() {
  const admin = await prisma.user.findUnique({
    select: { email: true, fullName: true, id: true },
    where: { email: "superadmin@demo.local" },
  });
  assert(admin, "Missing super admin user. Run npm run db:seed first.");

  const email = `invitee.${Date.now()}@demo.local`;
  const inviteResult = await inviteStaffMember({
    email,
    roleKey: RoleKey.PARTICIPANT,
    session: sessionFor(admin),
  });
  assert(inviteResult.success, "Expected invitation creation to succeed.");
  const token = tokenFromInvitationUrl(inviteResult.invitationUrl);

  const validation = await validateStaffInvitationToken(token);
  assert(validation.ok, "Expected generated token to be valid.");
  assert(validation.email === email, "Expected invitation email to match.");

  const completeResult = await completeStaffRegistration({
    department: "Programmes",
    fullName: "Invited Staff",
    jobTitle: "Field Coordinator",
    password: "SecurePass123",
    phone: "+251900000000",
    token,
  });
  assert(completeResult.success, "Expected registration completion to succeed.");

  const user = await prisma.user.findUnique({
    select: {
      department: true,
      fullName: true,
      jobTitle: true,
      passwordHash: true,
      status: true,
    },
    where: { email },
  });
  assert(user, "Expected invited user to exist.");
  assert(user.status === UserStatus.ACTIVE, "Expected invited user to become ACTIVE.");
  assert(user.passwordHash, "Expected invited user to have password hash.");
  assert(user.fullName === "Invited Staff", "Expected fullName to be updated.");
  assert(user.department === "Programmes", "Expected department to be set.");
  assert(user.jobTitle === "Field Coordinator", "Expected job title to be set.");

  const reused = await completeStaffRegistration({
    department: "Programmes",
    fullName: "Invited Staff",
    jobTitle: "Field Coordinator",
    password: "SecurePass123",
    phone: "+251900000000",
    token,
  });
  assert(!reused.success && reused.code === "used-token", "Expected one-time token reuse to fail.");

  console.log("Staff invite onboarding verification passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
