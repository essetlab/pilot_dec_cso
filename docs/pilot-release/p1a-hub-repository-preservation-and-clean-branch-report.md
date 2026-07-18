# P1A Hub Repository Preservation And Clean Branch Report

Date: 2026-07-19

## Outcome

The complete committed CSO Learning Hub platform was preserved from the verified production source commit. An unreviewed sign-in-page change was preserved separately and was not included in either the archive baseline or the Phase One foundation branch. No application functionality or previously developed platform area was removed.

## Original Repository State

- Original repository: `D:\z CDP-Lg-Andy-main-main`
- Original branch: `feature/supabase-auth-vercel-real-pilot`
- Original HEAD: `227fb7f02c6793e8ff2bfae32afec74f0c8e59c9`
- Origin: `https://github.com/essetlabcso/CDP-Lg-Andy-G-pilot.git`
- Initial status: dirty
- Initial worktrees: only `D:\z CDP-Lg-Andy-main-main`
- Initial tags: none

### Dirty Files And Handling

One unstaged file was found:

- `src/app/(auth)/sign-in/page.tsx` — an unreviewed removal of the sign-in “Learning preview” panel and its now-unused demo-course import.

The change was classified as legitimate work requiring later review, but not approved for either the archived full-platform baseline or the Phase One foundation. It was committed by itself on `wip/sign-in-preview-removal-20260719` as commit `4820929` (`Preserve unreviewed sign-in preview removal`) and pushed to origin. It was not merged into the original branch, archive branch, tag, or Phase One branch.

After preservation, the original branch was clean and remained at `227fb7f02c6793e8ff2bfae32afec74f0c8e59c9`.

## Verified Production Baseline

- Production URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Production deployment ID: `dpl_AsdNLaU6mkmW99cfLuNaceXWhrDn`
- Production deployment status: Ready
- Production source branch: `feature/supabase-auth-vercel-real-pilot`
- Production source commit: `227fb7f02c6793e8ff2bfae32afec74f0c8e59c9`

Vercel deployment inspection and build logs explicitly reported:

`Cloning github.com/essetlabcso/CDP-Lg-Andy-G-pilot (Branch: feature/supabase-auth-vercel-real-pilot, Commit: 227fb7f)`

The production commit is the committed HEAD of the original branch. The original branch is therefore equal to production: it is neither ahead of nor behind the production source commit. The separately preserved WIP commit is not contained in the original branch or selected baseline.

## Preservation References

- Preserved full-platform commit: `227fb7f02c6793e8ff2bfae32afec74f0c8e59c9`
- Archive branch: `archive/hub-full-platform-before-phase1-cleanup-20260718`
- Annotated archive tag: `hub-full-platform-before-phase1-cleanup-20260718`
- Tag message: `Archive full CSO Learning Hub before Phase One learner-facing cleanup`

The local and origin archive branch resolve to the preserved commit. The annotated tag object targets the same preserved commit. Both references were pushed to origin without force or overwrite.

## Phase One Foundation

- Selected baseline: `227fb7f02c6793e8ff2bfae32afec74f0c8e59c9`
- New branch: `feature/hub-phase1-foundation-polish`
- New worktree: `D:\z CDP-Lg-Andy-phase1-clean`

The verified production commit was selected because it is the clean committed state currently deployed to production. It contains all verified production fixes and excludes the unreviewed sign-in preview removal. The Phase One branch was created directly from that commit and pushed to origin with upstream tracking. The clean worktree was created on that branch and verified with the correct origin.

The Phase One baseline intentionally retains RDF, Build Studio, course creator, reviewer, publisher, admin, analytics, monitoring, and experimental code internally. Later work may isolate or hide out-of-scope navigation and routes, but no such changes occurred in P1A.

## Baseline Validation

Validation was performed in `D:\z CDP-Lg-Andy-phase1-clean`.

| Command | Result | Notes |
|---|---|---|
| `npm ci` | PASS | Installed from the committed lockfile. Audit reported 9 dependency vulnerabilities: 1 low, 6 moderate, and 2 high. No audit-fix command was run. |
| `npm run build` | PASS | Prisma client generation and Next.js production build completed successfully. |
| `npm run lint` | PASS | ESLint completed without errors. |
| `npx prisma validate` | PASS | Prisma schema is valid. |
| `npm run prisma:validate` | PASS | Prisma schema is valid. |
| `git diff --check` | PASS | No whitespace errors. |
| `git status --short` before report creation | PASS | Clean after restoring the reproducible `next-env.d.ts` build-generated path change. |

### Existing Warnings

- The build printed the existing fallback note: `getPublicCourseSummaries: using fallback course data. Error.` The build still completed successfully.
- `npm ci` reported 9 dependency vulnerabilities: 1 low, 6 moderate, and 2 high. These were recorded but not changed because dependency remediation is outside this preservation-only task.
- The production build changed the generated `next-env.d.ts` route-types reference from the development path to the production path. The reproducible generated change was restored so this report remains the only Phase One commit.

## Scope And Safety Confirmation

- No code functionality was removed.
- No RDF, Build Studio, course creator, reviewer, publisher, admin, analytics, monitoring, or experimental files were deleted.
- No public or learner routes were hidden.
- No navigation, landing-page, catalogue, authentication, Supabase, HRBA, certificate, monitoring, course integration, or Project Management behavior was changed.
- No migrations, seeds, production database setup, registration scripts, or deployment commands were run.
- No production deployment was performed.
- No secrets, environment files, databases, dependency folders, build output, generated Prisma clients, logs, screenshots, or temporary QA artifacts were committed.

## Commands And Evidence

Repository and provenance inspection included:

- `git rev-parse --show-toplevel`
- `git branch --show-current`
- `git status --short`
- `git status`
- `git log --oneline --decorate -30`
- `git remote -v`
- `git worktree list`
- `git tag --list`
- `git diff`
- `git diff --staged`
- `git ls-files --others --exclude-standard`
- `npx vercel inspect https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- `npx vercel inspect dpl_AsdNLaU6mkmW99cfLuNaceXWhrDn --logs`
- local and remote reference-resolution checks for the WIP, archive, tag, and Phase One branches

No screenshots were required because P1A made no UI change to the Phase One branch.

## Exact Next Recommended Task

P1B define and hide non-Phase-One public/learner navigation and routes without deleting preserved code.
