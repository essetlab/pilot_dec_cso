# IMAGE_MOCKUP_PROMPTS.md

# DEC / WHH CSF+ CSO Learning Hub — Image Mockup Prompt Pack

## 1. Document purpose

This file provides controlled high-fidelity mockup-generation prompts for the DEC / WHH CSF+ CSO Learning Hub Phase 1 UI/UX design process.

It is intended to help generate premium visual mockups using GPT-5.5 image generation or any high-quality UI mockup generation tool.

The prompts in this file must be used together with:

```txt
docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
docs/design/DESIGN_SYSTEM.md
docs/design/UI_SCREEN_BLUEPRINTS.md
docs/design/COMPONENT_LIBRARY.md
docs/design/CODEX_UI_SKILL.md
docs/design/VISUAL_QA_CHECKLIST.md
```

The goal is to produce improved, implementation-ready golden screen mockups that preserve continuity with the previously presented landing page and course catalogue designs while correcting weaknesses and aligning the UI with the current Phase 1 product direction.

---

## 2. Mockup-generation strategy

Do not generate all screens at once.

Generate and approve mockups in this order:

1. Improved Landing Page
2. Improved Course Catalogue
3. Course Detail Page
4. Learner Dashboard
5. Learner Course Player
6. Certificate Page
7. Course Creator My Courses
8. Build Studio
9. Admin Dashboard
10. Monitoring Dashboard

The first two screens are the visual continuity anchors.

Once the improved landing page and course catalogue are approved, all other learner/public screens must extend the same design system.

---

## 3. Required reference images

Before generating the first mockups, store the uploaded previous screenshots under:

```txt
docs/design/reference/previous-landing-page.png
docs/design/reference/previous-course-catalogue.png
```

These are reference images only.

They should guide:

1. overall visual tone;
2. section structure;
3. editorial headline style;
4. contextual local imagery;
5. course-card browsing direction;
6. dark institutional footer direction.

They should not be copied exactly.

---

## 4. Universal mockup prompt rules

Every image-generation prompt must include these rules:

```txt
Use the uploaded previous screenshot as a continuity reference, not as an exact template.
Preserve the premium, editorial, locally grounded CSO learning-platform feeling.
Improve consistency, spacing, typography, accessibility, and brand alignment.
Use DEC Primary Blue #3B99D4 and DEC Accent Green #91C852.
Use Deep Navy #0F172A, Light Background #F9FAFB, White cards, subtle borders, and soft shadows.
Use a strong editorial heading style on public/learner marketing pages and clean sans-serif UI text.
Replace all old text with current Phase 1 CSO Learning Hub messaging.
Do not show developer language such as placeholder, slice, mock data, scaffold, DB, Prisma, TODO, or WIP.
Do not show Phase 2/3 active modules.
Do not show CRM or donor-management UI.
Do not show admin/creator controls on public or learner pages.
Make the design implementation-ready for a Next.js + Tailwind application.
Use realistic CSO learning context and avoid generic Western corporate imagery.
```

---

## 5. Universal negative prompt

Use this negative prompt with every mockup request where the tool supports negative prompting:

```txt
Avoid generic SaaS landing page, basic admin template, raw wireframe, developer placeholder, cluttered dashboard, low-quality stock imagery, random color palette, inconsistent badges, unreadable tiny text, lorem ipsum, technical labels, database language, code snippets, mock data labels, CRM pipeline, donor management, grants pipeline, diagnosis dashboard, capacity map screen, action map screen, collaboration module, co-creation module, practical proof verification, badge verification, crowded governance panels, excessive charts, distorted logos, stretched partner logos, inaccessible contrast, mobile-unfriendly layout.
```

---

# 6. Prompt 1 — Improved Landing Page

## 6.1 Purpose

Generate an improved landing page mockup that preserves the stakeholder-liked homepage direction while making it more polished, consistent, DEC-branded, and current.

## 6.2 Use

Use after uploading or referencing:

```txt
docs/design/reference/previous-landing-page.png
```

## 6.3 Prompt

