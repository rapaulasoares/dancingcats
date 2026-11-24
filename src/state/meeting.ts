import { ANSWER_SEPARATOR, townMeeting, type MeetingStep } from '../content/townMeeting';

/** Trust of the town in the investigators: starts in the middle, moves with every answer. */
export const TRUST_START = 50;
const TRUST_RIGHT = 10;
const TRUST_STREAK_BONUS = 3;
const TRUST_STREAK_CAP = 3;
const TRUST_WRONG = 10;

/** Share of the answers that must be right for the case to count as solved. */
export const SOLVED_SHARE = 0.7;

/** True when the answer is something the step can accept. */
export function isValidAnswer(step: MeetingStep, answer: string): boolean {
  const parts = answer.split(ANSWER_SEPARATOR);
  switch (step.kind) {
    case 'pick':
    case 'map':
    case 'scale':
      return step.options.some((o) => o.id === answer);
    case 'order': {
      const ids = step.options.map((o) => o.id);
      return parts.length === ids.length && new Set(parts).size === ids.length && parts.every((p) => ids.includes(p));
    }
    case 'sentence': {
      const slots = step.sentence?.slots ?? [];
      return parts.length === slots.length && slots.every((slot, i) => slot.options.some((o) => o.id === parts[i]));
    }
  }
}

export const isRight = (step: MeetingStep, answer: string | undefined) => answer === step.correct;

export interface MeetingStatus {
  /** 0 to 100. */
  trust: number;
  /** Right answers in a row, counting back from the last answer. */
  streak: number;
  bestStreak: number;
  answered: number;
  right: number;
  /** Case solved: the first round and the map are right and at least 70% of all answers are. */
  solved: boolean;
}

/** Computed from the answers alone, so nothing else needs to be saved. */
export function meetingStatus(answers: Record<string, string>): MeetingStatus {
  let trust = TRUST_START;
  let streak = 0;
  let bestStreak = 0;
  let answered = 0;
  let right = 0;
  for (const step of townMeeting) {
    const answer = answers[step.id];
    if (answer === undefined) continue;
    answered += 1;
    if (isRight(step, answer)) {
      right += 1;
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
      trust += TRUST_RIGHT + TRUST_STREAK_BONUS * Math.min(streak - 1, TRUST_STREAK_CAP);
    } else {
      streak = 0;
      trust -= TRUST_WRONG;
    }
    trust = Math.min(100, Math.max(0, trust));
  }
  const key = (id: string) => answers[id] === townMeeting.find((s) => s.id === id)?.correct;
  const solved = answered === townMeeting.length && key('R1') && key('R3') && right / townMeeting.length >= SOLVED_SHARE;
  return { trust, streak, bestStreak, answered, right, solved };
}

/** The answer as words, for the profile and the review. */
export function describeAnswer(step: MeetingStep, answer: string | undefined): string {
  if (!answer) return 'No answer';
  const parts = answer.split(ANSWER_SEPARATOR);
  const label = (id: string) => step.options.find((o) => o.id === id)?.label ?? id;
  if (step.kind === 'order') return parts.map(label).join(' → ');
  if (step.kind === 'scale') return `${label(answer)} weighs more`;
  if (step.kind === 'sentence' && step.sentence) {
    const { before, slots, joins, after } = step.sentence;
    const word = (i: number) => slots[i].options.find((o) => o.id === parts[i])?.text ?? '…';
    return `${before} ${word(0)} ${joins[0]} ${word(1)} ${joins[1]} ${word(2)}${after}`;
  }
  return label(answer);
}
