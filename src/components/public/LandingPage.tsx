import Image from "next/image";
import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { ActionButton, StatusBadge } from "@/components/ui";
import type { PublicCatalogueCourseSummary } from "@/lib/course-types";

type IconProps = { className?: string };

const CheckIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RouteIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M6 4h9a3 3 0 0 1 3 3v10" strokeLinecap="round" />
    <path d="m14 14 4 4 4-4M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  </svg>
);

const PracticeIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M5 4h14v16H5z" strokeLinejoin="round" />
    <path d="M8 8h8M8 12h5M8 16h3" strokeLinecap="round" />
  </svg>
);

const ToolsIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M4 7h16M7 4v6M17 4v6M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14h3M8 17h6" strokeLinecap="round" />
  </svg>
);

const CertificateIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M6 3h12v13H6z" strokeLinejoin="round" />
    <path d="M9 7h6M9 10h4M9 16v5l3-2 3 2v-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PeopleIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M16 20v-1.5a4.5 4.5 0 0 0-9 0V20M11.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" strokeLinecap="round" />
    <path d="M17 7a3 3 0 0 1 0 6M19 15.5a4 4 0 0 1 2 3.5v1" strokeLinecap="round" />
  </svg>
);

const valueItems = [
  {
    description: "Clear learning journeys built around relevant CSO needs.",
    icon: RouteIcon,
    title: "Structured learning",
    tone: "bg-[#e5f3fb] text-[#145a85]",
  },
  {
    description:
      "Realistic situations, guided practice and tools that support everyday organizational work.",
    icon: PracticeIcon,
    title: "Practical application",
    tone: "bg-[#edf7df] text-[#426f1c]",
  },
  {
    description:
      "Templates, reflections and practical products that learners can adapt and use.",
    icon: ToolsIcon,
    title: "Useful learning outputs",
    tone: "bg-[#fff5dc] text-[#9a5b09]",
  },
  {
    description:
      "Available for eligible courses after the required learning and assessment are completed.",
    icon: CertificateIcon,
    title: "Certificates",
    tone: "bg-[#e8f5f0] text-[#176b58]",
  },
];

const learningApproachItems = [
  "Short explanations",
  "Realistic scenarios",
  "Worked examples",
  "Reflection",
  "Knowledge checks",
  "Practical activities",
  "Downloadable or reusable tools",
];

const pathwayItems = [
  {
    description:
      "Structured courses, guided practice and practical outputs available through the Hub.",
    status: "Available now",
    title: "Learn",
  },
  {
    description:
      "Future opportunities for learners and CSOs to share experience and learn from peers.",
    status: "Future direction",
    title: "Exchange",
  },
  {
    description:
      "Future collaboration to adapt tools, document practice and develop shared solutions.",
    status: "Future direction",
    title: "Co-create",
  },
];

const audienceItems = [
  "Local and grassroots CSOs",
  "Programme and project staff",
  "Organizational leaders",
  "MEAL, finance and operational staff",
  "Community-facing practitioners",
  "CSO networks and associations",
];

