import Link from "next/link";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";
import {
  ETHIOPIA_REGIONS,
  LEARNER_ROLE_OPTIONS,
  SUPPORTED_LANGUAGE_OPTIONS,
  isControlledRegion,
} from "@/lib/controlled-options";
import { resolveCourseInvitationToken } from "@/lib/course-invitation-workflow";
import { getCourseInvitationToken } from "@/lib/course-invitation-session";
import { isControlledHubAccess } from "@/lib/hub-access-policy";
import { registerOpenLearnerAction } from "./actions";

type PageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessage: Record<string, string> = {
  "invitation-required": "A valid DEC course invitation is required to activate a learner account.",
  "expired": "This invitation has expired. Ask DEC to resend it.",
  "cancelled": "This invitation was revoked. Contact DEC if you still require access.",
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
  "service-unavailable":
    "Registration is temporarily unavailable because the service could not be reached. Please try again shortly.",
  "supabase-registration-failed":
    "Registration could not be completed with the sign-in service. Please try again later.",
  "terms-required": "Please accept the Terms and Privacy statement.",
  "weak-password":
    "Password must be at least 10 characters and include upper/lowercase letters and a number.",
};

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
    <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy" htmlFor={name}>
      {label}
      <input
        autoComplete={autoComplete}
        className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy shadow-soft outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
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

