import {
  AuditActionType,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendAccountConfirmationEmail } from "./email";
import { hashPassword, validatePasswordPolicy } from "./auth/passwords";
import {
  isControlledRegion,
  isSupportedLanguage,
  resolveControlledLearnerRole,
} from "./controlled-options";
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
  preferredLanguage: string;
  region: string;
  roleOther?: string;
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
        | "invalid-language"
        | "invalid-region"
        | "invalid-role"
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

export function buildRegistrationConfirmationUrl(
  authOrigin: string,
  tokenHash: string,
  nextPath?: string,
) {
  const callback = new URL("/auth/confirm", authOrigin);
  const safeNextPath = nextPath?.startsWith("/") && !nextPath.startsWith("//")
    ? nextPath
    : "/sign-in?notice=email-confirmed";
  callback.searchParams.set("token_hash", tokenHash);
  callback.searchParams.set("type", "signup");
  callback.searchParams.set("next", safeNextPath);
  return callback.toString();
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

type SupabaseSignupLinkResult = {
  data: {
    properties: { hashed_token?: string | null } | null;
    user: { id: string } | null;
  } | null;
  error: { message: string; name?: string } | null;
};

export type SupabaseSignupDependencies = {
  deleteUser: (userId: string) => Promise<{ error: { name?: string } | null }>;
  generateSignupLink: (input: {
    email: string;
    password: string;
    redirectTo: string;
  }) => Promise<SupabaseSignupLinkResult>;
  sendConfirmationEmail: (input: {
    confirmationUrl: string;
    email: string;
  }) => Promise<{ delivered: boolean }>;
};

export async function createSupabaseSignupIdentity(
  input: {
    authOrigin: string;
    confirmationNextPath?: string;
    email: string;
    password: string;
  },
  dependencies: SupabaseSignupDependencies,
): Promise<AuthRegistrationResult> {
  const { data, error } = await dependencies.generateSignupLink({
    email: input.email,
    password: input.password,
    redirectTo: new URL("/auth/confirm", input.authOrigin).toString(),
  });

  if (error) {
    console.error("Supabase signup link generation failed.", {
      errorType: error.name ?? "AuthError",
    });
    return {
      code: isDuplicateAccountError(error.message)
        ? "registration-not-completed"
        : "supabase-registration-failed",
      provider: "supabase",
      success: false,
    };
  }

  const userId = data?.user?.id;
  const tokenHash = data?.properties?.hashed_token;
  if (!userId || !tokenHash) {
    return {
      code: "registration-not-completed",
      provider: "supabase",
      success: false,
    };
  }

  const delivery = await dependencies.sendConfirmationEmail({
    confirmationUrl: buildRegistrationConfirmationUrl(
      input.authOrigin,
      tokenHash,
      input.confirmationNextPath,
    ),
    email: input.email,
  });
  if (!delivery.delivered) {
    const { error: cleanupError } = await dependencies.deleteUser(userId);
    if (cleanupError) {
      console.error("Supabase signup cleanup failed after confirmation email delivery failure.", {
        errorType: cleanupError.name ?? "AuthError",
      });
    }
    return {
      code: "supabase-registration-failed",
      provider: "supabase",
      success: false,
    };
  }

  return {
    emailConfirmationRequired: true,
    provider: "supabase",
    success: true,
    userId,
  };
}

async function registerAuthIdentity(
  email: string,
  password: string,
  supabaseClient?: SupabaseClient,
  authOrigin = getPublicAppUrl(),
  confirmationNextPath?: string,
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

  try {
    const { createSupabaseAdminClient } = await import("./supabase/admin");
    const admin = createSupabaseAdminClient();
    return await createSupabaseSignupIdentity(
      {
        authOrigin,
        confirmationNextPath,
        email,
        password,
      },
      {
        deleteUser: async (userId) => admin.auth.admin.deleteUser(userId),
        generateSignupLink: async (input) => {
          const { data, error } = await admin.auth.admin.generateLink({
            email: input.email,
            options: { redirectTo: input.redirectTo },
            password: input.password,
            type: "signup",
          });
          return { data, error };
        },
        sendConfirmationEmail: sendAccountConfirmationEmail,
      },
    );
  } catch (error) {
    console.error("Supabase signup service failed before account creation completed.", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return {
      code: "supabase-registration-failed",
      provider: "supabase",
      success: false,
    };
  }
}

export function buildOpenRegistrationUserCreateData(input: {
  authProvider: "local" | "supabase";
  authProviderId?: string | null;
  email: string;
  fullName: string;
  jobTitle: string;
  passwordHash?: string | null;
  preferredLanguage: string;
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
    preferredLanguage: input.preferredLanguage,
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
  preferredLanguage: string;
  registrationChannel: "course-invitation" | "open-registration";
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
        description: input.registrationChannel === "course-invitation"
          ? "Created an individual Hub learner account through a DEC course invitation."
          : "Created an individual Hub learner account through open registration.",
        entityId: user.id,
        entityType: "User",
        metadataJson: {
          consentAcknowledged: true,
          organizationLinkCreated: false,
          registrationChannel: input.registrationChannel,
        },
      },
    });

    return user;
  });
}

export async function registerOpenLearner(
  input: OpenRegistrationInput,
  supabaseClient?: SupabaseClient,
  authOrigin?: string,
  confirmationNextPath?: string,
  registrationChannel: "course-invitation" | "open-registration" = "open-registration",
): Promise<OpenRegistrationResult> {
  const email = normalizeOpenRegistrationEmail(input.email);
  const fullName = normalizeText(input.fullName);
  const organizationName = normalizeText(input.organizationName);
  const jobTitle = resolveControlledLearnerRole(input.jobTitle, input.roleOther);
  const preferredLanguage = normalizeText(input.preferredLanguage);
  const region = normalizeText(input.region);

  if (
    !email ||
    !fullName ||
    !organizationName ||
    !preferredLanguage ||
    !region ||
    !input.password ||
    !input.confirmPassword
  ) {
    return { code: "missing-fields", success: false };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { code: "invalid-email", success: false };
  }

  if (!isControlledRegion(region)) {
    return { code: "invalid-region", success: false };
  }

  if (!isSupportedLanguage(preferredLanguage)) {
    return { code: "invalid-language", success: false };
  }

  if (!jobTitle) {
    return { code: "invalid-role", success: false };
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

  const authRegistration = await registerAuthIdentity(
    email,
    input.password,
    supabaseClient,
    authOrigin,
    confirmationNextPath,
  );
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
      preferredLanguage,
      registrationChannel,
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

    if (isSupabaseRegistration && "userId" in authRegistration) {
      try {
        const { createSupabaseAdminClient } = await import("./supabase/admin");
        await createSupabaseAdminClient().auth.admin.deleteUser(authRegistration.userId);
      } catch (cleanupError) {
        console.error("Supabase signup cleanup failed after Hub profile creation failure.", {
          errorType: cleanupError instanceof Error ? cleanupError.name : "UnknownError",
        });
      }
    }

    console.error("Open learner profile creation failed after registration validation.", {
      authProvider: isSupabaseRegistration ? "supabase" : "local",
      error,
    });
    return { code: "profile-link-failed", success: false };
  }
}
