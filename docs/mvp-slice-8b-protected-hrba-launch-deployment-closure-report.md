# MVP Slice 8B Protected HRBA Launch Deployment Closure Report

Date: 2026-07-03

## Summary verdict

Verdict: still blocked for pilot deployment closure.

The CSO Learning Hub side is correctly using the protected launch-token contract. Local DB-backed verification passed and confirmed that the learner-facing iframe URL includes portal mode and `launchToken`, and excludes raw Hub IDs.

The remaining blocker is deployment-specific: the configured deployed HRBA app at `https://pilot-hrba-e-learn-v1-wajj.vercel.app` is reachable, but the deployed JavaScript asset inspected during this run did not contain `launchToken`, `portalOrigin`, or the Hub progress message contract. This matches the previous Slice 7 finding and indicates the configured deployment is not yet running the local HRBA launch-token integration.

## Hub repo state

- Repo: `D:\z CDP-Lg-Andy-main-main`
- Branch: `cso-learning-hub-mvp`
- Starting status: clean
- Starting HEAD: `0abb553 Polish public content and HRBA course trust surfaces`

Recent history at start:

```text
0abb553 Polish public content and HRBA course trust surfaces
90289f4 Add HRBA pilot issue log template
5ebea6a Refine course data fallback logging
278649b Update CSO Learning Hub consolidated specification for pilot scope
cf2892a Add MVP final pilot acceptance QA report
```

## Current HRBA configuration

Hub configuration source:

- `src/lib/external-course-config.ts`
- `.env`
- `.env.example`

Configured HRBA external course URL:

- `.env`: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- `.env.example`: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- default code value: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`

Secrets: no secret values were printed or changed. `.env` was inspected only for HRBA external-course variable names and the non-secret deployed URL value.

Assessment:

- The configured URL remains the same deployed Vercel HRBA URL identified in Slice 7.
- The v1.1 specification says the official pilot HRBA deployment should be a new/private pilot deployment, not the old shared public URL.
- No `.env` changes were made or committed.

## Hub launch URL behavior

Hub launch generation in `src/lib/external-course-workflow.ts` creates a server-side launch token record containing the raw Hub context, then sends only the protected launch context in the iframe URL:

```text
embed=portal
portalOrigin=<Hub origin>
courseSlug=applying-human-rights-based-approach-in-cso-practice
launchToken=<opaque token>
```

The generated iframe URL does not include:

- `userId`
- `learnerId`
- `enrollmentId`
- `courseVersionId`
- raw internal database IDs

The Hub callback route accepts sanitized progress fields plus `launchToken`, then resolves the user, enrollment, course version, and origin server-side from the stored token record.

## HRBA app repo inspection

Repo inspected: `D:\eLearn_CDP_Lg`

Status: dirty before inspection. No HRBA files were modified.

Observed status included many pre-existing content, asset, and source changes, including:

- modified `src/App.tsx`
- modified course renderer and content files
- deleted `public/assets/certificates/templates/certificate_template.png`
- multiple untracked docs and asset folders
- untracked `public/assets/certificates/templates/hrba-certificate-template.png`

Relevant local HRBA integration files:

- `src/integration/portalContext.ts`
- `src/integration/hubProgress.ts`
- `src/App.tsx`
- `docs/hrba-app-launch-token-portal-context-update-report.md`

Local HRBA source findings:

- `portalContext.ts` parses `embed=portal`, `portalOrigin`, `courseSlug`, and `launchToken`.
- It no longer requires raw `userId`, `enrollmentId`, or `courseVersionId` for portal mode.
- `hubProgress.ts` sends `launchToken` in Hub progress and final-assessment `postMessage` payloads.
- `hubProgress.ts` does not send raw Hub internal IDs.
- `App.tsx` uses `getPortalLaunchContextFromWindow()` and sends progress/final assessment messages only when portal context exists.
- Without valid portal context, local HRBA source falls back to standalone behavior and does not send Hub identity, progress, assessment, certificate, or portal context.

Direct-access note:

- Local HRBA source does not hard-block direct access with a "Please access this course through the CSO Learning Hub" message.
- Minimum acceptable behavior is met locally because direct access has no Hub context and cannot activate Hub portal callback mode.
- The preferred hard-block message remains an HRBA deployment requirement before final pilot launch if the official route must prevent standalone course use.

## Deployed HRBA URL check

Checked URL:

```text
https://pilot-hrba-e-learn-v1-wajj.vercel.app
```

HTTP result:

- Status: `200`
- HTML contained `launchToken`: `false`
- Deployed JavaScript asset discovered: `https://pilot-hrba-e-learn-v1-wajj.vercel.app/assets/index-D1T-29i7.js`

