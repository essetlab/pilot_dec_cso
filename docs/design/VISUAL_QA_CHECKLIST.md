# VISUAL_QA_CHECKLIST.md

# DEC / WHH CSF+ CSO Learning Hub — Visual QA Checklist

## 1. Document purpose

This file defines the visual quality assurance checklist for all user-facing UI work in the DEC / WHH CSF+ CSO Learning Hub.

Codex and any developer must use this checklist after every UI-facing slice.

A UI slice is not complete only because it passes lint, typecheck, and build. It must also pass visual quality, usability, accessibility, responsiveness, and scope-control checks.

---

## 2. When to use this checklist

Use this checklist for any slice that changes:

1. public pages;
2. sign-in or registration;
3. learner/participant pages;
4. course catalogue;
5. course detail;
6. course player;
7. certificates;
8. Course Creator portal;
9. Build Studio;
10. Admin portal;
11. Monitoring dashboard;
12. forms, tables, cards, navigation, shells, or shared UI components.

For backend-only slices with no user-facing UI changes, this checklist can be marked “not applicable,” but the evidence pack must say so.

---

## 3. Visual QA decision rule

Each changed screen must be classified as one of:

```txt
PASS — visually acceptable and demo-ready for this slice.
PARTIAL — acceptable for this slice but has documented visual gaps.
FAIL — not acceptable; must be fixed before slice approval.
NOT APPLICABLE — no user-facing UI changed.
```

A major UI slice should not be accepted if any core stakeholder-facing screen is marked `FAIL`.

---

# 4. Required evidence

For every UI-facing slice, Codex must provide:

1. routes/screens changed;
2. desktop visual check notes;
3. mobile/narrow viewport check notes;
4. accessibility check notes;
5. screenshots or visual evidence if available;
6. confirmation of no developer language;
7. confirmation of no Phase 2/3 active modules;
8. confirmation of no CRM/donor-management elements;
9. known visual gaps;
10. next visual improvement step.

If screenshot tooling is not available, Codex must explicitly say so and provide manual verification notes.

---

# 5. Universal visual quality checklist

Apply this checklist to every user-facing screen.

## 5.1 Page identity

```txt
[ ] Page has a clear title.
[ ] Page has a concise subtitle or purpose statement.
[ ] Page purpose is immediately understandable.
[ ] Page does not expose internal route/slice/scaffold language.
[ ] Page title and copy use user-facing language.
```

## 5.2 Layout and spacing

```txt
[ ] Layout is visually balanced.
[ ] Page has sufficient whitespace.
[ ] Sections are clearly separated.
[ ] Cards/forms/tables align cleanly.
[ ] Page does not feel crowded.
[ ] Page does not feel empty or unfinished unless intentionally empty.
[ ] Desktop spacing is consistent.
[ ] Mobile spacing is consistent.
```

## 5.3 Typography

```txt
[ ] Text hierarchy is clear.
[ ] Page title is visually prominent.
[ ] Section titles are readable.
[ ] Body text is not too small.
[ ] Meta text remains legible.
[ ] Line height supports readability.
[ ] No excessive all-caps text.
[ ] Long text is broken into readable sections.
```

## 5.4 Color and contrast

```txt
[ ] Primary color is used consistently.
[ ] Accent color is used sparingly and meaningfully.
[ ] Status colors are consistent.
[ ] Text contrast is sufficient.
[ ] Badges are readable.
[ ] Error/warning/success states are visually distinct.
[ ] Information is not communicated by color alone.
```

## 5.5 Cards and surfaces

```txt
[ ] Cards have consistent radius, border, and shadow.
[ ] Cards are not overloaded with text.
[ ] Cards have clear title and purpose.
[ ] Card grids align cleanly.
[ ] Empty cards are not used as filler.
```

## 5.6 Buttons and actions

```txt
[ ] Primary action is clear.
[ ] There is not more than one competing primary action in the same area.
[ ] Button labels are specific and action-oriented.
[ ] Destructive actions are visually distinguished.
[ ] Buttons are tappable on mobile.
[ ] Disabled buttons have clear reason where needed.
```

