# Internal Pilot 0 Execution Tracker

Date prepared: 2026-07-04

## 1. Internal Pilot Objective

Internal Pilot 0 tests the full CSO Learning Hub HRBA learner journey with two internal HCDA test learners before inviting real CSO learners.

Objective:

- Confirm that internal learners can register, sign in, access the learner dashboard, open My Courses, launch the protected HRBA iframe, complete the course journey, complete the final assessment, receive certificate status, verify the certificate publicly, submit feedback, and appear in aggregate monitoring.
- Capture any issues using P0/P1/P2/P3 severity.
- Make a final go / go-with-caution / no-go recommendation for real learner launch.

Hub URL: `[Hub URL]`

Pilot access code: `[to be confirmed]`

## 2. Test Learner Table

| Learner | Email | Organization | Role | Region | Learner type | Pilot access code | Device/browser | Registration status | Sign-in status |
|---|---|---|---|---|---|---|---|---|---|
| Daniel Negash Kebede | agiledatawise@gmail.com | HCDA | Program Manager | Addis Ababa | Participant / CSO learner | `[to be confirmed]` | `[device/browser]` | `[pending / complete / blocked]` | `[pending / complete / blocked]` |
| Mulu Taddese Ayana | essetlab@gmail.com | HCDA | MEAL Officer | Oromia | Participant / CSO learner | `[to be confirmed]` | `[device/browser]` | `[pending / complete / blocked]` | `[pending / complete / blocked]` |

## 3. Pre-Launch Smoke Check Table

| Check | Expected result | Status | Evidence / notes | Owner |
|---|---|---|---|---|
| Homepage loads | Homepage opens and shows `Learn. Connect. Grow.` | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| `/courses` loads | Course catalog opens | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| HRBA overview loads | HRBA course overview opens with HRBA content | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Register page loads | Learner registration page opens | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Sign-in page loads | Learner sign-in page opens | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Certificate verification page loads | `/verify-certificate` opens | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Support page loads | `/support` opens | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Privacy page loads | `/privacy` opens | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Terms page loads | `/terms` opens | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Accessibility page loads | `/accessibility` opens | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Authorized monitoring loads | Pilot monitoring opens for authorized user | `[pending / pass / fail]` | `[notes]` | `[owner]` |

## 4. Registration Checklist For Each Learner

| Learner | Opens register page | Enters full name | Enters email | Enters organization | Enters role | Enters region | Selects learner type | Uses pilot access code | Accepts terms/privacy | Account created | Issues found |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Daniel Negash Kebede | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[pilot access code]` | `[yes/no]` | `[yes/no]` | `[issues found]` |
| Mulu Taddese Ayana | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[pilot access code]` | `[yes/no]` | `[yes/no]` | `[issues found]` |

## 5. Course Launch Checklist For Each Learner

| Learner | Signs in | Dashboard loads | My Courses loads | HRBA course visible | Launch action visible | HRBA iframe opens | Iframe includes `launchToken` | Iframe excludes raw IDs | Issues found |
|---|---|---|---|---|---|---|---|---|---|
| Daniel Negash Kebede | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[issues found]` |
| Mulu Taddese Ayana | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[issues found]` |

Raw ID check must confirm the iframe URL does not include:

- `userId`
- `learnerId`
- `enrollmentId`
- `courseVersionId`

## 6. Course Completion Checklist

| Learner | Module 1 completed | Module 2 completed | Module 3 completed | Module 4 completed | Module 5 completed | Completion date | Progress saved/resumed | Issues found |
|---|---|---|---|---|---|---|---|---|
| Daniel Negash Kebede | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[completion date]` | `[yes/no]` | `[issues found]` |
| Mulu Taddese Ayana | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[completion date]` | `[yes/no]` | `[issues found]` |

Observation notes:

| Learner | What was easy? | What was confusing? | Mobile/accessibility notes | Support needed? |
|---|---|---|---|---|
| Daniel Negash Kebede | `[notes]` | `[notes]` | `[notes]` | `[yes/no + notes]` |
| Mulu Taddese Ayana | `[notes]` | `[notes]` | `[notes]` | `[yes/no + notes]` |

## 7. Final Assessment And Certificate Checklist

| Learner | Final assessment opened | Final assessment submitted | Final score | Passed 80%+ | Completion/pass recorded | Certificate issued | Certificate code | Issues found |
|---|---|---|---|---|---|---|---|---|
| Daniel Negash Kebede | `[yes/no]` | `[yes/no]` | `[final score]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[certificate code]` | `[issues found]` |
| Mulu Taddese Ayana | `[yes/no]` | `[yes/no]` | `[final score]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[certificate code]` | `[issues found]` |

Certificate rule reminder:

- Certificate should be available only after completing required learning activities and scoring 80% or above on the final assessment.

## 8. Certificate Verification Checklist

| Learner | Certificate code | Public verification page opens | Code verifies as issued | Safe public fields only | No learner email exposed | No internal IDs exposed | Issues found |
|---|---|---|---|---|---|---|---|
| Daniel Negash Kebede | `[certificate code]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[issues found]` |
| Mulu Taddese Ayana | `[certificate code]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[yes/no]` | `[issues found]` |

Expected public fields only:

- Certificate status.
- Learner certificate name.
- Course title.
- Issue date.
- Certificate code.
- Issuing platform.

## 9. Feedback Submission Checklist

| Learner | Feedback page/form available | Feedback submitted yes/no | Feedback submission succeeds | Sensitive info avoided | Issues found |
|---|---|---|---|---|---|
| Daniel Negash Kebede | `[yes/no]` | `[feedback submitted yes/no]` | `[yes/no]` | `[yes/no]` | `[issues found]` |
| Mulu Taddese Ayana | `[yes/no]` | `[feedback submitted yes/no]` | `[yes/no]` | `[yes/no]` | `[issues found]` |

