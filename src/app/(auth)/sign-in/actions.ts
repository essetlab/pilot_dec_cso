"use server";

import { UserStatus } from "@/generated/prisma/enums";
import { redirect } from "next/navigation";
import { getDemoUserById, toAuthSession } from "@/lib/auth/demo-users";
import { verifyPassword } from "@/lib/auth/passwords";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { isRoleKey, type RoleKey } from "@/lib/auth/roles";
import { setCurrentSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

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
  const userId = formData.get("userId");

  if (typeof userId !== "string") {
    redirect("/sign-in?error=missing-user");
  }

  const demoUser = getDemoUserById(userId);

  if (!demoUser) {
    redirect("/sign-in?error=unknown-user");
  }

  const dbUser = await prisma.user.findUnique({
    select: {
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
    },
    where: { email: demoUser.email },
  });

  if (dbUser && dbUser.status !== UserStatus.ACTIVE) {
    redirect("/sign-in?error=inactive-user");
  }

  if (dbUser) {
    const roles = dbUser.roleAssignments
      .filter((assignment) => assignment.isActive && isRoleKey(assignment.role.key))
      .map((assignment) => assignment.role.key);

    if (roles.length === 0) {
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
    redirect("/sign-in?error=invalid-credentials");
  }

  if (!verifyPassword(password, dbUser.passwordHash)) {
    redirect("/sign-in?error=invalid-credentials");
  }

  const roles = dbUser.roleAssignments
    .filter((assignment) => assignment.isActive && isRoleKey(assignment.role.key))
    .map((assignment) => assignment.role.key);

  if (roles.length === 0) {
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
