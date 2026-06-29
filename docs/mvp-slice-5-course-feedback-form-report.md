# MVP Slice 5 Course Feedback Form Report

## 1. Summary of changes

Implemented a focused learner-facing course feedback form for pilot learners using the existing learner route and existing `Feedback` model. The form now collects structured course ratings, short general text responses, a consent checkbox for anonymized learning summaries, and a visible safe-feedback note.

No forums, support tickets, MEAL dashboard, certificate generation, external-course callback, registration/auth, or course-authoring behavior was added or changed.

## 2. Files changed

- `prisma/schema.prisma`
- `prisma/migrations-postgres/20260629120000_course_feedback_form_fields/migration.sql`
- `src/app/(learn)/learn/[[...segments]]/page.tsx`
- `src/components/learner/LearnerCourseFeedback.tsx`
- `src/components/learner/LearnerDashboard.tsx`
- `src/components/learner/LearnerMyCourses.tsx`
- `src/lib/course-data.ts`
- `src/lib/course-types.ts`
- `src/lib/feedback-workflow.ts`
- `src/lib/learner-actions.ts`
- `scripts/verify-r17.ts`
- `docs/mvp-slice-5-course-feedback-form-report.md`

## 3. Feedback data model

The existing generic `Feedback` model was extended instead of adding a duplicate `CourseFeedback` model. The new migration adds optional course-feedback fields:

- `enrollmentId`
- `easeOfUseRating`
- `certificateProcessRating`
- `mostUseful`
- `improvementSuggestion`
- `technicalIssue`
- `consentToUseAnonymizedFeedback`
- `updatedAt`

Existing `rating`, `usefulnessRating`, and `clarityRating` remain in use for overall, usefulness, and content clarity ratings so monitoring summaries stay compatible.

Migration applied locally:

- `20260629120000_course_feedback_form_fields`

## 4. Feedback form behavior

The learner route is:

- `/learn/courses/[courseSlug]/feedback`

The page is learner-protected and requires an existing enrollment. The course page helper now has a small opt-out flag so the feedback route does not silently create a new enrollment just by being opened.

The form includes:

- overall course rating;
- usefulness for CSO work rating;
- platform ease-of-use rating;
- content clarity rating;
- optional certificate-process rating with `Not applicable`;
- short text fields for what was useful, what should improve, and technical issues;
- anonymized-feedback consent checkbox;
- saved/submitted state and update support.

One learner can maintain one active response per course. If the learner submits again, the existing response is updated rather than creating a duplicate.

## 5. Learner journey links

Added `Give course feedback` links and `Feedback submitted` / `Feedback not submitted` indicators to:

- `/learn`
- `/learn/my-courses`

Feedback is not mandatory for certificate download.

## 6. Access control behavior

Verified behavior:

- signed-out access to the feedback route redirects to sign-in;
- enrolled participant can open and save feedback;
- saved feedback survives refresh and shows an update state;
- a seeded learner without an HRBA enrollment sees the feedback locked/not-enrolled message;
- learners cannot see other learners' feedback through the learner route.

## 7. Safe feedback/privacy protections

The form and side note instruct learners not to include:

- personal complaints;
- survivor stories;
- exact locations;
- names of community members;
- confidential organizational information.

The learner UI does not expose assessment answers, portfolio content, internal database IDs, other learners' information, admin-only fields, or raw role internals.

## 8. Commands run and results

- `docker start cso-learning-hub-postgres` — passed.
- `npx prisma validate` — passed.
- `npx prisma migrate status` — initially showed pending migration, then passed after deploy.
- `npm run db:migrate:deploy` — passed; applied `20260629120000_course_feedback_form_fields`.
- `npx prisma generate` — passed.
- `npm run lint` — passed.
- `npm run build` — passed after updating the older `scripts/verify-r17.ts` feedback payload.
- `npm run prisma:validate` — passed.
- `npm run verify:hrba-external-course` — passed; latest verifier output included an issued HRBA certificate code for the demo workflow.

## 9. Manual verification steps

Completed:

- signed in with a seeded participant account;
- opened `/learn/courses/applying-human-rights-based-approach-in-cso-practice/feedback`;
- confirmed the structured feedback form rendered;
- submitted short general feedback;
- confirmed success message;
- refreshed and confirmed `Feedback submitted` / `Update feedback` state persisted;
- checked `/learn` shows `Give course feedback`;
- checked `/learn/my-courses` shows feedback status;
- checked `/learn/certificates` returns issued certificate actions;
- checked `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external` returns the HRBA external frame route;
- checked signed-out feedback route redirects to `/sign-in`;
- checked a seeded learner without the HRBA enrollment sees the not-enrolled feedback lock;
- checked certificate PDF download returns `application/pdf`;
- checked public certificate verification for a valid code returns `Certificate verified`;
- checked public certificate verification for an invalid code returns the not-found state.

## 10. Remaining limitations

- There is no admin feedback dashboard in this slice by design.
- The app records short free-text feedback fields but relies on learner guidance to avoid sensitive details; semantic sensitive-content detection is not implemented.
- Monitoring summaries still use the existing generic feedback metrics. A later monitoring slice can decide how to aggregate the new structured fields.

## 11. Recommended next slice

Proceed to a focused monitoring/export or acceptance QA slice after reviewing the learner feedback flow in the browser.
