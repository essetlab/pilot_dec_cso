"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { resolvePublicAuthOrigin } from "@/lib/auth/public-auth-origin";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { readSupabasePublicConfig } from "@/lib/supabase/config";

export async function requestPasswordResetAction(formData: FormData) {
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  const config = readSupabasePublicConfig();

  if (!config) {
    redirect("/forgot-password?notice=unavailable");
  }

  if (email && !isRateLimited(`password-reset:${email}`, 4, 15 * 60 * 1000)) {
    // Recovery links must remain usable when a learner opens their email in a
    // different browser or after the active Preview deployment changes. PKCE
    // binds the link to a verifier cookie on the requesting host, so recovery
    // intentionally uses Supabase's stateless fragment flow. The reset page
    // establishes the session client-side and removes the credentials from the
    // address bar before the learner submits a new password.
    const supabase = createClient(config.url, config.publishableKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: "implicit",
        persistSession: false,
      },
    });
    const authOrigin = await resolvePublicAuthOrigin();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${authOrigin}/auth/callback?next=/reset-password`,
    });
  }

  // The same response is used for known, unknown, invalid, and rate-limited
  // addresses so this public endpoint does not reveal account membership.
  redirect("/forgot-password?notice=sent");
}
