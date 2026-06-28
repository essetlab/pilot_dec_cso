import { useState } from 'react';
import type { LearningState } from '../../state/learningState';
import rightsDimensionsHotspotImage from '../../assets/hrba/module-2/visuals/m2-s04-rights-dimensions-hotspot.png';

type Props = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
  onNext: () => void;
};

type HotspotItem = {
  key: string;
  id: number;
  title: string;
  icon: string;
  barriers: string;
  connection: string;
  coordinates: { top: string; left: string };
  label: string;
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S04';
const NEXT_SCREEN_ID = 'M2-S05';
const NEXT_ROUTE = '/module-2/screen-2-5';

const hotspotItems: HotspotItem[] = [
  {
    key: 'information',
    id: 1,
    title: 'Information Dimension',
    icon: 'ℹ️',
    label: 'Meeting Notice Board',
    barriers: 'The notice for the community meeting was posted only a day in advance on a board at the district office. Quiet or less-connected members heard late or missed it entirely.',
    connection: 'A rights-based approach starts with transparency: ensuring everyone has clear, timely, and accessible information in local languages and channels they actually use.',
    coordinates: { top: '22%', left: '16%' }
  },
  {
    key: 'accessibility',
    id: 2,
    title: 'Accessibility Dimension',
    icon: '📍',
    label: 'Entrance Door & Steps',
    barriers: 'The meeting is held in a hall up a steep path with stairs at the entrance. It is also scheduled during peak farm hours, creating high time-barriers for older people and caregivers.',
    connection: 'Accessibility requires looking at physical barriers, timing, distance, and costs so that the opportunity is realistically reachable for all affected groups.',
    coordinates: { top: '78%', left: '16%' }
  },
  {
    key: 'equality',
    id: 3,
    title: 'Equality & Inclusion Dimension',
    icon: '👥',
    label: 'Back Row Seating',
    barriers: 'At the back of the room, several younger women are sitting quietly. They attended, but they are expected by custom to remain silent and let the older male leaders speak.',
    connection: 'Inclusion means moving beyond general labels like "the community" to identify who sits at the margins of a process and designing ways to bring them in.',
    coordinates: { top: '76%', left: '80%' }
  },
  {
    key: 'participation',
    id: 4,
    title: 'Participation Dimension',
    icon: '🗣️',
    label: 'Plenary Table',
    barriers: 'Two confident members speak first, summarize the choices, and guide the vote. Quieter members nod in agreement without fully understanding the terms discussed.',
    connection: 'Meaningful participation is more than physical attendance or nodding. It requires clear information, understanding, voice, and real influence on the final outcome.',
    coordinates: { top: '52%', left: '48%' }
  },
  {
    key: 'safety_and_dignity',
    id: 5,
    title: 'Safety & Dignity Dimension',
    icon: '⚖️',
    label: 'Facilitator Table',
    barriers: 'A member wanted to ask why the grant was not allocated for childcare support, but stayed silent, fearing that disagreeing with leaders would make her look difficult.',
    connection: 'Dignity means people feel safe to ask questions, raise concerns, or disagree without fear of social risk, shame, or personal consequences.',
    coordinates: { top: '22%', left: '48%' }
  },
  {
    key: 'accountability',
    id: 6,
    title: 'Accountability Dimension',
    icon: '🔄',
    label: 'Feedback Box',
    barriers: 'There is a wooden feedback box near the exit, but it is locked. Members do not know who holds the key, who reads the concerns, or if anyone will ever receive a response.',
    connection: 'Accountability is not just a collection channel. It requires a complete response loop: informing, listening, analyzing, responding, following up, and adapting.',
    coordinates: { top: '22%', left: '80%' }
  }
];

export default function Module2RightsDimensionsHotspot({
  state,
  onChangeState,
  onNext
}: Props) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  
  // Retrieve saved hotspot progress
  const viewedKeys = state.m2HotspotViewed || [];
  const exploredCount = viewedKeys.length;
  const allExplored = exploredCount === hotspotItems.length;

  const handleHotspotClick = (key: string) => {
    setSelectedKey(key);
    
    onChangeState((prev) => {
      const currentViewed = prev.m2HotspotViewed || [];
      if (currentViewed.includes(key)) return prev;
      
      const nextViewed = [...currentViewed, key];
      const isComplete = nextViewed.length === hotspotItems.length;
      const progressList = new Set(prev.screenProgress[MODULE_ID] || []);
      
      if (isComplete) {
        progressList.add(SCREEN_ID);
      }
      
      return {
        ...prev,
        m2HotspotViewed: nextViewed,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(progressList)
        }
      };
    });
  };

  const continueToNextScreen = () => {
    if (!allExplored) return;
    
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
    
    onNext();
  };

  const activeHotspot = hotspotItems.find(item => item.key === selectedKey);

  return (
    <main 
      className="m2-s04-screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="m2-s04-layout-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)',
          gap: '2rem',
          alignItems: 'stretch'
        }}
      >
        {/* Left Zone: Copy, Progress & Selected Info Card */}
        <section 
          className="m2-s04-left-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p 
              className="m2-s04-context"
              style={{
                margin: 0,
                color: 'var(--color-primary-strong)',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Module 2 · Interactive Scene
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
              What Rights Dimensions Can You See?
            </h1>
            <p 
              style={{
                margin: 0,
                fontSize: '0.95rem',
                lineHeight: 1.5,
                color: '#334155'
              }}
            >
              Explore this community meeting scene. A local CSO is preparing a discussion about water service delivery. Click each glowing hotspot in the meeting room to uncover the everyday rights dimensions.
            </p>
          </div>

          {/* Details Card */}
          <div 
            className="m2-s04-details-card"
            style={{
              flexGrow: 1,
              backgroundColor: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: 'var(--player-card-shadow)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: activeHotspot ? 'flex-start' : 'center',
              alignItems: activeHotspot ? 'stretch' : 'center',
              textAlign: activeHotspot ? 'left' : 'center',
              minHeight: '200px',
              boxSizing: 'border-box'
            }}
          >
            {activeHotspot ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.4rem' }} role="img" aria-hidden="true">{activeHotspot.icon}</span>
                  <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-deep-navy)', fontFamily: 'var(--font-family-headings)' }}>
                    {activeHotspot.title}
                  </h2>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                  Area inspected: {activeHotspot.label}
                </p>
                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.45, color: '#334155' }}>
                  <strong>Everyday Barrier:</strong> {activeHotspot.barriers}
                </p>
                <div 
                  style={{ 
                    borderTop: '1px dashed var(--color-border)', 
                    paddingTop: '0.75rem', 
                    marginTop: '0.25rem',
                    color: 'var(--color-primary-strong)' 
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.4, fontWeight: 500 }}>
                    💡 <strong>Rights Connection:</strong> {activeHotspot.connection}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem' }} role="img" aria-hidden="true">🔍</span>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, maxWidth: '260px' }}>
                  Select a numbered hotspot on the scene to inspect its everyday rights dimension.
                </p>
              </div>
            )}
          </div>

          {/* Progress and Continue Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-deep-navy)' }}>
                Exploration Progress
              </span>
              <span 
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  backgroundColor: allExplored ? 'var(--color-accent-green)' : 'var(--color-primary)',
                  color: allExplored ? 'var(--color-deep-navy)' : '#fff',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px'
                }}
              >
                {exploredCount} of 6 viewed
              </span>
            </div>
            
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${(exploredCount / 6) * 100}%`, 
                  height: '100%', 
                  backgroundColor: allExplored ? 'var(--color-accent-green)' : 'var(--color-primary)',
                  transition: 'width 0.4s ease' 
                }} 
              />
            </div>

            <button
              type="button"
              className="m2-s04-cta"
              disabled={!allExplored}
              onClick={continueToNextScreen}
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
                textAlign: 'center',
                boxShadow: allExplored ? '0 4px 12px rgba(145, 200, 82, 0.25)' : 'none',
                marginTop: '0.25rem'
              }}
            >
              Continue to characteristics
            </button>
          </div>
        </section>

        {/* Right Zone: Schematic Vector Illustration Map */}
        <section 
          className="m2-s04-right-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '0'
          }}
        >
          <div 
            className="m2-s04-map-container"
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '75%', /* 4:3 Aspect Ratio */
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: '1px solid var(--color-border-dark)',
              overflow: 'hidden',
              boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            <img
              className="m2-s04-hotspot-image"
              src={rightsDimensionsHotspotImage}
              alt="Illustrated community meeting scene showing information, access, voice, inclusion, responsibility, and accountability points to inspect."
            />
            <p className="sr-only">
              The scene shows a community meeting with visible access routes, an information board, facilitation space, participants with different opportunities to speak, and feedback points. Use the six hotspots to inspect rights dimensions in the scene.
            </p>

            {/* Hotspots Overlay Buttons */}
            {hotspotItems.map((item) => {
              const viewed = viewedKeys.includes(item.key);
              const isActive = selectedKey === item.key;
              
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleHotspotClick(item.key)}
                  aria-expanded={isActive}
                  aria-label={`Hotspot ${item.id}: ${item.label}. ${viewed ? 'Visited' : 'Unvisited'}. Click to inspect.`}
                  style={{
                    position: 'absolute',
                    top: item.coordinates.top,
                    left: item.coordinates.left,
                    transform: 'translate(-50%, -50%)',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                    zIndex: 10
                  }}
                  className={`m2-s04-hotspot-btn ${isActive ? 'is-active' : ''}`}
                >
                  {/* Outer Pulsing Ring */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: '-6px',
                      borderRadius: '50%',
                      border: viewed 
                        ? '2px solid rgba(145,200,82,0.4)' 
                        : '2px solid rgba(59,153,212,0.4)',
                      animation: viewed ? 'none' : 'm2-s04-pulse 1.8s infinite ease-in-out',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                  
                  {/* Inner Core */}
                  <div 
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: isActive
                        ? '#fff'
                        : viewed 
                          ? 'var(--color-accent-green)' 
                          : 'var(--color-primary)',
                      border: `2px solid ${
                        isActive 
                          ? viewed ? 'var(--color-accent-green)' : 'var(--color-primary)'
                          : '#fff'
                      }`,
                      color: isActive
                        ? viewed ? 'var(--color-accent-green)' : 'var(--color-primary)'
                        : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {viewed ? '✓' : item.id}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Global CSS for pulsers and focus outline */}
      <style>{`
        @keyframes m2-s04-pulse {
          0% {
            transform: scale(0.9);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .m2-s04-hotspot-btn:focus-visible {
          outline: 3px solid var(--color-primary-strong);
          outline-offset: 6px;
          border-radius: 50%;
        }
        @media (max-width: 920px) {
          .m2-s04-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </main>
  );
}
