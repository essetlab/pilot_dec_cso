import Image from "next/image";
import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { ActionButton, StatusBadge } from "@/components/ui";
import type { PublicCatalogueCourseSummary } from "@/lib/course-types";
import { cx } from "@/components/ui/utils";

type IconProps = { className?: string };

const CompassIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" strokeLinejoin="round" />
  </svg>
);



const PeopleIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M16 20v-1.5a4.5 4.5 0 0 0-9 0V20M11.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" strokeLinecap="round" />
    <path d="M17 7a3 3 0 0 1 0 6M19 15.5a4 4 0 0 1 2 3.5v1" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 3 19 6v5c0 4.6-2.9 8.1-7 10-4.1-1.9-7-5.4-7-10V6l7-3Z" strokeLinejoin="round" />
    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BookOpenIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TargetIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" fill="currentColor" r="1.25" stroke="none" />
  </svg>
);

const ApplyIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CycleIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M20 7v5h-5M4 17v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.1 8.2A7 7 0 0 1 18.8 7M17.9 15.8A7 7 0 0 1 5.2 17" strokeLinecap="round" />
  </svg>
);

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1 w-6 rounded-full bg-dec-blue" />
      <span className="text-xs font-black uppercase tracking-[0.16em] text-dec-blue">
        {children}
      </span>
    </div>
  );
}

