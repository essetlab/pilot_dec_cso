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
const SCREEN_ID = 'M2-S11';
const NEXT_SCREEN_ID = 'M2-S12';
const NEXT_ROUTE = '/module-2/screen-2-12';

const items: CompactRevealItem[] = [
  {
    id: 'facilitator',
    title: 'Facilitator',
    cue: 'Creates spaces where different people can speak and influence.',
    body:
      'A CSO can adjust meeting design, language, timing, facilitation, and follow-up so quieter or less powerful members can participate safely.',
    question: 'Whose voice needs a safer or different space to be heard?',
    marker: 'F',
    accent: 'blue',
  },
  {
    id: 'capacity',
    title: 'Capacity-strengthener',
    cue: 'Builds knowledge, confidence, and practical tools.',
    body:
      'A CSO can help rights-holders understand information, prepare questions, review options, and engage with cooperative leaders, markets, or public actors.',
    question: 'What knowledge or tool would help people engage more equally?',
    marker: 'C',
    accent: 'green',
  },
  {
    id: 'connector',
    title: 'Connector',
    cue: 'Links people with relevant actors without taking control.',
    body:
      'A CSO can connect rights-holders with public offices, service providers, peer groups, market actors, or specialist organizations when that reduces a barrier safely.',
    question: 'Which connection reduces a barrier without replacing rights-holder voice?',
    marker: 'L',
    accent: 'gold',
  },
  {
    id: 'evidence',
    title: 'Evidence holder',
    cue: 'Documents patterns safely so barriers become visible.',
    body:
      'A CSO can record repeated barriers, anonymize sensitive examples, and use evidence to improve its own practice or engage actors constructively.',
    question: 'What pattern needs to be documented without exposing people?',
    marker: 'E',
    accent: 'terra',
  },
  {
    id: 'adaptive',
    title: 'Adaptive learner',
    cue: 'Changes its own approach when the work is not equal in practice.',
    body:
      'A CSO can adjust outreach, timing, accessibility, feedback channels, role rotation, or follow-up when rights-holders show that the design is not working equally.',
    question: 'What should the CSO change in its own practice first?',
    marker: 'A',
    accent: 'navy',
  },
];

const choices: CompactChoice[] = [
  {
    id: 'speak-for',
    label: 'A',
    text: 'Speak for rights-holders whenever decisions are complicated.',
    feedback: 'This can weaken voice. CSO support should strengthen rights-holder agency.',
    correct: false,
  },
  {
    id: 'bounded-support',
    label: 'B',
    text: 'Support voice, evidence, connections, safe engagement, and adaptation within the CSO role.',
    feedback: 'Strongest. This keeps the CSO useful without replacing rights-holders or duty-bearers.',
    correct: true,
  },
  {
    id: 'deliver-only',
    label: 'C',
    text: 'Focus only on activity delivery and leave actor relationships aside.',
    feedback: 'Delivery matters, but HRBA also asks about participation, responsibility, and response.',
    correct: false,
  },
];

export default function Module2CSORoleEcosystem({ state, onChangeState }: Props) {
  return (
    <Module2CompactRevealScreen
      state={state}
      onChangeState={onChangeState}
      className="m2-s11-screen"
      stateKey="module2_screen210_cso_roles"
      moduleId={MODULE_ID}
      screenId={SCREEN_ID}
      nextScreenId={NEXT_SCREEN_ID}
      nextRoute={NEXT_ROUTE}
      kicker="Module 2 · CSO role"
      title="CSOs in the Rights-Based Ecosystem"
      intro="A CSO is not the only actor in a rights-based situation. Its role is to strengthen conditions for information, voice, safe engagement, and accountability."
      progressLabel="CSO roles explored"
      instruction="Open all five CSO roles, then choose the safest role boundary."
      items={items}
      asideTitle="Bounded support"
      asideBody="A rights-based CSO supports voice and accountability without taking over other actors’ responsibilities."
      footer="Clear CSO roles help teams act with care: useful enough to reduce barriers, bounded enough to avoid harm or overpromising."
      continueLabel="Continue to using standards safely"
      choiceTitle="Boundary check"
      choiceInstruction="Which approach best protects rights-holder voice and CSO role clarity?"
      choices={choices}
    />
  );
}
