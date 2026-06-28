import "dotenv/config";

import {
  AuditActionType,
  OrganizationFormalityStatus,
  OrganizationStatus,
} from "../src/generated/prisma/enums";
import {
  createAdminCohort,
  createAdminOrganization,
  linkAdminCohortOrganization,
  unlinkAdminCohortOrganization,
  updateAdminCohort,
  updateAdminOrganization,
} from "../src/lib/admin-people-workflow";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { prisma } from "../src/lib/prisma";

const orgName = "R20D Verification Organization";
const orgUpdatedName = "R20D Verification Organization Updated";
const cohortName = "R20D Verification Cohort";
const cohortUpdatedName = "R20D Verification Cohort Updated";

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
  const [organizations, cohorts]: [{ id: string }[], { id: string }[]] =
    await Promise.all([
      prisma.organization.findMany({
        select: { id: true },
        where: { name: { startsWith: orgName } },
      }),
      prisma.cohort.findMany({
        select: { id: true },
        where: { name: { startsWith: cohortName } },
      }),
    ]);

  const organizationIds = organizations.map((organization) => organization.id);
  const cohortIds = cohorts.map((cohort) => cohort.id);

  if (organizationIds.length > 0 || cohortIds.length > 0) {
    await prisma.auditLog.deleteMany({
      where: {
        OR: [
          { entityId: { in: organizationIds }, entityType: "Organization" },
          { entityId: { in: cohortIds }, entityType: "Cohort" },
        ],
      },
    });
    await prisma.cohortOrganization.deleteMany({
      where: {
        OR: [
          { organizationId: { in: organizationIds } },
          { cohortId: { in: cohortIds } },
        ],
      },
    });
    await prisma.organization.deleteMany({
      where: { id: { in: organizationIds } },
    });
    await prisma.cohort.deleteMany({
      where: { id: { in: cohortIds } },
    });
  }
}

async function auditCount(entityId: string, entityType: string, actionType: AuditActionType) {
  return prisma.auditLog.count({
    where: {
      actionType,
      entityId,
      entityType,
    },
  });
}

