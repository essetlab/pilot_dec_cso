import "dotenv/config";

import { AuditActionType } from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  createReferenceDataItem,
  getActiveReferenceDataItems,
  getReferenceDataPageData,
  setReferenceDataItemStatus,
  updateReferenceDataItem,
} from "../src/lib/reference-data-workflow";
import { prisma } from "../src/lib/prisma";

const testCategory = "regions" as const;
const testKey = "r22g-verification-region";
const testLabel = "R22G Verification Region";

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
  const items = await prisma.referenceDataItem.findMany({
    select: { id: true },
    where: {
      OR: [
        { category: testCategory, key: testKey },
        { label: { startsWith: testLabel } },
      ],
    },
  });
  const itemIds = items.map((item) => item.id);

  if (itemIds.length === 0) {
    return;
  }

  await prisma.auditLog.deleteMany({
    where: {
      entityId: { in: itemIds },
      entityType: "ReferenceDataItem",
    },
  });
  await prisma.referenceDataItem.deleteMany({
    where: {
      id: { in: itemIds },
    },
  });
}

async function main() {
  console.log("=== R22G Verification: Reference Data Management ===");
  await cleanup();

  const [admin, reviewer, meViewer, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "reviewer@demo.local" } }),
    prisma.user.findUnique({ where: { email: "meviewer@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);

  assert(admin, "Missing seeded admin user. Run npm run db:seed first.");
  assert(reviewer, "Missing seeded reviewer user. Run npm run db:seed first.");
  assert(meViewer, "Missing seeded M&E viewer user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const reviewerSession = sessionFor(reviewer, ["COURSE_REVIEWER"]);
  const meViewerSession = sessionFor(meViewer, ["ME_VIEWER"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const seededData = await getReferenceDataPageData(adminSession);
  assert(seededData, "Expected reference data for Platform Admin.");
  assert(seededData.categories.length === 5, "Expected five Phase 1 reference categories.");
  for (const key of [
    "capacity-areas",
    "course-levels",
    "organization-types",
    "regions",
    "languages",
  ] as const) {
    const category = seededData.categories.find((item) => item.key === key);
    assert(category, `Missing category ${key}.`);
    assert(category.activeCount > 0, `Expected seeded active values for ${key}.`);
  }
  console.log("PASS: seeded Phase 1 reference categories are DB-backed.");

  const createResult = await createReferenceDataItem({
    category: testCategory,
    description: "Temporary region created by the R22G verification script.",
    key: testKey,
    label: testLabel,
    order: 99,
    session: adminSession,
  });
  assert(createResult.success, `Expected create success, got ${createResult.code}.`);
  assert(createResult.itemId, "Expected created reference item id.");
  console.log("PASS: admin can create a reference value.");

  const created = await prisma.referenceDataItem.findUnique({
    where: { id: createResult.itemId },
  });
  assert(created, "Expected created reference item.");
  assert(created.category === testCategory, "Expected category to persist.");
  assert(created.key === testKey, "Expected key to persist.");
  assert(created.label === testLabel, "Expected label to persist.");
  assert(created.order === 99, "Expected display order to persist.");
  assert(created.isActive, "Expected new value to be active.");
  console.log("PASS: created reference value fields persisted.");

  const duplicate = await createReferenceDataItem({
    category: testCategory,
    key: testKey,
    label: `${testLabel} Duplicate`,
    session: adminSession,
  });
  assert(!duplicate.success, "Expected duplicate category/key to be rejected.");
  assert(
    duplicate.code === "reference-key-exists",
    `Expected duplicate key code, got ${duplicate.code}.`,
  );
  console.log("PASS: duplicate reference keys are rejected per category.");

  const updateResult = await updateReferenceDataItem({
    category: testCategory,
    description: "Updated temporary region created by the R22G verification script.",
    itemId: createResult.itemId,
    key: testKey,
    label: `${testLabel} Updated`,
    order: 7,
    session: adminSession,
  });
  assert(updateResult.success, `Expected update success, got ${updateResult.code}.`);
  const updated = await prisma.referenceDataItem.findUnique({
    where: { id: createResult.itemId },
  });
  assert(updated?.label === `${testLabel} Updated`, "Expected updated label.");
  assert(updated?.order === 7, "Expected updated display order.");
  console.log("PASS: admin can update label, description, key, and order.");

  const deactivateResult = await setReferenceDataItemStatus({
    isActive: false,
    itemId: createResult.itemId,
    session: adminSession,
  });
  assert(
    deactivateResult.success,
    `Expected deactivate success, got ${deactivateResult.code}.`,
  );
  const activeOptionsAfterDeactivate = await getActiveReferenceDataItems(testCategory);
  assert(
    !activeOptionsAfterDeactivate.some((item) => item.id === createResult.itemId),
    "Expected inactive value to be excluded from active reference options.",
  );
  console.log("PASS: deactivated values are preserved and hidden from active options.");

  const inactiveData = await getReferenceDataPageData(adminSession, {
    category: testCategory,
    query: "R22G",
    status: "inactive",
  });
  assert(
    inactiveData?.items.some((item) => item.id === createResult.itemId),
    "Expected inactive filtered list to include the deactivated value.",
  );
  console.log("PASS: category, status, and search filters read from saved records.");

  const reactivateResult = await setReferenceDataItemStatus({
    isActive: true,
    itemId: createResult.itemId,
    session: adminSession,
  });
  assert(
    reactivateResult.success,
    `Expected reactivate success, got ${reactivateResult.code}.`,
  );
  const activeOptionsAfterReactivate = await getActiveReferenceDataItems(testCategory);
  assert(
    activeOptionsAfterReactivate.some((item) => item.id === createResult.itemId),
    "Expected reactivated value to return to active reference options.",
  );
  console.log("PASS: inactive values can be reactivated.");

  const auditCount = await prisma.auditLog.count({
    where: {
      actionType: AuditActionType.REFERENCE_DATA_UPDATED,
      entityId: createResult.itemId,
      entityType: "ReferenceDataItem",
    },
  });
  assert(auditCount >= 4, "Expected create, update, deactivate, and reactivate audit logs.");
  console.log("PASS: reference data changes are audited.");

  for (const [label, session] of [
    ["Course Reviewer", reviewerSession],
    ["M&E Viewer", meViewerSession],
    ["Participant", participantSession],
  ] as const) {
    const deniedData = await getReferenceDataPageData(session);
    assert(!deniedData, `Expected ${label} reference data read to be denied.`);
    const deniedCreate = await createReferenceDataItem({
      category: testCategory,
      key: `${testKey}-${label.toLowerCase().replaceAll(" ", "-")}`,
      label: `${testLabel} ${label}`,
      session,
    });
    assert(!deniedCreate.success, `Expected ${label} create attempt to be denied.`);
    assert(
      deniedCreate.code === "unauthorized",
      `Expected unauthorized for ${label}, got ${deniedCreate.code}.`,
    );
  }
  console.log("PASS: non-admin roles cannot read or mutate reference data.");

  await cleanup();
  console.log("PASS: temporary R22G verification records cleaned up.");
  console.log("ALL R22G CHECKS PASSED.");
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
