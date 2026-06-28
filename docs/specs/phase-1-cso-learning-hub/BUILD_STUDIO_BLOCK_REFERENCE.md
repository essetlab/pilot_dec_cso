# BUILD_STUDIO_BLOCK_REFERENCE.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Build Studio Block Reference

## 1. Document purpose

This file defines the Phase 1 block reference for the CSO Learning Hub Build Studio.

It translates the selected course-authoring block types into developer-facing specifications for Codex or any AI coding agent implementing the Build Studio.

Codex must use this file together with:

```txt
docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
docs/specs/phase-1-cso-learning-hub/DATA_MODEL.md
docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md
docs/design/DESIGN_SYSTEM.md
docs/design/COMPONENT_LIBRARY.md
docs/design/CODEX_UI_SKILL.md
docs/design/VISUAL_QA_CHECKLIST.md
```

The purpose is to prevent Codex from inventing generic, inconsistent, overbuilt, or future-phase block behavior.

---

## 2. Product position

The Build Studio is a professional block-based authoring workspace for creating structured, interactive, learner-ready CSO courses.

The Build Studio must feel like:

> “I am creating a course.”

It must not feel like:

> “I am filling a compliance system.”

Codex must keep the Build Studio clean, practical, and focused on course authoring.

Do not crowd the Build Studio with diagnosis panels, capacity map details, monitoring charts, donor compliance cards, CRM records, practical proof verification, badges, or advanced Phase 2/3 modules.

---

## 3. Source references used

This block reference is informed by:

1. The approved Phase 1 Build Studio specification.
2. The approved Phase 1 learner template specification.
3. The Phase 1 data model, especially the structured `Course → CourseVersion → Module → Lesson → ContentBlock` model.
4. Uploaded reference material on common course-authoring blocks, including text, statement, image, multimedia, interactive blocks, knowledge checks, scenarios, flashcards, reflections, and applied activities.

The external block references are used as inspiration only. They must not be copied as a full authoring-suite feature set.

---

## 4. Selected Phase 1 block set

Phase 1 Build Studio shall implement only the following selected block types.

### 4.1 Stage 1 — Core blocks

Implement first:

1. Text
2. Video
3. Resource
4. Image
5. Case Study
6. Key Message

### 4.2 Stage 2 — Interactive blocks

Implement after Stage 1 is stable:

1. Accordion
2. Flashcards
3. Knowledge Check
4. Branching Scenario
5. Reflection
6. Practical Activity

---

## 5. User-facing naming rules

Use these labels in the Build Studio UI, learner preview, and learner course player:

```txt
Text
Video
Resource
Image
Case Study
Key Message
Accordion
Flashcards
Knowledge Check
Branching Scenario
Reflection
Practical Activity
```

Do not show the following labels in the user interface:

```txt
Reflection Prompt
Practical Activity Prompt
```

If the internal enum already uses `REFLECTION_PROMPT` or `PRACTICAL_ACTIVITY_PROMPT`, it may remain internally to avoid unnecessary schema churn. However, all creator-facing and learner-facing labels must use:

```txt
Reflection
Practical Activity
```

---

## 6. Recommended Build Studio block categories

The left Block Library should group selected Phase 1 blocks into these categories.

| Build Studio category | Blocks |
|---|---|
| Content | Text, Case Study, Key Message |
| Media & Resources | Video, Image, Resource |
| Interaction | Accordion, Flashcards, Branching Scenario |
| Assessment & Reflection | Knowledge Check, Reflection, Practical Activity |

Keep the category system simple. Do not expose a large Rise-style or generic authoring-suite taxonomy in Phase 1.

---

## 7. Explicitly out of Phase 1 block implementation

Do not implement these blocks in Phase 1 unless a later approved change note explicitly adds them:

1. Gallery
2. Tabs
3. Labeled Graphic
4. Process
5. Sorting Activity
6. Matching
7. Timeline
8. Chart
9. Hotspots
10. Custom Code
11. Storyline/custom interaction embed
12. Image Comparison
13. Full assignment submission workflow
14. Practical proof verification
15. Badge verification
16. AI authoring assistant

These may be future candidates, but they must not distract from the selected Phase 1 block set.

---

## 8. Shared block lifecycle

Every selected block follows this lifecycle:

1. Creator selects a lesson.
2. Creator adds a block from the left Block Library.
3. Block appears in the center Course Canvas.
4. Creator selects the block.
5. Right-side Block Configuration panel opens.
6. Creator configures required fields.
7. Creator saves.
8. Learner renderer displays the block in the participant-facing course.
9. Readiness checks flag missing required or recommended fields.

---

## 9. Required views for every block

Every block must define and support three views.

### 9.1 Block Library card

The left-panel card must include:

1. block name;
2. short description;
3. category;
4. simple icon or visual marker;
5. add action.

### 9.2 Build Studio canvas card

The center canvas card must include:

1. block type label;
2. title or fallback title;
3. short content preview;
4. required/missing configuration warning if relevant;
5. selected state;
6. move up/down controls;
7. duplicate action;
8. delete action;
9. collapse/expand control where useful.

The full editing form must not appear inside the canvas card. Editing belongs in the right configuration panel.

### 9.3 Learner renderer

The participant-facing learner renderer must include:

1. polished learner UI;
2. mobile-friendly layout;
3. no creator/admin controls;
4. no internal implementation labels;
5. accessibility-friendly rendering.

---

## 10. Shared base block shape

Codex may adapt this shape to the existing repository conventions, but the meaning must remain stable.

```ts
type BaseContentBlock = {
  id: string;
  lessonId: string;
  type: ContentBlockType;
  title?: string;
  order: number;
  isRequired?: boolean;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
```

The course content model must remain structured:

```txt
Course → CourseVersion → Module → Lesson → ContentBlock
```

Do not collapse course content into one large unstructured HTML field.

---

## 11. Validation severity levels

Use three levels of validation.

### 11.1 Required

A block with missing required fields can be saved as a draft, but the course should not be submitted for review or marked publication-ready until the issue is resolved.

### 11.2 Recommended

A soft warning. It does not block review by itself but should help creators improve quality.

### 11.3 Accessibility warning

A warning related to accessibility. Some accessibility warnings should block publication readiness when they affect core access, such as missing alt text for meaningful images.

