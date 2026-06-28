# CODEX_DESIGN_IMPLEMENTATION_PROMPTS.md

# DEC / WHH CSF+ CSO Learning Hub — Codex Design Implementation Prompt Pack

## 1. Document purpose

This file provides controlled, copy/paste-ready prompts for Codex to implement the premium UI/UX design system and approved golden screens for the DEC / WHH CSF+ CSO Learning Hub Phase 1 build.

These prompts are designed to prevent Codex from producing weak, generic, scaffold-looking, or developer-heavy UI.

Use these prompts only after the design-control files are placed in the repo:

```txt
docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
docs/design/DESIGN_SYSTEM.md
docs/design/COMPONENT_LIBRARY.md
docs/design/CODEX_UI_SKILL.md
docs/design/VISUAL_QA_CHECKLIST.md
docs/design/UI_SCREEN_BLUEPRINTS.md
docs/design/IMAGE_MOCKUP_PROMPTS.md
docs/design/SCREEN_DESIGN_TEMPLATE.md
```

---

## 2. Required Codex behavior for all design implementation

Every Codex UI implementation prompt must enforce:

1. plan first;
2. read design-control files before coding;
3. use reusable components;
4. preserve the stakeholder-liked visual direction;
5. align to DEC Blue `#3B99D4` and DEC Green `#91C852`;
6. avoid developer language in user-facing screens;
7. avoid Phase 2/3 modules;
8. avoid CRM/donor-management UI;
9. ensure responsive behavior;
10. ensure accessibility basics;
11. return an evidence pack with a Premium UI / Visual QA section.

---

## 3. Standard UI implementation prompt wrapper

Use this wrapper for any design-facing Codex task.

```txt
Plan first.

Implement [TASK NAME] for the DEC / WHH CSF+ CSO Learning Hub Phase 1 application.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/UI_SCREEN_BLUEPRINTS.md
- docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Objective:
[STATE OBJECTIVE]

Scope:
[STATE EXACT ROUTES / COMPONENTS / FILES]

Design constraints:
- Preserve continuity with the previously presented landing page and course catalogue visual direction.
- Use DEC Primary Blue #3B99D4 and DEC Accent Green #91C852.
- Use the approved design system and component library.
- Do not create generic, scaffold-looking, or placeholder-style UI.
- Do not show developer language such as placeholder, mock data, scaffold, slice, DB, Prisma, CRUD, TODO, WIP, backend, or frontend.
- Do not add Phase 2/3 active modules.
- Do not add CRM, donor-management, grants pipeline, diagnosis, capacity map, action map, collaboration, co-creation, practical proof, or badge verification UI.
- Preserve role-appropriate navigation.
- Ensure mobile-responsive behavior.
- Ensure accessibility basics.
- Keep changes minimal and focused.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- route smoke checks for affected routes
- desktop visual check
- mobile/narrow viewport visual check
- accessibility notes
- screenshot or visual evidence if available

Return the required evidence pack using:
docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Include a Premium UI / Visual QA section.
```

---

# 4. Prompt A — Install / implement design-control files and reference assets

Use this if design files have been created outside the repo and need to be added or reorganized.

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
3. Confirm reference screenshots are stored as:
   - docs/design/reference/previous-landing-page.png
   - docs/design/reference/previous-course-catalogue.png
   if available.
4. Add a small docs/design/README.md index linking the design files.
5. Do not change application code unless needed for documentation links.

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

# 5. Prompt B — Design tokens and base UI foundation

Use this before implementing major screens.

```txt
Plan first.

Implement the Premium Design Token and Base UI Foundation for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Objective:
Create the reusable design-token and base component foundation so future screens use premium, consistent, DEC-branded UI.

Scope:
1. Add or update global CSS/Tailwind tokens for:
   - DEC Primary Blue #3B99D4
   - DEC Accent Green #91C852
   - Deep Navy #0F172A
   - Dark Ink #111827
   - Light Background #F9FAFB
   - White Surface #FFFFFF
   - Border #E5E7EB
   - Muted Text #6B7280
   - radius tokens
   - shadow tokens
   - focus ring style
2. Create or update reusable base UI components:
   - PageHeader
   - SectionHeader
   - ActionButton
   - StatusBadge
   - EmptyState
   - AlertMessage
   - MetricCard
   - FilterBar
   - FormSection
3. Ensure components are accessible and responsive by default.
4. Do not redesign full pages yet.
5. Update current route placeholder pages only if needed to remove developer language and align with base layout, but keep changes minimal.

Design constraints:
- Use the approved visual source of truth and design system.
- Do not create generic shadcn/default-looking UI without customization.
- Do not expose developer language.
- Do not add Phase 2/3 modules.
- Do not add CRM/donor-management UI.

Acceptance criteria:
- Design tokens exist and are used by base components.
- Base components exist and are reusable.
- Components use DEC brand colors and approved typography/spacing.
- Focus states are visible.
- No developer wording is introduced.
- Existing app still builds.
- Evidence pack includes component list and UI QA notes.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- visually inspect representative routes:
  - /
  - /courses
  - /sign-in
  - /learn
  - /creator
  - /admin

Return evidence pack with Premium UI / Component QA section.
```

