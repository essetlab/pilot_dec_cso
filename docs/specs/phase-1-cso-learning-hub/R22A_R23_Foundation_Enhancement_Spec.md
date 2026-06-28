# R22A+ / R23 Foundation Enhancement Spec

## Course Setup, Metadata, Outcomes, and Build Studio Alignment

**Product:** DEC / WHH CSF+ CSO Learning Hub  
**Release:** Phase 1  
**Spec type:** Repo-ready implementation enhancement specification  
**Intended implementer:** Codex / AI coding agent / developer  
**Status:** Ready for implementation planning  
**Scope level:** Enhancement only — no structural workflow expansion  

---

## 1. Purpose

This specification defines a focused enhancement to the existing Course Creator workflow for the DEC / WHH CSF+ CSO Learning Hub Phase 1 platform.

The goal is to make the existing Course Setup, Metadata, Learning Outcomes, and Build Studio screens more data-rich, structured, and capacity-development aligned **without adding new workflow screens** and without expanding Phase 1 into a full diagnosis, capacity map, action map, practical proof, or advanced MEAL system.

The current route structure already supports the right Course Creator flow:

```txt
/creator/courses/new
/creator/courses/[courseId]/setup
/creator/courses/[courseId]/metadata
/creator/courses/[courseId]/outcomes
/creator/courses/[courseId]/build
/creator/courses/[courseId]/resources
/creator/courses/[courseId]/quiz
/creator/courses/[courseId]/preview
/creator/courses/[courseId]/submit
/creator/courses/[courseId]/feedback
```

This enhancement keeps that structure intact and improves the **data model, UI fields, reference dropdowns, alignment logic, and readiness checks** inside the current screens.

---

## 2. Product rationale

The CSO Learning Hub should not behave like a generic LMS or a place where workshop files are uploaded as online lessons. It should help course creators move through a disciplined logic:

```txt
capacity gap
→ course-fit decision
→ observable practice
→ structured learning
→ assessment
→ application support
→ monitoring signal
```

Phase 1 remains course-centered, but it must be ecosystem-aware. It should directly address knowledge and skill gaps while surfacing motivation and environment barriers for follow-up support, without pretending a course solves everything.

The implementation principle is:

> Keep the current Course Creator structure simple, but make each course traceable from capacity area and CSO practice to outcome, indicator, lesson, block, assessment, and monitoring signal.

---

## 3. Non-negotiable scope boundaries

Codex must not add new major workflow screens or active modules.

Do **not** add:

- full diagnosis workflow;
- capacity map screen;
- action map screen;
- donor CRM;
- grants pipeline;
- practical proof verification workflow;
- badge verification workflow;
- advanced impact dashboard;
- collaboration/co-creation workspace;
- monitoring dashboard inside Build Studio;
- heavy governance panels inside Build Studio.

The enhancement must remain inside the existing Course Creator flow.

---

## 4. Existing screens to enhance

Codex must work only within the existing Course Creator structure:

```txt
/creator/courses/new
/creator/courses/[courseId]/setup
/creator/courses/[courseId]/metadata
/creator/courses/[courseId]/outcomes
/creator/courses/[courseId]/build
/creator/courses/[courseId]/quiz
/creator/courses/[courseId]/preview
/creator/courses/[courseId]/submit
```

No new primary navigation item should be added.

---

# 5. Enhancement logic by screen

---

## 5.1 Course Setup

### Purpose

Course Setup captures the public and operational identity of the course.

It should answer:

```txt
What is this course?
Who is it for?
How will participants access it?
Will it lead to a certificate?
What basic learning experience should the participant expect?
```

### Keep existing fields

Course Setup should continue to include:

- course title;
- short description;
- long description;
- target audience;
- language;
- course level;
- estimated duration;
- certificate setting;
- final test requirement;
- save button.

### Add/enhance fields without changing structure

