"use client";

import { useEffect, useRef, useState } from "react";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AlertMessage } from "@/components/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { readRecoveryCredentials } from "@/lib/auth/recovery-session";
import { updatePasswordAction } from "@/app/(auth)/reset-password/actions";

type RecoveryState = "checking" | "invalid" | "ready";

const messages: Record<string, string> = {
  "invalid-link": "This reset link is invalid or has expired. Request a new link and try again.",
  "missing-fields": "Enter and confirm your new password.",
  "password-mismatch": "The passwords do not match.",
  unavailable: "Password recovery is not available right now. Please contact support.",
  "weak-password": "Use at least 10 characters with uppercase and lowercase letters and a number.",
};

export function RecoveryPasswordForm({
  error,
  expectsFragment,
  hasServerSession,
}: {
  error?: string;
  expectsFragment: boolean;
  hasServerSession: boolean;
}) {
  const [state, setState] = useState<RecoveryState>(
    error === "invalid-link" ? "invalid" : hasServerSession ? "ready" : "checking",
  );
  const started = useRef(false);

  useEffect(() => {
    if (error === "invalid-link") {
      return;
    }

    if (hasServerSession && !window.location.hash && !expectsFragment) {
      return;
    }

    if (started.current) {
      return;
    }
    started.current = true;

    let active = true;

    async function establishRecoverySession() {
      const supabase = createSupabaseBrowserClient();
      const recoveryCredentials = readRecoveryCredentials(window.location.hash);

      if (recoveryCredentials) {
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: recoveryCredentials.accessToken,
          refresh_token: recoveryCredentials.refreshToken,
        });

        if (sessionError || !sessionData.user) {
          if (active) setState("invalid");
          return;
        }

        window.history.replaceState(null, "", "/reset-password");
        if (active) setState("ready");
        return;
      } else if (window.location.hash || expectsFragment) {
        window.history.replaceState(null, "", "/reset-password?error=invalid-link");
        if (active) setState("invalid");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (active) {
        setState(user ? "ready" : "invalid");
      }
    }

    void establishRecoverySession();

    return () => {
      active = false;
    };
  }, [error, expectsFragment, hasServerSession]);

  if (state === "checking") {
    return (
      <div className="mt-5" role="status">
        <AlertMessage tone="warning" title="Checking your reset link">
          Please wait while the Hub verifies this password-reset request.
        </AlertMessage>
      </div>
    );
  }

  const displayedError = state === "invalid" ? "invalid-link" : error;

  return (
    <>
      {displayedError ? (
        <div className="mt-5" role="alert">
          <AlertMessage tone="error" title="Password could not be updated">
            {messages[displayedError] ?? messages["invalid-link"]}
          </AlertMessage>
        </div>
      ) : null}

      {state === "ready" ? (
        <form action={updatePasswordAction} className="mt-6 grid gap-4">
          <label className="text-sm font-semibold text-dark-ink" htmlFor="password">
            New password
            <input
              autoComplete="new-password"
              className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              id="password"
              name="password"
              required
              type="password"
            />
          </label>
          <label className="text-sm font-semibold text-dark-ink" htmlFor="confirmPassword">
            Confirm new password
            <input
              autoComplete="new-password"
              className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              id="confirmPassword"
              name="confirmPassword"
              required
              type="password"
            />
          </label>
          <AuthSubmitButton>Update password</AuthSubmitButton>
        </form>
      ) : null}
    </>
  );
}
