# MVP Slice 2.6 External Course Callback Contract Report

## 1. Summary of changes

- Extended the Hub-side external-course progress contract to accept optional final assessment results.
- Updated `/api/external-course-progress` validation for message type, version, progress bounds, and assessment field shape.
- Updated external-course workflow so completion alone no longer issues certificates.
- Stored external final assessment outcomes in existing `QuizAttempt` records.
- Updated the HRBA external-course verifier to cover partial progress, missing assessment, failing assessment, passing assessment, and invalid context.

## 2. Files changed

- `src/lib/external-course-types.ts`
- `src/components/learner/ExternalCourseFrame.tsx`
- `src/app/api/external-course-progress/route.ts`
- `src/lib/external-course-workflow.ts`
- `scripts/verify-hrba-external-course.ts`
- `docs/mvp-slice-2-6-external-course-callback-contract-report.md`

## 3. Updated external-course message contract

The Hub accepts the existing progress message shape plus an optional `assessment` object:

```ts
{
  type: "cso-learning-hub:external-course-progress",
  version: 1,
  courseSlug: string,
  userId: string,
  enrollmentId?: string,
  courseVersionId?: string,
  progressPercent: number,
  completed: boolean,
  completedModuleIds: string[],
  currentModuleId: string | null,
  currentScreenId: string | null,
  sentAt: string,
  assessment?: {
    score?: number,
    maxScore?: number,
    percentage?: number,
    passed?: boolean,
    attemptNumber?: number,
    submittedAt?: string
  }
}
```

Partial progress messages without `assessment` remain supported.

## 4. Assessment result handling

- `score`, `maxScore`, `percentage`, and `attemptNumber` must be finite numbers when present.
- `passed` must be boolean when present.
- `submittedAt` must be a string when present.
- If `percentage` is missing but `score` and `maxScore` are present, the workflow computes percentage.
- External assessment outcomes are stored in existing `QuizAttempt` fields and `answersJson`.

## 5. Certificate eligibility rule

The Hub now issues an external-course certificate only when:

- the learner is authenticated;
- the enrollment belongs to the learner;
- course slug, user id, enrollment id, course version id, and allowed origin match;
- `completed` is true;
- assessment result is present and valid;
- `passed` is true;
- assessment percentage is greater than or equal to the configured pass threshold.

Completion without assessment records completion/progress but returns `certificateStatus: "assessment-missing"` and does not issue a certificate.

Failing assessment records a failed `QuizAttempt`, returns `certificateStatus: "assessment-failed"`, and does not issue a certificate.

Passing assessment records a passed `QuizAttempt` and issues a certificate.

## 6. API/session/origin validation

- The API requires a valid authenticated session through the existing session cookie.
- Session user id must match message `userId`.
- Course/enrollment/courseVersion context must match existing database records.
- Existing allowed-origin metadata is checked against the submitted iframe origin.
- Invalid message type/version, progress values, or assessment fields are rejected before workflow updates.
- Responses avoid exposing learner email, secrets, database URLs, or private records.

## 7. Data privacy protections

- Assessment answers are stored only as operational completion metadata in `QuizAttempt.answersJson`.
- Public certificate verification still exposes only minimal certificate data.
- API responses include only success state, progress, completion, certificate code when issued, and certificate status.
- No `.env` or secret values were printed or committed.

## 8. Verification scenarios tested

Updated `npm run verify:hrba-external-course` covers:

1. Partial progress without assessment saves progress and does not issue a certificate.
2. `completed=true` without assessment records completion but does not issue a certificate.
3. `completed=true` with percentage below 80 and `passed=false` records a failed attempt and does not issue a certificate.
4. `completed=true` with percentage 90 and `passed=true` records a passed attempt and issues a certificate.
5. Invalid enrollment context fails safely.

Stable route smoke checks also passed for the public, learner, certificate, and HRBA external-course routes listed in the slice request.

## 9. Commands run and results

```powershell
npm run lint
npm run verify:hrba-external-course
npm run build
npm run prisma:validate
```

- `npm run lint`: passed.
- `npm run verify:hrba-external-course`: passed.
- `npm run build`: passed.
- `npm run prisma:validate`: passed.

Additional HTTP checks returned `HTTP 200` for:

- `/`
- `/register`
- `/sign-in`
- `/courses`
- `/courses/human-rights-based-approach-practice`
- `/verify-certificate`
- `/verify-certificate?code=CERT-E-V1-DEMO-GVO5`
- `/learn`
- `/learn/profile`
- `/learn/settings`
- `/learn/my-courses`
- `/learn/certificates`
- `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`

## 10. Remaining limitations

- The HRBA external app still needs to implement and send the new assessment payload.
- The Hub validates the submitted iframe origin against configured course metadata, but the browser-facing API still receives that origin as part of the message payload from the wrapper.
- No new external assessment management system was added; existing `QuizAttempt` is used as the closest safe model.
- Certificate PDF generation remains out of scope.

## 11. Recommended next slice

Implement the HRBA app-side callback payload after human review of this Hub-side contract.