```txt
Create a high-fidelity desktop web landing page mockup for the DEC / WHH CSF+ CSO Learning Hub.

Use the uploaded previous landing page screenshot as a continuity reference, not as an exact template. Preserve the premium editorial feeling, the locally grounded hero image direction, the large headline style, the sectioned storytelling flow, the course showcase idea, the strong CTA panel, and the dark institutional footer with partner recognition.

Improve the design to make it more consistent, refined, accessible, and implementation-ready.

Brand and visual system:
- Use DEC Primary Blue #3B99D4 and DEC Accent Green #91C852.
- Use Deep Navy #0F172A for hero overlay/footer.
- Use Light Background #F9FAFB and White #FFFFFF for sections and cards.
- Use subtle borders #E5E7EB, soft shadows, generous spacing, and rounded cards.
- Use an editorial serif-style display headline for the hero and selected public headings.
- Use clean sans-serif UI/body typography.
- Use consistent icon style, badges, buttons, and card design.
- Keep the design premium, calm, credible, and locally grounded.

Page structure:
1. Top navigation:
   - DEC logo on the left
   - Home
   - About
   - Courses
   - Verify Certificate
   - Language selector
   - Sign In
   - Register button
2. Hero section:
   - Full-width contextual image showing local CSO learning, group discussion, training, planning, or collaborative work in an Ethiopian/local context.
   - Dark navy overlay for readability.
   - Eyebrow: “DEC Learning Platform”
   - Large headline: “Learn, Adapt, Grow”
   - Subtitle: “Practical digital learning for local and grassroots CSOs.”
   - Primary CTA: “Explore Courses”
   - Secondary CTA: “Start Learning”
   - Small trust markers: “Mobile-friendly”, “Practical”, “Step-by-step”, “Certificate-ready”
3. Core Features section:
   - Four polished cards:
     - Practical and work-ready
     - Grounded in local CSO realities
     - Structured learning journeys
     - Certificates and progress tracking
4. About the Platform section:
   - Two-column layout.
   - Left: concise explanation of the platform.
   - Right: local contextual image or refined product preview card showing a CSO learning dashboard on laptop/mobile.
   - Use small value bullets such as self-paced learning, interactive lesson blocks, mobile-friendly access, context-specific content.
5. Course Showcase section:
   - Three polished course cards using consistent card system.
   - Use current Phase 1 course examples:
     - Proposal Development Fundamentals for Grassroots CSOs
     - Financial Management Basics for Local CSOs
     - Safeguarding Essentials for Grassroots CSOs
   - Each card should show capacity area, duration/lesson count, certificate indicator, and a clean action.
6. Learning Experience section:
   - Clean grid of six features:
     - Structured journeys
     - Interactive blocks
     - Knowledge checks
     - Progress tracking
     - Resource library
     - Certificates
7. CTA section:
   - Large rounded DEC Blue panel.
   - Headline: “Ready to start your CSO learning journey?”
   - Supporting text: “Explore practical courses designed to strengthen local organizational learning.”
   - Buttons: “Go to Catalog” and “Sign In”
8. Footer:
   - Deep navy footer.
   - DEC Learning identity.
   - Short platform description.
   - Platform links.
   - Account links.
   - Partner logo strip area.
   - Copyright/privacy/terms.

Important:
- Do not reuse old prototype text except where specified.
- Do not show admin or creator links.
- Do not show Phase 2/3 modules.
- Do not show CRM or donor-management elements.
- Do not include developer words like placeholder, mock data, scaffold, slice, TODO, DB, Prisma, or WIP.
- Make the mockup look like a real premium learning platform ready for stakeholder presentation.
- Use a 16:9 desktop web screenshot composition, but show enough vertical page content to communicate the full landing page flow.
```

## 6.4 Review checklist

Approve only if:

1. it clearly connects to the previous landing page;
2. it looks more polished than the previous version;
3. DEC colors are more consistent;
4. content matches current Phase 1 messaging;
5. course cards are cleaner;
6. no developer/internal language appears;
7. it feels stakeholder-demo ready.

---

# 7. Prompt 2 — Improved Course Catalogue

## 7.1 Purpose

Generate an improved course catalogue mockup that preserves the previous catalogue structure while fixing inconsistency, card quality, filters, badges, and visual hierarchy.

## 7.2 Use

Use after uploading or referencing:

```txt
docs/design/reference/previous-course-catalogue.png
```

## 7.3 Prompt

