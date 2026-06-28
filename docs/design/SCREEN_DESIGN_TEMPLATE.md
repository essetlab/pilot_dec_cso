# SCREEN_DESIGN_TEMPLATE.md

# DEC / WHH CSF+ CSO Learning Hub — Per-Screen DESIGN.md Template

## 1. Document purpose

This file defines the required template for every approved screen-level design specification in the DEC / WHH CSF+ CSO Learning Hub.

After a golden mockup is approved, create a `DESIGN.md` file for that screen using this template.

The `DESIGN.md` file is the bridge between visual mockup and Codex implementation.

A screenshot alone is not enough for Codex.

---

## 2. Where screen design files should live

Use this folder structure:

```txt
docs/design/screens/
  01_landing/
    screen.png
    DESIGN.md
    IMPLEMENTATION_NOTES.md optional

  02_course_catalogue/
    screen.png
    DESIGN.md
    IMPLEMENTATION_NOTES.md optional

  03_course_detail/
    screen.png
    DESIGN.md

  04_learner_dashboard/
    screen.png
    DESIGN.md

  05_learner_course_player/
    screen.png
    DESIGN.md

  06_certificate_page/
    screen.png
    DESIGN.md

  07_creator_my_courses/
    screen.png
    DESIGN.md

  08_build_studio/
    screen.png
    DESIGN.md

  09_admin_dashboard/
    screen.png
    DESIGN.md

  10_monitoring_dashboard/
    screen.png
    DESIGN.md
```

Use lowercase folder names and stable numbering so Codex can find the files.

---

## 3. Required related files

Each screen-level `DESIGN.md` must reference:

```txt
docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
docs/design/DESIGN_SYSTEM.md
docs/design/COMPONENT_LIBRARY.md
docs/design/CODEX_UI_SKILL.md
docs/design/VISUAL_QA_CHECKLIST.md
docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
```

Also reference the relevant product spec:

```txt
Landing / Catalogue / Course Detail:
- LEARNER_TEMPLATE_SPEC.md
- PRODUCT_SPEC.md

Learner Dashboard / Course Player / Certificates:
- LEARNER_TEMPLATE_SPEC.md

Creator / Build Studio:
- BUILD_STUDIO_SPEC.md
- PRODUCT_SPEC.md

Admin:
- ADMIN_PORTAL_SPEC.md

Monitoring:
- MONITORING_SPEC.md
```

---

# 4. Screen DESIGN.md template

Copy the full template below into each screen folder and complete it.

