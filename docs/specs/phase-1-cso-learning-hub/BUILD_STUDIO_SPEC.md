# BUILD_STUDIO_SPEC.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Build Studio Specification

## 1. Document purpose

This file defines the deterministic specification for the **Course Builder / Build Studio** in Phase 1 of the CSO Learning Hub.

The Build Studio is a must-build Phase 1 feature.

Codex must use this file as the controlling specification for the authoring interface, block library, canvas behavior, block configuration panel, preview behavior, readiness checks, and learner-template rendering connection.

Codex must not convert the Build Studio into a governance, CRM, diagnosis, monitoring, or compliance-heavy screen.

---

## 2. Build Studio product definition

The Build Studio is a professional block-based course authoring workspace where Course Creators create interactive, multimedia, learner-ready CSO courses.

The Build Studio shall allow Course Creators to:

1. create modules;
2. create lessons;
3. add structured content blocks;
4. configure each selected block;
5. arrange the course sequence;
6. preview the participant-facing lesson or course;
7. prepare the course for review/publishing.

The Build Studio shall be optimized for **clean content creation**.

---

## 3. Core design principle

The Build Studio must feel like:

> “I am creating a course.”

It must not feel like:

> “I am filling a compliance system.”

This principle is non-negotiable.

Governance, diagnosis, capacity mapping, monitoring, donor compliance, CRM-style records, and heavy approval history must not crowd the authoring canvas.

---

## 4. Build Studio route

Recommended route:

```txt
/creator/courses/[courseId]/build
```

Access:

- Course Creator assigned to the course;
- Platform Admin;
- Super Admin;
- other roles only if explicitly granted.

Participants must never access this route.

---

## 5. Layout specification

## 5.1 Required layout

The Build Studio shall use a three-column desktop layout:

```txt
┌──────────────────────┬────────────────────────────────────┬──────────────────────┐
│ Left Panel           │ Center Canvas                      │ Right Panel          │
│ Block Library        │ Course / Lesson Authoring Canvas   │ Block Configuration  │
│ Course Outline       │                                    │                      │
└──────────────────────┴────────────────────────────────────┴──────────────────────┘
```

## 5.2 Layout proportions

Recommended desktop proportions:

1. Left panel: 260–320 px.
2. Center canvas: flexible main area.
3. Right panel: 320–380 px.

The exact width can be adjusted for responsive design, but the three-panel logic must remain.

## 5.3 Responsive behavior

On smaller screens:

1. Left panel may collapse into a drawer.
2. Right panel may collapse into a drawer.
3. Center canvas remains primary.
4. Preview mode should support mobile preview.
5. The participant-facing learner course experience must be especially strong on mobile.

## 5.4 Header area

The Build Studio header shall include:

1. course title;
2. course status;
3. last saved indicator;
4. save action or auto-save indicator;
5. preview button;
6. return to course list/setup button;
7. submit/review button or link, if appropriate.

The header must remain compact.

The header must not include large governance status panels.

---

# 6. Left panel specification

## 6.1 Purpose

The left panel helps the creator select content blocks and navigate the course structure.

## 6.2 Required components

The left panel shall include:

1. Block Library tab/section;
2. Course Outline tab/section;
3. search field for blocks;
4. block category filters;
5. add module action;
6. add lesson action;
7. current module/lesson indicator.

Codex may implement Block Library and Course Outline as tabs, accordion sections, or stacked sections, as long as both are accessible and clean.

---

## 6.3 Block Library

### Purpose

Provide reusable learning block types that Course Creators can add to lessons.

### Required categories

The Block Library shall group blocks into clear categories:

1. **Content**
2. **Media**
3. **Interaction**
4. **Assessment**
5. **Practice**
6. **Navigation / Action**

### Required blocks by category

#### Content

1. Text / Reading
2. Case Study
3. Key Message / Summary
4. Accordion

#### Media

1. Video
2. Audio, if feasible
3. Image / Visual
4. Downloadable Resource
5. External Link

#### Interaction

