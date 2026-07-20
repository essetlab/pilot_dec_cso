import { AuditActionType, RoleKey, UserStatus } from "../../generated/prisma/enums";
import type { SupabaseClient } from "@supabase/supabase-js";
import { prisma } from "../prisma";
import { readSupabasePublicConfig } from "../supabase/config";
import { hashInvitationToken } from "./onboarding-invitations";
import { hashPassword, validatePasswordPolicy } from "./passwords";

export type InvitationValidationResult =
  | { ok: true; email: string; role: RoleKey }
  | { ok: false; code: "invalid-token" | "expired-token" | "used-token" };

export async function validateStaffInvitationToken(token: string): Promise<InvitationValidationResult> {
  const tokenHash = hashInvitationToken(token);
  const invitation = await prisma.onboardingInvitation.findUnique({
    where: { tokenHash },
  });

  if (!invitation) {
    return { code: "invalid-token", ok: false };
  }

  if (invitation.completedAt || invitation.usedAt) {
    return { code: "used-token", ok: false };
  }

  if (invitation.expiresAt.getTime() < Date.now()) {
    await prisma.onboardingInvitation.update({
      data: { attemptCount: { increment: 1 } },
      where: { id: invitation.id },
    });
    return { code: "expired-token", ok: false };
  }

  return { email: invitation.email, ok: true, role: invitation.role };
}

export async function completeStaffRegistration(input: {
  token: string;
  fullName: string;
  phone: string;
  jobTitle: string;
  department: string;
  password: string;
}, supabaseClient?: SupabaseClient) {
  if (!validatePasswordPolicy(input.password)) {
    return { code: "weak-password", success: false as const };
  }

  const tokenHash = hashInvitationToken(input.token);
  const invitation = await prisma.onboardingInvitation.findUnique({
    where: { tokenHash },
  });
  if (!invitation) {
    return { code: "invalid-token", success: false as const };
  }
  if (invitation.completedAt || invitation.usedAt) {
    return { code: "used-token", success: false as const };
  }
  if (invitation.expiresAt.getTime() < Date.now()) {
    await prisma.onboardingInvitation.update({
      data: { attemptCount: { increment: 1 } },
      where: { id: invitation.id },
    });
    return { code: "expired-token", success: false as const };
  }

  const supabaseConfig = readSupabasePublicConfig();
  let authProviderId: string | null = null;
  let emailConfirmationRequired = false;

  if (supabaseConfig) {
    if (!supabaseClient) {
      return { code: "registration-failed", success: false as const };
    }
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;
    let appOrigin = "http://localhost:3000";
    try {
      appOrigin = configuredUrl ? new URL(configuredUrl).origin : appOrigin;
    } catch {
      // Keep the local origin for malformed local configuration.
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email: invitation.email,
      password: input.password,
      options: {
        emailRedirectTo: `${appOrigin}/auth/callback?next=/sign-in?notice=email-confirmed`,
      },
    });

    if (error || !data.user?.id || data.user.identities?.length === 0) {
      return { code: "registration-failed", success: false as const };
    }

    authProviderId = data.user.id;
    emailConfirmationRequired = !data.session;
  }

  const passwordHash = supabaseConfig ? null : hashPassword(input.password);
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { email: invitation.email },
      select: { id: true, status: true },
    });
    if (!user) {
      throw new Error("missing-user");
    }

    await tx.user.update({
      data: {
        department: input.department.trim(),
        fullName: input.fullName.trim(),
        jobTitle: input.jobTitle.trim(),
        authProvider: supabaseConfig ? "supabase" : "local",
        authProviderId,
        passwordHash,
        phone: input.phone.trim(),
        status: UserStatus.ACTIVE,
      },
      where: { id: user.id },
    });

    await tx.onboardingInvitation.update({
      data: {
        attemptCount: { increment: 1 },
        completedAt: new Date(),
        usedAt: new Date(),
      },
      where: { id: invitation.id },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.USER_UPDATED,
        actorUserId: invitation.invitedByUserId,
        description: "Activated an invited staff account after registration.",
        entityId: user.id,
        entityType: "User",
        metadataJson: {
          previousStatus: user.status,
          registrationProvider: supabaseConfig ? "supabase" : "local",
          status: UserStatus.ACTIVE,
        },
      },
    });
  });

  return {
    code: emailConfirmationRequired ? "confirmation-email-sent" : "registration-complete",
    success: true as const,
  };
}
