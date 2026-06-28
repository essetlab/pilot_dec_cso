import type { ReactNode } from "react";

export type FormSectionProps = {
  children: ReactNode;
  description?: string;
  title: string;
};

export function FormSection({ children, description, title }: FormSectionProps) {
  return (
    <section className="rounded-card border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold text-dark-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
        ) : null}
      </div>
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}
