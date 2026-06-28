import {
  AuditActionType,
  EnrollmentStatus,
  OrganizationFormalityStatus,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../generated/prisma/enums";
import { canAccessAdmin } from "./auth/permissions";
import {
  buildStaffRegistrationUrl,
  createInvitationExpiry,
  createInvitationToken,
  hashInvitationToken,
} from "./auth/onboarding-invitations";
import type { AuthSession } from "./auth/session-codec";
import { sendStaffInvitationEmail } from "./email";
import { cleanPresentationEmail, cleanPresentationText } from "./presentation-text";
import { prisma } from "./prisma";

export type AdminStatusTone = "blue" | "green" | "gray" | "orange" | "red" | "purple" | "gold";

export type AdminMetric = {
  helperText: string;
  label: string;
  tone: "blue" | "green" | "gray" | "orange" | "red";
  value: number | string;
};

export type AdminUserListItem = {
  cohort: string;
  email: string;
  enrollmentSummary: string;
  href: string;
  id: string;
  lastLogin: string;
  name: string;
  organization: string;
  roles: string;
  status: string;
  statusTone: AdminStatusTone;
};

export type AdminUsersData = {
  filterOptions: {
    cohorts: { id: string; label: string }[];
    organizations: { id: string; label: string }[];
    roles: { id: string; label: string }[];
    statuses: { id: string; label: string }[];
  };
  filters: Required<AdminUserFilters>;
  metrics: AdminMetric[];
  selectedUser: AdminUserListItem | null;
  users: AdminUserListItem[];
};

export type AdminUserFilters = {
  cohortId?: string;
  organizationId?: string;
  query?: string;
  role?: string;
  status?: string;
};

export type AdminUserDetailData = {
  activeRoleKeys: RoleKey[];
  certificates: {
    code: string;
    courseTitle: string;
    issuedAt: string;
    status: string;
  }[];
  cohort: string;
  createdAt: string;
  email: string;
  enrollments: {
    courseTitle: string;
    progress: string;
    status: string;
  }[];
  id: string;
  lastLogin: string;
  name: string;
  organizationId: string;
  organization: string;
  phone: string;
  primaryCohortId: string;
  region: string;
  roles: string[];
  status: string;
  statusTone: AdminStatusTone;
  statusValue: UserStatus;
};

export type AdminUserOperationOptions = {
  cohorts: {
    id: string;
    label: string;
  }[];
  organizations: {
    id: string;
    label: string;
  }[];
  roles: {
    key: RoleKey;
    label: string;
  }[];
  statuses: {
    label: string;
    value: UserStatus;
  }[];
};

export type AdminPeopleMutationResult = {
  code: string;
  cohortId?: string | null;
  organizationId?: string | null;
  success: boolean;
  userId?: string;
};

export type AdminUserCreateInput = {
  cohortId?: string | null;
  email: string;
  fullName: string;
  organizationId?: string | null;
  phone?: string | null;
  region?: string | null;
  roleKey: RoleKey;
  session: AuthSession | null;
  status: UserStatus;
};

export type AdminOrganizationListItem = {
  cohortCount: string;
  focalPerson: string;
  formality: string;
  href: string;
  id: string;
  name: string;
  participantCount: string;
  region: string;
  status: string;
  statusTone: AdminStatusTone;
  type: string;
};

export type AdminOrganizationsData = {
  metrics: AdminMetric[];
  organizations: AdminOrganizationListItem[];
  selectedOrganization: AdminOrganizationListItem | null;
};

export type AdminOrganizationDetailData = {
  assignedCourses: string[];
  certificateCount: number;
  cohorts: {
    href: string;
    name: string;
    status: string;
  }[];
  focalPerson: string;
  focalPersonEmail: string;
  focalPersonName: string;
  focalPersonPhone: string;
  formality: string;
  formalityValue: OrganizationFormalityStatus;
  id: string;
  name: string;
  notes: string;
  organizationTypeId: string;
  participants: {
    href: string;
    name: string;
    roles: string;
    status: string;
  }[];
  progressSummary: string;
  registrationNumber: string;
  region: string;
  shortName: string;
  status: string;
  statusTone: AdminStatusTone;
  statusValue: OrganizationStatus;
  type: string;
  woreda: string;
  zone: string;
};

export type AdminOrganizationOperationOptions = {
  cohorts: {
    id: string;
    label: string;
  }[];
  formalities: {
    label: string;
    value: OrganizationFormalityStatus;
  }[];
  statuses: {
    label: string;
    value: OrganizationStatus;
  }[];
};

export type AdminCohortListItem = {
  assignedCourses: string;
  dateRange: string;
  href: string;
  id: string;
  name: string;
  organizations: string;
  participants: string;
  program: string;
  regionFocus: string;
  status: string;
  statusTone: AdminStatusTone;
};

export type AdminCohortsData = {
  cohorts: AdminCohortListItem[];
  metrics: AdminMetric[];
  selectedCohort: AdminCohortListItem | null;
};

export type AdminCohortDetailData = {
  assignedCourses: string[];
  certificateCount: number;
  dateRange: string;
  description: string;
  endDateInput: string;
  id: string;
  name: string;
  organizations: {
    href: string;
    id: string;
    name: string;
    region: string;
    status: string;
  }[];
  participants: {
    href: string;
    name: string;
    organization: string;
    status: string;
  }[];
  program: string;
  progressSummary: string;
  regionFocus: string;
  startDateInput: string;
  status: string;
  statusTone: AdminStatusTone;
  statusValue: OrganizationStatus;
};

export type AdminCohortOperationOptions = {
  organizations: {
    id: string;
    label: string;
  }[];
  statuses: {
    label: string;
    value: OrganizationStatus;
  }[];
};

export type AdminOrganizationMutationInput = {
  focalPersonEmail?: string | null;
  focalPersonName?: string | null;
  focalPersonPhone?: string | null;
  formalityStatus: OrganizationFormalityStatus;
  name: string;
  notes?: string | null;
  organizationId?: string;
  organizationTypeId?: string | null;
  region?: string | null;
  registrationNumber?: string | null;
  session: AuthSession | null;
  shortName?: string | null;
  status: OrganizationStatus;
  woreda?: string | null;
  zone?: string | null;
};

export type AdminCohortMutationInput = {
  cohortId?: string;
  description?: string | null;
  endDate?: string | null;
  name: string;
  programmeName?: string | null;
  region?: string | null;
  session: AuthSession | null;
  startDate?: string | null;
  status: OrganizationStatus;
};

const roleLabels: Record<RoleKey, string> = {
  COURSE_CREATOR: "Course Creator",
  COURSE_REVIEWER: "Course Reviewer",
  CSO_FOCAL_PERSON: "CSO Focal Person",
  FACILITATOR: "Facilitator",
  ME_VIEWER: "M&E Viewer",
  PARTICIPANT: "Participant",
  PLATFORM_ADMIN: "Platform Admin",
  SUPER_ADMIN: "Super Admin",
};

const userStatusLabels: Record<UserStatus, string> = {
  ACTIVE: "Active",
  DEACTIVATED: "Deactivated",
  INVITED: "Invited",
  SUSPENDED: "Suspended",
};

const userStatusTones: Record<UserStatus, AdminStatusTone> = {
  ACTIVE: "green",
  DEACTIVATED: "gray",
  INVITED: "blue",
  SUSPENDED: "orange",
};

const organizationStatusLabels: Record<OrganizationStatus, string> = {
  ACTIVE: "Active",
  ARCHIVED: "Archived",
  INACTIVE: "Inactive",
};

const organizationStatusTones: Record<OrganizationStatus, AdminStatusTone> = {
  ACTIVE: "green",
  ARCHIVED: "gray",
  INACTIVE: "orange",
};

const formalityLabels: Record<OrganizationFormalityStatus, string> = {
  COMMUNITY_BASED: "Community based",
  FORMAL_REGISTERED: "Formal registered",
  INFORMAL: "Informal",
  NOT_APPLICABLE: "Not applicable",
  UNKNOWN: "Unknown",
};

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

function dateRange(startDate: Date | null, endDate: Date | null) {
  if (!startDate && !endDate) {
    return "Dates not set";
  }

  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  return startDate ? `Starts ${formatDate(startDate)}` : `Ends ${formatDate(endDate)}`;
}

function dateInput(value: Date | null | undefined) {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function parseDateInput(value: string | null | undefined) {
  if (!value) {
    return { date: null as Date | null, valid: true };
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return { date, valid: !Number.isNaN(date.getTime()) };
}

function roleSummary(
  assignments: { role: { key: RoleKey; name: string }; isActive: boolean }[],
) {
  const labels = assignments
    .filter((assignment) => assignment.isActive)
    .map((assignment) => roleLabels[assignment.role.key] ?? assignment.role.name);

  return labels.length > 0 ? labels.join(", ") : "No active role";
}

function activeRoleLabels(
  assignments: { role: { key: RoleKey; name: string }; isActive: boolean }[],
) {
  const labels = assignments
    .filter((assignment) => assignment.isActive)
    .map((assignment) => roleLabels[assignment.role.key] ?? assignment.role.name);

  return labels.length > 0 ? labels : ["No active role"];
}

function completedEnrollmentCount(
  enrollments: { status: EnrollmentStatus; progressPercent: number }[],
) {
  return enrollments.filter(
    (enrollment) =>
      enrollment.status === EnrollmentStatus.COMPLETED || enrollment.progressPercent >= 100,
  ).length;
}

function progressSummary(
  enrollments: { status: EnrollmentStatus; progressPercent: number }[],
) {
  if (enrollments.length === 0) {
    return "No enrollments yet";
  }

  const completed = completedEnrollmentCount(enrollments);
  const average = Math.round(
    enrollments.reduce((total, enrollment) => total + enrollment.progressPercent, 0) /
      enrollments.length,
  );

  return `${completed}/${enrollments.length} completed · ${average}% average progress`;
}

async function queryUsers() {
  return prisma.user.findMany({
    orderBy: [{ fullName: "asc" }, { email: "asc" }],
    select: {
      certificates: {
        select: {
          certificateCode: true,
          courseTitleSnapshot: true,
          issuedAt: true,
          status: true,
        },
      },
      createdAt: true,
      email: true,
      enrollments: {
        select: {
          course: { select: { title: true } },
          progressPercent: true,
          status: true,
        },
      },
      fullName: true,
      id: true,
      lastLoginAt: true,
      organization: { select: { id: true, name: true } },
      phone: true,
      primaryCohort: { select: { id: true, name: true } },
      region: true,
      roleAssignments: {
        select: {
          isActive: true,
          role: { select: { key: true, name: true } },
        },
        orderBy: { assignedAt: "asc" },
      },
      status: true,
    },
  });
}

type UserRecord = Awaited<ReturnType<typeof queryUsers>>[number];

function mapUser(record: UserRecord): AdminUserListItem {
  return {
    cohort: record.primaryCohort?.name ?? "No cohort",
    email: cleanPresentationEmail(record.email),
    enrollmentSummary:
      record.enrollments.length === 0
        ? "No enrollments"
        : `${completedEnrollmentCount(record.enrollments)}/${record.enrollments.length} complete`,
    href: `/admin/users/${record.id}`,
    id: record.id,
    lastLogin: formatDate(record.lastLoginAt),
    name: cleanPresentationText(record.fullName),
    organization: record.organization?.name ?? "No organization",
    roles: roleSummary(record.roleAssignments),
    status: userStatusLabels[record.status],
    statusTone: userStatusTones[record.status],
  };
}

export async function getAdminUsersData(
  session: AuthSession | null,
  filters: AdminUserFilters = {},
): Promise<AdminUsersData> {
  const selectedFilters: Required<AdminUserFilters> = {
    cohortId: filters.cohortId ?? "",
    organizationId: filters.organizationId ?? "",
    query: filters.query ?? "",
    role: filters.role ?? "",
    status: filters.status ?? "",
  };

  if (!canAccessAdmin(session)) {
    return {
      filterOptions: { cohorts: [], organizations: [], roles: [], statuses: [] },
      filters: selectedFilters,
      metrics: [],
      selectedUser: null,
      users: [],
    };
  }

  const records = await queryUsers();
  const query = selectedFilters.query.trim().toLowerCase();
  const filteredRecords = records.filter((user) => {
    const activeRoleKeys = user.roleAssignments
      .filter((assignment) => assignment.isActive)
      .map((assignment) => assignment.role.key);
    const searchable = [
      user.fullName,
      cleanPresentationText(user.fullName),
      user.email,
      cleanPresentationEmail(user.email),
      user.organization?.name ?? "",
      user.primaryCohort?.name ?? "",
      roleSummary(user.roleAssignments),
    ].join(" ").toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!selectedFilters.role || activeRoleKeys.includes(selectedFilters.role as RoleKey)) &&
      (!selectedFilters.status || user.status === selectedFilters.status) &&
      (!selectedFilters.organizationId || user.organization?.id === selectedFilters.organizationId) &&
      (!selectedFilters.cohortId || user.primaryCohort?.id === selectedFilters.cohortId)
    );
  });
  const users = filteredRecords.map(mapUser);
  const participantCount = records.filter((user) =>
    user.roleAssignments.some(
      (assignment) => assignment.isActive && assignment.role.key === RoleKey.PARTICIPANT,
    ),
  ).length;

  return {
    filterOptions: {
      cohorts: Array.from(
        new Map(
          records
            .filter((user) => user.primaryCohort)
            .map((user) => [user.primaryCohort!.id, user.primaryCohort!.name]),
        ),
      )
        .map(([id, label]) => ({ id, label }))
        .sort((left, right) => left.label.localeCompare(right.label)),
      organizations: Array.from(
        new Map(
          records
            .filter((user) => user.organization)
            .map((user) => [user.organization!.id, user.organization!.name]),
        ),
      )
        .map(([id, label]) => ({ id, label }))
        .sort((left, right) => left.label.localeCompare(right.label)),
      roles: Object.values(RoleKey).map((role) => ({
        id: role,
        label: roleLabels[role],
      })),
      statuses: Object.values(UserStatus).map((status) => ({
        id: status,
        label: userStatusLabels[status],
      })),
    },
    filters: selectedFilters,
    metrics: [
      {
        helperText: "Platform accounts currently recorded",
        label: "Total users",
        tone: "blue",
        value: records.length,
      },
      {
        helperText: "Accounts able to sign in",
        label: "Active users",
        tone: "green",
        value: records.filter((user) => user.status === UserStatus.ACTIVE).length,
      },
      {
        helperText: "Users holding participant access",
        label: "Participants",
        tone: "blue",
        value: participantCount,
      },
      {
        helperText: "Pending invitations",
        label: "Invited",
        tone: "orange",
        value: records.filter((user) => user.status === UserStatus.INVITED).length,
      },
    ],
    selectedUser: users[0] ?? null,
    users,
  };
}

export async function getAdminUserDetail(
  userId: string,
  session: AuthSession | null,
): Promise<AdminUserDetailData | null> {
  if (!canAccessAdmin(session)) {
    return null;
  }

  const user = await prisma.user.findUnique({
    select: {
      certificates: {
        orderBy: { issuedAt: "desc" },
        select: {
          certificateCode: true,
          courseTitleSnapshot: true,
          issuedAt: true,
          status: true,
        },
      },
      createdAt: true,
      email: true,
      enrollments: {
        orderBy: { updatedAt: "desc" },
        select: {
          course: { select: { title: true } },
          progressPercent: true,
          status: true,
        },
      },
      fullName: true,
      id: true,
      lastLoginAt: true,
      organization: { select: { id: true, name: true } },
      phone: true,
      primaryCohort: { select: { id: true, name: true } },
      region: true,
      roleAssignments: {
        select: {
          isActive: true,
          role: { select: { key: true, name: true } },
        },
        orderBy: { assignedAt: "asc" },
      },
      status: true,
    },
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return {
    activeRoleKeys: user.roleAssignments
      .filter((assignment) => assignment.isActive)
      .map((assignment) => assignment.role.key),
    certificates: user.certificates.map((certificate) => ({
      code: cleanPresentationText(certificate.certificateCode),
      courseTitle: certificate.courseTitleSnapshot ?? "Untitled course",
      issuedAt: formatDate(certificate.issuedAt),
      status: certificate.status.toLowerCase().replaceAll("_", " "),
    })),
    cohort: user.primaryCohort?.name ?? "No cohort",
    createdAt: formatDate(user.createdAt),
    email: cleanPresentationEmail(user.email),
    enrollments: user.enrollments.map((enrollment) => ({
      courseTitle: enrollment.course.title,
      progress: `${enrollment.progressPercent}%`,
      status: enrollment.status.toLowerCase().replaceAll("_", " "),
    })),
    id: user.id,
    lastLogin: formatDate(user.lastLoginAt),
    name: cleanPresentationText(user.fullName),
    organizationId: user.organization?.id ?? "",
    organization: user.organization?.name ?? "No organization",
    phone: user.phone ?? "Not recorded",
    primaryCohortId: user.primaryCohort?.id ?? "",
    region: user.region ?? "Not recorded",
    roles: activeRoleLabels(user.roleAssignments),
    status: userStatusLabels[user.status],
    statusTone: userStatusTones[user.status],
    statusValue: user.status,
  };
}

export async function getAdminUserOperationOptions(
  session: AuthSession | null,
): Promise<AdminUserOperationOptions> {
  if (!canAccessAdmin(session)) {
    return { cohorts: [], organizations: [], roles: [], statuses: [] };
  }

  const [roles, organizations, cohorts] = await Promise.all([
    prisma.role.findMany({
      orderBy: { name: "asc" },
      select: { key: true, name: true },
    }),
    prisma.organization.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, region: true },
      where: { status: { not: OrganizationStatus.ARCHIVED } },
    }),
    prisma.cohort.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, region: true },
      where: { status: { not: OrganizationStatus.ARCHIVED } },
    }),
  ]);

  return {
    cohorts: cohorts.map((cohort) => ({
      id: cohort.id,
      label: cohort.region ? `${cohort.name} (${cohort.region})` : cohort.name,
    })),
    organizations: organizations.map((organization) => ({
      id: organization.id,
      label: organization.region
        ? `${organization.name} (${organization.region})`
        : organization.name,
    })),
    roles: roles.map((role) => ({
      key: role.key,
      label: roleLabels[role.key] ?? role.name,
    })),
    statuses: Object.values(UserStatus).map((status) => ({
      label: userStatusLabels[status],
      value: status,
    })),
  };
}

