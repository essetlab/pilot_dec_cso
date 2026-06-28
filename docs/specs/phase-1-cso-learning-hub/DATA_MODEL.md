# DATA_MODEL.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Data Model Specification

## 1. Document purpose

This file defines the deterministic Phase 1 data model for the CSO Learning Hub.

Codex must use this file as the authoritative guide for database schema, ORM models, seed data structure, relationships, status enums, and future-compatible fields.

Codex must not invent unrelated models, CRM structures, donor-management tables, or Phase 2/3 modules unless explicitly instructed in a later approved change note.

---

## 2. Data model principles

## 2.1 Phase 1 delivery first

The data model must support the Phase 1 e-learning MVP:

1. users;
2. roles;
3. CSO organizations;
4. cohorts;
5. courses;
6. course versions;
7. modules;
8. lessons;
9. content blocks;
10. resources;
11. quizzes;
12. quiz questions;
13. quiz attempts;
14. enrollments;
15. lesson progress;
16. certificates;
17. feedback;
18. monitoring;
19. audit logs.

## 2.2 Future-ready without overbuilding

The data model must not fully implement future-phase modules, but it must avoid blocking them.

It must remain extensible for later:

1. CSO diagnosis;
2. capacity maps;
3. action maps;
4. practical proof submissions;
5. badges;
6. knowledge resources;
7. collaboration spaces;
8. co-creation workspaces.

## 2.3 Clean authoring support

The data model must support a professional block-based Course Builder.

Course content must not be stored as one large unstructured HTML field only.

Courses must be structured as:

```txt
Course → CourseVersion → Module → Lesson → ContentBlock
```

## 2.4 Organization-aware learning

The platform works with CSOs, not only individual participants.

Participants must be linkable to organizations and cohorts.

## 2.5 Version-aware publishing

Published course content should be stable enough to preserve participant progress and certificate records.

Course versions must support draft and published states.

## 2.6 Avoid hard deletion

For important records, prefer `isActive`, `archivedAt`, or status fields rather than hard deletion, especially where records are used by participant progress, certificates, or monitoring.

---

# 3. Required enums

The following enums are recommended. Names may be adapted to existing repo conventions, but the meaning must remain stable.

## 3.1 RoleKey

```txt
SUPER_ADMIN
PLATFORM_ADMIN
COURSE_CREATOR
COURSE_REVIEWER
FACILITATOR
CSO_FOCAL_PERSON
PARTICIPANT
ME_VIEWER
```

## 3.2 UserStatus

```txt
ACTIVE
INVITED
SUSPENDED
DEACTIVATED
```

## 3.3 OrganizationStatus

```txt
ACTIVE
INACTIVE
ARCHIVED
```

## 3.4 OrganizationFormalityStatus

```txt
FORMAL_REGISTERED
INFORMAL
COMMUNITY_BASED
UNKNOWN
NOT_APPLICABLE
```

## 3.5 CourseStatus

```txt
DRAFT
READY_FOR_REVIEW
RETURNED_FOR_REVISION
APPROVED
PUBLISHED
UNPUBLISHED
ARCHIVED
```

## 3.6 CourseLevel

```txt
INTRODUCTORY
FOUNDATIONAL
INTERMEDIATE
ADVANCED
MIXED
```

Course levels may also be stored as reference data if the platform uses configurable lookups.

## 3.7 CourseVisibility

```txt
PUBLIC
ASSIGNED_ONLY
PRIVATE
```

## 3.8 EnrollmentStatus

```txt
NOT_STARTED
IN_PROGRESS
COMPLETED
WITHDRAWN
ARCHIVED
```

## 3.9 LessonProgressStatus

```txt
NOT_STARTED
IN_PROGRESS
COMPLETED
```

## 3.10 ContentBlockType

```txt
TEXT
VIDEO
AUDIO
IMAGE
RESOURCE
EXTERNAL_LINK
CASE_STUDY
REFLECTION_PROMPT
KEY_MESSAGE
ACCORDION
FLASHCARD
BUTTON_CTA
KNOWLEDGE_CHECK
MULTIPLE_CHOICE_QUESTION
TRUE_FALSE_QUESTION
SHORT_ANSWER_PROMPT
BRANCHING_SCENARIO
PRACTICAL_ACTIVITY_PROMPT
```

## 3.11 QuizQuestionType

```txt
MULTIPLE_CHOICE
TRUE_FALSE
```

