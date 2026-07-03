# CSO Learning Hub Consolidated Specification v1.1

## 0. Document Control

Version: v1.1

Purpose: This document refines the CSO Learning Hub consolidated specification into an implementation-ready pilot scope. It tells future implementation agents what to build now, what to specify for later, and what must stay out of the current pilot.

Intended users: DEC/WHH programme owners, CSF+ stakeholders, product reviewers, implementation agents, developers, QA reviewers, and future maintainers of the CSO Learning Hub.

Source documents reviewed:
- `README.md`
- `docs/CSO_Learning_Hub_Consolidated_Specification_Outline.md`
- `docs/specs/phase-1-cso-learning-hub/README.md`
- `docs/specs/phase-1-cso-learning-hub/CODEX_IMPLEMENTATION_STATUS.md`
- `docs/specs/phase-1-cso-learning-hub/CODEX_REVISED_IMPLEMENTATION_PLAN.md`
- `docs/design/README.md`
- `docs/design/00_VISUAL_SOURCE_OF_TRUTH.md`
- `docs/mvp-slice-1-public-navigation-certificate-verification-report.md`
- `docs/mvp-slice-2-learner-profile-settings-report.md`
- `docs/mvp-slice-2-5-pilot-registration-access-flow-report.md`
- `docs/mvp-slice-2-6-external-course-callback-contract-report.md`
- `docs/mvp-slice-2-7-hrba-e2e-progress-smoke-test-report.md`
- `docs/mvp-slice-2-8-hrba-final-assessment-callback-e2e-report.md`
- `docs/mvp-slice-2-9-external-failed-assessment-recording-report.md`
- `docs/mvp-slice-3-0-certificate-pdf-generation-report.md`
- `docs/mvp-slice-4-learner-dashboard-progress-certificate-journey-report.md`
- `docs/mvp-slice-5-course-feedback-form-report.md`
- `docs/mvp-slice-6-basic-pilot-monitoring-report.md`
- `docs/mvp-slice-6-db-backed-verification-report.md`
- `docs/mvp-slice-7-final-pilot-acceptance-qa-report.md`
- `docs/mvp-slice-7-internal-id-exposure-hotfix-report.md`
- `docs/evidence/certificates/hrba-certificate-visual-qa-report.md`
- `docs/evidence/certificates/hrba-certificate-visual-qa-v2-report.md`
- `docs/evidence/certificates/hrba-certificate-visual-qa-v3-report.md`

Source limitations:
- The named review files `Review of the CSO Learning Hub.docx`, `Review of audio the deep dive on the CSO Learning Hub.docx`, `Review of Fixing_CSO_Learning_Hub_Architectural_Blindspots.m4a.docx`, and `Strategic decisions_ what to build now vs what to specify for later.docx` were not found under `docs/` during inspection.
- This v1.1 document therefore consolidates the available repository outline, implementation reports, status docs, design docs, and the approved decisions supplied in the task request.
- No application behavior, database schema, migrations, `.env`, certificate logic, registration/auth logic, or HRBA callback logic was inspected for modification as part of this documentation task.

Document status: Implementation-ready pilot scope specification. It supersedes the previous outline for pilot scoping decisions but does not delete or rewrite the original outline.

Implementation principle: The pilot must remain learner-centered, practical, non-extractive, and privacy-preserving. Build the e-learning MVP now; specify future community, verification, organization-profile, proof, offline, authoring, and intelligence layers without exposing them as active pilot features.

## 1. Strategic Product Positioning

The CSO Learning Hub is a practical digital learning platform for local and grassroots CSOs. Its immediate role is to help learners access structured courses, track progress, complete final assessments, earn safe certificates, and apply learning through private practical outputs.

The CSF+ capacity development context requires a platform that supports skills, reflection, and locally grounded practice without turning learning data into donor surveillance or public scoring. The Hub should strengthen confidence and capability while protecting CSOs from unnecessary exposure.

