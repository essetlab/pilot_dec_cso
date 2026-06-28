# UI_SCREEN_BLUEPRINTS.md

# DEC / WHH CSF+ CSO Learning Hub — Premium UI Screen Blueprints

## 1. Document purpose

This file defines the premium screen-level blueprints for the DEC / WHH CSF+ CSO Learning Hub Phase 1 application.

Codex must use this file together with:

```txt
docs/design/DESIGN_SYSTEM.md
docs/design/CODEX_UI_SKILL.md
docs/design/VISUAL_QA_CHECKLIST.md
docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
docs/specs/phase-1-cso-learning-hub/ADMIN_PORTAL_SPEC.md
docs/specs/phase-1-cso-learning-hub/MONITORING_SPEC.md
docs/specs/phase-1-cso-learning-hub/SEED_DATA_PLAN.md
```

The goal is to prevent Codex from inventing weak, generic, or developer-looking UI.

---

## 2. Golden screen rule

The screens in this file are the approved “golden screen” direction for Phase 1.

Codex must not independently invent the layout for these major screens when implementing UI slices.

Codex may adapt details to actual data and technical constraints, but the visual hierarchy, page structure, and product intent must remain.

---

## 3. Global screen shell rules

## 3.1 Public shell

Use for:

```txt
/
/courses
/courses/[courseSlug]
/sign-in
/register
```

Required layout:

```txt
Top navigation
Main content
Partner/footer area where appropriate
```

Top navigation:

1. platform name/logo;
2. Courses link;
3. Sign in button;
4. Register button if enabled.

Do not show:

1. admin links;
2. creator links;
3. internal workflow links;
4. Phase 2/3 modules.

---

## 3.2 Learner shell

Use for:

```txt
/learn
/learn/my-courses
/learn/courses/[courseSlug]
/learn/courses/[courseSlug]/final-test
/learn/certificates
/learn/profile
```

Required layout:

```txt
Learner header
Learner navigation
Main learner content
```

Learner nav:

1. Dashboard;
2. My Courses;
3. Certificates;
4. Profile.

Tone:

1. supportive;
2. learning-focused;
3. not administrative.

---

## 3.3 Creator shell

Use for:

```txt
/creator
/creator/courses
/creator/courses/[courseId]/*
```

Required layout:

```txt
Creator sidebar or top workflow nav
Main content
Course context bar where needed
```

Creator nav:

1. My Courses;
2. Setup;
3. Metadata;
4. Outcomes;
5. Build Studio;
6. Resources;
7. Final Test;
8. Preview;
9. Submit / Feedback.

Tone:

1. focused;
2. creative;
3. production-oriented;
4. not governance-heavy.

---

## 3.4 Admin shell

Use for:

```txt
/admin/*
```

Required layout:

```txt
Admin sidebar
Admin top bar
Main admin content
```

Admin nav:

1. Dashboard;
2. Users;
3. Organizations;
4. Cohorts;
5. Courses;
6. Review / Publish;
7. Certificates;
8. Reference Data;
9. Monitoring;
10. Audit Log;
11. Settings.

Tone:

1. operational;
2. calm;
3. clear;
4. not CRM-like.

---

# 4. Golden Screen 1 — Public Landing Page

## 4.1 Route

```txt
/
```

## 4.2 Purpose

Introduce the CSO Learning Hub and immediately communicate that this is a credible digital learning platform for local and grassroots CSOs.

## 4.3 Layout blueprint

```txt
Public top nav
Hero section
  Left: platform promise, headline, description, CTAs
  Right: elegant learning dashboard/course preview visual
Trust/context strip
Feature cards
How it works section
Course/capacity areas preview
Footer / partner strip
```

## 4.4 Required sections

### Hero

Headline direction:

```txt
Build stronger CSO capacity through accessible digital learning.
```

Subtitle direction:

```txt
A practical learning platform for local and grassroots CSOs to access structured courses, track progress, complete assessments, and earn certificates.
```

Primary CTA:

```txt
Browse courses
```

Secondary CTA:

```txt
Sign in
```

