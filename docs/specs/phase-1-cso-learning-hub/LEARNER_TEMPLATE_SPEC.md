# LEARNER_TEMPLATE_SPEC.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Learner Template Specification

## 1. Document purpose

This file defines the deterministic specification for the **participant-facing learner course template** in Phase 1 of the CSO Learning Hub.

Codex must use this file as the controlling specification for how published courses render to CSO participants.

The learner template must be clean, modern, accessible, mobile-first, and high quality. It must not look like a basic file repository or a simple uploaded-PDF page.

---

## 2. Product intent

The learner-facing course experience is the public quality face of the CSO Learning Hub.

When a course is published from the Course Builder / Build Studio, it shall automatically render into a polished participant-facing course template.

The participant experience shall allow CSO participants to:

1. understand the course purpose;
2. start or continue learning easily;
3. navigate modules and lessons;
4. consume video, text, case studies, resources, and interactive blocks;
5. complete knowledge checks and final tests;
6. track progress;
7. receive certificates after meeting completion and pass rules;
8. provide feedback.

---

## 3. Core learner experience principle

The learner template must feel like:

> “This is a professional digital course designed for me.”

It must not feel like:

> “This is a folder of uploaded training materials.”

The course experience must be structured, readable, interactive, and confidence-building for local and grassroots CSO participants.

---

## 4. Required learner-facing routes

The learner template applies mainly to these routes:

```txt
/courses/[courseSlug]
/learn
/learn/my-courses
/learn/courses/[courseSlug]
/learn/courses/[courseSlug]/lessons/[lessonId]
/learn/courses/[courseSlug]/final-test
/learn/certificates
/learn/certificates/[certificateId]
/learn/courses/[courseSlug]/feedback
```

If the framework uses a single course player route without separate lesson routes, the same functional behavior must be preserved.

---

# 5. Learner site structure

## 5.1 Public course detail page

Route:

```txt
/courses/[courseSlug]
```

### Purpose

Help participants understand whether a course is relevant before starting.

### Required sections

1. Course hero/header.
2. Course summary.
3. Learning outcomes.
4. Course information card.
5. Module outline.
6. Certificate information.
7. Start/enroll button.
8. Accessibility/resource note, if useful.

### Required data shown

1. course title;
2. short description;
3. long description or overview;
4. capacity area;
5. target audience;
6. course level;
7. estimated duration;
8. language;
9. certificate eligible yes/no;
10. learning outcomes;
11. module/lesson count;
12. enrollment/start status.

### Must not show

1. draft status;
2. internal review status;
3. creator edit controls;
4. admin controls;
5. unpublished modules;
6. internal readiness checks.

---

## 5.2 Participant dashboard

Route:

```txt
/learn
```

### Purpose

Provide the participant’s learning home.

### Required sections

1. Welcome header.
2. Continue learning card.
3. My active courses.
4. Completed courses.
5. Certificates.
6. Available or assigned courses.
7. Help/support note.

### Required data shown

1. participant name;
2. enrolled courses;
3. course progress;
4. last accessed course;
5. certificate count;
6. completion status.

### Empty state

If no courses are enrolled:

```txt
You do not have any courses yet. Browse available courses or wait for an assigned course from your programme team.
```

---

## 5.3 My Courses page

Route:

```txt
/learn/my-courses
```

### Purpose

List participant courses.

### Required features

1. course cards;
2. search;
3. filter by:
   - not started;
   - in progress;
   - completed;
   - certificate earned;
4. continue/start button;
5. progress display.

### Course card fields

1. course title;
2. capacity area;
3. estimated duration;
4. progress percentage;
5. completion status;
6. certificate status;
7. continue/start action.

---

# 6. Course player template

## 6.1 Route

Recommended:

```txt
/learn/courses/[courseSlug]
```

Optional lesson deep-link route:

```txt
/learn/courses/[courseSlug]/lessons/[lessonId]
```

## 6.2 Purpose

Render the full participant-facing course experience.

## 6.3 Required layout

Desktop layout should include:

```txt
┌──────────────────────────────────────────────────────────────┐
│ Course Header / Progress                                     │
├───────────────────────┬──────────────────────────────────────┤
│ Course Outline        │ Lesson Content Area                  │
│ Module/Lesson Nav     │ Interactive Learning Blocks          │
└───────────────────────┴──────────────────────────────────────┘
```

Mobile layout should prioritize:

1. course header;
2. lesson content;
3. collapsible course outline;
4. bottom/inline previous-next controls.

## 6.4 Course header

The course header shall show:

1. course title;
2. progress percentage;
3. current module/lesson;
4. completion status;
5. continue/next action, where useful.

The header must remain compact.

## 6.5 Course outline navigation

The course outline shall show:

1. modules;
2. lessons under each module;
3. current lesson indicator;
4. completed lesson indicator;
5. locked/unavailable state if sequencing is enforced;
6. final test link when available.

The outline must be collapsible on mobile.

## 6.6 Lesson content area

The lesson content area shall show:

1. lesson title;
2. lesson description, optional;
3. ordered content blocks;
4. resource downloads where included;
5. knowledge checks/interactions;
6. mark complete or automatic completion;
7. previous/next lesson controls.

## 6.7 Progress behavior

Progress shall update based on:

1. lesson completion;
2. final test completion/pass, where required;
3. course completion criteria.

Progress must be visible but not visually overwhelming.

---

# 7. Learner rendering for Build Studio blocks

Every block created in the Build Studio must render correctly in the learner template.

## 7.1 Text / Reading block

### Rendering

Display formatted text with:

1. readable line length;
2. clear headings;
3. accessible typography;
4. adequate spacing.

### Must avoid

1. tiny font;
2. overly wide paragraphs;
3. low contrast.

---

## 7.2 Video block

### Rendering

Display:

1. video player;
2. title;
3. duration if available;
4. transcript toggle or transcript section if provided;
5. caption note if available.

### Accessibility

1. Player must be keyboard accessible where technically possible.
2. Transcript should be visible or expandable.
3. If transcript is missing, do not block the learner, but show creator/admin warning in authoring side.

---

## 7.3 Audio block

### Rendering

Display:

1. audio player;
2. title;
3. transcript if available.

### Note

Audio may be deferred in early implementation if not technically ready, but the learner template should not block future support.

---

## 7.4 Image / Visual block

### Rendering

Display:

1. image;
2. caption if provided;
3. accessible alt text behind image.

### Accessibility

Alt text is required for publication readiness.

---

## 7.5 Downloadable Resource block

### Rendering

Show a resource card with:

1. resource title;
2. description;
3. file type;
4. download button;
5. file size if available.

### UX

Download button should be clear and easy to tap on mobile.

---

## 7.6 External Link block

### Rendering

Show a link card or button with:

1. title;
2. description;
3. external link indicator;
4. accessible button/link label.

---

## 7.7 Case Study block

### Rendering

Show a visually distinct case-study card with:

1. scenario;
2. guiding question;
3. learning point.

### UX

Case studies should feel contextual and practical, not like plain text only.

---

## 7.8 Reflection Prompt block

### Rendering

Show:

1. reflection prompt;
2. guidance text, if provided;
3. optional private note input if implemented.

### Phase 1 response rule

If participant response storage is not implemented, show the prompt as a thinking/reflection activity.

If response storage is implemented, responses must be private by default.

---

## 7.9 Key Message / Summary block

### Rendering

Show a clear callout with:

1. message;
2. visual style:
   - info;
   - success;
   - warning;
   - neutral.

### Accessibility

Callout meaning must not depend on color alone.

---

## 7.10 Accordion block

### Rendering

Show accessible expandable sections.

### Required behavior

1. keyboard accessible;
2. clear expanded/collapsed state;
3. works on mobile;
4. content readable after expansion.

---

## 7.11 Flashcard block

### Rendering

Show interactive cards with front/back content.

### Required behavior

1. tap/click to reveal;
2. keyboard accessible reveal;
3. clear progress if multiple cards;
4. no reliance on animation only.

---

## 7.12 Button / Call-to-Action block

### Rendering

Show a clear button or action link.

### Required behavior

1. accessible label;
2. target opens correctly;
3. external links indicate external destination where appropriate.

---

## 7.13 Knowledge Check block

### Rendering

Show an interactive question with:

1. question text;
2. answer options;
3. submit/check button;
4. immediate feedback;
5. retry behavior if enabled.

### Rule

Knowledge checks are low-stakes unless explicitly tied to scored quiz/final test.

---

## 7.14 Multiple Choice Question block

### Rendering

For practice use, render like a knowledge check.

For final test use, render inside final test page with scoring and submission rules.

---

## 7.15 True/False Question block

### Rendering

For practice use, render like a knowledge check.

For final test use, render inside final test page with scoring and submission rules.

---

## 7.16 Short Answer Prompt block

### Rendering

Show prompt and guidance.

### Phase 1 rule

Short answer is not auto-scored.

If response storage is not implemented, show as self-reflection.

---

## 7.17 Branching Scenario block

### Rendering