Asset string check:

- `launchToken`: `false`
- `portalOrigin`: `false`
- raw ID strings `userId|enrollmentId|courseVersionId`: `false`
- `cso-learning-hub:external-course-progress`: `false`

Conclusion:

The configured deployed HRBA app was reachable, but the inspected deployed asset does not include the local launch-token portal parsing or progress-message integration. The deployment blocker remains.

## Local E2E and verification results

Database:

- `docker start cso-learning-hub-postgres`: passed; container running
- Container status: `cso-learning-hub-postgres Up ... 0.0.0.0:5432->5432/tcp`

Prisma:

- `npx prisma validate`: passed
- `npx prisma migrate status`: passed; database schema is up to date
- No migrations were created or run.

Hub checks:

- `npm run lint`: passed
- `npm run build`: passed
- `npm run prisma:validate`: passed
- `npm run verify:hrba-external-course`: passed
- `npm run verify:r17`: passed

Important `verify:hrba-external-course` evidence:

```json
{
  "iframeOrigin": "https://pilot-hrba-e-learn-v1-wajj.vercel.app",
  "iframeSrcExcludesRawIds": true,
  "iframeSrcIncludesPortalEmbed": true,
  "iframeSrcIncludesLaunchToken": true,
  "invalidLaunchContextRejected": true,
  "invalidTokenRejected": true,
  "tokenSessionMismatchRejected": true,
  "failedAttemptRecorded": true,
  "passedAttemptRecorded": true,
  "certificatePdfDataAvailable": true,
  "publicVerificationWorks": true,
  "status": "COMPLETED"
}
```

Browser route check:

- Opened `http://localhost:3000/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- Result: redirected to `http://localhost:3000/sign-in?next=%2Flearn%2Fcourses%2Fapplying-human-rights-based-approach-in-cso-practice%2Fexternal`.
- Visible page: "Sign in to continue learning".
- Iframe count: `0`.

Interpretation: the protected learner route correctly requires authentication. Authenticated iframe inspection was not completed in browser because the in-app browser was not signed in. The DB-backed verifier covered the authenticated launch URL, token rejection paths, completion callback, certificate data, and public verifier behavior.

## Files changed

Created:

- `docs/mvp-slice-8b-protected-hrba-launch-deployment-closure-report.md`

No source files were changed. No schema files were changed. No `.env` files were changed.

## Source, schema, and environment confirmation

- Source changes: none
- Database schema changes: none
- Migration changes: none
- `.env` changes: none
- Generated Prisma client: regenerated during `npm run build` by the existing `prebuild` script; generated files were not committed
- Build-generated `next-env.d.ts` line-ending/import churn was restored before this report was created

## Remaining deployment-owner actions

1. Deploy the local HRBA app launch-token portal context update to the official pilot HRBA deployment.
2. Confirm the official pilot URL that should be configured in `HRBA_EXTERNAL_COURSE_URL`.
3. Ensure `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS` includes only the approved official HRBA deployment origin plus required local development origins.
4. Re-fetch deployed HRBA assets and confirm they include `launchToken`, `portalOrigin`, and `cso-learning-hub:external-course-progress`.
5. Run an authenticated browser E2E check from the Hub learner route and confirm the iframe URL includes `launchToken` and excludes raw IDs.
6. Decide whether the HRBA deployed app must hard-block direct access with "Please access this course through the CSO Learning Hub." If required, implement and verify that behavior in the HRBA app deployment.

## Closure decision

Blocker closed: no.

Hub-side launch-token integration is verified and passing. Local HRBA source is compatible with the launch-token contract. The final pilot blocker remains pending deployment of that HRBA source to the configured official pilot URL, or confirmation of a different official protected HRBA deployment URL.
