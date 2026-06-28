import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { LearningState } from '../../state/learningState';

type Module2ActivityReportMissedProps = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type OptionStatus = 'correct' | 'not-strong';

type DiagnosisOption = {
  id: string;
  letter: string;
  text: string;
  status: OptionStatus;
  signal?: string;
  feedbackCategory?: string;
};

type FeedbackState =
  | 'strong'
  | 'mostly'
  | 'partial'
  | 'surface'
  | 'over'
  | 'full-lens'
  | null;

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S1-02';
const NEXT_SCREEN_ID = 'M2-S2-02';
const NEXT_ROUTE = '/module-2/screen-2-3';

const correctOptionIds = [
  'A_INFORMATION_CRITERIA',
  'B_PHYSICAL_ACCESS',
  'C_WOMEN_VOICE',
  'D_DISABILITY_ACCESS',
  'E_POWER_TRANSPARENCY',
  'F_ACCOUNTABILITY_RESPONSE',
];

const notStrongOptionIds = ['G_REPORT_SUBMITTED', 'H_CHAIRS_ARRANGED'];

const options: DiagnosisOption[] = [
  {
    id: 'A_INFORMATION_CRITERIA',
    letter: 'A',
    text: 'Some people did not understand the registration criteria.',
    status: 'correct',
    signal: 'Transparency and access to information',
  },
  {
    id: 'B_PHYSICAL_ACCESS',
    letter: 'B',
    text: 'The meeting place was too far or difficult for some people to reach.',
    status: 'correct',
    signal: 'Equal access and non-discrimination',
  },
  {
    id: 'C_WOMEN_VOICE',
    letter: 'C',
    text: 'Women attended the meeting, but most did not speak or influence the discussion.',
    status: 'correct',
    signal: 'Meaningful participation',
  },
  {
    id: 'D_DISABILITY_ACCESS',
    letter: 'D',
    text: 'A person with a disability was invited, but the venue was not accessible.',
    status: 'correct',
    signal: 'Accessibility and inclusion',
  },
  {
    id: 'E_POWER_TRANSPARENCY',
    letter: 'E',
    text: 'Some young people believed the list was already decided before the meeting.',
    status: 'correct',
    signal: 'Power, fairness, and transparency',
  },
  {
    id: 'F_ACCOUNTABILITY_RESPONSE',
    letter: 'F',
    text:
      'A community member asked where to complain or ask questions later, but no clear answer was given.',
    status: 'correct',
    signal: 'Accountability and response',
  },
  {
    id: 'G_REPORT_SUBMITTED',
    letter: 'G',
    text: 'The activity report was submitted after the training.',
    status: 'not-strong',
    feedbackCategory: 'Administrative follow-up',
  },
  {
    id: 'H_CHAIRS_ARRANGED',
    letter: 'H',
    text: 'The chairs were arranged before the meeting started.',
    status: 'not-strong',
    feedbackCategory: 'Normal activity preparation',
  },
];

function getStoredActivityState(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen22_rights_issue_diagnosis;
  const validIds = new Set(options.map((option) => option.id));
  const selectedOptions = Array.isArray(stored?.selectedOptionIds)
    ? stored.selectedOptionIds.filter((id: string) => validIds.has(id))
    : [];
  const attemptCount =
    typeof stored?.attemptCount === 'number' && stored.attemptCount > 0
      ? Math.min(stored.attemptCount, 2)
      : 0;
  const feedbackState = stored?.feedbackState || null;

  return {
    selectedOptions,
    attemptCount,
    feedbackState: feedbackState as FeedbackState,
    hasViewedFullLens: Boolean(stored?.hasViewedFullLens),
    screenComplete: (state.screenProgress[MODULE_ID] || []).includes(SCREEN_ID),
  };
}

function evaluateSelection(selectedOptions: string[], attemptNumber: number): FeedbackState {
  const correctCount = selectedOptions.filter((id) => correctOptionIds.includes(id)).length;
  const incorrectCount = selectedOptions.filter((id) => notStrongOptionIds.includes(id)).length;
  const selectedOnlySurface =
    selectedOptions.length > 0 && selectedOptions.every((id) => notStrongOptionIds.includes(id));
  const selectedAllCorrect =
    correctCount === correctOptionIds.length && incorrectCount === 0;
  const overSelected = selectedOptions.length >= 7 && incorrectCount > 0;

  if (attemptNumber >= 2 && !selectedAllCorrect) return 'mostly';
  if (selectedAllCorrect) return 'strong';
  if (overSelected) return 'over';
  if (selectedOnlySurface) return 'surface';
  if (correctCount >= 4 && incorrectCount <= 1) return 'mostly';
  if (correctCount >= 1 && correctCount <= 3) return 'partial';
  return 'surface';
}

