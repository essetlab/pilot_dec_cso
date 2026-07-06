# S8B-6 Direct URL and Prisma Diagnostic Report

## Summary

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Private environment file checked: `D:\CSO_Learning_Hub_Secrets\s8b-real-pilot.env`
- Task scope: diagnose `DIRECT_URL` DNS behavior and Prisma adapter behavior using read-only checks only
- Decision: **Ready with warnings; approval needed**

## Environment Presence

The private environment file was loaded into the local PowerShell process without printing values.

- `DATABASE_URL`: present
- `DIRECT_URL`: present
- `NEXT_PUBLIC_APP_URL`: present
- `NEXT_PUBLIC_SUPABASE_URL`: present
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: present

## Redacted URL Shape

No passwords or full connection strings were printed.

| Variable | Protocol | Username shape | Hostname | Port | Database | Password exists |
| --- | --- | --- | --- | --- | --- | --- |
| `DATABASE_URL` | `postgresql` | `postgres.[project-ref]` | `aws-0-eu-west-1.pooler.supabase.com` | `6543` | `postgres` | yes |
| `DIRECT_URL` | `postgresql` | `postgres` | `db.bhzyrthinbyqgsetnoph.supabase.co` | `5432` | `postgres` | yes |

The `DATABASE_URL` shape matches the expected Supabase transaction pooler pattern. The `DIRECT_URL` shape matches the expected Supabase direct database host pattern.

## DNS Results

| Host checked | Resolves | IPv4 record | IPv6 record | Error |
| --- | --- | --- | --- | --- |
| `aws-0-eu-west-1.pooler.supabase.com` | yes | yes | no | none |
| `db.bhzyrthinbyqgsetnoph.supabase.co` from `DIRECT_URL` | yes | no | yes | none from PowerShell DNS |
| `db.bhzyrthinbyqgsetnoph.supabase.co` expected direct host | yes | no | yes | none from PowerShell DNS |

PowerShell DNS resolves the direct host as IPv6-only. Node/raw `pg` still fails to resolve the same host with `getaddrinfo ENOTFOUND`.

## Raw `pg` Read-Only Results

Only `SELECT 1` was run. No database records were created, updated, or deleted.

| Test | Result | Non-secret error summary |
| --- | --- | --- |
| `DATABASE_URL` raw `pg` `SELECT 1` | pass | none |
| `DIRECT_URL` raw `pg` `SELECT 1` | fail | `Error`: `getaddrinfo ENOTFOUND db.bhzyrthinbyqgsetnoph.supabase.co` |
| Expected direct host raw `pg` `SELECT 1` | fail | `Error`: `getaddrinfo ENOTFOUND db.bhzyrthinbyqgsetnoph.supabase.co` |

`DATABASE_URL` is now valid for raw `pg`.

`DIRECT_URL` has the expected shape and resolves in PowerShell DNS as IPv6-only, but it is not usable from the local Node/raw `pg` path.

## Prisma Adapter Diagnostic

Files inspected:

- `src/lib/prisma.ts`
- `scripts/verify-s4-supabase-registration.ts`
- `scripts/verify-s7-hrba-supabase-compat.ts`
- `package.json`
- `prisma/schema.prisma`

Relevant versions:

- `prisma`: `^7.8.0`
- `@prisma/client`: `^7.8.0`
- `@prisma/adapter-pg`: `^7.8.0`
- `pg`: `^8.21.0`

The schema uses the `prisma-client` generator with output at `../src/generated/prisma`. The repo's shared Prisma helper imports `PrismaClient` from `../generated/prisma/client`.

| Test | Result | Failure stage | Non-secret error summary |
| --- | --- | --- | --- |
| Requested `@prisma/client` official snippet | fail | import | `Error`: `Cannot find module '.prisma/client/default'` |
| Generated client adapter snippet with `DATABASE_URL` | pass | none | none |
| Shared `src/lib/prisma.ts` helper with `DATABASE_URL` | pass | none | none |

The earlier Prisma `TypeError` was not reproduced after using the generated client export shape correctly. Prisma can complete read-only `SELECT 1` through the pooled `DATABASE_URL`.

Top relevant stack file names from the failed `@prisma/client` import:

- `node_modules\@prisma\client\default.js`
- Node CommonJS loader internals

## Optional Session Pooler Diagnostic

- `SESSION_POOLER_URL` present: no
- Raw `pg` `SELECT 1` with session pooler: not tested
- Prisma `SELECT 1` with session pooler: not tested

## Likely Cause

The pooled `DATABASE_URL` is now usable with raw `pg`, generated Prisma, and the shared Prisma helper.

The remaining issue is isolated to `DIRECT_URL`: the direct Supabase host is IPv6-only from local DNS and fails in the Node/raw `pg` resolution path with `getaddrinfo ENOTFOUND`. This suggests the local environment cannot reliably resolve or reach the direct database endpoint through Node, even though PowerShell DNS can see the IPv6 record.

## Recommended Next Action

Use the working Supabase pooler `DATABASE_URL` for local read-only Prisma diagnostics. Before migration approval, choose one of these safe paths:

- Add and test a private `SESSION_POOLER_URL` if Supabase provides a session pooler connection string suitable for Prisma migration diagnostics.
- Use a migration environment that can resolve and reach the direct IPv6-only Supabase database host.
- Re-check the direct connection string from the Supabase dashboard if direct access is required locally.

No code change is recommended in this slice because the repo's generated Prisma client and shared Prisma helper now pass `SELECT 1` with `DATABASE_URL`.

## Safety Confirmations

- No Prisma migration command was run.
- `prisma migrate deploy` was not run.
- `prisma migrate dev` was not run.
- `prisma db push` was not run.
- No database mutation was attempted.
- No deployment was attempted.
- No learner or admin accounts were created.
- Daniel and Mulu were not invited.
- HRBA deployment, callback, launchToken, and certificate logic were not changed.
- No real `.env` files were modified.
- No private environment file was copied into the repository.
- No secret values were printed or committed.
