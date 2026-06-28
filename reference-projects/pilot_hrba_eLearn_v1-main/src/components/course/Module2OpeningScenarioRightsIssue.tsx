import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { LearningState } from '../../state/learningState';

type Module2OpeningScenarioRightsIssueProps = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type Voice = {
  id: string;
  speaker: string;
  speech: string;
  signal: string;
  markerLabel: string;
  position: {
    desktop: { x: number; y: number };
    mobile: { x: number; y: number };
  };
};

const MODULE_ID = 'module_02_everyday_cso_work';
const COURSE_ID = 'applying-hrba-in-cso-practice';
const SCREEN_ID = 'M2-S1-01';
const PUBLIC_SCREEN_ID = 'module-2-screen-2-1';
const ROUTE_KEY = 'module-2/screen-2-1';
const NEXT_SCREEN_ID = 'M2-S1-02';
const NEXT_ROUTE = '/module-2/screen-2-2';
const SCENARIO_IMAGE =
  '/assets/hrba/module-2/screen-2-1/M2_S2_1_VIS_01_ScenarioIllustration.png';

const voices: Voice[] = [
  {
    id: 'voice-1',
    speaker: 'Community member',
    speech: '“I came to the meeting, but I still did not understand the registration criteria.”',
    signal: 'Information access',
    markerLabel: 'Community member voice, information access',
    position: { desktop: { x: 30, y: 61 }, mobile: { x: 20, y: 60 } },
  },
  {
    id: 'voice-2',
    speaker: 'Older participant',
    speech:
      '“The meeting place was too far for some people. Those who live near the main road came more easily.”',
    signal: 'Physical access',
    markerLabel: 'Older participant voice, physical access',
    position: { desktop: { x: 80, y: 23 }, mobile: { x: 77, y: 24 } },
  },
  {
    id: 'voice-3',
    speaker: 'Women’s group member',
    speech:
      '“Women were present, but most of us did not speak. The discussion was already moving too fast.”',
    signal: 'Voice and influence',
    markerLabel: 'Women’s group member voice, voice and influence',
    position: { desktop: { x: 67, y: 62 }, mobile: { x: 65, y: 61 } },
  },
  {
    id: 'voice-4',
    speaker: 'Invited participant',
    speech:
      '“A person with a disability was invited, but the entrance and seating were not accessible.”',
    signal: 'Disability access',
    markerLabel: 'Invited participant voice, disability access',
    position: { desktop: { x: 86, y: 71 }, mobile: { x: 85, y: 70 } },
  },
  {
    id: 'voice-5',
    speaker: 'Young person',
    speech: '“Some young people said the list was already decided before the meeting started.”',
    signal: 'Power and transparency',
    markerLabel: 'Young person voice, power and transparency',
    position: { desktop: { x: 92, y: 44 }, mobile: { x: 91, y: 43 } },
  },
  {
    id: 'voice-6',
    speaker: 'Community member',
    speech:
      '“Someone asked where to complain or ask questions later, but no one gave a clear answer.”',
    signal: 'Accountability',
    markerLabel: 'Community member voice, accountability',
    position: { desktop: { x: 46, y: 76 }, mobile: { x: 45, y: 76 } },
  },
];

function trackModule2Screen21Event(eventName: string, payload: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const analytics = (window as Window & {
    analytics?: { track?: (event: string, eventPayload: Record<string, string>) => void };
  }).analytics;

  analytics?.track?.(eventName, payload);
}

function getInitialVisitedVoices(state: LearningState) {
  const moduleProgress = state.screenProgress[MODULE_ID] || [];
  const screenComplete =
    moduleProgress.includes(SCREEN_ID) || moduleProgress.includes(PUBLIC_SCREEN_ID);

  return screenComplete ? voices.map((voice) => voice.id) : [];
}

