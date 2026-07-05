# S8 Vercel Supabase Migration Runbook

## 1. Purpose

Prepare and execute the CSO Learning Hub Supabase Postgres migration and Vercel deployment for real pilot testing.

This runbook is preparation guidance only for S8A. Do not run production migrations or deploy to Vercel until the programme and technical approval gates are complete.

## 2. Current Branch And Completed Slices

Branch:

```text
feature/supabase-auth-vercel-real-pilot
```

Latest completed slices:

- S1: Supabase/Vercel environment template and checklist.
- S2: Supabase dependencies and client/server utilities.
- S3: Hub `User.authProviderId` / `authProvider` schema link and reviewed migration.
- S4: Supabase learner registration support with local fallback.
- S5: Supabase sign-in/sign-out and Supabase-derived `getCurrentSession()`.
- S6: route protection and role-boundary verification.
- S7: HRBA launch/callback compatibility under Supabase sessions.

## 3. Required External Values

Collect these outside git. Do not paste real values into source files or docs.

- Supabase Project URL.
- Supabase publishable key.
- `DATABASE_URL` from Supabase ORM/Prisma pooled connection string for app runtime.
- `DIRECT_URL` from Supabase direct connection string for migration operations.
- Vercel Hub Production URL.
- Vercel Preview URL used for QA.
- Programme-approved pilot access code or codes.
- Strict invited emails for Internal Pilot 0:
  - `agiledatawise@gmail.com`
  - `essetlab@gmail.com`

## 4. Supabase Dashboard Setup

Before any learner invitation:

- Enable the Email/password provider.
- Set Supabase Site URL to the Vercel Hub Production URL.
- Add redirect URLs for:
  - Vercel Hub Production URL.
  - Vercel Preview URL used for QA, if Preview auth testing is enabled.
  - Auth callback route if implemented.
  - Password reset/update route if implemented.
- Record the email confirmation decision.
- Configure custom SMTP before broader real pilot invitations.
- Record the password reset support decision and support workaround if reset routes are not yet implemented.

Do not use the Supabase `service_role` key in browser code or `NEXT_PUBLIC_*` variables.

## 5. Vercel Environment Setup

Set these for Production and Preview, with environment-specific URLs where needed:

- `DATABASE_URL`
- `DIRECT_URL`
- `SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `HRBA_EXTERNAL_COURSE_URL`
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`
- `PILOT_ACCESS_CODE` or `PILOT_ACCESS_CODES`
- `PILOT_REGISTRATION_MODE=strict`
- `PILOT_INVITED_EMAILS=agiledatawise@gmail.com,essetlab@gmail.com`

Conditional:

- `SUPABASE_SECRET_KEY` only if server admin actions require it.
- `SMTP_*` and `EMAIL_FROM` only if the Hub sends direct emails.

Approved HRBA values:

```text
HRBA_EXTERNAL_COURSE_URL=https://pilot-hrba-e-learn-v1-wajj.vercel.app
HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS=https://pilot-hrba-e-learn-v1-wajj.vercel.app
```

## 6. Migration Sequence

Do not use `prisma db push` for production. Do not run `prisma migrate dev` against Supabase production.

1. Confirm the Supabase project is empty, disposable, or has a current backup/restore plan.
2. Confirm `DATABASE_URL` is the pooled/runtime URL and `DIRECT_URL` is the direct migration URL.
3. Run the S8 environment readiness verifier locally with production-like environment variables loaded:

   ```powershell
   npm run verify:s8-env-readiness
   ```

4. Run Prisma validation:

   ```powershell
   npx prisma validate
   npm run prisma:validate
   ```

5. Inspect migration status against Supabase using approved migration credentials.

   Current repo configuration:
   - Prisma schema: `prisma/schema.prisma`
   - migration path: `prisma/migrations-postgres`
   - Prisma config currently reads `DATABASE_URL` for CLI datasource URL.

   For migration inspection/deploy, use a safe shell or CI/Vercel environment where the Prisma CLI datasource points at the approved direct Supabase connection string. Do not print the string.

6. Confirm the S3 migration is present before deploy:

   ```text
   prisma/migrations-postgres/20260706000000_add_supabase_auth_user_link
   ```

7. Run `prisma migrate deploy` only after programme and technical approval.
8. Seed only required reference/role/course metadata.
9. Register HRBA external course metadata if needed:

   ```powershell
   npm run register:hrba-external-course
   ```

10. Verify migration status after deploy.

Avoid `npm run db:setup:production` for the real pilot unless the team explicitly accepts that it runs migration deploy, Phase 1 demo seed data, and HRBA registration as one broad command. Prefer separate reviewed commands.

## 7. Deployment Sequence

1. Set Vercel Preview environment variables.
2. Deploy a Preview from `feature/supabase-auth-vercel-real-pilot`.
3. Confirm the Preview build passes.
4. Test public routes:
   - `/`
   - `/courses`
   - `/register`
   - `/sign-in`
   - `/verify-certificate`
5. Test Supabase learner registration with strict invite rules.
6. Test Supabase sign-in and sign-out.
7. Confirm linked Hub `User` is created with `authProvider="supabase"` and `authProviderId`.
8. Confirm learner dashboard and My Courses render.
9. Confirm HRBA iframe launch includes `launchToken`.
10. Confirm HRBA iframe URL excludes raw IDs.
11. Confirm certificate verification works.
12. Promote to Production or deploy Production only after Preview QA passes.

## 8. Post-Deployment QA

Invite Daniel and Mulu only after QA passes.

QA checklist:

- Supabase sign-up works for invited emails.
- Supabase sign-in works.
- Linked Hub `User` is created.
- Learner can access dashboard and My Courses.
- HRBA iframe opens with `launchToken`.
- HRBA iframe URL excludes raw IDs.
- Final assessment callback records pass/fail.
- Certificate issues only after completion plus passing assessment.
- Public certificate verification works.
- Course feedback works.
- Monitoring and pilot monitoring show expected signals.
- `ME_VIEWER` cannot access broader admin operations.
- Mobile spot check passes.

## 9. Rollback And Stop Rules

Stop and do not invite learners if:

- migration cannot connect;
- migration status is unclear;
- Vercel environment variables are missing or placeholder-like;
- Supabase Site URL or redirects do not match Vercel URLs;
- registration fails;
- login fails;
- Hub profile is not linked to the Supabase user;
- HRBA launch is missing `launchToken`;
- raw Hub IDs appear in iframe URL or postMessage payloads;
- HRBA callback rejects valid progress;
- invalid token, mismatched session, or invalid origin is accepted;
- certificate issuing or public verification fails;
- private data is exposed.

## 10. S8A Acceptance Criteria

- `scripts/verify-s8-env-readiness.ts` exists.
- `npm run verify:s8-env-readiness` exists.
- This runbook exists.
- No production migration was run in S8A.
- No Vercel deployment was attempted in S8A.
- No real `.env` file was modified.
- No secrets were committed.
- Existing S4-S7, HRBA, R17, Prisma, lint, and build checks still pass.

## Next Step

S8B should perform the real Supabase migration and Vercel Preview deployment using this runbook, after external values and approvals are ready.
