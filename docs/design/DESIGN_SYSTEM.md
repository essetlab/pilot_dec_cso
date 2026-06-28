# DESIGN_SYSTEM.md

> Consolidated authoritative version. This file replaces both the earlier generic `DESIGN_SYSTEM.md` and `DESIGN_SYSTEM_REVISED.md`. Keep only this file in `docs/design/` as `DESIGN_SYSTEM.md`.

# DEC / WHH CSF+ CSO Learning Hub — Grounded Premium Design System

## 1. Document purpose

This file defines the binding design system for the DEC / WHH CSF+ CSO Learning Hub Phase 1 application.

It must be read together with:

```txt
docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
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

This design system formalizes the visual direction already introduced in the previously presented landing page and course catalogue references. It does not replace that direction. It refines it into a consistent, accessible, premium, DEC-branded system suitable for implementation.

---

## 2. Design source

The visual system is derived from the previous landing page and course catalogue designs that stakeholders responded to positively.

The approved direction is:

> Local, premium, editorial, practical, accessible, and CSO-learning focused.

This means the interface should feel like a credible digital learning platform for local and grassroots CSOs, not a generic LMS, not a donor CRM, not a raw admin dashboard, and not a file repository.

---

## 3. Product design position

The CSO Learning Hub Phase 1 must visually communicate:

1. this is a real digital learning platform;
2. it is designed for local and grassroots CSOs;
3. it supports structured courses, progress, final tests, certificates, and monitoring;
4. it is credible enough for DEC, WHH, partners, and EU-funded programme stakeholders;
5. it is future-ready without exposing Phase 2/3 complexity too early.

The product specification defines Phase 1 as a working, accessible, mobile-first digital learning platform for local and grassroots CSOs, with public learning site, course catalogue, course player, admin portal, creator portal, professional block-based Course Builder, quizzes, certificates, monitoring, and feedback. The design system must support that full product reality.

---

## 4. Design personality

The design personality is:

```txt
Editorial but practical
Premium but not luxury
Institutional but not bureaucratic
Friendly but not casual
Local-context grounded but not visually crowded
Modern but not generic SaaS
```

Avoid:

1. default admin template appearance;
2. generic blue SaaS dashboards;
3. overcrowded compliance screens;
4. childish e-learning graphics;
5. overly decorative visuals that are hard to implement;
6. inconsistent course-card art styles;
7. developer-looking placeholders.

---

# 5. Brand color system

## 5.1 Core brand colors

Use these as the primary coded design tokens:

```txt
DEC Blue / Primary: #3B99D4
DEC Green / Accent: #91C852
Dark Ink: #111827
Deep Navy: #0F172A
Light Background: #F9FAFB
Soft Background: #F3F7FA
White Surface: #FFFFFF
Border: #E5E7EB
Soft Border: #EEF2F7
Secondary Text: #6B7280
Muted Text: #9CA3AF
```

## 5.2 Functional colors

```txt
Success: #16A34A
Warning: #F97316
Error / Critical: #EF4444
Info: #2563EB
Review / Purple: #8B5CF6
Certificate Gold: #D97706
```

## 5.3 Course-access colors

Use consistent access/status colors:

```txt
Public Access: DEC Blue
Assigned / Members Only: DEC Green
Restricted: Neutral Gray
Certificate Included: DEC Green
In Progress: DEC Blue
Completed: DEC Green
Needs Attention: Warning Orange
```

## 5.4 Color usage rules

1. Use DEC Blue for primary actions, active navigation, hero accents, public CTAs, and key learning-platform identity.
2. Use DEC Green for progress, completion, certificates, supportive positive states, and secondary accents.
3. Use Deep Navy for footer, hero overlays, and strong institutional contrast.
4. Use Light Background and Soft Background for large page surfaces.
5. Use White Surface for cards, panels, forms, and tables.
6. Use Warning and Error only when action is required.
7. Do not invent random badge colors.
8. Do not mix multiple unrelated blues/greens on one screen.
9. Do not rely on color alone to communicate status.
10. Ensure text contrast remains accessible.

---

# 6. Typography system

## 6.1 Typeface direction

The previous landing page used an editorial headline style that gave the prototype a distinctive premium feel. Preserve that direction for public-facing hero and major marketing headings.

Use a two-font strategy where feasible:

```txt
Display / Editorial Headings: serif or editorial display font
Body / UI / Forms / Dashboards: clean sans-serif
```

Recommended implementation-friendly stack:

```css
--font-display: Georgia, "Times New Roman", serif;
--font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

