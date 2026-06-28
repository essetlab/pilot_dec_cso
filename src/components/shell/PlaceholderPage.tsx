import { ActionButton, EmptyState as BaseEmptyState, PageHeader } from "@/components/ui";

type PlaceholderPageProps = {
  title: string;
  purpose: string;
  route: string;
  section: "Public" | "Auth" | "Learner" | "Creator" | "Admin";
  note?: string;
  children?: React.ReactNode;
};

export function PlaceholderPage({
  title,
  purpose,
  section,
  children,
}: PlaceholderPageProps) {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow={section}
        subtitle={purpose}
        title={title}
        variant={section === "Public" ? "public" : "app"}
      />
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <BaseEmptyState
      action={href && action ? <ActionButton href={href}>{action}</ActionButton> : null}
      description={description}
      title={title}
    />
  );
}