Primary audience: local and grassroots CSOs, including individual learners, CSO focal persons, and programme participants who need accessible, practical, and safe learning.

Core promise: Learn. Connect. Grow.

Approved public promise: “A practical learning hub where local and grassroots CSOs build skills, share experience, and grow their capacity to lead change.”

What the Hub is:
- A learner-centered e-learning MVP for structured CSO capacity development.
- A safe entry point for the HRBA pilot course.
- A progress, assessment, certificate, feedback, and aggregate monitoring platform.
- A foundation for future exchange and co-creation.
- A practical place for learners to build private tools and outputs they can use in their own work.

What the Hub is not:
- It is not a donor portal.
- It is not a public CSO scoring or ranking system.
- It is not a surveillance dashboard.
- It is not a course-authoring marketplace in the current pilot.
- It is not a full community/forum platform in the current pilot.
- It is not an offline-first learning system unless later architecture is implemented and verified.

Non-extractive design principle: The Hub must collect only what is needed for learning, support, certificates, and aggregate improvement. It must not expose weaknesses, private feedback, assessment answers, portfolio outputs, or raw learner records to donors or the public.

Learner-centered pilot principle: The first pilot should help learners register, sign in, launch the HRBA course, learn, complete, receive certificates, manage their profile, and provide feedback. Everything else must support that journey or remain future-stage.

Platform growth pathway: Learn → Exchange → Co-create
- Learn: current pilot focus. Structured courses, progress, assessment, certificates, feedback, and safe practical activities.
- Exchange: future-stage peer learning, LALINKage, communities, resource sharing, and moderated interaction.
- Co-create: future-stage collaborative tools, practical proof, validated resources, and consent-based evidence of achievement.

## 2. Current MVP / Pilot Build Scope

The current pilot scope includes, or should preserve, these capabilities:
- Learner registration.
- Learner sign-in.
- Course catalog.
- Course overview pages.
- HRBA course access through the Hub.
- Protected launchToken-based external course launch.
- Progress tracking.
- Final assessment callback.
- 80% certificate eligibility rule.
- Downloadable PDF certificate.
- Public certificate verification.
- Learner dashboard.
- My Courses.
- Certificates page.
- Profile/settings.
- Course feedback form.
- Aggregate-only pilot monitoring.

Key principle: The pilot must remain learner-centered and must not become a donor portal, course-authoring platform, or surveillance dashboard.

The pilot may mention future exchange and co-creation as a pathway, but these must not appear as active features unless implemented and accepted in a later stage.

## 3. Immediate Build-Now Priorities

### P0 - Must fix before pilot/public demonstration

1. Correct HRBA course overview content and metadata.
2. Confirm/deploy protected HRBA pilot course URL with launchToken portal mode.
3. Ensure old shared HRBA URL is not used as the official pilot entry point.
4. Fix any broken partner/donor logo strip.
5. Remove public "Phase 1" wording.
6. Fix blank or low-contrast CTA button issues.
7. Add certificate rule wording and safe certificate disclaimer.
8. Add essential Help / Privacy / Terms / Accessibility links/pages.

### P1 - Strongly recommended before pilot

1. Replace "Learn, Adapt, Grow" with "Learn. Connect. Grow."
2. Add Learn → Exchange → Co-create pathway as future-aware messaging.
3. Add Practical Tools and Resources section.
4. Add Growing CSO Learning Community section without active community buttons.
5. Improve course catalog metadata and learner-facing labels.
6. Improve sign-in/register validation and help text.
7. Add private portfolio/practical-output messaging.
8. Add mobile/accessibility/low-bandwidth QA pass.

## 4. Build-Later / Future Stage Scope

Future-stage items should be specified now so architecture remains possible, but they must not be built in the current pilot unless explicitly approved.

### External Verifier / Partner Verifier role