function SectionHeading({
  description,
  eyebrow,
  title,
}: {
  description?: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="h-1 w-10 rounded-full bg-dec-blue" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#145a85]">
          {eyebrow}
        </p>
      </div>
      <h2 className="mt-4 font-display text-4xl leading-tight text-deep-navy sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function HeroSection() {
  return (
    <section
      className="relative flex min-h-[690px] items-center overflow-hidden bg-deep-navy bg-cover bg-[62%_center] text-white sm:min-h-[720px] lg:bg-center"
      style={{ backgroundImage: "url('/images/landing-hero.png')" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.98)_0%,rgba(15,23,42,0.92)_45%,rgba(15,23,42,0.35)_100%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#9bd6f7]">
            <span className="h-1 w-10 rounded-full bg-dec-green" />
            CSO Learning Hub
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-[-0.025em] text-white sm:text-6xl lg:text-[4.75rem]">
            Practical learning for local and grassroots CSOs
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">
            Build knowledge, practise important decisions and create useful tools for your organization—while preparing for future knowledge exchange, peer learning and co-created CSO practice.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ActionButton href="/courses" size="lg">
              Explore courses
            </ActionButton>
            <ActionButton
              className="border-white/45 bg-white/10 text-white shadow-none hover:border-white/70 hover:bg-white/20 hover:text-white"
              href="/register"
              size="lg"
              variant="secondary"
            >
              Create an account
            </ActionButton>
          </div>
          <p className="mt-8 max-w-xl border-l-2 border-dec-green pl-4 text-sm leading-6 text-slate-200">
            Learn at your own pace through courses grounded in the realities of CSO practice.
          </p>
        </div>
      </div>
    </section>
  );
}

function CoreValueSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          description="Learning is designed to move from understanding to application, with outputs that can support real organizational work."
          eyebrow="What the Hub offers"
          title="Learning with a practical purpose"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                className="rounded-card border border-design-border bg-white p-6 shadow-soft"
                key={item.title}
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-lg font-bold text-deep-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LearningApproachSection() {
  return (
    <section className="border-y border-design-border bg-soft-bg py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div className="relative min-h-[380px] overflow-hidden rounded-panel border border-design-border bg-white shadow-card sm:min-h-[460px]">
          <Image
            alt="CSO practitioners discussing their work together around a laptop"
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 560px, calc(100vw - 32px)"
            src="/images/landing-about.png"
          />
          <div className="absolute inset-x-5 bottom-5 rounded-card bg-deep-navy/92 p-5 text-white backdrop-blur-sm sm:inset-x-7 sm:bottom-7 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9bd6f7]">
              From experience to action
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-100 sm:text-base">
              Courses build on practitioners’ knowledge and connect learning with everyday choices and responsibilities.
            </p>
          </div>
        </div>
        <div>
          <SectionHeading
            description="Courses combine clear explanations with opportunities to think, practise and produce something useful. Each course uses only the learning methods that support its goals."
            eyebrow="Learning approach"
            title="Understand, practise and apply"
          />
          <ul className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2" aria-label="Course learning methods">
            {learningApproachItems.map((item) => (
              <li className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-800" key={item}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f5f0] text-[#176b58]">
                  <CheckIcon className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PathwaySection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          description="Phase One begins with structured learning. Exchange and co-creation describe the Hub’s future direction and are not active services today."
          eyebrow="Hub pathway"
          title="Learn → Exchange → Co-create"
        />
        <ol className="mt-12 grid gap-5 lg:grid-cols-3">
          {pathwayItems.map((item, index) => (
            <li
              className={`relative rounded-card border p-7 ${
                index === 0
                  ? "border-dec-blue bg-[#f1f9fd] shadow-card"
                  : "border-design-border bg-white shadow-soft"
              }`}
              key={item.title}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-deep-navy text-sm font-bold text-white">
                  {index + 1}
                </span>
                <StatusBadge label={item.status} tone={index === 0 ? "green" : "gray"} />
              </div>
              <h3 className="mt-7 font-display text-3xl text-deep-navy">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FeaturedCourseCard({ course }: { course: PublicCatalogueCourseSummary }) {
  const isAvailable = course.availability === "available";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-design-border bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="relative">
        <CourseCoverVisual
          capacityArea={course.primaryCapacityArea.name}
          compact
          imageAlt={course.imageAlt}
          imageUrl={course.imageUrl}
          title={course.title}
          tone={course.tone}
        />
        <div className="absolute left-4 top-4">
          <StatusBadge
            label={isAvailable ? "Available now" : "Coming soon"}
            tone={isAvailable ? "green" : "gray"}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#176b58]">
          {course.primaryCapacityArea.name}
        </p>
        <h3 className="mt-3 text-xl font-bold leading-snug text-deep-navy">{course.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{course.shortDescription}</p>
        <div className="mt-6 flex flex-wrap gap-2 border-t border-design-border pt-5 text-xs font-semibold text-slate-700">
          <span className="rounded-full bg-soft-bg px-3 py-1.5">{course.duration}</span>
          <span className="rounded-full bg-soft-bg px-3 py-1.5">{course.deliveryFormat}</span>
          {isAvailable ? (
            <span className="rounded-full bg-[#edf7df] px-3 py-1.5 text-[#426f1c]">
              {course.certificateLabel}
            </span>
          ) : null}
        </div>
        <ActionButton className="mt-6 w-full" href={course.href} variant="secondary">
          {isAvailable ? "View course" : "View course structure"}
        </ActionButton>
      </div>
    </article>
  );
}

function FeaturedLearningSection({ courses }: { courses: PublicCatalogueCourseSummary[] }) {
  const featuredCourses = courses.slice(0, 3);

  return (
    <section className="border-y border-design-border bg-soft-bg py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            description="Begin with the available HRBA course and explore the confirmed courses being prepared for future release."
            eyebrow="Featured learning"
            title="Available now and coming next"
          />
          <ActionButton className="self-start sm:mb-1 sm:shrink-0" href="/courses" variant="secondary">
            View all courses
          </ActionButton>
        </div>
        {featuredCourses.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <FeaturedCourseCard course={course} key={course.slug} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-card border border-design-border bg-white p-8 shadow-soft">
            <h3 className="text-xl font-bold text-deep-navy">Course information is being prepared</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Visit the course catalogue for the latest published learning opportunities.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
        <div>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5f3fb] text-[#145a85]">
            <PeopleIcon className="h-7 w-7" />
          </span>
          <SectionHeading
            description="The Hub respects the knowledge and professional experience already present across civil society. It offers structured ways to deepen, apply and share that practice over time."
            eyebrow="Who the Hub is for"
            title="Built around the work CSO practitioners already do"
          />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2" aria-label="Intended Hub audiences">
          {audienceItems.map((item) => (
            <li
              className="flex min-h-20 items-center gap-4 rounded-card border border-design-border bg-white p-5 shadow-soft"
              key={item}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf7df] text-[#426f1c]">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold leading-6 text-slate-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClosingCtaSection() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-panel bg-[#0e4a6e] px-6 py-12 text-white shadow-hero sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-dec-blue/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-dec-green/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9e4fb]">Continue learning</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl">
              Strengthen practice. Build useful skills. Continue learning with other CSO practitioners.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ActionButton className="border-white bg-white text-[#0e4a6e] hover:bg-slate-50 hover:text-[#0e4a6e]" href="/courses" size="lg">
              Explore courses
            </ActionButton>
            <ActionButton
              className="border-white/45 bg-white/10 text-white shadow-none hover:border-white/70 hover:bg-white/20 hover:text-white"
              href="/register"
              size="lg"
              variant="secondary"
            >
              Create an account
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
  courses?: PublicCatalogueCourseSummary[];
}) {
  return (
    <div className="flex flex-col overflow-x-clip">
      <HeroSection />
      <CoreValueSection />
      <LearningApproachSection />
      <PathwaySection />
      <FeaturedLearningSection courses={courses} />
      <AudienceSection />
      <ClosingCtaSection />
    </div>
  );
}
