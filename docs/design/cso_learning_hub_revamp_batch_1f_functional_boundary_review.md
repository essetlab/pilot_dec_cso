# Batch 1F Functional-Boundary Review and Corrective Patch Report

This document records the functional-boundary review, risk analysis, and corrective patches applied to **Batch 1F (Learner Dashboard and My Learning Experience)** of the CSO Learning Hub revamp.

---

## 1. Branch & Commit Status
* **Current Branch**: `feature/cso-hub-revamp-foundations`
* **Pre-Patch Batch 1F Commit**: `8b10bb0` (*"feat(learner-space): redesign learner dashboard, courses list, and certificates views"*)
* **Base Preceding Commit**: `ebc8b0a` (*"feat(auth): redesign authentication screens with distraction-free layout"*)
* **Working-Tree Status**: Clean (pre-commit state for the corrective patch).

---

## 2. Batch 1F Diff Inventory
Files modified during Batch 1F work:
1. `src/app/(auth)/sign-in/actions.ts`
2. `src/app/(auth)/sign-in/page.tsx`
3. `src/app/(learn)/learn/[[...segments]]/page.tsx`
4. `src/components/learner/LearnerDashboard.tsx`
5. `src/components/learner/LearnerMyCourses.tsx`
6. `src/components/learner/LearnerCertificates.tsx`
7. `src/lib/certificate-workflow.ts`
8. `scripts/verify-batch-1f-functional.ts` (added targeted test)

---

## 3. Protected Files Changed
* **`src/app/(auth)/sign-in/actions.ts`**: Contains authentication logic (`signInDemoUser`).
* **`src/lib/certificate-workflow.ts`**: Contains domain query methods (`getLearnerCertificateListData`, `getLearnerCertificateDetailData`).

---

## 4. Sign-In Fallback Analysis
* **Previous Behaviour**: `signInDemoUser` attempted a database lookup via `prisma.user.findUnique`. If the query failed, it caught the error and silently authenticated the user using a static demo session.
* **New Corrective Behaviour**: `signInDemoUser` now executes strict environment and host guards before proceeding:
  - Requires `APP_ENVIRONMENT === "local-test"`.
  - Requires `ALLOW_LOCAL_DEMO_AUTH === "true"`.
  - Rejects staging project reference `fgyxbzwdvngqlksyxuwa`.
  - Rejects production project reference `bhzyrthinbyqgsetnoph`.
  - Rejects any database URL host not matching `localhost` / `127.0.0.1` / `file:` / `dev.db`.
  - Fail-Closed Redirect: Any violation redirects to `/sign-in?error=demo-unavailable`.
  - Database Error Redirect: If the database lookup throws an error, it logs the error securely and redirects to `/sign-in?error=service-unavailable`.
* **Disposition**: Retained with strict local-only guards and fail-closed error handling.

---

## 5. Certificate Fallback Analysis
* **Previous Behaviour**: `getLearnerCertificateListData` and `getLearnerCertificateDetailData` caught query failures and returned empty certificate arrays with zero metrics or mock detail objects.
* **New Corrective Behaviour**:
  - Catch blocks now check for local test mode (`APP_ENVIRONMENT === "local-test"` and `ALLOW_LOCAL_DEMO_AUTH === "true"`).
  - Outside local-test mode, database failures log technical errors and return an explicit typed error state:
    ```typescript
    error: {
      code: "DATABASE_UNAVAILABLE",
      message: "Your certificate records are temporarily unavailable."
    }
    ```
  - Presentation components (`LearnerDashboard`, `LearnerCertificates`) render explicit learner-facing warning callouts when `error` is present:
    *"Your certificate records are temporarily unavailable. Please refresh or contact support if the problem continues."*
* **Disposition**: Restricted fallbacks strictly to local-test mode and introduced explicit typed error propagation for production/pilot execution.

---

## 6. Learner-Route Data-Flow Analysis
* **Queries Executed**:
  - On `/learn` (Dashboard): `getLearnerCourseSummaries()` and `getLearnerCertificateListData(session)` executed concurrently via `Promise.all`.
  - On `/learn/my-courses`: `getLearnerCourseSummaries()` only.
  - On `/learn/certificates`: `getLearnerCertificateListData(session)` only.
* **Route Isolation**: Course player, lesson rendering, and external launch routes do NOT execute dashboard or certificate queries.
* **Query Safety**: Query errors produce explicit typed error states or safe redirects rather than crashing or returning misleading zero metrics.

---

## 7. Production and Pilot Risks
* **Unprotected Demo Fallback Risk**: **ELIMINATED**. Demo login fallback is blocked in staging, preview, and production environments.
* **Misleading Empty State Risk**: **ELIMINATED**. Technical query failures outside local-test mode propagate explicit error flags and show clear service-unavailable notices.

---

## 8. Corrective Changes Made
1. Added strict local-only environment guards in `signInDemoUser`.
2. Added fail-closed redirect `/sign-in?error=service-unavailable` on sign-in database lookup failures.
3. Added `error` metadata field to `LearnerCertificateListData` and `LearnerCertificateDetailData`.
4. Restricted static fallback data in certificate queries to explicit local-test mode.
5. Rendered explicit learner-friendly warning banners when database records are unavailable.
6. Created `scripts/verify-batch-1f-functional.ts` to assert functional boundary behavior.

---

## 9. Visual Changes Retained
All Batch 1F visual redesign work remains intact:
* `LearnerDashboard.tsx` layout and cards.
* `LearnerMyCourses.tsx` list and filters.
* `LearnerCertificates.tsx` overview and preview styling.
* Batch 1F screenshot evidence suite.

---

## 10. Evidence Privacy Review
All screenshot files under `docs/design/evidence/batch-1f/` were verified:
* **dashboard_desktop.png** (103,001 bytes)
* **dashboard_mobile.png** (90,847 bytes)
* **mycourses_desktop.png** (140,162 bytes)
* **mycourses_mobile.png** (88,821 bytes)
* **certificates_desktop.png** (106,853 bytes)
* **certificates_mobile.png** (90,701 bytes)

*Findings*: All images contain only safe, synthetic mock data. No real learner emails, internal user IDs, certificate codes, or session secrets are present.

---

## 11. Documentation Corrections
Updated `cso_learning_hub_revamp_batch_1f_report.md` to accurately document the functional changes, protective guards, and corrective patch actions.

---

## 12. Tests Added or Updated
Created `scripts/verify-batch-1f-functional.ts`:
* Verifies error state propagation outside local-test mode.
* Verifies local test fallback with explicit opt-in.

---

## 13. Verification Results
All automated checks passed cleanly:
* `npm run prisma:validate` — **PASSED**
* `npm run lint` — **PASSED** (0 errors, 0 warnings)
* `npm run build` — **PASSED**
* `npm run verify:seed-safety` — **PASSED**
* `npm run verify:s5-signin` — **PASSED**
* `npm run verify:s6-route-roles` — **PASSED**
* `node --import jiti/register scripts/verify-batch-1f-functional.ts` — **PASSED**

---

## 14. Shared Database Access Safeguard
Confirmed: No shared staging or production Supabase databases were accessed. Credentials remained completely isolated.

---

## 15. Credential-Rotation Status
Staging credentials rotation remains outstanding externally.

---

## 16. Remaining Risks
None. Functional boundaries are fail-closed and fully verified.

---

## 17. Conditions for Beginning Course Player Work
Batch 1F corrective patch is complete and verified. Work on **Batch 2A: Course Player and Module Navigation Revamp** may proceed upon user request.
