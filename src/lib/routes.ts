export type RouteDefinition = {
  title: string;
  purpose: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export type NavItem = {
  href: string;
  label: string;
};

export type CreatorWorkflowStep = {
  label: string;
  segment: string;
};

export const publicNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/register", label: "Register" },
];

export const learnerNav: NavItem[] = [
  { href: "/learn", label: "Dashboard" },
  { href: "/learn/my-courses", label: "My Courses" },
  { href: "/learn/certificates", label: "Certificates" },
  { href: "/learn/profile", label: "Profile" },
];

export const creatorNav: NavItem[] = [
  { href: "/creator/courses", label: "My Courses" },
];

export const creatorCourseWorkflowSteps: CreatorWorkflowStep[] = [
  { label: "Setup", segment: "setup" },
  { label: "Metadata", segment: "metadata" },
  { label: "Outcomes", segment: "outcomes" },
  { label: "Build Studio", segment: "build" },
  { label: "Resources", segment: "resources" },
  { label: "Final Test", segment: "quiz" },
  { label: "Preview", segment: "preview" },
  { label: "Submit / Feedback", segment: "submit" },
];

export function buildCreatorCourseNav(courseId: string): NavItem[] {
  return creatorCourseWorkflowSteps.map((step) => ({
    href: `/creator/courses/${courseId}/${step.segment}`,
    label: step.label,
  }));
}

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/organizations", label: "Organizations" },
  { href: "/admin/cohorts", label: "Cohorts" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/review", label: "Review / Publish" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/reference-data", label: "Reference Data" },
  { href: "/admin/monitoring", label: "Monitoring" },
  { href: "/admin/audit-log", label: "Audit Log" },
  { href: "/admin/settings", label: "Settings" },
];

export const publicRoutes: Record<string, RouteDefinition> = {
  "/": {
    title: "CSO Learning Hub",
    purpose:
      "Introduce the learning platform and guide users toward courses or account access.",
  },
  "/courses": {
    title: "Course Catalogue",
    purpose:
      "Show published courses available to participants.",
    emptyTitle: "No courses have been published yet.",
    emptyDescription:
      "Published courses will appear here when they are ready.",
  },
  "/courses/[courseSlug]": {
    title: "Public Course Detail",
    purpose:
      "Show the participant-facing overview for a published course before enrollment or launch.",
  },
};

export const authRoutes: Record<string, RouteDefinition> = {
  "/sign-in": {
    title: "Sign In",
    purpose:
      "Allow existing users to access the right learning area.",
  },
  "/register": {
    title: "Register",
    purpose:
      "Allow participants to create an account when registration is available.",
  },
};

export const learnerRoutes: Record<string, RouteDefinition> = {
  "/learn": {
    title: "Participant Dashboard",
    purpose:
      "Show the participant learning home with enrolled courses, progress, completions, and certificates.",
    emptyTitle: "You do not have any courses yet.",
    emptyDescription:
      "Your courses will appear here when they are assigned or started.",
  },
  "/learn/my-courses": {
    title: "My Courses",
    purpose:
      "List courses the participant is enrolled in or assigned to, including progress and certificate status.",
  },
  "/learn/courses/[courseSlug]": {
    title: "Course Player",
    purpose:
      "Render the published course experience for an authenticated participant.",
  },
  "/learn/courses/[courseSlug]/external": {
    title: "Embedded Course Player",
    purpose:
      "Launch an approved external course app in an iframe and record portal progress.",
  },
  "/learn/courses/[courseSlug]/final-test": {
    title: "Final Test",
    purpose:
      "Allow participants to complete the course final test.",
  },
  "/learn/certificates": {
    title: "Certificates",
    purpose:
      "List certificates earned by the participant.",
  },
  "/learn/certificates/[certificateId]": {
    title: "Certificate Detail",
    purpose:
      "Show certificate detail, verification code, and download action.",
  },
  "/learn/courses/[courseSlug]/feedback": {
    title: "Course Feedback",
    purpose: "Collect participant feedback for course improvement.",
  },
  "/learn/profile": {
    title: "Profile",
    purpose:
      "Show and update basic participant profile information.",
  },
};

export const creatorRoutes: Record<string, RouteDefinition> = {
  "/creator": {
    title: "Creator Dashboard",
    purpose:
      "Show creator-owned or assigned courses and direct creators into the course-building workflow.",
    emptyTitle: "No draft courses yet.",
    emptyDescription:
      "Create your first course and start building structured digital learning content.",
  },
  "/creator/courses": {
    title: "Creator Courses",
    purpose:
      "List courses created or assigned to the current Course Creator.",
  },
  "/creator/courses/new": {
    title: "Create New Course",
    purpose:
      "Start a new draft course for structured digital learning.",
  },
  "/creator/courses/[courseId]/setup": {
    title: "Course Setup",
    purpose:
      "Edit core course setup information without exposing participant or admin controls.",
  },
  "/creator/courses/[courseId]/metadata": {
    title: "Course Metadata",
    purpose:
      "Capture lightweight capacity linkage and learning design metadata for course setup.",
  },
  "/creator/courses/[courseId]/outcomes": {
    title: "Learning Outcomes",
    purpose:
      "Define course learning outcomes before publication readiness checks.",
  },
  "/creator/courses/[courseId]/build": {
    title: "Build Studio",
    purpose:
      "Provide the future three-column authoring workspace for course content creation.",
  },
  "/creator/courses/[courseId]/resources": {
    title: "Course Resources",
    purpose:
      "Manage downloadable course resources for learner use.",
  },
  "/creator/courses/[courseId]/quiz": {
    title: "Quiz / Final Test Setup",
    purpose:
      "Configure final tests, pass thresholds, and scored questions.",
  },
  "/creator/courses/[courseId]/preview": {
    title: "Creator Preview",
    purpose:
      "Preview the learner-facing course template using the same content model as participant routes.",
  },
  "/creator/courses/[courseId]/submit": {
    title: "Submit for Review",
    purpose:
      "Show lightweight readiness checks and submit a course for review.",
  },
  "/creator/courses/[courseId]/feedback": {
    title: "Review Feedback",
    purpose:
      "Show revision feedback when a reviewed course is returned for changes.",
  },
};

