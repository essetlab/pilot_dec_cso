# P2B.1 Future-Proof Catalogue Copy Report

## Scope

P2B.1 updates only public and learner-facing catalogue copy so future course additions do not require manually changing a fixed catalogue count. The verified baseline was `7823fc60e709e53687a6b7d07add950168f84449` on `feature/hub-phase1-foundation-polish`.

## Copy audit and changes

The public catalogue and reusable course overview were searched for fixed-count and audience wording, including `nine courses`, `nine capacity areas`, `all nine`, `our nine`, `explore nine`, `nine-course catalogue`, and `stronger CSOs`.

The following learner-facing changes were made:

- `Courses for stronger CSO practice` became `Practical courses for CSOs`.
- The fixed-count catalogue introduction became `Browse available and upcoming courses across key CSO capacity areas.`
- Hard-coded `1 available`, `8 coming soon`, and `9 course overviews` badges became count-free state labels.
- `Course {displayOrder} of 9` became `Course overview` on catalogue cards and the reusable overview page.
- `Nine areas for practical learning` became `Courses across key CSO capacity areas`.
- The empty-state reference to the `full nine-course catalogue` became `full course catalogue`.

The filtered-result count remains data-derived from `courses.length`; it changes automatically when the catalogue or active filters change and is not a fixed catalogue promise.

## Files changed

- `src/components/public/CataloguePage.tsx`
- `src/components/public/CourseDetailPage.tsx`
- `docs/pilot-release/p2b1-future-proof-catalogue-copy-report.md`

## Validation

- `npm run build` — passed.
- `npm run lint` — passed.
- `npx prisma validate` — passed.
- `npm run prisma:validate` — passed.
- `git diff --check` — passed.
- Targeted source scan — no learner-facing fixed catalogue-count or `stronger CSOs` wording remains.
- Desktop QA at 1440 × 1000 — catalogue and HRBA overview rendered the new copy with no horizontal overflow.
- Mobile QA at 390 × 844 — catalogue and HRBA overview rendered the new copy with no horizontal overflow.
- Browser console — no warnings or errors.

The build emitted the existing fallback-course-data warning because the QA environment does not provide the production database connection. It did not cause a build or security failure.

## Scope confirmation

No course title, catalogue order, capacity mapping, availability state, route, HRBA launch behavior, authentication, Supabase, certificate, or course integration was changed. Existing implementation-count evidence reports were intentionally left unchanged. Future catalogue additions require no learner-facing fixed-count copy update.

No deployment was performed.
