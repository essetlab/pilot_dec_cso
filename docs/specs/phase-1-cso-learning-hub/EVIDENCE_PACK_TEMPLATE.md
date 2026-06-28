# EVIDENCE_PACK_TEMPLATE.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Evidence Pack Template

## 1. Document purpose

This file defines the required evidence pack format for Codex or any AI coding agent implementing Phase 1 of the CSO Learning Hub.

Codex must return an evidence pack after every implementation slice.

The evidence pack is mandatory. It prevents drift, makes changes reviewable, and gives DEC/WHH/project reviewers a clear record of what was changed, what was tested, what remains incomplete, and what should happen next.

---

## 2. Evidence pack rule

After every implementation slice, Codex must report using this structure exactly.

Do not replace the evidence pack with a vague summary.

Do not omit failed checks.

Do not claim completion if acceptance criteria were not verified.

---

# Evidence Pack — [Slice Name]

## 1. Slice identity

**Slice name:**  
`[Insert slice name]`

**Slice number:**  
`[Insert slice number]`

**Date:**  
`[Insert date]`

**Implemented by:**  
`Codex / AI coding agent / developer name if applicable`

---

## 2. Plain-language product summary

Briefly explain what was completed in non-technical language.

Example:

```txt
This slice added the Course Creator Build Studio shell with a left block library, center course canvas, and right block configuration panel. Course creators can now open the build route, view the course outline, select lessons, and see clean empty states.
```

---

## 3. Scope implemented

List exactly what was implemented.

```txt
Implemented:
- [Item 1]
- [Item 2]
- [Item 3]
```

---

## 4. Scope intentionally not implemented

List items that were intentionally left out because they belong to later slices or are out of Phase 1 scope.

```txt
Not implemented in this slice:
- [Item 1]
- [Item 2]
- [Item 3]
```

This section is important to prevent confusion between “not yet built” and “forgotten.”

---

## 5. Files changed

List all files changed.

```txt
Files changed:
- path/to/file1
- path/to/file2
- path/to/file3
```

If many files changed, group them by type:

```txt
Routes:
- ...

Components:
- ...

Data/model:
- ...

Tests:
- ...

Docs:
- ...
```

---

## 6. Routes/screens affected

List all routes or screens affected.

```txt
Routes/screens affected:
- /admin
- /creator/courses/[courseId]/build
- /learn/courses/[courseSlug]
```

If no routes were affected, state:

```txt
No user-facing routes were affected.
```

---

## 7. Data/schema changes

State whether any data model, database, ORM, migration, seed, or enum changes were made.

```txt
Data/schema changes:
- [Model/table added or changed]
- [Enum added or changed]
- [Migration name]
- [Seed changes]
```

If none:

```txt
No data/schema changes.
```

---

## 8. Role and permission changes

State whether any role, permission, route guard, or access-control behavior changed.

```txt
Role/permission changes:
- [Change 1]
- [Change 2]
```

If none:

```txt
No role/permission changes.
```

---

## 9. Workflow/status changes

State whether any course lifecycle, review/publish, enrollment, quiz, certificate, or monitoring workflow changed.

```txt
Workflow/status changes:
- [Change 1]
- [Change 2]
```

If none:

```txt
No workflow/status changes.
```

---

## 10. Acceptance criteria checked

List the acceptance criteria from `ACCEPTANCE_TESTS.md` or relevant spec that were checked.

Use this format:

```txt
Acceptance criteria checked:
- [PASS] Criterion 1
- [PASS] Criterion 2
- [PARTIAL] Criterion 3 — explain what remains
- [FAIL] Criterion 4 — explain failure
- [NOT CHECKED] Criterion 5 — explain why
```

Do not mark acceptance criteria as passed unless they were actually verified.

---

## 11. Tests/checks run

List all commands or checks run.

```txt
Commands/checks run:
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npx prisma migrate dev
- npx prisma db seed
```

For each command, show result:

```txt
Results:
- npm run lint — PASS
- npm run typecheck — PASS
- npm run build — FAIL: [brief reason]
```

If a command was not available:

```txt
Not run:
- npm test — no test script exists in package.json
```

If a command was not run due to time or environment:

```txt
Not run:
- [command] — [reason]
```

---

## 12. Manual verification steps performed

List manual steps actually performed.

```txt
Manual verification:
1. Opened /admin as Admin.
2. Confirmed dashboard loads.
3. Signed in as Participant.
4. Confirmed /admin is blocked.
```

If manual verification was not possible, state why.

---

## 13. Screenshots or visual evidence

If screenshots were captured, list them.

```txt
Screenshots:
- path/to/screenshot1.png
- path/to/screenshot2.png
```

If not captured:

```txt
No screenshots captured.
```

---

## 14. Known gaps

List gaps, unfinished work, or known issues.

```txt
Known gaps:
- [Gap 1]
- [Gap 2]
```

