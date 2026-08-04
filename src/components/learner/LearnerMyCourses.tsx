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

function PageIntroduction() {
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-deep-navy px-5 py-6 text-white shadow-hero sm:px-6 lg:px-8 lg:py-7">
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-14 h-40 w-40 rounded-full border-[18px] border-dec-blue/10"
      />
      <div className="relative z-10 max-w-2xl">
        <p className="text-2xs font-extrabold uppercase tracking-[0.16em] text-[#72bee8]">
          Learning library
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
          My Courses
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Review every course you can access, its current state, and the actions available to you.
        </p>
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
  const isFinalAssessment =
    statusLabel === "Final assessment available" || certificateStatus === "Final assessment";
  const showHrbaPilotFeedback =
    slug === HRBA_EXTERNAL_COURSE_SLUG &&
    (isCertificateIssued || statusLabel === "Completed");
  const showCertificateStatus =
    Boolean(certificateStatus) && certificateStatus !== statusLabel && !isFinalAssessment;
  const hasDuplicateCertificateDownloadAction =
    Boolean(certificateDownloadHref) &&
    secondaryAction === "Download certificate" &&
    secondaryActionHref === certificateDownloadHref;
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
    <article className="rounded-card border border-design-border bg-white p-4 shadow-soft transition hover:shadow-card">
      <div className="flex flex-wrap items-center gap-1">
        <StatusBadge label={isFinalAssessment ? "Assessment ready" : statusLabel} tone={statusTone} />
        <span className="inline-flex min-h-6 items-center rounded-full border border-[#145a85]/20 bg-[#dceef8]/70 px-2.5 py-1 text-3xs font-semibold leading-none text-[#145a85]">
          {capacityArea}
        </span>
        {showCertificateStatus ? (
          <span className="inline-flex min-h-6 items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-3xs font-semibold leading-none text-amber-800">
            {certificateStatus}
          </span>
        ) : null}
        {feedbackStatus && (
          <span
            className={`inline-flex min-h-6 items-center rounded-full border px-2.5 py-1 text-3xs font-semibold leading-none ${
              feedbackStatus === "Feedback submitted"
                ? "border-[#3a6118]/20 bg-[#e8f5d6]/70 text-[#3a6118]"
                : "border-slate-200 bg-slate-50/80 text-slate-600"
            }`}
          >
            {feedbackStatus}
          </span>
        )}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_190px] md:items-start">
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-snug text-deep-navy sm:text-xl">
            {title}
          </h2>
          <p className="mt-1.5 line-clamp-2 max-w-3xl text-xs leading-normal text-muted-text">
            {description}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
          <ActionButton
            forceDocumentNavigation={shouldUseDocumentLaunch(primaryActionHref ?? learnerHref)}
            href={primaryActionHref ?? learnerHref}
            prefetch={shouldUseDocumentLaunch(primaryActionHref ?? learnerHref) ? false : undefined}
            className="w-full text-center justify-center font-bold text-xs"
          >
            {primaryAction}
          </ActionButton>
          {certificateDownloadHref ? (
            <ActionButton href={certificateDownloadHref} size="sm" variant="success" className="min-h-11 w-full text-center justify-center font-bold text-xs">
              Download certificate
            </ActionButton>
          ) : null}
          {verifyCertificateHref ? (
            <ActionButton href={verifyCertificateHref} size="sm" variant="outline" className="min-h-11 w-full text-center justify-center font-semibold text-xs">
              Verify certificate
            </ActionButton>
          ) : null}
          {(progress > 0 || certificateCode) && feedbackHref ? (
            <ActionButton href={feedbackHref} size="sm" variant="outline" className="min-h-11 w-full text-center justify-center font-semibold text-xs">
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
              className="min-h-11 w-full text-center justify-center font-semibold text-xs"
            >
              Share pilot feedback
            </ActionButton>
          ) : null}
          {!hasDuplicateCertificateDownloadAction &&
          (secondaryActionHref || (isInProgress && finalTestHref)) ? (
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
              className="min-h-11 w-full text-center justify-center font-semibold text-xs"
            >
              {secondaryAction || (isInProgress ? "Final test" : "View overview")}
            </ActionButton>
          ) : null}
        </div>
      </div>

      <dl className="mt-3 flex flex-col gap-1.5 border-y border-design-border/70 py-2 text-xs sm:flex-row sm:items-baseline sm:gap-0">
        <div className="min-w-0 sm:flex sm:flex-1 sm:items-baseline sm:gap-2">
          <dt className="text-3xs font-semibold uppercase text-muted-text">Current lesson</dt>
          <dd className="mt-0.5 font-bold leading-normal text-deep-navy sm:mt-0">
            {isCertificateIssued
              ? "Course complete"
              : isFinalAssessment
                ? "Final assessment"
                : currentLesson}
          </dd>
        </div>
        <div className="min-w-0 sm:ml-4 sm:flex sm:items-baseline sm:gap-2 sm:border-l sm:border-design-border sm:pl-4">
          <dt className="text-3xs font-semibold uppercase text-muted-text">
            {certificateCode ? "Certificate code" : "Estimated time"}
          </dt>
          <dd className="mt-0.5 break-words font-mono font-bold text-deep-navy sm:mt-0">
            {certificateCode ?? duration}
          </dd>
        </div>
      </dl>

      <div className="mt-3">
        <ProgressBar compact label={`${title} progress`} value={progress} />
      </div>
    </article>
  );
}

function LearningSupportCard() {
  return (
    <article className="flex flex-col justify-between rounded-card border border-dec-blue/20 bg-dec-blue/5 p-4">
      <div>
        <h2 className="text-sm font-bold text-deep-navy">Need learning support?</h2>
        <p className="mt-1 text-xs leading-5 text-[#26536c]">
          Find guidance for course access, progress, assessments, and technical issues.
        </p>
      </div>
      <div className="mt-3">
        <ActionButton href="/support" size="sm" variant="secondary" className="min-h-11 w-full text-center text-xs sm:w-auto">
          Open support
        </ActionButton>
      </div>
    </article>
  );
}

function CertificateUtilityCard() {
  return (
    <article className="flex flex-col justify-between rounded-card border border-dec-green/30 bg-dec-green/5 p-4">
      <div>
        <h2 className="text-sm font-bold text-deep-navy">Certificates</h2>
        <p className="mt-1 text-xs leading-5 text-[#426f1c]">
          Review certificates issued for eligible completed learning.
        </p>
      </div>
      <div className="mt-3">
        <ActionButton href="/learn/certificates" variant="secondary" size="sm" className="min-h-11 w-full text-center text-xs sm:w-auto">
          View certificates
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

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageIntroduction />

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

      <section aria-label="Course utilities" className="grid gap-3 md:grid-cols-2">
        <LearningSupportCard />
        <CertificateUtilityCard />
      </section>

      <section className="space-y-4">
        <SectionHeader
          description="Review each course state, progress, and available next steps."
          title="Your course list"
        />
        <div className="space-y-4">
          {courses.map((course) => (
            <LearnerCourseCard key={course.title} {...course} />
          ))}
        </div>
      </section>
    </div>
  );
}
