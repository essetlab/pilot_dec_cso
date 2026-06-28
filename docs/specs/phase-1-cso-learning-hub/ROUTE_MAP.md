# ROUTE_MAP.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Route Map

## 1. Document purpose

This file defines the deterministic route and page structure for Phase 1 of the CSO Learning Hub.

Codex must use this file as the authoritative route map when creating application pages, route groups, layouts, navigation menus, protected areas, and placeholder states.

Codex must not invent additional major routes unless explicitly instructed in a later approved change note.

---

## 2. Route design principles

## 2.1 Clear separation of user experiences

The application shall separate the platform into four main experience zones:

1. **Public site** — landing, course catalogue, course details, sign-in/registration entry.
2. **Participant learning site** — participant dashboard, course player, quiz, certificates, profile.
3. **Course Creator portal** — course creation, Build Studio, preview, submit for review.
4. **Admin portal** — users, CSOs, cohorts, courses, publishing, monitoring, reference data.

## 2.2 Protected routes

All routes except public landing, course catalogue, course details, sign-in, and registration must require authentication.

## 2.3 Role-aware navigation

Navigation shall show only the areas relevant to the signed-in user’s role.

Codex must not expose admin or creator routes to participants.

## 2.4 Phase 1 only

Routes for knowledge management, collaboration, co-creation, diagnosis, capacity map, action map, practical proof verification, badges, and advanced impact dashboards are not active Phase 1 routes.

If future-phase routes are mentioned in UI, they must be disabled, hidden, or clearly marked as future phase. They must not be implemented as functional modules in Phase 1.

---

## 3. Recommended route group structure

The application should use route groups or equivalent structure similar to:

```txt
/
(public)
(auth)
(learn)
(creator)
(admin)
```

If the existing repository already uses a different route grouping pattern, Codex may adapt this structure while preserving the same route intent, permissions, and page hierarchy.

---

# 4. Public routes

## 4.1 Home / landing page

```txt
/
```

### Purpose

Introduce the CSO Learning Hub, explain its purpose, and guide users to browse courses or sign in.

### Access

Public.

### Required content

1. Hero section.
2. Short description of the platform.
3. Call to action: Browse courses.
4. Call to action: Sign in / register.
5. Capacity-development positioning.
6. Partner/donor footer or logo strip if approved.
7. Accessibility-conscious layout.

### Must not include

1. Admin controls.
2. Course creator controls.
3. Internal dashboards.
4. Placeholder future modules as active links.

---

## 4.2 Course catalogue

```txt
/courses
```

### Purpose

Show published courses available to participants or the public, depending on access settings.

### Access

Public or authenticated, depending on course visibility. At minimum, published public courses may be visible.

### Required content

1. Course cards.
2. Search.
3. Filters:
   - capacity area;
   - course level;
   - language;
   - duration;
   - certificate eligible.
4. Empty state when no courses are available.
5. Course status limited to published courses only.

### Must not include

1. Draft courses.
2. Internal review status.
3. Admin-only metadata.

---

## 4.3 Course detail page

```txt
/courses/[courseSlug]
```

### Purpose

Show participant-facing overview of a published course before enrollment or launch.

### Access

Public or authenticated, depending on course visibility.

### Required content

1. Course title.
2. Short description.
3. Capacity area.
4. Target audience.
5. Estimated duration.
6. Course level.
7. Certificate eligibility.
8. Learning outcomes.
9. Module outline.
10. Enroll/start button.
11. Sign-in prompt if required.

### Must not include

1. Creator editing controls.
2. Admin publishing controls.
3. Internal quality checklist.

---

# 5. Authentication routes

## 5.1 Sign in

```txt
/sign-in
```

### Purpose

Allow existing users to sign in.

### Access

Public.

### Required content

1. Email/username field.
2. Password field or auth provider method.
3. Sign-in button.
4. Error state.
5. Link to registration if enabled.
6. Password reset link if implemented.

---

## 5.2 Registration

```txt
/register
```

### Purpose

Allow participants to create an account if self-registration is enabled.