```txt
Create a high-fidelity desktop web mockup for the Course Catalogue page of the DEC / WHH CSF+ CSO Learning Hub.

Use the uploaded previous course catalogue screenshot as a continuity reference, not as an exact template. Preserve the large page identity, search/filter area, featured course concept, and card-based course browsing direction. Improve consistency, spacing, metadata hierarchy, badge styling, card quality, and DEC brand alignment.

Brand and visual system:
- Use DEC Primary Blue #3B99D4 and DEC Accent Green #91C852.
- Use Deep Navy #0F172A for strong text and institutional accents.
- Use Light Background #F9FAFB, White cards, subtle borders #E5E7EB, soft shadows, and rounded 20–24px cards.
- Use editorial serif-style display heading for the page title.
- Use clean sans-serif UI text.
- Use consistent badges and course-card metadata.
- Use high-quality, locally relevant course cover imagery or controlled illustration/photo system.

Page structure:
1. Public top navigation:
   - DEC logo
   - Home
   - About
   - Courses
   - Verify Certificate
   - Language selector
   - Sign In
   - Register button
2. Page header:
   - Eyebrow: “Learning Portal”
   - Large title: “Course Catalog”
   - Subtitle: “Explore practical courses designed for local and grassroots CSOs.”
3. Search and filters:
   - Search input: “Search courses...”
   - Capacity area dropdown
   - Access dropdown
   - Certificate dropdown
   - Course level dropdown
   - Clean, horizontally aligned on desktop and stackable on mobile.
4. Featured course section:
   - Label: “Featured Course”
   - Large featured card for “Proposal Development Fundamentals for Grassroots CSOs”
   - Include capacity badge “Proposal Development”
   - Access badge “Public”
   - Certificate included indicator
   - Duration: “90 minutes”
   - Level: “Foundational”
   - CTA: “Explore Course”
   - Use consistent image ratio and polished layout.
5. Course grid:
   - 3-column grid on desktop.
   - Six course cards:
     - Proposal Development Fundamentals for Grassroots CSOs
     - Financial Management Basics for Local CSOs
     - Safeguarding Essentials for Grassroots CSOs
     - Governance Basics for Local CSOs
     - MEAL Foundations for Local CSOs
     - Human Rights-Based Approach in Practice
   - Each card includes:
     - cover image
     - capacity area label
     - title
     - short description clamped to 2 lines
     - duration or lesson count
     - access label
     - certificate included indicator
     - clear action icon/button.
6. Footer area may be hinted at if space allows.

Important:
- Do not use old inconsistent card styling.
- Do not use random badge colors.
- Do not embed too much text inside course thumbnails.
- Do not show draft/internal review status.
- Do not show admin or creator controls.
- Do not show Phase 2/3 modules.
- Do not show CRM/donor-management UI.
- Do not include developer words like placeholder, mock data, scaffold, slice, TODO, DB, Prisma, or WIP.
- Make this feel like a premium course marketplace/library for CSO learning.
- Make it implementation-ready for Next.js + Tailwind.
```

## 7.4 Review checklist

Approve only if:

1. it still feels connected to the previous catalogue;
2. cards are much more consistent;
3. filters are cleaner;
4. badges and metadata are clear;
5. DEC colors are consistent;
6. no internal course states appear;
7. it looks like a polished course library.

---

# 8. Prompt 3 — Course Detail Page

## 8.1 Purpose

Generate a new course detail page that extends the approved landing/catalogue direction.

## 8.2 Prompt

