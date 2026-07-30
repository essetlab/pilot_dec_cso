# Plan - Visual Revamp & Critical Pilot-Protection Strategy

This implementation plan details the strategy for carrying out the visual and user-experience revamp of the CSO Learning Hub Phase 1 while protecting existing business logic, authentication flows, data-models, and learner progress.

---

## User Review Required

Please review the proposed strategy, especially the test-account management rules and the deployment roll-out checks.

> [!IMPORTANT]
> **No Schema Migrations or API Rewrites**: The visual revamp will be implemented entirely inside React components and CSS classes. No database schema changes, API contract alterations, or changes to core workflow controllers (e.g., certificate threshold checks) are permitted.

---

## 1. Protected-Functionality Inventory

Each critical pilot feature is mapped below to its database models, API handlers, source files, and verifying test scripts:

| Critical Feature Area | Routes Concerned | Source Code Files | API / Data Dependencies | Verifying Regression Tests |
|---|---|---|---|---|
| **Registration** | `/register`, `/register/staff` | [register/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/register/page.tsx), [register/staff/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/register/staff/page.tsx) | `User` & `Cohort` records. Supabase SignUp. | `npm run verify:s4-registration`, `npm run verify:open-registration` |
| **Email Confirmation** | `/auth/callback` | [auth/callback/route.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/auth/callback/route.ts) | Supabase Auth trigger redirects. | `npm run verify:s4-supabase-registration` |
| **Sign-in** | `/sign-in` | [sign-in/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/sign-in/page.tsx), [sign-in/actions.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/sign-in/actions.ts) | `DEMO_USERS` validation, Supabase SignIn. | `npm run verify:s5-signin` |
| **Password Recovery** | `/forgot-password`, `/reset-password` | [forgot-password/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/forgot-password/page.tsx), [reset-password/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/reset-password/page.tsx) | `RecoveryPasswordForm`. Supabase Reset. | `npm run verify:auth-recovery` |
| **Invitations** | `/course-invitations/accept` | [accept/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/course-invitations/accept/page.tsx), [CourseInvitationAcceptance.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/CourseInvitationAcceptance.tsx) | `CourseInvitation` & `Enrollment` tables. | `npm run verify:course-invitation-lifecycle`, `npm run verify:course-invitation-activation` |
| **Role-Based Guards** | Dynamic routing | [permissions.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/auth/permissions.ts), [routes.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/routes.ts), [server.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/auth/server.ts) | `UserRoleAssignment` table. | `npm run verify:s6-route-roles` |
| **Course Launch & Play**| `/learn/courses/[slug]`, `/learn/courses/[slug]/external` | [LearnerCoursePlayer.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerCoursePlayer.tsx), [ExternalCourseFrame.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/ExternalCourseFrame.tsx) | `Course`, `Lesson`, `ContentBlock` schemas. | `npm run verify:learner-course-player`, `npm run verify:learner-template-rendering` |
| **Progress & Completion**| Dynamic progress saving | [learner-actions.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/learner-actions.ts), [feedback-workflow.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/feedback-workflow.ts) | `Enrollment`, `LessonProgress` update queries. | `npm run verify:s7-hrba-supabase-compat` |
| **Assessment Scoring** | `/learn/courses/[slug]/final-test` | [LearnerFinalTest.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerFinalTest.tsx) | `Quiz`, `QuizAttempt` tables. | `npm run verify:s7-hrba-supabase-compat` |
| **80% Pass Threshold** | Auto-issuing check | [certificate-workflow.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/certificate-workflow.ts) | Check score percentage >= 80%. | `npm run verify:r22d` |
| **Certificates** | `/learn/certificates`, `/verify-certificate` | [LearnerCertificates.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerCertificates.tsx), [CertificateVerificationPage.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/CertificateVerificationPage.tsx) | `Certificate` registry. pdf-lib Canvas draw. | `npm run verify:r22d`, `npm run verify:s8-env-readiness` |
| **Admin Operations** | `/admin/*` | [admin/[[...segments]]/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28admin%29/admin/%5B%5B...segments%5D%5D/page.tsx), [AdminUsers.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/admin/AdminUsers.tsx) | User registration actions, reference updates. | `npm run verify:r22e`, `npm run verify:r22f`, `npm run verify:r23a` |

---

## 2. Safe-to-Change vs. Untouched Files

To ensure zero regression of business logic, we define the following boundaries:

### 2.1 Files that MUST NOT be edited (Untouched)
* **Domain Logics**: Entirety of [src/lib/](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib) except layout routing names if required.
* **Database Schema**: [prisma/schema.prisma](file:///d:/z%20CDP-Lg-Andy-pilot-integration/prisma/schema.prisma) and migrations.
* **API Endpoints**: Files under [src/app/api/](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/api).
* **Verify scripts**: Testing scripts in [scripts/](file:///d:/z%20CDP-Lg-Andy-pilot-integration/scripts).

### 2.2 Files that may be safely changed (Safe-to-Change)
* **Design tokens & Base classes**: [src/app/globals.css](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/globals.css).
* **UI Components**: Layout tags and classNames inside [src/components/](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components).
* **Next.js wrappers**: layouts and wrapper pages inside [src/app/](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app) (adding CSS class injections).
* **Lint settings**: [eslint.config.mjs](file:///d:/z%20CDP-Lg-Andy-pilot-integration/eslint.config.mjs).

---

## 3. Baseline Verification Protocol

Before launching any visual changes, the following checks establish the baseline sanity:

1. **Schema Check**:
   ```powershell
   npm run prisma:validate
   ```
2. **Lint & Build**:
   ```powershell
   npm run lint
   npm run build
   ```
3. **Core Workflow Verification**:
   Run validation scenarios to ensure authentication, certificates, and routes are protected:
   ```powershell
   npm run verify:s6-route-roles
   npm run verify:s5-signin
   npm run verify:r22d
   ```

---

## 4. Test-Account Strategy

To prevent visual verification from polluting active pilot participant telemetry, the following strategy will be strictly enforced:

* **Demo Accounts bypass**: Testing will use accounts seeded by `npm run db:seed`. These accounts are marked with dummy/demo statuses and do not link to real civil society organization indicators.
* **No Manual Production mutations**: No changes will be directly inserted into active PostgreSQL production databases.
* **Isolated Browser LocalStorage**: Cookie storage for Supabase sessions will be local to testing hosts.

---

## 5. Branch and Rollback Strategy

1. **Branch structure**: Revamp development will proceed in feature branches (e.g. `feature/revamp-tokens`, `feature/revamp-auth-layout`).
2. **Commit hooks**: Run `npm run lint` and `npm run typecheck` before pushing changes.
3. **Rollback plan**: If a layout change triggers a compilation failure, the branch will be rolled back to the last stable git commit.

---

## 6. Flagged Design Gaps with Functional Impact

If the client requests visual changes that require schema modifications, they are flagged here:
* **Interactive Bottom-Nav dynamic badges**: Displaying unread notifications would require database fields in the `User` or `Notification` schema, which is out of Phase 1 scope.
* **Settings parameters modification**: Configuring user privacy switches would require API updates, which are out of scope for Phase 1.
