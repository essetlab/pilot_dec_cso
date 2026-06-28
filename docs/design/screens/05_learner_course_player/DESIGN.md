# DESIGN.md

# Learner Course Player — Design Specification

## 1. Screen identity

**Screen name:**  
Learner Course Player

**Route:**  
`/learn/courses/[courseSlug]` and, where implemented, `/learn/courses/[courseSlug]/lessons/[lessonId]`

**Experience zone:**  
Learner / Participant

**Primary users:**  
CSO participants, CSO staff learners, DEC/WHH demo stakeholders

**Design status:**  
Draft — pending final approved `screen.png`

**Approved visual reference:**  
`docs/design/screens/05_learner_course_player/screen.png`

**Supporting reference files:**

```txt
docs/design/screens/05_learner_course_player/COURSE_PLAYER_REDESIGN_SPEC.md
docs/design/reference/agora-course-player/AGORA_REFERENCE_NOTES.md
docs/design/reference/articulate-360-elearning/ARTICULATE_AUTHORING_REFERENCE_NOTES.md
docs/design/LEARNER_TEMPLATE_SYSTEM.md
docs/design/DESIGN_SYSTEM.md
docs/design/COMPONENT_LIBRARY.md
docs/design/CODEX_UI_SKILL.md
docs/design/VISUAL_QA_CHECKLIST.md
docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
```

## 1.1 Visual implementation priority

For learner course player visual implementation, use references in this order:

```txt
1. docs/design/screens/05_learner_course_player/COURSE_PLAYER_REDESIGN_SPEC.md
2. docs/design/reference/agora-course-player/AGORA_REFERENCE_NOTES.md
3. docs/design/screens/05_learner_course_player/screen.png if approved
4. docs/design/LEARNER_TEMPLATE_SYSTEM.md
5. docs/design/DESIGN_SYSTEM.md
6. Articulate references only for block/interaction inspiration, not player shell layout.
```

## 2. Screen purpose

The Learner Course Player is the main participant-facing course experience.

It must allow participants to:

```txt
- start or continue a course;
- navigate modules and lessons;
- see progress;
- complete lesson content;
- interact with text, video, image, resources, case studies, accordions, flashcards, knowledge checks, branching scenarios, reflections, and practical activities;
- access final test when eligible;
- return safely to their learning area.
```

The screen must feel like a professional digital course, not a raw file repository or admin page.

## 3. Product principles

The learner course player must:

```txt
- render saved Build Studio data;
- use the selected learner template;
- show polished participant-facing block components;
- hide all creator/admin controls;
- support mobile and desktop;
- maintain accessibility basics;
- preserve Phase 1 scope.
```

## 4. Layout

### 4.1 Desktop

Use a two-zone learner layout:

```txt
Top learner header
Main course player
  Left: Course outline and progress
  Right: Lesson canvas with vertical block flow
```

Do not use a third right-side column for resources. Resources should appear inside the lesson flow or in the outline/resources area.

### 4.2 Top learner header

Include:

```txt
- CSO Learning Hub / DEC Learning Platform identity;
- Dashboard;
- My Courses;
- Certificates;
- language selector;
- learner avatar/name;
- Exit Course action.
```

### 4.3 Left course outline

Include:

```txt
- course title;
- progress percentage;
- progress bar;
- module groups;
- lesson list;
- completed lesson indicators;
- current lesson highlight;
- upcoming lesson indicators;
- final test entry;
- resources entry.
```

### 4.4 Main lesson canvas

Include:

```txt
- module/lesson breadcrumb;
- lesson title;
- lesson description;
- estimated duration badge;
- required lesson badge;
- vertical sequence of learner blocks;
- previous/continue/next navigation.
```

The lesson canvas should use generous spacing and visually distinct blocks.

## 5. Launch / continue state

When the participant opens the course without a specific lesson selected, show a launch/continue screen:

```txt
- course title;
- course image/visual;
- short description;
- progress;
- module count;
- lesson count;
- duration;
- certificate/final-test note;
- Start Course or Continue Course button.
```

## 6. Block rendering design

### 6.1 Text block

Render as rich learning content, not plain paragraphs only.

Support:

```txt
- headings;
- paragraphs;
- highlighted note;
- bullet cluster;
- numbered steps;
- simple table where configured.
```

### 6.2 Key Message block

Render as a tinted callout card.

Tone variants:

```txt
- principle;
- insight;
- warning;
- success;
- action reminder.
```

### 6.3 Image block

Render as:

```txt
- captioned image card;
- image banner;
- image + reflection note where configured.
```

Alt text is required for accessibility.

### 6.4 Video block

Render as:

```txt
- video player or safe video link;
- title;
- description;
- transcript area.
```

### 6.5 Resource block

Render as a toolkit/download card:

```txt
- resource title;
- short description;
- file type if known;
- download/open action.
```

### 6.6 External Link block

Render as a curated link card with a clear open action.

### 6.7 Case Study block

Render as a scenario card:

```txt
- context;
- role/situation if configured;
- guiding question;
- learning point.
```

### 6.8 Accordion block

Render as accessible expandable sections.

### 6.9 Flashcard block

Render as reveal cards or a compact card grid.

### 6.10 Knowledge Check block

Render as an interactive low-stakes question:

```txt
- question;
- answer options;
- selected state;
- feedback;
- retry if supported.
```

### 6.11 Branching Scenario block

Render as applied decision practice:

```txt
- scenario title;
- scenario text;
- decision prompt;
- option cards;
- selected/recommended option state;
- consequence/feedback;
- learning point;
- retry/continue if supported.
```

### 6.12 Reflection Prompt block

Render as a private reflection prompt with supportive guidance.

### 6.13 Practical Activity block

Render as a worksheet/action card:

```txt
- instructions;
- expected output;
- optional field-style prompts;
- safety note where relevant.
```

## 7. Visual direction

Use the DEC / CSO Learning Hub visual system:

```txt
DEC Blue: #3B99D4
DEC Green: #91C852
Deep Navy: #0F172A
Dark Ink: #111827
Secondary Text: #6B7280
Light Background: #F9FAFB
White Surface: #FFFFFF
Border: #E5E7EB
```

The screen should feel:

```txt
- premium;
- locally grounded;
- practical;
- interactive;
- calm;
- high-quality;
- modern;
- CSO-focused.
```

## 8. Mobile behavior

On mobile/narrow screens:

```txt
- course outline collapses into a drawer;
- lesson content remains single-column;
- progress remains visible;
- bottom navigation remains tappable;
- interactive blocks remain usable;
- no horizontal overflow.
```

## 9. Accessibility requirements

```txt
- semantic headings;
- keyboard-accessible accordions/flashcards/knowledge checks;
- visible focus states;
- alt text for images;
- transcript support for video/audio;
- feedback not color-only;
- sufficient contrast;
- readable line length.
```

## 10. Must not show

```txt
- Build Studio controls;
- creator/admin buttons;
- internal review status;
- readiness checks;
- configJson;
- database labels;
- developer words such as placeholder, mock, TODO, WIP, DB, Prisma, scaffold, slice;
- Phase 2/3 modules;
- CRM/donor/grant management UI.
```

## 11. Acceptance criteria

```txt
- Learner course player loads saved course content.
- Course outline shows modules and lessons.
- Progress displays.
- Current lesson is highlighted.
- Completed lessons show completion indicators.
- Lesson content blocks render vertically and distinctly.
- All supported block types render safely.
- Resources are visible and usable.
- Final test locked/unlocked state works according to existing rules.
- Creator preview uses the same learner rendering without mutating progress.
- Participant cannot access creator/admin routes.
- Mobile/narrow viewport is usable.
- Visual QA passes or gaps are clearly documented.
```
