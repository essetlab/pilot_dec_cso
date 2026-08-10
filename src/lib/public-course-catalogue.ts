import "server-only";

import {
  getHrbaExternalCourseAllowedOrigins,
  getHrbaExternalCourseUrl,
  getPmExternalCourseAllowedOrigins,
  getPmExternalCourseUrl,
} from "./external-course-config";
import { PILOT_CATALOGUE_COURSE_IDENTITIES } from "./catalogue-course-identities";
import type {
  CatalogueAvailability,
  CatalogueAccessState,
  CatalogueCapacityArea,
  CatalogueIntegrationStatus,
  CatalogueLaunchMode,
  CourseTone,
  PublicCatalogueCourseDetail,
  PublicCatalogueCourseSummary,
  PublicCatalogueModule,
  PublicCourseDetail,
  PublicCourseSummary,
} from "./course-types";

export const HRBA_COURSE_TITLE =
  "Applying the Human Rights-Based Approach in CSO Practice";

export const HRBA_COURSE_PROMISE =
  "Apply human rights-based thinking to everyday CSO programme work by strengthening participation, inclusion, accountability, dignity, and safe evidence use.";

export const HRBA_COURSE_OVERVIEW = [
  HRBA_COURSE_PROMISE,
  "This course helps local and grassroots CSO programme teams apply HRBA in practical decisions across everyday work. It focuses on rights-holders, duty-bearers, participation, inclusion, accountability, non-discrimination, power and barriers, safe evidence, and project-cycle decisions.",
  "Learners complete the required learning activities and final assessment through the existing Hub-supported course flow. Certificate eligibility requires course completion and a final assessment score of 80% or above.",
].join("\n\n");

export const HRBA_LEARNING_OUTCOMES = [
  "Identify rights-holders, duty-bearers, and supporting actors in practical CSO situations.",
  "Recognize barriers to participation, access, information, and accountability.",
  "Apply HRBA principles to project design and implementation choices.",
  "Use safe, practical analysis without exposing people or sensitive information.",
  "Prepare for a final assessment linked to HRBA practice.",
];

export const HRBA_MODULES: PublicCatalogueModule[] = [
  {
    title: "HRBA foundations",
    topics: [
      "Rights-holders, duty-bearers, and supporting actors",
      "Participation, inclusion, and non-discrimination",
    ],
  },
  {
    title: "Applying HRBA in CSO work",
    topics: [
      "Power, barriers, and accountability in practice",
      "Safe evidence for project-cycle decisions",
    ],
  },
  {
    title: "Final assessment and certificate",
    topics: ["Final assessment", "Certificate and continued learning"],
  },
];

export const PM_COURSE_PROMISE =
  "Build practical skills to identify, set up, plan, implement, monitor, and close projects with local and grassroots CSO teams.";

export const PM_LEARNING_OUTCOMES = [
  "Define community needs, analyze problems and causes, and map stakeholders using participatory evidence.",
  "Establish project governance, roles, tolerances, and an accountable Project Charter.",
  "Develop a Work Breakdown Structure, RACI matrix, schedule, and bottom-up budget.",
  "Manage issues, changes, monitoring, burn rate, and active project risks.",
  "Verify deliverables, complete administrative closeout, hand over sustainably, and document learning.",
];

export const PM_MODULES: PublicCatalogueModule[] = [
  { title: "Project identification", topics: ["Needs and evidence", "Problem analysis and stakeholders"] },
  { title: "Project setup", topics: ["Governance and accountability", "Tolerances and Project Charter"] },
  { title: "Project planning", topics: ["WBS, RACI, and schedule", "Costing and budget"] },
  { title: "Project implementation", topics: ["Issue and change control", "Monitoring, burn rate, and risk"] },
  { title: "Project closure", topics: ["Verification and administrative closeout", "Handover, sustainability, and learning"] },
];

const CONTROLLED_CAPACITY_AREAS = [
  {
    id: "CAP-GOV",
    name: "Internal Governance and Leadership",
  },
  {
    id: "CAP-ACC",
    name: "Transparency and Accountability",
  },
  {
    id: "CAP-STRAT",
    name: "Strategic Planning and Organizational Sustainability",
  },
  {
    id: "CAP-FIN",
    name: "Financial Management and Resource Mobilization",
  },
  {
    id: "CAP-HRSAFE",
    name: "Human Resources, Inclusion, and Safeguarding",
  },
  {
    id: "CAP-ADV",
    name: "Evidence-Based Advocacy and Civic Engagement",
  },
  {
    id: "CAP-MEAL",
    name: "Monitoring, Evaluation, Accountability, and Learning",
  },
  {
    id: "CAP-DIG",
    name: "Digital Skills and Data Use",
  },
  {
    id: "CAP-PART",
    name: "Networking, Partnerships, and Collective Action",
  },
] as const satisfies readonly CatalogueCapacityArea[];

