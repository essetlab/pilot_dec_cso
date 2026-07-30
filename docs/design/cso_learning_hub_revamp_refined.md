# CSO Learning Hub Revamp
## Final Design, User Experience and Implementation Reference


## Purpose and use of this document

This document is the consolidated reference for redesigning and implementing the CSO Learning Hub. It combines the assessment of the existing platform with the strongest relevant ideas from three Stitch redesign concepts, while rejecting generic commercial-LMS patterns, fabricated content and visual treatments that do not fit DEC or locally led civil society learning.

It should guide:

- information architecture and page hierarchy;
- visual and interaction design;
- frontend component development;
- responsive and low-bandwidth implementation;
- accessibility quality assurance;
- functional regression testing;
- stakeholder review and final approval.

The revamp is not a backend rebuild. It is a design-system, content-presentation and user-experience transformation that must preserve all approved functionality and learner records.

---

## Executive design decision

The preferred direction is a **refined editorial-institutional digital learning platform**: visually confident enough for publication and stakeholder presentation, but calm, practical and accessible enough for everyday use by local and grassroots CSO learners.

The final experience should combine:

- the institutional restraint and clear hierarchy seen in the strongest desktop concept;
- the image-led course presentation and visual warmth seen in the more expressive concept;
- the focused mobile forms, compact course lists and “Continue Learning” dashboard priority seen in the mobile concept;
- the established DEC visual system and the actual content, user journeys and functionality of the live Hub.

No single Stitch version should be copied as a whole.

---

# 1. Overall assessment

The existing **CSO Learning Hub** already has a credible functional and content foundation. It provides a public landing page, course catalogue, course-detail pages, registration, sign-in, password recovery, learner access, certificate verification, support guidance and institutional acknowledgements. It also communicates important principles such as individual learner accounts, safe use of information, mobile access, practical learning and certificate eligibility. ([pilot-dec-cso.vercel.app][1])

The central challenge is therefore **not to rebuild the platform or rewrite its approved content**. It is to transform the current functional pilot interface into a coherent, polished and recognisable digital learning environment.

The revamp should move the Hub from:

> A technically functional website containing learning information

to:

> A distinctive, trusted and highly usable digital learning platform that visibly represents DEC, locally led civil society learning and professional capacity development.

The redesign must preserve all existing routes, authentication logic, access permissions, learner records, progress tracking, certificate functions, course links and administrator processes.

---

# 2. Strategic design direction

## 2.1 Desired identity

The Hub should feel:

* professional but not corporate;
* modern but not technology-centred;
* locally grounded but not visually stereotyped;
* welcoming but not informal;
* institutional but not bureaucratic;
* practical, trustworthy and learner-centred;
* suitable for publication, donor review, pilot presentation and long-term programme use.

It should not resemble:

* a generic commercial learning-management system;
* a development-project brochure;
* a government portal;
* a university website;
* a startup landing page;
* a collection of unrelated cards;
* a website generated from a standard template.

The strongest identity would be a **contemporary Ethiopian civil-society learning platform**, combining:

1. DEC’s established visual system;
2. dignified Ethiopian-context imagery;
3. practical learning metaphors;
4. strong information hierarchy;
5. consistent learning and progress components;
6. accessible, low-bandwidth-conscious interaction design.

---

# 3. Analysis of the current experience

## 3.1 What already works well

### Clear purpose

The opening proposition clearly identifies the audience and practical learning purpose: local and grassroots CSOs in Ethiopia, realistic cases, guided practice and adaptable tools. ([pilot-dec-cso.vercel.app][1])

### Transparent access model

The Hub explains that users can browse publicly, register individually, use invitations where required and retain personal progress, assessment and certificate records. This is an important trust feature and should remain prominent. ([pilot-dec-cso.vercel.app][1])

### Practical learning framing

The current “Analyse, Decide, Create, Adapt” and “Learn, Practise, Apply” structures provide a strong conceptual basis for the visual design. ([pilot-dec-cso.vercel.app][1])

### Appropriate safeguarding language

The platform repeatedly advises learners not to enter names, survivor information, confidential records or sensitive organisational data. This is valuable and should be converted into clear, calm and reusable safety components rather than repeated as long paragraphs. ([pilot-dec-cso.vercel.app][1])

### Useful catalogue structure

The catalogue already distinguishes available and forthcoming learning and presents nine confirmed course areas. ([pilot-dec-cso.vercel.app][2])

### Essential learner pathways exist

Registration collects relevant profile details, including name, email, organisation, role, region and preferred language. Sign-in, support and certificate verification also have dedicated pages. ([pilot-dec-cso.vercel.app][3])

