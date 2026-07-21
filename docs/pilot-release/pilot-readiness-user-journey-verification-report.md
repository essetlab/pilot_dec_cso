# Pilot Readiness — User Journey Verification Report

Date: 21 July 2026

Authoritative branch: `feature/pilot-registration-integration-checkpoint`

Accepted baseline: `1cb51321cfc5f094a81812fc3f1630941b5aebc6`

Application test commit: `d2d0f48f40d935225c6f62fc94369ace15ae2bf0`

Production baseline (`main`): `4ba0233b5c8e391e37629e982240d44e21961c8d`

## Readiness decision

**READY FOR CONSULTANT HUMAN USABILITY REVIEW.**

All reproducible Critical and High application defects found in this checkpoint were corrected and retested. The non-production Supabase project reached its transactional email-send limit during browser testing, so a newly submitted registration could not receive another verification email during the same test window. This was independently confirmed as a Supabase HTTP 429 rate-limit response, not an application failure. Consultant review should begin after the email quota window is available.

## Preview under test

- Vercel project/scope: `esset-lab/pilot-dec-cso`
- Deployment ID: `dpl_DwSXJ9xQA8mGgosLbazqBzYuZRDU`
- Direct Preview URL: `https://pilot-dec-laaqn6ee1-esset-lab.vercel.app`
- Stable branch Preview URL: `https://pilot-dec-cso-git-feature-pilot-registration-i-c9da4c-esset-lab.vercel.app`
- Environment: Preview; Ready
- Git source: `feature/pilot-registration-integration-checkpoint` at `d2d0f48f40d935225c6f62fc94369ace15ae2bf0`
- GitHub Vercel status: success for the exact source commit
- Production alias: none on this deployment

The branch URL was used for authenticated journeys because the application URL and session cookies are intentionally host-scoped to that Preview branch.

## Delivered pilot-readiness scope

### Structured administrator invitation form

- Active organization selection is searchable; arbitrary organization IDs are not accepted.
- Ethiopia region uses one reusable controlled list and is checked against the selected organization on the server.
- Learner email uses an email input plus normalized server validation.
- Course options come from published, assigned-only database courses.
- Version options depend on the selected course.
- Cohort is optional and constrained to the selected organization where applicable.
- Expiry is a controlled date.
- Delivery is a controlled prepare-link / manually-confirm-delivery workflow.
- The required “Before creating an invitation” helper panel and field guidance are visible.
- Missing reference data guidance uses “listed”, “published”, and “designated”; no invented approval process is described.

### Registration and profile data

- Open registration uses validated full name, normalized email, password confirmation, controlled region, controlled role/function with Other, preferred language, and consent.
- Invited registration derives email, organization, region, course, version, and cohort from the invitation. Client input cannot replace those values.
- No unnecessary phone or additional personal-data field was added.

### Open demonstration course

`Welcome to the CSO Learning Hub` is a published public reference course available to verified self-registered learners. It contains one module and four short pages:

1. Welcome — safe learner-name greeting, registration confirmation, and profile/email summary.
2. How the Learning Hub Works — courses, progress, assessments, certificates, and support.
3. Try a Short Activity — accessible knowledge check with immediate feedback.
4. You Completed the Demo — saved progress, dashboard return, and catalogue exploration.

The course has no final assessment and no certificate. Dashboard and player copy now reflect that accurately. Restricted HRBA access remains assignment-controlled for an open learner.

## Journey evidence

The `Screenshot` column records the evidence-capture outcome. The in-app browser repeatedly timed out in the underlying `Page.captureScreenshot` command on desktop and mobile. No screenshot is claimed or committed. URL, accessible DOM, field state, redirects, console output, database assertions, and connected verifier results were retained instead. This is an evidence-tool limitation, not an application rendering failure.

### Journey A — DEC administrator

