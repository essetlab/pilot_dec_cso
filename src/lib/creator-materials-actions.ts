"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession } from "./auth/server";
import {
  addCreatorResource,
  archiveCreatorResource,
  saveCreatorOutcomes,
} from "./creator-materials-workflow";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "yes";
}

function redirectTo(path: string, notice: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}materialsNotice=${notice}`);
}

function revalidateCreatorMaterials(courseId: string) {
  revalidatePath("/creator/courses");
  revalidatePath(`/creator/courses/${courseId}/outcomes`);
  revalidatePath(`/creator/courses/${courseId}/resources`);
  revalidatePath(`/creator/courses/${courseId}/submit`);
  revalidatePath("/admin/audit-log");
}

export async function saveCreatorOutcomesAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const returnPath = formString(formData, "returnPath") || `/creator/courses/${courseId}/outcomes`;
  const session = await getCurrentSession();

  const statements = Array.from({ length: 8 }, (_, index) =>
    formString(formData, `outcome-${index + 1}`),
  );
  const outcomes = Array.from({ length: 8 }, (_, index) => ({
    assessmentMethod: formString(formData, `assessmentMethod-${index + 1}`),
    capacityAreaId: formString(formData, `capacityAreaId-${index + 1}`),
    csoPracticeId: formString(formData, `csoPracticeId-${index + 1}`),
    evidenceType: formString(formData, `evidenceType-${index + 1}`),
    indicatorId: formString(formData, `indicatorId-${index + 1}`),
    localOutcomeStatement: formString(formData, `localOutcomeStatement-${index + 1}`),
    measurementLevel: formString(formData, `measurementLevel-${index + 1}`),
    observableAction: formString(formData, `observableAction-${index + 1}`),
    standardFamilyId: formString(formData, `standardFamilyId-${index + 1}`),
    statement: statements[index] ?? "",
    successCriterion: formString(formData, `successCriterion-${index + 1}`),
  }));

  const result = await saveCreatorOutcomes({
    courseIdOrSlug: courseId,
    outcomes,
    session,
    statements,
  });

  if (!result.success) {
    redirectTo(returnPath, result.code);
  }

  revalidateCreatorMaterials(courseId);
  redirectTo(returnPath, result.code);
}

export async function addCreatorResourceAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const returnPath = formString(formData, "returnPath") || `/creator/courses/${courseId}/resources`;
  const session = await getCurrentSession();

  const result = await addCreatorResource({
    accessibilityChecked: formBoolean(formData, "accessibilityChecked"),
    accessibilityNotes: formString(formData, "accessibilityNotes"),
    courseIdOrSlug: courseId,
    description: formString(formData, "description"),
    downloadLabel: formString(formData, "downloadLabel"),
    fileName: formString(formData, "fileName"),
    fileType: formString(formData, "fileType"),
    fileUrl: formString(formData, "fileUrl"),
    session,
    title: formString(formData, "title"),
  });

  if (!result.success) {
    redirectTo(returnPath, result.code);
  }

  revalidateCreatorMaterials(courseId);
  redirectTo(returnPath, result.code);
}

export async function archiveCreatorResourceAction(formData: FormData) {
  const courseId = formString(formData, "courseId");
  const returnPath = formString(formData, "returnPath") || `/creator/courses/${courseId}/resources`;
  const session = await getCurrentSession();

  const result = await archiveCreatorResource({
    courseIdOrSlug: courseId,
    resourceId: formString(formData, "resourceId"),
    session,
  });

  if (!result.success) {
    redirectTo(returnPath, result.code);
  }

  revalidateCreatorMaterials(courseId);
  redirectTo(returnPath, result.code);
}