---

## 12. Shared accessibility rules

Across all blocks:

1. Use visible focus states.
2. Ensure keyboard-accessible controls.
3. Do not communicate meaning by color alone.
4. Maintain sufficient contrast.
5. Use semantic headings where relevant.
6. Require alt text for meaningful images.
7. Provide transcript guidance for video/audio.
8. Provide clear feedback for interactions.
9. Use tappable controls on mobile.
10. Avoid collecting sensitive personal information through learning blocks.

---

# Stage 1 — Core Blocks

---

## 13. Text Block

### 13.1 Purpose

The Text block presents core lesson explanation, reading content, instructions, definitions, or short conceptual guidance.

### 13.2 Build Studio category

Content

### 13.3 Block Library card

```txt
Name: Text
Description: Add lesson explanation, instructions, definitions, or short reading content.
Category: Content
```

### 13.4 Best used for

1. lesson introductions;
2. concept explanations;
3. step-by-step guidance;
4. definitions;
5. short reading sections;
6. context before another block.

### 13.5 Avoid using it for

1. long PDF-style content;
2. complex tables;
3. highly visual examples;
4. important callouts that should be Key Message;
5. interactive learning decisions.

### 13.6 Creator configuration fields

```ts
type TextBlockConfig = {
  heading?: string;
  body: string;
  readingTimeMinutes?: number;
  width?: "standard" | "wide";
};
```

Required:

```txt
body
```

Recommended:

```txt
heading
```

### 13.7 Canvas behavior

Show:

1. `Text` label;
2. heading if available;
3. first lines of body;
4. missing body warning.

Example warning:

```txt
Add text content before this lesson can be reviewed.
```

### 13.8 Learner rendering

Display:

1. optional heading;
2. formatted text body;
3. readable line length;
4. clean spacing;
5. accessible typography.

### 13.9 Interaction behavior

Passive reading block. No learner action required.

### 13.10 Validation

Required:

1. body is not empty.

Recommended:

1. heading exists for long text;
2. very long body suggests breaking into smaller blocks.

### 13.11 Accessibility

1. Use semantic heading structure.
2. Ensure readable font size and contrast.
3. Links inside text must be identifiable.
4. Avoid long walls of text.

### 13.12 Mobile behavior

1. Text stacks full-width.
2. No horizontal scrolling.
3. Paragraphs remain readable.

### 13.13 Example

```txt
Heading:
What is a problem statement?

Body:
A problem statement explains what is happening, who is affected, where it is happening, and why it matters. It helps a CSO move from a broad concern to a clear project idea.
```

### 13.14 Phase 1 minimum

1. heading;
2. rich/plain text body;
3. basic formatting support if already available.

### 13.15 Later enhancement

1. tables;
2. two-column layout;
3. AI writing support;
4. audio narration.

### 13.16 Out of scope now

1. advanced table editor;
2. document import;
3. embedded media inside text.

---

## 14. Video Block

### 14.1 Purpose

The Video block adds trainer explanations, recorded sessions, demonstrations, interviews, or short learning clips.

### 14.2 Build Studio category

Media & Resources

### 14.3 Block Library card

```txt
Name: Video
Description: Add an embedded or uploaded video with transcript guidance.
Category: Media & Resources
```

### 14.4 Best used for

1. short trainer explanations;
2. demonstrations;
3. interviews;
4. local/contextual examples;
5. visual walkthroughs.

### 14.5 Avoid using it for

1. long recordings without structure;
2. content with no description or transcript guidance;
3. materials better shared as Resource;
4. videos that are not accessible to participants.

### 14.6 Creator configuration fields

```ts
type VideoBlockConfig = {
  title: string;
  sourceType: "embed_url" | "uploaded_file" | "external_link";
  sourceUrl: string;
  description?: string;
  durationMinutes?: number;
  transcript?: string;
  captionsAvailable?: boolean;
  thumbnailUrl?: string;
};
```

Required:

```txt
title
sourceType
sourceUrl
```

Recommended:

```txt
description
durationMinutes
transcript
captionsAvailable
```

### 14.7 Source behavior

The Video block must support:

1. `embed_url` — for YouTube, Vimeo, or approved hosted video platforms where embedding works.
2. `uploaded_file` — for internally stored videos if platform storage supports it.
3. `external_link` — for video links that cannot be embedded but can be opened externally.

Video is not upload-only.

### 14.8 Canvas behavior

Show:

1. `Video` label;
2. title;
3. source type badge;
4. duration if provided;
5. transcript/caption status;
6. warning if source is missing.

### 14.9 Learner rendering

For `embed_url`:

1. show embedded responsive player.

For `uploaded_file`:

1. show native/platform video player.

For `external_link`:

1. show video card with button: `Open video`.

Always show:

1. title;
2. description;
3. transcript section if available.

### 14.10 Interaction behavior

Learner can:

1. play embedded/uploaded video;
2. open external video;
3. read transcript if provided.

### 14.11 Validation

Required:

1. title;
2. source type;
3. source URL.

Recommended:

1. description;
2. transcript;
3. duration;
4. captions available flag.

Accessibility warning:

1. transcript missing;
2. captions unavailable.

### 14.12 Accessibility

1. Transcript should be supported.
2. Captions should be encouraged.
3. Video should not be the only place where essential learning content appears.
4. External video button must be keyboard accessible.

### 14.13 Mobile behavior

1. Video player responsive.
2. Transcript collapsible.
3. External link button easy to tap.

### 14.14 Example

```txt
Title:
Turning a community problem into a project idea

Source type:
embed_url

Description:
A short trainer video explaining how grassroots CSOs can move from community concerns to a clear project idea.

Transcript:
In this video, we look at three questions: who is affected, what is changing, and why the issue matters now...
```

### 14.15 Phase 1 minimum

1. embedded URL support;
2. external link fallback;
3. uploaded file reference if storage already supports it;
4. transcript field.

### 14.16 Later enhancement

1. automatic caption checks;
2. video completion tracking;
3. video analytics;
4. multiple video sources.

### 14.17 Out of scope now

1. video editing;
2. automatic transcription;
3. advanced playback analytics;
4. required watch completion.

---

## 15. Resource Block