---

## 3.2 Main design and experience weaknesses

## A. The homepage is too long and carries too many messages at equal priority

The current homepage includes programme context, organisational constraints, practical value, six access steps, the learning approach, featured courses, outputs, organisational practice, future platform directions, pilot status, accessibility guidance and a final call to action. ([pilot-dec-cso.vercel.app][1])

Most of this content is useful, but it is competing for attention. The result is likely to feel more like a full programme information document placed on a webpage than a guided digital entry experience.

### Recommended response

Reduce the homepage to a clear story:

1. What the Hub is.
2. Who it supports.
3. What learning is available.
4. How learning works.
5. Why learners can trust it.
6. What action to take next.

Secondary institutional and explanatory material should move to dedicated pages, expandable sections or concise supporting cards.

---

## B. The site needs stronger visual prioritisation

A learner should immediately recognise:

* the main action;
* the available course;
* whether they should register or sign in;
* how to continue an existing course;
* what “coming soon” means;
* where to seek help.

At present, many concepts and actions appear to receive similar visual emphasis.

### Recommended response

Establish three clear action levels:

**Primary actions**

* Start learning
* Continue learning
* Create account
* Resume course

**Secondary actions**

* Explore courses
* View course details
* Recover password
* Verify certificate

**Supporting actions**

* Read accessibility guidance
* View privacy or terms
* Understand programme context
* Learn about future platform phases

Only one primary action should dominate each screen.

---

## C. The course catalogue is information-rich but visually dense

The catalogue presents nine courses with capacity alignment, secondary thematic links, format, duration, status and course actions. ([pilot-dec-cso.vercel.app][2])

This is valuable programme information, but showing all metadata directly on each catalogue card risks making the cards long, repetitive and difficult to scan.

### Recommended response

Each catalogue card should display only:

* course thumbnail;
* capacity-area label;
* course title;
* one-line description;
* availability status;
* duration or “to be confirmed”;
* certificate status where relevant;
* one clear action.

Secondary alignment information should appear on the course-detail page or inside an expandable “Course information” area.

---

## D. The available and forthcoming courses need more visible differentiation

The site correctly labels the HRBA course as available and other courses as coming soon. ([pilot-dec-cso.vercel.app][2])

However, status must be expressed through more than text or colour.

### Recommended response

Use differentiated card behaviour:

**Available course**

* stronger image treatment;
* prominent “Available now” status;
* active primary button;
* duration and certificate indicator;
* subtle elevation or feature border.

**Coming-soon course**

* quieter visual treatment;
* clear “Coming soon” label;
* “View overview” rather than “Start”;
* no disabled button that appears broken;
* optional “Planned course” explanatory tooltip.

---

## E. Course-detail pages contain duplication and weak grouping

The HRBA course page repeats the same description and uses several short sections that could be consolidated. ([pilot-dec-cso.vercel.app][4])

The current structure also presents the course as a single “Interactive HRBA course” module, although the learner experience contains a much richer five-module journey and final assessment.

### Recommended response

Reconstruct the page around learner decisions:

1. Hero and Start/Continue action.
2. At-a-glance course facts.
3. What the course helps learners do.
4. Visual module journey.
5. Learning approach.
6. Practical outputs.
7. Assessment and certificate.
8. Safe participation.
9. Support.
10. Final Start/Continue action.

Display the real structure:

* Module 1: Starting the Journey
* Module 2: HRBA Foundations
* Module 3: HRBA in Project Design
* Module 4: HRBA in Implementation
* Module 5: HRBA in MEAL
* Final Assessment and Certificate

---

## F. Account pages require a more supportive and focused experience

The sign-in and registration pages are functionally clear, but currently include extensive surrounding explanatory and footer content. ([pilot-dec-cso.vercel.app][3])

Authentication screens should reduce distraction and increase confidence.

### Recommended response

Use a dedicated authentication layout:

* compact Hub identity panel;
* focused form card;
* short explanation of what happens next;
* visible password requirements;
* show/hide-password controls;
* inline validation;
* calm success and error messages;
* direct support link;
* an alternative action such as “Already registered? Sign in.”

On desktop, use a two-column composition. On mobile, stack the form first.

---

## G. Support information is currently correct but too static

The support page explains account access, course launch, certificate verification and safe participation. ([pilot-dec-cso.vercel.app][5])

The information should become easier to diagnose and use.

### Recommended response

Rebuild support around task-based categories:

* Registration and email confirmation
* Sign-in and password recovery
* Opening a course
* Progress not updating
* Assessment and certificate
* Mobile or connection problems
* Contacting programme support
* Safe information use

