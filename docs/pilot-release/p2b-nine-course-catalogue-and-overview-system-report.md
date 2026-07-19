# P2B Nine-Course Catalogue and Overview System Report

Date: 19 July 2026

Branch: `feature/hub-phase1-foundation-polish`

Starting baseline: `da048448ee90d83366f388d6f9ea9a6b49c5897d`

## Scope and outcome

P2B establishes one configuration-driven public catalogue containing the nine confirmed courses in their approved order. It also provides one reusable public course-overview template for all nine routes.

Only the existing HRBA course is available and launchable. The other eight courses are public-information pages only. No database course, enrollment, migration, seed, external Project Management integration, authentication change, deployment, or new active capacity-area record was created.

## Verified nine-course list and evidence

The controlling course-title/order/mapping decision was supplied directly for P2B. Every requested ID was verified as active in `docs/specs/phase-1-cso-learning-hub/reference-data/CapacityArea.csv` before implementation.

| Order | Public course title | Primary mapping | Secondary mappings | P2B state |
|---:|---|---|---|---|
| 1 | Applying the Human Rights-Based Approach in CSO Practice | CAP-ADV | CAP-HRSAFE | Available |
| 2 | Governance and Leadership for Local CSOs | CAP-GOV | CAP-ACC, CAP-STRAT | Coming soon |
| 3 | Project Management for Local and Grassroots CSOs | CAP-STRAT | CAP-MEAL, CAP-FIN, CAP-PART | Coming soon; integration pending |
| 4 | From Reporting to Learning: Monitoring, Evaluation, Accountability, and Learning for Local CSOs | CAP-MEAL | CAP-ACC, CAP-STRAT | Coming soon |
| 5 | Financial Management and Compliance for Local and Grassroots CSOs | CAP-FIN | CAP-ACC, CAP-STRAT | Coming soon |
| 6 | Strategic Planning and Organizational Sustainability for Local CSOs | CAP-STRAT | CAP-GOV, CAP-FIN, CAP-MEAL | Coming soon |
| 7 | People, Inclusion, and Safeguarding in CSO Practice | CAP-HRSAFE | CAP-ADV, CAP-ACC, CAP-GOV | Coming soon |
| 8 | Responsible Digital Skills and Data Use for Local CSOs | CAP-DIG | CAP-MEAL, CAP-ACC, CAP-HRSAFE, CAP-GOV | Coming soon |
| 9 | Partnerships, Networks, and Collective Action for Local CSOs | CAP-PART | CAP-ADV, CAP-STRAT, CAP-GOV | Coming soon |

The active controlled taxonomy remains:

- CAP-GOV — Internal Governance and Leadership
- CAP-ACC — Transparency and Accountability
- CAP-STRAT — Strategic Planning and Organizational Sustainability
- CAP-FIN — Financial Management and Resource Mobilization
- CAP-HRSAFE — Human Resources, Inclusion, and Safeguarding
- CAP-ADV — Evidence-Based Advocacy and Civic Engagement
- CAP-MEAL — Monitoring, Evaluation, Accountability, and Learning
- CAP-DIG — Digital Skills and Data Use
- CAP-PART — Networking, Partnerships, and Collective Action

## Naming decisions resolved

- `Project Management for Local and Grassroots CSOs` is the canonical public title.
- `Project Cycle Management` is a search alias only and is not an active CapacityArea value.
- `Applying the Human Rights-Based Approach in CSO Practice` is the canonical active HRBA title.
- The public HRBA definition binds to the existing published HRBA data when available and accepts the existing registered and legacy fallback slugs. No duplicate HRBA record is created.
- `Human Rights-Based Approach`, `Organizational Development`, `Compliance`, and other legacy terms are search aliases only.
- The original 11-area values in `DATA_MODEL.md` and `SEED_DATA_PLAN.md` remain legacy documentation and were not added to runtime taxonomy or the database.
- `demo-data.ts` remains partial fallback learning data and is not the nine-course catalogue source of truth.

## Catalogue source of truth

