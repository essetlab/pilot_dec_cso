# COMPONENT_LIBRARY.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Component Library Specification

## 1. Document purpose

This file defines the reusable UI component library for the DEC / WHH CSF+ CSO Learning Hub Phase 1 application.

Codex and any developer must use this file to build consistent, premium, accessible, responsive, and implementation-ready user-facing screens.

This file must be read together with:

```txt
docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
docs/design/DESIGN_SYSTEM.md
docs/design/CODEX_UI_SKILL.md
docs/design/VISUAL_QA_CHECKLIST.md
docs/design/UI_SCREEN_BLUEPRINTS.md
docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
docs/specs/phase-1-cso-learning-hub/ADMIN_PORTAL_SPEC.md
docs/specs/phase-1-cso-learning-hub/MONITORING_SPEC.md
```

The purpose is to prevent Codex from creating inconsistent one-off screens, weak UI, raw forms, rough placeholders, or generic admin templates.

---

## 2. Component-first rule

All user-facing UI must be built from reusable components.

Codex must not repeatedly hand-code inconsistent screen fragments.

Before building a major screen, Codex should identify which approved components are needed, create or reuse them, and then compose the screen from those components.

A technically working screen that bypasses the component library and creates inconsistent UI is not acceptable.

---

## 3. Component naming convention

Recommended folder structure:

```txt
src/components/
  layout/
  public/
  learner/
  creator/
  admin/
  monitoring/
  course/
  build-studio/
  ui/
```

Recommended naming:

```txt
PascalCase component names
Descriptive file names
One component per file where practical
Shared types in adjacent types.ts or src/lib/types
```

Examples:

```txt
src/components/ui/PageHeader.tsx
src/components/ui/StatusBadge.tsx
src/components/course/CourseCard.tsx
src/components/build-studio/BlockLibraryPanel.tsx
src/components/learner/LearnerCourseShell.tsx
```

Codex may adapt to existing repo conventions but must preserve a clear component-first structure.

---

## 4. Design token dependency

All components must use the approved design system values from:

```txt
docs/design/DESIGN_SYSTEM.md
```

Components should rely on:

1. approved DEC Blue and Green;
2. approved neutrals;
3. approved radii;
4. approved spacing;
5. approved shadows;
6. approved typography hierarchy;
7. approved status colors.

Do not use random colors or arbitrary UI styles unless there is a documented reason.

---

# 5. Global layout components

## 5.1 PublicShell

### Purpose

Wraps public pages such as landing, catalogue, course detail, sign-in, and register.

### Used on routes

```txt
/
/courses
/courses/[courseSlug]
/sign-in
/register
```

### Required structure

```txt
PublicShell
  PublicHeader
  main
  PublicFooter
```

### Required behavior

1. public navigation only;
2. no admin/creator links;
3. responsive navigation;
4. optional transparent hero nav for landing page;
5. dark footer with partner strip where appropriate.

### Props

```ts
type PublicShellProps = {
  children: React.ReactNode;
  variant?: "default" | "hero";
};
```

---

## 5.2 LearnerShell

### Purpose

Wraps participant-facing authenticated learning pages.

### Used on routes

```txt
/learn
/learn/my-courses
/learn/courses/[courseSlug]
/learn/courses/[courseSlug]/final-test
/learn/certificates
/learn/profile
```

### Required structure

```txt
LearnerShell
  LearnerTopBar
  LearnerNavigation
  main
```

### Required behavior

1. participant-focused navigation;
2. no admin/creator controls;
3. responsive nav;
4. clear active route;
5. accessible skip-to-content support where feasible.

### Props

```ts
type LearnerShellProps = {
  children: React.ReactNode;
  currentUser?: UserSummary;
};
```

---

## 5.3 CreatorShell

### Purpose

Wraps Course Creator portal pages.

### Used on routes

```txt
/creator
/creator/courses
/creator/courses/[courseId]/*
```

### Required structure

```txt
CreatorShell
  CreatorSidebar or CreatorTopNav
  CreatorTopBar
  main
```

### Required behavior

1. creator-only navigation;
2. clean course creation workflow;
3. no admin-only controls unless user also has admin role;
4. no heavy governance;
5. active course navigation when inside a course.

### Props

```ts
type CreatorShellProps = {
  children: React.ReactNode;
  courseContext?: CourseContextSummary;
};
```

---

## 5.4 AdminShell

