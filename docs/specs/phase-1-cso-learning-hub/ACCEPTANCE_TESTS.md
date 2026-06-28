# ACCEPTANCE_TESTS.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Acceptance Tests

## 1. Document purpose

This file defines the deterministic Phase 1 acceptance tests for the CSO Learning Hub.

Codex must use this file as the controlling verification checklist for implementation, QA, demo readiness, and evidence packs.

Every implementation slice must be checked against relevant acceptance tests in this document.

Codex must not mark a slice complete unless the relevant acceptance criteria are satisfied or the gap is clearly reported in the evidence pack.

---

## 2. Acceptance testing principles

## 2.1 Test end-to-end user value

Acceptance tests must verify real user journeys, not only isolated components.

## 2.2 Test role boundaries

Acceptance tests must confirm that each role can access only the correct routes and actions.

## 2.3 Test Phase 1 scope

Acceptance tests must confirm that Phase 1 features work and that Phase 2/3 modules are not accidentally implemented or exposed as active modules.

## 2.4 Test clean Build Studio UX

The Build Studio must remain a clean course authoring tool, not a governance, CRM, diagnosis, or monitoring screen.

## 2.5 Test learner quality

Published courses must render into a polished, participant-facing learner template.

## 2.6 Test certificate rules

Certificates must only be issued when completion and pass conditions are met.

## 2.7 Test accessibility and mobile readiness

Core participant, creator, and admin workflows must be usable on mobile and aligned with basic WCAG 2.1 AA expectations.

---

# 3. Test user accounts

Use seed/demo accounts or equivalent test users.

## 3.1 Required roles

At minimum, prepare test accounts for:

1. Super Admin
2. Platform Admin
3. Course Creator
4. Course Reviewer
5. M&E / Programme Viewer
6. Participant
7. Participant linked to CSO organization
8. Participant without enrollment

## 3.2 Required sample data

At minimum, prepare:

1. two CSO organizations;
2. one cohort;
3. one draft course;
4. one course ready for review;
5. one published course;
6. one course with multiple modules and lessons;
7. one course with final test;
8. one participant enrollment in progress;
9. one participant completed course;
10. one issued certificate;
11. sample feedback records;
12. sample capacity areas.

---

# 4. Smoke tests

## 4.1 Application loads

### Steps

1. Open the application home page.
2. Open public course catalogue.
3. Open sign-in page.

### Expected result

1. Home page loads without error.
2. Course catalogue loads without error.
3. Sign-in page loads without error.
4. No broken layout or missing critical assets.

---

## 4.2 Authenticated route protection

### Steps

1. Sign out.
2. Try to open `/learn`.
3. Try to open `/creator`.
4. Try to open `/admin`.

### Expected result

1. User is redirected to sign-in or sees unauthorized message.
2. Protected data is not exposed.

---

## 4.3 Role-aware route access

### Steps

1. Sign in as Participant.
2. Try to open `/admin`.
3. Try to open `/creator`.
4. Sign in as Course Creator.
5. Try to open `/admin`.
6. Sign in as Admin.
7. Open `/admin`.

### Expected result

1. Participant cannot access admin or creator routes.
2. Course Creator cannot access admin routes unless also Admin.
3. Admin can access admin routes.
4. Unauthorized access shows clear safe message.

---

# 5. Public site acceptance tests

## 5.1 Home page

### Steps

1. Open `/`.

### Expected result

Home page shows:

1. platform name/purpose;
2. clear call to action to browse courses;
3. sign-in/register entry;
4. clean, accessible, responsive layout;
5. no admin or creator controls.

---

## 5.2 Course catalogue

### Steps

1. Open `/courses`.

### Expected result

Course catalogue shows:

1. only published courses;
2. course cards;
3. search/filter controls if implemented;
4. course title, description, capacity area, level, duration, certificate status;
5. empty state if no published courses exist.

### Must not show

1. draft courses;
2. internal review status;
3. unpublished courses;
4. creator/admin buttons.

---

## 5.3 Course detail page

### Steps

1. Open `/courses/[courseSlug]` for a published course.

### Expected result

Course detail page shows:

1. course title;
2. course overview;
3. capacity area;
4. target audience;
5. estimated duration;
6. learning outcomes;
7. module outline;
8. certificate information;
9. start/enroll/sign-in action.

### Must not show

1. edit controls;
2. admin controls;
3. draft status;
4. internal readiness checks.

---

# 6. Participant acceptance tests

## 6.1 Participant registration/sign-in

