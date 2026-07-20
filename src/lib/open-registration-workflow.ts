import { AuditActionType, RoleKey, UserStatus } from "../generated/prisma/enums";
import type { SupabaseClient } from "@supabase/supabase-js";
import { hashPassword, validatePasswordPolicy } from "./auth/passwords";
import { prisma } from "./prisma";
import { readSupabasePublicConfig } from "./supabase/config";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type OpenRegistrationInput = {
  confirmPassword: string;
  consentAccepted: boolean;
  email: string;
  fullName: string;
  jobTitle: string;
  organizationName: string;
  password: string;
  region: string;
};

export type OpenRegistrationResult =
  | {
      authProvider: "local" | "supabase";
      code: "created";
      emailConfirmationRequired: boolean;
      success: true;
      userId: string;
    }
  | {
      code:
        | "invalid-email"
        | "missing-fields"
        | "password-mismatch"
        | "profile-link-failed"
        | "registration-not-completed"
        | "supabase-registration-failed"
        | "terms-required"
        | "weak-password";
      success: false;
    };

type AuthRegistrationResult =
  | { provider: "local" }
  | {
      emailConfirmationRequired: boolean;
      provider: "supabase";
      success: true;
      userId: string;
    }
  | {
      code: "registration-not-completed" | "supabase-registration-failed";
      provider: "supabase";
      success: false;
    };

export function normalizeOpenRegistrationEmail(value: string) {
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

function isDuplicateAccountError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("already registered") ||
    normalized.includes("already exists") ||
    normalized.includes("user already") ||
    normalized.includes("duplicate")
  );
}

async function registerAuthIdentity(
  email: string,
  password: string,
  supabaseClient?: SupabaseClient,
): Promise<AuthRegistrationResult> {
  if (!readSupabasePublicConfig()) {
    return { provider: "local" };
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
      code: isDuplicateAccountError(error.message)
        ? "registration-not-completed"
        : "supabase-registration-failed",
      provider: "supabase",
      success: false,
    };
  }

  if (
    !data.user?.id ||
    (Array.isArray(data.user.identities) && data.user.identities.length === 0)
  ) {
    return {
      code: "registration-not-completed",
      provider: "supabase",
      success: false,
    };
  }

  return {
    emailConfirmationRequired: !data.session,
    provider: "supabase",
    success: true,
    userId: data.user.id,
  };
}

export function buildOpenRegistrationUserCreateData(input: {
  authProvider: "local" | "supabase";
  authProviderId?: string | null;
  email: string;
  fullName: string;
  jobTitle: string;
  passwordHash?: string | null;
  region: string;
  selfReportedOrganizationName: string;
}) {
  return {
    authProvider: input.authProvider,
    authProviderId: input.authProviderId ?? null,
    department: "Participant",
    email: input.email,
    fullName: input.fullName,
    jobTitle: input.jobTitle,
    organizationId: null,
    passwordHash: input.passwordHash ?? null,
    region: input.region,
    selfReportedOrganizationName: input.selfReportedOrganizationName,
    status: UserStatus.ACTIVE,
  };
}

async function createOpenRegistrationProfile(input: {
  authProvider: "local" | "supabase";
  authProviderId?: string | null;
  email: string;
  fullName: string;
  jobTitle: string;
  passwordHash?: string | null;
  region: string;
  selfReportedOrganizationName: string;
}) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email: input.email } });
    if (existing) {
      if (
        input.authProviderId &&
        existing.authProviderId === input.authProviderId &&
        existing.authProvider === input.authProvider
      ) {
        return existing;
      }
      throw new Error("ACCOUNT_ALREADY_EXISTS");
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
      data: buildOpenRegistrationUserCreateData(input),
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
        description: "Created an individual Hub learner account through open registration.",
        entityId: user.id,
        entityType: "User",
        metadataJson: {
          consentAcknowledged: true,
          organizationLinkCreated: false,
          registrationChannel: "open-registration",
        },
      },
    });

    return user;
  });
}

export async function registerOpenLearner(
  input: OpenRegistrationInput,
  supabaseClient?: SupabaseClient,
): Promise<OpenRegistrationResult> {
  const email = normalizeOpenRegistrationEmail(input.email);
  const fullName = normalizeText(input.fullName);
  const organizationName = normalizeText(input.organizationName);
  const jobTitle = normalizeText(input.jobTitle);
  const region = normalizeText(input.region);

  if (
    !email ||
    !fullName ||
    !organizationName ||
    !jobTitle ||
    !region ||
    !input.password ||
    !input.confirmPassword
  ) {
    return { code: "missing-fields", success: false };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { code: "invalid-email", success: false };
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

  const existingUser = await prisma.user.findUnique({
    select: { id: true },
    where: { email },
  });
  if (existingUser) {
    return { code: "registration-not-completed", success: false };
  }

  const authRegistration = await registerAuthIdentity(email, input.password, supabaseClient);
  if ("success" in authRegistration && !authRegistration.success) {
    return { code: authRegistration.code, success: false };
  }

  const isSupabaseRegistration =
    authRegistration.provider === "supabase" && "userId" in authRegistration;

  try {
    const user = await createOpenRegistrationProfile({
      authProvider: isSupabaseRegistration ? "supabase" : "local",
      authProviderId: isSupabaseRegistration ? authRegistration.userId : null,
      email,
      fullName,
      jobTitle,
      passwordHash: isSupabaseRegistration ? null : hashPassword(input.password),
      region,
      selfReportedOrganizationName: organizationName,
    });

    return {
      authProvider: isSupabaseRegistration ? "supabase" : "local",
      code: "created",
      emailConfirmationRequired:
        isSupabaseRegistration && authRegistration.provider === "supabase"
          ? authRegistration.emailConfirmationRequired
          : false,
      success: true,
      userId: user.id,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "ACCOUNT_ALREADY_EXISTS") {
      return { code: "registration-not-completed", success: false };
    }

    console.error("Open learner profile creation failed after registration validation.", {
      authProvider: isSupabaseRegistration ? "supabase" : "local",
      error,
    });
    return { code: "profile-link-failed", success: false };
  }
}
