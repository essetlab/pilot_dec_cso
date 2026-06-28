import { useState } from 'react';
import type { ReactNode } from 'react';
import type { LearningState } from '../../state/learningState';

type Module5RendererProps = {
  screenId: string;
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type RevealItem = {
  id: string;
  title: string;
  body: string;
  tag?: string;
};

type ChoiceOption = {
  id: string;
  label: string;
  body: string;
  correct?: boolean;
};

type ScreenMode = 'multi' | 'single';

type Module5ScreenConfig = {
  screenId: string;
  context: string;
  title: string;
  lead: string;
  blockType: string;
  storyTitle: string;
  story: string[];
  startButton: string;
  revealTitle: string;
  revealIntro: string;
  revealItems: RevealItem[];
  activityTitle: string;
  activityPrompt: string;
  activityMode: ScreenMode;
  options: ChoiceOption[];
  feedbackStrong: string;
  feedbackSupport: string;
  insightTitle: string;
  insight: string[];
  ctaButton: string;
  nextId: string;
};

const MODULE_ID = 'module_05_hrba_meal';

export const module5IntroVideoUrl = '';

const module5Routes: Record<string, string> = {
  'M5-S1-01': '/module-5/screen-5-1',
  'M5-S1-02': '/module-5/screen-5-2',
  'M5-S1-03': '/module-5/screen-5-3',
  'M5-S1-04': '/module-5/screen-5-4',
  'M5-S1-05': '/module-5/screen-5-5',
  'M5-S1-06': '/module-5/screen-5-6',
  'M5-S1-07': '/module-5/screen-5-7',
  'M5-S1-07A': '/module-5/screen-5-7a',
  'M5-S1-07B': '/module-5/screen-5-7b',
  'M5-S1-07C': '/module-5/screen-5-7c',
  'M5-S1-08': '/module-5/screen-5-8',
  'M5-S1-09': '/module-5/screen-5-9',
  'M5-S1-09A': '/module-5/screen-5-9a',
  'M5-S1-09B': '/module-5/screen-5-9b',
  'M5-S1-09C': '/module-5/screen-5-9c',
  'M5-S1-09D': '/module-5/screen-5-9d',
  'M5-S1-10': '/module-5/screen-5-10',
  'M5-S1-11': '/module-5/screen-5-11',
  'M5-S1-12': '/module-5/screen-5-12',
  'M5-S1-13': '/module-5/screen-5-13',
  'M5-S1-14': '/module-5/screen-5-14',
  'M5-S1-15': '/module-5/screen-5-15',
  'M5-S1-15A': '/module-5/screen-5-15a',
  'M5-S1-16': '/module-5/screen-5-16',
  'M5-S1-17': '/module-5/screen-5-17',
  'M5-S1-18': '/module-5/screen-5-18',
  'M5-S1-19': '/module-5/screen-5-19',
  'M5-S1-20': '/module-5/screen-5-20',
  'M5-S1-21': '/module-5/screen-5-21',
  'M5-S1-22': '/module-5/screen-5-22',
  'M5-S1-23': '/module-5/screen-5-23',
  'M5-S1-24': '/module-5/screen-5-24',
  'M5-S1-25': '/module-5/screen-5-25',
  'M5-PLAYER-COMPLETE': '/module-5/complete',
};

const polishedLabScreenThemes: Record<string, string> = {
  'M5-S1-04': 'm5-screen--evidence-shift',
  'M5-S1-05': 'm5-screen--evidence-classify',
  'M5-S1-06': 'm5-screen--indicator-repair',
  'M5-S1-07': 'm5-screen--indicator-set',
  'M5-S1-07A': 'm5-screen--gender-evidence',
  'M5-S1-07B': 'm5-screen--gender-marker',
  'M5-S1-07C': 'm5-screen--gender-repair',
  'M5-S1-08': 'm5-screen--data-safety',
  'M5-S1-09': 'm5-screen--safe-disaggregation',
  'M5-S1-09A': 'm5-screen--disability-evidence',
  'M5-S1-09B': 'm5-screen--disability-marker',
  'M5-S1-09C': 'm5-screen--disability-data',
  'M5-S1-09D': 'm5-screen--disability-practice',
  'M5-S1-10': 'm5-screen--feedback-evidence',
  'M5-S1-11': 'm5-screen--feedback-action',
};

function setRoute(path: string) {
  if (typeof window !== 'undefined') window.history.pushState(null, '', path);
}

function practiceKey(screenId: string) {
  return `module5_${screenId.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
}

function updatePracticeState(prev: LearningState, key: string, value: Record<string, unknown>) {
  return {
    ...prev.practiceCheckState,
    [key]: {
      ...(prev.practiceCheckState[key] || {}),
      ...value,
    },
  };
}

function completeSimpleScreen(
  currentId: string,
  nextId: string,
  nextRoute: string,
  onChangeState: Module5RendererProps['onChangeState'],
  practiceKeyName: string,
  value: Record<string, unknown> = {},
) {
  onChangeState((prev) => {
    const progress = new Set(prev.screenProgress[MODULE_ID] || []);
    progress.add(currentId);

    return {
      ...prev,
      currentScreenId: nextId,
      screenProgress: {
        ...prev.screenProgress,
        [MODULE_ID]: Array.from(progress),
      },
      practiceCheckState: updatePracticeState(prev, practiceKeyName, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        ...value,
      }),
    };
  });
  setRoute(nextRoute);
}

function ModuleContextLabel({ children }: { children: string }) {
  return <p className="m5-context-label">{children}</p>;
}

function ScreenTitle({ id, children, lead }: { id: string; children: string; lead: string }) {
  return (
    <div className="m5-title-block">
      <h1 id={id}>{children}</h1>
      <p>{lead}</p>
    </div>
  );
}

function ProgressChip({ children }: { children: ReactNode }) {
  return (
    <span className="m5-progress-chip" aria-live="polite">
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" className="m5-primary-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

const module5ObjectiveCards = [
  {
    number: '01',
    title: 'Look beyond good numbers',
    text: 'Ask who benefited, who was missed, and what changed for different people when project reports show strong outputs.',
    accent: 'blue',
  },
  {
    number: '02',
    title: 'Strengthen indicators and evidence',
    text: 'Improve indicators so they capture access, inclusion, participation, accountability, and meaningful change — not only activities completed.',
    accent: 'green',
  },
  {
    number: '03',
    title: 'Use data safely',
    text: 'Apply safer disaggregation and data-minimization choices so evidence helps inclusion without exposing people or sensitive information.',
    accent: 'gold',
  },
  {
    number: '04',
    title: 'Treat feedback as evidence',
    text: 'Use community feedback, concerns, and qualitative signals as learning evidence when they show barriers, exclusion, weak participation, or accountability gaps.',
    accent: 'blue',
  },
  {
    number: '05',
    title: 'Learn and adapt from MEAL findings',
    text: 'Use monitoring evidence to identify what needs to change and choose practical adaptations that strengthen rights-based implementation.',
    accent: 'green',
  },
  {
    number: '06',
    title: 'Report responsibly',
    text: 'Communicate progress, limitations, risks, and learning honestly without overstating results or using stories and data in ways that could harm people.',
    accent: 'gold',
  },
];

const reportGapOptions: ChoiceOption[] = [
  {
    id: 'missed',
    label: 'Who was missed or excluded?',
    body: 'The report does not show who could not attend or who may have been left out because of distance, timing, disability, language, safety, stigma, gender roles, displacement, poverty, or local power dynamics.',
    correct: true,
  },
  {
    id: 'influence',
    label: 'Whether participation influenced decisions',
    body: 'The report counts community meetings, but it does not show whether community input changed the activity plan, venue, facilitation method, messages, referral information, or follow-up actions.',
    correct: true,
  },
  {
    id: 'painted',
    label: 'Whether the feedback box was painted clearly',
    body: 'The color of the box is an administrative detail. It is not the main HRBA evidence gap.',
  },
  {
    id: 'feedback',
    label: 'Whether feedback was received, analyzed, answered, and reported back',
    body: 'The report mentions a feedback box, but it does not show what feedback came in, who could access the channel, what the team did with the feedback, or whether communities heard back.',
    correct: true,
  },
  {
    id: 'gender',
    label: 'Whether different groups experienced different barriers or benefits',
    body: 'The report does not show whether gender roles, safety concerns, time burden, care responsibilities, decision-making power, or social norms affected participation and benefits.',
    correct: true,
  },
  {
    id: 'disability',
    label: 'Whether persons with disabilities could access and influence the activities',
    body: 'The report does not show whether persons with disabilities could access the venue, information, facilitation, communication channels, feedback system, or follow-up support.',
    correct: true,
  },
  {
    id: 'template',
    label: 'Whether the team used the newest reporting template',
    body: 'A good template can help, but using the newest template does not prove inclusion, accountability, safe evidence, or rights-based change.',
  },
  {
    id: 'safety',
    label: 'Whether stories and data were collected safely',
    body: 'The report mentions success stories, but it does not show whether people gave informed consent, whether details were anonymized, or whether sharing the story could create risk.',
    correct: true,
  },
  {
    id: 'change',
    label: 'Whether anything changed beyond attendance',
    body: 'The report says awareness improved, but it does not show what changed in knowledge, confidence, access, participation, accountability, duty-bearer response, or practice.',
    correct: true,
  },
  {
    id: 'adapted',
    label: 'Whether the project team adapted based on evidence',
    body: 'The report does not show whether the team changed anything after noticing barriers, feedback, exclusion, risk, or weak participation.',
    correct: true,
  },
];

const hrbaMealLens = [
  ['Inclusion', 'Who was reached, who was missed, and which groups need intentional attention?'],
  ['Participation and influence', 'Did people only attend, or did their views shape decisions and adaptation?'],
  ['Feedback and accountability', 'Was feedback received, analyzed, answered, and reported back?'],
  ['Gender and disability', 'Did evidence make gendered barriers and accessibility barriers visible enough to respond?'],
  ['Safety and dignity', 'Was data collected and reported with consent, minimum detail, and protection from harm?'],
  ['Change and learning', 'What changed beyond activities, and what should the project adapt next?'],
];

const indicatorDimensions = [
  ['Inclusion', 'Does the indicator help the team see who was reached and who may have been missed?'],
  ['Meaningful participation', 'Does it show whether people only attended or whether their views influenced decisions?'],
  ['Accountability', 'Does it show whether feedback, complaints, or concerns were reviewed, answered, and reported back?'],
  ['Gender sensitivity', 'Does it help the team understand gendered barriers, risks, participation patterns, benefits, or changes?'],
  ['Disability inclusion', 'Does it show whether persons with disabilities could access, participate, give feedback, and benefit?'],
  ['Safety and dignity', 'Does it avoid pushing the team to collect unsafe personal details?'],
  ['Change', 'Does it show whether something changed beyond attendance?'],
  ['AAAQ', 'Where services or support are involved, does it help ask whether these are available, accessible, acceptable, and quality-assured?'],
];

const safetyStoryDetails = [
  ['Name and exact small community', 'These details can make a person identifiable, especially when combined with age, displacement, or disability information.'],
  ['Disability-related detail', 'Only collect and report disability-related information when it has a clear access or inclusion purpose and can be protected.'],
  ['Direct quote about fear', 'A quote can create risk if it points to power dynamics, criticism, or private safety concerns.'],
  ['Photo from the session', 'Images can identify people and link them to sensitive experiences unless consent and safe use are clear.'],
];

function makeReveal(items: string[][]): RevealItem[] {
  return items.map(([title, body], index) => ({
    id: `${index + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    body,
  }));
}

