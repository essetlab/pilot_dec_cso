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

## Preview registration-mode discrepancy correction — 2026-07-20

The investigation started from clean commit
`71ab7b70b82a86da3286294b06035d256b3f286f` on
`feature/pilot-cso-onboarding-access`. `origin/main` remained at
`4ba0233b5c8e391e37629e982240d44e21961c8d`.

### Root cause and classification

The stable feature Preview initially resolved `Simple access-code mode`.
Vercel metadata showed the three required registration variable names as
encrypted, Preview-only, and scoped to the feature branch, but the deployment
serving the feature alias had been created before those branch variables were
added. It therefore did not contain their runtime snapshot. The existing page
was request-rendered, so Next.js static output was not the primary cause; the
stale Vercel deployment/environment snapshot was.

The code also had two safety gaps: strict mode with a missing invited-email
allowlist did not expose an unavailable state, and the strict label was the
older `Invited-email mode` rather than the approved learner-facing label. The
classification is therefore **F. COMBINED DEFECT**, comprising environment
delivery/stale-deployment behavior plus configuration-dependency and UI
hardening gaps.

Before correction, source-level strict mode did trim and lowercase the mode and
email values and denied an uninvited email when the strict variable reached the
runtime. The deployed feature runtime did not resolve strict mode and therefore
used simple access-code behavior. No real participant data or account was used
to test that state.

### Correction

- `src/lib/pilot-registration-config.ts` is the single resolver for explicit
  simple, strict, and unavailable modes, invited-email normalization, and
  access-code normalization.
- A missing mode retains the documented simple-mode default. Unknown mode
  values, malformed allowlists, and strict mode with no invited email fail
  closed as `Registration temporarily unavailable`; strict mode never silently
  downgrades to simple.
- The registration page and server workflow use the same resolved mode. The
  page is explicitly request-rendered, displays the exact approved label, and
  disables account creation when configuration is unavailable.
- The allowlist is never passed to or rendered by the registration page.
- The connected S4 verifier now covers the invited, uninvited, incorrect-code,
  normalized-input, and incomplete-strict-configuration paths and reliably
  removes its audit, role-assignment, learner, organization, and temporary role
  records.

### Environment and Preview evidence

Vercel listed `PILOT_REGISTRATION_MODE`, `PILOT_INVITED_EMAILS`, and
`PILOT_ACCESS_CODE` as encrypted Preview variables scoped only to
`feature/pilot-cso-onboarding-access`. Values and invited addresses were not
retrieved or printed. Because Vercel does not return encrypted values through
CLI metadata, the exact allowlist count could not be independently read. The
new Preview's strict label proves that the normalized mode is `strict` and that
the server resolver parsed a non-empty, syntactically valid allowlist. The
configured expectation remains at least two entries; no address was exposed.

Correction commit `d231f4bab4267f533bac0b5e4b60d470f7b6bb69` produced Git-connected Preview
deployment `dpl_Fb7w2MuNUJJAi7WhFb2FnmMf1ZEG` at
`https://pilot-dec-b45auugja-esset-lab.vercel.app`. Vercel classified it as
`Preview`, `Ready`, and assigned the stable feature alias. An authenticated
CLI request to the protected alias returned HTTP 200 and the exact label
`Strict invited-email and access-code mode`; neither the simple nor unavailable
label nor the allowlist environment name appeared in the returned page.

### Verification results

