"use server";

import { redirect } from "next/navigation";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { registerOpenLearner } from "@/lib/open-registration-workflow";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNextPath(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "";
}

export async function registerOpenLearnerAction(formData: FormData) {
  const email = formText(formData, "email").toLowerCase();
  const next = safeNextPath(formData.get("next"));

  if (email && isRateLimited(`open-register:${email}`, 8, 10 * 60 * 1000)) {
    redirect("/register?error=rate-limited");
  }

  const supabaseClient = readSupabasePublicConfig()
    ? await createSupabaseServerClient()
    : undefined;
  const result = await registerOpenLearner({
    confirmPassword: formText(formData, "confirmPassword"),
    consentAccepted: formData.get("consentAccepted") === "on",
    email,
    fullName: formText(formData, "fullName"),
    jobTitle: formText(formData, "jobTitle"),
    organizationName: formText(formData, "organization"),
    password: formText(formData, "password"),
    region: formText(formData, "region"),
  }, supabaseClient);

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

  redirect(`/sign-in?${params.toString()}`);
}
