# ADMIN_PORTAL_SPEC.md

# DEC / WHH CSF+ CSO Learning Hub — Phase 1 Admin Portal Specification

## 1. Document purpose

This file defines the deterministic specification for the **Admin Portal** in Phase 1 of the CSO Learning Hub.

Codex must use this file as the controlling specification for admin routes, permissions, screens, workflows, data management, review/publishing actions, monitoring access, and admin UX.

The Admin Portal must support Phase 1 platform operations without becoming a complex CRM, donor management system, or full Phase 2/3 governance platform.

---

## 2. Admin Portal product definition

The Admin Portal is the operational control center for DEC/WHH platform administrators.

It shall allow authorized administrators to:

1. manage users and roles;
2. manage CSO organizations;
3. manage cohorts;
4. manage courses;
5. manage review and publishing workflow;
6. manage certificates and certificate settings;
7. manage reference data;
8. view monitoring dashboards;
9. view audit/activity logs;
10. manage basic platform settings.

The Admin Portal shall be clean, practical, and focused on Phase 1 operations.

---

## 3. Core admin principle

The Admin Portal must support platform operations without overloading users with future-phase complexity.

It should feel like:

> “I can manage the learning platform clearly and safely.”

It must not feel like:

> “I am inside a complex CRM or donor compliance system.”

---

## 4. Admin route prefix

All admin routes shall use:

```txt
/admin
```

All `/admin` routes require authentication and admin-level permission, except where a specific read-only M&E viewer permission is explicitly allowed.

---

# 5. Admin roles

## 5.1 Super Admin

The Super Admin has full system authority.

Can:

1. manage all users;
2. assign/remove roles;
3. create/manage Platform Admins;
4. manage organizations and cohorts;
5. manage all courses;
6. publish/unpublish/archive courses;
7. manage reference data;
8. manage certificate settings;
9. view monitoring;
10. view audit logs;
11. manage platform settings.

## 5.2 Platform Admin

The Platform Admin manages day-to-day operations.

Can:

1. manage users within platform rules;
2. manage organizations and cohorts;
3. manage courses;
4. review/publish courses if granted publishing authority;
5. manage reference data if granted;
6. view monitoring;
7. view certificate records;
8. view audit/activity logs according to permission.

## 5.3 Course Reviewer / QA Reviewer

Can:

1. view courses submitted for review;
2. preview courses;
3. approve courses if granted;
4. return courses for revision with comments;
5. view review history for assigned courses.

Cannot:

1. manage all platform settings;
2. manage all users unless also Admin;
3. publish unless explicitly granted Admin publishing authority.

## 5.4 M&E / Programme Viewer

Can:

1. view monitoring dashboard;
2. view aggregated course, cohort, and organization-level participation data;
3. export or inspect summary data if implemented.

Cannot:

1. create/edit courses;
2. publish courses;
3. manage users;
4. edit organizations/cohorts;
5. view unnecessary personal data.

---

# 6. Admin navigation

The Admin Portal shall include these main navigation items:

1. Dashboard
2. Users
3. Organizations
4. Cohorts
5. Courses
6. Review / Publish
7. Certificates
8. Reference Data
9. Monitoring
10. Audit Log
11. Settings

Navigation must be role-aware.

If a user does not have permission for an item, the item should be hidden or disabled.

---

# 7. Admin dashboard

## 7.1 Route

```txt
/admin
```

## 7.2 Purpose

Provide a concise operational overview of platform activity.

## 7.3 Required dashboard cards

1. Total users
2. Total participants
3. Total CSO organizations
4. Total cohorts
5. Total courses
6. Published courses
7. Active enrollments
8. Course completions
9. Certificates issued
10. Courses awaiting review/publishing

## 7.4 Required dashboard sections

1. Recent platform activity
2. Courses needing attention
3. Recent certificates
4. Recent feedback summary, if available
5. Quick actions

## 7.5 Quick actions

Recommended quick actions:

1. Add user
2. Add organization
3. Create cohort
4. Create course
5. Review courses
6. View monitoring

## 7.6 Empty state

If there is no activity:

```txt
Platform activity will appear here as users, courses, and enrollments are added.
```

## 7.7 Must not include

