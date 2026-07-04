# Internal Pilot 0 Rehearsal Runbook

Date: 2026-07-04

## 1. Purpose Of Internal Pilot 0

Internal Pilot 0 is a controlled rehearsal of the CSO Learning Hub HRBA pilot journey before inviting real CSO learners.

The goal is to confirm that a small internal group can register, sign in, launch the protected HRBA course, complete the course pathway, trigger completion and final assessment handoff, receive or verify a certificate, submit feedback, and review aggregate monitoring without changing the frozen pilot release.

This rehearsal should answer one practical question: can the support team confidently guide real pilot learners through the current release?

## 2. Who Should Participate

Recommended rehearsal participants:

- Programme owner or delegate.
- Hub/LMS support owner.
- Hub technical owner.
- HRBA course app owner.
- Pilot facilitator.
- Monitoring or M&E reviewer.
- 2-4 internal test learners using realistic learner devices where possible.

At least one test learner should use a phone or narrow browser viewport. At least one support person should observe without intervening unless the learner is blocked.

## 3. Test Learner Profile Fields Needed

Prepare realistic but non-sensitive internal learner records.

Required fields:

- Full name.
- Email address.
- Organization name.
- Role or position.
- Region.
- Learner type: participant or CSO focal person.
- Pilot access code or invitation method.
- Device and browser used during rehearsal.
- Contact person for follow-up.

Do not enter sensitive case details, complaints, survivor stories, exact locations, political details, safeguarding cases, or confidential organization information.

## 4. Pre-Rehearsal Setup Checklist

Before the rehearsal:

- Confirm the final pilot freeze remains accepted: `pilot-ready with limitations`.
- Confirm the Hub release includes commit `6e67cd3 Add final CSO Learning Hub pilot acceptance QA report`.
- Confirm the HRBA official URL is `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
- Confirm the HRBA deployed asset is `/assets/index-OJrecxNB.js`.
- Confirm the HRBA deployment is the launchToken release branch: `release/hrba-pilot-latest-launchtoken`.
- Confirm support staff have access to `docs/hrba-pilot-issue-log-template.md`.
- Confirm test learner email addresses and access method are ready.
- Confirm no one is planning production content, schema, callback, certificate, auth, or navigation changes during rehearsal.
- Confirm the support channel for rehearsal issues is agreed.
- Confirm the person who will make the go / go-with-caution / no-go decision.

Optional technical confidence checks before the session:

- Homepage loads.
- `/courses` loads.
- HRBA overview loads.
- Register and sign-in pages load.
- Certificate verification page loads.
- Support, privacy, terms, and accessibility pages load.

## 5. Launch-Day Smoke Check

Run this checklist at the start of Internal Pilot 0:

- Homepage loads.
- `/courses` loads.
- HRBA course overview loads.
- Register works for an internal test learner.
- Sign-in works for an internal test learner.
- Signed-in learner dashboard loads.
- My Courses loads.
- Signed-in learner can launch the HRBA iframe.
- HRBA iframe URL includes `launchToken`.
- HRBA iframe URL excludes raw IDs: `userId`, `learnerId`, `enrollmentId`, and `courseVersionId`.
- Certificate verification page loads.
- Support, privacy, terms, and accessibility pages load.
- Pilot monitoring loads for authorized users.

If any item fails, classify it using the P0/P1/P2/P3 rules before making any change.

## 6. Internal Learner Invitation Template

Subject: Internal rehearsal for CSO Learning Hub HRBA pilot

Message:

```text
Hello [Name],

You are invited to help rehearse the CSO Learning Hub HRBA pilot journey before real learner launch.

Please use the test learner details below:

Hub URL: [Hub URL]
Learner email: [Email]
Pilot access code or sign-in method: [Access details]

Your task is to move through the learner journey as naturally as possible:
1. Register or sign in.
2. Open your learner dashboard.
3. Open My Courses.
4. Launch the HRBA course from the Hub.
5. Complete as much of the course and final assessment as the rehearsal plan requires.
6. Check certificate and verification behavior if you complete and pass.
7. Submit feedback.

