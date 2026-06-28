# PRODUCT_SPEC.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Product Specification

## 1. Document purpose

This file defines the product intent, scope, boundaries, users, core workflows, and non-negotiable product rules for **Phase 1** of the DEC / WHH CSF+ CSO Learning Hub.

This is a controlling product specification for Codex and any developer or AI coding agent working in the repository.

Codex must implement the system according to this specification and must not infer, expand, or redesign the product beyond what is stated here unless a later approved change note explicitly modifies this file.

---

## 2. Product name

**CSO Learning Hub — Phase 1**

Recommended internal naming:

- Product: `CSO Learning Hub`
- Release: `Phase 1`
- Build type: `E-learning MVP with Learning Hub foundation`

---

## 3. Product definition

Phase 1 shall deliver a working, accessible, mobile-first digital learning platform for local and grassroots CSOs.

The platform shall allow DEC/WHH to:

1. convert existing training materials into structured digital courses;
2. create interactive multimedia course content using a professional block-based authoring studio;
3. publish high-quality participant-facing courses;
4. allow CSO participants to access, complete, and revisit courses;
5. provide video lessons, text lessons, downloadable resources, case studies, quizzes, flashcards, branching scenarios, and other interactive learning blocks;
6. issue automated certificates after successful completion and final test pass;
7. monitor participation, progress, completion, quiz performance, certificates, and feedback;
8. pilot the system with selected CSOs and refine it based on user feedback.

Phase 1 shall be designed as the first operational release of the wider CSO Learning Hub, but it shall not attempt to build the full Phase 2 and Phase 3 ecosystem.

---

## 4. Strategic positioning

The system is not a generic LMS and not a simple file repository.

The system is a **CSO capacity-development learning platform** that combines:

- course creation;
- participant learning;
- assessment;
- certification;
- organization and cohort tracking;
- monitoring;
- future-ready architecture for later knowledge management, collaboration, co-creation, diagnosis, capacity mapping, and practical evidence features.

The core strategic position is:

> Build a useful e-learning MVP now, but architect it as the foundation of the full CSO Learning Hub.

---

## 5. Phase 1 contractual alignment

Phase 1 shall satisfy the agreed digital learning platform scope, including:

1. platform design and development;
2. technical consultation with DEC/WHH experts;
3. detailed platform structure and technical architecture;
4. mobile-first responsive design;
5. WCAG 2.1 AA accessibility alignment;
6. video player functionality;
7. document download functionality;
8. quizzes;
9. automated certificate engine;
10. digitization of existing training materials into interactive digital formats;
11. pilot testing with selected CSOs and DEC team;
12. refinements based on pilot feedback;
13. protection of user profile and progress data;
14. ethical, safeguarding-sensitive, and confidentiality-sensitive implementation.

---

## 6. Phase 1 product scope

## 6.1 Must build in Phase 1

The following are in scope and must be implemented:

1. public/participant-facing learning site;
2. participant registration and authentication;
3. participant dashboard;
4. course catalogue;
5. course detail page;
6. course player;
7. polished learner-facing course template;
8. admin portal;
9. course creator portal;
10. professional block-based Course Builder / Build Studio;
11. course preview;
12. lightweight review and publish workflow;
13. quizzes/final tests;
14. automated certificate engine;
15. downloadable resources;
16. organization management;
17. cohort management;
18. basic user management;
19. basic monitoring dashboard;
20. participant feedback;
21. audit/activity log;
22. accessibility and mobile-first implementation;
23. pilot testing support.

## 6.2 Must architect in Phase 1, but not fully build

The following must be supported by architecture and data model decisions, but they are not full Phase 1 user-facing modules:

1. capacity taxonomy foundation;
2. course-to-capacity-area linkage;
3. learning outcome metadata;
4. organization/cohort structure;
5. extensible role model;
6. course versioning foundation;
7. review/publish status model;
8. future practical proof/badge compatibility;
9. future diagnosis/capacity map compatibility;
10. future knowledge management/collaboration compatibility.

## 6.3 Explicitly out of Phase 1

The following shall not be built as full modules in Phase 1:

1. full CSO capacity diagnosis workflow;
2. full capacity map;
3. full action map;
4. advanced storyboard workflow outside the course builder;
5. peer-to-peer social collaboration;
6. community of practice spaces;
7. knowledge repository;
8. co-creation workspace;
9. sub-grant/project workspace;
10. practical proof verification workflow;
11. digital badge verification workflow;
12. AI authoring assistant;
13. adaptive recommendation engine;
14. advanced impact/outcome dashboard;
15. donor CRM or partner CRM features.

