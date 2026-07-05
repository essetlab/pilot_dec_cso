# Supabase Auth and Vercel Real Pilot Implementation Audit

Date: 2026-07-05

Scope: planning and implementation audit only. No application source code, Prisma schema, migrations, `.env`, HRBA deployment, certificate logic, or HRBA callback logic was changed.

## Readiness Verdict

The Hub is not ready to invite Daniel and Mulu through a real Vercel/Supabase pilot until Supabase Auth is implemented and verified. The current learner journey is functionally close, and the HRBA external course integration is already tokenized and suitable to preserve, but authentication is still the Hub's local password/session implementation.

Verdict: caution / not production-pilot ready for real online invitations.

Primary blocker: Supabase Auth requires schema and code changes before the Vercel Hub can use Supabase Auth as the source of authentication.

## 1. Current Auth And Session Implementation

### Registration

- Public learner registration is implemented at `src/app/(auth)/register/page.tsx` with the server action in `src/app/(auth)/register/actions.ts`.
- The action calls `registerPilotLearner` in `src/lib/pilot-registration-workflow.ts`.
- `registerPilotLearner` validates required fields, password confirmation, password policy, consent, pilot access code, and optional strict invited-email mode.
- Pilot access code configuration is read from `PILOT_ACCESS_CODES`, then `PILOT_ACCESS_CODE`, then a source-defined fallback of `HRBA-PILOT-2026`.
- Strict invited-email mode is enabled only when `PILOT_REGISTRATION_MODE=strict`; allowed emails come from `PILOT_INVITED_EMAILS` or an active `OnboardingInvitation` with `PARTICIPANT` role.
- Current registration creates a Hub `User`, stores a local `passwordHash`, upserts an `Organization`, and assigns the `PARTICIPANT` role.
- Staff registration is implemented at `src/app/(auth)/register/staff/page.tsx` and `src/app/(auth)/register/staff/actions.ts`, backed by `src/lib/auth/staff-onboarding.ts`. It completes an existing `OnboardingInvitation` by setting local profile fields, local password hash, and `ACTIVE` status.

### Sign-in and sign-out

- Sign-in page: `src/app/(auth)/sign-in/page.tsx`.
- Password sign-in action: `signInWithPassword` in `src/app/(auth)/sign-in/actions.ts`.
- Demo/quick learner sign-in action: `signInDemoUser` in the same file.
- Password sign-in looks up `User` by normalized email, requires `ACTIVE` status and `passwordHash`, verifies the local password, reads active role assignments, and writes a signed Hub cookie session.
- Sign-out is implemented in `src/app/(auth)/sign-out/route.ts`; it deletes the Hub session cookie and redirects to `/sign-in`.

### Sessions

- Session utilities are in `src/lib/auth/server.ts` and `src/lib/auth/session-codec.ts`.
- The cookie name is `cso_lh_session`.
- The session payload contains `userId`, `email`, `name`, `roles`, and `issuedAt`.
- The cookie is HMAC-signed with `SESSION_SECRET`, `httpOnly`, `sameSite=lax`, path `/`, and 8-hour max age. `secure` depends on `NEXT_PUBLIC_APP_URL` starting with `https://`.
- There is no app-level `middleware.ts` in the repository. Session reads and route guard decisions are made in route group pages/layouts and server actions.

### Protected route guards

- Role helpers live in `src/lib/auth/permissions.ts`.
- `/learn` allows `SUPER_ADMIN`, `PLATFORM_ADMIN`, `COURSE_CREATOR`, `COURSE_REVIEWER`, `FACILITATOR`, `CSO_FOCAL_PERSON`, and `PARTICIPANT`.
- `/creator` allows `SUPER_ADMIN`, `PLATFORM_ADMIN`, and `COURSE_CREATOR`.
- `/admin` allows `SUPER_ADMIN` and `PLATFORM_ADMIN`, except:
  - `/admin/review` also allows `COURSE_REVIEWER`;
  - `/admin/monitoring` also allows `ME_VIEWER`.
- Learner, creator, and admin catch-all pages call `getCurrentSession()` and redirect unauthenticated users to `/sign-in?next=...`; unauthorized users redirect to `/unauthorized?from=...`.

### Learner identity links

