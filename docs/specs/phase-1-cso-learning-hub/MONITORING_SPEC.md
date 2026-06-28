# MONITORING_SPEC.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Monitoring Specification

## 1. Document purpose

This file defines the deterministic Phase 1 monitoring specification for the CSO Learning Hub.

Codex must use this file as the controlling specification for monitoring dashboards, metrics, filters, data sources, access rules, empty states, and acceptance criteria.

The Phase 1 monitoring system must support practical learning-platform management. It must not become a full impact evaluation system, advanced capacity-diagnosis dashboard, donor CRM, or Phase 2/3 analytics system.

---

## 2. Monitoring product definition

The Phase 1 monitoring dashboard shall help DEC/WHH understand:

1. who is registered;
2. which CSOs and cohorts are participating;
3. which courses are available;
4. who is enrolled;
5. who is active;
6. who completed courses;
7. who passed final tests;
8. how many certificates were issued;
9. what participants think about courses;
10. which courses or cohorts need attention.

Monitoring shall be operational, clean, and decision-oriented.

---

## 3. Monitoring principle

The monitoring dashboard must answer practical Phase 1 questions:

> Are CSO participants accessing the courses, completing them, passing the assessments, receiving certificates, and providing useful feedback?

It must not try to prove long-term CSO capacity change in Phase 1.

Long-term capacity evidence, practical proof, badges, diagnosis trends, action-map progress, and advanced impact analytics are future-phase features.

---

## 4. Monitoring route

Primary route:

```txt
/admin/monitoring
```

Optional future or role-specific route:

```txt
/monitoring
```

Phase 1 should use `/admin/monitoring` unless the repository already has a different approved route convention.

---

## 5. Access rules

## 5.1 Allowed roles

The monitoring dashboard may be accessed by:

1. Super Admin;
2. Platform Admin;
3. M&E / Programme Viewer;
4. other explicitly authorized programme roles.

## 5.2 Restricted roles

The monitoring dashboard shall not be accessible to:

1. Participant;
2. public users;
3. Course Creator, unless also granted monitoring permission;
4. CSO Organization Focal Person, unless a limited organization-specific view is explicitly implemented later.

## 5.3 Data protection rule

Monitoring must prioritize aggregated and operational data.

The dashboard must not overexpose sensitive participant-level details.

Where participant-level lists are shown, they should be limited to authorized Admin views and should avoid unnecessary personal information.

---

# 6. Phase 1 monitoring scope

## 6.1 In scope

Phase 1 monitoring shall cover:

1. users;
2. participants;
3. CSO organizations;
4. cohorts;
5. courses;
6. enrollments;
7. lesson progress;
8. course completion;
9. quiz/final test performance;
10. certificates;
11. participant feedback;
12. course publication status.

## 6.2 Out of scope

Phase 1 monitoring shall not include full dashboards for:

1. CSO diagnosis trends;
2. capacity map scoring;
3. action map progress;
4. practical proof verification;
5. digital badge verification;
6. organizational capacity outcome claims;
7. donor CRM pipeline;
8. sub-grant project implementation tracking;
9. knowledge management analytics;
10. peer collaboration analytics;
11. co-creation workspace analytics.

---

# 7. Dashboard structure

The monitoring dashboard shall include the following sections:

1. Summary KPI cards;
2. Filters;
3. Course progress table;
4. Cohort progress table;
5. Organization participation table;
6. Final test performance summary;
7. Certificate summary;
8. Feedback summary;
9. Attention / improvement signals;
10. Export or download option, optional.

---

# 8. Global filters

The dashboard shall support filters for:

1. course;
2. cohort;
3. organization;
4. region, if captured;
5. capacity area;
6. course status;
7. date range;
8. completion status;
9. certificate status, optional.

## 8.1 Filter behavior

Filters shall update all dashboard metrics and tables where applicable.

## 8.2 Default filter state

Default dashboard view shall show all available Phase 1 monitoring data.

If data volume becomes large, default date range may be current programme period or last 90 days.

## 8.3 Empty filter state

If selected filters return no results:

```txt
No monitoring data matches the selected filters.
```

Action:

```txt
Clear filters
```

---

# 9. Summary KPI cards

The dashboard shall show the following KPI cards.

## 9.1 Registered participants

### Definition

Count of users with Participant role and active/invited status according to implementation rules.

### Data source

`User`, `UserRoleAssignment`, `Role`

### Display

```txt
Registered participants
```

## 9.2 Active participants

### Definition

Participants who have started or accessed at least one course within the selected date range.

### Data source

`Enrollment.startedAt`, `Enrollment.lastAccessedAt`, `LessonProgress`

### Display

```txt
Active participants
```

## 9.3 CSO organizations

### Definition

Count of active organizations.

### Data source