### 15.1 Purpose

The Resource block gives participants downloadable or openable learning materials such as templates, worksheets, checklists, PDFs, Word files, Excel files, or external guides.

### 15.2 Build Studio category

Media & Resources

### 15.3 Block Library card

```txt
Name: Resource
Description: Share a downloadable file, worksheet, template, checklist, or useful external resource.
Category: Media & Resources
```

### 15.4 Best used for

1. templates;
2. worksheets;
3. checklists;
4. toolkits;
5. reading documents;
6. offline practice files;
7. external reference links.

### 15.5 Avoid using it for

1. lesson explanation;
2. random document dumping;
3. file upload by learners;
4. assignment submission;
5. practical proof verification.

### 15.6 Creator configuration fields

```ts
type ResourceBlockConfig = {
  title: string;
  description?: string;
  sourceType: "uploaded_file" | "external_link";
  sourceUrl: string;
  resourceType?: "pdf" | "doc" | "spreadsheet" | "presentation" | "template" | "link" | "other";
  fileName?: string;
  fileSizeLabel?: string;
  buttonLabel?: string;
};
```

Required:

```txt
title
sourceType
sourceUrl
```

Recommended:

```txt
description
resourceType
buttonLabel
```

### 15.7 Canvas behavior

Show:

1. `Resource` label;
2. title;
3. source type;
4. file/resource type;
5. warning if source missing.

### 15.8 Learner rendering

Show resource card with:

1. title;
2. description;
3. file/resource type;
4. download/open button;
5. file size if available.

### 15.9 Interaction behavior

Learner can:

1. download file;
2. open link;
3. return to lesson.

### 15.10 Validation

Required:

1. title;
2. source type;
3. source URL.

Recommended:

1. description;
2. resource type;
3. clear button label.

### 15.11 Accessibility

1. Button text must be descriptive.
2. File/link type must be visible.
3. External links should be identified.
4. Avoid vague labels like “click here.”

### 15.12 Mobile behavior

1. Card stacks cleanly.
2. Button easy to tap.
3. Long filenames wrap.

### 15.13 Example

```txt
Title:
Problem Statement Worksheet

Description:
Use this worksheet to draft a simple problem statement for your project idea.

Source type:
uploaded_file

Resource type:
template

Button label:
Download worksheet
```

### 15.14 Phase 1 minimum

1. upload/file reference or external link;
2. title and description;
3. learner download/open card.

### 15.15 Later enhancement

1. resource library;
2. versioned files;
3. access tracking.

### 15.16 Out of scope now

1. learner upload;
2. assignment submission;
3. practical proof verification.

---

## 16. Image Block

### 16.1 Purpose

The Image block adds visual support such as diagrams, contextual photos, infographics, examples, or simple visual explanations.

### 16.2 Build Studio category

Media & Resources

### 16.3 Block Library card

```txt
Name: Image
Description: Add a visual, diagram, contextual photo, or infographic with caption and alt text.
Category: Media & Resources
```

### 16.4 Best used for

1. diagrams;
2. photos from training/community context;
3. problem tree visuals;
4. infographics;
5. sample forms;
6. process illustrations.

### 16.5 Avoid using it for

1. decorative filler;
2. text-heavy screenshots;
3. galleries;
4. image comparisons;
5. uncaptioned visuals.

### 16.6 Creator configuration fields

```ts
type ImageBlockConfig = {
  title?: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  displaySize?: "standard" | "wide";
};
```

Required:

```txt
imageUrl
altText
```

Recommended:

```txt
caption
```

### 16.7 Canvas behavior

Show:

1. `Image` label;
2. thumbnail;
3. caption/title;
4. alt text status;
5. warning if alt text missing.

### 16.8 Learner rendering

Show:

1. responsive image;
2. caption below image;
3. optional title;
4. alt text behind the image.

### 16.9 Interaction behavior

Phase 1:

1. view image;
2. read caption.

Optional later:

1. click to enlarge.

### 16.10 Validation

Required:

1. image exists;
2. alt text exists.

Recommended:

1. caption exists if the learning meaning is not obvious.

### 16.11 Accessibility

1. Alt text required for meaningful images.
2. Avoid images that contain essential text unless repeated in normal text.
3. Caption should explain learning relevance.
4. Do not rely only on visual interpretation.

### 16.12 Mobile behavior

1. Image scales.
2. Caption readable.
3. No horizontal overflow.

### 16.13 Example

```txt
Title:
Example problem tree

Alt text:
A problem tree diagram showing root causes below a central problem and effects above it.

Caption:
A problem tree helps CSOs organize causes and effects before designing a project.
```

### 16.14 Phase 1 minimum

1. image;
2. alt text;
3. caption;
4. responsive learner renderer.

### 16.15 Later enhancement

1. image zoom;
2. crop settings;
3. image library.

### 16.16 Out of scope now

1. gallery;
2. carousel;
3. hotspot/labeled graphic;
4. image comparison.

---

## 17. Case Study Block

### 17.1 Purpose

The Case Study block presents a realistic CSO situation so learners can connect concepts to practice.

### 17.2 Build Studio category

Content

### 17.3 Block Library card

```txt
Name: Case Study
Description: Present a realistic CSO situation with a guiding question and learning point.
Category: Content
```

### 17.4 Best used for

1. local/contextual examples;
2. applied analysis;
3. realistic CSO dilemmas;
4. group discussion starters;
5. linking concepts to practice.

### 17.5 Avoid using it for

1. simple explanations;
2. short reminders;
3. complex branching decisions;
4. graded assessment;
5. proof submission.

### 17.6 Creator configuration fields

```ts
type CaseStudyBlockConfig = {
  title: string;
  context?: string;
  scenario: string;
  guidingQuestion?: string;
  learningPoint: string;
  discussionQuestion?: string;
};
```

Required:

```txt
title
scenario
learningPoint
```

Recommended:

```txt
context
guidingQuestion
```

### 17.7 Canvas behavior

Show:

1. `Case Study` label;
2. title;
3. scenario preview;
4. guiding question if available;
5. warning if learning point missing.

### 17.8 Learner rendering

Show distinct case-study card with:

1. title;
2. context;
3. scenario;
4. guiding question;
5. learning point;
6. optional discussion question.

