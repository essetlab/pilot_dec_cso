"use server";

import { redirect } from "next/navigation";
import { isRateLimited } from "@/lib/auth/rate-limit";
import {
  registerPilotLearner,
  type PilotLearnerType,
} from "@/lib/pilot-registration-workflow";

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNextPath(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "";
}

function isPilotLearnerType(value: string): value is PilotLearnerType {
  return value === "participant" || value === "cso-focal-person";
}

export async function registerPilotLearnerAction(formData: FormData) {
  const email = formText(formData, "email").toLowerCase();
  const learnerTypeValue = formText(formData, "learnerType");
  const next = safeNextPath(formData.get("next"));

  if (email && isRateLimited(`pilot-register:${email}`, 8, 10 * 60 * 1000)) {
    redirect("/register?error=rate-limited");
  }

  const learnerType = isPilotLearnerType(learnerTypeValue)
    ? learnerTypeValue
    : "participant";

  const result = await registerPilotLearner({
    accessCode: formText(formData, "accessCode"),
    confirmPassword: formText(formData, "confirmPassword"),
    consentAccepted: formData.get("consentAccepted") === "on",
    email,
    fullName: formText(formData, "fullName"),
    jobTitle: formText(formData, "jobTitle"),
    learnerType,
    organizationName: formText(formData, "organization"),
    password: formText(formData, "password"),
    region: formText(formData, "region"),
  });

  if (!result.success) {
    const params = new URLSearchParams({ error: result.code });
    if (next) {
      params.set("next", next);
    }

    redirect(`/register?${params.toString()}`);
  }

  const params = new URLSearchParams({
    notice: "pilot-registration-complete",
  });

  if (next) {
    params.set("next", next);
  }

  redirect(`/sign-in?${params.toString()}`);
}
