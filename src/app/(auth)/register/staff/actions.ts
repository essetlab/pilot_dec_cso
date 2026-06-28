"use server";

import { redirect } from "next/navigation";
import { completeStaffRegistration } from "@/lib/auth/staff-onboarding";
import { isRateLimited } from "@/lib/auth/rate-limit";

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function completeStaffRegistrationAction(formData: FormData) {
  const token = formText(formData, "token");
  const fullName = formText(formData, "fullName");
  const phone = formText(formData, "phone");
  const jobTitle = formText(formData, "jobTitle");
  const department = formText(formData, "department");
  const password = formText(formData, "password");
  const confirmPassword = formText(formData, "confirmPassword");

  if (!token || !fullName || !phone || !jobTitle || !department || !password) {
    redirect(`/register/staff?token=${encodeURIComponent(token)}&error=missing-fields`);
  }

  if (password !== confirmPassword) {
    redirect(`/register/staff?token=${encodeURIComponent(token)}&error=password-mismatch`);
  }

  if (isRateLimited(`register:${token}`, 6, 10 * 60 * 1000)) {
    redirect(`/register/staff?token=${encodeURIComponent(token)}&error=rate-limited`);
  }

  const result = await completeStaffRegistration({
    department,
    fullName,
    jobTitle,
    password,
    phone,
    token,
  });

  if (!result.success) {
    redirect(`/register/staff?token=${encodeURIComponent(token)}&error=${result.code}`);
  }

  redirect("/sign-in?notice=registration-complete");
}
