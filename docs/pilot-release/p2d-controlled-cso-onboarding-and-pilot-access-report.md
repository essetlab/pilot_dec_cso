# P2D Controlled CSO Onboarding and Pilot Access Report

## Purpose and decision

P2D audited and hardened the existing CSO Learning Hub identity, onboarding,
organization-linkage, account-lifecycle, role, and HRBA record-ownership
boundaries. It did not create a parallel identity system and did not change the
catalogue, course content, HRBA launch contract, database schema, Vercel, or
Production.

Repository implementation and pure/local validation are complete. Connected
identity verification is not complete because the approved non-production
Supabase database, Auth identities, email delivery, and test accounts have not
been provisioned. Readiness decision:

`BLOCKED — non-production identity environment required for end-to-end verification`

## Baseline

- Worktree: `D:\z CDP-Lg-Andy-phase1-clean`
- Verified starting branch: `main`
- Verified starting `main` and `origin/main`: `4ba0233b5c8e391e37629e982240d44e21961c8d`
- Starting ahead/behind: `0/0`
- Starting status: clean
- Implementation branch: `feature/pilot-cso-onboarding-access`
- No commit was added to `main`.

## Baseline capability matrix

| Capability | Existing status | Evidence | Gap found | P2D action |
|---|---|---|---|---|
| Public learner registration | Partial | `src/app/(auth)/register`, `src/lib/pilot-registration-workflow.ts` | Public input could create or reactivate an arbitrary organization | Registration now matches an existing `ACTIVE` organization only |
| Supabase sign-up/sign-in/sign-out | Implemented | auth actions, API route, Hub session resolver | Confirmation return path was absent | Added the Supabase callback and accurate confirmation guidance |
| Session resolution | Partial | `src/lib/auth/server.ts` | Supabase mode could fall back to a stale signed Hub cookie | Supabase mode now fails closed and resolves the current database status |
| Email verification | Partial | Supabase sign-up | No Hub callback or confirmed-email success path | Added callback exchange and sign-in guidance |
| Forgot/reset password | Missing | No routes existed | No request, callback, update, invalid-link, or success workflow | Added Supabase-only, rate-limited, non-enumerating recovery |
| User lifecycle | Implemented but not consistently enforced | `UserStatus`, admin people workflow | Stale sessions and external launch did not independently enforce all statuses | Added current status checks and expired-role filtering |
| Organization lifecycle | Partial but usable | `OrganizationStatus`, audited admin create/update | Only `INACTIVE`, `ACTIVE`, and `ARCHIVED` are available | Preserved the schema; active is approved, inactive is not approved/paused, archived is closed history |
| CSO focal person | Role exists | `CSO_FOCAL_PERSON`, staff invitations | Staff invitation still stored a local password in Supabase environments | Existing invitation now creates/links Supabase Auth and leaves `passwordHash` null |
| Admin authorization | Implemented | admin guards and people workflow | Actor lookup did not re-check current status and admin assignment | Privileged people mutations now re-check active admin role server-side |
| Organization linkage | Partial | `User.organizationId`, audited admin relinking | Learner could name an organization during public registration | Name is matched case-insensitively to an approved record; no public organization list is exposed |
| HRBA ownership | Strong | user/version enrollment uniqueness, launch token and callback checks | Launch/progress accepted a stale session without independent lifecycle checks | Added active-user and active-organization checks without changing the integration contract |
| Record separation | Implemented structurally | user-scoped profile/progress/certificate queries and unique keys | Needed focused evidence | Added focused source/pure verification; connected two-user test remains blocked |
| Audit trail | Implemented | `AuditLog`, admin workflows | Registration consent and invited-staff activation were not recorded | Added non-sensitive registration/activation audit records |

## Implemented changes

### Controlled CSO and learner onboarding

- Public registration can no longer create, update, reactivate, or enumerate
  organizations. It links an individual learner only to a case-insensitive exact
  match for an existing active organization.
- Production no longer receives the local development pilot access-code default.
  `PILOT_ACCESS_CODE` or `PILOT_ACCESS_CODES` must be explicitly configured.
- Existing-email and Supabase duplicate-account cases return one generic public
  registration result to avoid account enumeration.
- Registration continues to require individual email, password, learner profile,
  organization name, role/position, region, pilot access code, and explicit
  Terms/Privacy acknowledgement.
- The consent acknowledgement and resulting individual account creation are
  recorded without passwords or tokens.
- Existing admin organization creation/editing supports name, type, formality,
  registration number, location, focal-person contacts, notes, and lifecycle
  status. Only authorized platform administrators can mutate it.

### Authentication and recovery

