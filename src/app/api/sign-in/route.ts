import { UserStatus } from "@/generated/prisma/enums";
import { resolveSupabaseHubSession } from "@/lib/auth/hub-session";
import { verifyPassword } from "@/lib/auth/passwords";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { isRoleKey, type RoleKey } from "@/lib/auth/roles";
import {
  AUTH_COOKIE_NAME,
  createSessionCookieValue,
  getSessionSecret,
  type AuthSession,
} from "@/lib/auth/session-codec";
import { prisma } from "@/lib/prisma";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ?? false,
  path: "/",
  maxAge: 60 * 60 * 8,
};

function safeRedirectPath(value: FormDataEntryValue | null, fallback: string) {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return fallback;
}

function defaultPathForRoles(roles: RoleKey[]) {
  if (roles.includes("SUPER_ADMIN") || roles.includes("PLATFORM_ADMIN")) {
    return "/admin";
  }

  if (roles.includes("COURSE_CREATOR")) {
    return "/creator";
  }

  if (roles.includes("COURSE_REVIEWER")) {
    return "/admin/review";
  }

  if (roles.includes("ME_VIEWER")) {
    return "/admin/monitoring";
  }

  return "/learn";
}

function signInErrorRedirect(request: NextRequest, error: string) {
  return NextResponse.redirect(new URL(`/sign-in?error=${error}`, request.url), {
    status: 303,
  });
}

async function sessionRedirect(
  request: NextRequest,
  path: string,
  session: AuthSession,
) {
  const response = NextResponse.redirect(new URL(path, request.url), {
    status: 303,
  });
  const cookieValue = await createSessionCookieValue(
    session,
    getSessionSecret(),
  );

  response.cookies.set(AUTH_COOKIE_NAME, cookieValue, sessionCookieOptions);

  return response;
}

function safeSupabaseSignInErrorCode(message: string | undefined) {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (
    normalizedMessage.includes("email not confirmed") ||
    normalizedMessage.includes("not confirmed") ||
    normalizedMessage.includes("confirmation")
  ) {
    return "confirmation-required";
  }

  return "invalid-credentials";
}

function hubSessionErrorCode(code: "hub-profile-missing" | "inactive-user" | "missing-roles") {
  if (code === "hub-profile-missing") {
    return "hub-profile-missing";
  }

  if (code === "missing-roles") {
    return "missing-roles";
  }

  return "inactive-user";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return signInErrorRedirect(request, "missing-credentials");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (isRateLimited(`signin:${normalizedEmail}`, 8, 10 * 60 * 1000)) {
    return signInErrorRedirect(request, "too-many-attempts");
  }

  if (readSupabasePublicConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user?.id) {
      return signInErrorRedirect(
        request,
        safeSupabaseSignInErrorCode(error?.message),
      );
    }

    const sessionResult = await resolveSupabaseHubSession({
      email: data.user.email ?? normalizedEmail,
      issuedAt: data.user.last_sign_in_at ?? new Date().toISOString(),
      supabaseUserId: data.user.id,
    });

    if (!sessionResult.success) {
      await supabase.auth.signOut();

      return signInErrorRedirect(
        request,
        hubSessionErrorCode(sessionResult.code),
      );
    }

    return sessionRedirect(
      request,
      safeRedirectPath(
        formData.get("next"),
        defaultPathForRoles(sessionResult.session.roles),
      ),
      sessionResult.session,
    );
  }

  const dbUser = await prisma.user.findUnique({
    select: {
      email: true,
      fullName: true,
      id: true,
      passwordHash: true,
      roleAssignments: {
        select: {
          isActive: true,
          role: { select: { key: true } },
        },
      },
      status: true,
    },
    where: { email: normalizedEmail },
  });

  if (!dbUser || dbUser.status !== UserStatus.ACTIVE || !dbUser.passwordHash) {
    return signInErrorRedirect(request, "invalid-credentials");
  }

  if (!verifyPassword(password, dbUser.passwordHash)) {
    return signInErrorRedirect(request, "invalid-credentials");
  }

  const roles = dbUser.roleAssignments
    .filter((assignment) => assignment.isActive && isRoleKey(assignment.role.key))
    .map((assignment) => assignment.role.key);

  if (roles.length === 0) {
    return signInErrorRedirect(request, "inactive-user");
  }

  return sessionRedirect(
    request,
    safeRedirectPath(formData.get("next"), defaultPathForRoles(roles)),
    {
      email: dbUser.email,
      issuedAt: new Date().toISOString(),
      name: dbUser.fullName,
      roles,
      userId: dbUser.id,
    },
  );
}