function isUserStatus(value: UserStatus) {
  return Object.values(UserStatus).includes(value);
}

function isRoleKey(value: RoleKey) {
  return Object.values(RoleKey).includes(value);
}

async function queryOrganizations() {
  return prisma.organization.findMany({
    orderBy: { name: "asc" },
    select: {
      cohortLinks: {
        select: {
          cohort: { select: { id: true, name: true, status: true } },
        },
      },
      courseAssignments: {
        where: { isActive: true },
        select: { course: { select: { title: true } } },
      },
      focalPersonEmail: true,
      focalPersonName: true,
      focalPersonPhone: true,
      formalityStatus: true,
      id: true,
      name: true,
      notes: true,
      organizationTypeId: true,
      region: true,
      registrationNumber: true,
      shortName: true,
      status: true,
      woreda: true,
      users: {
        select: {
          certificates: { select: { id: true } },
          enrollments: { select: { progressPercent: true, status: true } },
          fullName: true,
          id: true,
          roleAssignments: {
            select: {
              isActive: true,
              role: { select: { key: true, name: true } },
            },
          },
          status: true,
        },
      },
    },
  });
}

type OrganizationRecord = Awaited<ReturnType<typeof queryOrganizations>>[number];

function mapOrganization(record: OrganizationRecord): AdminOrganizationListItem {
  return {
    cohortCount: String(record.cohortLinks.length),
    focalPerson: cleanPresentationText(
      record.focalPersonName ?? record.focalPersonEmail ?? "Not assigned",
    ),
    formality: formalityLabels[record.formalityStatus],
    href: `/admin/organizations/${record.id}`,
    id: record.id,
    name: record.name,
    participantCount: String(record.users.length),
    region: record.region ?? "No region",
    status: organizationStatusLabels[record.status],
    statusTone: organizationStatusTones[record.status],
    type: record.organizationTypeId ?? record.shortName ?? "CSO",
  };
}

