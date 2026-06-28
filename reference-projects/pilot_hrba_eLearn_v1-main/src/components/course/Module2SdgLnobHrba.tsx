import type { LearningState } from '../../state/learningState';
import Module2CompactRevealScreen, {
  type CompactChoice,
  type CompactRevealItem,
} from './Module2CompactRevealScreen';
import sdgLnobInfographic from '../../assets/hrba/module-2/visuals/m2-s13-sdg-lnob-linkage-infographic.png';

type Props = {
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

const MODULE_ID = 'module_02_everyday_cso_work';
const SCREEN_ID = 'M2-S13';
const NEXT_SCREEN_ID = 'M2-S14';
const NEXT_ROUTE = '/module-2/screen-2-14';

const items: CompactRevealItem[] = [
  {
    id: 'sdgs',
    title: 'SDGs',
    cue: 'Describe the development change the project supports.',
    body:
      'The SDGs help a CSO name broad goals such as livelihoods, gender equality, decent work, poverty reduction, or cleaner energy. HRBA then asks who benefits and how.',
    question: 'What change are we trying to support, and for whom?',
    marker: 'S',
    accent: 'blue',
  },
  {
    id: 'lnob',
    title: 'Leave No One Behind',
    cue: 'Ask who is still missed or benefiting less.',
    body:
      'LNOB becomes practical when the CSO identifies people at the edge: those who hear late, face access barriers, stay silent, or remain outside decision spaces.',
    question: 'Who is likely to be missed, and why?',
    marker: 'L',
    accent: 'green',
  },
  {
    id: 'hrba',
    title: 'HRBA',
    cue: 'Connect exclusion to rights, barriers, responsibility, and action.',
    body:
      'HRBA deepens SDG and LNOB language by asking about rights-holders, equality, participation, information, accountability, responsibility, power, and safe response.',
    question: 'Why is exclusion happening, and who should respond?',
    marker: 'H',
    accent: 'gold',
  },
  {
    id: 'together',
    title: 'Use Them Together',
    cue: 'Move from slogan to practical project questions.',
    body:
      'Together, SDGs name the change, LNOB asks who is at the edge, and HRBA asks why, who is responsible, and how people can participate and seek response.',
    question: 'What practical question will make our SDG or LNOB claim stronger?',
    marker: '+',
    accent: 'terra',
  },
];

const choices: CompactChoice[] = [
  {
    id: 'mention',
    label: 'A',
    text: 'Mention an SDG number and say no one will be left behind.',
    feedback: 'This is mostly slogan unless the team identifies who is excluded and why.',
    correct: false,
  },
  {
    id: 'link',
    label: 'B',
    text: 'Name the SDG change, identify who may be left behind, and use HRBA questions to plan response.',
    feedback: 'Strongest. It connects SDG, LNOB, and HRBA in a practical way.',
    correct: true,
  },
  {
    id: 'separate',
    label: 'C',
    text: 'Use SDGs for donors and HRBA only for training language.',
    feedback: 'This separates tools that are stronger when used together.',
    correct: false,
  },
];

export default function Module2SdgLnobHrba({ state, onChangeState }: Props) {
  return (
    <Module2CompactRevealScreen
      state={state}
      onChangeState={onChangeState}
      className="m2-s13-screen"
      stateKey="module2_screen213_sdg_lnob"
      moduleId={MODULE_ID}
      screenId={SCREEN_ID}
      nextScreenId={NEXT_SCREEN_ID}
      nextRoute={NEXT_ROUTE}
      kicker="Module 2 · SDGs, LNOB, HRBA"
      title="HRBA, SDGs, and Leave No One Behind"
      intro="Many CSOs already use SDG and LNOB language. A rights lens turns that language into sharper questions about exclusion, responsibility, participation, and response."
      progressLabel="linkages explored"
      instruction="Open all four linkages, then choose the strongest integrated statement."
      items={items}
      asideTitle="From slogan to practice"
      asideBody="The goal is not more terminology. The goal is clearer analysis of who benefits, who is missed, why, and what response is needed."
      footer="SDGs, LNOB, and HRBA work best when they help teams name change, identify exclusion, analyze responsibility, and design safer action."
      continueLabel="Continue to participation"
      choiceTitle="Linkage check"
      choiceInstruction="Which statement uses SDGs, LNOB, and HRBA most practically?"
      choices={choices}
      visualAsset={{
        src: sdgLnobInfographic,
        alt: 'Infographic linking SDGs, Leave No One Behind, and HRBA principles. It shows development goals and outcomes connected to people facing barriers, and HRBA principles such as participation, accountability, non-discrimination, transparency, and empowerment.',
        caption: 'Use SDGs to name the development change, LNOB to identify who is still at the edge, and HRBA to ask why exclusion happens and who should respond.',
      }}
    />
  );
}
