import Image from "next/image";
import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { ActionButton } from "@/components/ui";
import { cx } from "@/components/ui/utils";
import { DEMO_COURSES } from "@/lib/demo-data";
import type { CourseTone, PublicCourseSummary } from "@/lib/course-types";

// Inline SVG Icon Components
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PeopleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ListIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const BadgeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LevelIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CapacityIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const CapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const ResourceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const GraphicIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const trustMarkers = [
  "Mobile-friendly",
  "Practical",
  "Step-by-step",
  "Certificate-ready",
];

const features = [
  {
    title: "Practical and work-ready",
    description: "Skills you can apply right away.",
    icon: BriefcaseIcon,
    tone: "green",
  },
  {
    title: "Grounded in local realities",
    description: "Designed for local needs and contexts.",
    icon: PeopleIcon,
    tone: "blue",
  },
  {
    title: "Structured learning journeys",
    description: "Clear paths with practical activities.",
    icon: ListIcon,
    tone: "green",
  },
  {
    title: "Progress and certificates",
    description: "Track progress and earn recognised certificates.",
    icon: BadgeIcon,
    tone: "blue",
  },
];

const checkPills = [
  "Self-paced learning",
  "Practical & relevant",
  "Local context-first",
  "Mobile-friendly access",
  "Certificates you can share",
];

const experienceItems = [
  {
    title: "Structured journeys",
    description: "Clear paths from orientation to application.",
    icon: ListIcon,
  },
  {
    title: "Interactive blocks",
    description: "Case studies, prompts, and practice activities.",
    icon: PeopleIcon,
  },
  {
    title: "Knowledge checks",
    description: "Low-stakes checks before final tests.",
    icon: CheckIcon,
  },
  {
    title: "Progress tracking",
    description: "Simple visibility into what is complete.",
    icon: GraphicIcon,
  },
  {
    title: "Resource library",
    description: "Useful tools and downloadable learning materials.",
    icon: ResourceIcon,
  },
  {
    title: "Official certificates",
    description: "Recognition after requirements are met.",
    icon: BadgeIcon,
  },
];