## 5.7 Forms

```txt
[ ] Inputs have visible labels.
[ ] Required fields are clear.
[ ] Helper text is concise.
[ ] Validation messages are human-readable.
[ ] Forms are grouped logically.
[ ] Long forms are divided into sections.
[ ] Save/cancel actions are clear.
[ ] Mobile form layout stacks cleanly.
```

## 5.8 Tables and lists

```txt
[ ] Table columns are necessary and not excessive.
[ ] Table headings are clear.
[ ] Row actions are easy to identify.
[ ] Status badges are readable.
[ ] Filters/search are positioned clearly.
[ ] Empty state is present when list has no records.
[ ] Mobile behavior is usable.
```

## 5.9 Empty states

```txt
[ ] Empty state looks intentional.
[ ] Empty state has a short headline.
[ ] Empty state has a useful explanation.
[ ] Empty state has a relevant action if appropriate.
[ ] Empty state avoids developer language.
[ ] Empty state does not feel broken.
```

## 5.10 Navigation

```txt
[ ] Navigation matches the user role.
[ ] Public users do not see admin/creator links.
[ ] Participants do not see admin/creator controls.
[ ] Creator navigation is focused on course creation.
[ ] Admin navigation is focused on platform operations.
[ ] Active navigation state is visible.
[ ] Navigation works on mobile.
[ ] Phase 2/3 modules are not active navigation items.
```

---

# 6. Developer-language ban checklist

The following must not appear in user-facing UI:

```txt
[ ] Slice
[ ] Scaffold
[ ] Placeholder
[ ] Mock data
[ ] Fake data
[ ] TODO
[ ] Implementation pending
[ ] Route shell
[ ] Demo only
[ ] DB
[ ] Prisma
[ ] Migration
[ ] CRUD
[ ] Backend
[ ] Frontend
[ ] Lorem ipsum
[ ] Test page
[ ] Temporary page
[ ] WIP
```

If any of these appear, the screen fails visual QA unless the page is an internal developer-only page not linked from normal navigation.

---

# 7. Scope-control visual checklist

Every UI-facing slice must confirm:

```txt
[ ] No active Phase 2/3 modules were added.
[ ] No CRM/donor-management UI was added.
[ ] No full diagnosis workflow was added.
[ ] No full capacity map/action map workflow was added.
[ ] No practical proof or badge verification UI was added.
[ ] No collaboration/co-creation workspace UI was added.
[ ] No donor compliance dashboard was added.
[ ] No internal governance panels were added to Build Studio.
```

---

# 8. Accessibility visual checklist

## 8.1 General accessibility

```txt
[ ] Semantic headings are used.
[ ] Focus states are visible.
[ ] Keyboard navigation works for key controls.
[ ] Links and buttons are distinguishable.
[ ] Forms have labels.
[ ] Error messages are associated with fields where possible.
[ ] Color contrast is acceptable.
[ ] Content is not color-only.
```

## 8.2 Media accessibility

```txt
[ ] Image blocks support alt text.
[ ] Video blocks support transcript fields.
[ ] Audio blocks support transcript fields if implemented.
[ ] Resource downloads have clear labels.
```

## 8.3 Interactive block accessibility

```txt
[ ] Accordions are keyboard accessible.
[ ] Flashcards have accessible reveal behavior.
[ ] Knowledge checks are keyboard usable.
[ ] Branching scenario choices are accessible buttons/radios.
[ ] Feedback messages are readable and clear.
```

---

# 9. Mobile responsiveness checklist

Check each changed screen at a narrow viewport.

```txt
[ ] No horizontal overflow.
[ ] Cards stack cleanly.
[ ] Text remains readable.
[ ] Buttons remain tappable.
[ ] Navigation remains usable.
[ ] Tables adapt or scroll safely.
[ ] Forms stack cleanly.
[ ] Sidebars collapse or adapt.
[ ] Build Studio keeps canvas primary.
[ ] Learner course outline collapses or fits cleanly.
[ ] Course content remains readable.
```