export const PUBLIC_CATALOGUE_CAPACITY_AREAS: CatalogueCapacityArea[] =
  CONTROLLED_CAPACITY_AREAS.map((area) => ({ ...area }));

const capacityAreaById = new Map(
  PUBLIC_CATALOGUE_CAPACITY_AREAS.map((area) => [area.id, area]),
);

function capacityArea(id: string) {
  const area = capacityAreaById.get(id);

  if (!area) {
    throw new Error(`Unknown controlled CapacityArea ID: ${id}`);
  }

  return area;
}

export type ExternalCourseIntegrationContract = {
  approvedOrigins: string[];
  assessmentCapability: "available" | "not_confirmed";
  certificateEligibility: "eligible" | "not_confirmed";
  completionRule: string | null;
  courseVersion: string | null;
  externalUrl: string | null;
  launchMode: CatalogueLaunchMode;
  progressTrackingCapability: "hub_tracked" | "not_available";
};

type CatalogueCourseDefinition = {
  accessState: CatalogueAccessState;
  assessmentStatus: string;
  availability: CatalogueAvailability;
  certificateStatus: string;
  deliveryFormat: string;
  displayOrder: number;
  externalCourse: ExternalCourseIntegrationContract;
  featured: boolean;
  fullDescription: string;
  imageAlt: string;
  imageUrl: string | null;
  integrationStatus: CatalogueIntegrationStatus;
  intendedLearners: string;
  language: string;
  learningApproach: string[];
  learningOutcomes: string[];
  legacyAliases: string[];
  modules: PublicCatalogueModule[];
  practicalOutputs: string[];
  primaryCapacityAreaId: string;
  proposedStructureSummary: string;
  resourcesAndSupport: string;
  routeAliases: string[];
  secondaryCapacityAreaIds: readonly string[];
  shortDescription: string;
  slug: string;
  title: string;
  tone: CourseTone;
};

const COMING_SOON_DURATION = "To be confirmed";
const COMING_SOON_FORMAT = "Course format to be confirmed";
const COMING_SOON_LANGUAGE = "To be confirmed";
const COMING_SOON_AUDIENCE =
  "Local and grassroots CSO practitioners. The detailed learner profile will be confirmed with the approved course design.";
const COMING_SOON_OVERVIEW =
  "This public overview records the confirmed catalogue position and capacity-area alignment. Detailed learning content will be added after course design and integration are approved.";
const COMING_SOON_STRUCTURE =
  "The proposed course structure is being prepared and has not yet been published.";
const COMING_SOON_SUPPORT =
  "Course resources and support arrangements will be published when the course is ready.";

function comingSoonExternalCourse(
  launchMode: CatalogueLaunchMode = "unconfigured",
): ExternalCourseIntegrationContract {
  return {
    approvedOrigins: [],
    assessmentCapability: "not_confirmed",
    certificateEligibility: "not_confirmed",
    completionRule: null,
    courseVersion: null,
    externalUrl: null,
    launchMode,
    progressTrackingCapability: "not_available",
  };
}

function comingSoonCourse(
  definition: Pick<
    CatalogueCourseDefinition,
    | "displayOrder"
    | "imageAlt"
    | "imageUrl"
    | "integrationStatus"
    | "legacyAliases"
    | "primaryCapacityAreaId"
    | "secondaryCapacityAreaIds"
    | "shortDescription"
    | "slug"
    | "title"
    | "tone"
  > & {
    externalCourse?: ExternalCourseIntegrationContract;
  },
): CatalogueCourseDefinition {
  return {
    accessState: "coming_soon",
    assessmentStatus: "Assessment approach not yet confirmed",
    availability: "coming_soon",
    certificateStatus: "Certificate status not yet confirmed",
    deliveryFormat: COMING_SOON_FORMAT,
    displayOrder: definition.displayOrder,
    externalCourse:
      definition.externalCourse ?? comingSoonExternalCourse(),
    featured: false,
    fullDescription: COMING_SOON_OVERVIEW,
    imageAlt: definition.imageAlt,
    imageUrl: definition.imageUrl,
    integrationStatus: definition.integrationStatus,
    intendedLearners: COMING_SOON_AUDIENCE,
    language: COMING_SOON_LANGUAGE,
    learningApproach: [],
    learningOutcomes: [],
    legacyAliases: definition.legacyAliases,
    modules: [],
    practicalOutputs: [],
    primaryCapacityAreaId: definition.primaryCapacityAreaId,
    proposedStructureSummary: COMING_SOON_STRUCTURE,
    resourcesAndSupport: COMING_SOON_SUPPORT,
    routeAliases: [],
    secondaryCapacityAreaIds: definition.secondaryCapacityAreaIds,
    shortDescription: definition.shortDescription,
    slug: definition.slug,
    title: definition.title,
    tone: definition.tone,
  };
}

