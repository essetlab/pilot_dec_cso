# CODEX_IMPLEMENTATION_PLAN.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Codex Implementation Plan

## 1. Document purpose

This file defines the deterministic implementation plan for Codex or any AI coding agent building Phase 1 of the CSO Learning Hub.

Codex must follow this plan slice by slice.

Codex must not jump ahead, merge unrelated work, introduce unapproved modules, or redesign the product beyond the approved specifications.

---

## 2. Controlling documents

Before implementing any slice, Codex must read the relevant controlling files.

Required files:

1. `PRODUCT_SPEC.md`
2. `ROUTE_MAP.md`
3. `DATA_MODEL.md`
4. `BUILD_STUDIO_SPEC.md`
5. `LEARNER_TEMPLATE_SPEC.md`
6. `ADMIN_PORTAL_SPEC.md`
7. `MONITORING_SPEC.md`
8. `ACCEPTANCE_TESTS.md`
9. `EVIDENCE_PACK_TEMPLATE.md`
10. `SEED_DATA_PLAN.md`

If any file is missing, Codex must report the missing file and proceed only with the available approved files, without inventing major product decisions.

---

## 3. Implementation philosophy

## 3.1 Plan first

For every slice, Codex must first provide a short implementation plan before modifying files.

The plan must include:

1. objective;
2. files/routes likely to change;
3. data/schema impact;
4. risks;
5. acceptance tests to check.

## 3.2 Smallest safe change

Codex must implement the smallest safe change that satisfies the current slice.

Codex must not combine multiple slices unless explicitly instructed.

## 3.3 Evidence after implementation

After every slice, Codex must produce an evidence pack using `EVIDENCE_PACK_TEMPLATE.md`.

## 3.4 No product drift

Codex must not add:

1. CRM features;
2. donor management;
3. full diagnosis workflow;
4. capacity map/action map modules;
5. knowledge management;
6. collaboration spaces;
7. co-creation workspaces;
8. practical proof verification;
9. badges;
10. AI authoring;
11. advanced impact dashboards.

## 3.5 Build Studio protection

Codex must preserve the clean three-column Build Studio:

1. left: Block Library / Course Outline;
2. center: Course Canvas;
3. right: Block Configuration.

Codex must not add governance-heavy, diagnosis-heavy, monitoring-heavy, or CRM-style panels to the Build Studio.

---

# 4. Recommended repository placement

Create a documentation folder if not already present:

```txt
docs/specs/phase-1-cso-learning-hub/
```

Place the handoff files there:

```txt
docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
docs/specs/phase-1-cso-learning-hub/DATA_MODEL.md
docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
docs/specs/phase-1-cso-learning-hub/ADMIN_PORTAL_SPEC.md
docs/specs/phase-1-cso-learning-hub/MONITORING_SPEC.md
docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
docs/specs/phase-1-cso-learning-hub/CODEX_IMPLEMENTATION_PLAN.md
docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md
docs/specs/phase-1-cso-learning-hub/SEED_DATA_PLAN.md
```

Codex may adapt folder path to existing repo conventions but must keep the files together and easy to find.

---

# 5. Slice overview

Implement Phase 1 in these slices:

1. Slice 0 — Repository intake and baseline audit
2. Slice 1 — Documentation handoff package placement
3. Slice 2 — Foundation route map and layouts
4. Slice 3 — Authentication and role foundation
5. Slice 4 — Data model and migrations
6. Slice 5 — Seed data foundation
7. Slice 6 — Admin shell and dashboard
8. Slice 7 — User, organization, and cohort management
9. Slice 8 — Course model and admin course management
10. Slice 9 — Course Creator portal foundation
11. Slice 10 — Build Studio core layout
12. Slice 11 — Build Studio core content blocks
13. Slice 12 — Build Studio interactive blocks
14. Slice 13 — Learner template and course player
15. Slice 14 — Quiz and final test engine
16. Slice 15 — Certificate engine
17. Slice 16 — Review and publish workflow
18. Slice 17 — Participant dashboard and learning flow
19. Slice 18 — Monitoring dashboard
20. Slice 19 — Feedback flow
21. Slice 20 — Accessibility, mobile, and UI polish
22. Slice 21 — End-to-end demo and acceptance QA
23. Slice 22 — Stabilization and handoff

