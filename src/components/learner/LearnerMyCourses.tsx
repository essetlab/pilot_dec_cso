import { ActionButton, MetricCard, SectionHeader, StatusBadge } from "@/components/ui";
import type { LearnerCourseSummary } from "@/lib/course-types";
import { HRBA_EXTERNAL_COURSE_SLUG } from "@/lib/external-course-config";

const HRBA_PILOT_FEEDBACK_URL = "https://ee.kobotoolbox.org/x/8Plk5gtY";

function getSummaryCards(courses: LearnerCourseSummary[]) {
  const completed = courses.filter((course) =>
    ["Completed", "Certificate issued"].includes(course.statusLabel),
  );
  const inProgress = courses.filter((course) => course.statusLabel === "In progress");
  const notStarted = courses.filter((course) => course.statusLabel === "Not started");
  const certificates = courses.filter((course) => course.certificateCode);

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
      helperText: "Completed learning.",
      label: "Completed",
      tone: "green" as const,
      value: completed.length,
    },
    {
      helperText: "Certificates unlocked.",
      label: "Certificates earned",
      tone: "orange" as const,
      value: certificates.length,
    },
  ];
}

function ProgressBar({
  compact = false,
  label,
  value,
}: {
  compact?: boolean;
  label: string;
  value: number;
}) {
  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <div className="flex items-center justify-between gap-4 text-xs font-semibold">
        <span className="text-muted-text">{label}</span>
        <span className="text-deep-navy font-bold">{value}%</span>
      </div>
      <div
        aria-label={`${label}: ${value}% complete`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={value}
        className={`${compact ? "h-1.5" : "h-2"} overflow-hidden rounded-full bg-soft-bg`}
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-dec-green transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function shouldUseDocumentLaunch(href?: string) {
  return href?.startsWith("/learn/courses/") && href.endsWith("/external");
}

function PageHero({ course }: { course?: LearnerCourseSummary }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-dec-blue/10" />
      <div aria-hidden="true" className="absolute -left-10 bottom-10 h-48 w-48 rounded-full border-[16px] border-dec-green/5" />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center relative z-10">
        <div>
          <StatusBadge label="My learning" tone="green" />
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
            My Courses
          </h1>
          <p className="mt-3 text-sm leading-normal text-slate-300 max-w-2xl">
            Track your active learning, continue courses, and review available next steps.
          </p>
          <p className="mt-4 text-2xs leading-normal text-slate-400">
            Your courses appear here when they are assigned to you or when you begin learning.
          </p>
        </div>
        <div className="rounded-card border border-white/15 bg-white/5 p-5 text-white backdrop-blur">
          <p className="text-xs font-semibold text-dec-green">Current focus</p>
          <h2 className="mt-2.5 text-lg font-bold leading-tight">
            {course ? `Continue ${course.shortTitle}` : "Continue learning"}
          </h2>
          <p className="mt-2 text-xs leading-normal text-slate-300">
            Pick up from your current course and keep moving toward completion.
          </p>
          <div className="mt-5">
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
      className="rounded-card border border-design-border bg-white p-5 shadow-soft"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-deep-navy">
            Find a course
          </h2>
          <label
            className="mt-3 block text-xs font-semibold text-muted-text"
            htmlFor="course-search"
          >
            Search courses
          </label>
          <input
            className="mt-1.5 min-h-10 w-full rounded-control border border-design-border bg-white px-4 text-sm text-deep-navy outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            id="course-search"
            name="course-search"
            type="search"
            placeholder="Type course title..."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:w-[620px]">
          <label className="block text-xs font-semibold text-muted-text">
            Status
            <select
              className="mt-1.5 min-h-10 w-full rounded-control border border-design-border bg-white px-4 text-sm font-semibold text-deep-navy outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              defaultValue="All"
              name="status"
            >
              <option>All</option>
              <option>In progress</option>
              <option>Not started</option>
              <option>Completed</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-muted-text sm:col-span-2 lg:col-span-2">
            Capacity area
            <select
              className="mt-1.5 min-h-10 w-full rounded-control border border-design-border bg-white px-4 text-sm font-semibold text-deep-navy outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
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
  certificateCode,
  certificateDownloadHref,
  certificateStatus,
  currentLesson,
  duration,
  feedbackHref,
  feedbackStatus,
  primaryAction,
  primaryActionHref,
  learnerHref,
  finalTestHref,
  progress,
  secondaryAction,
  secondaryActionHref,
  slug,
  statusLabel,
  description,
  title,
  verifyCertificateHref,
}: LearnerCourseSummary) {
  const isInProgress = statusLabel === "In progress";
  const isCertificateIssued = statusLabel === "Certificate issued";
  const isFinalAssessment = statusLabel === "Final assessment available";
  const showHrbaPilotFeedback =
    slug === HRBA_EXTERNAL_COURSE_SLUG &&
    (isCertificateIssued || statusLabel === "Completed");
  const statusTone = isCertificateIssued
    ? "gold"
    : isFinalAssessment
      ? "purple"
      : isInProgress
        ? "green"
        : statusLabel === "Completed"
          ? "blue"
          : "gray";

  return (
    <article className="rounded-card border border-design-border bg-white p-4 shadow-soft transition hover:shadow-card sm:p-5">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_210px] md:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge label={statusLabel} tone={statusTone} />
            <StatusBadge label={capacityArea} tone="blue" />
            {certificateStatus ? (
              <span className="inline-flex min-h-6 items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-3xs font-semibold leading-none text-amber-800">
                {certificateStatus}
              </span>
            ) : null}
            {feedbackStatus && (
              <span
                className={`inline-flex min-h-6 items-center rounded-full border px-2.5 py-1 text-3xs font-semibold leading-none ${
                  feedbackStatus === "Feedback submitted"
                    ? "border-[#3a6118]/25 bg-[#e8f5d6] text-[#3a6118]"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {feedbackStatus}
              </span>
            )}
          </div>
          <h2 className="mt-3 text-lg font-bold leading-snug text-deep-navy sm:text-xl">
            {title}
          </h2>
          <p className="mt-1.5 line-clamp-2 max-w-3xl text-xs leading-normal text-muted-text">
            {description}
          </p>
          <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
            <div className="min-w-0 rounded-control border border-design-border/50 bg-light-bg px-3 py-2.5">
              <dt className="font-semibold text-muted-text uppercase text-3xs">Current lesson</dt>
              <dd className="mt-0.5 font-bold leading-normal text-deep-navy">
                {isCertificateIssued
                  ? "Course complete"
                  : isFinalAssessment
                    ? "Final assessment"
                    : currentLesson}
              </dd>
            </div>
            <div className="min-w-0 rounded-control border border-design-border/50 bg-light-bg px-3 py-2.5">
              <dt className="font-semibold text-muted-text uppercase text-3xs">
                {certificateCode ? "Certificate code" : "Estimated time"}
              </dt>
              <dd className="mt-0.5 break-words font-mono font-bold text-deep-navy">
                {certificateCode ?? duration}
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            <ProgressBar compact label={`${title} progress`} value={progress} />
          </div>
        </div>
        <div className="rounded-control border border-design-border bg-light-bg/70 p-3">
          <ActionButton
            forceDocumentNavigation={shouldUseDocumentLaunch(primaryActionHref ?? learnerHref)}
            href={primaryActionHref ?? learnerHref}
            prefetch={shouldUseDocumentLaunch(primaryActionHref ?? learnerHref) ? false : undefined}
            className="w-full text-center justify-center font-bold text-xs"
          >
            {primaryAction}
          </ActionButton>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-1">
            {certificateDownloadHref ? (
              <ActionButton href={certificateDownloadHref} size="sm" variant="success" className="w-full text-center justify-center font-bold text-xs">
                Download certificate
              </ActionButton>
            ) : null}
            {verifyCertificateHref ? (
              <ActionButton href={verifyCertificateHref} size="sm" variant="outline" className="w-full text-center justify-center font-semibold text-xs">
                Verify certificate
              </ActionButton>
            ) : null}
            {(progress > 0 || certificateCode) && feedbackHref ? (
              <ActionButton href={feedbackHref} size="sm" variant="outline" className="w-full text-center justify-center font-semibold text-xs">
                Give feedback
              </ActionButton>
            ) : null}
            {showHrbaPilotFeedback ? (
              <ActionButton
                forceDocumentNavigation
                href={HRBA_PILOT_FEEDBACK_URL}
                rel="noopener noreferrer"
                size="sm"
                target="_blank"
                variant="outline"
                className="w-full text-center justify-center font-semibold text-xs"
              >
                Share pilot feedback
              </ActionButton>
            ) : null}
            {secondaryActionHref || (isInProgress && finalTestHref) ? (
              <ActionButton
                forceDocumentNavigation={shouldUseDocumentLaunch(secondaryActionHref ?? finalTestHref)}
                href={secondaryActionHref ?? finalTestHref}
                prefetch={
                  shouldUseDocumentLaunch(secondaryActionHref ?? finalTestHref)
                    ? false
                    : undefined
                }
                size="sm"
                variant="secondary"
                className="w-full text-center justify-center font-semibold text-xs"
              >
                {secondaryAction || (isInProgress ? "Final test" : "View overview")}
              </ActionButton>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function LearningSupportCard() {
  return (
    <article className="rounded-card border border-dec-blue/20 bg-dec-blue/5 p-6">
      <StatusBadge label="Learning support" tone="blue" />
      <h2 className="mt-4 text-base font-bold text-deep-navy">
        Need support with your assigned courses?
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-[#26536c]">
        If a course is assigned through your organization or cohort, contact your programme focal person for assistance.
      </p>
    </article>
  );
}

function CompletedStatePreview() {
  return (
    <article className="rounded-card border border-dashed border-dec-green/30 bg-dec-green/5 p-6">
      <StatusBadge label="Completed courses" tone="green" />
      <h2 className="mt-4 text-base font-bold text-deep-navy">
        Completed courses
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-[#426f1c]">
        When you complete eligible courses and pass the final assessment, related certificates will appear in Certificates.
      </p>
      <div className="mt-5">
        <ActionButton href="/learn/certificates" variant="secondary" size="sm" className="font-bold">
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

      <section aria-label="Course summary" className="space-y-4">
        <SectionHeader
          description="A quick view of your learning status across active and available courses."
          title="Course summary"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <CourseFilterBar />

      <section className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-4">
          <SectionHeader
            description="Continue an active course or review available course next steps."
            title="Your course list"
          />
          <div className="space-y-4">
            {courses.map((course) => (
              <LearnerCourseCard key={course.title} {...course} />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <LearningSupportCard />
          <CompletedStatePreview />
        </aside>
      </section>
    </div>
  );
}
