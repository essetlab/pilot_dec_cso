import type { AuthSession } from "./session-codec";
import type { RoleKey } from "./roles";

const LEARNER_ALLOWED_ROLES: RoleKey[] = [
  "SUPER_ADMIN",
  "PLATFORM_ADMIN",
  "COURSE_CREATOR",
  "COURSE_REVIEWER",
  "FACILITATOR",
  "CSO_FOCAL_PERSON",
  "PARTICIPANT",
];

const CREATOR_ALLOWED_ROLES: RoleKey[] = [
  "SUPER_ADMIN",
  "PLATFORM_ADMIN",
  "COURSE_CREATOR",
];

const ADMIN_ALLOWED_ROLES: RoleKey[] = ["SUPER_ADMIN", "PLATFORM_ADMIN"];
const MONITORING_ALLOWED_ROLES: RoleKey[] = [
  "SUPER_ADMIN",
  "PLATFORM_ADMIN",
  "ME_VIEWER",
];
const REVIEW_ALLOWED_ROLES: RoleKey[] = [
  "SUPER_ADMIN",
  "PLATFORM_ADMIN",
  "COURSE_REVIEWER",
];

export function hasAnyRole(session: AuthSession | null, roles: RoleKey[]) {
  return Boolean(session?.roles.some((role) => roles.includes(role)));
}

export function canAccessLearner(session: AuthSession | null) {
  return hasAnyRole(session, LEARNER_ALLOWED_ROLES);
}

export function canAccessCreator(session: AuthSession | null) {
  return hasAnyRole(session, CREATOR_ALLOWED_ROLES);
}

export function canAccessAdmin(session: AuthSession | null) {
  return hasAnyRole(session, ADMIN_ALLOWED_ROLES);
}

export function canAccessMonitoring(session: AuthSession | null) {
  return hasAnyRole(session, MONITORING_ALLOWED_ROLES);
}

export function canAccessReview(session: AuthSession | null) {
  return hasAnyRole(session, REVIEW_ALLOWED_ROLES);
}

export function canAccessPath(session: AuthSession | null, pathname: string) {
  if (pathname === "/admin/monitoring" || pathname.startsWith("/admin/monitoring/")) {
    return canAccessMonitoring(session);
  }

  if (pathname === "/admin/review" || pathname.startsWith("/admin/review/")) {
    return canAccessReview(session);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return canAccessAdmin(session);
  }

  if (pathname === "/creator" || pathname.startsWith("/creator/")) {
    return canAccessCreator(session);
  }

  if (pathname === "/learn" || pathname.startsWith("/learn/")) {
    return canAccessLearner(session);
  }

  return true;
}

export function isProtectedPath(pathname: string) {
  return (
    pathname === "/learn" ||
    pathname.startsWith("/learn/") ||
    pathname === "/creator" ||
    pathname.startsWith("/creator/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  );
}
