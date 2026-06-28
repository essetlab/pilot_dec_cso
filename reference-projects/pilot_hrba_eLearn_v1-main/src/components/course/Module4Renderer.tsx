import { useState } from 'react';
import type { LearningState } from '../../state/learningState';

type Module4RendererProps = {
  screenId: string;
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type Module4Objective = {
  number: string;
  title: string;
  text: string;
  accent: 'blue' | 'green' | 'gold';
};

type WarningOption = {
  id: string;
  text: string;
  feedback: string;
  best: boolean;
};

type ImplementationLensPoint = {
  id: string;
  number: string;
  title: string;
  question: string;
  reveal: string;
  signal: string;
  icon: string;
};

type ParticipationCycleStep = {
  id: string;
  number: string;
  title: string;
  prompt: string;
  best: 'Still strong' | 'Needs checking' | 'Weakening';
  feedback: string;
  icon: string;
};

type InclusiveBarrierCard = {
  id: string;
  number: string;
  title: string;
  barrier: string;
  choices: {
    id: string;
    text: string;
    feedback: string;
    correct?: boolean;
  }[];
};

type FeedbackRepairCard = {
  id: string;
  number: string;
  title: string;
  brokenStep: string;
  question: string;
  choices: {
    id: string;
    text: string;
    feedback: string;
    correct?: boolean;
  }[];
};

type ActorEngagementCard = FeedbackRepairCard;
type AdaptationDecisionCard = FeedbackRepairCard & {
  stateKey: 'accessSignal' | 'careTimingSignal' | 'informationAccountabilitySignal' | 'powerCaptureSignal';
};

type PortfolioField = {
  id: 'warningSignal' | 'affectedDifferently' | 'mainBarrier' | 'safeAdjustment' | 'accountabilityDocumentation';
  number: string;
  label: string;
  prompt: string;
  options: string[];
};

type KnowledgeCheckQuestion = {
  id: string;
  number: number;
  title: string;
  scenario: string;
  question: string;
  choices: {
    id: string;
    text: string;
    feedback: string;
    correct?: boolean;
  }[];
  takeaway: string;
};

const MODULE_ID = 'module_04_implementation';

export const module4IntroVideoUrl = '';

const module4Routes: Record<string, string> = {
  'M4-S1-01': '/module-4/screen-4-1',
  'M4-S1-02': '/module-4/screen-4-2',
  'M4-S1-03': '/module-4/screen-4-3',
  'M4-S1-04': '/module-4/screen-4-4',
  'M4-S1-05': '/module-4/screen-4-5',
  'M4-S1-06': '/module-4/screen-4-6',
  'M4-S1-07': '/module-4/screen-4-7',
  'M4-S1-08': '/module-4/screen-4-8',
  'M4-S1-09': '/module-4/screen-4-9',
  'M4-S1-10': '/module-4/screen-4-10',
  'M4-S1-11': '/module-4/screen-4-11',
  'M4-S1-12': '/module-4/screen-4-12',
  'M4-S1-13': '/module-4/screen-4-13',
};

const module4Objectives: Module4Objective[] = [
  {
    number: '01',
    title: 'Notice implementation warning signs',
    text: 'Identify early signs that access, participation, trust, safety, or accountability may be weakening during delivery.',
    accent: 'blue',
  },
  {
    number: '02',
    title: 'Adjust delivery in practical ways',
    text: 'Recognize when equal invitation is not equal access and choose realistic adjustments to timing, location, language, cost, safety, or accessibility.',
    accent: 'green',
  },
  {
    number: '03',
    title: 'Keep participation alive',
    text: 'Check whether people still have information, voice, influence, and feedback opportunities after implementation begins.',
    accent: 'gold',
  },
  {
    number: '04',
    title: 'Repair weak feedback loops',
    text: 'Strengthen feedback systems so concerns are listened to, analyzed, responded to, followed up, and used for learning.',
    accent: 'blue',
  },
  {
    number: '05',
    title: 'Engage actors carefully',
    text: 'Work with duty-bearers, local leaders, service actors, and community structures without blame, capture, confusion, or taking over others’ responsibilities.',
    accent: 'green',
  },
  {
    number: '06',
    title: 'Adapt without doing harm',
    text: 'Use implementation evidence to make safe project adjustments and document them honestly without exposing people or sensitive information.',
    accent: 'gold',
  },
];

const warningSignalOptions: WarningOption[] = [
  {
    id: 'A',
    text: 'Attendance from distant villages is dropping.',
    feedback: 'This may show an access barrier linked to distance, cost, timing, transport, or safety.',
    best: true,
  },
  {
    id: 'B',
    text: 'Some people are present but not speaking.',
    feedback: 'This may show that participation is visible but not yet meaningful or safe enough.',
    best: true,
  },
  {
    id: 'C',
    text: 'The meeting space is difficult for some people to enter.',
    feedback: 'This may show a physical accessibility barrier that affects who can participate fully.',
    best: true,
  },
  {
    id: 'D',
    text: 'Participants are unclear about follow-up support decisions.',
    feedback: 'This may show a transparency and accountability gap.',
    best: true,
  },
  {
    id: 'E',
    text: 'The workplan is tight, so the team should continue without changes.',
    feedback: 'This is not a warning sign. It is a pressure that may make the team ignore warning signs.',
    best: false,
  },
  {
    id: 'F',
    text: 'The first sessions were well attended, so the project is still on track.',
    feedback: 'This is not enough evidence. Early attendance does not prove that access and participation remain strong.',
    best: false,
  },
];

const warningFollowUpCards = [
  {
    number: '1',
    title: 'Check who is being missed',
    text: 'Look at who has stopped attending, who arrives late, who stays silent, and who may not understand the process.',
  },
  {
    number: '2',
    title: 'Ask safely before deciding',
    text: 'Use safe, low-pressure ways to hear from affected participants without exposing or blaming anyone.',
  },
  {
    number: '3',
    title: 'Adjust and explain',
    text: 'Make feasible changes to timing, access, facilitation, information, or follow-up — and explain what changed and why.',
  },
];

const implementationLensPoints: ImplementationLensPoint[] = [
  {
    id: 'participation',
    number: '1',
    title: 'Participation',
    question: 'Are people still able to influence decisions during delivery?',
    reveal:
      'Participation should continue after the project starts. People need safe ways to ask questions, suggest adjustments, and understand how their input is used.',
    signal: 'Meeting attendance may look fine, but decisions may be shaped by only a few voices.',
    icon: 'Voice',
  },
  {
    id: 'access',
    number: '2',
    title: 'Access',
    question: 'Can different people realistically use the activity or service?',
    reveal:
      'Equal invitation is not always equal access. Timing, distance, cost, disability, language, workload, safety, and social barriers can affect who can participate or benefit.',
    signal: 'Some groups attend less, arrive late, leave early, or stop participating.',
    icon: 'Door',
  },
  {
    id: 'information',
    number: '3',
    title: 'Information',
    question: 'Is information clear, timely, and understandable?',
    reveal:
      'People need to know what is happening, why decisions are made, what criteria are used, what support is available, and what will happen next.',
    signal: 'People depend on informal messages, leaders, or rumors to understand the project.',
    icon: 'Info',
  },
  {
    id: 'feedback',
    number: '4',
    title: 'Feedback and response',
    question: 'Do concerns lead to analysis, response, and follow-up?',
    reveal:
      'A feedback channel is not enough. The team must review concerns, protect confidentiality, respond safely, and explain what changed or why something cannot change.',
    signal: 'Comments are collected, but people do not know whether anyone listened or acted.',
    icon: 'Loop',
  },
  {
    id: 'responsibility',
    number: '5',
    title: 'Responsibility',
    question: 'Is the right actor taking the right responsibility?',
    reveal:
      'During implementation, roles can become blurred. The CSO may support, connect, facilitate, document, or advocate, but should not silently take over responsibilities that belong to duty-bearers or service actors.',
    signal: 'The CSO is pressured to promise outcomes it cannot control.',
    icon: 'Role',
  },
  {
    id: 'fairness',
    number: '6',
    title: 'Fairness',
    question: 'Are selection, distribution, and support decisions transparent and fair?',
    reveal:
      'Implementation can create gatekeeping, favoritism, elite capture, or exclusion if criteria and verification processes are unclear.',
    signal: 'The same people control information, lists, invitations, or decisions.',
    icon: 'Fair',
  },
  {
    id: 'safety',
    number: '7',
    title: 'Safety and dignity',
    question: 'Could implementation expose people or create harm?',
    reveal:
      'Some actions can unintentionally increase risk, stigma, backlash, or unsafe visibility. The team should protect people’s dignity and avoid collecting or sharing sensitive information unnecessarily.',
    signal: 'People hesitate to speak, avoid being seen, or ask for privacy.',
    icon: 'Safe',
  },
  {
    id: 'adaptation',
    number: '8',
    title: 'Adaptation and learning',
    question: 'Is the team using evidence to adjust safely?',
    reveal:
      'HRBA implementation is adaptive. If evidence shows that people are being missed, participation is weakening, or risks are emerging, the team should adjust and document the reason honestly.',
    signal: 'Staff notice problems but continue the original plan because it was approved.',
    icon: 'Adapt',
  },
];

const participationCycleSteps: ParticipationCycleStep[] = [
  {
    id: 'information',
    number: '1',
    title: 'Information before decisions',
    prompt: 'Do people receive clear information before implementation decisions are made?',
    best: 'Needs checking',
    feedback:
      'The project started with consultation, but participants may not know how later decisions about timing, review meetings, or adjustments are being made.',
    icon: 'Inform',
  },
  {
    id: 'access',
    number: '2',
    title: 'Access to participation spaces',
    prompt: 'Can different people realistically attend and take part?',
    best: 'Weakening',
    feedback:
      'Attendance from distant areas is dropping, and timing creates barriers for some women. Participation is weakening if people cannot realistically be present.',
    icon: 'Include',
  },
  {
    id: 'voice',
    number: '3',
    title: 'Safe voice during delivery',
    prompt: 'Can people ask questions, disagree, or suggest changes safely?',
    best: 'Weakening',
    feedback:
      'If the same group speaks and quieter participants are unsure whether suggestions matter, voice may be visible for some but weak for others.',
    icon: 'Listen',
  },
  {
    id: 'influence',
    number: '4',
    title: 'Influence on adjustments',
    prompt: 'Does participant input shape implementation changes?',
    best: 'Needs checking',
    feedback:
      'The scenario shows that suggestions may be shared, but it is not clear whether they influence timing, facilitation, or follow-up decisions.',
    icon: 'Adjust',
  },
  {
    id: 'reportBack',
    number: '5',
    title: 'Report back and close the loop',
    prompt: 'Do people hear what changed, what did not change, and why?',
    best: 'Needs checking',
    feedback:
      'Participation stays meaningful when the team reports back. People should know how their input was used or why a change is not possible.',
    icon: 'Report back',
  },
];

const participationDiagnosisOptions = ['Still strong', 'Needs checking', 'Weakening'] as const;

const participationRepairActions = [
  {
    title: 'Vary participation channels',
    text: 'Use smaller groups, short check-ins, anonymous questions, or separate discussion spaces where needed.',
  },
  {
    title: 'Adjust access conditions',
    text: 'Review timing, location, transport, disability access, language, safety, and care-related barriers.',
  },
  {
    title: 'Show how input is used',
    text: 'Tell participants what changed, what cannot change, and why.',
  },
  {
    title: 'Check who remains unheard',
    text: 'Do not rely only on the loudest or most available participants.',
  },
];

const participationMicroOptions = [
  {
    id: 'A',
    text: 'Participation is completed once people are consulted during design.',
    feedback: 'Not quite. Design consultation matters, but participation can weaken once delivery decisions begin.',
  },
  {
    id: 'B',
    text: 'Participation during delivery means people continue to receive information, speak safely, influence adjustments, and hear what changed.',
    feedback: 'Correct. HRBA keeps participation alive through information, access, safe voice, influence, and response.',
    correct: true,
  },
  {
    id: 'C',
    text: 'Participation is strong if the project has a committee that meets regularly.',
    feedback: 'Incomplete. Committees can help, but they do not automatically represent all voices.',
  },
  {
    id: 'D',
    text: 'Participation should be reduced during implementation so activities stay on schedule.',
    feedback: 'Risky. Implementation pressure is real, but reducing participation may create exclusion and accountability gaps.',
  },
];

const inclusiveDeliveryBarriers: InclusiveBarrierCard[] = [
  {
    id: 'distance',
    number: '1',
    title: 'Distance and transport',
    barrier: 'Some participants from distant kebeles arrive late or miss sessions because transport is limited and costly.',
    choices: [
      { id: 'A', text: 'Replace them with participants who live closer to the training site.', feedback: 'Not best. This may make reporting easier but it turns an access barrier into exclusion.' },
      { id: 'B', text: 'Add attendance reminders through local representatives.', feedback: 'Partly useful, but insufficient. Reminders do not solve cost, distance, or timing barriers.' },
      { id: 'C', text: 'Review timing, location, transport support, or rotating delivery options with affected participants.', feedback: 'Strongest. This treats the pattern as an access issue and looks for practical adjustments with affected participants.', correct: true },
      { id: 'D', text: 'Continue as planned because everyone received the same invitation.', feedback: 'Not best. Equal invitation does not remove unequal access barriers.' },
    ],
  },
  {
    id: 'care',
    number: '2',
    title: 'Care responsibilities and timing',
    barrier: 'Some women leave early because the session time conflicts with care responsibilities and household workload.',
    choices: [
      { id: 'A', text: 'Ask them to make stronger personal commitment to the training.', feedback: 'Not best. This frames a structural time barrier as individual motivation.' },
      { id: 'B', text: 'Explore safer timing, shorter sessions, childcare-sensitive arrangements, or catch-up options.', feedback: 'Strongest. This looks for feasible delivery adjustments that make participation more realistic.', correct: true },
      { id: 'C', text: 'Ask community leaders to tell families that women should attend fully.', feedback: 'Risky. It may help in some settings, but it can also increase pressure or tension if not handled carefully.' },
      { id: 'D', text: 'Mark them as partially absent and continue the schedule.', feedback: 'Too narrow. Attendance records do not solve the underlying access barrier.' },
    ],
  },
  {
    id: 'accessibility',
    number: '3',
    title: 'Physical accessibility',
    barrier: 'A participant with a mobility impairment sits outside because the room is crowded and difficult to enter.',
    choices: [
      { id: 'A', text: 'Ask another participant to summarize the session afterward.', feedback: 'Not best. A summary is not equal participation.' },
      { id: 'B', text: 'Move the participant closer to the doorway and continue.', feedback: 'Partial. It may help immediately, but it does not fix the accessibility problem.' },
      { id: 'C', text: 'Check venue accessibility, seating layout, movement space, and reasonable adjustments before the next session.', feedback: 'Strongest. It treats accessibility as part of delivery quality, not as an individual inconvenience.', correct: true },
      { id: 'D', text: 'Record the issue for the final report because the session has already started.', feedback: 'Too late. Implementation evidence should support immediate practical correction where possible.' },
    ],
  },
  {
    id: 'language',
    number: '4',
    title: 'Language and understanding',
    barrier: 'Participants attend but do not ask questions because the training language is technical and hard to use.',
    choices: [
      { id: 'A', text: 'Keep the content technical because the topic is complex.', feedback: 'Not best. Technical accuracy matters, but information must also be understandable and usable.' },
      { id: 'B', text: 'Simplify key terms, use local examples, check understanding, and create safe ways to ask questions.', feedback: 'Strongest. This supports access to information, voice, and meaningful participation.', correct: true },
      { id: 'C', text: 'Give participants printed materials and ask them to read later.', feedback: 'Partial. Printed materials can help, but only if they are clear, accessible, and supported.' },
      { id: 'D', text: 'Ask the most confident participants to explain to others after the session.', feedback: 'Risky. Peer explanation may help, but it can reinforce unequal voice and gatekeeping.' },
    ],
  },
  {
    id: 'information-flow',
    number: '5',
    title: 'Unequal information flow',
    barrier: 'Younger participants say privately that the same people always hear about changes first.',
    choices: [
      { id: 'A', text: 'Ask the representatives to share information more widely.', feedback: 'Partly useful, but weak alone. It keeps the same gatekeeping structure without checking whether information actually reaches everyone.' },
      { id: 'B', text: 'Use multiple information channels, clarify what information must reach everyone, and check who is still missing updates.', feedback: 'Strongest. This improves transparency and access to information while checking who may still be missed.', correct: true },
      { id: 'C', text: 'Tell younger participants to ask representatives directly.', feedback: 'Not best. It puts the burden on participants who may already have less voice or confidence.' },
      { id: 'D', text: 'Avoid changing the communication system because it may create conflict.', feedback: 'Not best. Avoiding the issue allows unequal information flow to continue.' },
    ],
  },
];

const inclusiveDeliveryMicroOptions = [
  { id: 'A', text: 'If everyone receives the same invitation, the activity is inclusive.', feedback: 'Not best. Equal invitation is not the same as equal access.' },
  { id: 'B', text: 'Access barriers should be handled only if participants formally complain.', feedback: 'Not best. CSOs should actively notice barriers, not wait for formal complaints.' },
  { id: 'C', text: 'Inclusive delivery means noticing practical barriers during implementation and adjusting where feasible and safe.', feedback: 'Correct. This captures practical HRBA implementation: notice, adjust, protect, and learn.', correct: true },
  { id: 'D', text: 'The best solution is always to create a separate activity for every group.', feedback: 'Too rigid. Separate activities may sometimes help, but inclusive adjustment is often possible within the same activity.' },
];

const feedbackRepairCards: FeedbackRepairCard[] = [
  {
    id: 'review',
    number: '1',
    title: 'Feedback received but not reviewed',
    brokenStep: 'Feedback is recorded, but no one reviews patterns regularly.',
    question: 'What should the team do first?',
    choices: [
      { id: 'A', text: 'Wait until the final evaluation to analyze all feedback together.', feedback: 'Too late. Final evaluation may help learning, but it cannot repair problems while people are still affected.' },
      { id: 'B', text: 'Assign a regular review process to identify repeated concerns, urgent risks, and issues that need management action.', feedback: 'Strongest. Accountability needs a regular process for identifying patterns, risks, and follow-up responsibilities.', correct: true },
      { id: 'C', text: 'Count the number of comments and report the total to the donor.', feedback: 'Incomplete. Counting feedback shows volume, but not whether the CSO understood or responded to the issues.' },
      { id: 'D', text: 'Ask field staff to respond individually whenever they have time.', feedback: 'Unreliable. Individual effort matters, but accountability needs a clear system, not informal availability.' },
    ],
  },
  {
    id: 'selection',
    number: '2',
    title: 'Selection concerns are unclear',
    brokenStep: 'People do not understand why some participants received extra support and others did not.',
    question: 'What is the strongest repair action?',
    choices: [
      { id: 'A', text: 'Explain the selection criteria in clear language and provide a safe way to ask questions or request clarification.', feedback: 'Strongest. Clear information plus a safe clarification route strengthens transparency and accountability.', correct: true },
      { id: 'B', text: 'Tell people that the donor approved the selection list.', feedback: 'Too narrow. Donor approval does not replace clear explanation to affected people.' },
      { id: 'C', text: 'Avoid explaining the criteria because it may create conflict.', feedback: 'Risky. Avoiding explanation may increase mistrust, rumors, and perceived unfairness.' },
      { id: 'D', text: 'Ask community leaders to explain the selection informally.', feedback: 'Partial but risky. Leaders may help communicate, but relying only on them can reinforce gatekeeping or uneven information.' },
    ],
  },
  {
    id: 'safety',
    number: '3',
    title: 'Some people do not feel safe using the channel',
    brokenStep: 'Some women do not want to raise concerns through the local committee.',
    question: 'What should the team do?',
    choices: [
      { id: 'A', text: 'Ask the committee to encourage women to use the existing process.', feedback: 'Incomplete. Encouragement does not remove a safety or power barrier.' },
      { id: 'B', text: 'Create or strengthen confidential and alternative feedback routes that do not require people to go through the committee.', feedback: 'Strongest. A safe feedback system offers alternative routes and protects people who may fear exposure or pressure.', correct: true },
      { id: 'C', text: 'Stop collecting feedback on sensitive issues.', feedback: 'Too weak. Sensitive concerns need safer routing, not silence.' },
      { id: 'D', text: 'Ask women to raise the issue publicly so the team can verify it.', feedback: 'Unsafe. Public disclosure can expose people or increase harm.' },
    ],
  },
  {
    id: 'response',
    number: '4',
    title: 'Feedback receives no visible response',
    brokenStep: 'People say they gave feedback but never heard what happened afterward.',
    question: 'What is the strongest response?',
    choices: [
      { id: 'A', text: 'Share a short “you said, we did / we could not do” update through safe and accessible channels.', feedback: 'Strongest. People need to know what was heard, what changed, what could not change, and why.', correct: true },
      { id: 'B', text: 'Tell staff to reassure people privately that the CSO is listening.', feedback: 'Partial. Reassurance may help, but it does not create a visible accountability loop.' },
      { id: 'C', text: 'Keep responses internal because the project team is already busy.', feedback: 'Too weak. Internal review without response does not build trust or accountability.' },
      { id: 'D', text: 'Publish every comment exactly as received so everyone can see the feedback.', feedback: 'Unsafe. Publishing raw comments can expose people and create harm.' },
    ],
  },
  {
    id: 'adaptation',
    number: '5',
    title: 'Feedback is not used for adaptation',
    brokenStep: 'Repeated concerns are recorded, but the project plan does not change.',
    question: 'What should the team do?',
    choices: [
      { id: 'A', text: 'Keep the original plan because changing activities may look like poor planning.', feedback: 'Too rigid. HRBA implementation requires learning and adjustment when evidence shows barriers.' },
      { id: 'B', text: 'Review what can be changed safely, adapt communication or delivery where possible, and document the reason for the change.', feedback: 'Strongest. Adaptation should be safe, realistic, documented, and linked to evidence.', correct: true },
      { id: 'C', text: 'Change the whole project immediately based on the most recent complaint.', feedback: 'Too reactive. One complaint may signal a pattern, but changes should be reviewed carefully.' },
      { id: 'D', text: 'Add the concerns to the donor report without changing implementation.', feedback: 'Incomplete. Reporting concerns is useful, but accountability requires action where feasible.' },
    ],
  },
];

const feedbackAccountabilityMicroOptions = [
  { id: 'A', text: 'A feedback mechanism is enough if people know it exists.', feedback: 'Incomplete. Awareness of a channel is only the starting point.' },
  { id: 'B', text: 'Accountability means recording all comments accurately.', feedback: 'Partial. Accurate records help, but response and follow-up are also needed.' },
  { id: 'C', text: 'Feedback becomes accountability when people can raise concerns safely and receive a meaningful response or explanation.', feedback: 'Correct. This captures safety, response, explanation, and follow-up.', correct: true },
  { id: 'D', text: 'Sensitive feedback should be avoided because it may create risk.', feedback: 'Incorrect. Sensitive feedback should be handled safely, not avoided.' },
];

const actorEngagementCards: ActorEngagementCard[] = [
  {
    id: 'local_leader_influence',
    number: '1',
    title: 'Local leader influence',
    brokenStep: 'Local leaders say they can quickly identify who should receive support because they know the community well.',
    question: 'What is the strongest CSO response?',
    choices: [
      { id: 'A', text: 'Accept the leaders’ list because they understand the community better than outsiders.', feedback: 'Too risky. Local knowledge is useful, but relying only on influential actors can hide quieter households, newcomers, women-headed households, persons with disabilities, or people outside networks.' },
      { id: 'B', text: 'Reject leader input completely because it may be biased.', feedback: 'Too rigid. Leader input may be useful. The issue is not whether leaders participate, but whether their influence is balanced with criteria, verification, and safeguards.' },
      { id: 'C', text: 'Use leader input as one source, check it against clear criteria, and add safe ways for less visible households to be verified.', feedback: 'Strongest. This uses local knowledge without giving one actor full control. It protects fairness by combining criteria, verification, and safe routes for people who may be missed.', correct: true },
      { id: 'D', text: 'Ask the donor to decide the final list so the CSO is not blamed.', feedback: 'Not appropriate. The donor should not replace local accountability or project decision-making. The CSO still needs a transparent and fair process.' },
    ],
  },
  {
    id: 'duty_bearer_engagement',
    number: '2',
    title: 'Duty-bearer engagement',
    brokenStep: 'A public office is responsible for part of the service pathway, but staff are slow to respond. Community members ask the CSO to publicly pressure the office.',
    question: 'What is the strongest first step?',
    choices: [
      { id: 'A', text: 'Publicly blame the office so the community sees that the CSO is on their side.', feedback: 'Unsafe and premature. Public blame may damage relationships, increase tension, or expose communities to risk. It should not be the first response.' },
      { id: 'B', text: 'Quietly drop the office from the process and let the CSO handle everything.', feedback: 'Too much overreach. Taking over may hide the duty-bearer’s responsibility and create unrealistic expectations of the CSO.' },
      { id: 'C', text: 'Clarify the issue, document the barrier, request a coordination discussion, and explain to communities what the CSO can and cannot control.', feedback: 'Strongest. This keeps responsibility visible, uses evidence, opens a practical engagement pathway, and communicates honestly with rights-holders.', correct: true },
      { id: 'D', text: 'Tell community members that the issue is outside the CSO’s mandate.', feedback: 'Too limited. The CSO may not control the public office, but it can still support clarification, evidence, referral, coordination, and follow-up.' },
    ],
  },
  {
    id: 'committee_capture_risk',
    number: '3',
    title: 'Committee capture risk',
    brokenStep: 'A project committee is active and efficient, but the same few members make most decisions. Other members attend but rarely speak.',
    question: 'What is the strongest adjustment?',
    choices: [
      { id: 'A', text: 'Continue with the active members because implementation is moving faster.', feedback: 'Too narrow. Speed can hide unequal influence. A fast process is not necessarily a fair or accountable process.' },
      { id: 'B', text: 'Replace the whole committee immediately.', feedback: 'Too drastic as a first step. Replacement may be needed in some cases, but first the CSO should understand the process and repair participation safeguards.' },
      { id: 'C', text: 'Review the committee process, rotate roles where possible, clarify decision rules, and create safer ways for quieter members to raise concerns.', feedback: 'Strongest. This addresses the process, not personalities. It widens voice, clarifies decision-making, and reduces capture risk without blaming individuals.', correct: true },
      { id: 'D', text: 'Ask quiet members to speak more confidently in the next meeting.', feedback: 'Incomplete. Asking quieter members to speak does not address the power conditions that may make speaking difficult or unsafe.' },
    ],
  },
  {
    id: 'confused_cso_role',
    number: '4',
    title: 'Confused CSO role',
    brokenStep: 'Community members think the CSO decides who receives support, while the CSO says the committee and public focal point are responsible for verification. No one is sure who explains decisions or handles appeals.',
    question: 'What is the strongest response?',
    choices: [
      { id: 'A', text: 'Let each actor explain their own role to avoid slowing implementation.', feedback: 'Too weak. Separate explanations can increase confusion if roles, decision points, and response routes are not clear.' },
      { id: 'B', text: 'Create a simple role-and-response map, explain it publicly in accessible language, and identify where people can ask questions or appeal safely.', feedback: 'Strongest. This improves transparency, accountability, and access to information. It also reduces unrealistic expectations and helps people know where to go.', correct: true },
      { id: 'C', text: 'Tell people that the project has already followed the agreed process.', feedback: 'Incomplete. Following a process is not enough if people do not understand how decisions were made or how to raise concerns.' },
      { id: 'D', text: 'Keep the roles internal because too much information may create complaints.', feedback: 'Risky. Withholding role information can weaken trust and accountability. Clear information helps prevent confusion and rumors.' },
    ],
  },
];

const actorEngagementMicroOptions = [
  { id: 'A', text: 'Local actors should not be involved because they may influence the process.', feedback: 'Not correct. Excluding local actors may weaken relevance, access, and coordination.' },
  { id: 'B', text: 'The CSO should manage all decisions directly to avoid unfairness.', feedback: 'Not correct. CSO over-control can create confusion and hide responsibility.' },
  { id: 'C', text: 'Actor engagement should use local knowledge while protecting transparency, fair access, role clarity, and safe response.', feedback: 'Correct. HRBA engagement balances influence, accountability, fairness, and safety.', correct: true },
  { id: 'D', text: 'Duty-bearer engagement should wait until after the project finishes.', feedback: 'Not correct. Duty-bearer engagement is often needed during implementation, not only afterward.' },
];

const adaptationDecisionCards: AdaptationDecisionCard[] = [
  {
    id: 'access_signal',
    stateKey: 'accessSignal',
    number: '1',
    title: 'Access signal',
    brokenStep: 'Attendance from one distant kebele is falling.',
    question: 'What is the safest first adaptation?',
    choices: [
      { id: 'A', text: 'Replace participants from the distant kebele with people who can attend regularly.', feedback: 'This may protect attendance numbers but can deepen exclusion. It treats absence as participant failure instead of checking the barrier.' },
      { id: 'B', text: 'Continue the sessions as planned because the schedule was already agreed.', feedback: 'Keeping the plan unchanged can make the project easier to manage, but it ignores implementation evidence.' },
      { id: 'C', text: 'Check the access barrier with affected participants and adjust timing, transport support, or delivery options where feasible.', feedback: 'Correct. This treats falling attendance as an access warning signal and looks for practical, safe adjustments.', correct: true },
      { id: 'D', text: 'Mark the distant kebele as low motivation in the monitoring notes.', feedback: 'This is risky and unfair. “Low motivation” can hide distance, cost, timing, safety, or communication barriers.' },
    ],
  },
  {
    id: 'care_timing_signal',
    stateKey: 'careTimingSignal',
    number: '2',
    title: 'Care and timing signal',
    brokenStep: 'Women with care responsibilities arrive late or leave early.',
    question: 'Which adaptation best reflects HRBA implementation practice?',
    choices: [
      { id: 'A', text: 'Ask women to make more effort because the sessions are important.', feedback: 'This blames participants and ignores structural barriers linked to care work and time use.' },
      { id: 'B', text: 'Review timing, session length, childcare-related constraints, and safe alternatives with affected participants.', feedback: 'Correct. This uses implementation evidence to adjust delivery in a way that protects access and dignity.', correct: true },
      { id: 'C', text: 'Move all sessions to evenings without asking participants.', feedback: 'This may help some people but harm others. Adaptation should be informed by those affected.' },
      { id: 'D', text: 'Keep the schedule but record that women attended partially.', feedback: 'Recording partial attendance may be useful, but it does not address the barrier.' },
    ],
  },
  {
    id: 'information_accountability_signal',
    stateKey: 'informationAccountabilitySignal',
    number: '3',
    title: 'Information and accountability signal',
    brokenStep: 'Newer participants do not understand how follow-up support will be prioritized.',
    question: 'What should the team do first?',
    choices: [
      { id: 'A', text: 'Share clear criteria, explain the process in accessible language, and create a safe way to ask questions.', feedback: 'Correct. Transparent information and safe questions reduce confusion, rumor, and unfair influence.', correct: true },
      { id: 'B', text: 'Avoid explaining the criteria because it may create complaints.', feedback: 'Avoiding information weakens accountability and can increase mistrust.' },
      { id: 'C', text: 'Tell participants that the committee will decide because it knows the community.', feedback: 'Committees may help, but responsibility and criteria must still be clear and fair.' },
      { id: 'D', text: 'Wait until final selection is complete, then explain the result.', feedback: 'Explaining after decisions are closed is usually too late for meaningful accountability.' },
    ],
  },
  {
    id: 'power_capture_signal',
    stateKey: 'powerCaptureSignal',
    number: '4',
    title: 'Power and capture signal',
    brokenStep: 'A local committee member is informally telling people who should receive the next support package.',
    question: 'Which response best avoids harm while protecting fairness?',
    choices: [
      { id: 'A', text: 'Remove the committee member publicly from the process.', feedback: 'Public removal may escalate tension and expose people. A response may be needed, but it should be handled carefully.' },
      { id: 'B', text: 'Quietly accept the advice because committee members know local realities.', feedback: 'Local knowledge can be useful, but informal gatekeeping can reinforce exclusion or capture.' },
      { id: 'C', text: 'Clarify the official criteria and decision process, use safe verification, and reduce informal gatekeeping without exposing complainants.', feedback: 'Correct. This protects fairness, reduces capture risk, and avoids exposing people who may feel unsafe speaking openly.', correct: true },
      { id: 'D', text: 'Cancel the support package to avoid conflict.', feedback: 'Cancellation may avoid one risk but can harm participants who need support. The better response is a safer process.' },
    ],
  },
];

const adaptationMicroOptions = [
  { id: 'A', text: 'Adapt only when the donor asks for a change.', feedback: 'Too narrow. Donor approval may matter, but HRBA adaptation begins with evidence from implementation and affected people.' },
  { id: 'B', text: 'Adapt when evidence shows the plan is creating barriers, exclusion, or risk, and document the change responsibly.', feedback: 'Correct. This connects evidence, inclusion, risk, accountability, and responsible documentation.', correct: true },
  { id: 'C', text: 'Avoid adaptation because changing the plan shows weak project management.', feedback: 'Incorrect. Responsible adaptation is a sign of learning and accountability, not weakness.' },
  { id: 'D', text: 'Adapt quickly whenever one person complains.', feedback: 'Incomplete. A concern should be taken seriously, but adaptation should consider evidence, safety, feasibility, and patterns.' },
];

const module4PortfolioFields: PortfolioField[] = [
  {
    id: 'warningSignal',
    number: '1',
    label: 'Warning signal',
    prompt: 'What implementation warning signal should the CSO pay attention to?',
    options: [
      'Attendance or participation is dropping for some groups.',
      'Some people attend but do not speak or influence decisions.',
      'Feedback is received but people do not hear what happened next.',
      'Delivery timing, location, language, cost, or accessibility is excluding people.',
      'A local actor may be controlling access or information.',
    ],
  },
  {
    id: 'affectedDifferently',
    number: '2',
    label: 'Who may be affected differently',
    prompt: 'Who may be affected differently by this implementation issue?',
    options: [
      'People from distant or less-connected areas.',
      'People with care responsibilities or limited time.',
      'Persons with disabilities or people who need accessible information or venues.',
      'Quieter participants, newer members, or people with less influence.',
      'People who depend on local leaders or service providers.',
    ],
  },
  {
    id: 'mainBarrier',
    number: '3',
    label: 'Main barrier',
    prompt: 'What barrier is shaping the problem?',
    options: [
      'Information is not clear, timely, or accessible.',
      'The activity is technically open but not practically reachable.',
      'Participation is visible but not influential.',
      'Feedback channels exist but response and follow-up are weak.',
      'Power or gatekeeping is affecting who benefits.',
    ],
  },
  {
    id: 'safeAdjustment',
    number: '4',
    label: 'Safe adjustment',
    prompt: 'What practical adjustment could the CSO make without creating harm?',
    options: [
      'Adjust timing, location, language, format, or access support.',
      'Open safer ways for people to ask questions or give feedback.',
      'Explain criteria, decisions, and follow-up more clearly.',
      'Check who is missing or silent before continuing the same delivery plan.',
      'Engage responsible actors carefully without blaming or exposing people.',
    ],
  },
  {
    id: 'accountabilityDocumentation',
    number: '5',
    label: 'Accountability and documentation',
    prompt: 'How should the CSO document and follow up on the adjustment?',
    options: [
      'Record the issue as a general implementation learning point.',
      'Explain to participants what changed and why.',
      'Track whether the adjustment improves access or participation.',
      'Keep sensitive details out of reports and use safe aggregated language.',
      'Review the issue again in the next implementation check-in.',
    ],
  },
];

const module4KnowledgeQuestions: KnowledgeCheckQuestion[] = [
  {
    id: 'early-warning-signs',
    number: 1,
    title: 'Early warning signs during delivery',
    scenario:
      'A CSO is implementing a livelihood activity. The first two sessions were well attended, but participation from distant villages is dropping. Field staff hear that transport costs increased, and some participants feel embarrassed asking for support. The schedule was already agreed with the donor.',
    question: 'What is the strongest HRBA-informed response?',
    choices: [
      { id: 'A', text: 'Continue as planned because the schedule was already approved and changing it may affect reporting.', feedback: 'Not strong enough. Approved plans still need adjustment when implementation evidence shows that people are being excluded or participation is weakening.' },
      { id: 'B', text: 'Record the issue for the final report and continue delivery while watching whether attendance improves.', feedback: 'Partly useful, but too late. Recording the issue matters, but waiting for the final report means the project may continue excluding people during delivery.' },
      { id: 'C', text: 'Review the access barrier quickly, consult affected participants safely, and adjust timing, transport support, or delivery options where feasible.', feedback: 'Correct. This treats dropping attendance as an access warning sign and responds while the activity can still be adjusted safely and practically.', correct: true },
      { id: 'D', text: 'Replace participants who miss sessions with others who can attend regularly so the activity target is protected.', feedback: 'Risky and exclusion-blind. Replacing people may protect targets, but it can punish participants for barriers created by cost, distance, timing, or social pressure.' },
    ],
    takeaway: 'HRBA during implementation means noticing when people begin to slip out — and responding before exclusion becomes normal.',
  },
  {
    id: 'equal-invitation-access',
    number: 2,
    title: 'Equal invitation is not equal access',
    scenario:
      'A CSO invites all registered participants to a community workshop. The venue has stairs, the meeting is late afternoon, facilitation uses only one language, and no support is planned for participants who cannot read the written handout. Staff say the invitation was equal because everyone received the same message.',
    question: 'What is the strongest HRBA concern?',
    choices: [
      { id: 'A', text: 'Equal invitation may not mean equal access if the venue, timing, language, format, or support arrangements create barriers.', feedback: 'Correct. Real access depends on whether different people can actually reach, understand, participate in, and benefit from the activity.', correct: true },
      { id: 'B', text: 'The process is fair because all registered participants received the same invitation.', feedback: 'Too narrow. The same invitation can still produce unequal access when people face different barriers.' },
      { id: 'C', text: 'The CSO should cancel the workshop until it can meet every possible access need perfectly.', feedback: 'Too rigid. The CSO does not need perfection before acting. It needs practical, reasonable adjustments based on likely barriers.' },
      { id: 'D', text: 'Accessibility should be handled only if participants formally complain or request support.', feedback: 'Too passive. HRBA requires anticipating barriers, not waiting until people take the risk or effort to complain.' },
    ],
    takeaway: 'Equal treatment is not always equitable access. Implementation teams must check whether people can realistically participate.',
  },
  {
    id: 'participation-during-implementation',
    number: 3,
    title: 'Participation during implementation',
    scenario:
      'A project held strong consultations during design. During implementation, staff mostly communicate through one committee. Some participants say decisions about schedules, priority support, and follow-up now happen without them. The committee still attends all meetings and says it represents everyone.',
    question: 'What is the strongest response?',
    choices: [
      { id: 'A', text: 'Continue using the committee because it was agreed during design and keeps communication efficient.', feedback: 'Efficient, but incomplete. Committees can be useful, but they can also become narrow or dominated over time.' },
      { id: 'B', text: 'Add more posters and public announcements so people know what the committee has decided.', feedback: 'Useful, but not enough. Information helps, but participation also requires voice, influence, and response.' },
      { id: 'C', text: 'Check whether the committee is still enabling broad voice, reopen practical feedback routes, and explain how input will affect implementation decisions.', feedback: 'Correct. This keeps participation alive during delivery and checks whether representation is still meaningful.', correct: true },
      { id: 'D', text: 'Wait for the midterm review because participation was already completed during the design stage.', feedback: 'Too late. Participation is not a one-time design activity. It must continue while implementation decisions are being made.' },
    ],
    takeaway: 'Participation must remain active during implementation, especially when delivery conditions or decisions change.',
  },
  {
    id: 'sensitive-feedback-accountability',
    number: 4,
    title: 'Sensitive feedback and accountability',
    scenario:
      'A participant privately tells a field officer that some people are afraid to raise concerns because they depend on the same local leaders for future support. The field officer is unsure whether to report the concern to the full committee so the issue can be discussed openly.',
    question: 'What is the strongest HRBA response?',
    choices: [
      { id: 'A', text: 'Share the concern with the full committee so they can solve it quickly and transparently.', feedback: 'Transparent in intention, but risky. Open discussion may expose the person or increase fear if local power dynamics are part of the concern.' },
      { id: 'B', text: 'Treat the concern as sensitive, protect the person’s identity, analyze the pattern safely, and adjust feedback routes.', feedback: 'Correct. This protects confidentiality while still treating the feedback as a serious accountability signal.', correct: true },
      { id: 'C', text: 'Ignore the comment unless several more people raise the same concern.', feedback: 'Too passive. One concern can reveal a real safety or power issue, especially if others are afraid to speak.' },
      { id: 'D', text: 'Ask the participant to raise the concern publicly so the team has clear evidence.', feedback: 'Unsafe. HRBA does not require people to expose themselves publicly in order to be believed or protected.' },
    ],
    takeaway: 'Sensitive feedback needs safe routing, not public exposure.',
  },
  {
    id: 'engaging-actors',
    number: 5,
    title: 'Engaging actors without capture or confusion',
    scenario:
      'During distribution, local leaders suggest prioritizing households they know well because this will reduce conflict and speed up delivery. Staff recognize that leaders have useful knowledge, but they are also concerned that quieter households, newer arrivals, and less connected families may be excluded.',
    question: 'What is the strongest HRBA-informed action?',
    choices: [
      { id: 'A', text: 'Accept the leaders’ list because they know the area and can help maintain order.', feedback: 'Practical, but risky. Leaders may know the area, but relying only on their list can reinforce gatekeeping or favoritism.' },
      { id: 'B', text: 'Reject all leader input because it may be biased and could create capture.', feedback: 'Too rigid. Leader input may be useful. The issue is how to balance it with transparent criteria and safeguards.' },
      { id: 'C', text: 'Use leader input as one source, check it against transparent criteria, add safe verification routes, and monitor who may be missing.', feedback: 'Correct. This uses local knowledge while protecting fairness, inclusion, and accountability.', correct: true },
      { id: 'D', text: 'Stop the distribution until the CSO can independently verify every household without leader involvement.', feedback: 'Strong in control, but often unrealistic. Full independent verification may delay needed support and may not be necessary if safeguards are strong.' },
    ],
    takeaway: 'HRBA manages gatekeeper influence; it does not simply accept it or reject it.',
  },
  {
    id: 'adaptation-reporting',
    number: 6,
    title: 'Adaptation and responsible reporting',
    scenario:
      'Implementation evidence shows that one activity is reaching fewer women than expected because the timing conflicts with care responsibilities. Staff worry that reporting the issue to the donor may look like failure. They are considering quietly changing the timing and reporting only that the activity continued.',
    question: 'What is the strongest HRBA response?',
    choices: [
      { id: 'A', text: 'Report the original plan and address the issue informally later.', feedback: 'Risky. This hides a rights-based quality issue and misses an opportunity to show adaptive learning.' },
      { id: 'B', text: 'Report the issue honestly, explain the barrier, describe the planned adjustment, and track whether the change improves access.', feedback: 'Correct. This connects evidence, safe adaptation, accountability, and responsible reporting.', correct: true },
      { id: 'C', text: 'Change the activity quietly without mentioning it because the change improves inclusion.', feedback: 'Incomplete. The adjustment may be good, but responsible implementation also requires documenting and explaining why the change was needed.' },
      { id: 'D', text: 'Remove women’s participation from the report because it may create questions about performance.', feedback: 'Weak and misleading. Removing the issue from the report hides exclusion instead of addressing it.' },
    ],
    takeaway: 'Adaptive implementation is stronger when evidence, adjustment, and honest reporting are connected.',
  },
];

const module4SummaryCards = [
  {
    number: '01',
    title: 'Notice warning signs',
    text: 'You practiced identifying early signals that access, participation, trust, safety, or accountability may be weakening during delivery.',
    reveal: 'Look beyond activity completion and notice who may be losing access, trust, safety, or voice.',
  },
  {
    number: '02',
    title: 'Adjust delivery',
    text: 'You practiced recognizing when equal invitation is not equal access, and choosing practical adjustments to timing, location, language, cost, safety, or accessibility.',
    reveal: 'Change delivery methods when barriers appear, without blaming people for not participating.',
  },
  {
    number: '03',
    title: 'Keep participation alive',
    text: 'You practiced checking whether people still have information, voice, influence, and feedback opportunities after implementation begins.',
    reveal: 'Continue checking whether people can influence decisions after implementation starts.',
  },
  {
    number: '04',
    title: 'Repair feedback loops',
    text: 'You practiced strengthening feedback systems so concerns are listened to, analyzed, responded to, followed up, and used for learning.',
    reveal: 'Make feedback useful by closing the loop, not only collecting comments.',
  },
  {
    number: '05',
    title: 'Engage actors carefully',
    text: 'You practiced working with duty-bearers, local leaders, service actors, and community structures without blame, capture, confusion, or taking over others’ responsibilities.',
    reveal: 'Clarify roles and responsibilities while avoiding harm, blame, or capture.',
  },
  {
    number: '06',
    title: 'Adapt safely',
    text: 'You practiced using implementation evidence to make safe project adjustments and document them honestly without exposing people or sensitive information.',
    reveal: 'Document changes honestly while protecting people and sensitive information.',
  },
];

function setRoute(path: string) {
  if (typeof window !== 'undefined') window.history.pushState(null, '', path);
}

function addProgress(prev: LearningState, screenId: string) {
  const progress = new Set(prev.screenProgress[MODULE_ID] || []);
  progress.add(screenId);
  return {
    ...prev.screenProgress,
    [MODULE_ID]: Array.from(progress),
  };
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

function completeScreen(
  screenId: string,
  nextScreenId: string,
  nextRoute: string,
  onChangeState: Module4RendererProps['onChangeState'],
  practiceKey: string,
  payload: Record<string, unknown> = {},
) {
  onChangeState((prev) => ({
    ...prev,
    currentScreenId: nextScreenId,
    screenProgress: addProgress(prev, screenId),
    practiceCheckState: updatePracticeState(prev, practiceKey, {
      ...payload,
      status: 'completed',
      completedAt: new Date().toISOString(),
    }),
  }));
  setRoute(nextRoute);
}

function ModuleContextLabel({ children }: { children: string }) {
  return <p className="m4-context-label">{children}</p>;
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
    <button type="button" className="m4-primary-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Module4IntroVideoScreen({ onChangeState }: Module4RendererProps) {
  return (
    <main className="m4-screen m4-intro-video-screen" aria-labelledby="m4-intro-video-title">
      <section className="m4-video-shell">
        <header className="m4-video-copy">
          <ModuleContextLabel>MODULE 4 · APPLYING HRBA DURING IMPLEMENTATION</ModuleContextLabel>
          <h1 id="m4-intro-video-title">Before you begin</h1>
          <p>
            Watch this short introduction to see how Module 4 will help you keep HRBA alive while a project is
            being delivered — through participation, access, feedback, responsibility, safety, adaptation, and
            accountable follow-up.
          </p>
        </header>

        <section className="m4-video-card" aria-label="Module 4 intro video">
          <div className="m4-video-frame">
            {module4IntroVideoUrl ? (
              <iframe
                src={module4IntroVideoUrl}
                title="Module 4 Intro Video: Keeping HRBA Alive During Delivery"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="m4-video-placeholder">
                <span aria-hidden="true">▶</span>
                <p className="m4-card-kicker">Intro video placeholder</p>
                <strong>Video will appear here when a URL is added.</strong>
              </div>
            )}
          </div>
          <article className="m4-transcript-card">
            <p className="m4-card-kicker">Transcript</p>
            <p>Transcript will be added here.</p>
          </article>
        </section>

        <footer className="m4-video-footer">
          <p>Module 4 focuses on practical delivery decisions: who is reached, who is heard, what changes, and how follow-up stays accountable.</p>
          <PrimaryButton
            onClick={() =>
              completeScreen(
                'M4-S1-01',
                'M4-S1-02',
                module4Routes['M4-S1-02'],
                onChangeState,
                'module4_intro_video',
                { viewedPlaceholder: !module4IntroVideoUrl },
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

function Module4LearningObjectivesScreen({ onChangeState }: Module4RendererProps) {
  return (
    <main className="m4-screen m4-objectives-screen" aria-labelledby="m4-objectives-title">
      <section className="m4-objectives-shell">
        <aside className="m4-objectives-copy">
          <div>
            <ModuleContextLabel>MODULE 4 · APPLYING HRBA DURING IMPLEMENTATION</ModuleContextLabel>
            <h1 id="m4-objectives-title">Learning Objectives</h1>
            <p className="m4-objectives-subtitle">What you will be able to do</p>
          </div>
          <p>
            In this module, you will practice how to keep HRBA alive after a project starts. You will look for
            warning signs during delivery, adjust activities safely, protect participation, strengthen feedback,
            and document changes responsibly.
          </p>
          <article className="m4-implementation-lens" aria-label="Implementation lens motif">
            <span>!</span>
            <span>Feedback</span>
            <span>Adapt</span>
          </article>
          <blockquote>
            HRBA during implementation means staying alert: noticing who may be slipping out, who is not being
            heard, what risks are emerging, and what needs to change safely.
          </blockquote>
          <PrimaryButton
            onClick={() =>
              completeScreen(
                'M4-S1-02',
                'M4-S1-03',
                module4Routes['M4-S1-03'],
                onChangeState,
                'module4_learning_objectives',
                { reviewedObjectives: module4Objectives.map((objective) => objective.number) },
              )
            }
          >
            Continue
          </PrimaryButton>
        </aside>

        <section className="m4-objective-grid" aria-label="Module 4 learning objectives">
          {module4Objectives.map((objective) => (
            <article key={objective.number} className={`m4-objective-card m4-objective-card--${objective.accent}`} tabIndex={0}>
              <span>{objective.number}</span>
              <h2>{objective.title}</h2>
              <p>{objective.text}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

function getWarningFeedback(selectedIds: string[]) {
  const bestIds = ['A', 'B', 'C', 'D'];
  const hasEveryBest = bestIds.every((id) => selectedIds.includes(id));
  const hasOnlyBest = selectedIds.every((id) => bestIds.includes(id));
  const includesE = selectedIds.includes('E');
  const includesF = selectedIds.includes('F');

  if (selectedIds.length === warningSignalOptions.length) {
    return {
      type: 'allSelected',
      heading: 'Separate warning signs from assumptions.',
      text: 'A, B, C, and D are warning signs in the situation. E and F are assumptions or pressures that may lead the team to continue without checking who is being missed.',
    };
  }

  if (hasEveryBest && hasOnlyBest) {
    return {
      type: 'best',
      heading: 'Good diagnosis.',
      text: 'These are the strongest warning signs. They suggest that access, voice, accessibility, information, and accountability may be weakening during implementation. The CSO should not wait until the end of the project to investigate.',
    };
  }

  if (includesE && includesF) {
    return {
      type: 'mixed',
      heading: 'Separate warning signs from assumptions.',
      text: 'The strongest warning signs are A, B, C, and D. E and F describe pressure or reassurance that could cause the team to miss access, participation, accessibility, information, and accountability gaps.',
    };
  }

  if (includesE) {
    return {
      type: 'workplanPressure',
      heading: 'Workplan pressure is real, but it is not a reason to ignore exclusion.',
      text: 'A tight workplan can make teams continue without adjustment. But HRBA during implementation means using early warning signs to adapt safely before exclusion becomes normal.',
    };
  }

  if (includesF) {
    return {
      type: 'earlySuccessAssumption',
      heading: 'Early success does not guarantee continued inclusion.',
      text: 'Strong attendance at the beginning is useful, but implementation conditions can change. The team needs to check whether people are still able to access, participate, understand, and raise concerns.',
    };
  }

  return {
    type: 'partial',
    heading: 'Good start — look for the full pattern.',
    text: 'You identified part of the problem. During implementation, HRBA requires looking across the whole process: who can attend, who can enter, who can speak, who understands decisions, and who receives response.',
  };
}

function Module4WarningScenarioScreen({ state, onChangeState }: Module4RendererProps) {
  const stored = state.practiceCheckState.module4Screen4WarningDiagnosis || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M4-S1-03');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    (stored.selectedWarningSigns as string[]) || [],
  );
  const [submitted, setSubmitted] = useState<boolean>(Boolean(stored.submitted || completed));
  const feedback = getWarningFeedback(selectedIds);
  const bestSelectionsMet =
    ['A', 'B', 'C', 'D'].every((id) => selectedIds.includes(id)) &&
    selectedIds.every((id) => ['A', 'B', 'C', 'D'].includes(id));
  const canContinue = submitted || completed;

  const persist = (patch: Record<string, unknown>, markComplete = false) => {
    onChangeState((prev) => ({
      ...prev,
      screenProgress: markComplete ? addProgress(prev, 'M4-S1-03') : prev.screenProgress,
      practiceCheckState: updatePracticeState(prev, 'module4Screen4WarningDiagnosis', patch),
    }));
  };

  const toggleOption = (optionId: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId];
      setSubmitted(false);
      persist({
        selectedWarningSigns: next,
        submitted: false,
        completed,
      });
      return next;
    });
  };

  const submitDiagnosis = () => {
    if (selectedIds.length === 0) return;
    setSubmitted(true);
    persist(
      {
        selectedWarningSigns: selectedIds,
        submitted: true,
        bestSelectionsMet,
        feedbackType: feedback.type,
        completed: true,
      },
      true,
    );
  };

  return (
    <main className="m4-screen m4-warning-screen" aria-labelledby="m4-warning-title">
      <section className="m4-warning-shell">
        <header className="m4-warning-header">
          <div>
            <ModuleContextLabel>MODULE 4 · IMPLEMENTATION WARNING SCENARIO</ModuleContextLabel>
            <h1 id="m4-warning-title">The Plan Is Being Delivered — But Something Is Changing</h1>
            <p>Notice early warning signs before exclusion becomes normal.</p>
          </div>
          <div className="m4-warning-signal" aria-label="Implementation signal dashboard">
            <span>Access</span>
            <span>Voice</span>
            <span>Response</span>
            <strong aria-hidden="true">!</strong>
          </div>
        </header>

        <section className="m4-warning-main">
          <article className="m4-warning-scenario-card">
            <p className="m4-card-kicker">Scenario: The community learning sessions</p>
            <h2>A project can start well and still drift away from HRBA during implementation.</h2>
            <p>
              The plan may be approved. The budget may be clear. Activities may be happening on time. But if
              participation weakens, access barriers appear, feedback is not answered, or some people quietly
              stop coming, the CSO needs to pause and ask better questions.
            </p>
            <div className="m4-warning-story">
              <p>
                A local CSO is implementing a community learning project. The sessions were designed with
                strong participation during the planning stage. The first two sessions were well attended, and
                the team reported good progress.
              </p>
              <p>
                By the fourth session, the room looks different. Some participants from distant villages are no
                longer attending regularly. Younger women are present but rarely speak. A person using a mobility
                aid arrives late and sits near the back because the meeting space is difficult to enter. Several
                participants say they are not sure how decisions about follow-up support will be made.
              </p>
              <p>The facilitator wants to continue because the workplan is already tight.</p>
            </div>
          </article>

          <section className="m4-warning-activity-card" aria-labelledby="m4-warning-activity-title">
            <div className="m4-warning-activity-head">
              <div>
                <p className="m4-card-kicker">Warning-signal diagnosis</p>
                <h2 id="m4-warning-activity-title">Which warning signs are visible in this implementation situation?</h2>
                <p>Select all that apply.</p>
              </div>
              <span>{selectedIds.length}/6 selected</span>
            </div>
            <div className="m4-warning-option-grid">
              {warningSignalOptions.map((option) => {
                const selected = selectedIds.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`m4-warning-option ${selected ? 'is-selected' : ''} ${submitted && option.best ? 'is-best' : ''} ${submitted && selected && !option.best ? 'is-not-best' : ''}`}
                    onClick={() => toggleOption(option.id)}
                    aria-pressed={selected}
                  >
                    <span>{selected ? '✓' : option.id}</span>
                    <strong>{option.text}</strong>
                  </button>
                );
              })}
            </div>
            <div className="m4-warning-submit-row">
              <p>Feedback appears after you submit. You can change selections and resubmit.</p>
              <PrimaryButton onClick={submitDiagnosis} disabled={selectedIds.length === 0}>
                {submitted ? 'Resubmit diagnosis' : 'Submit diagnosis'}
              </PrimaryButton>
            </div>
          </section>
        </section>

        <section className={`m4-warning-bottom ${submitted ? 'is-revealed' : ''}`} aria-live="polite">
          {submitted ? (
            <>
              <article className={`m4-warning-feedback-card m4-warning-feedback-card--${feedback.type}`}>
                <p className="m4-card-kicker">Feedback</p>
                <h2>{feedback.heading}</h2>
                <p>{feedback.text}</p>
                <div className="m4-warning-selected-feedback" aria-label="Feedback for selected options">
                  {warningSignalOptions
                    .filter((option) => selectedIds.includes(option.id))
                    .map((option) => (
                      <p key={option.id}>
                        <strong>{option.id}</strong> {option.feedback}
                      </p>
                    ))}
                </div>
              </article>
              <section className="m4-warning-followup-card" aria-labelledby="m4-warning-followup-title">
                <div>
                  <p className="m4-card-kicker">What should the CSO do next?</p>
                  <h2 id="m4-warning-followup-title">Pause, check the pattern, and make practical adjustments.</h2>
                  <p>
                    The CSO does not need to redesign the whole project immediately. But it should pause, check
                    the pattern, and make practical adjustments.
                  </p>
                </div>
                <div className="m4-warning-followup-grid">
                  {warningFollowUpCards.map((card) => (
                    <article key={card.number}>
                      <span>{card.number}</span>
                      <strong>{card.title}</strong>
                      <p>{card.text}</p>
                    </article>
                  ))}
                </div>
              </section>
              <aside className="m4-warning-continue-card">
                <p>
                  HRBA during implementation means staying alert. When the project starts to change in practice,
                  the CSO should notice early, ask safely, adjust realistically, and explain what will happen next.
                </p>
                <PrimaryButton
                  onClick={() =>
                    completeScreen(
                      'M4-S1-03',
                      'M4-S1-04',
                      module4Routes['M4-S1-04'],
                      onChangeState,
                      'module4Screen4WarningDiagnosis',
                      {
                        selectedWarningSigns: selectedIds,
                        submitted: true,
                        bestSelectionsMet,
                        feedbackType: feedback.type,
                        completed: true,
                      },
                    )
                  }
                  disabled={!canContinue}
                >
                  Continue
                </PrimaryButton>
              </aside>
            </>
          ) : (
            <article className="m4-warning-locked-card">
              <p>Submit the warning-signal diagnosis once to reveal what the CSO should do next.</p>
              <PrimaryButton onClick={() => undefined} disabled>
                Continue
              </PrimaryButton>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}

function Module4ImplementationLensScreen({ state, onChangeState }: Module4RendererProps) {
  const stored = state.practiceCheckState.module4Screen5ImplementationLens || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M4-S1-04');
  const allLensIds = implementationLensPoints.map((point) => point.id);
  const [visitedIds, setVisitedIds] = useState<string[]>(
    completed ? allLensIds : (stored.visitedLensPoints as string[]) || [],
  );
  const [activeId, setActiveId] = useState<string>(
    (stored.activeLensPoint as string) || implementationLensPoints[0].id,
  );

  const activePoint = implementationLensPoints.find((point) => point.id === activeId) || implementationLensPoints[0];
  const visitedCount = visitedIds.length;
  const allVisited = visitedCount === implementationLensPoints.length;

  const persist = (patch: Record<string, unknown>, markComplete = false) => {
    onChangeState((prev) => ({
      ...prev,
      screenProgress: markComplete ? addProgress(prev, 'M4-S1-04') : prev.screenProgress,
      practiceCheckState: updatePracticeState(prev, 'module4Screen5ImplementationLens', patch),
    }));
  };

  const openLensPoint = (pointId: string) => {
    const nextVisited = visitedIds.includes(pointId) ? visitedIds : [...visitedIds, pointId];
    setActiveId(pointId);
    setVisitedIds(nextVisited);
    persist(
      {
        activeLensPoint: pointId,
        visitedLensPoints: nextVisited,
        synthesisRevealed: nextVisited.length === implementationLensPoints.length,
        completed: nextVisited.length === implementationLensPoints.length,
      },
      nextVisited.length === implementationLensPoints.length,
    );
  };

  return (
    <main className="m4-screen m4-lens-screen" aria-labelledby="m4-lens-title">
      <section className="m4-lens-shell">
        <aside className="m4-lens-copy">
          <div>
            <ModuleContextLabel>MODULE 4 · IMPLEMENTATION LENS</ModuleContextLabel>
            <h1 id="m4-lens-title">The HRBA Implementation Lens</h1>
            <p className="m4-lens-subtitle">Keep checking the quality of delivery while the project is running.</p>
          </div>
          <p>
            A project can start well and still drift away from HRBA during delivery. Participation may become
            weaker, access barriers may appear, information may stop reaching everyone, feedback may not receive
            a response, or small implementation decisions may create new risks.
          </p>
          <p className="m4-lens-instruction">
            Open each lens point. For each one, ask what the project team should keep checking during implementation.
          </p>
          <div className="m4-lens-progress" role="status" aria-live="polite">
            <strong>{visitedCount} of 8</strong>
            <span>lens points opened</span>
          </div>
          {allVisited ? (
            <article className="m4-lens-synthesis" aria-live="polite">
              <p>
                Implementation is where HRBA is tested. A rights-based project team keeps asking who is
                participating, who is missing, what barriers are emerging, who is responsible, what risks exist,
                and what needs to change safely.
              </p>
            </article>
          ) : (
            <article className="m4-lens-synthesis m4-lens-synthesis--locked">
              <p>Open all eight lens points to reveal the implementation synthesis.</p>
            </article>
          )}
          <PrimaryButton
            disabled={!allVisited && !completed}
            onClick={() =>
              completeScreen(
                'M4-S1-04',
                'M4-S1-05',
                module4Routes['M4-S1-05'],
                onChangeState,
                'module4Screen5ImplementationLens',
                {
                  activeLensPoint: activeId,
                  visitedLensPoints: allLensIds,
                  synthesisRevealed: true,
                  completed: true,
                },
              )
            }
          >
            {allVisited || completed ? 'Continue' : 'Open all lens points to continue'}
          </PrimaryButton>
        </aside>

        <section className="m4-lens-dashboard" aria-label="Interactive implementation lens">
          <div className="m4-lens-map">
            <div className="m4-lens-center" aria-hidden="true">
              <span>Implementation</span>
              <strong>Lens</strong>
            </div>
            {implementationLensPoints.map((point) => {
              const visited = visitedIds.includes(point.id);
              const active = activePoint.id === point.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  className={`m4-lens-point m4-lens-point--${point.id} ${visited ? 'is-visited' : ''} ${active ? 'is-active' : ''}`}
                  onClick={() => openLensPoint(point.id)}
                  aria-pressed={active}
                  aria-label={`${point.number}. ${point.title}. ${visited ? 'Opened' : 'Not opened'}. ${point.question}`}
                >
                  <span>{visited ? '✓' : point.number}</span>
                  <strong>{point.title}</strong>
                  <small>{point.icon}</small>
                </button>
              );
            })}
          </div>

          <article className="m4-lens-reveal-card" aria-live="polite">
            <p className="m4-card-kicker">Lens point {activePoint.number}</p>
            <h2>{activePoint.title}</h2>
            <p className="m4-lens-question">{activePoint.question}</p>
            <p>{activePoint.reveal}</p>
            <div>
              <strong>Implementation signal</strong>
              <span>{activePoint.signal}</span>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function getParticipationFeedback(answers: Record<string, string>) {
  const answerValues = participationCycleSteps.map((step) => answers[step.id]);
  const correctCount = participationCycleSteps.filter((step) => answers[step.id] === step.best).length;
  const stillStrongCount = answerValues.filter((answer) => answer === 'Still strong').length;
  const weakeningCount = answerValues.filter((answer) => answer === 'Weakening').length;

  if (correctCount >= 4) {
    return {
      type: 'strong',
      text: 'Good analysis. You noticed that participation can weaken even when a project began with consultation. During delivery, the team must keep checking access, voice, influence, and reporting back.',
    };
  }

  if (stillStrongCount >= 3) {
    return {
      type: 'lookAgain',
      text: 'Look again. Early consultation does not guarantee meaningful participation during implementation. The scenario shows access barriers, narrowing voice, and unclear influence.',
    };
  }

  if (weakeningCount === participationCycleSteps.length) {
    return {
      type: 'precise',
      text: 'You noticed important risks, but HRBA analysis should stay precise. Some steps are clearly weakening; others need checking because the scenario does not yet give enough evidence.',
    };
  }

  return {
    type: 'mixed',
    text: 'You identified part of the issue. The strongest analysis is to separate what is already weakening from what still needs checking through safe follow-up.',
  };
}

function Module4ParticipationDeliveryScreen({ state, onChangeState }: Module4RendererProps) {
  const stored = state.practiceCheckState.module4Screen6ParticipationDelivery || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M4-S1-05');
  const [answers, setAnswers] = useState<Record<string, string>>(
    (stored.cycleDiagnoses as Record<string, string>) || {},
  );
  const [submitted, setSubmitted] = useState<boolean>(Boolean(stored.submitted || completed));
  const [microAnswer, setMicroAnswer] = useState<string>((stored.microAnswer as string) || '');

  const diagnosedCount = participationCycleSteps.filter((step) => answers[step.id]).length;
  const allDiagnosed = diagnosedCount === participationCycleSteps.length;
  const feedback = getParticipationFeedback(answers);
  const selectedMicro = participationMicroOptions.find((option) => option.id === microAnswer);
  const canContinue = submitted && Boolean(microAnswer);

  const persist = (patch: Record<string, unknown>, markComplete = false) => {
    onChangeState((prev) => ({
      ...prev,
      screenProgress: markComplete ? addProgress(prev, 'M4-S1-05') : prev.screenProgress,
      practiceCheckState: updatePracticeState(prev, 'module4Screen6ParticipationDelivery', patch),
    }));
  };

  const chooseDiagnosis = (stepId: string, value: string) => {
    const next = { ...answers, [stepId]: value };
    setAnswers(next);
    setSubmitted(false);
    persist({ cycleDiagnoses: next, submitted: false, microAnswer });
  };

  const submitCycle = () => {
    if (!allDiagnosed) return;
    setSubmitted(true);
    persist({
      cycleDiagnoses: answers,
      submitted: true,
      feedbackType: feedback.type,
      microAnswer,
      completed: Boolean(microAnswer),
    });
  };

  const chooseMicro = (optionId: string) => {
    setMicroAnswer(optionId);
    persist(
      {
        cycleDiagnoses: answers,
        submitted,
        feedbackType: feedback.type,
        microAnswer: optionId,
        completed: submitted,
      },
      submitted,
    );
  };

  return (
    <main className="m4-screen m4-participation-screen" aria-labelledby="m4-participation-title">
      <section className="m4-participation-shell">
        <aside className="m4-participation-story">
          <div>
            <ModuleContextLabel>MODULE 4 · PARTICIPATION DURING DELIVERY</ModuleContextLabel>
            <h1 id="m4-participation-title">Participation Must Stay Alive During Delivery</h1>
            <p className="m4-participation-subtitle">
              A project can start with participation and still lose it during implementation.
            </p>
          </div>
          <p>
            Many projects begin with consultations. But once delivery starts, decisions about timing, location,
            criteria, complaints, and adjustments may shift back to staff, leaders, or a small committee.
          </p>
          <p>
            HRBA asks whether people still have information, voice, influence, and response while the project is running.
          </p>
          <article className="m4-participation-scenario">
            <p className="m4-card-kicker">Scenario: The training is running, but participation is narrowing</p>
            <p>
              A CSO is implementing a livelihood skills project. The design included community consultation, and
              the first sessions were well attended.
            </p>
            <p>
              After a few weeks, the team notices that the same small group speaks during review meetings.
              Participants from distant areas attend less often. Some women say the timing is difficult because
              of care responsibilities. A few quieter participants say they do not know whether their suggestions
              are taken seriously.
            </p>
          </article>
        </aside>

        <section className="m4-participation-cycle" aria-labelledby="m4-participation-cycle-title">
          <div className="m4-participation-cycle-head">
            <div>
              <p className="m4-card-kicker">Participation during delivery cycle</p>
              <h2 id="m4-participation-cycle-title">Select where participation may be weakening.</h2>
            </div>
            <span role="status" aria-live="polite">{diagnosedCount} of 5 steps diagnosed</span>
          </div>
          <div className="m4-participation-steps">
            {participationCycleSteps.map((step) => (
              <article key={step.id} className={`m4-participation-step ${answers[step.id] ? 'is-diagnosed' : ''}`}>
                <div className="m4-participation-step-text">
                  <span aria-hidden="true">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.prompt}</p>
                  </div>
                  <small aria-hidden="true">{step.icon}</small>
                </div>
                <div className="m4-participation-diagnosis-options" aria-label={`${step.title} diagnosis options`}>
                  {participationDiagnosisOptions.map((option) => {
                    const selected = answers[step.id] === option;
                    const isBest = submitted && step.best === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`m4-participation-diagnosis ${selected ? 'is-selected' : ''} ${isBest ? 'is-best' : ''}`}
                        onClick={() => chooseDiagnosis(step.id, option)}
                        aria-pressed={selected}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <p className="m4-participation-step-feedback">
                    <strong>Best diagnosis: {step.best}.</strong> {step.feedback}
                  </p>
                )}
              </article>
            ))}
          </div>
          <PrimaryButton disabled={!allDiagnosed} onClick={submitCycle}>
            {submitted ? 'Resubmit cycle diagnosis' : 'Submit cycle diagnosis'}
          </PrimaryButton>
        </section>

        <aside className="m4-participation-response" aria-live="polite">
          {submitted ? (
            <>
              <article className={`m4-participation-feedback m4-participation-feedback--${feedback.type}`}>
                <p className="m4-card-kicker">Feedback</p>
                <p>{feedback.text}</p>
              </article>
              <section className="m4-participation-repairs" aria-labelledby="m4-participation-repair-title">
                <p className="m4-card-kicker">What could the CSO adjust?</p>
                <h2 id="m4-participation-repair-title">Repair actions</h2>
                <div>
                  {participationRepairActions.map((action, index) => (
                    <article key={action.title}>
                      <span>{index + 1}</span>
                      <strong>{action.title}</strong>
                      <p>{action.text}</p>
                    </article>
                  ))}
                </div>
              </section>
              <section className="m4-participation-micro" aria-labelledby="m4-participation-micro-title">
                <p className="m4-card-kicker">Micro-check</p>
                <h2 id="m4-participation-micro-title">Which statement best captures the HRBA lesson from this screen?</h2>
                <div className="m4-participation-micro-options">
                  {participationMicroOptions.map((option) => {
                    const selected = microAnswer === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`m4-participation-micro-option ${selected ? 'is-selected' : ''} ${selected && option.correct ? 'is-correct' : ''}`}
                        onClick={() => chooseMicro(option.id)}
                        aria-pressed={selected}
                      >
                        <span>{option.id}</span>
                        <strong>{option.text}</strong>
                      </button>
                    );
                  })}
                </div>
                {selectedMicro && (
                  <p className="m4-participation-micro-feedback">
                    <strong>{selectedMicro.id} — {selectedMicro.correct ? 'Correct.' : selectedMicro.feedback.split('.')[0] + '.'}</strong>{' '}
                    {selectedMicro.correct ? selectedMicro.feedback.replace('Correct. ', '') : selectedMicro.feedback.split('.').slice(1).join('.').trim()}
                  </p>
                )}
              </section>
              <article className="m4-participation-synthesis">
                <p>
                  Participation is not a launch activity. It is a delivery practice. A rights-based project keeps
                  asking who can still take part, who is becoming quieter or absent, whose input shapes adjustments,
                  and whether the team reports back.
                </p>
                <PrimaryButton
                  disabled={!canContinue}
                  onClick={() =>
                    completeScreen(
                      'M4-S1-05',
                      'M4-S1-06',
                      module4Routes['M4-S1-06'],
                      onChangeState,
                      'module4Screen6ParticipationDelivery',
                      {
                        cycleDiagnoses: answers,
                        submitted: true,
                        feedbackType: feedback.type,
                        microAnswer,
                        completed: true,
                      },
                    )
                  }
                >
                  {canContinue ? 'Continue' : 'Complete the participation cycle to continue'}
                </PrimaryButton>
              </article>
            </>
          ) : (
            <article className="m4-participation-locked">
              <p>Diagnose all five steps and submit the cycle to reveal repair actions and the micro-check.</p>
              <PrimaryButton disabled onClick={() => undefined}>
                Complete the participation cycle to continue
              </PrimaryButton>
            </article>
          )}
        </aside>
      </section>
    </main>
  );
}

function Module4InclusiveDeliveryScreen({ state, onChangeState }: Module4RendererProps) {
  const stored = state.practiceCheckState.module4Screen7InclusiveDelivery || {};
  const [activeId, setActiveId] = useState<string>((stored.activeBarrierId as string) || inclusiveDeliveryBarriers[0].id);
  const [answers, setAnswers] = useState<Record<string, string>>(
    (stored.barrierMatches as Record<string, string>) || {},
  );
  const [microAnswer, setMicroAnswer] = useState<string>((stored.microAnswer as string) || '');

  const activeBarrier = inclusiveDeliveryBarriers.find((barrier) => barrier.id === activeId) || inclusiveDeliveryBarriers[0];
  const selectedChoiceId = answers[activeBarrier.id] || '';
  const selectedChoice = activeBarrier.choices.find((choice) => choice.id === selectedChoiceId);
  const repairedCount = inclusiveDeliveryBarriers.filter((barrier) => answers[barrier.id]).length;
  const allRepaired = repairedCount === inclusiveDeliveryBarriers.length;
  const selectedMicro = inclusiveDeliveryMicroOptions.find((option) => option.id === microAnswer);
  const canContinue = allRepaired && Boolean(microAnswer);

  const persist = (patch: Record<string, unknown>, markComplete = false) => {
    onChangeState((prev) => ({
      ...prev,
      screenProgress: markComplete ? addProgress(prev, 'M4-S1-06') : prev.screenProgress,
      practiceCheckState: updatePracticeState(prev, 'module4Screen7InclusiveDelivery', patch),
    }));
  };

  const chooseAdjustment = (barrierId: string, choiceId: string) => {
    const next = { ...answers, [barrierId]: choiceId };
    setAnswers(next);
    persist({
      activeBarrierId: barrierId,
      barrierMatches: next,
      microAnswer,
      completed: Boolean(microAnswer) && inclusiveDeliveryBarriers.every((barrier) => next[barrier.id]),
    });
  };

  const chooseMicro = (optionId: string) => {
    setMicroAnswer(optionId);
    persist(
      {
        activeBarrierId: activeId,
        barrierMatches: answers,
        microAnswer: optionId,
        completed: allRepaired,
      },
      allRepaired,
    );
  };

  return (
    <main className="m4-screen m4-inclusive-screen" aria-labelledby="m4-inclusive-title">
      <section className="m4-inclusive-shell">
        <aside className="m4-inclusive-story">
          <div>
            <ModuleContextLabel>MODULE 4 · APPLYING HRBA DURING IMPLEMENTATION</ModuleContextLabel>
            <h1 id="m4-inclusive-title">Inclusive Delivery: Equal Invitation Is Not Equal Access</h1>
          </div>
          <p>A project can be open to everyone on paper but still difficult for some people to use in practice.</p>
          <strong>Equal invitation is not the same as equal access.</strong>
          <article className="m4-inclusive-scenario">
            <p>
              A CSO is delivering a community training series on livelihood support. The team announces the
              sessions through local representatives and posts the schedule at the meeting place.
            </p>
            <ul>
              <li>people from distant kebeles arrive late or miss the session;</li>
              <li>women with care responsibilities leave early;</li>
              <li>a participant with a mobility impairment sits outside because the room is crowded;</li>
              <li>some participants do not ask questions because the language is too technical;</li>
              <li>younger participants say privately that the same people always receive information first.</li>
            </ul>
            <p>The activity is happening. The issue is whether different people can actually access it.</p>
          </article>
          <div className="m4-inclusive-bridge" aria-label="Equal invitation is not equal access">
            <span>Same invitation</span>
            <strong aria-hidden="true">→</strong>
            <span>Real access</span>
          </div>
        </aside>

        <section className="m4-inclusive-builder" aria-labelledby="m4-inclusive-builder-title">
          <div className="m4-inclusive-builder-head">
            <div>
              <p className="m4-card-kicker">Barrier-to-adjustment matching</p>
              <h2 id="m4-inclusive-builder-title">Match each barrier with the strongest practical adjustment.</h2>
            </div>
            <span role="status" aria-live="polite">{repairedCount} of 5 delivery barriers repaired</span>
          </div>
          <div className="m4-inclusive-tabs" role="tablist" aria-label="Delivery barriers">
            {inclusiveDeliveryBarriers.map((barrier) => {
              const active = barrier.id === activeBarrier.id;
              const done = Boolean(answers[barrier.id]);
              return (
                <button
                  key={barrier.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`m4-inclusive-tab ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
                  onClick={() => {
                    setActiveId(barrier.id);
                    persist({ activeBarrierId: barrier.id, barrierMatches: answers, microAnswer });
                  }}
                >
                  <span>{done ? '✓' : barrier.number}</span>
                  <strong>{barrier.title}</strong>
                </button>
              );
            })}
          </div>

          <article className="m4-inclusive-match-card" role="tabpanel">
            <p className="m4-card-kicker">Barrier {activeBarrier.number}</p>
            <h3>{activeBarrier.title}</h3>
            <p>{activeBarrier.barrier}</p>
            <div className="m4-inclusive-choice-grid">
              {activeBarrier.choices.map((choice) => {
                const selected = selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    className={`m4-inclusive-choice ${selected ? 'is-selected' : ''} ${selected && choice.correct ? 'is-correct' : ''}`}
                    onClick={() => chooseAdjustment(activeBarrier.id, choice.id)}
                    aria-pressed={selected}
                  >
                    <span>{choice.id}</span>
                    <strong>{choice.text}</strong>
                  </button>
                );
              })}
            </div>
            <div className="m4-inclusive-feedback" aria-live="polite">
              {selectedChoice ? (
                <p>
                  <strong>{selectedChoice.id} — {selectedChoice.correct ? 'Strongest.' : selectedChoice.feedback.split('.')[0] + '.'}</strong>{' '}
                  {selectedChoice.correct
                    ? selectedChoice.feedback.replace('Strongest. ', '')
                    : selectedChoice.feedback.split('.').slice(1).join('.').trim()}
                </p>
              ) : (
                <p>Select one adjustment to see feedback for this delivery barrier.</p>
              )}
            </div>
          </article>
        </section>

        <aside className="m4-inclusive-response" aria-live="polite">
          {allRepaired ? (
            <>
              <article className="m4-inclusive-synthesis">
                <p className="m4-card-kicker">What this tells us</p>
                <p>
                  Inclusive delivery means checking whether people can actually use the activity — not only
                  whether they were invited.
                </p>
                <p>
                  During implementation, CSOs should look for practical barriers linked to timing, location,
                  cost, language, accessibility, safety, information flow, workload, and power.
                </p>
                <strong>
                  A rights-based adjustment does not need to be perfect. It should be timely, practical, safe,
                  and based on who is being missed or blocked.
                </strong>
              </article>
              <section className="m4-inclusive-micro" aria-labelledby="m4-inclusive-micro-title">
                <p className="m4-card-kicker">Micro-check</p>
                <h2 id="m4-inclusive-micro-title">Which statement best captures the HRBA lesson from this screen?</h2>
                <div className="m4-inclusive-micro-options">
                  {inclusiveDeliveryMicroOptions.map((option) => {
                    const selected = microAnswer === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`m4-inclusive-micro-option ${selected ? 'is-selected' : ''} ${selected && option.correct ? 'is-correct' : ''}`}
                        onClick={() => chooseMicro(option.id)}
                        aria-pressed={selected}
                      >
                        <span>{option.id}</span>
                        <strong>{option.text}</strong>
                      </button>
                    );
                  })}
                </div>
                {selectedMicro && (
                  <p className="m4-inclusive-micro-feedback">
                    <strong>{selectedMicro.id} — {selectedMicro.correct ? 'Correct.' : selectedMicro.feedback.split('.')[0] + '.'}</strong>{' '}
                    {selectedMicro.correct
                      ? selectedMicro.feedback.replace('Correct. ', '')
                      : selectedMicro.feedback.split('.').slice(1).join('.').trim()}
                  </p>
                )}
              </section>
              <article className="m4-inclusive-close">
                <p>
                  When implementation begins, barriers become visible. HRBA asks the CSO to notice them early
                  and adjust delivery so participation and benefit are realistic for different people.
                </p>
                <PrimaryButton
                  disabled={!canContinue}
                  onClick={() =>
                    completeScreen(
                      'M4-S1-06',
                      'M4-S1-07',
                      module4Routes['M4-S1-07'],
                      onChangeState,
                      'module4Screen7InclusiveDelivery',
                      {
                        barrierMatches: answers,
                        microAnswer,
                        completed: true,
                      },
                    )
                  }
                >
                  Continue
                </PrimaryButton>
              </article>
            </>
          ) : (
            <article className="m4-inclusive-locked">
              <p>Repair all five delivery barriers to reveal the synthesis and micro-check.</p>
              <PrimaryButton disabled onClick={() => undefined}>
                Continue
              </PrimaryButton>
            </article>
          )}
        </aside>
      </section>
    </main>
  );
}

function Module4FeedbackAccountabilityScreen({ state, onChangeState }: Module4RendererProps) {
  const stored = state.practiceCheckState.module4Screen8FeedbackAccountability || {};
  const [activeId, setActiveId] = useState<string>((stored.activeRepairId as string) || feedbackRepairCards[0].id);
  const [answers, setAnswers] = useState<Record<string, string>>(
    (stored.repairActions as Record<string, string>) || {},
  );
  const [microAnswer, setMicroAnswer] = useState<string>((stored.microAnswer as string) || '');

  const activeRepair = feedbackRepairCards.find((card) => card.id === activeId) || feedbackRepairCards[0];
  const selectedChoiceId = answers[activeRepair.id] || '';
  const selectedChoice = activeRepair.choices.find((choice) => choice.id === selectedChoiceId);
  const completedCount = feedbackRepairCards.filter((card) => answers[card.id]).length;
  const allComplete = completedCount === feedbackRepairCards.length;
  const selectedMicro = feedbackAccountabilityMicroOptions.find((option) => option.id === microAnswer);
  const canContinue = allComplete && Boolean(microAnswer);

  const persist = (patch: Record<string, unknown>, markComplete = false) => {
    onChangeState((prev) => ({
      ...prev,
      screenProgress: markComplete ? addProgress(prev, 'M4-S1-07') : prev.screenProgress,
      practiceCheckState: updatePracticeState(prev, 'module4Screen8FeedbackAccountability', patch),
    }));
  };

  const chooseRepair = (repairId: string, choiceId: string) => {
    const next = { ...answers, [repairId]: choiceId };
    setAnswers(next);
    persist({
      activeRepairId: repairId,
      repairActions: next,
      microAnswer,
      completed: Boolean(microAnswer) && feedbackRepairCards.every((card) => next[card.id]),
    });
  };

  const chooseMicro = (optionId: string) => {
    setMicroAnswer(optionId);
    persist(
      {
        activeRepairId: activeId,
        repairActions: answers,
        microAnswer: optionId,
        completed: allComplete,
      },
      allComplete,
    );
  };

  return (
    <main className="m4-screen m4-feedback-screen" aria-labelledby="m4-feedback-title">
      <section className="m4-feedback-shell">
        <aside className="m4-feedback-story">
          <div>
            <ModuleContextLabel>MODULE 4 · APPLYING HRBA DURING IMPLEMENTATION</ModuleContextLabel>
            <h1 id="m4-feedback-title">Feedback Becomes Accountability Only When There Is Response</h1>
          </div>
          <p>
            A feedback box, hotline, meeting, or field visit can help people raise concerns. But collecting
            feedback is not the same as accountability.
          </p>
          <strong>
            Accountability becomes real when a CSO listens, reviews patterns, responds safely, follows up, and
            adapts where needed.
          </strong>
          <article className="m4-feedback-scenario">
            <h2>Scenario: The feedback is coming in — but people are still unsure</h2>
            <p>
              A local CSO is delivering livelihood support. It has three feedback channels: a phone number,
              a suggestion box, and field staff visits.
            </p>
            <ul>
              <li>participants do not understand why they were not selected for extra support;</li>
              <li>payment dates and next steps are unclear;</li>
              <li>some women prefer not to raise concerns through the local committee;</li>
              <li>several people gave feedback but never heard what happened afterward.</li>
            </ul>
            <p>The team recorded comments, but there is no clear process for reviewing, responding, or explaining what changed.</p>
          </article>
          <div className="m4-feedback-loop" aria-label="Accountability loop">
            <span>Listen</span>
            <span>Review</span>
            <span>Respond</span>
            <span>Follow up</span>
            <span>Adapt</span>
          </div>
        </aside>

        <section className="m4-feedback-builder" aria-labelledby="m4-feedback-builder-title">
          <div className="m4-feedback-builder-head">
            <div>
              <p className="m4-card-kicker">Repair the feedback loop</p>
              <h2 id="m4-feedback-builder-title">Select the strongest repair action for each part of the accountability loop.</h2>
            </div>
            <span role="status" aria-live="polite">{completedCount} of 5 repair actions completed</span>
          </div>

          <div className="m4-feedback-tabs" role="tablist" aria-label="Feedback loop repair actions">
            {feedbackRepairCards.map((card) => {
              const active = card.id === activeRepair.id;
              const done = Boolean(answers[card.id]);
              return (
                <button
                  key={card.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`m4-feedback-tab ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
                  onClick={() => {
                    setActiveId(card.id);
                    persist({ activeRepairId: card.id, repairActions: answers, microAnswer });
                  }}
                >
                  <span>{done ? '✓' : card.number}</span>
                  <strong>{card.title}</strong>
                </button>
              );
            })}
          </div>

          <article className="m4-feedback-repair-card" role="tabpanel">
            <p className="m4-card-kicker">Repair card {activeRepair.number}</p>
            <h3>{activeRepair.title}</h3>
            <p><strong>Broken step:</strong> {activeRepair.brokenStep}</p>
            <p>{activeRepair.question}</p>
            <div className="m4-feedback-choice-grid" role="radiogroup" aria-label={activeRepair.question}>
              {activeRepair.choices.map((choice) => {
                const selected = selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`m4-feedback-choice ${selected ? 'is-selected' : ''} ${selected && choice.correct ? 'is-correct' : ''}`}
                    onClick={() => chooseRepair(activeRepair.id, choice.id)}
                  >
                    <span>{choice.id}</span>
                    <strong>{choice.text}</strong>
                  </button>
                );
              })}
            </div>
            <div className="m4-feedback-feedback" aria-live="polite">
              {selectedChoice ? (
                <p>
                  <strong>{selectedChoice.id} — {selectedChoice.correct ? 'Strongest.' : selectedChoice.feedback.split('.')[0] + '.'}</strong>{' '}
                  {selectedChoice.correct
                    ? selectedChoice.feedback.replace('Strongest. ', '')
                    : selectedChoice.feedback.split('.').slice(1).join('.').trim()}
                </p>
              ) : (
                <p>Select one repair action to see option-specific feedback.</p>
              )}
            </div>
          </article>
        </section>

        <aside className="m4-feedback-response" aria-live="polite">
          {allComplete ? (
            <>
              <article className="m4-feedback-synthesis">
                <p className="m4-card-kicker">What makes feedback accountable?</p>
                <p>A feedback system becomes accountable when it has a complete loop:</p>
                <ol>
                  <li>people know how to raise concerns;</li>
                  <li>channels are safe and accessible;</li>
                  <li>feedback is reviewed for patterns and risks;</li>
                  <li>the CSO responds clearly and respectfully;</li>
                  <li>the team follows up and adapts where possible.</li>
                </ol>
                <strong>Accountability is not only collecting concerns. It is closing the loop with a safe, useful, and timely response.</strong>
              </article>
              <section className="m4-feedback-micro" aria-labelledby="m4-feedback-micro-title">
                <p className="m4-card-kicker">Micro-check</p>
                <h2 id="m4-feedback-micro-title">Which statement best summarizes the screen?</h2>
                <div className="m4-feedback-micro-options" role="radiogroup" aria-label="Feedback accountability micro-check">
                  {feedbackAccountabilityMicroOptions.map((option) => {
                    const selected = microAnswer === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`m4-feedback-micro-option ${selected ? 'is-selected' : ''} ${selected && option.correct ? 'is-correct' : ''}`}
                        onClick={() => chooseMicro(option.id)}
                      >
                        <span>{option.id}</span>
                        <strong>{option.text}</strong>
                      </button>
                    );
                  })}
                </div>
                {selectedMicro && (
                  <p className="m4-feedback-micro-feedback" aria-live="polite">
                    <strong>{selectedMicro.id} — {selectedMicro.correct ? 'Correct.' : selectedMicro.feedback.split('.')[0] + '.'}</strong>{' '}
                    {selectedMicro.correct
                      ? selectedMicro.feedback.replace('Correct. ', '')
                      : selectedMicro.feedback.split('.').slice(1).join('.').trim()}
                  </p>
                )}
              </section>
              <article className="m4-feedback-close">
                <p>
                  During implementation, feedback is one of the clearest signals that HRBA is either alive or
                  weakening. A strong CSO does not only collect concerns; it responds, follows up, learns, and
                  adapts safely.
                </p>
                <PrimaryButton
                  disabled={!canContinue}
                  onClick={() =>
                    completeScreen(
                      'M4-S1-07',
                      'M4-S1-08',
                      module4Routes['M4-S1-08'],
                      onChangeState,
                      'module4Screen8FeedbackAccountability',
                      {
                        repairActions: answers,
                        microAnswer,
                        completed: true,
                      },
                    )
                  }
                >
                  Continue
                </PrimaryButton>
              </article>
            </>
          ) : (
            <article className="m4-feedback-locked">
              <p>Complete all five repair actions to reveal the accountability synthesis and micro-check.</p>
              <PrimaryButton disabled onClick={() => undefined}>
                Continue
              </PrimaryButton>
            </article>
          )}
        </aside>
      </section>
    </main>
  );
}

function Module4ActorEngagementScreen({ state, onChangeState }: Module4RendererProps) {
  const stored = state.practiceCheckState.module4Screen9ActorEngagement || {};
  const [activeId, setActiveId] = useState<string>(
    (stored.activeActorCardId as string) || actorEngagementCards[0].id,
  );
  const [selectedActorResponses, setSelectedActorResponses] = useState<Record<string, string>>(
    (stored.selectedActorResponses as Record<string, string>) || {},
  );
  const [microCheckAnswer, setMicroCheckAnswer] = useState<string>(
    (stored.microCheckAnswer as string) || '',
  );

  const activeCard = actorEngagementCards.find((card) => card.id === activeId) || actorEngagementCards[0];
  const selectedChoiceId = selectedActorResponses[activeCard.id] || '';
  const selectedChoice = activeCard.choices.find((choice) => choice.id === selectedChoiceId);
  const completedActorCards = actorEngagementCards
    .filter((card) => selectedActorResponses[card.id])
    .map((card) => card.id);
  const allCardsComplete = completedActorCards.length === actorEngagementCards.length;
  const selectedMicro = actorEngagementMicroOptions.find((option) => option.id === microCheckAnswer);
  const canContinue = allCardsComplete && Boolean(microCheckAnswer);

  const persist = (patch: Record<string, unknown>, markComplete = false) => {
    onChangeState((prev) => ({
      ...prev,
      screenProgress: markComplete ? addProgress(prev, 'M4-S1-08') : prev.screenProgress,
      practiceCheckState: updatePracticeState(prev, 'module4Screen9ActorEngagement', patch),
    }));
  };

  const chooseActorResponse = (cardId: string, choiceId: string) => {
    const nextResponses = { ...selectedActorResponses, [cardId]: choiceId };
    const nextCompletedCards = actorEngagementCards
      .filter((card) => nextResponses[card.id])
      .map((card) => card.id);
    setSelectedActorResponses(nextResponses);
    persist({
      activeActorCardId: cardId,
      completedActorCards: nextCompletedCards,
      selectedActorResponses: nextResponses,
      microCheckAnswer: microCheckAnswer || null,
      screenCompleted: nextCompletedCards.length === 4 && Boolean(microCheckAnswer),
    });
  };

  const chooseMicro = (optionId: string) => {
    setMicroCheckAnswer(optionId);
    persist(
      {
        activeActorCardId: activeId,
        completedActorCards,
        selectedActorResponses,
        microCheckAnswer: optionId,
        screenCompleted: allCardsComplete,
      },
      allCardsComplete,
    );
  };

  return (
    <main className="m4-screen m4-actor-screen" aria-labelledby="m4-actor-title">
      <section className="m4-feedback-shell m4-actor-shell">
        <aside className="m4-feedback-story m4-actor-story">
          <div>
            <ModuleContextLabel>MODULE 4 · IMPLEMENTATION PRACTICE</ModuleContextLabel>
            <h1 id="m4-actor-title">Engage Actors Without Blame, Capture, or Confusion</h1>
          </div>
          <p className="m4-actor-subtitle">Work with influence carefully during delivery.</p>
          <p>
            During implementation, CSOs often depend on local actors: public offices, service providers,
            community leaders, committees, volunteers, and informal influencers.
          </p>
          <strong>
            Choose safer ways to engage actors while keeping rights-holders, responsibilities, and fairness visible.
          </strong>
          <article className="m4-feedback-scenario m4-actor-scenario">
            <h2>Scenario: The selection list is being questioned</h2>
            <p>
              A CSO is implementing livelihood support for households affected by repeated shocks. The team
              agreed to use clear selection criteria and a community verification process.
            </p>
            <p>
              During delivery, the kebele focal person and two committee members begin sending names directly
              to the CSO team. Quieter households and newer arrivals say privately that they do not understand
              how the final list was decided.
            </p>
            <p>
              The focal person is important for coordination, and the committee has local knowledge. But the
              team sees a risk that the process may become controlled by a few influential actors.
            </p>
          </article>
          <div className="m4-actor-map" aria-label="Actor engagement map">
            <span>Rights-holders</span>
            <span>CSO</span>
            <span>Local actors</span>
            <span>Public office</span>
            <span>Response route</span>
          </div>
        </aside>

        <section className="m4-feedback-builder m4-actor-builder" aria-labelledby="m4-actor-builder-title">
          <div className="m4-feedback-builder-head">
            <div>
              <p className="m4-card-kicker">Actor engagement repair cards</p>
              <h2 id="m4-actor-builder-title">Review each actor-engagement choice and select the strongest response.</h2>
            </div>
            <span role="status" aria-live="polite">{completedActorCards.length} of 4 actor challenges completed</span>
          </div>

          <div className="m4-feedback-tabs m4-actor-tabs" role="tablist" aria-label="Actor engagement repair cards">
            {actorEngagementCards.map((card) => {
              const active = card.id === activeCard.id;
              const done = Boolean(selectedActorResponses[card.id]);
              return (
                <button
                  key={card.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`m4-feedback-tab m4-actor-tab ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
                  onClick={() => {
                    setActiveId(card.id);
                    persist({
                      activeActorCardId: card.id,
                      completedActorCards,
                      selectedActorResponses,
                      microCheckAnswer: microCheckAnswer || null,
                    });
                  }}
                >
                  <span>{done ? '✓' : card.number}</span>
                  <strong>{card.title}</strong>
                </button>
              );
            })}
          </div>

          <article className="m4-feedback-repair-card m4-actor-repair-card" role="tabpanel">
            <p className="m4-card-kicker">Actor challenge {activeCard.number}</p>
            <h3>{activeCard.title}</h3>
            <p><strong>Challenge:</strong> {activeCard.brokenStep}</p>
            <p>{activeCard.question}</p>
            <div className="m4-feedback-choice-grid" role="radiogroup" aria-label={activeCard.question}>
              {activeCard.choices.map((choice) => {
                const selected = selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`m4-feedback-choice ${selected ? 'is-selected' : ''} ${selected && choice.correct ? 'is-correct' : ''}`}
                    onClick={() => chooseActorResponse(activeCard.id, choice.id)}
                  >
                    <span>{choice.id}</span>
                    <strong>{choice.text}</strong>
                  </button>
                );
              })}
            </div>
            <div className="m4-feedback-feedback" aria-live="polite">
              {selectedChoice ? (
                <p>
                  <strong>{selectedChoice.id} — {selectedChoice.correct ? 'Strongest.' : selectedChoice.feedback.split('.')[0] + '.'}</strong>{' '}
                  {selectedChoice.correct
                    ? selectedChoice.feedback.replace('Strongest. ', '')
                    : selectedChoice.feedback.split('.').slice(1).join('.').trim()}
                </p>
              ) : (
                <p>Select one response to see option-specific feedback for this actor challenge.</p>
              )}
            </div>
          </article>
        </section>

        <aside className="m4-feedback-response m4-actor-response" aria-live="polite">
          {allCardsComplete ? (
            <>
              <article className="m4-feedback-synthesis m4-actor-synthesis">
                <p className="m4-card-kicker">Actor engagement is a balancing task.</p>
                <p>
                  A rights-based CSO does not avoid powerful actors, and it does not hand the process over to
                  them. It works with actors carefully: using their knowledge, clarifying responsibilities,
                  protecting fair access, widening voice, and keeping response pathways visible.
                </p>
                <ul>
                  <li><strong>Use influence, but do not let it control the process.</strong></li>
                  <li><strong>Clarify responsibility before expectations become confused.</strong></li>
                  <li><strong>Protect quieter rights-holders from being hidden by efficient actors.</strong></li>
                </ul>
              </article>
              <section className="m4-feedback-micro m4-actor-micro" aria-labelledby="m4-actor-micro-title">
                <p className="m4-card-kicker">Micro-check</p>
                <h2 id="m4-actor-micro-title">Which sentence best captures the HRBA implementation lesson from this screen?</h2>
                <div className="m4-feedback-micro-options" role="radiogroup" aria-label="Actor engagement micro-check">
                  {actorEngagementMicroOptions.map((option) => {
                    const selected = microCheckAnswer === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`m4-feedback-micro-option ${selected ? 'is-selected' : ''} ${selected && option.correct ? 'is-correct' : ''}`}
                        onClick={() => chooseMicro(option.id)}
                      >
                        <span>{option.id}</span>
                        <strong>{option.text}</strong>
                      </button>
                    );
                  })}
                </div>
                {selectedMicro && (
                  <p className="m4-feedback-micro-feedback" aria-live="polite">
                    <strong>{selectedMicro.id} — {selectedMicro.correct ? 'Correct.' : selectedMicro.feedback.split('.')[0] + '.'}</strong>{' '}
                    {selectedMicro.correct
                      ? selectedMicro.feedback.replace('Correct. ', '')
                      : selectedMicro.feedback.split('.').slice(1).join('.').trim()}
                  </p>
                )}
              </section>
              <article className="m4-feedback-close m4-actor-close">
                <p>
                  During implementation, relationships matter. HRBA helps the CSO work with influence without
                  losing fairness, clarity, accountability, or the voices of people who are easier to miss.
                </p>
                <PrimaryButton
                  disabled={!canContinue}
                  onClick={() =>
                    completeScreen(
                      'M4-S1-08',
                      'M4-S1-09',
                      module4Routes['M4-S1-09'],
                      onChangeState,
                      'module4Screen9ActorEngagement',
                      {
                        completedActorCards,
                        selectedActorResponses,
                        microCheckAnswer,
                        screenCompleted: true,
                      },
                    )
                  }
                >
                  Continue
                </PrimaryButton>
              </article>
            </>
          ) : (
            <article className="m4-feedback-locked m4-actor-locked">
              <p>Complete all four actor challenges to reveal the synthesis and micro-check.</p>
              <PrimaryButton disabled onClick={() => undefined}>
                Continue
              </PrimaryButton>
            </article>
          )}
        </aside>
      </section>
    </main>
  );
}

function Module4AdaptationLabScreen({ state, onChangeState }: Module4RendererProps) {
  const stored = state.practiceCheckState.m4s10_adaptationDecisions || {};
  const [activeId, setActiveId] = useState<string>(
    (stored.activeAdaptationCardId as string) || adaptationDecisionCards[0].id,
  );
  const [decisions, setDecisions] = useState<Record<string, string>>({
    accessSignal: (stored.accessSignal as string) || '',
    careTimingSignal: (stored.careTimingSignal as string) || '',
    informationAccountabilitySignal: (stored.informationAccountabilitySignal as string) || '',
    powerCaptureSignal: (stored.powerCaptureSignal as string) || '',
  });
  const [microCheck, setMicroCheck] = useState<string>((stored.microCheck as string) || '');

  const activeCard = adaptationDecisionCards.find((card) => card.id === activeId) || adaptationDecisionCards[0];
  const selectedChoiceId = decisions[activeCard.stateKey] || '';
  const selectedChoice = activeCard.choices.find((choice) => choice.id === selectedChoiceId);
  const completedCount = adaptationDecisionCards.filter((card) => decisions[card.stateKey]).length;
  const allCardsComplete = completedCount === adaptationDecisionCards.length;
  const selectedMicro = adaptationMicroOptions.find((option) => option.id === microCheck);
  const canContinue = allCardsComplete && Boolean(microCheck);

  const persist = (patch: Record<string, unknown>, markComplete = false) => {
    onChangeState((prev) => ({
      ...prev,
      screenProgress: markComplete ? addProgress(prev, 'M4-S1-09') : prev.screenProgress,
      practiceCheckState: updatePracticeState(prev, 'm4s10_adaptationDecisions', patch),
    }));
  };

  const chooseDecision = (card: AdaptationDecisionCard, choiceId: string) => {
    const nextDecisions = { ...decisions, [card.stateKey]: choiceId };
    setDecisions(nextDecisions);
    persist({
      activeAdaptationCardId: card.id,
      ...nextDecisions,
      microCheck,
      completed: adaptationDecisionCards.every((item) => nextDecisions[item.stateKey]) && Boolean(microCheck),
    });
  };

  const chooseMicro = (optionId: string) => {
    setMicroCheck(optionId);
    persist(
      {
        activeAdaptationCardId: activeId,
        ...decisions,
        microCheck: optionId,
        completed: allCardsComplete,
      },
      allCardsComplete,
    );
  };

  return (
    <main className="m4-screen m4-adaptation-screen" aria-labelledby="m4-adaptation-title">
      <section className="m4-feedback-shell m4-adaptation-shell">
        <aside className="m4-feedback-story m4-adaptation-story">
          <div>
            <ModuleContextLabel>MODULE 4 · IMPLEMENTATION ADAPTATION LAB</ModuleContextLabel>
            <h1 id="m4-adaptation-title">Adapt the Project Without Doing Harm</h1>
          </div>
          <p className="m4-actor-subtitle">When implementation evidence changes, the project may need to change too.</p>
          <p>
            A project plan is not rights-based only because it was well designed. During implementation, teams
            must keep watching who is being reached, who is slipping out, what risks are emerging, and what
            needs to change safely.
          </p>
          <article className="m4-feedback-scenario m4-adaptation-scenario">
            <h2>Scenario: The sessions are running, but the pattern has changed</h2>
            <p>
              A CSO is delivering community livelihood sessions in three kebeles. The original plan was to run
              the same weekly group sessions for all participants.
            </p>
            <ul>
              <li>attendance from one distant kebele is falling;</li>
              <li>women with care responsibilities arrive late or leave early;</li>
              <li>newer participants do not understand how follow-up support will be prioritized;</li>
              <li>a local committee member is informally telling people who should receive the next support package;</li>
              <li>field staff are unsure whether changing the plan will look like poor performance in the donor report.</li>
            </ul>
            <p>The team needs to decide how to adapt without creating new harm.</p>
          </article>
          <div className="m4-adaptation-radar" aria-label="Safe adaptation checks">
            <span>Evidence</span>
            <span>Safety</span>
            <span>Inclusion</span>
            <span>Accountability</span>
            <span>Document why</span>
          </div>
        </aside>

        <section className="m4-feedback-builder m4-adaptation-builder" aria-labelledby="m4-adaptation-builder-title">
          <div className="m4-feedback-builder-head">
            <div>
              <p className="m4-card-kicker">Adaptation decision lab</p>
              <h2 id="m4-adaptation-builder-title">Review each implementation signal and choose the safest adaptation response.</h2>
            </div>
            <span role="status" aria-live="polite">{completedCount} of 4 adaptation decisions completed</span>
          </div>

          <div className="m4-feedback-tabs m4-actor-tabs" role="tablist" aria-label="Adaptation decision cards">
            {adaptationDecisionCards.map((card) => {
              const active = card.id === activeCard.id;
              const done = Boolean(decisions[card.stateKey]);
              return (
                <button
                  key={card.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`m4-feedback-tab m4-adaptation-tab ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
                  onClick={() => {
                    setActiveId(card.id);
                    persist({ activeAdaptationCardId: card.id, ...decisions, microCheck });
                  }}
                >
                  <span>{done ? '✓' : card.number}</span>
                  <strong>{card.title}</strong>
                </button>
              );
            })}
          </div>

          <article className="m4-feedback-repair-card m4-adaptation-card" role="tabpanel">
            <p className="m4-card-kicker">Adaptation card {activeCard.number}</p>
            <h3>{activeCard.title}</h3>
            <p><strong>Signal:</strong> {activeCard.brokenStep}</p>
            <p>{activeCard.question}</p>
            <div className="m4-feedback-choice-grid" role="radiogroup" aria-label={activeCard.question}>
              {activeCard.choices.map((choice) => {
                const selected = selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`m4-feedback-choice ${selected ? 'is-selected' : ''} ${selected && choice.correct ? 'is-correct' : ''}`}
                    onClick={() => chooseDecision(activeCard, choice.id)}
                  >
                    <span>{choice.id}</span>
                    <strong>{choice.text}</strong>
                  </button>
                );
              })}
            </div>
            <div className="m4-feedback-feedback" aria-live="polite">
              {selectedChoice ? (
                <p>
                  <strong>{selectedChoice.id} — {selectedChoice.correct ? 'Correct.' : selectedChoice.feedback.split('.')[0] + '.'}</strong>{' '}
                  {selectedChoice.correct
                    ? selectedChoice.feedback.replace('Correct. ', '')
                    : selectedChoice.feedback.split('.').slice(1).join('.').trim()}
                </p>
              ) : (
                <p>Select one adaptation response to see option-specific feedback.</p>
              )}
            </div>
          </article>
        </section>

        <aside className="m4-feedback-response m4-adaptation-response" aria-live="polite">
          {allCardsComplete ? (
            <>
              <article className="m4-feedback-synthesis m4-adaptation-synthesis">
                <p className="m4-card-kicker">What safe adaptation looks like</p>
                <p>
                  Safe adaptation does not mean changing the project randomly. It means using implementation
                  evidence to make practical adjustments while protecting dignity, inclusion, accountability,
                  and safety.
                </p>
                <ol>
                  <li>respond to a real implementation signal;</li>
                  <li>check who may be affected differently;</li>
                  <li>involve affected people safely before changing the plan;</li>
                  <li>avoid blaming people for barriers they do not control;</li>
                  <li>reduce exclusion, gatekeeping, or unsafe visibility;</li>
                  <li>document the reason for the change honestly.</li>
                </ol>
              </article>
              <section className="m4-feedback-micro m4-adaptation-micro" aria-labelledby="m4-adaptation-micro-title">
                <p className="m4-card-kicker">Micro-check</p>
                <h2 id="m4-adaptation-micro-title">Which sentence best summarizes HRBA adaptation during implementation?</h2>
                <div className="m4-feedback-micro-options" role="radiogroup" aria-label="Adaptation micro-check">
                  {adaptationMicroOptions.map((option) => {
                    const selected = microCheck === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`m4-feedback-micro-option ${selected ? 'is-selected' : ''} ${selected && option.correct ? 'is-correct' : ''}`}
                        onClick={() => chooseMicro(option.id)}
                      >
                        <span>{option.id}</span>
                        <strong>{option.text}</strong>
                      </button>
                    );
                  })}
                </div>
                {selectedMicro && (
                  <p className="m4-feedback-micro-feedback" aria-live="polite">
                    <strong>{selectedMicro.id} — {selectedMicro.correct ? 'Correct.' : selectedMicro.feedback.split('.')[0] + '.'}</strong>{' '}
                    {selectedMicro.correct
                      ? selectedMicro.feedback.replace('Correct. ', '')
                      : selectedMicro.feedback.split('.').slice(1).join('.').trim()}
                  </p>
                )}
              </section>
              <article className="m4-feedback-close m4-adaptation-close">
                <p>
                  A rights-based implementation team does not defend the original plan at all costs. It watches
                  carefully, listens safely, adapts responsibly, and explains what changed and why.
                </p>
                <PrimaryButton
                  disabled={!canContinue}
                  onClick={() =>
                    completeScreen(
                      'M4-S1-09',
                      'M4-S1-10',
                      module4Routes['M4-S1-10'],
                      onChangeState,
                      'm4s10_adaptationDecisions',
                      {
                        ...decisions,
                        microCheck,
                        completed: true,
                      },
                    )
                  }
                >
                  Continue
                </PrimaryButton>
              </article>
            </>
          ) : (
            <article className="m4-feedback-locked m4-adaptation-locked">
              <p>Complete all four adaptation decisions to reveal the synthesis and micro-check.</p>
              <PrimaryButton disabled onClick={() => undefined}>
                Continue
              </PrimaryButton>
            </article>
          )}
        </aside>
      </section>
    </main>
  );
}