```md
# DESIGN.md

# [SCREEN NAME] — Design Specification

## 1. Screen identity

**Screen name:**  
[Example: Public Landing Page]

**Route:**  
[Example: `/`]

**Experience zone:**  
[Public / Learner / Creator / Admin / Monitoring]

**Primary users:**  
[Example: Public visitors, CSO participants, DEC/WHH stakeholders]

**Design status:**  
[Draft / Approved / Needs revision]

**Approved visual reference:**  
`docs/design/screens/[folder]/screen.png`

---

## 2. Purpose

Describe what this screen helps users do.

Example:

This screen introduces the CSO Learning Hub, communicates its value for local and grassroots CSOs, and directs users to browse courses or sign in.

---

## 3. Source of visual continuity

This screen must align with:

- `docs/design/00_VISUAL_SOURCE_OF_TRUTH.md`
- the previously presented landing page and course catalogue visual direction
- DEC brand colors and the grounded local CSO learning-platform tone

State what should be preserved from the approved visual direction.

Example:

Preserve the contextual local learning imagery, editorial headline feeling, rounded course cards, strong CTA style, and dark institutional footer direction.

---

## 4. Layout structure

Describe the full layout from top to bottom.

Example:

1. Public header
2. Hero section
3. Core feature cards
4. About/platform explanation
5. Course showcase
6. Learning experience grid
7. CTA section
8. Footer

For app screens, describe shell + main content.

Example:

1. Admin shell
2. Page header
3. KPI card grid
4. Quick actions
5. Courses needing attention
6. Recent activity

---

## 5. Component map

List the components that Codex must use or create.

Example:

```txt
PublicShell
PublicHeader
HeroSection
FeatureCard
CourseCard
CTASection
PublicFooter
```

For Build Studio:

```txt
CreatorShell
BuildStudioShell
BuildStudioHeader
BlockLibraryPanel
CourseOutlinePanel
CourseCanvas
CanvasBlockCard
BlockConfigPanel
```

---

## 6. Content requirements

List the required user-facing content.

### Required text

```txt
Title:
Subtitle:
Primary CTA:
Secondary CTA:
Section headings:
```

### Required data fields

```txt
Course title
Capacity area
Duration
Certificate eligible
Progress
Status
```

### Content rules

- Do not reuse outdated prototype text unless explicitly approved.
- Do not include developer language.
- Use current Phase 1 messaging.
- Keep copy concise.

---

## 7. Visual design requirements

Describe the required visual treatment.

### Color

```txt
Primary: DEC Blue #3B99D4
Accent: DEC Green #91C852
Background: #F9FAFB
Surface: #FFFFFF
Text: #111827
Footer/Navy: #0F172A
```

### Typography

```txt
Hero/Page heading:
Section heading:
Body:
Meta text:
```

### Cards and surfaces

```txt
Radius:
Shadow:
Border:
Padding:
```

### Imagery

Describe image type, ratio, overlays, and local/contextual requirements.

### Icons

Describe icon style and use.

---

## 8. Interaction behavior

Describe how users interact with the screen.

Examples:

- search filters update course cards;
- course card opens course detail;
- CTA routes to `/courses`;
- course outline expands/collapses;
- block card selection updates right panel;
- final test submit shows result state.

---

## 9. Responsive behavior

Describe desktop, tablet, and mobile behavior.

### Desktop

```txt
[Describe layout]
```

### Tablet

```txt
[Describe layout]
```

### Mobile

```txt
[Describe layout]
```

Required mobile checks:

- no horizontal overflow;
- cards stack cleanly;
- buttons are tappable;
- navigation collapses;
- content remains readable.

---

## 10. Accessibility requirements

List screen-specific accessibility rules.

At minimum:

- semantic headings;
- visible focus states;
- keyboard-accessible controls;
- sufficient contrast;
- image alt text;
- form labels where relevant;
- no color-only meaning.

For interactive screens, add relevant requirements.

---

## 11. Empty, loading, and error states

Describe states that must be implemented.

### Empty state

```txt
Headline:
Description:
Action:
```

### Loading state

```txt
Skeletons / loading rows / button loading state
```

### Error state

```txt
Human-readable message and next step
```

Do not use technical error language.

---

## 12. Data and integration notes

Describe data source expectations.

Examples:

- Course cards should eventually come from published `Course` records.
- Learner progress should come from `Enrollment` and `LessonProgress`.
- Monitoring metrics should come from approved Phase 1 data model.
- In early UI slices, safe seed/demo data may be used.

Do not hard-code final content unless explicitly directed.

---

## 13. Scope restrictions

Explicitly list what must not appear on this screen.

Example for public screens:

- no admin controls;
- no creator controls;
- no draft/internal review status;
- no Phase 2/3 modules;
- no CRM/donor-management UI;
- no developer language.

Example for Build Studio:

- no diagnosis panels;
- no capacity map/action map panels;
- no monitoring charts;
- no donor compliance panels;
- no heavy governance cards.

---

## 14. Acceptance criteria

List the screen-specific acceptance criteria.

Example:

- screen matches approved mockup direction;
- uses approved components;
- uses DEC brand tokens;
- no developer language visible;
- responsive layout works;
- accessibility basics pass;
- route loads without runtime error;
- role-inappropriate controls are not visible.

---

## 15. Visual QA checklist

Use this checklist after implementation.

```txt
[ ] Screen follows approved mockup direction.
[ ] Screen uses approved design system.
[ ] Screen uses approved components.
[ ] No developer language appears.
[ ] No Phase 2/3 active modules appear.
[ ] No CRM/donor-management UI appears.
[ ] Desktop visual check completed.
[ ] Mobile visual check completed.
[ ] Accessibility basics checked.
[ ] Empty/loading/error states are polished.
[ ] Stakeholder-demo quality: PASS / PARTIAL / FAIL.
```

---

## 16. Codex implementation instruction

Use this section as the direct implementation instruction.

Example:

Codex must implement this screen using the approved mockup and this `DESIGN.md`. Codex must not invent a new layout or visual style. If a technical constraint prevents matching the mockup, Codex must report the constraint in the evidence pack and implement the closest accessible, responsive equivalent.

---

## 17. Evidence pack requirements

After implementation, Codex must report:

- files changed;
- components created/updated;
- route affected;
- data/schema changes, if any;
- role/permission changes, if any;
- tests/checks run;
- screenshots or visual evidence;
- desktop/mobile visual QA notes;
- accessibility notes;
- known visual gaps;
- scope-control confirmation;
- final status.
```

