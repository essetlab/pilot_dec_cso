import assert from "node:assert/strict";
import { OrganizationStatus, UserStatus } from "../src/generated/prisma/enums";
import { activeRoleKeys, canUseHubAccount } from "../src/lib/auth/hub-session";

assert.equal(canUseHubAccount({
  organizationStatus: null,
  roles: ["PARTICIPANT"],
  status: UserStatus.ACTIVE,
}), true);
assert.equal(canUseHubAccount({
  organizationStatus: OrganizationStatus.INACTIVE,
  roles: ["PARTICIPANT"],
  status: UserStatus.ACTIVE,
}), true);

for (const status of [UserStatus.INVITED, UserStatus.SUSPENDED, UserStatus.DEACTIVATED]) {
  assert.equal(canUseHubAccount({ organizationStatus: null, roles: ["PARTICIPANT"], status }), false);
}

assert.deepEqual(activeRoleKeys([
  { expiresAt: new Date(Date.now() - 60_000), isActive: true, role: { key: "PARTICIPANT" } },
  { expiresAt: null, isActive: true, role: { key: "PARTICIPANT" } },
  { expiresAt: null, isActive: false, role: { key: "PLATFORM_ADMIN" } },
]), ["PARTICIPANT"]);

console.log("Stage A session eligibility verification passed.");
