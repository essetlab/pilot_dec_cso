import type { LearningState } from '../../state/learningState';

type Module2FourCharacteristicsPracticeProps = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type Characteristic = {
  id: string;
  name: string;
  cue: string;
  explanation: string;
  question: string;
  accent: 'blue' | 'green' | 'gold' | 'terra';
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S05';
const NEXT_SCREEN_ID = 'M2-S06';
const NEXT_ROUTE = '/module-2/screen-2-6';

const characteristics: Characteristic[] = [
  {
    id: 'universal',
    name: 'Universal',
    cue: 'Rights belong to all people.',
    explanation:
      'Rights belong to all people, not only those who are easiest to reach or already connected to the project.',
    question: 'Who might be missed if we only look at the people who are already visible?',
    accent: 'blue',
  },
  {
    id: 'inalienable',
    name: 'Inalienable',
    cue: 'Rights are not favors.',
    explanation:
      'Rights are not favors, rewards, or benefits that people receive only when others approve of them.',
    question:
      'Are we treating people with dignity even when they are not selected, not present, or not powerful?',
    accent: 'green',
  },
  {
    id: 'indivisible',
    name: 'Indivisible',
    cue: 'Different rights matter together.',
    explanation:
      'Different rights matter together. A livelihood activity, for example, may also involve information, participation, safety, equality, and accountability.',
    question: 'Are we looking at the whole situation, or only one visible service need?',
    accent: 'gold',
  },
  {
    id: 'interdependent',
    name: 'Interdependent',
    cue: 'One right often affects another.',
    explanation:
      'One right often affects another. Weak information can limit participation; weak participation can reduce accountability; weak accountability can deepen exclusion.',
    question: 'Which other rights or barriers are connected to this issue?',
    accent: 'terra',
  },
];

const validCharacteristicIds = new Set(characteristics.map((item) => item.id));

function getExploredIds(state: LearningState) {
  return (state.m2FlashcardsViewed || []).filter((id) => validCharacteristicIds.has(id));
}

function CharacteristicIcon({ id }: { id: string }) {
  if (id === 'universal') {
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="14" />
        <circle cx="14" cy="18" r="3.2" />
        <circle cx="26" cy="18" r="3.2" />
        <path d="M10.5 28c1.8-4.2 5-6.2 9.5-6.2s7.7 2 9.5 6.2" />
      </svg>
    );
  }

  if (id === 'inalienable') {
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M9 21.8 17.5 29a4 4 0 0 0 5 0L31 21.8" />
        <path d="M12 20V9.5" />
        <path d="M18 21V7.5" />
        <path d="M24 21V10" />
        <path d="M30 21v-7" />
      </svg>
    );
  }

  if (id === 'indivisible') {
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect x="8" y="8" width="10" height="10" rx="2.5" />
        <rect x="22" y="8" width="10" height="10" rx="2.5" />
        <rect x="8" y="22" width="10" height="10" rx="2.5" />
        <rect x="22" y="22" width="10" height="10" rx="2.5" />
        <path d="M18 13h4M13 18v4M27 18v4M18 27h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="12" cy="20" r="5" />
      <circle cx="28" cy="12" r="5" />
      <circle cx="28" cy="28" r="5" />
      <path d="m16 17 8-4M16 23l8 4" />
    </svg>
  );
}

export default function Module2FourCharacteristicsPractice({
  state,
  onChangeState,
}: Module2FourCharacteristicsPracticeProps) {
  const exploredIds = getExploredIds(state);
  const exploredCount = exploredIds.length;
  const allExplored = exploredCount === characteristics.length;

  const revealCard = (cardId: string) => {
    onChangeState((prev) => {
      const currentViewed = getExploredIds(prev);
      const nextViewed = currentViewed.includes(cardId)
        ? currentViewed
        : [...currentViewed, cardId];
      const nextProgress = new Set(prev.screenProgress[MODULE_ID] || []);
      const isComplete = nextViewed.length === characteristics.length;

      if (isComplete) {
        nextProgress.add(SCREEN_ID);
      }

      return {
        ...prev,
        m2FlashcardsViewed: nextViewed,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(nextProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen24_characteristics: {
            screenId: SCREEN_ID,
            exploredCardIds: nextViewed,
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
      const nextProgress = new Set(prev.screenProgress[MODULE_ID] || []);
      nextProgress.add(SCREEN_ID);

      return {
        ...prev,
        currentScreenId: NEXT_SCREEN_ID,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(nextProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen24_characteristics: {
            screenId: SCREEN_ID,
            exploredCardIds: getExploredIds(prev),
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
    <main className="m2-s05-screen" aria-labelledby="m2-s05-title">
      <section className="m2-s05-shell">
        <header className="m2-s05-header">
          <div className="m2-s05-title-block">
            <p className="m2-s05-kicker">Module 2 · Rights characteristics</p>
            <h1 id="m2-s05-title">Four Characteristics of Human Rights in CSO Practice</h1>
            <p>
              These four ideas help a CSO look beyond activity completion and ask sharper,
              practical questions about who is included, respected, heard, and connected to
              the response.
            </p>
          </div>

          <aside className="m2-s05-progress-panel" aria-label="Card exploration progress">
            <p className="m2-s05-progress-count" aria-live="polite">
              {exploredCount} of 4 explored
            </p>
            <div className="m2-s05-progress-track" aria-hidden="true">
              <span style={{ width: `${(exploredCount / characteristics.length) * 100}%` }} />
            </div>
            <p>{allExplored ? 'All four cards explored.' : 'Open each card to unlock Continue.'}</p>
          </aside>
        </header>

        <section className="m2-s05-card-grid" aria-label="Four characteristics reveal cards">
          {characteristics.map((item) => {
            const explored = exploredIds.includes(item.id);
            const panelId = `m2-s05-card-${item.id}`;

            return (
              <button
                key={item.id}
                type="button"
                className={`m2-s05-card m2-s05-card--${item.accent} ${
                  explored ? 'is-explored' : ''
                }`}
                aria-expanded={explored}
                aria-controls={panelId}
                aria-label={`${explored ? 'Review' : 'Reveal'} ${item.name}. ${item.cue}`}
                onClick={() => revealCard(item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
                    event.preventDefault();
                    revealCard(item.id);
                  }
                }}
              >
                <span className="m2-s05-card-face m2-s05-card-front" aria-hidden={explored}>
                  <span className="m2-s05-icon">
                    <CharacteristicIcon id={item.id} />
                  </span>
                  <span className="m2-s05-card-name">{item.name}</span>
                  <span className="m2-s05-card-cue">{item.cue}</span>
                  <span className="m2-s05-reveal-hint">{explored ? 'Explored' : 'Open card'}</span>
                </span>

                <span
                  id={panelId}
                  className="m2-s05-card-face m2-s05-card-back"
                  aria-hidden={!explored}
                >
                  <span className="m2-s05-back-label">{item.name}</span>
                  <span className="m2-s05-explanation">{item.explanation}</span>
                  <span className="m2-s05-question">
                    <span>Practice question</span>
                    {item.question}
                  </span>
                </span>
              </button>
            );
          })}
        </section>

        <footer className="m2-s05-footer">
          <p>
            A rights lens is practical: it helps teams notice who may be missed, whether
            dignity is protected, and how one barrier can affect several rights at once.
          </p>
          <button
            type="button"
            className="m2-s05-cta"
            disabled={!allExplored}
            aria-disabled={!allExplored}
            onClick={completeAndContinue}
          >
            Continue to practice
          </button>
        </footer>
      </section>
    </main>
  );
}
