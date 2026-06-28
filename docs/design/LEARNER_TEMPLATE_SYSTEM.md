# LEARNER_TEMPLATE_SYSTEM.md

# CSO Learning Hub Learner Template System — Design Specification

## 1. Purpose

This file defines the learner template system for the CSO Learning Hub Phase 1 application.

The learner template system ensures that courses built in Build Studio automatically render into professional, consistent, accessible, mobile-friendly participant-facing learning experiences.

The system is inspired by best-in-class e-learning authoring patterns, but it is not a copy of Articulate, Agora, SCORM, or any external product.

## 2. Core principle

Course creators should build structured learning content. The platform should handle professional learner-facing presentation.

```txt
Creator writes and configures content.
Template system renders the participant experience.
Preview confirms quality before publishing.
Learner player delivers the final course.
```

The learner template must feel like:

> “This is a professional digital course designed for me.”

It must not feel like:

> “This is a folder of uploaded training materials.”

## 3. Relationship to Build Studio

Build Studio stores structured content as:

```txt
Course → CourseVersion → Module → Lesson → ContentBlock
```

The learner template system reads this structure and applies:

```txt
- selected learner template;
- theme tokens;
- navigation style;
- block renderer mapping;
- accessibility rules;
- progress/final-test rules.
```

## 4. Phase 1 template library

Phase 1 should use seeded, approved templates rather than a full template editor.

### 4.1 Guided Lesson Template

**ID:** `LT-GUIDED-LESSON`

Best for:

```txt
- text-heavy lessons;
- key messages;
- images;
- videos;
- resources;
- simple knowledge checks.
```

Learner feel:

```txt
Structured, calm, readable, guided.
```

### 4.2 Practice Scenario Template

**ID:** `LT-PRACTICE-SCENARIO`

Best for:

```txt
- case studies;
- branching scenarios;
- practical activities;
- decision-making;
- applied HRBA/advocacy/MEAL examples.
```

Learner feel:

```txt
Interactive, applied, action-oriented.
```

### 4.3 Resource Toolkit Template

**ID:** `LT-RESOURCE-TOOLKIT`

Best for:

```txt
- templates;
- checklists;
- tools;
- guides;
- downloadable resources;
- external links.
```

Learner feel:

```txt
Practical, tool-focused, easy to revisit.
```

### 4.4 Assessment Preparation Template

**ID:** `LT-ASSESSMENT-PREP`

Best for:

```txt
- review lessons;
- knowledge checks;
- final test preparation;
- recap sections;
- certificate preparation.
```

Learner feel:

```txt
Clear, focused, confidence-building.
```

## 5. Template selection

### 5.1 Minimum Phase 1 behavior

A course may have:

```txt
selectedTemplateId
selectedThemeId
selectedNavigationStyleId
```

If the schema does not yet support these fields directly, store them in approved JSON metadata.

Suggested safe metadata location:

```txt
Course.analysisMetadataJson.template
```

or a more appropriate existing course configuration JSON field if available.

### 5.2 Default behavior

If no template is selected:

```txt
selectedTemplateId = LT-GUIDED-LESSON
selectedThemeId = DEC_DEFAULT
selectedNavigationStyleId = SIDEBAR_OUTLINE
```

### 5.3 Creator controls

Creators may select from approved templates only. They should not edit raw theme tokens in Phase 1.

## 6. Theme tokens

Use the approved DEC / CSO Learning Hub design system:

```txt
DEC Blue: #3B99D4
DEC Green: #91C852
Deep Navy: #0F172A
Dark Ink: #111827
Secondary Text: #6B7280
Light Background: #F9FAFB
Soft Background: #F3F7FA
White Surface: #FFFFFF
Border: #E5E7EB
Soft Border: #EEF2F7
Success: #16A34A
Warning: #F97316
Error: #EF4444
Review Purple: #8B5CF6
```

Do not use Articulate, UNICEF, Agora, or unrelated external product colors.

## 7. Navigation styles

### 7.1 Sidebar outline