function HomepageHero() {
  return (
    <section className="relative isolate flex min-h-[720px] w-full items-center overflow-hidden bg-[#071426] text-white" aria-labelledby="landing-hero-title">
      <Image
        alt="Illustrated network of Ethiopian practitioners learning, collaborating, and applying knowledge across communities."
        className="landing-hero-art -z-30 object-cover object-[62%_center] lg:object-[55%_center]"
        fill
        priority
        sizes="100vw"
        src="/images/landing/cso-learning-network-hero.webp"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(7,20,38,0.94)_0%,rgba(8,35,61,0.82)_48%,rgba(20,94,139,0.58)_76%,rgba(7,20,38,0.76)_100%)] lg:bg-[linear-gradient(90deg,rgba(7,20,38,0.98)_0%,rgba(8,29,51,0.92)_33%,rgba(16,65,99,0.40)_62%,rgba(7,20,38,0.10)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(7,20,38,0.72)_0%,transparent_30%,transparent_66%,rgba(7,20,38,0.70)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-[radial-gradient(circle_at_78%_42%,rgba(114,190,232,0.24),transparent_36%)] lg:block" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[48%] opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(90deg,transparent,black_38%,black)] lg:block" />
      <div aria-hidden="true" className="absolute -right-40 -top-56 -z-10 h-[680px] w-[680px] rounded-full bg-dec-blue/18 blur-3xl" />
      <div aria-hidden="true" className="absolute -left-28 top-20 -z-10 h-72 w-72 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -bottom-44 left-[42%] -z-10 h-96 w-96 rounded-full border-[56px] border-dec-blue/10" />
      <span aria-hidden="true" className="landing-hero-node absolute right-[17%] top-[23%] -z-10 hidden h-3 w-3 rounded-full border-2 border-white bg-dec-blue shadow-[0_0_0_9px_rgba(59,153,212,0.13)] lg:block" />
      <span aria-hidden="true" className="landing-hero-node landing-hero-node-delayed absolute bottom-[28%] right-[29%] -z-10 hidden h-2.5 w-2.5 rounded-full border-2 border-white bg-dec-green shadow-[0_0_0_8px_rgba(145,200,82,0.13)] lg:block" />

      <div className="flex w-full items-center px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32 lg:px-[clamp(3rem,5vw,6rem)] lg:pb-32 lg:pt-36">
        <div className="relative z-10 max-w-[760px]">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-dec-green shadow-[0_0_14px_rgba(145,200,82,0.45)]" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8fd0f4]">
              CSO Learning Hub
            </span>
          </div>
          <h1
            id="landing-hero-title"
            className="mt-6 max-w-[740px] font-display text-[clamp(2.65rem,4.25vw,4.75rem)] font-bold leading-[1.01] tracking-[-0.03em] text-white [text-shadow:0_4px_32px_rgba(7,20,38,0.38)]"
          >
            Practical learning for stronger local and grassroots CSOs
          </h1>
          <p className="mt-7 max-w-[670px] text-base leading-8 text-slate-100 [text-shadow:0_2px_16px_rgba(7,20,38,0.55)] sm:text-lg sm:leading-8">
            Work through realistic cases, guided activities, and adaptable tools built for the everyday realities of civil society work in Ethiopia. Study at your own pace and build shared capabilities.
          </p>

          <ul aria-label="Learning benefits" className="mt-7 grid max-w-[680px] grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-[#071426]/42 p-1 text-[0.68rem] font-extrabold uppercase tracking-[0.09em] text-white shadow-[0_16px_38px_rgba(7,20,38,0.18)] backdrop-blur-md sm:flex sm:w-fit sm:flex-wrap">
            {["Self-paced", "Practice-led", "Mobile-ready", "Certificate pathway"].map((benefit) => (
              <li className="flex min-h-10 items-center gap-2 rounded-xl px-3 py-2.5 sm:px-3.5" key={benefit}>
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-dec-green shadow-[0_0_0_3px_rgba(145,200,82,0.14)]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionButton className="min-w-[180px] border-[#63b8e8] shadow-[0_14px_30px_rgba(20,103,153,0.32)] hover:-translate-y-0.5" href="/courses" size="lg">
              Explore courses
              <ChevronRightIcon className="h-4 w-4" />
            </ActionButton>
            <ActionButton
              className="min-w-[190px] border-white/75 bg-[#071426]/34 text-white backdrop-blur-md hover:-translate-y-0.5 hover:border-white hover:bg-white/12 hover:text-white"
              href="/sign-in"
              size="lg"
              variant="outline"
            >
              Sign in and continue
            </ActionButton>
          </div>
        </div>
      </div>

      <svg aria-hidden="true" className="pointer-events-none absolute -bottom-px left-0 z-20 h-12 w-full text-white sm:h-16" preserveAspectRatio="none" viewBox="0 0 1440 72">
        <path d="M0 43C210 64 394 68 594 50C796 32 914 11 1118 18C1236 22 1338 34 1440 45V72H0V43Z" fill="currentColor" />
      </svg>
    </section>
  );
}

const displayTitles: Record<string, string> = {
  "Applying the Human Rights-Based Approach in CSO Practice": "Apply HRBA in Everyday CSO Project Work",
  "Governance and Leadership for Local CSOs": "Lead with Accountability and Clear Direction",
  "Project Management for Local and Grassroots CSOs": "Plan and Manage Local CSO Projects with Greater Clarity",
};

const featuredCourseIdentities = [
  {
    slugs: [
      "applying-human-rights-based-approach-in-cso-practice",
      "human-rights-based-approach-practice",
    ],
  },
  { slugs: ["project-management-local-grassroots-csos"] },
] as const;

function FeaturedCourseCard({ course, featured }: { course: PublicCatalogueCourseSummary; featured: boolean }) {
  const isAvailable = course.availability === "available";
  const requiresInvitation = course.accessState === "invitation_required";
  const displayTitle = displayTitles[course.title] ?? course.title;
  return (
    <article
      className={cx(
        "flex h-full flex-col overflow-hidden rounded-card border bg-white transition-all duration-300",
        featured
          ? "border-dec-blue shadow-card ring-1 ring-dec-blue/20"
          : "border-design-border shadow-soft hover:shadow-card hover:border-slate-300"
      )}
    >
      <div className="relative">
        <CourseCoverVisual
          capacityArea={course.primaryCapacityArea.name}
          compact
          imageAlt={course.imageAlt}
          imageUrl={course.imageUrl}
          title={course.title}
          tone={course.tone}
        />
        <div className="absolute right-4 top-4">
          <StatusBadge
            label={isAvailable ? "Available now" : "Coming soon"}
            tone={isAvailable ? "green" : "gray"}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-dec-blue">
          {course.primaryCapacityArea.name}
        </span>
        <h3 className="mt-3 text-xl font-bold leading-tight text-deep-navy">
          {displayTitle}
        </h3>
        {displayTitle !== course.title && (
          <p className="mt-2 text-xs leading-5 text-muted-text italic">
            Official title: {course.title}
          </p>
        )}
        <p className="mt-4 flex-1 text-sm leading-6 text-muted-text">
          {course.shortDescription}
        </p>
        {isAvailable ? (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-design-border pt-5 text-xs font-semibold text-muted-text">
            <span className="rounded-full bg-light-bg px-3 py-1.5">{course.duration}</span>
            {requiresInvitation && (
              <span className="rounded-full bg-[#fff4d8] px-3 py-1.5 text-[#8a5600]">
                Invitation required
              </span>
            )}
            <span className="rounded-full bg-soft-bg px-3 py-1.5 text-[#0f8f8c]">
              {course.certificateLabel}
            </span>
          </div>
        ) : (
          <p className="mt-6 border-t border-design-border pt-5 text-xs font-semibold text-muted-text italic">
            Duration and release date to be confirmed
          </p>
        )}
        <ActionButton
          aria-label={`${isAvailable ? "View" : "View course overview for"} ${course.title}`}
          className="mt-6 w-full"
          href={course.href}
          variant={featured ? "primary" : "secondary"}
        >
          {isAvailable ? "View course" : "View course overview"}
        </ActionButton>
      </div>
    </article>
  );
}

function FeaturedLearning({ courses }: { courses: PublicCatalogueCourseSummary[] }) {
  const shown = featuredCourseIdentities
    .map((identity) =>
      courses.find((course) =>
        identity.slugs.some((slug) => slug === course.slug),
      ),
    )
    .filter((course): course is PublicCatalogueCourseSummary => Boolean(course));

  if (process.env.NODE_ENV !== "production" && shown.length !== featuredCourseIdentities.length) {
    throw new Error("Featured learning requires both configured course summaries.");
  }

  return (
    <section className="bg-white py-14 sm:py-16" aria-labelledby="featured-learning-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <SectionEyebrow>Featured learning</SectionEyebrow>
            <h2 id="featured-learning-title" className="mt-4 font-display text-3xl font-bold leading-tight text-deep-navy">
              Start with the course available now
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-text">
              Explore the Human Rights-Based Approach course today. Review other confirmed course areas being prepared for future release.
            </p>
          </div>
          <ActionButton className="shrink-0 self-start" href="/courses" variant="secondary">
            Explore all courses
          </ActionButton>
        </div>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {shown.map((course) => (
            <FeaturedCourseCard
              course={course}
              featured={featuredCourseIdentities[0].slugs.some(
                (slug) => slug === course.slug,
              )}
              key={course.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CycleAnchor({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cx(
        "relative flex shrink-0 flex-col items-center justify-center rounded-full border border-dec-blue/25 bg-white text-center shadow-[0_18px_48px_rgba(15,23,42,0.14)]",
        compact ? "mx-auto h-44 w-44" : "h-56 w-56",
      )}
    >
      <span aria-hidden="true" className="absolute -inset-3 rounded-full border border-dashed border-soft-teal/35" />
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-deep-navy text-dec-green shadow-lg">
        <CycleIcon className="h-6 w-6" />
      </span>
      <span className="mt-4 text-[0.65rem] font-black uppercase tracking-[0.17em] text-soft-teal">
        Continuous
      </span>
      <span className="mt-1 max-w-[150px] font-display text-lg font-bold leading-tight text-deep-navy">
        Learning into action
      </span>
    </div>
  );
}

function LearningPathway() {
  const stages = [
    {
      num: "1",
      title: "Explore",
      desc: "Browse course overviews and access requirements before registering.",
      next: "Learn",
      icon: CompassIcon,
      position: "lg:col-start-1 lg:row-start-1",
      accent: "bg-dec-blue",
      iconStyle: "bg-[#eaf5fb] text-[#277ead]",
      badgeStyle: "bg-[#eaf5fb] text-[#226d9b]",
    },
    {
      num: "2",
      title: "Learn",
      desc: "Study key concepts and worked examples designed for local CSOs.",
      next: "Practice",
      icon: BookOpenIcon,
      position: "lg:col-start-2 lg:row-start-1",
      accent: "bg-soft-teal",
      iconStyle: "bg-[#e6f7f5] text-soft-teal",
      badgeStyle: "bg-[#e6f7f5] text-[#08716f]",
    },
    {
      num: "3",
      title: "Practice",
      desc: "Make choices in realistic project scenarios and receive guidance.",
      next: "Apply",
      icon: TargetIcon,
      position: "lg:col-start-2 lg:row-start-2",
      accent: "bg-dec-green",
      iconStyle: "bg-[#f0f8e7] text-[#5f8c2f]",
      badgeStyle: "bg-[#f0f8e7] text-[#537b29]",
    },
    {
      num: "4",
      title: "Apply",
      desc: "Download and adapt tools to your everyday program activities.",
      next: "Explore again",
      icon: ApplyIcon,
      position: "lg:col-start-1 lg:row-start-2",
      accent: "bg-restrained-amber",
      iconStyle: "bg-[#fff5df] text-[#b66b00]",
      badgeStyle: "bg-[#fff5df] text-[#8a5600]",
    },
  ];

  return (
    <section id="how-the-hub-works" className="relative scroll-mt-[72px] overflow-hidden border-y border-design-border bg-[#f4fbf7] py-16 sm:py-20 lg:py-24" aria-labelledby="pathway-title">
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-soft-teal/10" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dec-blue/10" />
      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <SectionEyebrow>How learning works</SectionEyebrow>
          </div>
          <h2 id="pathway-title" className="mt-4 font-display text-3xl font-bold leading-tight text-deep-navy sm:text-4xl">
            A clear path from access to application
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-text sm:text-base">
            Each course follows a practical cycle you can revisit as your organization&apos;s needs evolve.
          </p>
        </div>

        <div className="mt-10 lg:hidden">
          <CycleAnchor compact />
        </div>

        <div className="relative mt-10 lg:mt-16">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" preserveAspectRatio="none" viewBox="0 0 1200 560">
            <defs>
              <marker id="cycle-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#0f8f8c" />
              </marker>
            </defs>
            <path d="M350 105 C470 34 730 34 850 105" fill="none" markerEnd="url(#cycle-arrow)" stroke="#0f8f8c" strokeDasharray="7 9" strokeLinecap="round" strokeWidth="2" />
            <path d="M850 105 C1100 192 1100 368 850 455" fill="none" markerEnd="url(#cycle-arrow)" stroke="#0f8f8c" strokeDasharray="7 9" strokeLinecap="round" strokeWidth="2" />
            <path d="M850 455 C730 526 470 526 350 455" fill="none" markerEnd="url(#cycle-arrow)" stroke="#0f8f8c" strokeDasharray="7 9" strokeLinecap="round" strokeWidth="2" />
            <path d="M350 455 C100 368 100 192 350 105" fill="none" markerEnd="url(#cycle-arrow)" stroke="#0f8f8c" strokeDasharray="7 9" strokeLinecap="round" strokeWidth="2" />
          </svg>

          <ol aria-label="Four-stage continuous learning cycle" className="relative z-10 grid gap-5 md:grid-cols-2 lg:gap-x-[17rem] lg:gap-y-28">
            {stages.map((stage) => {
              const StageIcon = stage.icon;
              return (
                <li
                  className={cx(
                    "relative flex min-h-[210px] flex-col overflow-hidden rounded-panel border border-design-border bg-white p-6 shadow-card sm:p-7",
                    stage.position,
                  )}
                  key={stage.title}
                >
                  <span aria-hidden="true" className={cx("absolute inset-x-0 top-0 h-1", stage.accent)} />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", stage.iconStyle)}>
                        <StageIcon className="h-6 w-6" />
                      </span>
                      <div>
                        <span className={cx("inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em]", stage.badgeStyle)}>
                          Stage {stage.num}
                        </span>
                        <h3 className="mt-2 font-display text-2xl font-bold leading-none text-deep-navy">
                          {stage.title}
                        </h3>
                      </div>
                    </div>
                    <span className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white", stage.accent)}>
                      {stage.num}
                    </span>
                  </div>
                  <p className="mt-5 flex-1 text-sm leading-6 text-muted-text">
                    {stage.desc}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-design-border pt-4 text-xs font-bold text-soft-teal">
                    <span>Continue to {stage.next}</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <CycleAnchor />
          </div>
        </div>
      </div>
    </section>
  );
}

function CsoRealities() {
  const realities = [
    { title: "Practical and relevant", desc: "Anchored directly in the everyday requirements and constraints of grassroots CSOs." },
    { title: "Flexible and self-paced", desc: "Learn when workloads and internet connection speeds allow, with mobile-ready controls." },
    { title: "Individual progress records", desc: "Your personal progress, quiz scores, and eligible certificates stay linked to your account." },
    { title: "Safe and responsible learning", desc: "Practice safely in interactive scenarios without entering confidential project records." },
  ];

  return (
    <section className="bg-soft-bg py-14 sm:py-16" aria-labelledby="realities-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionEyebrow>Designed around CSO realities</SectionEyebrow>
            <h2 id="realities-title" className="mt-4 font-display text-3xl font-bold leading-tight text-deep-navy">
              Your organization already carries knowledge and experience
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-text">
              Finding time and internet continuity to transfer classroom training into shared practice is a common challenge. The Hub provides bite-sized, structured pathways to bridge this gap, putting your context and judgment first.
            </p>
          </div>
          
          <ul className="grid gap-4 sm:grid-cols-2">
            {realities.map((item) => (
              <li className="rounded-card border border-design-border bg-white p-6 shadow-soft" key={item.title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-soft-bg text-soft-teal">
                  <CompassIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-deep-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-text">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function OrgPracticeProgression() {
  const steps = [
    { num: "1", title: "Individual learning", desc: "Learners study concepts, pass final tests, and earn certificates privately." },
    { num: "2", title: "Team discussion", desc: "Take completed course tools and templates back to your colleagues for team review." },
    { num: "3", title: "Adapted practice", desc: "Refine and integrate the tool into your CSO's specific operational workflows." },
  ];

  return (
    <section className="bg-white py-14 sm:py-16" aria-labelledby="org-practice-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-light-bg text-dec-blue shadow-soft">
              <PeopleIcon className="h-7 w-7" />
            </span>
            <div className="mt-6">
              <SectionEyebrow>Individual to team</SectionEyebrow>
              <h2 id="org-practice-title" className="mt-4 font-display text-3xl font-bold leading-tight text-deep-navy">
                Bring the learning back to your team
              </h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-text">
              Each learner maintains an individual account. To build institutional capacity, review course outputs together, adapt templates to your own systems, and retain them for future staff continuity.
            </p>
            <p className="mt-3 text-xs font-semibold text-[#8a5600] italic">
              Note: Team discussions happen offline within your own team; online collaboration is planned for future phases.
            </p>
          </div>

          <ol className="space-y-4">
            {steps.map((item) => (
              <li className="flex gap-4 rounded-card border border-design-border bg-white p-5 shadow-soft" key={item.title}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-light-bg text-dec-blue font-sans text-sm font-black">
                  {item.num}
                </span>
                <div>
                  <h3 className="text-base font-bold text-deep-navy">{item.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-text">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function SafetyAccessibilityPanel() {
  const features = [
    { title: "Mobile-ready layout", desc: "Controls and columns resize cleanly for low-resolution phone screens." },
    { title: "Text-first accessibility", desc: "Key information loads immediately as text, keeping actions clear on slow networks." },
    { title: "No autoplay constraints", desc: "Video or audio media starts only when explicitly activated by the learner." },
    { title: "Privacy-conscious space", desc: "No survivor stories, names, or confidential documents are uploaded or recorded." },
  ];

  return (
    <section className="bg-light-bg border-y border-design-border py-14 sm:py-16" aria-labelledby="safety-assurance-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-soft-teal shadow-soft">
              <ShieldIcon className="h-7 w-7" />
            </span>
            <div className="mt-6">
              <SectionEyebrow>Safe participation</SectionEyebrow>
              <h2 id="safety-assurance-title" className="mt-4 font-display text-3xl font-bold leading-tight text-deep-navy">
                Designed for practical and safe online access
              </h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-text">
              The platform respects local connectivity realities. We prioritize lightweight structures, clear keyboard accessibility, and safe participant boundaries.
            </p>
            <ActionButton className="mt-6" href="/accessibility" variant="secondary">
              Accessibility guidance
            </ActionButton>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <li className="rounded-card border border-design-border bg-white p-5 shadow-soft" key={feature.title}>
                <h3 className="text-sm font-bold text-deep-navy">{feature.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-text">{feature.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function HomepageCTA() {
  return (
    <section className="bg-white px-5 py-14 sm:px-7 sm:py-16 lg:px-10" aria-labelledby="cta-section-title">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-card bg-deep-navy px-6 py-10 text-white sm:px-10 lg:px-12">
        <div aria-hidden="true" className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[28px] border-dec-blue/20" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#72bee8]">
              Ready to begin?
            </span>
            <h2 id="cta-section-title" className="mt-3 font-display text-3xl font-bold leading-tight text-white">
              Choose the course that supports your current work
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200">
              Browse the course catalogue to explore details and prerequisites. If you have been invited to join a cohort, use the registration link shared in your invitation email.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col shrink-0">
            <ActionButton href="/courses" size="md">
              Explore courses
            </ActionButton>
            <ActionButton
              className="border-white bg-white text-deep-navy hover:bg-slate-100"
              href="/sign-in"
              size="md"
              variant="secondary"
            >
              Sign in
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingPage({ courses = [] }: { courses?: PublicCatalogueCourseSummary[] }) {
  return (
    <div className="flex flex-col overflow-x-clip bg-light-bg">
      {/* 1. Hero */}
      <HomepageHero />

      {/* 2. Available Learning */}
      <FeaturedLearning courses={courses} />

      {/* 3. How Learning Works */}
      <LearningPathway />

      {/* 4. Designed Around CSO Realities */}
      <CsoRealities />

      {/* 5. Individual to Team Progression */}
      <OrgPracticeProgression />

      {/* 6. Trust, Accessibility and Safety */}
      <SafetyAccessibilityPanel />

      {/* 7. Final Call to Action */}
      <HomepageCTA />
    </div>
  );
}
