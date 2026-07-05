# S2 Supabase Client Setup Report

Date: 2026-07-06

## Slice

S2: Supabase dependency and client setup.

Purpose: add Supabase Auth dependencies and dormant Supabase client/server utilities for the real pilot implementation without replacing the current Hub auth/session behavior.

## Packages Installed

- `@supabase/supabase-js`
- `@supabase/ssr`

## Utility Files Added

- `src/lib/supabase/config.ts`
  - Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
  - Exposes safe public config helpers.
  - Does not read or expose the Supabase service role key.
  - Does not throw at module import time.

- `src/lib/supabase/client.ts`
  - Creates a browser Supabase client with `@supabase/supabase-js`.
  - Uses only public/publishable Supabase values.
  - Includes an explicit note that the service role key must not be imported or passed into browser code.

- `src/lib/supabase/server.ts`
  - Creates a server Supabase client with `@supabase/ssr` and Next cookies.
  - Uses only public/publishable Supabase values.
  - Does not replace `getCurrentSession()` or current `cso_lh_session` behavior.

- `src/lib/supabase/middleware.ts`
  - Prepares a future helper for Supabase auth cookie refresh in middleware.
  - No root `middleware.ts` was added in this slice, so route behavior is unchanged.

## Behavior Confirmation

- Current Hub registration behavior was not replaced.
- Current Hub sign-in/sign-out behavior was not replaced.
- Current Hub session cookie behavior was not changed.
- Existing pages, routes, and actions continue to use the current Hub auth/session utilities.
- The Supabase service role key is not used in browser/client code.
- No Prisma schema changes were made.
- No migrations were created or run.
- No HRBA deployment changes were made.
- No HRBA `launchToken` contract changes were made.
- No certificate logic changes were made.
- No HRBA callback logic changes were made.
- No learner/admin accounts were created.
- Daniel and Mulu were not invited.

## Checks

- `npm run lint`: passed.
- `npm run build`: passed. Build completed with the existing local database fallback warning, `getPublicCourseSummaries: using fallback course data. PrismaClientKnownRequestError (ECONNREFUSED)`.
- `git diff --check`: passed.
- `git status --short`: reviewed before staging.

## Next Slice Recommendation

S3: database schema/profile linking.

Recommended focus:

- Decide whether to reuse `User.authProviderId` or add a clearer `supabaseAuthUserId`.
- Add a unique auth-user-id link for Supabase Auth.
- Plan migration/backfill for existing Hub users before any auth behavior is switched.
