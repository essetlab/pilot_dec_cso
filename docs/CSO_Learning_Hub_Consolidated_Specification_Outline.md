# CSO Learning Hub Consolidated Specification

## Proposed Master Outline

---

## 0. Document Control

### 0.1 Document purpose
### 0.2 Intended users of the specification
### 0.3 Source documents consolidated
### 0.4 Version history
### 0.5 Definitions and terminology
### 0.6 Decisions still pending
### 0.7 Implementation assumptions

---

# Part 1 — Product Vision, Positioning, and Platform Logic

## 1. Product Vision and Strategic Positioning

### 1.1 Purpose of the CSO Learning Hub
### 1.2 CSF+ capacity development context
### 1.3 Primary audience: local and grassroots CSOs
### 1.4 Platform promise: Learn. Connect. Grow.
### 1.5 What the Hub is
### 1.6 What the Hub is not
### 1.7 Core value proposition
### 1.8 Programme philosophy: from learning content to applied practice
### 1.9 Platform growth pathway: Learn → Exchange → Co-create
### 1.10 Relationship between courses, peer learning, and co-created practice
### 1.11 Principles for locally grounded CSO capacity strengthening
### 1.12 Safe, practical, non-extractive learning approach

## 2. Product Scope and Experience Layers

### 2.1 Public experience
### 2.2 Learner account and profile experience
### 2.3 Course discovery and enrollment experience
### 2.4 Course learning experience
### 2.5 Portfolio, assessment, and certificate experience
### 2.6 Dashboard and cross-course learning record
### 2.7 Community, forums, and LALINKage
### 2.8 Support, privacy, and account settings
### 2.9 Admin, creator, review, and publish operations
### 2.10 MEAL, analytics, and adaptive improvement
### 2.11 Technical/API layer

---

# Part 2 — Information Architecture, Navigation, and Routes

## 3. Platform Information Architecture

### 3.1 Overall platform map
### 3.2 Public routes
### 3.3 Authentication routes
### 3.4 Learner routes
### 3.5 Course learning routes
### 3.6 Community routes
### 3.7 Certificate routes
### 3.8 Support and policy routes
### 3.9 Admin routes
### 3.10 Creator and review routes
### 3.11 Route protection rules
### 3.12 Redirect logic after login and registration
### 3.13 Route acceptance criteria

## 4. Navigation System

### 4.1 Public header
### 4.2 Signed-in learner header
### 4.3 Course player navigation
### 4.4 Dashboard navigation
### 4.5 Community navigation
### 4.6 Footer navigation
### 4.7 Mobile navigation
### 4.8 What must not appear in public navigation
### 4.9 Role-based navigation behavior

---

# Part 3 — Public Platform Experience

## 5. Public Landing Page Specification

### 5.1 Strategic role of the landing page
### 5.2 Public page positioning
### 5.3 Core message and hero copy
### 5.4 Public header and navigation
### 5.5 Hero section
### 5.6 Core value cards
### 5.7 Learn → Exchange → Co-create pathway
### 5.8 About the platform section
### 5.9 Course showcase section
### 5.10 How each learning journey works
### 5.11 Practical tools and resources section
### 5.12 Growing CSO learning community section
### 5.13 Final call to action
### 5.14 Footer and partner recognition
### 5.15 Landing page visual assets
### 5.16 Landing page copy standards
### 5.17 Landing page accessibility and mobile requirements
### 5.18 Landing page acceptance criteria

## 6. Course Catalog Page Specification

### 6.1 Purpose and strategic role
### 6.2 Catalog hero
### 6.3 Featured learning pathway / priority course strip
### 6.4 Search and filter system
### 6.5 Course results grid
### 6.6 Course card structure
### 6.7 Course card states
### 6.8 Course metadata model
### 6.9 Course category and topic taxonomy
### 6.10 Certificate and portfolio note
### 6.11 Learning pathway explainer
### 6.12 Support CTA
### 6.13 Empty, loading, and error states
### 6.14 Mobile catalog behavior
### 6.15 Catalog accessibility requirements
### 6.16 Catalog-to-course overview routing
### 6.17 Catalog acceptance criteria

