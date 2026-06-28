import { ActionButton, AlertMessage, EmptyState, FilterBar, MetricCard, StatusBadge } from "@/components/ui";
import {
  assignAdminUserRoleAction,
  cancelStaffInvitationAction,
  createAdminUserAction,
  linkAdminUserContextAction,
  removeAdminUserRoleAction,
  resendStaffInvitationAction,
  updateAdminUserStatusAction,
  inviteStaffMemberAction,
} from "@/lib/admin-people-actions";
import type {
  AdminUserDetailData,
  AdminUserOperationOptions,
  AdminUsersData,
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

function MetricIcon({ children }: { children: string }) {
  return <span className="text-sm font-bold">{children}</span>;
}

function UsersHeader() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="User administration" tone="blue" />
            <StatusBadge label="Account operations" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Users
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review platform accounts, roles, organization links, cohort access,
            and learning activity.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/users/new" size="lg">
              Add User
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
          <p className="text-sm font-semibold text-dec-green">Account readiness</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep user access clear and current.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Add users, manage roles, and connect participants to the right
            organization and cohort context.
          </p>
        </article>
      </div>
    </section>
  );
}

function UserMetricGrid({ data }: { data: AdminUsersData }) {
  return (
    <section aria-labelledby="user-summary-heading" className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="user-summary-heading">
          User summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Live account counts, participant coverage, and invitation status.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <MetricCard
            helperText={metric.helperText}
            icon={<MetricIcon>{String(index + 1).padStart(2, "0")}</MetricIcon>}
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

function UserFilterSelect({
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
  const id = `admin-users-${name}`;

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

function UserFilterCard({ data }: { data: AdminUsersData }) {
  return (
    <form action="/admin/users">
      <FilterBar
        actions={
          <>
            <ActionButton href="/admin/users" variant="secondary">Reset</ActionButton>
            <ActionButton type="submit">Apply Filters</ActionButton>
          </>
        }
        filters={
          <>
            <UserFilterSelect
              label="Role"
              name="role"
              options={[{ id: "", label: "All roles" }, ...data.filterOptions.roles]}
              value={data.filters.role}
            />
            <UserFilterSelect
              label="Status"
              name="status"
              options={[{ id: "", label: "All statuses" }, ...data.filterOptions.statuses]}
              value={data.filters.status}
            />
            <UserFilterSelect
              label="Organization"
              name="organizationId"
              options={[{ id: "", label: "All organizations" }, ...data.filterOptions.organizations]}
              value={data.filters.organizationId}
            />
            <UserFilterSelect
              label="Cohort"
              name="cohortId"
              options={[{ id: "", label: "All cohorts" }, ...data.filterOptions.cohorts]}
              value={data.filters.cohortId}
            />
          </>
        }
        search={
          <label className="block text-sm font-semibold text-dark-ink" htmlFor="admin-users-query">
            Search users
            <input
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              defaultValue={data.filters.query}
              id="admin-users-query"
              name="query"
              placeholder="Name, email, role, organization..."
              type="search"
            />
          </label>
        }
      />
    </form>
  );
}

function UserTable({ data }: { data: AdminUsersData }) {
  if (data.users.length === 0) {
    return (
      <Panel title="User list">
        <EmptyState
          action={<ActionButton href="/admin/users" variant="secondary">Reset filters</ActionButton>}
          description="Try a broader search, choose fewer filters, or create users before reviewing account operations."
          title="No users match the selected filters"
        />
      </Panel>
    );
  }

  return (
    <Panel
      description="Review users by role, organization, cohort, account status, and learning activity."
      title="User list"
    >
      <div className="hidden overflow-x-auto rounded-[20px] border border-design-border lg:block">
        <table className="w-full min-w-[1080px] border-collapse bg-white text-left text-sm">
          <thead className="bg-soft-bg text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
            <tr>
              <th className="px-4 py-4">User</th>
              <th className="px-4 py-4">Roles</th>
              <th className="px-4 py-4">Organization</th>
              <th className="px-4 py-4">Cohort</th>
              <th className="px-4 py-4">Learning</th>
              <th className="px-4 py-4">Last login</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-design-border">
            {data.users.map((user) => (
              <tr className="align-top" key={user.id}>
                <td className="px-4 py-4">
                  <p className="font-semibold leading-6 text-dark-ink">{user.name}</p>
                  <p className="text-sm leading-6 text-muted-text">{user.email}</p>
                </td>
                <td className="px-4 py-4 text-muted-text">{user.roles}</td>
                <td className="px-4 py-4 text-muted-text">{user.organization}</td>
                <td className="px-4 py-4 text-muted-text">{user.cohort}</td>
                <td className="px-4 py-4 font-semibold text-dark-ink">{user.enrollmentSummary}</td>
                <td className="px-4 py-4 text-muted-text">{user.lastLogin}</td>
                <td className="px-4 py-4">
                  <StatusBadge label={user.status} tone={user.statusTone} />
                </td>
                <td className="px-4 py-4">
                  <ActionButton href={user.href} size="sm" variant="secondary">
                    View
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {data.users.map((user) => (
          <article className="rounded-[20px] border border-design-border bg-soft-bg p-4" key={user.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold leading-6 text-dark-ink">
                  {user.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-text">{user.email}</p>
              </div>
              <StatusBadge label={user.status} tone={user.statusTone} />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Roles", user.roles],
                ["Organization", user.organization],
                ["Cohort", user.cohort],
                ["Learning", user.enrollmentSummary],
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
            <ActionButton className="mt-4 w-full" href={user.href} variant="secondary">
              View
            </ActionButton>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function SelectedUserCard({ data }: { data: AdminUsersData }) {
  if (!data.selectedUser) {
    return null;
  }

  return (
    <aside className="rounded-[24px] border border-dec-blue/25 bg-dec-blue/10 p-6 shadow-soft">
      <StatusBadge label="First user" tone="blue" />
      <h2 className="mt-4 text-xl font-semibold leading-tight text-deep-navy">
        {data.selectedUser.name}
      </h2>
      <dl className="mt-5 grid gap-3">
        {[
          ["Roles", data.selectedUser.roles],
          ["Organization", data.selectedUser.organization],
          ["Cohort", data.selectedUser.cohort],
          ["Learning", data.selectedUser.enrollmentSummary],
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
      <ActionButton className="mt-5 w-full" href={data.selectedUser.href} variant="secondary">
        View Profile
      </ActionButton>
    </aside>
  );
}

export function AdminUsers({ data }: { data: AdminUsersData }) {
  return (
    <div className="space-y-6">
      <UsersHeader />
      <UserMetricGrid data={data} />
      <UserFilterCard data={data} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <UserTable data={data} />
        <SelectedUserCard data={data} />
      </section>
    </div>
  );
}

const noticeMessages: Record<string, { message: string; tone: "error" | "info" | "success" | "warning" }> = {
  "context-linked": {
    message: "Organization and cohort links were updated.",
    tone: "success",
  },
  "cohort-not-found": {
    message: "The selected cohort could not be found.",
    tone: "warning",
  },
  "invalid-role": {
    message: "Choose a valid platform role before saving.",
    tone: "warning",
  },
  "database-error": {
    message: "The invitation could not be saved. Try again.",
    tone: "error",
  },
  "invalid-email": {
    message: "Enter a valid email address before sending the invitation.",
    tone: "warning",
  },
  "invitation-created": {
    message: "Staff invitation email sent successfully.",
    tone: "success",
  },
  "invitation-created-manual-link": {
    message:
      "Invitation saved. Email delivery is not available, so copy the registration link below and share it with the staff member.",
    tone: "warning",
  },
  "invitation-created-email-failed": {
    message:
      "Invitation saved, but the email could not be delivered. Copy the registration link below and share it manually.",
    tone: "warning",
  },
  "invitation-resent": {
    message: "Staff invitation was resent successfully.",
    tone: "success",
  },
  "user-created-invitation-sent": {
    message: "User created and invitation email sent successfully.",
    tone: "success",
  },
  "invitation-cancelled": {
    message: "Staff invitation was cancelled successfully.",
    tone: "success",
  },
  "invitation-not-found": {
    message: "No active invitation was found for that email.",
    tone: "warning",
  },
  "invalid-status": {
    message: "Choose a valid account status before saving.",
    tone: "warning",
  },
  "last-super-admin": {
    message: "That change was blocked because at least one active Super Admin must remain.",
    tone: "warning",
  },
  "organization-not-found": {
    message: "The selected organization could not be found.",
    tone: "warning",
  },
  "role-already-assigned": {
    message: "That role is already active for this user.",
    tone: "info",
  },
  "role-assigned": {
    message: "Role assigned and audit log updated.",
    tone: "success",
  },
  "role-not-assigned": {
    message: "That role was not active for this user.",
    tone: "info",
  },
  "role-removed": {
    message: "Role removed and audit log updated.",
    tone: "success",
  },
  "self-role-blocked": {
    message: "You cannot remove your own admin role.",
    tone: "warning",
  },
  "self-status-blocked": {
    message: "You cannot suspend or deactivate your own account.",
    tone: "warning",
  },
  "status-unchanged": {
    message: "That status was already selected.",
    tone: "info",
  },
  "status-updated": {
    message: "Account status updated and audit log recorded.",
    tone: "success",
  },
  "user-created": {
    message: "User created, role assigned, and audit log updated.",
    tone: "success",
  },
  "user-email-exists": {
    message: "A user with that email address already exists.",
    tone: "warning",
  },
  "user-email-required": {
    message: "Enter a valid email address before creating the user.",
    tone: "warning",
  },
  "user-name-required": {
    message: "Enter the user's full name before creating the account.",
    tone: "warning",
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

  const notice = noticeMessages[code] ?? {
    message: "The admin operation could not be completed.",
    tone: "error" as const,
  };

  return (
    <AlertMessage title="Admin operation" tone={notice.tone}>
      {notice.message}
    </AlertMessage>
  );
}

function InvitationLinkPanel({ invitationUrl }: { invitationUrl?: string }) {
  if (!invitationUrl) {
    return null;
  }

  return (
    <Panel
      description="This one-time link expires in 48 hours. Share it only with the invited staff member."
      title="Registration link"
    >
      <div className="rounded-[16px] border border-design-border bg-soft-bg p-4">
        <p className="break-all font-mono text-sm leading-6 text-dark-ink">{invitationUrl}</p>
        <ActionButton className="mt-4" href={invitationUrl} target="_blank" variant="secondary">
          Open Registration Page
        </ActionButton>
      </div>
    </Panel>
  );
}

function TextField({
  defaultValue,
  helpText,
  label,
  name,
  required = false,
  type = "text",
}: {
  defaultValue?: string;
  helpText?: string;
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
      {helpText ? (
        <span className="mt-2 block text-xs font-medium leading-5 text-muted-text">
          {helpText}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  children,
  defaultValue,
  helpText,
  label,
  name,
  required = false,
}: {
  children: ReactNode;
  defaultValue?: string;
  helpText?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink">
      {label}
      <select
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        name={name}
        required={required}
      >
        {children}
      </select>
      {helpText ? (
        <span className="mt-2 block text-xs font-medium leading-5 text-muted-text">
          {helpText}
        </span>
      ) : null}
    </label>
  );
}

function UserCreateForm({ options }: { options: AdminUserOperationOptions }) {
  return (
    <div className="space-y-6">
      <Panel
        description="Create a platform account, assign the first role, and optionally link the user to an organization and cohort."
        title="Create user"
      >
        <form action={createAdminUserAction} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Full name" name="fullName" required />
            <TextField label="Email address" name="email" required type="email" />
            <SelectField
              defaultValue="INVITED"
              helpText="Use Invited for accounts that should be prepared before first access."
              label="Account status"
              name="status"
              required
            >
              {options.statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </SelectField>
            <SelectField
              defaultValue="PARTICIPANT"
              helpText="At least one role is required so the user can access the right area."
              label="Initial role"
              name="roleKey"
              required
            >
              {options.roles.map((role) => (
                <option key={role.key} value={role.key}>
                  {role.label}
                </option>
              ))}
            </SelectField>
            <SelectField label="Organization" name="organizationId">
              <option value="">No organization</option>
              {options.organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.label}
                </option>
              ))}
            </SelectField>
            <SelectField label="Primary cohort" name="cohortId">
              <option value="">No cohort</option>
              {options.cohorts.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.label}
                </option>
              ))}
            </SelectField>
            <TextField label="Region" name="region" />
            <TextField label="Phone" name="phone" type="tel" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ActionButton type="submit">Create User</ActionButton>
            <ActionButton href="/admin/users" variant="secondary">
              Back to Users
            </ActionButton>
          </div>
        </form>
      </Panel>

      <Panel
        description="Send a one-time registration link to a staff member. They will set password and complete profile details on first access."
        title="Invite staff by email"
      >
        <form action={inviteStaffMemberAction} className="grid gap-4 md:grid-cols-2">
          <TextField label="Staff email" name="email" required type="email" />
          <SelectField defaultValue="PARTICIPANT" label="Role for invitation" name="roleKey" required>
            {options.roles.map((role) => (
              <option key={role.key} value={role.key}>
                {role.label}
              </option>
            ))}
          </SelectField>
          <div className="md:col-span-2">
            <ActionButton type="submit">Send Invitation</ActionButton>
          </div>
        </form>
      </Panel>

      <Panel
        description="Resend a fresh link or cancel an active invite by email."
        title="Manage invitations"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <form action={resendStaffInvitationAction} className="rounded-[18px] border border-design-border bg-soft-bg p-4">
            <div className="grid gap-3">
              <TextField label="Staff email" name="email" required type="email" />
              <SelectField defaultValue="PARTICIPANT" label="Role for invitation" name="roleKey" required>
                {options.roles.map((role) => (
                  <option key={role.key} value={role.key}>
                    {role.label}
                  </option>
                ))}
              </SelectField>
            </div>
            <ActionButton className="mt-4" type="submit" variant="secondary">
              Resend Invitation
            </ActionButton>
          </form>

          <form action={cancelStaffInvitationAction} className="rounded-[18px] border border-design-border bg-soft-bg p-4">
            <TextField label="Staff email" name="email" required type="email" />
            <ActionButton className="mt-4" type="submit" variant="ghost">
              Cancel Invitation
            </ActionButton>
          </form>
        </div>
      </Panel>
    </div>
  );
}

const invitationLinkNoticeCodes = new Set([
  "invitation-created-manual-link",
  "invitation-created-email-failed",
]);

export function AdminUserCreate({
  adminNotice,
  invitationUrl,
  operationOptions,
}: {
  adminNotice?: string;
  invitationUrl?: string;
  operationOptions: AdminUserOperationOptions;
}) {
  return (
    <div className="space-y-6">
      <Notice code={adminNotice} />
      {adminNotice && invitationLinkNoticeCodes.has(adminNotice) ? (
        <InvitationLinkPanel invitationUrl={invitationUrl} />
      ) : null}
      <section className="rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <StatusBadge label="New user" tone="blue" />
        <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
          Add User
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
          Create a platform account and assign the first role needed for access.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ActionButton href="/admin/users" size="lg" variant="secondary">
            Back to Users
          </ActionButton>
          <ActionButton
            className="text-white hover:bg-white/10 hover:text-white"
            href="/admin/organizations"
            size="lg"
            variant="ghost"
          >
            Organizations
          </ActionButton>
        </div>
      </section>
      <UserCreateForm options={operationOptions} />
    </div>
  );
}

function UserOperations({
  detail,
  options,
}: {
  detail: AdminUserDetailData;
  options: AdminUserOperationOptions;
}) {
  return (
    <Panel
      description="Status, role, organization, and cohort changes are audited."
      title="Admin operations"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <form action={updateAdminUserStatusAction} className="rounded-[18px] border border-design-border bg-soft-bg p-4">
          <input name="userId" type="hidden" value={detail.id} />
          <SelectField defaultValue={detail.statusValue} label="Account status" name="status">
            {options.statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </SelectField>
          <ActionButton className="mt-4" type="submit" variant="secondary">
            Update Status
          </ActionButton>
        </form>

        <form action={assignAdminUserRoleAction} className="rounded-[18px] border border-design-border bg-soft-bg p-4">
          <input name="userId" type="hidden" value={detail.id} />
          <SelectField label="Assign role" name="roleKey">
            {options.roles.map((role) => (
              <option key={role.key} value={role.key}>
                {role.label}
              </option>
            ))}
          </SelectField>
          <ActionButton className="mt-4" type="submit" variant="secondary">
            Assign Role
          </ActionButton>
        </form>

        <form action={removeAdminUserRoleAction} className="rounded-[18px] border border-design-border bg-soft-bg p-4">
          <input name="userId" type="hidden" value={detail.id} />
          <SelectField label="Remove active role" name="roleKey">
            {options.roles.map((role) => (
              <option
                disabled={!detail.activeRoleKeys.includes(role.key)}
                key={role.key}
                value={role.key}
              >
                {role.label}
              </option>
            ))}
          </SelectField>
          <ActionButton className="mt-4" type="submit" variant="secondary">
            Remove Role
          </ActionButton>
        </form>

        <form action={linkAdminUserContextAction} className="rounded-[18px] border border-design-border bg-soft-bg p-4">
          <input name="userId" type="hidden" value={detail.id} />
          <div className="grid gap-4">
            <SelectField defaultValue={detail.organizationId} label="Organization" name="organizationId">
              <option value="">No organization</option>
              {options.organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.label}
                </option>
              ))}
            </SelectField>
            <SelectField defaultValue={detail.primaryCohortId} label="Primary cohort" name="cohortId">
              <option value="">No cohort</option>
              {options.cohorts.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.label}
                </option>
              ))}
            </SelectField>
          </div>
          <ActionButton className="mt-4" type="submit" variant="secondary">
            Update Links
          </ActionButton>
        </form>
      </div>
    </Panel>
  );
}

export function AdminUserDetail({
  adminNotice,
  detail,
  operationOptions,
}: {
  adminNotice?: string;
  detail: AdminUserDetailData;
  operationOptions: AdminUserOperationOptions;
}) {
  return (
    <div className="space-y-6">
      <Notice code={adminNotice} />
      <section className="rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <StatusBadge label={detail.status} tone={detail.statusTone} />
        <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
          {detail.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
          {detail.email}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ActionButton href="/admin/users" size="lg" variant="secondary">
            Back to Users
          </ActionButton>
          <ActionButton href="/admin/organizations" size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            Organizations
          </ActionButton>
        </div>
      </section>

      <UserOperations detail={detail} options={operationOptions} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Profile">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["Roles", detail.roles.join(", ")],
              ["Organization", detail.organization],
              ["Primary cohort", detail.cohort],
              ["Region", detail.region],
              ["Phone", detail.phone],
              ["Created", detail.createdAt],
              ["Last login", detail.lastLogin],
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

        <Panel title="Certificates">
          {detail.certificates.length === 0 ? (
            <EmptyState description="No certificates have been issued to this user." title="No certificates" />
          ) : (
            <ul className="space-y-3">
              {detail.certificates.map((certificate) => (
                <li className="rounded-[16px] bg-soft-bg p-4" key={certificate.code}>
                  <p className="font-semibold leading-6 text-dark-ink">{certificate.courseTitle}</p>
                  <p className="text-sm leading-6 text-muted-text">
                    {certificate.code} · {certificate.issuedAt}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <Panel title="Enrollment summary">
        {detail.enrollments.length === 0 ? (
          <EmptyState description="No course enrollments are linked to this user." title="No enrollments" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {detail.enrollments.map((enrollment) => (
              <article className="rounded-[16px] border border-design-border bg-soft-bg p-4" key={enrollment.courseTitle}>
                <h2 className="text-base font-semibold leading-6 text-dark-ink">
                  {enrollment.courseTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-text">
                  {enrollment.status} · {enrollment.progress}
                </p>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
