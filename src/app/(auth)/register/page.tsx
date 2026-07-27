import Link from "next/link";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { BrandMark } from "@/components/shell/BrandMark";
import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";
import {
  ETHIOPIA_REGIONS,
  LEARNER_ROLE_OPTIONS,
  SUPPORTED_LANGUAGE_OPTIONS,
  isControlledRegion,
} from "@/lib/controlled-options";
import { resolveCourseInvitationToken } from "@/lib/course-invitation-workflow";
import { registerOpenLearnerAction } from "./actions";

type PageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessage: Record<string, string> = {
  "invalid-email": "Enter a valid email address.",
  "invalid-language": "Choose a supported preferred language.",
  "invalid-region": "Choose a region from the list.",
  "invalid-role": "Choose a role or function from the list and describe it if you select Other.",
  "missing-fields": "Please complete all required fields.",
  "password-mismatch": "Passwords do not match.",
  "profile-link-failed":
    "Registration was started, but your Hub profile could not be completed. Please contact support before trying again.",
  "registration-not-completed":
    "Registration could not be completed with these details. Try signing in or contact support.",
  "rate-limited": "Too many registration attempts. Please wait and try again.",
  "supabase-registration-failed":
    "Registration could not be completed with the sign-in service. Please try again later.",
  "terms-required": "Please accept the Terms and Privacy statement.",
  "weak-password":
    "Password must be at least 10 characters and include upper/lowercase letters and a number.",
};

const preparationSteps = [
  "Use an email address you can confirm.",
  "Add your current organization and role as profile information.",
  "Confirm your email, then sign in and explore available learning opportunities.",
] as const;

function TextInput({
  autoComplete,
  defaultValue,
  label,
  name,
  placeholder,
  readOnly = false,
  required = true,
  type = "text",
}: {
  autoComplete?: string;
  defaultValue?: string;
  label: string;
  name: string;
  placeholder: string;
  readOnly?: boolean;
  required?: boolean;
  type?: "email" | "password" | "text";
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink" htmlFor={name}>
      {label}
      <input
        autoComplete={autoComplete}
        className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition placeholder:text-muted-text/70 focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        id={name}
        maxLength={160}
        name={name}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        type={type}
      />
    </label>
  );
}

type InvitationRegistrationContext = {
  cohortName: string | null;
  courseTitle: string;
  courseVersionNumber: number | null;
  email: string;
  invitedName: string;
  organizationName: string;
  region: string;
  role: string | null;
};

