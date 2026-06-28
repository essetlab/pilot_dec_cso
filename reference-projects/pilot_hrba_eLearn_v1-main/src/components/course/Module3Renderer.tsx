import { useState } from 'react';
import type { ReactNode } from 'react';
import type { LearningState } from '../../state/learningState';

type Module3RendererProps = {
  screenId: string;
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
};

type CheckOption = {
  id: string;
  label: string;
  text: string;
  correct?: boolean;
};

type SelectableItem = {
  id: string;
  text: string;
};

type GuidedPart = {
  id: string;
  title: string;
  prompt: string;
  instruction?: string;
  mode: 'single' | 'multi';
  options: SelectableItem[];
  best: string[];
  feedback: Record<string, string>;
  bestFeedback: string;
};

type KnowledgeCheckQuestion = {
  id: string;
  title: string;
  scenario: string;
  question: string;
  choices: {
    id: string;
    text: string;
    feedback: string;
  }[];
  correctId: string;
  takeaway: string;
};

type PortfolioField = {
  key:
    | 'projectDesignIssue'
    | 'reframedProblem'
    | 'rightsHolderFocus'
    | 'actorsAndResponsibilities'
    | 'designImprovement'
    | 'riskAndSafeguard';
  label: string;
  example: string;
};

const MODULE_ID = 'module_03_project_design';

export const module3IntroVideoUrl = '';

const module3LearningObjectives = [
  'Diagnose what a strong-looking proposal may still miss from an HRBA project-design perspective.',
  'Identify specific rights-holders, exclusion risks, and practical barriers before choosing activities.',
  'Map duty-bearers, influencing actors, and the CSO role needed for a stronger project design.',
  'Build participation, transparency, feedback, and accountability into design decisions.',
  'Translate analysis into rights-aware objectives, activities, risks, assumptions, and evidence choices.',
  'Review a project idea and decide what needs to change before implementation begins.',
];

const snapshotParts = [
  {
    id: 'context',
    title: 'Context and alignment',
    prompt: 'Which phrase gives the strongest starting context for the design?',
    options: [
      {
        id: 'A',
        text: 'The project will provide livelihood training because unemployment is a problem.',
        feedback: 'Partly useful, but too narrow. It moves quickly from a broad problem to a training response.',
      },
      {
        id: 'B',
        text: 'The project should understand how income, access to information, selection criteria, local services, and existing livelihood plans shape who can benefit.',
        feedback: 'Strong. It connects the issue to context, access, existing systems, and decisions that can change the project design.',
        correct: true,
      },
      {
        id: 'C',
        text: 'The project should follow the donor format and include HRBA language in the background section.',
        feedback: 'Not enough. Proposal format matters, but HRBA design needs analysis, not only wording.',
      },
    ],
  },
  {
    id: 'rights-holders',
    title: 'Rights-holders',
    prompt: 'Which phrase gives the strongest rights-holder focus?',
    options: [
      {
        id: 'A',
        text: 'Vulnerable community members.',
        feedback: 'Too broad. “Vulnerable community members” can hide who is actually missed or affected differently.',
      },
      {
        id: 'B',
        text: 'Poor people who need livelihood skills.',
        feedback: 'More specific, but still reduces the issue mainly to poverty and skills.',
      },
      {
        id: 'C',
        text: 'Youth outside formal networks, women with unpaid care responsibilities, persons with disabilities, and households affected by displacement may experience the opportunity differently.',
        feedback: 'Strong. This can influence outreach, selection criteria, timing, accessibility, and participation.',
        correct: true,
      },
    ],
  },
  {
    id: 'barriers',
    title: 'Barriers and root causes',
    prompt: 'Which phrase gives the strongest barrier analysis?',
    options: [
      {
        id: 'A',
        text: 'People do not have enough business skills.',
        feedback: 'This may be part of the issue, but it is too narrow. It focuses on individual skills before checking access barriers.',
      },
      {
        id: 'B',
        text: 'Unequal information, timing, mobility, care responsibilities, disability access, and selection influence may shape who can participate and benefit.',
        feedback: 'Strong. It names practical barriers the project design can test and address before implementation.',
        correct: true,
      },
      {
        id: 'C',
        text: 'The community needs more income-generating activities.',
        feedback: 'This is a broad need statement. It does not explain why some people may be excluded from opportunities.',
      },
    ],
  },
  {
    id: 'actors',
    title: 'Actors and responsibilities',
    prompt: 'Which phrase best shows responsibility and influence?',
    options: [
      {
        id: 'A',
        text: 'The CSO should train people so they can improve their own lives.',
        feedback: 'This places too much responsibility on individuals and the CSO. It does not show the wider actor system.',
      },
      {
        id: 'B',
        text: 'Community leaders should choose who deserves the opportunity.',
        feedback: 'Leader input may be useful, but relying only on leaders can reinforce gatekeeping or miss less visible people.',
      },
      {
        id: 'C',
        text: 'The CSO, local officials, training providers, community representatives, and market actors all shape access, information, selection, support, and follow-up.',
        feedback: 'Strong. This makes the design more realistic by identifying actors who shape access and accountability.',
        correct: true,
      },
    ],
  },
  {
    id: 'direction',
    title: 'Design direction',
    prompt: 'Which phrase gives the strongest design direction?',
    options: [
      {
        id: 'A',
        text: 'The project should deliver training to 300 people.',
        feedback: 'This is an output target. It does not explain what barrier the project will reduce.',
      },
      {
        id: 'B',
        text: 'The project should improve equitable access to livelihood opportunities by strengthening information-sharing, transparent selection, inclusive participation, accessible delivery, and coordination with responsible actors.',
        feedback: 'Strong. It links the design direction to access, participation, transparency, inclusion, and responsibility.',
        correct: true,
      },
      {
        id: 'C',
        text: 'The project should support vulnerable people through livelihood activities.',
        feedback: 'Positive but still too general. It does not guide practical design choices.',
      },
    ],
  },
];

const snapshotMicroOptions = [
  {
    id: 'A',
    text: 'It is a checklist added after the proposal is finished.',
    feedback: 'Not quite. The snapshot should shape design choices before the proposal is finalized.',
  },
  {
    id: 'B',
    text: 'It is a practical way to ask better design questions before choosing activities.',
    feedback:
      'Correct. The snapshot helps the CSO move from assumptions to clearer questions about people, barriers, responsibilities, participation, risk, and change.',
    correct: true,
  },
  {
    id: 'C',
    text: 'It is mainly a legal review of project documents.',
    feedback: 'Too narrow. Relevant standards may inform the design, but the snapshot is broader than legal review.',
  },
  {
    id: 'D',
    text: 'It is a way to make the proposal longer and more formal.',
    feedback: 'Not quite. The goal is not more text; it is better design logic.',
  },
];

const actorMapParts = [
  {
    id: 'rights-holder',
    title: 'Rights-holder focus',
    prompt: 'Which rights-holder framing is strongest for project design?',
    options: [
      {
        id: 'A',
        text: 'The project will support cooperative members as one group because they share the same project opportunity.',
        feedback:
          'Partly useful, but incomplete. A shared opportunity does not mean everyone can access or influence it in the same way.',
      },
      {
        id: 'B',
        text: 'The project will focus on the most active members because they are most likely to complete the training.',
        feedback:
          'Efficient, but exclusion-blind. Active members may be easier to reach, but this can leave out people facing the strongest barriers.',
      },
      {
        id: 'C',
        text: 'The project will identify which cooperative members face different barriers to information, participation, mobility, decision-making, and market access.',
        feedback:
          'Correct. This framing helps the CSO design for different rights-holders and the barriers that shape their participation and benefit.',
        correct: true,
      },
      {
        id: 'D',
        text: 'The project will ask cooperative leaders to identify the members who need the most support.',
        feedback:
          'Practical, but risky if used alone. Leaders may have useful knowledge, but relying only on them can reinforce existing power dynamics.',
      },
    ],
  },
  {
    id: 'barrier',
    title: 'Barrier focus',
    prompt: 'Which barrier analysis best strengthens the design?',
    options: [
      {
        id: 'A',
        text: 'The main barrier is lack of training, so the project should focus on delivering stronger technical sessions.',
        feedback:
          'Too narrow. Training may be useful, but it may not address why some members cannot access, understand, or influence the opportunity.',
      },
      {
        id: 'B',
        text: 'The design should check information flow, meeting timing, language, confidence to speak, care workload, mobility, and influence over buyer decisions.',
        feedback:
          'Correct. This option looks at practical and power-related barriers that shape participation and benefit.',
        correct: true,
      },
      {
        id: 'C',
        text: 'The main barrier is motivation, because members who value the opportunity will find a way to participate.',
        feedback: 'Risky and incomplete. Low participation may reflect barriers, not lack of motivation.',
      },
      {
        id: 'D',
        text: 'The design should list vulnerable groups but keep the same activities to avoid complicating implementation.',
        feedback: 'Weak. Naming groups without adjusting design does not meaningfully address exclusion.',
      },
    ],
  },
  {
    id: 'actor',
    title: 'Actor and responsibility focus',
    prompt: 'Which actor map gives the CSO the clearest design direction?',
    options: [
      {
        id: 'A',
        text: 'The CSO is responsible for making the cooperative fair, so it should directly manage selection, buyer negotiation, and meeting decisions.',
        feedback:
          'Overreaching. The CSO should not take over the cooperative’s responsibilities or decision-making space.',
      },
      {
        id: 'B',
        text: 'Cooperative leaders are responsible for all internal decisions, so the CSO should only provide training.',
        feedback:
          'Too narrow. Leaders matter, but other actors and power relationships also shape access, voice, and market benefit.',
      },
      {
        id: 'C',
        text: 'The design should map rights-holders, cooperative leaders, buyers, local officials, extension workers, and family/community influences, then define the CSO role as facilitator, connector, evidence holder, and accountability ally.',
        feedback:
          'Correct. This option clarifies responsibility, influence, and the CSO’s proper role before activities are finalized.',
        correct: true,
      },
      {
        id: 'D',
        text: 'The project should avoid actor mapping because it may create tension among cooperative members.',
        feedback:
          'Too cautious. Actor mapping can be done safely and respectfully; avoiding it may leave power and responsibility unclear.',
      },
    ],
  },
];

const actorMapMicroOptions = [
  {
    id: 'A',
    text: 'A strong HRBA design starts by choosing the most efficient activity package.',
    feedback: 'Not quite. Activities should come after analysis, not before it.',
  },
  {
    id: 'B',
    text: 'A strong HRBA design clarifies who is affected, what barriers shape their participation, which actors hold responsibility or influence, and what role the CSO should take.',
    feedback:
      'Correct. Rights-holder, barrier, actor, and CSO-role analysis makes the project design more practical and rights-based.',
    correct: true,
  },
  {
    id: 'C',
    text: 'A strong HRBA design avoids power questions because they may slow down implementation.',
    feedback: 'Not quite. Power questions can be handled safely and respectfully; avoiding them weakens design.',
  },
  {
    id: 'D',
    text: 'A strong HRBA design treats community leaders as the only source of participation evidence.',
    feedback: 'Not quite. Leaders may provide insight, but they should not be the only source of evidence.',
  },
];

const diagnosisLabParts = [
  {
    id: 'rootCause',
    stateKey: 'm3_s07_rootCauseChoice',
    title: 'Symptom or root cause?',
    prompt: 'Which analysis best moves beyond the visible symptom?',
    options: [
      {
        id: 'A',
        text: 'The visible problem is low sales, so the project should focus mainly on stronger business training and more buyer-linkage events.',
        feedback:
          'Partly useful, but incomplete. Training and buyer events may help, but they may not address why some members cannot access information, influence decisions, or negotiate fairly.',
      },
      {
        id: 'B',
        text: 'Low sales may be a symptom. The design should examine whether unequal access to information, weak voice in market decisions, buyer practices, and internal cooperative power dynamics are shaping the problem.',
        feedback:
          'Correct. This option treats low sales as a symptom and looks for deeper barriers in information, voice, market relationships, and power.',
        correct: true,
      },
      {
        id: 'C',
        text: 'The main root cause is that some members are not committed enough to attend meetings and prepare for buyers.',
        feedback: 'Risky and incomplete. Low participation or weak preparation may reflect barriers, not lack of commitment.',
      },
      {
        id: 'D',
        text: 'The project should not spend too much time on root causes because the donor expects activities to start quickly.',
        feedback:
          'Too narrow. Time pressure is real, but skipping root-cause thinking can lead to activities that look useful but miss the design problem.',
      },
    ],
  },
  {
    id: 'capacityGap',
    stateKey: 'm3_s07_capacityGapChoice',
    title: 'Capacity gap',
    prompt: 'Which capacity-gap analysis is strongest for project design?',
    options: [
      {
        id: 'A',
        text: 'Rights-holders need stronger market knowledge, cooperative leaders need clearer decision processes, and buyers or local service actors may need clearer expectations for fair and transparent engagement.',
        feedback:
          'Correct. This option looks at capacities across rights-holders, cooperative leadership, market actors, and supporting actors.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Only cooperative members have a capacity gap because they need better business skills.',
        feedback:
          'Too narrow. Members may need knowledge and confidence, but the problem may also involve decision processes and other actors.',
      },
      {
        id: 'C',
        text: 'Only the CSO has a capacity gap because it must manage the market-linkage process more tightly.',
        feedback:
          'Overreaching. The CSO may need to improve its facilitation, but it should not take over the whole market process.',
      },
      {
        id: 'D',
        text: 'Capacity gaps should be assessed later during implementation after training begins.',
        feedback: 'Too late. Capacity-gap analysis should shape design before activities and assumptions are fixed.',
      },
    ],
  },
  {
    id: 'participationRisk',
    stateKey: 'm3_s07_participationRiskChoice',
    title: 'Participation risk',
    prompt: 'Which participation risk should the CSO address during design?',
    options: [
      {
        id: 'A',
        text: 'The design may rely too heavily on the most confident cooperative members, so quieter or newer members may be present but not influential.',
        feedback:
          'Correct. This identifies a real design risk: participation can be visible but not influential if quieter members cannot shape decisions.',
        correct: true,
      },
      {
        id: 'B',
        text: 'The design risk is low because cooperative members have already attended previous meetings.',
        feedback: 'Incomplete. Attendance does not show whether people understood, questioned, influenced, or disagreed safely.',
      },
      {
        id: 'C',
        text: 'Participation risk should be handled by asking leaders to confirm that members agree with the plan.',
        feedback: 'Practical, but weak if used alone. Leaders may help, but leader confirmation does not prove broad participation.',
      },
      {
        id: 'D',
        text: 'The project should avoid participation questions because they may create tension inside the cooperative.',
        feedback: 'Too cautious. Participation risks should be handled safely, not avoided.',
      },
    ],
  },
];

const diagnosisMicroOptions = [
  {
    id: 'A',
    text: 'A strong design starts with the most visible problem and chooses the fastest activity.',
    feedback: 'Not quite. Fast activities may be useful, but they can miss the deeper design issue.',
  },
  {
    id: 'B',
    text: 'A strong design checks symptoms, root causes, capacity gaps, and participation risks before activities are finalized.',
    feedback:
      'Correct. HRBA design becomes stronger when it links the visible problem to root causes, capacity gaps, and participation risks.',
    correct: true,
  },
  {
    id: 'C',
    text: 'A strong design avoids internal power questions because they are too sensitive for project planning.',
    feedback: 'Not quite. Power questions should be handled carefully, not ignored.',
  },
  {
    id: 'D',
    text: 'A strong design assumes participation is meaningful when attendance is high.',
    feedback: 'Not quite. Attendance is only one signal; it does not prove influence.',
  },
];

const objectiveRepairSteps = [
  {
    id: 'objective',
    title: 'Choose the stronger HRBA objective',
    prompt: 'Which objective best reflects the rights-based problem?',
    options: [
      {
        id: 'A',
        text: 'Train 300 young women in market skills and cooperative participation.',
        feedback:
          'Activity-focused. This is clear, but it mostly describes what the project will deliver. It does not show what barrier or rights-based change the project will address.',
      },
      {
        id: 'B',
        text: 'Increase the number of women who attend market skills training and receive start-up information.',
        feedback:
          'Partly stronger, but still narrow. This adds attendance and information, but it still does not address participation, mobility, decision-making barriers, or accountability.',
      },
      {
        id: 'C',
        text: 'Strengthen young women’s safe and equitable access to cooperative livelihood opportunities by reducing information, participation, mobility, and decision-making barriers.',
        feedback:
          'Strongest. This objective names the intended change, identifies key barriers, and keeps the focus on safe and equitable access to an opportunity.',
        correct: true,
      },
      {
        id: 'D',
        text: 'Improve women’s motivation to participate in livelihood activities through awareness and confidence-building sessions.',
        feedback:
          'Incomplete and risky. Confidence may matter, but this wording can make the problem sound like women’s motivation rather than structural barriers, power, and access.',
      },
    ],
  },
  {
    id: 'activity',
    title: 'Choose the most coherent activity package',
    prompt: 'Which activity package best fits the stronger objective?',
    options: [
      {
        id: 'A',
        text: 'Training sessions, attendance tracking, certificates, and a final graduation event.',
        feedback:
          'Useful but too activity-heavy. These activities may be part of implementation, but they do not directly address the access, information, participation, and accountability barriers.',
      },
      {
        id: 'B',
        text: 'Targeted outreach, accessible information, adjusted session timing, safe question channels, cooperative dialogue, and follow-up on selection concerns.',
        feedback:
          'Strongest. This package links directly to the barriers in the objective and creates a better pathway for information, access, voice, and response.',
        correct: true,
      },
      {
        id: 'C',
        text: 'A larger number of awareness meetings, more posters, and public speeches by local leaders.',
        feedback:
          'Visible but weak. More awareness may help, but public communication alone does not solve hidden barriers, power issues, or unclear selection concerns.',
      },
      {
        id: 'D',
        text: 'Business training for selected participants and a donor visibility event to share success stories.',
        feedback:
          'Too narrow. Training and visibility can support the project, but they do not repair the rights-based design problem.',
      },
    ],
  },
  {
    id: 'evidence',
    title: 'Choose the best minimum evidence check',
    prompt: 'What should the project check during design to know whether the activity package is likely to work?',
    options: [
      {
        id: 'A',
        text: 'Whether the donor agrees that the activities are relevant and visible.',
        feedback:
          'Useful for approval, but incomplete. Donor agreement matters, but HRBA design must also test whether the design works for rights-holders and responds to barriers.',
      },
      {
        id: 'B',
        text: 'Whether the training provider can deliver the sessions on time and within budget.',
        feedback:
          'Important, but operational. Provider capacity matters, but it does not show whether access, participation, and accountability are working for different people.',
      },
      {
        id: 'C',
        text: 'Whether different young women understand the criteria, can realistically participate, know how to ask questions, and see whether concerns receive a response.',
        feedback:
          'Strongest. This checks whether the design is usable, understandable, accessible, and responsive for the people it is meant to support.',
        correct: true,
      },
      {
        id: 'D',
        text: 'Whether the number of planned participants is large enough to meet the target.',
        feedback:
          'Too output-focused. Numbers matter, but reaching a target does not prove that barriers were reduced or participation was meaningful.',
      },
    ],
  },
];

const objectiveRepairMicroOptions = [
  {
    id: 'A',
    text: 'Start with the activities that are easiest to deliver.',
    feedback: 'Not quite. Feasibility matters, but easy activities may not address the real design problem.',
  },
  {
    id: 'B',
    text: 'Start with the output target and then add inclusion language.',
    feedback:
      'Incomplete. Output targets are useful, but inclusion language added later does not repair weak design logic.',
  },
  {
    id: 'C',
    text: 'Check whether each activity responds to a real barrier, actor responsibility, or participation/accountability gap.',
    feedback:
      'Correct. HRBA design asks whether each activity has a clear reason linked to barriers, responsibility, participation, and accountability.',
    correct: true,
  },
  {
    id: 'D',
    text: 'Add more activities so the proposal looks comprehensive.',
    feedback:
      'Not quite. More activities can make a project harder to manage and still leave the rights-based problem unresolved.',
  },
];

const module3KnowledgeQuestions: KnowledgeCheckQuestion[] = [
  {
    id: 'diagnosis',
    title: 'Diagnosing a strong-looking proposal',
    scenario:
      'A CSO proposal has a clear budget, timeline, activity list, and output target: “Train 300 people in entrepreneurship.” The proposal also mentions inclusion, but it does not explain who may be excluded, what barriers affect participation, who has responsibility for market access, or how affected people shaped the design.',
    question: 'What is the strongest design diagnosis?',
    correctId: 'B',
    takeaway:
      'A project can look donor-ready and still be weak if the logic does not explain people, barriers, actors, participation, and responsibility.',
    choices: [
      {
        id: 'A',
        text: 'The proposal is ready because the activities, budget, and targets are clear enough for implementation.',
        feedback:
          'Partly useful, but incomplete. Clear activities and targets help project management, but they do not show whether the design responds to barriers, responsibilities, participation, or exclusion.',
      },
      {
        id: 'B',
        text: 'The proposal needs stronger HRBA analysis before the activity package is treated as final.',
        feedback:
          'Correct. This response identifies the real design gap: the proposal looks operationally ready but is not yet rights-based enough to justify the chosen activities.',
      },
      {
        id: 'C',
        text: 'The proposal should remove all targets until every group has been consulted in depth.',
        feedback:
          'Strong in principle, but too rigid. Consultation matters, but the immediate need is not to remove all targets. It is to strengthen the analysis and adjust the design based on what is learned.',
      },
      {
        id: 'D',
        text: 'The proposal should add a stronger paragraph saying the project follows HRBA principles.',
        feedback:
          'Not quite. HRBA wording alone does not improve a design. The proposal needs practical analysis, not only better language.',
      },
    ],
  },
  {
    id: 'problem-framing',
    title: 'Reframing the problem',
    scenario:
      'A project idea says: “Women need business skills, so the project will provide training.” During early discussions, women mention unpaid care work, limited control over income, unsafe travel routes, and buyers who prefer negotiating with male relatives.',
    question: 'Which problem framing is strongest?',
    correctId: 'C',
    takeaway: 'A rights-based problem statement should explain the barrier system, not only name one activity need.',
    choices: [
      {
        id: 'A',
        text: 'Women lack business skills and need training support.',
        feedback:
          'Too narrow. Skills may be part of the issue, but this framing misses the wider barriers shaping whether women can use the training.',
      },
      {
        id: 'B',
        text: 'Women face transport challenges, so the project should focus mainly on safer travel.',
        feedback:
          'Partly useful, but incomplete. Transport may matter, but the scenario shows several linked barriers. A strong design should not reduce the issue to one visible barrier.',
      },
      {
        id: 'C',
        text: 'Women face linked barriers to skills, time, mobility, income control, and market influence that limit equal economic participation.',
        feedback:
          'Correct. This framing captures multiple connected barriers and points toward a more coherent rights-based design.',
      },
      {
        id: 'D',
        text: 'Men and market actors are the main obstacle, so the project should avoid involving them in the design.',
        feedback:
          'Risky and incomplete. Some actors may reinforce barriers, but excluding them automatically may reduce the chance to address responsibilities, norms, and market access.',
      },
    ],
  },
  {
    id: 'rights-holders',
    title: 'Designing for different rights-holders',
    scenario:
      'A CSO identifies “smallholder farmers” as the target group for a climate-resilient farming project. During review, staff realize that tenant farmers, women managing plots informally, youth without land, older farmers, and farmers with disabilities may face different barriers to information, credit, land decisions, and training attendance.',
    question: 'What is the strongest design action?',
    correctId: 'D',
    takeaway:
      'Rights-holder analysis helps a CSO design for real differences without fragmenting the whole project.',
    choices: [
      {
        id: 'A',
        text: 'Keep the target group broad to avoid dividing the community.',
        feedback:
          'Not quite. Broad categories can look inclusive but hide who may not be able to access or influence the project.',
      },
      {
        id: 'B',
        text: 'Ask local leaders to identify the farmers who most deserve support.',
        feedback:
          'Efficient, but risky. Leaders may provide useful information, but relying only on them can reproduce gatekeeping or miss less visible groups.',
      },
      {
        id: 'C',
        text: 'Create a separate project for each subgroup before starting implementation.',
        feedback:
          'Strong in inclusion intent, but usually unrealistic. The design does not need separate projects for every group. It needs a sharper understanding of barriers and practical design adjustments.',
      },
      {
        id: 'D',
        text: 'Segment the target group by relevant barriers and adjust outreach, criteria, and support options.',
        feedback:
          'Correct. This keeps the project coherent while making the design more responsive to different access, power, and participation barriers.',
      },
    ],
  },
  {
    id: 'responsibilities',
    title: 'Mapping responsibilities before choosing activities',
    scenario:
      'A project aims to help youth access vocational certification. Barriers include unclear public requirements, training center fees, missing documents, and inconsistent information from local offices. The CSO can support youth but cannot issue certificates.',
    question: 'Which design choice is strongest?',
    correctId: 'C',
    takeaway: 'A strong HRBA design maps who has responsibility before deciding what the CSO should do.',
    choices: [
      {
        id: 'A',
        text: 'Focus only on training because certification decisions are outside the CSO’s control.',
        feedback:
          'Too narrow. The CSO cannot issue certificates, but it can still design activities that reduce information and coordination barriers.',
      },
      {
        id: 'B',
        text: 'Promise certification support so youth remain motivated to participate.',
        feedback:
          'Risky. The intention is supportive, but promising what the CSO cannot control can damage trust and accountability.',
      },
      {
        id: 'C',
        text: 'Design activities that support youth, clarify requirements, engage responsible offices, and coordinate with training centers.',
        feedback:
          'Correct. This respects actor responsibilities while designing a practical support pathway for rights-holders.',
      },
      {
        id: 'D',
        text: 'Avoid public offices because engagement may delay the project timeline.',
        feedback:
          'Incomplete. Avoiding responsible offices may make implementation faster, but it leaves a core barrier unresolved.',
      },
    ],
  },
  {
    id: 'participation',
    title: 'Participation before decisions are fixed',
    scenario:
      'A CSO has already selected project activities for a child protection awareness project. It now wants children, caregivers, teachers, and local actors to “validate” the plan in one meeting. Some staff feel the design is too advanced to change much.',
    question: 'What is the strongest HRBA design improvement?',
    correctId: 'B',
    takeaway: 'Participation in design should influence decisions, not only validate decisions already made.',
    choices: [
      {
        id: 'A',
        text: 'Hold the validation meeting and record attendance carefully.',
        feedback: 'Too weak. Attendance records do not show whether people influenced the design.',
      },
      {
        id: 'B',
        text: 'Reopen key design choices where possible, explain real constraints, and ask affected groups what risks, barriers, and safer options should shape the plan.',
        feedback:
          'Correct. This makes participation as meaningful as possible within real constraints and still allows the design to improve.',
      },
      {
        id: 'C',
        text: 'Cancel the meeting because participation is no longer meaningful once the design is advanced.',
        feedback:
          'Too passive. Even late participation can reduce risk and improve design if the CSO is honest about what can still change.',
      },
      {
        id: 'D',
        text: 'Use the meeting only to check whether the wording of the activities is acceptable.',
        feedback:
          'Partly useful, but shallow. Checking wording may help communication, but it does not let people influence risks, barriers, or safer design choices.',
      },
    ],
  },
  {
    id: 'objectives',
    title: 'Strengthening objectives and activities',
    scenario:
      'A weak objective says: “Train 200 community members on legal awareness.” The analysis shows people lack understandable information, local service providers give inconsistent guidance, and some groups fear asking questions publicly.',
    question: 'Which revised objective is strongest?',
    correctId: 'D',
    takeaway: 'HRBA objectives should connect analysis to change, not only reword activities.',
    choices: [
      {
        id: 'A',
        text: 'Train 200 people on legal awareness in three districts.',
        feedback:
          'Output-focused. It says what the project will deliver, but not what barrier or rights-based change it aims to improve.',
      },
      {
        id: 'B',
        text: 'Increase community knowledge through legal awareness sessions.',
        feedback:
          'Better, but still too general. Knowledge matters, but the objective does not address safety, referral clarity, or uneven access.',
      },
      {
        id: 'C',
        text: 'Increase attendance at legal awareness events by 30 percent.',
        feedback:
          'Useful as a possible monitoring measure, but not a strong objective. Higher attendance does not necessarily mean safer or more equitable access.',
      },
      {
        id: 'D',
        text: 'Improve safe and equitable access to understandable legal information by strengthening outreach, referral clarity, and confidential question pathways.',
        feedback:
          'Correct. This objective responds to the actual barriers in the analysis: information, safety, outreach, referral clarity, and confidential question pathways.',
      },
    ],
  },
];

const module3PortfolioFields: PortfolioField[] = [
  {
    key: 'projectDesignIssue',
    label: 'What was weak or missing in the original project idea?',
    example:
      'The project idea focused on training and targets, but it did not clearly analyze rights-holders, barriers, actor responsibilities, participation, or risks.',
  },
  {
    key: 'reframedProblem',
    label: 'How can the problem be framed through a rights lens?',
    example:
      'Some people may be unable to benefit because information, access, participation, and decision-making power are uneven, and responsibilities are not yet clear.',
  },
  {
    key: 'rightsHolderFocus',
    label: 'Who needs to be considered more specifically?',
    example:
      'People who may be less visible in a broad target group, including those facing barriers linked to gender, age, disability, location, workload, language, or social power.',
  },
  {
    key: 'actorsAndResponsibilities',
    label: 'Which actors and responsibilities matter for the design?',
    example:
      'Rights-holders should shape the design; duty-bearers and service actors may hold responsibilities; the CSO should support, connect, facilitate, document, and advocate without taking over every role.',
  },
  {
    key: 'designImprovement',
    label: 'What is one design improvement you would make?',
    example:
      'Strengthen the objective and activity package so it addresses barriers, improves access to information, widens meaningful participation, and clarifies follow-up responsibilities.',
  },
  {
    key: 'riskAndSafeguard',
    label: 'What risk should the design check before implementation?',
    example:
      'The project could unintentionally exclude quieter or less connected people. The design should include safe participation routes, clear criteria, and a feedback pathway.',
  },
];

const module3CarryForwardHabits = [
  'I will not start with activities before checking barriers and responsibilities.',
  'I will ask who may be missed by a broad target group.',
  'I will check whether rights-holders can influence design decisions before they are fixed.',
  'I will test project objectives against barriers, capacity gaps, and do-no-harm risks.',
  'Write my own safe habit.',
];

const routes: Record<string, string> = {
  'M3-S1-01': '/module-3/screen-3-1',
  'M3-S1-02': '/module-3/screen-3-2',
  'M3-S1-03': '/module-3/screen-3-3',
  'M3-S1-03A': '/module-3/screen-3-3a',
  'M3-S1-03B': '/module-3/screen-3-3b',
  'M3-S1-03C': '/module-3/screen-3-3c',
  'M3-S1-03D': '/module-3/screen-3-3d',
  'M3-S1-04': '/module-3/screen-3-4',
  'M3-S1-05': '/module-3/screen-3-5',
  'M3-S1-06': '/module-3/screen-3-6',
  'M3-S1-06A': '/module-3/screen-3-6a',
  'M3-S1-06B': '/module-3/screen-3-6b',
  'M3-S1-06C': '/module-3/screen-3-6c',
  'M3-S1-07': '/module-3/screen-3-7',
  'M3-S1-08': '/module-3/screen-3-8',
  'M3-S1-09': '/module-3/screen-3-9',
  'M3-S1-09A': '/module-3/screen-3-9a',
  'M3-S1-10': '/module-3/screen-3-10',
  'M3-S1-11': '/module-3/screen-3-11',
  'M3-S1-12': '/module-3/screen-3-12',
  'M3-S1-13': '/module-3/screen-3-13',
  'M3-S1-14': '/module-3/screen-3-14',
  'M3-S1-15': '/module-3/screen-3-15',
  'M3-S1-16': '/module-3/screen-3-16',
  'M3-S1-16A': '/module-3/screen-3-16a',
  'M3-S1-16B': '/module-3/screen-3-16b',
  'M3-S1-17': '/module-3/screen-3-17',
  'M3-S1-18': '/module-3/screen-3-18',
  'M3-S1-19': '/module-3/screen-3-19',
  'M3-S1-20': '/module-3/screen-3-20',
  'M3-S1-21': '/module-3/screen-3-21',
  'M3-S1-22': '/module-3/screen-3-22',
  'M3-S1-23': '/module-3/screen-3-23',
  'M3-S1-24': '/module-3/screen-3-24',
  'M3-S1-25': '/module-3/screen-3-25',
  'M3-PLAYER-COMPLETE': '/module-3/complete',
};

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

function ModuleContextLabel({ children }: { children: string }) {
  return <p className="m3-context-label">{children}</p>;
}

