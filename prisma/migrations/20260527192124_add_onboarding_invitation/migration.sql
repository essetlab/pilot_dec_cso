-- CreateTable
CREATE TABLE "OnboardingInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingInvitation_email_key" ON "OnboardingInvitation"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingInvitation_token_key" ON "OnboardingInvitation"("token");

-- CreateIndex
CREATE INDEX "OnboardingInvitation_token_idx" ON "OnboardingInvitation"("token");

-- CreateIndex
CREATE INDEX "OnboardingInvitation_email_idx" ON "OnboardingInvitation"("email");
