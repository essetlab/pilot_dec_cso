# S7 HRBA Supabase Compatibility Report

## Summary

S7 verifies and hardens the HRBA external course launch and callback workflow after Supabase Auth session support. The Hub integration now uses the authenticated Hub `session.userId` as the primary current-user join for HRBA launch and progress callbacks.

The HRBA iframe launch contract remains unchanged:

- `embed=portal`
- `portalOrigin`
- `courseSlug`
- `launchToken`

The HRBA app deployment and code were not changed.

## Files Changed

- `package.json`
- `src/lib/external-course-workflow.ts`
- `scripts/verify-s7-hrba-supabase-compat.ts`
- `docs/pilot-release/s7-hrba-supabase-compatibility-report.md`

## Session Join Hardening

Removed the remaining HRBA current-user joins by `session.email` in:

- `getExternalCourseLaunchData()`
- `recordExternalCourseProgress()`

Both now load the authenticated Hub user by:

```ts
where: { id: session.userId }
```

Email remains available only through the loaded Hub user record for display/snapshot behavior, such as certificate participant name fallback.

## Supabase-Linked User Compatibility

The S7 verifier creates a temporary Supabase-linked Hub learner with:

- `authProvider = "supabase"`
- `authProviderId = <temporary opaque fixture id>`

It then passes a deliberately stale session email while keeping the correct `session.userId`. HRBA launch and callback succeed, proving the workflow uses Hub `User.id`, not email, as the security join.

Local fallback learners still launch through the same Hub `User.id` path.

## Iframe URL

Confirmed the iframe URL includes:

- `embed=portal`
- `portalOrigin`
- `courseSlug`
- `launchToken`

Confirmed the iframe URL excludes:

- `userId`
- `learnerId`
- `enrollmentId`
- `courseVersionId`
- certificate id
- assessment answers

The launch token stored in the database remains hashed; the raw token is only used in the iframe URL as the opaque bearer value.

## Launch Token Validation

Launch token behavior remains:

- token hash stored in `ExternalCourseLaunchToken`;
- raw token never stored;
- token expiry stored and checked;
- token tied to Hub `userId`;
- token tied to course, course version, enrollment, course slug, allowed origin, and portal origin.

## Callback Compatibility

The callback contract remains unchanged:

- message type stays `cso-learning-hub:external-course-progress`;
- the HRBA app continues to post progress to the Hub callback through the existing portal integration;
- Hub validates active current session through `getCurrentSession()`;
- Hub validates launch token hash and expiry;
- Hub validates token ownership against `session.userId`;
- Hub validates course slug;
- Hub validates iframe origin / allowed origin;
- Hub validates enrollment belongs to the same user/course/version;
- Hub rejects invalid token, token/session mismatch, invalid origin, invalid launch context, and malformed assessment;
- Hub records progress and final assessment attempts;
- Hub issues certificates only after completion plus passing assessment.

Certificate issuance remains entirely in the Hub.

## Verification

Added:

```powershell
npm run verify:s7-hrba-supabase-compat
```

The verifier does not require real Supabase credentials. It verifies:

- Supabase-linked Hub learner can launch HRBA using `session.userId`;
- local fallback learner can still launch HRBA;
- iframe URL includes `launchToken`;
- iframe URL excludes raw IDs and assessment values;
- launch token record is tied to Hub `User.id`;
- stored launch token is hashed;
- callback accepts valid token/session match;
- callback rejects token/session mismatch;
- callback rejects invalid token;
- callback rejects invalid origin;
- failed final assessment records a failed attempt without issuing a certificate;
- passing final assessment records a passed attempt and issues a Hub certificate.

Required checks for S7:

```powershell
npm run verify:s7-hrba-supabase-compat
npm run verify:hrba-external-course
npm run verify:s6-route-roles
npm run verify:s5-signin
npm run verify:s4-registration
npm run verify:r17
npx prisma validate
npm run prisma:validate
npm run lint
npm run build
git diff --check
git status --short
```

## Scope Confirmation

- No HRBA deployment change was made.
- No HRBA app code was changed.
- The public HRBA URL remains `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
- No Prisma schema changes were made.
- No migrations were created or run.
- No Supabase production migration commands were run.
- No HRBA `launchToken` contract changes were made.
- No callback message type change was made.
- No certificate logic was moved into the HRBA app.
- Daniel and Mulu were not invited.
- No real learner/admin accounts were created.
- No Supabase `service_role` key was used in browser/client code.
- No donor, community, Build Studio expansion, practical proof, or future-stage features were added.

## Next Slice Recommendation

S8 should focus on Vercel deployment and Supabase migration readiness, including production environment verification and a migration runbook.