async function main() {
  console.log("=== R20D Verification: Admin Organization and Cohort Mutations ===");
  await cleanup();

  const [admin, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);
  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const orgCreate = await createAdminOrganization({
    focalPersonEmail: "r20d@example.org",
    focalPersonName: "R20D Focal",
    formalityStatus: OrganizationFormalityStatus.UNKNOWN,
    name: orgName,
    organizationTypeId: "Verification CSO",
    region: "Addis Ababa",
    session: adminSession,
    status: OrganizationStatus.ACTIVE,
  });
  assert(orgCreate.success && orgCreate.organizationId, `Expected org create success, got ${orgCreate.code}.`);
  assert(
    (await auditCount(orgCreate.organizationId, "Organization", AuditActionType.ORGANIZATION_CREATED)) === 1,
    "Expected organization create audit log.",
  );
  console.log("PASS: admin can create organization with audit logging.");

  const orgUpdate = await updateAdminOrganization({
    formalityStatus: OrganizationFormalityStatus.FORMAL_REGISTERED,
    name: orgUpdatedName,
    notes: "Updated by R20D verification.",
    organizationId: orgCreate.organizationId,
    organizationTypeId: "Verification CSO",
    region: "Oromia",
    session: adminSession,
    status: OrganizationStatus.INACTIVE,
  });
  assert(orgUpdate.success, `Expected org update success, got ${orgUpdate.code}.`);
  const updatedOrg = await prisma.organization.findUnique({
    where: { id: orgCreate.organizationId },
  });
  assert(updatedOrg?.name === orgUpdatedName, "Expected organization name update.");
  assert(updatedOrg?.status === OrganizationStatus.INACTIVE, "Expected organization status update.");
  assert(
    (await auditCount(orgCreate.organizationId, "Organization", AuditActionType.ORGANIZATION_UPDATED)) === 1,
    "Expected organization update audit log.",
  );
  console.log("PASS: admin can update organization with audit logging.");

  const cohortCreate = await createAdminCohort({
    description: "Temporary R20D verification cohort.",
    endDate: "2026-12-31",
    name: cohortName,
    programmeName: "R20D Programme",
    region: "Addis Ababa",
    session: adminSession,
    startDate: "2026-06-01",
    status: OrganizationStatus.ACTIVE,
  });
  assert(cohortCreate.success && cohortCreate.cohortId, `Expected cohort create success, got ${cohortCreate.code}.`);
  assert(
    (await auditCount(cohortCreate.cohortId, "Cohort", AuditActionType.COHORT_CREATED)) === 1,
    "Expected cohort create audit log.",
  );
  console.log("PASS: admin can create cohort with audit logging.");

  const cohortUpdate = await updateAdminCohort({
    cohortId: cohortCreate.cohortId,
    description: "Updated by R20D verification.",
    endDate: "2027-01-31",
    name: cohortUpdatedName,
    programmeName: "R20D Programme Updated",
    region: "Amhara",
    session: adminSession,
    startDate: "2026-07-01",
    status: OrganizationStatus.INACTIVE,
  });
  assert(cohortUpdate.success, `Expected cohort update success, got ${cohortUpdate.code}.`);
  const updatedCohort = await prisma.cohort.findUnique({
    where: { id: cohortCreate.cohortId },
  });
  assert(updatedCohort?.name === cohortUpdatedName, "Expected cohort name update.");
  assert(updatedCohort?.status === OrganizationStatus.INACTIVE, "Expected cohort status update.");
  assert(
    (await auditCount(cohortCreate.cohortId, "Cohort", AuditActionType.COHORT_UPDATED)) === 1,
    "Expected cohort update audit log.",
  );
  console.log("PASS: admin can update cohort with audit logging.");

  const link = await linkAdminCohortOrganization({
    cohortId: cohortCreate.cohortId,
    organizationId: orgCreate.organizationId,
    session: adminSession,
  });
  assert(link.success, `Expected cohort organization link success, got ${link.code}.`);
  const linked = await prisma.cohortOrganization.findUnique({
    where: {
      cohortId_organizationId: {
        cohortId: cohortCreate.cohortId,
        organizationId: orgCreate.organizationId,
      },
    },
  });
  assert(linked, "Expected cohort organization link to persist.");
  console.log("PASS: admin can link organization to cohort.");

  const unlink = await unlinkAdminCohortOrganization({
    cohortId: cohortCreate.cohortId,
    organizationId: orgCreate.organizationId,
    session: adminSession,
  });
  assert(unlink.success, `Expected cohort organization unlink success, got ${unlink.code}.`);
  const removedLink = await prisma.cohortOrganization.findUnique({
    where: {
      cohortId_organizationId: {
        cohortId: cohortCreate.cohortId,
        organizationId: orgCreate.organizationId,
      },
    },
  });
  assert(!removedLink, "Expected cohort organization link to be removed.");
  assert(
    (await auditCount(cohortCreate.cohortId, "Cohort", AuditActionType.COHORT_UPDATED)) >= 3,
    "Expected cohort update audits for update, link, and unlink.",
  );
  console.log("PASS: admin can unlink organization from cohort with audit logging.");

  const participantDenied = await createAdminOrganization({
    formalityStatus: OrganizationFormalityStatus.UNKNOWN,
    name: `${orgName} Participant Denied`,
    session: participantSession,
    status: OrganizationStatus.ACTIVE,
  });
  assert(!participantDenied.success, "Expected participant organization create to be denied.");
  assert(participantDenied.code === "unauthorized", `Expected unauthorized, got ${participantDenied.code}.`);
  console.log("PASS: participant cannot perform organization/cohort mutations.");

  await cleanup();
  console.log("PASS: temporary verification records cleaned up.");
  console.log("ALL R20D CHECKS PASSED.");
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
