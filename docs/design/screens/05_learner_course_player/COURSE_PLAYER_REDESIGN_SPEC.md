# Learner Course Player Redesign Specification

## 1. Source and status

This document summarizes the uploaded control reference:

```txt
CSO Learning Hub: Design, Layout, and Course Player Specification
```

Use this as the primary visual and layout control for the next learner course player redesign slice. The Agora examples are references for structure, rhythm, and course-player behavior only. The implementation must adapt these patterns to CSO Learning Hub / DEC branding and must not copy UNICEF/Agora branding.

## 2. Core design decision

The learner course player must be visually redesigned, not lightly polished.

The current player should move toward a structured institutional e-learning experience with:

```txt
- top institutional header;
- course title/banner area;
- persistent left course outline;
- main lesson canvas;
- section title banners;
- vertical stacked content blocks;
- illustrations and callouts;
- integrated resource blocks;
- quiz and result states;
- Continue progression;
- completion indicators;
- Agora-inspired layout adapted to CSO Learning Hub / DEC branding.
```

## 3. Platform identity

The experience should feel like a formal organizational learning platform:

```txt
- clear DEC / CSO Learning Hub identity;
- bright blue institutional navigation;
- white and light grey learning surfaces;
- orange or green action accents only where appropriate;
- compact but readable LMS structure;
- strong progress, navigation, and completion cues.
```

The player should remain practical and accessible. It should not become a consumer-style marketing page, a raw Build Studio preview, or a generic document reader.

## 4. Global header

Retain a top institutional frame across learner routes.

The header should include:

```txt
- CSO Learning Hub / DEC identity;
- role-appropriate learner navigation;
- language or utility controls where already supported;
- learner name/avatar where already supported;
- safe Exit Course or return action.
```

The header confirms that the participant remains inside the CSO Learning Hub learning environment.

## 5. Course title and banner area

At the top of the course player, provide a clear course identity area:

```txt
- course title;
- course image or banner treatment where available;
- capacity area or template label;
- concise course description;
- progress summary;
- final-test/certificate note where supported.
```

This area should anchor the participant before the lesson content begins.

## 6. Persistent course outline

The left course outline is a priority feature.

It should include:

```txt
- course title or short title;
- course progress status;
- module/chapter groups;
- lesson titles;
- current lesson highlight;
- completed lesson indicators;
- upcoming or incomplete indicators;
- final test entry;
- scrollable navigation when content is long.
```

The outline helps participants understand where they are, what is complete, and what comes next. On mobile/narrow screens, it should collapse into a drawer or stacked course navigation pattern.

## 7. Main lesson canvas

The main lesson canvas should be a readable vertical learning page.

Required structure:

```txt
- module/lesson breadcrumb where useful;
- lesson or section title banner;
- lesson description or introduction;
- stacked learning blocks;
- resource and activity blocks inside the flow;
- previous/next or Continue progression controls.
```

The canvas should use a comfortable reading width and enough spacing that the course no longer feels like a Word document or admin page.

## 8. Section title banners

Agora-style course player screens rely on strong section headers, often using blue bands.

For CSO Learning Hub:

```txt
- use section title banners to separate major lesson moments;
- avoid excessive heavy blue blocking;
- vary supporting visuals, cards, and callouts to prevent repetition;
- keep headings readable on desktop and mobile.
```

Section banners should create rhythm across a lesson and help participants orient themselves.

## 9. Content block hierarchy

Saved Build Studio blocks should render as learning components, not raw content.

Priority block treatments:

```txt
- Text: readable learning section with headings, paragraphs, bullet clusters, pull quote, or highlighted note where configured.
- Key message: strong callout with icon or tone styling.
- Image: illustration/photo block with caption and alt text.
- Video: video/link card with transcript fallback.
- Resource: toolkit/download card integrated into the lesson flow.
- Case study: scenario/context card with guiding question and learning point.
- Accordion: clearly interactive expandable concept cards.
- Flashcard: reveal-card or compact card-grid interaction.
- Knowledge check: quiz-style formative card with answer feedback.
- Branching scenario: applied decision-practice layout with option cards, selected/recommended state, consequence, and learning point.
- Reflection prompt: private reflection card with supportive guidance.
- Practical activity: worksheet/action card with expected output and safety note.
```

## 10. Illustrations and callouts

The redesigned player should use illustrations, photos, icons, and callouts where data already provides them or where existing block configuration supports them.

Useful patterns from the reference:

```txt
- light blue information boxes;
- illustrated learning introductions;
- persona or quote-style blocks;
- visual explanation sections;
- icon-based process steps;
- dark quote panels only when the content supports a speaker/persona moment.
```

Do not hard-code course-specific illustrations into generic renderers.

## 11. Quiz and result states

Quiz and knowledge-check experiences should include:

```txt
- clear question numbering;
- single-answer radio or option cards;
- submit/apply action;
- visible selected state;
- feedback text;
- large pass/fail or correct/incorrect result treatment where supported;
- clear Continue path after the result.
```

Final-test behavior and certificate rules must remain governed by existing application logic.

## 12. Continue progression

The player should support both guided and flexible navigation:

```txt
- primary progression through Continue / Next lesson;
- secondary navigation through the course outline;
- completed lessons marked clearly;
- final test entry shown according to existing eligibility rules.
```

Continue controls should be visually prominent and easy to tap.

## 13. Mobile behavior

On mobile and narrow screens:

```txt
- the outline must not create horizontal overflow;
- course navigation should collapse, stack, or become a drawer;
- lesson blocks should remain single-column;
- section banners should wrap cleanly;
- buttons should remain tappable;
- quiz options and resource actions should remain usable.
```

## 14. Design adaptation rules

Use Agora as a layout and course-player behavior reference, not a brand clone.

Adaptation requirements:

```txt
- replace Agora/UNICEF identity with DEC / CSO Learning Hub identity;
- use DEC Blue #3B99D4, DEC Green #91C852, Deep Navy #0F172A, light backgrounds, white cards, soft borders, and accessible contrast;
- preserve the existing CSO Learning Hub route structure and learner template system;
- keep participant-facing language calm, professional, and CSO-focused;
- avoid developer language and raw configuration details.
```

## 15. Preserve existing product rules

The redesign must preserve:

```txt
- routes;
- data model;
- selected learner template metadata;
- saved Build Studio content rendering;
- lesson-level progress;
- final-test gating;
- 80% pass threshold;
- certificate behavior;
- role and visibility rules;
- draft/unpublished course hiding.
```

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

## 16. Implementation readiness

The next implementation slice should focus on a real visual redesign of the existing learner course player shell and block hierarchy while preserving the working template-driven renderer, HRBA demo course import, learner progress behavior, final-test behavior, and route guards.