### Steps

1. Register or sign in as participant.
2. Open participant dashboard.

### Expected result

1. Participant can authenticate successfully.
2. Participant lands on `/learn` or participant dashboard.
3. Participant role is applied correctly.

---

## 6.2 Participant dashboard

### Steps

1. Sign in as Participant.
2. Open `/learn`.

### Expected result

Dashboard shows:

1. participant greeting;
2. active/enrolled courses;
3. available or assigned courses;
4. progress status;
5. completed courses, if any;
6. certificates, if any;
7. clean empty state if no courses.

---

## 6.3 My Courses

### Steps

1. Open `/learn/my-courses`.

### Expected result

Page shows:

1. enrolled courses;
2. progress percentage;
3. status: not started, in progress, completed;
4. continue/start action;
5. certificate status if applicable.

---

## 6.4 Course player loads published course

### Steps

1. Sign in as Participant with access to a published course.
2. Open `/learn/courses/[courseSlug]`.

### Expected result

Course player shows:

1. course title;
2. module/lesson navigation;
3. current lesson;
4. progress indicator;
5. lesson content;
6. previous/next controls;
7. final test link when eligible.

### Must not show

1. Build Studio controls;
2. block configuration panel;
3. admin controls;
4. review comments;
5. governance panels.

---

## 6.5 Lesson progress

### Steps

1. Open a lesson.
2. Complete required learning activity or click mark complete.
3. Move to next lesson.
4. Return to dashboard.

### Expected result

1. Lesson is marked complete.
2. Course progress updates.
3. Continue learning resumes from correct place where feasible.

---

## 6.6 Resource download

### Steps

1. Open a lesson with a resource block.
2. Click download/open resource.

### Expected result

1. Resource card is visible.
2. Download/open action works.
3. Resource label and description are clear.

---

## 6.7 Interactive blocks render

### Steps

Open a course lesson containing:

1. text block;
2. video block;
3. image block;
4. resource block;
5. case study block;
6. accordion block;
7. flashcard block;
8. knowledge check block;
9. branching scenario block;
10. practical activity prompt block.

### Expected result

Each block renders correctly and is usable by participant.

---

## 6.8 Knowledge check

### Steps

1. Open knowledge check block.
2. Select answer.
3. Submit/check answer.

### Expected result

1. Feedback appears.
2. Correct/incorrect state is clear.
3. Retry behavior works if enabled.
4. Knowledge check does not automatically issue certificate.

---

## 6.9 Branching scenario

### Steps

1. Open branching scenario block.
2. Select a decision option.

### Expected result

1. Feedback for selected decision appears.
2. Learning point appears.
3. Reset/retry works if implemented.

---

## 6.10 Final test pass

### Steps

1. Complete required lessons.
2. Open final test.
3. Submit answers with passing score.

### Expected result

1. Score is calculated.
2. Pass result appears.
3. Course completion updates if all requirements are met.
4. Certificate becomes available.

---

## 6.11 Final test fail

### Steps

1. Submit final test with score below pass threshold.

### Expected result

1. Fail result appears.
2. Certificate is not issued.
3. Retake option appears only if retakes are allowed.
4. Participant receives clear next-step message.

---

## 6.12 Certificate access

### Steps

1. Complete certificate-eligible course and pass final test.
2. Open `/learn/certificates`.
3. Open certificate detail.

### Expected result

1. Certificate appears in list.
2. Certificate detail shows participant name, course title, issue date, certificate code.
3. Download PDF action is available if implemented.

---

## 6.13 Certificate locked state

### Steps

1. Open certificate area for incomplete course.

### Expected result

1. Certificate is not available.
2. Message explains that required lessons and final test must be completed.

---

## 6.14 Course feedback

### Steps

1. Complete or access course feedback form.
2. Submit rating and comment.

### Expected result

1. Feedback submits successfully.
2. Confirmation message appears.
3. Feedback appears in admin monitoring summary.

---

# 7. Course Creator acceptance tests

## 7.1 Creator dashboard

### Steps

1. Sign in as Course Creator.
2. Open `/creator` or `/creator/courses`.

### Expected result

Creator sees:

1. assigned/created courses;
2. course status;
3. create new course button;
4. filters/search if implemented;
5. no admin-only controls unless also Admin.

---

## 7.2 Create draft course

### Steps

1. Click Create New Course.
2. Enter required course setup data.
3. Save/create.

### Expected result

1. New course is created.
2. Course status is Draft.
3. Creator is assigned.
4. Creator is taken to setup or build workflow.

