# S8B-14D Sign-In Handoff Fix Report

## Scope

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Hub production URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- HRBA production URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Learner account: Daniel, `agiledatawise@gmail.com`
- S8B-14C report commit: `2a34c80`

Daniel's private test credentials were loaded from `D:\CSO_Learning_Hub_Secrets\s8b-real-pilot.env` without printing values.

## S8B-14C Summary

S8B-14C proved:

- Daniel could sign in and reach `/learn`.
- The first dashboard `Start course` click redirected back to `/sign-in?next=/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- Signing in through that protected-route `next` value loaded the external course page.
- The iframe existed and was visible.
- The iframe src was valid with `launchToken` redacted.
- HRBA iframe content loaded with `#root` and course text.
- Direct iframe URL loaded.
- Direct HRBA `/module-1` rendered.
- Daniel quiz attempts remained `0`.
- Daniel certificates remained `0`.
- Mulu remained absent.

## Environment And Branch Checks

Initial checks:

- `git branch --show-current`: `feature/supabase-auth-vercel-real-pilot`
- `git status --short`: clean
- `git log --oneline -10`: latest commit before this slice was `2a34c80 Add Daniel authenticated iframe evidence report`

Required environment values were present:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `HRBA_EXTERNAL_COURSE_URL`
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`
- `DANIEL_TEST_EMAIL`
- `DANIEL_TEST_PASSWORD`

No secret values, passwords, full connection strings, raw internal IDs, raw launch tokens, or token hashes were printed.

## Code Path Inspection

Relevant findings:

- The sign-in page posts to `signInWithPassword`.
- With Supabase config present, `signInWithPassword` calls `signInWithSupabasePassword`.
- `signInWithSupabasePassword` uses `createSupabaseServerClient()` and `supabase.auth.signInWithPassword()`.
- Supabase SSR cookies are written through `@supabase/ssr` and Next `cookies()`.
- After Supabase sign-in, the Hub profile is resolved by `resolveSupabaseHubSession()`.
- The legacy Hub session cookie is cleared after Supabase sign-in.
- The sign-in action uses a server `redirect()` to the safe `next` path or role default path.
- `/learn` and `/learn/courses/[slug]/external` are served by the same catch-all learner page.
- Both `/learn` and the HRBA external route use the same `getCurrentSession()` helper.
- `getCurrentSession()` uses Supabase cookie-backed `supabase.auth.getUser()` when Supabase public config is present.
- The external route redirects to sign-in when `getCurrentSession()` returns null.
- Dashboard and My Courses `Start course` controls are ordinary Next `Link` components through `ActionButton`.
- Before the fix, those auth-sensitive external launch links used default Next prefetch behavior.

## Reproduction Evidence

S8B-14C provided the strongest reproduction evidence:

- Daniel reached `/learn` after sign-in.
- First `Start course` click reached `/sign-in?next=/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- Signing in through that `next` route opened the external course page and loaded the iframe.

A fresh production browser attempt in this slice did not complete sign-in and was not treated as new root-cause evidence.

## Root Cause

Root cause: default Next link prefetch on protected external-course launch links could cache or reuse an unauthenticated redirect result for `/learn/courses/[slug]/external`, so the first click after sign-in could send Daniel back to sign-in even though the dashboard had rendered as authenticated.

Classification:

- Most likely category: link prefetch/stale redirect issue.
- Secondary category: protected server route depends on cookie-backed Supabase session resolution.

Evidence:

- `/learn` and the external route use the same session helper, so this is not a different-auth-helper issue.
- The external route is dynamic and cookie-dependent through `getCurrentSession()`, so this is not a static route configuration issue.
- The iframe and HRBA runtime work once the external route is reached.
- The first-click redirect happens before iframe launch, not inside HRBA.
- The Start controls were default-prefetching Next links to the protected external route.

## Fix Applied

Fix applied: yes.

Fix commit: `9aa2e88 Fix sign-in handoff for HRBA external launch`

Changed files:

- `src/components/ui/ActionButton.tsx`
- `src/components/learner/LearnerDashboard.tsx`
- `src/components/learner/LearnerMyCourses.tsx`

Implementation:

- `ActionButton` now accepts and passes Next `Link`'s `prefetch` prop.
- Dashboard external launch action links set `prefetch={false}` only when the href matches `/learn/courses/.../external`.
- My Courses external launch action links set `prefetch={false}` only when the href matches `/learn/courses/.../external`.

This keeps prefetch behavior unchanged for ordinary links and disables it only for protected external-course launch links.

## Checks Run

Code-change checks:

- `npm run build`: passed
- `npm run lint`: passed
- `npx prisma validate`: passed
- `npm run prisma:validate`: passed
- `git diff --check`: passed

Build warnings:

- Local `npm run build` emitted the known fallback warning: `getPublicCourseSummaries: using fallback course data. PrismaClientKnownRequestError (ECONNREFUSED)`.
- Vercel preview build emitted: `Detected .env file, it is strongly recommended to use Vercel's env handling instead`.

## Preview Deployment

Preview deployment was attempted and completed.

- Vercel project: `cdp-lg-andy-g-pilot-xziq`
- Preview URL: `https://cdp-lg-andy-g-pilot-xziq-ceg4i0xtr-girumteenexus-8292s-projects.vercel.app`
- Deployment ID: `dpl_BzVjwxhwe9bXWfEdfEFmfvtGPoQ8`
- Ready state: `READY`
- Production deployment: not attempted
- Promotion/alias: not attempted

Preview browser test result:

- Preview `/sign-in` could not be tested because the preview deployment redirects to Vercel SSO.
- HTTP check for preview `/sign-in`: `302` to `https://vercel.com/sso-api?...`
- HTTP check for preview `/`: `302` to `https://vercel.com/sso-api?...`
- Daniel first-click flow on preview: not completed because the preview is protected by Vercel SSO.
- Second sign-in required on preview: not determined because the preview is SSO-protected.
- Iframe result on preview: not determined because the preview is SSO-protected.

Temporary local Vercel link artifacts created by the CLI were removed and were not committed.

## Daniel DB State After Slice

Read-only post-slice state:

- Daniel exists: yes
- HRBA course exists: yes
- Daniel HRBA enrollment count: `1`
- Latest enrollment status: `IN_PROGRESS`
- Latest enrollment progress: `0`
- Daniel HRBA lesson progress count: `1`
- Latest lesson progress status: `IN_PROGRESS`
- Latest lesson progress source: `external-course-launch`
- Daniel HRBA launch token count: `8`
- Latest token stored as hash: yes
- Latest token expired: no
- Latest token lastUsedAt present: no
- Latest token allowed origin matches HRBA URL: yes
- Latest token portal origin matches Hub URL: yes
- Daniel quiz attempt count: `0`
- Daniel certificate count: `0`
- Mulu absent: yes

The launch token count increased during allowed browser reproduction attempts. No quiz attempt, final assessment submission, certificate, Mulu registration, or learner account creation occurred.

## Remaining Warnings

- Local build warning: fallback public course data warning during static generation when the build process could not connect to the database.
- Vercel preview is SSO-protected, blocking Daniel preview browser verification.
- SMTP warning remains from prior environment readiness checks: `SMTP_*` variables are present; confirm Hub direct emails are intentionally enabled.

## Recommended Next Action

Owner manual retest on an accessible deployment is recommended next.

Options:

- Temporarily allow access to the preview URL without Vercel SSO and rerun Daniel first-click verification there.
- If preview access cannot be opened, review the small fix and promote the Hub fix to production, then run owner manual retest on production.

After accessible-deployment verification, rerun normal S8B-14 verification.

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
- No new learner accounts were created.
- The HRBA course was not completed.
- The final assessment was not completed or submitted.
- No certificates were created.
- The standalone HRBA course repo was not changed.
- Hub production was not deployed.
- HRBA production was not deployed.
- Certificate logic was not changed.
- Progress callback contract was not changed.
- No broad refactors were made.
