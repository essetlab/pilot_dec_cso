import { RoleKey, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../prisma";
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
}) {
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

  const passwordHash = hashPassword(input.password);
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { email: invitation.email },
      select: { id: true },
    });
    if (!user) {
      throw new Error("missing-user");
    }

    await tx.user.update({
      data: {
        department: input.department.trim(),
        fullName: input.fullName.trim(),
        jobTitle: input.jobTitle.trim(),
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
  });

  return { code: "registration-complete", success: true as const };
}
