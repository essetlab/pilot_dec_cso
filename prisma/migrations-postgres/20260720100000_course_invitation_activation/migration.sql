-- AddColumn
ALTER TABLE "CourseAssignment" ADD COLUMN "courseVersionId" TEXT;
ALTER TABLE "CourseInvitation" ADD COLUMN "courseAssignmentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CourseAssignment_courseId_targetUserId_key"
ON "CourseAssignment"("courseId", "targetUserId");
CREATE INDEX "CourseAssignment_courseVersionId_idx"
ON "CourseAssignment"("courseVersionId");
CREATE INDEX "CourseInvitation_courseAssignmentId_idx"
ON "CourseInvitation"("courseAssignmentId");

-- AddForeignKey
ALTER TABLE "CourseAssignment"
ADD CONSTRAINT "CourseAssignment_courseVersionId_fkey"
FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CourseInvitation"
ADD CONSTRAINT "CourseInvitation_courseAssignmentId_fkey"
FOREIGN KEY ("courseAssignmentId") REFERENCES "CourseAssignment"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
