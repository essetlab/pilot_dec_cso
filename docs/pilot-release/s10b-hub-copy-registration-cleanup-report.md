# S10B Hub Copy And Registration Cleanup Report

Date: 2026-07-07

Branch: `feature/supabase-auth-vercel-real-pilot`

## Files Changed

- `src/components/public/LandingPage.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/register/actions.ts`
- `src/lib/pilot-registration-workflow.ts`
- `src/components/public/CertificateVerificationPage.tsx`
- `docs/pilot-release/s10b-hub-copy-registration-cleanup-report.md`

## Exact Wording Changes Completed

Landing/home page:
- Changed `Structured journeys` to `Structured learning`.
- Changed `Interactive blocks` to `Interactive learning`.
- Changed `Official certificates` to `Certificates`.
- Changed `Low-stakes checks before final tests.` to `Checks before final tests.`
- Removed learner-facing `pilot` wording from the landing page copy:
  - `after the pilot learning journey is stable` to `after the learning journey is stable`.
  - `current pilot learning journey` to `current learning journey`.
  - `The current pilot focuses on learning` to `The current release focuses on learning`.
  - `The pilot does not open public resource uploads or public proof galleries` to `This release does not open public resource uploads or public proof galleries`.
  - `not active in this pilot` to `not active in this release`.
  - `Current pilot focus` to `Current focus`.

Registration page:
- Changed `Create your learner account` to `Create your account`.
- Changed `Register with the email address invited for the pilot. Your account lets you access courses, save progress, and receive certificates for eligible courses.` to `Register with the email address invited. Your account lets you access courses, save progress, and receive certificates for eligible courses.`
- Removed the warning beginning `Please do not enter sensitive case details...` from the registration form.
- Removed the visible `Learner type` selector from the registration form.
- Changed strict registration mode label from `Strict invited-email mode` to `Invited-email mode`.
- Updated the preparation step `Use the email address invited for the pilot.` to `Use the email address invited.`

Certificate verification page:
- Removed the learner-facing `Public information only` block and its three explanatory paragraphs from the public certificate verification page.
- Preserved the certificate lookup form and verified/not-found/result rendering.

## Learner Type Confirmation

- Learner type has been removed from the registration UI.
- The registration server action now supplies the safe internal default `participant` when calling the registration workflow.
- The workflow still maps `participant` to the Participant / CSO learner account path and role assignment.

## Scope Control Confirmation

- No authentication sign-in, sign-out, session, Supabase provider, or route-guard logic was changed.
- No certificate generation or certificate issuance logic was changed.
- No HRBA course integration code was changed.
- No database schema files were changed.
- No migrations or seed commands were run.

## Checks Run

- `npm run build` - PASS.
- `npm run lint` - PASS.
- `npx prisma validate` - PASS.
- `npm run prisma:validate` - PASS.
- `git diff --check` - PASS.

## Remaining Warnings

- `npm run build` printed an existing data fallback note during static page generation: `getPublicCourseSummaries: using fallback course data. PrismaClientKnownRequestError (ECONNREFUSED).` The build completed successfully.
- `git diff --check` printed Git line-ending normalization warnings that touched files will be converted from LF to CRLF when Git touches them. No whitespace errors were reported.
