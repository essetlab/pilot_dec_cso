"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton, AlertMessage, SectionHeader, StatusBadge } from "@/components/ui";
import {
  EXTERNAL_COURSE_PROGRESS_MESSAGE,
  type ExternalCourseLaunchData,
  type ExternalCourseProgressMessage,
} from "@/lib/external-course-types";

function isProgressMessage(value: unknown): value is ExternalCourseProgressMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<ExternalCourseProgressMessage>;

  return (
    message.type === EXTERNAL_COURSE_PROGRESS_MESSAGE &&
    message.version === 1 &&
    typeof message.courseSlug === "string" &&
    typeof message.userId === "string" &&
    typeof message.progressPercent === "number" &&
    typeof message.completed === "boolean" &&
    Array.isArray(message.completedModuleIds)
  );
}

export function ExternalCourseFrame({
  launchData,
}: {
  launchData: ExternalCourseLaunchData;
}) {
  const [progressPercent, setProgressPercent] = useState(0);
  const [status, setStatus] = useState<"ready" | "saving" | "completed" | "error">("ready");
  const [message, setMessage] = useState("Waiting for course progress...");
  const hasSubmittedCompletion = useRef(false);

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
          ...progressMessage,
          courseVersionId: launchData.courseVersionId,
          enrollmentId: launchData.enrollmentId,
          iframeOrigin: launchData.allowedOrigin,
        }),
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = await response.json() as {
        certificateCode?: string | null;
        error?: string;
        progressPercent?: number;
        success?: boolean;
      };

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
            : "Course completed. Your certificate is already available."
          : "Progress saved.",
      );
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== launchData.allowedOrigin) {
        return;
      }

      if (!isProgressMessage(event.data)) {
        return;
      }

      if (
        event.data.courseSlug !== launchData.courseSlug ||
        event.data.userId !== launchData.userId
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

  const completed = status === "completed";
  const error = status === "error";

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
              Complete the interactive course below. Your portal progress and certificate
              will update automatically when the course completion signal is received.
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
            title="Interactive HRBA learning experience"
            description="The course opens in a secure embedded frame and reports completion back to the portal."
            action={
              <ActionButton href="/learn/my-courses" variant="secondary">
                Back to My Courses
              </ActionButton>
            }
          />
        </div>
        <iframe
          allow="clipboard-read; clipboard-write"
          className="h-[78vh] min-h-[720px] w-full bg-white"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-downloads allow-forms allow-popups allow-same-origin allow-scripts"
          src={launchData.iframeSrc}
          title={launchData.courseTitle}
        />
      </section>
    </div>
  );
}
