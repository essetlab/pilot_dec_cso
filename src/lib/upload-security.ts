import "server-only";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { CourseStatus } from "@/generated/prisma/enums";
import { canAccessCreator, hasAnyRole } from "@/lib/auth/permissions";
import { getCurrentSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

type UploadKind = "course-thumbnail" | "image" | "resource" | "video";

type UploadPolicy = {
  allowedExtensions: Set<string>;
  allowedMimeTypes: Set<string>;
  fieldName: string;
  maxBytes: number;
};

type UploadSuccess = {
  file: File;
  relativePath: string;
  success: true;
};

type UploadFailure = {
  error: string;
  status: number;
  success: false;
};

const editableStatuses = new Set<CourseStatus>([
  CourseStatus.DRAFT,
  CourseStatus.RETURNED_FOR_REVISION,
]);

const uploadPolicies: Record<UploadKind, UploadPolicy> = {
  "course-thumbnail": {
    allowedExtensions: new Set([".jpg", ".jpeg", ".png", ".webp"]),
    allowedMimeTypes: new Set(["image/jpeg", "image/png", "image/webp"]),
    fieldName: "file",
    maxBytes: 5 * 1024 * 1024,
  },
  image: {
    allowedExtensions: new Set([".jpg", ".jpeg", ".png", ".webp"]),
    allowedMimeTypes: new Set(["image/jpeg", "image/png", "image/webp"]),
    fieldName: "file",
    maxBytes: 5 * 1024 * 1024,
  },
  resource: {
    allowedExtensions: new Set([
      ".csv",
      ".doc",
      ".docx",
      ".pdf",
      ".ppt",
      ".pptx",
      ".txt",
      ".xls",
      ".xlsx",
    ]),
    allowedMimeTypes: new Set([
      "application/msword",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
      "text/plain",
    ]),
    fieldName: "file",
    maxBytes: 15 * 1024 * 1024,
  },
  video: {
    allowedExtensions: new Set([".mp4", ".mov", ".webm"]),
    allowedMimeTypes: new Set(["video/mp4", "video/quicktime", "video/webm"]),
    fieldName: "video",
    maxBytes: 100 * 1024 * 1024,
  },
};

function sanitizePathSegment(value: FormDataEntryValue | null, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const sanitized = value
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  return sanitized || fallback;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

async function validateCreatorCanUpload(courseId: string): Promise<UploadFailure | null> {
  const session = await getCurrentSession();

  if (!session || !canAccessCreator(session)) {
    return { error: "Unauthorized", status: 401, success: false };
  }

  const dbUser = session.email
    ? await prisma.user.findUnique({
        select: { id: true },
        where: { email: session.email },
      })
    : null;
  const isAdmin = hasAnyRole(session, ["SUPER_ADMIN", "PLATFORM_ADMIN"]);
  const creatorScope =
    dbUser && !isAdmin
      ? [{ OR: [{ assignedCreatorId: dbUser.id }, { createdById: dbUser.id }] }]
      : [];

  const course = await prisma.course.findFirst({
    select: { id: true, status: true },
    where: {
      AND: [{ OR: [{ id: courseId }, { slug: courseId }] }, ...creatorScope],
      archivedAt: null,
    },
  });

  if (!course) {
    return { error: "Course not found", status: 404, success: false };
  }

  if (!isAdmin && !editableStatuses.has(course.status)) {
    return { error: "Course is read-only", status: 403, success: false };
  }

  return null;
}

function validateFile(file: File, policy: UploadPolicy): UploadFailure | null {
  if (file.size < 1) {
    return { error: "Uploaded file is empty", status: 400, success: false };
  }

  if (file.size > policy.maxBytes) {
    return { error: "Uploaded file is too large", status: 413, success: false };
  }

  const extension = path.extname(file.name).toLowerCase();
  if (!policy.allowedExtensions.has(extension)) {
    return { error: "File extension is not allowed", status: 415, success: false };
  }

  if (!policy.allowedMimeTypes.has(file.type)) {
    return { error: "File type is not allowed", status: 415, success: false };
  }

  return null;
}

function safeUploadPath(relativePath: string) {
  const publicRoot = path.resolve(process.cwd(), "public");
  const absolutePath = path.resolve(publicRoot, `.${relativePath}`);

  if (!absolutePath.startsWith(`${publicRoot}${path.sep}`)) {
    throw new Error("Invalid upload path");
  }

  return absolutePath;
}

export async function prepareUpload(
  formData: FormData,
  kind: UploadKind,
): Promise<UploadSuccess | UploadFailure> {
  const policy = uploadPolicies[kind];
  const fileValue = formData.get(policy.fieldName);

  if (!isFile(fileValue)) {
    return { error: "No file uploaded", status: 400, success: false };
  }

  const courseId = getString(formData, "courseId");
  if (!courseId) {
    return { error: "Missing course id", status: 400, success: false };
  }

  const permissionError = await validateCreatorCanUpload(courseId);
  if (permissionError) {
    return permissionError;
  }

  const fileError = validateFile(fileValue, policy);
  if (fileError) {
    return fileError;
  }

  const extension = path.extname(fileValue.name).toLowerCase();
  const courseFolder = sanitizePathSegment(formData.get("courseTitle"), courseId);
  const uniqueName = `${Date.now()}-${randomUUID()}${extension}`;
  const resourceType = sanitizePathSegment(formData.get("resourceType"), "general");
  const relativePathByKind: Record<UploadKind, string> = {
    "course-thumbnail": `/assets/${courseFolder}/thumbnail/${uniqueName}`,
    image: `/assets/resources/${courseFolder}/images/${uniqueName}`,
    resource: `/assets/resources/${courseFolder}/${resourceType}/${uniqueName}`,
    video: `/assets/${courseFolder}/videos/${uniqueName}`,
  };

  return {
    file: fileValue,
    relativePath: relativePathByKind[kind],
    success: true,
  };
}

export async function writeUpload(file: File, relativePath: string) {
  const absolutePath = safeUploadPath(relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()), { flag: "wx" });
}