function RegisterForm({
  error,
  invitation,
  next,
}: {
  error?: string;
  invitation: InvitationRegistrationContext | null;
  next?: string;
}) {
  return (
    <section className="rounded-card border border-design-border bg-white-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-dec-blue">Open registration</p>
          <h2 className="mt-2 text-2xl font-semibold text-deep-navy">
            Create your CSO Learning Hub account
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-text">
            {invitation
              ? "Create your account with the invited email, then return to accept the exact course invitation."
              : "Register with your email address, confirm your account, and explore available learning opportunities."}
          </p>
        </div>
        <StatusBadge label="Individual account" tone="green" />
      </div>

      {error ? (
        <div className="mt-5" role="alert">
          <AlertMessage tone="error" title="Registration could not be completed">
            {errorMessage[error] ?? "Please check your details and try again."}
          </AlertMessage>
        </div>
      ) : null}

      <form
        action={registerOpenLearnerAction}
        aria-label="CSO Learning Hub account registration"
        className="mt-6 grid gap-4"
      >
        <input name="next" type="hidden" value={next ?? ""} />
        <TextInput
          autoComplete="name"
          defaultValue={invitation?.invitedName}
          label="Full name"
          name="fullName"
          placeholder="Enter your full name"
        />
        <TextInput
          autoComplete="email"
          defaultValue={invitation?.email}
          label="Email"
          name="email"
          placeholder="Enter your email address"
          readOnly={Boolean(invitation)}
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
        {invitation ? (
          <section className="rounded-[20px] border border-dec-blue/20 bg-dec-blue/10 p-5">
            <p className="text-sm font-semibold text-dec-blue">Invitation-controlled access</p>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold text-dark-ink">Selected CSO</dt><dd className="mt-1 text-muted-text">{invitation.organizationName}</dd></div>
              <div><dt className="font-semibold text-dark-ink">Region</dt><dd className="mt-1 text-muted-text">{invitation.region}</dd></div>
              <div><dt className="font-semibold text-dark-ink">Course</dt><dd className="mt-1 text-muted-text">{invitation.courseTitle}</dd></div>
              <div><dt className="font-semibold text-dark-ink">Version</dt><dd className="mt-1 text-muted-text">{invitation.courseVersionNumber ? `Version ${invitation.courseVersionNumber}` : "Invitation-selected version"}</dd></div>
              {invitation.cohortName ? <div><dt className="font-semibold text-dark-ink">Cohort</dt><dd className="mt-1 text-muted-text">{invitation.cohortName}</dd></div> : null}
            </dl>
            <input name="organization" type="hidden" value={invitation.organizationName} />
            <input name="region" type="hidden" value={invitation.region} />
            {invitation.role ? <input name="jobTitle" type="hidden" value={invitation.role} /> : null}
          </section>
        ) : (
          <div>
            <TextInput
              autoComplete="organization"
              label="Organization name"
              name="organization"
              placeholder="Enter your CSO or organization name"
            />
            <p className="mt-2 text-sm leading-6 text-muted-text">
              Registration includes access to the HRBA pilot course. Other
              invitation-only courses still require a separate assignment.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {!invitation?.role ? (
            <label className="text-sm font-semibold text-dark-ink" htmlFor="jobTitle">
              Role or function
              <select className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm" id="jobTitle" name="jobTitle" required defaultValue="">
                <option value="">Select your role or function</option>
                {LEARNER_ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <span className="mt-2 block font-normal leading-6 text-muted-text">Choose the closest match. Use Other only when necessary.</span>
            </label>
          ) : (
            <div className="rounded-control border border-design-border bg-soft-bg p-4 text-sm"><p className="font-semibold text-dark-ink">Role or function</p><p className="mt-1 text-muted-text">{invitation.role}</p></div>
          )}
          {!invitation ? (
            <label className="text-sm font-semibold text-dark-ink" htmlFor="region">
              Region
              <select className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm" id="region" name="region" required defaultValue="">
                <option value="">Select your region</option>
                {ETHIOPIA_REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>
            </label>
          ) : null}
        </div>
        {!invitation?.role ? (
          <TextInput autoComplete="organization-title" label="If Other, describe your role" name="roleOther" placeholder="Enter your role or function" required={false} />
        ) : null}
        <label className="text-sm font-semibold text-dark-ink" htmlFor="preferredLanguage">
          Preferred language
          <select className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm" id="preferredLanguage" name="preferredLanguage" required defaultValue="English">
            {SUPPORTED_LANGUAGE_OPTIONS.map((language) => <option key={language} value={language}>{language}</option>)}
          </select>
          <span className="mt-2 block font-normal leading-6 text-muted-text">Course availability may vary by language.</span>
        </label>

        <label className="flex gap-3 rounded-[18px] border border-dec-blue/20 bg-dec-blue/10 p-4 text-sm leading-6 text-[#26536c]">
          <input
            className="mt-1 size-4 shrink-0 rounded border-design-border text-dec-blue focus:ring-dec-blue"
            name="consentAccepted"
            required
            type="checkbox"
          />
          <span>
            I accept the{" "}
            <Link className="font-semibold underline-offset-4 hover:underline" href="/terms">
              Terms
            </Link>{" "}
            and{" "}
            <Link className="font-semibold underline-offset-4 hover:underline" href="/privacy">
              Privacy
            </Link>{" "}
            statement for my individual Hub account and learning data.
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <AuthSubmitButton>
            Create account
          </AuthSubmitButton>
          <ActionButton href="/sign-in" size="lg" variant="secondary">
            Back to sign in
          </ActionButton>
        </div>
      </form>
    </section>
  );
}

function AccountAccessPanel() {
  return (
    <section className="rounded-card border border-design-border bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-dark-ink">Account and course access</p>
      <p className="mt-2 text-sm leading-6 text-muted-text">
        Registration creates your individual Hub account. You can browse the
        catalogue and use courses open to registered learners. Courses marked
        invitation required need a separate assignment from DEC.
      </p>
    </section>
  );
}

function SupportNote() {
  return (
    <aside className="rounded-card border border-dec-green/30 bg-dec-green/15 p-5 shadow-soft">
      <StatusBadge label="Support" tone="green" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">Need help registering?</h2>
      <p className="mt-3 text-sm leading-7 text-[#426f1c]">
        Make sure you can access the email address you use. If registration or
        email confirmation does not work, open the support guidance.
      </p>
      <div className="mt-5 flex flex-col gap-3">
        <ActionButton href="/support" variant="secondary">
          Open support guidance
        </ActionButton>
        <ActionButton href="/courses" variant="secondary">
          Browse courses
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
  let invitation: InvitationRegistrationContext | null = null;

  if (next) {
    try {
      const nextUrl = new URL(next, "https://hub.invalid");
      const token = nextUrl.pathname === "/course-invitations/accept"
        ? nextUrl.searchParams.get("token") ?? ""
        : "";
      if (token && token.length <= 512) {
        const resolution = await resolveCourseInvitationToken(token);
        if (resolution.success) {
          const region = resolution.context.organization.region;
          invitation = {
            cohortName: resolution.context.cohortName,
            courseTitle: resolution.context.course.title,
            courseVersionNumber: resolution.context.courseVersionNumber,
            email: resolution.context.invitedEmail,
            invitedName: resolution.context.invitedName,
            organizationName: resolution.context.organization.name,
            region: region && isControlledRegion(region) ? region : "Other / not listed",
            role: resolution.context.invitedRoleOrPosition,
          };
        }
      }
    } catch {
      invitation = null;
    }
  }

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
                Create your CSO Learning Hub account
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-text sm:text-lg">
                Register with your email address, confirm your account, and
                explore available learning opportunities.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <AccountAccessPanel />
            <div className="rounded-card border border-design-border bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold text-dark-ink">Before creating your account</p>
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
            <RegisterForm error={error} invitation={invitation} next={next} />
            <SupportNote />
          </div>
        </div>
      </div>
    </section>
  );
}
