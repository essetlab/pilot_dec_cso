# MVP Slice 7 Final Pilot Acceptance QA Report

## 1. Summary verdict

Final QA found that the Hub application code passes automated checks and the tokenized external-course launch path works on a fresh current-code server. Public, learner, certificate, feedback, and pilot-monitoring routes are broadly functional.

However, pilot readiness is blocked by integration/deployment evidence: the Hub local environment is configured to launch the deployed HRBA app at `https://pilot-hrba-e-learn-v1-wajj.vercel.app`, and fetched deployed assets did not show the new `launchToken` parser even though the local HRBA repo does. The current browser dev server on port 3000 also appeared stale and returned a false 500 for the external route until QA was rerun against the current production build on port 3100.

Final decision: **Not pilot-ready — blocker remains**

## 2. Environment and commit status

- Hub repo: `D:\z CDP-Lg-Andy-main-main`
- Branch: `cso-learning-hub-mvp`
- Starting status: clean
- Starting commit: `2c23ac3 Fix external course launch internal ID exposure`
- PostgreSQL container: `cso-learning-hub-postgres`
- PostgreSQL reachability: `TcpTestSucceeded: True`
- Prisma migration status: database schema up to date
- Hub configured app URL: `http://localhost:3000`
- Hub configured HRBA external course URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Current-code QA server used for route verification: `http://localhost:3100` via `npm run start -- -p 3100`

## 3. Automated checks

Hub repo:

- `npm run lint` — passed
- `npm run build` — passed
- `npm run prisma:validate` — passed
- `npm run verify:hrba-external-course` — passed
- `npm run verify:r17` — passed

HRBA repo:

- `npm run lint` — passed with existing warnings only
- `npm run build` — passed

The Hub verifier confirmed tokenized launch behavior, invalid-token rejection, token/session mismatch rejection, failed assessment behavior, passing assessment certificate issuance, public certificate verification, and learner certificate PDF data availability.

## 4. Public visitor flow

Verified routes on current-code server:

- `/` — 200, loaded
- `/courses` — 200, loaded
- `/courses/human-rights-based-approach-practice` — 200, loaded
- `/verify-certificate` — 200, loaded
- `/register` — 200, loaded
- `/sign-in` — 200, loaded

Public navigation did not expose Pilot Monitoring. Public registration/sign-in surfaces did not expose admin, creator, reviewer, M&E, platform admin, or super admin sign-up options.

Certificate verification:

- Valid issued certificate code returned an issued/verified state.
- Invalid code `NOT-A-REAL-CERTIFICATE` returned a not-found state.
- Public verification did not expose email-like strings.

## 5. Pilot learner registration flow

Registration form options:

- Participant
- CSO focal person

No public role options appeared for Course creator, Programme support, Platform admin, Super admin, Course reviewer, or M&E viewer.

Workflow verification:

- Valid access code `HRBA-PILOT-2026` created an active learner account.
- Created public learner account received only the `PARTICIPANT` role.
- Duplicate email returned `duplicate-email`.
- Invalid access code returned `invalid-access-code`.

Browser form verification also confirmed the duplicate-email and invalid-access-code error states render clearly.

## 6. Learner dashboard/profile/settings flow

Verified with a signed participant session:

- `/learn` — 200, loaded; greeted learner by name and showed clear course/certificate actions
- `/learn/profile` — 200, loaded
- `/learn/settings` — 200, loaded
- `/learn/my-courses` — 200, loaded
- `/learn/certificates` — 200, loaded; showed certificate actions

Visible learner UI did not show raw enum values such as `COMPLETED`, `IN_PROGRESS`, or `NOT_STARTED`.

## 7. HRBA external course iframe and launch-token privacy flow

Hub current-code route verification:

- `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external` — 200 on `http://localhost:3100`
- iframe present
- iframe URL included `embed=portal`
- iframe URL included `launchToken`
- iframe URL did not include `userId`
- iframe URL did not include `enrollmentId`
- iframe URL did not include `courseVersionId`
- external route HTML scan did not find raw Hub ID signals

Integration blocker:

- Hub `.env` points to the deployed Vercel HRBA app.
- The local HRBA repo contains the new `launchToken` parser and postMessage payload code.
- Fetching the configured deployed iframe app returned 200, but checked deployed assets did not contain `launchToken`.
- This indicates the deployed HRBA app likely has not been updated for the token contract used by the Hub.