---

# 6. Slice 0 — Repository intake and baseline audit

## Objective

Understand the current repository state before making changes.

## Codex must inspect

1. package manager and scripts;
2. framework version;
3. route structure;
4. existing auth;
5. existing database/ORM;
6. existing UI components;
7. existing admin/creator/learner pages;
8. existing seed data;
9. existing tests;
10. environment files.

## Codex must not

1. modify files before reporting the audit;
2. delete existing work;
3. assume there is no existing implementation.

## Acceptance criteria

Codex reports:

1. current stack;
2. existing routes;
3. existing models/schema;
4. existing auth/role logic;
5. existing relevant pages/components;
6. risks;
7. recommended next safe slice.

## Suggested prompt to Codex

```txt
Plan first. Perform Slice 0: Repository intake and baseline audit for the DEC / WHH CSF+ CSO Learning Hub Phase 1 build.

Read the repo structure, package scripts, route structure, auth/role logic, database/ORM schema, seed data, UI components, and existing admin/creator/learner pages.

Do not modify files.

Return an evidence pack with:
- current stack
- existing routes
- existing schema/models
- existing auth/role logic
- existing relevant screens/components
- gaps against PRODUCT_SPEC.md, ROUTE_MAP.md, DATA_MODEL.md
- risks
- next smallest safe implementation step
```

---

# 7. Slice 1 — Documentation handoff package placement

## Objective

Place all approved specification files into the repository.

## Required files

1. `PRODUCT_SPEC.md`
2. `ROUTE_MAP.md`
3. `DATA_MODEL.md`
4. `BUILD_STUDIO_SPEC.md`
5. `LEARNER_TEMPLATE_SPEC.md`
6. `ADMIN_PORTAL_SPEC.md`
7. `MONITORING_SPEC.md`
8. `ACCEPTANCE_TESTS.md`
9. `CODEX_IMPLEMENTATION_PLAN.md`
10. `EVIDENCE_PACK_TEMPLATE.md`
11. `SEED_DATA_PLAN.md`

## Acceptance criteria

1. Files are placed in approved docs folder.
2. README or index points to them.
3. No application logic changes unless needed for docs index.
4. Evidence pack lists files added.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 1: place the approved Phase 1 Codex handoff package into docs/specs/phase-1-cso-learning-hub/.

Add or update a small index README in that folder linking all files.

Do not change application logic.

Return the required evidence pack.
```

---

# 8. Slice 2 — Foundation route map and layouts

## Objective

Create or align route groups, protected shells, and placeholder pages according to `ROUTE_MAP.md`.

## Required route zones

1. public;
2. auth;
3. participant/learn;
4. creator;
5. admin.

## Required routes

At minimum create shells for:

```txt
/
 /courses
 /courses/[courseSlug]
 /sign-in
 /register
 /learn
 /learn/my-courses
 /learn/courses/[courseSlug]
 /learn/courses/[courseSlug]/final-test
 /learn/certificates
 /creator
 /creator/courses
 /creator/courses/new
 /creator/courses/[courseId]/setup
 /creator/courses/[courseId]/metadata
 /creator/courses/[courseId]/outcomes
 /creator/courses/[courseId]/build
 /creator/courses/[courseId]/resources
 /creator/courses/[courseId]/quiz
 /creator/courses/[courseId]/preview
 /creator/courses/[courseId]/submit
 /admin
 /admin/users
 /admin/organizations
 /admin/cohorts
 /admin/courses
 /admin/review
 /admin/certificates
 /admin/reference-data
 /admin/monitoring
 /admin/audit-log
 /admin/settings
```

## Acceptance criteria

1. Routes exist or are mapped to existing equivalents.
2. Layouts are separated by user zone.
3. Placeholder pages are clean and labeled.
4. Public routes do not show admin/creator navigation.
5. Creator and admin shells are not exposed to public users once auth exists.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 2: route map and layout foundation according to docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md.

Create or align public, auth, learner, creator, and admin route shells. Use clean placeholder pages where full functionality is not yet implemented.

Do not implement business logic yet. Do not add Phase 2/3 routes.

Return evidence pack with routes created/changed and manual verification steps.
```

---

# 9. Slice 3 — Authentication and role foundation

## Objective