```txt
Create a high-fidelity desktop web mockup for the Course Detail page of the DEC / WHH CSF+ CSO Learning Hub.

This page should visually extend the improved landing page and course catalogue design direction. It should feel like a premium public course information page for local and grassroots CSO participants.

Brand:
- Use DEC Primary Blue #3B99D4 and DEC Accent Green #91C852.
- Use Deep Navy #0F172A, Light Background #F9FAFB, White cards, subtle borders, rounded corners, and soft shadows.
- Use editorial display typography for the course title and clean sans-serif for UI text.

Route context:
- Public course detail page for a published course.
- Do not show admin, creator, draft, review, or internal readiness information.

Course:
- Title: “Proposal Development Fundamentals for Grassroots CSOs”
- Capacity Area: “Proposal Development”
- Level: “Foundational”
- Duration: “90 minutes”
- Certificate: “Certificate included”
- Audience: “Local and grassroots CSO staff, volunteers, and focal persons”
- CTA: “Start Course” or “Sign In to Start”

Page structure:
1. Public top navigation.
2. Course hero section:
   - left: course title, short description, badges, CTA;
   - right: course information card with duration, level, language, certificate, lessons/modules.
3. Main content:
   - course overview;
   - learning outcomes as checkmark list;
   - module outline in accordion/list format;
   - what you will practice;
   - certificate information.
4. Side card or sticky card:
   - Start course button;
   - course access;
   - estimated duration;
   - certificate included.
5. Footer or compact footer hint.

Learning outcomes:
- Explain the core elements of a simple project proposal.
- Convert a community problem into a clear project goal and objective.
- Identify target groups, activities, outputs, and expected results.
- Recognize common weaknesses in grassroots CSO proposal writing.
- Prepare a basic proposal outline for internal review or coaching.

Module outline:
- Understanding the Proposal Logic
- Building the Proposal Structure
- Final Test and Next Steps

Important:
- Do not show internal course lifecycle status.
- Do not show Build Studio, admin, or creator actions.
- Do not show Phase 2/3 modules.
- Do not show CRM/donor-management elements.
- No developer language.
- Make it premium, clear, and implementation-ready.
```

---

# 9. Prompt 4 — Learner Dashboard

## 9.1 Purpose

Generate the authenticated learner dashboard.

## 9.2 Prompt

```txt
Create a high-fidelity desktop web app mockup for the Learner Dashboard of the DEC / WHH CSF+ CSO Learning Hub.

The design must extend the approved public landing/catalogue visual direction but become more functional and learner-focused. It should feel warm, calm, and supportive, not like an admin dashboard.

Brand:
- DEC Primary Blue #3B99D4
- DEC Accent Green #91C852
- Deep Navy #0F172A
- Light Background #F9FAFB
- White cards, subtle borders, soft shadows, rounded corners.

Route:
- /learn

Learner navigation:
- Dashboard
- My Courses
- Certificates
- Profile

Page structure:
1. Learner top bar with DEC Learning identity and user menu.
2. Welcome panel:
   - “Welcome back, Participant”
   - “Continue your CSO learning journey and track your progress.”
3. Large Continue Learning card:
   - Course: “Proposal Development Fundamentals for Grassroots CSOs”
   - Current lesson: “From Community Problem to Project Objective”
   - Progress: 40%
   - CTA: “Continue Learning”
4. Progress summary cards:
   - Courses in progress
   - Courses completed
   - Certificates earned
5. My active courses section:
   - 2–3 course cards with progress bars.
6. Available / assigned courses section:
   - course cards using the approved course card system.
7. Certificates preview:
   - one certificate card or locked certificate state.
8. Support/help card:
   - short supportive note about contacting programme team.

Important:
- Do not show admin or creator controls.
- Do not show internal course statuses.
- Do not use developer language.
- Do not show Phase 2/3 modules.
- Keep it warm and learner-focused.
- Make it mobile-conscious and implementation-ready.
```

---

# 10. Prompt 5 — Learner Course Player

## 10.1 Purpose

Generate the participant-facing course player.

## 10.2 Prompt

```txt
Create a high-fidelity desktop web app mockup for the Learner Course Player of the DEC / WHH CSF+ CSO Learning Hub.

This is the participant-facing course experience. It must feel like a professional digital course designed for local and grassroots CSO participants, not a file repository.

Brand:
- DEC Primary Blue #3B99D4
- DEC Accent Green #91C852
- Deep Navy #0F172A
- Light Background #F9FAFB
- White cards, subtle borders, soft shadows, rounded corners.
- Clean sans-serif UI text with readable lesson typography.

Route:
- /learn/courses/proposal-development-fundamentals-grassroots-csos

Course:
- Proposal Development Fundamentals for Grassroots CSOs
- Progress: 40%
- Current module: Understanding the Proposal Logic
- Current lesson: From Community Problem to Project Objective

Layout:
1. Learner top bar.
2. Compact course header:
   - course title
   - progress bar
   - current module/lesson
3. Two-column learning layout:
   - left: collapsible course outline with modules and lessons;
   - right: lesson content area.
4. Course outline:
   - Module 1: Understanding the Proposal Logic
     - What Makes a Proposal Fundable? completed
     - From Community Problem to Project Objective current
   - Module 2: Building the Proposal Structure
   - Module 3: Final Test and Next Steps
5. Lesson content:
   - lesson title
   - short lesson introduction
   - Text block card
   - Key message callout
   - Flashcard block
   - Branching scenario block
   - Practical activity prompt block
6. Bottom navigation:
   - Previous lesson
   - Mark complete
   - Next lesson

Important:
- Do not show Build Studio controls.
- Do not show block configuration.
- Do not show admin/creator controls.
- Do not show internal readiness or review status.
- Do not show raw JSON or developer language.
- Make block rendering polished and educational.
- Make the course player readable, accessible, and mobile-conscious.
```