### Access

Public.

### Required fields

1. Full name.
2. Email.
3. Password or equivalent auth setup.
4. Organization/CSO affiliation, optional or required depending on platform decision.
5. Region, optional if needed.
6. Consent/terms checkbox if implemented.

### Rule

Registration must create a Participant role by default unless admin approval or invitation-based registration is later required.

---

## 5.3 Forgot password / reset password

```txt
/forgot-password
/reset-password
```

### Purpose

Allow password recovery if local authentication is implemented.

### Access

Public.

### Note

If the stack uses an external auth provider or local signed sessions without password reset in Phase 1, these routes may be deferred with a clear implementation note.

---

# 6. Participant learning routes

All participant routes require authentication.

## 6.1 Participant dashboard

```txt
/learn
```

### Purpose

Show the participant’s learning home.

### Access

Authenticated Participant, Admin impersonation/debug only if supported.

### Required content

1. Enrolled courses.
2. Available assigned courses.
3. Progress status.
4. Completed courses.
5. Certificates.
6. Continue learning button.
7. Empty state for new participant.

### Must not include

1. Course creator tools.
2. Admin management tools.
3. Internal course draft status.

---

## 6.2 My courses

```txt
/learn/my-courses
```

### Purpose

List all courses the participant is enrolled in or assigned to.

### Access

Authenticated Participant.

### Required content

1. Course card.
2. Progress percentage.
3. Last accessed date.
4. Completion status.
5. Certificate status.
6. Continue/start button.

---

## 6.3 Participant course player

```txt
/learn/courses/[courseSlug]
```

### Purpose

Render the published course experience.

### Access

Authenticated participant with access to the course.

### Required content

1. Course title.
2. Module/lesson navigation.
3. Progress indicator.
4. Current lesson content.
5. Interactive blocks.
6. Resource downloads.
7. Mark complete or automatic completion logic.
8. Previous/next lesson controls.
9. Final test entry when eligible.
10. Mobile-friendly layout.

### Must not include

1. Editing controls.
2. Block configuration panel.
3. Creator-only preview controls.
4. Governance panels.

---

## 6.4 Participant lesson route, optional

```txt
/learn/courses/[courseSlug]/lessons/[lessonId]
```

### Purpose

Deep-link to a specific lesson.

### Access

Authenticated participant with course access.

### Note

If the course player handles lessons internally without separate route navigation, this route may be optional. Codex must preserve the learner experience either way.

---

## 6.5 Final test route

```txt
/learn/courses/[courseSlug]/final-test
```

### Purpose

Allow participant to take the course final test.

### Access

Authenticated participant with course access.

### Required content

1. Test instructions.
2. Questions.
3. Answer controls.
4. Submit button.
5. Score result.
6. Pass/fail result.
7. Retake instruction if allowed.
8. Certificate prompt after passing.

---

## 6.6 Certificate route

```txt
/learn/certificates
/learn/certificates/[certificateId]
```

### Purpose

Allow participants to view and download earned certificates.

### Access

Authenticated participant.

### Required content

1. List of certificates.
2. Certificate detail.
3. Download PDF button.
4. Certificate ID/verification code.
5. Completion date.

---

## 6.7 Participant profile

```txt
/learn/profile
```

### Purpose

Allow participant to view and update basic profile information.

### Access

Authenticated participant.

### Required content

1. Name.
2. Email.
3. Organization affiliation.
4. Region, if captured.
5. Password/profile update options if supported.

---

## 6.8 Feedback route

```txt
/learn/courses/[courseSlug]/feedback
```

### Purpose

Allow participant to submit course feedback.

### Access

Authenticated participant with course access.

### Required content

1. Rating.
2. Usefulness.
3. Clarity.
4. Accessibility/usability issue prompt.
5. Open comment.
6. Submit confirmation.

---

# 7. Course Creator routes

All creator routes require authentication and Course Creator or Admin permission.

Use route prefix:

```txt
/creator
```

## 7.1 Creator dashboard / My Courses

```txt
/creator
/creator/courses
```