Optional future-compatible value:

```txt
SHORT_ANSWER
```

Short answer must not be auto-scored in Phase 1 unless explicitly implemented.

## 3.12 QuizAttemptStatus

```txt
IN_PROGRESS
SUBMITTED
PASSED
FAILED
EXPIRED
```

## 3.13 CertificateStatus

```txt
ISSUED
REVOKED
EXPIRED
```

## 3.14 FeedbackType

```txt
COURSE_FEEDBACK
LESSON_FEEDBACK
PLATFORM_FEEDBACK
PILOT_FEEDBACK
```

## 3.15 AuditActionType

```txt
USER_CREATED
USER_UPDATED
USER_DEACTIVATED
ROLE_ASSIGNED
ROLE_REMOVED
ORGANIZATION_CREATED
ORGANIZATION_UPDATED
COHORT_CREATED
COHORT_UPDATED
COURSE_CREATED
COURSE_UPDATED
COURSE_STATUS_CHANGED
COURSE_SUBMITTED_FOR_REVIEW
COURSE_RETURNED_FOR_REVISION
COURSE_APPROVED
COURSE_PUBLISHED
COURSE_UNPUBLISHED
COURSE_ARCHIVED
CERTIFICATE_ISSUED
CERTIFICATE_REVOKED
REFERENCE_DATA_UPDATED
LOGIN
LOGOUT
```

---

# 4. Core entities

## 4.1 User

### Purpose

Represents every person with access to the platform.

### Required fields

```txt
id
fullName
email
passwordHash or authProviderId
status
createdAt
updatedAt
lastLoginAt
```

### Recommended optional fields

```txt
phone
preferredLanguage
region
profilePhotoUrl
organizationId
primaryCohortId
```

### Relationships

```txt
User has many UserRoleAssignment
User belongs to Organization, optional
User belongs to Cohort, optional
User has many Course as creator
User has many Enrollment
User has many QuizAttempt
User has many Certificate
User has many Feedback
User has many AuditLog as actor
```

### Rules

1. Email must be unique.
2. Participant users may be linked to one organization.
3. Admins and creators may or may not be linked to an organization.
4. Deactivated users cannot sign in.
5. User records linked to certificates or progress must not be hard-deleted.

---

## 4.2 Role

### Purpose

Defines available platform roles.

### Required fields

```txt
id
key
name
description
isSystemRole
createdAt
updatedAt
```

### Relationships

```txt
Role has many UserRoleAssignment
```

### Rules

1. System roles must not be deleted.
2. Role keys must match the approved RoleKey enum.

---

## 4.3 UserRoleAssignment

### Purpose

Assigns one or more roles to users.

### Required fields

```txt
id
userId
roleId
assignedById
assignedAt
isActive
```

### Optional future-compatible fields

```txt
scopeType
scopeId
expiresAt
```

### Relationships

```txt
UserRoleAssignment belongs to User
UserRoleAssignment belongs to Role
UserRoleAssignment belongs to User as assignedBy
```

### Rules

1. A user may have multiple roles.
2. At least one active Super Admin must exist.
3. Course Creator access must require active role assignment.

---

## 4.4 Organization

### Purpose

Represents a CSO, CBO, grassroots organization, informal group, or other participating organization.

### Required fields

```txt
id
name
status
createdAt
updatedAt
```

### Recommended fields

```txt
shortName
region
zone
woreda
organizationTypeId
formalityStatus
registrationNumber
focalPersonName
focalPersonEmail
focalPersonPhone
notes
```

### Relationships

```txt
Organization has many User
Organization has many CohortOrganization
Organization has many Enrollment through User
```

### Rules

1. Organization name should be unique where practical.
2. Organizations with learning history should be archived rather than deleted.
3. Organization records support monitoring and future capacity-development tracking.

---

## 4.5 Cohort

### Purpose

Groups participants and/or organizations for learning delivery and monitoring.

### Required fields

```txt
id
name
status
startDate
endDate
createdAt
updatedAt
```

### Recommended fields

```txt
description
programmeName
region
```

### Relationships

```txt
Cohort has many User
Cohort has many CohortOrganization
Cohort has many CourseAssignment
```

### Rules

1. A cohort may include many organizations.
2. A cohort may include many participants.
3. A cohort may be assigned one or more courses.

---

## 4.6 CohortOrganization

### Purpose

Many-to-many join between Cohort and Organization.