| Field | Data type | UI control | Required | Storage recommendation |
|---|---:|---|---|---|
| `title` | string | text input | yes | `Course.title` |
| `slug` | string | generated, hidden/advanced | yes | `Course.slug` |
| `shortDescription` | string | textarea | yes | `Course.shortDescription` |
| `longDescription` | string | textarea/rich textarea | before review | `Course.longDescription` |
| `targetAudience` | string | textarea | yes | `Course.targetAudience` |
| `targetParticipantRoleIds` | string[] / relation | multi-select | recommended | reference list or JSON |
| `language` | reference/enum | dropdown | yes | `Course.language` |
| `level` | reference/enum | dropdown | yes | `Course.level` |
| `estimatedDurationMinutes` | integer | number input | yes | `Course.estimatedDurationMinutes` |
| `visibility` | enum | dropdown/radio | yes | `Course.visibility` |
| `accessModel` | reference/enum | dropdown | optional if visibility exists | `Course.visibility` or metadata |
| `certificateEligible` | boolean | toggle | yes | `Course.certificateEligible` |
| `finalTestRequired` | boolean | toggle | conditional | `Course.finalTestRequired` |
| `defaultPassThreshold` | integer | number input | yes if certificate eligible | `Course.defaultPassThreshold`, default 80 |
| `retakeAllowed` | boolean | toggle | optional | Quiz/final test config |
| `maxAttempts` | integer | number input | optional | Quiz/final test config |
| `coverImageUrl` | string | file/URL picker | optional | `Course.coverImageUrl` |
| `lowBandwidthFriendly` | boolean | toggle | recommended | metadata JSON or Course field |
| `printableResourcesAvailable` | boolean | toggle | optional | metadata JSON |
| `accessibilityNote` | string | textarea | optional | metadata JSON or Course field |
| `safeguardingSensitivityLevel` | enum/reference | dropdown | recommended | metadata JSON/reference |

### UI grouping

Use grouped form sections:

1. **Basic course information**
2. **Audience and access**
3. **Certificate and final test settings**
4. **Accessibility and low-bandwidth readiness**

Keep this screen light. Do not introduce analysis questions here.

---

## 5.2 Metadata and Capacity Linkage

### Purpose

Metadata becomes the simplified Analysis Gate. It must capture the minimum capacity-development logic without becoming a full diagnosis module.

### Required metadata groups

#### Group 1 — Capacity focus

| Field | Data type | UI control | Required | Storage |
|---|---:|---|---|---|
| `capacityAreaId` | FK | dropdown | yes | `CourseCapacityArea` primary |
| `secondaryCapacityAreaIds` | FK[] | multi-select | optional | `CourseCapacityArea` |
| `csoPracticeId` | FK | dropdown filtered by capacity area | yes | `CourseCSOPracticeLink` or metadata JSON |
| `standardFamilyIds` | FK[] | multi-select | recommended | `CourseStandardLink` or metadata JSON |
| `primaryIndicatorIds` | FK[] | multi-select filtered by capacity/practice/standard | recommended | `CourseIndicatorLink` or metadata JSON |

#### Group 2 — Practice gap

| Field | Data type | UI control | Required | Storage |
|---|---:|---|---|---|
| `capacityGapAddressed` | string | textarea | yes | `Course.capacityGapAddressed` |
| `currentPracticeBaseline` | string | textarea | recommended | new field or `analysisMetadataJson` |
| `desiredPractice` | string | textarea | recommended | new field or `analysisMetadataJson` |
| `evidenceSourceType` | string[]/reference | multi-select | optional | `analysisMetadataJson` |
| `rootCauseSummary` | string | textarea | optional | `analysisMetadataJson` |

#### Group 3 — Course-fit logic

| Field | Data type | UI control | Required | Storage |
|---|---:|---|---|---|
| `ksmePrimary` | enum/reference | dropdown | yes | `analysisMetadataJson` or explicit field |
| `ksmeSecondary` | enum[] | multi-select | optional | `analysisMetadataJson` |
| `learningCanHelp` | enum/reference | dropdown | yes | `analysisMetadataJson` |
| `courseFitDecision` | enum/reference | dropdown/radio | yes | `analysisMetadataJson` |
| `courseFitNote` | string | textarea | conditional | `analysisMetadataJson` |

