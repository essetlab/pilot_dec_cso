-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Indicator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "standardFamilyId" TEXT NOT NULL,
    "indicatorCode" TEXT NOT NULL,
    "indicatorName" TEXT NOT NULL,
    "indicatorDescription" TEXT,
    "capacityAreaId" TEXT NOT NULL,
    "csoPracticeId" TEXT,
    "measurementLevel" TEXT,
    "evidenceType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Indicator_standardFamilyId_fkey" FOREIGN KEY ("standardFamilyId") REFERENCES "StandardFamily" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Indicator_capacityAreaId_fkey" FOREIGN KEY ("capacityAreaId") REFERENCES "CapacityArea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Indicator_csoPracticeId_fkey" FOREIGN KEY ("csoPracticeId") REFERENCES "CSOPractice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Indicator" (
    "capacityAreaId",
    "createdAt",
    "csoPracticeId",
    "evidenceType",
    "id",
    "indicatorCode",
    "indicatorDescription",
    "indicatorName",
    "isActive",
    "measurementLevel",
    "standardFamilyId",
    "updatedAt"
)
SELECT
    "capacityAreaId",
    "createdAt",
    "csoPracticeId",
    "evidenceType",
    "id",
    "indicatorCode",
    "indicatorDescription",
    "indicatorName",
    "isActive",
    "measurementLevel",
    "standardFamilyId",
    "updatedAt"
FROM "Indicator";

DROP TABLE "Indicator";
ALTER TABLE "new_Indicator" RENAME TO "Indicator";

CREATE INDEX "Indicator_standardFamilyId_idx" ON "Indicator"("standardFamilyId");
CREATE INDEX "Indicator_capacityAreaId_idx" ON "Indicator"("capacityAreaId");
CREATE INDEX "Indicator_csoPracticeId_idx" ON "Indicator"("csoPracticeId");
CREATE INDEX "Indicator_isActive_idx" ON "Indicator"("isActive");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
