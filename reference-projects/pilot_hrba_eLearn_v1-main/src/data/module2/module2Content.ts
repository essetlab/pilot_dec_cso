export interface ScreenContent {
  id: string;
  title: string;
  section: number;
  blockType: string;
  content: {
    paragraphs?: string[];
    listItems?: string[];
    keyMessage?: string;
    note?: string;
    timelinePoints?: { title: string; description: string }[];
    tabs?: { title: string; description: string }[];
    mythReality?: { myth: string; reality: string }[];
    comparisonColumns?: { title: string; items: string[] }[];
    worksheetFields?: string[];
  };
  buttonText: string;
  skipButtonText?: string;
}

export const module2Title = "Module 2: Foundations of HRBA";
export const module2Duration = "Approx. 75-90 min";

export const module2ContentRegistry: Record<string, ScreenContent> = {
  'M2-S01': {
    id: 'M2-S01',
    title: 'Foundations of HRBA: Rights, Actors, Principles, and Power',
    section: 1,
    blockType: 'Module cover / Start state',
    content: {},
    buttonText: 'Start Module 2'
  },
  'M2-S01A': {
    id: 'M2-S01A',
    title: 'Module 2 Intro Video Rights, Actors, Principles, and Power',
    section: 1,
    blockType: 'Intro video placeholder',
    content: {
      paragraphs: [
        'Watch this short introduction to understand what Module 2 will help you practice seeing everyday CSO work through rights, actors, principles, power, participation, and accountability.'
      ]
    },
    buttonText: 'Continue to learning objectives'
  },
  'M2-S02': {
    id: 'M2-S02',
    title: 'What you will be able to do',
    section: 1,
    blockType: 'FlashcardGrid / Learning objectives path',
    content: {},
    buttonText: 'Continue to everyday claims'
  },
  'M2-S03': {
    id: 'M2-S03',
    title: 'Human Rights as Everyday Claims and Responsibilities',
    section: 2,
    blockType: 'Concept Reveal Block / Flip Cards',
    content: {
      paragraphs: [
        "Human rights are not only legal words. In everyday CSO work, they often appear as practical claims: people need information they can understand, access they can use, voice in decisions, fair treatment, responsible actors, and a response when something goes wrong.",
        "Explore the six everyday rights dimensions. Think about how each one can appear in ordinary CSO activities."
      ],
      keyMessage: "A rights lens helps a CSO move from “we delivered an activity” to “people had information, access, voice, inclusion, responsible actors, and a pathway for response.”"
    },
    buttonText: 'Continue'
  },
  'M2-S04': {
    id: 'M2-S04',
    title: 'What Rights Dimensions Can You See?',
    section: 2,
    blockType: 'labeled_hotspot',
    content: {
      paragraphs: [
        "Explore the fictional community scene. The scene shows a local CSO preparing a community meeting about access to services. Different people face different barriers to participation. Click each label to see a possible rights dimension."
      ],
      note: "Hotspot Text Alternative: The image shows a fictional CSO community meeting. Some people are present, while others face barriers such as distance, disability access, language, timing, care responsibilities, lack of information, or fear of speaking. The labels show that everyday participation issues involve information, accessibility, equality, safety, dignity, and accountability."
    },
    buttonText: 'Continue'
  },
  'M2-S05': {
    id: 'M2-S05',
    title: 'Four Characteristics of Human Rights in CSO Practice',
    section: 3,
    blockType: 'principle_to_practice_reveal',
    content: {
      paragraphs: [
        "In the previous screen, we looked at human rights as everyday claims and responsibilities.",
        "Now we will look at four characteristics of human rights. These words may sound formal at first, but they help CSOs make better practical decisions."
      ],
      keyMessage: "The four characteristics of human rights help CSOs move from “Who attended?” to “Who was considered, respected, informed, included, heard, and able to claim a response?”"
    },
    buttonText: 'Continue to practice'
  },
  'M2-S06': {
    id: 'M2-S06',
    title: 'Practice: Match Rights Characteristics to Everyday CSO Situations',
    section: 3,
    blockType: 'tap_to_match_activity',
    content: {
      paragraphs: [
        "You have just explored four characteristics of human rights: universal, inalienable, indivisible, and interdependent.",
        "Now practice using them. Read each CSO situation and match it to the characteristic that best explains why it matters."
      ]
    },
    buttonText: 'Continue to the five HRBA working principles'
  },
  'M2-S07': {
    id: 'M2-S07',
    title: 'The Five HRBA Working Principles in Everyday CSO Work',
    section: 4,
    blockType: 'interactive_principle_cards',
    content: {
      paragraphs: [
        "Human rights become practical when CSOs use them to guide everyday decisions.",
        "The five HRBA working principles help a project team look beyond activity completion and ask who is included, who participates meaningfully, who may face discrimination or barriers, who is responsible, and who has information and a way to seek response."
      ]
    },
    buttonText: 'Continue to rights-holders'
  },
  'M2-S08': {
    id: 'M2-S08',
    title: 'Rights-Holders: Moving Beyond “The Community”',
    section: 4,
    blockType: 'labeled_actor_segmentation_map',
    content: {
      paragraphs: [
        "In CSO work, we often say “the community participated” or “the beneficiaries attended.”",
        "But a rights lens asks us to be more specific. A community is not one single group."
      ]
    },
    buttonText: 'Continue to intersectionality'
  },
  'M2-S09': {
    id: 'M2-S09',
    title: 'Intersectionality: One Person, Multiple Barriers',
    section: 4,
    blockType: 'video_guided_case_study',
    content: {
      paragraphs: [
        "You may already know that intersectionality means people can experience overlapping forms of exclusion.",
        "In CSO work, the deeper skill is learning where those overlaps appear across the project journey."
      ]
    },
    buttonText: 'Continue to duty-bearers and CSO roles'
  },
  'M2-S10': {
    id: 'M2-S10',
    title: 'Duty-Bearers, Supporting Actors, and CSO Roles',
    section: 4,
    blockType: 'actor_map_builder',
    content: {
      paragraphs: [
        "A barrier is rarely caused by one person or one institution.",
        "The next HRBA question is who has responsibility, who has influence, and what role a CSO can safely play."
      ]
    },
    buttonText: 'Continue to CSOs in the rights-based ecosystem'
  },
  'M2-S11': {
    id: 'M2-S11',
    title: 'CSOs in the Rights-Based Ecosystem',
    section: 4,
    blockType: 'role_card_classification',
    content: {
      paragraphs: [
        "A CSO is not the only actor in a rights-based situation.",
        "A rights-based CSO strengthens the conditions for people to access information, participate, claim rights, engage responsible actors, and seek response."
      ]
    },
    buttonText: 'Continue to using standards safely'
  },
  'M2-S12': {
    id: 'M2-S12',
    title: 'Using Human Rights Standards Safely',
    section: 5,
    blockType: 'safe_standards_use',
    content: {
      paragraphs: [
        "Human rights standards can help CSOs ask stronger questions and design better projects.",
        "This course does not train you to make legal judgments. It helps you use standards as practical reference points for better questions, safer planning, and stronger accountability."
      ],
      keyMessage: "Use human rights standards to guide better questions and safer action, not to make unsupported accusations."
    },
    buttonText: 'Continue to HRBA, SDGs, and Leave No One Behind'
  },
  'M2-S13': {
    id: 'M2-S13',
    title: 'HRBA, SDGs, and Leave No One Behind',
    section: 5,
    blockType: 'sdg_lnob_hrba_linkage',
    content: {
      paragraphs: [
        "Many CSOs already use the language of the SDGs and Leave No One Behind.",
        "A rights lens asks which change we support, who may be excluded, why, who has responsibility, and how people participate and seek accountability."
      ]
    },
    buttonText: 'Continue to participation'
  },
  'M2-S14': {
    id: 'M2-S14',
    title: 'Participation Is More Than Attendance',
    section: 5,
    blockType: 'participation_attendance_analysis',
    content: {
      paragraphs: [
        "Participation is one of the most common words in CSO work. It is also one of the easiest to overstate.",
        "A rights-based lens asks whether people were only present, or whether they had information, access, voice, influence, and response."
      ],
      keyMessage: "Attendance can show who was in the room. HRBA asks whether people could understand, speak, influence, and seek a response."
    },
    buttonText: 'Continue to participation practice'
  },
  'M2-S15': {
    id: 'M2-S15',
    title: 'Practice: Is This Meaningful Participation?',
    section: 5,
    blockType: 'participation_quality_practice',
    content: {
      paragraphs: [
        "Now practice judging participation quality. Do not only ask whether people attended or were consulted.",
        "Ask whether the process gave people information, access, voice, influence, and a response."
      ]
    },
    buttonText: 'Continue to accountability'
  },
  'M2-S16': {
    id: 'M2-S16',
    title: 'Accountability Is More Than a Complaint Box',
    section: 5,
    blockType: 'interactive_accountability_loop',
    content: {
      paragraphs: [
        "In many projects, accountability is reduced to one visible tool: a complaint box, hotline number, focal person, form, or feedback meeting.",
        "These tools can help. But HRBA asks whether people can actually understand, use, trust, and receive a response from the accountability process."
      ],
      keyMessage: "Accountability is not only a channel for receiving concerns. It is a response loop that people can understand, use safely, and trust."
    },
    buttonText: 'Continue to accountability practice'
  },
  'M2-S17': {
    id: 'M2-S17',
    title: 'Practice: Repair the Feedback Loop',
    section: 5,
    blockType: 'feedback_loop_repair_activity',
    content: {
      paragraphs: [
        "You have seen that accountability becomes weak when one or more parts of the loop are missing.",
        "Now you will repair a weak process by identifying what is broken and choosing the strongest practical fix."
      ],
      keyMessage: "A weak accountability process often looks functional from the outside. Repair starts by asking what people do not understand, cannot use safely, never hear back from, or do not see changed."
    },
    buttonText: 'Continue to power and exclusion'
  },
  'M2-S18': {
    id: 'M2-S18',
    title: 'Power and Exclusion: Who Can Participate, Speak, and Influence?',
    section: 6,
    blockType: 'exclusion_pathway_map',
    content: {
      paragraphs: [
        "Not everyone arrives at a decision space with the same power.",
        "HRBA asks us to notice how information, entry, understanding, voice, credibility, influence, and accountability shape participation before a final decision appears."
      ],
      keyMessage: "Exclusion is not only about who was absent. It is also about who was present but had less access, less safety, less legitimacy, less confidence, and less influence."
    },
    buttonText: 'Continue to tracing exclusion'
  },
  'M2-S19': {
    id: 'M2-S19',
    title: 'Practice: Trace the Exclusion Pathway',
    section: 6,
    blockType: 'exclusion_journey_builder',
    content: {
      paragraphs: [
        "A rights-based CSO does not stop at saying, “Some people were excluded.”",
        "Instead, the CSO asks where exclusion began, where it became stronger, and where a practical adjustment could make a difference."
      ],
      keyMessage: "When exclusion is traced step by step, the next action becomes clearer and more realistic."
    },
    buttonText: 'Continue to Module 2 synthesis'
  },
  'M2-S20': {
    id: 'M2-S20',
    title: 'Module 2 Synthesis, Resources',
    section: 7,
    blockType: 'seven_question_lens_synthesis',
    content: {
      paragraphs: [
        "You do not need to memorize every term from this module to use HRBA well.",
        "What matters more is learning how to pause and look at an ordinary project situation through a stronger lens."
      ],
      keyMessage: "The everyday rights lens helps CSOs move from quick assumptions to sharper questions."
    },
    buttonText: 'Continue to portfolio checkpoint'
  },
  'M2-S21': {
    id: 'M2-S21',
    title: 'Portfolio Checkpoint: My Everyday Rights Lens',
    section: 7,
    blockType: 'portfolio_checkpoint_lens_builder',
    content: {
      paragraphs: [
        "You have reached the end of Module 2. Before moving on, use the everyday rights lens one more time.",
        "This is not about getting a perfect answer. It is about practicing the habit of pausing and looking again."
      ],
      keyMessage: "A useful rights lens is one you can actually carry into meetings, designs, reviews, and everyday decisions."
    },
    buttonText: 'Continue to the Module 2 knowledge check'
  },
  'M2-S22': {
    id: 'M2-S22',
    title: 'Module 2 Knowledge Check',
    section: 7,
    blockType: 'mixed_knowledge_check',
    content: {
      paragraphs: [
        "This short knowledge check will help you confirm whether you can recognize and apply the core ideas from the module in realistic CSO situations.",
        "Focus on judgment, not memorization."
      ],
      keyMessage: "Check whether the lens is usable."
    },
    buttonText: 'Complete Module 2'
  },
  'M2-S23': {
    id: 'M2-S23',
    title: 'Module 2 Completion and Transition',
    section: 7,
    blockType: 'Completion badge / transition panel',
    content: {},
    buttonText: 'Start Module 3'
  }
};