Hero visual should show a polished mock course card, progress ring, certificate badge, or learner dashboard preview.

### Trust/context strip

Show concise credibility indicators:

1. CSO-focused learning;
2. structured courses;
3. certificates;
4. progress tracking;
5. accessible on mobile.

### Feature cards

Use 3–4 cards:

1. Learn at your pace;
2. Practice with interactive blocks;
3. Track progress and certificates;
4. Support CSO capacity priorities.

### How it works

Simple 3-step flow:

1. Choose or receive a course.
2. Complete lessons and activities.
3. Take the final test and receive a certificate.

### Capacity areas preview

Show sample capacity areas:

1. Proposal Development;
2. Financial Management;
3. MEAL;
4. Safeguarding;
5. HRBA;
6. Governance.

## 4.5 Visual quality rules

1. Must feel premium, not like a template.
2. Use generous whitespace.
3. Avoid too many text blocks.
4. Avoid generic stock imagery if no approved images exist.
5. Do not include admin/creator controls.
6. Do not mention slices, MVP, scaffold, or placeholders.

---

# 5. Golden Screen 2 — Course Catalogue

## 5.1 Route

```txt
/courses
```

## 5.2 Purpose

Help participants find published courses.

## 5.3 Layout blueprint

```txt
Public top nav
Page header
Search and filter bar
Course card grid
Empty state if no courses
Footer
```

## 5.4 Page header

Title:

```txt
Explore CSO learning courses
```

Subtitle:

```txt
Find practical courses designed to support local and grassroots CSO capacity.
```

## 5.5 Filter bar

Filters:

1. Search;
2. Capacity area;
3. Course level;
4. Language;
5. Duration;
6. Certificate eligible.

## 5.6 Course card

Each course card should show:

1. course title;
2. short description;
3. capacity area badge;
4. level;
5. duration;
6. language;
7. certificate eligible indicator;
8. View course button.

## 5.7 Empty state

```txt
No courses are available yet.
Published courses will appear here when they are ready.
```

## 5.8 Visual quality rules

1. Cards must be polished and consistent.
2. Do not show draft or internal course status.
3. Do not show admin/creator actions.
4. Search/filter area must not be crowded.
5. Mobile cards must stack cleanly.

---

# 6. Golden Screen 3 — Course Detail Page

## 6.1 Route

```txt
/courses/[courseSlug]
```

## 6.2 Purpose

Help a participant understand what the course offers and start/enroll.

## 6.3 Layout blueprint

```txt
Public top nav
Course hero
  Left: title, description, CTAs
  Right: course info card
Main content grid
  Left: overview, learning outcomes, module outline
  Right: certificate/access card, related details
Footer
```

## 6.4 Required content

1. course title;
2. short/long description;
3. capacity area;
4. target audience;
5. level;
6. duration;
7. language;
8. certificate eligibility;
9. learning outcomes;
10. module outline;
11. start/enroll/sign-in action.

## 6.5 Course info card

Show:

1. Duration;
2. Level;
3. Language;
4. Certificate;
5. Capacity area;
6. Lessons/modules.

## 6.6 Learning outcomes section

Use checkmark list.

## 6.7 Module outline

Use accordion or clean vertical list.

## 6.8 Visual quality rules

1. Must look like a real course page.
2. Do not expose draft/internal status.
3. Do not show creator/admin controls.
4. Do not show internal readiness checks.
5. CTA must be clear.

---

# 7. Golden Screen 4 — Sign In

## 7.1 Route

```txt
/sign-in
```

## 7.2 Purpose

Allow users to access the correct area.

## 7.3 Layout blueprint

```txt
Centered auth card
Left/upper brand message
Sign-in form or demo role selector if still temporary
Support/help note
```

## 7.4 Visual requirements

1. Clean card.
2. Strong brand/platform title.
3. Clear role-safe demo sign-in if temporary auth is still used.
4. No raw debug text.
5. No technical auth language.

## 7.5 Temporary demo auth copy

If demo auth is still used, use safe language:

```txt
Choose a demo role to preview the platform.
```

