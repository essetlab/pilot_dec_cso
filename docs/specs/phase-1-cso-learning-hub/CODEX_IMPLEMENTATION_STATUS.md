# CODEX_IMPLEMENTATION_STATUS.md

# DEC / WHH CSF+ CSO Learning Hub - Phase 1 Implementation Status

## 1. Current Source Of Truth

This file is the current implementation checkpoint for the Phase 1 CSO Learning Hub repository.

Future Codex sessions must read this file together with:

1. `CODEX_REVISED_IMPLEMENTATION_PLAN.md`
2. `CODEX_IMPLEMENTATION_PLAN.md`
3. the relevant product specification files for the target slice
4. `EVIDENCE_PACK_TEMPLATE.md`

If this file conflicts with older implementation notes or older slice descriptions, treat this file as the current status baseline and use `CODEX_REVISED_IMPLEMENTATION_PLAN.md` for the current remaining roadmap.

Current baseline comes from source review and local database inspection on 2026-06-10. Phase 1 is now approximately 90-95% implementation-complete. It is functionally broad and close to demo-complete, but still needs UI language/mobile QA and final end-to-end acceptance evidence before it should be treated as stakeholder-demo ready.

## 2. Overall Status

Status: LATE-STAGE PARTIAL, final demo readiness not yet signed off.

What is working:
- Auth/session and route role guards are working.
- Public catalogue/detail database read paths are working for published public courses.
- Public catalogue search and filters are query-backed.
- Creator My Courses, course setup, learning outcomes, resources, metadata, Build Studio, final test setup, preview, and submit/review workflows are database-backed.
- Creator metadata/capacity linkage persists primary and secondary capacity areas, CSO practice/indicator metadata, target profile, gap, practice improvement, prerequisites, follow-up support, accessibility/safeguarding notes, and learner-template selection.
- Creator navigation is course-aware; the global creator nav no longer exposes hard-coded `demo-course` workflow links.
- Build Studio module, lesson, selected lesson, ContentBlock add/configure/save/reorder/duplicate/delete workflows are implemented for the selected Phase 1 block set.
- Creator Preview renders the selected saved course using persisted modules, lessons, content blocks, resources, outcomes, final test summary, and learner template.
- Learner course access, enrollment initialization, lesson navigation, progress tracking, final test submission/scoring/retake handling, certificate issuing, feedback, and learner certificate list/detail are database-backed.
- Review, approve, return for revision, publish, unpublish, and archive workflow is implemented with role separation.
- Admin dashboard, users, `/admin/users/new`, organizations, cohorts, courses, certificates, reference data, monitoring, and audit log are database-backed.
- Admin create-user flow creates accounts, assigns an initial role, links organization/cohort context, handles duplicate email, sends or records onboarding invitations for invited users, and writes audit events.
- Monitoring aggregation and filters are database-backed and include visual KPI, progress, assessment, certificate, feedback, and attention summaries.
- Seed data now proves content blocks, certificates, reference data, onboarding invitations, and broader admin/learner/creator flows.
- Focused verification scripts exist for R22A-R22H and R23A.

What is still not demo-complete:
- Full R23B UI language, mobile, and responsive QA has not been completed across all major screens.
- Full R23C end-to-end acceptance and handoff evidence has not been completed in one clean pass.
- Some remaining copy may still be too implementation-oriented for a stakeholder demo.
- Some admin/creator/public filter option sources are still partially static even where filtering is functional.
- Admin settings remains a read-only/static Phase 1 overview rather than a configurable settings module.
- Browser/mobile screenshot evidence has not been collected for the final demo route set in this audit.

## 3. Completed Or Largely Completed Functional Areas

### 3.1 Foundations

Status: COMPLETE

Evidence:
- Route groups and app shells exist for public, auth, learner, creator, and admin areas.
- Middleware protects `/learn`, `/creator`, and `/admin`.
- Role helpers separate learner, creator, admin, review, and monitoring access.
- Prisma schema contains Phase 1 models for users, roles, organizations, cohorts, courses, course versions, modules, lessons, content blocks, resources, quizzes, quiz attempts, enrollments, progress, certificates, feedback, audit logs, reference data, and onboarding invitations.

