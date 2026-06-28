import type { LearningState } from '../../state/learningState';

export type CompactRevealItem = {
  id: string;
  title: string;
  cue: string;
  body: string;
  question: string;
  marker: string;
  accent?: 'blue' | 'green' | 'gold' | 'terra' | 'navy';
};

export type CompactChoice = {
  id: string;
  label: string;
  text: string;
  feedback: string;
  correct: boolean;
};

type Module2CompactRevealScreenProps = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
  className: string;
  stateKey: string;
  moduleId: string;
  screenId: string;
  nextScreenId: string;
  nextRoute: string;
  kicker: string;
  title: string;
  intro: string;
  progressLabel: string;
  instruction: string;
  items: CompactRevealItem[];
  asideTitle: string;
  asideBody: string;
  footer: string;
  continueLabel: string;
  choiceTitle?: string;
  choiceInstruction?: string;
  choices?: CompactChoice[];
  visualAsset?: {
    src: string;
    alt: string;
    caption: string;
  };
};

const accentOrder = ['blue', 'green', 'gold', 'terra', 'navy'] as const;

function getStored(state: LearningState, stateKey: string, items: CompactRevealItem[], choices?: CompactChoice[]) {
  const stored = state.practiceCheckState?.[stateKey];
  const validItemIds = new Set(items.map((item) => item.id));
  const validChoiceIds = new Set((choices || []).map((choice) => choice.id));
  const openedItems = Array.isArray(stored?.openedItems)
    ? stored.openedItems.filter((id: string) => validItemIds.has(id))
    : [];
  const activeItemId =
    typeof stored?.activeItemId === 'string' && validItemIds.has(stored.activeItemId)
      ? stored.activeItemId
      : items[0]?.id;
  const selectedChoiceId =
    typeof stored?.selectedChoiceId === 'string' && validChoiceIds.has(stored.selectedChoiceId)
      ? stored.selectedChoiceId
      : '';

  return { openedItems, activeItemId, selectedChoiceId };
}