---

# 11. Prompt 6 — Certificate Page

## 11.1 Purpose

Generate the participant certificate page.

## 11.2 Prompt

```txt
Create a high-fidelity desktop web app mockup for the Participant Certificate page of the DEC / WHH CSF+ CSO Learning Hub.

The page should feel like a professional achievement record, not a plain database record.

Brand:
- DEC Primary Blue #3B99D4
- DEC Accent Green #91C852
- Deep Navy #0F172A
- White cards, soft shadows, rounded corners.
- Use restrained certificate gold accents only where useful.

Route:
- /learn/certificates/[certificateId]

Layout:
1. Learner shell and navigation.
2. Page header:
   - “Certificate”
   - “View and download your course certificate.”
3. Main two-column layout:
   - left: certificate preview panel;
   - right: certificate information card.
4. Certificate preview:
   - DEC Learning identity
   - “Certificate of Completion”
   - Participant name
   - Course title: “Proposal Development Fundamentals for Grassroots CSOs”
   - Issued by Development Expertise Center
   - Completion date
   - Certificate code
5. Info card:
   - course
   - issue date
   - certificate code
   - final test status
   - download button
6. Related action:
   - Back to certificates
   - Continue learning

Important:
- Do not expose internal certificate logic.
- Do not show database IDs as primary content.
- Do not show developer language.
- Keep design professional, calm, and achievement-oriented.
```

---

# 12. Prompt 7 — Course Creator My Courses

## 12.1 Purpose

Generate the creator portal starting screen.

## 12.2 Prompt

```txt
Create a high-fidelity desktop web app mockup for the Course Creator “My Courses” page of the DEC / WHH CSF+ CSO Learning Hub.

This screen should extend the public/learner visual system but become a calm course-production workspace. It must not look like a generic admin dashboard or a compliance system.

Brand:
- DEC Primary Blue #3B99D4
- DEC Accent Green #91C852
- Deep Navy #0F172A
- Light Background #F9FAFB
- White cards, subtle borders, soft shadows.

Route:
- /creator/courses

Layout:
1. Creator shell with navigation:
   - My Courses
   - Setup
   - Metadata
   - Outcomes
   - Build Studio
   - Resources
   - Final Test
   - Preview
   - Submit / Feedback
2. Page header:
   - “My Courses”
   - “Create and manage structured digital courses for CSO participants.”
   - Primary action: “Create Course”
3. Summary cards:
   - Draft courses
   - Ready for review
   - Published
   - Returned for revision
4. Filter/search bar:
   - search
   - status
   - capacity area
5. Course cards/list:
   - Proposal Development Fundamentals for Grassroots CSOs
   - Financial Management Basics for Local CSOs
   - Safeguarding Essentials for Grassroots CSOs
   Each card shows status, capacity area, last updated, readiness summary, continue editing, preview.
6. Empty state pattern shown as small optional area or not shown if list has records.

Important:
- Do not show admin-only actions unless authorized.
- Do not show full diagnosis/capacity map/action map workflows.
- Do not show CRM/donor management.
- Do not include developer language.
- Keep it clean, practical, and premium.
```

---

# 13. Prompt 8 — Build Studio

## 13.1 Purpose

Generate the premium three-column Build Studio mockup.

## 13.2 Prompt

