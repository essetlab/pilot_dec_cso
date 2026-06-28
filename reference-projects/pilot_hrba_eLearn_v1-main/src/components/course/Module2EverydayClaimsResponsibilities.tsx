import { useState } from 'react';
import type { LearningState } from '../../state/learningState';

type Props = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type DimensionCard = {
  id: string;
  title: string;
  icon: string;
  frontCue: string;
  definition: string;
  question: string;
  color: string;
  bgLight: string;
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S03';
const NEXT_SCREEN_ID = 'M2-S04';
const NEXT_ROUTE = '/module-2/screen-2-4';

const dimensions: DimensionCard[] = [
  {
    id: 'info',
    title: 'Information',
    icon: 'ℹ️',
    frontCue: 'Clear, timely, and understandable information',
    definition: 'People need clear, timely, and understandable information about decisions, opportunities, criteria, services, risks, and follow-up.',
    question: 'Did people receive the information they needed, in a way they could understand and use?',
    color: '#3B99D4', // DEC blue
    bgLight: '#EEF7FC'
  },
  {
    id: 'access',
    title: 'Access',
    icon: '📍',
    frontCue: 'Realistically reaching and using opportunities',
    definition: 'People may know about an opportunity but still face distance, cost, language, disability, documentation, timing, safety, or social barriers.',
    question: 'Could different people realistically reach and use the opportunity or service?',
    color: '#91C852', // Soft green
    bgLight: '#F4FAEC'
  },
  {
    id: 'voice',
    title: 'Voice',
    icon: '🗣️',
    frontCue: 'Safe ways to speak, question, and influence',
    definition: 'Participation is not only being present. People need safe ways to ask questions, express concerns, and influence decisions.',
    question: 'Who had a real chance to speak, question, influence, or disagree safely?',
    color: '#F97316', // Warm terracotta / gold accent
    bgLight: '#FFF4E8'
  },
  {
    id: 'inclusion',
    title: 'Inclusion',
    icon: '👥',
    frontCue: 'Looking past broad labels like “the community”',
    definition: 'Broad words like “the community” can hide differences. Some people may be missed because of gender, age, disability, displacement, poverty, location, workload, language, or power.',
    question: 'Who may be less visible, less connected, or less able to benefit?',
    color: '#0E6F9F', // Darker blue
    bgLight: '#EAF5FD'
  },
  {
    id: 'responsibility',
    title: 'Responsibility',
    icon: '⚖️',
    frontCue: 'Identifying who is responsible to act',
    definition: 'A rights lens asks who has responsibility. The CSO may support, connect, inform, facilitate, or advocate, but it should not assume it is responsible for everything.',
    question: 'Which actor has responsibility, and what is the proper role of the CSO?',
    color: '#475569', // Slate
    bgLight: '#F1F5F9'
  },
  {
    id: 'response',
    title: 'Response',
    icon: '🔄',
    frontCue: 'Living loops, not just passive boxes',
    definition: 'Accountability means people can raise concerns and receive a meaningful response. A complaint box alone is not enough.',
    question: 'If people raise a concern, who listens, responds, follows up, and learns?',
    color: '#0F172A', // Deep navy
    bgLight: '#F8FAFC'
  }
];

export default function Module2EverydayClaimsResponsibilities({
  state,
  onChangeState
}: Props) {
  // Retrieve saved flip state if any
  const savedState = state.practiceCheckState?.m2_s03_everyday_claims;
  const initialFlipped = Array.isArray(savedState?.flippedCardIds) ? savedState.flippedCardIds : [];
  
  const [flippedCards, setFlippedCards] = useState<string[]>(initialFlipped);
  const exploredCount = flippedCards.length;
  const allExplored = exploredCount === dimensions.length;

  const handleCardClick = (id: string) => {
    if (flippedCards.includes(id)) return;
    const next = [...flippedCards, id];
    setFlippedCards(next);
    
    // Update global state progress when a card is flipped
    const isComplete = next.length === dimensions.length;
    const progressList = new Set(state.screenProgress[MODULE_ID] || []);
    if (isComplete) {
      progressList.add(SCREEN_ID);
    }
    
    onChangeState((prevStat) => ({
      ...prevStat,
      screenProgress: {
        ...prevStat.screenProgress,
        [MODULE_ID]: Array.from(progressList)
      },
      practiceCheckState: {
        ...prevStat.practiceCheckState,
        m2_s03_everyday_claims: {
          screenId: SCREEN_ID,
          flippedCardIds: next,
          status: isComplete ? 'completed' : 'in_progress',
          completedAt: isComplete ? new Date().toISOString() : undefined
        }
      }
    }));
  };

  const completeAndContinue = () => {
    if (!allExplored) return;
    
    // Ensure screen completion is recorded
    onChangeState((prev) => {
      const progressList = new Set(prev.screenProgress[MODULE_ID] || []);
      progressList.add(SCREEN_ID);
      return {
        ...prev,
        currentScreenId: NEXT_SCREEN_ID,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(progressList)
        }
      };
    });

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', NEXT_ROUTE);
    }
  };

  return (
    <main 
      className="m2-s03-screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="m2-s03-layout-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.3fr)',
          gap: '2rem',
          alignItems: 'stretch'
        }}
      >
        {/* Left Zone: Copy and Context */}
        <section 
          className="m2-s03-left-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p 
              className="m2-s03-context"
              style={{
                margin: 0,
                color: 'var(--color-primary-strong)',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Module 2 · Everyday rights lens
            </p>
            <h1 
              style={{
                margin: 0,
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-deep-navy)',
                fontFamily: 'var(--font-family-headings)',
                lineHeight: 1.15
              }}
            >
              Human Rights as Everyday Claims and Responsibilities
            </h1>
            <p 
              style={{
                margin: 0,
                fontSize: '0.95rem',
                lineHeight: 1.5,
                color: '#334155'
              }}
            >
              Human rights are not only legal words. In everyday CSO work, they often appear as practical claims: people need information they can understand, access they can use, voice in decisions, fair treatment, responsible actors, and a response when something goes wrong.
            </p>
            <p 
              style={{
                margin: 0,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-muted)'
              }}
            >
              Explore the six everyday rights dimensions. Think about how each one can appear in ordinary CSO activities.
            </p>
          </div>

          <div 
            style={{
              padding: '1.1rem 1.25rem',
              backgroundColor: 'var(--feedback-info-bg)',
              borderLeft: '4px solid var(--color-primary)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(59, 153, 212, 0.05)'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.45, color: 'var(--color-deep-navy)', fontWeight: 500 }}>
              <strong>Everyday Rights Lens:</strong> A rights lens helps a CSO move from <em>“we delivered an activity”</em> to <em>“people had information, access, voice, inclusion, responsible actors, and a pathway for response.”</em>
            </p>
          </div>
        </section>

        {/* Right Zone: Interactive Flip Cards */}
        <section 
          className="m2-s03-right-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Progress and Indicator */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--player-stage-soft)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-deep-navy)' }}>
              Explore the cards
            </span>
            <span 
              className="m2-s03-progress-chip"
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                backgroundColor: allExplored ? 'var(--color-accent-green)' : 'var(--color-primary)',
                color: allExplored ? 'var(--color-deep-navy)' : '#fff',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              {exploredCount} of 6 explored
            </span>
          </div>

          {/* Cards Grid */}
          <div 
            className="m2-s03-cards-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem'
            }}
          >
            {dimensions.map((dim) => {
              const isFlipped = flippedCards.includes(dim.id);
              
              return (
                <button
                  type="button"
                  key={dim.id}
                  onClick={() => handleCardClick(dim.id)}
                  aria-expanded={isFlipped}
                  aria-label={`${dim.title} card. Click to flip.`}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '146px',
                    padding: 0,
                    margin: 0,
                    border: 'none',
                    borderRadius: '16px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    perspective: '1000px',
                    textAlign: 'left',
                    outline: 'none'
                  }}
                  className="m2-s03-card-trigger"
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.5s ease',
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'none',
                      borderRadius: '16px',
                      boxShadow: 'var(--player-card-shadow)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    {/* Front Face */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        backfaceVisibility: 'hidden',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }} role="img" aria-hidden="true">
                          {dim.icon}
                        </span>
                        <h3 
                          style={{
                            margin: 0,
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            color: 'var(--color-deep-navy)',
                            fontFamily: 'var(--font-family-headings)'
                          }}
                        >
                          {dim.title}
                        </h3>
                      </div>
                      <p 
                        style={{
                          margin: 0,
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.35
                        }}
                      >
                        {dim.frontCue}
                      </p>
                      <span 
                        style={{
                          alignSelf: 'flex-end',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: dim.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Explore →
                      </span>
                    </div>

                    {/* Back Face */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: dim.bgLight,
                        borderRadius: '16px',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                      }}
                    >
                      <p 
                        style={{
                          margin: 0,
                          fontSize: '0.75rem',
                          lineHeight: 1.35,
                          color: '#1E293B'
                        }}
                      >
                        {dim.definition}
                      </p>
                      <div 
                        style={{
                          borderTop: `1px solid rgba(15, 23, 42, 0.08)`,
                          paddingTop: '0.4rem'
                        }}
                      >
                        <p 
                          style={{
                            margin: 0,
                            fontSize: '0.73rem',
                            fontWeight: 700,
                            color: 'var(--color-deep-navy)',
                            lineHeight: 1.3
                          }}
                        >
                          {dim.question}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Button Zone */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              marginTop: '0.25rem'
            }}
          >
            <button
              type="button"
              disabled={!allExplored}
              onClick={completeAndContinue}
              style={{
                width: '100%',
                backgroundColor: allExplored ? 'var(--button-success-bg)' : '#cbd5e1',
                color: allExplored ? 'var(--button-success-text)' : '#475569',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: allExplored ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                fontSize: '0.95rem',
                transition: 'background-color var(--transition-fast), transform var(--transition-fast)',
                textAlign: 'center',
                boxShadow: allExplored ? '0 4px 12px rgba(145, 200, 82, 0.25)' : 'none'
              }}
            >
              Continue to next screen
            </button>
            <p 
              style={{
                margin: '0.4rem 0 0',
                fontSize: '0.72rem',
                textAlign: 'center',
                color: allExplored ? 'var(--color-accent-green)' : 'var(--text-muted)',
                fontWeight: 500
              }}
            >
              {allExplored ? 'Ready to continue.' : 'Flip all six cards to unlock the next screen.'}
            </p>
          </div>
        </section>
      </div>

      {/* Global outline / focus styles for cards */}
      <style>{`
        .m2-s03-card-trigger:focus-visible > div {
          outline: 3px solid var(--color-primary-strong);
          outline-offset: 2px;
        }
        @media (max-width: 920px) {
          .m2-s03-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
        @media (max-width: 600px) {
          .m2-s03-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .m2-s03-card-trigger {
            height: 120px !important;
          }
        }
      `}</style>
    </main>
  );
}
