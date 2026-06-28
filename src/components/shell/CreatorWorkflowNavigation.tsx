"use client";

import {
  buildCreatorCourseNav,
  creatorCourseWorkflowSteps,
  creatorNav,
} from "@/lib/routes";
import { cx } from "@/components/ui/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type WorkflowNavItem = {
  disabled?: boolean;
  href: string;
  label: string;
  state: "active" | "completed" | "available" | "disabled";
};

function currentCourseContextFromPathname(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);

  if (
    parts[0] !== "creator" ||
    parts[1] !== "courses"
  ) {
    return { courseId: null, segment: null, isNewCourse: false };
  }

  if (parts[2] === "new") {
    return { courseId: null, segment: "setup", isNewCourse: true };
  }

  if (!parts[2]) {
    return { courseId: null, segment: null, isNewCourse: false };
  }

  const workflowSegment = parts[3] === "feedback" ? "submit" : parts[3];
  if (!creatorCourseWorkflowSteps.some((step) => step.segment === workflowSegment)) {
    return { courseId: null, segment: null, isNewCourse: false };
  }

  return { courseId: parts[2], segment: workflowSegment, isNewCourse: false };
}

function buildItems(pathname: string): WorkflowNavItem[] {
  const { courseId, isNewCourse, segment } = currentCourseContextFromPathname(pathname);
  const currentIndex = creatorCourseWorkflowSteps.findIndex(
    (step) => step.segment === segment,
  );

  const myCoursesState =
    pathname === "/creator/courses" ? "active" : courseId || isNewCourse ? "completed" : "available";

  const base: WorkflowNavItem[] = [
    {
      href: creatorNav[0].href,
      label: creatorNav[0].label,
      state: myCoursesState,
    },
  ];

  if (courseId) {
    return [
      ...base,
      ...buildCreatorCourseNav(courseId).map((item, index) => ({
        href: item.href,
        label: item.label,
        state:
          index === currentIndex
            ? "active"
            : currentIndex >= 0 && index < currentIndex
              ? "completed"
              : "available",
      } satisfies WorkflowNavItem)),
    ];
  }

  if (isNewCourse) {
    return [
      ...base,
      {
        href: "/creator/courses/new",
        label: "Setup",
        state: "active",
      },
      ...creatorCourseWorkflowSteps.slice(1).map((step) => ({
        disabled: true,
        href: "#",
        label: step.label,
        state: "disabled",
      } satisfies WorkflowNavItem)),
    ];
  }

  return [
    ...base,
    ...creatorCourseWorkflowSteps.map((step) => ({
      disabled: true,
      href: "#",
      label: step.label,
      state: "disabled",
    } satisfies WorkflowNavItem)),
  ];
}

export function CreatorWorkflowNavigation({ canAccess }: { canAccess: boolean }) {
  const pathname = usePathname();
  if (!canAccess) {
    return null;
  }

  const items = buildItems(pathname);

  return (
    <nav aria-label="Creator workflow navigation" className="min-w-0">
      <ol className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {items.map((item, index) => {
          const active = item.state === "active";
          const completed = item.state === "completed";
          const disabled = item.state === "disabled";
          const classes = cx(
            "group inline-flex min-h-11 min-w-max snap-start items-center gap-2 rounded-control border px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue focus-visible:ring-4 focus-visible:ring-dec-blue/25",
            active &&
              "border-dec-blue bg-dec-blue text-white shadow-[0_10px_24px_rgb(59_153_212_/_0.24)]",
            completed &&
              "border-dec-green/45 bg-white text-deep-navy hover:border-dec-blue hover:text-[#216f9d]",
            item.state === "available" &&
              "border-transparent bg-white text-dark-ink hover:border-dec-blue/45 hover:bg-dec-blue/10 hover:text-[#216f9d]",
            disabled &&
              "cursor-default border-design-border bg-soft-bg text-muted-text",
          );
          const indicatorClasses = cx(
            "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
            active && "border-white/45 bg-white/20 text-white",
            completed && "border-dec-green/50 bg-dec-green/20 text-[#365c19]",
            item.state === "available" && "border-design-border bg-soft-bg text-dark-ink",
            disabled && "border-design-border bg-white text-muted-text",
          );
          const indicator = completed ? "✓" : index + 1;

          return (
            <li key={`${item.label}-${index}`}>
              {disabled ? (
                <span aria-disabled="true" className={classes}>
                  <span aria-hidden="true" className={indicatorClasses}>
                    {indicator}
                  </span>
                  <span>{item.label}</span>
                </span>
              ) : (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={classes}
                  href={item.href}
                >
                  <span aria-hidden="true" className={indicatorClasses}>
                    {indicator}
                  </span>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