function makeOptions(items: string[], correctIndex = 0): ChoiceOption[] {
  return items.map((label, index) => ({
    id: `option-${index + 1}`,
    label,
    body: index === correctIndex
      ? 'This choice keeps the evidence useful, respectful, and connected to learning and adaptation.'
      : 'This choice may be incomplete, too focused on activity counting, or not safe enough for HRBA MEAL.',
    correct: index === correctIndex,
  }));
}

function baseConfig(spec: {
  id: string;
  title: string;
  block: string;
  storyTitle: string;
  story: string[];
  revealTitle: string;
  revealItems: string[][];
  activityTitle: string;
  activityPrompt: string;
  options: ChoiceOption[];
  mode?: ScreenMode;
  insight: string[];
  cta: string;
  nextId: string;
}): Module5ScreenConfig {
  return {
    screenId: spec.id,
    context: 'Module 5 · HRBA in MEAL',
    title: spec.title,
    lead: 'Use this focused MEAL canvas to look beyond activity numbers and decide what evidence should guide responsible learning.',
    blockType: spec.block,
    storyTitle: spec.storyTitle,
    story: spec.story,
    startButton: 'Open the learning canvas',
    revealTitle: spec.revealTitle,
    revealIntro: 'Open each item, then make the MEAL judgment.',
    revealItems: makeReveal(spec.revealItems),
    activityTitle: spec.activityTitle,
    activityPrompt: spec.activityPrompt,
    activityMode: spec.mode || 'single',
    options: spec.options,
    feedbackStrong: 'Good judgment. You looked for evidence that is useful, respectful, safe, and able to guide adaptation.',
    feedbackSupport: 'Look again for the option that best protects people, explains barriers, answers feedback, and supports learning.',
    insightTitle: 'HRBA MEAL insight',
    insight: spec.insight,
    ctaButton: spec.cta,
    nextId: spec.nextId,
  };
}

