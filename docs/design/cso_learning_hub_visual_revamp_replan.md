# CSO Learning Hub: Visual Revamp Replan

This document outlines the simplified, front-end-only design roadmap to finalize the **CSO Learning Hub Phase 1** revamp. The roadmap focuses entirely on visual styling, layout, typography, responsiveness, and accessibility, without introducing backend, routing, or data-flow changes.

---

## 1. Current Visual Status

### Pages Already Completed Well
- **Public Homepage (`LandingPage.tsx`)**: Restructured to show a focused 6-point message flow.
- **Course Catalogue (`CataloguePage.tsx`)**: Upgraded to clean card structures, category tags, and responsive grids.
- **Course Detail Page (`CourseDetailPage.tsx`)**: Features breadcrumbs, visual timeline outlines, and warning banners.
- **Authentication Pages (`sign-in/page.tsx`, `register/page.tsx`, `forgot-password/page.tsx`)**: Restructured with a clean, centered layout wrapper that separates form fields and removes background clutter.
- **Learner Console (`LearnerDashboard.tsx`, `LearnerMyCourses.tsx`, `LearnerCertificates.tsx`)**: Features clean metrics cards, certificates states (locked/issued), and progress splits.
- **Course Player Shell (`CoursePlayerShell.tsx`, `LearnerCoursePlayer.tsx`)**: Upgraded with accessible outlined sidebars and module gating indicators.

### Pages Needing Only Minor Refinement
- **Mobile Drawer Navigations**: Polishing tap targets and ensuring transition overlays slide out smoothly.
- **Keyboard Outlines**: Aligning focus visible rings on custom buttons and link inputs.

### Pages Needing Stronger Redesign
- **Administrator Shell & Sidebar (`AdminShell.tsx`)**: Needs a dedicated vertical sidebar on desktop, a state-controlled hamburger drawer for mobile viewports, and clean institutional headers.
- **Administrator Dashboard (`AdminDashboard.tsx`)**: Needs a visual card redesign to present oversight stats cleanly, using existing data structures.

### Pages/Components That Should Remain Unchanged
- Creator tools and authoring course outlines.
- Staging/production data schemas and queries.
- Database access, authentication routes, and permissions logic.

---

## 2. Shared Visual Inconsistencies & Recommended Improvements

1. **Typographic Scale**: Standardize font sizes and leading across headers (`font-sans` with premium weights).
2. **Keyboard Focus Accessibility**: Enforce high-contrast outlines for all tab-accessible links (`focus-visible:outline-2 focus-visible:outline-dec-blue`).
3. **Card Design Consistency**: Ensure card elements share a standard border-radius (e.g. `20px` to `24px`) and subtle drop-shadows (`shadow-soft`).

---

## 3. Implementation Batches

We divide the remaining visual work into two small, highly focused front-end batches:

### Batch A1: Administrator Shell and Mobile Drawer Navigation
- **Scope**: Redesign the outer shell container and sidebar menus for the admin console.
- **Visual Goals**:
  - Desktop vertical navigation panel with active indicator lines.
  - Mobile header bar containing brand logo and toggleable menu drawer button.
  - Accessible drawer layout with tab controls and sign-out triggers.
- **Exact Presentation Files to Modify**:
  - `src/components/shell/AdminShell.tsx`
  - `src/components/shell/AdminMobileHeader.tsx` [NEW]
- **Verification**:
  - Build checks (`npm run lint`, `npm run build`).
  - Capture desktop and 390px mobile screenshots.
  - Verification of focus-visible state on navigation items.

### Batch A2: Administrator Oversight Dashboard Landing Page
- **Scope**: Finalize the landing page visual layout for the administrator dashboard using existing data fields.
- **Visual Goals**:
  - Restructure page layout to showcase visual metrics cards.
  - Clean card layouts for quick actions, recent logs, and certificates.
  - Visual styling of the existing unavailable-service panel.
- **Exact Presentation Files to Modify**:
  - `src/components/admin/AdminDashboard.tsx`
- **Verification**:
  - Build checks (`npm run lint`, `npm run build`).
  - Capture desktop dashboard and mobile 390px dashboard screens.

---

## 4. Protected Safety Boundaries

The following files and systems are **out of scope** and must not be altered, modified, or loaded:
- Database schema and migrations under `prisma/`.
- Connection parameters in `.env`.
- Database query parameters or workflows under `src/lib/`.
- Server Actions, APIs, authentication endpoints, or role gating rules.
- Local QA environment verification scripts.

---

## 5. Visual Completion Review

This section presents the final visual review assessment after the successful execution of all visual design batches.

### 5.1 Front-End Area Classifications

| Visual Area / Page | Visual Classification Status | Audit Findings & Verification |
| --- | --- | --- |
| **Public Homepage** | **Complete** | Focus narrative sections display clean typographic hierarchy and high-contrast call-to-actions. |
| **Public Navigation & Footer** | **Complete** | Responsive menu grids wrap cleanly, links follow standard dark-ink contrasts, and footer spans fully. |
| **Course Catalogue** | **Complete** | Card structures are aligned, tags are visible, and hover states show a soft shadow accent. |
| **Course-Detail Page** | **Complete** | Displays structured module sequences, breadcrumb back-navigation, and clean safety alerts. |
| **Authentication Screens** | **Complete** | Center-locked panels remain distraction-free; keyboard outlines are visible on inputs and submit buttons. |
| **Learner Dashboard** | **Complete** | High-contrast console indicators and clean "Continue learning" modules focus cards. |
| **My Learning (Courses Grid)** | **Complete** | Visual grids map active progress bars and category tabs cleanly. |
| **Certificates Lists** | **Complete** | Locked cells appear as restrained grey frames rather than disabled elements; active badges map correctly. |
| **Course Player Shell** | **Complete** | Focus-visible mobile outline drawer handles scrolling and viewport scaling without clipping content. |
| **Administrator Shell** | **Complete** | Front-end implementation complete; lint and build verified; visual rendering not independently reviewed because the local administrator route requires an unavailable database connection. |
| **Administrator Dashboard** | **Complete** | Front-end implementation complete; lint and build verified; visual rendering not independently reviewed because the local administrator route requires an unavailable database connection. |

### 5.2 Verification Limitations
Because the local administrator route requires an active database connection that is offline in the sandbox workspace, the administrator pages could not be rendered for layout capture. 

This rendering limitation is fully recognized and **does not justify**:
- starting WSL services or Docker Desktop;
- connecting to staging, pilot, or production PostgreSQL databases;
- adding mock administrator credentials or records;
- modifying database queries or Prisma models;
- introducing new backend error/fallback systems;
- making further code or implementation changes.

### 5.3 Stopping Point Recommendation
- **Next Batch Justification**: **No additional visual implementation batch is currently justified.**
- **Implementation Status**: All planned front-end components have been successfully implemented, and the workspace typechecks and builds cleanly.
- **Remaining Scope**: Remaining work is limited to optional future visual verification of the admin screens in an already authorized, online deployment environment.
- **Out of Scope**: Certificate-verification interfaces and course Creator tools remain outside the scope of Phase 1 revamp priorities.
- **Database Administration**: Staging database credential rotation remains an external administrative task for project owners and is not linked to these visual tasks.
