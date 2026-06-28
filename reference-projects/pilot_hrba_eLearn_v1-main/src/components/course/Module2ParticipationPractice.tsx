import type { LearningState } from '../../state/learningState';

type Props = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type SpectrumLevel = 'presence' | 'voice' | 'considered' | 'influence';

type SpectrumExample = {
  id: string;
  title: string;
  scenario: string;
  correct: SpectrumLevel;
  feedback: string;
  marker: string;
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S15';
const NEXT_SCREEN_ID = 'M2-S16';
const NEXT_ROUTE = '/module-2/screen-2-16';

const levels: Array<{
  id: SpectrumLevel;
  title: string;
  cue: string;
}> = [
  {
    id: 'presence',
    title: 'Presence',
    cue: 'People are counted or visible.',
  },
  {
    id: 'voice',
    title: 'Voice',
    cue: 'People can speak, ask, and raise concerns.',
  },
  {
    id: 'considered',
    title: 'Considered',
    cue: 'Input is reviewed and responded to.',
  },
  {
    id: 'influence',
    title: 'Influence',
    cue: 'People can shape decisions or follow-up.',
  },
];

const levelOrders: Record<string, SpectrumLevel[]> = {
  'attendance-sheet': ['voice', 'presence', 'influence', 'considered'],
  questions: ['considered', 'influence', 'voice', 'presence'],
  response: ['influence', 'voice', 'considered', 'presence'],
  'changed-timing': ['considered', 'presence', 'influence', 'voice'],
};

const examples: SpectrumExample[] = [
  {
    id: 'attendance-sheet',
    title: 'Attendance Sheet Complete',
    scenario:
      'The report says 48 people attended the registration meeting and includes a signed attendance sheet. It does not say whether people understood the criteria or influenced the final list.',
    correct: 'presence',
    feedback:
      'This is presence. Attendance is useful evidence, but it does not prove voice, influence, or response.',
    marker: '1',
  },
  {
    id: 'questions',
    title: 'Questions in the Room',
    scenario:
      'Participants ask questions about eligibility in a language they understand. The team answers during the meeting, but the selection criteria do not change.',
    correct: 'voice',
    feedback:
      'This is voice. People can ask and be heard, but the example does not yet show that input shaped the decision.',
    marker: '2',
  },
  {
    id: 'response',
    title: 'Suggestions Reviewed',
    scenario:
      'The team reviews comments after the meeting and returns to explain which suggestions can be used, which cannot, and why.',
    correct: 'considered',
    feedback:
      'This is considered. People see that their input was reviewed and that the team gives a response.',
    marker: '3',
  },
  {
    id: 'changed-timing',
    title: 'Timing Changed',
    scenario:
      'Women with care responsibilities explain that the meeting time excludes them. The team changes the next registration meeting and adds a childcare-friendly option.',
    correct: 'influence',
    feedback:
      'This is influence. Rights-holder input changed a real process decision and reduced a participation barrier.',
    marker: '4',
  },
];

const validExampleIds = new Set(examples.map((example) => example.id));
const validLevelIds = new Set(levels.map((level) => level.id));

function getStoredState(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen215_participation_practice;
  const ratings =
    stored?.ratings && typeof stored.ratings === 'object'
      ? Object.fromEntries(
          Object.entries(stored.ratings).filter(
            ([exampleId, levelId]) =>
              validExampleIds.has(exampleId) && typeof levelId === 'string' && validLevelIds.has(levelId as SpectrumLevel),
          ),
        )
      : {};
  const activeExampleId =
    typeof stored?.activeExampleId === 'string' && validExampleIds.has(stored.activeExampleId)
      ? stored.activeExampleId
      : examples[0].id;

  return { ratings: ratings as Record<string, SpectrumLevel>, activeExampleId };
}

export default function Module2ParticipationPractice({ state, onChangeState }: Props) {
  const { ratings, activeExampleId } = getStoredState(state);
  const activeExample =
    examples.find((example) => example.id === activeExampleId) || examples[0];
  const ratedCount = Object.keys(ratings).length;
  const allRated = ratedCount === examples.length;
  const activeRating = ratings[activeExample.id];
  const activeCorrect = activeRating === activeExample.correct;
  const selectedLevel = levels.find((level) => level.id === activeRating);
  const activeLevelOrder = levelOrders[activeExample.id] || levels.map((level) => level.id);

  const setActiveExample = (exampleId: string) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: {
        ...prev.practiceCheckState,
        module2_screen215_participation_practice: {
          screenId: SCREEN_ID,
          ratings,
          activeExampleId: exampleId,
          completionStatus: allRated ? 'completed' : 'in_progress',
        },
      },
    }));
  };

  const rateExample = (exampleId: string, levelId: SpectrumLevel) => {
    onChangeState((prev) => {
      const current = getStoredState(prev);
      const nextRatings = { ...current.ratings, [exampleId]: levelId };
      const isComplete = Object.keys(nextRatings).length === examples.length;
      const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);

      if (isComplete) {
        moduleProgress.add(SCREEN_ID);
      }

      return {
        ...prev,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen215_participation_practice: {
            screenId: SCREEN_ID,
            ratings: nextRatings,
            activeExampleId: exampleId,
            completionStatus: isComplete ? 'completed' : 'in_progress',
          },
        },
      };
    });
  };

  const completeAndContinue = () => {
    if (!allRated) return;

    const completedAt = new Date().toISOString();
    onChangeState((prev) => {
      const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);
      moduleProgress.add(SCREEN_ID);

      return {
        ...prev,
        currentScreenId: NEXT_SCREEN_ID,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen215_participation_practice: {
            screenId: SCREEN_ID,
            ratings,
            activeExampleId,
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
    <main className="m2-s15-screen" aria-labelledby="m2-s15-title">
      <section className="m2-s15-shell">
        <header className="m2-s15-header">
          <div className="m2-s15-title-card">
            <p className="m2-s15-kicker">Module 2 · Participation practice</p>
            <h1 id="m2-s15-title">Practice: Is This Meaningful Participation?</h1>
            <p>
              Rate each example on the participation quality spectrum. The judgment is
              practical: did people only show up, speak, receive a response, or influence
              a decision?
            </p>
          </div>
          <aside className="m2-s15-progress-card" aria-label="Participation rating progress">
            <p className="m2-s15-progress-count" aria-live="polite">
              {ratedCount} of 4 rated
            </p>
            <div className="m2-s15-progress-track" aria-hidden="true">
              <span style={{ width: `${(ratedCount / examples.length) * 100}%` }} />
            </div>
            <p>{allRated ? 'All examples rated.' : 'Place each example on the spectrum to continue.'}</p>
          </aside>
        </header>

        <section className="m2-s15-spectrum" aria-label="Participation quality spectrum">
          {levels.map((level) => (
            <article key={level.id} className={`m2-s15-spectrum-step m2-s15-spectrum-step--${level.id}`}>
              <strong>{level.title}</strong>
              <span>{level.cue}</span>
            </article>
          ))}
        </section>

        <section className="m2-s15-board" aria-labelledby="m2-s15-example-title">
          <div className="m2-s15-example-list" role="tablist" aria-label="Participation examples">
            {examples.map((example) => {
              const active = example.id === activeExample.id;
              const rated = Boolean(ratings[example.id]);
              const level = levels.find((entry) => entry.id === ratings[example.id]);

              return (
                <button
                  key={example.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`m2-s15-panel-${example.id}`}
                  id={`m2-s15-tab-${example.id}`}
                  className={`m2-s15-example-tab ${active ? 'is-active' : ''} ${rated ? 'is-rated' : ''}`}
                  onClick={() => setActiveExample(example.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
                      event.preventDefault();
                      setActiveExample(example.id);
                    }
                  }}
                >
                  <span aria-hidden="true">{rated ? '✓' : example.marker}</span>
                  <strong>{example.title}</strong>
                  <em>{level ? `Rated: ${level.title}` : 'Not rated yet'}</em>
                </button>
              );
            })}
          </div>

          <article
            className="m2-s15-rating-card"
            id={`m2-s15-panel-${activeExample.id}`}
            role="tabpanel"
            aria-labelledby={`m2-s15-tab-${activeExample.id}`}
          >
            <p className="m2-s15-kicker">Rate this example</p>
            <h2 id="m2-s15-example-title">{activeExample.title}</h2>
            <p>{activeExample.scenario}</p>
            <div className="m2-s15-rating-scale" role="radiogroup" aria-label={`Rate ${activeExample.title}`}>
              {activeLevelOrder.map((levelId, index) => {
                const level = levels.find((entry) => entry.id === levelId) || levels[0];
                const selected = activeRating === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`m2-s15-rating-button ${selected ? 'is-selected' : ''}`}
                    onClick={() => rateExample(activeExample.id, level.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
                        event.preventDefault();
                        rateExample(activeExample.id, level.id);
                      }
                    }}
                  >
                    <span aria-hidden="true">{index + 1}</span>
                    <strong>{level.title}</strong>
                    <em>{level.cue}</em>
                  </button>
                );
              })}
            </div>
          </article>

          <aside className="m2-s15-feedback-card" aria-live="polite">
            <p className="m2-s15-kicker">Feedback</p>
            {activeRating ? (
              <>
                <h2>{activeCorrect ? 'Good judgment' : 'Look at the influence level'}</h2>
                <p>
                  You placed this at <strong>{selectedLevel?.title}</strong>.{' '}
                  {activeCorrect
                    ? activeExample.feedback
                    : `A stronger rating is ${levels.find((level) => level.id === activeExample.correct)?.title}. ${activeExample.feedback}`}
                </p>
              </>
            ) : (
              <>
                <h2>Place the example</h2>
                <p>
                  Ask what the example proves: presence, voice, a response to input, or
                  real influence over the process.
                </p>
              </>
            )}
            <div className="m2-s15-rule">
              <strong>Practical test</strong>
              <p>Attendance can be evidence. Influence and response show stronger participation.</p>
            </div>
          </aside>
        </section>

        <footer className="m2-s15-footer">
          <p>
            Meaningful participation is stronger when people understand, speak safely,
            see their input considered, and influence something real.
          </p>
          <button
            type="button"
            className="m2-s15-cta"
            disabled={!allRated}
            aria-disabled={!allRated}
            onClick={completeAndContinue}
          >
            Continue to accountability
          </button>
        </footer>
      </section>
    </main>
  );
}