1. donor CRM metrics;
2. full diagnosis dashboards;
3. capacity map analytics;
4. Phase 2/3 collaboration analytics;
5. heavy compliance panels.

---

# 8. User management

## 8.1 Routes

```txt
/admin/users
/admin/users/new
/admin/users/[userId]
```

## 8.2 Purpose

Allow Admins to manage user accounts and role assignments.

## 8.3 User list requirements

The user list shall show:

1. name;
2. email;
3. role(s);
4. organization, if linked;
5. cohort, if linked;
6. status;
7. last login, if available;
8. actions.

## 8.4 Filters

The user list should support filtering by:

1. role;
2. status;
3. organization;
4. cohort;
5. search by name/email.

## 8.5 Create user requirements

Admin shall be able to create a user with:

1. full name;
2. email;
3. role;
4. organization, optional;
5. cohort, optional;
6. status/invitation state.

## 8.6 User detail requirements

User detail page shall show:

1. full name;
2. email;
3. role assignments;
4. organization link;
5. cohort link;
6. account status;
7. enrollment summary, for participants;
8. certificate summary, for participants;
9. recent activity.

## 8.7 User actions

Admins may:

1. edit profile details;
2. assign role;
3. remove role;
4. activate user;
5. suspend/deactivate user;
6. link user to organization;
7. link user to cohort.

## 8.8 Rules

1. At least one active Super Admin must remain.
2. Participants with progress/certificates must not be hard-deleted.
3. Role changes must be logged.
4. User deactivation must prevent sign-in.

---

# 9. Organization management

## 9.1 Routes

```txt
/admin/organizations
/admin/organizations/new
/admin/organizations/[organizationId]
```

## 9.2 Purpose

Manage CSO organizations and grassroots groups participating in the platform.

## 9.3 Organization list requirements

The organization list shall show:

1. organization name;
2. region;
3. organization type;
4. formality status, if captured;
5. focal person;
6. participant count;
7. cohort count;
8. status;
9. actions.

## 9.4 Filters

The organization list should support filtering by:

1. region;
2. organization type;
3. formality status;
4. cohort;
5. status;
6. search by name.

## 9.5 Create organization requirements

Admin shall be able to create an organization with:

1. organization name;
2. short name, optional;
3. region;
4. zone/woreda, optional;
5. organization type;
6. formality status, optional;
7. focal person name;
8. focal person email;
9. focal person phone, optional;
10. notes, optional.

## 9.6 Organization detail requirements

Organization detail page shall show:

1. profile details;
2. linked participants;
3. linked cohorts;
4. assigned courses, if applicable;
5. progress summary;
6. certificate summary;
7. notes.

## 9.7 Organization actions

Admins may:

1. edit organization details;
2. link/unlink participants;
3. assign to cohort;
4. archive organization;
5. reactivate organization if archived/inactive.

## 9.8 Rules

1. Organizations with linked participants or progress should be archived rather than deleted.
2. Organization data supports monitoring and future capacity-development tracking.
3. The organization page must not become a full CRM.

---

# 10. Cohort management

## 10.1 Routes

```txt
/admin/cohorts
/admin/cohorts/new
/admin/cohorts/[cohortId]
```

## 10.2 Purpose

Manage cohorts for training delivery, CSO grouping, and monitoring.

## 10.3 Cohort list requirements

The cohort list shall show:

1. cohort name;
2. programme name, if available;
3. start date;
4. end date;
5. number of organizations;
6. number of participants;
7. assigned courses;
8. status;
9. actions.

## 10.4 Create cohort requirements

Admin shall be able to create a cohort with:

1. cohort name;
2. description;
3. programme name, optional;
4. start date;
5. end date;
6. region, optional;
7. status.

## 10.5 Cohort detail requirements

Cohort detail page shall show:

1. cohort profile;
2. assigned organizations;
3. assigned participants;
4. assigned courses;
5. progress summary;
6. completion summary;
7. certificate summary.

## 10.6 Cohort actions

Admins may:

1. edit cohort;
2. assign organizations;
3. assign participants;
4. assign courses;
5. archive cohort.

## 10.7 Rules

1. Cohorts support organization/participant grouping.
2. Cohorts support monitoring filters.
3. Cohorts must not become project-management workspaces in Phase 1.

---

# 11. Course management

## 11.1 Routes

