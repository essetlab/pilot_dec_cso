import type { ReactNode } from "react";

export type FilterBarProps = {
  actions?: ReactNode;
  filters?: ReactNode;
  search?: ReactNode;
};

export function FilterBar({ actions, filters, search }: FilterBarProps) {
  return (
    <section className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
      <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_auto] lg:items-end">
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
          {search ? <div className="min-w-0 flex-1">{search}</div> : null}
          {filters ? <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap">{filters}</div> : null}
        </div>
        {actions ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