export const adminRoutes: Record<string, RouteDefinition> = {
  "/admin": {
    title: "Admin Dashboard",
    purpose:
      "Show an operational overview of users, CSOs, cohorts, courses, certificates, and review needs.",
  },
  "/admin/users": {
    title: "Users",
    purpose:
      "Manage platform users and role assignments.",
    emptyTitle: "No users found.",
    emptyDescription:
      "Add your first platform user to begin assigning roles and access.",
  },
  "/admin/users/new": {
    title: "Add User",
    purpose:
      "Create a new platform user.",
  },
  "/admin/users/[userId]": {
    title: "User Detail",
    purpose:
      "View and edit a user profile, roles, organization, cohort, and participant activity.",
  },
  "/admin/organizations": {
    title: "Organizations",
    purpose:
      "Manage CSO organizations participating in the learning platform.",
    emptyTitle: "No CSO organizations have been added yet.",
    emptyDescription:
      "Add an organization to connect participants with their CSO context.",
  },
  "/admin/organizations/new": {
    title: "Add Organization",
    purpose:
      "Create a CSO organization profile.",
  },
  "/admin/organizations/[organizationId]": {
    title: "Organization Detail",
    purpose:
      "View organization profile, linked participants, cohort assignment, and learning summary.",
  },
  "/admin/cohorts": {
    title: "Cohorts",
    purpose:
      "Manage cohorts used for training delivery and monitoring.",
    emptyTitle: "No cohorts have been created yet.",
    emptyDescription:
      "Create a cohort to group organizations, participants, and assigned learning.",
  },
  "/admin/cohorts/new": {
    title: "Create Cohort",
    purpose:
      "Create a cohort for learning delivery and monitoring.",
  },
  "/admin/cohorts/[cohortId]": {
    title: "Cohort Detail",
    purpose:
      "View cohort profile, assigned organizations, participants, courses, and progress summary.",
  },
  "/admin/courses": {
    title: "Courses",
    purpose:
      "View and manage all courses without duplicating the creator Build Studio.",
  },
  "/admin/courses/[courseId]": {
    title: "Course Detail",
    purpose:
      "View admin course summary, status, creator, readiness, and publication state.",
  },
  "/admin/review": {
    title: "Review / Publish",
    purpose:
      "Manage the lightweight review and publishing queue.",
  },
  "/admin/review/[courseId]": {
    title: "Review Course",
    purpose:
      "Review a submitted course, approve it, return it for revision, or publish when authorized.",
  },
  "/admin/certificates": {
    title: "Certificates",
    purpose:
      "View certificate records and certificate status.",
  },
  "/admin/certificates/settings": {
    title: "Certificate Settings",
    purpose:
      "Configure certificate defaults, including the default pass threshold.",
  },
  "/admin/certificates/[certificateId]": {
    title: "Certificate Detail",
    purpose:
      "View issued certificate detail and status after certificate records exist.",
  },
  "/admin/reference-data": {
    title: "Reference Data",
    purpose:
      "Manage lookup values such as capacity areas, levels, regions, and languages.",
  },
  "/admin/monitoring": {
    title: "Monitoring",
    purpose:
      "Track operational learning activity, participation, completion, assessment, certificates, and feedback.",
    emptyTitle: "Monitoring data will appear after participants start learning.",
    emptyDescription:
      "Metrics and tables will populate after learning activity, certificates, and feedback exist.",
  },
  "/admin/audit-log": {
    title: "Audit Log",
    purpose:
      "Show critical platform actions for accountability.",
  },
  "/admin/settings": {
    title: "Settings",
    purpose:
      "Manage basic platform settings without adding a complex site-builder or future-phase configuration.",
  },
};

export function routeFromSegments(
  prefix: "learn" | "creator" | "admin",
  segments: string[] = [],
) {
  return `/${[prefix, ...segments].join("/")}`;
}

export function matchRoute(
  route: string,
  definitions: Record<string, RouteDefinition>,
) {
  if (definitions[route]) {
    return definitions[route];
  }

  const routeParts = route.split("/").filter(Boolean);
  const match = Object.entries(definitions).find(([pattern]) => {
    const patternParts = pattern.split("/").filter(Boolean);
    return (
      patternParts.length === routeParts.length &&
      patternParts.every(
        (part, index) =>
          part.startsWith("[") ||
          part === routeParts[index],
      )
    );
  });

  return match?.[1];
}
