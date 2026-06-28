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
const SCREEN_ID = 'M2-S14';
const NEXT_SCREEN_ID = 'M2-S15';
const NEXT_ROUTE = '/module-2/screen-2-15';

const items: CompactRevealItem[] = [
  {
    id: 'present',
    title: 'Present',
    cue: 'People are visible or counted.',
    body:
      'Attendance sheets and photos can show who was in the room. They do not show whether people understood, spoke, influenced, or received a response.',
    question: 'What does our attendance evidence show, and what does it not show?',
    marker: '1',
    accent: 'blue',
  },
  {
    id: 'informed',
    title: 'Informed',
    cue: 'People understand the purpose, criteria, and choices.',
    body:
      'Participation is weak if information is unclear, late, inaccessible, or shared only through channels that miss less visible groups.',
    question: 'Did people understand the decision before being asked to participate?',
    marker: '2',
    accent: 'green',
  },
  {
    id: 'heard',
    title: 'Heard',
    cue: 'People can ask questions and raise concerns safely.',
    body:
      'Voice requires time, language, facilitation, confidence, accessibility, and safety. Silence does not always mean agreement.',
    question: 'Who spoke, who stayed silent, and why?',
    marker: '3',
    accent: 'gold',
  },
  {
    id: 'influential',
    title: 'Influential',
    cue: 'People’s input can affect decisions and follow-up.',
    body:
      'Participation becomes meaningful when people can shape criteria, timing, access arrangements, feedback channels, or response plans.',
    question: 'What changed because people participated?',
    marker: '4',
    accent: 'terra',
  },
];

const choices: CompactChoice[] = [
  {
    id: 'attendance',
    label: 'A',
    text: 'The attendance sheet is complete, so participation was meaningful.',
    feedback: 'Attendance matters, but it does not prove voice, influence, or response.',
    correct: false,
  },
  {
    id: 'voice',
    label: 'B',
    text: 'People had clear information, safe voice, influence over decisions, and a response loop.',
    feedback: 'Strongest. This is the rights-based participation standard in practical CSO language.',
    correct: true,
  },
  {
    id: 'leaders',
    label: 'C',
    text: 'Leaders spoke on behalf of everyone, so wider participation was not needed.',
    feedback: 'Representation may help, but it can also hide who was not heard.',
    correct: false,
  },
];

export default function Module2ParticipationAttendance({ state, onChangeState }: Props) {
  return (
    <Module2CompactRevealScreen
      state={state}
      onChangeState={onChangeState}
      className="m2-s14-screen"
      stateKey="module2_screen214_participation_attendance"
      moduleId={MODULE_ID}
      screenId={SCREEN_ID}
      nextScreenId={NEXT_SCREEN_ID}
      nextRoute={NEXT_ROUTE}
      kicker="Module 2 · Participation"
      title="Participation Is More Than Attendance"
      intro="Participation is one of the easiest words to overstate. HRBA asks whether people were only present, or whether they had information, voice, influence, and response."
      progressLabel="participation levels explored"
      instruction="Open all four levels, then choose what meaningful participation requires."
      items={items}
      asideTitle="Attendance is a start"
      asideBody="A full room can still hide weak information, low voice, closed decisions, or no response pathway."
      footer="Attendance can show who was in the room. HRBA asks whether people could understand, speak, influence, and seek a response."
      continueLabel="Continue to participation practice"
      choiceTitle="Participation check"
      choiceInstruction="Which option best describes meaningful participation?"
      choices={choices}
    />
  );
}
