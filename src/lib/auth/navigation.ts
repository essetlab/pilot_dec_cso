import {
  adminNav,
  creatorNav,
  isPhaseOneAdminSurfaceRoute,
  isPhaseOneLearnerRoute,
  learnerNav,
  publicNav,
  type NavItem,
} from "@/lib/routes";
import {
  canAccessAdmin,
  canAccessCreator,
} from "./permissions";
import type { AuthSession } from "./session-codec";

export function getPublicNav() {
  return publicNav;
}

export function getLearnerNav() {
  return learnerNav.filter(
    (item) => item.href === "/support" || isPhaseOneLearnerRoute(item.href),
  );
}

export function getCreatorNav(session: AuthSession | null) {
  return canAccessCreator(session) ? creatorNav : [];
}

export function getAdminNav(session: AuthSession | null): NavItem[] {
  const phaseOneAdminNav = adminNav.filter((item) =>
    isPhaseOneAdminSurfaceRoute(item.href),
  );

  if (canAccessAdmin(session)) {
    return phaseOneAdminNav;
  }

  return [];
}
