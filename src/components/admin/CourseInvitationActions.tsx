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
import {
  ETHIOPIA_REGIONS,
  LEARNER_ROLE_OPTIONS,
  isControlledRegion,
} from "@/lib/controlled-options";

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
  name,
  value,
  variant = "primary",
}: {
  children: React.ReactNode;
  name?: string;
  value?: string;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  return (
    <ActionButton
      disabled={pending}
      loading={pending}
      name={name}
      size="lg"
      type="submit"
      value={value}
      variant={variant}
    >
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
        <StatusBadge label="Not yet sent" tone="orange" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-deep-navy" id="manual-delivery-heading">
        Share this one-time link now
      </h2>
      <p className="mt-2 text-sm leading-6 text-amber-950">{message}</p>
      <p className="mt-2 text-sm leading-6 text-amber-950">
        This link is shown only at this delivery moment and cannot be recovered later.
        Send it only to the intended learner through a designated private channel. Do not
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
  const [organizationQuery, setOrganizationQuery] = useState("");
  const [region, setRegion] = useState("");
  const [role, setRole] = useState("");
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
  const organizations = useMemo(() => {
    const query = organizationQuery.trim().toLowerCase();
    return options.organizations.filter((organization) => {
      const organizationRegion = organization.region && isControlledRegion(organization.region)
        ? organization.region
        : "Other / not listed";
      return organizationRegion === region && (!query || organization.name.toLowerCase().includes(query));
    });
  }, [options.organizations, organizationQuery, region]);

  if (state.success && state.delivery) {
    return <ManualDeliveryPanel delivery={state.delivery} message={state.message} />;
  }

  return (
    <form action={action} aria-label="Create controlled course invitation" className="grid gap-5">
      {state.success && state.code === "email-delivery-sent" ? (
        <div aria-live="polite">
          <AlertMessage title="Invitation email accepted" tone="success">
            {state.message}
          </AlertMessage>
          {state.invitationId ? (
            <ActionButton
              className="mt-4"
              href={`/admin/course-invitations/${state.invitationId}`}
              variant="secondary"
            >
              View invitation status
            </ActionButton>
          ) : null}
        </div>
      ) : null}
      {state.code !== "idle" && !state.success ? (
        <div aria-live="assertive">
          <AlertMessage title="Invitation action was not completed" tone="error">
            {state.message}
          </AlertMessage>
          {state.invitationId ? (
            <ActionButton
              className="mt-4"
              href={`/admin/course-invitations/${state.invitationId}`}
              variant="secondary"
            >
              Review invitation status
            </ActionButton>
          ) : null}
        </div>
      ) : null}

      <section className="rounded-[20px] border border-dec-blue/25 bg-dec-blue/10 p-5 text-sm leading-6 text-[#26536c]">
        <h2 className="font-semibold text-deep-navy">Before creating an invitation</h2>
        <p className="mt-2">Confirm that:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>the organization is listed;</li>
          <li>the learner email is correct;</li>
          <li>the intended course is available;</li>
          <li>the correct version is selected;</li>
          <li>the learner does not already have access;</li>
          <li>the learner will register or sign in using the same email.</li>
        </ul>
      </section>

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
        Role or function <span className="font-normal text-muted-text">(optional)</span>
        <select className={inputClass} name="invitedRoleOrPosition" onChange={(event) => setRole(event.target.value)} value={role}>
          <option value="">Not specified</option>
          {LEARNER_ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <span className="mt-2 block font-normal leading-6 text-muted-text">Choose the closest match. This will be shown during invited registration.</span>
      </label>
      {role === "Other" ? <label className="text-sm font-semibold text-dark-ink">Describe the role or function<input className={inputClass} maxLength={160} name="invitedRoleOther" required /></label> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-dark-ink">
          Region
          <select className={inputClass} name="region" onChange={(event) => { setRegion(event.target.value); setOrganizationId(""); setCohortId(""); }} required value={region}>
            <option value="">Select a region</option>
            {ETHIOPIA_REGIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <span className="mt-2 block font-normal leading-6 text-muted-text">The CSO list is filtered by this region.</span>
        </label>

        <label className="text-sm font-semibold text-dark-ink">
          Search organizations
          <input className={inputClass} disabled={!region} onChange={(event) => setOrganizationQuery(event.target.value)} placeholder="Type part of the CSO name" type="search" value={organizationQuery} />
          <span className="mt-2 block font-normal leading-6 text-muted-text">Search only active organizations in the selected region.</span>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-dark-ink">
          Organization
          <select
            className={inputClass}
            disabled={!region}
            name="organizationId"
            onChange={(event) => {
              setOrganizationId(event.target.value);
              setCohortId("");
            }}
            required
            value={organizationId}
          >
            <option value="">Select an active organization</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
          <span className="mt-2 block font-normal leading-6 text-muted-text">If the organization is missing, ask the platform administrator to add it through organization management.</span>
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
          <span className="mt-2 block font-normal leading-6 text-muted-text">Only published invitation-eligible courses are shown. Missing courses must be added through course management.</span>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-dark-ink">
          Course version
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
          <span className="mt-2 block font-normal leading-6 text-muted-text">Choose the exact published version. Missing versions must be published through course management.</span>
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
          <span className="mt-2 block font-normal leading-6 text-muted-text">Only cohorts linked to the selected CSO are shown. Missing cohorts must be added through cohort management.</span>
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
        Email delivery marks the invitation Sent only after the configured provider
        accepts the message. Manual delivery shows the one-time link for an approved
        private channel and requires explicit confirmation. Neither option creates an
        account, assignment, or enrollment; exact course access begins only after
        authenticated acceptance.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <SubmitButton name="deliveryMethod" value="email">
          Create and send email
        </SubmitButton>
        <SubmitButton name="deliveryMethod" value="manual" variant="secondary">
          Prepare manual link
        </SubmitButton>
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
      {state.success && state.code === "email-delivery-sent" ? (
        <div className="mt-4" aria-live="polite">
          <AlertMessage title="Replacement email accepted" tone="success">
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
      <div className="mt-4 flex flex-col gap-3">
        <SubmitButton name="deliveryMethod" value="email">
          Email replacement invitation
        </SubmitButton>
        <SubmitButton name="deliveryMethod" value="manual" variant="secondary">
          Prepare manual replacement link
        </SubmitButton>
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
