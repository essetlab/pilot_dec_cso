import type { ReactNode } from "react";
import { CourseInvitationStatus } from "@/generated/prisma/enums";
import {
  ActionButton,
  AlertMessage,
  EmptyState,
  StatusBadge,
} from "@/components/ui";
import type {
  getAdminCourseInvitationDetail,
  getAdminCourseInvitationList,
  getAdminCourseInvitationOptions,
} from "@/lib/admin-course-invitation-workflow";
import {
  CourseInvitationCancelForm,
  CourseInvitationCreateForm,
  CourseInvitationPrepareLinkForm,
} from "./CourseInvitationActions";

type ListData = Awaited<ReturnType<typeof getAdminCourseInvitationList>>;
type DetailData = NonNullable<
  Awaited<ReturnType<typeof getAdminCourseInvitationDetail>>
>;
type InvitationOptions = Awaited<
  ReturnType<typeof getAdminCourseInvitationOptions>
>;

const statusPresentation = {
  [CourseInvitationStatus.DRAFT]: { label: "Draft", tone: "gray" },
  [CourseInvitationStatus.PENDING]: { label: "Delivery pending", tone: "orange" },
  [CourseInvitationStatus.SENT]: { label: "Sent", tone: "blue" },
  [CourseInvitationStatus.ACTIVATED]: { label: "Activated", tone: "green" },
  [CourseInvitationStatus.EXPIRED]: { label: "Expired", tone: "gold" },
  [CourseInvitationStatus.CANCELLED]: { label: "Cancelled", tone: "red" },
  [CourseInvitationStatus.FAILED]: { label: "Delivery failed", tone: "red" },
} as const;

const notices: Record<string, { message: string; tone: "error" | "success" }> = {
  "invitation-cancelled": {
    message: "The invitation was cancelled. Its unused link can no longer activate.",
    tone: "success",
  },
  "manual-delivery-confirmed": {
    message: "Manual delivery was explicitly confirmed and the invitation is now marked sent.",
    tone: "success",
  },
  "invalid-expiry": {
    message: "The invitation expired before delivery could be confirmed.",
    tone: "error",
  },
  "invalid-transition": {
    message: "That action is no longer available for the invitation's current state.",
    tone: "error",
  },
  unauthorized: {
    message: "You are not authorized to manage course invitations.",
    tone: "error",
  },
  unavailable: {
    message: "The operation could not be completed safely. No delivery was recorded.",
    tone: "error",
  },
};

