"use server";

import { redirect } from "next/navigation";
import { clearCurrentSession } from "@/lib/auth/server";
import { validatePasswordPolicy } from "@/lib/auth/passwords";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("password");
  const confirmation = formData.get("confirmPassword");

  if (typeof password !== "string" || typeof confirmation !== "string") {
    redirect("/reset-password?error=missing-fields");
  }

  if (password !== confirmation) {
    redirect("/reset-password?error=password-mismatch");
  }

  if (!validatePasswordPolicy(password)) {
    redirect("/reset-password?error=weak-password");
  }

  if (!readSupabasePublicConfig()) {
    redirect("/reset-password?error=unavailable");
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/reset-password?error=invalid-link");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/reset-password?error=invalid-link");
  }

  await supabase.auth.signOut();
  await clearCurrentSession();
  redirect("/sign-in?notice=password-reset");
}
