import "dotenv/config";

import { readFileSync } from "node:fs";
import path from "node:path";
import {
  ContentBlockType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  RoleKey,
  UserStatus,
} from "../src/generated/prisma/enums";
import { ETHIOPIA_REGIONS } from "../src/lib/controlled-options";
import { prisma } from "../src/lib/prisma";
import { PILOT_CATALOGUE_COURSE_IDENTITIES } from "../src/lib/catalogue-course-identities";

const DEMO_SLUG = "welcome-to-cso-learning-hub";

function keyFor(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function findPlatformAdministrator() {
  const administrator = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
    where: {
      roleAssignments: {
        some: {
          isActive: true,
          role: { key: { in: [RoleKey.PLATFORM_ADMIN, RoleKey.SUPER_ADMIN] } },
        },
      },
      status: UserStatus.ACTIVE,
    },
  });
  if (!administrator) {
    throw new Error("An active platform administrator is required before configuring pilot reference data.");
  }
  return administrator;
}

async function configureRegions() {
  for (const [index, label] of ETHIOPIA_REGIONS.entries()) {
    await prisma.referenceDataItem.upsert({
      create: {
        category: "regions",
        description: "Controlled Ethiopia region option used by pilot registration and invitation forms.",
        isActive: true,
        key: keyFor(label),
        label,
        order: index + 1,
      },
      update: { isActive: true, label, order: index + 1 },
      where: { category_key: { category: "regions", key: keyFor(label) } },
    });
  }
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  values.push(current);
  return values;
}

async function configureCapacityAreas() {
  const file = path.resolve(process.cwd(), "docs/specs/phase-1-cso-learning-hub/reference-data/CapacityArea.csv");
  const rows = readFileSync(file, "utf8").trim().split(/\r?\n/).slice(1).map(parseCsvLine);
  const controlledIds = new Set<string>(PILOT_CATALOGUE_COURSE_IDENTITIES.flatMap((course) => [course.primaryCapacityAreaId, ...course.secondaryCapacityAreaIds]));
  for (const [id, name, description, active, sortOrder] of rows) {
    if (!controlledIds.has(id)) continue;
    await prisma.capacityArea.upsert({
      create: { description, id, isActive: active.toUpperCase() === "TRUE", name, slug: keyFor(name), sortOrder: Number(sortOrder) },
      update: { description, isActive: active.toUpperCase() === "TRUE", name, slug: keyFor(name), sortOrder: Number(sortOrder) },
      where: { id },
    });
  }
  const savedCount = await prisma.capacityArea.count({ where: { id: { in: [...controlledIds] }, isActive: true } });
  if (savedCount !== controlledIds.size) {
    throw new Error("CapacityArea.csv does not contain every controlled catalogue capacity ID.");
  }
}

async function configureCatalogueRecords(administratorId: string) {
  const hrba = await prisma.course.findUnique({ where: { slug: PILOT_CATALOGUE_COURSE_IDENTITIES[0].slug } });
  if (!hrba || hrba.status !== CourseStatus.PUBLISHED || hrba.visibility !== CourseVisibility.ASSIGNED_ONLY) {
    throw new Error("The existing active HRBA record must remain the first invitation-only catalogue course.");
  }

  const capacityIds = new Set(
    (await prisma.capacityArea.findMany({ select: { id: true }, where: { isActive: true } })).map((area) => area.id),
  );

  for (const definition of PILOT_CATALOGUE_COURSE_IDENTITIES.slice(1)) {
    const existing = await prisma.course.findUnique({ where: { slug: definition.slug } });
    if (existing) {
      if (existing.title !== definition.title) {
        throw new Error(`Catalogue record ${definition.slug} exists with a conflicting title.`);
      }
      continue;
    }

    const mappedCapacityIds = [
      definition.primaryCapacityAreaId,
      ...definition.secondaryCapacityAreaIds,
    ];
    const missingCapacityIds = mappedCapacityIds.filter((id) => !capacityIds.has(id));
    if (missingCapacityIds.length > 0) {
      throw new Error(`Missing controlled capacity areas for ${definition.slug}: ${missingCapacityIds.join(", ")}`);
    }

    await prisma.course.create({
      data: {
        assignedCreatorId: administratorId,
        capacityAreas: {
          create: mappedCapacityIds.map((capacityAreaId) => ({ capacityAreaId })),
        },
        certificateEligible: false,
        createdById: administratorId,
        finalTestRequired: false,
        language: "English",
        level: CourseLevel.FOUNDATIONAL,
        longDescription: "This catalogue course is retained as integration-ready metadata and remains unavailable until its learning content is completed.",
        shortDescription: "Course content and integration are being prepared for a future Hub release.",
        slug: definition.slug,
        status: CourseStatus.DRAFT,
        targetAudience: "Local and grassroots CSO practitioners",
        title: definition.title,
        visibility: CourseVisibility.PRIVATE,
      },
    });
  }
}

