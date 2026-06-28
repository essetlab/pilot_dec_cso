export interface MatchingItem {
  id: number;
  text: string;
  correctMatch: string;
  bestFeedback: string;
  weakerFeedback: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctKey: string;
  feedback: Record<string, string>;
}

export interface SortingItem {
  id: number;
  text: string;
  correctCategory: string;
  bestFeedback: string;
  weakerFeedback: string;
}

export interface TimelinePoint {
  id: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

export const matchingActivity: MatchingItem[] = [
  {
    id: 1,
    text: "Community members are invited to a planning meeting only after the project activities have already been decided.",
    correctMatch: "Participation",
    bestFeedback: "Good choice. This example is about participation because people affected by a decision should have a meaningful chance to influence that decision early enough.",
    weakerFeedback: "Not quite. Other rights dimensions may also matter, but the strongest issue here is participation. People are being asked to react after decisions are already made."
  },
  {
    id: 2,
    text: "A CSO shares project information only in a language that some community members cannot understand.",
    correctMatch: "Access to information",
    bestFeedback: "Good choice. This example is about access to information. People need information in a form and language they can understand before they can participate meaningfully.",
    weakerFeedback: "Not quite. This could also affect participation and inclusion, but the strongest first issue is access to information."
  },
  {
    id: 3,
    text: "People with disabilities are invited to an event, but the venue is not physically accessible.",
    correctMatch: "Accessibility of services",
    bestFeedback: "Good choice. Invitation alone is not enough. Services, meetings, information, and support need to be accessible in practice.",
    weakerFeedback: "Not quite. This example may also involve equality and participation, but the clearest rights dimension is accessibility."
  },
  {
    id: 4,
    text: "A project has a feedback box, but people do not know who reads the feedback or whether any action is taken.",
    correctMatch: "Accountability",
    bestFeedback: "Good choice. A feedback box is only useful if people know how feedback is handled, receive responses where appropriate, and see that concerns lead to action.",
    weakerFeedback: "Not quite. Feedback is connected to information and participation, but the strongest issue here is accountability."
  },
  {
    id: 5,
    text: "A community activity reaches many people, but women, young people, and people from remote areas rarely attend.",
    correctMatch: "Equality and non-discrimination",
    bestFeedback: "Good choice. This example asks who may be excluded or benefiting less. HRBA helps CSOs notice and reduce barriers for different groups.",
    weakerFeedback: "Not quite. The activity may seem successful because many people attend, but the key rights concern is unequal participation or exclusion."
  }
];

export const characteristicsQuickCheck: MCQQuestion[] = [
  {
    id: 1,
    question: "What does it mean that human rights are universal?",
    options: [
      { key: "A", text: "Human rights belong only to people who know the law." },
      { key: "B", text: "Human rights belong to every person because they are human." },
      { key: "C", text: "Human rights belong only to people selected for a project." },
      { key: "D", text: "Human rights apply only inside courts." }
    ],
    correctKey: "B",
    feedback: {
      A: "Not quite. People do not need legal knowledge to have rights.",
      B: "That’s right. Universal means human rights belong to every person because they are human.",
      C: "Not quite. People do not receive rights because a project selects them. Rights belong to people already.",
      D: "Not quite. Courts can protect rights, but rights also matter in everyday life, services, participation, information, and accountability."
    }
  },
  {
    id: 2,
    question: "What does it mean that human rights are interdependent?",
    options: [
      { key: "A", text: "One right can depend on or support the realization of other rights." },
      { key: "B", text: "Some rights are only for people who already have access to services." },
      { key: "C", text: "Economic rights are always more important than participation rights." },
      { key: "D", text: "Human rights apply only when a court case exists." }
    ],
    correctKey: "A",
    feedback: {
      A: "That’s right. Rights are connected. For example, meaningful participation may depend on information, safety, language access, mobility, and non-discrimination.",
      B: "Not quite. Rights do not belong only to people who already have access to services.",
      C: "Not quite. HRBA does not rank rights in a simple hierarchy. Different rights can support each other.",
      D: "Not quite. Human rights matter in everyday life, not only when a court case exists."
    }
  },
  {
    id: 3,
    question: "Which statement best reflects indivisibility?",
    options: [
      { key: "A", text: "Some rights can be ignored if a project has limited time." },
      { key: "B", text: "Civil and political rights matter, but social and economic rights do not." },
      { key: "C", text: "Different rights matter together and should not be treated as completely separate." },
      { key: "D", text: "CSOs should focus only on the right that is easiest to report." }
    ],
    correctKey: "C",
    feedback: {
      A: "Not quite. Limited time may require prioritization, but HRBA should not ignore rights that affect dignity, participation, access, or accountability.",
      B: "Not quite. HRBA recognizes that different types of rights matter and are connected.",
      C: "That’s right. Indivisibility means rights should not be treated as if some categories are irrelevant to people’s real lives.",
      D: "Not quite. Reporting matters, but HRBA starts from people’s rights and barriers, not only what is easiest to report."
    }
  }
];

export const sortingActivity: SortingItem[] = [
  {
    id: 1,
    text: "People are protected from arbitrary harm or unsafe treatment.",
    correctCategory: "Civil rights",
    bestFeedback: "Good choice. Civil rights often relate to safety, privacy, fair treatment, and protection from arbitrary harm.",
    weakerFeedback: "Not quite. Other rights may be connected, but the strongest category here is civil rights because the example focuses on safety and fair treatment."
  },
  {
    id: 2,
    text: "Community members participate in local decisions that affect them.",
    correctCategory: "Political rights",
    bestFeedback: "Good choice. Political rights include participation, association, expression, and public decision-making.",
    weakerFeedback: "Not quite. Participation can affect many areas, but this example is strongest as a political rights issue."
  },
  {
    id: 3,
    text: "People have fair access to livelihood opportunities.",
    correctCategory: "Economic rights",
    bestFeedback: "Good choice. Economic rights relate to work, livelihood, fair conditions, and social protection.",
    weakerFeedback: "Not quite. Livelihood can connect to other rights, but the strongest category here is economic rights."
  },
  {
    id: 4,
    text: "Children can access quality education.",
    correctCategory: "Social rights",
    bestFeedback: "Good choice. Social rights include education, health, water, housing, and other essential services.",
    weakerFeedback: "Not quite. Education may connect to participation, equality, and opportunity, but the strongest category here is social rights."
  },
  {
    id: 5,
    text: "People can use their language in community information sessions.",
    correctCategory: "Cultural rights",
    bestFeedback: "Good choice. Cultural rights relate to language, identity, cultural life, and participation in community life.",
    weakerFeedback: "Not quite. Language access also supports participation and information, but the strongest category here is cultural rights."
  },
  {
    id: 6,
    text: "A community participates in decisions affecting shared local resources.",
    correctCategory: "Collective rights",
    bestFeedback: "Good choice. Collective rights relate to groups and communities, including shared interests, resources, and collective participation.",
    weakerFeedback: "Not quite. This may also involve participation and accountability, but the strongest category here is collective rights."
  }
];

export const standardsSafeUseCheck: MCQQuestion = {
  id: 1,
  question: "Which is the safest and most practical way for a CSO learner to use human rights standards in this course?",
  options: [
    { key: "A", text: "Use standards to make unsupported legal claims about a real case." },
    { key: "B", text: "Use standards to ask better questions about dignity, access, participation, exclusion, responsibility, and accountability." },
    { key: "C", text: "Use standards to publicly rank other CSOs." },
    { key: "D", text: "Use standards to replace community participation." }
  ],
  correctKey: "B",
  feedback: {
    A: "Not quite. This course supports learning and practical reflection. It does not provide legal advice or ask learners to make claims about real cases.",
    B: "That’s right. Standards can help CSOs ask better practical questions about dignity, access, inclusion, participation, responsibility, and accountability.",
    C: "Not quite. Standards should not be used here to publicly rank or shame CSOs.",
    D: "Not quite. Standards do not replace participation. They should help strengthen participation and accountability."
  }
};

export const scenarioDecision: MCQQuestion = {
  id: 1,
  question: "What is the most rights-based next step?",
  options: [
    { key: "A", text: "Continue with the existing meeting plan because inviting some representatives is enough." },
    { key: "B", text: "Pause and ask who may be excluded, what barriers exist, what information people need, and how the meeting can be made more accessible and safe." },
    { key: "C", text: "Cancel the consultation because inclusion is too difficult." },
    { key: "D", text: "Collect personal details from every person in the community before making any decision." }
  ],
  correctKey: "B",
  feedback: {
    A: "Not quite. Inviting some representatives may be useful, but HRBA asks whether participation is meaningful and who may still be excluded.",
    B: "That’s right. This response applies a rights lens by asking about exclusion, barriers, information, accessibility, safety, and participation before moving ahead.",
    C: "Not quite. Inclusion can be challenging, but HRBA encourages practical adjustments rather than abandoning participation.",
    D: "Not quite. HRBA does not mean collecting as much personal data as possible. Data should be safe, necessary, and proportionate."
  }
};

export const finalFormativeQuiz: MCQQuestion[] = [
  {
    id: 1,
    question: "Which statement best explains human rights in plain language?",
    options: [
      { key: "A", text: "Human rights are only legal words used by courts and lawyers." },
      { key: "B", text: "Human rights are basic rights and freedoms connected to dignity, equality, safety, participation, and a decent life." },
      { key: "C", text: "Human rights are benefits that CSOs give to selected project participants." },
      { key: "D", text: "Human rights are only relevant to international organizations." }
    ],
    correctKey: "B",
    feedback: {
      A: "Not quite. Human rights can be protected through law, but they also matter in everyday life and CSO practice.",
      B: "That’s right. Human rights are basic rights and freedoms connected to dignity, equality, safety, participation, and a decent life.",
      C: "Not quite. Rights are not benefits that CSOs give. People have rights because they are human.",
      D: "Not quite. Human rights are relevant to local CSOs because they affect services, participation, inclusion, accountability, and dignity."
    }
  },
  {
    id: 2,
    question: "Why should CSOs look for rights dimensions in everyday issues?",
    options: [
      { key: "A", text: "To make every activity sound legalistic." },
      { key: "B", text: "To understand dignity, exclusion, access, participation, responsibility, and accountability more clearly." },
      { key: "C", text: "To avoid speaking with communities." },
      { key: "D", text: "To replace project planning with legal claims." }
    ],
    correctKey: "B",
    feedback: {
      A: "Not quite. HRBA should make CSO work more practical and accountable, not unnecessarily legalistic.",
      B: "That’s right. Looking for rights dimensions helps CSOs ask better questions about dignity, exclusion, access, participation, responsibility, and accountability.",
      C: "Not quite. HRBA strengthens meaningful participation; it does not avoid community engagement.",
      D: "Not quite. Rights analysis should improve project planning, not replace it with unsupported legal claims."
    }
  },
  {
    id: 3,
    question: "What does it mean that rights are interdependent?",
    options: [
      { key: "A", text: "One right can depend on or support another right." },
      { key: "B", text: "Rights only apply if all services are already available." },
      { key: "C", text: "CSOs can choose one right and ignore all others." },
      { key: "D", text: "Participation rights are never linked to access to information." }
    ],
    correctKey: "A",
    feedback: {
      A: "That’s right. Rights are connected. For example, participation may depend on information, safety, accessibility, and non-discrimination.",
      B: "Not quite. Rights matter even when services are not fully available.",
      C: "Not quite. HRBA encourages CSOs to notice how different rights and barriers connect.",
      D: "Not quite. Participation is often closely linked to access to information."
    }
  },
  {
    id: 4,
    question: "What is the best way to understand types of rights in CSO work?",
    options: [
      { key: "A", text: "Rights types are useful learning categories, but real issues often involve several rights at the same time." },
      { key: "B", text: "Each issue can involve only one right." },
      { key: "C", text: "Social rights matter, but participation and accountability do not." },
      { key: "D", text: "Rights categories should be used to avoid deeper analysis." }
    ],
    correctKey: "A",
    feedback: {
      A: "That’s right. Rights types help organize thinking, but everyday issues often involve several rights together.",
      B: "Not quite. One issue can involve multiple rights and barriers.",
      C: "Not quite. HRBA recognizes the importance of participation, accountability, equality, and many types of rights.",
      D: "Not quite. Rights categories should support deeper analysis, not replace it."
    }
  },
  {
    id: 5,
    question: "How should a learner use human rights standards in Module 2?",
    options: [
      { key: "A", text: "As legal advice for real disputes." },
      { key: "B", text: "As practical guidance for asking better questions about rights, barriers, responsibilities, and accountability." },
      { key: "C", text: "As a way to expose confidential organizational information." },
      { key: "D", text: "As a reason to skip community participation." }
    ],
    correctKey: "B",
    feedback: {
      A: "Not quite. This course supports learning and practical reflection. It does not provide legal advice.",
      B: "That’s right. Standards can guide practical questions about rights, barriers, responsibilities, participation, and accountability.",
      C: "Not quite. Learners should not expose confidential information, real case details, complaints, or sensitive data.",
      D: "Not quite. Standards should strengthen participation, not replace it."
    }
  }
];