## 7. Individual Course Overview Page Specification

### 7.1 Purpose of the course overview page
### 7.2 Page users and access states
### 7.3 Course hero
### 7.4 Course metadata strip
### 7.5 Start / enroll / continue panel
### 7.6 About this course
### 7.7 Who this course is for
### 7.8 Learning outcomes
### 7.9 Course structure and module list
### 7.10 Learning activities and portfolio explanation
### 7.11 Final assessment and certificate rule
### 7.12 Resources and support
### 7.13 Related courses
### 7.14 Restricted, coming soon, completed, and archived states
### 7.15 Course overview acceptance criteria

---

# Part 4 — Identity, Registration, Profiles, and Organization Records

## 8. Learner Registration Specification

### 8.1 Purpose
### 8.2 Registration entry points
### 8.3 Registration route
### 8.4 Required registration fields
### 8.5 Optional registration fields
### 8.6 Registration page layout
### 8.7 Registration copy
### 8.8 Validation rules
### 8.9 Password rules
### 8.10 Email verification
### 8.11 Registration success state
### 8.12 Registration error states
### 8.13 Registration privacy rules
### 8.14 Registration acceptance criteria

## 9. Learner Login and Authentication Specification

### 9.1 Purpose
### 9.2 Login route
### 9.3 Login form fields
### 9.4 Login page copy
### 9.5 Login behavior and redirect logic
### 9.6 Public, signed-in, inactive, and suspended account states
### 9.7 Forgot password flow
### 9.8 Login error states
### 9.9 Security requirements
### 9.10 Logout behavior
### 9.11 Authentication acceptance criteria

## 10. Learner Profile Specification

### 10.1 Purpose
### 10.2 Learner profile route
### 10.3 Profile sections
### 10.4 Basic information fields
### 10.5 Certificate name rule
### 10.6 Organization link
### 10.7 Learning interests
### 10.8 Language preference
### 10.9 Accessibility support preference
### 10.10 Directory visibility
### 10.11 Account and security
### 10.12 Profile validation
### 10.13 Learner profile acceptance criteria

## 11. Organization Profile Specification

### 11.1 Purpose
### 11.2 Organization profile route
### 11.3 Basic and verified organization profiles
### 11.4 Required organization fields
### 11.5 Optional organization fields
### 11.6 Organization type taxonomy
### 11.7 Thematic area taxonomy
### 11.8 Capacity interests
### 11.9 Organization profile page layout
### 11.10 Linked learners
### 11.11 Organization directory visibility
### 11.12 Organization verification
### 11.13 Organization privacy rules
### 11.14 Organization profile acceptance criteria

## 12. User Roles and Permission Matrix

### 12.1 Purpose
### 12.2 Public visitor
### 12.3 Registered learner
### 12.4 Enrolled learner
### 12.5 Completed learner
### 12.6 Organization focal person
### 12.7 Course facilitator
### 12.8 Forum moderator
### 12.9 Course creator
### 12.10 Reviewer
### 12.11 Publisher
### 12.12 Support agent
### 12.13 Platform admin
### 12.14 Super admin
### 12.15 Permission matrix
### 12.16 Role acceptance criteria

---

# Part 5 — Course Access, Enrollment, Learning, and Progress

## 13. Course Access Management Specification

### 13.1 Purpose
### 13.2 Access routes
### 13.3 Public available course state
### 13.4 Signed-in but not enrolled state
### 13.5 Enrolled but not started state
### 13.6 Enrolled and in progress state
### 13.7 Final assessment available state
### 13.8 Completed but certificate not issued state
### 13.9 Certificate issued state
### 13.10 Failed assessment / retake available state
### 13.11 Assigned-only course state
### 13.12 Coming-soon course state
### 13.13 Archived course state
### 13.14 Access rule types
### 13.15 Access page behavior
### 13.16 Admin course access controls
### 13.17 Course access data model
### 13.18 Course access acceptance criteria

