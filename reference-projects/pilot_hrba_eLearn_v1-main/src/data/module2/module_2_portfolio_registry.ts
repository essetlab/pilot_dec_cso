export interface PortfolioField {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export const safetyHelperText = "Keep this safe and general. Do not include names, real cases, active complaints, safeguarding details, legal disputes, political details, confidential documents, beneficiary lists, or raw organizational data.";

export const portfolioFields: Record<string, PortfolioField> = {
  m2_issue_area: {
    id: 'm2_issue_area',
    label: 'Broad CSO issue or work area',
    type: 'select',
    required: true,
    options: [
      "Access to services",
      "Community participation",
      "Feedback or complaint handling",
      "Inclusion of excluded groups",
      "Disability access",
      "Youth participation",
      "Women’s participation",
      "Information sharing",
      "Community dialogue",
      "Project planning or design",
      "MEAL, evidence, or learning",
      "Advocacy or public engagement",
      "Internal CSO practice",
      "Other broad area",
      "I am still reflecting"
    ]
  },
  m2_affected_groups: {
    id: 'm2_affected_groups',
    label: 'Who may be affected?',
    type: 'multiselect',
    required: true,
    options: [
      "Community members using a service",
      "Women or girls",
      "Young people",
      "Persons with disabilities",
      "Older persons",
      "Displaced or mobile groups",
      "People in remote areas",
      "People facing language or information barriers",
      "Community volunteers",
      "CSO members or partners",
      "Other broad group",
      "Not sure yet"
    ]
  },
  m2_rights_dimensions: {
    id: 'm2_rights_dimensions',
    label: 'What rights dimensions may be involved?',
    type: 'multiselect',
    required: true,
    options: [
      "Dignity",
      "Equality and non-discrimination",
      "Participation",
      "Access to information",
      "Safety",
      "Accountability",
      "Access to services",
      "Voice in decisions",
      "Availability of support or services",
      "Accessibility of support or services",
      "Acceptability of support or services",
      "Quality of support or services",
      "Not sure yet"
    ]
  },
  m2_exclusion_barriers: {
    id: 'm2_exclusion_barriers',
    label: 'Who may be excluded or facing barriers?',
    type: 'multiselect',
    required: true,
    options: [
      "Physical access barriers",
      "Language barriers",
      "Information barriers",
      "Timing or transport barriers",
      "Cost barriers",
      "Disability-related barriers",
      "Gender-related barriers",
      "Age-related barriers",
      "Social norms or stigma",
      "Fear of speaking",
      "Low trust in feedback systems",
      "Lack of safe participation space",
      "Not sure yet"
    ]
  },
  m2_information_gaps: {
    id: 'm2_information_gaps',
    label: 'What information is missing?',
    type: 'multiselect',
    required: true,
    options: [
      "Who is affected?",
      "Who is not participating?",
      "Why are some groups excluded?",
      "What information do people already have?",
      "What do people understand or not understand?",
      "What feedback has been received?",
      "What responsible actors are involved?",
      "What services or decisions are affected?",
      "What risks need to be considered?",
      "Not sure yet"
    ]
  },
  m2_responsible_actors: {
    id: 'm2_responsible_actors',
    label: 'Who may have responsibility to respond?',
    type: 'multiselect',
    required: true,
    options: [
      "Local public office",
      "Service provider",
      "School or health facility",
      "Local administration",
      "Community structure",
      "CSO or implementing partner",
      "Donor or funding partner",
      "Coordination platform",
      "Traditional or informal community actor",
      "Other responsible actor",
      "Not sure yet"
    ]
  },
  m2_improvement_action: {
    id: 'm2_improvement_action',
    label: 'One safe improvement action',
    type: 'select',
    required: true,
    options: [
      "Ask who is missing before planning the activity",
      "Improve accessibility of information",
      "Adjust meeting time, location, or format",
      "Create safer ways to give feedback",
      "Use simpler language when explaining decisions",
      "Check whether different groups experience the activity differently",
      "Map responsible actors before proposing solutions",
      "Add one rights-related question to project planning",
      "Review one service or activity using availability, accessibility, acceptability, and quality",
      "Discuss the issue internally using anonymized examples only",
      "I am still deciding"
    ]
  },
  m2_private_note: {
    id: 'm2_private_note',
    label: 'Optional private note',
    type: 'textarea',
    required: false,
    placeholder: "Write your private reflections here..."
  }
};

export const carryForwardMap = {
  M3: "Use selected rights dimensions and barriers when applying participation, inclusion, accountability, transparency, empowerment, and legality.",
  M4: "Use affected group categories, barriers, and responsible actor categories to deepen rights-holder/duty-bearer analysis.",
  M5: "Use issue area, information gaps, and improvement action as starting points for problem analysis and objective design.",
  M7: "Use information gaps to design safer, more rights-aware evidence questions.",
  M9: "Use selected improvement action as one possible 90-day HRBA action-plan input."
};
