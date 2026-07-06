# S8B-4 Prisma Supabase Diagnostic Report

## Summary

This diagnostic investigated the Prisma runtime error seen during S8B-3 without running migrations or mutating real Supabase pilot data.

Finding: both `DATABASE_URL` and `DIRECT_URL` are present and begin with a Postgres protocol, but both fail URL parsing in the local process. Prisma and `pg` read-only probes therefore fail before a successful database connection can be established.

Likely cause: the Supabase connection strings in the private environment file are malformed or not URL-encoded for Node/Postgres client parsing. A common cause is an unescaped special character in the password portion of the URL.

## Branch

```text
feature/supabase-auth-vercel-real-pilot
```

## Private Environment File

Path:

```text
D:\CSO_Learning_Hub_Secrets\s8b-real-pilot.env
```

Confirmed:

- file exists;
- file is outside `D:\z CDP-Lg-Andy-main-main`;
- file contents were not printed;
- file was not copied into the repository.

## Environment Presence Status

Loaded into a local PowerShell process without printing values:

- `DATABASE_URL`: present
- `DIRECT_URL`: present
- `NEXT_PUBLIC_SUPABASE_URL`: present
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: present
- `NEXT_PUBLIC_APP_URL`: present

Additional non-secret shape checks:

- `DATABASE_URL`: starts with Postgres protocol, URL parse failed
- `DIRECT_URL`: starts with Postgres protocol, URL parse failed
- `DATABASE_URL` and `DIRECT_URL`: not identical

## Prisma Configuration

Package versions from `package.json`:

- `prisma`: `^7.8.0`
- `@prisma/client`: `^7.8.0`
- `@prisma/adapter-pg`: `^7.8.0`
- `pg`: `^8.21.0`

Runtime configuration:

- `src/lib/prisma.ts` uses `@prisma/adapter-pg`.
- Runtime reads `process.env.DATABASE_URL`.
- Runtime constructs `new PrismaPg({ connectionString })`.
- Runtime creates `new PrismaClient({ adapter })`.

Prisma CLI configuration:

- `prisma.config.ts` reads `process.env.DATABASE_URL`.
- Migration folder path is `prisma/migrations-postgres`.
- `DIRECT_URL` exists in the environment template, but `prisma.config.ts` does not currently read it directly.

Schema configuration:

- `prisma/schema.prisma` datasource provider is `postgresql`.
- The schema does not define `url` or `directUrl`; datasource URL is supplied by `prisma.config.ts`.

## Read-Only Diagnostics

Safe validation commands:

```powershell
npx prisma validate
npm run prisma:validate
```

Result:

- both passed with the private environment loaded.

Prisma runtime read-only probe:

```sql
SELECT 1 as ok
```

Results:

- `DATABASE_URL` read-only test: failed
- `DIRECT_URL` temporarily used as process `DATABASE_URL`: failed

Non-secret Prisma error summary:

```text
ERROR_NAME: TypeError
ERROR_MESSAGE: Cannot read properties of undefined (reading 'sep')
STACK_TOP:
node_modules/@prisma/client/runtime/client.js
```

Raw `pg` driver read-only probe:

```sql
SELECT 1 as ok
```

Results:

- `DATABASE_URL` read-only test: failed
- `DIRECT_URL` read-only test: failed

Non-secret `pg` error summary:

```text
ERROR_NAME: TypeError
ERROR_MESSAGE: Invalid URL
STACK_TOP:
node_modules/pg-connection-string/index.js
node_modules/pg/lib/connection-parameters.js
```

The `pg` driver redacted the input URL in its own error output. No connection string values were printed.

## DATABASE_URL Versus DIRECT_URL

The failure is not specific to the pooled `DATABASE_URL`.

Both values:

- are present;
- start with a Postgres protocol;
- are different from each other;
- fail URL parsing;
- fail read-only `SELECT 1` before a successful database connection.

## SMTP Warning Check

Inspecting the private env process directly showed all `SMTP_*` / `EMAIL_FROM` variables missing from the private file load.

The earlier `verify:s8-env-readiness` SMTP warning likely came from `dotenv/config` loading the repo-local `.env` for variables not supplied by the private file. No committed `.env` files were read into this report and no `.env` file was modified.

If Hub direct emails are not intentionally enabled for the real pilot, keep SMTP variables out of the private env and Vercel project env. If they are enabled, configure them deliberately and verify deliverability separately.

## Likely Cause

The likely cause is malformed Supabase connection strings in `D:\CSO_Learning_Hub_Secrets\s8b-real-pilot.env`, most likely one of:

- password contains special characters that are not URL-encoded;
- connection string was copied with extra characters, quotes, whitespace, or line wrapping;
- string is not the exact Supabase URI format expected by Node `URL` / `pg`;
- pooled and direct strings were both derived from the same malformed source.

The Prisma `sep` error appears to be a Prisma client error-formatting/runtime symptom after the underlying connection string parse failure. The raw `pg` probe exposes the clearer `Invalid URL` failure.

## Recommended Next Action

1. Regenerate or recopy both Supabase connection strings from the Supabase dashboard.
2. Ensure the database password is URL-encoded in both URLs.
3. Keep:
   - `DATABASE_URL` as the pooled/ORM runtime string;
   - `DIRECT_URL` as the direct migration string.
4. Do not print the strings. Re-run a non-secret URL parse/read-only `SELECT 1` diagnostic.
5. After both read-only tests pass, re-run:

   ```powershell
   npm run verify:s8-env-readiness
   npx prisma validate
   npm run prisma:validate
   ```

6. Only after approval, proceed to the migration-readiness step. Use `DIRECT_URL` only for approved migration operations.

No code/schema change is recommended in this diagnostic slice.

## Scope Confirmation

- No Prisma migrations were run.
- `prisma migrate deploy` was not run.
- `prisma migrate dev` was not run against Supabase.
- `prisma db push` was not run.
- No create/update/delete Prisma query was intentionally run.
- No deployment was attempted.
- No `.env` file was modified.
- No private env file contents were printed or copied.
- No secrets were committed.
- Daniel and Mulu were not invited.
- No learner/admin accounts were created.
- HRBA deployment, launchToken, callback, and certificate logic were not changed.
