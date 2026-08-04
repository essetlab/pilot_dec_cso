import { AlertMessage, ActionButton, MetricCard, SectionHeader, StatusBadge } from "@/components/ui";
import { updateLearnerProfileAction } from "@/lib/learner-actions";
import type {
  LearnerProfileCertificateSummary,
  LearnerProfileCourseSummary,
  LearnerProfileData,
} from "@/lib/learner-profile-workflow";

function ProfileIntroduction() {
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-deep-navy px-5 py-6 text-white shadow-hero sm:px-6 lg:px-8 lg:py-7">
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-14 h-40 w-40 rounded-full border-[18px] border-dec-blue/10"
      />
      <div className="relative z-10 max-w-2xl">
        <p className="text-2xs font-extrabold uppercase tracking-[0.16em] text-[#72bee8]">
          Account and learning
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
          My Profile
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Review your account information, organization link, and learning summary.
        </p>
      </div>
    </section>
  );
}

function DetailCard({
  items,
  title,
  description,
}: {
  description: string;
  items: { label: string; managed?: boolean; value: string }[];
  title: string;
}) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <SectionHeader description={description} title={title} />
      <dl className="mt-5 divide-y divide-design-border/70">
        {items.map((detail) => (
          <div className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4" key={detail.label}>
            <dt className="text-xs font-semibold text-muted-text">
              {detail.label}
              {detail.managed ? (
                <span className="mt-0.5 block text-3xs font-medium uppercase tracking-wide text-slate-400">
                  Platform managed
                </span>
              ) : null}
            </dt>
            <dd className={`break-words text-sm leading-5 ${detail.value === "Not provided" || detail.value === "Not linked" ? "font-medium italic text-slate-400" : "font-semibold text-dark-ink"}`}>
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function ProfileEditForm({
  data,
  updateState,
}: {
  data: LearnerProfileData;
  updateState?: string;
}) {
  const fieldClass =
    "mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-3 py-2 text-sm text-dark-ink shadow-sm focus:border-dec-blue focus:outline-none focus:ring-4 focus:ring-dec-blue/15";

  return (
    <details
      className="group rounded-[20px] border border-design-border bg-white-surface shadow-soft"
      open={Boolean(updateState)}
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dec-blue/20 [&::-webkit-details-marker]:hidden sm:px-6">
        <span>
          <span className="block text-base font-bold text-deep-navy">Edit profile</span>
          <span className="mt-0.5 block text-xs leading-5 text-muted-text">
            Update learner-managed account details.
          </span>
        </span>
        <span aria-hidden="true" className="text-xl font-semibold text-dec-blue transition group-open:rotate-45">+</span>
      </summary>
      <div className="border-t border-design-border px-5 pb-6 pt-5 sm:px-6">
        <p className="text-xs leading-5 text-muted-text">
          Email and organization information are managed by platform administrators.
        </p>
        {updateState === "updated" ? (
          <div className="mt-4">
            <AlertMessage tone="success" title="Profile updated">
              Your learner profile details were saved.
            </AlertMessage>
          </div>
        ) : null}
        {updateState === "missing-name" ? (
          <div className="mt-4">
            <AlertMessage tone="error" title="Name required">
              Add a display name before saving your profile.
            </AlertMessage>
          </div>
        ) : null}
        <form action={updateLearnerProfileAction} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-dark-ink">
          Full name
          <input
            className={fieldClass}
            defaultValue={data.account.fullName}
            maxLength={160}
            name="fullName"
            required
          />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Email
          <input
            className={`${fieldClass} bg-soft-bg text-muted-text`}
            defaultValue={data.account.email}
            disabled
            readOnly
          />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Job title
          <input
            className={fieldClass}
            defaultValue={data.account.jobTitle === "Not provided" ? "" : data.account.jobTitle}
            maxLength={160}
            name="jobTitle"
          />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Department or team
          <input
            className={fieldClass}
            defaultValue={data.account.department === "Not provided" ? "" : data.account.department}
            maxLength={160}
            name="department"
          />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Region
          <input
            className={fieldClass}
            defaultValue={data.account.region === "Not provided" ? "" : data.account.region}
            maxLength={160}
            name="region"
          />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Preferred language
          <input
            className={fieldClass}
            defaultValue={
              data.account.preferredLanguage === "Not provided"
                ? ""
                : data.account.preferredLanguage
            }
            maxLength={160}
            name="preferredLanguage"
          />
        </label>
        <label className="text-sm font-semibold text-dark-ink sm:col-span-2">
          Phone
          <input
            className={fieldClass}
            defaultValue={data.account.phone === "Not provided" ? "" : data.account.phone}
            maxLength={160}
            name="phone"
          />
        </label>
        <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row">
          <ActionButton type="submit">Save Profile</ActionButton>
        </div>
        </form>
      </div>
    </details>
  );
}

function CourseActivityList({
  courses,
}: {
  courses: LearnerProfileCourseSummary[];
}) {
  return (
    <article className="rounded-[20px] border border-design-border bg-white-surface p-5 shadow-soft sm:p-6">
      <SectionHeader
        description="Recent course activity linked to your learner account."
        title="Recent learning"
      />
      <div className="mt-5 divide-y divide-design-border/70">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              className="py-4 first:pt-0 last:pb-0"
              key={course.href}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <StatusBadge label={course.status} tone="blue" />
                  <h3 className="mt-3 text-base font-semibold text-dark-ink">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-text">
                    Last activity: {course.lastAccessedAt}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-semibold text-deep-navy">
                    {course.progressPercent}% complete
                  </p>
                  <ActionButton className="mt-3" href={course.href} size="sm" variant="secondary">
                    Open Course
                  </ActionButton>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-muted-text">
            Course activity will appear after you start an assigned or available course.
          </p>
        )}
      </div>
    </article>
  );
}

function CertificateList({
  certificates,
  earned,
}: {
  certificates: LearnerProfileCertificateSummary[];
  earned: number;
}) {
  return (
    <article className="rounded-[20px] border border-design-border bg-white-surface p-5 shadow-soft sm:p-6">
      <SectionHeader
        action={
          <ActionButton href="/learn/certificates" size="sm" variant="secondary">
            View certificates
          </ActionButton>
        }
        description={`${earned} certificate${earned === 1 ? "" : "s"} earned.`}
        title="Certificate summary"
      />
      <div className="mt-5">
        {certificates.length > 0 ? (
          certificates.slice(0, 1).map((certificate) => (
            <div
              className="rounded-[16px] border border-dec-green/25 bg-dec-green/5 p-4"
              key={certificate.certificateCode}
            >
              <StatusBadge
                label={certificate.status}
                tone={certificate.status === "Issued" ? "green" : "gold"}
              />
              <h3 className="mt-3 text-base font-semibold text-dark-ink">
                {certificate.title}
              </h3>
              <p className="mt-2 break-words text-xs text-muted-text">
                Certificate ID: {certificate.certificateCode}
              </p>
              <p className="mt-1 text-xs text-muted-text">
                Issued: {certificate.issuedAt}
              </p>
              <ActionButton className="mt-4" href={certificate.href} size="sm" variant="secondary">
                View Certificate
              </ActionButton>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-muted-text">
            Earned certificates will appear after you complete eligible course requirements.
          </p>
        )}
      </div>
    </article>
  );
}

function SupportNote() {
  return (
    <aside className="flex flex-col gap-3 rounded-[20px] border border-dec-blue/20 bg-dec-blue/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-bold text-deep-navy">Need help with your profile?</h2>
        <p className="mt-1 text-xs leading-5 text-[#26536c]">
          Contact support for account access or changes to platform-managed information.
        </p>
      </div>
      <ActionButton href="/support" size="sm" variant="secondary" className="min-h-11 w-full shrink-0 text-center text-xs sm:w-auto">
        Open support
      </ActionButton>
    </aside>
  );
}

export function LearnerProfile({
  data,
  updateState,
}: {
  data: LearnerProfileData;
  updateState?: string;
}) {
  const profileDetails = [
    { label: "Full name", value: data.account.fullName },
    { label: "Email", managed: true, value: data.account.email },
    { label: "Job title", value: data.account.jobTitle },
    { label: "Department", value: data.account.department },
    { label: "Region", value: data.account.region },
    { label: "Preferred language", value: data.account.preferredLanguage },
    { label: "Phone", value: data.account.phone },
    { label: "Joined", managed: true, value: data.account.createdAt },
    { label: "Last learning activity", managed: true, value: data.account.lastActivityAt },
  ];

  const organizationDetails = [
    { label: "Linked organization", managed: true, value: data.organization.name },
    { label: "Organization status", managed: true, value: data.organization.status },
    { label: "Organization region", managed: true, value: data.organization.region },
    { label: "Primary cohort", managed: true, value: data.organization.cohortName },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <ProfileIntroduction />

      <section aria-label="Account and organization information" className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={`Account: ${data.account.status}`} tone="green" />
          <StatusBadge label={`Role: ${data.account.roles[0] ?? "Learner"}`} tone="blue" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <DetailCard
            description="Personal and account information connected to your learner record."
            items={profileDetails}
            title="Account and personal information"
          />
          <DetailCard
            description="Your authorized organization and cohort context."
            items={organizationDetails}
            title="Organization link"
          />
        </div>
      </section>

      <ProfileEditForm data={data} updateState={updateState} />

      <section aria-label="Learning activity summary" className="space-y-4">
        <SectionHeader
          description="A quick view of your current learning activity."
          title="Learning activity"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            helperText="Courses currently in progress."
            label="In progress"
            tone="blue"
            value={data.courses.inProgress}
          />
          <MetricCard
            helperText="Courses completed by your learner account."
            label="Completed"
            tone="green"
            value={data.courses.completed}
          />
          <MetricCard
            helperText="Certificates issued to you."
            label="Certificates earned"
            tone="orange"
            value={data.certificates.earned}
          />
          <MetricCard
            helperText="All course enrollments linked to your account."
            label="Total enrollments"
            tone="gray"
            value={data.courses.total}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <CertificateList
          certificates={data.certificates.recent}
          earned={data.certificates.earned}
        />
        <CourseActivityList courses={data.courses.recent} />
      </section>

      <SupportNote />
    </div>
  );
}

function SettingsInfoCard({
  description,
  label,
  title,
}: {
  description: string;
  label: string;
  title: string;
}) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <StatusBadge label={label} tone="blue" />
      <h2 className="mt-4 text-xl font-semibold text-dark-ink">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted-text">{description}</p>
    </article>
  );
}

export function LearnerSettings({ data }: { data: LearnerProfileData }) {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <div className="max-w-3xl">
          <StatusBadge label="Account settings" tone="green" />
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Settings
          </h1>
          <p className="mt-4 text-base leading-7 text-white/75">
            Review how your learner account information is used across courses,
            certificates, and future privacy controls.
          </p>
        </div>
      </section>

      <section aria-label="Account summary" className="space-y-5">
        <SectionHeader
          description="A safe summary of your signed-in learner account."
          title="Account information"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            helperText="Current account state."
            label="Account status"
            tone="green"
            value={data.account.status}
          />
          <MetricCard
            helperText="Primary learner role."
            label="Role"
            tone="blue"
            value={data.account.roles[0] ?? "Learner"}
          />
          <MetricCard
            helperText="Date your account was created."
            label="Joined"
            tone="gray"
            value={data.account.createdAt}
          />
          <MetricCard
            helperText="Your linked organization."
            label="Organization"
            tone="orange"
            value={data.organization.name}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <SettingsInfoCard
          description="Issued certificates display your name on the certificate, course title, issue date, certificate ID, status, and issuing platform. Public verification does not show your email, assessment answers, private progress, or organization details."
          label="Certificates"
          title="Certificate visibility"
        />
        <SettingsInfoCard
          description="Portfolio-style evidence is not active in this learner area. If portfolio concepts are added later, private content should remain visible only to you and approved programme roles."
          label="Portfolio"
          title="Portfolio privacy"
        />
        <SettingsInfoCard
          description="Directory and community visibility are not active yet. Your profile is not listed in a public learner directory."
          label="Visibility"
          title="Directory and community"
        />
        <SettingsInfoCard
          description="Password and sign-in recovery follow the current platform authentication flow. Contact your programme focal person or platform administrator if you need account access support."
          label="Security"
          title="Password and account access"
        />
        <SettingsInfoCard
          description="Formal data and privacy requests do not have a dedicated request model in this phase. Use the programme support channel for corrections, exports, or removal requests."
          label="Privacy"
          title="Data requests"
        />
        <article className="rounded-[24px] border border-dec-blue/20 bg-dec-blue/10 p-6">
          <StatusBadge label="Profile" tone="blue" />
          <h2 className="mt-4 text-xl font-semibold text-deep-navy">
            Update basic profile details
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#26536c]">
            You can update your display name, job title, department, region,
            preferred language, and phone number from your profile page.
          </p>
          <ActionButton className="mt-5" href="/learn/profile" variant="secondary">
            Open Profile
          </ActionButton>
        </article>
      </section>
    </div>
  );
}