function StoryCard() {
  return (
    <article className="m2-s21-story-card" aria-labelledby="m2-s21-story-heading">
      <p className="m2-s21-card-kicker">Scenario report</p>
      <h2 id="m2-s21-story-heading">A training day that looked successful</h2>
      <div className="m2-s21-story-copy">
        <p>
          A local CSO is supporting a community livelihood activity. The project team
          planned a training and registration day for people interested in joining the
          next round of support.
        </p>
        <p>
          The team arrived early. The chairs were arranged. The attendance sheet was
          ready. The community committee helped call people into the meeting space.
        </p>
        <p>By the afternoon, the report looked positive:</p>
        <blockquote>
          <p>“Training completed. Registration conducted. Attendance target reached.”</p>
        </blockquote>
      </div>
      <div className="m2-s21-statement-block">
        <span aria-hidden="true">Pause</span>
        <p>
          On paper, the activity looks complete. But later, the team starts hearing
          different comments.
        </p>
      </div>
    </article>
  );
}

function VoiceModal({
  voice,
  onClose,
}: {
  voice: Voice | null;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!voice) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, voice]);

  if (!voice) return null;

  return (
    <div className="m2-s21-dialog-backdrop" role="presentation">
      <section
        className="m2-s21-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="m2-s21-dialog-title"
        aria-describedby="m2-s21-dialog-text"
      >
        <div className="m2-s21-dialog-head">
          <div>
            <p className="m2-s21-card-kicker">Community voice</p>
            <h2 id="m2-s21-dialog-title">{voice.speaker}</h2>
          </div>
          <button
            type="button"
            className="m2-s21-dialog-close"
            onClick={onClose}
            ref={closeButtonRef}
          >
            Close
          </button>
        </div>
        <p id="m2-s21-dialog-text" className="m2-s21-dialog-quote">
          {voice.speech}
        </p>
        <p className="m2-s21-signal-tag">
          <span aria-hidden="true"></span>
          Signal: {voice.signal}
        </p>
      </section>
    </div>
  );
}

