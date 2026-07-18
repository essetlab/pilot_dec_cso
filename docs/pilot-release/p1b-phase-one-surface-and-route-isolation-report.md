# P1B Phase One Surface And Route Isolation Report

Date: 2026-07-19

Branch: `feature/hub-phase1-foundation-polish`

Baseline before P1B: `fa7bac47848a4b6c6ed7b974347c957788a968f0`

## Outcome

P1B defines a focused Phase One public, learner, and basic-admin surface without deleting preserved platform code. Existing role guards continue to protect creator, reviewer, publisher, monitoring, and admin routes. A centralized route visibility mechanism now controls the learner allowlist and the basic-admin navigation surface. Unfinished learner settings/community content is hidden and returns Not Found on direct access. Authorized internal roles retain direct access to preserved internal routes.

No production deployment was performed.

## Route And Feature Matrix

### Phase One Public

| Route or feature | Classification | P1B behavior |
|---|---|---|
| `/` | Phase One public | Retained as the landing page. |
| `/courses` | Phase One public | Retained as the course catalogue. |
| `/courses/[courseSlug]` | Phase One public | Retained as the public course overview. |
| `/register` | Phase One public | Retained. |
| `/sign-in` | Phase One public | Retained; authentication behavior was not changed. |
| `/verify-certificate` | Phase One public | Retained. |
| `/support` | Phase One public and learner support | Retained and added to learner navigation. |
| `/terms` | Phase One public | Retained. |
| `/privacy` | Phase One public | Retained. |
| `/accessibility` | Phase One public | Retained as public accessibility and low-bandwidth guidance. |
| `/sign-out` | Phase One public/auth utility | Retained and linked from authenticated shells. |
| `/unauthorized` | Phase One routing utility | Retained as the consistent role-denial response. |
| `/forgot-password` | Unclear—requires later decision | No route exists. P1B did not add authentication functionality. |
| `/contact` | Unclear—requires later decision | No dedicated route exists. Current contact guidance is provided through `/support`. |

Public header and footer links remain limited to Home, Courses, Verify Certificate, Sign In, Register, Support, Privacy, Terms, and Accessibility. No creator, reviewer, admin, monitoring, Build Studio, RDF, community, or experimental route is linked from the public shell, landing page, catalogue, or public course overview.

### Phase One Learner

| Route or feature | Classification | P1B behavior |
|---|---|---|
| `/learn` | Phase One learner | Retained as the dashboard. |
| `/learn/my-courses` | Phase One learner | Retained. |
| `/learn/courses/[courseSlug]` | Phase One learner | Retained as the course player/resume route. |
| `/learn/courses/[courseSlug]/external` | Phase One learner | Retained as the existing HRBA/external course launch route; integration behavior was not changed. |
| `/learn/courses/[courseSlug]/final-test` | Phase One learner | Retained as final-assessment entry. |
| `/learn/courses/[courseSlug]/feedback` | Phase One learner | Retained. |
| `/learn/certificates` | Phase One learner | Retained. |
| `/learn/certificates/[certificateId]` | Phase One learner | Retained. |
| `/learn/certificates/[certificateCode]/download` | Phase One learner | Retained; certificate behavior was not changed. |
| `/learn/profile` | Phase One learner | Retained. |
| `/support` | Phase One learner | Added to learner navigation. |
| `/sign-out` | Phase One learner | Retained. |
| `/learn/settings` | Preserve but hide | Removed from learner navigation and profile shortcuts. Centralized learner-route enforcement returns Not Found on direct access. Source component and route definition remain intact. |
| Learner directory, community, forum, portfolio visibility | Preserve but hide | No active standalone route was found. Future-facing content remains preserved inside the hidden settings component and landing-page explanatory copy; no community function was activated. |

### Phase One Basic Admin

| Route or feature | Classification | P1B behavior |
|---|---|---|
| `/admin` | Phase One basic admin | Retained. Dashboard shortcuts now point only to the basic surface. |
| `/admin/users` | Phase One basic admin | Retained for learner/user records. |
| `/admin/users/new` | Phase One basic admin | Retained. |
| `/admin/users/[userId]` | Phase One basic admin | Retained. |
| `/admin/organizations` | Phase One basic admin | Retained. |
| `/admin/organizations/new` | Phase One basic admin | Retained. |
| `/admin/organizations/[organizationId]` | Phase One basic admin | Retained; cohort shortcut removed from the visible basic surface. |
| `/admin/courses` | Phase One basic admin | Retained for course oversight. Reviewer/cohort shortcuts removed. |
| `/admin/courses/[courseId]` | Phase One basic admin | Retained for course assignments and overview. Creator, reviewer, publisher, archive, and Build Studio shortcuts/actions removed from this basic-admin surface. Their underlying workspaces and actions remain preserved elsewhere. |
| `/admin/certificates` | Phase One basic admin | Retained. |
| `/admin/certificates/[certificateId]` | Phase One basic admin | Retained; advanced-monitoring shortcut removed. |
| Basic progress/completion summary | Phase One basic admin | Existing dashboard metrics remain visible. P1B did not build a new detailed progress module. |
| Feedback and issues | Phase One basic admin, incomplete | Existing stored feedback remains preserved. No new basic-admin feedback/issues screen was built. Detailed monitoring remains hidden pending a later decision. |