Use accordions, step-by-step answers and a prominent escalation card.

---

## H. Certificate verification needs a stronger trust design

The certificate-verification page currently consists mainly of a title, code field and explanatory message. ([pilot-dec-cso.vercel.app][6])

### Recommended response

Present it as an official verification service:

* certificate icon or restrained document illustration;
* clear code-entry field;
* concise privacy explanation;
* visibly distinct success, invalid-code and unavailable states;
* verified result card showing only approved public information;
* print-friendly result;
* institutional trust indicators.

---


# 4. Design lessons incorporated from the Stitch concepts

The three redesign concepts provide useful visual and interaction references, but they also contain generic templates, fabricated data, inconsistent branding and unsupported interface states. The following ideas should be incorporated selectively.

## 4.1 Strong photographic hero

Use a wide or full-width hero showing contemporary Ethiopian CSO practitioners engaged in a genuine planning, learning or decision-making process.

The hero should include:

- a controlled deep-navy overlay behind the text;
- natural colour and detail retained in the people and working materials;
- clean negative space;
- no text placed across faces, hands or meaningful objects;
- one primary and one secondary action;
- a small section label above the headline;
- concise trust indicators below the supporting statement.

Avoid generic classroom scenes, staged handshakes, technology clichés and poverty-focused imagery.

## 4.2 Editorial section labels

Use short orientation labels above major section headings, such as:

- PRACTICAL LEARNING
- AVAILABLE NOW
- HOW LEARNING WORKS
- DESIGNED AROUND CSO REALITIES
- TRUST AND ACCESSIBILITY

These labels should improve page rhythm and scanning without becoming decorative noise.

## 4.3 Open editorial layouts combined with cards

Do not place every piece of content inside a card. Combine:

- open narrative areas;
- image-led sections;
- supporting card groups;
- connected pathways;
- pale-mint section bands;
- compact metadata panels.

A useful explanatory section may allocate approximately 40% to narrative and 60% to supporting cards or a visual pathway.

## 4.4 Image-led course presentation

Adopt stronger course imagery while retaining disciplined metadata.

Each card should combine:

- a distinctive 16:9 thumbnail;
- capacity-area label;
- availability status;
- concise description;
- limited metadata;
- one clear action.

Public cards must not display learner progress unless the signed-in user has actual saved progress.

## 4.5 Learner dashboard centred on continuation

The first and strongest dashboard component should be a **Continue Learning** card showing:

- active course;
- current module;
- percentage completed;
- last completed activity;
- recommended next activity;
- prominent Continue button.

Secondary metrics must not compete with this next action.

## 4.6 Mobile patterns worth retaining

Use the strongest mobile ideas selectively:

- compact course-list cards;
- focused single-column forms;
- concise progress treatment;
- certificate records as compact rows;
- optional authenticated bottom navigation;
- safe-area-aware sticky actions.

The mobile experience must remain part of the same responsive platform, not become a visually unrelated mobile application.

## 4.7 Patterns to reject

Do not carry forward:

- fabricated statistics, deadlines, certificates or announcements;
- unconfirmed partner names or logos;
- corrupted placeholder text;
- generic “Why Choose Us” marketing language;
- excessive gradients;
- glossy consumer-app surfaces;
- heavy shadows and extreme corner radii;
- gamification, rankings, points or streaks;
- progress bars on logged-out catalogue cards;
- generic stock photography;
- unsupported fixed learning deadlines;
- disabled-looking forthcoming course cards.

---

# 5. Proposed information architecture

## 4.1 Public navigation

Recommended desktop navigation:

* Home
* Explore Courses
* How Learning Works
* Support
* Verify Certificate
* Sign In
* **Create Account**

“Create Account” should be the primary header button for logged-out users.

For logged-in learners:

* Home
* Courses
* My Learning
* Certificates
* Support
* Profile menu

The public and authenticated navigation states must be clearly different.

---

## 4.2 Recommended site structure

### Public experience

1. Home
2. Course Catalogue
3. Individual Course Pages
4. How Learning Works
5. Register
6. Email Confirmation
7. Sign In
8. Password Recovery
9. Verify Certificate
10. Support
11. Accessibility
12. Privacy
13. Terms

### Learner experience

1. Learner Dashboard
2. My Courses
3. Course Overview
4. Course Launch
5. Progress and Completion
6. Assessment Status
7. Certificates
8. Learner Profile
9. Support and Feedback

### Administrator experience

