export const ROLE_KEYS = [
  "SUPER_ADMIN",
  "PLATFORM_ADMIN",
  "COURSE_CREATOR",
  "COURSE_REVIEWER",
  "FACILITATOR",
  "CSO_FOCAL_PERSON",
  "PARTICIPANT",
  "ME_VIEWER",
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export const ROLE_LABELS: Record<RoleKey, string> = {
  SUPER_ADMIN: "Super Admin",
  PLATFORM_ADMIN: "Platform Admin",
  COURSE_CREATOR: "Course Creator",
  COURSE_REVIEWER: "Course Reviewer",
  FACILITATOR: "Facilitator",
  CSO_FOCAL_PERSON: "CSO Focal Person",
  PARTICIPANT: "Participant",
  ME_VIEWER: "M&E Viewer",
};

export const ADMIN_ROLES = ["SUPER_ADMIN", "PLATFORM_ADMIN"] as const;

export function isRoleKey(value: unknown): value is RoleKey {
  return typeof value === "string" && ROLE_KEYS.includes(value as RoleKey);
}