## 14. Enrollment Workflow

### 14.1 Enrollment purpose
### 14.2 Enrollment entry points
### 14.3 Open enrollment
### 14.4 Invitation-only enrollment
### 14.5 Cohort-based enrollment
### 14.6 Organization-assigned enrollment
### 14.7 Admin-assigned enrollment
### 14.8 Enrollment confirmation
### 14.9 Enrollment cancellation or removal
### 14.10 Enrollment data model
### 14.11 Enrollment acceptance criteria

## 15. Enrolled Course Homepage Specification

### 15.1 Purpose
### 15.2 Route
### 15.3 Course welcome banner
### 15.4 Continue learning card
### 15.5 Course roadmap
### 15.6 Module list
### 15.7 Portfolio preview
### 15.8 Certificate path
### 15.9 Safe participation / privacy note
### 15.10 Course resources
### 15.11 Discussion/community link
### 15.12 Support link
### 15.13 Enrolled course homepage acceptance criteria

## 16. Course Player Specification

### 16.1 Purpose
### 16.2 Course player routes
### 16.3 Desktop layout
### 16.4 Mobile layout
### 16.5 Top app bar
### 16.6 Left navigation sidebar
### 16.7 Main learning canvas
### 16.8 Optional right drawer
### 16.9 Supported block and interaction types
### 16.10 Lesson completion rules
### 16.11 Activity completion rules
### 16.12 Save and resume behavior
### 16.13 Locked and unlocked module behavior
### 16.14 Navigation rules
### 16.15 Help and support within player
### 16.16 Course player accessibility requirements
### 16.17 Course player acceptance criteria

## 17. Cross-Course Progress Overview

### 17.1 Purpose
### 17.2 Routes
### 17.3 Progress summary cards
### 17.4 Active learning section
### 17.5 Completion pathway
### 17.6 Completed learning section
### 17.7 Recommended next steps
### 17.8 Progress status labels
### 17.9 Progress calculation
### 17.10 Progress display rules
### 17.11 Progress data model
### 17.12 Progress overview acceptance criteria

---

# Part 6 — Portfolio, Assessment, Certificates, and Verification

## 18. Portfolio Architecture Specification

### 18.1 Purpose
### 18.2 Portfolio principles
### 18.3 Portfolio route
### 18.4 Portfolio output types
### 18.5 Portfolio statuses
### 18.6 Portfolio page sections
### 18.7 Portfolio activity creation from course activities
### 18.8 Learner portfolio actions
### 18.9 Portfolio privacy rules
### 18.10 Optional proof distinction
### 18.11 Portfolio export / download
### 18.12 Portfolio dashboard integration
### 18.13 Portfolio data model
### 18.14 Portfolio acceptance criteria

## 19. Final Assessment Specification

### 19.1 Purpose
### 19.2 Assessment availability and unlock conditions
### 19.3 Assessment question types
### 19.4 Question bank structure
### 19.5 Linked learning outcomes
### 19.6 Attempt rules
### 19.7 Retake rules
### 19.8 Score calculation
### 19.9 Feedback rules
### 19.10 Failed assessment guidance
### 19.11 Assessment privacy rules
### 19.12 Assessment data model
### 19.13 Final assessment acceptance criteria

## 20. Certificate Eligibility and Generation Specification

### 20.1 Certificate purpose
### 20.2 Certificate-eligible course requirements
### 20.3 Completion requirements
### 20.4 Pass threshold rule
### 20.5 Certificate generation trigger
### 20.6 Certificate content
### 20.7 Certificate template requirements
### 20.8 Certificate ID and verification code
### 20.9 Certificate correction process
### 20.10 Certificate reissue process
### 20.11 Certificate revocation process
### 20.12 Certificate versioning and course version linkage
### 20.13 Certificate data model
### 20.14 Certificate acceptance criteria