| Role | Start | Action | Expected | Actual evidence | Screenshot | Result / correction |
|---|---|---|---|---|---|---|
| Platform Admin | `/sign-in` | Sign in | Admin starting point | Admin navigation and invitation manager reached | Capture timed out | Pass |
| Platform Admin | `/admin/course-invitations/new` | Inspect form | Helper panel and controlled inputs | Required panel, organization search, region, course, dependent version, optional cohort, expiry, and email input present | Capture timed out | Pass |
| Platform Admin | New invitation | Enter invalid email / omit required data | Browser and server reject | Email type validation and required-field validation blocked submission | Capture timed out | Pass |
| Platform Admin | New invitation | Select organization/course/version and create | Draft invitation and one-time link | Exact HRBA version invitation created; raw token not stored | Capture timed out | Pass |
| Platform Admin | Invitation detail | Prepare link, manually deliver, mark sent | Status and history update | Secure link prepared; manual-delivery confirmation changed status to Sent | Capture timed out | Pass |
| Platform Admin | Invitation detail | Replace/cancel/check activated record | Safe lifecycle | B3 verifies replacement invalidation, cancellation, activated state, audit history, and no raw-token persistence | Not applicable to automated branches | Pass |
| Learner | `/admin/course-invitations` | Direct access | Denied | Redirected to `/unauthorized` when signed in as learner; unauthenticated final Preview redirects to sign-in | Capture timed out | Pass |

### Journey B — invited CSO learner

| Role | Start | Action | Expected | Actual evidence | Screenshot | Result / correction |
|---|---|---|---|---|---|---|
| Invited learner | Secure acceptance link | Open as matching account | Explicit invitation context | Invitation showed selected CSO and exact HRBA version | Capture timed out | Pass |
| Invited learner | Acceptance | Accept | Atomic linkage and assignment | Selected CSO linkage and exact individual HRBA assignment created atomically | Capture timed out | Pass |
| Invited learner | Accepted link | Replay | No second assignment | “Invitation already accepted”; B2/B3 confirm one assignment and one activation audit | Capture timed out | Pass |
| Wrong learner | Acceptance | Use different signed-in email | Reject without disclosure | B2/B3 wrong-email assertion passes | Not applicable to automated branch | Pass |
| Invited learner | Restricted course | Open with assignment | Launch allowed | HRBA start link available and connected S7 launch succeeds | Capture timed out | Pass |
| Unassigned learner | Restricted course | Direct URL | Block | HRBA boundary verifier passes; open browser learner did not receive HRBA | Capture timed out | Pass |
| Lifecycle cases | Acceptance | Replacement, cancellation, expiry, replay | Old/unavailable links fail closed | B1–B3 assertions pass | Not applicable to automated branches | Pass |

Existing matching-learner activation, new-learner activation, CSO linkage, exact assignment, wrong-account rejection, replacement invalidation, cancellation, expiry, replay, and direct access boundaries are covered by the connected B1–B3 and HRBA boundary suites. Verification-email delivery was exercised until the staging email quota returned HTTP 429; no application code bypass was introduced.

### Journey C — self-registered open-course learner

| Role | Start | Action | Expected | Actual evidence | Screenshot | Result / correction |
|---|---|---|---|---|---|---|
| Visitor | `/register` | Inspect and validate form | Structured registration | Full name, email, password/confirm, region, role/Other, language, consent all present and server-validated | Capture timed out | Pass |
| Visitor | `/register` | Submit confirmable address | Verification message | Application submitted correctly; staging Supabase returned documented email-rate HTTP 429 | Capture timed out | Environment-limited |
| Verified open learner | `/sign-in` | Sign in | Personalized dashboard | Learner name shown; demo visible; restricted HRBA absent | Capture timed out | Pass |
| Open learner | Demo player | Complete four pages and activity | Immediate feedback and saved progress | 25/50/75/100 percent states observed; correct-answer feedback immediate | Capture timed out | Pass |
| Open learner | Sign out / sign in | Return | Progress restored | Demo returned at 100 percent and completion remained recorded | Capture timed out | Pass |
| Open learner | Dashboard/player | Review completion path | No false test/certificate action | “No certificate required”, “Continue orientation”, and no final-test action | Capture timed out | Pass after correction |

A temporary, administrator-confirmed fictional Auth account was used only after Supabase rate limiting prevented another verification message. This preserved the application’s verification requirement while allowing player and persistence QA. It was deleted during cleanup.

### Journey D — password recovery

| Role | Start | Action | Expected | Actual evidence | Screenshot | Result / correction |
|---|---|---|---|---|---|---|
| Visitor | `/forgot-password` | Submit known and unknown emails | Same response | Both returned the same non-disclosing response | Capture timed out | Pass |
| Recovering learner | `/reset-password` | Malformed/expired/replayed input | Fail closed | Invalid recovery UI shown; verifier confirms malformed, expired-style, and replay protection | Capture timed out | Pass |
| Recovering learner | Recovery flow | Mismatch, update, old password, retry | Mismatch blocked; new works; old/replay fail | Auth recovery verifier confirms PKCE flow, fragment removal, mismatch/repeat prevention, credential update, and old-token rejection | Not applicable to automated branches | Pass |
| Recovering learner | After update | Inspect learner data | Preserve access/progress | Verifier confirms no assignment or progress mutation during credential update | Not applicable to automated branch | Pass |