export async function getAdminOrganizationsData(
  session: AuthSession | null,
): Promise<AdminOrganizationsData> {
  if (!canAccessAdmin(session)) {
    return { metrics: [], organizations: [], selectedOrganization: null };
  }

  const records = await queryOrganizations();
  const organizations = records.map(mapOrganization);
  const participantCount = records.reduce((total, organization) => total + organization.users.length, 0);
  const cohortCount = records.reduce(
    (total, organization) => total + organization.cohortLinks.length,
    0,
  );

  return {
    metrics: [
      {
        helperText: "CSO profiles currently recorded",
        label: "Organizations",
        tone: "blue",
        value: records.length,
      },
      {
        helperText: "Organizations available for learning",
        label: "Active",
        tone: "green",
        value: records.filter((organization) => organization.status === OrganizationStatus.ACTIVE).length,
      },
      {
        helperText: "Linked platform users",
        label: "Participants",
        tone: "blue",
        value: participantCount,
      },
      {
        helperText: "Cohort memberships",
        label: "Cohort links",
        tone: "green",
        value: cohortCount,
      },
    ],
    organizations,
    selectedOrganization: organizations[0] ?? null,
  };
}

export async function getAdminOrganizationDetail(
  organizationId: string,
  session: AuthSession | null,
): Promise<AdminOrganizationDetailData | null> {
  if (!canAccessAdmin(session)) {
    return null;
  }

  const organization = await prisma.organization.findUnique({
    select: {
      cohortLinks: {
        select: {
          cohort: { select: { id: true, name: true, status: true } },
        },
      },
      courseAssignments: {
        where: { isActive: true },
        select: { course: { select: { title: true } } },
      },
      focalPersonEmail: true,
      focalPersonName: true,
      focalPersonPhone: true,
      formalityStatus: true,
      id: true,
      name: true,
      notes: true,
      organizationTypeId: true,
      region: true,
      registrationNumber: true,
      shortName: true,
      status: true,
      users: {
        orderBy: { fullName: "asc" },
        select: {
          certificates: { select: { id: true } },
          enrollments: { select: { progressPercent: true, status: true } },
          fullName: true,
          id: true,
          roleAssignments: {
            select: {
              isActive: true,
              role: { select: { key: true, name: true } },
            },
          },
          status: true,
        },
      },
      woreda: true,
      zone: true,
    },
    where: { id: organizationId },
  });

  if (!organization) {
    return null;
  }

  const enrollments = organization.users.flatMap((user) => user.enrollments);

  return {
    assignedCourses: organization.courseAssignments.map((assignment) => assignment.course.title),
    certificateCount: organization.users.reduce(
      (total, user) => total + user.certificates.length,
      0,
    ),
    cohorts: organization.cohortLinks.map((link) => ({
      href: `/admin/cohorts/${link.cohort.id}`,
      name: link.cohort.name,
      status: organizationStatusLabels[link.cohort.status],
    })),
    focalPerson: cleanPresentationText(
      organization.focalPersonName ?? organization.focalPersonEmail ?? "Not assigned",
    ),
    focalPersonEmail: cleanPresentationEmail(organization.focalPersonEmail ?? ""),
    focalPersonName: cleanPresentationText(organization.focalPersonName ?? ""),
    focalPersonPhone: organization.focalPersonPhone ?? "",
    formality: formalityLabels[organization.formalityStatus],
    formalityValue: organization.formalityStatus,
    id: organization.id,
    name: organization.name,
    notes: organization.notes ?? "No notes recorded.",
    organizationTypeId: organization.organizationTypeId ?? "",
    participants: organization.users.map((user) => ({
      href: `/admin/users/${user.id}`,
      name: cleanPresentationText(user.fullName),
      roles: roleSummary(user.roleAssignments),
      status: userStatusLabels[user.status],
    })),
    progressSummary: progressSummary(enrollments),
    registrationNumber: organization.registrationNumber ?? "",
    region: organization.region ?? "No region",
    shortName: organization.shortName ?? "",
    status: organizationStatusLabels[organization.status],
    statusTone: organizationStatusTones[organization.status],
    statusValue: organization.status,
    type: organization.organizationTypeId ?? organization.shortName ?? "CSO",
    woreda: organization.woreda ?? "",
    zone: organization.zone ?? "",
  };
}