export const PUBLIC_COURSE_CATALOGUE: readonly CatalogueCourseDefinition[] = [
  {
    ...PILOT_CATALOGUE_COURSE_IDENTITIES[0],
    accessState: "available_open",
    assessmentStatus:
      "Existing final assessment; certificate eligibility requires a score of 80% or above.",
    availability: "available",
    certificateStatus:
      "Certificate available after the required learning and assessment are completed.",
    deliveryFormat: "Hub-tracked embedded course",
    externalCourse: {
      approvedOrigins: getHrbaExternalCourseAllowedOrigins(),
      assessmentCapability: "available",
      certificateEligibility: "eligible",
      completionRule:
        "Complete the required learning and pass the final assessment with 80% or above.",
      courseVersion: "Existing active HRBA course version",
      externalUrl: getHrbaExternalCourseUrl(),
      launchMode: "embedded",
      progressTrackingCapability: "hub_tracked",
    },
    featured: true,
    fullDescription: HRBA_COURSE_OVERVIEW,
    imageAlt: "Diverse CSO practitioners reviewing a community map together around a table.",
    imageUrl: "/images/courses/thumbnails/course-hrba-practice-thumbnail-v2.webp",
    integrationStatus: "integrated",
    intendedLearners:
      "Local and grassroots CSO staff, focal persons, facilitators, and programme teams applying HRBA in practical project work.",
    language: "English",
    learningApproach: [
      "Short explanations and practical examples",
      "Guided reflection and realistic decisions",
      "Knowledge checks and a final assessment",
      "Hub-tracked progress through the existing embedded course",
    ],
    learningOutcomes: HRBA_LEARNING_OUTCOMES,
    legacyAliases: [
      "Human Rights-Based Approach",
      "HRBA",
      "human-rights-based-approach-practice",
    ],
    modules: HRBA_MODULES,
    practicalOutputs: [
      "Private reflection and analysis for the learner's own CSO practice",
    ],
    proposedStructureSummary:
      "The active course follows the existing HRBA modules, assessment, progress, and certificate flow.",
    resourcesAndSupport:
      "Course-linked resources are available inside the active HRBA learning experience. Hub support remains available through the public Support page.",
    routeAliases: ["human-rights-based-approach-practice"],
    shortDescription: HRBA_COURSE_PROMISE,
    tone: "blue",
  },
  comingSoonCourse({
    ...PILOT_CATALOGUE_COURSE_IDENTITIES[1],
    imageAlt: "Local CSO leaders discussing organizational direction around a shared planning map.",
    imageUrl: "/images/courses/thumbnails/course-lead-accountability-clear-direction-thumbnail.webp",
    integrationStatus: "content_preparation",
    legacyAliases: ["Governance", "Organizational Development"],
    shortDescription:
      "A forthcoming course on accountable leadership, governance practice, and organizational direction for local CSOs.",
    tone: "navy",
  }),
  {
    ...PILOT_CATALOGUE_COURSE_IDENTITIES[2],
    accessState: "invitation_required",
    assessmentStatus: "The course includes a 25-question final assessment with an 80% pass threshold.",
    availability: "available",
    certificateStatus: "Certificate eligibility requires completing the course and passing the final assessment.",
    deliveryFormat: "Hub-tracked embedded course",
    externalCourse: {
      approvedOrigins: getPmExternalCourseAllowedOrigins(),
      assessmentCapability: "available",
      certificateEligibility: "eligible",
      completionRule: "Complete the required learning and pass the final assessment with 80% or above.",
      courseVersion: "Approved 32-screen Project Management pilot baseline",
      externalUrl: getPmExternalCourseUrl(),
      launchMode: "embedded",
      progressTrackingCapability: "hub_tracked",
    },
    featured: false,
    fullDescription: `${PM_COURSE_PROMISE}\n\nThis practical 90-minute course follows five connected phases: identification, setup, planning, implementation, and closure. Learners apply the concepts through the Haro Valley case and practical CSO project decisions.`,
    imageAlt: "CSO practitioners mapping a project pathway from community needs to results.",
    imageUrl: "/images/courses/thumbnails/course-project-management-thumbnail-v2.webp",
    integrationStatus: "integrated",
    intendedLearners: "Local and grassroots CSO practitioners responsible for planning, delivering, monitoring, and closing projects.",
    language: "English",
    learningApproach: [
      "Short explanations grounded in the Haro Valley case",
      "Practical decisions, calculations, and interactive checks",
      "Module tools and a final assessment",
      "Hub-tracked screen progress and exact resume",
    ],
    learningOutcomes: PM_LEARNING_OUTCOMES,
    legacyAliases: ["Project Cycle Management", "Project Management"],
    modules: PM_MODULES,
    practicalOutputs: ["A practical project-management tool pack introduced across the five modules"],
    proposedStructureSummary: "The active course contains 32 canonical screens across the course introduction, five modules, final assessment, and completion.",
    resourcesAndSupport: "Course-linked resources are available inside the Project Management course. Hub support remains available through the public Support page.",
    routeAliases: [],
    shortDescription: PM_COURSE_PROMISE,
    tone: "green",
  },
  comingSoonCourse({
    ...PILOT_CATALOGUE_COURSE_IDENTITIES[3],
    imageAlt: "CSO practitioners reviewing community evidence through a continuous learning cycle.",
    imageUrl: "/images/courses/thumbnails/course-meal-reporting-to-learning-thumbnail.webp",
    integrationStatus: "content_preparation",
    legacyAliases: ["MEAL", "Monitoring and Evaluation"],
    shortDescription:
      "A forthcoming course on using monitoring, evaluation, accountability, and learning to strengthen CSO decisions.",
    tone: "blue",
  }),
  comingSoonCourse({
    ...PILOT_CATALOGUE_COURSE_IDENTITIES[4],
    imageAlt: "A local CSO team reviewing financial records, controls, and compliance steps together.",
    imageUrl: "/images/courses/thumbnails/course-financial-management-compliance-thumbnail.webp",
    integrationStatus: "content_preparation",
    legacyAliases: ["Financial Management", "Compliance"],
    shortDescription:
      "A forthcoming course on responsible financial management, accountability, and compliance in local CSO practice.",
    tone: "green",
  }),
  comingSoonCourse({
    ...PILOT_CATALOGUE_COURSE_IDENTITIES[5],
    imageAlt: "A CSO team planning a long-term organizational pathway across a community landscape.",
    imageUrl: "/images/courses/thumbnails/course-strategic-planning-sustainability-thumbnail.webp",
    integrationStatus: "content_preparation",
    legacyAliases: ["Organizational Development", "Strategic Planning"],
    shortDescription:
      "A forthcoming course on strategic direction, adaptation, and organizational sustainability for local CSOs.",
    tone: "navy",
  }),
  comingSoonCourse({
    ...PILOT_CATALOGUE_COURSE_IDENTITIES[6],
    imageAlt: "An inclusive group of CSO practitioners building trust through supportive conversation.",
    imageUrl: "/images/courses/thumbnails/course-people-inclusion-safeguarding-thumbnail.webp",
    integrationStatus: "content_preparation",
    legacyAliases: ["Safeguarding", "Human Resources", "Inclusion"],
    shortDescription:
      "A forthcoming course on people practice, inclusion, safeguarding, and duty of care in CSO work.",
    tone: "gold",
  }),
  comingSoonCourse({
    ...PILOT_CATALOGUE_COURSE_IDENTITIES[7],
    imageAlt: "CSO practitioners using a tablet, notebooks, and secure records for responsible data work.",
    imageUrl: "/images/courses/thumbnails/course-digital-skills-data-use-thumbnail.webp",
    integrationStatus: "content_preparation",
    legacyAliases: ["Digital Skills", "Data Use"],
    shortDescription:
      "A forthcoming course on responsible digital practice and data use for local CSO teams.",
    tone: "blue",
  }),
  comingSoonCourse({
    ...PILOT_CATALOGUE_COURSE_IDENTITIES[8],
    imageAlt: "CSO practitioners connecting organizations and communities through a shared network map.",
    imageUrl: "/images/courses/thumbnails/course-partnerships-networks-collective-action-thumbnail.webp",
    integrationStatus: "content_preparation",
    legacyAliases: [
      "Partnership and Networking",
      "Networks",
      "Collective Action",
    ],
    shortDescription:
      "A forthcoming course on partnerships, networks, and collective action for local CSOs.",
    tone: "green",
  }),
];

