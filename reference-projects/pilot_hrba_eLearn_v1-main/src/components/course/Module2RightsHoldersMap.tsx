import type { LearningState } from '../../state/learningState';
import actorMapImage from '../../assets/hrba/module-2/visuals/m2-s08-rights-holders-actor-map.png';

type Module2RightsHoldersMapProps = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type RightsHolderSegment = {
  id: string;
  label: string;
  shortLabel: string;
  cue: string;
  barrier: string;
  practiceQuestion: string;
  marker: string;
  accent: 'blue' | 'green' | 'gold' | 'terra' | 'navy' | 'mint';
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S08';
const NEXT_SCREEN_ID = 'M2-S09';
const NEXT_ROUTE = '/module-2/screen-2-9';

const segments: RightsHolderSegment[] = [
  {
    id: 'women-care',
    label: 'Women with care responsibilities',
    shortLabel: 'Care responsibilities',
    cue: 'Meeting time can decide who has a real chance to attend.',
    barrier:
      'Some women may be counted as invited, but care work, timing, transport, safety, or social expectations can limit attendance and voice.',
    practiceQuestion: 'Who could not attend or speak because the process did not fit their daily responsibilities?',
    marker: 'W',
    accent: 'blue',
  },
  {
    id: 'persons-disabilities',
    label: 'Persons with disabilities',
    shortLabel: 'Accessibility',
    cue: 'Invitation is not the same as access.',
    barrier:
      'A person may be invited but still excluded if the venue, communication, seating, transport, or facilitation is not accessible.',
    practiceQuestion: 'What adjustment is needed so participation is real, not only symbolic?',
    marker: 'A',
    accent: 'green',
  },
  {
    id: 'young-people',
    label: 'Young people',
    shortLabel: 'Age and influence',
    cue: 'Presence does not always mean influence.',
    barrier:
      'Young people may attend but feel the decision was already made by elders, leaders, or people with stronger social standing.',
    practiceQuestion: 'Whose views are heard politely but rarely shape the final decision?',
    marker: 'Y',
    accent: 'gold',
  },
  {
    id: 'farther-away',
    label: 'People living farther away',
    shortLabel: 'Distance',
    cue: 'The easiest people to reach are not always the most affected.',
    barrier:
      'People far from the meeting point may miss information, arrive late, face costs, or be treated as less visible in planning.',
    practiceQuestion: 'Who might be missed because reaching them takes more time or resources?',
    marker: 'D',
    accent: 'terra',
  },
  {
    id: 'new-arrivals',
    label: 'Displaced or newly arrived households',
    shortLabel: 'New networks',
    cue: 'People can be present in an area but outside local channels.',
    barrier:
      'Newly arrived people may not be connected to committees, savings groups, notice boards, leaders, or the informal messages others rely on.',
    practiceQuestion: 'Who is outside the usual community network and therefore outside the information flow?',
    marker: 'N',
    accent: 'navy',
  },
  {
    id: 'less-power',
    label: 'People with less social power',
    shortLabel: 'Safe voice',
    cue: 'Silence does not always mean agreement.',
    barrier:
      'Some people may avoid questions or complaints because they fear shame, conflict, retaliation, or being seen as difficult.',
    practiceQuestion: 'Who may stay silent because speaking feels unsafe, pointless, or costly?',
    marker: 'S',
    accent: 'mint',
  },
];

const validSegmentIds = new Set(segments.map((segment) => segment.id));

function getExploredIds(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen27_rights_holders;
  const storedIds = Array.isArray(stored?.openedHotspots) ? stored.openedHotspots : [];
  const tabIds = Array.isArray(state.m2TabsViewed) ? state.m2TabsViewed : [];

  return Array.from(new Set([...storedIds, ...tabIds])).filter((id: string) =>
    validSegmentIds.has(id),
  );
}

function getActiveId(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen27_rights_holders;

  return typeof stored?.activeHotspotId === 'string' && validSegmentIds.has(stored.activeHotspotId)
    ? stored.activeHotspotId
    : segments[0].id;
}

export default function Module2RightsHoldersMap({
  state,
  onChangeState,
}: Module2RightsHoldersMapProps) {
  const exploredIds = getExploredIds(state);
  const activeId = getActiveId(state);
  const activeSegment = segments.find((segment) => segment.id === activeId) || segments[0];
  const exploredCount = exploredIds.length;
  const allExplored = exploredCount === segments.length;

  const openSegment = (segmentId: string) => {
    onChangeState((prev) => {
      const currentExplored = getExploredIds(prev);
      const nextExplored = currentExplored.includes(segmentId)
        ? currentExplored
        : [...currentExplored, segmentId];
      const isComplete = nextExplored.length === segments.length;
      const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);

      if (isComplete) {
        moduleProgress.add(SCREEN_ID);
      }

      return {
        ...prev,
        m2TabsViewed: nextExplored,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(moduleProgress),
        },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen27_rights_holders: {
            screenId: SCREEN_ID,
            activeHotspotId: segmentId,
            openedHotspots: nextExplored,
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
          module2_screen27_rights_holders: {
            screenId: SCREEN_ID,
            activeHotspotId: activeId,
            openedHotspots: exploredIds,
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
    <main className="m2-s08-screen" aria-labelledby="m2-s08-title">
      <section className="m2-s08-shell">
        <header className="m2-s08-header">
          <div className="m2-s08-title-card">
            <p className="m2-s08-kicker">Module 2 · Rights-holders</p>
            <h1 id="m2-s08-title">Rights-Holders: Moving Beyond “The Community”</h1>
            <p>
              A rights lens asks CSOs to look inside broad labels. “The community” is
              made of people with different barriers, responsibilities, voice, risks,
              and ways of being reached.
            </p>
          </div>

          <aside className="m2-s08-progress-card" aria-label="Rights-holder map progress">
            <p className="m2-s08-progress-count" aria-live="polite">
              {exploredCount} of 6 explored
            </p>
            <div className="m2-s08-progress-track" aria-hidden="true">
              <span style={{ width: `${(exploredCount / segments.length) * 100}%` }} />
            </div>
            <p>{allExplored ? 'All groups explored.' : 'Open each group to continue.'}</p>
          </aside>
        </header>

        <section className="m2-s08-map" aria-labelledby="m2-s08-map-title">
          <figure className="m2-s08-asset-figure">
            <img
              src={actorMapImage}
              alt="Actor ecosystem map showing rights-holders, CSOs and facilitators, duty-bearers, community structures, informal leaders, and private actors connected through responsibility, accountability, influence, participation, transparency, and feedback."
            />
            <figcaption>
              CSOs support participation, feedback, and connection, while duty-bearers retain responsibility to respect, protect, fulfil, and account.
            </figcaption>
          </figure>

          <div className="m2-s08-segment-list" role="tablist" aria-label="Rights-holder groups inside the community">
            {segments.map((segment) => {
              const active = segment.id === activeId;
              const explored = exploredIds.includes(segment.id);

              return (
                <button
                  key={segment.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`m2-s08-panel-${segment.id}`}
                  id={`m2-s08-tab-${segment.id}`}
                  className={`m2-s08-segment-tab m2-s08-segment-tab--${segment.accent} ${
                    active ? 'is-active' : ''
                  } ${explored ? 'is-explored' : ''}`}
                  onClick={() => openSegment(segment.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
                      event.preventDefault();
                      openSegment(segment.id);
                    }
                  }}
                >
                  <span aria-hidden="true">{explored ? '✓' : segment.marker}</span>
                  <strong>{segment.label}</strong>
                  <em>{segment.cue}</em>
                </button>
              );
            })}
          </div>

          <article
            className={`m2-s08-map-panel m2-s08-map-panel--${activeSegment.accent}`}
            id={`m2-s08-panel-${activeSegment.id}`}
            role="tabpanel"
            aria-labelledby={`m2-s08-tab-${activeSegment.id}`}
          >
            <p className="m2-s08-kicker">Look inside the label</p>
            <h2 id="m2-s08-map-title">{activeSegment.label}</h2>
            <p className="m2-s08-cue">{activeSegment.cue}</p>
            <div className="m2-s08-map-visual" aria-hidden="true">
              <span>The community</span>
              <strong>{activeSegment.shortLabel}</strong>
            </div>
            <dl>
              <div>
                <dt>What may be hidden?</dt>
                <dd>{activeSegment.barrier}</dd>
              </div>
              <div>
                <dt>CSO practice question</dt>
                <dd>{activeSegment.practiceQuestion}</dd>
              </div>
            </dl>
          </article>

          <aside className="m2-s08-story-card" aria-label="Registration meeting reflection">
            <p className="m2-s08-kicker">Registration meeting</p>
            <h2>“The community attended” is not enough</h2>
            <p>
              The report sentence may be true, but it does not show who was informed,
              who could attend, who had voice, or who could ask questions safely.
            </p>
            <div className="m2-s08-shift">
              <span>Broad label</span>
              <strong>Specific rights-holder groups and barriers</strong>
            </div>
          </aside>
        </section>

        <footer className="m2-s08-footer">
          <p>
            Naming rights-holders clearly helps CSOs design fairer outreach,
            participation, accessibility, information, and accountability.
          </p>
          <button
            type="button"
            className="m2-s08-cta"
            disabled={!allExplored}
            aria-disabled={!allExplored}
            onClick={completeAndContinue}
          >
            Continue to intersectionality
          </button>
        </footer>
      </section>
    </main>
  );
}