`Organization`

### Display

```txt
CSO organizations
```

## 9.4 Cohorts

### Definition

Count of active cohorts.

### Data source

`Cohort`

### Display

```txt
Cohorts
```

## 9.5 Published courses

### Definition

Count of courses with Published status.

### Data source

`Course.status`

### Display

```txt
Published courses
```

## 9.6 Total enrollments

### Definition

Count of enrollment records matching selected filters.

### Data source

`Enrollment`

### Display

```txt
Enrollments
```

## 9.7 Completion rate

### Definition

Completed enrollments divided by total enrollments.

### Formula

```txt
Completion Rate = Completed Enrollments / Total Enrollments * 100
```

### Data source

`Enrollment.status`, `Enrollment.completedAt`

### Display

```txt
Completion rate
```

## 9.8 Final test pass rate

### Definition

Passed final test attempts divided by submitted final test attempts.

### Formula

```txt
Final Test Pass Rate = Passed Submitted Final Test Attempts / Submitted Final Test Attempts * 100
```

### Data source

`Quiz`, `QuizAttempt`

### Display

```txt
Final test pass rate
```

## 9.9 Certificates issued

### Definition

Count of issued certificates.

### Data source

`Certificate.status = ISSUED`

### Display

```txt
Certificates issued
```

## 9.10 Average feedback rating

### Definition

Average course feedback rating.

### Data source

`Feedback.rating`

### Display

```txt
Average course rating
```

---

# 10. Course progress table

## 10.1 Purpose

Show course-level participation and completion.

## 10.2 Required columns

1. Course title
2. Capacity area
3. Status
4. Enrollments
5. Active participants
6. Completed
7. Completion rate
8. Final test pass rate
9. Certificates issued
10. Average feedback rating
11. Last updated / published date

## 10.3 Row action

Each course row may include:

1. View course detail;
2. View participant progress, Admin only;
3. Open course preview.

## 10.4 Empty state

```txt
No course progress data is available yet.
```

---

# 11. Cohort progress table

## 11.1 Purpose

Show progress by cohort.

## 11.2 Required columns

1. Cohort name
2. Organizations
3. Participants
4. Assigned courses
5. Enrollments
6. Completed enrollments
7. Completion rate
8. Certificates issued
9. Average feedback rating

## 11.3 Row action

Each cohort row may include:

1. View cohort detail;
2. View assigned courses;
3. View organization progress.

## 11.4 Empty state

```txt
Cohort progress will appear after participants are assigned or enrolled.
```

---

# 12. Organization participation table

## 12.1 Purpose

Show participation and completion by CSO organization.

## 12.2 Required columns

1. Organization name
2. Region
3. Cohort
4. Participants
5. Enrollments
6. Active participants
7. Completed enrollments
8. Completion rate
9. Certificates issued

## 12.3 Row action

Each organization row may include:

1. View organization detail;
2. View participant summary, Admin only.

## 12.4 Data protection

Organization-level table may show aggregated progress.

Participant-level drilldown should be restricted to Admin roles.

## 12.5 Empty state

```txt
Organization participation data will appear after participants are linked to organizations and begin courses.
```

---

# 13. Final test performance summary

## 13.1 Purpose

Show assessment performance across courses.

## 13.2 Required metrics

1. Submitted attempts;
2. Passed attempts;
3. Failed attempts;
4. Average score;
5. Pass rate;
6. Retake count, if tracked.

## 13.3 Course-level display

The dashboard should show final test performance by course.

## 13.4 Required columns

1. Course title
2. Final test status
3. Submitted attempts
4. Average score
5. Pass rate
6. Certificates issued

## 13.5 Empty state

```txt
Final test performance will appear after participants submit tests.
```

---

# 14. Certificate summary

## 14.1 Purpose

Show certification activity.

## 14.2 Required metrics

1. Total certificates issued;
2. Certificates issued by course;
3. Certificates issued by cohort;
4. Certificates issued by organization;
5. Recent certificates.

## 14.3 Certificate list columns

1. Certificate code;
2. Participant name;
3. Course title;
4. Organization;
5. Cohort;
6. Issue date;
7. Status.

## 14.4 Data protection

Certificate records may include participant names for Admin users.

M&E Viewer access may show aggregated counts unless participant-level access is explicitly allowed.

---

# 15. Feedback summary

## 15.1 Purpose

Show participant feedback to improve courses.

## 15.2 Required metrics

1. Number of feedback submissions;
2. Average rating;
3. Average usefulness rating;
4. Average clarity rating;
5. Accessibility/usability issue count;
6. Recent comments, Admin only if sensitive.

## 15.3 Course feedback table

Required columns:

1. Course title;
2. Feedback count;
3. Average rating;
4. Usefulness;
5. Clarity;
6. Accessibility issue count;
7. Latest feedback date.