function ScreenTitle({
  id,
  children,
  lead,
}: {
  id: string;
  children: string;
  lead?: string;
}) {
  return (
    <div className="m3-title-block">
      <h1 id={id}>{children}</h1>
      {lead && <p>{lead}</p>}
    </div>
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
    <button type="button" className="m3-primary-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" className="m3-secondary-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function ProgressChip({ children }: { children: ReactNode }) {
  return (
    <span className="m3-progress-chip" aria-live="polite">
      {children}
    </span>
  );
}

function QuoteBlock({ children }: { children: string }) {
  return <blockquote className="m3-quote-block">{children}</blockquote>;
}

function StatementCard({
  heading,
  children,
  dark = false,
}: {
  heading: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={`m3-statement-card ${dark ? 'm3-statement-card--dark' : ''}`}>
      <p className="m3-card-kicker">Design insight</p>
      <h2>{heading}</h2>
      <div>{children}</div>
    </section>
  );
}

function NoteBlock({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="m3-note-block">
      <p className="m3-card-kicker">Pause and check</p>
      <h2>{heading}</h2>
      <div>{children}</div>
    </section>
  );
}

function Module3IntroVideoScreen({ onChangeState }: Module3RendererProps) {
  const videoUrl = module3IntroVideoUrl.trim();

  return (
    <main className="m3-screen m3-intro-video-screen" aria-labelledby="m3-intro-title">
      <section className="m3-intro-video-card">
        <div className="m3-intro-video-copy">
          <ModuleContextLabel>MODULE 3 · APPLYING HRBA IN PROJECT DESIGN</ModuleContextLabel>
          <ScreenTitle
            id="m3-intro-title"
            lead="Watch this short introduction to see how Module 3 will help you move from a project idea to a stronger rights-based project design."
          >
            Before you begin
          </ScreenTitle>
        </div>

        <div className="m3-video-frame" aria-label="Module 3 intro video">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title="Module 3 Intro Video: Designing Projects Through a Rights Lens"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="m3-video-placeholder">
              <span>Intro video placeholder</span>
              <p>Video will appear here when a URL is added.</p>
            </div>
          )}
        </div>

        <div className="m3-video-transcript" aria-label="Video transcript">
          <p className="m3-card-kicker">Transcript</p>
          <p>Transcript will be added here.</p>
        </div>

        <div className="m3-intro-video-actions">
          <PrimaryButton
            onClick={() =>
              completeScreen(
                'M3-S1-01',
                'M3-S1-02',
                routes['M3-S1-02'],
                onChangeState,
                'module3_intro_video',
              )
            }
          >
            Continue to learning objectives
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}

function Module3LearningObjectivesScreen({ onChangeState }: Module3RendererProps) {
  return (
    <main className="m3-screen m3-objectives-screen" aria-labelledby="m3-objectives-title">
      <section className="m3-objectives-layout">
        <div className="m3-objectives-copy">
          <ModuleContextLabel>MODULE 3 · APPLYING HRBA IN PROJECT DESIGN</ModuleContextLabel>
          <h1 id="m3-objectives-title">Learning Objectives</h1>
          <p className="m3-objectives-subtitle">What you will be able to do</p>
          <p>
            In this module, you will practice moving from a project idea to a design that is clearer,
            more accountable, and more useful for CSO project decisions.
          </p>
          <div className="m3-objectives-closing">
            <p>A stronger project design starts before the activity list.</p>
          </div>
        </div>

        <div className="m3-objective-grid" aria-label="Module 3 learning objectives">
          {module3LearningObjectives.map((objective, index) => (
            <article className="m3-objective-card" key={objective}>
              <span className="m3-objective-number">{index + 1}</span>
              <p>{objective}</p>
            </article>
          ))}
        </div>

        <div className="m3-objectives-footer">
          <PrimaryButton
            onClick={() =>
              completeScreen(
                'M3-S1-02',
                'M3-S1-03',
                routes['M3-S1-03'],
                onChangeState,
                'module3_learning_objectives',
              )
            }
          >
            Continue
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}

function Module3DesignSnapshotScreen({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_design_snapshot || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-04');
  const [selectedByPart, setSelectedByPart] = useState<Record<string, string>>(
    (stored.selectedByPart as Record<string, string>) || {},
  );
  const [activePartId, setActivePartId] = useState<string>(
    (stored.activePartId as string) || snapshotParts[0].id,
  );
  const [microAnswer, setMicroAnswer] = useState<string>((stored.microAnswer as string) || '');

  const completedCount = snapshotParts.filter((part) => selectedByPart[part.id]).length;
  const allPartsComplete = completedCount === snapshotParts.length;
  const activePart = snapshotParts.find((part) => part.id === activePartId) || snapshotParts[0];
  const selectedOptionId = selectedByPart[activePart.id] || '';
  const activeFeedback = activePart.options.find((option) => option.id === selectedOptionId);
  const selectedMicro = snapshotMicroOptions.find((option) => option.id === microAnswer);
  const canContinue = allPartsComplete && Boolean(microAnswer);

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_design_snapshot', patch),
    }));
  };

  const selectOption = (partId: string, optionId: string) => {
    const next = { ...selectedByPart, [partId]: optionId };
    setSelectedByPart(next);
    setActivePartId(partId);
    persist({ selectedByPart: next, activePartId: partId });
  };

  const selectMicroAnswer = (optionId: string) => {
    setMicroAnswer(optionId);
    persist({ microAnswer: optionId });
  };

  return (
    <main className="m3-screen m3-design-snapshot-screen" aria-labelledby="m3-design-snapshot-title">
      <section className="m3-design-snapshot-shell">
        <header className="m3-design-snapshot-header">
          <div>
            <ModuleContextLabel>MODULE 3 · DESIGN STUDIO</ModuleContextLabel>
            <h1 id="m3-design-snapshot-title">Build the HRBA Design Snapshot</h1>
            <p className="m3-design-snapshot-subtitle">
              Turn a broad project idea into a stronger rights-based design starting point.
            </p>
          </div>
          <p>
            A rights-based project design should not begin by adding HRBA words to a proposal. It should
            begin with a practical snapshot of the situation: who is affected, what barriers shape access,
            which responsibilities matter, how people can influence decisions, and what the problem really is.
          </p>
        </header>

        <div className="m3-design-snapshot-grid">
          <aside className="m3-snapshot-case-card" aria-labelledby="m3-snapshot-case-title">
            <p className="m3-card-kicker">Fictional project case</p>
            <h2 id="m3-snapshot-case-title">Livelihood Skills for Vulnerable Community Members</h2>
            <blockquote>
              "Vulnerable community members lack livelihood skills. The project will train 300 people and
              provide coaching support."
            </blockquote>
            <p>
              Quick team notes suggest that some people may hear about opportunities late, face care
              responsibilities or mobility barriers, not understand selection criteria, or not feel safe
              questioning local representatives.
            </p>
            <div
              className="m3-snapshot-progress"
              role="status"
              aria-live="polite"
              aria-label={`${completedCount} of 5 snapshot parts completed`}
            >
              <strong>{completedCount} of 5</strong>
              <span>snapshot parts completed</span>
            </div>
          </aside>

          <section className="m3-snapshot-builder-card" aria-labelledby="m3-snapshot-builder-title">
            <div className="m3-snapshot-builder-head">
              <div>
                <p className="m3-card-kicker">Interactive builder</p>
                <h2 id="m3-snapshot-builder-title">Five design questions before activities are finalized</h2>
              </div>
              <span className="m3-snapshot-counter" aria-hidden="true">
                {completedCount}/5
              </span>
            </div>

            <div className="m3-snapshot-step-tabs" role="tablist" aria-label="Snapshot parts">
              {snapshotParts.map((part, index) => {
                const isActive = part.id === activePart.id;
                const isComplete = Boolean(selectedByPart[part.id]);
                return (
                  <button
                    key={part.id}
                    type="button"
                    className={`m3-snapshot-step-tab ${isActive ? 'is-active' : ''} ${isComplete ? 'is-complete' : ''}`}
                    onClick={() => {
                      setActivePartId(part.id);
                      persist({ activePartId: part.id });
                    }}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <span>{index + 1}</span>
                    <strong>{part.title}</strong>
                  </button>
                );
              })}
            </div>

            <article className="m3-snapshot-question-card" role="tabpanel">
              <p className="m3-card-kicker">{activePart.title}</p>
              <h3>{activePart.prompt}</h3>
              <div className="m3-snapshot-option-list" aria-label={`${activePart.title} options`}>
                {activePart.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`m3-snapshot-option ${isSelected ? 'is-selected' : ''} ${isSelected && option.correct ? 'is-correct' : ''}`}
                      onClick={() => selectOption(activePart.id, option.id)}
                      aria-pressed={isSelected}
                    >
                      <span>{option.id}</span>
                      <strong>{option.text}</strong>
                    </button>
                  );
                })}
              </div>
              <div className="m3-snapshot-feedback" aria-live="polite">
                {activeFeedback ? (
                  <>
                    <strong>{activeFeedback.correct ? 'Strong choice' : 'Feedback'}</strong>
                    <p>{activeFeedback.feedback}</p>
                  </>
                ) : (
                  <p>Select one phrase to see feedback for this snapshot part.</p>
                )}
              </div>
            </article>
          </section>
        </div>

        <section
          className={`m3-snapshot-bottom-zone ${allPartsComplete ? 'is-unlocked' : ''}`}
          aria-labelledby="m3-snapshot-preview-title"
        >
          {allPartsComplete ? (
            <>
              <article className="m3-snapshot-preview-card">
                <p className="m3-card-kicker">Generated design snapshot preview</p>
                <h2 id="m3-snapshot-preview-title">Your HRBA design snapshot</h2>
                <p>
                  The project is not only about delivering livelihood training. Some rights-holders -
                  including youth outside formal networks, women with unpaid care responsibilities, persons
                  with disabilities, and households affected by displacement - may face unequal access to
                  livelihood opportunities because information, timing, mobility, care responsibilities,
                  disability access, selection influence, and follow-up are not equally accessible.
                </p>
                <p>
                  The design should therefore strengthen inclusive information-sharing, transparent
                  selection, meaningful participation, accessible delivery, coordination with responsible
                  local actors, and safe ways for people to raise concerns before activities and targets are
                  finalized.
                </p>
                <strong>What information would you need before turning this project idea into objectives and activities?</strong>
              </article>

              <article className="m3-snapshot-micro-card" aria-labelledby="m3-snapshot-micro-title">
                <p className="m3-card-kicker">Quick check</p>
                <h2 id="m3-snapshot-micro-title">
                  Which sentence best describes the purpose of an HRBA design snapshot?
                </h2>
                <div className="m3-snapshot-micro-options">
                  {snapshotMicroOptions.map((option) => {
                    const isSelected = microAnswer === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`m3-snapshot-micro-option ${isSelected ? 'is-selected' : ''} ${isSelected && option.correct ? 'is-correct' : ''}`}
                        onClick={() => selectMicroAnswer(option.id)}
                        aria-pressed={isSelected}
                      >
                        <span>{option.id}</span>
                        <strong>{option.text}</strong>
                      </button>
                    );
                  })}
                </div>
                <div className="m3-snapshot-feedback m3-snapshot-feedback--micro" aria-live="polite">
                  {selectedMicro ? (
                    <>
                      <strong>{selectedMicro.correct ? 'Correct' : 'Feedback'}</strong>
                      <p>{selectedMicro.feedback}</p>
                    </>
                  ) : (
                    <p>Answer the quick check to unlock Continue.</p>
                  )}
                </div>
              </article>

              <aside className="m3-snapshot-continue-card">
                <p>
                  A strong HRBA project design does not start with activities. It starts with a clearer
                  snapshot of people, barriers, responsibilities, participation, risk, and the change the
                  project should support.
                </p>
                <PrimaryButton
                  disabled={!canContinue && !completed}
                  onClick={() =>
                    completeScreen(
                      'M3-S1-04',
                      'M3-S1-05',
                      routes['M3-S1-05'],
                      onChangeState,
                      'module3_design_snapshot',
                      { selectedByPart, microAnswer },
                    )
                  }
                >
                  Continue
                </PrimaryButton>
              </aside>
            </>
          ) : (
            <article className="m3-snapshot-locked-preview">
              <p className="m3-card-kicker">Snapshot preview locked</p>
              <h2 id="m3-snapshot-preview-title">Complete all five parts to generate your HRBA design snapshot.</h2>
              <p>You do not need a long research report. You need enough analysis to avoid designing from assumptions.</p>
              <PrimaryButton disabled onClick={() => undefined}>
                Continue
              </PrimaryButton>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}

function Module3RightsActorsScreen({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_rights_actors_map || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-05');
  const [selectedByPart, setSelectedByPart] = useState<Record<string, string>>(
    (stored.selectedByPart as Record<string, string>) || {},
  );
  const [activePartId, setActivePartId] = useState<string>(
    (stored.activePartId as string) || actorMapParts[0].id,
  );
  const [microAnswer, setMicroAnswer] = useState<string>((stored.microAnswer as string) || '');

  const completedCount = actorMapParts.filter((part) => selectedByPart[part.id]).length;
  const allPartsComplete = completedCount === actorMapParts.length;
  const activePart = actorMapParts.find((part) => part.id === activePartId) || actorMapParts[0];
  const selectedOptionId = selectedByPart[activePart.id] || '';
  const activeFeedback = activePart.options.find((option) => option.id === selectedOptionId);
  const selectedMicro = actorMapMicroOptions.find((option) => option.id === microAnswer);
  const canContinue = allPartsComplete && Boolean(microAnswer);

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_rights_actors_map', patch),
    }));
  };

  const selectPartOption = (partId: string, optionId: string) => {
    const next = { ...selectedByPart, [partId]: optionId };
    setSelectedByPart(next);
    setActivePartId(partId);
    persist({ selectedByPart: next, activePartId: partId });
  };

  const selectMicroAnswer = (optionId: string) => {
    setMicroAnswer(optionId);
    persist({ microAnswer: optionId });
  };

  return (
    <main className="m3-screen m3-rights-actors-screen" aria-labelledby="m3-rights-actors-title">
      <section className="m3-rights-actors-shell">
        <header className="m3-rights-actors-header">
          <div>
            <ModuleContextLabel>MODULE 3 · APPLYING HRBA IN PROJECT DESIGN</ModuleContextLabel>
            <h1 id="m3-rights-actors-title">Design for Rights-Holders, Actors, and Responsibilities</h1>
            <p className="m3-rights-actors-subtitle">
              A project design becomes stronger when it is clear who is affected, who may be missed, who has
              responsibility, and what role the CSO should play.
            </p>
          </div>
          <p>
            A rights-based project design should not use broad labels like "the community" or "project
            participants" without looking deeper. Different people may face different barriers, and different
            actors may hold different responsibilities or influence.
          </p>
        </header>

        <div className="m3-rights-actors-body">
          <aside className="m3-actor-project-card" aria-labelledby="m3-actor-project-title">
            <p className="m3-card-kicker">Project concept card</p>
            <h2 id="m3-actor-project-title">Cooperative market access project</h2>
            <p>
              A local CSO plans to train cooperative members, connect them to buyers, and support group
              marketing.
            </p>
            <p>
              Early discussions show that not all members experience the cooperative in the same way. Some
              receive information early, some rarely speak in meetings, some have care responsibilities, some
              live farther away, and some depend on others to understand pricing or buyer terms.
            </p>
            <div className="m3-actor-map-visual" role="img" aria-label="Actor and rights-holder map around a cooperative market access project">
              <strong>Cooperative market access project</strong>
              <span>Different cooperative members</span>
              <span>Cooperative leaders</span>
              <span>Buyers</span>
              <span>Local officials</span>
              <span>Extension workers</span>
              <span>Family/community influences</span>
              <span>CSO role</span>
            </div>
            <div
              className="m3-actor-progress"
              role="status"
              aria-live="polite"
              aria-label={`${completedCount} of 3 map sections completed`}
            >
              <strong>{completedCount} of 3</strong>
              <span>map sections completed</span>
            </div>
          </aside>

          <section className="m3-actor-builder-card" aria-labelledby="m3-actor-builder-title">
            <div className="m3-actor-builder-head">
              <div>
                <p className="m3-card-kicker">Map builder</p>
                <h2 id="m3-actor-builder-title">Build the rights-holder and actor map</h2>
                <p>Review the project concept and complete the three-part design map.</p>
              </div>
              <span aria-hidden="true">{completedCount}/3</span>
            </div>

            <div className="m3-actor-step-tabs" role="tablist" aria-label="Rights-holder and actor map sections">
              {actorMapParts.map((part, index) => {
                const isActive = activePart.id === part.id;
                const isComplete = Boolean(selectedByPart[part.id]);
                return (
                  <button
                    key={part.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`m3-actor-step-tab ${isActive ? 'is-active' : ''} ${isComplete ? 'is-complete' : ''}`}
                    onClick={() => {
                      setActivePartId(part.id);
                      persist({ activePartId: part.id });
                    }}
                  >
                    <span>{index + 1}</span>
                    <strong>{part.title}</strong>
                  </button>
                );
              })}
            </div>

            <article className="m3-actor-question-card" role="tabpanel">
              <p className="m3-card-kicker">{activePart.title}</p>
              <h3>{activePart.prompt}</h3>
              <div className="m3-actor-option-list" aria-label={`${activePart.title} options`}>
                {activePart.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`m3-actor-option ${isSelected ? 'is-selected' : ''} ${isSelected && option.correct ? 'is-correct' : ''}`}
                      onClick={() => selectPartOption(activePart.id, option.id)}
                      aria-pressed={isSelected}
                    >
                      <span>{option.id}</span>
                      <strong>{option.text}</strong>
                    </button>
                  );
                })}
              </div>
              <div className="m3-actor-feedback" aria-live="polite">
                {activeFeedback ? (
                  <>
                    <strong>{activeFeedback.correct ? 'Correct' : 'Feedback'}</strong>
                    <p>{activeFeedback.feedback}</p>
                  </>
                ) : (
                  <p>Choose the strongest option in this map section to see feedback.</p>
                )}
              </div>
            </article>
          </section>
        </div>

        <section
          className={`m3-actor-bottom-zone ${allPartsComplete ? 'is-unlocked' : ''}`}
          aria-labelledby="m3-actor-preview-title"
        >
          {allPartsComplete ? (
            <>
              <article className="m3-actor-preview-card">
                <p className="m3-card-kicker">Generated design map preview</p>
                <h2 id="m3-actor-preview-title">My HRBA design map</h2>
                <p>
                  <strong>Rights-holder focus:</strong> Identify which cooperative members face different
                  barriers to information, participation, mobility, decision-making, and market access.
                </p>
                <p>
                  <strong>Barrier focus:</strong> Check information flow, meeting timing, language, confidence
                  to speak, care workload, mobility, and influence over buyer decisions.
                </p>
                <p>
                  <strong>Actor/responsibility focus:</strong> Map cooperative members, leaders, buyers, local
                  officials, extension workers, family/community influences, and the CSO's role as facilitator,
                  connector, evidence holder, and accountability ally.
                </p>
              </article>

              <article className="m3-actor-micro-card" aria-labelledby="m3-actor-micro-title">
                <p className="m3-card-kicker">Quick check</p>
                <h2 id="m3-actor-micro-title">What is the main design lesson from this screen?</h2>
                <div className="m3-actor-micro-options">
                  {actorMapMicroOptions.map((option) => {
                    const isSelected = microAnswer === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`m3-actor-micro-option ${isSelected ? 'is-selected' : ''} ${isSelected && option.correct ? 'is-correct' : ''}`}
                        onClick={() => selectMicroAnswer(option.id)}
                        aria-pressed={isSelected}
                      >
                        <span>{option.id}</span>
                        <strong>{option.text}</strong>
                      </button>
                    );
                  })}
                </div>
                <div className="m3-actor-feedback m3-actor-feedback--micro" aria-live="polite">
                  {selectedMicro ? (
                    <>
                      <strong>{selectedMicro.correct ? 'Correct' : 'Feedback'}</strong>
                      <p>{selectedMicro.feedback}</p>
                    </>
                  ) : (
                    <p>Answer the quick check to unlock Continue.</p>
                  )}
                </div>
              </article>

              <aside className="m3-actor-continue-card">
                <p>
                  A rights-based project design does not treat people as one uniform target group. It asks
                  who may experience the opportunity differently, what barriers shape that experience, which
                  actors have responsibility or influence, and how the CSO can support change without taking over.
                </p>
                <PrimaryButton
                  disabled={!canContinue && !completed}
                  onClick={() =>
                    completeScreen(
                      'M3-S1-05',
                      'M3-S1-06',
                      routes['M3-S1-06'],
                      onChangeState,
                      'module3_rights_actors_map',
                      { selectedByPart, microAnswer },
                    )
                  }
                >
                  Continue
                </PrimaryButton>
              </aside>
            </>
          ) : (
            <article className="m3-actor-locked-preview">
              <p className="m3-card-kicker">Design map preview locked</p>
              <h2 id="m3-actor-preview-title">Complete all three map sections to generate your HRBA design map.</h2>
              <p>
                Start with rights-holders, then check barriers, then clarify actors, responsibilities, and the
                CSO role.
              </p>
              <PrimaryButton disabled onClick={() => undefined}>
                Continue
              </PrimaryButton>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}

function Module3DiagnosisLabScreen({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_s07_diagnosis_lab || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-06');
  const [activePartId, setActivePartId] = useState<string>(
    (stored.activePartId as string) || diagnosisLabParts[0].id,
  );
  const [choices, setChoices] = useState<Record<string, string>>({
    m3_s07_rootCauseChoice: (stored.m3_s07_rootCauseChoice as string) || '',
    m3_s07_capacityGapChoice: (stored.m3_s07_capacityGapChoice as string) || '',
    m3_s07_participationRiskChoice: (stored.m3_s07_participationRiskChoice as string) || '',
    m3_s07_microCheckChoice: (stored.m3_s07_microCheckChoice as string) || '',
  });

  const completedCount = diagnosisLabParts.filter((part) => choices[part.stateKey]).length;
  const allPartsComplete = completedCount === diagnosisLabParts.length;
  const activePart = diagnosisLabParts.find((part) => part.id === activePartId) || diagnosisLabParts[0];
  const selectedOptionId = choices[activePart.stateKey] || '';
  const activeFeedback = activePart.options.find((option) => option.id === selectedOptionId);
  const selectedMicro = diagnosisMicroOptions.find((option) => option.id === choices.m3_s07_microCheckChoice);
  const canContinue = allPartsComplete && Boolean(choices.m3_s07_microCheckChoice);

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_s07_diagnosis_lab', patch),
    }));
  };

  const selectPartOption = (partId: string, stateKey: string, optionId: string) => {
    const next = { ...choices, [stateKey]: optionId };
    setChoices(next);
    setActivePartId(partId);
    persist({ ...next, activePartId: partId, m3_s07_completed: false });
  };

  const selectMicroAnswer = (optionId: string) => {
    const next = { ...choices, m3_s07_microCheckChoice: optionId };
    setChoices(next);
    persist({ ...next, m3_s07_completed: allPartsComplete });
  };

  return (
    <main className="m3-screen m3-diagnosis-lab-screen" aria-labelledby="m3-diagnosis-lab-title">
      <section className="m3-diagnosis-lab-shell">
        <header className="m3-diagnosis-lab-header">
          <div>
            <ModuleContextLabel>MODULE 3 · APPLYING HRBA IN PROJECT DESIGN</ModuleContextLabel>
            <h1 id="m3-diagnosis-lab-title">Find the Root Cause, Capacity Gap, and Participation Risk</h1>
            <p className="m3-diagnosis-lab-subtitle">
              A rights-based project design should not respond only to the first visible problem. It should
              ask why the problem exists, whose capacity is limited, and whether the design process itself may exclude people.
            </p>
          </div>
          <p>
            Before choosing activities, a CSO needs to understand the symptom and root cause, whose capacity
            gap is shaping the problem, and what participation risk could weaken the design before implementation starts.
          </p>
        </header>

        <div className="m3-diagnosis-lab-body">
          <aside className="m3-diagnosis-project-card" aria-labelledby="m3-diagnosis-project-title">
            <p className="m3-card-kicker">Project concept card</p>
            <h2 id="m3-diagnosis-project-title">Cooperative market access project</h2>
            <blockquote>
              "Cooperative members do not sell enough products to better buyers. The project will provide
              business training, buyer-linkage events, and group-marketing support."
            </blockquote>
            <p>
              The team hears that some members do not understand buyer terms, rarely receive price
              information before meetings, have limited time for planning sessions, or feel market decisions
              are already shaped by a few confident people.
            </p>
            <div className="m3-root-cause-visual" role="img" aria-label="Layered diagnosis showing symptom, root causes, capacity gaps, and participation risks">
              <span>Visible symptom</span>
              <strong>Low sales to better buyers</strong>
              <span>Root causes and barriers</span>
              <strong>Information, voice, buyer terms, power dynamics</strong>
              <span>Capacity gaps and participation risks</span>
              <strong>Skills, decision processes, fair engagement, influence</strong>
            </div>
            <div
              className="m3-diagnosis-progress"
              role="status"
              aria-live="polite"
              aria-label={`${completedCount} of 3 diagnosis sections completed`}
            >
              <strong>{completedCount} of 3</strong>
              <span>diagnosis sections completed</span>
            </div>
          </aside>

          <section className="m3-diagnosis-builder-card" aria-labelledby="m3-diagnosis-builder-title">
            <div className="m3-diagnosis-builder-head">
              <div>
                <p className="m3-card-kicker">Diagnosis lab</p>
                <h2 id="m3-diagnosis-builder-title">Diagnose the deeper design issue</h2>
                <p>Review the project concept and complete the three-part diagnosis.</p>
              </div>
              <span aria-hidden="true">{completedCount}/3</span>
            </div>

            <div className="m3-diagnosis-step-tabs" role="tablist" aria-label="Diagnosis sections">
              {diagnosisLabParts.map((part, index) => {
                const isActive = activePart.id === part.id;
                const isComplete = Boolean(choices[part.stateKey]);
                return (
                  <button
                    key={part.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`m3-diagnosis-step-tab ${isActive ? 'is-active' : ''} ${isComplete ? 'is-complete' : ''}`}
                    onClick={() => {
                      setActivePartId(part.id);
                      persist({ activePartId: part.id });
                    }}
                  >
                    <span>{index + 1}</span>
                    <strong>{part.title}</strong>
                  </button>
                );
              })}
            </div>

            <article className="m3-diagnosis-question-card" role="tabpanel">
              <p className="m3-card-kicker">{activePart.title}</p>
              <h3>{activePart.prompt}</h3>
              <div className="m3-diagnosis-option-list" aria-label={`${activePart.title} options`}>
                {activePart.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`m3-diagnosis-option ${isSelected ? 'is-selected' : ''} ${isSelected && option.correct ? 'is-correct' : ''}`}
                      onClick={() => selectPartOption(activePart.id, activePart.stateKey, option.id)}
                      aria-pressed={isSelected}
                    >
                      <span>{option.id}</span>
                      <strong>{option.text}</strong>
                    </button>
                  );
                })}
              </div>
              <div className="m3-diagnosis-feedback" aria-live="polite">
                {activeFeedback ? (
                  <>
                    <strong>{activeFeedback.correct ? 'Correct' : 'Feedback'}</strong>
                    <p>{activeFeedback.feedback}</p>
                  </>
                ) : (
                  <p>Choose the strongest option in this diagnosis section to see feedback.</p>
                )}
              </div>
            </article>
          </section>
        </div>

        <section
          className={`m3-diagnosis-bottom-zone ${allPartsComplete ? 'is-unlocked' : ''}`}
          aria-labelledby="m3-diagnosis-preview-title"
        >
          {allPartsComplete ? (
            <>
              <article className="m3-diagnosis-preview-card">
                <p className="m3-card-kicker">Generated diagnosis preview</p>
                <h2 id="m3-diagnosis-preview-title">My deeper design diagnosis</h2>
                <p>
                  <strong>Root-cause focus:</strong> Low sales may be a symptom. The design should examine
                  whether unequal access to information, weak voice in market decisions, buyer practices, and
                  internal cooperative power dynamics are shaping the problem.
                </p>
                <p>
                  <strong>Capacity-gap focus:</strong> Rights-holders may need stronger market knowledge and
                  confidence; cooperative leaders may need clearer and more inclusive decision processes;
                  buyers or service actors may need clearer expectations for fair and transparent engagement.
                </p>
                <p>
                  <strong>Participation-risk focus:</strong> The design may rely too heavily on the most
                  confident members, leaving quieter or newer members present but not influential.
                </p>
              </article>

              <article className="m3-diagnosis-micro-card" aria-labelledby="m3-diagnosis-micro-title">
                <p className="m3-card-kicker">Quick check</p>
                <h2 id="m3-diagnosis-micro-title">What is the main design lesson from this screen?</h2>
                <div className="m3-diagnosis-micro-options">
                  {diagnosisMicroOptions.map((option) => {
                    const isSelected = choices.m3_s07_microCheckChoice === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`m3-diagnosis-micro-option ${isSelected ? 'is-selected' : ''} ${isSelected && option.correct ? 'is-correct' : ''}`}
                        onClick={() => selectMicroAnswer(option.id)}
                        aria-pressed={isSelected}
                      >
                        <span>{option.id}</span>
                        <strong>{option.text}</strong>
                      </button>
                    );
                  })}
                </div>
                <div className="m3-diagnosis-feedback m3-diagnosis-feedback--micro" aria-live="polite">
                  {selectedMicro ? (
                    <>
                      <strong>{selectedMicro.correct ? 'Correct' : 'Feedback'}</strong>
                      <p>{selectedMicro.feedback}</p>
                    </>
                  ) : (
                    <p>Answer the quick check to unlock Continue.</p>
                  )}
                </div>
              </article>

              <aside className="m3-diagnosis-continue-card">
                <p>
                  A strong HRBA project design does not stop at the symptom. It asks what is causing the
                  problem, whose capacity needs to be strengthened, and whether different rights-holders can
                  influence decisions.
                </p>
                {canContinue && (
                  <strong>Diagnosis complete. You are ready to strengthen the objective and activity package.</strong>
                )}
                <PrimaryButton
                  disabled={!canContinue && !completed}
                  onClick={() =>
                    completeScreen(
                      'M3-S1-06',
                      'M3-S1-06A',
                      routes['M3-S1-06A'],
                      onChangeState,
                      'module3_s07_diagnosis_lab',
                      { ...choices, m3_s07_completed: true },
                    )
                  }
                >
                  Continue
                </PrimaryButton>
              </aside>
            </>
          ) : (
            <article className="m3-diagnosis-locked-preview">
              <p className="m3-card-kicker">Diagnosis preview locked</p>
              <h2 id="m3-diagnosis-preview-title">Complete all three diagnosis sections to generate your deeper design diagnosis.</h2>
              <p>Move from symptom, to root cause, to capacity gap and participation risk before activities are finalized.</p>
              <PrimaryButton disabled onClick={() => undefined}>
                Continue
              </PrimaryButton>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}

