import type { LearningState } from '../../state/learningState';
import Module2CompactRevealScreen, {
  type CompactChoice,
  type CompactRevealItem,
} from './Module2CompactRevealScreen';

type Props = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S12';
const NEXT_SCREEN_ID = 'M2-S13';
const NEXT_ROUTE = '/module-2/screen-2-13';

const items: CompactRevealItem[] = [
  {
    id: 'questions',
    title: 'Ask Better Questions',
    cue: 'Standards guide what to notice.',
    body:
      'Use rights standards to ask about access, information, participation, equality, responsibility, and response. They help sharpen analysis without turning the CSO into a court.',
    question: 'What question does the standard help us ask more clearly?',
    marker: 'Q',
    accent: 'blue',
  },
  {
    id: 'evidence',
    title: 'Stay With Evidence',
    cue: 'Claim only what you can support.',
    body:
      'Use verified, proportionate, non-sensitive evidence. Avoid dramatic claims when the team only has partial information or when sharing details could expose people.',
    question: 'What do we know, and what do we still need to verify safely?',
    marker: 'E',
    accent: 'green',
  },
  {
    id: 'safety',
    title: 'Protect People',
    cue: 'Rights language should not increase risk.',
    body:
      'Use anonymized patterns, careful wording, and consent-aware practice. Do not expose rights-holders, staff, families, or communities to shame, retaliation, or conflict.',
    question: 'Could this wording or evidence create harm for anyone?',
    marker: 'S',
    accent: 'gold',
  },
  {
    id: 'role',
    title: 'Respect the CSO Role',
    cue: 'Support action without acting like a judge.',
    body:
      'A CSO can improve its own practice, support rights-holder voice, engage responsible actors, and refer where needed. It should avoid unsupported legal conclusions.',
    question: 'Are we supporting safe action within our role?',
    marker: 'R',
    accent: 'terra',
  },
];

const choices: CompactChoice[] = [
  {
    id: 'accuse',
    label: 'A',
    text: 'Declare a legal violation based on one sensitive story.',
    feedback: 'Risky. This may overclaim and expose people.',
    correct: false,
  },
  {
    id: 'careful',
    label: 'B',
    text: 'Describe a rights-related concern, use safe evidence, and plan careful engagement.',
    feedback: 'Strongest. It uses standards as a practical guide without overclaiming.',
    correct: true,
  },
  {
    id: 'avoid',
    label: 'C',
    text: 'Avoid human rights standards completely because they sound legal.',
    feedback: 'Too cautious. Standards can be useful when used carefully and safely.',
    correct: false,
  },
];

export default function Module2SafeStandardsUse({ state, onChangeState }: Props) {
  return (
    <Module2CompactRevealScreen
      state={state}
      onChangeState={onChangeState}
      className="m2-s12-screen"
      stateKey="module2_screen212_safe_standards"
      moduleId={MODULE_ID}
      screenId={SCREEN_ID}
      nextScreenId={NEXT_SCREEN_ID}
      nextRoute={NEXT_ROUTE}
      kicker="Module 2 · Safe standards use"
      title="Using Human Rights Standards Safely"
      intro="Human rights standards can guide better questions, safer planning, and stronger accountability. They should not be used for unsupported accusations."
      progressLabel="safe-use gates explored"
      instruction="Open all four safe-use gates, then choose the safest wording."
      items={items}
      asideTitle="Safe standards habit"
      asideBody="Use standards to improve analysis, evidence, participation, and engagement while protecting people from avoidable risk."
      footer="Safe use of standards helps CSOs be clearer and more accountable without exposing people or overstepping their role."
      continueLabel="Continue to SDGs and LNOB"
      choiceTitle="Safe wording check"
      choiceInstruction="Which option uses standards most safely?"
      choices={choices}
    />
  );
}