function getFeedbackCopy(feedbackState: FeedbackState) {
  switch (feedbackState) {
    case 'strong':
      return {
        tone: 'strong',
        heading: 'Strong noticing',
        text:
          'Yes. You noticed the main rights signals in the story. This situation may involve more than activity delivery because people may not have had equal access, clear information, meaningful voice, disability inclusion, fair decision-making, or a clear way to ask questions and seek response.',
        statement:
          'A rights issue often appears when people are affected by decisions but cannot access information, participate meaningfully, be included fairly, or seek accountability.',
      };
    case 'mostly':
      return {
        tone: 'support',
        heading: 'Good start — look a little deeper',
        text:
          'You identified several important rights signals. There may still be one or two deeper issues to notice. Look again for signs related to information, access, voice, disability inclusion, fairness, and accountability.',
      };
    case 'partial':
      return {
        tone: 'support',
        heading: 'You are noticing some signs',
        text:
          'You found part of the issue. Now look again at who may have been left out, who had information, who could speak, who could physically access the activity, and who could ask for a response. Rights issues are often hidden in the process, not only in the final report.',
      };
    case 'surface':
      return {
        tone: 'reflect',
        heading: 'Look beyond activity completion',
        text:
          'These details may show that the activity was organized or documented, but they do not tell us whether people had information, access, voice, inclusion, fairness, or a way to seek response. Try again by looking at the comments from community members.',
      };
    case 'over':
      return {
        tone: 'reflect',
        heading: 'Separate rights signals from normal activity details',
        text:
          'Some details show ordinary activity management. Other details point to possible rights issues. A rights signal usually tells us something about dignity, equality, information, participation, inclusion, power, responsibility, or accountability. Try again and choose the options that show these deeper concerns.',
      };
    case 'full-lens':
      return {
        tone: 'full',
        heading: 'Full rights lens',
        text: 'The strongest rights signals are:',
      };
    default:
      return null;
  }
}

