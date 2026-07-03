# Slice 8B-4 Official HRBA Deployment Verification Report

Date: 2026-07-04

## Verdict

Still blocked.

The clean HRBA build at commit `edcc8f6faf5355f90f4bc71e11fcb5d105972412` contains the required launch-token portal contract, but the official public URL still serves the stale JavaScript asset:

`/assets/index-D1T-29i7.js`

That live asset does not contain `launchToken`, `portalOrigin`, or `cso-learning-hub:external-course-progress`.

## Clean HRBA Worktree

- Worktree used: `D:\eLearn_CDP_Lg_deploy_clean`
- Deployed/reviewed source commit: `edcc8f6faf5355f90f4bc71e11fcb5d105972412`
- Required included commit present in recent history: `82ce48d Update HRBA app portal launch token handling`
- `git status --short`: local Vercel/env metadata churn only plus an untracked handoff doc; no uncommitted source changes observed.
- `.gitignore` local diff only added `.vercel` and `.env*`.

## Clean Build Result

Commands run in `D:\eLearn_CDP_Lg_deploy_clean`:

```text
npm run lint
npm run build
```

Results:

- `npm run lint`: passed with 5 existing React hook warnings.
- `npm run build`: passed.
- Local built JS asset: `dist/assets/index-BESSZ9dG.js`

Local built asset string check:

| String | Present |
|---|---:|
| `launchToken` | yes |
| `portalOrigin` | yes |
| `cso-learning-hub:external-course-progress` | yes |
| `userId` | no |
| `learnerId` | no |
| `enrollmentId` | no |
| `courseVersionId` | no |

## Vercel Deployment Attempts

Existing official project was used:

`girumteenexus-8292s-projects/pilot-hrba-e-learn-v1-wajj`

The official alias before and after deployment attempts resolved to the old June 12 deployment:

- Deployment URL: `https://pilot-hrba-e-learn-v1-wajj-oxniqo84q.vercel.app`
- Created: 2026-06-12
- Status: Ready
- Official alias: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`

Deployment attempts from the clean worktree:

1. `npx vercel deploy --prod --yes`
2. `npx vercel deploy --prebuilt --prod --yes --scope girumteenexus-8292s-projects`
3. `npx vercel deploy --prebuilt --prod --yes --force --archive tgz --logs --scope girumteenexus-8292s-projects`

Each attempt timed out locally after a long wait and created a production deployment record that Vercel reported as `UNKNOWN`, not `Ready`.

Latest attempted deployment records observed:

- `https://pilot-hrba-e-learn-v1-wajj-39kt3xwqh.vercel.app` - `UNKNOWN`
- `https://pilot-hrba-e-learn-v1-wajj-bvvva7hrt.vercel.app` - `UNKNOWN`
- `https://pilot-hrba-e-learn-v1-wajj-sb8ga806u.vercel.app` - `UNKNOWN`

Promotion attempt:

```text
npx vercel promote https://pilot-hrba-e-learn-v1-wajj-sb8ga806u.vercel.app --yes --timeout 10m --scope girumteenexus-8292s-projects
```

Result:

```text
Error: The provided deploymentId (dpl_8PRNwu6XuA9PBLy82qa7odqSXL2v) is not ready and cannot be promoted. (422)
```

## Official Alias Verification

Fetched:

`https://pilot-hrba-e-learn-v1-wajj.vercel.app`

Observed official deployed JS asset:

`/assets/index-D1T-29i7.js`

Official asset string check:

| String | Present |
|---|---:|
| `launchToken` | no |
| `portalOrigin` | no |
| `cso-learning-hub:external-course-progress` | no |
| `userId` | no |
| `learnerId` | no |
| `enrollmentId` | no |
| `courseVersionId` | no |

Production alias changed from old June 12 deployment: no.

## Hub Verification

Commands run in `D:\z CDP-Lg-Andy-main-main`:

```text
docker start cso-learning-hub-postgres
npx prisma validate
npx prisma migrate status
npm run lint
npm run build
npm run prisma:validate
npm run verify:hrba-external-course
npm run verify:r17
```

Results:

- `docker start cso-learning-hub-postgres`: failed because Docker Desktop Linux engine was not reachable at `npipe:////./pipe/dockerDesktopLinuxEngine`.
- `npx prisma validate`: passed.
- `npm run prisma:validate`: passed.
- `npm run lint`: passed.
- `npm run build`: passed. Build used fallback course data because Prisma could not connect to PostgreSQL.
- `npx prisma migrate status`: failed with a Prisma schema engine error after PostgreSQL was unavailable.
- `npm run verify:hrba-external-course`: failed with a Prisma client runtime error after DB access was unavailable.
- `npm run verify:r17`: failed with a Prisma client runtime error after DB access was unavailable.

## Browser E2E

Local Hub dev server started at:

`http://localhost:3000`

Unauthenticated route check:

- Opened `http://localhost:3000/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- Browser redirected to `http://localhost:3000/sign-in?next=%2Flearn%2Fcourses%2Fapplying-human-rights-based-approach-in-cso-practice%2Fexternal`.
- Sign-in page rendered.

Authenticated browser E2E result:

- Not completed.
- Docker/PostgreSQL was unavailable, so the local learner account/session and launch-token-backed iframe flow could not be exercised.
- The official HRBA alias also remains stale, so a signed-in test against the intended production iframe would not satisfy closure.

## Files Changed

- `docs/mvp-slice-8b-4-official-hrba-deployment-verification-report.md`

## Final Git Status

After committing only this report:

```text
git status --short
```

Result: clean working tree; no output.

## Remaining Actions

1. Resolve why Vercel production deployments remain in `UNKNOWN` status and never become promotable.
2. Promote or alias a `Ready` deployment from clean commit `edcc8f6faf5355f90f4bc71e11fcb5d105972412` or a later reviewed clean commit to `https://pilot-hrba-e-learn-v1-wajj.vercel.app`.
3. Re-fetch the official alias and confirm it no longer serves `/assets/index-D1T-29i7.js`.
4. Confirm the official live asset contains `launchToken`, `portalOrigin`, and `cso-learning-hub:external-course-progress`.
5. Start Docker/PostgreSQL and rerun `npx prisma migrate status`, `npm run verify:hrba-external-course`, and `npm run verify:r17`.
6. Complete authenticated browser E2E with a signed-in pilot learner account.
