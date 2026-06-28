import { EmptyState, MetricCard, StatusBadge } from "@/components/ui";
import { CERTIFICATE_PASS_THRESHOLD_LABEL } from "@/lib/demo-data";
import type { ReactNode } from "react";

const settingsMetrics = [
  {
    helperText: "Platform name and support identity",
    label: "Platform settings",
    tone: "blue",
    value: "Ready",
  },
  {
    helperText: "Default final test threshold",
    label: "Certificate rule",
    tone: "green",
    value: CERTIFICATE_PASS_THRESHOLD_LABEL,
  },
  {
    helperText: "Participant and cohort access context",
    label: "Learner access",
    tone: "blue",
    value: "Active",
  },
  {
    helperText: "Course quality review context",
    label: "Review settings",
    tone: "orange",
    value: "Set",
  },
] as const;

const settingsGroups = [
  {
    description: "Platform name, programme identity, and public support context.",
    items: [
      ["Platform name", "CSO Learning Hub"],
      ["Programme context", "DEC / WHH CSF+ learning platform"],
      ["Default language", "English"],
      ["Support label", "Programme support team"],
    ],
    status: "Ready",
    statusTone: "green",
    title: "Platform identity",
  },
  {
    description: "How participants reach assigned courses and learning areas.",
    items: [
      ["Access model", "Role-based learning access"],
      ["Course visibility", "Public and assigned course access"],
      ["Cohort access", "Cohort-linked participants"],
      ["Learner area", "Dashboard and assigned courses"],
    ],
    status: "Active",
    statusTone: "blue",
    title: "Learner access",
  },
  {
    description: "Course quality review and publishing preparation context.",
    items: [
      ["Review queue", "Ready for review courses"],
      ["Reviewer role", "Course Reviewer"],
      ["Publishing role", "Platform Admin and Super Admin"],
      ["Creator feedback", "Returned courses show review guidance"],
    ],
    status: "Aligned",
    statusTone: "purple",
    title: "Review and publish settings",
  },
  {
    description: "Certificate eligibility and final test rule context.",
    items: [
      ["Certificate eligibility", "Completion and final test required"],
      ["Final test threshold", CERTIFICATE_PASS_THRESHOLD_LABEL],
      ["Certificate records", "Visible in admin certificates"],
      ["Participant access", "Available after completion"],
    ],
    status: `${CERTIFICATE_PASS_THRESHOLD_LABEL} threshold`,
    statusTone: "green",
    title: "Certificate settings",
  },
  {
    description: "Support and notification context for the platform team.",
    items: [
      ["Support owner", "Programme support team"],
      ["Review updates", "Shown in creator feedback areas"],
      ["Learner support", "Guidance through assigned cohorts"],
      ["Operations contact", "Platform administration team"],
    ],
    status: "Ready",
    statusTone: "gold",
    title: "Notification/support settings",
  },
] as const;

function MetricIcon({
  children,
  tone,
}: {
  children: string;
  tone: "blue" | "green" | "orange";
}) {
  if (tone === "green") {
    return <span className="text-sm font-bold text-[#426f1c]">{children}</span>;
  }

  if (tone === "orange") {
    return <span className="text-sm font-bold text-orange-700">{children}</span>;
  }

  return <span className="text-sm font-bold text-[#216f9d]">{children}</span>;
}

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

function SettingsHeader() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Platform configuration" tone="blue" />
            <StatusBadge label="Admin workspace" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Settings
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review core platform, learner access, review, certificate, and
            support settings for the CSO Learning Hub.
          </p>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Settings context</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep platform rules visible and stable.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Scan the current operating settings for identity, access, review,
            certificates, and support without changing platform behavior.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Groups</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">5</dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Threshold</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {CERTIFICATE_PASS_THRESHOLD_LABEL}
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function SettingsMetricGrid() {
  return (
    <section aria-labelledby="settings-summary-heading" className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="settings-summary-heading">
          Settings summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          A concise view of key platform settings and certificate rules.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {settingsMetrics.map((metric, index) => (
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

function SettingsGroups() {
  return (
    <Panel
      description="Review grouped settings used by the platform experience."
      title="Settings groups"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {settingsGroups.map((group) => (
          <article className="rounded-[20px] border border-design-border bg-soft-bg p-5" key={group.title}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold leading-6 text-dark-ink">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-text">
                  {group.description}
                </p>
              </div>
              <StatusBadge label={group.status} tone={group.statusTone} />
            </div>
            <dl className="mt-5 grid gap-3">
              {group.items.map(([label, value]) => (
                <div className="rounded-[16px] bg-white p-4" key={label}>
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
        ))}
      </div>
    </Panel>
  );
}

function SettingsGuidanceNote() {
  return (
    <aside className="rounded-[24px] border border-dec-green/30 bg-dec-green/15 p-6 shadow-soft">
      <StatusBadge label="Settings guidance" tone="green" />
      <p className="mt-4 text-sm leading-7 text-[#426f1c]">
        Use this page to review current platform settings before coordinating
        changes through the appropriate operational process.
      </p>
    </aside>
  );
}

function UnchangedSettingsNote() {
  return (
    <EmptyState
      description="The current settings view is unchanged. Review each group to confirm platform identity, learner access, review, certificate, and support context."
      title="No settings need attention"
    />
  );
}

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <SettingsHeader />
      <SettingsMetricGrid />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <SettingsGroups />
        </div>

        <aside className="space-y-6">
          <SettingsGuidanceNote />
          <UnchangedSettingsNote />
        </aside>
      </section>
    </div>
  );
}