---

## 7.3 Course setup

### Steps

1. Open course setup.
2. Edit title, description, audience, language, level, duration, certificate setting.
3. Save.

### Expected result

1. Data saves correctly.
2. Course remains draft.
3. Last saved status updates.

---

## 7.4 Metadata and capacity linkage

### Steps

1. Open metadata page.
2. Add capacity area, target CSO profile, capacity gap addressed, intended practice improvement.
3. Save.

### Expected result

1. Metadata saves correctly.
2. Course has capacity linkage.
3. Page does not show full diagnosis/capacity map/action map workflow.

---

## 7.5 Learning outcomes

### Steps

1. Open learning outcomes page.
2. Add at least one learning outcome.
3. Edit and save.
4. Delete or reorder if supported.

### Expected result

1. Outcomes save correctly.
2. Outcomes are visible in course detail/preview where appropriate.
3. At least one outcome is required before publication.

---

# 8. Build Studio acceptance tests

## 8.1 Build Studio layout

### Steps

1. Open `/creator/courses/[courseId]/build`.

### Expected result

Build Studio shows:

1. left Block Library / Course Outline panel;
2. center Course Canvas;
3. right Block Configuration panel;
4. compact header with course title, status, save, preview action.

### Must not show

1. large governance panels;
2. diagnosis panels;
3. capacity map panels;
4. monitoring charts;
5. CRM sections;
6. donor compliance widgets.

---

## 8.2 Course outline create module and lesson

### Steps

1. Add a module.
2. Add a lesson under that module.
3. Select the lesson.

### Expected result

1. Module appears in outline.
2. Lesson appears under module.
3. Selected lesson opens in canvas.
4. Empty lesson state is shown.

---

## 8.3 Add text block

### Steps

1. Select lesson.
2. Add Text / Reading block.
3. Configure block title and body.
4. Save.

### Expected result

1. Text block appears in canvas.
2. Right panel shows text configuration.
3. Saved block appears in preview.

---

## 8.4 Add video block

### Steps

1. Add Video block.
2. Add title and video URL/upload reference.
3. Add transcript if available.
4. Save.

### Expected result

1. Video block appears in canvas.
2. Missing transcript warning appears if transcript missing.
3. Video renders in preview.

---

## 8.5 Add resource block

### Steps

1. Add Downloadable Resource block.
2. Attach/link resource.
3. Add label and description.
4. Save.

### Expected result

1. Resource block appears in canvas.
2. Resource card renders in preview.
3. Download action works or is clearly represented in demo mode.

---

## 8.6 Add interactive blocks

### Steps

Add and configure:

1. accordion;
2. flashcard;
3. knowledge check;
4. branching scenario;
5. reflection prompt;
6. practical activity prompt.

### Expected result

1. Each block appears in canvas.
2. Right panel shows correct configuration fields.
3. Each block renders in preview.
4. Interactive behavior works where applicable.

---

## 8.7 Reorder blocks

### Steps

1. Add at least three blocks.
2. Move one block up/down or drag to reorder.
3. Save.
4. Reload page.

### Expected result

1. New order is preserved.
2. Preview uses updated order.

---

## 8.8 Duplicate block

### Steps

1. Select a block.
2. Click duplicate.
3. Save.

### Expected result

1. Duplicate appears after original.
2. Duplicated content is copied.
3. Duplicate can be edited independently.

---

## 8.9 Delete block

### Steps

1. Select a block with content.
2. Click delete.
3. Confirm deletion.

### Expected result

1. Confirmation appears.
2. Block is removed after confirmation.
3. Preview no longer shows the deleted block.

---

## 8.10 Block configuration panel behavior

### Steps

1. Select different block types in canvas.

### Expected result

1. Right panel changes based on selected block type.
2. Right panel only shows configuration for selected block.
3. Right panel does not show monitoring, governance, diagnosis, or CRM content.

---

## 8.11 Build Studio preview

### Steps

1. Click preview selected lesson.
2. Click full course preview.
3. Switch to mobile preview.

### Expected result

1. Preview renders learner-facing template.
2. Preview shows content from actual block model.
3. Preview is labeled as preview mode.
4. Mobile preview is usable.

---

## 8.12 Readiness checks

### Steps

1. Create course with missing required data.
2. Open readiness/submit view or warning drawer.

### Expected result

Warnings/errors appear for:

1. missing course title;
2. missing capacity area;
3. missing learning outcome;
4. lesson without blocks;
5. video without transcript;
6. image without alt text;
7. final test missing for certificate course;
8. quiz question without correct answer.

