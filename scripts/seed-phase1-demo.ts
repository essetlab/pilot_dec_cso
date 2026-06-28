import "dotenv/config";

import crypto from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  AuditActionType,
  CertificateStatus,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  EnrollmentStatus,
  FeedbackType,
  LessonProgressStatus,
  OrganizationFormalityStatus,
  OrganizationStatus,
  QuizQuestionType,
  QuizAttemptStatus,
  RoleKey,
  UserStatus,
} from "../src/generated/prisma/client";
import { ContentBlockType } from "../src/generated/prisma/enums";
import { prisma } from "../src/lib/prisma";
import {
  CERTIFICATE_PASS_THRESHOLD,
  DEMO_COURSE_MODULES,
  DEMO_COURSE_OUTCOMES,
  DEMO_COURSES,
  DEMO_FINAL_TEST_QUESTIONS,
  DEMO_PROPOSAL_COURSE,
} from "../src/lib/demo-data";

const referenceDataDir = path.resolve(
  process.cwd(),
  "docs/specs/phase-1-cso-learning-hub/reference-data",
);
const requiredReferenceFiles = [
  "CapacityArea.csv",
  "CSOPractice.csv",
  "StandardFamily.csv",
  "Indicator.csv",
  "_Lists.csv",
] as const;

const demoSeedDate = new Date("2026-05-19T00:00:00.000Z");
const demoHrbaCourseThumbnail = "/assets/demo/hrba-advocacy-course-thumbnail.svg";

const courseLevelByLabel = {
  Advanced: CourseLevel.ADVANCED,
  Foundational: CourseLevel.FOUNDATIONAL,
  Intermediate: CourseLevel.INTERMEDIATE,
  Introductory: CourseLevel.INTRODUCTORY,
  Mixed: CourseLevel.MIXED,
} as const;

const courseStatusByLabel = {
  Draft: CourseStatus.DRAFT,
  Published: CourseStatus.PUBLISHED,
  "Ready for review": CourseStatus.READY_FOR_REVIEW,
} as const;

const roleSeed = [
  {
    description: "Full platform administration access",
    key: RoleKey.SUPER_ADMIN,
    name: "Super Admin",
  },
  {
    description: "Day-to-day platform administration",
    key: RoleKey.PLATFORM_ADMIN,
    name: "Platform Admin",
  },
  {
    description: "Course authoring and creator workspace access",
    key: RoleKey.COURSE_CREATOR,
    name: "Course Creator",
  },
  {
    description: "Course quality review access",
    key: RoleKey.COURSE_REVIEWER,
    name: "Course Reviewer",
  },
  {
    description: "Cohort facilitation support",
    key: RoleKey.FACILITATOR,
    name: "Facilitator",
  },
  {
    description: "CSO focal person access",
    key: RoleKey.CSO_FOCAL_PERSON,
    name: "CSO Focal Person",
  },
  {
    description: "Participant learning access",
    key: RoleKey.PARTICIPANT,
    name: "Participant",
  },
  {
    description: "Read-only monitoring access",
    key: RoleKey.ME_VIEWER,
    name: "M&E Viewer",
  },
] as const;

const demoOrganizations = [
  {
    focalPersonEmail: "focal@demo.local",
    focalPersonName: "CSO Focal Person Demo",
    formalityStatus: OrganizationFormalityStatus.FORMAL_REGISTERED,
    name: "Hiwot Community Development Association",
    organizationTypeId: "Local CSO",
    region: "Amhara",
    shortName: "HCDA",
  },
  {
    focalPersonEmail: "participant3@demo.local",
    focalPersonName: "Participant New",
    formalityStatus: OrganizationFormalityStatus.COMMUNITY_BASED,
    name: "Lemat Youth Initiative",
    organizationTypeId: "Grassroots / Youth Group",
    region: "Oromia",
    shortName: "LYI",
  },
] as const;

const demoCohort = {
  description: "Demo cohort for Phase 1 learning platform testing.",
  endDate: new Date("2026-04-30T00:00:00.000Z"),
  name: "CSF+ Grassroots Cohort 1",
  programmeName:
    "Empowering Grassroots CSOs to Promote Good Governance and Development",
  region: "Multi-region",
  startDate: new Date("2026-02-09T00:00:00.000Z"),
};

const demoReferenceDataItems = [
  ...["Introductory", "Foundational", "Intermediate", "Advanced", "Mixed"].map(
    (label, index) => ({
      category: "course-levels",
      description: `${label} course level for Phase 1 learning journeys.`,
      key: slugify(label),
      label,
      order: index + 1,
    }),
  ),
  ...[
    "Local CSO",
    "Community-based organization",
    "Grassroots / Youth Group",
    "Network or coalition",
  ].map((label, index) => ({
    category: "organization-types",
    description: `${label} organization type for admin records and monitoring filters.`,
    key: slugify(label),
    label,
    order: index + 1,
  })),
  ...["Addis Ababa", "Amhara", "Oromia", "Somali", "Sidama", "Tigray", "Multi-region"].map(
    (label, index) => ({
      category: "regions",
      description: `${label} region label for user, organization, cohort, and monitoring views.`,
      key: slugify(label),
      label,
      order: index + 1,
    }),
  ),
  ...["English", "Amharic", "Afaan Oromo", "Somali", "Tigrinya"].map(
    (label, index) => ({
      category: "languages",
      description: `${label} language option for learning content and course discovery.`,
      key: slugify(label),
      label,
      order: index + 1,
    }),
  ),
] as const;