const module5Screens: Record<string, Module5ScreenConfig> = {
  'M5-S1-01': {
    screenId: 'M5-S1-01',
    context: 'Module 5 · HRBA in MEAL',
    title: 'The Numbers Looked Good, But the Story Was Incomplete',
    lead: 'A local CSO team is preparing its progress report. At first, everything looks successful. But one question changes the room.',
    blockType: 'Interactive Scenario',
    storyTitle: 'A report that looked ready',
    story: [
      'The project team at Birhan Community Action has just finished a six-month community awareness project. The project officer, finance officer, field facilitator, and MEAL focal person are sitting together to finalize the report.',
      'The numbers look strong: 12 awareness sessions completed, 300 people reached, 85% average attendance, 4 community meetings held, 1 feedback box installed, and 20 success stories collected.',
      'The draft conclusion says: “The project successfully reached vulnerable community members and improved awareness of rights and available services.”',
      'Hana, the MEAL focal person, asks whether these numbers show who was reached, who was missed, whose voice influenced decisions, whether feedback was answered, whether persons with disabilities had access, whether gender barriers changed, and whether stories were collected safely.',
    ],
    startButton: 'Review the evidence gaps',
    revealTitle: 'What the numbers do not yet show',
    revealIntro: 'The report is not wrong. But it does not yet tell the full rights-based story.',
    revealItems: makeReveal([
      ['Who was reached?', 'The report says 300 people attended. But it does not show whether women, men, youth, older people, persons with disabilities, displaced people, or other groups participated meaningfully and safely.'],
      ['Who was missed?', 'The report does not ask who could not attend, who did not receive information, or who may have been excluded by timing, language, location, mobility, safety, stigma, or local power dynamics.'],
      ['Did participation influence decisions?', 'The report counts meetings. But it does not show whether community input changed the activity plan, venue, messages, referral information, or follow-up actions.'],
      ['Was feedback answered?', 'A feedback box was installed. But the report does not show what feedback was received, who raised concerns, how the team responded, or whether communities heard back.'],
      ['Were gender barriers understood?', 'The report says awareness improved. But it does not show whether women, girls, men, boys, or different groups faced different barriers, risks, responsibilities, or decision-making constraints.'],
      ['Were persons with disabilities included?', 'The report does not show whether persons with disabilities could access sessions, information, venues, facilitation methods, feedback channels, or follow-up support.'],
      ['Was evidence collected safely?', 'The report includes success stories. But it is unclear whether people gave informed consent, whether identifying details were removed, and whether sharing the story could create risk.'],
      ['What changed?', 'The report says awareness improved. But it does not yet show what changed in knowledge, confidence, access, participation, accountability, duty-bearer response, or practice.'],
    ]),
    activityTitle: 'Pause and think',
    activityPrompt: 'In many CSO reports, activity numbers are necessary. Which missing question most helps the team look beyond numbers?',
    activityMode: 'single',
    options: makeOptions([
      'What changed for people, and who may still be excluded?',
      'Can we make the table shorter?',
      'Can we add more photos to make the report attractive?',
    ]),
    feedbackStrong: 'Yes. HRBA MEAL does not reject numbers. It asks better questions around the numbers.',
    feedbackSupport: 'The useful question is not only about report format. It is about inclusion, accountability, safety, change, and adaptation.',
    insightTitle: 'The story is incomplete',
    insight: [
      'HRBA MEAL does not reject numbers. It asks better questions around the numbers: who was included, who was missed, who influenced decisions, whether feedback was answered, whether evidence was collected safely, what changed, and what should adapt.',
      'In the next screen, you will help the team identify what is missing from the report.',
    ],
    ctaButton: 'Continue to Screen 5.2',
    nextId: 'M5-S1-02',
  },
  'M5-S1-02': {
    screenId: 'M5-S1-02',
    context: 'Module 5 · HRBA in MEAL',
    title: 'What Is Missing from the Report?',
    lead: 'The Birhan Community Action team has strong activity numbers. Now review the report like an HRBA MEAL practitioner.',
    blockType: 'Multi-Select Knowledge Check',
    storyTitle: 'Report snapshot',
    story: [
      'The project report says: 12 awareness sessions completed; 300 people reached; 85% average attendance; 4 community meetings held; 1 feedback box installed; 20 success stories collected.',
      'The draft conclusion says: “The project successfully reached vulnerable community members and improved awareness of rights and available services.”',
      'The report may be useful. But it is not yet enough.',
    ],
    startButton: 'Diagnose the gaps',
    revealTitle: 'Evidence gaps to notice',
    revealIntro: 'Select all the questions that are still not answered by the report.',
    revealItems: makeReveal([
      ['Activity numbers answer “how many.”', 'They can show sessions, attendance, meetings, feedback tools, and story counts.'],
      ['HRBA MEAL asks “who, how, and what changed.”', 'It asks who was reached, who was missed, who influenced decisions, whether feedback was answered, whether evidence was safe, and what changed.'],
      ['Useful detail is not the same as rights-based evidence.', 'The newest template or the color of a feedback box may matter administratively, but it does not prove inclusion, accountability, safety, or change.'],
    ]),
    activityTitle: 'Select all the evidence gaps you notice',
    activityPrompt: 'Which questions are still not answered by this report?',
    activityMode: 'multi',
    options: reportGapOptions,
    feedbackStrong: 'Strong noticing. You looked beyond activity numbers and identified the key HRBA MEAL evidence gaps.',
    feedbackSupport: 'Good start. Look for the questions numbers often hide: who was missed, who influenced decisions, whether feedback was answered, whether barriers were understood, whether evidence was safe, what changed, and whether the team adapted.',
    insightTitle: 'Key insight',
    insight: [
      'Activity numbers can answer how many sessions, people, meetings, and stories. HRBA MEAL also asks who was reached, who was missed, what changed, whether feedback was answered, and what should adapt.',
    ],
    ctaButton: 'Continue to the HRBA MEAL lens',
    nextId: 'M5-S1-03',
  },
  'M5-S1-03': baseConfig({
    id: 'M5-S1-03',
    title: 'The HRBA MEAL Lens',
    block: 'Interactive Reveal / Lens Card Grid',
    storyTitle: 'A practical lens for reviewing evidence',
    story: ['Hana turns the report discussion into a simple lens the team can use in future monitoring, evaluation, accountability, and learning work.'],
    revealTitle: 'Six questions the lens keeps visible',
    revealItems: hrbaMealLens,
    activityTitle: 'Choose the strongest use of the lens',
    activityPrompt: 'What should the team do when a report has strong numbers but weak rights-based evidence?',
    options: makeOptions(['Use the lens to ask what the numbers do not yet show and what action is needed.', 'Add more totals so the report looks more complete.', 'Avoid feedback evidence because it may complicate reporting.']),
    insight: ['The HRBA MEAL lens helps a CSO use evidence for inclusion, accountability, safety, learning, and adaptation, not only for counting activities.'],
    cta: 'Continue to evidence for change',
    nextId: 'M5-S1-04',
  }),
  'M5-S1-04': baseConfig({
    id: 'M5-S1-04',
    title: 'From Counting Activities to Learning About Change',
    block: 'Image Comparison / Before-After Evidence Shift',
    storyTitle: 'The team compares two evidence views',
    story: ['One view shows completed activities. The other asks what changed for people, which barriers moved, and what still needs attention.'],
    revealTitle: 'The evidence ladder',
    revealItems: [
      ['Output evidence', 'What the project delivered: sessions, meetings, materials, referrals, story notes, and attendance.'],
      ['Reach evidence', 'Who participated, who could not participate, and which groups were reached or missed.'],
      ['Quality evidence', 'Whether information, venues, facilitation, feedback channels, and referral support were accessible and acceptable.'],
      ['Change evidence', 'What changed in knowledge, confidence, access, participation, response, or practice.'],
      ['Learning evidence', 'What the team should keep, change, stop, or test next.'],
    ],
    activityTitle: 'Classify the evidence shift',
    activityPrompt: 'Which evidence view best supports HRBA learning?',
    options: makeOptions(['A combined view that keeps outputs but adds reach, quality, change, and adaptation evidence.', 'Only a large attendance total.', 'Only a narrative success story without consent or context.']),
    insight: ['Counting activities is useful, but it is the beginning of learning, not the end. HRBA MEAL asks what the evidence means for people and action.'],
    cta: 'Continue to evidence classification',
    nextId: 'M5-S1-05',
  }),
  'M5-S1-05': baseConfig({
    id: 'M5-S1-05',
    title: 'Practice: Classify the Evidence',
    block: 'Sorting Activity',
    storyTitle: 'A mixed evidence folder',
    story: ['The team has attendance sheets, feedback themes, facilitator notes, access observations, referral questions, and draft stories. Each piece of evidence can answer a different HRBA MEAL question.'],
    revealTitle: 'Evidence categories',
    revealItems: [
      ['Reach and inclusion', 'Evidence about who participated, who was missed, and which groups need intentional follow-up.'],
      ['Participation and influence', 'Evidence about whose views shaped decisions or adaptations.'],
      ['Feedback and accountability', 'Evidence about what concerns were raised, answered, and reported back.'],
      ['Gender and disability barriers', 'Evidence about different experiences, access needs, safety, care responsibilities, and reasonable accommodation.'],
      ['Safety and dignity', 'Evidence about consent, anonymization, minimum detail, and safe story use.'],
      ['Change and adaptation', 'Evidence about what changed and what the team changed in response.'],
    ],
    activityTitle: 'Choose the strongest classification',
    activityPrompt: 'A note says “women with care responsibilities attended less often in afternoon sessions.” What category best fits?',
    options: makeOptions(['Gender-sensitive access barrier evidence.', 'Only output evidence.', 'Only donor visibility evidence.']),
    insight: ['Classifying evidence helps the team see what it can claim, what it cannot claim yet, and what action may be needed.'],
    cta: 'Continue to the indicator repair lab',
    nextId: 'M5-S1-06',
  }),
  'M5-S1-06': baseConfig({
    id: 'M5-S1-06',
    title: 'Indicator Repair Lab: From Output Indicator to HRBA Indicator',
    block: 'Tool Activity / Indicator Repair Lab',
    storyTitle: 'A weak indicator can produce a weak report',
    story: [
      'Birhan Community Action used this indicator: “Number of people trained on rights and available services.”',
      'This indicator is not useless. It helps the team count reach. But by itself, it does not show who was reached, who was missed, whether people participated meaningfully, whether barriers were reduced, whether feedback was used, or whether anything changed.',
      'Hana says: “Maybe the problem did not start when we wrote the report. Maybe it started when we chose the indicators.”',
    ],
    revealTitle: 'What makes an indicator more HRBA-informed?',
    revealItems: indicatorDimensions,
    activityTitle: 'Repair the indicator',
    activityPrompt: 'Which replacement indicator gives the team a stronger HRBA MEAL signal?',
    options: makeOptions(['Percentage of participants, disaggregated safely, who report that they understood referral steps and could ask questions through an accessible feedback channel.', 'Number of people trained.', 'Number of printed handouts distributed.']),
    insight: ['A stronger HRBA indicator does not need to include everything, but it should help the team see at least one important rights-based dimension.'],
    cta: 'Continue to indicator set practice',
    nextId: 'M5-S1-07',
  }),
  'M5-S1-07': baseConfig({
    id: 'M5-S1-07',
    title: 'Practice: Strengthen the Indicator Set',
    block: 'Interactive Table / Indicator Set Repair Activity',
    storyTitle: 'The team reviews a weak set',
    story: ['The current indicator set counts sessions, attendance, meetings, feedback boxes, and stories. It needs a balanced set that can guide learning.'],
    revealTitle: 'What is missing from the set?',
    revealItems: [
      ['Inclusion indicator', 'The set needs a way to see who was reached and who may have been missed.'],
      ['Participation indicator', 'The set needs a way to see whether people influenced decisions.'],
      ['Feedback indicator', 'The set needs a way to see whether feedback was reviewed, answered, and reported back.'],
      ['Change indicator', 'The set needs a way to see what changed beyond attendance.'],
    ],
    activityTitle: 'Choose the strongest repair',
    activityPrompt: 'Which addition would most improve the set?',
    options: makeOptions(['Add indicators on inclusion, participation influence, feedback response, gender/disability barriers, safe evidence, and change.', 'Add only more activity targets.', 'Remove feedback evidence so reporting is easier.']),
    insight: ['A balanced indicator set helps the team notice exclusion, respond to feedback, protect people, and adapt.'],
    cta: 'Continue to gender-sensitive evidence',
    nextId: 'M5-S1-07A',
  }),
  'M5-S1-07A': baseConfig({
    id: 'M5-S1-07A',
    title: 'Gender-Sensitive Evidence and Indicators',
    block: 'Tabs + Worked Example',
    storyTitle: 'Gender-sensitive MEAL makes difference visible',
    story: ['The team counted women and men in attendance sheets, but counting alone did not show barriers, risks, time burdens, voice, or benefit.'],
    revealTitle: 'What gender-sensitive evidence should show',
    revealItems: [
      ['Access', 'Who could attend, at what time, with what safety, mobility, and care responsibilities?'],
      ['Voice', 'Who spoke, who stayed quiet, and whose input influenced decisions?'],
      ['Benefits', 'Who benefited, how, and whether benefits were equal or different across groups?'],
      ['Risks', 'Whether participation, visibility, travel, or story collection created different risks.'],
    ],
    activityTitle: 'Choose the stronger gender-sensitive indicator',
    activityPrompt: 'Which indicator goes beyond counting women and men?',
    options: makeOptions(['Percentage of women and men who report that session timing, venue, and facilitation allowed them to participate safely and influence discussion.', 'Number of women attending.', 'Number of photos showing women at sessions.']),
    insight: ['Gender-sensitive evidence helps the team understand different barriers and design better responses.'],
    cta: 'Continue to gender marker readiness',
    nextId: 'M5-S1-07B',
  }),
  'M5-S1-07B': baseConfig({
    id: 'M5-S1-07B',
    title: 'Gender Marker Readiness in Plain Language',
    block: 'Interactive Checklist / Marker Readiness Tool',
    storyTitle: 'Readiness means there is an evidence trail',
    story: ['A gender marker should not be a label added at the end. It should be supported by analysis, objectives, activities, indicators, budget, risk thinking, and learning.'],
    revealTitle: 'Gender marker readiness checks',
    revealItems: [
      ['Analysis', 'Does the project explain gendered barriers, risks, roles, access, and decision-making power?'],
      ['Objective and activities', 'Do objectives and activities respond to those barriers?'],
      ['Indicators and evidence', 'Will MEAL show access, voice, benefits, risks, feedback, and adaptation?'],
      ['Resources and accountability', 'Are responsibilities, budget, safeguarding, and reporting arrangements clear?'],
    ],
    activityTitle: 'Readiness judgment',
    activityPrompt: 'When is the project more ready to use a gender marker responsibly?',
    options: makeOptions(['When the marker is supported by analysis, activities, indicators, safeguards, resources, and learning evidence.', 'When the report mentions women once.', 'When the attendance sheet includes a gender column only.']),
    insight: ['Gender marker readiness is practical evidence that gender commitments are built into the project logic and MEAL system.'],
    cta: 'Continue to gender indicator repair',
    nextId: 'M5-S1-07C',
  }),
  'M5-S1-07C': baseConfig({
    id: 'M5-S1-07C',
    title: 'Practice: Repair a Gender-Blind Indicator Set',
    block: 'Indicator Repair Practice',
    storyTitle: 'A gender-blind set can hide unequal experience',
    story: ['The team has indicators that count participants and sessions, but do not show gendered access, voice, benefit, safety, or feedback response.'],
    revealTitle: 'Repair moves',
    revealItems: [
      ['Add access evidence', 'Track whether timing, location, care responsibilities, and safety affected participation.'],
      ['Add voice evidence', 'Track whether women, men, youth, and other groups influenced decisions.'],
      ['Add benefit evidence', 'Track whether different groups experienced different benefits or barriers.'],
      ['Add safe feedback evidence', 'Track whether feedback channels were accessible, trusted, and answered.'],
    ],
    activityTitle: 'Repair the gender-blind set',
    activityPrompt: 'Which repaired set is strongest?',
    options: makeOptions(['A set that combines safe disaggregation with access, voice, benefit, feedback, safety, and adaptation indicators.', 'A set that only counts women and men.', 'A set that removes gender evidence to avoid complexity.']),
    insight: ['This set is stronger because it helps the team understand more than activity completion and can guide better adaptation.'],
    cta: 'Continue to data safety',
    nextId: 'M5-S1-08',
  }),
  'M5-S1-08': baseConfig({
    id: 'M5-S1-08',
    title: 'The Danger of Too Much Detail',
    block: 'Hotspot / Data Safety Scenario',
    storyTitle: 'Useful evidence can become unsafe',
    story: ['The team wants to show who was missed, but very detailed disaggregation and story details can identify people or create stigma, retaliation, or privacy risks.'],
    revealTitle: 'Unsafe detail hotspots',
    revealItems: safetyStoryDetails,
    activityTitle: 'Choose the safer data approach',
    activityPrompt: 'How should the team report exclusion without exposing people?',
    options: makeOptions(['Use minimum necessary, aggregated, anonymized evidence and explain barriers without identifying individuals.', 'Publish all personal details to prove the case.', 'Avoid all inclusion evidence.']),
    insight: ['HRBA MEAL makes exclusion visible while protecting people from avoidable harm.'],
    cta: 'Continue to safer disaggregation practice',
    nextId: 'M5-S1-09',
  }),
  'M5-S1-09': baseConfig({
    id: 'M5-S1-09',
    title: 'Practice: Choose Safer Disaggregation',
    block: 'Scenario-Based Decision Activity',
    storyTitle: 'Choosing useful and safe levels of detail',
    story: ['The team needs evidence by group, but it must decide what level of detail is useful, safe, and necessary for action.'],
    revealTitle: 'Data safety decisions',
    revealItems: [
      ['Aggregate when groups are small', 'Small counts can identify people, especially in small communities or sensitive categories.'],
      ['Collect detail only for a purpose', 'Disaggregation should connect to access, inclusion, adaptation, or accountability decisions.'],
      ['Protect sensitive combinations', 'Age, location, disability, displacement, and quotes can identify someone when combined.'],
      ['Report barriers, not identities', 'The team can describe exclusion patterns without exposing individuals.'],
    ],
    activityTitle: 'Select the safer disaggregation',
    activityPrompt: 'Which approach best balances visibility and protection?',
    options: makeOptions(['Report aggregated patterns and barriers, keep sensitive detail protected, and use detail internally only when needed for safe follow-up.', 'Publish individual-level details by name and location.', 'Remove all group analysis from the report.']),
    insight: ['Safe disaggregation is a judgment: enough detail to act, not so much detail that people can be harmed.'],
    cta: 'Continue to disability inclusion',
    nextId: 'M5-S1-09A',
  }),
  'M5-S1-09A': baseConfig({
    id: 'M5-S1-09A',
    title: 'Disability Inclusion in HRBA MEAL',
    block: 'Interactive Reveal + Accessibility Lens Cards',
    storyTitle: 'Accessibility evidence should guide adaptation',
    story: ['The team counted some participants with disabilities, but it did not consistently track access barriers or adjustments.'],
    revealTitle: 'Disability-inclusive evidence lens',
    revealItems: [
      ['Access to information', 'Could people receive information in accessible formats and channels?'],
      ['Access to venues and facilitation', 'Were venues, seating, timing, communication, and facilitation accessible?'],
      ['Participation and voice', 'Could persons with disabilities ask questions, influence decisions, and provide feedback?'],
      ['Reasonable accommodation', 'Were adjustments identified, budgeted, provided, and followed up?'],
      ['Benefits and response', 'Did evidence show whether barriers reduced and support improved?'],
    ],
    activityTitle: 'Choose the stronger disability-inclusive evidence',
    activityPrompt: 'Which evidence helps the team adapt?',
    options: makeOptions(['Evidence on access barriers, reasonable accommodation, accessible feedback, participation influence, and follow-up action.', 'Only a count of persons with disabilities.', 'Medical diagnosis details for every participant.']),
    insight: ['Disability-inclusive MEAL is about access, participation, reasonable accommodation, feedback, and response, not diagnosis.'],
    cta: 'Continue to disability marker readiness',
    nextId: 'M5-S1-09B',
  }),
  'M5-S1-09B': baseConfig({
    id: 'M5-S1-09B',
    title: 'Disability Marker Readiness in Plain Language',
    block: 'Interactive Checklist / Marker Readiness Tool',
    storyTitle: 'A marker needs practical evidence',
    story: ['A disability marker should be supported by accessibility analysis, activities, indicators, budgets, responsibilities, reasonable accommodation, and learning evidence.'],
    revealTitle: 'Disability marker readiness checks',
    revealItems: [
      ['Barrier analysis', 'Has the project identified communication, physical, attitudinal, institutional, and digital barriers?'],
      ['Accessible design', 'Are activities, venues, materials, feedback channels, and referral pathways accessible?'],
      ['Indicators and data safety', 'Do indicators focus on access, participation, accommodation, and response without unnecessary diagnosis?'],
      ['Resources and responsibilities', 'Are budget, roles, follow-up, and adaptation decisions clear?'],
    ],
    activityTitle: 'Readiness judgment',
    activityPrompt: 'Which readiness evidence is strongest?',
    options: makeOptions(['The project has evidence on barriers, adjustments, accessible feedback, responsible roles, resources, and adaptation.', 'The proposal says disability inclusion is important.', 'The team asks for diagnoses without a clear purpose.']),
    insight: ['Disability marker readiness means the project can show how accessibility and inclusion are designed, monitored, and improved.'],
    cta: 'Continue to safe disability data',
    nextId: 'M5-S1-09C',
  }),
  'M5-S1-09C': baseConfig({
    id: 'M5-S1-09C',
    title: 'Disability Data Is Not Diagnosis',
    block: 'Safety Note + Decision Tree',
    storyTitle: 'Purpose matters',
    story: ['The team should not collect disability-related data as if it were medical diagnosis. The purpose is accessibility, participation, reasonable accommodation, safe feedback, and adaptation.'],
    revealTitle: 'Decision tree checks',
    revealItems: [
      ['Why collect it?', 'Is the purpose clear, necessary, and connected to access or inclusion action?'],
      ['What is the minimum?', 'Can the team collect less sensitive information and still make the needed adjustment?'],
      ['Who can access it?', 'Is sensitive data protected, limited, and not exposed in public reports?'],
      ['How will it be used?', 'Will the evidence lead to accommodation, barrier removal, response, or learning?'],
    ],
    activityTitle: 'Choose safe disability data practice',
    activityPrompt: 'Which practice fits HRBA MEAL?',
    options: makeOptions(['Ask about access needs and barriers for accommodation and adaptation, protect sensitive details, and avoid unnecessary diagnosis.', 'Ask everyone for medical diagnoses.', 'Publish disability details to show transparency.']),
    insight: ['Disability-related data should support accessibility and inclusion, not label or expose people.'],
    cta: 'Continue to disability data practice',
    nextId: 'M5-S1-09D',
  }),
  'M5-S1-09D': baseConfig({
    id: 'M5-S1-09D',
    title: 'Practice: Choose Safe Disability Data Options',
    block: 'Scenario Decision + Feedback Panel',
    storyTitle: 'Data choices affect dignity and action',
    story: ['The team must decide what disability-related information to collect, revise, avoid, or report in different MEAL situations.'],
    revealTitle: 'Safe disability data options',
    revealItems: [
      ['Collect access needs', 'Ask what support or adjustments are needed to participate.'],
      ['Track barriers and responses', 'Document barriers identified and actions taken.'],
      ['Avoid diagnosis details', 'Do not collect medical diagnosis when the purpose is participation support.'],
      ['Report safely', 'Use aggregate, non-identifying language unless individual consent and safety are clear.'],
    ],
    activityTitle: 'Choose the safest option',
    activityPrompt: 'The venue has accessibility complaints. What should the team collect and report?',
    options: makeOptions(['Collect access barrier themes, needed adjustments, response actions, and aggregate non-identifying updates.', 'Collect names, diagnoses, and exact homes of participants.', 'Report no disability information at all.']),
    insight: ['Safe disability data is useful because it leads to access improvements without unnecessary exposure.'],
    cta: 'Continue to feedback evidence',
    nextId: 'M5-S1-10',
  }),
  'M5-S1-10': baseConfig({
    id: 'M5-S1-10',
    title: 'Feedback Data Is Evidence Too',
    block: 'Feedback-to-Learning Loop',
    storyTitle: 'Feedback is not only a box',
    story: ['The report says one feedback box was installed, but that does not show whether feedback was accessible, trusted, analyzed, answered, reported back, or used for learning.'],
    revealTitle: 'Feedback-to-learning loop',
    revealItems: [
      ['Receive', 'Make channels accessible, safe, and known.'],
      ['Analyze', 'Look for themes, barriers, risks, and who may be missing.'],
      ['Respond', 'Decide what action, referral, clarification, or adaptation is needed.'],
      ['Report back', 'Tell communities what was heard and what will happen next.'],
      ['Learn', 'Use the feedback to improve activities, indicators, and reporting.'],
    ],
    activityTitle: 'Choose the accountable response',
    activityPrompt: 'What should happen after feedback themes are reviewed?',
    options: makeOptions(['Act on feasible issues, refer sensitive concerns safely, and report back to communities on what was heard and done.', 'Count the number of comments only.', 'Keep feedback internal and never respond.']),
    insight: ['Feedback data becomes HRBA MEAL evidence when it informs response, accountability, and adaptation.'],
    cta: 'Continue to feedback decision practice',
    nextId: 'M5-S1-11',
  }),
  'M5-S1-11': baseConfig({
    id: 'M5-S1-11',
    title: 'Practice: Turn Feedback into an Action Decision',
    block: 'Synthetic Feedback Dashboard',
    storyTitle: 'The dashboard shows patterns',
    story: ['Feedback themes include difficult session timing, unclear referral steps, written forms that are hard to use, discomfort speaking with leaders present, venue access difficulty, and one private safety concern.'],
    revealTitle: 'Dashboard signals',
    revealItems: [
      ['Timing barrier', 'Repeated comments about timing suggest an access issue, not only preference.'],
      ['Referral confusion', 'Unclear steps mean information quality may be weak.'],
      ['Form difficulty', 'A written-only channel may exclude people with literacy, language, or disability barriers.'],
      ['Power and safety', 'Discomfort speaking with leaders present points to voice and protection concerns.'],
      ['Venue access', 'Access issues require practical adjustment.'],
      ['Private safety concern', 'This needs careful, confidential handling and referral pathways.'],
    ],
    activityTitle: 'Choose the action decision',
    activityPrompt: 'Which response best uses the feedback responsibly?',
    options: makeOptions(['Adjust session timing and venue, add verbal and accessible feedback options, clarify referral steps, handle safety concerns confidentially, and report back.', 'Mention the feedback box in the report and continue as planned.', 'Ignore feedback that creates extra work.']),
    insight: ['Responsible MEAL turns feedback themes into decisions, action, and report-back.'],
    cta: 'Continue to ethical storytelling',
    nextId: 'M5-S1-12',
  }),
  'M5-S1-12': baseConfig({
    id: 'M5-S1-12',
    title: 'Ethical Storytelling and Qualitative Evidence',
    block: 'Case Study + Safety Checklist',
    storyTitle: 'Stories are evidence, but they can create risk',
    story: ['The team has 20 story notes. A story can help explain change, but it must be collected and shared with dignity, consent, accuracy, and safety.'],
    revealTitle: 'Ethical storytelling checklist',
    revealItems: [
      ['Consent', 'The person understands how the story may be used and can refuse without losing support.'],
      ['Minimum detail', 'Only use details necessary for learning and reporting.'],
      ['Anonymization', 'Remove names, exact locations, and identifying combinations unless safe consent is explicit.'],
      ['Dignity', 'Avoid pity, sensationalism, or claims the evidence cannot support.'],
      ['Verification', 'Do not overstate what the project caused.'],
    ],
    activityTitle: 'Choose the safer story practice',
    activityPrompt: 'Which approach protects dignity and usefulness?',
    options: makeOptions(['Use anonymized, consented, non-identifying story themes and avoid unsupported “changed her life” claims.', 'Publish full names and photos to make the report powerful.', 'Use the story without checking consent because it is positive.']),
    insight: ['Qualitative evidence is strongest when it is respectful, safe, accurate, and connected to learning.'],
    cta: 'Continue to donor story request',
    nextId: 'M5-S1-13',
  }),
  'M5-S1-13': baseConfig({
    id: 'M5-S1-13',
    title: 'Practice: Respond to a Risky Donor Story Request',
    block: 'Branching Scenario / Donor Inbox Simulator',
    storyTitle: 'A risky request arrives',
    story: ['A donor or communications colleague asks for a named story, photo, exact location, and a strong transformation claim for a public update. The team needs a professional response that protects people and still offers useful evidence.'],
    revealTitle: 'What makes the request risky?',
    revealItems: [
      ['Identification risk', 'Name, photo, exact location, and sensitive details can identify someone.'],
      ['Consent risk', 'Consent must be informed, voluntary, and specific to use.'],
      ['Unsupported claim risk', 'A transformation claim may overstate what the evidence shows.'],
      ['Alternative evidence', 'Aggregated themes, anonymized quotes, and safe composite learning can still communicate value.'],
    ],
    activityTitle: 'Choose the professional response',
    activityPrompt: 'How should the team respond?',
    options: makeOptions(['Explain the safety concern, decline identifying details, and offer anonymized themes, consented non-identifying quotes, and evidence-backed claims.', 'Send the full story because the donor asked.', 'Say no without offering any safer alternative.']),
    insight: ['A strong response protects people while still helping partners understand evidence and learning.'],
    cta: 'Continue to evidence signals',
    nextId: 'M5-S1-14',
  }),
  'M5-S1-14': baseConfig({
    id: 'M5-S1-14',
    title: 'Reading the Signals: When Evidence Says the Plan Should Change',
    block: 'Chart + Evidence Signal Triage',
    storyTitle: 'Mixed signals are normal',
    story: ['Attendance is high overall, but remote attendance drops, feedback mentions timing and venue barriers, and some groups speak less in mixed meetings.'],
    revealTitle: 'Evidence signal triage',
    revealItems: [
      ['Green signal', 'Planned activities are happening and reach is visible.'],
      ['Amber signal', 'Some groups participate less or face barriers that need adjustment.'],
      ['Red signal', 'Safety concerns, exclusion, or unanswered feedback require prompt action.'],
      ['Learning signal', 'Evidence should lead to practical adaptation, not only explanation.'],
    ],
    activityTitle: 'Choose the adaptation judgment',
    activityPrompt: 'What does HRBA MEAL do with mixed evidence?',
    options: makeOptions(['Keep what works, adjust barriers, respond to safety and feedback issues, and explain the adaptation honestly.', 'Judge only by activity completion.', 'Hide weak signals so the report stays positive.']),
    insight: ['HRBA MEAL treats evidence as signals for learning and adaptation, not only proof of completion.'],
    cta: 'Continue to adaptation practice',
    nextId: 'M5-S1-15',
  }),
  'M5-S1-15': baseConfig({
    id: 'M5-S1-15',
    title: 'Practice: Adapt Based on Evidence',
    block: 'Decision Scenario',
    storyTitle: 'The evidence asks for a decision',
    story: ['The team sees barriers in timing, venue accessibility, referral clarity, feedback channels, and voice in meetings. It must decide what to adapt before claiming success.'],
    revealTitle: 'Adaptation options',
    revealItems: [
      ['Timing', 'Try alternative session times and check whether attendance patterns improve.'],
      ['Venue access', 'Move sessions or adjust seating, entry, signage, and support.'],
      ['Referral clarity', 'Revise messages and use formats people understand.'],
      ['Feedback channels', 'Add verbal and accessible options, then report back.'],
      ['Participation safety', 'Create spaces where youth, women, persons with disabilities, and others can speak safely.'],
    ],
    activityTitle: 'Choose the responsible adaptation package',
    activityPrompt: 'Which package best fits the evidence?',
    options: makeOptions(['Adjust timing and venues, clarify referral steps, diversify feedback channels, handle safety concerns, and consult affected groups before finalizing changes.', 'Run more of the same sessions.', 'Stop collecting feedback.']),
    insight: ['Adaptation should be evidence-based, consulted, safe, and documented.'],
    cta: 'Continue to logframe review',
    nextId: 'M5-S1-15A',
  }),
  'M5-S1-15A': baseConfig({
    id: 'M5-S1-15A',
    title: 'Light HRBA Logframe Review: Does the Evidence Match the Logic?',
    block: 'Logframe Review Tool Activity',
    storyTitle: 'The logframe guides what the team sees',
    story: ['The logframe can track activity completion, but it does not yet guide the team to collect evidence on inclusion, voice, feedback response, safety, gender, disability, and adaptation.'],
    revealTitle: 'Light logframe review checks',
    revealItems: [
      ['Outcome', 'Does the outcome describe meaningful change, not only activity completion?'],
      ['Indicators', 'Do indicators capture inclusion, participation, feedback, safety, change, and adaptation?'],
      ['Evidence sources', 'Are sources practical, safe, and sufficient?'],
      ['Assumptions and risks', 'Do assumptions include access barriers, power dynamics, and data safety?'],
      ['Gender and disability', 'Are commitments visible in indicators, activities, budget, and evidence?'],
    ],
    activityTitle: 'Choose the strongest logframe repair',
    activityPrompt: 'What should the team repair first?',
    options: makeOptions(['Align outcome, indicators, evidence sources, risks, gender/disability checks, and learning decisions with the rights problem.', 'Only update the output numbers.', 'Remove assumptions because they are hard to monitor.']),
    insight: ['A light HRBA logframe review checks whether the evidence matches the logic the project claims.'],
    cta: 'Continue to responsible reporting',
    nextId: 'M5-S1-16',
  }),
  'M5-S1-16': baseConfig({
    id: 'M5-S1-16',
    title: 'Responsible Reporting: Tell the Truth Safely',
    block: 'Report Repair / Before-After Comparison',
    storyTitle: 'The report needs honest, safe language',
    story: ['The draft says the project successfully reached vulnerable community members and improved awareness. That claim is too broad unless the evidence supports inclusion, safety, change, and adaptation.'],
    revealTitle: 'Risky reporting phrases',
    revealItems: [
      ['Successfully reached vulnerable community members', 'This overclaims if the evidence does not show who was reached, who was missed, and whether participation was meaningful.'],
      ['Improved awareness', 'This needs evidence of understanding, confidence, referral knowledge, or practice change.'],
      ['Changed lives', 'This is often too broad and unsupported by short project evidence.'],
      ['No challenges reported', 'Silence does not prove no barriers; it may mean feedback channels were inaccessible or unsafe.'],
    ],
    activityTitle: 'Repair the reporting claim',
    activityPrompt: 'Which claim is more responsible?',
    options: makeOptions(['The project completed planned sessions and reached many participants; feedback and participation evidence also showed barriers in timing, access, referral clarity, and voice, which the team began to address.', 'The project changed the lives of all vulnerable people.', 'No issues occurred because attendance was high.']),
    insight: ['Responsible reporting tells the truth safely: what happened, what evidence shows, what remains uncertain, what risks were managed, and what will adapt.'],
    cta: 'Continue to risky claims practice',
    nextId: 'M5-S1-17',
  }),
  'M5-S1-17': baseConfig({
    id: 'M5-S1-17',
    title: 'Practice: Spot Risky Reporting Claims',
    block: 'Knowledge Check / Claim Diagnosis',
    storyTitle: 'Not every positive claim is safe or supported',
    story: ['The team reviews several draft claims before submitting the report. Some are too broad, unsupported, identifying, or activity-focused.'],
    revealTitle: 'Risky claim types',
    revealItems: [
      ['Unsupported impact claim', 'Claims large change without enough evidence.'],
      ['Unsafe detail claim', 'Uses personal or identifying information that can create risk.'],
      ['Activity-only claim', 'Treats completed sessions as proof of inclusion or change.'],
      ['No-feedback claim', 'Equates low complaint numbers with satisfaction.'],
    ],
    activityTitle: 'Diagnose the risky claim',
    activityPrompt: 'Which claim is safest and most evidence-based?',
    options: makeOptions(['The evidence suggests improved reach, but also shows barriers that require response; the team will adapt timing, access, feedback, and referral communication.', 'All participants are empowered now.', 'The named participant from a small community proves the project worked.']),
    insight: ['Safer claims are specific, evidence-based, anonymized, and honest about limitations and next steps.'],
    cta: 'Continue to capstone evidence simulator',
    nextId: 'M5-S1-18',
  }),
  'M5-S1-18': {
    screenId: 'M5-S1-18',
    context: 'Module 5 · HRBA in MEAL',
    title: 'Capstone Evidence Simulator',
    lead: 'Bring the Module 5 skills together in one realistic project evidence review.',
    blockType: 'Scenario-Based Evidence Lab',
    storyTitle: 'Before we submit the report',
    story: [
      'Birhan Community Action is preparing a six-month report for its community awareness project. The project aimed to help community members understand their rights and know where to seek information or support.',
      'The team completed many planned activities, but the evidence file shows a more complex picture.',
      'Hana turns to you and says: “Before we submit the report, help us make the evidence honest, safe, and useful.”',
    ],
    startButton: 'Open the evidence file',
    revealTitle: 'Tabbed case file',
    revealIntro: 'Open each evidence tab before making your decisions.',
    revealItems: makeReveal([
      ['Activity and reach evidence', '12 awareness sessions completed; 300 participants attended; 4 meetings held; 1 feedback box installed; 20 story notes collected; 85% average attendance. Initial draft claim: “The project successfully reached vulnerable community members and improved awareness.”'],
      ['Inclusion and participation evidence', 'Attendance declined among participants from remote areas. Women with care responsibilities attended less often in afternoon sessions. Youth attended but rarely spoke during mixed meetings. Participants asked more questions when local leaders were not present.'],
      ['Feedback evidence', 'Feedback themes include difficult timing, unclear referral steps, difficult written forms, discomfort speaking with leaders present, venue access difficulty, and one private safety concern. The team has not yet reported back.'],
      ['Gender and disability evidence', 'Women and men were counted, but gender barriers were not part of the original indicators. Disability access barriers were not tracked consistently. One session moved to a ground-floor room after feedback.'],
      ['Story and data safety evidence', 'One draft story includes name, exact small community, age, displacement status, disability-related detail, a quote about fear, a photo, and an unsupported claim that the project “changed her life.”'],
    ]),
    activityTitle: 'Decision 1: What is missing from the evidence?',
    activityPrompt: 'Select the evidence gaps that should be addressed before the team makes strong claims.',
    activityMode: 'multi',
    options: [
      'Whether participants understood where to seek information or support',
      'Who may have been missed or excluded',
      'Whether community input influenced decisions',
      'Whether feedback was reviewed, acted on, and reported back',
      'Whether gender-related barriers affected access, voice, or benefit',
      'Whether disability access barriers were identified and adjusted',
      'Whether stories were collected and reported safely',
      'Whether adaptations were made based on evidence',
      'Whether the report has enough photos',
      'Whether the feedback box was visible enough in the photo',
    ].map((label, index) => ({
      id: `capstone-${index + 1}`,
      label,
      body: index < 8
        ? 'This is a key HRBA MEAL evidence gap that should shape the final report and adaptation decisions.'
        : 'This may be an administrative or communications detail, but it is not the core HRBA evidence gap.',
      correct: index < 8,
    })),
    feedbackStrong: 'Strong evidence review. The report has useful activity and reach evidence, but the team still needs evidence about understanding, inclusion, participation influence, feedback response, gender and disability barriers, safe stories, and adaptation.',
    feedbackSupport: 'Look again. The strongest choices focus on evidence gaps that affect inclusion, accountability, safety, change, and adaptation.',
    insightTitle: 'Capstone synthesis',
    insight: [
      'A responsible HRBA MEAL decision reviews evidence gaps, unsafe details, feedback requiring action, needed adaptations, and the final reporting claim before submission.',
      'The strongest report is honest, safe, specific, and useful for learning.',
    ],
    ctaButton: 'Continue to Module 5 synthesis',
    nextId: 'M5-S1-19',
  },
  'M5-S1-19': baseConfig({
    id: 'M5-S1-19',
    title: 'Module 5 Synthesis: What HRBA MEAL Adds',
    block: 'Summary Cards / Concept Map',
    storyTitle: 'From numbers to rights-aware learning',
    story: ['Module 5 has moved from output reporting toward evidence that supports inclusion, accountability, safety, change, and adaptation.'],
    revealTitle: 'What HRBA MEAL adds',
    revealItems: hrbaMealLens,
    activityTitle: 'Choose the synthesis statement',
    activityPrompt: 'Which sentence best captures Module 5?',
    options: makeOptions(['Numbers matter, but HRBA MEAL asks what the numbers show and hide, and what the team should adapt.', 'MEAL is only for donor reporting.', 'Stories are always better than numbers.']),
    insight: ['HRBA MEAL strengthens evidence so CSOs can learn with rights-holders and report responsibly.'],
    cta: 'Continue to portfolio checkpoint',
    nextId: 'M5-S1-20',
  }),
  'M5-S1-20': baseConfig({
    id: 'M5-S1-20',
    title: 'Portfolio Checkpoint: HRBA MEAL Improvement Plan',
    block: 'Tool Activity / Portfolio Output',
    storyTitle: 'Turn learning into an improvement plan',
    story: ['The learner now identifies one practical MEAL improvement to take back to their organization.'],
    revealTitle: 'Improvement plan prompts',
    revealItems: [
      ['Evidence gap', 'What important HRBA evidence is currently missing or weak?'],
      ['Indicator repair', 'Which indicator or evidence source needs strengthening?'],
      ['Feedback response', 'How will feedback be analyzed, answered, and reported back?'],
      ['Safety check', 'What data or story detail should be protected?'],
      ['Adaptation habit', 'How will the team use evidence to change practice?'],
    ],
    activityTitle: 'Choose a first improvement',
    activityPrompt: 'Which first step is practical and rights-aware?',
    options: makeOptions(['Repair one indicator and add one safer feedback-response routine for the next reporting cycle.', 'Rewrite every tool immediately without consultation.', 'Collect more personal detail to make the report stronger.']),
    insight: ['A small practical improvement can shift MEAL from counting activities toward learning and accountability.'],
    cta: 'Continue to portfolio synthesis',
    nextId: 'M5-S1-21',
  }),
  'M5-S1-21': baseConfig({
    id: 'M5-S1-21',
    title: 'Final Course Portfolio Synthesis',
    block: 'Portfolio Review Checklist',
    storyTitle: 'Connect the full HRBA practice portfolio',
    story: ['Module 5 outputs now connect with the full Modules 1-5 HRBA practice portfolio.'],
    revealTitle: 'Portfolio review checklist',
    revealItems: [
      ['Rights issue', 'Can you describe the rights issue behind the service or project problem?'],
      ['Design logic', 'Can you explain how activities respond to barriers, actors, risks, and evidence needs?'],
      ['MEAL evidence', 'Can you show evidence on inclusion, feedback, safety, change, and adaptation?'],
      ['Responsible reporting', 'Can you tell the truth safely and avoid unsupported claims?'],
    ],
    activityTitle: 'Choose the strongest portfolio habit',
    activityPrompt: 'What should the learner carry forward?',
    options: makeOptions(['Use the portfolio as a living practice tool: review, update, adapt, and discuss safely with the team.', 'Treat the portfolio as a one-time course assignment.', 'Use it to collect sensitive personal complaints.']),
    insight: ['The course portfolio is strongest when it helps a team make better, safer, more accountable decisions.'],
    cta: 'Continue to 90-day action plan',
    nextId: 'M5-S1-22',
  }),
  'M5-S1-22': baseConfig({
    id: 'M5-S1-22',
    title: '90-Day HRBA MEAL Action Plan',
    block: 'Action Commitment / Reflection',
    storyTitle: 'A short plan for practice',
    story: ['The learner commits to one concrete HRBA MEAL action that can be started in the next 90 days.'],
    revealTitle: '90-day action plan areas',
    revealItems: [
      ['Review one report', 'Check what activity numbers show and what they hide.'],
      ['Repair one indicator', 'Add inclusion, feedback, safety, or change evidence.'],
      ['Improve feedback response', 'Clarify analysis, action, and report-back.'],
      ['Strengthen safe story use', 'Review consent, anonymization, and claim accuracy.'],
    ],
    activityTitle: 'Choose a realistic action',
    activityPrompt: 'Which action is strongest for a 90-day commitment?',
    options: makeOptions(['Choose one report or indicator, review it with the HRBA MEAL lens, and agree one practical adaptation with colleagues.', 'Promise to redesign the entire MEAL system next week.', 'Wait until the next donor deadline.']),
    insight: ['A realistic action plan is specific, safe, owned by the team, and possible within normal work.'],
    cta: 'Continue to resource pack',
    nextId: 'M5-S1-23',
  }),
  'M5-S1-23': baseConfig({
    id: 'M5-S1-23',
    title: 'Module 5 Resource Pack',
    block: 'Resource and Download Blocks',
    storyTitle: 'Tools to keep using',
    story: ['This resource screen gathers the practical Module 5 tools for continued use.'],
    revealTitle: 'Resource pack items',
    revealItems: [
      ['HRBA MEAL lens checklist', 'Questions on inclusion, participation, feedback, gender, disability, safety, change, and adaptation.'],
      ['Indicator repair prompts', 'Prompts for strengthening weak output indicators.'],
      ['Safe disaggregation guide', 'A quick check for useful, minimum, protected data.'],
      ['Responsible reporting checklist', 'A check for evidence-based, safe, honest reporting claims.'],
    ],
    activityTitle: 'Choose how to use the pack',
    activityPrompt: 'Which use is most practical?',
    options: makeOptions(['Use one tool in the next team reporting or reflection meeting.', 'Store the tools without discussing them.', 'Use the tools to collect identifying complaint details.']),
    insight: ['Resources are useful when they become part of normal team decisions.'],
    cta: 'Continue to peer exchange',
    nextId: 'M5-S1-24',
  }),
  'M5-S1-24': baseConfig({
    id: 'M5-S1-24',
    title: 'Peer Exchange and Practice Clinics',
    block: 'Peer Discussion Prompt / Assignment Link',
    storyTitle: 'Use the tools together',
    story: ['Peer exchange helps teams test MEAL judgments, but examples must remain safe, fictionalized, and non-identifying.'],
    revealTitle: 'Peer exchange prompts',
    revealItems: [
      ['One useful number', 'Share one number your organization often reports.'],
      ['One hidden question', 'Ask what that number does not show.'],
      ['One safe improvement', 'Suggest a safe evidence or indicator repair.'],
      ['One adaptation', 'Name what action could change based on the evidence.'],
    ],
    activityTitle: 'Choose the safest exchange practice',
    activityPrompt: 'Which peer exchange approach fits the course safeguards?',
    options: makeOptions(['Use fictionalized, non-identifying examples and focus on learning decisions, not sensitive personal data.', 'Share real complaints and names to make the discussion concrete.', 'Avoid peer learning altogether.']),
    insight: ['Peer practice is strongest when it is practical, respectful, and safe.'],
    cta: 'Continue to final completion bridge',
    nextId: 'M5-S1-25',
  }),
  'M5-S1-25': baseConfig({
    id: 'M5-S1-25',
    title: 'Final Completion Bridge: From Course to Practice',
    block: 'Closing Scenario + CTA',
    storyTitle: 'From course screen to team practice',
    story: ['The final bridge returns to the course’s practical purpose: helping CSOs use HRBA in real decisions, not only in training screens.'],
    revealTitle: 'Carry-forward commitments',
    revealItems: [
      ['Look beyond completion', 'Ask what activity reports show and what they miss.'],
      ['Design with rights in mind', 'Connect activities to barriers, responsibilities, risks, and evidence.'],
      ['Listen and respond', 'Treat feedback as evidence and report back.'],
      ['Tell the truth safely', 'Use honest, non-identifying, evidence-based reporting.'],
    ],
    activityTitle: 'Choose the final practice commitment',
    activityPrompt: 'What is the best next step after the course?',
    options: makeOptions(['Apply one HRBA MEAL tool to a real team discussion using safe, non-identifying evidence.', 'Wait for perfect data before acting.', 'Use HRBA only in proposal language.']),
    insight: ['The course ends, but HRBA practice continues in everyday choices about design, implementation, evidence, feedback, and reporting.'],
    cta: 'Complete Module 5',
    nextId: 'M5-PLAYER-COMPLETE',
  }),
};

