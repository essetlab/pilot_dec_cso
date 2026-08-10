"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/shell/BrandMark";
import {
  type ExternalCourseAssessmentResult,
  type ExternalCourseEventMessage,
  hasProhibitedExternalCourseIdentifier,
  isExternalCourseEventMessage,
  isTrustedExternalCourseMessageEvent,
  isValidExternalCourseEvidenceId,
  EXTERNAL_COURSE_LAUNCH_CONTEXT_MESSAGE,
  EXTERNAL_COURSE_PROGRESS_MESSAGE,
  EXTERNAL_COURSE_RESUME_RESULT_MESSAGE,
  type ExternalCourseLaunchData,
  type ExternalCourseProgressMessage,
} from "@/lib/external-course-types";
import {
  createResumeDiagnosticCorrelationId,
  describeBaseRevision,
  isExternalCourseDiagnosticMessage,
  isResumeDiagnosticCorrelationId,
  type ResumeDiagnosticCheckpoint,
  type ResumeDiagnosticErrorCategory,
  type ResumeDiagnosticStageCode,
} from "@/lib/external-course-diagnostics";

function isOptionalNumber(value: unknown) {
  return value === undefined || (typeof value === "number" && Number.isFinite(value));
}

function isOptionalBoolean(value: unknown) {
  return value === undefined || typeof value === "boolean";
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === "string";
}

function isAssessmentResult(value: unknown): value is ExternalCourseAssessmentResult {
  if (value === undefined) {
    return true;
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  const assessment = value as Record<string, unknown>;

  return (
    isOptionalNumber(assessment.attemptNumber) &&
    (assessment.evidenceId === undefined ||
      isValidExternalCourseEvidenceId(assessment.evidenceId)) &&
    isOptionalNumber(assessment.maxScore) &&
    isOptionalBoolean(assessment.passed) &&
    isOptionalNumber(assessment.percentage) &&
    isOptionalNumber(assessment.score) &&
    isOptionalString(assessment.submittedAt)
  );
}

function isProgressMessage(value: unknown): value is ExternalCourseProgressMessage {
  if (
    !value ||
    typeof value !== "object" ||
    hasProhibitedExternalCourseIdentifier(value)
  ) {
    return false;
  }

  const message = value as Partial<ExternalCourseProgressMessage>;

  return (
    message.type === EXTERNAL_COURSE_PROGRESS_MESSAGE &&
    message.version === 1 &&
    typeof message.courseSlug === "string" &&
    typeof message.learnerStateKey === "string" &&
    typeof message.sentAt === "string" &&
    typeof message.progressPercent === "number" &&
    typeof message.completed === "boolean" &&
    Array.isArray(message.completedModuleIds) &&
    (message.diagnosticCorrelationId === undefined ||
      isResumeDiagnosticCorrelationId(message.diagnosticCorrelationId)) &&
    isAssessmentResult(message.assessment)
  );
}

type RawProgressDiagnosticContext = {
  correlationId: string;
  currentModuleId: string | null;
  currentScreenId: string | null;
  baseRevision: "null" | "present";
};

function safeDiagnosticId(value: unknown) {
  return typeof value === "string" && value.length > 0 && value.length <= 256
    ? value
    : null;
}

function getRawProgressDiagnosticContext(
  value: unknown,
): RawProgressDiagnosticContext | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const isProgressEvent =
    candidate.type === "cso-learning-hub:external-course-event" &&
    candidate.event === "progress_updated";
  const isProgressMessage =
    candidate.type === EXTERNAL_COURSE_PROGRESS_MESSAGE;

  if (
    (!isProgressEvent && !isProgressMessage) ||
    !isResumeDiagnosticCorrelationId(candidate.diagnosticCorrelationId)
  ) {
    return null;
  }

  return {
    correlationId: candidate.diagnosticCorrelationId,
    currentModuleId: safeDiagnosticId(candidate.currentModuleId),
    currentScreenId: safeDiagnosticId(candidate.currentScreenId),
    baseRevision: describeBaseRevision(candidate.baseRevision),
  };
}

