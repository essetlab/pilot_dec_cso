"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  cancelCourseInvitationAction,
  confirmCourseInvitationDeliveryAction,
  createCourseInvitationAction,
  prepareCourseInvitationLinkAction,
  type ManualCourseInvitationActionState,
} from "@/lib/admin-course-invitation-actions";
import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";

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
  organizations: Array<{ id: string; name: string }>;
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20";

const initialManualCourseInvitationState: ManualCourseInvitationActionState = {
  code: "idle",
  message: "",
  success: false,
};

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <ActionButton disabled={pending} loading={pending} size="lg" type="submit">
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

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(delivery.url);
      setCopyStatus("Link copied. Share it only through the approved secure channel.");
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
        <StatusBadge label="Not yet sent" tone="orange" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-deep-navy" id="manual-delivery-heading">
        Share this one-time link now
      </h2>
      <p className="mt-2 text-sm leading-6 text-amber-950">{message}</p>
      <p className="mt-2 text-sm leading-6 text-amber-950">
        This link is shown only at this delivery moment and cannot be recovered later.
        Send it only to the intended learner through the approved private channel. Do not
        place it in reports, screenshots, group chats, or public messages.
      </p>

      <label className="mt-5 block text-sm font-semibold text-dark-ink" htmlFor="manual-invitation-url">
        One-time invitation link
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
        <ActionButton
          onClick={() => window.location.assign(`/admin/course-invitations/${delivery.invitationId}`)}
          type="button"
          variant="secondary"
        >
          Dismiss without marking sent
        </ActionButton>
      </div>
    </section>
  );
}

export function CourseInvitationCreateForm({ options }: { options: InvitationOptions }) {
  const [state, action] = useActionState(
    createCourseInvitationAction,
    initialManualCourseInvitationState,
  );
  const [organizationId, setOrganizationId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseVersionId, setCourseVersionId] = useState("");
  const [cohortId, setCohortId] = useState("");

  const versions = useMemo(
    () => options.courses.find((course) => course.id === courseId)?.versions ?? [],
    [courseId, options.courses],
  );
  const cohorts = useMemo(
    () =>
      options.cohorts.filter((cohort) =>
        cohort.organizationLinks.some((link) => link.organizationId === organizationId),
      ),
    [options.cohorts, organizationId],
  );

  if (state.success && state.delivery) {
    return <ManualDeliveryPanel delivery={state.delivery} message={state.message} />;
  }

  return (
    <form action={action} aria-label="Create controlled course invitation" className="grid gap-5">
      {state.code !== "idle" && !state.success ? (
        <div aria-live="assertive">
          <AlertMessage title="Invitation was not created" tone="error">
            {state.message}
          </AlertMessage>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-dark-ink">
          Learner name
          <input className={inputClass} maxLength={160} name="invitedName" required />
        </label>
        <label className="text-sm font-semibold text-dark-ink">
          Learner email
          <input
            autoComplete="email"
            className={inputClass}
            maxLength={254}
            name="invitedEmail"
            required
            type="email"
          />
        </label>
      </div>

      <label className="text-sm font-semibold text-dark-ink">
        Role or position <span className="font-normal text-muted-text">(optional)</span>
        <input className={inputClass} maxLength={160} name="invitedRoleOrPosition" />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-dark-ink">
          Approved organization
          <select
            className={inputClass}
            name="organizationId"
            onChange={(event) => {
              setOrganizationId(event.target.value);
              setCohortId("");
            }}
            required
            value={organizationId}
          >
            <option value="">Select an active approved organization</option>
            {options.organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-dark-ink">
          Eligible course
          <select
            className={inputClass}
            name="courseId"
            onChange={(event) => {
              setCourseId(event.target.value);
              setCourseVersionId("");
            }}
            required
            value={courseId}
          >
            <option value="">Select a published assigned-only course</option>
            {options.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-dark-ink">
          Approved course version
          <select
            className={inputClass}
            disabled={!courseId}
            name="courseVersionId"
            onChange={(event) => setCourseVersionId(event.target.value)}
            required
            value={courseVersionId}
          >
            <option value="">Select the exact published version</option>
            {versions.map((version) => (
              <option key={version.id} value={version.id}>
                Version {version.versionNumber}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-dark-ink">
          Cohort <span className="font-normal text-muted-text">(optional)</span>
          <select
            className={inputClass}
            disabled={!organizationId}
            name="cohortId"
            onChange={(event) => setCohortId(event.target.value)}
            value={cohortId}
          >
            <option value="">No cohort</option>
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="max-w-sm text-sm font-semibold text-dark-ink">
        Link expiry
        <select className={inputClass} defaultValue="7" name="expiryDays" required>
          <option value="1">1 day</option>
          <option value="3">3 days</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
      </label>

      <div className="rounded-[18px] border border-dec-blue/20 bg-dec-blue/10 p-4 text-sm leading-6 text-[#26536c]">
        Creating the invitation prepares a one-time manual-delivery link. It does not
        create an account, assignment, enrollment, or sent record. The learner receives
        exact course access only after authenticated acceptance.
      </div>

      <div>
        <SubmitButton>Create invitation and prepare link</SubmitButton>
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