Purpose: Allow selected trusted partners to verify specific learner or practical achievement evidence.

Why useful: It can support partner-safe recognition beyond basic certificates.

Why not now: The pilot needs certificate verification only; partner verification adds roles, consent rules, review workflows, and data access risk.

Minimum safety/privacy rule: Verifiers must see only consented, purpose-limited records and never raw learner progress, answers, private feedback, or private portfolio content by default.

### Consent-based organization profile

Purpose: Let CSOs maintain organization information they choose to share.

Why useful: It can support networking, partner coordination, and capacity development planning.

Why not now: Organization profiles can easily become extractive or donor-facing before consent and governance are mature.

Minimum safety/privacy rule: Organization data must be private by default, editable by authorized CSO users, and shared only through explicit consent.

### Optional practical proof / verified achievement pathway

Purpose: Separate applied practice evidence from course completion certificates.

Why useful: It can help learners demonstrate real application after a course.

Why not now: Verification requires safety review, consent, evidence standards, reviewer training, and appeal/correction processes.

Minimum safety/privacy rule: Practical proof must be opt-in, safety-reviewed, revocable, and never required for basic certificate completion.

### Peer learning and LALINKage community

Purpose: Support exchange among learners and CSOs after course completion.

Why useful: Local learning can deepen through discussion, shared practice, and peer support.

Why not now: Moderation, safeguarding, community governance, and abuse handling are not pilot-critical.

Minimum safety/privacy rule: Community participation must be consent-based, moderated, and designed around safe sharing.

### Community resource validation workflow

Purpose: Let community-contributed tools and resources be reviewed before wider use.

Why useful: It can improve practical relevance while protecting quality.

Why not now: Open uploads and review workflows introduce content safety, moderation, and legal risks.

Minimum safety/privacy rule: No public resource upload should publish without review, attribution, licensing, and safety checks.

### Learner directory

Purpose: Allow learners to find peers where they choose to be visible.

Why useful: It can support exchange and collaboration.

Why not now: A directory introduces privacy, consent, harassment, and safeguarding risks.

Minimum safety/privacy rule: Visibility must be opt-in, minimal, reversible, and never expose contact details by default.

### Forums and interaction spaces

Purpose: Provide course, cohort, or topic discussion spaces.

Why useful: Learners can ask questions, reflect, and share safe examples.

Why not now: Forums need moderation, reporting, retention, and escalation policies.

Minimum safety/privacy rule: Forums must include safe-use prompts, moderation, reporting, and sensitive-data controls.

### Offline sync and conflict-resolution architecture

Purpose: Support learning where connectivity is intermittent.

Why useful: Low-bandwidth and offline access may matter for grassroots CSOs.

Why not now: Full offline sync requires careful course versioning, local storage, conflict handling, retry logic, and privacy controls.

Minimum safety/privacy rule: Local data must be minimized, protected, retryable, and clearable, with no sensitive content cached unnecessarily.

### Course/assessment versioning expansion

Purpose: Preserve records across course changes and assessment revisions.

Why useful: It supports certificate trust and fair assessment history.

Why not now: Current pilot can rely on the implemented version linkage and limited course set.

Minimum safety/privacy rule: Certificates must remain tied to the course version actually completed.

### Capability intelligence layer

Purpose: Aggregate learning patterns to guide future capacity support.

Why useful: It can help programme teams understand where support is needed.

Why not now: It risks becoming a weakness dashboard or donor surveillance layer if built too early.

Minimum safety/privacy rule: Intelligence must be aggregate, purpose-limited, and never rank or expose individual CSOs.

### Course creator / reviewer / publisher workflow expansion

Purpose: Enable broader controlled course authoring, QA, review, and publishing beyond the narrow pilot needs.

Why useful: The Hub will need a maintainable course production process.

Why not now: The current pilot should not broaden into a full authoring product unless explicitly approved.

