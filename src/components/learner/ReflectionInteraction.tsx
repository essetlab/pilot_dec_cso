"use client";

import { useState } from "react";

export type ReflectionInteractionProps = {
  guidanceText?: string;
  privacyNote?: string;
  responseMode: "thinking_only" | "private_note";
};

export function ReflectionInteraction({
  guidanceText,
  privacyNote,
  responseMode,
}: ReflectionInteractionProps) {
  const [note, setNote] = useState("");

  return (
    <div className="mt-4 space-y-4">
      {guidanceText ? (
        <div className="rounded-card border border-design-border bg-soft-bg p-4 text-sm leading-6 text-muted-text">
          <p className="font-semibold text-dark-ink mb-1">Guidance</p>
          <p>{guidanceText}</p>
        </div>
      ) : null}

      {responseMode === "private_note" ? (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-deep-navy" htmlFor="reflection-textarea">
            Your private notes
          </label>
          <textarea
            className="w-full min-h-[120px] rounded-card border border-design-border bg-white px-4 py-3 text-sm leading-6 text-dark-ink shadow-sm focus:border-dec-blue focus:ring-1 focus:ring-dec-blue focus:outline-none"
            id="reflection-textarea"
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type your reflection here..."
            value={note}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs leading-5 text-muted-text">
            <span>{note.length} characters</span>
            {privacyNote && privacyNote.trim() ? (
              <span className="italic text-dec-blue font-medium">{privacyNote}</span>
            ) : (
              <span className="italic">This note is temporary, saved in local memory only, and will be cleared if you reload or leave the page. It is not saved on the server.</span>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-card border border-dec-blue/20 bg-dec-blue/5 px-4 py-3 text-sm leading-6 text-muted-text flex items-center gap-3">
          <svg
            className="h-5 w-5 text-dec-blue shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Take a moment to reflect silently on this question. No written response is required.</p>
        </div>
      )}
    </div>
  );
}