### Required fields

```txt
id
cohortId
organizationId
createdAt
```

### Relationships

```txt
CohortOrganization belongs to Cohort
CohortOrganization belongs to Organization
```

### Rules

1. Prevent duplicate cohort-organization pairings.

---

# 5. Course authoring entities

## 5.1 CapacityArea

### Purpose

Defines the capacity areas used to categorize courses and later support capacity diagnostics.

### Required fields

```txt
id
name
slug
description
isActive
createdAt
updatedAt
```

### Recommended starter values

```txt
Governance
Financial Management
Proposal Development
Project Cycle Management
MEAL
Safeguarding
Advocacy
Human Rights-Based Approach
Organizational Development
Partnership and Networking
Compliance and Reporting
```

### Relationships

```txt
CapacityArea has many CourseCapacityArea
```

### Rules

1. Capacity areas should be deactivated rather than hard-deleted if used.
2. Courses must have at least one capacity area before publication.

---

## 5.2 Course

### Purpose

Represents a learning course as a high-level entity.

### Required fields

```txt
id
title
slug
shortDescription
longDescription
targetAudience
language
level
visibility
status
certificateEligible
finalTestRequired
defaultPassThreshold
estimatedDurationMinutes
createdById
assignedCreatorId
createdAt
updatedAt
archivedAt
```

### Recommended optional fields

```txt
targetCsoProfile
capacityGapAddressed
intendedPracticeImprovement
recommendedPrerequisites
relatedFollowUpSupport
coverImageUrl
```

### Relationships

```txt
Course belongs to User as createdBy
Course belongs to User as assignedCreator
Course has many CourseVersion
Course has many CourseCapacityArea
Course has many LearningOutcome
Course has many CourseAssignment
Course has many Enrollment
Course has many Feedback
```

### Rules

1. Course slug must be unique.
2. New courses start as DRAFT.
3. Only PUBLISHED courses are visible in participant-facing routes.
4. Course must have at least one CourseVersion.
5. Course must not be hard-deleted if participant progress exists.

---

## 5.3 CourseCapacityArea

### Purpose

Many-to-many join between Course and CapacityArea.

### Required fields

```txt
id
courseId
capacityAreaId
createdAt
```

### Relationships

```txt
CourseCapacityArea belongs to Course
CourseCapacityArea belongs to CapacityArea
```

### Rules

1. Prevent duplicate course-capacity area pairings.
2. At least one capacity area is required before publication.

---

## 5.4 LearningOutcome

### Purpose

Defines learning outcomes for a course.

### Required fields

```txt
id
courseId
statement
order
createdAt
updatedAt
```

### Optional fields

```txt
moduleId
lessonId
```

### Relationships

```txt
LearningOutcome belongs to Course
LearningOutcome may belong to Module
LearningOutcome may belong to Lesson
LearningOutcome has many QuizQuestionLearningOutcome
```

### Rules

1. A course must have at least one learning outcome before publication.
2. Outcome statements should be concise and observable.

---

## 5.5 CourseVersion

### Purpose

Represents a draft or published version of course content.

### Required fields

```txt
id
courseId
versionNumber
status
changeNotes
createdById
publishedById
createdAt
updatedAt
publishedAt
archivedAt
```

### Relationships

```txt
CourseVersion belongs to Course
CourseVersion belongs to User as createdBy
CourseVersion belongs to User as publishedBy
CourseVersion has many Module
CourseVersion has one Quiz or many Quiz
```

### Rules

1. Each course must have at least one CourseVersion.
2. Participant progress should be linked to the course version used at time of enrollment or completion.
3. Publishing should set course and version status consistently.
4. Changes to a published course should not silently alter certificate history.

---

## 5.6 Module

### Purpose

Represents a section within a course version.

### Required fields

```txt
id
courseVersionId
title
description
order
estimatedDurationMinutes
createdAt
updatedAt
```

### Relationships

```txt
Module belongs to CourseVersion
Module has many Lesson
Module has many LearningOutcome, optional
```

### Rules

1. Module order must be stable.
2. A module must have at least one lesson before publication.

---

## 5.7 Lesson

### Purpose

Represents a lesson inside a module.

### Required fields

```txt
id
moduleId
title
description
order
estimatedDurationMinutes
completionRequired
createdAt
updatedAt
```

### Recommended fields

```txt
completionRule
```

### Relationships