- The internal Hub `User.id` is the primary learner identity for enrollments, progress, quiz attempts, certificates, feedback, monitoring, course assignments, and launch tokens.
- `Enrollment.userId`, `QuizAttempt.userId`, `Certificate.userId`, `Feedback.userId`, and `ExternalCourseLaunchToken.userId` point to Hub `User.id`.
- Many workflows currently resolve the user by `session.email`, then operate on `dbUser.id`. Examples include `src/lib/course-data.ts`, `src/lib/learner-actions.ts`, `src/lib/certificate-workflow.ts`, `src/lib/feedback-workflow.ts`, `src/lib/learner-profile-workflow.ts`, and `src/lib/external-course-workflow.ts`.
- Monitoring aggregates `User`, `Enrollment`, `QuizAttempt`, `Certificate`, and `Feedback` records in `src/lib/monitoring-workflow.ts` and `src/lib/pilot-monitoring-workflow.ts`; role access is still controlled by the Hub role assignments.

## 2. Current Prisma Schema

### User, learner, account, and profile models

- The central account/profile model is `User`.
- There is no separate `Learner`, `Account`, or `Profile` model. Learner profile fields live directly on `User`: `fullName`, `email`, `phone`, `jobTitle`, `department`, `preferredLanguage`, `region`, `profilePhotoUrl`, `organizationId`, and `primaryCohortId`.
- Roles are represented by `Role` and `UserRoleAssignment`.
- Staff and learner invitations are represented by `OnboardingInvitation`.
- Learner activity is linked through `Enrollment`, `LessonProgress`, `QuizAttempt`, `Certificate`, and `Feedback`.

### Supabase Auth linking point

- `User.authProviderId String?` already exists and appears intended for an external auth provider id.
- The field is not used by current auth workflows. Current registration/sign-in paths use `email` plus local `passwordHash`.
- Recommended mapping: use `User.authProviderId` for the Supabase Auth `auth.users.id` UUID, or rename/add a clearer field such as `supabaseAuthUserId`.
- Because Supabase Auth user ids are globally unique, the field should become uniquely indexed before real pilot use.

### Recommended schema change

Recommended minimum:

```prisma
model User {
  authProviderId String? @unique
  authProvider   String? @default("supabase")
}
```

Alternative, clearer but more invasive:

```prisma
model User {
  supabaseAuthUserId String? @unique
  authProvider       String? @default("supabase")
}
```

Keep `email` unique as the human/account lookup and duplicate prevention guard. Keep `passwordHash` nullable for legacy local/demo data during migration, then decide later whether to remove local password sign-in after pilot stabilization.

Migration required: yes. At minimum add a unique index on the auth user id field and optionally add an `authProvider` field. If the existing `authProviderId` field is reused, this can be a small migration. Existing rows need a backfill/mapping plan before local password login is disabled.

## 3. Current HRBA Launch Integration

### Launch token creation

- HRBA configuration lives in `src/lib/external-course-config.ts`.
- Default HRBA course URL is `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
- The learner route `/learn/courses/[courseSlug]/external` is handled in `src/app/(learn)/learn/[[...segments]]/page.tsx`.
- It calls `getExternalCourseLaunchData` in `src/lib/external-course-workflow.ts`.
- `getExternalCourseLaunchData`:
  - requires a signed Hub session;
  - resolves the Hub user by `session.email`;
  - loads the published HRBA course and published course version;
  - checks assignment when visibility is `ASSIGNED_ONLY`;
  - upserts the learner `Enrollment`;
  - creates/updates external-course `LessonProgress`;
  - generates a random 32-byte base64url `launchToken`;
  - stores only the SHA-256 token hash in `ExternalCourseLaunchToken`;
  - sets token expiry to 8 hours;
  - records `userId`, `courseId`, `courseVersionId`, `enrollmentId`, `courseSlug`, `allowedOrigin`, and `portalOrigin`;
  - builds the iframe URL with `embed=portal`, `portalOrigin`, `courseSlug`, and `launchToken`.

### Learner fields used

- Launch and callback identity are based on Hub `User.id` and the current session's email/user id.
- The iframe URL does not include raw Hub `userId`, `enrollmentId`, or `courseVersionId`.
- Certificate snapshot uses `user.fullName || user.email`.
- Assignment checks use `User.organizationId` and `User.primaryCohortId`.

### Callback validation

- Client message handling is in `src/components/learner/ExternalCourseFrame.tsx`.
- Server endpoint is `src/app/api/external-course-progress/route.ts`.
- Message type must be `cso-learning-hub:external-course-progress` with `version: 1`.
- The route validates progress and assessment shape, reads the current Hub session, and calls `recordExternalCourseProgress`.
- `recordExternalCourseProgress` validates:
  - active session exists;
  - DB user exists and matches `session.userId`;
  - launch token exists and is unexpired;
  - token belongs to the same user;
  - token course slug matches;
  - iframe origin matches token allowed origin;
  - iframe origin is in course metadata allowed origins;
  - token enrollment belongs to the same user, course, and version.
- It records enrollment/progress, stores external final assessment as a `QuizAttempt`, and issues a certificate only after completion plus passing assessment.

### Must remain unchanged

- The HRBA deployed URL remains `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
- Do not expose raw user, enrollment, course-version, or certificate internals to the iframe.
- Preserve `launchToken`, `portalOrigin`, `courseSlug`, allowed-origin validation, token hashing, 8-hour expiry, final assessment callback contract, and Hub-owned certificate issuance.
- Do not move certificate issuance into the HRBA app.
- Do not weaken callback validation while migrating auth.

