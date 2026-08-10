"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton, AlertMessage, SectionHeader, StatusBadge } from "@/components/ui";
import {
  type ExternalCourseAssessmentResult,
  type ExternalCourseEventMessage,
  hasProhibitedExternalCourseIdentifier,
  isExternalCourseEventMessage,
  isValidExternalCourseEvidenceId,
  EXTERNAL_COURSE_LAUNCH_CONTEXT_MESSAGE,
  EXTERNAL_COURSE_PROGRESS_MESSAGE,
  EXTERNAL_COURSE_RESULT_MESSAGE,
  type ExternalCourseAssessmentState,
  type ExternalCourseLaunchData,
  type ExternalCourseProgressMessage,
} from "@/lib/external-course-types";

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
    isAssessmentResult(message.assessment)
  );
}

export function ExternalCourseFrame({
  launchData,
}: {
  launchData: ExternalCourseLaunchData;
}) {
  const [progressPercent, setProgressPercent] = useState(
    launchData.initialProgressPercent ?? 0,
  );
  const [status, setStatus] = useState<"ready" | "saving" | "completed" | "error">("ready");
  const [message, setMessage] = useState("Waiting for course progress...");
  const [frameKey, setFrameKey] = useState(0);
  const [frameStatus, setFrameStatus] = useState<"loading" | "stabilizing" | "ready">("loading");
  const hasSubmittedCompletion = useRef(false);
  const hasStabilizedFrame = useRef(false);
  const courseFrame = useRef<HTMLIFrameElement | null>(null);
  const frameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      const response = await fetch("/api/external-course-progress", {
        body: JSON.stringify({
          assessment: progressMessage.assessment,
          completed: progressMessage.completed,
          completedModuleIds: progressMessage.completedModuleIds,
          courseSlug: progressMessage.courseSlug,
          currentModuleId: progressMessage.currentModuleId,
          currentScreenId: progressMessage.currentScreenId,
          iframeOrigin: launchData.allowedOrigin,
          learnerStateKey: progressMessage.learnerStateKey,
          launchToken: launchData.launchToken,
          progressPercent: progressMessage.progressPercent,
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

      const result = await response.json() as {
        assessmentState?: ExternalCourseAssessmentState;
        certificateCode?: string | null;
        completed?: boolean;
        error?: string;
        progressPercent?: number;
        success?: boolean;
      };

      if (progressMessage.assessment || progressMessage.completed) {
        courseFrame.current?.contentWindow?.postMessage(
          {
            type: EXTERNAL_COURSE_RESULT_MESSAGE,
            version: 1,
            ...(result.assessmentState
              ? { assessmentState: result.assessmentState }
              : {}),
            certificateCode: result.certificateCode ?? null,
            courseCompleted: result.completed === true,
            courseSlug: launchData.courseSlug,
            ...(result.error ? { error: result.error } : {}),
            event: progressMessage.completed
              ? "course_completed"
              : "assessment_recorded",
            ...(progressMessage.assessment?.evidenceId
              ? { evidenceId: progressMessage.assessment.evidenceId }
              : {}),
            progressPercent: result.progressPercent,
            success: response.ok && result.success === true,
          },
          launchData.allowedOrigin,
        );
      }

      if (!response.ok || !result.success) {
        hasSubmittedCompletion.current = false;
        setStatus("error");
        setMessage(result.error ?? "Progress could not be saved.");
        return;
      }

      setProgressPercent(result.progressPercent ?? progressMessage.progressPercent);
      setStatus(progressMessage.completed ? "completed" : "ready");
      setMessage(
        progressMessage.completed
          ? result.certificateCode
            ? `Course completed. Certificate issued: ${result.certificateCode}.`
            : "Course completion saved. Certificate eligibility depends on the final assessment result."
          : "Progress saved.",
      );
    }

    function handleMessage(event: MessageEvent) {
      if (
        event.origin !== launchData.allowedOrigin ||
        event.source !== courseFrame.current?.contentWindow
      ) {
        return;
      }

      if (isExternalCourseEventMessage(event.data)) {
        if (event.data.courseSlug !== launchData.courseSlug) {
          return;
        }

        if (event.data.event === "course_ready") {
          courseFrame.current?.contentWindow?.postMessage(
            {
              courseSlug: launchData.courseSlug,
              learnerStateKey: launchData.learnerStateKey,
              ...(launchData.assessmentState
                ? { assessmentState: launchData.assessmentState }
                : {}),
              ...(Object.hasOwn(launchData, "courseCompleted")
                ? { courseCompleted: launchData.courseCompleted === true }
                : {}),
              ...(Object.hasOwn(launchData, "certificateCode")
                ? { certificateCode: launchData.certificateCode ?? null }
                : {}),
              ...(Object.hasOwn(launchData, "resumeScreenId")
                ? { resumeScreenId: launchData.resumeScreenId ?? null }
                : {}),
              type: EXTERNAL_COURSE_LAUNCH_CONTEXT_MESSAGE,
              version: 1,
            },
            launchData.allowedOrigin,
          );
          setMessage("Course ready.");
          return;
        }

        if (event.data.event === "course_started") {
          setMessage("Course started.");
          return;
        }

        if (event.data.event === "integration_error") {
          setStatus("error");
          setMessage(event.data.error?.message ?? "The external course reported an integration error.");
          return;
        }

        const progressEvent = event.data as ExternalCourseEventMessage;
        if (progressEvent.learnerStateKey !== launchData.learnerStateKey) {
          setStatus("error");
          setMessage("The course progress belongs to a different learner context.");
          return;
        }

        void persistProgress({
          assessment: progressEvent.assessment,
          completed: progressEvent.event === "course_completed",
          completedModuleIds: progressEvent.completedModuleIds ?? [],
          courseSlug: progressEvent.courseSlug,
          currentModuleId: progressEvent.currentModuleId ?? null,
          currentScreenId: progressEvent.currentScreenId ?? null,
          learnerStateKey: progressEvent.learnerStateKey,
          progressPercent: progressEvent.progressPercent ?? 0,
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
        return;
      }

      void persistProgress(event.data);
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [launchData]);

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
  const isResumeOnlyTrackedCourse = launchData.supportsSecureNewTab === false;

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

  function handleReloadCourse() {
    if (frameTimer.current) {
      clearTimeout(frameTimer.current);
      frameTimer.current = null;
    }

    hasStabilizedFrame.current = true;
    setFrameStatus("loading");
    setFrameKey((currentKey) => currentKey + 1);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <StatusBadge label="Embedded course" tone="green" />
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
              {launchData.courseTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
              {isResumeOnlyTrackedCourse
                ? "Complete the interactive course below. Your portal progress updates automatically as you move through the course."
                : "Complete the interactive course below. Your portal progress and certificate will update automatically when the course completion signal is received."}
            </p>
          </div>
          <div className="rounded-[22px] border border-white/15 bg-white/10 p-5 lg:w-[320px]">
            <p className="text-sm font-semibold text-white">Portal progress</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-dec-green transition-[width]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-white">{progressPercent}%</p>
          </div>
        </div>
      </section>

      {completed ? (
        <AlertMessage tone="success" title="Completion recorded">
          {message} You can review your certificate from the Certificates page.
        </AlertMessage>
      ) : null}

      {error ? (
        <AlertMessage tone="error" title="Progress not saved">
          {message} Refresh this page after checking your connection.
        </AlertMessage>
      ) : null}

      <section className="overflow-hidden rounded-[24px] border border-design-border bg-white-surface shadow-card">
        <div className="border-b border-design-border p-5">
          <SectionHeader
            eyebrow="Course app"
            title={isResumeOnlyTrackedCourse
              ? `Interactive ${launchData.courseTitle} learning experience`
              : "Interactive HRBA learning experience"}
            description={isResumeOnlyTrackedCourse
              ? "The course opens in a secure embedded frame and reports progress back to the portal."
              : "The course opens in a secure embedded frame and reports completion back to the portal."}
            action={
              <div className="flex flex-wrap items-center justify-end gap-3">
                <ActionButton type="button" variant="secondary" onClick={handleReloadCourse}>
                  Reload course
                </ActionButton>
                {launchData.supportsSecureNewTab !== false ? (
                  <ActionButton
                    forceDocumentNavigation
                    href={launchData.iframeSrc}
                    rel="noreferrer"
                    target="_blank"
                    variant="outline"
                  >
                    Open course in new tab
                  </ActionButton>
                ) : null}
                <ActionButton href="/learn/my-courses" variant="secondary">
                  Back to My Courses
                </ActionButton>
              </div>
            }
          />
        </div>
        <div className="relative min-h-[720px] bg-white">
          {!frameReady ? (
            <div className="absolute inset-0 z-10 grid justify-items-center bg-white px-6 pt-14 text-center sm:pt-20">
              <div className="max-w-md">
                <StatusBadge label="Course app" tone="blue" />
                <p className="mt-4 text-2xl font-semibold text-strong-text">
                  Preparing your course...
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-text">
                  We are stabilizing the embedded lesson view so the course opens cleanly.
                </p>
              </div>
            </div>
          ) : null}
          <iframe
            key={`${launchData.iframeSrc}:${frameKey}`}
            allow="clipboard-read; clipboard-write"
            aria-hidden={!frameReady}
            className={`h-[78vh] min-h-[720px] w-full bg-white transition-opacity duration-200 ${
              frameReady ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleFrameLoad}
            ref={courseFrame}
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-downloads allow-forms allow-popups allow-same-origin allow-scripts"
            src={launchData.iframeSrc}
            title={launchData.courseTitle}
          />
        </div>
      </section>
    </div>
  );
}
