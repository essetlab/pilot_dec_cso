import { EmptyState, MetricCard, StatusBadge } from "@/components/ui";
import type {
  PilotMonitoringCourseSummary,
  PilotMonitoringData,
} from "@/lib/pilot-monitoring-workflow";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function MetricIcon({ label }: { label: string }) {
  return <span className="text-sm font-bold">{label}</span>;
}

function PageHeader({ generatedAt }: { generatedAt: string }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label="Internal" tone="blue" />
          <StatusBadge label="Pilot monitoring" tone="green" />
        </div>
        <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
          Pilot monitoring
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
          Review aggregate learner registration, enrollment, progress,
          assessment, certificate, and feedback signals for the pilot.
        </p>
        <p className="mt-5 max-w-3xl rounded-[18px] border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/75">
          This monitoring view is for pilot learning support and programme
          improvement. It should not be used to expose private learner
          responses.
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-dec-green">
          Generated {formatDate(generatedAt)}
        </p>
      </div>
    </section>
  );
}

function SummaryCards({ data }: { data: PilotMonitoringData }) {
  const metrics = [
    {
      helperText: "Users with active or invited learner accounts.",
      label: "Registered learners",
      tone: "blue" as const,
      value: data.summary.registeredLearners,
    },
    {
      helperText: "Learners with started or accessed enrollments.",
      label: "Active learners",
      tone: "green" as const,
      value: data.summary.activeLearners,
    },
    {
      helperText: "Active CSO organization records.",
      label: "Organizations",
      tone: "blue" as const,
      value: data.summary.organizations,
    },
    {
      helperText: "Learner-course enrollment records.",
      label: "Enrollments",
      tone: "blue" as const,
      value: data.summary.totalEnrollments,
    },
    {
      helperText: "Registered or enrolled learners without started activity.",
      label: "Not started",
      tone: "gray" as const,
      value: data.summary.learnersNotStarted,
    },
    {
      helperText: "Learners with progress below completion.",
      label: "In progress",
      tone: "orange" as const,
      value: data.summary.learnersInProgress,
    },
    {
      helperText: "Learners with completed enrollment records.",
      label: "Completed",
      tone: "green" as const,
      value: data.summary.learnersCompleted,
    },
    {
      helperText: "Submitted final assessment attempts.",
      label: "Final attempts",
      tone: "blue" as const,
      value: data.summary.finalAssessmentAttempts,
    },
    {
      helperText: "Attempts marked passed.",
      label: "Passed attempts",
      tone: "green" as const,
      value: data.summary.passedAttempts,
    },
    {
      helperText: "Attempts marked failed.",
      label: "Failed attempts",
      tone: "red" as const,
      value: data.summary.failedAttempts,
    },
    {
      helperText: "Issued certificate records.",
      label: "Certificates issued",
      tone: "orange" as const,
      value: data.summary.certificatesIssued,
    },
    {
      helperText: "Course feedback responses saved.",
      label: "Feedback responses",
      tone: "green" as const,
      value: data.summary.feedbackSubmitted,
    },
  ];

  return (
    <section aria-label="Pilot summary cards" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard
          helperText={metric.helperText}
          icon={<MetricIcon label={String(index + 1).padStart(2, "0")} />}
          key={metric.label}
          label={metric.label}
          tone={metric.tone}
          value={metric.value}
        />
      ))}
    </section>
  );
}

function RatingCell({ value }: { value: string }) {
  return (
    <span className={value === "N/A" ? "text-muted-text" : "font-semibold text-dark-ink"}>
      {value}
    </span>
  );
}