Implement or align authentication, role model, route protection, and role-aware navigation.

## Required roles

1. Super Admin
2. Platform Admin
3. Course Creator
4. Course Reviewer
5. Facilitator
6. CSO Focal Person
7. Participant
8. M&E Viewer

## Required behavior

1. Public routes are accessible without sign-in.
2. `/learn` requires participant/authenticated access.
3. `/creator` requires Course Creator or Admin.
4. `/admin` requires Admin.
5. `/admin/monitoring` allows Admin or M&E Viewer.
6. Unauthorized access shows safe message or redirect.

## Acceptance criteria

1. Participant cannot access `/admin` or `/creator`.
2. Course Creator cannot access `/admin` unless also Admin.
3. Admin can access `/admin`.
4. M&E Viewer can access monitoring only if implemented.
5. Role checks are centralized and maintainable.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 3: authentication and role foundation.

Use the existing repo auth approach if present. Add/align roles from DATA_MODEL.md and protect public, learner, creator, admin, and monitoring routes according to ROUTE_MAP.md.

Do not build full user management UI yet. Do not add unapproved roles.

Return evidence pack including role guard behavior and manual verification steps.
```

---

# 10. Slice 4 — Data model and migrations

## Objective

Implement the Phase 1 data model according to `DATA_MODEL.md`.

## Required core entities

1. User
2. Role
3. UserRoleAssignment
4. Organization
5. Cohort
6. CohortOrganization
7. CapacityArea
8. Course
9. CourseCapacityArea
10. LearningOutcome
11. CourseVersion
12. Module
13. Lesson
14. ContentBlock
15. Resource
16. Quiz
17. QuizQuestion
18. QuizAttempt
19. CourseAssignment
20. Enrollment
21. LessonProgress
22. Certificate
23. Feedback
24. AuditLog

## Acceptance criteria

1. Schema/migrations apply successfully.
2. Enums/statuses match approved meanings.
3. Course structure supports Course → CourseVersion → Module → Lesson → ContentBlock.
4. Certificate rules can be enforced.
5. Organization/cohort relationships are supported.
6. No CRM or Phase 2/3 tables are added unless future-compatible only and explicitly minimal.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 4: Phase 1 data model and migrations according to DATA_MODEL.md.

Add/align required entities, enums, relationships, and indexes. Preserve existing data where applicable. Do not add CRM, full diagnosis, capacity map, action map, practical proof, badge, collaboration, or co-creation modules.

Run schema validation/migration checks.

Return evidence pack with schema changes, migration commands, risks, and verification.
```

---

# 11. Slice 5 — Seed data foundation

## Objective

Create safe demo/seed data for development, QA, and demo flows.

## Required seed records

1. one Super Admin;
2. one Platform Admin;
3. one Course Creator;
4. one Course Reviewer;
5. one M&E Viewer;
6. three Participants;
7. two CSO Organizations;
8. one Cohort;
9. starter Capacity Areas;
10. one draft course;
11. one ready-for-review course;
12. one published demo course;
13. modules/lessons/content blocks;
14. final test;
15. enrollments;
16. one completed enrollment;
17. one issued certificate;
18. feedback records;
19. audit log examples.

## Acceptance criteria

1. Seed runs without error.
2. Demo accounts can sign in or are clearly documented.
3. Published course appears in learner catalogue.
4. Draft course does not appear to participants.
5. Monitoring has meaningful demo data.
6. Seed data contains no sensitive real personal data.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 5: safe seed data foundation according to SEED_DATA_PLAN.md and DATA_MODEL.md.

Create demo roles, users, organizations, cohort, capacity areas, draft/ready/published courses, content blocks, final test, enrollments, certificate, feedback, and audit examples.

Do not use real sensitive personal data.

Return evidence pack with seed command, demo accounts, and verification steps.
```

---

# 12. Slice 6 — Admin shell and dashboard

## Objective

Implement Admin Portal shell and dashboard.

## Required route

```txt
/admin
```

## Required dashboard cards

1. Total users
2. Total participants
3. CSO organizations
4. Cohorts
5. Courses
6. Published courses
7. Active enrollments
8. Completions
9. Certificates issued
10. Courses awaiting review

## Acceptance criteria

1. Admin can open dashboard.
2. Participant cannot open dashboard.
3. Dashboard uses real/seed data.
4. Empty states are clean.
5. No CRM/donor/Phase 2 modules are added.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 6: Admin shell and dashboard according to ADMIN_PORTAL_SPEC.md.

Build /admin layout, navigation, dashboard KPI cards, recent activity placeholders or real data where available, and clean empty states.

Do not build CRM, donor management, diagnosis, capacity map, or collaboration modules.

Return evidence pack.
```