---

# 6. Prompt C — Shell and navigation upgrade

Use after design tokens and base components are ready.

```txt
Plan first.

Implement the Premium Shell and Navigation Foundation for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Objective:
Upgrade the public, learner, creator, and admin layout shells/navigation so all experience zones have premium, role-appropriate, non-generic UI foundations.

Scope:
1. Implement or upgrade:
   - PublicShell
   - PublicHeader
   - PublicFooter
   - LearnerShell
   - LearnerNavigation
   - CreatorShell
   - CreatorNavigation
   - AdminShell
   - AdminNavigation
2. Ensure route zones stay separate:
   - public users see only public navigation;
   - learners do not see admin/creator links;
   - creators see creator workflow links;
   - admins see admin operational links.
3. Ensure mobile navigation works or has a clean responsive fallback.
4. Remove any developer-facing words from visible navigation or shell text.
5. Preserve temporary auth/role protections already implemented.

Constraints:
- Do not implement full page functionality.
- Do not implement CRUD.
- Do not implement Build Studio functionality.
- Do not add Phase 2/3 active modules.
- Do not add CRM/donor-management UI.

Acceptance criteria:
- Public, learner, creator, and admin shells look visually distinct but brand-consistent.
- Navigation is role-appropriate.
- No developer language appears.
- Mobile/narrow behavior is usable.
- Existing auth guards still work.
- npm lint/typecheck/build pass.
- Evidence pack includes Premium UI / Visual QA.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Manual route checks:
  - /
  - /courses
  - /sign-in
  - /learn
  - /creator/courses
  - /admin
  - /admin/monitoring
- Signed-out, participant, creator, admin, M&E viewer route checks where applicable.

Return evidence pack.
```

---

# 7. Prompt D — Implement approved Landing Page

Use only after the landing mockup and screen design file exist.

```txt
Plan first.

Implement the approved Public Landing Page for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/screens/01_landing/DESIGN.md
- docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Use the approved visual reference if present:
- docs/design/screens/01_landing/screen.png

Objective:
Implement the `/` landing page to match the approved design direction and screen specification.

Scope:
1. Implement the landing page route `/`.
2. Use or create the required components:
   - PublicShell
   - PublicHeader
   - HeroSection
   - FeatureCard
   - SectionHeader
   - CourseCard
   - CTASection
   - PublicFooter
3. Preserve the previous stakeholder-liked visual direction:
   - contextual local learning hero image direction;
   - editorial heading feel;
   - sectioned storytelling flow;
   - course showcase;
   - dark institutional footer.
4. Use current Phase 1 messaging, not outdated prototype text.
5. Use DEC colors and approved component system.

Constraints:
- Do not show admin/creator controls.
- Do not show Phase 2/3 active modules.
- Do not show CRM/donor-management UI.
- Do not use developer language.
- Do not hard-code outdated prototype content.
- Do not break route protection elsewhere.

Acceptance criteria:
- Landing page is stakeholder-demo quality.
- Visual direction remains connected to previous approved reference.
- DEC colors are consistently applied.
- Hero is readable and premium.
- Course showcase uses consistent cards.
- Footer is polished.
- Responsive behavior works.
- Accessibility basics are satisfied.
- No developer language appears.
- npm lint/typecheck/build pass.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Route check `/`
- Desktop visual check
- Mobile/narrow visual check
- Screenshot or visual evidence if available

Return evidence pack with Premium UI / Visual QA section.
```

---

# 8. Prompt E — Implement approved Course Catalogue

Use only after the catalogue mockup and screen design file exist.