```txt
/admin/courses
/admin/courses/[courseId]
```

## 11.2 Purpose

Allow Admins to view and manage all courses.

## 11.3 Course list requirements

The course list shall show:

1. course title;
2. status;
3. creator;
4. capacity area;
5. level;
6. certificate eligible yes/no;
7. published date, if published;
8. last updated;
9. actions.

## 11.4 Filters

The course list shall support filtering by:

1. course status;
2. capacity area;
3. creator;
4. level;
5. certificate eligible;
6. search by title.

## 11.5 Course detail requirements

Course detail page shall show:

1. course title;
2. description;
3. creator;
4. capacity area;
5. target audience;
6. learning outcomes;
7. course status;
8. version information;
9. modules/lessons summary;
10. final test status;
11. certificate eligibility;
12. readiness summary;
13. preview action;
14. publish/review actions according to permission.

## 11.6 Course admin actions

Admins may:

1. assign or change creator;
2. view course preview;
3. approve course;
4. return course for revision;
5. publish approved course;
6. unpublish course;
7. archive course.

## 11.7 Rules

1. Draft courses are not visible to participants.
2. Published courses must preserve participant progress.
3. Admin actions must be logged.
4. Course publication must respect readiness rules unless an authorized override is explicitly implemented and logged.
5. Course management must not duplicate the full Build Studio; editing content belongs under creator/build routes.

---

# 12. Review / Publish queue

## 12.1 Routes

```txt
/admin/review
/admin/review/[courseId]
```

## 12.2 Purpose

Manage the lightweight Phase 1 review and publishing process.

## 12.3 Review queue list

The review queue shall show:

1. courses Ready for Review;
2. Approved but unpublished courses;
3. Returned for Revision courses;
4. course title;
5. creator;
6. capacity area;
7. submitted date;
8. current status;
9. action buttons.

## 12.4 Review detail page

The review detail page shall show:

1. course summary;
2. learning outcomes;
3. module/lesson summary;
4. final test summary;
5. readiness checklist;
6. learner preview link;
7. review comment field;
8. approve action;
9. return for revision action;
10. publish action if authorized.

## 12.5 Return for revision

Reviewer/Admin must provide a return reason.

Return reason should be visible to Course Creator in the feedback/revision page.

## 12.6 Approve

Approval moves course to Approved status.

Approval does not automatically publish unless the same action explicitly publishes and user has permission.

## 12.7 Publish

Publishing makes course visible to eligible participants according to visibility/access settings.

Only Admins can publish.

## 12.8 Rules

1. Review/publish workflow shall remain lightweight in Phase 1.
2. Do not create complex multi-stage governance workflows.
3. Do not add donor compliance approval layers.
4. Do not add full review comment systems unless explicitly requested later.
5. Status changes must be logged.

---

# 13. Certificate management

## 13.1 Routes

```txt
/admin/certificates
/admin/certificates/settings
/admin/certificates/[certificateId]
```

## 13.2 Purpose

Allow Admins to configure certificate basics and view issued certificates.

## 13.3 Certificate list requirements

Certificate list shall show:

1. certificate ID/code;
2. participant name;
3. course title;
4. issue date;
5. status;
6. download/view action.

## 13.4 Filters

Certificate list should support filtering by:

1. course;
2. participant;
3. organization;
4. cohort;
5. issue date;
6. status.

## 13.5 Certificate detail requirements

Certificate detail shall show:

1. participant name;
2. participant email;
3. organization, if linked;
4. course title;
5. course version;
6. issue date;
7. certificate code;
8. final test score;
9. status;
10. download/view certificate.

## 13.6 Certificate settings

Settings may include:

1. issuer name;
2. signatory name;
3. signatory title;
4. default certificate footer;
5. default pass threshold;
6. logo reference if implemented.

## 13.7 Rules

1. Default pass threshold should be 80% unless configured otherwise.
2. Certificate issuance must follow completion and final test pass rules.
3. Revoked certificates must remain in records with revoked status.
4. Historical certificate data should preserve name/course snapshots.

---

# 14. Reference data management

## 14.1 Routes

```txt
/admin/reference-data
/admin/reference-data/capacity-areas
/admin/reference-data/course-levels
/admin/reference-data/organization-types
/admin/reference-data/regions
/admin/reference-data/languages
```

