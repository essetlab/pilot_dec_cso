import Image from "next/image";
import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { ActionButton, StatusBadge } from "@/components/ui";
import type { PublicCatalogueCourseSummary } from "@/lib/course-types";

type IconProps = { className?: string };

const CompassIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" strokeLinejoin="round" />
  </svg>
);

const DocumentIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M6 3.5h8l4 4V20H6V3.5Z" strokeLinejoin="round" />
    <path d="M14 3.5V8h4M9 12h6M9 15.5h4" strokeLinecap="round" />
  </svg>
);

const PeopleIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M16 20v-1.5a4.5 4.5 0 0 0-9 0V20M11.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" strokeLinecap="round" />
    <path d="M17 7a3 3 0 0 1 0 6M19 15.5a4 4 0 0 1 2 3.5v1" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M12 3 19 6v5c0 4.6-2.9 8.1-7 10-4.1-1.9-7-5.4-7-10V6l7-3Z" strokeLinejoin="round" />
    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const realityItems = [
  { title: "Training to practice", description: "Applying learning after a busy workshop can be difficult." },
  { title: "Adaptable tools", description: "Many tools are complex or tied to one donor format." },
  { title: "Shared continuity", description: "Staff changes can interrupt learning and leave useful methods with one person." },
  { title: "Practical access", description: "Connectivity, travel and workload can limit conventional training." },
];

const valueItems = [
  { title: "Analyse", description: "Examine context, rights, barriers, power, risks and evidence." },
  { title: "Decide", description: "Work through realistic choices and see their consequences." },
  { title: "Create", description: "Build a practical map, plan, register or learning question." },
  { title: "Adapt", description: "Adjust the method to fit your organisation and its work." },
];

const accessSteps = [
  { title: "Browse openly", description: "Explore course information before creating an account." },
  { title: "Choose the right access route", description: "Use open registration for open learning, or the secure link sent with a course invitation." },
  { title: "Use your own account", description: "Your progress, assessment and eligible certificates stay linked to you." },
  { title: "Learn through practice", description: "Work through explanations, realistic cases, decisions and guided activities." },
  { title: "Apply learning safely", description: "Adapt methods for your work without entering confidential or personal information." },
  { title: "Return and continue", description: "Use your dashboard to resume learning and review your progress." },
];

const learningStages = [
  { title: "Learn", description: "Build a clear foundation through short explanations and worked examples." },
  { title: "Practise", description: "Make choices in realistic scenarios, receive guidance and improve the result." },
  { title: "Apply", description: "Adapt a tool or output to your current project or organisational work." },
];

const organisationSteps = [
  { title: "Individual record", description: "Progress, assessment and eligible certificates remain linked to the learner." },
  { title: "Team review", description: "Use an output to support a short discussion with colleagues." },
  { title: "Adapt and retain", description: "Agree what to change and retain the approved version for future staff." },
];

const futurePath = [
  { status: "AVAILABLE NOW", title: "Learn", description: "Work through structured courses, guided practice and practical outputs." },
  { status: "PLANNED", title: "Exchange", description: "Future opportunities for CSOs to share experience and learn from peers." },
  { status: "FUTURE DIRECTION", title: "Co-create", description: "Future collaboration to adapt tools, document practice and develop shared approaches." },
];

const accessFeatures = [
  { title: "Mobile-ready layout", description: "Controls and cards resize for narrow screens." },
  { title: "Text-first content", description: "Headings, status and actions remain useful if images are slow." },
  { title: "No autoplay", description: "Media starts only when you choose." },
  { title: "Clear focus and labels", description: "Keyboard and assistive-technology users receive descriptive controls." },
];

const displayTitles: Record<string, string> = {
  "Applying the Human Rights-Based Approach in CSO Practice": "Apply HRBA in Everyday CSO Project Work",
  "Governance and Leadership for Local CSOs": "Lead with Accountability and Clear Direction",
  "Project Management for Local and Grassroots CSOs": "Plan and Manage Local CSO Projects with Greater Clarity",
};

