const MODULE_1_ICON_BASE = '/assets/hrba/module-1/icons';
const MODULE_1_ICON_PNG_BASE = `${MODULE_1_ICON_BASE}/png`;
const MODULE_1_ICON_SVG_BASE = `${MODULE_1_ICON_BASE}/svg`;
const MODULE_1_IMAGE_BASE = '/assets/hrba/module-1/images';
const MODULE_1_JOURNEY_BASE = '/assets/hrba/module-1/journey';
const SHARED_ICON_BASE = '/assets/hrba/shared/icons';

const module1Icon = (fileName: string, alt: string) => ({
  png: `${MODULE_1_ICON_PNG_BASE}/${fileName}.png`,
  svg: `${MODULE_1_ICON_SVG_BASE}/${fileName}.svg`,
  alt,
});

export const module1RefinementAssets = {
  m1S02: {
    actionCommitment: module1Icon('m1_s02_icon_action_commitment_v1', 'Icon representing choosing an action commitment to carry forward.'),
    askQuestions: module1Icon('m1_s02_icon_ask_questions_v1', 'Icon representing asking better rights-based questions before acting.'),
    explainHrba: module1Icon('m1_s02_icon_explain_hrba_v1', 'Icon representing explaining HRBA in simple words.'),
    noticeExclusion: module1Icon('m1_s02_icon_notice_exclusion_v1', 'Icon representing noticing who may be invisible or left at the edge.'),
    rightsHolder: module1Icon('m1_s02_icon_rights_holder_v1', 'Icon representing people as rights-holders, not only beneficiaries.'),
    safeReflection: module1Icon('m1_s02_icon_safe_reflection_v1', 'Icon representing safe reflection without exposing real people or cases.'),
  },
  m1S03: {
    exclusion: module1Icon('m1_s03_icon_exclusion_v1', 'Icon representing exclusion hidden inside project success.'),
    feedbackAction: module1Icon('m1_s03_icon_feedback_action_v1', 'Icon representing feedback leading to action.'),
    participation: module1Icon('m1_s03_icon_participation_v1', 'Icon representing meaningful participation.'),
    responsibility: module1Icon('m1_s03_icon_responsibility_v1', 'Icon representing responsibility and duty in HRBA practice.'),
  },
  m1S04: {
    step1: {
      src: `${MODULE_1_JOURNEY_BASE}/step_1.png`,
      alt: 'CSO practitioners beginning an HRBA learning journey through community dialogue.',
    },
    step2: {
      src: `${MODULE_1_JOURNEY_BASE}/step_2.png`,
      alt: 'CSO team reviewing community feedback and learning evidence.',
    },
    step3: {
      src: `${MODULE_1_JOURNEY_BASE}/step_3.png`,
      alt: 'CSO team mapping local issues and participation barriers.',
    },
    step4: {
      src: `${MODULE_1_JOURNEY_BASE}/step_4.png`,
      alt: 'CSO practitioners discussing a rights-based learning path.',
    },
    step5: {
      src: `${MODULE_1_JOURNEY_BASE}/step_5.png`,
      alt: 'CSO team co-creating plans with local participants.',
    },
    step6: {
      src: `${MODULE_1_JOURNEY_BASE}/step_6.png`,
      alt: 'Community dialogue with rights and accountability icons.',
    },
  },
  m1S05: {
    waterPointScenario: `${MODULE_1_IMAGE_BASE}/m1_s05_water_point_scenario_v1.png`,
    waterPointScenarioPng: `${MODULE_1_ICON_PNG_BASE}/m1_s05_water_point_scenario_v1.png`,
  },
  m1S06: {
    hrbaLens: {
      png: `${MODULE_1_ICON_PNG_BASE}/m1_shared_hrba_lens_icon_v1.png`,
      svg: `${SHARED_ICON_BASE}/m1_shared_hrba_lens_icon_v1.svg`,
      alt: 'Icon representing the HRBA lens.',
    },
  },
  m1S08: {
    education: module1Icon('m1_s08_icon_education_v1', 'Icon representing education.'),
    health: module1Icon('m1_s08_icon_health_v1', 'Icon representing health.'),
    livelihoods: module1Icon('m1_s08_icon_livelihoods_v1', 'Icon representing livelihoods.'),
    protectionSafety: module1Icon('m1_s08_icon_protection_safety_v1', 'Icon representing protection and safety.'),
    voiceParticipation: module1Icon('m1_s08_icon_voice_participation_v1', 'Icon representing voice and participation.'),
    water: {
      png: `${MODULE_1_ICON_PNG_BASE}/m1_s08_icon_water_v1.png`,
      svg: null,
      alt: 'Icon representing water access.',
    },
  },
  m1S09: {
    disabilityAccess: module1Icon('m1_s09_icon_disability_access_v1', 'Icon representing disability access.'),
    lessVisibleGroups: module1Icon('m1_s09_icon_less_visible_groups_v1', 'Icon representing less visible groups.'),
    menBoys: module1Icon('m1_s09_icon_men_boys_v1', 'Icon representing men and boys.'),
    olderPeople: module1Icon('m1_s09_icon_older_people_v1', 'Icon representing older people.'),
    womenGirls: module1Icon('m1_s09_icon_women_girls_v1', 'Icon representing women and girls.'),
    youthChildren: module1Icon('m1_s09_icon_youth_children_v1', 'Icon representing youth and children.'),
  },
  m1S10: {
    centerWater: null,
    healthNode: null,
    educationNode: null,
    dignityNode: null,
    participationNode: null,
    accountabilityNode: null,
  },
} as const;