If none:

```txt
No known gaps for this slice.
```

Do not hide known issues.

---

## 15. Risks and decisions

List any important risks or implementation decisions.

```txt
Risks/decisions:
- [Decision 1 and reason]
- [Risk 1 and mitigation]
```

Examples:

```txt
- Used move up/down controls instead of drag-and-drop for Phase 1 to reduce implementation complexity.
- Video upload is represented by URL field for now; file upload can be added later if required.
```

---

## 16. Specification compliance notes

Confirm compliance with controlling specs.

```txt
Specification compliance:
- PRODUCT_SPEC.md — compliant / partial / issue
- ROUTE_MAP.md — compliant / partial / issue
- DATA_MODEL.md — compliant / partial / issue
- BUILD_STUDIO_SPEC.md — compliant / partial / issue
- LEARNER_TEMPLATE_SPEC.md — compliant / partial / issue
- ADMIN_PORTAL_SPEC.md — compliant / partial / issue
- MONITORING_SPEC.md — compliant / partial / issue
- ACCEPTANCE_TESTS.md — compliant / partial / issue
```

Only include files relevant to the slice if preferred, but do not omit a relevant spec.

---

## 17. Scope-control confirmation

Codex must explicitly confirm the following where relevant:

```txt
Scope-control confirmation:
- No Phase 2/3 modules added: Yes/No
- No CRM/donor management added: Yes/No
- Build Studio kept clean and content-focused: Yes/No/Not applicable
- Participants cannot access admin/creator routes: Yes/No/Not checked
- Draft/unpublished courses hidden from participants: Yes/No/Not checked
- Certificate threshold rule preserved: Yes/No/Not applicable
```

If any answer is No or Not checked, explain.

---

## 18. Next smallest safe step

State the next recommended implementation step.

```txt
Next smallest safe step:
[Describe the next slice or focused task]
```

Example:

```txt
Next smallest safe step:
Proceed to Slice 11 — Build Studio core content blocks, starting with Text, Video, Resource, Image, Case Study, and Key Message blocks.
```

---

# 19. Final status

Choose one:

```txt
Final status:
- COMPLETE
- COMPLETE WITH MINOR GAPS
- PARTIAL
- BLOCKED
- FAILED
```

Add one short explanation.

Example:

```txt
Final status:
COMPLETE WITH MINOR GAPS — the route shell and layout are complete, but mobile drawer behavior will be polished in the accessibility/mobile slice.
```

---

# 20. Compact evidence pack option

For very small documentation-only or no-code slices, Codex may use this compact format:

```txt
# Evidence Pack — [Slice Name]

## Summary
[Plain-language summary]

## Files changed
- ...

## Routes/screens affected
- ...

## Data/schema changes
No data/schema changes.

## Role/permission changes
No role/permission changes.

## Checks run
- ...

## Acceptance criteria
- [PASS/PARTIAL/FAIL/NOT CHECKED] ...

## Known gaps
- ...

## Scope-control confirmation
- No Phase 2/3 modules added: Yes
- No CRM/donor management added: Yes

## Next step
...

## Final status
COMPLETE / PARTIAL / BLOCKED
```

Do not use the compact format for major implementation slices.

---

# 21. Evidence pack quality rules

## 21.1 Be specific

Bad:

```txt
Updated several files and everything works.
```

Good:

```txt
Updated src/app/admin/page.tsx, src/components/admin/AdminDashboardCards.tsx, and src/lib/monitoring/getAdminSummary.ts. Verified /admin loads as Platform Admin and is blocked for Participant.
```

## 21.2 Do not overclaim

Bad:

```txt
The full admin portal is complete.
```

Good:

```txt
The admin dashboard shell is complete. User, organization, and cohort management will be implemented in Slice 7.
```

## 21.3 Always report failed checks

Bad:

```txt
Build mostly works.
```

Good:

```txt
npm run build failed because TypeScript reports a missing prop in CourseCard. This is a blocking issue before proceeding.
```

## 21.4 Separate known gaps from scope exclusions

A feature not intended for the current slice is not a gap.

A feature required by the current slice but not complete is a gap.

---

# 22. Reviewer checklist

A human reviewer should check every evidence pack for:

1. Did Codex identify the correct slice?
2. Did Codex list all files changed?
3. Did Codex report schema changes?
4. Did Codex report role/permission changes?
5. Did Codex check relevant acceptance criteria?
6. Did Codex run available checks?
7. Did Codex honestly report failures?
8. Did Codex avoid Phase 2/3 drift?
9. Did Codex preserve Build Studio cleanliness?
10. Did Codex state the next smallest safe step?

---

# 23. Final evidence pack statement

The evidence pack is not optional.

It is the primary mechanism for controlling quality, preventing Codex drift, and keeping Phase 1 implementation traceable to the approved product and technical specifications.