export function ExternalCourseFrame({
  launchData,
}: {
  launchData: ExternalCourseLaunchData;
}) {
  const [progressPercent, setProgressPercent] = useState(0);
  const [status, setStatus] = useState<"ready" | "saving" | "completed" | "error">("ready");
  const [message, setMessage] = useState("Progress saves automatically.");
  const [frameKey, setFrameKey] = useState(0);
  const [frameStatus, setFrameStatus] = useState<"loading" | "stabilizing" | "ready">("loading");
  const [diagnosticCorrelationId] = useState(createResumeDiagnosticCorrelationId);
  const hasSubmittedCompletion = useRef(false);
  const hasStabilizedFrame = useRef(false);
  const courseFrame = useRef<HTMLIFrameElement | null>(null);
  const frameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const diagnosticQueue = useRef<Promise<void>>(Promise.resolve());

  const diagnosticCheckpoint = useCallback((
    stageCode: ResumeDiagnosticStageCode,
    context: RawProgressDiagnosticContext,
    result: "PASS" | "FAIL",
    options: {
      httpStatus?: number;
      errorCategory?: ResumeDiagnosticErrorCategory;
    } = {},
  ): ResumeDiagnosticCheckpoint => {
    return {
      stageCode,
      timestamp: new Date().toISOString(),
      courseSlug: launchData.courseSlug,
      currentModuleId: context.currentModuleId,
      currentScreenId: context.currentScreenId,
      baseRevision: context.baseRevision,
      result,
      ...options,
      correlationId: context.correlationId,
    };
  }, [launchData.courseSlug]);

  const reportDiagnostic = useCallback((checkpoint: ResumeDiagnosticCheckpoint) => {
    diagnosticQueue.current = diagnosticQueue.current
      .then(async () => {
        await fetch("/api/external-course-diagnostic", {
          body: JSON.stringify(checkpoint),
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          method: "POST",
        });
      })
      .catch(() => undefined);
    return diagnosticQueue.current;
  }, []);

  useEffect(() => {
    async function persistProgress(progressMessage: ExternalCourseProgressMessage) {
      if (
        progressMessage.completed &&
        hasSubmittedCompletion.current
      ) {
        return;
      }

      if (progressMessage.completed) {
        hasSubmittedCompletion.current = true;
      }

      setStatus(progressMessage.completed ? "saving" : "ready");
      setProgressPercent(Math.max(0, Math.min(100, Math.round(progressMessage.progressPercent))));

      const progressDiagnostic = {
        correlationId:
          progressMessage.diagnosticCorrelationId ?? diagnosticCorrelationId,
        currentModuleId: progressMessage.currentModuleId,
        currentScreenId: progressMessage.currentScreenId,
        baseRevision: describeBaseRevision(progressMessage.baseRevision),
      } satisfies RawProgressDiagnosticContext;

      void reportDiagnostic(
        diagnosticCheckpoint("HUB-3", progressDiagnostic, "PASS"),
      );

      let response: Response;
      try {
        response = await fetch("/api/external-course-progress", {
          body: JSON.stringify({
            assessment: progressMessage.assessment,
            baseRevision: progressMessage.baseRevision,
            completed: progressMessage.completed,
            completedModuleIds: progressMessage.completedModuleIds,
            courseSlug: progressMessage.courseSlug,
            currentModuleId: progressMessage.currentModuleId,
            currentScreenId: progressMessage.currentScreenId,
            iframeOrigin: launchData.allowedOrigin,
            learnerStateKey: progressMessage.learnerStateKey,
            legacyBootstrap: progressMessage.legacyBootstrap,
            launchToken: launchData.launchToken,
            progressPercent: progressMessage.progressPercent,
            resumeState: progressMessage.resumeState,
            sentAt: progressMessage.sentAt,
            type: progressMessage.type,
            version: progressMessage.version,
          }),
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
      } catch (error) {
        void reportDiagnostic(diagnosticCheckpoint(
          "HUB-4",
          progressDiagnostic,
          "FAIL",
          { errorCategory: "network_error" },
        ));
        throw error;
      }

      let result: {
        certificateCode?: string | null;
        error?: string;
        progressPercent?: number;
        conflict?: boolean;
        resumeRevision?: string;
        resumeState?: ExternalCourseLaunchData["resumeState"];
        success?: boolean;
      };
      try {
        result = await response.json() as typeof result;
      } catch (error) {
        void reportDiagnostic(diagnosticCheckpoint(
          "HUB-4",
          progressDiagnostic,
          "FAIL",
          { errorCategory: "invalid_response", httpStatus: response.status },
        ));
        throw error;
      }

      void reportDiagnostic(diagnosticCheckpoint(
        "HUB-4",
        progressDiagnostic,
        response.ok && result.success ? "PASS" : "FAIL",
        {
          ...(response.ok && result.success
            ? {}
            : { errorCategory: "http_error" as const }),
          httpStatus: response.status,
        },
      ));

      if (!response.ok || !result.success) {
        hasSubmittedCompletion.current = false;
        if (result.conflict && result.resumeRevision) {
          courseFrame.current?.contentWindow?.postMessage({
            type: EXTERNAL_COURSE_RESUME_RESULT_MESSAGE,
            version: 1,
            courseSlug: launchData.courseSlug,
            status: "conflict",
            resumeRevision: result.resumeRevision,
            resumeState: result.resumeState ?? null,
            diagnosticCorrelationId: progressDiagnostic.correlationId,
            httpStatus: response.status,
          }, launchData.allowedOrigin);
          setStatus("ready");
          setMessage("Progress refreshed from your latest saved session.");
          return;
        }
        if (progressMessage.resumeState && result.resumeRevision) {
          courseFrame.current?.contentWindow?.postMessage({
            type: EXTERNAL_COURSE_RESUME_RESULT_MESSAGE,
            version: 1,
            courseSlug: launchData.courseSlug,
            status: "rejected",
            resumeRevision: result.resumeRevision,
            resumeState: result.resumeState ?? launchData.resumeState,
            error: result.error,
            diagnosticCorrelationId: progressDiagnostic.correlationId,
            httpStatus: response.status,
          }, launchData.allowedOrigin);
        }
        setStatus("error");
        setMessage("We could not save your progress. Please check your connection and try again.");
        return;
      }

      setProgressPercent(result.progressPercent ?? progressMessage.progressPercent);
      if (result.resumeRevision) {
        courseFrame.current?.contentWindow?.postMessage({
          type: EXTERNAL_COURSE_RESUME_RESULT_MESSAGE,
          version: 1,
          courseSlug: launchData.courseSlug,
          status: "accepted",
          resumeRevision: result.resumeRevision,
          resumeState: result.resumeState ?? null,
          diagnosticCorrelationId: progressDiagnostic.correlationId,
          httpStatus: response.status,
        }, launchData.allowedOrigin);
      }
      setStatus(progressMessage.completed ? "completed" : "ready");
      setMessage(
        progressMessage.completed
          ? result.certificateCode
            ? "Your certificate is ready."
            : "Your results are saved."
          : "Progress saved.",
      );
    }

    function queueProgress(progressMessage: ExternalCourseProgressMessage) {
      saveQueue.current = saveQueue.current
        .then(() => persistProgress(progressMessage))
        .catch(() => {
          hasSubmittedCompletion.current = false;
          setStatus("error");
          setMessage("We could not save your progress. Please check your connection and try again.");
        });
    }

    function handleMessage(event: MessageEvent) {
      const rawProgressDiagnostic = getRawProgressDiagnosticContext(event.data);
      if (rawProgressDiagnostic) {
        void reportDiagnostic(diagnosticCheckpoint(
          "HUB-1",
          rawProgressDiagnostic,
          "PASS",
        ));
      }

      const trustedEvent = isTrustedExternalCourseMessageEvent(
        event,
        launchData.allowedOrigin,
        courseFrame.current?.contentWindow,
      );
      if (!trustedEvent) {
        if (rawProgressDiagnostic) {
          const errorCategory = event.origin !== launchData.allowedOrigin
            ? "origin_mismatch"
            : "source_mismatch";
          void reportDiagnostic(diagnosticCheckpoint(
            "HUB-2",
            rawProgressDiagnostic,
            "FAIL",
            { errorCategory },
          ));
        }
        return;
      }

      if (isExternalCourseDiagnosticMessage(event.data)) {
        if (
          event.data.diagnostic.courseSlug === launchData.courseSlug &&
          event.data.diagnostic.correlationId === diagnosticCorrelationId &&
          event.data.diagnostic.stageCode.startsWith("HRBA-")
        ) {
          void reportDiagnostic(event.data.diagnostic);
        }
        return;
      }

      if (isExternalCourseEventMessage(event.data)) {
        if (event.data.courseSlug !== launchData.courseSlug) {
          if (rawProgressDiagnostic) {
            void reportDiagnostic(diagnosticCheckpoint(
              "HUB-2",
              rawProgressDiagnostic,
              "FAIL",
              { errorCategory: "course_mismatch" },
            ));
          }
          return;
        }

        if (event.data.event === "course_ready") {
          courseFrame.current?.contentWindow?.postMessage(
            {
              courseSlug: launchData.courseSlug,
              learnerStateKey: launchData.learnerStateKey,
              resumeRevision: launchData.resumeRevision,
              resumeState: launchData.resumeState,
              trustedAssessmentState: launchData.trustedAssessmentState,
              diagnosticCorrelationId,
              type: EXTERNAL_COURSE_LAUNCH_CONTEXT_MESSAGE,
              version: 1,
            },
            launchData.allowedOrigin,
          );
          setMessage("Your course is ready.");
          return;
        }

        if (event.data.event === "course_started") {
          setMessage("Course started.");
          return;
        }

        if (event.data.event === "integration_error") {
          setStatus("error");
          setMessage("The course reported an issue. Please refresh this page and try again.");
          return;
        }

        const progressEvent = event.data as ExternalCourseEventMessage;
        if (progressEvent.learnerStateKey !== launchData.learnerStateKey) {
          if (rawProgressDiagnostic) {
            void reportDiagnostic(diagnosticCheckpoint(
              "HUB-2",
              rawProgressDiagnostic,
              "FAIL",
              { errorCategory: "learner_context_mismatch" },
            ));
          }
          setStatus("error");
          setMessage("We could not verify this course progress. Please refresh this page and try again.");
          return;
        }

        if (rawProgressDiagnostic) {
          void reportDiagnostic(diagnosticCheckpoint(
            "HUB-2",
            rawProgressDiagnostic,
            "PASS",
          ));
        }

        queueProgress({
          assessment: progressEvent.assessment,
          baseRevision: progressEvent.baseRevision,
          completed: progressEvent.event === "course_completed",
          completedModuleIds: progressEvent.completedModuleIds ?? [],
          courseSlug: progressEvent.courseSlug,
          currentModuleId: progressEvent.currentModuleId ?? null,
          currentScreenId: progressEvent.currentScreenId ?? null,
          learnerStateKey: progressEvent.learnerStateKey,
          legacyBootstrap: progressEvent.legacyBootstrap,
          progressPercent: progressEvent.progressPercent ?? 0,
          resumeState: progressEvent.resumeState,
          diagnosticCorrelationId: progressEvent.diagnosticCorrelationId,
          sentAt: progressEvent.sentAt,
          type: EXTERNAL_COURSE_PROGRESS_MESSAGE,
          version: 1,
        });
        return;
      }

      if (
        !isProgressMessage(event.data) ||
        event.data.courseSlug !== launchData.courseSlug ||
        event.data.learnerStateKey !== launchData.learnerStateKey
      ) {
        if (rawProgressDiagnostic) {
          void reportDiagnostic(diagnosticCheckpoint(
            "HUB-2",
            rawProgressDiagnostic,
            "FAIL",
            { errorCategory: "message_invalid" },
          ));
        }
        return;
      }

      if (rawProgressDiagnostic) {
        void reportDiagnostic(diagnosticCheckpoint(
          "HUB-2",
          rawProgressDiagnostic,
          "PASS",
        ));
      }
      queueProgress(event.data);
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [diagnosticCheckpoint, diagnosticCorrelationId, launchData, reportDiagnostic]);

  useEffect(() => {
    return () => {
      if (frameTimer.current) {
        clearTimeout(frameTimer.current);
        frameTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (frameStatus === "ready") {
      return;
    }

    const fallbackTimer = setTimeout(() => {
      setFrameStatus("ready");
    }, 4500);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [frameKey, frameStatus]);

  const completed = status === "completed";
  const error = status === "error";
  const frameReady = frameStatus === "ready";

  function handleFrameLoad() {
    if (!hasStabilizedFrame.current) {
      hasStabilizedFrame.current = true;
      setFrameStatus("stabilizing");

      frameTimer.current = setTimeout(() => {
        frameTimer.current = null;
        setFrameStatus("loading");
        setFrameKey((currentKey) => currentKey + 1);
      }, 500);

      return;
    }

    setFrameStatus("ready");
  }

  return (
    <div className="flex h-dvh min-h-[480px] flex-col overflow-hidden bg-white text-slate-900">
      <header className="relative z-20 shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-14 min-w-0 items-center gap-2 px-2 sm:h-16 sm:gap-4 sm:px-4 lg:px-6">
          <BrandMark compact titleClassName="hidden text-slate-900 lg:block" />
          <div className="hidden h-7 w-px bg-slate-200 sm:block" />
          <Link
            aria-label="Back to My Learning"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue sm:text-sm"
            href="/learn/my-courses"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">Back to My Learning</span>
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="hidden truncate text-sm font-semibold text-slate-900 md:block">
              {launchData.courseTitle}
            </p>
            <p className="hidden text-[11px] text-slate-500 xl:block">Progress saves automatically</p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="w-16 sm:w-28 lg:w-36">
              <div className="flex items-center justify-between gap-2 text-[10px] font-semibold text-slate-600 sm:text-xs">
                <span className="hidden sm:inline">Course progress</span>
                <span className="ml-auto">{progressPercent}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-dec-green transition-[width]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <Link
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue sm:px-3.5 sm:text-sm"
              href="/learn/my-courses"
            >
              Exit Course
            </Link>
          </div>
        </div>
      </header>

      {completed || error ? (
        <div
          className={`relative z-10 shrink-0 border-b px-4 py-2 text-center text-sm font-medium ${
            completed
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
          role={error ? "alert" : "status"}
        >
          <span className="font-semibold">{completed ? "Course completed." : "Progress not saved."}</span>{" "}
          {message}
        </div>
      ) : null}

      <main className="relative min-h-0 flex-1 overflow-hidden bg-white">
        {!frameReady ? (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white px-6 text-center">
            <div className="max-w-sm">
              <div
                aria-hidden="true"
                className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-dec-blue"
              />
              <p className="mt-4 text-lg font-semibold text-slate-900">Preparing your course...</p>
              <p className="mt-2 text-sm text-slate-500">Your progress will save automatically.</p>
            </div>
          </div>
        ) : null}
        <iframe
          key={`${launchData.iframeSrc}:${frameKey}`}
          allow="clipboard-read; clipboard-write"
          aria-hidden={!frameReady}
          className={`block h-full min-h-0 w-full border-0 bg-white transition-opacity duration-200 ${
            frameReady ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleFrameLoad}
          ref={courseFrame}
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-downloads allow-forms allow-popups allow-same-origin allow-scripts"
          src={launchData.iframeSrc}
          title={launchData.courseTitle}
        />
      </main>
    </div>
  );
}