function InvitationStatusBadge({ status }: { status: CourseInvitationStatus }) {
  const presentation = statusPresentation[status];
  return <StatusBadge label={presentation.label} tone={presentation.tone} />;
}

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-[24px] border border-design-border bg-white p-5 shadow-soft sm:p-6">
      <h2 className="text-xl font-semibold text-deep-navy">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Header({
  actions,
  description,
  title,
}: {
  actions?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="Controlled pilot access" tone="blue" />
            <StatusBadge label="Authorized administrators only" tone="green" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-white/75 sm:text-base">{description}</p>
        </div>
        {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
      </div>
    </section>
  );
}

function Notice({ code }: { code?: string }) {
  const notice = code ? notices[code] : undefined;
  if (!notice) {
    return null;
  }
  return (
    <AlertMessage title={notice.tone === "success" ? "Invitation updated" : "Action unavailable"} tone={notice.tone}>
      {notice.message}
    </AlertMessage>
  );
}

function Filters({ data }: { data: ListData }) {
  const selectClass =
    "min-h-11 rounded-control border border-design-border bg-white px-3 text-sm text-dark-ink focus:border-dec-blue focus:outline-none focus:ring-4 focus:ring-dec-blue/20";
  return (
    <form action="/admin/course-invitations" className="grid gap-3 lg:grid-cols-6" method="get">
      <label className="lg:col-span-2">
        <span className="sr-only">Search learner email</span>
        <input
          className={selectClass + " w-full"}
          defaultValue={data.filters.query}
          name="query"
          placeholder="Search learner email"
          type="search"
        />
      </label>
      <label>
        <span className="sr-only">Invitation status</span>
        <select className={selectClass + " w-full"} defaultValue={data.filters.status ?? ""} name="status">
          <option value="">All statuses</option>
          {Object.values(CourseInvitationStatus).map((status) => (
            <option key={status} value={status}>{statusPresentation[status].label}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Organization</span>
        <select className={selectClass + " w-full"} defaultValue={data.filters.organizationId ?? ""} name="organizationId">
          <option value="">All organizations</option>
          {data.options.organizations.map((organization) => (
            <option key={organization.id} value={organization.id}>{organization.name}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Course</span>
        <select className={selectClass + " w-full"} defaultValue={data.filters.courseId ?? ""} name="courseId">
          <option value="">All courses</option>
          {data.options.courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Created date range</span>
        <select className={selectClass + " w-full"} defaultValue={data.filters.created ?? "all"} name="created">
          <option value="all">All dates</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </label>
      <div className="flex flex-col gap-3 sm:flex-row lg:col-span-6">
        <ActionButton type="submit">Apply filters</ActionButton>
        <ActionButton href="/admin/course-invitations" variant="secondary">Clear filters</ActionButton>
      </div>
    </form>
  );
}

function InvitationList({ data }: { data: ListData }) {
  if (data.records.length === 0) {
    return (
      <EmptyState
        action={<ActionButton href="/admin/course-invitations/new">Create invitation</ActionButton>}
        description="No controlled course invitations match the current filters."
        title="No invitations found"
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-[20px] border border-design-border xl:block">
        <table className="w-full min-w-[1180px] border-collapse bg-white text-left text-sm">
          <thead className="bg-soft-bg text-xs font-semibold uppercase tracking-[0.1em] text-muted-text">
            <tr>
              <th className="px-4 py-4">Learner</th><th className="px-4 py-4">Scope</th>
              <th className="px-4 py-4">Status</th><th className="px-4 py-4">Created</th>
              <th className="px-4 py-4">Expiry</th><th className="px-4 py-4">Sent</th>
              <th className="px-4 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-design-border">
            {data.records.map((record) => (
              <tr className="align-top" key={record.id}>
                <td className="px-4 py-4"><p className="font-semibold text-dark-ink">{record.email}</p><p className="mt-1 text-xs text-muted-text">{record.organization}</p></td>
                <td className="px-4 py-4"><p className="font-semibold text-dark-ink">{record.course}</p><p className="mt-1 text-xs text-muted-text">{record.version} · {record.cohort}</p></td>
                <td className="px-4 py-4"><InvitationStatusBadge status={record.status} /></td>
                <td className="px-4 py-4 text-muted-text">{record.createdAt}<p className="mt-1 text-xs">by {record.createdBy}</p></td>
                <td className="px-4 py-4 text-muted-text">{record.expiresAt}</td>
                <td className="px-4 py-4 text-muted-text">{record.sentAt}</td>
                <td className="px-4 py-4"><ActionButton href={record.href} size="sm" variant="secondary">View</ActionButton></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 xl:hidden">
        {data.records.map((record) => (
          <article className="rounded-[20px] border border-design-border bg-soft-bg p-4" key={record.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><h3 className="font-semibold text-dark-ink">{record.email}</h3><p className="mt-1 text-sm text-muted-text">{record.organization}</p></div>
              <InvitationStatusBadge status={record.status} />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[["Course", record.course], ["Version", record.version], ["Cohort", record.cohort], ["Expires", record.expiresAt]].map(([label, value]) => (
                <div key={label}><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-text">{label}</dt><dd className="mt-1 text-sm font-medium text-dark-ink">{value}</dd></div>
              ))}
            </dl>
            <ActionButton className="mt-4 w-full" href={record.href} variant="secondary">View invitation</ActionButton>
          </article>
        ))}
      </div>
    </>
  );
}

export function AdminCourseInvitationList({ data }: { data: ListData }) {
  return (
    <div className="space-y-6">
      <Header
        actions={<ActionButton href="/admin/course-invitations/new" size="lg">Create invitation</ActionButton>}
        description="Create, deliver, resend, cancel, and audit one learner invitation for one approved course version."
        title="Course invitations"
      />
      <Panel title="Find invitations"><Filters data={data} /></Panel>
      <Panel title={`${data.total} invitation${data.total === 1 ? "" : "s"}`}>
        {data.total > data.limit ? <p className="mb-4 text-sm text-muted-text">Showing the newest {data.limit} matching invitations.</p> : null}
        <InvitationList data={data} />
      </Panel>
    </div>
  );
}

export function AdminCourseInvitationCreate({ options }: { options: InvitationOptions }) {
  return (
    <div className="space-y-6">
      <Header
        actions={<ActionButton href="/admin/course-invitations" size="lg" variant="secondary">Back to invitations</ActionButton>}
        description="Validate the learner and exact approved pilot scope before preparing a one-time manual-delivery link."
        title="Create course invitation"
      />
      <Panel title="Invitation scope"><CourseInvitationCreateForm options={options} /></Panel>
    </div>
  );
}

export function AdminCourseInvitationDetail({
  adminNotice,
  detail,
}: {
  adminNotice?: string;
  detail: DetailData;
}) {
  const fields = [
    ["Learner", `${detail.invitedName} (${detail.email})`],
    ["Organization", detail.organization], ["Course", detail.course],
    ["Approved version", detail.version], ["Cohort", detail.cohort],
    ["Created", detail.createdAt], ["Expires", detail.expiresAt],
    ["Last sent", detail.sentAt], ["Activated", detail.activatedAt],
  ];
  return (
    <div className="space-y-6">
      <Header
        actions={<><ActionButton href="/admin/course-invitations" size="lg" variant="secondary">Back to invitations</ActionButton>{detail.canCancel ? <CourseInvitationCancelForm invitationId={detail.id} /> : null}</>}
        description="Review the validated invitation scope, delivery state, lifecycle history, and safe actions."
        title="Invitation details"
      />
      <Notice code={adminNotice} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="space-y-6">
          <Panel title="Invitation scope">
            <div className="mb-5"><InvitationStatusBadge status={detail.status} /></div>
            <dl className="grid gap-4 sm:grid-cols-2">
              {fields.map(([label, value]) => <div key={label} className="rounded-[16px] border border-design-border bg-soft-bg p-4"><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-text">{label}</dt><dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">{value}</dd></div>)}
            </dl>
          </Panel>
          <Panel title="Lifecycle history">
            <ol className="space-y-4">
              {detail.history.map((entry, index) => <li className="border-l-2 border-dec-blue/30 pl-4" key={`${entry.action}-${entry.createdAt}-${index}`}><p className="font-semibold text-dark-ink">{entry.description}</p><p className="mt-1 text-sm text-muted-text">{entry.createdAt} · {entry.actor}</p></li>)}
            </ol>
          </Panel>
        </div>
        <aside className="space-y-6">
          <Panel title="Delivery and actions">
            <p className="text-sm leading-6 text-muted-text">Manual delivery is the approved staging mode. Raw links are never stored and cannot be recovered.</p>
            {detail.canPrepareLink ? <div className="mt-5"><CourseInvitationPrepareLinkForm invitationId={detail.id} /></div> : <p className="mt-4 rounded-[16px] border border-design-border bg-soft-bg p-4 text-sm text-muted-text">No link preparation action is available for this lifecycle state.</p>}
          </Panel>
          <Panel title="Activation result">
            {detail.activatedUser ? <p className="text-sm leading-6 text-muted-text">Activated by <span className="font-semibold text-dark-ink">{detail.activatedUser}</span>. One individual course assignment is linked to this invitation.</p> : <p className="text-sm leading-6 text-muted-text">No course assignment has been created by this invitation yet.</p>}
          </Panel>
        </aside>
      </div>
    </div>
  );
}
