# S8B-14E Hub Production Sign-In Handoff Verification Report

## Scope

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Hub production URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- HRBA production URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Deployed commit: `5b2805b`
- S8B-14D fix commit: `9aa2e88`
- S8B-14D report commit: `5b2805b`

Daniel's private test credentials were loaded from `D:\CSO_Learning_Hub_Secrets\s8b-real-pilot.env` without printing values.

## Pre-Deploy Confirmation

Initial checks:

- Branch: `feature/supabase-auth-vercel-real-pilot`
- `git status --short`: clean
- `git log --oneline -12` included:
  - `5b2805b Add sign-in handoff fix report`
  - `9aa2e88 Fix sign-in handoff for HRBA external launch`

S8B-14D fix scope was inspected and confirmed limited to:

- `src/components/ui/ActionButton.tsx`
- `src/components/learner/LearnerDashboard.tsx`
- `src/components/learner/LearnerMyCourses.tsx`

The source fix only:

- passes Next `Link`'s `prefetch` prop through `ActionButton`;
- disables prefetch for protected `/learn/courses/.../external` launch links on Dashboard and My Courses.

No auth rewrite, database change, certificate change, HRBA callback change, HRBA deployment change, or broad refactor was included.

## Environment Presence

Required private/local environment variables were present:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `HRBA_EXTERNAL_COURSE_URL`
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`
- `DANIEL_TEST_EMAIL`
- `DANIEL_TEST_PASSWORD`

Expected public shape checks:

- `NEXT_PUBLIC_APP_URL` matched `https://cdp-lg-andy-g-pilot-xziq.vercel.app`.
- `HRBA_EXTERNAL_COURSE_URL` matched `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS` included `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.

No secret values, passwords, full connection strings, raw internal IDs, raw launch tokens, or token hashes were printed.

## Final Pre-Production Checks

Checks before production deploy:

- `npm run build`: passed
- `npm run lint`: passed
- `npx prisma validate`: passed
- `npm run prisma:validate`: passed
- `git diff --check`: passed
- `git status --short`: clean after restoring generated `next-env.d.ts`

Warnings:

- Local build emitted the known fallback warning: `getPublicCourseSummaries: using fallback course data. PrismaClientKnownRequestError (ECONNREFUSED)`.
- `npm run verify:s8-env-readiness`: ready with warnings.
- Remaining env warning: `SMTP_*` variables are present; confirm Hub direct emails are intentionally enabled.

## Production Deployment

Deployment command targeted the existing Hub Vercel project only.

- Vercel project: `cdp-lg-andy-g-pilot-xziq`
- Production deployment ID: `dpl_4J3eRCAP7k4FT9fJRsoX2NFBGZth`
- Production deployment URL: `https://cdp-lg-andy-g-pilot-xziq-f4p3l7utc-girumteenexus-8292s-projects.vercel.app`
- Production alias: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Deployment status: `READY`
- Deployment target: production
- Deployed commit: `5b2805b`

Vercel build warning:

- `Detected .env file, it is strongly recommended to use Vercel's env handling instead`.

Temporary local Vercel link artifacts were removed and were not committed.

## Public Route Smoke

Smoke checks after production deploy:

| Route | HTTP status | Strict server-error marker | Result |
| --- | ---: | --- | --- |
| `/` | 200 | No | Pass |
| `/courses` | 200 | No | Pass |
| `/sign-in` | 200 | No | Pass |
| `/learn` unauthenticated | 307 to `/sign-in?next=%2Flearn` | Not applicable | Expected |

Unauthenticated protected-route behavior was expected.

## Daniel Authenticated Browser Verification

Browser automation was run against production with Daniel's private credentials.

Result after sign-in:

