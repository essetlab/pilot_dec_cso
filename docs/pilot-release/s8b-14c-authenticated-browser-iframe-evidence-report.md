# S8B-14C Authenticated Browser Iframe Evidence Report

## Scope

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Hub URL tested: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- HRBA URL tested: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Learner tested: Daniel, `agiledatawise@gmail.com`
- Prior diagnostic baseline: S8B-14B report commit `c89c409`

Daniel's private test credentials were loaded from `D:\CSO_Learning_Hub_Secrets\s8b-real-pilot.env` without printing values. The private env file remains outside the repo and was not copied or committed.

## Branch And Environment

Initial checks:

- `git branch --show-current`: `feature/supabase-auth-vercel-real-pilot`
- `git status --short`: clean
- Latest history included `c89c409 Add Daniel blank iframe diagnostic report`

Required environment values were present:

| Variable | Presence |
| --- | --- |
| `DATABASE_URL` | Present |
| `NEXT_PUBLIC_APP_URL` | Present |
| `NEXT_PUBLIC_SUPABASE_URL` | Present |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Present |
| `HRBA_EXTERNAL_COURSE_URL` | Present |
| `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS` | Present |
| `DANIEL_TEST_EMAIL` | Present |
| `DANIEL_TEST_PASSWORD` | Present |

Expected public shape checks:

- `NEXT_PUBLIC_APP_URL` matches `https://cdp-lg-andy-g-pilot-xziq.vercel.app`.
- `HRBA_EXTERNAL_COURSE_URL` matches `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS` includes `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
- `DANIEL_TEST_EMAIL` matches `agiledatawise@gmail.com`.

No secret values or passwords were printed.

## Browser Automation Availability

| Capability | Result |
| --- | --- |
| In-app browser automation | Available |
| In-app Playwright API | Available |
| Repo-local `require("playwright")` package | Not available |
| Playwright CLI | Available, version `1.61.1` |
| Browser executable | Available |
| Headless Chromium probe | Passed with a scratch `about:blank` screenshot outside the repo |

The in-app browser `domSnapshot()` helper hit an extension compatibility error, so the diagnostic used targeted page evaluation, locators, frame locators, console logs, and CLI screenshot probes.

## Authenticated Daniel Reproduction

1. Opened `https://cdp-lg-andy-g-pilot-xziq.vercel.app/sign-in`.
2. Signed in as Daniel using private credentials.
3. Confirmed the learner dashboard loaded at `/learn`.
4. Confirmed Daniel remained visibly authenticated on the dashboard:
   - Daniel name visible: yes
   - `Sign out` visible: yes
5. Confirmed the dashboard exposed three visible `Start course` links to the same HRBA external route.
6. Clicked one `Start course` link.

Result of first Start click:

- Browser returned to sign-in: yes
- Redirect URL: `/sign-in?next=/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`
- Iframe element on this redirected sign-in page: no
- Daniel visible after redirect: no
- Readable cookie names from `document.cookie`: none

This reproduces the owner-observed sign-in loop symptom. The redirect target is the protected HRBA external route, so the route correctly redirected when the Hub session was not resolved for that request.

## Sign-In Through Protected `next` Route

From the redirected sign-in page, Daniel was signed in again with the existing `next` value.

Result:

- Final Hub page URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`
- Returned to sign-in after this second sign-in: no
- Daniel remained authenticated: yes
- `Sign out` visible: yes
- External course page shell rendered: yes
- Iframe element exists: yes
- Iframe CSS-visible: yes
- Iframe bounding box: approximately `435 x 720`
- Iframe src present: yes

Redacted iframe src shape:

```text
https://pilot-hrba-e-learn-v1-wajj.vercel.app/?embed=portal&portalOrigin=https%3A%2F%2Fcdp-lg-andy-g-pilot-xziq.vercel.app&courseSlug=applying-human-rights-based-approach-in-cso-practice&launchToken=[redacted]
```

Iframe src checks:

| Check | Result |
| --- | --- |
| `embed=portal` | Yes |
| `portalOrigin` present | Yes |
| `portalOrigin` matches Hub URL | Yes |
| `courseSlug` present and correct | Yes |
| `launchToken` present | Yes, redacted in all output |
| HRBA origin correct | Yes |

## Iframe Content Evidence

The iframe was accessible through the browser automation frame locator.

Iframe content checks:

| Check | Result |
| --- | --- |
| Iframe body exists | Yes |
| Iframe body visible | Yes |
| HRBA `#root` exists | Yes |
| HRBA `#root` visible | Yes |
| Body empty | No |
| HRBA app shell loaded | Yes |
| HRBA text visible in frame | Yes |
| `Module 1` text count | 4 |
| `Human Rights` text count | 1 |

Safe iframe text snippet observed:

```text
DEC
CSO Learning Hub
Ethical & Rights-Based Capacity Platform
Catalogue
My Portfolio
Focal Support
FLAGSHIP COURSE ENROLLED
Applying the Human Rights-Based Approach in CSO Practice
Start your HRBA learning pathway.
Start Module 1
```

Conclusion: when Daniel reaches the external route through a fresh `next` sign-in, the iframe is not blank. The HRBA app shell and course content load inside the iframe.

## Direct Iframe URL Check

The same iframe URL was opened as a top-level page using the actual token internally. The token was not printed.

Result:

- Direct iframe URL load: succeeded
- HRBA app renders as a top-level page with the same query parameters: yes
- Body empty: no
- HRBA `#root` exists: yes
- App shell visible: yes
- Safe error-like text in page body: none observed

Redacted direct URL shape matched the iframe src shape:

```text
https://pilot-hrba-e-learn-v1-wajj.vercel.app/?embed=portal&portalOrigin=https%3A%2F%2Fcdp-lg-andy-g-pilot-xziq.vercel.app&courseSlug=applying-human-rights-based-approach-in-cso-practice&launchToken=[redacted]
```

## Direct Frozen HRBA Route Check

The in-app browser timed out while probing `/module-1`, so a Playwright CLI Chromium screenshot probe was run outside the repo.

Route checked:

`https://pilot-hrba-e-learn-v1-wajj.vercel.app/module-1`

Result:

- Browser load/capture success: yes
- Screenshot file written outside repo: `D:\CSO_Learning_Hub_Scratch\s8b14c-browser-probe\hrba-module-1.png`
- Screenshot was not blank.
- HRBA Module 1 shell visible: yes
- Visible content included `Module 1: Starting the HRBA Learning Journey`.

This separates the issue from a general HRBA runtime failure. The frozen HRBA route renders in Chromium.

## Console And Network Evidence

Parent/iframe console collection did not show a browser-side CSP, `X-Frame-Options`, mixed-content, CORS, missing-token, invalid-token, origin-mismatch, postMessage, localStorage/sessionStorage, hydration, or JavaScript runtime error tied to the HRBA iframe.

The only captured warning was stale/localhost-related noise from an existing browser tab:

- `getPublicCourseSummaries: using fallback course data. PrismaClientKnownRequestError (ECONNREFUSED)`
- Reported URL source included `http://localhost:3000/...`

That warning does not correspond to the deployed Hub/HRBA iframe request and was not treated as evidence against the production iframe.

The in-page Performance API resource summary was unavailable in the in-app browser evaluation context, so detailed iframe asset request status was not available through that method.

## Read-Only DB State After Reproduction

Read-only database inspection after the allowed Daniel launch found:

| Check | Result |
| --- | --- |
| Daniel exists | Yes |
| HRBA course exists | Yes |
| Daniel HRBA enrollment count | 1 |
| Latest enrollment status | `IN_PROGRESS` |
| Latest enrollment progress | `0` |
| Latest enrollment last accessed present | Yes |
| Daniel HRBA lesson progress count | 1 |
| Latest lesson progress status | `IN_PROGRESS` |
| Latest lesson progress source | `external-course-launch` |
| Daniel HRBA launch token count | 5 |
| Latest token stored as hash | Yes |
| Latest token expired | No |
| Latest token lastUsedAt present | No |
| Latest token allowed origin matches HRBA URL | Yes |
| Latest token portal origin matches Hub URL | Yes |
| Daniel quiz attempt count | 0 |
| Daniel certificate count | 0 |
| Mulu absent | Yes |

The launch token count increased by one as allowed by the authenticated browser reproduction. No course completion, final assessment, quiz attempt, or certificate was created.

## Likely Cause Classification

Most likely cause: Hub session issue/sign-in loop on the first Start-course click after initial sign-in.

Evidence:

- Daniel signed in successfully and reached `/learn`.
- Dashboard showed Daniel's authenticated learner view.
- Clicking the visible HRBA `Start course` link redirected back to sign-in with `next` set to the protected external route.
- Signing in through that `next` route successfully rendered the external Hub page and iframe.
- The iframe src was valid and included the expected portal query parameters.
- The HRBA app shell loaded inside the iframe.
- The same iframe URL rendered as a top-level page.
- The direct frozen HRBA module route rendered in Chromium.
- Frame headers were already found non-blocking in S8B-14B.
- Daniel's latest token was unexpired, scoped correctly, and unused.

Less likely based on browser evidence:

- Iframe src missing or malformed: not supported.
- Iframe not mounted: not supported after `next` sign-in.
- Iframe hidden by CSS/height: not supported; iframe had dimensions and visible content.
- HRBA app not loading assets: not supported by iframe content and direct route rendering.
- HRBA app runtime crash generally: not supported.
- HRBA app runtime crash in portal mode: not supported in this reproduction.
- Token expired/invalid: not supported.
- Portal origin/allowed origin mismatch: not supported.
- Frame blocked by CSP or `X-Frame-Options`: not supported.
- Vercel/asset caching issue: not supported by current evidence.

The original blank screenshot may have been a symptom of the user landing in a state before the iframe fully rendered, or of the sign-in loop interrupting the protected external route. The browser reproduction did not reproduce a blank iframe once the external route loaded with a valid session.

## Fix Applied

No code fix was applied.

Reason:

- The iframe and HRBA runtime loaded successfully once Daniel reached the external route.
- The remaining reproducible symptom is a first-hop sign-in/session handoff issue, and the exact Hub-side root cause is not yet isolated enough for a safe minimal fix in this slice.
- No Hub code was changed, so no preview deployment was attempted.

Files changed:

- `docs/pilot-release/s8b-14c-authenticated-browser-iframe-evidence-report.md`

## Checks Run

No code changed, so the no-code check set was run:

- `npm run verify:s8-env-readiness`: passed as ready with warnings
- `npx prisma validate`: passed
- `npm run prisma:validate`: passed
- `git diff --check`: passed
- `git status --short`: clean before report creation

Remaining warning:

- `SMTP_*`: SMTP variables are present; confirm Hub direct emails are intentionally enabled.

## Recommended Next Action

Create a focused Hub-side session handoff diagnostic/fix slice before rerunning full S8B-14 verification.

That slice should inspect only the sign-in to `/learn` to protected external-route transition, including:

- Whether the Supabase SSR auth cookies and legacy Hub session cookie are both persisted after the initial sign-in action.
- Whether the external route's `getCurrentSession()` receives the same cookies as `/learn`.
- Whether a post-sign-in redirect/cache/navigation timing issue can cause the first Start-course click to arrive without a resolvable session.
- Whether a safe loading/retry state is needed when the protected route is reached immediately after sign-in.

After that focused Hub-side fix or confirmation, rerun normal S8B-14 verification and perform an owner final manual retest.

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
- Supabase Auth logic was not changed.
- No broad refactors were made.
