# S8B-14G Server Session Resolution Fix Report

## Summary

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Hub production URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Final HRBA production course: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Final deployed Hub commit: `7a20768`
- Final production deployment ID: `dpl_HoE8kFQjrJpQQCvy8XMQu4wWmChW`
- Final production deployment URL: `https://cdp-lg-andy-g-pilot-xziq-etjr495l6-girumteenexus-8292s-projects.vercel.app`
- Final production deployment status: `READY`, aliased to the Hub production URL

## Root Cause

S8B-14F fixed the launch link so it performed a full document GET to the protected Hub external route, but that request still returned `307` to sign-in because the browser did not have a durable Hub-readable session cookie after the primary Supabase sign-in flow.

The first server-side fallback fix allowed `getCurrentSession()` to fall back to the signed Hub session cookie, but production testing showed the primary sign-in Server Action still did not emit a durable cookie to the browser. The signed-in `/learn` page was visible after the action redirect, while a fresh document request to `/learn/courses/.../external` still lacked a readable session and redirected to sign-in.

After adding an explicit route-handler sign-in response, a second narrow issue appeared: protected shell headers render a `/sign-out` GET link, and Next link prefetch could call that logout route and clear cookies without a user click. This was visible after the external page loaded: first-click launch worked, but returning to `/learn` redirected to sign-in. Disabling prefetch on sign-out links fixed that side effect.

## Files Changed

- `src/lib/auth/server.ts`
- `src/app/(auth)/sign-in/actions.ts`
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/api/sign-in/route.ts`
- `src/components/shell/AdminShell.tsx`
- `src/components/shell/AppShell.tsx`
- `src/components/shell/CreatorShell.tsx`
- `src/components/shell/LearnerShell.tsx`
- `src/components/shell/PublicShell.tsx`

## Fix Commits

- `e7e923c` - added Supabase-to-Hub session fallback behavior and set the signed Hub session in the Supabase sign-in path.
- `4277f74` - changed the primary sign-in form to POST to `/api/sign-in`; the route handler resolves the Hub session and explicitly sets the signed `cso_lh_session` cookie on the `303` redirect.
- `7a20768` - disabled prefetch on sign-out links so GET logout is not triggered by route prefetch.

## Checks Run

- `npm run build` - passed.
- `npm run lint` - passed.
- `npx prisma validate` - passed.
- `npm run prisma:validate` - passed.
- `git diff --check` - passed, with Windows line-ending warnings only.
- `npm run verify:s8-env-readiness` - ready with warnings.

Warnings:

- `SMTP_*` warning remains: SMTP variables are present; direct Hub emails should remain intentionally enabled.
- Local and Vercel builds warn that a `.env` file is detected.
- Local build still logs the known `getPublicCourseSummaries` fallback warning when local static page data collection cannot reach the local DB.

## Production Browser Evidence

Fresh-context Daniel production test after final deployment:

- Sign-in response: `303` from `/api/sign-in`.
- Sign-in response Set-Cookie names: `cso_lh_session`.
- URL after sign-in: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn`.
- Daniel dashboard visible: yes.
- Cookie names after sign-in: `cso_lh_session`, Supabase auth cookie name.
- Start course launch link count: `3`.
- First-click launch href: `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- External route document request cookie names: `cso_lh_session`, Supabase auth cookie name.
- External route response status: `200`.
- External route redirect location: none.
- URL after first click: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- Second sign-in required: no.
- Sign-in loop reproduced: no.
- Iframe exists: yes.
- Iframe visible: yes.
- Iframe src valid: yes, with `launchToken=[redacted]`.
- Iframe content loaded: yes.
- Returned to `/learn` after external page: authenticated yes.
- Cookie names after returning to `/learn`: `cso_lh_session`, Supabase auth cookie name.
- Parent console errors: none captured.
- Iframe console errors: none captured.
- Network errors before returning to `/learn`: only non-blocking aborted logo image requests during automation.

## Read-Only DB Evidence

- Daniel remains `ACTIVE`: yes.
- Daniel remains `PARTICIPANT`: yes.
- Daniel remains linked to HCDA: yes.
- Daniel HRBA enrollment count: `1`.
- Daniel HRBA enrollment status: `IN_PROGRESS`.
- Daniel HRBA enrollment progress percent: `0`.
- Daniel lesson progress count: `1`.
- Daniel lesson progress status: `IN_PROGRESS`.
- Daniel lesson progress source: `external-course-launch`.
- Daniel external launch token count: `18`.
- Latest token stored as hash: yes.
- Latest token expired: no.
- Latest token `lastUsedAt` present: no.
- Daniel quiz attempt count: `0`.
- Daniel certificate count: `0`.
- Mulu absent: yes.
- ANGAFA absent: yes.

## Safety Confirmations

- No Prisma migrations were run.
- No seed scripts were run.
- `db:setup:production` was not run.
- `register:hrba-external-course` was not run.
- No Mulu registration or invite happened.
- No learner/admin accounts were created.
- No final assessment was completed.
- No certificates were created.
- No HRBA production deployment or HRBA course code change happened.
- No certificate logic was changed.
- No progress callback contract was changed.
- No private env file was copied into the repo.
- No committed `.env` file was modified.
- No secret values, cookie values, raw launch tokens, token hashes, full DB connection strings, or raw internal IDs were printed or committed.

## Decision

First-click Start course now works on production. The second sign-in requirement is resolved, the iframe renders, and the Hub session survives returning from the external route.

Recommended next action: run the normal S8B-14 closure verification, then proceed to controlled Mulu registration only after that closure pass remains clean.
