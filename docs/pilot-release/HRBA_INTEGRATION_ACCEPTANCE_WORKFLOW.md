# HRBA Integration Acceptance Workflow

## Separation of release tracks

The standalone HRBA course owns module content, interactions, browser-local learning state and Final Assessment availability. The Hub owns authentication, enrollment, account-linked progress, assessment records, completion and certificates. Supabase supports the Hub; it is not part of standalone module implementation.

## Candidate acceptance sequence

1. Pin the HRBA Draft PR head and Hub candidate commit from the release manifests.
2. Confirm the HRBA bridge files did not change, or review any bridge change separately.
3. Complete standalone automated and required human accessibility acceptance.
4. Use only the approved staging backend and synthetic learners.
5. Configure a non-production Hub Preview with the exact HRBA Preview URL and allowed origin.
6. Verify authenticated launch, token validation, iframe load, progress, completion, refresh/resume, assessment handoff, score persistence, Hub completion, certificate eligibility/download, second-learner isolation, retained completion and absence of detailed HRBA answer transmission.
7. Clean temporary fixtures only when cleanup does not remove retained-completion evidence required by the test record.
8. Record every result against exact commits and immutable deployment IDs.
9. Do not promote the Hub merely because an HRBA module changed.

## Module 5 current gates

Before review and merge, Draft PR #2 requires:

- recorded native keyboard-only traversal at approximately 390 px;
- no open P0/P1 standalone defect;
- confirmation that the Hub bridge files and message contract remain unchanged; and
- reviewer approval;
- Vercel-owner confirmation of whether merging `release/hrba-pilot-final` automatically deploys production.

Before production deployment:

- authorized access to staging project `fgyxbzwdvngqlksyxuwa` must be restored;
- the Hub candidate Preview must have usable non-production configuration;
- all 14 authenticated integration checks must pass without a P0/P1 defect; and
- the HRBA Vercel owner must confirm the reviewed source commit, production-branch behavior, alias-retention plan and rollback deployment.

If merging the HRBA release branch automatically deploys production, every pre-production item above becomes a pre-merge requirement. If production deployment is separately controlled, Supabase access and authenticated integration may follow merge but must finish before deployment.

After production deployment, run only a bounded authenticated Hub smoke path unless production completion/certificate record creation has been separately approved. Confirm launch, iframe/origin handling and one progress callback, then update both release manifests.

## Production boundary

Hub production `main` at `4ba0233b5c8e391e37629e982240d44e21961c8d` and the HRBA production alias must remain unchanged during acceptance. Any Hub source fix, Hub promotion, Supabase schema change, HRBA alias change or production deployment requires separate review and explicit authorization.