1. Administrator Sign-In
2. Administrator Dashboard
3. Learner Management
4. User Registration Records
5. Invite Learners
6. Course Assignment
7. Course and Cohort Monitoring
8. Progress and Assessment Overview
9. Certificate Records
10. Issue and Support Oversight

---

# 6. Proposed homepage redesign

## Section 1: Header

Use a refined white or pale background header with:

* DEC/Hub identity;
* simple navigation;
* clear sign-in link;
* prominent “Create account” or “Start learning” button;
* accessible mobile navigation.

The partner logo strip should not dominate the main header.

---

## Section 2: Hero

### Content

**Eyebrow**

CSO Learning Hub

**Headline**

Practical learning for stronger local and grassroots CSOs

**Supporting statement**

Build practical skills through realistic cases, guided activities and adaptable tools designed for everyday CSO work in Ethiopia.

**Primary action**

Explore courses

**Secondary action**

Sign in and continue

**Trust indicators**

Self-paced • Practice-led • Mobile-ready • Certificate pathways

### Visual direction

Use one strong, dignified hero image showing Ethiopian CSO practitioners actively working with a project map, learning material or shared planning process.

Avoid:

* posed handshakes;
* generic classroom training;
* overfilled collages;
* decorative technology screens;
* exaggerated rural hardship;
* stock-photography expressions.

The visual should communicate that local CSOs already possess knowledge and that the Hub helps them examine, strengthen and apply it.

---

## Section 3: Available learning

Feature the HRBA course as the principal action.

Use:

* large course thumbnail;
* course status;
* concise description;
* duration;
* certificate eligibility;
* “Start course” or “View course” button.

Below it, show three or four upcoming courses with a link to the full catalogue.

Do not place all nine courses on the homepage.

---

## Section 4: How learning works

Use a four-stage visual journey:

1. **Explore**
   Review course information before registering.

2. **Learn**
   Work through short explanations and realistic CSO situations.

3. **Practise**
   Make decisions, use tools and receive guidance.

4. **Apply**
   Adapt learning safely to your organisation’s work.

The current six-step access pathway can remain on the dedicated “How Learning Works” page. ([pilot-dec-cso.vercel.app][1])

---

## Section 5: Designed around CSO realities

Use four concise cards:

* Practical and relevant
* Flexible and self-paced
* Individual progress records
* Safe and responsible learning

This section should affirm CSO capability, not frame organisations through deficits.

---

## Section 6: Organisational application

Show a simple flow:

**Individual learning → Team discussion → Adapted organisational practice**

This preserves the existing idea that learning belongs to the individual account but can support wider organisational improvement. ([pilot-dec-cso.vercel.app][1])

---

## Section 7: Trust and accessibility

Use a restrained band containing:

* mobile-ready design;
* text-first essential information;
* no autoplay;
* keyboard-accessible controls;
* privacy and safe-use principles;
* certificate verification.

---

## Section 8: Final CTA

**Ready to begin?**

Choose the course that supports your current work.

Buttons:

* Explore courses
* Sign in

---

## Section 9: Institutional footer

The footer should include:

* concise Hub description;
* platform links;
* account links;
* support and trust links;
* partner acknowledgement;
* approved partner logos;
* copyright and legal links.

Partner logos should use consistent height, spacing and visual balance. They should not appear stretched, crowded or visually stronger than the Hub identity.

---

# 7. Course catalogue redesign

## 6.1 Catalogue header

Include:

* clear page title;
* one-sentence explanation;
* total course count;
* search;
* capacity-area filter;
* availability filter;
* clear reset action.

On mobile, filters should open inside a compact drawer or accordion.

---

## 6.2 Course-card system

Each course card should have:

1. distinct course thumbnail;
2. capacity-area label;
3. course title;
4. short outcome-focused description;
5. metadata row;
6. status badge;
7. one clear action.

### Suggested metadata icons

* Clock: duration
* Award: certificate
* Globe or language icon: language
* User: access type
* Progress icon: tracked learning

Do not rely on icons without labels.

---

## 6.3 Course thumbnail direction

All thumbnails should share:

* 16:9 proportion;
* Ethiopian setting;
* realistic and dignified people;
* DEC colour harmony;
* consistent illustration or photographic treatment;
* safe space for labels;
* no embedded text;
* unique visual metaphor per course.

Each course must remain visually recognisable:

* HRBA: participation, voice, inclusion and decision-making
* Governance: shared leadership and accountability
* Project Management: connected project pathway
* MEAL: evidence, reflection and adaptation
* Financial Management: responsible resource stewardship
* Strategic Planning: collective direction and future pathway
* People and Safeguarding: inclusion, care and safe practice
* Digital Skills: responsible technology and data use
* Partnerships: connected organisations and collective action

