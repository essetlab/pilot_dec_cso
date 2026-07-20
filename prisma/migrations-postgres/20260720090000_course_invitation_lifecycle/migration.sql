-- ExtendEnum
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'COURSE_INVITATION_CREATED';
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'COURSE_INVITATION_SENT';
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'COURSE_INVITATION_RESENT';
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'COURSE_INVITATION_CANCELLED';
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'COURSE_INVITATION_ACTIVATED';
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'COURSE_INVITATION_EXPIRED';
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'COURSE_INVITATION_FAILED';

-- CreateEnum
CREATE TYPE "CourseInvitationStatus" AS ENUM (
    'DRAFT',
    'PENDING',
    'SENT',
    'ACTIVATED',
    'EXPIRED',
    'CANCELLED',
    'FAILED'
);

-- CreateTable
CREATE TABLE "CourseInvitation" (
    "id" TEXT NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "invitedName" TEXT NOT NULL,
    "invitedRoleOrPosition" TEXT,
    "organizationId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "courseVersionId" TEXT,
    "cohortId" TEXT,
    "tokenHash" TEXT NOT NULL,
    "activationCodeHash" TEXT,
    "status" "CourseInvitationStatus" NOT NULL DEFAULT 'DRAFT',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "activatedUserId" TEXT,
    "sentAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseInvitation_tokenHash_key" ON "CourseInvitation"("tokenHash");
CREATE UNIQUE INDEX "CourseInvitation_activationCodeHash_key" ON "CourseInvitation"("activationCodeHash");
CREATE INDEX "CourseInvitation_invitedEmail_idx" ON "CourseInvitation"("invitedEmail");
CREATE INDEX "CourseInvitation_organizationId_idx" ON "CourseInvitation"("organizationId");
CREATE INDEX "CourseInvitation_courseId_idx" ON "CourseInvitation"("courseId");
CREATE INDEX "CourseInvitation_courseVersionId_idx" ON "CourseInvitation"("courseVersionId");
CREATE INDEX "CourseInvitation_cohortId_idx" ON "CourseInvitation"("cohortId");
CREATE INDEX "CourseInvitation_invitedByUserId_idx" ON "CourseInvitation"("invitedByUserId");
CREATE INDEX "CourseInvitation_activatedUserId_idx" ON "CourseInvitation"("activatedUserId");
CREATE INDEX "CourseInvitation_status_idx" ON "CourseInvitation"("status");
CREATE INDEX "CourseInvitation_expiresAt_idx" ON "CourseInvitation"("expiresAt");
CREATE INDEX "CourseInvitation_invitedEmail_courseId_status_idx" ON "CourseInvitation"("invitedEmail", "courseId", "status");

-- AddForeignKey
ALTER TABLE "CourseInvitation" ADD CONSTRAINT "CourseInvitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CourseInvitation" ADD CONSTRAINT "CourseInvitation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CourseInvitation" ADD CONSTRAINT "CourseInvitation_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CourseInvitation" ADD CONSTRAINT "CourseInvitation_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CourseInvitation" ADD CONSTRAINT "CourseInvitation_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CourseInvitation" ADD CONSTRAINT "CourseInvitation_activatedUserId_fkey" FOREIGN KEY ("activatedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