Warnings are lightweight and do not crowd the canvas.

---

# 9. Quiz and certificate acceptance tests

## 9.1 Create final test

### Steps

1. Open quiz/final test setup.
2. Add multiple choice question.
3. Add true/false question.
4. Mark correct answers.
5. Set pass threshold.
6. Save.

### Expected result

1. Final test saves.
2. Questions appear in preview/final test route.
3. Correct answers are stored.
4. Pass threshold is applied.

---

## 9.2 Missing correct answer validation

### Steps

1. Create quiz question without correct answer.
2. Try to submit course for review/publish.

### Expected result

1. Readiness error appears.
2. Course cannot be published until corrected.

---

## 9.3 Certificate not issued before pass

### Steps

1. Enroll participant.
2. Complete lessons but fail final test.

### Expected result

1. Enrollment may show lesson completion.
2. Certificate is not issued.
3. Certificate locked state is shown.

---

## 9.4 Certificate issued after pass

### Steps

1. Complete lessons.
2. Pass final test at or above threshold.

### Expected result

1. Enrollment status becomes completed.
2. Certificate record is created.
3. Certificate appears in participant certificate list.
4. Certificate appears in admin certificate records.

---

## 9.5 Duplicate certificate prevention

### Steps

1. Complete course and receive certificate.
2. Reopen certificate flow or retake final test if allowed.

### Expected result

1. System does not issue duplicate certificate for same user/course version unless explicit regeneration is implemented.
2. Existing certificate remains accessible.

---

# 10. Review and publish acceptance tests

## 10.1 Submit course for review

### Steps

1. Sign in as Course Creator.
2. Complete required course setup, outcomes, content, and final test.
3. Submit course for review.

### Expected result

1. Course status changes to Ready for Review.
2. Course appears in admin/reviewer queue.
3. Status change is logged.

---

## 10.2 Return course for revision

### Steps

1. Sign in as Reviewer/Admin.
2. Open course in review queue.
3. Return for revision with reason.

### Expected result

1. Course status changes to Returned for Revision.
2. Reason is saved.
3. Creator can see feedback/revision note.
4. Status change is logged.

---

## 10.3 Approve course

### Steps

1. Reviewer/Admin opens ready course.
2. Approves course.

### Expected result

1. Course status changes to Approved.
2. Course is not necessarily public until published.
3. Status change is logged.

---

## 10.4 Publish course

### Steps

1. Sign in as Admin.
2. Open Approved course.
3. Publish course.

### Expected result

1. Course status changes to Published.
2. Course appears in public/participant course catalogue according to visibility.
3. Participant can access the course.
4. Publish action is logged.

---

## 10.5 Participant cannot see unpublished course

### Steps

1. Sign in as Participant.
2. Try to access draft/approved-but-unpublished course URL.

### Expected result

1. Course is not accessible.
2. Safe unavailable message or not-found state appears.
3. Internal status is not exposed.

---

# 11. Admin acceptance tests

## 11.1 Admin dashboard

### Steps

1. Sign in as Admin.
2. Open `/admin`.

### Expected result

Dashboard shows summary cards for users, organizations, cohorts, courses, enrollments, completions, certificates, and review queue.

---

## 11.2 User management

### Steps

1. Open `/admin/users`.
2. Create new user.
3. Assign role.
4. Edit user.
5. Deactivate user.

### Expected result

1. User appears in list.
2. Role assignment works.
3. Deactivated user cannot sign in.
4. Changes are logged.

---

## 11.3 Organization management

### Steps

1. Open `/admin/organizations`.
2. Create organization.
3. Link participant.
4. Assign to cohort.

### Expected result

1. Organization appears in list.
2. Participant is linked.
3. Cohort link is saved.
4. Organization appears in monitoring filters.

---

## 11.4 Cohort management

### Steps

1. Open `/admin/cohorts`.
2. Create cohort.
3. Assign organization.
4. Assign participant/course if implemented.

### Expected result

1. Cohort appears in list.
2. Assignments are saved.
3. Cohort appears in monitoring filters.

---

## 11.5 Course management

### Steps

1. Open `/admin/courses`.
2. Filter by status.
3. Open course detail.
4. Preview course.
5. Publish/unpublish if authorized.

### Expected result

1. Course list filters work.
2. Course detail shows course summary.
3. Preview opens learner rendering.
4. Status actions obey permissions.
5. Actions are logged.