`src/lib/public-course-catalogue.ts` is the centralized public catalogue source of truth. It contains the ordered course definitions, controlled capacity mapping references, public overview copy, state, presentation metadata, legacy search aliases, and external-course readiness contract.

`src/lib/course-data.ts` remains the public data access boundary. It now:

1. queries published public database courses;
2. selects only the existing HRBA record for the available catalogue entry;
3. uses the existing HRBA fallback only when the local database is unavailable;
4. merges that HRBA data into the centralized definition;
5. returns the eight coming-soon definitions without creating database records; and
6. applies search, primary/secondary capacity, availability, and certificate filters to the centralized catalogue.

Landing-page, catalogue-card, and overview copy are therefore supplied by the same public catalogue result rather than duplicated component metadata.

## Course metadata schema

The centralized definition supports:

- stable configuration slug and display order;
- canonical public title and legacy search aliases;
- short and full description;
- primary and multiple secondary controlled capacity-area IDs;
- intended learners;
- learning outcomes;
- estimated duration, delivery format, and language;
- modules or proposed-structure summary;
- learning approach and practical outputs;
- image and color tone;
- availability and integration status;
- assessment, certificate, resources, and support status;
- launch mode and public overview route;
- featured state; and
- external-course integration metadata.

Raw database course/user/enrollment IDs are not exposed by the public catalogue types or rendered in the page.

## Active and coming-soon behavior

### HRBA — Available

- Existing record/title/slug data is used when the database is configured.
- Local fallback retains the existing fallback HRBA slug because `DATABASE_URL` is absent.
- Signed-out Start learning actions route to `/sign-in` with the existing HRBA external learner path in `next`.
- Signed-in logic reads learner state without initializing an enrollment from the public overview.
- An enrolled learner with progress receives Continue learning; a learner without progress receives Start learning; unresolved authenticated metadata routes to My Courses.
- Existing embedded launch, progress, final assessment, and certificate logic was not modified.

### Courses 2–9 — Coming soon

- Public overview routes are available.
- Catalogue cards use View course structure.
- Overview pages show a non-interactive Coming soon status and explain that access is being prepared.
- There is no Start learning, Continue learning, enrollment, or learner launch link.
- The learner catch-all rejects configured coming-soon slugs before authentication, permission, database enrollment, player, external launch, final-test, or feedback logic can run.

Project Management additionally has `integration_pending` metadata and an external-link launch-mode placeholder, but has no external URL, approved origin, version, completion rule, progress tracking, assessment, certificate eligibility, launch, or enrollment action.

## Reusable course overview structure

One `CourseDetailPage` template renders all nine courses with:

1. course title and status;
2. short description;
3. primary and secondary capacity alignment;
4. intended learners;
5. duration, delivery format, and language;
6. what learners will be able to do;
7. approved learning outcomes or an explicit not-yet-approved state;
8. modules/topics or an explicit proposed-structure state;
9. learning approach and expected activities;
10. practical outputs where defined;
11. assessment and certificate status;
12. resources and support; and
13. a primary action derived from course availability and learner state.

Coming-soon pages do not promise modules, outcomes, activities, practical outputs, assessment, or certificates that have not been approved.

## External-course integration metadata contract

The minimum configuration contract prepared for later no-code management includes:

- course slug and public metadata;
- launch mode: embedded, external link, Hub-tracked, or unconfigured;
- external URL;
- approved origins;
- integration and availability status;
- progress-tracking capability;
- assessment capability;
- certificate eligibility;
- course version; and
- completion rule.

HRBA remains the current embedded, Hub-tracked reference. Project Management has an external-link placeholder with `integration_pending`, but every connection field remains empty or unconfirmed until the later integration task.

## Browser QA evidence

QA used the local optimized production build with fallback data because this worktree has no `DATABASE_URL`.

