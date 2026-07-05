# S4 Supabase Registration Migration Report

Date: 2026-07-06

## Slice

S4: Supabase Auth learner registration migration.

Purpose: update pilot learner registration so future pilot learners can be created through Supabase Auth and linked to the existing Hub `User` profile model, while preserving local fallback registration and leaving sign-in/sign-out unchanged.

## Files Changed

- `src/lib/pilot-registration-workflow.ts`
- `src/app/(auth)/register/actions.ts`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/sign-in/page.tsx`
- `src/lib/supabase/config.ts`
- `scripts/verify-s4-supabase-registration.ts`
- `package.json`

## Supabase Registration Mode Detection

Supabase registration mode is enabled only when `readSupabasePublicConfig()` returns valid public config from:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The config helper now ignores missing values, bracketed template placeholders, and invalid URL values. When public Supabase config is absent, learner registration remains on the local fallback path.

No Supabase service role key is read or used.

## Local Fallback Preserved

If Supabase public config is not present:

- the existing local Hub `User` creation path remains available;
- local `passwordHash` is still created with the existing password hashing helper;
- `authProvider` is set to `local`;
- `authProviderId` remains `null`;
- existing local/demo sign-in remains compatible.

## Existing Pilot Rules Preserved

The existing validation order is preserved before any Supabase sign-up call:

- required fields;
- password and confirmation match;
- password policy;
- consent / terms acceptance;
- pilot access code;
- strict invited-email validation;
- duplicate Hub email check.

Invalid access codes and uninvited strict-mode emails return before any Hub account creation or Supabase sign-up attempt.

## Hub User Linking

When Supabase registration mode is enabled:

- the workflow calls Supabase Auth `signUp` with email/password using the public publishable key;
- the returned Supabase Auth user id is stored in `User.authProviderId`;
- `User.authProvider` is set to `supabase`;
- `User.passwordHash` is left `null`;
- organization upsert/linking remains in the Hub database;
- the `PARTICIPANT` role assignment remains in the Hub database;
- `User.status` remains `ACTIVE` for this slice.

The existing `email @unique` constraint still prevents duplicate human accounts.

## Duplicate And Failure Handling

- If a Hub `User` already exists with the same email, registration returns `duplicate-email`.
- If Supabase sign-up reports a duplicate/existing account, registration returns `supabase-account-exists`.
- Other Supabase sign-up failures return `supabase-registration-failed`.
- If Supabase sign-up succeeds but Hub profile creation fails, registration returns `profile-link-failed` and logs server-side detail without exposing tokens, service keys, or raw internal ids in the learner-facing message.

## Sign-In/Sign-Out Status

Sign-in and sign-out were not migrated in S4.

Existing local password sign-in continues to use the current Hub password/session flow. Supabase-created learners are shown a temporary success notice that Supabase sign-in support is being completed in the next implementation slice.

## Verification Added

Added `npm run verify:s4-registration`, which does not require real Supabase credentials and verifies:

- local fallback registration still works without Supabase env vars;
- local fallback users have `authProvider="local"`, `authProviderId=null`, and a local `passwordHash`;
- invalid access-code validation prevents user creation;
- strict invited-email validation prevents user creation;
- Supabase-linked Hub user data would use `authProvider="supabase"`, preserve the Supabase auth id in `authProviderId`, and keep `passwordHash=null`.

## Checks

- `npm run verify:s4-registration`: passed.
- `npx prisma validate`: passed.
- `npm run prisma:validate`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run verify:hrba-external-course`: passed.
- `npm run verify:r17`: passed.
- `git diff --check`: passed.
- `git status --short`: reviewed before staging.

## Scope Confirmation

- No Prisma schema changes were made.
- No migrations were created or run.
- No Supabase production migration was run.
- No real `.env` files were modified.
- Sign-in/sign-out behavior was not replaced.
- Route protection was not replaced.
- Current `cso_lh_session` behavior was not changed.
- HRBA deployment was not changed.
- HRBA `launchToken` contract was not changed.
- HRBA callback logic was not changed.
- Certificate logic was not changed.
- No learner/admin accounts were manually created.
- Daniel and Mulu were not invited.
- No Supabase service role key was used or exposed in browser/client code.

## Next Slice Recommendation

S5: sign-in/sign-out migration.
