-- CreateTable
CREATE TABLE "ExternalCourseLaunchToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "allowedOrigin" TEXT NOT NULL,
    "portalOrigin" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalCourseLaunchToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalCourseLaunchToken_tokenHash_key" ON "ExternalCourseLaunchToken"("tokenHash");

-- CreateIndex
CREATE INDEX "ExternalCourseLaunchToken_userId_idx" ON "ExternalCourseLaunchToken"("userId");

-- CreateIndex
CREATE INDEX "ExternalCourseLaunchToken_courseId_idx" ON "ExternalCourseLaunchToken"("courseId");

-- CreateIndex
CREATE INDEX "ExternalCourseLaunchToken_courseVersionId_idx" ON "ExternalCourseLaunchToken"("courseVersionId");

-- CreateIndex
CREATE INDEX "ExternalCourseLaunchToken_enrollmentId_idx" ON "ExternalCourseLaunchToken"("enrollmentId");

-- CreateIndex
CREATE INDEX "ExternalCourseLaunchToken_courseSlug_idx" ON "ExternalCourseLaunchToken"("courseSlug");

-- CreateIndex
CREATE INDEX "ExternalCourseLaunchToken_expiresAt_idx" ON "ExternalCourseLaunchToken"("expiresAt");