If a web font is later approved, it may replace these stacks. Do not introduce unapproved font files.

## 6.2 Where to use editorial headings

Use editorial display typography for:

1. landing page hero headline;
2. public page title such as Course Catalogue;
3. course detail hero title;
4. selected public storytelling section headings;
5. major CTA headings.

Do not use editorial headings heavily in:

1. admin data tables;
2. Build Studio configuration forms;
3. monitoring dashboards;
4. dense operational pages.

## 6.3 Type scale

Use this scale consistently:

```txt
Hero display: 56–72px desktop / 42–48px tablet / 34–40px mobile
Public page title: 48–64px desktop / 36–44px mobile
Dashboard page title: 30–36px
Section title: 26–34px public / 22–28px app screens
Card title: 17–21px
Body large: 17–19px
Body: 14–16px
Small/meta: 12–13px
Tiny label: 10–11px, uppercase with letter spacing only when readable
```

## 6.4 Typography rules

1. Public pages may use expressive large headings.
2. App/portal pages should prioritize clarity and scanability.
3. Body text must be readable and not overly light.
4. Course card titles must be strong and not too small.
5. Metadata labels must be legible.
6. Avoid excessive uppercase.
7. Avoid tiny gray text that fails contrast.
8. Avoid long paragraphs inside cards.
9. User-facing text must not include developer language such as slice, placeholder, scaffold, mock data, Prisma, DB, CRUD, backend, frontend, TODO, or implementation pending.

---

# 7. Layout and spacing system

## 7.1 Spacing scale

Use an 8px-based scale:

```txt
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
96px
120px
```

## 7.2 Page width

Recommended maximum widths:

```txt
Public landing content: 1120–1200px
Course catalogue content: 1160–1240px
Learner dashboard: 1120–1200px
Admin/creator content: full width with 24–32px padding
Build Studio: full viewport width
```

## 7.3 Section padding

Public pages:

```txt
Hero desktop: 96–140px vertical
Standard public section: 80–112px vertical
Compact public section: 56–72px vertical
Mobile public section: 48–64px vertical
```

App screens:

```txt
Page padding desktop: 24–32px
Page padding mobile: 16px
Card gap: 16–24px
Section gap: 24–40px
```

## 7.4 Layout rhythm

1. Public pages should have a strong section rhythm: hero → value cards → explanation → course showcase → learning experience → CTA → footer.
2. Portal pages should be more compact and task-oriented.
3. Build Studio should use full-height workspace logic.
4. Admin dashboards should avoid long scroll before key metrics.
5. Course player should prioritize lesson readability.

---

# 8. Surface, card, and shadow system

## 8.1 Surface tokens

```txt
Page background: #F9FAFB
Public section background: #FFFFFF or #F7FAFC
Card background: #FFFFFF
Raised card background: #FFFFFF
Footer background: #0F172A
Hero overlay: rgba(15, 23, 42, 0.58) to rgba(15, 23, 42, 0.2)
```

## 8.2 Border radius

```txt
Small controls: 8px
Inputs/buttons: 10–12px
Course cards: 20–24px
Feature cards: 20–24px
Large feature panels: 28–32px
Hero visual panels: 28–36px
Modals/dialogs: 20–24px
```

## 8.3 Shadows

Use soft, premium shadows.

Recommended examples:

```css
--shadow-soft: 0 8px 24px rgba(15, 23, 42, 0.08);
--shadow-card: 0 16px 40px rgba(15, 23, 42, 0.10);
--shadow-hero: 0 24px 60px rgba(15, 23, 42, 0.16);
```

Avoid:

1. harsh black shadows;
2. many competing shadow levels;
3. flat unstyled cards on key public/learner screens.

## 8.4 Card rules

1. Every card must have a clear purpose.
2. Course cards must use consistent image ratios and metadata placement.
3. Feature cards should be simple, icon-led, and not text-heavy.
4. Dashboard cards must be readable and not overly decorative.
5. Empty cards should not be used as filler.

