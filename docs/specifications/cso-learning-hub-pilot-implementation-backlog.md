# CSO Learning Hub Pilot Implementation Backlog

## P0 - Must fix before pilot/public demonstration

### 1. Correct HRBA course overview content and metadata

Issue: HRBA course overview content must not reuse proposal development copy or unrelated metadata.

Why it matters: Learners need a clear, accurate promise for the HRBA pilot course, and incorrect copy undermines trust.

Affected routes/pages: `/courses/[courseSlug]`, `/courses`, learner course launch surfaces, seeded course metadata.

Recommended implementation slice: Public content and HRBA course metadata correction.

Acceptance criteria:
- HRBA overview focuses on rights-holders, duty-bearers, participation, inclusion, accountability, non-discrimination, power and barriers, safe evidence, project-cycle decisions, final assessment, and certificate.
- The suggested HRBA promise is used or closely adapted.
- HRBA learning outcomes match the v1.1 specification.
- No proposal-development text appears on the HRBA overview.

### 2. Confirm/deploy protected HRBA pilot course URL with launchToken portal mode

Issue: The official HRBA pilot course must be a protected portal-mode deployment that accepts launchToken context.

Why it matters: The pilot cannot safely rely on raw internal IDs or an outdated public course URL.

Affected routes/pages: `/learn/courses/[courseSlug]/external`, HRBA external course deployment, external course configuration.

Recommended implementation slice: Protected HRBA deployment and end-to-end blocker closure.

Acceptance criteria:
- Hub launches HRBA through a protected learner flow.
- Iframe URL includes launchToken and portal mode.
- Iframe URL does not include raw user, enrollment, or course version IDs.
- Direct HRBA access without valid portal context tells users to access the course through the Hub.

### 3. Ensure old shared HRBA URL is not used as the official pilot entry point

Issue: Any old shared HRBA URL must not be the official learner entry point.

Why it matters: Shared direct URLs bypass Hub identity, progress, assessment, certificate, and privacy controls.

Affected routes/pages: HRBA deployment settings, course overview, learner launch route, documentation.

Recommended implementation slice: HRBA deployment cleanup and configuration verification.

Acceptance criteria:
- Official public and learner copy points to the Hub flow.
- Environment/configuration references the protected pilot deployment.
- Old shared URL is not presented as the official pilot access route.

### 4. Fix any broken partner/donor logo strip

Issue: Partner recognition must render reliably and accessibly.

Why it matters: Broken logos weaken public trust and stakeholder readiness.

Affected routes/pages: Homepage footer, public footer, policy/trust pages where partner recognition appears.

Recommended implementation slice: Public footer and asset QA.

Acceptance criteria:
- Approved logos render with consistent size and spacing.
- Logo strip is responsive.
- Images have useful alt text or are marked decorative when appropriate.
- No broken image icons appear.

### 5. Remove public "Phase 1" wording

Issue: Public pages should not describe the learner-facing product as "Phase 1."

Why it matters: Implementation-stage language makes the platform feel unfinished.

Affected routes/pages: Homepage, catalog, course overview, sign-in, register, footer, help/trust pages.

Recommended implementation slice: Public copy cleanup.

Acceptance criteria:
- Public learner-facing pages do not show "Phase 1."
- Internal docs may still use Phase 1 where appropriate.
- Replacement copy uses pilot-safe learning language.

### 6. Fix blank or low-contrast CTA button issues

Issue: CTA buttons must be visible, readable, and accessible.

Why it matters: Poor contrast blocks key learner actions and fails accessibility expectations.

Affected routes/pages: Homepage, catalog, course overview, sign-in, register, learner dashboard, certificate pages.

Recommended implementation slice: Public and learner UI accessibility polish.

Acceptance criteria:
- Primary and secondary CTAs have readable labels.
- Button contrast passes accessibility review.
- Hover/focus states are visible.
- Buttons do not appear blank on desktop or mobile.

### 7. Add certificate rule wording and safe certificate disclaimer

Issue: Certificate meaning and limits must be explicit.

Why it matters: Certificates confirm course completion and final assessment, not organizational due diligence or capacity certification.

Affected routes/pages: Course overview, learner certificates, certificate PDF/download, public verification, certificate policy/trust page.

Recommended implementation slice: Certificate trust wording.

Acceptance criteria:
- Course overview explains required completion and 80%+ final assessment.
- Certificate surfaces include the required disclaimer.
- Public verification remains safe and minimal.
- No wording implies certificates certify organizational capacity.

### 8. Add essential Help / Privacy / Terms / Accessibility links/pages

