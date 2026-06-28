# CODEX_UI_SKILL.md

# DEC / WHH CSF+ CSO Learning Hub — Codex UI Skill

## 1. Purpose

This file is a binding UI/UX instruction file for Codex and any AI coding agent working on the DEC / WHH CSF+ CSO Learning Hub.

Codex must read and apply this file before making any user-facing UI changes.

The purpose is to prevent weak, generic, scaffold-looking, developer-heavy, or visually basic front-end implementation.

---

## 2. Core instruction

Every user-facing screen must be built as if it will be shown to DEC, WHH, partners, and EU-funded programme stakeholders.

Passing lint, typecheck, and build is not enough.

A user-facing UI slice is only acceptable when it is also visually credible, clean, responsive, accessible, and free from developer language.

---

## 3. Required design references

Before creating or modifying user-facing UI, Codex must read:

```txt
docs/design/DESIGN_SYSTEM.md
docs/design/CODEX_UI_SKILL.md
docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
docs/specs/phase-1-cso-learning-hub/ADMIN_PORTAL_SPEC.md
docs/specs/phase-1-cso-learning-hub/MONITORING_SPEC.md
docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md
```

For seed/demo content, Codex must also read:

```txt
docs/specs/phase-1-cso-learning-hub/SEED_DATA_PLAN.md
```

---

## 4. Non-negotiable UI rule

Codex must not create user-facing UI that looks like:

1. a raw Next.js starter page;
2. a developer scaffold;
3. a generic dashboard template;
4. a database admin panel;
5. a basic unstyled form;
6. a file repository;
7. a wireframe;
8. a rough placeholder;
9. a test page;
10. a CRM or donor management system.

The application must look like a polished CSO learning platform from the beginning.

---

## 5. User-facing language ban

