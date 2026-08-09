import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  COURSE_INVITATION_VALIDITY_DAYS,
  COURSE_INVITATION_VALIDITY_MS,
  createCourseInvitationExpiry,
  resolveHubAccessPolicy,
} from "../src/lib/hub-access-policy";

const read = (path: string) => readFile(path, "utf8");

const [
  policy,
  registrationWorkflow,
  registrationAction,
  registerPage,
  signInPage,
  publicShell,
  publicRoutes,
  invitationWorkflow,
  invitationSession,
  invitationStart,
  invitationAcceptPage,
  invitationAcceptance,
  invitationReconcile,
  adminWorkflow,
  adminActions,
  adminInvitationUi,
  adminInvitationActions,
  adminDashboard,
  entitlement,
  adminCourseActions,
  adminCourseWorkflow,
  email,
  externalWorkflow,
  courseData,
  learnerActions,
  certificateWorkflow,
  feedbackWorkflow,
] = await Promise.all([
  read("src/lib/hub-access-policy.ts"),
  read("src/lib/open-registration-workflow.ts"),
  read("src/app/(auth)/register/actions.ts"),
  read("src/app/(auth)/register/page.tsx"),
  read("src/app/(auth)/sign-in/page.tsx"),
  read("src/components/shell/PublicShell.tsx"),
  read("src/lib/routes.ts"),
  read("src/lib/course-invitation-workflow.ts"),
  read("src/lib/course-invitation-session.ts"),
  read("src/app/(public)/course-invitations/start/route.ts"),
  read("src/app/(public)/course-invitations/accept/page.tsx"),
  read("src/components/public/CourseInvitationAcceptance.tsx"),
  read("src/app/(public)/course-invitations/reconcile/route.ts"),
  read("src/lib/admin-course-invitation-workflow.ts"),
  read("src/lib/admin-course-invitation-actions.ts"),
  read("src/components/admin/AdminCourseInvitations.tsx"),
  read("src/components/admin/CourseInvitationActions.tsx"),
  read("src/components/admin/AdminDashboard.tsx"),
  read("src/lib/course-entitlement.ts"),
  read("src/lib/admin-course-actions.ts"),
  read("src/lib/admin-course-workflow.ts"),
  read("src/lib/email.ts"),
  read("src/lib/external-course-workflow.ts"),
  read("src/lib/course-data.ts"),
  read("src/lib/learner-actions.ts"),
  read("src/lib/certificate-workflow.ts"),
  read("src/lib/feedback-workflow.ts"),
]);
const acceptanceWorkflow = invitationWorkflow.slice(
  invitationWorkflow.indexOf("export async function resolveCourseInvitationAcceptance"),
  invitationWorkflow.indexOf("export async function reconcileInvitedSupabaseLearnerProfile"),
);