### 17.9 Interaction behavior

Phase 1:

1. learner reads case;
2. learner thinks/discusses using guiding question.

If deeper learner response is needed, pair with Reflection block.

### 17.10 Validation

Required:

1. title;
2. scenario;
3. learning point.

Recommended:

1. guiding question;
2. context.

### 17.11 Accessibility

1. Use clear headings.
2. Keep paragraphs readable.
3. Do not rely only on color/icon styling.
4. Avoid long unstructured scenario text.

### 17.12 Mobile behavior

1. Card stacks.
2. Scenario remains readable.
3. Learning point visually clear.

### 17.13 Example

```txt
Title:
A grassroots CSO preparing a small grant proposal

Scenario:
A youth-led CSO wants to apply for a small grant, but their proposal describes many problems at once and does not clearly identify the main change they want to support.

Guiding question:
What should the team clarify before writing activities and budget lines?

Learning point:
A strong proposal starts with one clear problem, a realistic target group, and a focused change statement.
```

### 17.14 Phase 1 minimum

1. scenario;
2. guiding question;
3. learning point;
4. polished learner case-study card.

### 17.15 Later enhancement

1. discussion mode;
2. linked reflection;
3. facilitator notes.

### 17.16 Out of scope now

1. scored case response;
2. peer discussion;
3. branching case logic;
4. evidence submission.

---

## 18. Key Message Block

### 18.1 Purpose

The Key Message block highlights a short takeaway, reminder, warning, principle, or summary.

### 18.2 Build Studio category

Content

### 18.3 Block Library card

```txt
Name: Key Message
Description: Highlight an important takeaway, reminder, warning, or summary.
Category: Content
```

### 18.4 Best used for

1. “remember this” moments;
2. important principles;
3. short summaries;
4. warnings;
5. definitions;
6. takeaways after a concept.

### 18.5 Avoid using it for

1. long explanations;
2. case examples;
3. questions;
4. activities;
5. multi-paragraph content.

### 18.6 Creator configuration fields

```ts
type KeyMessageBlockConfig = {
  message: string;
  supportingText?: string;
  tone?: "info" | "success" | "warning" | "neutral";
};
```

Required:

```txt
message
```

Recommended:

```txt
tone
```

### 18.7 Canvas behavior

Show:

1. `Key Message` label;
2. tone;
3. message preview;
4. warning if message missing.

### 18.8 Learner rendering

Show:

1. highlighted callout card;
2. message;
3. optional supporting text;
4. tone icon/label.

### 18.9 Interaction behavior

No interaction required.

### 18.10 Validation

Required:

1. message.

Recommended:

1. tone selected;
2. message kept short.

### 18.11 Accessibility

1. Meaning must not rely only on color.
2. Use text label or icon with tone.
3. Strong contrast.
4. Avoid tiny text.

### 18.12 Mobile behavior

1. Full-width callout.
2. Short message prioritized.
3. Supporting text collapses only if very long.

### 18.13 Example

```txt
Message:
A proposal is stronger when the problem, activities, expected results, and budget clearly connect.

Tone:
info
```

### 18.14 Phase 1 minimum

1. message;
2. tone;
3. learner callout rendering.

### 18.15 Later enhancement

1. custom icon;
2. multiple visual styles.

### 18.16 Out of scope now

1. uploaded custom icons;
2. animated callouts;
3. complex note templates.

---

# Stage 2 — Interactive Blocks

---

## 19. Accordion Block

### 19.1 Purpose

The Accordion block lets learners expand and collapse related items, reducing clutter while allowing exploration.

### 19.2 Build Studio category

Interaction

### 19.3 Block Library card

```txt
Name: Accordion
Description: Organize related ideas into expandable sections.
Category: Interaction
```

### 19.4 Best used for

1. FAQs;
2. grouped principles;
3. step explanations;
4. “click to reveal” content;
5. reducing long visible text.

### 19.5 Avoid using it for

1. required text that learners may skip;
2. graded questions;
3. complex branching;
4. long documents;
5. tabs in Phase 1.

### 19.6 Creator configuration fields

```ts
type AccordionBlockConfig = {
  title?: string;
  introduction?: string;
  items: {
    id: string;
    title: string;
    body: string;
  }[];
  allowMultipleOpen?: boolean;
};
```

Required:

```txt
at least one item
item title
item body
```

### 19.7 Canvas behavior

Show:

1. `Accordion` label;
2. title;
3. item count;
4. first item preview;
5. warning if no complete item.

### 19.8 Learner rendering

Show:

1. optional title/introduction;
2. accordion headers;
3. expandable body sections.

### 19.9 Interaction behavior

Learner can:

1. expand item;
2. collapse item;
3. navigate with keyboard.

### 19.10 Validation

Required:

1. at least one complete item.

Recommended:

1. fewer than 8 items;
2. concise item bodies.

### 19.11 Accessibility

1. Headers use button semantics.
2. `aria-expanded` state.
3. Keyboard support with Enter/Space.
4. Visible focus state.

### 19.12 Mobile behavior

1. Items stack vertically.
2. Headers easy to tap.
3. Expanded text readable.

### 19.13 Example

```txt
Title:
What makes a problem statement strong?

Items:
1. Specific — It names the issue clearly.
2. Grounded — It is based on community evidence.
3. Focused — It does not try to solve everything at once.
```

### 19.14 Phase 1 minimum

1. expandable text-only items;
2. one or multiple open mode;
3. accessible keyboard behavior.

### 19.15 Later enhancement

1. media inside accordion;
2. tabs;
3. completion gating.

### 19.16 Out of scope now

1. nested accordion;
2. tab block;
3. rich media accordion items.

---

## 20. Flashcards Block

### 20.1 Purpose

The Flashcards block supports quick review of terms, concepts, definitions, and principles using front/back cards.

### 20.2 Build Studio category

Interaction

### 20.3 Block Library card

```txt
Name: Flashcards
Description: Create quick review cards with front and back content.
Category: Interaction
```

### 20.4 Best used for

1. definitions;
2. key terms;
3. HRBA principles;
4. proposal concepts;
5. short memory review;
6. concept checks.

### 20.5 Avoid using it for

1. long explanations;
2. graded tests;
3. case studies;
4. complex questions;
5. large readings.