export default function Module2CompactRevealScreen({
  state,
  onChangeState,
  className,
  stateKey,
  moduleId,
  screenId,
  nextScreenId,
  nextRoute,
  kicker,
  title,
  intro,
  progressLabel,
  instruction,
  items,
  asideTitle,
  asideBody,
  footer,
  continueLabel,
  choiceTitle,
  choiceInstruction,
  choices = [],
  visualAsset,
}: Module2CompactRevealScreenProps) {
  const stored = getStored(state, stateKey, items, choices);
  const activeItem = items.find((item) => item.id === stored.activeItemId) || items[0];
  const selectedChoice = choices.find((choice) => choice.id === stored.selectedChoiceId);
  const allOpened = stored.openedItems.length === items.length;
  const needsChoice = choices.length > 0;
  const completionReady = allOpened && (!needsChoice || selectedChoice?.correct === true);

  const openItem = (itemId: string) => {
    onChangeState((prev) => {
      const current = getStored(prev, stateKey, items, choices);
      const nextOpened = current.openedItems.includes(itemId)
        ? current.openedItems
        : [...current.openedItems, itemId];
      const selected = choices.find((item) => item.id === current.selectedChoiceId);
      const isComplete = nextOpened.length === items.length && (!needsChoice || selected?.correct === true);
      const moduleProgress = new Set(prev.screenProgress[moduleId] || []);

      if (isComplete) {
        moduleProgress.add(screenId);
      }

      return {
        ...prev,
        screenProgress: {
          ...prev.screenProgress,
          [moduleId]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          [stateKey]: {
            screenId,
            activeItemId: itemId,
            openedItems: nextOpened,
            selectedChoiceId: current.selectedChoiceId,
            completionStatus: isComplete ? 'completed' : 'in_progress',
          },
        },
      };
    });
  };

  const selectChoice = (choiceId: string) => {
    onChangeState((prev) => {
      const current = getStored(prev, stateKey, items, choices);
      if (current.openedItems.length !== items.length) return prev;

      const choice = choices.find((item) => item.id === choiceId);
      const isComplete = choice?.correct === true;
      const moduleProgress = new Set(prev.screenProgress[moduleId] || []);

      if (isComplete) {
        moduleProgress.add(screenId);
      }

      return {
        ...prev,
        screenProgress: {
          ...prev.screenProgress,
          [moduleId]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          [stateKey]: {
            screenId,
            activeItemId: current.activeItemId,
            openedItems: current.openedItems,
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
      const moduleProgress = new Set(prev.screenProgress[moduleId] || []);
      moduleProgress.add(screenId);

      return {
        ...prev,
        currentScreenId: nextScreenId,
        screenProgress: {
          ...prev.screenProgress,
          [moduleId]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          [stateKey]: {
            screenId,
            activeItemId: stored.activeItemId,
            openedItems: stored.openedItems,
            selectedChoiceId: stored.selectedChoiceId,
            completionStatus: 'completed',
            completedAt,
          },
        },
      };
    });

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', nextRoute);
    }
  };

  return (
    <main className={`m2-compact-screen ${className}`} aria-labelledby={`${screenId}-title`}>
      <section className="m2-compact-shell">
        <header className="m2-compact-header">
          <div className="m2-compact-title-card">
            <p className="m2-compact-kicker">{kicker}</p>
            <h1 id={`${screenId}-title`}>{title}</h1>
            <p>{intro}</p>
          </div>
          <aside className="m2-compact-progress-card" aria-label={`${title} progress`}>
            <p className="m2-compact-progress-count" aria-live="polite">
              {stored.openedItems.length} of {items.length} {progressLabel}
            </p>
            <div className="m2-compact-progress-track" aria-hidden="true">
              <span style={{ width: `${(stored.openedItems.length / items.length) * 100}%` }} />
            </div>
            <p>{completionReady ? 'Ready to continue.' : instruction}</p>
          </aside>
        </header>

        <section className="m2-compact-board" aria-labelledby={`${screenId}-panel-title`}>
          {visualAsset && (
            <figure className="m2-compact-asset-figure">
              <img src={visualAsset.src} alt={visualAsset.alt} />
              <figcaption>{visualAsset.caption}</figcaption>
            </figure>
          )}

          <div className="m2-compact-list" role="tablist" aria-label={title}>
            {items.map((item, index) => {
              const active = activeItem.id === item.id;
              const opened = stored.openedItems.includes(item.id);
              const accent = item.accent || accentOrder[index % accentOrder.length];

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${screenId}-panel-${item.id}`}
                  id={`${screenId}-tab-${item.id}`}
                  className={`m2-compact-tab m2-compact-tab--${accent} ${active ? 'is-active' : ''} ${
                    opened ? 'is-opened' : ''
                  }`}
                  onClick={() => openItem(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
                      event.preventDefault();
                      openItem(item.id);
                    }
                  }}
                >
                  <span aria-hidden="true">{opened ? '✓' : item.marker}</span>
                  <strong>{item.title}</strong>
                  <em>{item.cue}</em>
                </button>
              );
            })}
          </div>

          <article
            className={`m2-compact-panel m2-compact-panel--${activeItem.accent || 'blue'}`}
            id={`${screenId}-panel-${activeItem.id}`}
            role="tabpanel"
            aria-labelledby={`${screenId}-tab-${activeItem.id}`}
          >
            <p className="m2-compact-kicker">In practice</p>
            <h2 id={`${screenId}-panel-title`}>{activeItem.title}</h2>
            <p className="m2-compact-cue">{activeItem.cue}</p>
            <p>{activeItem.body}</p>
            <div className="m2-compact-question">
              <strong>CSO practice question</strong>
              <p>{activeItem.question}</p>
            </div>
          </article>

          <aside className="m2-compact-side-card">
            <p className="m2-compact-kicker">{choiceTitle || 'Field reminder'}</p>
            <h2>{choiceTitle || asideTitle}</h2>
            <p>{choiceInstruction || asideBody}</p>
            {choices.length > 0 ? (
              <div className="m2-compact-choice-list" role="radiogroup" aria-label={choiceTitle}>
                {choices.map((choice) => {
                  const selected = stored.selectedChoiceId === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={!allOpened}
                      className={`m2-compact-choice ${selected ? 'is-selected' : ''}`}
                      onClick={() => selectChoice(choice.id)}
                    >
                      <span>{choice.label}</span>
                      <strong>{choice.text}</strong>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="m2-compact-side-note">{asideBody}</div>
            )}
            <div className="m2-compact-feedback" aria-live="polite">
              {selectedChoice ? (
                <>
                  <strong>{selectedChoice.correct ? 'Strongest choice' : 'Useful, but incomplete'}</strong>
                  <p>{selectedChoice.feedback}</p>
                </>
              ) : (
                <p>{choices.length > 0 ? 'Open all items before choosing.' : 'Open each item to build the full picture.'}</p>
              )}
            </div>
          </aside>
        </section>

        <footer className="m2-compact-footer">
          <p>{footer}</p>
          <button
            type="button"
            className="m2-compact-cta"
            disabled={!completionReady}
            aria-disabled={!completionReady}
            onClick={completeAndContinue}
          >
            {continueLabel}
          </button>
        </footer>
      </section>
    </main>
  );
}
