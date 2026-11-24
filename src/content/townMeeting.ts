import type { Dimension } from './types';

/**
 * The town meeting: the new ending. Six rounds, six answers. Every answer keeps
 * the id (R1 to R4, R6, R7; R5 was removed) of the reasoning it measures, so scoring and the teacher
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
  /** R1 to R4, R6 or R7. Stored in the save as the key of the answer. */
  id: string;
  round: number;
  speaker: string;
  kind: StepKind;
  heading: string;
  /** What the character says: a real question from a resident of Vila do Sol. */
  prompt: string;
  /** A small instruction shown under the question. */
  hint: string;
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
    prompt: "I have treated these patients, and I have seen the sick cats. Tell me, what is making them all sick?",
    hint: 'Tap one card.',
    options: [
      { id: 'a', label: 'A contagious illness', image: 'card-virus.webp' },
      { id: 'b', label: 'The rats', image: 'card-rats.webp' },
      { id: 'c', label: 'Heavy metal contamination', image: 'card-metal-fish.webp' },
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
    prompt: 'My family is sick. How is this poison reaching us?',
    hint: 'Tap one card.',
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
    prompt: 'Everyone says the bay is dirty, but where is it coming from? Show us on the map!',
    hint: 'Tap a place on the map.',
    // The picture map-bay-sites.webp shows the four places of the mud sampling. Ids: a bay, b river, c channel, d boat yard, e fishing community (for whoever blames the rats).
    options: [
      { id: 'a', label: 'The open bay', at: { x: 50, y: 56 } },
      { id: 'b', label: 'The river mouth', at: { x: 16, y: 34 } },
      { id: 'c', label: "North channel: Tucano's discharge", at: { x: 80, y: 24 } },
      { id: 'd', label: 'The boat-repair yard', at: { x: 20, y: 80 } },
      { id: 'e', label: 'The fishing community', at: { x: 60, y: 80 } },
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
    prompt: 'What about the rats? We see them everywhere, and our cats are sick too!',
    hint: 'Tap the cards in the order things happened. Tap a card again to take it back.',
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
    id: 'R6',
    round: 5,
    speaker: 'Mr. Santos',
    kind: 'scale',
    heading: 'Who can we trust?',
    prompt: "Our own laboratory says Tucano's water is clean. Why should the town believe your papers over ours?",
    hint: 'Tap the paper that weighs more as evidence.',
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
    prompt: 'So, investigator, tell the whole town: why did the cats and the people get sick?',
    hint: 'Complete the sentence: tap a blank, then a word.',
    options: [],
    sentence: {
      before: 'The cats and people got sick because the',
      joins: ['from', 'built up in the'],
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
            { id: 'c', text: "Tucano's wastewater" },
            { id: 'd', text: "the river's water" },
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

/** Rounds, as shown in the progress bar. Each round has one answer. */
export const ROUND_COUNT = 6;
