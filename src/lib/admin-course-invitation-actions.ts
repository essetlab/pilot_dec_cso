"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminCourseInvitation,
  prepareAdminCourseInvitationLink,
} from "./admin-course-invitation-workflow";
import { getCurrentSession } from "./auth/server";
import { isRateLimited } from "./auth/rate-limit";
import { resolveControlledLearnerRole } from "./controlled-options";
import {
  cancelCourseInvitation,
  markManagedCourseInvitationSent,
} from "./course-invitation-workflow";

const ALLOWED_EXPIRY_DAYS = new Set([1, 3, 7, 14, 30]);

export type ManualCourseInvitationActionState = {
  code: string;
  delivery?: {
    courseTitle?: string;
    expiresAt: string;
    invitationId: string;
    invitedEmail?: string;
    invitedName?: string;
    organizationName?: string;
    status: string;
    url: string;
  };
  field?: "courseId" | "expiryDays" | "invitedEmail" | "invitedName" | "invitedRoleOrPosition" | "organizationId";
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

const errorFields: Partial<Record<string, ManualCourseInvitationActionState["field"]>> = {
  "already-assigned": "invitedEmail",
  "conflicting-assignment": "invitedEmail",
  "conflicting-organization": "organizationId",
  "duplicate-active-invitation": "invitedEmail",
  "elevated-user": "invitedEmail",
  "inactive-organization": "organizationId",
  "inactive-user": "invitedEmail",
  "ineligible-user": "invitedEmail",
  "invalid-course-state": "courseId",
  "invalid-email": "invitedEmail",
  "invalid-expiry": "expiryDays",
  "invalid-input": "invitedName",
  "invalid-role": "invitedRoleOrPosition",
  "invalid-version-state": "courseId",
  "unknown-course": "courseId",
  "unknown-course-version": "courseId",
  "unknown-organization": "organizationId",
};

function failure(code: string): ManualCourseInvitationActionState {
  return {
    code,
    field: errorFields[code],
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
    cohortId: null,
    courseId: formText(formData, "courseId"),
    courseVersionId: formText(formData, "courseVersionId"),
    expiresAt,
    invitedEmail: formText(formData, "invitedEmail"),
    invitedName: formText(formData, "invitedName"),
    invitedRoleOrPosition,
    organizationId: formText(formData, "organizationId"),
    session,
  });
  if (!result.success) {
    return failure(result.code);
  }

  revalidateInvitationPaths(result.invitation.id);
  return {
    code: "manual-delivery-ready",
    delivery: {
      courseTitle: result.summary?.courseTitle,
      expiresAt: result.invitation.expiresAt.toISOString(),
      invitationId: result.invitation.id,
      invitedEmail: result.summary?.invitedEmail,
      invitedName: result.summary?.invitedName,
      organizationName: result.summary?.organizationName,
      status: result.invitation.status,
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

  return {
    code: "manual-delivery-ready",
    delivery: {
      expiresAt: result.invitation.expiresAt.toISOString(),
      invitationId: result.invitation.id,
      status: result.invitation.status,
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