function matchesDefinitionSlug(
  definition: CatalogueCourseDefinition,
  slug: string,
) {
  return (
    definition.slug === slug ||
    definition.routeAliases.includes(slug)
  );
}

export function getCatalogueCourseDefinition(slug: string) {
  return (
    PUBLIC_COURSE_CATALOGUE.find((definition) =>
      matchesDefinitionSlug(definition, slug),
    ) ?? null
  );
}

export function isComingSoonCatalogueSlug(slug: string) {
  return (
    getCatalogueCourseDefinition(slug)?.availability === "coming_soon"
  );
}

function definitionCapacityAreas(definition: CatalogueCourseDefinition) {
  const primaryCapacityArea = capacityArea(definition.primaryCapacityAreaId);
  const secondaryCapacityAreas = definition.secondaryCapacityAreaIds.map(
    capacityArea,
  );

  return {
    accessState: definition.accessState,
    capacityAreas: [primaryCapacityArea, ...secondaryCapacityAreas],
    primaryCapacityArea,
    secondaryCapacityAreas,
  };
}

export function toPublicCatalogueSummary(
  definition: CatalogueCourseDefinition,
  existingCourse: PublicCourseSummary | null = null,
): PublicCatalogueCourseSummary {
  const areas = definitionCapacityAreas(definition);
  const isAvailable = definition.availability === "available";
  const existingSlug = isAvailable && existingCourse
    ? existingCourse.slug
    : definition.slug;

  return {
    availability: definition.availability,
    ...areas,
    certificateLabel: isAvailable
      ? existingCourse?.certificate ?? definition.certificateStatus
      : definition.certificateStatus,
    deliveryFormat: definition.deliveryFormat,
    displayOrder: definition.displayOrder,
    duration: isAvailable
      ? existingCourse?.duration ?? "90 minutes"
      : COMING_SOON_DURATION,
    featured: definition.featured,
    href: `/courses/${existingSlug}`,
    imageAlt: existingCourse?.imageAlt ?? definition.imageAlt,
    imageUrl: definition.imageUrl ?? existingCourse?.imageUrl ?? null,
    integrationStatus: definition.integrationStatus,
    language: isAvailable
      ? existingCourse?.language ?? definition.language
      : definition.language,
    launchMode: definition.externalCourse.launchMode,
    primaryCapacityArea: areas.primaryCapacityArea,
    secondaryCapacityAreas: areas.secondaryCapacityAreas,
    shortDescription: isAvailable
      ? existingCourse?.description ?? definition.shortDescription
      : definition.shortDescription,
    slug: existingSlug,
    title: definition.title,
    tone: existingCourse?.tone ?? definition.tone,
  };
}