---

# 10. Public site checklist

Use for:

```txt
/
/courses
/courses/[courseSlug]
```

## 10.1 Home page

```txt
[ ] Hero section feels premium and credible.
[ ] Platform purpose is immediately clear.
[ ] Primary CTA is clear.
[ ] Secondary CTA is clear.
[ ] Capacity-development positioning is visible.
[ ] Page does not look like a generic SaaS template.
[ ] Public users do not see internal/admin controls.
[ ] Partner/footer area is clean if included.
```

## 10.2 Course catalogue

```txt
[ ] Course cards are visually polished.
[ ] Search/filter area is clean.
[ ] Only published courses are shown.
[ ] Course metadata is useful and readable.
[ ] Empty state is polished.
[ ] Page works on mobile.
```

## 10.3 Course detail

```txt
[ ] Course hero/header is strong.
[ ] Learning outcomes are visible.
[ ] Course information card is clear.
[ ] Module outline is easy to scan.
[ ] Certificate information is clear.
[ ] Start/enroll action is prominent.
[ ] Internal status is not exposed.
```

---

# 11. Learner UI checklist

Use for:

```txt
/learn
/learn/my-courses
/learn/courses/[courseSlug]
/learn/courses/[courseSlug]/final-test
/learn/certificates
/learn/certificates/[certificateId]
```

## 11.1 Learner dashboard

```txt
[ ] Dashboard feels warm and learner-focused.
[ ] Continue learning is prominent.
[ ] Active courses are easy to find.
[ ] Progress is clear but not overwhelming.
[ ] Certificates are visible.
[ ] Empty state is supportive.
[ ] No admin language appears.
```

## 11.2 Course player

```txt
[ ] Course header is compact and useful.
[ ] Progress indicator is clear.
[ ] Module/lesson navigation is usable.
[ ] Lesson content area is readable.
[ ] Blocks render as designed learning content.
[ ] Previous/next controls are clear.
[ ] Final test entry is clear when eligible.
[ ] No creator/admin controls appear.
[ ] Mobile layout works well.
```

## 11.3 Final test

```txt
[ ] Instructions are clear.
[ ] Questions are easy to read.
[ ] Answer controls are accessible.
[ ] Submit action is clear.
[ ] Result state is understandable.
[ ] Pass/fail message is supportive.
[ ] Certificate next step is clear when passed.
```

## 11.4 Certificate pages

```txt
[ ] Certificate card/detail feels like an achievement.
[ ] Course title and participant name are clear.
[ ] Certificate code is visible.
[ ] Download action is clear.
[ ] Locked certificate state is understandable.
```

---

# 12. Course Creator UI checklist

Use for:

```txt
/creator
/creator/courses
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

## 12.1 Creator dashboard

```txt
[ ] My Courses is clear.
[ ] Create course action is prominent.
[ ] Course status is readable.
[ ] Filters/search are clean.
[ ] Empty state is polished.
[ ] Page does not feel like an admin database.
```

## 12.2 Course setup forms

```txt
[ ] Form fields are grouped.
[ ] Course context is compact.
[ ] Save action is clear.
[ ] Helper text is concise.
[ ] No heavy diagnosis/capacity map workflow appears.
[ ] Page is not crowded.
```

## 12.3 Build Studio

```txt
[ ] Three-column layout is preserved.
[ ] Left panel contains Block Library and Course Outline.
[ ] Center canvas is the visual focus.
[ ] Right panel only configures selected block.
[ ] Header is compact.
[ ] Block cards are polished.
[ ] Empty lesson state is useful.
[ ] Readiness warnings are lightweight.
[ ] Preview action is visible.
[ ] No diagnosis panels appear.
[ ] No capacity map/action map panels appear.
[ ] No monitoring charts appear.
[ ] No CRM/donor compliance sections appear.
[ ] No heavy governance cards appear.
[ ] Mobile/narrow behavior is usable or documented.
```

## 12.4 Creator preview

```txt
[ ] Preview uses learner-facing template.
[ ] Preview label is small and clear.
[ ] No block configuration controls appear in preview.
[ ] Desktop/mobile preview behavior is checked.
```

---

# 13. Admin UI checklist

Use for:

```txt
/admin
/admin/users
/admin/organizations
/admin/cohorts
/admin/courses
/admin/review
/admin/certificates
/admin/reference-data
/admin/audit-log
/admin/settings
```

## 13.1 Admin dashboard

```txt
[ ] KPI cards are clear and not excessive.
[ ] Recent activity is readable.
[ ] Quick actions are useful.
[ ] Courses needing attention are visible if relevant.
[ ] No donor CRM metrics appear.
[ ] No full diagnosis/capacity analytics appear.
[ ] No Phase 2/3 dashboards appear.
```

## 13.2 Admin list pages

```txt
[ ] Page header is clear.
[ ] Search/filter controls are clean.
[ ] Table/card list is readable.
[ ] Empty state is polished.
[ ] Primary action is visible.
[ ] Row actions are clear.
[ ] Mobile behavior is acceptable.
```

## 13.3 Admin detail pages

```txt
[ ] Detail layout is structured.
[ ] Key information is easy to scan.
[ ] Related records are grouped.
[ ] Actions are clear and permission-appropriate.
[ ] Page does not become CRM-like.
```

---

# 14. Monitoring UI checklist

Use for:

```txt
/admin/monitoring
```

## 14.1 Monitoring dashboard

```txt
[ ] Page explains operational monitoring purpose.
[ ] Filter bar is clear.
[ ] KPI cards are useful.
[ ] Attention signals are concise.
[ ] Course progress table is readable.
[ ] Cohort progress table is readable.
[ ] Organization participation table is readable.
[ ] Assessment/certificate summaries are clear.
[ ] Feedback summary is clear.
[ ] Charts are not excessive.
[ ] No long-term impact claims are made.
[ ] Participant-level personal data is not overexposed.
```

---

# 15. Screenshot requirements

For major UI slices, Codex should capture or provide evidence for:

```txt
Desktop:
- 1440px or similar width

Mobile:
- 390px or similar width

Core routes:
- relevant route list for the slice
```

If screenshots are not technically available, Codex must say:

```txt
Screenshots were not captured because [reason]. Manual route checks were performed for [routes].
```

---

# 16. Evidence pack insertion

For UI-facing slices, Codex must add this section to the evidence pack:

```txt
## Premium UI / Visual QA

Routes/screens visually checked:
- ...

Desktop visual check:
- [PASS/PARTIAL/FAIL] Notes...

Mobile visual check:
- [PASS/PARTIAL/FAIL] Notes...

Accessibility visual check:
- [PASS/PARTIAL/FAIL] Notes...

Developer-language check:
- [PASS/PARTIAL/FAIL] Notes...

Scope-control visual check:
- [PASS/PARTIAL/FAIL] Notes...

Screenshots or visual evidence:
- ...

Known visual gaps:
- ...

Final visual QA status:
- PASS / PARTIAL / FAIL / NOT APPLICABLE
```

---

# 17. Human reviewer quick decision guide

A human reviewer should ask:

1. Would I be comfortable showing this screen to DEC/WHH stakeholders?
2. Does the screen look like a real product or a developer prototype?
3. Is the page clear within five seconds?
4. Is there any developer/internal wording?
5. Does the screen follow the design system?
6. Is the screen role-appropriate?
7. Is the screen too crowded?
8. Is it mobile usable?
9. Does it avoid Phase 2/3 drift?
10. Does it avoid CRM/donor-management drift?

If the answer to question 1 or 2 is “no,” the UI slice should not be approved.

---

# 18. Final visual QA statement

Visual quality is a core acceptance requirement for the CSO Learning Hub.

A screen that works technically but looks weak, generic, crowded, or developer-made is not complete.

Every user-facing UI slice must be visually reviewed before approval.
