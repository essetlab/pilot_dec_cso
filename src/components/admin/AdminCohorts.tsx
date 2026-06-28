import { ActionButton, AlertMessage, EmptyState, MetricCard, StatusBadge } from "@/components/ui";
import {
  createAdminCohortAction,
  linkAdminCohortOrganizationAction,
  unlinkAdminCohortOrganizationAction,
  updateAdminCohortAction,
} from "@/lib/admin-people-actions";
import type {
  AdminCohortDetailData,
  AdminCohortOperationOptions,
  AdminCohortsData,
} from "@/lib/admin-people-workflow";
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

function CohortsHeader() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Learning groups" tone="blue" />
            <StatusBadge label="Live records" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Cohorts
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review learning groups, linked CSOs, participants, assigned course
            access, and completion signals.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/cohorts/new" size="lg">
              Create Cohort
            </ActionButton>
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href="/admin/organizations"
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">View Organizations</span>
            </ActionButton>
            <ActionButton
              className="text-white hover:bg-white/10 hover:text-white"
              href="/admin"
              size="lg"
              variant="ghost"
            >
              Back to Dashboard
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Cohort context</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Groups now resolve from live cohort records.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Detail pages show assigned organizations, participants, courses,
            progress, and issued certificate counts.
          </p>
        </article>
      </div>
    </section>
  );
}