Please do not enter sensitive case details, real survivor stories, complaints, exact locations, political details, safeguarding cases, or confidential organization information.

If something fails, take a screenshot or copy the exact error text and tell the support observer:
- what you were trying to do;
- what happened;
- device and browser;
- whether you can continue.

Thank you for helping make the pilot safer and easier for real learners.
```

## 7. Step-By-Step Learner Journey

Each internal learner should follow these steps:

1. Open the Hub homepage.
2. Confirm the homepage communicates `Learn. Connect. Grow.`
3. Open the course catalog.
4. Find `Applying the Human Rights-Based Approach in CSO Practice`.
5. Open the HRBA course overview.
6. Confirm the overview is about HRBA, not proposal development.
7. Confirm the certificate rule states completion and 80% or above on final assessment.
8. Register a learner account if using the registration path.
9. Sign in.
10. Open the learner dashboard.
11. Open My Courses.
12. Launch the HRBA course from the Hub.
13. Confirm the HRBA course opens in the embedded iframe.
14. Continue through the HRBA course modules according to the rehearsal timebox.
15. Complete the final assessment if the rehearsal includes full completion.
16. Return to the Hub learner area.
17. Check certificate availability after completion and pass.
18. Open the Certificates page.
19. Verify the certificate publicly using the certificate code.
20. Submit course feedback if the learner reaches the feedback point.

Observers should let the learner proceed naturally and only intervene when the learner is blocked or at risk of entering sensitive information.

## 8. What To Observe During Course Completion

Observe and record:

- Can the learner find the HRBA course without help?
- Can the learner understand that the Hub is the official entry point?
- Does the iframe open reliably?
- Does the iframe URL include `launchToken`?
- Does the iframe URL avoid raw IDs?
- Does the learner understand module lock/unlock behavior?
- Does the learner know what to do after each module?
- Does the learner understand final assessment requirements?
- Does progress appear to resume when expected?
- Does completion or pass status appear correctly after final assessment?
- Are there confusing screens, unclear buttons, or mobile layout problems?
- Does the learner encounter any browser/device issue?
- Does the learner avoid entering sensitive information?

If a real browser-captured progress/final-assessment `postMessage` is not practical to capture, record that limitation and rely on `npm run verify:hrba-external-course` plus live asset inspection for callback coverage.

## 9. Certificate And Verification Checks

For learners who complete and pass:

- Confirm the Hub shows certificate availability.
- Confirm certificate data is present.
- Confirm the certificate code is visible.
- Download the certificate PDF if that is part of the rehearsal scope.
- Open `/verify-certificate`.
- Enter the certificate code.
- Confirm public verification returns issued/valid certificate status.
- Confirm public verification shows only safe fields:
  - certificate status;
  - learner certificate name;
  - course title;
  - issue date;
  - certificate code;
  - issuing platform.
- Confirm public verification does not show learner email, assessment answers, private progress details, portfolio content, internal IDs, or private organization details.

For learners who do not complete or pass:

- Confirm certificates are not incorrectly issued.
- Confirm support can explain the 80% final assessment requirement.

## 10. Feedback And Monitoring Checks

Feedback checks:

- Confirm completed learners can access the feedback form.
- Confirm feedback questions are understandable.
- Confirm learners know not to enter sensitive details.
- Confirm feedback submission succeeds.

Monitoring checks for authorized users:

- Confirm the pilot monitoring page loads.
- Confirm aggregate participation, progress, assessment, certificate, and feedback summaries are visible.
- Confirm monitoring does not expose private assessment answers, private feedback text to unauthorized roles, private portfolio outputs, or donor-facing raw learner records.
- Confirm M&E or monitoring users see only the intended protected view.

## 11. Issue Logging Rules Using P0/P1/P2/P3

Use `docs/hrba-pilot-issue-log-template.md` for every rehearsal issue.

Severity definitions:

- P0 - Pilot blocker: prevents broad learner or pilot staff access, launch, completion, pass recording, certificate issuing, or certificate verification.
- P1 - Critical pilot issue: blocks an important workflow for some learners or staff, or creates material data, privacy, or certificate risk.
- P2 - Pilot-impacting issue: causes confusion, workaround, or reduced quality but does not block course completion, assessment, certificate handoff, or access.
- P3 - Backlog / accepted polish: cosmetic, minor usability, wording, URL, or non-blocking polish accepted for pilot or safe to defer.

Treat these areas as possible P0/P1 until proven otherwise:

- Login, registration, access code, or enrollment failure.
- HRBA launch or iframe failure.
- Progress saving failure.
- Final assessment pass/fail handoff failure.
- Certificate issuance or public verification failure.
- Private learner data exposure.

Minimum evidence for P0/P1:

- Exact learner journey step.
- Affected learner or cohort, shared only through the secure support channel.
- Time observed.
- Browser and device.
- Screenshot or exact error text where possible.
- Whether another pilot account reproduces the issue.
- Whether progress, pass status, or certificate status is affected.
- Owner and next action.

Do not classify accepted P3 backlog as a launch blocker unless it now causes failed access, failed completion, failed pass handoff, privacy risk, or certificate risk.

## 12. Go / Go-With-Caution / No-Go Decision Criteria

Go:

- No open P0 issues.
- No open P1 issues affecting launch-critical workflows.
- Learners can register or sign in.
- Learners can launch HRBA through the Hub iframe.
- Iframe URL includes `launchToken` and excludes raw IDs.
- Completion/final assessment/certificate behavior is either verified through rehearsal or covered by the accepted verifier evidence.
- Public certificate verification works.
- Support team understands issue logging and escalation.

Go with caution:

- No P0 issues are open.
- One or more P1 issues are understood, contained, and accepted by the programme owner with a workaround.
- P2/P3 issues exist but do not block access, launch, completion, assessment, certificate handoff, privacy, or public verification.
- Support owner is ready to monitor the issue during real pilot launch.

No-go:

- Any P0 issue remains open.
- A P1 issue creates unresolved data, privacy, certificate, access, launch, progress, or pass/fail risk.
- `launchToken` is missing from learner HRBA iframe URLs.
- Raw Hub IDs appear in learner-facing HRBA URLs.
- Certificates are issued incorrectly or cannot be publicly verified.
- Private learner data is exposed.
- Support team is not ready to triage learner issues.

## 13. What Must Not Be Changed During Rehearsal Unless P0/P1 Appears

Do not change production course content, navigation, certificate logic, callback contract, registration/auth, or database schema unless a new P0/P1 blocker appears.

Do not add:

- Donor portal.
- Public organization scoring.
- Community/forum platform.
- Course authoring or Build Studio.
- Practical proof gallery.
- External verifier role.
- Advanced analytics or capability intelligence.
- Full offline sync claims.

Do not modify:

- Application source code.
- Database schema.
- Migrations.
- `.env`.
- HRBA deployment.
- Certificate generation logic.
- HRBA callback logic.

If a P0/P1 appears, log evidence first, assign an owner, confirm scope, and make the smallest safe fix only after the programme owner and technical owner agree.

## 14. Post-Rehearsal Summary Template

Copy and complete this after Internal Pilot 0.

```text
Internal Pilot 0 date:
Rehearsal lead:
Programme owner:
Support owner:
Technical owner:
HRBA course app owner:
Number of test learners:
Devices/browsers used:

Overall decision:
Go / Go with caution / No-go

What worked:
- 

What blocked learners:
- 

Open P0:
- 

Open P1:
- 

New P2:
- 

New P3 / backlog:
- 

Registration/sign-in result:

HRBA launch result:

launchToken / raw ID check:

Course completion observations:

Final assessment observations:

Certificate issuance result:

Public certificate verification result:

Feedback result:

Monitoring result:

Mobile/accessibility observations:

Privacy/safe-use observations:

Support process observations:

Owner decisions needed before real learner launch:
- 

Accepted limitations reconfirmed:
- Full browser completion through all HRBA modules and final assessment was not part of final QA.
- Real browser-captured progress/final-assessment postMessage may remain uncaptured if gated progression prevents practical capture.
- Callback behavior remains covered by verifier and live asset inspection unless new evidence contradicts it.
- No full offline learning claim is made.

Final launch recommendation:

Signed off by:
Date:
```
