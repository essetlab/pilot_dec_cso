"use client";

import { useState } from "react";
import { ActionButton, AlertMessage } from "@/components/ui";

type AcceptanceProps = {
  authentication?: "matching" | "mismatch" | "required";
  context?: {
    courseSlug: string;
    courseTitle: string;
    expiresAt?: string;
    organizationName: string;
  };
  returnPath: string;
  state: "already-activated" | "available" | "cancelled" | "expired" | "unavailable";
};

type ActivationState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error" }
  | { courseSlug: string; kind: "success"; replay: boolean };

function Summary({ context }: { context: NonNullable<AcceptanceProps["context"]> }) {
  return (
    <div className="rounded-[22px] border border-dec-blue/20 bg-dec-blue/10 p-5">
      <p className="text-sm font-semibold text-dec-blue">Your course invitation</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-deep-navy">
        {context.courseTitle}
      </h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">Approved CSO</dt>
          <dd className="mt-1 text-sm font-semibold text-dark-ink">{context.organizationName}</dd>
        </div>
        {context.expiresAt ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">Accept before</dt>
            <dd className="mt-1 text-sm font-semibold text-dark-ink">
              {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(context.expiresAt))}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

export function CourseInvitationAcceptance({
  authentication,
  context,
  returnPath,
  state,
}: AcceptanceProps) {
  const [activation, setActivation] = useState<ActivationState>({ kind: "idle" });

  async function acceptInvitation() {
    setActivation({ kind: "loading" });
    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    if (!token) {
      setActivation({ kind: "error" });
      return;
    }

    try {
      const response = await fetch("/api/course-invitations/activate", {
        body: JSON.stringify({ token }),
        cache: "no-store",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.access?.courseSlug) {
        setActivation({ kind: "error" });
        return;
      }
      setActivation({
        courseSlug: result.access.courseSlug,
        kind: "success",
        replay: result.code === "already-activated",
      });
    } catch {
      setActivation({ kind: "error" });
    }
  }

  if (activation.kind === "success") {
    return (
      <div aria-live="polite" className="space-y-5">
        <AlertMessage title={activation.replay ? "Invitation already accepted" : "Invitation accepted"} tone="success">
          Your individual access to the invited course is ready.
        </AlertMessage>
        {context ? <Summary context={context} /> : null}
        <ActionButton href={`/learn/courses/${activation.courseSlug}`} size="lg">
          Start course
        </ActionButton>
      </div>
    );
  }

  if (state === "cancelled" || state === "expired" || state === "unavailable") {
    const copy =
      state === "cancelled"
        ? ["Invitation cancelled", "This invitation is no longer active. Contact support if you believe you still need course access."]
        : state === "expired"
          ? ["Invitation expired", "This invitation has passed its acceptance date. Ask the programme team for a new invitation."]
          : ["Invitation unavailable", "The invitation link is invalid, not yet delivered, or no longer available. Check the link or contact support."];
    return (
      <div className="space-y-5">
        <AlertMessage title={copy[0]} tone="error">{copy[1]}</AlertMessage>
        <ActionButton href="/support" variant="secondary">Open support guidance</ActionButton>
      </div>
    );
  }

  if (state === "already-activated" && context) {
    return (
      <div className="space-y-5">
        <AlertMessage title="Invitation already accepted" tone="success">
          This invitation has already created your individual course access.
        </AlertMessage>
        <Summary context={context} />
        <ActionButton href={`/learn/courses/${context.courseSlug}`} size="lg">Start course</ActionButton>
      </div>
    );
  }

  if (authentication === "mismatch") {
    return (
      <div className="space-y-5">
        <AlertMessage title="Use the invited account" tone="error">
          This invitation was issued to a different email address. Sign out and use the invited account.
        </AlertMessage>
        <ActionButton href={`/sign-out?next=${encodeURIComponent(returnPath)}`} size="lg">
          Sign out and continue
        </ActionButton>
      </div>
    );
  }

  if (authentication === "required" && context) {
    return (
      <div className="space-y-5">
        <Summary context={context} />
        <AlertMessage title="Use the invited email address" tone="info">
          Sign in with the email address that received this invitation. If you do not yet have an account, register with that same address and return here after confirmation.
        </AlertMessage>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ActionButton href={`/sign-in?next=${encodeURIComponent(returnPath)}`} size="lg">Sign in to accept</ActionButton>
          <ActionButton href={`/register?next=${encodeURIComponent(returnPath)}`} size="lg" variant="secondary">Create account using the invited email</ActionButton>
        </div>
      </div>
    );
  }

  if (authentication === "matching" && context) {
    return (
      <div className="space-y-5">
        <Summary context={context} />
        <div className="rounded-[18px] border border-dec-green/30 bg-dec-green/15 p-4 text-sm leading-6 text-[#426f1c]">
          Accepting creates one individual assignment for this exact course version. It does not grant organization-wide access.
        </div>
        {activation.kind === "error" ? (
          <div aria-live="assertive">
            <AlertMessage title="Invitation could not be accepted" tone="error">
              The invitation is no longer available or your account does not match its approved scope. No access was changed.
            </AlertMessage>
          </div>
        ) : null}
        <ActionButton
          disabled={activation.kind === "loading"}
          loading={activation.kind === "loading"}
          onClick={acceptInvitation}
          size="lg"
          type="button"
        >
          Accept invitation
        </ActionButton>
      </div>
    );
  }

  return (
    <AlertMessage title="Invitation unavailable" tone="error">
      This invitation cannot be displayed safely. Contact support if you need help.
    </AlertMessage>
  );
}
