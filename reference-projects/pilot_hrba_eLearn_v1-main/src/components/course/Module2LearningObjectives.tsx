import type { LearningState } from '../../state/learningState';
import type { KeyboardEvent } from 'react';

type Module2LearningObjectivesProps = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
  onNext: () => void;
};

type ObjectiveCard = {
  id: string;
  front: string;
  reveal: string;
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S02';
const COMPLETION_RULE = 'all-cards-flipped';

const objectiveCards: ObjectiveCard[] = [
  {
    id: 'explain-human-rights-simply',
    front: 'Explain human rights simply',
    reveal:
      'Describe human rights in plain language connected to dignity, equality, safety, voice, opportunity, and accountability.',
  },
  {
    id: 'recognize-rights-issues',
    front: 'Recognize rights issues',
    reveal:
      'Notice when an everyday service or project problem may also involve exclusion, discrimination, lack of participation, or unmet responsibility.',
  },
  {
    id: 'identify-rights-dimensions',
    front: 'Identify rights dimensions',
    reveal:
      'Connect everyday CSO issues to rights dimensions such as access to services, participation, safety, equality, information, and public responsibility.',
  },
  {
    id: 'map-actors-and-barriers',
    front: 'Map actors and barriers',
    reveal:
      'Distinguish rights-holders, duty-bearers, supporting actors, and the barriers that prevent some groups from enjoying their rights.',
  },
  {
    id: 'use-standards-safely',
    front: 'Use standards safely',
    reveal:
      'Refer to human rights standards as practical guidance for CSO decisions without becoming overly legalistic or unsafe.',
  },
  {
    id: 'apply-everyday-rights-lens',
    front: 'Apply an everyday rights lens',
    reveal:
      'Use a simple rights-mapping worksheet to analyze one CSO project issue and identify a safer, more rights-based improvement.',
  },
];

function getViewedObjectiveIds(state: LearningState) {
  const moduleProgress = state.screenProgress[MODULE_ID] || [];
  if (moduleProgress.includes(SCREEN_ID)) {
    return objectiveCards.map((card) => card.id);
  }

  return state.m2ObjectiveCardsViewed || [];
}

export default function Module2LearningObjectives({
  state,
  onChangeState,
  onNext,
}: Module2LearningObjectivesProps) {
  const viewedIds = getViewedObjectiveIds(state);
  const viewedCount = viewedIds.length;
  const allCardsFlipped = objectiveCards.every((card) => viewedIds.includes(card.id));

  const markCardViewed = (cardId: string) => {
    onChangeState((prev) => {
      const currentViewed = prev.m2ObjectiveCardsViewed || [];
      const nextViewed = currentViewed.includes(cardId)
        ? currentViewed
        : [...currentViewed, cardId];
      const completed = objectiveCards.every((card) => nextViewed.includes(card.id));
      const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);

      if (completed) {
        moduleProgress.add(SCREEN_ID);
      }

      return {
        ...prev,
        m2ObjectiveCardsViewed: nextViewed,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          m2_s02_learning_objectives: {
            screenId: SCREEN_ID,
            blockType: 'FlashcardGrid',
            variant: 'flashcard-principle-action',
            completionRule: COMPLETION_RULE,
            status: completed ? 'completed' : 'in-progress',
            flippedCardIds: nextViewed,
          },
        },
      };
    });
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLButtonElement>, cardId: string) => {
    if (
      event.key !== 'Enter' &&
      event.key !== ' ' &&
      event.key !== 'Space' &&
      event.key !== 'Spacebar'
    ) {
      return;
    }
    event.preventDefault();
    markCardViewed(cardId);
  };

  const continueToOpeningScenario = () => {
    if (!allCardsFlipped) return;
    onNext();
  };

  return (
    <main className="m2-s02-screen" aria-labelledby="m2-s02-title">
      <section className="m2-s02-canvas" data-template="screen-learning-journey" data-variant="journey-practice-path">
        <header className="m2-s02-header">
          <div>
            <p className="m2-s02-eyebrow">MODULE 2 · LEARNING OBJECTIVES</p>
            <h1 id="m2-s02-title">What you will be able to do</h1>
          </div>
          <p className="m2-s02-instruction">
            Explore the objectives. Each one shows how this module will help you use
            human rights as a practical lens in everyday CSO work.
          </p>
          <p className="m2-s02-intro">
            In this module, human rights will move from distant legal language into
            practical CSO decisions: who is included, who is heard, who has
            responsibility, and how people can seek answers.
          </p>
        </header>

        <section className="m2-s02-card-grid" aria-label="Module 2 learning objectives">
          {objectiveCards.map((card, index) => {
            const viewed = viewedIds.includes(card.id);
            const revealId = `${card.id}-reveal`;
            const stateId = `${card.id}-state`;

            return (
              <button
                type="button"
                key={card.id}
                className={`m2-s02-card ${viewed ? 'is-viewed' : ''}`}
                onClick={() => markCardViewed(card.id)}
                onKeyDown={(event) => handleCardKeyDown(event, card.id)}
                aria-expanded={viewed}
                aria-describedby={`${stateId}${viewed ? ` ${revealId}` : ''}`}
                data-viewed={viewed}
              >
                <span className="m2-s02-card__number" aria-hidden="true">
                  {viewed ? '✓' : index + 1}
                </span>
                <span className="m2-s02-card__content">
                  <span className="m2-s02-card__label">{card.front}</span>
                  <span id={stateId} className="m2-s02-card__state">
                    {viewed ? 'Viewed objective' : 'Not viewed yet'}
                  </span>
                  {viewed && (
                    <span id={revealId} className="m2-s02-card__reveal" aria-live="polite">
                      {card.reveal}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </section>

        <footer className="m2-s02-footer">
          <section className="m2-s02-output" aria-labelledby="m2-s02-output-title">
            <p id="m2-s02-output-title" className="m2-s02-output__label">
              Practical output
            </p>
            <p>
              By the end of this module, you will produce an Everyday Rights Mapping
              Worksheet that helps connect one CSO issue to rights, responsibilities,
              participation, and accountability.
            </p>
          </section>

          <div className="m2-s02-completion" aria-live="polite">
            <p className="m2-s02-progress">
              {viewedCount} of {objectiveCards.length} objectives reviewed
            </p>
            {allCardsFlipped ? (
              <p className="m2-s02-completion__message">
                You have reviewed the module objectives. Continue to the opening scenario.
              </p>
            ) : (
              <p className="m2-s02-completion__helper">Review each objective to continue.</p>
            )}
            <button
              type="button"
              className="m2-s02-continue"
              disabled={!allCardsFlipped}
              aria-disabled={!allCardsFlipped}
              onClick={continueToOpeningScenario}
            >
              Continue to opening scenario
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
