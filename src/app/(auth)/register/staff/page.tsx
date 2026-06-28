import { ActionButton, AlertMessage } from "@/components/ui";
import { validateStaffInvitationToken } from "@/lib/auth/staff-onboarding";
import { completeStaffRegistrationAction } from "./actions";

type PageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

const errorMessage: Record<string, string> = {
  "expired-token": "This invite link has expired. Ask your admin to send a new invite.",
  "invalid-token": "This invite link is invalid.",
  "missing-fields": "Complete all required fields before submitting.",
  "password-mismatch": "Passwords do not match.",
  "rate-limited": "Too many attempts. Please wait and try again.",
  "used-token": "This invite link has already been used.",
  "weak-password": "Password must be at least 10 characters and include upper/lowercase letters and a number.",
};

export default async function StaffRegisterPage({ searchParams }: PageProps) {
  const { token = "", error } = await searchParams;
  if (!token) {
    return (
      <div className="mx-auto max-w-2xl">
        <AlertMessage title="Invalid invitation" tone="error">
          This invite link is missing a token.
        </AlertMessage>
      </div>
    );
  }

  const validation = await validateStaffInvitationToken(token);
  if (!validation.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <AlertMessage title="Invitation unavailable" tone="error">
          {errorMessage[validation.code]}
        </AlertMessage>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl rounded-[24px] border border-design-border bg-white-surface p-6 shadow-card">
      <h1 className="text-3xl font-semibold text-deep-navy">Finish your staff registration</h1>
      <p className="mt-2 text-sm text-muted-text">
        Complete your details for <strong>{validation.email}</strong> and create your password.
      </p>

      {error ? (
        <div className="mt-4">
          <AlertMessage title="Registration issue" tone="warning">
            {errorMessage[error] ?? "We could not complete your registration."}
          </AlertMessage>
        </div>
      ) : null}

      <form action={completeStaffRegistrationAction} className="mt-6 grid gap-4">
        <input name="token" type="hidden" value={token} />
        <label className="text-sm font-semibold text-dark-ink">
          Full name
          <input className="mt-2 min-h-11 w-full rounded-control border border-design-border px-4" name="fullName" required />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Phone
          <input className="mt-2 min-h-11 w-full rounded-control border border-design-border px-4" name="phone" required />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Job title
          <input className="mt-2 min-h-11 w-full rounded-control border border-design-border px-4" name="jobTitle" required />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Department
          <input className="mt-2 min-h-11 w-full rounded-control border border-design-border px-4" name="department" required />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          New password
          <input className="mt-2 min-h-11 w-full rounded-control border border-design-border px-4" name="password" required type="password" />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Confirm new password
          <input className="mt-2 min-h-11 w-full rounded-control border border-design-border px-4" name="confirmPassword" required type="password" />
        </label>
        <ActionButton type="submit">Complete Registration</ActionButton>
      </form>
    </section>
  );
}