| Check | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run verify:p2d-onboarding-access` | Pass |
| `npm run verify:pilot-registration-mode` | Pass |
| `npm run verify:s4-supabase-registration` against approved staging | Pass; fictional verification records cleaned |
| `npm run build` | Pass; existing fallback-course-data warning only |
| `npm run lint` | Pass |
| `npx prisma validate` | Pass |
| `npm run prisma:validate` | Pass |
| `git diff --check` | Pass |

The connected verifier confirmed that a fictional invited email plus the valid
controlled code passed the strict access gates, an uninvited email was denied,
an incorrect code was denied, whitespace/case normalization worked, and an
incomplete strict configuration failed closed. It stopped the accepted path at
a deliberately nonexistent organization, so it did not create another Auth
identity. No secret, invited address, schema change, migration, seed, Project
Management change, Production promotion, or Production environment-variable
change occurred in this correction.

The next action is to continue P2D.1 connected identity testing using the strict
feature Preview and approved fictional staging identities.

## P2D.1 connected email-delivery gate — 2026-07-20

Connected verification resumed from clean, synchronized commit
`663ab98727b5cae9689f5ff1e29c89e603efddaf` on
`feature/pilot-cso-onboarding-access`. `origin/main` remained at
`4ba0233b5c8e391e37629e982240d44e21961c8d`. Preview deployment
`dpl_5q8n8Dve4StRQHxGwGgbQwmeiFh7` was Ready and resolved strict registration
mode. The approved staging connection resolved only to project
`fgyxbzwdvngqlksyxuwa`.

The first isolated Supabase Auth sign-up request was accepted and required
confirmation. The message arrived at the approved fictional test inbox, and
staging Auth recorded confirmation approximately 81 seconds after the request.
The final browser redirect did not reach the Hub callback page because Vercel
deployment protection intercepted the feature Preview URL. The preliminary
Auth identity was removed after this delivery proof so it could not conflict
with the later learner-registration test.

A second confirmation message for the fictional platform-administrator fixture
was accepted and confirmed in approximately 96 seconds. Its confirmed Supabase
identity is linked to one active fictional Hub administrator with one active,
unexpired `PLATFORM_ADMIN` assignment and a null local password hash. Three
non-sensitive audit records cover the administrator bootstrap and the two
fictional organization fixtures.

The reusable staging fixtures retained at this checkpoint are:

- one clearly fictional active CSO;
- one clearly fictional inactive CSO;
- one confirmed fictional platform administrator;
- one active, unexpired platform-administrator role assignment.

No address, password, access code, token, complete confirmation URL, or secret
is recorded here.

The next required focal-person confirmation request was rejected by Supabase
Auth with HTTP `429`; the provider supplied no retry window. This occurred after
the two accepted confirmation messages and is consistent with the hosted/default
mailer limit. No focal-person Auth identity was created. The incomplete Hub
user, staff invitation, and role assignment produced while diagnosing the
failure were removed, and final verification found zero partial focal-person
records.

Per the explicit P2D.1 email-delivery gate, testing stopped at this point. The
following were not claimed or run: Learner A/B registration, negative
registration matrix, session tests, password recovery, lifecycle matrix,
role-authorization matrix, two-learner record separation, HRBA connected tests,
responsive/accessibility matrix, full regression, and the full automated-check
suite. Production, Production variables, Production Supabase, schema,
migrations, seeds, Project Management, and `main` were not changed.

Before resuming, configure dedicated non-production SMTP for staging Supabase
Auth and verify its send quota. Also provide a Preview confirmation/recovery
callback path that is not intercepted by Vercel deployment protection, or an
approved protection-bypass mechanism limited to staging email callbacks. Then
restart P2D.1 from focal-person onboarding and the two invited learner inboxes.

Readiness decision:

`BLOCKED — non-production SMTP configuration required`

## Stage A — open registration and immediate HRBA assignment boundary

### Decision and verified baseline

Stage A separates general Hub account creation from restricted-course access.
The verified starting point was clean commit
`2d78da19c0277293f1f180c9bf0d570c71109dc5` on
`feature/pilot-cso-onboarding-access`, with the branch synchronized to its
upstream. `origin/main` remained
`4ba0233b5c8e391e37629e982240d44e21961c8d`. The approved starting Vercel
deployment was Ready, classified as Preview, and sourced from the starting
feature commit. Production was not changed.

### Open registration and profile boundary

- `/register` now uses the dedicated open-registration workflow. Any new,
  syntactically valid email can register without an invited-email allowlist,
  pilot code, pre-existing approved organization, or course assignment.
- The workflow retains normalization, bounded input, password policy,
  Terms/Privacy consent, per-email rate limiting, safe internal redirects,
  generic duplicate-account handling, Supabase confirmation, null local
  password hashes for Supabase identities, transactional Hub profile creation,
  and non-sensitive audit evidence.
- Full name, email, password, self-reported organization name, role/position,
  and region/location are collected. The organization value is stored only in
  `User.selfReportedOrganizationName`.
- Registration explicitly writes `organizationId = null`. It does not match,
  create, update, or reactivate an `Organization`; it creates no
  `CourseAssignment` and no `Enrollment`.
- General registration no longer consumes `PILOT_REGISTRATION_MODE`,
  `PILOT_INVITED_EMAILS`, `PILOT_ACCESS_CODE`, or
  `PILOT_ACCESS_CODES`. The variables remain transitional Preview
  configuration only. Historical pilot workflow code remains preserved but is
  no longer referenced by the active registration route.
- The learner-facing copy explains that registration is open and that a typed
  organization is profile information, not access to an invitation-only course.

### Migration and staging result

Migration
`20260720070000_open_registration_self_reported_organization` contains one
statement: add nullable text column `selfReportedOrganizationName` to
`User`. Inspection confirmed no table replacement, drop, truncate, delete,
foreign key, data rewrite, legacy SQLite change, or Supabase-managed schema
access.

The migration was applied only to the approved non-production PostgreSQL
database through the privately loaded `DIRECT_URL`. Prisma reports all six
approved PostgreSQL migrations applied and the schema up to date. No broad
seed ran. Existing users, organizations, roles, enrollments, progress,
assessments, feedback, and certificates were retained.

### Session eligibility

An active Hub user with an active, unexpired participant role can now resolve a
session with `organizationId = null`. Global resolution still fails closed
for suspended or deactivated users, missing/inactive/expired roles, and stale
Supabase-cookie conditions. Organization lifecycle is no longer a global
sign-in gate; any organization requirement belongs to a restricted-course
entitlement.

### HRBA visibility and entitlement

The canonical active HRBA record remains bound to its existing slug and external
integration, but its database visibility is now `ASSIGNED_ONLY`. The public
catalogue and overview remain visible through catalogue metadata.

One centralized server-side entitlement function makes HRBA fail closed unless
the current learner has an active `USER` assignment for that exact course.
The check is applied to learner course listing/detail and enrollment
initialization, external launch, external progress ingestion, lesson progress,
final assessment, course feedback, certificate listing/detail/PDF/eligibility,
and public action-state resolution. Organization-wide and cohort-wide
assignments do not satisfy the HRBA rule.

| State or entry point | Unassigned result | Assigned result |
|---|---|---|
| Public overview | Visible; `Invitation required` after sign-in | `Start course` or `Continue course` |
| Learner course detail/enrollment | Denied; no enrollment created | Allowed |
| Direct internal/external launch | Denied | Allowed with existing launch contract |
| Progress callback/save | Denied | Existing ownership/token rules preserved |
| Final assessment | Denied | Existing attempt behavior preserved |
| Course feedback | Denied | Allowed under existing rules |
| Certificate list/detail/PDF | Denied | Existing eligibility rules preserved |

The catalogue state model now represents open availability,
`invitation_required`, `assigned`, and `coming_soon`. No activation page,
dead activation control, invitation table, focal-person workflow, admin
invitation interface, or bulk invitation function was added.

### Connected staging evidence

The connected open-registration verifier created a temporary fictional learner
and proved that the self-reported organization was stored while
`organizationId`, organization creation, assignment, and enrollment remained
absent. The generic duplicate path and consent boundary also passed. Temporary
records were removed.

The staging application data did not contain an approved persistent fictional
learner at this checkpoint. The connected HRBA regression therefore created
test-scoped fictional learners and explicit individual assignments, verified
assigned launch/progress/assessment/certificate behavior plus unassigned
launch denial and absence of enrollment, then cleaned those records. Existing
administrator and organization fixtures were retained. The canonical HRBA
record was prepared with controlled `CAP-ADV` and `CAP-HRSAFE` mappings;
no legacy `CAP-HRBA` capacity-area record was created.

### Automated validation

| Check | Result |
|---|---|
| `npx prisma validate` | Pass |
| `npm run prisma:validate` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass with process-only standard production `NODE_ENV` |
| `npm run lint` | Pass |
| `git diff --check` | Pass |
| `npm run verify:p2d-onboarding-access` | Pass |
| `npm run verify:open-registration` | Pass |
| `npm run verify:stage-a-session` | Pass |
| `npm run verify:hrba-assignment-boundary` | Pass |
| `npm run verify:s4-supabase-registration` | Pass against staging; temporary data cleaned |
| `npm run verify:s5-signin` | Pass |
| `npm run verify:s6-route-roles` | Pass |
| `npm run verify:s7-hrba-supabase-compat` | Pass against staging; assigned and unassigned cases covered and cleaned |

The first build attempt inherited a non-standard `NODE_ENV` from the private
staging file and failed during prerendering. Re-running with
`NODE_ENV=production` for that process only passed. Neither the private file
nor Vercel configuration was changed.

### Preview acceptance and remaining work

The final application acceptance build was Git-connected deployment
`dpl_BFrLzUYcqcfRgRHVjWEFvKk6E8FN`, classified Ready/Preview under
`esset-lab/pilot-dec-cso` and sourced from feature commit
`7251a6f92bced78d6ed075e604bbf4f5971e7b3c`. It received only the feature
branch alias and no Production alias.

Authenticated Preview testing initially found that the feature branch's
encrypted Supabase URL, public key, and runtime database URL did not match the
approved staging file. Equality was compared without displaying values. Those
three branch-scoped Preview values were replaced from the approved staging
file and a Git-connected Preview was rebuilt. Production variables and
deployments were not changed. The resolver also now accepts the approved
legacy anon-key name as a fallback while preferring the newer publishable-key
name. Transitional pilot variables remain configured but unused.

| Preview acceptance | Result |
|---|---|
| Registration at 1440 × 900 | Pass; open copy, required fields, consent, labels, and visible focus styling present |
| Registration at 390 × 844 | Pass; all nine interactive form controls present and no horizontal overflow |
| Public catalogue and HRBA overview | Pass; catalogue visible and HRBA overview retained |
| Authenticated unassigned HRBA state | Pass; `Invitation required`, no launch link |
| Unassigned direct learner launch | Pass; 404 and no enrollment |
| Newly assigned learner | Pass; `Start course` |
| Assigned external launch | Pass; embedded HRBA route opened at 0% and created the learner enrollment |
| Assigned learner with progress | Pass; 40% fixture showed `Continue course` |
| Console | Pass; no error recorded on tested registration, catalogue, overview, or launch paths |
| Responsive overflow | Pass at both required viewports |
| Keyboard/accessibility | Native labelled controls remain in sequential focus order; visible focus ring confirmed |

Two clearly fictional, confirmed staging Auth learners were created solely for
the authenticated Preview matrix. One had an individual `USER` HRBA
assignment and one had no assignment. No organization/cohort assignment was
created. Their enrollment, progress, launch tokens, assignments, Hub profiles,
and Supabase Auth identities were removed after testing.

The public form and callback route render correctly, and the earlier connected
email-delivery checkpoint proved that staging confirmation mail can be issued.
End-to-end confirmation-link arrival was not repeated because dedicated
non-production SMTP remains unavailable. Vercel Deployment Protection may
still intercept external confirmation redirects; that environment limitation
is not classified as a Supabase callback defect.

Stage B remains: a DEC-managed course-invitation model and administration flow,
individual/bulk invitations, invitation delivery and activation, and durable
assigned-learner acceptance fixtures. Dedicated non-production SMTP and a
Preview-protection-safe callback path remain environment limitations.

## Stage B1 — course-invitation lifecycle foundation

Stage B1 adds the secure data and internal server-service foundation for an
administrator to invite one individual to one restricted course. It does not
add an administrator interface, learner activation page, bulk upload, email
delivery, course assignment, enrollment, launch, progress, assessment, or
certificate behavior. The existing `OnboardingInvitation` remains unchanged
and reserved for staff and administrator onboarding.

### Data model and relationships

The dedicated `CourseInvitation` record stores a normalized invited email,
invited name, optional role or position, one approved organization, one course,
optional course version and cohort, hash-only token material, explicit expiry
and lifecycle timestamps, the issuing administrator, and an optional future
activated user. `CourseInvitationStatus` defines `DRAFT`, `PENDING`, `SENT`,
`ACTIVATED`, `EXPIRED`, `CANCELLED`, and `FAILED`.

Organization, course, course-version, cohort, and issuing-user foreign keys use
restrictive deletion behavior so invitation history is not silently removed.
The optional activated-user relation uses `SET NULL`, preserving the invitation
if an ordinary activated-user record is later removed. Indexed relationship,
status, expiry, and normalized-email/course/status fields support lifecycle and
duplicate checks.

### Lifecycle, authorization, and security controls

One centralized server-side workflow provides draft creation, marking sent,
resend preparation, cancellation, failure recording, safe token resolution,
and idempotent expiry. Allowed transitions are centralized and terminal states
cannot be edited or reused. Resend preparation replaces the prior token hash
and expiry before another send attempt. Resolution hashes its input and returns
only minimum invitation context; it neither consumes nor activates the record.
Final single-use consumption belongs to the future atomic activation step.

Tokens use 32 cryptographically random bytes and SHA-256 hashing. Only hashes
are persisted. Plaintext token material is returned once to the internal caller
that creates or prepares an invitation, and is excluded from logs, audit
metadata, tests, and this report. Optional activation-code storage is also
hash-only.

Every management operation re-resolves the current session identity against
the database and requires an `ACTIVE` user with an active, unexpired
`PLATFORM_ADMIN` or `SUPER_ADMIN` role. Client-supplied roles are ignored.
Creation fails closed for inactive or unknown organizations, unknown courses,
course versions that do not belong to the selected course, and unknown
cohorts. It never creates an organization from self-reported profile text.

Simultaneously active invitations for the same normalized email and course are
prevented by supporting indexes plus a check and insert in a serializable
transaction. Serialization conflicts fail as duplicates. Historical
activated, expired, and cancelled invitations remain available for audit, and
a replacement may be created after a terminal state.

Audit actions now cover created, sent, resent, cancelled, activated, expired,
and failed course-invitation events. Audit metadata contains identifiers,
status, and expiry only—not invited addresses, names, plaintext tokens, or
token hashes.

### Migration and connected staging evidence

PostgreSQL migration `20260720090000_course_invitation_lifecycle` adds only the
course-invitation status enum, `CourseInvitation` table, indexes, foreign keys,
and seven audit-enum values. SQL inspection found no table replacement, drop,
truncate, data delete, Supabase-managed schema change, or Production reference.
The migration was applied only to approved staging through the privately loaded
`DIRECT_URL`; no seed ran. Prisma reports all seven repository migrations
applied, the database up to date, and no difference between the staging schema
and the Prisma model.

The connected verifier used temporary fictional users, organizations, a
course, course version, cohort, and invitation records. It proved authorized
creation; denial for learners and inactive, expired, or stale administrator
sessions; organization and course boundaries; email normalization; hash-only
token persistence; active duplicate prevention; safe sent-token resolution;
resend invalidation; cancellation and expiry retention; terminal-state
replacement; transition enforcement; audit creation; and absence of new
organizations, assignments, or enrollments. Fixtures were cleaned afterward.
Stage A application counts remained unchanged: one course, two organizations,
one user, and zero assignments, enrollments, attempts, certificates, and
feedback records.

| Stage B1 validation | Result |
|---|---|
| `npx prisma validate` | Pass |
| `npm run prisma:validate` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass with process-only standard production `NODE_ENV`; existing fallback-course-data warning retained |
| `npm run lint` | Pass |
| `git diff --check` | Pass |
| `npm run verify:open-registration` | Pass |
| `npm run verify:stage-a-session` | Pass |
| `npm run verify:hrba-assignment-boundary` | Pass |
| `npm run verify:course-invitation-lifecycle` | Pass against staging; temporary data cleaned |
| `npm run verify:s5-signin` | Pass |
| `npm run verify:s6-route-roles` | Pass |
| `npm run verify:s7-hrba-supabase-compat` | Pass against staging; temporary data cleaned |

No invitation email was sent and no invitation was activated. No
`CourseAssignment`, `Enrollment`, HRBA launch token, progress, assessment, or
certificate was created by the invitation workflow. Production, `main`,
Supabase Auth, and learner-facing behavior were not changed.

Recommended Stage B2 task: implement atomic invitation activation for a new or
existing Hub account, approved-organization linkage, and one individual
`USER` assignment for exactly the invited course, with replay and duplicate
entitlement protection; keep delivery and administrator UI as separately
reviewable follow-on slices.