```txt
Plan first.

Implement the approved Course Catalogue page for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/screens/02_course_catalogue/DESIGN.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/SEED_DATA_PLAN.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Use the approved visual reference if present:
- docs/design/screens/02_course_catalogue/screen.png

Objective:
Implement `/courses` as a premium, consistent course discovery catalogue.

Scope:
1. Implement route `/courses`.
2. Use or create:
   - PublicShell
   - PageHeader
   - FilterBar
   - FeaturedCourseCard
   - CourseCard
   - StatusBadge
   - EmptyState
3. Show only published/public course examples or seed-backed data if available.
4. Include polished search/filter area.
5. Include featured course.
6. Include consistent course card grid.

Constraints:
- Do not show draft/internal review statuses.
- Do not show admin/creator controls.
- Do not show Phase 2/3 modules.
- Do not show CRM/donor-management UI.
- Do not use developer language.
- Do not expose raw database IDs as primary content.
- If data is not connected yet, use safe UI data matching SEED_DATA_PLAN.md and document it.

Acceptance criteria:
- Catalogue matches approved visual direction.
- Featured course card is consistent with the card system.
- Course cards have consistent image ratio, badges, metadata, and actions.
- Search/filter UI is clean.
- Desktop 3-column, tablet 2-column, mobile 1-column behavior works.
- No internal statuses appear.
- No developer language appears.
- npm lint/typecheck/build pass.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Route check `/courses`
- Desktop visual check
- Mobile visual check
- Screenshot or visual evidence if available

Return evidence pack with Premium UI / Visual QA section.
```

---

# 9. Prompt F — Implement approved Course Detail Page

```txt
Plan first.

Implement the approved Course Detail page for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/screens/03_course_detail/DESIGN.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/SEED_DATA_PLAN.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Use the approved visual reference if present:
- docs/design/screens/03_course_detail/screen.png

Objective:
Implement `/courses/[courseSlug]` as a premium participant-facing course overview page.

Scope:
1. Implement the published course detail route.
2. Use approved components:
   - PublicShell
   - PageHeader or CourseHero
   - StatusBadge
   - ActionButton
   - CourseInfoCard
   - ModuleOutline
   - LearningOutcomeList
   - CTA card
3. Use the “Proposal Development Fundamentals for Grassroots CSOs” seed course as the first example if database connection is not ready.
4. Show learning outcomes, module outline, duration, level, language, certificate, and start/sign-in action.

Constraints:
- Do not show draft/internal review/admin status.
- Do not show creator/admin controls.
- Do not show Build Studio controls.
- Do not show Phase 2/3 modules.
- Do not show CRM/donor-management UI.
- Do not use developer language.

Acceptance criteria:
- Route renders a polished public course detail page.
- Only published/public course content is shown.
- Learning outcomes and module outline are readable.
- CTA is clear.
- Responsive layout works.
- No internal controls or developer language appear.
- npm lint/typecheck/build pass.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Route check `/courses/proposal-development-fundamentals-grassroots-csos`
- Desktop visual check
- Mobile visual check

Return evidence pack with Premium UI / Visual QA section.
```

---

# 10. Prompt G — Implement approved Learner Dashboard

```txt
Plan first.

Implement the approved Learner Dashboard for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/screens/04_learner_dashboard/DESIGN.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/SEED_DATA_PLAN.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Use the approved visual reference if present:
- docs/design/screens/04_learner_dashboard/screen.png

Objective:
Implement `/learn` as a warm, premium, participant-focused learning dashboard.

Scope:
1. Implement or upgrade `/learn`.
2. Use:
   - LearnerShell
   - LearnerWelcomePanel
   - ContinueLearningCard
   - ProgressCard
   - CourseCard
   - CertificateCard
   - EmptyState
3. Show safe seed/demo-backed data if live DB connection is not ready.
4. Keep the learner experience supportive and non-admin-like.

Constraints:
- Do not show admin/creator controls.
- Do not show internal course lifecycle statuses.
- Do not show Phase 2/3 modules.
- Do not show CRM/donor-management UI.
- Do not use developer language.
- Preserve auth protection.

Acceptance criteria:
- Participant dashboard is stakeholder-demo quality.
- Continue learning is visually prominent.
- Course progress and certificates are clear.
- Empty state is polished.
- Responsive behavior works.
- Participant cannot access admin/creator areas.
- npm lint/typecheck/build pass.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Sign in as participant and route check `/learn`
- Desktop visual check
- Mobile visual check
- Confirm participant cannot access `/admin` or `/creator`

Return evidence pack with Premium UI / Visual QA section.
```

---

# 11. Prompt H — Implement approved Learner Course Player