Issue: Public trust and support pages must exist before demonstration.

Why it matters: Learners need basic support, data-use, terms, and accessibility information.

Affected routes/pages: Footer, public support pages, sign-in/register links, course overview support links.

Recommended implementation slice: Support/privacy/trust pages.

Acceptance criteria:
- Help, Privacy, Terms, and Accessibility pages exist.
- Footer links are active and not broken.
- Pages include pilot-safe, plain-language content.
- Privacy and help content includes safe-use reminders.

## P1 - Strongly recommended before pilot

### 1. Replace "Learn, Adapt, Grow" with "Learn. Connect. Grow."

Issue: Public promise must use the approved wording.

Why it matters: Consistent positioning improves stakeholder clarity and reduces product drift.

Affected routes/pages: Homepage, catalog, footer, public copy, documentation snippets used by UI.

Recommended implementation slice: Public positioning copy pass.

Acceptance criteria:
- "Learn. Connect. Grow." is the public core promise.
- "Learn, Adapt, Grow" does not appear in public UI.

### 2. Add Learn → Exchange → Co-create pathway as future-aware messaging

Issue: The platform pathway should be visible without implying unbuilt modules are active.

Why it matters: It communicates growth direction while protecting pilot scope.

Affected routes/pages: Homepage, About/platform section, trust pages.

Recommended implementation slice: Homepage messaging polish.

Acceptance criteria:
- Learn is presented as current pilot focus.
- Exchange and Co-create are clearly future-aware.
- No active community/co-creation buttons appear unless implemented.

### 3. Add Practical Tools and Resources section

Issue: Public copy should highlight practical resources without opening uncontrolled uploads.

Why it matters: Practical tools are a core learner value, but resource sharing workflows are future-stage.

Affected routes/pages: Homepage, course overview.

Recommended implementation slice: Homepage section update.

Acceptance criteria:
- Section explains downloadable or course-linked practical resources.
- It does not invite open public resource uploads.
- It includes safe-use framing for sensitive content.

### 4. Add Growing CSO Learning Community section without active community buttons

Issue: Community vision should be framed as a pathway, not an active current module.

Why it matters: It avoids misleading learners and prevents Phase 2/3 drift.

Affected routes/pages: Homepage, About/platform section.

Recommended implementation slice: Homepage section update.

Acceptance criteria:
- Community section is future-aware.
- No active community route/button is shown unless implemented.
- Copy avoids overpromising peer/community features.

### 5. Improve course catalog metadata and learner-facing labels

Issue: Catalog labels must be clear and non-technical.

Why it matters: Learners should understand course level, duration, certificate eligibility, and access without seeing internal language.

Affected routes/pages: `/courses`, course cards, featured course section.

Recommended implementation slice: Catalog metadata polish.

Acceptance criteria:
- Cards use learner-friendly metadata.
- No raw enum labels or internal IDs appear.
- Certificate eligible and access labels are clear.

### 6. Improve sign-in/register validation and help text

Issue: Auth forms should explain errors and next steps clearly.

Why it matters: Pilot learners may need low-friction account access and recovery guidance.

Affected routes/pages: `/sign-in`, `/register`.

Recommended implementation slice: Auth UX copy and validation pass.

Acceptance criteria:
- Invalid access code, duplicate email, password, and sign-in errors are clear.
- Help text avoids exposing invitation records or private data.
- Public role options remain learner-only.

### 7. Add private portfolio/practical-output messaging

Issue: Learners need to know practical outputs are private by default.

Why it matters: This supports non-extractive learning and reduces fear of sharing sensitive examples.

Affected routes/pages: Course overview, learner dashboard, course player activity blocks, practical activity copy.

Recommended implementation slice: Portfolio/practical-output messaging.

Acceptance criteria:
- Practical outputs are described as private learner/CSO tools.
- Copy states they are not public, donor-facing, or certificate proof by default.
- Safe-use wording appears where learners type or submit.

### 8. Add mobile/accessibility/low-bandwidth QA pass

Issue: Pilot learner screens need final responsive and accessibility verification.

Why it matters: Local and grassroots CSO learners may use mobile devices and intermittent connectivity.

Affected routes/pages: Homepage, catalog, course overview, sign-in, register, learner dashboard, My Courses, course player, certificates, feedback.

Recommended implementation slice: Mobile/accessibility/low-bandwidth QA.

Acceptance criteria:
- Major public and learner routes work on narrow screens.
- Text does not overlap or overflow.
- Core flows are keyboard-accessible.
- Images are compressed and nonessential media is optional where practical.
- No claim of full offline learning appears.

