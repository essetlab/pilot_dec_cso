# MVP Slice 7 Internal ID Exposure Hotfix Report

## 1. Purpose

Final pilot QA found that the external HRBA course iframe launch URL exposed raw Hub identifiers in query parameters, including the learner user ID, enrollment ID, and course version ID. This hotfix replaces those visible identifiers with an opaque launch token and validates callback writes server-side.

## 2. Summary of Changes

- Added a DB-backed `ExternalCourseLaunchToken` table.
- Hub launch now creates a random opaque token, stores only its SHA-256 hash with launch context, and sends `launchToken` in the iframe URL.
- Removed `userId`, `enrollmentId`, and `courseVersionId` from the external course iframe URL.
- Updated the parent frame bridge to POST sanitized progress data plus `launchToken` to `/api/external-course-progress`.
- Updated `/api/external-course-progress` and `recordExternalCourseProgress` to resolve the token server-side before updating progress, attempts, completion, or certificates.
- Updated `npm run verify:hrba-external-course` to test the token contract and reject invalid/mismatched launch contexts.

## 3. Files Changed

- `prisma/schema.prisma`
- `prisma/migrations-postgres/20260629133000_external_course_launch_tokens/migration.sql`
- `src/lib/external-course-workflow.ts`
- `src/lib/external-course-types.ts`
- `src/components/learner/ExternalCourseFrame.tsx`
- `src/app/api/external-course-progress/route.ts`
- `scripts/verify-hrba-external-course.ts`

## 4. Migration

Migration applied locally:

`20260629133000_external_course_launch_tokens`

`npx prisma migrate status` now reports the database schema is up to date.

## 5. Launch URL Privacy Result

Verified by `npm run verify:hrba-external-course`:

- Launch URL excludes `userId`.
- Launch URL excludes `enrollmentId`.
- Launch URL excludes `courseVersionId`.
- Launch URL includes an opaque `launchToken`.
- The token value does not contain the learner ID.

## 6. Callback Validation Result

Server-side progress recording now requires:

- authenticated Hub learner session;
- valid non-expired launch token;
- token user matching the signed-in learner;
- token course slug matching the callback course slug;
- token allowed origin matching the iframe origin;
- enrollment belonging to the token user, course, and course version.

Verified rejection cases:

- invalid token rejected;
- token/session mismatch rejected;
- token/course mismatch rejected;
- token/origin mismatch rejected.

## 7. HRBA External-Course Flow Result

Hub-side verifier confirms:

- partial progress with a valid launch token works;
- partial progress does not issue a certificate;
- failed assessment records a failed attempt and does not issue a certificate;
- passing assessment records completion and issues exactly one certificate;
- repeated passing callback does not issue duplicate certificates;
- public certificate verification data remains available;
- learner certificate PDF data remains available.

## 8. HRBA App Follow-Up Required

Read-only inspection of `D:\eLearn_CDP_Lg` found that the HRBA app still requires the old launch parameters in `src/integration/portalContext.ts`:

- `userId`
- `enrollmentId`
- `courseVersionId`

Because this Hub hotfix intentionally removes those raw IDs from the visible iframe URL, the HRBA app must be updated in a follow-up task to parse `launchToken` instead and send progress messages without raw Hub IDs. The Hub parent frame is ready to accept messages that omit `userId`, and it injects `launchToken` only into the authenticated Hub API request.

Do not claim final browser E2E acceptance readiness until the HRBA app token launch update is implemented and verified.

## 9. Commands Run and Results

- `docker start cso-learning-hub-postgres` — passed.
- `Test-NetConnection -ComputerName localhost -Port 5432` — `TcpTestSucceeded: True`.
- `npx prisma generate` — passed.
- `npx prisma validate` — passed.
- `npm run db:migrate:deploy` — passed; applied `20260629133000_external_course_launch_tokens`.
- `npx prisma migrate status` — passed; database schema is up to date.
- `npm run lint` — passed.
- `npm run build` — passed.
- `npm run prisma:validate` — passed.
- `npm run verify:hrba-external-course` — passed.
- `npm run verify:r17` — passed.

## 10. Remaining Issues

- HRBA app browser E2E is blocked until `D:\eLearn_CDP_Lg` is updated to accept `launchToken` and stop requiring raw Hub identifiers.
- The Hub verifier validates certificate PDF data availability; actual PDF route compilation is covered by `npm run build`.

## 11. Recommendation

Proceed with the Hub hotfix commit now. Before declaring final pilot acceptance readiness, implement and verify the matching HRBA app launch-token parser update and rerun iframe E2E smoke testing.