function Module3ObjectiveRepairScreen({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_s08_objective_repair || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-06A');
  const [activeStepId, setActiveStepId] = useState<string>((stored.activeStepId as string) || objectiveRepairSteps[0].id);
  const [selectedByStep, setSelectedByStep] = useState<Record<string, string>>(
    (stored.selectedByStep as Record<string, string>) || {},
  );
  const [microAnswer, setMicroAnswer] = useState<string>((stored.microAnswer as string) || '');

  const completedCount = objectiveRepairSteps.filter((step) => selectedByStep[step.id]).length;
  const allStepsComplete = completedCount === objectiveRepairSteps.length;
  const activeStep = objectiveRepairSteps.find((step) => step.id === activeStepId) || objectiveRepairSteps[0];
  const selectedOptionId = selectedByStep[activeStep.id] || '';
  const activeFeedback = activeStep.options.find((option) => option.id === selectedOptionId);
  const selectedMicro = objectiveRepairMicroOptions.find((option) => option.id === microAnswer);
  const canContinue = allStepsComplete && Boolean(microAnswer);

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_s08_objective_repair', patch),
    }));
  };

  const selectStepOption = (stepId: string, optionId: string) => {
    const next = { ...selectedByStep, [stepId]: optionId };
    setSelectedByStep(next);
    setActiveStepId(stepId);
    persist({ selectedByStep: next, activeStepId: stepId, completed: false });
  };

  const selectMicroAnswer = (optionId: string) => {
    setMicroAnswer(optionId);
    persist({ selectedByStep, activeStepId, microAnswer: optionId, completed: allStepsComplete });
  };

  return (
    <main className="m3-screen m3-objective-repair-screen" aria-labelledby="m3-objective-repair-title">
      <section className="m3-objective-repair-shell">
        <header className="m3-objective-repair-header">
          <div>
            <ModuleContextLabel>MODULE 3 · PROJECT DESIGN STUDIO</ModuleContextLabel>
            <h1 id="m3-objective-repair-title">Strengthen the Objective and Activity Package</h1>
            <p className="m3-objective-repair-subtitle">
              Move from “we will deliver activities” to “we will reduce barriers and strengthen accountability.”
            </p>
          </div>
          <p>
            A weak project design often starts with activities. A stronger HRBA design starts with the change
            the project wants to support and checks whether the activity package fits the rights-based problem.
          </p>
        </header>

        <div className="m3-objective-repair-body">
          <aside className="m3-weak-objective-card" aria-labelledby="m3-weak-objective-title">
            <p className="m3-card-kicker">Current draft objective</p>
            <h2 id="m3-weak-objective-title">“Train 300 young women in market skills and support them to join cooperative livelihood activities.”</h2>
            <p>This objective is clear about the activity, but it does not yet show the rights-based change.</p>
            <div className="m3-weak-objective-missing">
              <strong>What is missing?</strong>
              <ul>
                <li>Which barrier is being reduced?</li>
                <li>Which rights-holders need different support?</li>
                <li>Which actors or responsibilities matter?</li>
                <li>How will participation and access improve?</li>
                <li>What will the CSO do without taking over others’ roles?</li>
              </ul>
            </div>
            <div
              className="m3-objective-repair-progress"
              role="status"
              aria-live="polite"
              aria-label={`${completedCount} of 3 repair steps completed`}
            >
              <strong>{completedCount} of 3</strong>
              <span>repair steps completed</span>
            </div>
          </aside>

          <section className="m3-objective-builder-card" aria-labelledby="m3-objective-builder-title">
            <div className="m3-objective-builder-head">
              <div>
                <p className="m3-card-kicker">Design repair builder</p>
                <h2 id="m3-objective-builder-title">Complete the three repair steps</h2>
                <p>Select the strongest option in each step.</p>
              </div>
              <span aria-hidden="true">{completedCount}/3</span>
            </div>

            <div className="m3-objective-step-tabs" role="tablist" aria-label="Objective and activity repair steps">
              {objectiveRepairSteps.map((step, index) => {
                const isActive = activeStep.id === step.id;
                const isComplete = Boolean(selectedByStep[step.id]);
                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`m3-objective-step-tab ${isActive ? 'is-active' : ''} ${isComplete ? 'is-complete' : ''}`}
                    onClick={() => {
                      setActiveStepId(step.id);
                      persist({ activeStepId: step.id });
                    }}
                  >
                    <span>{index + 1}</span>
                    <strong>{step.title}</strong>
                  </button>
                );
              })}
            </div>

            <article className="m3-objective-question-card" role="tabpanel">
              <p className="m3-card-kicker">{activeStep.title}</p>
              <h3>{activeStep.prompt}</h3>
              <div className="m3-objective-option-list" aria-label={`${activeStep.title} options`}>
                {activeStep.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`m3-objective-option ${isSelected ? 'is-selected' : ''} ${isSelected && option.correct ? 'is-correct' : ''}`}
                      onClick={() => selectStepOption(activeStep.id, option.id)}
                      aria-pressed={isSelected}
                    >
                      <span>{option.id}</span>
                      <strong>{option.text}</strong>
                    </button>
                  );
                })}
              </div>
              <div className="m3-objective-feedback" aria-live="polite">
                {activeFeedback ? (
                  <>
                    <strong>{activeFeedback.correct ? 'Strong selection' : 'Feedback'}</strong>
                    <p>{activeFeedback.feedback}</p>
                  </>
                ) : (
                  <p>Choose one answer card to see feedback for this repair step.</p>
                )}
              </div>
            </article>
          </section>
        </div>

        <section
          className={`m3-objective-bottom-zone ${allStepsComplete ? 'is-unlocked' : ''}`}
          aria-labelledby="m3-objective-preview-title"
        >
          {allStepsComplete ? (
            <>
              <article className="m3-objective-preview-card">
                <p className="m3-card-kicker">Generated design repair preview</p>
                <h2 id="m3-objective-preview-title">Your strengthened HRBA design logic</h2>
                <p><strong>Objective:</strong> Strengthen young women’s safe and equitable access to cooperative livelihood opportunities by reducing information, participation, mobility, and decision-making barriers.</p>
                <p><strong>Activity package:</strong> Use targeted outreach, accessible information, adjusted session timing, safe question channels, cooperative dialogue, and follow-up on selection concerns.</p>
                <p><strong>Minimum evidence check:</strong> Check whether different young women understand the criteria, can realistically participate, know how to ask questions, and see whether concerns receive a response.</p>
              </article>

              <article className="m3-objective-micro-card" aria-labelledby="m3-objective-micro-title">
                <p className="m3-card-kicker">Quick check</p>
                <h2 id="m3-objective-micro-title">Which design habit is most important before finalizing activities?</h2>
                <div className="m3-objective-micro-options">
                  {objectiveRepairMicroOptions.map((option) => {
                    const isSelected = microAnswer === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`m3-objective-micro-option ${isSelected ? 'is-selected' : ''} ${isSelected && option.correct ? 'is-correct' : ''}`}
                        onClick={() => selectMicroAnswer(option.id)}
                        aria-pressed={isSelected}
                      >
                        <span>{option.id}</span>
                        <strong>{option.text}</strong>
                      </button>
                    );
                  })}
                </div>
                <div className="m3-objective-feedback m3-objective-feedback--micro" aria-live="polite">
                  {selectedMicro ? (
                    <>
                      <strong>{selectedMicro.correct ? 'Correct' : 'Feedback'}</strong>
                      <p>{selectedMicro.feedback}</p>
                    </>
                  ) : (
                    <p>Answer the quick check to unlock Continue.</p>
                  )}
                </div>
              </article>

              <aside className="m3-objective-continue-card">
                <p>
                  An HRBA objective names the change the project is trying to support. A coherent activity
                  package shows how that change can happen in practice.
                </p>
                {canContinue && (
                  <strong>A strong HRBA activity package reduces barriers, supports participation, clarifies responsibility, and creates a pathway for response.</strong>
                )}
                <PrimaryButton
                  disabled={!canContinue && !completed}
                  onClick={() =>
                    completeScreen(
                      'M3-S1-06A',
                      'M3-S1-06B',
                      routes['M3-S1-06B'],
                      onChangeState,
                      'module3_s08_objective_repair',
                      { selectedByStep, microAnswer, completed: true },
                    )
                  }
                >
                  Continue
                </PrimaryButton>
              </aside>
            </>
          ) : (
            <article className="m3-objective-locked-preview">
              <p className="m3-card-kicker">Design logic preview locked</p>
              <h2 id="m3-objective-preview-title">Complete all three repair steps to generate your strengthened HRBA design logic.</h2>
              <PrimaryButton disabled onClick={() => undefined}>
                Continue
              </PrimaryButton>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}

