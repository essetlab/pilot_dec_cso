"use server";

import { UserStatus } from "@/generated/prisma/enums";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getDemoUserById, toAuthSession } from "@/lib/auth/demo-users";
import { canUsePilotAccount, resolveSupabaseHubSession } from "@/lib/auth/hub-session";
import { verifyPassword } from "@/lib/auth/passwords";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { isRoleKey, type RoleKey } from "@/lib/auth/roles";
import { clearCurrentSession, setCurrentSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export async function signInDemoUser(formData: FormData) {
  if (readSupabasePublicConfig()) {
    redirect("/sign-in?error=demo-unavailable");
  }

  if (process.env.NODE_ENV === "production") {
    redirect("/sign-in?error=demo-unavailable");
  }

  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isLocalHostRequest = host.includes("localhost") || host.includes("127.0.0.1");
  if (!isLocalHostRequest) {
    redirect("/sign-in?error=demo-unavailable");
  }

  const isLocalTest = process.env.APP_ENVIRONMENT === "local-test";
  const allowDemoAuth = process.env.ALLOW_LOCAL_DEMO_AUTH === "true";
  const dbUrl = process.env.DATABASE_URL || "";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const protectedProjectIds = ["fgyxbzwdvngqlksyxuwa", "bhzyrthinbyqgsetnoph"];
  const isProtected = protectedProjectIds.some(
    (id) => dbUrl.includes(id) || supabaseUrl.includes(id) || supabaseKey.includes(id)
  );
  const isLocalHost =
    dbUrl.includes("localhost") ||
    dbUrl.includes("127.0.0.1") ||
    dbUrl.includes("file:") ||
    dbUrl.includes("dev.db");

  if (!isLocalTest || !allowDemoAuth || isProtected || !isLocalHost) {
    redirect("/sign-in?error=demo-unavailable");
  }

  const userId = formData.get("userId");

  if (typeof userId !== "string") {
    redirect("/sign-in?error=missing-user");
  }

  const demoUser = getDemoUserById(userId);

  if (!demoUser) {
    redirect("/sign-in?error=unknown-user");
  }

  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      select: {
        email: true,
        fullName: true,
        id: true,
        organization: { select: { status: true } },
        roleAssignments: {
          select: {
            expiresAt: true,
            isActive: true,
            role: { select: { key: true } },
          },
        },
        status: true,
      },
      where: { email: demoUser.email },
    });
  } catch (err) {
    console.error("Database lookup failed in signInDemoUser:", err);
    if (isLocalTest && allowDemoAuth) {
      console.warn("Local sandbox database query failed. Falling back to local mock session.");
    } else {
      redirect("/sign-in?error=service-unavailable");
    }
  }

  if (dbUser && dbUser.status !== UserStatus.ACTIVE) {
    redirect("/sign-in?error=inactive-user");
  }

  if (dbUser) {
    const roles = dbUser.roleAssignments
      .filter((assignment) =>
        assignment.isActive &&
        (!assignment.expiresAt || assignment.expiresAt.getTime() > Date.now()) &&
        isRoleKey(assignment.role.key),
      )
      .map((assignment) => assignment.role.key);

    if (
      roles.length === 0 ||
      !canUsePilotAccount({
        organizationStatus: dbUser.organization?.status ?? null,
        roles,
        status: dbUser.status,
      })
    ) {
      redirect("/sign-in?error=inactive-user");
    }

    await setCurrentSession({
      email: dbUser.email,
      issuedAt: new Date().toISOString(),
      name: dbUser.fullName,
      roles,
      userId: dbUser.id,
    });
  } else {
    await setCurrentSession(toAuthSession(demoUser));
  }

  redirect(safeRedirectPath(formData.get("next"), demoUser.defaultPath));
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

async function signInWithSupabasePassword(input: {
  email: string;
  formData: FormData;
  password: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.user?.id) {
    redirect(
      `/sign-in?error=${safeSupabaseSignInErrorCode(error?.message)}`,
    );
  }

  const sessionResult = await resolveSupabaseHubSession({
    email: data.user.email ?? input.email,
    issuedAt: data.user.last_sign_in_at ?? new Date().toISOString(),
    supabaseUserId: data.user.id,
  });

  if (!sessionResult.success) {
    await supabase.auth.signOut();
    await clearCurrentSession();
    redirect(`/sign-in?error=${hubSessionErrorCode(sessionResult.code)}`);
  }

  await setCurrentSession(sessionResult.session);
  redirect(
    safeRedirectPath(
      input.formData.get("next"),
      defaultPathForRoles(sessionResult.session.roles),
    ),
  );
}

export async function signInWithPassword(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/sign-in?error=missing-credentials");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (isRateLimited(`signin:${normalizedEmail}`, 8, 10 * 60 * 1000)) {
    redirect("/sign-in?error=too-many-attempts");
  }

  if (readSupabasePublicConfig()) {
    return signInWithSupabasePassword({
      email: normalizedEmail,
      formData,
      password,
    });
  }

  const dbUser = await prisma.user.findUnique({
    select: {
      email: true,
      fullName: true,
      id: true,
      organization: { select: { status: true } },
      passwordHash: true,
      roleAssignments: {
        select: {
          expiresAt: true,
          isActive: true,
          role: { select: { key: true } },
        },
      },
      status: true,
    },
    where: { email: normalizedEmail },
  });

  if (!dbUser || dbUser.status !== UserStatus.ACTIVE || !dbUser.passwordHash) {
    redirect("/sign-in?error=invalid-credentials");
  }

  if (!verifyPassword(password, dbUser.passwordHash)) {
    redirect("/sign-in?error=invalid-credentials");
  }

  const roles = dbUser.roleAssignments
    .filter((assignment) =>
      assignment.isActive &&
      (!assignment.expiresAt || assignment.expiresAt.getTime() > Date.now()) &&
      isRoleKey(assignment.role.key),
    )
    .map((assignment) => assignment.role.key);

  if (
    roles.length === 0 ||
    !canUsePilotAccount({
      organizationStatus: dbUser.organization?.status ?? null,
      roles,
      status: dbUser.status,
    })
  ) {
    redirect("/sign-in?error=inactive-user");
  }

  const nextPath = safeRedirectPath(formData.get("next"), defaultPathForRoles(roles));

  await setCurrentSession({
    email: dbUser.email,
    issuedAt: new Date().toISOString(),
    name: dbUser.fullName,
    roles,
    userId: dbUser.id,
  });

  redirect(nextPath);
}