---

# 8. Course-detail page design

## 7.1 Hero area

Include:

* breadcrumb;
* status;
* capacity-area label;
* course title;
* concise value proposition;
* Start/Continue button;
* course thumbnail;
* duration, language, format and certificate information.

For returning learners, replace “Start course” with:

* Continue learning
* progress percentage;
* last module visited.

---

## 7.2 Module journey

Use a vertical or horizontal module roadmap.

Each module should show:

* number;
* title;
* short purpose;
* estimated duration where confirmed;
* status: not started, current, completed or locked.

Do not expose internal screen counts or implementation terminology.

---

## 7.3 Sticky enrolment/action panel

On desktop, use a restrained sticky side card with:

* availability;
* access requirement;
* duration;
* certificate requirement;
* Start/Continue button;
* support link.

On mobile, show a sticky bottom action bar that does not obscure content.

---

# 9. Learner dashboard redesign

The dashboard should answer three immediate questions:

1. What am I currently learning?
2. What should I do next?
3. What have I completed?

## Recommended structure

### Welcome and next action

* learner name;
* concise welcome;
* “Continue where you left off” card.

### Current learning

Each active course shows:

* thumbnail;
* course name;
* progress;
* current module;
* last activity;
* Continue button.

### Progress summary

Use no more than three or four compact indicators:

* courses in progress;
* courses completed;
* certificates earned;
* assessments pending, only where relevant.

Do not introduce rankings, points, streaks, learner comparisons or unsupported deadlines.

### Recommended or available learning

Show only relevant available courses.

### Certificates

Provide quick access to completed certificates and verification codes.

### Support and feedback

Include:

* report a problem;
* provide pilot feedback;
* read learning guidance.

Avoid turning the dashboard into an analytics-heavy corporate interface. It should remain calm, practical and action-oriented.

---

# 10. Registration and authentication redesign

## Registration

Group fields into logical sections:

### Your account

* Full name
* Email
* Password
* Confirm password

### Your organisation

* Organisation name
* Role or function
* Region
* Preferred language

### Agreement

* Terms and privacy confirmation

Include:

* password-strength guidance;
* visible required-field indicators;
* immediate validation;
* clear explanation of email confirmation;
* no technical error codes.

## Email confirmation

Create a dedicated success page explaining:

1. Check your inbox.
2. Open the confirmation email.
3. Confirm your account.
4. Return and sign in.

Include:

* resend confirmation;
* change email;
* check spam/junk guidance;
* support link;
* rate-limit messaging where necessary.

## Sign-in

Keep the page focused:

* email;
* password;
* show password;
* forgot password;
* Sign In;
* Create account;
* support.

## Password recovery

Use a simple three-state flow:

1. Enter email.
2. Check email.
3. Create new password.

Success and error messages must tell the user what to do next.

---

# 11. Administrator interface direction

The administrator environment should share the design system but be visibly distinct from the learner Hub.

Use:

* deep navy application shell;
* light content workspace;
* clear sidebar;
* page titles and breadcrumbs;
* consistent tables and filters;
* restrained data visualisation.

## Administrator dashboard priorities

* total registered learners;
* active learners;
* assigned courses;
* learners in progress;
* completed learners;
* assessment outcomes;
* certificates issued;
* unresolved support or access issues.

## User-management features

Organise learner management around:

* Registered users
* Invited learners
* Pending confirmation
* Active learners
* Course assignments
* Completed learners
* Disabled or archived records

Administrative tables should provide:

* search;
* filters;
* sortable columns;
* pagination;
* clear actions;
* confirmation for destructive actions;
* accessible empty and error states.

The revamp must not change permissions, role protection or authentication behaviour.

---

# 12. Visual design system

## 11.1 Colour roles

### Deep navy — `#0F172A`

Use for:

* primary navigation;
* headings;
* administrator shell;
* major footer areas;
* high-emphasis text.

### DEC blue — `#3B99D4`

Use for:

* primary links;
* selected navigation;
* informational emphasis;
* progress indicators;
* secondary CTAs.

### Fresh green — `#91C852`

Use for:

* primary learner actions where contrast is sufficient;
* completion indicators;
* positive progress;
* selected highlights.

Dark text should normally be used on this green.

### Soft teal — `#0F8F8C`

Use for:

* practical learning tools;
* secondary thematic emphasis;
* module markers;
* supportive interface states.

### Pale mint — `#EAF7EF` or `#F3FBF4`

Use for:

* soft page sections;
* safe-practice messages;
* completed learning backgrounds;
* low-emphasis cards.