```txt
Plan first.

Implement the approved Learner Course Player for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/screens/05_learner_course_player/COURSE_PLAYER_REDESIGN_SPEC.md
- docs/design/reference/agora-course-player/AGORA_REFERENCE_NOTES.md
- docs/design/reference/articulate-360-elearning/ARTICULATE_AUTHORING_REFERENCE_NOTES.md
- docs/design/LEARNER_TEMPLATE_SYSTEM.md
- docs/design/screens/05_learner_course_player/DESIGN.md
- docs/design/screens/05_learner_course_player/IMPLEMENTATION_NOTES.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/SEED_DATA_PLAN.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Use the approved visual reference if present:
- docs/design/screens/05_learner_course_player/screen.png

Reference priority:
- Agora/spec guidance is primary for learner course-player layout.
- Articulate references are secondary for block/interaction inspiration, not player shell layout.

Objective:
Implement `/learn/courses/[courseSlug]` as a polished participant-facing course player that renders structured modules, lessons, and content blocks.

Scope:
1. Implement or upgrade the learner course player route.
2. Use:
   - LearnerShell
   - LearnerCourseShell
   - CoursePlayerHeader
   - CourseOutline
   - LessonContent
   - LessonBlockRenderer
   - learner block components for text, key message, resource, case study, accordion, flashcard, knowledge check, branching scenario, and practical activity where feasible.
3. Use seed/demo course structure if full backend integration is not ready.
4. Ensure layout supports desktop two-column and mobile collapsed outline.

Constraints:
- Do not show creator/admin controls.
- Do not show block configuration.
- Do not show internal readiness/review status.
- Do not show raw JSON.
- Do not show developer language.
- Do not add practical proof verification.
- Do not add badges as active verification feature.
- Preserve published-only rule where backend connection exists.

Acceptance criteria:
- Course player feels like a professional digital course.
- Module/lesson outline is clear.
- Lesson content blocks render as learning content, not raw data.
- Progress is visible but not overwhelming.
- Previous/next controls are clear.
- Mobile/narrow layout works.
- No admin/creator controls appear.
- npm lint/typecheck/build pass.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Participant route check `/learn/courses/proposal-development-fundamentals-grassroots-csos`
- Desktop visual check
- Mobile visual check

Return evidence pack with Premium UI / Visual QA section.
```

---

# 12. Prompt I — Implement approved Build Studio UI

```txt
Plan first.

Implement the approved Build Studio UI foundation for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/screens/08_build_studio/DESIGN.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Use the approved visual reference if present:
- docs/design/screens/08_build_studio/screen.png

Objective:
Implement `/creator/courses/[courseId]/build` as a premium, clean, three-column course authoring workspace.

Scope:
1. Build or upgrade:
   - BuildStudioShell
   - BuildStudioHeader
   - BlockLibraryPanel
   - CourseOutlinePanel
   - CourseCanvas
   - CanvasBlockCard
   - BlockConfigPanel
   - ReadinessChip, if needed.
2. Preserve required three-column desktop layout:
   - left: Block Library + Course Outline;
   - center: Course Canvas;
   - right: Block Configuration.
3. Use safe demo/seed content if live backend is not ready.
4. Keep functionality minimal if this is UI foundation only; document non-functional controls clearly in evidence pack without showing developer language in UI.

Constraints:
- Do not add diagnosis panels.
- Do not add capacity map/action map panels.
- Do not add monitoring charts.
- Do not add CRM/donor compliance.
- Do not add heavy governance cards.
- Do not show review history inside canvas.
- Do not show participant-facing navigation.
- Do not use developer language.
- Preserve creator/admin route protection.

Acceptance criteria:
- Three-column Build Studio layout is clear and premium.
- Canvas remains focused on content creation.
- Right panel configures only selected block.
- Block Library and Course Outline are easy to scan.
- No governance/diagnosis/monitoring/CRM clutter appears.
- Responsive/narrow behavior is documented or implemented.
- npm lint/typecheck/build pass.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Sign in as creator and check `/creator/courses/demo-course/build` or an available course ID
- Desktop visual check
- Narrow viewport check
- Confirm participant cannot access creator route

Return evidence pack with Premium UI / Visual QA section.
```

---

# 13. Prompt J — Implement approved Admin Dashboard UI