Because the pilot will use the configured external course URL, browser E2E should be repeated after deploying the HRBA token update or after temporarily pointing local Hub `.env` to a local HRBA dev server for local-only E2E.

## 8. Final assessment and certificate flow

Verified by `npm run verify:hrba-external-course`:

- Partial progress with valid launch token works.
- Partial progress does not issue a certificate.
- Failed assessment records a failed attempt and does not issue a certificate.
- Passing assessment records completion and issues one certificate.
- Repeated passing callback does not duplicate the certificate.
- Invalid token is rejected.
- Token/session mismatch is rejected.
- Public verification remains available.
- Learner certificate PDF data remains available.

Live route verification:

- `/learn/certificates` — 200 for participant
- certificate page showed Verify/Download actions
- certificate PDF download returned `application/pdf`
- PDF bytes began with `%PDF`
- another signed-in learner received 404 when requesting someone else’s certificate PDF

## 9. Course feedback flow

Verified by `npm run verify:r17`:

- completed participant can access feedback form
- invalid rating is rejected
- valid feedback is saved
- existing feedback is loaded
- feedback can be updated without duplicate records
- not-enrolled/incomplete learner is locked out of submission
- admin/M&E summaries protect comments appropriately

Live route verification:

- enrolled learner feedback route returned 200
- signed-out user redirected to sign-in
- not-enrolled learner saw a blocked/locked state
- feedback page included safe feedback guidance
- feedback was not required for certificate download

Visible feedback text did not expose internal IDs. Raw HTML/RSC payload did contain internal identifiers such as course-version and record IDs; this should be reviewed if the acceptance bar includes page source, not only rendered learner UI.

## 10. Pilot monitoring flow

Verified with signed admin session:

- `/admin/pilot-monitoring` — 200
- summary cards loaded
- course summary content loaded
- certificate panel loaded
- final assessment panel loaded
- feedback panel loaded
- monitoring output remained aggregate-only in the route scan

Access control:

- participant request redirected to `/unauthorized?from=%2Fadmin%2Fpilot-monitoring`
- signed-out request redirected to `/sign-in?next=%2Fadmin%2Fpilot-monitoring`
- public navigation did not expose Pilot Monitoring

## 11. Privacy and access-control checks

Passed:

- public pages did not expose monitoring links
- public registration did not expose staff/admin role options
- external iframe URL did not expose raw Hub IDs
- certificate public verification did not expose learner email strings
- another learner could not download someone else’s certificate PDF
- monitoring remained aggregate-only
- learner visible UI did not expose raw enum values or obvious raw IDs

Needs review:

- Raw HTML/RSC payload for the feedback route contained internal IDs even though visible text did not.
- The configured deployed HRBA app likely does not yet use the launch-token contract.

## 12. Issues found

1. **Blocker: configured deployed HRBA app likely not updated for launchToken.**  
   The Hub launches the Vercel HRBA app, but fetched deployed assets did not include `launchToken`. Local HRBA source does include the update. Deploy the HRBA app token-context update or point local Hub to the local HRBA dev server for a final E2E run.

2. **Operational issue: existing dev server on port 3000 appeared stale.**  
   The current browser/dev server returned 500 for the external route, while the same route passed on the fresh current-code server at port 3100. Restart `npm run dev` before manual QA on port 3000.

3. **Review item: raw feedback route source includes internal IDs.**  
   Visible learner text is clean, but raw HTML/RSC payload contained course-version/record ID strings. Decide whether this must be removed before pilot based on the privacy bar for source-visible payloads.

## 13. Fixes required before pilot, if any

Required before pilot:

- Deploy the HRBA app launch-token update to the URL configured by `HRBA_EXTERNAL_COURSE_URL`, or update local/pilot environment configuration to a deployed URL that contains the token parser.
- Restart the Hub dev/server process used for manual QA and rerun the external iframe E2E route.
- Re-run `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external` in a browser and confirm the HRBA iframe detects portal mode with `launchToken`.

Recommended review before pilot:

- Review raw HTML/RSC exposure of internal IDs on learner feedback pages.

## 14. Final pilot readiness decision

**Not pilot-ready — blocker remains**
