"use server";

import { getCurrentSession } from "./auth/server";
import {
  saveCreatorCourseMetadata,
  saveCreatorCourseSetup,
} from "./creator-course-workflow";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function redirectToSetup(courseId: string | null, notice: string): never {
  if (!courseId) {
    redirect(`/creator/courses/new?setupNotice=${notice}`);
  }

  redirect(`/creator/courses/${courseId}/setup?setupNotice=${notice}`);
}

function redirectToMetadata(courseId: string | null, notice: string): never {
  if (!courseId) {
    redirect(`/creator/courses?metadataNotice=${notice}`);
  }

  redirect(`/creator/courses/${courseId}/metadata?metadataNotice=${notice}`);
}

export async function saveCreatorCourseSetupAction(formData: FormData) {
  const courseId = formString(formData, "courseId") || null;
  const session = await getCurrentSession();

  const result = await saveCreatorCourseSetup({
    accessType: formString(formData, "accessType"),
    capacityAreaId: formString(formData, "capacityAreaId"),
    certificateIncluded: formString(formData, "certificateIncluded"),
    courseId,
    courseTitle: formString(formData, "courseTitle"),
    coverImageUrl: formString(formData, "coverImageUrl"),
    duration: formString(formData, "duration"),
    finalTestRequired: formString(formData, "finalTestRequired"),
    language: formString(formData, "language"),
    learningNeed: formString(formData, "learningNeed"),
    level: formString(formData, "level"),
    passScore: formString(formData, "passScore"),
    primaryAudience: formString(formData, "primaryAudience"),
    session,
    shortDescription: formString(formData, "shortDescription"),
    targetProfile: formString(formData, "targetProfile"),
  });

  if (!result.success) {
    redirectToSetup(courseId, result.code);
  }

  revalidatePath("/creator/courses");
  revalidatePath(`/creator/courses/${result.courseId}/setup`);
  revalidatePath(`/creator/courses/${result.courseId}/preview`);
  revalidatePath(`/creator/courses/${result.courseId}/build`);
  if (result.slug) {
    revalidatePath(`/courses/${result.slug}`);
  }
  revalidatePath("/courses");
  revalidatePath("/admin/audit-log");

  redirectToSetup(result.courseId ?? courseId, result.code);
}

export async function saveCreatorCourseMetadataAction(formData: FormData) {
  const courseId = formString(formData, "courseId") || null;
  const session = await getCurrentSession();

  const result = await saveCreatorCourseMetadata({
    accessibilityNote: formString(formData, "accessibilityNote"),
    capacityGapAddressed: formString(formData, "capacityGapAddressed"),
    courseFitDecision: formString(formData, "courseFitDecision"),
    courseFitNote: formString(formData, "courseFitNote"),
    courseId: courseId ?? "",
    csoPracticeId: formString(formData, "csoPracticeId"),
    currentPracticeBaseline: formString(formData, "currentPracticeBaseline"),
    desiredPractice: formString(formData, "desiredPractice"),
    indicatorId: formString(formData, "indicatorId"),
    intendedPracticeImprovement: formString(formData, "intendedPracticeImprovement"),
    ksmePrimary: formString(formData, "ksmePrimary"),
    ksmeSecondary: formString(formData, "ksmeSecondary"),
    learningCanHelp: formString(formData, "learningCanHelp"),
    learnerTemplateId: formString(formData, "learnerTemplateId"),
    primaryCapacityAreaId: formString(formData, "primaryCapacityAreaId"),
    recommendedPrerequisites: formString(formData, "recommendedPrerequisites"),
    relatedFollowUpSupport: formString(formData, "relatedFollowUpSupport"),
    rootCauseSummary: formString(formData, "rootCauseSummary"),
    safeguardingNote: formString(formData, "safeguardingNote"),
    secondaryCapacityAreaId: formString(formData, "secondaryCapacityAreaId"),
    standardFamilyId: formString(formData, "standardFamilyId"),
    session,
    targetCsoProfile: formString(formData, "targetCsoProfile"),
  });

  if (!result.success) {
    redirectToMetadata(courseId, result.code);
  }

  revalidatePath("/creator/courses");
  revalidatePath(`/creator/courses/${result.courseId}/metadata`);
  revalidatePath(`/creator/courses/${result.courseId}/preview`);
  revalidatePath(`/creator/courses/${result.courseId}/setup`);
  revalidatePath(`/creator/courses/${result.courseId}/submit`);
  if (result.slug) {
    revalidatePath(`/courses/${result.slug}`);
    revalidatePath(`/learn/courses/${result.slug}`);
  }
  revalidatePath("/admin/audit-log");

  redirectToMetadata(result.courseId ?? courseId, result.code);
}
