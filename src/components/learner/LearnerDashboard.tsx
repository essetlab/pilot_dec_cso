import { ActionButton, SectionHeader, StatusBadge } from "@/components/ui";
import type { LearnerCertificateSummary } from "@/lib/certificate-workflow";
import type { LearnerCourseSummary } from "@/lib/course-types";
import {
  isAssessmentReady,
  selectDashboardAttention,
  selectDashboardNextAction,
  type DashboardNextAction,
} from "./learner-dashboard-state";

type MetricTone = "blue" | "green" | "gray" | "orange";

function getSummaryCards(courses: LearnerCourseSummary[], certificatesCount: number) {
  const inProgress = courses.filter((course) => course.statusLabel === "In progress").length;
  const assessmentReady = courses.filter(isAssessmentReady).length;
  const completed = courses.filter((course) =>
    !isAssessmentReady(course) &&
    ["Completed", "Certificate issued"].includes(course.statusLabel),
  ).length;

  return [
    {
      label: "In progress",
      tone: "blue" as const,
      value: inProgress,
    },
    {
      label: "Assessment ready",
      tone: "orange" as const,
      value: assessmentReady,
    },
    {
      label: "Completed",
      tone: "green" as const,
      value: completed,
    },
    {
      label: "Certificates earned",
      tone: "gray" as const,
      value: certificatesCount,
    },
  ];
}

const metricToneClasses: Record<MetricTone, string> = {
  blue: "bg-dec-blue/10 text-dec-blue",
  green: "bg-dec-green/15 text-[#4f7c24]",
  gray: "bg-soft-bg text-muted-text",
  orange: "bg-orange-50 text-orange-700",
};

function CompactMetricCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: MetricTone;
  value: number;
}) {
  return (
    <article className="rounded-card border border-design-border bg-white px-4 py-3.5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-muted-text">{label}</p>
        <span
          aria-hidden="true"
          className={`size-2.5 shrink-0 rounded-full ${metricToneClasses[tone]}`}
        />
      </div>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-deep-navy">{value}</p>
    </article>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4 text-xs font-semibold">
        <span className="text-muted-text">{label}</span>
        <span className="font-bold text-deep-navy">{value}%</span>
      </div>
      <div
        aria-label={`${label}: ${value}% complete`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={value}
        className="h-2 overflow-hidden rounded-full bg-soft-bg"
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

function DashboardIntroduction({ learnerName }: { learnerName: string }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-deep-navy px-5 py-6 text-white shadow-hero sm:px-6 lg:px-8 lg:py-7">
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-14 h-40 w-40 rounded-full border-[18px] border-dec-blue/10"
      />
      <div className="relative z-10 max-w-2xl">
        <p className="text-2xs font-extrabold uppercase tracking-[0.16em] text-[#72bee8]">
          Learner dashboard
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
          Welcome back, {learnerName || "Learner"}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
          See your next learning step, track progress, and find support in one place.
        </p>
      </div>
    </section>
  );
}

function getNextActionHeading(action: DashboardNextAction) {
  if (action.kind === "assessment") return "Complete your final assessment";
  if (action.kind === "in-progress") return "Continue your learning";
  if (action.kind === "feedback") return "Share course feedback";
  if (action.kind === "certificate") return "Your certificate is ready";
  if (action.kind === "not-started") return "Start your next course";
  return action.kind === "my-courses" ? "Review your learning" : "Learning support";
}

function getNextActionContext(action: DashboardNextAction) {
  if (action.kind === "assessment") {
    return "You have completed the course learning and are ready for the final assessment.";
  }
  if (action.kind === "in-progress") {
    return `Current lesson: ${action.course?.currentLesson || "Continue from your latest lesson"}`;
  }
  if (action.kind === "feedback") {
    return "Your course is complete. Share your experience to finish this learning step.";
  }
  if (action.kind === "certificate") {
    return "Your learning is complete and your certificate is available.";
  }
  if (action.kind === "not-started") return "This course is ready when you are.";
  if (action.kind === "my-courses") return "Open My Courses to review your available learning.";
  return "Contact support for help accessing your learning.";
}

function NextActionCard({ action }: { action: DashboardNextAction }) {
  const { course } = action;
  const showProgress = course
    ? action.kind === "assessment" || action.kind === "in-progress" || course.progress > 0
    : false;
  const secondaryHref = course
    ? course.certificateDownloadHref ?? course.secondaryActionHref
    : undefined;
  const secondaryLabel = course
    ? course.certificateDownloadHref
      ? "Download certificate"
      : course.secondaryAction
    : undefined;

  return (
    <section aria-labelledby="next-action-heading" className="rounded-[20px] border border-design-border bg-white p-5 shadow-soft sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex min-h-7 items-center rounded-full bg-dec-blue/10 px-3 py-1 text-xs font-bold text-dec-blue">
              Next action
            </span>
            {course ? (
              <StatusBadge
                label={action.kind === "assessment" ? "Assessment ready" : course.statusLabel}
                tone={course.certificateCode ? "gold" : course.progress > 0 ? "green" : "gray"}
              />
            ) : null}
          </div>
          <h2 id="next-action-heading" className="mt-3 text-xl font-bold text-deep-navy">
            {getNextActionHeading(action)}
          </h2>
          {course ? (
            <h3 className="mt-1.5 text-lg font-semibold leading-snug text-dark-ink">
              {course.title}
            </h3>
          ) : null}
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-text">
            {getNextActionContext(action)}
          </p>
          {showProgress && course ? (
            <div className="mt-4 max-w-2xl">
              <ProgressBar label="Course progress" value={course.progress} />
            </div>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row lg:w-[210px] lg:flex-col">
          <ActionButton
            aria-label={course ? `${action.actionLabel}: ${course.title}` : action.actionLabel}
            forceDocumentNavigation={shouldUseDocumentLaunch(action.actionHref)}
            href={action.actionHref}
            prefetch={shouldUseDocumentLaunch(action.actionHref) ? false : undefined}
            className="min-h-11 w-full text-center font-bold"
          >
            {action.actionLabel}
          </ActionButton>
          {course && secondaryHref && secondaryLabel && secondaryHref !== action.actionHref ? (
            <ActionButton
              aria-label={`${secondaryLabel}: ${course.title}`}
              forceDocumentNavigation={shouldUseDocumentLaunch(secondaryHref)}
              href={secondaryHref}
              prefetch={shouldUseDocumentLaunch(secondaryHref) ? false : undefined}
              size="sm"
              variant="secondary"
              className="min-h-11 w-full text-center text-xs"
            >
              {secondaryLabel}
            </ActionButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ActiveCourseCard({ course }: { course: LearnerCourseSummary }) {
  const assessmentReady = isAssessmentReady(course);

  return (
    <article className="rounded-card border border-design-border bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge
          label={assessmentReady ? "Assessment ready" : course.statusLabel}
          tone={assessmentReady ? "orange" : course.progress > 0 ? "green" : "gray"}
        />
        {course.capacityArea ? (
          <span className="text-xs font-semibold text-dec-blue">{course.capacityArea}</span>
        ) : null}
      </div>
      <h3 className="mt-3 text-base font-bold leading-snug text-deep-navy">{course.title}</h3>
      <p className="mt-1.5 line-clamp-1 text-xs text-muted-text">
        {assessmentReady
          ? "Course learning complete — final assessment ready"
          : `Current lesson: ${course.currentLesson}`}
      </p>
      <div className="mt-3">
        <ProgressBar label="Progress" value={course.progress} />
      </div>
      <div className="mt-3">
        <ActionButton
          aria-label={`${course.primaryAction}: ${course.title}`}
          forceDocumentNavigation={shouldUseDocumentLaunch(course.primaryActionHref)}
          href={course.primaryActionHref}
          prefetch={shouldUseDocumentLaunch(course.primaryActionHref) ? false : undefined}
          size="sm"
          variant="primary"
          className="min-h-11 w-full text-center text-xs sm:w-auto"
        >
          {course.primaryAction}
        </ActionButton>
      </div>
    </article>
  );
}

function AttentionCard({ action }: { action: DashboardNextAction }) {
  const { course } = action;
  if (!course) return null;

  const heading = action.kind === "assessment"
    ? "Final assessment ready"
    : action.kind === "feedback"
      ? "Course feedback is waiting"
      : "Certificate ready";
  const description = action.kind === "assessment"
    ? `Complete the final assessment for ${course.title}.`
    : action.kind === "feedback"
      ? `Share feedback on ${course.title}.`
      : `Your certificate for ${course.title} is available.`;

  return (
    <article className="rounded-card border border-amber-200 bg-amber-50/60 p-4 shadow-soft">
      <p className="text-2xs font-extrabold uppercase tracking-wider text-amber-800">Needs attention</p>
      <h2 className="mt-2 text-base font-bold text-deep-navy">{heading}</h2>
      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-text">{description}</p>
      <div className="mt-3">
        <ActionButton
          aria-label={`${action.actionLabel}: ${course.title}`}
          forceDocumentNavigation={shouldUseDocumentLaunch(action.actionHref)}
          href={action.actionHref}
          prefetch={shouldUseDocumentLaunch(action.actionHref) ? false : undefined}
          size="sm"
          variant="warning"
          className="min-h-11 w-full text-center text-xs sm:w-auto"
        >
          {action.actionLabel}
        </ActionButton>
      </div>
    </article>
  );
}

function RecentAchievement({ certificate }: { certificate: LearnerCertificateSummary }) {
  return (
    <article className="rounded-card border border-dec-green/30 bg-pale-mint p-4 shadow-soft">
      <p className="text-2xs font-extrabold uppercase tracking-wider text-[#4f7c24]">
        Recent achievement
      </p>
      <h2 className="mt-2 text-base font-bold leading-snug text-deep-navy">
        {certificate.courseTitle}
      </h2>
      <p className="mt-1.5 text-xs text-muted-text">Certificate issued {certificate.issuedAt}</p>
      <div className="mt-3">
        <ActionButton
          aria-label={`View certificate: ${certificate.courseTitle}`}
          href={certificate.certificateHref}
          size="sm"
          variant="success"
          className="min-h-11 w-full text-center text-xs sm:w-auto"
        >
          View certificate
        </ActionButton>
      </div>
    </article>
  );
}

function AvailableCoursePreview({ course }: { course: LearnerCourseSummary }) {
  return (
    <article className="flex flex-col justify-between rounded-card border border-design-border bg-white p-4 shadow-soft">
      <div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">
            Ready to begin
          </span>
          {course.capacityArea ? (
            <span className="text-xs font-semibold text-muted-text">{course.capacityArea}</span>
          ) : null}
        </div>
        <h3 className="mt-2.5 text-base font-bold leading-snug text-deep-navy">{course.title}</h3>
        <p className="mt-1.5 line-clamp-1 text-xs text-muted-text">{course.description}</p>
      </div>
      <div className="mt-3">
        <ActionButton
          aria-label={`${course.primaryAction}: ${course.title}`}
          forceDocumentNavigation={shouldUseDocumentLaunch(course.primaryActionHref)}
          href={course.primaryActionHref}
          prefetch={shouldUseDocumentLaunch(course.primaryActionHref) ? false : undefined}
          size="sm"
          className="min-h-11 w-full text-center text-xs"
        >
          {course.primaryAction}
        </ActionButton>
      </div>
    </article>
  );
}

function SupportCard() {
  return (
    <section className="flex flex-col gap-3 rounded-card border border-dec-blue/20 bg-dec-blue/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-bold text-deep-navy">Need learning or technical support?</h2>
        <p className="mt-0.5 text-xs text-[#26536c]">
          Find guidance for course access, certificates, and using the learning platform.
        </p>
      </div>
      <ActionButton
        href="/support"
        size="sm"
        variant="secondary"
        className="min-h-11 w-full shrink-0 text-center text-xs sm:w-auto"
      >
        Open support
      </ActionButton>
    </section>
  );
}

function EmptyDashboardState() {
  return (
    <section className="rounded-[20px] border border-design-border bg-white p-6 text-center shadow-soft">
      <h2 className="text-xl font-bold text-deep-navy">No learning is available yet</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-text">
        Your learning will appear here when a course becomes available to your account.
      </p>
      <div className="mt-4">
        <ActionButton href="/support" className="min-h-11 w-full text-center sm:w-auto">
          Contact support
        </ActionButton>
      </div>
    </section>
  );
}

export function LearnerDashboard({
  courses,
  certificates = [],
  certificateError,
  learnerName,
}: {
  courses: LearnerCourseSummary[];
  certificates?: LearnerCertificateSummary[];
  certificateError?: { code: string; message: string };
  learnerName: string;
}) {
  const primaryAction = selectDashboardNextAction(courses);
  const primaryCourse = primaryAction.course;
  const summaryCards = getSummaryCards(courses, certificates.length);
  const activeLearningCourses = courses.filter(
    (course) => course.statusLabel === "In progress" || isAssessmentReady(course),
  );
  const availableCourses = courses.filter((course) => course.statusLabel === "Not started");

  const activeCoursesWithoutFocus = activeLearningCourses.filter(
    (course) => course.id !== primaryCourse?.id,
  );
  const activeCoursePreview = activeCoursesWithoutFocus.slice(0, 2);
  const availableCoursesWithoutFocus = availableCourses.filter(
    (course) => course.id !== primaryCourse?.id,
  );
  const availableCoursePreview = availableCoursesWithoutFocus.slice(0, 3);

  const attentionAction = selectDashboardAttention(courses, primaryAction);
  const recentAchievement = certificates.find(
    (certificate) => certificate.certificateCode !== primaryCourse?.certificateCode || primaryAction.kind === "feedback",
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardIntroduction learnerName={learnerName} />

      {courses.length === 0 ? (
        <EmptyDashboardState />
      ) : (
        <>
          <NextActionCard action={primaryAction} />

          <section aria-labelledby="progress-summary-heading" className="space-y-3">
            <SectionHeader
              description="A concise view of your current learning activity."
              title="Learning progress"
            />
            <span className="sr-only" id="progress-summary-heading">
              Learning progress summary
            </span>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {summaryCards.map((card) => (
                <CompactMetricCard key={card.label} {...card} />
              ))}
            </div>
          </section>

          {activeCoursePreview.length > 0 ? (
            <section className="space-y-3">
              <SectionHeader
                action={
                  activeCoursesWithoutFocus.length > 2 ? (
                    <ActionButton href="/learn/my-courses" size="sm" variant="secondary">
                      View all active courses
                    </ActionButton>
                  ) : undefined
                }
                description="Continue or review learning beyond your featured next step."
                title="Active learning"
              />
              <div className="grid gap-3 md:grid-cols-2">
                {activeCoursePreview.map((course) => (
                  <ActiveCourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          ) : null}

          {attentionAction || recentAchievement || certificateError ? (
            <section aria-label="Learning attention and recent achievement" className="grid gap-3 md:grid-cols-2">
              {attentionAction ? <AttentionCard action={attentionAction} /> : null}
              {recentAchievement ? <RecentAchievement certificate={recentAchievement} /> : null}
              {certificateError ? (
                <article className="rounded-card border border-amber-200 bg-amber-50/60 p-4 shadow-soft">
                  <h2 className="text-sm font-bold text-deep-navy">
                    Certificate information temporarily unavailable
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-muted-text">
                    {certificateError.message} Contact support if the problem continues.
                  </p>
                </article>
              ) : null}
            </section>
          ) : null}

          {availableCoursePreview.length > 0 ? (
            <section className="space-y-3">
              <SectionHeader
                action={
                  availableCoursesWithoutFocus.length > 3 ? (
                    <ActionButton href="/learn/my-courses" size="sm" variant="secondary">
                      View all learning
                    </ActionButton>
                  ) : undefined
                }
                description="A small preview of other learning ready when you are."
                title="Available learning"
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {availableCoursePreview.map((course) => (
                  <AvailableCoursePreview key={course.id} course={course} />
                ))}
              </div>
            </section>
          ) : null}

          <SupportCard />
        </>
      )}
    </div>
  );
}