## 15.4 Comment display rule

Open comments may be useful for improvement but should not be overexposed.

If comments are shown:

1. display only to Admin/authorized roles;
2. avoid showing unnecessary personal details;
3. include date and course context.

---

# 16. Attention / improvement signals

## 16.1 Purpose

Highlight areas needing follow-up.

## 16.2 Required signals

The dashboard should identify:

1. courses with low completion rate;
2. courses with low final test pass rate;
3. courses with low feedback rating;
4. courses with many accessibility/usability issues;
5. cohorts with low activity;
6. organizations with low participation;
7. courses with no activity after publication.

## 16.3 Recommended thresholds

These may be configurable later. Phase 1 defaults:

1. Low completion: below 50%;
2. Low pass rate: below 60%;
3. Low feedback rating: below 3 out of 5;
4. Low activity: no activity in 30 days after assignment/publication.

## 16.4 Display rule

Signals should appear as a concise list or small cards.

Do not create a complex risk scoring system in Phase 1.

---

# 17. Charts and visualizations

## 17.1 Recommended charts

Phase 1 may include simple visuals:

1. enrollment trend over time;
2. completion by course;
3. certificates by course;
4. feedback rating by course;
5. participant progress distribution.

## 17.2 Chart rule

Charts must support decision-making and not clutter the dashboard.

Tables are acceptable if chart implementation would delay core functionality.

## 17.3 Accessibility

Charts must include labels and text equivalents where practical.

Do not rely on color alone.

---

# 18. Monitoring detail pages

## 18.1 Optional course monitoring detail

Optional route:

```txt
/admin/monitoring/courses/[courseId]
```

If implemented, show:

1. course summary;
2. enrollments;
3. completion;
4. final test performance;
5. certificates;
6. feedback;
7. participant progress table, Admin only.

## 18.2 Optional cohort monitoring detail

Optional route:

```txt
/admin/monitoring/cohorts/[cohortId]
```

If implemented, show:

1. cohort summary;
2. organizations;
3. participants;
4. assigned courses;
5. completion;
6. certificates.

## 18.3 Optional organization monitoring detail

Optional route:

```txt
/admin/monitoring/organizations/[organizationId]
```

If implemented, show:

1. organization summary;
2. linked participants;
3. course participation;
4. completion;
5. certificates.

## 18.4 Phase 1 rule

These detail pages are optional. The main `/admin/monitoring` dashboard is required.

---

# 19. Export requirements

## 19.1 Optional export

Phase 1 may include CSV export for monitoring tables.

Recommended exports:

1. course progress summary;
2. cohort progress summary;
3. organization participation summary;
4. certificate records;
5. feedback summary.

## 19.2 Export access

Export should be available only to Admin or authorized M&E Viewer roles.

## 19.3 Export data protection

Exports must avoid unnecessary sensitive data.

Participant-level exports should require Admin-level permission.

---

# 20. Data sources

Monitoring metrics should be computed from the core Phase 1 entities:

1. `User`
2. `Role`
3. `UserRoleAssignment`
4. `Organization`
5. `Cohort`
6. `Course`
7. `CourseVersion`
8. `CourseCapacityArea`
9. `Enrollment`
10. `LessonProgress`
11. `Quiz`
12. `QuizAttempt`
13. `Certificate`
14. `Feedback`
15. `AuditLog`

Do not create separate monitoring-only data unless required for performance later.

If monitoring snapshots are added later, they must be explicitly approved.

---

# 21. Metric definitions

## 21.1 Registered participants

Users with Participant role.

## 21.2 Active participant

Participant with at least one enrollment started or lesson progress activity in selected date range.

## 21.3 Enrollment

A participant-course relationship.

## 21.4 Completed enrollment

Enrollment with status `COMPLETED` or completedAt not null.

## 21.5 Completion rate

Completed enrollments divided by total enrollments.

## 21.6 Submitted final test attempt

QuizAttempt linked to a final test quiz with status submitted/passed/failed.

## 21.7 Final test pass rate

Passed submitted final test attempts divided by all submitted final test attempts.

## 21.8 Certificate issued

Certificate with status `ISSUED`.

## 21.9 Average feedback rating

Average numeric rating from course feedback records.

## 21.10 Low activity course

Published or assigned course with no recent enrollment/progress activity within the configured period.

---

# 22. Empty states

## 22.1 No monitoring data

```txt
Monitoring data will appear after participants start learning.
```

## 22.2 No course activity

```txt
No course activity has been recorded yet.
```

## 22.3 No cohort activity

```txt
No cohort activity has been recorded yet.
```

## 22.4 No organization activity

```txt
No organization activity has been recorded yet.
```

## 22.5 No feedback

