# Vercel + Supabase Environment Checklist

Date: 2026-07-06

## 1. Purpose

Prepare Vercel and Supabase configuration for real pilot testing of the CSO Learning Hub with Supabase Auth, Supabase Postgres, Vercel hosting, and the existing deployed HRBA course.

This checklist is for environment and dashboard readiness only. It does not implement Supabase Auth, change runtime behavior, change Prisma schema, run migrations, modify real `.env` files, change HRBA deployment, or invite pilot learners.

## 2. Required Supabase Values

- Project URL: Supabase project API URL, used as `NEXT_PUBLIC_SUPABASE_URL`.
- Publishable key: Supabase anon/publishable key, used as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- `DATABASE_URL`: Supabase pooled ORM to Prisma/runtime connection string for app runtime.
- `DIRECT_URL`: Supabase direct connection string for Prisma migrations.
- Service role key: only needed if server admin actions are implemented. Do not use it in client/browser code.

## 3. Required Vercel Environment Variables

Set values separately for Production and Preview. Do not paste secrets into source control.

| Variable name | Where to get it | Production value status | Preview value status | Notes |
|---|---|---|---|---|
| `DATABASE_URL` | Supabase Dashboard, ORM to Prisma or pooled connection string | To set | To set | Use pooled/runtime connection for Vercel serverless app traffic. |
| `DIRECT_URL` | Supabase Dashboard, Direct connection string | To set | To set | Use for Prisma migrations only. |
| `SESSION_SECRET` | Generate a long random secret | To set | To set | Needed while legacy Hub session code remains during migration. |
| `NEXT_PUBLIC_APP_URL` | Vercel deployment URL | To set | To set | Must match the actual Hub URL for redirects and secure cookies. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings, API URL | To set | To set | Public Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Project Settings, publishable/anon key | To set | To set | Public client key, not the service role key. |
| `SUPABASE_SECRET_KEY` | Supabase Project Settings, service role key | Only if needed | Only if needed | Server-only. Never expose to browser code or prefix with `NEXT_PUBLIC_`. |
| `HRBA_EXTERNAL_COURSE_URL` | Approved HRBA deployment | Set to approved URL | Set to approved URL | Use `https://pilot-hrba-e-learn-v1-wajj.vercel.app`. |
| `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS` | Approved HRBA deployment origin | Set to approved origin | Set to approved origin | Use `https://pilot-hrba-e-learn-v1-wajj.vercel.app`. |
| `PILOT_ACCESS_CODE` | Programme owner | To set, or use `PILOT_ACCESS_CODES` | To set, or use `PILOT_ACCESS_CODES` | Private pilot code. Do not commit. |
| `PILOT_ACCESS_CODES` | Programme owner | To set, or use `PILOT_ACCESS_CODE` | To set, or use `PILOT_ACCESS_CODE` | Optional comma-separated private codes. Do not commit. |
| `PILOT_REGISTRATION_MODE` | Pilot release decision | Set to `strict` | Set to `strict` | Strict mode limits registration to invited emails. |
| `PILOT_INVITED_EMAILS` | Internal Pilot 0 invite list | Set for approved invitees | Set for approved invitees | For Internal Pilot 0: `agiledatawise@gmail.com,essetlab@gmail.com`. |
| `SMTP_HOST` | Email provider | Only if Hub sends emails directly | Only if Hub sends emails directly | Supabase Auth emails are configured in Supabase dashboard. |
| `SMTP_PORT` | Email provider | Only if Hub sends emails directly | Only if Hub sends emails directly | Usually `587` or `465`. |
| `SMTP_USER` | Email provider | Only if Hub sends emails directly | Only if Hub sends emails directly | Do not commit. |
| `SMTP_PASS` | Email provider | Only if Hub sends emails directly | Only if Hub sends emails directly | Do not commit. |
| `SMTP_SECURE` | Email provider | Only if Hub sends emails directly | Only if Hub sends emails directly | `true` for implicit TLS, usually port `465`; otherwise `false`. |
| `EMAIL_FROM` | Email provider/programme sender | Only if Hub sends emails directly | Only if Hub sends emails directly | Sender identity for Hub direct emails. |

## 4. Supabase Dashboard Settings

- Site URL: set to the Vercel Production Hub URL.
- Redirect URLs:
  - Production Hub URL.
  - Production auth callback route once implemented.
  - Production password reset/update route once implemented.
  - Preview deployment URL(s) used for QA, if Preview auth testing is enabled.
- Email + password provider: enabled.
- Email confirmation decision:
  - Decide before Daniel and Mulu are invited.
  - For a small internal pilot, confirmation may be disabled only if the release owner accepts the tradeoff.
  - For broader real-pilot invitations, confirmation is recommended once custom SMTP is configured.
- Custom SMTP:
  - Configure before broad real-pilot invitations.
  - Use a programme-controlled sender and verify deliverability before sending invite guidance.
- Password reset:
  - Confirm whether a Hub password reset/update route exists after Supabase Auth implementation.
  - Do not invite pilot learners for self-service access until reset behavior is tested or a support workaround is agreed.

## 5. Internal Pilot 0 Invited Emails

- `agiledatawise@gmail.com`
- `essetlab@gmail.com`

## 6. Security Notes

- Never commit real secrets.
- Never expose the Supabase service role key in browser/client code.
- Never prefix the service role key with `NEXT_PUBLIC_`.
- Vercel environment variable changes require a redeployment before the running app sees them.
- Supabase Auth URL/key values are not the same as the Prisma `DATABASE_URL`.
- `DATABASE_URL` should be the pooled/runtime connection string.
- `DIRECT_URL` should be the direct/migration connection string.
- Keep `.env` and other local secret files out of git.

## 7. S1 Acceptance Criteria

- `.env.example` contains placeholder-only Supabase/Vercel variables.
- This checklist exists at `docs/pilot-release/vercel-supabase-env-checklist.md`.
- No real secrets are committed.
- No runtime/source behavior is changed.
- No Prisma schema changes or migrations are created.
- No HRBA deployment, callback, or certificate logic is changed.
- Git status is clean after commit.