## 21. Cross-Course Certificate View

### 21.1 Purpose
### 21.2 Routes
### 21.3 Certificate summary cards
### 21.4 Certificate list
### 21.5 Pending certificates
### 21.6 Certificate correction guidance
### 21.7 Certificate statuses
### 21.8 Certificate card actions
### 21.9 Certificate PDF content
### 21.10 Cross-course certificate acceptance criteria

## 22. Certificate Verification Entry Point

### 22.1 Purpose
### 22.2 Verification routes
### 22.3 Entry points
### 22.4 Verification methods
### 22.5 Verification form
### 22.6 Valid certificate result
### 22.7 Invalid certificate result
### 22.8 Revoked or inactive certificate result
### 22.9 Public data exposure limits
### 22.10 Verification data model
### 22.11 Verification acceptance criteria

---

# Part 7 — Learner Dashboard, Community, Forums, and LALINKage

## 23. Learner Dashboard Specification

### 23.1 Purpose
### 23.2 Dashboard route
### 23.3 Dashboard entry points
### 23.4 Dashboard layout
### 23.5 Welcome banner
### 23.6 Quick summary cards
### 23.7 Continue learning card
### 23.8 My courses section
### 23.9 Portfolio summary
### 23.10 Certificates summary
### 23.11 Community and discussion activity
### 23.12 Recommended next courses
### 23.13 Profile completion prompt
### 23.14 Dashboard privacy rules
### 23.15 Dashboard acceptance criteria

## 24. Learner Directory Specification

### 24.1 Purpose
### 24.2 Directory route
### 24.3 Visibility and consent rule
### 24.4 Directory profile content
### 24.5 Search and filters
### 24.6 Learner cards
### 24.7 Learner profile preview
### 24.8 Connection features
### 24.9 Directory moderation and safety
### 24.10 Directory empty state
### 24.11 Learner directory acceptance criteria

## 25. Forums and Interaction Spaces Specification

### 25.1 Purpose
### 25.2 Forum routes
### 25.3 Course discussion spaces
### 25.4 Cohort spaces
### 25.5 Topic spaces
### 25.6 Help and support spaces
### 25.7 Peer practice spaces
### 25.8 Forum structure
### 25.9 Forum post types
### 25.10 Course-integrated discussion prompts
### 25.11 Forum safety rules
### 25.12 Moderator roles
### 25.13 Forum index page
### 25.14 Forum space page
### 25.15 Forum acceptance criteria

## 26. LALINKage / Community Features Specification

### 26.1 Purpose
### 26.2 Community product meaning
### 26.3 Community routes
### 26.4 Public label and branding decision
### 26.5 Community maturity stages
### 26.6 Community homepage layout
### 26.7 Connect → Exchange → Co-create pathway
### 26.8 Community spaces
### 26.9 Events and learning sessions
### 26.10 Peer stories
### 26.11 Shared tools and resources
### 26.12 Co-creation spaces
### 26.13 Community roles
### 26.14 Community profile integration
### 26.15 Community acceptance criteria

---

# Part 8 — Support, Privacy, Safety, and Account Settings

## 27. Support / Help Specification

### 27.1 Purpose
### 27.2 Support routes
### 27.3 Support entry points
### 27.4 Support categories
### 27.5 Support page layout
### 27.6 Support cards
### 27.7 Contact form
### 27.8 FAQ section
### 27.9 In-course help
### 27.10 Support ticket data model
### 27.11 Support statuses
### 27.12 Support safety note
### 27.13 Support acceptance criteria

## 28. Data Privacy and Account Settings Specification

