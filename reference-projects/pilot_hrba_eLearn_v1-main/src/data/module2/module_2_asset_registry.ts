export interface AssetSpec {
  id: string;
  placement: string;
  purpose: string;
  required: boolean;
  filename: string;
  altText: string;
  type: 'image' | 'svg' | 'pdf' | 'placeholder';
}

export const assetRegistry: Record<string, AssetSpec> = {
  'A-M2-01': {
    id: 'A-M2-01',
    placement: 'M2-S1-01',
    purpose: 'Opening scenario illustration for a fictional CSO livelihood training review.',
    required: true,
    filename: '/assets/hrba/module-2/screen-2-1/M2_S2_1_VIS_01_ScenarioIllustration.png',
    altText: 'Illustration of a local CSO project team reviewing a livelihood training activity and noticing that attendance patterns may show barriers for different community groups.',
    type: 'image'
  },
  'A-M2-02': {
    id: 'A-M2-02',
    placement: 'M2-S2-01',
    purpose: 'Everyday human rights scene',
    required: false,
    filename: 'placeholder-everyday-human-rights-scene',
    altText: 'Ordinary community settings such as a school, health post, meeting space, and public service point where dignity, fairness, participation, and accountability may arise.',
    type: 'placeholder'
  },
  'A-M2-03': {
    id: 'A-M2-03',
    placement: 'M2-S3-02',
    purpose: 'Rights dimensions hotspot/labeled graphic',
    required: true,
    filename: 'hrba-m02-everyday-rights-hotspot.svg',
    altText: 'Fictional community meeting scene showing information, participation, accessibility, equality, safety and dignity, and accountability labels.',
    type: 'svg'
  },
  'A-M2-04': {
    id: 'A-M2-04',
    placement: 'M2-S3-04',
    purpose: 'Everyday Rights Mapping Worksheet',
    required: true,
    filename: 'hrba-m02-everyday-rights-map.pdf',
    altText: 'Worksheet with fields for issue, affected groups, rights dimensions, excluded groups, information gaps, and responsible actors.',
    type: 'pdf'
  },
  'A-M2-05': {
    id: 'A-M2-05',
    placement: 'M2-S4-02',
    purpose: 'Four characteristics flashcard icons',
    required: false,
    filename: 'hrba-m02-rights-characteristics-cards.svg',
    altText: 'Icons representing universal, inalienable, indivisible, and interdependent rights.',
    type: 'svg'
  },
  'A-M2-06': {
    id: 'A-M2-06',
    placement: 'M2-S5-02',
    purpose: 'Rights type icons/diagram',
    required: false,
    filename: 'hrba-m02-rights-types-diagram.svg',
    altText: 'Icons representing civil, political, economic, social, cultural, and collective rights.',
    type: 'svg'
  },
  'A-M2-07': {
    id: 'A-M2-07',
    placement: 'M2-S6-02',
    purpose: 'Human rights systems timeline',
    required: true,
    filename: 'hrba-m02-human-rights-systems-timeline.svg',
    altText: 'Timeline showing international, African, Ethiopian, organizational, and community accountability levels.',
    type: 'svg'
  },
  'A-M2-08': {
    id: 'A-M2-08',
    placement: 'M2-S6-04',
    purpose: 'Accessible community meeting illustration',
    required: false,
    filename: 'placeholder-accessible-community-meeting',
    altText: 'Fictional CSO team checking whether a community meeting is accessible, inclusive, safe, and understandable.',
    type: 'placeholder'
  },
  'A-M2-09': {
    id: 'A-M2-09',
    placement: 'M2-S7-01',
    purpose: 'Rights idea to CSO action process graphic',
    required: true,
    filename: 'hrba-m02-rights-in-project-cycle.svg',
    altText: 'Six-step process from identifying an issue to rights dimensions, affected groups, responsible actors, CSO contribution, and learning evidence.',
    type: 'svg'
  },
  'A-M2-10': {
    id: 'A-M2-10',
    placement: 'M2-S7-02',
    purpose: 'Feedback loop illustration',
    required: false,
    filename: 'placeholder-feedback-loop-illustration',
    altText: 'Illustration showing that accountability requires receiving, responding to, explaining, and learning from feedback.',
    type: 'placeholder'
  },
  'A-M2-11': {
    id: 'A-M2-11',
    placement: 'M2-S7-03',
    purpose: 'Rights Relevance Worksheet',
    required: true,
    filename: 'hrba-m02-rights-relevance-worksheet.pdf',
    altText: 'Worksheet with fields for project, rights-holders, exclusion, rights dimensions, duty-bearers, participation, accountability, safety, and improvement action.',
    type: 'pdf'
  },
  'A-M2-12': {
    id: 'A-M2-12',
    placement: 'M2-S7-08',
    purpose: 'Module 2 wrap-up visual',
    required: false,
    filename: 'placeholder-module-2-wrap-up',
    altText: 'Learner completing Module 2 and preparing to continue to HRBA principles in practice.',
    type: 'placeholder'
  }
};