function EvidenceVisual({ config }: { config: Module5ScreenConfig }) {
  return (
    <div
      className="m5-visual-card"
      role="img"
      aria-label="Illustrated MEAL workspace with report cards, evidence signals, feedback notes, and adaptation decisions."
    >
      <div className="m5-visual-card__screen">
        <span>Report</span>
        <span>Feedback</span>
        <span>Evidence</span>
      </div>
      <div className="m5-visual-card__signals">
        <span>{config.blockType}</span>
        <span>Inclusion</span>
        <span>Safety</span>
        <span>Adaptation</span>
      </div>
    </div>
  );
}

function Module5IntroVideoScreen({ onChangeState }: Module5RendererProps) {
  return (
    <main className="m5-screen m5-intro-video-screen" aria-labelledby="m5-intro-video-title">
      <section className="m5-video-shell">
        <div className="m5-video-copy">
          <ModuleContextLabel>MODULE 5 · APPLYING HRBA IN MEAL</ModuleContextLabel>
          <ScreenTitle
            id="m5-intro-video-title"
            lead="Watch this short introduction to see how Module 5 will help you move from counting activities to using evidence, indicators, feedback, safe data, learning, and reporting in a rights-based way."
          >
            Before you begin
          </ScreenTitle>
          <article className="m5-video-note" aria-label="Module 5 focus">
            <span aria-hidden="true">MEAL</span>
            <p>
              From good numbers to rights-based learning: evidence should help teams see inclusion,
              feedback, safety, change, and adaptation.
            </p>
          </article>
        </div>

        <section className="m5-video-card" aria-labelledby="m5-video-placeholder-label">
          <div className="m5-video-card__header">
            <p className="m5-card-kicker" id="m5-video-placeholder-label">Intro video placeholder</p>
            <span>16:9</span>
          </div>
          <div className="m5-video-frame">
            {module5IntroVideoUrl ? (
              <iframe
                src={module5IntroVideoUrl}
                title="Module 5 intro video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="m5-video-placeholder">
                <span aria-hidden="true">▶</span>
                <p>Video will appear here when a URL is added.</p>
              </div>
            )}
          </div>
          <article className="m5-transcript-placeholder">
            <p className="m5-card-kicker">Transcript</p>
            <p>Transcript will be added here.</p>
          </article>
        </section>

        <footer className="m5-video-actions">
          <PrimaryButton
            onClick={() =>
              completeSimpleScreen(
                'M5-S1-01',
                'M5-S1-02',
                module5Routes['M5-S1-02'],
                onChangeState,
                'module5IntroVideo',
                { videoUrlConfigured: Boolean(module5IntroVideoUrl) },
              )
            }
          >
            Continue to learning objectives
          </PrimaryButton>
        </footer>
      </section>
    </main>
  );
}