```txt
No participant feedback has been submitted yet.
```

## 22.6 No certificates

```txt
No certificates have been issued yet.
```

---

# 23. UI/UX requirements

## 23.1 Dashboard style

The monitoring dashboard shall be:

1. clean;
2. readable;
3. card-and-table based;
4. easy to filter;
5. not overloaded;
6. mobile-responsive where possible;
7. accessible.

## 23.2 Page structure

Recommended structure:

1. Page title: Monitoring
2. Subtitle: Track course participation, completion, assessment, certification, and feedback.
3. Filter bar.
4. KPI cards.
5. Attention signals.
6. Course progress.
7. Cohort progress.
8. Organization participation.
9. Assessment and certificate summaries.
10. Feedback summary.

## 23.3 Avoid clutter

The dashboard must avoid:

1. too many charts;
2. complex donor reporting visuals;
3. diagnosis/capacity map analytics;
4. full impact claims;
5. CRM pipeline widgets;
6. social engagement analytics.

---

# 24. Data privacy and safeguarding

## 24.1 Personal data minimization

Monitoring shall show only the personal data needed for platform management.

## 24.2 Aggregated by default

Dashboard views should be aggregated by default.

## 24.3 Participant-level drilldown

Participant-level drilldown, if implemented, should be available only to Admin roles.

## 24.4 Sensitive feedback

Open-text feedback may contain sensitive comments.

Show comments only to authorized roles.

## 24.5 Export caution

Exports must be role-restricted.

---

# 25. Acceptance criteria

## 25.1 Dashboard access acceptance

Authorized Admin/M&E Viewer can open `/admin/monitoring`.

Participants and public users cannot access it.

## 25.2 KPI acceptance

Dashboard shows:

1. registered participants;
2. active participants;
3. organizations;
4. cohorts;
5. published courses;
6. enrollments;
7. completion rate;
8. final test pass rate;
9. certificates issued;
10. average feedback rating.

## 25.3 Filter acceptance

Admin can filter monitoring data by:

1. course;
2. cohort;
3. organization;
4. date range;
5. capacity area, if implemented;
6. region, if available.

## 25.4 Course progress acceptance

Admin can view a course progress table with enrollments, completions, pass rate, certificates, and feedback rating.

## 25.5 Cohort progress acceptance

Admin can view cohort-level progress.

## 25.6 Organization participation acceptance

Admin can view organization-level participation.

## 25.7 Certificate acceptance

Admin can view certificates issued by course/cohort/organization.

## 25.8 Feedback acceptance

Admin can view course feedback summary and accessibility/usability issue counts.

## 25.9 Attention signal acceptance

Dashboard highlights low completion, low pass rate, low feedback, and low activity signals.

## 25.10 Data protection acceptance

Participants cannot access monitoring.

M&E Viewer does not automatically receive unnecessary participant-level personal details.

---

# 26. Implementation sequencing for Codex

Codex should implement monitoring in this order:

## Step 1 — Monitoring route and access

Create `/admin/monitoring` with role protection.

## Step 2 — Empty-state dashboard

Implement page shell, filter bar, KPI cards, and empty states.

## Step 3 — KPI calculations

Compute registered participants, organizations, cohorts, courses, enrollments, completions, pass rate, certificates, and feedback.

## Step 4 — Course progress table

Implement course-level progress table.

## Step 5 — Cohort progress table

Implement cohort-level progress table.

## Step 6 — Organization participation table

Implement organization-level participation table.

## Step 7 — Assessment and certificate summaries

Implement final test performance and certificate summaries.

## Step 8 — Feedback summary

Implement feedback metrics and comments if authorized.

## Step 9 — Attention signals

Implement low completion, low pass rate, low rating, and low activity signals.

## Step 10 — Filters and QA

Connect filters across dashboard and test role/data protection rules.

---

# 27. Codex control rules

Codex must follow these monitoring rules:

1. Do not build a full impact dashboard in Phase 1.
2. Do not build diagnosis/capacity map analytics in Phase 1.
3. Do not build practical proof or badge analytics in Phase 1.
4. Do not create donor CRM dashboards.
5. Do not overexpose participant personal data.
6. Do not create complex scoring systems unless explicitly specified.
7. Do not use monitoring data to claim organizational capacity impact.
8. Do not make charts more important than clear operational metrics.
9. Do not create separate monitoring data tables unless necessary and approved.
10. Keep monitoring simple, useful, and Phase 1-aligned.

---

# 28. Final monitoring statement

The Phase 1 monitoring system shall give DEC/WHH a clear operational view of learning access, participation, progress, completion, assessment performance, certification, and feedback.

It shall support adaptive course improvement and programme oversight without over-claiming long-term capacity outcomes or overbuilding Phase 2/3 analytics.