### Purpose

Show courses created or assigned to the Course Creator.

### Required content

1. My courses list.
2. Create new course button.
3. Status filter:
   - Draft;
   - Ready for Review;
   - Returned for Revision;
   - Approved;
   - Published;
   - Archived.
4. Capacity area filter.
5. Last edited date.
6. Continue editing button.

---

## 7.2 Create new course

```txt
/creator/courses/new
```

### Purpose

Start a new draft course.

### Required content

1. Course title.
2. Short description.
3. Target audience.
4. Language.
5. Capacity area.
6. Course level.
7. Estimated duration.
8. Certificate eligible yes/no.
9. Create draft button.

### Result

Creates Course and initial CourseVersion in Draft state.

---

## 7.3 Course setup

```txt
/creator/courses/[courseId]/setup
```

### Purpose

Edit core course setup information.

### Required content

1. Course title.
2. Short description.
3. Long description.
4. Target audience.
5. Language.
6. Course level.
7. Estimated duration.
8. Certificate eligible setting.
9. Final test required setting.
10. Save button.

---

## 7.4 Metadata and capacity linkage

```txt
/creator/courses/[courseId]/metadata
```

### Purpose

Capture lightweight Phase 1 learning design metadata without creating a heavy diagnosis workflow.

### Required content

1. Capacity area.
2. Target CSO profile.
3. Capacity gap addressed.
4. Intended practice improvement.
5. Recommended prerequisites, optional.
6. Related follow-up support, optional.
7. Save button.

### Must not include

1. Full diagnosis workflow.
2. Capacity map screen.
3. Action map screen.
4. Heavy evidence-anchor panels.

---

## 7.5 Learning outcomes

```txt
/creator/courses/[courseId]/outcomes
```

### Purpose

Define the learning outcomes for the course.

### Required content

1. Add outcome.
2. Edit outcome.
3. Delete outcome.
4. Optional link to module/lesson.
5. Optional link to quiz question.
6. Save button.

---

## 7.6 Build Studio

```txt
/creator/courses/[courseId]/build
```

### Purpose

Main block-based course authoring workspace.

### Required layout

Three-column layout:

1. left: Block Library + Course Outline;
2. center: Course Canvas;
3. right: Selected Block Configuration.

### Required behavior

Creators can:

1. create modules;
2. create lessons;
3. add content blocks;
4. configure selected blocks;
5. reorder blocks;
6. duplicate blocks;
7. delete blocks;
8. collapse/expand blocks;
9. save draft;
10. preview selected lesson;
11. preview full course;
12. switch desktop/mobile preview.

### Must not include

1. large governance panels;
2. diagnosis panels;
3. capacity map panels;
4. monitoring charts;
5. CRM records;
6. donor compliance sections;
7. heavy review history.

---

## 7.7 Course resources

```txt
/creator/courses/[courseId]/resources
```

### Purpose

Manage downloadable files and reusable course resources.

### Required content

1. Resource list.
2. Upload/add resource.
3. Resource title.
4. Resource description.
5. File type.
6. Download label.
7. Accessibility warning if resource is not accessible.
8. Delete/archive resource.

### Note

Resources may also be added directly through Resource blocks in the Build Studio.

---

## 7.8 Quiz / final test setup

```txt
/creator/courses/[courseId]/quiz
```

### Purpose

Configure course quiz/final test and certificate pass rules.

### Required content

1. Final test required yes/no.
2. Pass threshold.
3. Retake allowed yes/no.
4. Add question.
5. Question type:
   - multiple choice;
   - true/false.
6. Correct answer.
7. Feedback/explanation.
8. Save button.
9. Preview test.

---

## 7.9 Creator preview

```txt
/creator/courses/[courseId]/preview
```

### Purpose

Show the course exactly as participants will see it after publication.

### Required content

1. Full learner-facing course template.
2. Desktop/mobile preview toggle.
3. Preview warning that this is not live.
4. Return to Build Studio button.
5. Readiness warnings if needed.

### Rule

Preview must render from the same content model as the participant course player.

---