```txt
Lesson belongs to Module
Lesson has many ContentBlock
Lesson has many LessonProgress
Lesson has many LearningOutcome, optional
```

### Rules

1. Lesson order must be stable.
2. A lesson must have at least one content block before publication.
3. CompletionRequired controls whether lesson is required for certificate eligibility.

---

## 5.8 ContentBlock

### Purpose

Represents one block of structured learning content inside a lesson.

### Required fields

```txt
id
lessonId
type
title
order
configJson
isRequired
estimatedDurationMinutes
createdAt
updatedAt
```

### Recommended fields

```txt
accessibilityNotes
hasAccessibilityWarning
```

### Relationships

```txt
ContentBlock belongs to Lesson
ContentBlock may reference Resource
ContentBlock may reference QuizQuestion, depending on implementation
```

### Rules

1. Block type must match ContentBlockType.
2. Block configuration must be stored in structured JSON or equivalent typed sub-models.
3. Blocks must be orderable.
4. Blocks should be duplicable.
5. Blocks should not contain governance, CRM, diagnosis, or monitoring data.
6. ContentBlock config must support rendering in both Build Studio preview and participant course player.

---

# 6. Content block configuration requirements

The following are recommended `configJson` structures. Codex may implement typed schemas, but these fields must be supported in substance.

## 6.1 TEXT

```json
{
  "body": "",
  "format": "rich_text",
  "emphasisStyle": "default"
}
```

## 6.2 VIDEO

```json
{
  "videoUrl": "",
  "uploadId": "",
  "transcript": "",
  "captionAvailable": false,
  "durationSeconds": 0,
  "completionRule": "view"
}
```

## 6.3 AUDIO

```json
{
  "audioUrl": "",
  "transcript": "",
  "durationSeconds": 0
}
```

## 6.4 IMAGE

```json
{
  "imageUrl": "",
  "altText": "",
  "caption": ""
}
```

## 6.5 RESOURCE

```json
{
  "resourceId": "",
  "downloadLabel": "",
  "description": ""
}
```

## 6.6 EXTERNAL_LINK

```json
{
  "url": "",
  "label": "",
  "description": "",
  "openInNewTab": true
}
```

## 6.7 CASE_STUDY

```json
{
  "scenario": "",
  "guidingQuestion": "",
  "learningPoint": ""
}
```

## 6.8 REFLECTION_PROMPT

```json
{
  "prompt": "",
  "responseRequired": false,
  "privateToParticipant": true
}
```

Phase 1 may store reflection responses later or not store them. If responses are stored, they must be private by default.

## 6.9 KEY_MESSAGE

```json
{
  "message": "",
  "style": "info"
}
```

## 6.10 ACCORDION

```json
{
  "items": [
    {
      "title": "",
      "body": ""
    }
  ],
  "allowMultipleOpen": true
}
```

## 6.11 FLASHCARD

```json
{
  "cards": [
    {
      "front": "",
      "back": ""
    }
  ],
  "shuffle": false
}
```

## 6.12 BUTTON_CTA

```json
{
  "label": "",
  "targetUrl": "",
  "style": "primary"
}
```

## 6.13 KNOWLEDGE_CHECK

```json
{
  "question": "",
  "options": [
    {
      "id": "A",
      "text": ""
    }
  ],
  "correctOptionId": "",
  "correctFeedback": "",
  "incorrectFeedback": "",
  "allowRetry": true
}
```

## 6.14 MULTIPLE_CHOICE_QUESTION

```json
{
  "questionId": ""
}
```

May reference a QuizQuestion record or contain inline question config. Prefer referencing QuizQuestion where final test scoring is needed.

## 6.15 TRUE_FALSE_QUESTION

```json
{
  "questionId": ""
}
```

## 6.16 SHORT_ANSWER_PROMPT

```json
{
  "prompt": "",
  "guidance": "",
  "responseRequired": false
}
```

Phase 1 short answer is for reflection only unless a later approved spec adds manual grading.

## 6.17 BRANCHING_SCENARIO

```json
{
  "scenario": "",
  "decisions": [
    {
      "id": "",
      "label": "",
      "feedback": "",
      "nextStep": ""
    }
  ],
  "learningPoint": ""
}
```

## 6.18 PRACTICAL_ACTIVITY_PROMPT

```json
{
  "instruction": "",
  "expectedOutput": "",
  "estimatedTimeMinutes": 0,
  "futureProofEligible": false
}
```