---

# 5. Landing page DESIGN.md starter

Use this starter for:

```txt
docs/design/screens/01_landing/DESIGN.md
```

```md
# Public Landing Page — Design Specification

## 1. Screen identity

**Screen name:** Public Landing Page  
**Route:** `/`  
**Experience zone:** Public  
**Primary users:** Public visitors, CSO participants, DEC/WHH stakeholders, programme partners  
**Design status:** Draft until golden mockup is approved  
**Approved visual reference:** `docs/design/screens/01_landing/screen.png`

---

## 2. Purpose

Introduce the CSO Learning Hub, communicate its value for local and grassroots CSOs, and guide users to explore courses or sign in.

---

## 3. Source of visual continuity

This screen must preserve the direction of the previously presented landing page:

- contextual local CSO learning hero image;
- editorial headline feel;
- premium sectioned storytelling;
- course showcase;
- strong CTA panel;
- dark institutional footer with partner recognition.

It must improve DEC brand alignment, spacing, component consistency, and messaging.

---

## 4. Layout structure

1. PublicHeader
2. HeroSection
3. Core Feature Cards
4. About the Platform
5. Course Showcase
6. Learning Experience Grid
7. CTASection
8. PublicFooter

---

## 5. Component map

```txt
PublicShell
PublicHeader
HeroSection
FeatureCard
SectionHeader
CourseCard
CTASection
PublicFooter
```

---

## 6. Content requirements

Hero:

```txt
Eyebrow: DEC Learning Platform
Headline: Learn, Adapt, Grow
Subtitle: Practical digital learning for local and grassroots CSOs.
Primary CTA: Explore Courses
Secondary CTA: Start Learning
Trust markers: Mobile-friendly, Practical, Step-by-step, Certificate-ready
```

Core features:

```txt
Practical and work-ready
Grounded in local CSO realities
Structured learning journeys
Certificates and progress tracking
```

Course showcase:

```txt
Proposal Development Fundamentals for Grassroots CSOs
Financial Management Basics for Local CSOs
Safeguarding Essentials for Grassroots CSOs
```

---

## 7. Visual design requirements

Use DEC Blue #3B99D4, DEC Green #91C852, Deep Navy #0F172A, Light Background #F9FAFB, white cards, rounded 20–32px sections, soft shadows, and editorial public headings.

Hero image must be contextual and locally grounded. Use dark overlay for readability.

---

## 8. Interaction behavior

- Explore Courses links to `/courses`.
- Start Learning links to `/sign-in` or `/learn` depending on auth state.
- Course cards link to course detail pages.
- Register links to `/register`.
- Sign In links to `/sign-in`.

---

## 9. Responsive behavior

Desktop: full hero and multi-column sections.  
Tablet: two-column cards where feasible.  
Mobile: stacked hero, collapsed nav, single-column cards, footer stacked.

---

## 10. Accessibility requirements

Hero text contrast must be high over image overlay. Buttons must be keyboard accessible. Images require alt text. Navigation must be keyboard usable.

---

## 11. Empty, loading, and error states

Landing page is mostly static; if course cards are data-driven and no courses are available, show a polished empty state or hide the course showcase gracefully.

---

## 12. Data and integration notes

Course showcase may use seeded published courses until real content is available. Do not show draft courses.

---

## 13. Scope restrictions

No admin links, creator links, internal route names, Phase 2/3 modules, CRM/donor-management elements, developer language, or outdated prototype copy.

---

## 14. Acceptance criteria

- visually connected to previous landing page direction;
- improved polish and DEC brand consistency;
- public route loads correctly;
- no internal controls visible;
- responsive layout works;
- no developer language appears;
- stakeholder-demo quality is at least PASS or PARTIAL with minor gaps.

---

## 15. Visual QA checklist

```txt
[ ] Follows approved mockup direction.
[ ] Uses approved design system.
[ ] Uses approved components.
[ ] Hero is readable and premium.
[ ] Course cards are consistent.
[ ] Footer is polished.
[ ] No developer language.
[ ] No Phase 2/3 active modules.
[ ] Desktop and mobile checked.
[ ] Stakeholder-demo quality: PASS / PARTIAL / FAIL.
```
```

