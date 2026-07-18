# P2A Phase One Hub Landing Page Content and Visual Polish Report

Date: 19 July 2026

Branch: `feature/hub-phase1-foundation-polish`

Starting baseline: `67f69d0b48f819cffb317e46a5856bc3c69633b3`

## Scope and outcome

P2A refines only the public landing page. It gives the CSO Learning Hub a clear Phase One identity centred on practical learning for local and grassroots CSOs, while distinguishing current learning functions from the future exchange and co-creation direction.

The P1B public header, footer and route-isolation mechanism remain unchanged. No authentication, learner, admin, course-integration, assessment, certificate, monitoring or deployment logic was changed.

## Previous landing-page issues

- The hero headline, “Learn. Connect. Grow.”, could imply that community connection was already active.
- The hero account action led to sign-in rather than account creation.
- Future peer-learning and co-creation ideas appeared in several sections and repeated release/safety qualifications.
- Similar feature, experience, practical-tool and community sections made the page dense and repetitive.
- Featured cards always displayed a certificate badge instead of checking the course data.
- The audience and the Hub’s respect for practitioners’ existing experience were not stated clearly.
- Some copy used implementation-facing language such as “current release”.

## Final page structure and major copy

1. **Public header** — retained from P1B: Home, Courses, Verify Certificate, Sign In and Register.
2. **Hero** — “Practical learning for local and grassroots CSOs”, with Explore courses and Create an account actions.
3. **Core value** — Structured learning, Practical application, Useful learning outputs and Certificates.
4. **Learning approach** — short explanations, realistic scenarios, worked examples, reflection, knowledge checks, practical activities and downloadable or reusable tools.
5. **Learn → Exchange → Co-create** — Learn is marked “Available now”; Exchange and Co-create are marked “Future direction”.
6. **Featured learning** — up to three published public courses supplied by the existing course-data query.
7. **Who the Hub is for** — local and grassroots CSOs; programme/project staff; organizational leaders; MEAL, finance and operational staff; community-facing practitioners; and networks/associations.
8. **Closing call to action** — “Strengthen practice. Build useful skills. Continue learning with other CSO practitioners.”
9. **Footer** — retained with Courses, Verify Certificate, Support, Privacy, Terms, Accessibility and approved partner recognition.

## Components and data reused

- Reused `ActionButton`, `StatusBadge`, `CourseCoverVisual`, public course summary types and the existing public course data supplied by `src/app/(public)/page.tsx`.
- Reused the approved `landing-hero.png` and `landing-about.png` assets.
- Reused global design tokens for DEC blue, green, deep navy, surfaces, borders, radii, shadows, type and focus treatment.
- Featured-card titles, descriptions, capacity areas, duration, level, links and certificate eligibility are read from `PublicCourseSummary`; no course metadata was duplicated in the landing component.
- The landing page does not fall back independently to unfiltered demo cards. An empty state points visitors to the catalogue if no public courses are returned.

## Featured course evidence

The local production build returned the currently published public fallback data because no local `DATABASE_URL` was configured. The landing cards showed:

- Proposal Development Fundamentals for Grassroots CSOs — Available now — Certificate eligible.
- MEAL Foundations for Local CSOs — Available now — Certificate eligible.
- Applying the Human Rights-Based Approach in CSO Practice — Available now — Certificate eligible.

Project Management was not displayed as an active course. HRBA’s public overview route loaded successfully; its integration behaviour was not modified.

## Browser and responsive QA evidence

QA used the production Next.js build at local-only URLs and a signed-out browser session.

| Review state | Evidence |
|---|---|
| Desktop, 1440 × 1000 | Hero, navigation and both hero actions visible; document `scrollWidth` equalled `clientWidth` (1425 px); no horizontal overflow. |
| Tablet, 768 × 1024 | Heading and both hero actions visible; document `scrollWidth` equalled `clientWidth` (753 px); no horizontal overflow. |
| Mobile, 390 × 844 | Hero reflowed to one column; both actions remained full-width and usable; document `scrollWidth` equalled `clientWidth` (375 px); no horizontal overflow. |
| Mobile navigation | Menu opened and closed in the production build; Home, Courses, Verify Certificate, Sign In and Register were present. |
| Public destinations | Courses, Register, Sign In, Verify Certificate, Support, Privacy, Terms, Accessibility and the HRBA overview all loaded with their expected headings. |
| Hidden systems | No landing-page text or link referenced creator, RDF, Build Studio, monitoring, reviewer or publisher systems. Anonymous requests to `/creator`, `/admin/monitoring` and `/learn/community` redirected to `/sign-in`. |
| Browser console | No warning or error entries in the production-mode review. |

Desktop and mobile screenshots were captured during the in-app browser QA session as `cso-p2a-landing-desktop.png` and `cso-p2a-landing-mobile.png` in the system temporary directory. They were intentionally not added to the repository because temporary QA artifacts must not be committed.

The public shell contains an authenticated-header branch that replaces Sign In/Register with Sign Out when a session exists. That source path was preserved, but an authenticated visual session was not available locally because this worktree has no configured database/session test account.

## Accessibility checks

- One clear page-level heading and ordered section headings were retained.
- Decorative SVG icons are hidden from assistive technology; the contextual image has meaningful alternative text.
- Lists identify learning methods and intended audiences semantically.
- CTA controls use existing keyboard-focus styling and minimum target sizing.
- Current and future pathway states use both text and visual treatment rather than color alone.
- Text/background combinations use the established high-contrast brand palette.
- Desktop, tablet and mobile reviews found no horizontal overflow.

## Automated checks

| Check | Result |
|---|---|
| `npm run build` | Passed. Production compilation, TypeScript and static generation completed. The existing fallback-course-data warning appeared because the local database was unavailable. |
| `npm run lint` | Passed. |
| `npx prisma validate` | Passed. |
| `npm run prisma:validate` | Passed. |
| `git diff --check` | Passed. |

The build-generated `next-env.d.ts` path change was restored before commit and is not part of P2A.

## Files changed

- `src/components/public/LandingPage.tsx`
- `docs/pilot-release/p2a-landing-page-content-and-visual-polish-report.md`

## Known limitations and backlog

- Without a local `DATABASE_URL`, public course loading uses the repository’s established fallback data and emits the existing fallback warning. This is recorded technical backlog and did not cause a build failure.
- Previously recorded dependency vulnerabilities remain technical backlog; P2A did not change dependencies and no P0/P1 security or build failure was observed.
- Some separate public support/legal pages still contain earlier release terminology. Their copy is outside this landing-page-only task.
- Authenticated-header rendering was source-verified but not visually exercised in a local authenticated session.

## Scope confirmation

No authentication or Supabase configuration, forgot-password functionality, learner/admin route, HRBA integration, Project Management integration, catalogue expansion, monitoring/community function, assessment rule, certificate rule or preserved internal feature was changed. No preserved source code was deleted. Nothing was deployed.

## Exact next task

P2B nine-capacity-area catalogue and reusable course overview preparation.