## 7.10 Submit for review / publish readiness

```txt
/creator/courses/[courseId]/submit
```

### Purpose

Allow Course Creator to mark course Ready for Review after checking readiness.

### Required content

1. Readiness checklist summary.
2. Missing required items.
3. Submit for Review button.
4. Confirmation message.

### Readiness checks may include

1. course title present;
2. capacity area present;
3. at least one learning outcome;
4. at least one module;
5. each module has at least one lesson;
6. each lesson has at least one block;
7. final test configured if certificate eligible;
8. certificate rule configured if certificate eligible.

### Rule

The readiness page must be concise. It must not become a heavy governance screen.

---

## 7.11 Feedback / revision view

```txt
/creator/courses/[courseId]/feedback
```

### Purpose

Show reviewer/admin feedback if a course is returned for revision.

### Required content

1. Current course status.
2. Return reason.
3. Feedback comments.
4. Link to affected page if applicable.
5. Mark resolved or resubmit action, if implemented.

---

# 8. Admin routes

All admin routes require Admin permission.

Use route prefix:

```txt
/admin
```

## 8.1 Admin dashboard

```txt
/admin
```

### Purpose

Show operational overview.

### Required content

1. Total users.
2. Total CSO organizations.
3. Total cohorts.
4. Total courses.
5. Published courses.
6. Active enrollments.
7. Course completions.
8. Certificates issued.
9. Courses awaiting review/publishing.
10. Recent activity.

---

## 8.2 User management

```txt
/admin/users
/admin/users/new
/admin/users/[userId]
```

### Purpose

Manage platform users.

### Required content

1. User list.
2. Search/filter.
3. Create user.
4. Edit user.
5. Assign role.
6. Link user to organization/cohort.
7. Activate/deactivate user.
8. View basic activity.

---

## 8.3 Organization management

```txt
/admin/organizations
/admin/organizations/new
/admin/organizations/[organizationId]
```

### Purpose

Manage CSO organizations.

### Required content

1. Organization list.
2. Create organization.
3. Organization profile.
4. Region.
5. Organization type.
6. Formal/informal status, optional.
7. Focal person.
8. Linked participants.
9. Cohort assignment.
10. Organization course participation summary.

---

## 8.4 Cohort management

```txt
/admin/cohorts
/admin/cohorts/new
/admin/cohorts/[cohortId]
```

### Purpose

Manage cohorts of CSOs/participants.

### Required content

1. Cohort list.
2. Create cohort.
3. Cohort profile.
4. Assigned organizations.
5. Assigned participants.
6. Assigned courses.
7. Cohort progress summary.

---

## 8.5 Course management

```txt
/admin/courses
/admin/courses/[courseId]
```

### Purpose

Admin-level management of all courses.

### Required content

1. Course list.
2. Status filter.
3. Creator filter.
4. Capacity area filter.
5. Course detail.
6. Assign creator.
7. View preview.
8. Review status.
9. Publish/unpublish/archive actions according to permission.

---

## 8.6 Review / publish queue

```txt
/admin/review
/admin/review/[courseId]
```

### Purpose

Manage courses submitted for review or publication.

### Required content

1. Courses Ready for Review.
2. Approved but unpublished courses.
3. Returned courses.
4. Course preview link.
5. Approve action.
6. Return for revision action with reason.
7. Publish action for authorized Admin.
8. Status history.

---

## 8.7 Certificate settings and records

```txt
/admin/certificates
/admin/certificates/settings
/admin/certificates/[certificateId]
```

### Purpose

Manage certificate settings and view certificate records.

### Required content

1. Certificate template settings.
2. Default pass threshold.
3. Issued certificate list.
4. Certificate detail.
5. Participant.
6. Course.
7. Completion date.
8. Certificate ID/verification code.

---

## 8.8 Capacity areas / reference data

```txt
/admin/reference-data
/admin/reference-data/capacity-areas
/admin/reference-data/course-levels
/admin/reference-data/organization-types
/admin/reference-data/regions
/admin/reference-data/languages
```

### Purpose