Safe-use reminder:

Do not enter names, survivor stories, exact locations, complaints, political details, safeguarding cases, or confidential organization information in feedback.

## 10. Pilot Monitoring Checklist

| Check | Expected result | Status | Evidence / notes | Owner |
|---|---|---|---|---|
| Authorized monitoring user can sign in | Monitoring user reaches authorized view | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Registrations visible in aggregate | Test learner registrations affect aggregate counts where expected | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Enrollment/start visible in aggregate | HRBA starts affect aggregate counts where expected | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Completion visible in aggregate | Completion counts update where expected | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Assessment/pass visible in aggregate | Assessment/pass counts update where expected | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Certificate counts visible | Issued certificates appear in aggregate summary | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Feedback summary visible | Feedback appears in protected summary where expected | `[pending / pass / fail]` | `[notes]` | `[owner]` |
| Private data protected | No raw assessment answers, private feedback text to unauthorized roles, private learner records, or internal IDs exposed | `[pending / pass / fail]` | `[notes]` | `[owner]` |

## 11. Issue Log Table

Use P0/P1/P2/P3 from the HRBA pilot issue log.

| ID | Date | Learner / area | Title | Severity | Status | Owner | Evidence | Next action | Due | Verified |
|---|---|---|---|---|---|---|---|---|---|---|
| IP0-001 | `[date]` | `[learner / area]` | `[issue title]` | `[P0/P1/P2/P3]` | `[new / triaging / fixed / deferred / closed]` | `[owner]` | `[evidence]` | `[next action]` | `[due]` | `[yes/no]` |
| IP0-002 | `[date]` | `[learner / area]` | `[issue title]` | `[P0/P1/P2/P3]` | `[new / triaging / fixed / deferred / closed]` | `[owner]` | `[evidence]` | `[next action]` | `[due]` | `[yes/no]` |

Severity quick guide:

- P0: blocks broad access, launch, completion, pass recording, certificate issuing, or certificate verification.
- P1: blocks an important workflow for some users or creates data, privacy, or certificate risk.
- P2: causes confusion or workaround but does not block completion, assessment, certificate handoff, or access.
- P3: cosmetic, wording, minor usability, URL, or accepted polish safe for backlog.

## 12. Go / Go-With-Caution / No-Go Decision

Decision: `[Go / Go with caution / No-go]`

Decision date: `[date]`

Decision owner: `[name]`

Go criteria:

- No open P0 issues.
- No open unresolved P1 issue affecting access, launch, completion, pass/fail, certificate, privacy, or verification.
- Both internal learners can register or sign in.
- HRBA iframe launch works and includes `launchToken`.
- HRBA iframe URL excludes raw IDs.
- Certificate behavior is correct for pass/fail outcome.
- Public certificate verification works for issued certificates.
- Feedback and monitoring checks are acceptable.

Go-with-caution criteria:

- No open P0 issues.
- Any open P1 issue is contained, documented, accepted by the programme owner, and has a clear workaround.
- P2/P3 items do not block learner launch or certificate trust.

No-go criteria:

- Any open P0 issue.
- Unresolved P1 issue affecting learner access, HRBA launch, progress, assessment, certificates, verification, or privacy.
- `launchToken` missing from HRBA iframe URL.
- Raw IDs visible in learner-facing HRBA iframe URL.
- Certificates issue incorrectly or cannot be verified.
- Private learner data is exposed.

Decision notes:

```text
[decision notes]
```

## 13. Final Internal Rehearsal Summary

Rehearsal date: `[date]`

Hub URL used: `[Hub URL]`

Pilot access code used: `[pilot access code]`

Participants:

- Daniel Negash Kebede
- Mulu Taddese Ayana
- `[support / facilitator / monitoring participants]`

Summary table:

| Area | Result | Notes |
|---|---|---|
| Registration | `[pass / caution / fail]` | `[notes]` |
| Sign-in | `[pass / caution / fail]` | `[notes]` |
| Learner dashboard | `[pass / caution / fail]` | `[notes]` |
| My Courses | `[pass / caution / fail]` | `[notes]` |
| HRBA iframe launch | `[pass / caution / fail]` | `[notes]` |
| `launchToken` / raw ID check | `[pass / caution / fail]` | `[notes]` |
| Course completion | `[pass / caution / fail]` | `[notes]` |
| Final assessment | `[pass / caution / fail]` | `[notes]` |
| Certificate issuance | `[pass / caution / fail]` | `[notes]` |
| Public certificate verification | `[pass / caution / fail]` | `[notes]` |
| Feedback submission | `[pass / caution / fail]` | `[notes]` |
| Pilot monitoring | `[pass / caution / fail]` | `[notes]` |
| Mobile/accessibility | `[pass / caution / fail]` | `[notes]` |
| Support process | `[pass / caution / fail]` | `[notes]` |

Issues found:

```text
[issues found]
```

Final recommendation:

```text
[Go / Go with caution / No-go and rationale]
```

Sign-off:

| Role | Name | Decision / approval | Date |
|---|---|---|---|
| Programme owner | `[name]` | `[approved / not approved / conditional]` | `[date]` |
| Support owner | `[name]` | `[ready / not ready / conditional]` | `[date]` |
| Technical owner | `[name]` | `[ready / not ready / conditional]` | `[date]` |
| Pilot facilitator | `[name]` | `[ready / not ready / conditional]` | `[date]` |
