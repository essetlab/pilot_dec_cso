import type { ReactNode } from "react";
import { cx } from "./utils";

export type MetricCardProps = {
  helperText?: string;
  icon?: ReactNode;
  label: string;
  tone?: "blue" | "green" | "gray" | "orange" | "red";
  trend?: string;
  value: number | string;
};

const toneClasses = {
  blue: "bg-dec-blue/10 text-dec-blue",
  green: "bg-dec-green/15 text-[#4f7c24]",
  gray: "bg-soft-bg text-muted-text",
  orange: "bg-orange-50 text-orange-700",
  red: "bg-red-50 text-red-700",
};

export function MetricCard({
  helperText,
  icon,
  label,
  tone = "blue",
  trend,
  value,
}: MetricCardProps) {
  return (
    <article className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-text">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-dark-ink">
            {value}
          </p>
        </div>
        {icon ? (
          <div
            className={cx(
              "flex size-11 shrink-0 items-center justify-center rounded-control",
              toneClasses[tone],
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        ) : null}
      </div>
      {helperText || trend ? (
        <p className="mt-4 text-sm leading-6 text-muted-text">
          {trend ? <span className="font-semibold text-dark-ink">{trend}</span> : null}
          {trend && helperText ? " · " : null}
          {helperText}
        </p>
      ) : null}
    </article>
  );
}