Do not say:

```txt
Fake login
Temporary auth
Mock users
```

---

# 8. Golden Screen 5 — Learner Dashboard

## 8.1 Route

```txt
/learn
```

## 8.2 Purpose

Give participants a warm, clear home for continuing learning.

## 8.3 Layout blueprint

```txt
Learner shell
Welcome panel
Continue learning card
Progress summary cards
My active courses
Available/assigned courses
Certificates preview
Support/help card
```

## 8.4 Required sections

### Welcome panel

Title:

```txt
Welcome back, [Name]
```

Subtitle:

```txt
Continue your CSO learning journey and track your progress.
```

### Continue learning

Large card showing:

1. course title;
2. current lesson;
3. progress bar;
4. continue button.

### Progress cards

1. Courses in progress;
2. Courses completed;
3. Certificates earned.

### Active courses

Course cards with:

1. title;
2. capacity area;
3. progress;
4. continue button.

### Certificates preview

Show recent certificate or empty state.

## 8.5 Empty state

```txt
No courses yet.
Browse available courses or wait for an assigned course from your programme team.
```

## 8.6 Visual quality rules

1. Learner dashboard must not look like admin.
2. Use warm tone.
3. Progress must be visible but not overwhelming.
4. No internal course states.
5. Mobile layout must be strong.

---

# 9. Golden Screen 6 — Learner Course Player

## 9.1 Route

```txt
/learn/courses/[courseSlug]
```

## 9.2 Purpose

Deliver the published course learning experience.

## 9.3 Desktop layout blueprint

```txt
Learner shell
Course header
  Course title
  Progress
  Current module/lesson
Main two-column layout
  Left: collapsible course outline
  Right: lesson content area
Bottom/inline previous-next controls
```

## 9.4 Mobile layout blueprint

```txt
Course header
Collapsed outline button
Lesson content
Previous/next controls
Final test link when eligible
```

## 9.5 Course outline

Show:

1. module titles;
2. lessons;
3. completed indicators;
4. current lesson indicator;
5. final test link.

## 9.6 Lesson content area

Show:

1. lesson title;
2. lesson description;
3. content blocks;
4. mark complete button or auto-completion state;
5. previous/next controls.

## 9.7 Block rendering quality

Blocks must render as designed learning content:

1. Text: readable content card/section.
2. Video: polished video player card with transcript area.
3. Resource: download card.
4. Case study: distinct scenario card.
5. Accordion: accessible expandable sections.
6. Flashcards: polished reveal cards.
7. Knowledge check: clear question and feedback.
8. Branching scenario: decision cards with feedback.
9. Practical activity: action-oriented practice card.

## 9.8 Visual quality rules

1. Must not look like a file dump.
2. Must not show creator/admin controls.
3. Must not show block configuration.
4. Must not expose internal status.
5. Mobile must be usable.

---

# 10. Golden Screen 7 — Final Test

## 10.1 Route

```txt
/learn/courses/[courseSlug]/final-test
```

## 10.2 Purpose

Allow participant to complete the final assessment.

## 10.3 Layout blueprint

```txt
Learner shell
Test header card
Instructions and pass threshold
Question list
Submit button
Result state after submission
```

## 10.4 Required content

1. test title;
2. number of questions;
3. pass threshold;
4. attempt information;
5. questions;
6. submit action;
7. result state.

## 10.5 Result states

Passed:

```txt
Congratulations. You passed the final test.
Your certificate is ready when all course requirements are complete.
```

Failed:

```txt
You did not reach the pass score this time.
Review the course and try again if retakes are available.
```

## 10.6 Visual quality rules

1. Questions must be readable.
2. Options must be easy to select.
3. Result must be supportive.
4. Certificate path must be clear.
5. No technical scoring/debug text.

---

# 11. Golden Screen 8 — Certificate Page

## 11.1 Routes

```txt
/learn/certificates
/learn/certificates/[certificateId]
```

## 11.2 Purpose

Allow participants to view and download earned certificates.

## 11.3 Certificate list blueprint