---

# 13. Slice 7 — User, organization, and cohort management

## Objective

Implement core admin management for users, CSO organizations, and cohorts.

## Required routes

```txt
/admin/users
/admin/users/new
/admin/users/[userId]
/admin/organizations
/admin/organizations/new
/admin/organizations/[organizationId]
/admin/cohorts
/admin/cohorts/new
/admin/cohorts/[cohortId]
```

## Acceptance criteria

1. Admin can create/edit users.
2. Admin can assign roles.
3. Admin can activate/deactivate users.
4. Admin can create/edit organizations.
5. Admin can link participants to organizations.
6. Admin can create/edit cohorts.
7. Admin can assign organizations/participants to cohorts.
8. Actions are logged where audit exists.
9. No full CRM functionality is added.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 7: user, organization, and cohort management according to ADMIN_PORTAL_SPEC.md and DATA_MODEL.md.

Build admin list/detail/create/edit flows for users, organizations, and cohorts. Include role assignment and organization/cohort linking where supported.

Keep the UI operational and simple. Do not add CRM features.

Return evidence pack with manual verification steps.
```

---

# 14. Slice 8 — Course model and admin course management

## Objective

Implement course list/detail management for Admins.

## Required routes

```txt
/admin/courses
/admin/courses/[courseId]
```

## Required functionality

1. list courses;
2. filter by status, capacity area, creator, level;
3. view course details;
4. view course version summary;
5. assign creator;
6. preview course;
7. view readiness summary;
8. view publication state.

## Acceptance criteria

1. Admin can see all courses.
2. Draft/published statuses display correctly.
3. Admin can open course detail.
4. Course detail does not duplicate full Build Studio.
5. Participants cannot access admin course management.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 8: Admin course management according to ADMIN_PORTAL_SPEC.md, ROUTE_MAP.md, and DATA_MODEL.md.

Build /admin/courses and /admin/courses/[courseId] with filters, course summary, status, creator, capacity area, version, readiness summary, and preview link.

Do not implement full content editing here; content editing belongs in /creator/courses/[courseId]/build.

Return evidence pack.
```

---

# 15. Slice 9 — Course Creator portal foundation

## Objective

Implement Course Creator shell and foundational course setup screens.

## Required routes

```txt
/creator
/creator/courses
/creator/courses/new
/creator/courses/[courseId]/setup
/creator/courses/[courseId]/metadata
/creator/courses/[courseId]/outcomes
```

## Required functionality

1. My Courses list;
2. create new draft course;
3. edit course setup;
4. edit capacity metadata;
5. manage learning outcomes.

## Acceptance criteria

1. Course Creator can create draft course.
2. Draft course is assigned to creator.
3. Creator can enter course metadata and capacity linkage.
4. Creator can add learning outcomes.
5. No full diagnosis/capacity map/action map workflow is added.
6. Participant cannot access creator routes.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 9: Course Creator portal foundation according to PRODUCT_SPEC.md, ROUTE_MAP.md, and DATA_MODEL.md.

Build My Courses, create course, setup, metadata/capacity linkage, and learning outcomes screens.

Do not add full diagnosis, capacity map, action map, or governance-heavy screens.

Return evidence pack.
```

---

# 16. Slice 10 — Build Studio core layout

## Objective

Implement the clean three-column Build Studio shell.

## Required route

```txt
/creator/courses/[courseId]/build
```

## Required layout

1. left: Block Library + Course Outline;
2. center: Course Canvas;
3. right: Block Configuration.

## Required functionality

1. load course/modules/lessons;
2. create module;
3. create lesson;
4. select lesson;
5. show empty lesson state;
6. show no block selected state;
7. compact header with save/preview actions.

## Acceptance criteria

1. Three-column layout exists.
2. Course outline works.
3. Module/lesson creation works.
4. Canvas remains clean.
5. Right panel changes only for selected block or empty state.
6. No governance/diagnosis/monitoring/CRM panels are present.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 10: Build Studio core layout according to BUILD_STUDIO_SPEC.md.

Build /creator/courses/[courseId]/build with left Block Library/Course Outline, center Course Canvas, and right Block Configuration panel. Support module/lesson creation and lesson selection.

Do not add diagnosis, capacity map, monitoring, CRM, or governance-heavy panels.

Return evidence pack with screenshots/manual verification steps if possible.
```

