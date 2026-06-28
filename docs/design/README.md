# README.md

# DEC / WHH CSF+ CSO Learning Hub — Design Package README

## 1. Purpose

This folder contains the premium UI/UX design-control package for the DEC / WHH CSF+ CSO Learning Hub Phase 1 application.

The design package exists to ensure the platform is not only functional, but visually credible, consistent, accessible, responsive, and stakeholder-demo ready.

Codex and any developer must use this package before implementing user-facing UI.

---

## 2. Core design decision

The design direction is not starting from zero.

The CSO Learning Hub UI must build from the previously presented and stakeholder-liked landing page and course catalogue references, while improving:

1. DEC brand alignment;
2. visual consistency;
3. course card quality;
4. typography;
5. spacing;
6. accessibility;
7. mobile responsiveness;
8. implementation readiness;
9. current Phase 1 product messaging.

The goal is continuity with improvement.

---

## 3. Required folder placement

Place this package under:

```txt
docs/design/
```

Recommended structure:

```txt
docs/design/
  README.md
  00_VISUAL_SOURCE_OF_TRUTH.md
  DESIGN_SYSTEM.md
  COMPONENT_LIBRARY.md
  CODEX_UI_SKILL.md
  VISUAL_QA_CHECKLIST.md
  UI_SCREEN_BLUEPRINTS.md
  IMAGE_MOCKUP_PROMPTS.md
  SCREEN_DESIGN_TEMPLATE.md
  CODEX_DESIGN_IMPLEMENTATION_PROMPTS.md
  LEARNER_TEMPLATE_SYSTEM.md

  reference/
    previous-landing-page.png
    previous-course-catalogue.png
    articulate-360-elearning/
      ARTICULATE_AUTHORING_REFERENCE_NOTES.md

  screens/
    01_landing/
      screen.png
      DESIGN.md
      IMPLEMENTATION_NOTES.md

    02_course_catalogue/
      screen.png
      DESIGN.md
      IMPLEMENTATION_NOTES.md

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

If some screen folders are not ready yet, create them only when the corresponding golden mockup is approved.

---

## 4. File index

## 4.1 `00_VISUAL_SOURCE_OF_TRUTH.md`

Defines the continuity anchor.

Use this file to understand that the previous landing page and course catalogue designs are reference points, not final templates.

It explains what to preserve, what to improve, and what must not be copied.

This is the first file Codex should read before UI work.

---

## 4.2 `DESIGN_SYSTEM.md`

Defines the visual system:

1. DEC blue/green palette;
2. typography;
3. spacing;
4. cards;
5. buttons;
6. badges;
7. course cards;
8. learner course player direction;
9. Build Studio visual rules;
10. admin and monitoring visual rules;
11. responsive behavior;
12. accessibility requirements.

This file formalizes the stakeholder-liked design direction into reusable implementation rules.

---

## 4.3 `COMPONENT_LIBRARY.md`

Defines the reusable component system.

It tells Codex which components to create or reuse, including:

1. PublicShell;
2. LearnerShell;
3. CreatorShell;
4. AdminShell;
5. CourseCard;
6. FeaturedCourseCard;
7. LearnerCourseShell;
8. LessonBlockRenderer;
9. BuildStudioShell;
10. BlockLibraryPanel;
11. CourseCanvas;
12. BlockConfigPanel;
13. MetricCard;
14. DataTable;
15. Monitoring components.

This file prevents inconsistent one-off UI.

---

## 4.4 `CODEX_UI_SKILL.md`

Defines binding UI behavior for Codex.

It tells Codex:

1. do not create weak placeholder UI;
2. do not expose developer language;
3. use approved components;
4. preserve visual continuity;
5. keep Build Studio clean;
6. keep learner screens polished;
7. include visual QA in evidence packs.

---

## 4.5 `VISUAL_QA_CHECKLIST.md`

Defines visual acceptance criteria for UI slices.

Use it to judge whether a screen is:

```txt
PASS
PARTIAL
FAIL
NOT APPLICABLE
```

It includes checks for:

1. layout;
2. typography;
3. spacing;
4. colors;
5. cards;
6. navigation;
7. accessibility;
8. mobile responsiveness;
9. developer-language ban;
10. Phase 2/3 drift;
11. CRM/donor-management drift.

---

## 4.6 `UI_SCREEN_BLUEPRINTS.md`

Defines screen-level layout direction for major screens.

It includes golden screen blueprints for:

1. landing page;
2. course catalogue;
3. course detail;
4. sign-in;
5. learner dashboard;
6. learner course player;
7. final test;
8. certificate page;
9. creator My Courses;
10. course setup;
11. Build Studio;
12. admin dashboard;
13. admin management screens;
14. review/publish;
15. monitoring;
16. audit log;
17. settings;
18. unauthorized/access state.

---

## 4.7 `IMAGE_MOCKUP_PROMPTS.md`

Provides controlled prompts for generating high-fidelity image mockups.

Use it to generate:

1. improved landing page;
2. improved course catalogue;
3. course detail;
4. learner dashboard;
5. learner course player;
6. certificate page;
7. creator My Courses;
8. Build Studio;
9. admin dashboard;
10. monitoring dashboard.

It also includes mobile prompt wrappers and rules for using the previous screenshots as continuity references.

---

## 4.8 `SCREEN_DESIGN_TEMPLATE.md`

Defines the required `DESIGN.md` template for every approved golden screen.

Each approved screen must have:

```txt
screen.png
DESIGN.md
```

The image alone is not enough for Codex.

The `DESIGN.md` file gives Codex:

1. route;
2. purpose;
3. layout;
4. component map;
5. content requirements;
6. responsive behavior;
7. accessibility rules;
8. scope restrictions;
9. acceptance criteria.

---

## 4.9 `CODEX_DESIGN_IMPLEMENTATION_PROMPTS.md`

Provides copy/paste-ready Codex prompts for:

1. placing design files;
2. implementing design tokens;
3. upgrading shells/navigation;
4. implementing landing page;
5. implementing catalogue;
6. implementing course detail;
7. implementing learner dashboard;
8. implementing learner course player;
9. implementing Build Studio UI;
10. implementing admin dashboard;
11. implementing monitoring dashboard;
12. visual QA correction;
13. removing developer language;
14. mobile responsiveness;
15. pre-demo visual audit.

---

## 4.10 `LEARNER_TEMPLATE_SYSTEM.md`

Defines the learner-facing course template system for published course playback.

Use it with the learner course player screen design to keep lesson blocks, progress, navigation, and mobile behavior consistent with the approved e-learning direction.

---

# 5. Reference assets

## 5.1 Previous design references

Store the previously presented screenshots here:

```txt
docs/design/reference/previous-landing-page.png
docs/design/reference/previous-course-catalogue.png
```

These files are reference assets.

They should be used to preserve continuity, not copied exactly.

## 5.2 Articulate 360 authoring reference package

Store the Articulate 360 authoring UX reference package here:

```txt
docs/design/reference/articulate-360-elearning/
```

The package includes:

```txt
docs/design/reference/articulate-360-elearning/ARTICULATE_AUTHORING_REFERENCE_NOTES.md
```

Use this package as reference for authoring patterns, block behavior, and learner course playback quality.

## 5.3 Approved golden mockups

Store approved improved mockups under:

```txt
docs/design/screens/
```

Each golden screen folder should include:

```txt
screen.png
DESIGN.md
```

Optional:

```txt
IMPLEMENTATION_NOTES.md
```

---

# 6. Recommended design workflow

Use this workflow:

## Step 1 — Confirm design source of truth

Read:

```txt
00_VISUAL_SOURCE_OF_TRUTH.md
```

Confirm the previous landing/catalogue design direction is the visual continuity anchor.

## Step 2 — Generate improved golden mockups

Use:

```txt
IMAGE_MOCKUP_PROMPTS.md
```

Start with:

1. improved landing page;
2. improved course catalogue.

Do not generate all screens at once.

## Step 3 — Review and approve mockups

Use:

```txt
VISUAL_QA_CHECKLIST.md
```

Approve only if the screen:

1. preserves continuity;
2. improves polish;
3. uses DEC colors;
4. avoids outdated content;
5. avoids developer language;
6. is stakeholder-demo quality.

## Step 4 — Create per-screen `DESIGN.md`

Use:

```txt
SCREEN_DESIGN_TEMPLATE.md
```

Each approved screen must have a `DESIGN.md`.

## Step 5 — Implement design tokens and components

Use Codex prompts:

```txt
CODEX_DESIGN_IMPLEMENTATION_PROMPTS.md
```

Start with:

1. Design Control Package placement;
2. Design Token and Base UI Foundation;
3. Premium Shell and Navigation Foundation.

## Step 6 — Implement approved screens

Implement screen by screen, using:

```txt
screen.png
DESIGN.md
DESIGN_SYSTEM.md
COMPONENT_LIBRARY.md
VISUAL_QA_CHECKLIST.md
```

## Step 7 — Visual QA before approval

Every UI slice must include:

1. desktop check;
2. mobile/narrow check;
3. accessibility notes;
4. developer-language check;
5. scope-control check;
6. screenshots or visual evidence if possible.

---

# 7. Priority order

Recommended order for design and implementation:

## Design mockups

1. Landing Page
2. Course Catalogue
3. Course Detail
4. Learner Dashboard
5. Learner Course Player
6. Certificate Page
7. Creator My Courses
8. Build Studio
9. Admin Dashboard
10. Monitoring Dashboard

## Codex implementation

1. Design package placement
2. Design tokens/base components
3. Shells/navigation
4. Landing page
5. Course catalogue
6. Course detail
7. Learner dashboard
8. Learner course player
9. Creator My Courses
10. Build Studio
11. Admin dashboard
12. Monitoring dashboard

This order may be adjusted based on backend readiness, but major UI screens must not be implemented without design references.

---

# 8. Relationship with Phase 1 build slices

This design package complements the Phase 1 Codex handoff package under:

```txt
docs/specs/phase-1-cso-learning-hub/
```

Functional slices such as data model, seed data, auth, course building, certificates, and monitoring remain controlled by the Phase 1 specs.

Design quality is controlled by this folder.

Before any user-facing slice, Codex must read both:

```txt
docs/specs/phase-1-cso-learning-hub/
docs/design/
```

---

# 9. Non-negotiable UI controls

Codex must not:

1. replace the approved visual direction with generic UI;
2. create raw placeholder-looking pages;
3. expose developer/internal language;
4. show admin/creator controls to public or learner users;
5. add Phase 2/3 active modules;
6. add CRM/donor-management UI;
7. crowd the Build Studio with governance, diagnosis, monitoring, or donor compliance panels;
8. claim long-term CSO capacity impact in Phase 1 monitoring;
9. use random colors or inconsistent badges;
10. ignore mobile responsiveness.

---

# 10. Developer-language ban

The following words must not appear in user-facing UI:

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

These words may appear in documentation or developer comments but must never appear on normal user-facing screens.

---

# 11. UI evidence-pack requirements

For every UI-facing Codex slice, the evidence pack must include:

```txt
## Premium UI / Visual QA

