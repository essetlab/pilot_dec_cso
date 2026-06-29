# MVP Slice 6 DB-Backed Verification Report

## 1. Purpose

Complete the database-backed verification for MVP Slice 6 after the earlier Slice 6 verification was blocked by unavailable Docker/PostgreSQL.

This verification pass did not implement new features, refactor source code, or change monitoring logic.

## 2. PostgreSQL/Docker status

PostgreSQL was restored successfully.

- `docker start cso-learning-hub-postgres` started the dedicated project container.
- `docker ps --filter "name=cso-learning-hub-postgres"` confirmed the container was running.
- `Test-NetConnection -ComputerName localhost -Port 5432` returned `TcpTestSucceeded: True`.
- `npx prisma migrate status` succeeded and reported the database schema is up to date.

## 3. Commands run and results

- `npm run lint` — passed. The first lint attempt timed out at the command wrapper limit, then passed on a longer timeout.
- `npm run build` — passed.
- `npm run prisma:validate` — passed.
- `npm run verify:hrba-external-course` — passed. The verifier recorded the expected HRBA demo workflow state and issued/confirmed a demo certificate record.
- `npm run verify:r17` — passed. Course feedback workflow checks all passed.

The previous build-time Prisma `ECONNREFUSED` fallback warning was gone after PostgreSQL became reachable.

## 4. Admin monitoring route verification

Verified `/admin/pilot-monitoring` with a signed local admin/platform session.

Confirmed:

- route returned HTTP 200;
- `Pilot monitoring` page rendered;
- summary cards loaded;
- `Course summary` table loaded;
- `Certificate summary` panel loaded;
- `Final assessment summary` panel loaded;
- `Feedback summary` panel loaded;
- page content remained aggregate-focused.

## 5. Access control verification

Verified with local signed-session HTTP route checks:

- admin/platform user: `/admin/pilot-monitoring` returned HTTP 200;
- participant user: `/admin/pilot-monitoring` redirected to `/unauthorized?from=%2Fadmin%2Fpilot-monitoring`;
- signed-out user: `/admin/pilot-monitoring` redirected to `/sign-in?next=%2Fadmin%2Fpilot-monitoring`.

## 6. Public navigation verification

Verified the public home page did not contain:

- `Pilot Monitoring`;
- `pilot-monitoring`.

The Slice 6 route remains internal and is not exposed in public navigation.

## 7. Stable route verification

Verified the following routes returned successfully:

- `/`
- `/register`
- `/sign-in`
- `/courses`
- `/verify-certificate`
- `/learn`
- `/learn/my-courses`
- `/learn/certificates`
- `/learn/courses/applying-human-rights-based-approach-in-cso-practice/feedback`
- `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`

Protected learner routes were checked with a signed local participant session.

## 8. Remaining issues

- No source-code changes were required.
- The monitoring page includes privacy language noting that assessment answers are not displayed; actual assessment answers, learner emails, feedback text, internal IDs, secrets, and raw session data were not exposed by the pilot monitoring route.
- The HRBA verifier may create or refresh demo certificate records as part of its normal verification behavior.

## 9. Recommendation on next slice

MVP Slice 6 is DB-backed verified. Proceed to the next approved MVP slice or final acceptance QA when explicitly authorized.
