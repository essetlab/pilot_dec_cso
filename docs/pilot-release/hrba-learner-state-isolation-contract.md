# HRBA learner-state isolation contract

## Status and scope

This is the required Hub-to-HRBA Preview integration contract after the
two-learner shared-browser isolation defect found during authenticated pilot
acceptance.

It separates:

1. a short-lived opaque `launchToken`, used only to authorize Hub callbacks;
2. a stable opaque `learnerStateKey`, used only to select the correct
   learner-course browser state.

Neither value contains a raw Hub user, learner, email, enrollment,
organization, assignment, or course-version identifier. Detailed Canvas and
portfolio content remains outside the integration contract.

## Hub launch behavior

The iframe URL continues to contain:

- `embed=portal`
- `portalOrigin=<exact Hub origin>`
- `courseSlug=<public course slug>`
- `launchToken=<short-lived opaque token>`

The iframe URL must not contain `learnerStateKey` or any raw Hub identifier.
This keeps the stable state context out of request, access, and navigation
logs.

The Hub generates exactly 32 cryptographically random bytes server-side when
an active enrollment first launches the external course. It encodes those
bytes as unpadded base64url. A valid `learnerStateKey` is therefore exactly 43
characters and matches `^[A-Za-z0-9_-]{43}$`. No other length, alphabet,
padding, or encoding is valid. The key:

- is stored on that enrollment;
- remains stable across repeated launches and refreshes of that enrollment;
- differs for every other enrollment, including learners in the same CSO;
- changes when the enrollment is deleted/replaced;
- is never written to application logs;
- is bound by SHA-256 hash to every short-lived launch-token record.

Pre-migration launch tokens have no state-key binding and fail closed.

## Exact-origin launch-context handshake

After HRBA emits `course_ready`, the Hub sends this message only to the
configured HRBA origin and only to the active iframe window:

```json
{
  "type": "cso-learning-hub:external-course-launch-context",
  "version": 1,
  "courseSlug": "applying-human-rights-based-approach-in-cso-practice",
  "learnerStateKey": "<43-character base64url opaque value>"
}
```

HRBA must accept this message only when:

- `event.origin` exactly equals the configured Hub `portalOrigin`;
- `event.source` is the HRBA parent window;
- `type`, `version`, and `courseSlug` match the expected contract;
- `learnerStateKey` matches `^[A-Za-z0-9_-]{43}$` exactly.

HRBA must never use `"*"` as the target origin for messages to the Hub.
If the context has not arrived, HRBA must repeat `course_ready` at a bounded
interval or after parent navigation readiness. It must not hydrate portal
state or emit a progress-bearing callback while waiting.

## Required HRBA browser-state behavior

HRBA must not read, hydrate, or emit progress from an unscoped legacy storage
record when running in Hub portal mode.

After receiving the validated launch context, HRBA must:

1. derive a browser-storage namespace from a one-way hash of
   `learnerStateKey`;
2. read and write modules, screens, assessment, and completion only within
   that namespace;
3. include the exact current `learnerStateKey` in every progress, module,
   assessment, and completion message;
4. generate one high-entropy `evidenceId` for each submitted assessment and
   retain it for idempotent resend of that same assessment;
5. create a new `evidenceId` for a genuine retake;
6. preserve the original `submittedAt` when resending the same attempt;
7. wait for the launch-context handshake before emitting restored progress.

For migration, existing unscoped browser state must be ignored in portal mode.
Existing Hub enrollment, attempt, and certificate records remain the server
authority.

## Top-level standalone behavior

Top-level standalone HRBA and Hub portal mode are separate operating modes:

- standalone mode receives no Hub `learnerStateKey` or launch-context message;
- standalone storage uses a namespace that is separate from every Hub
  learner-state-key namespace;
- standalone state is never copied, promoted, or used to initialize portal
  state;
- standalone mode cannot emit governed Hub progress, assessment, or completion
  callbacks;
- portal mode ignores all standalone and legacy unscoped state;
- direct standalone activity cannot create Hub progress, attempts,
  completion, or certificates.

## Required callback fields

Every progress-bearing HRBA `postMessage` must include:

```json
{
  "type": "cso-learning-hub:external-course-event",
  "version": 1,
  "courseSlug": "applying-human-rights-based-approach-in-cso-practice",
  "learnerStateKey": "<current opaque state key>",
  "event": "progress_updated",
  "sentAt": "2026-07-23T12:00:00.000Z",
  "progressPercent": 40,
  "completedModuleIds": ["module_01_hrba_foundations"],
  "currentModuleId": "module_02_everyday_cso_work",
  "currentScreenId": "M2-S05"
}
```

Assessment and course-completion messages must also include:

```json
{
  "assessment": {
    "attemptNumber": 1,
    "evidenceId": "<UUID or 20-128 character URL-safe high-entropy value>",
    "score": 10,
    "maxScore": 10,
    "percentage": 100,
    "passed": true,
    "submittedAt": "2026-07-23T12:15:00.000Z"
  }
}
```