---

# 9. Logo and partner handling

## 9.1 DEC logo

1. Use the DEC logo consistently in public and portal navigation.
2. Do not stretch, recolor, distort, or crop the logo.
3. Maintain enough padding around the logo.
4. Do not place the logo on visually noisy background without contrast treatment.

## 9.2 Partner logo strip

The partner logo strip should appear in the footer or approved institutional area.

Rules:

1. Use consistent logo heights.
2. Keep logos visually balanced.
3. Use muted treatment if footer is dark.
4. Do not make partner strip too tall.
5. Ensure mobile wrapping does not break the footer.
6. Do not treat partner logos as decorative clutter.

---

# 10. Public navigation system

## 10.1 Public nav structure

Use this public nav direction:

```txt
Logo
Home
About
Courses / Catalog
Verify Certificate
Language selector
Sign In
Register
```

Label choice must be consistent. Prefer one of:

```txt
Courses
Course Catalog
```

Do not use both inconsistently.

## 10.2 Public nav style

1. White or transparent-on-hero nav depending on page.
2. Use clear active states.
3. Register should be a primary blue button.
4. Sign In should be a text or subtle button.
5. Language selector should be compact.
6. Navigation must collapse on mobile.

## 10.3 Public nav restrictions

Do not show:

1. Admin;
2. Creator;
3. Monitoring;
4. Build Studio;
5. Phase 2/3 modules;
6. internal route names.

---

# 11. Button system

## 11.1 Primary button

Use for the main action.

Style:

```txt
Background: DEC Blue #3B99D4
Text: White
Radius: 12px
Padding: 12–16px vertical, 18–24px horizontal
Font: 13–15px semibold
Letter spacing: optional, subtle
Shadow: soft blue shadow for public CTAs only
```

Examples:

```txt
Explore courses
Start learning
Continue learning
Create course
Save changes
Publish course
```

## 11.2 Secondary button

Style:

```txt
Background: White or transparent
Border: #E5E7EB or subtle white border on dark backgrounds
Text: Dark Ink or White on dark background
Radius: 12px
```

Examples:

```txt
Sign in
Preview course
View details
Back to courses
```

## 11.3 Ghost button

Use for low-emphasis actions.

## 11.4 Destructive button

Use only for destructive actions:

```txt
Archive
Deactivate
Revoke certificate
Delete block
```

Always require confirmation for destructive actions with lasting effect.

## 11.5 Button rules

1. One dominant primary action per section.
2. Avoid many bright buttons in one area.
3. Use specific action labels.
4. Do not use vague “Submit” unless the action is truly generic.
5. Buttons must be tappable on mobile.

---

# 12. Badge and status system

## 12.1 Course catalogue badges

Use consistent badges:

```txt
Capacity Area
Public
Assigned
Restricted
Certificate Included
Available
Members Only
```

## 12.2 Course lifecycle badges

For creator/admin only:

```txt
Draft
Ready for Review
Returned for Revision
Approved
Published
Unpublished
Archived
```

Participants must not see internal course lifecycle badges.

## 12.3 Learning progress badges

```txt
Not Started
In Progress
Completed
Certificate Ready
Certificate Issued
```

## 12.4 Badge style

1. Small rounded pill.
2. Subtle background.
3. Clear readable text.
4. Minimal icon only if helpful.
5. No random color palette.
6. No more than 2–3 badges per card unless necessary.

---

# 13. Course card system

The course card system is central because the reference catalogue used course cards but lacked consistency.

## 13.1 Standard course card

Required elements:

1. course image or controlled visual cover;
2. capacity area label;
3. course title;
4. short description;
5. duration or lesson/module count;
6. target participant group if useful;
7. certificate indicator;
8. access indicator;
9. primary action or arrow button.

## 13.2 Course card layout

Recommended layout:

```txt
Image cover, fixed aspect ratio
Card body
  Capacity label + lesson/module metadata
  Course title
  Short description
  Meta row
  Certificate/access row
  Action
```

## 13.3 Image ratio

Use one consistent ratio:

```txt
16:10 or 4:3
```

Do not mix multiple image heights in the same grid.

## 13.4 Course card content rules