## 4. Supabase Auth Integration Plan

### Dependencies and utilities

- Add `@supabase/supabase-js` and `@supabase/ssr`.
- Create server/client utilities, for example:
  - `src/lib/supabase/client.ts` for browser client creation using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
  - `src/lib/supabase/server.ts` for server client creation using `@supabase/ssr` and Next cookies.
  - `src/lib/auth/session.ts` or an updated `src/lib/auth/server.ts` that maps Supabase sessions to the existing `AuthSession` shape by loading the Hub `User` and active roles.
- Do not put the service-role key in client utilities. Use it only in server-only code if a specific admin operation truly needs it.

### Cookie-based SSR auth

- Add a root `middleware.ts` using the `@supabase/ssr` cookie refresh pattern so SSR sees current Supabase sessions.
- Replace `cso_lh_session` as the source of truth with Supabase Auth cookies.
- Keep a compatibility wrapper so existing route guards still receive `{ userId, email, name, roles, issuedAt }`, but derive it from Supabase `auth.getUser()` plus Hub `User`/roles.
- Update route guards and actions to fail closed when Supabase Auth is valid but no linked Hub `User` exists.

### Registration with invited email and pilot access code

- Preserve the existing pilot access-code and strict invited-email rules.
- New sequence:
  1. Validate form fields, consent, access code, and invited-email policy before creating auth/profile records.
  2. Call Supabase Auth sign-up with email/password.
  3. Create or link the Hub `User` profile with `authProviderId`/`supabaseAuthUserId`, normalized email, profile fields, organization, and role assignment.
  4. Handle duplicate email carefully: if Supabase user exists but Hub user is missing, provide a controlled recovery path rather than creating a second Hub user.
- If email confirmation is enabled, decide whether Hub profile creation happens immediately after sign-up or after confirmation. For the pilot, immediate profile creation with a clear pending-confirmation sign-in message is simpler, but callbacks must not assume login until Supabase session is valid.

### Learner profile creation after Supabase sign-up

- Create Hub `User` in the same server action after Supabase sign-up succeeds.
- Set `User.authProviderId` to Supabase user id and leave `passwordHash` null for Supabase users.
- Assign `PARTICIPANT` role exactly as current pilot registration does.
- Continue to upsert/link organization and store region/job title/department.

### Sign-in and sign-out

- Replace `signInWithPassword` local password verification with Supabase `signInWithPassword`.
- After Supabase sign-in, load Hub `User` by `authProviderId` first, with email as a temporary migration fallback.
- Require `User.status === ACTIVE` and at least one active role assignment.
- Sign-out should call Supabase Auth sign-out and clear any legacy `cso_lh_session` cookie during migration.

### Email and password flow

- Use Supabase Email + Password provider.
- Keep password policy either aligned with Supabase dashboard settings or validate in the Hub before calling Supabase sign-up.
- Add password reset routes once Supabase reset emails are enabled.
- If email confirmation is enabled, update sign-in/register messaging for confirmation-required states.

### Route protection

