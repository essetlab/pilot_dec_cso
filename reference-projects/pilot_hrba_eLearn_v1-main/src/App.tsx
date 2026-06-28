import { useState, useEffect } from 'react';
import { loadLearningState, saveLearningState } from './state/learningState';
import type { LearningState } from './state/learningState';
import PlatformShell from './components/platform/PlatformShell';
import CoursePlayerShell from './components/player/CoursePlayerShell';
import { HRBA_COURSE_MODULES, getHRBAModuleById } from './data/hrbaCourseModules';
import { emitPortalProgress } from './integrations/portalBridge';

import m1Sequence from './data/module1/module_1_screen_sequence.json';
import m2Sequence from './data/module2/module_2_screen_sequence.json';

export default function App() {
  const [state, setState] = useState<LearningState>(() => {
    const defaultState = loadLearningState();
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const screenIdParam = params.get('screenId');
    const moduleIdParam = params.get('moduleId');
    const completedParam = params.get('completed');
    const module2RouteTargets: Record<string, { moduleId: string; screenId: string }> = {
      '/module-1': { moduleId: 'module_01_hrba_foundations', screenId: 'M1-PLAYER-00' },
      '/module-1/cover': { moduleId: 'module_01_hrba_foundations', screenId: 'M1-PLAYER-00' },
      '/module-2': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S01' },
      '/module-2/cover': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S01' },
      '/module-2/intro-video': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S01A' },
      '/module-2/learning-objectives': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S02' },
      '/module-2/screen-2-1': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S01' },
      '/module-2/screen-2-1a': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S01A' },
      '/module-2/screen-2-2': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S02' },
      '/module-2/screen-2-3': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S03' },
      '/module-2/screen-2-4': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S04' },
      '/module-2/screen-2-5': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S05' },
      '/module-2/screen-2-6': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S06' },
      '/module-2/screen-2-7': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S07' },
      '/module-2/screen-2-8': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S08' },
      '/module-2/screen-2-9': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S09' },
      '/module-2/screen-2-10': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S10' },
      '/module-2/screen-2-11': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S11' },
      '/module-2/screen-2-12': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S12' },
      '/module-2/screen-2-13': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S13' },
      '/module-2/screen-2-14': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S14' },
      '/module-2/screen-2-15': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S15' },
      '/module-2/screen-2-16': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S16' },
      '/module-2/screen-2-17': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S17' },
      '/module-2/screen-2-18': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S18' },
      '/module-2/screen-2-19': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S19' },
      '/module-2/screen-2-20': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S20' },
      '/module-2/screen-2-21': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S21' },
      '/module-2/screen-2-22': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S22' },
      '/module-2/screen-2-23': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S23' },
      '/module-2/complete': { moduleId: 'module_02_everyday_cso_work', screenId: 'M2-S23' },
      '/module-3': { moduleId: 'module_03_project_design', screenId: 'M3-PLAYER-00' },
      '/module-3/cover': { moduleId: 'module_03_project_design', screenId: 'M3-PLAYER-00' },
      '/module-3/screen-3-1': { moduleId: 'module_03_project_design', screenId: 'M3-S1-01' },
      '/module-3/screen-3-2': { moduleId: 'module_03_project_design', screenId: 'M3-S1-02' },
      '/module-3/screen-3-3': { moduleId: 'module_03_project_design', screenId: 'M3-S1-03' },
      '/module-3/screen-3-3a': { moduleId: 'module_03_project_design', screenId: 'M3-S1-03A' },
      '/module-3/screen-3-3b': { moduleId: 'module_03_project_design', screenId: 'M3-S1-03B' },
      '/module-3/screen-3-3c': { moduleId: 'module_03_project_design', screenId: 'M3-S1-03C' },
      '/module-3/screen-3-3d': { moduleId: 'module_03_project_design', screenId: 'M3-S1-03D' },
      '/module-3/screen-3-4': { moduleId: 'module_03_project_design', screenId: 'M3-S1-04' },
      '/module-3/screen-3-5': { moduleId: 'module_03_project_design', screenId: 'M3-S1-05' },
      '/module-3/screen-3-6': { moduleId: 'module_03_project_design', screenId: 'M3-S1-06' },
      '/module-3/screen-3-6a': { moduleId: 'module_03_project_design', screenId: 'M3-S1-06A' },
      '/module-3/screen-3-6b': { moduleId: 'module_03_project_design', screenId: 'M3-S1-06B' },
      '/module-3/screen-3-6c': { moduleId: 'module_03_project_design', screenId: 'M3-S1-06C' },
      '/module-3/screen-3-7': { moduleId: 'module_03_project_design', screenId: 'M3-S1-07' },
      '/module-3/screen-3-8': { moduleId: 'module_03_project_design', screenId: 'M3-S1-08' },
      '/module-3/screen-3-9': { moduleId: 'module_03_project_design', screenId: 'M3-S1-09' },
      '/module-3/screen-3-9a': { moduleId: 'module_03_project_design', screenId: 'M3-S1-09A' },
      '/module-3/screen-3-10': { moduleId: 'module_03_project_design', screenId: 'M3-S1-10' },
      '/module-3/screen-3-11': { moduleId: 'module_03_project_design', screenId: 'M3-S1-11' },
      '/module-3/screen-3-12': { moduleId: 'module_03_project_design', screenId: 'M3-S1-12' },
      '/module-3/screen-3-13': { moduleId: 'module_03_project_design', screenId: 'M3-S1-13' },
      '/module-3/screen-3-14': { moduleId: 'module_03_project_design', screenId: 'M3-S1-14' },
      '/module-3/screen-3-15': { moduleId: 'module_03_project_design', screenId: 'M3-S1-15' },
      '/module-3/screen-3-16': { moduleId: 'module_03_project_design', screenId: 'M3-S1-16' },
      '/module-3/screen-3-16a': { moduleId: 'module_03_project_design', screenId: 'M3-S1-16A' },
      '/module-3/screen-3-16b': { moduleId: 'module_03_project_design', screenId: 'M3-S1-16B' },
      '/module-3/screen-3-17': { moduleId: 'module_03_project_design', screenId: 'M3-S1-17' },
      '/module-3/screen-3-18': { moduleId: 'module_03_project_design', screenId: 'M3-S1-18' },
      '/module-3/screen-3-19': { moduleId: 'module_03_project_design', screenId: 'M3-S1-19' },
      '/module-3/screen-3-20': { moduleId: 'module_03_project_design', screenId: 'M3-S1-20' },
      '/module-3/screen-3-21': { moduleId: 'module_03_project_design', screenId: 'M3-S1-21' },
      '/module-3/screen-3-22': { moduleId: 'module_03_project_design', screenId: 'M3-S1-22' },
      '/module-3/screen-3-23': { moduleId: 'module_03_project_design', screenId: 'M3-S1-23' },
      '/module-3/screen-3-24': { moduleId: 'module_03_project_design', screenId: 'M3-S1-24' },
      '/module-3/screen-3-25': { moduleId: 'module_03_project_design', screenId: 'M3-S1-25' },
      '/module-3/complete': { moduleId: 'module_03_project_design', screenId: 'M3-PLAYER-COMPLETE' },
      '/module-4': { moduleId: 'module_04_implementation', screenId: 'M4-PLAYER-00' },
      '/module-4/cover': { moduleId: 'module_04_implementation', screenId: 'M4-PLAYER-00' },
      '/module-4/screen-4-1': { moduleId: 'module_04_implementation', screenId: 'M4-S1-01' },
      '/module-4/screen-4-2': { moduleId: 'module_04_implementation', screenId: 'M4-S1-02' },
      '/module-4/screen-4-3': { moduleId: 'module_04_implementation', screenId: 'M4-S1-03' },
      '/module-4/screen-4-4': { moduleId: 'module_04_implementation', screenId: 'M4-S1-04' },
      '/module-4/screen-4-5': { moduleId: 'module_04_implementation', screenId: 'M4-S1-05' },
      '/module-4/screen-4-6': { moduleId: 'module_04_implementation', screenId: 'M4-S1-06' },
      '/module-4/screen-4-7': { moduleId: 'module_04_implementation', screenId: 'M4-S1-07' },
      '/module-4/screen-4-8': { moduleId: 'module_04_implementation', screenId: 'M4-S1-08' },
      '/module-4/screen-4-9': { moduleId: 'module_04_implementation', screenId: 'M4-S1-09' },
      '/module-4/screen-4-10': { moduleId: 'module_04_implementation', screenId: 'M4-S1-10' },
      '/module-4/screen-4-11': { moduleId: 'module_04_implementation', screenId: 'M4-S1-11' },
      '/module-4/screen-4-12': { moduleId: 'module_04_implementation', screenId: 'M4-S1-12' },
      '/module-4/screen-4-13': { moduleId: 'module_04_implementation', screenId: 'M4-S1-13' },
      '/module-5': { moduleId: 'module_05_hrba_meal', screenId: 'M5-PLAYER-00' },
      '/module-5/cover': { moduleId: 'module_05_hrba_meal', screenId: 'M5-PLAYER-00' },
      '/module-5/screen-5-1': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-01' },
      '/module-5/screen-5-2': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-02' },
      '/module-5/screen-5-3': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-03' },
      '/module-5/screen-5-4': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-04' },
      '/module-5/screen-5-5': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-05' },
      '/module-5/screen-5-6': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-06' },
      '/module-5/screen-5-7': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-07' },
      '/module-5/screen-5-7a': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-07A' },
      '/module-5/screen-5-7b': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-07B' },
      '/module-5/screen-5-7c': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-07C' },
      '/module-5/screen-5-8': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-08' },
      '/module-5/screen-5-9': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-09' },
      '/module-5/screen-5-9a': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-09A' },
      '/module-5/screen-5-9b': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-09B' },
      '/module-5/screen-5-9c': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-09C' },
      '/module-5/screen-5-9d': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-09D' },
      '/module-5/screen-5-10': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-10' },
      '/module-5/screen-5-11': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-11' },
      '/module-5/screen-5-12': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-12' },
      '/module-5/screen-5-13': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-13' },
      '/module-5/screen-5-14': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-14' },
      '/module-5/screen-5-15': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-15' },
      '/module-5/screen-5-15a': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-15A' },
      '/module-5/screen-5-16': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-16' },
      '/module-5/screen-5-17': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-17' },
      '/module-5/screen-5-18': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-18' },
      '/module-5/screen-5-19': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-19' },
      '/module-5/screen-5-20': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-20' },
      '/module-5/screen-5-21': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-21' },
      '/module-5/screen-5-22': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-22' },
      '/module-5/screen-5-23': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-23' },
      '/module-5/screen-5-24': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-24' },
      '/module-5/screen-5-25': { moduleId: 'module_05_hrba_meal', screenId: 'M5-S1-25' },
      '/module-5/complete': { moduleId: 'module_05_hrba_meal', screenId: 'M5-PLAYER-COMPLETE' },
      '/final-assessment': { moduleId: 'final_assessment', screenId: 'FINAL-ASSESSMENT-PLAYER-00' },
      '/final-assessment/cover': { moduleId: 'final_assessment', screenId: 'FINAL-ASSESSMENT-PLAYER-00' },
    };
    const routeTarget = module2RouteTargets[pathname] || null;
    
    if (routeTarget || screenIdParam || completedParam) {
      const nextState = { ...defaultState };
      
      if (completedParam !== null) {
        nextState.completedModules = completedParam ? completedParam.split(',').filter(Boolean) : [];
        nextState.screenProgress = {};
        nextState.practiceCheckState = {};
        nextState.m2ObjectiveCardsViewed = [];
        if (!routeTarget && !screenIdParam) {
          nextState.currentLayer = 'platform';
          nextState.currentModuleId = null;
          nextState.currentScreenId = null;
          nextState.currentSubState = null;
          nextState.activeModal = null;
        }
      }
      
      if (routeTarget || screenIdParam) {
        nextState.currentLayer = 'player';
        nextState.currentModuleId = routeTarget?.moduleId || moduleIdParam || 'module_02_everyday_cso_work';
        nextState.currentScreenId = routeTarget?.screenId || screenIdParam;
      }

      if (screenIdParam) {
        
        // Configure individual states based on query parameters or defaults
        const checkAccepted = params.get('m2SafeLearningReminderAccepted');
        nextState.m2SafeLearningReminderAccepted = checkAccepted === 'false' ? false : true;
        
        const checklistReviewed = params.get('m2StandardsChecklistReviewed');
        nextState.m2StandardsChecklistReviewed = checklistReviewed === 'false' ? false : true;
        
        // Preset matching and sorting to show feedback / completion
        nextState.m2MatchingCompleted = params.get('m2MatchingCompleted') === 'false' ? false : true;
        nextState.m2SortingCompleted = params.get('m2SortingCompleted') === 'false' ? false : true;
        nextState.m2QuizCompleted = params.get('m2QuizCompleted') === 'false' ? false : true;
        
        // Preset quiz answers to show quiz feedback
        nextState.m2QuizAnswers = {
          q_0: 'A',
          q_1: 'B',
          q_2: 'C',
          q_3: 'A',
          q_4: 'B',
          standards_check: 'A',
          scenario_decision: 'B',
          check_0: 'A',
          check_1: 'B',
          check_2: 'C',
          check_3: 'D'
        };
        
        // Preset portfolio and worksheet fields
        nextState.m2EverydayRightsIssue = 'Water Access';
        nextState.m2EverydayRightsDimension = 'Accountability';
        nextState.m2RightsType = 'Economic rights';
        nextState.m2RightsTypeNote = 'Fictional note for rights types.';
        nextState.m2PlainLanguageRightsExplanation = 'Dignity represents core respect.';
        nextState.m2DecisionChangeType = 'Policy adjustment';
        nextState.m2DecisionChangeNote = 'Reflections on project cycle change.';
        nextState.m2EverydayRightsLens = {
          m2_issue_area: 'Water Access',
          m2_rights_dimensions: ['Accountability', 'Participation'],
          m2_private_note: 'This is a local portfolio entry note.'
        };
        nextState.m2RightsRelevanceWorksheet = {
          situation: 'Remote community lack of service.',
          dimension: 'Participation',
          rights_types: 'Economic and Social rights',
          cso_action: 'Hold community dialogue with local elders.'
        };
        
        // Preset hotspot/timeline/process viewed states so interactive elements are shown as completed
        nextState.m2HotspotViewed = ['Dignity', 'Fairness', 'Participation', 'Accountability'];
        nextState.m2FlashcardsViewed = ['Universal', 'Indivisible', 'Interdependent', 'Inalienable'];
        nextState.m2TabsViewed = ['Civil rights', 'Political rights', 'Economic rights', 'Social rights', 'Cultural rights', 'Collective rights'];
        nextState.m2ProcessViewed = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6'];
        nextState.m2TimelineViewed = ['Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5'];
      }
      return nextState;
    }
    
    return defaultState;
  });

  useEffect(() => {
    saveLearningState(state);
  }, [state]);

  const launchModule = (moduleId: string, reviewMode: boolean) => {
    setState((prev) => {
      const moduleDefinition = getHRBAModuleById(moduleId) || HRBA_COURSE_MODULES[0];
      const targetScreenId = moduleDefinition.startScreenId;
      
      const updatedState = {
        ...prev,
        currentLayer: 'player' as const,
        currentModuleId: moduleId,
        currentScreenId: targetScreenId,
      };

      if (reviewMode) {
        if (moduleId === 'module_02_everyday_cso_work') {
          updatedState.m2PlainLanguageRightsExplanation = '';
          updatedState.m2EverydayRightsIssue = '';
          updatedState.m2EverydayRightsDimension = '';
          updatedState.m2EverydayRightsMap = {};
          updatedState.m2RightsType = '';
          updatedState.m2RightsTypeNote = '';
          updatedState.m2SafeLearningReminderAccepted = false;
          updatedState.m2StandardsChecklistReviewed = false;
          updatedState.m2RightsRelevanceWorksheet = {};
          updatedState.m2DecisionChangeType = '';
          updatedState.m2DecisionChangeNote = '';
          updatedState.m2EverydayRightsLens = {};
          updatedState.m2QuizAnswers = {};
          updatedState.m2QuizCompleted = false;
          updatedState.m2SortingState = {};
          updatedState.m2SortingCompleted = false;
          updatedState.m2MatchingState = {};
          updatedState.m2MatchingCompleted = false;
          updatedState.m2ObjectiveCardsViewed = [];
          updatedState.m2HotspotViewed = [];
          updatedState.m2FlashcardsViewed = [];
          updatedState.m2TabsViewed = [];
          updatedState.m2ProcessViewed = [];
          
          updatedState.screenProgress = {
            ...prev.screenProgress,
            'module_02_everyday_cso_work': []
          };
        } else if (moduleId === 'module_01_hrba_foundations') {
          updatedState.agreementAccepted = false;
          updatedState.orientationAnswers = {};
          updatedState.orientationCompleted = false;
          updatedState.surveyAnswers = {};
          updatedState.surveyPriorities = [];
          updatedState.surveyNote = '';
          updatedState.surveyCompleted = false;
          updatedState.sortingState = {};
          updatedState.sortingCompleted = false;
          updatedState.matchingState = {};
          updatedState.matchingCompleted = false;
          updatedState.scenarioAnswers = {};
          updatedState.scenarioCompleted = {};
          updatedState.m1JourneyActiveStep = 1;
          updatedState.m1JourneyVisitedSteps = [1];
          updatedState.m1WaterPointVisitedClues = [];
          updatedState.m1WaterPointSelectedOption = '';
          updatedState.m1WaterPointSummaryViewed = false;
          updatedState.m1EverydayWorkExplored = [];
          updatedState.m1InclusionPerspectivesExplored = [];
          updatedState.m1ConnectedRightsExplored = [];
          updatedState.m1RightsHolderLensViewed = [];
          updatedState.m1RightsHolderCheckAnswer = '';
          updatedState.m1ActorCategoriesExplored = [];
          updatedState.m1ActorMatchingAnswers = {};
          updatedState.m1ActorMatchingCompleted = false;
          updatedState.m1ParticipationLevelsViewed = [];
          updatedState.m1ParticipationScenarioAnswer = '';
          updatedState.m1ParticipationScenarioCompleted = false;
          updatedState.m1HrbaShiftStepsExplored = [];
          updatedState.m1HrbaShiftAnswer = '';
          updatedState.m1KnowledgeCheckStarted = false;
          updatedState.m1KnowledgeCheckCurrentIndex = 0;
          updatedState.m1KnowledgeCheckSelectedAnswers = {};
          updatedState.m1KnowledgeCheckCheckedQuestions = {};
          updatedState.m1KnowledgeCheckCorrectness = {};
          updatedState.m1KnowledgeCheckScore = 0;
          updatedState.m1KnowledgeCheckCompleted = false;
          updatedState.m1KnowledgeCheckRetryCount = 0;
          updatedState.assessmentFocus = '';
          updatedState.selfAssessmentScores = {};
          updatedState.selfAssessmentTotal = 0;
          updatedState.selfAssessmentCategory = '';
          updatedState.suggestedPriorityOne = '';
          updatedState.suggestedPriorityTwo = '';
          updatedState.screen16Completed = false;
          updatedState.screen17ActionCommitment = {
            selectedPriorityAreas: [],
            selectedAction: null,
            commitmentSentence: null,
            optionalNote: null,
            completed: false,
          };
          updatedState.screen18Completion = {
            reviewedTakeaways: [],
            completed: false,
          };
          updatedState.module1Completion = {
            completed: false,
            completedAt: '',
          };
          updatedState.portfolioShiftSelected = '';
          updatedState.portfolioShiftAreas = [];
          updatedState.portfolioShiftNote = '';
          updatedState.quizAnswers = {};
          updatedState.quizCompleted = false;
          updatedState.quizScore = 0;
          
          updatedState.screenProgress = {
            ...prev.screenProgress,
            'module_01_hrba_foundations': []
          };
        } else {
          updatedState.screenProgress = {
            ...prev.screenProgress,
            [moduleId]: []
          };
        }
      }
      
      return updatedState;
    });
  };

  const exitPlayer = () => {
    setState((prev) => {
      const activeMod = prev.currentModuleId || 'module_01_hrba_foundations';
      const progressList = prev.screenProgress[activeMod] || [];
      const completeScreenId = getHRBAModuleById(activeMod)?.completionScreenId || 'M1-PLAYER-COMPLETE';
      const isCompleted = progressList.includes(completeScreenId);
      
      const completedModules = isCompleted && !prev.completedModules.includes(activeMod)
        ? [...prev.completedModules, activeMod]
        : prev.completedModules;

      return {
        ...prev,
        currentLayer: 'platform' as const,
        completedModules,
      };
    });
  };

  const currentModule = getHRBAModuleById(state.currentModuleId) || HRBA_COURSE_MODULES[0];
  const module3Sequence = [
    {
      Layer: 'Layer 2 Player',
      'Screen/State ID': 'M3-PLAYER-00',
      'Screen/State Title': 'Module 3 Cover Screen',
      'Learning/Purpose': 'Launch Module 3: Applying HRBA in Project Design.',
    },
    ...[
      ['M3-S1-01', 'Module 3 Intro Video: Designing Projects Through a Rights Lens', 'Watch a short introduction to the Module 3 project-design journey.'],
      ['M3-S1-02', 'Learning Objectives', 'Review what you will be able to do as you apply HRBA in project design.'],
      ['M3-S1-03', 'The Proposal Looks Strong — What Is Missing?', 'Review a fictional project proposal that looks organized but misses deeper HRBA design questions.'],
      ['M3-S1-04', 'Build the HRBA Design Snapshot', 'Build a compact design snapshot that connects people, barriers, responsibilities, participation, risks, and the problem statement.'],
      ['M3-S1-05', 'Design for Rights-Holders, Actors, and Responsibilities', 'Map rights-holders, barriers, actors, responsibilities, and the CSO role for a stronger project design.'],
      ['M3-S1-06', 'Find the Root Cause, Capacity Gap, and Participation Risk', 'Diagnose symptoms, root causes, capacity gaps, and participation risks before activities are finalized.'],
      ['M3-S1-06A', 'Strengthen the Objective and Activity Package', 'Convert a weak activity-based objective into a stronger HRBA objective and coherent activity package.'],
      ['M3-S1-06B', 'Practice: Identify Gendered Barriers and Design Implications', 'Connect gendered barriers to practical design implications.'],
      ['M3-S1-06C', 'Disability-Inclusive Project Design', 'Build accessibility and reasonable accommodation into project design.'],
      ['M3-S1-03A', 'HRBA Design Studio: What Must Be Analyzed Before Design?', 'Use a seven-step design studio map to see what analysis should come before activities.'],
      ['M3-S1-03B', 'Practice: Build a Context Snapshot', 'Build a short context snapshot for the fictional project using guided selections.'],
      ['M3-S1-03C', 'Policy Alignment Without Copy-Paste', 'Connect project design choices to rights, SDGs/LNOB, policy priorities, donor priorities, gender, and disability inclusion.'],
      ['M3-S1-03D', 'Practice: Complete a Policy and Standards Alignment Scan', 'Complete a simple alignment scan and turn commitments into practical design choices.'],
      ['M3-S1-07', 'Design Around Responsibilities and Influence', 'Clarify actors, responsibilities, influence, and capacity gaps.'],
      ['M3-S1-08', 'Practice: Build a Design Actor Map', 'Classify rights-holders, duty-bearers, influencing actors, supporting actors, and CSO roles.'],
      ['M3-S1-09', 'Symptom, Root Cause, or Capacity Gap?', 'Separate symptoms, root causes, capacity gaps, discrimination, and structural barriers.'],
      ['M3-S1-09A', 'Lessons Learnt and Synergies Scan', 'Check what already exists before adding new activities.'],
      ['M3-S1-10', 'Practice: Build a Root-Cause and Capacity-Gap Tree', 'Organize diagnosis notes into a practical design tree.'],
      ['M3-S1-11', 'Participation by Design', 'Design meaningful participation into the project.'],
      ['M3-S1-12', 'Practice: Design Meaningful Participation', 'Repair a weak participation plan.'],
      ['M3-S1-13', 'From Activity-Based Objective to HRBA Objective', 'Move from an activity-based objective to a rights-aware objective.'],
      ['M3-S1-14', 'Practice: Strengthen the Objective', 'Practice repairing weak objectives.'],
      ['M3-S1-15', 'Design Activities That Match the Rights Problem', 'Match activities to analyzed barriers, responsibilities, risks, and evidence needs.'],
      ['M3-S1-16', 'Practice: Build a Coherent Activity Package', 'Build an activity package from the analysis.'],
      ['M3-S1-16A', 'From Analysis to Intervention Logic', 'Connect analysis, objective, outputs, activities, risks, assumptions, and evidence.'],
      ['M3-S1-16B', 'Practice: Build a Simple HRBA Intervention Logic', 'Build a simple HRBA intervention logic from the fictional case.'],
      ['M3-S1-17', 'HRBA Do-No-Harm and Design Risk Lab', 'Test project design risks before implementation.'],
      ['M3-S1-18', 'Practice: Build a Risk and Mitigation Plan', 'Turn risk thinking into a practical mitigation and adaptation plan.'],
      ['M3-S1-19', 'Evidence Choices During Design', 'Choose minimum useful and safe evidence for design decisions.'],
      ['M3-S1-20', 'Module Challenge: Repair a Weak HRBA Project Design', 'Apply the full design studio sequence to repair a weak project concept.'],
      ['M3-S1-21', 'Module 3 Knowledge Check', 'Choose the strongest HRBA project design response across six scenarios.'],
      ['M3-S1-22', 'Portfolio Checkpoint: My HRBA Project Design Improvement Snapshot', 'Save a safe project design improvement snapshot to My Portfolio.'],
      ['M3-S1-23', 'Module 3 Resource Pack: HRBA Project Design Toolkit', 'Review the practical HRBA project design toolkit.'],
      ['M3-S1-24', 'Peer Exchange: Using HRBA Design Tools Together', 'Use HRBA design tools safely with peers and teams.'],
      ['M3-S1-25', 'Module 3 Completion: Ready to Move from Design to Implementation', 'Complete Module 3 and prepare for implementation thinking.'],
      ['M3-PLAYER-COMPLETE', 'Module 3 Complete', 'Record Module 3 completion and return to the course page.'],
    ].map(([id, title, purpose]) => ({
      Layer: 'Layer 2 Player',
      'Screen/State ID': id,
      'Screen/State Title': title,
      'Learning/Purpose': purpose,
    })),
  ];
  const module5Sequence = [
    {
      Layer: 'Layer 2 Player',
      'Screen/State ID': 'M5-PLAYER-00',
      'Screen/State Title': 'Module 5 Cover Screen',
      'Learning/Purpose': 'Launch Module 5: HRBA in MEAL.',
    },
    ...[
      ['M5-S1-01', 'Module 5 Intro Video: From Good Numbers to Rights-Based Learning', 'Introduce the shift from activity counting to rights-based evidence, feedback, learning, and reporting.'],
      ['M5-S1-02', 'Learning Objectives', 'Preview what learners will be able to do in HRBA-informed MEAL.'],
      ['M5-S1-03', 'The HRBA MEAL Lens', 'Explore guiding questions that help MEAL look beyond activity counting.'],
      ['M5-S1-04', 'From Counting Activities to Learning About Change', 'Compare output-focused reporting with HRBA-informed evidence.'],
      ['M5-S1-05', 'Practice: Classify the Evidence', 'Classify practical MEAL evidence into HRBA-relevant categories.'],
      ['M5-S1-06', 'Indicator Repair Lab: From Output Indicator to HRBA Indicator', 'Repair weak output indicators into stronger HRBA-informed indicators.'],
      ['M5-S1-07', 'Practice: Strengthen the Indicator Set', 'Improve a weak indicator set so it does not rely only on output counting.'],
      ['M5-S1-07A', 'Gender-Sensitive Evidence and Indicators', 'Use gender-sensitive evidence to make different barriers and benefits visible.'],
      ['M5-S1-07B', 'Gender Marker Readiness in Plain Language', 'Review the evidence trail behind meaningful gender marker readiness.'],
      ['M5-S1-07C', 'Practice: Repair a Gender-Blind Indicator Set', 'Build a stronger gender-sensitive indicator set.'],
      ['M5-S1-08', 'The Danger of Too Much Detail', 'Identify unsafe data details and safer ways to make exclusion visible.'],
      ['M5-S1-09', 'Practice: Choose Safer Disaggregation', 'Choose useful and safe levels of disaggregation for MEAL decisions.'],
      ['M5-S1-09A', 'Disability Inclusion in HRBA MEAL', 'Make accessibility, participation, and reasonable accommodation visible in MEAL.'],
      ['M5-S1-09B', 'Disability Marker Readiness in Plain Language', 'Review the evidence trail behind disability inclusion readiness.'],
      ['M5-S1-09C', 'Disability Data Is Not Diagnosis', 'Choose respectful disability data practices that support accessibility.'],
      ['M5-S1-09D', 'Practice: Choose Safe Disability Data Options', 'Practice disability-related data choices that are useful, respectful, and safe.'],
      ['M5-S1-10', 'Feedback Data Is Evidence Too', 'Trace how feedback moves from receipt to learning and report-back.'],
      ['M5-S1-11', 'Practice: Turn Feedback into an Action Decision', 'Interpret fictional feedback themes and choose responsible action.'],
      ['M5-S1-12', 'Ethical Storytelling and Qualitative Evidence', 'Identify risky storytelling practices and safer alternatives.'],
      ['M5-S1-13', 'Practice: Respond to a Risky Donor Story Request', 'Respond professionally to a risky story request and offer safer alternatives.'],
      ['M5-S1-14', 'Reading the Signals: When Evidence Says the Plan Should Change', 'Interpret mixed evidence signals as prompts for adaptation.'],
      ['M5-S1-15', 'Practice: Adapt Based on Evidence', 'Choose responsible adaptation decisions based on mixed evidence.'],
      ['M5-S1-15A', 'Light HRBA Logframe Review: Does the Evidence Match the Logic?', 'Check whether objectives, indicators, sources, risks, and inclusion commitments align.'],
      ['M5-S1-16', 'Responsible Reporting: Tell the Truth Safely', 'Repair risky reporting language into evidence-based, dignity-preserving claims.'],
      ['M5-S1-17', 'Practice: Spot Risky Reporting Claims', 'Diagnose risky, unsupported, unsafe, or overconfident reporting claims.'],
      ['M5-S1-18', 'Capstone Evidence Simulator', 'Review a fictional evidence file and make safe, useful MEAL decisions.'],
      ['M5-S1-19', 'Module 5 Synthesis: What HRBA MEAL Adds', 'Consolidate the shift from surface numbers to rights-aware evidence and learning.'],
      ['M5-S1-20', 'Portfolio Checkpoint: HRBA MEAL Improvement Plan', 'Create a practical HRBA MEAL improvement plan.'],
      ['M5-S1-21', 'Final Course Portfolio Synthesis', 'Connect Module 5 outputs with the full HRBA practice portfolio.'],
      ['M5-S1-22', '90-Day HRBA MEAL Action Plan', 'Commit to a realistic 90-day HRBA MEAL action.'],
      ['M5-S1-23', 'Module 5 Resource Pack', 'Review practical tools for continued use.'],
      ['M5-S1-24', 'Peer Exchange and Practice Clinics', 'Use HRBA MEAL tools safely with peers and teams.'],
      ['M5-S1-25', 'Final Completion Bridge: From Course to Practice', 'Complete Module 5 and move from course learning to practice.'],
      ['M5-PLAYER-COMPLETE', 'Module 5 Complete', 'Record Module 5 completion and return to the course page.'],
    ].map(([id, title, purpose]) => ({
      Layer: 'Layer 2 Player',
      'Screen/State ID': id,
      'Screen/State Title': title,
      'Learning/Purpose': purpose,
    })),
  ];
  const currentSequence = state.currentModuleId === 'module_02_everyday_cso_work'
    ? m2Sequence
    : state.currentModuleId === 'module_01_hrba_foundations'
      ? m1Sequence
    : state.currentModuleId === 'module_03_project_design'
        ? module3Sequence
    : state.currentModuleId === 'module_04_implementation'
        ? [
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-PLAYER-00',
              'Screen/State Title': 'Module 4 Cover Screen',
              'Learning/Purpose': 'Launch Module 4: Applying HRBA During Implementation.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-01',
              'Screen/State Title': 'Module 4 Intro Video: Keeping HRBA Alive During Delivery',
              'Learning/Purpose': 'Watch a short introduction to keeping HRBA alive during implementation.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-02',
              'Screen/State Title': 'Learning Objectives',
              'Learning/Purpose': 'Review what you will be able to do while applying HRBA during implementation.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-03',
              'Screen/State Title': 'The Plan Is Being Delivered — But Something Is Changing',
              'Learning/Purpose': 'Diagnose implementation warning signs before exclusion becomes normal.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-04',
              'Screen/State Title': 'The HRBA Implementation Lens',
              'Learning/Purpose': 'Open the eight-point implementation lens and synthesize what teams should keep checking during delivery.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-05',
              'Screen/State Title': 'Participation Must Stay Alive During Delivery',
              'Learning/Purpose': 'Diagnose the participation delivery cycle and identify practical repair actions.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-06',
              'Screen/State Title': 'Inclusive Delivery: Equal Invitation Is Not Equal Access',
              'Learning/Purpose': 'Match practical access barriers with safer inclusive delivery adjustments.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-07',
              'Screen/State Title': 'Feedback Becomes Accountability Only When There Is Response',
              'Learning/Purpose': 'Repair a weak feedback loop so concerns receive safe response, follow-up, and adaptation.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-08',
              'Screen/State Title': 'Engage Actors Without Blame, Capture, or Confusion',
              'Learning/Purpose': 'Choose safer actor-engagement responses that protect role clarity, fair access, and rights-holder voice.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-09',
              'Screen/State Title': 'Adapt the Project Without Doing Harm',
              'Learning/Purpose': 'Use implementation evidence to choose safe adaptations and avoid harmful shortcuts.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-10',
              'Screen/State Title': 'Portfolio Checkpoint: My Safe Implementation Adjustment Note',
              'Learning/Purpose': 'Save a private Module 4 portfolio note about safe implementation adjustment.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-11',
              'Screen/State Title': 'Module 4 Knowledge Check',
              'Learning/Purpose': 'Assess practical HRBA judgment during implementation through six scenario-based questions.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-12',
              'Screen/State Title': 'Module Summary',
              'Learning/Purpose': 'Consolidate the main implementation capabilities from Module 4.',
            },
            {
              Layer: 'Layer 2 Player',
              'Screen/State ID': 'M4-S1-13',
              'Screen/State Title': 'Module 4 Completion and Transition',
              'Learning/Purpose': 'Confirm Module 4 completion, portfolio save, and transition to Module 5.',
            },
          ]
    : state.currentModuleId === 'module_05_hrba_meal'
        ? module5Sequence
      : [
          {
            Layer: 'Layer 2 Player',
            'Screen/State ID': currentModule.startScreenId,
            'Screen/State Title': currentModule.title,
            'Learning/Purpose': currentModule.description,
          },
          {
            Layer: 'Layer 2 Player',
            'Screen/State ID': currentModule.completionScreenId,
            'Screen/State Title': `${currentModule.title} Content Placeholder`,
            'Learning/Purpose': currentModule.description,
          },
        ];

  useEffect(() => {
    emitPortalProgress(state, currentSequence);
  }, [state, currentSequence]);

  if (state.currentLayer === 'platform') {
    return (
      <PlatformShell
        completedModules={state.completedModules}
        screenProgress={state.screenProgress}
        currentModuleId={state.currentModuleId}
        currentScreenId={state.currentScreenId}
        onLaunchModule={launchModule}
      />
    );
  }

  return (
    <CoursePlayerShell
      state={state}
      onChangeState={setState}
      onExit={exitPlayer}
      sequenceData={currentSequence}
    />
  );
}
