# SEED_DATA_PLAN.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Seed Data Plan

## 1. Document purpose

This file defines the deterministic seed/demo data plan for Phase 1 of the CSO Learning Hub.

Codex must use this file when creating seed scripts, demo accounts, test records, and sample data for development, QA, stakeholder demonstration, and pilot readiness.

Seed data must support the full Phase 1 demo flow:

Admin setup → Course Creator builds course → Admin reviews/publishes → Participant completes course → Final test → Certificate → Feedback → Monitoring.

---

## 2. Seed data principles

## 2.1 Safe demo data only

Seed data must not include sensitive real personal data.

Use fictional but realistic names, organizations, emails, and course examples.

## 2.2 Programme-relevant examples

Seed data should reflect the CSF+ / local and grassroots CSO capacity-development context.

Use examples related to:

1. proposal development;
2. financial management;
3. governance;
4. MEAL;
5. safeguarding;
6. HRBA;
7. advocacy;
8. organizational development.

## 2.3 Support end-to-end testing

Seed data must allow testers to verify:

1. user roles;
2. route permissions;
3. organization/cohort links;
4. course creation;
5. Build Studio content;
6. published learner course;
7. quiz/final test;
8. certificate issuance;
9. feedback;
10. monitoring dashboard.

## 2.4 Avoid over-seeding

Seed data should be enough for demo and QA, but not so much that the system feels cluttered.

---

# 3. Required demo users

The seed script shall create the following users.

Passwords may use a shared development password only in local/demo environments.

Recommended demo password:

```txt
ChangeMe123!
```

If the repository has another auth approach, adapt accordingly and document login method.

## 3.1 Super Admin

```txt
Name: Super Admin Demo
Email: superadmin@demo.local
Role: SUPER_ADMIN
Status: ACTIVE
```

Purpose:

1. full system access;
2. role/permission testing;
3. publishing authority.

## 3.2 Platform Admin

```txt
Name: Platform Admin Demo
Email: admin@demo.local
Role: PLATFORM_ADMIN
Status: ACTIVE
```

Purpose:

1. day-to-day admin testing;
2. user/org/cohort/course management;
3. monitoring access.

## 3.3 Course Creator

```txt
Name: Course Creator Demo
Email: creator@demo.local
Role: COURSE_CREATOR
Status: ACTIVE
```

Purpose:

1. course setup;
2. Build Studio;
3. course submission.

## 3.4 Course Reviewer

```txt
Name: Course Reviewer Demo
Email: reviewer@demo.local
Role: COURSE_REVIEWER
Status: ACTIVE
```

Purpose:

1. review queue;
2. approve/return testing.

## 3.5 M&E / Programme Viewer

```txt
Name: ME Viewer Demo
Email: meviewer@demo.local
Role: ME_VIEWER
Status: ACTIVE
```

Purpose:

1. monitoring dashboard access;
2. restricted read-only monitoring test.

## 3.6 Facilitator / Cohort Lead

```txt
Name: Facilitator Demo
Email: facilitator@demo.local
Role: FACILITATOR
Status: ACTIVE
```

Purpose:

1. future-ready role testing;
2. limited or placeholder role behavior.

## 3.7 CSO Focal Person

```txt
Name: CSO Focal Person Demo
Email: focal@demo.local
Role: CSO_FOCAL_PERSON
Status: ACTIVE
Organization: Hiwot Community Development Association
```

Purpose:

1. organization-linked user;
2. future organization dashboard foundation.

## 3.8 Participant 1 — in progress

```txt
Name: Participant In Progress
Email: participant1@demo.local
Role: PARTICIPANT
Status: ACTIVE
Organization: Hiwot Community Development Association
Cohort: CSF+ Grassroots Cohort 1
```

Purpose:

1. active enrollment;
2. partial progress.

## 3.9 Participant 2 — completed/certified

```txt
Name: Participant Completed
Email: participant2@demo.local
Role: PARTICIPANT
Status: ACTIVE
Organization: Hiwot Community Development Association
Cohort: CSF+ Grassroots Cohort 1
```

Purpose:

1. completed course;
2. passed final test;
3. issued certificate;
4. feedback submitted.

## 3.10 Participant 3 — no enrollment

```txt
Name: Participant New
Email: participant3@demo.local
Role: PARTICIPANT
Status: ACTIVE
Organization: Lemat Youth Initiative
Cohort: CSF+ Grassroots Cohort 1
```

Purpose:

1. empty dashboard test;
2. available courses test.

---

# 4. Required demo organizations

## 4.1 Organization 1

```txt
Name: Hiwot Community Development Association
Short name: HCDA
Region: Amhara
Organization type: Local CSO
Formality status: FORMAL_REGISTERED
Focal person: CSO Focal Person Demo
Status: ACTIVE
```

Purpose:

1. organization-level participation;
2. participant linkage;
3. certificate aggregation;
4. monitoring table.

## 4.2 Organization 2

```txt
Name: Lemat Youth Initiative
Short name: LYI
Region: Oromia
Organization type: Grassroots / Youth Group
Formality status: COMMUNITY_BASED
Focal person: Participant New, optional
Status: ACTIVE
```

Purpose:

1. second organization for monitoring filters;
2. participant with no enrollment;
3. organization empty/low activity signal.

## 4.3 Optional Organization 3

```txt
Name: Tesfa Women-Led Development Group
Short name: TWDG
Region: SNNPR or Central Ethiopia
Organization type: Women-led Community Group
Formality status: INFORMAL
Status: ACTIVE
```

Purpose:

1. optional richer demo;
2. future inclusion/gender-focused examples.

---

# 5. Required demo cohort

## 5.1 Cohort 1

```txt
Name: CSF+ Grassroots Cohort 1
Programme name: Empowering Grassroots CSOs to Promote Good Governance and Development
Description: Demo cohort for Phase 1 learning platform testing.
Start date: 2026-02-09
End date: 2026-04-30
Region: Multi-region
Status: ACTIVE
```

Linked organizations:

1. Hiwot Community Development Association
2. Lemat Youth Initiative

Linked participants:

1. Participant In Progress
2. Participant Completed
3. Participant New

Assigned courses:

1. Published demo course: Proposal Development Fundamentals for Grassroots CSOs

---

# 6. Required reference data

## 6.1 Capacity Areas

Seed the following capacity areas:

1. Governance
2. Financial Management
3. Proposal Development
4. Project Cycle Management
5. MEAL
6. Safeguarding
7. Advocacy
8. Human Rights-Based Approach
9. Organizational Development
10. Partnership and Networking
11. Compliance and Reporting

## 6.2 Course Levels

Seed:

1. Introductory
2. Foundational
3. Intermediate
4. Advanced
5. Mixed

## 6.3 Organization Types

Seed:

1. Local CSO
2. Grassroots CSO
3. Community-Based Organization
4. Youth Group
5. Women-led Organization
6. Disability-focused Organization
7. Informal Community Group
8. Network / Coalition

## 6.4 Regions

Seed Ethiopian regions and city administrations as reference values if region filtering is used.

Recommended list:

1. Addis Ababa
2. Afar
3. Amhara
4. Benishangul-Gumuz
5. Central Ethiopia
6. Dire Dawa
7. Gambela
8. Harari
9. Oromia
10. Sidama
11. Somali
12. South Ethiopia
13. Southwest Ethiopia
14. Tigray

If the platform needs a shorter list for demo, use the regions represented by demo organizations plus Addis Ababa.

## 6.5 Languages

Seed:

1. English
2. Amharic
3. Afaan Oromo
4. Tigrinya
5. Somali

Phase 1 does not need full localization support, but language metadata should be available.

---

# 7. Required demo courses

Seed at least three courses.

## 7.1 Course A — Draft course

```txt
Title: Financial Management Basics for Local CSOs
Slug: financial-management-basics-local-csos
Status: DRAFT
Creator: Course Creator Demo
Capacity Area: Financial Management
Level: Foundational
Certificate eligible: Yes
Final test required: Yes
Visibility: PRIVATE
```

Purpose:

