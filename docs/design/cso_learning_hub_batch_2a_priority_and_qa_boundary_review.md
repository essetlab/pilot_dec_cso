# Batch 2A Priority & QA Boundary Review

This document reviews the corrective steps taken to isolate developer QA controls, clean up the standard learner sign-in experience, and establish a secure environment boundary for the Course Player visual work in Batch 2A.

---

## 1. Environment and Verification Context

* **Current Branch**: `feature/cso-hub-revamp-foundations`
* **Latest Commit**: `2d44ab2e80c96fb952cbb7c5f01093afc2b158f5` (Batch 1F Corrective Patch)
* **Pre-requisite Status**: Establishing a local Docker/WSL database is **not required**. Visual layouts are verified using guarded database-less fallovers and local QA mock session configs.

---

## 2. QA Controls Audit & Exposure Analysis

### 2.1 Visible QA Controls Discovered
On the standard `/sign-in` page:
* Prefilled demo learner credentials did not exist on the form fields, but a **Quick Access Pilot Learner** section was rendered at the bottom of the page.
* This section listed demo learner profiles, allowing users to click a "Continue" button to bypass password inputs and sign in as a mock participant.

### 2.2 Environment Control Variables
* The visibility of these controls was tied to the `usesSupabaseSignIn` boolean, which is controlled by:
  * `NEXT_PUBLIC_SUPABASE_URL`
  * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* If these variables were missing or misconfigured in staging, pilot, or production environments, the **Quick Access Pilot Learner** section would automatically render on the public-facing sign-in page.
* Yes, the demo user emails (e.g., `participant2@demo.local`) were hard-coded in `DEMO_USERS` inside `src/lib/auth/demo-users.ts`.
* Yes, the quick-access action directly modified the authentication session cookie via the `signInDemoUser` server action.

---

## 3. Corrective Changes Made

To eliminate this security risk and restore strict fail-closed boundaries, the following modifications were implemented:

### 3.1 Standard Sign-In Page Cleanup
* Removed all visual quick access cards, user selection grids, and demo credentials lists from [page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/(auth)/sign-in/page.tsx).
* The learner sign-in page now strictly displays only the secure credentials form (email & password), standard navigation links (Create Account, Forgot Password), and assistance notes.
* There are no developer controls, prefilled values, or visual pointers directing public users to the developer sandbox.

### 3.2 Secure Developer-Only Route Isolation
* Created a dedicated, developer-only quick access route at `/local-qa/auth` in [page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/(auth)/local-qa/auth/page.tsx).
* This route is completely separated from normal learner authentication. Normal learners sign in via the standard credentials form at `/sign-in`. Local developer QA testing is isolated under `/local-qa/auth`.
* Added rigorous server-side checks to prevent unauthorized access. The route is hidden behind **five distinct fail-closed guards**:
  1. `APP_ENVIRONMENT === "local-test"` must be true.
  2. `ALLOW_LOCAL_DEMO_AUTH === "true"` must be true.
  3. `process.env.NODE_ENV !== "production"` (cannot run in production builds).
  4. The request host header (inspected using `headers()`) must resolve strictly to `localhost` or `127.0.0.1`.
  5. The database/Supabase configuration must not target staging or production project IDs (`fgyxbzwdvngqlksyxuwa` or `bhzyrthinbyqgsetnoph`).
* If any guard is violated, the page immediately returns `notFound()` (404), rendering it completely invisible.

### 3.3 Hardened Server-Side Action Validation
* Updated the `signInDemoUser` action in [actions.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/(auth)/sign-in/actions.ts) to validate the request host header against localhost/127.0.0.1.
* Modified the catch block: when the database is offline and queries fail, failover to demo credentials is **only allowed** if the request passes both `isLocalTest` and `allowDemoAuth` checks. On remote preview or staging deployments, it logs a secure technical warning and redirects to `/sign-in?error=service-unavailable`.

---

## 4. Public Pages Freeze Confirmation

* **Certificate Verification**: The public certificate-verification interface has been **frozen** and remains functionally untouched. No redesign or route modification has been conducted.
* **Course Engine Rules**: Launch URLs, SCORM/iframe configurations, completion criteria, and the 80% passing threshold are fully preserved without change.

---

## 5. Course Player Fixture Strategy

* To construct and verify the Course Player Visual Shell without running active Postgres/Docker services, we use a **guarded local demo session**:
  * When logged in via `/local-qa/auth` under local-test mode, the database-less query catch blocks in `src/lib/course-data.ts` activate the static failover for `DEMO_PROPOSAL_COURSE.slug`.
  * This returns structured course outline modules and lesson block states directly from our local test files, allowing accurate styling, mobile navigation testing, and responsive audit verification without needing a live connection.
* The isolated local QA mechanism is fully ready to support future Course Player visual testing. Course Player visual implementation itself has not yet begun.

---

## 6. Verification Results

All local verification test scripts ran and passed successfully:

```powershell
# 1. Prisma schema check passed
npm run prisma:validate
# Result: The schema at prisma\schema.prisma is valid 🚀

# 2. Strict linter passed
npm run lint
# Result: eslint . completed successfully with 0 errors or warnings

# 3. Next.js build compilation passed
npm run build
# Result: Compiled successfully in 28.9s, TypeScript checks passed

# 4. Seeding security test passed
npm run verify:seed-safety
# Result: PASS - refused remote targets, required ALLOW_DESTRUCTIVE_DEMO_SEED=true

# 5. Supabase credentials guard test passed
npm run verify:s5-signin
# Result: S5 Supabase sign-in verification passed.

# 6. Route permissions check passed
npm run verify:s6-route-roles
# Result: S6 route and role-boundary verification passed.

# 7. Batch 1F regression test passed
node --import jiti/register scripts/verify-batch-1f-functional.ts
# Result: PASS - local fallbacks isolated, remote db failures log and redirect
```

---

## 7. Visual Boundary Screenshots

The following screenshots demonstrate the visual boundaries implemented:

### Standard Sign-In Desktop Layout
Clean form with email, password, Sign In button, and support assistance only.
![Standard Sign-In Desktop](file:///d:/z%20CDP-Lg-Andy-pilot-integration/docs/design/evidence/batch-2a-priority-review/signin_desktop.png)

### Standard Sign-In Mobile Layout
Clean form adjusted to a compact mobile width (390px).
![Standard Sign-In Mobile](file:///d:/z%20CDP-Lg-Andy-pilot-integration/docs/design/evidence/batch-2a-priority-review/signin_mobile_390px.png)

### Local Developer QA Auth Sandbox (Allowed)
Guarded local credentials selector page for local-test mode on localhost.
![Guarded Local QA Auth Allowed](file:///d:/z%20CDP-Lg-Andy-pilot-integration/docs/design/evidence/batch-2a-priority-review/local_qa_auth_allowed.png)

### Local Developer QA Auth Sandbox (Denied)
404 notfound state returned when guards fail (e.g. host check or ALLOW_LOCAL_DEMO_AUTH=false).
![Guarded Local QA Auth Denied](file:///d:/z%20CDP-Lg-Andy-pilot-integration/docs/design/evidence/batch-2a-priority-review/local_qa_auth_denied.png)

> [!NOTE]
> All screenshots contain synthetic/mock demo credentials and no real passwords, tokens, credentials, learner data, or shared-environment identifiers.