```txt
Learner shell
Page header
Certificate card grid/list
Empty state if no certificates
```

## 11.4 Certificate detail blueprint

```txt
Learner shell
Certificate preview panel
Certificate metadata card
Download button
Verification/code note
```

## 11.5 Certificate card content

1. course title;
2. issue date;
3. certificate code;
4. download/view action.

## 11.6 Visual quality rules

1. Certificate should feel like an achievement.
2. Use clean, celebratory but professional design.
3. Locked state must be clear and supportive.
4. No internal certificate logic is exposed.

---

# 12. Golden Screen 9 — Course Creator My Courses

## 12.1 Routes

```txt
/creator
/creator/courses
```

## 12.2 Purpose

Help course creators manage draft and assigned courses.

## 12.3 Layout blueprint

```txt
Creator shell
Page header with Create Course action
Stats/summary row
Filter/search bar
Course list/cards/table
Empty state
```

## 12.4 Course creator card/list item

Show:

1. course title;
2. status badge;
3. capacity area;
4. last updated;
5. completion/readiness summary;
6. continue editing button;
7. preview button where appropriate.

## 12.5 Empty state

```txt
No courses yet.
Create your first course and start building structured digital learning content.
```

## 12.6 Visual quality rules

1. Must feel like a course production workspace.
2. Do not show admin-only controls.
3. Do not show heavy governance.
4. Do not expose technical course IDs prominently.

---

# 13. Golden Screen 10 — Course Setup

## 13.1 Routes

```txt
/creator/courses/new
/creator/courses/[courseId]/setup
/creator/courses/[courseId]/metadata
/creator/courses/[courseId]/outcomes
```

## 13.2 Purpose

Allow creators to enter essential course information without cognitive overload.

## 13.3 Layout blueprint

```txt
Creator shell
Compact course context bar
Page header
Grouped form card
Secondary guidance card if needed
Save action row
```

## 13.4 Form grouping

Course setup groups:

1. Basic course information;
2. Audience and access;
3. Certificate and final test settings;
4. Duration and language.

Metadata groups:

1. Capacity area;
2. Target CSO profile;
3. Capacity gap addressed;
4. Intended practice improvement.

Outcomes groups:

1. learning outcome list;
2. add/edit outcome controls.

## 13.5 Visual quality rules

1. Must not feel like a long compliance form.
2. Use grouped sections.
3. Keep helper text concise.
4. No diagnosis/capacity map workflow.
5. Save action must be clear.

---

# 14. Golden Screen 11 — Build Studio

## 14.1 Route

```txt
/creator/courses/[courseId]/build
```

## 14.2 Purpose

Allow creators to build structured digital course lessons using blocks.

## 14.3 Required desktop layout

```txt
Creator shell
Build Studio header
Three-column workspace:
  Left panel: Block Library + Course Outline
  Center panel: Course Canvas
  Right panel: Block Configuration
```

## 14.4 Header blueprint

Header includes:

1. course title;
2. status badge;
3. last saved state;
4. preview button;
5. save button or autosave indicator;
6. submit/review link when appropriate.

Do not include heavy governance panels.

## 14.5 Left panel blueprint

Tabs or stacked sections:

1. Block Library;
2. Course Outline.

Block Library:

1. Search blocks;
2. Categories:
   - Content;
   - Media;
   - Interaction;
   - Assessment;
   - Practice;
   - Navigation / Action.
3. Block cards with icon, name, short description, add button.

Course Outline:

1. modules;
2. lessons;
3. selected lesson;
4. add module;
5. add lesson.

## 14.6 Center canvas blueprint

States:

1. no lesson selected;
2. empty lesson;
3. lesson with blocks.

Lesson with blocks shows:

1. lesson title;
2. block list;
3. add block control;
4. selected block state;
5. move/duplicate/delete actions.

## 14.7 Right panel blueprint

States:

1. no block selected;
2. selected block configuration.

Right panel shows only fields for the selected block.

## 14.8 Build Studio visual quality rules

Must not include:

1. diagnosis panels;
2. capacity map/action map panels;
3. monitoring charts;
4. CRM sections;
5. donor compliance widgets;
6. heavy review history;
7. large governance cards;
8. process-heavy diagrams.

Must feel like:

```txt
A clean professional authoring tool.
```

## 14.9 Mobile/narrow behavior

1. Left panel collapses or moves above canvas.
2. Right panel opens as drawer or stacked section.
3. Center canvas remains primary.
4. Preview remains accessible.

---

# 15. Golden Screen 12 — Creator Preview

## 15.1 Route

```txt
/creator/courses/[courseId]/preview
```

## 15.2 Purpose

Allow creator to see participant-facing course before review.

## 15.3 Layout blueprint

```txt
Creator shell
Preview toolbar
  Preview mode label
  Desktop/mobile toggle
  Back to Build Studio
  Submit for review if ready
Learner course template preview
```

## 15.4 Visual quality rules

1. Preview must look like actual learner course.
2. Preview label must be subtle.
3. No block configuration controls.
4. No admin controls.
5. No internal readiness clutter.

---

# 16. Golden Screen 13 — Review Submission

## 16.1 Route

```txt
/creator/courses/[courseId]/submit
```

## 16.2 Purpose

Let creator submit course for review after readiness checks.

## 16.3 Layout blueprint

```txt
Creator shell
Course context bar
Page header
Readiness summary card
Checklist card
Submit action card
```

## 16.4 Readiness checklist

Show concise items:

1. course information;
2. learning outcomes;
3. modules and lessons;
4. required blocks;
5. final test if certificate eligible;
6. accessibility basics.

## 16.5 Visual quality rules

1. Keep concise.
2. Do not become governance-heavy.
3. Use clear pass/warning/error states.
4. Submit action must be obvious.

---

# 17. Golden Screen 14 — Admin Dashboard

## 17.1 Route

```txt
/admin
```

## 17.2 Purpose

Give admins a concise operational overview.

## 17.3 Layout blueprint

```txt
Admin shell
Page header
KPI card grid
Quick actions
Courses needing attention
Recent activity
Recent certificates/feedback summary
```

## 17.4 KPI cards

1. Total users;
2. Participants;
3. CSO organizations;
4. Cohorts;
5. Courses;
6. Published courses;
7. Enrollments;
8. Completions;
9. Certificates issued;
10. Courses awaiting review.

## 17.5 Visual quality rules

1. Dashboard must be calm, not crowded.
2. KPI cards must be readable.
3. Quick actions must be useful.
4. No donor CRM metrics.
5. No Phase 2/3 dashboards.
6. No diagnosis/capacity analytics.

---

# 18. Golden Screen 15 — Admin Users

## 18.1 Routes

```txt
/admin/users
/admin/users/new
/admin/users/[userId]
```

## 18.2 Purpose

Manage user accounts and roles.

## 18.3 List layout blueprint

```txt
Admin shell
Page header with Add User action
Filter/search bar
User table
Empty state
```

## 18.4 Table columns

1. name;
2. email;
3. role(s);
4. organization;
5. cohort;
6. status;
7. last login;
8. actions.

## 18.5 Detail layout blueprint

```txt
Admin shell
User profile header
Role/account status card
Organization/cohort card
Learning summary card if participant
Recent activity card
```

## 18.6 Visual quality rules

1. Must not feel like raw database table.
2. Role assignment must be clear.
3. Participant data must not be overexposed.
4. Deactivation should be clear and safe.

---

# 19. Golden Screen 16 — Admin Organizations

## 19.1 Routes

```txt
/admin/organizations
/admin/organizations/new
/admin/organizations/[organizationId]
```

## 19.2 Purpose

Manage CSO organizations.

## 19.3 List layout blueprint

```txt
Admin shell
Page header with Add Organization action
Filter/search bar
Organization table/cards
Empty state
```

## 19.4 Columns/cards show

1. organization name;
2. region;
3. organization type;
4. focal person;
5. participants;
6. cohorts;
7. status;
8. actions.

## 19.5 Detail layout blueprint

