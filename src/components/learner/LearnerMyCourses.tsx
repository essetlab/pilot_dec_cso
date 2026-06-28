import { ActionButton, MetricCard, SectionHeader, StatusBadge } from "@/components/ui";
import type { LearnerCourseSummary } from "@/lib/course-types";

function getSummaryCards(courses: LearnerCourseSummary[]) {
  const completed = courses.filter((course) => course.statusLabel === "Completed");
  const inProgress = courses.filter((course) => course.statusLabel === "In progress");
  const notStarted = courses.filter((course) => course.statusLabel === "Not started");
  const certificates = courses.filter((course) => course.certificateStatus === "Issued");

  return [
    {
      helperText: "Continue the active learning path.",
      label: "In progress",
      tone: "blue" as const,
      value: inProgress.length,
    },
    {
      helperText: "Courses ready when you are.",
      label: "Not started",
      tone: "gray" as const,
      value: notStarted.length,
    },
    {
      helperText: "Completed learning will appear here.",
      label: "Completed",
      tone: "green" as const,
      value: completed.length,
    },
    {
      helperText: "Certificates unlock after course requirements are met.",
      label: "Certificates earned",
      tone: "orange" as const,
      value: certificates.length,
    },
  ];
}

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

function PageHero({ course }: { course?: LearnerCourseSummary }) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <StatusBadge label="My learning" tone="green" />
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            My Courses
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Track your active learning, continue courses, and review available
            next steps.
          </p>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-white/70">
            Your courses appear here when they are assigned to you or when you
            begin learning.
          </p>
        </div>
        <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 text-white">
          <p className="text-sm font-semibold text-dec-green">Current focus</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            {course ? `Continue ${course.shortTitle}` : "Continue learning"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Pick up from your current lesson and keep moving toward the final test.
          </p>
          <div className="mt-6 rounded-[18px] bg-white p-4">
            <ProgressBar label="Course progress" value={course?.progress ?? 0} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseFilterBar() {
  return (
    <section
      aria-label="Course search and filters"
      className="rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-deep-navy">
            Find a course
          </h2>
          <label
            className="mt-4 block text-sm font-medium text-muted-text"
            htmlFor="course-search"
          >
            Search courses
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            id="course-search"
            name="course-search"
            type="search"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:w-[620px]">
          <label className="block text-sm font-medium text-muted-text">
            Status
            <select
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              defaultValue="All"
              name="status"
            >
              <option>All</option>
              <option>In progress</option>
              <option>Not started</option>
              <option>Completed</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-muted-text sm:col-span-2 lg:col-span-2">
            Capacity area
            <select
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              defaultValue="All"
              name="capacity-area"
            >
              <option>All</option>
              <option>Proposal Development</option>
              <option>Financial Management</option>
              <option>Safeguarding</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}

function LearnerCourseCard({
  capacityArea,
  certificateStatus,
  currentLesson,
  duration,
  href,
  primaryAction,
  learnerHref,
  finalTestHref,
  progress,
  secondaryAction,
  statusLabel,
  description,
  title,
}: LearnerCourseSummary) {
  const isInProgress = statusLabel === "In progress";

  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="grid gap-6 lg:grid-cols-[1fr_240px] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={statusLabel} tone={isInProgress ? "green" : "gray"} />
            <StatusBadge label={capacityArea} tone="blue" />
            <StatusBadge label={certificateStatus} tone="gold" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-dark-ink">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-text">{description}</p>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-[18px] bg-soft-bg p-4">
              <dt className="font-medium text-muted-text">Current lesson</dt>
              <dd className="mt-1 font-semibold leading-6 text-dark-ink">
                {currentLesson}
              </dd>
            </div>
            <div className="rounded-[18px] bg-soft-bg p-4">
              <dt className="font-medium text-muted-text">Estimated time</dt>
              <dd className="mt-1 font-semibold text-dark-ink">{duration}</dd>
            </div>
          </dl>
          <div className="mt-5">
            <ProgressBar label={`${title} progress`} value={progress} />
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-[20px] border border-design-border bg-soft-bg p-4">
          <ActionButton href={learnerHref}>{primaryAction}</ActionButton>
          <ActionButton href={isInProgress ? finalTestHref : href} variant="secondary">
            {secondaryAction}
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

function LearningSupportCard() {
  return (
    <article className="rounded-[24px] border border-dec-blue/20 bg-dec-blue/10 p-6">
      <StatusBadge label="Learning support" tone="blue" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Need support with your assigned courses?
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#26536c]">
        If a course is assigned through your organization or cohort, contact your
        programme focal person for support.
      </p>
    </article>
  );
}

function CompletedStatePreview() {
  return (
    <article className="rounded-[24px] border border-dashed border-dec-green/45 bg-dec-green/10 p-6">
      <StatusBadge label="Completed courses" tone="green" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Completed courses will appear here.
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#426f1c]">
        When you complete eligible courses, related certificates will appear in
        Certificates.
      </p>
      <div className="mt-5">
        <ActionButton href="/learn/certificates" variant="secondary">
          View Certificates
        </ActionButton>
      </div>
    </article>
  );
}

export function LearnerMyCourses({
  courses,
}: {
  courses: LearnerCourseSummary[];
}) {
  const summaryCards = getSummaryCards(courses);
  const currentCourse = courses.find((course) => course.progress > 0) ?? courses[0];

  return (
    <div className="space-y-8">
      <PageHero course={currentCourse} />

      <section aria-label="Course summary" className="space-y-5">
        <SectionHeader
          description="A quick view of your learning status across active and available courses."
          title="Course summary"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <CourseFilterBar />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-5">
          <SectionHeader
            description="Continue an active course or review available course next steps."
            title="Your course list"
          />
          <div className="space-y-5">
            {courses.map((course) => (
              <LearnerCourseCard key={course.title} {...course} />
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <LearningSupportCard />
          <CompletedStatePreview />
        </aside>
      </section>
    </div>
  );
}