### Preserve But Hide

| Route or feature | Classification | P1B behavior |
|---|---|---|
| `/creator` and `/creator/courses` | Preserve but hide | Not linked from public, learner, or basic-admin navigation. Existing creator-role guard and authorized direct access remain. |
| `/creator/courses/new` | Preserve but hide | Source and authorized internal access preserved. |
| `/creator/courses/[courseId]/setup` | Preserve but hide | Source and authorized internal access preserved. |
| `/creator/courses/[courseId]/metadata` | Preserve but hide | Source and authorized internal access preserved. |
| `/creator/courses/[courseId]/outcomes` | Preserve but hide | Source and authorized internal access preserved. |
| `/creator/courses/[courseId]/build` | Preserve but hide | Build Studio source and authorized internal access preserved. |
| `/creator/courses/[courseId]/resources` | Preserve but hide | Source and authorized internal access preserved. |
| `/creator/courses/[courseId]/quiz` | Preserve but hide | Source and authorized internal access preserved. |
| `/creator/courses/[courseId]/preview` | Preserve but hide | Source and authorized internal access preserved. |
| `/creator/courses/[courseId]/submit` and `/feedback` | Preserve but hide | Reviewer handoff and feedback source preserved. |
| `/admin/cohorts`, `/new`, and `/[cohortId]` | Preserve but hide | Removed from basic-admin navigation and shortcuts. Authorized admins retain direct access. |
| `/admin/review` and `/admin/review/[courseId]` | Preserve but hide | Reviewer/publisher workspace removed from basic-admin navigation and shortcuts. Existing role guard and authorized direct access remain. |
| `/admin/reference-data` | Preserve but hide | Removed from basic-admin navigation. Authorized admin direct access remains. |
| `/admin/monitoring` | Preserve but hide | Advanced monitoring removed from basic-admin navigation and shortcuts. Authorized monitoring/admin direct access remains. |
| `/admin/pilot-monitoring` | Preserve but hide | Removed from basic-admin navigation and shortcuts. Authorized monitoring/admin direct access remains. |
| `/admin/audit-log` | Preserve but hide | Removed from basic-admin navigation. Authorized admin direct access remains. |
| `/admin/settings` | Preserve but hide | Removed from basic-admin navigation. Authorized admin direct access remains. |
| `/admin/certificates/settings` | Preserve but hide | Route definition/placeholder remains; no basic-admin link is exposed. |
| `/register/staff?token=...` | Preserve but hide | Invitation-only staff onboarding route remains unlinked from public/learner navigation. |
| RDF, diagnosis, capacity-map, and action-map tools | Preserve but hide | No active application route was found. Related architecture/specification references were not deleted or activated. |
| Experimental content generation | Preserve but hide | No active public or learner route was found. Existing creator/content code was not deleted. |
| Advanced analytics | Preserve but hide | Represented by monitoring and pilot-monitoring routes; hidden as described above. |
| Demo-only pages | Preserve but hide | No standalone demo-only application route was found. Local quick access remains conditional on Supabase not being configured; production authentication behavior was not changed. |

### Application APIs And Route Handlers

| Route | Classification | P1B behavior |
|---|---|---|
| `POST /api/sign-in` | Phase One public/auth | Retained unchanged. |
| `POST /api/external-course-progress` | Phase One learner/HRBA | Retained unchanged. Existing session, token, origin, and payload validation remain. |
| `GET /sign-out` | Phase One auth | Retained unchanged. |
| `GET /learn/certificates/[certificateCode]/download` | Phase One learner | Retained unchanged. |
| `POST /api/upload-course-thumbnail` | Preserve but hide | Creator/internal upload endpoint remains protected by existing creator/course checks. |
| `POST /api/upload-image` | Preserve but hide | Creator/internal upload endpoint remains protected by existing creator/course checks. |
| `POST /api/upload-resource` | Preserve but hide | Creator/internal upload endpoint remains protected by existing creator/course checks. |
| `POST /api/upload-video` | Preserve but hide | Creator/internal upload endpoint remains protected by existing creator/course checks. |

## Visibility Mechanism

P1B extends the smallest stable existing pattern: centralized route and navigation configuration in `src/lib/routes.ts`, consumed through `src/lib/auth/navigation.ts` and the existing route-role guards.

