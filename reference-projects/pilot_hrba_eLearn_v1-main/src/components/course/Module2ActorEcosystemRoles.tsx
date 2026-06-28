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
const SCREEN_ID = 'M2-S10';
const NEXT_SCREEN_ID = 'M2-S11';
const NEXT_ROUTE = '/module-2/screen-2-11';

const items: CompactRevealItem[] = [
  {
    id: 'rights-holders',
    title: 'Rights-holders',
    cue: 'People affected by the issue have rights, voice, and claims.',
    body:
      'Aster, Alemitu, and other cooperative members are rights-holders. So are women who wanted to join but heard late, could not attend, or felt the group was not for them.',
    question: 'Who is affected, who is missed, and who needs support to claim voice safely?',
    marker: 'R',
    accent: 'blue',
  },
  {
    id: 'duty-bearers',
    title: 'Duty-bearers',
    cue: 'Some actors have formal responsibility to respect, protect, or fulfil rights.',
    body:
      'Public offices, mandated institutions, and formal service systems may have responsibilities linked to cooperative registration, accessibility, protection, labour, finance, or accountability.',
    question: 'Which actor has a formal responsibility, and what response is reasonable to seek?',
    marker: 'D',
    accent: 'green',
  },
  {
    id: 'influencers',
    title: 'Influencing actors',
    cue: 'Some actors shape access even without a formal mandate.',
    body:
      'Cooperative leaders, buyers, family members, lenders, elders, market actors, and local networks may influence who hears, joins, speaks, negotiates, or benefits.',
    question: 'Who controls trust, information, approval, resources, or opportunity?',
    marker: 'I',
    accent: 'gold',
  },
  {
    id: 'cso-role',
    title: 'CSO role',
    cue: 'The CSO supports change without replacing everyone else.',
    body:
      'The CSO can facilitate, document patterns safely, strengthen voice, connect actors, adapt its own practice, and support accountability. It should avoid promising what it cannot control.',
    question: 'What can the CSO do directly, and where should it support others to respond?',
    marker: 'C',
    accent: 'terra',
  },
];

const choices: CompactChoice[] = [
  {
    id: 'service-only',
    label: 'A',
    text: 'Treat the CSO as the main actor responsible for fixing every barrier.',
    feedback: 'This can lead to overpromising and replacing responsible actors.',
    correct: false,
  },
  {
    id: 'map-actors',
    label: 'B',
    text: 'Map rights-holders, formal responsibilities, influence, and the CSO’s bounded support role.',
    feedback: 'Strongest. This protects role clarity and helps the team act safely and realistically.',
    correct: true,
  },
  {
    id: 'beneficiaries',
    label: 'C',
    text: 'List beneficiaries and project activities only.',
    feedback: 'This misses responsibility, influence, accountability, and power.',
    correct: false,
  },
];

export default function Module2ActorEcosystemRoles({ state, onChangeState }: Props) {
  return (
    <Module2CompactRevealScreen
      state={state}
      onChangeState={onChangeState}
      className="m2-s10-screen"
      stateKey="module2_screen29_actor_ecosystem"
      moduleId={MODULE_ID}
      screenId={SCREEN_ID}
      nextScreenId={NEXT_SCREEN_ID}
      nextRoute={NEXT_ROUTE}
      kicker="Module 2 · Actor roles"
      title="Duty-Bearers, Supporting Actors, and CSO Roles"
      intro="A barrier is rarely caused by one person or one institution. HRBA asks who has rights, who has responsibility, who has influence, and what a CSO can safely do."
      progressLabel="roles explored"
      instruction="Open all four actor roles, then choose the clearest HRBA response."
      items={items}
      asideTitle="Role clarity protects practice"
      asideBody="A good actor map helps CSOs avoid blaming rights-holders or absorbing every responsibility themselves."
      footer="Actor mapping turns a vague problem into practical questions about rights, responsibility, influence, support, and accountability."
      continueLabel="Continue to CSOs in the ecosystem"
      choiceTitle="Quick role check"
      choiceInstruction="What is the strongest HRBA move when a barrier involves several actors?"
      choices={choices}
    />
  );
}