export default async function RegisterPage({ searchParams }: PageProps) {
  const { error, next } = await searchParams;
  const controlledAccess = isControlledHubAccess();
  let invitation: InvitationRegistrationContext | null = null;

  if (controlledAccess) {
    const token = await getCourseInvitationToken();
    const resolution = token ? await resolveCourseInvitationToken(token) : null;
    if (resolution?.success) {
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
  } else if (next) {
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

  if (controlledAccess && !invitation) {
    return (
      <div className="space-y-6">
        <div>
          <StatusBadge label="DEC-controlled access" tone="blue" />
          <h1 className="mt-4 text-2xl font-bold text-deep-navy">Registration is by invitation</h1>
          <p className="mt-3 text-sm leading-6 text-muted-text">
            DEC approves each learner and course. Open the personal invitation sent to your email to activate a new account.
          </p>
        </div>
        {error ? <AlertMessage tone="error" title="Invitation unavailable">{errorMessage[error] ?? errorMessage["invitation-required"]}</AlertMessage> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionButton href="/sign-in">Sign in</ActionButton>
          <ActionButton href="/support" variant="secondary">Get support</ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">
            Registration
          </span>
          <StatusBadge label="Individual Account" tone="green" />
        </div>
        <h1 className="mt-2 text-2xl font-bold text-deep-navy">
          {invitation ? "Activate your account" : "Create your account"}
        </h1>
        <p className="mt-2 text-xs leading-5 text-muted-text">
          {invitation
            ? "Create your password to activate your Learning Hub account and access the course assigned to you."
            : "Register with your email address, confirm your account, and explore available learning opportunities."}
        </p>
      </div>

      {error && (
        <AlertMessage tone="error" title="Registration could not be completed">
          {errorMessage[error] ?? "Please check your details and try again."}
        </AlertMessage>
      )}

      <form action={registerOpenLearnerAction} className="space-y-6">
        <input name="next" type="hidden" value={next ?? ""} />

        {/* Group 1: Your Account */}
        <fieldset className="space-y-4 rounded-card border border-design-border bg-light-bg p-5">
          <legend className="px-2 text-2xs font-black uppercase tracking-wider text-muted-text">
            Your Account Credentials
          </legend>
          <TextInput
            autoComplete="name"
            defaultValue={invitation?.invitedName}
            label="Full name"
            name="fullName"
            placeholder="Enter your full name"
            readOnly={Boolean(invitation)}
          />
          <TextInput
            autoComplete="email"
            defaultValue={invitation?.email}
            label="Email address"
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
          <span className="text-3xs text-muted-soft block">
            Minimum 10 characters, including upper/lowercase letters and a number.
          </span>
        </fieldset>

        {/* Group 2: Your Organisation */}
        <fieldset className="space-y-4 rounded-card border border-design-border bg-light-bg p-5">
          <legend className="px-2 text-2xs font-black uppercase tracking-wider text-muted-text">
            Your Profile & Organisation
          </legend>

          {invitation ? (
            <div className="rounded-card border border-dec-blue/20 bg-dec-blue/5 p-4 space-y-3">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-dec-blue">
                Invitation details
              </span>
              <dl className="grid gap-x-4 gap-y-2 text-xs sm:grid-cols-2 text-deep-navy">
                <div>
                  <dt className="text-3xs font-bold text-muted-text uppercase">CSO Name</dt>
                  <dd className="mt-0.5 font-semibold">{invitation.organizationName}</dd>
                </div>
                <div>
                  <dt className="text-3xs font-bold text-muted-text uppercase">Region</dt>
                  <dd className="mt-0.5 font-semibold">{invitation.region}</dd>
                </div>
                <div>
                  <dt className="text-3xs font-bold text-muted-text uppercase">Assigned Course</dt>
                  <dd className="mt-0.5 font-semibold">{invitation.courseTitle}</dd>
                </div>
                {invitation.cohortName && (
                  <div>
                    <dt className="text-3xs font-bold text-muted-text uppercase">Cohort</dt>
                    <dd className="mt-0.5 font-semibold">{invitation.cohortName}</dd>
                  </div>
                )}
              </dl>
              <input name="organization" type="hidden" value={invitation.organizationName} />
              <input name="region" type="hidden" value={invitation.region} />
              {invitation.role && <input name="jobTitle" type="hidden" value={invitation.role} />}
            </div>
          ) : (
            <TextInput
              autoComplete="organization"
              label="Organization name"
              name="organization"
              placeholder="Enter your CSO or organization name"
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {!invitation?.role ? (
              <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy" htmlFor="jobTitle">
                Role or function
                <select
                  className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm font-semibold text-deep-navy outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                  id="jobTitle"
                  name="jobTitle"
                  required
                  defaultValue=""
                >
                  <option value="">Select your role</option>
                  {LEARNER_ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className="rounded-card border border-design-border bg-white p-3 text-xs">
                <span className="text-3xs font-bold text-muted-text uppercase">Role or function</span>
                <p className="font-semibold text-deep-navy mt-0.5">{invitation.role}</p>
              </div>
            )}

            {!invitation ? (
              <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy" htmlFor="region">
                Region
                <select
                  className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm font-semibold text-deep-navy outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                  id="region"
                  name="region"
                  required
                  defaultValue=""
                >
                  <option value="">Select your region</option>
                  {ETHIOPIA_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          {!invitation?.role && (
            <TextInput
              autoComplete="organization-title"
              label="If Other, describe your role"
              name="roleOther"
              placeholder="Enter your role title"
              required={false}
            />
          )}

          <label className="flex flex-col gap-1.5 text-xs font-bold text-deep-navy" htmlFor="preferredLanguage">
            Preferred language
            <select
              className="min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm font-semibold text-deep-navy outline-none focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              id="preferredLanguage"
              name="preferredLanguage"
              required
              defaultValue="English"
            >
              {SUPPORTED_LANGUAGE_OPTIONS.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        {/* Group 3: Agreement & Next Steps */}
        <div className="space-y-4">
          <label className="flex gap-3 rounded-card border border-dec-blue/20 bg-dec-blue/5 p-4 text-xs leading-6 text-deep-navy">
            <input
              className="mt-1 size-4 shrink-0 rounded border-design-border text-dec-blue focus:ring-dec-blue"
              name="consentAccepted"
              required
              type="checkbox"
            />
            <span>
              I accept the{" "}
              <Link className="font-bold underline hover:text-dec-blue" href="/terms" target="_blank">
                Terms
              </Link>{" "}
              and{" "}
              <Link className="font-bold underline hover:text-dec-blue" href="/privacy" target="_blank">
                Privacy
              </Link>{" "}
              statement for my individual Hub account and learning data.
            </span>
          </label>

          <div className="space-y-3">
            <AuthSubmitButton>{invitation ? "Activate your account" : "Create account"}</AuthSubmitButton>
            {invitation ? (
              <p className="text-center text-xs text-muted-text">
                Already have an account?{" "}
                <Link
                  className="font-semibold text-dec-blue underline underline-offset-2 hover:text-deep-navy"
                  href={`/sign-in?next=${encodeURIComponent("/course-invitations/reconcile")}`}
                >
                  Sign in
                </Link>
              </p>
            ) : (
              <div className="flex justify-center">
                <ActionButton href="/sign-in" variant="secondary">
                  Back to sign in
                </ActionButton>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
