import { ActionButton, AlertMessage, EmptyState, MetricCard, StatusBadge } from "@/components/ui";
import {
  createAdminOrganizationAction,
  updateAdminOrganizationAction,
} from "@/lib/admin-people-actions";
import type {
  AdminOrganizationDetailData,
  AdminOrganizationOperationOptions,
  AdminOrganizationsData,
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

function OrganizationsHeader() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="CSO directory" tone="blue" />
            <StatusBadge label="Live records" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Organizations
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review CSO profiles, focal contacts, linked participants, cohorts,
            course assignments, and completion signals.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/organizations/new" size="lg">
              Add Organization
            </ActionButton>
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href="/admin/users"
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">View Users</span>
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
          <p className="text-sm font-semibold text-dec-green">Organization context</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            CSO records now reflect linked platform data.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Detail pages surface participants, cohorts, courses, progress, and
            certificate counts.
          </p>
        </article>
      </div>
    </section>
  );
}

function MetricGrid({ data }: { data: AdminOrganizationsData }) {
  return (
    <section aria-labelledby="organization-summary-heading" className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="organization-summary-heading">
          Organization summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Live CSO counts and linked learning coverage.
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

function OrganizationTable({ data }: { data: AdminOrganizationsData }) {
  if (data.organizations.length === 0) {
    return (
      <Panel title="Organization list">
        <EmptyState
          description="Create or seed organizations before reviewing CSO operations."
          title="No organizations found"
        />
      </Panel>
    );
  }

  return (
    <Panel
      description="Review organizations by region, type, formality, focal person, participants, cohorts, and status."
      title="Organization list"
    >
      <div className="hidden overflow-x-auto rounded-[20px] border border-design-border lg:block">
        <table className="w-full min-w-[1080px] border-collapse bg-white text-left text-sm">
          <thead className="bg-soft-bg text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
            <tr>
              <th className="px-4 py-4">Organization</th>
              <th className="px-4 py-4">Region</th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Formality</th>
              <th className="px-4 py-4">Focal person</th>
              <th className="px-4 py-4">Participants</th>
              <th className="px-4 py-4">Cohorts</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-design-border">
            {data.organizations.map((organization) => (
              <tr className="align-top" key={organization.id}>
                <td className="px-4 py-4">
                  <p className="font-semibold leading-6 text-dark-ink">{organization.name}</p>
                </td>
                <td className="px-4 py-4 text-muted-text">{organization.region}</td>
                <td className="px-4 py-4 text-muted-text">{organization.type}</td>
                <td className="px-4 py-4 text-muted-text">{organization.formality}</td>
                <td className="px-4 py-4 text-muted-text">{organization.focalPerson}</td>
                <td className="px-4 py-4 font-semibold text-dark-ink">{organization.participantCount}</td>
                <td className="px-4 py-4 font-semibold text-dark-ink">{organization.cohortCount}</td>
                <td className="px-4 py-4">
                  <StatusBadge label={organization.status} tone={organization.statusTone} />
                </td>
                <td className="px-4 py-4">
                  <ActionButton href={organization.href} size="sm" variant="secondary">
                    View
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {data.organizations.map((organization) => (
          <article className="rounded-[20px] border border-design-border bg-soft-bg p-4" key={organization.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold leading-6 text-dark-ink">
                  {organization.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-text">{organization.region}</p>
              </div>
              <StatusBadge label={organization.status} tone={organization.statusTone} />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Type", organization.type],
                ["Formality", organization.formality],
                ["Focal person", organization.focalPerson],
                ["Participants", organization.participantCount],
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
            <ActionButton className="mt-4 w-full" href={organization.href} variant="secondary">
              View
            </ActionButton>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function SelectedOrganizationCard({ data }: { data: AdminOrganizationsData }) {
  if (!data.selectedOrganization) {
    return null;
  }

  return (
    <aside className="rounded-[24px] border border-dec-green/30 bg-dec-green/15 p-6 shadow-soft">
      <StatusBadge label="First organization" tone="green" />
      <h2 className="mt-4 text-xl font-semibold leading-tight text-[#426f1c]">
        {data.selectedOrganization.name}
      </h2>
      <dl className="mt-5 grid gap-3">
        {[
          ["Region", data.selectedOrganization.region],
          ["Focal person", data.selectedOrganization.focalPerson],
          ["Participants", data.selectedOrganization.participantCount],
          ["Cohorts", data.selectedOrganization.cohortCount],
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
      <ActionButton className="mt-5 w-full" href={data.selectedOrganization.href} variant="secondary">
        View Organization
      </ActionButton>
    </aside>
  );
}

export function AdminOrganizations({ data }: { data: AdminOrganizationsData }) {
  return (
    <div className="space-y-6">
      <OrganizationsHeader />
      <MetricGrid data={data} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <OrganizationTable data={data} />
        <SelectedOrganizationCard data={data} />
      </section>
    </div>
  );
}

const organizationNoticeMessages: Record<string, { message: string; tone: "error" | "info" | "success" | "warning" }> = {
  "invalid-organization-status": {
    message: "Choose a valid organization status and formality value.",
    tone: "error",
  },
  "organization-created": {
    message: "Organization created and audit log updated.",
    tone: "success",
  },
  "organization-name-exists": {
    message: "An organization with that name already exists.",
    tone: "warning",
  },
  "organization-name-required": {
    message: "Organization name is required.",
    tone: "warning",
  },
  "organization-updated": {
    message: "Organization updated and audit log recorded.",
    tone: "success",
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

  const notice = organizationNoticeMessages[code] ?? {
    message: "The organization operation could not be completed.",
    tone: "error" as const,
  };

  return (
    <AlertMessage title="Organization operation" tone={notice.tone}>
      {notice.message}
    </AlertMessage>
  );
}

function TextField({
  defaultValue,
  label,
  name,
  required = false,
}: {
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink">
      {label}
      <input
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        name={name}
        required={required}
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

function OrganizationForm({
  detail,
  options,
}: {
  detail: AdminOrganizationDetailData | null;
  options: AdminOrganizationOperationOptions;
}) {
  return (
    <Panel
      description="Create or update a CSO organization profile. Changes are audited."
      title={detail ? "Edit organization" : "Create organization"}
    >
      <form action={detail ? updateAdminOrganizationAction : createAdminOrganizationAction} className="space-y-5">
        {detail ? <input name="organizationId" type="hidden" value={detail.id} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField defaultValue={detail?.name} label="Organization name" name="name" required />
          <TextField defaultValue={detail?.shortName} label="Short name" name="shortName" />
          <TextField defaultValue={detail?.region === "No region" ? "" : detail?.region} label="Region" name="region" />
          <TextField defaultValue={detail?.zone} label="Zone" name="zone" />
          <TextField defaultValue={detail?.woreda} label="Woreda" name="woreda" />
          <TextField defaultValue={detail?.organizationTypeId} label="Organization type" name="organizationTypeId" />
          <TextField defaultValue={detail?.registrationNumber} label="Registration number" name="registrationNumber" />
          <SelectField defaultValue={detail?.statusValue ?? "ACTIVE"} label="Status" name="status">
            {options.statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </SelectField>
          <SelectField defaultValue={detail?.formalityValue ?? "UNKNOWN"} label="Formality" name="formalityStatus">
            {options.formalities.map((formality) => (
              <option key={formality.value} value={formality.value}>
                {formality.label}
              </option>
            ))}
          </SelectField>
          <TextField defaultValue={detail?.focalPersonName} label="Focal person name" name="focalPersonName" />
          <TextField defaultValue={detail?.focalPersonEmail} label="Focal person email" name="focalPersonEmail" />
          <TextField defaultValue={detail?.focalPersonPhone} label="Focal person phone" name="focalPersonPhone" />
        </div>
        <label className="block text-sm font-semibold text-dark-ink">
          Notes
          <textarea
            className="mt-2 min-h-28 w-full rounded-control border border-design-border bg-white px-4 py-3 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            defaultValue={detail?.notes === "No notes recorded." ? "" : detail?.notes}
            name="notes"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ActionButton type="submit">
            {detail ? "Save Organization" : "Create Organization"}
          </ActionButton>
          <ActionButton href="/admin/organizations" variant="secondary">
            Back to Organizations
          </ActionButton>
        </div>
      </form>
    </Panel>
  );
}

export function AdminOrganizationDetail({
  adminNotice,
  detail,
  operationOptions,
}: {
  adminNotice?: string;
  detail: AdminOrganizationDetailData | null;
  operationOptions: AdminOrganizationOperationOptions;
}) {
  if (!detail) {
    return (
      <div className="space-y-6">
        <Notice code={adminNotice} />
        <section className="rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
          <StatusBadge label="New organization" tone="blue" />
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Add Organization
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Create a CSO profile that can be linked to cohorts and participants.
          </p>
        </section>
        <OrganizationForm detail={null} options={operationOptions} />
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
          {detail.region} · {detail.formality}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ActionButton href="/admin/organizations" size="lg" variant="secondary">
            Back to Organizations
          </ActionButton>
          <ActionButton href="/admin/cohorts" size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            Cohorts
          </ActionButton>
        </div>
      </section>

      <OrganizationForm detail={detail} options={operationOptions} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Profile">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["Type", detail.type],
              ["Focal person", detail.focalPerson],
              ["Progress", detail.progressSummary],
              ["Certificates", String(detail.certificateCount)],
              ["Notes", detail.notes],
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
            <EmptyState description="No direct course assignments are linked to this organization." title="No courses" />
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
        <Panel title="Linked participants">
          {detail.participants.length === 0 ? (
            <EmptyState description="No users are linked to this organization." title="No participants" />
          ) : (
            <div className="grid gap-3">
              {detail.participants.map((participant) => (
                <article className="rounded-[16px] border border-design-border bg-soft-bg p-4" key={participant.href}>
                  <h2 className="text-base font-semibold leading-6 text-dark-ink">
                    {participant.name}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-text">
                    {participant.roles} · {participant.status}
                  </p>
                  <ActionButton className="mt-3" href={participant.href} size="sm" variant="secondary">
                    View
                  </ActionButton>
                </article>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Linked cohorts">
          {detail.cohorts.length === 0 ? (
            <EmptyState description="No cohorts are linked to this organization." title="No cohorts" />
          ) : (
            <div className="grid gap-3">
              {detail.cohorts.map((cohort) => (
                <article className="rounded-[16px] border border-design-border bg-soft-bg p-4" key={cohort.href}>
                  <h2 className="text-base font-semibold leading-6 text-dark-ink">
                    {cohort.name}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-text">{cohort.status}</p>
                  <ActionButton className="mt-3" href={cohort.href} size="sm" variant="secondary">
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
