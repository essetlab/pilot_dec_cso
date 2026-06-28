import {
  ActionButton,
  EmptyState,
  FilterBar,
  MetricCard,
  StatusBadge,
} from "@/components/ui";
import type { FeedbackSummaryData } from "@/lib/feedback-workflow";
import type {
  MonitoringAttentionSignal,
  MonitoringCohortProgress,
  MonitoringCoursePerformance,
  MonitoringData,
  MonitoringKpiCard,
  MonitoringOrganizationProgress,
  MonitoringTestSummary,
} from "@/lib/monitoring-workflow";
import type { ReactNode } from "react";

const emptyFeedbackSummary: FeedbackSummaryData = {
  averageClarity: "N/A",
  averageRating: "N/A",
  averageUsefulness: "N/A",
  courses: [],
  recentComments: [],
  showComments: false,
  totalAccessibilityIssues: 0,
  totalFeedback: 0,
};

const kpiIcons = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
const chartPalette = ["bg-[#5c9ee6]", "bg-[#78bdd1]", "bg-[#73c49a]", "bg-[#8bd17c]", "bg-[#5fc0c8]", "bg-[#9cb7e8]"];

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function parseRating(value: string) {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function formatDate(value: string | null) {
  if (!value) {
    return "No submissions";
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">{children}</div>
  );
}

function DashboardHeader({ showAdminActions }: { showAdminActions: boolean }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Learning operations" tone="blue" />
            <StatusBadge label="Admin workspace" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Monitoring and evaluation
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Track participation, progress, assessment performance, certificates, and feedback across Phase 1 learning activity.
          </p>
          {showAdminActions ? (
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionButton href="/admin/courses" size="lg">
                View Courses
              </ActionButton>
              <ActionButton
                className="bg-white text-deep-navy hover:text-dec-blue"
                href="/admin/certificates"
                size="lg"
                variant="secondary"
              >
                <span className="text-deep-navy">View Certificates</span>
              </ActionButton>
            </div>
          ) : null}
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Monitoring context</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep learning activity easy to scan.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Use filters and summary cards to review participation, progress,
            tests, certificates, and feedback without exposing unnecessary
            personal detail.
          </p>
        </article>
      </div>
    </section>
  );
}

