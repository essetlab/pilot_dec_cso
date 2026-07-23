-- Stable opaque learner state is stored on the enrollment so repeated launches
-- for the same active learner-course context share one isolated browser namespace.
ALTER TABLE "Enrollment"
ADD COLUMN "externalLearnerStateKey" TEXT,
ADD COLUMN "externalStateKeyIssuedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Enrollment_externalLearnerStateKey_key"
ON "Enrollment"("externalLearnerStateKey");

-- New launch tokens bind to the hash of the stable learner state key. The column
-- is nullable only so pre-migration short-lived tokens can remain until expiry;
-- callbacks using a legacy unbound token fail closed in application validation.
ALTER TABLE "ExternalCourseLaunchToken"
ADD COLUMN "learnerStateKeyHash" TEXT;

-- An external assessment evidence id is globally unique. The nullable state-key
-- hash binds new external attempts to an enrollment state without exposing the
-- raw key. Historical attempts remain valid records but are not reusable as
-- evidence for newly bound launches. No backfill is required.
ALTER TABLE "QuizAttempt"
ADD COLUMN "externalEvidenceId" TEXT,
ADD COLUMN "externalLearnerStateKeyHash" TEXT;

CREATE UNIQUE INDEX "QuizAttempt_externalEvidenceId_key"
ON "QuizAttempt"("externalEvidenceId");

CREATE INDEX "QuizAttempt_externalLearnerStateKeyHash_idx"
ON "QuizAttempt"("externalLearnerStateKeyHash");
