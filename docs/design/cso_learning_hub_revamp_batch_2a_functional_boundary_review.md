# Batch 2A Functional-Boundary Review and Corrective Patch Report

## 1. Repository & Environment State

- **Current Branch**: `feature/cso-hub-revamp-foundations`
- **HEAD Commit**: `8aad85129a1880594db9bb26d473646c76553ebc` (visual shell work and previous security auth-boundary patch)
- **Working Tree Status**: Clean of structural drifts, visual work successfully isolated and guarded.
- **Protected Files Changed**:
  - `src/app/(learn)/learn/[[...segments]]/page.tsx`
  - `src/app/(learn)/learn/layout.tsx`
  - `src/lib/course-data.ts`
  - `src/lib/external-course-workflow.ts`
- **Staging / Production Environment Safeguards**:
  - Confirmed `.env` contains no credentials from `D:\CSO_Learning_Hub_Secrets`.
  - Confirmed no remote staging/production Supabase connections or remote databases are configured.
  - Seeding safety checks prevent execution on any non-localhost databases.

---

## 2. Review of Functional Boundary Diffs

We conducted a review of the changes introduced during the visual player shell work:

### A. URL Query Parameter overrides (`mockProgress`)
- **Previous Behaviour**: Standard learner player routes resolved state exclusively from authenticated database entries.
- **New Behaviour**: An ad-hoc `mockProgress=100` URL query parameter query override was added to the `/learn/courses` route, artificially simulating 100% course progression and certificate issuance.
- **Risks**: Exposes progress simulation to real learner paths on pilot/production.
- **Corrective Action**: Fully reverted the URL parameter from the `/learn` page router and relocated the completed-course presentation fixture to a dedicated, strictly isolated developer sandbox page: `/local-qa/course-player/completed`.

### B. Course Data Fallback Catch-All
- **Previous Behaviour**: `getLearnerCourseBySlug` returned `null` or threw exceptions when database lookup failed.
- **New Behaviour**: Catch blocks swallowed database lookup errors and returned hardcoded synthetic demo course details for all demo course slugs on the standard course page.
- **Risks**: Swallowing database exceptions hides transient outages and causes normal routes to render mock demo courses on production.
- **Corrective Action**: Restructured fallbacks to require explicit, multi-layered sandbox safety checks (`isLocalQaFixtureAllowed()`). If the safety guard evaluates to false, database query errors are rethrown (fail-closed) to trigger error bounds.

### C. External Course Launch Fallback Catch-All
- **Previous Behaviour**: `getExternalCourseLaunchData` returned `null` or threw errors when database lookup failed.
- **New Behaviour**: Database query exceptions were caught, and a synthetic launch metadata token and iframe source were returned.
- **Risks**: Production/pilot environments could fabricate launch/bridge tokens if database query failures occurred on external course routes.
- **Corrective Action**: Restricted fallbacks to require `isLocalQaFixtureAllowed()`. Rethrow database exceptions outside local-test mode. All iframe attributes, sandbox parameters, allow attributes, resizing scripts, and bridge events remain completely unmodified.

---

## 3. Local Fixture Architecture & Guards

We introduced [local-qa-guard.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/local-qa-guard.ts) implementing a comprehensive security check:
```typescript
export async function isLocalQaFixtureAllowed(): Promise<boolean>
```

This guard verifies **all** of the following requirements:
1. `APP_ENVIRONMENT === "local-test"`
2. `ALLOW_LOCAL_DEMO_AUTH === "true"`
3. `ALLOW_LOCAL_COURSE_FIXTURES === "true"`
4. `NODE_ENV !== "production"`
5. Request host header is exactly `localhost` or `127.0.0.1`.
6. Database URL, Supabase URL, and Supabase Anon Key do not contain staging (`fgyxbzwdvngqlksyxuwa`) or production (`bhzyrthinbyqgsetnoph`) project identifiers.
7. Database URL targets localhost, file-based, or `dev.db`.

If any check fails, the guard returns `false`, causing the application to fail-closed and preventing any fallback/mock data leaks on non-local deployments.