function Module3KnowledgeCheckScreen({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_knowledge_check || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-21');
  const [currentIndex, setCurrentIndex] = useState<number>((stored.currentIndex as number) || 0);
  const [answers, setAnswers] = useState<Record<string, string>>(
    (stored.answers as Record<string, string>) || {},
  );
  const [submitted, setSubmitted] = useState<Record<string, boolean>>(
    (stored.submitted as Record<string, boolean>) || {},
  );
  const [showResults, setShowResults] = useState<boolean>(Boolean(stored.showResults || completed));

  const question = module3KnowledgeQuestions[currentIndex] || module3KnowledgeQuestions[0];
  const selectedAnswer = answers[question.id] || '';
  const isSubmitted = Boolean(submitted[question.id]);
  const score = module3KnowledgeQuestions.filter((item) => answers[item.id] === item.correctId).length;
  const resultTitle =
    score >= 5 ? 'Strong project design lens.' : score >= 3 ? 'Good progress.' : 'Keep practicing.';
  const resultText =
    score >= 5
      ? 'You are ready to use HRBA questions before project choices are locked in.'
      : score >= 3
        ? 'Review the feedback carefully, especially where the strongest answer balanced rights, feasibility, participation, and responsibility.'
        : 'HRBA project design takes practice. Review the feedback and revisit the screens on problem framing, rights-holder analysis, actor responsibilities, objectives, and risk.';

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_knowledge_check', patch),
    }));
  };

  const selectAnswer = (choiceId: string) => {
    if (isSubmitted) return;
    const nextAnswers = { ...answers, [question.id]: choiceId };
    setAnswers(nextAnswers);
    persist({ answers: nextAnswers, currentIndex, submitted, showResults: false });
  };

  const submitAnswer = () => {
    if (!selectedAnswer) return;
    const nextSubmitted = { ...submitted, [question.id]: true };
    setSubmitted(nextSubmitted);
    persist({ answers, submitted: nextSubmitted, currentIndex, showResults: false });
  };

  const goNext = () => {
    if (currentIndex === module3KnowledgeQuestions.length - 1) {
      setShowResults(true);
      persist({ answers, submitted, currentIndex, showResults: true, score });
      return;
    }
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    persist({ answers, submitted, currentIndex: nextIndex, showResults: false });
  };

  if (showResults) {
    return (
      <main className="m3-screen m3-knowledge-screen" aria-labelledby="m3-knowledge-results-title">
        <section className="m3-knowledge-results-shell">
          <div className="m3-knowledge-results-copy">
            <ModuleContextLabel>MODULE 3 · KNOWLEDGE CHECK</ModuleContextLabel>
            <h1 id="m3-knowledge-results-title">Module 3 Knowledge Check</h1>
            <p>
              A strong HRBA project design does not begin with activities. It begins with better questions
              about people, barriers, responsibilities, participation, power, and safe action.
            </p>
          </div>

          <article className="m3-knowledge-results-card" role="status" aria-live="polite">
            <span>{score} of {module3KnowledgeQuestions.length}</span>
            <h2>{resultTitle}</h2>
            <p>{resultText}</p>
          </article>

          <div className="m3-knowledge-results-review" aria-label="Knowledge check answer summary">
            {module3KnowledgeQuestions.map((item, index) => {
              const chosen = answers[item.id];
              const isCorrect = chosen === item.correctId;
              return (
                <article key={item.id} className={`m3-knowledge-review-item ${isCorrect ? 'is-correct' : 'is-learning'}`}>
                  <strong>Question {index + 1}</strong>
                  <span>{isCorrect ? 'Strongest answer selected' : `Strongest answer: ${item.correctId}`}</span>
                </article>
              );
            })}
          </div>

          <PrimaryButton
            onClick={() =>
              completeScreen(
                'M3-S1-21',
                'M3-S1-22',
                routes['M3-S1-22'],
                onChangeState,
                'module3_knowledge_check',
                { answers, submitted, showResults: true, score, completed: true },
              )
            }
          >
            Continue
          </PrimaryButton>
        </section>
      </main>
    );
  }

  return (
    <main className="m3-screen m3-knowledge-screen" aria-labelledby="m3-knowledge-title">
      <section className="m3-knowledge-shell">
        <header className="m3-knowledge-header">
          <div>
            <ModuleContextLabel>MODULE 3 · KNOWLEDGE CHECK</ModuleContextLabel>
            <h1 id="m3-knowledge-title">Module 3 Knowledge Check</h1>
            <p>
              You have practiced applying HRBA during project design. Read each situation carefully and choose
              the strongest response.
            </p>
          </div>
          <div className="m3-knowledge-progress" role="status" aria-live="polite">
            <strong>Question {currentIndex + 1} of {module3KnowledgeQuestions.length}</strong>
            <span>{score} strongest so far</span>
          </div>
        </header>

        <section className="m3-knowledge-body">
          <article className="m3-knowledge-question-card">
            <p className="m3-card-kicker">{question.title}</p>
            <h2>{question.question}</h2>
            <div>
              <strong>Scenario</strong>
              <p>{question.scenario}</p>
            </div>
          </article>

          <section className="m3-knowledge-answer-card" aria-label="Answer choices">
            {question.choices.map((choice) => {
              const isSelected = selectedAnswer === choice.id;
              const isCorrect = choice.id === question.correctId;
              return (
                <button
                  key={choice.id}
                  type="button"
                  className={`m3-knowledge-choice ${isSelected ? 'is-selected' : ''} ${isSubmitted && isCorrect ? 'is-correct' : ''} ${isSubmitted && isSelected && !isCorrect ? 'is-learning' : ''}`}
                  onClick={() => selectAnswer(choice.id)}
                  aria-pressed={isSelected}
                  disabled={isSubmitted}
                >
                  <span>{choice.id}</span>
                  <strong>{choice.text}</strong>
                </button>
              );
            })}
          </section>
        </section>

        <section className="m3-knowledge-feedback-zone" aria-live="polite">
          {isSubmitted ? (
            <>
              <article className="m3-knowledge-feedback-panel">
                <p className="m3-card-kicker">Feedback</p>
                <h2>Strongest answer: {question.correctId}</h2>
                <div className="m3-knowledge-feedback-list">
                  {question.choices.map((choice) => (
                    <p
                      key={choice.id}
                      className={`${choice.id === question.correctId ? 'is-correct' : ''} ${choice.id === selectedAnswer ? 'is-selected' : ''}`}
                    >
                      <strong>{choice.id}</strong> {choice.feedback}
                    </p>
                  ))}
                </div>
              </article>
              <aside className="m3-knowledge-takeaway-card">
                <p className="m3-card-kicker">Practical takeaway</p>
                <p>{question.takeaway}</p>
                <PrimaryButton onClick={goNext}>
                  {currentIndex === module3KnowledgeQuestions.length - 1 ? 'View results' : 'Next question'}
                </PrimaryButton>
              </aside>
            </>
          ) : (
            <article className="m3-knowledge-feedback-panel m3-knowledge-feedback-panel--waiting">
              <p>Choose one answer card, then submit to review feedback for all options.</p>
              <PrimaryButton disabled={!selectedAnswer} onClick={submitAnswer}>
                Submit answer
              </PrimaryButton>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}

function Module3PortfolioCheckpointScreen({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3PortfolioSnapshot || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-22');
  const starterValues = module3PortfolioFields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = (stored[field.key] as string) || field.example;
    return acc;
  }, {});
  const storedHabit = (stored.carryForwardHabit as string) || '';
  const storedCustomHabit = (stored.customCarryForwardHabit as string) || '';
  const [values, setValues] = useState<Record<string, string>>(starterValues);
  const [selectedHabit, setSelectedHabit] = useState<string>(
    storedHabit === storedCustomHabit && storedCustomHabit ? 'Write my own safe habit.' : storedHabit,
  );
  const [customHabit, setCustomHabit] = useState<string>(storedCustomHabit);
  const [saved, setSaved] = useState<boolean>(Boolean(stored.status === 'completed' || completed));

  const customHabitRequired = selectedHabit === 'Write my own safe habit.';
  const allFieldsReady = module3PortfolioFields.every((field) => values[field.key]?.trim());
  const habitReady = Boolean(selectedHabit) && (!customHabitRequired || customHabit.trim().length >= 8);
  const canSave = allFieldsReady && habitReady;

  const updateField = (key: PortfolioField['key'], value: string) => {
    setValues((prev) => ({ ...prev, [key]: value.slice(0, 220) }));
    setSaved(false);
  };

  const saveSnapshot = () => {
    if (!canSave) return;
    const snapshot = {
      projectDesignIssue: values.projectDesignIssue.trim(),
      reframedProblem: values.reframedProblem.trim(),
      rightsHolderFocus: values.rightsHolderFocus.trim(),
      actorsAndResponsibilities: values.actorsAndResponsibilities.trim(),
      designImprovement: values.designImprovement.trim(),
      riskAndSafeguard: values.riskAndSafeguard.trim(),
      carryForwardHabit: customHabitRequired ? customHabit.trim() : selectedHabit,
      customCarryForwardHabit: customHabitRequired ? customHabit.trim() : '',
      savedAt: new Date().toISOString(),
      status: 'completed',
    };
    setSaved(true);
    onChangeState((prev) => ({
      ...prev,
      screenProgress: addProgress(prev, 'M3-S1-22'),
      practiceCheckState: updatePracticeState(prev, 'module3PortfolioSnapshot', snapshot),
    }));
  };

  const continueToNext = () => {
    onChangeState((prev) => ({
      ...prev,
      currentScreenId: 'M3-S1-23',
      screenProgress: addProgress(prev, 'M3-S1-22'),
    }));
    setRoute(routes['M3-S1-23']);
  };

  return (
    <main className="m3-screen m3-portfolio-screen" aria-labelledby="m3-portfolio-title">
      <section className="m3-portfolio-shell">
        <aside className="m3-portfolio-left">
          <div>
            <ModuleContextLabel>MODULE 3 · PORTFOLIO CHECKPOINT</ModuleContextLabel>
            <h1 id="m3-portfolio-title">Portfolio Checkpoint: My HRBA Project Design Improvement Snapshot</h1>
            <p>
              Review the project design improvement snapshot you built in this module. Edit only if needed,
              then save a safe, general version to <strong>My Portfolio</strong>.
            </p>
          </div>

          <article className="m3-portfolio-safety-card">
            <strong>Keep this safe and general.</strong>
            <p>
              Do not enter real names, active complaints, safeguarding details, legal disputes, confidential
              project data, beneficiary lists, or identifiable community information.
            </p>
          </article>

          <section className="m3-portfolio-habit-card" aria-labelledby="m3-portfolio-habit-title">
            <p className="m3-card-kicker">One design habit I will carry forward</p>
            <h2 id="m3-portfolio-habit-title">Choose one habit to save with your portfolio entry.</h2>
            <div className="m3-portfolio-habit-list">
              {module3CarryForwardHabits.map((habit) => (
                <label key={habit} className={`m3-portfolio-habit-option ${selectedHabit === habit ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="module3-carry-forward-habit"
                    checked={selectedHabit === habit}
                    onChange={() => {
                      setSelectedHabit(habit);
                      setSaved(false);
                    }}
                  />
                  <span>{habit}</span>
                </label>
              ))}
            </div>
            {customHabitRequired && (
              <label className="m3-portfolio-custom-habit">
                <span>My safe design habit is...</span>
                <input
                  type="text"
                  value={customHabit}
                  maxLength={120}
                  onChange={(event) => {
                    setCustomHabit(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="My safe design habit is..."
                />
              </label>
            )}
          </section>
        </aside>

        <section className="m3-portfolio-right" aria-label="Portfolio summary fields">
          <div className="m3-portfolio-summary-head">
            <div>
              <p className="m3-card-kicker">My Portfolio</p>
              <h2>HRBA project design improvement snapshot</h2>
            </div>
            <span className={`m3-portfolio-status ${saved ? 'is-saved' : ''}`}>
              {saved ? 'Saved' : 'Not saved'}
            </span>
          </div>

          <div className="m3-portfolio-field-grid">
            {module3PortfolioFields.map((field) => (
              <label key={field.key} className="m3-portfolio-field-card">
                <span>{field.label}</span>
                <textarea
                  value={values[field.key] || ''}
                  maxLength={220}
                  onChange={(event) => updateField(field.key, event.target.value)}
                  aria-label={field.label}
                />
                <small>{(values[field.key] || '').length}/220</small>
              </label>
            ))}
          </div>

          <div className="m3-portfolio-action-row">
            <div className="m3-portfolio-confirmation" role="status" aria-live="polite">
              {saved ? (
                <>
                  <strong>Module 3 portfolio entry saved.</strong>
                  <span>Your HRBA project design improvement snapshot has been saved privately to My Portfolio.</span>
                </>
              ) : (
                <span>Select a carry-forward habit, keep the text safe and general, then save.</span>
              )}
            </div>
            <PrimaryButton disabled={!canSave} onClick={saved ? continueToNext : saveSnapshot}>
              {saved ? 'Continue' : 'Save to My Portfolio and continue'}
            </PrimaryButton>
          </div>
        </section>
      </section>
    </main>
  );
}

function AccordionCards({
  items,
  openedIds,
  onToggle,
}: {
  items: { id: string; title: string; body: React.ReactNode }[];
  openedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="m3-accordion-list">
      {items.map((item) => {
        const open = openedIds.includes(item.id);
        return (
          <article key={item.id} className={`m3-accordion-card ${open ? 'is-open' : ''}`}>
            <button type="button" onClick={() => onToggle(item.id)} aria-expanded={open}>
              <span>{item.title}</span>
              <span aria-hidden="true">{open ? '-' : '+'}</span>
            </button>
            {open && <div className="m3-accordion-card__body">{item.body}</div>}
          </article>
        );
      })}
    </div>
  );
}

function QuickCheck({
  heading = 'Quick check',
  question,
  options,
  selected,
  onSelect,
  correctId,
  correctFeedback,
  incorrectFeedback,
}: {
  heading?: string;
  question: string;
  options: CheckOption[];
  selected: string;
  onSelect: (id: string) => void;
  correctId: string;
  correctFeedback: string;
  incorrectFeedback: string;
}) {
  const hasSelection = Boolean(selected);
  const correct = selected === correctId;
  return (
    <section className="m3-quick-check" aria-labelledby={`${heading.replace(/\s+/g, '-')}-heading`}>
      <p className="m3-card-kicker">Knowledge check</p>
      <h2 id={`${heading.replace(/\s+/g, '-')}-heading`}>{heading}</h2>
      <p>{question}</p>
      <div className="m3-choice-grid">
        {options.map((option) => (
          <label
            key={option.id}
            className={`m3-choice-card ${selected === option.id ? 'is-selected' : ''}`}
          >
            <input
              type="radio"
              name={`${heading}-${question}`}
              value={option.id}
              checked={selected === option.id}
              onChange={() => onSelect(option.id)}
            />
            <span className="m3-choice-card__mark" aria-hidden="true">
              {selected === option.id ? '✓' : option.label}
            </span>
            <span>{option.text}</span>
          </label>
        ))}
      </div>
      {hasSelection && (
        <div className={`m3-feedback-panel ${correct ? 'is-strong' : 'is-support'}`} aria-live="polite">
          <strong>{correct ? 'Good choice.' : 'Not quite.'}</strong>
          <p>{correct ? correctFeedback : incorrectFeedback}</p>
        </div>
      )}
    </section>
  );
}

function completeScreen(
  screenId: string,
  nextScreenId: string,
  nextRoute: string,
  onChangeState: Module3RendererProps['onChangeState'],
  practiceKey: string,
  payload: Record<string, unknown> = {},
) {
  const completedAt = new Date().toISOString();
  onChangeState((prev) => ({
    ...prev,
    currentScreenId: nextScreenId,
    screenProgress: addProgress(prev, screenId),
    practiceCheckState: updatePracticeState(prev, practiceKey, {
      ...payload,
      status: 'completed',
      completedAt,
    }),
  }));
  setRoute(nextRoute);
}

const screen31Hotspots = [
  {
    id: 'who-exactly',
    phrase: '300 vulnerable community members',
    label: 'Who exactly?',
    text:
      'The proposal gives a number, but not a clear rights-holder analysis. "Vulnerable community members" is too broad. It does not show who is most affected, who is excluded, or whether women, persons with disabilities, displaced people, youth, older people, minority groups, or people in remote areas face different barriers.',
  },
  {
    id: 'training-barrier',
    phrase: 'skills training',
    label: 'Training for what barrier?',
    text:
      'Training may be useful, but the proposal does not explain the deeper barrier. Is the issue lack of skills, lack of access to land, discrimination, unpaid care responsibilities, unsafe mobility, lack of information, exclusion from local decision-making, or weak duty-bearer support?',
  },
  {
    id: 'who-decides',
    phrase: 'community representatives will help identify participants',
    label: 'Who decides?',
    text:
      'This sounds participatory, but it may also create exclusion if only powerful or visible actors are involved. The proposal does not explain how selection will be transparent, inclusive, safe, accessible, and open to feedback.',
  },
  {
    id: 'responsibility',
    phrase: 'local officials and community leaders',
    label: 'What responsibility?',
    text:
      'The proposal mentions local actors, but does not clarify their roles. Who has a formal responsibility? Who has influence? What capacity gaps exist? What should the CSO support, and what should duty-bearers do?',
  },
  {
    id: 'change',
    phrase: 'increase livelihood opportunities',
    label: 'What change?',
    text:
      'The expected change is positive but still general. A rights-aware project design should show what will change for rights-holders, what barriers will be reduced, what capacities will be strengthened, and how accountability will improve.',
  },
  {
    id: 'evidence',
    phrase: 'monitoring visits',
    label: 'What evidence?',
    text:
      'Monitoring visits are not enough by themselves. The proposal does not say what evidence will show whether excluded groups are reached, whether participation is meaningful, whether risks are emerging, or whether rights-holders can safely give feedback.',
  },
  {
    id: 'smooth',
    phrase: 'smooth implementation',
    label: 'Smooth for whom?',
    text:
      'A project can be smooth for implementers but still difficult for rights-holders. The proposal does not yet address safety, backlash, accessibility, elite capture, data protection, or the possibility that some groups may be afraid to participate.',
  },
];

const screen31ReviewerCards = [
  {
    id: 'activity-clear',
    title: 'The proposal is activity-clear, but not rights-clear.',
    body:
      'It explains trainings, sessions, coaching, and visits. But it does not yet explain which rights are affected, which barriers matter most, and what responsibility different actors have.',
  },
  {
    id: 'broad-target',
    title: 'The target group is broad.',
    body:
      '"Vulnerable people" may hide important differences. A stronger design asks: who is excluded, why, and what would make access possible for them?',
  },
  {
    id: 'influence-unclear',
    title: 'Participation is mentioned, but influence is unclear.',
    body:
      'A meeting or consultation is not enough. HRBA asks whether rights-holders receive information, influence decisions, raise concerns safely, and see that their input matters.',
  },
  {
    id: 'power-risk',
    title: 'Risk is not yet connected to power.',
    body:
      'The proposal does not yet consider who may be exposed to harm, who may be excluded by gatekeepers, who may control resources, or who may face backlash for participating.',
  },
  {
    id: 'logic-analysis',
    title: 'The logic starts with activities, not analysis.',
    body:
      'The design jumps quickly to training and support. A stronger HRBA design first asks what barriers, capacity gaps, policies, responsibilities, and power relations shape the problem.',
  },
];

const reflectionOptions = [
  'The activities are clear, but the rights issue is not clear.',
  'The target group is too broad.',
  'Participation is described, but not designed.',
  'Duty-bearer roles and responsibilities are unclear.',
  'Risks are too general and not linked to power, exclusion, or safety.',
  'The proposal moves to activities before understanding the problem deeply.',
];

function Module3Screen31({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_screen31 || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-03');
  const [snapshotOpen, setSnapshotOpen] = useState(Boolean(stored.snapshotOpen || completed));
  const [openedHotspots, setOpenedHotspots] = useState<string[]>(
    completed ? screen31Hotspots.map((item) => item.id) : stored.openedHotspots || [],
  );
  const [activeHotspotId, setActiveHotspotId] = useState<string>(
    stored.activeHotspotId || screen31Hotspots[0].id,
  );
  const [reviewerOpen, setReviewerOpen] = useState(Boolean(stored.reviewerOpen || completed));
  const [expandedCards, setExpandedCards] = useState<string[]>(stored.expandedCards || []);
  const [reflectionChoice, setReflectionChoice] = useState<string>(stored.reflectionChoice || '');

  const activeHotspot = screen31Hotspots.find((item) => item.id === activeHotspotId) || screen31Hotspots[0];
  const allHotspotsOpened = openedHotspots.length === screen31Hotspots.length;
  const canReflect = reviewerOpen;
  const canContinue = reflectionChoice && (allHotspotsOpened || reviewerOpen);

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_screen31', patch),
    }));
  };

  const openHotspot = (id: string) => {
    setActiveHotspotId(id);
    setOpenedHotspots((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      persist({ openedHotspots: next, activeHotspotId: id, snapshotOpen: true });
      return next;
    });
  };

  const toggleReviewer = (id: string) => {
    setExpandedCards((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      persist({ expandedCards: next });
      return next;
    });
  };

  return (
    <main className="m3-screen" aria-labelledby="m3-s31-title">
      <section className="m3-hero-panel m3-hero-panel--proposal">
        <div>
          <ModuleContextLabel>Module 3 · Project Design Studio</ModuleContextLabel>
          <ScreenTitle id="m3-s31-title">The Proposal Looks Strong — What Is Missing?</ScreenTitle>
          <p>
            A local CSO team is preparing a project proposal. The deadline is close. The team has worked
            hard. The activities are clear. The budget looks realistic. The timeline is organized.
          </p>
          <p>At first glance, the proposal seems ready.</p>
          <p>Then, during the final review, one colleague pauses and says:</p>
          <QuoteBlock>
            "We have explained what we will do. But have we explained whose rights are affected, who is
            being left out, who has responsibility, and what needs to change?"
          </QuoteBlock>
          {!snapshotOpen && (
            <PrimaryButton
              onClick={() => {
                setSnapshotOpen(true);
                persist({ snapshotOpen: true });
              }}
            >
              Review the proposal snapshot
            </PrimaryButton>
          )}
        </div>
        <div
          className="m3-visual-card m3-visual-card--desk"
          role="img"
          aria-label="Illustration of a fictional proposal review desk with proposal pages, sticky notes, a laptop, a budget table, and CSO team members reviewing documents."
        >
          <span>Proposal</span>
          <span>Budget</span>
          <span>Timeline</span>
          <span>Review notes</span>
        </div>
      </section>

      {snapshotOpen && (
        <section className="m3-workspace-grid" aria-labelledby="m3-s31-snapshot">
          <article className="m3-proposal-snapshot">
            <p className="m3-card-kicker">Annotated proposal snapshot</p>
            <h2 id="m3-s31-snapshot">Project Concept: Livelihood Skills for Vulnerable Community Members</h2>
            <p>
              The project will train{' '}
              <button type="button" className="m3-text-hotspot" onClick={() => openHotspot('who-exactly')}>
                300 vulnerable community members
              </button>{' '}
              in livelihood skills and provide follow-up support to help them improve their income
              opportunities.
            </p>
            <p>The project will include:</p>
            <ul>
              <li>community awareness sessions;</li>
              <li>
                <button type="button" className="m3-text-hotspot" onClick={() => openHotspot('training-barrier')}>
                  skills training
                </button>
                ;
              </li>
              <li>small business coaching;</li>
              <li>coordination with local stakeholders;</li>
              <li>
                <button type="button" className="m3-text-hotspot" onClick={() => openHotspot('evidence')}>
                  monitoring visits
                </button>
                ;
              </li>
              <li>a final learning event.</li>
            </ul>
            <p>
              The project will target vulnerable people in selected kebeles.{' '}
              <button type="button" className="m3-text-hotspot" onClick={() => openHotspot('who-decides')}>
                Community representatives will help identify participants
              </button>
              . The CSO will work with{' '}
              <button type="button" className="m3-text-hotspot" onClick={() => openHotspot('responsibility')}>
                local officials and community leaders
              </button>{' '}
              to support{' '}
              <button type="button" className="m3-text-hotspot" onClick={() => openHotspot('smooth')}>
                smooth implementation
              </button>
              .
            </p>
            <p>
              The project expects to{' '}
              <button type="button" className="m3-text-hotspot" onClick={() => openHotspot('change')}>
                increase livelihood opportunities
              </button>{' '}
              and strengthen community resilience.
            </p>
            <ProgressChip>{openedHotspots.length} of 7 annotations opened</ProgressChip>
          </article>

          <aside className="m3-annotation-panel" aria-live="polite">
            <p className="m3-card-kicker">Annotation: {activeHotspot.label}</p>
            <h2>{activeHotspot.phrase}</h2>
            <p>{activeHotspot.text}</p>
            <div className="m3-hotspot-list" aria-label="All proposal annotations">
              {screen31Hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  type="button"
                  className={`m3-mini-chip ${openedHotspots.includes(hotspot.id) ? 'is-complete' : ''}`}
                  onClick={() => openHotspot(hotspot.id)}
                >
                  {openedHotspots.includes(hotspot.id) ? 'Reviewed: ' : ''}
                  {hotspot.label}
                </button>
              ))}
            </div>
            {!reviewerOpen && (
              <PrimaryButton
                onClick={() => {
                  setReviewerOpen(true);
                  persist({ reviewerOpen: true });
                }}
              >
                Continue to reviewer concern
              </PrimaryButton>
            )}
          </aside>
        </section>
      )}

      {reviewerOpen && (
        <section className="m3-section" aria-labelledby="m3-s31-reviewer">
          <div className="m3-section-head">
            <div>
              <p className="m3-card-kicker">Reviewer comment cards</p>
              <h2 id="m3-s31-reviewer">The reviewer's concern</h2>
            </div>
            <p>The reviewer does not reject the proposal. Instead, she helps the team look deeper.</p>
          </div>
          <AccordionCards
            items={screen31ReviewerCards.map((card) => ({ ...card, body: <p>{card.body}</p> }))}
            openedIds={expandedCards}
            onToggle={toggleReviewer}
          />
        </section>
      )}

      {canReflect && (
        <section className="m3-section" aria-labelledby="m3-s31-reflect">
          <p className="m3-card-kicker">Reflection prompt</p>
          <h2 id="m3-s31-reflect">Before moving on, pause for one design question.</h2>
          <p>What is the biggest concern you notice in this proposal?</p>
          <div className="m3-choice-grid">
            {reflectionOptions.map((option) => (
              <label key={option} className={`m3-choice-card ${reflectionChoice === option ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="m3-s31-reflection"
                  checked={reflectionChoice === option}
                  onChange={() => {
                    setReflectionChoice(option);
                    persist({ reflectionChoice: option });
                  }}
                />
                <span className="m3-choice-card__mark" aria-hidden="true">
                  {reflectionChoice === option ? '✓' : ''}
                </span>
                <span>{option}</span>
              </label>
            ))}
          </div>
          {reflectionChoice && (
            <div className="m3-feedback-panel is-strong" aria-live="polite">
              <strong>Good noticing.</strong>
              <p>
                In HRBA project design, a proposal can be organized and still be incomplete. The next step
                is to diagnose what is missing before trying to fix it.
              </p>
            </div>
          )}
        </section>
      )}

      {reflectionChoice && (
        <StatementCard heading="This module is not about adding HRBA words to a proposal." dark>
          <p>
            It is about designing differently: starting from people's lived realities, identifying barriers and
            responsibilities, making participation meaningful, protecting people from harm, and building a
            project logic that can support real change.
          </p>
          <div className="m3-cta-row">
            <PrimaryButton
              disabled={!canContinue}
              onClick={() =>
                completeScreen('M3-S1-03', 'M3-S1-04', routes['M3-S1-04'], onChangeState, 'module3_screen31', {
                  openedHotspots,
                  reflectionChoice,
                })
              }
            >
              Build the HRBA Design Snapshot
            </PrimaryButton>
          </div>
          <p className="m3-microcopy">Next: turn the diagnosis into a compact HRBA design snapshot.</p>
        </StatementCard>
      )}
    </main>
  );
}

const diagnosisOptions = [
  {
    id: 'rights-holders',
    title: 'The proposal does not clearly identify specific rights-holders.',
    detail: 'The phrase "vulnerable community members" is too broad.',
    correct: true,
  },
  {
    id: 'deeper-barriers',
    title: 'The proposal does not explain the deeper barriers behind the problem.',
    detail: 'It moves quickly to training without asking why people are excluded from livelihood opportunities.',
    correct: true,
  },
  {
    id: 'affected-rights',
    title: 'The proposal does not clarify which rights are affected.',
    detail: 'It does not connect the project issue to dignity, equality, participation, access to services, work, livelihood, or other relevant rights.',
    correct: true,
  },
  {
    id: 'duty-bearers',
    title: 'The proposal does not identify duty-bearers and their responsibilities clearly.',
    detail: 'It mentions local officials and community leaders, but does not explain their roles or obligations.',
    correct: true,
  },
  {
    id: 'gender',
    title: 'The proposal does not analyze gendered barriers.',
    detail: 'It does not ask how women, girls, men, boys, or people of diverse identities may experience the issue differently.',
    correct: true,
  },
  {
    id: 'disability',
    title: 'The proposal does not analyze disability and accessibility barriers.',
    detail: 'It does not ask whether persons with disabilities can access information, meetings, training venues, selection processes, or follow-up support.',
    correct: true,
  },
  {
    id: 'participation',
    title: 'The proposal describes participation as involvement, not influence.',
    detail: 'It says community representatives will help, but does not show how rights-holders will shape decisions.',
    correct: true,
  },
  {
    id: 'transparency',
    title: 'The proposal does not explain how selection will be transparent and accountable.',
    detail: 'It does not describe clear criteria, feedback channels, complaint options, or safeguards against favoritism.',
    correct: true,
  },
  {
    id: 'power-risk',
    title: 'The proposal does not consider power and risk.',
    detail: 'It does not examine gatekeeper control, backlash, elite capture, unsafe visibility, data risks, or exclusion during implementation.',
    correct: true,
  },
  {
    id: 'logic',
    title: 'The proposal has activities, but the intervention logic is weak.',
    detail: 'It does not clearly link analysis, barriers, objectives, activities, responsibilities, risks, and expected change.',
    correct: true,
  },
  {
    id: 'more-activities',
    title: 'The proposal should add more activities immediately.',
    detail: 'More activities will make the project stronger.',
    correct: false,
  },
  {
    id: 'already-hrba',
    title: 'The proposal is already HRBA-aligned because it targets vulnerable people.',
    detail: 'Targeting vulnerable people is enough to make the design rights-based.',
    correct: false,
  },
];

const diagnosisCards = [
  ['Rights-holders are too vague.', 'A strong design does not stop at "vulnerable people." It identifies who is affected, who is excluded, and who faces the greatest barriers.'],
  ['The problem is not deep enough.', 'A strong design asks why the issue exists: discrimination, access barriers, information gaps, weak accountability, harmful norms, resource control, policy gaps, or capacity gaps.'],
  ['The rights issue is unclear.', 'A strong design connects the project problem to rights, dignity, equality, participation, accountability, and access to services or opportunities.'],
  ['Responsibilities are unclear.', 'A strong design clarifies who has obligations, who has influence, where capacity is weak, and how the CSO should support change without replacing duty-bearers.'],
  ['Gender barriers are not analyzed.', 'A strong design asks how gender affects access, time, safety, decision-making, resources, voice, mobility, and risk.'],
  ['Disability inclusion is missing.', 'A strong design asks whether people with different disabilities can access information, venues, communication, selection processes, activities, and feedback channels.'],
  ['Participation is not yet meaningful.', 'A strong design makes participation visible in decisions, not only in meetings.'],
  ['Transparency and accountability are weak.', 'A strong design explains how people will understand criteria, ask questions, give feedback, complain safely, and receive responses.'],
  ['Risk is too general.', 'A strong design considers power, safety, backlash, elite capture, data protection, exclusion, and unintended harm.'],
  ['The logic starts too late.', 'A strong design links analysis to objectives, activities, actors, assumptions, risks, and evidence.'],
].map(([title, body], index) => ({ id: `gap-${index + 1}`, title, body }));

function evaluateDiagnosis(selected: string[], attempt: number) {
  const selectedCorrect = selected.filter((id) => diagnosisOptions.find((option) => option.id === id)?.correct);
  const selectedIncorrect = selected.filter((id) => !diagnosisOptions.find((option) => option.id === id)?.correct);
  if (selected.includes('more-activities')) return 'activity';
  if (selected.includes('already-hrba')) return 'vulnerability';
  if (selectedCorrect.length >= 8 && selectedIncorrect.length === 0) return 'strong';
  if (attempt >= 2) return 'full';
  return 'partial';
}

function diagnosisFeedback(kind: string) {
  if (kind === 'strong') {
    return {
      heading: 'Strong diagnosis. You are looking beyond the activity list.',
      body:
        'You noticed that the proposal is not weak because it lacks activities. It is weak because the design has not yet explained the rights issue, the affected groups, the barriers, the responsibilities, the participation process, the risks, and the logic of change.',
      prompt:
        'This is the first habit of HRBA project design: do not start by adding activities. Start by understanding the rights problem more clearly.',
      action: 'Continue',
    };
  }
  if (kind === 'activity') {
    return {
      heading: 'Careful: more activities do not automatically make a stronger HRBA design.',
      body:
        'Adding activities may make a proposal longer, but not necessarily better. HRBA project design first asks whether the activities respond to the real barriers, affected groups, responsibilities, risks, and power dynamics.',
      prompt: 'Try again. This time, look for what needs to be understood before activities are added.',
      action: 'Try again',
    };
  }
  if (kind === 'vulnerability') {
    return {
      heading: 'Careful: saying "vulnerable people" is not enough.',
      body:
        'A project is not rights-based simply because it targets people described as vulnerable. HRBA asks who is affected, why they are excluded, what rights are involved, who has responsibility, and how people will influence decisions that affect them.',
      prompt: 'Try again. Look for the design gaps hidden behind broad labels.',
      action: 'Try again',
    };
  }
  if (kind === 'full') {
    return {
      heading: 'Here is the full diagnosis.',
      body:
        'The proposal needs stronger analysis in ten areas: specific rights-holders, deeper barriers, affected rights, duty-bearer responsibilities, gendered barriers, disability and accessibility barriers, meaningful participation, transparency and accountability, power and risk, and intervention logic.',
      prompt: 'These gaps will become the design pathway for the rest of this module.',
      action: 'Continue',
    };
  }
  return {
    heading: 'Good start. Now look one layer deeper.',
    body:
      'You noticed some important gaps. But an HRBA design diagnosis needs to look at more than one issue. A proposal may mention community members, stakeholders, and training, but still miss rights-holders, duty-bearers, gender barriers, disability access, participation quality, accountability, risk, and intervention logic.',
    prompt:
      'Try again and look for the gaps that affect who is included, who decides, who has responsibility, and what might cause harm or exclusion.',
    action: 'Try again',
  };
}

export function Module3Screen32({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_screen32 || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-02');
  const [selected, setSelected] = useState<string[]>(stored.selected || []);
  const [attemptCount, setAttemptCount] = useState<number>(stored.attemptCount || 0);
  const [feedbackKind, setFeedbackKind] = useState<string>(stored.feedbackKind || (completed ? 'full' : ''));
  const [summaryOpenIds, setSummaryOpenIds] = useState<string[]>(stored.summaryOpenIds || []);
  const summaryUnlocked = completed || feedbackKind === 'strong' || feedbackKind === 'full';
  const feedback = feedbackKind ? diagnosisFeedback(feedbackKind) : null;

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_screen32', patch),
    }));
  };

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      persist({ selected: next });
      return next;
    });
  };

  const submit = () => {
    const nextAttempt = Math.min(attemptCount + 1, 2);
    const nextFeedback = evaluateDiagnosis(selected, nextAttempt);
    setAttemptCount(nextAttempt);
    setFeedbackKind(nextFeedback);
    persist({ selected, attemptCount: nextAttempt, feedbackKind: nextFeedback });
  };

  const tryAgain = () => {
    setFeedbackKind('');
    persist({ feedbackKind: '' });
  };

  return (
    <main className="m3-screen" aria-labelledby="m3-s32-title">
      <section className="m3-hero-panel m3-hero-panel--diagnosis">
        <div>
          <ModuleContextLabel>Project Design Studio · Step 1</ModuleContextLabel>
          <ScreenTitle id="m3-s32-title">Before we fix the proposal, we need to diagnose it.</ScreenTitle>
          <p>
            In the previous screen, the CSO team reviewed a proposal that looked organized. It had
            activities, a budget, a target number, and a timeline.
          </p>
          <p>But a strong HRBA design does not only ask:</p>
          <QuoteBlock>"What will the project do?"</QuoteBlock>
          <p>It also asks:</p>
          <QuoteBlock>"What is really happening, who is affected, who has responsibility, and what must change?"</QuoteBlock>
        </div>
        <div className="m3-visual-card m3-visual-card--lens" role="img" aria-label="Review lens illustration over a fictional proposal.">
          <span>Diagnose</span>
          <span>Rights-holders</span>
          <span>Barriers</span>
          <span>Responsibilities</span>
        </div>
      </section>

      <section className="m3-section" aria-labelledby="m3-s32-activity">
        <div className="m3-section-head">
          <div>
            <p className="m3-card-kicker">Multiple response</p>
            <h2 id="m3-s32-activity">What is missing from this project design?</h2>
            <p>Select all the HRBA design gaps you notice in the proposal snapshot.</p>
          </div>
          <ProgressChip>Attempt {Math.max(1, attemptCount + (feedbackKind ? 0 : 1))} of 2</ProgressChip>
        </div>
        <article className="m3-reminder-card">
          The proposal says it will train 300 vulnerable community members, provide awareness sessions,
          deliver skills training, coordinate with local stakeholders, conduct monitoring visits, and hold a
          final learning event.
        </article>
        <div className="m3-diagnosis-grid">
          {diagnosisOptions.map((option, index) => {
            const isSelected = selected.includes(option.id);
            return (
              <label key={option.id} className={`m3-diagnosis-card ${isSelected ? 'is-selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelected(option.id)}
                  disabled={Boolean(feedbackKind && !summaryUnlocked)}
                />
                <span className="m3-choice-card__mark" aria-hidden="true">
                  {isSelected ? '✓' : index + 1}
                </span>
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.detail}</small>
                </span>
              </label>
            );
          })}
        </div>
        {!feedbackKind && (
          <div className="m3-cta-row">
            <SecondaryButton disabled={selected.length === 0} onClick={submit}>
              Submit diagnosis
            </SecondaryButton>
          </div>
        )}
        {feedback && (
          <div className={`m3-feedback-panel ${summaryUnlocked ? 'is-strong' : 'is-support'}`} aria-live="polite">
            <h3>{feedback.heading}</h3>
            <p>{feedback.body}</p>
            <p>{feedback.prompt}</p>
            {!summaryUnlocked && attemptCount < 2 && (
              <SecondaryButton onClick={tryAgain}>{feedback.action}</SecondaryButton>
            )}
            {!summaryUnlocked && attemptCount >= 2 && (
              <SecondaryButton
                onClick={() => {
                  setFeedbackKind('full');
                  persist({ feedbackKind: 'full' });
                }}
              >
                Show full diagnosis
              </SecondaryButton>
            )}
          </div>
        )}
      </section>

      {summaryUnlocked && (
        <section className="m3-section" aria-labelledby="m3-s32-summary">
          <div className="m3-section-head">
            <div>
              <p className="m3-card-kicker">Diagnosis summary</p>
              <h2 id="m3-s32-summary">The ten gaps we will repair in Module 3</h2>
              <p>This module will help you move from a promising project idea to a stronger HRBA project design.</p>
            </div>
          </div>
          <AccordionCards
            items={diagnosisCards.map((card) => ({ ...card, body: <p>{card.body}</p> }))}
            openedIds={summaryOpenIds}
            onToggle={(id) => {
              setSummaryOpenIds((prev) => {
                const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
                persist({ summaryOpenIds: next });
                return next;
              });
            }}
          />
          <StatementCard heading="A proposal can be well organized and still not be rights-based.">
            <p>The difference is not the number of activities. The difference is the quality of the design thinking behind them.</p>
            <p><strong>HRBA project design begins by asking better questions before choosing solutions.</strong></p>
          </StatementCard>
          <div className="m3-cta-panel">
            <div>
              <h2>Next, build the design lens.</h2>
              <p>You have diagnosed the gaps. Now you will learn the practical HRBA questions that help repair them.</p>
            </div>
            <PrimaryButton
              onClick={() =>
                completeScreen('M3-S1-02', 'M3-S1-03', routes['M3-S1-03'], onChangeState, 'module3_screen32', {
                  selected,
                  attemptCount,
                  feedbackKind,
                })
              }
            >
              Continue to the HRBA Project Design Lens
            </PrimaryButton>
          </div>
        </section>
      )}
    </main>
  );
}

const lensQuestions = [
  {
    id: 'affected',
    label: 'Who is affected?',
    heading: 'Start with specific rights-holders.',
    body:
      'Do not stop at broad labels such as "the community," "beneficiaries," or "vulnerable people." Ask who is affected, who is excluded, who faces the greatest barriers, and who may be invisible in normal consultation processes.',
    implication:
      'This changes how you define target groups, outreach, participation methods, selection criteria, accessibility measures, and indicators.',
    example:
      'Instead of "300 vulnerable community members," the design may need to identify women-headed households, youth without access to land or work, persons with disabilities, displaced households, older caregivers, or people excluded from local information channels.',
  },
  {
    id: 'rights',
    label: 'What rights are involved?',
    heading: 'Connect the project issue to dignity and rights.',
    body:
      'A project problem is not only a need. It may involve rights related to equality, participation, access to services, work, education, health, water, information, safety, freedom of association, or non-discrimination.',
    implication: 'This changes the problem statement, the objective, the language of the proposal, and the basis for engaging duty-bearers.',
    example:
      'A livelihood problem may also involve discrimination, lack of access to information, exclusion from decision-making, unequal access to public services, or barriers to decent work.',
  },
  {
    id: 'barriers',
    label: 'What barriers exist?',
    heading: 'Look beyond the visible symptom.',
    body:
      'A weak design jumps from problem to activity. A stronger HRBA design asks what is causing the problem: policy gaps, discrimination, harmful norms, distance, cost, language, disability barriers, gender roles, weak institutions, poor information, fear, or lack of accountability.',
    implication:
      'This changes the choice of activities. Training may be useful, but it may not be enough if the real barrier is exclusion, unsafe participation, lack of documents, inaccessible venues, or gatekeeper control.',
    example:
      'If women cannot attend training because of unpaid care responsibilities, mobility concerns, or unsafe timing, the answer is not simply "more training."',
  },
  {
    id: 'responsibility',
    label: 'Who has responsibility?',
    heading: 'Clarify duty-bearers and influencing actors.',
    body:
      'HRBA project design identifies who has formal obligations, who has influence, who controls resources, who shapes decisions, and where capacity gaps exist. CSOs can support change, but they should not silently replace duty-bearers.',
    implication:
      'This changes stakeholder mapping, partnership strategy, advocacy choices, coordination plans, capacity-building activities, and sustainability.',
    example:
      'A woreda office, school, health post, kebele structure, service provider, community committee, private actor, or social institution may each play a different role.',
  },
  {
    id: 'participation',
    label: 'How will people influence decisions?',
    heading: 'Design participation as influence, not attendance.',
    body:
      'Participation is not only inviting people to a meeting. It means people receive information, understand choices, influence decisions, raise concerns safely, and see how their input shaped the project.',
    implication:
      'This changes consultation plans, communication methods, meeting design, language choices, feedback channels, decision points, and accountability processes.',
    example:
      'A consultation becomes more meaningful when women, youth, persons with disabilities, displaced people, and less visible groups can safely shape selection criteria, activity timing, access arrangements, and feedback mechanisms.',
  },
  {
    id: 'harm',
    label: 'Who may be excluded or harmed?',
    heading: 'Design for inclusion and do-no-harm from the start.',
    body:
      'Even a well-intentioned project can create harm. It may expose people to backlash, deepen exclusion, strengthen local gatekeepers, create conflict over resources, collect unsafe data, or make promises that cannot be kept.',
    implication:
      'This changes risk analysis, selection criteria, data collection, communication, safeguarding, referral planning, complaint channels, visibility decisions, and mitigation measures.',
    example:
      'If participant lists are controlled by a few powerful actors, the project may unintentionally exclude the people it most needs to reach.',
  },
  {
    id: 'change',
    label: 'What change should happen?',
    heading: 'Move from activity delivery to rights-based change.',
    body:
      'A strong project design explains the change it wants to support. This includes changes in rights-holder capacity, duty-bearer capacity, access, participation, accountability, inclusion, safety, and responsiveness.',
    implication: 'This changes objectives, outputs, activity packages, assumptions, and the intervention logic.',
    example:
      'Instead of only "train 300 people," the project may aim to strengthen excluded groups access to livelihood support while improving transparent selection, accessible participation, and local actor responsiveness.',
  },
  {
    id: 'evidence',
    label: 'What evidence is needed?',
    heading: 'Choose useful and safe evidence.',
    body:
      'Project design should identify what evidence will help the CSO learn whether the project is reaching the right people, reducing barriers, strengthening participation, improving accountability, and avoiding harm.',
    implication:
      'This changes indicators, monitoring questions, feedback tools, disaggregation choices, learning moments, and data protection measures.',
    example:
      'Counting participants is not enough. The project may also need to know who participated, who did not, why barriers remained, whether feedback was answered, and whether any group felt unsafe or excluded.',
  },
];

const repairStarters = [
  {
    id: 'vulnerable',
    title: 'Instead of starting with "300 vulnerable people"...',
    body:
      'The team would ask: who is affected differently, who is usually missed, and who faces the strongest access barriers? The proposal would then describe specific rights-holder groups and explain why they are prioritized.',
  },
  {
    id: 'training',
    title: 'Instead of starting with "skills training"...',
    body:
      'The team would ask: what is actually blocking people from livelihood opportunities? If the barriers include discrimination, unsafe mobility, weak information, exclusion from local decisions, or inaccessible services, training alone will not be enough.',
  },
  {
    id: 'representatives',
    title: 'Instead of saying "community representatives will help"...',
    body:
      'The team would ask: which representatives, selected by whom, accountable to whom, and how will excluded groups influence the project safely? The proposal would then describe a participation and accountability process, not just a consultation event.',
  },
];

const lensSummaryRows = [
  ['Who is affected?', 'Target groups, outreach, access, selection'],
  ['What rights are involved?', 'Problem framing, objective, proposal language'],
  ['What barriers exist?', 'Activities, support package, assumptions'],
  ['Who has responsibility?', 'Actor map, partnerships, duty-bearer engagement'],
  ['How will people influence decisions?', 'Participation plan, feedback, accountability'],
  ['Who may be excluded or harmed?', 'Risk plan, safeguards, do-no-harm measures'],
  ['What change should happen?', 'Objective, outputs, intervention logic'],
  ['What evidence is needed?', 'Indicators, feedback tools, safe learning'],
];

export function Module3Screen33({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_screen33 || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-03');
  const [lensOpen, setLensOpen] = useState(Boolean(stored.lensOpen || completed));
  const [openedLensIds, setOpenedLensIds] = useState<string[]>(
    completed ? lensQuestions.map((item) => item.id) : stored.openedLensIds || [],
  );
  const [activeLensId, setActiveLensId] = useState<string>(stored.activeLensId || lensQuestions[0].id);
  const [repairOpenIds, setRepairOpenIds] = useState<string[]>(stored.repairOpenIds || []);
  const [quickCheck, setQuickCheck] = useState<string>(stored.quickCheck || '');
  const activeLens = lensQuestions.find((item) => item.id === activeLensId) || lensQuestions[0];
  const allLensOpened = openedLensIds.length === lensQuestions.length;
  const allRepairOpened = repairOpenIds.length === repairStarters.length;
  const canContinue = allLensOpened && allRepairOpened && quickCheck;

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_screen33', patch),
    }));
  };

  const openLens = (id: string) => {
    setActiveLensId(id);
    setOpenedLensIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      persist({ openedLensIds: next, activeLensId: id, lensOpen: true });
      return next;
    });
  };

  return (
    <main className="m3-screen" aria-labelledby="m3-s33-title">
      <section className="m3-hero-panel m3-hero-panel--lens">
        <div>
          <ModuleContextLabel>Project Design Studio · Step 2</ModuleContextLabel>
          <ScreenTitle id="m3-s33-title">Now we need a better design lens.</ScreenTitle>
          <p>
            The team has diagnosed the proposal gaps. They know the project idea is not useless. It is just
            incomplete. The proposal already says what the CSO wants to do. But HRBA project design asks a
            deeper set of questions before activities are finalized.
          </p>
          <QuoteBlock>A rights-based project is not created by adding HRBA words at the end.</QuoteBlock>
          <p>It is created by asking better design questions from the beginning.</p>
          {!lensOpen && (
            <PrimaryButton
              onClick={() => {
                setLensOpen(true);
                persist({ lensOpen: true });
              }}
            >
              Open the HRBA design lens
            </PrimaryButton>
          )}
        </div>
        <div className="m3-visual-card m3-visual-card--magnifier" role="img" aria-label="Large circular lens over a fictional project concept note.">
          <span>HRBA lens</span>
        </div>
      </section>

      {lensOpen && (
        <section className="m3-workspace-grid" aria-labelledby="m3-s33-lens">
          <div className="m3-lens-map">
            <div className="m3-section-head">
              <div>
                <p className="m3-card-kicker">Interactive labeled graphic</p>
                <h2 id="m3-s33-lens">The HRBA Project Design Lens</h2>
                <p>Click each part of the lens. These are the eight questions that will guide the rest of this module.</p>
              </div>
              <ProgressChip>{openedLensIds.length} of 8 opened</ProgressChip>
            </div>
            <div className="m3-lens-buttons" role="list" aria-label="HRBA design lens questions">
              {lensQuestions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`m3-lens-button ${openedLensIds.includes(item.id) ? 'is-complete' : ''}`}
                  onClick={() => openLens(item.id)}
                >
                  <span aria-hidden="true">{openedLensIds.includes(item.id) ? '✓' : index + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <aside className="m3-detail-panel" aria-live="polite">
            <p className="m3-card-kicker">Lens question</p>
            <h2>{activeLens.heading}</h2>
            <p>{activeLens.body}</p>
            <h3>What this changes in design</h3>
            <p>{activeLens.implication}</p>
            <h3>Mini example</h3>
            <p>{activeLens.example}</p>
          </aside>
        </section>
      )}

      {allLensOpened && (
        <section className="m3-section" aria-labelledby="m3-s33-summary">
          <div className="m3-section-head">
            <div>
              <p className="m3-card-kicker">Lens summary</p>
              <h2 id="m3-s33-summary">Eight questions. Eight design decisions.</h2>
              <p>Each HRBA question should change something in the project design.</p>
            </div>
          </div>
          <div className="m3-summary-grid" role="table" aria-label="HRBA design questions and design outputs">
            {lensSummaryRows.map(([question, influence]) => (
              <div key={question} className="m3-summary-row" role="row">
                <strong role="cell">{question}</strong>
                <span role="cell">{influence}</span>
              </div>
            ))}
          </div>
          <section className="m3-subsection">
            <h2>What would this lens change in the opening proposal?</h2>
            <p>The original proposal started with activities. The HRBA lens helps the team slow down and ask better design questions first.</p>
            <AccordionCards
              items={repairStarters.map((item) => ({ ...item, body: <p>{item.body}</p> }))}
              openedIds={repairOpenIds}
              onToggle={(id) => {
                setRepairOpenIds((prev) => {
                  const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
                  persist({ repairOpenIds: next });
                  return next;
                });
              }}
            />
          </section>
          <StatementCard heading="The HRBA lens changes the design conversation.">
            <p>It moves the team from:</p>
            <QuoteBlock>"What activities can we deliver?"</QuoteBlock>
            <p>to:</p>
            <QuoteBlock>
              "What barriers, responsibilities, risks, and power relations must the project address so
              rights-holders can influence and benefit from change?"
            </QuoteBlock>
          </StatementCard>
          <QuickCheck
            question="Which sentence best describes the HRBA project design lens?"
            selected={quickCheck}
            onSelect={(id) => {
              setQuickCheck(id);
              persist({ quickCheck: id });
            }}
            correctId="B"
            correctFeedback="Exactly. The lens helps the team design from rights, barriers, responsibilities, participation, risk, and change - not only from activities."
            incorrectFeedback="The HRBA lens is not an after-the-fact checklist, a legal review, or something only for advocacy projects. It is a practical way to design stronger projects in any sector."
            options={[
              { id: 'A', label: 'A', text: 'It is a checklist added after the proposal is finished.' },
              { id: 'B', label: 'B', text: 'It is a way to ask better design questions before choosing activities.' },
              { id: 'C', label: 'C', text: 'It is mainly a legal review of project documents.' },
              { id: 'D', label: 'D', text: 'It is only needed for human rights advocacy projects.' },
            ]}
          />
          <div className="m3-cta-panel">
            <div>
              <h2>Now enter the design studio.</h2>
              <p>Next, you will see what must be analyzed before a project design becomes strong enough to guide action.</p>
            </div>
            <PrimaryButton
              disabled={!canContinue}
              onClick={() =>
                completeScreen('M3-S1-03', 'M3-S1-03A', routes['M3-S1-03A'], onChangeState, 'module3_screen33', {
                  openedLensIds,
                  repairOpenIds,
                  quickCheck,
                })
              }
            >
              Continue to the HRBA Design Studio
            </PrimaryButton>
          </div>
        </section>
      )}
    </main>
  );
}

const processSteps = [
  {
    id: 'context',
    label: '1. Context',
    heading: 'What is happening in this place, for these people, at this time?',
    body:
      'A project idea becomes stronger when the team understands the local situation before choosing activities. Context analysis asks what is happening, where it is happening, who is affected, what has changed recently, and what local realities may shape access, safety, trust, and participation.',
    questions: ['What is the visible problem?', 'Where is it happening?', 'Who experiences it most strongly?', 'What has changed recently?', 'What local realities could affect participation or access?', 'What information is still missing?'],
    changes: 'Context analysis shapes the target area, outreach strategy, activity timing, communication approach, safety measures, and assumptions.',
    example:
      'If the project is planned in an area where people have recently been displaced, a normal training schedule may not work. The team may need different outreach, safer meeting points, flexible timing, and stronger feedback channels.',
  },
  {
    id: 'policy',
    label: 'Rights and policy alignment',
    heading: 'Which rights, standards, policies, and commitments matter here?',
    body:
      'A rights-based project should not float alone. It should connect the problem to relevant rights, national or local policy commitments, sector standards, SDGs, donor priorities, and inclusion commitments such as gender equality and disability inclusion.',
    questions: ['What rights are connected to this problem?', 'What national, local, or sector commitments are relevant?', 'What SDG or LNOB connection is meaningful?', 'What donor or program priority is relevant?', 'What gender or disability commitment should influence design?', 'What should we avoid overclaiming?'],
    changes: 'Policy alignment shapes the problem statement, justification, objectives, stakeholder engagement, advocacy tone, and proposal language.',
    example:
      'A livelihood project may connect to decent work, equality, non-discrimination, access to information, participation, social protection, or disability inclusion - depending on the real barriers identified.',
  },
  {
    id: 'rightsholders',
    label: 'Rights-holders and exclusion',
    heading: 'Who is affected, who is usually missed, and why?',
    body:
      'HRBA design avoids vague target groups. It asks which people face the strongest barriers and why they may be excluded from services, decisions, resources, information, or protection.',
    questions: ['Which groups are affected differently?', 'Who is usually not invited or not heard?', 'Who may be excluded by language, disability, gender, age, displacement, location, social status, or poverty?', 'Who may avoid participation because of fear, stigma, time burden, or lack of trust?', 'What would make participation possible and safe?'],
    changes: 'This analysis shapes targeting, inclusion measures, selection criteria, accessibility planning, communication channels, and participation design.',
    example:
      'If persons with disabilities are not reached by normal public meetings, the project must design accessible information, transport options, venue access, communication support, and direct outreach.',
  },
  {
    id: 'actors',
    label: 'Actors and capacities',
    heading: 'Who has responsibility, influence, power, or capacity gaps?',
    body:
      'A rights-based project does not treat the CSO as the only actor. It identifies rights-holders, duty-bearers, local authorities, service providers, community structures, private actors, social partners, informal influencers, and the CSO role.',
    questions: ['Who has formal responsibility?', 'Who controls resources or decisions?', 'Who influences community acceptance?', 'What capacities do rights-holders need to claim or exercise rights?', 'What capacities do duty-bearers need to respond?', 'What role should the CSO play without replacing duty-bearers?'],
    changes: 'Actor and capacity analysis shapes partnerships, referral pathways, coordination, advocacy, training, responsibility-sharing, and sustainability.',
    example:
      'If local officials support the project but do not understand accessibility obligations, the design may include practical duty-bearer engagement, not only community training.',
  },
  {
    id: 'causes',
    label: 'Root causes and barriers',
    heading: 'What is causing the problem beneath the surface?',
    body:
      'A proposal may describe the visible problem, but HRBA design asks what sits underneath it. The deeper causes may include discrimination, weak institutions, inaccessible services, lack of information, harmful norms, unclear procedures, corruption, fear, limited capacity, or weak accountability.',
    questions: ['Is this a symptom, root cause, or capacity gap?', 'What barriers are practical, social, institutional, legal, economic, or political?', 'What barriers affect women, men, youth, persons with disabilities, displaced people, or other groups differently?', 'Which barriers can this project realistically address?', 'Which barriers require coordination or referral?'],
    changes: 'Root-cause analysis shapes objectives, activity packages, partnerships, assumptions, risk management, and what the project should not promise.',
    example:
      'If people do not access livelihood opportunities because selection information is shared only through local leaders, the project must improve transparency and information access - not only provide training.',
  },
  {
    id: 'risk',
    label: 'Risks and do-no-harm',
    heading: 'What could go wrong, and who could be harmed or excluded?',
    body:
      'Good intentions are not enough. Projects can unintentionally create harm by exposing people, strengthening gatekeepers, worsening conflict over resources, collecting unsafe data, ignoring accessibility, making unrealistic promises, or increasing backlash against participants.',
    questions: ['Who could be harmed by visibility or participation?', 'Who could be excluded by selection methods?', 'Who may control access to project benefits?', 'What risks are linked to gender, disability, civic space, data, corruption, or resource distribution?', 'What safeguards must be built into the design?', 'What should the project avoid collecting, promising, or publicizing?'],
    changes: 'Risk analysis shapes selection, communication, safeguarding, complaint channels, data protection, referral planning, visibility, procurement, and mitigation measures.',
    example:
      'If a few local gatekeepers control participant lists, the project may need transparent criteria, multiple information channels, verification checks, and safe complaint options.',
  },
  {
    id: 'logic',
    label: 'Intervention logic',
    heading: 'How does the analysis become a coherent project design?',
    body:
      'After analysis, the team can build a clearer project logic. The project should show how the problem, rights-holders, barriers, actors, capacities, risks, objectives, activities, and evidence connect.',
    questions: ['What change is the project trying to support?', 'Which barriers will the project address directly?', 'Which rights-holder and duty-bearer capacities will be strengthened?', 'Which activities match the analysis?', 'What assumptions must hold true?', 'What evidence will show whether the design is working safely?'],
    changes: 'Intervention logic shapes the objective, outputs, activities, indicators, assumptions, risks, monitoring questions, and learning moments.',
    example:
      'A coherent HRBA project does not say: "We will train 300 people." It says why these people are prioritized, what barriers the training responds to, what other actors must do, what risks must be managed, and what change should be visible.',
  },
];

const studioNotes = [
  ['Context Snapshot', 'A short summary of the issue, location, affected groups, recent changes, and missing information.'],
  ['Rights and Policy Scan', 'A simple link between the project issue, relevant rights, SDGs/LNOB, national or local priorities, and donor commitments.'],
  ['Rights-Holder Segmentation', 'A clear description of who is affected differently and who may need intentional inclusion measures.'],
  ['Actor and Capacity Map', 'A practical map of rights-holders, duty-bearers, influencing actors, CSO roles, and capacity gaps.'],
  ['Root-Cause and Barrier Tree', 'A visual or table-based analysis showing symptoms, root causes, barriers, and capacity gaps.'],
  ['Risk and Do-No-Harm Plan', 'A simple plan showing who could be excluded or harmed and what safeguards are needed.'],
  ['HRBA Intervention Logic', 'A clear link between analysis, objectives, outputs, activities, assumptions, risks, and evidence.'],
];

const applicationItems = [
  {
    id: 'activities',
    title: 'They should not start by adding more activities.',
    body: 'More activities may make the proposal look busy. But if the activities do not respond to the real barriers, the project may still miss the people most affected.',
  },
  {
    id: 'shortcut',
    title: 'They should not use "vulnerable people" as a shortcut.',
    body: 'The team needs to identify which groups are affected differently and why. A broad label can hide gender barriers, disability barriers, displacement, social exclusion, location, age, or fear of speaking.',
  },
  {
    id: 'risk-annex',
    title: 'They should not treat risk as a final annex.',
    body: 'Risk must shape the design from the beginning. Selection, communication, data collection, participation, visibility, and feedback channels can all create or reduce harm.',
  },
];

function Module3Screen33A({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_screen33a || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-03A');
  const [mapOpen, setMapOpen] = useState(Boolean(stored.mapOpen || completed));
  const [openedStepIds, setOpenedStepIds] = useState<string[]>(
    completed ? processSteps.map((item) => item.id) : stored.openedStepIds || [],
  );
  const [activeStepId, setActiveStepId] = useState<string>(stored.activeStepId || processSteps[0].id);
  const [applicationOpenIds, setApplicationOpenIds] = useState<string[]>(stored.applicationOpenIds || []);
  const [quickCheck, setQuickCheck] = useState<string>(stored.quickCheck || '');
  const activeStep = processSteps.find((step) => step.id === activeStepId) || processSteps[0];
  const allStepsOpened = openedStepIds.length === processSteps.length;
  const allApplicationsOpened = applicationOpenIds.length === applicationItems.length;
  const canContinue = allStepsOpened && allApplicationsOpened && quickCheck;

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_screen33a', patch),
    }));
  };

  const openStep = (id: string) => {
    setActiveStepId(id);
    setOpenedStepIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      persist({ openedStepIds: next, activeStepId: id, mapOpen: true });
      return next;
    });
  };

  return (
    <main className="m3-screen" aria-labelledby="m3-s33a-title">
      <section className="m3-hero-panel m3-hero-panel--studio">
        <div>
          <ModuleContextLabel>Project Design Studio · Step 3</ModuleContextLabel>
          <ScreenTitle id="m3-s33a-title">Before the team rewrites the proposal, they need to understand the situation.</ScreenTitle>
          <p>
            The team could respond to the review comments by quickly adding HRBA words into the proposal:
            rights-holders, duty-bearers, participation, accountability, inclusion, and do-no-harm.
          </p>
          <p>But that would not fix the design.</p>
          <QuoteBlock>HRBA project design does not begin with better wording. It begins with better analysis.</QuoteBlock>
          <p>So the team stops editing the proposal for a moment. They open a blank wall chart and ask:</p>
          <QuoteBlock>"What do we need to understand before we decide what the project should do?"</QuoteBlock>
          {!mapOpen && (
            <PrimaryButton
              onClick={() => {
                setMapOpen(true);
                persist({ mapOpen: true });
              }}
            >
              Open the design studio map
            </PrimaryButton>
          )}
        </div>
        <div className="m3-visual-card m3-visual-card--wall" role="img" aria-label="Design studio wall with sticky notes for context, affected people, and responsibilities.">
          <span>Before activities</span>
          <span>Who is affected?</span>
          <span>Who must respond?</span>
        </div>
      </section>

      {mapOpen && (
        <section className="m3-workspace-grid" aria-labelledby="m3-s33a-map">
          <div className="m3-process-map">
            <div className="m3-section-head">
              <div>
                <p className="m3-card-kicker">Interactive process block</p>
                <h2 id="m3-s33a-map">The HRBA Design Studio Map</h2>
                <p>Click each step. These are the analysis steps that should shape a rights-based project design before activities are finalized.</p>
              </div>
              <ProgressChip>{openedStepIds.length} of 7 steps opened</ProgressChip>
            </div>
            <div className="m3-process-buttons">
              {processSteps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  className={`m3-process-button ${openedStepIds.includes(step.id) ? 'is-complete' : ''}`}
                  onClick={() => openStep(step.id)}
                >
                  <span aria-hidden="true">{openedStepIds.includes(step.id) ? '✓' : index + 1}</span>
                  {step.label}
                </button>
              ))}
            </div>
            <p className="m3-microcopy">
              You do not need a long research report for every project. But you do need enough practical analysis to make safe, relevant, and rights-aware design decisions.
            </p>
          </div>
          <aside className="m3-detail-panel" aria-live="polite">
            <p className="m3-card-kicker">Design studio step</p>
            <h2>{activeStep.heading}</h2>
            <p>{activeStep.body}</p>
            <h3>Design questions</h3>
            <ul>
              {activeStep.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
            <h3>What this changes in the project</h3>
            <p>{activeStep.changes}</p>
            <h3>Mini example</h3>
            <p>{activeStep.example}</p>
          </aside>
        </section>
      )}

      {allStepsOpened && (
        <section className="m3-section" aria-labelledby="m3-s33a-wall">
          <div className="m3-section-head">
            <div>
              <p className="m3-card-kicker">Design studio wall</p>
              <h2 id="m3-s33a-wall">What the team should produce before finalizing the proposal</h2>
              <p>The team does not need to produce a heavy report. But it should produce enough practical design evidence to make the project credible, inclusive, and safe.</p>
            </div>
          </div>
          <div className="m3-sticky-grid">
            {studioNotes.map(([title, body]) => (
              <article key={title} className="m3-sticky-note">
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <section className="m3-subsection">
            <h2>How this changes the team's next move</h2>
            <p>The team now realizes that the proposal should not be repaired by adding more words. It should be redesigned from analysis.</p>
            <AccordionCards
              items={applicationItems.map((item) => ({ ...item, body: <p>{item.body}</p> }))}
              openedIds={applicationOpenIds}
              onToggle={(id) => {
                setApplicationOpenIds((prev) => {
                  const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
                  persist({ applicationOpenIds: next });
                  return next;
                });
              }}
            />
          </section>
          <StatementCard heading="The design studio rule" dark>
            <p>Do not move from problem to activities too quickly.</p>
            <p>First understand the context, rights, people, barriers, actors, capacities, risks, and logic of change. Then design the project.</p>
          </StatementCard>
          <QuickCheck
            question="Which project design sequence is most consistent with HRBA?"
            selected={quickCheck}
            onSelect={(id) => {
              setQuickCheck(id);
              persist({ quickCheck: id });
            }}
            correctId="C"
            correctFeedback="Yes. HRBA design starts with analysis and uses that analysis to shape objectives, activities, participation, risk mitigation, and evidence."
            incorrectFeedback="HRBA project design does not begin with activities or template language. It begins by understanding the people, rights, barriers, responsibilities, risks, and change logic."
            options={[
              { id: 'A', label: 'A', text: 'Activities -> budget -> target number -> HRBA language' },
              { id: 'B', label: 'B', text: 'Donor template -> activities -> indicators -> final risk table' },
              { id: 'C', label: 'C', text: 'Context -> rights-holders -> barriers -> actors -> risks -> intervention logic -> activities' },
              { id: 'D', label: 'D', text: 'Training plan -> awareness session -> monitoring visit -> final report' },
            ]}
          />
          <div className="m3-cta-panel">
            <div>
              <h2>Now practice the first step.</h2>
              <p>Next, you will help the team build a short context snapshot for the fictional project.</p>
            </div>
            <PrimaryButton
              disabled={!canContinue}
              onClick={() =>
                completeScreen('M3-S1-03A', 'M3-S1-03B', routes['M3-S1-03B'], onChangeState, 'module3_screen33a', {
                  openedStepIds,
                  applicationOpenIds,
                  quickCheck,
                })
              }
            >
              Build the Context Snapshot
            </PrimaryButton>
          </div>
        </section>
      )}
    </main>
  );
}

const contextParts: GuidedPart[] = [
  {
    id: 'happening',
    title: 'Snapshot Part 1 - What is happening?',
    prompt: 'Which statement best describes the visible situation?',
    mode: 'single',
    options: [
      { id: 'A', text: 'People need livelihood training.' },
      { id: 'B', text: 'Some groups are facing reduced income and unequal access to livelihood opportunities after repeated shocks and displacement.' },
      { id: 'C', text: 'The CSO should train 300 people because livelihood training is a common project activity.' },
    ],
    best: ['B'],
    bestFeedback: 'Yes. This statement gives more context than "people need training." It shows the issue, the inequality, and the situation shaping the project.',
    feedback: {
      A: 'This is too narrow. Training may be part of the response, but it does not yet describe what is happening or who is affected differently.',
      C: 'This starts with the activity, not the context. HRBA design first asks what is happening before deciding what to do.',
    },
  },
  {
    id: 'affected',
    title: 'Snapshot Part 2 - Who appears affected differently?',
    prompt: 'Which groups should the team pay closer attention to in the design?',
    instruction: 'Select all that apply.',
    mode: 'multi',
    options: [
      { id: '1', text: 'Young people who receive information late or through informal networks.' },
      { id: '2', text: 'Women with unpaid care responsibilities that affect participation.' },
      { id: '3', text: 'Persons with disabilities who are rarely invited to meetings.' },
      { id: '4', text: 'Households affected by displacement or repeated shocks.' },
      { id: '5', text: 'Only the most visible community representatives.' },
      { id: '6', text: 'Better-connected households who already know how to access opportunities.' },
    ],
    best: ['1', '2', '3', '4'],
    bestFeedback: 'Good. These groups are not automatically the only rights-holders, but the notes show they may face specific barriers and need intentional design attention.',
    feedback: {
      '5': 'Community representatives may be useful, but they should not replace analysis of who is usually missed.',
      '6': 'Better-connected households may already have access to information. The design should avoid reinforcing that advantage.',
    },
  },
  {
    id: 'barriers',
    title: 'Snapshot Part 3 - What barriers are already visible?',
    prompt: 'Which barriers are visible in the notes?',
    instruction: 'Select all that apply.',
    mode: 'multi',
    options: [
      { id: '1', text: 'Information may not reach everyone equally.' },
      { id: '2', text: 'Training timing may exclude people with unpaid care responsibilities.' },
      { id: '3', text: 'Persons with disabilities may face invitation, access, communication, or participation barriers.' },
      { id: '4', text: 'Participant selection may be influenced by gatekeepers or informal networks.' },
      { id: '5', text: 'Local officials may need clearer roles and selection guidance.' },
      { id: '6', text: 'The only barrier is lack of skills.' },
      { id: '7', text: 'There are no barriers because the community leaders can identify participants.' },
    ],
    best: ['1', '2', '3', '4', '5'],
    bestFeedback: 'Yes. The notes already show several barriers. A strong design should respond to these barriers before finalizing activities.',
    feedback: {
      '6': 'Lack of skills may be one issue, but the notes show barriers related to information, time, disability inclusion, selection, and local responsibility.',
      '7': 'Community leaders may help, but relying only on them can miss less visible groups and may increase exclusion risks.',
    },
  },
  {
    id: 'risks',
    title: 'Snapshot Part 4 - What risks should the team notice early?',
    prompt: 'Which risks should be considered before the project design is finalized?',
    instruction: 'Select all that apply.',
    mode: 'multi',
    options: [
      { id: '1', text: 'Better-connected households may capture benefits.' },
      { id: '2', text: 'Less visible groups may not hear about the project.' },
      { id: '3', text: 'Persons with disabilities may be excluded if accessibility is not planned.' },
      { id: '4', text: 'Women may be invited but still unable to participate because of timing, care work, or safety concerns.' },
      { id: '5', text: 'Local officials may be supportive but unclear about transparent selection.' },
      { id: '6', text: 'Risk can wait until the final proposal annex.' },
      { id: '7', text: 'If the project has good intentions, do-no-harm is not necessary.' },
    ],
    best: ['1', '2', '3', '4', '5'],
    bestFeedback: 'Correct. These risks should shape the project from the start, especially selection, outreach, accessibility, feedback, and accountability.',
    feedback: {
      '6': 'Risk should not wait until the final annex. If risk is noticed late, the activity design may already be unsafe or exclusionary.',
      '7': 'Good intentions do not prevent harm. HRBA design asks how harm or exclusion could happen and what safeguards are needed.',
    },
  },
  {
    id: 'missing',
    title: 'Snapshot Part 5 - What information is still missing?',
    prompt: 'Which missing information should the team collect before finalizing the design?',
    instruction: 'Select all that apply.',
    mode: 'multi',
    options: [
      { id: '1', text: 'Which livelihood services, government plans, or other CSO projects already exist.' },
      { id: '2', text: 'Which groups are most excluded from current opportunities and why.' },
      { id: '3', text: 'What selection process would be transparent, inclusive, and safe.' },
      { id: '4', text: 'What accessibility support persons with disabilities may need.' },
      { id: '5', text: 'What timing and location would allow women and other excluded groups to participate.' },
      { id: '6', text: 'The final training venue color scheme.' },
      { id: '7', text: 'The design of the final project banner.' },
    ],
    best: ['1', '2', '3', '4', '5'],
    bestFeedback: 'Yes. These are design-relevant information gaps. They help the team avoid duplication, exclusion, unsafe participation, and weak targeting.',
    feedback: {
      '6': 'These details may be handled later. At this stage, the team needs information that affects rights, access, inclusion, responsibility, safety, and project logic.',
      '7': 'These details may be handled later. At this stage, the team needs information that affects rights, access, inclusion, responsibility, safety, and project logic.',
    },
  },
];

function selectionsAreBest(selected: string[], best: string[]) {
  return selected.length === best.length && best.every((id) => selected.includes(id));
}

function PartFeedback({ part, selected }: { part: GuidedPart; selected: string[] }) {
  const best = selectionsAreBest(selected, part.best);
  const selectedWeak = selected.find((id) => part.feedback[id]);
  return (
    <div className={`m3-feedback-panel ${best ? 'is-strong' : 'is-support'}`} aria-live="polite">
      <strong>{best ? 'Strong choice.' : 'Review this design reasoning.'}</strong>
      <p>{best ? part.bestFeedback : part.feedback[selectedWeak || selected[0]] || part.bestFeedback}</p>
    </div>
  );
}

function GuidedPartCard({
  part,
  selected,
  checked,
  onChange,
  onCheck,
}: {
  part: GuidedPart;
  selected: string[];
  checked: boolean;
  onChange: (values: string[]) => void;
  onCheck: () => void;
}) {
  const toggle = (id: string) => {
    if (part.mode === 'single') onChange([id]);
    else onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };
  return (
    <article className="m3-tool-step">
      <div className="m3-section-head">
        <div>
          <p className="m3-card-kicker">{part.title}</p>
          <h3>{part.prompt}</h3>
          {part.instruction && <p>{part.instruction}</p>}
        </div>
      </div>
      <div className="m3-choice-grid">
        {part.options.map((option) => {
          const active = selected.includes(option.id);
          return (
            <label key={option.id} className={`m3-choice-card ${active ? 'is-selected' : ''}`}>
              <input
                type={part.mode === 'single' ? 'radio' : 'checkbox'}
                name={part.id}
                checked={active}
                onChange={() => toggle(option.id)}
              />
              <span className="m3-choice-card__mark" aria-hidden="true">
                {active ? '✓' : option.id}
              </span>
              <span>{option.text}</span>
            </label>
          );
        })}
      </div>
      <div className="m3-cta-row">
        <SecondaryButton disabled={selected.length === 0} onClick={onCheck}>
          Check this part
        </SecondaryButton>
      </div>
      {checked && <PartFeedback part={part} selected={selected} />}
    </article>
  );
}

function Module3Screen33B({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_screen33b || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-03B');
  const [started, setStarted] = useState(Boolean(stored.started || completed));
  const [answers, setAnswers] = useState<Record<string, string[]>>(stored.answers || {});
  const [checkedParts, setCheckedParts] = useState<string[]>(completed ? contextParts.map((part) => part.id) : stored.checkedParts || []);
  const [implicationIds, setImplicationIds] = useState<string[]>(stored.implicationIds || []);
  const [quickCheck, setQuickCheck] = useState<string>(stored.quickCheck || '');
  const allPartsChecked = checkedParts.length === contextParts.length;
  const canContinue = allPartsChecked && implicationIds.length === 3 && quickCheck;

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_screen33b', patch),
    }));
  };

  const setPartAnswer = (partId: string, values: string[]) => {
    setAnswers((prev) => {
      const next = { ...prev, [partId]: values };
      persist({ answers: next });
      return next;
    });
  };

  const checkPart = (partId: string) => {
    setCheckedParts((prev) => {
      const next = prev.includes(partId) ? prev : [...prev, partId];
      persist({ checkedParts: next });
      return next;
    });
  };

  const implicationCards = [
    {
      id: 'target',
      title: 'It changes the target group.',
      body: 'The team should not simply say "300 vulnerable people." It should identify which groups face specific barriers and explain why the project will prioritize them.',
    },
    {
      id: 'participation',
      title: 'It changes participation.',
      body: 'The team should not rely only on community representatives. It should design information-sharing, consultation, selection, and feedback in ways that reach less visible groups.',
    },
    {
      id: 'activities',
      title: 'It changes the activity package.',
      body: 'Training may still be useful, but it must be designed around real barriers: timing, access, disability inclusion, information, selection, local responsibilities, and risk mitigation.',
    },
  ];

  return (
    <main className="m3-screen" aria-labelledby="m3-s33b-title">
      <section className="m3-hero-panel m3-hero-panel--snapshot">
        <div>
          <ModuleContextLabel>Project Design Studio · Practice 1</ModuleContextLabel>
          <ScreenTitle id="m3-s33b-title">Build a context snapshot before designing activities.</ScreenTitle>
          <p>
            The CSO team now understands that the proposal needs stronger analysis. They decide to begin
            with a short context snapshot.
          </p>
          <QuoteBlock>"What do we need to understand about this situation before we decide what the project should do?"</QuoteBlock>
          <p>
            A context snapshot helps the team avoid designing from assumptions. It gives enough clarity to
            decide who should be prioritized, what barriers matter, what risks may appear, and what
            information is still missing.
          </p>
          {!started && (
            <PrimaryButton
              onClick={() => {
                setStarted(true);
                persist({ started: true });
              }}
            >
              Start the context snapshot
            </PrimaryButton>
          )}
        </div>
        <div className="m3-visual-card m3-visual-card--notes" role="img" aria-label="Fictional field notes, map outline, community meeting sketch, and project concept note.">
          <span>Field notes</span>
          <span>Map</span>
          <span>Concept note</span>
        </div>
      </section>

      {started && (
        <>
          <section className="m3-section">
            <p className="m3-card-kicker">Fictional project case</p>
            <h2>Livelihood Skills for Vulnerable Community Members</h2>
            <p>A local CSO wants to design a livelihood and skills project in three selected kebeles.</p>
            <ul className="m3-clean-list">
              <li>Some households say they have lost income after repeated shocks and displacement.</li>
              <li>Young people say they hear about opportunities late or through informal networks.</li>
              <li>Women's group members say training schedules often clash with unpaid care responsibilities.</li>
              <li>A disability association representative says persons with disabilities are rarely invited to project meetings.</li>
              <li>Local officials say they are willing to support the project but are not sure how participant selection should be handled.</li>
              <li>Community leaders say they can help identify participants, but the CSO is unsure whether this will reach less visible groups.</li>
              <li>Some people are worried that project benefits may be captured by better-connected households.</li>
              <li>The team does not yet know which existing livelihood services, government plans, or other CSO projects are already operating in the area.</li>
            </ul>
          </section>

          <section className="m3-section">
            <div className="m3-section-head">
              <div>
                <p className="m3-card-kicker">Guided checklist</p>
                <h2>Build the context snapshot</h2>
                <p>For each part of the snapshot, choose the option that gives the strongest HRBA design information.</p>
              </div>
              <ProgressChip>{checkedParts.length} of 5 parts checked</ProgressChip>
            </div>
            <div className="m3-tool-stack">
              {contextParts.map((part) => (
                <GuidedPartCard
                  key={part.id}
                  part={part}
                  selected={answers[part.id] || []}
                  checked={checkedParts.includes(part.id)}
                  onChange={(values) => setPartAnswer(part.id, values)}
                  onCheck={() => checkPart(part.id)}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {allPartsChecked && (
        <section className="m3-section">
          <div className="m3-output-card">
            <p className="m3-card-kicker">Your context snapshot</p>
            <h2>Context Snapshot - Livelihood Skills Project</h2>
            <p>
              The project is being considered in three kebeles where some households face reduced income
              and unequal access to livelihood opportunities after repeated shocks and displacement.
            </p>
            <p>
              The notes suggest that young people, women with unpaid care responsibilities, persons with
              disabilities, and households affected by displacement may experience the issue differently.
              Some groups may be missed if information is shared mainly through informal networks or
              visible community representatives.
            </p>
            <p>
              Early barriers include unequal access to information, training schedules that may not fit care
              responsibilities, disability-related access and communication barriers, unclear participant
              selection processes, and unclear roles for local officials.
            </p>
            <p>
              Early risks include elite capture, exclusion of less visible groups, inaccessible participation,
              weak transparency in selection, and possible reliance on gatekeepers.
            </p>
            <p>
              Before finalizing the project, the team should learn more about existing livelihood services,
              government plans, other CSO projects, who is most excluded and why, what transparent
              selection would require, what accessibility support is needed, and what timing and location
              would make participation more realistic.
            </p>
            <p className="m3-microcopy">This snapshot is not the full project design. It is the first layer of analysis that helps the team design more responsibly.</p>
          </div>
          <section className="m3-subsection">
            <h2>How this snapshot changes the design</h2>
            <AccordionCards
              items={implicationCards.map((item) => ({ ...item, body: <p>{item.body}</p> }))}
              openedIds={implicationIds}
              onToggle={(id) => {
                setImplicationIds((prev) => {
                  const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
                  persist({ implicationIds: next });
                  return next;
                });
              }}
            />
          </section>
          <NoteBlock heading="Common design mistake">
            <p>
              Many proposals jump from "people need support" to "we will train people." HRBA design slows
              that jump. It asks what is happening, who is affected differently, what barriers exist, who may
              be missed, and what the project needs to understand before choosing the response.
            </p>
          </NoteBlock>
          <QuickCheck
            question="What is the main purpose of a context snapshot in HRBA project design?"
            selected={quickCheck}
            onSelect={(id) => {
              setQuickCheck(id);
              persist({ quickCheck: id });
            }}
            correctId="C"
            correctFeedback="Yes. A context snapshot helps the team make better design decisions without turning the project into a long research exercise."
            incorrectFeedback="A context snapshot should be practical. It helps the team understand enough to design responsibly, but it should not become a heavy report or replace participation."
            options={[
              { id: 'A', label: 'A', text: 'To make the proposal longer and more technical.' },
              { id: 'B', label: 'B', text: 'To collect every possible detail before doing anything.' },
              { id: 'C', label: 'C', text: 'To understand enough about the situation, affected groups, barriers, risks, and missing information before designing activities.' },
              { id: 'D', label: 'D', text: 'To replace participation with desk review.' },
            ]}
          />
          <div className="m3-cta-panel">
            <div>
              <h2>Next, connect the project to rights and policy.</h2>
              <p>The team now has a clearer context snapshot. Next, they will learn how to align the project with rights, SDGs, policy priorities, and donor commitments without copying language mechanically.</p>
            </div>
            <PrimaryButton
              disabled={!canContinue}
              onClick={() =>
                completeScreen('M3-S1-03B', 'M3-S1-03C', routes['M3-S1-03C'], onChangeState, 'module3_screen33b', {
                  answers,
                  checkedParts,
                  implicationIds,
                  quickCheck,
                })
              }
            >
              Continue to Policy Alignment
            </PrimaryButton>
          </div>
        </section>
      )}
    </main>
  );
}

const alignmentTabs = [
  {
    id: 'rights',
    label: 'Rights',
    heading: 'Which rights are connected to the issue?',
    body:
      'Rights alignment means connecting the project problem to dignity, equality, participation, access, protection, information, work, livelihood, education, health, water, social protection, or other relevant rights. It does not mean making legal claims beyond the CSO expertise.',
    question: 'Which rights are affected, and how should that influence the problem statement and objective?',
    case: 'The livelihood project may connect to equality, non-discrimination, participation, access to information, access to services, and livelihood or work-related opportunities.',
    change: 'The proposal should explain not only that people need training, but that some groups face unequal access to information, selection, participation, and support.',
  },
  {
    id: 'sdg',
    label: 'SDGs / LNOB',
    heading: 'Who is furthest behind, and why?',
    body:
      'SDG alignment should not be a list of goal numbers. It should help the team explain how the project contributes to reducing inequality and reaching people who are often missed.',
    question: 'Which groups may be furthest behind in this situation, and what will the project do differently for them?',
    case: 'Youth who receive information late, women with unpaid care responsibilities, persons with disabilities, and households affected by displacement may require intentional inclusion measures.',
    change: 'The project should adapt outreach, timing, venue accessibility, selection criteria, communication methods, and feedback channels.',
  },
  {
    id: 'local',
    label: 'National / Local',
    heading: 'What local or national commitments matter?',
    body:
      'Projects become stronger when they connect to relevant national, regional, woreda, or sector priorities. This should be done carefully. The proposal should not copy policy language.',
    question: 'Which local or national plan, service responsibility, or sector priority is relevant to this problem?',
    case: 'The team still needs to check which livelihood services, government plans, social protection mechanisms, youth employment initiatives, disability inclusion commitments, or local development plans already exist in the area.',
    change: 'The team should avoid duplication, coordinate with responsible actors, and clarify what the CSO will support versus what duty-bearers should lead.',
  },
  {
    id: 'donor',
    label: 'Donor / Program',
    heading: 'What does the donor priority really require?',
    body:
      'Donor alignment is not about repeating donor language. It is about showing that the project responds to the donor purpose in a grounded and credible way.',
    question: 'How does the project respond to the donor priority through real design choices, not only wording?',
    case: 'If the donor prioritizes inclusion, resilience, local civil society, gender equality, or youth opportunity, the proposal should show how these priorities shape targeting, participation, partnerships, safeguards, and learning.',
    change: 'The proposal should include clear design choices that demonstrate alignment: inclusive outreach, accessible participation, transparent selection, risk mitigation, and coordination with local actors.',
  },
  {
    id: 'gender',
    label: 'Gender',
    heading: 'How does gender shape the problem and the project response?',
    body:
      'Gender alignment means more than adding women as participants. It asks how gender affects access, control over resources, decision-making, safety, time, unpaid care work, mobility, information, confidence, and participation.',
    question: 'How do women, men, girls, boys, and people of diverse identities experience the issue differently, and what should change in the design?',
    case: "Women's group members have already said that training schedules often clash with unpaid care responsibilities. This is not a small logistical issue. It can determine whether participation is real or only promised.",
    change: "The project should consider timing, location, childcare or care-sensitive planning, safe participation, women's influence in selection criteria, and gender-sensitive risk analysis.",
  },
  {
    id: 'disability',
    label: 'Disability',
    heading: 'How will persons with disabilities access and influence the project?',
    body:
      'Disability inclusion is not only about inviting persons with disabilities. It asks whether people can receive information, reach the venue, communicate, participate, influence decisions, give feedback, and benefit from the project with dignity.',
    question: 'What accessibility barriers may exist, and what reasonable adjustments are needed?',
    case: 'A disability association representative says persons with disabilities are rarely invited to project meetings. This signals a design gap in outreach, communication, access, and participation.',
    change: 'The project should include accessible information, direct outreach, venue accessibility, communication support, transport considerations, inclusive facilitation, and feedback channels that persons with disabilities can use.',
  },
];

const matchingPairs = [
  {
    id: 'rights',
    title: 'Rights alignment',
    options: {
      A: 'The project promotes human rights and supports vulnerable people.',
      B: 'The project addresses unequal access to livelihood opportunities by improving transparent selection, inclusive information-sharing, and participation of groups often excluded from decisions.',
    },
    feedback: 'Correct. Option B explains what rights-based issue the project is addressing and how the design will respond.',
  },
  {
    id: 'sdg',
    title: 'SDG/LNOB alignment',
    options: {
      A: 'The project contributes to the SDGs and leaves no one behind.',
      B: 'The project applies LNOB by identifying groups missed by normal outreach and adapting selection, timing, accessibility, and feedback channels so they can participate.',
    },
    feedback: 'Correct. Option B turns LNOB into practical design choices.',
  },
  {
    id: 'gender',
    title: 'Gender alignment',
    options: {
      A: 'The project will include women in all activities.',
      B: 'The project will assess how unpaid care, mobility, safety, information access, and decision-making power affect women participation and adapt activities accordingly.',
    },
    feedback: 'Correct. Option B goes beyond numbers and asks how gender affects real participation and benefit.',
  },
  {
    id: 'disability',
    title: 'Disability alignment',
    options: {
      A: 'The project will invite persons with disabilities to attend training.',
      B: 'The project will work with disability representatives to identify accessibility barriers and adapt outreach, venues, communication, facilitation, and feedback channels.',
    },
    feedback: 'Correct. Option B treats disability inclusion as design work, not only an invitation.',
  },
  {
    id: 'donor',
    title: 'Donor alignment',
    options: {
      A: 'The project is fully aligned with the donor inclusion and resilience priorities.',
      B: 'The project supports inclusion and resilience by prioritizing groups facing repeated shocks and exclusion, strengthening transparent selection, and building local actor capacity to respond more fairly.',
    },
    feedback: 'Correct. Option B connects donor priorities to the actual project logic.',
  },
];

function Module3Screen33C({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_screen33c || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-03C');
  const [started, setStarted] = useState(Boolean(stored.started || completed));
  const [activeTabId, setActiveTabId] = useState<string>(stored.activeTabId || alignmentTabs[0].id);
  const [visitedTabs, setVisitedTabs] = useState<string[]>(completed ? alignmentTabs.map((tab) => tab.id) : stored.visitedTabs || []);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>(stored.matchingAnswers || {});
  const [quickCheck, setQuickCheck] = useState<string>(stored.quickCheck || '');
  const activeTab = alignmentTabs.find((tab) => tab.id === activeTabId) || alignmentTabs[0];
  const allTabsVisited = visitedTabs.length === alignmentTabs.length;
  const allMatchesAnswered = matchingPairs.every((pair) => matchingAnswers[pair.id]);
  const canContinue = allTabsVisited && allMatchesAnswered && quickCheck;

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_screen33c', patch),
    }));
  };

  const openTab = (id: string) => {
    setActiveTabId(id);
    setVisitedTabs((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      persist({ activeTabId: id, visitedTabs: next, started: true });
      return next;
    });
  };

  return (
    <main className="m3-screen" aria-labelledby="m3-s33c-title">
      <section className="m3-hero-panel m3-hero-panel--alignment">
        <div>
          <ModuleContextLabel>Project Design Studio · Step 4</ModuleContextLabel>
          <ScreenTitle id="m3-s33c-title">Now the team must connect the project to the bigger picture.</ScreenTitle>
          <p>
            The team has built a short context snapshot. They now understand that the project is not only
            about training 300 people.
          </p>
          <p>
            The issue may involve unequal access to livelihood opportunities, information gaps, exclusion
            from decisions, disability barriers, gendered time burdens, weak transparency in selection, and
            unclear local responsibilities.
          </p>
          <QuoteBlock>"How do we show that this project fits rights, local priorities, SDGs, and donor expectations - without just copying nice words into the proposal?"</QuoteBlock>
          <p>
            Policy alignment is not decoration. It should help the team explain why the project matters,
            who it should prioritize, what commitments it supports, and how the design will contribute to
            real change.
          </p>
          {!started && (
            <PrimaryButton
              onClick={() => {
                setStarted(true);
                openTab(alignmentTabs[0].id);
              }}
            >
              Explore policy alignment
            </PrimaryButton>
          )}
        </div>
        <div className="m3-visual-card m3-visual-card--connections" role="img" aria-label="Fictional context snapshot connected to alignment cards for rights, SDGs, local priorities, donor priorities, gender, and disability.">
          <span>Rights</span>
          <span>SDG/LNOB</span>
          <span>Local plan</span>
          <span>Donor call</span>
          <span>Gender</span>
          <span>Disability</span>
        </div>
      </section>

      {started && (
        <>
          <section className="m3-section">
            <div className="m3-section-head">
              <div>
                <p className="m3-card-kicker">Before-after comparison</p>
                <h2>Two ways to write alignment</h2>
                <p>Read the two versions. One sounds formal but says very little. The other connects the project to the actual design problem.</p>
              </div>
            </div>
            <div className="m3-comparison-grid">
              <article className="m3-comparison-card">
                <p className="m3-card-kicker">Copy-paste alignment</p>
                <p>This project is aligned with human rights, SDGs, gender equality, disability inclusion, and donor priorities. The project will support vulnerable groups and contribute to inclusive development and sustainable livelihoods.</p>
                <small>This paragraph uses strong words, but it does not explain the real connection.</small>
              </article>
              <article className="m3-comparison-card is-strong">
                <p className="m3-card-kicker">Design-based alignment</p>
                <p>The project responds to unequal access to livelihood opportunities among groups that are often missed by normal information and selection processes, including youth, women with unpaid care responsibilities, persons with disabilities, and households affected by displacement.</p>
                <p>The design supports non-discrimination, meaningful participation, transparency, and accountability by strengthening inclusive outreach, accessible participation, transparent selection, feedback channels, and coordination with responsible local actors.</p>
                <small>This version links alignment to the actual rights issue, affected groups, barriers, responsibilities, and design choices.</small>
              </article>
            </div>
          </section>

          <StatementCard heading="Good alignment should change the project design.">
            <p>If a policy, SDG, rights standard, gender commitment, disability commitment, or donor priority is truly relevant, it should influence at least one design decision.</p>
            <ul>
              <li>who the project prioritizes;</li>
              <li>how participation is organized;</li>
              <li>what barriers the project addresses;</li>
              <li>which actors are engaged;</li>
              <li>what risks are managed;</li>
              <li>what objective is written;</li>
              <li>what evidence is collected safely.</li>
            </ul>
          </StatementCard>

          <section className="m3-workspace-grid" aria-labelledby="m3-s33c-tabs">
            <div className="m3-tab-card">
              <div className="m3-section-head">
                <div>
                  <p className="m3-card-kicker">Interactive tabs</p>
                  <h2 id="m3-s33c-tabs">Six alignment lenses for HRBA project design</h2>
                  <p>Open each tab. For every alignment lens, ask: "What does this change in the design?"</p>
                </div>
                <ProgressChip>{visitedTabs.length} of 6 opened</ProgressChip>
              </div>
              <div className="m3-tab-list" role="tablist" aria-label="Alignment lenses">
                {alignmentTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTabId === tab.id}
                    className={`m3-tab-button ${visitedTabs.includes(tab.id) ? 'is-complete' : ''}`}
                    onClick={() => openTab(tab.id)}
                  >
                    {visitedTabs.includes(tab.id) ? '✓ ' : ''}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <article className="m3-detail-panel" role="tabpanel" aria-live="polite">
              <p className="m3-card-kicker">{activeTab.label}</p>
              <h2>{activeTab.heading}</h2>
              <p>{activeTab.body}</p>
              <h3>Design question</h3>
              <p>{activeTab.question}</p>
              <h3>For the fictional project</h3>
              <p>{activeTab.case}</p>
              <h3>What this should change</h3>
              <p>{activeTab.change}</p>
            </article>
          </section>

          <section className="m3-section">
            <div className="m3-section-head">
              <div>
                <p className="m3-card-kicker">Matching activity</p>
                <h2>Which alignment statement is stronger?</h2>
                <p>For each pair, choose the statement that shows real design-based alignment.</p>
              </div>
            </div>
            <div className="m3-tool-stack">
              {matchingPairs.map((pair) => {
                const answer = matchingAnswers[pair.id];
                return (
                  <article className="m3-tool-step" key={pair.id}>
                    <h3>{pair.title}</h3>
                    <div className="m3-choice-grid">
                      {(['A', 'B'] as const).map((key) => (
                        <label key={key} className={`m3-choice-card ${answer === key ? 'is-selected' : ''}`}>
                          <input
                            type="radio"
                            name={`m3-match-${pair.id}`}
                            checked={answer === key}
                            onChange={() => {
                              const next = { ...matchingAnswers, [pair.id]: key };
                              setMatchingAnswers(next);
                              persist({ matchingAnswers: next });
                            }}
                          />
                          <span className="m3-choice-card__mark" aria-hidden="true">{answer === key ? '✓' : key}</span>
                          <span>{pair.options[key]}</span>
                        </label>
                      ))}
                    </div>
                    {answer && (
                      <div className={`m3-feedback-panel ${answer === 'B' ? 'is-strong' : 'is-support'}`} aria-live="polite">
                        <p>{answer === 'B' ? pair.feedback : 'Look again for the option that connects alignment to concrete design choices.'}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {allTabsVisited && allMatchesAnswered && (
        <section className="m3-section">
          <div className="m3-output-card">
            <p className="m3-card-kicker">Model alignment note for the fictional proposal</p>
            <h2>Alignment note - Livelihood Skills Project</h2>
            <p>
              This project responds to unequal access to livelihood opportunities among groups that may be
              missed by normal information-sharing, consultation, and selection processes. Early context
              notes suggest that youth, women with unpaid care responsibilities, persons with disabilities,
              and households affected by repeated shocks or displacement may experience different barriers
              to participation and benefit.
            </p>
            <p>
              The project will apply HRBA principles by strengthening inclusive outreach, accessible
              participation, transparent selection, feedback channels, and coordination with responsible local
              actors. It will also use gender and disability analysis to adapt activity timing, venue access,
              communication, selection criteria, and risk mitigation.
            </p>
            <p>
              The project will be further aligned with relevant local plans, sector priorities, SDG/LNOB
              commitments, and donor inclusion priorities after the team completes a focused policy and
              standards scan.
            </p>
            <p className="m3-microcopy">This is a model, not a fixed template. A real proposal should be adapted to the actual context, evidence, policy references, and donor call.</p>
          </div>
          <NoteBlock heading="Common design mistake">
            <p>Do not write alignment as a list of impressive references.</p>
            <p>A stronger proposal shows how rights, SDGs, policy priorities, gender equality, disability inclusion, and donor expectations shape the actual design decisions.</p>
          </NoteBlock>
          <QuickCheck
            question="Which statement best describes strong policy alignment in HRBA project design?"
            selected={quickCheck}
            onSelect={(id) => {
              setQuickCheck(id);
              persist({ quickCheck: id });
            }}
            correctId="C"
            correctFeedback="Yes. Strong alignment connects the project issue to relevant commitments and shows how those commitments influence design choices."
            incorrectFeedback="Policy alignment is not copy-paste language or a long list of references. It should strengthen the design logic."
            options={[
              { id: 'A', label: 'A', text: 'It copies the donor wording into the proposal.' },
              { id: 'B', label: 'B', text: 'It lists as many policies, SDGs, and rights instruments as possible.' },
              { id: 'C', label: 'C', text: 'It shows how relevant rights, policies, SDGs, and commitments shape real design decisions.' },
              { id: 'D', label: 'D', text: 'It replaces context analysis with policy references.' },
            ]}
          />
          <div className="m3-cta-panel">
            <div>
              <h2>Now practice the alignment scan.</h2>
              <p>Next, you will help the team complete a simple policy and standards alignment scan for the fictional project.</p>
            </div>
            <PrimaryButton
              disabled={!canContinue}
              onClick={() =>
                completeScreen('M3-S1-03C', 'M3-S1-03D', routes['M3-S1-03D'], onChangeState, 'module3_screen33c', {
                  visitedTabs,
                  matchingAnswers,
                  quickCheck,
                })
              }
            >
              Complete the Alignment Scan
            </PrimaryButton>
          </div>
        </section>
      )}
    </main>
  );
}

const scanSteps: GuidedPart[] = [
  {
    id: 'rights',
    title: '1 of 6 · Rights alignment',
    prompt: 'Which rights-based framing best fits the fictional project case?',
    mode: 'single',
    options: [
      { id: 'A', text: 'The project supports vulnerable people through training and awareness.' },
      { id: 'B', text: 'The project addresses unequal access to livelihood opportunities by strengthening inclusive information-sharing, participation, transparent selection, and support for groups facing specific barriers.' },
      { id: 'C', text: 'The project is rights-based because all development projects support human rights in some way.' },
    ],
    best: ['B'],
    bestFeedback: 'Yes. This framing connects the project to unequal access, participation, transparency, and specific barriers. It gives a stronger rights-based basis for design.',
    feedback: {
      A: 'This is too activity-focused. It says what the project does, but not what rights-related barrier it addresses.',
      C: 'This is too broad. HRBA should be intentional. The proposal should explain how the project contributes to rights, participation, inclusion, accountability, and dignity.',
    },
  },
  {
    id: 'lnob',
    title: '2 of 6 · SDG and LNOB alignment',
    prompt: 'Which LNOB statement is strongest?',
    mode: 'single',
    options: [
      { id: 'A', text: 'The project contributes to SDGs and leaves no one behind.' },
      { id: 'B', text: 'The project will reach 300 people, so it contributes to inclusion.' },
      { id: 'C', text: 'The project applies LNOB by identifying groups that may be missed by normal outreach and adapting information-sharing, timing, accessibility, selection, and feedback so they can participate.' },
    ],
    best: ['C'],
    bestFeedback: 'Correct. LNOB becomes meaningful when it changes how the project reaches, includes, and listens to people who are usually missed.',
    feedback: {
      A: 'This sounds positive but remains general. It does not show who may be left behind or what the project will do differently.',
      B: 'Numbers matter, but reaching many people does not automatically mean reaching those most excluded.',
    },
  },
  {
    id: 'local',
    title: '3 of 6 · Local and sector priority alignment',
    prompt: 'What should the team do before claiming alignment with local or sector priorities?',
    mode: 'single',
    options: [
      { id: 'A', text: 'Add a sentence saying the project supports local development priorities.' },
      { id: 'B', text: 'Check existing livelihood services, local plans, government responsibilities, other CSO activities, and gaps before finalizing the design.' },
      { id: 'C', text: 'Avoid local actors because HRBA is mainly about community participation.' },
    ],
    best: ['B'],
    bestFeedback: 'Yes. Local alignment should be grounded in what already exists, what gaps remain, and which actors have responsibility or influence.',
    feedback: {
      A: 'This may sound aligned, but it is not enough. The team needs to know what local priorities and services are actually relevant.',
      C: 'HRBA values participation, but it also requires understanding responsibilities, institutions, policies, and coordination.',
    },
  },
  {
    id: 'donor',
    title: '4 of 6 · Donor and program alignment',
    prompt: 'Which donor alignment statement is strongest?',
    mode: 'single',
    options: [
      { id: 'A', text: 'The project is fully aligned with the donor priorities on inclusion, resilience, gender, and local development.' },
      { id: 'B', text: 'The project supports donor priorities by translating inclusion and resilience into practical design choices: targeted outreach, accessible participation, transparent selection, duty-bearer coordination, and risk mitigation.' },
      { id: 'C', text: 'Donor alignment should be written after the project is designed, because it is mainly a wording issue.' },
    ],
    best: ['B'],
    bestFeedback: 'Correct. Donor alignment is stronger when it is visible in design choices, not only in proposal language.',
    feedback: {
      A: 'This may be acceptable as a summary sentence, but it is too general by itself. It does not show how the project is aligned.',
      C: 'If donor priorities are meaningful, they should influence design from the beginning.',
    },
  },
  {
    id: 'gender',
    title: '5 of 6 · Gender equality alignment',
    prompt: 'Which gender alignment choice is strongest for this project?',
    mode: 'single',
    options: [
      { id: 'A', text: 'The project will ensure that at least 50% of participants are women.' },
      { id: 'B', text: "The project will invite women's group representatives to the launch meeting." },
      { id: 'C', text: 'The project will analyze how unpaid care, safety, mobility, access to information, control over resources, and decision-making power affect participation and benefit.' },
    ],
    best: ['C'],
    bestFeedback: 'Yes. Participation targets can be useful, but gender equality requires understanding the barriers that affect real access, voice, safety, and benefit.',
    feedback: {
      A: 'A percentage target may help, but it is not enough. Women may be counted as participants without having real access, safety, influence, or benefit.',
      B: 'Inviting representatives can help, but gender analysis should not be reduced to one meeting.',
    },
  },
  {
    id: 'disability',
    title: '6 of 6 · Disability inclusion alignment',
    prompt: 'Which disability inclusion choice is strongest?',
    mode: 'single',
    options: [
      { id: 'A', text: 'The project will invite persons with disabilities to participate.' },
      { id: 'B', text: 'The project will consult disability representatives and identify barriers related to information, venues, communication, transport, facilitation, selection, feedback, and reasonable accommodation.' },
      { id: 'C', text: 'The project will include disability if persons with disabilities apply.' },
    ],
    best: ['B'],
    bestFeedback: 'Correct. Disability inclusion must be designed intentionally. It should address information, access, communication, participation, and feedback.',
    feedback: {
      A: 'Invitation is not enough. People may be invited but still unable to participate if the design is inaccessible.',
      C: 'This is too passive. HRBA design does not wait for excluded groups to overcome barriers by themselves.',
    },
  },
];

const scanImplications: Record<string, string> = {
  rights: 'The proposal should revise the problem statement so it does not only say "people need training." It should explain unequal access and exclusion from opportunities.',
  lnob: 'The proposal should describe who may be furthest behind and what practical inclusion measures the project will use.',
  local: 'The project should avoid duplication and clarify how the CSO will coordinate with responsible local actors.',
  donor: 'The project should show how donor priorities affect targeting, participation, safeguards, partnerships, and expected change.',
  gender: 'The project should adapt timing, location, outreach, facilitation, selection, feedback, and risk mitigation based on gendered barriers.',
  disability: 'The project should plan accessible information, venue access, inclusive facilitation, transport considerations, communication support, and accessible feedback channels.',
};

function Module3Screen33D({ state, onChangeState }: Module3RendererProps) {
  const stored = state.practiceCheckState.module3_screen33d || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes('M3-S1-03D');
  const [started, setStarted] = useState(Boolean(stored.started || completed));
  const [answers, setAnswers] = useState<Record<string, string[]>>(stored.answers || {});
  const [checkedParts, setCheckedParts] = useState<string[]>(completed ? scanSteps.map((part) => part.id) : stored.checkedParts || []);
  const [quickCheck, setQuickCheck] = useState<string>(stored.quickCheck || '');
  const allStepsChecked = checkedParts.length === scanSteps.length;
  const canContinue = allStepsChecked && quickCheck;

  const persist = (patch: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, 'module3_screen33d', patch),
    }));
  };

  const setPartAnswer = (partId: string, values: string[]) => {
    setAnswers((prev) => {
      const next = { ...prev, [partId]: values };
      persist({ answers: next });
      return next;
    });
  };

  const checkPart = (partId: string) => {
    setCheckedParts((prev) => {
      const next = prev.includes(partId) ? prev : [...prev, partId];
      persist({ checkedParts: next });
      return next;
    });
  };

  return (
    <main className="m3-screen" aria-labelledby="m3-s33d-title">
      <section className="m3-hero-panel m3-hero-panel--scan">
        <div>
          <ModuleContextLabel>Project Design Studio · Practice 2</ModuleContextLabel>
          <ScreenTitle id="m3-s33d-title">Complete a simple alignment scan.</ScreenTitle>
          <p>
            The team now understands that policy alignment should not be a paragraph full of impressive
            words. It should help explain why the project matters and how the design should change.
          </p>
          <QuoteBlock>"Which rights, standards, priorities, and commitments are relevant - and what do they change in our project design?"</QuoteBlock>
          <p>
            This scan is not legal advice. It is a practical design tool. It helps a CSO connect a project idea
            to relevant commitments in a careful, honest, and useful way.
          </p>
          {!started && (
            <PrimaryButton
              onClick={() => {
                setStarted(true);
                persist({ started: true });
              }}
            >
              Start the alignment scan
            </PrimaryButton>
          )}
        </div>
        <div className="m3-visual-card m3-visual-card--scan" role="img" aria-label="Fictional context snapshot connected to six alignment scan cards.">
          <span>Rights</span>
          <span>SDG/LNOB</span>
          <span>Local priorities</span>
          <span>Donor priorities</span>
          <span>Gender equality</span>
          <span>Disability inclusion</span>
        </div>
      </section>

      {started && (
        <>
          <section className="m3-section">
            <p className="m3-card-kicker">Fictional project case reminder</p>
            <h2>Livelihood Skills for Vulnerable Community Members</h2>
            <p>The CSO is designing a livelihood and skills project in three selected kebeles.</p>
            <ul className="m3-clean-list">
              <li>some households face reduced income after repeated shocks and displacement;</li>
              <li>young people may hear about opportunities late or through informal networks;</li>
              <li>women's participation may be affected by unpaid care responsibilities;</li>
              <li>persons with disabilities are rarely invited to project meetings;</li>
              <li>participant selection may be influenced by community gatekeepers;</li>
              <li>local officials are willing to support the project but need clearer roles;</li>
              <li>the team still needs to check existing services, local plans, and other CSO activities.</li>
            </ul>
          </section>

          <section className="m3-section">
            <div className="m3-section-head">
              <div>
                <p className="m3-card-kicker">Guided alignment scan</p>
                <h2>Complete the scan</h2>
                <p>Choose the strongest alignment option for each scan step.</p>
              </div>
              <ProgressChip>{checkedParts.length} of 6 scan steps checked</ProgressChip>
            </div>
            <div className="m3-tool-stack">
              {scanSteps.map((part) => (
                <article className="m3-tool-step" key={part.id}>
                  <GuidedPartCard
                    part={part}
                    selected={answers[part.id] || []}
                    checked={checkedParts.includes(part.id)}
                    onChange={(values) => setPartAnswer(part.id, values)}
                    onCheck={() => checkPart(part.id)}
                  />
                  {checkedParts.includes(part.id) && (
                    <div className="m3-design-implication">
                      <strong>Design implication:</strong>
                      <p>{scanImplications[part.id]}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {allStepsChecked && (
        <section className="m3-section">
          <div className="m3-output-card">
            <p className="m3-card-kicker">Your alignment scan</p>
            <h2>Policy and Standards Alignment Scan - Livelihood Skills Project</h2>
            <div className="m3-scan-output-grid">
              {[
                ['Rights', 'The project is connected to unequal access to livelihood opportunities, participation, information, transparency, non-discrimination, and dignity.', 'The problem statement should explain barriers to access and participation, not only lack of training.'],
                ['SDGs / LNOB', 'The project can support LNOB by identifying and intentionally including groups missed by normal outreach and selection processes.', 'The project should adapt outreach, timing, accessibility, selection criteria, and feedback channels to reach less visible groups.'],
                ['Local and sector priorities', 'The team needs to check existing livelihood services, local plans, government responsibilities, and other CSO activities before finalizing the design.', 'The project should avoid duplication, clarify coordination, and define what the CSO supports versus what duty-bearers should lead.'],
                ['Donor and program priorities', 'The project may align with inclusion, resilience, local civil society strengthening, gender equality, disability inclusion, and accountable participation if these priorities shape design choices.', 'The proposal should show practical alignment through targeting, participation, safeguards, partnerships, and evidence choices.'],
                ['Gender equality', 'Women participation may be shaped by unpaid care, mobility, safety, information access, control over resources, and decision-making power.', 'The project should adapt timing, location, outreach, facilitation, selection, feedback, and risk mitigation.'],
                ['Disability inclusion', 'Persons with disabilities may be excluded if information, venues, communication, selection, facilitation, transport, or feedback channels are inaccessible.', 'The project should plan accessible information, direct outreach, reasonable accommodation, inclusive facilitation, and accessible feedback mechanisms.'],
              ].map(([area, connection, implication]) => (
                <article key={area}>
                  <h3>{area}</h3>
                  <p><strong>Relevant connection:</strong> {connection}</p>
                  <p><strong>Design implication:</strong> {implication}</p>
                </article>
              ))}
            </div>
            <p className="m3-microcopy">A real scan should be adapted to the actual project, sector, location, donor call, and verified policy references.</p>
          </div>

          <div className="m3-output-card">
            <p className="m3-card-kicker">How this can become proposal language</p>
            <h2>Draft alignment paragraph</h2>
            <p>
              This project addresses unequal access to livelihood opportunities among groups that may be
              missed by normal information-sharing, consultation, and selection processes. It will apply HRBA
              principles by strengthening inclusive outreach, transparent selection, accessible participation,
              feedback channels, and coordination with responsible local actors.
            </p>
            <p>
              The design will further integrate gender equality and disability inclusion by identifying barriers
              related to unpaid care, mobility, safety, information access, venue accessibility, communication,
              facilitation, and reasonable accommodation. Before finalizing the proposal, the team will verify
              relevant local plans, existing livelihood services, sector priorities, and donor requirements to
              ensure the project complements ongoing efforts and responds to real gaps.
            </p>
            <p className="m3-microcopy">This paragraph is not a universal template. It is a model showing how alignment can be grounded in analysis and design choices.</p>
          </div>

          <NoteBlock heading="Common design mistake">
            <p>Do not claim alignment that the project design cannot demonstrate.</p>
            <p>If the proposal says it supports inclusion, the design should show inclusive outreach, accessible participation, transparent selection, and feedback.</p>
            <p>If the proposal says it supports gender equality, the design should show how gendered barriers shape activities, timing, risk, and decision-making.</p>
            <p>If the proposal says it includes persons with disabilities, the design should show accessibility and reasonable accommodation.</p>
          </NoteBlock>

          <QuickCheck
            question="What is the safest and strongest way to use a policy and standards alignment scan?"
            selected={quickCheck}
            onSelect={(id) => {
              setQuickCheck(id);
              persist({ quickCheck: id });
            }}
            correctId="B"
            correctFeedback="Yes. A good alignment scan helps the team connect commitments to design decisions such as targeting, participation, accessibility, risk mitigation, coordination, and evidence."
            incorrectFeedback="The alignment scan should not be used for decoration, overclaiming, or replacing local validation. It should strengthen the design."
            options={[
              { id: 'A', label: 'A', text: 'Use it to add impressive language after the project is already designed.' },
              { id: 'B', label: 'B', text: 'Use it to identify relevant commitments and translate them into practical design choices.' },
              { id: 'C', label: 'C', text: 'Use it to avoid talking to local actors because the policy already explains everything.' },
              { id: 'D', label: 'D', text: 'Use it to make legal claims the CSO cannot verify.' },
            ]}
          />
          <div className="m3-cta-panel">
            <div>
              <h2>Next, reframe the problem.</h2>
              <p>The team now has a context snapshot and an alignment scan. Next, they will use these to move from a needs-based problem statement to a rights-aware problem framing.</p>
            </div>
            <PrimaryButton
              disabled={!canContinue}
              onClick={() =>
                completeScreen('M3-S1-03D', 'M3-S1-04', routes['M3-S1-04'], onChangeState, 'module3_screen33d', {
                  answers,
                  checkedParts,
                  quickCheck,
                })
              }
            >
              Continue to Problem Framing
            </PrimaryButton>
          </div>
        </section>
      )}
    </main>
  );
}

type StudioActivityItem = {
  id: string;
  prompt: string;
  options: Record<string, string>;
  correct: string;
  feedback: string;
};

type StudioScreenConfig = {
  screenId: string;
  context: string;
  title: string;
  heading: string;
  body: string[];
  quote?: string;
  startButton: string;
  revealTitle: string;
  revealIntro: string;
  revealItems: { id: string; title: string; body: string }[];
  activityTitle: string;
  activityPrompt: string;
  activityItems: StudioActivityItem[];
  outputTitle: string;
  outputBody: string[];
  designCards: { title: string; body: string }[];
  noteHeading: string;
  noteBody: string[];
  quickQuestion: string;
  quickOptions: CheckOption[];
  quickCorrect: string;
  quickCorrectFeedback: string;
  quickIncorrectFeedback: string;
  ctaHeading: string;
  ctaText: string;
  ctaButton: string;
  nextId: string;
};

const commonIncorrectFeedback =
  'Not quite. Look for the option that connects the analysis to practical design decisions, not only wording or activity delivery.';

const studioScreens: Record<string, StudioScreenConfig> = {
  'M3-S1-04': {
    screenId: 'M3-S1-04',
    context: 'Project Design Studio · Step 5',
    title: 'From Needs Statement to Rights-Aware Problem Framing',
    heading: 'The team now rewrites the problem statement.',
    body: [
      'The team has completed a context snapshot and a basic alignment scan. Now they return to the proposal’s problem statement.',
      'The first draft says: “Vulnerable community members lack livelihood skills and need training to improve their income opportunities.” At first, this sentence sounds clear. But the team now sees that it is too narrow. It describes a need. It does not yet explain the rights issue behind the need.',
    ],
    startButton: 'Compare the two framings',
    revealTitle: 'Needs-based statement vs rights-aware problem framing',
    revealIntro: 'Compare the two versions. Notice how the second version does not reject needs. It goes deeper.',
    revealItems: [
      {
        id: 'needs',
        title: 'Needs-based statement',
        body: 'Vulnerable community members lack livelihood skills and need training to improve their income opportunities. This may be true, but it starts too late and jumps quickly from need to activity.',
      },
      {
        id: 'rights-aware',
        title: 'Rights-aware problem framing',
        body: 'Some groups in the selected kebeles face unequal access to livelihood opportunities because information, selection processes, training schedules, accessibility arrangements, and local support systems do not reach everyone fairly.',
      },
      {
        id: 'specific',
        title: 'What changed: specificity and barriers',
        body: 'The stronger version identifies groups that may be missed, names unequal access, and points to barriers such as information, accessibility, participation, unclear responsibilities, elite capture, and accountability gaps.',
      },
      {
        id: 'ladder',
        title: 'Use the reframing ladder',
        body: 'Ask: What do we see? Who is affected differently? Why is this happening? What rights or principles are involved? Who has responsibility or influence? What must the project change?',
      },
    ],
    activityTitle: 'Which problem statement is strongest?',
    activityPrompt: 'Choose the statement that gives the project the strongest basis for HRBA design.',
    activityItems: [
      {
        id: 'framing',
        prompt: 'Which problem statement is strongest for HRBA project design?',
        options: {
          A: 'Vulnerable people need livelihood training.',
          B: 'The project will train 300 people and improve income.',
          C: 'Some groups face unequal access to livelihood opportunities because information, selection, accessibility, participation, and local support systems do not reach everyone fairly.',
          D: 'The project will implement inclusive and sustainable activities for all beneficiaries.',
        },
        correct: 'C',
        feedback: 'Yes. This statement identifies unequal access and barriers. It gives the project a stronger basis for rights-aware design.',
      },
    ],
    outputTitle: 'Why framing matters',
    outputBody: [
      'If the team keeps the needs statement, the project may target “vulnerable people” broadly, focus mainly on training, hold one consultation, report mainly to the donor, and treat risk as a final annex.',
      'If the team uses rights-aware framing, the project identifies groups facing specific barriers, designs participation and accountability, clarifies responsibilities, and lets risk shape selection, visibility, outreach, data, accessibility, and complaint options from the start.',
    ],
    designCards: [
      { title: 'Targeting', body: 'Identify groups facing specific barriers and explain why they are prioritized.' },
      { title: 'Activities', body: 'Design training plus information access, accessible participation, transparent selection, coordination, and feedback.' },
      { title: 'Participation', body: 'Let people influence criteria, timing, access arrangements, risk mitigation, and feedback channels.' },
      { title: 'Accountability', body: 'Explain how rights-holders receive information, question decisions, give feedback, and receive responses.' },
    ],
    noteHeading: 'Common design mistake',
    noteBody: [
      'Do not delete needs from the proposal. Needs matter. The mistake is stopping at needs.',
      'A rights-aware problem framing asks what sits behind the need: exclusion, barriers, unequal access, weak responsibility, limited participation, risk, and accountability gaps.',
    ],
    quickQuestion: 'Which sentence best describes rights-aware problem framing?',
    quickOptions: [
      { id: 'A', label: 'A', text: 'It makes every problem statement legal.' },
      { id: 'B', label: 'B', text: 'It deepens a need statement by showing affected groups, barriers, responsibilities, and design implications.' },
      { id: 'C', label: 'C', text: 'It removes all service delivery from the project.' },
    ],
    quickCorrect: 'B',
    quickCorrectFeedback: 'Yes. HRBA deepens the framing so design choices respond to the real issue.',
    quickIncorrectFeedback: commonIncorrectFeedback,
    ctaHeading: 'Now practice reframing.',
    ctaText: 'Next, you will repair weak problem statements and turn them into stronger rights-aware project design statements.',
    ctaButton: 'Practice Problem Reframing',
    nextId: 'M3-S1-05',
  },
  'M3-S1-05': {
    screenId: 'M3-S1-05',
    context: 'Project Design Studio · Practice 3',
    title: 'Practice: Reframe the Problem',
    heading: 'Now repair the problem statement.',
    body: [
      'The team has learned that a weak problem statement often jumps too quickly from need to activity. Now they will practice reframing.',
      'The goal is not to make the sentence longer. The goal is to make the problem clearer.',
    ],
    quote: 'A strong HRBA problem statement helps the team see who is affected, why they are excluded, who has responsibility, and what the project must change.',
    startButton: 'Start the repair practice',
    revealTitle: 'Repair three weak problem statements',
    revealIntro: 'Read each weak statement and notice the strongest rights-aware repair.',
    revealItems: [
      { id: 'livelihood', title: 'Livelihood project', body: 'Weak: “Vulnerable community members lack livelihood skills and need training to improve their income.” Stronger: some groups face unequal access because information, selection, timing, accessibility, and support systems do not reach everyone fairly.' },
      { id: 'water', title: 'Water access project', body: 'Weak: “The community lacks clean water and needs a new water point.” Stronger: women, girls, older people, and persons with disabilities face unequal and unsafe access because the current service is distant, unreliable, and lacks accountability.' },
      { id: 'education', title: 'Education project', body: 'Weak: “Girls are dropping out of school and need awareness raising.” Stronger: girls face barriers linked to safety, household responsibilities, distance, family support, school follow-up, and limited channels to raise concerns.' },
      { id: 'pattern', title: 'Four-part framing pattern', body: '[Specific groups] face [unequal access or exclusion] because [barriers and responsibility gaps]. The project should therefore address [design implications], not only [activity].' },
    ],
    activityTitle: 'Build a stronger problem statement',
    activityPrompt: 'Choose the strongest phrase for each part of the original livelihood statement.',
    activityItems: [
      { id: 'who', prompt: 'Who is affected?', options: { A: 'Vulnerable people', B: 'Community members', C: 'Youth, women with unpaid care responsibilities, persons with disabilities, and households affected by displacement may face different barriers' }, correct: 'C', feedback: 'Strong repair. This names groups and signals different barriers.' },
      { id: 'issue', prompt: 'What is the rights-related issue?', options: { A: 'They need training.', B: 'They face unequal access to livelihood opportunities.', C: 'They are poor.' }, correct: 'B', feedback: 'Yes. This moves from activity to unequal access.' },
      { id: 'barriers', prompt: 'What barriers are visible?', options: { A: 'because they do not have enough motivation', B: 'because information, selection processes, training schedules, accessibility arrangements, and local support systems may not reach everyone fairly', C: 'because the project has not yet started' }, correct: 'B', feedback: 'Yes. This names barriers the design can address.' },
      { id: 'design', prompt: 'What must the design address?', options: { A: 'Provide training quickly.', B: 'Design inclusive outreach, transparent selection, accessible participation, local actor coordination, feedback, and risk mitigation.', C: 'Increase the number of activities.' }, correct: 'B', feedback: 'Yes. This gives the project practical design direction.' },
    ],
    outputTitle: 'Your repaired problem statement',
    outputBody: [
      'Youth, women with unpaid care responsibilities, persons with disabilities, and households affected by displacement may face different barriers and unequal access to livelihood opportunities because information, selection processes, training schedules, accessibility arrangements, and local support systems may not reach everyone fairly.',
      'The project should therefore design inclusive outreach, transparent selection, accessible participation, local actor coordination, feedback, and risk mitigation, not only deliver livelihood training.',
    ],
    designCards: [
      { title: 'Who is affected differently?', body: 'Name specific groups without reducing them to labels.' },
      { title: 'What issue is happening?', body: 'Name unequal access, exclusion, or another rights-related issue.' },
      { title: 'What sits behind it?', body: 'Name barriers, responsibilities, or power issues.' },
      { title: 'What must change?', body: 'Point the design toward access, participation, accountability, safety, and realistic support.' },
    ],
    noteHeading: 'Common design mistake',
    noteBody: ['Do not make the problem statement sound rights-based by adding words like “empowerment,” “inclusion,” or “human rights” without explaining the actual barriers.', 'Strong HRBA framing is not about impressive language. It is about clearer diagnosis.'],
    quickQuestion: 'Which sentence best describes what you practiced on this screen?',
    quickOptions: [
      { id: 'A', label: 'A', text: 'Turning every needs statement into legal language.' },
      { id: 'B', label: 'B', text: 'Replacing all service activities with advocacy activities.' },
      { id: 'C', label: 'C', text: 'Reframing weak problem statements so they show affected groups, barriers, responsibilities, and design implications.' },
    ],
    quickCorrect: 'C',
    quickCorrectFeedback: 'Yes. Rights-aware problem framing helps the team design better, not just write more.',
    quickIncorrectFeedback: commonIncorrectFeedback,
    ctaHeading: 'Next, sharpen the rights-holder lens.',
    ctaText: 'You have practiced reframing the problem. Next, you will identify who is affected, who may be missed, and how vague target groups can weaken project design.',
    ctaButton: 'Continue to Rights-Holder Design',
    nextId: 'M3-S1-06',
  },
  'M3-S1-06': {
    screenId: 'M3-S1-06',
    context: 'Project Design Studio · Step 6',
    title: 'Apply the Rights-Holder Lens to Project Design',
    heading: '“Vulnerable people” is not a design strategy.',
    body: ['The team has repaired the problem statement. Now they must sharpen the target group.', 'The original proposal says: “The project will train 300 vulnerable community members.” That sentence may sound inclusive. But it is too broad to guide design.'],
    quote: 'In HRBA project design, rights-holders are not a vague category. They are people with different experiences, barriers, capacities, risks, and claims.',
    startButton: 'Open the rights-holder lens',
    revealTitle: 'Look at the project area through a rights-holder lens',
    revealIntro: 'Open each segment to see who may be missed by normal outreach.',
    revealItems: [
      { id: 'youth', title: 'Youth receiving information late', body: 'Youth may not hear about opportunities in time if outreach depends on leaders or informal channels. The project may need multiple information channels, clear timelines, youth-friendly communication, and transparent criteria.' },
      { id: 'women', title: 'Women with unpaid care responsibilities', body: 'Women may be invited but unable to attend if timing, location, safety, transport, or household responsibilities are not considered.' },
      { id: 'disability', title: 'Persons with disabilities', body: 'Invitation is not the same as access. The design may need accessible communication, venue checks, transport considerations, inclusive facilitation, and accessible feedback.' },
      { id: 'displacement', title: 'Households affected by displacement', body: 'Displaced or shock-affected households may have weaker networks, documents, income, transport, or information access.' },
      { id: 'hidden', title: 'Less visible households', body: 'People who are isolated, stigmatized, newly arrived, elderly, caring for others, or not connected to leadership may not appear in ordinary lists.' },
      { id: 'leaders', title: 'Community representatives and leaders', body: 'Representatives can support inclusion, but if they control information or selection alone, they can also narrow access.' },
    ],
    activityTitle: 'Match the group to a design response.',
    activityPrompt: 'Choose the response that best fits each rights-holder segment.',
    activityItems: [
      { id: 'youth-match', prompt: 'Youth who receive information late', options: { A: 'Add more technical training content.', B: 'Use multiple information channels, clear deadlines, and youth-friendly outreach.', C: 'Ask only community leaders to select youth participants.' }, correct: 'B', feedback: 'Correct. The barrier is not only skill. It is also access to timely and fair information.' },
      { id: 'women-match', prompt: 'Women with unpaid care responsibilities', options: { A: 'Schedule all trainings during the busiest household work hours.', B: 'Invite women but keep the same design.', C: 'Consult women on timing, location, safety, and care-sensitive participation options.' }, correct: 'C', feedback: 'Correct. Participation becomes meaningful when the design responds to time, care, mobility, and safety constraints.' },
      { id: 'disability-match', prompt: 'Persons with disabilities', options: { A: 'Invite them to attend if they can reach the venue.', B: 'Check accessibility of information, venue, communication, facilitation, transport, and feedback channels.', C: 'Assume inclusion will happen if the project is open to everyone.' }, correct: 'B', feedback: 'Correct. Inclusion requires planned accessibility, not passive openness.' },
      { id: 'hidden-match', prompt: 'Less visible households', options: { A: 'Use only the list provided by visible leaders.', B: 'Avoid selection criteria so the project can move quickly.', C: 'Use transparent criteria, multiple outreach channels, verification checks, and safe feedback options.' }, correct: 'C', feedback: 'Correct. The design must reduce gatekeeper control and make selection more transparent and accountable.' },
    ],
    outputTitle: 'From broad target group to rights-holder segments',
    outputBody: ['Segmentation does not mean dividing people mechanically. It means noticing who may need different design responses: youth with weak information access, women with unpaid care responsibilities, persons with disabilities, displaced households, and less visible households.', 'Each segment should connect barriers to design responses such as outreach, timing, accessible formats, transparent criteria, verification checks, and feedback options.'],
    designCards: [
      { title: 'Targeting', body: 'Identify who faces which barriers and why intentional inclusion is needed.' },
      { title: 'Access', body: 'Design outreach, information, venue choice, timing, communication, and selection for people usually missed.' },
      { title: 'Participation', body: 'Let rights-holders influence criteria, activities, access arrangements, feedback channels, and risk mitigation.' },
      { title: 'Accountability', body: 'Use transparent criteria, safe feedback, complaint options, and checks against exclusion or elite capture.' },
    ],
    noteHeading: 'Common design mistake',
    noteBody: ['Do not assume that a broad target group is more inclusive.', 'A broad phrase like “the community” or “vulnerable people” may hide the very people the project needs to reach. Specific rights-holder analysis makes inclusion more practical.'],
    quickQuestion: 'Why is “300 vulnerable community members” weak as a project design phrase?',
    quickOptions: [
      { id: 'A', label: 'A', text: 'Because HRBA projects should never include numbers.' },
      { id: 'B', label: 'B', text: 'Because the phrase does not explain who is affected differently, who may be missed, or what barriers the design must address.' },
      { id: 'C', label: 'C', text: 'Because livelihood projects should only target duty-bearers.' },
    ],
    quickCorrect: 'B',
    quickCorrectFeedback: 'Yes. Numbers can be useful, but HRBA design needs more than a target count.',
    quickIncorrectFeedback: commonIncorrectFeedback,
    ctaHeading: 'Next, look more closely at gender.',
    ctaText: 'You have sharpened the rights-holder lens. Next, you will examine how gender can shape access, participation, safety, decision-making, and project benefit.',
    ctaButton: 'Continue to Gender and HRBA Design',
    nextId: 'M3-S1-06A',
  },
};

type CompactStudioSpec = {
  screenId: string;
  context: string;
  title: string;
  heading: string;
  body: string;
  quote?: string;
  startButton: string;
  revealTitle: string;
  revealItems: string[];
  activityTitle: string;
  correctPrompt: string;
  correctAnswer: string;
  outputTitle: string;
  outputBody: string;
  noteHeading: string;
  noteBody: string;
  ctaHeading: string;
  ctaText: string;
  ctaButton: string;
  nextId: string;
};

function makeCompactStudioScreen(spec: CompactStudioSpec): StudioScreenConfig {
  return {
    screenId: spec.screenId,
    context: spec.context,
    title: spec.title,
    heading: spec.heading,
    body: [spec.body],
    quote: spec.quote,
    startButton: spec.startButton,
    revealTitle: spec.revealTitle,
    revealIntro: 'Open each card. Each point should change a practical project design decision.',
    revealItems: spec.revealItems.map((body, index) => ({
      id: `${spec.screenId}-reveal-${index + 1}`,
      title: body.split(':')[0],
      body,
    })),
    activityTitle: spec.activityTitle,
    activityPrompt: 'Choose the strongest rights-aware design judgment.',
    activityItems: [
      {
        id: `${spec.screenId}-activity`,
        prompt: spec.correctPrompt,
        options: {
          A: 'Keep the original activity plan and add stronger wording in the proposal.',
          B: spec.correctAnswer,
          C: 'Wait until implementation starts and solve barriers as they appear.',
        },
        correct: 'B',
        feedback: 'Correct. HRBA project design uses analysis to shape concrete choices before implementation begins.',
      },
    ],
    outputTitle: spec.outputTitle,
    outputBody: [spec.outputBody],
    designCards: [
      { title: 'What changes in the proposal', body: 'The proposal becomes clearer about affected groups, barriers, responsibilities, risks, and expected change.' },
      { title: 'What changes in activities', body: 'Activities are chosen because they respond to analysis, not because they are familiar or easy to list.' },
      { title: 'What changes in participation', body: 'Rights-holders influence criteria, timing, access, feedback, and risk mitigation before activities are finalized.' },
      { title: 'What changes in evidence', body: 'The team chooses minimum useful and safe evidence that helps it learn and adapt.' },
    ],
    noteHeading: spec.noteHeading,
    noteBody: [spec.noteBody],
    quickQuestion: `What is the main design lesson from “${spec.title}”?`,
    quickOptions: [
      { id: 'A', label: 'A', text: 'The proposal becomes stronger mainly by adding more activities.' },
      { id: 'B', label: 'B', text: 'The design becomes stronger when analysis changes practical decisions.' },
      { id: 'C', label: 'C', text: 'The design can wait until implementation to address inclusion and risk.' },
    ],
    quickCorrect: 'B',
    quickCorrectFeedback: 'Yes. The point is to let analysis shape design choices before implementation.',
    quickIncorrectFeedback: commonIncorrectFeedback,
    ctaHeading: spec.ctaHeading,
    ctaText: spec.ctaText,
    ctaButton: spec.ctaButton,
    nextId: spec.nextId,
  };
}

[
  {
    screenId: 'M3-S1-06A',
    context: 'Project Design Studio · Gender Lens',
    title: 'Gender and HRBA Design Lens',
    heading: 'Gender is not only about how many women attend.',
    body: 'The team returns to the context note that training schedules often clash with unpaid care responsibilities. Timing may be connected to care work, household decision-making, mobility, safety, control over resources, and whether women can influence project decisions.',
    quote: 'In HRBA project design, gender analysis asks whether people can access, influence, benefit from, and safely participate in the project - not only whether they are counted.',
    startButton: 'Open the gender design lens',
    revealTitle: 'The Gender and HRBA Design Lens',
    revealItems: [
      'Time and unpaid care: ask who realistically has time to participate and adapt session length, timing, and format.',
      'Safety and mobility: choose safe venues, avoid late sessions, and monitor backlash or travel concerns.',
      'Information access: use multiple communication channels and make criteria direct, clear, and accessible.',
      'Decision-making power: create ways for women and less powerful groups to influence criteria, timing, venue, and feedback.',
      'Access and control over resources: check whether participants can use and control income, tools, time, and decisions safely.',
      'Voice, feedback, and accountability: provide safe, trusted, and accessible ways to ask questions or complain.',
    ],
    activityTitle: 'Match gender barriers to design responses',
    correctPrompt: 'Which choice best shows a gender and HRBA lens?',
    correctAnswer: 'Analyze how unpaid care, safety, mobility, information access, decision-making, and control over benefits affect participation and adapt the project accordingly.',
    outputTitle: 'Gender design implications for the fictional proposal',
    outputBody: 'Gender analysis should change problem framing, participation design, activity delivery, risk planning, and monitoring. The team should learn whether women and other groups can access, influence, benefit, and safely raise concerns.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not treat gender as a participant quota only. A target such as 50% women participants may be useful, but it is not enough if barriers remain.',
    ctaHeading: 'Now practice identifying gendered barriers.',
    ctaText: 'Next, you will apply this lens to a short design activity and connect gendered barriers to practical project decisions.',
    ctaButton: 'Practice Gendered Barrier Analysis',
    nextId: 'M3-S1-06B',
  },
  {
    screenId: 'M3-S1-06B',
    context: 'Project Design Studio · Gender Practice',
    title: 'Practice: Identify Gendered Barriers and Design Implications',
    heading: 'Find the gendered barriers before finalizing the activity plan.',
    body: 'The team reviews fictional consultation notes about late information, unpaid care, distance, weak voice in meetings, control over benefits, transparent selection, male youth exclusion, and unclear official roles.',
    quote: 'Which barriers could affect participation, influence, safety, and benefit - and what should change in the project design?',
    startButton: 'Start the practice',
    revealTitle: 'Fictional consultation notes become barrier cards',
    revealItems: [
      'Information access: some women hear about opportunities after participant lists are already prepared.',
      'Time and unpaid care: full-day training may clash with childcare, cooking, water collection, and care for older family members.',
      'Safety and mobility: the hall is far from some villages and returning home late may not feel safe.',
      'Voice and decision-making: young women may attend mixed meetings but rarely speak or influence decisions.',
      'Access and control over benefits: household members may control income or equipment after training.',
      'Transparency and accountability: representatives ask whether criteria and complaints will be safe and public.',
    ],
    activityTitle: 'Connect the barrier to a design decision',
    correctPrompt: 'Which option best shows that gender analysis has influenced project design?',
    correctAnswer: 'Adapt information-sharing, timing, safety measures, facilitation, selection, feedback, and benefit analysis based on identified gendered barriers.',
    outputTitle: 'Gender Design Note - Livelihood Skills Project',
    outputBody: 'The project should not rely only on a target for women participants. It should address late information, unpaid care, distance and safe return, limited voice, control over income or equipment, and concerns about transparent selection and safe complaints.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not treat gender analysis as a separate paragraph that has no effect on the project. If it is real, it should influence outreach, timing, location, facilitation, selection, risk mitigation, feedback, and evidence.',
    ctaHeading: 'Next, strengthen disability-inclusive design.',
    ctaText: 'You have practiced identifying gendered barriers and design implications. Next, you will examine how disability inclusion should shape project design from the beginning.',
    ctaButton: 'Continue to Disability-Inclusive Project Design',
    nextId: 'M3-S1-06C',
  },
  {
    screenId: 'M3-S1-06C',
    context: 'Project Design Studio · Disability Inclusion Lens',
    title: 'Disability-Inclusive Project Design',
    heading: 'Invitation is not the same as access.',
    body: 'The team has noticed that persons with disabilities are rarely invited to project meetings. Inclusion must shape outreach, information, venue choice, communication, participation, reasonable accommodation, feedback, and safeguards.',
    quote: 'But will they receive the information, reach the venue, understand the process, influence decisions, participate safely, and give feedback?',
    startButton: 'Open the disability inclusion check',
    revealTitle: 'Where could persons with disabilities be excluded?',
    revealItems: [
      'Information barrier: some people may never hear about the project or receive information in a format they can use.',
      'Invitation barrier: open to all may still miss people who are isolated or used to exclusion.',
      'Venue barrier: steps, narrow entrances, distant venues, crowded rooms, poor seating, or inaccessible toilets can exclude people.',
      'Communication barrier: fast speech, small text, complex instructions, no interpretation, or inaccessible materials can reduce participation.',
      'Participation barrier: people may be present but not invited to shape criteria, timing, risk mitigation, or feedback channels.',
      'Feedback barrier: a single feedback box, phone number, written form, or public meeting may not work for everyone.',
    ],
    activityTitle: 'Fix weak disability-inclusive design choices',
    correctPrompt: 'Which design choice best reflects disability-inclusive HRBA project design?',
    correctAnswer: 'Identify accessibility barriers and adapt outreach, information, venues, communication, participation, reasonable accommodation, and feedback channels.',
    outputTitle: 'Disability Inclusion Design Note - Livelihood Skills Project',
    outputBody: 'The project will not assume that persons with disabilities are included simply because activities are open. It will consult persons with disabilities and representative organizations, share accessible information, review venues and facilitation methods, and monitor meaningful participation and safe feedback.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not write “persons with disabilities will be included” unless the design explains how. Inclusion should be visible in outreach, information, venues, communication, accommodation, feedback, budget, timeline, and monitoring.',
    ctaHeading: 'Next, clarify responsibilities and influence.',
    ctaText: 'You have strengthened the rights-holder, gender, and disability lenses. Next, you will map duty-bearers, influencing actors, and the CSO role.',
    ctaButton: 'Continue to Responsibilities and Influence',
    nextId: 'M3-S1-07',
  },
  {
    screenId: 'M3-S1-07',
    context: 'Project Design Studio · Step 7',
    title: 'Design Around Responsibilities and Influence',
    heading: 'The CSO cannot carry every responsibility alone.',
    body: 'The team needs to clarify who has responsibility, who has influence, and what the CSO proper role is. The phrase “work with local officials and community leaders” is too vague to guide design.',
    quote: 'Who has responsibility, who has influence, and what is the CSO proper role?',
    startButton: 'Open the actor map',
    revealTitle: 'Map the actors around the rights issue',
    revealItems: [
      'Rights-holders: people affected by unequal access, including youth, women with unpaid care responsibilities, persons with disabilities, displaced households, and less visible households.',
      'Formal duty-bearers: woreda offices, kebele structures, sector offices, or public service providers with relevant responsibilities.',
      'Community leaders: influential actors who can support inclusion but may also narrow participation if they control selection alone.',
      'Women groups, disability representatives, and youth networks: actors who can reveal barriers and help shape design.',
      'Service providers and private actors: training providers, cooperatives, employers, suppliers, or market actors connected to livelihood opportunities.',
      'The CSO team: facilitator, supporter, coordinator, capacity builder, monitor, advocate, connector, and accountability holder in how it works.',
    ],
    activityTitle: 'Classify actors and match roles to design questions',
    correctPrompt: 'Why is actor analysis important in HRBA project design?',
    correctAnswer: 'It helps clarify rights-holders, duty-bearers, influencing actors, capacity gaps, power relations, and the CSO proper role.',
    outputTitle: 'How actor analysis changes project design',
    outputBody: 'Partnerships become purposeful, capacity gaps become visible, responsibility becomes clearer, and the project does not depend only on the CSO.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not write “stakeholders will be engaged” without explaining who they are and why they matter.',
    ctaHeading: 'Now build the actor map.',
    ctaText: 'Next, you will practice building a simple actor and capacity-gap map for the fictional project.',
    ctaButton: 'Build the Design Actor Map',
    nextId: 'M3-S1-08',
  },
  {
    screenId: 'M3-S1-08',
    context: 'Project Design Studio · Practice 4',
    title: 'Practice: Build a Design Actor Map',
    heading: 'Now build the actor map.',
    body: 'The team has learned that stakeholders are not all the same. Some people are affected, some have responsibility, some control access or information, and some can support services.',
    quote: 'Who is affected, who has responsibility, who has influence, and what capacity gaps should the project respond to?',
    startButton: 'Start the actor map',
    revealTitle: 'Actor classification and capacity-gap mapping',
    revealItems: [
      'Rights-holders: youth, women with unpaid care responsibilities, persons with disabilities, and displaced or shock-affected households.',
      'Formal duty-bearers: woreda sector office and kebele administration or local public structure.',
      'Influencing actors: community leaders, women groups, youth networks, and disability representatives.',
      'Supporting or service actors: training providers, cooperatives, market actors, other CSOs, or existing livelihood programs.',
      'CSO role: facilitate, support, coordinate, build capacity, monitor, learn, and remain accountable.',
    ],
    activityTitle: 'Classify actors and identify capacity gaps',
    correctPrompt: 'Which actor map is strongest for HRBA project design?',
    correctAnswer: 'A map showing rights-holders, duty-bearers, influencing actors, supporting actors, CSO roles, capacity gaps, power relationships, and design implications.',
    outputTitle: 'Model actor and capacity-gap map',
    outputBody: 'The model map connects each actor group to its role, possible capacity gap or risk, and design implication. It highlights transparent selection, inclusive participation, duty-bearer engagement, accessible services, coordination, and CSO accountability.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not create an actor map that is only a list of names. A useful HRBA actor map shows who is affected, who has responsibility, who has influence, who controls access, who may be excluded, and what the project must do differently.',
    ctaHeading: 'Next, look beneath the visible problem.',
    ctaText: 'You have built an actor and capacity-gap map. Next, you will distinguish symptoms, root causes, capacity gaps, and systemic barriers.',
    ctaButton: 'Continue to Symptoms, Root Causes, and Capacity Gaps',
    nextId: 'M3-S1-09',
  },
].forEach((spec) => {
  studioScreens[spec.screenId] = makeCompactStudioScreen(spec);
});

[
  {
    screenId: 'M3-S1-16',
    context: 'Project Design Studio · Practice 8',
    title: 'Practice: Build a Coherent Activity Package',
    heading: 'Build the activity package from the analysis.',
    body: 'The team now connects each barrier to the activity response that fits it, then checks whether the package has a logical order.',
    startButton: 'Start building the activity package',
    revealTitle: 'Analysis reminder',
    revealItems: [
      'Information barriers require multiple channels, early criteria, direct outreach, and clear deadlines.',
      'Participation barriers require safe spaces, accessible timing, facilitation, and visible influence.',
      'Gender and disability barriers require adapted schedules, venues, communication, reasonable accommodation, and risk checks.',
      'Accountability barriers require feedback channels, complaint options, response timelines, and transparent selection.',
      'Duty-bearer and service gaps require coordination, capacity support, and clear roles.',
    ],
    activityTitle: 'Build the activity sequence.',
    correctPrompt: 'Which activity package sequence is strongest?',
    correctAnswer: 'Start with validation and outreach, then transparent selection, adapted participation and training, actor coordination, feedback, monitoring, and learning.',
    outputTitle: 'Model HRBA activity package',
    outputBody: 'A coherent package includes context validation, inclusive outreach, transparent selection, adapted training and coaching, local actor engagement, accessible feedback, risk monitoring, and learning for adaptation.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not let the donor template or timeline decide the activity logic. The analysis should decide the package and order.',
    ctaHeading: 'Next, connect the package to intervention logic.',
    ctaText: 'The activity package is stronger. Now the team will connect it to objectives, outputs, assumptions, risks, and evidence.',
    ctaButton: 'Continue to Intervention Logic',
    nextId: 'M3-S1-16A',
  },
  {
    screenId: 'M3-S1-16A',
    context: 'Project Design Studio · Intervention Logic',
    title: 'From Analysis to Intervention Logic',
    heading: 'Now connect the pieces.',
    body: 'The team has many design pieces: context, rights-holders, barriers, actors, objectives, activities, risks, and evidence. Intervention logic helps connect them into a coherent design.',
    startButton: 'Open the logic bridge',
    revealTitle: 'The HRBA intervention logic bridge',
    revealItems: [
      'Analysis: what is happening, who is affected, and why barriers exist.',
      'Objective: the rights-aware change the project will support.',
      'Outputs: practical changes in access, participation, capacity, accountability, and support.',
      'Activities: actions that respond directly to barriers and capacity gaps.',
      'Assumptions and risks: conditions that may affect whether the logic works safely.',
      'Evidence: minimum useful and safe information to learn whether change is happening.',
    ],
    activityTitle: 'Compare the intervention logic.',
    correctPrompt: 'What should coherent intervention logic connect?',
    correctAnswer: 'Analysis, objective, outputs, activities, assumptions, risks, mitigation, and safe evidence choices.',
    outputTitle: 'A simple intervention logic for the fictional project',
    outputBody: 'The logic connects unequal access and exclusion barriers to an objective on equitable livelihood opportunities, outputs on transparent selection and accessible participation, activities on outreach/training/coordination/feedback, risk mitigation, and evidence for safe learning.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not create a logframe after the project is already designed. The logic should be built from the analysis.',
    ctaHeading: 'Now build the logic.',
    ctaText: 'Next, you will assemble a simple HRBA intervention logic from the fictional case.',
    ctaButton: 'Build the HRBA Intervention Logic',
    nextId: 'M3-S1-16B',
  },
  {
    screenId: 'M3-S1-16B',
    context: 'Project Design Studio · Practice 9',
    title: 'Practice: Build a Simple HRBA Intervention Logic',
    heading: 'Now build the intervention logic.',
    body: 'The team practices placing cards in the correct logic parts, connecting barriers to activities, and connecting risks to mitigation and evidence.',
    startButton: 'Start the logic builder',
    revealTitle: 'How this practice works',
    revealItems: [
      'Place each card in the correct part of the logic: analysis, objective, output, activity, risk, mitigation, or evidence.',
      'Connect each barrier to an activity that can realistically address it.',
      'Connect each risk to a mitigation and safe evidence choice.',
      'Check whether the logic fits together without overpromising.',
    ],
    activityTitle: 'Check the logic fit.',
    correctPrompt: 'Which logic fit is strongest?',
    correctAnswer: 'The one where every activity responds to an analyzed barrier and every risk has mitigation and evidence for adaptation.',
    outputTitle: 'Model HRBA intervention logic',
    outputBody: 'The model logic links affected groups and barriers to objective, outputs, activities, assumptions, risks, mitigation, and evidence, showing how the project will learn and adapt safely.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not build intervention logic as a paperwork exercise. It should help the team see whether the design makes sense.',
    ctaHeading: 'Next, test the design for do-no-harm risks.',
    ctaText: 'The intervention logic is now visible. Next, the team will test what could go wrong.',
    ctaButton: 'Continue to the HRBA Risk Lab',
    nextId: 'M3-S1-17',
  },
  {
    screenId: 'M3-S1-17',
    context: 'Project Design Studio · Risk Lab',
    title: 'HRBA Do-No-Harm and Design Risk Lab',
    heading: 'Before the proposal is finalized, test what could go wrong.',
    body: 'The team now examines risks linked to harm, backlash, unsafe visibility, exclusion, data, unrealistic promises, duty-bearer confusion, and civic-space sensitivity.',
    startButton: 'Open the Risk Lab',
    revealTitle: 'Eight design risks to check before implementation',
    revealItems: [
      'Exclusion risk: less visible groups may not hear about or access the project.',
      'Gatekeeper risk: participant selection may be controlled by powerful actors.',
      'Backlash risk: participation or benefits may create household or community tension.',
      'Accessibility risk: venues, communication, or feedback may exclude persons with disabilities.',
      'Data risk: collecting unnecessary or sensitive information can create harm.',
      'Unrealistic promise risk: the project may raise expectations it cannot meet.',
      'Duty-bearer confusion: the CSO may replace responsibilities instead of clarifying them.',
      'Resource distribution risk: benefits may be captured or perceived as unfair.',
    ],
    activityTitle: 'Match each risk to a design mitigation.',
    correctPrompt: 'Which risk response is strongest?',
    correctAnswer: 'Identify who could be harmed or excluded, reduce the risk in the design, and monitor whether mitigation is working.',
    outputTitle: 'Model do-no-harm risk register',
    outputBody: 'The model register links each risk to who may be affected, mitigation actions, responsible actors, and evidence that tells the team when to adapt.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not leave risk as a final annex. Risk should shape targeting, outreach, data, visibility, accessibility, feedback, and resource distribution from the start.',
    ctaHeading: 'Now build the risk and mitigation plan.',
    ctaText: 'Next, you will turn risk thinking into a practical plan.',
    ctaButton: 'Build the Risk and Mitigation Plan',
    nextId: 'M3-S1-18',
  },
  {
    screenId: 'M3-S1-18',
    context: 'Project Design Studio · Practice 10',
    title: 'Practice: Build a Risk and Mitigation Plan',
    heading: 'Now turn risk thinking into a practical plan.',
    body: 'The team reviews fictional project risk notes and chooses who may be affected, what mitigation fits, and what evidence will tell the team to adapt.',
    startButton: 'Start the risk plan',
    revealTitle: 'Fictional project risk notes',
    revealItems: [
      'Better-connected households may capture benefits if selection is informal.',
      'Less visible groups may be excluded if information moves through one channel.',
      'Women may face timing, safety, care, or backlash risks.',
      'Persons with disabilities may be excluded by inaccessible communication, venues, or feedback.',
      'Sensitive data or public complaint channels may create safety or trust risks.',
    ],
    activityTitle: 'Build the plan.',
    correctPrompt: 'What makes a risk and mitigation plan practical?',
    correctAnswer: 'It names who may be affected, what could happen, what mitigation is built into design, who monitors it, and what evidence triggers adaptation.',
    outputTitle: 'Model risk and mitigation plan',
    outputBody: 'The model plan connects selection, outreach, gender, disability, data, feedback, and resource distribution risks to concrete mitigation and adaptation evidence.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not write “low risk” because the project has good intentions. Good intentions do not prevent exclusion or harm.',
    ctaHeading: 'Next, examine resource distribution risks.',
    ctaText: 'The risk plan is stronger. Next, the module narrows in on resource distribution and anti-corruption concerns.',
    ctaButton: 'Continue to Resource Distribution Risks',
    nextId: 'M3-S1-19',
  },
  {
    screenId: 'M3-S1-19',
    context: 'Project Design Studio · Evidence Choices',
    title: 'Evidence Choices During Design',
    heading: 'Choose evidence that helps the design - without collecting too much.',
    body: 'The team needs enough evidence to design safely and learn responsibly, but not so much that data collection becomes extractive, unsafe, or unnecessary.',
    startButton: 'Open the evidence choice check',
    revealTitle: 'Three rules for evidence choices',
    revealItems: [
      'Useful: collect evidence that helps the team make a design decision.',
      'Safe: avoid collecting sensitive or unnecessary data that could expose people to harm.',
      'Proportionate: collect enough to understand barriers, inclusion, participation, risk, and accountability without turning design into a heavy research exercise.',
      'Minimum evidence should help the team know who is reached, who is missed, what barriers remain, whether feedback is answered, and whether anyone feels unsafe or excluded.',
    ],
    activityTitle: 'Choose the safer evidence decision.',
    correctPrompt: 'What evidence choice is strongest during design?',
    correctAnswer: 'Collect minimum useful and safe evidence about barriers, participation, inclusion, risk, feedback, and adaptation needs.',
    outputTitle: 'Model evidence plan for the fictional proposal',
    outputBody: 'The model plan uses disaggregated participation data where safe, barrier tracking, feedback summaries, accessibility checks, risk signals, and learning moments to adapt the design.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not collect data simply because it might be interesting. Evidence choices should be useful, safe, and connected to decisions.',
    ctaHeading: 'Next, repair the full project design.',
    ctaText: 'The design tools are now in place. Next, the learner applies them in the module challenge.',
    ctaButton: 'Start the Module Design Challenge',
    nextId: 'M3-S1-20',
  },
  {
    screenId: 'M3-S1-20',
    context: 'Project Design Studio · Module Challenge',
    title: 'Module Challenge: Repair a Weak HRBA Project Design',
    heading: 'Now repair the full project design.',
    body: 'This challenge screen is inferred from the approved Module 3 screen list because a separate uploaded specification for Screen 3.20 was not provided. It lets learners apply the full design studio sequence to repair a weak project concept.',
    startButton: 'Start the repair challenge',
    revealTitle: 'Repair sequence',
    revealItems: [
      'Clarify the context and rights-aware problem framing.',
      'Identify specific rights-holders, gender barriers, and disability access barriers.',
      'Map actors, responsibilities, influence, and capacity gaps.',
      'Connect root causes to objective, activities, intervention logic, risk, and evidence.',
    ],
    activityTitle: 'Choose the strongest repair package.',
    correctPrompt: 'Which repair package best reflects Module 3?',
    correctAnswer: 'A package that uses context, policy alignment, rights-holder analysis, actor mapping, gender, disability, participation, logic, risk, and evidence together.',
    outputTitle: 'Challenge repair summary',
    outputBody: 'The repaired design is stronger because the project no longer jumps from broad need to training. It shows who is affected, why barriers exist, who must respond, what activities fit, what risks must be managed, and what evidence supports adaptation.',
    noteHeading: 'Assumption',
    noteBody: 'This screen uses the Module 3 screen list summary because no separate detailed Screen 3.20 file was uploaded.',
    ctaHeading: 'Next, synthesize the design journey.',
    ctaText: 'You have applied the design tools. Next, review the full journey from project idea to rights-based design.',
    ctaButton: 'Continue to Module 3 Synthesis',
    nextId: 'M3-S1-21',
  },
  {
    screenId: 'M3-S1-21',
    context: 'Project Design Studio · Synthesis',
    title: 'Module 3 Synthesis: From Project Idea to Rights-Based Design',
    heading: 'You have moved from project idea to rights-based design.',
    body: 'The learner reviews the design journey from a promising but incomplete proposal to a stronger HRBA project design.',
    startButton: 'Review the design journey',
    revealTitle: 'The Module 3 design journey',
    revealItems: [
      'Context snapshot: what is happening, who is affected, what barriers appear, and what is still unknown.',
      'Policy and standards scan: how rights, SDGs/LNOB, local priorities, donor priorities, gender, and disability commitments shape design.',
      'Rights-aware problem framing: move from need and activity to unequal access, barriers, responsibility, risk, and accountability.',
      'Rights-holder, gender, disability, actor, root-cause, participation, objective, activity, logic, risk, and evidence tools.',
      'Design outputs: context snapshot, alignment scan, actor map, root-cause tree, activity package, intervention logic, risk plan, and evidence plan.',
    ],
    activityTitle: 'What changed in the project design?',
    correctPrompt: 'What is the clearest Module 3 synthesis message?',
    correctAnswer: 'A stronger HRBA design starts with analysis and turns that analysis into practical decisions about people, barriers, actors, activities, risks, and evidence.',
    outputTitle: 'Five messages to carry forward',
    outputBody: 'Start with people and barriers. Do not hide people behind broad labels. Make participation meaningful. Clarify responsibility and influence. Let risk, evidence, and accountability shape design from the beginning.',
    noteHeading: 'Carry-forward note',
    noteBody: 'The value of the design tools is not in naming them. It is in using them to make better project choices.',
    ctaHeading: 'Now create your project design improvement map.',
    ctaText: 'Next, create or review a practical project design improvement map you can apply safely in CSO work.',
    ctaButton: 'Continue to Portfolio Checkpoint',
    nextId: 'M3-S1-22',
  },
  {
    screenId: 'M3-S1-22',
    context: 'Project Design Studio · Portfolio Checkpoint',
    title: 'Portfolio Checkpoint: My HRBA Project Design Improvement Map',
    heading: 'Turn the module into a practical improvement map.',
    body: 'This checkpoint is inferred from the approved Module 3 screen list because a separate uploaded specification for Screen 3.22 was not provided. It helps learners review how they could improve a project design safely without entering real sensitive data.',
    startButton: 'Open the improvement map',
    revealTitle: 'Improvement map prompts',
    revealItems: [
      'Which design question should my CSO ask earlier?',
      'Which broad target group should be made more specific?',
      'Which participation or feedback process needs strengthening?',
      'Which actor responsibilities, risks, or evidence choices should be clarified?',
    ],
    activityTitle: 'Choose a safe improvement focus.',
    correctPrompt: 'Which portfolio focus is safest for this course screen?',
    correctAnswer: 'Choose a non-sensitive design habit to strengthen, such as earlier rights-holder analysis, clearer participation, better accessibility checks, or safer feedback.',
    outputTitle: 'My HRBA project design improvement map',
    outputBody: 'A safe improvement map can focus on habits rather than real case details: ask better context questions, specify rights-holders, design participation, clarify actors, test risk, and choose safe evidence.',
    noteHeading: 'Privacy reminder',
    noteBody: 'Do not enter real complaint details, personal data, politically sensitive actor names, or confidential project information.',
    ctaHeading: 'Next, collect the toolkit.',
    ctaText: 'The improvement map is ready. Next, collect the Module 3 resource pack.',
    ctaButton: 'Continue to Resource Pack',
    nextId: 'M3-S1-23',
  },
  {
    screenId: 'M3-S1-23',
    context: 'Project Design Studio · Resource Pack',
    title: 'Module 3 Resource Pack: HRBA Project Design Toolkit',
    heading: 'Collect your HRBA project design tools.',
    body: 'The resource pack gathers the practical tools used across Module 3 so learners can return to them when improving project design.',
    startButton: 'Open the toolkit',
    revealTitle: 'What is inside the toolkit?',
    revealItems: [
      'Context analysis worksheet and policy alignment scan.',
      'Rights-SDG-LNOB tool and rights-holder segmentation guide.',
      'Stakeholder and actor map, gender worksheet, and disability checklist.',
      'Root-cause tree, participation planner, activity package builder, intervention logic builder, risk checklist, and evidence design checklist.',
    ],
    activityTitle: 'Preview the toolkit.',
    correctPrompt: 'How should learners use the resource pack?',
    correctAnswer: 'Use the tools selectively and adapt them to the actual project, context, evidence, risks, and participation process.',
    outputTitle: 'Three practical ways to use this resource pack',
    outputBody: 'Use it before writing a proposal, during proposal review, or during a team design clinic. The tools are supports for judgment, not forms to complete mechanically.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not treat the toolkit as a compliance checklist. Use the tools when they help the team make safer, more inclusive, and more accountable design decisions.',
    ctaHeading: 'Next, continue your practice with peers.',
    ctaText: 'Peer exchange can help teams test assumptions and improve proposal design carefully.',
    ctaButton: 'Continue to Peer Exchange',
    nextId: 'M3-S1-24',
  },
  {
    screenId: 'M3-S1-24',
    context: 'Project Design Studio · Peer Exchange',
    title: 'Peer Exchange: Using HRBA Design Tools Together',
    heading: 'HRBA design gets stronger through careful conversation.',
    body: 'The module now invites learners to use the HRBA design tools in safe peer exchange, proposal clinics, gender/disability design discussions, policy alignment reviews, risk checks, and intervention logic practice.',
    startButton: 'Open the peer exchange guide',
    revealTitle: 'What a good peer exchange helps you do',
    revealItems: [
      'Notice assumptions in a project design without blaming the team.',
      'Ask practical questions about people, barriers, responsibility, participation, risk, and evidence.',
      'Respect privacy and avoid sharing sensitive real cases or personal data.',
      'Use a simple 45-minute HRBA proposal clinic to review one design question at a time.',
      'Use prompt cards that ask better peer review questions rather than giving generic advice.',
    ],
    activityTitle: 'Choose the better peer question.',
    correctPrompt: 'Which peer question is strongest?',
    correctAnswer: 'Who might be missed by the current design, what barrier could exclude them, and what design choice would make access or voice more realistic?',
    outputTitle: 'A simple peer exchange guide',
    outputBody: 'A useful peer exchange sets a safe scope, reviews the fictional or non-sensitive project idea, asks focused design questions, identifies one improvement, and agrees on a practical next step.',
    noteHeading: 'Safe exchange reminder',
    noteBody: 'Do not share confidential cases, active complaints, personal data, or sensitive political actor mapping in peer discussion.',
    ctaHeading: 'Next, complete Module 3.',
    ctaText: 'You have reviewed how to keep practicing HRBA project design with peers.',
    ctaButton: 'Continue to Module 3 Completion',
    nextId: 'M3-S1-25',
  },
  {
    screenId: 'M3-S1-25',
    context: 'Project Design Studio · Completion',
    title: 'Module 3 Completion: Ready to Move from Design to Implementation',
    heading: 'You have completed Module 3.',
    body: 'The learner closes Module 3 by reviewing what they can now do and seeing how good HRBA design must be tested, adapted, and protected during implementation.',
    startButton: 'Review what you can now do',
    revealTitle: 'After Module 3, you can now',
    revealItems: [
      'Explain why an organized proposal can still be incomplete from an HRBA design perspective.',
      'Build a context snapshot, policy alignment scan, rights-aware problem framing, and rights-holder analysis.',
      'Apply gender and disability design lenses to access, voice, safety, benefit, and accountability.',
      'Map actors, responsibilities, capacity gaps, root causes, activity logic, intervention logic, risks, and evidence choices.',
      'Use HRBA tools to improve project design before implementation begins.',
    ],
    activityTitle: 'Before moving on, check your readiness.',
    correctPrompt: 'What is the strongest readiness statement?',
    correctAnswer: 'I can use HRBA design questions to improve a project before activities, budgets, timelines, and indicators are finalized.',
    outputTitle: 'What comes next?',
    outputBody: 'Module 4 will focus on applying HRBA during implementation: keeping participation, feedback, accountability, adaptation, safeguarding, and do-no-harm alive while the project is delivered.',
    noteHeading: 'Completion note',
    noteBody: 'Good design is only the start. The next step is testing, adapting, and protecting HRBA choices during implementation.',
    ctaHeading: 'Continue to Module 4',
    ctaText: 'You are ready to move from HRBA project design to HRBA during implementation.',
    ctaButton: 'Start Module 4',
    nextId: 'M3-PLAYER-COMPLETE',
  },
].forEach((spec) => {
  studioScreens[spec.screenId] = makeCompactStudioScreen(spec);
});

[
  {
    screenId: 'M3-S1-09',
    context: 'Project Design Studio · Root-Cause Lens',
    title: 'Symptom, Root Cause, or Capacity Gap?',
    heading: 'Do not design around the first thing you see.',
    body: 'The team now has a clearer actor map, but it still needs to separate symptoms, root causes, rights-holder capacity gaps, duty-bearer capacity gaps, discrimination, and structural barriers.',
    startButton: 'Open the root-cause lens',
    revealTitle: 'Four things the team must separate',
    revealItems: [
      'Symptom: the visible problem the team first notices, such as low income or low participation.',
      'Root cause: the deeper reason the issue continues, such as exclusion, unclear procedures, harmful norms, or weak accountability.',
      'Rights-holder capacity gap: people may lack timely information, safe voice, confidence, access to criteria, or support to claim opportunities fairly.',
      'Duty-bearer capacity gap: responsible actors may lack clarity, resources, skills, coordination, or accountability processes.',
      'Systemic barrier: discrimination, distance, disability access, gendered care work, gatekeeping, or weak information systems can keep exclusion in place.',
    ],
    activityTitle: 'Sort the project clues.',
    correctPrompt: 'What should the team do before choosing activities?',
    correctAnswer: 'Separate symptoms, root causes, capacity gaps, discrimination, and structural barriers so activities respond to the real problem.',
    outputTitle: 'A stronger diagnosis for the fictional project',
    outputBody: 'The issue is not only lack of skills. The diagnosis points to information gaps, selection risks, inaccessible participation, gendered time burdens, disability barriers, duty-bearer role confusion, and weak accountability.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not treat every visible problem as the root cause. If the team misreads the problem, it may choose activities that look useful but do not reduce exclusion.',
    ctaHeading: 'Next, check what has already been tried.',
    ctaText: 'Before designing new activities, the team will scan lessons, existing services, and possible synergies.',
    ctaButton: 'Continue to Lessons and Synergies Scan',
    nextId: 'M3-S1-09A',
  },
  {
    screenId: 'M3-S1-09A',
    context: 'Project Design Studio · Lessons and Synergies',
    title: 'Lessons Learnt and Synergies Scan',
    heading: 'Before designing a new project, check what already exists.',
    body: 'The team pauses before adding new activities. They need to know what has already been tried, who else is working on the issue, what can be learned, and how to avoid duplication.',
    startButton: 'Open the lessons and synergies scan',
    revealTitle: 'Five questions for a lessons learnt scan',
    revealItems: [
      'What has already been tried in this area or sector, and what was learned?',
      'Who else is working on livelihood, inclusion, gender, disability, youth, or displacement-related barriers?',
      'Which existing services, local plans, or government responsibilities are relevant?',
      'Where are referral opportunities, coordination gaps, or duplication risks?',
      'What should the project adapt based on lessons and synergies?',
    ],
    activityTitle: 'Find the synergy.',
    correctPrompt: 'What is the strongest use of a lessons and synergies scan?',
    correctAnswer: 'Use it to avoid duplication, learn from what exists, coordinate with relevant actors, and fill real gaps in the design.',
    outputTitle: 'Lessons and synergies note for the fictional proposal',
    outputBody: 'The team should check existing livelihood services, local plans, government responsibilities, other CSO activities, referral pathways, and lessons from earlier projects before finalizing activities.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not assume a new activity is useful simply because it is familiar. A stronger design learns from what already exists.',
    ctaHeading: 'Next, build the root-cause and capacity-gap tree.',
    ctaText: 'The team now has enough notes to organize the diagnosis into a practical tree.',
    ctaButton: 'Build the Root-Cause Tree',
    nextId: 'M3-S1-10',
  },
  {
    screenId: 'M3-S1-10',
    context: 'Project Design Studio · Practice 5',
    title: 'Practice: Build a Root-Cause and Capacity-Gap Tree',
    heading: 'Now organize the diagnosis into a design tree.',
    body: 'The team turns scattered diagnosis notes into a simple tree that connects symptoms, root causes, barriers, capacity gaps, and design implications.',
    startButton: 'Start the root-cause tree',
    revealTitle: 'Fictional project diagnosis notes',
    revealItems: [
      'Visible symptom: some households have reduced livelihood opportunities and low access to support.',
      'Root causes: unequal information, unclear selection, gatekeeper control, gendered care burdens, disability access barriers, and weak local accountability.',
      'Rights-holder capacity gaps: limited information, confidence, voice, feedback access, and ability to influence decisions safely.',
      'Duty-bearer and actor capacity gaps: unclear roles, weak selection guidance, limited inclusion planning, and poor coordination.',
      'Design implications: transparent criteria, inclusive outreach, accessible participation, coordination, risk mitigation, and feedback mechanisms.',
    ],
    activityTitle: 'Build the tree.',
    correctPrompt: 'What makes a root-cause tree useful for HRBA design?',
    correctAnswer: 'It links symptoms to root causes, capacity gaps, barriers, and design responses rather than jumping straight to activities.',
    outputTitle: 'Model root-cause and capacity-gap tree',
    outputBody: 'The model tree shows that training may be useful but not sufficient. It must sit inside a package that addresses information, selection, participation, disability access, gendered barriers, local responsibilities, safeguards, and feedback.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not make the tree so complex that it cannot guide design. The tree should help the team choose realistic activities and limits.',
    ctaHeading: 'Next, design participation intentionally.',
    ctaText: 'The team now needs a participation plan that is designed, not assumed.',
    ctaButton: 'Continue to Participation by Design',
    nextId: 'M3-S1-11',
  },
  {
    screenId: 'M3-S1-11',
    context: 'Project Design Studio · Participation',
    title: 'Participation by Design',
    heading: 'Participation is not one meeting.',
    body: 'The team sees that participation must be designed into the project through information access, timing, safety, accessibility, feedback, and visible influence.',
    startButton: 'Open the participation pathway',
    revealTitle: 'The participation pathway',
    revealItems: [
      'Information: people need clear, timely, accessible information before they can participate meaningfully.',
      'Access: timing, location, transport, care responsibilities, disability access, and safety affect who can attend.',
      'Voice: facilitation and safe spaces determine who can speak and influence decisions.',
      'Influence: participation matters when input changes criteria, timing, activities, safeguards, or feedback channels.',
      'Feedback and response: people should know how concerns will be handled and what changed because of their input.',
    ],
    activityTitle: 'Choose the stronger participation design.',
    correctPrompt: 'Which participation plan is strongest?',
    correctAnswer: 'A plan that gives rights-holders information, accessible options, safe voice, influence over decisions, and visible feedback loops.',
    outputTitle: 'A strong HRBA participation plan should be',
    outputBody: 'Inclusive, safe, accessible, informed, influential, accountable, realistic, and connected to design decisions rather than treated as a meeting record.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not count attendance as meaningful participation. Attendance only tells the team who was present, not who influenced decisions.',
    ctaHeading: 'Next, strengthen the participation plan.',
    ctaText: 'You will repair a weak participation plan and test whether it is inclusive, safe, accessible, and influential.',
    ctaButton: 'Practice Designing Meaningful Participation',
    nextId: 'M3-S1-12',
  },
  {
    screenId: 'M3-S1-12',
    context: 'Project Design Studio · Practice 6',
    title: 'Practice: Design Meaningful Participation',
    heading: 'Repair the participation plan.',
    body: 'The weak plan relies on one community meeting and assumes representatives will speak for everyone. The team must test it against information, access, safety, voice, influence, and feedback.',
    startButton: 'Review the weak plan',
    revealTitle: 'What is weak in this participation plan?',
    revealItems: [
      'Information is shared too late or through too few channels.',
      'Timing, location, safety, care responsibilities, and disability access are not tested.',
      'Less visible groups have no clear way to influence selection criteria or activity design.',
      'Feedback and complaint options are unclear or not trusted.',
      'The plan treats consultation as an event rather than a sequence of design decisions.',
    ],
    activityTitle: 'Repair the plan step by step.',
    correctPrompt: 'What makes the repaired participation plan stronger?',
    correctAnswer: 'It designs information, access, safe voice, influence, feedback, and response before activities are finalized.',
    outputTitle: 'Model repaired participation plan',
    outputBody: 'The repaired plan uses multiple information channels, targeted outreach, accessible meeting options, separate and mixed consultation spaces where useful, clear selection criteria, feedback options, and a visible response loop.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not treat participation as proof that everyone agreed. Participation should help the team learn, adapt, and be accountable.',
    ctaHeading: 'Next, strengthen the objective.',
    ctaText: 'The team has repaired participation. Now it will turn the analysis into a stronger objective.',
    ctaButton: 'Continue to HRBA Objective Design',
    nextId: 'M3-S1-13',
  },
  {
    screenId: 'M3-S1-13',
    context: 'Project Design Studio · Objective Design',
    title: 'From Activity-Based Objective to HRBA Objective',
    heading: 'The objective should not simply repeat the activity.',
    body: 'The team now checks whether the objective describes activity delivery or the change the project should support for rights-holders, duty-bearers, inclusion, participation, accountability, and risk.',
    startButton: 'Compare the objectives',
    revealTitle: 'Activity-based objective vs HRBA objective',
    revealItems: [
      'Activity-based objective: train 300 vulnerable people in livelihood skills.',
      'HRBA objective: strengthen equitable access to livelihood opportunities for groups facing information, selection, gender, disability, and accountability barriers.',
      'A stronger objective names change, not only delivery.',
      'A stronger objective links rights-holder capacity, duty-bearer responsiveness, inclusion, accountability, and safe participation.',
    ],
    activityTitle: 'Check the objective pattern.',
    correctPrompt: 'Which objective is strongest for HRBA design?',
    correctAnswer: 'An objective that names the rights-aware change, affected groups, barriers to reduce, capacities to strengthen, and accountability to improve.',
    outputTitle: 'A simple pattern for HRBA objectives',
    outputBody: 'Strengthen [rights-holder access/capacity/voice] and [duty-bearer or actor responsiveness] by addressing [barriers] so that [rights-aware change] becomes more possible.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not write the objective as a list of activities. A good objective should guide activities, not repeat them.',
    ctaHeading: 'Now practice strengthening objectives.',
    ctaText: 'Next, you will choose stronger objectives and identify why some objectives remain activity-based or tokenistic.',
    ctaButton: 'Practice Objective Repair',
    nextId: 'M3-S1-14',
  },
  {
    screenId: 'M3-S1-14',
    context: 'Project Design Studio · Practice 7',
    title: 'Practice: Strengthen the Objective',
    heading: 'Now repair weak objectives.',
    body: 'The team practices turning weak activity-based objectives into clearer HRBA objectives linked to rights-holder capacity, duty-bearer capacity, inclusion, accountability, and change.',
    startButton: 'Start objective repair practice',
    revealTitle: 'How this practice works',
    revealItems: [
      'Read the weak objective and check whether it only repeats an activity.',
      'Choose the objective that names affected groups, barriers, capacities, responsibilities, and expected change.',
      'Review the feedback to see why the stronger option supports better design.',
      'Use the pattern when repairing objectives in other sectors.',
    ],
    activityTitle: 'Check the strongest objective',
    correctPrompt: 'Which objective repair is strongest?',
    correctAnswer: 'One that links excluded groups access and voice with transparent selection, accessible participation, local actor coordination, and safe feedback.',
    outputTitle: 'Use this pattern when repairing objectives',
    outputBody: 'A strong objective should be specific enough to guide activity choices and flexible enough to adapt as the team learns from participation and evidence.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not replace weak objectives with impressive but vague language. Strong objectives should explain the intended change.',
    ctaHeading: 'Next, design activities that match the rights problem.',
    ctaText: 'You have strengthened the objective. Next, the activity package must match the rights problem.',
    ctaButton: 'Continue to Activity Design',
    nextId: 'M3-S1-15',
  },
  {
    screenId: 'M3-S1-15',
    context: 'Project Design Studio · Activity Design',
    title: 'Design Activities That Match the Rights Problem',
    heading: 'Activities should answer the problem - not just fill the workplan.',
    body: 'The team now tests whether its activities respond to the actual barriers identified through context, rights-holder, gender, disability, actor, risk, and participation analysis.',
    startButton: 'Check the activity logic',
    revealTitle: 'When activity lists look strong but still miss the rights problem',
    revealItems: [
      'Training may help skills but not solve late information or unclear selection.',
      'Awareness sessions may help knowledge but not create influence or accountability.',
      'Monitoring visits may count delivery but not reveal hidden exclusion or harm.',
      'A final learning event may share results but not provide safe feedback during the project.',
    ],
    activityTitle: 'Match activities to the barriers.',
    correctPrompt: 'What makes an HRBA activity package coherent?',
    correctAnswer: 'Activities directly respond to barriers, responsibilities, participation gaps, risks, and evidence needs identified in the analysis.',
    outputTitle: 'A stronger HRBA activity package',
    outputBody: 'The package combines inclusive outreach, transparent selection, accessible participation, gender- and disability-responsive training design, local actor coordination, feedback mechanisms, risk mitigation, and learning moments.',
    noteHeading: 'Common design mistake',
    noteBody: 'Do not add activities because they sound useful. Add activities because the analysis shows what must change.',
    ctaHeading: 'Now build a coherent activity package.',
    ctaText: 'Next, you will connect barriers and root causes to coherent activity packages.',
    ctaButton: 'Practice Building the Activity Package',
    nextId: 'M3-S1-16',
  },
].forEach((spec) => {
  studioScreens[spec.screenId] = makeCompactStudioScreen(spec);
});

function Module3StudioScreen({
  config,
  state,
  onChangeState,
}: {
  config: StudioScreenConfig;
  state: LearningState;
  onChangeState: Module3RendererProps['onChangeState'];
}) {
  const practiceKey = `module3_${config.screenId.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
  const stored = state.practiceCheckState[practiceKey] || {};
  const completed = (state.screenProgress[MODULE_ID] || []).includes(config.screenId);
  const allRevealIds = config.revealItems.map((item) => item.id);
  const [started, setStarted] = useState(Boolean(stored.started || completed));
  const [activePanel, setActivePanel] = useState<'reveal' | 'activity' | 'output' | 'quick'>(
    stored.activePanel || 'reveal',
  );
  const [openedRevealIds, setOpenedRevealIds] = useState<string[]>(
    completed ? allRevealIds : stored.openedRevealIds || [],
  );
  const [activeRevealId, setActiveRevealId] = useState<string>(
    stored.activeRevealId || config.revealItems[0]?.id || '',
  );
  const [activityAnswers, setActivityAnswers] = useState<Record<string, string>>(
    stored.activityAnswers || {},
  );
  const [quickCheck, setQuickCheck] = useState<string>(stored.quickCheck || '');

  const openedCount = openedRevealIds.length;
  const allNotesOpened = openedCount === config.revealItems.length;
  const allActivityAnswered = config.activityItems.every((item) => Boolean(activityAnswers[item.id]));
  const canContinue = started && allNotesOpened && allActivityAnswered && Boolean(quickCheck);
  const activeReveal =
    config.revealItems.find((item) => item.id === activeRevealId) || config.revealItems[0];

  const persist = (payload: Record<string, unknown>) => {
    onChangeState((prev) => ({
      ...prev,
      practiceCheckState: updatePracticeState(prev, practiceKey, payload),
    }));
  };

  const startScreen = () => {
    setStarted(true);
    setActivePanel('reveal');
    persist({ started: true, activePanel: 'reveal' });
  };

  const openReveal = (id: string) => {
    const nextOpened = openedRevealIds.includes(id) ? openedRevealIds : [...openedRevealIds, id];
    setOpenedRevealIds(nextOpened);
    setActiveRevealId(id);
    persist({ openedRevealIds: nextOpened, activeRevealId: id, activePanel });
  };

  const chooseActivityAnswer = (itemId: string, answerId: string) => {
    const nextAnswers = { ...activityAnswers, [itemId]: answerId };
    setActivityAnswers(nextAnswers);
    persist({ activityAnswers: nextAnswers, activePanel });
  };

  const changePanel = (panel: 'reveal' | 'activity' | 'output' | 'quick') => {
    setActivePanel(panel);
    persist({ activePanel: panel });
  };

  const finishScreen = () => {
    const completedAt = new Date().toISOString();
    const nextRoute = routes[config.nextId] || routes['M3-PLAYER-COMPLETE'];

    onChangeState((prev) => {
      const progress = new Set(prev.screenProgress[MODULE_ID] || []);
      progress.add(config.screenId);
      if (config.nextId === 'M3-PLAYER-COMPLETE') {
        progress.add('M3-PLAYER-COMPLETE');
      }

      return {
        ...prev,
        currentScreenId: config.nextId,
        completedModules:
          config.nextId === 'M3-PLAYER-COMPLETE' && !prev.completedModules.includes(MODULE_ID)
            ? [...prev.completedModules, MODULE_ID]
            : prev.completedModules,
        screenProgress: {
          ...prev.screenProgress,
          [MODULE_ID]: Array.from(progress),
        },
        practiceCheckState: updatePracticeState(prev, practiceKey, {
          started,
          activePanel,
          openedRevealIds,
          activeRevealId,
          activityAnswers,
          quickCheck,
          status: 'completed',
          completedAt,
        }),
      };
    });

    setRoute(nextRoute);
  };

  return (
    <main className="m3-screen m3-studio-screen" aria-labelledby={`${config.screenId}-title`}>
      <section className="m3-hero-panel m3-studio-hero">
        <div>
          <ModuleContextLabel>{config.context}</ModuleContextLabel>
          <ScreenTitle id={`${config.screenId}-title`} lead="Use the staged design canvas. Open the notes, make the design judgment, review the model output, and complete the quick check.">
            {config.title}
          </ScreenTitle>
          <div className="m3-story-card">
            <p className="m3-card-kicker">Fictional project case</p>
            <h2>{config.heading}</h2>
            {config.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {config.quote && <QuoteBlock>{config.quote}</QuoteBlock>}
            {!started && <PrimaryButton onClick={startScreen}>{config.startButton}</PrimaryButton>}
          </div>
        </div>
        <div
          className="m3-visual-card m3-visual-card--wall m3-studio-status-card"
          role="img"
          aria-label="Design studio board showing project analysis cards moving into practical project design decisions."
        >
          <span>Context</span>
          <span>People</span>
          <span>Barriers</span>
          <span>Actors</span>
          <span>Risks</span>
          <span>Evidence</span>
        </div>
      </section>

      {started && (
        <section className="m3-section m3-studio-canvas" aria-labelledby={`${config.screenId}-canvas`}>
          <div className="m3-section-head">
            <div>
              <p className="m3-card-kicker">Interactive design canvas</p>
              <h2 id={`${config.screenId}-canvas`}>{config.revealTitle}</h2>
              <p>{config.revealIntro}</p>
            </div>
            <ProgressChip>
              {openedCount} of {config.revealItems.length} design notes opened
            </ProgressChip>
          </div>

          <div className="m3-studio-tabs" role="tablist" aria-label={`${config.title} stages`}>
            {[
              ['reveal', 'Design notes'],
              ['activity', 'Practice'],
              ['output', 'Model output'],
              ['quick', 'Quick check'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activePanel === id}
                className={activePanel === id ? 'is-active' : ''}
                onClick={() => changePanel(id as 'reveal' | 'activity' | 'output' | 'quick')}
              >
                {label}
              </button>
            ))}
          </div>

          {activePanel === 'reveal' && activeReveal && (
            <div className="m3-studio-panel">
              <div className="m3-reveal-button-grid">
                {config.revealItems.map((item, index) => {
                  const opened = openedRevealIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`m3-reveal-note-button ${opened ? 'is-complete' : ''}`}
                      onClick={() => openReveal(item.id)}
                    >
                      <span aria-hidden="true">{opened ? '✓' : index + 1}</span>
                      <span>{item.title}</span>
                      {opened && <small>Opened</small>}
                    </button>
                  );
                })}
              </div>
              <article className="m3-output-card m3-studio-detail-card" aria-live="polite">
                <p className="m3-card-kicker">Design note</p>
                <h3>{activeReveal.title}</h3>
                <p>{activeReveal.body}</p>
              </article>
            </div>
          )}

          {activePanel === 'activity' && (
            <div className="m3-studio-panel">
              <div className="m3-output-card">
                <p className="m3-card-kicker">Practice activity</p>
                <h2>{config.activityTitle}</h2>
                <p>{config.activityPrompt}</p>
              </div>
              {config.activityItems.map((item) => {
                const selected = activityAnswers[item.id] || '';
                const correct = selected === item.correct;
                return (
                  <article className="m3-quick-check" key={item.id}>
                    <h3>{item.prompt}</h3>
                    <div className="m3-choice-grid">
                      {Object.entries(item.options).map(([optionId, text]) => (
                        <label
                          key={optionId}
                          className={`m3-choice-card ${selected === optionId ? 'is-selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name={`${config.screenId}-${item.id}`}
                            value={optionId}
                            checked={selected === optionId}
                            onChange={() => chooseActivityAnswer(item.id, optionId)}
                          />
                          <span className="m3-choice-card__mark" aria-hidden="true">
                            {selected === optionId ? '✓' : optionId}
                          </span>
                          <span>{text}</span>
                        </label>
                      ))}
                    </div>
                    {selected && (
                      <div className={`m3-feedback-panel ${correct ? 'is-strong' : 'is-support'}`} aria-live="polite">
                        <strong>{correct ? 'Good choice.' : 'Try that judgment again.'}</strong>
                        <p>{correct ? item.feedback : commonIncorrectFeedback}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {activePanel === 'output' && (
            <div className="m3-studio-panel">
              <div className="m3-output-card">
                <p className="m3-card-kicker">Model output</p>
                <h2>{config.outputTitle}</h2>
                {config.outputBody.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="m3-scan-output-grid">
                {config.designCards.map((card) => (
                  <article key={card.title}>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </article>
                ))}
              </div>
              <NoteBlock heading={config.noteHeading}>
                {config.noteBody.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </NoteBlock>
            </div>
          )}

          {activePanel === 'quick' && (
            <div className="m3-studio-panel">
              <QuickCheck
                question={config.quickQuestion}
                selected={quickCheck}
                onSelect={(id) => {
                  setQuickCheck(id);
                  persist({ quickCheck: id, activePanel: 'quick' });
                }}
                correctId={config.quickCorrect}
                correctFeedback={config.quickCorrectFeedback}
                incorrectFeedback={config.quickIncorrectFeedback}
                options={config.quickOptions}
              />
              <div className="m3-cta-panel">
                <div>
                  <h2>{config.ctaHeading}</h2>
                  <p>{config.ctaText}</p>
                </div>
                <PrimaryButton disabled={!canContinue} onClick={finishScreen}>
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

function Module3CompleteScreen({ onChangeState }: { onChangeState: Module3RendererProps['onChangeState'] }) {
  return (
    <main className="m3-screen m3-studio-screen" aria-labelledby="m3-complete-title">
      <section className="m3-hero-panel m3-studio-hero">
        <div>
          <ModuleContextLabel>Module 3 · Applying HRBA in Project Design</ModuleContextLabel>
          <ScreenTitle
            id="m3-complete-title"
            lead="You have completed the Module 3 project design pathway."
          >
            Module 3 Complete
          </ScreenTitle>
          <StatementCard heading="Ready for implementation thinking" dark>
            <p>
              You have moved from a promising project idea to a more rights-aware design by using context,
              rights-holder, actor, participation, objective, activity, risk, and evidence tools.
            </p>
          </StatementCard>
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
        <div
          className="m3-visual-card m3-visual-card--connections m3-studio-status-card"
          role="img"
          aria-label="Completed Module 3 design pathway showing analysis connected to implementation readiness."
        >
          <span>Analyze</span>
          <span>Design</span>
          <span>Check risk</span>
          <span>Learn</span>
        </div>
      </section>
    </main>
  );
}

export default function Module3Renderer(props: Module3RendererProps) {
  if (props.screenId === 'M3-S1-04') {
    return <Module3DesignSnapshotScreen {...props} />;
  }

  if (props.screenId === 'M3-S1-05') {
    return <Module3RightsActorsScreen {...props} />;
  }

  if (props.screenId === 'M3-S1-06') {
    return <Module3DiagnosisLabScreen {...props} />;
  }

  if (props.screenId === 'M3-S1-06A') {
    return <Module3ObjectiveRepairScreen {...props} />;
  }

  if (props.screenId === 'M3-S1-21') {
    return <Module3KnowledgeCheckScreen {...props} />;
  }

  if (props.screenId === 'M3-S1-22') {
    return <Module3PortfolioCheckpointScreen {...props} />;
  }

  const studioScreen = studioScreens[props.screenId];
  if (studioScreen) {
    return (
      <Module3StudioScreen
        config={studioScreen}
        state={props.state}
        onChangeState={props.onChangeState}
      />
    );
  }

  if (props.screenId === 'M3-PLAYER-COMPLETE') {
    return <Module3CompleteScreen onChangeState={props.onChangeState} />;
  }

  switch (props.screenId) {
    case 'M3-S1-01':
      return <Module3IntroVideoScreen {...props} />;
    case 'M3-S1-02':
      return <Module3LearningObjectivesScreen {...props} />;
    case 'M3-S1-03':
      return <Module3Screen31 {...props} />;
    case 'M3-S1-03A':
      return <Module3Screen33A {...props} />;
    case 'M3-S1-03B':
      return <Module3Screen33B {...props} />;
    case 'M3-S1-03C':
      return <Module3Screen33C {...props} />;
    case 'M3-S1-03D':
      return <Module3Screen33D {...props} />;
    default:
      return (
        <main className="m3-screen" aria-labelledby="m3-placeholder-title">
          <section className="m3-section">
            <ModuleContextLabel>Module 3 · Applying HRBA in Project Design</ModuleContextLabel>
            <h1 id="m3-placeholder-title">Module 3 screen coming soon</h1>
            <p>This part of Module 3 has not been implemented yet.</p>
          </section>
        </main>
      );
  }
}