1. Avoid long titles that break the layout.
2. Clamp descriptions to 2–3 lines.
3. Keep metadata readable.
4. Avoid text embedded inside images where possible.
5. Use overlay only if needed for readability.
6. Ensure all cards align in height or have visually balanced layout.

## 13.5 Featured course card

The featured card may be larger but must share the same visual DNA.

It should include:

1. large course image;
2. strong title;
3. short description;
4. capacity/access badges;
5. duration and level;
6. certificate indicator;
7. clear CTA.

It must not feel like an unrelated design component.

---

# 14. Public landing page component system

## 14.1 Hero

Preserve the previous direction:

1. contextual CSO learning/training image;
2. dark navy overlay;
3. small platform eyebrow;
4. large editorial headline;
5. concise subtitle;
6. two CTA buttons;
7. small trust markers.

Recommended headline direction:

```txt
Learn, Adapt, Grow
```

or a refined current message such as:

```txt
Practical digital learning for stronger local CSOs
```

The final headline should be approved separately.

## 14.2 Core feature cards

Use four cards maximum.

Recommended feature themes:

1. Practical and work-ready;
2. Grounded in local CSO realities;
3. Structured learning journeys;
4. Certificates and progress tracking.

## 14.3 About section

Use a two-column layout:

1. left: concise platform explanation and value bullets;
2. right: local/contextual image or product preview card.

## 14.4 Course showcase

Use 3 featured course cards based on seed/approved courses.

Do not use outdated course content unless approved.

## 14.5 Learning experience section

Use a clean grid of learning experience features:

1. Structured journeys;
2. Interactive blocks;
3. Knowledge checks;
4. Progress tracking;
5. Resource library;
6. Certificates.

## 14.6 CTA section

Use a strong but simple blue panel with:

1. short headline;
2. concise supporting text;
3. primary CTA;
4. secondary CTA.

## 14.7 Footer

Use dark institutional footer with:

1. platform identity;
2. short description;
3. key links;
4. account links;
5. partner logos;
6. copyright;
7. privacy/terms links if implemented.

---

# 15. Course catalogue component system

## 15.1 Page header

Use large public page title with editorial feel.

Example:

```txt
Course Catalog
```

or:

```txt
Explore CSO Learning Courses
```

Support with a short subtitle.

## 15.2 Search and filter bar

Use a polished search/filter area.

Required controls:

1. search;
2. capacity area;
3. access type;
4. certificate;
5. level or duration where useful.

Avoid cramming too many filters above the fold.

## 15.3 Featured course

Use one highlighted course.

Should be visually premium and readable.

## 15.4 Course grid

Use responsive grid:

```txt
Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column
```

## 15.5 Catalogue empty state

Use polished empty state:

```txt
No courses are available yet.
Published courses will appear here when they are ready.
```

Do not mention database, seed, mock, scaffold, or placeholder.

---

# 16. Learner dashboard component system

## 16.1 Dashboard header

Use supportive copy:

```txt
Welcome back, [Name]
Continue your CSO learning journey and track your progress.
```

## 16.2 Continue learning card

This is the main dashboard card.

Show:

1. course title;
2. current lesson;
3. progress;
4. continue button;
5. estimated time or last accessed.

## 16.3 Progress summary cards

Show:

1. in-progress courses;
2. completed courses;
3. certificates earned.

## 16.4 Course cards

Use course card system adapted for dashboard.

## 16.5 Certificate preview

Use certificate card with achievement-like tone.

---

# 17. Learner course player component system

The learner template specification requires a polished participant-facing course template that does not look like a file repository.

## 17.1 Course player layout

Desktop:

```txt
Course header
Course outline sidebar
Lesson content panel
```

Mobile:

```txt
Course header
Outline drawer/collapse
Lesson content
Previous/next controls
```

## 17.2 Lesson content blocks

Use designed block components:

1. Text block — readable article section;
2. Video block — player card with transcript area;
3. Resource block — clean download card;
4. Case study — contextual scenario card;
5. Accordion — accessible content group;
6. Flashcard — reveal card;
7. Knowledge check — interactive question card;
8. Branching scenario — decision card;
9. Practical activity — application task card;
10. Key message — highlighted callout.

## 17.3 Progress indicators

Use progress bars or rings sparingly.

Avoid overwhelming participants with analytics-like metrics.