### 20.6 Creator configuration fields

```ts
type FlashcardsBlockConfig = {
  title?: string;
  instructions?: string;
  displayMode?: "grid" | "stack";
  cards: {
    id: string;
    front: string;
    back: string;
    imageUrl?: string;
    imageAltText?: string;
  }[];
};
```

Required:

```txt
at least one card
front text
back text
```

### 20.7 Canvas behavior

Show:

1. `Flashcards` label;
2. title;
3. card count;
4. first card preview;
5. warning for incomplete cards.

### 20.8 Learner rendering

Show:

1. optional title/instructions;
2. cards in grid or stack;
3. front side first;
4. back side revealed on click/tap/keyboard action.

### 20.9 Interaction behavior

Learner can:

1. flip cards;
2. move through cards;
3. review again.

No grading.

### 20.10 Validation

Required:

1. at least one complete card;
2. front and back text.

Recommended:

1. 3–10 cards;
2. image alt text if image used.

### 20.11 Accessibility

1. Flip must be keyboard accessible.
2. State must be clear.
3. Do not rely only on animation.
4. Screen reader can access front/back.
5. Images need alt text.

### 20.12 Mobile behavior

1. Stack mode preferred.
2. Cards fit screen width.
3. Text wraps cleanly.

### 20.13 Example

```txt
Front:
Problem statement

Back:
A short explanation of the issue, who is affected, where it happens, and why it matters.
```

### 20.14 Phase 1 minimum

1. text-only flashcards;
2. grid/stack option if feasible;
3. flip interaction.

### 20.15 Later enhancement

1. images;
2. audio;
3. spaced repetition;
4. completion tracking.

### 20.16 Out of scope now

1. scoring;
2. adaptive repetition;
3. advanced animation.

---

## 21. Knowledge Check Block

### 21.1 Purpose

The Knowledge Check block helps learners test understanding during a lesson and receive immediate feedback.

### 21.2 Build Studio category

Assessment & Reflection

### 21.3 Block Library card

```txt
Name: Knowledge Check
Description: Add a short ungraded question with immediate feedback.
Category: Assessment & Reflection
```

### 21.4 Best used for

1. checking understanding;
2. reinforcing a key idea;
3. applying a concept;
4. giving immediate feedback;
5. preparing for final test.

### 21.5 Avoid using it for

1. final test;
2. certification scoring;
3. formal exam;
4. question bank randomization;
5. certificate issuing.

### 21.6 Creator configuration fields

```ts
type KnowledgeCheckBlockConfig = {
  question: string;
  helperText?: string;
  questionType?: "single_choice" | "multiple_choice";
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback?: string;
  }[];
  correctFeedback?: string;
  incorrectFeedback?: string;
  retryAllowed?: boolean;
};
```

Required:

```txt
question
at least two options
at least one correct answer
```

### 21.7 Canvas behavior

Show:

1. `Knowledge Check` label;
2. question;
3. option count;
4. correct answer configured status;
5. warning if no correct answer.

### 21.8 Learner rendering

Show:

1. question;
2. options;
3. check/submit answer button;
4. correct/incorrect feedback;
5. retry button if enabled.

### 21.9 Interaction behavior

Learner can:

1. select answer;
2. submit;
3. receive feedback;
4. retry if allowed.

### 21.10 Critical rule

Knowledge Check is not the final test.

It must not:

1. calculate final course score;
2. issue certificate;
3. trigger certificate eligibility;
4. use the final test question bank;
5. replace the final test engine.

### 21.11 Validation

Required:

1. question;
2. two or more options;
3. at least one correct answer.

Recommended:

1. feedback exists;
2. question is short and clear;
3. options are not too long.

### 21.12 Accessibility

1. Use accessible radio/checkbox controls.
2. Feedback must be text-based.
3. Correct/incorrect must not rely only on color.
4. Keyboard users can select and submit.
5. Feedback should be announced or placed clearly.

### 21.13 Mobile behavior

1. Options stack vertically.
2. Submit button easy to tap.
3. Feedback appears near the question.

### 21.14 Example

```txt
Question:
Which part of a proposal explains the change the project wants to achieve?

Options:
A. Budget note
B. Project goal
C. Attendance list

Correct answer:
B. Project goal

Correct feedback:
Yes. The project goal describes the main change the project wants to support.
```

### 21.15 Phase 1 minimum

1. single-choice question;
2. answer options;
3. correct/incorrect feedback;
4. retry toggle.

### 21.16 Later enhancement

1. multiple response;
2. matching;
3. fill-in-the-blank;
4. question bank linkage.

### 21.17 Out of scope now

1. certificate scoring;
2. randomized final test;
3. formal quiz engine;
4. learner analytics per question beyond basic event tracking.

---

## 22. Branching Scenario Block

### 22.1 Purpose

The Branching Scenario block presents a realistic decision situation where learners choose an option and receive feedback.

Phase 1 implements a simplified decision scenario, not a full scene/dialogue engine.

### 22.2 Build Studio category

Interaction

### 22.3 Block Library card

```txt
Name: Branching Scenario
Description: Create a simple decision scenario with choices, feedback, and a learning point.
Category: Interaction
```

### 22.4 Best used for

1. decision practice;
2. advocacy dilemmas;
3. safeguarding response choices;
4. HRBA application;
5. proposal design decisions;
6. safe engagement choices.

### 22.5 Avoid using it for

1. simple knowledge questions;
2. long case studies;
3. full simulation;
4. graded test;
5. complex multi-scene branching.

### 22.6 Creator configuration fields

```ts
type BranchingScenarioBlockConfig = {
  title: string;
  context: string;
  decisionQuestion: string;
  choices: {
    id: string;
    label: string;
    feedback: string;
    outcomeTone?: "positive" | "caution" | "neutral";
  }[];
  learningPoint: string;
  allowRetry?: boolean;
};
```

Required:

```txt
title
context
decisionQuestion
2–3 choices
feedback for every choice
learningPoint
```

### 22.7 Canvas behavior

Show:

1. `Branching Scenario` label;
2. title;
3. decision question;
4. number of choices;
5. warning if feedback missing.

### 22.8 Learner rendering

Show:

1. context;
2. decision question;
3. choices;
4. feedback after selection;
5. learning point;
6. retry/reset if enabled.

### 22.9 Interaction behavior

Learner can:

1. select decision;
2. see feedback;
3. read learning point;
4. retry if enabled.

### 22.10 Validation

Required:

1. title;
2. context;
3. decision question;
4. at least two choices;
5. feedback for each choice;
6. learning point.

Recommended:

1. no more than three choices;
2. concise scenario;
3. clear feedback for each choice.

### 22.11 Accessibility

1. Choices are accessible buttons.
2. Feedback is text-based.
3. Tone does not rely only on color.
4. Reset/retry keyboard accessible.
5. Scenario can be understood without images.

### 22.12 Mobile behavior

1. Choices stack vertically.
2. Feedback appears close to selected choice.
3. Context remains concise.

### 22.13 Example

```txt
Title:
Choosing a safe advocacy approach

Context:
A local CSO wants to raise concerns about poor service delivery but is worried about community tensions.

Decision question:
What should the CSO do first?

Choices:
1. Publish an accusation immediately.
Feedback:
This may increase visibility but could create unnecessary risk if facts and stakeholders are not verified.

2. Gather evidence and map stakeholders.
Feedback:
This is a safer first step because it helps the CSO understand the issue, affected groups, and possible allies.

3. Cancel the advocacy idea.
Feedback:
Avoiding action may reduce risk, but it may also miss an opportunity to address rights and accountability concerns.

Learning point:
Safe advocacy starts with evidence, stakeholder analysis, and careful choice of engagement method.
```

### 22.14 Phase 1 minimum

1. one decision point;
2. 2–3 choices;
3. feedback per choice;
4. learning point;
5. retry/reset.

### 22.15 Later enhancement

1. multi-step scenarios;
2. scene builder;
3. character/background images;
4. branching map.

### 22.16 Out of scope now

1. dialogue engine;
2. complex simulation;
3. scoring;
4. certificate linkage.

---

## 23. Reflection Block

### 23.1 Purpose

The Reflection block gives learners a guided moment to connect the lesson to their own role, organization, or context.

### 23.2 Build Studio category

Assessment & Reflection

### 23.3 Block Library card

```txt
Name: Reflection
Description: Add a guided thinking question to help learners connect the lesson to their own CSO context.
Category: Assessment & Reflection
```

### 23.4 Best used for

1. self-reflection;
2. organizational reflection;
3. linking lesson to practice;
4. preparing for team discussion;
5. thinking before an activity.

### 23.5 Avoid using it for

1. formal assessment;
2. sensitive disclosure;
3. public sharing;
4. practical proof;
5. grading.

### 23.6 Creator configuration fields

```ts
type ReflectionBlockConfig = {
  title?: string;
  question: string;
  guidanceText?: string;
  responseMode?: "thinking_only" | "private_note";
  privacyNote?: string;
};
```

Required:

```txt
question
```

### 23.7 Canvas behavior

Show:

1. `Reflection` label;
2. question;
3. response mode;
4. warning if question missing.

### 23.8 Learner rendering

If `thinking_only`:

1. show reflection question;
2. show guidance text;
3. show “take a moment to think” message.

If `private_note` is supported:

1. show private note text area;
2. show privacy note;
3. save privately if persistence exists.

### 23.9 Interaction behavior

Learner can:

1. think silently;
2. optionally write private note if enabled.

No grading.

### 23.10 Validation

Required:

1. question.

Recommended:

1. guidance text;
2. privacy note if private note mode is enabled.

Safety warning:

1. question appears to request sensitive personal information.

### 23.11 Accessibility

1. Text area has label.
2. Privacy note is clear.
3. Learner is not forced to disclose sensitive information.
4. Instructions are simple.

### 23.12 Mobile behavior

1. Reflection card stacks.
2. Text area easy to type in.
3. Guidance remains concise.

### 23.13 Example

```txt
Question:
Think about your CSO’s current proposal process. Where do you usually start: with the problem, the activities, the budget, or the donor format?

Guidance:
There is no right or wrong answer. Use this moment to connect the lesson to your organization’s current practice.
```

### 23.14 Phase 1 minimum

1. thinking-only reflection;
2. optional private note if persistence is already available.

### 23.15 Later enhancement

1. saved private journal;
2. learner export;
3. facilitator reflection prompts with consent.

### 23.16 Out of scope now

1. public sharing;
2. grading;
3. reviewer access;
4. peer comments;
5. practical proof evidence.

---

## 24. Practical Activity Block

### 24.1 Purpose

The Practical Activity block asks learners to apply the lesson through a real-world task, worksheet, team discussion, or offline action.

### 24.2 Build Studio category

Assessment & Reflection

### 24.3 Block Library card

```txt
Name: Practical Activity
Description: Add a real-world task, worksheet activity, or applied exercise for learners to complete offline or individually.
Category: Assessment & Reflection
```

### 24.4 Best used for

1. applying a tool;
2. filling a worksheet;
3. drafting a short output;
4. team discussion;
5. reviewing an organizational document;
6. preparing an action step.

### 24.5 Avoid using it for

1. formal assignment submission;
2. file upload;
3. verification;
4. badge evidence;
5. sensitive proof collection.

### 24.6 Creator configuration fields

```ts
type PracticalActivityBlockConfig = {
  title: string;
  taskInstructions: string;
  expectedOutput?: string;
  estimatedTimeMinutes?: number;
  materialsNeeded?: string;
  linkedResourceBlockId?: string;
  completionGuidance?: string;
};
```

Required:

```txt
title
taskInstructions
```

Recommended:

```txt
expectedOutput
estimatedTimeMinutes
completionGuidance
```

### 24.7 Canvas behavior

Show:

1. `Practical Activity` label;
2. title;
3. estimated time;
4. expected output preview;
5. warning if task instructions missing.

### 24.8 Learner rendering

Show activity card with:

1. title;
2. task instructions;
3. expected output;
4. estimated time;
5. materials needed;
6. linked resource/template;
7. completion guidance.

### 24.9 Interaction behavior

Phase 1:

1. learner reads task;
2. learner uses linked resource if provided;
3. learner may mark lesson/activity complete if lesson progress supports it.

### 24.10 Validation

Required:

1. title;
2. task instructions.