1. Flashcards
2. Reflection Prompt
3. Button / Call-to-Action
4. Branching Scenario

#### Assessment

1. Knowledge Check
2. Multiple Choice Question
3. True/False Question

#### Practice

1. Practical Activity Prompt
2. Short Answer Prompt for self-reflection only

### Block card display

Each block card in the library shall show:

1. block name;
2. short description;
3. simple icon or visual marker;
4. add action or drag handle.

### Block search

The creator shall be able to search blocks by name or category.

### Add behavior

The creator shall be able to add a block to the selected lesson by:

1. clicking Add;
2. dragging into the canvas, if implemented;
3. using a plus menu in the canvas, if implemented.

At least one add method must be implemented.

---

## 6.4 Course Outline

### Purpose

Show the course structure and allow quick navigation between modules and lessons.

### Required outline hierarchy

```txt
Course
 ├── Module
 │    ├── Lesson
 │    └── Lesson
 └── Module
      └── Lesson
```

### Required outline actions

The outline shall allow creators to:

1. add module;
2. rename module;
3. reorder module;
4. add lesson;
5. rename lesson;
6. reorder lesson;
7. select lesson for editing;
8. see which lesson is currently selected;
9. see whether a lesson has no content blocks.

### Optional outline actions

1. duplicate lesson;
2. duplicate module;
3. collapse/expand modules;
4. delete module/lesson with confirmation.

### Empty state

If no module exists:

Message:

```txt
Start by adding your first module.
```

Action:

```txt
Add Module
```

If a module has no lessons:

Message:

```txt
Add a lesson to begin building this module.
```

Action:

```txt
Add Lesson
```

---

# 7. Center canvas specification

## 7.1 Purpose

The center canvas is the main authoring workspace where the Course Creator builds lesson content.

## 7.2 Canvas states

The center canvas shall support:

1. no selected lesson state;
2. empty lesson state;
3. lesson edit state;
4. lesson preview state;
5. full course preview state, if implemented in this route;
6. saving/error state.

## 7.3 No selected lesson state

When no lesson is selected:

Message:

```txt
Select a lesson from the course outline to start building.
```

Action:

```txt
Add Module / Add Lesson
```

## 7.4 Empty lesson state

When selected lesson has no blocks:

Message:

```txt
This lesson is empty. Add a block from the library to begin.
```

Actions:

1. Add Text;
2. Add Video;
3. Add Resource;
4. Add Knowledge Check;
5. Browse Block Library.

## 7.5 Lesson edit state

When a lesson contains blocks, the center canvas shall show:

1. lesson title;
2. optional lesson description;
3. ordered list of content blocks;
4. add block control between or after blocks;
5. block move controls;
6. block duplicate control;
7. block delete control;
8. block collapse/expand control;
9. selected block state;
10. preview action.

## 7.6 Block display in canvas

Each block card in the canvas shall show:

1. block type label;
2. block title;
3. short content preview;
4. required/optional indicator, if relevant;
5. warning icon if required configuration is missing;
6. selected state if currently selected;
7. move/duplicate/delete actions.

The canvas shall not display the full block configuration form. Configuration belongs in the right panel.

## 7.7 Reordering

The creator shall be able to reorder blocks within a lesson.

Implementation may use:

1. drag-and-drop;
2. move up/down buttons;
3. both.

If drag-and-drop is complex, move up/down buttons are acceptable for Phase 1.

## 7.8 Add block placement

The creator should be able to add blocks:

1. at the end of a lesson;
2. optionally between existing blocks.

Phase 1 minimum: add to end of selected lesson.

## 7.9 Delete behavior

Deleting a block must require confirmation if the block contains content.

Confirmation message:

```txt
Delete this block? This action cannot be undone.
```

If soft-delete is implemented, deleted blocks may be recoverable later, but this is not required in Phase 1.

## 7.10 Duplicate behavior

Duplicate block should create a copy of the selected block in the same lesson after the original.

The duplicated block title may append “Copy”.

## 7.11 Saving behavior

The Build Studio shall support one of the following:

1. auto-save with visible save status; or
2. manual save with visible unsaved changes state.

Recommended:

```txt
Saved
Saving...
Unsaved changes
Save failed
```

## 7.12 Canvas content restrictions

The center canvas must not include:

1. diagnosis panels;
2. capacity map details;
3. action map details;
4. monitoring charts;
5. CRM records;
6. donor compliance panels;
7. full review comment threads;
8. heavy evidence-anchor sections;
9. complex workflow diagrams.

---

# 8. Right panel specification

## 8.1 Purpose

The right panel configures the currently selected block.

It must display only the configuration fields for the selected block.

## 8.2 No block selected state

When no block is selected:

Message:

```txt
Select a block to configure its content and settings.
```

Optional content:

1. short help text;
2. selected lesson details;
3. quick preview button.

## 8.3 Shared block fields

Every block configuration shall include:

1. block title;
2. block required/optional setting, if relevant;
3. estimated duration, optional;
4. accessibility notes or warnings, where relevant.

## 8.4 Right panel restrictions

The right panel must not be used for:

1. course monitoring;
2. diagnosis evidence;
3. capacity mapping;
4. CRM data;
5. donor reporting;
6. large approval history;
7. unrelated settings.

---

# 9. Block type specifications

## 9.1 Text / Reading block

### Purpose

Display written lesson content.

### Required fields

1. title;
2. body text;
3. optional estimated reading time.

### Canvas preview

Show title and first few lines of text.

### Learner rendering

Display as readable formatted text with accessible typography.

---

## 9.2 Video block

### Purpose

Display a video lesson.

### Required fields

1. title;
2. video URL or uploaded video reference;
3. transcript field, recommended;
4. duration;
5. completion rule.

### Recommended fields

1. captions available yes/no;
2. video description.

### Canvas preview

Show title, video source indicator, duration, transcript warning if missing.

### Learner rendering

Show embedded video player, title, optional transcript, and accessible controls.

### Accessibility rule

If transcript is missing, show a lightweight warning.

---

## 9.3 Audio block

### Purpose

Display audio content.

### Required fields

1. title;
2. audio URL or upload reference;
3. transcript field, recommended;
4. duration.

### Learner rendering

Show audio player and transcript if available.

### Note

Audio block may be deferred if the technical stack does not support upload/player setup in early Phase 1, but the data model should not block it.

---

## 9.4 Image / Visual block

### Purpose

Display an image, visual, diagram, or illustration.

### Required fields

1. title;
2. image URL or upload reference;
3. alt text;
4. optional caption.

### Accessibility rule

Alt text is required before publication.

---

## 9.5 Downloadable Resource block

### Purpose

Attach a downloadable file or toolkit.

### Required fields

1. title;
2. resource file/reference;
3. download label;
4. description.

### Recommended fields

1. file type;
2. file size;
3. accessibility check status.

### Learner rendering

Show a clean resource card with download button.

---

## 9.6 External Link block

### Purpose

Link to external content.

### Required fields

1. title;
2. URL;
3. link label;
4. description.

### Learner rendering

Show clear external link card/button.

### Rule

External links should open in a new tab if appropriate.

---

## 9.7 Case Study block

### Purpose

Present a contextual example or scenario.

### Required fields

1. title;
2. scenario;
3. guiding question;
4. learning point.

### Learner rendering

Show scenario in a visually distinct card.

---

## 9.8 Reflection Prompt block

### Purpose

Invite participants to reflect.

### Required fields

1. title;
2. prompt.

### Optional fields

1. guidance text;
2. response required yes/no.

### Phase 1 response storage

Phase 1 may show reflection prompts without storing participant responses. If responses are stored, they must be private by default.

---

## 9.9 Key Message / Summary block

### Purpose

Highlight a key takeaway.

### Required fields

1. title;
2. message;
3. style:
   - info;
   - success;
   - warning;
   - neutral.

### Learner rendering

Show as a visually distinct callout.

---

## 9.10 Accordion block

### Purpose