#### Group 4 — Follow-up and safeguards

| Field | Data type | UI control | Required | Storage |
|---|---:|---|---|---|
| `targetCsoProfile` | string | textarea | yes before review | `Course.targetCsoProfile` |
| `intendedPracticeImprovement` | string | textarea | yes | `Course.intendedPracticeImprovement` |
| `recommendedPrerequisites` | string | textarea | optional | `Course.recommendedPrerequisites` |
| `relatedFollowUpSupport` | string | textarea | optional | `Course.relatedFollowUpSupport` |
| `motivationBarrierCategories` | string[]/reference | multi-select | optional | `analysisMetadataJson` |
| `environmentBarrierCategories` | string[]/reference | multi-select | optional | `analysisMetadataJson` |
| `safeguardingNote` | string | textarea | optional | `analysisMetadataJson` |
| `accessibilityNote` | string | textarea | optional | `analysisMetadataJson` |

### K/S/M/E options

Use this controlled list:

```txt
KNOWLEDGE
SKILL
MOTIVATION
ENVIRONMENT
MIXED
```

### Course-fit decision options

Use this controlled list:

```txt
GOOD_FIT_FOR_PHASE_1_COURSE
PARTIAL_FIT_COURSE_PLUS_SUPPORT
NOT_A_COURSE_FIT_ROUTE_TO_SUPPORT
NEEDS_MORE_ANALYSIS
```

### Rule

Only the first two course-fit decisions should allow normal movement toward review:

```txt
GOOD_FIT_FOR_PHASE_1_COURSE
PARTIAL_FIT_COURSE_PLUS_SUPPORT
```

If `NOT_A_COURSE_FIT_ROUTE_TO_SUPPORT` or `NEEDS_MORE_ANALYSIS` is selected, show a lightweight warning. Do not block saving the draft.

---

## 5.3 Learning Outcomes

### Purpose

Outcomes must become the bridge between course intent and monitoring. They should not remain only free-text learning objectives.

### Required outcome fields

| Field | Data type | UI control | Required | Storage |
|---|---:|---|---|---|
| `statement` | string | textarea | yes | `LearningOutcome.statement` |
| `capacityAreaId` | FK | dropdown | yes | new field or link |
| `csoPracticeId` | FK | dropdown filtered by capacity area | yes | new field or link |
| `localOutcomeStatement` | string | textarea | recommended | new field or JSON |
| `observableAction` | string | textarea/action builder | yes | new field or JSON |
| `standardFamilyId` | FK | dropdown | recommended | new field/link |
| `indicatorId` | FK | dropdown filtered by capacity/practice/standard | recommended | new field/link |
| `measurementLevel` | reference | dropdown | recommended | new field or JSON |
| `assessmentMethod` | reference | dropdown | recommended | new field or JSON |
| `evidenceType` | reference/string | dropdown/autofill | optional | new field or JSON |
| `successCriterion` | string | short text | optional | new field or JSON |
| `moduleId` | FK | dropdown | optional | existing |
| `lessonId` | FK | dropdown filtered by module | optional | existing |
| `quizQuestionIds` | FK[] | multi-select | optional | link table or JSON |
| `order` | integer | drag/order | yes | existing |

### Suggested assessment method options

```txt
FINAL_TEST
KNOWLEDGE_CHECK
BRANCHING_SCENARIO
PRACTICAL_ACTIVITY
REFLECTION
FEEDBACK
NOT_ASSESSED_IN_PHASE_1
```

### Suggested measurement level options

```txt
LEARNER_KNOWLEDGE
LEARNER_SKILL
PRACTICE_PERFORMANCE
COURSE_COMPLETION_SIGNAL
FUTURE_ORGANIZATIONAL_SIGNAL
```

### Example outcome

```txt
Capacity Area:
Evidence-Based Advocacy and Civic Engagement

CSO Practice:
Draft safe evidence-based advocacy messages

Outcome:
Participants can draft a short advocacy message using credible, non-sensitive community evidence.

Observable Action:
Select safe evidence, remove sensitive details, and frame one constructive advocacy message.

Standard Family:
EU / DG NEAR Civil Society Guidelines

Indicator:
EU-ADV-01 — Evidence-based advocacy message

Assessment Method:
Branching Scenario + Final Test

Evidence Type:
Scenario decision, final test answer, optional advocacy message draft
```