### 28.1 Purpose
### 28.2 Settings routes
### 28.3 Account information
### 28.4 Login and security
### 28.5 Notification preferences
### 28.6 Directory visibility
### 28.7 Community visibility
### 28.8 Portfolio privacy
### 28.9 Certificate visibility
### 28.10 Organization profile visibility
### 28.11 Data download request
### 28.12 Account deletion or deactivation request
### 28.13 Consent records
### 28.14 Settings page copy
### 28.15 Privacy/account settings acceptance criteria

## 29. Data Governance, Privacy, Retention, and Consent Rules

### 29.1 Purpose
### 29.2 Data categories
### 29.3 Data minimization rules
### 29.4 Sensitive data not to collect
### 29.5 Account data retention
### 29.6 Course progress retention
### 29.7 Certificate record retention
### 29.8 Portfolio data retention
### 29.9 Forum post retention and anonymization
### 29.10 Support ticket retention
### 29.11 Consent record retention
### 29.12 Data deletion process
### 29.13 Data export process
### 29.14 Admin data access logging
### 29.15 Data governance acceptance criteria

## 30. Moderation and Safe Participation Protocol

### 30.1 Purpose
### 30.2 Safe sharing rule
### 30.3 Safe alternatives
### 30.4 Report workflow
### 30.5 Moderation statuses
### 30.6 Moderator actions
### 30.7 Safeguarding escalation
### 30.8 Community guidelines
### 30.9 User warning and suspension process
### 30.10 Moderator audit trail
### 30.11 Moderation acceptance criteria

---

# Part 9 — Admin, Creator, Review, and Publishing Operations

## 31. Admin and Operations Dashboard Specification

### 31.1 Purpose
### 31.2 Admin route
### 31.3 Admin dashboard structure
### 31.4 User management
### 31.5 Organization management
### 31.6 Course management
### 31.7 Enrollment management
### 31.8 Certificate management
### 31.9 Support ticket management
### 31.10 Forum moderation management
### 31.11 Community management
### 31.12 Analytics and MEAL
### 31.13 Privacy/data requests
### 31.14 Audit logs
### 31.15 Platform settings
### 31.16 Admin acceptance criteria

## 32. Course Creator / Build Studio Specification

### 32.1 Purpose
### 32.2 Creator roles
### 32.3 Course setup
### 32.4 Course metadata
### 32.5 Module and lesson creation
### 32.6 Activity and interaction setup
### 32.7 Portfolio activity setup
### 32.8 Resource setup
### 32.9 Final assessment setup
### 32.10 Certificate rule setup
### 32.11 Preview
### 32.12 Submit for review
### 32.13 Creator permissions and limits
### 32.14 Creator acceptance criteria

## 33. Course Lifecycle, Review, Publish, Update, and Archive Workflow

### 33.1 Purpose
### 33.2 Course lifecycle states
### 33.3 Concept state
### 33.4 Design draft state
### 33.5 Content draft state
### 33.6 Build state
### 33.7 Internal QA state
### 33.8 Expert review state
### 33.9 Revision required state
### 33.10 Approved for publish state
### 33.11 Published state
### 33.12 Update in progress state
### 33.13 Archived state
### 33.14 Retired state
### 33.15 Required review gates before publish
### 33.16 Versioning rules
### 33.17 Published course update rules
### 33.18 Archive rules
### 33.19 Course lifecycle data model
### 33.20 Lifecycle acceptance criteria

## 34. Quality Assurance and Review Standards

### 34.1 Purpose
### 34.2 Content/thematic review
### 34.3 CSO relevance review
### 34.4 Instructional design review
### 34.5 Visual design review
### 34.6 Accessibility review
### 34.7 Safeguarding and safe participation review
### 34.8 Technical QA
### 34.9 Certificate rule QA
### 34.10 Review severity levels
### 34.11 QA checklist
### 34.12 Publish readiness checklist

---

# Part 10 — MEAL, Analytics, and Adaptive Improvement

## 35. Adaptive MEAL and Analytics Specification

