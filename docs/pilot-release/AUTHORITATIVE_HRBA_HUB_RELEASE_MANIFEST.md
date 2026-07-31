# Authoritative HRBA and Hub Release Manifest

Last verified: 2026-07-23

## Hub release identity

| Item | Authoritative identity |
| --- | --- |
| Repository | `essetlab/pilot_dec_cso` |
| Production branch/commit | `main` at `4ba0233b5c8e391e37629e982240d44e21961c8d` |
| Production Vercel project | `esset-lab/pilot-dec-cso` |
| Production deployment | `dpl_9T8arwDwiYQFozjFq6SMCxnhHqCF` |
| Final pilot candidate branch/commit | `feature/pilot-registration-integration-checkpoint` at `875c26e90c4a7d50aee0d6cac57c6787d6ef622e` |
| Candidate deployment | `dpl_4tu5mYkGqvtwT9fXmJ7RFm7ADpZc` |
| Candidate promotion state | Not production |

The clean authoritative Hub candidate worktree is `D:\z CDP-Lg-Andy-pilot-integration`. `D:\z CDP-Lg-Andy-main-main` is a legacy feature worktree and must not govern current Hub integration decisions.

## Standalone HRBA release identity

| Item | Authoritative identity |
| --- | --- |
| Repository | `essetlabcso/pilot_hrba_eLearn_v1` |
| Release branch/tip | `release/hrba-pilot-final` at `4644156d0313014cb24a7cbde4f8451f1c0c4f83` |
| Deployed application commit | `22f9448736f126a5eb7cbed111606daae4b25a71` |
| Production deployment | `dpl_4UTTSsAsyn2dAct8qJsTxQ71oTvG` |
| Production alias | `https://pilot-hrba-e-learn-v1-wajj.vercel.app` |
| Module 5 Draft PR/candidate | `#2` at `2a0f09ed1b102ad7b09d6aac78d86b15162789c0` |

The Hub launches the standalone course. HRBA module implementation remains in the HRBA repository; Hub source changes require a separately demonstrated integration defect.

## Approved staging backend

- Supabase reference: `fgyxbzwdvngqlksyxuwa`.
- Role: approved Hub staging project; the current fixtures have not been independently reverified because access is unavailable.
- Current access: unavailable to the authenticated CLI (HTTP 403); browser sessions were signed out at last verification.
- Do not create a replacement project for standalone module work.

Supabase access is not a prerequisite for reviewing a standalone HRBA module when its Hub bridge contract is unchanged. It is not required for merge if production deployment is separately controlled; if release-branch merge automatically deploys production, it becomes a pre-merge requirement. It is always required for authenticated pre-production Hub acceptance and any authorized post-deployment Hub smoke test.

## Manifest maintenance

Update this file after a reviewed Hub production promotion, Hub candidate replacement, HRBA deployment, bridge-contract change or approved staging-backend change. This PR targets the current Hub candidate and does not promote it; when that candidate is promoted, this governance record must be included or independently carried into `main`. Cite commits and immutable deployments; never record secrets or learner data.
