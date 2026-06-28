# CODEX_REVISED_IMPLEMENTATION_PLAN.md

# DEC / WHH CSF+ CSO Learning Hub - Revised Phase 1 Implementation Plan

## 1. Current Source Of Truth

This revised plan is the current continuous implementation guide for completing Phase 1.

Future Codex sessions must read:

1. `CODEX_IMPLEMENTATION_STATUS.md`
2. `CODEX_REVISED_IMPLEMENTATION_PLAN.md`
3. `CODEX_IMPLEMENTATION_PLAN.md`
4. the relevant product specification files for the target slice
5. `EVIDENCE_PACK_TEMPLATE.md`

If this revised plan conflicts with older R1-R23 slice language in `CODEX_IMPLEMENTATION_PLAN.md` or earlier sections of chat history, use this revised plan and the updated status file as the current source of truth.

This file starts from the 2026-06-10 audit baseline: Phase 1 is approximately 90-95% implementation-complete and needs final polish/acceptance evidence before demo sign-off.

## 2. Executive Summary

The repository now has broad functional Phase 1 coverage:

- Auth/session and role guards are working.
- Public catalogue/detail DB read paths and catalogue filters are working.
- Creator course setup, metadata, outcomes, resources, Build Studio, final test setup, preview, and review submission are implemented.
- Learner enrollment, lesson completion, final test scoring, certificate issuing, certificate views, feedback, and course rendering are implemented.
- Review/approve/return/admin-publish workflow is implemented.
- Admin dashboard, users, create user, organizations, cohorts, courses, certificates, reference data, monitoring, and audit log are database-backed to Phase 1 depth.
- Seed data now proves content blocks, certificates, reference data, onboarding invitations, and the main demo data paths.
- Focused verification scripts exist for R22A-R22H and R23A.

The remaining work is no longer the original R22 creator/admin implementation roadmap. The active roadmap is:

1. R23B: UI language, mobile, and responsive QA.
2. R23C: End-to-end demo acceptance and handoff evidence.
3. Optional follow-up fixes only for issues found during R23B/R23C.

## 3. Controlling Scope

Codex must keep Phase 1 focused on:

- learning hub public discovery;
- participant learning experience;
- course authoring;
- lightweight review/publish;
- admin operations;
- certificates;
- feedback;
- monitoring/M&E summaries.

Codex must not add:

- Phase 2/3 modules;
- CRM;
- donor management;
- grants pipeline;
- full diagnosis workflow;
- capacity map;
- action map;
- collaboration;
- co-creation;
- practical proof verification;
- badge verification;
- heavy governance panels;
- monitoring widgets inside Build Studio.

## 4. Build Studio Block Scope Decision

`BUILD_STUDIO_BLOCK_REFERENCE.md` is the controlling Phase 1 Build Studio block reference.

The selected Phase 1 lesson block set is exactly the 12-block set:

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

Important decision:
- Knowledge Check remains the low-stakes lesson-level assessment block.
- Scored Multiple Choice and True/False questions belong to Final Test / Quiz setup for Phase 1.
- Do not add scored Multiple Choice Question or True/False Question as separate lesson block types in the remaining Phase 1 roadmap unless explicitly approved as a scope change.
- Existing enum/model support for broader block types does not make those types active Phase 1 UI scope.

## 5. Current Implementation Baseline

### 5.1 Complete Or Largely Complete

- Route/layout foundation.
- Auth/session/role protection.
- Prisma Phase 1 schema.
- Public catalogue/detail published-course read path.
- Public catalogue search and filters.
- Creator My Courses database list.
- Creator Course Setup create/save/edit.
- Creator Metadata persistence and course alignment metadata.
- Creator Navigation cleanup away from hard-coded `demo-course` links.
- Creator Learning Outcomes save.
- Creator Resources add/archive.
- Build Studio authoring operations for selected block set.
- Seed data repair for representative ContentBlock rows and certificate records.
- DB-backed Creator Preview.
- Learner course access/enrollment/progress.
- Learner final test submission and scoring.
- Certificate auto-issuing logic after completion/pass rules.
- DB-backed learner and admin certificate views.
- Feedback submission and summary.
- Review/approve/return/admin-publish workflow.
- DB-backed Admin Dashboard.
- Admin user detail operations, role assignment, status update, and user context linking.
- `/admin/users/new` create-user and invitation/onboarding flow.
- Admin organization and cohort create/edit/link operations.
- Admin course operations and assignments.
- Reference Data management.
- Monitoring aggregation, filters, and visual polish.
- Audit log read path and several write paths.
- Admin users, admin courses, and admin audit log search/filter behavior.

