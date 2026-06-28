import type { ReactNode } from "react";
import { cx } from "./utils";

export type StatusBadgeProps = {
  icon?: ReactNode;
  label: string;
  tone?: "blue" | "green" | "gray" | "orange" | "red" | "purple" | "gold";
};

const toneClasses = {
  blue: "border-[#145a85]/25 bg-[#dceef8] text-[#145a85]",
  green: "border-[#3a6118]/25 bg-[#e8f5d6] text-[#3a6118]",
  gray: "border-slate-200 bg-slate-50 text-slate-600",
  orange: "border-orange-200 bg-orange-50 text-orange-800",
  red: "border-red-200 bg-red-50 text-red-800",
  purple: "border-violet-200 bg-violet-50 text-violet-800",
  gold: "border-amber-200 bg-amber-50 text-amber-800",
};

export function StatusBadge({ icon, label, tone = "gray" }: StatusBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold leading-none",
        toneClasses[tone],
      )}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {label}
    </span>
  );
}
