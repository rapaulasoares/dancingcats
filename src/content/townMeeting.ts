import type { Dimension } from './types';

/**
 * The town meeting: the new ending. Six rounds, seven answers. Every answer keeps
 * the id (R1 to R7) of the reasoning it measures, so scoring and the teacher
 * export keep working.
 * Card illustrations: docs/10-prompts-cartas-reuniao.md
 */

export type StepKind = 'pick' | 'map' | 'order' | 'scale' | 'sentence';

export interface StepOption {
  id: string;
  /** Short caption shown on the card. */
  label: string;
  /** Illustration in public/images. A placeholder is shown while the file is missing. */
  image?: string;
  /** map steps: where the pin sits on the picture, in percent from the top left. */
  at?: { x: number; y: number };
}

export interface SentenceSlot {
  id: string;
  options: { id: string; text: string }[];
  correct: string;
}

export interface MeetingStep {
  /** R1 to R7. Stored in the save as the key of the answer. */
  id: string;
  round: number;
  speaker: string;
  kind: StepKind;
  heading: string;
  prompt: string;
  /** pick, map, order (the cards to put in order) and scale (what goes on the scale). */
  options: StepOption[];
  /** sentence only: the words that fill the blanks, in order. */
  sentence?: { before: string; slots: SentenceSlot[]; joins: string[]; after: string };
  /**
   * What the right answer is. pick/map/scale: an option id. order: option ids joined by ",".
   * sentence: one chosen option id per slot, joined by ",".
   */
  correct: string;
  dimension: Dimension;
  evidenceRefs: string[];
}

export const ANSWER_SEPARATOR = ',';

