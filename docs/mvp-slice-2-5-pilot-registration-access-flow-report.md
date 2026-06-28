# MVP Slice 2.5 Pilot Registration Access Flow Report

## 1. Summary of changes

- Replaced the public `/register` access-request page with a learner-only pilot registration form.
- Added a pilot learner registration server action and workflow helper.
- Added access-code validation, duplicate-email prevention, password policy validation, consent validation, and basic organization linking.
- Updated public `/sign-in` so it presents learner credentials and public learner quick access only.
- Preserved the separate `/register/staff` invitation-token flow for staff registration.

## 2. Files changed

- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/register/actions.ts`
- `src/app/(auth)/sign-in/page.tsx`
- `src/lib/pilot-registration-workflow.ts`
- `docs/mvp-slice-2-5-pilot-registration-access-flow-report.md`

## 3. Registration behavior

- Page title: `Create your learner account`.
- The form collects full name, email, password, confirm password, organization, role/position, region, learner type, pilot access code, and consent.
- Successful registration creates an active learner account and redirects to `/sign-in?notice=pilot-registration-complete`.
- Passwords use the existing password hashing and policy helpers.
- Public registration assigns only the `PARTICIPANT` role.

## 4. Access-code / invited-email behavior

- The implementation uses simple access-code mode by default.
- Default local/dev access code: `HRBA-PILOT-2026`.
- `PILOT_ACCESS_CODE` or comma-separated `PILOT_ACCESS_CODES` can override the default without committing secrets.
- Optional strict mode can be enabled with `PILOT_REGISTRATION_MODE=strict`; in that mode, `PILOT_INVITED_EMAILS` or an active `OnboardingInvitation` with `PARTICIPANT` role can allow the email.
- `OnboardingInvitation` does not currently contain a pilot access code or organization/cohort context, so no schema change was made.

## 5. Public role cleanup

- `/register` now shows only:
  - `Participant`
  - `CSO focal person`
- Public `/register` and `/sign-in` no longer render:
  - Course creator
  - Programme support
  - Platform admin
  - Super admin
  - Course reviewer
  - M&E viewer

## 6. Sign-in behavior

- `/sign-in` copy now focuses on learner credentials.
- The pilot registration success notice appears on sign-in.
- Public quick access is limited to learner/participant access.
- Existing password sign-in remains available for active accounts.

## 7. Data privacy protections

- The public registration form does not collect personal ID numbers, sensitive stories, political affiliation, religion, ethnicity, health data, survivor status, complaints, or confidential organization details.
- The form creates only learner-facing account data and basic organization linkage.
- Invalid access-code and invited-email errors do not reveal private invitation records.
- No `.env` values or secrets were printed or committed.

## 8. Seed/test data added, if any

- No seed files were changed.
- No database schema or migration was added.
- Local throwaway learner accounts were created during verification using the safe local pilot access code.

## 9. Commands run and results

```powershell
npm run lint
npm run build
npm run prisma:validate
```

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run prisma:validate`: passed.

Additional verification:

- `/register`: HTTP 200.
- `/register?error=invalid-access-code`: HTTP 200.
- `/register?error=duplicate-email`: HTTP 200.
- `/sign-in`: HTTP 200.
- `/courses`: HTTP 200.
- `/verify-certificate?code=CERT-E-V1-DEMO-GVO5`: HTTP 200.
- `/learn`, `/learn/profile`, `/learn/settings`, `/learn/my-courses`, `/learn/certificates`: HTTP 200 with authenticated participant session.
- `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`: HTTP 200 with authenticated participant session.
- Workflow helper check: valid registration returned `created`; repeated email returned `duplicate-email`; wrong access code returned `invalid-access-code`.
- Role check: a CSO focal person learner type still received only the `PARTICIPANT` role.

## 10. Manual verification steps

1. Open `/register`.
2. Confirm the page says `Create your learner account`.
3. Confirm learner type options are only `Participant` and `CSO focal person`.
4. Confirm internal public roles are not shown.
5. Submit the form with an invalid access code and confirm the access-code error.
6. Submit with an already registered email and confirm the duplicate-email error.
7. Submit with a new email and valid pilot access code.
8. Confirm redirect to `/sign-in?notice=pilot-registration-complete`.
9. Sign in with the new learner credentials.
10. Open `/learn`, `/learn/profile`, `/learn/settings`, `/learn/my-courses`, and `/learn/certificates`.
11. Confirm `/courses` still loads.
12. Confirm `/verify-certificate?code=CERT-E-V1-DEMO-GVO5` still works.
13. Confirm the HRBA external-course route still works for an authenticated learner.

## 11. Remaining limitations

- The default pilot gate is simple access-code mode, not a full invitation dashboard.
- Strict invited-email mode requires environment configuration or active participant invitations.
- Public registration does not automatically assign cohorts because the current public form does not collect a safe cohort identifier.
- Public registration does not auto-enroll learners; existing course launch/access workflows handle enrollment where supported.
- Browser automation timed out during one in-app browser attempt, so final verification used build checks, workflow checks, HTTP checks, and documented manual steps.

## 12. Recommended next slice

Proceed to MVP Slice 3 only after human review of the pilot registration flow.