export async function getAdminOrganizationOperationOptions(
  session: AuthSession | null,
): Promise<AdminOrganizationOperationOptions> {
  if (!canAccessAdmin(session)) {
    return { cohorts: [], formalities: [], statuses: [] };
  }

  const cohorts = await prisma.cohort.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, region: true },
    where: { status: { not: OrganizationStatus.ARCHIVED } },
  });

  return {
    cohorts: cohorts.map((cohort) => ({
      id: cohort.id,
      label: cohort.region ? `${cohort.name} (${cohort.region})` : cohort.name,
    })),
    formalities: Object.values(OrganizationFormalityStatus).map((status) => ({
      label: formalityLabels[status],
      value: status,
    })),
    statuses: Object.values(OrganizationStatus).map((status) => ({
      label: organizationStatusLabels[status],
      value: status,
    })),
  };
}

async function queryCohorts() {
  return prisma.cohort.findMany({
    orderBy: { name: "asc" },
    select: {
      courseAssignments: {
        where: { isActive: true },
        select: { course: { select: { title: true } } },
      },
      description: true,
      endDate: true,
      id: true,
      name: true,
      organizationLinks: {
        select: {
          organization: { select: { id: true, name: true, region: true, status: true } },
        },
      },
      programmeName: true,
      region: true,
      startDate: true,
      status: true,
      users: {
        select: {
          certificates: { select: { id: true } },
          enrollments: { select: { progressPercent: true, status: true } },
          fullName: true,
          id: true,
          organization: { select: { name: true } },
          status: true,
        },
      },
    },
  });
}

type CohortRecord = Awaited<ReturnType<typeof queryCohorts>>[number];

function mapCohort(record: CohortRecord): AdminCohortListItem {
  return {
    assignedCourses: String(record.courseAssignments.length),
    dateRange: dateRange(record.startDate, record.endDate),
    href: `/admin/cohorts/${record.id}`,
    id: record.id,
    name: record.name,
    organizations: String(record.organizationLinks.length),
    participants: String(record.users.length),
    program: record.programmeName ?? "No programme",
    regionFocus: record.region ?? "No region focus",
    status: organizationStatusLabels[record.status],
    statusTone: organizationStatusTones[record.status],
  };
}

export async function getAdminCohortsData(
  session: AuthSession | null,
): Promise<AdminCohortsData> {
  if (!canAccessAdmin(session)) {
    return { cohorts: [], metrics: [], selectedCohort: null };
  }

  const records = await queryCohorts();
  const cohorts = records.map(mapCohort);
  const organizationLinks = records.reduce(
    (total, cohort) => total + cohort.organizationLinks.length,
    0,
  );
  const participants = records.reduce((total, cohort) => total + cohort.users.length, 0);

  return {
    cohorts,
    metrics: [
      {
        helperText: "Learning groups currently recorded",
        label: "Total cohorts",
        tone: "blue",
        value: records.length,
      },
      {
        helperText: "Open for learning",
        label: "Active cohorts",
        tone: "green",
        value: records.filter((cohort) => cohort.status === OrganizationStatus.ACTIVE).length,
      },
      {
        helperText: "CSO links across cohorts",
        label: "Linked organizations",
        tone: "blue",
        value: organizationLinks,
      },
      {
        helperText: "Users with cohort access",
        label: "Participants",
        tone: "green",
        value: participants,
      },
    ],
    selectedCohort: cohorts[0] ?? null,
  };
}