const checks: Record<string, boolean> = {
  controlledModeIsDefault:
    policy.includes('DEFAULT_HUB_ACCESS_POLICY: HubAccessPolicy = "controlled"') &&
    resolveHubAccessPolicy({}) === "controlled" &&
    resolveHubAccessPolicy({ HUB_ACCESS_POLICY: "unexpected" }) === "controlled" &&
    resolveHubAccessPolicy({ HUB_ACCESS_POLICY: "open" }) === "open",
  publicSelfRegistrationRejected:
    registrationWorkflow.includes("if (controlledAccess)") &&
    registrationWorkflow.includes('code: "invitation-required"'),
  registrationActionCannotBypassPolicy:
    registrationAction.includes("getCourseInvitationToken()") &&
    registrationAction.includes("resolveCourseInvitationToken(invitationToken)") &&
    registrationAction.includes('redirect("/register?error=invitation-required")'),
  registerLinksHidden:
    publicShell.includes("!controlledAccess") &&
    !publicRoutes.includes('{ href: "/register", label: "Register"'),
  signInRemainsAvailable:
    publicShell.includes('href="/sign-in"') &&
    registerPage.includes('<ActionButton href="/sign-in">Sign in</ActionButton>'),
  forgotPasswordRemainsAvailable: signInPage.includes('href="/forgot-password"'),
  invitationValidityIsFiveDays:
    COURSE_INVITATION_VALIDITY_DAYS === 5 &&
    COURSE_INVITATION_VALIDITY_MS === 5 * 24 * 60 * 60 * 1000 &&
    createCourseInvitationExpiry(new Date(0)).getTime() === COURSE_INVITATION_VALIDITY_MS &&
    adminActions.includes("createCourseInvitationExpiry()") &&
    !adminInvitationActions.includes('name="expiryDays"'),
  openingDoesNotConsumeInvitation:
    invitationStart.includes("resolveCourseInvitationAcceptance") &&
    !invitationStart.includes("activateCourseInvitation") &&
    invitationStart.includes("response.cookies.set"),
  repeatedOpeningRemainsAvailable:
    invitationStart.includes('new URL("/course-invitations/accept", request.url)') &&
    !invitationStart.includes("CourseInvitationStatus.ACTIVATED"),
  interruptedActivationRecoverable:
    invitationSession.includes("httpOnly: true") &&
    invitationSession.includes("COURSE_INVITATION_VALIDITY_DAYS") &&
    invitationWorkflow.includes("CourseInvitationStatus.PENDING,") &&
    adminWorkflow.includes("CourseInvitationStatus.PENDING"),
  invitationScopeIsImmutable:
    registrationWorkflow.includes("email = invitation.context.invitedEmail") &&
    registrationWorkflow.includes("fullName = invitation.context.invitedName") &&
    registrationAction.includes('formData.set("fullName", invitation.context.invitedName)') &&
    registerPage.includes("readOnly={Boolean(invitation)}"),
  registrationDoesNotAutoAssignHrba:
    registrationWorkflow.includes("assignDefaultHrba: !controlledAccess") &&
    registrationWorkflow.includes("if (input.assignDefaultHrba)"),
  activationAssignsExactInvitedCourse:
    invitationWorkflow.includes("courseId: invitation.courseId") &&
    invitationWorkflow.includes("courseVersionId: invitation.courseVersionId") &&
    invitationWorkflow.includes('assignmentType: "USER"'),
  redemptionFollowsSuccessfulAssignment:
    invitationWorkflow.indexOf("const assignment = existingAssignment") <
      invitationWorkflow.indexOf("await transitionCourseInvitationToActivated"),
  activationIsIdempotentAndConcurrentSafe:
    invitationWorkflow.includes("activationQueues") &&
    invitationWorkflow.includes("pg_advisory_xact_lock") &&
    invitationWorkflow.includes('code: "already-activated"') &&
    invitationWorkflow.includes('isolationLevel: "Serializable"'),
  naturalExpiryIsPresentedClearly:
    adminWorkflow.includes("input.expiresAt.getTime() <= Date.now()") &&
    adminWorkflow.includes('return "INVITATION_EXPIRED"') &&
    adminInvitationUi.includes("Invitation Expired"),
  expiredInvitationCanBeResent:
    invitationWorkflow.includes("[CourseInvitationStatus.EXPIRED]: [CourseInvitationStatus.PENDING]") &&
    adminWorkflow.includes("CourseInvitationStatus.EXPIRED"),
  failedAndPendingCanBeRetried:
    invitationWorkflow.includes("[CourseInvitationStatus.FAILED]") &&
    invitationWorkflow.includes("[CourseInvitationStatus.PENDING]") &&
    adminWorkflow.includes("CourseInvitationStatus.FAILED"),
  resendInvalidatesPreviousToken:
    invitationWorkflow.includes("tokenHash,") &&
    invitationWorkflow.includes("status: CourseInvitationStatus.PENDING") &&
    adminInvitationActions.includes("invalidates the previous unused link"),
  signedOutActivatedLearnerGetsSignIn:
    invitationAcceptance.includes("Your account is already active") &&
    invitationAcceptance.includes("Sign in to continue") &&
    acceptanceWorkflow.indexOf("invitation.status === CourseInvitationStatus.ACTIVATED") <
      acceptanceWorkflow.indexOf("invitation.status === CourseInvitationStatus.EXPIRED"),
  existingLearnerCanReceiveAnotherCourse:
    invitationWorkflow.includes("if (!existingUser)") &&
    invitationWorkflow.includes("targetedCourseAssignments") &&
    invitationWorkflow.includes("courseId: input.courseId"),
  removingAssignmentPreservesEvidence:
    adminCourseActions.includes("deactivateAdminCourseAssignment") &&
    adminCourseWorkflow.includes("data: { isActive: false }") &&
    !adminCourseWorkflow.includes("lessonProgress.delete") &&
    !adminCourseWorkflow.includes("quizAttempt.delete") &&
    !adminCourseWorkflow.includes("certificate.delete") &&
    adminInvitationUi.includes("Remove course access"),
  unassignedAccountCannotLaunchHrba:
    externalWorkflow.includes("hasLearnerCourseEntitlement") &&
    externalWorkflow.includes("if (!(await hasLearnerCourseEntitlement"),
  publicVisibilityDoesNotBypassControlledAssignment:
    entitlement.indexOf("if (isControlledHubAccess()") <
      entitlement.indexOf("if (input.visibility === CourseVisibility.PUBLIC)"),
  assignedLearnerCanLaunchHrba:
    entitlement.includes("return hasActiveIndividualCourseAssignment") &&
    entitlement.includes("isActive: true"),
  learningBoundariesRemainProtected: [
    externalWorkflow,
    courseData,
    learnerActions,
    certificateWorkflow,
    feedbackWorkflow,
  ].every((source) => source.includes("hasLearnerCourseEntitlement")),
  plaintextTokensAreNotPersistedOrLogged:
    invitationWorkflow.includes("tokenHash: hashCourseInvitationToken") &&
    invitationWorkflow.includes("metadataJson: auditMetadata") &&
    !new RegExp("console\\.(?:log|info|warn|error)\\([^)]*(?:plaintextToken|invitationUrl|deliveryUrl)", "s").test(
      [invitationWorkflow, adminWorkflow, email, invitationStart, invitationReconcile].join("\n"),
    ) &&
    invitationAcceptPage.includes("legacyToken") &&
    invitationStart.includes("COURSE_INVITATION_COOKIE_NAME") &&
    invitationStart.includes('new URL("/course-invitations/accept", request.url)'),
  automaticEmailDeliveryHasNoManualTokenUi:
    adminWorkflow.includes("sendCourseInvitationEmail") &&
    adminWorkflow.includes("markCourseInvitationFailed") &&
    adminInvitationActions.includes("Send invitation") &&
    !adminInvitationActions.includes("Copy secure link") &&
    !adminInvitationActions.includes("Confirm link was delivered") &&
    adminDashboard.includes("emails the secure five-day activation link directly"),
  confirmationReconciliationIsAutomatic:
    registrationWorkflow.includes('callbackUrl.searchParams.set("next", confirmationNext)') &&
    registrationAction.includes('redirect("/course-invitations/reconcile")') &&
    invitationReconcile.includes("reconcileInvitedSupabaseLearnerProfile") &&
    invitationReconcile.includes("activateCourseInvitation") &&
    invitationReconcile.includes("response.cookies.delete"),
  externalInvitationRoutesToIntegratedPlayer:
    invitationWorkflow.includes("isExternalHrbaCourseMetadata") &&
    invitationWorkflow.includes("isExternalCourse:") &&
    invitationReconcile.includes("result.access.isExternalCourse") &&
    invitationReconcile.includes("`${coursePath}/external`"),
};

for (const [name, passed] of Object.entries(checks)) {
  assert.equal(passed, true, `Controlled-course-access verification failed: ${name}`);
}

console.log(JSON.stringify(checks, null, 2));
