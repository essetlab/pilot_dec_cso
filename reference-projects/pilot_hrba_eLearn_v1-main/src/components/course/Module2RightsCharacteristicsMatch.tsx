import type { LearningState } from '../../state/learningState';

type Module2RightsCharacteristicsMatchProps = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type CharacteristicId = 'Universal' | 'Inalienable' | 'Indivisible' | 'Interdependent';

type Situation = {
  id: string;
  title: string;
  text: string;
  correctMatch: CharacteristicId;
  correctFeedback: string;
  incorrectFeedback: string;
  marker: string;
};

type FeedbackState = {
  situationId: string;
  selected: CharacteristicId;
  isCorrect: boolean;
  completed: boolean;
  message: string;
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S06';
const NEXT_SCREEN_ID = 'M2-S07';
const NEXT_ROUTE = '/module-2/screen-2-7';

const characteristicOptions: { id: CharacteristicId; reminder: string }[] = [
  { id: 'Universal', reminder: 'Who is missing or not considered?' },
  { id: 'Inalienable', reminder: 'Is dignity treated as optional?' },
  { id: 'Indivisible', reminder: 'Are connected rights being separated?' },
  { id: 'Interdependent', reminder: 'Does one barrier affect another right?' },
];

const situations: Situation[] = [
  {
    id: 'FULL_ROOM',
    title: 'The full room',
    text:
      'Many people attended the consultation. Later, the team realizes that people living far from the main road did not hear about it.',
    correctMatch: 'Universal',
    correctFeedback:
      'Yes. Universal asks whether all people were considered, not only those who were visible, nearby, or easy to reach.',
    incorrectFeedback:
      'Look again at who was missing. The strongest issue is whether everyone had a real chance to be considered.',
    marker: 'U',
  },
  {
    id: 'FAVOR_LIST',
    title: 'The favor list',
    text:
      'A local committee says livelihood support is a favor from leaders, so people should not ask questions about selection criteria.',
    correctMatch: 'Inalienable',
    correctFeedback:
      'Yes. Inalienable reminds us that rights are not favors. People should be treated with dignity and able to ask fair questions.',
    incorrectFeedback:
      'Look again at how support is being framed. The issue is dignity and whether people are treated as rights-holders.',
    marker: 'I',
  },
  {
    id: 'WATER_PROJECT',
    title: 'The water project',
    text:
      'A water point is repaired, but women and girls still avoid it after dark because the route is unsafe and there is no lighting.',
    correctMatch: 'Indivisible',
    correctFeedback:
      'Yes. Indivisible means service delivery cannot be separated from safety, dignity, equality, and participation.',
    incorrectFeedback:
      'Look again at the whole situation. This is not only about water access; safety and equal use also matter.',
    marker: 'N',
  },
  {
    id: 'INACCESSIBLE_MEETING',
    title: 'The inaccessible meeting',
    text:
      'A person with a disability is invited to a planning meeting, but the venue entrance is not accessible and no alternative is offered.',
    correctMatch: 'Interdependent',
    correctFeedback:
      'Yes. Interdependent means one barrier can affect participation, voice, dignity, and access to project benefits.',
    incorrectFeedback:
      'Look again at how one access barrier creates other barriers. The issue affects more than attendance.',
    marker: 'T',
  },
  {
    id: 'TRAINING_ONLY_SOLUTION',
    title: 'Training only',
    text:
      'A CSO offers skills training for young women but does not consider care work, family permission, transport, safety, or markets.',
    correctMatch: 'Interdependent',
    correctFeedback:
      'Yes. Interdependent helps the team see how related barriers can stop training from becoming real opportunity.',
    incorrectFeedback:
      'Look again at how several barriers combine. Training alone may not be enough if connected barriers remain.',
    marker: 'T',
  },
  {
    id: 'QUIET_PARTICIPANT',
    title: 'The quiet participant',
    text:
      'A woman attends a meeting but is told only elders and committee members should speak. Her concerns are not heard.',
    correctMatch: 'Inalienable',
    correctFeedback:
      'Yes. Inalienable means dignity and voice do not depend on status, power, age, or social position.',
    incorrectFeedback:
      'Look again at how the person is treated. The strongest issue is whether dignity and voice are conditional on power.',
    marker: 'I',
  },
];

const validSituationIds = new Set(situations.map((situation) => situation.id));
const validCharacteristicIds = new Set<string>(characteristicOptions.map((option) => option.id));

function getStoredState(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen25_characteristics_match;
  const completedSituationIds = Array.isArray(stored?.completedSituationIds)
    ? stored.completedSituationIds.filter((id: string) => validSituationIds.has(id))
    : [];
  const firstIncomplete = situations.find((situation) => !completedSituationIds.includes(situation.id));

  return {
    activeSituationId:
      typeof stored?.activeSituationId === 'string' &&
      validSituationIds.has(stored.activeSituationId)
        ? stored.activeSituationId
        : firstIncomplete?.id || situations[0].id,
    matches:
      stored?.matches && typeof stored.matches === 'object'
        ? Object.fromEntries(
            Object.entries(stored.matches).filter(
              ([situationId, characteristicId]) =>
                validSituationIds.has(situationId) &&
                typeof characteristicId === 'string' &&
                validCharacteristicIds.has(characteristicId),
            ),
          ) as Record<string, CharacteristicId>
        : {},
    attemptCounts:
      stored?.attemptCounts && typeof stored.attemptCounts === 'object'
        ? Object.fromEntries(
            Object.entries(stored.attemptCounts).filter(
              ([situationId, count]) =>
                validSituationIds.has(situationId) && typeof count === 'number',
            ),
          ) as Record<string, number>
        : {},
    completedSituationIds,
    feedback: stored?.feedback || null,
  };
}

function saveMatchState(
  prev: LearningState,
  next: {
    activeSituationId: string;
    matches: Record<string, CharacteristicId>;
    attemptCounts: Record<string, number>;
    completedSituationIds: string[];
    feedback: FeedbackState | null;
  },
) {
  const complete = next.completedSituationIds.length === situations.length;
  const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);

  if (complete) {
    moduleProgress.add(SCREEN_ID);
  }

  return {
    ...prev,
    m2MatchingState: next.matches,
    m2MatchingCompleted: complete,
    screenProgress: {
      ...prev.screenProgress,
      [MODULE_ID]: Array.from(moduleProgress),
    },
    practiceCheckState: {
      ...prev.practiceCheckState,
      module2_screen25_characteristics_match: {
        screenId: SCREEN_ID,
        activeSituationId: next.activeSituationId,
        matches: next.matches,
        attemptCounts: next.attemptCounts,
        completedSituationIds: next.completedSituationIds,
        feedback: next.feedback,
        completionStatus: complete ? 'completed' : 'in_progress',
      },
    },
  };
}

