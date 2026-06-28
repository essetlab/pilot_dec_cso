# README.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Codex Handoff Package

## 1. Purpose

This folder contains the implementation-ready specification package for building **Phase 1** of the DEC / WHH CSF+ CSO Learning Hub.

Phase 1 shall be implemented as:

> **An e-learning MVP with a future-ready CSO Learning Hub foundation.**

This means the application must deliver a working digital learning platform now, while preserving the architecture needed for later knowledge management, collaboration, co-creation, diagnosis, capacity mapping, practical proof, and advanced monitoring.

---

## 2. Core implementation position

Codex and developers must follow this position:

1. Build a working, polished, accessible e-learning platform.
2. Include a strong, clean, three-column block-based Course Builder / Build Studio.
3. Render published courses into a high-quality participant-facing learner template.
4. Include quizzes, final tests, certificates, feedback, admin operations, and monitoring.
5. Architect for the wider CSO Learning Hub.
6. Do not overbuild Phase 2 or Phase 3.
7. Do not turn the platform into a CRM, donor management system, or governance-heavy workflow platform.
8. Do not crowd the Build Studio with diagnosis, capacity map, monitoring, CRM, or compliance panels.

---

## 3. Files in this package

| File | Purpose |
|---|---|
| `PRODUCT_SPEC.md` | Master product definition, scope, principles, users, modules, and product rules. |
| `ROUTE_MAP.md` | Deterministic route/page structure, protected route logic, navigation, empty states, and route boundaries. |
| `DATA_MODEL.md` | Entities, enums, relationships, content model, certificate rules, readiness rules, and seed requirements. |
| `BUILD_STUDIO_SPEC.md` | Detailed specification for the clean three-column Course Builder and block library. |
| `LEARNER_TEMPLATE_SPEC.md` | Specification for the participant-facing course template, course player, block rendering, tests, certificates, feedback, mobile, and accessibility. |
| `ADMIN_PORTAL_SPEC.md` | Admin Portal specification for users, organizations, cohorts, courses, review/publish, certificates, reference data, monitoring access, audit log, and permissions. |
| `MONITORING_SPEC.md` | Phase 1 monitoring dashboard metrics, filters, data sources, summaries, attention signals, and data protection rules. |
| `ACCEPTANCE_TESTS.md` | Full QA, demo-readiness, accessibility, mobile, role, certificate, monitoring, and scope-control test checklist. |
| `CODEX_IMPLEMENTATION_PLAN.md` | Slice-by-slice implementation plan, Codex prompt wrappers, gates, stop conditions, and sequencing. |
| `CODEX_IMPLEMENTATION_STATUS.md` | Current implementation checkpoint, including completed, partial, visual-only, and blocked areas. |
| `CODEX_REVISED_IMPLEMENTATION_PLAN.md` | Current repo-based R1-R23 implementation guide. Use with `CODEX_IMPLEMENTATION_STATUS.md` when it conflicts with the original plan. |
| `BUILD_STUDIO_BLOCK_REFERENCE.md` | Controlling Phase 1 Build Studio block reference for the selected 12 block types and excluded future block types. |
| `EVIDENCE_PACK_TEMPLATE.md` | Required evidence pack format after every Codex implementation slice. |
| `SEED_DATA_PLAN.md` | Safe demo data plan for users, organizations, cohorts, courses, blocks, final test, certificates, feedback, and monitoring. |

---

## 4. Recommended repository placement

Place all files in:

```txt
docs/specs/phase-1-cso-learning-hub/
```

Recommended structure:

```txt
docs/specs/phase-1-cso-learning-hub/
  README.md
  PRODUCT_SPEC.md
  ROUTE_MAP.md
  DATA_MODEL.md
  BUILD_STUDIO_SPEC.md
  LEARNER_TEMPLATE_SPEC.md
  ADMIN_PORTAL_SPEC.md
  MONITORING_SPEC.md
  ACCEPTANCE_TESTS.md
  CODEX_IMPLEMENTATION_PLAN.md
  CODEX_IMPLEMENTATION_STATUS.md
  CODEX_REVISED_IMPLEMENTATION_PLAN.md
  BUILD_STUDIO_BLOCK_REFERENCE.md
  EVIDENCE_PACK_TEMPLATE.md
  SEED_DATA_PLAN.md
```