### 35.1 Purpose
### 35.2 MEAL principles: adaptive support, not surveillance
### 35.3 Platform reach analytics
### 35.4 Course participation analytics
### 35.5 Learning engagement analytics
### 35.6 Assessment learning evidence
### 35.7 Portfolio evidence
### 35.8 Community engagement analytics
### 35.9 Support and accessibility analytics
### 35.10 Course improvement evidence
### 35.11 MEAL dashboard users
### 35.12 Aggregation and privacy rules
### 35.13 Recommended indicators
### 35.14 Adaptive improvement loop
### 35.15 Data export rules
### 35.16 MEAL acceptance criteria

## 36. Course Feedback and Learning-Use Follow-Up

### 36.1 End-of-course feedback
### 36.2 Module-level feedback
### 36.3 Post-course application survey
### 36.4 Optional practical proof / application story
### 36.5 Feedback dashboard
### 36.6 Course improvement decision log
### 36.7 Feedback privacy rules

---

# Part 11 — Design System, Visual Assets, Accessibility, and Mobile Standards

## 37. Design System Specification

### 37.1 Purpose
### 37.2 Visual identity principles
### 37.3 Color tokens
### 37.4 Typography scale
### 37.5 Spacing scale
### 37.6 Breakpoints
### 37.7 Buttons
### 37.8 Cards
### 37.9 Badges and chips
### 37.10 Forms and inputs
### 37.11 Alerts and messages
### 37.12 Modals and drawers
### 37.13 Progress indicators
### 37.14 Tables
### 37.15 Empty states
### 37.16 Loading skeletons
### 37.17 Toast notifications
### 37.18 Icon system
### 37.19 Image ratios and visual asset use
### 37.20 Component acceptance criteria

## 38. Visual Asset Standards

### 38.1 General visual style
### 38.2 Local CSO context requirements
### 38.3 Course thumbnail standards
### 38.4 Landing page hero asset standards
### 38.5 Catalog hero visual standards
### 38.6 Course player visual standards
### 38.7 Community visual standards
### 38.8 Certificate visual standards
### 38.9 What visuals must avoid
### 38.10 Alt text requirements
### 38.11 Asset naming and storage

## 39. Accessibility and Mobile QA Checklist

### 39.1 Accessibility target
### 39.2 Keyboard navigation
### 39.3 Visible focus states
### 39.4 Heading order
### 39.5 Form labels and error handling
### 39.6 Color contrast
### 39.7 Alt text and decorative images
### 39.8 Captions and transcripts
### 39.9 No essential meaning by color alone
### 39.10 Tap target size
### 39.11 Modal and drawer accessibility
### 39.12 Reduced motion
### 39.13 Mobile-first behavior
### 39.14 Low-bandwidth considerations
### 39.15 Accessibility QA acceptance criteria

---

# Part 12 — Technical Architecture, API, Data Models, and Integration

## 40. Technical Architecture Overview

### 40.1 Platform architecture principle
### 40.2 Central identity model
### 40.3 Course application model
### 40.4 Main platform and course integration
### 40.5 Public vs protected routes
### 40.6 Data ownership
### 40.7 Security baseline
### 40.8 Audit logging
### 40.9 External course integration by URL
### 40.10 Future SSO/API integration

## 41. Core Data Models

### 41.1 User
### 41.2 Organization
### 41.3 UserOrganization
### 41.4 Consent
### 41.5 Course
### 41.6 CourseAccessRule
### 41.7 Enrollment
### 41.8 ModuleProgress
### 41.9 LessonProgress
### 41.10 PortfolioOutput
### 41.11 AssessmentAttempt
### 41.12 Certificate
### 41.13 SupportTicket
### 41.14 ForumSpace
### 41.15 ForumPost
### 41.16 ForumReply
### 41.17 CommunitySpace
### 41.18 CommunityEvent
### 41.19 SharedResource
### 41.20 AuditLog

