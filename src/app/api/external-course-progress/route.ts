import { NextResponse, type NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { recordExternalCourseProgress } from "@/lib/external-course-workflow";

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const record = body as Record<string, unknown>;
  const progressPercent = Number(record.progressPercent);

  if (!Number.isFinite(progressPercent)) {
    return NextResponse.json(
      { success: false, error: "Invalid progress value" },
      { status: 400 },
    );
  }

  const session = await getCurrentSession();
  const result = await recordExternalCourseProgress({
    completed: record.completed === true,
    completedModuleIds: asStringArray(record.completedModuleIds),
    courseSlug: asString(record.courseSlug),
    courseVersionId: asString(record.courseVersionId),
    currentModuleId: asNullableString(record.currentModuleId),
    currentScreenId: asNullableString(record.currentScreenId),
    enrollmentId: asString(record.enrollmentId),
    iframeOrigin: asString(record.iframeOrigin),
    progressPercent,
    session,
    userId: asString(record.userId),
  });

  if (!result.success) {
    return NextResponse.json(result, { status: result.error === "Unauthorized" ? 401 : 400 });
  }

  return NextResponse.json(result);
}
