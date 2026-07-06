# S8B-12 Daniel Registration Verification Report

## Summary

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Deployed Hub URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Expected learner email checked: `agiledatawise@gmail.com`
- Task scope: read-only verification after owner manually registered Daniel
- Decision: **Daniel registration is clean; inspect observed learner activity before Mulu registration**

## Environment Presence

The private environment file was loaded into local command processes without printing values.

- `DATABASE_URL`: present
- `NEXT_PUBLIC_APP_URL`: present
- `NEXT_PUBLIC_SUPABASE_URL`: present
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: present
- `PILOT_REGISTRATION_MODE`: present
- `PILOT_INVITED_EMAILS`: present
- `PILOT_ACCESS_CODE` or `PILOT_ACCESS_CODES`: present

## Daniel Registration Verification

Read-only Prisma checks only. No raw internal IDs were printed.

- Daniel user exists: yes
- Duplicate Daniel users: no
- Daniel email: `agiledatawise@gmail.com`
- Full name matches `Daniel Negash Kebede`: yes
- Auth provider: `supabase`
- Supabase auth provider id present: yes
- Active/enabled status: yes
- `PARTICIPANT` role assigned: yes
- `PARTICIPANT` role exists: yes
- Organization `HCDA` exists: yes
- Daniel linked to `HCDA`: yes
- Job title matches `Program Manager`: yes
- Region matches `Addis Ababa`: yes

## Count Summary

Counts only.

| Model / table | Count |
| --- | ---: |
| `User` | 2 |
| `Role` | 2 |
| `UserRoleAssignment` | 2 |
| `Organization` | 1 |
| `Course` | 1 |
| `CourseVersion` | 1 |
| `Enrollment` | 1 |
| `ExternalCourseLaunchToken` | 1 |
| `LessonProgress` | 1 |
| `QuizAttempt` | 0 |
| `Certificate` | 0 |

Expected baseline after S8B-11 was one system placeholder plus HRBA metadata. Daniel registration added the learner, `PARTICIPANT` role, role assignment, and `HCDA` organization as expected.

Observed activity:

- Enrollment exists: yes, count `1`
- External launch token exists: yes, count `1`
- Lesson progress exists: yes, count `1`
- Quiz attempt exists: no
- Certificate exists: no

This slice did not create, update, or delete any of those records. The observed enrollment, launch token, and lesson progress indicate learner course activity already exists and should be inspected before inviting the next learner.

## Mulu Absence

- `essetlab@gmail.com` user exists: no
- `ANGAFA` organization exists: no

## Public Route Smoke

GET requests only. No forms were submitted.

| Route | HTTP status | Server error marker |
| --- | ---: | --- |
| `/` | 200 | no |
| `/courses` | 200 | no |
| `/sign-in` | 200 | no |

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

## Recommended Next Action

Proceed to a controlled Daniel course-launch/activity inspection before Mulu registration, because the database already contains one enrollment, one launch token, and one lesson progress record. If that activity is confirmed as expected owner/Daniel testing, then proceed to Mulu registration in a separately approved slice.

## Safety Confirmations

- No migrations were run.
- No seed scripts were run.
- `db:setup:production` was not run.
- `register:hrba-external-course` was not run.
- No users were created or updated by Codex.
- No additional accounts were created by Codex.
- Mulu was not invited.
- Mulu's account was not created.
- HRBA course was not launched by Codex.
- No launch tokens were intentionally created by Codex.
- No enrollments were intentionally created by Codex.
- No certificates were created.
- HRBA deployment, launchToken, callback, and certificate logic were not changed.
- No committed `.env` files were modified.
- The private environment file was not copied into the repository.
- No secret values, full connection strings, or passwords were printed or committed.