### 5.2 Partial Or Incomplete

- Full UI language cleanup across all visible screens.
- Full mobile/responsive QA across the major demo route set.
- Final end-to-end demo acceptance run and evidence pack.
- Some filter option sources are still partially static even where filtering works.
- Organization/cohort list filtering remains lighter than users/courses/audit.
- Admin Settings remains static/read-only and should remain explicitly treated as a Phase 1 overview unless a future settings slice is approved.
- Production authentication and production storage are out of Phase 1 scope.

## 6. Completed Roadmap Items

### R22-Docs - Status And Plan Alignment

Status: COMPLETE, refreshed again by the 2026-06-10 audit.

Outcome:
- Status and plan docs now reflect the R22A-R22H/R23A implementation state.
- Stale claims about creator metadata, creator preview, admin dashboard, admin certificates, reference data, and `/admin/users/new` have been corrected.

### R22A - Creator Metadata Persistence

Status: COMPLETE

Evidence:
- `src/lib/creator-course-workflow.ts`
- `src/lib/creator-course-actions.ts`
- `src/components/creator/CreatorCourseMetadata.tsx`
- `scripts/verify-r22a.ts`

Verified behavior:
- Creator metadata loads from the database.
- Save persists capacity area links, course metadata fields, analysis metadata, and learner-template selection.
- Invalid submissions are rejected before persistence.
- Platform Admin can update creator metadata.
- Participant cannot read or update creator metadata.

### R22B - Creator Navigation Cleanup

Status: COMPLETE

Evidence:
- `src/lib/routes.ts`
- `src/app/(creator)/creator/[[...segments]]/page.tsx`
- `scripts/verify-r22b.ts`

Verified behavior:
- `/creator` redirects to `/creator/courses`.
- Global creator nav contains only generic My Courses.
- Course workflow links are generated from the selected course id.
- No hard-coded `demo-course` workflow links remain in creator nav.

### R22C - Seed Data Repair + DB-backed Creator Preview

Status: COMPLETE

Evidence:
- `scripts/seed-phase1-demo.ts`
- `src/lib/creator-preview-data.ts`
- `src/components/creator/CreatorPreview.tsx`
- `scripts/verify-r22c.ts`

Verified behavior:
- Seed includes representative Phase 1 lesson blocks across the selected 12-block set.
- Seed excludes scored MCQ/T/F lesson blocks.
- Seed includes a certificate-visible demo scenario.
- Creator Preview is DB-backed for the selected course.
- Platform Admin can load preview data.
- Participant cannot load creator preview data.
- Published learner course content includes seeded DB content blocks.

### R22D - DB-backed Certificates

Status: COMPLETE

Evidence:
- `src/lib/certificate-workflow.ts`
- `src/components/admin/AdminCertificates.tsx`
- `src/components/learner/LearnerCertificates.tsx`
- `scripts/verify-r22d.ts`

Verified behavior:
- Certificate records exist and duplicate prevention is respected.
- Learner certificate list/detail are DB-backed and scoped to the current participant.
- Admin certificate list/detail are DB-backed.
- Participants cannot read admin certificate records.
- Pass threshold remains 80%.

### R22E - DB-backed Admin Dashboard

Status: COMPLETE

Evidence:
- `src/lib/admin-dashboard-workflow.ts`
- `src/components/admin/AdminDashboard.tsx`
- `scripts/verify-r22e.ts`

Verified behavior:
- Dashboard KPI counts match database counts.
- Focus summary reads issued certificates and review queue counts.
- Recent activity reads audit logs.
- Recent certificates read certificate records when present.
- Attention courses link inside admin routes.
- M&E Viewer and Participant cannot read admin dashboard data.

### R22F - Admin Create User

Status: COMPLETE

Evidence:
- `src/app/(admin)/admin/[[...segments]]/page.tsx`
- `src/components/admin/AdminUsers.tsx`
- `src/lib/admin-people-actions.ts`
- `src/lib/admin-people-workflow.ts`
- `scripts/verify-r22f.ts`