Minimum safety/privacy rule: Authoring workflows must separate learner records from content-production operations.

### AI-assisted authoring governance

Purpose: Help creators draft, adapt, translate, and QA course materials responsibly.

Why useful: It can speed future course production.

Why not now: AI authoring requires content review, bias checks, safeguarding, source attribution, and accountability.

Minimum safety/privacy rule: AI-assisted content must be human-reviewed, source-aware, and must not process private learner or CSO data without explicit governance.

### Multilingual/local-language expansion

Purpose: Support learners in relevant local languages.

Why useful: It improves inclusion and accessibility.

Why not now: Translation, QA, versioning, and accessibility need a controlled process.

Minimum safety/privacy rule: Translations must be reviewed for accuracy, safety, and context before publication.

### Advanced partner-safe reporting

Purpose: Provide partners with aggregate, privacy-preserving programme insight.

Why useful: It supports accountability and improvement.

Why not now: Reporting can easily overreach into learner or organization surveillance.

Minimum safety/privacy rule: Reports must be aggregate, thresholded where appropriate, and must exclude raw learner records, private feedback, assessment answers, and organization weaknesses.

## 5. Explicitly Out of Current Scope

The following must not be built or exposed as active current-pilot features:
- Full donor portal.
- Public organization scoring.
- Blockchain or immutable ledger claims.
- Algorithmic CSO reputation ranking.
- Full offline sync engine.
- Open public resource uploads.
- Full forum/community platform.
- Full public or multi-team course authoring tool.
- Reviewer/publisher dashboards.
- Advanced analytics/capability intelligence dashboards.
- Public practical proof gallery.
- Public exposure of CSO weaknesses.
- Donor access to raw learner records.

## 6. Public Experience Specification Updates

### Homepage

The homepage must use the approved public positioning:
- Hero headline: "Learn. Connect. Grow."
- Hero subtitle: “A practical learning hub where local and grassroots CSOs build skills, share experience, and grow their capacity to lead change.”
- Trust chips: Practical courses; Local CSO context; Peer learning vision; Certificate eligible.

The homepage must include:
1. Public header.
2. Hero.
3. Core value cards.
4. Learn → Exchange → Co-create pathway.
5. About the platform.
6. Course showcase.
7. How each learning journey works.
8. Practical tools and resources.
9. Growing CSO learning community.
10. Final CTA.
11. Footer with partner recognition.

Peer learning and co-creation must be future-aware and must not look like active modules unless implemented.

### Public navigation

Public navigation should expose only current safe routes:
- Home.
- Courses.
- Verify Certificate.
- Sign In.
- Register.
- Help, Privacy, Terms, and Accessibility through the footer or policy area.

Public navigation must not expose admin, creator, reviewer, community, donor, capability intelligence, or verifier routes as active pilot links.

### Course catalog

The catalog must present published learner-facing courses only. Course cards should include learner-friendly title, short description, level, duration or lesson count, access state, certificate eligibility, and action. Metadata must not expose internal IDs or draft/review status.

### Course overview pages

Course overview pages must explain who the course is for, what learners will practice, module structure, final assessment, certificate rule, safe-use guidance, and how to start or continue. HRBA course overview content must follow Section 7.

### Certificate verification page

Public verification must be available without sign-in and must show only safe certificate fields. It must not reveal learner email, internal IDs, assessment answers, progress details, portfolio content, or private organization data.

### Sign-in page

The sign-in page must focus on learner access, use clear validation/help text, and avoid exposing staff/admin/demo role options in public registration or sign-in surfaces.

### Registration page

Pilot registration must remain learner-centered, access-code protected where configured, and limited to learner/focal-person options. It must include privacy and safe-data reminders.

### Footer

The footer must include partner recognition and active links to Help, Privacy, Terms, Accessibility, Courses, Verify Certificate, Sign In, and Register where those pages exist. Broken or disabled links must not appear as if active.

### Support/privacy/trust pages

