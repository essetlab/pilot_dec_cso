"use server";

import { redirect } from "next/navigation";
import { resolvePublicAuthOrigin } from "@/lib/auth/public-auth-origin";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { registerOpenLearner } from "@/lib/open-registration-workflow";
import { isControlledLearnerRole, isControlledRegion } from "@/lib/controlled-options";
import { resolveCourseInvitationToken } from "@/lib/course-invitation-workflow";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DATABASE_CONNECTIVITY_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "P1001",
  "P1002",
  "P1003",
  "P1008",
  "P1017",
]);

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNextPath(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "";
}

function safeErrorCode(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return null;
  }

  const code = error.code;
  return typeof code === "string" && /^[A-Z][A-Z0-9_]{0,31}$/.test(code)
    ? code
    : null;
}

function safeErrorType(error: unknown) {
  const type = error instanceof Error ? error.name : "UnknownError";
  return /^[A-Za-z][A-Za-z0-9]{0,63}$/.test(type) ? type : "UnknownError";
}

export async function registerOpenLearnerAction(formData: FormData) {
  let email = formText(formData, "email").toLowerCase();
  const next = safeNextPath(formData.get("next"));
  let registrationChannel: "course-invitation" | "open-registration" = "open-registration";
  let organizationName = formText(formData, "organization");
  let region = formText(formData, "region");
  let jobTitle = formText(formData, "jobTitle");
  let roleOther = formText(formData, "roleOther");

  if (next) {
    const nextUrl = new URL(next, "https://hub.invalid");
    const token = nextUrl.pathname === "/course-invitations/accept"
      ? nextUrl.searchParams.get("token") ?? ""
      : "";

    if (token && token.length <= 512) {
      const invitation = await resolveCourseInvitationToken(token);
      if (!invitation.success) {
        redirect(`${next}&error=${encodeURIComponent(invitation.code)}`);
      }

      email = invitation.context.invitedEmail;
      registrationChannel = "course-invitation";
      organizationName = invitation.context.organization.name;
      region = invitation.context.organization.region && isControlledRegion(invitation.context.organization.region)
        ? invitation.context.organization.region
        : "Other / not listed";
      if (invitation.context.invitedRoleOrPosition) {
        const invitedRole = invitation.context.invitedRoleOrPosition;
        if (isControlledLearnerRole(invitedRole)) {
          jobTitle = invitedRole;
          roleOther = "";
        } else {
          jobTitle = "Other";
          roleOther = invitedRole;
        }
      }
    }
  }

  if (email && isRateLimited(`open-register:${email}`, 8, 10 * 60 * 1000)) {
    redirect("/register?error=rate-limited");
  }

  const supabaseClient = readSupabasePublicConfig()
    ? await createSupabaseServerClient()
    : undefined;
  const authOrigin = await resolvePublicAuthOrigin();
  let result: Awaited<ReturnType<typeof registerOpenLearner>>;

  try {
    result = await registerOpenLearner({
      confirmPassword: formText(formData, "confirmPassword"),
      consentAccepted: formData.get("consentAccepted") === "on",
      email,
      fullName: formText(formData, "fullName"),
      jobTitle,
      organizationName,
      password: formText(formData, "password"),
      preferredLanguage: formText(formData, "preferredLanguage"),
      region,
      roleOther,
    }, supabaseClient, authOrigin, next || undefined, registrationChannel);
  } catch (error) {
    const errorCode = safeErrorCode(error);
    console.error("Open learner registration action failed.", {
      errorCode: errorCode ?? "unknown",
      errorType: safeErrorType(error),
      operation: "registerOpenLearner",
    });

    const params = new URLSearchParams({
      error:
        errorCode && DATABASE_CONNECTIVITY_ERROR_CODES.has(errorCode)
          ? "service-unavailable"
          : "profile-link-failed",
    });
    if (next) {
      params.set("next", next);
    }

    redirect(`/register?${params.toString()}`);
  }

  if (!result.success) {
    const params = new URLSearchParams({ error: result.code });
    if (next) {
      params.set("next", next);
    }

    redirect(`/register?${params.toString()}`);
  }

  const params = new URLSearchParams({
    notice:
      result.authProvider === "supabase"
        ? result.emailConfirmationRequired
          ? "confirmation-email-sent"
          : "supabase-registration-created"
        : "registration-complete",
  });

  if (next) {
    params.set("next", next);
  }

  if (
    next &&
    result.authProvider === "supabase" &&
    !result.emailConfirmationRequired
  ) {
    redirect(next);
  }

  redirect(`/sign-in?${params.toString()}`);
}