## 14.2 Purpose

Allow Admins to manage controlled values used across the platform.

## 14.3 Required reference data categories

1. Capacity Areas
2. Course Levels
3. Organization Types
4. Regions
5. Languages
6. Cohort Types, optional

## 14.4 Reference data list requirements

Each list shall show:

1. label/name;
2. description;
3. status active/inactive;
4. order;
5. actions.

## 14.5 Reference data actions

Admins may:

1. add value;
2. edit value;
3. deactivate value;
4. reactivate value;
5. reorder values, if implemented.

## 14.6 Rules

1. Reference values used by existing records should be deactivated rather than hard-deleted.
2. Capacity Areas are especially important and must be available before course setup/publication.
3. Reference data must not become a full taxonomy management system in Phase 1.

---

# 15. Monitoring dashboard access

## 15.1 Route

```txt
/admin/monitoring
```

## 15.2 Purpose

Allow Admins and M&E/Programme Viewers to see Phase 1 learning activity.

## 15.3 Monitoring content

The Monitoring dashboard shall show:

1. registered participants;
2. active participants;
3. CSO organizations;
4. cohorts;
5. enrollments;
6. completion rate;
7. final test pass rate;
8. certificates issued;
9. course feedback summary;
10. course-level progress;
11. cohort-level progress;
12. organization-level participation.

## 15.4 Filters

The dashboard shall support filters for:

1. course;
2. cohort;
3. organization;
4. region, if available;
5. date range;
6. course status.

## 15.5 Data protection rule

Monitoring shall prioritize aggregated and operational data.

Do not overexpose sensitive personal data on the dashboard.

---

# 16. Audit/activity log

## 16.1 Route

```txt
/admin/audit-log
```

## 16.2 Purpose

Show critical platform actions for accountability and troubleshooting.

## 16.3 Audit log fields

The audit log shall show:

1. timestamp;
2. actor;
3. action type;
4. entity type;
5. entity name or ID;
6. short description;
7. metadata/details link if implemented.

## 16.4 Required logged actions

The system should log:

1. user creation/update/deactivation;
2. role assignment/removal;
3. organization creation/update/archive;
4. cohort creation/update/archive;
5. course creation/update;
6. course status changes;
7. course submission for review;
8. course return for revision;
9. course approval;
10. course publishing/unpublishing;
11. certificate issuance/revocation;
12. reference data updates.

## 16.5 Rules

1. Audit logs must not be hard-deleted through ordinary admin UI.
2. Do not store passwords, tokens, or sensitive private file content in audit metadata.
3. Audit log should be searchable/filterable where feasible.

---

# 17. Platform settings

## 17.1 Route

```txt
/admin/settings
```

## 17.2 Purpose

Manage basic platform-level settings.

## 17.3 Required settings, if implemented

1. platform name;
2. default language;
3. registration setting;
4. certificate defaults;
5. branding/logo reference;
6. footer/partner display setting;
7. support contact information.

## 17.4 Rules

1. Settings should remain simple in Phase 1.
2. Do not build a complex site-builder or theme-builder unless explicitly requested later.

---

# 18. Admin UI/UX requirements

## 18.1 Visual style

Admin UI shall be:

1. clean;
2. calm;
3. professional;
4. readable;
5. table-and-card based;
6. responsive;
7. accessible.

## 18.2 Layout

Admin pages should generally include:

1. page title;
2. short subtitle;
3. primary action button;
4. filters/search where useful;
5. main table/list/card content;
6. clean empty state;
7. relevant secondary actions.

## 18.3 Empty states

Every admin list must have a clear empty state with a relevant action.

Examples:

```txt
No users found.
Add user
```

```txt
No CSO organizations have been added yet.
Add organization
```

```txt
No courses are waiting for review.
```

## 18.4 Avoid clutter

Admin pages shall avoid:

1. too many cards on one screen;
2. large explanatory blocks;
3. repeated metadata;
4. Phase 2/3 modules;
5. CRM-style relationship panels;
6. donor compliance widgets;
7. heavy governance diagrams.

---

# 19. Admin permissions matrix