Show expandable/collapsible content sections.

### Required fields

1. title;
2. accordion items:
   - item title;
   - item body.

### Learner rendering

Display accessible accordion controls.

### Accessibility rule

Accordion must be keyboard accessible.

---

## 9.11 Flashcard block

### Purpose

Support memory, definitions, and concept checks.

### Required fields

1. title;
2. cards:
   - front;
   - back;
3. shuffle yes/no.

### Learner rendering

Display interactive flip cards or accessible reveal cards.

### Accessibility fallback

If flip animation is used, provide accessible reveal behavior.

---

## 9.12 Button / Call-to-Action block

### Purpose

Guide participant to an action or resource.

### Required fields

1. title;
2. button label;
3. target URL or internal action;
4. style.

### Learner rendering

Show clear button with accessible label.

---

## 9.13 Knowledge Check block

### Purpose

Provide low-stakes check-for-understanding.

### Required fields

1. title;
2. question;
3. answer options;
4. correct answer;
5. correct feedback;
6. incorrect feedback;
7. retry allowed yes/no.

### Learner rendering

Interactive question with immediate feedback.

### Rule

Knowledge checks are not necessarily final-test scoring unless explicitly linked.

---

## 9.14 Multiple Choice Question block

### Purpose

Represent a scored or practice multiple choice question.

### Required fields

1. question;
2. answer options;
3. correct answer;
4. explanation;
5. points, if scored.

### Rule

For final-test scoring, prefer linking to QuizQuestion records.

---

## 9.15 True/False Question block

### Purpose

Represent a scored or practice true/false question.

### Required fields

1. statement;
2. correct value;
3. explanation;
4. points, if scored.

---

## 9.16 Short Answer Prompt block

### Purpose

Support self-reflection or open response.

### Required fields

1. prompt;
2. guidance.

### Phase 1 rule

Short answer shall not be auto-scored in Phase 1.

If response storage is implemented, responses must be private by default.

---

## 9.17 Branching Scenario block

### Purpose

Allow participants to explore choices and consequences.

### Required fields

1. scenario title;
2. scenario prompt;
3. decision options;
4. feedback per decision;
5. next step or outcome per decision;
6. learning point.

### Learner rendering

Show scenario, choices, and feedback after selection.

### Phase 1 minimum

A simple one-step branching scenario is acceptable.

Multi-step complex branching may be deferred.

---

## 9.18 Practical Activity Prompt block

### Purpose

Prompt participants to apply learning outside the platform.

### Required fields

1. activity title;
2. instruction;
3. expected output description;
4. estimated time;
5. future proof eligibility flag.

### Phase 1 rule

This block does not implement full practical proof verification.

It may prepare future compatibility by allowing the creator to indicate that the activity may later become evidence/proof eligible.

---

# 10. Preview specification

## 10.1 Preview purpose

Course Creators must be able to immediately see what participants will see.

Preview is central to the Build Studio.

## 10.2 Required preview modes

The system shall support:

1. selected block preview;
2. selected lesson preview;
3. full course preview;
4. desktop preview;
5. mobile preview.

If all preview modes cannot be implemented at once, minimum Phase 1 preview must include:

1. selected lesson preview;
2. full course preview;
3. mobile/desktop viewport toggle.

## 10.3 Preview route

Preview may be embedded in the Build Studio or use route:

```txt
/creator/courses/[courseId]/preview
```

Both are acceptable if preview uses the same learner template rendering logic.

## 10.4 Preview rendering rule

Preview must render from the same content model used by the participant-facing course player.

Codex must not create a fake preview that differs from the live participant template.

## 10.5 Preview warning

Preview must show a small label:

```txt
Preview mode — not visible to participants
```

## 10.6 Preview restrictions

Preview must not show:

1. block configuration controls;
2. admin controls;
3. internal review comments;
4. diagnosis panels;
5. monitoring data.

---

# 11. Published learner rendering connection

The Build Studio content shall automatically render into the participant-facing course template after publishing.

The same block types created in the Build Studio must be supported in the participant course player.