Essential trust pages must exist before public demonstration:
- Help / Support.
- Privacy.
- Terms.
- Accessibility.
- Certificate policy or certificate trust note.

These pages should use plain language, safe-use reminders, and current pilot limitations.

## 7. HRBA Course Overview Correction Specification

The HRBA course overview must not reuse proposal development text.

The HRBA course overview should focus on:
- Rights-holders.
- Duty-bearers.
- Participation.
- Inclusion.
- Accountability.
- Non-discrimination.
- Power and barriers.
- Safe evidence.
- Project-cycle decisions.
- Final assessment and certificate.

Suggested HRBA course promise: "Apply human rights-based thinking to everyday CSO programme work by strengthening participation, inclusion, accountability, dignity, and safe evidence use."

Suggested HRBA learning outcomes:
1. Identify rights-holders, duty-bearers, and supporting actors in practical CSO situations.
2. Recognize barriers to participation, access, information, and accountability.
3. Apply HRBA principles to project design and implementation choices.
4. Use safe, practical analysis without exposing people or sensitive information.
5. Prepare for a final assessment linked to HRBA practice.

## 8. Certificate, Verification, and Trust Rules

Certificates must be issued only after required course completion and an 80% or higher final assessment result, unless a future approved course-specific rule explicitly changes that threshold.

Public verification shows safe fields only:
- Certificate status.
- Learner certificate name.
- Course title.
- Issue date.
- Certificate code.
- Issuing platform.

Public verification must not show:
- Learner email.
- Assessment answers.
- Private progress details.
- Portfolio content.
- Internal IDs.
- Private organization details.

Certificate PDF uses the approved template. Certificate code must remain verifiable.

Required certificate disclaimer: "This certificate confirms that the named learner completed the course requirements and passed the final assessment. It does not replace organizational due diligence, safeguarding review, legal compliance checks, or partnership assessment."

## 9. Non-Extractive Data and Privacy Rules

Rules:
- No internal IDs in public or learner-facing URLs.
- No raw feedback text in monitoring.
- No private portfolio outputs visible to donors.
- No learner email in public certificate verification.
- No unnecessary tracking.
- Aggregate monitoring for pilot.
- Feedback used for course improvement, not individual learner judgment.
- Practical outputs private by default.
- Safe-use reminders wherever learners type or submit.

Safe-use wording: "Do not include names, survivor stories, exact locations, complaints, political details, safeguarding cases, or confidential organizational information."

## 10. HRBA External Course Integration Rules

The Hub is the official entry point.

The HRBA course must be launched through the protected Hub learner flow. Official pilot HRBA deployment should be a new/private pilot deployment, not the old shared public URL.

The HRBA app must require launchToken portal mode for pilot integration. Direct access without valid portal context should show a message such as: "Please access this course through the CSO Learning Hub."

The Hub remains responsible for progress, final assessment result, certificate eligibility, certificate generation, and verification.

The HRBA app must not generate certificates.

## 11. Portfolio and Practical Output Rules

Pilot portfolio outputs are private learner/CSO tools.

They must not be visible to donors, the public, other learners, or unrelated admins.

Optional practical proof is separate from certificates. A certificate confirms completion and final assessment performance; it does not verify organizational capacity or public proof of application.

Verified practical proof is future-stage, consent-based, and safety-reviewed.

Course overview and dashboard surfaces should explain practical outputs clearly, using language such as "private tools for your own CSO practice" rather than public proof or donor evidence.

## 12. Monitoring and MEAL Rules

Pilot monitoring should remain aggregate-only and answer:
- How many registered.
- How many enrolled.
- How many started.
- Where learners stop.
- How many completed.
- How many passed.
- How many certificates issued.
- What feedback patterns appear.
- Which course sections need improvement.

Monitoring must not expose:
- Individual learner weaknesses.
- Private feedback text.
- Assessment answers.
- Portfolio outputs.
- Organization weaknesses.
- Raw learner records to donors.

