# ARTICULATE_AUTHORING_REFERENCE_NOTES.md

# Articulate 360 Authoring Reference Notes — CSO Learning Hub Adaptation

## 1. Purpose

This file documents how the CSO Learning Hub should use the Articulate 360 / Rise / Storyline screenshots stored in this folder as controlled design inspiration.

These screenshots are **reference assets only**. They are not implementation mockups, not brand references, and not a product to copy.

The goal is to learn from best-in-class e-learning authoring patterns and adapt them into the DEC / WHH CSF+ CSO Learning Hub Phase 1 product in a way that remains:

- CSO-focused;
- DEC-branded;
- locally grounded;
- web-native;
- accessible;
- implementation-ready;
- aligned with Phase 1 scope.

## 2. Reference screenshots in this folder

```txt
docs/design/reference/articulate-360-elearning/
  01_course_create_empty_lesson.jpeg
  01_creator_workspace_design.png
  02_creator_authoring_ux_1.png
  02_creator_authoring_ux_2.png
  02_creator_authoring_ux_3.png
  02_creator_authoring_ux_4.png
  02_text_statement_quote_list_table_blocks.jpeg
  03_branching_authoring_ux_1.png
  03_branching_authoring_ux_5.png
  03_branching_authoring_ux_6.png
  03_branching_authoring_ux_7.png
  03_image_banner_visual_blocks.jpeg
  04_gallery_multimedia_blocks.jpeg
  05_interactive_blocks_and_scenario_flow.jpeg
```

## 3. What to learn from Articulate

### 3.1 Template-first authoring

Articulate-style tools do not require every creator to manually design every learner page from scratch. They provide:

- empty lesson starter states;
- templates;
- block libraries;
- interaction presets;
- visual preview modes;
- theme/skin options;
- publish/preview controls.

**CSO Learning Hub adaptation:**  
Course creators should focus on content, sequence, learning logic, and block configuration. The platform should handle learner-facing presentation through approved templates.

### 3.2 Clean empty lesson state

The `01_course_create_empty_lesson.jpeg` reference shows a clear first-building moment:

- lesson title area;
- “add your first block” area;
- horizontal quick-add bar;
- block library entry point.

**CSO Learning Hub adaptation:**  
When a lesson is empty in Build Studio, the center canvas should show a purposeful starter state:

```txt
Start building this lesson
Add your first learning block
Recommended first blocks: Text, Key Message, Image, Video, Resource, Knowledge Check
```

This avoids a broken or empty-feeling workspace.

### 3.3 Categorized block library

The references show clear block categories: text, statement, quote, list, image, gallery, multimedia, interactive, knowledge check, chart, divider, templates, and custom blocks.

**CSO Learning Hub adaptation:**  
Use CSO Learning Hub block categories:

```txt
Core content
- Text
- Key Message
- Case Study

Media and resources
- Image
- Video
- Resource
- External Link

Interactive learning
- Accordion
- Flashcards
- Knowledge Check
- Branching Scenario
- Reflection Prompt
- Practical Activity

Assessment
- Final Test / Quiz items where relevant
```

Do not copy Articulate block names where CSO Learning Hub already has approved block types.

### 3.4 Horizontal quick-add bar

The Articulate-style quick-add bar reduces friction by letting creators quickly insert common blocks.

**CSO Learning Hub adaptation:**  
Keep the existing Build Studio three-column layout, but add or refine a compact quick-add strip inside the center canvas for common blocks:

```txt
Text | Key Message | Image | Video | Resource | Case Study | Accordion | Flashcards | Knowledge Check | Branching Scenario | Practical Activity
```

This should not replace the full block library. It should complement it.

### 3.5 Visual block template thumbnails

The references show block options with visual previews. This helps non-technical creators understand what each block will become.

**CSO Learning Hub adaptation:**  
For Phase 1, implement simple visual thumbnails or compact previews for block templates where feasible:

```txt
Introduce a concept
Add a key message
Explain a process
Ask a reflection question
Create a decision scenario
Add a downloadable tool
Prepare a knowledge check
```

These are starter presets for existing block types, not new product modules.

### 3.6 Text block variation

The `02_text_statement_quote_list_table_blocks.jpeg` reference is especially useful because it shows that text-based learning is not just plain paragraphs.

**CSO Learning Hub adaptation:**  
The Text and Key Message renderers should support presentation variants:

```txt
Text block variants:
- reading section
- concept explainer
- step list
- bullet cluster
- numbered process
- simple comparison table
- highlighted paragraph
- pull quote / statement

Key Message variants:
- insight
- principle
- warning
- success
- action reminder
```

This is critical to avoid the learner course player feeling like a Word document.

### 3.7 Image and visual blocks

The `03_image_banner_visual_blocks.jpeg` reference shows how images can create learning rhythm.

**CSO Learning Hub adaptation:**  
Image blocks should support learner-facing variants:

```txt
- full-width banner image;
- captioned image card;
- image with reflection prompt;
- image with key observation note;
- image gallery if already supported.
```

Images should feel like learning visuals, not attachments.

### 3.8 Multimedia and resources

The `04_gallery_multimedia_blocks.jpeg` reference shows galleries, multimedia blocks, and attachment/resource patterns.

**CSO Learning Hub adaptation:**  
Prioritize:

```txt
- video block with transcript support;
- image block;
- resource/download card;
- external link card;
- gallery only if already supported or easy to implement safely.
```

Do not introduce a complex embed builder or SCORM player in Phase 1.

### 3.9 Interactive block families

