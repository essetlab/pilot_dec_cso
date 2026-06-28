# Codex Import Prompt — HRBA Advocacy Demo Course

## Course

**Course title:** Human Rights-Based Advocacy in Practice for Local CSOs  
**Course ID:** `COURSE-HRBA-ADVOCACY-PRACTICE`  
**Course slug:** `human-rights-based-advocacy-in-practice-for-local-csos`  
**CSV package folder:** `docs/specs/phase-1-cso-learning-hub/demo-courses/hrba-advocacy/`

---

## Prompt to Codex

```txt
Plan first.

Import or seed the complete HRBA Advocacy demo course using the CSV package in:

docs/specs/phase-1-cso-learning-hub/demo-courses/hrba-advocacy/

Required files:
- 00_import_manifest.csv
- 01_course_setup_enhanced.csv
- 02_course_metadata_enhanced.csv
- 03_learning_outcomes_enhanced.csv
- 04_modules_lessons_enhanced.csv
- 05_build_studio_blocks_enhanced.csv
- 06_final_test_enhanced.csv
- 07_asset_manifest_enhanced.csv
- 08_catalog_preview_data.csv
- 09_course_preview_qa.csv

Also use the existing reference data folder:

docs/specs/phase-1-cso-learning-hub/reference-data/

Required reference CSVs:
- CapacityArea.csv
- CSOPractice.csv
- StandardFamily.csv
- Indicator.csv
- _Lists.csv

Objective:
Create a fully developed demo course from the CSVs so it appears correctly in:
- Course Creator setup, metadata, outcomes, Build Studio, final test, and preview;
- public course catalogue after publish;
- public course detail page after publish;
- learner course preview/player;
- final test route;
- monitoring/alignment data where supported.

Important:
This is a demo course import/seed task. Do not redesign the platform, do not add new primary routes, and do not add new Phase 2/3 modules.

Read first:
- docs/specs/phase-1-cso-learning-hub/R22A_R23_Foundation_Enhancement_Spec.md
- docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md
- docs/specs/phase-1-cso-learning-hub/DATA_MODEL.md
- docs/specs/phase-1-cso-learning-hub/BUILD_STUDIO_SPEC.md
- docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md
- docs/specs/phase-1-cso-learning-hub/ACCEPTANCE_TESTS.md
- docs/specs/phase-1-cso-learning-hub/EVIDENCE_PACK_TEMPLATE.md

Implementation rules:
1. Use the CSVs as the source of truth.
2. Use stable IDs exactly as provided.
3. Do not invent replacement values.
4. Do not silently use fallback values if CSVs are unreadable; stop and report the path problem.
5. Upsert records safely where appropriate.
6. Do not hard-delete existing used records.
7. Use existing platform models and actions where possible.
8. If an import script is needed, keep it focused and reusable.
9. If the current schema cannot store a field directly, store the enhancement in the approved JSON metadata locations:
   - Course.analysisMetadataJson
   - LearningOutcome.alignmentMetadataJson
   - Lesson.alignmentMetadataJson
   - ContentBlock.configJson.alignment
10. Preserve the Build Studio three-column layout.
11. Build Studio should show only small alignment chips/badges, not large metadata or compliance panels.
12. Learner-facing views must not show internal metadata, developer language, or creator/admin controls.

Import order:
1. Read 00_import_manifest.csv.
2. Import/update Course Setup from 01_course_setup_enhanced.csv.
3. Import/update Metadata from 02_course_metadata_enhanced.csv.
4. Import/update Learning Outcomes from 03_learning_outcomes_enhanced.csv.
5. Import/update Modules and Lessons from 04_modules_lessons_enhanced.csv.
6. Import/update Build Studio blocks from 05_build_studio_blocks_enhanced.csv.
7. Import/update Final Test from 06_final_test_enhanced.csv.
8. Verify asset paths from 07_asset_manifest_enhanced.csv.
9. Verify catalogue/detail/preview display using 08_catalog_preview_data.csv.
10. Run QA checks using 09_course_preview_qa.csv.

Course setup requirements:
- title, slug, short description, long description, target audience, language, level, duration, access/visibility, certificate eligibility, final test requirement, pass threshold, cover image, and notes must save/reload.
- Pass threshold must be 80.
- Course may be created as DRAFT first. Publish only through the approved workflow or through an explicit demo seed path if the repo already supports seeded published demo courses.

Metadata requirements:
- Primary capacity area: CAP-ADV.
- CSO practice: PRAC-ADV-SAFE-MSG.
- HRBA must be stored as StandardFamily STD-HRBA, not as CapacityArea.
- Include standard families, indicators, capacity gap, current practice, desired practice, K/S/M/E, course-fit decision, safeguards, accessibility, and follow-up support.
- Cascading filters must work where the UI supports them:
  - Capacity Area filters CSO Practice.
  - Capacity Area + CSO Practice + Standard Family filters Indicator.

Outcome requirements:
- Create 5 learning outcomes from 03_learning_outcomes_enhanced.csv.
- Store enhanced alignment fields: capacity area, CSO practice, local outcome, observable action, standard family, indicator, measurement level, assessment method, evidence type, and success criterion.
- Learner-facing views should display only clean outcome statements unless internal detail is explicitly intended.

Module/lesson requirements:
- Create 3 modules and 6 lessons from 04_modules_lessons_enhanced.csv.
- Preserve order, duration, required status, linked outcomes, learning functions, expected outputs, capacity/practice/indicator alignment.

Build Studio block requirements:
- Create all 23 blocks from 05_build_studio_blocks_enhanced.csv.
- Preserve module, lesson, block order, block type, title, learner-facing content, configJson, outcome linkage, learning function, indicator, expected learner action, assets, feedback, and accessibility notes.
- Import the enhanced branching scenario exactly from the CSV configJson.
- Lesson knowledge checks remain low-stakes.
- Do not convert lesson knowledge checks into final test items.

Final test requirements:
- Create final test from 06_final_test_enhanced.csv.
- Title: Final Test: HRBA Advocacy in Practice.
- Pass threshold: 80.
- Retake allowed and max attempts 3 if supported.
- Create 8 scored questions.
- Use multiple choice and true/false only.
- Preserve correct answers, explanations, linked outcomes, indicators, and points.

Asset requirements:
- Verify required asset paths from 07_asset_manifest_enhanced.csv.
- Required paths include:
  - public/assets/demo/hrba-advocacy/images/hrba-advocacy-course-thumbnail.jpg
  - public/assets/demo/hrba-advocacy/images/community-consultation.jpg
  - public/assets/demo/hrba-advocacy/images/stakeholder-mapping-workshop.jpg
  - public/assets/demo/hrba-advocacy/resources/HRBA-Advocacy-Planning-Checklist.pdf
  - public/assets/demo/hrba-advocacy/resources/Stakeholder-And-Duty-Bearer-Mapping-Template.pdf
- Optional assets must not block import if missing.
- Temporary video URL may remain only if transcript fallback is visible; note this as a known gap.

Preview/catalogue requirements:
- Use 08_catalog_preview_data.csv to verify:
  - catalogue card;
  - public course detail page;
  - creator preview;
  - learner course preview/player;
  - certificate information;
  - module outline;
  - accessibility/resource note.
- Public catalogue display requires the course to be PUBLISHED and visible according to platform rules.

Scope restrictions:
Do not add:
- full diagnosis workflow;
- capacity map;
- action map;
- CRM;
- donor tooling;
- grants pipeline;
- practical proof verification;
- badge workflow;
- collaboration/co-creation module;
- advanced monitoring dashboard;
- heavy compliance panels.

Verification:
Run:
- npm run prisma:validate
- npm run typecheck
- npm run lint
- npm run build

Add or update a focused verification script if useful, for example:
- npm run verify:hrba-course-import
- npm run verify:course-alignment

Manual checks:
- /creator/courses/[courseId]/setup
- /creator/courses/[courseId]/metadata
- /creator/courses/[courseId]/outcomes
- /creator/courses/[courseId]/build
- /creator/courses/[courseId]/quiz
- /creator/courses/[courseId]/preview
- /creator/courses/[courseId]/submit
- /courses
- /courses/[courseSlug]
- /learn/courses/[courseSlug]
- /learn/courses/[courseSlug]/final-test
- participant blocked from creator routes
- desktop visual QA
- mobile/narrow viewport visual QA

Return a full evidence pack using EVIDENCE_PACK_TEMPLATE.md.

The evidence pack must include:
- plan followed;
- CSVs read;
- files changed;
- routes/screens affected;
- schema or seed changes;
- whether JSON metadata was used;
- records imported/updated;
- asset availability check;
- preview/catalogue checks;
- readiness checks;
- tests run and results;
- screenshots or visual QA notes;
- known gaps;
- next smallest safe step.
```

---

## Recommended repo placement

Place this full CSV package in:

```txt
docs/specs/phase-1-cso-learning-hub/demo-courses/hrba-advocacy/
```

Keep the reference data CSVs in:

```txt
docs/specs/phase-1-cso-learning-hub/reference-data/
```

Required final folder structure:

```txt
docs/specs/phase-1-cso-learning-hub/
  reference-data/
    CapacityArea.csv
    CSOPractice.csv
    StandardFamily.csv
    Indicator.csv
    _Lists.csv

  demo-courses/
    hrba-advocacy/
      00_import_manifest.csv
      01_course_setup_enhanced.csv
      02_course_metadata_enhanced.csv
      03_learning_outcomes_enhanced.csv
      04_modules_lessons_enhanced.csv
      05_build_studio_blocks_enhanced.csv
      06_final_test_enhanced.csv
      07_asset_manifest_enhanced.csv
      08_catalog_preview_data.csv
      09_course_preview_qa.csv
      10_codex_import_prompt.md
```
