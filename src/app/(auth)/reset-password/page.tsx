import Link from "next/link";
import { ActionButton, AlertMessage } from "@/components/ui";
import { updatePasswordAction } from "./actions";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

const messages: Record<string, string> = {
  "invalid-link": "This reset link is invalid or has expired. Request a new link and try again.",
  "missing-fields": "Enter and confirm your new password.",
  "password-mismatch": "The passwords do not match.",
  unavailable: "Password recovery is not configured in this environment.",
  "weak-password": "Use at least 10 characters with uppercase and lowercase letters and a number.",
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-xl rounded-card border border-design-border bg-white p-6 shadow-card sm:p-8">
      <p className="text-sm font-semibold text-dec-blue">Account recovery</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-deep-navy">
        Choose a new password
      </h1>
      <p className="mt-3 text-sm leading-7 text-muted-text">
        Use at least 10 characters, including uppercase and lowercase letters and a number.
      </p>

      {error ? (
        <div className="mt-5" role="alert">
          <AlertMessage tone="error" title="Password could not be updated">
            {messages[error] ?? messages["invalid-link"]}
          </AlertMessage>
        </div>
      ) : null}

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
        <ActionButton type="submit">Update password</ActionButton>
      </form>

      <p className="mt-6 text-sm text-muted-text">
        Need a new link?{" "}
        <Link className="font-semibold text-dec-blue underline-offset-4 hover:underline" href="/forgot-password">
          Request another reset email
        </Link>
      </p>
    </section>
  );
}