```txt
Organization header
Profile card
Linked participants
Cohorts
Course participation summary
Notes
```

## 19.6 Visual quality rules

1. Must support learning operations, not CRM.
2. Do not add donor pipeline sections.
3. Do not overcomplicate relationship management.

---

# 20. Golden Screen 17 — Admin Cohorts

## 20.1 Routes

```txt
/admin/cohorts
/admin/cohorts/new
/admin/cohorts/[cohortId]
```

## 20.2 Purpose

Manage learning cohorts.

## 20.3 List layout blueprint

```txt
Admin shell
Page header with Create Cohort action
Filter/search bar
Cohort table/cards
Empty state
```

## 20.4 Columns/cards show

1. cohort name;
2. programme;
3. dates;
4. organizations;
5. participants;
6. assigned courses;
7. status;
8. actions.

## 20.5 Detail layout blueprint

```txt
Cohort header
Profile card
Assigned organizations
Assigned participants
Assigned courses
Progress summary
```

## 20.6 Visual quality rules

1. Must remain learning-cohort focused.
2. Do not become project management workspace.
3. Progress summary must be concise.

---

# 21. Golden Screen 18 — Admin Courses

## 21.1 Routes

```txt
/admin/courses
/admin/courses/[courseId]
```

## 21.2 Purpose

Manage all courses and publication state.

## 21.3 List layout blueprint

```txt
Admin shell
Page header
Filter/search bar
Course table/cards
Empty state
```

## 21.4 Columns/cards show

1. course title;
2. status;
3. creator;
4. capacity area;
5. level;
6. certificate eligible;
7. last updated;
8. actions.

## 21.5 Detail layout blueprint

```txt
Course header
Course summary card
Creator/version card
Readiness summary
Modules/lessons summary
Final test/certificate summary
Actions: preview, approve/return/publish as allowed
```

## 21.6 Visual quality rules

1. Do not duplicate Build Studio.
2. Do not show full content editing here.
3. Publication actions must be permission-appropriate.
4. Do not expose course management to participants.

---

# 22. Golden Screen 19 — Review / Publish Queue

## 22.1 Routes

```txt
/admin/review
/admin/review/[courseId]
```

## 22.2 Purpose

Review submitted courses and publish approved courses.

## 22.3 Queue layout blueprint

```txt
Admin shell
Page header
Status tabs or filters
Review queue list/table
Empty state
```

## 22.4 Detail layout blueprint

```txt
Course review header
Course summary
Readiness checklist
Learner preview link
Review comment field
Actions: approve, return for revision, publish if authorized
Status history summary
```

## 22.5 Visual quality rules

1. Keep workflow lightweight.
2. Avoid complex governance.
3. Return reason field must be clear.
4. Publish action must be visually distinct and permission-controlled.

---

# 23. Golden Screen 20 — Monitoring Dashboard

## 23.1 Route

```txt
/admin/monitoring
```

## 23.2 Purpose

Show operational learning monitoring.

## 23.3 Layout blueprint

```txt
Admin shell
Page header
Filter bar
KPI cards
Attention signals
Course progress table
Cohort progress table
Organization participation table
Assessment/certificate summary
Feedback summary
```

## 23.4 KPI cards

1. registered participants;
2. active participants;
3. CSO organizations;
4. cohorts;
5. published courses;
6. enrollments;
7. completion rate;
8. final test pass rate;
9. certificates issued;
10. average feedback rating.

## 23.5 Attention signals

Show concise signals:

1. low completion;
2. low pass rate;
3. low feedback rating;
4. low activity;
5. accessibility/usability issues.

## 23.6 Visual quality rules

1. Must be decision-oriented.
2. Do not overload with charts.
3. Do not claim long-term CSO capacity impact.
4. Do not expose unnecessary participant-level data.
5. Do not add donor CRM dashboards.

---

# 24. Golden Screen 21 — Certificates Admin

## 24.1 Routes

```txt
/admin/certificates
/admin/certificates/settings
/admin/certificates/[certificateId]
```

## 24.2 Purpose

Manage certificate settings and records.