export const townMeeting: MeetingStep[] = [
  {
    id: 'R1',
    round: 1,
    speaker: 'Dr. Ana',
    kind: 'pick',
    heading: 'What is making them sick?',
    prompt: 'What is making the cats and the people of Vila do Sol sick?',
    options: [
      { id: 'a', label: 'A contagious illness', image: 'card-virus.webp' },
      { id: 'b', label: 'The rats', image: 'card-rats.webp' },
      { id: 'c', label: 'A heavy metal in the fish', image: 'card-metal-fish.webp' },
      { id: 'd', label: 'Algae in the bay', image: 'card-algae.webp' },
      { id: 'e', label: 'A curse on the town', image: 'card-spirit.webp' },
    ],
    correct: 'c',
    dimension: 'evidenceAnalysis',
    evidenceRefs: ['SCI-09', 'CLI-01', 'MKT-02', 'MKT-03', 'RES-03', 'SCI-05', 'CLI-02', 'RES-02', 'MKT-04', 'HAR-02', 'SCI-06', 'ROS-02'],
  },
  {
    id: 'R2',
    round: 2,
    speaker: 'Maria',
    kind: 'pick',
    heading: 'How does it reach us?',
    prompt: 'How does the harmful substance reach the people of Vila do Sol?',
    options: [
      { id: 'a', label: 'The tap water', image: 'card-tap-water.webp' },
      { id: 'b', label: 'The sea, through the skin', image: 'card-sea-skin.webp' },
      { id: 'c', label: 'The air from the chimney', image: 'card-chimney-air.webp' },
      { id: 'd', label: 'The fish on our plates', image: 'card-fish-plate.webp' },
    ],
    correct: 'd',
    dimension: 'evidenceAnalysis',
    evidenceRefs: ['CLI-03', 'RES-01', 'RES-02', 'HAR-03', 'SQ-06', 'SQ-07', 'MKT-04', 'SCI-01', 'SCI-04', 'SCI-09', 'CLI-05', 'CLI-06', 'TUC-05', 'SQ-05'],
  },
  {
    id: 'R3',
    round: 3,
    speaker: 'Carlos',
    kind: 'map',
    heading: 'Where does it come from?',
    prompt: 'Tap the place on the map where the contamination comes from.',
    // The picture map-bay-sites.webp shows the four places of the mud sampling. Ids: a bay, b river, c channel, d boat yard.
    options: [
      { id: 'a', label: 'The open bay', at: { x: 50, y: 56 } },
      { id: 'b', label: 'The river mouth', at: { x: 16, y: 34 } },
      { id: 'c', label: 'The channel at the north point', at: { x: 80, y: 24 } },
      { id: 'd', label: 'The boat-repair yard', at: { x: 22, y: 78 } },
    ],
    correct: 'c',
    dimension: 'systemsThinking',
    evidenceRefs: ['SCI-10', 'TUC-03', 'TUC-06', 'HAR-07', 'HAR-05', 'TUC-08', 'SQ-02', 'SCI-06', 'SCI-09'],
  },
  {
    id: 'R4',
    round: 4,
    speaker: 'Mrs. Silva',
    kind: 'order',
    heading: 'And the rats?',
    prompt: 'Put the three cards in the order in which things happened.',
    options: [
      { id: 'sick', label: 'The cats get sick', image: 'card-cats-sick.webp' },
      { id: 'fewer', label: 'There are fewer cats', image: 'card-fewer-cats.webp' },
      { id: 'more', label: 'There are more rats', image: 'card-more-rats.webp' },
    ],
    correct: 'sick,fewer,more',
    dimension: 'systemsThinking',
    evidenceRefs: ['SQ-01', 'SCI-02', 'MKT-03', 'MKT-05', 'RES-04', 'SQ-08'],
  },
  {
    id: 'R5',
    round: 5,
    speaker: 'João',
    kind: 'pick',
    heading: 'Who can we trust? João',
    prompt: 'João works at Tucano Industrial and his family is healthy. What does that tell us?',
    options: [
      { id: 'a', label: 'Tucano cannot be the problem', image: 'card-factory-clean.webp' },
      { id: 'b', label: 'Where you work does not decide who gets sick', image: 'card-family-dinner.webp' },
      { id: 'c', label: 'João is hiding something', image: 'card-fingers-crossed.webp' },
      { id: 'd', label: 'Workers are protected by their gear', image: 'card-worker-protected.webp' },
    ],
    correct: 'b',
    dimension: 'logicalReasoning',
    evidenceRefs: ['SQ-05', 'SQ-06', 'SQ-07', 'ECO-03', 'ECO-04', 'TUC-05', 'CLI-03'],
  },
  {
    id: 'R6',
    round: 5,
    speaker: 'Mr. Santos',
    kind: 'scale',
    heading: 'Who can we trust? The balance',
    prompt: "Mr. Santos holds up two papers. Which one weighs more as evidence?",
    // b: the company's own report. c: the independent analyses of the Science Center.
    options: [
      { id: 'b', label: "The company's own report", image: 'card-company-report.webp' },
      { id: 'c', label: 'Independent analyses by the Science Center', image: 'card-independent-lab.webp' },
    ],
    correct: 'c',
    dimension: 'sourceEvaluation',
    evidenceRefs: ['TUC-02', 'SCI-07', 'TUC-01', 'SCI-10'],
  },
  {
    id: 'R7',
    round: 6,
    speaker: 'Prof. Roberto',
    kind: 'sentence',
    heading: 'The conclusion',
    prompt: 'Prof. Roberto asks the final question: complete the sentence that explains the case.',
    options: [],
    sentence: {
      before: 'The cats and people got sick because the',
      joins: ['released through', 'built up in the'],
      after: '.',
      slots: [
        {
          id: 'substance',
          correct: 'c',
          options: [
            { id: 'a', text: 'germ' },
            { id: 'b', text: 'algae poison' },
            { id: 'c', text: 'heavy metal' },
            { id: 'd', text: "sea's anger" },
          ],
        },
        {
          id: 'source',
          correct: 'c',
          options: [
            { id: 'a', text: "the rats' waste" },
            { id: 'b', text: "the boat yard's paint" },
            { id: 'c', text: "the factory's channel" },
            { id: 'd', text: 'the river' },
          ],
        },
        {
          id: 'carrier',
          correct: 'd',
          options: [
            { id: 'a', text: 'tap water they drank' },
            { id: 'b', text: 'bites from rats' },
            { id: 'c', text: 'chimney air they breathed' },
            { id: 'd', text: 'fish they ate' },
          ],
        },
      ],
    },
    correct: 'c,c,d',
    dimension: 'logicalReasoning',
    evidenceRefs: ['TUC-03', 'SCI-10', 'SCI-09', 'SCI-01', 'SCI-04', 'CLI-03', 'CLI-01', 'SCI-07'],
  },
];

export const stepById: Record<string, MeetingStep> = Object.fromEntries(townMeeting.map((s) => [s.id, s]));

/** Rounds, as shown in the progress bar. Round 5 has two answers. */
export const ROUND_COUNT = 6;
