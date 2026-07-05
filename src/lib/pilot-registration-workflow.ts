import {
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import { createClient } from "@supabase/supabase-js";
import { hashPassword, validatePasswordPolicy } from "./auth/passwords";
import { prisma } from "./prisma";
import { readSupabasePublicConfig } from "./supabase/config";

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
  | {
      authProvider: "local" | "supabase";
      code: "created";
      email: string;
      success: true;
      userId: string;
    }
  | {
      code:
        | "duplicate-email"
        | "email-not-invited"
        | "invalid-access-code"
        | "missing-fields"
        | "profile-link-failed"
        | "password-mismatch"
        | "supabase-account-exists"
        | "supabase-registration-failed"
        | "terms-required"
        | "weak-password";
      success: false;
    };

const DEFAULT_PILOT_ACCESS_CODE = "HRBA-PILOT-2026";

type SupabasePilotSignUpResult =
  | { provider: "local" }
  | { provider: "supabase"; success: true; userId: string }
  | {
      code: "supabase-account-exists" | "supabase-registration-failed";
      provider: "supabase";
      success: false;
    };

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

export function isSupabasePilotRegistrationConfigured() {
  return Boolean(readSupabasePublicConfig());
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

export function buildPilotLearnerUserCreateData(input: {
  authProvider: "local" | "supabase";
  authProviderId?: string | null;
  email: string;
  fullName: string;
  jobTitle: string;
  learnerType: PilotLearnerType;
  organizationId: string;
  passwordHash?: string | null;
  region: string;
}) {
  return {
    authProvider: input.authProvider,
    authProviderId: input.authProviderId ?? null,
    department:
      input.learnerType === "cso-focal-person"
        ? "CSO focal person"
        : "Participant",
    email: input.email,
    fullName: input.fullName,
    jobTitle: input.jobTitle,
    organizationId: input.organizationId,
    passwordHash: input.passwordHash ?? null,
    region: input.region,
    status: UserStatus.ACTIVE,
  };
}

function isSupabaseDuplicateAccountError(message: string) {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("already registered") ||
    normalized.includes("already exists") ||
    normalized.includes("user already") ||
    normalized.includes("duplicate")
  );
}

async function signUpSupabasePilotLearner(
  email: string,
  password: string,
): Promise<SupabasePilotSignUpResult> {
  const config = readSupabasePublicConfig();

  if (!config) {
    return { provider: "local" as const };
  }

  const supabase = createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      code: isSupabaseDuplicateAccountError(error.message)
        ? "supabase-account-exists"
        : "supabase-registration-failed",
      provider: "supabase" as const,
      success: false as const,
    };
  }

  if (
    data.user &&
    Array.isArray(data.user.identities) &&
    data.user.identities.length === 0
  ) {
    return {
      code: "supabase-account-exists" as const,
      provider: "supabase" as const,
      success: false as const,
    };
  }

  if (!data.user?.id) {
    return {
      code: "supabase-registration-failed" as const,
      provider: "supabase" as const,
      success: false as const,
    };
  }

  return {
    provider: "supabase" as const,
    success: true as const,
    userId: data.user.id,
  };
}

async function createPilotLearnerProfile(input: {
  authProvider: "local" | "supabase";
  authProviderId?: string | null;
  email: string;
  fullName: string;
  jobTitle: string;
  learnerType: PilotLearnerType;
  organizationName: string;
  passwordHash?: string | null;
  region: string;
}) {
  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.upsert({
      create: {
        name: input.organizationName,
        region: input.region,
        status: OrganizationStatus.ACTIVE,
      },
      update: {
        region: input.region,
        status: OrganizationStatus.ACTIVE,
      },
      where: { name: input.organizationName },
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
      data: buildPilotLearnerUserCreateData({
        authProvider: input.authProvider,
        authProviderId: input.authProviderId,
        email: input.email,
        fullName: input.fullName,
        jobTitle: input.jobTitle,
        learnerType: input.learnerType,
        organizationId: organization.id,
        passwordHash: input.passwordHash,
        region: input.region,
      }),
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

  const supabaseSignUp = await signUpSupabasePilotLearner(email, input.password);

  if ("success" in supabaseSignUp && !supabaseSignUp.success) {
    return { code: supabaseSignUp.code, success: false };
  }

  const isSupabaseRegistration =
    supabaseSignUp.provider === "supabase" && "userId" in supabaseSignUp;

  try {
    const result = await createPilotLearnerProfile({
      authProvider: isSupabaseRegistration ? "supabase" : "local",
      authProviderId: isSupabaseRegistration ? supabaseSignUp.userId : null,
      email,
      fullName,
      jobTitle,
      learnerType: input.learnerType,
      organizationName,
      passwordHash: isSupabaseRegistration ? null : hashPassword(input.password),
      region,
    });

    return {
      authProvider: isSupabaseRegistration ? "supabase" : "local",
      code: "created",
      email,
      success: true,
      userId: result.id,
    };
  } catch (error) {
    console.error("Pilot learner profile creation failed after registration validation.", {
      authProvider: isSupabaseRegistration ? "supabase" : "local",
      error,
    });

    return { code: "profile-link-failed", success: false };
  }
}
