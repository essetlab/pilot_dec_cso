import type { LearningState } from '../../state/learningState';

type Module2WorkingPrinciplesProps = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type Principle = {
  id: string;
  title: string;
  cue: string;
  practiceQuestion: string;
  csoMove: string;
  marker: string;
  accent: 'blue' | 'green' | 'gold' | 'terra' | 'navy';
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S07';
const NEXT_SCREEN_ID = 'M2-S08';
const NEXT_ROUTE = '/module-2/screen-2-8';

const principles: Principle[] = [
  {
    id: 'all-rights-for-all',
    title: 'All Human Rights for All',
    cue: 'Everyone affected by the work has rights.',
    practiceQuestion: 'Who may be missing, overlooked, or treated as less entitled?',
    csoMove:
      'Check beyond the visible group: people far away, less connected, quieter, or facing access barriers.',
    marker: 'A',
    accent: 'blue',
  },
  {
    id: 'participation',
    title: 'Meaningful Participation',
    cue: 'Participation is more than attendance.',
    practiceQuestion: 'Who had real voice, and whose views shaped the decision?',
    csoMove:
      'Design meetings so different groups can understand, speak safely, and influence decisions.',
    marker: 'P',
    accent: 'green',
  },
  {
    id: 'equality',
    title: 'Equality and Non-discrimination',
    cue: 'Fair access may require different support.',
    practiceQuestion: 'Who faces specific barriers, and what adjustment is needed?',
    csoMove:
      'Adapt timing, location, communication, accessibility, and facilitation before exclusion happens.',
    marker: 'E',
    accent: 'gold',
  },
  {
    id: 'accountability',
    title: 'Accountability',
    cue: 'People need a safe way to ask and receive answers.',
    practiceQuestion: 'Who should respond, and how can people safely raise concerns?',
    csoMove:
      'Explain who is responsible, how feedback is handled, and how people will hear back.',
    marker: 'R',
    accent: 'terra',
  },
  {
    id: 'transparency',
    title: 'Transparency and Information',
    cue: 'People need clear information they can use.',
    practiceQuestion: 'Did people understand the criteria, process, risks, and next steps?',
    csoMove:
      'Share information through more than one channel and check whether different groups understand it.',
    marker: 'T',
    accent: 'navy',
  },
];

const validPrincipleIds = new Set(principles.map((principle) => principle.id));

function getExploredIds(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen26_working_principles;
  return Array.isArray(stored?.openedPrinciples)
    ? stored.openedPrinciples.filter((id: string) => validPrincipleIds.has(id))
    : [];
}

function getActiveId(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen26_working_principles;
  return typeof stored?.activePrincipleId === 'string' &&
    validPrincipleIds.has(stored.activePrincipleId)
    ? stored.activePrincipleId
    : principles[0].id;
}

export default function Module2WorkingPrinciples({
  state,
  onChangeState,
}: Module2WorkingPrinciplesProps) {
  const exploredIds = getExploredIds(state);
  const activeId = getActiveId(state);
  const activePrinciple = principles.find((principle) => principle.id === activeId) || principles[0];
  const exploredCount = exploredIds.length;
  const allExplored = exploredCount === principles.length;

  const openPrinciple = (principleId: string) => {
    onChangeState((prev) => {
      const currentExplored = getExploredIds(prev);
      const nextExplored = currentExplored.includes(principleId)
        ? currentExplored
        : [...currentExplored, principleId];
      const isComplete = nextExplored.length === principles.length;
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
          module2_screen26_working_principles: {
            screenId: SCREEN_ID,
            activePrincipleId: principleId,
            openedPrinciples: nextExplored,
            completionStatus: isComplete ? 'completed' : 'in_progress',
          },
        },
      };
    });
  };

  const completeAndContinue = () => {
    if (!allExplored) return;

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
          module2_screen26_working_principles: {
            screenId: SCREEN_ID,
            activePrincipleId: activeId,
            openedPrinciples: exploredIds,
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
    <main className="m2-s07-screen" aria-labelledby="m2-s07-title">
      <section className="m2-s07-shell">
        <header className="m2-s07-header">
          <div className="m2-s07-title-card">
            <p className="m2-s07-kicker">Module 2 · HRBA working principles</p>
            <h1 id="m2-s07-title">The Five HRBA Working Principles in Everyday CSO Work</h1>
            <p>
              Human rights become practical when teams use them as working questions:
              who is included, who has voice, who faces barriers, who responds, and who
              has information.
            </p>
          </div>

          <aside className="m2-s07-progress-card" aria-label="Principle exploration progress">
            <p className="m2-s07-progress-count" aria-live="polite">
              {exploredCount} of 5 explored
            </p>
            <div className="m2-s07-progress-track" aria-hidden="true">
              <span style={{ width: `${(exploredCount / principles.length) * 100}%` }} />
            </div>
            <p>{allExplored ? 'All five principles explored.' : 'Open each principle to continue.'}</p>
          </aside>
        </header>

        <section className="m2-s07-board" aria-labelledby="m2-s07-board-title">
          <div className="m2-s07-principle-list" role="tablist" aria-label="Five HRBA working principles">
            {principles.map((principle) => {
              const active = principle.id === activeId;
              const explored = exploredIds.includes(principle.id);

              return (
                <button
                  key={principle.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`m2-s07-panel-${principle.id}`}
                  id={`m2-s07-tab-${principle.id}`}
                  className={`m2-s07-principle-tab m2-s07-principle-tab--${principle.accent} ${
                    active ? 'is-active' : ''
                  } ${explored ? 'is-explored' : ''}`}
                  onClick={() => openPrinciple(principle.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
                      event.preventDefault();
                      openPrinciple(principle.id);
                    }
                  }}
                >
                  <span aria-hidden="true">{explored ? '✓' : principle.marker}</span>
                  <strong>{principle.title}</strong>
                  <em>{principle.cue}</em>
                </button>
              );
            })}
          </div>

          <article
            className={`m2-s07-principle-panel m2-s07-principle-panel--${activePrinciple.accent}`}
            id={`m2-s07-panel-${activePrinciple.id}`}
            role="tabpanel"
            aria-labelledby={`m2-s07-tab-${activePrinciple.id}`}
          >
            <p className="m2-s07-kicker">Principle in practice</p>
            <h2 id="m2-s07-board-title">{activePrinciple.title}</h2>
            <p className="m2-s07-cue">{activePrinciple.cue}</p>
            <dl>
              <div>
                <dt>CSO practice question</dt>
                <dd>{activePrinciple.practiceQuestion}</dd>
              </div>
              <div>
                <dt>Practical team move</dt>
                <dd>{activePrinciple.csoMove}</dd>
              </div>
            </dl>
          </article>

          <aside className="m2-s07-story-card" aria-label="Registration story practice reminder">
            <p className="m2-s07-kicker">Use it on the story</p>
            <h2>Back to the registration meeting</h2>
            <p>
              The activity was delivered, but some people did not understand the criteria,
              some could not access the meeting, some attended without voice, and people
              did not know how to ask questions later.
            </p>
            <p className="m2-s07-story-callout">
              The principles help the team improve the process before the next meeting.
            </p>
          </aside>
        </section>

        <footer className="m2-s07-footer">
          <p>
            The five HRBA working principles turn rights language into everyday CSO
            questions for planning, delivery, review, and follow-up.
          </p>
          <button
            type="button"
            className="m2-s07-cta"
            disabled={!allExplored}
            aria-disabled={!allExplored}
            onClick={completeAndContinue}
          >
            Continue to rights-holders
          </button>
        </footer>
      </section>
    </main>
  );
}