Recommended:

1. expected output;
2. completion guidance;
3. linked resource if activity needs a worksheet/template.

Safety warning:

1. activity asks for sensitive evidence upload or personal disclosure.

### 24.11 Accessibility

1. Instructions are clear and structured.
2. Long tasks use bullets.
3. Linked resources have descriptive labels.
4. Avoid inaccessible external tools.

### 24.12 Mobile behavior

1. Activity card readable.
2. Buttons easy to tap.
3. Instructions broken into short sections.

### 24.13 Example

```txt
Title:
Draft a simple problem statement

Task instructions:
Using the worksheet provided, write a 3–4 sentence problem statement for one issue your CSO wants to address.

Expected output:
A short problem statement that identifies the issue, affected group, location, and why it matters.

Estimated time:
20 minutes

Completion guidance:
You can discuss your draft with your team before moving to the next lesson.
```

### 24.14 Phase 1 minimum

1. task instructions;
2. expected output;
3. optional linked resource;
4. learner activity card.

### 24.15 Later enhancement

1. saved learner response;
2. facilitator review;
3. practical proof pathway with consent.

### 24.16 Out of scope now

1. file upload;
2. proof verification;
3. badge issuance;
4. grading;
5. portfolio storage.

---

# 25. Cross-block validation matrix

| Block | Required to be review-ready | Recommended warning |
|---|---|---|
| Text | Body | Heading for long text |
| Video | Title, source type, source URL | Transcript, captions, duration |
| Resource | Title, source type, source URL | Description, resource type, button label |
| Image | Image URL, alt text | Caption |
| Case Study | Title, scenario, learning point | Context, guiding question |
| Key Message | Message | Tone, shorter message |
| Accordion | At least one complete item | Limit number of items |
| Flashcards | At least one card with front/back | 3–10 cards, image alt text |
| Knowledge Check | Question, 2+ options, correct answer | Feedback explanation |
| Branching Scenario | Context, decision question, 2+ choices, feedback, learning point | No more than 3 choices |
| Reflection | Question | Guidance text, privacy note |
| Practical Activity | Title, task instructions | Expected output, completion guidance |

---

# 26. Cross-block learner rendering principles

All learner-rendered blocks should feel like one unified course experience.

1. Text should be calm and readable.
2. Video should feel integrated, not pasted.
3. Resource should look like a useful tool card.
4. Image should support learning with caption and alt text.
5. Case Study should feel practical and contextual.
6. Key Message should stand out without overwhelming.
7. Accordion should reduce complexity.
8. Flashcards should feel lightweight and review-focused.
9. Knowledge Check should give useful feedback.
10. Branching Scenario should support safe decision practice.
11. Reflection should feel private and thoughtful.
12. Practical Activity should encourage real-world application.

---

# 27. Recommended implementation sequencing for Codex

## 27.1 Stage 1A — Core text/callout blocks

Implement:

1. Text
2. Key Message

## 27.2 Stage 1B — Applied content blocks

Implement:

1. Case Study
2. Resource

## 27.3 Stage 1C — Media blocks

Implement:

1. Image
2. Video

## 27.4 Stage 1D — Core block operations

Implement across Stage 1 blocks:

1. save/load;
2. reorder;
3. duplicate;
4. delete;
5. readiness warnings;
6. learner rendering QA.

## 27.5 Stage 2A — Lightweight reveal/review blocks

Implement:

1. Accordion
2. Flashcards

## 27.6 Stage 2B — In-lesson assessment block

Implement:

1. Knowledge Check

## 27.7 Stage 2C — Decision practice block

Implement:

1. Branching Scenario

## 27.8 Stage 2D — Application/reflection blocks

Implement:

1. Reflection
2. Practical Activity

## 27.9 Stage 2E — Interactive rendering QA

Verify:

1. keyboard behavior;
2. mobile behavior;
3. learner renderer consistency;
4. readiness warnings;
5. no certificate/final-test drift.

---

# 28. Implementation principles for Codex

Codex should implement blocks in a way that keeps Build Studio practical and clean.

## 28.1 Do

1. Use the left panel for block discovery.
2. Use the center canvas for preview and ordering.
3. Use the right panel for configuration.
4. Keep forms simple.
5. Keep learner rendering polished.
6. Validate required fields.
7. Show accessibility warnings.
8. Preserve structured block configs.
9. Keep Knowledge Check separate from final test.
10. Keep Practical Activity separate from practical proof verification.

## 28.2 Do not

1. Put full forms inside canvas cards.
2. Add governance panels to Build Studio.
3. Add proof verification.
4. Add badges.
5. Add complex analytics.
6. Add custom code embeds.
7. Add Storyline/custom interaction support.
8. Add future-phase blocks.
9. Treat Knowledge Check as final test.
10. Treat Practical Activity as verified evidence.

---

# 29. Acceptance criteria for Stage 1 core blocks

Stage 1 is complete only when:

1. Creator can add Text, Key Message, Case Study, Resource, Image, and Video blocks to a selected lesson.
2. Each block appears in the center canvas with correct label, preview, selection state, and warning behavior.
3. Right panel shows block-specific configuration fields only.
4. Required fields are validated.
5. Blocks can be saved and loaded.
6. Blocks can be reordered, duplicated, and deleted.
7. Learner course player renders each core block correctly.
8. Video supports `embed_url`, `uploaded_file` where storage supports it, and `external_link`.
9. Resource supports uploaded file reference or external link.
10. Image requires alt text before review/publishing readiness.
11. No interactive Stage 2 blocks are implemented in this slice unless explicitly requested.
12. No Phase 2/3 block types are exposed.

---

# 30. Acceptance criteria for Stage 2 interactive blocks

Stage 2 is complete only when:

1. Creator can add Accordion, Flashcards, Knowledge Check, Branching Scenario, Reflection, and Practical Activity blocks.
2. Each block has a clean Block Library card.
3. Each block has a canvas preview and selected state.
4. Each block has a right-panel configuration form.
5. Each block saves and loads structured config.
6. Accordion expands/collapses accessibly.
7. Flashcards flip accessibly and are not scored.
8. Knowledge Check gives immediate feedback and does not issue certificates.
9. Branching Scenario supports one decision point, 2–3 choices, feedback, learning point, and retry/reset if enabled.
10. Reflection uses user-facing label `Reflection`, not `Reflection Prompt`.
11. Practical Activity uses user-facing label `Practical Activity`, not `Practical Activity Prompt`.
12. Practical Activity does not become proof verification.
13. Learner course player renders all six interactive blocks correctly.
14. Mobile behavior is usable.
15. Keyboard behavior is checked.
16. No Phase 2/3 block types are exposed.