Show:

1. scenario prompt;
2. decision options;
3. selected decision feedback;
4. learning point;
5. reset/retry option.

### Phase 1 minimum

One-step branching is acceptable.

Multi-step branching may be deferred.

---

## 7.18 Practical Activity Prompt block

### Rendering

Show:

1. activity instruction;
2. expected output;
3. estimated time;
4. optional note that this is for practice/application.

### Phase 1 rule

No full practical proof verification is required.

Do not ask participants to upload formal evidence unless a later approved spec adds practical proof.

---

# 8. Final test template

## 8.1 Route

```txt
/learn/courses/[courseSlug]/final-test
```

## 8.2 Purpose

Allow participant to complete the course final test.

## 8.3 Required sections

1. Test title.
2. Instructions.
3. Pass threshold.
4. Number of questions.
5. Attempt information.
6. Questions.
7. Submit button.
8. Result screen.

## 8.4 Question rendering

Final test shall support:

1. multiple choice;
2. true/false.

Optional future support:

1. short answer, manual review only;
2. scenario-based scored questions.

## 8.5 Submission behavior

After submission, show:

1. score;
2. percentage;
3. pass/fail result;
4. explanation/feedback if configured;
5. retake option if allowed;
6. certificate link if passed and completion rules are met.

## 8.6 Retake behavior

If retakes are allowed, show:

1. number of attempts used;
2. remaining attempts if max attempts exists;
3. retake button.

If retakes are not allowed, show clear message.

---

# 9. Certificate experience

## 9.1 Certificate list route

```txt
/learn/certificates
```

### Required content

1. certificate cards;
2. course title;
3. completion date;
4. certificate ID/code;
5. download/view action.

## 9.2 Certificate detail route

```txt
/learn/certificates/[certificateId]
```

### Required content

1. participant name;
2. course title;
3. issuing organization;
4. completion date;
5. certificate ID/code;
6. download PDF button;
7. verification note if implemented.

## 9.3 Certificate locked state

If participant has not met requirements:

Show:

```txt
Certificate not yet available.
Complete the required lessons and pass the final test to receive your certificate.
```

Do not show confusing technical details.

---

# 10. Feedback experience

## 10.1 Route

```txt
/learn/courses/[courseSlug]/feedback
```

## 10.2 Purpose

Collect participant feedback for course improvement.

## 10.3 Required fields

1. overall rating;
2. usefulness;
3. clarity;
4. accessibility/usability issues;
5. open comment;
6. suggestion for improvement.

## 10.4 Confirmation

After submission:

```txt
Thank you. Your feedback will help improve this course.
```

---

# 11. Visual and UX requirements

## 11.1 Visual quality

The learner template shall use:

1. clean layout;
2. readable typography;
3. generous spacing;
4. clear course cards;
5. clear progress indicators;
6. accessible colors;
7. modern buttons;
8. calm professional visual style.

## 11.2 Tone

Microcopy shall be simple, supportive, and action-oriented.

Examples:

```txt
Continue learning
Start course
Mark lesson complete
Take final test
Download certificate
You have completed this lesson
Your certificate is ready
```

## 11.3 Avoid

The learner template shall avoid:

1. dense admin language;
2. internal workflow terms;
3. technical database terms;
4. cluttered sidebars;
5. too many badges/status chips;
6. exposing review/publish information;
7. showing creator configuration fields.

---

# 12. Mobile-first requirements

The participant-facing experience must work well on mobile.

## 12.1 Mobile course player

On mobile:

1. course outline should collapse;
2. lesson content should appear first;
3. previous/next controls should be easy to tap;
4. video player should resize properly;
5. resource cards should be tappable;
6. quiz options should be easy to select;
7. flashcards/accordions should work with touch.

## 12.2 Mobile dashboard

Dashboard cards must stack cleanly.

## 12.3 Mobile certificate

Certificate may be viewed and downloaded; PDF layout may be optimized separately.

---

# 13. Accessibility requirements

The learner template shall support:

1. keyboard navigation;
2. visible focus states;
3. semantic page headings;
4. accessible form labels;
5. sufficient color contrast;
6. alt text for images;
7. transcript support for video/audio;
8. accessible accordion behavior;
9. accessible flashcard reveal behavior;
10. clear error messages;
11. no reliance on color alone;
12. readable font size;
13. screen-reader-friendly buttons and links.

---

# 14. Data behavior

## 14.1 Course rendering source

Learner template must render from the same structured content model used by the Build Studio.

Do not create a separate hard-coded learner version of the course.

## 14.2 Progress tracking

The system shall track:

1. lesson start;
2. lesson completion;
3. final test attempts;
4. course completion;
5. certificate issuance.

## 14.3 Continue learning

The system should remember the participant’s last accessed course/lesson where feasible.

## 14.4 Published-only rule

Participants shall only see published courses.

Draft, returned, approved-but-unpublished, archived, and internal-preview courses must not appear in participant course catalogue or course player.

---

# 15. Access rules

## 15.1 Public access

Public users may view:

1. landing page;
2. course catalogue if public;
3. published course detail page if public.

## 15.2 Authenticated participant access

Authenticated participants may:

1. access enrolled/assigned courses;
2. enroll in public courses if enrollment is open;
3. view progress;
4. take final tests;
5. receive certificates;
6. submit feedback.

## 15.3 No creator/admin controls

Participant routes must not show:

1. edit buttons;
2. block configuration;
3. publish/unpublish actions;
4. review comments;
5. admin-only metadata.

---

# 16. Empty and edge states

## 16.1 No courses available

```txt
No courses are available yet.
```

## 16.2 No enrolled courses

```txt
You have not started any courses yet.
```

## 16.3 Course unavailable

```txt
This course is not currently available to your account.
```

## 16.4 No certificate yet

```txt
Your certificate is not available yet.
Complete the required lessons and pass the final test to receive it.
```

## 16.5 Quiz failed

```txt
You did not reach the pass score this time.
Review the course and try again if retakes are available.
```

## 16.6 Quiz passed

```txt
Congratulations. You passed the final test.
```

## 16.7 Feedback submitted

```txt
Thank you. Your feedback has been submitted.
```

---

# 17. Quality acceptance criteria

## 17.1 Learner course rendering acceptance

A published course created in the Build Studio renders in the learner template with:

1. course header;
2. module/lesson navigation;
3. lesson content;
4. all block types displayed correctly;
5. progress indicator;
6. final test access;
7. certificate access after passing.

## 17.2 Participant completion acceptance

A participant can:

1. open a published course;
2. complete lessons;
3. interact with blocks;
4. download resources;
5. take the final test;
6. pass the final test;
7. receive a certificate;
8. download the certificate;
9. submit feedback.

## 17.3 Mobile acceptance

The learner course works on mobile without broken layout, hidden actions, unusable quiz controls, or unreadable content.

## 17.4 Accessibility acceptance

The learner template passes basic accessibility checks for keyboard navigation, form labels, headings, color contrast, focus states, and alt/transcript support.

## 17.5 Separation acceptance

The learner template does not expose creator/admin/review/publish controls.

---

# 18. Implementation sequencing for Codex

Codex should implement learner template in this order:

## Step 1 — Public course detail template

Build `/courses/[courseSlug]` using published course data.

## Step 2 — Participant dashboard

Build `/learn` and `/learn/my-courses`.

## Step 3 — Course player shell

Build `/learn/courses/[courseSlug]` with course header, outline, and lesson content area.

## Step 4 — Basic block rendering

Render text, video, image, resource, case study, and key message blocks.

## Step 5 — Interactive block rendering

Render accordion, flashcards, knowledge checks, reflection prompts, branching scenarios, and practical activity prompts.

## Step 6 — Progress tracking

Track lesson progress and course progress.

## Step 7 — Final test

Build final test route, submission, scoring, pass/fail result.

## Step 8 — Certificate experience

Build certificate list, certificate detail, and download flow.

## Step 9 — Feedback

Build course feedback form and summary connection.

## Step 10 — Mobile and accessibility QA

Test and fix mobile and accessibility issues.

---

# 19. Codex control rules

Codex must follow these rules:

1. Do not create a low-quality file repository experience.
2. Do not show unpublished courses to participants.
3. Do not expose Build Studio controls in learner routes.
4. Do not create fake rendering separate from Build Studio block data.
5. Do not add social/collaboration features in Phase 1 learner template.
6. Do not implement practical proof upload/verification unless explicitly requested later.
7. Do not add CRM or donor-reporting UI to learner pages.
8. Do not block learners with internal workflow status.
9. Do not use inaccessible interactive components.
10. Do not issue certificates unless completion/pass rules are met.

---

# 20. Final learner template statement

The Phase 1 learner template shall provide a polished, accessible, mobile-first digital course experience for CSO participants.

It shall render Build Studio courses into high-quality participant-facing lessons with structured navigation, interactive blocks, resources, progress tracking, final tests, certificates, and feedback.

It shall make the CSO Learning Hub feel credible, modern, and useful to local and grassroots CSOs from the first release.