1. test draft course visibility;
2. confirm participants cannot see draft courses;
3. Course Creator editing test.

Minimum content:

1. one module;
2. one lesson;
3. one text block;
4. missing final test or incomplete readiness to test warnings.

## 7.2 Course B — Ready for review course

```txt
Title: Safeguarding Essentials for Grassroots CSOs
Slug: safeguarding-essentials-grassroots-csos
Status: READY_FOR_REVIEW
Creator: Course Creator Demo
Capacity Area: Safeguarding
Level: Introductory
Certificate eligible: Yes
Final test required: Yes
Visibility: ASSIGNED_ONLY
```

Purpose:

1. test review queue;
2. approve/return workflow;
3. readiness checks.

Minimum content:

1. two modules;
2. two lessons;
3. text block;
4. case study block;
5. knowledge check;
6. final test with two questions.

## 7.3 Course C — Published demo course

```txt
Title: Proposal Development Fundamentals for Grassroots CSOs
Slug: proposal-development-fundamentals-grassroots-csos
Status: PUBLISHED
Creator: Course Creator Demo
Capacity Area: Proposal Development
Level: Foundational
Certificate eligible: Yes
Final test required: Yes
Default pass threshold: 80
Visibility: PUBLIC or ASSIGNED_ONLY depending on platform decision
Estimated duration: 90 minutes
Language: English
```

Purpose:

1. participant learning test;
2. Build Studio block rendering;
3. final test;
4. certificate;
5. monitoring demo.

---

# 8. Published demo course details

## 8.1 Course C description

Short description:

```txt
Learn the essential steps for turning a community problem into a clear, fundable project idea and basic proposal structure.
```

Long description:

```txt
This foundational course helps grassroots CSO staff and volunteers understand how to analyze a community problem, define a project goal, identify beneficiaries, prepare basic activities, and connect the idea to realistic results and budget thinking.
```

Target audience:

```txt
Local and grassroots CSO staff, volunteers, focal persons, and emerging community-based organizations preparing project ideas or small grant applications.
```

Capacity gap addressed:

```txt
Many grassroots CSOs have strong community knowledge but need clearer skills in structuring project ideas, writing objectives, identifying results, and preparing fundable proposals.
```

Intended practice improvement:

```txt
Participants will be able to prepare a simple project concept outline that links problem, goal, activities, expected results, and basic resource needs.
```

## 8.2 Learning outcomes

Seed these learning outcomes:

1. Explain the core elements of a simple project proposal.
2. Convert a community problem into a clear project goal and objective.
3. Identify target groups, activities, outputs, and expected results.
4. Recognize common weaknesses in grassroots CSO proposal writing.
5. Prepare a basic proposal outline for internal review or coaching.

---

# 9. Published demo course structure

## 9.1 Module 1

```txt
Title: Understanding the Proposal Logic
Description: Learn how a project idea moves from problem to goal, activities, and results.
Order: 1
Estimated duration: 35 minutes
```

### Lesson 1.1

```txt
Title: What Makes a Proposal Fundable?
Description: Introduces the core logic of a proposal.
Order: 1
Estimated duration: 15 minutes
Required: Yes
```

Blocks:

1. Key Message block
2. Text / Reading block
3. Case Study block
4. Accordion block
5. Knowledge Check block

### Lesson 1.2

```txt
Title: From Community Problem to Project Objective
Description: Shows how to write a clear objective from a community problem.
Order: 2
Estimated duration: 20 minutes
Required: Yes
```

Blocks:

1. Text / Reading block
2. Flashcard block
3. Branching Scenario block
4. Practical Activity Prompt block

## 9.2 Module 2

```txt
Title: Building the Proposal Structure
Description: Learn how to structure activities, results, and basic resource needs.
Order: 2
Estimated duration: 40 minutes
```

### Lesson 2.1

```txt
Title: Activities, Outputs, and Results
Description: Explains the difference between activities, outputs, and results.
Order: 1
Estimated duration: 20 minutes
Required: Yes
```

Blocks:

1. Video block
2. Text / Reading block
3. Flashcard block
4. Knowledge Check block

