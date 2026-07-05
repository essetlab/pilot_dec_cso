# S5 Supabase Sign-In Migration Report

## Summary

S5 migrates password sign-in, session resolution, and sign-out to Supabase Auth when valid Supabase public configuration is present. When Supabase public configuration is absent, placeholder-only, or invalid, the existing local password and `cso_lh_session` behavior remains available.

No Prisma schema, migration, HRBA, launchToken, callback, or certificate behavior was changed.

## Files Changed

- `package.json`
- `src/app/(auth)/sign-in/actions.ts`
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(auth)/sign-out/route.ts`
- `src/lib/auth/hub-session.ts`
- `src/lib/auth/server.ts`
- `src/lib/supabase/server.ts`
- `scripts/verify-s5-supabase-signin.ts`
- `docs/pilot-release/s5-supabase-signin-migration-report.md`

## Supabase Sign-In Behavior

Supabase mode is active only when `readSupabasePublicConfig()` returns valid public configuration from:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

In Supabase mode, password sign-in:

- calls Supabase Auth `signInWithPassword`;
- uses the returned Supabase user id as the primary join to the Hub `User.authProviderId`;
- returns safe learner-facing errors for invalid credentials, email confirmation requirements, missing Hub profile, inactive account, or missing Hub roles;
- does not expose Supabase tokens, raw internal ids, or provider error details in the UI.

If Supabase sign-in succeeds but no valid Hub profile can be resolved, the Supabase session is immediately signed out and the legacy Hub session cookie is cleared.

## Local Fallback Behavior

When Supabase public configuration is absent, placeholder-only, or invalid:

- existing local email/password sign-in remains in place;
- local `passwordHash` verification remains compatible;
- `cso_lh_session` continues to be written and read by the Hub session codec;
- pilot quick learner/demo sign-in remains available only in local fallback mode.

## Session Resolution

`getCurrentSession()` now preserves the existing `AuthSession` shape:

```ts
{
  userId,
  email,
  name,
  roles,
  issuedAt,
}
```

In Supabase mode, it:

- reads the authenticated Supabase user from SSR cookies with the Supabase server client;
- loads the linked Hub user by `authProviderId`;
- loads active role assignments from the Hub database;
- requires `User.status === ACTIVE`;
- requires at least one active Hub role assignment;
- returns `null` if the Supabase user is missing, unlinked, inactive, or has no active role.

In local fallback mode, it continues to parse `cso_lh_session`.

## Hub User Linking

The shared resolver in `src/lib/auth/hub-session.ts` loads by `authProviderId` first.

During Supabase sign-in only, if no Hub user is found by `authProviderId`, it may use normalized email as a deterministic migration fallback when exactly one ACTIVE Hub user exists and no conflicting `authProviderId` is present. That user is then linked with:

- `authProvider = "supabase"`
- `authProviderId = <Supabase user id>`

`getCurrentSession()` does not use email fallback; route guards fail closed unless the Hub user is already linked by `authProviderId`.

## Sign-Out Behavior

In Supabase mode, `/sign-out`:

- calls Supabase Auth `signOut`;
- clears the legacy `cso_lh_session` cookie;
- redirects to `/sign-in`.

In local fallback mode, `/sign-out` keeps the existing behavior of clearing `cso_lh_session` and redirecting to `/sign-in`.

## Middleware Or Proxy

No root `middleware.ts` or `proxy.ts` was added in S5. The current Supabase SSR helper can read/write cookies from server actions and route handlers used in this slice. Route behavior was not changed by middleware.

## Verification

Added:

```powershell
npm run verify:s5-signin
```

The verifier does not require real Supabase credentials. It checks:

- local fallback mode when Supabase environment variables are missing;
- placeholder and invalid Supabase public config are ignored;
- Supabase public config detection works for valid public values;
- AuthSession mapping preserves the existing session shape;
- missing roles and inactive users fail closed;
- sign-in source keeps local password fallback and Supabase Hub-profile resolution;
- unlinked Supabase users are signed out in the sign-in action;
- `getCurrentSession()` joins Supabase sessions by `authProviderId`;
- sign-out clears the legacy session cookie.

Full checks run for S5:

```powershell
npm run verify:s5-signin
npx prisma validate
npm run prisma:validate
npm run lint
npm run build
npm run verify:s4-registration
npm run verify:hrba-external-course
npm run verify:r17
git diff --check
git status --short
```

## Scope Confirmation

- No Prisma schema changes were made.
- No migrations were created or run.
- No Supabase production migration commands were run.
- No HRBA deployment changes were made.
- No HRBA `launchToken` contract changes were made.
- No HRBA callback changes were made.
- No certificate logic changes were made.
- No learner or admin accounts were created.
- Daniel and Mulu were not invited.
- No Supabase `service_role` key was used in browser/client code.
- Role checks were not weakened.

## Next Slice Recommendation

S6 should focus on route protection and roles after Supabase sign-in is verified against the real pilot environment.
