# P2C-A No-Code External Course Manager Foundation Report

## Outcome

P2C-A adds an admin-only External Course Manager inside the retained basic-admin Courses area. An authorized administrator can prepare public course information and external integration settings, save a private draft, reopen managed records, preview the saved catalogue card and overview, test a validated URL, publish as Coming soon or Available, and unpublish without deleting historical records.

Project Management was not integrated.

## Data-storage approach

No migration or seed was introduced. The implementation reuses:

- `Course` for title, stable ID and slug, descriptions, audience, duration, language, level, image, status, visibility, certificate flag, and pass threshold;
- `CourseCapacityArea` for the many-to-many controlled capacity taxonomy;
- `LearningOutcome` for ordered outcomes;
- `Course.analysisMetadataJson.externalCourseManager` for a versioned integration object containing display order, featured state, primary/secondary taxonomy IDs, manager availability, mode, URL, approved origin, open behavior, version, capability flags, completion rule, and threshold;
- `AuditLog` for create, update, publish, and unpublish events.

Database manager records override a matching controlled fallback slug and can append an open-ended number of courses. Draft and Unpublished manager records suppress a matching fallback slug. The existing controlled catalogue remains available when the database is absent, fails temporarily, or has no manager record for that slug. HRBA slugs are reserved to prevent duplicates.

## Admin workflow

- `/admin/courses` retains the existing primary navigation location and adds `Add external course`.
- `/admin/courses/external/new` creates the configuration.
- `/admin/courses/[courseId]/integration` reopens and edits manager-owned external configuration.
- Every write rechecks the current session server-side and requires `SUPER_ADMIN` or `PLATFORM_ADMIN`.
- Save draft uses `DRAFT` and `PRIVATE`.
- Publish requires Coming soon or Available and uses `PUBLISHED` and `PUBLIC`.
- Unpublish uses `UNPUBLISHED` and `PRIVATE` without deleting the Course, relationships, learning outcomes, or audit history.

## Integration modes and launch behavior

- External link: validated URL opens in a new tab; no automatic progress, assessment, completion, or certificate claim.
- Embedded: authenticated learner route uses a sandboxed iframe, exact origin validation, reload control, open-in-new-tab fallback, and explicit unsupported-embedding guidance; no automatic tracking claim.
- Hub-tracked: can be configured as Draft or Coming soon; Available publication is blocked until a course-specific adapter is implemented and verified. Existing HRBA remains the working reference and is unchanged.

Coming-soon managed courses cannot launch or create enrollments. Draft and Unpublished records are not public. Available managed external-link and embedded courses use their configured safe launch without editing `public-course-catalogue.ts`.

## Security controls

- Server-side admin authorization on every mutation.
- HTTPS-only URLs except explicit localhost development origins.
- Unsafe schemes, remote HTTP, URL credentials, mismatched origins, and raw Hub record-ID query parameters are rejected.
- External-link and embedded capability combinations that over-claim progress, assessment, or certificate support are rejected.
- New Hub-tracked Available publication is blocked until adapter verification.
- Generic embedded launch uses an authenticated learner route, exact approved-origin validation, a restricted iframe sandbox, and no raw Hub IDs in its URL.
- Existing HRBA origin, token, progress, assessment, completion, and certificate checks remain intact.
- Important manager changes are recorded in the existing audit mechanism without logging the full external URL.

## Event contract

`docs/pilot-release/external-course-integration-contract.md` documents the legacy HRBA progress message and the backward-compatible version 1 event envelope for course ready, course started, progress updated, module completed, assessment completed, course completed, and integration error.

The existing HRBA frame accepts both forms. Supported new progress events are normalized into the existing protected same-origin persistence request, where the server continues to validate the launch token and limits.

## Files changed

- Admin route dispatcher, route definitions, Courses list, manager UI, workflow, and server action.
- Public catalogue data merge, public overview actions, card capability copy, and reusable course-detail types.
- Managed embedded learner launch workflow and iframe component.
- Backward-compatible external event types and HRBA frame handling.
- This report and the integration-contract specification.

No Prisma schema, migration, seed, authentication, Supabase, certificate design, HRBA course content, hidden system, or deployment configuration changed.

## Validation

- `npm run build` — passed.
- `npm run lint` — passed.
- `npx prisma validate` — passed.
- `npm run prisma:validate` — passed.
- `git diff --check` — passed.
- Pure URL/security checks — unsafe schemes, remote HTTP, raw-ID query parameters, and mismatched origins rejected; HTTPS and localhost development URLs accepted.
- Event-contract checks — all seven version 1 event types accepted with valid required fields; invalid progress and incomplete completion rejected.
- Authorization browser checks — signed-out manager access redirects to sign-in, a learner role redirects to Unauthorized, and a temporary local admin session can render the manager; no authentication bypass was committed.
- Desktop and mobile manager-form checks — completed with no horizontal overflow or console errors.
- Existing public fallback catalogue — remains visible once with no duplicate HRBA card and no fixed-count learner-facing copy.
- Existing HRBA public action — remains routed through the protected learner external-course launch.

The build emitted the existing fallback-course-data warning because the local QA environment has no configured production database. It did not fail the build.

## Database-dependent tests not completed locally

The local QA environment did not provide a configured writable PostgreSQL database or production admin identity. The following require a connected non-production database before release approval:

- create and reopen a persisted draft;
- audit-log row verification;
- publish/unpublish persistence and catalogue cache refresh against real records;
- database-driven Coming soon direct-launch blocking;
- available external-link and embedded record launch using a persisted manager record;
- database/fallback slug override and duplicate-HRBA verification against production-shaped data.

No production migration, seed, or write was performed.

## Exact next task

P2C-B integrate Project Management through the External Course Manager.