Routes/screens visually checked:
- ...

Desktop visual check:
- PASS / PARTIAL / FAIL

Mobile visual check:
- PASS / PARTIAL / FAIL

Accessibility visual check:
- PASS / PARTIAL / FAIL

Developer-language check:
- PASS / PARTIAL / FAIL

Scope-control visual check:
- PASS / PARTIAL / FAIL

Screenshots or visual evidence:
- ...

Known visual gaps:
- ...

Final visual QA status:
- PASS / PARTIAL / FAIL / NOT APPLICABLE
```

A UI slice should not be accepted if stakeholder-demo quality is `FAIL`.

---

# 12. First Codex prompt after placing this design package

Use this first:

```txt
Plan first.

Implement Design Control Package placement for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, inspect:
- docs/design/
- docs/specs/phase-1-cso-learning-hub/

Objective:
Ensure the premium UI/UX design-control package is correctly placed and discoverable in the repo.

Scope:
1. Confirm or create:
   - docs/design/
   - docs/design/reference/
   - docs/design/screens/
2. Confirm these files exist:
   - docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
   - docs/design/DESIGN_SYSTEM.md
   - docs/design/COMPONENT_LIBRARY.md
   - docs/design/CODEX_UI_SKILL.md
   - docs/design/VISUAL_QA_CHECKLIST.md
   - docs/design/UI_SCREEN_BLUEPRINTS.md
   - docs/design/IMAGE_MOCKUP_PROMPTS.md
   - docs/design/SCREEN_DESIGN_TEMPLATE.md
   - docs/design/CODEX_DESIGN_IMPLEMENTATION_PROMPTS.md
   - docs/design/README.md
3. Confirm reference screenshots are stored as:
   - docs/design/reference/previous-landing-page.png
   - docs/design/reference/previous-course-catalogue.png
   if available.
4. Do not change application code unless needed for documentation links.

Constraints:
- Do not edit product behavior.
- Do not implement screens.
- Do not delete existing docs.
- Do not modify the Phase 1 spec package.

Acceptance criteria:
- Design files are placed in docs/design/.
- README index exists.
- Reference folder exists.
- Screens folder exists.
- No app logic is changed.
- Evidence pack is returned.

Verification:
- List docs/design/ structure.
- Confirm required files exist.
- Run no build unless app code is changed.

Return evidence pack.
```

---

# 13. Final statement

This design package is a quality-control system.

It ensures the CSO Learning Hub remains visually consistent with the previously presented stakeholder-liked design, while becoming more polished, accessible, branded, and implementation-ready.

Codex must treat these design files as binding references for all user-facing UI work.