function CourseTableRow({ course }: { course: PilotMonitoringCourseSummary }) {
  return (
    <tr className="border-b border-design-border last:border-0">
      <th className="min-w-72 px-4 py-4 text-left text-sm font-semibold text-dark-ink" scope="row">
        {course.courseTitle}
      </th>
      <td className="px-4 py-4 text-sm text-muted-text">{course.enrolledLearners}</td>
      <td className="px-4 py-4 text-sm text-muted-text">{course.startedLearners}</td>
      <td className="px-4 py-4 text-sm font-semibold text-dark-ink">{course.averageProgress}</td>
      <td className="px-4 py-4 text-sm text-muted-text">{course.completedLearners}</td>
      <td className="px-4 py-4 text-sm text-muted-text">{course.certificatesIssued}</td>
      <td className="px-4 py-4 text-sm text-muted-text">{course.feedbackSubmitted}</td>
      <td className="px-4 py-4 text-sm"><RatingCell value={course.averageOverallRating} /></td>
      <td className="px-4 py-4 text-sm"><RatingCell value={course.averageUsefulnessRating} /></td>
      <td className="px-4 py-4 text-sm"><RatingCell value={course.averageEaseOfUseRating} /></td>
      <td className="px-4 py-4 text-sm"><RatingCell value={course.averageClarityRating} /></td>
    </tr>
  );
}

function CourseSummaryTable({ courses }: { courses: PilotMonitoringCourseSummary[] }) {
  if (courses.length === 0) {
    return (
      <EmptyState
        description="Course monitoring data will appear after pilot courses are published."
        title="No published pilot courses"
      />
    );
  }

  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">
          Course summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Aggregate course-level signals only. This table does not show learner
          emails, assessment answers, feedback text, or internal IDs.
        </p>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-[1120px] text-left">
          <thead>
            <tr className="border-y border-design-border bg-soft-bg text-xs font-bold uppercase tracking-[0.08em] text-muted-text">
              <th className="px-4 py-3" scope="col">Course</th>
              <th className="px-4 py-3" scope="col">Enrolled</th>
              <th className="px-4 py-3" scope="col">Started</th>
              <th className="px-4 py-3" scope="col">Avg progress</th>
              <th className="px-4 py-3" scope="col">Completed</th>
              <th className="px-4 py-3" scope="col">Certificates</th>
              <th className="px-4 py-3" scope="col">Feedback</th>
              <th className="px-4 py-3" scope="col">Overall</th>
              <th className="px-4 py-3" scope="col">Usefulness</th>
              <th className="px-4 py-3" scope="col">Ease</th>
              <th className="px-4 py-3" scope="col">Clarity</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <CourseTableRow course={course} key={course.courseTitle} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SupportingPanels({ data }: { data: PilotMonitoringData }) {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
        <StatusBadge label="Certificates" tone="gold" />
        <h2 className="mt-4 text-xl font-semibold text-dark-ink">
          Certificate summary
        </h2>
        <p className="mt-3 text-4xl font-semibold text-dark-ink">
          {data.summary.certificatesIssued}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-text">
          Issued certificate records across the pilot. Download and public
          verification behavior remains handled by the existing certificate
          journey.
        </p>
      </article>

      <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
        <StatusBadge label="Assessment" tone="blue" />
        <h2 className="mt-4 text-xl font-semibold text-dark-ink">
          Final assessment summary
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-text">
          {data.summary.finalAssessmentAttempts} attempts recorded,{" "}
          {data.summary.passedAttempts} passed, {data.summary.failedAttempts} failed.
        </p>
        <p className="mt-3 text-xs leading-5 text-muted-text">
          Assessment answers and raw response payloads are not displayed.
        </p>
      </article>

      <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
        <StatusBadge label="Feedback" tone="green" />
        <h2 className="mt-4 text-xl font-semibold text-dark-ink">
          Feedback summary
        </h2>
        <p className="mt-3 text-4xl font-semibold text-dark-ink">
          {data.summary.feedbackSubmitted}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-text">
          Structured feedback response count. Sensitive text responses are not
          shown in this pilot monitoring view.
        </p>
      </article>
    </section>
  );
}

export function AdminPilotMonitoring({ data }: { data: PilotMonitoringData }) {
  return (
    <div className="space-y-8">
      <PageHeader generatedAt={data.generatedAt} />
      <SummaryCards data={data} />
      <CourseSummaryTable courses={data.courseSummaries} />
      <SupportingPanels data={data} />
    </div>
  );
}
