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

## Stage B2 — atomic invitation activation

### Baseline and B1 content check

Stage B2 began from clean, synchronized feature commit
`4c56c8f5236ec9fa47cb37de65f6ab0b6017c08f`; `main` remained
`4ba0233b5c8e391e37629e982240d44e21961c8d`. The accepted B1 commit contains
eight files, not ten. The apparent eight-versus-ten discrepancy came from an
earlier expected-file estimate: the implementation reused the existing token
and audit-label locations and therefore did not require two additional files.
Commit inspection confirmed that no temporary count script, `next-env.d.ts`
change, environment file, generated client, literal test address, or temporary
verification artifact was committed. No B1 formatting-only rewrite was made.

### Architecture and activation transaction

`activateCourseInvitation` is the single authoritative domain operation. A
same-origin JSON POST adapter obtains the authenticated server session and
passes only the raw token and server-derived session to the workflow. The API
does not accept user, organization, course, version, cohort, role, or assignment
scope identifiers. It returns generic unavailable responses and never returns
Prisma errors, stack traces, token hashes, or personal organization data.

The workflow hashes the presented token using the B1 SHA-256 primitive and
performs all eligibility checks again inside one serializable transaction. It
requires an active authenticated user with an active, unexpired participant
role and rejects accounts with active platform- or super-administrator roles,
preventing administrator impersonation. Session role claims are not trusted.
The normalized database and session email must exactly match the invitation.

The transaction revalidates a `SENT`, unexpired invitation; active approved
organization; published, unarchived `ASSIGNED_ONLY` course; required matching
published course version; and any active cohort plus its organization linkage. Cancelled,
expired, failed, draft, pending, already-activated-by-another-user,
cross-course-version, inactive-organization, inactive-cohort, and unpublished
course cases fail closed.

### Approved-CSO and cohort linkage

The existing canonical membership fields remain the only membership system:
`User.organizationId` represents the approved CSO and
`User.primaryCohortId` represents the optional cohort. Activation uses only the
organization and cohort stored on the invitation. It never creates or approves
an organization, never reads self-reported organization text as approval, and
never accepts learner-selected membership input.

A null membership is linked atomically. An existing exact organization/cohort
link is preserved. A conflicting organization or cohort fails with a controlled
integrity result and is not overwritten. No administrator, reviewer, creator,
focal-person, or other elevated role is granted.

### Individual assignment and duplicate safeguards

The existing `CourseAssignment` remains the entitlement model. Stage B2 adds a
nullable `courseVersionId` so an invitation-created `USER` assignment is bound
to the approved version, and `CourseInvitation.courseAssignmentId` records the
assignment used for activation integrity. The assignment has only
`targetUserId`; organization and cohort target fields remain null, preventing
accidental organization-wide or cohort-wide access.

A PostgreSQL unique index on `(courseId, targetUserId)` provides database-level
duplicate protection while PostgreSQL continues to permit multiple
organization/cohort assignments with null user targets. Application logic
resolves one exact, version-matching assignment inside the activation
transaction, may reactivate that exact assignment, and rejects null-version or
different-version conflicts. It does not create an enrollment, progress root,
launch token, assessment, feedback record, or certificate.

Within one process, token-hash-scoped queuing avoids duplicate in-flight work.
Across processes, serializable isolation, the unique index, conditional writes,
and one safe retry resolve serialization, uniqueness, conditional-update, and
indeterminate-commit races without partial state.

### Replay, lifecycle, and audit behavior

The activation transition reuses the centralized B1 transition rules and moves
only `SENT` to terminal `ACTIVATED`, recording the timestamp, activating user,
and assignment reference. The same user replay succeeds only when the approved
organization/cohort link and exact active assignment still exist; it creates no
new membership, assignment, transition, or audit event. Different-user replay
returns the same generic unavailable result as other invalid tokens. Missing or
conflicting replay linkage returns a controlled integrity result and is not
silently repaired.