function Module5LearningObjectivesScreen({ onChangeState }: Module5RendererProps) {
  const [flippedCards, setFlippedCards] = useState<string[]>([]);

  const toggleCard = (number: string) => {
    setFlippedCards((prev) =>
      prev.includes(number) ? prev.filter((item) => item !== number) : [...prev, number],
    );
  };

  return (
    <main className="m5-screen m5-objectives-screen" aria-labelledby="m5-objectives-title">
      <section className="m5-objectives-shell">
        <section className="m5-objectives-copy">
          <ModuleContextLabel>MODULE 5 · APPLYING HRBA IN MEAL</ModuleContextLabel>
          <div className="m5-objectives-title">
            <h1 id="m5-objectives-title">Learning Objectives</h1>
            <p>What you will be able to do</p>
          </div>
          <p className="m5-objectives-orientation">
            In this module, you will practice how to use MEAL to see whether rights-based practice is actually happening. You will look beyond activity numbers to examine who benefited, who may be missing, what changed, what feedback shows, and how evidence can guide safer adaptation and reporting.
          </p>
          <article className="m5-objectives-lens" aria-label="Module 5 visual accent">
            <span aria-hidden="true">↗</span>
            <div>
              <h2>Evidence for learning</h2>
              <p>Use indicators, feedback, data, stories, and reports to support safer decisions.</p>
            </div>
          </article>
          <article className="m5-objectives-closing">
            <p>
              HRBA in MEAL means asking what the evidence really shows: who was reached, who was missed, what changed, what risks appeared, and what the CSO should learn or adjust.
            </p>
          </article>
        </section>

        <section className="m5-objective-grid" aria-label="Module 5 learning objectives">
          {module5ObjectiveCards.map((objective) => (
            <button
              key={objective.number}
              type="button"
              className={`m5-objective-card m5-objective-card--${objective.accent} ${flippedCards.includes(objective.number) ? 'is-flipped' : ''}`}
              onClick={() => toggleCard(objective.number)}
              aria-pressed={flippedCards.includes(objective.number)}
              aria-label={`${objective.title}. ${flippedCards.includes(objective.number) ? 'Showing details. Activate to return to the headline.' : 'Activate to show details.'}`}
            >
              <div className="m5-objective-card__inner">
                <div className="m5-objective-card__face m5-objective-card__front">
                  <span>{objective.number}</span>
                  <h2>{objective.title}</h2>
                  <small>Click to reveal</small>
                </div>
                <div className="m5-objective-card__face m5-objective-card__back">
                  <span>{objective.number}</span>
                  <p>{objective.text}</p>
                  <small>Click to return</small>
                </div>
              </div>
            </button>
          ))}
        </section>

        <footer className="m5-objectives-actions">
          <PrimaryButton
            onClick={() =>
              completeSimpleScreen(
                'M5-S1-02',
                'M5-S1-03',
                module5Routes['M5-S1-03'],
                onChangeState,
                'module5LearningObjectives',
                { reviewed: true },
              )
            }
          >
            Continue
          </PrimaryButton>
        </footer>
      </section>
    </main>
  );
}