| Check | Result |
|---|---|
| Desktop 1440 × 1000 | Nine cards rendered in approved order; document width matched the viewport content width; no horizontal overflow. |
| Tablet 768 × 1024 | Nine cards and all filters rendered; no horizontal overflow. |
| Mobile 390 × 844 | Nine cards rendered; filter controls remained within the 375px content width after correction; no horizontal overflow. |
| Mobile overview | The longest course title and reusable overview rendered without horizontal overflow. |
| Mobile navigation | Home, Courses, Verify Certificate, Sign In, and Register were present; the menu opened successfully. |
| Overview routes | 9 of 9 routes loaded with the correct title and status. |
| HRBA action | Signed-out Start learning routed to sign-in with `next=/learn/courses/human-rights-based-approach-practice/external` using fallback data. |
| Coming-soon actions | All eight overviews contained zero learner/sign-in launch links. |
| Direct launch blocks | Base and `/external` learner routes were tested for Courses 2–9: 16 of 16 returned the not-found response without a sign-in form or learner shell. |
| Status labels | Exactly one Available now and eight Coming soon cards appeared. |
| Capacity filters | CAP-ACC matched all five courses where it is primary or secondary metadata. |
| Legacy alias search | Searching `Project Cycle Management` returned only the Project Management course. |
| Keyboard focus | Keyboard focus on the search control had a solid visible outline and DEC-blue focus shadow. |
| Images and links | All nine cards rendered a course-cover visual and all nine overview links resolved. |
| Hidden systems | No creator, Build Studio, reviewer, publisher, advanced-admin, or community link appeared. The word “Monitoring” appears only inside the approved MEAL course/taxonomy title. |
| Browser console | No warnings or errors were recorded in the final production-mode review. |

Desktop and mobile screenshots were captured during the in-app browser QA session as `cso-p2b-catalogue-desktop.png` and `cso-p2b-catalogue-mobile.png` in the system temporary directory. They were not committed because temporary QA artifacts are excluded by repository policy.

## Checks requiring a configured preview or production environment

The following could not be fully exercised locally without `DATABASE_URL` and an authenticated learner session:

- database binding to the production HRBA record and registered production slug;
- authenticated Start learning versus Continue learning state;
- actual HRBA iframe launch;
- live progress callback, final assessment, and certificate behavior.

Those paths were not changed. Source review confirms they remain delegated to the existing HRBA workflow. The local signed-out action and fallback overview were verified.

## Automated validation

| Command | Result |
|---|---|
| `npm run build` | Passed; production compilation, TypeScript, and page generation completed. The existing fallback-course-data warning appeared because the local database is unavailable. |
| `npm run lint` | Passed. |
| `npx prisma validate` | Passed. |
| `npm run prisma:validate` | Passed. |
| `git diff --check` | Passed. |

The build-generated `next-env.d.ts` change was restored and is not part of P2B.

## Files changed

- `src/lib/public-course-catalogue.ts`
- `src/lib/course-types.ts`
- `src/lib/course-data.ts`
- `src/components/public/CataloguePage.tsx`
- `src/components/public/CourseDetailPage.tsx`
- `src/components/public/LandingPage.tsx`
- `src/app/(public)/courses/[[...segments]]/page.tsx`
- `src/app/(learn)/learn/[[...segments]]/page.tsx`
- `docs/pilot-release/p2b-nine-course-catalogue-and-overview-system-report.md`

## Known limitations and backlog

- Local public course reads use the existing fallback HRBA data and emit the established fallback warning because `DATABASE_URL` is unavailable.
- The active HRBA production binding and authenticated learner-state actions require configured preview/production verification.
- Detailed course design for Courses 2–9 remains intentionally unapproved; their overview sections use explicit pending states.
- Previously recorded dependency vulnerabilities remain technical backlog. No dependency changed and no P0/P1 security or build failure was observed.

## Scope confirmation

- No Project Management external URL or integration was added.
- No migration or seed operation was performed.
- No authentication, Supabase, registration, monitoring, certificate, HRBA integration, assessment, progress, or callback logic was changed.
- No hidden creator, RDF, Build Studio, reviewer, publisher, monitoring, advanced-admin, learner-settings, or community navigation was exposed.
- No preserved source code or historical functionality was deleted.
- Nothing was deployed.

## Exact next task

P2C simple no-code External Course Manager and integration contract preparation.