function SectionHeading({ description, eyebrow, title, inverse = false }: { description?: string; eyebrow: string; title: string; inverse?: boolean }) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <span className={`h-1 w-8 rounded-full ${inverse ? "bg-[#72bee8]" : "bg-[#0878b9]"}`} />
        <p className={`text-xs font-bold uppercase tracking-[0.16em] ${inverse ? "text-[#9bd9f6]" : "text-[#075e8e]"}`}>{eyebrow}</p>
      </div>
      <h2 className={`mt-4 font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.015em] ${inverse ? "text-white" : "text-[#0b1f3a]"}`}>{title}</h2>
      {description ? <p className={`mt-5 max-w-[70ch] text-base leading-8 sm:text-lg ${inverse ? "text-slate-200" : "text-[#3f5061]"}`}>{description}</p> : null}
    </div>
  );
}

function StaticCard({ title, description, number }: { title: string; description: string; number?: number }) {
  return (
    <li className="rounded-2xl border border-[#cad5df] bg-white p-6 shadow-[0_8px_24px_rgba(7,20,38,0.06)]">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f3fb] text-sm font-bold text-[#075e8e]">
        {number ?? <CompassIcon className="h-5 w-5" />}
      </span>
      <h3 className="mt-5 text-xl font-bold text-[#0b1f3a]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#3f5061]">{description}</p>
    </li>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#071426] text-white" aria-labelledby="landing-hero-title">
      <Image alt="Four Ethiopian CSO practitioners review a project map around a table." className="object-cover object-[68%_center]" fill priority sizes="100vw" src="/images/landing/cso-planning-hero.png" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,38,0.99)_0%,rgba(7,20,38,0.94)_45%,rgba(7,20,38,0.28)_100%)]" />
      <div className="relative mx-auto flex min-h-[680px] max-w-[1200px] items-center px-5 pb-16 pt-32 sm:px-7 lg:px-10">
        <div className="max-w-[760px]">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#72bee8]"><span className="h-1 w-8 rounded-full bg-[#72bee8]" />CSO Learning Hub</p>
          <h1 id="landing-hero-title" className="mt-6 max-w-[760px] font-display text-[clamp(2.35rem,5.2vw,4rem)] font-bold leading-[1.06] tracking-[-0.025em] text-white">Strengthen everyday CSO work through practical online learning</h1>
          <p className="mt-7 max-w-[700px] text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">For local and grassroots CSOs in Ethiopia. Work through realistic cases, guided practice and adaptable tools that help you apply learning to project design, implementation, HRBA, MEAL and organisational practice.</p>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#b9e3d0]">Self-paced · Practice-led · Mobile-ready</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionButton href="/courses" size="lg">Explore courses</ActionButton>
            <ActionButton className="border-white bg-white text-[#0b1f3a] hover:bg-slate-100 hover:text-[#0b1f3a]" href="#how-the-hub-works" size="lg" variant="secondary">See how learning works</ActionButton>
          </div>
          <p className="mt-7 flex max-w-xl items-start gap-3 text-sm leading-6 text-slate-200"><span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#91c852]" />One course is available now. Additional courses are clearly marked as coming soon.</p>
        </div>
      </div>
    </section>
  );
}

function ProgrammeStrip() {
  return (
    <section id="programme-context" className="border-b border-[#cad5df] bg-[#f7f8f5]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-5 py-8 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#075e8e]">Programme context</p>
          <h2 className="mt-2 text-2xl font-bold text-[#0b1f3a]">A DEC learning platform for local and grassroots CSOs</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#3f5061]">Developed for the Capacity Development Program for Local and Grassroots Civil Society Organizations. Partner and donor acknowledgement appears in full in the footer.</p>
        </div>
        <ActionButton className="shrink-0 self-start" href="#how-the-hub-works" variant="secondary">How the Hub works</ActionButton>
      </div>
    </section>
  );
}

function RealitiesSection() {
  return (
    <section className="bg-[#eef8f2] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 sm:px-7 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <SectionHeading eyebrow="Built around real work" title="Your organisation already carries knowledge, relationships and experience" />
          <p className="mt-6 max-w-xl text-base leading-8 text-[#3f5061]">The challenge is often finding enough time, continuity and practical support to turn training into shared organisational practice. The Hub provides structured ways to work through that gap while keeping your context and judgement at the centre.</p>
          <p className="mt-6 text-sm font-semibold leading-6 text-[#2f6b3b]">These are operating constraints—not statements about the capability of CSOs.</p>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2">{realityItems.map((item) => <StaticCard key={item.title} {...item} />)}</ul>
      </div>
    </section>
  );
}

function PracticalValueSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <SectionHeading eyebrow="Practical value" title="Move from understanding to decisions you can use" description="Choose learning that helps you examine a real work challenge, practise with guidance and produce something your organisation can adapt." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{valueItems.map((item) => <StaticCard key={item.title} {...item} />)}</ul>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><ActionButton href="/courses?availability=Available+now" variant="secondary">Explore available learning</ActionButton><p className="text-sm text-[#3f5061]">Exact outputs vary by course.</p></div>
      </div>
    </section>
  );
}

function AccessJourneySection() {
  return (
    <section id="how-the-hub-works" className="scroll-mt-24 border-y border-[#cad5df] bg-[#f7f8f5] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <SectionHeading eyebrow="How the Hub works" title="A clear route from access to application" description="You can browse course information without an account. Open learning uses normal learner registration; invitation-only courses use a secure link prepared by DEC. Every learner uses an individual account so progress, assessment and eligible certificates remain connected to the right person." />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{accessSteps.map((item, index) => <StaticCard key={item.title} {...item} number={index + 1} />)}</ol>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><ActionButton href="/courses">Browse courses</ActionButton><ActionButton href="/support" variant="secondary">Registration guidance</ActionButton><p className="text-sm font-semibold text-[#8a5600]">Do not use one shared account for several learners.</p></div>
      </div>
    </section>
  );
}

function LearningMethodSection({ availableCourse }: { availableCourse?: PublicCatalogueCourseSummary }) {
  return (
    <section className="bg-[#071426] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <SectionHeading inverse eyebrow="Learning approach" title="Learn it. Practise it. Apply it to your work." description="Courses use only the methods needed for the learning goal. You may examine a fictional Ethiopian CSO case, make a decision, try a tool and then compare the method with your own organisational context." />
        <ol className="mt-10 grid gap-5 md:grid-cols-3">{learningStages.map((item, index) => <li className="rounded-2xl border border-[#2c5274] bg-[#12365a] p-7" key={item.title}><p className="text-xs font-bold tracking-[0.16em] text-[#9bd9f6]">0{index + 1}</p><h3 className="mt-5 font-display text-3xl font-bold text-white">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-200">{item.description}</p></li>)}</ol>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><ActionButton className="border-white bg-white text-[#0b1f3a] hover:bg-slate-100 hover:text-[#0b1f3a]" href={availableCourse?.href ?? "/courses"} variant="secondary">See the available course</ActionButton><p className="max-w-2xl text-sm font-semibold leading-6 text-[#b9e3d0]">Never enter names, survivor stories, confidential records or personal data in practice activities.</p></div>
      </div>
    </section>
  );
}

function FeaturedCourseCard({ course, featured }: { course: PublicCatalogueCourseSummary; featured: boolean }) {
  const isAvailable = course.availability === "available";
  const requiresInvitation = course.accessState === "invitation_required";
  const displayTitle = displayTitles[course.title] ?? course.title;
  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white ${featured ? "border-[#075e8e] shadow-[0_16px_40px_rgba(7,20,38,0.13)]" : "border-[#cad5df] shadow-[0_8px_24px_rgba(7,20,38,0.06)]"}`}>
      <div className="relative"><CourseCoverVisual capacityArea={course.primaryCapacityArea.name} compact imageAlt={course.imageAlt} imageUrl={course.imageUrl} title={course.title} tone={course.tone} /><div className="absolute right-4 top-4"><StatusBadge label={isAvailable ? "Available now" : "Coming soon"} tone={isAvailable ? "green" : "gray"} /></div></div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#075e8e]">{course.primaryCapacityArea.name}</p>
        <h3 className="mt-3 text-2xl font-bold leading-tight text-[#0b1f3a]">{displayTitle}</h3>
        {displayTitle !== course.title ? <p className="mt-3 text-xs leading-5 text-[#3f5061]">Official title: {course.title}</p> : null}
        <p className="mt-4 flex-1 text-sm leading-7 text-[#3f5061]">{course.shortDescription}</p>
        {isAvailable ? <div className="mt-6 flex flex-wrap gap-2 border-t border-[#cad5df] pt-5 text-xs font-semibold text-[#3f5061]"><span className="rounded-full bg-[#f7f8f5] px-3 py-1.5">{course.duration}</span>{requiresInvitation ? <span className="rounded-full bg-[#fff4d8] px-3 py-1.5 text-[#8a5600]">Invitation required</span> : null}<span className="rounded-full bg-[#eaf6e9] px-3 py-1.5 text-[#2f6b3b]">{course.certificateLabel}</span></div> : <p className="mt-6 border-t border-[#cad5df] pt-5 text-xs font-semibold text-[#3f5061]">Duration and release date to be confirmed</p>}
        <ActionButton aria-label={`${isAvailable ? "View" : "View course overview for"} ${course.title}`} className="mt-6 w-full" href={course.href} variant={featured ? "primary" : "secondary"}>{isAvailable ? "View course" : "View course overview"}</ActionButton>
      </div>
    </article>
  );
}

function FeaturedLearningSection({ courses }: { courses: PublicCatalogueCourseSummary[] }) {
  const available = courses.find((course) => course.availability === "available");
  const comingSoon = courses.filter((course) => course.availability === "coming_soon").slice(0, 2);
  const shown = [...(available ? [available] : []), ...comingSoon];
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow="Featured learning" title="Start with the course available now" description="Explore the Human Rights-Based Approach course today. Review other confirmed course areas being prepared for future release." /><ActionButton className="shrink-0 self-start" href="/courses" variant="secondary">View all courses</ActionButton></div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{shown.map((course, index) => <FeaturedCourseCard course={course} featured={index === 0} key={course.slug} />)}</div>
        <p className="mt-6 text-sm text-[#3f5061]">Coming soon means the course overview is visible, but the course is not yet open for learning.</p>
      </div>
    </section>
  );
}

function OutputsSection({ availableCourse }: { availableCourse?: PublicCatalogueCourseSummary }) {
  return (
    <section className="bg-[#eef8f2] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <SectionHeading eyebrow="Useful outputs" title="Create something you can review, adapt and reuse" description="The available HRBA course supports private reflection and analysis for your own CSO practice. Use fictional or non-confidential information during online activities, then adapt the method safely within your organisation." />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-[#cad5df] bg-white p-7"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f3fb] text-[#075e8e]"><DocumentIcon className="h-6 w-6" /></span><h3 className="mt-5 text-xl font-bold text-[#0b1f3a]">Private reflection and analysis</h3><p className="mt-3 text-sm leading-7 text-[#3f5061]">Review rights-holders, duty-bearers, barriers, participation and safe evidence in relation to your own work.</p></div>
          <div className="rounded-2xl bg-[#12365a] p-7 text-white"><h3 className="text-xl font-bold">Keep practice information safe</h3><p className="mt-3 text-sm leading-7 text-slate-200">Do not upload names, survivor stories, case records or other confidential information. Exact activities and outputs are confirmed on the course page.</p><ActionButton className="mt-6 border-white bg-white text-[#0b1f3a] hover:bg-slate-100 hover:text-[#0b1f3a]" href={availableCourse?.href ?? "/courses"} variant="secondary">View course outputs</ActionButton></div>
        </div>
      </div>
    </section>
  );
}

function OrganisationLearningSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 sm:px-7 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <div><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5f3fb] text-[#075e8e]"><PeopleIcon className="h-7 w-7" /></span><div className="mt-6"><SectionHeading eyebrow="From individual learning to organisational practice" title="Bring the learning back to your team" /></div><p className="mt-5 text-base leading-8 text-[#3f5061]">Each learner keeps an individual progress record. Your organisation can review course outputs together, adapt tools to its own systems and retain agreed resources for future staff.</p><p className="mt-5 text-sm font-semibold text-[#8a5600]">Team discussion happens within your organisation; in-platform peer exchange is planned for a later phase.</p></div>
        <ol className="space-y-5">{organisationSteps.map((item, index) => <StaticCard key={item.title} {...item} number={index + 1} />)}</ol>
      </div>
    </section>
  );
}

function FuturePathSection() {
  return (
    <section className="border-y border-[#cad5df] bg-[#f7f8f5] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <SectionHeading eyebrow="The Hub is growing" title="Learn now. Exchange and co-create later." description="The current Hub focuses on structured courses. Future phases are intended to support governed peer exchange, knowledge sharing and co-created practice after the learning foundation and safeguards are established." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">{futurePath.map((item, index) => <article className={`rounded-2xl border p-7 ${index === 0 ? "border-[#075e8e] bg-[#075e8e] text-white" : "border-[#cad5df] bg-white text-[#0b1f3a]"}`} key={item.title}><p className={`text-xs font-bold tracking-[0.14em] ${index === 0 ? "text-[#d8f1ff]" : "text-[#075e8e]"}`}>{item.status}</p><h3 className="mt-5 font-display text-3xl font-bold">{item.title}</h3><p className={`mt-3 text-sm leading-7 ${index === 0 ? "text-blue-50" : "text-[#3f5061]"}`}>{item.description}</p></article>)}</div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><ActionButton href="/courses" variant="secondary">Browse all capacity areas</ActionButton><p className="text-sm text-[#3f5061]">A capacity area may be listed before a course in that area is released.</p></div>
      </div>
    </section>
  );
}

function CurrentStatusSection({ availableCourse }: { availableCourse?: PublicCatalogueCourseSummary }) {
  const statusItems = [
    { title: "Available now", description: availableCourse ? `HRBA learning with ${availableCourse.duration.toLowerCase()} and an eligible certificate pathway.` : "HRBA learning with a certificate-eligible pathway." },
    { title: "Visible public functions", description: "Course catalogue, registration, sign-in and certificate verification." },
    { title: "Evidence after approval", description: "Pilot evidence will be added after review and approval." },
  ];
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10"><SectionHeading eyebrow="Clear about current status" title="A Phase One learning environment being tested and improved" description="The public experience currently shows individual learner access, an available HRBA course, progress-oriented learning and certificate verification. Additional courses and pilot evidence will be published only after DEC confirms their release and approves the evidence for public use." /><ul className="mt-10 grid gap-5 md:grid-cols-3">{statusItems.map((item) => <StaticCard key={item.title} {...item} />)}</ul><div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><ActionButton href="/verify-certificate" variant="secondary">Verify a certificate</ActionButton><p className="text-sm text-[#3f5061]">No pilot statistic or quotation is published without an approved source.</p></div></div>
    </section>
  );
}

function AccessAssuranceSection() {
  return (
    <section className="bg-[#eef8f2] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 sm:px-7 lg:grid-cols-[0.85fr_1.15fr] lg:px-10"><div><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#2f6b3b]"><ShieldIcon className="h-7 w-7" /></span><div className="mt-6"><SectionHeading eyebrow="Designed for practical access" title="Use the Hub on mobile, with clear text and manageable media" /></div><p className="mt-5 text-base leading-8 text-[#3f5061]">The public pages are designed for phone, tablet and desktop. Essential information appears as text, images have lightweight alternatives, and no video starts automatically. Course-specific download or offline options are shown only when they are available.</p><ActionButton className="mt-7" href="/accessibility" variant="secondary">Accessibility and connection guidance</ActionButton></div><ul className="grid gap-5 sm:grid-cols-2">{accessFeatures.map((item) => <StaticCard key={item.title} {...item} />)}</ul></div>
    </section>
  );
}

function ClosingCtaSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-7 sm:py-20 lg:px-10 lg:py-24">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl bg-[#071426] px-6 py-12 text-white sm:px-10 lg:px-12"><div aria-hidden="true" className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[28px] border-[#0878b9]/20" /><div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#72bee8]">Ready to begin?</p><h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.12] text-white">Choose a course and take one practical step forward</h2><p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">Browse the catalogue to see what is available now and what is coming next. If you received a course invitation, use the secure access instructions shared with you.</p><p className="mt-4 text-sm text-slate-300">Need access support? <a className="font-semibold text-white underline decoration-[#72bee8] underline-offset-4" href="/support">Open registration guidance.</a></p></div><div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><ActionButton href="/courses" size="lg">Explore courses</ActionButton><ActionButton className="border-white bg-white text-[#0b1f3a] hover:bg-slate-100 hover:text-[#0b1f3a]" href="/sign-in" size="lg" variant="secondary">Sign in</ActionButton></div></div></div>
    </section>
  );
}

export function LandingPage({ courses = [] }: { courses?: PublicCatalogueCourseSummary[] }) {
  const availableCourse = courses.find((course) => course.availability === "available");
  return (
    <div className="flex flex-col overflow-x-clip">
      <HeroSection />
      <ProgrammeStrip />
      <RealitiesSection />
      <PracticalValueSection />
      <AccessJourneySection />
      <LearningMethodSection availableCourse={availableCourse} />
      <FeaturedLearningSection courses={courses} />
      <OutputsSection availableCourse={availableCourse} />
      <OrganisationLearningSection />
      <FuturePathSection />
      <CurrentStatusSection availableCourse={availableCourse} />
      <AccessAssuranceSection />
      <ClosingCtaSection />
    </div>
  );
}
