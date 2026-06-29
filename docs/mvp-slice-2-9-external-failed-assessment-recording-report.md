# MVP Slice 2.9 External Failed Assessment Recording Report

## 1. Summary of changes

- Updated the Hub external-course workflow so valid external assessment evidence is processed even when `completed` is `false`.
- Failed external final-assessment attempts now create existing `QuizAttempt` records without completing enrollment and without issuing certificates.
- Kept certificate issuance gated behind authenticated, validated, `completed=true`, passing assessment evidence at or above the configured pass threshold.
- Expanded the HRBA external-course verification script to cover failed `completed=false` attempts, duplicate failed-attempt handling, retake behavior, and one-certificate behavior.

## 2. Files changed

- `src/lib/external-course-workflow.ts`
- `scripts/verify-hrba-external-course.ts`
- `docs/mvp-slice-2-9-external-failed-assessment-recording-report.md`

`next-env.d.ts` changed during `npm run build` from the dev generated route type path to the production generated route type path. This is harmless generated Next.js noise and was reverted because it is not part of Slice 2.9.

## 3. Failed assessment handling

When a validated external-course message includes assessment evidence with `completed=false`, `assessment.passed=false`, and a percentage below the pass threshold, the Hub now:

- validates the session, user, enrollment, course version, course slug, allowed iframe origin, and assessment shape;
- records a failed `QuizAttempt` using the existing external completion quiz;
- stores only operational assessment metadata in `answersJson`;
- updates progress to the submitted bounded percentage;
- keeps the enrollment and lesson progress in progress;
- returns `certificateStatus: "assessment-failed"`;
- does not issue a certificate.

Invalid assessment evidence now fails before workflow updates are written.

## 4. Retake behavior

- Repeated identical external attempt evidence is deduplicated using the stored `attemptNumber` and `submittedAt` values in `QuizAttempt.answersJson.assessment`.
- A new failed retake with different attempt evidence is recorded as a separate failed `QuizAttempt`.
- A later passing retake with `completed=true` remains accepted and can issue the certificate.
- Repeating the same passing completion returns `already-issued` and does not create a second certificate.

## 5. Certificate eligibility behavior

Current behavior is preserved:

- Partial progress without assessment saves progress and does not issue a certificate.
- `completed=true` without assessment records completion but does not issue a certificate.
- `completed=true` with a failing assessment records a failed attempt and does not issue a certificate.
- `completed=true` with a passing assessment records a passed attempt and issues one certificate.
- Invalid enrollment/user/course context fails safely.

The new behavior adds failed attempt recording for `completed=false` assessment failures without marking the enrollment complete.

## 6. Verification scenarios tested

`npm run verify:hrba-external-course` now verifies:

1. Partial progress without assessment saves progress and does not issue a certificate.
2. `completed=false` with failing assessment records a failed attempt and does not issue a certificate.
3. Repeated identical failed assessment evidence does not create duplicate attempts.
4. `completed=true` without assessment does not issue a certificate.
5. `completed=true` with failing assessment records a separate failed retake and does not issue a certificate.
6. `completed=true` with passing assessment records a passed attempt and issues a certificate.
7. Repeated passing completion does not issue a duplicate certificate.
8. Invalid enrollment context fails safely.

Observed verifier output confirmed `failedAttemptCount: 2`, `failedAttemptRecorded: true`, `passedAttemptRecorded: true`, `progressPercent: 100`, and final enrollment status `COMPLETED`.

## 7. Data privacy protections

- No learner email, secrets, database URL, private profile data, portfolio content, or assessment answers are exposed in API responses or public pages.
- The workflow stores only minimal external assessment metadata needed for operational verification.
- Certificate responses still return only success state, progress/completion state, certificate status, and certificate code when applicable.
- No `.env` files were modified or committed.

## 8. Commands run and results

```powershell
npm run verify:hrba-external-course
npm run lint
npm run build
npm run prisma:validate
```

- `npm run verify:hrba-external-course`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run prisma:validate`: passed.

## 9. Remaining limitations

- Deduplication depends on external attempt evidence including stable `attemptNumber` and `submittedAt` values.
- No new database uniqueness constraint was added, so there is no migration in this slice.
- Certificate PDF generation remains out of scope.
- The Hub parent frame still suppresses repeated `completed=true` messages in a single iframe session, which remains acceptable because HRBA failed attempts are expected to send `completed=false`.

## 10. Recommended next slice

Proceed to the next approved slice after manual HRBA browser retake verification confirms that a failed external final assessment sends `completed=false` and a later passing retake sends `completed=true`.