## 24.3 List layout blueprint

```txt
Admin shell
Page header
Filter bar
Certificate table
Settings link
Empty state
```

## 24.4 Detail layout blueprint

```txt
Certificate summary header
Participant/course information
Certificate code
Issue status
Final test score
Download/view action
Revoke action if allowed
```

## 24.5 Visual quality rules

1. Certificate records must be clear.
2. Do not expose unnecessary private participant data.
3. Revocation must be safe and confirmed.
4. Certificate threshold/logic should not be confusing.

---

# 25. Golden Screen 22 — Reference Data

## 25.1 Routes

```txt
/admin/reference-data
```

## 25.2 Purpose

Manage core lookup values.

## 25.3 Layout blueprint

```txt
Admin shell
Page header
Reference category tabs/cards
Selected category table
Add/edit value modal or form
```

## 25.4 Categories

1. Capacity Areas;
2. Course Levels;
3. Organization Types;
4. Regions;
5. Languages.

## 25.5 Visual quality rules

1. Keep simple.
2. Do not build complex taxonomy system.
3. Deactivate rather than hard-delete where records are used.
4. Avoid developer terms.

---

# 26. Golden Screen 23 — Audit Log

## 26.1 Route

```txt
/admin/audit-log
```

## 26.2 Purpose

Show critical platform actions.

## 26.3 Layout blueprint

```txt
Admin shell
Page header
Filter bar
Audit log table
Empty state
```

## 26.4 Table columns

1. timestamp;
2. actor;
3. action;
4. entity;
5. description.

## 26.5 Visual quality rules

1. Keep readable.
2. Do not expose sensitive token/password data.
3. Use plain action labels.
4. Do not overwhelm with raw JSON by default.

---

# 27. Golden Screen 24 — Settings

## 27.1 Route

```txt
/admin/settings
```

## 27.2 Purpose

Manage basic platform settings.

## 27.3 Layout blueprint

```txt
Admin shell
Page header
Settings sections/cards
Save actions
```

## 27.4 Sections

1. Platform identity;
2. Registration/access;
3. Certificate defaults;
4. Support contact;
5. Footer/partner display if implemented.

## 27.5 Visual quality rules

1. Keep simple.
2. Do not build theme/site builder.
3. Do not expose technical environment settings.
4. Do not include advanced Phase 2/3 controls.

---

# 28. Golden Screen 25 — Unauthorized / Access State

## 28.1 Routes

```txt
/unauthorized
```

or protected route state.

## 28.2 Purpose

Explain access restrictions safely.

## 28.3 Layout blueprint

```txt
Centered card
Icon
Headline
Short explanation
Action: return home or sign in with another account
```

## 28.4 Copy direction

```txt
You do not have access to this area.
Please sign in with an account that has the required permission.
```

## 28.5 Visual quality rules

1. Must be calm and safe.
2. Do not reveal sensitive route details.
3. Do not expose internal permission logic.
4. Provide clear next step.

---

# 29. Implementation order for UI

Codex should implement premium UI in this order:

1. Shared design tokens and components.
2. Public shell and landing/course catalogue/course detail.
3. Auth/sign-in screen.
4. Learner shell/dashboard/course player.
5. Creator shell/My Courses/setup screens.
6. Build Studio.
7. Admin shell/dashboard.
8. Admin management screens.
9. Monitoring dashboard.
10. Certificates and final QA.

This order may be adjusted for functional slices, but major UI screens must use the design system from the start.

---

# 30. Codex UI implementation rules

Codex must:

1. use these screen blueprints;
2. use the design system;
3. use reusable components;
4. avoid rough placeholders;
5. avoid developer language;
6. avoid Phase 2/3 active modules;
7. avoid CRM/donor-management UI;
8. keep Build Studio clean;
9. keep learner pages polished;
10. return visual QA evidence for UI slices.

---

# 31. Final blueprint statement

These blueprints define the intended premium product experience for the CSO Learning Hub.

Codex must use them to build a platform that is visually credible, stakeholder-demo ready, accessible, and aligned with the Phase 1 product scope.