## 42. API and Integration Specification

### 42.1 API principles
### 42.2 Authentication endpoints
### 42.3 Course endpoints
### 42.4 Enrollment endpoints
### 42.5 Progress endpoints
### 42.6 Portfolio endpoints
### 42.7 Assessment endpoints
### 42.8 Certificate endpoints
### 42.9 Certificate verification endpoints
### 42.10 Profile and organization endpoints
### 42.11 Forum and community endpoints
### 42.12 Support endpoints
### 42.13 Privacy endpoints
### 42.14 Admin endpoints
### 42.15 Standard error response format
### 42.16 Common error codes
### 42.17 API acceptance criteria

## 43. Security, Audit, and File Handling

### 43.1 Authentication security
### 43.2 Role-based access control
### 43.3 Session management
### 43.4 Password reset security
### 43.5 Rate limiting
### 43.6 Sensitive log redaction
### 43.7 Audit log requirements
### 43.8 File upload rules
### 43.9 Allowed file types
### 43.10 File size limits
### 43.11 File scanning and storage
### 43.12 Public vs private files
### 43.13 Backup and recovery
### 43.14 Security acceptance criteria

---

# Part 13 — Policy Pages and Public Trust

## 44. Policy and Trust Pages

### 44.1 Terms of Use
### 44.2 Privacy Notice
### 44.3 Accessibility Statement
### 44.4 Community Guidelines
### 44.5 Certificate Policy
### 44.6 Data Request Policy
### 44.7 Content Sharing Policy
### 44.8 Support and Safeguarding Note
### 44.9 Partner recognition and disclaimers

---

# Part 14 — End-to-End User Journeys and Acceptance Testing

## 45. End-to-End Learner Journeys

### 45.1 Public visitor explores the Hub
### 45.2 Public visitor browses catalog
### 45.3 Learner registers from course page
### 45.4 Learner signs in and enrolls
### 45.5 Learner starts course
### 45.6 Learner saves portfolio output
### 45.7 Learner resumes course
### 45.8 Learner completes final assessment
### 45.9 Learner receives certificate
### 45.10 Third party verifies certificate
### 45.11 Learner joins discussion space
### 45.12 Learner updates privacy settings
### 45.13 Learner requests support
### 45.14 Learner requests data export or account deletion

## 46. Admin and Operations Journeys

### 46.1 Admin publishes course
### 46.2 Admin assigns restricted course access
### 46.3 Support agent resolves access issue
### 46.4 Moderator handles reported post
### 46.5 Admin reissues certificate
### 46.6 Admin archives course
### 46.7 MEAL focal person reviews course performance
### 46.8 Admin handles privacy request

## 47. Consolidated Acceptance Criteria

### 47.1 Public experience acceptance criteria
### 47.2 Account and identity acceptance criteria
### 47.3 Course discovery and enrollment acceptance criteria
### 47.4 Course player acceptance criteria
### 47.5 Portfolio acceptance criteria
### 47.6 Assessment and certificate acceptance criteria
### 47.7 Dashboard and progress acceptance criteria
### 47.8 Community and forum acceptance criteria
### 47.9 Support and privacy acceptance criteria
### 47.10 Admin and operations acceptance criteria
### 47.11 MEAL and analytics acceptance criteria
### 47.12 Design and accessibility acceptance criteria
### 47.13 API and security acceptance criteria

---

# Appendices

## Appendix A — Glossary
## Appendix B — Route Map Table
## Appendix C — Role and Permission Matrix
## Appendix D — Course Metadata Schema
## Appendix E — Data Model Summary
## Appendix F — API Endpoint Summary
## Appendix G — Course Publishing Checklist
## Appendix H — Accessibility QA Checklist
## Appendix I — Safe Participation Checklist
## Appendix J — Certificate Template Requirements
## Appendix K — MEAL Indicator Reference
## Appendix L — Standard Error, Empty, Loading, and Success States