export async function getAdminCohortDetail(
  cohortId: string,
  session: AuthSession | null,
): Promise<AdminCohortDetailData | null> {
  if (!canAccessAdmin(session)) {
    return null;
  }

  const cohort = await prisma.cohort.findUnique({
    select: {
      courseAssignments: {
        where: { isActive: true },
        select: { course: { select: { title: true } } },
      },
      description: true,
      endDate: true,
      id: true,
      name: true,
      organizationLinks: {
        select: {
          organization: { select: { id: true, name: true, region: true, status: true } },
        },
      },
      programmeName: true,
      region: true,
      startDate: true,
      status: true,
      users: {
        orderBy: { fullName: "asc" },
        select: {
          certificates: { select: { id: true } },
          enrollments: { select: { progressPercent: true, status: true } },
          fullName: true,
          id: true,
          organization: { select: { name: true } },
          status: true,
        },
      },
    },
    where: { id: cohortId },
  });

  if (!cohort) {
    return null;
  }

  const enrollments = cohort.users.flatMap((user) => user.enrollments);

  return {
    assignedCourses: cohort.courseAssignments.map((assignment) => assignment.course.title),
    certificateCount: cohort.users.reduce((total, user) => total + user.certificates.length, 0),
    dateRange: dateRange(cohort.startDate, cohort.endDate),
    description: cohort.description ?? "No cohort description recorded.",
    endDateInput: dateInput(cohort.endDate),
    id: cohort.id,
    name: cohort.name,
    organizations: cohort.organizationLinks.map((link) => ({
      href: `/admin/organizations/${link.organization.id}`,
      id: link.organization.id,
      name: link.organization.name,
      region: link.organization.region ?? "No region",
      status: organizationStatusLabels[link.organization.status],
    })),
    participants: cohort.users.map((user) => ({
      href: `/admin/users/${user.id}`,
      name: cleanPresentationText(user.fullName),
      organization: user.organization?.name ?? "No organization",
      status: userStatusLabels[user.status],
    })),
    program: cohort.programmeName ?? "No programme",
    progressSummary: progressSummary(enrollments),
    regionFocus: cohort.region ?? "No region focus",
    startDateInput: dateInput(cohort.startDate),
    status: organizationStatusLabels[cohort.status],
    statusTone: organizationStatusTones[cohort.status],
    statusValue: cohort.status,
  };
}

export async function getAdminCohortOperationOptions(
  session: AuthSession | null,
): Promise<AdminCohortOperationOptions> {
  if (!canAccessAdmin(session)) {
    return { organizations: [], statuses: [] };
  }

  const organizations = await prisma.organization.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, region: true },
    where: { status: { not: OrganizationStatus.ARCHIVED } },
  });

  return {
    organizations: organizations.map((organization) => ({
      id: organization.id,
      label: organization.region
        ? `${organization.name} (${organization.region})`
        : organization.name,
    })),
    statuses: Object.values(OrganizationStatus).map((status) => ({
      label: organizationStatusLabels[status],
      value: status,
    })),
  };
}

async function resolveActorUser(session: AuthSession | null) {
  if (!canAccessAdmin(session)) {
    return null;
  }

  return prisma.user.findFirst({
    select: { id: true },
    where: {
      OR: [{ id: session?.userId }, { email: session?.email }],
    },
  });
}

type AdminPeopleMutationClient = Pick<
  typeof prisma,
  | "auditLog"
  | "cohort"
  | "cohortOrganization"
  | "organization"
  | "role"
  | "user"
  | "userRoleAssignment"
>;

async function activeSuperAdminCount(tx: AdminPeopleMutationClient) {
  return tx.user.count({
    where: {
      roleAssignments: {
        some: {
          isActive: true,
          role: { key: RoleKey.SUPER_ADMIN },
        },
      },
      status: UserStatus.ACTIVE,
    },
  });
}

async function targetIsActiveSuperAdmin(
  tx: AdminPeopleMutationClient,
  userId: string,
) {
  const user = await tx.user.findFirst({
    select: { id: true },
    where: {
      id: userId,
      roleAssignments: {
        some: {
          isActive: true,
          role: { key: RoleKey.SUPER_ADMIN },
        },
      },
      status: UserStatus.ACTIVE,
    },
  });

  return Boolean(user);
}

type StaffInvitationDeliveryResult = {
  code: string;
  emailDelivered: boolean;
  invitationUrl?: string;
  success: boolean;
};

async function deliverStaffInvitationEmail({
  email,
  invitationUrl,
}: {
  email: string;
  invitationUrl: string;
}): Promise<Pick<StaffInvitationDeliveryResult, "code" | "emailDelivered">> {
  const emailResult = await sendStaffInvitationEmail({ email, invitationUrl });

  if (emailResult.delivered) {
    return { code: "invitation-created", emailDelivered: true };
  }

  if (emailResult.reason === "missing-config") {
    return { code: "invitation-created-manual-link", emailDelivered: false };
  }

  return { code: "invitation-created-email-failed", emailDelivered: false };
}

async function persistStaffInvitation({
  actorUserId,
  cleanEmail,
  expiresAt,
  roleKey,
  tokenHash,
}: {
  actorUserId: string;
  cleanEmail: string;
  expiresAt: Date;
  roleKey: RoleKey;
  tokenHash: string;
}) {
  await prisma.$transaction(async (tx) => {
    const role = await tx.role.findUnique({
      select: { id: true },
      where: { key: roleKey },
    });
    if (!role) {
      throw new Error("missing-role");
    }

    const user = await tx.user.upsert({
      create: {
        email: cleanEmail,
        fullName: cleanEmail.split("@")[0] ?? cleanEmail,
        status: UserStatus.INVITED,
      },
      update: {
        status: UserStatus.INVITED,
      },
      where: { email: cleanEmail },
    });

    await tx.userRoleAssignment.upsert({
      create: {
        assignedById: actorUserId,
        roleId: role.id,
        userId: user.id,
      },
      update: {
        assignedAt: new Date(),
        assignedById: actorUserId,
        isActive: true,
      },
      where: {
        userId_roleId: {
          roleId: role.id,
          userId: user.id,
        },
      },
    });

    await tx.onboardingInvitation.deleteMany({ where: { email: cleanEmail } });
    await tx.onboardingInvitation.create({
      data: {
        attemptCount: 0,
        email: cleanEmail,
        expiresAt,
        invitedByUserId: actorUserId,
        role: roleKey,
        tokenHash,
        usedAt: null,
      },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.USER_UPDATED,
        actorUserId: actorUserId,
        description: `Issued onboarding invite for ${cleanEmail}.`,
        entityId: cleanEmail,
        entityType: "OnboardingInvitation",
        metadataJson: {
          expiresAt: expiresAt.toISOString(),
          role: roleKey,
        },
      },
    });
  });
}

