import Link from "next/link";
import { BrandMark } from "@/components/shell/BrandMark";
import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";
import {
  getPilotRegistrationModeLabel,
} from "@/lib/pilot-registration-workflow";
import { registerPilotLearnerAction } from "./actions";

type PageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessage: Record<string, string> = {
  "duplicate-email": "This email is already registered. Please sign in.",
  "email-not-invited": "We could not confirm this email for the current pilot. Check the invitation details shared by the programme team.",
  "invalid-access-code": "The pilot access code is not valid. Check the code shared by the programme team and try again.",
  "missing-fields": "Please complete all required fields.",
  "password-mismatch": "Passwords do not match.",
  "profile-link-failed": "Registration was started, but the learner profile could not be completed. Please contact support before trying again.",
  "rate-limited": "Too many registration attempts. Please wait and try again.",
  "supabase-account-exists": "This email may already be registered in the pilot sign-in system. Please sign in when Supabase access is available or contact support.",
  "supabase-registration-failed": "Registration could not be completed with the pilot sign-in system. Please contact support and try again later.",
  "terms-required": "Please accept the Terms and Privacy statement.",
  "weak-password":
    "Password must be at least 10 characters and include upper/lowercase letters and a number.",
};

const preparationSteps = [
  "Use the email address invited for the pilot.",
  "Enter the pilot access code shared by the programme team.",
  "Create your password, then sign in to access your learner dashboard.",
] as const;

function TextInput({
  autoComplete,
  label,
  name,
  placeholder,
  required = true,
  type = "text",
}: {
  autoComplete?: string;
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: "email" | "password" | "text";
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink" htmlFor={name}>
      {label}
      <input
        autoComplete={autoComplete}
        className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition placeholder:text-muted-text/70 focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        id={name}
        maxLength={160}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function RegisterForm({
  error,
  next,
}: {
  error?: string;
  next?: string;
}) {
  return (
    <section className="rounded-card border border-design-border bg-white-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-dec-blue">Pilot registration</p>
          <h2 className="mt-2 text-2xl font-semibold text-deep-navy">
            Create your learner account
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-text">
            Register with the email address invited for the pilot. Your account
            lets you access courses, save progress, and receive certificates for
            eligible courses.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-text">
            Please do not enter sensitive case details, complaints, survivor
            stories, exact locations, political details, or confidential
            organization information in this form.
          </p>
        </div>
        <StatusBadge label="Learner only" tone="green" />
      </div>

      {error ? (
        <div className="mt-5">
          <AlertMessage tone="error" title="Registration could not be completed">
            {errorMessage[error] ?? "Please check your details and try again."}
          </AlertMessage>
        </div>
      ) : null}

      <form
        action={registerPilotLearnerAction}
        aria-label="Pilot learner registration"
        className="mt-6 grid gap-4"
      >
        <input name="next" type="hidden" value={next ?? ""} />
        <TextInput
          autoComplete="name"
          label="Full name"
          name="fullName"
          placeholder="Enter your full name"
        />
        <TextInput
          autoComplete="email"
          label="Email"
          name="email"
          placeholder="Enter your invited email address"
          type="email"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            autoComplete="new-password"
            label="Password"
            name="password"
            placeholder="Create a password"
            type="password"
          />
          <TextInput
            autoComplete="new-password"
            label="Confirm password"
            name="confirmPassword"
            placeholder="Repeat your password"
            type="password"
          />
        </div>
        <TextInput
          autoComplete="organization"
          label="Organization"
          name="organization"
          placeholder="Enter your CSO or organization name"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            autoComplete="organization-title"
            label="Role/position"
            name="jobTitle"
            placeholder="Example: Programme officer"
          />
          <TextInput
            autoComplete="address-level1"
            label="Region"
            name="region"
            placeholder="Example: Amhara"
          />
        </div>
        <label className="block text-sm font-semibold text-dark-ink" htmlFor="learnerType">
          Learner type
          <select
            className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            defaultValue="participant"
            id="learnerType"
            name="learnerType"
          >
            <option value="participant">Participant</option>
            <option value="cso-focal-person">CSO focal person</option>
          </select>
        </label>
        <TextInput
          autoComplete="off"
          label="Pilot access code"
          name="accessCode"
          placeholder="Enter the pilot access code"
        />

        <label className="flex gap-3 rounded-[18px] border border-dec-blue/20 bg-dec-blue/10 p-4 text-sm leading-6 text-[#26536c]">
          <input
            className="mt-1 size-4 shrink-0 rounded border-design-border text-dec-blue focus:ring-dec-blue"
            name="consentAccepted"
            required
            type="checkbox"
          />
          <span>
            I agree to use the CSO Learning Hub for pilot learning activities and
            accept the{" "}
            <Link className="font-semibold underline-offset-4 hover:underline" href="/terms">
              Terms
            </Link>{" "}
            and{" "}
            <Link className="font-semibold underline-offset-4 hover:underline" href="/privacy">
              Privacy
            </Link>{" "}
            statement for learner account data.
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <ActionButton type="submit" size="lg">
            Create Account
          </ActionButton>
          <ActionButton href="/sign-in" size="lg" variant="secondary">
            Back to Sign In
          </ActionButton>
        </div>
      </form>
    </section>
  );
}

function PilotContextPanel() {
  return (
    <section className="rounded-card border border-design-border bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-dark-ink">
        Pilot accounts are for invited learners.
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-text">
        Public registration creates learner access only. Staff, creator, review,
        monitoring, and admin accounts continue through protected staff
        invitation workflows.
      </p>
      <dl className="mt-5 grid gap-3">
        <div className="rounded-[16px] bg-soft-bg p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
            Access check
          </dt>
          <dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
            {getPilotRegistrationModeLabel()}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function SupportNote() {
  return (
    <aside className="rounded-card border border-dec-green/30 bg-dec-green/15 p-5 shadow-soft">
      <StatusBadge label="Support" tone="green" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Need help registering?
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#426f1c]">
        Use the email and access code shared with you for this pilot. If either
        detail is unclear, contact your CSO focal person or programme team.
      </p>
      <div className="mt-5 flex flex-col gap-3">
        <ActionButton href="/support" variant="secondary">
          Open Support Guidance
        </ActionButton>
        <ActionButton href="/courses" variant="secondary">
          Browse Courses
        </ActionButton>
        <Link
          className="text-sm font-semibold text-[#426f1c] underline-offset-4 hover:underline"
          href="/sign-in"
        >
          Already registered? Sign in
        </Link>
      </div>
    </aside>
  );
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const { error, next } = await searchParams;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-design-border bg-white-surface shadow-card">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-dec-blue/10 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-dec-green/10 blur-3xl" aria-hidden="true" />

      <div className="relative grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
        <div className="flex flex-col justify-between gap-10 bg-soft-bg px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="space-y-7">
            <BrandMark />
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-dec-blue">
                CSO Learning Hub
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-deep-navy sm:text-5xl">
                Create your learner account
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-text sm:text-lg">
                Register with the email address invited for the pilot. Your
                account lets you access courses, save progress, and receive
                certificates for eligible courses.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <PilotContextPanel />
            <div className="rounded-card border border-design-border bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold text-dark-ink">
                Before creating your account
              </p>
              <ul className="mt-3 grid gap-3">
                {preparationSteps.map((step) => (
                  <li className="flex gap-3 text-sm leading-6 text-muted-text" key={step}>
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-dec-green" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-xl space-y-6">
            <RegisterForm error={error} next={next} />
            <SupportNote />
          </div>
        </div>
      </div>
    </section>
  );
}