- Learner and invited-staff sign-up use the existing Supabase server client when
  Supabase is configured. Supabase Auth remains the password store; the Hub
  `passwordHash` stays null for Supabase-linked identities.
- `/auth/callback` exchanges the Supabase PKCE code and safely restricts the
  return path to an internal path.
- `/forgot-password` sends a Supabase recovery request, rate limits repeated
  requests, and always gives the same public response for known, unknown,
  malformed, or throttled addresses.
- `/reset-password` validates the existing password policy, handles missing or
  expired recovery sessions, updates through Supabase Auth, signs the recovery
  session out, clears the legacy Hub cookie, and returns safely to sign-in.
- Email confirmation and password-reset success messages were added to sign-in.

### Role and lifecycle rules

- Existing roles were preserved. No role or schema was added.
- `PARTICIPANT` maps to the learner function. `CSO_FOCAL_PERSON` maps to the
  focal-person function. `PLATFORM_ADMIN` and `SUPER_ADMIN` map to DEC/platform
  administration.
- Learners and focal persons require an active user, at least one active and
  unexpired role assignment, and an active linked organization.
- Invited, suspended, and deactivated users cannot resolve a Supabase-backed Hub
  session. Inactive or archived organizations also block learner/focal access.
- Admin people mutations re-check the current database user status and a current
  active/unexpired platform-admin or super-admin assignment.
- Existing admin status changes retain enrollments, progress, attempts, and
  certificates; reactivation updates the existing user rather than creating a
  second learner.
- The focal-person role remains restricted to the learner surface. No
  organization-management workspace or private learner assessment access was
  introduced.

### Record separation and HRBA

- Enrollment and certificate ownership remains keyed by `userId` plus
  `courseVersionId`; lesson progress remains keyed by enrollment plus lesson.
- Learner profile, course, feedback, progress, assessment, and certificate reads
  remain scoped from the authenticated Hub `session.userId`.
- HRBA progress callbacks still require the short-lived hashed launch token and
  verify token user, course, version, enrollment, and origin ownership.
- P2D added current user and organization eligibility checks before both HRBA
  launch and progress persistence.
- No HRBA origin, token shape, iframe URL, assessment, completion, certificate,
  or resume rule was changed.

## Security and privacy results

- Unauthenticated `/learn` and `/admin` requests redirected to sign-in with an
  internal encoded return path.
- Learner-to-admin and learner-to-creator authorization remains denied by the
  existing centralized route guard.
- Public organization enumeration was not introduced.
- Client roles, organization ids, learner ids, enrollment ids, and hidden form
  values are not trusted for the new controls.
- Passwords, access tokens, reset tokens, session tokens, service-role values,
  and complete recovery URLs are not logged or stored in the report.
- Invalid recovery callback requests return a clear invalid/expired-link result.
- Sensitive mutations remain Next.js server actions or same-origin route
  handlers and repeat server-side authorization.

## User experience and accessibility evidence

Local browser checks at the available 1280 x 720 desktop viewport confirmed:

- forgot-password and reset-password headings and instructions render;
- each recovery control has an associated text label;
- keyboard focus on the email field has a visible focus ring;
- invalid/expired-link guidance is text-labelled;
- no horizontal document overflow was present;
- protected learner and admin routes redirect with an explanation path;
- no browser-console error was recorded during these checks.

Responsive classes, bounded containers, wrapping text, and mobile-first form
grids were inspected for the new pages. A device-accurate 390 x 844 browser run,
enlarged-text run, high-contrast run, reduced-motion run, and a complete
keyboard-only traversal must be repeated in the connected non-production QA
closure. They are not claimed as completed here.

## Automated checks

| Check | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run verify:p2d-onboarding-access` | Pass |
| `npm run verify:s5-signin` | Pass |
| `npm run verify:s6-route-roles` | Pass |
| `npm run verify:s7-hrba-supabase-compat` | Not run to completion: requires `DATABASE_URL` |
| `npm run build` | Pass; existing fallback-course-data warning recorded |
| `npm run lint` | Pass |
| `npx prisma validate` | Pass |
| `npm run prisma:validate` | Pass |
| `git diff --check` | Pass |

The build's fallback-course-data warning is existing technical backlog and did
not cause a build or security failure.

## Files changed

- `src/app/(auth)/auth/callback/route.ts`
- `src/app/(auth)/forgot-password/actions.ts`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/actions.ts`
- `src/app/(auth)/reset-password/page.tsx`
- registration, staff registration, and sign-in actions/pages under
  `src/app/(auth)`
