import type { ReactNode } from "react";
import { cx } from "./utils";

export type PageHeaderProps = {
  actions?: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
  variant?: "public" | "app" | "compact";
};

export function PageHeader({
  actions,
  eyebrow,
  subtitle,
  title,
  variant = "app",
}: PageHeaderProps) {
  const isPublic = variant === "public";
  const isCompact = variant === "compact";

  return (
    <header
      className={cx(
        "flex flex-col gap-5",
        !isCompact && "rounded-card border border-design-border bg-white-surface p-6 shadow-soft sm:p-8",
        isCompact && "py-2",
        "lg:flex-row lg:items-end lg:justify-between",
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dec-blue">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cx(
            "mt-2 text-dark-ink",
            isPublic && "font-display text-4xl leading-tight sm:text-5xl",
            !isPublic && !isCompact && "text-3xl font-semibold leading-tight",
            isCompact && "text-2xl font-semibold leading-tight",
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-text">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