export function getPublicCatalogueSummaries(
  existingCourses: ReadonlyMap<string, PublicCourseSummary> = new Map(),
) {
  return PUBLIC_COURSE_CATALOGUE.map((definition) =>
    toPublicCatalogueSummary(
      definition,
      definition.availability === "available"
        ? existingCourses.get(definition.slug) ?? null
        : null,
    ),
  );
}

export function toPublicCatalogueDetail(
  definition: CatalogueCourseDefinition,
  existingHrba: PublicCourseDetail | null = null,
): PublicCatalogueCourseDetail {
  const summary = toPublicCatalogueSummary(definition, existingHrba);
  const isAvailable = definition.availability === "available";
  const fullDescription = isAvailable
    ? existingHrba?.longDescription ?? definition.fullDescription
    : definition.fullDescription;
  const learningOutcomes = isAvailable
    ? existingHrba?.outcomes ?? definition.learningOutcomes
    : definition.learningOutcomes;

  return {
    ...summary,
    assessmentStatus: definition.assessmentStatus,
    certificateStatus: definition.certificateStatus,
    completionRule: definition.externalCourse.completionRule,
    externalUrl: definition.externalCourse.externalUrl,
    fullDescription,
    intendedLearners: isAvailable
      ? existingHrba?.audience ?? definition.intendedLearners
      : definition.intendedLearners,
    learningApproach: definition.learningApproach,
    learningOutcomes,
    longDescription: fullDescription,
    modules: isAvailable && existingHrba
      ? existingHrba.modules.map((module) => ({
          title: module.title,
          topics: module.lessons,
        }))
      : definition.modules,
    outcomes: learningOutcomes,
    openBehavior:
      definition.externalCourse.launchMode === "external_link"
        ? "new_tab"
        : definition.externalCourse.launchMode === "unconfigured"
          ? null
          : "inside_hub",
    practicalOutputs: definition.practicalOutputs,
    progressTrackingCapability:
      definition.externalCourse.progressTrackingCapability === "hub_tracked"
        ? "Hub-tracked progress available"
        : "Progress tracking not yet available",
    proposedStructureSummary: definition.proposedStructureSummary,
    resourcesAndSupport: definition.resourcesAndSupport,
  };
}