- `isPhaseOneLearnerRoute()` defines the learner allowlist using the repository's existing route-pattern model.
- `isPhaseOneAdminSurfaceRoute()` defines the basic-admin surface prefixes.
- Learner navigation is derived from the allowlist and includes Support.
- Admin navigation is derived from the basic-admin surface.
- The learner catch-all route uses the centralized allowlist to return Not Found for hidden learner routes.
- Existing `canAccessPath()` role guards continue to redirect ordinary learners away from creator, reviewer, monitoring, and admin routes.
- Advanced internal/admin routes are visibility-hidden, not globally disabled, so authorized internal roles retain direct access.
- Admin dashboard dynamic links are displayed only when their destination belongs to the centralized basic-admin surface.

No scattered feature flag or environment variable was introduced. No pre-existing Phase One surface feature flag was found during the audit.

## Files Changed

- `src/lib/routes.ts`
- `src/lib/auth/navigation.ts`
- `src/app/(learn)/learn/[[...segments]]/page.tsx`
- `src/components/learner/LearnerProfile.tsx`
- `src/components/shell/AdminShell.tsx`
- `src/components/admin/AdminDashboard.tsx`
- `src/components/admin/AdminCourses.tsx`
- `src/components/admin/AdminCourseDetail.tsx`
- `src/components/admin/AdminCertificates.tsx`
- `src/components/admin/AdminOrganizations.tsx`
- `docs/pilot-release/p1b-phase-one-surface-and-route-isolation-report.md`

## QA Results

### Automated

| Check | Result | Notes |
|---|---|---|
| Centralized route-visibility assertions | PASS | Retained learner/basic-admin patterns and hidden routes resolved as expected. |
| `npm run build` | PASS | Next.js compilation and TypeScript completed successfully. Existing fallback-course-data warning remained. |
| `npm run lint` | PASS | ESLint completed without errors. |
| `npx prisma validate` | PASS | Prisma schema is valid. |
| `npm run prisma:validate` | PASS | Prisma schema is valid. |
| `git diff --check` | PASS | No whitespace errors; existing LF-to-CRLF normalization warnings were printed. |

### Browser And Route Checks

- Desktop public navigation: PASS. Only Home, Courses, Verify Certificate, Sign In, and Register were visible in the header.
- Public footer: PASS. Only retained platform, account, support, privacy, terms, and accessibility links were visible.
- Mobile navigation at 390 × 844: PASS. Menu opened successfully, exposed only retained public links, and produced no horizontal overflow.
- Public retained routes: PASS for landing, catalogue, HRBA course overview, registration, sign-in, certificate verification, support, privacy, terms, and accessibility.
- Public hidden-link scan: PASS. No `/creator`, `/admin`, or `/learn/settings` link was found.
- Browser console on a fresh public-route pass: PASS with no console errors.
- Participant direct access to `/learn/settings`: PASS, returned 404.
- Participant direct access to `/creator/courses`, `/admin/review`, and `/admin/monitoring`: PASS, redirected to `/unauthorized`.
- Authorized internal route preservation: PASS at the guard boundary. Creator, reviewer, monitoring, and admin role requests passed authorization and reached their preserved data loaders.
- No active basic-admin navigation entry or retained-surface shortcut points to creator, Build Studio, reviewer/publisher, cohorts, reference data, monitoring, pilot monitoring, audit log, or settings.

### Local Environment Constraint

The isolated worktree intentionally has no `DATABASE_URL`. Public routes use their existing fallback data and rendered successfully. Authenticated database-backed learner/internal pages cannot complete live data rendering without that external configuration; requests that passed their visibility/role guards then failed at the existing Prisma configuration boundary. No database was created, migrated, seeded, or modified to work around this constraint.

The attempted local demo sign-in also reached the existing `DATABASE_URL is required` boundary. A fresh browser tab was used for the final console check, which was error-free. This is an environment limitation, not a P1B build or route-isolation failure.

## Existing Warnings And Backlog

- Build warning: `getPublicCourseSummaries: using fallback course data. Error.`
- Dependency audit backlog from P1A: 9 vulnerabilities (1 low, 6 moderate, 2 high). P1B did not change dependencies.
- Dedicated forgot-password and contact routes do not exist.
- Decide later whether cohorts should re-enter the basic-admin surface.
- Decide the eventual basic-admin presentation for detailed progress/completion and feedback/issues without exposing advanced analytics.
- Review the preserved sign-in learning-preview panel during the deliberate sign-in/authentication-page polish task.

## Scope And Preservation Confirmation

- No route file, creator file, RDF-related architecture, Build Studio component, reviewer/publisher workspace, analytics implementation, monitoring implementation, demo utility, or experimental code was deleted.
- No authentication, Supabase, HRBA integration, assessment, certificate, progress, or feedback logic was changed.
- No landing-page redesign or catalogue content rewrite was performed.
- No Project Management, monitoring, directory, forum, or community function was added.
- No migrations, seeds, registration scripts, production database setup, or deployment commands were run.
- Hidden features remain preserved in Git and, where applicable, directly accessible to their authorized internal roles.

## Exact Next Task

P2A landing-page content and visual polish.