function Module5CanvasScreen({
  config,
  state,
  onChangeState,
}: {
  config: Module5ScreenConfig;
  state: LearningState;
  onChangeState: Module5RendererProps['onChangeState'];
}) {
  const key = practiceKey(config.screenId);
  const stored = state.practiceCheckState[key] || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes(config.screenId);
  const allRevealIds = config.revealItems.map((item) => item.id);
  const [started, setStarted] = useState(Boolean(stored.started || completed));
  const [activePanel, setActivePanel] = useState<'reveal' | 'practice' | 'insight'>(
    stored.activePanel || 'reveal',
  );
  const [openedIds, setOpenedIds] = useState<string[]>(
    completed ? allRevealIds : stored.openedIds || [],
  );
  const [activeRevealId, setActiveRevealId] = useState<string>(
    stored.activeRevealId || config.revealItems[0]?.id || '',
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(stored.selectedIds || []);
  const [submitted, setSubmitted] = useState(Boolean(stored.submitted || completed));
  const isLensScreen = config.screenId === 'M5-S1-03';
  const screenThemeClass = polishedLabScreenThemes[config.screenId] || '';
  const isPolishedLabScreen = Boolean(screenThemeClass);

  const activeReveal = config.revealItems.find((item) => item.id === activeRevealId) || config.revealItems[0];
  const openedCount = openedIds.length;
  const selectedCorrect = selectedIds.filter((id) => config.options.find((option) => option.id === id)?.correct).length;
  const incorrectSelected = selectedIds.some((id) => !config.options.find((option) => option.id === id)?.correct);
  const correctTotal = config.options.filter((option) => option.correct).length;
  const strongAnswer = config.activityMode === 'multi'
    ? selectedCorrect === correctTotal && !incorrectSelected
    : Boolean(config.options.find((option) => option.id === selectedIds[0])?.correct);
  const canSubmit = openedCount === allRevealIds.length && selectedIds.length > 0;
  const canContinue = completed || (openedCount === allRevealIds.length && submitted);
  const submitButtonLabel = openedCount < allRevealIds.length
    ? 'Open all evidence cards first'
    : selectedIds.length === 0
      ? 'Choose a response first'
      : 'Check my judgment';

  const persist = (value: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, key, value),
    }));
  };

  const start = () => {
    setStarted(true);
    persist({ started: true, activePanel: 'reveal' });
  };

  const openReveal = (id: string) => {
    setActiveRevealId(id);
    const next = openedIds.includes(id) ? openedIds : [...openedIds, id];
    setOpenedIds(next);
    persist({ openedIds: next, activeRevealId: id, started: true, activePanel: 'reveal' });
  };

  const selectOption = (id: string) => {
    const next = config.activityMode === 'multi'
      ? selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id]
      : [id];
    setSelectedIds(next);
    setSubmitted(false);
    onChangeState((prev) => {
      const progress = new Set(prev.screenProgress[MODULE_ID] || []);
      progress.delete(config.screenId);

      return {
        ...prev,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(progress),
        },
        practiceCheckState: updatePracticeState(prev, key, {
          selectedIds: next,
          submitted: false,
          activePanel: 'practice',
          status: 'in_progress',
        }),
      };
    });
  };

  const submit = () => {
    setSubmitted(true);
    setActivePanel('insight');
    onChangeState((prev) => {
      const progress = new Set(prev.screenProgress[MODULE_ID] || []);
      progress.add(config.screenId);

      return {
        ...prev,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(progress),
        },
        practiceCheckState: updatePracticeState(prev, key, {
          started: true,
          openedIds,
          activeRevealId,
          selectedIds,
          submitted: true,
          activePanel: 'insight',
          status: 'completed',
        }),
      };
    });
  };

  const finish = () => {
    const nextRoute = module5Routes[config.nextId] || '/module-5/complete';
    onChangeState((prev) => {
      const progress = new Set(prev.screenProgress[MODULE_ID] || []);
      progress.add(config.screenId);
      if (config.nextId === 'M5-PLAYER-COMPLETE') {
        progress.add('M5-PLAYER-COMPLETE');
      }

      return {
        ...prev,
        currentScreenId: config.nextId,
        completedModules:
          config.nextId === 'M5-PLAYER-COMPLETE' && !prev.completedModules.includes(MODULE_ID)
            ? [...prev.completedModules, MODULE_ID]
            : prev.completedModules,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(progress),
        },
        practiceCheckState: updatePracticeState(prev, key, {
          started: true,
          openedIds: allRevealIds,
          activeRevealId,
          selectedIds,
          submitted: true,
          activePanel: 'insight',
          status: 'completed',
        }),
      };
    });
    setRoute(nextRoute);
  };

  return (
    <main className={['m5-screen', isLensScreen ? 'm5-screen--meal-lens' : '', isPolishedLabScreen ? 'm5-screen--polished-lab' : '', screenThemeClass].filter(Boolean).join(' ')} aria-labelledby={`${config.screenId}-title`}>
      <section className="m5-hero-panel">
        <div className="m5-hero-panel__copy">
          <ModuleContextLabel>{config.context}</ModuleContextLabel>
          <ScreenTitle id={`${config.screenId}-title`} lead={config.lead}>
            {config.title}
          </ScreenTitle>
          <article className="m5-story-card">
            <p className="m5-card-kicker">Fictional CSO case</p>
            <h2>{config.storyTitle}</h2>
            {config.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {!started && (
              <PrimaryButton onClick={start}>
                {isLensScreen ? 'Explore six questions the lens keeps visible' : config.startButton}
              </PrimaryButton>
            )}
          </article>
        </div>
        <EvidenceVisual config={config} />
      </section>

      {started && (
        <section className="m5-canvas" aria-labelledby={`${config.screenId}-canvas`}>
          <div className="m5-canvas__header">
            <div>
              <p className="m5-card-kicker">{isLensScreen ? 'HRBA MEAL lens practice' : 'Practice canvas'}</p>
              <h2 id={`${config.screenId}-canvas`}>{activePanel === 'practice' ? config.activityTitle : activePanel === 'insight' ? config.insightTitle : config.revealTitle}</h2>
              <p>{activePanel === 'practice' ? config.activityPrompt : activePanel === 'insight' ? 'Review the insight, then continue when ready.' : config.revealIntro}</p>
            </div>
            <ProgressChip>{openedCount} of {allRevealIds.length} evidence cards opened</ProgressChip>
          </div>

          <div className="m5-tabs" role="tablist" aria-label="Module 5 screen steps">
            {[
              ['reveal', 'Explore evidence'],
              ['practice', 'Make judgment'],
              ['insight', 'Insight'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activePanel === id}
                className={[
                  activePanel === id ? 'is-active' : '',
                  id === 'reveal' && openedCount === allRevealIds.length ? 'is-complete' : '',
                  id === 'practice' && submitted ? 'is-complete' : '',
                  id === 'insight' && canContinue ? 'is-complete' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => {
                  setActivePanel(id as 'reveal' | 'practice' | 'insight');
                  persist({ activePanel: id });
                }}
              >
                {(isLensScreen || isPolishedLabScreen) && (
                  <span aria-hidden="true">
                    {id === 'reveal' ? '◈' : id === 'practice' ? '✓' : '→'}
                  </span>
                )}
                {label}
              </button>
            ))}
          </div>

          {activePanel === 'reveal' && (
            <div className="m5-workspace">
              <div className="m5-reveal-grid">
                {config.revealItems.map((item, index) => {
                  const opened = openedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`m5-reveal-card ${opened ? 'is-opened' : ''}`}
                      onClick={() => openReveal(item.id)}
                      aria-pressed={opened}
                    >
                      <span className="m5-reveal-card__mark" aria-hidden="true">
                        {opened ? '✓' : index + 1}
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        {item.tag && <small>{item.tag}</small>}
                      </span>
                    </button>
                  );
                })}
              </div>
              <article className="m5-detail-card" aria-live="polite">
                <p className="m5-card-kicker">Evidence note</p>
                <h3>{activeReveal.title}</h3>
                <p>{activeReveal.body}</p>
              </article>
            </div>
          )}

          {activePanel === 'practice' && (
            <div className="m5-practice-panel">
              <div className="m5-choice-grid">
                {config.options.map((option) => {
                  const selected = selectedIds.includes(option.id);
                  return (
                    <label key={option.id} className={`m5-choice-card ${selected ? 'is-selected' : ''}`}>
                      <input
                        type={config.activityMode === 'multi' ? 'checkbox' : 'radio'}
                        name={`${config.screenId}-choice`}
                        checked={selected}
                        onChange={() => selectOption(option.id)}
                      />
                      <span className="m5-choice-card__mark" aria-hidden="true">{selected ? '✓' : option.id.replace(/[^0-9]+/g, '') || '•'}</span>
                      <span>
                        <strong>{option.label}</strong>
                        <small>{option.body}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="m5-practice-actions">
                <PrimaryButton onClick={submit} disabled={!canSubmit}>
                  {submitButtonLabel}
                </PrimaryButton>
              </div>
            </div>
          )}

          {activePanel === 'insight' && (
            <div className="m5-insight-panel">
              {submitted && (
                <article className={`m5-feedback-card ${strongAnswer ? 'is-strong' : 'is-support'}`} aria-live="polite">
                  <p className="m5-card-kicker">{strongAnswer ? 'Strong judgment' : 'Keep looking deeper'}</p>
                  <h3>{strongAnswer ? 'This is the HRBA MEAL move.' : 'A useful start.'}</h3>
                  <p>{strongAnswer ? config.feedbackStrong : config.feedbackSupport}</p>
                </article>
              )}
              <article className="m5-insight-card">
                <p className="m5-card-kicker">Key learning</p>
                <h3>{config.insightTitle}</h3>
                {config.insight.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
              <div className="m5-cta-panel">
                <div>
                  <h3>{canContinue ? 'Ready to continue' : 'Complete this canvas to continue'}</h3>
                  <p>
                    {canContinue
                      ? 'This screen will be marked complete when you continue.'
                      : 'Open every evidence card and complete the judgment first.'}
                  </p>
                </div>
                <PrimaryButton onClick={finish} disabled={!canContinue}>
                  {canContinue ? config.ctaButton : 'Complete this canvas to continue'}
                </PrimaryButton>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function Module5CompleteScreen({ onChangeState }: { onChangeState: Module5RendererProps['onChangeState'] }) {
  return (
    <main className="m5-screen m5-screen--complete" aria-labelledby="m5-complete-title">
      <section className="m5-hero-panel">
        <div className="m5-hero-panel__copy">
          <ModuleContextLabel>Module 5 · HRBA in MEAL</ModuleContextLabel>
          <ScreenTitle
            id="m5-complete-title"
            lead="You have completed the HRBA in Monitoring, Evaluation, Accountability and Learning pathway."
          >
            Module 5 Complete
          </ScreenTitle>
          <article className="m5-insight-card m5-insight-card--dark">
            <p className="m5-card-kicker">Course-to-practice bridge</p>
            <h2>Use evidence to learn safely and respond well</h2>
            <p>
              You have practiced looking beyond activity numbers, repairing indicators, using gender-sensitive
              and disability-inclusive evidence, choosing safer data, responding to feedback, adapting based on
              signals, and reporting truthfully.
            </p>
          </article>
          <PrimaryButton
            onClick={() =>
              onChangeState((prev) => ({
                ...prev,
                currentLayer: 'platform',
                currentSubState: null,
                activeModal: null,
              }))
            }
          >
            Return to course page
          </PrimaryButton>
        </div>
        <EvidenceVisual config={{
          ...module5Screens['M5-S1-25'],
          blockType: 'Module completion',
        }} />
      </section>
    </main>
  );
}

export default function Module5Renderer(props: Module5RendererProps) {
  if (props.screenId === 'M5-PLAYER-COMPLETE') {
    return <Module5CompleteScreen onChangeState={props.onChangeState} />;
  }

  if (props.screenId === 'M5-S1-01') {
    return <Module5IntroVideoScreen {...props} />;
  }

  if (props.screenId === 'M5-S1-02') {
    return <Module5LearningObjectivesScreen {...props} />;
  }

  const config = module5Screens[props.screenId];
  if (!config) {
    return (
      <main className="m5-screen" aria-labelledby="m5-placeholder-title">
        <section className="m5-canvas">
          <ModuleContextLabel>Module 5 · HRBA in MEAL</ModuleContextLabel>
          <h1 id="m5-placeholder-title">Module 5 screen coming soon</h1>
          <p>This Module 5 screen has not been configured yet.</p>
        </section>
      </main>
    );
  }

  return (
    <Module5CanvasScreen
      config={config}
      state={props.state}
      onChangeState={props.onChangeState}
    />
  );
}