### Lesson 2.2

```txt
Title: Simple Proposal Checklist
Description: Provides a practical checklist for reviewing a proposal idea.
Order: 2
Estimated duration: 20 minutes
Required: Yes
```

Blocks:

1. Downloadable Resource block
2. Accordion block
3. Reflection Prompt block
4. Button / Call-to-Action block

## 9.3 Module 3

```txt
Title: Final Test and Next Steps
Description: Complete the final test and prepare for follow-up support.
Order: 3
Estimated duration: 15 minutes
```

### Lesson 3.1

```txt
Title: Course Summary
Description: Reviews key learning points before final test.
Order: 1
Estimated duration: 10 minutes
Required: Yes
```

Blocks:

1. Key Message block
2. Text / Reading block
3. Practical Activity Prompt block

---

# 10. Demo content block examples

## 10.1 Key Message block

Title:

```txt
A proposal is a clear promise of change.
```

Message:

```txt
A strong proposal does not only describe activities. It explains the problem, the people affected, the change expected, and how the organization will responsibly deliver that change.
```

Style:

```txt
info
```

## 10.2 Text block

Title:

```txt
The basic proposal logic
```

Body:

```txt
Most simple project proposals answer five questions: What problem are we addressing? Who is affected? What change do we want to achieve? What activities will we implement? How will we know that progress is happening?
```

## 10.3 Case Study block

Title:

```txt
A youth group wants to reduce school dropout
```

Scenario:

```txt
A youth group in a rural woreda observes that adolescent girls are dropping out of school during the transition from primary to secondary education. The group wants to prepare a small project idea but initially describes only one activity: awareness creation.
```

Guiding question:

```txt
What additional information would make this project idea stronger?
```

Learning point:

```txt
A fundable idea needs a clear problem, target group, objective, activities, expected results, and basic evidence.
```

## 10.4 Accordion block

Title:

```txt
Common proposal elements
```

Items:

1. Problem statement — explains the issue and why it matters.
2. Target group — identifies who the project will support.
3. Objective — describes the change the project aims to achieve.
4. Activities — describes what the organization will do.
5. Results — describes what should change or be produced.

## 10.5 Flashcard block

Title:

```txt
Proposal terms
```

Cards:

1. Front: Activity  
   Back: What the project does.
2. Front: Output  
   Back: The immediate product or service delivered.
3. Front: Outcome  
   Back: The expected change for people, groups, or institutions.
4. Front: Indicator  
   Back: A sign used to track progress or results.

## 10.6 Knowledge Check block

Title:

```txt
Check your understanding
```

Question:

```txt
Which statement best describes an outcome?
```

Options:

1. A training session was conducted.
2. Twenty people attended a meeting.
3. CSO staff can prepare clearer project objectives after coaching.
4. A report was printed.

Correct answer:

```txt
3
```

Correct feedback:

```txt
Correct. An outcome describes a change in knowledge, skill, behavior, or practice.
```

Incorrect feedback:

```txt
Not quite. Look for the statement that describes a change, not only an activity or output.
```

## 10.7 Branching Scenario block

Title:

```txt
Choosing a stronger project objective
```

Scenario:

```txt
Your CSO wants to support women-led savings groups. Which objective is stronger?
```

Decision options:

1. Option A: Conduct training for women.
   Feedback: This describes an activity but not the expected change.
   Next step: Try to make the objective more results-focused.
2. Option B: Improve financial recordkeeping capacity of 10 women-led savings groups within six months.
   Feedback: This is stronger because it identifies the change, target group, and timeframe.
   Next step: Continue.
3. Option C: Buy notebooks and pens.
   Feedback: This describes an input or activity, not an objective.
   Next step: Review proposal logic.

Learning point:

```txt
A strong objective describes the intended change, who will benefit, and often the timeframe.
```

## 10.8 Practical Activity Prompt block

Title:

```txt
Draft your project objective
```

Instruction:

```txt
Write one draft objective for a real project idea your organization is considering.
```

Expected output:

```txt
One sentence that includes the target group, expected change, and timeframe.
```

