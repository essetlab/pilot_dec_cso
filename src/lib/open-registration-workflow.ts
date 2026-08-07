import {
  AuditActionType,
  CourseStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import type { SupabaseClient } from "@supabase/supabase-js";
import { hashPassword, validatePasswordPolicy } from "./auth/passwords";
import {
  isControlledRegion,
  isSupportedLanguage,
  resolveControlledLearnerRole,
} from "./controlled-options";
import { prisma } from "./prisma";
import { readSupabasePublicConfig } from "./supabase/config";
import {
  HRBA_EXTERNAL_COURSE_ID,
  HRBA_EXTERNAL_COURSE_VERSION_ID,
} from "./external-course-config";
import { resolveCourseInvitationToken } from "./course-invitation-workflow";
import { isControlledHubAccess } from "./hub-access-policy";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type OpenRegistrationInput = {
  confirmPassword: string;
  consentAccepted: boolean;
  courseInvitationToken?: string;
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
      userId?: string;
    }
  | {
      code:
        | "account-exists"
        | "invalid-email"
        | "invalid-language"
        | "invalid-region"
        | "invalid-role"
        | "invitation-required"
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
      userId: string | null;
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
  authOrigin = getPublicAppUrl(),
  confirmationNext = "/sign-in?notice=email-confirmed",
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

  const callbackUrl = new URL("/auth/callback", authOrigin);
  callbackUrl.searchParams.set("next", confirmationNext);
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    if (isDuplicateAccountError(error.message)) {
      const signIn = await supabaseClient.auth.signInWithPassword({ email, password });
      if (signIn.data.user?.id) {
        return {
          emailConfirmationRequired: false,
          provider: "supabase",
          success: true,
          userId: signIn.data.user.id,
        };
      }

      const resent = await supabaseClient.auth.resend({
        email,
        options: { emailRedirectTo: callbackUrl.toString() },
        type: "signup",
      });
      if (!resent.error) {
        return {
          emailConfirmationRequired: true,
          provider: "supabase",
          success: true,
          userId: null,
        };
      }
    }
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
  assignDefaultHrba: boolean;
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

    let hrbaAssignmentId: string | null = null;
    let hrbaCourseVersionId: string | null = null;
    if (input.assignDefaultHrba) {
      const hrbaCourse = await tx.course.findFirst({
      select: {
        createdById: true,
        id: true,
        versions: {
          select: { id: true },
          where: {
            id: HRBA_EXTERNAL_COURSE_VERSION_ID,
            status: CourseStatus.PUBLISHED,
          },
        },
      },
      where: {
        archivedAt: null,
        id: HRBA_EXTERNAL_COURSE_ID,
        status: CourseStatus.PUBLISHED,
      },
    });

      const hrbaVersion = hrbaCourse?.versions[0];
      if (!hrbaCourse || !hrbaVersion) {
        throw new Error("HRBA_COURSE_UNAVAILABLE");
      }

      const hrbaAssignment = await tx.courseAssignment.upsert({
      create: {
        assignedById: hrbaCourse.createdById,
        assignmentType: "USER",
        courseId: hrbaCourse.id,
        courseVersionId: hrbaVersion.id,
        targetUserId: user.id,
      },
      update: {
        assignedAt: new Date(),
        assignedById: hrbaCourse.createdById,
        courseVersionId: hrbaVersion.id,
        isActive: true,
      },
      where: {
        courseId_targetUserId: {
          courseId: hrbaCourse.id,
          targetUserId: user.id,
        },
      },
      });
      hrbaAssignmentId = hrbaAssignment.id;
      hrbaCourseVersionId = hrbaVersion.id;
    }

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.USER_CREATED,
        actorUserId: user.id,
        description: input.assignDefaultHrba
          ? "Created an individual Hub learner account through open registration."
          : "Created an individual Hub learner account through a DEC course invitation.",
        entityId: user.id,
        entityType: "User",
        metadataJson: {
          consentAcknowledged: true,
          ...(hrbaAssignmentId
            ? { hrbaAssignmentId, hrbaCourseVersionId }
            : { controlledInvitationRegistration: true }),
          organizationLinkCreated: false,
          registrationChannel: input.assignDefaultHrba
            ? "open-registration"
            : "course-invitation",
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
): Promise<OpenRegistrationResult> {
  const controlledAccess = isControlledHubAccess();
  let email = normalizeOpenRegistrationEmail(input.email);
  let fullName = normalizeText(input.fullName);
  let organizationName = normalizeText(input.organizationName);
  let jobTitle = resolveControlledLearnerRole(input.jobTitle, input.roleOther);
  const preferredLanguage = normalizeText(input.preferredLanguage);
  const region = normalizeText(input.region);

  if (controlledAccess) {
    const invitation = await resolveCourseInvitationToken(
      input.courseInvitationToken ?? "",
    );
    if (!invitation.success) {
      return { code: "invitation-required", success: false };
    }
    email = invitation.context.invitedEmail;
    fullName = invitation.context.invitedName;
    organizationName = invitation.context.organization.name;
    jobTitle = invitation.context.invitedRoleOrPosition ?? jobTitle;
  }

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
    return {
      code: controlledAccess ? "account-exists" : "registration-not-completed",
      success: false,
    };
  }

  const authRegistration = await registerAuthIdentity(
    email,
    input.password,
    supabaseClient,
    authOrigin,
    controlledAccess
      ? "/course-invitations/reconcile"
      : "/sign-in?notice=email-confirmed",
  );
  if ("success" in authRegistration && !authRegistration.success) {
    return { code: authRegistration.code, success: false };
  }

  const isSupabaseRegistration =
    authRegistration.provider === "supabase" &&
    "userId" in authRegistration &&
    Boolean(authRegistration.userId);

  try {
    const user =
      authRegistration.provider === "supabase" &&
      "userId" in authRegistration &&
      !authRegistration.userId
        ? null
        : await createOpenRegistrationProfile({
            assignDefaultHrba: !controlledAccess,
            authProvider: isSupabaseRegistration ? "supabase" : "local",
            authProviderId:
              isSupabaseRegistration && "userId" in authRegistration
                ? authRegistration.userId
                : null,
            email,
            fullName,
            jobTitle,
            passwordHash: isSupabaseRegistration ? null : hashPassword(input.password),
            preferredLanguage,
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
      ...(user ? { userId: user.id } : {}),
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
