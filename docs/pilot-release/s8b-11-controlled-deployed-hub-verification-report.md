# S8B-11 Controlled Deployed Hub Verification Report

## Summary

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Deployed Hub URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Task scope: controlled deployed app verification after HRBA metadata registration
- Decision: **Proceed to controlled Daniel/Mulu registration test**

## Deployed Route Smoke

GET requests only. No forms were submitted.

| Route | HTTP status | Server error marker | Page content loaded |
| --- | ---: | --- | --- |
| `/` | 200 | no | yes |
| `/courses` | 200 | no | yes |
| `/register` | 200 | no | yes |
| `/sign-in` | 200 | no | yes |
| `/verify-certificate` | 200 | no | yes |

The deployed Hub URL responds successfully and no public route showed a server-error marker.

## HRBA Public Course Visibility

Checked deployed `/courses` response.

- HRBA course visible: yes
- Course title visible: yes
- Course slug/link visible: yes
- Server error marker: no
- Raw internal IDs exposed in public HTML: no

Expected public values were visible:

- `Applying the Human Rights-Based Approach in CSO Practice`
- `applying-human-rights-based-approach-in-cso-practice`

Known internal identifiers checked and not found in public HTML:

- `COURSE-HRBA-EXTERNAL-VITE-V1`
- `PCV-HRBA-EXTERNAL-VITE-V1`
- `MOD-HRBA-EXTERNAL-VITE`
- `LES-HRBA-EXTERNAL-VITE`
- `QUIZ-HRBA-EXTERNAL-COMPLETION`
- `QQ-HRBA-EXTERNAL-COMPLETION`

## Read-Only Database Counts

The private environment file was loaded into local command processes without printing values. Counts were read using Prisma only.

| Model / table | Count |
| --- | ---: |
| `User` | 1 |
| `Role` | 1 |
| `Course` | 1 |
| `CourseVersion` | 1 |
| `Module` | 1 |
| `Lesson` | 1 |
| `Quiz` | 1 |
| `QuizQuestion` | 1 |
| `CapacityArea` | 1 |
| `Enrollment` | 0 |
| `Certificate` | 0 |
| `ExternalCourseLaunchToken` | 0 |
| `QuizAttempt` | 0 |
| `LessonProgress` | 0 |

Additional read-only confirmations:

- `integration-admin@example.local` exists: yes
- `SUPER_ADMIN` exists: yes
- Non-placeholder users: 0

## No Unintended Learner Activity

- No learner accounts created: yes
- No enrollments created: yes
- No certificates issued: yes
- No launch tokens created: yes
- No quiz attempts created: yes
- No lesson progress created: yes

## Safe Check Results

| Command | Result |
| --- | --- |
| `npm run verify:s8-env-readiness` | pass with warning |
| `npx prisma validate` | pass |
| `npm run prisma:validate` | pass |
| `git diff --check` | pass |
| `git status --short` before report creation | clean |

Remaining warning:

- `SMTP_*`: SMTP variables are present; ensure Hub direct emails are intentionally enabled.

No mutating verifiers were run. Verifiers that create users, launch tokens, enrollments, certificates, quiz attempts, or other learning activity remain out of scope until explicitly approved.

## Recommended Next Action

Proceed to a controlled Daniel/Mulu registration test in a separately approved slice.

The deployed public app is reachable, the HRBA course appears publicly after redeploy, the expected real pilot metadata exists, and no unintended learner activity was detected.

## Safety Confirmations

- No migrations were run.
- `prisma migrate deploy` was not run.
- `prisma migrate dev` was not run.
- `prisma db push` was not run.
- No seed scripts were run.
- `db:setup:production` was not run.
- `register:hrba-external-course` was not run.
- No learner accounts were created.
- No real admin accounts were created.
- Daniel and Mulu were not invited.
- No registration or sign-in forms were submitted.
- The HRBA course was not launched as a real learner.
- No certificates were generated.
- HRBA deployment, launchToken, callback, and certificate logic were not changed.
- No committed `.env` files were modified.
- The private environment file was not copied into the repository.
- No secret values or full connection strings were printed or committed.