| Capability | Super Admin | Platform Admin | Reviewer | M&E Viewer |
|---|---:|---:|---:|---:|
| View admin dashboard | Yes | Yes | Limited | Limited |
| Manage users | Yes | Yes/Limited | No | No |
| Assign roles | Yes | Limited/No | No | No |
| Manage organizations | Yes | Yes | No | No |
| Manage cohorts | Yes | Yes | No | No |
| Manage courses | Yes | Yes | Limited | No |
| Create/edit courses | Yes | Yes | Limited if creator | No |
| Review courses | Yes | Yes | Yes | No |
| Publish courses | Yes | Yes if authorized | No unless also Admin | No |
| Manage certificates | Yes | Yes | No | View summary only |
| Manage reference data | Yes | Yes if authorized | No | No |
| View monitoring | Yes | Yes | Limited | Yes |
| View audit log | Yes | Yes/Limited | No/Limited | No |

Implementation may simplify permissions early, but must not violate the rule that participants cannot access admin functions and only authorized Admins can publish.

---

# 20. Admin acceptance criteria

## 20.1 Admin dashboard acceptance

Admin can open `/admin` and see operational cards for users, organizations, cohorts, courses, enrollments, completions, certificates, and courses needing review.

## 20.2 User management acceptance

Admin can create, edit, search, filter, activate/deactivate users, and assign roles.

## 20.3 Organization management acceptance

Admin can create and edit CSO organizations, link participants, assign cohorts, and view basic progress summary.

## 20.4 Cohort management acceptance

Admin can create and edit cohorts, assign organizations/participants/courses, and view cohort progress.

## 20.5 Course management acceptance

Admin can view all courses, filter by status/capacity area/creator, open course detail, preview course, and perform status actions according to permission.

## 20.6 Review/publish acceptance

Admin/Reviewer can review submitted courses, approve or return for revision, and Admin can publish approved courses.

## 20.7 Certificate acceptance

Admin can view certificate records and certificate settings. Certificates are only issued according to completion and pass rules.

## 20.8 Reference data acceptance

Admin can manage capacity areas, course levels, organization types, regions, and languages.

## 20.9 Monitoring acceptance

Admin/M&E Viewer can view monitoring metrics and filters.

## 20.10 Audit log acceptance

Admin can view critical activity logs.

---

# 21. Implementation sequencing for Codex

Codex should implement Admin Portal in this order:

## Step 1 — Admin shell

Create `/admin` layout, navigation, protected route behavior, and dashboard placeholder.

## Step 2 — Admin dashboard

Implement dashboard cards and recent activity using available data or seed data.

## Step 3 — User management

Implement user list, create/edit, role assignment, activation/deactivation.

## Step 4 — Organization management

Implement organization list, create/edit, participant links, cohort links.

## Step 5 — Cohort management

Implement cohort list, create/edit, organization/participant/course assignment.

## Step 6 — Course management

Implement course list/detail, filters, status display, creator assignment.

## Step 7 — Review/publish queue

Implement review queue, review detail, approve, return, publish actions.

## Step 8 — Certificate management

Implement certificate list/detail and basic settings.

## Step 9 — Reference data

Implement capacity areas and essential lookup values.

## Step 10 — Monitoring dashboard

Implement Phase 1 monitoring metrics and filters.

## Step 11 — Audit log

Implement audit log display and critical action logging.

## Step 12 — Settings

Implement simple platform settings if needed.

---

# 22. Codex control rules

Codex must follow these Admin Portal rules:

1. Do not create CRM functionality.
2. Do not build donor-management features.
3. Do not build full diagnosis/capacity map/action map modules.
4. Do not add knowledge management or collaboration modules to admin in Phase 1.
5. Do not expose admin routes to participants.
6. Do not allow Course Creators to publish unless they also have Admin permission.
7. Do not hard-delete records with learning history.
8. Do not expose unnecessary sensitive participant data in monitoring.
9. Do not add large governance panels to course management.
10. Keep admin UX clean, operational, and Phase 1-focused.

---

# 23. Final Admin Portal statement

The Phase 1 Admin Portal shall provide DEC/WHH with a clean operational control center for managing users, CSO organizations, cohorts, courses, publishing, certificates, monitoring, reference data, and audit logs.

It shall support the e-learning MVP and protect future Learning Hub expansion without becoming a CRM, donor compliance system, or overloaded governance platform.