export async function createAdminUser(
  input: AdminUserCreateInput,
): Promise<AdminPeopleMutationResult & { invitationUrl?: string }> {
  const actor = await resolveActorUser(input.session);
  if (!actor) {
    return { code: "unauthorized", success: false };
  }

  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const organizationId = nullableText(input.organizationId);
  const cohortId = nullableText(input.cohortId);

  if (!fullName) {
    return { code: "user-name-required", success: false };
  }

  if (!email || !email.includes("@")) {
    return { code: "user-email-required", success: false };
  }

  if (!isUserStatus(input.status)) {
    return { code: "invalid-status", success: false };
  }

  if (!isRoleKey(input.roleKey)) {
    return { code: "invalid-role", success: false };
  }

  return prisma.$transaction(async (tx) => {
    const [existingUser, role, organization, cohort] = await Promise.all([
      tx.user.findUnique({
        select: { id: true },
        where: { email },
      }),
      tx.role.findUnique({
        select: { id: true, key: true, name: true },
        where: { key: input.roleKey },
      }),
      organizationId
        ? tx.organization.findUnique({
            select: { id: true, name: true },
            where: { id: organizationId },
          })
        : Promise.resolve(null),
      cohortId
        ? tx.cohort.findUnique({
            select: { id: true, name: true },
            where: { id: cohortId },
          })
        : Promise.resolve(null),
    ]);

    if (existingUser) {
      return { code: "user-email-exists", success: false };
    }

    if (!role) {
      return { code: "invalid-role", success: false };
    }

    if (organizationId && !organization) {
      return { code: "organization-not-found", success: false };
    }

    if (cohortId && !cohort) {
      return { code: "cohort-not-found", success: false };
    }

    const user = await tx.user.create({
      data: {
        email,
        fullName,
        organizationId,
        phone: nullableText(input.phone),
        preferredLanguage: "English",
        primaryCohortId: cohortId,
        region: nullableText(input.region),
        status: input.status,
      },
      select: {
        email: true,
        fullName: true,
        id: true,
      },
    });

    await tx.userRoleAssignment.create({
      data: {
        assignedById: actor.id,
        roleId: role.id,
        userId: user.id,
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          actionType: AuditActionType.USER_CREATED,
          actorUserId: actor.id,
          description: `Created user account for ${user.fullName}.`,
          entityId: user.id,
          entityType: "User",
          metadataJson: {
            cohortId,
            email: user.email,
            organizationId,
            status: input.status,
          },
        },
        {
          actionType: AuditActionType.ROLE_ASSIGNED,
          actorUserId: actor.id,
          description: `Assigned ${roleLabels[role.key]} to ${user.fullName}.`,
          entityId: user.id,
          entityType: "User",
          metadataJson: {
            email: user.email,
            roleKey: role.key,
          },
        },
      ],
    });

    return {
      code: "user-created",
      cohortId,
      organizationId,
      success: true,
      userId: user.id,
    };
  }).then(async (result) => {
    if (!result.success || input.status !== UserStatus.INVITED) {
      return result;
    }

    const invitationResult = await inviteStaffMember({
      email,
      roleKey: input.roleKey,
      session: input.session,
    });

    if (!invitationResult.success) {
      return {
        ...result,
        code: invitationResult.code,
        success: false,
      };
    }

    return {
      ...result,
      code:
        invitationResult.code === "invitation-created"
          ? "user-created-invitation-sent"
          : invitationResult.code,
      invitationUrl: invitationResult.invitationUrl,
    };
  });
}

export async function updateAdminUserStatus({
  session,
  status,
  userId,
}: {
  session: AuthSession | null;
  status: UserStatus;
  userId: string;
}): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", success: false };
  }

  if (!Object.values(UserStatus).includes(status)) {
    return { code: "invalid-status", success: false, userId };
  }

  if (actor.id === userId && status !== UserStatus.ACTIVE) {
    return { code: "self-status-blocked", success: false, userId };
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      select: { email: true, fullName: true, organizationId: true, primaryCohortId: true, status: true },
      where: { id: userId },
    });

    if (!user) {
      return { code: "user-not-found", success: false, userId };
    }

    if (
      status !== UserStatus.ACTIVE &&
      (await targetIsActiveSuperAdmin(tx, userId)) &&
      (await activeSuperAdminCount(tx)) <= 1
    ) {
      return { code: "last-super-admin", success: false, userId };
    }

    if (user.status === status) {
      return {
        code: "status-unchanged",
        cohortId: user.primaryCohortId,
        organizationId: user.organizationId,
        success: true,
        userId,
      };
    }

    await tx.user.update({
      data: { status },
      where: { id: userId },
    });

    await tx.auditLog.create({
      data: {
        actionType:
          status === UserStatus.DEACTIVATED
            ? AuditActionType.USER_DEACTIVATED
            : AuditActionType.USER_UPDATED,
        actorUserId: actor.id,
        description: `Updated ${user.fullName} account status to ${userStatusLabels[status]}.`,
        entityId: userId,
        entityType: "User",
        metadataJson: {
          email: user.email,
          previousStatus: user.status,
          status,
        },
      },
    });

    return {
      code: "status-updated",
      cohortId: user.primaryCohortId,
      organizationId: user.organizationId,
      success: true,
      userId,
    };
  });
}

export async function assignAdminUserRole({
  roleKey,
  session,
  userId,
}: {
  roleKey: RoleKey;
  session: AuthSession | null;
  userId: string;
}): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", success: false };
  }

  if (!Object.values(RoleKey).includes(roleKey)) {
    return { code: "invalid-role", success: false, userId };
  }

  return prisma.$transaction(async (tx) => {
    const [user, role] = await Promise.all([
      tx.user.findUnique({
        select: { email: true, fullName: true, organizationId: true, primaryCohortId: true },
        where: { id: userId },
      }),
      tx.role.findUnique({
        select: { id: true, key: true, name: true },
        where: { key: roleKey },
      }),
    ]);

    if (!user || !role) {
      return { code: "user-or-role-not-found", success: false, userId };
    }

    const existing = await tx.userRoleAssignment.findUnique({
      select: { isActive: true },
      where: { userId_roleId: { roleId: role.id, userId } },
    });

    if (existing?.isActive) {
      return {
        code: "role-already-assigned",
        cohortId: user.primaryCohortId,
        organizationId: user.organizationId,
        success: true,
        userId,
      };
    }

    await tx.userRoleAssignment.upsert({
      create: {
        assignedById: actor.id,
        roleId: role.id,
        userId,
      },
      update: {
        assignedAt: new Date(),
        assignedById: actor.id,
        expiresAt: null,
        isActive: true,
      },
      where: { userId_roleId: { roleId: role.id, userId } },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.ROLE_ASSIGNED,
        actorUserId: actor.id,
        description: `Assigned ${roleLabels[role.key]} to ${user.fullName}.`,
        entityId: userId,
        entityType: "User",
        metadataJson: {
          email: user.email,
          roleKey: role.key,
        },
      },
    });

    return {
      code: "role-assigned",
      cohortId: user.primaryCohortId,
      organizationId: user.organizationId,
      success: true,
      userId,
    };
  });
}

export async function removeAdminUserRole({
  roleKey,
  session,
  userId,
}: {
  roleKey: RoleKey;
  session: AuthSession | null;
  userId: string;
}): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", success: false };
  }

  if (!Object.values(RoleKey).includes(roleKey)) {
    return { code: "invalid-role", success: false, userId };
  }

  if (
    actor.id === userId &&
    (roleKey === RoleKey.SUPER_ADMIN || roleKey === RoleKey.PLATFORM_ADMIN)
  ) {
    return { code: "self-role-blocked", success: false, userId };
  }

  return prisma.$transaction(async (tx) => {
    const [user, role] = await Promise.all([
      tx.user.findUnique({
        select: { email: true, fullName: true, organizationId: true, primaryCohortId: true },
        where: { id: userId },
      }),
      tx.role.findUnique({
        select: { id: true, key: true, name: true },
        where: { key: roleKey },
      }),
    ]);

    if (!user || !role) {
      return { code: "user-or-role-not-found", success: false, userId };
    }

    if (
      role.key === RoleKey.SUPER_ADMIN &&
      (await targetIsActiveSuperAdmin(tx, userId)) &&
      (await activeSuperAdminCount(tx)) <= 1
    ) {
      return { code: "last-super-admin", success: false, userId };
    }

    const existing = await tx.userRoleAssignment.findUnique({
      select: { id: true, isActive: true },
      where: { userId_roleId: { roleId: role.id, userId } },
    });

    if (!existing?.isActive) {
      return {
        code: "role-not-assigned",
        cohortId: user.primaryCohortId,
        organizationId: user.organizationId,
        success: true,
        userId,
      };
    }

    await tx.userRoleAssignment.update({
      data: { isActive: false },
      where: { id: existing.id },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.ROLE_REMOVED,
        actorUserId: actor.id,
        description: `Removed ${roleLabels[role.key]} from ${user.fullName}.`,
        entityId: userId,
        entityType: "User",
        metadataJson: {
          email: user.email,
          roleKey: role.key,
        },
      },
    });

    return {
      code: "role-removed",
      cohortId: user.primaryCohortId,
      organizationId: user.organizationId,
      success: true,
      userId,
    };
  });
}