- Keep the existing role matrix in `src/lib/auth/permissions.ts`.
- Convert `getCurrentSession()` to:
  1. read Supabase user from SSR cookies;
  2. load the linked Hub user and active role assignments;
  3. return the existing `AuthSession` shape.
- Update workflows that query `User` by `session.email` to prefer `session.userId` after the auth migration. Email should remain a display/recovery field, not the primary security join.

### Admin and monitoring roles

- Continue to store roles in Hub tables, not Supabase user metadata, for Phase 1.
- Admin-created staff users can either:
  - create Supabase Auth users via server-only Supabase Admin API and send Supabase password/reset invite; or
  - keep current Hub invitation table but complete it by creating/linking a Supabase Auth account.
- `ME_VIEWER` must continue to access only `/admin/monitoring` and `/admin/pilot-monitoring`, not broader admin operations.

## 5. Supabase Postgres And Prisma Plan

### Connection strings

Use the Supabase Prisma/ORM connection string for `DATABASE_URL` and the Supabase direct connection string for `DIRECT_URL`.

Recommended:

- `DATABASE_URL`: pooled Supabase Postgres connection string suitable for Vercel/serverless Prisma runtime.
- `DIRECT_URL`: direct Supabase Postgres connection string for Prisma migrations.

### Are both needed?

Yes, for a safe production setup. Runtime should use the pooled URL; migrations should use the direct URL. This repo uses Prisma 7 with `@prisma/adapter-pg`: runtime reads `DATABASE_URL` in `src/lib/prisma.ts`, while migration configuration is in `prisma.config.ts`. Implementation should update the Prisma migration configuration to support the direct Supabase URL without changing runtime traffic away from the pooled URL. This is a code/config change and should happen in an implementation slice, not in this audit.

### Safe migration flow

- Use a non-production Supabase branch/project or local Postgres first.
- Run `npm run prisma:validate`.
- Generate a migration locally with reviewed SQL.
- Apply to Supabase with `prisma migrate deploy` using production env vars only after backup/restore readiness is confirmed.
- Never run `prisma migrate dev` directly against production.
- Avoid `prisma db push` for production pilot schema changes.
- Confirm generated Prisma client is not committed.

### Seed data

Seed/reference data is needed in Supabase for:

- role keys and role labels;
- admin and monitoring accounts/role assignments;
- HRBA external course metadata;
- capacity/reference data used by courses and monitoring;
- certificate template assumptions if any seed-dependent fields are required.

Do not seed real pilot learner passwords into Supabase. Real pilot learners should register through Supabase Auth or be invited through the chosen Supabase-compatible staff/learner flow.

## 6. Vercel Deployment Plan

Set these variables in both Production and Preview unless explicitly different per environment.

Required:

- `DATABASE_URL`: Supabase pooled Prisma/ORM connection string.
- `DIRECT_URL`: Supabase direct connection string for migrations.
- `SESSION_SECRET`: keep during migration for legacy cookie clearing/compatibility if any path still reads the old session. It can be retired only after all local session usage is removed.
- `NEXT_PUBLIC_APP_URL`: exact Vercel Hub URL for the environment.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase anon/publishable key.
- `HRBA_EXTERNAL_COURSE_URL`: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`: at least `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
- `PILOT_ACCESS_CODE` or `PILOT_ACCESS_CODES`: programme-approved pilot code(s).
- `PILOT_REGISTRATION_MODE`: recommend `strict` for real pilot if Daniel and Mulu are invite-only.
- `PILOT_INVITED_EMAILS`: include the approved invited learner emails when strict mode is used.

Conditional:

- `SUPABASE_SECRET_KEY`: only if server-only code uses Supabase Admin API for admin-created users, invite links, user recovery, or profile repair. Never expose it to frontend code and never prefix it with `NEXT_PUBLIC_`.
- SMTP variables only if Hub still sends invitation emails directly:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SMTP_SECURE`
  - `EMAIL_FROM`

Preview-specific note: include the Preview deployment URL in Supabase redirect URLs or keep Preview auth disabled for invitation testing.

## 7. Supabase Dashboard Configuration Needed

- Site URL: production Hub URL, for example `https://YOUR-HUB.vercel.app`.
- Redirect URLs:
  - production Hub URL;
  - production auth callback URL if implemented, for example `https://YOUR-HUB.vercel.app/auth/callback`;
  - production password reset/update route when implemented;
  - Vercel Preview URLs used for QA, or a wildcard only if the team accepts the risk.
