# S8B-14F Document Navigation HRBA Launch Fix Report

## Scope

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Hub production URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- HRBA production URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- S8B-14E production deployment ID: `dpl_4J3eRCAP7k4FT9fJRsoX2NFBGZth`
- S8B-14E report commit: `d3a436e`
- S8B-14F fix commit: `14b9aaa`

Daniel's private test credentials were loaded from `D:\CSO_Learning_Hub_Secrets\s8b-real-pilot.env` without printing values.

## Root Cause Summary

S8B-14E showed that disabling Next prefetch was insufficient. Daniel could sign in and reach `/learn`, but the first HRBA `Start course` click still redirected to:

```text
/sign-in?next=/learn/courses/applying-human-rights-based-approach-in-cso-practice/external
```

The working theory for S8B-14F was that client-side Next navigation into the protected external route was preserving stale auth or redirect state. This slice changed only protected HRBA external launch links to use full document navigation.

## Current Launch Link Inspection

Before the fix:

- `ActionButton` still rendered Next `Link` for HRBA external launch hrefs.
- Prefetch was disabled for `/learn/courses/.../external` hrefs.
- Navigation still remained client-side through Next `Link`.
- Dashboard and My Courses were the only learner surfaces rendering the protected HRBA `Start course` / `Continue` links.

Smallest safe scope:

- Add an explicit `forceDocumentNavigation` prop to `ActionButton`.
- Use it only when the href matches `/learn/courses/.../external`.
- Preserve styling, disabled/loading behavior, and ordinary Next `Link` behavior for all other actions.

## Files Changed

Source files changed:

- `src/components/ui/ActionButton.tsx`
- `src/components/learner/LearnerDashboard.tsx`
- `src/components/learner/LearnerMyCourses.tsx`

Report file:

- `docs/pilot-release/s8b-14f-document-navigation-launch-fix-report.md`

## Exact Fix Summary

Implementation:

- `ActionButton` now accepts `forceDocumentNavigation`.
- When `forceDocumentNavigation` is true and `href` is present, `ActionButton` renders a styled plain `<a href="...">`.
- Otherwise, `ActionButton` continues rendering Next `Link`.
- Dashboard and My Courses pass `forceDocumentNavigation` only for hrefs matching `/learn/courses/.../external`.
- A short code comment explains that protected external launches use document navigation to avoid stale client auth state after Supabase sign-in.

This did not change public course links, sign-in/register links, iframe generation, callback logic, certificate logic, or HRBA production code.

## Checks Run

Pre-deploy checks:

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

The current branch HEAD was deployed to the existing Hub production Vercel project only.

- Vercel project: `cdp-lg-andy-g-pilot-xziq`
- Production deployment ID: `dpl_AzAPZLqZywLapNvwse792TPwTUu3`
- Production deployment URL: `https://cdp-lg-andy-g-pilot-xziq-agwrmmsn7-girumteenexus-8292s-projects.vercel.app`
- Production alias: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Deployment status: `READY`
- Deployment target: production
- Deployed commit: `14b9aaa`

Vercel build warning:

- `Detected .env file, it is strongly recommended to use Vercel's env handling instead`.

Temporary local Vercel link artifacts were removed and were not committed.

## Daniel Authenticated Browser Result

Browser automation was run against production using Daniel's private credentials.

Result after sign-in:

- URL after sign-in: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn`
- Daniel visible: yes
- `Sign out` visible: yes
- HRBA launch links found: 3
- Launch elements were anchors: yes

Result after first HRBA `Start course` click:

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

Network evidence:

- The protected external route was requested as a full document GET, not only an RSC request.
- `GET /learn/courses/applying-human-rights-based-approach-in-cso-practice/external` returned `307`.
- The redirect target was `/sign-in?next=/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.

Console/network errors:

- Parent console errors: none captured.
- Iframe console errors: none captured because iframe was not reached.
- Network aborted entries were observed for background/prefetch/navigation requests, but the decisive evidence was the full external route GET returning `307`.

Conclusion: the document-navigation fix deployed successfully, but the first-click issue is not resolved. The remaining problem is not client-side Next navigation. The protected external route is receiving a fresh document request and still resolving no session.

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
| Daniel external launch token count | 12 |
| Latest token stored as hash | Yes |
| Latest token expired | No |
| Latest token lastUsedAt present | No |
| Daniel quiz attempt count | 0 |
| Daniel certificate count | 0 |
| Mulu absent | Yes |
| ANGAFA absent | Yes |

The launch token count increased during allowed reproduction attempts. No quiz attempt, final assessment submission, certificate, Mulu registration, ANGAFA account, or learner account creation occurred.

## Updated Diagnosis

The full-document navigation fix was insufficient. Since the protected external route now receives a normal document GET and still returns `307`, the next likely issue is server-side session resolution for the protected route immediately after Supabase sign-in.

Most likely repair area:

- Inspect what cookies are available after Daniel signs in and what cookies are received by `/learn/courses/.../external`.
- Compare why `/learn` renders Daniel's authenticated dashboard while the following protected external route returns unauthenticated.
- Consider a very narrow server-side session handoff fix, such as preserving a Hub session fallback after Supabase sign-in or otherwise making `getCurrentSession()` consistent across protected learner routes.

This should be handled in a separate focused repair slice because it touches auth/session behavior more directly than this navigation-only slice.

## Recommended Next Action

Continue repair before controlled Mulu registration.

Recommended next slice:

- Diagnose Supabase/Hub cookie availability and `getCurrentSession()` behavior across `/learn` and `/learn/courses/.../external`.
- Apply the smallest Hub-side session consistency fix.
- Run build/lint/Prisma validation.
- Deploy to production or an accessible preview.
- Rerun Daniel first-click HRBA launch verification.
- Run normal S8B-14 closure verification only after Daniel first-click launch succeeds.

Do not proceed to controlled Mulu registration until Daniel's first-click HRBA launch succeeds without a second sign-in.

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
- Supabase Auth logic was not broadly changed.
- No broad refactors were made.