```txt
Create a high-fidelity desktop web app mockup for the Build Studio of the DEC / WHH CSF+ CSO Learning Hub.

This is the professional block-based course authoring workspace. It must feel like “I am creating a course,” not “I am filling a compliance system.”

Brand:
- DEC Primary Blue #3B99D4
- DEC Accent Green #91C852
- Deep Navy #0F172A
- Light Background #F9FAFB
- White panels, subtle borders, soft shadows, rounded corners.
- Clean sans-serif UI typography.

Route:
- /creator/courses/[courseId]/build

Required layout:
1. Creator shell/navigation.
2. Compact Build Studio header:
   - course title: “Proposal Development Fundamentals for Grassroots CSOs”
   - status badge: Draft
   - save state: Saved
   - Preview button
   - Save button
3. Three-column workspace:
   - Left panel: Block Library + Course Outline
   - Center panel: Course Canvas
   - Right panel: Block Configuration

Left panel:
- Tabs or sections for Block Library and Course Outline.
- Block categories:
  - Content
  - Media
  - Interaction
  - Assessment
  - Practice
- Show block cards:
  - Text / Reading
  - Video
  - Resource
  - Case Study
  - Flashcards
  - Knowledge Check
  - Branching Scenario
  - Practical Activity
- Course outline:
  - Module 1: Understanding the Proposal Logic
  - Lesson: What Makes a Proposal Fundable?
  - Lesson: From Community Problem to Project Objective
  - Module 2: Building the Proposal Structure

Center canvas:
- Selected lesson: “From Community Problem to Project Objective”
- Ordered block cards:
  - Text / Reading
  - Key Message
  - Flashcards
  - Branching Scenario
  - Practical Activity
- Each block card shows type, title, short preview, move/duplicate/delete actions.
- Add block button at bottom.

Right panel:
- Selected block configuration for “Branching Scenario”
- Fields:
  - block title
  - scenario prompt
  - decision options
  - feedback per option
  - learning point
- Keep the panel clean and focused only on selected block.

Important restrictions:
- Do not show diagnosis panels.
- Do not show capacity map or action map panels.
- Do not show monitoring charts.
- Do not show CRM or donor compliance.
- Do not show heavy governance cards.
- Do not show review history in the canvas.
- Do not include developer language.
- Keep the screen spacious, premium, and implementation-ready.
```

---

# 14. Prompt 9 — Admin Dashboard

## 14.1 Purpose

Generate the admin dashboard mockup.

## 14.2 Prompt

```txt
Create a high-fidelity desktop web app mockup for the Admin Dashboard of the DEC / WHH CSF+ CSO Learning Hub.

This should feel like a calm operational control center for managing the learning platform. It must not look like a CRM, donor pipeline, or heavy compliance dashboard.

Brand:
- DEC Primary Blue #3B99D4
- DEC Accent Green #91C852
- Deep Navy #0F172A
- Light Background #F9FAFB
- White cards, subtle borders, soft shadows, rounded corners.
- Clean sans-serif UI typography.

Route:
- /admin

Admin navigation:
- Dashboard
- Users
- Organizations
- Cohorts
- Courses
- Review / Publish
- Certificates
- Reference Data
- Monitoring
- Audit Log
- Settings

Page structure:
1. Admin shell with sidebar and top bar.
2. Page header:
   - “Admin Dashboard”
   - “Manage learning platform activity, users, courses, and certificates.”
3. KPI cards:
   - Users
   - Participants
   - CSO Organizations
   - Cohorts
   - Courses
   - Published Courses
   - Active Enrollments
   - Completions
   - Certificates Issued
   - Awaiting Review
4. Quick actions:
   - Add User
   - Add Organization
   - Create Cohort
   - Review Courses
   - View Monitoring
5. Courses needing attention:
   - concise table/list.
6. Recent platform activity:
   - user/course/certificate activity.
7. Recent certificates or feedback summary.

Important:
- Do not show donor CRM metrics.
- Do not show funding pipeline.
- Do not show full diagnosis/capacity analytics.
- Do not show Phase 2/3 modules.
- Do not show developer language.
- Keep it operational, calm, and uncluttered.
```

---

# 15. Prompt 10 — Monitoring Dashboard

## 15.1 Purpose

Generate the monitoring dashboard mockup.

## 15.2 Prompt