For every block type, there must be:

1. authoring representation;
2. configuration schema;
3. preview representation;
4. participant rendering representation.

Codex must not implement a block type in the Build Studio without participant rendering support.

---

# 12. Readiness checks

## 12.1 Purpose

Readiness checks help creators identify missing content and accessibility issues.

They must remain lightweight.

## 12.2 Required readiness checks

The system shall detect:

1. course title missing;
2. course capacity area missing;
3. learning outcomes missing;
4. no modules;
5. module without lesson;
6. lesson without blocks;
7. video without transcript;
8. image without alt text;
9. resource without label;
10. quiz question without correct answer;
11. certificate-eligible course without final test;
12. final test without questions;
13. pass threshold missing.

## 12.3 Display rule

Readiness checks may appear as:

1. small status chip;
2. warning icon;
3. compact readiness drawer;
4. submit page checklist.

Readiness checks must not appear as large governance panels inside the center canvas.

## 12.4 Severity levels

Use simple severity:

```txt
ERROR
WARNING
INFO
```

Errors block publication.

Warnings allow draft saving but should be reviewed.

Info provides guidance.

---

# 13. Course Builder workflow

## 13.1 Entry

Course Creator opens:

```txt
/creator/courses/[courseId]/build
```

System loads:

1. course title;
2. current course version;
3. modules;
4. lessons;
5. blocks;
6. resources;
7. learning outcomes, if needed for linking;
8. save status.

## 13.2 Create module

Creator can add a module with:

1. title;
2. optional description.

New module appears in course outline.

## 13.3 Create lesson

Creator can add a lesson under a module with:

1. title;
2. optional description.

New lesson becomes selectable.

## 13.4 Add block

Creator selects lesson and adds a block.

New block appears in canvas and becomes selected.

Right panel shows block configuration.

## 13.5 Configure block

Creator fills block fields in the right panel.

Changes save according to save behavior.

Canvas preview updates.

## 13.6 Preview

Creator clicks Preview.

System shows learner-facing rendering.

Creator can return to edit mode.

## 13.7 Submit readiness

Creator goes to Submit/Readiness page or uses header action.

System checks required items.

Creator submits course for review if checks pass or acknowledges warnings.

---

# 14. UI quality requirements

## 14.1 Visual style

The Build Studio shall use:

1. clean light background;
2. white cards/panels;
3. readable typography;
4. strong spacing;
5. subtle borders;
6. clear selected states;
7. simple icons;
8. accessible contrast;
9. calm professional design.

## 14.2 Avoid clutter

The Build Studio shall avoid:

1. excessive badges;
2. large status panels;
3. repeated metadata;
4. dense tables;
5. long instructional text;
6. multi-level nested cards;
7. unnecessary dashboards.

## 14.3 Empty states

Empty states shall be helpful, short, and action-oriented.

## 14.4 Microcopy tone

Microcopy should be clear and supportive.

Examples:

```txt
Add a block to start building this lesson.
Select a block to configure its content.
Preview how participants will experience this lesson.
This video has no transcript yet.
```

---

# 15. Accessibility requirements

The Build Studio and rendered learner blocks shall support:

1. keyboard navigation;
2. visible focus states;
3. semantic headings;
4. form labels;
5. accessible buttons;
6. alt text field for images;
7. transcript field for video/audio;
8. color contrast;
9. no reliance on color alone;
10. accessible accordions;
11. accessible flashcard/reveal behavior;
12. clear error messages.

---

# 16. Data behavior requirements

## 16.1 Content persistence

Each block must persist:

1. type;
2. title;
3. order;
4. configuration;
5. required/optional setting;
6. estimated duration;
7. accessibility metadata.

## 16.2 Structured config

Block config must be stored in structured JSON or typed fields.

Do not store all lesson content as one unstructured HTML blob.

## 16.3 Order preservation

Module, lesson, and block order must be stable after save.

## 16.4 Version awareness

Build Studio edits apply to the current draft course version.

Published version content must not be silently overwritten if participant progress/certificates exist.

