"use server";

import {
  createReferenceDataItem,
  setReferenceDataItemStatus,
  updateReferenceDataItem,
  type ReferenceDataCategoryKey,
} from "@/lib/reference-data-workflow";
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

function formNumber(formData: FormData, key: string) {
  const value = formString(formData, key);
  const parsed = Number(value);

  return value.length > 0 && Number.isFinite(parsed) ? parsed : 0;
}

function revalidateReferenceDataPaths() {
  revalidatePath("/admin/reference-data");
  revalidatePath("/admin/audit-log");
}

function redirectToReferenceData(code: string): never {
  redirect(`/admin/reference-data?adminNotice=${code}`);
}

export async function createReferenceDataItemAction(formData: FormData) {
  const session = await getCurrentSession();
  const result = await createReferenceDataItem({
    category: formString(formData, "category") as ReferenceDataCategoryKey,
    description: nullableFormString(formData, "description"),
    isActive: formData.get("isActive") === "on",
    key: formString(formData, "key"),
    label: formString(formData, "label"),
    order: formNumber(formData, "order"),
    session,
  });

  if (result.success) {
    revalidateReferenceDataPaths();
  }

  redirectToReferenceData(result.code);
}

export async function updateReferenceDataItemAction(formData: FormData) {
  const session = await getCurrentSession();
  const itemId = formString(formData, "itemId");

  if (!itemId) {
    redirectToReferenceData("reference-not-found");
  }

  const result = await updateReferenceDataItem({
    category: formString(formData, "category") as ReferenceDataCategoryKey,
    description: nullableFormString(formData, "description"),
    isActive: formData.get("isActive") === "on",
    itemId,
    key: formString(formData, "key"),
    label: formString(formData, "label"),
    order: formNumber(formData, "order"),
    session,
  });

  if (result.success) {
    revalidateReferenceDataPaths();
  }

  redirectToReferenceData(result.code);
}

export async function setReferenceDataItemStatusAction(formData: FormData) {
  const session = await getCurrentSession();
  const itemId = formString(formData, "itemId");

  if (!itemId) {
    redirectToReferenceData("reference-not-found");
  }

  const result = await setReferenceDataItemStatus({
    isActive: formString(formData, "isActive") === "true",
    itemId,
    session,
  });

  if (result.success) {
    revalidateReferenceDataPaths();
  }

  redirectToReferenceData(result.code);
}