Verified behavior:
- `/admin/users/new` renders a create-user and invitation workspace.
- Admin can create a user with role and organization/cohort context.
- Created user fields and role assignment persist.
- Creation and initial role assignment are audited.
- Created user appears in list and detail views.
- Duplicate email is handled safely.
- Created user can be updated through existing admin operations.
- Course Reviewer, M&E Viewer, and Participant cannot create users.

### R22G - Reference Data Management

Status: COMPLETE

Evidence:
- `src/lib/reference-data-workflow.ts`
- `src/lib/reference-data-actions.ts`
- `src/components/admin/AdminReferenceData.tsx`
- `scripts/verify-r22g.ts`

Verified behavior:
- Five Phase 1 reference categories are DB-backed.
- Seeded active values exist for capacity areas, course levels, organization types, regions, and languages.
- Admin can create, update, deactivate, and reactivate reference values.
- Duplicate category/key values are rejected.
- Inactive values are hidden from active options.
- Reference data changes are audited.
- Non-admin roles cannot read or mutate reference data.

### R22H - Monitoring Visual Polish

Status: COMPLETE

Evidence:
- `src/lib/monitoring-workflow.ts`
- `src/components/admin/AdminMonitoring.tsx`
- `scripts/verify-r22h.ts`

Verified behavior:
- Monitoring remains DB-backed.
- Course/cohort/organization summaries include progress and certificate counts.
- Assessment, certificate, feedback, and attention summaries are present.
- M&E Viewer remains read-only.
- Participant and Course Creator are blocked from platform-wide monitoring.

### R23A - Functional Filters/Search

Status: LARGELY COMPLETE

Evidence:
- `src/lib/course-data.ts`
- `src/components/public/CataloguePage.tsx`
- `src/lib/admin-people-workflow.ts`
- `src/lib/admin-course-workflow.ts`
- `src/lib/review-workflow.ts`
- `scripts/verify-r23a.ts`

Verified behavior:
- Public catalogue filters are query-backed.
- Admin user search and filters work.
- Admin course search and filters work.
- Admin audit log filters work.

Remaining filter limitations:
- Organization/cohort list filtering remains lighter.
- Some filter option lists are still static or semi-static rather than fully derived from active reference data.

## 7. Active Remaining Roadmap

### R23B - UI Language, Mobile, And Responsive QA

Status: NEXT RECOMMENDED IMPLEMENTATION SLICE

Objective:
Remove demo/developer language and verify mobile/responsive quality for stakeholder demo.

Routes/screens affected:
- Public landing, catalogue, course detail.
- Auth sign-in/register/staff onboarding.
- Learner dashboard, My Courses, course player, final test, certificates, profile.
- Creator My Courses, setup, metadata, outcomes, resources, Build Studio, final test setup, preview, submit/feedback.
- Admin dashboard, users, organizations, cohorts, courses, review, certificates, reference data, monitoring, audit log, settings.

Main functionality:
- Remove or replace visible words like demo, placeholder, mock, scaffold, slice, DB-backed, Prisma, CRUD, TODO, WIP, backend, frontend where they appear in user-facing UI.
- Check titles/subtitles and primary actions.
- Check empty states.
- Check mobile/narrow layout.
- Ensure text does not overlap or overflow.
- Keep Build Studio clean and content-focused.
- Keep monitoring out of Build Studio.

