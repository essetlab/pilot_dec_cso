export type HRBAModuleDefinition = {
  moduleId: string;
  moduleSeq: number;
  itemLabel: string;
  title: string;
  subtitle?: string;
  description: string;
  coverFocus: string;
  duration: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  startScreenId: string;
  completionScreenId: string;
  contentAvailable: boolean;
};

export const HRBA_COURSE_MODULES: HRBAModuleDefinition[] = [
  {
    moduleId: 'module_01_hrba_foundations',
    moduleSeq: 1,
    itemLabel: 'Module 1',
    title: 'Starting the HRBA Learning Journey',
    subtitle: 'Introduction to HRBA for Local CSOs',
    description: 'Begin safely, explore the course pathway, and choose a practical issue to carry through the course.',
    coverFocus: 'Begin using a simple HRBA lens for everyday CSO work without needing legal expertise.',
    duration: '20-25 minutes',
    thumbnailSrc: '/assets/hrba/modules/module-1.png',
    thumbnailAlt: 'Cover image for Module 1 - Starting the HRBA Learning Journey.',
    startScreenId: 'M1-PLAYER-00',
    completionScreenId: 'M1-PLAYER-COMPLETE',
    contentAvailable: true,
  },
  {
    moduleId: 'module_02_everyday_cso_work',
    moduleSeq: 2,
    itemLabel: 'Module 2',
    title: 'Foundations of HRBA: Rights, Actors, Principles, and Power',
    description: 'Use everyday CSO situations to identify rights, actors, participation, accountability, and exclusion.',
    coverFocus: 'Rights in Everyday CSO Work',
    duration: 'Approx. 75-90 min',
    thumbnailSrc: '/assets/hrba/modules/module-2.png',
    thumbnailAlt: 'Cover image for Module 2 - Foundations of HRBA: Rights, Actors, Principles, and Power.',
    startScreenId: 'M2-S01',
    completionScreenId: 'M2-S23',
    contentAvailable: true,
  },
  {
    moduleId: 'module_03_project_design',
    moduleSeq: 3,
    itemLabel: 'Module 3',
    title: 'Applying HRBA in Project Design',
    description: 'Turn a project idea into a stronger HRBA-aligned design with better analysis, objectives, activities, and risks.',
    coverFocus: 'Designing Projects with a Rights Lens',
    duration: 'Approx. 90-105 min',
    thumbnailSrc: '/assets/hrba/modules/module-3.png',
    thumbnailAlt: 'Cover image for Module 3 - Applying HRBA in Project Design.',
    startScreenId: 'M3-PLAYER-00',
    completionScreenId: 'M3-PLAYER-COMPLETE',
    contentAvailable: true,
  },
  {
    moduleId: 'module_04_implementation',
    moduleSeq: 4,
    itemLabel: 'Module 4',
    title: 'Applying HRBA During Implementation',
    description: 'Keep participation, feedback, accountability, and adaptation alive while the project is being delivered.',
    coverFocus: 'Keeping HRBA Alive During Delivery',
    duration: 'Approx. 75-90 min',
    thumbnailSrc: '/assets/hrba/modules/module-4.png',
    thumbnailAlt: 'Cover image for Module 4 - Applying HRBA During Implementation.',
    startScreenId: 'M4-PLAYER-00',
    completionScreenId: 'M4-S1-13',
    contentAvailable: true,
  },
  {
    moduleId: 'module_05_hrba_meal',
    moduleSeq: 5,
    itemLabel: 'Module 5',
    title: 'HRBA in Monitoring, Evaluation, Accountability, and Learning',
    description: 'Use safe evidence, feedback, indicators, and reporting to support inclusion, learning, and responsible adaptation.',
    coverFocus: 'Evidence, Feedback, Accountability, and Learning',
    duration: 'Approx. 90-110 min',
    thumbnailSrc: '/assets/hrba/modules/module-5.png',
    thumbnailAlt: 'Cover image for Module 5 - HRBA in Monitoring, Evaluation, Accountability, and Learning.',
    startScreenId: 'M5-PLAYER-00',
    completionScreenId: 'M5-PLAYER-COMPLETE',
    contentAvailable: true,
  },
  {
    moduleId: 'final_assessment',
    moduleSeq: 6,
    itemLabel: 'Final Assessment',
    title: 'Final Assessment',
    description: 'Complete the final course assessment after finishing the five-module HRBA learning pathway.',
    coverFocus: 'Final Course Checkpoint',
    duration: 'Final checkpoint',
    thumbnailSrc: '/assets/hrba/modules/final-assessment.png',
    thumbnailAlt: 'Cover image for the HRBA Final Assessment.',
    startScreenId: 'FINAL-ASSESSMENT-PLAYER-00',
    completionScreenId: 'FINAL-ASSESSMENT-COMPLETE',
    contentAvailable: false,
  },
];

export function getHRBAModuleById(moduleId: string | null): HRBAModuleDefinition | undefined {
  return HRBA_COURSE_MODULES.find((module) => module.moduleId === moduleId);
}
