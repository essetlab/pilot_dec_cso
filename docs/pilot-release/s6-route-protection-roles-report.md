# S6 Route Protection And Roles Report

## Summary

S6 hardens route protection after Supabase sign-in/session support and verifies the Learning Hub role boundaries continue to fail closed. Existing protected routes still call `getCurrentSession()` and `canAccessPath()`.

No Prisma schema, migration, HRBA deployment, HRBA `launchToken`, HRBA callback, or certificate logic was changed.

## Files Changed

- `package.json`
- `src/app/(learn)/learn/[[...segments]]/page.tsx`
- `src/lib/auth/navigation.ts`
- `src/lib/auth/permissions.ts`
- `src/lib/learner-actions.ts`
- `src/lib/learner-profile-workflow.ts`
- `src/lib/certificate-workflow.ts`
- `src/lib/course-data.ts`
- `src/lib/feedback-workflow.ts`
- `src/lib/upload-security.ts`
- `src/lib/creator-course-workflow.ts`
- `src/lib/creator-materials-workflow.ts`
- `src/lib/creator-preview-data.ts`
- `src/lib/build-studio-data.ts`
- `src/lib/build-studio-actions.ts`
- `src/lib/review-workflow.ts`
- `scripts/verify-hrba-course-import.ts`
- `scripts/verify-learner-course-player.ts`
- `scripts/verify-learner-template-rendering.ts`
- `scripts/verify-learner-template-selector.ts`
- `scripts/verify-s6-route-roles.ts`
- `docs/pilot-release/s6-route-protection-roles-report.md`

## Route Surfaces Inspected

- `/learn` and nested learner pages in `src/app/(learn)/learn/[[...segments]]/page.tsx`
- `/creator` and nested creator pages in `src/app/(creator)/creator/[[...segments]]/page.tsx`
- `/admin` and nested admin pages in `src/app/(admin)/admin/[[...segments]]/page.tsx`
- `src/lib/auth/server.ts`
- `src/lib/auth/hub-session.ts`
- `src/lib/auth/permissions.ts`
- `src/lib/auth/navigation.ts`
- learner, certificate, feedback, creator, review, upload, and build-studio protected workflow helpers

The inspected pages continue to:

- redirect unauthenticated users to `/sign-in?next=...`;
- redirect unauthorized users to `/unauthorized?from=...`;
- use `getCurrentSession()` as the session source;
- use `canAccessPath(session, actualRoute)` for route-level authorization.

## Role Boundaries Confirmed

The S6 verifier confirms:

- unauthenticated users cannot access `/learn`, `/creator`, `/admin`, or `/admin/monitoring`;
- `PARTICIPANT` can access `/learn` only;
- `ME_VIEWER` can access `/admin/monitoring` and `/admin/pilot-monitoring`, but not broader admin or creator routes;
- `COURSE_CREATOR` can access `/creator`, but not broader admin routes;
- `COURSE_REVIEWER` can access `/admin/review`, but not broader admin routes;
- `SUPER_ADMIN` and `PLATFORM_ADMIN` can access admin routes;
- users with no active roles fail closed.

S6 also fixed `/admin/pilot-monitoring` so it uses the same monitoring role boundary as `/admin/monitoring`.

## User/Session Join Hardening

Security-sensitive current-user lookups were changed from `session.email` to `session.userId` in protected workflows where the authenticated Hub user is being loaded.

Hardened areas include:

- learner profile update and profile data;
- learner course summaries and course detail enrollment lookups;
- learner final-test page and learner final-test/lesson actions;
- certificate list/detail helpers;
- course feedback submission;
- upload authorization scope;
- creator course, materials, preview, and build-studio helpers/actions;
- review workflow helpers.
- local verification fixtures that call `setMockSession()` now provide the Hub `userId` as well as email.

Email remains part of `AuthSession` for display, notifications, and non-current-user email workflows.

## Remaining Email-Based Joins

The remaining `session.email` joins are in `src/lib/external-course-workflow.ts`. They are intentionally deferred to S7 because that file owns HRBA launch/callback compatibility, and the task explicitly reserves full HRBA compatibility verification for S7. The current S6 change set does not alter HRBA launch, callback, certificate, or external-course token behavior.

Email-based lookups also remain where email is the domain key, such as registration duplicate checks, staff invitations, and onboarding flows.

## Supabase Fail-Closed Behavior

Supabase session resolution remains fail-closed through S5 helpers:

- `getCurrentSession()` in Supabase mode reads the Supabase user from SSR cookies;
- it resolves the Hub user by `authProviderId`;
- route-time resolution sets `linkEmailFallback: false`;
- unlinked Supabase users return `null`;
- inactive Hub users return `null`;
- Hub users with no active roles return `null`.

The S6 verifier checks inactive and no-role Hub session mapping failures, plus source-level checks that route-time Supabase session resolution does not use email fallback.

## Middleware Or Proxy

No root `middleware.ts` or `proxy.ts` was added. Route behavior continues through existing page-level guards and server-side session resolution.

## Verification

Added:

```powershell
npm run verify:s6-route-roles
```

Required checks for S6:

```powershell
npm run verify:s6-route-roles
npm run verify:s5-signin
npm run verify:s4-registration
npx prisma validate
npm run prisma:validate
npm run lint
npm run build
npm run verify:hrba-external-course
npm run verify:r17
git diff --check
git status --short
```

## Scope Confirmation

- No Prisma schema changes were made.
- No migrations were created or run.
- No Supabase production migration commands were run.
- No HRBA deployment changes were made.
- No HRBA `launchToken` contract changes were made.
- No HRBA callback changes were made.
- No certificate logic changes were made.
- No real learner or admin accounts were created.
- Daniel and Mulu were not invited.
- No Supabase `service_role` key was used in browser/client code.
- No existing role boundary was weakened.
- No donor, community, Build Studio expansion, practical proof, or future-stage features were added.

## Next Slice Recommendation

S7 should focus on HRBA launch compatibility, including replacing the remaining current-user email joins in `src/lib/external-course-workflow.ts` only with full HRBA launch/callback verification.
