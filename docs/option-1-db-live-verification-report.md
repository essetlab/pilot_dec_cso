# Option 1 DB Live Verification Report

## Docker/PostgreSQL setup result

- Branch: `cso-learning-hub-mvp`
- Initial working tree note: clean except the prior untracked PostgreSQL setup report.
- Docker is installed and working:
  - Docker version: `29.5.3`
- Existing Supabase containers were present and were not reused.
- Initial port check:

```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

Result:

- `TcpTestSucceeded: False`
- Interpretation: port `5432` was free for the dedicated CSO Learning Hub PostgreSQL container.

Dedicated container created:

- Container name: `cso-learning-hub-postgres`
- Image: `postgres:16`
- Host port: `5432`
- Container port: `5432`
- Database: `cso_learning_hub`
- Credentials: local development credentials from `.env`, not printed.

The repository `.env` already pointed to the expected local PostgreSQL target, so no `.env` update was required.

## Environment configuration summary with secrets masked

Inspected:

- `.env`
- `.env.example`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `package.json`

Masked local DB summary:

- Provider: `postgresql`
- Host: `localhost`
- Port: `5432`
- Database: `cso_learning_hub`
- Schema: `public`
- Credentials: present and masked

Other required environment variables observed:

- `SESSION_SECRET`: present, masked
- `NEXT_PUBLIC_APP_URL`: `http://localhost:3000`
- `HRBA_EXTERNAL_COURSE_URL`: configured
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`: configured
- SMTP variables: present, credentials masked

Prisma configuration:

- `prisma/schema.prisma` uses `provider = "postgresql"`.
- `prisma.config.ts` loads `DATABASE_URL` from environment.
- Migration directory is configured as `prisma/migrations-postgres`.

Available DB/HRBA scripts:

- `db:migrate:deploy`
- `db:seed`
- `register:hrba-external-course`
- `verify:hrba-external-course`
- `verify:hrba-course-import`

## PostgreSQL reachability result

After container creation:

```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

Result:

- `TcpTestSucceeded: True`

Prisma checks:

```powershell
npx prisma validate
npx prisma generate
npx prisma migrate status
```

Results:

- `npx prisma validate`: passed.
- `npx prisma generate`: passed.
- Initial `npx prisma migrate status`: reached the database and reported one pending migration, `20260612000000_init`.

## Prisma migration result

Command run:

```powershell
npm run db:migrate:deploy
```

Result:

- Passed.
- Applied migration: `20260612000000_init`
- Follow-up migration status: database schema is up to date.

## Seed result

Command run:

```powershell
npm run db:seed
```

Result:

- Passed.
- Seed output:
  - users: `10`
  - organizations: `2`
  - coursesSeeded: `6`
  - publicPublishedCourses: `3`
  - enrollments: `2`
  - certificates: `1`
  - contentBlocks: `13`
  - feedbackRecords: `2`
  - referenceDataItems: `240`
  - roles: `8`
  - defaultPassThreshold: `80`

## HRBA external-course registration result

Command run:

```powershell
npm run register:hrba-external-course
```

Result:

- Passed.
- Registered course:
  - courseId: `COURSE-HRBA-EXTERNAL-VITE-V1`
  - slug: `applying-human-rights-based-approach-in-cso-practice`
  - status: `PUBLISHED`
  - title: `Applying the Human Rights-Based Approach in CSO Practice`

Database spot-check after seed and registration:

- users: `10`
- organizations: `2`
- courses: `9`
- publishedCourses: `5`
- enrollments: `4`
- certificates: `3`
- contentBlocks: `37`
- referenceDataItems: `240`
- HRBA external course metadata: present

## HRBA external-course verification result

Commands run:

```powershell
npm run verify:hrba-external-course
npm run verify:hrba-course-import
```

Results:

- `verify:hrba-external-course`: passed.
  - courseSlug: `applying-human-rights-based-approach-in-cso-practice`
  - iframe origin: configured HRBA Vercel origin
  - iframe portal embed parameter: present
  - progressPercent: `100`
  - status: `COMPLETED`
  - certificate code generated

- `verify:hrba-course-import`: passed with status `ok`.
  - courseSlug: `human-rights-based-advocacy-in-practice-for-local-csos`
  - modulesImported: `3`
  - outcomesImported: `5`
  - blocksImported: `23`
  - learnerBlocks: `23`
  - creatorPreviewBlocks: `23`
  - finalTestQuestions: `8`
  - final test attempt: passed at `100%`
  - required assets: present
  - optional assets: some missing
  - temporary video URL noted by verification output

## Lint result

Command run:

```powershell
npm run lint
```

Result:

- Passed.
- ESLint completed without reported errors.

## Build result after DB setup

Command run:

```powershell
npm run build
```

Result:

- Passed.
- `prisma generate` completed.
- Next.js production build compiled successfully.
- TypeScript completed successfully.
- Static page generation completed.
- Route output included public, auth, learner, creator, admin, upload API, and external-course-progress API routes.
- The previous Prisma `ECONNREFUSED` warning from public course summary generation did not appear.

Final Prisma validation:

```powershell
npm run prisma:validate
```

Result:

- Passed.
- Prisma schema is valid.

Note:

- `npm run build` generated a local change to `next-env.d.ts`; that generated file was restored so no application source change remains from the verification pass.

## Remaining blockers

No database setup blocker remains for Option 1.

Non-blocking follow-up items from verification:

- `verify:hrba-course-import` reported missing optional HRBA assets.
- `verify:hrba-course-import` reported a temporary video URL.
- The prior untracked report `docs/option-1-postgres-setup-and-db-verification-report.md` remains in the working tree.
- This report is newly untracked until committed.

## Recommended decision

DB verified — proceed to MVP cleanup