---

# 18. Creator portal component system

Creator screens should extend the brand but be more operational.

## 18.1 Creator shell

Use:

1. clean sidebar or top workflow nav;
2. compact page header;
3. course context bar;
4. white cards;
5. clear actions.

## 18.2 Course setup forms

Use grouped cards:

1. Basic information;
2. Audience and access;
3. Certificate/final test;
4. Metadata and outcomes.

Do not show heavy diagnosis/capacity map workflows.

## 18.3 Build Studio

The Build Studio must follow the protected three-column structure:

```txt
Left: Block Library + Course Outline
Center: Course Canvas
Right: Block Configuration
```

Use:

1. full-height workspace;
2. compact header;
3. clean block cards;
4. clear selected states;
5. lightweight warnings;
6. immediate preview access.

Do not add:

1. diagnosis panels;
2. capacity map panels;
3. monitoring charts;
4. CRM elements;
5. donor compliance widgets;
6. large governance cards.

---

# 19. Admin component system

Admin screens should feel calm and operational.

## 19.1 Admin shell

Use:

1. sidebar navigation;
2. top bar;
3. page header;
4. card/table layout;
5. role-aware nav.

## 19.2 Admin dashboard

Use:

1. KPI card grid;
2. quick action cards;
3. recent activity;
4. review queue summary;
5. recent feedback/certificates.

Avoid visual overload.

## 19.3 Admin list pages

Use:

1. page header;
2. primary action;
3. filter/search bar;
4. table or card list;
5. empty state.

## 19.4 Admin detail pages

Use:

1. profile header;
2. summary cards;
3. related records;
4. action panel;
5. audit/activity note where useful.

Do not make organization pages CRM-like.

---

# 20. Monitoring component system

The monitoring specification requires operational learning monitoring, not an impact or CRM dashboard.

Use:

1. filter bar;
2. KPI cards;
3. attention signal cards;
4. course progress table;
5. cohort progress table;
6. organization participation table;
7. assessment/certificate summary;
8. feedback summary.

Avoid:

1. long-term capacity impact claims;
2. donor pipeline charts;
3. diagnosis/capacity map analytics;
4. too many charts;
5. participant-level overexposure.

---

# 21. Form system

## 21.1 Form layout

Use:

1. grouped sections;
2. clear labels;
3. short helper text;
4. visible validation;
5. sticky or clear save action where useful.

## 21.2 Field style

Inputs:

```txt
Height: 40–48px
Radius: 10–12px
Border: #E5E7EB
Focus: DEC Blue ring
Background: White
```

Textareas:

```txt
Minimum height: 96–140px
```

## 21.3 Validation style

Use:

1. red for blocking error;
2. orange for warning;
3. green for completed/success;
4. clear text explanation.

Do not expose technical field names.

---

# 22. Table system

Use tables for admin and monitoring pages.

## 22.1 Table style

1. white card wrapper;
2. clear header row;
3. comfortable row height;
4. subtle row borders;
5. readable status badges;
6. compact row actions;
7. search/filter above table.

## 22.2 Mobile behavior

For complex tables:

1. use horizontal scroll if necessary;
2. or convert to stacked cards for high-priority views.

Do not let tables break the page width.

---

# 23. Empty state system

Every empty state must look intentional.

## 23.1 Empty state pattern

```txt
Icon or small illustration
Headline
Short explanation
Primary action where relevant
```

## 23.2 Examples

Public catalogue:

```txt
No courses are available yet.
Published courses will appear here when they are ready.
```

Creator My Courses:

```txt
No courses yet.
Create your first course and start building structured digital learning content.
```

Admin users:

```txt
No users found.
Add your first platform user to begin assigning roles and access.
```

Learner dashboard:

```txt
No courses yet.
Browse available courses or wait for an assigned course from your programme team.
```

## 23.3 Empty state restrictions

Do not say:

```txt
No DB data
No mock records
Placeholder
Coming soon
TODO
```

---

# 24. Accessibility system

## 24.1 Minimum accessibility

All screens must support:

1. semantic headings;
2. keyboard-accessible controls;
3. visible focus states;
4. form labels;
5. readable contrast;
6. no color-only meaning;
7. alt text for images;
8. transcript fields for video/audio;
9. accessible accordions;
10. accessible flashcard reveal behavior;
11. clear error messages;
12. mobile tap targets.

