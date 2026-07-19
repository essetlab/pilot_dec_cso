"use server";

import { CourseLevel } from "../generated/prisma/enums";
import {
  saveAdminExternalCourse,
  type AdminExternalCourseIntent,
} from "./admin-external-course-workflow";
import { getCurrentSession } from "./auth/server";
import type {
  ManagedExternalCourseAvailability,
  ManagedExternalCourseMode,
  ManagedExternalCourseOpenBehavior,
} from "./external-course-manager";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formStrings(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function formInteger(formData: FormData, key: string) {
  const value = formString(formData, key);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

function editorHref(courseId?: string) {
  return courseId
    ? `/admin/courses/${courseId}/integration`
    : "/admin/courses/external/new";
}

export async function saveAdminExternalCourseAction(formData: FormData) {
  const courseId = formString(formData, "courseId") || undefined;
  const intent = formString(formData, "intent") as AdminExternalCourseIntent;
  const session = await getCurrentSession();
  const duration = formInteger(formData, "estimatedDurationMinutes");
  const threshold = formInteger(formData, "passThreshold");

  const result = await saveAdminExternalCourse({
    input: {
      approvedOrigin: formString(formData, "approvedOrigin"),
      assessmentSupported: formBoolean(formData, "assessmentSupported"),
      availability: formString(formData, "availability") as ManagedExternalCourseAvailability,
      certificateEligible: formBoolean(formData, "certificateEligible"),
      completionRule: formString(formData, "completionRule"),
      courseId,
      courseVersion: formString(formData, "courseVersion"),
      displayOrder: formInteger(formData, "displayOrder") ?? Number.NaN,
      estimatedDurationMinutes: duration,
      externalUrl: formString(formData, "externalUrl"),
      featured: formBoolean(formData, "featured"),
      fullDescription: formString(formData, "fullDescription"),
      imageUrl: formString(formData, "imageUrl"),
      integrationMode: formString(formData, "integrationMode") as ManagedExternalCourseMode,
      language: formString(formData, "language"),
      learningOutcomes: formString(formData, "learningOutcomes").split(/\r?\n/),
      level: formString(formData, "level") as CourseLevel,
      openBehavior: formString(formData, "openBehavior") as ManagedExternalCourseOpenBehavior,
      passThreshold: threshold,
      primaryCapacityAreaId: formString(formData, "primaryCapacityAreaId"),
      progressTrackingSupported: formBoolean(formData, "progressTrackingSupported"),
      secondaryCapacityAreaIds: formStrings(formData, "secondaryCapacityAreaIds"),
      shortDescription: formString(formData, "shortDescription"),
      slug: formString(formData, "slug"),
      targetAudience: formString(formData, "targetAudience"),
      title: formString(formData, "title"),
    },
    intent,
    session,
  });

  if (result.success && result.courseId) {
    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${result.courseId}/integration`);
    revalidatePath("/admin/audit-log");
    revalidatePath("/courses");
    if (result.slug) {
      revalidatePath(`/courses/${result.slug}`);
      revalidatePath(`/learn/courses/${result.slug}`);
      revalidatePath(`/learn/courses/${result.slug}/external`);
    }
  }

  const target = editorHref(result.courseId ?? courseId);
  redirect(`${target}?adminNotice=${encodeURIComponent(result.code)}`);
}