This does not implement full practical proof verification in Phase 1.

---

# 7. Resource entities

## 7.1 Resource

### Purpose

Represents a downloadable or reusable course resource.

### Required fields

```txt
id
courseId
courseVersionId
title
description
fileUrl
fileName
fileType
fileSizeBytes
downloadLabel
uploadedById
createdAt
updatedAt
archivedAt
```

### Recommended fields

```txt
accessibilityChecked
accessibilityNotes
```

### Relationships

```txt
Resource belongs to Course
Resource belongs to CourseVersion
Resource belongs to User as uploadedBy
Resource may be referenced by ContentBlock
```

### Rules

1. Resource must have a clear title and download label.
2. Inaccessible resources should show an accessibility warning.
3. Resources used by published courses should not be hard-deleted.

---

# 8. Quiz and assessment entities

## 8.1 Quiz

### Purpose

Represents a quiz or final test for a course version.

### Required fields

```txt
id
courseVersionId
title
description
isFinalTest
passThreshold
retakeAllowed
maxAttempts
createdAt
updatedAt
```

### Relationships

```txt
Quiz belongs to CourseVersion
Quiz has many QuizQuestion
Quiz has many QuizAttempt
```

### Rules

1. Certificate-eligible courses must have a final test.
2. Default pass threshold should be 80 unless configured otherwise.
3. Final test pass is required for certificate issuance.

---

## 8.2 QuizQuestion

### Purpose

Represents a scored question in a quiz/final test.

### Required fields

```txt
id
quizId
type
questionText
order
points
explanation
createdAt
updatedAt
```

### Required configuration field

```txt
configJson
```

Example for multiple choice:

```json
{
  "options": [
    {
      "id": "A",
      "text": ""
    },
    {
      "id": "B",
      "text": ""
    }
  ],
  "correctOptionIds": ["A"]
}
```

Example for true/false:

```json
{
  "correctValue": true
}
```

### Relationships

```txt
QuizQuestion belongs to Quiz
QuizQuestion has many QuizQuestionLearningOutcome
```

### Rules

1. Every scored question must have a correct answer.
2. Question order must be stable.
3. Short answer should not be auto-scored in Phase 1 unless explicitly implemented.

---

## 8.3 QuizQuestionLearningOutcome

### Purpose

Optional join table linking questions to outcomes.

### Required fields

```txt
id
quizQuestionId
learningOutcomeId
createdAt
```

### Relationships

```txt
QuizQuestionLearningOutcome belongs to QuizQuestion
QuizQuestionLearningOutcome belongs to LearningOutcome
```

---

## 8.4 QuizAttempt

### Purpose

Represents one participant attempt at a quiz/final test.

### Required fields

```txt
id
quizId
userId
courseId
courseVersionId
status
score
maxScore
percentage
passed
startedAt
submittedAt
createdAt
updatedAt
```

### Recommended field

```txt
answersJson
```

### Relationships

```txt
QuizAttempt belongs to Quiz
QuizAttempt belongs to User
QuizAttempt belongs to Course
QuizAttempt belongs to CourseVersion
```

### Rules

1. Submitted attempts must preserve answers and score.
2. Passing status must be computed from percentage and passThreshold.
3. Certificate eligibility should check the participant’s passing final test attempt.

---

# 9. Learning participation entities

## 9.1 CourseAssignment

### Purpose

Assigns a course to a user, cohort, or organization.

### Required fields

```txt
id
courseId
assignedById
assignedAt
assignmentType
targetUserId
targetCohortId
targetOrganizationId
dueDate
isActive
```

### Relationships

```txt
CourseAssignment belongs to Course
CourseAssignment belongs to User as assignedBy
CourseAssignment may belong to User as targetUser
CourseAssignment may belong to Cohort as targetCohort
CourseAssignment may belong to Organization as targetOrganization
```

### Rules

1. Assignment target must be user, cohort, or organization.
2. Course must be published or publish-ready before assignment, depending on implementation rule.
3. Assignments should support participant dashboard display.

---

## 9.2 Enrollment

### Purpose

Represents a participant’s enrollment in a course.

### Required fields

```txt
id
userId
courseId
courseVersionId
status
progressPercent
enrolledAt
startedAt
completedAt
lastAccessedAt
createdAt
updatedAt
```

### Relationships

