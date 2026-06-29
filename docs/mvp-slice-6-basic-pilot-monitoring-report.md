# MVP Slice 6 Basic Pilot Monitoring Report

## 1. Summary of changes

Implemented a simple protected internal pilot monitoring page for programme staff.

The page provides aggregate pilot learning metrics for registration, enrollment, progress, assessment attempts, certificates, and course feedback. It does not expose learner emails, assessment answers, feedback text, private portfolio content, internal database IDs, secrets, or raw session data.

## 2. Files changed

- `src/app/(admin)/admin/[[...segments]]/page.tsx`
- `src/components/admin/AdminDashboard.tsx`
- `src/components/admin/AdminPilotMonitoring.tsx`
- `src/lib/pilot-monitoring-workflow.ts`
- `src/lib/routes.ts`
- `docs/mvp-slice-6-basic-pilot-monitoring-report.md`

## 3. Monitoring approach selected

Selected approach: protected internal admin route.

Route:

- `/admin/pilot-monitoring`

Reason:

- The repository already has a protected admin catchall route and admin navigation pattern.
- The safest MVP path was a focused aggregate admin-only view instead of a public page or broad analytics dashboard.
- No export script was added because the protected route pattern was clean enough for this slice.

## 4. Metrics included

Pilot summary cards include:

- total registered learners;
- active learners;
- active organizations;
- total enrollments;
- learners not started;
- learners in progress;
- learners completed;
- final assessment attempts;
- passed attempts;
- failed attempts;
- certificates issued;
- feedback responses submitted.

Course summary table includes:

- course title;
- enrolled learners;
- started learners;
- average progress;
- completed learners;
- certificates issued;
- feedback submitted;
- average overall rating;
- average usefulness rating;
- average ease-of-use rating;
- average content clarity rating.

Supporting panels include:

- certificate summary;
- final assessment summary;
- feedback summary.

## 5. Route/export behavior

The route renders through the existing admin catchall:

- `/admin/pilot-monitoring`

No public route and no export script were added.

The admin dashboard quick action and admin navigation now include an internal Pilot Monitoring link.

## 6. Access control behavior

The route uses the existing admin route protection:

- unauthenticated users are redirected to sign-in by the admin catchall;
- non-admin learners are blocked by `canAccessPath`;
- only existing admin/platform roles can access `/admin/pilot-monitoring`.

This route is not exposed through public navigation.

## 7. Privacy protections

The view is aggregate-first and intentionally excludes:

- learner email;
- assessment answers;
- private portfolio content;
- feedback text/comments;
- internal database IDs;
- secrets;
- raw session data.

The page includes a clear note:

> This monitoring view is for pilot learning support and programme improvement. It should not be used to expose private learner responses.

## 8. Commands run and results

- `npm run lint` — passed.
- `npm run build` — passed.
- `npm run prisma:validate` — passed.
- `docker start cso-learning-hub-postgres` — failed because Docker Desktop was not reachable.
- `Test-NetConnection -ComputerName localhost -Port 5432` — failed; PostgreSQL was unreachable.
- `npx prisma migrate status` — failed because the database was unreachable.
- `npm run verify:hrba-external-course` — blocked by unavailable PostgreSQL/Docker.
- `npm run verify:r17` — blocked by unavailable PostgreSQL/Docker.

Build note:

- `npm run build` completed successfully, but the public course static data pass logged an `ECONNREFUSED` fallback warning because PostgreSQL was not reachable during build.

## 9. Manual verification steps

Not fully completed because Docker/PostgreSQL was unavailable at verification time.

Recommended manual verification after restarting Docker/PostgreSQL:

1. Start `cso-learning-hub-postgres`.
2. Run `npx prisma migrate status`.
3. Sign in as an admin/platform user.
4. Open `/admin/pilot-monitoring`.
5. Confirm summary cards show aggregate learner, enrollment, assessment, certificate, and feedback counts.
6. Confirm course summary table shows aggregate course metrics.
7. Sign in as a participant and confirm `/admin/pilot-monitoring` redirects to unauthorized.
8. Sign out and confirm `/admin/pilot-monitoring` redirects to sign-in.
9. Confirm public routes do not show a pilot monitoring link.
10. Re-run `npm run verify:hrba-external-course` and `npm run verify:r17`.

## 10. Remaining limitations

- No export file was added in this slice because the protected admin route was the selected MVP approach.
- No learner-level rows are included; this is intentional for privacy.
- No date, organization, or course filters were added; the existing broader `/admin/monitoring` page remains available for more detailed operational monitoring.
- DB-backed manual verification is pending until Docker/PostgreSQL is available again.

## 11. Recommended next slice

Restart Docker/PostgreSQL, complete DB-backed route verification for Slice 6, then proceed to final acceptance QA or a focused pilot export slice if the programme team needs downloadable evidence.
