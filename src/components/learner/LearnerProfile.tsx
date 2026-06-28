import { ActionButton, MetricCard, SectionHeader, StatusBadge } from "@/components/ui";
import { DEMO_PROPOSAL_COURSE, DEMO_ROUTE_PATHS } from "@/lib/demo-data";

const currentCourseHref = DEMO_ROUTE_PATHS.learnerCourse;

const profileDetails = [
  { label: "Full name", value: "Participant" },
  { label: "Email", value: "Participant account" },
  { label: "Organization", value: "Local CSO" },
  { label: "Region", value: "Ethiopia" },
  {
    label: "Primary learning interest",
    value: "Proposal development and CSO management",
  },
  { label: "Account type", value: "Learner" },
];

const summaryCards = [
  {
    helperText: "One course is currently active.",
    label: "Courses in progress",
    tone: "blue" as const,
    value: 1,
  },
  {
    helperText: "Completed learning will appear in My Courses.",
    label: "Courses completed",
    tone: "green" as const,
    value: 0,
  },
  {
    helperText: "Certificates appear after eligible course requirements are met.",
    label: "Certificates earned",
    tone: "orange" as const,
    value: 0,
  },
  {
    helperText: "Continue from your current lesson.",
    label: "Current course",
    tone: "gray" as const,
    value: "Proposal Development",
  },
];

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-dark-ink">{label}</span>
        <span className="font-semibold text-deep-navy">{value}%</span>
      </div>
      <div
        aria-label={`${label}: ${value}% complete`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={value}
        className="h-2.5 overflow-hidden rounded-full bg-soft-bg"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-dec-green"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ProfileHero() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <StatusBadge label="Learner profile" tone="green" />
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Review your learning profile, organization information, and course
            activity.
          </p>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5 text-white">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center rounded-full bg-dec-green text-2xl font-semibold text-deep-navy"
            >
              P
            </div>
            <div>
              <h2 className="text-2xl font-semibold leading-tight">Participant</h2>
              <p className="mt-1 text-sm text-white/70">Active learner</p>
            </div>
          </div>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-[16px] bg-white/10 px-4 py-3">
              <dt className="text-white/70">Role</dt>
              <dd className="font-semibold text-white">Participant</dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[16px] bg-white/10 px-4 py-3">
              <dt className="text-white/70">Organization</dt>
              <dd className="font-semibold text-white">Local CSO</dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[16px] bg-white/10 px-4 py-3">
              <dt className="text-white/70">Learning status</dt>
              <dd className="font-semibold text-white">Active learner</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function ProfileInformationCard() {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <SectionHeader
        description="Your core learner details for this learning space."
        title="Profile information"
      />
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {profileDetails.map((detail) => (
          <div className="rounded-[18px] bg-soft-bg p-4" key={detail.label}>
            <dt className="text-sm font-medium text-muted-text">{detail.label}</dt>
            <dd className="mt-2 text-base font-semibold leading-6 text-dark-ink">
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function CurrentLearningCard() {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="Current course" tone="blue" />
            <StatusBadge label="In progress" tone="green" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-dark-ink">
            {DEMO_PROPOSAL_COURSE.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-text">
            Current lesson: {DEMO_PROPOSAL_COURSE.currentLesson}
          </p>
          <div className="mt-5 max-w-xl">
            <ProgressBar
              label="Current course progress"
              value={DEMO_PROPOSAL_COURSE.progress}
            />
          </div>
        </div>
        <ActionButton className="shrink-0" href={currentCourseHref} size="lg">
          Continue Learning
        </ActionButton>
      </div>
    </article>
  );
}

function SupportNote() {
  return (
    <aside className="rounded-[24px] border border-dec-blue/20 bg-dec-blue/10 p-6">
      <StatusBadge label="Support" tone="blue" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Need to update your details?
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#26536c]">
        If your name, organization, or course access needs to be updated, contact
        your programme focal person or platform support team.
      </p>
    </aside>
  );
}

function AccountActions() {
  const actions = [
    { href: "/learn", label: "Back to Dashboard" },
    { href: "/learn/my-courses", label: "My Courses" },
    { href: "/learn/certificates", label: "Certificates" },
  ];

  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <SectionHeader
        description="Use these learner links to move through your learning space."
        title="Account actions"
      />
      <div className="mt-6 flex flex-col gap-3">
        {actions.map((action, index) => (
          <ActionButton
            href={action.href}
            key={action.href}
            variant={index === 0 ? "primary" : "secondary"}
          >
            {action.label}
          </ActionButton>
        ))}
      </div>
    </article>
  );
}

export function LearnerProfile() {
  return (
    <div className="space-y-8">
      <ProfileHero />

      <section aria-label="Learning activity summary" className="space-y-5">
        <SectionHeader
          description="A quick view of your current learning activity."
          title="Learning activity"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <ProfileInformationCard />
          <CurrentLearningCard />
        </div>

        <div className="space-y-6">
          <SupportNote />
          <AccountActions />
        </div>
      </section>
    </div>
  );
}
