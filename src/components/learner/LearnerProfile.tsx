import { AlertMessage, ActionButton, MetricCard, SectionHeader, StatusBadge } from "@/components/ui";
import { updateLearnerProfileAction } from "@/lib/learner-actions";
import type {
  LearnerProfileCertificateSummary,
  LearnerProfileCourseSummary,
  LearnerProfileData,
} from "@/lib/learner-profile-workflow";

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "L";

  return (
    <div
      aria-hidden="true"
      className="flex size-16 shrink-0 items-center justify-center rounded-full bg-dec-green text-2xl font-semibold text-deep-navy"
    >
      {initials}
    </div>
  );
}

function ProfileHero({ data }: { data: LearnerProfileData }) {
  const primaryRole = data.account.roles[0] ?? "Learner";

  return (
    <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <StatusBadge label="Learner profile" tone="green" />
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Review your account details, organization link, and learning activity.
          </p>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5 text-white">
          <div className="flex items-center gap-4">
            <InitialsAvatar name={data.account.fullName} />
            <div>
              <h2 className="text-2xl font-semibold leading-tight">
                {data.account.fullName}
              </h2>
              <p className="mt-1 text-sm text-white/70">{data.account.status}</p>
            </div>
          </div>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-[16px] bg-white/10 px-4 py-3">
              <dt className="text-white/70">Role</dt>
              <dd className="text-right font-semibold text-white">{primaryRole}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[16px] bg-white/10 px-4 py-3">
              <dt className="text-white/70">Organization</dt>
              <dd className="text-right font-semibold text-white">
                {data.organization.name}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[16px] bg-white/10 px-4 py-3">
              <dt className="text-white/70">Last activity</dt>
              <dd className="text-right font-semibold text-white">
                {data.account.lastActivityAt}
              </dd>
            </div>
          </dl>
        </article>
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
  items: { label: string; value: string }[];
  title: string;
}) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <SectionHeader description={description} title={title} />
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((detail) => (
          <div className="rounded-[18px] bg-soft-bg p-4" key={detail.label}>
            <dt className="text-sm font-medium text-muted-text">{detail.label}</dt>
            <dd className="mt-2 break-words text-base font-semibold leading-6 text-dark-ink">
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
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <SectionHeader
        description="Update the profile fields supported by your account record. Email and organization are managed by platform administrators."
        title="Edit profile"
      />
      {updateState === "updated" ? (
        <div className="mt-5">
          <AlertMessage tone="success" title="Profile updated">
            Your learner profile details were saved.
          </AlertMessage>
        </div>
      ) : null}
      {updateState === "missing-name" ? (
        <div className="mt-5">
          <AlertMessage tone="error" title="Name required">
            Add a display name before saving your profile.
          </AlertMessage>
        </div>
      ) : null}
      <form action={updateLearnerProfileAction} className="mt-6 grid gap-4 sm:grid-cols-2">
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
    </article>
  );
}

function CourseActivityList({
  courses,
}: {
  courses: LearnerProfileCourseSummary[];
}) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <SectionHeader
        description="Recent course activity linked to your learner account."
        title="Recent learning"
      />
      <div className="mt-6 space-y-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              className="rounded-[18px] border border-design-border bg-soft-bg p-4"
              key={course.href}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <StatusBadge label={course.status} tone="blue" />
                  <h3 className="mt-3 text-base font-semibold text-dark-ink">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-text">
                    Last activity: {course.lastAccessedAt}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold text-deep-navy">
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
}: {
  certificates: LearnerProfileCertificateSummary[];
}) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <SectionHeader
        description="Recent certificate records connected to your learner account."
        title="Certificate summary"
      />
      <div className="mt-6 space-y-4">
        {certificates.length > 0 ? (
          certificates.map((certificate) => (
            <div
              className="rounded-[18px] border border-design-border bg-soft-bg p-4"
              key={certificate.certificateCode}
            >
              <StatusBadge
                label={certificate.status}
                tone={certificate.status === "Issued" ? "green" : "gold"}
              />
              <h3 className="mt-3 text-base font-semibold text-dark-ink">
                {certificate.title}
              </h3>
              <p className="mt-2 text-sm text-muted-text">
                Certificate ID: {certificate.certificateCode}
              </p>
              <p className="mt-1 text-sm text-muted-text">
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
    <aside className="rounded-[24px] border border-dec-blue/20 bg-dec-blue/10 p-6">
      <StatusBadge label="Support" tone="blue" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Need to update linked organization details?
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#26536c]">
        Organization and cohort links are managed by platform administrators so
        learner records stay aligned with programme reporting.
      </p>
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
    { label: "Email", value: data.account.email },
    { label: "Account status", value: data.account.status },
    { label: "Role", value: data.account.roles.join(", ") || "Learner" },
    { label: "Job title", value: data.account.jobTitle },
    { label: "Department", value: data.account.department },
    { label: "Region", value: data.account.region },
    { label: "Preferred language", value: data.account.preferredLanguage },
  ];

  const organizationDetails = [
    { label: "Linked organization", value: data.organization.name },
    { label: "Organization status", value: data.organization.status },
    { label: "Organization region", value: data.organization.region },
    { label: "Primary cohort", value: data.organization.cohortName },
  ];

  return (
    <div className="space-y-8">
      <ProfileHero data={data} />

      <section aria-label="Learning activity summary" className="space-y-5">
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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <DetailCard
            description="Core account fields connected to your signed-in learner record."
            items={profileDetails}
            title="Profile information"
          />
          <ProfileEditForm data={data} updateState={updateState} />
          <CourseActivityList courses={data.courses.recent} />
        </div>

        <div className="space-y-6">
          <DetailCard
            description="Only your linked organization and cohort context are shown here."
            items={organizationDetails}
            title="Organization link"
          />
          <CertificateList certificates={data.certificates.recent} />
          <SupportNote />
        </div>
      </section>
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