```txt
Enrollment belongs to User
Enrollment belongs to Course
Enrollment belongs to CourseVersion
Enrollment has many LessonProgress
Enrollment has many Certificate
```

### Rules

1. A participant should have only one active enrollment per course version unless retake/version rules allow otherwise.
2. Completion requires required lesson completion and final test pass if applicable.
3. Enrollment should preserve courseVersionId.

---

## 9.3 LessonProgress

### Purpose

Tracks participant progress at lesson level.

### Required fields

```txt
id
enrollmentId
lessonId
status
startedAt
completedAt
lastAccessedAt
createdAt
updatedAt
```

### Recommended fields

```txt
progressJson
```

### Relationships

```txt
LessonProgress belongs to Enrollment
LessonProgress belongs to Lesson
```

### Rules

1. Required lessons must be completed for certificate eligibility.
2. Lesson completion should update enrollment progress.

---

# 10. Certificate entities

## 10.1 Certificate

### Purpose

Represents an issued certificate.

### Required fields

```txt
id
certificateCode
userId
courseId
courseVersionId
enrollmentId
quizAttemptId
status
issuedAt
revokedAt
pdfUrl
createdAt
updatedAt
```

### Recommended fields

```txt
participantNameSnapshot
courseTitleSnapshot
issuerNameSnapshot
completionDate
```

### Relationships

```txt
Certificate belongs to User
Certificate belongs to Course
Certificate belongs to CourseVersion
Certificate belongs to Enrollment
Certificate belongs to QuizAttempt
```

### Rules

1. Certificate code must be unique.
2. Certificate must only be issued after completion/pass rules are met.
3. Certificate should preserve title/name snapshots so later course edits do not corrupt issued certificates.
4. Revoked certificates must remain in the system with revoked status.

---

## 10.2 CertificateTemplate

### Purpose

Optional Phase 1 model for certificate display settings.

### Required fields if implemented

```txt
id
name
issuerName
signatoryName
signatoryTitle
logoUrl
footerText
isDefault
createdAt
updatedAt
```

### Rules

1. One default template may exist.
2. Certificate template changes should not alter historical certificate snapshot data unless intentionally regenerated.

---

# 11. Feedback entities

## 11.1 Feedback

### Purpose

Captures participant or user feedback.

### Required fields

```txt
id
type
userId
courseId
lessonId
rating
usefulnessRating
clarityRating
accessibilityIssue
comment
createdAt
```

### Relationships

```txt
Feedback belongs to User
Feedback may belong to Course
Feedback may belong to Lesson
```

### Rules

1. Course completion feedback must be linkable to course.
2. Feedback should be visible in monitoring summaries.
3. Sensitive comments should not be overexposed.

---

# 12. Monitoring support

Monitoring can be computed from core entities rather than stored in separate tables.

Key computed metrics:

1. total users by role;
2. total participants;
3. total organizations;
4. total cohorts;
5. total courses;
6. published courses;
7. enrollments;
8. active participants;
9. completion rate;
10. final test pass rate;
11. certificates issued;
12. course feedback rating;
13. cohort progress;
14. organization-level participation.

If denormalized monitoring snapshots are needed later, add `MonitoringSnapshot` only with explicit approval.

---

# 13. Audit and activity logging

## 13.1 AuditLog

### Purpose

Records critical actions.

### Required fields

```txt
id
actorUserId
actionType
entityType
entityId
description
metadataJson
createdAt
```

### Relationships

```txt
AuditLog belongs to User as actor
```

### Rules

1. Critical admin, publishing, role, certificate, and status actions must be logged.
2. Audit logs should not be hard-deleted.
3. Do not store sensitive passwords, tokens, or private file contents in metadataJson.

---

# 14. Reference data entities

## 14.1 ReferenceDataItem

### Purpose

Optional generic lookup table if the project chooses not to create separate lookup models.

### Required fields

```txt
id
category
key
label
description
order
isActive
createdAt
updatedAt
```

### Supported categories

```txt
CAPACITY_AREA
COURSE_LEVEL
ORGANIZATION_TYPE
REGION
LANGUAGE
COHORT_TYPE
```

### Rule

If using specific tables such as CapacityArea, do not duplicate the same reference values in ReferenceDataItem unless intentional.

---

# 15. Future-compatible placeholders

The following entities are not required as full Phase 1 modules, but the architecture should not block them.

## 15.1 DiagnosisRecord, future

Future purpose:

Store CSO capacity diagnosis and needs analysis.