Manage reference data used across the platform.

### Required content

1. Capacity area list.
2. Course level list.
3. Organization type list.
4. Region list.
5. Language list.
6. Create/edit/deactivate reference value.

### Rule

Reference values should generally be deactivated rather than hard-deleted if used by records.

---

## 8.9 Monitoring dashboard

```txt
/admin/monitoring
```

### Purpose

Show platform monitoring and course progress.

### Required content

1. Registered participants.
2. Active participants.
3. Organizations.
4. Enrollments.
5. Completion rate.
6. Final test pass rate.
7. Certificates issued.
8. Feedback summary.
9. Course-level progress.
10. Cohort-level progress.
11. Organization-level participation.
12. Filters:
    - course;
    - cohort;
    - organization;
    - region;
    - date range;
    - course status.

---

## 8.10 Audit/activity log

```txt
/admin/audit-log
```

### Purpose

Show critical platform actions.

### Required content

1. User action.
2. Action type.
3. Entity affected.
4. Timestamp.
5. Actor.
6. Filter by action type/date/user.

Critical actions should include:

1. user creation/update/deactivation;
2. role changes;
3. course status changes;
4. publish/unpublish actions;
5. certificate issuance;
6. organization/cohort changes.

---

## 8.11 Platform settings

```txt
/admin/settings
```

### Purpose

Manage basic platform settings.

### Required content

1. Platform name.
2. Logo/branding references if implemented.
3. Default language.
4. Certificate default settings.
5. Registration setting if implemented.
6. Basic footer/partner display configuration if implemented.

---

# 9. Optional or deferred routes

The following route prefixes must not be implemented as active Phase 1 modules unless explicitly authorized later:

```txt
/diagnosis
/capacity-map
/action-map
/knowledge
/collaboration
/co-creation
/practical-proof
/badges
/impact
/grants
/crm
```

If design placeholders are needed for stakeholder communication, they must be non-functional, clearly labeled as future phase, and excluded from Phase 1 acceptance testing.

---

# 10. Navigation structures

## 10.1 Public navigation

Public nav shall include:

1. Home
2. Courses
3. Sign in / Register

Optional if content exists:

1. About
2. Help

## 10.2 Participant navigation

Participant nav shall include:

1. Dashboard
2. My Courses
3. Certificates
4. Profile

Course player sub-navigation shall include:

1. Course outline
2. Lessons
3. Resources, if applicable
4. Final Test
5. Certificate, if earned
6. Feedback

## 10.3 Creator navigation

Creator nav shall include:

1. My Courses
2. Course Setup
3. Metadata
4. Learning Outcomes
5. Build Studio
6. Resources
7. Quiz / Final Test
8. Preview
9. Submit / Feedback

The active course navigation may appear as a horizontal stepper or left sidebar, but it must remain clean.

## 10.4 Admin navigation

Admin nav shall include:

1. Dashboard
2. Users
3. Organizations
4. Cohorts
5. Courses
6. Review / Publish
7. Certificates
8. Reference Data
9. Monitoring
10. Audit Log
11. Settings

---

# 11. Route protection matrix

| Route prefix | Public | Participant | Course Creator | Reviewer | Admin | M&E Viewer |
|---|---:|---:|---:|---:|---:|---:|
| `/` | Yes | Yes | Yes | Yes | Yes | Yes |
| `/courses` | Yes | Yes | Yes | Yes | Yes | Yes |
| `/sign-in` | Yes | Yes | Yes | Yes | Yes | Yes |
| `/register` | Yes | Yes | Yes | Yes | Yes | Yes |
| `/learn` | No | Yes | Optional | Optional | Optional | No |
| `/creator` | No | No | Yes | Optional | Yes | No |
| `/admin` | No | No | No | Limited | Yes | Limited |
| `/admin/monitoring` | No | No | No | Optional | Yes | Yes |
| `/admin/review` | No | No | No | Yes | Yes | No |

Implementation may vary, but permission behavior must match the intent of this matrix.

---

# 12. Required empty states

Every list page shall have a clean empty state.