---

## 4. Retained Presentation Visual Work

The visual and layout changes are preserved in their entirety:
- [CoursePlayerShell.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/shell/CoursePlayerShell.tsx): Presentation shell layout.
- [CourseOutlineDrawer.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/CourseOutlineDrawer.tsx): Sliding contents drawer for mobile views.
- [LearnerCoursePlayer.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerCoursePlayer.tsx): Responsive side-by-side desktop/mobile visual workspace.
- Visible high-contrast tab focus indicators.
- Accessibility link ("Skip to lesson content").
- Locked lesson items styling.

---

## 5. Explicit Service unavailable States

We added a general error-capturing try-catch wrapper in `page.tsx` to handle database offline scenarios gracefully:
- If a database query fails inside the Course Player route, the application renders a friendly "Course Temporarily Unavailable" panel inside the `CoursePlayerShell` providing exit navigation ("Return to My Learning") and support links.
- No database credentials, Prisma, Supabase, or internal technical stack trace details are exposed to the user.

---

## 6. Verification and Test Results

We updated the verification script [verify-course-player-shell.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/scripts/verify-course-player-shell.ts) to assert:
- `mockProgress` parameter does not exist on `/learn` page router.
- `isLocalQaFixtureAllowed()` correctly rejects non-local environments.
- Offline database connections bubble up and fail-closed outside of local test.

All verification scripts passed completely:
```powershell
=== Verification: Seed Safety Guard ===
ALL SEED SAFETY GUARD VERIFICATIONS PASSED.

S5 Supabase sign-in verification passed.
S6 route and role-boundary verification passed.

=== Verification: Batch 1F Functional Boundaries ===
ALL BATCH 1F FUNCTIONAL BOUNDARY VERIFICATIONS PASSED.

=== Verification: QA and Auth Security Boundary Checks ===
ALL QA AND AUTH SECURITY BOUNDARY VERIFICATIONS PASSED.

=== Verification: Course Player Shell and Navigation Gating ===
Checking page route handlers and certificate isolation...
PASS: Course Player routes do not fetch dashboard certificate data.
PASS: Assessment gating and lesson eligibility logic are unchanged.
PASS: Normal learner routes have no progress simulation parameters.
Checking LearnerCoursePlayer layout and outline accessibility...
PASS: Locked items are rendered as non-interactive accessible items.
PASS: Duplicate headers successfully removed from Course Player body.
Checking navigation controls handlers...
PASS: Lesson completion form submits to existing Server Action handler.
Checking external course frame attributes...
PASS: External course iframe source and sandboxing are untouched.
Verifying isolated QA completed course page rules...
PASS: Isolated QA Completed Page calls local QA safety guards.
Verifying local QA safety guard rules...
PASS: Local QA safety guard enforces environment, project IDs, and request headers.
Verifying fail-closed database query exceptions workflow...
PASS: Database query failures throw and bubble up outside local QA mode.
ALL COURSE PLAYER SHELL REGRESSION VERIFICATIONS PASSED.
```

---

## 7. Evidence Review and Disposition

- All 13 visual layout screenshots remain present under `docs/design/evidence/batch-2a/`.
- No screenshots contain real learner info, actual Supabase IDs, database keys, or active credentials.
- Classification of screenshot data:
  - Guarded Local Fixtures: `course_completed.png`, `locked_module.png`, `completed_lesson.png`.
  - Visual-only: `internal_lesson_desktop.png`, `internal_lesson_390px.png`, `desktop_course_contents.png`, `mobile_course_contents_open.png`, `keyboard_focus.png`, `loading.png`, `service_unavailable.png`.

---

## 8. Safety & Approval Recommendation

- **Staging Credential Rotation Status**: Active, externally maintained. No shared database secrets are stored locally.
- **Shared Environments**: No shared pilot or staging databases were accessed during development.
- **Approval**: With the removal of URL query parameter overrides and strict encapsulation of UAT visual fixtures behind environment/localhost safety guards, **Batch 2A is safe to approve and merge**.
