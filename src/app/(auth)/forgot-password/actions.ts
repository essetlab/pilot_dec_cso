"use server";

import { redirect } from "next/navigation";
import { resolvePublicAuthOrigin } from "@/lib/auth/public-auth-origin";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestPasswordResetAction(formData: FormData) {
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  if (!readSupabasePublicConfig()) {
    redirect("/forgot-password?notice=unavailable");
  }

  if (email && !isRateLimited(`password-reset:${email}`, 4, 15 * 60 * 1000)) {
    const supabase = await createSupabaseServerClient();
    const authOrigin = await resolvePublicAuthOrigin();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${authOrigin}/auth/callback?next=/reset-password`,
    });
  }

  // The same response is used for known, unknown, invalid, and rate-limited
  // addresses so this public endpoint does not reveal account membership.
  redirect("/forgot-password?notice=sent");
}
