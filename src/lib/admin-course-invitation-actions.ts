"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminCourseInvitation,
  getAdminCourseInvitationEmailContext,
  prepareAdminCourseInvitationLink,
} from "./admin-course-invitation-workflow";
import { getCurrentSession } from "./auth/server";
import { isRateLimited } from "./auth/rate-limit";
import { resolveControlledLearnerRole } from "./controlled-options";
import {
  cancelCourseInvitation,
  markManagedCourseInvitationFailed,
  markManagedCourseInvitationSent,
} from "./course-invitation-workflow";
import { sendCourseInvitationEmail } from "./email";

const ALLOWED_EXPIRY_DAYS = new Set([1, 3, 7, 14, 30]);

export type ManualCourseInvitationActionState = {
  code: string;
  delivery?: {
    expiresAt: string;
    invitationId: string;
    url: string;
  };
  invitationId?: string;
  message: string;
  success: boolean;
};

const errorMessages: Record<string, string> = {
  "already-assigned": "This learner already has access to the selected course version.",
  "conflicting-assignment":
    "This learner has a conflicting assignment for the selected course. Review their existing access first.",
  "conflicting-organization":
    "This learner is linked to a different organization. No invitation was created.",
  "duplicate-active-invitation":
    "An active invitation already exists for this learner and course. Open that invitation to resend or cancel it.",
  "elevated-user":
    "Platform and super administrator accounts cannot receive learner invitations through this workflow.",
  "inactive-cohort": "The selected cohort is no longer active.",
  "inactive-organization": "The selected organization is no longer active.",
  "inactive-user": "This account is inactive and cannot receive a course invitation.",
  "ineligible-user":
    "This existing account is not an active learner account and cannot receive this invitation.",
  "invalid-course-state": "The selected course is no longer eligible for controlled assignment.",
  "invalid-email": "Enter a valid learner email address.",
  "invalid-expiry": "Choose a valid invitation expiry period.",
  "invalid-input": "Complete all required invitation fields.",
  "invalid-region": "Choose the region that matches the selected CSO.",
  "invalid-role": "Choose a listed role or function and describe it if you select Other.",
  "invalid-transition": "This invitation action is no longer available.",
  "invalid-version-state": "The selected course version is no longer published and available.",
  "missing-app-origin":
    "The application URL is not configured. No invitation link was generated.",
  "email-accepted-status-pending":
    "The email provider accepted the message, but the sent status could not be recorded. Open the invitation and confirm delivery before the learner uses the link.",
  "email-delivery-failed":
    "The email provider did not accept the invitation. It is marked delivery failed; prepare a replacement link before retrying.",
  "not-found": "The invitation could not be found.",
  "rate-limited": "Too many invitation operations were requested. Wait briefly and try again.",
  "unauthorized": "You are not authorized to manage course invitations.",
  "unknown-cohort": "The selected cohort is not eligible for this organization.",
  "unknown-course": "The selected course could not be validated.",
  "unknown-course-version": "Select a published course version.",
  "unknown-organization": "The selected organization could not be validated.",
  unavailable: "The invitation operation is temporarily unavailable. No delivery was recorded.",
};

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function expiryDate(formData: FormData) {
  const days = Number(formText(formData, "expiryDays"));
  if (!Number.isInteger(days) || !ALLOWED_EXPIRY_DAYS.has(days)) {
    return null;
  }
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function failure(code: string): ManualCourseInvitationActionState {
  return {
    code,
    message: errorMessages[code] ?? errorMessages.unavailable,
    success: false,
  };
}

function revalidateInvitationPaths(invitationId?: string) {
  revalidatePath("/admin/course-invitations");
  if (invitationId) {
    revalidatePath(`/admin/course-invitations/${invitationId}`);
  }
  revalidatePath("/admin/audit-log");
}

async function deliverPreparedInvitationEmail({
  deliveryUrl,
  invitationId,
  session,
}: {
  deliveryUrl: string;
  invitationId: string;
  session: Awaited<ReturnType<typeof getCurrentSession>>;
}): Promise<ManualCourseInvitationActionState> {
  const context = await getAdminCourseInvitationEmailContext(invitationId, session);
  if (!context) {
    return failure("not-found");
  }

  const delivery = await sendCourseInvitationEmail({
    ...context,
    invitationUrl: deliveryUrl,
  });

  if (!delivery.delivered && delivery.reason === "missing-config") {
    return {
      code: "manual-delivery-ready",
      delivery: {
        expiresAt: context.expiresAt.toISOString(),
        invitationId,
        url: deliveryUrl,
      },
      invitationId,
      message:
        "SMTP is not configured. Use the approved manual secure-delivery process; the invitation is not marked sent.",
      success: true,
    };
  }

  if (!delivery.delivered) {
    const markedFailed = await markManagedCourseInvitationFailed({
      invitationId,
      session,
    });
    revalidateInvitationPaths(invitationId);
    return {
      ...failure(markedFailed.success ? "email-delivery-failed" : "unavailable"),
      invitationId,
    };
  }

  const markedSent = await markManagedCourseInvitationSent({
    invitationId,
    session,
  });
  revalidateInvitationPaths(invitationId);
  if (!markedSent.success) {
    return {
      ...failure("email-accepted-status-pending"),
      invitationId,
    };
  }

  return {
    code: "email-delivery-sent",
    invitationId,
    message:
      "The email provider accepted the invitation and the delivery status is now Sent.",
    success: true,
  };
}

export async function createCourseInvitationAction(
  _previousState: ManualCourseInvitationActionState,
  formData: FormData,
): Promise<ManualCourseInvitationActionState> {
  const expiresAt = expiryDate(formData);
  if (!expiresAt) {
    return failure("invalid-expiry");
  }

  const session = await getCurrentSession();
  if (session?.userId && isRateLimited(`course-invitation-create:${session.userId}`, 20, 10 * 60 * 1000)) {
    return failure("rate-limited");
  }
  const roleSelection = formText(formData, "invitedRoleOrPosition");
  const invitedRoleOrPosition = roleSelection
    ? resolveControlledLearnerRole(roleSelection, formText(formData, "invitedRoleOther"))
    : null;
  if (roleSelection && !invitedRoleOrPosition) {
    return failure("invalid-role");
  }
  const result = await createAdminCourseInvitation({
    cohortId: formText(formData, "cohortId") || null,
    courseId: formText(formData, "courseId"),
    courseVersionId: formText(formData, "courseVersionId"),
    expiresAt,
    invitedEmail: formText(formData, "invitedEmail"),
    invitedName: formText(formData, "invitedName"),
    invitedRoleOrPosition,
    organizationId: formText(formData, "organizationId"),
    region: formText(formData, "region"),
    session,
  });
  if (!result.success) {
    return failure(result.code);
  }

  if (formText(formData, "deliveryMethod") === "email") {
    return deliverPreparedInvitationEmail({
      deliveryUrl: result.deliveryUrl,
      invitationId: result.invitation.id,
      session,
    });
  }

  revalidateInvitationPaths(result.invitation.id);
  return {
    code: "manual-delivery-ready",
    delivery: {
      expiresAt: result.invitation.expiresAt.toISOString(),
      invitationId: result.invitation.id,
      url: result.deliveryUrl,
    },
    message:
      "A one-time link is ready for immediate secure delivery. The invitation is not marked sent.",
    success: true,
  };
}

export async function prepareCourseInvitationLinkAction(
  _previousState: ManualCourseInvitationActionState,
  formData: FormData,
): Promise<ManualCourseInvitationActionState> {
  const expiresAt = expiryDate(formData);
  if (!expiresAt) {
    return failure("invalid-expiry");
  }

  const invitationId = formText(formData, "invitationId");
  const session = await getCurrentSession();
  if (session?.userId && isRateLimited(`course-invitation-resend:${session.userId}`, 30, 10 * 60 * 1000)) {
    return failure("rate-limited");
  }
  const result = await prepareAdminCourseInvitationLink({
    expiresAt,
    invitationId,
    session,
  });
  if (!result.success) {
    return failure(result.code);
  }

  if (formText(formData, "deliveryMethod") === "email") {
    return deliverPreparedInvitationEmail({
      deliveryUrl: result.deliveryUrl,
      invitationId: result.invitation.id,
      session,
    });
  }

  return {
    code: "manual-delivery-ready",
    delivery: {
      expiresAt: result.invitation.expiresAt.toISOString(),
      invitationId: result.invitation.id,
      url: result.deliveryUrl,
    },
    message:
      "The earlier unused link is now invalid. Share this replacement link only with the intended learner.",
    success: true,
  };
}

export async function confirmCourseInvitationDeliveryAction(formData: FormData) {
  const invitationId = formText(formData, "invitationId");
  const session = await getCurrentSession();
  const result = await markManagedCourseInvitationSent({ invitationId, session });

  revalidateInvitationPaths(invitationId);
  const notice = result.success ? "manual-delivery-confirmed" : result.code;
  redirect(
    `/admin/course-invitations/${encodeURIComponent(invitationId)}?adminNotice=${encodeURIComponent(notice)}`,
  );
}

export async function cancelCourseInvitationAction(formData: FormData) {
  const invitationId = formText(formData, "invitationId");
  const session = await getCurrentSession();
  const result = await cancelCourseInvitation({ invitationId, session });

  revalidateInvitationPaths(invitationId);
  const notice = result.success ? "invitation-cancelled" : result.code;
  redirect(
    `/admin/course-invitations/${encodeURIComponent(invitationId)}?adminNotice=${encodeURIComponent(notice)}`,
  );
}