## P2 - Post-pilot polish

### 1. Expand policy and trust content depth

Issue: Initial Help / Privacy / Terms / Accessibility pages may be minimal for pilot.

Why it matters: Post-pilot growth will require more complete policy and trust content.

Affected routes/pages: Help, Privacy, Terms, Accessibility, Certificate policy.

Recommended implementation slice: Trust page content expansion.

Acceptance criteria:
- Policy pages cover support, privacy, safe participation, certificate meaning, data requests, and accessibility.
- Content remains plain-language and non-extractive.

### 2. Improve dynamic catalog/filter metadata

Issue: Some filter options may remain static or semi-static.

Why it matters: Post-pilot catalog growth will need cleaner reference-data-driven filtering.

Affected routes/pages: `/courses`, admin/course metadata if used.

Recommended implementation slice: Dynamic filter source polish.

Acceptance criteria:
- Filter options derive from active reference/course data where appropriate.
- Empty states remain useful.

### 3. Refine learner dashboard states

Issue: Learner course states can be polished further after pilot evidence.

Why it matters: Clear states help learners continue, complete, and find certificates.

Affected routes/pages: `/learn`, `/learn/my-courses`, `/learn/certificates`.

Recommended implementation slice: Learner journey state polish.

Acceptance criteria:
- Enrolled, assigned, available, completed, and certificate states are visually distinct.
- Empty states provide useful next steps.

## Future stage - specify now, build later

### 1. External Verifier / Partner Verifier role

Issue: Partners may eventually need to verify consented evidence.

Why it matters: Partner-safe verification may support post-pilot recognition.

Affected routes/pages: Future verifier portal, certificate/proof verification, admin consent controls.

Recommended implementation slice: Future-stage verifier specification.

Acceptance criteria:
- Consent, purpose limitation, access logging, and safe-field rules are defined before implementation.

### 2. Consent-based organization profile

Issue: Organizations may eventually need controlled profiles.

Why it matters: Profiles can support exchange and partner coordination.

Affected routes/pages: Future organization profile and visibility settings.

Recommended implementation slice: Future-stage organization profile specification.

Acceptance criteria:
- Profiles are private by default.
- CSO-controlled consent and visibility rules are specified.

### 3. Practical proof / verified achievement

Issue: Applied evidence should be separate from course certificates.

Why it matters: It can recognize practice without overclaiming certificate meaning.

Affected routes/pages: Future portfolio/proof review and verification flows.

Recommended implementation slice: Future-stage practical proof specification.

Acceptance criteria:
- Proof is opt-in, safety-reviewed, revocable, and separate from certificate eligibility.

### 4. Community, forums, LALINKage, and resource validation

Issue: Peer learning and shared resources need moderation and validation.

Why it matters: Exchange can be valuable, but unsafe sharing can harm learners and organizations.

Affected routes/pages: Future community, forums, resource library, moderation tools.

Recommended implementation slice: Future-stage community safety and resource validation specification.

Acceptance criteria:
- Moderation, reporting, retention, attribution, licensing, and safe-sharing rules are specified.

### 5. Offline sync and low-connectivity expansion

Issue: Full offline learning is not currently claimable.

Why it matters: Future offline support may improve inclusion for low-connectivity learners.

Affected routes/pages: Future course player, local save queue, sync status UI.

Recommended implementation slice: Future-stage offline architecture specification.

Acceptance criteria:
- Course version conflict handling, local save queue, retry logic, and sync failure recovery are specified before build.

### 6. Capability intelligence and advanced reporting

Issue: Analytics can become extractive if not carefully constrained.

Why it matters: Aggregate learning evidence can guide support without exposing CSO weaknesses.

Affected routes/pages: Future reporting and capability intelligence dashboards.

Recommended implementation slice: Future-stage non-extractive analytics specification.

Acceptance criteria:
- Reporting is aggregate, thresholded where appropriate, and excludes raw learner records, private feedback, assessment answers, and organization weaknesses.

### 7. Course creator/reviewer/publisher expansion and AI-assisted authoring governance

Issue: Future course production beyond pilot needs governance before expansion.

Why it matters: Authoring at scale requires QA, review, source control, AI governance, and safety checks.

Affected routes/pages: Future Build Studio, review, publish, authoring governance, AI assistance.

Recommended implementation slice: Future-stage authoring governance specification.

Acceptance criteria:
- Human review, source attribution, safety review, AI-use limits, and learner-data separation are defined before build.
