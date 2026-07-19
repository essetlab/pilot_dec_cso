import "server-only";

import {
  getHrbaExternalCourseAllowedOrigins,
  getHrbaExternalCourseUrl,
  HRBA_EXTERNAL_COURSE_SLUG,
} from "./external-course-config";
import type {
  CatalogueAvailability,
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
  secondaryCapacityAreaIds: string[];
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
    assessmentStatus: "Assessment approach not yet confirmed",
    availability: "coming_soon",
    certificateStatus: "Certificate status not yet confirmed",
    deliveryFormat: COMING_SOON_FORMAT,
    displayOrder: definition.displayOrder,
    externalCourse:
      definition.externalCourse ?? comingSoonExternalCourse(),
    featured: false,
    fullDescription: COMING_SOON_OVERVIEW,
    imageAlt: `Course cover for ${definition.title}`,
    imageUrl: null,
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
    assessmentStatus:
      "Existing final assessment; certificate eligibility requires a score of 80% or above.",
    availability: "available",
    certificateStatus:
      "Certificate available after the required learning and assessment are completed.",
    deliveryFormat: "Hub-tracked embedded course",
    displayOrder: 1,
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
    imageAlt: "Local CSO practitioners reviewing advocacy notes during a planning session.",
    imageUrl: "/assets/demo/hrba-advocacy-course-thumbnail.svg",
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
    primaryCapacityAreaId: "CAP-ADV",
    proposedStructureSummary:
      "The active course follows the existing HRBA modules, assessment, progress, and certificate flow.",
    resourcesAndSupport:
      "Course-linked resources are available inside the active HRBA learning experience. Hub support remains available through the public Support page.",
    routeAliases: ["human-rights-based-approach-practice"],
    secondaryCapacityAreaIds: ["CAP-HRSAFE"],
    shortDescription: HRBA_COURSE_PROMISE,
    slug: HRBA_EXTERNAL_COURSE_SLUG,
    title: HRBA_COURSE_TITLE,
    tone: "blue",
  },
  comingSoonCourse({
    displayOrder: 2,
    integrationStatus: "content_preparation",
    legacyAliases: ["Governance", "Organizational Development"],
    primaryCapacityAreaId: "CAP-GOV",
    secondaryCapacityAreaIds: ["CAP-ACC", "CAP-STRAT"],
    shortDescription:
      "A forthcoming course on accountable leadership, governance practice, and organizational direction for local CSOs.",
    slug: "governance-and-leadership-local-csos",
    title: "Governance and Leadership for Local CSOs",
    tone: "navy",
  }),
  comingSoonCourse({
    displayOrder: 3,
    externalCourse: comingSoonExternalCourse("external_link"),
    integrationStatus: "integration_pending",
    legacyAliases: ["Project Cycle Management", "Project Management"],
    primaryCapacityAreaId: "CAP-STRAT",
    secondaryCapacityAreaIds: ["CAP-MEAL", "CAP-FIN", "CAP-PART"],
    shortDescription:
      "A forthcoming course on planning, delivering, and learning from projects in local and grassroots CSOs.",
    slug: "project-management-local-grassroots-csos",
    title: "Project Management for Local and Grassroots CSOs",
    tone: "green",
  }),
  comingSoonCourse({
    displayOrder: 4,
    integrationStatus: "content_preparation",
    legacyAliases: ["MEAL", "Monitoring and Evaluation"],
    primaryCapacityAreaId: "CAP-MEAL",
    secondaryCapacityAreaIds: ["CAP-ACC", "CAP-STRAT"],
    shortDescription:
      "A forthcoming course on using monitoring, evaluation, accountability, and learning to strengthen CSO decisions.",
    slug: "reporting-to-learning-meal-local-csos",
    title:
      "From Reporting to Learning: Monitoring, Evaluation, Accountability, and Learning for Local CSOs",
    tone: "blue",
  }),
  comingSoonCourse({
    displayOrder: 5,
    integrationStatus: "content_preparation",
    legacyAliases: ["Financial Management", "Compliance"],
    primaryCapacityAreaId: "CAP-FIN",
    secondaryCapacityAreaIds: ["CAP-ACC", "CAP-STRAT"],
    shortDescription:
      "A forthcoming course on responsible financial management, accountability, and compliance in local CSO practice.",
    slug: "financial-management-compliance-local-grassroots-csos",
    title:
      "Financial Management and Compliance for Local and Grassroots CSOs",
    tone: "green",
  }),
  comingSoonCourse({
    displayOrder: 6,
    integrationStatus: "content_preparation",
    legacyAliases: ["Organizational Development", "Strategic Planning"],
    primaryCapacityAreaId: "CAP-STRAT",
    secondaryCapacityAreaIds: ["CAP-GOV", "CAP-FIN", "CAP-MEAL"],
    shortDescription:
      "A forthcoming course on strategic direction, adaptation, and organizational sustainability for local CSOs.",
    slug: "strategic-planning-organizational-sustainability-local-csos",
    title:
      "Strategic Planning and Organizational Sustainability for Local CSOs",
    tone: "navy",
  }),
  comingSoonCourse({
    displayOrder: 7,
    integrationStatus: "content_preparation",
    legacyAliases: ["Safeguarding", "Human Resources", "Inclusion"],
    primaryCapacityAreaId: "CAP-HRSAFE",
    secondaryCapacityAreaIds: ["CAP-ADV", "CAP-ACC", "CAP-GOV"],
    shortDescription:
      "A forthcoming course on people practice, inclusion, safeguarding, and duty of care in CSO work.",
    slug: "people-inclusion-safeguarding-cso-practice",
    title: "People, Inclusion, and Safeguarding in CSO Practice",
    tone: "gold",
  }),
  comingSoonCourse({
    displayOrder: 8,
    integrationStatus: "content_preparation",
    legacyAliases: ["Digital Skills", "Data Use"],
    primaryCapacityAreaId: "CAP-DIG",
    secondaryCapacityAreaIds: [
      "CAP-MEAL",
      "CAP-ACC",
      "CAP-HRSAFE",
      "CAP-GOV",
    ],
    shortDescription:
      "A forthcoming course on responsible digital practice and data use for local CSO teams.",
    slug: "responsible-digital-skills-data-use-local-csos",
    title: "Responsible Digital Skills and Data Use for Local CSOs",
    tone: "blue",
  }),
  comingSoonCourse({
    displayOrder: 9,
    integrationStatus: "content_preparation",
    legacyAliases: [
      "Partnership and Networking",
      "Networks",
      "Collective Action",
    ],
    primaryCapacityAreaId: "CAP-PART",
    secondaryCapacityAreaIds: ["CAP-ADV", "CAP-STRAT", "CAP-GOV"],
    shortDescription:
      "A forthcoming course on partnerships, networks, and collective action for local CSOs.",
    slug: "partnerships-networks-collective-action-local-csos",
    title: "Partnerships, Networks, and Collective Action for Local CSOs",
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
    capacityAreas: [primaryCapacityArea, ...secondaryCapacityAreas],
    primaryCapacityArea,
    secondaryCapacityAreas,
  };
}

