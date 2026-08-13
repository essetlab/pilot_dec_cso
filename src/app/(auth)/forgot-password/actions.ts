"use server";

import { redirect } from "next/navigation";
import { resolvePublicAuthOrigin } from "@/lib/auth/public-auth-origin";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { sendPasswordRecoveryEmail } from "@/lib/email";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function requestPasswordResetAction(formData: FormData) {
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  const config = readSupabasePublicConfig();

  if (!config) {
    redirect("/forgot-password?notice=unavailable");
  }

  if (email && !isRateLimited(`password-reset:${email}`, 4, 15 * 60 * 1000)) {
    const authOrigin = await resolvePublicAuthOrigin();
    try {
      const admin = createSupabaseAdminClient();
      const { data, error } = await admin.auth.admin.generateLink({
        email,
        options: { redirectTo: `${authOrigin}/reset-password?recovery=fragment` },
        type: "recovery",
      });
      if (!error && data.properties?.action_link) {
        await sendPasswordRecoveryEmail({
          email,
          recoveryUrl: data.properties.action_link,
        });
      }
    } catch (error) {
      console.error("Password recovery email generation failed.", {
        errorType: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }

  // The same response is used for known, unknown, invalid, and rate-limited
  // addresses so this public endpoint does not reveal account membership.
  redirect("/forgot-password?notice=sent");
}