const demoLessons = [
  {
    blocks: [
      {
        title: "Welcome to your learning space",
        type: ContentBlockType.TEXT,
        configJson: {
          body: "Welcome, {{learnerName}}. Your CSO Learning Hub registration is confirmed.\n\nYou are signed in with {{learnerEmail}}. Your profile helps the Hub keep your learning and progress connected to the correct account.",
          highlightedNote: "Use this same account whenever you return so your course progress remains available.",
        },
      },
    ],
    description: "Confirm your learner identity and become familiar with the Hub.",
    title: "Welcome",
  },
  {
    blocks: [
      {
        title: "How the Learning Hub Works",
        type: ContentBlockType.TEXT,
        configJson: {
          body: "The Hub brings practical courses and learner support into one clear journey.",
          bullets: [
            "Courses: browse learning that is available to your account.",
            "Progress: complete lessons and resume where you stopped.",
            "Assessments: demonstrate learning where a course requires one.",
            "Certificates: access verified completion records for eligible courses.",
            "Support: use the Help and Support routes when you need assistance.",
          ],
        },
      },
    ],
    description: "See how courses, progress, assessments, certificates, and support fit together.",
    title: "How the Learning Hub Works",
  },
  {
    blocks: [
      {
        title: "Choose the best way to preserve progress",
        type: ContentBlockType.KNOWLEDGE_CHECK,
        configJson: {
          correctOptionId: "same-account",
          options: [
            { feedback: "Correct. Your signed-in account connects you to your saved learning.", id: "same-account", isCorrect: true, label: "Return using the same learner account" },
            { feedback: "A shared or different account cannot reliably recover your personal progress.", id: "different-account", isCorrect: false, label: "Use a different account each time" },
          ],
          question: "What should you do to recover your saved course progress?",
        },
      },
    ],
    description: "Complete one short knowledge check and receive immediate feedback.",
    title: "Try a Short Activity",
  },
  {
    blocks: [
      {
        title: "Your demo is complete",
        type: ContentBlockType.TEXT,
        configJson: {
          body: "You have reached the final demo page. Complete this lesson to save 100% progress for the course.",
          highlightedNote: "Your progress is saved to your learner account and will be available when you sign in again.",
        },
      },
      {
        title: "Return to your learning dashboard",
        type: ContentBlockType.BUTTON_CTA,
        configJson: { description: "Review your courses and saved progress.", label: "Go to learner dashboard", targetUrl: "/learn" },
      },
      {
        title: "Explore available courses",
        type: ContentBlockType.BUTTON_CTA,
        configJson: { description: "Browse available and upcoming learning for CSOs.", label: "Browse courses", targetUrl: "/courses" },
      },
    ],
    description: "Confirm that progress is saved and choose where to go next.",
    title: "You Completed the Demo",
  },
] as const;

