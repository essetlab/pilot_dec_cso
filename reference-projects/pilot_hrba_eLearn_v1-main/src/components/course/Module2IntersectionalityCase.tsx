import type { LearningState } from '../../state/learningState';

type Module2IntersectionalityCaseProps = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type CaseMoment = {
  id: string;
  title: string;
  cue: string;
  story: string;
  hiddenBarriers: string[];
  practiceQuestion: string;
  marker: string;
  accent: 'blue' | 'green' | 'gold' | 'terra';
};

type DecisionChoice = {
  id: string;
  label: string;
  text: string;
  feedback: string;
  isStrongest: boolean;
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S09';
const NEXT_SCREEN_ID = 'M2-S10';
const NEXT_ROUTE = '/module-2/screen-2-10';

const caseMoments: CaseMoment[] = [
  {
    id: 'information',
    title: 'Hearing About the Opportunity',
    cue: 'Some people hear early. Others hear late or not at all.',
    story:
      'Aster hears through her savings group. Alemitu is newly arrived and hears later from a neighbor. The same opportunity is already closer to one person than another.',
    hiddenBarriers: ['Social networks', 'New arrival status', 'Trust and information flow'],
    practiceQuestion: 'Who heard early enough to ask questions, prepare, and decide?',
    marker: '1',
    accent: 'blue',
  },
  {
    id: 'access',
    title: 'Getting Into the Room',
    cue: 'Attendance can carry a higher cost for some people.',
    story:
      'Aster wants to attend, but she is balancing childcare, cooking, water collection, and expectations at home. Being motivated does not remove those barriers.',
    hiddenBarriers: ['Unpaid care work', 'Time pressure', 'Household expectations'],
    practiceQuestion: 'Who pays a higher hidden cost to participate?',
    marker: '2',
    accent: 'green',
  },
  {
    id: 'influence',
    title: 'Having Voice and Influence',
    cue: 'Inclusion is not the same as influence.',
    story:
      'Alemitu joins the cooperative and notices quality problems, but older and better-known members speak with buyers and are chosen for meetings.',
    hiddenBarriers: ['Age', 'Confidence', 'Recognition by leaders and buyers'],
    practiceQuestion: 'Who contributes knowledge but is not trusted to represent it?',
    marker: '3',
    accent: 'gold',
  },
  {
    id: 'benefit-control',
    title: 'Controlling the Benefit',
    cue: 'Receiving income is not the same as controlling it.',
    story:
      'Aster gains skills and earns income, but household decision-making may still shape how money is used, saved, or reinvested.',
    hiddenBarriers: ['Household decision power', 'Income control', 'Safety to negotiate'],
    practiceQuestion: 'Who benefits on paper, but has limited control in practice?',
    marker: '4',
    accent: 'terra',
  },
];

const decisionChoices: DecisionChoice[] = [
  {
    id: 'numbers',
    label: 'A',
    text: 'Count how many women completed training and how much income the cooperative earned.',
    feedback:
      'Useful, but not enough. Numbers may hide who paid a higher cost, who had less voice, and who controlled the benefit.',
    isStrongest: false,
  },
  {
    id: 'motivation',
    label: 'B',
    text: 'Focus on the women who seem most motivated and easiest to support.',
    feedback:
      'This risks blaming individuals for barriers. A rights-based review asks how the process can reduce exclusion.',
    isStrongest: false,
  },
  {
    id: 'pathway',
    label: 'C',
    text:
      'Review the whole pathway: who heard, joined, learned, influenced decisions, controlled benefits, and could raise concerns safely.',
    feedback:
      'Strongest. This shows how overlapping barriers appear across the project journey, not only at one activity point.',
    isStrongest: true,
  },
];

const validMomentIds = new Set(caseMoments.map((moment) => moment.id));
const validChoiceIds = new Set(decisionChoices.map((choice) => choice.id));

function getOpenedMomentIds(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen28_intersectionality;
  return Array.isArray(stored?.openedMoments)
    ? stored.openedMoments.filter((id: string) => validMomentIds.has(id))
    : [];
}

function getActiveMomentId(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen28_intersectionality;
  return typeof stored?.activeMomentId === 'string' && validMomentIds.has(stored.activeMomentId)
    ? stored.activeMomentId
    : caseMoments[0].id;
}

function getSelectedChoiceId(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen28_intersectionality;
  const stateChoice = typeof state.m2SortingState?.intersectionalityChoice === 'string'
    ? state.m2SortingState.intersectionalityChoice
    : '';
  const storedChoice = typeof stored?.selectedChoiceId === 'string' ? stored.selectedChoiceId : '';
  const choiceId = storedChoice || stateChoice;

  return validChoiceIds.has(choiceId) ? choiceId : '';
}

export default function Module2IntersectionalityCase({
  state,
  onChangeState,
}: Module2IntersectionalityCaseProps) {
  const openedMomentIds = getOpenedMomentIds(state);
  const activeMomentId = getActiveMomentId(state);
  const selectedChoiceId = getSelectedChoiceId(state);
  const activeMoment = caseMoments.find((moment) => moment.id === activeMomentId) || caseMoments[0];
  const selectedChoice = decisionChoices.find((choice) => choice.id === selectedChoiceId);
  const exploredCount = openedMomentIds.length;
  const allMomentsOpened = exploredCount === caseMoments.length;
  const strongestChoiceSelected = selectedChoice?.isStrongest === true;
  const completionReady = allMomentsOpened && strongestChoiceSelected;

  const openMoment = (momentId: string) => {
    onChangeState((prev) => {
      const currentOpened = getOpenedMomentIds(prev);
      const nextOpened = currentOpened.includes(momentId)
        ? currentOpened
        : [...currentOpened, momentId];

      return {
        ...prev,
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen28_intersectionality: {
            screenId: SCREEN_ID,
            activeMomentId: momentId,
            openedMoments: nextOpened,
            selectedChoiceId: getSelectedChoiceId(prev),
            completionStatus: 'in_progress',
          },
        },
      };
    });
  };

  const selectChoice = (choiceId: string) => {
    onChangeState((prev) => {
      const currentOpened = getOpenedMomentIds(prev);
      const choice = decisionChoices.find((item) => item.id === choiceId);
      const isComplete = currentOpened.length === caseMoments.length && choice?.isStrongest === true;
      const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);

      if (isComplete) {
        moduleProgress.add(SCREEN_ID);
      }

      return {
        ...prev,
        m2SortingState: {
          ...prev.m2SortingState,
          intersectionalityChoice: choiceId,
        },
        m2SortingCompleted: isComplete,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen28_intersectionality: {
            screenId: SCREEN_ID,
            activeMomentId,
            openedMoments: currentOpened,
            selectedChoiceId: choiceId,
            completionStatus: isComplete ? 'completed' : 'in_progress',
          },
        },
      };
    });
  };

  const completeAndContinue = () => {
    if (!completionReady) return;

    const completedAt = new Date().toISOString();
    onChangeState((prev) => {
      const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);
      moduleProgress.add(SCREEN_ID);

      return {
        ...prev,
        currentScreenId: NEXT_SCREEN_ID,
        m2SortingCompleted: true,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen28_intersectionality: {
            screenId: SCREEN_ID,
            activeMomentId,
            openedMoments: openedMomentIds,
            selectedChoiceId,
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
    <main className="m2-s09-screen" aria-labelledby="m2-s09-title">
      <section className="m2-s09-shell">
        <header className="m2-s09-header">
          <div className="m2-s09-title-card">
            <p className="m2-s09-kicker">Module 2 · Intersectionality</p>
            <h1 id="m2-s09-title">Intersectionality: One Person, Multiple Barriers</h1>
            <p>
              Intersectionality helps CSOs see how barriers combine across a project
              journey: information, access, voice, benefit, control, safety, and power.
            </p>
          </div>

          <aside className="m2-s09-progress-card" aria-label="Intersectionality case progress">
            <p className="m2-s09-progress-count" aria-live="polite">
              {exploredCount} of 4 moments explored
            </p>
            <div className="m2-s09-progress-track" aria-hidden="true">
              <span style={{ width: `${(exploredCount / caseMoments.length) * 100}%` }} />
            </div>
            <p>
              {completionReady
                ? 'Case completed.'
                : 'Open all case moments, then choose the strongest review question.'}
            </p>
          </aside>
        </header>

        <section className="m2-s09-case-board" aria-labelledby="m2-s09-case-title">
          <div className="m2-s09-moment-list" role="tablist" aria-label="Case pathway moments">
            {caseMoments.map((moment) => {
              const active = moment.id === activeMomentId;
              const opened = openedMomentIds.includes(moment.id);

              return (
                <button
                  key={moment.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`m2-s09-panel-${moment.id}`}
                  id={`m2-s09-tab-${moment.id}`}
                  className={`m2-s09-moment-tab m2-s09-moment-tab--${moment.accent} ${
                    active ? 'is-active' : ''
                  } ${opened ? 'is-opened' : ''}`}
                  onClick={() => openMoment(moment.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
                      event.preventDefault();
                      openMoment(moment.id);
                    }
                  }}
                >
                  <span aria-hidden="true">{opened ? '✓' : moment.marker}</span>
                  <strong>{moment.title}</strong>
                  <em>{moment.cue}</em>
                </button>
              );
            })}
          </div>

          <article
            className={`m2-s09-case-panel m2-s09-case-panel--${activeMoment.accent}`}
            id={`m2-s09-panel-${activeMoment.id}`}
            role="tabpanel"
            aria-labelledby={`m2-s09-tab-${activeMoment.id}`}
          >
            <p className="m2-s09-kicker">Case moment</p>
            <h2 id="m2-s09-case-title">{activeMoment.title}</h2>
            <p className="m2-s09-cue">{activeMoment.cue}</p>
            <p>{activeMoment.story}</p>
            <div className="m2-s09-barrier-row" aria-label="Hidden barriers">
              {activeMoment.hiddenBarriers.map((barrier) => (
                <span key={barrier}>{barrier}</span>
              ))}
            </div>
            <div className="m2-s09-question">
              <strong>CSO practice question</strong>
              <p>{activeMoment.practiceQuestion}</p>
            </div>
          </article>

          <aside className="m2-s09-decision-card" aria-labelledby="m2-s09-decision-title">
            <p className="m2-s09-kicker">Guided analysis</p>
            <h2 id="m2-s09-decision-title">Which review question is strongest?</h2>
            <div className="m2-s09-choice-list" role="radiogroup" aria-label="Intersectional review question choices">
              {decisionChoices.map((choice) => {
                const selected = selectedChoiceId === choice.id;

                return (
                  <button
                    key={choice.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`m2-s09-choice ${selected ? 'is-selected' : ''}`}
                    disabled={!allMomentsOpened}
                    onClick={() => selectChoice(choice.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
                        event.preventDefault();
                        selectChoice(choice.id);
                      }
                    }}
                  >
                    <span>{choice.label}</span>
                    <strong>{choice.text}</strong>
                  </button>
                );
              })}
            </div>
            <div className="m2-s09-feedback" aria-live="polite">
              {selectedChoice ? (
                <>
                  <strong>{selectedChoice.isStrongest ? 'Strongest choice' : 'Useful, but incomplete'}</strong>
                  <p>{selectedChoice.feedback}</p>
                </>
              ) : (
                <p>
                  {allMomentsOpened
                    ? 'Choose the review question that best follows the whole pathway.'
                    : 'Open the four case moments first.'}
                </p>
              )}
            </div>
          </aside>
        </section>

        <footer className="m2-s09-footer">
          <p>
            Practical intersectionality means looking beyond one label and asking how
            overlapping barriers shape the full experience of a rights-holder.
          </p>
          <button
            type="button"
            className="m2-s09-cta"
            disabled={!completionReady}
            aria-disabled={!completionReady}
            onClick={completeAndContinue}
          >
            Continue to duty-bearers and CSO roles
          </button>
        </footer>
      </section>
    </main>
  );
}
