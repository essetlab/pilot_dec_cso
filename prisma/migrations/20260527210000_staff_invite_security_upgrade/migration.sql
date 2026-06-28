-- Redefine user profile columns for staff onboarding.
ALTER TABLE "User" ADD COLUMN "jobTitle" TEXT;
ALTER TABLE "User" ADD COLUMN "department" TEXT;

-- Redefine invitation table with hashed tokens and usage metadata.
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OnboardingInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "usedAt" DATETIME,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "OnboardingInvitation_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OnboardingInvitation" (
    "id",
    "email",
    "role",
    "tokenHash",
    "expiresAt",
    "invitedByUserId",
    "usedAt",
    "attemptCount",
    "createdAt",
    "completedAt"
)
SELECT
    "id",
    "email",
    "role",
    "token",
    "expiresAt",
    (
      SELECT "id"
      FROM "User"
      ORDER BY "createdAt" ASC
      LIMIT 1
    ) AS "invitedByUserId",
    NULL AS "usedAt",
    0 AS "attemptCount",
    "createdAt",
    "completedAt"
FROM "OnboardingInvitation";
DROP TABLE "OnboardingInvitation";
ALTER TABLE "new_OnboardingInvitation" RENAME TO "OnboardingInvitation";
CREATE UNIQUE INDEX "OnboardingInvitation_email_key" ON "OnboardingInvitation"("email");
CREATE UNIQUE INDEX "OnboardingInvitation_tokenHash_key" ON "OnboardingInvitation"("tokenHash");
CREATE INDEX "OnboardingInvitation_tokenHash_idx" ON "OnboardingInvitation"("tokenHash");
CREATE INDEX "OnboardingInvitation_email_idx" ON "OnboardingInvitation"("email");
CREATE INDEX "OnboardingInvitation_invitedByUserId_idx" ON "OnboardingInvitation"("invitedByUserId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
