import "dotenv/config";

import {
  AuditActionType,
  RoleKey,
  UserStatus,
} from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  createAdminUser,
  getAdminUserDetail,
  getAdminUsersData,
  updateAdminUserStatus,
} from "../src/lib/admin-people-workflow";
import { prisma } from "../src/lib/prisma";

const testEmail = "r22f.user@example.org";
const testName = "R22F Verification User";

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
  const users = await prisma.user.findMany({
    select: { id: true },
    where: {
      OR: [{ email: testEmail }, { fullName: { startsWith: testName } }],
    },
  });
  const userIds = users.map((user) => user.id);

  if (userIds.length === 0) {
    return;
  }

  await prisma.auditLog.deleteMany({
    where: {
      entityId: { in: userIds },
      entityType: "User",
    },
  });
  await prisma.userRoleAssignment.deleteMany({
    where: {
      userId: { in: userIds },
    },
  });
  await prisma.user.deleteMany({
    where: {
      id: { in: userIds },
    },
  });
}

async function main() {
  console.log("=== R22F Verification: Admin Create User ===");
  await cleanup();

  const [admin, reviewer, meViewer, participant, organization, cohort] =
    await Promise.all([
      prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
      prisma.user.findUnique({ where: { email: "reviewer@demo.local" } }),
      prisma.user.findUnique({ where: { email: "meviewer@demo.local" } }),
      prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
      prisma.organization.findFirst({ orderBy: { name: "asc" } }),
      prisma.cohort.findFirst({ orderBy: { name: "asc" } }),
    ]);

  assert(admin, "Missing seeded admin user. Run npm run db:seed first.");
  assert(reviewer, "Missing seeded reviewer user. Run npm run db:seed first.");
  assert(meViewer, "Missing seeded M&E viewer user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");
  assert(organization, "Missing seeded organization. Run npm run db:seed first.");
  assert(cohort, "Missing seeded cohort. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const reviewerSession = sessionFor(reviewer, ["COURSE_REVIEWER"]);
  const meViewerSession = sessionFor(meViewer, ["ME_VIEWER"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const createResult = await createAdminUser({
    cohortId: cohort.id,
    email: testEmail.toUpperCase(),
    fullName: testName,
    organizationId: organization.id,
    phone: "+251 911 000 022",
    region: "Addis Ababa",
    roleKey: RoleKey.PARTICIPANT,
    session: adminSession,
    status: UserStatus.INVITED,
  });

  assert(createResult.success, `Expected user creation success, got ${createResult.code}.`);
  assert(createResult.userId, "Expected created user id.");
  console.log("PASS: admin can create a user with role and context.");

  const created = await prisma.user.findUnique({
    include: {
      roleAssignments: {
        include: { role: true },
      },
    },
    where: { id: createResult.userId },
  });
  assert(created, "Expected created user record.");
  assert(created.email === testEmail, "Expected email to be normalized to lowercase.");
  assert(created.fullName === testName, "Expected full name to be saved.");
  assert(created.status === UserStatus.INVITED, "Expected invited status.");
  assert(created.organizationId === organization.id, "Expected organization link.");
  assert(created.primaryCohortId === cohort.id, "Expected cohort link.");
  assert(
    created.roleAssignments.some(
      (assignment) =>
        assignment.isActive && assignment.role.key === RoleKey.PARTICIPANT,
    ),
    "Expected active participant role assignment.",
  );
  console.log("PASS: created user fields and role assignment persisted.");

  const [creationAudit, roleAudit] = await Promise.all([
    prisma.auditLog.count({
      where: {
        actionType: AuditActionType.USER_CREATED,
        entityId: createResult.userId,
        entityType: "User",
      },
    }),
    prisma.auditLog.count({
      where: {
        actionType: AuditActionType.ROLE_ASSIGNED,
        entityId: createResult.userId,
        entityType: "User",
      },
    }),
  ]);
  assert(creationAudit === 1, "Expected one user creation audit log.");
  assert(roleAudit === 1, "Expected one initial role assignment audit log.");
  console.log("PASS: user creation and initial role assignment are audited.");

  const listData = await getAdminUsersData(adminSession);
  assert(
    listData.users.some((user) => user.id === createResult.userId),
    "Expected created user to appear in admin users list.",
  );
  const detailData = await getAdminUserDetail(createResult.userId, adminSession);
  assert(detailData, "Expected created user detail to load.");
  assert(detailData.email === testEmail, "Expected created user detail email.");
  assert(detailData.activeRoleKeys.includes(RoleKey.PARTICIPANT), "Expected detail role list.");
  console.log("PASS: created user appears in list and detail views.");

  const duplicate = await createAdminUser({
    email: testEmail,
    fullName: `${testName} Duplicate`,
    roleKey: RoleKey.PARTICIPANT,
    session: adminSession,
    status: UserStatus.INVITED,
  });
  assert(!duplicate.success, "Expected duplicate email to be rejected.");
  assert(duplicate.code === "user-email-exists", `Expected duplicate code, got ${duplicate.code}.`);
  console.log("PASS: duplicate email is handled safely.");

  const statusUpdate = await updateAdminUserStatus({
    session: adminSession,
    status: UserStatus.ACTIVE,
    userId: createResult.userId,
  });
  assert(statusUpdate.success, `Expected status update success, got ${statusUpdate.code}.`);
  const updated = await prisma.user.findUnique({
    select: { status: true },
    where: { id: createResult.userId },
  });
  assert(updated?.status === UserStatus.ACTIVE, "Expected created user status update.");
  console.log("PASS: created user can be updated through existing admin operations.");

  for (const [label, session] of [
    ["Course Reviewer", reviewerSession],
    ["M&E Viewer", meViewerSession],
    ["Participant", participantSession],
  ] as const) {
    const denied = await createAdminUser({
      email: `${label.toLowerCase().replaceAll(" ", ".")}.r22f@example.org`,
      fullName: `${label} R22F Denied`,
      roleKey: RoleKey.PARTICIPANT,
      session,
      status: UserStatus.INVITED,
    });
    assert(!denied.success, `Expected ${label} create-user attempt to be denied.`);
    assert(denied.code === "unauthorized", `Expected unauthorized for ${label}, got ${denied.code}.`);
  }
  console.log("PASS: non-admin roles cannot create users.");

  await cleanup();
  console.log("PASS: temporary R22F verification records cleaned up.");
  console.log("ALL R22F CHECKS PASSED.");
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
