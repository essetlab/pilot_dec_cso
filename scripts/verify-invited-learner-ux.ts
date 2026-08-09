import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  COURSE_INVITATION_VALIDITY_DAYS,
  COURSE_INVITATION_VALIDITY_MS,
} from "../src/lib/hub-access-policy";

const read = (path: string) => readFile(path, "utf8");

const [
  workflow,
  acceptancePage,
  acceptance,
  registerPage,
  signInPage,
  authLayout,
  supportPage,
] = await Promise.all([
  read("src/lib/course-invitation-workflow.ts"),
  read("src/app/(public)/course-invitations/accept/page.tsx"),
  read("src/components/public/CourseInvitationAcceptance.tsx"),
  read("src/app/(auth)/register/page.tsx"),
  read("src/app/(auth)/sign-in/page.tsx"),
  read("src/app/(auth)/layout.tsx"),
  read("src/app/(public)/support/page.tsx"),
]);

const learnerFacingSource = [
  acceptancePage,
  acceptance,
  registerPage,
  signInPage,
  authLayout,
  supportPage,
].join("\n");
const acceptanceWorkflow = workflow.slice(
  workflow.indexOf("export async function resolveCourseInvitationAcceptance"),
  workflow.indexOf("export async function reconcileInvitedSupabaseLearnerProfile"),
);

const checks: Record<string, boolean> = {
  invitedNewLearner:
    workflow.includes('accountState: "existing" | "new"') &&
    workflow.includes("invitedUser?.status === UserStatus.ACTIVE && invitedUser.authProviderId") &&
    acceptancePage.includes('resolution.accountState === "new"') &&
    acceptancePage.includes("Create your password to activate your Learning Hub account and access the course assigned to you.") &&
    acceptance.includes('href={`/register?next=${encodeURIComponent(returnPath)}`}') &&
    acceptance.includes("Activate your account") &&
    acceptance.includes("Already have an account?") &&
    !acceptance.includes("Sign in to accept"),
  invitedExistingLearner:
    acceptancePage.includes('resolution.accountState === "existing"') &&
    acceptance.includes('if (accountState === "existing")') &&
    acceptance.includes("Your Learning Hub account is already active.") &&
    acceptance.includes("Sign in to continue") &&
    registerPage.includes('/sign-in?next=${encodeURIComponent("/course-invitations/reconcile")}'),
  expiredInvitation:
    workflow.includes('return { state: "expired", success: false }') &&
    acceptance.includes('state === "cancelled" || state === "expired" || state === "unavailable"') &&
    acceptance.includes("Invitation expired"),
  activatedInvitationReopened:
    acceptanceWorkflow.indexOf("invitation.status === CourseInvitationStatus.ACTIVATED") <
      acceptanceWorkflow.indexOf("invitation.status === CourseInvitationStatus.EXPIRED") &&
    acceptance.includes('state === "already-activated"') &&
    acceptance.includes("Your account is already active"),
  uninvitedVisitor:
    registerPage.includes("Registration is by invitation") &&
    registerPage.includes('errorMessage["invitation-required"]'),
  normalSignIn:
    signInPage.includes("Sign in with the email and password you created when activating your Learning Hub account.") &&
    signInPage.includes('href="/forgot-password"'),
  administratorSignIn:
    signInPage.includes("Sign in as administrator") &&
    signInPage.includes("Staff credentials will return you directly to invitation management."),
  obsoleteControlledAccessCopyRemoved:
    !learnerFacingSource.includes("created during learner registration") &&
    !learnerFacingSource.includes("Open registration guidance") &&
    !learnerFacingSource.includes("Registration does not require an invitation or access code") &&
    !learnerFacingSource.includes("Registration includes access to available courses"),
  validityUnchanged:
    COURSE_INVITATION_VALIDITY_DAYS === 5 &&
    COURSE_INVITATION_VALIDITY_MS === 5 * 24 * 60 * 60 * 1000,
};

for (const [name, passed] of Object.entries(checks)) {
  assert.equal(passed, true, `Invited-learner UX verification failed: ${name}`);
}

console.log(JSON.stringify(checks, null, 2));
