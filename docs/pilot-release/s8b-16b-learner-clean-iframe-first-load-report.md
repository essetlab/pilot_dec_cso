# S8B-16B Learner-Clean Iframe First-Load Report

## Summary

The owner-reported issue was that Daniel could sign in and launch the HRBA course, but the embedded iframe could first appear as a partial or visually unstable player state. A manual browser frame reload made the same course URL render correctly, which supports a first-render/hydration/layout timing cause rather than an authentication, launch-token, or course-content failure.

The fix protects learners from seeing the unstable phase:

- Hub wrapper now shows a visible "Preparing your course..." panel before exposing the iframe.
- Hub wrapper performs one same-src iframe remount per launch page load, using the existing iframe URL and launch token.
- Hub wrapper includes learner-safe controls: "Reload course" and "Open course in new tab".
- HRBA player now shows a brief "Preparing this screen..." state on screen changes, resets the player viewport, and dispatches resize events before exposing the screen.

No auth, launch-token, progress callback, certificate, database schema, migration, seed, registration, or account-creation logic was changed.

## Repositories Changed

Hub repo changed:

- `src/components/learner/ExternalCourseFrame.tsx`

HRBA repo changed:

- `src/components/player/CoursePlayerShell.tsx`
- `src/styles/global.css`

## Fix Commits

Hub commits:

- `cb56e7b` - Stabilize external course iframe load
- `391bb9a` - Add iframe readiness fallback
- `082133c` - Move course loading message into view

HRBA commit:

- `697f888` - Stabilize HRBA course screen loads

## Deployment

Hub production deployment:

- Deployment ID: `dpl_4Rsm24U7cFqyHqsGJ6VnvxufMV7n`
- Production alias: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Result: Ready

HRBA preview deployment:

- Deployment ID: `dpl_CwEeJCVavFhu4UVXSxZVmzc6KvVP`
- Preview URL: `https://pilot-hrba-e-learn-v1-wajj-lnm8qnm10.vercel.app`
- Result: Ready

HRBA production deployment:

- Deployment ID: `dpl_DukBzGV7bLZ5skiTDTX1NCUqxrU3`
- Production alias: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Result: Ready

## Checks Run

Hub checks:

- `npm run lint` - passed
- `npm run build` - passed
- `npx prisma validate` - passed
- `npm run prisma:validate` - passed
- `git diff --check` - passed

HRBA checks:

- `npm run build` - passed
- `npm run lint` - passed with existing warnings only
- `git diff --check` - passed

No migrations, seeds, database writes, registration, invites, or certificate actions were run.

## Browser Verification

Production Hub URL tested:

- `https://cdp-lg-andy-g-pilot-xziq.vercel.app`

Final HRBA URL tested:

- `https://pilot-hrba-e-learn-v1-wajj.vercel.app`

Daniel verification result:

- Daniel sign-in successful: yes
- Daniel reached learner area and My Courses: yes
- HRBA opened inside Hub: yes
- First visible Hub iframe state clean: yes, visible "Preparing your course..." panel
- Automatic iframe stabilization used: yes
- Manual frame reload needed: no
- Module 1 clicked: yes
- "Module 1: Starting the HRBA Learning Journey" visible: yes
- "Screen 1 of 10" visible: yes
- Large blank/partial iframe state shown to learner: no
- Reload course control present: yes
- Reload course control works: yes
- Open course in new tab control present: yes
- Open course in new tab works: yes
- Iframe size during verification: `1214 x 720`
- Console errors: one non-blocking 404 resource message observed
- Network errors: none after filtering aborted framework prefetches

Screenshots saved outside the repo:

- `D:\CSO_Learning_Hub_Scratch\s8b16b-final-verification-3\01-first-visible-hub-loading.png`
- `D:\CSO_Learning_Hub_Scratch\s8b16b-final-verification-3\02-course-frame-visible.png`
- `D:\CSO_Learning_Hub_Scratch\s8b16b-final-verification-3\03-module1-first-visible-clean.png`
- `D:\CSO_Learning_Hub_Scratch\s8b16b-final-verification-3\04-module1-ready.png`
- `D:\CSO_Learning_Hub_Scratch\s8b16b-final-verification-3\05-after-reload-course-button.png`

All launch-token URLs were redacted in command output and report notes.

## DB Safety Check

Read-only Prisma queries only:

- Daniel found: yes
- Daniel quiz attempts: `0`
- Daniel certificates: `0`
- Mulu user count: `0`
- ANGAFA organization count: `0`

No raw IDs, raw tokens, token hashes, passwords, or secret values were printed.

## Decision

Ready for owner manual retest before Mulu.

Recommendation:

- Owner should manually retest Daniel in the same browser where the issue was seen.
- Proceed to Mulu registration only after owner confirms the first visible Module 1 experience is clean.
- Continue repair only if the owner still sees a broken, blank, or partial first-load state after the production deployments above.
