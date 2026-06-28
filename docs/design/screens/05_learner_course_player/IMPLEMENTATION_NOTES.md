# IMPLEMENTATION_NOTES.md

# Learner Course Player — Implementation Notes

## 1. Implementation intent

Implement the learner course player as a template-driven rendering system, not as one-off hard-coded course pages.

The player should render saved Build Studio data through approved learner templates.

The current course player must be visually redesigned, not lightly polished. Use the registered redesign spec and Agora course-player references to improve the shell layout, sidebar, lesson canvas, section headers, block visual hierarchy, quiz/result states, and mobile behavior.

Preserve existing routes, data model, template selection, learner progress, final-test behavior, and role/visibility rules.

Do not add:

```txt
- new primary routes;
- SCORM/xAPI;
- external iframe course player;
- full theme builder;
- diagnosis;
- capacity map;
- action map;
- CRM;
- donor tooling;
- proof workflow;
- badges;
- per-block progress tracking.
```

## 2. Core data flow

```txt
Course
→ CourseVersion
→ Module
→ Lesson
→ ContentBlock
→ LearnerTemplateRenderer
→ LearnerBlockRenderer
→ LearnerCoursePlayer
```

## 3. Recommended components

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

Codex may adapt to current repo conventions, but should avoid inconsistent one-off fragments.

## 4. Template defaults

If template selection is unavailable:

```txt
selectedTemplateId = LT-GUIDED-LESSON
selectedThemeId = DEC_DEFAULT
selectedNavigationStyleId = SIDEBAR_OUTLINE
```

## 5. Block renderer implementation guidance

### 5.1 Use alias-safe config parsing

Existing Build Studio config may use slightly different field names. Renderers should safely read known aliases.

Example:

```txt
title | blockTitle
body | content | text
items | accordionItems | cards | options
url | href | fileUrl | videoUrl | imageUrl
feedback | correctFeedback | consequence
```

Do not expose raw configJson to learners.

### 5.2 Fail safely

If a block is incomplete:

```txt
- render the available title/content;
- avoid crashing;
- avoid developer language;
- show a clean learner-safe unavailable message only if necessary.
```

Do not show “missing configJson” or technical errors to participants.

## 6. Progress behavior

Phase 1 uses lesson-level progress.

```txt
course progress = completed required lessons / total required lessons
```

Do not introduce per-block progress tracking in this slice.

## 7. Final test behavior

```txt
- final test remains locked until required lessons are complete where supported;
- pass threshold remains 80%;
- lesson knowledge checks remain low-stakes;
- final test attempts remain in the existing final-test route.
```

## 8. Creator preview behavior

Creator preview should use the learner rendering engine but must not:

```txt
- mark lessons complete;
- create quiz attempts;
- issue certificates;
- mutate participant progress.
```

Creator-only actions, such as “Return to Build Studio,” may appear outside the learner preview frame.

## 9. Asset behavior

Images, videos, and resources should use saved asset paths.

Preferred course asset path pattern:

```txt
/assets/demo/[course-slug]/images/[filename]
/assets/demo/[course-slug]/resources/[filename]
```

Do not use local Windows paths or localhost URLs in saved course data.

## 10. Visual QA requirements

Before returning evidence pack, verify:

```txt
- desktop course player;
- mobile/narrow course player;
- launch/continue screen;
- current lesson active state;
- resource cards;
- branching scenario;
- flashcards;
- accordion;
- knowledge check;
- final test entry;
- no creator/admin controls in learner view;
- no developer language.
```

## 11. Tests to run

```txt
npm run prisma:validate
npm run typecheck
npm run lint
npm run verify:build-studio-blocks
npm run verify:build-studio-block-editing
npm run verify:learner-course-player
npm run build
```

Optional new verifier:

```txt
npm run verify:learner-template-rendering
```

## 12. Evidence pack requirements

Return evidence pack using:

```txt
docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md
```

Include:

```txt
- plan followed;
- files changed;
- routes affected;
- components created/updated;
- template strategy;
- block renderer strategy;
- tests run and results;
- visual QA notes;
- mobile notes;
- known gaps;
- next smallest safe step.
```
