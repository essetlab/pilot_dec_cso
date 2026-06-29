# MVP Slice 4 Learner Dashboard Progress Certificate Journey Report

## 1. Summary of changes

- Polished the learner dashboard so pilot learners see their name, current course, progress, certificate status, and a clear next action.
- Enriched learner course summary data with certificate links, download links, verify links, and learner-safe next-action labels.
- Improved My Courses cards with clearer status labels and next actions for start, continue, final assessment, certificate issued, verify, and download states.
- Improved Certificates cards with explicit Verify certificate and Download certificate actions.
- Preserved existing certificate PDF generation, external-course callback logic, assessment logic, registration/auth logic, and stable routes.

## 2. Files changed

- `src/app/(learn)/learn/[[...segments]]/page.tsx`
- `src/components/learner/LearnerCertificates.tsx`
- `src/components/learner/LearnerDashboard.tsx`
- `src/components/learner/LearnerMyCourses.tsx`
- `src/lib/certificate-workflow.ts`
- `src/lib/course-data.ts`
- `src/lib/course-types.ts`
- `docs/mvp-slice-4-learner-dashboard-progress-certificate-journey-report.md`

## 3. Dashboard behavior

The learner dashboard now:

- greets the signed-in learner by name;
- highlights the current course or issued-certificate course;
- shows progress percentage;
- shows certificate state when available;
- uses clear next-action buttons such as `Start course`, `Continue learning`, `Continue final assessment`, `View certificate`, and `Download certificate`;
- explains that certificates are issued after course completion and a passing final assessment.

## 4. My Courses behavior

My Courses now presents clearer status and action language:

- `Not started`
- `In progress`
- `Final assessment available`
- `Completed`
- `Certificate issued`

Course cards show progress, current lesson or final assessment state, certificate code when issued, and direct actions for course progress, final assessment, public verification, and PDF download.

For the external HRBA course, the launch/continue action continues to point at the external course route.

## 5. Certificate journey behavior

The Certificates page now makes the issued-certificate path more explicit:

- course title;
- certificate code;
- issue date;
- View certificate;
- Verify certificate;
- Download certificate;
- Review course.

Empty-state language still directs learners back to My Courses when no certificate has been earned yet.

## 6. Learner-facing language improvements

Updated language avoids technical callback or raw enum terms. Learner-facing actions now use plain labels:

- Start course
- Continue learning
- Continue final assessment
- Final assessment
- Certificate issued
- View certificate
- Verify certificate
- Download certificate
- Review course progress

## 7. Data privacy protections

The updated views do not expose:

- assessment answers;
- private portfolio content;
- other learners' records;
- learner email in public areas;
- internal database IDs;
- admin-only fields.

Certificate links are generated from issued certificate codes only for the signed-in learner's certificate summaries.

## 8. Commands run and results

```powershell
npm run lint
npm run build
npm run prisma:validate
npm run verify:hrba-external-course
```

Results:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run prisma:validate`: passed.
- `npm run verify:hrba-external-course`: passed and generated an additional valid verifier certificate record, `CERT-E-V1-DEMO-QA0O`, during final verification.

## 9. Manual verification steps

Authenticated route smoke was run with a locally signed participant session using an issued certificate code.

Verified:

- `/learn`: `200`, expected dashboard text present.
- `/learn/my-courses`: `200`, expected My Courses text present.
- `/learn/certificates`: `200`, expected certificate/download text present.
- `/learn/profile`: `200`, expected profile text present.
- `/learn/settings`: `200`, expected settings text present.
- `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`: `200`, expected portal progress text present.
- `/verify-certificate?code=...`: `200`, expected public verified state present.
- `/learn/certificates/[certificateCode]/download`: `200`, returned `application/pdf` and `%PDF` header.

## 10. Remaining limitations

- The learner course summary still uses the current published-course list as the base source; future assignment-only refinements could filter My Courses more strictly to enrolled/assigned courses if needed.
- The HRBA final assessment action remains the external course route because assessment is owned by the embedded HRBA app.
- The existing UI search/filter controls on My Courses remain presentational and are not expanded in this slice.

## 11. Recommended next slice

Proceed to a focused learner feedback or final acceptance QA slice after reviewing the Slice 4 learner journey in the browser.