The one successful `COURSE_INVITATION_ACTIVATED` audit entry records only
internal invitation, organization, course, course-version, assignment, and user
references. Raw tokens, token hashes, email addresses, session material,
headers, IP addresses, and browser data are excluded. Invalid-token probes and
idempotent replays do not generate noisy audit entries.

### Migration and staging result

Migration `20260720100000_course_invitation_activation` adds two nullable
linkage columns, the user/course unique index, supporting indexes, and two
foreign keys. `CourseAssignment.courseVersionId` and
`CourseInvitation.courseAssignmentId` both use `ON DELETE RESTRICT` to prevent
silent removal of version or entitlement evidence from an activated invitation;
key updates cascade. SQL inspection confirmed no table replacement, drop,
truncate, data deletion, Supabase-managed schema access, seed, or Production
reference.

Preflight found zero existing assignment rows and zero duplicate user/course
groups. The migration was applied through approved staging `DIRECT_URL` only.
Prisma reports eight migrations applied, the database current, and no schema
difference. Before and after connected verification, staging retained one
existing user, two organizations, and zero course assignments, enrollments, or
course invitations.

### Verification matrix

| Stage B2 case | Result |
|---|---|
| Matching active learner, approved CSO, published course/version, active cohort | Pass; membership, one version-bound assignment, terminal activation, and one audit created atomically |
| Same-user replay | Pass; idempotent result, no duplicate writes or audit |
| Different-user or email mismatch | Pass; generic denial with no identity disclosure |
| Expired or cancelled invitation | Pass; denied with no partial state |
| Inactive learner or administrator impersonation | Pass; denied |
| Cross-course version, inactive organization/cohort, unpublished course | Pass; denied with no partial state |
| Existing exact entitlement | Pass; reused and linked to the invitation |
| Conflicting organization or assignment version | Pass; preserved and rejected without overwrite |
| Two near-simultaneous activation calls | Pass; one activation, one idempotent replay, one assignment, one audit |
| Fixture cleanup | Pass; all fictional users, organizations, cohorts, courses, versions, roles, invitations, assignments, and audits removed |

| Automated check | Result |
|---|---|
| `npx prisma validate` | Pass |
| `npm run prisma:validate` | Pass |
| `npx prisma generate` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; final run completed without warnings |
| `npm run lint` | Pass after removing the verifier's unused-variable warning |
| `git diff --check` | Pass |
| `npm run verify:p2d-onboarding-access` | Pass |
| `npm run verify:open-registration` | Pass |
| `npm run verify:stage-a-session` | Pass |
| `npm run verify:hrba-assignment-boundary` | Pass |
| `npm run verify:s5-signin` | Pass |
| `npm run verify:s6-route-roles` | Pass |
| `npm run verify:s7-hrba-supabase-compat` | Pass against staging; fixtures cleaned |
| `npm run verify:course-invitation-lifecycle` | Pass against staging; fixtures cleaned |
| `npm run verify:course-invitation-activation` | Pass against staging; fixtures cleaned |

An earlier build repeat encountered the already documented fallback-course-data
`P1001` warning during a transient staging read. The final build connected
successfully and emitted no warning. No new build warning was introduced.

### Files and remaining boundary

Stage B2 changes are limited to the Prisma model and one forward migration, the
existing invitation workflow, one same-origin API adapter, one deterministic
connected verifier and package script, and this evidence report. The containing
implementation commit and its Git-connected Preview identifiers are recorded in
the final handoff because both are generated only after this report is committed
and pushed.

Stage B2 does not add the administrator invitation interface, bulk upload,
outbound email, a polished learner acceptance page, invitation delivery status,
or Production configuration. Recommended next stage: Stage B3, a separately
reviewed administrator invitation-management and delivery workflow, without
changing the atomic activation contract.

## Stage B3 — administrator-controlled course invitation management and safe delivery

### Baseline, scope, and recovery check