Estimated time:

```txt
15 minutes
```

Future proof eligible:

```txt
false
```

## 10.9 Video block

Title:

```txt
Proposal logic in five minutes
```

Video URL:

```txt
https://example.com/demo-video-placeholder
```

Transcript:

```txt
In this short lesson, we explain how a project idea moves from problem to objective, activities, outputs, and outcomes.
```

Duration:

```txt
5 minutes
```

Note:

Use a placeholder video URL unless real approved video content exists.

## 10.10 Resource block

Title:

```txt
Simple Project Idea Checklist
```

Description:

```txt
A one-page checklist for reviewing a grassroots CSO project idea before writing a full proposal.
```

Download label:

```txt
Download checklist
```

File:

```txt
demo-simple-project-idea-checklist.pdf
```

If no file upload exists yet, seed this as a placeholder resource record.

## 10.11 Reflection Prompt block

Title:

```txt
Reflect on your organization’s proposal challenge
```

Prompt:

```txt
What is the most difficult part of proposal writing for your organization right now?
```

Guidance:

```txt
Think about problem analysis, writing objectives, budgeting, evidence, or donor language.
```

## 10.12 Button / CTA block

Title:

```txt
Ready for the final test?
```

Button label:

```txt
Go to final test
```

Target:

```txt
/learn/courses/proposal-development-fundamentals-grassroots-csos/final-test
```

---

# 11. Final test seed data

## 11.1 Final test

Course:

```txt
Proposal Development Fundamentals for Grassroots CSOs
```

Title:

```txt
Final Test: Proposal Development Fundamentals
```

Pass threshold:

```txt
80
```

Retake allowed:

```txt
true
```

Max attempts:

```txt
3
```

## 11.2 Questions

### Question 1

Type:

```txt
MULTIPLE_CHOICE
```

Question:

```txt
Which of the following is the strongest project objective?
```

Options:

1. Conduct meetings in the community.
2. Improve basic financial recordkeeping practices of 15 grassroots CSOs within six months.
3. Print brochures and distribute them.
4. Organize a training hall.

Correct answer:

```txt
2
```

Explanation:

```txt
The strongest objective describes the expected change, target group, and timeframe.
```

Points:

```txt
1
```

### Question 2

Type:

```txt
TRUE_FALSE
```

Question:

```txt
An activity and an outcome mean the same thing.
```

Correct answer:

```txt
false
```

Explanation:

```txt
An activity is what the project does. An outcome is the change expected from those activities.
```

Points:

```txt
1
```

### Question 3

Type:

```txt
MULTIPLE_CHOICE
```

Question:

```txt
Which item is usually part of a basic project proposal?
```

Options:

1. Problem statement
2. Target group
3. Activities
4. All of the above

Correct answer:

```txt
4
```

Explanation:

```txt
A basic proposal usually includes the problem, target group, activities, and expected results.
```

Points:

```txt
1
```

### Question 4

Type:

```txt
TRUE_FALSE
```

Question:

```txt
A proposal is stronger when it explains why the problem matters and who is affected.
```

Correct answer:

```txt
true
```

Explanation:

```txt
A clear problem statement helps reviewers understand relevance and urgency.
```

Points:

```txt
1
```

### Question 5

Type:

```txt
MULTIPLE_CHOICE
```

Question:

```txt
What does an indicator help a CSO do?
```

Options:

1. Track progress or results
2. Replace the budget
3. Avoid planning activities
4. Remove the need for reporting

Correct answer:

```txt
1
```

Explanation:

```txt
Indicators help track whether activities and results are progressing as expected.
```

Points:

```txt
1
```

A participant must answer at least 4 out of 5 correctly to pass at 80%.

---

# 12. Enrollment and progress seed data

## 12.1 Participant In Progress

User:

```txt
Participant In Progress
```

Course:

```txt
Proposal Development Fundamentals for Grassroots CSOs
```

Enrollment status:

```txt
IN_PROGRESS
```

Progress:

```txt
40%
```

Completed lessons:

1. Module 1, Lesson 1
2. Module 1, Lesson 2 partially or not completed depending on implementation

