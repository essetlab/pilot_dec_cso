# Internal Pilot 0 Preflight Report

Date: 2026-07-04

## 1. Readiness Verdict

Verdict: Ready with caution.

The Hub is technically ready for Internal Pilot 0 rehearsal. The repository is clean, the execution tracker exists with the corrected learner profiles, Prisma/database checks passed, HRBA and feedback verifiers passed, the official HRBA deployment is serving the token-aware asset, and both internal learner emails are currently new in the local database.

Caution: the pilot access code still needs programme-owner confirmation before invitations are sent. The local environment does not configure `PILOT_ACCESS_CODE`, `PILOT_ACCESS_CODES`, `PILOT_INVITED_EMAILS`, or `PILOT_REGISTRATION_MODE`, so registration uses the source-defined simple access-code fallback. Do not send learner invitations until the programme owner confirms the access code to share.

## 2. Repo Status

Initial check:

```powershell
git status --short
```

Result: clean.

No application source code, database schema, migrations, `.env`, HRBA deployment, certificate logic, or HRBA callback logic was changed.

## 3. Internal Pilot 0 Tracker Status

Tracker checked:

`docs/pilot-release/internal-pilot-0-execution-tracker.md`

Status: present and ready.

Confirmed sections:

- Two test learner profiles: present.
- Smoke check table: present.
- Registration checklist: present.
- HRBA launch checklist: present.
- Completion/final assessment/certificate checklist: present.
- Feedback and monitoring checklist: present.
- Issue log: present.
- Go/no-go section: present.

Confirmed learner profiles:

| Learner | Email | Organization | Role | Region | Learner type |
|---|---|---|---|---|---|
| Daniel Negash Kebede | agiledatawise@gmail.com | HCDA | Program Manager | Addis Ababa | Participant / CSO learner |
| Mulu Taddese Ayana | essetlab@gmail.com | ANGAFA | MEAL Officer | Oromia | Participant / CSO learner |

## 4. Deployment And Verifier Results

Commands run:

```powershell
docker start cso-learning-hub-postgres
npx prisma validate
npx prisma migrate status
npm run verify:hrba-external-course
npm run verify:r17
```

Results:

- `docker start cso-learning-hub-postgres`: passed.
- `npx prisma validate`: passed. Schema is valid.
- `npx prisma migrate status`: passed. Database schema is up to date with 3 migrations.
- `npm run verify:hrba-external-course`: passed.
- `npm run verify:r17`: passed.

Key HRBA verifier evidence:

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

Verifier certificate code generated during this pass:

`CERT-E-V1-DEMO-5GYD`

R17 feedback workflow verified:

- Completed participant feedback access.
- Invalid rating rejection.
- Valid feedback persistence.
- Existing feedback update without duplicates.
- Incomplete learner lockout.
- Admin summary metrics with protected comments.
- M&E summary metrics without protected comments.
- Temporary verification records cleaned up.

## 5. Official HRBA Asset Check

Official HRBA URL:

`https://pilot-hrba-e-learn-v1-wajj.vercel.app`

Live asset:

`/assets/index-OJrecxNB.js`

Results:

- Live asset is `/assets/index-OJrecxNB.js` or later valid asset: PASS.
- Live asset is not stale `/assets/index-D1T-29i7.js`: PASS.
- Live asset contains `launchToken`: PASS.
- Live asset contains `portalOrigin`: PASS.
- Live asset contains `cso-learning-hub:external-course-progress`: PASS.

## 6. Test Learner Email Existence Check

Read-only database query checked:

- `agiledatawise@gmail.com`
- `essetlab@gmail.com`

Results:

| Learner | Email | Account status | Meaning for rehearsal |
|---|---|---|---|
| Daniel Negash Kebede | agiledatawise@gmail.com | New / not registered | Registration path can be tested with this email. |
| Mulu Taddese Ayana | essetlab@gmail.com | New / not registered | Registration path can be tested with this email. |

No accounts were created, reset, deleted, or modified.

No passwords, tokens, or sensitive credential values were printed.

## 7. Pilot Access-Code Status

Registration requires an access code.

Configuration path:

- Registration page posts `accessCode` through the pilot registration workflow.
- Access-code validation is implemented in `src/lib/pilot-registration-workflow.ts`.
- The workflow reads `PILOT_ACCESS_CODES` first, then `PILOT_ACCESS_CODE`, then falls back to a source-defined local default.
- Strict invited-email mode is enabled only when `PILOT_REGISTRATION_MODE` is set to `strict`.

Local environment status:

- `PILOT_ACCESS_CODES`: not configured.
- `PILOT_ACCESS_CODE`: not configured.
- `PILOT_INVITED_EMAILS`: not configured.
- `PILOT_REGISTRATION_MODE`: not configured.

Interpretation:

- Local registration is in simple access-code mode.
- A source-defined fallback code exists for local/simple mode, but the invitation code to share with internal learners must be confirmed by the programme owner before invitations are sent.
- Since strict invited-email mode is not configured, the two test emails do not need to be pre-listed locally.

Sensitive-value handling:

- The preflight check did not print any secret access-code value from `.env`.
- The report intentionally does not publish the access code to send.

## 8. Actions Needed Before Sending Invitations

Required before sending invitations:

1. Programme owner confirms the pilot access code to share with Daniel and Mulu.
2. Support owner confirms the Hub URL to include in the invitation.
3. Support owner confirms where learners should send screenshots/error text during rehearsal.
4. Rehearsal lead confirms whether full HRBA module/final assessment completion is expected or timeboxed.

Optional but recommended:

1. Run the launch-day smoke check from `docs/pilot-release/internal-pilot-0-execution-tracker.md` immediately before sending invitations.
2. Keep `docs/hrba-pilot-issue-log-template.md` open during rehearsal for P0/P1/P2/P3 issue logging.

## 9. Final Preflight Decision

Decision: Ready with caution.

Reason:

- Technical readiness checks passed.
- Official HRBA deployment is serving the correct token-aware asset.
- Both learner emails are new and suitable for registration testing.
- The execution tracker is present and corrected.
- The only blocker to sending invitations is operational confirmation of the pilot access code and Hub URL.

Do not create accounts until explicitly instructed or until learners register during the planned Internal Pilot 0 rehearsal.