---

## 7. Product principles

## 7.1 Contract-first, future-ready

Every Phase 1 feature must either:

1. satisfy a Phase 1 delivery obligation; or
2. establish a necessary foundation for later CSO Learning Hub phases.

## 7.2 Clean content creation first

The Course Builder must be optimized for course creation, not governance administration.

Course creators must feel that they are building a clean, modern learning experience, not filling a compliance database.

## 7.3 Governance in the background

Quality checks shall protect content quality but must not crowd the Build Studio.

Diagnosis panels, capacity map panels, monitoring charts, CRM-style records, donor compliance panels, and heavy approval history must not appear in the main Build Studio canvas.

## 7.4 High-quality learner experience

Published courses must automatically render into a polished participant-facing template comparable in quality to strong modern LMS experiences.

The learner-facing course must not look like a PDF repository or a basic upload page.

## 7.5 CSOs are organizational actors

The platform must recognize that participants belong to CSO organizations and/or cohorts.

The system must not treat all learners as isolated individuals only.

## 7.6 Accessibility is mandatory

Participant-facing and admin/creator-facing core flows must be mobile-responsive and aligned with WCAG 2.1 AA expectations.

## 7.7 No drift

Codex must not introduce unrelated features, workflows, dashboards, or future-phase modules beyond this product specification.

---

## 8. Primary user groups

## 8.1 Super Admin

System-level administrator with full authority over platform configuration, users, roles, organizations, courses, publishing, certificates, monitoring, and audit/activity visibility.

## 8.2 Platform Admin

Operational administrator who manages day-to-day platform operations, including users, CSOs, cohorts, courses, publishing, certificates, and monitoring.

## 8.3 Course Creator

User responsible for creating digital courses using the Course Builder.

The Course Creator can:

- create draft courses;
- define course metadata;
- add learning outcomes;
- create modules and lessons;
- add and configure content blocks;
- build quizzes/final tests;
- preview the participant-facing course;
- submit a course for review/publishing.

## 8.4 Course Reviewer / QA Reviewer

User responsible for checking course quality before publication.

In Phase 1 this may be a lightweight role or combined with Platform Admin, but the system must support review/publish states.

## 8.5 Facilitator / Cohort Lead

User who may support assigned cohorts or participant groups.

In Phase 1 this role may have limited or view-only functionality.

## 8.6 CSO Organization Focal Person

Representative linked to a CSO organization.

In Phase 1, this role may be minimal or deferred as a full dashboard, but the data model must support participants being linked to organizations.

## 8.7 Participant

CSO learner/participant who accesses courses, completes lessons, takes quizzes, downloads resources, submits feedback, and receives certificates.

## 8.8 M&E / Programme Viewer

User who can view aggregated monitoring data and progress information.

In Phase 1 this role may be read-only.

---

## 9. Core product modules

## 9.1 Participant-facing learning site

Required functions:

1. landing page;
2. course catalogue;
3. course detail page;
4. participant registration/sign-in;
5. participant dashboard;
6. course player;
7. course progress tracking;
8. downloadable resources;
9. interactive course blocks;
10. quiz/final test;
11. certificate access;
12. feedback form.

## 9.2 Admin portal

Required functions:

1. admin dashboard;
2. user management;
3. CSO organization management;
4. cohort management;
5. course management;
6. review/publish queue;
7. certificate settings;
8. capacity areas/reference data;
9. monitoring dashboard;
10. audit/activity log;
11. platform settings.

## 9.3 Course creator portal

Required functions:

1. My Courses;
2. Course Setup;
3. Course Metadata and Capacity Linkage;
4. Learning Outcomes;
5. Course Builder / Build Studio;
6. Quiz / Final Test Setup;
7. Resources;
8. Preview;
9. Submit for Review / Publish Readiness;
10. Feedback / Revision View.

## 9.4 Course Builder / Build Studio

The Course Builder is a must-build Phase 1 feature.

It shall provide a clean three-column professional authoring workspace:

1. left panel: Block Library and Course Outline;
2. center panel: Course Canvas;
3. right panel: selected Block Configuration.

The Course Builder must support immediate learner preview and automatic rendering into the published learner template.

---

## 10. Build Studio product requirements

## 10.1 Core purpose

The Build Studio shall allow course creators to assemble interactive, multimedia, learner-ready digital courses.

It must feel like a creative content production workspace, not a governance or CRM interface.

