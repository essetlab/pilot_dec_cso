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