export default function Module2RightsCharacteristicsMatch({
  state,
  onChangeState,
}: Module2RightsCharacteristicsMatchProps) {
  const stored = getStoredState(state);
  const activeSituation =
    situations.find((situation) => situation.id === stored.activeSituationId) || situations[0];
  const completedCount = stored.completedSituationIds.length;
  const allCompleted = completedCount === situations.length;
  const activeCompleted = stored.completedSituationIds.includes(activeSituation.id);

  const selectSituation = (situationId: string) => {
    onChangeState((prev) => {
      const current = getStoredState(prev);
      const selectedSituation = situations.find((situation) => situation.id === situationId);
      const previousMatch = current.matches[situationId];
      const nextFeedback =
        previousMatch && selectedSituation
          ? {
              situationId,
              selected: previousMatch,
              isCorrect: previousMatch === selectedSituation.correctMatch,
              completed: current.completedSituationIds.includes(situationId),
              message:
                previousMatch === selectedSituation.correctMatch
                  ? selectedSituation.correctFeedback
                  : selectedSituation.incorrectFeedback,
            }
          : null;

      return saveMatchState(prev, {
        ...current,
        activeSituationId: situationId,
        feedback: nextFeedback,
      });
    });
  };

  const selectCharacteristic = (characteristicId: CharacteristicId) => {
    onChangeState((prev) => {
      const current = getStoredState(prev);
      const selectedSituation =
        situations.find((situation) => situation.id === current.activeSituationId) || situations[0];

      if (current.completedSituationIds.includes(selectedSituation.id)) {
        return prev;
      }

      const nextAttempts = (current.attemptCounts[selectedSituation.id] || 0) + 1;
      const isCorrect = characteristicId === selectedSituation.correctMatch;
      const shouldComplete = isCorrect || nextAttempts >= 2;
      const finalMatch = shouldComplete ? selectedSituation.correctMatch : characteristicId;
      const nextCompleted = shouldComplete
        ? Array.from(new Set([...current.completedSituationIds, selectedSituation.id]))
        : current.completedSituationIds;
      const nextFeedback: FeedbackState = {
        situationId: selectedSituation.id,
        selected: characteristicId,
        isCorrect,
        completed: shouldComplete,
        message: isCorrect ? selectedSituation.correctFeedback : selectedSituation.incorrectFeedback,
      };
      const nextActive =
        shouldComplete && nextCompleted.length < situations.length
          ? situations.find((situation) => !nextCompleted.includes(situation.id))?.id ||
            selectedSituation.id
          : selectedSituation.id;

      return saveMatchState(prev, {
        activeSituationId: nextActive,
        matches: {
          ...current.matches,
          [selectedSituation.id]: finalMatch,
        },
        attemptCounts: {
          ...current.attemptCounts,
          [selectedSituation.id]: nextAttempts,
        },
        completedSituationIds: nextCompleted,
        feedback: nextFeedback,
      });
    });
  };

  const completeAndContinue = () => {
    if (!allCompleted) return;

    const completedAt = new Date().toISOString();
    onChangeState((prev) => {
      const current = getStoredState(prev);
      const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);
      moduleProgress.add(SCREEN_ID);

      return {
        ...prev,
        currentScreenId: NEXT_SCREEN_ID,
        m2MatchingState: current.matches,
        m2MatchingCompleted: true,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen25_characteristics_match: {
            screenId: SCREEN_ID,
            activeSituationId: current.activeSituationId,
            matches: current.matches,
            attemptCounts: current.attemptCounts,
            completedSituationIds: current.completedSituationIds,
            feedback: current.feedback,
            completionStatus: 'completed',
            completedAt,
          },
        },
      };
    });

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', NEXT_ROUTE);
    }
  };

  return (
    <main className="m2-s06-screen" aria-labelledby="m2-s06-title">
      <section className="m2-s06-shell">
        <header className="m2-s06-header">
          <div className="m2-s06-title-card">
            <p className="m2-s06-kicker">Module 2 · Practice</p>
            <h1 id="m2-s06-title">Practice: Match Rights Characteristics to Everyday CSO Situations</h1>
            <p>
              Read each short CSO situation and choose the strongest characteristic. Some
              situations connect to more than one idea; this practice asks for the best fit.
            </p>
          </div>

          <aside className="m2-s06-progress-card" aria-label="Matching progress">
            <p className="m2-s06-progress-count" aria-live="polite">
              {completedCount} of 6 matched
            </p>
            <div className="m2-s06-progress-track" aria-hidden="true">
              <span style={{ width: `${(completedCount / situations.length) * 100}%` }} />
            </div>
            <p>{allCompleted ? 'All situations matched.' : 'Complete all six to continue.'}</p>
          </aside>
        </header>

        <section className="m2-s06-board" aria-labelledby="m2-s06-board-title">
          <div className="m2-s06-situation-rail" aria-label="Situation list">
            {situations.map((situation, index) => {
              const active = stored.activeSituationId === situation.id;
              const completed = stored.completedSituationIds.includes(situation.id);

              return (
                <button
                  key={situation.id}
                  type="button"
                  className={`m2-s06-situation-pill ${active ? 'is-active' : ''} ${
                    completed ? 'is-completed' : ''
                  }`}
                  aria-pressed={active}
                  onClick={() => selectSituation(situation.id)}
                >
                  <span aria-hidden="true">{completed ? '✓' : index + 1}</span>
                  <strong>{situation.title}</strong>
                </button>
              );
            })}
          </div>

          <article className="m2-s06-active-situation">
            <p className="m2-s06-kicker">Active situation</p>
            <h2 id="m2-s06-board-title">{activeSituation.title}</h2>
            <p>{activeSituation.text}</p>
            <div className="m2-s06-attempt-note">
              Attempt {Math.min((stored.attemptCounts[activeSituation.id] || 0) + 1, 2)} of 2
            </div>
          </article>

          <div className="m2-s06-choice-panel" aria-label="Characteristic choices">
            {characteristicOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className="m2-s06-choice"
                disabled={activeCompleted}
                aria-label={`${option.id}. ${option.reminder}`}
                onClick={() => selectCharacteristic(option.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
                    event.preventDefault();
                    selectCharacteristic(option.id);
                  }
                }}
              >
                <span aria-hidden="true">{option.id.slice(0, 1)}</span>
                <strong>{option.id}</strong>
                <em>{option.reminder}</em>
              </button>
            ))}
          </div>

          <aside className={`m2-s06-feedback ${stored.feedback ? 'is-visible' : ''}`} aria-live="polite">
            {stored.feedback ? (
              <>
                <p className="m2-s06-kicker">
                  {stored.feedback.isCorrect
                    ? 'Good match'
                    : stored.feedback.completed
                      ? 'Revealed after two attempts'
                      : 'Look again'}
                </p>
                <p>{stored.feedback.message}</p>
                {!stored.feedback.isCorrect && stored.feedback.completed && (
                  <p>
                    Strongest match:{' '}
                    <strong>
                      {situations.find((situation) => situation.id === stored.feedback?.situationId)
                        ?.correctMatch || ''}
                    </strong>
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="m2-s06-kicker">Choose one</p>
                <p>Select the characteristic that best explains why this situation matters.</p>
              </>
            )}
          </aside>
        </section>

        <footer className="m2-s06-footer">
          <p>
            Matching is practice for judgment. In real work, these ideas often overlap, but
            choosing the strongest lens helps a team decide what to check next.
          </p>
          <button
            type="button"
            className="m2-s06-cta"
            disabled={!allCompleted}
            aria-disabled={!allCompleted}
            onClick={completeAndContinue}
          >
            Continue to the five HRBA working principles
          </button>
        </footer>
      </section>
    </main>
  );
}
