import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import type { LearningState } from '../../state/learningState';

type Props = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type Option = {
  id: string;
  title: string;
  text: string;
  tag?: string;
  status?: string;
  feedback?: string;
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S5-06';
const NEXT_SCREEN_ID = 'M2-S6-01';
const NEXT_ROUTE = '/module-2/screen-2-12';

const barrierOptions: Option[] = [
  {
    id: 'late-information',
    title: 'Late or unequal information',
    text:
      'Some women hear about cooperative meetings and opportunities earlier than others because information moves through existing networks.',
    tag: 'Information and access',
  },
  {
    id: 'income-without-control',
    title: 'Income without control',
    text: 'Some members earn income but do not fully influence how the money is saved, spent, or reinvested.',
    tag: 'Benefit control',
  },
  {
    id: 'included-not-influential',
    title: 'Included but not influential',
    text:
      'Some members are active in production but are not selected for buyer negotiation, finance meetings, or cooperative leadership roles.',
    tag: 'Voice and influence',
  },
  {
    id: 'unpaid-care',
    title: 'Unpaid care and time pressure',
    text:
      'Some members participate in cooperative work while still carrying most cooking, childcare, water collection, and household responsibilities.',
    tag: 'Participation cost',
  },
  {
    id: 'credit-access',
    title: 'Credit access barriers',
    text:
      'The cooperative needs finance to grow, but some members may be excluded by collateral, record, guarantor, or documentation requirements.',
    tag: 'Institutional access',
  },
];

const rightsHolderOptions: Option[] = [
  {
    id: 'alemitu-included-not-public-role',
    title: 'Strong match',
    text:
      'Alemitu is a cooperative member and skilled producer, but she is not selected for buyer negotiation or meetings with finance actors.',
    feedback:
      'Good. This focuses on Alemitu’s experience as a rights-holder: she is included in the cooperative, but not yet influential in higher-value roles.',
  },
  {
    id: 'all-same',
    title: 'Weak match',
    text: 'All cooperative members have exactly the same influence and role.',
  },
  {
    id: 'cso-production',
    title: 'Not rights-holder experience',
    text: 'The CSO wants the cooperative to produce more stoves.',
  },
  {
    id: 'buyer-concern',
    title: 'Actor concern',
    text: 'Buyers want to know who can guarantee delivery.',
  },
];

const barrierStatementOptions: Option[] = [
  {
    id: 'role-distribution-not-equal',
    title: 'Strong match',
    text:
      'Cooperative roles are not distributed equally; some members are trusted for production but not for negotiation, leadership, records, or public representation.',
    feedback:
      'Yes. The barrier is not only whether Alemitu joined. It is whether she can move into roles that bring voice, confidence, visibility, and influence.',
  },
  {
    id: 'not-interested',
    title: 'Incorrect',
    text: 'Alemitu is not interested in the cooperative.',
  },
  {
    id: 'too-many-activities',
    title: 'Not the main barrier',
    text: 'The CSO has too many activities.',
  },
  {
    id: 'product-not-useful',
    title: 'Not supported',
    text: 'The stove product is not useful.',
  },
];

const principleOptions: Option[] = [
  { id: 'meaningful-participation', title: 'Meaningful participation', text: 'Strong match' },
  { id: 'non-discrimination-equality', title: 'Non-discrimination and equality', text: 'Strong match' },
  { id: 'transparency-information', title: 'Transparency and access to information', text: 'Possible supporting match' },
  { id: 'accountability-response', title: 'Accountability and response', text: 'Possible supporting match' },
  { id: 'all-rights-for-all', title: 'All human rights for all', text: 'Broad supporting match' },
];

const dutyBearerOptions: Option[] = [
  {
    id: 'local-cooperative-office',
    title: 'Local cooperative office',
    text:
      'May have a role in cooperative registration, governance, oversight, training, or inclusive cooperative practice depending on mandate.',
    feedback:
      'Good. The local cooperative office may be a relevant public actor to clarify cooperative governance support, role fairness, and inclusive participation requirements. The CSO should confirm the mandate before assigning responsibility.',
  },
  {
    id: 'market-buyers',
    title: 'Market buyers',
    text: 'They may strongly influence opportunity, but they are not the primary public duty-bearer.',
  },
  {
    id: 'household-decision-makers',
    title: 'Household decision-makers',
    text: 'They may influence participation or decision-making, but they are not the formal public actor.',
  },
  {
    id: 'donor',
    title: 'The donor',
    text: 'The donor may influence project expectations and flexibility, but it is not the public actor responsible for cooperative governance.',
  },
];

const influenceOptions: Option[] = [
  {
    id: 'cooperative-leadership',
    title: 'Cooperative leadership',
    text: 'Shapes role assignment, meeting agendas, representation, records, and decision-making.',
  },
  {
    id: 'other-members',
    title: 'Other cooperative members',
    text: 'Can support fair role rotation, peer learning, and more inclusive decision-making.',
  },
  {
    id: 'market-buyers',
    title: 'Market buyers',
    text: 'May influence who is trusted to negotiate or represent product quality.',
  },
  {
    id: 'womens-association-business-mentor',
    title: 'Women’s association or business mentor',
    text: 'Can support leadership confidence, negotiation preparation, and peer learning.',
  },
  {
    id: 'microfinance',
    title: 'Microfinance institution',
    text: 'May matter if finance meetings or credit requirements are part of the barrier.',
  },
  {
    id: 'random-community',
    title: 'Random community members not connected to the cooperative',
    text: 'They may not have direct influence over this barrier.',
  },
];

const csoNextStepOptions: Option[] = [
  {
    id: 'take-over-buyers',
    title: 'Not rights-based',
    text: 'The CSO takes over buyer negotiation permanently because buyers trust the CSO more.',
    feedback:
      'This may solve a short-term problem but weakens cooperative agency. The CSO should support members to gain voice, not replace them.',
  },
  {
    id: 'facilitate-reflection-build-capacity-engage-safely',
    title: 'Strongest',
    text:
      'The CSO facilitates a cooperative reflection on role distribution, supports less-visible members to prepare for buyer and finance discussions, and engages relevant actors where needed.',
    feedback:
      'Yes. This combines facilitation, capacity-strengthening, and safe engagement. It supports rights-holder voice without taking over.',
  },
  {
    id: 'tell-alemitu-confidence',
    title: 'Weak',
    text: 'The CSO tells Alemitu she needs to become more confident before she can represent the cooperative.',
    feedback:
      'Confidence may matter, but this places the burden mainly on Alemitu. A rights-based response also looks at cooperative norms, role allocation, and external actor expectations.',
  },
  {
    id: 'publicly-name-leaders',
    title: 'Risky',
    text: 'The CSO reports that Alemitu is excluded and publicly names the cooperative leaders responsible.',
    feedback:
      'This may create conflict or backlash. Sensitive concerns should be handled through safe, consent-based, constructive processes.',
  },
];

const reflectionOptions = [
  'Who is affected differently?',
  'Who has responsibility?',
  'Who has influence?',
  'What can the CSO safely do?',
  'What should the CSO not promise or take over?',
];

function addUnique(values: string[], value: string) {
  return values.includes(value) ? values : [...values, value];
}

function keyActivate(event: KeyboardEvent<HTMLElement>, action: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
}

function getStoredState(state: LearningState) {
  const stored = state.practiceCheckState?.module2_screen211_rights_responsibilities_map;
  return {
    selectedBarrier: stored?.selectedBarrier || 'included-not-influential',
    selectedRightsHolderExperience: stored?.selectedRightsHolderExperience || '',
    selectedBarrierStatement: stored?.selectedBarrierStatement || '',
    selectedPrinciples: Array.isArray(stored?.selectedPrinciples) ? stored.selectedPrinciples : [],
    selectedDutyBearer: stored?.selectedDutyBearer || '',
    selectedInfluentialActors: Array.isArray(stored?.selectedInfluentialActors) ? stored.selectedInfluentialActors : [],
    selectedCSONextStep: stored?.selectedCSONextStep || '',
    generatedMapViewed: stored?.generatedMapViewed === true,
    safetyNoteViewed: stored?.safetyNoteViewed === true,
    selectedReflectionChoice: stored?.selectedReflectionChoice || '',
    feedback: stored?.feedback || '',
    screenComplete: (state.screenProgress[MODULE_ID] || []).includes(SCREEN_ID),
  };
}

export default function Module2RightsResponsibilitiesMap({ state, onChangeState }: Props) {
  const initial = useMemo(() => getStoredState(state), [state]);
  const [selectedBarrier, setSelectedBarrier] = useState(initial.selectedBarrier);
  const [selectedRightsHolderExperience, setSelectedRightsHolderExperience] = useState(initial.selectedRightsHolderExperience);
  const [selectedBarrierStatement, setSelectedBarrierStatement] = useState(initial.selectedBarrierStatement);
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>(initial.selectedPrinciples);
  const [selectedDutyBearer, setSelectedDutyBearer] = useState(initial.selectedDutyBearer);
  const [selectedInfluentialActors, setSelectedInfluentialActors] = useState<string[]>(initial.selectedInfluentialActors);
  const [selectedCSONextStep, setSelectedCSONextStep] = useState(initial.selectedCSONextStep);
  const [generatedMapViewed, setGeneratedMapViewed] = useState(initial.generatedMapViewed);
  const [safetyNoteViewed, setSafetyNoteViewed] = useState(initial.safetyNoteViewed);
  const [selectedReflectionChoice, setSelectedReflectionChoice] = useState(initial.selectedReflectionChoice);
  const [feedback, setFeedback] = useState(initial.feedback);
  const [screenComplete, setScreenComplete] = useState(initial.screenComplete);

  const mappingStepsComplete =
    Boolean(selectedBarrier) &&
    Boolean(selectedRightsHolderExperience) &&
    Boolean(selectedBarrierStatement) &&
    selectedPrinciples.length > 0 &&
    Boolean(selectedDutyBearer) &&
    selectedInfluentialActors.length > 0 &&
    Boolean(selectedCSONextStep);
  const completionReady = mappingStepsComplete && generatedMapViewed && safetyNoteViewed && Boolean(selectedReflectionChoice);

  const persistState = (
    next: Partial<{
      selectedBarrier: string;
      selectedRightsHolderExperience: string;
      selectedBarrierStatement: string;
      selectedPrinciples: string[];
      selectedDutyBearer: string;
      selectedInfluentialActors: string[];
      selectedCSONextStep: string;
      generatedMapViewed: boolean;
      safetyNoteViewed: boolean;
      selectedReflectionChoice: string;
      feedback: string;
      completionStatus: 'in_progress' | 'completed';
    }> = {},
  ) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: {
        ...prev.practiceCheckState,
        module2_screen211_rights_responsibilities_map: {
          screenId: SCREEN_ID,
          selectedBarrier: next.selectedBarrier ?? selectedBarrier,
          selectedRightsHolderExperience: next.selectedRightsHolderExperience ?? selectedRightsHolderExperience,
          selectedBarrierStatement: next.selectedBarrierStatement ?? selectedBarrierStatement,
          selectedPrinciples: next.selectedPrinciples ?? selectedPrinciples,
          selectedDutyBearer: next.selectedDutyBearer ?? selectedDutyBearer,
          selectedInfluentialActors: next.selectedInfluentialActors ?? selectedInfluentialActors,
          selectedCSONextStep: next.selectedCSONextStep ?? selectedCSONextStep,
          generatedMapViewed: next.generatedMapViewed ?? generatedMapViewed,
          safetyNoteViewed: next.safetyNoteViewed ?? safetyNoteViewed,
          selectedReflectionChoice: next.selectedReflectionChoice ?? selectedReflectionChoice,
          feedback: next.feedback ?? feedback,
          completionStatus: next.completionStatus ?? 'in_progress',
        },
      },
    }));
  };

  useEffect(() => {
    persistState();
    // Persist initial screen state once after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectBarrier = (id: string) => {
    setSelectedBarrier(id);
    setGeneratedMapViewed(false);
    const nextFeedback = id === 'included-not-influential'
      ? 'Recommended route selected. This connects well to Alemitu’s story and role clarity.'
      : 'This barrier can be mapped. The next steps use safe fictional options from the cooperative story.';
    setFeedback(nextFeedback);
    persistState({ selectedBarrier: id, generatedMapViewed: false, feedback: nextFeedback });
  };

  const selectSingle = (
    field: 'selectedRightsHolderExperience' | 'selectedBarrierStatement' | 'selectedDutyBearer' | 'selectedCSONextStep',
    id: string,
    nextFeedback: string,
  ) => {
    setGeneratedMapViewed(false);
    setFeedback(nextFeedback);
    if (field === 'selectedRightsHolderExperience') setSelectedRightsHolderExperience(id);
    if (field === 'selectedBarrierStatement') setSelectedBarrierStatement(id);
    if (field === 'selectedDutyBearer') setSelectedDutyBearer(id);
    if (field === 'selectedCSONextStep') setSelectedCSONextStep(id);
    persistState({ [field]: id, generatedMapViewed: false, feedback: nextFeedback });
  };

  const togglePrinciple = (id: string) => {
    const next = selectedPrinciples.includes(id)
      ? selectedPrinciples.filter((principleId) => principleId !== id)
      : selectedPrinciples.length >= 3
        ? selectedPrinciples
        : [...selectedPrinciples, id];
    const hasStrong =
      next.includes('meaningful-participation') && next.includes('non-discrimination-equality');
    const nextFeedback = hasStrong
      ? 'Strong choice. Alemitu’s issue is not only membership. It is whether participation includes influence, role opportunity, and fair recognition.'
      : 'These principles matter, but look for the most direct concern. In this case, meaningful participation and equality are especially clear.';
    setSelectedPrinciples(next);
    setGeneratedMapViewed(false);
    setFeedback(nextFeedback);
    persistState({ selectedPrinciples: next, generatedMapViewed: false, feedback: nextFeedback });
  };

  const toggleInfluentialActor = (id: string) => {
    const next = selectedInfluentialActors.includes(id)
      ? selectedInfluentialActors.filter((actorId) => actorId !== id)
      : addUnique(selectedInfluentialActors, id);
    const nextFeedback =
      'Good mapping looks at more than one actor. Alemitu’s influence is shaped by internal cooperative roles, buyer trust, peer support, and possible institutional expectations.';
    setSelectedInfluentialActors(next);
    setGeneratedMapViewed(false);
    setFeedback(nextFeedback);
    persistState({ selectedInfluentialActors: next, generatedMapViewed: false, feedback: nextFeedback });
  };

  const viewGeneratedMap = () => {
    if (!mappingStepsComplete) return;
    setGeneratedMapViewed(true);
    persistState({ generatedMapViewed: true });
  };

  const viewSafetyNote = () => {
    setSafetyNoteViewed(true);
    persistState({ safetyNoteViewed: true });
  };

  const selectReflection = (choice: string) => {
    setSelectedReflectionChoice(choice);
    setFeedback('Good. Any of these questions can help a CSO move from a broad problem statement to a clearer rights-based conversation.');
    persistState({
      selectedReflectionChoice: choice,
      feedback:
        'Good. Any of these questions can help a CSO move from a broad problem statement to a clearer rights-based conversation.',
    });
  };

  const completeAndContinue = () => {
    if (!completionReady) return;
    const completedAt = new Date().toISOString();
    setScreenComplete(true);
    onChangeState((prev) => {
      const moduleProgress = new Set(prev.screenProgress[MODULE_ID] || []);
      moduleProgress.add(SCREEN_ID);
      return {
        ...prev,
        currentScreenId: NEXT_SCREEN_ID,
        screenProgress: { ...prev.screenProgress, [MODULE_ID]: Array.from(moduleProgress) },
        practiceCheckState: {
          ...prev.practiceCheckState,
          module2_screen211_rights_responsibilities_map: {
            screenId: SCREEN_ID,
            selectedBarrier,
            selectedRightsHolderExperience,
            selectedBarrierStatement,
            selectedPrinciples,
            selectedDutyBearer,
            selectedInfluentialActors,
            selectedCSONextStep,
            generatedMapViewed,
            safetyNoteViewed,
            selectedReflectionChoice,
            feedback,
            completionStatus: 'completed',
            completedAt,
          },
        },
      };
    });
    if (typeof window !== 'undefined') window.history.pushState(null, '', NEXT_ROUTE);
  };

  return (
    <main className="m2-s31-screen" aria-labelledby="m2-s31-title">
      <section className="m2-s31-shell">
        <header className="m2-s31-hero">
          <div>
            <p className="m2-s31-context">Module 2 · Practice tool</p>
            <h1 id="m2-s31-title">Practice: Build a Simple Rights and Responsibilities Map</h1>
            <div className="m2-s31-opening">
              <p>You have now looked at rights-holders, intersectionality, duty-bearers, supporting actors, and CSO roles.</p>
              <p>
                Now you will put these ideas together. A rights and responsibilities map helps a CSO avoid vague
                statements and ask: who is affected, what barrier exists, who has responsibility, who has influence, who
                can support change, and what can the CSO safely do?
              </p>
            </div>
          </div>
          <article className="m2-s31-statement">
            A rights and responsibilities map does not solve the issue by itself. It helps the CSO see the issue clearly
            enough to choose the right next step.
          </article>
        </header>

        <section className="m2-s31-story">
          <p className="m2-s31-kicker">Story continuity</p>
          <h2>Back to the stove cooperative</h2>
          <p>
            The CSO team has listened to Aster, Alemitu, and other cooperative members. They see connected barriers:
            unequal information, unpaid care work, income without full control, production without visible leadership,
            buyer trust, finance requirements, and unclear ways to raise concerns.
          </p>
          <p className="m2-s31-card-footer">
            The purpose is not to create a perfect analysis. The purpose is to clarify the next rights-based conversation.
          </p>
        </section>

        <section className="m2-s31-preview" aria-labelledby="m2-s31-preview-title">
          <p className="m2-s31-kicker">Tool preview</p>
          <h2 id="m2-s31-preview-title">The six-part map</h2>
          <p>In this activity, you will build a simple map using six parts.</p>
          <ol>
            <li>Rights-holder experience — who is affected and how?</li>
            <li>Barrier — what is making access, voice, benefit, or accountability harder?</li>
            <li>Rights / HRBA principle — what rights-based concern is involved?</li>
            <li>Duty-bearer or responsible public actor — who has formal responsibility?</li>
            <li>Influential or supporting actors — who shapes the situation or can help?</li>
            <li>CSO role and safe next step — what can the CSO realistically do?</li>
          </ol>
          <div className="m2-s31-map-center" aria-hidden="true">Clearer action through role clarity</div>
          <p className="sr-only">
            A six-part rights and responsibilities map showing rights-holder experience, barrier, rights-based concern,
            duty-bearer or public actor, influential and supporting actors, and CSO role with safe next step.
          </p>
        </section>

        <section className="m2-s31-tool">
          <div className="m2-s31-section-head">
            <div>
              <p className="m2-s31-kicker">Interactive mapping canvas</p>
              <h2>Build the map</h2>
              <p>Choose one barrier from the stove cooperative story. You will not type personal information.</p>
            </div>
            <p className="m2-s31-progress">
              {[
                selectedBarrier,
                selectedRightsHolderExperience,
                selectedBarrierStatement,
                selectedPrinciples.length ? 'principles' : '',
                selectedDutyBearer,
                selectedInfluentialActors.length ? 'actors' : '',
                selectedCSONextStep,
              ].filter(Boolean).length}{' '}
              of 7 steps complete
            </p>
          </div>

          <div className="m2-s31-step">
            <h3>Step 1: Choose one barrier to map</h3>
            <p>Select one barrier. The recommended first build is “Included but not influential.”</p>
            <div className="m2-s31-card-grid">
              {barrierOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`m2-s31-option-card ${selectedBarrier === option.id ? 'is-selected' : ''}`}
                  onClick={() => selectBarrier(option.id)}
                  onKeyDown={(event) => keyActivate(event, () => selectBarrier(option.id))}
                >
                  <span className="m2-s31-chip">{option.tag}</span>
                  <strong>{option.title}</strong>
                  <span>{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="m2-s31-step">
            <h3>Step 2: Whose experience are we mapping?</h3>
            <p>Select the rights-holder experience that best matches the barrier.</p>
            <div className="m2-s31-card-grid">
              {rightsHolderOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`m2-s31-option-card ${selectedRightsHolderExperience === option.id ? 'is-selected' : ''}`}
                  onClick={() => selectSingle('selectedRightsHolderExperience', option.id, option.feedback || option.title)}
                  onKeyDown={(event) =>
                    keyActivate(event, () => selectSingle('selectedRightsHolderExperience', option.id, option.feedback || option.title))
                  }
                >
                  <span className="m2-s31-chip">{option.title}</span>
                  <strong>{option.text}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="m2-s31-step">
            <h3>Step 3: What barrier is shaping the experience?</h3>
            <p>Select the barrier that best explains why the rights-holder experience matters.</p>
            <div className="m2-s31-card-grid">
              {barrierStatementOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`m2-s31-option-card ${selectedBarrierStatement === option.id ? 'is-selected' : ''}`}
                  onClick={() => selectSingle('selectedBarrierStatement', option.id, option.feedback || option.title)}
                  onKeyDown={(event) =>
                    keyActivate(event, () => selectSingle('selectedBarrierStatement', option.id, option.feedback || option.title))
                  }
                >
                  <span className="m2-s31-chip">{option.title}</span>
                  <strong>{option.text}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="m2-s31-step">
            <h3>Step 4: Which rights-based concern is involved?</h3>
            <p>Choose up to three HRBA principles or rights-based concerns.</p>
            <div className="m2-s31-chip-grid">
              {principleOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`m2-s31-chip-button ${selectedPrinciples.includes(option.id) ? 'is-selected' : ''}`}
                  aria-pressed={selectedPrinciples.includes(option.id)}
                  onClick={() => togglePrinciple(option.id)}
                  onKeyDown={(event) => keyActivate(event, () => togglePrinciple(option.id))}
                >
                  <strong>{option.title}</strong>
                  <span>{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="m2-s31-step">
            <h3>Step 5: Who may have public responsibility?</h3>
            <p>Select the public actor that may have responsibility connected to this barrier.</p>
            <div className="m2-s31-card-grid">
              {dutyBearerOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`m2-s31-option-card ${selectedDutyBearer === option.id ? 'is-selected' : ''}`}
                  onClick={() => selectSingle('selectedDutyBearer', option.id, option.feedback || option.text)}
                  onKeyDown={(event) => keyActivate(event, () => selectSingle('selectedDutyBearer', option.id, option.feedback || option.text))}
                >
                  <span className="m2-s31-chip">{option.title}</span>
                  <strong>{option.text}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="m2-s31-step">
            <h3>Step 6: Who influences the barrier or can support change?</h3>
            <p>Select actors who influence the situation or can support change. More than one actor may be relevant.</p>
            <div className="m2-s31-card-grid">
              {influenceOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`m2-s31-option-card ${selectedInfluentialActors.includes(option.id) ? 'is-selected' : ''}`}
                  onClick={() => toggleInfluentialActor(option.id)}
                  onKeyDown={(event) => keyActivate(event, () => toggleInfluentialActor(option.id))}
                >
                  <span className="m2-s31-chip">{selectedInfluentialActors.includes(option.id) ? 'Selected' : 'Select'}</span>
                  <strong>{option.title}</strong>
                  <span>{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="m2-s31-step">
            <h3>Step 7: What can the CSO safely and realistically do?</h3>
            <p>Choose the strongest CSO role and next step for this barrier.</p>
            <div className="m2-s31-card-grid">
              {csoNextStepOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`m2-s31-option-card ${selectedCSONextStep === option.id ? 'is-selected' : ''}`}
                  onClick={() => selectSingle('selectedCSONextStep', option.id, option.feedback || option.title)}
                  onKeyDown={(event) => keyActivate(event, () => selectSingle('selectedCSONextStep', option.id, option.feedback || option.title))}
                >
                  <span className="m2-s31-chip">{option.title}</span>
                  <strong>{option.text}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="m2-s31-feedback" aria-live="polite">{feedback || 'Choose from the safe fictional options to build your map.'}</div>
        </section>

        <section className="m2-s31-summary">
          <div className="m2-s31-section-head">
            <div>
              <p className="m2-s31-kicker">Generated summary</p>
              <h2>Your simple rights and responsibilities map</h2>
              <p>This is a simple map, not a full project plan.</p>
            </div>
            <button
              type="button"
              className="m2-s31-link-button"
              disabled={!mappingStepsComplete}
              onClick={viewGeneratedMap}
              onKeyDown={(event) => keyActivate(event, viewGeneratedMap)}
            >
              View generated map
            </button>
          </div>
          {generatedMapViewed && (
            <div className="m2-s31-generated" aria-live="polite">
              <p><strong>Barrier mapped:</strong> Included but not influential</p>
              <p><strong>Rights-holder experience:</strong> Alemitu is a cooperative member and skilled producer, but she is not selected for buyer negotiation or meetings with finance actors.</p>
              <p><strong>Main barrier:</strong> Some cooperative members are trusted for production but not for leadership, negotiation, records, or public representation.</p>
              <p><strong>Rights-based concern:</strong> Meaningful participation and non-discrimination/equality.</p>
              <p><strong>Possible duty-bearer or public actor:</strong> Local cooperative office, depending on mandate.</p>
              <p><strong>Influential/supporting actors:</strong> Cooperative leadership, other cooperative members, market buyers, women’s association or business mentor, and possibly microfinance actors.</p>
              <p><strong>CSO role:</strong> Facilitator, capacity-strengthener, connector, and safe advocate.</p>
              <p><strong>Safe next step:</strong> Facilitate a safe cooperative reflection on role distribution, support less-visible members to prepare for public-facing roles, and engage relevant actors without exposing individuals or taking over the cooperative’s voice.</p>
            </div>
          )}
        </section>

        <section className="m2-s31-safety">
          <div>
            <p className="m2-s31-kicker">Safeguarding / data safety note</p>
            <h2>Use safe examples</h2>
            <p>
              When practicing this tool in real CSO work, avoid writing names, active complaints, household conflict
              details, protection concerns, or sensitive personal stories unless there is a clear, safe, consent-based
              reason.
            </p>
            <ul>
              <li>fictional examples;</li>
              <li>anonymized patterns;</li>
              <li>general role descriptions;</li>
              <li>non-sensitive barriers;</li>
              <li>safe discussion notes.</li>
            </ul>
            <p>A rights-based map should make action clearer without exposing people to harm.</p>
          </div>
          <button type="button" className="m2-s31-link-button" onClick={viewSafetyNote} onKeyDown={(event) => keyActivate(event, viewSafetyNote)}>
            {safetyNoteViewed ? 'Safety note viewed' : 'Mark safety note viewed'}
          </button>
        </section>

        <section className="m2-s31-reflection">
          <p className="m2-s31-kicker">Mini reflection</p>
          <h2>One question to take back to your work</h2>
          <p>Which question from this map would be most useful in your CSO work?</p>
          <div className="m2-s31-chip-grid">
            {reflectionOptions.map((choice) => (
              <button
                key={choice}
                type="button"
                className={`m2-s31-chip-button ${selectedReflectionChoice === choice ? 'is-selected' : ''}`}
                onClick={() => selectReflection(choice)}
                onKeyDown={(event) => keyActivate(event, () => selectReflection(choice))}
              >
                {choice}
              </button>
            ))}
          </div>
        </section>

        <footer className="m2-s31-footer">
          <div>
            <p>
              A rights and responsibilities map helps CSOs act with clarity: support rights-holders, engage responsible
              actors, influence powerful systems, and protect people from unsafe or unrealistic responses.
            </p>
            <p>
              Next, we will look at how to use human rights standards safely — as practical reference points, not as
              unsupported legal claims or legal advice.
            </p>
          </div>
          <button type="button" className="m2-s31-cta" disabled={!completionReady} onClick={completeAndContinue}>
            Continue to safe standards use
          </button>
          <p className="m2-s31-completion-note" aria-live="polite">
            {completionReady
              ? 'Ready to continue.'
              : 'Complete all seven mapping steps, view the generated map and safety note, then choose a reflection card.'}
          </p>
          {screenComplete && <span className="sr-only">Screen complete.</span>}
        </footer>
      </section>
    </main>
  );
}