export async function linkAdminUserContext({
  cohortId,
  organizationId,
  session,
  userId,
}: {
  cohortId: string | null;
  organizationId: string | null;
  session: AuthSession | null;
  userId: string;
}): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", success: false };
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      select: {
        email: true,
        fullName: true,
        organizationId: true,
        primaryCohortId: true,
      },
      where: { id: userId },
    });

    if (!user) {
      return { code: "user-not-found", success: false, userId };
    }

    const [organization, cohort] = await Promise.all([
      organizationId
        ? tx.organization.findUnique({
            select: { id: true, name: true },
            where: { id: organizationId },
          })
        : Promise.resolve(null),
      cohortId
        ? tx.cohort.findUnique({
            select: { id: true, name: true },
            where: { id: cohortId },
          })
        : Promise.resolve(null),
    ]);

    if (organizationId && !organization) {
      return { code: "organization-not-found", success: false, userId };
    }

    if (cohortId && !cohort) {
      return { code: "cohort-not-found", success: false, userId };
    }

    await tx.user.update({
      data: {
        organizationId,
        primaryCohortId: cohortId,
      },
      where: { id: userId },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.USER_UPDATED,
        actorUserId: actor.id,
        description: `Updated organization and cohort links for ${user.fullName}.`,
        entityId: userId,
        entityType: "User",
        metadataJson: {
          cohortId,
          email: user.email,
          organizationId,
          previousCohortId: user.primaryCohortId,
          previousOrganizationId: user.organizationId,
        },
      },
    });

    return {
      code: "context-linked",
      cohortId,
      organizationId,
      success: true,
      userId,
    };
  });
}

function nullableText(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";

  return trimmed.length > 0 ? trimmed : null;
}

function isOrganizationStatus(value: OrganizationStatus) {
  return Object.values(OrganizationStatus).includes(value);
}

function isFormalityStatus(value: OrganizationFormalityStatus) {
  return Object.values(OrganizationFormalityStatus).includes(value);
}

function organizationPayload(input: AdminOrganizationMutationInput) {
  return {
    focalPersonEmail: nullableText(input.focalPersonEmail),
    focalPersonName: nullableText(input.focalPersonName),
    focalPersonPhone: nullableText(input.focalPersonPhone),
    formalityStatus: input.formalityStatus,
    name: input.name.trim(),
    notes: nullableText(input.notes),
    organizationTypeId: nullableText(input.organizationTypeId),
    region: nullableText(input.region),
    registrationNumber: nullableText(input.registrationNumber),
    shortName: nullableText(input.shortName),
    status: input.status,
    woreda: nullableText(input.woreda),
    zone: nullableText(input.zone),
  };
}

async function ensureUniqueOrganizationName(
  tx: AdminPeopleMutationClient,
  name: string,
  organizationId?: string,
) {
  const existing = await tx.organization.findFirst({
    select: { id: true },
    where: {
      id: organizationId ? { not: organizationId } : undefined,
      name,
    },
  });

  return !existing;
}

export async function createAdminOrganization(
  input: AdminOrganizationMutationInput,
): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(input.session);
  if (!actor) {
    return { code: "unauthorized", success: false };
  }

  const data = organizationPayload(input);
  if (!data.name) {
    return { code: "organization-name-required", success: false };
  }

  if (!isOrganizationStatus(data.status) || !isFormalityStatus(data.formalityStatus)) {
    return { code: "invalid-organization-status", success: false };
  }

  return prisma.$transaction(async (tx) => {
    if (!(await ensureUniqueOrganizationName(tx, data.name))) {
      return { code: "organization-name-exists", success: false };
    }

    const organization = await tx.organization.create({
      data,
      select: { id: true, name: true },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.ORGANIZATION_CREATED,
        actorUserId: actor.id,
        description: `Created organization ${organization.name}.`,
        entityId: organization.id,
        entityType: "Organization",
        metadataJson: { name: organization.name, status: data.status },
      },
    });

    return {
      code: "organization-created",
      organizationId: organization.id,
      success: true,
    };
  });
}

export async function updateAdminOrganization(
  input: AdminOrganizationMutationInput & { organizationId: string },
): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(input.session);
  if (!actor) {
    return { code: "unauthorized", organizationId: input.organizationId, success: false };
  }

  const data = organizationPayload(input);
  if (!data.name) {
    return {
      code: "organization-name-required",
      organizationId: input.organizationId,
      success: false,
    };
  }

  if (!isOrganizationStatus(data.status) || !isFormalityStatus(data.formalityStatus)) {
    return {
      code: "invalid-organization-status",
      organizationId: input.organizationId,
      success: false,
    };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.organization.findUnique({
      select: { id: true, name: true },
      where: { id: input.organizationId },
    });

    if (!existing) {
      return {
        code: "organization-not-found",
        organizationId: input.organizationId,
        success: false,
      };
    }

    if (!(await ensureUniqueOrganizationName(tx, data.name, input.organizationId))) {
      return {
        code: "organization-name-exists",
        organizationId: input.organizationId,
        success: false,
      };
    }

    const organization = await tx.organization.update({
      data,
      select: { id: true, name: true },
      where: { id: input.organizationId },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.ORGANIZATION_UPDATED,
        actorUserId: actor.id,
        description: `Updated organization ${organization.name}.`,
        entityId: organization.id,
        entityType: "Organization",
        metadataJson: {
          previousName: existing.name,
          status: data.status,
        },
      },
    });

    return {
      code: "organization-updated",
      organizationId: organization.id,
      success: true,
    };
  });
}

function cohortPayload(input: AdminCohortMutationInput) {
  const start = parseDateInput(input.startDate);
  const end = parseDateInput(input.endDate);

  return {
    data: {
      description: nullableText(input.description),
      endDate: end.date,
      name: input.name.trim(),
      programmeName: nullableText(input.programmeName),
      region: nullableText(input.region),
      startDate: start.date,
      status: input.status,
    },
    validDates: start.valid && end.valid,
  };
}

async function ensureUniqueCohortName(
  tx: AdminPeopleMutationClient,
  name: string,
  cohortId?: string,
) {
  const existing = await tx.cohort.findFirst({
    select: { id: true },
    where: {
      id: cohortId ? { not: cohortId } : undefined,
      name,
    },
  });

  return !existing;
}

export async function createAdminCohort(
  input: AdminCohortMutationInput,
): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(input.session);
  if (!actor) {
    return { code: "unauthorized", success: false };
  }

  const { data, validDates } = cohortPayload(input);
  if (!data.name) {
    return { code: "cohort-name-required", success: false };
  }

  if (!isOrganizationStatus(data.status)) {
    return { code: "invalid-cohort-status", success: false };
  }

  if (!validDates) {
    return { code: "invalid-cohort-dates", success: false };
  }

  return prisma.$transaction(async (tx) => {
    if (!(await ensureUniqueCohortName(tx, data.name))) {
      return { code: "cohort-name-exists", success: false };
    }

    const cohort = await tx.cohort.create({
      data,
      select: { id: true, name: true },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COHORT_CREATED,
        actorUserId: actor.id,
        description: `Created cohort ${cohort.name}.`,
        entityId: cohort.id,
        entityType: "Cohort",
        metadataJson: { name: cohort.name, status: data.status },
      },
    });

    return {
      code: "cohort-created",
      cohortId: cohort.id,
      success: true,
    };
  });
}

