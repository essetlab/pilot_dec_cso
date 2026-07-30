import Link from "next/link";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AlertMessage } from "@/components/ui";
import { requestPasswordResetAction } from "./actions";

type PageProps = {
  searchParams: Promise<{ notice?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const { notice } = await searchParams;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">
          Account Recovery
        </span>
        <h1 className="mt-2 text-2xl font-bold text-deep-navy">Reset your password</h1>
        <p className="mt-2 text-xs leading-5 text-muted-text">
          Enter the email address used for your account. If it matches a profile, we will send a password-reset link.
        </p>
      </div>

      {notice === "sent" && (
        <AlertMessage tone="success" title="Check your email">
          If an account matches that address, a reset link has been sent. Check your inbox and spam folder.
        </AlertMessage>
      )}

      {notice === "unavailable" && (
        <AlertMessage tone="warning" title="Recovery is not configured here">
          Contact the programme support team for help restoring access.
        </AlertMessage>
      )}

      <form action={requestPasswordResetAction} className="space-y-4">
        <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy" htmlFor="email">
          Email address
          <input
            autoComplete="email"
            className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            id="email"
            name="email"
            required
            type="email"
          />
        </label>
        <AuthSubmitButton>Send reset link</AuthSubmitButton>
      </form>

      <div className="border-t border-design-border pt-4 text-center text-xs text-muted-text">
        <p>
          Remembered your password?{" "}
          <Link className="font-bold text-dec-blue underline hover:text-deep-navy" href="/sign-in">
            Return to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