The `05_interactive_blocks_and_scenario_flow.jpeg` reference shows interaction families such as accordions, tabs, flashcards, card sorting, knowledge checks, and branching/scenario flows.

**CSO Learning Hub adaptation:**  
Each interactive block should have a distinct learner-facing rendering pattern:

```txt
Accordion
- expandable sections;
- best for “learn more” details or grouped guidance.

Flashcards
- reveal cards;
- best for key terms and definitions.

Knowledge Check
- low-stakes question;
- immediate feedback.

Branching Scenario
- scenario;
- decision prompt;
- options;
- feedback;
- consequence;
- retry or continue.

Practical Activity
- action prompt;
- worksheet-style fields;
- expected output.
```

### 3.10 Branching scenario quality

The branching references are important because they show that a branching scenario is more than a multiple-choice question. It is an applied decision practice.

**CSO Learning Hub adaptation:**  
A Phase 1 branching scenario should include:

```txt
- scenario title;
- story/context;
- decision prompt;
- 3–4 options;
- selected/best option state;
- feedback;
- consequence;
- learning point;
- retry if supported.
```

Later phases can support multi-step branching paths, but Phase 1 can deliver a strong single-decision scenario.

### 3.11 Theme and skin separation

The Articulate references show that content and visual skin can be separated.

**CSO Learning Hub adaptation:**  
Use approved CSO Learning Hub learner templates and themes. Creators should select or inherit a template, but not manually design every layout detail.

Suggested Phase 1 seeded templates:

```txt
LT-GUIDED-LESSON
LT-PRACTICE-SCENARIO
LT-RESOURCE-TOOLKIT
LT-ASSESSMENT-PREP
```

## 4. What not to copy

Do **not** copy:

```txt
- Articulate 360 branding;
- Rise / Storyline product UI;
- exact colors, icons, fonts, menus, or layouts;
- “AI Assistant” branding or exact feature behavior;
- exact screenshot content;
- corporate compliance-training visual style;
- SCORM package dependency;
- external course-player iframe dependency;
- full slide-authoring model;
- timeline animation editor;
- advanced custom code block editor;
- custom block marketplace;
- full theme designer for creators.
```

The CSO Learning Hub must remain an independent DEC / WHH CSF+ CSO learning platform.

## 5. CSO Learning Hub adaptation rules

### 5.1 Use the CSO Learning Hub design system

Apply:

```txt
DEC Blue: #3B99D4
DEC Green: #91C852
Deep Navy: #0F172A
Light Background: #F9FAFB
White Surface: #FFFFFF
Border: #E5E7EB
Soft Border: #EEF2F7
Dark Ink: #111827
Secondary Text: #6B7280
```

### 5.2 Keep Build Studio clean

Build Studio must remain a course-authoring environment. It should not become:

```txt
- a CRM;
- a donor-management tool;
- a diagnosis workflow;
- a monitoring dashboard;
- a governance compliance screen;
- a complex slide animation studio.
```

### 5.3 Make preview and learner player use the same rendering engine

The correct flow is:

```txt
Build Studio block configuration
→ selected learner template
→ creator preview
→ published learner course player
```

Creator preview should show the participant-facing course without mutating participant progress.

### 5.4 Use web-native templates, not SCORM

The CSO Learning Hub should be web-native. The learner course player should render saved course/module/lesson/block data directly from the platform.

## 6. Build Studio implications

The following improvements should be considered for Build Studio:

```txt
1. More purposeful empty lesson state.
2. Horizontal quick-add block bar.
3. Clear block categories.
4. Visual block template cards.
5. Block starter presets.
6. Stronger distinction between core content, media, interactive, and assessment blocks.
7. Preview that renders using the selected learner template.
8. No participant-facing design leakage into the authoring workspace.
```

## 7. Learner template implications

The learner course player should render blocks as professional learning components:

```txt
Text → readable learning section with rich text variants
Key Message → callout / principle / warning / success card
Image → captioned visual block or full-width banner
Video → video card with transcript
Resource → toolkit/download card
External Link → curated link card
Case Study → scenario card
Accordion → accessible expandable sections
Flashcards → reveal cards
Knowledge Check → low-stakes question with feedback
Branching Scenario → decision interaction with feedback/consequence
Reflection Prompt → private reflection prompt
Practical Activity → worksheet-style action block
```

## 8. Phase 1 scope boundaries

In scope:

```txt
- seeded learner templates;
- block renderer improvements;
- creator preview using learner templates;
- learner course player polish;
- single-step branching scenario;
- resource/download cards;
- text/media/interactive block variety;
- mobile-friendly rendering.
```

Out of scope:

```txt
- full SCORM/xAPI package import/export;
- slide timeline animation authoring;
- full theme designer;
- advanced AI course generation;
- complex branching path editor;
- course marketplace;
- custom block marketplace;
- CRM/donor/grant workflows;
- diagnosis/capacity map/action map active modules.
```

## 9. Future-safe ideas

The following may be documented for later phases but should not be implemented as active Phase 1 features unless approved:

```txt
- AI-assisted block generation;
- reusable block template library managed by Admin;
- richer branching path editor;
- animation presets;
- multi-template course themes;
- block analytics;
- adaptive learning paths.
```

## 10. Implementation guidance for Codex

When Codex uses these references, it must:

```txt
1. Read this file before UI work involving Build Studio, preview, or learner course player.
2. Use the references as inspiration only.
3. Preserve CSO Learning Hub visual identity.
4. Use reusable components.
5. Avoid developer language in user-facing screens.
6. Keep Phase 1 scope.
7. Return evidence packs after every implementation slice.
```