Remaining polish:
- Production authentication is out of Phase 1 scope.
- Sign-in/demo-account language may still need stakeholder-demo cleanup.

### 3.2 Public Course Discovery

Status: LARGELY COMPLETE

Evidence:
- Public catalogue and detail read published public courses from the database with safe fallback.
- Draft/unpublished database courses do not render as public course detail pages.
- `/courses` accepts search/filter query params and `getPublicCourseSummaries` applies search, capacity area, access, certificate, and level filters.

Remaining gaps:
- Catalogue filter options still use a static capacity-area list instead of fully deriving from active database/reference data.
- Final visual/mobile QA is still required.

### 3.3 Creator Course Setup, Metadata, Outcomes, Resources, And Navigation

Status: COMPLETE for Phase 1 functional scope

Working:
- Creator My Courses reads creator-owned or assigned courses.
- Creator can create, save, reopen, and edit course setup records.
- Creator can save learning outcomes.
- Creator can add and archive resources.
- Creator Metadata / Capacity Linkage is database-backed and saves course fields, capacity-area links, analysis metadata, and learner-template selection.
- Metadata save/reload and participant denial are covered by `scripts/verify-r22a.ts`.
- Global creator nav is generic, and workflow navigation is generated from the selected course id instead of hard-coded `demo-course` links.
- Navigation cleanup is covered by `scripts/verify-r22b.ts`.

Remaining gaps:
- Final stakeholder-demo copy review and mobile QA are still required.

### 3.4 Build Studio

Status: FUNCTIONALLY COMPLETE for the selected Phase 1 block set

Working:
- Required three-column structure exists.
- Creator can add modules and lessons.
- Creator can select lessons.
- Creator can browse block library cards.
- Creator can add selected block types to the selected lesson.
- Blocks appear in the center canvas.
- Right configuration panel changes by block type.
- Block config can be entered and saved.
- Saved blocks remain visible.
- Blocks can be selected, edited, duplicated, moved, and deleted.
- Learner renderer support exists for the implemented block configs.
- Seed data now includes representative persisted ContentBlock rows for the selected 12-block Phase 1 set.

Evidence:
- `scripts/verify-build-studio-blocks.ts`
- `scripts/verify-build-studio-block-editing.ts`
- `scripts/verify-r22c.ts`

### 3.5 Phase 1 Build Studio Block Scope Decision

The selected Phase 1 lesson block set is the 12-block set from `BUILD_STUDIO_BLOCK_REFERENCE.md`.

Selected Phase 1 lesson blocks:
1. Text / Reading
2. Video
3. Resource / Download
4. Image / Visual
5. Case Study
6. Key Message / Summary
7. Accordion
8. Flashcards
9. Knowledge Check
10. Branching Scenario
11. Reflection
12. Practical Activity

Scope clarification:
- Knowledge Check is the low-stakes lesson-level assessment block.
- Scored Multiple Choice and True/False questions belong to Final Test / Quiz setup for Phase 1.
- Scored Multiple Choice and True/False questions should not be added as separate lesson block types in the current Phase 1 roadmap unless an explicit scope change is approved.
- External Link / Button CTA, Audio, Short Answer, and other broader model-supported types remain deferred unless explicitly brought back into Phase 1.

### 3.6 Creator Preview

Status: COMPLETE

Working:
- `/creator/courses/[courseId]/preview` loads selected course data from the database.
- Preview includes saved course overview, capacity area, level, duration, language, outcomes, resources, modules, lessons, blocks, learner template, and final test summary.
- Preview denies participant access.
- Preview shares the learner template renderer in preview mode so creator review aligns with participant rendering.

Evidence:
- `src/lib/creator-preview-data.ts`
- `src/components/creator/CreatorPreview.tsx`
- `scripts/verify-r22c.ts`
- `scripts/verify-learner-template-rendering.ts`

### 3.7 Learner Flow

