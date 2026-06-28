import { StatusBadge } from "@/components/ui";

export type CreatorCourseContextItem = {
  label: string;
  value: string;
};

type CreatorCourseContextBarProps = {
  ariaLabel?: string;
  items: CreatorCourseContextItem[];
};

export function CreatorCourseContextBar({
  ariaLabel = "Course context",
  items,
}: CreatorCourseContextBarProps) {
  return (
    <section
      aria-label={ariaLabel}
      className="rounded-[24px] border border-design-border bg-white-surface p-4 shadow-soft"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <StatusBadge label="Course context" tone="blue" />
        <p className="text-sm font-medium leading-6 text-muted-text">
          Current course details for this workflow step.
        </p>
      </div>
      <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <div className="rounded-[18px] bg-soft-bg p-4" key={item.label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
              {item.label}
            </dt>
            <dd className="mt-2 text-sm font-semibold leading-5 text-dark-ink">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
