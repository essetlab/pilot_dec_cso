# S8B-14I Owner Browser Mismatch Diagnostic Report

## Summary

- Branch: `feature/supabase-auth-vercel-real-pilot`
- Hub production URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Final HRBA production URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Owner mismatch: Codex automation can see the HRBA course visibly running inside the Hub iframe, but the owner still reports that the course is not visible in their browser after signing in as Daniel.
- Diagnostic result: Codex still reproduces success in clean contexts. The most likely owner-side causes are stale browser/session state, an extension/privacy feature blocking iframe assets or storage, or an old cached page state.

## Prior S8B-14H Evidence

- Report commit: `d0e34f4`.
- Hub route where iframe loaded: `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- Redacted iframe URL shape: `https://pilot-hrba-e-learn-v1-wajj.vercel.app/?embed=portal&portalOrigin=https%3A%2F%2Fcdp-lg-andy-g-pilot-xziq.vercel.app&courseSlug=applying-human-rights-based-approach-in-cso-practice&launchToken=[redacted]`.
- Hub iframe component: `ExternalCourseFrame`.
- Iframe selector used for automation: `iframe`.
- Iframe implementation: `className="h-[78vh] min-h-[720px] w-full bg-white"`, `sandbox="allow-downloads allow-forms allow-popups allow-same-origin allow-scripts"`, `referrerPolicy="strict-origin-when-cross-origin"`.
- S8B-14H browser/device details captured: Chromium automation viewport `1365 x 900`; iframe size `1214 x 720`.
- S8B-14H console/network state: no parent console errors, no iframe console errors, no network errors captured.
- S8B-14H note: a first short DOM read observed the iframe container before course text was ready; a follow-up wait and visual screenshot confirmed visible HRBA content inside the iframe.

## Clean-Context Browser Results

### A. Fresh Normal Chromium Context

- Sign-in successful: yes.
- Route after sign-in: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn`.
- Start/Continue button found: yes.
- Route after click: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- Second sign-in required: no.
- Iframe exists: yes.
- Iframe visible: yes.
- Iframe size: `1214 x 720`.
- Iframe src valid: yes, with `launchToken=[redacted]`.
- Iframe content loaded: yes.
- Visible HRBA text found: yes.
- Blank iframe reproduced: no.
- Parent console errors: none captured.
- Iframe console errors: none captured.
- Network failures: none captured.
- Asset URLs loaded: `/assets/index-B0JBroUG.css`, `/assets/index-CyBp4KkS.js`.
- Screenshot saved locally: yes, under `D:\CSO_Learning_Hub_Scratch\s8b14i-owner-mismatch\`.

### B. Fresh Incognito-Like / No-Storage Chromium Context

- Sign-in successful: yes.
- Route after sign-in: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn`.
- Start/Continue button found: yes.
- Route after click: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- Second sign-in required: no.
- Iframe exists: yes.
- Iframe visible: yes.
- Iframe size: `1214 x 720`.
- Iframe src valid: yes, with `launchToken=[redacted]`.
- Iframe content loaded: yes.
- Visible HRBA text found: yes.
- Blank iframe reproduced: no.
- Parent console errors: none captured.
- Iframe console errors: none captured.
- Network failures: none captured.
- Asset URLs loaded included: `/assets/index-B0JBroUG.css`, `/assets/index-CyBp4KkS.js`, and HRBA module image assets.
- Screenshot saved locally: yes, under `D:\CSO_Learning_Hub_Scratch\s8b14i-owner-mismatch\`.

## Cache And Storage Sensitivity

Test performed:

- Signed in as Daniel.
- Opened the HRBA iframe successfully.
- Signed out.
- Cleared cookies/storage for the Hub domain.
- Cleared cookies/storage for the HRBA domain.
- Signed in as Daniel again.
- Opened the HRBA iframe again.

Result:

- Clearing storage changed the result: no.
- Before clearing storage: iframe visible, HRBA text found, blank iframe not reproduced.
- After clearing storage: iframe visible, HRBA text found, blank iframe not reproduced.

## Browser-Blocking Hypotheses

- Third-party cookies required: unlikely. No HRBA cookie headers were observed on HRBA iframe or asset requests; Hub authentication cookies were only sent to the Hub external route.
- LocalStorage/sessionStorage use: yes for HRBA `localStorage`; no observed `sessionStorage` use.
- Storage access errors observed: no.
- Mixed-content issue observed: no; no `http://` mixed-content URLs were captured.
- CSP/frame issue observed: no; iframe loaded in both contexts with no frame-blocking console errors.
- Adblock/privacy-sensitive URL pattern: no obvious pattern. The HRBA assets are ordinary Vercel asset paths such as `/assets/index-CyBp4KkS.js`.
- Service worker/cache issue observed: no. HRBA frame reported zero service worker registrations and zero Cache Storage keys in the clean contexts.
- Old asset/cached build likely: possible on the owner browser, especially if the owner tab/browser retained an old Hub or HRBA page state from before the S8B-14G and S8B-14H fixes.

## DB Safety Result

Read-only Prisma checks:

- Daniel user exists: yes.
- Daniel HRBA quiz attempts: `0`.
- Daniel HRBA certificates: `0`.
- Mulu exists: no.
- ANGAFA exists: no.

## Owner Troubleshooting Checklist

1. Open the exact Hub production URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`.
2. Sign out from the Hub.
3. Hard refresh the Hub page.
4. Clear site data for `cdp-lg-andy-g-pilot-xziq.vercel.app`.
5. Clear site data for `pilot-hrba-e-learn-v1-wajj.vercel.app`.
6. Try an incognito/private browser window.
7. Temporarily disable browser extensions, especially ad blockers, privacy blockers, script blockers, and tracking protection extensions.
8. If the browser blocks third-party site data, allow site data for `pilot-hrba-e-learn-v1-wajj.vercel.app`.
9. Try Chrome or Edge if another browser fails.
10. After clicking Start/Continue, verify the visible URL is `/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
11. If it still fails, capture a screenshot that includes the visible URL and the blank/course area.

## Recommendation

Classification: no immediate code fix is recommended based on Codex reproduction. The evidence points most strongly to owner browser cache/session state or owner browser privacy/extension behavior.

Recommended next action:

- Ask the owner to perform the troubleshooting checklist above.
- If the owner can see the course after incognito or site-data clearing, proceed to controlled Mulu registration.
- If the owner still sees a blank frame after those steps, continue investigation with the owner's screenshot, visible URL, browser name/version, and whether extensions/privacy protections are active.

Possible future product hardening, not implemented in this diagnostic slice:

- Add a visible iframe loading/error state.
- Add a safe recovery option such as "Open course in a new tab" if the embedded frame does not render.
- Add clearer owner-facing diagnostics if iframe assets fail to load.

## Safety Confirmations

- No Mulu registration was performed.
- No users were created.
- No HRBA course completion was performed.
- No final assessment was submitted.
- No certificate was created.
- No migrations were run.
- No seed scripts were run.
- No production deployment was performed.
- HRBA production was not changed.
- No code changes were made.
- No secrets, passwords, raw launch tokens, token hashes, or cookie values were printed or committed.
