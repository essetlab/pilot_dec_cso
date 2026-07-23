import { NextResponse, type NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { recordExternalCourseProgress } from "@/lib/external-course-workflow";
import {
  EXTERNAL_COURSE_PROGRESS_MESSAGE,
  type ExternalCourseAssessmentResult,
} from "@/lib/external-course-types";

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

function asOptionalFiniteNumber(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function asOptionalBoolean(value: unknown) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === "boolean" ? value : null;
}

function parseAssessment(value: unknown): ExternalCourseAssessmentResult | null | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const evidenceId =
    record.evidenceId === undefined || record.evidenceId === null
      ? undefined
      : asString(record.evidenceId);
  const score = asOptionalFiniteNumber(record.score);
  const maxScore = asOptionalFiniteNumber(record.maxScore);
  const percentage = asOptionalFiniteNumber(record.percentage);
  const attemptNumber = asOptionalFiniteNumber(record.attemptNumber);
  const passed = asOptionalBoolean(record.passed);
  const submittedAt =
    record.submittedAt === undefined || record.submittedAt === null
      ? undefined
      : asString(record.submittedAt);

  if (
    score === null ||
    maxScore === null ||
    percentage === null ||
    attemptNumber === null ||
    passed === null ||
    (record.evidenceId !== undefined && record.evidenceId !== null && !evidenceId) ||
    (record.submittedAt !== undefined && record.submittedAt !== null && !submittedAt)
  ) {
    return null;
  }

  if (
    (score !== undefined && score < 0) ||
    (maxScore !== undefined && maxScore <= 0) ||
    (score !== undefined && maxScore !== undefined && score > maxScore) ||
    (percentage !== undefined && (percentage < 0 || percentage > 100)) ||
    (attemptNumber !== undefined && attemptNumber < 1)
  ) {
    return null;
  }

  return {
    attemptNumber,
    evidenceId,
    maxScore,
    passed,
    percentage,
    score,
    submittedAt,
  };
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

  if (
    record.type !== EXTERNAL_COURSE_PROGRESS_MESSAGE ||
    record.version !== 1
  ) {
    return NextResponse.json(
      { success: false, error: "Invalid message type" },
      { status: 400 },
    );
  }

  if (!Number.isFinite(progressPercent) || progressPercent < 0 || progressPercent > 100) {
    return NextResponse.json(
      { success: false, error: "Invalid progress value" },
      { status: 400 },
    );
  }

  const assessment = parseAssessment(record.assessment);

  if (assessment === null) {
    return NextResponse.json(
      { success: false, error: "Invalid assessment result" },
      { status: 400 },
    );
  }

  const session = await getCurrentSession();
  const result = await recordExternalCourseProgress({
    assessment,
    completed: record.completed === true,
    completedModuleIds: asStringArray(record.completedModuleIds),
    courseSlug: asString(record.courseSlug),
    currentModuleId: asNullableString(record.currentModuleId),
    currentScreenId: asNullableString(record.currentScreenId),
    iframeOrigin: asString(record.iframeOrigin),
    learnerStateKey: asString(record.learnerStateKey),
    launchToken: asString(record.launchToken),
    progressPercent,
    sentAt: asString(record.sentAt),
    session,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: result.error === "Unauthorized" ? 401 : 400 });
  }

  return NextResponse.json(result);
}
