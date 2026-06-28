import { ActionButton, MetricCard, SectionHeader, StatusBadge } from "@/components/ui";
import type { LearnerCourseSummary } from "@/lib/course-types";

function getSummaryCards(courses: LearnerCourseSummary[]) {
  const inProgress = courses.filter((course) => course.progress > 0).length;

  return [
    {
      helperText: "Keep building from your current lesson.",
      label: "Courses in progress",
      tone: "blue" as const,
      value: inProgress,
    },
    {
      helperText: "Completed learning will appear here.",
      label: "Courses completed",
      tone: "green" as const,
      value: 0,
    },
    {
      helperText: "Certificates unlock after completion rules are met.",
      label: "Certificates earned",
      tone: "orange" as const,
      value: 0,
    },
    {
      helperText: "Browse public learning opportunities.",
      label: "Available courses",
      tone: "gray" as const,
      value: courses.length,
    },
  ];
}

function ProgressBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
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

function LearningPreview({ course }: { course: LearnerCourseSummary }) {
  return (
    <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 text-white shadow-soft backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-white">Current lesson</span>
        <span className="rounded-full bg-dec-green px-3 py-1 text-xs font-semibold text-deep-navy">
          {course.progress}%
        </span>
      </div>
      <h2 className="mt-5 text-2xl font-semibold leading-tight">
        {course.currentLesson}
      </h2>
      <p className="mt-3 text-sm leading-6 text-white/75">
        Continue {course.shortTitle} with a practical lesson connected to your
        CSO learning path.
      </p>
      <div className="mt-6">
        <ProgressBar label="Course progress" value={course.progress} />
      </div>
    </div>
  );
}

function ContinueLearningCard({ course }: { course: LearnerCourseSummary }) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft lg:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <StatusBadge label="Continue learning" tone="green" />
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-dark-ink">
            {course.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-text">
            Current lesson: {course.currentLesson}
          </p>
          <div className="mt-5 max-w-xl">
            <ProgressBar
              label={`${course.shortTitle} progress`}
              value={course.progress}
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <ActionButton href={course.learnerHref} size="lg">
            Continue Learning
          </ActionButton>
          <ActionButton href="/courses" size="lg" variant="secondary">
            Browse Courses
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

function CourseCard({
  capacityArea,
  learnerHref,
  primaryAction,
  progress,
  statusLabel,
  title,
}: LearnerCourseSummary) {
  const isStarted = progress > 0;

  return (
    <article className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={capacityArea} tone="blue" />
            <StatusBadge label={statusLabel} tone={isStarted ? "green" : "gray"} />
          </div>
          <h3 className="mt-4 text-lg font-semibold leading-snug text-dark-ink">
            {title}
          </h3>
          <div className="mt-5">
            <ProgressBar label={`${title} progress`} value={progress} />
          </div>
        </div>
        <ActionButton
          className="sm:mt-1"
          href={learnerHref}
          variant={isStarted ? "primary" : "secondary"}
        >
          {primaryAction}
        </ActionButton>
      </div>
    </article>
  );
}

function CertificatePreview() {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge label="Certificate" tone="gold" />
          <h2 className="mt-4 text-xl font-semibold text-dark-ink">
            Certificate not yet earned
          </h2>
        </div>
        <div
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-control bg-dec-green/15 text-lg font-bold text-[#426f1c]"
        >
          0
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-text">
        Complete the required lessons and final test to unlock your certificate.
      </p>
      <div className="mt-6">
        <ActionButton href="/learn/certificates" variant="secondary">
          View Certificates
        </ActionButton>
      </div>
    </article>
  );
}

function SupportCard() {
  return (
    <aside className="rounded-[24px] border border-dec-blue/20 bg-dec-blue/10 p-6">
      <StatusBadge label="Support" tone="blue" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Need help with an assigned course?
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#26536c]">
        If a course is assigned through your organization or cohort, contact your
        programme focal person for support.
      </p>
    </aside>
  );
}

export function LearnerDashboard({
  courses,
}: {
  courses: LearnerCourseSummary[];
}) {
  const primaryCourse =
    courses.find((course) => course.progress > 0) ?? courses[0];
  const summaryCards = getSummaryCards(courses);
  const activeCourses = courses.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dec-green">
              Learner dashboard
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              Welcome back, Participant
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
              Continue your CSO learning journey and track your progress.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70">
              Your learning space brings together active courses, next steps, and
              certificate readiness in one calm view.
            </p>
          </div>
          {primaryCourse ? <LearningPreview course={primaryCourse} /> : null}
        </div>
      </section>

      {primaryCourse ? <ContinueLearningCard course={primaryCourse} /> : null}

      <section aria-label="Learning summary" className="space-y-5">
        <SectionHeader
          description="A quick view of your learning activity and available course options."
          title="Learning summary"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <SectionHeader
            action={
              <ActionButton href="/learn/my-courses" variant="secondary">
                View My Courses
              </ActionButton>
            }
            description="Pick up where you left off or begin an assigned learning journey."
            title="My active courses"
          />
          <div className="space-y-4">
            {activeCourses.map((course) => (
              <CourseCard key={course.title} {...course} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <CertificatePreview />
          <SupportCard />
        </div>
      </section>

      <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <StatusBadge label="Next step" tone="green" />
            <h2 className="mt-4 text-2xl font-semibold text-dark-ink">
              Keep learning at your own pace
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-text">
              Continue the proposal course now, or explore other practical courses
              designed for local and grassroots CSOs.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ActionButton href={primaryCourse?.learnerHref ?? "/learn/my-courses"}>
              Continue Learning
            </ActionButton>
            <ActionButton href="/courses" variant="secondary">
              Explore Courses
            </ActionButton>
          </div>
        </div>
      </section>
    </div>
  );
}