Final test:

```txt
not attempted
```

Certificate:

```txt
none
```

Purpose:

1. test continue learning;
2. test progress display;
3. monitoring active participant.

## 12.2 Participant Completed

User:

```txt
Participant Completed
```

Course:

```txt
Proposal Development Fundamentals for Grassroots CSOs
```

Enrollment status:

```txt
COMPLETED
```

Progress:

```txt
100%
```

Completed lessons:

all required lessons

Final test attempt:

```txt
score: 5/5
percentage: 100
passed: true
```

Certificate:

issued

Feedback:

submitted

Purpose:

1. test certificate display;
2. test monitoring completion;
3. test final test pass rate;
4. test feedback summary.

## 12.3 Participant New

User:

```txt
Participant New
```

Enrollment status:

```txt
none
```

Purpose:

1. test empty dashboard;
2. test available courses;
3. test enrollment start flow.

---

# 13. Certificate seed data

## 13.1 Certificate for completed participant

User:

```txt
Participant Completed
```

Course:

```txt
Proposal Development Fundamentals for Grassroots CSOs
```

Certificate code:

```txt
CSOLH-DEMO-0001
```

Status:

```txt
ISSUED
```

Issued date:

```txt
Use current seed date or fixed demo date.
```

Participant name snapshot:

```txt
Participant Completed
```

Course title snapshot:

```txt
Proposal Development Fundamentals for Grassroots CSOs
```

Issuer name snapshot:

```txt
Development Expertise Center
```

Purpose:

1. participant certificate page;
2. admin certificate records;
3. monitoring certificate count.

---

# 14. Feedback seed data

## 14.1 Feedback 1

User:

```txt
Participant Completed
```

Course:

```txt
Proposal Development Fundamentals for Grassroots CSOs
```

Type:

```txt
COURSE_FEEDBACK
```

Rating:

```txt
5
```

Usefulness:

```txt
5
```

Clarity:

```txt
4
```

Accessibility issue:

```txt
false
```

Comment:

```txt
The examples helped me understand how to connect a problem with an objective.
```

## 14.2 Feedback 2, optional

User:

```txt
Participant In Progress
```

Course:

```txt
Proposal Development Fundamentals for Grassroots CSOs
```

Rating:

```txt
4
```

Usefulness:

```txt
4
```

Clarity:

```txt
4
```

Accessibility issue:

```txt
false
```

Comment:

```txt
The checklist is useful. More examples in Amharic would help.
```

Purpose:

1. monitoring feedback summary;
2. course improvement signals.

---

# 15. Audit log seed data

Seed example audit events:

1. Super Admin created Platform Admin.
2. Platform Admin created organization.
3. Platform Admin created cohort.
4. Course Creator created draft course.
5. Course Creator submitted course for review.
6. Reviewer approved course.
7. Platform Admin published course.
8. Participant Completed completed course.
9. Certificate issued.

These records support the Admin Audit Log demo.

---

# 16. Course status seed distribution

The seed database should include:

| Course | Status | Purpose |
|---|---|---|
| Financial Management Basics for Local CSOs | DRAFT | Creator editing and draft visibility test |
| Safeguarding Essentials for Grassroots CSOs | READY_FOR_REVIEW | Review queue test |
| Proposal Development Fundamentals for Grassroots CSOs | PUBLISHED | Participant learning and monitoring demo |

---

# 17. Monitoring seed expectations

With the seed data above, monitoring should show approximately:

1. Registered participants: 3
2. Active participants: 2
3. CSO organizations: 2
4. Cohorts: 1
5. Published courses: 1
6. Total enrollments: 2
7. Completed enrollments: 1
8. Completion rate: 50%
9. Final test pass rate: 100% if only one submitted attempt and it passed
10. Certificates issued: 1
11. Feedback submissions: 1 or 2 depending on optional feedback
12. One organization with participation
13. One organization with low/no participation

Exact values may vary based on implementation, but the dashboard must have meaningful data.

---

# 18. Seed script behavior

## 18.1 Idempotency

Seed script should be idempotent where feasible.

