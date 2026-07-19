"use client";

import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";
import type { ManagedEmbeddedCourseLaunchData } from "@/lib/managed-external-course-workflow";
import { useEffect, useState } from "react";

export function ManagedExternalCourseFrame({
  launchData,
}: {
  launchData: ManagedEmbeddedCourseLaunchData;
}) {
  const [frameKey, setFrameKey] = useState(0);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [loadingSlowly, setLoadingSlowly] = useState(false);

  useEffect(() => {
    if (frameLoaded) {
      return;
    }

    const timer = setTimeout(() => setLoadingSlowly(true), 6000);
    return () => clearTimeout(timer);
  }, [frameKey, frameLoaded]);

  function reloadFrame() {
    setFrameLoaded(false);
    setLoadingSlowly(false);
    setFrameKey((current) => current + 1);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <StatusBadge label="Embedded external course" tone="green" />
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
              {launchData.courseTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/75">
              This course is delivered by an approved external provider inside a restricted Hub frame. The Hub does not claim automatic progress, completion, assessment, or certificate tracking for this mode.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton type="button" onClick={reloadFrame} variant="secondary">
              Reload course
            </ActionButton>
            <ActionButton
              forceDocumentNavigation
              href={launchData.iframeSrc}
              rel="noreferrer"
              target="_blank"
              variant="outline"
            >
              Open in new tab
            </ActionButton>
            <ActionButton href="/learn/my-courses" variant="secondary">
              Back to My Courses
            </ActionButton>
          </div>
        </div>
      </section>

      <AlertMessage title="External provider limitations" tone={loadingSlowly ? "warning" : "info"}>
        {loadingSlowly
          ? "The provider may be blocking iframe loading. Use Open in new tab to continue safely."
          : "Some providers do not permit embedding. If the frame stays blank or shows a provider error, use Open in new tab."}
      </AlertMessage>

      <section className="overflow-hidden rounded-[24px] border border-design-border bg-white shadow-card">
        <div className="border-b border-design-border p-4 text-sm text-muted-text">
          Approved origin: <span className="font-semibold text-dark-ink">{launchData.allowedOrigin}</span>
        </div>
        <div className="relative min-h-[680px] bg-white">
          {!frameLoaded ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-white px-6 text-center">
              <div className="max-w-md">
                <StatusBadge label="Loading external course" tone="blue" />
                <p className="mt-4 text-sm leading-6 text-muted-text">
                  Waiting for the approved provider. No Hub record identifiers are added to the external URL.
                </p>
              </div>
            </div>
          ) : null}
          <iframe
            key={`${launchData.iframeSrc}:${frameKey}`}
            className="h-[75vh] min-h-[680px] w-full bg-white"
            onLoad={() => setFrameLoaded(true)}
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