---

# 17. Slice 11 — Build Studio core content blocks

## Objective

Implement core content/media block types.

## Required blocks

1. Text / Reading
2. Video
3. Image / Visual
4. Downloadable Resource
5. External Link
6. Case Study
7. Key Message / Summary

## Required functionality

For each block:

1. add to selected lesson;
2. configure in right panel;
3. render in canvas;
4. save/load;
5. reorder;
6. duplicate;
7. delete;
8. render in preview placeholder or learner renderer if available.

## Acceptance criteria

1. Creator can add and configure each core block.
2. Block order persists.
3. Duplicate works.
4. Delete works with confirmation.
5. Missing transcript/alt/resource label warnings show lightly.
6. No block content is stored only as one big lesson HTML blob.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 11: Build Studio core content blocks according to BUILD_STUDIO_SPEC.md and DATA_MODEL.md.

Add Text, Video, Image, Resource, External Link, Case Study, and Key Message blocks with right-panel configuration, canvas rendering, save/load, reorder, duplicate, and delete.

Keep readiness warnings lightweight. Do not add governance panels.

Return evidence pack.
```

---

# 18. Slice 12 — Build Studio interactive blocks

## Objective

Implement interactive and practice block types.

## Required blocks

1. Accordion
2. Flashcard
3. Reflection Prompt
4. Knowledge Check
5. Multiple Choice Question
6. True/False Question
7. Branching Scenario
8. Practical Activity Prompt
9. Short Answer Prompt, self-reflection only

## Required functionality

For each block:

1. add to selected lesson;
2. configure in right panel;
3. render in canvas;
4. save/load;
5. render in preview/learner template;
6. validate missing required fields.

## Acceptance criteria

1. Interactive blocks can be added and configured.
2. Knowledge check gives feedback.
3. Branching scenario supports one-step decision/feedback.
4. Short answer is not auto-scored.
5. Practical Activity does not implement full proof verification.
6. All blocks have learner rendering support.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 12: Build Studio interactive blocks according to BUILD_STUDIO_SPEC.md and LEARNER_TEMPLATE_SPEC.md.

Add Accordion, Flashcard, Reflection Prompt, Knowledge Check, Multiple Choice, True/False, Branching Scenario, Practical Activity Prompt, and Short Answer Prompt.

Do not implement full practical proof verification. Do not auto-score short answers.

Return evidence pack.
```

---

# 19. Slice 13 — Learner template and course player

## Objective

Implement participant-facing published course rendering.

## Required routes

```txt
/courses/[courseSlug]
/learn/courses/[courseSlug]
/learn/courses/[courseSlug]/lessons/[lessonId] optional
```

## Required functionality

1. public course detail;
2. course player;
3. module/lesson navigation;
4. content block rendering;
5. progress indicator;
6. resource downloads;
7. mobile-responsive course layout;
8. only published courses visible to participants.

## Acceptance criteria

1. Published course renders from Build Studio content model.
2. Draft/unpublished courses are not visible to participants.
3. All implemented block types render in learner view.
4. Course player has clean LMS-quality layout.
5. No creator/admin controls appear.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 13: learner template and course player according to LEARNER_TEMPLATE_SPEC.md.

Build public course detail and participant course player rendering from the structured CourseVersion/Module/Lesson/ContentBlock model. Support all Build Studio blocks already implemented.

Do not expose unpublished courses or creator/admin controls.

