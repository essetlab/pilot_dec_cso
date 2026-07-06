# S8B-14 Daniel Launch Resume Closure Report

## Summary

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Hub production URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Final HRBA production URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Closure decision: proceed to controlled Mulu registration.

## S8B-14G Fix Summary

S8B-14G resolved Daniel's protected HRBA external launch flow by ensuring Supabase sign-in leaves a durable server-readable Hub session for fresh document requests. The final fix set was:

- `e7e923c` - server session fallback.
- `4277f74` - `/api/sign-in` route handler explicitly sets `cso_lh_session`.
- `7a20768` - disables sign-out link prefetch.
- S8B-14G report commit: `bd1ae77`.

The deployed Hub production fix remains `READY` at `https://cdp-lg-andy-g-pilot-xziq.vercel.app`. No Hub or HRBA deployment was performed in this closure slice.

## Hub Public Route Smoke

| Route | Status | Server error marker | Expected behavior |
| --- | ---: | --- | --- |
| `/` | `200` | no | public route served |
| `/courses` | `200` | no | public route served |
| `/sign-in` | `200` | no | sign-in route served |
| `/learn` unauthenticated | `307` | no | redirects to `/sign-in` |

Unauthenticated `/learn` redirect behavior: expected yes.

## HRBA Production Route Smoke

| Route | Status | App shell served | Vercel NOT_FOUND absent | Server error marker |
| --- | ---: | --- | --- | --- |
| `/` | `200` | yes | yes | no |
| `/module-1` | `200` | yes | yes | no |
| `/module-2` | `200` | yes | yes | no |
| `/module-3` | `200` | yes | yes | no |
| `/module-4` | `200` | yes | yes | no |
| `/module-5` | `200` | yes | yes | no |
| `/final-assessment/cover` | `200` | yes | yes | no |

## Daniel Browser Closure Result

Fresh browser context using Daniel's private credentials:

- URL after sign-in: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn`
- Daniel dashboard visible: yes.
- HRBA course card visible: yes.
- First-click launch href: `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`
- URL after first Start course click: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`
- External route response status: `200`.
- Second sign-in required: no.
- Sign-in loop reproduced: no.
- Iframe exists: yes.
- Iframe visible: yes.
- Iframe src valid: yes, with `launchToken=[redacted]`.
- Iframe includes `embed=portal`: yes.
- Iframe includes `portalOrigin`: yes.
- Iframe includes `courseSlug`: yes.
- Iframe includes `launchToken`: yes.
- Iframe content loaded: yes.
- Parent console errors: none captured.
- Iframe console errors: none captured.
- Network errors before return: non-blocking aborted logo image requests only.
- Returned to `/learn` authenticated: yes.

Iframe/token safety result: token value was redacted; no raw launch token, token hash, cookie value, password, full connection string, or raw internal ID was printed or committed.

## Daniel Read-Only DB State

- Daniel user exists: yes.
- Daniel remains active/enabled: yes.
- Daniel auth provider is Supabase: yes.
- Daniel auth provider ID present: yes, value not printed.
- Daniel remains `PARTICIPANT`: yes.
- Daniel remains linked to HCDA: yes.
- Duplicate Daniel users: no.
- Daniel HRBA enrollment count: `1`.
- Daniel HRBA enrollment status: `IN_PROGRESS`.
- Daniel lesson progress count: `1`.
- Daniel lesson progress status: `IN_PROGRESS`.
- Daniel lesson progress source: `external-course-postmessage`.
- Daniel external launch token count: `21`.
- Latest token stored as hash: yes.
- Latest token expired: no.
- Latest token `lastUsedAt` present: yes.
- Latest token allowed origin matches HRBA URL: yes.
- Latest token portal origin matches Hub URL: yes.
- Daniel quiz attempt count: `0`.
- Daniel certificate count: `0`.
- Mulu absent: yes.
- ANGAFA absent: yes.

Quiz/certificate counts remain zero: yes.

## Safe Checks

- `npm run verify:s8-env-readiness` - passed as ready with warnings.
- `npx prisma validate` - passed.
- `npm run prisma:validate` - passed.
- `git diff --check` - passed.
- `git status --short` - clean before report creation.

Remaining warnings:

- `SMTP_*` warning remains: SMTP variables are present; ensure Hub direct emails are intentionally enabled.

## Safety Confirmations

- No migrations were run.
- No seed scripts were run.
- `db:setup:production` was not run.
- `register:hrba-external-course` was not run.
- No Mulu registration or invite happened.
- No learner accounts were created.
- No HRBA course completion or final assessment submission happened.
- No certificates were created.
- No certificate logic was changed.
- No progress callback contract was changed.
- No code changes were made in this closure slice.
- No private env file was copied into the repo.
- No committed `.env` files were modified.
- No Hub production deployment happened in this closure slice.
- No HRBA production deployment happened in this closure slice.
- No secrets, cookie values, raw launch tokens, token hashes, full connection strings, raw auth provider IDs, or other raw internal IDs were printed or committed.

## Recommendation

Proceed to controlled Mulu registration.
