import "dotenv/config";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  ContentBlockType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  QuizQuestionType,
} from "../src/generated/prisma/enums";
import { RoleKey, UserStatus, type Prisma } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";
import { pathToFileURL } from "node:url";

export const HRBA_COURSE_ID = "COURSE-HRBA-ADVOCACY-PRACTICE";
export const HRBA_COURSE_SLUG =
  "human-rights-based-advocacy-in-practice-for-local-csos";
export const HRBA_VERSION_ID = "PCV-HRBA-ADVOCACY-PRACTICE-V1";

const demoCourseDir = path.resolve(
  process.cwd(),
  "docs/specs/phase-1-cso-learning-hub/demo-courses/hrba-advocacy",
);
const referenceDataDir = path.resolve(
  process.cwd(),
  "docs/specs/phase-1-cso-learning-hub/reference-data",
);

const requiredDemoFiles = [
  "00_import_manifest.csv",
  "01_course_setup_enhanced.csv",
  "02_course_metadata_enhanced.csv",
  "03_learning_outcomes_enhanced.csv",
  "04_modules_lessons_enhanced.csv",
  "05_build_studio_blocks_enhanced.csv",
  "06_final_test_enhanced.csv",
  "07_asset_manifest_enhanced.csv",
  "08_catalog_preview_data.csv",
  "09_course_preview_qa.csv",
  "10_codex_import_prompt.md",
] as const;

const requiredReferenceFiles = [
  "CapacityArea.csv",
  "CSOPractice.csv",
  "StandardFamily.csv",
  "Indicator.csv",
  "_Lists.csv",
] as const;

type CsvRow = Record<string, string>;
type ImportSummary = {
  assets: {
    missingOptional: string[];
    missingRequired: string[];
    presentRequired: string[];
    temporaryVideoUrls: string[];
  };
  blocksImported: number;
  courseId: string;
  courseSlug: string;
  finalTestQuestionsImported: number;
  lessonsImported: number;
  modulesImported: number;
  outcomesImported: number;
  referenceDataVerified: string[];
  resourcesImported: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stableReferenceId(category: string, value: string) {
  return `seed-reference-${slugify(`${category}-${value}`)}`.slice(0, 190);
}

function stableId(prefix: string, value: string) {
  return `${prefix}-${slugify(value)}`.slice(0, 190);
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());

  return values;
}

function readCsv(filePath: string): CsvRow[] {
  if (!existsSync(filePath)) {
    throw new Error(`Required CSV not found: ${filePath}`);
  }

  const content = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);
  const [headerLine, ...dataLines] = lines;

  if (!headerLine) {
    throw new Error(`Required CSV is empty: ${filePath}`);
  }

  const headers = parseCsvLine(headerLine);

  return dataLines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function readDemoCsv(fileName: (typeof requiredDemoFiles)[number]) {
  return readCsv(path.join(demoCourseDir, fileName));
}

function readReferenceCsv(fileName: (typeof requiredReferenceFiles)[number]) {
  return readCsv(path.join(referenceDataDir, fileName));
}

