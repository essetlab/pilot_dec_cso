# Pilot-critical public registration and password recovery report

Date: 2026-07-20  
Branch: `feature/pilot-registration-integration-checkpoint`  
Accepted integration baseline: `64cdb569c9d1ed14c892e8461f4afd89863d47ef`  
Preview trigger baseline: `7afc0ad58f9aeee42f3e59137291605c293a1527`

## Scope and decision

This checkpoint corrects only public registration delivery and password recovery. It does not add Stage B4, bulk onboarding, SMTP campaigns, reminders, dashboards, or participant-management features.

The corrected journeys are ready for Level 1 testing preparation. No pilot-critical application defect remains in public registration or password recovery. The staging Supabase connection pool intermittently closes long-running local verifier connections; this is recorded as staging infrastructure backlog and did not affect the completed Preview browser journeys.

## Root causes and corrections

### Registration email 429

The staging Supabase project uses the built-in email sender with a fixed two-emails-per-hour limit. The application contains one `signUp` request and no retry loop. Repeated browser testing consumed the staging project quota; the response was not caused by duplicate application requests, OTP resend behavior, or a client loop.

The safe staging correction was operational: use one unique fictional identity, submit once, and respect the staging sender interval. The registration and forgot-password forms now disable their submit controls while pending to prevent accidental double submission. Email verification was not disabled or bypassed, no hidden access path was added, and Production Auth settings were not changed.

### Invalid recovery link

Two interoperability defects were found:

1. The browser client used the implicit-flow client while the server callback expected PKCE/code exchange. Recovery fragments therefore could not establish the server session required by the reset action.
2. An exact Vercel deployment hostname could initiate registration or recovery while the configured callback used the branch alias. PKCE verifier cookies are host-scoped, so crossing hosts lost the verifier. After a valid callback, an immediate client-only user check could also race the newly written server cookie and falsely reject the session.

The correction uses the repository's Supabase SSR browser client, keeps the server code-exchange callback as the primary flow, handles legacy fragment credentials only in the browser, scrubs fragment credentials from the address bar, and fails closed for malformed/expired credentials. Public Auth callbacks now use the initiating request origin only when it matches the trusted Vercel/application allowlist. The reset page accepts a server-verified user as authoritative, eliminating the cookie-visibility race without creating a competing callback flow.

## Browser acceptance evidence

Desktop Preview verification used one unique fictional learner identity. No password, complete email address, recovery parameter, token, session value, or credential is included here.

### Public registration

- Registration form rendered and rejected a malformed email through browser validation.
- One valid submission produced the confirmation-email notice.
- The staging verification email was delivered and its link was opened.
- The account was confirmed and the learner signed in normally.
- The authenticated learner dashboard and profile loaded with the original learner details and self-reported CSO name retained.
- No open course was assigned to this open-registration learner, so the journey correctly stopped at the authenticated learner landing page. Open-course configuration remains a separate known item.

### Password recovery

- A registered fictional email produced the privacy-safe check-email response.
- The delivered recovery link established a server session and displayed a valid reset form.
- Password mismatch validation was displayed safely.
- A valid new password was accepted and produced the password-updated sign-in notice.
- The old password was rejected with the generic invalid-credentials response.
- The new password signed in to the same learner profile.
- The learner had no linked Organization record, course assignment, enrollment, or progress before reset; all remained zero after reset. The self-reported CSO profile field remained present.
- Replaying the consumed recovery link failed as invalid/expired.
- An unknown email request returned the same non-disclosing check-email response.
- A malformed/invalid reset state failed closed without exposing credentials.

### Mobile and route smoke tests

At a 390 × 844 viewport, registration, forgot password, invalid reset, sign-in, and learner pages rendered without horizontal overflow. The Preview home, registration, sign-in, forgot-password, reset-password, catalogue, HRBA overview, administrator invitation, and learner invitation-acceptance routes were checked. Unauthenticated administrator access redirected to sign-in. No creator, RDF, Build Studio, reviewer, monitoring, or community link appeared publicly. The checked browser console contained no P0/P1 warning or error.

## Automated validation

Passed:

- `npx prisma validate`
- `npx prisma generate`
- `npm run typecheck`
- production-mode `npm run build` (existing fallback-course-data warning only)
- `npm run lint`
- `git diff --check`
- P2D onboarding
- open registration
- Stage A session
- HRBA assignment boundary
- S5 sign-in
- S6 role boundaries
- S7 HRBA/Supabase compatibility
- B2 course-invitation activation
- focused Auth recovery coverage

The focused verifier covers the single-submit registration boundary, trusted callback origin, PKCE server callback, browser-only fragment exchange and URL scrubbing, server-verified reset session, invalid/expired failure, password update boundary, and preservation of assignment/progress data.

B1 and B3 connected reruns reached their existing database-unavailable branches because the staging Supabase session pool closed the local connection during the longer test. B2 passed against the same staging schema, S7 passed, and the previously accepted integrated B1–B3 browser behavior is unchanged by this Auth-only patch. Failed-run fixtures were removed. This is an environment reliability result, not a registration-contract assertion failure.

## Staging integrity

- Exactly eight migrations are applied.
- No migration or schema change was introduced.
- No seed was run.
- The staging database and Auth project only were used.
- Browser-QA and failed-verifier fictional users, organizations, cohorts, courses, invitations, assignments, enrollments, progress, and Auth users were cleaned to zero.
- Production database, Auth configuration, environment variables, aliases, and deployment state were not modified.

## Preview

- Project/scope: `esset-lab/pilot-dec-cso`
- Deployment ID: `dpl_23udQxEuimzx9R66RfqqWL68wZe6`
- Preview URL: `https://pilot-dec-4ilb0gfdz-esset-lab.vercel.app`
- Environment: Preview
- Source branch: `feature/pilot-registration-integration-checkpoint`
- Source commit: `ecd66a6`
- Production alias: none

## Files changed

- `package.json`
- `scripts/verify-auth-recovery.ts`
- `src/app/(auth)/auth/callback/route.ts`
- `src/app/(auth)/forgot-password/actions.ts`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/register/actions.ts`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/components/auth/AuthSubmitButton.tsx`
- `src/components/auth/RecoveryPasswordForm.tsx`
- `src/lib/auth/public-auth-origin.ts`
- `src/lib/auth/recovery-session.ts`
- `src/lib/open-registration-workflow.ts`
- `src/lib/supabase/client.ts`
- this report

Generated `next-env.d.ts` churn was restored and is not part of the correction. No environment file, `.vercel` metadata, temporary script, raw email/recovery link, log, screenshot, browser response, generated output, or credential is included.
