import type { LearningState } from '../../state/learningState';
import { getHRBAModuleById } from '../../data/hrbaCourseModules';
import Module1Renderer from './Module1Renderer';
import Module2Renderer from './Module2Renderer';
import Module3Renderer from './Module3Renderer';
import Module4Renderer from './Module4Renderer';
import Module5Renderer from './Module5Renderer';
import CourseItemCoverScreen from './CourseItemCoverScreen';

interface ScreenRendererProps {
  screenId: string;
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
  onNext: () => void;
}

export default function ScreenRenderer({ screenId, state, onChangeState, onNext }: ScreenRendererProps) {
  const isModule2CoverScreen = screenId === 'M2-S01';
  const isModule3CoverScreen = screenId === 'M3-PLAYER-00';
  const isModule4CoverScreen = screenId === 'M4-PLAYER-00';
  const isModule5CoverScreen = screenId === 'M5-PLAYER-00';
  const isFinalAssessmentCoverScreen = screenId === 'FINAL-ASSESSMENT-PLAYER-00';
  const isModule1CoverScreen = screenId === 'M1-PLAYER-00';
  const isCourseItemCoverScreen = isModule1CoverScreen || isModule2CoverScreen || isModule3CoverScreen || isModule4CoverScreen || isModule5CoverScreen || isFinalAssessmentCoverScreen;
  const isModule3BuiltScreen = screenId.startsWith('M3-S1-') || screenId === 'M3-PLAYER-COMPLETE';
  const isModule4BuiltScreen = screenId.startsWith('M4-S1-');
  const isModule5BuiltScreen = screenId.startsWith('M5-S1-') || screenId === 'M5-PLAYER-COMPLETE';
  const isModule2CuratedWideScreen = ['M2-S01A', 'M2-S02', 'M2-S03', 'M2-S04', 'M2-S05', 'M2-S06', 'M2-S07', 'M2-S08', 'M2-S09', 'M2-S10', 'M2-S11', 'M2-S12', 'M2-S13', 'M2-S14', 'M2-S15', 'M2-S16', 'M2-S17', 'M2-S18', 'M2-S19', 'M2-S20', 'M2-S21', 'M2-S22', 'M2-S23'].includes(screenId);
  const isWideOpeningScreen = isModule5BuiltScreen || isModule4BuiltScreen || isModule3BuiltScreen || isModule2CoverScreen || isModule2CuratedWideScreen || screenId === 'M1-PLAYER-00' || screenId === 'M1-S1-01' || screenId === 'M1-S1-02' || screenId === 'M1-S1-03' || screenId === 'M1-S1-04' || screenId === 'M1-S1-05' || screenId === 'M1-S1-06' || screenId === 'M1-S1-08' || screenId === 'M1-S2-01' || screenId === 'M1-S2-02' || screenId === 'M1-S2-03';
  const moduleDefinition = getHRBAModuleById(state.currentModuleId);

  if (isCourseItemCoverScreen && moduleDefinition) {
    return (
      <CourseItemCoverScreen
        module={moduleDefinition}
        onChangeState={onChangeState}
        onNext={onNext}
      />
    );
  }

  if (isModule3BuiltScreen) {
    return (
      <Module3Renderer
        screenId={screenId}
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (isModule4BuiltScreen) {
    return (
      <Module4Renderer
        screenId={screenId}
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (isModule5BuiltScreen) {
    return (
      <Module5Renderer
        screenId={screenId}
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId.startsWith('M3-') || screenId.startsWith('M4-') || screenId.startsWith('M5-') || screenId.startsWith('FINAL-ASSESSMENT-')) {
    return (
      <div className="future-module-screen" aria-labelledby="future-module-title">
        {moduleDefinition && (
          <img
            src={moduleDefinition.thumbnailSrc}
            alt={moduleDefinition.thumbnailAlt}
            className="future-module-screen__image"
          />
        )}
        <div className="future-module-screen__body">
          <p className="future-module-screen__eyebrow">{moduleDefinition?.itemLabel || ''}</p>
          <h1 id="future-module-title">{moduleDefinition?.title || 'Module content'}</h1>
          {moduleDefinition?.subtitle && (
            <p className="future-module-screen__subtitle">{moduleDefinition.subtitle}</p>
          )}
          <p>{moduleDefinition?.description}</p>
          <p className="future-module-screen__note">
            This course item is part of the final HRBA learning pathway. Its detailed interactive screens are not included in this repository build yet, so the course page keeps the pathway visible without routing learners into the wrong item.
          </p>
          <button
            type="button"
            onClick={() => onChangeState((prev) => ({
              ...prev,
              currentLayer: 'platform',
              currentSubState: null,
              activeModal: null,
            }))}
          >
            Return to course page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      key={screenId}
      style={{
        width: '100%',
        maxWidth: isModule2CoverScreen || isModule3CoverScreen || isModule5CoverScreen ? 'none' : isWideOpeningScreen ? '1180px' : '800px',
        margin: '0 auto'
      }}
    >
      {screenId.startsWith('M2-') ? (
        <Module2Renderer
          screenId={screenId}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
        />
      ) : (
        <Module1Renderer
          screenId={screenId}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
        />
      )}
    </div>
  );
}
