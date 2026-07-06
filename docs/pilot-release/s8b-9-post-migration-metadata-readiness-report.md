# S8B-9 Post-Migration Metadata Readiness Report

## Summary

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Private environment file checked: `D:\CSO_Learning_Hub_Secrets\s8b-real-pilot.env`
- Task scope: read-only post-migration metadata readiness inspection
- Decision: **Run HRBA external course registration only after explicit approval**

## Environment Presence

The private environment file was loaded into local command processes without printing values.

- `DATABASE_URL`: present
- `SESSION_POOLER_URL`: present
- `NEXT_PUBLIC_APP_URL`: present
- `NEXT_PUBLIC_SUPABASE_URL`: present
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: present
- `HRBA_EXTERNAL_COURSE_URL`: present
- `HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS`: present
- `PILOT_REGISTRATION_MODE`: present
- `PILOT_INVITED_EMAILS`: present
- `PILOT_ACCESS_CODE` or `PILOT_ACCESS_CODES`: present

## Migration Status

Command run with process-local `DATABASE_URL=SESSION_POOLER_URL`:

```powershell
npx prisma migrate status
```

Result:

- Schema up to date: yes
- Pending migrations: none

Prisma reported: `Database schema is up to date!`

## Available Seed, Register, and Verification Scripts

Scripts inspected but not run:

- Seed / broad setup:
  - `db:seed`
  - `db:setup:production`
- HRBA registration / import:
  - `register:hrba-external-course`
  - `import:hrba-advocacy-course`
- HRBA verification:
  - `verify:hrba-external-course`
  - `verify:hrba-course-import`
  - `verify:s7-hrba-supabase-compat`
- Pilot / Supabase verification:
  - `verify:s4-registration`
  - `verify:s5-signin`
  - `verify:s6-route-roles`
  - `verify:s8-env-readiness`
- Certificate-related verification paths visible in code:
  - `verify:hrba-external-course`
  - `verify:hrba-course-import`
  - certificate public route and PDF workflows under `src/lib/certificate-*`

No mutating seed, registration, HRBA, setup, or verification script was run.

## Read-Only Table Counts

Counts only. No raw IDs or personal data were printed.

| Model / table | Count |
| --- | ---: |
| `User` | 0 |
| `Organization` | 0 |
| `Role` | 0 |
| `UserRoleAssignment` | 0 |
| `Course` | 0 |
| `CourseVersion` | 0 |
| `Enrollment` | 0 |
| `Certificate` | 0 |
| `CertificateTemplate` | 0 |
| `ExternalCourseLaunchToken` | 0 |
| `Feedback` | 0 |
| `CapacityArea` | 0 |
| `CSOPractice` | 0 |
| `StandardFamily` | 0 |
| `Indicator` | 0 |
| `ReferenceDataItem` | 0 |
| `Module` | 0 |
| `Lesson` | 0 |
| `Quiz` | 0 |
| `QuizQuestion` | 0 |
| `LessonProgress` | 0 |
| `QuizAttempt` | 0 |

The migrated database is structurally ready but metadata-empty.

## HRBA Metadata Readiness

Read-only searches were run for:

- `applying-human-rights-based-approach-in-cso-practice`
- `human-rights-based-advocacy-in-practice-for-local-csos`
- `Applying the Human Rights-Based Approach in CSO Practice`

Results:

- HRBA course metadata present: no
- Published HRBA course present: no
- HRBA course version/module/lesson/quiz metadata present: no, based on zero counts
- External course URL configured in environment: yes
- HRBA URL matches `https://pilot-hrba-e-learn-v1-wajj.vercel.app`: yes

The app code has a targeted `register:hrba-external-course` path that creates the HRBA external course metadata, including course, course version, module, lesson, launch content block, learning outcomes, final quiz, and quiz question. Because the database currently has no admin role/user, that helper would also create an `integration-admin@example.local` placeholder user and a `SUPER_ADMIN` role if run as-is.

## Registration Readiness

- `PARTICIPANT` role present: no
- Role creation handled automatically during learner registration: yes, `registerPilotLearner` upserts the `PARTICIPANT` role inside the profile creation transaction
- Organization creation/upsert can work without pre-existing organizations: yes, registration upserts `Organization` by submitted organization name
- Strict invited emails are loaded from environment: yes, `PILOT_REGISTRATION_MODE` and `PILOT_INVITED_EMAILS` are env-driven; onboarding invitations are an additional DB allowance path
- Missing seed data blocks Daniel/Mulu registration: no for role and organization creation, assuming env invited emails and pilot access code are correct and Supabase sign-up succeeds
- Missing HRBA metadata would block meaningful course launch/enrollment/certificate journey after registration: yes

## Certificate Readiness

- Certificate DB records present: no
- `CertificateTemplate` records present: no
- DB certificate template required for certificate issuance: no code path found requiring a `CertificateTemplate` record before issuing certificates
- Static PDF certificate template present: yes, `public/certificate-templates/hrba-certificate-template.pdf`
- HRBA final assessment certificate issuance requires HRBA course/version/quiz metadata: yes
- Public certificate verification depends on issued `Certificate` records: yes
- Public certificate verification requires pre-seeded certificate records: no, but it will show no valid certificate until a real certificate is issued

Certificate readiness: partially ready. Static certificate generation assets are present, but HRBA metadata and real learner completion records are required before certificates can be issued.

## Public Route Smoke

GET requests only; no account creation or form submission.

| Route | HTTP status | Server error marker |
| --- | ---: | --- |
| `/` | 200 | no |
| `/courses` | 200 | no |
| `/register` | 200 | no |
| `/sign-in` | 200 | no |
| `/verify-certificate` | 200 | no |

## Missing Metadata

- HRBA external course metadata
- Course version, module, lesson, content block, learning outcomes, final quiz, and quiz question for HRBA launch/completion
- `PARTICIPANT` role, although learner registration can create it automatically
- Admin/operator user and role metadata, if an admin login is needed before learner verification
- Reference taxonomy/capacity metadata, except the HRBA registration helper can create the HRBA capacity area it needs

## Recommended Next Action

Run **HRBA external course registration only** as the next approved mutating slice, or create a new minimal real-pilot metadata script if the owner does not want the existing HRBA registration helper to create the `integration-admin@example.local` placeholder admin.

Do not run `db:seed` or `db:setup:production` for the real pilot database unless explicitly approved, because those are broad demo/setup paths.

After HRBA metadata exists, proceed to controlled app verification before any Daniel/Mulu invitations or learner account creation.

## Safety Confirmations

- No migration command that applies changes was run.
- `prisma migrate deploy` was not run.
- `prisma migrate dev` was not run.
- `prisma db push` was not run.
- No seed scripts were run.
- `db:setup:production` was not run.
- `register:hrba-external-course` was not run.
- No database mutation was attempted.
- No deployment was attempted.
- No learner or admin accounts were created.
- Daniel and Mulu were not invited.
- HRBA deployment, callback, launchToken, and certificate logic were not changed.
- No committed `.env` files were modified.
- The private environment file was not copied into the repository.
- No secret values or full connection strings were printed or committed.