---

## 5.4 Build Studio

### Purpose

Build Studio remains the clean block-based authoring workspace. It must not become a metadata or diagnosis screen.

However, it should carry lightweight alignment tags so that lessons and blocks connect to outcomes, CSO practice, learning function, and indicator logic.

### Keep existing structure

No layout change:

```txt
Left: Block Library + Course Outline
Center: Course Canvas
Right: Selected Block Configuration
```

### Lesson-level enhancement

Add these fields to lesson settings or a compact lesson details section:

| Field | Data type | UI control | Required | Storage |
|---|---:|---|---|---|
| `linkedOutcomeIds` | FK[] | multi-select | recommended | `LessonOutcomeLink` or metadata JSON |
| `lessonLearningFunction` | enum | dropdown | recommended | Lesson metadata |
| `lessonPracticeFocus` | string | short textarea | optional | Lesson metadata |
| `expectedOutput` | string | short textarea | optional | Lesson metadata |
| `estimatedDurationMinutes` | integer | number input | yes if already used | existing |
| `completionRequired` | boolean | toggle | yes | existing |

### Block-level enhancement

Add a collapsed **Alignment** subsection in the existing right Block Configuration panel.

| Field | Data type | UI control | Required | Storage |
|---|---:|---|---|---|
| `linkedOutcomeId` | FK | dropdown | recommended | `ContentBlockOutcomeLink` or `configJson` |
| `learningFunction` | enum | dropdown | recommended | `configJson.learningFunction` |
| `blockPurpose` | enum/reference | dropdown | optional | `configJson.blockPurpose` |
| `expectedLearnerAction` | string | short textarea | recommended for practice blocks | `configJson.expectedLearnerAction` |
| `indicatorId` | FK | read-only inherited or override | optional | `configJson.indicatorId` |
| `accessibilityStatus` | enum | read-only/calculated | recommended | calculated/config |
| `barrierCaptureEnabled` | boolean | toggle for Reflection/Practical Activity | optional | `configJson` |

### Learning function taxonomy

Use this small dropdown:

```txt
EXPLAIN
INVESTIGATE
REFLECT
PRACTICE
APPLY
PRODUCE
ASSESS
SUPPORT_ACCESS
```

Suggested mapping:

| Learning function | Suitable blocks |
|---|---|
| `EXPLAIN` | Text, Video, Key Message, Accordion |
| `INVESTIGATE` | Case Study, Resource, Image |
| `REFLECT` | Reflection |
| `PRACTICE` | Knowledge Check, Branching Scenario, Flashcards |
| `APPLY` | Practical Activity, Resource |
| `PRODUCE` | Practical Activity, Resource template |
| `ASSESS` | Knowledge Check, Final Test |
| `SUPPORT_ACCESS` | Transcript, Downloadable Resource, low-bandwidth support |

### Canvas display

Show alignment as small badges only:

```txt
Outcome: Safe advocacy message
Function: Practice
Indicator: EU-ADV-01
Accessibility: OK
```

Do not show long metadata panels in the canvas.

---

# 6. Reference data model

Codex should seed and use reference data from the uploaded CSV sheets:

```txt
CapacityArea.csv
CSOPractice.csv
StandardFamily.csv
Indicator.csv
_Lists.csv
```

---

## 6.1 CapacityArea

Use for course setup, metadata, outcomes, catalogue filters, and monitoring filters.

```prisma
model CapacityArea {
  id          String @id
  name        String
  description String?
  isActive    Boolean @default(true)
  sortOrder   Int?
}
```

Example values:

```txt
CAP-GOV
CAP-ACC
CAP-STRAT
CAP-FIN
CAP-HRSAFE
CAP-ADV
CAP-MEAL
CAP-DIG
CAP-PART
```

---

## 6.2 CSOPractice

New reference table if not already present.

