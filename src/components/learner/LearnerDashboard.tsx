import { ActionButton, MetricCard, SectionHeader, StatusBadge } from "@/components/ui";
import type { LearnerCourseSummary } from "@/lib/course-types";
import type { LearnerCertificateSummary } from "@/lib/certificate-workflow";

function getSummaryCards(courses: LearnerCourseSummary[], certificatesCount: number) {
  const inProgress = courses.filter((course) => course.statusLabel === "In progress").length;
  const completed = courses.filter((course) =>
    ["Completed", "Certificate issued"].includes(course.statusLabel),
  ).length;
  const available = courses.filter((course) => course.statusLabel === "Not started").length;

  return [
    {
      helperText: "Active learning paths underway.",
      label: "Courses in progress",
      tone: "blue" as const,
      value: inProgress,
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      helperText: "Finished courses.",
      label: "Courses completed",
      tone: "green" as const,
      value: completed,
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      helperText: "Verified certificates issued.",
      label: "Certificates earned",
      tone: "orange" as const,
      value: certificatesCount,
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
    {
      helperText: "Learning paths to explore.",
      label: "Available courses",
      tone: "gray" as const,
      value: available,
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
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
      <div className="flex items-center justify-between gap-4 text-xs font-semibold">
        <span className="text-muted-text">{label}</span>
        <span className="text-deep-navy font-bold">{value}%</span>
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

function ContinueLearningCard({ course }: { course: LearnerCourseSummary }) {
  const isStarted = course.progress > 0;
  const isCompleted = ["Completed", "Certificate issued"].includes(course.statusLabel);

  return (
    <article className="rounded-card border border-design-border bg-white p-6 shadow-soft lg:p-7 relative overflow-hidden transition hover:border-dec-green/30">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-dec-green/5 blur-2xl" aria-hidden="true" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-3xs font-black uppercase tracking-wider text-dec-blue bg-dec-blue/10 px-2 py-0.5 rounded">
              Current Focus
            </span>
            <StatusBadge label={course.statusLabel} tone={course.certificateCode ? "gold" : isStarted ? "green" : "gray"} />
            {course.capacityArea && <StatusBadge label={course.capacityArea} tone="blue" />}
          </div>
          <h2 className="mt-4 text-xl font-bold leading-snug text-deep-navy">
            {course.title}
          </h2>
          <p className="mt-2.5 text-xs leading-normal text-muted-text max-w-xl">
            {isCompleted
              ? "Course completed successfully. You can download your completion certificate or review the content at any time."
              : isStarted
                ? `Current module: ${course.currentModule || "Introductory module"} • Next lesson: ${course.currentLesson}`
                : "Register or begin the introductory lesson to start tracking your progress."}
          </p>
          <div className="mt-5 max-w-lg">
            <ProgressBar
              label="Course progress"
              value={course.progress}
            />
          </div>
          {course.feedbackStatus && (
            <p className="mt-3 text-3xs font-semibold text-dec-blue bg-dec-blue/5 px-2 py-0.5 rounded inline-block">
              {course.feedbackStatus}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col sm:w-auto w-full">
          <ActionButton
            forceDocumentNavigation={shouldUseDocumentLaunch(course.primaryActionHref)}
            href={course.primaryActionHref}
            prefetch={shouldUseDocumentLaunch(course.primaryActionHref) ? false : undefined}
            size="md"
            className="w-full sm:w-auto text-center justify-center font-bold text-sm"
          >
            {isCompleted ? "Review course" : isStarted ? "Resume course" : "Start course"}
          </ActionButton>
          
          {course.certificateDownloadHref ? (
            <ActionButton
              href={course.certificateDownloadHref}
              variant="success"
              className="w-full sm:w-auto text-center justify-center font-bold text-sm"
            >
              Download certificate
            </ActionButton>
          ) : course.secondaryActionHref ? (
            <ActionButton
              forceDocumentNavigation={shouldUseDocumentLaunch(course.secondaryActionHref)}
              href={course.secondaryActionHref}
              prefetch={shouldUseDocumentLaunch(course.secondaryActionHref) ? false : undefined}
              variant="secondary"
              className="w-full sm:w-auto text-center justify-center font-semibold text-sm"
            >
              {course.secondaryAction || "View details"}
            </ActionButton>
          ) : null}

          {(isStarted || isCompleted) && course.feedbackHref && (
            <ActionButton
              href={course.feedbackHref}
              variant="outline"
              className="w-full sm:w-auto text-center justify-center font-semibold text-sm"
            >
              Give feedback
            </ActionButton>
          )}
        </div>
      </div>
    </article>
  );
}

function LearnerCourseCard({ course }: { course: LearnerCourseSummary }) {
  const isStarted = course.progress > 0;
  const isCompleted = ["Completed", "Certificate issued"].includes(course.statusLabel);

  return (
    <article className="rounded-card border border-design-border bg-white p-5 shadow-soft hover:shadow-card hover:border-dec-green/30 transition flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge label={course.statusLabel} tone={course.certificateCode ? "gold" : isStarted ? "green" : "gray"} />
          {course.capacityArea && <StatusBadge label={course.capacityArea} tone="blue" />}
        </div>
        <h3 className="mt-3.5 text-base font-bold text-deep-navy leading-snug">
          {course.title}
        </h3>
        <p className="mt-2 text-xs text-muted-text line-clamp-2">
          {course.description || "Practical case-led capacity building online learning."}
        </p>
      </div>
      <div className="mt-5 space-y-4">
        <ProgressBar label="Progress" value={course.progress} />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <ActionButton
            forceDocumentNavigation={shouldUseDocumentLaunch(course.primaryActionHref)}
            href={course.primaryActionHref}
            prefetch={shouldUseDocumentLaunch(course.primaryActionHref) ? false : undefined}
            size="sm"
            className="font-bold shrink-0 text-xs"
            variant={isCompleted ? "secondary" : "primary"}
          >
            {isCompleted ? "Review" : isStarted ? "Resume" : "Start"}
          </ActionButton>
          
          {course.certificateDownloadHref && (
            <ActionButton href={course.certificateDownloadHref} size="sm" variant="success" className="font-bold text-xs">
              PDF
            </ActionButton>
          )}

          {course.feedbackHref && (isStarted || isCompleted) && (
            <ActionButton href={course.feedbackHref} size="sm" variant="outline" className="text-xs">
              Feedback
            </ActionButton>
          )}
        </div>
      </div>
    </article>
  );
}

function DashboardCertificateCard({ certificate }: { certificate: LearnerCertificateSummary }) {
  return (
    <article className="rounded-card border border-design-border bg-white p-5 shadow-soft flex flex-col justify-between hover:shadow-card hover:border-dec-green/20 transition">
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-3xs font-extrabold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
            Issued
          </span>
          <span className="text-3xs text-muted-text font-medium">
            {certificate.issuedAt}
          </span>
        </div>
        <h3 className="mt-3.5 text-sm font-bold text-deep-navy leading-snug line-clamp-2">
          {certificate.courseTitle}
        </h3>
        <p className="text-3xs text-muted-text mt-2 font-medium">
          Code: <code className="font-mono bg-light-bg px-1.5 py-0.5 rounded text-deep-navy font-bold">{certificate.certificateCode}</code>
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-design-border flex items-center gap-2">
        <ActionButton href={certificate.certificateHref} size="sm" variant="secondary" className="font-bold text-xs px-2.5">
          View
        </ActionButton>
        {certificate.downloadHref && (
          <ActionButton href={certificate.downloadHref} size="sm" variant="success" className="font-bold text-xs px-2.5">
            Download PDF
          </ActionButton>
        )}
      </div>
    </article>
  );
}

function AvailableLearningCard({ course }: { course: LearnerCourseSummary }) {
  return (
    <article className="rounded-card border border-design-border bg-white p-5 shadow-soft hover:shadow-card hover:border-dec-blue/30 transition flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-3xs font-extrabold uppercase tracking-wider text-dec-blue bg-dec-blue/10 px-2 py-0.5 rounded">
            Available
          </span>
          {course.capacityArea && <StatusBadge label={course.capacityArea} tone="blue" />}
        </div>
        <h3 className="mt-3.5 text-base font-bold text-deep-navy leading-snug">
          {course.title}
        </h3>
        <p className="mt-2 text-xs text-muted-text line-clamp-2">
          {course.description || "Start this course to explore e-learning modules."}
        </p>
      </div>
      <div className="mt-5 pt-1">
        <ActionButton
          forceDocumentNavigation={shouldUseDocumentLaunch(course.primaryActionHref)}
          href={course.primaryActionHref}
          prefetch={shouldUseDocumentLaunch(course.primaryActionHref) ? false : undefined}
          className="font-bold w-full text-center justify-center text-xs"
        >
          {course.primaryAction || "Start learning"}
        </ActionButton>
      </div>
    </article>
  );
}

function EmptyContinueLearningCard() {
  return (
    <article className="rounded-card border border-design-border bg-white p-8 text-center shadow-soft">
      <h2 className="text-lg font-bold text-deep-navy">No active courses yet</h2>
      <p className="mt-2 text-xs text-muted-text max-w-sm mx-auto">
        You are not currently enrolled in any active courses. Visit the courses catalogue to explore available learning opportunities.
      </p>
      <div className="mt-5">
        <ActionButton href="/courses" size="sm">Explore courses</ActionButton>
      </div>
    </article>
  );
}

function EmptyCertificatesCard() {
  return (
    <div className="rounded-card border border-design-border bg-light-bg/40 p-6 text-center">
      <p className="text-xs text-muted-text max-w-md mx-auto">
        No certificates earned yet. Certificates become available automatically after you complete eligible courses and score at least 80% on the final assessment.
      </p>
    </div>
  );
}

function TechnicalFeedbackCard() {
  return (
    <aside className="rounded-card border border-dec-blue/20 bg-dec-blue/5 p-5">
      <StatusBadge label="Assisted Pilot" tone="blue" />
      <h3 className="mt-3 text-sm font-bold text-deep-navy">
        Technical support & feedback
      </h3>
      <p className="mt-2 text-xs leading-normal text-[#26536c]">
        Encountering a bug or want to provide feedback on the pilot interface? Revisit the registration guidance or contact support.
      </p>
      <div className="mt-4 pt-1 flex flex-col gap-2">
        <ActionButton href="/support" size="sm" variant="secondary" className="w-full text-center justify-center">
          Open Support Guidance
        </ActionButton>
      </div>
    </aside>
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
  // Priority: 1) In progress, 2) Partially started (>0 progress), 3) Not started entitled course, 4) Fallback to first course
  const primaryCourse =
    courses.find((course) => course.statusLabel === "In progress") ??
    courses.find((course) => course.progress > 0) ??
    courses.find((course) => course.statusLabel === "Not started") ??
    courses[0];

  const summaryCards = getSummaryCards(courses, certificates.length);

  // Active courses are courses in progress or completed
  const activeAndCompletedCourses = courses.filter((course) =>
    ["In progress", "Completed", "Certificate issued"].includes(course.statusLabel)
  );

  // Available learning are courses that are not started/enrolled yet
  const availableCourses = courses.filter((course) =>
    course.statusLabel === "Not started"
  );

  return (
    <div className="space-y-8">
      {/* 1. Welcoming header section */}
      <section className="relative overflow-hidden rounded-[24px] bg-deep-navy px-6 py-8 text-white shadow-hero lg:px-8 lg:py-10">
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-dec-blue/10" />
        <div aria-hidden="true" className="absolute -left-10 bottom-10 h-48 w-48 rounded-full border-[16px] border-dec-green/5" />
        
        <div className="relative z-10 max-w-2xl">
          <span className="text-2xs font-extrabold uppercase tracking-[0.16em] text-[#72bee8]">
            Learner Space
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Welcome back, {learnerName || "Learner"}
          </h1>
          <p className="mt-3 text-xs leading-normal text-slate-300">
            Access your courses, practice case studies, and track eligible completion certificates below.
          </p>
        </div>
      </section>

      {/* 2. Continue Learning Card */}
      <section aria-label="Continue learning focus" className="space-y-4">
        {primaryCourse ? (
          <ContinueLearningCard course={primaryCourse} />
        ) : (
          <EmptyContinueLearningCard />
        )}
      </section>

      {/* 3. Progress Summary Indicator Cards */}
      <section aria-label="Learning progress summary" className="space-y-4">
        <SectionHeader
          description="A quick overview of your learning activity and metrics."
          title="Progress summary"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      {/* Grid containing My Active Courses (Left) and Certificates/Support (Right) */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left Column: My Learning List */}
        <section aria-label="My active courses list" className="space-y-4">
          <SectionHeader
            action={
              <ActionButton href="/learn/my-courses" variant="secondary" size="sm" className="font-bold">
                View My Courses
              </ActionButton>
            }
            description="Pick up where you left off or review completed courses."
            title="My active courses"
          />
          {activeAndCompletedCourses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {activeAndCompletedCourses.map((course) => (
                <LearnerCourseCard key={course.title} course={course} />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-design-border bg-white p-6 text-center shadow-soft text-xs text-muted-text">
              No active learning records found. Start an available course below to begin.
            </div>
          )}
        </section>

        {/* Right Column: Certificates Summary & Technical Support */}
        <div className="space-y-6">
          <section aria-label="My earned certificates" className="space-y-4">
            <SectionHeader title="Certificates" />
            {certificateError ? (
              <div className="rounded-card border border-amber-200 bg-amber-50/60 p-5 shadow-soft">
                <p className="text-xs font-bold text-deep-navy">Certificates temporarily unavailable</p>
                <p className="mt-1 text-xs text-muted-text leading-relaxed">
                  {certificateError.message} Please refresh or contact support if the problem continues.
                </p>
              </div>
            ) : certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.slice(0, 3).map((certificate) => (
                  <DashboardCertificateCard key={certificate.certificateCode} certificate={certificate} />
                ))}
                {certificates.length > 3 && (
                  <ActionButton href="/learn/certificates" variant="secondary" className="w-full text-center justify-center font-bold text-xs">
                    View all {certificates.length} certificates
                  </ActionButton>
                )}
              </div>
            ) : (
              <EmptyCertificatesCard />
            )}
          </section>

          <TechnicalFeedbackCard />
        </div>
      </div>

      {/* 6. Available Learning Section */}
      <section aria-label="Available capacity building courses" className="space-y-4">
        <SectionHeader
          description="Explore other training paths open to Ethiopian civil society organizations."
          title="Available learning"
        />
        {availableCourses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((course) => (
              <AvailableLearningCard key={course.title} course={course} />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-design-border bg-light-bg/40 p-6 text-center text-xs text-muted-text">
            All entitled courses are currently in progress or completed.
          </div>
        )}
      </section>
    </div>
  );
}
