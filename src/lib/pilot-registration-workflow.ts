import {
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import { hashPassword, validatePasswordPolicy } from "./auth/passwords";
import { prisma } from "./prisma";

export type PilotLearnerType = "participant" | "cso-focal-person";

export type PilotRegistrationInput = {
  accessCode: string;
  confirmPassword: string;
  consentAccepted: boolean;
  email: string;
  fullName: string;
  jobTitle: string;
  learnerType: PilotLearnerType;
  organizationName: string;
  password: string;
  region: string;
};

export type PilotRegistrationResult =
  | { code: "created"; email: string; success: true; userId: string }
  | {
      code:
        | "duplicate-email"
        | "email-not-invited"
        | "invalid-access-code"
        | "missing-fields"
        | "password-mismatch"
        | "terms-required"
        | "weak-password";
      success: false;
    };

const DEFAULT_PILOT_ACCESS_CODE = "HRBA-PILOT-2026";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeAccessCode(value: string) {
  return value.trim().toUpperCase();
}

function normalizeText(value: string, maxLength = 160) {
  return value.trim().slice(0, maxLength);
}

function configuredAccessCodes() {
  return (process.env.PILOT_ACCESS_CODES ?? process.env.PILOT_ACCESS_CODE ?? DEFAULT_PILOT_ACCESS_CODE)
    .split(",")
    .map(normalizeAccessCode)
    .filter(Boolean);
}

function configuredInvitedEmails() {
  return (process.env.PILOT_INVITED_EMAILS ?? "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
}

function usesStrictInvitedEmailMode() {
  return process.env.PILOT_REGISTRATION_MODE?.trim().toLowerCase() === "strict";
}

export function getPilotRegistrationModeLabel() {
  return usesStrictInvitedEmailMode() ? "Strict invited-email mode" : "Simple access-code mode";
}

export function getDefaultPilotAccessCodeForLocalDev() {
  return DEFAULT_PILOT_ACCESS_CODE;
}

async function isEmailAllowed(email: string) {
  if (!usesStrictInvitedEmailMode()) {
    return true;
  }

  const invitedEmails = configuredInvitedEmails();
  if (invitedEmails.includes(email)) {
    return true;
  }

  const invitation = await prisma.onboardingInvitation.findUnique({
    select: {
      completedAt: true,
      expiresAt: true,
      role: true,
      usedAt: true,
    },
    where: { email },
  });

  return Boolean(
    invitation &&
      invitation.role === RoleKey.PARTICIPANT &&
      !invitation.completedAt &&
      !invitation.usedAt &&
      invitation.expiresAt.getTime() >= Date.now(),
  );
}

export async function registerPilotLearner(
  input: PilotRegistrationInput,
): Promise<PilotRegistrationResult> {
  const email = normalizeEmail(input.email);
  const fullName = normalizeText(input.fullName);
  const organizationName = normalizeText(input.organizationName);
  const jobTitle = normalizeText(input.jobTitle);
  const region = normalizeText(input.region);
  const accessCode = normalizeAccessCode(input.accessCode);

  if (
    !email ||
    !fullName ||
    !organizationName ||
    !jobTitle ||
    !region ||
    !accessCode ||
    !input.password ||
    !input.confirmPassword ||
    !["participant", "cso-focal-person"].includes(input.learnerType)
  ) {
    return { code: "missing-fields", success: false };
  }

  if (!input.consentAccepted) {
    return { code: "terms-required", success: false };
  }

  if (input.password !== input.confirmPassword) {
    return { code: "password-mismatch", success: false };
  }

  if (!validatePasswordPolicy(input.password)) {
    return { code: "weak-password", success: false };
  }

  if (!configuredAccessCodes().includes(accessCode)) {
    return { code: "invalid-access-code", success: false };
  }

  if (!(await isEmailAllowed(email))) {
    return { code: "email-not-invited", success: false };
  }

  const existingUser = await prisma.user.findUnique({
    select: { id: true },
    where: { email },
  });

  if (existingUser) {
    return { code: "duplicate-email", success: false };
  }

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.upsert({
      create: {
        name: organizationName,
        region,
        status: OrganizationStatus.ACTIVE,
      },
      update: {
        region,
        status: OrganizationStatus.ACTIVE,
      },
      where: { name: organizationName },
    });

    const participantRole = await tx.role.upsert({
      create: {
        description: "Learner access to courses, progress, and certificates.",
        key: RoleKey.PARTICIPANT,
        name: "Participant",
      },
      update: {},
      where: { key: RoleKey.PARTICIPANT },
    });

    const user = await tx.user.create({
      data: {
        department:
          input.learnerType === "cso-focal-person"
            ? "CSO focal person"
            : "Participant",
        email,
        fullName,
        jobTitle,
        organizationId: organization.id,
        passwordHash: hashPassword(input.password),
        region,
        status: UserStatus.ACTIVE,
      },
    });

    await tx.userRoleAssignment.create({
      data: {
        assignedById: user.id,
        isActive: true,
        roleId: participantRole.id,
        userId: user.id,
      },
    });

    return user;
  });

  return {
    code: "created",
    email,
    success: true,
    userId: result.id,
  };
}