```txt
Plan first.

Implement the approved Admin Dashboard UI for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/screens/09_admin_dashboard/DESIGN.md
- docs/specs/phase-1-cso-learning-hub/ADMIN_PORTAL_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Use the approved visual reference if present:
- docs/design/screens/09_admin_dashboard/screen.png

Objective:
Implement `/admin` as a calm, operational, premium admin dashboard.

Scope:
1. Use:
   - AdminShell
   - PageHeader
   - MetricCard
   - QuickActionCard
   - DataTable or clean list cards
   - StatusBadge
   - EmptyState
2. Show KPI cards required by Admin Portal spec.
3. Show quick actions, courses needing attention, recent activity, and certificate/feedback summary.
4. Use seed/demo data if backend data wiring is not complete, and document it.

Constraints:
- Do not show CRM/donor pipeline.
- Do not show funding metrics.
- Do not show full diagnosis/capacity map analytics.
- Do not show Phase 2/3 modules.
- Do not use developer language.
- Preserve admin route protection.

Acceptance criteria:
- Dashboard is operational and uncluttered.
- KPI cards are readable.
- Quick actions are useful.
- No CRM/donor/Phase 2/3 elements appear.
- Responsive behavior works.
- Admin route protection still works.
- npm lint/typecheck/build pass.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Sign in as admin and check `/admin`
- Confirm participant cannot access `/admin`
- Desktop visual check
- Mobile/narrow visual check

Return evidence pack with Premium UI / Visual QA section.
```

---

# 14. Prompt K — Implement approved Monitoring Dashboard UI

```txt
Plan first.

Implement the approved Monitoring Dashboard UI for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/screens/10_monitoring_dashboard/DESIGN.md
- docs/specs/phase-1-cso-learning-hub/MONITORING_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ADMIN_PORTAL_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Use the approved visual reference if present:
- docs/design/screens/10_monitoring_dashboard/screen.png

Objective:
Implement `/admin/monitoring` as a clean operational learning monitoring dashboard.

Scope:
1. Use:
   - AdminShell
   - PageHeader
   - MonitoringFilterBar
   - MonitoringKpiGrid
   - MetricCard
   - AttentionSignalCard
   - CourseProgressTable
   - CohortProgressTable
   - OrganizationParticipationTable
   - AssessmentSummaryPanel
   - FeedbackSummaryPanel
2. Show required Phase 1 metrics:
   - registered participants;
   - active participants;
   - CSO organizations;
   - cohorts;
   - published courses;
   - enrollments;
   - completion rate;
   - final test pass rate;
   - certificates issued;
   - average course rating.
3. Use seed/demo data if live metrics are not ready, and document it.

Constraints:
- Do not claim long-term CSO capacity impact.
- Do not show donor CRM or grants pipeline.
- Do not show diagnosis/capacity map/action map analytics.
- Do not overexpose participant-level personal data.
- Do not use developer language.
- Preserve M&E Viewer monitoring access and block other admin pages as already defined.

Acceptance criteria:
- Monitoring dashboard is clean and decision-oriented.
- KPI cards and tables are readable.
- Attention signals are concise.
- No impact overclaiming.
- No CRM/donor/Phase 2/3 elements appear.
- Responsive behavior works.
- Admin and M&E Viewer access work as intended.
- npm lint/typecheck/build pass.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Sign in as admin and check `/admin/monitoring`
- Sign in as M&E Viewer and check `/admin/monitoring`
- Confirm M&E Viewer cannot access unrelated admin management pages
- Confirm participant cannot access `/admin/monitoring`
- Desktop visual check
- Mobile/narrow visual check

Return evidence pack with Premium UI / Visual QA section.
```

---

# 15. Prompt L — Visual QA correction pass

Use this when Codex produces a UI that works but looks weak or inconsistent.

```txt
Plan first.

Perform a Visual QA Correction Pass for [SCREEN / ROUTE] in the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- relevant docs/design/screens/[screen]/DESIGN.md if available
- relevant product spec under docs/specs/phase-1-cso-learning-hub/
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Problem:
The current screen works technically but does not meet the required premium UI/UX standard.

Objective:
Improve the screen visually and structurally without changing business scope.

Focus areas:
- stronger visual hierarchy;
- improved spacing;
- consistent DEC colors;
- improved card/table/form styling;
- better empty/loading/error states;
- remove developer language;
- improve mobile layout;
- improve accessibility basics;
- remove any Phase 2/3 or CRM/donor-management drift;
- align with approved visual source of truth.

Constraints:
- Do not add new business features.
- Do not change schema unless absolutely necessary.
- Do not alter route permissions except to fix bugs.
- Do not add Phase 2/3 modules.
- Do not add CRM/donor-management UI.
- Do not replace the approved design direction.

Acceptance criteria:
- Visual QA status improves to PASS or clearly documented PARTIAL with minor gaps.
- No developer language visible.
- Responsive behavior is improved.
- Accessibility basics are improved.
- npm lint/typecheck/build pass.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- route check for affected page
- desktop visual check
- mobile visual check
- screenshot or visual evidence if available

Return evidence pack with before/after visual notes.
```