---

## 11.6 Reference data

### Steps

1. Open `/admin/reference-data`.
2. Add/edit capacity area.
3. Deactivate a value used by a course, if supported.

### Expected result

1. Reference data saves.
2. Capacity areas are available in course setup.
3. Used values are not hard-deleted.

---

## 11.7 Audit log

### Steps

1. Perform user/course/publish action.
2. Open `/admin/audit-log`.

### Expected result

1. Action appears in audit log.
2. Log includes actor, action type, entity, timestamp.
3. No sensitive password/token data is shown.

---

# 12. Monitoring acceptance tests

## 12.1 Monitoring dashboard access

### Steps

1. Sign in as Admin.
2. Open `/admin/monitoring`.
3. Sign in as M&E Viewer.
4. Open `/admin/monitoring`.
5. Sign in as Participant.
6. Try to open `/admin/monitoring`.

### Expected result

1. Admin can access.
2. M&E Viewer can access if authorized.
3. Participant cannot access.

---

## 12.2 Monitoring KPI cards

### Steps

1. Open monitoring dashboard with seed data.

### Expected result

Dashboard shows:

1. registered participants;
2. active participants;
3. CSO organizations;
4. cohorts;
5. published courses;
6. enrollments;
7. completion rate;
8. final test pass rate;
9. certificates issued;
10. feedback rating.

---

## 12.3 Monitoring filters

### Steps

1. Filter by course.
2. Filter by cohort.
3. Filter by organization.
4. Filter by date range.

### Expected result

1. KPI cards update.
2. Tables update.
3. Empty state appears when no matching data exists.
4. Clear filters works if implemented.

---

## 12.4 Course progress table

### Steps

1. Open monitoring dashboard.
2. Review course progress table.

### Expected result

Table shows course title, capacity area, enrollments, active participants, completion rate, pass rate, certificates, and feedback rating.

---

## 12.5 Cohort and organization progress

### Steps

1. Review cohort progress table.
2. Review organization participation table.

### Expected result

1. Cohort progress aggregates correctly.
2. Organization participation aggregates correctly.
3. Participant-level details are not overexposed to unauthorized roles.

---

## 12.6 Feedback summary

### Steps

1. Submit course feedback as participant.
2. Open monitoring as Admin.

### Expected result

1. Feedback count updates.
2. Average rating updates.
3. Accessibility/usability issue count updates if submitted.

---

# 13. Accessibility acceptance tests

## 13.1 Keyboard navigation

### Steps

1. Navigate public course page using keyboard only.
2. Navigate course player using keyboard only.
3. Navigate final test using keyboard only.
4. Navigate Build Studio basics using keyboard where feasible.

### Expected result

1. Focus states are visible.
2. Interactive controls are reachable.
3. User can complete key actions without mouse where feasible.

---

## 13.2 Form labels and errors

### Steps

1. Open registration/sign-in form.
2. Open course setup form.
3. Open quiz setup form.
4. Submit with missing required fields.

### Expected result

1. Inputs have labels.
2. Errors are clear.
3. Errors are associated with relevant fields.
4. Error text is readable.

---

## 13.3 Color contrast

### Steps

1. Review key pages:
   - home;
   - course catalogue;
   - course player;
   - Build Studio;
   - Admin dashboard.

### Expected result

Text and interactive elements have sufficient visible contrast.

---

## 13.4 Image alt text

### Steps

1. Add image block without alt text.
2. Attempt publish readiness.

### Expected result

1. Warning/error appears.
2. Alt text can be added.
3. Published learner view uses alt text.

---

## 13.5 Video transcript

### Steps

1. Add video block without transcript.
2. Review readiness warning.

### Expected result

1. Warning appears.
2. Transcript field is available.
3. Warning does not crowd Build Studio canvas.

---

# 14. Mobile acceptance tests

## 14.1 Public mobile pages

### Steps

1. Open home page on mobile viewport.
2. Open course catalogue.
3. Open course detail.

### Expected result

1. Layout stacks cleanly.
2. Text is readable.
3. Buttons are tappable.
4. No horizontal overflow.

---

## 14.2 Learner mobile course player

### Steps

1. Open published course as participant on mobile viewport.
2. Navigate lesson.
3. Complete interactive blocks.
4. Take final test.

### Expected result

1. Course outline collapses or fits well.
2. Lesson content is readable.
3. Interactive blocks work with touch.
4. Quiz controls are tappable.
5. Progress is visible.

---

## 14.3 Build Studio responsive behavior

