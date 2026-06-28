# MVP Slice 2 Learner Profile Settings Report

## 1. Summary of changes

- Replaced the static learner profile with signed-in user, organization, enrollment, and certificate data.
- Added a safe learner profile edit foundation for existing `User` fields only.
- Added `/learn/settings` as a learner-facing account and privacy guidance foundation.
- Added learner navigation and route metadata for Settings.
- Preserved existing public, learner, certificate, and HRBA external-course routes.

## 2. Files changed

- `src/app/(learn)/learn/[[...segments]]/page.tsx`
- `src/components/learner/LearnerProfile.tsx`
- `src/lib/learner-actions.ts`
- `src/lib/learner-profile-workflow.ts`
- `src/lib/routes.ts`
- `docs/mvp-slice-2-learner-profile-settings-report.md`

## 3. Learner profile behavior

- `/learn/profile` now loads data for the signed-in learner from the database.
- The profile shows learner name, read-only email, account status, roles, linked organization, cohort, region, learning activity counts, recent course activity, and recent certificate records.
- The edit form supports existing user fields only: full name, job title, department, region, preferred language, and phone.
- Email, organization, and cohort are not learner-editable in this slice.

## 4. Account/settings behavior

- `/learn/settings` is active.
- The settings page shows account summary, certificate visibility guidance, portfolio privacy guidance, directory/community status, password/security guidance, and data request guidance.
- Directory/community visibility is explicitly marked as not active yet.
- Data/privacy request handling is documented as support-guided because no data-request model exists in this phase.

## 5. Data privacy protections

- Profile and settings data are scoped to the current signed-in learner session.
- The pages do not show assessment answers, portfolio content, other learners, admin-only fields, password data, session secrets, or raw role assignment internals.
- Organization display is limited to the learner's linked organization/cohort context.
- Certificate visibility copy confirms public verification exposes only minimal certificate data.

## 6. Routes verified

- `/`: HTTP 200
- `/courses`: HTTP 200
- `/courses/human-rights-based-approach-practice`: HTTP 200
- `/verify-certificate`: HTTP 200
- `/verify-certificate?code=CERT-E-V1-DEMO-GVO5`: HTTP 200
- `/learn`: HTTP 200 with authenticated participant session
- `/learn/profile`: HTTP 200 with authenticated participant session
- `/learn/settings`: HTTP 200 with authenticated participant session
- `/learn/my-courses`: HTTP 200 with authenticated participant session
- `/learn/certificates`: HTTP 200 with authenticated participant session
- `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`: HTTP 200 with authenticated participant session

## 7. Commands run and results

```powershell
npm run lint
npm run build
npm run prisma:validate
```

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run prisma:validate`: passed.

## 8. Manual verification steps

1. Confirm `cso-learning-hub-postgres` is running.
2. Open `http://localhost:3000/sign-in`.
3. Sign in with a seeded participant account or quick participant access.
4. Open `/learn` and confirm the learner dashboard loads.
5. Open `/learn/profile` and confirm account, organization, course, and certificate data are not static profile content.
6. Update a supported profile field and confirm the profile saves.
7. Open `/learn/settings` and confirm the settings foundation explains visibility and privacy boundaries.
8. Open `/learn/my-courses` and `/learn/certificates`.
9. Open `/verify-certificate` and `/verify-certificate?code=CERT-E-V1-DEMO-GVO5`.
10. Open `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external` after sign-in.

## 9. Remaining limitations

- No new privacy, consent, data-request, support ticket, forum, or community models were added.
- Password management remains limited to the current authentication flow.
- Learners cannot self-edit email, role, organization, cohort, or account status.
- Portfolio and directory/community controls are informational only because those learner-facing features are not active in this phase.

## 10. Recommended next slice

Proceed to the next approved MVP slice after human review of Slice 2.