export async function updateAdminCohort(
  input: AdminCohortMutationInput & { cohortId: string },
): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(input.session);
  if (!actor) {
    return { code: "unauthorized", cohortId: input.cohortId, success: false };
  }

  const { data, validDates } = cohortPayload(input);
  if (!data.name) {
    return { code: "cohort-name-required", cohortId: input.cohortId, success: false };
  }

  if (!isOrganizationStatus(data.status)) {
    return { code: "invalid-cohort-status", cohortId: input.cohortId, success: false };
  }

  if (!validDates) {
    return { code: "invalid-cohort-dates", cohortId: input.cohortId, success: false };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.cohort.findUnique({
      select: { id: true, name: true },
      where: { id: input.cohortId },
    });

    if (!existing) {
      return { code: "cohort-not-found", cohortId: input.cohortId, success: false };
    }

    if (!(await ensureUniqueCohortName(tx, data.name, input.cohortId))) {
      return { code: "cohort-name-exists", cohortId: input.cohortId, success: false };
    }

    const cohort = await tx.cohort.update({
      data,
      select: { id: true, name: true },
      where: { id: input.cohortId },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COHORT_UPDATED,
        actorUserId: actor.id,
        description: `Updated cohort ${cohort.name}.`,
        entityId: cohort.id,
        entityType: "Cohort",
        metadataJson: {
          previousName: existing.name,
          status: data.status,
        },
      },
    });

    return {
      code: "cohort-updated",
      cohortId: cohort.id,
      success: true,
    };
  });
}

export async function linkAdminCohortOrganization({
  cohortId,
  organizationId,
  session,
}: {
  cohortId: string;
  organizationId: string;
  session: AuthSession | null;
}): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", cohortId, organizationId, success: false };
  }

  return prisma.$transaction(async (tx) => {
    const [cohort, organization] = await Promise.all([
      tx.cohort.findUnique({ select: { id: true, name: true }, where: { id: cohortId } }),
      tx.organization.findUnique({
        select: { id: true, name: true },
        where: { id: organizationId },
      }),
    ]);

    if (!cohort || !organization) {
      return { code: "cohort-or-organization-not-found", cohortId, organizationId, success: false };
    }

    const existing = await tx.cohortOrganization.findUnique({
      select: { id: true },
      where: { cohortId_organizationId: { cohortId, organizationId } },
    });

    if (existing) {
      return {
        code: "cohort-organization-already-linked",
        cohortId,
        organizationId,
        success: true,
      };
    }

    await tx.cohortOrganization.create({
      data: { cohortId, organizationId },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COHORT_UPDATED,
        actorUserId: actor.id,
        description: `Linked ${organization.name} to ${cohort.name}.`,
        entityId: cohort.id,
        entityType: "Cohort",
        metadataJson: {
          linkAction: "linked",
          organizationId,
          organizationName: organization.name,
        },
      },
    });

    return {
      code: "cohort-organization-linked",
      cohortId,
      organizationId,
      success: true,
    };
  });
}

export async function unlinkAdminCohortOrganization({
  cohortId,
  organizationId,
  session,
}: {
  cohortId: string;
  organizationId: string;
  session: AuthSession | null;
}): Promise<AdminPeopleMutationResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", cohortId, organizationId, success: false };
  }

  return prisma.$transaction(async (tx) => {
    const [cohort, organization] = await Promise.all([
      tx.cohort.findUnique({ select: { id: true, name: true }, where: { id: cohortId } }),
      tx.organization.findUnique({
        select: { id: true, name: true },
        where: { id: organizationId },
      }),
    ]);

    if (!cohort || !organization) {
      return { code: "cohort-or-organization-not-found", cohortId, organizationId, success: false };
    }

    const deleted = await tx.cohortOrganization.deleteMany({
      where: { cohortId, organizationId },
    });

    if (deleted.count === 0) {
      return {
        code: "cohort-organization-not-linked",
        cohortId,
        organizationId,
        success: true,
      };
    }

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.COHORT_UPDATED,
        actorUserId: actor.id,
        description: `Unlinked ${organization.name} from ${cohort.name}.`,
        entityId: cohort.id,
        entityType: "Cohort",
        metadataJson: {
          linkAction: "unlinked",
          organizationId,
          organizationName: organization.name,
        },
      },
    });

    return {
      code: "cohort-organization-unlinked",
      cohortId,
      organizationId,
      success: true,
    };
  });
}

export async function inviteStaffMember({
  email,
  roleKey,
  session,
}: {
  email: string;
  roleKey: RoleKey;
  session: AuthSession | null;
}): Promise<StaffInvitationDeliveryResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", emailDelivered: false, success: false };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { code: "invalid-email", emailDelivered: false, success: false };
  }

  if (!Object.values(RoleKey).includes(roleKey)) {
    return { code: "invalid-role", emailDelivered: false, success: false };
  }

  const token = createInvitationToken();
  const tokenHash = hashInvitationToken(token);
  const expiresAt = createInvitationExpiry();

  try {
    await persistStaffInvitation({
      actorUserId: actor.id,
      cleanEmail,
      expiresAt,
      roleKey,
      tokenHash,
    });
  } catch (error) {
    console.error("Failed to create invitation", error);
    if (error instanceof Error && error.message === "missing-role") {
      return { code: "invalid-role", emailDelivered: false, success: false };
    }
    return { code: "database-error", emailDelivered: false, success: false };
  }

  const invitationUrl = buildStaffRegistrationUrl(token);
  const delivery = await deliverStaffInvitationEmail({
    email: cleanEmail,
    invitationUrl,
  });

  return {
    code: delivery.code,
    emailDelivered: delivery.emailDelivered,
    invitationUrl,
    success: true,
  };
}

export async function resendStaffInvitation({
  email,
  roleKey,
  session,
}: {
  email: string;
  roleKey: RoleKey;
  session: AuthSession | null;
}): Promise<StaffInvitationDeliveryResult> {
  const result = await inviteStaffMember({ email, roleKey, session });
  if (!result.success) {
    return result;
  }

  return {
    code: result.emailDelivered ? "invitation-resent" : result.code,
    emailDelivered: result.emailDelivered,
    invitationUrl: result.invitationUrl,
    success: true,
  };
}

export async function cancelStaffInvitation({
  email,
  session,
}: {
  email: string;
  session: AuthSession | null;
}): Promise<{ code: string; success: boolean }> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", success: false };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { code: "invalid-email", success: false };
  }

  const deleted = await prisma.onboardingInvitation.deleteMany({
    where: { email: cleanEmail },
  });
  if (deleted.count === 0) {
    return { code: "invitation-not-found", success: false };
  }

  await prisma.auditLog.create({
    data: {
      actionType: AuditActionType.USER_UPDATED,
      actorUserId: actor.id,
      description: `Canceled onboarding invite for ${cleanEmail}.`,
      entityId: cleanEmail,
      entityType: "OnboardingInvitation",
      metadataJson: { action: "cancelled" },
    },
  });

  return { code: "invitation-cancelled", success: true };
}
