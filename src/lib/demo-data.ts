export const CERTIFICATE_PASS_THRESHOLD = 80;
export const CERTIFICATE_PASS_THRESHOLD_LABEL = `${CERTIFICATE_PASS_THRESHOLD}%`;
export const CERTIFICATE_PASS_SCORE_LABEL = `${CERTIFICATE_PASS_THRESHOLD_LABEL} pass score`;
export const CERTIFICATE_THRESHOLD_RULE = `${CERTIFICATE_PASS_THRESHOLD_LABEL} or above`;

export const DEMO_COURSE_SLUG = "proposal-development-fundamentals-grassroots-csos";
export const DEMO_COURSE_ID = "demo-course";

export const DEMO_ROUTE_PATHS = {
  adminCourse: "/admin/courses/proposal-development-fundamentals",
  creatorBuild: `/creator/courses/${DEMO_COURSE_ID}/build`,
  creatorMetadata: `/creator/courses/${DEMO_COURSE_ID}/metadata`,
  creatorOutcomes: `/creator/courses/${DEMO_COURSE_ID}/outcomes`,
  creatorPreview: `/creator/courses/${DEMO_COURSE_ID}/preview`,
  creatorQuiz: `/creator/courses/${DEMO_COURSE_ID}/quiz`,
  creatorResources: `/creator/courses/${DEMO_COURSE_ID}/resources`,
  creatorSetup: `/creator/courses/${DEMO_COURSE_ID}/setup`,
  creatorSubmit: `/creator/courses/${DEMO_COURSE_ID}/submit`,
  learnerCertificate: `/learn/certificates/${DEMO_COURSE_SLUG}`,
  learnerCourse: `/learn/courses/${DEMO_COURSE_SLUG}`,
  learnerFinalTest: `/learn/courses/${DEMO_COURSE_SLUG}/final-test`,
  publicCourse: `/courses/${DEMO_COURSE_SLUG}`,
} as const;

export const DEMO_CAPACITY_AREAS = [
  "Proposal Development",
  "Financial Management",
  "Safeguarding",
  "Organizational Development",
  "MEAL",
  "Human Rights-Based Approach",
] as const;