Stage B3 resumed from accepted B2 commit
`f4e5c506b6a9a3555943322961cb6692a5ed4d36` on
`feature/pilot-cso-onboarding-access`. `main` and `origin/main` remained at
`4ba0233b5c8e391e37629e982240d44e21961c8d`. The separate legacy worktree was
inspected and remained clean and unchanged. Transient environment and Vercel
metadata from earlier connected work were absent; generated `next-env.d.ts`
line-ending/stat churn was restored to the baseline blob and is not part of
this checkpoint.

The slice adds controlled single-recipient invitation administration and the
learner acceptance surface only. It does not add bulk onboarding, SMTP,
reminders, participant-management expansion, assignment revocation, or any
Stage B4 capability.

### Administrator experience and authorization

`/admin/course-invitations` is a basic-admin navigation entry with a bounded
list, email search, lifecycle-status, organization, course, and created-date
filters. The list and detail use seven explicit lifecycle states: Draft,
Delivery pending, Sent, Activated, Expired, Cancelled, and Delivery failed.
Detail pages show the validated learner, approved organization, exact course
and version, optional cohort, lifecycle timestamps, activation result, and
non-sensitive audit history.

Creation uses controlled selectors populated from current database records. It
requires an active approved organization, published and unarchived
`ASSIGNED_ONLY` course, matching published version, and any selected active
cohort linked to that organization. Existing active learner identities are
rechecked for status, role, organization, and conflicting entitlement. The
B1/B2 duplicate, version, organization, cohort, and exact-assignment boundaries
remain authoritative.

Every list, option, detail, create, replacement-link, mark-sent, and cancel
operation re-resolves the actor in the database. Only an active user with an
active, unexpired `PLATFORM_ADMIN` or `SUPER_ADMIN` assignment is accepted.
Ordinary learners are redirected to the existing safe unauthorized page and
client role claims are never trusted.

### Safe delivery and lifecycle semantics

Approved staging has no configured SMTP delivery variables, so Stage B3 uses
manual secure delivery only and does not pretend that email was sent. The
workflow deliberately distinguishes these events:

1. **Invitation created** — a validated draft record and creation audit exist;
   no learner access exists.
2. **Secure link prepared** — a new random token hash and expiry are persisted;
   the plaintext link is returned only to the immediate action result. The
   previous unused token is invalidated on replacement.
3. **Manually delivered and marked sent** — an administrator explicitly
   confirms delivery, moving the invitation to `SENT` and recording a separate
   non-sensitive audit event. Preparing or copying a link does not mark it sent.
4. **Invitation activated** — the authenticated matching learner explicitly
   accepts through the B2 atomic activation endpoint, moving the invitation to
   terminal `ACTIVATED`.
5. **Exact course assigned** — the activation transaction creates or reuses one
   individual `USER` assignment for only the invited published course version;
   it does not create organization-wide, cohort-wide, or unrelated course
   access.

The raw URL appears only in immediate React action state. Dismissal, navigation,
or reload removes it; it is not recoverable from the database, list, detail,
audit log, verifier output, or this report. Replacement preparation rotates the
hash and invalidates the prior link. Cancellation terminates an unused link and
adds lifecycle evidence. A small per-administrator rate boundary covers create
and replacement operations. Trusted link origins come only from configured
application URLs, require HTTPS outside loopback development, and reject
untrusted request-derived hosts.

### Learner acceptance and security controls

`/course-invitations/accept` is a reusable public-shell page with a read-only
GET preview and an explicit acceptance action through the existing same-origin
POST endpoint. Unauthenticated visitors are sent to sign-in with a safe internal
return path. A signed-in account with the wrong email receives a generic account
mismatch response and no invitation scope. The matching participant sees only
the invited course, approved CSO, expiry, and the fact that acceptance creates
one individual assignment. Success links to that exact learner course route;
same-user replay remains idempotent.

Acceptance responses and page metadata do not expose Prisma errors, stack
traces, token hashes, other identities, or broader organization data. The route
is `noindex`, `no-store`, private, and uses a no-referrer policy. The sign-out
route now preserves only safe internal return paths, enabling an identity
switch without accepting an external redirect.

