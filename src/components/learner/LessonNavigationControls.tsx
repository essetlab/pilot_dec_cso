"use client";

import { useTransition, useState } from "react";
import { markLessonCompleteAction } from "@/lib/learner-actions";
import { ActionButton } from "@/components/ui";
import { useRouter } from "next/navigation";

export type LessonNavigationControlsProps = {
  courseSlug: string;
  lessonId: string;
  status: "Completed" | "Current" | "Next";
  prevLessonHref?: string;
  nextLessonHref?: string;
};

export function LessonNavigationControls({
  courseSlug,
  lessonId,
  status,
  prevLessonHref,
  nextLessonHref,
}: LessonNavigationControlsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await markLessonCompleteAction(formData);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || "Failed to mark lesson complete");
      }
    });
  };

  return (
    <nav
      aria-label="Lesson navigation"
      className="rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-dark-ink">Lesson controls</p>
          <p className="mt-1 text-sm leading-6 text-muted-text">
            Move through the course at your pace.
          </p>
          {error && (
            <p className="mt-2 text-xs font-semibold text-[#ef4444]" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <form action={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="courseSlug" value={courseSlug} />
            <input type="hidden" name="lessonId" value={lessonId} />

            {/* Previous lesson */}
            {prevLessonHref ? (
              <ActionButton href={prevLessonHref} variant="secondary">
                Previous lesson
              </ActionButton>
            ) : (
              <ActionButton type="button" variant="secondary" disabled>
                Previous lesson
              </ActionButton>
            )}

            {/* Mark complete */}
            {status === "Completed" ? (
              <ActionButton type="button" variant="success" disabled>
                ✓ Completed
              </ActionButton>
            ) : status === "Current" ? (
              <ActionButton type="submit" variant="success" loading={isPending}>
                Mark complete
              </ActionButton>
            ) : (
              <ActionButton
                type="button"
                variant="success"
                disabled
                title="Complete previous lessons first"
              >
                Mark complete
              </ActionButton>
            )}

            {/* Next lesson */}
            {nextLessonHref ? (
              <ActionButton href={nextLessonHref} variant="secondary">
                Next lesson
              </ActionButton>
            ) : (
              <ActionButton type="button" variant="secondary" disabled>
                Next lesson
              </ActionButton>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
}
