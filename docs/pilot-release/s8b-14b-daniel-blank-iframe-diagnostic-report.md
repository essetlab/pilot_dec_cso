# S8B-14B Daniel Blank Iframe Diagnostic Report

## Scope

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Hub URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- HRBA URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Learner checked: Daniel, `agiledatawise@gmail.com`
- Course slug checked: `applying-human-rights-based-approach-in-cso-practice`

This diagnostic inspected the Hub launch path, HRBA public routes, frame headers, Daniel's non-secret course state, and non-migration validation checks. No migrations, deployments, seed scripts, account creation, invites, registrations, HRBA code changes, certificate changes, launchToken contract changes, or database mutations were performed.

## Observed Issue

Owner screenshots show Daniel signed in, the dashboard and course card rendering, and the external course page header rendering. The embedded HRBA area is blank/white and course progress remains at 0%. The owner also observed a possible sign-in loop after clicking Start/learn.

## Environment Readiness

The private local environment file was loaded without printing values.

Required variable presence:

| Variable | Status |
| --- | --- |
| `DATABASE_URL` | Present |
| `NEXT_PUBLIC_APP_URL` | Present |
| `NEXT_PUBLIC_SUPABASE_URL` | Present |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Present |
| `HRBA_EXTERNAL_COURSE_URL` | Present |
| `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS` | Present |
| `PILOT_REGISTRATION_MODE` | Present |
| `PILOT_INVITED_EMAILS` | Present |
| `PILOT_ACCESS_CODE` or `PILOT_ACCESS_CODES` | Present |

Expected shape checks:

- `NEXT_PUBLIC_APP_URL` matches the Hub Vercel URL.
- `HRBA_EXTERNAL_COURSE_URL` matches the HRBA Vercel URL.
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS` includes the HRBA Vercel URL.

`npm run verify:s8-env-readiness` completed as ready with warnings:

- Blocking issues: 0
- Warnings: 1
- Warning variable group: `SMTP_*`
- Warning meaning: SMTP variables are present; confirm Hub direct emails are intentionally enabled.

No secret values were printed.

## Hub Launch Path

Daniel's expected protected course route is:

`/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`

The route is protected by `getCurrentSession()`. If no Hub session is resolved, the route redirects to `/sign-in` with a redacted `next` parameter. That behavior was confirmed with an unauthenticated request and is expected.

The authenticated external route calls `getExternalCourseLaunchData(courseSlug, session)` and renders `ExternalCourseFrame`. The frame component renders an iframe using `launchData.iframeSrc`.

Expected iframe URL shape, with the token redacted:

```text
https://pilot-hrba-e-learn-v1-wajj.vercel.app/?embed=portal&portalOrigin=https%3A%2F%2Fcdp-lg-andy-g-pilot-xziq.vercel.app&courseSlug=applying-human-rights-based-approach-in-cso-practice&launchToken=[redacted]
```

The iframe src appears valid by code path and stored state:

- HRBA host matches the configured HRBA URL.
- `embed=portal` is added.
- `portalOrigin` matches the Hub URL.
- `courseSlug` matches the HRBA course slug.
- A launch token is generated and passed only in the iframe URL.
- Raw internal Hub IDs are not part of the expected iframe URL.
- Raw launch token values and token hashes were not printed.

If launch data were missing, the Hub route would render `notFound()` rather than a blank iframe panel. Because the screenshots show the external course shell rendering, the Hub route likely resolved Daniel's session and produced launch data at least for that page load.

## HRBA Route And Frame Header Checks

Public HRBA route smoke checks:

| HRBA route | HTTP status | App shell present | Not-found marker absent |
| --- | ---: | --- | --- |
| `/` | 200 | Yes | Yes |
| `/module-1` | 200 | Yes | Yes |
| `/module-2` | 200 | Yes | Yes |
| `/module-3` | 200 | Yes | Yes |
| `/module-4` | 200 | Yes | Yes |
| `/module-5` | 200 | Yes | Yes |
| `/final-assessment/cover` | 200 | Yes | Yes |

Frame header checks:

| URL shape | HTTP status | `X-Frame-Options` | CSP present | `frame-ancestors` |
| --- | ---: | --- | --- | --- |
| HRBA root | 200 | Not present | No | Not present |
| HRBA iframe-shaped URL with redacted token | 200 | Not present | No | Not present |

Conclusion: frame headers do not appear to block embedding.

## Daniel Course State

Non-secret database inspection found:

- Daniel user exists.
- Daniel is active.
- Daniel is linked to Supabase auth.
- Daniel has `PARTICIPANT` role.
- Daniel is associated with HCDA.
- Duplicate Daniel Hub users were not found.
- Daniel has one HRBA enrollment.
- Daniel's HRBA enrollment status is `IN_PROGRESS`.
- Daniel's HRBA enrollment progress is `0`.
- Daniel has one HRBA lesson progress record.
- Daniel's HRBA lesson progress status is `IN_PROGRESS`.
- Daniel's HRBA lesson progress source is `external-course-launch`.
- Daniel has four HRBA launch token records, consistent with repeated launch/resume attempts.
- Latest Daniel HRBA launch token is stored as a hash only.
- Latest token is unexpired.
- Latest token is scoped to Daniel's HRBA enrollment.
- Latest token allowed origin matches the HRBA URL.
- Latest token portal origin matches the Hub URL.
- Latest token has not been used by a callback yet.
- Daniel has zero quiz attempts.
- Daniel has zero certificates.
- Mulu and Angafa activity were not created.

The latest token being unused is consistent with the blank iframe symptom: the Hub generated a launch, but the embedded course did not successfully report progress back to the Hub.

## Sign-In Redirect Assessment

Unauthenticated access to the protected external route redirects to sign-in. That is expected.

A sign-in loop would be suspicious only if it happens while Daniel still has a valid Hub session. The screenshots show Daniel signed in and the external course page shell rendered, so the blank iframe itself does not look like a simple Hub session redirect. Browser console and network evidence from the owner session is needed to determine whether a later navigation or reload loses the session.

## Likely Cause

Most likely cause: the HRBA app is loading in the iframe but failing during its embedded-mode runtime, or the browser is blocking/failing a subresource or runtime step inside the iframe.

Less likely based on current evidence:

- Hub iframe src construction is invalid: not supported by inspected code path and state.
- HRBA frame headers block embedding: not supported by header checks.
- Daniel token is expired: latest token is unexpired.
- Daniel has no Hub enrollment: Daniel has an HRBA enrollment and lesson progress record.
- Progress is already completed/certified: Daniel has no quiz attempts or certificates.

## Recommended Next Action

Collect browser console and network evidence from the owner reproduction session before making code changes.

Minimum evidence to capture:

- Console errors from the top Hub page.
- Console errors from the HRBA iframe context, if browser devtools exposes it.
- Network status for the iframe document request.
- Network status for the HRBA JavaScript asset request.
- Any blocked mixed-content, CSP, CORS, storage, or postMessage errors.
- Whether the iframe document request URL has `embed=portal`, the correct `portalOrigin`, the expected `courseSlug`, and a redacted `launchToken` parameter.

## Supporting Checks

Commands run:

- `git branch --show-current`
- `git status --short`
- `git log --oneline -8`
- Private environment load from outside the repo, without printing values
- `npm run verify:s8-env-readiness`
- HRBA public route smoke checks
- HRBA frame header checks
- Hub public route smoke checks
- Unauthenticated protected route redirect check
- Read-only Daniel course state inspection
- `npx prisma validate`
- `npm run prisma:validate`
- `git diff --check`
- `git status --short`

Validation results:

- `npm run verify:s8-env-readiness`: ready with warnings, 0 blocking issues, 1 SMTP warning
- `npx prisma validate`: passed
- `npm run prisma:validate`: passed
- `git diff --check`: passed
- Final pre-report `git status --short`: clean

## Safety Confirmations

- No secret values were printed.
- No connection strings were printed.
- No Daniel password was printed.
- No raw internal IDs were printed.
- No raw launch tokens or token hashes were printed.
- No private env file was committed or copied into the repo.
- No committed `.env` files were modified.
- No Prisma migration command was run.
- No seed or setup script was run.
- No database records were created, updated, or deleted by this diagnostic.
- No deployment was attempted.
- No invites were sent.
- No learner or admin accounts were created.
- Mulu was not registered.
- HRBA course deployment/code was not changed.
- Hub integration, callback, launchToken, and certificate logic were not changed.
