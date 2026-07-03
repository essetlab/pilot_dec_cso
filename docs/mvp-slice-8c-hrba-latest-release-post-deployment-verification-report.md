# MVP Slice 8C - HRBA Latest Release Post-Deployment Verification Report

Date: 2026-07-04

## 1. Verification Summary

Result: PASS with one browser E2E limitation noted.

The official HRBA pilot deployment is serving the latest token-aware release. The live page references `/assets/index-OJrecxNB.js`, not the rejected `/assets/index-D1T-29i7.js`. The live JavaScript asset contains `launchToken`, `portalOrigin`, and `cso-learning-hub:external-course-progress`.

Authenticated learner launch from the Hub was verified in a browser against the local production build. The HRBA iframe opened from the signed-in learner route, included a `launchToken`, and did not expose raw Hub database IDs in the iframe URL.

The short automated browser run could start Module 1 but did not complete enough gated course steps to observe a real progress or final-assessment postMessage in-flight. Token use in progress and final-assessment messages was therefore confirmed by direct live-asset inspection and the existing Hub verifier, which exercises tokenized callback acceptance, invalid-token rejection, token/session mismatch rejection, failed assessment recording, passed assessment recording, and certificate issuance.

## 2. Official HRBA Deployment Asset Check

Official HRBA URL:

`https://pilot-hrba-e-learn-v1-wajj.vercel.app`

Fetched page referenced:

`https://pilot-hrba-e-learn-v1-wajj.vercel.app/assets/index-OJrecxNB.js`

Confirmed:

- Live asset is not `/assets/index-D1T-29i7.js`: PASS
- Live asset contains `launchToken`: PASS
- Live asset contains `portalOrigin`: PASS
- Live asset contains `cso-learning-hub:external-course-progress`: PASS

Relevant live-asset behavior observed by inspection:

- Portal mode parses `embed=portal`, `portalOrigin`, `courseSlug`, and `launchToken`.
- Progress payload construction includes `type: "cso-learning-hub:external-course-progress"`, `courseSlug`, `launchToken`, `progressPercent`, `completed`, module/screen fields, optional `assessment`, and `sentAt`.
- Final assessment completion uses the same progress-message helper and passes assessment fields including attempt number, score, max score, percentage, pass status, and submitted timestamp.

## 3. Required Local Verification Commands

Commands run in order:

```powershell
docker start cso-learning-hub-postgres
npx prisma validate
npx prisma migrate status
npm run lint
npm run build
npm run prisma:validate
npm run verify:hrba-external-course
npm run verify:r17
```

Results:

- `docker start cso-learning-hub-postgres`: passed.
- `npx prisma validate`: passed. Schema valid.
- `npx prisma migrate status`: passed. Database schema up to date with 3 migrations.
- `npm run lint`: passed.
- `npm run build`: passed. Production build completed successfully.
- `npm run prisma:validate`: passed. Schema valid.
- `npm run verify:hrba-external-course`: passed.
- `npm run verify:r17`: passed.

Key `verify:hrba-external-course` evidence:

- `iframeOrigin`: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- `iframeSrcIncludesLaunchToken`: `true`
- `iframeSrcExcludesRawIds`: `true`
- `iframeSrcIncludesPortalEmbed`: `true`
- `invalidLaunchContextRejected`: `true`
- `invalidTokenRejected`: `true`
- `tokenSessionMismatchRejected`: `true`
- `failedAttemptRecorded`: `true`
- `passedAttemptRecorded`: `true`
- `certificatePdfDataAvailable`: `true`
- `publicVerificationWorks`: `true`
- `status`: `COMPLETED`

Latest verifier certificate code generated during this pass:

`CERT-E-V1-DEMO-901L`

## 4. Authenticated Browser E2E

Local production server:

`http://localhost:3100`

Browser path:

1. Opened `/sign-in?next=/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
2. Signed in through the learner quick-access control.
3. Landed on `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
4. Confirmed the page rendered `Applying the Human Rights-Based Approach in CSO Practice`.
5. Confirmed the embedded HRBA iframe loaded from the official HRBA deployment.

Observed iframe URL shape:

```text
https://pilot-hrba-e-learn-v1-wajj.vercel.app/?embed=portal&portalOrigin=http%3A%2F%2Flocalhost%3A3000&courseSlug=applying-human-rights-based-approach-in-cso-practice&launchToken=<redacted>
```

Browser E2E confirmations:

- Signed-in learner opens HRBA iframe from the Hub: PASS
- Iframe URL includes `launchToken`: PASS
- Iframe URL excludes raw Hub IDs: PASS
- HRBA progress/final assessment messages use `launchToken`: PASS by live-asset inspection and verifier script; not observed as a real browser postMessage during the short automated interaction window.

Note: `portalOrigin` in the local browser iframe was `http://localhost:3000`, matching the local `.env` `NEXT_PUBLIC_APP_URL` behavior. The test server itself was on port `3100`.

## 5. Files Changed

- `docs/mvp-slice-8c-hrba-latest-release-post-deployment-verification-report.md`

No application logic, Prisma schema, migrations, seed data, or HRBA integration code was changed.

## 6. Risks And Residual Notes

- Browser automation did not complete the full five-module HRBA course and final assessment because the course UI is gated by learner actions and time-based/step-based progression. The final callback path remains covered by `npm run verify:hrba-external-course` and live deployed asset inspection.
- The local production server was started only for verification and wrote temporary runtime logs that were not committed.
- The build temporarily updated `next-env.d.ts`; that generated churn was restored and not included in the commit.

## 7. Scope Control

This was a deployment verification and evidence-report task only. No Phase 2 or Phase 3 product areas were added, and no Build Studio, learner, admin, monitoring, certificate, or HRBA workflow code was changed.
