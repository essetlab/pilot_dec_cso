-- AlterTable
ALTER TABLE "CapacityArea" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN "analysisMetadataJson" JSONB;

-- AlterTable
ALTER TABLE "LearningOutcome" ADD COLUMN "alignmentMetadataJson" JSONB;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN "alignmentMetadataJson" JSONB;

-- CreateTable
CREATE TABLE "CSOPractice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "capacityAreaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "exampleGap" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CSOPractice_capacityAreaId_fkey" FOREIGN KEY ("capacityAreaId") REFERENCES "CapacityArea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StandardFamily" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Indicator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "standardFamilyId" TEXT NOT NULL,
    "indicatorCode" TEXT NOT NULL,
    "indicatorName" TEXT NOT NULL,
    "indicatorDescription" TEXT,
    "capacityAreaId" TEXT NOT NULL,
    "csoPracticeId" TEXT NOT NULL,
    "measurementLevel" TEXT,
    "evidenceType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Indicator_standardFamilyId_fkey" FOREIGN KEY ("standardFamilyId") REFERENCES "StandardFamily" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Indicator_capacityAreaId_fkey" FOREIGN KEY ("capacityAreaId") REFERENCES "CapacityArea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Indicator_csoPracticeId_fkey" FOREIGN KEY ("csoPracticeId") REFERENCES "CSOPractice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CapacityArea_sortOrder_idx" ON "CapacityArea"("sortOrder");

-- CreateIndex
CREATE INDEX "CSOPractice_capacityAreaId_idx" ON "CSOPractice"("capacityAreaId");

-- CreateIndex
CREATE INDEX "CSOPractice_isActive_idx" ON "CSOPractice"("isActive");

-- CreateIndex
CREATE INDEX "StandardFamily_isActive_idx" ON "StandardFamily"("isActive");

-- CreateIndex
CREATE INDEX "Indicator_standardFamilyId_idx" ON "Indicator"("standardFamilyId");

-- CreateIndex
CREATE INDEX "Indicator_capacityAreaId_idx" ON "Indicator"("capacityAreaId");

-- CreateIndex
CREATE INDEX "Indicator_csoPracticeId_idx" ON "Indicator"("csoPracticeId");

-- CreateIndex
CREATE INDEX "Indicator_isActive_idx" ON "Indicator"("isActive");
