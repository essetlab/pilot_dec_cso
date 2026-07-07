# S8B-16C Module Player First-Open Fix Report

## Summary

This slice targeted the corrected issue: the HRBA course catalogue works, but after Daniel opens Module 1 from the embedded catalogue, the Module 1 player could first render as a dark/partial shell. Success was not based on the catalogue page being visible; success required the actual Module 1 learning body to appear inside the Hub iframe without a browser frame reload.

Final decision: ready for owner manual Module 1 retest before Mulu.

## Reproduction

Production Hub tested:

- `https://cdp-lg-andy-g-pilot-xziq.vercel.app`

Production HRBA target:

- `https://pilot-hrba-e-learn-v1-wajj.vercel.app`

Daniel private credentials were loaded from the private local env file without printing values.

Observed before the final fix:

- Catalogue visible before Module 1 click: yes
- Module 1 first open clean: no
- Module 1 dark/partial state reproduced: yes
- Module 1 text visible before frame reload: yes in shell/header metadata, but the learner-facing body was not visible
- Screen 1 of 10 visible before frame reload: yes in shell/header metadata, but the learner-facing body was not visible
- Frame reload equivalent fixed Module 1: yes
- Module 1 learning body visible after frame reload: yes

Reproduction screenshots saved outside the repo:

- `D:\CSO_Learning_Hub_Scratch\s8b16c-module-player-repro-4\00-catalogue-before-module1.png`
- `D:\CSO_Learning_Hub_Scratch\s8b16c-module-player-repro-4\01-module1-immediate.png`
- `D:\CSO_Learning_Hub_Scratch\s8b16c-module-player-repro-4\03-module1-after-10s.png`
- `D:\CSO_Learning_Hub_Scratch\s8b16c-module-player-repro-4\04-module1-after-frame-reload.png`

## Root Cause

Best-supported cause: HRBA portal-mode player layout.

The embedded portal progress message was rendered as an extra direct child inside `.course-shell.player-container`, but the shell grid still defined four rows intended for:

- progress strip
- player header
- player body
- partner footer

In embedded portal mode, the extra progress message shifted the player header into the main `1fr` row and collapsed `.player-split-canvas` into the footer-sized row. That produced the owner-visible dark/partial Module 1 player state: shell/navigation was visible, but the learner-facing screen body was not visible.

Right-click Reload frame fixed the player because the reloaded URL no longer carried the portal launch query state in the same way, so the portal progress message was absent and the four-row grid lined up again.

## Repositories Changed

HRBA course repo changed:

- `D:\eLearn_CDP_Lg\src\components\player\CoursePlayerShell.tsx`
- `D:\eLearn_CDP_Lg\src\styles\global.css`

Hub repo changed:

- No Hub runtime code changed in this slice.
- This report was added in the Hub repo.

## Fix Implemented

HRBA fix commits:

- `84f01e2` - Reset HRBA player viewport on module open
- `50787d1` - Fix portal module player grid layout

The final layout fix adds a portal-mode shell class and a five-row grid only when the HRBA course is embedded through the Hub. The portal progress message now has its own row, so the player header, player body, and footer keep their intended rows.

The earlier viewport reset remains in place as a safe hardening measure for module/screen transitions.

Existing Hub recovery controls remain available above the iframe:

- `Reload course`
- `Open course in new tab`

No auth, launch-token, progress callback, certificate, database schema, migration, seed, registration, invite, or account-creation logic was changed.

## Checks

HRBA checks:

- `npm run build` - passed
- `npm run lint` - passed with existing warnings only
- `git diff --check` - passed
- `git status --short` - clean after commit and deployment cleanup

Hub checks:

- `git status --short` - clean before this report

No migrations or seed scripts were run.

## Deployment

HRBA production deployment:

- Final deployment ID: `dpl_APLvwvAAJ8Mx4iNQQ9VP7AecPcXW`
- Final deployment URL: `https://pilot-hrba-e-learn-v1-wajj-3qyjae400.vercel.app`
- Production alias: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Status: Ready
- Deployed commit: `50787d1`

Intermediate HRBA deployment:

- Deployment ID: `dpl_BTRso9beB168bMbqNEeTn2gCtbUU`
- Status: Ready
- Deployed commit: `84f01e2`

Hub deployment:

- No Hub deployment was needed for this slice.
- Hub production remained `https://cdp-lg-andy-g-pilot-xziq.vercel.app`.

## Final Browser Verification

Final clean-console screenshots saved outside the repo:

- `D:\CSO_Learning_Hub_Scratch\s8b16c-module-player-final-clean-console\01-module1-immediate.png`
- `D:\CSO_Learning_Hub_Scratch\s8b16c-module-player-final-clean-console\02-module1-after-3s.png`

Final result:

- Daniel accessed the protected Hub external course route: yes
- Catalogue visible before Module 1 click: yes
- Module 1 button clicked inside iframe: yes
- Module 1 visible on first open: yes
- Actual learner-facing Module 1 body visible: yes
- `Module 1: Starting the HRBA Learning Journey` visible: yes
- `Screen 1 of 10` visible: yes
- Manual browser frame reload needed: no
- Dark/partial shell state reproduced after final fix: no
- Iframe visible: yes
- Iframe size: `1214 x 720`
- Recovery button visible above iframe: yes, `Reload course`
- New-tab fallback visible above iframe: yes, `Open course in new tab`
- Console errors in final clean-console pass: none
- Network notes: aborted framework/font requests only; no blocking course failure

## DB Safety Check

Read-only SQL check only:

- Daniel found: yes
- Daniel quiz attempts: `0`
- Daniel certificates: `0`
- Mulu user count: `0`
- ANGAFA organization count: `0`

No raw IDs, raw launch tokens, token hashes, passwords, connection strings, or secret values were printed.

## Recommendation

Owner should manually retest Daniel by opening the Hub, launching the HRBA course, and clicking Module 1. Proceed to Mulu only after the owner confirms Module 1 first-open is clean in the browser where the issue was seen.

Continue repair only if the owner still sees a dark/partial Module 1 first-open state after the final HRBA production deployment above.

## Safety Confirmations

- No Mulu registration was performed.
- No users were created.
- No final assessment was completed.
- No certificate was created.
- No migrations were run.
- No seed scripts were run.
- No Supabase schema changes were made.
- No authentication weakening was made.
- No certificate logic was changed.
- No progress callback contract was changed.
- No secrets, raw launch tokens, token hashes, raw IDs, passwords, or connection strings were printed.