End-to-end delivery of another recovery email was constrained by the same staging Supabase email quota. Token-handling and credential-update behavior were verified without documenting a recovery token.

### Journey E — completion identity

| Role | Start | Action | Expected | Actual evidence | Screenshot | Result / correction |
|---|---|---|---|---|---|---|
| Invited learner | HRBA launch | Save progress and attempts | Same learner owns records | Connected S7 records both failed and passed attempts for the linked learner and validates launch-token identity | Not applicable to connected verifier | Pass |
| Invited learner | Certificate result | Inspect record/code | Name, record, and verification code align | S7 generated and resolved one certificate code for the same learner/account boundary | Not applicable to connected verifier | Pass |

No real participant, real organization, or Production record was used.

## Desktop, mobile, navigation, and console

- Desktop public home, catalogue, HRBA overview, registration, sign-in, and forgot-password routes loaded without application errors.
- Mobile 390 × 844 checks on home, catalogue, registration, demo, and learner dashboard showed no horizontal overflow.
- Public link inspection found no creator, RDF, Build Studio, reviewer, monitoring, or community navigation entry.
- Unauthenticated `/admin/course-invitations` and `/learn/courses/welcome-to-cso-learning-hub` redirected to sign-in with a safe `next` path.
- Learner access to admin routes was denied.
- Final Preview browser console contained no error or warning entry during the smoke routes.
- Screenshot capture failed at the browser CDP layer on repeated desktop and mobile attempts; no screenshot or generated browser-response file is committed.

## Security and failure-path matrix

| Control | Evidence | Result |
|---|---|---|
| Raw invitation token storage | B1–B3 inspect stored invitation/audit records; UI excludes token hash | Pass |
| One-time and replay protection | B2/B3 activation and replay assertions | Pass |
| Wrong-email rejection | B2/B3 | Pass |
| Concurrent duplicate invitation | Advisory lock plus bounded serializable-transaction retry; B3 retest | Pass |
| Replacement/cancellation/expiry | B3 | Pass |
| Learner/admin boundary | S6 plus browser redirect/denial | Pass |
| Open/restricted-course boundary | HRBA assignment boundary, P2D, browser learner view | Pass |
| Callback origin/token/session integrity | S7 | Pass |
| Password recovery non-disclosure | Browser known/unknown responses plus auth verifier | Pass |
| Recovery malformed/expired/replay | Auth recovery verifier and browser malformed route | Pass |
| Progress/assignment preservation after password reset | Auth recovery verifier | Pass |
| Secret/token evidence hygiene | Final Git review and ignore checks | Pass |

## Issue log

| Severity | Finding | Correction | Retest |
|---|---|---|---|
| High | A concurrent second invitation transaction could surface `unavailable` after a serializable transaction abort instead of the duplicate result. | Kept the transaction atomic and added three bounded retries only for unexpected transient failures; the next snapshot sees the committed duplicate. | B3 passed, including duplicate count/audit and final cleanup. |
| High | The demo completion dashboard/player could inherit final-assessment/certificate language intended for full courses. | Demo-aware summary, certificate, next-step, and completion copy; no assessment/certificate action for courses without those requirements. | Browser dashboard/player and readiness verifier passed. |
| Medium | B3 verification still asserted an older internal delivery label. | Updated the assertion to the plain-language secure-link guidance shown to administrators. | B3 passed. |
| Environment | Supabase staging email provider returned `email_address_invalid` for reserved example domains and later `over_email_send_rate_limit` (HTTP 429) for confirmable addresses. | Used a temporary confirmed fictional account solely for post-verification browser QA; did not weaken application verification. | Open learner course/progress journey passed; all fixtures deleted. |
| Low / evidence | In-app browser `Page.captureScreenshot` timed out repeatedly. | Retained accessible DOM, routes, redirects, viewport measurements, logs, and connected verifier evidence; documented the limitation. | No screenshot claimed. |
| Deferred test maintenance | The optional legacy `verify:learner-course-player` assumes an arbitrary database fixture enters the centralized nine-course public catalogue. That conflicts with the P2B catalogue source-of-truth contract and is not in this checkpoint’s required suite. | No product behavior changed. Its leftover fixture was deleted. | The required verification suite passes. |

