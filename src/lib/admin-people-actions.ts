"use server";

import {
  OrganizationFormalityStatus,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "@/generated/prisma/enums";
import {
  assignAdminUserRole,
  createAdminCohort,
  createAdminOrganization,
  createAdminUser,
  linkAdminUserContext,
  linkAdminCohortOrganization,
  cancelStaffInvitation,
  removeAdminUserRole,
  resendStaffInvitation,
  unlinkAdminCohortOrganization,
  updateAdminCohort,
  updateAdminOrganization,
  updateAdminUserStatus,
  inviteStaffMember,
  type AdminPeopleMutationResult,
} from "@/lib/admin-people-workflow";
import { getCurrentSession } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function nullableFormString(formData: FormData, key: string) {
  const value = formString(formData, key);

  return value.length > 0 ? value : null;
}

function redirectToUser(userId: string, notice: string): never {
  redirect(`/admin/users/${userId}?adminNotice=${notice}`);
}

function redirectToOrganization(organizationId: string, notice: string): never {
  redirect(`/admin/organizations/${organizationId}?adminNotice=${notice}`);
}

function redirectToCohort(cohortId: string, notice: string): never {
  redirect(`/admin/cohorts/${cohortId}?adminNotice=${notice}`);
}

function redirectToStaffOnboarding({
  code,
  invitationUrl,
}: {
  code: string;
  invitationUrl?: string;
}): never {
  const params = new URLSearchParams({ adminNotice: code });

  if (invitationUrl) {
    params.set("invitationUrl", invitationUrl);
  }

  redirect(`/admin/users/new?${params.toString()}`);
}

function revalidateUserMutationPaths(result: AdminPeopleMutationResult) {
  revalidatePath("/admin/users");
  revalidatePath("/admin/organizations");
  revalidatePath("/admin/cohorts");
  revalidatePath("/admin/audit-log");

  if (result.userId) {
    revalidatePath(`/admin/users/${result.userId}`);
  }

  if (result.organizationId) {
    revalidatePath(`/admin/organizations/${result.organizationId}`);
  }

  if (result.cohortId) {
    revalidatePath(`/admin/cohorts/${result.cohortId}`);
  }
}

function revalidateOrganizationMutationPaths(result: AdminPeopleMutationResult) {
  revalidatePath("/admin/users");
  revalidatePath("/admin/organizations");
  revalidatePath("/admin/cohorts");
  revalidatePath("/admin/audit-log");

  if (result.organizationId) {
    revalidatePath(`/admin/organizations/${result.organizationId}`);
  }

  if (result.cohortId) {
    revalidatePath(`/admin/cohorts/${result.cohortId}`);
  }
}

export async function updateAdminUserStatusAction(formData: FormData) {
  const userId = formString(formData, "userId");
  const status = formString(formData, "status");
  const session = await getCurrentSession();

  if (!userId) {
    redirect("/admin/users?adminNotice=missing-user");
  }

  const result = await updateAdminUserStatus({
    session,
    status: status as UserStatus,
    userId,
  });

  if (result.success) {
    revalidateUserMutationPaths(result);
  }

  redirectToUser(userId, result.code);
}

export async function createAdminUserAction(formData: FormData) {
  const session = await getCurrentSession();
  const result = await createAdminUser({
    cohortId: nullableFormString(formData, "cohortId"),
    email: formString(formData, "email"),
    fullName: formString(formData, "fullName"),
    organizationId: nullableFormString(formData, "organizationId"),
    phone: nullableFormString(formData, "phone"),
    region: nullableFormString(formData, "region"),
    roleKey: formString(formData, "roleKey") as RoleKey,
    session,
    status: formString(formData, "status") as UserStatus,
  });

  if (result.success) {
    revalidateUserMutationPaths(result);

    if (
      result.code === "user-created-invitation-sent" ||
      result.code === "invitation-created-manual-link" ||
      result.code === "invitation-created-email-failed"
    ) {
      redirectToStaffOnboarding({
        code: result.code,
        invitationUrl: result.invitationUrl,
      });
    }

    redirectToUser(result.userId ?? "", result.code);
  }

  redirect(`/admin/users/new?adminNotice=${result.code}`);
}

export async function assignAdminUserRoleAction(formData: FormData) {
  const userId = formString(formData, "userId");
  const roleKey = formString(formData, "roleKey");
  const session = await getCurrentSession();

  if (!userId) {
    redirect("/admin/users?adminNotice=missing-user");
  }

  const result = await assignAdminUserRole({
    roleKey: roleKey as RoleKey,
    session,
    userId,
  });

  if (result.success) {
    revalidateUserMutationPaths(result);
  }

  redirectToUser(userId, result.code);
}

export async function removeAdminUserRoleAction(formData: FormData) {
  const userId = formString(formData, "userId");
  const roleKey = formString(formData, "roleKey");
  const session = await getCurrentSession();

  if (!userId) {
    redirect("/admin/users?adminNotice=missing-user");
  }

  const result = await removeAdminUserRole({
    roleKey: roleKey as RoleKey,
    session,
    userId,
  });

  if (result.success) {
    revalidateUserMutationPaths(result);
  }

  redirectToUser(userId, result.code);
}

export async function linkAdminUserContextAction(formData: FormData) {
  const userId = formString(formData, "userId");
  const session = await getCurrentSession();

  if (!userId) {
    redirect("/admin/users?adminNotice=missing-user");
  }

  const result = await linkAdminUserContext({
    cohortId: nullableFormString(formData, "cohortId"),
    organizationId: nullableFormString(formData, "organizationId"),
    session,
    userId,
  });

  if (result.success) {
    revalidateUserMutationPaths(result);
  }

  redirectToUser(userId, result.code);
}

export async function createAdminOrganizationAction(formData: FormData) {
  const session = await getCurrentSession();
  const result = await createAdminOrganization({
    focalPersonEmail: nullableFormString(formData, "focalPersonEmail"),
    focalPersonName: nullableFormString(formData, "focalPersonName"),
    focalPersonPhone: nullableFormString(formData, "focalPersonPhone"),
    formalityStatus: formString(formData, "formalityStatus") as OrganizationFormalityStatus,
    name: formString(formData, "name"),
    notes: nullableFormString(formData, "notes"),
    organizationTypeId: nullableFormString(formData, "organizationTypeId"),
    region: nullableFormString(formData, "region"),
    registrationNumber: nullableFormString(formData, "registrationNumber"),
    session,
    shortName: nullableFormString(formData, "shortName"),
    status: formString(formData, "status") as OrganizationStatus,
    woreda: nullableFormString(formData, "woreda"),
    zone: nullableFormString(formData, "zone"),
  });

  if (result.success) {
    revalidateOrganizationMutationPaths(result);
    redirectToOrganization(result.organizationId ?? "", result.code);
  }

  redirect(`/admin/organizations/new?adminNotice=${result.code}`);
}

export async function updateAdminOrganizationAction(formData: FormData) {
  const organizationId = formString(formData, "organizationId");
  const session = await getCurrentSession();

  if (!organizationId) {
    redirect("/admin/organizations?adminNotice=missing-organization");
  }

  const result = await updateAdminOrganization({
    focalPersonEmail: nullableFormString(formData, "focalPersonEmail"),
    focalPersonName: nullableFormString(formData, "focalPersonName"),
    focalPersonPhone: nullableFormString(formData, "focalPersonPhone"),
    formalityStatus: formString(formData, "formalityStatus") as OrganizationFormalityStatus,
    name: formString(formData, "name"),
    notes: nullableFormString(formData, "notes"),
    organizationId,
    organizationTypeId: nullableFormString(formData, "organizationTypeId"),
    region: nullableFormString(formData, "region"),
    registrationNumber: nullableFormString(formData, "registrationNumber"),
    session,
    shortName: nullableFormString(formData, "shortName"),
    status: formString(formData, "status") as OrganizationStatus,
    woreda: nullableFormString(formData, "woreda"),
    zone: nullableFormString(formData, "zone"),
  });

  if (result.success) {
    revalidateOrganizationMutationPaths(result);
  }

  redirectToOrganization(organizationId, result.code);
}

export async function createAdminCohortAction(formData: FormData) {
  const session = await getCurrentSession();
  const result = await createAdminCohort({
    description: nullableFormString(formData, "description"),
    endDate: nullableFormString(formData, "endDate"),
    name: formString(formData, "name"),
    programmeName: nullableFormString(formData, "programmeName"),
    region: nullableFormString(formData, "region"),
    session,
    startDate: nullableFormString(formData, "startDate"),
    status: formString(formData, "status") as OrganizationStatus,
  });

  if (result.success) {
    revalidateOrganizationMutationPaths(result);
    redirectToCohort(result.cohortId ?? "", result.code);
  }

  redirect(`/admin/cohorts/new?adminNotice=${result.code}`);
}

export async function updateAdminCohortAction(formData: FormData) {
  const cohortId = formString(formData, "cohortId");
  const session = await getCurrentSession();

  if (!cohortId) {
    redirect("/admin/cohorts?adminNotice=missing-cohort");
  }

  const result = await updateAdminCohort({
    cohortId,
    description: nullableFormString(formData, "description"),
    endDate: nullableFormString(formData, "endDate"),
    name: formString(formData, "name"),
    programmeName: nullableFormString(formData, "programmeName"),
    region: nullableFormString(formData, "region"),
    session,
    startDate: nullableFormString(formData, "startDate"),
    status: formString(formData, "status") as OrganizationStatus,
  });

  if (result.success) {
    revalidateOrganizationMutationPaths(result);
  }

  redirectToCohort(cohortId, result.code);
}

export async function linkAdminCohortOrganizationAction(formData: FormData) {
  const cohortId = formString(formData, "cohortId");
  const organizationId = formString(formData, "organizationId");
  const session = await getCurrentSession();

  if (!cohortId) {
    redirect("/admin/cohorts?adminNotice=missing-cohort");
  }

  const result = await linkAdminCohortOrganization({
    cohortId,
    organizationId,
    session,
  });

  if (result.success) {
    revalidateOrganizationMutationPaths(result);
  }

  redirectToCohort(cohortId, result.code);
}

export async function unlinkAdminCohortOrganizationAction(formData: FormData) {
  const cohortId = formString(formData, "cohortId");
  const organizationId = formString(formData, "organizationId");
  const session = await getCurrentSession();

  if (!cohortId) {
    redirect("/admin/cohorts?adminNotice=missing-cohort");
  }

  const result = await unlinkAdminCohortOrganization({
    cohortId,
    organizationId,
    session,
  });

  if (result.success) {
    revalidateOrganizationMutationPaths(result);
  }

  redirectToCohort(cohortId, result.code);
}

export async function inviteStaffMemberAction(formData: FormData) {
  const email = formString(formData, "email");
  const roleKey = formString(formData, "roleKey");
  const session = await getCurrentSession();

  const result = await inviteStaffMember({
    email,
    roleKey: roleKey as RoleKey,
    session,
  });

  if (result.success) {
    revalidatePath("/admin/users");
    revalidatePath("/admin/audit-log");
    redirectToStaffOnboarding({
      code: result.code,
      invitationUrl: result.invitationUrl,
    });
  }

  redirectToStaffOnboarding({ code: result.code });
}

export async function resendStaffInvitationAction(formData: FormData) {
  const email = formString(formData, "email");
  const roleKey = formString(formData, "roleKey");
  const session = await getCurrentSession();

  const result = await resendStaffInvitation({
    email,
    roleKey: roleKey as RoleKey,
    session,
  });

  if (result.success) {
    revalidatePath("/admin/users");
    revalidatePath("/admin/audit-log");
    redirectToStaffOnboarding({
      code: result.code,
      invitationUrl: result.invitationUrl,
    });
  }

  redirectToStaffOnboarding({ code: result.code });
}

export async function cancelStaffInvitationAction(formData: FormData) {
  const email = formString(formData, "email");
  const session = await getCurrentSession();

  const result = await cancelStaffInvitation({ email, session });

  if (result.success) {
    revalidatePath("/admin/users");
    revalidatePath("/admin/audit-log");
  }

  redirectToStaffOnboarding({ code: result.code });
}
