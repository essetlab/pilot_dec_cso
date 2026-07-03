# CSO Learning Hub Final Pilot Freeze And Launch Handoff

Date: 2026-07-04

## 1. Final Pilot Status

Verdict: pilot-ready with limitations.

Release references:

- Hub commit: `6e67cd3 Add final CSO Learning Hub pilot acceptance QA report`
- HRBA deployed release branch: `release/hrba-pilot-latest-launchtoken`
- HRBA deployed asset: `/assets/index-OJrecxNB.js`
- Official HRBA URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`

The platform is ready for a controlled pilot launch if the programme owner accepts the documented limitations and the pilot freeze rule below.

## 2. What Is Ready For Pilot

The following areas passed final QA or are covered by the final verifier scripts:

- Public homepage, including the approved `Learn. Connect. Grow.` positioning.
- Course catalog.
- HRBA course overview with HRBA-specific content and certificate rule wording.
- Learner registration.
- Learner sign-in.
- Learner dashboard.
- My Courses.
- HRBA protected iframe launch from the Hub.
- `launchToken` integration.
- Progress and final assessment callback coverage through `npm run verify:hrba-external-course`.
- Certificate generation after completion and passing assessment rules.
- Certificate PDF data availability.
- Public certificate verification.
- Feedback form.
- Aggregate pilot monitoring and protected feedback summaries.
- Support, privacy, terms, and accessibility pages.

## 3. Accepted Limitations

These limitations are accepted for the controlled pilot and should not delay launch unless pilot evidence shows they have become a P0/P1 issue:

- Full browser completion through all HRBA modules and the final assessment was not performed during final QA.
- A real browser-captured progress/final-assessment `postMessage` was not captured because the live HRBA course is gated by learner progression.
- The callback path is covered by `npm run verify:hrba-external-course` and by live HRBA asset inspection confirming tokenized progress/final-assessment message construction.
- Local QA used local `portalOrigin` configuration, so local iframe URLs showed `portalOrigin=http://localhost:3000` while the QA server ran on port `3100`.
- The pilot makes no full offline learning claim. Current supported language is mobile-friendly, lightweight, text-first where practical, and resumable online learning.

## 4. Pilot Freeze Rule

During pilot, do not change production course content, navigation, certificate logic, callback contract, registration/auth, or database schema unless a new P0/P1 blocker appears.

If a P0/P1 blocker appears, log evidence first, assign an owner, confirm scope, and make the smallest safe fix needed to unblock the pilot workflow.

## 5. What Must Not Be Added During Pilot

Do not add or expose these product areas during the pilot:

- Donor portal.
- Public organization scoring.
- Community/forum platform.
- Course authoring or Build Studio.
- Practical proof gallery.
- External verifier role.
- Advanced analytics or capability intelligence.
- Full offline sync claims.

These areas belong to the after-pilot backlog or future-stage specification work, not the frozen pilot release.

## 6. Pilot Support Process

Use `docs/hrba-pilot-issue-log-template.md` as the active support log template.

Severity model:

- P0 - Pilot blocker: prevents broad learner or pilot staff access, launch, completion, pass recording, certificate issuing, or certificate verification.
- P1 - Critical pilot issue: blocks an important workflow for some learners/staff or creates material data, privacy, or certificate risk.
- P2 - Pilot-impacting issue: creates confusion or workaround but does not block completion, assessment, certificate handoff, or access.
- P3 - Backlog / accepted polish: cosmetic, minor usability, wording, URL, or non-blocking polish accepted for pilot or safe to defer.

Blocker areas to treat as possible P0/P1 until proven otherwise:

- Login, registration, access code, or enrollment failure.
- HRBA launch or iframe failure.
- Progress saving failure.
- Final assessment result handoff failure.
- Certificate issuance or public verification failure.
- Private learner data exposure.

Support routing:

- Login, account, access code, and enrollment issues: Hub/LMS support owner.
- Course launch or iframe issues: Hub/LMS technical owner and HRBA course app owner.
- Progress saving issues: Hub/LMS technical owner.
- Final assessment handoff issues: Hub/LMS technical owner and HRBA course app owner.
- Certificate status issues: Hub/LMS owner.
- Content clarity issues: pilot content owner.
- Visual polish or minor wording: post-pilot backlog owner.

Evidence required for P0/P1:

- Exact learner journey step.
- Affected learner or cohort, shared only through the agreed secure support channel.
- Time observed.
- Browser and device.
- Screenshot or exact error text where possible.
- Whether another pilot account reproduces the issue.
- Whether progress, pass status, or certificate status is affected.
- Assigned owner and next action.

Daily pilot review:

- Review open P0/P1 items every active pilot day.
- Record new P2/P3 items without reopening accepted pilot scope.
- Mark launch risk as Green, Amber, or Red.
- Close issues only after verification or explicit pilot owner deferral.

## 7. Launch-Day Smoke Check

Run this short smoke check before opening a pilot cohort:

- Homepage loads.
- `/courses` loads.
- HRBA course overview loads.
- Register and sign-in work.
- Signed-in learner can launch the HRBA iframe.
- Iframe URL includes `launchToken`.
- Iframe URL excludes raw IDs such as `userId`, `learnerId`, `enrollmentId`, and `courseVersionId`.
- Certificate verification page loads.
- Support, privacy, terms, and accessibility pages load.
- Pilot monitoring loads for authorized users.

If any smoke check fails, classify it with the issue log severity model before making changes.

## 8. After-Pilot Backlog

Use `docs/specifications/cso-learning-hub-pilot-implementation-backlog.md` as the backlog source of truth after pilot.

Likely post-pilot areas:

- Mobile and accessibility refinements based on real pilot evidence.
- Community and LALINKage peer learning.
- Practical proof and verified achievement pathways.
- Consent-based organization profiles.
- External verifier role.
- Capability intelligence and advanced aggregate reporting.
- Multilingual and local-language expansion.

These are not pilot freeze items. They should be planned after learner evidence, support logs, and programme owner decisions are reviewed.

## 9. Final Go / No-Go Statement

The platform is ready to proceed to controlled pilot launch if the programme owner accepts the documented limitations and pilot freeze rule.

Go conditions:

- Programme owner accepts `pilot-ready with limitations`.
- Support team uses the issue log template and P0/P1 escalation process.
- Facilitators use the Hub as the official HRBA learner entry point.
- No one changes frozen production course content, navigation, certificate logic, callback contract, registration/auth, or database schema unless a new P0/P1 blocker appears.

No-go conditions:

- HRBA iframe launch fails for assigned learners.
- `launchToken` is missing from the iframe URL.
- Raw Hub IDs appear in learner-facing HRBA URLs.
- Final assessment pass/fail or certificate status cannot be recorded or verified.
- Public certificate verification exposes private learner data.
