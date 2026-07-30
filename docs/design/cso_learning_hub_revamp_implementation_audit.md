# CSO Learning Hub Revamp
## Technical, Design-System, and User-Experience Audit

---

## 1. Executive Summary

This document presents the implementation audit of the **CSO Learning Hub Phase 1** application, mapping the current codebase against the approved revamp reference document ([cso_learning_hub_revamp_refined.md](file:///d:/z%20CDP-Lg-Andy-pilot-integration/docs/design/cso_learning_hub_revamp_refined.md)).

### 1.1 Technical Architecture
The Hub is built using a modern stack:
* **Core**: [Next.js](file:///d:/z%20CDP-Lg-Andy-pilot-integration/package.json#L76) (v16.2.6) with the App Router, utilizing route groups (`(public)`, `(auth)`, `(learn)`, `(admin)`, `(creator)`) and optional catch-all route segments (`[[...segments]]`) for dynamic routing.
* **UI & Styling**: [Tailwind CSS](file:///d:/z%20CDP-Lg-Andy-pilot-integration/package.json#L94) (v4) with native `@theme` configurations declared in [globals.css](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/globals.css#L32) mapping variables to the `:root`.
* **Database & ORM**: PostgreSQL database mapped and queried via [Prisma Client](file:///d:/z%20CDP-Lg-Andy-pilot-integration/package.json#L72) (v7.8.0).
* **Authentication**: [Supabase Auth](file:///d:/z%20CDP-Lg-Andy-pilot-integration/package.json#L73) via `@supabase/ssr` with cookie-based session management, and a local mock bypass for quick-access demo workflows in local QA modes.
* **Services**: [Nodemailer](file:///d:/z%20CDP-Lg-Andy-pilot-integration/package.json#L77) for email delivery, and [pdf-lib](file:///d:/z%20CDP-Lg-Andy-pilot-integration/package.json#L78) for client-side/server-side certificate generation.

### 1.2 Key Audit Findings
* **Homepage Overload**: The homepage has 13 narrative sections, causing competing priorities. The revamp plans to condense this to 9 sections with a focused narrative flow.
* **Authentication Layout Deficit**: Currently, sign-in and registration pages render inside the generic [PublicShell](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/shell/PublicShell.tsx#L170), carrying full headers, footers, and logo lists. This creates visual clutter. A dedicated, clean, two-column layout is needed.
* **Design Token Gaps**: Mapped colors like soft teal (`#0F8F8C`) and pale mint backgrounds (`#EAF7EF`/`#F3FBF4`) are missing from the `@theme` configuration. Card border-radii (`24px` for cards) are larger than the recommended `14px-20px`. The typography displays a serif-serif font discrepancy (heading font is Georgia, but display sizes are not standardized).
* **Card Metadata Density**: Catalogue cards display redundant capacity-alignment tags, creating scanning noise. Coming-soon cards look disabled and broken, preventing overview lookups.

### 1.3 Critical Regression Risks
The revamp changes only the presentation/UX layer. The following functions must remain intact:
* Supabase auth flow and token validation middleware.
* Prisma relations, database schema constraints, and course enrollment counters.
* The mandatory **80% certificate threshold** and PDF certificate signature validation.
* Staff onboarding invitations and Admin reference data structures.

---

## 2. Technical Stack and Architecture Analysis

The CSO Learning Hub's current technical stack consists of:

| Layer | Technology | File Location / Configuration | Notes |
|---|---|---|---|
| **Framework** | Next.js 16.2.6 & React 19.2.6 | [package.json](file:///d:/z%20CDP-Lg-Andy-pilot-integration/package.json#L76-L81) | Using React Server Components (RSC) and Client Components with dynamic segments. |
| **Routing** | Next.js App Router | [src/app/](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app) | Categorised into route groups: `(public)`, `(auth)`, `(learn)`, `(admin)`, and `(creator)`. |
| **Styling** | Tailwind CSS v4 | [src/app/globals.css](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/globals.css#L1) | Configuration is handled in CSS variables under the `@theme` directive, avoiding a configuration file. |
| **Database ORM** | Prisma 7.8.0 | [prisma/schema.prisma](file:///d:/z%20CDP-Lg-Andy-pilot-integration/prisma/schema.prisma) | SQLite used for local staging / PostgreSQL used for deploy target. |
| **Authentication** | Supabase Auth + SSR | [src/lib/auth/](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/auth) | Cookie-based session sync, client-side Supabase authentication listener, role checks on RSC fetch boundaries. |
| **PDF Generation** | pdf-lib | [src/lib/certificate-pdf.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/certificate-pdf.ts) | Dynamic PDF mapping with canvas template configurations. |
| **Email Service** | Nodemailer | [src/lib/email.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/email.ts) | Custom SMTP mail client config for verification links. |

### 2.1 Dynamic Segment Routing Mechanism
The repository uses catch-all dynamic routes (`[[...segments]]`) for several critical sections:
1. **Courses (Public)**: [courses/[[...segments]]/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/courses/%5B%5B...segments%5D%5D/page.tsx) splits routes based on params length. `segments.length === 0` renders the course catalogue, while `segments.length === 1` renders the course details.
2. **Learner Section**: [learn/[[...segments]]/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28learn%29/learn/%5B%5B...segments%5D%5D/page.tsx) acts as a front controller routing to the learner dashboard (`/learn`), active courses (`/learn/courses/[slug]`), certificate grids (`/learn/certificates`), final tests (`/learn/courses/[slug]/final-test`), and feedback forms.
3. **Creator Section**: [creator/[[...segments]]/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28creator%29/creator/%5B%5B...segments%5D%5D/page.tsx) controls the course authoring workflows, including setups, outcomes, resources, the Build Studio (`/creator/courses/[id]/build`), quiz setup, and previews.
4. **Admin Section**: [admin/[[...segments]]/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28admin%29/admin/%5B%5B...segments%5D%5D/page.tsx) handles dashboards, user registries, invitations, organization details, cohort settings, certificate tables, monitoring panels, settings, and logs.

---

## 3. Comprehensive Route and Component Inventory

Below is the directory mapping for all public, authentication, learner, creator, and administrator routes.

### 3.1 Public and Authentication Routes

| Route Path | Source File Location | Primary Component | Purpose |
|---|---|---|---|
| `/` | [src/app/(public)/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/page.tsx) | [LandingPage](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/LandingPage.tsx) | Public home page with value proposition, access journey steps, and featured courses. |
| `/courses` | [courses/[[...segments]]/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/courses/%5B%5B...segments%5D%5D/page.tsx) | [CataloguePage](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/CataloguePage.tsx) | Browse public available and upcoming courses. |
| `/courses/[slug]` | [courses/[[...segments]]/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/courses/%5B%5B...segments%5D%5D/page.tsx) | [CourseDetailPage](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/CourseDetailPage.tsx) | View course parameters, modules outline, outcomes, and access buttons. |
| `/support` | [src/app/(public)/support/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/support/page.tsx) | [TrustPage](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/TrustPage.tsx) | FAQs on account setup, credentials, and course play. |
| `/verify-certificate` | [src/app/(public)/verify-certificate/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/verify-certificate/page.tsx) | [CertificateVerificationPage](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/CertificateVerificationPage.tsx) | Search and verify public certificates by serial code. |
| `/course-invitations/accept` | [course-invitations/accept/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/course-invitations/accept/page.tsx) | [CourseInvitationAcceptance](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/CourseInvitationAcceptance.tsx) | Link cohort/individual invitation templates. |
| `/sign-in` | [src/app/(auth)/sign-in/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/sign-in/page.tsx) | (Inline Component) | Sign in with email and password, or choose a quick-access demo learner. |
| `/register` | [src/app/(auth)/register/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/register/page.tsx) | (Inline Component) | Self-register as a participant. |
| `/forgot-password` | [forgot-password/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/forgot-password/page.tsx) | [RecoveryPasswordForm](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/auth/RecoveryPasswordForm.tsx) | Initiate email recovery sequence. |
| `/reset-password` | [reset-password/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/reset-password/page.tsx) | (Inline Component) | Set a new password post-recovery confirmation. |

### 3.2 Learner Dashboard & Course Routes

All learner paths are mapped under [src/app/(learn)/learn/[[...segments]]/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28learn%29/learn/%5B%5B...segments%5D%5D/page.tsx):

| Target Path | Controller segment check | Primary Rendering Component | Purpose |
|---|---|---|---|
| `/learn` | `actualRoute === "/learn"` | [LearnerDashboard](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerDashboard.tsx) | Welcome banner, primary course continuation widget, metrics, and shortcuts. |
| `/learn/my-courses` | `actualRoute === "/learn/my-courses"` | [LearnerMyCourses](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerMyCourses.tsx) | List of enrolled, completed, and assigned courses. |
| `/learn/certificates` | `actualRoute === "/learn/certificates"` | [LearnerCertificates](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerCertificates.tsx) | List certificates (active, locked, or processing). |
| `/learn/certificates/[id]` | `segments.length === 2 && segments[0] === "certificates"` | [LearnerCertificateDetail](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerCertificates.tsx) | Dynamic viewer for specific certificates. |
| `/learn/profile` | `actualRoute === "/learn/profile"` | [LearnerProfile](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerProfile.tsx) | Manage user profiles and preferences. |
| `/learn/courses/[slug]` | `segments.length === 2 && segments[0] === "courses"` | [LearnerTemplateRenderer](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerTemplateRenderer.tsx) | Renders course content blocks inside the course player. |
| `/learn/courses/[slug]/final-test`| `segments.length === 3 && segments[2] === "final-test"` | [LearnerFinalTest](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerFinalTest.tsx) | High-stakes quiz block. Requires 80% passing score. |
| `/learn/courses/[slug]/feedback` | `segments.length === 3 && segments[2] === "feedback"` | [LearnerCourseFeedback](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerCourseFeedback.tsx) | Submit pilot course comments. |

---

## 4. Requirement Mapping and Gap Analysis

This section maps the current implementation against the Approved Design System Revamp guidelines:

### 4.1 Visual and Usability Gaps
1. **Homepage Spacing & Information overload**: The current home page includes program context, access cards, and future path markers. These sections clutter the page. The revamp document requires reducing this to a clear 6-point message flow over 9 sections.
2. **"Coming soon" Cards styling**: Currently, coming-soon cards resemble broken/disabled controls. They must be redesigned with clean visual states and active secondary actions such as "View overview".
3. **Card Content density**: Present card iterations show secondary capacity areas, clocks, formatting, and certificates at equal priority. This creates a dense grid. Cards must be simplified.
4. **Primary vs. Secondary Action weights**: Primary actions (e.g. "Create account") and secondary actions (e.g. "Recover password") lack clear visual hierarchy. Only one primary button should dominate a page.

### 4.2 Missing Components or Interface States
* **Dedicated Authentication Layout**: Registration and login screens currently load inside the default public wrapper ([PublicShell](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/shell/PublicShell.tsx#L170)), rendering a large navigation bar and footer. This creates a distraction.
* **Design Token Configuration Gaps**: The CSS variables `--color-soft-teal` (`#0F8F8C`) and `--color-pale-mint` (`#EAF7EF`/`#F3FBF4`) are missing from the Tailwind [globals.css](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/globals.css#L32) theme, meaning colors cannot be consistently applied.
* **Typography Discrepancy**: Headings currently default to serif stacks, but display sizes are not standardized, causing visual inconsistency between templates.
* **Support Accordions**: The [Support](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/support/page.tsx) page currently renders a static list of questions. A task-based accordion is needed.

---

## 5. Functions to Protect (Regression Safeguards)

The following logic and features must not be modified or broken during the visual revamp:

### 5.1 Account Registration & Authentication
* **Supabase Session Syncing**: Hook listener configurations inside [src/lib/auth/server.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/auth/server.ts) and client actions must remain unchanged to prevent access regression.
* **Invitation Activation Workflows**: Database queries matching invitation hash profiles to organization-level cohorts ([src/lib/course-invitation-workflow.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/course-invitation-workflow.ts)) must not be altered.
* **Staff Onboarding Guards**: Strict domain validation rules for staff registers inside [src/app/(auth)/register/staff/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/register/staff/page.tsx) must be protected.

### 5.2 Course Progress and Certificates
* **The 80% Threshold**: The rule that certificates are issued only when final assessment scores are $\ge 80\%$ ([src/lib/certificate-workflow.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/certificate-workflow.ts)) must be preserved.
* **Progress Tracking Boundaries**: The logic tracking completed, in-progress, and locked statuses for course modules must not be changed.
* **PDF Verification Serialization**: Canvas verification signatures generated by `pdf-lib` must remain valid for the serial checker.

### 5.3 Administrative Operations
* **Audit Event Logging**: Actions like status updates or role changes must continue to write events to the audit log tables.
* **Reference Data Structures**: Category keys and status configurations in [src/lib/reference-data-workflow.ts](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/lib/reference-data-workflow.ts) must be preserved.

---

## 6. Visual System Audit

An audit of the visual system reveals the following configuration:

* **Hex Codes & Colors**:
  - Deep navy: `#0F172A` (matches current `--color-deep-navy`).
  - DEC blue: `#3B99D4` (matches current `--color-dec-blue`).
  - Fresh green: `#91C852` (matches current `--color-dec-green`).
  - **Missing**: Soft teal (`#0F8F8C`) and pale mint backgrounds (`#EAF7EF` / `#F3FBF4`) are missing.
* **Typography**:
  - Heading font is Georgia (serif) / body font is Inter (sans-serif). Display size weights are not standardized.
* **Card Radius**:
  - The current border-radius is set to `24px`. This is larger than the recommended `14px-20px`, causing visual distortion on smaller cards.
* **Form controls**:
  - Lacks consistent focus indicators. Focus rings in [globals.css](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/globals.css#L80) default to `--color-primary` (`#075e8e`) instead of the brand's DEC Blue.

---

## 7. Recommended Component Architecture

To implement the revamp cleanly and avoid code duplication, we recommend the following components:

```txt
src/components/
├── ui/
│   ├── ActionButton.tsx (Refine: Standardise primary/secondary/ghost weights)
│   ├── StatusBadge.tsx  (Refine: Standardise statuses: in-progress, completed, etc.)
│   ├── Accordion.tsx    (NEW: Generic accordion for support FAQs)
│   └── FormInput.tsx    (NEW: Unified input validation controls)
├── shell/
│   ├── PublicShell.tsx  (Refine: Remove partner logo list from top navigation)
│   ├── LearnerShell.tsx (Refine: Clean up authenticated navigation items)
│   └── AuthLayout.tsx   (NEW: Two-column focused landing wrapper for sign-in/register)
├── course/
│   ├── CourseCard.tsx   (Refine: Clean up metadata grid, styling for coming-soon cards)
│   ├── StickyPanel.tsx  (NEW: Desktop sticky panel, mobile bottom action bar)
│   └── JourneyMap.tsx   (NEW: Visual roadmap showing completion nodes)
└── admin/
    └── FilterBlock.tsx  (NEW: Standardised filters, search, and reset buttons)
```

---

## 8. Proposed Phased Implementation Sequence

The implementation is broken down into a 10-phase sequence to allow for safe testing and rollbacks.

### Phase 1: Design Tokens & Variables
* **Files Changed**: [src/app/globals.css](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/globals.css)
* **New Components**: None.
* **Risks**: Style breaks on existing pages if CSS variables are modified incorrectly.
* **Required Tests**: Run `npm run build` and check for styling errors.
* **Dependencies**: None.
* **Completion Criteria**: Soft teal, pale mint, and brand colors are declared under `@theme`, and card radii are set to `16px`.

### Phase 2: Shell Layouts & Nav
* **Files Changed**:
  - [src/components/shell/PublicShell.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/shell/PublicShell.tsx)
  - [src/components/shell/LearnerShell.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/shell/LearnerShell.tsx)
  - [src/app/(auth)/layout.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/layout.tsx)
* **New Components**: `AuthLayout.tsx` (focused auth page wrapper).
* **Risks**: Layout breaks on public pages.
* **Required Tests**: Verify navigation links in different layouts.
* **Dependencies**: Logo assets in the public folder.
* **Completion Criteria**: Auth page layouts use the new simplified wrapper. Partner logos are moved out of the main header.

### Phase 3: Landing Page Redesign
* **Files Changed**: [src/components/public/LandingPage.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/LandingPage.tsx)
* **New Components**: `FeatureGrid.tsx`
* **Risks**: Broken page sections, copy errors.
* **Required Tests**: Manual layout verification at multiple viewports.
* **Dependencies**: Approved imagery.
* **Completion Criteria**: Homepage condensed to the approved 9-section story.

### Phase 4: Course Catalogue Update
* **Files Changed**:
  - [src/components/public/CataloguePage.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/CataloguePage.tsx)
  - [src/components/ui/StatusBadge.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/ui/StatusBadge.tsx)
* **New Components**: `ComingSoonCard.tsx`
* **Risks**: Filter logic regression.
* **Required Tests**: Verify filters on available vs. coming-soon courses.
* **Dependencies**: Course metadata from the database.
* **Completion Criteria**: simplified catalogue cards with consistent visual treatment for coming-soon courses.

### Phase 5: Course Detail Layouts
* **Files Changed**: [src/components/public/CourseDetailPage.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/CourseDetailPage.tsx)
* **New Components**: `StickyActionPanel.tsx`, `JourneyMap.tsx`
* **Risks**: Broken action triggers.
* **Required Tests**: Verify enrollment trigger flow for active users.
* **Dependencies**: Approved course outcomes structure.
* **Completion Criteria**: Content restructured around learner decisions, featuring a sticky enrolment card.

### Phase 6: Auth Screen Redesign
* **Files Changed**:
  - [src/app/(auth)/sign-in/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/sign-in/page.tsx)
  - [src/app/(auth)/register/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28auth%29/register/page.tsx)
* **New Components**: `FormInput.tsx` (with inline error states).
* **Risks**: Broken sign-in/registration inputs.
* **Required Tests**: Run `npm run verify:s4-registration` and `npm run verify:s5-signin`.
* **Dependencies**: Supabase connection keys.
* **Completion Criteria**: Form validation and inputs conform to the new design system.

### Phase 7: Learner Dashboard
* **Files Changed**: [src/components/learner/LearnerDashboard.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/learner/LearnerDashboard.tsx)
* **New Components**: `ContinueLearningBanner.tsx`
* **Risks**: Displaying incorrect progress.
* **Required Tests**: Run `npm run verify:s7-hrba-supabase-compat`.
* **Dependencies**: Database progress records.
* **Completion Criteria**: Dashboard displays the "Continue Learning" widget prominently.

### Phase 8: Certificates & Support
* **Files Changed**:
  - [src/components/public/CertificateVerificationPage.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/public/CertificateVerificationPage.tsx)
  - [src/app/(public)/support/page.tsx](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/%28public%29/support/page.tsx)
* **New Components**: `Accordion.tsx`
* **Risks**: Certificate search returns errors.
* **Required Tests**: Run `npm run verify:r22d` and `npm run verify:s8-env-readiness`.
* **Dependencies**: Serial code indexes.
* **Completion Criteria**: support page uses accordions, and certificate verification results render on a structured card.

### Phase 9: Admin Interface
* **Files Changed**: [src/components/admin/](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/components/admin)
* **New Components**: `AdminTable.tsx`
* **Risks**: Access boundary leaks.
* **Required Tests**: Run `npm run verify:s6-route-roles`.
* **Dependencies**: Database reference tables.
* **Completion Criteria**: admin pages share the design system using a Deep Navy sidebar template.

### Phase 10: Accessibility & QA
* **Files Changed**: Style overrides in [globals.css](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/globals.css).
* **New Components**: None.
* **Risks**: Styling overrides break existing views.
* **Required Tests**:
  - Check colors against WCAG AA standards.
  - Test keyboard navigation on forms.
  - Test responsive viewports down to 360px.
* **Dependencies**: Visual QA checklist.
* **Completion Criteria**: WCAG 2.2 AA compliant. No horizontal overflow on mobile viewports.

---

## 9. Blockers and Required Assets

1. **Ethiopian Context Imagery**: The approved revamp plan requires photos showing Ethiopian civil-society practitioners collaborating. The repository currently has only one image: `cso-planning-hero.png`. If more context images are needed, placeholders must be generated or provided by the client.
2. **Settings Constraints**: The administrator settings panel is currently a static overview. Modifying this panel is blocked by backend limitations and is out of scope for Phase 1.

---

## 10. First Recommended Implementation Batch

The first implementation batch should establish the design system basics and navigation layout before modifying content pages:

### Batch 1 Focus: Design System Foundations & Auth Layout
1. **Declare Theme Tokens**: Inject color tokens and styling variables into [globals.css](file:///d:/z%20CDP-Lg-Andy-pilot-integration/src/app/globals.css) (Phase 1).
2. **Dedicated Auth Layout**: Build the new `AuthLayout` wrapper to isolate sign-in and registration pages from public shell headers and footers (Phase 2).
3. **Public Navigation Update**: Remove partner logos from the header and format a consistent brand logo container.

This batch is highly contained, affects no database schema flows, and can be verified across all devices before proceeding to the homepage revamp.