### Connected verification and browser evidence

The connected B3 verifier created only test-scoped fictional staging records
and proved active/expired/inactive administrator authorization, controlled
selector eligibility, every required creation denial, duplicate concurrency,
hash-only persistence, explicit mark-sent behavior, B2 activation and replay,
exact assignment linkage, old-token invalidation, replacement preparation,
cancellation, stale-scope denial, assigned-after-send denial, terminal states,
audit contents, and source-level token/privacy assertions. Its `finally`
cleanup removed all fixtures.

Staging-backed browser QA then covered desktop administration and a 390 × 844
mobile viewport: list, filters, create form, controlled selectors, immediate
manual-link panel, explicit delivery confirmation, lifecycle detail/history,
replacement-link display, cancellation, learner mismatch, sign-out/return,
matching learner acceptance, same invitation success state, exact course route,
and ordinary-learner admin denial. Both tested mobile pages had no horizontal
overflow. A fresh browser tab verified landing, catalogue, canonical HRBA
overview, and sign-in with no console error and no public creator, RDF, Build
Studio, reviewer, monitoring, or community link.

This live pass found and corrected two runtime-only defects before closure: a
plain initial-state object exported from a `use server` module, and detail-page
revalidation that unmounted the one-time replacement-link result. The state now
lives in the client component, and replacement preparation preserves its
immediate one-time result while subsequent explicit actions refresh lifecycle
data.

All Stage B3 browser-QA users, organization, cohort, course, version,
assignments, invitations, and audits were removed from staging. A post-cleanup
count returned zero for every Stage B3 fixture category. The temporary fixture
script, local runner, logs, and other temporary artifacts were deleted. No
plaintext invitation token, link, fictional address, environment file, Vercel
metadata, generated output, or temporary QA artifact is included in the final
diff.

### Schema and validation result

Stage B3 requires no Prisma schema change and adds no migration. Staging remains
at the eight previously approved migrations. `prisma migrate status` reports
the schema current and `prisma migrate diff` reports no difference. No migration,
seed, broad demo-data load, or Production database operation ran in this slice.

| Stage B3 validation | Result |
|---|---|
| `npx prisma validate` | Pass |
| `npm run prisma:validate` | Pass |
| `npx prisma generate` | Pass |
| `npm run typecheck` | Pass |
| production-mode `npm run build` | Pass |
| `npm run lint` | Pass |
| `git diff --check` | Pass |
| `npm run verify:p2d-onboarding-access` | Pass |
| `npm run verify:open-registration` | Pass |
| `npm run verify:stage-a-session` | Pass |
| `npm run verify:hrba-assignment-boundary` | Pass |
| `npm run verify:s5-signin` | Pass |
| `npm run verify:s6-route-roles` | Pass |
| `npm run verify:s7-hrba-supabase-compat` | Pass against staging; fixtures cleaned |
| `npm run verify:course-invitation-lifecycle` | Pass against staging; fixtures cleaned |
| `npm run verify:course-invitation-activation` | Pass against staging; fixtures cleaned |
| `npm run verify:course-invitation-management` | Pass against staging; fixtures cleaned |

The final implementation adds the admin and learner components/routes,
centralized admin workflow and actions, a focused connected verifier and package
script, route labels, safe sign-out return handling, acceptance-route response
headers, and minimal Prisma error formatting so generic handled failures do not
emit verbose database context. Existing B1/B2 source is extended narrowly; no
preserved feature or historical record is deleted.

The Stage B3 commit hash and Git-connected Vercel Preview identifiers are
generated after this report is committed and pushed and are therefore recorded
in the final handoff. The Preview must be classified as Preview, sourced from
this feature branch, use Preview variables only, and receive no Production
alias. `main`, Production variables, Production data, and Production deployments
remain unchanged.

Recommended next step after deliberate review: plan Stage B4 separately. Do not
begin bulk onboarding, automated delivery, reminders, expanded participant
management, or assignment revocation as part of this checkpoint.