Return evidence pack.
```

---

# 20. Slice 14 — Quiz and final test engine

## Objective

Implement final test setup, participant test taking, scoring, and pass/fail logic.

## Required routes

```txt
/creator/courses/[courseId]/quiz
/learn/courses/[courseSlug]/final-test
```

## Required functionality

1. create final test;
2. add multiple choice questions;
3. add true/false questions;
4. mark correct answers;
5. configure pass threshold;
6. participant submits final test;
7. score is calculated;
8. pass/fail result displays;
9. attempts are recorded.

## Acceptance criteria

1. Creator/Admin can create final test.
2. Missing correct answer blocks publication.
3. Participant can take final test.
4. Score and pass/fail are accurate.
5. Failed test does not issue certificate.
6. Passed test contributes to completion/certificate eligibility.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 14: quiz and final test engine according to DATA_MODEL.md, BUILD_STUDIO_SPEC.md, and LEARNER_TEMPLATE_SPEC.md.

Build final test setup, multiple choice/true-false questions, correct answers, pass threshold, participant final test route, scoring, attempts, and pass/fail result.

Do not auto-score short answer questions.

Return evidence pack.
```

---

# 21. Slice 15 — Certificate engine

## Objective

Implement certificate eligibility, issuance, listing, detail, and download/rendering.

## Required routes

```txt
/learn/certificates
/learn/certificates/[certificateId]
/admin/certificates
/admin/certificates/settings
/admin/certificates/[certificateId]
```

## Required functionality

1. certificate eligibility check;
2. issue certificate after completion/pass;
3. prevent duplicate certificate for same user/course version;
4. participant certificate list/detail;
5. admin certificate records;
6. certificate code;
7. PDF/download if feasible.

## Acceptance criteria

1. Certificate is not issued before completion/pass.
2. Certificate is issued after required lessons and final test pass.
3. Certificate appears for participant.
4. Certificate appears in admin records.
5. Duplicate certificates are prevented.
6. Default pass threshold is 80% unless configured otherwise.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 15: certificate engine according to PRODUCT_SPEC.md, DATA_MODEL.md, LEARNER_TEMPLATE_SPEC.md, and ADMIN_PORTAL_SPEC.md.

Implement certificate eligibility, issuance, certificate code, participant certificate pages, admin certificate records, and duplicate prevention. Add PDF/download if feasible without delaying core logic.

Return evidence pack.
```

---

# 22. Slice 16 — Review and publish workflow

## Objective

Implement lightweight review/publish workflow.

## Required routes

```txt
/creator/courses/[courseId]/submit
/creator/courses/[courseId]/feedback
/admin/review
/admin/review/[courseId]
```

## Required workflow states

1. Draft
2. Ready for Review
3. Returned for Revision
4. Approved
5. Published
6. Unpublished / Archived

## Required functionality

1. readiness checks;
2. submit for review;
3. admin/reviewer review queue;
4. return for revision with reason;
5. approve;
6. publish by Admin only;
7. unpublish/archive;
8. audit logging.

## Acceptance criteria

1. Creator can submit complete course.
2. Incomplete course shows readiness errors.
3. Reviewer/Admin can return with reason.
4. Reviewer/Admin can approve.
5. Admin can publish.
6. Published course becomes visible to participants.
7. Course Creator without Admin cannot publish.
8. Status actions are logged.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 16: lightweight review and publish workflow according to PRODUCT_SPEC.md, ROUTE_MAP.md, ADMIN_PORTAL_SPEC.md, and ACCEPTANCE_TESTS.md.

Implement readiness checks, submit for review, review queue, return for revision, approve, Admin-only publish, unpublish/archive, and audit logging.

Keep the workflow lightweight. Do not add complex governance panels.

Return evidence pack.
```

---

# 23. Slice 17 — Participant dashboard and learning flow

## Objective

Complete participant learning journey.

## Required routes

```txt
/learn
/learn/my-courses
/learn/profile
```

## Required functionality

1. participant dashboard;
2. my courses;
3. enroll/start/continue;
4. progress tracking;
5. completed courses;
6. certificate status;
7. profile basics.

## Acceptance criteria

1. Participant can see enrolled/assigned courses.
2. Participant can start/continue a course.
3. Progress updates after lesson completion.
4. Completed courses appear.
5. Certificate status appears.
6. Participant cannot see other participants’ data.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 17: participant dashboard and learning flow according to LEARNER_TEMPLATE_SPEC.md and ACCEPTANCE_TESTS.md.

Build /learn, /learn/my-courses, and participant profile basics. Connect enrollment, progress, completion, and certificate status.

Do not expose admin/creator controls or other participants’ data.

