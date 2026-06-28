"use server";

import {
  assignAdminCourse,
  deactivateAdminCourseAssignment,
  type AdminCourseAssignmentTargetType,
  type AdminCourseAssignmentMutationResult,
} from "@/lib/admin-course-workflow";
import { getCurrentSession } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function nullableFormString(formData: FormData, key: string) {
  const value = formString(formData, key);

  return value.length > 0 ? value : null;
}

function revalidateAssignmentPaths(result: AdminCourseAssignmentMutationResult) {
  revalidatePath("/admin/courses");
  revalidatePath("/admin/users");
  revalidatePath("/admin/organizations");
  revalidatePath("/admin/cohorts");
  revalidatePath("/admin/audit-log");
  revalidatePath("/learn");
  revalidatePath("/learn/my-courses");

  if (result.courseId) {
    revalidatePath(`/admin/courses/${result.courseId}`);
  }

  if (result.targetHref) {
    revalidatePath(result.targetHref);
  }
}

function redirectToCourse(courseId: string, notice: string): never {
  redirect(`/admin/courses/${courseId}?adminNotice=${notice}`);
}

export async function assignAdminCourseAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const session = await getCurrentSession();

  if (!courseId) {
    redirect("/admin/courses?adminNotice=missing-course");
  }

  const result = await assignAdminCourse({
    courseId,
    dueDate: nullableFormString(formData, "dueDate"),
    session,
    targetId: formString(formData, "targetId"),
    targetType: formString(formData, "targetType") as AdminCourseAssignmentTargetType,
  });

  if (result.success) {
    revalidateAssignmentPaths(result);
  }

  redirectToCourse(courseId, result.code);
}

export async function deactivateAdminCourseAssignmentAction(formData: FormData) {
  const assignmentId = formString(formData, "assignmentId");
  const courseId = formString(formData, "courseId");
  const session = await getCurrentSession();

  if (!courseId) {
    redirect("/admin/courses?adminNotice=missing-course");
  }

  const result = await deactivateAdminCourseAssignment({
    assignmentId,
    session,
  });

  if (result.success) {
    revalidateAssignmentPaths(result);
  }

  redirectToCourse(courseId, result.code);
}