const demoUsers = [
  {
    email: "superadmin@demo.local",
    fullName: "Super Admin Demo",
    id: "seed-super-admin-demo",
    role: RoleKey.SUPER_ADMIN,
  },
  {
    email: "admin@demo.local",
    fullName: "Platform Admin Demo",
    id: "seed-platform-admin-demo",
    role: RoleKey.PLATFORM_ADMIN,
  },
  {
    email: "creator@demo.local",
    fullName: "Course Creator Demo",
    id: "seed-course-creator-demo",
    role: RoleKey.COURSE_CREATOR,
  },
  {
    email: "reviewer@demo.local",
    fullName: "Course Reviewer Demo",
    id: "seed-course-reviewer-demo",
    role: RoleKey.COURSE_REVIEWER,
  },
  {
    email: "meviewer@demo.local",
    fullName: "ME Viewer Demo",
    id: "seed-me-viewer-demo",
    role: RoleKey.ME_VIEWER,
  },
  {
    email: "facilitator@demo.local",
    fullName: "Facilitator Demo",
    id: "seed-facilitator-demo",
    role: RoleKey.FACILITATOR,
  },
  {
    email: "focal@demo.local",
    fullName: "CSO Focal Person Demo",
    id: "seed-cso-focal-person-demo",
    organizationName: demoOrganizations[0].name,
    role: RoleKey.CSO_FOCAL_PERSON,
  },
  {
    email: "participant1@demo.local",
    fullName: "Participant In Progress",
    id: "seed-participant-in-progress-demo",
    organizationName: demoOrganizations[0].name,
    role: RoleKey.PARTICIPANT,
  },
  {
    email: "participant2@demo.local",
    fullName: "Participant Completed",
    id: "seed-participant-completed-demo",
    organizationName: demoOrganizations[0].name,
    role: RoleKey.PARTICIPANT,
  },
  {
    email: "participant3@demo.local",
    fullName: "Participant New",
    id: "seed-participant-new-demo",
    organizationName: demoOrganizations[1].name,
    role: RoleKey.PARTICIPANT,
  },
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

function parseCsvFile(fileName: (typeof requiredReferenceFiles)[number]) {
  const filePath = path.join(referenceDataDir, fileName);

  if (!existsSync(filePath)) {
    throw new Error(`Required reference CSV not found: ${filePath}`);
  }

  const content = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  const [headerLine, ...dataLines] = lines;
  if (!headerLine) {
    throw new Error(`Required reference CSV is empty: ${filePath}`);
  }

  const headers = parseCsvLine(headerLine);

  return dataLines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function assertRequiredReferenceFiles() {
  const missing = requiredReferenceFiles.filter(
    (fileName) => !existsSync(path.join(referenceDataDir, fileName)),
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required reference CSV file(s) in ${referenceDataDir}: ${missing.join(", ")}`,
    );
  }
}

function parseCsvBoolean(value: string) {
  return value.trim().toUpperCase() === "TRUE";
}

function parseCsvInteger(value: string, fallback = 0) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function optionalCsvText(value: string | undefined) {
  const normalized = value?.trim() ?? "";

  return normalized || null;
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
    "RDI-MLEV-PART": "Participation",
    "RDI-MLEV-LEARN": "Learning",
    "RDI-MLEV-PRACT": "Practice performance",
    "RDI-MLEV-APPLIED": "Applied capacity",
    "RDI-MMETH-COMPLETE": "Completion",
    "RDI-MMETH-KCHECK": "Knowledge check",
    "RDI-MMETH-SCEN": "Scenario",
    "RDI-MMETH-FINAL": "Final test",
  };

  if (specialLabels[value]) {
    return specialLabels[value];
  }

  const parts = value.startsWith("RDI-") ? value.split("-").slice(2) : value.split("-");

  return parts
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function durationMinutes(duration: string) {
  const [minutes] = duration.split(" ");
  const parsed = Number(minutes);

  return Number.isFinite(parsed) ? parsed : null;
}

function courseStatus(course: (typeof DEMO_COURSES)[number]) {
  return courseStatusByLabel[course.status as keyof typeof courseStatusByLabel];
}

function courseLevel(course: (typeof DEMO_COURSES)[number]) {
  return courseLevelByLabel[course.level as keyof typeof courseLevelByLabel];
}

function courseVisibility(course: (typeof DEMO_COURSES)[number]) {
  const status = courseStatus(course);

  if (status === CourseStatus.DRAFT) {
    return CourseVisibility.PRIVATE;
  }

  if (status === CourseStatus.READY_FOR_REVIEW) {
    return CourseVisibility.ASSIGNED_ONLY;
  }

  return CourseVisibility.PUBLIC;
}

function courseCoverImageUrl(course: (typeof DEMO_COURSES)[number]) {
  if (
    course.slug === DEMO_PROPOSAL_COURSE.slug ||
    course.slug === "human-rights-based-approach-practice"
  ) {
    return demoHrbaCourseThumbnail;
  }

  return null;
}

function modulesForCourse(course: (typeof DEMO_COURSES)[number]) {
  if (course.slug === DEMO_PROPOSAL_COURSE.slug) {
    return DEMO_COURSE_MODULES.map((module) => ({
      lessons: [...module.lessons],
      title: module.title,
    }));
  }

  const lessonCount = Math.max(course.lessonsCount, 1);
  const lessons = Array.from({ length: lessonCount }, (_, index) => {
    if (index === 0) {
      return course.currentLesson;
    }

    if (index === lessonCount - 1) {
      return "Final Test";
    }

    return `${course.shortTitle} practice ${index + 1}`;
  });

  return [
    {
      lessons,
      title: course.currentModule,
    },
  ];
}

function outcomesForCourse(course: (typeof DEMO_COURSES)[number]) {
  if (course.slug === DEMO_PROPOSAL_COURSE.slug) {
    return [...DEMO_COURSE_OUTCOMES];
  }

  return [
    `Explain key concepts in ${course.capacityArea.toLowerCase()}.`,
    `Apply practical steps from ${course.shortTitle.toLowerCase()} in CSO work.`,
    "Identify next actions for continued learning and support.",
  ];
}

function finalQuestionsForCourse(course: (typeof DEMO_COURSES)[number]) {
  if (course.slug === DEMO_PROPOSAL_COURSE.slug) {
    return DEMO_FINAL_TEST_QUESTIONS;
  }

  return [
    {
      correctAnswer: "Apply the learning to practical CSO work",
      linkedOutcome: outcomesForCourse(course)[1],
      options: [
        "Apply the learning to practical CSO work",
        "Skip the course activities",
        "Replace team discussion",
        "Remove the final review step",
      ],
      text: `What is the main purpose of ${course.shortTitle}?`,
      type: "Multiple choice",
    },
  ];
}

async function seedCapacityAreas() {
  const records = [];
  const rows = parseCsvFile("CapacityArea.csv");

  for (const row of rows) {
    const id = row.id?.trim();
    const name = row.name?.trim();
    const slug = slugify(name ?? "");

    if (!id || !name || !slug) {
      throw new Error("CapacityArea.csv contains a row without id or name.");
    }

    const capacityArea = await prisma.capacityArea.upsert({
      create: {
        description: optionalCsvText(row.description),
        id,
        isActive: parseCsvBoolean(row.active ?? "TRUE"),
        name,
        slug,
        sortOrder: parseCsvInteger(row.sortOrder ?? "0"),
      },
      update: {
        description: optionalCsvText(row.description),
        isActive: parseCsvBoolean(row.active ?? "TRUE"),
        name,
        sortOrder: parseCsvInteger(row.sortOrder ?? "0"),
      },
      where: { id },
    });

    records.push(capacityArea);
  }

  return records;
}

async function seedCSOPractices() {
  const rows = parseCsvFile("CSOPractice.csv");

  for (const row of rows) {
    const id = row.id?.trim();
    const capacityAreaId = row.capacityAreaId?.trim();
    const name = row.name?.trim();

    if (!id || !capacityAreaId || !name) {
      throw new Error("CSOPractice.csv contains a row without id, capacityAreaId, or name.");
    }

    await prisma.cSOPractice.upsert({
      create: {
        capacityAreaId,
        description: optionalCsvText(row.description),
        exampleGap: optionalCsvText(row.exampleGap),
        id,
        isActive: parseCsvBoolean(row.active ?? "TRUE"),
        name,
      },
      update: {
        capacityAreaId,
        description: optionalCsvText(row.description),
        exampleGap: optionalCsvText(row.exampleGap),
        isActive: parseCsvBoolean(row.active ?? "TRUE"),
        name,
      },
      where: { id },
    });
  }
}

async function seedStandardFamilies() {
  const rows = parseCsvFile("StandardFamily.csv");

  for (const row of rows) {
    const id = row.id?.trim();
    const name = row.name?.trim();

    if (!id || !name) {
      throw new Error("StandardFamily.csv contains a row without id or name.");
    }

    await prisma.standardFamily.upsert({
      create: {
        description: optionalCsvText(row.description),
        id,
        isActive: parseCsvBoolean(row.active ?? "TRUE"),
        name,
      },
      update: {
        description: optionalCsvText(row.description),
        isActive: parseCsvBoolean(row.active ?? "TRUE"),
        name,
      },
      where: { id },
    });
  }
}

async function seedIndicators() {
  const rows = parseCsvFile("Indicator.csv");

  for (const row of rows) {
    const id = row.id?.trim();
    const standardFamilyId = row.standardFamilyId?.trim();
    const indicatorCode = row.indicatorCode?.trim();
    const indicatorName = row.indicatorName?.trim();
    const capacityAreaId = row.capacityAreaId?.trim();
    const csoPracticeId = row.csoPracticeId?.trim() || null;

    if (
      !id ||
      !standardFamilyId ||
      !indicatorCode ||
      !indicatorName ||
      !capacityAreaId
    ) {
      throw new Error("Indicator.csv contains a row without required linkage fields.");
    }

    await prisma.indicator.upsert({
      create: {
        capacityAreaId,
        csoPracticeId,
        evidenceType: optionalCsvText(row.evidenceType),
        id,
        indicatorCode,
        indicatorDescription: optionalCsvText(row.indicatorDescription),
        indicatorName,
        isActive: parseCsvBoolean(row.active ?? "TRUE"),
        measurementLevel: optionalCsvText(row.measurementLevel),
        standardFamilyId,
      },
      update: {
        capacityAreaId,
        csoPracticeId,
        evidenceType: optionalCsvText(row.evidenceType),
        indicatorCode,
        indicatorDescription: optionalCsvText(row.indicatorDescription),
        indicatorName,
        isActive: parseCsvBoolean(row.active ?? "TRUE"),
        measurementLevel: optionalCsvText(row.measurementLevel),
        standardFamilyId,
      },
      where: { id },
    });
  }
}

async function seedCsvControlledListItems() {
  const rows = parseCsvFile("_Lists.csv");
  const valuesByCategory = new Map<string, Set<string>>();

  for (const row of rows) {
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
          id: stableId("seed-reference", `${category}-${value}`),
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

async function seedCsvReferenceData() {
  assertRequiredReferenceFiles();
  await seedCapacityAreas();
  await seedStandardFamilies();
  await seedCSOPractices();
  await seedIndicators();
  await seedCsvControlledListItems();
}

async function seedReferenceDataItems() {
  for (const item of demoReferenceDataItems) {
    await prisma.referenceDataItem.upsert({
      create: {
        category: item.category,
        description: item.description,
        id: stableId("seed-reference", `${item.category}-${item.key}`),
        isActive: true,
        key: item.key,
        label: item.label,
        order: item.order,
      },
      update: {
        description: item.description,
        isActive: true,
        label: item.label,
        order: item.order,
      },
      where: {
        category_key: {
          category: item.category,
          key: item.key,
        },
      },
    });
  }
}

async function seedCourseCapacityLink(courseId: string, capacityAreaId: string) {
  await prisma.courseCapacityArea.upsert({
    create: {
      capacityAreaId,
      courseId,
      id: stableId("seed-course-capacity", `${courseId}-${capacityAreaId}`),
    },
    update: {},
    where: {
      courseId_capacityAreaId: {
        capacityAreaId,
        courseId,
      },
    },
  });
}

async function seedCourseOutcomes(courseId: string, outcomes: string[]) {
  for (const [index, statement] of outcomes.entries()) {
    await prisma.learningOutcome.upsert({
      create: {
        courseId,
        id: stableId("seed-outcome", `${courseId}-${index + 1}`),
        order: index + 1,
        statement,
      },
      update: {
        statement,
      },
      where: {
        courseId_order: {
          courseId,
          order: index + 1,
        },
      },
    });
  }
}

async function seedModulesAndLessons(
  courseId: string,
  courseVersionId: string,
  modules: { lessons: string[]; title: string }[],
) {
  for (const [moduleIndex, module] of modules.entries()) {
    const moduleRecord = await prisma.module.upsert({
      create: {
        courseVersionId,
        description: `${module.title} learning sequence`,
        estimatedDurationMinutes: null,
        id: stableId("seed-module", `${courseId}-${moduleIndex + 1}`),
        order: moduleIndex + 1,
        title: module.title,
      },
      update: {
        description: `${module.title} learning sequence`,
        title: module.title,
      },
      where: {
        courseVersionId_order: {
          courseVersionId,
          order: moduleIndex + 1,
        },
      },
    });

    for (const [lessonIndex, lessonTitle] of module.lessons.entries()) {
      await prisma.lesson.upsert({
        create: {
          completionRequired: true,
          description: `${lessonTitle} lesson`,
          estimatedDurationMinutes: null,
          id: stableId(
            "seed-lesson",
            `${courseId}-${moduleIndex + 1}-${lessonIndex + 1}`,
          ),
          moduleId: moduleRecord.id,
          order: lessonIndex + 1,
          title: lessonTitle,
        },
        update: {
          completionRequired: true,
          description: `${lessonTitle} lesson`,
          title: lessonTitle,
        },
        where: {
          moduleId_order: {
            moduleId: moduleRecord.id,
            order: lessonIndex + 1,
          },
        },
      });
    }
  }
}

function proposalDemoBlocksForLesson(lessonTitle: string) {
  const sharedObjectiveBody =
    "A community problem describes what is happening now. A project objective describes the focused change your organization wants to help create. To make that change clear, name who will benefit, what will improve, where it will happen, and by when.\n\nFor grassroots CSOs, this step helps move from broad concern to a proposal idea that partners and community members can understand.";

  if (lessonTitle === "What Makes a Proposal Fundable?") {
    return [
      {
        configJson: {
          body:
            "A fundable proposal makes the change easy to understand. It explains the problem, identifies who is affected, shows why the work matters, and connects activities to realistic results.",
          heading: "What partners look for",
          readingTimeMinutes: 4,
          width: "standard",
        },
        estimatedDurationMinutes: 4,
        title: "Reading: What makes a proposal fundable?",
        type: ContentBlockType.TEXT,
      },
      {
        configJson: {
          message:
            "A strong proposal is clear, realistic, and connected to a practical community need.",
          style: "success",
        },
        estimatedDurationMinutes: 2,
        title: "Key message: Keep the logic clear",
        type: ContentBlockType.KEY_MESSAGE,
      },
      {
        configJson: {
          context:
            "A youth-led CSO wants to support unemployed young women but has written a very broad project idea.",
          discussionQuestion:
            "What would you ask the team before they write activities and a budget?",
          guidingQuestion: "Which missing details make the idea difficult to assess?",
          learningPoint:
            "A proposal becomes stronger when the team names the target group, intended change, location, and timeframe.",
          scenario:
            "The draft says: 'We will help young women improve their lives through training and awareness activities.'",
          title: "Case study: From broad idea to focused proposal",
        },
        estimatedDurationMinutes: 8,
        title: "Case study: Strengthen a broad project idea",
        type: ContentBlockType.CASE_STUDY,
      },
    ];
  }

  if (lessonTitle === "From Community Problem to Project Objective") {
    return [
      {
        configJson: {
          body: sharedObjectiveBody,
          heading: "Turning a problem into an objective",
          readingTimeMinutes: 5,
          width: "standard",
        },
        estimatedDurationMinutes: 5,
        title: "Reading: Turning a problem into an objective",
        type: ContentBlockType.TEXT,
      },
      {
        configJson: {
          altText:
            "Simple flow diagram showing problem, target group, objective, activities, and results.",
          caption:
            "Use the proposal logic as a simple chain: problem, target group, objective, activities, and results.",
          displaySize: "wide",
          imageUrl: "/images/learning/proposal-logic-flow.svg",
          title: "Proposal logic flow",
        },
        estimatedDurationMinutes: 3,
        title: "Image: Proposal logic flow",
        type: ContentBlockType.IMAGE,
      },
      {
        configJson: {
          cards: [
            {
              back: "It describes a broad condition and does not yet name the specific change the project will support.",
              front: "Problem: Young women have limited employment opportunities.",
              id: "problem-card",
            },
            {
              back: "It names the group, intended change, location, and timeframe.",
              front:
                "Objective: Improve employability skills for 30 young women in the target kebele within six months.",
              id: "objective-card",
            },
          ],
          displayMode: "grid",
          instructions: "Open each card and compare the problem with the objective.",
          title: "Problem or objective?",
        },
        estimatedDurationMinutes: 5,
        title: "Flashcards: Problem or objective?",
        type: ContentBlockType.FLASHCARD,
      },
      {
        configJson: {
          correctFeedback:
            "Correct. This option names the group, change, location, and timeframe.",
          helperText: "Choose the strongest project objective.",
          incorrectFeedback:
            "Not quite. Look for the option that names a specific change for a defined group.",
          options: [
            {
              feedback:
                "This is a broad problem statement and needs a clearer intended change.",
              id: "option-1",
              isCorrect: false,
              label: "Young women do not have enough opportunities.",
            },
            {
              feedback:
                "This is stronger because it names who, what will improve, where, and by when.",
              id: "option-2",
              isCorrect: true,
              label:
                "Improve employability skills for 30 young women in the target kebele within six months.",
            },
            {
              feedback:
                "This is an activity, not the intended change the project wants to support.",
              id: "option-3",
              isCorrect: false,
              label: "Run three skills training sessions for young women.",
            },
          ],
          question: "Which statement is closest to a clear project objective?",
          questionType: "single_choice",
          retryAllowed: true,
        },
        estimatedDurationMinutes: 5,
        title: "Knowledge check: Choose the stronger objective",
        type: ContentBlockType.KNOWLEDGE_CHECK,
      },
    ];
  }

  if (lessonTitle === "Activities, Outputs, and Expected Results") {
    return [
      {
        configJson: {
          allowMultipleOpen: true,
          introduction:
            "Use these terms to connect the work your CSO will do with the change it expects to support.",
          items: [
            {
              body: "Activities are the tasks the project team carries out, such as training, coaching, or community meetings.",
              id: "activities",
              title: "Activities",
            },
            {
              body: "Outputs are the immediate deliverables, such as trained participants, completed plans, or produced materials.",
              id: "outputs",
              title: "Outputs",
            },
            {
              body: "Expected results describe the practical change that should follow from the activities and outputs.",
              id: "results",
              title: "Expected results",
            },
          ],
          title: "Connect the proposal chain",
        },
        estimatedDurationMinutes: 6,
        title: "Accordion: Activities, outputs, and results",
        type: ContentBlockType.ACCORDION,
      },
      {
        configJson: {
          buttonLabel: "Open proposal logic worksheet",
          description:
            "A simple worksheet for linking objectives, activities, outputs, and expected results.",
          fileName: "proposal-logic-worksheet.pdf",
          fileSizeLabel: "240 KB",
          resourceType: "template",
          sourceType: "external_link",
          sourceUrl: "/resources/proposal-development/proposal-logic-worksheet.pdf",
          title: "Proposal logic worksheet",
        },
        estimatedDurationMinutes: 3,
        title: "Resource: Proposal logic worksheet",
        type: ContentBlockType.RESOURCE,
      },
      {
        configJson: {
          completionGuidance:
            "Keep the worksheet for later use when drafting your course activity or project concept.",
          estimatedTimeMinutes: 15,
          expectedOutput:
            "One completed logic chain linking objective, activity, output, and expected result.",
          materialsNeeded: "Proposal logic worksheet",
          taskInstructions:
            "Choose one objective from your CSO context. Add two activities, one output for each activity, and one expected result that follows logically.",
          title: "Complete one proposal logic chain",
        },
        estimatedDurationMinutes: 15,
        title: "Practical activity: Complete a proposal logic chain",
        type: ContentBlockType.PRACTICAL_ACTIVITY_PROMPT,
      },
    ];
  }

  if (lessonTitle === "Common Proposal Weaknesses") {
    return [
      {
        configJson: {
          allowRetry: true,
          choices: [
            {
              feedback:
                "Good choice. Asking for target group and timeframe helps make the objective specific.",
              id: "choice-1",
              label:
                "Ask the team to name the target group, intended change, location, and timeframe.",
              outcomeTone: "positive",
            },
            {
              feedback:
                "This may make the proposal longer, but it does not solve the unclear objective.",
              id: "choice-2",
              label: "Add more activities before changing the objective.",
              outcomeTone: "caution",
            },
            {
              feedback:
                "A budget cannot fix an unclear project logic.",
              id: "choice-3",
              label: "Start with the budget and return to the objective later.",
              outcomeTone: "neutral",
            },
          ],
          context:
            "A proposal draft has many activities but the objective only says: 'Improve community wellbeing.'",
          decisionQuestion: "What should the CSO team do first?",
          learningPoint:
            "When the objective is unclear, strengthen the change statement before expanding activities or budget details.",
          scenario:
            "The team is excited about activities but has not described the specific improvement participants should experience.",
        },
        estimatedDurationMinutes: 8,
        title: "Branching scenario: Fix the weak proposal logic",
        type: ContentBlockType.BRANCHING_SCENARIO,
      },
      {
        configJson: {
          guidanceText:
            "Think about one proposal your CSO has drafted or discussed. You do not need to submit anything here.",
          privacyNote:
            "Do not include sensitive names or private personal information in your notes.",
          question:
            "Which part of your proposal logic usually needs the most clarification: problem, objective, activities, outputs, or results?",
          responseMode: "thinking_only",
        },
        estimatedDurationMinutes: 5,
        title: "Reflection: Where does your proposal logic get weak?",
        type: ContentBlockType.REFLECTION_PROMPT,
      },
    ];
  }

  if (lessonTitle === "Final Test") {
    return [
      {
        configJson: {
          description:
            "A short orientation video summarizing the course path before the final test.",
          durationMinutes: 4,
          sourceType: "external_link",
          sourceUrl: "https://example.org/cso-learning/proposal-final-test-orientation",
          thumbnailUrl: "",
          title: "Final test orientation",
          transcript:
            "This orientation reminds participants to review the proposal logic chain before taking the final test.",
          captionsAvailable: true,
        },
        estimatedDurationMinutes: 4,
        title: "Video: Final test orientation",
        type: ContentBlockType.VIDEO,
      },
    ];
  }

  return [];
}

async function seedProposalContentBlocks(courseVersionId: string) {
  const modules = await prisma.module.findMany({
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
    where: { courseVersionId },
  });

  for (const lesson of modules.flatMap((module) => module.lessons)) {
    const blocks = proposalDemoBlocksForLesson(lesson.title);

    for (const [index, block] of blocks.entries()) {
      await prisma.contentBlock.upsert({
        create: {
          configJson: block.configJson,
          estimatedDurationMinutes: block.estimatedDurationMinutes,
          id: stableId("seed-content-block", `${lesson.id}-${index + 1}`),
          isRequired: true,
          lessonId: lesson.id,
          order: index + 1,
          title: block.title,
          type: block.type,
        },
        update: {
          configJson: block.configJson,
          estimatedDurationMinutes: block.estimatedDurationMinutes,
          isRequired: true,
          title: block.title,
          type: block.type,
        },
        where: {
          lessonId_order: {
            lessonId: lesson.id,
            order: index + 1,
          },
        },
      });
    }
  }
}

async function seedResources(
  course: (typeof DEMO_COURSES)[number],
  courseId: string,
  courseVersionId: string,
  uploadedById: string,
) {
  const count = Number(course.resources);

  for (let index = 0; index < count; index += 1) {
    await prisma.resource.upsert({
      create: {
        accessibilityChecked: true,
        courseId,
        courseVersionId,
        description: `${course.shortTitle} resource ${index + 1}`,
        downloadLabel: "Download resource",
        fileName: `${course.slug}-resource-${index + 1}.pdf`,
        fileType: "PDF",
        fileUrl: `/resources/${course.slug}/resource-${index + 1}.pdf`,
        id: stableId("seed-resource", `${courseId}-${index + 1}`),
        title: `${course.shortTitle} resource ${index + 1}`,
        uploadedById,
      },
      update: {
        accessibilityChecked: true,
        courseVersionId,
        description: `${course.shortTitle} resource ${index + 1}`,
        downloadLabel: "Download resource",
        fileName: `${course.slug}-resource-${index + 1}.pdf`,
        fileType: "PDF",
        fileUrl: `/resources/${course.slug}/resource-${index + 1}.pdf`,
        title: `${course.shortTitle} resource ${index + 1}`,
        uploadedById,
      },
      where: {
        id: stableId("seed-resource", `${courseId}-${index + 1}`),
      },
    });
  }
}

async function seedFinalTest(
  course: (typeof DEMO_COURSES)[number],
  courseVersionId: string,
) {
  const quizId = stableId("seed-final-test", course.id);
  const quiz = await prisma.quiz.upsert({
    create: {
      courseVersionId,
      description: `${course.shortTitle} final test`,
      id: quizId,
      isFinalTest: true,
      maxAttempts: 3,
      passThreshold: CERTIFICATE_PASS_THRESHOLD,
      retakeAllowed: true,
      title: `${course.shortTitle} Final Test`,
    },
    update: {
      courseVersionId,
      description: `${course.shortTitle} final test`,
      isFinalTest: true,
      maxAttempts: 3,
      passThreshold: CERTIFICATE_PASS_THRESHOLD,
      retakeAllowed: true,
      title: `${course.shortTitle} Final Test`,
    },
    where: {
      id: quizId,
    },
  });

  const questions = finalQuestionsForCourse(course);

  for (const [index, question] of questions.entries()) {
    await prisma.quizQuestion.upsert({
      create: {
        configJson: {
          correctAnswer: question.correctAnswer,
          options: question.options,
        },
        explanation: question.linkedOutcome,
        id: stableId("seed-question", `${course.id}-${index + 1}`),
        order: index + 1,
        points: 1,
        questionText: question.text,
        quizId: quiz.id,
        type: QuizQuestionType.MULTIPLE_CHOICE,
      },
      update: {
        configJson: {
          correctAnswer: question.correctAnswer,
          options: question.options,
        },
        explanation: question.linkedOutcome,
        points: 1,
        questionText: question.text,
        type: QuizQuestionType.MULTIPLE_CHOICE,
      },
      where: {
        quizId_order: {
          order: index + 1,
          quizId: quiz.id,
        },
      },
    });
  }

  await prisma.quizQuestion.deleteMany({
    where: {
      order: { gt: questions.length },
      quizId: quiz.id,
    },
  });
}

async function seedCourseContent(
  course: (typeof DEMO_COURSES)[number],
  creatorId: string,
  capacityAreaId: string,
) {
  const status = courseStatus(course);
  const visibility = courseVisibility(course);
  const courseRecord = await prisma.course.upsert({
    create: {
      assignedCreatorId: creatorId,
      capacityGapAddressed: course.description,
      certificateEligible: course.certificateEligible === "Yes",
      coverImageUrl: courseCoverImageUrl(course),
      createdById: creatorId,
      defaultPassThreshold: CERTIFICATE_PASS_THRESHOLD,
      estimatedDurationMinutes: durationMinutes(course.duration),
      finalTestRequired: true,
      id: course.id,
      intendedPracticeImprovement: course.description,
      language: course.language,
      level: courseLevel(course),
      longDescription: course.description,
      recommendedPrerequisites: null,
      relatedFollowUpSupport: null,
      shortDescription: course.description,
      slug: course.slug,
      status,
      targetAudience: course.audience,
      targetCsoProfile: course.audience,
      title: course.title,
      visibility,
    },
    update: {
      assignedCreatorId: creatorId,
      capacityGapAddressed: course.description,
      certificateEligible: course.certificateEligible === "Yes",
      coverImageUrl: courseCoverImageUrl(course),
      defaultPassThreshold: CERTIFICATE_PASS_THRESHOLD,
      estimatedDurationMinutes: durationMinutes(course.duration),
      finalTestRequired: true,
      intendedPracticeImprovement: course.description,
      language: course.language,
      level: courseLevel(course),
      longDescription: course.description,
      shortDescription: course.description,
      status,
      targetAudience: course.audience,
      targetCsoProfile: course.audience,
      title: course.title,
      visibility,
    },
    where: {
      slug: course.slug,
    },
  });

  await seedCourseCapacityLink(courseRecord.id, capacityAreaId);
  await seedCourseOutcomes(courseRecord.id, outcomesForCourse(course));

  const version = await prisma.courseVersion.upsert({
    create: {
      changeNotes: "Phase 1 demo course content",
      courseId: courseRecord.id,
      createdById: creatorId,
      id: stableId("seed-version", course.id),
      publishedAt: status === CourseStatus.PUBLISHED ? demoSeedDate : null,
      publishedById: status === CourseStatus.PUBLISHED ? creatorId : null,
      status,
      versionNumber: 1,
    },
    update: {
      changeNotes: "Phase 1 demo course content",
      createdById: creatorId,
      publishedAt: status === CourseStatus.PUBLISHED ? demoSeedDate : null,
      publishedById: status === CourseStatus.PUBLISHED ? creatorId : null,
      status,
    },
    where: {
      courseId_versionNumber: {
        courseId: courseRecord.id,
        versionNumber: 1,
      },
    },
  });

  await seedModulesAndLessons(courseRecord.id, version.id, modulesForCourse(course));
  if (course.slug === DEMO_PROPOSAL_COURSE.slug) {
    await seedProposalContentBlocks(version.id);
  }
  await seedResources(course, courseRecord.id, version.id, creatorId);
  await seedFinalTest(course, version.id);

  return courseRecord;
}

async function seedRoles() {
  const roles = [];

  for (const role of roleSeed) {
    roles.push(
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
        where: {
          key: role.key,
        },
      }),
    );
  }

  return roles;
}

async function seedOrganizations() {
  const organizations = [];

  for (const organization of demoOrganizations) {
    organizations.push(
      await prisma.organization.upsert({
        create: {
          focalPersonEmail: organization.focalPersonEmail,
          focalPersonName: organization.focalPersonName,
          formalityStatus: organization.formalityStatus,
          id: stableId("seed-organization", organization.name),
          name: organization.name,
          notes: "Phase 1 demo organization for learning platform QA.",
          organizationTypeId: organization.organizationTypeId,
          region: organization.region,
          shortName: organization.shortName,
          status: OrganizationStatus.ACTIVE,
        },
        update: {
          focalPersonEmail: organization.focalPersonEmail,
          focalPersonName: organization.focalPersonName,
          formalityStatus: organization.formalityStatus,
          notes: "Phase 1 demo organization for learning platform QA.",
          organizationTypeId: organization.organizationTypeId,
          region: organization.region,
          shortName: organization.shortName,
          status: OrganizationStatus.ACTIVE,
        },
        where: {
          name: organization.name,
        },
      }),
    );
  }

  return organizations;
}

async function seedCohort(organizations: Awaited<ReturnType<typeof seedOrganizations>>) {
  const cohort = await prisma.cohort.upsert({
    create: {
      description: demoCohort.description,
      endDate: demoCohort.endDate,
      id: stableId("seed-cohort", demoCohort.name),
      name: demoCohort.name,
      programmeName: demoCohort.programmeName,
      region: demoCohort.region,
      startDate: demoCohort.startDate,
      status: OrganizationStatus.ACTIVE,
    },
    update: {
      description: demoCohort.description,
      endDate: demoCohort.endDate,
      programmeName: demoCohort.programmeName,
      region: demoCohort.region,
      startDate: demoCohort.startDate,
      status: OrganizationStatus.ACTIVE,
    },
    where: {
      name: demoCohort.name,
    },
  });

  for (const organization of organizations) {
    await prisma.cohortOrganization.upsert({
      create: {
        cohortId: cohort.id,
        id: stableId("seed-cohort-organization", `${cohort.id}-${organization.id}`),
        organizationId: organization.id,
      },
      update: {},
      where: {
        cohortId_organizationId: {
          cohortId: cohort.id,
          organizationId: organization.id,
        },
      },
    });
  }

  return cohort;
}

async function seedUsers(
  roles: Awaited<ReturnType<typeof seedRoles>>,
  organizations: Awaited<ReturnType<typeof seedOrganizations>>,
  cohort: Awaited<ReturnType<typeof seedCohort>>,
) {
  const organizationByName = new Map(
    organizations.map((organization) => [organization.name, organization]),
  );
  const roleByKey = new Map(roles.map((role) => [role.key, role]));
  const users = [];

  for (const user of demoUsers) {
    const organization =
      "organizationName" in user ? organizationByName.get(user.organizationName) : null;
    const isParticipantOrFocal =
      user.role === RoleKey.PARTICIPANT || user.role === RoleKey.CSO_FOCAL_PERSON;
    const record = await prisma.user.upsert({
      create: {
        email: user.email,
        fullName: user.fullName,
        id: user.id,
        organizationId: organization?.id,
        preferredLanguage: "English",
        primaryCohortId: isParticipantOrFocal ? cohort.id : null,
        region: organization?.region,
        status: UserStatus.ACTIVE,
      },
      update: {
        fullName: user.fullName,
        organizationId: organization?.id,
        preferredLanguage: "English",
        primaryCohortId: isParticipantOrFocal ? cohort.id : null,
        region: organization?.region,
        status: UserStatus.ACTIVE,
      },
      where: {
        email: user.email,
      },
    });

    users.push(record);
  }

  const userByEmail = new Map(users.map((user) => [user.email, user]));
  const superAdmin = userByEmail.get("superadmin@demo.local");

  if (!superAdmin) {
    throw new Error("Missing seeded Super Admin user.");
  }

  for (const user of demoUsers) {
    const record = userByEmail.get(user.email);
    const role = roleByKey.get(user.role);

    if (!record || !role) {
      throw new Error(`Missing seeded role assignment target for ${user.email}.`);
    }

    await prisma.userRoleAssignment.upsert({
      create: {
        assignedById: superAdmin.id,
        id: stableId("seed-user-role", `${record.id}-${role.id}`),
        isActive: true,
        roleId: role.id,
        userId: record.id,
      },
      update: {
        assignedById: superAdmin.id,
        isActive: true,
      },
      where: {
        userId_roleId: {
          roleId: role.id,
          userId: record.id,
        },
      },
    });
  }

  return users;
}

async function seedAccessFoundation() {
  const roles = await seedRoles();
  const organizations = await seedOrganizations();
  const cohort = await seedCohort(organizations);
  const users = await seedUsers(roles, organizations, cohort);
  const userByEmail = new Map(users.map((user) => [user.email, user]));

  const admin = userByEmail.get("admin@demo.local");
  const creator = userByEmail.get("creator@demo.local");
  const participantCompleted = userByEmail.get("participant2@demo.local");
  const participantInProgress = userByEmail.get("participant1@demo.local");

  if (!admin || !creator || !participantCompleted || !participantInProgress) {
    throw new Error("Missing required seeded demo users.");
  }

  return {
    admin,
    cohort,
    creator,
    organizations,
    participantCompleted,
    participantInProgress,
    roles,
    users,
  };
}

async function seedDemoCourses(creatorId: string) {
  const capacityAreas = await seedCapacityAreas();
  const capacityAreaByName = new Map(
    capacityAreas.map((capacityArea) => [capacityArea.name, capacityArea]),
  );
  const capacityAreaById = new Map(
    capacityAreas.map((capacityArea) => [capacityArea.id, capacityArea]),
  );
  const legacyDemoCapacityMap: Record<string, string> = {
    "Financial Management": "CAP-FIN",
    "Human Rights-Based Approach": "CAP-ADV",
    "MEAL": "CAP-MEAL",
    "Organizational Development": "CAP-GOV",
    "Proposal Development": "CAP-FIN",
    "Safeguarding": "CAP-HRSAFE",
  };

  const courses = [];

  for (const course of DEMO_COURSES) {
    const capacityArea =
      capacityAreaByName.get(course.capacityArea) ??
      capacityAreaById.get(legacyDemoCapacityMap[course.capacityArea] ?? "");

    if (!capacityArea) {
      throw new Error(`Missing capacity area: ${course.capacityArea}`);
    }

    courses.push(
      await seedCourseContent(course, creatorId, capacityArea.id),
    );
  }

  return courses;
}

async function getProposalCourseSpine() {
  const course = await prisma.course.findUnique({
    include: {
      versions: {
        include: {
          modules: {
            include: {
              lessons: {
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
          quizzes: {
            include: {
              questions: {
                orderBy: { order: "asc" },
              },
            },
            where: {
              isFinalTest: true,
            },
          },
        },
        orderBy: {
          versionNumber: "asc",
        },
      },
    },
    where: {
      slug: DEMO_PROPOSAL_COURSE.slug,
    },
  });

  const version = course?.versions[0];
  const quiz = version?.quizzes[0];

  if (!course || !version || !quiz) {
    throw new Error("Missing proposal course, version, or final test for participation seed.");
  }

  const lessons = version.modules.flatMap((module) => module.lessons);

  if (lessons.length === 0) {
    throw new Error("Missing proposal course lessons for participation seed.");
  }

  return {
    course,
    lessons,
    quiz,
    version,
  };
}

async function seedCourseAssignments(
  spine: Awaited<ReturnType<typeof getProposalCourseSpine>>,
  access: Awaited<ReturnType<typeof seedAccessFoundation>>,
) {
  await prisma.courseAssignment.upsert({
    create: {
      assignedById: access.admin.id,
      assignmentType: "COHORT",
      courseId: spine.course.id,
      id: stableId("seed-course-assignment", `${spine.course.id}-${access.cohort.id}`),
      isActive: true,
      targetCohortId: access.cohort.id,
    },
    update: {
      assignedById: access.admin.id,
      isActive: true,
      targetCohortId: access.cohort.id,
    },
    where: {
      id: stableId("seed-course-assignment", `${spine.course.id}-${access.cohort.id}`),
    },
  });

  for (const organization of access.organizations) {
    await prisma.courseAssignment.upsert({
      create: {
        assignedById: access.admin.id,
        assignmentType: "ORGANIZATION",
        courseId: spine.course.id,
        id: stableId("seed-course-assignment", `${spine.course.id}-${organization.id}`),
        isActive: true,
        targetOrganizationId: organization.id,
      },
      update: {
        assignedById: access.admin.id,
        isActive: true,
        targetOrganizationId: organization.id,
      },
      where: {
        id: stableId("seed-course-assignment", `${spine.course.id}-${organization.id}`),
      },
    });
  }
}

async function seedEnrollmentWithLessonProgress({
  completedAt,
  courseId,
  courseVersionId,
  lastAccessedAt,
  lessons,
  progressPercent,
  startedAt,
  status,
  userId,
}: {
  completedAt: Date | null;
  courseId: string;
  courseVersionId: string;
  lastAccessedAt: Date;
  lessons: Awaited<ReturnType<typeof getProposalCourseSpine>>["lessons"];
  progressPercent: number;
  startedAt: Date;
  status: EnrollmentStatus;
  userId: string;
}) {
  const enrollment = await prisma.enrollment.upsert({
    create: {
      completedAt,
      courseId,
      courseVersionId,
      enrolledAt: demoSeedDate,
      id: stableId("seed-enrollment", `${userId}-${courseVersionId}`),
      lastAccessedAt,
      progressPercent,
      startedAt,
      status,
      userId,
    },
    update: {
      completedAt,
      lastAccessedAt,
      progressPercent,
      startedAt,
      status,
    },
    where: {
      userId_courseVersionId: {
        courseVersionId,
        userId,
      },
    },
  });

  for (const [index, lesson] of lessons.entries()) {
    const isCompletedEnrollment = status === EnrollmentStatus.COMPLETED;
    const lessonStatus = isCompletedEnrollment
      ? LessonProgressStatus.COMPLETED
      : index === 0
        ? LessonProgressStatus.COMPLETED
        : index === 1
          ? LessonProgressStatus.IN_PROGRESS
          : LessonProgressStatus.NOT_STARTED;
    const lessonStartedAt =
      lessonStatus === LessonProgressStatus.NOT_STARTED ? null : startedAt;
    const lessonCompletedAt =
      lessonStatus === LessonProgressStatus.COMPLETED ? completedAt ?? lastAccessedAt : null;

    await prisma.lessonProgress.upsert({
      create: {
        completedAt: lessonCompletedAt,
        enrollmentId: enrollment.id,
        id: stableId("seed-lesson-progress", `${enrollment.id}-${lesson.id}`),
        lastAccessedAt: lessonStartedAt ? lastAccessedAt : null,
        lessonId: lesson.id,
        progressJson: {
          source: "Phase 1 demo seed",
        },
        startedAt: lessonStartedAt,
        status: lessonStatus,
      },
      update: {
        completedAt: lessonCompletedAt,
        lastAccessedAt: lessonStartedAt ? lastAccessedAt : null,
        progressJson: {
          source: "Phase 1 demo seed",
        },
        startedAt: lessonStartedAt,
        status: lessonStatus,
      },
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
      },
    });
  }

  return enrollment;
}

async function seedQuizAttemptAndCertificate(
  spine: Awaited<ReturnType<typeof getProposalCourseSpine>>,
  access: Awaited<ReturnType<typeof seedAccessFoundation>>,
  enrollment: Awaited<ReturnType<typeof seedEnrollmentWithLessonProgress>>,
) {
  const submittedAt = new Date("2026-04-25T12:00:00.000Z");
  const maxScore = spine.quiz.questions.reduce(
    (total, question) => total + question.points,
    0,
  );
  const attemptId = stableId(
    "seed-quiz-attempt",
    `${access.participantCompleted.id}-${spine.quiz.id}-passed`,
  );
  const quizAttempt = await prisma.quizAttempt.upsert({
    create: {
      answersJson: {
        answers: spine.quiz.questions.map((question) => ({
          questionId: question.id,
          selected: "correct",
        })),
      },
      courseId: spine.course.id,
      courseVersionId: spine.version.id,
      id: attemptId,
      maxScore,
      passed: true,
      percentage: 100,
      quizId: spine.quiz.id,
      score: maxScore,
      startedAt: new Date("2026-04-25T11:45:00.000Z"),
      status: QuizAttemptStatus.PASSED,
      submittedAt,
      userId: access.participantCompleted.id,
    },
    update: {
      answersJson: {
        answers: spine.quiz.questions.map((question) => ({
          questionId: question.id,
          selected: "correct",
        })),
      },
      maxScore,
      passed: true,
      percentage: 100,
      score: maxScore,
      status: QuizAttemptStatus.PASSED,
      submittedAt,
    },
    where: {
      id: attemptId,
    },
  });

  await prisma.certificate.upsert({
    create: {
      certificateCode: "CSOLH-DEMO-0001",
      completionDate: enrollment.completedAt,
      courseId: spine.course.id,
      courseTitleSnapshot: spine.course.title,
      courseVersionId: spine.version.id,
      enrollmentId: enrollment.id,
      id: "seed-certificate-csolh-demo-0001",
      issuedAt: submittedAt,
      issuerNameSnapshot: "Development Expertise Center",
      participantNameSnapshot: access.participantCompleted.fullName,
      pdfUrl: null,
      quizAttemptId: quizAttempt.id,
      status: CertificateStatus.ISSUED,
      userId: access.participantCompleted.id,
    },
    update: {
      completionDate: enrollment.completedAt,
      courseId: spine.course.id,
      courseTitleSnapshot: spine.course.title,
      courseVersionId: spine.version.id,
      enrollmentId: enrollment.id,
      issuedAt: submittedAt,
      issuerNameSnapshot: "Development Expertise Center",
      participantNameSnapshot: access.participantCompleted.fullName,
      pdfUrl: null,
      quizAttemptId: quizAttempt.id,
      status: CertificateStatus.ISSUED,
      userId: access.participantCompleted.id,
    },
    where: {
      certificateCode: "CSOLH-DEMO-0001",
    },
  });
}

async function seedFeedback(
  spine: Awaited<ReturnType<typeof getProposalCourseSpine>>,
  access: Awaited<ReturnType<typeof seedAccessFoundation>>,
) {
  const feedbackRecords = [
    {
      accessibilityIssue: false,
      clarityRating: 4,
      comment:
        "The examples helped me understand how to connect a problem with an objective.",
      id: "seed-feedback-participant-completed-proposal",
      rating: 5,
      usefulnessRating: 5,
      userId: access.participantCompleted.id,
    },
    {
      accessibilityIssue: false,
      clarityRating: 4,
      comment: "The checklist is useful. More examples in Amharic would help.",
      id: "seed-feedback-participant-in-progress-proposal",
      rating: 4,
      usefulnessRating: 4,
      userId: access.participantInProgress.id,
    },
  ] as const;

  for (const feedback of feedbackRecords) {
    await prisma.feedback.upsert({
      create: {
        accessibilityIssue: feedback.accessibilityIssue,
        clarityRating: feedback.clarityRating,
        comment: feedback.comment,
        courseId: spine.course.id,
        id: feedback.id,
        rating: feedback.rating,
        type: FeedbackType.COURSE_FEEDBACK,
        usefulnessRating: feedback.usefulnessRating,
        userId: feedback.userId,
      },
      update: {
        accessibilityIssue: feedback.accessibilityIssue,
        clarityRating: feedback.clarityRating,
        comment: feedback.comment,
        courseId: spine.course.id,
        rating: feedback.rating,
        type: FeedbackType.COURSE_FEEDBACK,
        usefulnessRating: feedback.usefulnessRating,
        userId: feedback.userId,
      },
      where: {
        id: feedback.id,
      },
    });
  }
}

async function seedAuditLogs(
  spine: Awaited<ReturnType<typeof getProposalCourseSpine>>,
  access: Awaited<ReturnType<typeof seedAccessFoundation>>,
) {
  const auditEvents = [
    {
      actionType: AuditActionType.USER_CREATED,
      description: "Super Admin created Platform Admin Demo.",
      entityId: access.admin.id,
      entityType: "User",
      id: "seed-audit-user-created-platform-admin",
    },
    {
      actionType: AuditActionType.ORGANIZATION_CREATED,
      description: "Platform Admin created Hiwot Community Development Association.",
      entityId: access.organizations[0].id,
      entityType: "Organization",
      id: "seed-audit-organization-created-hcda",
    },
    {
      actionType: AuditActionType.COHORT_CREATED,
      description: "Platform Admin created CSF+ Grassroots Cohort 1.",
      entityId: access.cohort.id,
      entityType: "Cohort",
      id: "seed-audit-cohort-created-grassroots-1",
    },
    {
      actionType: AuditActionType.COURSE_CREATED,
      description: "Course Creator created a draft proposal development course.",
      entityId: spine.course.id,
      entityType: "Course",
      id: "seed-audit-course-created-proposal",
    },
    {
      actionType: AuditActionType.COURSE_SUBMITTED_FOR_REVIEW,
      description: "Course Creator submitted the proposal development course for review.",
      entityId: spine.course.id,
      entityType: "Course",
      id: "seed-audit-course-submitted-proposal",
    },
    {
      actionType: AuditActionType.COURSE_APPROVED,
      description: "Course Reviewer approved the proposal development course.",
      entityId: spine.course.id,
      entityType: "Course",
      id: "seed-audit-course-approved-proposal",
    },
    {
      actionType: AuditActionType.COURSE_PUBLISHED,
      description: "Platform Admin published the proposal development course.",
      entityId: spine.course.id,
      entityType: "Course",
      id: "seed-audit-course-published-proposal",
    },
    {
      actionType: AuditActionType.COURSE_UPDATED,
      description: "Participant Completed completed the proposal development course.",
      entityId: spine.course.id,
      entityType: "Enrollment",
      id: "seed-audit-course-completed-participant",
    },
    {
      actionType: AuditActionType.CERTIFICATE_ISSUED,
      description: "Certificate issued for Participant Completed.",
      entityId: "CSOLH-DEMO-0001",
      entityType: "Certificate",
      id: "seed-audit-certificate-issued-demo-0001",
    },
  ] as const;

  for (const event of auditEvents) {
    await prisma.auditLog.upsert({
      create: {
        actionType: event.actionType,
        actorUserId: access.admin.id,
        description: event.description,
        entityId: event.entityId,
        entityType: event.entityType,
        id: event.id,
        metadataJson: {
          source: "Phase 1 demo seed",
        },
      },
      update: {
        actionType: event.actionType,
        actorUserId: access.admin.id,
        description: event.description,
        entityId: event.entityId,
        entityType: event.entityType,
        metadataJson: {
          source: "Phase 1 demo seed",
        },
      },
      where: {
        id: event.id,
      },
    });
  }
}

async function seedParticipationFoundation(
  access: Awaited<ReturnType<typeof seedAccessFoundation>>,
) {
  const spine = await getProposalCourseSpine();
  await seedCourseAssignments(spine, access);

  await seedEnrollmentWithLessonProgress({
    completedAt: null,
    courseId: spine.course.id,
    courseVersionId: spine.version.id,
    lastAccessedAt: new Date("2026-04-12T09:30:00.000Z"),
    lessons: spine.lessons,
    progressPercent: 40,
    startedAt: new Date("2026-04-10T09:00:00.000Z"),
    status: EnrollmentStatus.IN_PROGRESS,
    userId: access.participantInProgress.id,
  });

  const completedEnrollment = await seedEnrollmentWithLessonProgress({
    completedAt: new Date("2026-04-25T12:10:00.000Z"),
    courseId: spine.course.id,
    courseVersionId: spine.version.id,
    lastAccessedAt: new Date("2026-04-25T12:10:00.000Z"),
    lessons: spine.lessons,
    progressPercent: 100,
    startedAt: new Date("2026-04-15T10:00:00.000Z"),
    status: EnrollmentStatus.COMPLETED,
    userId: access.participantCompleted.id,
  });

  await seedQuizAttemptAndCertificate(spine, access, completedEnrollment);
  await seedFeedback(spine, access);
  await seedAuditLogs(spine, access);
}

async function seedOnboardingInvitations() {
  const inviter = await prisma.user.findUnique({
    select: { id: true },
    where: { email: "superadmin@demo.local" },
  });
  if (!inviter) {
    throw new Error("Unable to seed onboarding invitations without super admin.");
  }

  const invitations = [
    {
      email: "invitedcreator@demo.local",
      role: RoleKey.COURSE_CREATOR,
      tokenHash: crypto.createHash("sha256").update("test_onboarding_token_valid").digest("hex"),
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
    {
      email: "expiredinvite@demo.local",
      role: RoleKey.COURSE_REVIEWER,
      tokenHash: crypto.createHash("sha256").update("test_onboarding_token_expired").digest("hex"),
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  for (const invitation of invitations) {
    await prisma.onboardingInvitation.upsert({
      create: {
        attemptCount: 0,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        invitedByUserId: inviter.id,
        role: invitation.role,
        tokenHash: invitation.tokenHash,
      },
      update: {
        attemptCount: 0,
        completedAt: null,
        expiresAt: invitation.expiresAt,
        invitedByUserId: inviter.id,
        role: invitation.role,
        tokenHash: invitation.tokenHash,
        usedAt: null,
      },
      where: {
        email: invitation.email,
      },
    });
  }
}

async function main() {
  await seedCsvReferenceData();
  await seedReferenceDataItems();
  const access = await seedAccessFoundation();
  const courses = await seedDemoCourses(access.creator.id);
  await seedParticipationFoundation(access);
  await seedOnboardingInvitations();
  const publicPublishedCount = await prisma.course.count({
    where: {
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.PUBLIC,
    },
  });

  console.log(
    JSON.stringify(
      {
        auditEvents: await prisma.auditLog.count(),
        certificates: await prisma.certificate.count(),
        contentBlocks: await prisma.contentBlock.count(),
        coursesSeeded: courses.length,
        databaseConfigured: Boolean(process.env.DATABASE_URL),
        defaultPassThreshold: CERTIFICATE_PASS_THRESHOLD,
        enrollments: await prisma.enrollment.count(),
        feedbackRecords: await prisma.feedback.count(),
        organizations: await prisma.organization.count(),
        participants: await prisma.user.count({
          where: {
            roleAssignments: {
              some: {
                isActive: true,
                role: {
                  key: RoleKey.PARTICIPANT,
                },
              },
            },
          },
        }),
        publicPublishedCourses: publicPublishedCount,
        quizAttempts: await prisma.quizAttempt.count(),
        referenceDataItems: await prisma.referenceDataItem.count(),
        roles: await prisma.role.count(),
        users: await prisma.user.count(),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