Return evidence pack.
```

---

# 24. Slice 18 — Monitoring dashboard

## Objective

Implement Phase 1 operational monitoring.

## Required route

```txt
/admin/monitoring
```

## Required metrics

1. registered participants;
2. active participants;
3. organizations;
4. cohorts;
5. published courses;
6. enrollments;
7. completion rate;
8. final test pass rate;
9. certificates issued;
10. feedback rating.

## Required tables

1. course progress;
2. cohort progress;
3. organization participation;
4. final test performance;
5. certificate summary;
6. feedback summary.

## Acceptance criteria

1. Admin can access monitoring.
2. M&E Viewer can access if authorized.
3. Participant cannot access.
4. Filters work.
5. Data is aggregated by default.
6. No impact/capacity diagnosis dashboard is added.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 18: Phase 1 monitoring dashboard according to MONITORING_SPEC.md.

Build /admin/monitoring with KPI cards, filters, course progress, cohort progress, organization participation, final test performance, certificates, feedback summary, and attention signals.

Do not build full impact, diagnosis, practical proof, badge, CRM, or collaboration analytics.

Return evidence pack.
```

---

# 25. Slice 19 — Feedback flow

## Objective

Implement participant feedback and admin/monitoring visibility.

## Required route

```txt
/learn/courses/[courseSlug]/feedback
```

## Required functionality

1. participant submits course feedback;
2. feedback fields include rating, usefulness, clarity, accessibility/usability issue, comment;
3. feedback appears in monitoring summary;
4. feedback is visible to Admin where appropriate.

## Acceptance criteria

1. Participant can submit feedback.
2. Confirmation appears.
3. Feedback record is saved.
4. Monitoring feedback summary updates.
5. Open comments are not overexposed.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 19: participant course feedback flow according to LEARNER_TEMPLATE_SPEC.md and MONITORING_SPEC.md.

Build feedback form, save feedback records, confirmation state, and monitoring/admin feedback summary connection.

Protect open comments from overexposure.

Return evidence pack.
```

---

# 26. Slice 20 — Accessibility, mobile, and UI polish

## Objective

Improve UI quality, mobile responsiveness, and accessibility across core Phase 1 flows.

## Required focus areas

1. public site;
2. learner course player;
3. Build Studio;
4. admin dashboard;
5. forms;
6. quiz/final test;
7. certificate pages;
8. monitoring dashboard.

## Required checks

1. keyboard navigation;
2. visible focus states;
3. form labels;
4. color contrast;
5. alt text fields;
6. transcript fields;
7. mobile layout;
8. no horizontal overflow;
9. tappable controls;
10. clear error messages.

## Acceptance criteria

1. Core pages are usable on mobile.
2. Forms have labels and validation messages.
3. Interactive blocks are accessible enough for Phase 1.
4. Build Studio remains usable at narrower widths.
5. Learner course template is polished and high quality.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 20: accessibility, mobile, and UI polish across Phase 1 core flows according to ACCEPTANCE_TESTS.md and relevant specs.

Focus on public pages, learner course player, Build Studio, admin dashboard, forms, quiz, certificates, and monitoring.

Do not add new features. Fix usability, responsiveness, and accessibility issues.

Return evidence pack with checks run and remaining gaps.
```

---

# 27. Slice 21 — End-to-end demo and acceptance QA

## Objective

Run full demo scenario and acceptance tests.

## Required flow

1. Admin creates organization/cohort/user.
2. Course Creator creates course.
3. Course Creator builds course in Build Studio.
4. Course Creator previews and submits.
5. Admin reviews and publishes.
6. Participant completes course.
7. Participant passes final test.
8. Certificate issued.
9. Participant submits feedback.
10. Admin views monitoring.

## Acceptance criteria

1. Full flow works without manual database edits.
2. Role permissions are correct.
3. No broken routes.
4. Monitoring updates.
5. Certificate rules hold.
6. Build Studio remains clean.
7. Phase 2/3 modules are not accidentally active.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 21: end-to-end demo and acceptance QA.

Run the full demo scenario from ACCEPTANCE_TESTS.md:
Admin setup → Course Creator builds course → Admin reviews/publishes → Participant completes course/final test/certificate/feedback → Admin views monitoring.

Fix only defects required to pass Phase 1 acceptance. Do not add new scope.