### Purpose

Wraps Admin Portal pages.

### Used on routes

```txt
/admin/*
```

### Required structure

```txt
AdminShell
  AdminSidebar
  AdminTopBar
  main
```

### Required behavior

1. role-aware admin navigation;
2. no participant-facing course player controls;
3. no CRM/donor-management navigation;
4. no Phase 2/3 active modules;
5. responsive sidebar collapse.

### Props

```ts
type AdminShellProps = {
  children: React.ReactNode;
  currentUser?: UserSummary;
};
```

---

# 6. Navigation components

## 6.1 PublicHeader

### Purpose

Public top navigation for landing and public course pages.

### Items

```txt
Logo
Home
About
Courses or Catalog
Verify Certificate
Language selector
Sign In
Register
```

### Rules

1. Do not show Admin, Creator, Monitoring, or Build Studio.
2. Register button uses primary DEC Blue.
3. Sign In is lower emphasis.
4. Mobile nav collapses.
5. Active state is visible.

---

## 6.2 PublicFooter

### Purpose

Dark institutional footer.

### Required content

1. platform identity;
2. short platform description;
3. platform links;
4. account links;
5. contact/social links if available;
6. partner logo strip;
7. copyright;
8. privacy/terms links if implemented.

### Rules

1. use Deep Navy background;
2. partner logos should be small and balanced;
3. footer must not become too tall;
4. mobile footer stacks cleanly.

---

## 6.3 LearnerNavigation

### Items

```txt
Dashboard
My Courses
Certificates
Profile
```

### Rules

1. use participant-friendly labels;
2. no admin/creator language;
3. active state visible;
4. collapsible on mobile.

---

## 6.4 CreatorNavigation

### Items

```txt
My Courses
Setup
Metadata
Outcomes
Build Studio
Resources
Final Test
Preview
Submit / Feedback
```

### Rules

1. should feel like course production workflow;
2. no heavy diagnosis/capacity map/action map screens;
3. active route clearly indicated;
4. compact enough for repeated use.

---

## 6.5 AdminNavigation

### Items

```txt
Dashboard
Users
Organizations
Cohorts
Courses
Review / Publish
Certificates
Reference Data
Monitoring
Audit Log
Settings
```

### Rules

1. role-aware;
2. no CRM/donor management;
3. no future Phase 2/3 active modules;
4. readable at desktop and tablet widths.

---

# 7. Core shared UI components

## 7.1 PageHeader

### Purpose

Provides consistent page identity.

### Props

```ts
type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  variant?: "public" | "app" | "compact";
};
```

### Rules

1. title must be user-facing;
2. subtitle must be concise;
3. no developer language;
4. public variant may use editorial typography;
5. app variant uses clean sans-serif.

---

## 7.2 SectionHeader

### Purpose

Provides section titles within pages.

### Props

```ts
type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};
```

### Rules

1. keep short;
2. align with section content;
3. avoid long explanations.

---

## 7.3 ActionButton

### Purpose

Reusable button with approved variants.

### Props

```ts
type ActionButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  href?: string;
  disabled?: boolean;
  loading?: boolean;
};
```

### Rules

1. primary uses DEC Blue;
2. success uses DEC Green only when appropriate;
3. danger for destructive actions only;
4. disabled state must remain understandable;
5. focus state visible.

---

## 7.4 StatusBadge

### Purpose

Consistent badges for access, progress, course lifecycle, certificates, and review states.

### Props

```ts
type StatusBadgeProps = {
  label: string;
  tone?: "blue" | "green" | "gray" | "orange" | "red" | "purple" | "gold";
  icon?: React.ReactNode;
};
```

### Rules

1. participants must not see internal lifecycle badges;
2. use no more than 2–3 badges per card where possible;
3. label must be plain language.

---

## 7.5 EmptyState

### Purpose

Polished empty state for lists, dashboards, and panels.

### Props

```ts
type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
};
```

### Rules

1. never say placeholder, mock, DB, scaffold, or coming soon;
2. short and supportive;
3. action included only if useful.

---

## 7.6 AlertMessage

### Purpose

Displays information, success, warning, or error messages.

### Props

```ts
type AlertMessageProps = {
  tone: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
};
```

### Rules

1. use clear language;
2. do not expose stack traces;
3. warning/error must explain next step.

---

## 7.7 MetricCard

### Purpose

Displays a dashboard or monitoring KPI.

### Props

