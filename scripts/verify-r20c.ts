import "dotenv/config";

import { AuditActionType, RoleKey, UserStatus } from "../src/generated/prisma/enums";
import {
  assignAdminUserRole,
  getAdminUserDetail,
  linkAdminUserContext,
  removeAdminUserRole,
  updateAdminUserStatus,
} from "../src/lib/admin-people-workflow";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { prisma } from "../src/lib/prisma";

const testEmail = "r20c-admin-mutation-user@demo.local";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function sessionFor(
  user: { email: string; fullName: string | null; id: string },
  roles: AuthSession["roles"],
): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName ?? user.email,
    roles,
    userId: user.id,
  };
}

async function cleanup() {
  const existing = await prisma.user.findUnique({
    select: { id: true },
    where: { email: testEmail },
  });

  if (!existing) {
    return;
  }

  await prisma.auditLog.deleteMany({
    where: { entityId: existing.id, entityType: "User" },
  });
  await prisma.userRoleAssignment.deleteMany({
    where: { userId: existing.id },
  });
  await prisma.user.delete({
    where: { id: existing.id },
  });
}

async function auditCount(userId: string, actionType: AuditActionType) {
  return prisma.auditLog.count({
    where: {
      actionType,
      entityId: userId,
      entityType: "User",
    },
  });
}

async function main() {
  console.log("=== R20C Verification: Admin User Mutations ===");
  await cleanup();

  const [admin, participant, organization, cohort] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
    prisma.organization.findFirst({ orderBy: { name: "asc" } }),
    prisma.cohort.findFirst({ orderBy: { name: "asc" } }),
  ]);
  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");
  assert(organization, "Missing seeded organization. Run npm run db:seed first.");
  assert(cohort, "Missing seeded cohort. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const testUser = await prisma.user.create({
    data: {
      email: testEmail,
      fullName: "R20C Admin Mutation User",
      status: UserStatus.ACTIVE,
    },
  });

  const statusResult = await updateAdminUserStatus({
    session: adminSession,
    status: UserStatus.SUSPENDED,
    userId: testUser.id,
  });
  assert(statusResult.success, `Expected status update success, got ${statusResult.code}.`);
  const suspended = await prisma.user.findUnique({ where: { id: testUser.id } });
  assert(suspended?.status === UserStatus.SUSPENDED, "Expected user to be suspended.");
  assert(
    (await auditCount(testUser.id, AuditActionType.USER_UPDATED)) === 1,
    "Expected status update audit log.",
  );
  console.log("PASS: admin can update user status with audit logging.");

  const selfStatusResult = await updateAdminUserStatus({
    session: adminSession,
    status: UserStatus.SUSPENDED,
    userId: admin.id,
  });
  assert(!selfStatusResult.success, "Expected self status update to be blocked.");
  assert(selfStatusResult.code === "self-status-blocked", `Expected self-status-blocked, got ${selfStatusResult.code}.`);
  console.log("PASS: admin self-deactivation/suspension is blocked.");

  const roleResult = await assignAdminUserRole({
    roleKey: RoleKey.FACILITATOR,
    session: adminSession,
    userId: testUser.id,
  });
  assert(roleResult.success, `Expected role assignment success, got ${roleResult.code}.`);
  const roleAssignment = await prisma.userRoleAssignment.findFirst({
    where: {
      isActive: true,
      role: { key: RoleKey.FACILITATOR },
      userId: testUser.id,
    },
  });
  assert(roleAssignment, "Expected active facilitator assignment.");
  assert(
    (await auditCount(testUser.id, AuditActionType.ROLE_ASSIGNED)) === 1,
    "Expected role assignment audit log.",
  );
  console.log("PASS: admin can assign roles with audit logging.");

  const removeResult = await removeAdminUserRole({
    roleKey: RoleKey.FACILITATOR,
    session: adminSession,
    userId: testUser.id,
  });
  assert(removeResult.success, `Expected role removal success, got ${removeResult.code}.`);
  const removedAssignment = await prisma.userRoleAssignment.findFirst({
    where: {
      role: { key: RoleKey.FACILITATOR },
      userId: testUser.id,
    },
  });
  assert(removedAssignment?.isActive === false, "Expected facilitator assignment to be inactive.");
  assert(
    (await auditCount(testUser.id, AuditActionType.ROLE_REMOVED)) === 1,
    "Expected role removal audit log.",
  );
  console.log("PASS: admin can remove roles without hard-deleting assignment history.");

  const linkResult = await linkAdminUserContext({
    cohortId: cohort.id,
    organizationId: organization.id,
    session: adminSession,
    userId: testUser.id,
  });
  assert(linkResult.success, `Expected context link success, got ${linkResult.code}.`);
  const linkedDetail = await getAdminUserDetail(testUser.id, adminSession);
  assert(linkedDetail, "Expected linked user detail.");
  assert(linkedDetail.organizationId === organization.id, "Expected organization link to persist.");
  assert(linkedDetail.primaryCohortId === cohort.id, "Expected cohort link to persist.");
  assert(
    (await auditCount(testUser.id, AuditActionType.USER_UPDATED)) >= 2,
    "Expected context update audit log.",
  );
  console.log("PASS: admin can link user organization/cohort with audit logging.");

  const participantDenied = await assignAdminUserRole({
    roleKey: RoleKey.PARTICIPANT,
    session: participantSession,
    userId: testUser.id,
  });
  assert(!participantDenied.success, "Expected participant role mutation to be denied.");
  assert(participantDenied.code === "unauthorized", `Expected unauthorized, got ${participantDenied.code}.`);
  console.log("PASS: participant cannot perform admin user mutations.");

  const superAdminCount = await prisma.user.count({
    where: {
      roleAssignments: {
        some: {
          isActive: true,
          role: { key: RoleKey.SUPER_ADMIN },
        },
      },
      status: UserStatus.ACTIVE,
    },
  });

  if (superAdminCount === 1) {
    const superAdmin = await prisma.user.findFirst({
      where: {
        roleAssignments: {
          some: {
            isActive: true,
            role: { key: RoleKey.SUPER_ADMIN },
          },
        },
        status: UserStatus.ACTIVE,
      },
    });
    assert(superAdmin, "Expected active Super Admin.");
    const lastSuperAdminResult = await updateAdminUserStatus({
      session: adminSession,
      status: UserStatus.DEACTIVATED,
      userId: superAdmin.id,
    });
    assert(!lastSuperAdminResult.success, "Expected last Super Admin deactivation to be blocked.");
    assert(lastSuperAdminResult.code === "last-super-admin", `Expected last-super-admin, got ${lastSuperAdminResult.code}.`);
    console.log("PASS: last active Super Admin protection is enforced.");
  } else {
    console.log("SKIP: last Super Admin guard requires exactly one active Super Admin in seed data.");
  }

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL R20C CHECKS PASSED.");
}

main()
  .catch(async (error) => {
    console.error(error);
    await cleanup();
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
