# MVP Slice 2.8 HRBA Final Assessment Callback E2E Report

Date: 2026-06-29

## Summary

This report records Hub-side evidence for the HRBA App Slice 3 final assessment callback integration. No Hub code changes were made.

The HRBA app now sends final assessment result evidence through the existing `postMessage` pathway in Hub portal mode. The Hub remains responsible for API persistence, certificate eligibility, certificate issuance, and public certificate verification.

## Hub contract reference

The Hub accepts the existing external-course progress message plus optional assessment evidence:

```ts
assessment?: {
  score?: number;
  maxScore?: number;
  percentage?: number;
  passed?: boolean;
  attemptNumber?: number;
  submittedAt?: string;
}
```

The Hub issues certificates only when the external progress message is authenticated, origin/context validated, `completed` is true, and the assessment is valid and passing at or above the configured pass threshold.

## Local service status

- Docker PostgreSQL container `cso-learning-hub-postgres`: running.
- Hub dev server: listening on `http://localhost:3000`.
- HRBA Vite dev server: listening on `http://localhost:5173`.

## Browser smoke evidence

Opened:

```text
http://localhost:3000/learn/courses/applying-human-rights-based-approach-in-cso-practice/external
```

Observed:

- Authenticated Hub learner shell loaded.
- External-course page loaded.
- HRBA app rendered inside the Hub iframe.
- Portal progress panel displayed.

Full manual final-assessment browser E2E was not completed because the embedded HRBA app requires normal completion of five long modules before the final assessment unlocks. No `.env` values or browser storage were changed to bypass the learner pathway.

## Scripted contract verification

Command:

```powershell
npm run verify:hrba-external-course
```

Result: passed.

Key output:

```json
{
  "failedAttemptRecorded": true,
  "passedAttemptRecorded": true,
  "progressPercent": 100,
  "status": "COMPLETED"
}
```

The verifier also returned a certificate code for the passing scenario, confirming that Hub certificate issuance works when the external assessment payload is passing.

## Additional Hub checks

Commands run:

```powershell
npm run lint
npm run build
npm run prisma:validate
```

Results:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run prisma:validate`: passed.

## Important retake note

The Hub parent frame currently suppresses subsequent `completed: true` messages after the first successful completed message in a session. The Hub workflow records failed external assessment attempts only when the incoming message has `completed: true`.

To preserve HRBA retake behavior in the current integration, HRBA failed final assessment messages are sent as `completed: false` with assessment evidence. This prevents certificate issuance and allows a later passing retake to send `completed: true`.

A future Hub slice should support recording failed external assessment attempts without marking the external course complete.

## Final verdict

Hub-side contract verification passed and no Hub code changes were required for HRBA Slice 3. A documentation-only report was added for traceability.
