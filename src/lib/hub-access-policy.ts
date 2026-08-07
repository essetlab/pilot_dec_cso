export type HubAccessPolicy = "controlled" | "open";

export const DEFAULT_HUB_ACCESS_POLICY: HubAccessPolicy = "controlled";
export const COURSE_INVITATION_VALIDITY_DAYS = 5;
export const COURSE_INVITATION_VALIDITY_MS =
  COURSE_INVITATION_VALIDITY_DAYS * 24 * 60 * 60 * 1000;

type AccessPolicyEnvironment = { HUB_ACCESS_POLICY?: string };

export function resolveHubAccessPolicy(
  environment: AccessPolicyEnvironment = process.env as AccessPolicyEnvironment,
): HubAccessPolicy {
  return environment.HUB_ACCESS_POLICY?.trim().toLowerCase() === "open"
    ? "open"
    : DEFAULT_HUB_ACCESS_POLICY;
}

export function isControlledHubAccess(
  environment: AccessPolicyEnvironment = process.env as AccessPolicyEnvironment,
) {
  return resolveHubAccessPolicy(environment) === "controlled";
}

export function createCourseInvitationExpiry(now = new Date()) {
  return new Date(now.getTime() + COURSE_INVITATION_VALIDITY_MS);
}