function Module4PortfolioCheckpointScreen({ state, onChangeState }: Module4RendererProps) {
  const stored = state.practiceCheckState.module4PortfolioCheckpoint || {};
  const savedPortfolio = state.practiceCheckState.module4Portfolio || {};
  const [activeFieldId, setActiveFieldId] = useState<PortfolioField['id']>(
    (stored.activeFieldId as PortfolioField['id']) || module4PortfolioFields[0].id,
  );
  const [values, setValues] = useState<Record<PortfolioField['id'], string>>({
    warningSignal: (stored.warningSignal as string) || (savedPortfolio.warningSignal as string) || '',
    affectedDifferently: (stored.affectedDifferently as string) || (savedPortfolio.affectedDifferently as string) || '',
    mainBarrier: (stored.mainBarrier as string) || (savedPortfolio.mainBarrier as string) || '',
    safeAdjustment: (stored.safeAdjustment as string) || (savedPortfolio.safeAdjustment as string) || '',
    accountabilityDocumentation:
      (stored.accountabilityDocumentation as string) || (savedPortfolio.accountabilityDocumentation as string) || '',
  });
  const [customInputs, setCustomInputs] = useState<Record<PortfolioField['id'], string>>({
    warningSignal: (stored.customWarningSignal as string) || '',
    affectedDifferently: (stored.customAffectedDifferently as string) || '',
    mainBarrier: (stored.customMainBarrier as string) || '',
    safeAdjustment: (stored.customSafeAdjustment as string) || '',
    accountabilityDocumentation: (stored.customAccountabilityDocumentation as string) || '',
  });
  const [customActive, setCustomActive] = useState<Record<PortfolioField['id'], boolean>>({
    warningSignal: Boolean(stored.customWarningSignalActive),
    affectedDifferently: Boolean(stored.customAffectedDifferentlyActive),
    mainBarrier: Boolean(stored.customMainBarrierActive),
    safeAdjustment: Boolean(stored.customSafeAdjustmentActive),
    accountabilityDocumentation: Boolean(stored.customAccountabilityDocumentationActive),
  });
  const [saved, setSaved] = useState<boolean>(savedPortfolio.status === 'saved' || stored.status === 'saved');

  const activeField = module4PortfolioFields.find((field) => field.id === activeFieldId) || module4PortfolioFields[0];
  const completedCount = module4PortfolioFields.filter((field) => values[field.id].trim()).length;
  const allComplete = completedCount === module4PortfolioFields.length;

  const checkpointPatch = (
    nextValues = values,
    nextCustomInputs = customInputs,
    nextCustomActive = customActive,
    nextActiveFieldId = activeFieldId,
    nextSaved = saved,
  ) => ({
    activeFieldId: nextActiveFieldId,
    ...nextValues,
    customWarningSignal: nextCustomInputs.warningSignal,
    customAffectedDifferently: nextCustomInputs.affectedDifferently,
    customMainBarrier: nextCustomInputs.mainBarrier,
    customSafeAdjustment: nextCustomInputs.safeAdjustment,
    customAccountabilityDocumentation: nextCustomInputs.accountabilityDocumentation,
    customWarningSignalActive: nextCustomActive.warningSignal,
    customAffectedDifferentlyActive: nextCustomActive.affectedDifferently,
    customMainBarrierActive: nextCustomActive.mainBarrier,
    customSafeAdjustmentActive: nextCustomActive.safeAdjustment,
    customAccountabilityDocumentationActive: nextCustomActive.accountabilityDocumentation,
    status: nextSaved ? 'saved' : 'draft',
  });

  const persistDraft = (
    nextValues = values,
    nextCustomInputs = customInputs,
    nextCustomActive = customActive,
    nextActiveFieldId = activeFieldId,
    nextSaved = saved,
  ) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(
        prev,
        'module4PortfolioCheckpoint',
        checkpointPatch(nextValues, nextCustomInputs, nextCustomActive, nextActiveFieldId, nextSaved),
      ),
    }));
  };

  const selectOption = (field: PortfolioField, option: string) => {
    const nextValues = { ...values, [field.id]: option };
    const nextCustomActive = { ...customActive, [field.id]: false };
    setValues(nextValues);
    setCustomActive(nextCustomActive);
    setSaved(false);
    persistDraft(nextValues, customInputs, nextCustomActive, field.id, false);
  };

  const updateCustom = (field: PortfolioField, value: string) => {
    const nextCustomInputs = { ...customInputs, [field.id]: value };
    const nextCustomActive = { ...customActive, [field.id]: true };
    const nextValues = { ...values, [field.id]: value };
    setCustomInputs(nextCustomInputs);
    setCustomActive(nextCustomActive);
    setValues(nextValues);
    setSaved(false);
    persistDraft(nextValues, nextCustomInputs, nextCustomActive, field.id, false);
  };

  const activateCustom = (field: PortfolioField) => {
    const nextCustomActive = { ...customActive, [field.id]: true };
    const nextValues = { ...values, [field.id]: customInputs[field.id] };
    setCustomActive(nextCustomActive);
    setValues(nextValues);
    setSaved(false);
    persistDraft(nextValues, customInputs, nextCustomActive, field.id, false);
  };

  const savePortfolio = () => {
    const updatedAt = new Date().toISOString();
    const module4Portfolio = {
      moduleId: 'module-4',
      portfolioTitle: 'My Safe Implementation Adjustment Note',
      warningSignal: values.warningSignal.trim(),
      affectedDifferently: values.affectedDifferently.trim(),
      mainBarrier: values.mainBarrier.trim(),
      safeAdjustment: values.safeAdjustment.trim(),
      accountabilityDocumentation: values.accountabilityDocumentation.trim(),
      safetyAcknowledged: true,
      privateByDefault: true,
      status: 'saved',
      updatedAt,
    };
    setSaved(true);
    onChangeState((prev) => ({
      ...prev,
      screenProgress: addProgress(prev, 'M4-S1-10'),
      practiceCheckState: updatePracticeState(
        {
          ...prev,
          practiceCheckState: updatePracticeState(prev, 'module4PortfolioCheckpoint', {
            ...checkpointPatch(values, customInputs, customActive, activeFieldId, true),
            savedAt: updatedAt,
          }),
        },
        'module4Portfolio',
        module4Portfolio,
      ),
    }));
  };

  const reviseNote = () => {
    setSaved(false);
    persistDraft(values, customInputs, customActive, activeFieldId, false);
  };

  return (
    <main className="m4-screen m4-portfolio-screen" aria-labelledby="m4-portfolio-title">
      <section className="m4-portfolio-shell">
        <section className="m4-portfolio-builder" aria-labelledby="m4-portfolio-title">
          <div className="m4-portfolio-heading">
            <ModuleContextLabel>MODULE 4 · PORTFOLIO CHECKPOINT</ModuleContextLabel>
            <h1 id="m4-portfolio-title">Portfolio Checkpoint: My Safe Implementation Adjustment Note</h1>
            <p>Turn an implementation warning signal into a safe, practical adjustment.</p>
          </div>

          <p className="m4-portfolio-instruction">
            You have practiced how HRBA stays alive during implementation. Now create a short implementation
            adjustment note for your portfolio.
          </p>

          <aside className="m4-portfolio-safety">
            <strong>Keep it safe and general.</strong>
            <span>
              Do not include names, active complaints, survivor details, safeguarding information, legal case
              details, confidential project data, beneficiary lists, or identifiable community information.
            </span>
          </aside>

          <div className="m4-portfolio-progress" role="status" aria-live="polite">
            {completedCount} of 5 fields completed
          </div>

          <div className="m4-portfolio-field-tabs" role="tablist" aria-label="Portfolio builder fields">
            {module4PortfolioFields.map((field) => {
              const active = field.id === activeField.id;
              const done = Boolean(values[field.id].trim());
              return (
                <button
                  key={field.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`m4-portfolio-field-tab ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
                  onClick={() => {
                    setActiveFieldId(field.id);
                    persistDraft(values, customInputs, customActive, field.id, saved);
                  }}
                >
                  <span>{done ? '✓' : field.number}</span>
                  <strong>{field.label}</strong>
                </button>
              );
            })}
          </div>

          <article className="m4-portfolio-field-card" role="tabpanel">
            <p className="m4-card-kicker">Field {activeField.number}</p>
            <h2>{activeField.prompt}</h2>
            <div className="m4-portfolio-option-grid">
              {activeField.options.map((option) => {
                const selected = values[activeField.id] === option && !customActive[activeField.id];
                return (
                  <button
                    key={option}
                    type="button"
                    className={`m4-portfolio-option ${selected ? 'is-selected' : ''}`}
                    aria-pressed={selected}
                    onClick={() => selectOption(activeField, option)}
                  >
                    {option}
                  </button>
                );
              })}
              <button
                type="button"
                className={`m4-portfolio-option is-custom ${customActive[activeField.id] ? 'is-selected' : ''}`}
                aria-pressed={customActive[activeField.id]}
                onClick={() => activateCustom(activeField)}
              >
                Custom safe sentence.
              </button>
            </div>
            <label className="m4-portfolio-custom-label" htmlFor={`m4-custom-${activeField.id}`}>
              Optional custom safe sentence
            </label>
            <input
              id={`m4-custom-${activeField.id}`}
              className="m4-portfolio-custom-input"
              type="text"
              maxLength={150}
              value={customInputs[activeField.id]}
              placeholder="Write a short general sentence without names or sensitive details."
              onFocus={() => activateCustom(activeField)}
              onChange={(event) => updateCustom(activeField, event.target.value)}
            />
          </article>
        </section>

        <aside className="m4-portfolio-preview" aria-labelledby="m4-portfolio-preview-title">
          <article className="m4-portfolio-summary">
            <p className="m4-card-kicker">Generated portfolio summary</p>
            <h2 id="m4-portfolio-preview-title">My Safe Implementation Adjustment Note</h2>
            <dl>
              <div>
                <dt>Warning signal:</dt>
                <dd>{values.warningSignal || 'Select or write a safe warning signal.'}</dd>
              </div>
              <div>
                <dt>Who may be affected differently:</dt>
                <dd>{values.affectedDifferently || 'Select or write who may be affected differently.'}</dd>
              </div>
              <div>
                <dt>Main barrier:</dt>
                <dd>{values.mainBarrier || 'Select or write the main barrier.'}</dd>
              </div>
              <div>
                <dt>Safe adjustment:</dt>
                <dd>{values.safeAdjustment || 'Select or write a safe adjustment.'}</dd>
              </div>
              <div>
                <dt>Accountability and documentation:</dt>
                <dd>{values.accountabilityDocumentation || 'Select or write how the CSO should document and follow up.'}</dd>
              </div>
            </dl>
          </article>

          <article className="m4-portfolio-confirmation" aria-live="polite">
            <p>
              This note will be saved privately to <strong>My Portfolio</strong> under Module 4. You can review
              or edit it later.
            </p>
            {saved && <strong className="m4-portfolio-saved">Saved. Your Module 4 portfolio checkpoint has been added to My Portfolio.</strong>}
          </article>

          <div className="m4-portfolio-actions">
            <button type="button" className="m4-portfolio-secondary" onClick={reviseNote}>
              Revise my note
            </button>
            <PrimaryButton disabled={!allComplete || saved} onClick={savePortfolio}>
              Save to My Portfolio and continue
            </PrimaryButton>
            <PrimaryButton
              disabled={!saved}
              onClick={() =>
                completeScreen(
                  'M4-S1-10',
                  'M4-S1-11',
                  module4Routes['M4-S1-11'],
                  onChangeState,
                  'module4PortfolioCheckpoint',
                  { ...values, status: 'completed' },
                )
              }
            >
              Continue
            </PrimaryButton>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Module4KnowledgeCheckScreen({ state, onChangeState }: Module4RendererProps) {
  const stored = state.practiceCheckState.module4KnowledgeCheck || {};
  const [currentIndex, setCurrentIndex] = useState<number>((stored.currentIndex as number) || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(
    (stored.selectedAnswers as Record<string, string>) || {},
  );
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>(
    (stored.submittedQuestions as Record<string, boolean>) || {},
  );
  const [showResults, setShowResults] = useState<boolean>(Boolean(stored.showResults || stored.completed));

  const total = module4KnowledgeQuestions.length;
  const currentQuestion = module4KnowledgeQuestions[currentIndex] || module4KnowledgeQuestions[0];
  const selectedAnswer = selectedAnswers[currentQuestion.id] || '';
  const submitted = Boolean(submittedQuestions[currentQuestion.id]);
  const answeredCount = module4KnowledgeQuestions.filter((question) => submittedQuestions[question.id]).length;
  const score = module4KnowledgeQuestions.filter((question) => {
    const answerId = selectedAnswers[question.id];
    return question.choices.some((choice) => choice.id === answerId && choice.correct);
  }).length;

  const resultTitle =
    score >= 5 ? 'Strong implementation judgment.' : score >= 3 ? 'Good progress.' : 'Keep practicing.';
  const resultText =
    score >= 5
      ? 'You are ready to apply HRBA during delivery by noticing warning signs, adjusting access, protecting participation, responding to feedback, engaging actors carefully, and documenting safe adaptations.'
      : score >= 3
        ? 'Review the feedback carefully. Focus on the difference between delivering activities and keeping HRBA alive while delivery is happening.'
        : 'Review the Module 4 screens on participation, inclusive delivery, feedback, actor engagement, and adaptation. HRBA during implementation takes practice.';

  const persist = (
    nextAnswers = selectedAnswers,
    nextSubmitted = submittedQuestions,
    nextIndex = currentIndex,
    nextShowResults = showResults,
    markComplete = false,
  ) => {
    const nextScore = module4KnowledgeQuestions.filter((question) => {
      const answerId = nextAnswers[question.id];
      return question.choices.some((choice) => choice.id === answerId && choice.correct);
    }).length;
    onChangeState((prev) => ({
      ...prev,
      screenProgress: markComplete ? addProgress(prev, 'M4-S1-11') : prev.screenProgress,
      practiceCheckState: updatePracticeState(prev, 'module4KnowledgeCheck', {
        currentIndex: nextIndex,
        selectedAnswers: nextAnswers,
        submittedQuestions: nextSubmitted,
        showResults: nextShowResults,
        completed: markComplete || Boolean(stored.completed),
        score: nextScore,
        total,
        completedAt: markComplete ? new Date().toISOString() : stored.completedAt || '',
      }),
    }));
  };

  const selectAnswer = (choiceId: string) => {
    if (submitted) return;
    const nextAnswers = { ...selectedAnswers, [currentQuestion.id]: choiceId };
    setSelectedAnswers(nextAnswers);
    persist(nextAnswers, submittedQuestions, currentIndex, showResults);
  };

  const submitAnswer = () => {
    const nextSubmitted = { ...submittedQuestions, [currentQuestion.id]: true };
    setSubmittedQuestions(nextSubmitted);
    persist(selectedAnswers, nextSubmitted, currentIndex, showResults);
  };

  const goNext = () => {
    const nextIndex = Math.min(currentIndex + 1, total - 1);
    setCurrentIndex(nextIndex);
    persist(selectedAnswers, submittedQuestions, nextIndex, false);
  };

  const viewResults = () => {
    setShowResults(true);
    persist(selectedAnswers, submittedQuestions, currentIndex, true, true);
  };

  const reviewQuestion = (index: number) => {
    setShowResults(false);
    setCurrentIndex(index);
    persist(selectedAnswers, submittedQuestions, index, false);
  };

  if (showResults) {
    return (
      <main className="m4-screen m4-kc-screen" aria-labelledby="m4-kc-title">
        <section className="m4-kc-results-shell">
          <article className="m4-kc-results-card">
            <ModuleContextLabel>MODULE 4 · KNOWLEDGE CHECK</ModuleContextLabel>
            <h1 id="m4-kc-title">Module 4 Knowledge Check</h1>
            <p className="m4-kc-score">Score: {score} of {total}</p>
            <h2>{resultTitle}</h2>
            <p>{resultText}</p>
            <strong>
              HRBA during implementation is not about following the plan blindly. It is about noticing what is
              changing, listening safely, adjusting responsibly, and keeping people’s dignity, voice, access,
              and accountability at the centre of delivery.
            </strong>
          </article>
          <aside className="m4-kc-review-card" aria-label="Question review">
            <p className="m4-card-kicker">Review answers</p>
            <div>
              {module4KnowledgeQuestions.map((question, index) => {
                const answerId = selectedAnswers[question.id];
                const correct = question.choices.some((choice) => choice.id === answerId && choice.correct);
                return (
                  <button
                    key={question.id}
                    type="button"
                    className={`m4-kc-review-button ${correct ? 'is-correct' : ''}`}
                    onClick={() => reviewQuestion(index)}
                  >
                    <span>Q{question.number}</span>
                    <strong>{correct ? 'Strongest' : 'Review'}</strong>
                  </button>
                );
              })}
            </div>
            <PrimaryButton
              onClick={() =>
                completeScreen(
                  'M4-S1-11',
                  'M4-S1-12',
                  module4Routes['M4-S1-12'],
                  onChangeState,
                  'module4KnowledgeCheck',
                  {
                    completed: true,
                    score,
                    total,
                  },
                )
              }
            >
              Continue
            </PrimaryButton>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className="m4-screen m4-kc-screen" aria-labelledby="m4-kc-title">
      <section className="m4-kc-shell">
        <header className="m4-kc-header">
          <div>
            <ModuleContextLabel>MODULE 4 · KNOWLEDGE CHECK</ModuleContextLabel>
            <h1 id="m4-kc-title">Module 4 Knowledge Check</h1>
            <p>Applying HRBA during implementation</p>
          </div>
          <span role="status" aria-live="polite">
            Question {currentQuestion.number} of {total} · {answeredCount} answered
          </span>
        </header>

        <section className="m4-kc-main">
          <article className="m4-kc-scenario">
            <p className="m4-card-kicker">Question {currentQuestion.number} of {total} · {currentQuestion.title}</p>
            <h2>Scenario</h2>
            <p>{currentQuestion.scenario}</p>
            <h3>{currentQuestion.question}</h3>
          </article>

          <section className="m4-kc-choices" aria-label={`Question ${currentQuestion.number} answer choices`} role="radiogroup">
            {currentQuestion.choices.map((choice) => {
              const selected = selectedAnswer === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`m4-kc-choice ${selected ? 'is-selected' : ''} ${submitted && choice.correct ? 'is-correct' : ''}`}
                  onClick={() => selectAnswer(choice.id)}
                >
                  <span>{choice.id}</span>
                  <strong>{choice.text}</strong>
                </button>
              );
            })}
          </section>

          <aside className="m4-kc-feedback" aria-live="polite">
            {submitted ? (
              <>
                <p className="m4-card-kicker">Feedback</p>
                <div className="m4-kc-feedback-list">
                  {currentQuestion.choices.map((choice) => {
                    const selected = selectedAnswer === choice.id;
                    return (
                      <article
                        key={choice.id}
                        className={`m4-kc-feedback-item ${choice.correct ? 'is-correct' : ''} ${selected ? 'is-selected' : ''}`}
                      >
                        <strong>{choice.id} — {choice.correct ? 'Strongest answer' : selected ? 'Your selection' : 'Option feedback'}</strong>
                        <p>{choice.feedback}</p>
                      </article>
                    );
                  })}
                </div>
                <strong className="m4-kc-takeaway">{currentQuestion.takeaway}</strong>
              </>
            ) : (
              <>
                <p className="m4-card-kicker">Instruction</p>
                <p>
                  Choose the strongest answer. More than one option may sound reasonable, but one answer best
                  reflects practical HRBA judgment.
                </p>
              </>
            )}
          </aside>
        </section>

        <footer className="m4-kc-footer">
          <div className="m4-kc-dots" aria-label="Knowledge check progress">
            {module4KnowledgeQuestions.map((question, index) => (
              <button
                key={question.id}
                type="button"
                className={`m4-kc-dot ${index === currentIndex ? 'is-active' : ''} ${submittedQuestions[question.id] ? 'is-done' : ''}`}
                onClick={() => reviewQuestion(index)}
                aria-label={`Review question ${question.number}`}
              >
                {question.number}
              </button>
            ))}
          </div>
          {!submitted ? (
            <PrimaryButton disabled={!selectedAnswer} onClick={submitAnswer}>
              Submit answer
            </PrimaryButton>
          ) : currentIndex < total - 1 ? (
            <PrimaryButton onClick={goNext}>Next question</PrimaryButton>
          ) : (
            <PrimaryButton onClick={viewResults}>View results</PrimaryButton>
          )}
        </footer>
      </section>
    </main>
  );
}

function Module4SummaryScreen({ onChangeState }: Module4RendererProps) {
  const reviewModule = () => {
    onChangeState((prev) => ({
      ...prev,
      currentScreenId: 'M4-S1-01',
      currentSubState: null,
      activeModal: null,
      screenProgress: addProgress(prev, 'M4-S1-12'),
      practiceCheckState: updatePracticeState(prev, 'module4Summary', {
        reviewed: true,
      }),
    }));
    setRoute(module4Routes['M4-S1-01']);
  };

  return (
    <main className="m4-screen m4-summary-screen" aria-labelledby="m4-summary-title">
      <section className="m4-summary-shell">
        <aside className="m4-summary-copy">
          <div>
            <ModuleContextLabel>MODULE 4 · SUMMARY</ModuleContextLabel>
            <h1 id="m4-summary-title">What you practiced in Module 4</h1>
            <p>Keeping HRBA alive during implementation means noticing, adjusting, listening, and documenting safely.</p>
          </div>
          <article className="m4-summary-opening">
            <p>You have reached the end of Module 4.</p>
            <p>
              In this module, you practiced how to keep HRBA alive after implementation begins. You looked at
              warning signs, delivery barriers, participation risks, weak feedback loops, actor relationships,
              and safe adaptation.
            </p>
            <p>
              The key lesson is simple: implementation is not only about following the plan. It is also about
              noticing what is changing and responding in ways that protect dignity, inclusion, participation,
              safety, and accountability.
            </p>
          </article>
          <article className="m4-summary-reflection">
            <h2>Before you complete the module</h2>
            <p>Take a moment to notice the shift in your thinking.</p>
            <p>
              A project can be well designed and still lose its rights-based quality during delivery if people
              stop receiving information, cannot participate safely, face new barriers, do not receive
              responses, or are affected by changes that are not documented.
            </p>
          </article>
        </aside>

        <section className="m4-summary-grid-wrap" aria-labelledby="m4-summary-grid-title">
          <div className="m4-summary-grid-head">
            <h2 id="m4-summary-grid-title">What Module 4 helped you practice</h2>
            <div className="m4-summary-path" aria-label="Six Module 4 practice areas">
              {module4SummaryCards.map((card) => <span key={card.number}>{card.number}</span>)}
            </div>
          </div>
          <div className="m4-summary-grid">
            {module4SummaryCards.map((card) => (
              <article key={card.number} className="m4-summary-card" tabIndex={0}>
                <span>{card.number}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <strong>{card.reveal}</strong>
              </article>
            ))}
          </div>
          <article className="m4-summary-takeaway">
            <p className="m4-card-kicker">Module 4 takeaway</p>
            <strong>
              Strong implementation is not only delivering the plan. It is noticing what changes, responding
              safely, and keeping dignity, participation, inclusion, and accountability alive.
            </strong>
          </article>
          <div className="m4-summary-actions">
            <button type="button" className="m4-portfolio-secondary" onClick={reviewModule}>
              Review Module 4
            </button>
            <PrimaryButton
              onClick={() =>
                completeScreen(
                  'M4-S1-12',
                  'M4-S1-13',
                  module4Routes['M4-S1-13'],
                  onChangeState,
                  'module4Summary',
                  { reviewed: true },
                )
              }
            >
              Continue to completion
            </PrimaryButton>
          </div>
        </section>
      </section>
    </main>
  );
}

function Module4CompletionTransitionScreen({ state, onChangeState }: Module4RendererProps) {
  const portfolio = state.practiceCheckState.module4Portfolio || {};
  const knowledgeCheck = state.practiceCheckState.module4KnowledgeCheck || {};
  const portfolioSaved = portfolio.status === 'saved' || Boolean(portfolio.updatedAt);
  const knowledgeComplete = Boolean(knowledgeCheck.completed);

  const markModuleComplete = (target: 'module5' | 'overview') => {
    onChangeState((prev) => {
      const progress = new Set(prev.screenProgress[MODULE_ID] || []);
      progress.add('M4-S1-13');
      const completedModules = prev.completedModules.includes(MODULE_ID)
        ? prev.completedModules
        : [...prev.completedModules, MODULE_ID];
      return {
        ...prev,
        currentLayer: target === 'module5' ? 'player' : 'platform',
        currentCourseId: 'hrba_course',
        currentModuleId: target === 'module5' ? 'module_05_hrba_meal' : MODULE_ID,
        currentScreenId: target === 'module5' ? 'M5-PLAYER-00' : 'M4-S1-13',
        currentSubState: null,
        activeModal: null,
        completedModules,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(progress),
        },
        practiceCheckState: updatePracticeState(prev, 'module4Completion', {
          completed: true,
          knowledgeCheckCompleted: knowledgeComplete,
          portfolioAcknowledged: portfolioSaved,
          completedAt: new Date().toISOString(),
        }),
      };
    });
    setRoute(target === 'module5' ? '/module-5' : '/');
  };

  const portfolioValue = (key: string, fallback: string) => String(portfolio[key] || fallback);

  return (
    <main className="m4-screen m4-completion-screen" aria-labelledby="m4-completion-title">
      <section className="m4-completion-shell">
        <section className="m4-completion-main">
          <div className="m4-completion-title-row">
            <div className="m4-completion-badge-icon" aria-hidden="true">✓</div>
            <div>
              <ModuleContextLabel>MODULE 4 · COMPLETION</ModuleContextLabel>
              <h1 id="m4-completion-title">Module 4 Complete</h1>
              <p>You practiced keeping HRBA alive during implementation.</p>
            </div>
          </div>
          <article className="m4-completion-message">
            <h2>You have completed Module 4.</h2>
            <p>
              You practiced how to notice implementation warning signs, adjust delivery safely, keep
              participation alive, repair feedback loops, engage actors carefully, and document changes
              responsibly.
            </p>
          </article>
          <article className="m4-completion-status">
            <span aria-hidden="true">✓</span>
            <div>
              <h2>Module 4 completed</h2>
              <p>Your progress has been updated.</p>
            </div>
          </article>
          <article className="m4-completion-encouragement">
            <p>
              Strong implementation is not only delivering the plan. It is noticing what changes, responding
              safely, and keeping dignity, participation, inclusion, and accountability alive.
            </p>
          </article>
        </section>

        <figure className="m4-completion-visual">
          <img
            src="/assets/hrba/modules/module-4-implementation.png"
            alt="Illustration for keeping HRBA alive during project implementation"
          />
          <figcaption>
            <span aria-hidden="true">✓</span>
            Implementation stays rights-based when teams keep listening, adapting, and following up safely.
          </figcaption>
        </figure>

        <aside className="m4-completion-side">
          <article className="m4-completion-portfolio">
            <p className="m4-card-kicker">Saved to My Portfolio</p>
            <h2>My Safe Implementation Adjustment Note</h2>
            <div className="m4-completion-saved-fields">
              <span>Warning signal noticed: {portfolioValue('warningSignal', 'Saved in Module 4 portfolio.')}</span>
              <span>Who may be affected: {portfolioValue('affectedDifferently', 'Saved in Module 4 portfolio.')}</span>
              <span>Delivery barrier: {portfolioValue('mainBarrier', 'Saved in Module 4 portfolio.')}</span>
              <span>Safe adjustment: {portfolioValue('safeAdjustment', 'Saved in Module 4 portfolio.')}</span>
              <span>Accountability action: {portfolioValue('accountabilityDocumentation', 'Saved in Module 4 portfolio.')}</span>
              <span>Documentation note: {portfolioValue('accountabilityDocumentation', 'Saved in Module 4 portfolio.')}</span>
            </div>
            <p className="m4-completion-privacy">
              Your portfolio entry is private by default. Keep it general and safe. Do not include real names,
              active complaints, survivor details, confidential project data, identifiable community information,
              or sensitive case information.
            </p>
          </article>
          <article className="m4-completion-next">
            <p className="m4-card-kicker">Next: Module 5</p>
            <h2>Next: Module 5</h2>
            <p>
              In Module 5, you will apply HRBA in MEAL. You will practice how to look beyond good numbers,
              strengthen indicators, use data safely, treat feedback as evidence, learn from implementation,
              and report responsibly.
            </p>
            <strong>
              You are now ready to move from rights-based implementation into rights-based monitoring,
              evaluation, accountability, and learning.
            </strong>
          </article>
        </aside>

        <footer className="m4-completion-actions">
          <PrimaryButton onClick={() => markModuleComplete('module5')}>Continue to Module 5</PrimaryButton>
          <button type="button" className="m4-portfolio-secondary" onClick={() => markModuleComplete('overview')}>
            Return to course overview
          </button>
        </footer>
      </section>
    </main>
  );
}

export default function Module4Renderer(props: Module4RendererProps) {
  if (props.screenId === 'M4-S1-01') {
    return <Module4IntroVideoScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-02') {
    return <Module4LearningObjectivesScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-03') {
    return <Module4WarningScenarioScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-04') {
    return <Module4ImplementationLensScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-05') {
    return <Module4ParticipationDeliveryScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-06') {
    return <Module4InclusiveDeliveryScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-07') {
    return <Module4FeedbackAccountabilityScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-08') {
    return <Module4ActorEngagementScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-09') {
    return <Module4AdaptationLabScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-10') {
    return <Module4PortfolioCheckpointScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-11') {
    return <Module4KnowledgeCheckScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-12') {
    return <Module4SummaryScreen {...props} />;
  }

  if (props.screenId === 'M4-S1-13') {
    return <Module4CompletionTransitionScreen {...props} />;
  }

  return (
    <main className="m4-screen" aria-labelledby="m4-placeholder-title">
      <section className="m4-video-shell">
        <ModuleContextLabel>Module 4 · Applying HRBA During Implementation</ModuleContextLabel>
        <h1 id="m4-placeholder-title">Module 4 screen coming soon</h1>
        <p>This Module 4 screen has not been implemented yet.</p>
      </section>
    </main>
  );
}
