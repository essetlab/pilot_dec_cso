import { ActionButton, EmptyState, FilterBar, MetricCard, StatusBadge } from "@/components/ui";
import type { AuditEntrySummary, AuditLogData } from "@/lib/review-workflow";
import type { ReactNode } from "react";

function Panel({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function MetricIcon({
  children,
  tone,
}: {
  children: string;
  tone: "blue" | "green" | "orange" | "gray";
}) {
  if (tone === "green") {
    return <span className="text-sm font-bold text-[#426f1c]">{children}</span>;
  }

  if (tone === "orange") {
    return <span className="text-sm font-bold text-orange-700">{children}</span>;
  }

  if (tone === "gray") {
    return <span className="text-sm font-bold text-muted-text">{children}</span>;
  }

  return <span className="text-sm font-bold text-[#216f9d]">{children}</span>;
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
  const id = `admin-audit-log-${name}`;

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

function AuditHeader({ visibleCount }: { visibleCount: number }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Platform activity" tone="blue" />
            <StatusBadge label="Admin workspace" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Audit Log
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review recent platform events, admin actions, course activity, and
            access checks in one operational view.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/review" size="lg">
              Review Courses
            </ActionButton>
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href="/admin"
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">Back to Dashboard</span>
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Activity context</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep important platform events easy to review.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Scan event type, actor, related record, and status before opening
            connected admin areas.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Visible events</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{visibleCount}</dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Status</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">Recorded</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function AuditMetricGrid({ metrics }: { metrics: AuditLogData["metrics"] }) {
  const auditMetrics = [
    {
      helperText: "Total platform activity entries",
      label: "Recent events",
      tone: "blue",
      value: metrics.recentEvents,
    },
    {
      helperText: "Administrative and workflow actions",
      label: "Admin actions",
      tone: "green",
      value: metrics.adminActions,
    },
    {
      helperText: "Course readiness and publishing activity",
      label: "Course events",
      tone: "orange",
      value: metrics.courseEvents,
    },
    {
      helperText: "Sign-in and protected route activity",
      label: "Access events",
      tone: "gray",
      value: metrics.accessEvents,
    },
  ] as const;

  return (
    <section aria-labelledby="audit-summary-heading" className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="audit-summary-heading">
          Audit summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          A concise view of recent events across access, course, certificate,
          and organization activity.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {auditMetrics.map((metric, index) => (
          <MetricCard
            helperText={metric.helperText}
            icon={
              <MetricIcon tone={metric.tone}>
                {String(index + 1).padStart(2, "0")}
              </MetricIcon>
            }
            key={metric.label}
            label={metric.label}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </div>
    </section>
  );
}

function AuditFilterCard({ data }: { data: AuditLogData }) {
  return (
    <form action="/admin/audit-log">
      <FilterBar
        actions={
          <>
            <ActionButton href="/admin/audit-log" variant="secondary">
              Reset
            </ActionButton>
            <ActionButton type="submit">Apply Filters</ActionButton>
          </>
        }
        filters={
          <>
            <SelectControl
              label="Area"
              name="area"
              options={[{ id: "", label: "All areas" }, ...data.filterOptions.areas]}
              value={data.filters.area}
            />
            <SelectControl
              label="Actor"
              name="actor"
              options={[{ id: "", label: "All actors" }, ...data.filterOptions.actors]}
              value={data.filters.actor}
            />
            <SelectControl
              label="Date range"
              name="auditDateRange"
              options={data.filterOptions.dateRanges}
              value={data.filters.dateRange}
            />
          </>
        }
        search={
          <label className="block text-sm font-semibold text-dark-ink" htmlFor="admin-audit-log-search">
            Search audit log
            <input
              aria-label="Search audit log"
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              defaultValue={data.filters.query}
              id="admin-audit-log-search"
              name="query"
              placeholder="Event, actor, area, reference..."
              type="search"
            />
          </label>
        }
      />
    </form>
  );
}

function AuditEventTable({ entries }: { entries: AuditEntrySummary[] }) {
  if (entries.length === 0) {
    return (
      <Panel title="Audit events">
        <EmptyState
          action={<ActionButton href="/admin/audit-log" variant="secondary">Reset filters</ActionButton>}
          description="Try a broader search or clear the selected filters to review recent platform activity."
          title="No audit events match the selected filters"
        />
      </Panel>
    );
  }

  return (
    <Panel
      description="Review event type, actor, related record, time, and status."
      title="Audit events"
    >
      <div className="hidden overflow-x-auto rounded-[20px] border border-design-border lg:block">
        <table className="w-full min-w-[1040px] border-collapse bg-white text-left text-sm">
          <thead className="bg-soft-bg text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
            <tr>
              <th className="px-4 py-4">Event</th>
              <th className="px-4 py-4">Area</th>
              <th className="px-4 py-4">Actor</th>
              <th className="px-4 py-4">Reference</th>
              <th className="px-4 py-4">Time</th>
              <th className="px-4 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-design-border">
            {entries.map((event) => (
              <tr className="align-top" key={event.id}>
                <td className="px-4 py-4">
                  <p className="font-semibold text-dark-ink">{event.actionLabel}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-text">{event.description}</p>
                </td>
                <td className="px-4 py-4 text-muted-text">{event.area}</td>
                <td className="px-4 py-4 text-muted-text">{event.actorName}</td>
                <td className="px-4 py-4 text-muted-text">{event.reference}</td>
                <td className="px-4 py-4 text-muted-text">{event.createdAtLabel}</td>
                <td className="px-4 py-4">
                  <StatusBadge label={event.statusLabel} tone={event.statusTone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 lg:hidden">
        {entries.map((event) => (
          <article className="rounded-[20px] border border-design-border bg-soft-bg p-4" key={event.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold leading-6 text-dark-ink">
                  {event.actionLabel}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-text">{event.description}</p>
              </div>
              <StatusBadge label={event.statusLabel} tone={event.statusTone} />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Area", event.area],
                ["Actor", event.actorName],
                ["Reference", event.reference],
                ["Time", event.createdAtLabel],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold leading-6 text-dark-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function SelectedEventCard({ entry }: { entry: AuditEntrySummary | null }) {
  if (!entry) {
    return (
      <EmptyState
        description="Recorded events will appear here after platform activity starts."
        title="No selected event"
      />
    );
  }

  const selectedEventDetails = [
    ["Selected event", entry.actionLabel],
    ["Actor", entry.actorName],
    ["Area", entry.area],
    ["Reference", entry.reference],
    ["Time", entry.createdAtLabel],
    ["Status", entry.statusLabel],
  ];

  return (
    <Panel
      description="Selected event summary for quick operational review."
      title="Selected event preview"
    >
      <article className="rounded-[22px] border border-dec-blue/25 bg-dec-blue/10 p-5">
        <StatusBadge label="Selected" tone="blue" />
        <h3 className="mt-4 text-xl font-semibold leading-tight text-deep-navy">
          {entry.actionLabel}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#26536c]">
          {entry.description}
        </p>
        <dl className="mt-5 grid gap-3">
          {selectedEventDetails.map(([label, value]) => (
            <div className="rounded-[16px] bg-white/85 p-4" key={label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                {label}
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </Panel>
  );
}

function AuditGuidanceNote() {
  return (
    <aside className="rounded-[24px] border border-dec-green/30 bg-dec-green/15 p-6 shadow-soft">
      <StatusBadge label="Audit guidance" tone="green" />
      <p className="mt-4 text-sm leading-7 text-[#426f1c]">
        Audit records are append-only in ordinary admin use. They should not
        include passwords, tokens, or private file content.
      </p>
    </aside>
  );
}

export function AdminAuditLog({ data }: { data: AuditLogData }) {
  return (
    <div className="space-y-6">
      <AuditHeader visibleCount={data.entries.length} />
      <AuditMetricGrid metrics={data.metrics} />
      <AuditFilterCard data={data} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <AuditEventTable entries={data.entries} />
        </div>

        <aside className="space-y-6">
          <SelectedEventCard entry={data.selectedEntry} />
          <AuditGuidanceNote />
        </aside>
      </section>
    </div>
  );
}
