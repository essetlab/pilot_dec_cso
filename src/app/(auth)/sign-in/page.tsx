import Link from "next/link";
import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { isControlledHubAccess } from "@/lib/hub-access-policy";
type PageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
    notice?: string;
  }>;
};


const signInErrorMessages: Record<string, string> = {
  "confirmation-required":
    "Please confirm your email address before signing in. If you need help, contact your programme team.",
  "demo-unavailable":
    "Quick learner access is not available here. Sign in with your email and password.",
  "hub-profile-missing":
    "Your sign-in worked, but your Learning Hub profile is not linked yet. Contact your programme team for help.",
  "inactive-user":
    "This account is not active. Contact your programme team if you need access restored.",
  "invalid-credentials": "Confirm your credentials and try again.",
  "missing-credentials": "Enter your email and password to continue.",
  "missing-roles":
    "Your account is missing a Learning Hub role. Contact your programme team for help.",
  "service-unavailable":
    "The learning service is temporarily unavailable. Please refresh or contact support if the problem continues.",
  "too-many-attempts":
    "Too many sign-in attempts. Wait a few minutes, then try again.",
};

export default async function SignInPage({ searchParams }: PageProps) {
  const { next, error, notice } = await searchParams;
  const isAdministratorSignIn = next === "/admin" || next?.startsWith("/admin/");
  const usesSupabaseSignIn = Boolean(readSupabasePublicConfig());
  const controlledAccess = isControlledHubAccess();
  const signInErrorMessage = error
    ? signInErrorMessages[error] ?? "Confirm your credentials and try again."
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">
            {isAdministratorSignIn ? "DEC Admin Access" : "Sign In"}
          </span>
          <StatusBadge label="Secure Session" tone="blue" />
        </div>
        <h1 className="mt-2 text-2xl font-bold text-deep-navy">
          {isAdministratorSignIn ? "Sign in as administrator" : "Use your credentials"}
        </h1>
        <p className="mt-2 text-xs leading-5 text-muted-text">
          {isAdministratorSignIn
            ? "Staff credentials will return you directly to invitation management."
            : "Sign in with the email and password you created when activating your Learning Hub account."}
        </p>
      </div>

      {/* Notices */}
      {notice === "registration-complete" && (
        <AlertMessage tone="success" title="Registration complete">
          Your password is ready. Sign in with your email and new password.
        </AlertMessage>
      )}

      {notice === "pilot-registration-complete" && (
        <AlertMessage tone="success" title="Learner account created">
          Your account is ready. Sign in with your email and password to open your learner dashboard.
        </AlertMessage>
      )}

      {notice === "supabase-registration-created" && (
        <AlertMessage tone="success" title="Learner account created">
          Your account is ready. Sign in with your email and password to open your learner dashboard.
        </AlertMessage>
      )}

      {notice === "confirmation-email-sent" && (
        <AlertMessage tone="success" title="Check your email">
          Follow the confirmation link sent to your email address, then return here to sign in.
        </AlertMessage>
      )}

      {notice === "email-confirmed" && (
        <AlertMessage tone="success" title="Email confirmed">
          Your email is confirmed. Sign in to continue.
        </AlertMessage>
      )}

      {notice === "password-reset" && (
        <AlertMessage tone="success" title="Password updated">
          Sign in with your new password.
        </AlertMessage>
      )}

      {/* Credentials Sign-In Form */}
      <form
        action="/api/sign-in"
        className="grid gap-4 rounded-card border border-design-border bg-light-bg p-5"
        method="post"
      >
        <input name="next" type="hidden" value={next ?? ""} />
        
        <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy">
          Email address
          <input
            className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            name="email"
            required
            type="email"
            autoComplete="email"
          />
        </label>
        
        <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy">
          Password
          <input
            className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            name="password"
            required
            type="password"
            autoComplete="current-password"
          />
        </label>

        <ActionButton type="submit">Sign In</ActionButton>

        {usesSupabaseSignIn && (
          <Link
            className="text-xs font-bold text-dec-blue underline hover:text-deep-navy inline-self-start"
            href="/forgot-password"
          >
            Forgot your password?
          </Link>
        )}
      </form>

      {/* Error Summary */}
      {signInErrorMessage && (
        <AlertMessage tone="error" title="Sign-in could not be completed">
          {signInErrorMessage}
        </AlertMessage>
      )}



      {/* Admin Disclaimer */}
      {isAdministratorSignIn && (
        <div className="rounded-card bg-light-bg border border-design-border p-4 text-xs leading-normal text-muted-text">
          <strong className="text-deep-navy font-bold">Role access required:</strong> Learner profiles are denied admin permissions. Success redirect sends you to the participant tables.
        </div>
      )}

      {/* Alternative actions */}
      <div className="border-t border-design-border pt-4 text-center text-xs text-muted-text">
        {!isAdministratorSignIn && !controlledAccess ? (
          <p>
            New learner?{" "}
            <Link className="font-bold text-dec-blue underline hover:text-deep-navy" href="/register">
              Create an account
            </Link>
          </p>
        ) : (
          <p>
            Are you a learner?{" "}
            <Link className="font-bold text-dec-blue underline hover:text-deep-navy" href="/sign-in">
              Learner sign-in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