- Email confirmation recommendation:
  - For real external pilot, enable email confirmation if deliverability is configured and timing allows.
  - For Daniel/Mulu first internal pilot, confirmation may be disabled temporarily to reduce friction, but this should be an explicit decision and recorded.
- Custom SMTP recommendation:
  - Configure custom SMTP before inviting real external learners. Supabase default email delivery is not ideal for programme-facing pilot invitations and password resets.
- Password reset recommendation:
  - Enable Supabase password reset and add tested Hub reset/update routes before broad pilot invitations.
  - Add support guidance for "forgot password" before Daniel and Mulu are invited if they are expected to self-serve.

## 8. Risk Assessment

| Risk | Severity | Notes |
|---|---:|---|
| Login breakage | P0 | Replacing the local session source can lock out all roles if Supabase cookie SSR or Hub user linking is wrong. |
| Registration breakage | P0 | Pilot learners cannot enter the Hub if Supabase sign-up and Hub profile creation are not coordinated. |
| Profile not linked to auth user | P0 | A Supabase session without a linked Hub `User` breaks enrollment, progress, certificate, feedback, and monitoring. |
| Callback/security regression | P0 | Weakening launch token/session/origin validation could allow forged progress or certificate issuance. |
| HRBA launch fails | P1 | Session migration could break `/learn/courses/[slug]/external` if `getExternalCourseLaunchData` cannot resolve the Hub user. |
| Certificate issue fails | P1 | Certificate creation depends on correct `User.id`, `Enrollment`, `QuizAttempt`, and callback assessment linkage. |
| Monitoring roles not protected | P1 | `ME_VIEWER` must remain restricted to monitoring pages only. |
| Duplicate users | P1 | Email-based fallback plus Supabase Auth ids can create split records unless linking is unique and deterministic. |
| Registration duplicate/recovery edge cases | P1 | Supabase user created but Hub profile creation failed needs a repair path. |
| Email confirmation delivery fails | P2 | Learners may be unable to confirm or reset passwords; custom SMTP reduces this risk. |
| Service-role key exposure | P0 | `SUPABASE_SECRET_KEY` must never enter client bundles or `NEXT_PUBLIC_*` variables. |
| Preview/Production redirect mismatch | P2 | Supabase redirects must include exact Vercel URLs used during QA. |
| Legacy cookie confusion | P2 | During migration, stale `cso_lh_session` should be cleared or ignored to avoid mismatched identity. |
| Seed/admin role gaps | P2 | Supabase database must have role seed data and at least one admin/monitoring account linked to Supabase Auth. |
| User-facing email/password messaging mismatch | P3 | Confirmation/reset states need clear copy but are not a core data integrity risk. |

## 9. Recommended Implementation Slices

### S1: Env Template And Deployment Checklist

- Update `.env.example` and deployment docs with Supabase/Vercel variables.
- Add `DIRECT_URL`, Supabase public vars, optional server secret, pilot vars, and redirect checklist.
- No behavior change.

### S2: Supabase Dependency And Client Setup

- Add `@supabase/supabase-js` and `@supabase/ssr`.
- Add server/client Supabase utilities.
- Add cookie refresh middleware.
- Keep existing auth behavior until the new utilities are verified in isolation.

### S3: Database Schema/Profile Linking

- Add or formalize unique Supabase auth user id field.
- Add optional `authProvider`.
- Add migration and backfill plan for existing admin/demo users.
- Update Prisma runtime/migration configuration so runtime uses `DATABASE_URL` and migrations can use `DIRECT_URL`.

### S4: Registration/Sign-up Migration

- Convert learner registration to Supabase Auth sign-up.
- Preserve pilot access code and invited-email validation.
- Create/link Hub `User`, organization, and `PARTICIPANT` role after Supabase sign-up.
- Handle duplicate/recovery states.

### S5: Sign-in/Sign-out Migration

- Convert password sign-in to Supabase Auth.
- Derive `AuthSession` from Supabase session plus Hub user/roles.
- Convert sign-out to Supabase sign-out and clear legacy cookie.
- Add confirmation/password-reset messaging as needed.

### S6: Route Protection And Roles

