import type { ReactNode } from "react";
import Link from "next/link";
import { ActionButton } from "@/components/ui";
import type { AuthSession } from "@/lib/auth/session-codec";
import { cleanPresentationText } from "@/lib/presentation-text";
import { BrandMark } from "./BrandMark";

type CoursePlayerShellProps = {
  children: ReactNode;
  session?: AuthSession | null;
  courseTitle: string;
  currentStage?: string;
  backHref?: string;
};

export function CoursePlayerShell({
  children,
  session = null,
  courseTitle,
  currentStage,
  backHref = "/learn/my-courses",
}: CoursePlayerShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sleek, Sticky Compact Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left Side Brand & Navigation Link */}
          <div className="flex items-center gap-4 lg:gap-6 min-w-0">
            <BrandMark compact logoMode="mark" titleClassName="text-slate-900 hidden sm:block" />
            <span className="hidden sm:inline h-5 w-[1px] bg-slate-200" aria-hidden="true" />
            <Link
              href={backHref}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dec-blue hover:text-deep-navy transition shrink-0"
            >
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to My Learning
            </Link>
          </div>

          {/* Center Stage & Position (Hidden on small screens) */}
          <div className="hidden md:flex flex-col text-center min-w-0 max-w-xl mx-4">
            <h1 className="truncate text-sm font-extrabold text-slate-800 tracking-tight">
              {courseTitle}
            </h1>
            {currentStage && (
              <p className="truncate text-2xs font-semibold uppercase tracking-widest text-[#d97706] mt-0.5">
                {currentStage}
              </p>
            )}
          </div>

          {/* Right Side User Session Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="hidden lg:inline text-xs font-semibold text-slate-500">
                  Learner: <span className="text-slate-800 font-bold">{cleanPresentationText(session.name)}</span>
                </span>
                <ActionButton
                  href="/sign-out"
                  prefetch={false}
                  size="sm"
                  variant="secondary"
                  className="!text-xs h-8 px-3"
                >
                  Exit Course
                </ActionButton>
              </div>
            ) : (
              <Link href="/sign-in" className="text-xs font-bold text-dec-blue hover:underline">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Learning Workspace */}
      <main className="flex-grow mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
