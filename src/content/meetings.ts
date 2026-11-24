import { BALANCE } from './balance';
import type { Meeting } from './types';

/**
 * Talks with Whatson Urmind, the player's thinking partner: a friendly sidekick, in the
 * way Dr. Watson is to Sherlock Holmes. His name says what he asks ("what's on ur mind?"). He only asks; nothing here is
 * graded and nothing is revealed.
 */
export const partner = {
  name: 'Whatson Urmind',
  portrait: 'char-partner.webp',
  greeting: "What's on your mind? Elementary, my dear investigator!",
};

export const meetings: Meeting[] = [
  {
    id: 'meeting1',
    title: 'First talk',
    partnerSays: 'You have gathered a good deal already. Let us think it through together.',
    availableWhen: { evidenceCount: BALANCE.meeting1Evidence },
    prompts: [
      { id: 'm1-pattern', text: 'What pattern are you beginning to notice?' },
      { id: 'm1-strongest', text: 'Which explanation currently seems strongest?' },
      { id: 'm1-missing', text: 'What information are you still missing?' },
      { id: 'm1-important', text: 'Which evidence seems most important?' },
    ],
  },
  {
    id: 'meeting2',
    title: 'Second talk',
    partnerSays: 'Ah, the plot thickens! Now that we have more to go on, let us test our ideas.',
    availableWhen: { anyOf: [{ evidenceCount: BALANCE.meeting2Evidence }, { hasEvidence: ['SCI-09'] }] },
    prompts: [
      { id: 'm2-contagious', text: 'Which evidence makes a contagious disease less likely?' },
      { id: 'm2-common', text: 'What might the affected cats and the affected families have in common?' },
      { id: 'm2-trust', text: 'Which source would you trust most? Why?' },
      { id: 'm2-test', text: 'What additional evidence would help test your hypothesis?' },
    ],
  },
];
