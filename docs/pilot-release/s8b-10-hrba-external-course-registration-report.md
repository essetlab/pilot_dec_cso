# S8B-10 HRBA External Course Registration Report

## Summary

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Private environment file used: `D:\CSO_Learning_Hub_Secrets\s8b-real-pilot.env`
- Approved mutation scope: HRBA external course metadata only, plus required system placeholder/admin role created by the existing helper
- Decision: **HRBA metadata registered; ready for controlled deployed app verification**

## Environment Presence

The private environment file was loaded into local command processes without printing values.

- `DATABASE_URL`: present
- `SESSION_POOLER_URL`: present
- `HRBA_EXTERNAL_COURSE_URL`: present
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`: present
- `NEXT_PUBLIC_APP_URL`: present
- `NEXT_PUBLIC_SUPABASE_URL`: present
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: present

`DIRECT_URL` was not used.

## Helper Inspection

Script inspected:

```text
register:hrba-external-course = node --import jiti/register scripts/register-hrba-external-course.ts
```

Underlying script:

- `scripts/register-hrba-external-course.ts`

Primary helper:

- `src/lib/external-course-workflow.ts`
- `registerHrbaExternalCourse()`

Constants inspected:

- HRBA slug: `applying-human-rights-based-approach-in-cso-practice`
- HRBA course id: `COURSE-HRBA-EXTERNAL-VITE-V1`
- HRBA course version id: `PCV-HRBA-EXTERNAL-VITE-V1`
- HRBA module id: `MOD-HRBA-EXTERNAL-VITE`
- HRBA lesson id: `LES-HRBA-EXTERNAL-VITE`
- HRBA quiz id: `QUIZ-HRBA-EXTERNAL-COMPLETION`
- HRBA quiz question id: `QQ-HRBA-EXTERNAL-COMPLETION`
- Default HRBA URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`

Expected records created/updated:

- `Role`: `SUPER_ADMIN`, only if no existing super/platform admin exists
- `User`: `integration-admin@example.local`, only as system/integration placeholder if no existing super/platform admin exists
- `UserRoleAssignment`: integration owner role assignment
- `CapacityArea`: HRBA capacity area
- `Course`: HRBA external course metadata
- `CourseCapacityArea`: HRBA course capacity link
- `CourseVersion`: HRBA published version
- `Module`: embedded HRBA module
- `Lesson`: embedded HRBA lesson
- `ContentBlock`: external launch content block
- `LearningOutcome`: five HRBA outcomes
- `Quiz`: final external completion quiz
- `QuizQuestion`: completion question

Safety inspection:

- Creates `integration-admin@example.local`: yes, because no existing admin was present
- Creates `SUPER_ADMIN`: yes, because no existing admin role was present
- Creates learner/user-facing accounts: no
- Touches certificate records: no
- Touches enrollment records: no
- Touches launch-token records: no
- Idempotent: yes, helper uses `upsert` for the registered metadata
- Broad demo/sample data: no

## Command Run

```powershell
npm run register:hrba-external-course
```

Result: passed.

Returned course:

- Slug: `applying-human-rights-based-approach-in-cso-practice`
- Title: `Applying the Human Rights-Based Approach in CSO Practice`
- Status: `PUBLISHED`

## Post-Registration Counts

Counts only. No raw internal IDs were printed.

| Model / table | Count |
| --- | ---: |
| `User` | 1 |
| `Role` | 1 |
| `UserRoleAssignment` | 1 |
| `Course` | 1 |
| `CourseCapacityArea` | 1 |
| `CourseVersion` | 1 |
| `Module` | 1 |
| `Lesson` | 1 |
| `ContentBlock` | 1 |
| `LearningOutcome` | 5 |
| `Quiz` | 1 |
| `QuizQuestion` | 1 |
| `CapacityArea` | 1 |
| `Enrollment` | 0 |
| `Certificate` | 0 |
| `ExternalCourseLaunchToken` | 0 |

Records created/updated by category:

- System placeholder/admin: `integration-admin@example.local`, `SUPER_ADMIN`, one role assignment
- HRBA metadata: course, version, module, lesson, launch block, five outcomes, final quiz, quiz question, capacity area, course-capacity link
- Learner activity: none
- Certificates: none
- Launch tokens: none

## HRBA Metadata Readiness

- HRBA course metadata present: yes
- HRBA slug present: yes
- HRBA title present: yes
- HRBA external URL matches approved URL: yes
- Course published and public: yes
- Certificate eligible: yes
- Final test required: yes
- Course version present: yes
- Module present: yes
- Lesson present: yes
- External launch content block present: yes
- Final quiz present: yes
- Quiz question present: yes
- Certificates issued remain zero: yes
- Enrollments remain zero: yes
- Launch tokens remain zero: yes

## Verification Results

`npm run verify:hrba-external-course`: skipped.

Reason: inspection showed this verifier mutates real database state. It calls `registerHrbaExternalCourse()`, expects a demo participant, deletes external launch tokens/certificates/quiz attempts/lesson progress for that participant, updates enrollments, and can exercise certificate issuance paths. That is outside this slice's real pilot constraints.

Other checks:

| Command | Result |
| --- | --- |
| `npm run verify:s8-env-readiness` | pass with warning |
| `npx prisma validate` | pass |
| `npm run prisma:validate` | pass |
| `git diff --check` | pass |
| `git status --short` before report creation | clean |

Remaining warning:

- `SMTP_*`: SMTP variables are present; ensure Hub direct emails are intentionally enabled.

## Public Route Smoke

GET requests only. No account creation or form submission.

| Route | HTTP status | Server error marker |
| --- | ---: | --- |
| `/` | 200 | no |
| `/courses` | 200 | no |
| `/register` | 200 | no |
| `/sign-in` | 200 | no |
| `/verify-certificate` | 200 | no |

## Recommended Next Action

Proceed to controlled deployed app verification. If the deployed Vercel app does not show the newly registered HRBA course, redeploy Vercel or trigger a cache refresh so the app uses the corrected environment and fresh database state.

Do not invite Daniel or Mulu, create learner accounts, or run registration/sign-in verifiers until the controlled deployed app verification slice is explicitly approved.

## Safety Confirmations

- No migrations were run.
- `prisma migrate deploy` was not run.
- `prisma migrate dev` was not run.
- `prisma db push` was not run.
- `db:seed` was not run.
- `db:setup:production` was not run.
- No broad demo/sample data was imported.
- No learner accounts were created.
- Daniel and Mulu were not invited.
- No real human admin accounts were created.
- No deployment was attempted.
- HRBA deployment, launchToken, callback, and certificate logic were not changed.
- No committed `.env` files were modified.
- The private environment file was not copied into the repository.
- No secret values or full connection strings were printed or committed.