- `src/app/api/sign-in/route.ts`
- `src/lib/pilot-registration-workflow.ts`
- `src/lib/auth/hub-session.ts`
- `src/lib/auth/server.ts`
- `src/lib/auth/staff-onboarding.ts`
- `src/lib/admin-people-workflow.ts`
- `src/lib/external-course-workflow.ts`
- focused S4/S5/S6/P2D verification scripts and `package.json`
- this report

## Unchanged boundaries

- No Prisma schema or migration change.
- No migration, seed, production database write, or test-account creation.
- No catalogue, course title/order/state, course overview, Project Management,
  certificate, monitoring, External Course Manager, or hidden-system change.
- No Vercel setting, environment variable, deployment, promotion, or Production
  resource change.
- No existing functionality or historical evidence was deleted.

## P2D.1 staging PostgreSQL migration checkpoint — 2026-07-20

The approved staging connection file remains outside the repository. The
runtime `DATABASE_URL` uses the staging transaction pooler, while `DIRECT_URL`
was privately corrected to the IPv4 session pooler because the direct Supabase
hostname was unavailable from this network. No connection value was printed or
committed.

Prisma migration commands now consume `DIRECT_URL`. `prisma.config.ts` permits
`DATABASE_URL` as a fallback only for loopback local-development hosts. The
application runtime remains unchanged and continues to use `DATABASE_URL`.

The five migrations under `prisma/migrations` are retained as legacy SQLite
history only. PostgreSQL deployments use `prisma/migrations-postgres`, and the
following four approved migrations were applied to the previously empty
staging `public` schema, in order:

1. `20260612000000_init`
2. `20260629120000_course_feedback_form_fields`
3. `20260629133000_external_course_launch_tokens`
4. `20260706000000_add_supabase_auth_user_link`
5. `20260720023000_feedback_updated_at_remove_default`

The fifth migration contains only the approved removal of the unintended
database default from `Feedback.updatedAt`. The migration history records all
five as finished, no SQLite or failed
migration is recorded, and no seed ran. Verification found 32 empty application
tables, 15 enums, all 110 expected explicit indexes, 26 expected unique indexes,
and 58 foreign keys. The 35 Supabase-managed tables were unchanged.

The final authoritative Prisma comparison returns an empty migration: there are
no missing or extra schema objects, and `Feedback.updatedAt` has no database
default. Exact PostgreSQL schema alignment is complete.

Local validation after migration: `npx prisma validate`,
`npm run prisma:validate`, `npm run typecheck`, `npm run build`, `npm run lint`,
and `git diff --check` all passed. The existing fallback-course-data build
warning remains backlog and did not fail the build.

Supabase Management API access still does not list the staging project. Auth
Site URL, redirect allowlist, recovery settings, SMTP, and dashboard-level Auth
configuration therefore remain blocked and were not bypassed through SQL.

## Database-dependent checks not completed

The approved file `D:\CSO_Learning_Hub_Secrets\phase1-staging.env` remains outside
the repository. The staging application schema is provisioned and aligned, but
the fictional Auth identities and Auth dashboard configuration are not yet
complete. No value was printed.

The following evidence still requires the writable non-production database,
Supabase Auth project, email delivery, one fictional approved CSO, two fictional
learners, and one fictional administrator/focal-person path:

- confirmation and recovery email delivery plus expired-link timing;
- admin approval, inactive-to-active, suspension, deactivation, and reactivation;
- two identities in one CSO with separate enrollments, progress, attempts, and
  certificates;
- cross-learner and cross-organization negative tests;
- active learner HRBA launch/save/sign-out/sign-in/resume/assessment;
- pending, suspended, deactivated, and inactive-organization direct-launch denial;
- audit-log persistence and admin/focal-person connected route results;
- exact mobile, enlarged-text, contrast, reduced-motion, and full keyboard QA;
- full catalogue, nine overview, feedback, monitoring, certificate, External
  Course Manager, and Vercel preview regression pass.

## Environment requirements and known limitations

- Restore staging project-management access; create fictional test identities
  and an approved fictional CSO; configure allowlisted callback URLs and
  non-production SMTP; then run the connected test matrix.
- Configure `PILOT_ACCESS_CODE(S)` explicitly and use strict invited-email mode
  for controlled pilot invitations.
- The organization model has `INACTIVE`, `ACTIVE`, and `ARCHIVED`, not separate
  pending, returned, rejected, and suspended values. P2D uses current equivalents
  and does not claim finer workflow semantics.
- A rare failure after Supabase creates an Auth identity but before the Hub
  transaction completes still requires support reconciliation; no service-role
  deletion or automatic rollback was introduced.

## Recommended next task

**P2D.1 — complete staging Supabase Auth, redirect, email, and Vercel Preview
configuration, then run connected two-learner, lifecycle, email-recovery,
HRBA-resume, security, responsive, accessibility, and regression verification.**