---

# 17. Permissions

## 17.1 Course Creator

Can:

1. open assigned draft/returned courses;
2. create/edit modules, lessons, blocks;
3. upload or link resources, if enabled;
4. preview course;
5. submit for review.

Cannot:

1. publish unless also Admin;
2. edit archived courses;
3. edit courses not assigned to them unless allowed.

## 17.2 Admin

Can:

1. open all courses;
2. edit or assign creators;
3. review;
4. publish/unpublish/archive;
5. access Build Studio if needed.

## 17.3 Participant

Cannot access Build Studio.

---

# 18. Acceptance criteria

## 18.1 Layout acceptance

The Build Studio displays:

1. left Block Library / Course Outline panel;
2. center Course Canvas;
3. right Block Configuration panel;
4. compact header with save and preview actions.

## 18.2 Authoring acceptance

A Course Creator can:

1. create a module;
2. create a lesson;
3. add a text block;
4. add a video block;
5. add a resource block;
6. add a case study block;
7. add a flashcard block;
8. add an accordion block;
9. add a knowledge check block;
10. add a branching scenario block;
11. configure each selected block;
12. reorder blocks;
13. duplicate a block;
14. delete a block;
15. save changes.

## 18.3 Preview acceptance

A Course Creator can:

1. preview selected lesson;
2. preview full course;
3. switch to mobile preview;
4. see the same learner template used in participant course player.

## 18.4 Clean UI acceptance

The Build Studio does not show:

1. diagnosis panels;
2. capacity map panels;
3. monitoring charts;
4. CRM sections;
5. heavy governance panels;
6. donor compliance blocks;
7. large review history panels.

## 18.5 Readiness acceptance

The system shows lightweight warnings for:

1. empty lesson;
2. missing transcript;
3. missing alt text;
4. missing quiz correct answer;
5. missing final test for certificate course.

## 18.6 Participant rendering acceptance

Every block created in the Build Studio renders correctly in the participant-facing course template.

---

# 19. Implementation sequencing for Codex

Codex should implement Build Studio in the following order:

## Step 1 — Static layout

Create three-column layout with placeholder data.

## Step 2 — Course outline

Implement module/lesson structure and selection.

## Step 3 — Block library

Implement block categories and add-block action.

## Step 4 — Canvas rendering

Render blocks in selected lesson with move/duplicate/delete controls.

## Step 5 — Right configuration panel

Implement shared block fields and selected-block configuration.

## Step 6 — Core blocks

Implement first block set:

1. Text;
2. Video;
3. Resource;
4. Image;
5. Case Study;
6. Key Message.

## Step 7 — Interactive blocks

Implement:

1. Accordion;
2. Flashcard;
3. Knowledge Check;
4. Branching Scenario;
5. Reflection Prompt;
6. Practical Activity Prompt.

## Step 8 — Preview

Implement lesson/full-course preview using learner template.

## Step 9 — Readiness checks

Implement lightweight warnings.

## Step 10 — Persistence and testing

Connect to data model and verify save/load/reorder/preview.

---

# 20. Codex control rules

Codex must follow these rules:

1. Do not add governance-heavy UI to Build Studio.
2. Do not add diagnosis/capacity map/action map panels.
3. Do not add monitoring charts to Build Studio.
4. Do not add CRM functions.
5. Do not implement a block type without learner rendering support.
6. Do not store course content as one large HTML field.
7. Do not break the three-column authoring model.
8. Do not make preview a fake static mockup.
9. Do not expose Build Studio to participants.
10. Do not publish incomplete courses without readiness checks.

---

# 21. Final Build Studio statement

The Phase 1 Build Studio shall be a clean, professional, block-based course authoring tool.

It shall help DEC/WHH course creators convert existing training materials into interactive, accessible, learner-ready digital courses.

It shall support immediate preview and automatic rendering into a high-quality participant-facing learning template.

It shall protect future Learning Hub expansion while avoiding governance-heavy, crowded, CRM-style, or diagnosis-heavy authoring screens.
