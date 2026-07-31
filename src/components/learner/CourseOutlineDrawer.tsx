"use client";

import { useEffect, useRef, useState } from "react";
import { CourseOutline } from "./LearnerCoursePlayer";
import type { LearnerCourseDetail } from "@/lib/course-types";

type CourseOutlineDrawerProps = {
  course: LearnerCourseDetail;
  baseHref: string;
  displayedLessonId?: string;
  finalTestHref: string;
};

export function CourseOutlineDrawer({
  course,
  baseHref,
  displayedLessonId,
  finalTestHref,
}: CourseOutlineDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Find active module/lesson to display on trigger
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const activeLesson = allLessons.find((l) => l.id === displayedLessonId) || allLessons.find((l) => l.status === "Current") || course.modules[0]?.lessons[0];
  const activeModuleIndex = course.modules.findIndex((m) => m.lessons.some((l) => l.id === activeLesson?.id));

  // Focus trapping and Esc close logic
  useEffect(() => {
    if (!isOpen) return;

    // Save current active element
    const previousActiveElement = document.activeElement as HTMLElement;

    // Select focusable nodes inside the drawer
    const focusableNodes = drawerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex="0"]'
    );
    if (!focusableNodes || focusableNodes.length === 0) return;

    const firstElement = focusableNodes[0] as HTMLElement;
    const lastElement = focusableNodes[focusableNodes.length - 1] as HTMLElement;

    // Trap focus inside drawer
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    // Focus first link on open
    firstElement.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Restore focus to trigger button
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Drawer Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue transition md:hidden"
        aria-expanded={isOpen}
        aria-controls="course-contents-drawer"
        aria-label="Open course outline menu"
      >
        <span className="flex items-center gap-2">
          <svg
            className="size-5 text-dec-blue"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          Course Outline
        </span>
        {activeLesson && (
          <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-500 max-w-[200px] truncate">
            {activeModuleIndex >= 0 ? `Mod ${activeModuleIndex + 1}` : "Overview"} › {activeLesson.title}
          </span>
        )}
      </button>

      {/* Slide-out Drawer Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content panel */}
          <div
            ref={drawerRef}
            id="course-contents-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Course Contents Navigation"
            className="relative flex w-full max-w-[340px] flex-col bg-white shadow-xl animate-slide-in"
          >
            {/* Header with Close Control */}
            <div className="flex h-16 items-center justify-between border-b border-slate-100 bg-slate-50 px-5">
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                Course Contents
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-dec-blue"
                aria-label="Close outline menu"
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable contents list */}
            <div className="flex-grow overflow-y-auto p-4">
              <CourseOutline
                baseHref={baseHref}
                className="!border-0 !shadow-none !rounded-none !sticky-none !w-full"
                course={course}
                displayedLessonId={displayedLessonId}
                finalTestHref={finalTestHref}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