---

# 31. Codex prompt — Stage 1 core blocks

Use this prompt after the Build Studio layout and course/module/lesson persistence are stable.

```txt
Plan first.

Implement Stage 1 Build Studio core blocks for the DEC / WHH CSF+ CSO Learning Hub Phase 1 application.

Before making changes, read:
- docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
- docs/specs/phase-1-cso-learning-hub/DATA_MODEL.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_BLOCK_REFERENCE.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md

Objective:
Implement the selected Stage 1 core blocks in the Build Studio:
- Text
- Key Message
- Case Study
- Resource
- Image
- Video

Scope:
1. Add or align block type definitions and config handling for the six core blocks.
2. Add Block Library cards for the six core blocks.
3. Add center canvas preview cards for the six core blocks.
4. Add right-side Block Configuration panel forms for the six core blocks.
5. Ensure blocks can save/load structured config.
6. Ensure blocks can be reordered, duplicated, and deleted if those base operations exist in this slice.
7. Add learner renderer support for the six core blocks.
8. Add readiness warnings:
   - Text body missing
   - Key Message message missing
   - Case Study scenario/learning point missing
   - Resource source missing
   - Image alt text missing
   - Video source/transcript/caption warnings
9. Video must support sourceType values:
   - embed_url
   - uploaded_file
   - external_link
10. Resource must support uploaded file reference or external link.

Constraints:
- Do not implement Stage 2 interactive blocks yet.
- Do not implement final test engine.
- Do not implement certificate engine.
- Do not add practical proof verification.
- Do not add badges.
- Do not add AI authoring.
- Do not add Gallery, Chart, Timeline, Sorting, Matching, Hotspots, Custom Code, Storyline/custom interaction, or Image Comparison.
- Do not crowd the Build Studio with diagnosis, capacity map, monitoring, CRM, donor compliance, or governance panels.
- Do not expose developer language in user-facing UI.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Add/manual test core block creation
- Add/manual test core block save/load
- Add/manual test learner rendering
- Mobile/narrow viewport check
- Accessibility notes for image alt text, video transcript, and resource button labels

Return the required evidence pack using EVIDENCE_PACK_TEMPLATE.md.
Include a Premium UI / Visual QA section.
```

---

# 32. Codex prompt — Stage 2 interactive blocks

Use this prompt only after Stage 1 blocks are stable.

```txt
Plan first.

Implement Stage 2 Build Studio interactive blocks for the DEC / WHH CSF+ CSO Learning Hub Phase 1 application.

Before making changes, read:
- docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
- docs/specs/phase-1-cso-learning-hub/DATA_MODEL.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_BLOCK_REFERENCE.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md
- docs/design/DESIGN_SYSTEM.md
- docs/design/COMPONENT_LIBRARY.md
- docs/design/CODEX_UI_SKILL.md
- docs/design/VISUAL_QA_CHECKLIST.md

Objective:
Implement the selected Stage 2 interactive blocks in the Build Studio:
- Accordion
- Flashcards
- Knowledge Check
- Branching Scenario
- Reflection
- Practical Activity

Scope:
1. Add or align block type definitions and config handling for the six interactive blocks.
2. Add Block Library cards for the six interactive blocks.
3. Add center canvas preview cards for the six interactive blocks.
4. Add right-side Block Configuration panel forms for the six interactive blocks.
5. Ensure blocks can save/load structured config.
6. Add learner renderer support for all six interactive blocks.
7. Add readiness warnings:
   - Accordion has no complete items
   - Flashcards have incomplete front/back content
   - Knowledge Check has no correct answer
   - Branching Scenario choices or feedback missing
   - Reflection question missing
   - Practical Activity task instructions missing
8. Ensure user-facing labels are:
   - Reflection
   - Practical Activity
   not:
   - Reflection Prompt
   - Practical Activity Prompt
9. Ensure Knowledge Check remains an ungraded lesson interaction and does not issue certificates.
10. Ensure Practical Activity does not become practical proof verification.

Constraints:
- Do not implement final test engine in this slice.
- Do not implement certificate engine.
- Do not add practical proof verification.
- Do not add badges.
- Do not add AI authoring.
- Do not add Gallery, Chart, Timeline, Sorting, Matching, Hotspots, Custom Code, Storyline/custom interaction, or Image Comparison.
- Do not crowd the Build Studio with diagnosis, capacity map, monitoring, CRM, donor compliance, or governance panels.
- Do not expose developer language in user-facing UI.

Verification:
- npm run lint
- npm run typecheck
- npm run build
- Add/manual test interactive block creation
- Add/manual test interactive block save/load
- Add/manual test learner rendering
- Keyboard behavior check for Accordion, Flashcards, Knowledge Check, and Branching Scenario
- Mobile/narrow viewport check
- Confirm Knowledge Check does not issue certificate
- Confirm Practical Activity does not create proof verification workflow

Return the required evidence pack using EVIDENCE_PACK_TEMPLATE.md.
Include a Premium UI / Visual QA section.
```

---

# 33. Evidence pack requirements

After each block implementation slice, Codex must return the standard evidence pack.

For Build Studio block work, the evidence pack must explicitly include:

1. block types implemented;
2. files changed;
3. routes affected;
4. data/schema/config changes;
5. learner renderer changes;
6. readiness warnings implemented;
7. role/permission impact;
8. acceptance criteria checked;
9. tests/checks run;
10. manual verification steps;
11. screenshots or visual evidence if available;
12. known gaps;
13. next smallest safe step;
14. confirmation that no Phase 2/3 block types were added;
15. confirmation that Build Studio remained clean and not governance-heavy.

---

## 34. Final note

This file is a controlling Build Studio reference for Phase 1 block implementation.

If future block types are added, they must be added through an approved change note and should not be introduced casually by Codex during implementation.
