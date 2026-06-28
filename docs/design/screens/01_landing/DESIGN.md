# Public Landing Page — Design Specification

## 1. Screen identity

**Screen name:**  
Public Landing Page

**Route:**  
`/`

**Experience zone:**  
Public / learner-facing

**Primary users:**  
- Public visitors
- Local and grassroots CSO participants
- CSO focal persons
- DEC / WHH / CSF+ stakeholders
- Partner and donor visitors reviewing the platform

**Design status:**  
Approved golden mockup

**Approved visual reference:**  
`docs/design/screens/01_landing/screen.png`

---

## 2. Purpose

This screen introduces the CSO Learning Hub, communicates its value for local and grassroots CSOs, and directs users to explore courses or sign in.

The page must create a strong first impression that the platform is practical, credible, locally grounded, and designed for real CSO capacity-strengthening work.

It must not feel like a generic LMS, a file repository, a donor dashboard, or a technical prototype.

---

## 3. Source of visual continuity

This screen must align with:

- `docs/design/00_VISUAL_SOURCE_OF_TRUTH.md`
- `docs/design/DESIGN_SYSTEM.md`
- `docs/design/COMPONENT_LIBRARY.md`
- `docs/design/CODEX_UI_SKILL.md`
- `docs/design/VISUAL_QA_CHECKLIST.md`
- `docs/specs/phase-1-cso-learning-hub/PRODUCT_SPEC.md`
- `docs/specs/phase-1-cso-learning-hub/ROUTE_MAP.md`
- `docs/specs/phase-1-cso-learning-hub/LEARNER_TEMPLATE_SPEC.md`

Preserve the approved visual direction:

- authentic photographic hero image showing local CSO collaboration;
- dark navy hero overlay;
- editorial headline style;
- DEC blue and green brand accents;
- white card-based layout;
- practical course showcase;
- learning journey section;
- strong blue CTA panel;
- deep navy institutional footer with partner logo strip.

---

## 4. Layout structure

The landing page uses a tall, scrollable public website layout.

Top-to-bottom structure:

1. Public header
2. Hero section with photographic background
3. Practical CSO learning feature cards
4. About the platform section
5. Course library / featured Phase 1 courses
6. Learning experience section
7. CTA section
8. Deep navy footer with partner recognition

The page should feel like a real website captured from top to footer, not a 16:9 slide.

---

## 5. Component map

Codex must use or create reusable components rather than hand-coding one-off fragments.

Required component direction:

```txt
PublicShell
PublicHeader
HeroSection
FeatureCard
SectionHeader
AboutPlatformSection
CourseCard
LearningExperienceCard
CTASection
PublicFooter
PartnerLogoStrip
ActionButton
StatusBadge