Running the seed script multiple times should not create uncontrolled duplicates.

Use stable unique keys such as:

1. email for users;
2. slug for courses;
3. name/slug for capacity areas;
4. certificate code for demo certificate.

## 18.2 Development-only warning

If seed creates predictable demo passwords, it must be clear that this is for local/demo use only.

## 18.3 Reset behavior

If the repo supports database reset, document the reset command.

## 18.4 Seed command

Codex must document the actual seed command.

Examples:

```txt
npm run db:seed
npx prisma db seed
pnpm db:seed
```

Use the repository’s actual tooling.

---

# 19. Demo account table for handoff

Codex must update this table with actual credentials or login method after implementation.

| Role | Email | Password/Login | Notes |
|---|---|---|---|
| Super Admin | superadmin@demo.local | ChangeMe123! | Full access |
| Platform Admin | admin@demo.local | ChangeMe123! | Admin operations |
| Course Creator | creator@demo.local | ChangeMe123! | Build Studio |
| Course Reviewer | reviewer@demo.local | ChangeMe123! | Review queue |
| M&E Viewer | meviewer@demo.local | ChangeMe123! | Monitoring |
| Participant In Progress | participant1@demo.local | ChangeMe123! | Partial course progress |
| Participant Completed | participant2@demo.local | ChangeMe123! | Certificate issued |
| Participant New | participant3@demo.local | ChangeMe123! | Empty/available courses |

If password login is not used, replace with the correct auth method.

---

# 20. Seed data acceptance criteria

The seed data is acceptable when:

1. seed command runs successfully;
2. demo users are created;
3. roles are assigned correctly;
4. organizations are created;
5. cohort is created and linked;
6. capacity areas are created;
7. draft course exists and is hidden from participants;
8. ready-for-review course appears in review queue;
9. published course appears in learner catalogue;
10. published course has modules, lessons, and block types;
11. published course has final test;
12. participant in progress has partial progress;
13. completed participant has completed enrollment;
14. completed participant has passing quiz attempt;
15. certificate is issued;
16. feedback exists;
17. monitoring dashboard shows meaningful data;
18. audit log has sample activity;
19. no sensitive real personal data is included.

---

# 21. Codex control rules

Codex must follow these seed data rules:

1. Do not use real personal data.
2. Do not use real CSO private data.
3. Do not seed Phase 2/3 modules as active features.
4. Do not seed CRM/donor pipeline data.
5. Do not seed diagnosis/capacity map/action map records unless explicitly required later.
6. Do not create excessive demo data.
7. Do not make draft courses visible to participants.
8. Do not issue certificates without matching completion/pass records.
9. Do not create duplicate seed records on repeated seed runs if avoidable.
10. Document seed command and demo credentials clearly.

---

# 22. Suggested Codex prompt for seed implementation

```txt
Plan first.

Implement Phase 1 seed data according to docs/specs/phase-1-cso-learning-hub/SEED_DATA_PLAN.md and DATA_MODEL.md.

Create safe demo data for:
- roles
- users
- organizations
- cohort
- capacity areas/reference values
- draft course
- ready-for-review course
- published proposal development course
- modules, lessons, and content blocks
- final test questions
- enrollments and lesson progress
- passing quiz attempt
- issued certificate
- feedback
- audit log entries

Constraints:
- Do not use real sensitive personal data.
- Do not seed Phase 2/3 active modules.
- Do not seed CRM/donor pipeline data.
- Make seed idempotent where feasible.
- Ensure draft courses are hidden from participants and published course appears in learner catalogue.
- Ensure monitoring has meaningful demo data.

Run the repo’s seed command and relevant checks.

Return an evidence pack using EVIDENCE_PACK_TEMPLATE.md, including demo account credentials or login method.
```

---

# 23. Final seed data statement

The Phase 1 seed data shall make the product immediately demoable, testable, and understandable.

It shall support the full workflow from admin setup to course creation, publishing, participant learning, final test, certificate, feedback, and monitoring.

It shall remain safe, fictional, scoped to Phase 1, and free from real sensitive data.