function MetricGrid({ data }: { data: AdminCohortsData }) {
  return (
    <section aria-labelledby="cohort-summary-heading" className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="cohort-summary-heading">
          Cohort summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Live learning group counts, CSO links, and participant coverage.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <MetricCard
            helperText={metric.helperText}
            icon={<span className="text-sm font-bold">{String(index + 1).padStart(2, "0")}</span>}
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

function CohortTable({ data }: { data: AdminCohortsData }) {
  if (data.cohorts.length === 0) {
    return (
      <Panel title="Cohort list">
        <EmptyState
          description="Create or seed cohorts before reviewing learning group operations."
          title="No cohorts found"
        />
      </Panel>
    );
  }

  return (
    <Panel
      description="Review cohorts by programme, region focus, date range, linked organizations, participants, course access, and status."
      title="Cohort list"
    >
      <div className="hidden overflow-x-auto rounded-[20px] border border-design-border lg:block">
        <table className="w-full min-w-[1080px] border-collapse bg-white text-left text-sm">
          <thead className="bg-soft-bg text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
            <tr>
              <th className="px-4 py-4">Cohort</th>
              <th className="px-4 py-4">Programme</th>
              <th className="px-4 py-4">Region focus</th>
              <th className="px-4 py-4">Dates</th>
              <th className="px-4 py-4">Organizations</th>
              <th className="px-4 py-4">Participants</th>
              <th className="px-4 py-4">Courses</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-design-border">
            {data.cohorts.map((cohort) => (
              <tr className="align-top" key={cohort.id}>
                <td className="px-4 py-4">
                  <p className="font-semibold leading-6 text-dark-ink">{cohort.name}</p>
                </td>
                <td className="px-4 py-4 text-muted-text">{cohort.program}</td>
                <td className="px-4 py-4 text-muted-text">{cohort.regionFocus}</td>
                <td className="px-4 py-4 text-muted-text">{cohort.dateRange}</td>
                <td className="px-4 py-4 font-semibold text-dark-ink">{cohort.organizations}</td>
                <td className="px-4 py-4 font-semibold text-dark-ink">{cohort.participants}</td>
                <td className="px-4 py-4 font-semibold text-dark-ink">{cohort.assignedCourses}</td>
                <td className="px-4 py-4">
                  <StatusBadge label={cohort.status} tone={cohort.statusTone} />
                </td>
                <td className="px-4 py-4">
                  <ActionButton href={cohort.href} size="sm" variant="secondary">
                    View
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {data.cohorts.map((cohort) => (
          <article className="rounded-[20px] border border-design-border bg-soft-bg p-4" key={cohort.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold leading-6 text-dark-ink">
                  {cohort.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-text">{cohort.program}</p>
              </div>
              <StatusBadge label={cohort.status} tone={cohort.statusTone} />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Region focus", cohort.regionFocus],
                ["Dates", cohort.dateRange],
                ["Organizations", cohort.organizations],
                ["Participants", cohort.participants],
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
            <ActionButton className="mt-4 w-full" href={cohort.href} variant="secondary">
              View
            </ActionButton>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function SelectedCohortCard({ data }: { data: AdminCohortsData }) {
  if (!data.selectedCohort) {
    return null;
  }

  return (
    <aside className="rounded-[24px] border border-dec-blue/25 bg-dec-blue/10 p-6 shadow-soft">
      <StatusBadge label="First cohort" tone="blue" />
      <h2 className="mt-4 text-xl font-semibold leading-tight text-deep-navy">
        {data.selectedCohort.name}
      </h2>
      <dl className="mt-5 grid gap-3">
        {[
          ["Programme", data.selectedCohort.program],
          ["Region", data.selectedCohort.regionFocus],
          ["Organizations", data.selectedCohort.organizations],
          ["Participants", data.selectedCohort.participants],
        ].map(([label, value]) => (
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
      <ActionButton className="mt-5 w-full" href={data.selectedCohort.href} variant="secondary">
        View Cohort
      </ActionButton>
    </aside>
  );
}

export function AdminCohorts({ data }: { data: AdminCohortsData }) {
  return (
    <div className="space-y-6">
      <CohortsHeader />
      <MetricGrid data={data} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <CohortTable data={data} />
        <SelectedCohortCard data={data} />
      </section>
    </div>
  );
}

const cohortNoticeMessages: Record<string, { message: string; tone: "error" | "info" | "success" | "warning" }> = {
  "cohort-created": {
    message: "Cohort created and audit log updated.",
    tone: "success",
  },
  "cohort-name-exists": {
    message: "A cohort with that name already exists.",
    tone: "warning",
  },
  "cohort-name-required": {
    message: "Cohort name is required.",
    tone: "warning",
  },
  "cohort-organization-already-linked": {
    message: "That organization is already linked to this cohort.",
    tone: "info",
  },
  "cohort-organization-linked": {
    message: "Organization linked to cohort and audit log updated.",
    tone: "success",
  },
  "cohort-organization-not-linked": {
    message: "That organization was not linked to this cohort.",
    tone: "info",
  },
  "cohort-organization-unlinked": {
    message: "Organization unlinked from cohort and audit log updated.",
    tone: "success",
  },
  "cohort-updated": {
    message: "Cohort updated and audit log recorded.",
    tone: "success",
  },
  "invalid-cohort-dates": {
    message: "Use valid start and end dates.",
    tone: "error",
  },
  "invalid-cohort-status": {
    message: "Choose a valid cohort status.",
    tone: "error",
  },
  unauthorized: {
    message: "You are not allowed to perform that admin operation.",
    tone: "error",
  },
};

function Notice({ code }: { code?: string }) {
  if (!code) {
    return null;
  }

  const notice = cohortNoticeMessages[code] ?? {
    message: "The cohort operation could not be completed.",
    tone: "error" as const,
  };

  return (
    <AlertMessage title="Cohort operation" tone={notice.tone}>
      {notice.message}
    </AlertMessage>
  );
}

function TextField({
  defaultValue,
  label,
  name,
  required = false,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink">
      {label}
      <input
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function SelectField({
  children,
  defaultValue,
  label,
  name,
}: {
  children: ReactNode;
  defaultValue?: string;
  label: string;
  name: string;
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink">
      {label}
      <select
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        name={name}
      >
        {children}
      </select>
    </label>
  );
}

function CohortForm({
  detail,
  options,
}: {
  detail: AdminCohortDetailData | null;
  options: AdminCohortOperationOptions;
}) {
  return (
    <Panel
      description="Create or update a learning cohort. Changes are audited."
      title={detail ? "Edit cohort" : "Create cohort"}
    >
      <form action={detail ? updateAdminCohortAction : createAdminCohortAction} className="space-y-5">
        {detail ? <input name="cohortId" type="hidden" value={detail.id} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField defaultValue={detail?.name} label="Cohort name" name="name" required />
          <TextField defaultValue={detail?.program === "No programme" ? "" : detail?.program} label="Programme" name="programmeName" />
          <TextField defaultValue={detail?.regionFocus === "No region focus" ? "" : detail?.regionFocus} label="Region focus" name="region" />
          <SelectField defaultValue={detail?.statusValue ?? "ACTIVE"} label="Status" name="status">
            {options.statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </SelectField>
          <TextField defaultValue={detail?.startDateInput} label="Start date" name="startDate" type="date" />
          <TextField defaultValue={detail?.endDateInput} label="End date" name="endDate" type="date" />
        </div>
        <label className="block text-sm font-semibold text-dark-ink">
          Description
          <textarea
            className="mt-2 min-h-28 w-full rounded-control border border-design-border bg-white px-4 py-3 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            defaultValue={detail?.description === "No cohort description recorded." ? "" : detail?.description}
            name="description"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ActionButton type="submit">
            {detail ? "Save Cohort" : "Create Cohort"}
          </ActionButton>
          <ActionButton href="/admin/cohorts" variant="secondary">
            Back to Cohorts
          </ActionButton>
        </div>
      </form>
    </Panel>
  );
}

function CohortOrganizationOperations({
  detail,
  options,
}: {
  detail: AdminCohortDetailData;
  options: AdminCohortOperationOptions;
}) {
  return (
    <Panel
      description="Link or unlink CSO organizations for this cohort. User primary cohort links are managed from user detail."
      title="Organization links"
    >
      <form action={linkAdminCohortOrganizationAction} className="grid gap-4 rounded-[18px] border border-design-border bg-soft-bg p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <input name="cohortId" type="hidden" value={detail.id} />
        <SelectField label="Organization" name="organizationId">
          {options.organizations.map((organization) => (
            <option key={organization.id} value={organization.id}>
              {organization.label}
            </option>
          ))}
        </SelectField>
        <ActionButton type="submit" variant="secondary">
          Link Organization
        </ActionButton>
      </form>
    </Panel>
  );
}

export function AdminCohortDetail({
  adminNotice,
  detail,
  operationOptions,
}: {
  adminNotice?: string;
  detail: AdminCohortDetailData | null;
  operationOptions: AdminCohortOperationOptions;
}) {
  if (!detail) {
    return (
      <div className="space-y-6">
        <Notice code={adminNotice} />
        <section className="rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
          <StatusBadge label="New cohort" tone="blue" />
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Create Cohort
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Create a learning group that can hold organizations, participants,
            and assigned courses.
          </p>
        </section>
        <CohortForm detail={null} options={operationOptions} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Notice code={adminNotice} />
      <section className="rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <StatusBadge label={detail.status} tone={detail.statusTone} />
        <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
          {detail.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
          {detail.program} · {detail.regionFocus} · {detail.dateRange}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ActionButton href="/admin/cohorts" size="lg" variant="secondary">
            Back to Cohorts
          </ActionButton>
          <ActionButton href="/admin/organizations" size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            Organizations
          </ActionButton>
        </div>
      </section>

      <CohortForm detail={detail} options={operationOptions} />
      <CohortOrganizationOperations detail={detail} options={operationOptions} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Profile">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["Description", detail.description],
              ["Progress", detail.progressSummary],
              ["Certificates", String(detail.certificateCount)],
              ["Assigned courses", String(detail.assignedCourses.length)],
            ].map(([label, value]) => (
              <div className="rounded-[16px] bg-soft-bg p-4" key={label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                  {label}
                </dt>
                <dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Assigned courses">
          {detail.assignedCourses.length === 0 ? (
            <EmptyState description="No direct course assignments are linked to this cohort." title="No courses" />
          ) : (
            <ul className="space-y-3">
              {detail.assignedCourses.map((course) => (
                <li className="rounded-[16px] bg-soft-bg p-4 text-sm font-semibold leading-6 text-dark-ink" key={course}>
                  {course}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel title="Linked organizations">
          {detail.organizations.length === 0 ? (
            <EmptyState description="No organizations are linked to this cohort." title="No organizations" />
          ) : (
            <div className="grid gap-3">
              {detail.organizations.map((organization) => (
                <article className="rounded-[16px] border border-design-border bg-soft-bg p-4" key={organization.href}>
                  <h2 className="text-base font-semibold leading-6 text-dark-ink">
                    {organization.name}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-text">
                    {organization.region} · {organization.status}
                  </p>
                  <ActionButton className="mt-3" href={organization.href} size="sm" variant="secondary">
                    View
                  </ActionButton>
                  <form action={unlinkAdminCohortOrganizationAction} className="mt-3">
                    <input name="cohortId" type="hidden" value={detail.id} />
                    <input name="organizationId" type="hidden" value={organization.id} />
                    <ActionButton type="submit" size="sm" variant="ghost">
                      Unlink
                    </ActionButton>
                  </form>
                </article>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Linked participants">
          {detail.participants.length === 0 ? (
            <EmptyState description="No participants are linked to this cohort." title="No participants" />
          ) : (
            <div className="grid gap-3">
              {detail.participants.map((participant) => (
                <article className="rounded-[16px] border border-design-border bg-soft-bg p-4" key={participant.href}>
                  <h2 className="text-base font-semibold leading-6 text-dark-ink">
                    {participant.name}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-text">
                    {participant.organization} · {participant.status}
                  </p>
                  <ActionButton className="mt-3" href={participant.href} size="sm" variant="secondary">
                    View
                  </ActionButton>
                </article>
              ))}
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}
