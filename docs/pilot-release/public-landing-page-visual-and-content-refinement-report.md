# Public Landing Page Visual and Content Refinement

## Release checkpoint

- Branch: `feature/pilot-registration-integration-checkpoint`
- Baseline commit: `f03dc811ea581b10eb27e5f7a79e0c24b4151888`
- Scope: public presentation only
- Production deployment: not performed

## Source material reviewed

The complete `CSO_Learning_Hub_Landing_Page_Enhancement_Package.zip` was extracted outside the repository and reviewed. Implementation followed the package's information architecture, final landing-page content, course-card rules, public visual system, responsive/accessibility guidance, low-bandwidth guidance, agent handoff, asset register, migration map, and QA checklist. High-fidelity mockups were used as design references rather than pixel-perfect templates.

## Baseline and route inventory

The accepted baseline exposed Home, Courses, Verify certificate, Sign in, Register, support/policy routes, course overview routes, learner routes, and protected administrator routes. The landing page was already presentation-only and received course summaries from the centralized catalogue through `getPublicCourseSummaries()`.

The refinement preserves those route and data boundaries. `How the Hub works` is implemented as the stable `/#how-the-hub-works` landing-page anchor so no unapproved public route was invented.

## Sections implemented

1. Public header and navigation
2. Practical-learning hero
3. DEC programme identification
4. Everyday CSO realities
5. Analyse, Decide, Create, Adapt value cards
6. Open and invitation-only access journey
7. Learn, Practise, Apply method
8. Data-backed featured courses
9. Published-HRBA-supported practical output
10. Organisation-level learning
11. Learn, Exchange, Co-create phase boundary
12. Transparent Phase One status
13. Accessibility and low-bandwidth reassurance
14. Final course-first call to action
15. Public footer and authoritative partner acknowledgement strip

## Course-data behaviour

- Course title, order, availability, access state, duration, certificate label, capacity area, link, and description continue to come from the existing centralized public catalogue.
- The live HRBA duration is displayed from repository data; the package's provisional 90-minute value was not hard-coded.
- HRBA remains the only substantive course marked `Available now` and retains its invitation-required access label.
- Governance and Project Management remain `Coming soon`, expose overview actions only, and have no start or enrolment control.
- The open demonstration course is not promoted as a substantive capacity-development course.
- No catalogue, course, authentication, registration, invitation, assignment, progress, assessment, certificate, API, or database logic changed.

## Visual and asset treatment

- The supplied Ethiopian CSO planning image is used as the hero through `next/image`, with a text-first navy fallback and responsive delivery.
- The supplied 1429:188 partner strip is preserved as one unchanged composite image. Its rendered aspect ratio matched its delivered source ratio during browser QA.
- Public colours now use the package's deep navy, accessible DEC blue, pale mint, restrained green and amber, visible borders, editorial headings, and limited shadows.
- The footer uses Platform, Account, and Trust & Support groups and a dynamic current year.

## Responsive and accessibility evidence

Browser checks passed at 1440×1000, 1024×768, 768×1024, 390×844, and 320×568:

- no horizontal overflow;
- one H1;
- no clipped DOM layout bounds;
- coming-soon cards contain no start/continue action;
- header collapses to one mobile menu;
- menu exposes the expected six public/account destinations;
- Escape closes the mobile menu and returns focus to the trigger;
- skip link, `main` landmark, semantic lists, descriptive hero alt text, descriptive composite-logo alt text, text course states, 44-pixel navigation targets, visible focus, and reduced-motion handling are present.

The implementation targets WCAG 2.2 AA while preserving WCAG 2.1 AA as the minimum. A formal conformance audit remains outside this frontend checkpoint.

## Performance evidence

- Previous hero source/delivery: CSS background PNG, 2,206,211 bytes.
- New mobile hero delivery at 390 px: framework-generated WebP, 87,612 bytes.
- New below-fold footer and partner images use lazy loading.
- All text and actions remain server-rendered; no carousel, autoplay, remote font, marketing script, or new client library was added.
- Field LCP, INP, CLS, and full transfer budgets require measurement on the final Preview and are not claimed by this report.

## Browser and route regression

Local production-equivalent route checks returned successful pages for `/`, `/courses`, the HRBA overview route, `/sign-in`, `/register`, `/forgot-password`, `/verify-certificate`, and `/support`.

- Public header and footer contain no administrator, creator, reviewer, monitoring, Build Studio, or community link.
- `/admin` retains the accepted DEC Administrator Portal entry experience.
- `/admin/course-invitations` redirects an unauthenticated visitor to administrator sign-in with the return path preserved.
- The only observed console warning was the existing local fallback-course-data warning when no connected database configuration was loaded. It is existing technical backlog and did not cause a build or route failure.
- Authentication, registration, invitation, learner access, assignments, progress, assessment, certificates, and database state were not modified.

## Evidence files

Before and after captures were stored outside Git under `D:\CSO_Learning_Hub_Secrets\landing-page-evidence\`:

- exact accepted baseline desktop and mobile hero captures;
- refined desktop and mobile hero captures;
- 320-pixel narrow-mobile capture;
- featured-course capture;
- final CTA/footer capture;
- responsive mobile hero asset sample.

No screenshot, environment file, temporary worktree, log, build output, generated Prisma client, or local verification artifact is included in the commit.

## Validation

- `npm run typecheck` — PASS
- `npm run lint` — PASS
- `npm run prisma:validate` — PASS
- `npm run build` — PASS (existing fallback-course-data warning only)
- `npm run verify:open-registration` — PASS
- `npm run verify:stage-a-session` — PASS
- `npm run verify:hrba-assignment-boundary` — PASS, including the unchanged zero-progress initialization contract
- `npm run verify:pilot-readiness` — PASS against approved staging data
- `npm run verify:course-invitation-management` — PASS; fictional verifier records cleaned by the script
- `git diff --check` — PASS

## Remaining owner confirmations

- Formal approval of the supplied hero image for public use.
- Final institutional approval of the unchanged partner acknowledgement strip.
- Whether a dedicated About/How the Hub works page should later replace the current landing-page anchor.
- Any published support contact beyond the existing Support route.
- Any public pilot evidence or testimonial; none was invented.
- Formal accessibility and field-performance audits on the final deployment.

## Recommendation

Approve this frontend checkpoint for human review on an integrated Vercel Preview. Do not promote it to Production until visual/content owners approve the hero and acknowledgement treatment and normal pilot release gates pass.