- URL after sign-in: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn`
- Daniel visible: yes
- `Sign out` visible: yes
- Start course links for HRBA: 3

Result after first `Start course` click:

- URL after click: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/sign-in?next=%2Flearn%2Fcourses%2Fapplying-human-rights-based-approach-in-cso-practice%2Fexternal`
- First-click Start course works: no
- Second sign-in required: yes
- Sign-in loop reproduced: yes
- Iframe exists: no
- Iframe visible: no
- Iframe src valid: no iframe reached
- `embed=portal`: no iframe reached
- `portalOrigin`: no iframe reached
- `courseSlug`: no iframe reached
- `launchToken`: no iframe reached
- Iframe content loaded: no iframe reached

Console/network findings:

- Parent console errors: none captured.
- Iframe console errors: none captured because iframe was not reached.
- Relevant network observations:
  - sign-in POST returned `303`.
  - protected external route RSC request returned `200`.
  - sign-in RSC response for the external route `next` destination returned `200`.
  - several aborted RSC prefetch/navigation requests were observed during navigation.

Conclusion: the S8B-14D no-prefetch fix was deployed, but it did not resolve the first-click production handoff. The remaining issue is still Hub-side and occurs before the HRBA iframe launches.

## Daniel DB State After Test

Read-only database verification after the production browser test:

| Check | Result |
| --- | --- |
| Daniel user exists | Yes |
| Daniel remains `PARTICIPANT` | Yes |
| Daniel remains linked to HCDA | Yes |
| Daniel HRBA enrollment count | 1 |
| Latest enrollment status | `IN_PROGRESS` |
| Latest enrollment progress | 0 |
| Daniel lesson progress count | 1 |
| Latest lesson progress status | `IN_PROGRESS` |
| Latest lesson progress source | `external-course-launch` |
| Daniel external launch token count | 11 |
| Latest token stored as hash | Yes |
| Latest token expired | No |
| Latest token lastUsedAt present | No |
| Daniel quiz attempt count | 0 |
| Daniel certificate count | 0 |
| Mulu absent | Yes |
| ANGAFA absent | Yes |

The launch token count increased during allowed browser reproduction attempts. No quiz attempt, final assessment submission, certificate, Mulu registration, ANGAFA account, or learner account creation occurred.

## Current Diagnosis

The deployed no-prefetch fix was insufficient.

Updated likely cause:

- The protected HRBA launch link still uses client-side Next navigation.
- The external route RSC navigation is still resolving as unauthenticated and returns the sign-in route payload.
- The remaining issue is likely a client-side navigation/session handoff problem rather than a prefetch-only problem.

Recommended repair direction:

- Make protected external-course launch actions perform a full document navigation instead of client-side Next navigation.
- Keep the change scoped to `/learn/courses/.../external` launch links.
- Retest Daniel first-click flow after that change.

## Recommended Next Action

Repair the remaining Hub-side issue before proceeding to controlled Mulu registration.

Recommended next slice:

- Replace protected external launch `Link` navigation with a full browser navigation for `/learn/courses/.../external` links only.
- Run build/lint/Prisma validation.
- Deploy Hub production or accessible preview.
- Rerun Daniel first-click verification.
- Then run normal S8B-14 verification.

Do not proceed to Mulu registration until Daniel's first-click HRBA launch succeeds without a second sign-in.

## Safety Confirmations

- Daniel's password was not printed.
- Secret values were not printed.
- Full connection strings were not printed.
- Raw internal IDs were not printed.
- Raw launch tokens were not printed.
- Token hashes were not printed.
- Launch tokens in URLs were redacted as `[redacted]`.
- The private env file was not copied or committed.
- Committed `.env` files were not modified.
- No migrations were run.
- No seed scripts were run.
- `db:setup:production` was not run.
- `register:hrba-external-course` was not run.
- Mulu was not invited or registered.
- ANGAFA was not created.
- No new learner accounts were created.
- The HRBA course was not completed.
- The final assessment was not completed or submitted.
- No certificates were created.
- The standalone HRBA course repo was not changed.
- HRBA production was not deployed or changed.
- Certificate logic was not changed.
- Progress callback contract was not changed.
- No broad refactors were made.
