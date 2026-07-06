# S8B-13 Daniel Course Activity Inspection Report

## Summary

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Deployed Hub URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Expected HRBA slug: `applying-human-rights-based-approach-in-cso-practice`
- Task scope: read-only inspection of Daniel course activity artifacts
- Decision: **Activity records are safe expected launch artifacts**

## Environment Presence

The private environment file was loaded into local command processes without printing values.

- `DATABASE_URL`: present
- `NEXT_PUBLIC_APP_URL`: present
- `NEXT_PUBLIC_SUPABASE_URL`: present
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: present
- `HRBA_EXTERNAL_COURSE_URL`: present
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`: present

## Code-Path Inspection Summary

Inspected areas:

- `src/lib/pilot-registration-workflow.ts`
- `src/app/(auth)/sign-in/actions.ts`
- `src/app/(learn)/learn/[[...segments]]/page.tsx`
- `src/lib/course-data.ts`
- `src/lib/external-course-workflow.ts`
- `src/app/api/external-course-progress/route.ts`

Findings:

- Registration creates learner profile, organization, role, and role assignment only: yes
- Registration creates enrollment: no
- Registration creates launch token: no
- Registration creates lesson progress: no
- Sign-in creates enrollment: no
- Sign-in creates launch token: no
- Sign-in creates lesson progress: no
- Authenticated learner course overview can create enrollment and lesson progress: yes, `getLearnerCourseBySlug()` initializes enrollment by default
- HRBA external launch route creates enrollment: yes
- HRBA external launch route creates lesson progress: yes
- HRBA external launch route creates launch token: yes
- HRBA progress callback can create quiz attempts/certificates: yes, but no callback activity was observed

Likely reason the records exist:

- Daniel or the owner reached an authenticated HRBA course launch path after registration/sign-in.
- The evidence most strongly matches `getExternalCourseLaunchData()` because the lesson progress source is `external-course-launch` and a launch token exists.

## Daniel Activity Inspection

Read-only queries only. No raw internal IDs, raw token values, token hash values, or passwords were printed.

Daniel profile:

- Daniel user exists: yes
- `PARTICIPANT` role: yes
- Organization `HCDA`: yes

Enrollment:

- Enrollment exists: yes
- Enrollment belongs to Daniel: yes
- Enrollment belongs to HRBA course/version: yes
- Status: `IN_PROGRESS`
- Progress percent: `0`
- Enrolled at: `2026-07-06T01:32:41.706Z`
- Started at: `2026-07-06T01:32:41.695Z`
- Last accessed at: `null`
- Completed at: `null`
- Created at: `2026-07-06T01:32:41.706Z`
- Updated at: `2026-07-06T01:32:41.706Z`

Lesson progress:

- Lesson progress count: `1`
- Belongs to Daniel enrollment: yes
- Belongs to HRBA lesson: yes
- Status: `IN_PROGRESS`
- Progress JSON source: `external-course-launch`
- Started at: `2026-07-06T01:32:41.802Z`
- Last accessed at: `null`
- Completed at: `null`
- Created at: `2026-07-06T01:32:41.804Z`
- Updated at: `2026-07-06T01:32:41.804Z`

External launch token:

- Token exists: yes
- Belongs to Daniel: yes
- Belongs to Daniel enrollment: yes
- Belongs to HRBA course/version: yes
- Stored as hash, not raw token: yes
- Raw token printed: no
- Token hash printed: no
- Expiry present: yes
- Expired at inspection time: no
- Allowed origin matches HRBA deployment origin: yes
- Portal origin matches Hub URL: yes
- Last used at: `null`
- Created at: `2026-07-06T01:32:41.963Z`
- Expires at: `2026-07-06T09:32:41.879Z`

Assessment/certificate state:

- Daniel quiz attempt count: `0`
- Daniel certificate count: `0`

## Safety Classification

The enrollment, lesson progress, and launch token are safe expected launch artifacts, not unexpected registration/sign-in side effects.

Reason:

- Registration and sign-in code paths do not create course activity.
- The observed lesson progress source is `external-course-launch`.
- The launch token is stored as a hash, is scoped to Daniel/HRBA, has the expected origins, and was not used.
- No quiz attempt or certificate exists.

## Mulu Absence

- `essetlab@gmail.com` user exists: no
- `ANGAFA` organization exists: no
- Any Mulu enrollment/progress/token activity observed: no

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

Proceed to controlled Daniel HRBA iframe/manual launch-resume test.

Do not clean up Daniel activity unless explicitly approved. The records are consistent with expected launch behavior and may be useful for confirming resume behavior.

After Daniel launch-resume is verified, proceed to Mulu registration in a separately approved slice.

## Safety Confirmations

- No migrations were run.
- No seed scripts were run.
- `db:setup:production` was not run.
- `register:hrba-external-course` was not run.
- No users were created, updated, or deleted by Codex.
- No enrollments were created, updated, or deleted by Codex.
- No launch tokens were created, updated, or deleted by Codex.
- No lesson progress records were created, updated, or deleted by Codex.
- Mulu was not invited or registered.
- HRBA course was not launched by Codex.
- HRBA progress callback was not called by Codex.
- No quiz attempts were created.
- No certificates were created.
- HRBA deployment, launchToken, callback, and certificate logic were not changed.
- No committed `.env` files were modified.
- The private environment file was not copied into the repository.
- No secret values, full connection strings, raw tokens, token hashes, raw internal IDs, or passwords were printed or committed.
