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
      <div className="space-y-4">
        <AlertMessage title="Invalid invitation" tone="error">
          This invite link is missing a token.
        </AlertMessage>
      </div>
    );
  }

  const validation = await validateStaffInvitationToken(token);
  if (!validation.ok) {
    return (
      <div className="space-y-4">
        <AlertMessage title="Invitation unavailable" tone="error">
          {errorMessage[validation.code]}
        </AlertMessage>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">
          DEC Staff Access
        </span>
        <h1 className="mt-2 text-2xl font-bold text-deep-navy">Finish staff registration</h1>
        <p className="mt-2 text-xs leading-5 text-muted-text">
          Complete your staff details for <strong className="text-deep-navy font-bold">{validation.email}</strong> and create your password.
        </p>
      </div>

      {error && (
        <AlertMessage title="Registration issue" tone="warning">
          {errorMessage[error] ?? "We could not complete your registration."}
        </AlertMessage>
      )}

      <form action={completeStaffRegistrationAction} className="space-y-4">
        <input name="token" type="hidden" value={token} />

        <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy">
          Full name
          <input
            className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            name="fullName"
            required
            autoComplete="name"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy">
          Phone number
          <input
            className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            name="phone"
            required
            type="tel"
            autoComplete="tel"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy">
          Job title
          <input
            className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            name="jobTitle"
            required
            autoComplete="organization-title"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy">
          Department
          <input
            className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            name="department"
            required
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy">
          New password
          <input
            className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            name="password"
            required
            type="password"
            autoComplete="new-password"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy">
          Confirm new password
          <input
            className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            name="confirmPassword"
            required
            type="password"
            autoComplete="new-password"
          />
        </label>

        <ActionButton type="submit" className="w-full">
          Complete Registration
        </ActionButton>
      </form>
    </div>
  );
}