function assertRequiredFiles() {
  const missingDemoFiles = requiredDemoFiles.filter(
    (fileName) => !existsSync(path.join(demoCourseDir, fileName)),
  );
  const missingReferenceFiles = requiredReferenceFiles.filter(
    (fileName) => !existsSync(path.join(referenceDataDir, fileName)),
  );

  if (missingDemoFiles.length > 0 || missingReferenceFiles.length > 0) {
    throw new Error(
      [
        missingDemoFiles.length > 0
          ? `Missing HRBA demo file(s): ${missingDemoFiles.join(", ")}`
          : "",
        missingReferenceFiles.length > 0
          ? `Missing reference-data file(s): ${missingReferenceFiles.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }
}

function csvText(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed || null;
}

function csvBoolean(value: string | undefined, fallback = false) {
  const normalized = value?.trim().toUpperCase();
  if (!normalized) {
    return fallback;
  }

  return normalized === "TRUE" || normalized === "YES";
}

function csvInteger(value: string | undefined, fallback = 0) {
  const parsed = Number.parseInt(value?.replace(/[^0-9-]/g, "") ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function splitIds(value: string | undefined) {
  return (value ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

function labelForReferenceKey(value: string) {
  const specialLabels: Record<string, string> = {
    "RDI-CAUSE-K": "Knowledge",
    "RDI-CAUSE-S": "Skill",
    "RDI-CAUSE-M": "Motivation",
    "RDI-CAUSE-E": "Environment",
    "RDI-LCH-YES": "Yes",
    "RDI-LCH-PARTLY": "Partly",
    "RDI-LCH-NO": "No",
    "RDI-ROUTE-COURSE": "Course fit",
    "RDI-ROUTE-PLUS": "Course plus support",
    "RDI-ROUTE-LSP": "Refer to support",
    "RDI-ROUTE-NON": "Not a course fit",
    "RDI-SENS-LOW": "Low",
    "RDI-SENS-MED": "Medium",
    "RDI-SENS-HIGH": "High",
  };

  return (
    specialLabels[value] ??
    value
      .replace(/^RDI-/, "")
      .replace(/-/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

function courseSetupMap() {
  return new Map(
    readDemoCsv("01_course_setup_enhanced.csv").map((row) => [
      row.fieldKey,
      row.valueId || row.copyPasteValue,
    ]),
  );
}

function metadataMap() {
  return new Map(
    readDemoCsv("02_course_metadata_enhanced.csv").map((row) => [
      row.fieldKey,
      row.copyPasteValue,
    ]),
  );
}

function parseBlockConfig(row: CsvRow) {
  try {
    return JSON.parse(row.configJson || "{}") as Record<string, unknown>;
  } catch (error) {
    throw new Error(`Invalid configJson for block ${row.blockId}: ${(error as Error).message}`);
  }
}

function mapBlockType(type: string) {
  if (type === "FLASHCARDS") {
    return ContentBlockType.FLASHCARD;
  }

  if (type === "PRACTICAL_ACTIVITY") {
    return ContentBlockType.PRACTICAL_ACTIVITY_PROMPT;
  }

  if (type in ContentBlockType) {
    return ContentBlockType[type as keyof typeof ContentBlockType];
  }

  throw new Error(`Unsupported HRBA content block type: ${type}`);
}

function parseLessonOrder(value: string | undefined) {
  const parts = (value ?? "").split(".");
  const candidate = parts.length > 1 ? parts[1] : parts[0];
  return csvInteger(candidate, 1);
}

function normalizePublicAssetUrl(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  return value.startsWith("assets/") ? `/${value}` : value;
}

function normalizeBlockAssetUrls(config: Record<string, unknown>) {
  const next = { ...config };

  for (const key of ["sourceUrl", "fileUrl", "imageUrl", "thumbnailUrl"]) {
    if (key in next) {
      next[key] = normalizePublicAssetUrl(next[key]);
    }
  }

  return next;
}

function correctAnswerValue(row: CsvRow) {
  const key = row.correctAnswer?.trim();
  if (!key) {
    return "";
  }

  if (row.questionType === "TRUE_FALSE") {
    return key;
  }

  const optionKey = `option${key}` as keyof CsvRow;
  return row[optionKey] || key;
}

async function ensureReferenceData() {
  for (const row of readReferenceCsv("CapacityArea.csv")) {
    await prisma.capacityArea.upsert({
      create: {
        description: csvText(row.description),
        id: row.id,
        isActive: csvBoolean(row.active, true),
        name: row.name,
        slug: slugify(row.name),
        sortOrder: csvInteger(row.sortOrder),
      },
      update: {
        description: csvText(row.description),
        isActive: csvBoolean(row.active, true),
        name: row.name,
        sortOrder: csvInteger(row.sortOrder),
      },
      where: { id: row.id },
    });
  }

  for (const row of readReferenceCsv("StandardFamily.csv")) {
    await prisma.standardFamily.upsert({
      create: {
        description: csvText(row.description),
        id: row.id,
        isActive: csvBoolean(row.active, true),
        name: row.name,
      },
      update: {
        description: csvText(row.description),
        isActive: csvBoolean(row.active, true),
        name: row.name,
      },
      where: { id: row.id },
    });
  }

  for (const row of readReferenceCsv("CSOPractice.csv")) {
    await prisma.cSOPractice.upsert({
      create: {
        capacityAreaId: row.capacityAreaId,
        description: csvText(row.description),
        exampleGap: csvText(row.exampleGap),
        id: row.id,
        isActive: csvBoolean(row.active, true),
        name: row.name,
      },
      update: {
        capacityAreaId: row.capacityAreaId,
        description: csvText(row.description),
        exampleGap: csvText(row.exampleGap),
        isActive: csvBoolean(row.active, true),
        name: row.name,
      },
      where: { id: row.id },
    });
  }

  for (const row of readReferenceCsv("Indicator.csv")) {
    await prisma.indicator.upsert({
      create: {
        capacityAreaId: row.capacityAreaId,
        csoPracticeId: row.csoPracticeId || null,
        evidenceType: csvText(row.evidenceType),
        id: row.id,
        indicatorCode: row.indicatorCode,
        indicatorDescription: csvText(row.indicatorDescription),
        indicatorName: row.indicatorName,
        isActive: csvBoolean(row.active, true),
        measurementLevel: csvText(row.measurementLevel),
        standardFamilyId: row.standardFamilyId,
      },
      update: {
        capacityAreaId: row.capacityAreaId,
        csoPracticeId: row.csoPracticeId || null,
        evidenceType: csvText(row.evidenceType),
        indicatorCode: row.indicatorCode,
        indicatorDescription: csvText(row.indicatorDescription),
        indicatorName: row.indicatorName,
        isActive: csvBoolean(row.active, true),
        measurementLevel: csvText(row.measurementLevel),
        standardFamilyId: row.standardFamilyId,
      },
      where: { id: row.id },
    });
  }

  const valuesByCategory = new Map<string, Set<string>>();
  for (const row of readReferenceCsv("_Lists.csv")) {
    for (const [column, rawValue] of Object.entries(row)) {
      const value = rawValue.trim();
      if (!value || column.endsWith("_IDS")) {
        continue;
      }

      const category = slugify(column);
      const values = valuesByCategory.get(category) ?? new Set<string>();
      values.add(value);
      valuesByCategory.set(category, values);
    }
  }

  for (const [category, values] of valuesByCategory) {
    let order = 1;
    for (const value of values) {
      await prisma.referenceDataItem.upsert({
        create: {
          category,
          description: `Controlled value from _Lists.csv column ${category}.`,
          id: stableReferenceId(category, value),
          isActive: true,
          key: value,
          label: labelForReferenceKey(value),
          order,
        },
        update: {
          description: `Controlled value from _Lists.csv column ${category}.`,
          isActive: true,
          label: labelForReferenceKey(value),
          order,
        },
        where: {
          category_key: {
            category,
            key: value,
          },
        },
      });
      order += 1;
    }
  }
}

async function ensureDemoUsers() {
  const roleDefinitions = [
    {
      description: "Full platform administration access",
      key: RoleKey.SUPER_ADMIN,
      name: "Super Admin",
    },
    {
      description: "Course authoring and creator workspace access",
      key: RoleKey.COURSE_CREATOR,
      name: "Course Creator",
    },
    {
      description: "Participant learning access",
      key: RoleKey.PARTICIPANT,
      name: "Participant",
    },
  ] as const;

  const roleByKey = new Map<RoleKey, { id: string }>();
  for (const role of roleDefinitions) {
    roleByKey.set(
      role.key,
      await prisma.role.upsert({
        create: {
          description: role.description,
          id: stableId("seed-role", role.key),
          isSystemRole: true,
          key: role.key,
          name: role.name,
        },
        update: {
          description: role.description,
          isSystemRole: true,
          name: role.name,
        },
        where: { key: role.key },
      }),
    );
  }

  const superAdmin = await prisma.user.upsert({
    create: {
      email: "superadmin@demo.local",
      fullName: "Super Admin Demo",
      id: "seed-super-admin-demo",
      status: UserStatus.ACTIVE,
    },
    update: {
      fullName: "Super Admin Demo",
      status: UserStatus.ACTIVE,
    },
    where: { email: "superadmin@demo.local" },
  });
  const creator = await prisma.user.upsert({
    create: {
      email: "creator@demo.local",
      fullName: "Course Creator Demo",
      id: "seed-course-creator-demo",
      status: UserStatus.ACTIVE,
    },
    update: {
      fullName: "Course Creator Demo",
      status: UserStatus.ACTIVE,
    },
    where: { email: "creator@demo.local" },
  });
  const participant = await prisma.user.upsert({
    create: {
      email: "participant2@demo.local",
      fullName: "Participant Completed",
      id: "seed-participant-completed-demo",
      status: UserStatus.ACTIVE,
    },
    update: {
      fullName: "Participant Completed",
      status: UserStatus.ACTIVE,
    },
    where: { email: "participant2@demo.local" },
  });

  for (const assignment of [
    { roleKey: RoleKey.SUPER_ADMIN, userId: superAdmin.id },
    { roleKey: RoleKey.COURSE_CREATOR, userId: creator.id },
    { roleKey: RoleKey.PARTICIPANT, userId: participant.id },
  ] as const) {
    const role = roleByKey.get(assignment.roleKey);
    if (!role) {
      throw new Error(`Missing demo role for ${assignment.roleKey}`);
    }

    await prisma.userRoleAssignment.upsert({
      create: {
        assignedById: superAdmin.id,
        id: stableId("seed-user-role", `${assignment.userId}-${role.id}`),
        isActive: true,
        roleId: role.id,
        userId: assignment.userId,
      },
      update: {
        assignedById: superAdmin.id,
        isActive: true,
      },
      where: {
        userId_roleId: {
          roleId: role.id,
          userId: assignment.userId,
        },
      },
    });
  }

  return { creator };
}

async function clearUnusedSlugConflict() {
  const conflict = await prisma.course.findFirst({
    include: {
      certificates: { select: { id: true }, take: 1 },
      enrollments: { select: { id: true }, take: 1 },
      quizAttempts: { select: { id: true }, take: 1 },
    },
    where: {
      id: { not: HRBA_COURSE_ID },
      slug: HRBA_COURSE_SLUG,
    },
  });

  if (!conflict) {
    return;
  }

  const hasLearnerRecords =
    conflict.enrollments.length > 0 ||
    conflict.quizAttempts.length > 0 ||
    conflict.certificates.length > 0;

  if (hasLearnerRecords) {
    throw new Error(
      `Cannot import ${HRBA_COURSE_ID}: slug ${HRBA_COURSE_SLUG} is already used by course ${conflict.id} with learner records.`,
    );
  }

  await prisma.course.delete({ where: { id: conflict.id } });
}

function getAssetAvailability() {
  const rows = readDemoCsv("07_asset_manifest_enhanced.csv");
  const missingRequired: string[] = [];
  const missingOptional: string[] = [];
  const presentRequired: string[] = [];
  const temporaryVideoUrls: string[] = [];

  for (const row of rows) {
    const status = row.status || "";
    const assetPathOrUrl = row.assetPathOrUrl;
    if (!assetPathOrUrl) {
      continue;
    }

    if (assetPathOrUrl.startsWith("http")) {
      if (status.toLowerCase().includes("temporary")) {
        temporaryVideoUrls.push(assetPathOrUrl);
      }
      continue;
    }

    const normalized = assetPathOrUrl.replace(/^\//, "");
    const exists = existsSync(path.resolve(process.cwd(), "public", normalized.replace(/^assets\//, "assets/")));
    const required = status.trim().toLowerCase().startsWith("required");

    if (exists && required) {
      presentRequired.push(assetPathOrUrl);
    } else if (!exists && required) {
      missingRequired.push(row.repoTargetPath || assetPathOrUrl);
    } else if (!exists) {
      missingOptional.push(row.repoTargetPath || assetPathOrUrl);
    }
  }

  return {
    missingOptional,
    missingRequired,
    presentRequired,
    temporaryVideoUrls,
  };
}

export async function importHrbaAdvocacyCourse(): Promise<ImportSummary> {
  assertRequiredFiles();
  await ensureReferenceData();

  const { creator } = await ensureDemoUsers();
  await clearUnusedSlugConflict();
  const setup = courseSetupMap();
  const metadata = metadataMap();
  const outcomeRows = readDemoCsv("03_learning_outcomes_enhanced.csv");
  const moduleRows = readDemoCsv("04_modules_lessons_enhanced.csv");
  const blockRows = readDemoCsv("05_build_studio_blocks_enhanced.csv");
  const finalTestRows = readDemoCsv("06_final_test_enhanced.csv");
  const assetRows = readDemoCsv("07_asset_manifest_enhanced.csv");

  const title = setup.get("title") ?? "Human Rights-Based Advocacy in Practice for Local CSOs";
  const shortDescription = setup.get("shortDescription") ?? "";
  const longDescription = setup.get("longDescription") ?? "";
  const targetAudience = setup.get("targetAudience") ?? "";
  const primaryCapacityAreaId = metadata.get("capacityAreaId") ?? "CAP-ADV";
  const csoPracticeId = metadata.get("csoPracticeId") ?? "PRAC-ADV-SAFE-MSG";
  const standardFamilyIds = splitIds(metadata.get("standardFamilyIds"));
  const primaryIndicatorIds = splitIds(metadata.get("primaryIndicatorIds"));
  const secondaryIndicatorIds = splitIds(metadata.get("secondaryIndicatorIds"));
  const secondaryCapacityAreaIds = splitIds(metadata.get("secondaryCapacityAreaIds"));
  const coverImageUrl =
    setup.get("coverImageUrl") ?? "/assets/demo/hrba-advocacy/images/hrba-advocacy-course-thumbnail.jpg";

  await prisma.course.upsert({
    create: {
      analysisMetadataJson: toJson({
        accessibilityNote: setup.get("accessibilityNote") ?? metadata.get("accessibilityNote"),
        assetManifest: assetRows.map((row) => ({
          assetId: row.assetId,
          assetPathOrUrl: row.assetPathOrUrl,
          assetType: row.assetType,
          linkedBlockId: row.linkedBlockId,
          repoTargetPath: row.repoTargetPath,
          status: row.status,
        })),
        coverImageAltText: setup.get("coverImageAltText"),
        csoPracticeId,
        currentPracticeBaseline: metadata.get("currentPracticeBaseline"),
        desiredPractice: metadata.get("desiredPractice"),
        evidenceSourceType: splitIds(metadata.get("evidenceSourceType")),
        ksmePrimary: metadata.get("ksmePrimary"),
        ksmeSecondary: splitIds(metadata.get("ksmeSecondary")),
        learningCanHelp: metadata.get("learningCanHelp"),
        lowBandwidthFriendly: csvBoolean(setup.get("lowBandwidthFriendly"), true),
        primaryIndicatorIds,
        relatedMetadata: {
          courseFitDecision: metadata.get("courseFitDecision"),
          courseFitNote: metadata.get("courseFitNote"),
          rootCauseSummary: metadata.get("rootCauseSummary"),
          safeguardingNote: metadata.get("safeguardingNote"),
          safeguardingSensitivityLevel: setup.get("safeguardingSensitivityLevel"),
        },
        secondaryCapacityAreaIds,
        secondaryIndicatorIds,
        shortName: setup.get("shortName"),
        standardFamilyIds,
        template: {
          selectedNavigationStyleId: "SIDEBAR_OUTLINE",
          selectedTemplateId: "LT-PRACTICE-SCENARIO",
          selectedThemeId: "DEC_DEFAULT",
        },
      }),
      assignedCreatorId: creator.id,
      capacityGapAddressed: metadata.get("capacityGapAddressed") ?? "",
      certificateEligible: csvBoolean(setup.get("certificateEligible"), true),
      coverImageUrl,
      createdById: creator.id,
      defaultPassThreshold: csvInteger(setup.get("defaultPassThreshold"), 80),
      estimatedDurationMinutes: csvInteger(setup.get("estimatedDurationMinutes"), 90),
      finalTestRequired: csvBoolean(setup.get("finalTestRequired"), true),
      id: HRBA_COURSE_ID,
      intendedPracticeImprovement: metadata.get("intendedPracticeImprovement") ?? "",
      language: setup.get("language") ?? "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription,
      recommendedPrerequisites: metadata.get("recommendedPrerequisites") ?? "",
      relatedFollowUpSupport: metadata.get("relatedFollowUpSupport") ?? "",
      shortDescription,
      slug: HRBA_COURSE_SLUG,
      status: CourseStatus.PUBLISHED,
      targetAudience,
      targetCsoProfile: metadata.get("targetCsoProfile") ?? "",
      title,
      visibility: CourseVisibility.PUBLIC,
    },
    update: {
      analysisMetadataJson: toJson({
        accessibilityNote: setup.get("accessibilityNote") ?? metadata.get("accessibilityNote"),
        assetManifest: assetRows.map((row) => ({
          assetId: row.assetId,
          assetPathOrUrl: row.assetPathOrUrl,
          assetType: row.assetType,
          linkedBlockId: row.linkedBlockId,
          repoTargetPath: row.repoTargetPath,
          status: row.status,
        })),
        coverImageAltText: setup.get("coverImageAltText"),
        csoPracticeId,
        currentPracticeBaseline: metadata.get("currentPracticeBaseline"),
        desiredPractice: metadata.get("desiredPractice"),
        evidenceSourceType: splitIds(metadata.get("evidenceSourceType")),
        ksmePrimary: metadata.get("ksmePrimary"),
        ksmeSecondary: splitIds(metadata.get("ksmeSecondary")),
        learningCanHelp: metadata.get("learningCanHelp"),
        lowBandwidthFriendly: csvBoolean(setup.get("lowBandwidthFriendly"), true),
        primaryIndicatorIds,
        relatedMetadata: {
          courseFitDecision: metadata.get("courseFitDecision"),
          courseFitNote: metadata.get("courseFitNote"),
          rootCauseSummary: metadata.get("rootCauseSummary"),
          safeguardingNote: metadata.get("safeguardingNote"),
          safeguardingSensitivityLevel: setup.get("safeguardingSensitivityLevel"),
        },
        secondaryCapacityAreaIds,
        secondaryIndicatorIds,
        shortName: setup.get("shortName"),
        standardFamilyIds,
        template: {
          selectedNavigationStyleId: "SIDEBAR_OUTLINE",
          selectedTemplateId: "LT-PRACTICE-SCENARIO",
          selectedThemeId: "DEC_DEFAULT",
        },
      }),
      assignedCreatorId: creator.id,
      capacityGapAddressed: metadata.get("capacityGapAddressed") ?? "",
      certificateEligible: csvBoolean(setup.get("certificateEligible"), true),
      coverImageUrl,
      defaultPassThreshold: csvInteger(setup.get("defaultPassThreshold"), 80),
      estimatedDurationMinutes: csvInteger(setup.get("estimatedDurationMinutes"), 90),
      finalTestRequired: csvBoolean(setup.get("finalTestRequired"), true),
      intendedPracticeImprovement: metadata.get("intendedPracticeImprovement") ?? "",
      language: setup.get("language") ?? "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription,
      recommendedPrerequisites: metadata.get("recommendedPrerequisites") ?? "",
      relatedFollowUpSupport: metadata.get("relatedFollowUpSupport") ?? "",
      shortDescription,
      slug: HRBA_COURSE_SLUG,
      status: CourseStatus.PUBLISHED,
      targetAudience,
      targetCsoProfile: metadata.get("targetCsoProfile") ?? "",
      title,
      visibility: CourseVisibility.PUBLIC,
    },
    where: { id: HRBA_COURSE_ID },
  });

  await prisma.courseCapacityArea.upsert({
    create: {
      capacityAreaId: primaryCapacityAreaId,
      courseId: HRBA_COURSE_ID,
    },
    update: {},
    where: {
      courseId_capacityAreaId: {
        capacityAreaId: primaryCapacityAreaId,
        courseId: HRBA_COURSE_ID,
      },
    },
  });

  for (const secondaryCapacityAreaId of secondaryCapacityAreaIds) {
    await prisma.courseCapacityArea.upsert({
      create: {
        capacityAreaId: secondaryCapacityAreaId,
        courseId: HRBA_COURSE_ID,
      },
      update: {},
      where: {
        courseId_capacityAreaId: {
          capacityAreaId: secondaryCapacityAreaId,
          courseId: HRBA_COURSE_ID,
        },
      },
    });
  }

  await prisma.courseVersion.upsert({
    create: {
      changeNotes: "Imported from approved HRBA Advocacy CSV demo course pack.",
      courseId: HRBA_COURSE_ID,
      createdById: creator.id,
      id: HRBA_VERSION_ID,
      publishedAt: new Date("2026-05-24T00:00:00.000Z"),
      publishedById: creator.id,
      status: CourseStatus.PUBLISHED,
      versionNumber: 1,
    },
    update: {
      changeNotes: "Imported from approved HRBA Advocacy CSV demo course pack.",
      publishedAt: new Date("2026-05-24T00:00:00.000Z"),
      publishedById: creator.id,
      status: CourseStatus.PUBLISHED,
    },
    where: { id: HRBA_VERSION_ID },
  });

  for (const row of outcomeRows) {
    await prisma.learningOutcome.upsert({
      create: {
        alignmentMetadataJson: toJson({
          assessmentMethod: row.assessmentMethod,
          capacityAreaId: row.capacityAreaId,
          csoPracticeId: row.csoPracticeId,
          evidenceType: row.evidenceType,
          indicatorId: row.indicatorId,
          linkedFinalTestQuestionIds: splitIds(row.linkedFinalTestQuestionIds),
          localOutcomeStatement: row.localOutcomeStatement,
          measurementLevel: row.measurementLevel,
          observableAction: row.observableAction,
          standardFamilyId: row.standardFamilyId,
          successCriterion: row.successCriterion,
        }),
        courseId: HRBA_COURSE_ID,
        id: row.outcomeId,
        order: csvInteger(row.order),
        statement: row.outcomeStatement,
      },
      update: {
        alignmentMetadataJson: toJson({
          assessmentMethod: row.assessmentMethod,
          capacityAreaId: row.capacityAreaId,
          csoPracticeId: row.csoPracticeId,
          evidenceType: row.evidenceType,
          indicatorId: row.indicatorId,
          linkedFinalTestQuestionIds: splitIds(row.linkedFinalTestQuestionIds),
          localOutcomeStatement: row.localOutcomeStatement,
          measurementLevel: row.measurementLevel,
          observableAction: row.observableAction,
          standardFamilyId: row.standardFamilyId,
          successCriterion: row.successCriterion,
        }),
        order: csvInteger(row.order),
        statement: row.outcomeStatement,
      },
      where: { id: row.outcomeId },
    });
  }

  const modulesById = new Map<string, CsvRow>();
  for (const row of moduleRows) {
    if (!modulesById.has(row.moduleId)) {
      modulesById.set(row.moduleId, row);
    }
  }

  for (const row of modulesById.values()) {
    await prisma.module.upsert({
      create: {
        courseVersionId: HRBA_VERSION_ID,
        description: csvText(row.moduleDescription),
        estimatedDurationMinutes: csvInteger(row.moduleEstimatedDurationMinutes),
        id: row.moduleId,
        order: csvInteger(row.moduleOrder),
        title: row.moduleTitle,
      },
      update: {
        description: csvText(row.moduleDescription),
        estimatedDurationMinutes: csvInteger(row.moduleEstimatedDurationMinutes),
        order: csvInteger(row.moduleOrder),
        title: row.moduleTitle,
      },
      where: { id: row.moduleId },
    });
  }

  for (const row of moduleRows) {
    await prisma.lesson.upsert({
      create: {
        alignmentMetadataJson: toJson({
          capacityAreaId: row.capacityAreaId,
          csoPracticeId: row.csoPracticeId,
          expectedOutput: row.expectedOutput,
          indicatorIds: splitIds(row.indicatorIds),
          lessonLearningFunction: splitIds(row.lessonLearningFunction),
          lessonPracticeFocus: row.lessonPracticeFocus,
          linkedOutcomeIds: splitIds(row.linkedOutcomeIds),
        }),
        completionRequired: csvBoolean(row.completionRequired, true),
        description: csvText(row.lessonDescription),
        estimatedDurationMinutes: csvInteger(row.lessonEstimatedDurationMinutes),
        id: row.lessonId,
        moduleId: row.moduleId,
        order: parseLessonOrder(row.lessonOrder),
        title: row.lessonTitle,
      },
      update: {
        alignmentMetadataJson: toJson({
          capacityAreaId: row.capacityAreaId,
          csoPracticeId: row.csoPracticeId,
          expectedOutput: row.expectedOutput,
          indicatorIds: splitIds(row.indicatorIds),
          lessonLearningFunction: splitIds(row.lessonLearningFunction),
          lessonPracticeFocus: row.lessonPracticeFocus,
          linkedOutcomeIds: splitIds(row.linkedOutcomeIds),
        }),
        completionRequired: csvBoolean(row.completionRequired, true),
        description: csvText(row.lessonDescription),
        estimatedDurationMinutes: csvInteger(row.lessonEstimatedDurationMinutes),
        order: parseLessonOrder(row.lessonOrder),
        title: row.lessonTitle,
      },
      where: { id: row.lessonId },
    });
  }

  const resourceRows = assetRows.filter(
    (row) => row.assetType === "RESOURCE_PDF" && row.status.trim().toLowerCase().startsWith("required"),
  );
  const optionalResourceIds = assetRows
    .filter(
      (row) =>
        row.assetType === "RESOURCE_PDF" &&
        !row.status.trim().toLowerCase().startsWith("required") &&
        row.assetId,
    )
    .map((row) => row.assetId);
  if (optionalResourceIds.length > 0) {
    await prisma.resource.deleteMany({
      where: {
        archivedAt: null,
        contentBlocks: { none: {} },
        courseId: HRBA_COURSE_ID,
        id: { in: optionalResourceIds },
      },
    });
  }
  for (const row of resourceRows) {
    await prisma.resource.upsert({
      create: {
        accessibilityChecked: false,
        accessibilityNotes: csvText(row.accessibilityStatus),
        courseId: HRBA_COURSE_ID,
        courseVersionId: HRBA_VERSION_ID,
        description: row.description || row.caption || row.fileName,
        downloadLabel: row.downloadLabel || "Open resource",
        fileName: row.fileName,
        fileType: "PDF",
        fileUrl: row.assetPathOrUrl,
        id: row.assetId,
        title: row.description || row.fileName,
        uploadedById: creator.id,
      },
      update: {
        accessibilityChecked: false,
        accessibilityNotes: csvText(row.accessibilityStatus),
        description: row.description || row.caption || row.fileName,
        downloadLabel: row.downloadLabel || "Open resource",
        fileName: row.fileName,
        fileType: "PDF",
        fileUrl: row.assetPathOrUrl,
        title: row.description || row.fileName,
        uploadedById: creator.id,
      },
      where: { id: row.assetId },
    });
  }

  const resourceByBlockId = new Map(
    resourceRows.map((row) => [row.linkedBlockId, row.assetId]),
  );

  for (const row of blockRows) {
    const config = normalizeBlockAssetUrls(parseBlockConfig(row));
    await prisma.contentBlock.upsert({
      create: {
        accessibilityNotes: csvText(row.accessibilityNotes),
        configJson: toJson({
          ...config,
          alignment: {
            ...((config.alignment as Record<string, unknown> | undefined) ?? {}),
            blockPurpose: row.blockPurpose,
            expectedLearnerAction: row.expectedLearnerAction,
            indicatorId: row.indicatorId,
            learningFunction: row.learningFunction,
            linkedOutcomeId: row.linkedOutcomeId,
          },
        }),
        estimatedDurationMinutes: csvInteger(row.estimatedDurationMinutes),
        id: row.blockId,
        isRequired: csvBoolean(row.required, true),
        lessonId: row.lessonId,
        order: csvInteger(row.order),
        quizQuestionId: null,
        resourceId: resourceByBlockId.get(row.blockId) ?? null,
        title: row.blockTitle,
        type: mapBlockType(row.blockType),
      },
      update: {
        accessibilityNotes: csvText(row.accessibilityNotes),
        configJson: toJson({
          ...config,
          alignment: {
            ...((config.alignment as Record<string, unknown> | undefined) ?? {}),
            blockPurpose: row.blockPurpose,
            expectedLearnerAction: row.expectedLearnerAction,
            indicatorId: row.indicatorId,
            learningFunction: row.learningFunction,
            linkedOutcomeId: row.linkedOutcomeId,
          },
        }),
        estimatedDurationMinutes: csvInteger(row.estimatedDurationMinutes),
        isRequired: csvBoolean(row.required, true),
        lessonId: row.lessonId,
        order: csvInteger(row.order),
        resourceId: resourceByBlockId.get(row.blockId) ?? null,
        title: row.blockTitle,
        type: mapBlockType(row.blockType),
      },
      where: { id: row.blockId },
    });
  }

  const quizSettings = new Map(
    finalTestRows
      .filter((row) => row.rowType === "setting")
      .map((row) => [row.fieldKey, row.copyPasteValue]),
  );

  await prisma.quiz.upsert({
    create: {
      courseVersionId: HRBA_VERSION_ID,
      description: "Final scored assessment for the HRBA Advocacy demo course.",
      id: "QUIZ-HRBA-ADV-FINAL",
      isFinalTest: true,
      maxAttempts: csvInteger(quizSettings.get("maxAttempts"), 3),
      passThreshold: csvInteger(quizSettings.get("passThreshold"), 80),
      retakeAllowed: csvBoolean(quizSettings.get("retakeAllowed"), true),
      title: quizSettings.get("finalTestTitle") ?? "Final Test: HRBA Advocacy in Practice",
    },
    update: {
      description: "Final scored assessment for the HRBA Advocacy demo course.",
      maxAttempts: csvInteger(quizSettings.get("maxAttempts"), 3),
      passThreshold: csvInteger(quizSettings.get("passThreshold"), 80),
      retakeAllowed: csvBoolean(quizSettings.get("retakeAllowed"), true),
      title: quizSettings.get("finalTestTitle") ?? "Final Test: HRBA Advocacy in Practice",
    },
    where: { id: "QUIZ-HRBA-ADV-FINAL" },
  });

  for (const row of finalTestRows.filter((item) => item.rowType === "question")) {
    const options =
      row.questionType === "TRUE_FALSE"
        ? ["True", "False"]
        : [row.optionA, row.optionB, row.optionC, row.optionD].filter(Boolean);
    const questionType =
      row.questionType === "TRUE_FALSE"
        ? QuizQuestionType.TRUE_FALSE
        : QuizQuestionType.MULTIPLE_CHOICE;

    await prisma.quizQuestion.upsert({
      create: {
        configJson: toJson({
          alignment: {
            assessmentMethod: row.assessmentMethod,
            capacityAreaId: row.capacityAreaId,
            csoPracticeId: row.csoPracticeId,
            indicatorId: row.indicatorId,
            linkedOutcomeId: row.linkedOutcomeId,
          },
          correctAnswer: correctAnswerValue(row),
          options,
        }),
        explanation: csvText(row.explanation),
        id: row.questionId,
        order: csvInteger(row.order),
        points: csvInteger(row.points, 1),
        questionText: row.questionText,
        quizId: "QUIZ-HRBA-ADV-FINAL",
        type: questionType,
      },
      update: {
        configJson: toJson({
          alignment: {
            assessmentMethod: row.assessmentMethod,
            capacityAreaId: row.capacityAreaId,
            csoPracticeId: row.csoPracticeId,
            indicatorId: row.indicatorId,
            linkedOutcomeId: row.linkedOutcomeId,
          },
          correctAnswer: correctAnswerValue(row),
          options,
        }),
        explanation: csvText(row.explanation),
        order: csvInteger(row.order),
        points: csvInteger(row.points, 1),
        questionText: row.questionText,
        type: questionType,
      },
      where: { id: row.questionId },
    });

    await prisma.quizQuestionLearningOutcome.upsert({
      create: {
        learningOutcomeId: row.linkedOutcomeId,
        quizQuestionId: row.questionId,
      },
      update: {},
      where: {
        quizQuestionId_learningOutcomeId: {
          learningOutcomeId: row.linkedOutcomeId,
          quizQuestionId: row.questionId,
        },
      },
    });
  }

  const course = await prisma.course.findUniqueOrThrow({
    include: {
      learningOutcomes: true,
      resources: true,
      versions: {
        include: {
          modules: {
            include: {
              lessons: {
                include: { contentBlocks: true },
              },
            },
          },
          quizzes: {
            include: { questions: true },
            where: { isFinalTest: true },
          },
        },
      },
    },
    where: { id: HRBA_COURSE_ID },
  });
  const version = course.versions.find((item) => item.id === HRBA_VERSION_ID);
  const lessons = version?.modules.flatMap((module) => module.lessons) ?? [];
  const blocks = lessons.flatMap((lesson) => lesson.contentBlocks);

  return {
    assets: getAssetAvailability(),
    blocksImported: blocks.length,
    courseId: course.id,
    courseSlug: course.slug,
    finalTestQuestionsImported: version?.quizzes[0]?.questions.length ?? 0,
    lessonsImported: lessons.length,
    modulesImported: version?.modules.length ?? 0,
    outcomesImported: course.learningOutcomes.length,
    referenceDataVerified: [...requiredReferenceFiles],
    resourcesImported: course.resources.length,
  };
}

async function main() {
  const summary = await importHrbaAdvocacyCourse();
  console.log(JSON.stringify({ status: "ok", ...summary }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