export default function Module2OpeningScenarioRightsIssue({
  state,
  onChangeState,
}: Module2OpeningScenarioRightsIssueProps) {
  const [visitedVoiceIds, setVisitedVoiceIds] = useState<string[]>(() =>
    getInitialVisitedVoices(state),
  );
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);
  const [screenComplete, setScreenComplete] = useState(() =>
    getInitialVisitedVoices(state).length === voices.length,
  );
  const [imageFailed, setImageFailed] = useState(false);

  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastActiveVoiceRef = useRef<string | null>(null);

  const activeVoice = useMemo(
    () => voices.find((voice) => voice.id === activeVoiceId) || null,
    [activeVoiceId],
  );
  const allVoicesHeard = visitedVoiceIds.length === voices.length;
  const progressText = `${visitedVoiceIds.length} of ${voices.length} voices heard`;

  const openVoice = (voiceId: string) => {
    setVisitedVoiceIds((prev) => {
      if (prev.includes(voiceId)) return prev;

      const updated = [...prev, voiceId];
      onChangeState((statePrev) => ({
        ...statePrev,
        practiceCheckState: {
          ...statePrev.practiceCheckState,
          module2_screen21_visited_voices: {
            courseId: COURSE_ID,
            moduleId: 'module-2',
            screenId: PUBLIC_SCREEN_ID,
            routeKey: ROUTE_KEY,
            visitedVoiceIds: updated,
          },
        },
      }));

      return updated;
    });

    lastActiveVoiceRef.current = voiceId;
    setActiveVoiceId(voiceId);

    trackModule2Screen21Event('module2_screen21_voice_opened', {
      moduleId: 'module-2',
      screenId: PUBLIC_SCREEN_ID,
      voiceId,
    });
  };

  const handleVoiceKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    voiceId: string,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openVoice(voiceId);
  };

  const closeVoice = () => {
    const targetVoiceId = lastActiveVoiceRef.current;
    setActiveVoiceId(null);
    window.setTimeout(() => {
      if (targetVoiceId) markerRefs.current[targetVoiceId]?.focus();
    }, 0);
  };

  const markCompleteAndContinue = () => {
    if (!allVoicesHeard) return;

    const completedAt = new Date().toISOString();
    setScreenComplete(true);

    onChangeState((prev) => {
      const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);
      moduleProgress.add(SCREEN_ID);
      moduleProgress.add(PUBLIC_SCREEN_ID);

      return {
        ...prev,
        currentScreenId: NEXT_SCREEN_ID,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen21_completion: {
            courseId: COURSE_ID,
            moduleId: 'module-2',
            screenId: PUBLIC_SCREEN_ID,
            routeKey: ROUTE_KEY,
            status: 'completed',
            completionMethod: 'all_six_voice_markers_heard',
            visitedVoiceIds,
            completedAt,
          },
        },
      };
    });

    trackModule2Screen21Event('module2_screen21_completed', {
      moduleId: 'module-2',
      screenId: PUBLIC_SCREEN_ID,
    });

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', NEXT_ROUTE);
    }
  };

  return (
    <main className="m2-s21-screen m2-s21-screen--canvas" aria-labelledby="m2-s21-title">
      <section className="m2-s21-canvas">
        <header className="m2-s21-canvas-header">
          <div>
            <p className="m2-s21-context-label">Module 2 · Foundations of HRBA</p>
            <h1 id="m2-s21-title">
              Opening Scenario: When a Service Problem Is Also a Rights Issue
            </h1>
          </div>
          <p>
            Read the situation, then click the people in the scene to hear what they
            noticed.
          </p>
        </header>

        <div className="m2-s21-canvas-body">
          <StoryCard />

          <section className="m2-s21-scene-panel" aria-labelledby="m2-s21-scene-title">
            <div className="m2-s21-scene-head">
              <div>
                <p className="m2-s21-card-kicker">Community voices</p>
                <h2 id="m2-s21-scene-title">Click each marker in the scene</h2>
              </div>
              <p className="m2-s21-progress" aria-live="polite">
                {progressText}
              </p>
            </div>

            <div className="m2-s21-scene">
              {imageFailed ? (
                <div
                  className="m2-s21-image-fallback"
                  role="img"
                  aria-label="Illustration of a local CSO team facilitating a community training and registration session, with participants seated in a modest meeting space and generic papers on a table."
                >
                  Community training scene
                </div>
              ) : (
                <img
                  src={SCENARIO_IMAGE}
                  alt="Illustration of a local CSO team facilitating a community training and registration session, with participants seated in a modest meeting space and generic papers on a table."
                  onError={() => setImageFailed(true)}
                />
              )}

              {voices.map((voice, index) => {
                const visited = visitedVoiceIds.includes(voice.id);
                return (
                  <button
                    key={voice.id}
                    type="button"
                    className={`m2-s21-voice-marker ${visited ? 'is-visited' : ''}`}
                    style={
                      {
                        '--marker-x': `${voice.position.desktop.x}%`,
                        '--marker-y': `${voice.position.desktop.y}%`,
                        '--marker-x-mobile': `${voice.position.mobile.x}%`,
                        '--marker-y-mobile': `${voice.position.mobile.y}%`,
                      } as CSSProperties
                    }
                    aria-label={`${voice.markerLabel}${visited ? ', heard' : ', not heard yet'}`}
                    onClick={() => openVoice(voice.id)}
                    onKeyDown={(event) => handleVoiceKeyDown(event, voice.id)}
                    ref={(element) => {
                      markerRefs.current[voice.id] = element;
                    }}
                  >
                    <span className="m2-s21-marker-number" aria-hidden="true">
                      {visited ? '✓' : index + 1}
                    </span>
                    <span className="m2-s21-marker-text">
                      {visited ? 'Heard' : 'Voice'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <footer className="m2-s21-canvas-footer">
          <p aria-live="polite">{progressText}</p>
          <button
            type="button"
            className="m2-s21-cta-button"
            disabled={!allVoicesHeard}
            aria-disabled={!allVoicesHeard}
            onClick={markCompleteAndContinue}
          >
            {allVoicesHeard ? 'Continue to team reflection' : 'Hear all six voices to continue'}
          </button>
          {screenComplete && (
            <p className="sr-only" aria-live="polite">
              Screen complete. Moving to team reflection.
            </p>
          )}
        </footer>
      </section>

      <VoiceModal voice={activeVoice} onClose={closeVoice} />
    </main>
  );
}