```prisma
model CSOPractice {
  id             String @id
  capacityAreaId String
  name           String
  description    String?
  exampleGap     String?
  isActive       Boolean @default(true)

  capacityArea   CapacityArea @relation(fields: [capacityAreaId], references: [id])
}
```

Example values:

```txt
PRAC-MEAL-OUTCOME-EVID
PRAC-MEAL-LEARNING-USE
PRAC-ADV-SAFE-MSG
PRAC-HRSAFE-REFERRAL
PRAC-GOV-BOARD-DECISION
PRAC-FIN-BUDGET-JUST
```

---

## 6.3 StandardFamily

```prisma
model StandardFamily {
  id          String @id
  name        String
  description String?
  isActive    Boolean @default(true)
}
```

Example values:

```txt
STD-EU-DGNEAR
STD-GLOBAL-CSO
STD-HRBA
STD-SAFE-DNH
STD-GEI
STD-DEC-CAP
STD-DONOR-PROG
```

---

## 6.4 Indicator

```prisma
model Indicator {
  id                   String @id
  standardFamilyId      String
  indicatorCode         String
  indicatorName         String
  indicatorDescription  String?
  capacityAreaId        String?
  csoPracticeId         String?
  measurementLevel      String?
  evidenceType          String?
  isActive              Boolean @default(true)

  standardFamily        StandardFamily @relation(fields: [standardFamilyId], references: [id])
}
```

---

# 7. Link tables and storage strategy

## 7.1 Preferred normalized links

Use these if migration is safe.

```prisma
model CourseCSOPracticeLink {
  id            String @id @default(cuid())
  courseId      String
  csoPracticeId String
  isPrimary     Boolean @default(false)

  @@unique([courseId, csoPracticeId])
}
```

```prisma
model CourseStandardLink {
  id               String @id @default(cuid())
  courseId          String
  standardFamilyId  String
  linkType          String // PRIMARY, SECONDARY, CONTEXT

  @@unique([courseId, standardFamilyId])
}
```

```prisma
model CourseIndicatorLink {
  id                String @id @default(cuid())
  courseId          String
  indicatorId       String
  linkType          String // PRIMARY, SECONDARY, CONTEXT
  useForMonitoring  Boolean @default(true)
  notes             String?

  @@unique([courseId, indicatorId])
}
```

```prisma
model LearningOutcomeIndicatorLink {
  id                 String @id @default(cuid())
  learningOutcomeId  String
  indicatorId        String
  alignmentStrength  String // DIRECT, PARTIAL, BACKGROUND
  assessmentMethod   String?
  notes              String?

  @@unique([learningOutcomeId, indicatorId])
}
```

```prisma
model ContentBlockOutcomeLink {
  id                 String @id @default(cuid())
  contentBlockId     String
  learningOutcomeId  String
  linkType           String // SUPPORTS, PRACTICES, ASSESSES, APPLIES

  @@unique([contentBlockId, learningOutcomeId])
}
```

## 7.2 Low-risk fallback strategy

If Codex determines migrations are risky, use JSON metadata fields first:

```prisma
Course.analysisMetadataJson Json?
LearningOutcome.alignmentMetadataJson Json?
ContentBlock.configJson.alignment Json?
Lesson.metadataJson Json?
```

This is acceptable for the first implementation pass if Codex clearly documents the tradeoff in the evidence pack.

---

# 8. Required UI behavior

## 8.1 Dropdown filtering

Codex must implement cascading dropdowns:

```txt
Capacity Area → CSO Practice → Indicator
Standard Family → Indicator
```

Rules:

- Selecting a capacity area filters CSO practices.
- Selecting a CSO practice filters indicators.
- Selecting a standard family narrows indicators further.
- If no indicators match, show a clear empty state:

```txt
No indicators match this capacity area and practice yet.
```

## 8.2 Inheritance

Use sensible inheritance:

- Course-level capacity area appears as default in Metadata and Outcomes.
- Outcome-level CSO practice inherits from course metadata unless changed.
- Block-level indicator inherits from linked outcome unless overridden.
- Build Studio should show inherited values as read-only chips unless editing is needed.