Return evidence pack with test results, fixes, remaining gaps, and demo readiness status.
```

---

# 28. Slice 22 — Stabilization and handoff

## Objective

Finalize Phase 1 build for stakeholder review, pilot testing, and handoff.

## Required outputs

1. final route list;
2. final test/demo accounts;
3. final seed command;
4. known gaps;
5. pilot readiness checklist;
6. deployment notes;
7. environment variable notes;
8. manual QA checklist;
9. screenshots or screen references if possible;
10. final evidence pack.

## Acceptance criteria

1. App runs cleanly.
2. Demo flow works.
3. Known gaps are documented.
4. Pilot testing can begin.
5. No unresolved critical Phase 1 blocker remains.

## Suggested prompt to Codex

```txt
Plan first. Implement Slice 22: stabilization and handoff.

Prepare the Phase 1 build for stakeholder review and pilot testing. Verify app startup, routes, demo accounts, seed data, role permissions, course creation, publishing, participant learning, certificates, feedback, monitoring, accessibility basics, and mobile basics.

Do not add new features. Fix critical defects only.

Return final evidence pack with deployment/demo/pilot readiness notes.
```

---

# 29. Cross-slice acceptance gates

Codex must not proceed past the following gates without reporting status.

## Gate A — Before Build Studio slices

Required complete or clearly stubbed:

1. auth/roles;
2. course data model;
3. course creator routes;
4. module/lesson/content block models.

## Gate B — Before learner template slice

Required complete:

1. Build Studio content model;
2. core block types;
3. published course status;
4. course version content.

## Gate C — Before certificate slice

Required complete:

1. participant enrollment;
2. lesson progress;
3. final test attempts;
4. pass/fail logic.

## Gate D — Before monitoring slice

Required complete:

1. users;
2. organizations;
3. cohorts;
4. courses;
5. enrollments;
6. quiz attempts;
7. certificates;
8. feedback, if monitoring feedback is included.

## Gate E — Before demo readiness

Required complete:

1. admin management;
2. creator course creation;
3. Build Studio;
4. learner course player;
5. quiz/final test;
6. certificate;
7. review/publish;
8. monitoring.

---

# 30. Standard Codex prompt wrapper

Use this wrapper for each slice:

```txt
Plan first.

Implement [SLICE NAME] for the DEC / WHH CSF+ CSO Learning Hub Phase 1 build.

Read these controlling docs before making changes:
- docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/DATA_MODEL.md
- docs/specs/phase-1-cso-learning-hub/[RELEVANT_SPEC].md
- docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Scope:
[PASTE SLICE SCOPE]

Constraints:
- Do not add Phase 2/3 modules.
- Do not add CRM/donor management.
- Do not add heavy governance UI to Build Studio.
- Preserve role protection.
- Preserve 80% default certificate threshold unless config says otherwise.
- Keep changes minimal and focused.

Acceptance criteria:
[PASTE SLICE ACCEPTANCE CRITERIA]

Verification:
- Run relevant lint/type/test/build commands available in the repo.
- Manually verify listed routes where possible.
- Report any commands that fail and why.

Return the required evidence pack exactly using EVIDENCE_PACK_TEMPLATE.md.
```

---

# 31. Stop conditions

Codex must stop and report before proceeding if:

1. schema migration would destroy existing data;
2. existing route architecture conflicts with this plan;
3. authentication approach is unclear;
4. role guards cannot be implemented safely;
5. Build Studio content model would require a major redesign;
6. certificate logic conflicts with existing code;
7. implementation would require adding Phase 2/3 modules;
8. tests fail in a way that requires architectural decision;
9. there is ambiguity that could cause product drift.

Codex may still propose a safe minimal path but must not silently make high-impact decisions.

---

# 32. Final implementation statement

Codex shall implement Phase 1 as a controlled, slice-based build.

The goal is a working, polished e-learning MVP with:

1. strong Course Builder;
2. high-quality learner template;
3. Admin operations;
4. participant learning;
5. quizzes;
6. certificates;
7. monitoring;
8. future-ready architecture.

The goal is not to build a generic LMS, and not to overbuild the full future CSO Learning Hub in Phase 1.

The implementation must be deterministic, evidence-packed, and resistant to product drift.