## 24.2 Focus state

Use a consistent focus ring:

```txt
2px DEC Blue focus ring
sufficient offset
visible on light and dark backgrounds
```

## 24.3 Text contrast

Avoid light gray text for important information.

Metadata can be muted, but must remain legible.

---

# 25. Responsive system

## 25.1 Breakpoints

Use Tailwind defaults or equivalent:

```txt
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## 25.2 Responsive behavior by area

Public:

1. hero stacks on mobile;
2. nav collapses;
3. feature cards become one column;
4. course cards become one column.

Learner:

1. dashboard cards stack;
2. course outline collapses;
3. lesson content stays readable;
4. final test options are tap-friendly.

Creator:

1. setup forms stack;
2. Build Studio panels collapse or become drawers;
3. canvas remains primary.

Admin:

1. tables scroll safely or convert to cards;
2. KPI cards wrap;
3. sidebar collapses.

---

# 26. Image and visual asset system

## 26.1 Hero imagery

Use local, realistic, collaborative learning imagery.

Preferred:

1. CSO training room;
2. group discussion;
3. planning workshop;
4. community-based learning;
5. laptop/tablet in learning context.

Avoid:

1. generic corporate office images;
2. non-local stock imagery;
3. images that feel staged or irrelevant;
4. overly busy images without overlay.

## 26.2 Course imagery

Use a controlled system.

Preferred:

1. consistent illustration style; or
2. consistent photo style; or
3. hybrid only if visually controlled.

Avoid:

1. unreadable text embedded in thumbnails;
2. inconsistent aspect ratios;
3. too many colors;
4. low-resolution images;
5. images that overpower the course title.

---

# 27. Motion and interaction

Use motion sparingly.

Allowed:

1. subtle hover lift on cards;
2. soft button hover;
3. accordion expand/collapse;
4. flashcard reveal;
5. drawer open/close;
6. loading skeletons.

Avoid:

1. excessive animation;
2. distracting hero motion;
3. inaccessible flip animations without fallback;
4. motion that harms low-bandwidth performance.

---

# 28. User-facing copy rules

## 28.1 Tone

Use:

1. clear;
2. supportive;
3. practical;
4. respectful;
5. concise.

## 28.2 Forbidden developer language

Never show:

```txt
Slice
Scaffold
Placeholder
Mock data
Fake data
TODO
Implementation pending
Route shell
Demo only
DB
Prisma
Migration
CRUD
Backend
Frontend
Lorem ipsum
WIP
```

## 28.3 Preferred phrases

Use:

```txt
Explore courses
Continue learning
Start course
Create course
Save draft
Preview course
Submit for review
Take final test
Download certificate
View monitoring
```

---

# 29. Design QA requirements

Any UI-facing Codex slice must provide:

1. routes/screens changed;
2. desktop visual check;
3. mobile visual check;
4. accessibility notes;
5. screenshots or explanation if screenshots are unavailable;
6. confirmation of no developer language;
7. confirmation of no Phase 2/3 active modules;
8. confirmation of no CRM/donor-management UI;
9. known visual gaps.

A technically working screen that looks weak is not complete.

---

# 30. Implementation token recommendations

Codex should implement tokens in code, using CSS variables or Tailwind theme extension.

Recommended CSS variable names:

```css
--color-primary: #3B99D4;
--color-accent: #91C852;
--color-ink: #111827;
--color-navy: #0F172A;
--color-bg: #F9FAFB;
--color-surface: #FFFFFF;
--color-border: #E5E7EB;
--color-muted: #6B7280;
--radius-card: 24px;
--radius-control: 12px;
--shadow-soft: 0 8px 24px rgba(15, 23, 42, 0.08);
--shadow-card: 0 16px 40px rgba(15, 23, 42, 0.10);
```

Codex may adapt names to existing repo conventions but must preserve the design values and intent.

---

# 31. Final design-system statement

This design system formalizes and improves the previously presented stakeholder-liked landing and catalogue visual direction.

The final CSO Learning Hub must look visually consistent with that direction while being more polished, accessible, branded, responsive, and implementation-ready.

Codex must not replace this direction with generic UI.