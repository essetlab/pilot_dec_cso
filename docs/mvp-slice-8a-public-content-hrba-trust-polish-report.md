# MVP Slice 8A Public Content, HRBA Course Overview, and Trust Polish Report

## 1. Summary of changes

- Updated the public homepage to use the approved v1.1 promise: "Learn. Connect. Grow."
- Added future-aware Learn -> Exchange -> Co-create pathway messaging without active community or co-creation routes.
- Added practical tools/resources and growing CSO learning community sections as pilot-safe messaging.
- Polished course catalog labels to use learner-facing metadata such as "Available now" and "Certificate eligible."
- Corrected HRBA public course overview presentation for the Hub-backed HRBA slugs.
- Added certificate rule wording and the required certificate limitation disclaimer on public and learner-facing certificate surfaces.
- Added public verification safety copy that states what verification shows and what it does not expose.
- Added essential public trust pages: `/support`, `/privacy`, `/terms`, and `/accessibility`.
- Added footer links to Help/Support, Privacy, Terms, and Accessibility.
- Replaced the missing combined partner-logo strip with the approved individual logo assets already present in `public/logos/`.
- Made minor sign-in/register copy updates for learner-friendly help, safe-use guidance, and active trust links.

## 2. Files changed

- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(public)/accessibility/page.tsx`
- `src/app/(public)/privacy/page.tsx`
- `src/app/(public)/support/page.tsx`
- `src/app/(public)/terms/page.tsx`
- `src/components/learner/LearnerCertificates.tsx`
- `src/components/public/CataloguePage.tsx`
- `src/components/public/CertificateVerificationPage.tsx`
- `src/components/public/CourseDetailPage.tsx`
- `src/components/public/LandingPage.tsx`
- `src/components/public/TrustPage.tsx`
- `src/components/shell/PublicShell.tsx`
- `src/lib/course-data.ts`
- `src/lib/demo-data.ts`
- `src/lib/external-course-workflow.ts`
- `src/lib/routes.ts`
- `docs/mvp-slice-8a-public-content-hrba-trust-polish-report.md`

## 3. Source of truth used

- `docs/specifications/cso-learning-hub-consolidated-specification-v1-1.md`
- `docs/specifications/cso-learning-hub-pilot-implementation-backlog.md`
- `docs/specifications/cso-learning-hub-v1-1-decision-log.md`

## 4. Public copy changes

- Homepage hero headline now reads: "Learn. Connect. Grow."
- Homepage hero subtitle now uses the approved public promise.
- Trust chips now read: Practical courses, Local CSO context, Peer learning vision, Certificate eligible.
- Value cards now align with v1.1: Practical Courses, Guided Learning Journeys, Peer Learning Vision, and Co-created Practice.
- "Phase 1" public language was replaced with learner-facing pilot/current-learning wording.
- "Resource library" was replaced with "Downloadable tools and resources inside courses."
- Peer exchange and co-creation are described as future-aware directions, not active modules.

## 5. HRBA course overview correction summary

- HRBA course overview presentation now uses the approved HRBA promise.
- HRBA outcomes now match the v1.1 outcomes focused on rights-holders, duty-bearers, participation, barriers, HRBA principles, safe analysis, final assessment, and practice.
- HRBA public overview copy now emphasizes participation, inclusion, accountability, non-discrimination, power and barriers, safe evidence, project-cycle decisions, final assessment, and certificate eligibility.
- HRBA is not described as a proposal development course.

## 6. Trust/support/privacy pages

Created:
- `/support`
- `/privacy`
- `/terms`
- `/accessibility`

Each page uses short pilot-safe language and includes a safe-use reminder:

> Do not include names, survivor stories, exact locations, complaints, political details, safeguarding cases, or confidential organizational information.

## 7. Certificate wording/disclaimer added

Added or updated wording on:
- HRBA/public course overview sidebar and CTA.
- Public certificate verification page.
- Learner certificate list and detail surfaces.
- Terms/trust content.

Required rule included:

> Certificate available after completing the required learning activities and scoring 80% or above on the final assessment.

Required disclaimer included:

> This certificate confirms that the named learner completed the course requirements and passed the final assessment. It does not replace organizational due diligence, safeguarding review, legal compliance checks, or partnership assessment.

## 8. Footer/logo handling

- Footer now links to Home, Courses, Verify Certificate, Sign In, Register, Help/Support, Privacy, Terms, and Accessibility.
- The previous footer referenced `/logos/partner-logo-strip.png`, which was not present.
- Approved individual logo assets were present in `public/logos/`, so the footer now renders those instead of a broken combined strip.
- No logos were invented and no unapproved assets were added.

## 9. What was intentionally not built

- No donor portal.
- No external verifier role.
- No public organization scoring.
- No community/forum platform.
- No public resource uploads.
- No course authoring expansion.
- No practical proof gallery.
- No advanced analytics/capability intelligence.
- No full offline support claims.
- No certificate claim that organizational capacity is certified.

## 10. Checks run and results

- `npm run lint` - passed.
- `npm run build` - passed.
- `npm run prisma:validate` - passed.
- `npm run verify:hrba-external-course` - passed.
- `npm run verify:r17` - passed.

Build output confirmed the new public routes:
- `/support`
- `/privacy`
- `/terms`
- `/accessibility`

## 11. Browser/manual QA notes

Local app used for browser QA: `http://localhost:3000`.

Desktop spot checks:
- `/` showed the approved hero, pathway, tools/resources, and community vision copy with no horizontal overflow.
- `/courses` showed "Certificate eligible" and "Available now" labels with no horizontal overflow.
- `/courses/applying-human-rights-based-approach-in-cso-practice` showed the HRBA promise, rights-holder language, 80% rule, and certificate disclaimer with no horizontal overflow.
- `/verify-certificate` showed the verification safety copy with no horizontal overflow.

Mobile/narrow viewport spot checks at 390px:
- `/`
- `/courses`
- `/courses/applying-human-rights-based-approach-in-cso-practice`
- `/support`
- `/privacy`
- `/terms`
- `/accessibility`
- `/verify-certificate`

All narrow checks showed no horizontal overflow and visible CTA/link text.

HTTP route checks returned 200 for:
- `/`
- `/courses`
- `/courses/applying-human-rights-based-approach-in-cso-practice`
- `/verify-certificate`
- `/support`
- `/privacy`
- `/terms`
- `/accessibility`

## 12. Open issues/blockers

- No new blocker was found in this slice.
- The final official HRBA deployment/token update remains a deployment-specific closure item from prior acceptance QA and is not changed by this public content slice.

## 13. Source/schema/env confirmation

- Source code changed: yes, limited to public, learner-facing wording, route registration, footer rendering, and HRBA course metadata presentation.
- Database schema changed: no.
- Migrations created or run: no.
- `.env` changed: no.
- Authentication/session architecture changed: no.
- Certificate generation logic changed: no.
- HRBA external-course callback contract changed: no.
