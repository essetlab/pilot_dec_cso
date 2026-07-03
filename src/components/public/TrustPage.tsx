import Link from "next/link";
import { ActionButton, StatusBadge } from "@/components/ui";

type TrustPageSection = {
  title: string;
  body: string;
};

type TrustPageProps = {
  badge: string;
  title: string;
  description: string;
  sections: TrustPageSection[];
  note?: string;
};

const safeUseReminder =
  "Do not include names, survivor stories, exact locations, complaints, political details, safeguarding cases, or confidential organizational information.";

export function TrustPage({
  badge,
  title,
  description,
  note = safeUseReminder,
  sections,
}: TrustPageProps) {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <StatusBadge label={badge} tone="blue" />
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
          {description}
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <article
            className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft"
            key={section.title}
          >
            <h2 className="text-xl font-semibold text-dark-ink">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-text">
              {section.body}
            </p>
          </article>
        ))}
      </section>

      <aside className="rounded-[24px] border border-dec-green/30 bg-dec-green/15 p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-deep-navy">
          Safe-use reminder
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#426f1c]">{note}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <ActionButton href="/courses" variant="secondary">
            Browse Courses
          </ActionButton>
          <Link
            className="inline-flex items-center justify-center rounded-control px-4 py-2.5 text-sm font-semibold text-[#426f1c] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
            href="/verify-certificate"
          >
            Verify a Certificate
          </Link>
        </div>
      </aside>
    </div>
  );
}
