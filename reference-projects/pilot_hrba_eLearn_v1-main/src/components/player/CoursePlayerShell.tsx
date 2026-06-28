import type { LearningState } from '../../state/learningState';
import { getHRBAModuleById } from '../../data/hrbaCourseModules';

import PlayerHeader from './PlayerHeader';
import PlayerSidebar from './PlayerSidebar';
import ProgressStrip from './ProgressStrip';
import MainScreenCanvas from './MainScreenCanvas';
import PartnerLogoFooter from './PartnerLogoFooter';
import HelpOverlay from './HelpOverlay';
import AccessibilityModal from './AccessibilityModal';
import GlossaryModal from './GlossaryModal';
import ResourcesModal from './ResourcesModal';
import ScreenRenderer from '../course/ScreenRenderer';

interface CoursePlayerShellProps {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
  onExit: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sequenceData: any[];
}

export default function CoursePlayerShell({
  state,
  onChangeState,
  onExit,
  sequenceData
}: CoursePlayerShellProps) {
  // Filter player-specific screens from the sequence data
  const allPlayerScreens = sequenceData.filter(
    (item) => item.Layer === 'Layer 2 Player'
  );
  const module1ActiveScreenIds = [
    'M1-PLAYER-00',
    'M1-S1-02',
    'M1-S1-01',
    'M1-S1-03',
    'M1-S1-04',
    'M1-S1-05',
    'M1-S1-06',
    'M1-S1-06A',
    'M1-S1-06B',
    'M1-S1-07',
    'M1-S1-08',
    'M1-S2-01',
    'M1-S2-02',
    'M1-S2-03',
    'M1-S2-04',
    'M1-S2-05',
    'M1-S3-01',
    'M1-S3-02',
    'M1-PLAYER-COMPLETE'
  ];
  const module1ScreenById = new Map(
    allPlayerScreens.map((item) => [item['Screen/State ID'], item])
  );
  const playerScreens = state.currentModuleId === 'module_01_hrba_foundations'
    ? module1ActiveScreenIds
      .map((screenId) => module1ScreenById.get(screenId))
      .filter((item): item is (typeof allPlayerScreens)[number] => Boolean(item))
    : allPlayerScreens;

  // totalScreens is derived dynamically from filtered playerScreens — not hardcoded
  const totalScreens = playerScreens.length;

  // playerIndex: derived position within playerScreens (0-based)
  const playerIndex = Math.max(
    0,
    playerScreens.findIndex(
      (item) => item['Screen/State ID'] === state.currentScreenId
    )
  );

  // Current screen resolved from playerScreens via playerIndex
  const currentScreen = playerScreens[playerIndex];
  const screenTitle = currentScreen ? currentScreen['Screen/State Title'] : '';
  const screenId = currentScreen ? currentScreen['Screen/State ID'] : '';
  const isWaterPointSequenceScreen = screenId === 'M1-S1-04' || screenId === 'M1-S1-05' || screenId === 'M1-S1-06' || screenId === 'M1-S1-06A' || screenId === 'M1-S1-06B' || screenId === 'M1-S1-07' || screenId === 'M1-S1-08' || screenId === 'M1-S2-01' || screenId === 'M1-S2-02' || screenId === 'M1-S2-03' || screenId === 'M1-S2-04' || screenId === 'M1-S2-05' || screenId === 'M1-S3-01' || screenId === 'M1-S3-02' || screenId === 'M1-PLAYER-COMPLETE';

  // Handle Navigation — operates entirely on playerScreens array bounds
  const handlePrev = () => {
    if (playerIndex > 0) {
      const nextIdx = playerIndex - 1;
      const targetScreen = playerScreens[nextIdx];
      onChangeState((prev) => ({
        ...prev,
        currentScreenId: targetScreen['Screen/State ID']
      }));
    }
  };

  const handleNext = () => {
    if (playerIndex < totalScreens - 1) {
      const nextIdx = playerIndex + 1;
      const targetScreen = playerScreens[nextIdx];
      onChangeState((prev) => {
        // Record screen progress
        const currentProgress = prev.screenProgress[prev.currentModuleId || 'module_01_hrba_foundations'] || [];
        const updatedProgress = currentProgress.includes(screenId)
          ? currentProgress
          : [...currentProgress, screenId];

        return {
          ...prev,
          currentScreenId: targetScreen['Screen/State ID'],
          screenProgress: {
            ...prev.screenProgress,
            [prev.currentModuleId || 'module_01_hrba_foundations']: updatedProgress
          }
        };
      });
    }
  };

  const handleToggleModal = (modal: LearningState['activeModal']) => {
    onChangeState((prev) => ({
      ...prev,
      activeModal: modal
    }));
  };

  const handleReplay = () => {
    // Reload state: toggle and reset state variables to clear local interactive inputs
    if (state.currentModuleId === 'module_02_everyday_cso_work') {
      onChangeState((prev) => {
        const nextScreenProgress = screenId
          ? Object.fromEntries(
              Object.entries(prev.screenProgress).map(([moduleId, completedScreenIds]) => [
                moduleId,
                completedScreenIds.filter((completedScreenId) => completedScreenId !== screenId),
              ])
            )
          : prev.screenProgress;
        const remainingPracticeCheckState = { ...prev.practiceCheckState };
        if (screenId === 'M2-S01A') {
          delete remainingPracticeCheckState.module2_intro_video;
        } else if (screenId === 'M2-S02') {
          delete remainingPracticeCheckState.m2_s02_learning_objectives;
        } else if (screenId === 'M2-S03') {
          delete remainingPracticeCheckState.m2_s03_everyday_claims;
        } else if (screenId === 'M2-S05') {
          delete remainingPracticeCheckState.module2_screen24_characteristics;
        } else if (screenId === 'M2-S06') {
          delete remainingPracticeCheckState.module2_screen25_characteristics_match;
        } else if (screenId === 'M2-S07') {
          delete remainingPracticeCheckState.module2_screen26_working_principles;
        } else if (screenId === 'M2-S08') {
          delete remainingPracticeCheckState.module2_screen27_rights_holders;
        } else if (screenId === 'M2-S09') {
          delete remainingPracticeCheckState.module2_screen28_intersectionality;
        } else if (screenId === 'M2-S10') {
          delete remainingPracticeCheckState.module2_screen29_actor_ecosystem;
        } else if (screenId === 'M2-S11') {
          delete remainingPracticeCheckState.module2_screen210_cso_roles;
        } else if (screenId === 'M2-S12') {
          delete remainingPracticeCheckState.module2_screen212_safe_standards;
        } else if (screenId === 'M2-S13') {
          delete remainingPracticeCheckState.module2_screen213_sdg_lnob;
        } else if (screenId === 'M2-S14') {
          delete remainingPracticeCheckState.module2_screen214_participation_attendance;
        } else if (screenId === 'M2-S15') {
          delete remainingPracticeCheckState.module2_screen215_participation_practice;
        } else if (screenId === 'M2-S16') {
          delete remainingPracticeCheckState.module2_screen216_accountability_loop;
        } else if (screenId === 'M2-S17') {
          delete remainingPracticeCheckState.module2_screen217_feedback_loop_repair;
        } else if (screenId === 'M2-S18') {
          delete remainingPracticeCheckState.module2_screen218_power_exclusion;
        } else if (screenId === 'M2-S19') {
          delete remainingPracticeCheckState.module2_screen219_trace_exclusion_pathway;
        } else if (screenId === 'M2-S20') {
          delete remainingPracticeCheckState.module2_screen221_everyday_rights_lens;
        } else if (screenId === 'M2-S21') {
          delete remainingPracticeCheckState.module2_screen222_portfolio_checkpoint_lens;
        } else if (screenId === 'M2-S22') {
          delete remainingPracticeCheckState.module2_screen223_knowledge_check;
        } else if (screenId === 'M2-S23') {
          delete remainingPracticeCheckState.module2_screen224_close_transition;
        }

        return {
          ...prev,
          m2ObjectiveCardsViewed: screenId === 'M2-S02' ? [] : prev.m2ObjectiveCardsViewed,
          m2HotspotViewed: screenId === 'M2-S04' ? [] : prev.m2HotspotViewed,
          screenProgress: nextScreenProgress,
          practiceCheckState: remainingPracticeCheckState,
          m2MatchingState: screenId === 'M2-S06' ? {} : prev.m2MatchingState,
          m2MatchingCompleted: screenId === 'M2-S06' ? false : prev.m2MatchingCompleted,
          m2FlashcardsViewed: screenId === 'M2-S05' ? [] : prev.m2FlashcardsViewed,
          m2TabsViewed: screenId === 'M2-S08' ? [] : prev.m2TabsViewed,
          m2SortingState: screenId === 'M2-S09' ? {} : prev.m2SortingState,
          m2SortingCompleted: screenId === 'M2-S09' ? false : prev.m2SortingCompleted,
          m2TimelineViewed: screenId === 'M2-S13' ? [] : prev.m2TimelineViewed,
        };
      });
    } else {
      if (screenId === 'M1-S1-06A') {
        onChangeState((prev) => ({ ...prev, m1EverydayWorkExplored: [] }));
      } else if (screenId === 'M1-S1-06B') {
        onChangeState((prev) => ({ ...prev, m1InclusionPerspectivesExplored: [] }));
      } else if (screenId === 'M1-S1-07') {
        onChangeState((prev) => ({ ...prev, m1ConnectedRightsExplored: [] }));
      } else if (screenId === 'M1-S1-08') {
        onChangeState((prev) => ({ ...prev, m1RightsHolderLensViewed: [], m1RightsHolderCheckAnswer: '' }));
      } else if (screenId === 'M1-S2-01') {
        onChangeState((prev) => ({ ...prev, m1ActorCategoriesExplored: [], m1ActorMatchingAnswers: {}, m1ActorMatchingCompleted: false }));
      } else if (screenId === 'M1-S2-02') {
        onChangeState((prev) => ({ ...prev, m1ParticipationLevelsViewed: [], m1ParticipationScenarioAnswer: '', m1ParticipationScenarioCompleted: false }));
      } else if (screenId === 'M1-S2-03') {
        onChangeState((prev) => ({ ...prev, m1HrbaShiftStepsExplored: [], m1HrbaShiftAnswer: '' }));
      } else if (screenId === 'M1-S2-04') {
        onChangeState((prev) => ({
          ...prev,
          m1KnowledgeCheckStarted: false,
          m1KnowledgeCheckCurrentIndex: 0,
          m1KnowledgeCheckSelectedAnswers: {},
          m1KnowledgeCheckCheckedQuestions: {},
          m1KnowledgeCheckCorrectness: {},
          m1KnowledgeCheckScore: 0,
          m1KnowledgeCheckCompleted: false,
          m1KnowledgeCheckRetryCount: 0
        }));
      } else if (screenId === 'M1-S2-05') {
        onChangeState((prev) => ({
          ...prev,
          assessmentFocus: '',
          m1SelfAssessmentPage: 0,
          selfAssessmentScores: {},
          selfAssessmentTotal: 0,
          selfAssessmentCategory: '',
          suggestedPriorityOne: '',
          suggestedPriorityTwo: '',
          screen16Completed: false
        }));
      } else if (screenId === 'M1-S3-01') {
        onChangeState((prev) => ({
          ...prev,
          screen17ActionCommitment: {
            selectedPriorityAreas: [],
            selectedAction: null,
            commitmentSentence: null,
            optionalNote: null,
            completed: false
          }
        }));
      } else if (screenId === 'M1-S3-02') {
        onChangeState((prev) => {
          const moduleId = prev.currentModuleId || 'module_01_hrba_foundations';
          const moduleProgress = prev.screenProgress[moduleId] || [];
          return {
            ...prev,
            screen18Completion: {
              reviewedTakeaways: [],
              completed: false
            },
            module1Completion: {
              completed: false,
              completedAt: ''
            },
            completedModules: prev.completedModules.filter((id) => id !== 'module_01_hrba_foundations'),
            screenProgress: {
              ...prev.screenProgress,
              [moduleId]: moduleProgress.filter((id) => id !== 'M1-S3-02' && id !== 'M1-PLAYER-COMPLETE')
            }
          };
        });
      } else if (screenId === 'M1-S1-03') {
        onChangeState((prev) => ({ ...prev, m1JourneyActiveStep: 1, m1JourneyVisitedSteps: [] }));
      } else if (screenId === 'M1-S1-05') {
        onChangeState((prev) => ({
          ...prev,
          m1WaterPointVisitedClues: []
        }));
      } else if (screenId === 'M1-S1-06') {
        onChangeState((prev) => ({
          ...prev,
          m1WaterPointSelectedOption: '',
          m1WaterPointSummaryViewed: false,
          scenarioCompleted: {
            ...prev.scenarioCompleted,
            'M1-S1-06': false
          }
        }));
      } else if (screenId === 'M1-S4-02') {
        onChangeState((prev) => ({ ...prev, sortingState: {}, sortingCompleted: false }));
      } else if (screenId === 'M1-S5-03') {
        onChangeState((prev) => ({ ...prev, matchingState: {}, matchingCompleted: false }));
      } else if (screenId === 'M1-S6-05') {
        onChangeState((prev) => ({ ...prev, surveyAnswers: {}, surveyCompleted: false }));
      } else if (screenId === 'M1-S7-02') {
        onChangeState((prev) => ({ ...prev, quizAnswers: {}, quizCompleted: false, quizScore: 0 }));
      }
    }

    // Toggle activeModal momentarily to trigger re-render of ScreenRenderer
    const currentId = state.currentScreenId;
    onChangeState(prev => ({ ...prev, currentScreenId: null }));
    setTimeout(() => {
      onChangeState(prev => ({ ...prev, currentScreenId: currentId }));
    }, 10);
  };

  // Progress percentage derived from playerIndex position within playerScreens — fully dynamic
  const progressPercent = Math.round(((playerIndex + 1) / totalScreens) * 100);

  // Disable Next button logic based on screen rules
  const isNextDisabled = () => {
    if (state.currentModuleId === 'module_02_everyday_cso_work') {
      if (
        screenId === 'M2-S02' &&
        (
          (state.m2ObjectiveCardsViewed || []).length < 6 &&
          !(state.screenProgress.module_02_everyday_cso_work || []).includes('M2-S02')
        )
      ) {
        return true;
      }
      
      const lockedScreens = [
        'M2-S01A', 'M2-S03', 'M2-S04', 'M2-S05', 'M2-S06', 'M2-S07', 'M2-S08', 'M2-S09', 'M2-S10',
        'M2-S11', 'M2-S12', 'M2-S13', 'M2-S14', 'M2-S15', 'M2-S16', 'M2-S17', 'M2-S18',
        'M2-S19', 'M2-S20', 'M2-S21', 'M2-S22'
      ];
      
      if (lockedScreens.includes(screenId) && !(state.screenProgress.module_02_everyday_cso_work || []).includes(screenId)) {
        return true;
      }
      
      return false;
    } else if (state.currentModuleId === 'module_03_project_design') {
      if (
        screenId.startsWith('M3-S1-') &&
        !(state.screenProgress.module_03_project_design || []).includes(screenId)
      ) {
        return true;
      }
      return false;
    } else if (state.currentModuleId === 'module_04_implementation') {
      if (
        screenId.startsWith('M4-S1-') &&
        !(state.screenProgress.module_04_implementation || []).includes(screenId)
      ) {
        return true;
      }
      return false;
    } else if (state.currentModuleId === 'module_05_hrba_meal') {
      if (
        screenId.startsWith('M5-S1-') &&
        !(state.screenProgress.module_05_hrba_meal || []).includes(screenId)
      ) {
        return true;
      }
      return false;
    } else {
      if (screenId === 'M1-S1-03' && state.m1JourneyVisitedSteps.length < 6) {
        return true; // all six journey steps must be explored
      }
      if (
        screenId === 'M1-S1-05' &&
        state.m1WaterPointVisitedClues.length < 4
      ) {
        return true; // explore all four water point clues before advancing
      }
      if (
        screenId === 'M1-S1-06' &&
        (!state.m1WaterPointSelectedOption || !state.m1WaterPointSummaryViewed)
      ) {
        return true; // choose an answer and review feedback before advancing
      }
      if (screenId === 'M1-S1-06A' && state.m1EverydayWorkExplored.length < 6) {
        return true; // explore all six everyday work areas before advancing
      }
      if (screenId === 'M1-S1-06B' && state.m1InclusionPerspectivesExplored.length < 6) {
        return true; // explore all six inclusion perspectives before advancing
      }
      if (screenId === 'M1-S1-07' && state.m1ConnectedRightsExplored.length < 6) {
        return true; // explore all six connected rights before advancing
      }
      if (screenId === 'M1-S1-08' && state.m1RightsHolderLensViewed.length < 2) {
        return true; // compare both lenses before advancing
      }
      if (
        screenId === 'M1-S2-01' &&
        (
          state.m1ActorCategoriesExplored.length < 3 ||
          state.m1ActorMatchingAnswers['community-members'] !== 'rights-holders' ||
          state.m1ActorMatchingAnswers['water-office'] !== 'duty-bearers' ||
          state.m1ActorMatchingAnswers['local-cso'] !== 'supporting' ||
          state.m1ActorMatchingAnswers['water-committee'] !== 'supporting'
        )
      ) {
        return true; // explore actor categories and complete 4-item matching before advancing
      }
      if (screenId === 'M1-S2-02' && state.m1ParticipationLevelsViewed.length < 5) {
        return true; // explore participation levels before advancing
      }
      if (screenId === 'M1-S2-03' && state.m1HrbaShiftStepsExplored.length < 5) {
        return true; // explore all five HRBA shifts before advancing
      }
      if (screenId === 'M1-S2-04' && !state.m1KnowledgeCheckCompleted) {
        return true; // finish the Module 1 knowledge check result step before advancing
      }
      if (screenId === 'M1-S2-05' && !state.screen16Completed) {
        return true; // complete the self-assessment before choosing a priority area
      }
      if (screenId === 'M1-S3-01' && !state.screen17ActionCommitment.completed) {
        return true; // choose a priority and action commitment before advancing
      }
      if (screenId === 'M1-S3-02' && !state.screen18Completion.completed) {
        return true; // review all five takeaways before moving to the final closing screen
      }
      if (screenId === 'M1-S6-05' && !state.surveyCompleted) {
        // Allow moving on only if survey completed/submitted
        return Object.keys(state.surveyAnswers).length < 16;
      }
      if (screenId === 'M1-S6-08' && state.surveyPriorities.length !== 2) {
        return true; // choose exactly 2 priorities
      }
      if (screenId === 'M1-S7-02' && !state.quizCompleted) {
        return true; // formative quiz required
      }
      return false;
    }
  };

  const activeModule = getHRBAModuleById(state.currentModuleId);
  const moduleTitle = activeModule
    ? activeModule.itemLabel === activeModule.title
      ? activeModule.title
      : `${activeModule.itemLabel}: ${activeModule.title}`
    : 'Module 1: Starting the HRBA Learning Journey';
  return (
    <div className="player-container course-shell">
      <ProgressStrip percentage={progressPercent} />

      <PlayerHeader
        moduleTitle={moduleTitle}
        screenTitle={screenTitle}
        currentIndex={playerIndex + 1}
        totalScreens={totalScreens}
        onPrev={handlePrev}
        onNext={handleNext}
        onExit={onExit}
        prevDisabled={playerIndex === 0}
        nextDisabled={playerIndex >= totalScreens - 1 || isNextDisabled()}
      />

      <div className="player-split-canvas">
        <PlayerSidebar
          onToggleModal={handleToggleModal}
          activeModal={state.activeModal}
          transcriptVisible={state.transcriptVisible}
          onToggleTranscript={() => onChangeState(p => ({ ...p, transcriptVisible: !p.transcriptVisible }))}
          soundEnabled={state.soundState}
          onToggleSound={() => onChangeState(p => ({ ...p, soundState: !p.soundState }))}
          playEnabled={state.captionState}
          onTogglePlay={() => onChangeState(p => ({ ...p, captionState: !p.captionState }))}
          onReplay={handleReplay}
          onExit={onExit}
        />

        <MainScreenCanvas
          className={isWaterPointSequenceScreen ? 'player-main-content--water-sequence' : ''}
        >
          <ScreenRenderer
            screenId={screenId}
            state={state}
            onChangeState={onChangeState}
            onNext={handleNext}
          />

          {state.transcriptVisible && currentScreen && (
            <div
              className="player-transcript-panel"
            >
              <h4>Closed Captions / Screen Text Transcript</h4>
              <p>
                {currentScreen['Learning/Purpose'] || 'Audio transcript and closed captions descriptions for this learning screen state.'}
              </p>
            </div>
          )}
        </MainScreenCanvas>
      </div>

      <PartnerLogoFooter />

      {/* Menu Drawer Modal */}
      {state.activeModal === 'menu' && (
        <div
          onClick={() => handleToggleModal(null)}
          style={{ position: 'fixed', top: '68px', left: '180px', right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 100 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '320px',
              height: '100%',
              backgroundColor: 'var(--player-sidebar-bg)',
              borderRight: '1px solid var(--player-sidebar-border)',
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-family-headings)' }}>
              Jump to Screen
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {playerScreens.map((screen, idx) => {
                const active = idx === playerIndex;

                return (
                  <button
                    key={screen['Screen/State ID']}
                    onClick={() => {
                      onChangeState(prev => ({ ...prev, currentScreenId: screen['Screen/State ID'] }));
                      handleToggleModal(null);
                    }}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: active ? '1px solid var(--color-primary)' : '1px solid transparent',
                      backgroundColor: active ? 'rgba(59, 153, 212, 0.15)' : 'transparent',
                      color: active ? '#fff' : '#cbd5e1',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {idx + 1}. {screen['Screen/State Title']}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Help Overlay Guide */}
      {state.activeModal === 'help' && (
        <HelpOverlay onClose={() => handleToggleModal(null)} />
      )}

      {/* Accessibility Modal */}
      {state.activeModal === 'accessibility' && (
        <AccessibilityModal onClose={() => handleToggleModal(null)} />
      )}

      {/* Glossary Modal */}
      {state.activeModal === 'glossary' && (
        <GlossaryModal onClose={() => handleToggleModal(null)} />
      )}

      {/* Resources Modal */}
      {state.activeModal === 'resources' && (
        <ResourcesModal onClose={() => handleToggleModal(null)} />
      )}
    </div>
  );
}
