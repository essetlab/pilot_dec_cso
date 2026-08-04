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
    <section className="relative overflow-hidden bg-deep-navy text-white" aria-labelledby="landing-hero-title">
      <Image
        alt="Four Ethiopian CSO practitioners collaborate at a meeting room table review."
        className="object-cover object-[68%_center]"
        fill
        priority
        sizes="100vw"
        src="/images/landing/cso-planning-hero.png"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.86)_45%,rgba(15,23,42,0.3)_100%)]" />
      <div className="relative mx-auto flex min-h-[600px] max-w-[1200px] items-center px-5 pb-16 pt-32 sm:px-7 lg:px-10">
        <div className="max-w-[700px]">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-[#72bee8]">
            CSO Learning Hub
          </span>
          <h1
            id="landing-hero-title"
            className="mt-5 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-white"
          >
            Practical learning for stronger local and grassroots CSOs
          </h1>
          <p className="mt-6 text-base leading-8 text-slate-200 sm:text-lg sm:leading-8">
            Work through realistic cases, guided activities, and adaptable tools built for the everyday realities of civil society work in Ethiopia. Study at your own pace and build shared capabilities.
          </p>
          
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-wider text-dec-green">
            <li>&bull; Self-paced</li>
            <li>&bull; Practice-led</li>
            <li>&bull; Mobile-ready</li>
            <li>&bull; Certificate pathway</li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionButton href="/courses" size="lg">
              Explore courses
            </ActionButton>
            <ActionButton
              className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
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

function LearningPathway() {
  const stages = [
    { num: "1", title: "Explore", desc: "Browse course overviews and access requirements before registering." },
    { num: "2", title: "Learn", desc: "Study key concepts and worked examples designed for local CSOs." },
    { num: "3", title: "Practise", desc: "Make choices in realistic project scenarios and receive guidance." },
    { num: "4", title: "Apply", desc: "Download and adapt tools to your everyday program activities." },
  ];

  return (
    <section id="how-the-hub-works" className="border-y border-design-border bg-light-bg py-14 sm:py-16" aria-labelledby="pathway-title">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow>How learning works</SectionEyebrow>
          <h2 id="pathway-title" className="mt-4 font-display text-3xl font-bold text-deep-navy">
            A clear path from access to application
          </h2>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, idx) => (
            <li className="relative flex flex-col items-start" key={stage.title}>
              <div className="flex w-full items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dec-blue font-sans text-base font-black text-white">
                  {stage.num}
                </span>
                {idx < stages.length - 1 && (
                  <div className="hidden lg:block h-px flex-1 bg-design-border" />
                )}
                {idx < stages.length - 1 && (
                  <ChevronRightIcon className="hidden lg:block h-4 w-4 text-muted-soft shrink-0" />
                )}
              </div>
              <h3 className="mt-5 text-lg font-bold text-deep-navy">
                {stage.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-text">
                {stage.desc}
              </p>
            </li>
          ))}
        </ol>
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
