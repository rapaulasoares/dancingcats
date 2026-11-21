import { BALANCE } from './balance';
import type { QuestionClass } from './types';

/**
 * Investigator Tips. A tip appears the first time a team chooses each weak
 * class; never more than one per interview; at most MAX_TIPS per game.
 */
export const MAX_TIPS = BALANCE.maxTips;

export const tipsByClass: Partial<Record<QuestionClass, string>> = {
  vague: 'Broad questions often produce broad answers.',
  opinion: 'Try asking what someone OBSERVED instead of asking them to guess the cause.',
  leading: 'Careful — your question suggested an answer. Could you ask it more neutrally?',
  assumption: 'That question took something for granted. What do you actually know so far?',
  irrelevant: "That answer didn't give you much evidence. Try asking something more specific.",
  humorous: 'That one was for fun. You have a limited number of questions — choose the next one carefully.',
};

/** A specific question can override the tip for its class. */
export const tipsByQuestion: Record<string, string> = {
  C2: 'Funny question. Not very useful evidence, though.',
};
