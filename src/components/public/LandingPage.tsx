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

const ClockIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProgressIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M5 19V9m7 10V5m7 14v-7" strokeLinecap="round" />
    <path d="M3 19.5h18" strokeLinecap="round" />
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

function SectionEyebrow({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <div className={cx("flex items-center gap-2.5", centered && "justify-center")}>
      <span className="h-1 w-7 rounded-full bg-dec-blue" />
      <span className="text-xs font-black uppercase tracking-[0.18em] text-dec-blue">
        {children}
      </span>
    </div>
  );
}

function HomepageHero() {
  return (
    <section className="relative overflow-hidden border-b-4 border-dec-green bg-deep-navy text-white" aria-labelledby="landing-hero-title">
      <Image
        alt="Four Ethiopian CSO practitioners collaborate at a meeting room table review."
        className="object-cover object-[70%_center] sm:object-[66%_center] lg:object-center"
        fill
        priority
        sizes="100vw"
        src="/images/landing/cso-planning-hero.png"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.91)_0%,rgba(15,23,42,0.82)_42%,rgba(15,23,42,0.16)_100%)] sm:bg-[linear-gradient(90deg,rgba(15,23,42,0.9)_0%,rgba(15,23,42,0.78)_46%,rgba(15,23,42,0.08)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-deep-navy/35 to-transparent" />
      <div className="relative mx-auto flex min-h-[680px] max-w-[1200px] items-center px-5 pb-16 pt-32 sm:min-h-[660px] sm:px-7 sm:pb-20 sm:pt-36 lg:px-10">
        <div className="max-w-[680px]">
          <span className="inline-flex items-center rounded-full border border-[#72bee8]/40 bg-deep-navy/35 px-3.5 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8dcef0]">
            CSO Learning Hub
          </span>
          <h1
            id="landing-hero-title"
            className="mt-6 max-w-[650px] font-display text-[clamp(2.65rem,5vw,4.25rem)] font-bold leading-[1.03] tracking-[-0.025em] text-white"
          >
            Practical learning for stronger local and grassroots CSOs
          </h1>
          <p className="mt-6 max-w-[620px] text-[17px] leading-8 text-slate-100 sm:text-xl sm:leading-9">
            Work through realistic cases, guided activities, and adaptable tools built for the everyday realities of civil society work in Ethiopia. Study at your own pace and build shared capabilities.
          </p>
          
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-white/90">
            <li className="flex items-center gap-2 before:h-2 before:w-2 before:rounded-full before:bg-dec-green">Self-paced</li>
            <li className="flex items-center gap-2 before:h-2 before:w-2 before:rounded-full before:bg-dec-green">Practice-led</li>
            <li className="flex items-center gap-2 before:h-2 before:w-2 before:rounded-full before:bg-dec-green">Mobile-ready</li>
            <li className="flex items-center gap-2 before:h-2 before:w-2 before:rounded-full before:bg-dec-green">Certificate pathway</li>
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ActionButton className="min-w-44 shadow-[0_12px_30px_rgba(59,153,212,0.25)]" href="/courses" size="lg">
              Explore courses
            </ActionButton>
            <ActionButton
              className="min-w-44 border-white/70 bg-deep-navy/20 text-white shadow-none hover:border-white hover:bg-white/10 hover:text-white"
              href="/sign-in"
              size="lg"
              variant="outline"
            >
              Sign in and continue
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}

const displayTitles: Record<string, string> = {
  "Applying the Human Rights-Based Approach in CSO Practice": "Apply HRBA in Everyday CSO Project Work",
  "Governance and Leadership for Local CSOs": "Lead with Accountability and Clear Direction",
  "Project Management for Local and Grassroots CSOs": "Plan and Manage Local CSO Projects with Greater Clarity",
};

const featuredCourseSlugs = [
  "applying-human-rights-based-approach-in-cso-practice",
  "project-management-local-grassroots-csos",
] as const;

function FeaturedCourseCard({ course, featured }: { course: PublicCatalogueCourseSummary; featured: boolean }) {
  const isAvailable = course.availability === "available";
  const requiresInvitation = course.accessState === "invitation_required";
  const displayTitle = displayTitles[course.title] ?? course.title;
  return (
    <article
      className={cx(
        "group flex h-full flex-col overflow-hidden rounded-[20px] border bg-white transition-[border-color,box-shadow,transform] duration-300 motion-safe:hover:-translate-y-1",
        featured
          ? "border-dec-blue/70 shadow-card ring-1 ring-dec-blue/15 hover:shadow-hero"
          : "border-design-border shadow-soft hover:border-dec-blue/45 hover:shadow-card"
      )}
    >
      <div className="relative overflow-hidden bg-deep-navy">
        <CourseCoverVisual
          capacityArea={course.primaryCapacityArea.name}
          compact
          imageAlt={course.imageAlt}
          imageUrl={course.imageUrl}
          showTextOverlay={false}
          title={course.title}
          tone={course.tone}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          {featured ? (
            <span className="inline-flex min-h-7 items-center rounded-full border border-white/30 bg-deep-navy/85 px-3 py-1 text-xs font-bold text-white shadow-soft">
              Featured course
            </span>
          ) : <span />}
          <StatusBadge
            label={isAvailable ? "Available now" : "Coming soon"}
            tone={isAvailable ? "green" : "gray"}
          />
        </div>
      </div>
      <div className={cx("flex flex-1 flex-col", featured ? "p-6 sm:p-7" : "p-6")}>
        <span className="text-xs font-black uppercase tracking-[0.14em] text-dec-blue">
          {course.primaryCapacityArea.name}
        </span>
        <h3 className={cx("mt-3 font-bold leading-snug text-deep-navy", featured ? "text-2xl" : "text-xl")}>
          {displayTitle}
        </h3>
        {displayTitle !== course.title ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">
            Official title: {course.title}
          </p>
        ) : null}
        <p className="mt-4 flex-1 text-base leading-7 text-muted-text">
          {course.shortDescription}
        </p>
        {isAvailable ? (
          <div className="mt-6 flex min-h-14 flex-wrap content-start gap-2 border-t border-design-border pt-5 text-xs font-semibold text-muted-text">
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
          <p className="mt-6 min-h-14 border-t border-design-border pt-5 text-sm font-semibold leading-5 text-muted-text italic">
            Duration and release date to be confirmed
          </p>
        )}
        <ActionButton
          aria-label={`${isAvailable ? "View" : "View course overview for"} ${course.title}`}
          className="mt-6 w-full group-focus-within:ring-2 group-focus-within:ring-dec-blue/20"
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
  const shown = featuredCourseSlugs
    .map((slug) => courses.find((course) => course.slug === slug))
    .filter((course): course is PublicCatalogueCourseSummary => Boolean(course));

  if (process.env.NODE_ENV !== "production" && shown.length !== featuredCourseSlugs.length) {
    throw new Error("Featured learning requires both configured course summaries.");
  }

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="featured-learning-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <SectionEyebrow>Featured learning</SectionEyebrow>
            <h2 id="featured-learning-title" className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-deep-navy sm:text-4xl">
              Start with the course available now
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-text">
              Explore the Human Rights-Based Approach course today. Review other confirmed course areas being prepared for future release.
            </p>
          </div>
          <ActionButton className="shrink-0 self-start" href="/courses" variant="secondary">
            Explore all courses
          </ActionButton>
        </div>
        
        <div className="mt-10 grid items-stretch gap-6 md:grid-cols-[1.12fr_0.88fr] lg:gap-8">
          {shown.map((course) => (
            <FeaturedCourseCard
              course={course}
              featured={course.slug === featuredCourseSlugs[0]}
              key={course.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningPathway() {
  const stages = [
    { num: "1", title: "Explore", desc: "Browse course overviews and access requirements before registering." },
    { num: "2", title: "Learn", desc: "Study key concepts and worked examples designed for local CSOs." },
    { num: "3", title: "Practise", desc: "Make choices in realistic project scenarios and receive guidance." },
    { num: "4", title: "Apply", desc: "Download and adapt tools to your everyday program activities." },
  ];

  return (
    <section id="how-the-hub-works" className="border-y border-design-border bg-light-bg py-16 sm:py-20" aria-labelledby="pathway-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow centered>How learning works</SectionEyebrow>
          <h2 id="pathway-title" className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-deep-navy sm:text-4xl">
            A clear path from access to application
          </h2>
        </div>

        <ol className="relative mt-12 grid gap-5 before:absolute before:bottom-12 before:left-7 before:top-8 before:w-0.5 before:bg-dec-blue/25 md:grid-cols-2 md:before:hidden lg:grid-cols-4 lg:gap-8 lg:before:bottom-auto lg:before:left-[12.5%] lg:before:right-[12.5%] lg:before:top-7 lg:before:h-0.5 lg:before:w-auto">
          {stages.map((stage, idx) => (
            <li className="relative z-10 grid grid-cols-[56px_1fr] items-start gap-x-4 md:block" key={stage.title}>
              <div className="flex w-full items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-dec-blue font-sans text-lg font-black text-white shadow-card">
                  {stage.num}
                </span>
                {idx < stages.length - 1 && (
                  <ChevronRightIcon className="hidden h-5 w-5 shrink-0 text-dec-blue md:ml-auto md:block lg:hidden" />
                )}
              </div>
              <div className="pb-7 md:pb-0">
                <h3 className="text-xl font-bold text-deep-navy md:mt-6">{stage.title}</h3>
                <p className="mt-2 text-base leading-7 text-muted-text">{stage.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CsoRealities() {
  const realities = [
    { Icon: CompassIcon, accent: "text-dec-blue bg-[#e8f4fb]", title: "Practical and relevant", desc: "Anchored directly in the everyday requirements and constraints of grassroots CSOs." },
    { Icon: ClockIcon, accent: "text-soft-teal bg-[#e7f6f5]", title: "Flexible and self-paced", desc: "Learn when workloads and internet connection speeds allow, with mobile-ready controls." },
    { Icon: ProgressIcon, accent: "text-[#527d20] bg-[#eef7e3]", title: "Individual progress records", desc: "Your personal progress, quiz scores, and eligible certificates stay linked to your account." },
    { Icon: ShieldIcon, accent: "text-[#9a6200] bg-[#fff5de]", title: "Safe and responsible learning", desc: "Practice safely in interactive scenarios without entering confidential project records." },
  ];

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="realities-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
          <div className="max-w-xl">
            <SectionEyebrow>Designed around CSO realities</SectionEyebrow>
            <h2 id="realities-title" className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-deep-navy sm:text-4xl">
              Your organization already carries knowledge and experience
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-text">
              Finding time and internet continuity to transfer classroom training into shared practice is a common challenge. The Hub provides bite-sized, structured pathways to bridge this gap, putting your context and judgment first.
            </p>
          </div>
          
          <ul className="grid gap-4 sm:grid-cols-2">
            {realities.map((item) => (
              <li className="rounded-[18px] border border-design-border bg-white p-6 shadow-soft transition-[border-color,box-shadow] hover:border-dec-blue/35 hover:shadow-card" key={item.title}>
                <span className={cx("flex h-11 w-11 items-center justify-center rounded-xl", item.accent)}>
                  <item.Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold leading-snug text-deep-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-text">
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
    <section className="border-y border-[#cfe9e7] bg-[#eff9f8] py-16 sm:py-20" aria-labelledby="org-practice-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#cfe9e7] bg-white text-soft-teal shadow-soft">
              <PeopleIcon className="h-7 w-7" />
            </span>
            <div className="mt-6">
              <SectionEyebrow centered>Individual to team</SectionEyebrow>
              <h2 id="org-practice-title" className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-deep-navy sm:text-4xl">
                Bring the learning back to your team
              </h2>
            </div>
            <p className="mt-5 text-base leading-8 text-muted-text">
              Each learner maintains an individual account. To build institutional capacity, review course outputs together, adapt templates to your own systems, and retain them for future staff continuity.
            </p>
            <p className="mx-auto mt-4 max-w-2xl rounded-full bg-[#fff5de] px-4 py-2 text-sm font-semibold leading-6 text-[#7a4c00]">
              Note: Team discussions happen offline within your own team; online collaboration is planned for future phases.
            </p>
        </div>

          <ol className="mt-10 grid overflow-hidden rounded-[20px] border border-[#cfe2e1] bg-white shadow-card md:grid-cols-3">
            {steps.map((item, index) => (
              <li className="relative p-6 md:border-l md:border-[#cfe2e1] md:p-7 md:first:border-l-0" key={item.title}>
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-soft-teal font-sans text-base font-black text-white shadow-soft">
                  {item.num}
                </span>
                  {index < steps.length - 1 ? <ChevronRightIcon className="ml-auto hidden h-5 w-5 text-soft-teal/60 md:block" /> : null}
                </div>
                <h3 className="mt-5 text-lg font-bold text-deep-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-text">{item.desc}</p>
              </li>
            ))}
          </ol>
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
    <section className="bg-white py-16 sm:py-20" aria-labelledby="safety-assurance-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
          <div className="max-w-xl">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f6f5] text-soft-teal shadow-soft">
              <ShieldIcon className="h-7 w-7" />
            </span>
            <div className="mt-6">
              <SectionEyebrow>Safe participation</SectionEyebrow>
              <h2 id="safety-assurance-title" className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-deep-navy sm:text-4xl">
                Designed for practical and safe online access
              </h2>
            </div>
            <p className="mt-5 text-base leading-8 text-muted-text">
              The platform respects local connectivity realities. We prioritize lightweight structures, clear keyboard accessibility, and safe participant boundaries.
            </p>
            <ActionButton className="mt-6" href="/accessibility" variant="secondary">
              Accessibility guidance
            </ActionButton>
          </div>

          <ul className="grid gap-4 rounded-[20px] border border-design-border bg-light-bg p-4 shadow-soft sm:grid-cols-2 sm:p-5">
            {features.map((feature) => (
              <li className="rounded-[16px] border border-design-border bg-white p-5" key={feature.title}>
                <h3 className="text-base font-bold leading-snug text-deep-navy">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-text">{feature.desc}</p>
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
    <section className="relative overflow-hidden border-b border-white/10 bg-deep-navy px-5 py-16 text-white sm:px-7 sm:py-20 lg:px-10 lg:py-24" aria-labelledby="cta-section-title">
      <div aria-hidden="true" className="absolute -right-24 -top-36 h-96 w-96 rounded-full border-[44px] border-dec-blue/15" />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#72bee8]">
              Ready to begin?
            </span>
            <h2 id="cta-section-title" className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Choose the course that supports your current work
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
              Browse the course catalogue to explore details and prerequisites. If you have been invited to join a cohort, use the registration link shared in your invitation email.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <ActionButton className="min-w-48 border-dec-green bg-dec-green text-deep-navy shadow-card hover:border-[#82b947] hover:bg-[#82b947]" href="/courses" size="lg">
              Explore courses
            </ActionButton>
            <ActionButton
              className="min-w-48 border-white/70 bg-transparent text-white shadow-none hover:border-white hover:bg-white/10 hover:text-white"
              href="/sign-in"
              size="lg"
              variant="outline"
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
