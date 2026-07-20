import {
  AuditActionType,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import type { SupabaseClient } from "@supabase/supabase-js";
import { hashPassword, validatePasswordPolicy } from "./auth/passwords";
import {
  getDefaultPilotAccessCodeForLocalDev,
  isConfiguredPilotEmail,
  isPilotAccessCodeValid,
  resolvePilotRegistrationMode,
  type PilotRegistrationMode,
} from "./pilot-registration-config";
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
      emailConfirmationRequired: boolean;
      success: true;
      userId: string;
    }
  | {
      code:
        | "email-not-invited"
        | "invalid-access-code"
        | "missing-fields"
        | "organization-not-approved"
        | "profile-link-failed"
        | "registration-unavailable"
        | "registration-not-completed"
        | "password-mismatch"
        | "supabase-account-exists"
        | "supabase-registration-failed"
        | "terms-required"
        | "weak-password";
      success: false;
    };

type SupabasePilotSignUpResult =
  | { provider: "local" }
  | {
      emailConfirmationRequired: boolean;
      provider: "supabase";
      success: true;
      userId: string;
    }
  | {
      code: "supabase-account-exists" | "supabase-registration-failed";
      provider: "supabase";
      success: false;
    };

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeText(value: string, maxLength = 160) {
  return value.trim().slice(0, maxLength);
}

function getPublicAppUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;

  try {
    return configured ? new URL(configured).origin : "http://localhost:3000";
  } catch {
    return "http://localhost:3000";
  }
}

export function getPilotRegistrationModeLabel() {
  return resolvePilotRegistrationMode().label;
}

export { getDefaultPilotAccessCodeForLocalDev, resolvePilotRegistrationMode };

export function isSupabasePilotRegistrationConfigured() {
  return Boolean(readSupabasePublicConfig());
}

async function isEmailAllowed(email: string, mode: PilotRegistrationMode) {
  if (mode === "simple") {
    return true;
  }

  if (mode === "unavailable") {
    return false;
  }

  if (isConfiguredPilotEmail(email)) {
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
  supabaseClient?: SupabaseClient,
): Promise<SupabasePilotSignUpResult> {
  const config = readSupabasePublicConfig();

  if (!config) {
    return { provider: "local" as const };
  }

  if (!supabaseClient) {
    return {
      code: "supabase-registration-failed",
      provider: "supabase",
      success: false,
    };
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getPublicAppUrl()}/auth/callback?next=/sign-in?notice=email-confirmed`,
    },
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
    emailConfirmationRequired: !data.session,
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
    const organization = await tx.organization.findFirst({
      select: { id: true },
      where: {
        name: { equals: input.organizationName, mode: "insensitive" },
        status: OrganizationStatus.ACTIVE,
      },
    });

    if (!organization) {
      throw new Error("APPROVED_ORGANIZATION_NOT_FOUND");
    }

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

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.USER_CREATED,
        actorUserId: user.id,
        description: "Created an individual pilot learner account.",
        entityId: user.id,
        entityType: "User",
        metadataJson: {
          consentAcknowledged: true,
          organizationId: organization.id,
          registrationChannel: "controlled-pilot-registration",
        },
      },
    });

    return user;
  });
}

export async function registerPilotLearner(
  input: PilotRegistrationInput,
  supabaseClient?: SupabaseClient,
): Promise<PilotRegistrationResult> {
  const email = normalizeEmail(input.email);
  const fullName = normalizeText(input.fullName);
  const organizationName = normalizeText(input.organizationName);
  const jobTitle = normalizeText(input.jobTitle);
  const region = normalizeText(input.region);
  const accessCode = input.accessCode.trim();

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

  const registrationMode = resolvePilotRegistrationMode();
  if (registrationMode.mode === "unavailable") {
    return { code: "registration-unavailable", success: false };
  }

  if (!isPilotAccessCodeValid(accessCode)) {
    return { code: "invalid-access-code", success: false };
  }

  if (!(await isEmailAllowed(email, registrationMode.mode))) {
    return { code: "email-not-invited", success: false };
  }

  const existingUser = await prisma.user.findUnique({
    select: { id: true },
    where: { email },
  });

  if (existingUser) {
    return { code: "registration-not-completed", success: false };
  }

  const approvedOrganization = await prisma.organization.findFirst({
    select: { id: true },
    where: {
      name: { equals: organizationName, mode: "insensitive" },
      status: OrganizationStatus.ACTIVE,
    },
  });

  if (!approvedOrganization) {
    return { code: "organization-not-approved", success: false };
  }

  const supabaseSignUp = await signUpSupabasePilotLearner(
    email,
    input.password,
    supabaseClient,
  );

  if ("success" in supabaseSignUp && !supabaseSignUp.success) {
    return {
      code:
        supabaseSignUp.code === "supabase-account-exists"
          ? "registration-not-completed"
          : supabaseSignUp.code,
      success: false,
    };
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
      emailConfirmationRequired:
        isSupabaseRegistration && supabaseSignUp.provider === "supabase"
          ? supabaseSignUp.emailConfirmationRequired
          : false,
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
