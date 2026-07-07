# S9A Daniel certificate generation test report

## Context

- Hub repo: `D:\z CDP-Lg-Andy-main-main`
- Hub branch: `feature/supabase-auth-vercel-real-pilot`
- Hub commit at test start: `2938512 Add Module 1 first open fix report`
- Hub production URL tested: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- HRBA repo: `D:\eLearn_CDP_Lg`
- HRBA branch: `release/hrba-pilot-final`
- HRBA commit at test start: `50787d1 Fix portal module player grid layout`
- HRBA production URL used in iframe: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Evidence folder: `D:\CSO_Learning_Hub_Scratch\s9a-daniel-certificate-test`

## Audit result

- Certificate generation implemented: yes.
- Certificate generation is Hub-side: yes.
- HRBA final assessment callback path implemented: yes.
- Hub creates external-course quiz attempts from validated HRBA assessment callbacks: yes.
- Hub issues certificates only after completion plus passing assessment: yes.
- PDF certificate generation implemented: yes.
- PDF template configured: `public/certificate-templates/hrba-certificate-template.pdf`.
- PNG template avoided by generator/config: yes.
- Authenticated certificate PDF download route implemented: yes.
- Public certificate verification route implemented: yes.
- Public verification data avoids raw database IDs: yes.
- HRBA postMessage payload uses course slug, launch token, progress, module/screen IDs, and assessment result; raw Hub database IDs were not found in the payload.

## Pre-test DB state

- Daniel exists: yes.
- Daniel active/enabled: yes.
- Daniel authProvider is `supabase`: yes.
- Daniel has PARTICIPANT role: yes.
- Daniel linked to HCDA: yes.
- Daniel HRBA enrollment count: 1.
- Daniel HRBA enrollment status before test: `IN_PROGRESS`, 36%, no completion date.
- Daniel lesson progress count: 1.
- Daniel HRBA quiz attempt count before test: 0.
- Daniel HRBA certificate count before test: 0.
- Mulu exists: no.
- ANGAFA organization exists: no.

## Checks run

Hub:

- `npm run build` passed. Build logged fallback public-course data during static generation because build-time DB access was refused, but the build completed.
- `npm run lint` passed.
- `npx prisma validate` passed.
- `npm run prisma:validate` passed.
- `git diff --check` passed.

HRBA:

- `npm run build` passed with existing Vite large chunk warning.
- `npm run lint` passed with 5 existing React hook warnings.
- `git diff --check` passed.

No migrations, seed scripts, database setup commands, or deployments were run.

## Browser test summary

- Fresh Playwright browser context used.
- Daniel sign-in successful: yes.
- Hub HRBA launch successful: yes.
- HRBA iframe exists and is visible: yes.
- Iframe source valid: yes; `launchToken` redacted in evidence/report.
- HRBA course catalogue text found: yes.
- Module 1 opened inside the Hub iframe: yes.
- Module 1 screens visible: yes.
- Module 1 completed through UI automation: yes.
- Hub progress updated after Module 1 completion: yes.
- Module 2 opened through the intended course flow: yes.
- Browser automation blocked at Module 2, screen `1.3` (`A Tale of Two Water Projects`).
- Final assessment accessible: no, blocked before completing Modules 2-5.
- Final assessment submitted: no.
- Daniel passed assessment: no.
- Certificate generated: no.
- Certificate PDF/download available: no, because certificate was not generated.
- Public verification route for generated certificate tested: no, because certificate was not generated.

The runner did not bypass course gates with route hacks, localStorage seeding, or direct Hub callback/API submission. The test stopped rather than forcing certificate creation outside the intended learner flow.

## Blocking detail

The automated browser runner successfully cleared Module 1 after targeted handling for Module 1 card and self-assessment gates. It progressed into Module 2 and reached screen `1.3`, where the screen requires a range-slider interaction, safe text entry, portfolio save, and then the content-level `Next: Identifying the Actors` action.

Despite adding text, save, and range handling to the runner, the content Next action remained disabled in the automated run. This appears to be an automation-specific gap in the runner's handling of that screen, not evidence that Daniel cannot complete the screen manually.

## Post-test DB state

- Daniel HRBA enrollment status after test: `IN_PROGRESS`, 18%, no completion date.
- Daniel lesson progress count: 1.
- Daniel HRBA quiz attempt count after test: 0.
- Daniel HRBA certificate count after test: 0.
- Duplicate certificates created: no.
- Mulu exists: no.
- ANGAFA organization exists: no.

Note: the browser test legitimately completed Module 1 in a fresh HRBA context, and the Hub accepted that progress callback. This changed Daniel's recorded HRBA progress to 18%.

## Certificate content verification

Not performed because no Daniel certificate was generated. Therefore:

- PDF opens/downloads: no.
- Participant name verification: not applicable.
- Course title verification: not applicable.
- Date awarded verification: not applicable.
- Public certificate ID/code verification: not applicable.
- Placeholder removal verification: not applicable.
- Raw internal ID exposure in generated PDF: not applicable.
- Visual layout verification: not applicable.
- Verification route for generated code: not applicable.

## Deployment status

- No Hub code changes were made.
- No HRBA code changes were made.
- No deployment was attempted.
- No deployment ID was produced.

## Recommendation

Do not proceed to Mulu yet. Owner/manual Daniel retest should continue from the Hub and complete Module 2 screen `1.3` onward, or the automation runner should be extended with targeted handlers for Module 2-5 gates before rerunning S9A. Certificate generation remains unverified in production until Daniel reaches and passes the final assessment through the intended HRBA flow.

## Safety confirmations

- No Daniel password or secret values were printed.
- No raw launch tokens or token hashes were printed.
- No raw Hub database IDs were printed.
- No Mulu registration was attempted.
- No new learner/admin accounts were created.
- No invites were sent.
- No migrations or seed scripts were run.
- No certificate was generated by the HRBA standalone app.
- No direct certificate creation was performed outside the Hub flow.