```ts
type MetricCardProps = {
  label: string;
  value: string | number;
  helperText?: string;
  icon?: React.ReactNode;
  trend?: string;
  tone?: "blue" | "green" | "gray" | "orange" | "red";
};
```

### Rules

1. keep label short;
2. use large readable value;
3. do not overuse trend indicators;
4. do not display misleading impact claims.

---

## 7.8 FilterBar

### Purpose

Reusable search and filter container.

### Props

```ts
type FilterBarProps = {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
};
```

### Rules

1. keep filters readable;
2. avoid too many controls above the fold;
3. include clear filters where useful;
4. mobile layout stacks.

---

## 7.9 DataTable

### Purpose

Reusable admin/monitoring table wrapper.

### Props

```ts
type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  emptyState?: React.ReactNode;
  rowActions?: (row: T) => React.ReactNode;
};
```

### Rules

1. do not create overly wide tables;
2. use badges for statuses;
3. mobile must scroll safely or adapt;
4. no raw IDs as primary display unless necessary.

---

## 7.10 FormSection

### Purpose

Groups related form fields.

### Props

```ts
type FormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};
```

### Rules

1. one clear purpose per section;
2. avoid very long ungrouped forms;
3. helper text concise.

---

## 7.11 Field components

Required field components:

```txt
TextField
TextareaField
SelectField
CheckboxField
RadioGroupField
SwitchField
DateField
```

### Shared rules

1. visible label;
2. optional helper text;
3. error message;
4. accessible input association;
5. focus state;
6. no internal field names exposed to users.

---

# 8. Public and course discovery components

## 8.1 HeroSection

### Purpose

Landing page hero preserving the previous contextual, editorial direction.

### Props

```ts
type HeroSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
  trustMarkers?: string[];
  backgroundImageUrl?: string;
};
```

### Rules

1. use contextual local CSO learning imagery;
2. use dark navy overlay;
3. large editorial headline;
4. maximum two CTAs;
5. no admin/creator links;
6. mobile text remains readable.

---

## 8.2 FeatureCard

### Purpose

Landing page value cards.

### Props

```ts
type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "blue" | "green" | "orange" | "neutral";
};
```

### Rules

1. four cards maximum in core feature row;
2. concise text;
3. consistent icon treatment;
4. soft card design.

---

## 8.3 CourseCard

### Purpose

Reusable course display card for catalogue, learner dashboard, and public course showcase.

### Props

```ts
type CourseCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  capacityArea?: string;
  level?: string;
  duration?: string;
  lessonCount?: number;
  accessLabel?: string;
  certificateEligible?: boolean;
  progressPercent?: number;
  href: string;
  actionLabel?: string;
  variant?: "catalogue" | "compact" | "dashboard";
};
```

### Rules

1. fixed image ratio;
2. clamp description;
3. consistent metadata row;
4. no draft/internal status on public/learner cards;
5. certificate indicator uses DEC Green;
6. card must work in 1, 2, and 3 column grids.

---

## 8.4 FeaturedCourseCard

### Purpose

Large highlighted course in catalogue or landing page.

### Props

```ts
type FeaturedCourseCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  capacityArea?: string;
  level?: string;
  duration?: string;
  accessLabel?: string;
  certificateEligible?: boolean;
  href: string;
};
```

### Rules

1. visually aligned with CourseCard;
2. stronger but not inconsistent;
3. CTA clear;
4. mobile stacks image and content.

---

## 8.5 LearningExperienceGrid

### Purpose

Displays what the learning experience includes.

### Items

```txt
Structured journeys
Interactive blocks
Knowledge checks
Progress tracking
Resource library
Certificates
```

### Rules

1. 2 or 3 column grid desktop;
2. 1 column mobile;
3. simple icons;
4. no long descriptions.

---

## 8.6 CTASection

### Purpose

Large public call-to-action panel.

### Props

```ts
type CTASectionProps = {
  title: string;
  description?: string;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
};
```

### Rules

1. use DEC Blue panel;
2. rounded large panel;
3. white text;
4. no clutter;
5. mobile buttons stack.

---

# 9. Learner components

## 9.1 LearnerWelcomePanel

### Purpose

Dashboard welcome area.

### Props

```ts
type LearnerWelcomePanelProps = {
  name: string;
  subtitle?: string;
};
```

### Rules

1. warm and supportive;
2. not admin-like;
3. no internal status language.