export function toPublicCatalogueSummary(
  definition: CatalogueCourseDefinition,
  existingHrba: PublicCourseSummary | null = null,
): PublicCatalogueCourseSummary {
  const areas = definitionCapacityAreas(definition);
  const isAvailable = definition.availability === "available";
  const existingSlug = isAvailable && existingHrba
    ? existingHrba.slug
    : definition.slug;

  return {
    availability: definition.availability,
    ...areas,
    certificateLabel: isAvailable
      ? existingHrba?.certificate ?? definition.certificateStatus
      : definition.certificateStatus,
    deliveryFormat: definition.deliveryFormat,
    displayOrder: definition.displayOrder,
    duration: isAvailable
      ? existingHrba?.duration ?? "90 minutes"
      : COMING_SOON_DURATION,
    featured: definition.featured,
    href: `/courses/${existingSlug}`,
    imageAlt: existingHrba?.imageAlt ?? definition.imageAlt,
    imageUrl: existingHrba?.imageUrl ?? definition.imageUrl,
    integrationStatus: definition.integrationStatus,
    language: isAvailable
      ? existingHrba?.language ?? definition.language
      : definition.language,
    launchMode: definition.externalCourse.launchMode,
    primaryCapacityArea: areas.primaryCapacityArea,
    secondaryCapacityAreas: areas.secondaryCapacityAreas,
    shortDescription: isAvailable
      ? existingHrba?.description ?? definition.shortDescription
      : definition.shortDescription,
    slug: existingSlug,
    title: definition.title,
    tone: existingHrba?.tone ?? definition.tone,
  };
}

export function getPublicCatalogueSummaries(
  existingHrba: PublicCourseSummary | null = null,
) {
  return PUBLIC_COURSE_CATALOGUE.map((definition) =>
    toPublicCatalogueSummary(
      definition,
      definition.availability === "available" ? existingHrba : null,
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
    practicalOutputs: definition.practicalOutputs,
    progressTrackingCapability:
      definition.externalCourse.progressTrackingCapability === "hub_tracked"
        ? "Hub-tracked progress available"
        : "Progress tracking not yet available",
    proposedStructureSummary: definition.proposedStructureSummary,
    resourcesAndSupport: definition.resourcesAndSupport,
  };
}