### Steps

1. Open Build Studio in narrower viewport.

### Expected result

1. Center canvas remains primary.
2. Left/right panels collapse or adapt.
3. Core editing actions remain usable.
4. No broken layout.

---

# 15. Data protection and safety acceptance tests

## 15.1 Participant data exposure

### Steps

1. Sign in as Participant.
2. Open participant pages.

### Expected result

Participant sees only their own profile, progress, certificates, and courses.

---

## 15.2 M&E viewer data exposure

### Steps

1. Sign in as M&E Viewer.
2. Open monitoring dashboard.

### Expected result

M&E Viewer sees aggregate data and does not automatically receive unnecessary participant-level personal details.

---

## 15.3 Unauthorized data access

### Steps

1. Try direct URLs for admin/creator pages as unauthorized user.

### Expected result

Unauthorized user cannot view protected data.

---

# 16. Scope control acceptance tests

## 16.1 No Phase 2/3 active modules

### Steps

1. Review navigation and routes.
2. Search UI for active modules:
   - diagnosis;
   - capacity map;
   - action map;
   - knowledge management;
   - collaboration;
   - co-creation;
   - practical proof;
   - badges;
   - CRM.

### Expected result

1. These are not active Phase 1 modules.
2. If mentioned, they are hidden, disabled, or clearly marked as future phase.
3. They are not required to complete Phase 1 workflows.

---

## 16.2 No CRM drift

### Steps

1. Review Admin organization/cohort/course pages.

### Expected result

1. Pages support learning-platform operations.
2. No donor CRM pipeline or unrelated relationship-management workflow is implemented.

---

## 16.3 Build Studio remains content-focused

### Steps

1. Review Build Studio after implementation.

### Expected result

1. Authoring remains focused on content creation.
2. Governance and readiness checks are lightweight.
3. No crowded process-heavy panels are added.

---

# 17. Demo readiness acceptance scenario

This is the full Phase 1 demo flow.

## 17.1 Demo setup

Use:

1. one Admin;
2. one Course Creator;
3. one Participant;
4. one CSO Organization;
5. one Cohort;
6. one course with modules, lessons, blocks, final test, and certificate eligibility.

## 17.2 Demo flow

### Admin setup

1. Admin signs in.
2. Admin creates CSO organization.
3. Admin creates cohort.
4. Admin creates/assigns participant.
5. Admin checks capacity areas/reference data.

### Course creation

1. Course Creator signs in.
2. Creates course.
3. Adds metadata and outcomes.
4. Opens Build Studio.
5. Adds text, video, resource, case study, flashcard, knowledge check, branching scenario.
6. Previews course.
7. Adds final test.
8. Submits for review.

### Review/publish

1. Admin opens review queue.
2. Previews course.
3. Approves/publishes course.

### Participant learning

1. Participant signs in.
2. Opens dashboard.
3. Opens course.
4. Completes lesson.
5. Completes interactive blocks.
6. Takes final test.
7. Passes.
8. Downloads certificate.
9. Submits feedback.

### Monitoring

1. Admin opens monitoring dashboard.
2. Verifies enrollment, completion, pass, certificate, and feedback metrics update.

## 17.3 Demo success criteria

The demo is successful if the full flow can be completed without manual database editing, broken routes, role leakage, or major UI failure.

---

# 18. Evidence pack requirements

After each implementation slice, Codex must report:

1. slice name;
2. plain-language product summary;
3. files changed;
4. routes/screens affected;
5. data/schema changes;
6. role/permission changes;
7. workflow/status changes;
8. acceptance tests checked;
9. tests/checks run;
10. manual verification steps;
11. known gaps;
12. risks/decisions;
13. next smallest safe step.

Codex must explicitly mention any acceptance criteria not yet satisfied.

---

# 19. Final acceptance statement

Phase 1 can be considered acceptable only when:

1. Admin can manage users, organizations, cohorts, courses, review/publish, certificates, reference data, monitoring, and audit logs.
2. Course Creator can build a course using the clean three-column Build Studio.
3. Build Studio supports required block types and live learner preview.
4. Participant can complete a published course and receive certificate after passing.
5. Monitoring reflects participation, completion, final test, certificates, and feedback.
6. Role boundaries are protected.
7. Core flows are mobile-responsive and accessibility-conscious.
8. Phase 2/3 modules are not accidentally overbuilt.
9. The product remains a clean e-learning MVP with Learning Hub foundation, not a fragmented upload LMS or overloaded governance system.