Status: LARGELY COMPLETE

Working:
- Learner dashboard and My Courses use course summary helpers.
- Learner course player reads published course content and initializes enrollment when eligible.
- Lesson completion writes progress and enrollment percentages.
- Final test is gated by lesson completion.
- Final test submission persists attempts and scores against configured answers.
- Pass/fail uses the configured threshold, with default 80%.
- Certificate issuing logic runs only after completion and final test pass conditions are met.
- Learner certificate list/detail reads actual certificate records and includes locked state for eligible-but-not-earned certificates.
- Feedback submission works and connects to monitoring summary.

Remaining gaps:
- Learner dashboard/My Courses can still be polished to more clearly separate enrolled, assigned, available, completed, and certificate states.
- Full mobile QA remains.

### 3.8 Certificates

Status: COMPLETE for Phase 1 functional scope

Working:
- Certificate auto-issuing logic exists after lesson completion and final test pass conditions are met.
- Learner certificates list/detail read scoped certificate records.
- Admin certificates list/detail read issued certificate records.
- Admin certificate metrics read issued, eligible, pending completion, and pass-threshold values.
- Certificate records are scoped so participants cannot read other learners' certificates or admin certificate records.
- Seed includes issued certificate demo scenarios.

Evidence:
- `src/lib/certificate-workflow.ts`
- `src/components/admin/AdminCertificates.tsx`
- `src/components/learner/LearnerCertificates.tsx`
- `scripts/verify-r22d.ts`

### 3.9 Review And Publish

Status: COMPLETE

Working:
- Course Creator can submit draft or returned courses for review.
- Reviewer/Admin can approve or return for revision.
- Only Platform Admin and Super Admin can publish, unpublish, and archive.
- Review and publish remain separate gates.
- Course Reviewer cannot publish unless also assigned an admin role.
- Status transitions write audit logs.

Remaining gaps:
- Final end-to-end acceptance should revalidate readiness checks across the full demo flow.

### 3.10 Admin Operations

Status: LARGELY COMPLETE

Working:
- Admin dashboard reads real database counts for users, participants, organizations, cohorts, courses, published courses, active enrollments, completions, issued certificates, and courses awaiting review.
- Admin dashboard reads recent audit activity, attention courses, and recent certificates.
- Admin users list/detail reads database users.
- Admin users list supports query, role, status, organization, and cohort filters.
- `/admin/users/new` is implemented with create-user, initial role assignment, organization/cohort context, duplicate-email handling, invited-user onboarding support, and audit logging.
- Admin can update user status.
- Admin can assign and remove roles, with guardrails.
- Admin can link users to organization/cohort context.
- Admin organizations list/detail/new/edit are database-backed.
- Admin cohorts list/detail/new/edit are database-backed.
- Admin can link/unlink organizations to cohorts.
- Admin courses list/detail are database-backed.
- Admin courses list supports query and filters.
- Admin can assign courses to user, organization, or cohort targets.
- Admin can deactivate course assignments.
- Admin can publish/unpublish/archive where authorized.
- Admin reference data screen is database-backed for Phase 1 controlled values and supports create/update/deactivate/reactivate with audit logs.
- Admin audit log reads database events and supports query/filtering.

Remaining gaps:
- Admin settings remains static/read-only and should stay explicitly treated as a Phase 1 overview unless a settings slice is approved.
- Organization/cohort list filters are not as complete as users/courses/audit.
- Final UI language/mobile QA remains.

Evidence:
- `src/lib/admin-dashboard-workflow.ts`
- `src/lib/admin-people-workflow.ts`
- `src/lib/admin-course-workflow.ts`
- `src/lib/reference-data-workflow.ts`
- `scripts/verify-r22e.ts`
- `scripts/verify-r22f.ts`
- `scripts/verify-r22g.ts`
- `scripts/verify-r23a.ts`

### 3.11 Monitoring And M&E

Status: COMPLETE for Phase 1 functional scope

