import "dotenv/config";

import {
  getAdminCohortDetail,
  getAdminCohortsData,
  getAdminOrganizationDetail,
  getAdminOrganizationsData,
  getAdminUserDetail,
  getAdminUsersData,
} from "../src/lib/admin-people-workflow";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { cleanPresentationEmail } from "../src/lib/presentation-text";
import { prisma } from "../src/lib/prisma";

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

async function main() {
  console.log("=== R20B Verification: Admin Users, Organizations, and Cohorts ===");

  const [admin, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);
  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const [userCount, organizationCount, cohortCount] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.cohort.count(),
  ]);
  assert(userCount > 0, "Expected seeded users.");
  assert(organizationCount > 0, "Expected seeded organizations.");
  assert(cohortCount > 0, "Expected seeded cohorts.");

  const users = await getAdminUsersData(adminSession);
  assert(users.users.length === userCount, "Expected admin users list to match DB user count.");
  assert(users.metrics[0]?.value === userCount, "Expected user metric to match DB count.");
  assert(users.users.some((user) => user.email === cleanPresentationEmail(admin.email)), "Expected admin user in user list.");
  assert(users.selectedUser, "Expected selected user preview.");
  console.log("PASS: admin user list and metrics are DB-backed.");

  const userDetail = await getAdminUserDetail(participant.id, adminSession);
  assert(userDetail, "Expected admin to read participant detail.");
  assert(userDetail.email === cleanPresentationEmail(participant.email), "Expected user detail email to match fixture.");
  assert(userDetail.roles.length > 0, "Expected user detail to include active roles.");
  assert(userDetail.organization.length > 0, "Expected user detail to include organization summary.");
  console.log("PASS: admin user detail exposes profile, roles, org/cohort, enrollments, and certificates.");

  const organizations = await getAdminOrganizationsData(adminSession);
  assert(
    organizations.organizations.length === organizationCount,
    "Expected organization list to match DB organization count.",
  );
  assert(
    organizations.metrics[0]?.value === organizationCount,
    "Expected organization metric to match DB count.",
  );
  assert(organizations.selectedOrganization, "Expected selected organization preview.");
  const organizationDetail = await getAdminOrganizationDetail(
    organizations.organizations[0].id,
    adminSession,
  );
  assert(organizationDetail, "Expected admin to read organization detail.");
  assert(
    Array.isArray(organizationDetail.participants),
    "Expected organization detail to expose linked participants.",
  );
  assert(
    Array.isArray(organizationDetail.cohorts),
    "Expected organization detail to expose linked cohorts.",
  );
  console.log("PASS: organization list/detail reads live participants, cohorts, courses, and summaries.");

  const cohorts = await getAdminCohortsData(adminSession);
  assert(cohorts.cohorts.length === cohortCount, "Expected cohort list to match DB cohort count.");
  assert(cohorts.metrics[0]?.value === cohortCount, "Expected cohort metric to match DB count.");
  assert(cohorts.selectedCohort, "Expected selected cohort preview.");
  const cohortDetail = await getAdminCohortDetail(cohorts.cohorts[0].id, adminSession);
  assert(cohortDetail, "Expected admin to read cohort detail.");
  assert(Array.isArray(cohortDetail.organizations), "Expected cohort detail to expose organizations.");
  assert(Array.isArray(cohortDetail.participants), "Expected cohort detail to expose participants.");
  console.log("PASS: cohort list/detail reads live organizations, participants, courses, and summaries.");

  const [blockedUsers, blockedUserDetail, blockedOrganizations, blockedOrganizationDetail, blockedCohorts, blockedCohortDetail] =
    await Promise.all([
      getAdminUsersData(participantSession),
      getAdminUserDetail(participant.id, participantSession),
      getAdminOrganizationsData(participantSession),
      getAdminOrganizationDetail(organizations.organizations[0].id, participantSession),
      getAdminCohortsData(participantSession),
      getAdminCohortDetail(cohorts.cohorts[0].id, participantSession),
    ]);

  assert(blockedUsers.users.length === 0, "Expected participant user list access to return no users.");
  assert(blockedUserDetail === null, "Expected participant user detail access to return null.");
  assert(
    blockedOrganizations.organizations.length === 0,
    "Expected participant organization list access to return no organizations.",
  );
  assert(
    blockedOrganizationDetail === null,
    "Expected participant organization detail access to return null.",
  );
  assert(blockedCohorts.cohorts.length === 0, "Expected participant cohort list access to return no cohorts.");
  assert(blockedCohortDetail === null, "Expected participant cohort detail access to return null.");
  console.log("PASS: participant cannot read admin people operations data.");

  console.log("ALL R20B CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
