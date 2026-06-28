import { BrandMark } from "@/components/shell/BrandMark";
import { ActionButton, StatusBadge } from "@/components/ui";
import { DEMO_PROPOSAL_COURSE } from "@/lib/demo-data";

const accessSteps = [
  "Share your organization and role context.",
  "Include your cohort or access code if your team received one.",
  "Use the sign-in page after your access is confirmed by the programme team.",
] as const;

const requestDetails = [
  ["Who can request access", "Participants and CSO focal persons"],
  ["Learning area", "CSO Learning Hub"],
  ["Primary course pathway", DEMO_PROPOSAL_COURSE.shortTitle],
] as const;

function TextInput({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: "email" | "text";
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink" htmlFor={name}>
      {label}
      <input
        className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition placeholder:text-muted-text/70 focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

function SelectInput({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink" htmlFor={name}>
      {label}
      <select
        className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={options[0]}
        id={name}
        name={name}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function AccessRequestCard() {
  return (
    <section className="rounded-card border border-design-border bg-white-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-dec-blue">Access request</p>
          <h2 className="mt-2 text-2xl font-semibold text-deep-navy">
            Tell us who needs learning access
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-text">
            Add the details your programme team can use to connect you with the
            right learning space.
          </p>
        </div>
        <StatusBadge label="Participant access" tone="green" />
      </div>

      <form className="mt-6 grid gap-4" aria-label="Access request details">
        <TextInput
          label="Full name"
          name="full-name"
          placeholder="Enter your full name"
        />
        <TextInput
          label="Email"
          name="email"
          placeholder="Enter your email address"
          type="email"
        />
        <TextInput
          label="Organization"
          name="organization"
          placeholder="Enter your CSO or group name"
        />
        <SelectInput
          label="Role"
          name="role"
          options={[
            "Select role",
            "Participant",
            "CSO focal person",
            "Course creator",
            "Programme support",
          ]}
        />
        <TextInput
          label="Cohort/access code"
          name="access-code"
          placeholder="Enter code if provided"
        />

        <div className="mt-2 rounded-[18px] border border-dec-blue/20 bg-dec-blue/10 p-4">
          <p className="text-sm font-semibold text-deep-navy">
            Access requests are coordinated through the programme team.
          </p>
          <p className="mt-2 text-sm leading-6 text-[#26536c]">
            If you already have an active account, use sign in to continue to
            your learning area.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ActionButton type="button" size="lg">
            Request Access
          </ActionButton>
          <ActionButton href="/sign-in" size="lg" variant="secondary">
            Back to Sign In
          </ActionButton>
        </div>
      </form>
    </section>
  );
}

function SupportNote() {
  return (
    <aside className="rounded-card border border-dec-green/30 bg-dec-green/15 p-5 shadow-soft">
      <StatusBadge label="Support" tone="green" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Need help with access?
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#426f1c]">
        Contact your CSO focal person or programme support team if you are not
        sure which cohort, course, or access option applies to you.
      </p>
      <ActionButton className="mt-5" href="/courses" variant="secondary">
        Browse Courses
      </ActionButton>
    </aside>
  );
}

function RequestContextPanel() {
  return (
    <section className="rounded-card border border-design-border bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-dark-ink">
        Access is designed for participants and CSO focal persons connected to
        active learning cohorts.
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-text">
        Your programme team can use your organization, role, and access code to
        guide you to the correct learning area.
      </p>
      <dl className="mt-5 grid gap-3">
        {requestDetails.map(([label, value]) => (
          <div className="rounded-[16px] bg-soft-bg p-4" key={label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
              {label}
            </dt>
            <dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function RegisterPage() {
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
                Create access request
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-text sm:text-lg">
                Participants and CSO focal persons can share their details so
                the programme team can connect them with the right learning
                access.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <RequestContextPanel />
            <div className="rounded-card border border-design-border bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold text-dark-ink">
                Before requesting access
              </p>
              <ul className="mt-3 grid gap-3">
                {accessSteps.map((step) => (
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
            <AccessRequestCard />
            <SupportNote />
          </div>
        </div>
      </div>
    </section>
  );
}