### Restrained amber — `#F59E0B` and pale amber backgrounds

Use only for:

* attention;
* pending states;
* important reminders;
* certificate thresholds;
* controlled warnings.

### Neutral system

Use white, soft grey-blue borders and high-contrast charcoal text. Avoid excessive tinted backgrounds on every section.

### Gradient policy

Use gradients only in controlled locations such as the hero overlay or an authentication identity panel. Do not use strong teal-to-mint gradients across every card or section. Flat colour, pale section bands and restrained tonal variation will age better and retain an institutional character.

---

## 11.2 Typography

Use a highly legible modern sans-serif family with:

* full Latin support;
* strong small-size readability;
* clear distinction between weights;
* reliable web performance.

Recommended direction:

* headings: Manrope, Inter or Source Sans 3;
* body: Inter, Source Sans 3 or Noto Sans.

Prefer one family with multiple weights over unnecessary font combinations.

### Typographic hierarchy

* Display hero: 48–60 px desktop, 34–42 px mobile
* Page heading: 38–48 px
* Section heading: 28–36 px
* Card heading: 18–22 px
* Body: 16–18 px
* Supporting text: no smaller than 14 px
* Line height: approximately 1.5–1.7 for body text

Keep reading widths near 65–75 characters for long text.

---

## 11.3 Spacing and layout

Adopt a consistent 8-point spacing system.

Suggested section spacing:

* desktop: 80–112 px;
* tablet: 64–80 px;
* mobile: 48–64 px.

Content width:

* main maximum: 1200–1280 px;
* reading content: 720–800 px;
* forms: 480–560 px.

Use generous whitespace but avoid oversized empty hero sections that push learning content below the fold.

---

## 11.4 Cards

Cards should have:

* clear purpose;
* restrained radius, approximately 14–20 px;
* subtle border;
* minimal shadow;
* consistent internal spacing;
* aligned headings and actions;
* meaningful hover and focus states.

Avoid placing every piece of content inside a separate floating card. Use open layouts, section bands and grouped panels where appropriate.

---

## 11.5 Iconography

Use one consistent outline icon family.

Icons should:

* support comprehension;
* remain simple;
* have accompanying labels where meaning is not obvious;
* avoid decorative overuse;
* not substitute for status text.

---

## 11.6 Imagery

Use imagery selectively:

* one major visual per key page;
* course-specific thumbnails;
* occasional contextual illustrations;
* no decorative stock image beside every text block.

Images should show:

* contemporary Ethiopian CSO practice;
* active collaboration;
* practical tools and decisions;
* balanced representation;
* dignity and capability;
* real environments without identifying institutions.

---

# 13. Accessibility requirements

The revamp should target **WCAG 2.2 AA** as the minimum design and implementation standard.

Priority requirements:

* keyboard-operable navigation and forms;
* visible focus indicators;
* semantic heading order;
* sufficient text and control contrast;
* text alternatives for meaningful images;
* labels attached to every form field;
* clear inline validation;
* error summaries;
* no reliance on colour alone;
* 44 × 44 px minimum practical touch targets;
* zoom support to at least 200%;
* reduced-motion support;
* screen-reader announcements for status changes;
* accessible dialogs, menus, accordions and tables;
* properly identified required fields;
* accessible course progress;
* descriptive button names;
* captions and transcripts for learning media;
* no autoplay.

The site already publicly describes mobile readiness, text-first content, no autoplay and clear labels; the redesign should make these claims demonstrably true throughout every workflow. ([pilot-dec-cso.vercel.app][1])

---

# 14. Mobile and low-bandwidth design

The mobile version should be designed intentionally, not produced only by collapsing desktop components.

## Mobile priorities

* primary action visible early;
* compact header;
* readable forms;
* single-column course cards;
* accessible filters;
* progress always understandable;
* no horizontal scrolling;
* limited sticky elements;
* simple module navigation;
* large taps;
* minimal decorative animation.

## Low-bandwidth principles

* optimise all images;
* use modern responsive image formats;
* lazy-load non-essential media;
* keep essential meaning in HTML text;
* avoid autoplay;
* avoid background video;
* minimise large animation libraries;
* use system fallbacks for fonts;
* preserve access when thumbnails fail to load;
* show meaningful loading and retry states.

---

# 15. Content-design improvements

Approved content should be preserved, but its presentation can be improved through:

* removal of exact duplication;
* shorter lead paragraphs;
* progressive disclosure;
* clearer heading hierarchy;
* labels instead of repeated explanatory sentences;
* task-focused button wording;
* concise helper text;
* consistent terminology;
* separation of learner-facing guidance from programme-status language.

