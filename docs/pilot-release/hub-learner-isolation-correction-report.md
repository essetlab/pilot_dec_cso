# Hub learner-isolation correction evidence

## Scope

This checkpoint corrects the Hub side of the shared-browser HRBA
learner-isolation defect. It does not modify the HRBA repository, Production,
live users, or unrelated Hub hardening.

Baseline:

- repository: `essetlab/pilot_dec_cso`
- branch: `feature/pilot-registration-integration-checkpoint`
- source commit: `875c26e90c4a7d50aee0d6cac57c6787d6ef622e`

## Root cause

The Hub already validated the authenticated session, short-lived launch token,
course, enrollment, version, iframe origin, and Hub origin. It did not provide
or validate a stable learner-specific browser-state namespace. It also treated
a valid current launch token as sufficient authority for an assessment result
restored by the child application.

Consequently, stale unscoped HRBA browser state could be emitted after another
learner signed in. The current learner's valid launch token authorized the
callback even though the assessment evidence originated in the previous
learner's browser session.

## Correction

- A server-generated 256-bit opaque learner-state key is stored on each
  enrollment and remains stable for that enrollment.
- Every short-lived launch token stores the SHA-256 binding of that state key.
- The stable key is delivered to the active iframe only by an exact-origin
  `postMessage` handshake; it is not placed in the iframe URL.
- Progress-bearing messages must return the same key.
- The Hub validates the key against both the token binding and the enrollment.
- Callback and assessment evidence must not predate the server-created
  enrollment/state context and must not be unreasonably future-dated.
- Assessment-required completion fails closed without valid assessment
  evidence.
- Each external assessment carries a globally unique opaque evidence ID.
  Cross-context reuse and mutated replay are rejected; an identical
  same-context retry is idempotent.
- Each external attempt stores the SHA-256 learner-state-key hash as its
  opaque enrollment-state binding.
- Attempt, enrollment, lesson, and certificate writes share one transaction;
  expected uniqueness races are retried against the stored immutable context.
- Existing certificate uniqueness remains in force, so a completion replay
  cannot create a second certificate.

The exact child-application contract and legacy-state migration behavior are
defined in `docs/pilot-release/hrba-learner-state-isolation-contract.md`.

## Database implications

One additive migration is required before this code can serve external-course
launches:

- `Enrollment.externalLearnerStateKey` (unique, nullable for migration)
- `Enrollment.externalStateKeyIssuedAt`
- `ExternalCourseLaunchToken.learnerStateKeyHash`
- `QuizAttempt.externalEvidenceId` (unique, nullable for historical attempts)
- `QuizAttempt.externalLearnerStateKeyHash` (nullable for historical attempts)

No data backfill or seed is required. Existing unbound launch tokens fail
closed and learners obtain a newly bound token on their next launch. Replacing
an enrollment creates a new learner-state key. Historical attempts without an
attempt-level state-key hash remain valid records but cannot authorize new
external evidence reuse.

## Deterministic verification coverage

`scripts/verify-external-course-learner-isolation.ts` covers:

- different state keys for two learners in one organization;
- a stable state key across repeated launches of one enrollment;
- a different key after enrollment replacement;
- token-to-state-key hash binding;
- no learner-state key or raw Hub identifiers in the iframe URL;
- no raw Hub identifiers in the callback contract;
- same-learner refresh/resume;
- mismatched token/state-key rejection;
- cross-learner evidence rejection;
- immediate replacement-enrollment evidence rejection;
- exact attempt-to-enrollment-state-hash binding;
- altered immutable evidence rejection;
- pre-context and future evidence rejection;
- idempotent same-context completion replay;
- concurrent identical callback idempotency;
- transaction rollback on a certificate-context conflict;
- legacy unbound launch-token rejection;
- one attempt and one certificate after replay.

The existing HRBA and S7 integration verifiers were updated to exercise the
new contract and fail-closed assessment requirement.

## Validation

The following source-level checks passed before commit:

- `npm run prisma:generate`
- `npm run typecheck`
- `npm run lint`
- `npx prisma validate`
- `npm run prisma:validate`
- `npm run build`
- `git diff --check`

The production build emitted the existing fallback-course-data warning and
completed successfully.

Database-backed validation used a disposable local PostgreSQL 16 container.
No repository, staging, or Production environment file was loaded.

- all nine repository migrations applied cleanly with `prisma migrate deploy`;
- `prisma migrate status` reported the database current;
- `verify:external-course-learner-isolation` passed all isolation, freshness,
  replacement, concurrency, atomicity, privacy, and legacy-token assertions;
- `verify:s7-hrba-supabase-compat` passed against the disposable database;
- `verify:hrba-external-course` passed after its documented demo fixture was
  created only inside the disposable database;
- the isolation verifier removed every synthetic isolation user,
  organization, and rollback fixture certificate.

The disposable database was not staging and its container was removed after
validation.

## Release boundary and follow-up

The Hub and HRBA changes must be released together. Until HRBA implements the
documented state-key handshake, scoped storage, evidence ID, and callback
fields, HRBA progress-bearing messages will fail closed.

The coordinated deployment and rollback order is defined in the contract.
Production authorization remains blocked pending:

1. applying the migration in an approved non-production database;
2. implementing the documented contract in the HRBA repository;
3. running the isolation verifier and the real two-learner shared-browser
   acceptance against matched Hub and HRBA Previews.
