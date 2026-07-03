# Final CSO Learning Hub Pilot Acceptance QA Report

Date: 2026-07-04

## 1. Final Verdict

Verdict: pilot-ready with limitations.

The CSO Learning Hub is ready for final pilot use for the Phase 1 public, learner, HRBA launch, certificate verification, feedback, and core trust/support flows checked in this pass. The HRBA latest release deployment blocker is closed, the official HRBA deployment is serving the token-aware release, and the Hub-side automated verification scripts passed.

Remaining limitation: a real browser-captured HRBA progress/final-assessment `postMessage` was not captured during this QA pass because the live HRBA course is gated by learner progression through the course and final assessment. The callback behavior is covered by `npm run verify:hrba-external-course` and by live deployed asset inspection confirming tokenized progress/final-assessment message construction.

## 2. Generated File Cleanup

Initial status showed `next-env.d.ts` modified with generated churn only.

Checked:

```powershell
git status --short
git diff -- next-env.d.ts
```

The first diff was only a line-ending normalization warning. After `npm run build`, Next.js regenerated the file with a production route-types import:

```diff
-import "./.next/dev/types/routes.d.ts";
+import "./.next/types/routes.d.ts";
```

This was generated build churn and was restored with:

```powershell
git restore -- next-env.d.ts
```

No generated file changes are included in this report commit.

## 3. Official HRBA Deployment Asset Status

Official HRBA URL:

`https://pilot-hrba-e-learn-v1-wajj.vercel.app`

Live JS asset identified:

`/assets/index-OJrecxNB.js`

Status:

- Live asset is not `/assets/index-D1T-29i7.js`: PASS
- Live asset contains `launchToken`: PASS
- Live asset contains `portalOrigin`: PASS
- Live asset contains `cso-learning-hub:external-course-progress`: PASS
- Live asset does not contain raw Hub ID field names checked for this task: PASS
  - `userId`: not present
  - `enrollmentId`: not present
  - `courseVersionId`: not present

Live asset inspection also confirmed the progress-message helper includes `launchToken` and optional `assessment` data, and final assessment completion calls that helper with assessment score, percentage, pass status, attempt number, and submitted timestamp.

## 4. Hub Verification Command Results

Commands run:

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
- `npx prisma validate`: passed. Prisma schema is valid.
- `npx prisma migrate status`: passed. Database schema is up to date with 3 migrations.
- `npm run lint`: passed.
- `npm run build`: passed. Production build completed successfully.
- `npm run prisma:validate`: passed. Prisma schema is valid.
- `npm run verify:hrba-external-course`: passed.
- `npm run verify:r17`: passed.

Key `verify:hrba-external-course` results:

- `iframeOrigin`: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- `iframeSrcIncludesPortalEmbed`: `true`
- `iframeSrcIncludesLaunchToken`: `true`
- `iframeSrcExcludesRawIds`: `true`
- `invalidLaunchContextRejected`: `true`
- `invalidTokenRejected`: `true`
- `tokenSessionMismatchRejected`: `true`
- `failedAttemptRecorded`: `true`
- `passedAttemptRecorded`: `true`
- `certificatePdfDataAvailable`: `true`
- `publicVerificationWorks`: `true`
- `status`: `COMPLETED`

Latest certificate code generated during this verification pass:

`CERT-E-V1-DEMO-FCKO`

## 5. Route And Browser QA Results

Local production server used for browser QA:

`http://localhost:3100`

Public routes checked:

- `/`: PASS. Homepage H1 is `Learn. Connect. Grow.`
- `/courses`: PASS. Course catalog loads and includes the HRBA course.
- `/courses/applying-human-rights-based-approach-in-cso-practice`: PASS. HRBA overview contains HRBA content and no proposal-development copy.
- `/verify-certificate`: PASS. Public verification page loads and includes safe public-information copy.
- `/support`: PASS.
- `/privacy`: PASS.
- `/terms`: PASS.
- `/accessibility`: PASS.

Public navigation:

- Header navigation showed Home, Courses, Verify Certificate, Sign In, Register.
- Header navigation did not expose admin, creator, donor, verifier, community, or Build Studio routes.

Certificate and safety copy:

- HRBA course overview includes certificate eligibility and 80% final-assessment rule content.
- Certificate verification page states public results are limited and do not expose learner email, assessment answers, private progress details, portfolio content, internal IDs, or private organization details.
- Certificate limitation/disclaimer copy is present: certificate completion does not replace due diligence, safeguarding review, legal compliance checks, or partnership assessment.

Learner/auth routes checked:

- `/register`: PASS.
- `/sign-in`: PASS.
- Signed-in learner dashboard `/learn`: PASS.
- Signed-in learner My Courses `/learn/my-courses`: PASS.
- Signed-in learner Certificates `/learn/certificates`: PASS.
- Signed-in learner HRBA launch route `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`: PASS.

Authenticated iframe launch:

- Signed-in learner can launch the HRBA iframe from the Hub: PASS.
- Iframe origin is `https://pilot-hrba-e-learn-v1-wajj.vercel.app`: PASS.
- Iframe URL includes `launchToken`: PASS.
- Iframe URL excludes forbidden raw ID query parameters: PASS.
  - `userId`: absent
  - `learnerId`: absent
  - `enrollmentId`: absent
  - `courseVersionId`: absent

Observed iframe shape:

```text
https://pilot-hrba-e-learn-v1-wajj.vercel.app/?embed=portal&portalOrigin=http%3A%2F%2Flocalhost%3A3000&courseSlug=applying-human-rights-based-approach-in-cso-practice&launchToken=<redacted>
```

Note: `portalOrigin` reflected local `.env` configuration as `http://localhost:3000` while the QA server was running on port `3100`. No `.env` change was made.

## 6. Mobile And Accessibility Spot Check

Viewport used:

`390px` width, browser-reported document client width `375px`.

Routes checked at narrow viewport:

- `/`: PASS. No horizontal overflow; homepage CTA labels visible; footer links readable.
- `/courses`: PASS. No horizontal overflow; course cards/actions usable; footer links readable.
- `/courses/applying-human-rights-based-approach-in-cso-practice`: PASS. No horizontal overflow; HRBA course actions visible.
- `/sign-in`: PASS. No horizontal overflow; sign-in and learner quick-access actions visible.
- `/register`: PASS. No horizontal overflow; registration CTA and trust links visible.
- `/verify-certificate`: PASS. No horizontal overflow; verification form action visible.
- `/support`: PASS. No horizontal overflow; content and footer links readable.
- `/privacy`: PASS. No horizontal overflow; content and footer links readable.
- `/terms`: PASS. No horizontal overflow; content and footer links readable.
- `/accessibility`: PASS. No horizontal overflow; content and footer links readable.
- Signed-in learner HRBA launch page: PASS. No horizontal overflow; learner navigation visible; iframe container usable.

## 7. Certificate Verification Result

Browser verification used:

`CERT-E-V1-DEMO-FCKO`

Result:

- Public certificate verification returned `Issued`.
- Name on certificate: `Participant Completed`.
- Course title: `Applying the Human Rights-Based Approach in CSO Practice`.
- Public result included safe disclosure copy and did not expose learner email, assessment answers, private progress, internal IDs, or private organization details.

## 8. Feedback And Monitoring Verification

Covered by `npm run verify:r17`.

R17 verified:

- Completed participant can access feedback form.
- Invalid rating is rejected without persistence.
- Valid feedback saves structured ratings and short text fields.
- Existing feedback returns submitted state.
- Existing feedback updates without creating duplicates.
- Incomplete learner is locked out of feedback submission.
- Admin summary includes metrics and protected comments.
- M&E summary includes metrics without protected comments.
- Temporary verification records are cleaned up.

## 9. Remaining Known Limitations

- Full real-course browser completion through all HRBA modules and final assessment was not performed in this pass.
- A live browser-captured progress/final-assessment `postMessage` was not captured because the deployed HRBA course requires gated learner progression. Tokenized message behavior is covered by live asset inspection and `npm run verify:hrba-external-course`.
- The local production browser QA exposed React Server Component payload text in some read-only automation text samples, but headings, route URLs, iframe attributes, links, and page checks were readable and sufficient for QA decisions.
- The local `.env` still controls `NEXT_PUBLIC_APP_URL`, producing `portalOrigin=http://localhost:3000` in local iframe URLs while this QA server ran on port `3100`.

## 10. Scope And Change Confirmation

No new features were implemented.

No database schema changes were made.

No migrations were created or run.

No `.env` changes were made.

No certificate generation logic was changed.

No HRBA callback contract was changed.

No HRBA deployment was modified.

No donor portal, community, Build Studio, verifier role, practical proof, or advanced analytics areas were added.

No raw Hub IDs were exposed in learner-facing HRBA iframe URLs.

## 11. Final Git Status Before Report Commit

Before creating this report, the worktree was clean after restoring `next-env.d.ts`.

Expected final staged/committed change:

- `docs/mvp-final-pilot-acceptance-qa-report.md`