async function configureDemoCourse(administratorId: string) {
  const course = await prisma.course.upsert({
    create: {
      analysisMetadataJson: { learnerTemplateId: "LT-GUIDED-LESSON", pilotReferenceCourse: true },
      assignedCreatorId: administratorId,
      certificateEligible: false,
      createdById: administratorId,
      estimatedDurationMinutes: 12,
      finalTestRequired: false,
      language: "English",
      level: CourseLevel.INTRODUCTORY,
      longDescription: "A four-page orientation that confirms learner access and demonstrates course navigation, interaction, and saved progress.",
      shortDescription: "A short orientation to learner accounts, courses, progress, and support.",
      slug: DEMO_SLUG,
      status: CourseStatus.PUBLISHED,
      targetAudience: "Newly registered CSO Learning Hub learners",
      title: "Welcome to the CSO Learning Hub",
      visibility: CourseVisibility.PUBLIC,
    },
    update: {
      archivedAt: null,
      certificateEligible: false,
      estimatedDurationMinutes: 12,
      finalTestRequired: false,
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.PUBLIC,
    },
    where: { slug: DEMO_SLUG },
  });

  const version = await prisma.courseVersion.upsert({
    create: {
      changeNotes: "Pilot reference orientation course.",
      courseId: course.id,
      createdById: administratorId,
      publishedAt: new Date(),
      publishedById: administratorId,
      status: CourseStatus.PUBLISHED,
      versionNumber: 1,
    },
    update: { archivedAt: null, publishedById: administratorId, status: CourseStatus.PUBLISHED },
    where: { courseId_versionNumber: { courseId: course.id, versionNumber: 1 } },
  });

  const courseModule = await prisma.module.upsert({
    create: { courseVersionId: version.id, description: "Four short pages introducing the learner journey.", estimatedDurationMinutes: 12, order: 1, title: "Learning Hub orientation" },
    update: { description: "Four short pages introducing the learner journey.", estimatedDurationMinutes: 12, title: "Learning Hub orientation" },
    where: { courseVersionId_order: { courseVersionId: version.id, order: 1 } },
  });

  for (const [lessonIndex, lessonDefinition] of demoLessons.entries()) {
    const lesson = await prisma.lesson.upsert({
      create: { completionRequired: true, description: lessonDefinition.description, estimatedDurationMinutes: 3, moduleId: courseModule.id, order: lessonIndex + 1, title: lessonDefinition.title },
      update: { completionRequired: true, description: lessonDefinition.description, estimatedDurationMinutes: 3, title: lessonDefinition.title },
      where: { moduleId_order: { moduleId: courseModule.id, order: lessonIndex + 1 } },
    });
    for (const [blockIndex, blockDefinition] of lessonDefinition.blocks.entries()) {
      await prisma.contentBlock.upsert({
        create: { configJson: blockDefinition.configJson, estimatedDurationMinutes: 2, isRequired: true, lessonId: lesson.id, order: blockIndex + 1, title: blockDefinition.title, type: blockDefinition.type },
        update: { configJson: blockDefinition.configJson, estimatedDurationMinutes: 2, isRequired: true, title: blockDefinition.title, type: blockDefinition.type },
        where: { lessonId_order: { lessonId: lesson.id, order: blockIndex + 1 } },
      });
    }
  }
}

async function main() {
  const administrator = await findPlatformAdministrator();
  await configureRegions();
  await configureCapacityAreas();
  await configureCatalogueRecords(administrator.id);
  await configureDemoCourse(administrator.id);
  const [catalogueCount, demo] = await Promise.all([
    prisma.course.count({ where: { slug: { in: PILOT_CATALOGUE_COURSE_IDENTITIES.map((course) => course.slug) } } }),
    prisma.course.findUnique({ include: { versions: { include: { modules: { include: { lessons: true } } } } }, where: { slug: DEMO_SLUG } }),
  ]);
  if (catalogueCount !== PILOT_CATALOGUE_COURSE_IDENTITIES.length || demo?.versions[0]?.modules[0]?.lessons.length !== 4) {
    throw new Error("Pilot catalogue or demo-course verification failed.");
  }
  console.log("Pilot reference configuration ready: nine catalogue records, controlled regions, and four-page open demo course.");
}

main().finally(async () => prisma.$disconnect());