Codex must not expose the following words or phrases in user-facing screens:

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
Test page
Temporary page
WIP
```

If functionality is not yet complete, use safe product language.

Bad:

```txt
Placeholder route for Build Studio.
```

Good:

```txt
Start building your course by adding modules, lessons, and learning blocks.
```

Bad:

```txt
No DB records.
```

Good:

```txt
No records have been added yet.
```

Bad:

```txt
Mock learner dashboard.
```

Good:

```txt
Your courses will appear here when they are assigned or started.
```

---

## 6. Design quality gates

Before Codex marks any UI slice complete, it must confirm:

1. page has a clear title and concise subtitle;
2. page uses approved layout and spacing;
3. page uses polished cards/tables/forms, not raw HTML;
4. page has a clean empty state if no data;
5. page uses role-appropriate navigation;
6. page has no developer wording;
7. page has no Phase 2/3 active modules;
8. page has no CRM/donor-management elements;
9. page is responsive;
10. page has accessible color contrast and focus states;
11. page has no horizontal overflow;
12. page can be shown in a stakeholder demo without embarrassment.

---

## 7. Component-first rule

Codex must avoid repeatedly hand-coding inconsistent page fragments.

For UI work, Codex should create and reuse a component library.

Required component patterns include:

1. `AppShell`
2. `PublicShell`
3. `LearnerShell`
4. `CreatorShell`
5. `AdminShell`
6. `PageHeader`
7. `SectionHeader`
8. `MetricCard`
9. `CourseCard`
10. `ProgressCard`
11. `CertificateCard`
12. `ResourceCard`
13. `EmptyState`
14. `StatusBadge`
15. `FilterBar`
16. `DataTable`
17. `ActionButton`
18. `FormSection`
19. `InputField`
20. `SelectField`
21. `TextareaField`
22. `AlertMessage`
23. `Tabs`
24. `Stepper`
25. `BlockLibraryPanel`
26. `CourseOutlinePanel`
27. `CanvasBlockCard`
28. `BlockConfigPanel`
29. `LearnerCourseShell`
30. `LessonBlockRenderer`

Codex may adapt naming to repo conventions, but must preserve the reusable component approach.

---

## 8. Tailwind and styling rules

Codex must:

1. use Tailwind consistently;
2. use approved design tokens from `DESIGN_SYSTEM.md`;
3. avoid random one-off colors;
4. avoid unbounded arbitrary spacing;
5. avoid dense UI;
6. use responsive classes deliberately;
7. use consistent card, button, input, badge, and table styles;
8. avoid harsh black borders;
9. avoid low-contrast gray text;
10. avoid too many visual styles in one screen.

If design tokens are not yet implemented in code, Codex should create a minimal token foundation before building major screens.

---

## 9. Layout rules by area

## 9.1 Public site

Public pages must feel welcoming, credible, and polished.

Required qualities:

1. premium hero;
2. clear learning-platform promise;
3. strong call to action;
4. course discovery path;
5. clean course cards;
6. no admin/creator controls;
7. no internal system language.

## 9.2 Learner site

Learner pages must feel like a high-quality LMS.

Required qualities:

1. warm learner dashboard;
2. strong “continue learning” path;
3. polished course cards;
4. readable course player;
5. clear progress;
6. accessible interactive blocks;
7. certificates presented as achievements;
8. no admin language.

## 9.3 Course Creator portal

Creator pages must feel like a professional authoring environment.

Required qualities:

1. clean My Courses dashboard;
2. simple setup forms;
3. compact course context bar;
4. strong Build Studio interface;
5. three-column Build Studio preserved;
6. no crowded governance panels;
7. no CRM-style sections.

## 9.4 Admin portal

Admin pages must feel operational, calm, and efficient.

Required qualities:

1. concise KPI cards;
2. clean tables;
3. useful filters;
4. good empty states;
5. clear primary actions;
6. no donor CRM metrics;
7. no Phase 2/3 dashboards.

## 9.5 Monitoring

Monitoring must be decision-oriented.

Required qualities:

1. filters first;
2. KPI cards;
3. attention signals;
4. useful tables;
5. limited charts;
6. no over-claiming impact;
7. no unnecessary participant-level exposure.

---

## 10. Build Studio specific rule

Build Studio is the premium product surface.

Codex must preserve:

```txt
Left panel: Block Library + Course Outline
Center panel: Course Canvas
Right panel: Block Configuration
```

Codex must not add to Build Studio:

1. diagnosis panels;
2. capacity map panels;
3. monitoring charts;
4. CRM records;
5. donor compliance widgets;
6. heavy review history;
7. large governance cards;
8. crowded process diagrams;
9. unrelated admin data;
10. Phase 2/3 modules.

Build Studio must feel like:

```txt
I am creating a course.
```

Not:

```txt
I am filling a compliance database.
```

---

## 11. Learner course player specific rule

Learner course player must feel like a published digital course, not a content dump.

Codex must ensure:

1. compact course header;
2. clear module/lesson navigation;
3. progress indicator;
4. readable lesson content area;
5. polished block rendering;
6. accessible interactions;
7. strong mobile behavior;
8. clear previous/next controls;
9. no creator/admin controls.

---

## 12. Empty state rule

Every list or dashboard area with no data must have an intentional empty state.

Empty state must include:

1. simple icon or visual cue;
2. clear headline;
3. short explanation;
4. action if relevant.

Empty states must not say:

```txt
No data from DB
No mock records
Placeholder
Coming soon
```

Use product-safe copy.

---

## 13. Visual evidence rule

For every UI-facing slice, Codex must include in the evidence pack:

1. routes changed;
2. screenshots if available;
3. viewport sizes checked;
4. mobile check notes;
5. accessibility notes;
6. confirmation of no developer language;
7. confirmation of no Phase 2/3 active modules;
8. confirmation of no CRM/donor-management elements;
9. known visual gaps.

If screenshot tooling is not available, Codex must say so and provide manual route verification notes.

---

## 14. Responsive design rule

For every user-facing screen, Codex must check:

1. desktop width;
2. tablet/narrow width where practical;
3. mobile width where practical.

Minimum requirements:

1. no horizontal overflow;
2. text remains readable;
3. buttons remain tappable;
4. navigation remains usable;
5. cards stack cleanly;
6. tables adapt or scroll safely;
7. sidebars collapse where needed.

---

## 15. Accessibility rule

Codex must build with accessibility from the start.

Minimum:

1. semantic headings;
2. labeled inputs;
3. keyboard focus states;
4. button elements for actions;
5. accessible links;
6. contrast-conscious color use;
7. alt text fields for image content;
8. transcript fields for video/audio content;
9. accessible accordion behavior;
10. no color-only communication.

---

## 16. Premium UI evidence checklist

For each UI slice, Codex must complete this checklist in the evidence pack:

```txt
Premium UI checklist:
- [PASS/PARTIAL/FAIL] Uses approved design system.
- [PASS/PARTIAL/FAIL] Uses reusable components.
- [PASS/PARTIAL/FAIL] No developer language visible.
- [PASS/PARTIAL/FAIL] No rough placeholder UI.
- [PASS/PARTIAL/FAIL] Responsive behavior checked.
- [PASS/PARTIAL/FAIL] Accessibility basics checked.
- [PASS/PARTIAL/FAIL] Navigation is role-appropriate.
- [PASS/PARTIAL/FAIL] No Phase 2/3 active modules.
- [PASS/PARTIAL/FAIL] No CRM/donor-management UI.
- [PASS/PARTIAL/FAIL] Stakeholder-demo quality.
```

A UI slice should not be accepted if stakeholder-demo quality is `FAIL`.

---

## 17. When Codex is allowed to use temporary UI

Temporary UI is allowed only for:

1. internal developer-only testing pages;
2. backend-only slices with no user-facing route changes;
3. pages explicitly marked as non-demo internal implementation scaffolds.

Even then:

1. do not expose them to normal users;
2. do not add them to navigation;
3. do not use them as final pages;
4. document them clearly in evidence pack.

---

## 18. Golden screen rule

Major UI surfaces require approved screen direction before implementation.

Golden screens include:

1. public landing page;
2. course catalogue;
3. course detail page;
4. learner dashboard;
5. learner course player;
6. Course Creator My Courses;
7. Build Studio;
8. Admin dashboard;
9. Monitoring dashboard;
10. Certificate page.

Codex must not independently invent the final layout for these screens if a blueprint exists.

Codex must implement according to approved blueprints and components.

---

## 19. UI slice stop conditions

Codex must stop and report if:

1. required design docs are missing;
2. a screen cannot meet the approved design quality without a design decision;
3. a component would need large redesign across the app;
4. a route has conflicting product instructions;
5. implementing functionality would force weak UI;
6. screenshot/visual check reveals unacceptable layout;
7. mobile behavior cannot be made usable within the slice;
8. a screen starts showing developer/internal language;
9. Phase 2/3 or CRM elements are requested implicitly.

---

## 20. Standard UI prompt wrapper

Use this wrapper for UI-facing Codex work:

```txt
Plan first.

Implement [UI SLICE NAME] for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/DESIGN_SYSTEM.md
- docs/design/CODEX_UI_SKILL.md
- relevant product specs in docs/specs/phase-1-cso-learning-hub/

Objective:
[State objective]

Scope:
[State exact routes/components]

Design constraints:
- Use approved design system.
- Use reusable components.
- Do not create basic placeholder-style UI.
- Do not show developer language.
- Do not expose Phase 2/3 modules.
- Do not add CRM/donor-management UI.
- Preserve role-aware navigation.
- Ensure mobile-responsive behavior.
- Ensure accessibility basics.
- Provide visual evidence or route verification notes.

Acceptance criteria:
[State acceptance criteria]

Verification:
- npm run lint
- npm run typecheck
- npm run build
- route checks
- screenshot or visual evidence if available
- mobile check notes

Return evidence pack using EVIDENCE_PACK_TEMPLATE.md and include the Premium UI checklist.
```

---

## 21. Final instruction

Codex must treat UI quality as part of the product, not as decoration.

For this project, a screen that works but looks weak is not complete.

A screen is acceptable only when it is useful, functional, accessible, and visually credible for stakeholder demonstration.
