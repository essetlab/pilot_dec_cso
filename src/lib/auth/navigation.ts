import {
  adminNav,
  creatorNav,
  learnerNav,
  publicNav,
  type NavItem,
} from "@/lib/routes";
import {
  canAccessAdmin,
  canAccessCreator,
  canAccessMonitoring,
  canAccessReview,
} from "./permissions";
import type { AuthSession } from "./session-codec";

export function getPublicNav() {
  return publicNav;
}

export function getLearnerNav() {
  return learnerNav;
}

export function getCreatorNav(session: AuthSession | null) {
  return canAccessCreator(session) ? creatorNav : [];
}

export function getAdminNav(session: AuthSession | null): NavItem[] {
  if (canAccessAdmin(session)) {
    return adminNav;
  }

  return adminNav.filter((item) => {
    if (item.href === "/admin/monitoring") {
      return canAccessMonitoring(session);
    }

    if (item.href === "/admin/review") {
      return canAccessReview(session);
    }

    return false;
  });
}