- Update all route guards/actions to use Supabase-derived sessions.
- Prefer `session.userId` over `session.email` for secure DB joins.
- Verify participant, creator, reviewer, admin, and `ME_VIEWER` boundaries.

### S7: HRBA Launch Compatibility

- Verify `/learn/courses/[slug]/external` still creates enrollment, lesson progress, hashed launch token, iframe URL, and no raw IDs.
- Verify `/api/external-course-progress` still validates current session, launch token, origin, enrollment, assessment, and certificate issuance.
- Do not change HRBA callback contract except for auth-session adaptation.

### S8: Vercel Deployment And Supabase Migration

- Apply migrations to Supabase safely with direct connection.
- Configure Vercel Production and Preview env vars.
- Register HRBA external course metadata in Supabase.
- Link at least one admin and one monitoring account.

### S9: Internal Pilot 0 Re-run

- Re-run registration, sign-in, learner dashboard, My Courses, HRBA iframe, final assessment callback, certificate, verification, feedback, and monitoring.
- Invite Daniel and Mulu only after acceptance criteria pass on the deployed Vercel Hub.

## 10. Acceptance Criteria Before Daniel And Mulu Are Invited

- Learner can register online through the Vercel Hub with invited email and approved pilot access code.
- Learner can sign in through Supabase Auth.
- A linked Hub learner profile is created with `User.id`, Supabase auth id, email, name, organization, region/job title, and `PARTICIPANT` role.
- HRBA appears in My Courses for the learner.
- HRBA iframe opens from the Hub with `launchToken`.
- HRBA iframe URL does not expose raw `userId`, `enrollmentId`, `courseVersionId`, certificate id, or assessment answers.
- Final assessment callback works through `/api/external-course-progress`.
- Certificate is generated only after completion plus passing final assessment.
- Public certificate verification works at `/verify-certificate?code=...`.
- Feedback submission works for the learner.
- Admin/monitoring views show registration, enrollment, progress, final assessment, certificate, and feedback signals.
- `ME_VIEWER` can access monitoring but cannot access broader admin operations.
- Supabase service role key is absent from frontend code and browser-visible environment.
- Vercel Production and Supabase redirect URLs match exactly.

## Missing External Setup Items

- Confirm final Vercel Hub Production URL and Preview URL policy.
- Configure Supabase Site URL and redirect URLs.
- Decide whether email confirmation is enabled for Daniel/Mulu.
- Configure Supabase custom SMTP before broader real-pilot invitations.
- Decide whether Hub invitation emails remain SMTP-based or move to Supabase Auth emails.
- Create/link at least one Supabase-backed Platform Admin account and one M&E Viewer account.
- Confirm programme-approved `PILOT_ACCESS_CODE` or `PILOT_ACCESS_CODES`.
- Confirm `PILOT_REGISTRATION_MODE=strict` and final `PILOT_INVITED_EMAILS` list for Daniel and Mulu.
- Confirm Supabase `DATABASE_URL` pooled string and `DIRECT_URL` direct string are set in Vercel.

## Evidence And Checks

Commands and reads performed for this audit:

- Read `README.md`.
- Read `docs/specs/phase-1-cso-learning-hub/README.md`.
- Read `docs/specs/phase-1-cso-learning-hub/CODEX_IMPLEMENTATION_STATUS.md`.
- Read `docs/specs/phase-1-cso-learning-hub/CODEX_REVISED_IMPLEMENTATION_PLAN.md`.
- Inspected `prisma/schema.prisma`.
- Inspected `.env.example` and `package.json`.
- Inspected current auth/session files under `src/lib/auth` and `src/app/(auth)`.
- Inspected learner, certificate, feedback, monitoring, and external HRBA workflow files.
- Inspected `docs/deployment/VERCEL_POSTGRES_DEPLOYMENT.md`.
- Ran repository searches with `rg` for auth/session/Supabase/HRBA/certificate/progress references.

No lint/build/prisma validation was required for this documentation-only audit because no application source, schema, or migration files were changed.

## Changed Files

- `docs/pilot-release/supabase-auth-vercel-real-pilot-audit.md`

## Scope-Control Confirmation

- No Phase 2 or Phase 3 product areas were added.
- No application source code was modified.
- No database schema was modified.
- No migrations were created or run.
- No `.env` file was modified.
- No HRBA deployment, certificate logic, or HRBA callback logic was changed.
- No secrets were committed.
