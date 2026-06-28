import type { AuthSession } from "./session-codec";
import type { RoleKey } from "./roles";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  roles: RoleKey[];
  defaultPath: string;
  description: string;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "super-admin",
    name: "Super Admin",
    email: "superadmin@demo.local",
    roles: ["SUPER_ADMIN"],
    defaultPath: "/admin",
    description: "Full platform access for system-level verification.",
  },
  {
    id: "platform-admin",
    name: "Platform Admin",
    email: "admin@demo.local",
    roles: ["PLATFORM_ADMIN"],
    defaultPath: "/admin",
    description: "Operational admin access for admin route verification.",
  },
  {
    id: "course-creator",
    name: "Course Creator",
    email: "creator@demo.local",
    roles: ["COURSE_CREATOR"],
    defaultPath: "/creator",
    description: "Creator access for Course Creator portal verification.",
  },
  {
    id: "course-reviewer",
    name: "Course Reviewer",
    email: "reviewer@demo.local",
    roles: ["COURSE_REVIEWER"],
    defaultPath: "/admin/review",
    description: "Review queue access without general admin management.",
  },
  {
    id: "me-viewer",
    name: "M&E Viewer",
    email: "meviewer@demo.local",
    roles: ["ME_VIEWER"],
    defaultPath: "/admin/monitoring",
    description: "Monitoring-only access for M&E verification.",
  },
  {
    id: "participant",
    name: "Participant",
    email: "participant2@demo.local",
    roles: ["PARTICIPANT"],
    defaultPath: "/learn",
    description: "Participant access for learner route verification.",
  },
];

export function getDemoUserById(id: string) {
  return DEMO_USERS.find((user) => user.id === id);
}

export function toAuthSession(user: DemoUser): AuthSession {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    issuedAt: new Date().toISOString(),
  };
}