Examples:

Replace:

> Duration and release date to be confirmed

with a compact metadata label:

**Duration:** To be confirmed

Replace:

> Course information only

with:

**Coming soon**
View course overview

Replace technical wording such as:

> Hub-tracked embedded course

with learner-facing wording such as:

**Format:** Interactive online course
**Progress:** Saved to your account

Internal implementation terminology can remain in code or administrative documentation but should not dominate learner-facing pages.

---

# 16. Functional preservation rules

The design AI must not:

* alter registration logic;
* bypass email confirmation;
* change authentication providers;
* alter role-based access;
* merge individual learner accounts;
* change course URLs without redirects;
* change assessment calculations;
* change the 80% certificate threshold;
* alter progress-persistence behaviour;
* expose private learner information;
* change certificate verification logic;
* remove invitation workflows;
* alter administrator permissions;
* change database schemas without explicit technical approval;
* replace working components only for visual novelty;
* use fabricated statistics, quotations or impact claims.

The course page currently confirms that certificate eligibility requires completion and a final assessment score of at least 80%; that rule must remain unchanged. ([pilot-dec-cso.vercel.app][4])

---


# 17. Required interface states

The revamp must design and test more than the ideal or successful state.

## 17.1 Global states

- loading;
- slow loading;
- empty;
- success;
- warning;
- error;
- unavailable service;
- connection failure;
- retry;
- unauthorised access;
- expired session.

## 17.2 Account states

- unregistered;
- pending email confirmation;
- confirmed;
- invalid credentials;
- reset email requested;
- password reset completed;
- expired reset link;
- invalid reset link;
- valid invitation;
- expired invitation;
- invitation already accepted;
- existing account associated with invitation.

## 17.3 Course states

- public overview;
- available but not enrolled;
- enrolled but not started;
- in progress;
- current module;
- completed module;
- locked module;
- assessment available;
- assessment not passed;
- assessment passed;
- course completed;
- certificate available.

## 17.4 Certificate states

- not yet eligible;
- available;
- generated;
- downloadable;
- verified;
- invalid verification code;
- verification temporarily unavailable.

## 17.5 Administrator states

- no records;
- pending records;
- active filters;
- no search result;
- loading table;
- successful action;
- failed action;
- confirmation required;
- permission denied.

Every state must include clear learner-facing language and an appropriate next action.

---

# 18. Shared component priorities

Reusable components should be established before page-by-page styling.

Priority components:

1. Header and responsive navigation  
2. Footer and partner acknowledgement  
3. Primary, secondary and tertiary buttons  
4. Form controls and validation  
5. Status badges  
6. Course card  
7. Featured-course card  
8. Progress indicator  
9. Module journey  
10. Safe-participation notice  
11. Support accordion  
12. Certificate card or row  
13. Data table and filters  
14. Empty, loading and error states  
15. Modal and confirmation dialog  
16. Toast or status notification  
17. Mobile bottom navigation  
18. Sticky action panel  

Each component must define:

- default;
- hover;
- focus;
- active;
- disabled;
- loading where relevant;
- mobile behaviour;
- accessibility requirements.

---

# 19. Implementation phases

## Phase 1: Design audit and system definition

* inventory every public, learner and administrator page;
* identify shared and inconsistent components;
* document existing user journeys;
* record functional dependencies;
* define design tokens;
* establish typography, spacing, colour and component rules;
* confirm accessibility requirements;
* freeze approved content and functional logic.

## Phase 2: Core public experience

Redesign:

* header and footer;
* homepage;
* course catalogue;
* course-detail pages;
* How Learning Works;
* support;
* certificate verification;
* privacy, terms and accessibility pages.

## Phase 3: Authentication experience

Redesign:

* registration;
* email confirmation;
* sign-in;
* password recovery;
* invitation acceptance;
* invalid and expired-link states;
* success and error messages.

## Phase 4: Learner experience

Redesign:

* dashboard;
* My Learning;
* course progress;
* course-launch states;
* assessment status;
* completion;
* certificate access;
* learner profile;
* feedback and support.

## Phase 5: Administrator experience

Redesign:

* administrator sign-in;
* dashboard;
* user management;
* invitations;
* course assignments;
* monitoring;
* certificates;
* issue oversight.

## Phase 6: Responsive and accessibility QA

Test at minimum:

* 360 px and 390 px mobile widths;
* tablet;
* standard laptop;
* wide desktop;
* keyboard-only use;
* screen-reader landmarks and forms;
* zoom at 200%;
* slow connection;
* missing images;
* long names and organisation titles;
* validation and error states;
* course lock and completion states.