Default for full course player.

Includes:

```txt
- course title;
- progress percentage;
- module groups;
- lesson list;
- completed lesson indicators;
- current lesson highlight;
- final test entry;
- resources link.
```

### 7.2 Launch / continue screen

Used when a participant opens a course before selecting a lesson.

Includes:

```txt
- course title;
- course image/visual;
- short description;
- progress state;
- module count;
- lesson count;
- estimated duration;
- certificate/final-test rule;
- Start Course or Continue Course button.
```

### 7.3 Mobile collapsible outline

On mobile/narrow screens:

```txt
- outline collapses into drawer;
- lesson content remains primary;
- progress remains visible;
- navigation buttons remain reachable.
```

## 8. Block-to-renderer mapping

| Build Studio block type | Learner renderer | Required presentation behavior |
|---|---|---|
| `TEXT` | `LearnerTextBlock` | Rich readable section with headings, paragraphs, bullet clusters, step lists, tables where supported |
| `KEY_MESSAGE` | `LearnerKeyMessageBlock` | Tinted callout card with tone variant |
| `IMAGE` | `LearnerImageBlock` | Captioned image, banner, or visual card; alt text required |
| `VIDEO` | `LearnerVideoBlock` | Video/link card with transcript support |
| `RESOURCE` | `LearnerResourceBlock` | Download/toolkit card with file type and action |
| `EXTERNAL_LINK` | `LearnerExternalLinkBlock` | Curated link card with safe open action |
| `CASE_STUDY` | `LearnerCaseStudyBlock` | Scenario/context card with guiding question |
| `ACCORDION` | `LearnerAccordionBlock` | Accessible expandable sections |
| `FLASHCARD` / `FLASHCARDS` | `LearnerFlashcardBlock` | Reveal cards for key concepts |
| `KNOWLEDGE_CHECK` | `LearnerKnowledgeCheckBlock` | Low-stakes question with feedback |
| `BRANCHING_SCENARIO` | `LearnerBranchingScenarioBlock` | Decision interaction with scenario, options, consequence, feedback, learning point |
| `REFLECTION_PROMPT` | `LearnerReflectionPromptBlock` | Private reflection-style prompt |
| `PRACTICAL_ACTIVITY` / `PRACTICAL_ACTIVITY_PROMPT` | `LearnerPracticalActivityBlock` | Worksheet/action card with expected output |
| `AUDIO` if supported | `LearnerAudioBlock` | Simple audio card with transcript/description |

## 9. Text block rendering variants

Text content should not always render as plain paragraph cards.

Supported Phase 1 variants:

```txt
reading
concept_explainer
step_list
bullet_cluster
comparison_table
highlighted_note
pull_quote
```

If the current config does not explicitly store variants, use sensible default rendering based on available fields while preserving content.

## 10. Media block rendering variants

Image and video should support:

```txt
image_caption_card
image_banner
image_with_reflection
video_with_transcript
external_video_link
```

Images should not look like raw file attachments.

## 11. Interactive block rendering variants

### 11.1 Accordion

Required behavior:

```txt
- item title;
- item body;
- accessible expand/collapse;
- keyboard reachable;
- clear open/closed state.
```

### 11.2 Flashcards

Required behavior:

```txt
- front;
- back;
- reveal action;
- next/previous or card grid where supported;
- usable without relying on color only.
```

### 11.3 Knowledge Check

Required behavior:

```txt
- question;
- options;
- selected option;
- correct/incorrect feedback;
- retry if supported;
- low-stakes label if useful.
```

### 11.4 Branching Scenario

Required behavior:

```txt
- scenario title;
- scenario text;
- decision prompt;
- options;
- selected/recommended state;
- consequence/feedback;
- learning point;
- retry/continue if supported.
```

In Phase 1, a branching scenario may be a single decision point. Multi-step branching can be future-safe but should not block Phase 1.

### 11.5 Practical Activity

Required behavior:

```txt
- activity title;
- instruction;
- expected output;
- optional worksheet fields;
- safety note where relevant.
```

## 12. Creator preview behavior

Creator preview must render through the same learner template engine as the participant course player.

Difference:

```txt
Creator preview:
- no learner progress mutation;
- no quiz attempt creation;
- no certificate issuance;
- creator-only return-to-edit controls may appear outside the learner frame.

Learner player:
- progress active;
- completion active;
- final test active;
- certificate rules active where supported.
```

## 13. Learner player behavior

The learner player should include:

```txt
- learner header;
- course outline;
- progress percentage;
- current lesson;
- vertically stacked content blocks;
- previous/next controls;
- mark complete / continue;
- final test locked/unlocked state;
- resources section.
```

## 14. Resource aggregation

Resource and External Link blocks may be surfaced in:

```txt
- lesson flow;
- resources section;
- launch/continue screen summary;
- course detail page if appropriate.
```

Do not duplicate full content, only list useful resource actions.

## 15. Final test integration

The final test route remains the source of final assessment.

Rules:

```txt
- final test locked until required lesson completion where supported;
- 80% pass threshold must remain;
- certificate logic must follow approved rules;
- lesson knowledge checks remain low-stakes.
```

## 16. Accessibility rules

All learner template components must support:

```txt
- semantic headings;
- keyboard interaction;
- visible focus states;
- sufficient color contrast;
- alt text for images;
- transcript support for video/audio;
- non-color-only feedback;
- mobile/narrow responsiveness.
```

## 17. Mobile behavior

On mobile:

```txt
- sidebar becomes drawer/collapsible outline;
- lesson content remains single-column;
- buttons are large enough to tap;
- interactive blocks remain usable;
- final test and resources remain reachable.
```

## 18. Visual QA rules

Before marking UI implementation complete, verify:

```txt
- no developer language;
- no raw configJson;
- no Build Studio controls in learner routes;
- no admin/creator controls in participant view;
- no Phase 2/3 active modules;
- no CRM/donor/grant management UI;
- desktop layout acceptable;
- mobile/narrow layout acceptable;
- accessibility basics checked.
```

## 19. Phase 1 scope restrictions

Do not implement:

```txt
- SCORM/xAPI import/export;
- full template editor;
- custom theme designer;
- animation timeline editor;
- advanced branching path builder;
- AI authoring dashboard;
- practical proof workflow;
- badges;
- diagnosis/capacity map/action map active modules;
- CRM or donor management.
```

## 20. Recommended component structure

```txt
src/components/learner/
  LearnerCourseShell.tsx
  LearnerCourseLaunch.tsx
  LearnerCourseOutline.tsx
  LearnerLessonCanvas.tsx
  LearnerTemplateRenderer.tsx
  LearnerBlockRenderer.tsx
  learner-blocks/
    LearnerTextBlock.tsx
    LearnerKeyMessageBlock.tsx
    LearnerImageBlock.tsx
    LearnerVideoBlock.tsx
    LearnerResourceBlock.tsx
    LearnerExternalLinkBlock.tsx
    LearnerCaseStudyBlock.tsx
    LearnerAccordionBlock.tsx
    LearnerFlashcardBlock.tsx
    LearnerKnowledgeCheckBlock.tsx
    LearnerBranchingScenarioBlock.tsx
    LearnerReflectionPromptBlock.tsx
    LearnerPracticalActivityBlock.tsx
```

Codex may adapt to existing repo conventions, but must keep a clear component-first structure.

## 21. Acceptance criteria

```txt
- Approved learner templates are seeded or defined.
- Course can select or inherit a learner template.
- Creator preview uses the selected learner template.
- Learner player uses the same selected learner template.
- All supported block types render safely.
- Text/media/interactive blocks are visually distinct.
- Branching scenario feels like applied decision practice.
- Resources render as toolkit/download cards.
- Mobile/narrow viewport works.
- Learner routes do not expose creator/admin controls.
- Draft/unpublished courses remain hidden publicly.
- No developer language appears.
```