function SelectControl({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: { id: string; label: string }[];
  value: string;
}) {
  const id = `admin-monitoring-${name}`;

  return (
    <label className="block min-w-40 text-sm font-semibold text-dark-ink" htmlFor={id}>
      {label}
      <select
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={value}
        id={id}
        name={name}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function MonitoringFilterCard({ data }: { data: MonitoringData }) {
  return (
    <form action="/admin/monitoring">
      <FilterBar
        actions={
          <>
            <ActionButton href="/admin/monitoring" variant="secondary">
              Clear
            </ActionButton>
            <ActionButton type="submit">
              Apply
            </ActionButton>
          </>
        }
        filters={
          <>
            <SelectControl
              label="Course"
              name="courseId"
              options={[{ id: "", label: "All courses" }, ...data.filterOptions.courses]}
              value={data.filters.courseId}
            />
            <SelectControl
              label="Cohort"
              name="cohortId"
              options={[{ id: "", label: "All cohorts" }, ...data.filterOptions.cohorts]}
              value={data.filters.cohortId}
            />
            <SelectControl
              label="Organization"
              name="organizationId"
              options={[{ id: "", label: "All organizations" }, ...data.filterOptions.organizations]}
              value={data.filters.organizationId}
            />
            <SelectControl
              label="Date range"
              name="dateRange"
              options={data.filterOptions.dateRanges}
              value={data.filters.dateRange}
            />
          </>
        }
      />
    </form>
  );
}

function KpiCard({ icon, kpi }: { icon: string; kpi: MonitoringKpiCard }) {
  return (
    <MetricCard
      helperText={kpi.helperText}
      icon={<span className="text-sm font-bold">{icon}</span>}
      label={kpi.label}
      tone={kpi.tone}
      value={kpi.value}
    />
  );
}

function MonitoringKpiGrid({ data }: { data: MonitoringData }) {
  return (
    <section aria-labelledby="monitoring-kpi-heading">
      <h2 className="sr-only" id="monitoring-kpi-heading">Key indicators</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {data.kpiCards.map((kpi, index) => (
          <KpiCard icon={kpiIcons[index] ?? "K"} key={kpi.label} kpi={kpi} />
        ))}
      </div>
    </section>
  );
}

function Panel({
  action,
  children,
  className = "",
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <section className={`min-w-0 rounded-[24px] border border-design-border bg-white-surface p-6 text-dark-ink shadow-soft ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-design-border pb-4">
        <h2 className="text-xl font-semibold leading-tight text-dark-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function MiniProgress({
  label,
  percent,
  tone = "blue",
}: {
  label?: string;
  percent: number;
  tone?: "blue" | "green" | "orange";
}) {
  const color = {
    blue: "bg-[#5c9ee6]",
    green: "bg-[#73c49a]",
    orange: "bg-orange-400",
  }[tone];

  return (
    <div className="flex min-w-[120px] items-center gap-2">
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${clampPercent(percent)}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-semibold text-slate-700">{label ?? `${percent}%`}</span>
    </div>
  );
}

function RatingDisplay({ value }: { value: string }) {
  const numeric = parseRating(value);

  if (numeric === null) {
    return <span className="text-xs font-semibold text-slate-500">{value}</span>;
  }

  return (
    <div className="flex items-center gap-2" aria-label={`${value} out of 5`}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className="h-full rounded-full bg-[#73c49a]" style={{ width: `${clampPercent((numeric / 5) * 100)}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function AttentionSignalCard({ signal }: { signal: MonitoringAttentionSignal }) {
  const labels: Record<MonitoringAttentionSignal["type"], string> = {
    "low-activity": "Low activity",
    "low-completion": "Low completion",
    "low-feedback": "Feedback concern",
    "low-pass-rate": "Low pass rate",
  };
  const toneClass = signal.tone === "red" ? "bg-red-500" : signal.tone === "gold" ? "bg-amber-400" : "bg-orange-400";

  return (
    <article className="flex gap-3 rounded-[6px] bg-slate-50 p-3">
      <span className={`mt-1 size-3 shrink-0 rounded-full ${toneClass}`} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{labels[signal.type]}</p>
        <p className="mt-1 text-sm font-semibold leading-5 text-slate-950">{signal.label}</p>
        <p className="text-xs leading-5 text-slate-600">{signal.detail}</p>
      </div>
    </article>
  );
}

function AttentionSignalsSection({ signals }: { signals: MonitoringAttentionSignal[] }) {
  return (
    <Panel title="Attention signals">
      {signals.length === 0 ? (
        <div className="rounded-[6px] bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">No attention items</p>
          <p className="mt-1 text-xs leading-5 text-emerald-700">
            Courses and cohorts are within expected operating thresholds.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {signals.slice(0, 5).map((signal, index) => (
            <AttentionSignalCard key={`${signal.type}-${signal.label}-${index}`} signal={signal} />
          ))}
        </div>
      )}
    </Panel>
  );
}

function CourseProgressSection({ courses }: { courses: MonitoringCoursePerformance[] }) {
  return (
    <Panel title="Course progress">
      {courses.length === 0 ? (
        <EmptyState
          description="Course progress data will appear after participants enroll in published courses."
          title="No course progress data"
        />
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <article className="grid gap-3 rounded-[6px] bg-slate-50 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(150px,210px)_auto] lg:items-center" key={course.courseId}>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{course.course}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {course.enrollments} enrollments, {course.certificates} certificates
                </p>
              </div>
              <div className="space-y-2">
                <MiniProgress label={course.completion} percent={course.completionNumeric} />
                <MiniProgress label={course.passRate} percent={course.passRateNumeric} tone="green" />
              </div>
              <StatusBadge label={course.status} tone={course.statusTone} />
            </article>
          ))}
        </div>
      )}
    </Panel>
  );
}

function CohortProgressSection({ cohorts }: { cohorts: MonitoringCohortProgress[] }) {
  return (
    <Panel title="Cohort progress">
      {cohorts.length === 0 ? (
        <EmptyState
          description="Cohort progress will appear after participants are assigned or enrolled."
          title="No cohort progress data"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex h-48 items-end gap-4 border-b border-l border-slate-200 px-3 pb-3">
            {cohorts.slice(0, 6).map((cohort, index) => (
              <div className="flex min-w-14 flex-1 flex-col items-center gap-2" key={cohort.cohortId}>
                <span className="text-xs font-semibold text-slate-700">{cohort.completionRate}</span>
                <div
                  aria-label={`${cohort.cohortName}: ${cohort.completionRate} completion`}
                  className={`w-full max-w-16 rounded-t-[5px] ${chartPalette[index % chartPalette.length]}`}
                  style={{ height: `${Math.max(8, clampPercent(cohort.completionNumeric))}%` }}
                />
              </div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {cohorts.slice(0, 6).map((cohort) => (
              <div className="rounded-[6px] bg-slate-50 p-3" key={cohort.cohortId}>
                <p className="text-sm font-semibold leading-5 text-slate-900">{cohort.cohortName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {cohort.participants} participants, {cohort.enrollments} enrollments
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

function OrganizationParticipationSection({ organizations }: { organizations: MonitoringOrganizationProgress[] }) {
  const maxParticipants = Math.max(1, ...organizations.map((org) => org.participants));

  return (
    <Panel title="Organization participation">
      {organizations.length === 0 ? (
        <EmptyState
          description="Organization participation data will appear after participants are linked to organizations and begin courses."
          title="No organization participation data"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex h-48 items-end gap-3 border-b border-l border-slate-200 px-3 pb-3">
            {organizations.slice(0, 8).map((org, index) => (
              <div className="flex min-w-10 flex-1 flex-col items-center gap-2" key={org.organizationId}>
                <span className="text-xs font-semibold text-slate-700">{org.participants}</span>
                <div
                  aria-label={`${org.organizationName}: ${org.participants} participants`}
                  className={`w-full max-w-14 rounded-t-[5px] ${chartPalette[index % chartPalette.length]}`}
                  style={{ height: `${Math.max(8, (org.participants / maxParticipants) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {organizations.slice(0, 8).map((org) => (
              <div className="rounded-[6px] bg-slate-50 p-3" key={org.organizationId}>
                <p className="truncate text-sm font-semibold text-slate-900">{org.organizationName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {org.activeParticipants} active, {org.completed} completed
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

function TestSummaryPanel({ summary }: { summary: MonitoringTestSummary }) {
  const totalOutcomes = Math.max(1, summary.passedAttempts + summary.failedAttempts);
  const passedPercent = (summary.passedAttempts / totalOutcomes) * 100;
  const failedPercent = (summary.failedAttempts / totalOutcomes) * 100;

  return (
    <Panel title="Test summary">
      {summary.totalAttempts === 0 && summary.certificatesIssued === 0 ? (
        <EmptyState
          description="Final test and certificate data will appear after participants submit tests."
          title="No test data yet"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[6px] bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Attempts</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{summary.totalAttempts}</p>
            </div>
            <div className="rounded-[6px] bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Pass rate</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{summary.passRate}</p>
            </div>
            <div className="rounded-[6px] bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Certificates</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{summary.certificatesIssued}</p>
            </div>
          </div>
          <div className="space-y-3">
            <MiniProgress label={`${summary.passedAttempts}`} percent={passedPercent} tone="green" />
            <MiniProgress label={`${summary.failedAttempts}`} percent={failedPercent} tone="orange" />
            <MiniProgress label={summary.passRate} percent={summary.passRateNumeric} tone="blue" />
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Average pass score: <span className="font-semibold text-slate-700">{summary.averagePassScore}</span>. Learners nearing completion: <span className="font-semibold text-slate-700">{summary.learnersNearingCompletion}</span>.
          </p>
        </div>
      )}
    </Panel>
  );
}

function FeedbackSummaryPanel({ data }: { data: FeedbackSummaryData }) {
  return (
    <Panel title="Feedback summary">
      {data.totalFeedback === 0 ? (
        <EmptyState
          description="No participant feedback has been submitted yet."
          title="No feedback submitted yet"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Reviews", String(data.totalFeedback)],
              ["Rating", data.averageRating],
              ["Clarity", data.averageClarity],
            ].map(([label, value]) => (
              <div className="rounded-[6px] bg-slate-50 p-3" key={label}>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {data.courses.slice(0, 4).map((course) => (
              <article className="rounded-[6px] bg-slate-50 p-3" key={course.courseId}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{course.courseTitle}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {course.feedbackCount} reviews, latest {formatDate(course.latestFeedbackAt)}
                    </p>
                  </div>
                  <RatingDisplay value={course.averageRating} />
                </div>
              </article>
            ))}
          </div>
          {data.showComments && data.recentComments.length > 0 ? (
            <div className="space-y-2">
              {data.recentComments.slice(0, 3).map((comment) => (
                <blockquote className="rounded-[6px] border-l-4 border-[#5c9ee6] bg-slate-50 p-3 text-xs leading-5 text-slate-600" key={`${comment.courseTitle}-${comment.createdAt}`}>
                  {comment.comment}
                </blockquote>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </Panel>
  );
}

function FilteredEmptyState() {
  return (
    <div className="rounded-[8px] bg-white p-4 text-slate-900">
      <EmptyState
        action={
          <ActionButton href="/admin/monitoring" variant="secondary">
            Clear filters
          </ActionButton>
        }
        description="Adjust filters to review learning activity for another cohort, course, organization, or period."
        title="No monitoring data matches the selected filters"
      />
    </div>
  );
}

export function AdminMonitoring({
  feedbackSummary = emptyFeedbackSummary,
  monitoringData,
  showAdminActions = true,
}: {
  feedbackSummary?: FeedbackSummaryData;
  monitoringData: MonitoringData;
  showAdminActions?: boolean;
}) {
  const hasNoData =
    monitoringData.coursePerformance.length === 0 &&
    monitoringData.cohortProgress.length === 0 &&
    monitoringData.organizationProgress.length === 0 &&
    monitoringData.testSummary.totalAttempts === 0 &&
    feedbackSummary.totalFeedback === 0;

  const showFilteredEmpty = monitoringData.hasActiveFilters && hasNoData;

  return (
    <DashboardShell>
      <DashboardHeader showAdminActions={showAdminActions} />
      <MonitoringFilterCard data={monitoringData} />
      <MonitoringKpiGrid data={monitoringData} />

      {showFilteredEmpty ? (
        <FilteredEmptyState />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <AttentionSignalsSection signals={monitoringData.attentionSignals} />
          <CourseProgressSection courses={monitoringData.coursePerformance} />
          <CohortProgressSection cohorts={monitoringData.cohortProgress} />
          <OrganizationParticipationSection organizations={monitoringData.organizationProgress} />
          <TestSummaryPanel summary={monitoringData.testSummary} />
          <FeedbackSummaryPanel data={feedbackSummary} />
        </div>
      )}
    </DashboardShell>
  );
}