---

# 6. Course catalogue DESIGN.md starter

Use this starter for:

```txt
docs/design/screens/02_course_catalogue/DESIGN.md
```

```md
# Course Catalogue — Design Specification

## 1. Screen identity

**Screen name:** Course Catalogue  
**Route:** `/courses`  
**Experience zone:** Public / learner discovery  
**Primary users:** Public visitors and CSO participants  
**Design status:** Draft until golden mockup is approved  
**Approved visual reference:** `docs/design/screens/02_course_catalogue/screen.png`

---

## 2. Purpose

Help users discover published CSO learning courses through a polished catalogue with search, filters, featured course, and consistent course cards.

---

## 3. Source of visual continuity

This screen must preserve the previous catalogue’s large page identity, featured course concept, search/filter area, and card-based course browsing, while improving consistency, hierarchy, spacing, badge treatment, and brand alignment.

---

## 4. Layout structure

1. PublicHeader
2. PageHeader
3. Search and FilterBar
4. FeaturedCourseCard
5. CourseCard grid
6. PublicFooter or compact footer

---

## 5. Component map

```txt
PublicShell
PublicHeader
PageHeader
FilterBar
FeaturedCourseCard
CourseCard
StatusBadge
EmptyState
PublicFooter
```

---

## 6. Content requirements

Page header:

```txt
Eyebrow: Learning Portal
Title: Course Catalog
Subtitle: Explore practical courses designed for local and grassroots CSOs.
```

Featured course:

```txt
Proposal Development Fundamentals for Grassroots CSOs
Capacity Area: Proposal Development
Duration: 90 minutes
Level: Foundational
Certificate: Certificate included
Access: Public
CTA: Explore Course
```

Course grid examples:

```txt
Proposal Development Fundamentals for Grassroots CSOs
Financial Management Basics for Local CSOs
Safeguarding Essentials for Grassroots CSOs
Governance Basics for Local CSOs
MEAL Foundations for Local CSOs
Human Rights-Based Approach in Practice
```

---

## 7. Visual design requirements

Use a consistent course card system with fixed image ratio, rounded cards, subtle shadows, readable badges, and clean metadata rows.

Filters must appear in a polished bar, not as disconnected controls.

---

## 8. Interaction behavior

- Search filters course cards.
- Dropdown filters refine visible courses.
- Course cards link to `/courses/[courseSlug]`.
- Featured course CTA links to course detail.

---

## 9. Responsive behavior

Desktop: 3-column course grid.  
Tablet: 2-column course grid.  
Mobile: 1-column course grid, stacked filters.

---

## 10. Accessibility requirements

Search and filters must have labels. Course card links must be keyboard accessible. Images require alt text. Badge meaning must not rely only on color.

---

## 11. Empty, loading, and error states

Empty state:

```txt
No courses are available yet.
Published courses will appear here when they are ready.
```

Loading state should use course card skeletons if data is async.

---

## 12. Data and integration notes

Only published courses should appear. Do not show draft, returned, approved-but-unpublished, archived, or internal review status.

---

## 13. Scope restrictions

No admin controls, creator controls, internal statuses, Phase 2/3 modules, CRM/donor-management UI, or developer language.

---

## 14. Acceptance criteria

- course cards are visually consistent;
- filters are clean and usable;
- only published courses appear;
- catalogue is responsive;
- no internal controls visible;
- no developer language;
- stakeholder-demo quality is PASS or PARTIAL with minor gaps.

---

## 15. Visual QA checklist

```txt
[ ] Follows approved catalogue mockup direction.
[ ] Uses consistent course card system.
[ ] Search/filter bar is polished.
[ ] Featured course card fits the system.
[ ] No draft/internal course status.
[ ] No developer language.
[ ] Desktop and mobile checked.
[ ] Stakeholder-demo quality: PASS / PARTIAL / FAIL.
```
```

---

# 7. Final statement

Every approved golden screen must have its own `DESIGN.md`.

Codex should never be asked to build a major user-facing screen from a screenshot alone or from a vague prompt.

The combination of:

```txt
screen.png
DESIGN.md
COMPONENT_LIBRARY.md
DESIGN_SYSTEM.md
VISUAL_QA_CHECKLIST.md
```

is what keeps implementation visually consistent, premium, and resistant to Codex drift.