## Validation results

| Check | Result |
|---|---|
| `npx prisma validate` | Pass |
| `npm run prisma:generate` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; existing fallback-course-data warning when the local build has no staging env |
| `npm run lint` | Pass |
| `git diff --check` | Pass |
| `npx prisma migrate status` | Pass — exactly 8 migrations, database up to date |
| `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code` | Pass — no difference |
| P2D onboarding/access | Pass |
| Open registration | Pass |
| Stage A session | Pass |
| HRBA assignment boundary | Pass |
| S5 sign-in | Pass |
| S6 route/roles | Pass |
| S7 HRBA/Supabase compatibility | Pass |
| B1 invitation lifecycle | Pass |
| B2 atomic activation | Pass |
| B3 administrator management | Pass after the documented connected retry and concurrency correction |
| Auth recovery | Pass |
| Pilot readiness | Pass |

The first post-wording B3 run exposed the serializable concurrency abort as `unavailable`; a retry through the stable staging connection reproduced it in the duplicate case, proving it was an application reliability issue rather than permitting an infrastructure label. The bounded-retry correction then passed B3.

## Staging reference data and cleanup

- The idempotent configurator retains the 15 controlled region reference values.
- It verifies/imports the controlled `CapacityArea.csv` taxonomy and the exact nine-course catalogue identities without migrations or seeds.
- HRBA remains the existing record; no duplicate HRBA course was created.
- The other catalogue records are metadata/reference records and are not made launchable.
- The one open demo course remains intentional pilot reference configuration.
- Cleanup audit after browser and verifier QA: QA users `0`, QA organizations `0`, QA invitations `0`, legacy verifier courses `0`, intended demo courses `1`.
- Browser QA Auth users, database users, organization, invitations, assignments, enrollments, progress, assessments, certificates, and temporary verifier data were deleted.
- No migration or seed was run in this checkpoint.

## Files changed from the accepted baseline

- `package.json`
- `scripts/configure-pilot-readiness-reference-data.ts`
- `scripts/verify-course-invitation-management.ts`
- `scripts/verify-open-registration.ts`
- `scripts/verify-pilot-readiness.ts`
- `scripts/verify-s4-supabase-registration.ts`
- `src/app/(auth)/register/actions.ts`
- `src/app/(auth)/register/page.tsx`
- `src/components/admin/AdminCourseInvitations.tsx`
- `src/components/admin/CourseInvitationActions.tsx`
- `src/components/learner/LearnerCoursePlayer.tsx`
- `src/components/learner/LearnerDashboard.tsx`
- `src/components/public/CourseInvitationAcceptance.tsx`
- `src/lib/admin-course-invitation-actions.ts`
- `src/lib/admin-course-invitation-workflow.ts`
- `src/lib/catalogue-course-identities.ts`
- `src/lib/controlled-options.ts`
- `src/lib/course-data.ts`
- `src/lib/course-invitation-workflow.ts`
- `src/lib/course-types.ts`
- `src/lib/open-registration-workflow.ts`
- `src/lib/public-course-catalogue.ts`
- `docs/pilot-release/pilot-readiness-user-journey-verification-report.md`

Implementation commits before this report:

- `7ce8811` — Prepare structured pilot forms and open demo course
- `547aac8` — Correct demo course completion messaging
- `d2d0f48` — Harden invitation and demo behavior

## Integrity and release boundaries

- `next-env.d.ts` changed only as Next.js generated build churn and was restored after each build. It is not part of the implementation commits or this report change.
- `.env.local`, `.vercel/*`, staging environment files, temporary fixture scripts, local runners, raw tokens, credentials, logs, browser-response files, Prisma generated output, and build output are absent from the commits.
- Vercel environment listing contains encrypted Preview variables only; no Production variable was added or changed.
- The latest Production deployments predate this checkpoint; no deployment was promoted and no Production alias was assigned to the test deployment.
- `main` remains unchanged at `4ba0233b5c8e391e37629e982240d44e21961c8d`.
- Stage B4, SMTP campaigns, bulk onboarding, reminders, advanced participant management, and Production deployment were not started.

## Safe consultant handoff

No fictional credential is committed or left active. A consultant should receive a newly provisioned short-lived account through a private channel after the Supabase email-send quota is available. The stable branch URL above is the review URL.
