import Image from "next/image";
import { ActionButton, StatusBadge } from "@/components/ui";
import type { PublicCatalogueCourseSummary } from "@/lib/course-types";
import { cx } from "@/components/ui/utils";
import styles from "./LandingPage.module.css";

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

function SectionEyebrow({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cx("h-0.5 w-8 rounded-full", tone === "light" ? "bg-dec-green" : "bg-dec-blue")} />
      <span className={cx("text-xs font-extrabold uppercase leading-tight tracking-[0.16em]", tone === "light" ? "text-[#a8dcf7]" : "text-[#216f9d]")}>
        {children}
      </span>
    </div>
  );
}

function HomepageHero() {
  return (
    <section className="relative isolate flex min-h-[810px] w-full items-start overflow-hidden bg-[#071426] text-white sm:min-h-[clamp(680px,82vh,720px)] sm:items-center" aria-labelledby="landing-hero-title">
      <div className="absolute inset-x-0 bottom-0 -z-30 h-[52%] sm:inset-0 sm:h-auto">
        <Image
          alt="Illustration of Ethiopian CSO practitioners with diverse abilities co-creating a community plan around a table."
          className="landing-hero-art object-cover object-[68%_center] sm:object-[66%_center] lg:object-[68%_center] xl:object-[70%_center]"
          fill
          priority
          sizes="100vw"
          src="/images/landing/cso-collaborative-planning-hero.webp"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#071426_0%,rgba(7,20,38,0.99)_50%,rgba(7,20,38,0.76)_68%,rgba(7,20,38,0.20)_100%)] sm:bg-[linear-gradient(90deg,rgba(7,20,38,0.99)_0%,rgba(7,20,38,0.96)_38%,rgba(7,20,38,0.68)_56%,rgba(7,20,38,0.22)_78%,rgba(7,20,38,0.08)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(7,20,38,0.18)_0%,transparent_32%,transparent_72%,rgba(7,20,38,0.46)_100%)]" />

      <div className="flex w-full items-center px-5 pb-20 pt-[7.75rem] sm:px-8 sm:pb-24 sm:pt-28 lg:px-[clamp(3rem,5vw,6rem)] lg:pb-24 lg:pt-28 xl:pt-32">
        <div className="relative z-10 max-w-[680px]">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-dec-green shadow-[0_0_14px_rgba(145,200,82,0.45)]" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8fd0f4]">
              CSO Learning Hub
            </span>
          </div>
          <h1
            id="landing-hero-title"
            className="mt-4 max-w-[620px] font-display text-[clamp(2.15rem,9.5vw,2.4rem)] font-bold leading-[1.02] tracking-[-0.028em] text-white [text-shadow:0_4px_28px_rgba(7,20,38,0.42)] sm:mt-5 sm:max-w-[500px] sm:text-[clamp(2.65rem,4vw,4.35rem)] sm:leading-[0.99] xl:max-w-[620px]"
          >
            Practical learning for stronger local and grassroots CSOs
          </h1>
          <p className="mt-4 max-w-[600px] text-base leading-7 text-white [text-shadow:0_2px_14px_rgba(7,20,38,0.72)] sm:mt-5 sm:max-w-[560px] lg:text-[1.0625rem] lg:leading-8 xl:max-w-[600px]">
            Work through realistic cases, guided activities, and adaptable tools built for the everyday realities of civil society work in Ethiopia. Study at your own pace and build shared capabilities.
          </p>

          <ul aria-label="Learning benefits" className="mt-4 grid max-w-[660px] grid-cols-2 overflow-hidden rounded-2xl border border-white/20 bg-[#071426]/64 p-1.5 text-xs font-extrabold uppercase leading-4 tracking-[0.065em] text-white shadow-[0_14px_34px_rgba(7,20,38,0.24)] backdrop-blur-md sm:mt-5 sm:flex sm:w-fit sm:flex-wrap">
            {["Self-paced", "Practice-led", "Mobile-ready", "Certificate pathway"].map((benefit) => (
              <li className="flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2.5 sm:px-3.5" key={benefit}>
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-dec-green shadow-[0_0_0_3px_rgba(145,200,82,0.18)]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row">
            <ActionButton className="min-w-[180px] border-[#63b8e8] tracking-[-0.01em] shadow-[0_14px_30px_rgba(20,103,153,0.32)] hover:-translate-y-0.5" href="/courses" size="lg">
              Explore courses
              <ChevronRightIcon className="h-4 w-4" />
            </ActionButton>
            <ActionButton
              className="min-w-[190px] border-white/75 bg-[#071426]/58 tracking-[-0.01em] text-white backdrop-blur-md hover:-translate-y-0.5 hover:border-white hover:bg-white/12 hover:text-white"
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
    image: {
      alt: "Illustrated CSO practitioners collaborating through dialogue, community planning, and inclusive local action.",
      objectPosition: "object-[50%_48%]",
      src: "/images/courses/thumbnails/course-hrba-practice-thumbnail.webp",
    },
    slugs: [
      "applying-human-rights-based-approach-in-cso-practice",
      "human-rights-based-approach-practice",
    ],
  },
  {
    image: {
      alt: "Illustrated CSO teams mapping a project pathway from community needs through planning, monitoring, and results.",
      objectPosition: "object-center",
      src: "/images/courses/thumbnails/course-project-management-thumbnail.webp",
    },
    slugs: ["project-management-local-grassroots-csos"],
  },
] as const;

function FeaturedCourseCard({
  course,
  featured,
  image,
}: {
  course: PublicCatalogueCourseSummary;
  featured: boolean;
  image: (typeof featuredCourseIdentities)[number]["image"];
}) {
  const isAvailable = course.availability === "available";
  const requiresInvitation = course.accessState === "invitation_required";
  const displayTitle = displayTitles[course.title] ?? course.title;
  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] focus-within:border-dec-blue focus-within:ring-2 focus-within:ring-dec-blue/35 motion-reduce:transform-none motion-reduce:transition-none lg:grid lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] lg:items-stretch xl:flex"
    >
      <div className="bg-[#f4f7f5] lg:flex lg:h-full lg:items-center lg:p-5 xl:block xl:h-auto xl:p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 sm:aspect-[2/1] lg:aspect-video xl:aspect-[1.95/1]">
          <Image
            alt={image.alt}
            className={cx(
              "object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none",
              image.objectPosition,
            )}
            fill
            sizes="(min-width: 1280px) 560px, (min-width: 1024px) 40vw, calc(100vw - 2.5rem)"
            src={image.src}
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="max-w-[70%] text-xs font-extrabold uppercase leading-5 tracking-[0.12em] text-[#216f9d]">
            {course.primaryCapacityArea.name}
          </span>
          <div className="shrink-0 [&>span]:min-h-8 [&>span]:whitespace-nowrap [&>span]:text-[0.8125rem]">
            <StatusBadge
              label={isAvailable ? "Available now" : "Coming soon"}
              tone={isAvailable ? "green" : "gray"}
            />
          </div>
        </div>
        <h3 className="landing-card-heading mt-2.5 max-w-[28rem] text-deep-navy">
          {displayTitle}
        </h3>
        {displayTitle !== course.title && (
          <p className="mt-1.5 text-sm leading-6 text-[#526477]">
            Official title: {course.title}
          </p>
        )}
        <p className="landing-card-copy mt-3 flex-1 text-muted-text">
          {course.shortDescription}
        </p>
        {isAvailable ? (
          <div className="mt-4 flex min-h-12 flex-wrap content-start gap-2 border-t border-design-border pt-3.5 text-[0.8125rem] font-medium text-[#47596b]">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">{course.duration}</span>
            {requiresInvitation && (
              <span className="rounded-full border border-[#f2d497] bg-[#fff8e8] px-3 py-1.5 text-[#80520a]">
                Invitation required
              </span>
            )}
            <span className="rounded-full border border-[#bfe6d1] bg-[#eefaf3] px-3 py-1.5 text-[#0b766f]">
              {course.certificateLabel}
            </span>
          </div>
        ) : (
          <p className="mt-4 min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-5 text-[#536475]">
            Duration and release date to be confirmed
          </p>
        )}
        <ActionButton
          aria-label={`${isAvailable ? "View" : "View course overview for"} ${course.title}`}
          className="mt-4 w-full text-[0.95rem] tracking-[-0.01em] active:translate-y-px"
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
    .flatMap((identity) => {
      const course = courses.find((candidate) =>
        identity.slugs.some((slug) => slug === candidate.slug),
      );
      return course ? [{ course, identity }] : [];
    });

  if (process.env.NODE_ENV !== "production" && shown.length !== featuredCourseIdentities.length) {
    throw new Error("Featured learning requires both configured course summaries.");
  }

  return (
    <section id="featured-learning" className={cx("scroll-mt-24 bg-white", styles.sectionCompact)} aria-labelledby="featured-learning-title">
      <div className={styles.pageContainer}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
          <div className="max-w-[680px]">
            <SectionEyebrow>Featured learning</SectionEyebrow>
            <h2 id="featured-learning-title" className="mt-4 max-w-none font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.022em] text-deep-navy [text-wrap:balance] sm:mt-5 sm:whitespace-nowrap sm:text-[clamp(2.125rem,3.1vw,2.75rem)] sm:leading-[1.07] sm:[text-wrap:nowrap]">
              Start with the course available now
            </h2>
            <p className="landing-section-copy mt-5 max-w-[640px] text-muted-text">
              Explore the Human Rights-Based Approach course today. Review other confirmed course areas being prepared for future release.
            </p>
          </div>
          <ActionButton className="w-fit shrink-0 text-[0.95rem] tracking-[-0.01em] active:translate-y-px" href="/courses" variant="secondary">
            Explore all courses
          </ActionButton>
        </div>
        
        <div className="mt-9 grid items-stretch gap-7 sm:mt-10 xl:grid-cols-2">
          {shown.map(({ course, identity }, index) => (
            <FeaturedCourseCard
              course={course}
              featured={index === 0}
              image={identity.image}
              key={course.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const learningStages = [
  {
    num: "1",
    title: "Explore",
    desc: "Find the course and pathway that match your current work.",
    icon: CompassIcon,
    position: "col-start-1 row-start-1",
    markerPosition: "-right-3 top-7",
    accent: "bg-dec-blue",
    border: "border-[#b9dff3]",
    iconStyle: "bg-[#eaf5fb] text-[#277ead]",
    badgeStyle: "bg-[#eaf5fb] text-[#226d9b]",
  },
  {
    num: "2",
    title: "Learn",
    desc: "Build practical understanding through clear concepts and examples.",
    icon: BookOpenIcon,
    position: "col-start-2 row-start-1",
    markerPosition: "-left-3 top-7",
    accent: "bg-soft-teal",
    border: "border-[#a9ddd8]",
    iconStyle: "bg-[#e6f7f5] text-soft-teal",
    badgeStyle: "bg-[#e6f7f5] text-[#08716f]",
  },
  {
    num: "3",
    title: "Practise",
    desc: "Test choices in realistic CSO situations and receive guidance.",
    icon: TargetIcon,
    position: "col-start-2 row-start-2",
    markerPosition: "-left-3 top-7",
    accent: "bg-dec-green",
    border: "border-[#c9e4aa]",
    iconStyle: "bg-[#f0f8e7] text-[#5f8c2f]",
    badgeStyle: "bg-[#f0f8e7] text-[#537b29]",
  },
  {
    num: "4",
    title: "Apply",
    desc: "Adapt tools and learning to your organization’s everyday work.",
    icon: ApplyIcon,
    position: "col-start-1 row-start-2",
    markerPosition: "-right-3 top-7",
    accent: "bg-restrained-amber",
    border: "border-[#f1d498]",
    iconStyle: "bg-[#fff5df] text-[#b66b00]",
    badgeStyle: "bg-[#fff5df] text-[#8a5600]",
  },
] as const;

function CycleAnchor({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cx(
        "relative isolate flex shrink-0 flex-col items-center justify-center rounded-full border border-dec-blue/35 bg-white text-center shadow-[0_24px_58px_rgba(15,23,42,0.20)] before:absolute before:inset-[7px] before:-z-10 before:rounded-full before:border before:border-slate-100",
        compact ? "mx-auto h-40 w-40" : "h-44 w-44 lg:h-48 lg:w-48",
      )}
    >
      <span aria-hidden="true" className="absolute -inset-3 rounded-full border border-dashed border-soft-teal/55" />
      <span aria-hidden="true" className="absolute -inset-7 rounded-full border border-dec-blue/15" />
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-deep-navy text-dec-green shadow-[0_12px_26px_rgba(15,23,42,0.26)] ring-4 ring-[#edf7f4]">
        <CycleIcon className="h-5 w-5" />
      </span>
      <span className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-soft-teal">
        Continuous
      </span>
      <span className="mt-1 max-w-[138px] font-display text-[1.18rem] font-bold leading-[1.03] tracking-[-0.018em] text-deep-navy lg:text-xl">
        Learning into action
      </span>
    </div>
  );
}

function LearningStageCard({
  compact = false,
  stage,
}: {
  compact?: boolean;
  stage: (typeof learningStages)[number];
}) {
  const StageIcon = stage.icon;
  const markerIsOnLeft = stage.num === "2" || stage.num === "3";
  return (
    <li
      className={cx(
        "relative z-10 flex flex-col rounded-[24px] border bg-white shadow-[0_18px_38px_rgba(15,23,42,0.12)] after:pointer-events-none after:absolute after:inset-[4px] after:rounded-[19px] after:border after:border-slate-100",
        compact ? "min-h-[145px] p-4" : "min-h-0 p-5 lg:p-6",
        !compact && stage.position,
        stage.border,
      )}
    >
      <span aria-hidden="true" className={cx("absolute inset-x-4 top-0 h-1 rounded-b-full", stage.accent)} />
      <div className={cx("relative z-10 flex items-center gap-3 pr-10", !compact && markerIsOnLeft && "pl-4")}>
        <span className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72)]", stage.iconStyle)}>
          <StageIcon className="h-5 w-5" />
        </span>
        <div>
          <span className={cx("inline-flex rounded-full px-2 py-0.5 text-[0.7rem] font-extrabold uppercase tracking-[0.11em]", stage.badgeStyle)}>
            Stage {stage.num}
          </span>
          <h3 className="mt-1.5 font-display text-[1.45rem] font-bold leading-none tracking-[-0.018em] text-deep-navy">
            {stage.title}
          </h3>
        </div>
      </div>
      <span
        aria-hidden="true"
        className={cx(
          "absolute z-20 flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold text-deep-navy shadow-[0_7px_16px_rgba(15,23,42,0.18)] ring-4 ring-[#f4fbf7]",
          compact ? "right-4 top-4" : stage.markerPosition,
          stage.accent,
        )}
      >
        {stage.num}
      </span>
      <p className="relative z-10 mt-4 text-[0.95rem] leading-6 text-muted-text">
        {stage.desc}
      </p>
    </li>
  );
}

function LearningPathway() {
  return (
    <section id="how-the-hub-works" className={cx("relative scroll-mt-24 overflow-hidden border-y border-design-border bg-[#f4fbf7]", styles.sectionCompact)} aria-labelledby="pathway-title">
      <div aria-hidden="true" className="absolute -left-40 top-24 h-[440px] w-[440px] rounded-full border border-soft-teal/10" />
      <div aria-hidden="true" className="absolute -right-32 bottom-10 h-[360px] w-[360px] rounded-full border border-dec-blue/10" />
      <div className={cx("relative", styles.pageContainer)}>
        <div className="mx-auto max-w-[760px] text-center">
          <div className="flex justify-center">
            <SectionEyebrow>How learning works</SectionEyebrow>
          </div>
          <h2 id="pathway-title" className="landing-section-heading mt-5 text-deep-navy">
            A clear path from access to application
          </h2>
          <p className="landing-section-copy mx-auto mt-5 max-w-xl text-muted-text">
            Each course follows a practical cycle you can revisit as your organization&apos;s needs evolve.
          </p>
        </div>

        <div className="relative mt-10 grid gap-7 xl:grid-cols-[minmax(0,1.58fr)_minmax(340px,0.92fr)] xl:items-stretch">
          <div className="relative hidden min-h-[640px] overflow-hidden rounded-[30px] border border-soft-teal/25 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.98)_0%,rgba(244,251,247,0.90)_46%,rgba(233,247,240,0.94)_100%)] shadow-[0_22px_58px_rgba(15,23,42,0.10)] md:block lg:min-h-[660px]">
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 720 620">
              <defs>
                <marker id="cycle-arrow-connected" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#0f8f8c" />
                </marker>
              </defs>
              <ellipse cx="360" cy="310" fill="none" rx="244" ry="228" stroke="#0f8f8c" strokeOpacity="0.12" strokeWidth="1.5" />
              <ellipse cx="360" cy="310" fill="none" rx="180" ry="166" stroke="#3b99d4" strokeOpacity="0.12" />
              <ellipse className={styles.cyclePath} cx="360" cy="310" fill="none" rx="210" ry="196" stroke="#0f8f8c" strokeDasharray="9 11" strokeLinecap="round" strokeOpacity="0.82" strokeWidth="2.8" />
              <path d="M270 126 C315 100 405 100 450 126" fill="none" markerEnd="url(#cycle-arrow-connected)" stroke="#0f8f8c" strokeLinecap="round" strokeOpacity="0.9" strokeWidth="2.2" />
              <path d="M558 248 C576 284 576 336 558 372" fill="none" markerEnd="url(#cycle-arrow-connected)" stroke="#0f8f8c" strokeLinecap="round" strokeOpacity="0.9" strokeWidth="2.2" />
              <path d="M450 494 C405 520 315 520 270 494" fill="none" markerEnd="url(#cycle-arrow-connected)" stroke="#0f8f8c" strokeLinecap="round" strokeOpacity="0.9" strokeWidth="2.2" />
              <path d="M162 372 C144 336 144 284 162 248" fill="none" markerEnd="url(#cycle-arrow-connected)" stroke="#0f8f8c" strokeLinecap="round" strokeOpacity="0.9" strokeWidth="2.2" />
            </svg>

            <ol aria-label="Four-stage continuous learning cycle" className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-x-24 gap-y-32 p-7 lg:p-8">
              {learningStages.map((stage) => (
                <LearningStageCard key={stage.title} stage={stage} />
              ))}
            </ol>

            <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
              <CycleAnchor />
            </div>
          </div>

          <div className="relative mt-20 rounded-[28px] border border-soft-teal/25 bg-[#eef8f2] px-4 pb-4 pt-24 shadow-[0_20px_52px_rgba(15,23,42,0.10)] md:hidden">
            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
              <CycleAnchor compact />
            </div>
            <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-16 h-28 w-full" preserveAspectRatio="none" viewBox="0 0 340 112">
              <path className={styles.cyclePath} d="M170 0 C170 54 36 38 36 112" fill="none" stroke="#0f8f8c" strokeDasharray="8 10" strokeLinecap="round" strokeOpacity="0.6" strokeWidth="2" />
            </svg>
            <div className="relative mt-2">
              <span aria-hidden="true" className={cx("absolute bottom-12 left-[2.2rem] top-12 w-0.5 opacity-55", styles.mobileCycleSpine)} />
              <ol aria-label="Four-stage continuous learning cycle" className="relative space-y-4">
                {learningStages.map((stage) => (
                  <LearningStageCard compact key={stage.title} stage={stage} />
                ))}
              </ol>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 rounded-full border border-soft-teal/25 bg-white px-4 py-2.5 text-sm font-semibold leading-5 text-soft-teal shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
              <CycleIcon className="h-4 w-4" />
              <span>The cycle continues from Apply back to Explore.</span>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#071426] p-5 text-white shadow-[0_20px_54px_rgba(7,20,38,0.18)] sm:p-7 md:grid md:grid-cols-[0.78fr_1.22fr] md:items-center md:gap-8 lg:p-8 xl:flex xl:min-h-[660px] xl:flex-col xl:justify-center" aria-labelledby="hub-video-preview-title">
            <span aria-hidden="true" className="absolute -right-24 -top-28 h-64 w-64 rounded-full border-[24px] border-dec-blue/12" />
            <span aria-hidden="true" className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-soft-teal/10 blur-2xl" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-dec-green/25 bg-dec-green/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[#c5ed98]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-dec-green" />
                Video coming soon
              </span>
              <h3 id="hub-video-preview-title" className="mt-5 max-w-md font-display text-[clamp(1.8rem,3vw,2.45rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
                Introduction to the CSO Learning Hub
              </h3>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-200">
                A future short video will introduce the learning approach and guide learners through the platform journey.
              </p>
            </div>

            <div className={cx("relative z-10 mt-7 aspect-video w-full overflow-hidden rounded-[22px] border border-white/15 shadow-[0_18px_36px_rgba(0,0,0,0.28)] md:mt-0 xl:mt-8", styles.videoPoster)} aria-label="Non-interactive preview for a future CSO Learning Hub introduction video" role="img">
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-55" preserveAspectRatio="none" viewBox="0 0 640 360">
                <path d="M-30 278 C96 178 188 326 302 212 S512 70 688 150" fill="none" stroke="#72bee8" strokeDasharray="8 12" strokeLinecap="round" strokeWidth="3" />
                <path d="M-20 320 C118 224 210 350 330 248 S534 118 674 190" fill="none" stroke="#91c852" strokeOpacity="0.68" strokeWidth="2" />
                <circle cx="112" cy="245" fill="#3b99d4" r="8" />
                <circle cx="312" cy="210" fill="#91c852" r="8" />
                <circle cx="520" cy="118" fill="#f59e0b" r="8" />
              </svg>
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,38,0.02),rgba(7,20,38,0.38))]" />
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/12 text-white shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                <svg className="ml-1 h-8 w-8" fill="none" viewBox="0 0 32 32">
                  <path d="M11 8.6v14.8L23 16 11 8.6Z" fill="currentColor" />
                </svg>
              </span>
              <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-[#071426]/78 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                Platform introduction preview
              </span>
            </div>
          </aside>
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
    <section className={cx("relative overflow-hidden bg-[#f7f3ea]", styles.sectionStandard)} aria-labelledby="realities-title">
      <div aria-hidden="true" className="absolute -left-48 top-12 h-[420px] w-[420px] rounded-full border border-[#d8cdb8]/55" />
      <div aria-hidden="true" className="absolute -left-32 top-28 h-[290px] w-[290px] rounded-full border border-[#d8cdb8]/40" />
      <div className={cx("relative", styles.pageContainer)}>
        <div className={cx("grid lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:items-center", styles.contentGap)}>
          <div className="max-w-[32rem]">
            <SectionEyebrow>Designed around CSO realities</SectionEyebrow>
            <h2 id="realities-title" className="landing-section-heading mt-5 max-w-[12ch] text-deep-navy">
              Your organization already carries knowledge and experience
            </h2>
            <div aria-hidden="true" className="mt-7 flex items-center gap-3">
              <span className="h-px w-20 bg-[#b99f70]" />
              <span className="h-2 w-2 rounded-full bg-restrained-amber" />
            </div>
            <p className="landing-section-copy mt-7 max-w-[31rem] text-muted-text">
              Finding time and internet continuity to transfer classroom training into shared practice is a common challenge. The Hub provides bite-sized, structured pathways to bridge this gap, putting your context and judgment first.
            </p>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-[#ded1bd] bg-white shadow-[0_24px_64px_rgba(65,52,32,0.12)]">
            <ul className="divide-y divide-[#e8e0d3]">
              {realities.map((item, index) => (
                <li className={cx("grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2 odd:bg-[#fffdf9] sm:grid-cols-[auto_minmax(11rem,0.76fr)_minmax(0,1fr)] sm:gap-x-7", styles.cardPadding)} key={item.title}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#cfe4df] bg-[#eaf6f2] font-sans text-[0.78rem] font-extrabold tracking-[0.08em] text-soft-teal shadow-[0_6px_16px_rgba(21,142,140,0.08)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="landing-ui-card-heading pt-2 text-deep-navy sm:pt-2.5 sm:text-[1.1rem]">{item.title}</h3>
                  <p className="landing-ui-card-copy col-start-2 text-muted-text sm:col-start-3 sm:pt-1.5">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 z-10 flex translate-x-[-50%] translate-y-1/2 flex-col items-center">
        <span className="h-8 w-px bg-gradient-to-b from-[#b99f70] to-[#64b6df]" />
        <span className="h-2.5 w-2.5 rounded-full border-2 border-[#f7f3ea] bg-dec-blue shadow-[0_0_0_4px_rgba(100,182,223,0.16)]" />
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
    <section className={cx("relative overflow-hidden bg-deep-navy text-white", styles.sectionStandard)} aria-labelledby="org-practice-title">
      <div aria-hidden="true" className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border-[42px] border-dec-blue/10" />
      <div aria-hidden="true" className="absolute -bottom-48 left-[18%] h-80 w-80 rounded-full bg-soft-teal/10 blur-3xl" />
      <div className={cx("relative", styles.pageContainer)}>
        <div className={cx("grid lg:grid-cols-[0.9fr_1.1fr] lg:items-end", styles.contentGap)}>
          <div className="max-w-[38rem]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-[#8fd0f4] shadow-[0_14px_30px_rgba(0,0,0,0.18)]">
              <PeopleIcon className="h-7 w-7" />
            </span>
            <div className="mt-6">
              <SectionEyebrow tone="light">Individual to team</SectionEyebrow>
              <h2 id="org-practice-title" className="landing-section-heading mt-5 text-white">
                Bring the learning back to your team
              </h2>
            </div>
          </div>
          <div>
            <p className="landing-section-copy max-w-[42rem] text-slate-200">
              Each learner maintains an individual account. To build institutional capacity, review course outputs together, adapt templates to your own systems, and retain them for future staff continuity.
            </p>
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[30px] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.035))] shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
          <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-[3.7rem] hidden h-px bg-gradient-to-r from-[#64b6df]/25 via-[#64b6df]/75 to-[#64b6df]/25 lg:block" />
          <span aria-hidden="true" className="absolute left-1/3 top-[3.25rem] z-20 hidden h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-[#64b6df]/45 bg-[#132b43] text-[#8fd0f4] lg:flex">
            <ChevronRightIcon className="h-2.5 w-2.5" />
          </span>
          <span aria-hidden="true" className="absolute left-2/3 top-[3.25rem] z-20 hidden h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-[#64b6df]/45 bg-[#132b43] text-[#8fd0f4] lg:flex">
            <ChevronRightIcon className="h-2.5 w-2.5" />
          </span>
          <ol className="relative grid before:absolute before:bottom-8 before:left-[2.75rem] before:top-8 before:w-px before:bg-gradient-to-b before:from-[#64b6df]/70 before:to-[#64b6df]/15 lg:grid-cols-3 lg:divide-x lg:divide-white/10 lg:before:hidden">
              {steps.map((item) => (
                <li className={cx("relative grid grid-cols-[auto_1fr] gap-4 border-b border-white/10 last:border-b-0 lg:block lg:min-h-[14rem] lg:border-b-0", styles.cardPadding)} key={item.title}>
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-[#18334d] bg-dec-blue font-sans text-sm font-extrabold text-deep-navy shadow-[0_8px_20px_rgba(0,0,0,0.22)] lg:h-14 lg:w-14">
                    {item.num}
                  </span>
                  <div className="lg:mt-6">
                    <h3 className="landing-ui-card-heading text-white lg:text-[1.1rem]">{item.title}</h3>
                    <p className="landing-ui-card-copy mt-2 max-w-[21rem] text-slate-200">{item.desc}</p>
                  </div>
                </li>
              ))}
          </ol>
          <div className="border-t border-white/10 bg-white/[0.035] px-5 py-5 sm:px-8">
            <div className="flex max-w-[62rem] items-start gap-3.5">
              <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-restrained-amber/35 bg-restrained-amber/10 text-restrained-amber">
                <ApplyIcon className="h-4 w-4" />
              </span>
              <p className="text-[0.95rem] font-medium leading-6 text-slate-200">
                <span className="font-bold text-[#f2c76f]">Note:</span> Team discussions happen offline within your own team; online collaboration is planned for future phases.
              </p>
            </div>
          </div>
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
    <section className={cx("border-y border-design-border bg-[#eef8f2]", styles.sectionStandard)} aria-labelledby="safety-assurance-title">
      <div className={styles.pageContainer}>
        <div className="grid overflow-hidden rounded-[32px] border border-soft-teal/25 bg-white shadow-[0_24px_64px_rgba(15,76,92,0.11)] lg:grid-cols-[0.88fr_1.12fr]">
          <div className={cx("relative flex flex-col overflow-hidden bg-[#0b4c5c] text-white", styles.cardPadding)}>
            <span aria-hidden="true" className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full border-[28px] border-white/5" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#b9e985] shadow-[0_14px_28px_rgba(0,0,0,0.15)]">
              <ShieldIcon className="h-7 w-7" />
            </span>
            <div className="relative mt-6">
              <SectionEyebrow tone="light">Safe participation</SectionEyebrow>
              <h2 id="safety-assurance-title" className="mt-5 max-w-[12ch] font-display text-[clamp(2rem,3.2vw,3.2rem)] font-bold leading-[1.07] tracking-[-0.025em] text-white [text-wrap:balance]">
                Designed for practical and safe online access
              </h2>
            </div>
            <p className="relative mt-5 max-w-[32rem] text-[1rem] leading-7 text-slate-100 sm:text-[1.02rem] sm:leading-8">
              The platform respects local connectivity realities. We prioritize lightweight structures, clear keyboard accessibility, and safe participant boundaries.
            </p>
            <ActionButton className="relative mt-7 min-h-12 self-start border-white bg-white px-6 text-deep-navy shadow-[0_10px_24px_rgba(0,0,0,0.14)] hover:bg-slate-100 lg:mt-8" href="/accessibility" variant="secondary">
              Accessibility guidance
            </ActionButton>
          </div>

          <ul className="grid bg-[#fbfdfc] sm:grid-cols-2">
            {features.map((feature, index) => (
              <li className={cx("relative flex flex-col justify-center border-b border-design-border odd:bg-white last:border-b-0 sm:min-h-[15rem] sm:[&:nth-child(odd)]:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 lg:min-h-0", styles.cardPadding)} key={feature.title}>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d9ece7] bg-[#e9f5f1] font-sans text-xs font-extrabold tracking-[0.06em] text-soft-teal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-soft-teal/35 to-transparent" />
                </div>
                <h3 className="landing-ui-card-heading mt-5 text-deep-navy sm:text-[1.08rem]">{feature.title}</h3>
                <p className="landing-ui-card-copy mt-2 max-w-[28rem] text-muted-text">{feature.desc}</p>
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
    <section className="relative bg-[linear-gradient(180deg,#f7f3ea_0%,#f7f3ea_52%,#071426_52%,#071426_100%)] pb-10 pt-16 sm:pb-12 sm:pt-20 lg:pb-14 lg:pt-24" aria-labelledby="cta-section-title">
      <div aria-hidden="true" className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="h-8 w-px bg-gradient-to-b from-soft-teal/45 to-dec-blue" />
        <span className="h-2.5 w-2.5 rounded-full border-2 border-[#f7f3ea] bg-dec-blue shadow-[0_0_0_4px_rgba(59,153,212,0.14)]" />
      </div>
      <div className={styles.pageContainer}>
        <div className="relative overflow-hidden rounded-[36px] border border-white/15 bg-deep-navy px-6 py-10 text-white shadow-[0_30px_80px_rgba(7,20,38,0.30)] ring-1 ring-deep-navy/5 sm:min-h-[410px] sm:px-10 sm:py-12 lg:flex lg:items-center lg:px-16 lg:py-14">
          <div aria-hidden="true" className="absolute -right-24 -top-40 h-96 w-96 rounded-full border-[42px] border-dec-blue/16" />
          <div aria-hidden="true" className="absolute -bottom-52 left-[38%] h-80 w-80 rounded-full bg-soft-teal/10 blur-3xl" />
          <svg aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[46%] opacity-50 md:block" preserveAspectRatio="none" viewBox="0 0 620 430">
            <path d="M50 352 C170 256 242 364 350 242 S536 88 676 162" fill="none" stroke="#3b99d4" strokeDasharray="8 12" strokeLinecap="round" strokeWidth="2.5" />
            <path d="M18 395 C154 292 258 414 382 291 S552 154 668 212" fill="none" stroke="#91c852" strokeOpacity="0.55" strokeWidth="2" />
            <circle cx="190" cy="310" fill="#3b99d4" r="7" />
            <circle cx="382" cy="291" fill="#91c852" r="7" />
            <circle cx="540" cy="164" fill="#f59e0b" r="7" />
          </svg>

          <div className="relative grid w-full gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.34fr)] lg:items-center lg:gap-14">
            <div>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-0.5 w-9 rounded-full bg-dec-green" />
                <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#9bd7f6]">
                  Ready to begin?
                </span>
              </div>
              <h2 id="cta-section-title" className="mt-5 max-w-[48rem] font-display text-[2.15rem] font-bold leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] sm:mt-6 sm:text-[clamp(2.7rem,4.4vw,4rem)] sm:leading-[1.02]">
                Choose the course that supports your current work
              </h2>
              <p className="landing-section-copy mt-6 max-w-[41rem] text-slate-100 sm:mt-7">
                Browse the course catalogue to explore details and prerequisites. If you have been invited to join a cohort, use the registration link shared in your invitation email.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:max-w-[30rem] sm:flex-row lg:max-w-none lg:flex-col lg:rounded-[24px] lg:border lg:border-white/10 lg:bg-white/[0.045] lg:p-4 lg:shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
              <ActionButton className="min-h-14 w-full min-w-[13rem] tracking-[-0.01em] shadow-[0_14px_30px_rgba(20,103,153,0.32)]" href="/courses" size="lg">
                Explore courses
              </ActionButton>
              <ActionButton
                className="min-h-14 w-full min-w-[13rem] border-white/70 bg-transparent tracking-[-0.01em] text-white hover:border-white hover:bg-white/10 hover:text-white"
                href="/sign-in"
                size="lg"
                variant="outline"
              >
                Sign in
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingPage({ courses = [] }: { courses?: PublicCatalogueCourseSummary[] }) {
  return (
    <div className={cx("flex flex-col overflow-x-clip bg-light-bg", styles.pageRhythm)}>
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