## 10.2 Required block types

The Phase 1 block library shall include:

1. Text / Reading block;
2. Video lesson block;
3. Audio block, if feasible;
4. Image / visual block;
5. Downloadable resource block;
6. External link block;
7. Case study block;
8. Reflection prompt block;
9. Key message / summary block;
10. Accordion block;
11. Flashcard block;
12. Button / call-to-action block;
13. Knowledge check block;
14. Multiple choice quiz question block;
15. True/false question block;
16. Short answer prompt block, optional for self-reflection only;
17. Branching scenario block;
18. Practical activity prompt block.

## 10.3 Authoring workspace rules

The Build Studio shall allow creators to:

1. create modules;
2. create lessons;
3. add blocks to lessons;
4. configure selected blocks;
5. reorder blocks;
6. duplicate blocks;
7. delete blocks;
8. collapse/expand blocks;
9. preview individual blocks;
10. preview selected lesson;
11. preview full course;
12. switch between desktop and mobile preview;
13. save drafts.

## 10.4 Build Studio content rule

The center canvas must show only content-building elements and lightweight authoring controls.

The center canvas must not show:

1. large governance panels;
2. diagnosis panels;
3. capacity map panels;
4. monitoring charts;
5. CRM records;
6. donor compliance sections;
7. heavy review history;
8. unrelated process cards.

## 10.5 Lightweight readiness checks

The Build Studio may show small readiness indicators for:

1. missing course title;
2. lesson without blocks;
3. video without transcript;
4. quiz question without correct answer;
5. resource without label;
6. final test not configured;
7. certificate rule missing;
8. unpublished changes.

These checks must appear as small status chips, warnings, or drawers, not as dominant panels.

---

## 11. Learner-facing course template

## 11.1 Purpose

Published courses shall automatically render into a clean participant-facing course template.

## 11.2 Required learner template features

The participant-facing course shall include:

1. course title;
2. course description;
3. progress indicator;
4. module/lesson navigation;
5. clean lesson content area;
6. video player;
7. text and case-study display;
8. interactive blocks such as flashcards, accordions, branching scenarios, and knowledge checks;
9. downloadable resources;
10. final quiz/test;
11. completion status;
12. certificate access after successful completion;
13. feedback link/form;
14. responsive mobile layout;
15. accessible typography, color contrast, and keyboard navigation.

## 11.3 Quality standard

The learner-facing template must look modern, calm, credible, and comparable in quality to strong LMS platforms.

It must not look like a basic file repository.

---

## 12. Core workflows

## 12.1 Admin workflow

1. Admin signs in.
2. Admin creates/manages users.
3. Admin creates/manages CSO organizations.
4. Admin creates/manages cohorts.
5. Admin manages capacity areas/reference data.
6. Admin reviews courses.
7. Admin publishes approved courses.
8. Admin monitors participation, completion, certificates, and feedback.
9. Admin reviews audit/activity log.

## 12.2 Course creator workflow

1. Course Creator signs in.
2. Course Creator opens My Courses.
3. Course Creator creates a new course.
4. Course Creator enters course setup information.
5. Course Creator adds capacity area, target audience, and learning outcomes.
6. Course Creator builds modules and lessons in the Build Studio.
7. Course Creator adds/configures content blocks.
8. Course Creator builds quiz/final test.
9. Course Creator previews the participant-facing course.
10. Course Creator submits the course for review or publish readiness.

## 12.3 Participant workflow

1. Participant registers or signs in.
2. Participant opens dashboard.
3. Participant views available or assigned courses.
4. Participant opens course.
5. Participant completes lessons and interactive blocks.
6. Participant downloads resources.
7. Participant takes quiz/final test.
8. Participant receives certificate if completion/pass rules are met.
9. Participant submits feedback.

## 12.4 Review/publish workflow

1. Course starts as Draft.
2. Course Creator marks course Ready for Review.
3. Reviewer/Admin reviews course.
4. Reviewer/Admin either returns the course for revision or approves it.
5. Admin publishes approved course.
6. Published course becomes visible to participants.

---

## 13. Course lifecycle states

The system shall support:

1. Draft;
2. Ready for Review;
3. Returned for Revision;
4. Approved;
5. Published;
6. Unpublished / Archived.

Rules:

1. New courses start as Draft.
2. Course Creators can edit Draft and Returned for Revision courses.
3. Participants cannot access unpublished courses.
4. Only Admins can publish courses.
5. Published courses must preserve participant progress.
6. Changes to published courses should be version-aware or handled as unpublished draft changes, depending on implementation feasibility.