Do not implement full UI in Phase 1.

## 15.2 CapacityMap, future

Future purpose:

Map capacity gaps to learning and non-learning support.

Do not implement full UI in Phase 1.

## 15.3 ActionMap, future

Future purpose:

Map capacity goals to practice actions, follow-up support, and evidence.

Do not implement full UI in Phase 1.

## 15.4 PracticalProofSubmission, future

Future purpose:

Allow participants/CSOs to submit applied evidence after learning.

Do not implement full verification workflow in Phase 1.

## 15.5 Badge, future

Future purpose:

Issue verified achievement badges separate from certificates.

Do not implement in Phase 1.

## 15.6 KnowledgeResource, future

Future purpose:

Support knowledge management repository.

Do not implement in Phase 1.

## 15.7 CollaborationSpace, future

Future purpose:

Support communities of practice and peer learning.

Do not implement in Phase 1.

## 15.8 CoCreationWorkspace, future

Future purpose:

Support collaborative design/co-creation.

Do not implement in Phase 1.

---

# 16. Minimum publication readiness data rules

A course cannot be published unless:

1. Course title exists.
2. Short description exists.
3. At least one capacity area is linked.
4. At least one learning outcome exists.
5. At least one module exists.
6. Each module has at least one lesson.
7. Each required lesson has at least one content block.
8. Certificate-eligible courses have a final test.
9. Final test has at least one scored question.
10. All scored questions have correct answers.
11. Certificate pass threshold exists.
12. Course has been approved or Admin has publish authority.

---

# 17. Certificate issuance data rules

The system shall issue a certificate only when:

1. user has an active enrollment;
2. enrollment is completed or completion criteria are met;
3. all required lessons are complete;
4. course is certificate eligible;
5. final test is required and passed if applicable;
6. final test score is at or above the pass threshold;
7. no certificate already exists for the same user/courseVersion unless regeneration is allowed.

---

# 18. Deletion and archival rules

## 18.1 Hard deletion should be avoided for:

1. users with progress;
2. organizations with participants;
3. courses with enrollments;
4. course versions with progress/certificates;
5. certificates;
6. quiz attempts;
7. audit logs.

## 18.2 Archival is preferred for:

1. organizations;
2. courses;
3. course versions;
4. users;
5. resources;
6. cohorts.

---

# 19. Seed data requirements

Seed data should include:

1. one Super Admin;
2. one Platform Admin;
3. one Course Creator;
4. one Course Reviewer;
5. one M&E Viewer;
6. three Participants;
7. two CSO Organizations;
8. one Cohort;
9. starter Capacity Areas;
10. one draft course;
11. one published demo course;
12. modules, lessons, and content blocks for the published demo course;
13. one quiz/final test;
14. one enrollment in progress;
15. one completed enrollment;
16. one issued certificate;
17. sample feedback.

Seed data must not include sensitive real personal data.

---

# 20. Suggested model relationship overview

```txt
User
 ├── UserRoleAssignment ── Role
 ├── Organization
 ├── Cohort
 ├── Enrollment ── Course ── CourseVersion ── Module ── Lesson ── ContentBlock
 ├── QuizAttempt ── Quiz ── QuizQuestion
 ├── Certificate
 └── Feedback

Organization
 ├── User
 └── CohortOrganization ── Cohort

Course
 ├── CourseCapacityArea ── CapacityArea
 ├── LearningOutcome
 ├── CourseVersion
 ├── CourseAssignment
 ├── Enrollment
 └── Feedback
```

---

# 21. Codex implementation rules

Codex must follow these data model rules:

1. Do not store a full course only as one HTML blob.
2. Do not create a CRM-style data model.
3. Do not create full diagnosis/capacity/action map models unless explicitly requested later.
4. Preserve organization and cohort relationships.
5. Preserve course versioning.
6. Preserve certificate eligibility and pass threshold rules.
7. Preserve audit logging for critical actions.
8. Use enums/status fields consistently.
9. Prefer soft delete/archive for historical records.
10. Keep content block configuration renderable by both Build Studio and participant course player.

---

# 22. Final data model statement

The Phase 1 data model shall support a polished e-learning platform with professional course authoring, participant learning, quizzes, certificates, organizations, cohorts, monitoring, and auditability.

It shall also establish the minimum foundation needed for the wider CSO Learning Hub without implementing Phase 2/3 modules prematurely.
