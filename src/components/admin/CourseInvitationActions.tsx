"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  cancelCourseInvitationAction,
  confirmCourseInvitationDeliveryAction,
  createCourseInvitationAction,
  prepareCourseInvitationLinkAction,
  type ManualCourseInvitationActionState,
} from "@/lib/admin-course-invitation-actions";
import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";
import { LEARNER_ROLE_OPTIONS } from "@/lib/controlled-options";

type InvitationOptions = {
  cohorts: Array<{
    id: string;
    name: string;
    organizationLinks: Array<{ organizationId: string }>;
  }>;
  courses: Array<{
    id: string;
    title: string;
    versions: Array<{ id: string; versionNumber: number }>;
  }>;
  organizations: Array<{ id: string; name: string; region: string | null }>;
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20";

const initialManualCourseInvitationState: ManualCourseInvitationActionState = {
  code: "idle",
  message: "",
  success: false,
};

function SubmitButton({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <ActionButton disabled={disabled || pending} loading={pending} size="lg" type="submit">
      {children}
    </ActionButton>
  );
}

function ManualDeliveryPanel({
  delivery,
  message,
}: {
  delivery: NonNullable<ManualCourseInvitationActionState["delivery"]>;
  message: string;
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const expiresAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(delivery.expiresAt));
  const summaryFields = delivery.invitedEmail && delivery.organizationName && delivery.courseTitle
    ? [
        ["Learner", delivery.invitedName ? `${delivery.invitedName} (${delivery.invitedEmail})` : delivery.invitedEmail],
        ["Organization", delivery.organizationName],
        ["Course", delivery.courseTitle],
        ["Status", delivery.status === "DRAFT" ? "Ready for manual delivery" : delivery.status],
        ["Expires", expiresAt],
      ]
    : [];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(delivery.url);
      setCopyStatus("Link copied. Share it only through the designated private channel.");
    } catch {
      setCopyStatus("Copy was unavailable. Select the link and copy it manually.");
    }
  }

  return (
    <section
      aria-labelledby="manual-delivery-heading"
      className="rounded-[24px] border border-amber-300 bg-amber-50 p-5 shadow-soft sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge label="Manual secure delivery" tone="gold" />
        <StatusBadge label={delivery.status === "DRAFT" ? "Ready for delivery" : delivery.status} tone="orange" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-deep-navy" id="manual-delivery-heading" tabIndex={-1}>
        {summaryFields.length > 0 ? "Invitation created" : "Share this replacement link now"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-amber-950">{message}</p>
      <p className="mt-2 text-sm leading-6 text-amber-950">
        This link is shown only at this delivery moment and cannot be recovered later.
        Send it only to the intended learner through a designated private channel. Do not
        place it in reports, screenshots, group chats, or public messages.
      </p>

      {summaryFields.length > 0 ? (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {summaryFields.map(([label, value]) => (
            <div className="rounded-[16px] border border-amber-200 bg-white/75 p-4" key={label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-900">{label}</dt>
              <dd className="mt-1 text-sm font-semibold leading-6 text-dark-ink">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <label className="mt-5 block text-sm font-semibold text-dark-ink" htmlFor="manual-invitation-url">
        Secure invitation link
        <input
          className={inputClass}
          id="manual-invitation-url"
          onFocus={(event) => event.currentTarget.select()}
          readOnly
          value={delivery.url}
        />
      </label>
      <p aria-live="polite" className="mt-2 min-h-6 text-sm font-medium text-amber-900">
        {copyStatus}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ActionButton onClick={copyLink} type="button" variant="warning">
          Copy secure link
        </ActionButton>
        <form action={confirmCourseInvitationDeliveryAction}>
          <input name="invitationId" type="hidden" value={delivery.invitationId} />
          <ActionButton type="submit" variant="success">
            Confirm link was delivered
          </ActionButton>
        </form>
        <ActionButton href={`/admin/course-invitations/${delivery.invitationId}`} variant="secondary">
          View invitation status
        </ActionButton>
      </div>
    </section>
  );
}

export function CourseInvitationCreateForm({
  options,
  preferredOrganizationId,
}: {
  options: InvitationOptions;
  preferredOrganizationId?: string;
}) {
  const [state, action] = useActionState(
    createCourseInvitationAction,
    initialManualCourseInvitationState,
  );
  const defaultOrganizationId =
    options.organizations.find((organization) => organization.id === preferredOrganizationId)?.id ??
    (options.organizations.length === 1 ? options.organizations[0].id : "");
  const defaultCourseId = options.courses.length === 1 ? options.courses[0].id : "";
  const [organizationId, setOrganizationId] = useState(defaultOrganizationId);
  const [role, setRole] = useState("");
  const [courseId, setCourseId] = useState(defaultCourseId);
  const selectedCourse = options.courses.find((course) => course.id === courseId);
  const courseVersionId = selectedCourse?.versions[0]?.id ?? "";
  const blockingMessages = [
    options.organizations.length === 0
      ? "No active organization is available. Add an organization before creating an invitation."
      : null,
    options.courses.length === 0
      ? "No governed course is available. Publish an assigned-only course before creating an invitation."
      : null,
  ].filter((message): message is string => Boolean(message));

  useEffect(() => {
    if (!state.field) {
      return;
    }

    document.getElementById(`course-invitation-${state.field}`)?.focus();
  }, [state.code, state.field]);

  useEffect(() => {
    if (!state.success || !state.delivery) {
      return;
    }

    document.getElementById("manual-delivery-heading")?.focus();
  }, [state.delivery, state.success]);

  if (state.success && state.delivery) {
    return <ManualDeliveryPanel delivery={state.delivery} message={state.message} />;
  }

  return (
    <form action={action} aria-label="Create course invitation" className="grid gap-5">
      {state.code !== "idle" && !state.success ? (
        <div aria-live="assertive">
          <AlertMessage title="Invitation was not created" tone="error">
            {state.message}
          </AlertMessage>
        </div>
      ) : null}

      {blockingMessages.length > 0 ? (
        <AlertMessage title="Invitation setup is incomplete" tone="warning">
          <ul className="list-disc space-y-1 pl-5">
            {blockingMessages.map((message) => <li key={message}>{message}</li>)}
          </ul>
        </AlertMessage>
      ) : (
        <section className="rounded-[20px] border border-dec-blue/25 bg-dec-blue/10 p-5 text-sm leading-6 text-[#26536c]">
          <h2 className="font-semibold text-deep-navy">Invite one learner to a course</h2>
          <p className="mt-2">
            Enter the learner details, confirm the organization and course, then create a secure link for private manual delivery.
          </p>
        </section>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-dark-ink" htmlFor="course-invitation-invitedName">
          Learner full name
          <input className={inputClass} id="course-invitation-invitedName" maxLength={160} name="invitedName" required />
        </label>
        <label className="text-sm font-semibold text-dark-ink" htmlFor="course-invitation-invitedEmail">
          Learner email
          <input
            autoComplete="email"
            className={inputClass}
            id="course-invitation-invitedEmail"
            maxLength={254}
            name="invitedEmail"
            required
            type="email"
          />
        </label>
      </div>

      <label className="text-sm font-semibold text-dark-ink" htmlFor="course-invitation-invitedRoleOrPosition">
        Role or function <span className="font-normal text-muted-text">(optional)</span>
        <select className={inputClass} id="course-invitation-invitedRoleOrPosition" name="invitedRoleOrPosition" onChange={(event) => setRole(event.target.value)} value={role}>
          <option value="">Not specified</option>
          {LEARNER_ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <span className="mt-2 block font-normal leading-6 text-muted-text">Choose the closest match. This will be shown during invited registration.</span>
      </label>
      {role === "Other" ? <label className="text-sm font-semibold text-dark-ink">Describe the role or function<input className={inputClass} maxLength={160} name="invitedRoleOther" required /></label> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-dark-ink" htmlFor="course-invitation-organizationId">
            Organization
            <select
              className={inputClass}
              disabled={options.organizations.length === 0}
              id="course-invitation-organizationId"
              name="organizationId"
              onChange={(event) => setOrganizationId(event.target.value)}
              required
              value={organizationId}
            >
              <option value="">{options.organizations.length === 0 ? "No active organizations available" : "Select an organization"}</option>
              {options.organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
            <span className="mt-2 block font-normal leading-6 text-muted-text">All active pilot organizations are shown.</span>
          </label>
          <ActionButton className="mt-3" href="/admin/organizations/new?returnTo=%2Fadmin%2Fcourse-invitations%2Fnew" size="sm" variant="secondary">
            Add organization
          </ActionButton>
        </div>

        <label className="text-sm font-semibold text-dark-ink" htmlFor="course-invitation-courseId">
          Course
          <select
            className={inputClass}
            disabled={options.courses.length === 0}
            id="course-invitation-courseId"
            name="courseId"
            onChange={(event) => setCourseId(event.target.value)}
            required
            value={courseId}
          >
            <option value="">{options.courses.length === 0 ? "No governed courses available" : "Select a course"}</option>
            {options.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <span className="mt-2 block font-normal leading-6 text-muted-text">
            Only published courses that require governed access are shown. The latest published version is selected automatically.
          </span>
        </label>
      </div>

      <input name="courseVersionId" type="hidden" value={courseVersionId} />

      <label className="max-w-sm text-sm font-semibold text-dark-ink" htmlFor="course-invitation-expiryDays">
        Invitation expiry
        <select className={inputClass} defaultValue="7" id="course-invitation-expiryDays" name="expiryDays" required>
          <option value="1">1 day</option>
          <option value="3">3 days</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
      </label>

      <div className="rounded-[18px] border border-dec-blue/20 bg-dec-blue/10 p-4 text-sm leading-6 text-[#26536c]">
        A secure one-time link will appear after creation. Copy it for private manual delivery.
        Course access is created only after the invited email signs in and accepts.
      </div>

      <div>
        <SubmitButton disabled={blockingMessages.length > 0 || !organizationId || !courseId || !courseVersionId}>
          Create invitation
        </SubmitButton>
        {blockingMessages.length === 0 && (!organizationId || !courseId) ? (
          <p className="mt-2 text-sm font-medium text-red-700">
            Select an organization and course to enable invitation creation.
          </p>
        ) : null}
      </div>
    </form>
  );
}

export function CourseInvitationPrepareLinkForm({ invitationId }: { invitationId: string }) {
  const [state, action] = useActionState(
    prepareCourseInvitationLinkAction,
    initialManualCourseInvitationState,
  );

  if (state.success && state.delivery) {
    return <ManualDeliveryPanel delivery={state.delivery} message={state.message} />;
  }

  return (
    <form action={action} className="rounded-[20px] border border-design-border bg-soft-bg p-5">
      <input name="invitationId" type="hidden" value={invitationId} />
      <h2 className="text-lg font-semibold text-deep-navy">Prepare a replacement link</h2>
      <p className="mt-2 text-sm leading-6 text-muted-text">
        This invalidates the previous unused link. The replacement appears once and is
        not marked sent until you confirm delivery.
      </p>
      {state.code !== "idle" && !state.success ? (
        <div className="mt-4" aria-live="assertive">
          <AlertMessage title="Link was not prepared" tone="error">
            {state.message}
          </AlertMessage>
        </div>
      ) : null}
      <label className="mt-4 block max-w-xs text-sm font-semibold text-dark-ink">
        New expiry
        <select className={inputClass} defaultValue="7" name="expiryDays">
          <option value="1">1 day</option>
          <option value="3">3 days</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
      </label>
      <div className="mt-4">
        <SubmitButton>Prepare replacement link</SubmitButton>
      </div>
    </form>
  );
}

export function CourseInvitationCancelForm({ invitationId }: { invitationId: string }) {
  return (
    <form
      action={cancelCourseInvitationAction}
      onSubmit={(event) => {
        if (!window.confirm("Cancel this invitation? Its current link will stop working immediately.")) {
          event.preventDefault();
        }
      }}
    >
      <input name="invitationId" type="hidden" value={invitationId} />
      <ActionButton type="submit" variant="danger">
        Cancel invitation
      </ActionButton>
    </form>
  );
}