---

## 9.2 ContinueLearningCard

### Purpose

Main learner dashboard card for resuming course.

### Props

```ts
type ContinueLearningCardProps = {
  courseTitle: string;
  lessonTitle?: string;
  progressPercent: number;
  href: string;
  lastAccessedLabel?: string;
};
```

### Rules

1. visually prominent;
2. clear Continue Learning button;
3. progress easy to understand.

---

## 9.3 ProgressCard

### Purpose

Shows learning progress summary.

### Props

```ts
type ProgressCardProps = {
  label: string;
  value: string | number;
  helperText?: string;
  icon?: React.ReactNode;
};
```

---

## 9.4 LearnerCourseShell

### Purpose

Wraps participant course player.

### Structure

```txt
LearnerCourseShell
  CoursePlayerHeader
  CourseOutline
  LessonContent
```

### Props

```ts
type LearnerCourseShellProps = {
  course: CourseSummary;
  outline: CourseOutlineItem[];
  currentLessonId?: string;
  children: React.ReactNode;
};
```

### Rules

1. no creator/admin controls;
2. course outline collapses on mobile;
3. progress visible but not overwhelming.

---

## 9.5 CoursePlayerHeader

### Props

```ts
type CoursePlayerHeaderProps = {
  title: string;
  progressPercent: number;
  currentModule?: string;
  currentLesson?: string;
};
```

---

## 9.6 CourseOutline

### Purpose

Displays module/lesson navigation.

### Props

```ts
type CourseOutlineProps = {
  modules: CourseOutlineModule[];
  currentLessonId?: string;
};
```

### Rules

1. current lesson highlighted;
2. completed lessons marked;
3. accessible buttons/links;
4. mobile collapsible.

---

## 9.7 LessonContent

### Purpose

Displays lesson title, description, blocks, and navigation controls.

### Props

```ts
type LessonContentProps = {
  title: string;
  description?: string;
  blocks: ContentBlockSummary[];
  previousHref?: string;
  nextHref?: string;
};
```

---

## 9.8 CertificateCard

### Purpose

Shows earned certificate in learner dashboard/list.

### Props

```ts
type CertificateCardProps = {
  courseTitle: string;
  issuedAt?: string;
  certificateCode?: string;
  href?: string;
  locked?: boolean;
};
```

### Rules

1. earned certificate feels like an achievement;
2. locked state is supportive;
3. no internal certificate logic exposed.

---

# 10. Learner block renderer components

Every Build Studio block that can be added must eventually have learner rendering.

## 10.1 LessonBlockRenderer

### Purpose

Routes a content block to the correct learner component.

### Props

```ts
type LessonBlockRendererProps = {
  block: ContentBlockSummary;
};
```

### Required supported types

```txt
TEXT
VIDEO
AUDIO
IMAGE
RESOURCE
EXTERNAL_LINK
CASE_STUDY
REFLECTION_PROMPT
KEY_MESSAGE
ACCORDION
FLASHCARD
BUTTON_CTA
KNOWLEDGE_CHECK
MULTIPLE_CHOICE_QUESTION
TRUE_FALSE_QUESTION
SHORT_ANSWER_PROMPT
BRANCHING_SCENARIO
PRACTICAL_ACTIVITY_PROMPT
```

If a type is not fully implemented, show a polished safe fallback and document the gap. Do not show raw JSON.

---

## 10.2 TextBlockView

Readable article-like content section.

## 10.3 VideoBlockView

Video card with title, player area, duration, and transcript section.

## 10.4 ImageBlockView

Image with caption and alt text support.

## 10.5 ResourceBlockView

Download card with title, description, file type, and download action.

## 10.6 CaseStudyBlockView

Distinct contextual scenario card with guiding question and learning point.

## 10.7 KeyMessageBlockView

Callout with info/success/warning/neutral tone.

## 10.8 AccordionBlockView

Accessible accordion.

## 10.9 FlashcardBlockView

Accessible reveal card interaction.

## 10.10 KnowledgeCheckBlockView

Interactive low-stakes question with feedback.

## 10.11 BranchingScenarioBlockView

One-step branching choice with feedback.

## 10.12 PracticalActivityBlockView

Application task card.

## 10.13 ReflectionPromptBlockView

Self-reflection card; responses private if stored.

---

# 11. Course Creator components

## 11.1 CreatorCourseCard

### Purpose

Shows a course in creator My Courses.

