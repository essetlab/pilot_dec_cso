# DEC Internal Platform Rehearsal Package

## Purpose and boundary

This is a controlled internal rehearsal for named DEC Platform Administrators. It is not authorization to invite real CSOs or participants. Use fictional data only and prefix every test organization with `DEC Internal Test`.

The rehearsal ends on **23 August 2026** for planning purposes. That date does **not** automatically deactivate administrator accounts. DEC must decide separately which administrators continue into the real pilot.

## Approved administrator testers

| Name | Administrator identity | Note |
| --- | --- | --- |
| Ephrem Tiye | `ephremt@decethiopia.org` | Communication Officer |
| Abel Aniley | `abela@decethiopia.org` | Project Coordinator |
| Berhanu Demissie | `berhanud@decethiopia.org` | Executive Director |
| Hana M | `hanam@decethiopia.org` | DEC administrator tester |
| Girum Beyene | `tbeyene972@gmail.com` | Approved non-production Gmail exception |

Each person must activate only their own account and create a personal password through the secure confirmation flow. Temporary passwords must not be emailed or shared.

## Private entry point

The private entry point is:

`https://<controlled-preview-host>/admin`

It is deliberately absent from the public landing-page navigation. After authentication, only users with the `PLATFORM_ADMIN` or `SUPER_ADMIN` role can access administrator routes. Learners are redirected to the unauthorized page.

The authenticated rehearsal guide is:

`https://<controlled-preview-host>/admin/internal-test-guide`

The exact controlled Preview hostname must replace the placeholder only after the email and Preview configuration smoke tests pass.

## Journey 1 — Administrator setup

1. Open the personal one-time administrator invitation.
2. Confirm the invited email address and create a personal password.
3. Sign in and confirm the browser returns to the DEC Administrator Portal.
4. Confirm the portal identifies the user as an authorized administrator.
5. Open **Rehearsal Guide**.

Expected result: administrator pages load; no Vercel, GitHub, Supabase, or hosting account is required.

Capture: portal title and signed-in administrator name. Do not capture or report a password, token, or complete activation URL.

## Journey 2 — Controlled administrator operations

1. Create one fictional CSO named `DEC Internal Test — <tester initials>`.
2. Use a second email address personally controlled by the tester for one fictional learner.
3. Add the individual learner to the fictional CSO.
4. Assign only **Applying the Human Rights-Based Approach in CSO Practice**.
5. Create one learner invitation.
6. Deliver the secure link only to the test-learner mailbox.
7. Confirm the invitation delivery and status.

Expected result: the invitation is scoped to the selected learner, CSO, course, and version; the administrator can see its lifecycle without the full secure token appearing in history or logs.

Capture: fictional organization, learner list, assignment, and invitation-status screens with email addresses minimized where practical.

## Journey 3 — Fictional learner

1. Open the invitation in the second mailbox.
2. Register or sign in with exactly the invited email.
3. Explicitly accept the HRBA invitation.
4. Launch HRBA from the Hub.
5. Save progress, sign out, sign in again, and resume.
6. Complete the modules and Final Assessment.
7. Confirm Hub completion and download the certificate.

Expected result: activation is bound to the invited identity; progress resumes; completion, assessment, and certificate belong only to that learner.

Capture: acceptance result, learner dashboard, resumed progress, completion, and certificate. Remove personal information and verification codes before sharing screenshots outside the controlled issue log.

## Journey 4 — Monitoring and issue reporting

1. Return to the administrator account.
2. Confirm invitation activation status.
3. Confirm learner course progress, completion, and certificate are visible.
4. Record one issue per issue-log entry.

Use this issue template:

```text
Tester:
Date and time (EAT):
Journey: Administrator / Learner / Recovery
Page or action:
Expected result:
Actual result:
Steps to reproduce:
Severity: Blocks testing / Major / Minor / Suggestion
Screenshot or evidence reference:
```

Never include passwords, access tokens, complete invitation or recovery URLs, database identifiers, or real participant information.

## Password-recovery check

1. From sign-in, request recovery for the administrator’s own address.
2. Open the newest recovery email on the same controlled Preview hostname.
3. Set a new personal password.
4. Confirm the old password fails and the new password succeeds.
5. Confirm the used recovery link cannot be reused.

Expected result: the request is non-disclosing, the link stays on the controlled Hub hostname, and the account retains its administrator role.

## Support

Use the approved pilot support address shown in the invitation and recovery emails. If the issue concerns email delivery, include the time, recipient domain, and message type, but never the secure link or credentials.

## Targeted cleanup after the rehearsal

Retain:

- the five named administrator Auth and Hub accounts;
- their administrator role assignments unless DEC separately authorizes deactivation;
- administrator audit records;
- approved issue and feedback records.

Remove only records linked to organizations whose names begin with `DEC Internal Test`:

1. disable or cancel active fictional invitations;
2. revoke fictional assignments and launch tokens;
3. delete fictional certificates and assessment attempts;
4. delete fictional lesson/course progress and enrollments;
5. delete fictional course invitations;
6. unlink and delete fictional test learners in Hub and Supabase Auth;
7. delete the fictional organizations after dependent records are gone.

Before deletion, resolve exact record IDs from the controlled organization prefix and review counts. After deletion, verify zero fictional organizations, learners, invitations, assignments, enrollments, progress records, attempts, certificates, and launch tokens remain. Do not reset or reseed the database.
