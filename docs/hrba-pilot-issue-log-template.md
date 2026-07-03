# HRBA E-learning Pilot Issue Log Template

Use this log during pilot to capture actionable issues without reopening accepted course design decisions.

Pilot status: accepted as pilot-ready with P3 backlog.

Freeze rule: do not make production changes to Modules 1-5, Final Assessment, or course navigation unless a new P0/P1 pilot blocker appears.

## 1. Severity Definitions

| Severity | Definition | Pilot action | Examples |
|---|---|---|---|
| P0 - Pilot blocker | Prevents learners or pilot staff from accessing, launching, completing, passing, or verifying the course for a broad group. | Stop affected launch path. Escalate immediately. Fix before continuing affected pilot activity. | Course cannot launch for most users; login unavailable; Final Assessment pass cannot be recorded; certificates cannot be issued or verified for passing learners. |
| P1 - Critical pilot issue | Blocks an important pilot workflow for some learners or staff, or creates material data, privacy, or certificate risk. | Triage same day. Fix before relying on affected results. | Progress is not saved for a cohort; passed learners show failed/incomplete status; certificate status is wrong for specific users; private learner data is exposed. |
| P2 - Pilot-impacting issue | Causes confusion, workaround, or reduced quality but does not block course completion, assessment, certificate handoff, or access. | Log, assign owner, resolve if low risk before or during pilot. | Return to LMS is unclear but works; one activity instruction needs clarification; mobile layout is awkward but usable. |
| P3 - Backlog / accepted polish | Cosmetic, minor usability, wording, URL, or non-blocking polish already accepted for pilot or safe to defer. | Record for post-pilot backlog. Do not delay launch. | URL remains on previous route while correct screen displays; legacy route aliases redirect safely; wording could be smoother; unrelated lint/build warnings remain. |

## 2. Intake Form

Copy this section for each reported item.

```text
Issue ID:
Date reported:
Reported by:
Reporter role: Learner / Facilitator / Hub admin / LMS owner / Support / Other
Organization or cohort:
Learner affected, if applicable:
Contact for follow-up:

Short title:
Severity proposed: P0 / P1 / P2 / P3
Current status: New / Triaging / In progress / Waiting on Hub/LMS / Waiting on course app / Fixed / Verified / Deferred / Closed

Where it happened:
Course area: Overview / Module 1 / Module 2 / Module 3 / Module 4 / Module 5 / Final Assessment / Certificate handoff / LMS return / Login/access / Progress / Other
URL or LMS location:
Device and browser:
Date/time observed:

What happened:
Expected result:
Actual result:
Steps to reproduce:
How many learners affected:
Can the learner continue the pilot? Yes / No / Unknown

Evidence attached:
Screenshot/video:
Error message:
Learner ID or email shared through secure channel only: Yes / No / N/A
Related support ticket or LMS record:

Triage decision:
Confirmed severity:
Owner:
Next action:
Due date:
Resolution notes:
Verified by:
Verification date:
Post-pilot backlog needed: Yes / No
```

## 3. Live Issue Log

| ID | Date | Title | Severity | Area | Status | Owner | Affected users | Next action | Due | Verified |
|---|---|---|---|---|---|---|---:|---|---|---|
| HRBA-PILOT-001 | YYYY-MM-DD | Example: Learner cannot launch course from LMS | P0 | Login/access | New | TBD | TBD | Confirm scope and reproduce | YYYY-MM-DD | No |

## 4. Triage Rules

1. Classify the issue by learner impact, not by how easy it is to fix.
2. Treat certificate issuance, Final Assessment pass status, progress saving, login, launch, and course access as possible P0/P1 areas until proven otherwise.
3. Do not classify accepted P3 backlog as a launch blocker unless it now causes failed access, failed completion, failed pass handoff, privacy risk, or certificate risk.
4. If the issue is unclear, start as `Triaging` and record the missing evidence needed for a decision.
5. Confirm whether the issue belongs to the Hub/LMS, the external HRBA course app, configuration, user support, or content.
6. Close only after someone other than the fixer verifies the result or the pilot owner accepts deferral.

## 5. Accepted P3 Items To Keep Deferred

These should stay P3 unless pilot evidence shows they now cause a P0/P1 workflow failure.

| Accepted item | Default severity | Escalate only if |
|---|---|---|
| Some return/review actions visually show the correct page while the URL remains on the previous route. | P3 | Learner cannot continue, progress is lost, or LMS return fails. |
| Module 5 legacy direct route aliases remain but route to active/safe screens. | P3 | A legacy route opens incorrect content or bypasses required navigation/completion rules. |
| Locked direct routes safely show overview but keep attempted URL. | P3 | Locked learners can access restricted content or eligible learners cannot access allowed content. |
| No standalone in-app certificate route exists for the HRBA course. | P3 | Hub/LMS cannot issue or verify certificates after a learner passes the Final Assessment. |
| Existing unrelated lint/build and bundle-size warnings remain. | P3 | A warning becomes a runtime failure in the pilot environment. |

## 6. Pilot Support Routing

| Issue type | Primary owner | Required confirmation |
|---|---|---|
| Login, account, access code, or enrollment issue | Hub/LMS support owner | Learner can access the assigned course. |
| Course launch or iframe issue | Hub/LMS technical owner and HRBA course app owner | Course opens from the Hub/LMS using the pilot launch path. |
| Progress saving issue | Hub/LMS technical owner | Completion/progress status is recorded as expected. |
| Final Assessment result handoff issue | Hub/LMS technical owner and HRBA course app owner | Pass/fail status is received or verifiable by the Hub/LMS. |
| Certificate status issue | Hub/LMS owner | Certificate is issued or verified according to the external certificate handoff decision. |
| Content clarity issue | Pilot content owner | Learner can continue without course redesign. |
| Visual polish or minor wording | Post-pilot backlog owner | Item is logged as P3 unless it blocks pilot completion. |

## 7. Daily Pilot Review

Use this short review rhythm during active pilot days.

```text
Date:
Reviewed by:
Open P0:
Open P1:
New P2:
New P3:
Items needing Hub/LMS owner decision:
Items needing HRBA course app owner decision:
Items verified and closed:
Launch risk today: Green / Amber / Red
Notes:
```

## 8. Minimum Evidence For P0/P1

Every P0/P1 item should include:

- exact learner journey step;
- affected user or cohort, shared through the agreed secure support channel;
- time observed;
- browser/device;
- screenshot or exact error text where possible;
- whether the issue reproduces for another pilot account;
- whether progress, pass status, or certificate status is affected;
- owner and next action.

## 9. Post-pilot Backlog Export

At the end of pilot, export remaining non-blocking items with these fields:

| ID | Title | Severity | Area | Evidence | Recommendation | Keep / Fix / Close | Owner |
|---|---|---|---|---|---|---|---|
