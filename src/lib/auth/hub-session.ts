import { UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../prisma";
import type { AuthSession } from "./session-codec";
import { isRoleKey, type RoleKey } from "./roles";

const hubAuthUserSelect = {
  authProviderId: true,
  email: true,
  fullName: true,
  id: true,
  roleAssignments: {
    select: {
      isActive: true,
      role: { select: { key: true } },
    },
  },
  status: true,
} as const;

type HubAuthUser = {
  authProviderId: string | null;
  email: string;
  fullName: string;
  id: string;
  roleAssignments: {
    isActive: boolean;
    role: { key: string };
  }[];
  status: UserStatus;
};

export type HubSessionLookupResult =
  | {
      linkedBy: "authProviderId" | "email";
      session: AuthSession;
      success: true;
    }
  | {
      code: "hub-profile-missing" | "inactive-user" | "missing-roles";
      success: false;
    };

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function activeRoleKeys(
  assignments: HubAuthUser["roleAssignments"],
): RoleKey[] {
  return assignments.flatMap((assignment) => {
    if (!assignment.isActive || !isRoleKey(assignment.role.key)) {
      return [];
    }

    return [assignment.role.key];
  });
}

export function buildAuthSessionFromHubUser(
  user: HubAuthUser,
  issuedAt: string,
): HubSessionLookupResult {
  if (user.status !== UserStatus.ACTIVE) {
    return { code: "inactive-user", success: false };
  }

  const roles = activeRoleKeys(user.roleAssignments);
  if (roles.length === 0) {
    return { code: "missing-roles", success: false };
  }

  return {
    linkedBy: user.authProviderId ? "authProviderId" : "email",
    session: {
      email: user.email,
      issuedAt,
      name: user.fullName,
      roles,
      userId: user.id,
    },
    success: true,
  };
}

export async function resolveSupabaseHubSession(input: {
  email: string;
  issuedAt?: string;
  linkEmailFallback?: boolean;
  supabaseUserId: string;
}): Promise<HubSessionLookupResult> {
  const issuedAt = input.issuedAt ?? new Date().toISOString();
  const email = normalizeEmail(input.email);

  const linkedUser = await prisma.user.findUnique({
    select: hubAuthUserSelect,
    where: { authProviderId: input.supabaseUserId },
  });

  if (linkedUser) {
    return buildAuthSessionFromHubUser(linkedUser, issuedAt);
  }

  if (!input.linkEmailFallback) {
    return { code: "hub-profile-missing", success: false };
  }

  const matchingUsers = await prisma.user.findMany({
    select: hubAuthUserSelect,
    where: { email },
  });

  const activeMatches = matchingUsers.filter(
    (user) => user.status === UserStatus.ACTIVE,
  );

  if (activeMatches.length !== 1) {
    return matchingUsers.length > 0
      ? { code: "inactive-user", success: false }
      : { code: "hub-profile-missing", success: false };
  }

  const candidate = activeMatches[0];
  if (candidate.authProviderId && candidate.authProviderId !== input.supabaseUserId) {
    return { code: "hub-profile-missing", success: false };
  }

  const sessionResult = buildAuthSessionFromHubUser(candidate, issuedAt);
  if (!sessionResult.success) {
    return sessionResult;
  }

  if (!candidate.authProviderId) {
    await prisma.user.update({
      data: {
        authProvider: "supabase",
        authProviderId: input.supabaseUserId,
      },
      where: { id: candidate.id },
    });
  }

  return {
    ...sessionResult,
    linkedBy: candidate.authProviderId ? "authProviderId" : "email",
  };
}