## 8.3 Readiness checks

Extend existing readiness checks lightly.

Before submit for review, check:

1. Course title present.
2. Short description present.
3. Target audience present.
4. Language selected.
5. Level selected.
6. Estimated duration provided.
7. Capacity area selected.
8. CSO practice selected.
9. Capacity gap addressed.
10. Intended practice improvement entered.
11. K/S/M/E primary selected.
12. Course-fit decision selected.
13. At least one learning outcome exists.
14. Each outcome has capacity area and CSO practice.
15. At least one outcome has an assessment method or indicator.
16. At least one module exists.
17. Each module has at least one lesson.
18. Each lesson has at least one block.
19. Certificate-eligible course has final test configured.
20. Image blocks have alt text.
21. Video blocks show transcript/caption warning if missing.

---

# 9. Data seeding requirements

Codex must seed the uploaded minimum viable reference tables:

```txt
CapacityArea.csv
CSOPractice.csv
StandardFamily.csv
Indicator.csv
_Lists.csv
```

Seed behavior:

- Use stable IDs from the CSVs.
- Upsert, do not duplicate.
- Deactivate obsolete reference values rather than hard-delete if already used.
- Include at least one demo course with full linkage:
  - capacity area;
  - CSO practice;
  - standard family;
  - indicator;
  - outcome;
  - module;
  - lesson;
  - content block;
  - final test question.

---

# 10. Monitoring implications

This enhancement should enable monitoring to report:

- courses by capacity area;
- courses by CSO practice;
- learner progress by capacity area;
- final test pass rate by indicator;
- weak outcomes by assessment performance;
- feedback by capacity area or course;
- course improvement signals by standard family;
- published courses aligned to EU / DG NEAR, HRBA, safeguarding, gender/inclusion, or DEC capacity framework.

Do not claim organizational transformation from course completion.

---

# 11. Acceptance criteria

Codex must verify the following.

## 11.1 Course Setup

- Creator can create a draft course.
- Creator can edit and save Course Setup fields.
- Course remains Draft after setup save.
- Required fields show clear validation.
- Certificate eligible defaults to 80% pass threshold when applicable.
- No full diagnosis/capacity/action-map UI appears.

## 11.2 Metadata

- Creator can select capacity area.
- Creator can select CSO practice filtered by capacity area.
- Creator can select standard family and indicator.
- Creator can save target CSO profile, capacity gap, current practice, desired practice, K/S/M/E, course-fit decision, prerequisites, and follow-up support.
- Reopening the metadata page shows persisted values.
- Metadata screen remains lightweight.

## 11.3 Outcomes

- Creator can add, edit, reorder, and delete outcomes.
- Each outcome can be linked to capacity area, CSO practice, standard family, and indicator.
- Each outcome can define observable action, assessment method, measurement level, and success criterion.
- Outcomes remain visible in preview/course detail where appropriate.
- At least one outcome is required before publication.

## 11.4 Build Studio

- Existing three-column layout is preserved.
- Lessons can link to outcomes.
- Blocks can link to outcomes through collapsed alignment controls.
- Block learning function can be selected.
- Canvas shows only small chips/badges, not large metadata panels.
- Participant rendering is not affected negatively.
- No excluded Phase 2/3 features are added.

## 11.5 Reference data

- CapacityArea, CSOPractice, StandardFamily, Indicator, and list values are seeded/upserted.
- Dropdowns read from seeded reference data.
- Filters work correctly.
- Used reference values are not hard-deleted.

## 11.6 Role and route protection

- Course Creator can edit owned/assigned editable courses.
- Admin/Super Admin can access where current permissions allow.
- Participant cannot access creator routes.
- Public users cannot access creator routes.

---

# 12. Verification commands

Codex must run:

```txt
npm run prisma:validate
npm run typecheck
npm run lint
npm run build
```

Codex should add one or more focused verification scripts if appropriate:

```txt
npm run verify:r22a
npm run verify:course-alignment
```

Suggested checks in verification script:

- reference data seeded;
- capacity area → CSO practice relationship works;
- indicator filtering works;
- metadata saves and reloads;
- learning outcome indicator link saves and reloads;
- Build Studio block alignment persists;
- participant cannot access creator routes;
- course remains draft after setup/metadata/outcomes save.

---

# 13. Evidence pack requirements

Codex must return a full evidence pack using `EVIDENCE_PACK_TEMPLATE.md`.

The evidence pack must include:

1. files changed;
2. routes/screens affected;
3. schema changes or explicit “no schema changes” statement;
4. reference data seeded;
5. fields added/enhanced;
6. storage strategy used: normalized tables or JSON fallback;
7. dropdown/filter behavior verified;
8. role/permission checks;
9. readiness checks;
10. visual QA notes;
11. known gaps;
12. next smallest safe step.

Do not mark the slice complete if tests were not run or if metadata/outcome persistence was not verified.

---

# 14. Codex implementation prompt

Copy/paste this to Codex:

```txt
Plan first.

Implement the Course Creator Foundation Data Enhancement for the DEC / WHH CSF+ CSO Learning Hub Phase 1 repository.

This is an enhancement to existing Course Setup, Metadata, Outcomes, and Build Studio screens. It is not a structural redesign and must not add new workflow screens.

Before making changes, read:
- docs/specs/phase-1-cso-learning-hub/CODEX_IMPLEMENTATION_STATUS.md
- docs/specs/phase-1-cso-learning-hub/CODEX_REVISED_IMPLEMENTATION_PLAN.md
- docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/DATA_MODEL.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_BLOCK_REFERENCE.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Also inspect the uploaded or repo-available reference sheets:
- CapacityArea.csv
- CSOPractice.csv
- StandardFamily.csv
- Indicator.csv
- _Lists.csv

Objective:
Enhance the existing Course Creator flow so each course is traceable from capacity area and CSO practice to metadata, outcome, indicator, lesson, block, assessment, and monitoring signal.

Do not add full diagnosis, capacity map, action map, practical proof verification, badge verification, CRM, donor management, collaboration, co-creation, or advanced monitoring modules.

Routes/screens affected:
- /creator/courses/new
- /creator/courses/[courseId]/setup
- /creator/courses/[courseId]/metadata
- /creator/courses/[courseId]/outcomes
- /creator/courses/[courseId]/build
- /creator/courses/[courseId]/submit, only for readiness check updates if needed
- Admin reference-data seed/scripts only if needed for dropdowns

Implementation scope:

1. Reference data
- Add or align reference models/tables for:
  - CapacityArea
  - CSOPractice
  - StandardFamily
  - Indicator
  - controlled list values from _Lists.csv
- Use stable IDs from the CSVs.
- Upsert reference data.
- Do not hard-delete used reference values.

2. Course Setup enhancement
Keep existing structure. Add or verify:
- course title
- slug generation
- short description
- long description
- target audience
- participant role multi-select if feasible
- language dropdown
- level dropdown
- estimated duration
- visibility/access model
- certificate eligible toggle
- final test required toggle
- pass threshold default 80
- retake allowed and max attempts if already supported in quiz/final test config
- cover image
- low-bandwidth friendly flag
- accessibility note
- safeguarding sensitivity level if supported by reference data

3. Metadata enhancement
Make /creator/courses/[courseId]/metadata DB-backed and persist:
- primary capacity area
- secondary capacity areas, optional
- CSO practice dropdown filtered by capacity area
- standard family dropdown/multi-select
- indicator dropdown filtered by capacity area, CSO practice, and standard family
- target CSO profile
- capacity gap addressed
- current practice baseline
- desired practice
- evidence source type
- root cause summary
- K/S/M/E primary
- K/S/M/E secondary
- learning can help
- course-fit decision
- course-fit note
- intended practice improvement
- recommended prerequisites
- related follow-up support
- safeguarding note
- accessibility note

If schema migration is safe, use normalized reference/link tables. If migration is risky, use the smallest safe JSON metadata approach and document it clearly in the evidence pack.

4. Learning Outcomes enhancement
Enhance /creator/courses/[courseId]/outcomes so each outcome can capture:
- outcome statement
- capacity area dropdown
- CSO practice dropdown filtered by capacity area
- local outcome statement
- observable action
- standard family dropdown
- indicator dropdown filtered by capacity/practice/standard
- measurement level
- assessment method
- evidence type
- success criterion
- optional linked module
- optional linked lesson
- optional linked final test question
- order

At least one outcome remains required before publication.

5. Build Studio alignment enhancement
Preserve the existing three-column layout.
Do not add heavy metadata panels.

Add only lightweight alignment support:
- lesson can link to one or more outcomes
- lesson can have a learning function
- lesson can capture expected output
- block configuration panel includes a collapsed Alignment section
- block can link to one outcome
- block can select learning function:
  - EXPLAIN
  - INVESTIGATE
  - REFLECT
  - PRACTICE
  - APPLY
  - PRODUCE
  - ASSESS
  - SUPPORT_ACCESS
- block can capture expected learner action
- block can inherit indicator from linked outcome
- canvas shows only small chips/badges for outcome/function/accessibility, not large metadata cards

6. Readiness checks
Extend readiness checks lightly:
- title present
- short description present
- target audience present
- language selected
- level selected
- duration provided
- capacity area selected
- CSO practice selected
- capacity gap addressed
- intended practice improvement entered
- K/S/M/E primary selected
- course-fit decision selected
- at least one learning outcome exists
- each outcome has capacity area and CSO practice
- at least one outcome has assessment method or indicator
- at least one module exists
- each module has one lesson
- each lesson has one block
- certificate-eligible course has final test configured
- image blocks have alt text
- video blocks show transcript/caption warning if missing

7. UI constraints
- Keep forms grouped and readable.
- Keep Metadata lightweight.
- Do not expose developer words such as placeholder, mock, DB, Prisma, scaffold, TODO, WIP, backend, or frontend in user-facing UI.
- Do not add new primary navigation.
- Do not show donor/technical indicator language to learners unless translated into plain learning language.
- Keep Build Studio focused on content creation.

Acceptance criteria:
- Creator can create a draft course.
- Creator can save Course Setup.
- Creator can save Metadata and reopen persisted values.
- Creator can select Capacity Area → filtered CSO Practice → filtered Indicator.
- Creator can add outcomes linked to capacity area, CSO practice, standard family, and indicator.
- Creator can link lessons/blocks to outcomes inside Build Studio without changing the layout.
- Build Studio still renders blocks and learner preview correctly.
- Course remains Draft after setup/metadata/outcomes saves.
- Participant cannot access creator routes.
- No full diagnosis/capacity map/action map/CRM/practical proof/badge workflow is added.
- npm run prisma:validate passes.
- npm run typecheck passes.
- npm run lint passes.
- npm run build passes.

Verification:
- npm run prisma:validate
- npm run typecheck
- npm run lint
- npm run build
- Add or update a focused verification script if appropriate:
  - npm run verify:r22a
  - npm run verify:course-alignment

Manual checks:
- /creator/courses/new as Course Creator
- /creator/courses/[courseId]/setup as Course Creator
- /creator/courses/[courseId]/metadata as Course Creator
- /creator/courses/[courseId]/outcomes as Course Creator
- /creator/courses/[courseId]/build as Course Creator
- blocked access as Participant
- desktop visual QA
- mobile/narrow viewport visual QA

Return a full evidence pack using EVIDENCE_PACK_TEMPLATE.md.
The evidence pack must clearly state:
- whether schema changes were made;
- whether JSON fallback was used;
- which fields were implemented;
- which reference data was seeded;
- which routes were checked;
- which acceptance criteria passed;
- known gaps;
- next smallest safe step.
```

---

# 15. Final implementation principle

This enhancement should make the platform feel more serious, more standards-linked, and more useful for monitoring, while still remaining simple for course creators.

The final product should not feel like:

```txt
A full diagnosis and compliance system.
```

It should feel like:

```txt
A clean course creation workflow where every course is lightly but clearly linked to a CSO capacity gap, practice area, learning outcome, indicator, and practical learner action.
```
