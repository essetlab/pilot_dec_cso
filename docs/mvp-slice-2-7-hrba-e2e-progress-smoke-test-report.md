# MVP Slice 2.7 HRBA E2E Progress Smoke Test Report

## 1. Test setup

- Date: 2026-06-29
- Hub repository: `D:\z CDP-Lg-Andy-main-main`
- HRBA app repository: `D:\eLearn_CDP_Lg`
- PostgreSQL container: `cso-learning-hub-postgres`
- Hub dev server: `http://localhost:3000`
- HRBA Vite dev server: `http://localhost:5173`

Docker, Hub, and HRBA dev services were all reachable before the smoke test.

## 2. URLs used

- Hub home: `http://localhost:3000`
- HRBA local app: `http://localhost:5173`
- External course launch route: `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`

The Hub `.env` HRBA external-course URL remains configured for the hosted deployment. For local E2E testing, the external course registration was temporarily refreshed with a process-only local URL override pointing to `http://localhost:5173`. The `.env` file was not changed.

## 3. Authentication state

- Browser verification used Hub quick learner access and loaded the external course page as an authenticated learner.
- The browser session resolved to a seeded learner that already had completed HRBA course state, so it was not suitable for the no-certificate partial-progress assertion.
- A throwaway local learner was created through the existing workflow for isolated authenticated API verification.

## 4. Whether iframe loaded

Yes. The Hub external course page loaded the local HRBA iframe with portal launch parameters:

- `embed=portal`
- `portalOrigin=http://localhost:3000`
- HRBA course slug
- user, enrollment, and course version context

Sensitive identifiers are intentionally omitted.

## 5. Whether portal context was detected

Yes. The HRBA iframe URL included the portal context, and the HRBA app displayed the portal guidance note explaining that progress is shared with the Hub and certificate issuance remains Hub-controlled after final assessment availability and completion.

## 6. Whether progress message was sent

HRBA app code inspection confirmed that the app sends `cso-learning-hub:external-course-progress` postMessage events with partial progress data and `completed: false`.

Because the interactive browser learner was already completed, the final verification used a safe authenticated diagnostic callback against the live Hub API with the same message contract.

## 7. Whether Hub received/recorded progress

Yes. The Hub accepted the partial progress callback at `/api/external-course-progress` for a clean local learner/enrollment context.

Observed API result:

- request accepted successfully
- `progressPercent` recorded as `36`
- `completed` remained `false`
- `certificateStatus` returned `not-completed`
- no certificate code was returned

Observed database state after callback:

- enrollment progress: `36`
- enrollment status: `IN_PROGRESS`
- lesson status: `IN_PROGRESS`
- external progress source: `external-course-postmessage`
- completed module count recorded
- current module and screen recorded

## 8. Certificate not-issued confirmation

Confirmed. The partial progress callback did not issue a certificate:

- certificate count for the isolated learner remained `0`
- no completed status was recorded
- no certificate code was returned by the callback API

## 9. Commands run and results

Hub repo:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run prisma:validate`: passed.
- `npm run verify:hrba-external-course`: passed against the configured hosted HRBA origin and confirmed completed-course verification behavior.

HRBA repo:

- `npm run lint`: passed with 0 errors and 5 existing React hook warnings.
- `npm run build`: passed with existing Vite large asset/chunk warnings.

## 10. Blockers or limitations

- The browser quick learner was already completed, so the browser-only path could not prove the partial-progress/no-certificate case by itself.
- The clean partial-progress assertion was verified through the real Hub API and database using an isolated local learner.
- The Hub verification script restored and verified the configured hosted HRBA origin after the local smoke registration. This is expected for the current environment.
- No feature code, production behavior, `.env`, or secrets were changed.

## 11. Recommendation for next slice

Proceed to the next planned slice. Keep HRBA partial-progress messages using `completed: false` until final assessment implementation is explicitly approved.
