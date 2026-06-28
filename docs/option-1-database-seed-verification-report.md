# Option 1 Database Seed Verification Report

## 1. Database configuration summary

- Repository path: `D:\z CDP-Lg-Andy-main-main`
- Branch: `cso-learning-hub-mvp`
- Prisma schema path: `prisma/schema.prisma`
- Prisma config path: `prisma.config.ts`
- Prisma datasource provider: `postgresql`
- Prisma migrations path from `prisma.config.ts`: `prisma/migrations-postgres`
- Prisma client output: `src/generated/prisma`
- Expected database host from masked local `.env`: `localhost`
- Expected database port from masked local `.env`: `5432`
- Expected database name from masked local `.env`: `cso_learning_hub`
- Expected schema from masked local `.env`: `public`

The app expects a PostgreSQL connection string like:

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

For hosted/serverless production, deployment docs show the same shape with provider-specific SSL options, for example:

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require&schema=public
```

Local PostgreSQL is required for database-backed verification. The repository includes a `Dockerfile`, but no `docker-compose.yml` / `compose.yml` file was found for starting a local PostgreSQL service.

## 2. Environment variables required

Observed in `.env` and `.env.example` without printing secret values:

- `DATABASE_URL`: PostgreSQL connection string.
- `SESSION_SECRET`: local session signing secret.
- `NEXT_PUBLIC_APP_URL`: public app URL, locally `http://localhost:3000`.
- `HRBA_EXTERNAL_COURSE_URL`: external HRBA course app URL.
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`: allowed iframe/progress origins for the HRBA course app.
- `SMTP_HOST`: SMTP host.
- `SMTP_PORT`: SMTP port.
- `SMTP_USER`: SMTP username.
- `SMTP_PASS`: SMTP password.
- `SMTP_SECURE`: SMTP TLS mode.
- `EMAIL_FROM`: sender identity for invitation email.

Secret-bearing values were masked during inspection.

## 3. PostgreSQL reachability result

Commands run:

```powershell
npx prisma validate
npx prisma generate
npx prisma migrate status
Test-NetConnection -ComputerName localhost -Port 5432
```

Additional safe direct probe:

```powershell
node --input-type=module
```

using the `pg` client and the configured `DATABASE_URL`, without printing the URL.

Results:

- `npx prisma validate`: passed.
- `npx prisma generate`: passed.
- `npx prisma migrate status`: failed with a Prisma schema engine error after targeting PostgreSQL database `cso_learning_hub`, schema `public`, at `localhost:5432`.
- `Test-NetConnection`: `TcpTestSucceeded: False` for `localhost:5432`.
- Direct `pg` client probe: failed with `ECONNREFUSED`.

Conclusion:

- Local PostgreSQL is not reachable at the configured host and port.
- Database-backed seed verification cannot safely continue until PostgreSQL is running and the configured database/credentials are valid.

## 4. Prisma migration status

Migration status could not be verified because PostgreSQL was not reachable.

Safe setup command once PostgreSQL is running and `.env` is correct:

```powershell
npm run db:migrate:deploy
```

This maps to:

```powershell
prisma migrate deploy
```

The deployment docs also list this as the first one-time setup command before seed and HRBA registration.

## 5. Seed/registration scripts found

Found in `package.json`:

- `db:migrate:deploy`: `prisma migrate deploy`
- `db:seed`: `node --import jiti/register scripts/seed-phase1-demo.ts`
- `register:hrba-external-course`: `node --import jiti/register scripts/register-hrba-external-course.ts`
- `verify:hrba-external-course`: `node --import jiti/register scripts/verify-hrba-external-course.ts`
- `verify:hrba-course-import`: `node --import jiti/register scripts/verify-hrba-course-import.ts`
- `db:setup:production`: `prisma migrate deploy && node --import jiti/register scripts/seed-phase1-demo.ts && node --import jiti/register scripts/register-hrba-external-course.ts`

Deployment docs recommend:

```powershell
npm run db:migrate:deploy
npm run db:seed
npm run register:hrba-external-course
```

or the combined:

```powershell
npm run db:setup:production
```

## 6. Seed/registration scripts run

No seed or registration scripts were run.

Reason:

- The configured PostgreSQL database was not reachable.
- Per instruction, verification stopped before migration deploy, seed, HRBA registration, and data verification rather than guessing credentials or writing to an unknown database.

## 7. HRBA external-course registration result

Not run because PostgreSQL was not reachable.

Evidence that the workflow exists:

- `register:hrba-external-course` script exists in `package.json`.
- `verify:hrba-external-course` script exists in `package.json`.
- `.env` and `.env.example` include `HRBA_EXTERNAL_COURSE_URL` and `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`.
- `Course.analysisMetadataJson` exists in `prisma/schema.prisma` for metadata such as external course launch configuration.
- `src/lib/external-course-config.ts` defines external-course metadata including `launchUrl`.
- `src/lib/external-course-workflow.ts` registers the HRBA external course and writes external course metadata.
- `src/app/api/external-course-progress/route.ts` exists for progress callbacks from the external course app.

Expected commands after PostgreSQL is reachable and migrations are applied:

```powershell
npm run register:hrba-external-course
npm run verify:hrba-external-course
npm run verify:hrba-course-import
```

## 8. Course/catalog DB data verification

Not verified against live DB data because PostgreSQL was not reachable.

The following required seeded data checks remain pending:

- users
- organizations
- courses
- enrollments
- certificates
- HRBA external course metadata

After database setup, run:

```powershell
npm run db:migrate:deploy
npm run db:seed
npm run register:hrba-external-course
npm run verify:hrba-external-course
npm run verify:hrba-course-import
```

Then rerun DB-backed catalogue/build verification.

## 9. Build result after DB connection

Not run after DB setup because the database was not reachable and setup did not continue.

The previous technical verification build passed but logged a Prisma `ECONNREFUSED` warning during public course summary generation. That warning is expected to remain until PostgreSQL is running and reachable through the configured `DATABASE_URL`.

After PostgreSQL setup, rerun:

```powershell
npm run lint
npm run build
npm run prisma:validate
```

Expected confirmation:

- `npm run build` should complete without the previous Prisma `ECONNREFUSED` warning from `getPublicCourseSummaries`.

## 10. Remaining blockers

1. PostgreSQL is not running or not reachable at `localhost:5432`.
2. Migration status cannot be confirmed until the DB is reachable.
3. Seed data cannot be safely applied until the DB is reachable.
4. HRBA external-course registration cannot be verified until migrations and seed baseline are present.
5. Course/catalog DB behavior cannot be confirmed until real database rows are available.

Setup instructions:

1. Start or install PostgreSQL locally.
2. Create the configured database, currently expected as `cso_learning_hub`.
3. Confirm `.env` contains the correct `DATABASE_URL` for that local database. Do not commit `.env`.
4. Re-run:

```powershell
npx prisma migrate status
npm run db:migrate:deploy
npm run db:seed
npm run register:hrba-external-course
npm run verify:hrba-external-course
npm run verify:hrba-course-import
npm run lint
npm run build
npm run prisma:validate
```

## 11. Recommended next step

Database not verified — stop and configure PostgreSQL