Likely files/areas:
- UI components across `src/components`.
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/register/staff/page.tsx`
- route-level placeholder fallbacks if any remain visible.

Data/schema impact:
- None.

Role/permission impact:
- None expected.

Acceptance criteria:
- No banned developer/demo language appears in user-facing UI except where intentionally internal or in seed/demo account instructions.
- Major routes work at mobile/narrow viewport.
- Primary actions are clear.
- Empty states are useful.
- No Phase 2/3 modules appear.
- No CRM/donor/governance-heavy workflow appears.

Verification steps:
- `rg` for banned terms in `src/app` and `src/components`.
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Browser/mobile visual QA where feasible.

Evidence pack expectations:
- Include terms checked.
- Include routes visually checked.
- Include screenshots when UI changed.
- Include residual warnings.

### R23C - End-to-End Demo Acceptance And Handoff

Status: FINAL REQUIRED SLICE AFTER R23B

Objective:
Run final Phase 1 acceptance flow and produce handoff-ready evidence.

Routes/screens affected:
- Full product flow.

Main functionality:
- Reset/seed database.
- Admin validates users, organizations, cohorts, courses, assignments, reference data, certificates, and dashboard.
- Creator creates/updates course setup, metadata, outcomes, resources, content blocks, final test.
- Creator previews and submits.
- Reviewer approves or returns.
- Admin publishes.
- Participant accesses course, completes lessons, takes final test, receives certificate, submits feedback.
- Admin/M&E checks monitoring.
- Audit logs show critical actions.

Data/schema impact:
- Seed/demo data may be refreshed only if acceptance reveals a demo blocker.

Role/permission impact:
- Verify all role boundaries.

Acceptance criteria:
- Full demo flow works without manual database edits.
- Route guards behave correctly.
- Published-only rules hold.
- Certificate threshold is 80%.
- Certificate is issued only after completion/pass.
- Feedback appears in monitoring/admin summary.
- Review and publish remain separate gates.
- No excluded modules are exposed.

Verification steps:
- `npm run db:seed`
- focused verify scripts for completed slices:
  - `npm run verify:r22a`
  - `npm run verify:r22b`
  - `npm run verify:r22c`
  - `npm run verify:r22d`
  - `npm run verify:r22e`
  - `npm run verify:r22f`
  - `npm run verify:r22g`
  - `npm run verify:r22h`
  - `npm run verify:r23a`
- existing learner/build/review/monitoring verify scripts as needed.
- `npm run prisma:validate`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- HTTP/browser smoke across roles.
- Acceptance checklist pass/fail notes.

Evidence pack expectations:
- Full route list.
- Commands/checks.
- Role matrix.
- Known residual gaps.
- Demo accounts.
- Screenshots for major UI paths.
- Final go/no-go recommendation.

## 8. Optional Follow-Up Slices

Only implement these if R23B/R23C exposes them as necessary or the user explicitly requests them:

1. R23D: Dynamic filter option sources from reference data/capacity models.
2. R23E: Organization/cohort list filtering parity with users/courses/audit.
3. R23F: Admin Settings decision, either remove/de-emphasize or implement minimal DB-backed configuration.
4. R23G: Learner dashboard state polish for enrolled, assigned, available, completed, and certificate states.
5. R23H: Production deployment readiness notes for auth, storage, database, and environment variables.

Do not start optional slices before R23B/R23C unless they are needed to unblock acceptance.

## 9. Suggested Sequencing Rules

Default order:

1. Complete R23B UI language/mobile QA.
2. Fix only demo-critical issues found during R23B.
3. Complete R23C end-to-end acceptance and handoff.
4. Address optional follow-ups only when explicitly approved.

Do not add new product modules while closing demo-critical gaps.

Do not reopen R22A-R22H as active work unless a verification script or acceptance flow finds a regression.

## 10. Standard Verification Expectations

Documentation-only slices:
- No build required unless application code changes.
- Review changed docs for contradiction and completeness.

Data/schema-touching slices:
- `npm run prisma:validate`
- focused verify script when practical.
- `npm run build` after Prisma or TypeScript changes.

Route/component slices:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- HTTP/browser smoke for affected roles.

Seed slices:
- `npm run db:seed`
- read-only DB count checks.
- verify idempotence where practical.

Protected route slices:
- Check allowed and blocked roles.

## 11. Evidence Requirements

Every implementation slice must return an evidence pack using `EVIDENCE_PACK_TEMPLATE.md`.

Evidence packs must include:

- slice identity;
- files changed;
- routes/screens affected;
- data/schema changes;
- role/permission changes;
- workflow/status changes;
- acceptance criteria checked;
- tests/checks run;
- known gaps;
- risks/decisions;
- scope-control confirmation;
- next smallest safe step.

For Build Studio-related work, also include:

- selected block types affected;
- confirmation that the 12-block Phase 1 scope was preserved;
- confirmation that Knowledge Check remains separate from final test;
- confirmation that scored MCQ/T/F remain in Final Test/Quiz setup;
- confirmation that no Phase 2/3 block types were added.

## 12. Current Next Recommendation

Next smallest safe implementation slice:

`R23B - UI Language, Mobile, And Responsive QA`

Reason:
The major data-backed workflows named in earlier R22 gaps are implemented. The remaining demo risk is now whether the user-facing experience is polished, responsive, and free of implementation/demo wording across the full Phase 1 route set.