export const DEMO_COURSES = [
  {
    access: "Public",
    audience: "Local and grassroots CSO staff, volunteers, and focal persons",
    capacityArea: DEMO_CAPACITY_AREAS[0],
    certificate: "Certificate included",
    certificateEligible: "Yes",
    creator: "Course Creator",
    currentLesson: "From Community Problem to Project Objective",
    currentModule: "Understanding the Proposal Logic",
    description:
      "Learn the essential steps for turning a community problem into a clear project idea and basic proposal structure.",
    duration: "90 minutes",
    finalTest: "Configured",
    href: DEMO_ROUTE_PATHS.publicCourse,
    id: DEMO_COURSE_ID,
    imageAlt:
      "Local CSO staff reviewing advocacy notes during a participatory planning session.",
    imageUrl: "/images/course-proposal.png",
    language: "English",
    lastUpdated: "Recently updated",
    lessons: "5 lessons",
    lessonsCount: 5,
    level: "Foundational",
    progress: 40,
    resources: "4",
    reviewStatus: "Published",
    shortTitle: "Proposal Development Fundamentals",
    slug: DEMO_COURSE_SLUG,
    status: "Published",
    title: "Proposal Development Fundamentals for Grassroots CSOs",
    tone: "blue",
  },
  {
    access: "Public",
    audience: "Local CSO operations and finance staff",
    capacityArea: DEMO_CAPACITY_AREAS[1],
    certificate: "Certificate included",
    certificateEligible: "Yes",
    creator: "Course Creator",
    currentLesson: "Start with the first lesson when ready.",
    currentModule: "Financial Management Foundations",
    description:
      "Build practical foundations for budgeting, internal controls, and clear financial records.",
    duration: "75 minutes",
    finalTest: "Configured",
    href: "/courses",
    id: "financial-management-basics",
    imageAlt: "Course cover for Financial Management Basics for Local CSOs.",
    imageUrl: "/images/course-financial.png",
    language: "English",
    lastUpdated: "Last week",
    lessons: "4 lessons",
    lessonsCount: 4,
    level: "Foundational",
    progress: 0,
    resources: "4",
    reviewStatus: "In review",
    shortTitle: "Financial Management Basics",
    slug: "financial-management-basics-local-csos",
    status: "Draft",
    title: "Financial Management Basics for Local CSOs",
    tone: "green",
  },
  {
    access: "Public",
    audience: "Grassroots CSO staff and volunteers",
    capacityArea: DEMO_CAPACITY_AREAS[2],
    certificate: "Certificate included",
    certificateEligible: "Yes",
    creator: "Course Creator",
    currentLesson: "Start with the first lesson when ready.",
    currentModule: "Safeguarding Foundations",
    description:
      "Understand core safeguarding responsibilities and practical steps for safer programming.",
    duration: "60 minutes",
    finalTest: "Configured",
    href: "/courses",
    id: "safeguarding-essentials",
    imageAlt: "Course cover for Safeguarding Essentials for Grassroots CSOs.",
    imageUrl: "/images/course-safeguarding.png",
    language: "English",
    lastUpdated: "This week",
    lessons: "4 lessons",
    lessonsCount: 4,
    level: "Introductory",
    progress: 0,
    resources: "3",
    reviewStatus: "Ready for review",
    shortTitle: "Safeguarding Essentials",
    slug: "safeguarding-essentials-grassroots-csos",
    status: "Ready for review",
    title: "Safeguarding Essentials for Grassroots CSOs",
    tone: "gold",
  },
  {
    access: "Public",
    audience: "Local CSO board and leadership teams",
    capacityArea: DEMO_CAPACITY_AREAS[3],
    certificate: "Certificate included",
    certificateEligible: "Yes",
    creator: "Course Creator",
    currentLesson: "Start with the first lesson when ready.",
    currentModule: "Organizational Practice",
    description:
      "Strengthen board practice, accountability habits, and decision-making routines for local CSO teams.",
    duration: "70 minutes",
    finalTest: "Configured",
    href: "/courses",
    id: "organizational-development-basics",
    imageAlt: "Course cover for Organizational Development Basics for Local CSOs.",
    imageUrl: null,
    language: "English",
    lastUpdated: "Recently updated",
    lessons: "4 lessons",
    lessonsCount: 4,
    level: "Foundational",
    progress: 0,
    resources: "3",
    reviewStatus: "Draft",
    shortTitle: "Organizational Development Basics",
    slug: "organizational-development-basics-local-csos",
    status: "Draft",
    title: "Organizational Development Basics for Local CSOs",
    tone: "navy",
  },
  {
    access: "Public",
    audience: "Programme and learning staff",
    capacityArea: DEMO_CAPACITY_AREAS[4],
    certificate: "Certificate included",
    certificateEligible: "Yes",
    creator: "Course Creator",
    currentLesson: "Start with the first lesson when ready.",
    currentModule: "Monitoring Foundations",
    description:
      "Use simple monitoring and learning practices to track progress and improve programme decisions.",
    duration: "80 minutes",
    finalTest: "Configured",
    href: "/courses",
    id: "meal-foundations",
    imageAlt: "Course cover for MEAL Foundations for Local CSOs.",
    imageUrl: null,
    language: "English",
    lastUpdated: "Recently updated",
    lessons: "5 lessons",
    lessonsCount: 5,
    level: "Foundational",
    progress: 0,
    resources: "4",
    reviewStatus: "Published",
    shortTitle: "MEAL Foundations",
    slug: "meal-foundations-local-csos",
    status: "Published",
    title: "MEAL Foundations for Local CSOs",
    tone: "green",
  },
  {
    access: "Public",
    audience: "CSO programme teams",
    capacityArea: DEMO_CAPACITY_AREAS[5],
    certificate: "Certificate included",
    certificateEligible: "Yes",
    creator: "Course Creator",
    currentLesson: "Start with the first lesson when ready.",
    currentModule: "Rights-Based Practice",
    description:
      "Apply participation, accountability, and inclusion principles in practical CSO programme work.",
    duration: "90 minutes",
    finalTest: "Configured",
    href: "/courses",
    id: "human-rights-based-approach",
    imageAlt:
      "Local CSO staff reviewing advocacy notes during a participatory planning session.",
    imageUrl: "/assets/demo/hrba-advocacy-course-thumbnail.svg",
    language: "English",
    lastUpdated: "Recently updated",
    lessons: "5 lessons",
    lessonsCount: 5,
    level: "Foundational",
    progress: 0,
    resources: "4",
    reviewStatus: "Published",
    shortTitle: "Human Rights-Based Approach",
    slug: "human-rights-based-approach-practice",
    status: "Published",
    title: "Human Rights-Based Approach in Practice",
    tone: "blue",
  },
] as const;

