import type { ReactNode } from "react";

export type EmptyStateProps = {
  action?: ReactNode;
  description?: string;
  icon?: ReactNode;
  title: string;
};

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
  return (
    <section className="rounded-card border border-dashed border-dec-blue/30 bg-white-surface p-6 text-center shadow-soft sm:p-8">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-dec-blue/10 text-dec-blue">
          {icon ?? (
            <span aria-hidden="true" className="block size-3 rounded-full bg-dec-blue" />
          )}
        </div>
        <h2 className="mt-4 text-xl font-semibold text-dark-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
        ) : null}
        {action ? <div className="mt-5 flex flex-wrap justify-center gap-3">{action}</div> : null}
      </div>
    </section>
  );
}