Working:
- Monitoring dashboard reads real users, organizations, cohorts, courses, enrollments, quiz attempts, certificates, and feedback.
- Monitoring filters exist for course, cohort, organization, and date range.
- Platform Admin and Super Admin can access.
- M&E / Programme Viewer can access read-only monitoring.
- Participant and Course Creator cannot access platform-wide monitoring.
- Dashboard is decision-oriented with KPI metrics, progress bars, attention signals, cohort/organization tables, assessment performance, certificate summaries, and feedback summaries.

Remaining gaps:
- Creator-level monitoring, organization-restricted monitoring, and cohort-restricted monitoring detail pages are deferred unless explicitly approved.
- Final visual/mobile QA remains.

Evidence:
- `src/lib/monitoring-workflow.ts`
- `src/components/admin/AdminMonitoring.tsx`
- `scripts/verify-r21a.ts`
- `scripts/verify-r21b.ts`
- `scripts/verify-r22h.ts`

## 4. Corrected Mismatches From Previous Status

The previous status file was stale in these areas:

1. It said Creator Metadata persistence was a demo-critical gap. This is now implemented and verified by `scripts/verify-r22a.ts`.
2. It said creator navigation still contained hard-coded `demo-course` workflow links. Global creator navigation is now generic and workflow links are generated by selected course id, verified by `scripts/verify-r22b.ts`.
3. It said Creator Preview was static/demo-derived. Preview now reads persisted selected-course data through `getCreatorPreviewData`, verified by `scripts/verify-r22c.ts`.
4. It said seed data had `contentBlocks: 0` and `certificates: 0`. The current local snapshot has `contentBlocks: 49` and `certificates: 4`.
5. It said Admin Certificates was static/demo-derived. Admin certificate list/detail now read certificate records, verified by `scripts/verify-r22d.ts`.
6. It said Admin Dashboard was static/demo-derived. Dashboard metrics/activity/attention/certificates are database-backed, verified by `scripts/verify-r22e.ts`.
7. It said `/admin/users/new` was linked but not implemented. The route now renders `AdminUserCreate` and uses `createAdminUserAction`, verified by `scripts/verify-r22f.ts`.
8. It said Reference Data was static/demo-derived and empty. Reference Data is now DB-backed and the current snapshot has `referenceDataItems: 240`, verified by `scripts/verify-r22g.ts`.
9. It said functional filters/search were a broad demo-critical gap. Public catalogue, admin users, admin courses, and admin audit log filtering/search are now implemented; admin users/courses/audit are verified by `scripts/verify-r23a.ts`.

## 5. Critical Remaining Gaps

Demo-critical remaining gaps:
1. R23B UI language cleanup across public, auth, learner, creator, admin, and monitoring screens.
2. R23B mobile/responsive QA across the major demo routes.
3. R23C full end-to-end acceptance pass from seed through admin setup, creator build/review, publish, participant completion/certificate/feedback, monitoring, and audit evidence.
4. Browser/screenshot evidence for changed or demo-critical UI screens.
5. Final evidence pack using `EVIDENCE_PACK_TEMPLATE.md`.

Non-blocking or deferrable gaps:
- Production authentication.
- Registration/access request persistence beyond current staff invitation/onboarding support.
- File storage beyond current local/API upload handling.
- Creator-scoped monitoring.
- Organization/cohort-restricted monitoring detail pages.
- Export features.
- Fully dynamic reference-data-driven filter option sources everywhere.
- Configurable admin settings.

## 6. Current Local Data Snapshot From Latest Audit

The latest read-only database inspection found:

- users: 19
- organizations: 2
- cohorts: 1
- courses: 10
- published courses: 6
- course versions: 9
- modules: 15
- lessons: 36
- content blocks: 49
- quizzes: 9
- quiz questions: 22
- enrollments: 10
- certificates: 4
- feedback records: 2
- audit logs: 37
- reference data items: 240
- onboarding invitations: 9

Interpretation:
- The code and current local data now prove the major R22A-R22H implementation slices.
- The remaining risk is primarily final demo polish and end-to-end acceptance evidence, not missing core data plumbing for the named creator/admin/certificate/user-create areas.
