import type { Dimension } from './types';

/**
 * The town meeting: the new ending. Six rounds, six answers. Every answer keeps
 * the id (R1 to R4, R6, R7; R5 was removed) of the reasoning it measures, so scoring and the teacher
 * export keep working.
 * Card illustrations: docs/10-prompts-cartas-reuniao.md
 */

export type StepKind = 'pick' | 'map' | 'order' | 'scale' | 'sentence' | 'proof' | 'inference';

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
  /**
   * What Whatson Urmind says once the answer is locked. Never says which answer was right.
   * wrongBy: a more pointed comment for a particular wrong answer (an option id; for the sentence, the id of the first wrong blank).
   */
  whatson: { right: string; wrong: string; wrongBy?: Record<string, string> };
  /** pick, map, order (the cards to put in order) and scale (what goes on the scale). */
  options: StepOption[];
  /** sentence only: the words that fill the blanks, in order. */
  sentence?: { before: string; slots: SentenceSlot[]; joins: string[]; after: string };
  /**
   * What the right answer is. pick/map/scale: an option id. order: option ids joined by ",".
   * sentence: one chosen option id per slot, joined by ",".
   * inference: one "clueId:cardId" pair per clue shown in the proof, joined by "," (or "skip" when none of them has thoughts to choose from).
   * proof: up to three evidence ids from the player's own board, joined by "," (or "none"). Right when at least two of them
   * (or all, if fewer were picked) are in evidenceRefs; `correct` only lists the best clues, for the review.
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
    whatson: {
      "right": "Exactly! The laboratory found heavy metal in the blood and tissues of the cat and the fish, and it attacks the nervous system. That explains the stumbling and the dancing.",
      "wrong": "Think about what the laboratory found in the blood and tissues of the cat and the fish.",
      "wrongBy": {
        "a": "Contagious illnesses spread to the people who care for the sick. Who looked after the sick, and who stayed well?",
        "b": "The rats and the illness appeared at about the same time. Look again at which came first.",
        "d": "The algae did multiply in January. Check when the first strange fish were seen, and what the laboratory found.",
        "e": "The old stories deserve respect, but look for what can be measured. What did the laboratory find?"
      }
    },
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
    whatson: {
      "right": "Yes! Heavy metal builds up in fish and shellfish, and then in the people who eat them often. The cats were eating fish scraps too.",
      "wrong": "Think about what the sick families and the sick cats have in common.",
      "wrongBy": {
        "a": "Check where the town's water comes from, and who drinks it.",
        "b": "Some people who never go near the sea became sick. Look at what they have in common with the fishing families.",
        "c": "Look at where the patients live, and at the health of the people who work in the factory all day.",
        "e": "Rats and illness are both in town. Look at what the sick people and the sick animals have in common."
      }
    },
    options: [
      { id: 'a', label: 'The tap water', image: 'card-tap-water.webp' },
      { id: 'b', label: 'The sea, through the skin', image: 'card-sea-skin.webp' },
      { id: 'c', label: 'The air from the chimney', image: 'card-chimney-air.webp' },
      { id: 'd', label: 'The fish on our plates', image: 'card-fish-plate.webp' },
      { id: 'e', label: "The rats' urine", image: 'card-rat-urine.webp' },
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
    whatson: {
      "right": "Right. The mud and water samples were highest in the channel and at its mouth, and the Science Center took them outside the factory grounds. They trace back to Tucano's discharge.",
      "wrong": "Look again at the mud and water samples. Where were the highest amounts?",
      "wrongBy": {
        "a": "The animals were found in the bay, but the highest amounts were measured upstream of it. Follow the numbers back to where they start.",
        "b": "Look at the river mouth on the mud sampling map.",
        "d": "Look at the boat-repair yard on the mud sampling map.",
        "e": "The rats live in town, but the samples were taken from the mud and water of the bay. Where were the highest amounts?"
      }
    },
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
    whatson: {
      "right": "Good thinking! When the cats got sick and died, there were fewer predators to hunt the rats. Take away a predator and another species can explode: that is an imbalance in the ecosystem.",
      "wrong": "Careful: correlation does not mean causation. The rats increased and so did the illness, but the cats were getting sick and disappearing before the rats multiplied."
    },
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
    prompt: "Our own laboratory says Tucano's effluent is clean, and many workers depend on this company. Why should the town believe you?",
    hint: 'Tap the paper that weighs more as evidence.',
    whatson: {
      "right": "Well argued! The company tested its own water, while the Science Center took its samples outside the factory grounds. That does not make the company's report false, only less independent.",
      "wrong": "The company's report may be true, but it was collected and tested by the company being investigated. Who took the independent samples?"
    },
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
    id: 'P1',
    round: 6,
    speaker: 'Prof. Roberto',
    kind: 'proof',
    heading: 'Show your proof',
    prompt: 'You have told us what you think. Now show us: which clues from your wall prove it?',
    hint: 'Tap up to three clues from your Evidence Board, then press Answer.',
    whatson: {
      right:
        "Those clues hold up. Measurements in the animals, in the bay and in the factory, and what the sick and the healthy families eat, all point the same way.",
      wrong:
        "Some of those clues do not show how the metal got from Tucano to the cats. Look for the ones that measured it, in the animals, in the mud and water, and in what the factory uses. Or for the ones that show what the sick families eat, and what the healthy ones eat.",
    },
    options: [],
    correct: 'SCI-09,SCI-10,TUC-03',
    dimension: 'evidenceAnalysis',
    // The clues that really show the chain; any of these counts.
    // Measurements (animals, bay, factory), how the metal builds up, and what the sick and the healthy families eat.
    evidenceRefs: [
      'SCI-09', 'SCI-10', 'TUC-03', 'TUC-08', 'SCI-04', 'SCI-01',
      'RES-01', 'RES-02', 'HAR-03', 'SQ-06', 'SQ-07', 'SQ-05', 'MKT-04',
    ],
  },
  {
    id: 'P2',
    round: 6,
    speaker: 'Prof. Roberto',
    kind: 'inference',
    heading: 'What do the clues tell you?',
    prompt: 'Fine, but how do you know? What do these clues really tell us?',
    hint: 'For each clue, tap what it tells you.',
    whatson: {
      right: 'Sharp thinking. Each clue says something specific, and you saw what it really shows.',
      wrong: 'A clue only shows what it shows. Check each thought against the clue itself.',
    },
    options: [],
    correct: '',
    dimension: 'logicalReasoning',
    evidenceRefs: [],
  },
  {
    id: 'R7',
    round: 6,
    speaker: 'Prof. Roberto',
    kind: 'sentence',
    heading: 'The conclusion',
    prompt: 'So, investigator, tell the whole town: why did the cats and the people get sick?',
    hint: 'Complete the sentence: tap a blank, then a word.',
    whatson: {
      "right": "That is the whole chain: the heavy metal left Tucano's wastewater, built up in the fish, and poisoned the animals and the people who ate them. Well done, investigator!",
      "wrong": "Follow the whole chain once more: what was found, where it started, and how it reached the cats and the families.",
      "wrongBy": {
        "substance": "Look again at what the laboratory found in the blood and tissues of the animals.",
        "source": "Where were the highest amounts measured? Follow them back to where they start.",
        "carrier": "Think about what the cats and the affected families all ate."
      }
    },
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