`evidenceId` must be either:

- a canonical UUID v4 matching
  `^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`
  case-insensitively; or
- exactly 32 random bytes encoded as 43-character unpadded base64url.

HRBA creates the ID once when an assessment is submitted. It must retain the
same ID and original `submittedAt` for retries, refresh recovery, and
concurrent delivery of that immutable attempt. A genuine retake receives a new
ID and timestamp. HRBA must not regenerate an evidence ID when hydrating or
resending stored state.

The immutable evidence fields are: `evidenceId`, `attemptNumber`, `score`,
`maxScore`, `percentage`, `passed`, original `submittedAt`, sorted completed
module IDs, current module, current screen, course, version, learner-state
context, learner, quiz, and iframe origin. The Hub stores a server-generated
fingerprint of this context. An altered retry is not idempotent and is
rejected.

No callback may contain raw Hub identifiers, email addresses, names,
organization data, detailed Canvas answers, portfolio text, reflection text,
complaint content, or other learner-generated course content.

## Hub validation and failure behavior

The Hub accepts a callback only when all of these remain true:

- the authenticated Hub session is active;
- the launch token exists, is unexpired, and belongs to the session user;
- token course, enrollment, course version, HRBA origin, and Hub origin match;
- the SHA-256 hash of `learnerStateKey` matches the launch-token binding;
- the enrollment stores the same state key;
- callback and assessment timestamps are valid ISO timestamps;
- timestamps are not more than five minutes in the future;
- evidence does not predate the server-created enrollment/state context,
  allowing at most one minute of clock tolerance;
- completion for an assessment-required course includes valid assessment
  evidence;
- `evidenceId` has the required format and is not already bound to another
  user, enrollment state, course, course version, quiz, result, or immutable
  evidence context.

The Hub stores the SHA-256 learner-state-key hash on every new external
assessment attempt. That hash is the opaque enrollment-state binding. An
attempt with a missing legacy binding is never valid evidence for a bound
launch.

Failure behavior:

| Condition | Hub behavior |
|---|---|
| Missing state key | Reject; do not write progress |
| Token/state-key mismatch | Reject; do not write progress |
| Legacy unbound token | Reject; require a new launch |
| Expired launch token | Reject; require a new launch |
| Wrong iframe origin | Reject |
| Callback before state context | Reject as stale evidence |
| Assessment timestamp too far in future | Reject |
| Evidence ID already used by another learner/context | Reject |
| Evidence ID from a replaced enrollment | Reject, even for the same learner/course/version |
| Legacy attempt without a state-key hash | Reject as unbound evidence |
| Same evidence ID with altered immutable fields | Reject |
| Completion without required assessment | Reject |
| Same evidence replayed by the same learner/context | Return the existing attempt/certificate; create no duplicate |
| Concurrent identical callbacks | Resolve to one attempt and one certificate; both callers receive a valid idempotent result |
| New launch for the same enrollment | Accept with the same state key and a new short-lived launch token |
| Missing launch context in portal mode | Do not hydrate state or emit governed callbacks |

Completion persistence is atomic: token use, assessment attempt, enrollment
and lesson state, and certificate creation commit or roll back together.
Expected uniqueness races are retried by loading and validating the existing
immutable attempt/certificate context.

## Coordinated deployment and rollback

Release order:

1. independently review the final additive migration and this contract;
2. apply the migration to an isolated disposable PostgreSQL database;
3. run the database-backed learner-isolation verifier;
4. deploy a Hub Preview that sends the handshake and validates the complete
   contract;
5. deploy an HRBA Preview that consumes the contract;
6. run integrated two-learner same-browser acceptance against those matched
   Previews;
7. request Production authorization only after independent review accepts the
   evidence.

The database migration may precede application deployment because every new
column is nullable and no data is backfilled. The Hub and HRBA application
changes must be released as a coordinated pair; either unmatched application
fails closed for governed progress.

Rollback order:

1. roll back HRBA first if it depends on the new contract;
2. roll back the Hub application;
3. retain the additive columns and indexes throughout application rollback;
4. drop database structures only in a later, separately reviewed cleanup after
   confirming that no active deployment depends on them.

## HRBA implementation checklist

The HRBA repository Codex must:

1. add the launch-context message listener with exact-origin and parent-window
   checks;
2. introduce learner-state-key-scoped storage for all module, screen,
   assessment, and completion state;
3. prevent portal-mode state hydration until the context arrives;
4. ignore legacy unscoped state in portal mode;
5. include `learnerStateKey` in every progress-bearing event;
6. include stable per-attempt `evidenceId` and original `submittedAt`;
7. keep callback payloads summary-only;
8. add same-browser Learner A → sign out → Learner B tests;
9. verify refresh/resume for one learner and idempotent assessment resend;
10. verify missing/mismatched context produces no Hub callback;
11. keep standalone storage and behavior fully separate from portal mode;
12. test concurrent identical callbacks and replaced-enrollment replay.