export const DEMO_PROPOSAL_COURSE = DEMO_COURSES[0];
export const DEMO_FINANCIAL_COURSE = DEMO_COURSES[1];
export const DEMO_SAFEGUARDING_COURSE = DEMO_COURSES[2];

export const DEMO_COURSE_OUTCOMES = [
  "Explain the core elements of a simple project proposal.",
  "Convert a community problem into a clear project goal and objective.",
  "Identify target groups, activities, outputs, and expected results.",
  "Recognize common weaknesses in grassroots CSO proposal writing.",
  "Prepare a basic proposal outline for internal review or coaching.",
] as const;

export const DEMO_COURSE_MODULES = [
  {
    lessons: [
      "What Makes a Proposal Fundable?",
      DEMO_PROPOSAL_COURSE.currentLesson,
    ],
    title: "Understanding the Proposal Logic",
  },
  {
    lessons: [
      "Activities, Outputs, and Expected Results",
      "Common Proposal Weaknesses",
    ],
    title: "Building the Proposal Structure",
  },
  {
    lessons: ["Final Test", "Certificate and Continued Learning"],
    title: "Final Test and Next Steps",
  },
] as const;

export const DEMO_LESSON_BLOCKS = [
  {
    description:
      "A clear reading section explains how to turn a broad community problem into a focused project objective.",
    title: "Text / Reading",
  },
  {
    description:
      "A highlighted takeaway helps participants remember what a strong objective includes.",
    title: "Key Message",
  },
  {
    description:
      "Concept cards compare a general problem statement with a stronger objective statement.",
    title: "Flashcards",
  },
  {
    description:
      "A decision activity asks participants to choose the strongest objective for a local CSO situation.",
    title: "Branching Scenario",
  },
  {
    description:
      "A practical prompt asks participants to draft one objective from their own community context.",
    title: "Practical Activity",
  },
] as const;

export const DEMO_FINAL_TEST_QUESTIONS = [
  {
    correctAnswer: "To describe the specific change the project aims to support",
    linkedOutcome: DEMO_COURSE_OUTCOMES[1],
    options: [
      "To describe the broad problem only",
      "To describe the specific change the project aims to support",
      "To list all staff responsibilities",
      "To replace the activity plan",
    ],
    text: "What is the main purpose of a project objective?",
    type: "Multiple choice",
  },
  {
    correctAnswer: "A defined target group",
    linkedOutcome: DEMO_COURSE_OUTCOMES[1],
    options: [
      "A defined target group",
      "A longer problem statement",
      "A list of donor requirements",
      "A general slogan",
    ],
    text: "Which element makes an objective clearer?",
    type: "Multiple choice",
  },
  {
    correctAnswer:
      "Improve employability skills for 30 young women in the target kebele within six months",
    linkedOutcome: DEMO_COURSE_OUTCOMES[3],
    options: [
      "Young people face unemployment",
      "Conduct three training sessions",
      "Improve employability skills for 30 young women in the target kebele within six months",
      "Many communities need support",
    ],
    text: "Which statement is closer to a project objective?",
    type: "Multiple choice",
  },
  {
    correctAnswer: "To make the proposal logic easier to understand",
    linkedOutcome: DEMO_COURSE_OUTCOMES[2],
    options: [
      "To make the proposal logic easier to understand",
      "To make the proposal longer",
      "To avoid monitoring",
      "To remove the need for budgeting",
    ],
    text: "Why should activities connect to outputs and results?",
    type: "Multiple choice",
  },
  {
    correctAnswer:
      "Review the objective, activities, outputs, and expected results for clarity",
    linkedOutcome: DEMO_COURSE_OUTCOMES[4],
    options: [
      "Review the objective, activities, outputs, and expected results for clarity",
      "Remove all community inputs",
      "Avoid discussing the idea with the team",
      "Focus only on the title",
    ],
    text: "What should a grassroots CSO do before submitting a proposal idea?",
    type: "Multiple choice",
  },
] as const;