## Phase 7: Functional regression and release

Confirm:

* all links;
* redirects;
* session handling;
* authentication;
* registration;
* email verification;
* recovery;
* progress saving;
* assessment records;
* certificate eligibility;
* certificate verification;
* administrator access;
* invitation handling;
* responsive performance.

---

# 20. Definition of a successful revamp

The revamp should be approved only when:

* the Hub has a distinctive, consistent visual identity;
* the available course and primary learner action are immediately clear;
* homepage content is significantly easier to scan;
* course cards are concise and comparable;
* registration and sign-in feel secure and straightforward;
* learners can identify their next action from the dashboard;
* course progress and completion states are understandable without explanation;
* mobile use is comfortable and complete;
* all essential interactions meet WCAG 2.2 AA;
* partner acknowledgement is professional and balanced;
* no approved functionality or data behaviour has changed;
* the platform looks credible in stakeholder demonstrations, screenshots, reports and public publication.

---

# 21. Consolidated implementation instruction

Transform the existing **CSO Learning Hub** at `https://pilot-dec-cso.vercel.app` into a highly professional, visually compelling, accessible and publication-quality digital learning platform for local and grassroots CSOs in Ethiopia. Preserve all approved content, URLs, registration and email-confirmation processes, sign-in and password-recovery flows, invitation pathways, role-based access, learner records, course assignments, progress tracking, assessments, the 80% certificate threshold, certificate generation and verification, support functions and administrator capabilities. Do not rebuild or simplify working functionality merely for visual effect.

Create a distinctive NGO/CSO learning-platform identity using the established DEC visual system: deep navy `#0F172A`, DEC blue `#3B99D4`, fresh green `#91C852`, soft teal `#0F8F8C`, pale mint `#EAF7EF` and `#F3FBF4`, white, soft neutral borders and restrained amber for attention states. Apply refined typography, strong hierarchy, generous but efficient spacing, accessible contrast, polished cards, purposeful imagery, consistent icons, responsive grids and clearly differentiated primary, secondary and supporting actions.

Restructure the public homepage into a concise learner journey: clear hero and value proposition, available learning, how learning works, relevance to CSO practice, organisational application, trust and accessibility, and a final call to action. Reduce repetition and move detailed programme explanations into appropriate secondary pages or expandable areas. Redesign the catalogue with concise, visually distinctive course cards, meaningful thumbnails, visible availability states and efficient filters. Redesign course-detail pages around course value, at-a-glance information, a visual module journey, learning outcomes, practical outputs, assessment and certificate requirements, safe participation, support and a strong Start or Continue action.

Create focused and supportive registration, email-confirmation, sign-in, password-recovery and invitation screens with clear form grouping, inline validation, password guidance, accessible success and error states and direct support routes. Redesign the learner dashboard to prioritise continuing learning, current progress, next steps, completed courses and certificates. Redesign the administrator portal with a professional application shell, clear navigation, learner-management tables, invitations, course assignment, progress monitoring, assessment and certificate records and support oversight, without changing permissions or backend logic.

Design intentionally for mobile devices and constrained connectivity. Keep essential information text-based, optimise imagery, avoid autoplay and unnecessary animation, support responsive images and clear loading, empty, locked, pending, success and error states. Meet WCAG 2.2 AA requirements across keyboard access, focus visibility, colour contrast, touch targets, semantic structure, forms, validation, dialogs, tables, progress indicators and assistive-technology announcements. Use dignified contemporary Ethiopian imagery showing local CSO practitioners applying learning through discussion, maps, planning tools, evidence and shared decisions; avoid generic corporate imagery, staged handshakes, poverty stereotypes, political symbols, readable institutional names and decorative technology clichés.

Treat this as a complete design-system and user-experience revamp rather than a cosmetic reskin. Produce consistent, production-ready designs across the landing page, catalogue, course pages, registration, confirmation, sign-in, password recovery, learner dashboard, course cards, module and progress states, assessments, certificates, certificate verification, feedback, support and administrator access.

[1]: https://pilot-dec-cso.vercel.app/ "CSO Learning Hub"
[2]: https://pilot-dec-cso.vercel.app/courses "CSO Learning Hub"
[3]: https://pilot-dec-cso.vercel.app/sign-in "CSO Learning Hub"
[4]: https://pilot-dec-cso.vercel.app/courses/applying-human-rights-based-approach-in-cso-practice "CSO Learning Hub"
[5]: https://pilot-dec-cso.vercel.app/support "CSO Learning Hub"
[6]: https://pilot-dec-cso.vercel.app/verify-certificate "CSO Learning Hub"