### Props

```ts
type CreatorCourseCardProps = {
  title: string;
  status: string;
  capacityArea?: string;
  updatedAt?: string;
  readinessLabel?: string;
  href: string;
  previewHref?: string;
};
```

### Rules

1. show internal statuses only in creator/admin context;
2. no admin-only actions unless authorized;
3. clear Continue Editing action.

---

## 11.2 CourseContextBar

### Purpose

Compact bar showing selected course context.

### Props

```ts
type CourseContextBarProps = {
  title: string;
  status: string;
  capacityArea?: string;
  version?: string;
  updatedAt?: string;
};
```

### Rules

1. compact;
2. not a dashboard;
3. no heavy governance metadata.

---

## 11.3 CourseSetupForm

Grouped form for core course data.

## 11.4 CourseMetadataForm

Grouped form for lightweight capacity linkage.

Must not become full diagnosis/capacity map workflow.

## 11.5 LearningOutcomeList

Add/edit/reorder learning outcomes.

---

# 12. Build Studio components

## 12.1 BuildStudioShell

### Purpose

Top-level Build Studio workspace.

### Structure

```txt
BuildStudioShell
  BuildStudioHeader
  BuildStudioWorkspace
    BlockLibraryPanel / CourseOutlinePanel
    CourseCanvas
    BlockConfigPanel
```

### Rules

1. must preserve three-column desktop layout;
2. responsive panels may collapse;
3. no governance/CRM/monitoring panels;
4. canvas remains focused on course content.

---

## 12.2 BuildStudioHeader

### Props

```ts
type BuildStudioHeaderProps = {
  courseTitle: string;
  status: string;
  saveState?: "saved" | "saving" | "unsaved" | "error";
  onPreview?: () => void;
  onSave?: () => void;
};
```

### Rules

1. compact;
2. includes preview;
3. includes save state;
4. no large workflow cards.

---

## 12.3 BlockLibraryPanel

### Purpose

Lists available block types.

### Props

```ts
type BlockLibraryPanelProps = {
  blocks: BlockLibraryItem[];
  onAddBlock: (type: ContentBlockType) => void;
};
```

### Rules

1. categories visible;
2. search available if many blocks;
3. clear add action;
4. concise descriptions.

---

## 12.4 CourseOutlinePanel

### Purpose

Shows modules and lessons.

### Props

```ts
type CourseOutlinePanelProps = {
  modules: BuildStudioModule[];
  selectedLessonId?: string;
  onSelectLesson: (lessonId: string) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
};
```

---

## 12.5 CourseCanvas

### Purpose

Main lesson authoring canvas.

### Props

```ts
type CourseCanvasProps = {
  lesson?: BuildStudioLesson;
  blocks: BuildStudioBlock[];
  selectedBlockId?: string;
  onSelectBlock: (blockId: string) => void;
  onAddBlock: () => void;
  onMoveBlock?: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock?: (blockId: string) => void;
  onDeleteBlock?: (blockId: string) => void;
};
```

### Rules

1. no full configuration forms;
2. shows block previews;
3. selected block is clear;
4. empty state is helpful.

---

## 12.6 CanvasBlockCard

### Purpose

Represents one block in the authoring canvas.

### Props

```ts
type CanvasBlockCardProps = {
  block: BuildStudioBlock;
  selected?: boolean;
  warning?: string;
  onSelect: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
};
```

### Rules

1. show block type;
2. show title;
3. show short preview;
4. show lightweight warning only;
5. no full config form.

---

## 12.7 BlockConfigPanel

### Purpose

Configures the selected block.

### Props

```ts
type BlockConfigPanelProps = {
  block?: BuildStudioBlock;
  onChange?: (updates: Record<string, unknown>) => void;
};
```

### Rules

1. show only selected block fields;
2. no monitoring;
3. no diagnosis;
4. no CRM;
5. no donor compliance.

---

## 12.8 ReadinessChip

Small lightweight readiness indicator.

Do not use large readiness dashboards inside Build Studio.

---

# 13. Admin components

## 13.1 AdminDashboardCards

KPI card grid using MetricCard.

## 13.2 QuickActionCard

### Props

```ts
type QuickActionCardProps = {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
};
```

## 13.3 AdminListPage

Reusable shell for admin list screens.

### Props

```ts
type AdminListPageProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
};
```

## 13.4 UserTable

For `/admin/users`.

