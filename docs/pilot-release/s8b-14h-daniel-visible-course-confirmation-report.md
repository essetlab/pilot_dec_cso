# S8B-14H Daniel Visible Course Confirmation Report

## Summary

- Hub URL tested: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Final HRBA course URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`
- Test user: Daniel, using private credentials from the local secrets file.
- Result: the HRBA course visibly runs inside the CSO Learning Hub.

## Daniel Browser Test Result

- Sign-in successful: yes.
- URL after sign-in: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn`.
- Daniel reached `/learn`: yes.
- HRBA course card visible: yes.
- First Start/Continue click works: yes.
- URL after first click: `https://cdp-lg-andy-g-pilot-xziq.vercel.app/learn/courses/applying-human-rights-based-approach-in-cso-practice/external`.
- Second sign-in required: no.
- External route response status: `200`.
- External route request cookie names: `cso_lh_session`, Supabase auth cookie name.

## Iframe Evidence

- Iframe exists: yes.
- Iframe visible: yes.
- Iframe size: `1214 x 720`.
- Iframe has real height and width: yes.
- Iframe src valid: yes.
- Iframe src: `https://pilot-hrba-e-learn-v1-wajj.vercel.app/?embed=portal&portalOrigin=https%3A%2F%2Fcdp-lg-andy-g-pilot-xziq.vercel.app&courseSlug=applying-human-rights-based-approach-in-cso-practice&launchToken=[redacted]`
- Iframe content loaded: yes.
- Visible HRBA course text found: yes.
- Visible text included: `Applying the Human Rights-Based Approach in CSO Practice`.
- Blank iframe problem reproduced: no.
- Parent console errors: none captured.
- Iframe console errors: none captured.
- Network errors: none captured.

The first short DOM read observed the iframe container before course text was ready. A follow-up wait and visual screenshot confirmed the HRBA app rendered visible course content inside the iframe.

## DB Safety Check

Read-only Prisma queries confirmed:

- Daniel user exists: yes.
- Daniel HRBA quiz attempts: `0`.
- Daniel HRBA certificates: `0`.
- Mulu user exists: no.
- ANGAFA organization exists: no.

## Safety Confirmations

- Daniel's password was not printed.
- No secret values were printed.
- No raw launch token or token hash was printed.
- No Mulu registration was performed.
- No new users were created.
- No HRBA course completion was performed.
- No final assessment was submitted.
- No certificate was created.
- No migrations were run.
- No seed scripts were run.
- No deployment was performed.
- No code or env files were changed.

## Recommendation

Owner manual retest is recommended to confirm the visible learner experience from the owner's browser. Proceed to Mulu only after owner confirms. If the owner still sees a blank or non-visible course area, repair the visibility issue before registration.
