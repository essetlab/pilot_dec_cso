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
    <section className="mx-auto max-w-xl rounded-card border border-design-border bg-white p-6 shadow-card sm:p-8">
      <p className="text-sm font-semibold text-dec-blue">Account recovery</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-deep-navy">
        Reset your password
      </h1>
      <p className="mt-3 text-sm leading-7 text-muted-text">
        Enter the email address used for your learner account. If it matches an
        account, the Hub will send a time-limited password-reset link.
      </p>

      {notice === "sent" ? (
        <div className="mt-5" role="status">
          <AlertMessage tone="success" title="Check your email">
            If an account matches that address, a reset link has been sent. Check
            your inbox and spam folder, then follow the link before it expires.
          </AlertMessage>
        </div>
      ) : null}

      {notice === "unavailable" ? (
        <div className="mt-5" role="status">
          <AlertMessage tone="warning" title="Recovery is not configured here">
            Contact the programme support team for help restoring access.
          </AlertMessage>
        </div>
      ) : null}

      <form action={requestPasswordResetAction} className="mt-6 grid gap-4">
        <label className="text-sm font-semibold text-dark-ink" htmlFor="email">
          Email address
          <input
            autoComplete="email"
            className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            id="email"
            name="email"
            required
            type="email"
          />
        </label>
        <AuthSubmitButton>Send reset link</AuthSubmitButton>
      </form>

      <p className="mt-6 text-sm text-muted-text">
        Remembered your password?{" "}
        <Link className="font-semibold text-dec-blue underline-offset-4 hover:underline" href="/sign-in">
          Return to sign in
        </Link>
      </p>
    </section>
  );
}