function HeroSection() {
  return (
    <section 
      className="relative min-h-[640px] flex items-center bg-cover bg-center text-white"
      style={{ backgroundImage: `url('/images/landing-hero.png')` }}
    >
      {/* Dark overlay specifically tailored for overlay text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/90 to-[#0F172A]/40 sm:via-[#0F172A]/85" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl mt-16 sm:mt-20">
          <span className="inline-flex text-xs font-bold uppercase tracking-[0.25em] text-[#7ec8f5] mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            DEC LEARNING PLATFORM
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Learn, Adapt, Grow
          </h1>
          <p className="mt-6 max-w-xl text-lg sm:text-xl text-slate-100 leading-relaxed font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            Practical digital learning for local and grassroots CSOs.
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <ActionButton href="/courses" size="lg">
              Explore Courses
            </ActionButton>
            <ActionButton
              className="border-white/40 bg-white/15 text-white hover:bg-white/25 hover:text-white hover:border-white/60 shadow-none"
              href="/sign-in"
              size="lg"
              variant="secondary"
            >
              Sign In
            </ActionButton>
          </div>
          
          {/* Trust markers strip */}
          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold" aria-label="Platform qualities">
            {trustMarkers.map((marker) => (
              <li className="inline-flex items-center gap-2 text-white" key={marker}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[#7ec8f5]">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                {marker}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CoreFeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#145a85]">
            BUILT FOR PRACTICAL CSO LEARNING
          </span>
        </div>
        
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            const toneClasses = feature.tone === "green" 
              ? "bg-[#e8f5d6] text-[#3a6118]" 
              : "bg-[#dceef8] text-[#145a85]";

            return (
              <article 
                key={feature.title} 
                className="rounded-card border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card flex flex-col items-start"
              >
                <span className={cx("inline-flex h-12 w-12 items-center justify-center rounded-2xl", toneClasses)}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-lg font-bold leading-tight text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutPlatformSection() {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#145a85]">
            ABOUT THE PLATFORM
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold leading-tight text-slate-900">
            A practical learning space for stronger CSOs
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            The CSO Learning Hub equips local organisations with the practical knowledge and tools to plan, manage, and grow community impact.
          </p>
          
          <ul className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Platform details">
            {checkPills.map((pill) => (
              <li className="flex items-center gap-3 text-sm font-semibold text-slate-800" key={pill}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f5d6] text-[#3a6118]">
                  <CheckIcon className="h-4 w-4" />
                </span>
                {pill}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right side photographic asset */}
        <div className="relative aspect-[4/3] rounded-panel overflow-hidden border border-slate-200 bg-white shadow-card">
          <Image
            alt="CSO team discussing project plans together around a laptop"
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 560px, calc(100vw - 32px)"
            src="/images/landing-about.png"
            priority
          />
        </div>
      </div>
    </section>
  );
}

interface CourseType {
  id: string;
  title: string;
  description: string;
  capacityArea: string;
  duration: string;
  level: string;
  slug: string;
  imageUrl: string | null;
  imageAlt: string | null;
  tone?: string;
  href: string;
}

function CoursePreviewCard({ course }: { course: CourseType }) {
  const tone: CourseTone =
    course.tone === "green" ||
    course.tone === "gold" ||
    course.tone === "navy" ||
    course.tone === "blue"
      ? course.tone
      : "blue";

  return (
    <article className="flex flex-col h-full overflow-hidden rounded-card border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="relative overflow-hidden">
        <CourseCoverVisual
          capacityArea={course.capacityArea}
          compact
          imageAlt={course.imageAlt ?? `Course cover for ${course.title}`}
          imageUrl={course.imageUrl}
          title={course.title}
          tone={tone}
        />

        <div className="absolute right-3 top-3 rounded-full bg-[#5d8a2f] text-white px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          Certificate available
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold leading-snug text-slate-900 line-clamp-2 min-h-[56px]">
          {course.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3 flex-grow">
          {course.description}
        </p>
        
        {/* Metadata section */}
        <div className="mt-6 space-y-3 pt-5 border-t border-slate-200">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
            <CapacityIcon className="h-4.5 w-4.5 text-[#145a85] shrink-0" />
            <span className="truncate">Capacity Area: {course.capacityArea}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
            <ClockIcon className="h-4.5 w-4.5 text-[#145a85] shrink-0" />
            <span>Duration: {course.duration}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
            <LevelIcon className="h-4.5 w-4.5 text-[#145a85] shrink-0" />
            <span>Level: {course.level}</span>
          </div>
        </div>

        <div className="mt-6">
          <ActionButton href={course.href} className="w-full">
            View Course
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

function CourseShowcaseSection({ courses }: { courses: CourseType[] }) {
  // Render the three core Phase 1 courses
  const featuredCourses = courses.length > 0 ? courses.slice(0, 3) : DEMO_COURSES.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#145a85]">
              COURSE LIBRARY
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-slate-900">
              Start with practical Phase 1 course journeys
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Short, focused courses to strengthen core capacities.
            </p>
          </div>
          <ActionButton href="/courses" variant="secondary" className="shrink-0 self-start sm:self-auto">
            View All Courses
          </ActionButton>
        </div>
        
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <CoursePreviewCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningExperienceSection() {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#145a85]">
            LEARNING EXPERIENCE
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-slate-900">
            What each learning journey can include
          </h2>
        </div>
        
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {experienceItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <article 
                key={item.title} 
                className="flex gap-4 rounded-card border border-slate-200 bg-white p-6 shadow-soft transition hover:shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dceef8] text-[#145a85] font-bold">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-panel bg-[#0e4a6e] text-white p-10 sm:p-12 lg:p-16 relative overflow-hidden shadow-hero flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle decoration pattern block */}
          <div className="absolute right-0 bottom-0 opacity-[0.07] pointer-events-none transform translate-y-1/4 translate-x-1/4">
            <CapIcon className="w-96 h-96" />
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-white shrink-0">
              <CapIcon className="h-9 w-9" />
            </span>
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-white">
                Ready to start your CSO learning journey?
              </h2>
              <p className="mt-3 max-w-xl text-sky-200 text-sm sm:text-base leading-relaxed">
                Explore practical courses designed to help CSOs strengthen skills and create lasting impact in their communities.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto relative z-10 shrink-0">
            <ActionButton 
              href="/courses" 
              className="bg-white text-[#0e4a6e] border-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-slate-50 hover:text-[#0e4a6e] font-bold w-full sm:w-auto"
            >
              Go to Catalog
            </ActionButton>
            <ActionButton
              className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/70 w-full sm:w-auto"
              href="/sign-in"
              variant="secondary"
            >
              Sign In
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingPage({
  courses = [],
}: {
  courses?: PublicCourseSummary[];
}) {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <CoreFeaturesSection />
      <AboutPlatformSection />
      <CourseShowcaseSection courses={courses} />
      <LearningExperienceSection />
      <CTASection />
    </div>
  );
}