---

# 16. Prompt M — Remove developer language from UI

Use when Codex leaks internal wording into user-facing screens.

```txt
Plan first.

Remove developer/internal language from user-facing UI across the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/DESIGN_SYSTEM.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Objective:
Find and replace user-facing developer/internal language with safe product language.

Search for visible UI strings including:
- Slice
- Scaffold
- Placeholder
- Mock data
- Fake data
- TODO
- Implementation pending
- Route shell
- Demo only
- DB
- Prisma
- Migration
- CRUD
- Backend
- Frontend
- Lorem ipsum
- WIP

Scope:
1. Search application UI files for these strings.
2. Replace visible UI copy with user-safe alternatives.
3. Do not change documentation files unless explicitly needed.
4. Do not change technical comments unless they render in UI.
5. Do not change product behavior.

Acceptance criteria:
- No banned developer/internal language appears in user-facing routes.
- Replacements are clear and product-safe.
- npm lint/typecheck/build pass.
- Evidence pack lists files changed and strings replaced.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- route spot checks:
  - /
  - /courses
  - /sign-in
  - /learn
  - /creator/courses
  - /admin

Return evidence pack.
```

---

# 17. Prompt N — Mobile responsiveness pass

Use before stakeholder demos or after major UI work.

```txt
Plan first.

Perform a Mobile Responsiveness Pass for the DEC / WHH CSF+ CSO Learning Hub priority screens.

Before making changes, read:
- docs/design/DESIGN_SYSTEM.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/COMPONENT_LIBRARY.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Priority screens:
- /
- /courses
- /courses/proposal-development-fundamentals-grassroots-csos
- /learn
- /learn/courses/proposal-development-fundamentals-grassroots-csos
- /creator/courses
- /creator/courses/[courseId]/build
- /admin
- /admin/monitoring

Objective:
Improve narrow/mobile viewport usability without adding new business features.

Focus:
- no horizontal overflow;
- cards stack cleanly;
- navigation collapses or remains usable;
- buttons are tappable;
- text remains readable;
- tables scroll safely or become cards;
- learner course outline collapses;
- Build Studio panels collapse or remain usable;
- footer/partner logos wrap cleanly.

Constraints:
- Do not add new scope.
- Do not change business logic.
- Do not add Phase 2/3 modules.
- Do not add CRM/donor UI.

Acceptance criteria:
- Priority screens are usable at mobile/narrow widths.
- No major horizontal overflow.
- npm lint/typecheck/build pass.
- Evidence pack includes mobile check notes and remaining gaps.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Manual or screenshot checks at around 390px and desktop width where possible.

Return evidence pack.
```

---

# 18. Prompt O — Pre-demo visual acceptance audit

Use before showing stakeholders.

```txt
Plan first.

Perform a Pre-Demo Visual Acceptance Audit for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Objective:
Audit the current UI against the premium stakeholder-demo quality standard.

Do not modify files in the first pass. Report findings first.

Audit screens:
- Landing page
- Course catalogue
- Course detail
- Sign in
- Learner dashboard
- Learner course player
- Certificates
- Creator My Courses
- Build Studio
- Admin dashboard
- Monitoring dashboard

Check:
- visual quality;
- design system consistency;
- developer language;
- role-appropriate navigation;
- mobile behavior;
- accessibility basics;
- DEC color consistency;
- course card consistency;
- Build Studio cleanliness;
- admin/monitoring clutter;
- no Phase 2/3 drift;
- no CRM/donor-management drift.

Return:
1. screen-by-screen rating:
   - PASS
   - PARTIAL
   - FAIL
2. top 10 visual issues;
3. critical blockers before stakeholder demo;
4. recommended correction slices;
5. evidence pack.

Do not implement fixes until the audit is reviewed.
```

---

# 19. Final implementation instruction

These prompts are control tools.

Use them to keep Codex focused, deterministic, and visually accountable.

Do not ask Codex to “make it look better” without providing the relevant design files, route, scope, and acceptance criteria.

Every UI prompt should force Codex to:

1. read the design system;
2. use approved components;
3. avoid developer language;
4. preserve visual continuity;
5. return visual QA evidence.
