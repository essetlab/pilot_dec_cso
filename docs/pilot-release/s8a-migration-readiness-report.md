# S8A Migration Readiness Report

## Summary

S8A adds a safe environment readiness verifier and a Supabase/Vercel migration runbook. It does not run production migrations, deploy to Vercel, modify real `.env` files, or commit secrets.

## Files Created Or Changed

- `scripts/verify-s8-env-readiness.ts`
- `docs/pilot-release/s8-vercel-supabase-migration-runbook.md`
- `docs/pilot-release/s8a-migration-readiness-report.md`
- `package.json`

## Environment Verifier Behavior

Added:

```powershell
npm run verify:s8-env-readiness
```

The verifier:

- reads environment variables only;
- never prints secret values;
- reports only status labels and generic details;
- detects missing, placeholder-like, and invalid production readiness values;
- validates public URL shape;
- validates `DATABASE_URL` and `DIRECT_URL` start with `postgresql://` or `postgres://`;
- warns if `DATABASE_URL` and `DIRECT_URL` are identical;
- warns if `NEXT_PUBLIC_APP_URL` is localhost;
- warns if HRBA URL/origins do not match the approved pilot HRBA deployment;
- warns if pilot registration mode is not `strict`;
- warns if Internal Pilot 0 invited emails are incomplete;
- flags public Supabase service-role/secret-like variables;
- treats SMTP as optional unless Hub direct emails are enabled.

The script exits non-zero only for blocking production-readiness issues: missing required values, placeholder-like required values, invalid required URL/database URL shape, invalid allowed-origin URL shape, or public exposure of a Supabase secret-like variable.

## S8A Env Readiness Result

Local `npm run verify:s8-env-readiness` failed in S8A because production-like environment variables are not fully loaded in the local shell. The verifier reported three blocking issues:

- `DIRECT_URL` missing;
- `NEXT_PUBLIC_SUPABASE_URL` missing;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` missing.

It also reported warnings for local/non-production URL settings and SMTP presence. No secret values were printed.

This failure is expected for the current local environment and should not be bypassed for real migration approval.

The verifier must pass, or pass with warnings only, before S8B migration/deployment approval.

## Migration And Deployment Notes

Confirmed current configuration:

- Prisma schema: `prisma/schema.prisma`
- Prisma config: `prisma.config.ts`
- Prisma migration path: `prisma/migrations-postgres`
- Runtime/CLI datasource currently reads `DATABASE_URL` in `prisma.config.ts`
- S3 migration is present at `prisma/migrations-postgres/20260706000000_add_supabase_auth_user_link`
- `db:setup:production` is too broad for the real pilot unless explicitly approved because it chains migration deploy, demo seed, and HRBA registration.

The runbook recommends separate reviewed commands and a safe env shell/CI context for direct Supabase migration credentials.

## Scope Confirmation

- No Prisma schema changes were made.
- No migrations were created or run.
- No Supabase production migration commands were run.
- No Vercel deployment was attempted.
- No real `.env` files were modified.
- No secrets were committed.
- No HRBA deployment or HRBA app code was changed.
- No certificate logic was changed.
- Daniel and Mulu were not invited.
- No real learner/admin accounts were created.
- No Supabase `service_role` key was used in browser/client code.
- No future-stage features were added.

## Checks

Required S8A checks:

```powershell
npm run verify:s8-env-readiness
npm run verify:s7-hrba-supabase-compat
npm run verify:s6-route-roles
npm run verify:s5-signin
npm run verify:s4-registration
npm run verify:hrba-external-course
npm run verify:r17
npx prisma validate
npm run prisma:validate
npm run lint
npm run build
git diff --check
git status --short
```

## Next Step

S8B should perform the real Supabase migration and Vercel Preview deployment only after external values are available, the S8 verifier passes without blocking issues, and approval is recorded.