---

## 14. Certificate rules

A certificate shall be issued only when:

1. the course is certificate eligible;
2. required lessons are completed;
3. the final test is completed;
4. the final test score is at or above the configured pass threshold.

Recommended default pass threshold: **80%**.

Certificate must include:

1. participant name;
2. course title;
3. issuing organization;
4. completion date;
5. certificate ID or verification code;
6. optional signatory;
7. downloadable PDF format.

---

## 15. Monitoring requirements

The system shall provide basic monitoring for:

1. total registered participants;
2. active participants;
3. total CSO organizations;
4. total enrollments;
5. completion rate;
6. final test pass rate;
7. certificates issued;
8. participant feedback summary;
9. course-level progress;
10. cohort-level progress;
11. organization-level participation.

Dashboard filters should include:

1. course;
2. cohort;
3. organization;
4. region, if available;
5. date range;
6. course status.

---

## 16. Acceptance criteria

## 16.1 Participant acceptance

A participant can:

1. register or sign in;
2. view available or assigned courses;
3. open a course;
4. complete lessons;
5. watch video content;
6. download resources;
7. complete interactive blocks;
8. take the final test;
9. receive a certificate after passing;
10. download the certificate;
11. submit course feedback.

## 16.2 Course creator acceptance

A Course Creator can:

1. create a draft course;
2. add course metadata;
3. add capacity area and learning outcomes;
4. create modules and lessons;
5. add and configure required block types;
6. preview lessons and full course;
7. build quiz/final test;
8. submit the course for review/publish readiness.

## 16.3 Admin acceptance

An Admin can:

1. manage users;
2. manage organizations;
3. manage cohorts;
4. manage capacity areas;
5. view courses by status;
6. review courses;
7. publish courses;
8. view monitoring data;
9. view certificate records;
10. view audit/activity logs.

## 16.4 Certificate acceptance

The system does not issue a certificate unless the participant completes required lessons and passes the final test at or above the configured threshold.

## 16.5 Build Studio acceptance

The Build Studio shows:

1. left block library/course outline;
2. center course canvas;
3. right selected block configuration panel;
4. immediate learner preview;
5. no large governance, diagnosis, monitoring, or CRM panels.

---

## 17. Non-functional requirements

The system shall meet the following non-functional requirements:

1. mobile-first responsive design;
2. WCAG 2.1 AA accessibility alignment;
3. role-based access control;
4. secure authentication;
5. protected admin and creator routes;
6. protection of user profile and progress data;
7. audit logging for critical actions;
8. maintainable code structure;
9. reusable UI components;
10. clear route organization;
11. safe handling of uploads/resources;
12. low-bandwidth-conscious participant experience.

---

## 18. Codex implementation rules

Codex must follow these rules:

1. Read this product specification before implementation.
2. Do not add Phase 2/3 modules unless explicitly requested.
3. Do not turn the Build Studio into a governance or CRM screen.
4. Do not remove course metadata, capacity area, organization, cohort, or certificate foundations.
5. Do not create a simple file-upload LMS that lacks authoring, preview, progress, certificate, and monitoring logic.
6. Implement work in small slices.
7. Produce an evidence pack after each slice.
8. Report any ambiguity before making architectural changes.
9. Use deterministic names for routes, models, and statuses.
10. Preserve the principle: clean content creation first, future-ready architecture in the background.

---

## 19. Next file dependencies

This product specification must be supported by the following repo-ready files:

1. `ROUTE_MAP.md`
2. `DATA_MODEL.md`
3. `BUILD_STUDIO_SPEC.md`
4. `LEARNER_TEMPLATE_SPEC.md`
5. `ADMIN_PORTAL_SPEC.md`
6. `MONITORING_SPEC.md`
7. `ACCEPTANCE_TESTS.md`
8. `CODEX_IMPLEMENTATION_PLAN.md`
9. `EVIDENCE_PACK_TEMPLATE.md`
10. `SEED_DATA_PLAN.md`

---

## 20. Final product statement

Phase 1 shall deliver a working, polished, accessible e-learning platform with a strong block-based course authoring studio and a high-quality participant learning experience.

It shall also establish the minimum architecture needed for the broader CSO Learning Hub.

It shall not become a fragmented upload-based LMS.

It shall not overbuild Phase 2 or Phase 3.

The Build Studio shall remain clean and focused on content creation, with governance and future capacity-development workflows handled lightly, separately, or in later phases.