---

## 5. Required Codex workflow

Codex must not start building broadly.

Codex must proceed in this order:

1. Read the handoff package.
2. Read `CODEX_IMPLEMENTATION_STATUS.md`.
3. Read `CODEX_REVISED_IMPLEMENTATION_PLAN.md`.
4. Run Slice 0: repository intake and baseline audit if the current repo state is unknown.
5. Return an evidence pack.
6. Implement one slice at a time from `CODEX_REVISED_IMPLEMENTATION_PLAN.md`.
7. Return evidence pack after every slice.
8. Stop and report when a stop condition appears.
9. Never add Phase 2/3 modules unless explicitly instructed.

---

## 6. First prompt to Codex

Use this as the first prompt after placing the files in the repository:

```txt
Plan first.

Perform Slice 0: Repository intake and baseline audit for the DEC / WHH CSF+ CSO Learning Hub Phase 1 build.

Read the specification package in:
docs/specs/phase-1-cso-learning-hub/

Especially read:
- PRODUCT_SPEC.md
- ROUTE_MAP.md
- DATA_MODEL.md
- BUILD_STUDIO_SPEC.md
- LEARNER_TEMPLATE_SPEC.md
- ADMIN_PORTAL_SPEC.md
- MONITORING_SPEC.md
- ACCEPTANCE_TESTS.md
- CODEX_IMPLEMENTATION_PLAN.md
- CODEX_IMPLEMENTATION_STATUS.md
- CODEX_REVISED_IMPLEMENTATION_PLAN.md
- BUILD_STUDIO_BLOCK_REFERENCE.md
- EVIDENCE_PACK_TEMPLATE.md
- SEED_DATA_PLAN.md

Do not modify files.

Audit the repository for:
- current stack
- package scripts
- route structure
- auth and role logic
- database/ORM schema
- seed data
- UI components
- existing admin/creator/learner pages
- existing tests
- environment assumptions

Return the required evidence pack using EVIDENCE_PACK_TEMPLATE.md.

Do not implement anything yet.
```

---

## 7. Second prompt to Codex

After Codex completes Slice 0 and returns the audit, use this only if the audit shows the repo is ready for documentation placement or the files are not already placed:

```txt
Plan first.

Implement Slice 1: documentation handoff package placement.

Place the approved Phase 1 Codex handoff files into:
docs/specs/phase-1-cso-learning-hub/

Add this README.md as the index file for the folder.

Do not change application logic.

Return the required evidence pack using EVIDENCE_PACK_TEMPLATE.md.
```

---

## 8. Human review checklist before coding

Before allowing Codex to implement Slice 2 or beyond, confirm:

1. All handoff files are in the repo.
2. Codex completed a no-code audit.
3. The current stack and route structure are understood.
4. The authentication/role approach is clear.
5. The database/ORM approach is clear.
6. There is no conflict between existing implementation and the approved Phase 1 spec.
7. The team agrees to implement one slice at a time.
8. Codex understands that Build Studio must stay clean and content-focused.
9. Codex understands that Phase 2/3 modules are out of Phase 1.
10. Evidence pack reporting is mandatory.

---

## 9. Non-negotiable product controls

These rules override any broad or vague prompt:

1. Build Studio is for clean content creation.
2. Governance must not crowd the authoring workspace.
3. Participants only see published courses.
4. Course Creators cannot publish unless they also have Admin authority.
5. Certificate issuance requires completion and final test pass.
6. Default certificate pass threshold is 80% unless explicitly configured otherwise.
7. Monitoring is operational, not an impact-claim dashboard.
8. No CRM/donor management in Phase 1.
9. No full diagnosis/capacity map/action map in Phase 1.
10. No practical proof/badge verification in Phase 1.
11. Every slice must return an evidence pack.

---

## 10. Final statement

This package is intended to prevent product drift and make Codex implementation controlled, fast, and reviewable.

The desired output is a working Phase 1 platform that is immediately useful for DEC/WHH and CSO participants, while preserving the architecture needed for the wider CSO Learning Hub.
