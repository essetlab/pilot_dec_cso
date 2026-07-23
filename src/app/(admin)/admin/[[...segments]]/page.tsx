import { EmptyState, PlaceholderPage } from "@/components/shell/PlaceholderPage";
import { AdminAuditLog } from "@/components/admin/AdminAuditLog";
import { AdminCourseDetail } from "@/components/admin/AdminCourseDetail";
import {
  AdminCourseInvitationCreate,
  AdminCourseInvitationDetail,
  AdminCourseInvitationList,
} from "@/components/admin/AdminCourseInvitations";
import { AdminCertificateDetail, AdminCertificates } from "@/components/admin/AdminCertificates";
import { AdminCohortDetail, AdminCohorts } from "@/components/admin/AdminCohorts";
import { AdminCourses } from "@/components/admin/AdminCourses";
import { AdminExternalCourseManager } from "@/components/admin/AdminExternalCourseManager";
import { AdminDashboard, AdminPortalEntry } from "@/components/admin/AdminDashboard";
import { AdminMonitoring } from "@/components/admin/AdminMonitoring";
import { AdminInternalTestGuide } from "@/components/admin/AdminInternalTestGuide";
import { AdminOrganizationDetail, AdminOrganizations } from "@/components/admin/AdminOrganizations";
import { AdminPilotMonitoring } from "@/components/admin/AdminPilotMonitoring";
import { AdminReferenceData } from "@/components/admin/AdminReferenceData";
import { AdminReview } from "@/components/admin/AdminReview";
import { AdminReviewDetail } from "@/components/admin/AdminReviewDetail";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminUserCreate, AdminUserDetail, AdminUsers } from "@/components/admin/AdminUsers";
import { canAccessAdmin, canAccessPath } from "@/lib/auth/permissions";
import { getCurrentSession } from "@/lib/auth/server";
import { getAdminDashboardData } from "@/lib/admin-dashboard-workflow";
import {
  getAdminCourseInvitationDetail,
  getAdminCourseInvitationList,
  getAdminCourseInvitationOptions,
} from "@/lib/admin-course-invitation-workflow";
import {
  getAdminCertificateDetailData,
  getAdminCertificateListData,
} from "@/lib/certificate-workflow";
import {
  getAdminCourseAssignmentOptions,
  getAdminCourseDetail,
  getAdminCourseListData,
} from "@/lib/admin-course-workflow";
import { getAdminExternalCourseEditorData } from "@/lib/admin-external-course-workflow";
import {
  getAdminCohortDetail,
  getAdminCohortOperationOptions,
  getAdminCohortsData,
  getAdminOrganizationDetail,
  getAdminOrganizationOperationOptions,
  getAdminOrganizationsData,
  getAdminUserDetail,
  getAdminUserOperationOptions,
  getAdminUsersData,
} from "@/lib/admin-people-workflow";
import { getFeedbackSummaryData } from "@/lib/feedback-workflow";
import { getMonitoringData } from "@/lib/monitoring-workflow";
import { getPilotMonitoringData } from "@/lib/pilot-monitoring-workflow";
import {
  getReferenceDataPageData,
  type ReferenceDataCategoryKey,
  type ReferenceDataStatusFilter,
} from "@/lib/reference-data-workflow";
import { getAuditLogData, getReviewCourseDetail, getReviewQueueData } from "@/lib/review-workflow";
import { adminRoutes, matchRoute, routeFromSegments } from "@/lib/routes";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<{
    adminNotice?: string;
    invitationUrl?: string;
    actor?: string;
    area?: string;
    auditDateRange?: string;
    capacityArea?: string;
    cohortId?: string;
    certificate?: string;
    courseCreator?: string;
    courseId?: string;
    created?: "7d" | "30d" | "90d" | "all";
    dateRange?: "30d" | "quarter" | "year" | "all";
    organizationId?: string;
    query?: string;
    referenceCategory?: string;
    referenceSearch?: string;
    referenceStatus?: string;
    role?: string;
    reviewNotice?: string;
    status?: string;
  }>;
};