export const DEMO_ORGANIZATIONS = [
  {
    cohort: "CSF+ Grassroots Cohort 1",
    focalPerson: "CSO Focal Person",
    name: "Hiwot Community Development Association",
    participants: "2",
    region: "Amhara",
    shortName: "HCDA",
    status: "Active",
    type: "Local CSO",
  },
  {
    cohort: "CSF+ Grassroots Cohort 1",
    focalPerson: "Participant New",
    name: "Lemat Youth Initiative",
    participants: "1",
    region: "Oromia",
    shortName: "LYI",
    status: "Active",
    type: "Grassroots / Youth Group",
  },
  {
    cohort: "Not assigned",
    focalPerson: "Not assigned",
    name: "Tesfa Women-Led Development Group",
    participants: "0",
    region: "Central Ethiopia",
    shortName: "TWDG",
    status: "Invited",
    type: "Women-led Community Group",
  },
  {
    cohort: "CSF+ Grassroots Cohort 1",
    focalPerson: "Amina Tadesse",
    name: "Addis Community Action",
    participants: "4",
    region: "Addis Ababa",
    shortName: "ACA",
    status: "Active",
    type: "Community-Based Organization",
  },
] as const;

export const DEMO_COHORTS = [
  {
    assignedCourses: [
      DEMO_PROPOSAL_COURSE.title,
      DEMO_FINANCIAL_COURSE.title,
      DEMO_SAFEGUARDING_COURSE.title,
    ],
    name: "CSF+ Grassroots Cohort 1",
    organizations: "4",
    participants: "24",
    program: "CSF+ Grassroots Learning",
    regionFocus: "Amhara / Oromia",
    status: "Active",
  },
  {
    assignedCourses: [DEMO_FINANCIAL_COURSE.title, DEMO_SAFEGUARDING_COURSE.title],
    name: "CSF+ Grassroots Cohort 2",
    organizations: "3",
    participants: "12",
    program: "CSF+ Grassroots Learning",
    regionFocus: "Addis Ababa / Dire Dawa",
    status: "Planned",
  },
  {
    assignedCourses: [DEMO_SAFEGUARDING_COURSE.title],
    name: "Reviewer Orientation Group",
    organizations: "Internal team",
    participants: "5",
    program: "Platform Operations",
    regionFocus: "National",
    status: "Active",
  },
] as const;

export const DEMO_USER_EXAMPLES = [
  {
    cohort: DEMO_COHORTS[0].name,
    email: "amina.tadesse@addiscommunity.org",
    name: "Amina Tadesse",
    organization: DEMO_ORGANIZATIONS[3].name,
    role: "Participant",
    status: "Active",
  },
  {
    cohort: DEMO_COHORTS[0].name,
    email: "creator@learninghub.local",
    name: "Course Creator",
    organization: "Learning content team",
    role: "Course Creator",
    status: "Active",
  },
  {
    cohort: "Review team",
    email: "reviewer@learninghub.local",
    name: "Course Reviewer",
    organization: "Quality review team",
    role: "Course Reviewer",
    status: "Active",
  },
] as const;

export const DEMO_CERTIFICATES = [
  {
    course: DEMO_PROPOSAL_COURSE.title,
    issueDate: "Recently issued",
    organization: DEMO_ORGANIZATIONS[0].name,
    participant: "Participant Completed",
    status: "Issued",
    threshold: CERTIFICATE_PASS_THRESHOLD_LABEL,
  },
  {
    course: DEMO_SAFEGUARDING_COURSE.title,
    issueDate: "Pending completion",
    organization: DEMO_ORGANIZATIONS[3].name,
    participant: "Amina Tadesse",
    status: "Eligible",
    threshold: CERTIFICATE_PASS_THRESHOLD_LABEL,
  },
  {
    course: DEMO_FINANCIAL_COURSE.title,
    issueDate: "Pending completion",
    organization: DEMO_ORGANIZATIONS[1].name,
    participant: "Participant New",
    status: "Pending completion",
    threshold: CERTIFICATE_PASS_THRESHOLD_LABEL,
  },
] as const;

export function formatCertificateThresholdRule() {
  return CERTIFICATE_THRESHOLD_RULE;
}