## 12.1 Courses empty state

Message: No courses have been published yet.

Action for public/participant: Check back later.

Action for creator/admin: Create course, if authorized.

## 12.2 My Courses empty state

Message: You do not have any courses yet.

Action: Browse available courses.

## 12.3 Creator My Courses empty state

Message: No draft courses yet.

Action: Create new course.

## 12.4 Admin Users empty state

Message: No users found.

Action: Add user.

## 12.5 Organizations empty state

Message: No CSO organizations have been added yet.

Action: Add organization.

## 12.6 Cohorts empty state

Message: No cohorts have been created yet.

Action: Create cohort.

## 12.7 Monitoring empty state

Message: Monitoring data will appear after participants start learning.

Action: None or link to published courses.

---

# 13. Error and access states

## 13.1 Unauthorized

Route:

```txt
/unauthorized
```

Purpose:

Show a clear message when a user tries to access a route they do not have permission to access.

## 13.2 Not found

Route:

```txt
/not-found
```

or framework default.

Purpose:

Show a clean not-found page.

## 13.3 Course unavailable

For participant routes, if a course is unpublished, archived, or inaccessible to the participant, show:

Message: This course is not currently available to your account.

Do not expose draft status or internal admin notes.

---

# 14. Breadcrumb and context rules

## 14.1 Creator course context

Creator course pages should show a compact course context bar with:

1. course title;
2. status;
3. capacity area;
4. last saved timestamp;
5. preview action.

Do not show heavy governance or monitoring content in this bar.

## 14.2 Admin course context

Admin course detail pages may show:

1. course title;
2. status;
3. creator;
4. capacity area;
5. publication state;
6. last updated;
7. quick actions.

## 14.3 Participant course context

Participant course player should show:

1. course title;
2. progress;
3. current module/lesson;
4. continue/next action.

---

# 15. Route implementation order

Codex should implement routes in this order:

1. Public shell:
   - `/`
   - `/courses`
   - `/courses/[courseSlug]`
2. Auth:
   - `/sign-in`
   - `/register`
3. Admin shell:
   - `/admin`
   - `/admin/users`
   - `/admin/organizations`
   - `/admin/cohorts`
   - `/admin/courses`
4. Creator shell:
   - `/creator`
   - `/creator/courses`
   - `/creator/courses/new`
   - `/creator/courses/[courseId]/setup`
   - `/creator/courses/[courseId]/metadata`
   - `/creator/courses/[courseId]/outcomes`
   - `/creator/courses/[courseId]/build`
5. Participant shell:
   - `/learn`
   - `/learn/my-courses`
   - `/learn/courses/[courseSlug]`
6. Quiz/certificate:
   - `/learn/courses/[courseSlug]/final-test`
   - `/learn/certificates`
   - `/learn/certificates/[certificateId]`
7. Review/publish:
   - `/creator/courses/[courseId]/submit`
   - `/admin/review`
   - `/admin/review/[courseId]`
8. Monitoring and audit:
   - `/admin/monitoring`
   - `/admin/audit-log`
9. Settings and reference data:
   - `/admin/reference-data`
   - `/admin/settings`

---

# 16. Codex control rules

Codex must follow these route rules:

1. Do not create active Phase 2/3 routes unless explicitly instructed.
2. Do not expose draft courses through public or participant routes.
3. Do not place Build Studio under `/admin`; it belongs under `/creator`.
4. Do not place participant course player under `/creator`; preview is separate from live course player.
5. Do not mix admin management UI into participant routes.
6. Do not add CRM-style routes.
7. Do not add heavy diagnosis/capacity map routes in Phase 1.
8. Use route names consistently.
9. Protect role-specific routes.
10. Add empty states for every list page.

---

# 17. Final route statement

The Phase 1 application route structure shall support a clean separation between public discovery, participant learning, course creation, and admin operations.

The route structure shall make the platform immediately useful as an e-learning MVP while preserving future compatibility for the broader CSO Learning Hub.

The route structure shall not imply that Phase 2/3 modules are already built.