Monitoring language should support adaptive course improvement, not claims of long-term impact or organizational capacity certification.

## 13. Low-Bandwidth, Mobile, and Accessibility Rules

What can be claimed now:
- Mobile-friendly.
- Lightweight pages.
- Compressed images.
- Text-first alternatives.
- Downloadable resources.
- Resume learning.
- Optional media.

What must not be claimed unless implemented:
- Works fully offline.
- Offline portfolio submission.
- Automatic background sync.

Later-stage offline sync requirements:
- Course version conflict handling.
- Local save queue.
- Retry logic.
- Sync failure recovery.

## 14. Future Architecture Specifications

Each item in this section is a future-stage specification. Do not build in current pilot.

### External Verifier / Partner Verifier

Future-stage specification - do not build in current pilot.

Provide a consent-based role that can verify selected certificate or practical achievement evidence. Access must be purpose-limited, audited, and unable to browse raw learner records.

### Consent-based organization profile

Future-stage specification - do not build in current pilot.

Allow organizations to maintain and optionally share profile information. Visibility must be controlled by the CSO, private by default, and reversible.

### Practical proof / verified achievement

Future-stage specification - do not build in current pilot.

Create an optional pathway for applied outputs to be reviewed after safe consent. This must be separate from certificate completion and must never become required public proof.

### Community resource validation workflow

Future-stage specification - do not build in current pilot.

Allow shared tools to be proposed, reviewed, edited, approved, and retired. No resource should be publicly visible without validation, licensing, attribution, and safety review.

### LALINKage / peer learning

Future-stage specification - do not build in current pilot.

Support moderated exchange and peer learning spaces. Must include community safety, moderation, consent, reporting, and retention rules before launch.

### Course creator/reviewer/publisher workflow

Future-stage specification - do not build in current pilot.

Maintain future architecture for controlled course production, review, and publish governance. Do not expose a full authoring workflow as a public pilot feature.

### Capability intelligence

Future-stage specification - do not build in current pilot.

Use aggregate, privacy-preserving learning patterns to guide support. Must not rank CSOs, expose weaknesses, or become a donor surveillance dashboard.

### AI-assisted authoring governance

Future-stage specification - do not build in current pilot.

Define how AI may support drafting, localization, adaptation, and QA. Requires human review, source control, safety rules, and no use of private learner/CSO records without explicit governance.

## 15. Implementation Roadmap

Stage 1 - Specification update and backlog finalization.

Stage 2 - Public content and UX polish.

Stage 3 - HRBA course overview correction.

Stage 4 - Protected HRBA deployment and E2E blocker closure.

Stage 5 - Support/privacy/trust pages.

Stage 6 - Certificate wording and verification safety polish.

Stage 7 - Private portfolio/practical-output messaging.

Stage 8 - Mobile/accessibility/low-bandwidth QA pass.

Stage 9 - Final pilot acceptance QA.

Stage 10 - MVP pilot freeze.

Stage 11 - Post-pilot roadmap for community, organization profile, practical proof, external verifier, and capability intelligence.

## 16. Pilot Acceptance Criteria

The pilot is acceptable only when:
- Public homepage uses approved positioning.
- Public nav does not show admin/creator/reviewer/community features as active if not built.
- HRBA course overview content is correct.
- HRBA course launches through Hub with launchToken.
- No raw internal IDs in learner-facing URLs.
- Learner registration works with pilot access code.
- Learner sign-in works.
- Learner dashboard and My Courses are clear.
- Progress tracking works.
- Final assessment callback works.
- Certificate issued only after 80%+.
- Certificate PDF downloads.
- Public certificate verification works.
- Feedback form works.
- Pilot monitoring works and is aggregate-only.
- Support/privacy/trust pages exist.
- No sensitive learner/CSO data is publicly exposed.