## 13.5 OrganizationTable

For `/admin/organizations`.

## 13.6 CohortTable

For `/admin/cohorts`.

## 13.7 AdminCourseTable

For `/admin/courses`.

## 13.8 ReviewQueueTable

For `/admin/review`.

## 13.9 CertificateTable

For `/admin/certificates`.

## 13.10 AuditLogTable

For `/admin/audit-log`.

### Admin table rules

1. avoid too many columns;
2. use clear row actions;
3. use StatusBadge;
4. use EmptyState;
5. do not expose sensitive data unnecessarily.

---

# 14. Monitoring components

## 14.1 MonitoringFilterBar

Filters:

```txt
Course
Cohort
Organization
Region
Capacity Area
Date Range
Course Status
```

## 14.2 MonitoringKpiGrid

Uses MetricCard.

Required metrics:

1. registered participants;
2. active participants;
3. CSO organizations;
4. cohorts;
5. published courses;
6. enrollments;
7. completion rate;
8. final test pass rate;
9. certificates issued;
10. average feedback rating.

## 14.3 AttentionSignalCard

### Props

```ts
type AttentionSignalCardProps = {
  title: string;
  description: string;
  tone?: "warning" | "info" | "success";
  href?: string;
};
```

### Rules

1. concise;
2. no complex risk scoring;
3. no long-term impact claims.

## 14.4 CourseProgressTable

Columns:

1. course title;
2. capacity area;
3. enrollments;
4. active participants;
5. completed;
6. completion rate;
7. pass rate;
8. certificates;
9. feedback rating.

## 14.5 CohortProgressTable

## 14.6 OrganizationParticipationTable

## 14.7 AssessmentSummaryPanel

## 14.8 FeedbackSummaryPanel

---

# 15. Auth and access components

## 15.1 SignInCard

### Purpose

Polished sign-in/demo role selector.

### Rules

1. no “fake login” language;
2. if demo role selector remains, say “Choose a demo role to preview the platform”;
3. no technical auth language;
4. clean centered card.

## 15.2 UnauthorizedCard

### Copy

```txt
You do not have access to this area.
Please sign in with an account that has the required permission.
```

### Rules

1. do not reveal sensitive permission internals;
2. provide action to return home or sign in;
3. calm tone.

---

# 16. Certificate components

## 16.1 CertificatePreview

Displays certificate detail.

Required fields:

1. participant name;
2. course title;
3. issuer;
4. completion date;
5. certificate code;
6. download action.

## 16.2 CertificateLockedState

Supportive locked state for incomplete course.

---

# 17. Accessibility requirements for all components

Every component must support:

1. semantic HTML;
2. keyboard access;
3. visible focus;
4. accessible labels;
5. appropriate ARIA only where needed;
6. readable contrast;
7. no color-only status;
8. responsive behavior;
9. no horizontal overflow.

Interactive components such as accordions, flashcards, dropdowns, dialogs, and drawers must be keyboard usable.

---

# 18. Visual QA requirements for component implementation

Any Codex slice that creates or changes components must include:

```txt
Premium UI / Component QA:
- Components created/changed
- Screens using them
- Design system compliance
- Responsive behavior notes
- Accessibility notes
- Developer-language check
- Screenshot/visual evidence if routes changed
- Known visual gaps
```

---

# 19. Component implementation order

Recommended order:

1. design tokens and base UI components;
2. global shells and navigation;
3. public components;
4. course card components;
5. learner shell and course player components;
6. creator shell and course setup components;
7. Build Studio components;
8. admin components;
9. monitoring components;
10. certificate and feedback components.

This order may be adjusted for implementation slices, but Codex must not build major screens without the relevant component foundations.

---

# 20. Stop conditions

Codex must stop and report if:

1. a screen requires a component not yet defined and the design decision is unclear;
2. implementation would create a one-off inconsistent UI;
3. a component would expose developer language;
4. a component would expose Phase 2/3 active modules;
5. a component would add CRM/donor management UI;
6. Build Studio components start showing governance/diagnosis/monitoring panels;
7. accessibility cannot be reasonably supported in the component design.

---

# 21. Final component-library statement

The component library is a quality-control mechanism.

It ensures the CSO Learning Hub looks consistent with the approved visual source of truth, supports premium learner-facing experience, keeps Build Studio clean, and prevents Codex from producing weak or inconsistent UI.

Codex must build from these components rather than improvising screens.