```txt
Create a high-fidelity desktop web app mockup for the Monitoring Dashboard of the DEC / WHH CSF+ CSO Learning Hub.

This screen should support operational learning monitoring: participation, progress, completion, assessment, certificates, and feedback. It must not claim long-term CSO capacity impact and must not become a donor CRM dashboard.

Brand:
- DEC Primary Blue #3B99D4
- DEC Accent Green #91C852
- Deep Navy #0F172A
- Light Background #F9FAFB
- White cards, subtle borders, soft shadows, rounded corners.
- Clean sans-serif UI typography.

Route:
- /admin/monitoring

Layout:
1. Admin shell with sidebar and top bar.
2. Page header:
   - “Monitoring”
   - “Track course participation, completion, assessment, certification, and feedback.”
3. Filter bar:
   - course
   - cohort
   - organization
   - region
   - capacity area
   - date range
4. KPI cards:
   - Registered Participants
   - Active Participants
   - CSO Organizations
   - Cohorts
   - Published Courses
   - Enrollments
   - Completion Rate
   - Final Test Pass Rate
   - Certificates Issued
   - Average Course Rating
5. Attention signals:
   - Low completion
   - Low activity
   - Feedback issues
6. Course progress table:
   - course title, capacity area, enrollments, active participants, completed, completion rate, pass rate, certificates, rating.
7. Cohort progress table.
8. Organization participation table.
9. Assessment/certificate summary.
10. Feedback summary.

Important:
- Use charts sparingly.
- Prioritize cards and readable tables.
- Do not show donor CRM, grants pipeline, or funding metrics.
- Do not show diagnosis/capacity map/action map analytics.
- Do not overexpose participant personal data.
- Do not include developer language.
- Keep the dashboard decision-oriented, clean, and premium.
```

---

# 16. Mobile mockup prompts

After desktop approval, generate mobile versions for the highest-priority screens:

1. Landing page mobile
2. Course catalogue mobile
3. Learner dashboard mobile
4. Learner course player mobile
5. Build Studio narrow/tablet behavior

## 16.1 Generic mobile prompt wrapper

```txt
Create a high-fidelity mobile web mockup for [SCREEN NAME] of the DEC / WHH CSF+ CSO Learning Hub.

Use the approved desktop mockup and design system as reference. Preserve the same brand, content hierarchy, and visual language, but adapt it for a 390px-wide mobile viewport.

Requirements:
- No horizontal overflow.
- Navigation collapses cleanly.
- Cards stack vertically.
- Buttons are easy to tap.
- Text remains readable.
- Course images scale cleanly.
- Forms stack.
- Course outline collapses on learner course player.
- Build Studio panels collapse into drawers or stacked sections where relevant.
- No developer language.
- No Phase 2/3 modules.
- No CRM/donor-management UI.
```

---

# 17. Prompt-to-design-file conversion process

After a mockup is approved, create a per-screen design file:

```txt
docs/design/screens/[screen-folder]/DESIGN.md
```

Each `DESIGN.md` must include:

1. screen name;
2. route;
3. approved visual reference;
4. purpose;
5. layout structure;
6. components used;
7. content rules;
8. responsive behavior;
9. accessibility notes;
10. Codex implementation instructions;
11. visual QA checklist.

The image alone is not enough for Codex.

---

# 18. Codex implementation prompt template for approved mockups

Use this after a screen has an approved mockup and `DESIGN.md`.

```txt
Plan first.

Implement [SCREEN NAME] for the DEC / WHH CSF+ CSO Learning Hub.

Before making changes, read:
- docs/design/00_VISUAL_SOURCE_OF_TRUTH.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md
- docs/design/screens/[screen-folder]/DESIGN.md
- relevant product specs under docs/specs/phase-1-cso-learning-hub/

Use the approved screen mockup:
docs/design/screens/[screen-folder]/screen.png

Objective:
Implement the screen to match the approved mockup and design spec as closely as practical using Next.js, TypeScript, and Tailwind.

Constraints:
- Do not invent a new layout.
- Do not create generic or placeholder-style UI.
- Do not show developer language.
- Do not add Phase 2/3 active modules.
- Do not add CRM/donor-management UI.
- Preserve role-appropriate navigation.
- Use reusable components from COMPONENT_LIBRARY.md.
- Ensure responsive behavior.
- Ensure accessibility basics.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- route smoke check
- desktop visual check
- mobile visual check
- screenshot or visual notes

Return the required evidence pack and include the Premium UI / Visual QA section.
```

---

# 19. Final mockup prompt statement

Image mockups are not decoration. They are design-control assets.

The purpose of these prompts is to create approved golden screens that Codex can implement without improvising weak or inconsistent UI.

The final UI must preserve continuity with the previous stakeholder-liked design while improving consistency, brand alignment, accessibility, and product readiness.
