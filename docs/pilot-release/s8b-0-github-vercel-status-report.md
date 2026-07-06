# S8B-0 GitHub And Vercel Status Report

## Summary

This check confirms the CSO Learning Hub app is not currently linked to a Vercel project from this local checkout, and this repository has no configured Git remote. No GitHub push, Vercel deployment, production migration, or environment modification was performed.

The already deployed HRBA course app remains separate at:

```text
https://pilot-hrba-e-learn-v1-wajj.vercel.app
```

This report is for the CSO Learning Hub app only.

## Branch And Git Status

Branch:

```text
feature/supabase-auth-vercel-real-pilot
```

Recent commits inspected:

```text
5dc7460 Add Supabase Vercel migration readiness runbook
7160843 Verify HRBA launch with Supabase sessions
3e684a1 Verify Supabase route role boundaries
f16e1aa Add Supabase sign-in session support
eb83f55 Add Supabase learner registration support
6f2b758 Add Supabase auth user link schema
af921e0 Add Supabase client setup utilities
16949ee Add Supabase and Vercel environment checklist
```

Worktree status before this report was clean.

## GitHub Remote Status

Command:

```powershell
git remote -v
```

Result: no Git remote is configured in this local checkout.

Expected GitHub repository:

```text
https://github.com/essetlabcso/CDP-Lg-Andy-G-pilot
```

Because no remote is configured, the branch was not pushed. No remote was added or overwritten.

Current branch upstream check:

```text
fatal: no upstream configured for branch 'feature/supabase-auth-vercel-real-pilot'
```

## Vercel CLI And Project Status

Local Vercel project link:

- `.vercel/project.json`: not present.
- `.vercel/` directory: not present.

Vercel CLI:

- `vercel` was not found on PATH.
- Vercel authentication could not be checked from this checkout.
- Vercel project list could not be checked from this checkout.

Linked Vercel project:

- Not linked locally.
- Project name: unknown.
- Production URL: unknown.
- Preview URL: none created in this task.
- Hub app already deployed on Vercel: not confirmed from this local checkout.

## Environment Readiness

Command:

```powershell
npm run verify:s8-env-readiness
```

Result: failed as expected in the local shell because production-like variables are not fully loaded. No secret values were printed.

Blocking missing variables:

- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Warnings reported:

- `HRBA_EXTERNAL_COURSE_URL` does not match the approved pilot deployment in the local environment.
- `NEXT_PUBLIC_APP_URL` is localhost in the local environment.
- SMTP variables are present; confirm Hub direct emails are intentionally enabled before deployment.

Required Preview variables that must be configured in Vercel before deployment:

- `DATABASE_URL`
- `DIRECT_URL`
- `SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `HRBA_EXTERNAL_COURSE_URL`
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`
- `PILOT_ACCESS_CODE` or `PILOT_ACCESS_CODES`
- `PILOT_REGISTRATION_MODE`
- `PILOT_INVITED_EMAILS`

## Preview Deployment Status

Preview deployment attempted: no.

Reasons:

- no Git remote is configured;
- current branch has no upstream;
- local checkout is not linked to a Vercel project;
- Vercel CLI is not available on PATH;
- required production-like Supabase/Vercel environment variables are missing locally.

Production deployment attempted: no.

## Next Required Action

1. Confirm whether the Git remote should be added as:

   ```powershell
   git remote add origin https://github.com/essetlabcso/CDP-Lg-Andy-G-pilot
   ```

2. After explicit confirmation, push the branch:

   ```powershell
   git push -u origin feature/supabase-auth-vercel-real-pilot
   ```

3. Install/authenticate the Vercel CLI or use the Vercel dashboard.
4. Link the CSO Learning Hub app, not the HRBA course app, to the correct Vercel project.
5. Configure all required Preview environment variables in Vercel without printing secrets.
6. Re-run `npm run verify:s8-env-readiness` in a safe production-like environment.
7. Create a Vercel Preview deployment only after the env readiness check has no blocking failures.

## Scope Confirmation

- No production Prisma migration was run.
- `prisma migrate dev` was not run against Supabase.
- `prisma db push` was not run.
- No Vercel deployment was attempted.
- No real `.env` file was modified.
- No secrets were committed or printed.
- Daniel and Mulu were not invited.
- No learner/admin accounts were created.
- HRBA deployment/app code was not changed.
- Certificate logic was not changed.
- HRBA callback and `launchToken` logic were not changed.