export default async function AdminPage({ params, searchParams }: PageProps) {
  const { segments = [] } = await params;
  const {
    adminNotice,
    invitationUrl,
    actor,
    area,
    auditDateRange,
    capacityArea,
    certificate,
    cohortId,
    courseCreator,
    courseId,
    created,
    dateRange,
    organizationId,
    query,
    referenceCategory,
    referenceSearch,
    referenceStatus,
    role,
    reviewNotice,
    status,
  } = await searchParams;
  const actualRoute = routeFromSegments("admin", segments);
  const definition = matchRoute(actualRoute, adminRoutes);
  const session = await getCurrentSession();

  if (!session) {
    if (actualRoute === "/admin") {
      return <AdminPortalEntry />;
    }
    redirect(`/sign-in?next=${encodeURIComponent(actualRoute)}`);
  }

  if (!canAccessPath(session, actualRoute)) {
    redirect(`/unauthorized?from=${encodeURIComponent(actualRoute)}`);
  }

  if (!definition) {
    notFound();
  }

  if (actualRoute === "/admin") {
    const dashboardData = await getAdminDashboardData(session);

    if (!dashboardData) {
      notFound();
    }

    return <AdminDashboard data={dashboardData} />;
  }

  if (actualRoute === "/admin/internal-test-guide") {
    return <AdminInternalTestGuide />;
  }

  if (actualRoute === "/admin/users") {
    const users = await getAdminUsersData(session, {
      cohortId,
      organizationId,
      query,
      role,
      status,
    });

    return <AdminUsers data={users} />;
  }

  if (actualRoute === "/admin/users/new") {
    const operationOptions = await getAdminUserOperationOptions(session);

    return (
      <AdminUserCreate
        adminNotice={adminNotice}
        invitationUrl={invitationUrl}
        operationOptions={operationOptions}
      />
    );
  }

  if (segments.length === 2 && segments[0] === "users") {
    const [detail, operationOptions] = await Promise.all([
      getAdminUserDetail(segments[1], session),
      getAdminUserOperationOptions(session),
    ]);

    if (!detail) {
      notFound();
    }

    return (
      <AdminUserDetail
        adminNotice={adminNotice}
        detail={detail}
        operationOptions={operationOptions}
      />
    );
  }

  if (actualRoute === "/admin/course-invitations") {
    const data = await getAdminCourseInvitationList(session, {
      cohortId,
      courseId,
      created,
      organizationId,
      query,
      status,
    });

    return <AdminCourseInvitationList data={data} />;
  }

  if (actualRoute === "/admin/course-invitations/new") {
    const options = await getAdminCourseInvitationOptions(session);

    return <AdminCourseInvitationCreate options={options} />;
  }

  if (segments.length === 2 && segments[0] === "course-invitations") {
    const detail = await getAdminCourseInvitationDetail(segments[1], session);

    if (!detail) {
      notFound();
    }

    return (
      <AdminCourseInvitationDetail
        adminNotice={adminNotice}
        detail={detail}
      />
    );
  }

  if (actualRoute === "/admin/organizations") {
    const organizations = await getAdminOrganizationsData(session);

    return <AdminOrganizations data={organizations} />;
  }

  if (actualRoute === "/admin/organizations/new") {
    const operationOptions = await getAdminOrganizationOperationOptions(session);

    return (
      <AdminOrganizationDetail
        adminNotice={adminNotice}
        detail={null}
        operationOptions={operationOptions}
      />
    );
  }

  if (segments.length === 2 && segments[0] === "organizations") {
    const [detail, operationOptions] = await Promise.all([
      getAdminOrganizationDetail(segments[1], session),
      getAdminOrganizationOperationOptions(session),
    ]);

    if (!detail) {
      notFound();
    }

    return (
      <AdminOrganizationDetail
        adminNotice={adminNotice}
        detail={detail}
        operationOptions={operationOptions}
      />
    );
  }

  if (actualRoute === "/admin/cohorts") {
    const cohorts = await getAdminCohortsData(session);

    return <AdminCohorts data={cohorts} />;
  }

  if (actualRoute === "/admin/cohorts/new") {
    const operationOptions = await getAdminCohortOperationOptions(session);

    return (
      <AdminCohortDetail
        adminNotice={adminNotice}
        detail={null}
        operationOptions={operationOptions}
      />
    );
  }

  if (segments.length === 2 && segments[0] === "cohorts") {
    const [detail, operationOptions] = await Promise.all([
      getAdminCohortDetail(segments[1], session),
      getAdminCohortOperationOptions(session),
    ]);

    if (!detail) {
      notFound();
    }

    return (
      <AdminCohortDetail
        adminNotice={adminNotice}
        detail={detail}
        operationOptions={operationOptions}
      />
    );
  }

  if (actualRoute === "/admin/courses") {
    const courses = await getAdminCourseListData(session, {
      capacityArea,
      certificate,
      creator: courseCreator,
      query,
      status,
    });

    return <AdminCourses data={courses} />;
  }

  if (actualRoute === "/admin/courses/external/new") {
    const data = await getAdminExternalCourseEditorData(null, session);

    if (!data) {
      notFound();
    }

    return <AdminExternalCourseManager adminNotice={adminNotice} data={data} />;
  }

  if (
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "integration"
  ) {
    const data = await getAdminExternalCourseEditorData(segments[1], session);

    if (!data) {
      notFound();
    }

    return <AdminExternalCourseManager adminNotice={adminNotice} data={data} />;
  }

  if (segments.length === 2 && segments[0] === "courses") {
    const [detail, assignmentOptions] = await Promise.all([
      getAdminCourseDetail(segments[1], session),
      getAdminCourseAssignmentOptions(session),
    ]);

    if (!detail) {
      notFound();
    }

    return (
      <AdminCourseDetail
        adminNotice={adminNotice}
        assignmentOptions={assignmentOptions}
        detail={detail}
      />
    );
  }

  if (actualRoute === "/admin/review") {
    const reviewQueue = await getReviewQueueData(session);

    return (
      <AdminReview
        canPublish={canAccessAdmin(session)}
        data={reviewQueue}
        reviewNotice={reviewNotice}
      />
    );
  }

  if (segments.length === 2 && segments[0] === "review") {
    const detail = await getReviewCourseDetail(segments[1], session);

    if (!detail) {
      notFound();
    }

    return (
      <AdminReviewDetail
        canPublish={canAccessAdmin(session)}
        detail={detail}
        reviewNotice={reviewNotice}
      />
    );
  }

  if (actualRoute === "/admin/certificates") {
    const certificateData = await getAdminCertificateListData(session);

    return <AdminCertificates data={certificateData} />;
  }

  if (
    segments.length === 2 &&
    segments[0] === "certificates" &&
    segments[1] !== "settings"
  ) {
    const certificate = await getAdminCertificateDetailData(segments[1], session);

    if (!certificate) {
      notFound();
    }

    return <AdminCertificateDetail certificate={certificate} />;
  }

  if (actualRoute === "/admin/reference-data") {
    const referenceData = await getReferenceDataPageData(session, {
      category: referenceCategory as ReferenceDataCategoryKey | "all" | undefined,
      query: referenceSearch,
      status: referenceStatus as ReferenceDataStatusFilter | undefined,
    });

    if (!referenceData) {
      notFound();
    }

    return <AdminReferenceData adminNotice={adminNotice} data={referenceData} />;
  }

  if (actualRoute === "/admin/monitoring") {
    const [feedbackSummary, monitoringData] = await Promise.all([
      getFeedbackSummaryData(session, { cohortId, courseId, dateRange, organizationId }),
      getMonitoringData(session, { cohortId, courseId, dateRange, organizationId }),
    ]);

    return (
      <AdminMonitoring
        feedbackSummary={feedbackSummary}
        monitoringData={monitoringData}
        showAdminActions={canAccessAdmin(session)}
      />
    );
  }

  if (actualRoute === "/admin/pilot-monitoring") {
    const pilotMonitoringData = await getPilotMonitoringData(session);

    return <AdminPilotMonitoring data={pilotMonitoringData} />;
  }

  if (actualRoute === "/admin/settings") {
    return <AdminSettings />;
  }

  if (actualRoute === "/admin/audit-log") {
    const auditLog = await getAuditLogData(session, {
      actor,
      area,
      dateRange: auditDateRange,
      query,
    });

    return <AdminAuditLog data={auditLog} />;
  }

  return (
    <PlaceholderPage
      purpose={definition.purpose}
      route={actualRoute}
      section="Admin"
      title={definition.title}
    >
      {definition.emptyTitle ? (
        <EmptyState
          description={definition.emptyDescription ?? ""}
          title={definition.emptyTitle}
        />
      ) : null}
    </PlaceholderPage>
  );
}