export default function Module2ActivityReportMissed({
  state,
  onChangeState,
}: Module2ActivityReportMissedProps) {
  const initial = getStoredActivityState(state);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initial.selectedOptions);
  const [attemptCount, setAttemptCount] = useState(initial.attemptCount);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>(initial.feedbackState);
  const [showRightsSignalTags, setShowRightsSignalTags] = useState(Boolean(initial.feedbackState));
  const [hasViewedFullLens, setHasViewedFullLens] = useState(initial.hasViewedFullLens);
  const [screenComplete, setScreenComplete] = useState(initial.screenComplete);
  const feedbackHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const feedbackCopy = getFeedbackCopy(feedbackState);
  const selectedCount = selectedOptions.length;
  const hasFeedback = feedbackState !== null;
  const isFullOrStrong = feedbackState === 'strong' || feedbackState === 'full-lens';
  const canContinue = hasFeedback && (isFullOrStrong || hasViewedFullLens);
  const canShowFullLens = hasFeedback && attemptCount >= 2 && !isFullOrStrong;
  const selectedCorrectCount = selectedOptions.filter((id) =>
    correctOptionIds.includes(id),
  ).length;

  useEffect(() => {
    if (feedbackState) feedbackHeadingRef.current?.focus();
  }, [feedbackState]);

  const persistActivityState = (
    nextSelectedOptions: string[],
    nextAttemptCount: number,
    nextFeedbackState: FeedbackState,
    nextHasViewedFullLens: boolean,
    completionStatus: 'in_progress' | 'completed' = 'in_progress',
  ) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: {
        ...prev.practiceCheckState,
        module2_screen22_rights_issue_diagnosis: {
          screenId: SCREEN_ID,
          selectedOptionIds: nextSelectedOptions,
          attemptCount: nextAttemptCount,
          feedbackState: nextFeedbackState,
          hasViewedFullLens: nextHasViewedFullLens,
          completionStatus,
        },
      },
    }));
  };

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    setSelectedOptions((prev) => {
      const next = checked ? [...prev, value] : prev.filter((id) => id !== value);
      persistActivityState(next, attemptCount, feedbackState, hasViewedFullLens);
      return next;
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;

    const nextAttemptCount = Math.min(attemptCount + 1, 2);
    const nextFeedbackState = evaluateSelection(selectedOptions, nextAttemptCount);
    const nextViewedFullLens = nextFeedbackState === 'strong' || nextFeedbackState === 'full-lens';

    setAttemptCount(nextAttemptCount);
    setFeedbackState(nextFeedbackState);
    setShowRightsSignalTags(true);
    setHasViewedFullLens(nextViewedFullLens);
    persistActivityState(selectedOptions, nextAttemptCount, nextFeedbackState, nextViewedFullLens);
  };

  const handleTryAgain = () => {
    setFeedbackState(null);
    setShowRightsSignalTags(false);
    persistActivityState(selectedOptions, attemptCount, null, hasViewedFullLens);
  };

  const handleShowFullLens = () => {
    setFeedbackState('full-lens');
    setShowRightsSignalTags(true);
    setHasViewedFullLens(true);
    persistActivityState(selectedOptions, attemptCount, 'full-lens', true);
  };

  const handleContinue = () => {
    if (!canContinue) return;

    const completedAt = new Date().toISOString();
    setScreenComplete(true);
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
          module2_screen22_rights_issue_diagnosis: {
            screenId: SCREEN_ID,
            selectedOptionIds: selectedOptions,
            attemptCount,
            feedbackState,
            hasViewedFullLens,
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
    <main className="m2-s22-screen m2-s22-diagnosis-screen" aria-labelledby="m2-s22-title">
      <section className="m2-s22-diagnosis-canvas">
        <header className="m2-s22-diagnosis-header">
          <div>
            <p className="m2-s22-context-label">Module 2 · Everyday rights lens</p>
            <h1 id="m2-s22-title">What Makes This a Rights Issue?</h1>
            <p>
              Think back to the training and registration story. The activity was
              completed, but the comments showed that something deeper may be happening.
              Select all the signs that suggest this situation may also be a rights issue.
            </p>
          </div>
          <div
            className="m2-s22-lens-visual"
            role="img"
            aria-label="Illustration of a rights lens placed over a project activity report, with small icons representing information, access, participation, inclusion, fairness, and accountability."
          >
            <span className="m2-s22-lens-ring" aria-hidden="true">
              Rights lens
            </span>
            <span aria-hidden="true">Information</span>
            <span aria-hidden="true">Access</span>
            <span aria-hidden="true">Voice</span>
            <span aria-hidden="true">Inclusion</span>
          </div>
        </header>

        <div className="m2-s22-diagnosis-body">
          <section className="m2-s22-recap-card" aria-labelledby="m2-s22-recap-title">
            <div>
              <p className="m2-s22-card-kicker">Scenario recap</p>
              <h2 id="m2-s22-recap-title">Quick recap</h2>
            </div>
            <p>
              The CSO completed a livelihood training and registration day. Attendance
              looked good, and the activity report was submitted. But later, the team
              heard that some people did not understand the criteria, some could not
              easily reach the meeting place, women attended but did not speak much, the
              venue was not accessible for a person with a disability, young people felt
              the list was already decided, and no one clearly explained how to complain
              or ask questions later.
            </p>
            <p className="m2-s22-recap-prompt">
              Which of these are signs that the issue may have a rights dimension?
            </p>
          </section>

          <section className="m2-s22-options-panel" aria-labelledby="m2-s22-question">
            <div className="m2-s22-options-head">
              <div>
                <p className="m2-s22-card-kicker">Noticing activity</p>
                <h2 id="m2-s22-question">
                  Which signs suggest that this project situation may also be a rights issue?
                </h2>
                <p>Select all that apply. There is more than one strong answer.</p>
              </div>
              <p className="m2-s22-attempt-chip" aria-live="polite">
                Attempt {Math.max(attemptCount, 1)} of 2
              </p>
            </div>

            <div className="m2-s22-option-grid">
              {options.map((option) => {
                const selected = selectedOptions.includes(option.id);
                const isCorrect = option.status === 'correct';
                const missedCorrect = hasFeedback && isCorrect && !selected;
                const selectedNotStrong = hasFeedback && selected && !isCorrect;
                const selectedCorrect = hasFeedback && selected && isCorrect;

                return (
                  <label
                    key={option.id}
                    className={[
                      'm2-s22-option-card',
                      selected ? 'is-selected' : '',
                      selectedCorrect ? 'is-confirmed' : '',
                      missedCorrect ? 'is-missed' : '',
                      selectedNotStrong ? 'is-not-strong' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={selected}
                      onChange={handleOptionChange}
                    />
                    <span className="m2-s22-option-check" aria-hidden="true">
                      {selected ? '✓' : option.letter}
                    </span>
                    <span className="m2-s22-option-copy">
                      <span>{option.text}</span>
                      {showRightsSignalTags && isCorrect && (
                        <span className="m2-s22-signal-tag">
                          {selected ? 'Selected' : 'Also notice this'} · {option.signal}
                        </span>
                      )}
                      {showRightsSignalTags && selectedNotStrong && (
                        <span className="m2-s22-neutral-tag">
                          Not a strong rights signal by itself · {option.feedbackCategory}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          <aside
            className={`m2-s22-feedback-panel ${
              feedbackCopy ? `m2-s22-feedback-panel--${feedbackCopy.tone}` : ''
            }`}
            aria-live="polite"
            aria-labelledby={feedbackCopy ? 'm2-s22-feedback-title' : undefined}
          >
            {feedbackCopy ? (
              <>
                <p className="m2-s22-card-kicker">Feedback</p>
                <h2 id="m2-s22-feedback-title" tabIndex={-1} ref={feedbackHeadingRef}>
                  {feedbackCopy.heading}
                </h2>
                <p>{feedbackCopy.text}</p>
                {feedbackState === 'strong' && feedbackCopy.statement && (
                  <p className="m2-s22-feedback-statement">{feedbackCopy.statement}</p>
                )}
                {feedbackState === 'full-lens' && (
                  <ul className="m2-s22-full-lens-list">
                    <li>
                      People did not understand the criteria. This points to transparency
                      and access to information.
                    </li>
                    <li>
                      Some people could not easily reach the meeting place. This points to
                      equal access.
                    </li>
                    <li>
                      Women attended but did not speak or influence the discussion. This
                      points to meaningful participation.
                    </li>
                    <li>
                      A person with a disability was invited, but the venue was not
                      accessible. This points to inclusion and accessibility.
                    </li>
                    <li>
                      Young people believed the list was already decided. This points to
                      power, fairness, and transparency.
                    </li>
                    <li>
                      No clear complaint or question pathway was explained. This points to
                      accountability.
                    </li>
                    <li>
                      The report being submitted and the chairs being arranged may matter
                      for project management, but they do not by themselves show whether
                      the activity was rights-based.
                    </li>
                  </ul>
                )}
                <div className="m2-s22-feedback-actions">
                  {!isFullOrStrong && attemptCount < 2 && (
                    <button type="button" className="m2-s22-secondary-button" onClick={handleTryAgain}>
                      Try again
                    </button>
                  )}
                  {canShowFullLens && (
                    <button type="button" className="m2-s22-secondary-button" onClick={handleShowFullLens}>
                      Show the full rights lens
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="m2-s22-card-kicker">Guided feedback</p>
                <h2>Check your noticing</h2>
                <p>
                  Select the details that point to information, access, voice, inclusion,
                  fairness, or accountability. Feedback will appear here after you check
                  your answer.
                </p>
                <p className="m2-s22-feedback-meter">
                  {selectedCount === 0
                    ? 'No options selected yet.'
                    : `${selectedCount} option${selectedCount === 1 ? '' : 's'} selected.`}
                </p>
              </>
            )}
          </aside>
        </div>

        <footer className="m2-s22-diagnosis-footer">
          <div className={`m2-s22-insight-statement ${canContinue ? 'is-visible' : ''}`}>
            {canContinue ? (
              <>
                <p>
                  A rights issue is not only about whether an activity happened. It is
                  also about whether people had dignity, information, access, voice,
                  inclusion, fairness, and a way to seek response.
                </p>
                <p>
                  Now that you have practiced noticing rights signals, the next screen
                  will put human rights into simple, practical CSO language.
                </p>
              </>
            ) : (
              <p>
                {hasFeedback
                  ? `${selectedCorrectCount} strong rights signal${
                      selectedCorrectCount === 1 ? '' : 's'
                    } selected. Use the feedback before continuing.`
                  : 'Select at least one option, then check your noticing.'}
              </p>
            )}
          </div>
          <div className="m2-s22-footer-actions">
            <button
              type="button"
              className="m2-s22-secondary-button m2-s22-check-button"
              disabled={selectedOptions.length === 0}
              onClick={handleSubmit}
            >
              {selectedOptions.length === 0 ? 'Select at least one option' : 'Check my noticing'}
            </button>
            <button
              type="button"
              className="m2-s22-cta"
              disabled={!canContinue}
              aria-disabled={!canContinue}
              onClick={handleContinue}
            >
              Continue to human rights in practical language
            </button>
          </div>
          {screenComplete && (
            <span className="sr-only" aria-live="polite">
              Screen complete. Moving to human rights in practical language.
            </span>
          )}
        </footer>
      </section>
    </main>
  );
}
