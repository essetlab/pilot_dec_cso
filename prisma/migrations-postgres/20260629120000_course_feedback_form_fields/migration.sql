-- Add focused learner course-feedback fields for the Slice 5 pilot form.
ALTER TABLE "Feedback"
ADD COLUMN "enrollmentId" TEXT,
ADD COLUMN "easeOfUseRating" INTEGER,
ADD COLUMN "certificateProcessRating" INTEGER,
ADD COLUMN "mostUseful" TEXT,
ADD COLUMN "improvementSuggestion" TEXT,
ADD COLUMN "technicalIssue" TEXT,
ADD COLUMN "consentToUseAnonymizedFeedback" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "Feedback_enrollmentId_idx" ON "Feedback"("enrollmentId");

ALTER TABLE "Feedback"
ADD CONSTRAINT "Feedback_enrollmentId_fkey"
FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
