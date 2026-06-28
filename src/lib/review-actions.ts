"use server";

import { AuditActionType, CourseStatus } from "@/generated/prisma/enums";
import { canAccessAdmin, canAccessCreator, canAccessReview } from "@/lib/auth/permissions";
import { getCurrentSession } from "@/lib/auth/server";
import { transitionCourseStatus } from "@/lib/review-workflow";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function reviewRedirect(path: string, notice: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}reviewNotice=${notice}`);
}

async function revalidateReviewPaths(courseId: string, slug: string) {
  revalidatePath("/admin/review");
  revalidatePath(`/admin/review/${courseId}`);
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/creator/courses/${courseId}/submit`);
  revalidatePath(`/creator/courses/${slug}/submit`);
  revalidatePath("/courses");
  revalidatePath(`/courses/${slug}`);
  revalidatePath("/learn");
  revalidatePath("/learn/my-courses");
  revalidatePath(`/learn/courses/${slug}`);
}

export async function submitCourseForReviewAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const returnPath = formString(formData, "returnPath") || `/creator/courses/${courseId}/submit`;
  const session = await getCurrentSession();

  if (!courseId || !canAccessCreator(session)) {
    reviewRedirect(returnPath, "unauthorized");
  }

  const result = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_SUBMITTED_FOR_REVIEW,
    allowedFrom: [CourseStatus.DRAFT, CourseStatus.RETURNED_FOR_REVISION],
    courseIdOrSlug: courseId,
    description: "Course submitted for review.",
    session,
    targetStatus: CourseStatus.READY_FOR_REVIEW,
  });

  if (!result.success || !result.courseId || !result.slug) {
    reviewRedirect(returnPath, result.code);
  }

  await revalidateReviewPaths(result.courseId, result.slug);
  reviewRedirect(returnPath, "submitted");
}

export async function approveCourseAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const returnPath = formString(formData, "returnPath") || "/admin/review";
  const session = await getCurrentSession();

  if (!courseId || !canAccessReview(session)) {
    reviewRedirect(returnPath, "unauthorized");
  }

  const result = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_APPROVED,
    allowedFrom: [CourseStatus.READY_FOR_REVIEW],
    courseIdOrSlug: courseId,
    description: "Course approved after quality review.",
    session,
    targetStatus: CourseStatus.APPROVED,
  });

  if (!result.success || !result.courseId || !result.slug) {
    reviewRedirect(returnPath, result.code);
  }

  await revalidateReviewPaths(result.courseId, result.slug);
  reviewRedirect(returnPath, "approved");
}

export async function returnCourseForRevisionAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const comment = formString(formData, "comment");
  const returnPath = formString(formData, "returnPath") || "/admin/review";
  const session = await getCurrentSession();

  if (!courseId || !canAccessReview(session)) {
    reviewRedirect(returnPath, "unauthorized");
  }

  const result = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_RETURNED_FOR_REVISION,
    allowedFrom: [CourseStatus.READY_FOR_REVIEW, CourseStatus.APPROVED],
    comment,
    courseIdOrSlug: courseId,
    description: comment || "Course returned for revision.",
    session,
    targetStatus: CourseStatus.RETURNED_FOR_REVISION,
  });

  if (!result.success || !result.courseId || !result.slug) {
    reviewRedirect(returnPath, result.code);
  }

  await revalidateReviewPaths(result.courseId, result.slug);
  reviewRedirect(returnPath, "returned");
}

export async function publishCourseAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const returnPath = formString(formData, "returnPath") || "/admin/review";
  const session = await getCurrentSession();

  if (!courseId || !canAccessAdmin(session)) {
    reviewRedirect(returnPath, "unauthorized");
  }

  const result = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_PUBLISHED,
    allowedFrom: [CourseStatus.APPROVED, CourseStatus.UNPUBLISHED],
    courseIdOrSlug: courseId,
    description: "Course published for participant access.",
    session,
    targetStatus: CourseStatus.PUBLISHED,
  });

  if (!result.success || !result.courseId || !result.slug) {
    reviewRedirect(returnPath, result.code);
  }

  await revalidateReviewPaths(result.courseId, result.slug);
  reviewRedirect(returnPath, "published");
}

export async function unpublishCourseAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const returnPath = formString(formData, "returnPath") || "/admin/review";
  const session = await getCurrentSession();

  if (!courseId || !canAccessAdmin(session)) {
    reviewRedirect(returnPath, "unauthorized");
  }

  const result = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_UNPUBLISHED,
    allowedFrom: [CourseStatus.PUBLISHED],
    courseIdOrSlug: courseId,
    description: "Course unpublished from participant catalogue access.",
    session,
    targetStatus: CourseStatus.UNPUBLISHED,
  });

  if (!result.success || !result.courseId || !result.slug) {
    reviewRedirect(returnPath, result.code);
  }

  await revalidateReviewPaths(result.courseId, result.slug);
  reviewRedirect(returnPath, "unpublished");
}

export async function archiveCourseAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const returnPath = formString(formData, "returnPath") || "/admin/review";
  const session = await getCurrentSession();

  if (!courseId || !canAccessAdmin(session)) {
    reviewRedirect(returnPath, "unauthorized");
  }

  const result = await transitionCourseStatus({
    actionType: AuditActionType.COURSE_ARCHIVED,
    allowedFrom: [
      CourseStatus.DRAFT,
      CourseStatus.READY_FOR_REVIEW,
      CourseStatus.RETURNED_FOR_REVISION,
      CourseStatus.APPROVED,
      CourseStatus.UNPUBLISHED,
    ],
    courseIdOrSlug: courseId,
    description: "Course archived.",
    session,
    targetStatus: CourseStatus.ARCHIVED,
  });

  if (!result.success || !result.courseId || !result.slug) {
    reviewRedirect(returnPath, result.code);
  }

  await revalidateReviewPaths(result.courseId, result.slug);
  reviewRedirect(returnPath, "archived");
}
