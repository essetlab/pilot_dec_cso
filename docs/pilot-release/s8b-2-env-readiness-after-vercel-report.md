# S8B-2 Environment Readiness After Vercel Report

## Summary

The CSO Learning Hub deployment URL responds, but the local shell used for this verification does not currently have the required production-like environment variables loaded. Per the S8B-2 stop rule, environment readiness verification and supporting non-migration checks were not run after the missing-variable precheck.

Decision: Not ready; missing environment values.

## Hub Vercel URL

```text
https://cdp-lg-andy-g-pilot-xziq.vercel.app
```

Homepage fetch result:

- responds: yes;
- HTTP status: 200;
- no secret values were requested or printed.

## Supabase Dashboard Settings Confirmed By Owner

The owner reported:

- Supabase Site URL is set to the Hub Vercel URL.
- Supabase Redirect URL includes the Hub Vercel URL.
- Email provider is enabled.
- Confirm email is turned off for Daniel/Mulu internal pilot.

## Local Environment Precheck

The local shell is missing these required variable names:

- `DATABASE_URL`
- `DIRECT_URL`
- `SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `HRBA_EXTERNAL_COURSE_URL`
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`
- `PILOT_REGISTRATION_MODE`
- `PILOT_INVITED_EMAILS`
- `PILOT_ACCESS_CODE` or `PILOT_ACCESS_CODES`

No secret values were printed.

## Environment Readiness Result

`npm run verify:s8-env-readiness` was not run because the Step 3 local environment precheck hit the stop condition: required environment variables are not loaded in the local shell.

Blocking issues:

- missing required local environment values listed above.

Warnings:

- not evaluated because the readiness verifier was not run.

## Supporting Checks

These checks were not run because the environment precheck stop condition was reached:

- `npm run verify:s7-hrba-supabase-compat`
- `npm run verify:s6-route-roles`
- `npm run verify:s5-signin`
- `npm run verify:s4-registration`
- `npx prisma validate`
- `npm run prisma:validate`
- `git diff --check`
- `git status --short`

## Scope Confirmation

- No Prisma migration was run.
- `prisma migrate deploy` was not run.
- `prisma migrate dev` was not run against Supabase.
- `prisma db push` was not run.
- No deployment was attempted.
- No committed `.env` files were modified.
- No secrets were committed or printed.
- Daniel and Mulu were not invited.
- No learner/admin accounts were created.
- HRBA deployment, launchToken, callback, and certificate logic were not changed.

## Next Required Action

Load the real production-like environment values into a safe local shell or CI/Vercel context without printing them, then rerun S8B-2 from Step 3. The expected Hub app URL is:

```text
NEXT_PUBLIC_APP_URL=https://cdp-lg-andy-g-pilot-xziq.vercel.app
```

The expected HRBA URL and allowed origin are:

```text
HRBA_EXTERNAL_COURSE_URL=https://pilot-hrba-e-learn-v1-wajj.vercel.app
HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS=https://pilot-hrba-e-learn-v1-wajj.vercel.app
```
