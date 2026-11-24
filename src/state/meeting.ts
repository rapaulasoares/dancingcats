import { evidenceById } from '../content/evidence';
import { inferences } from '../content/inferences';
import { ANSWER_SEPARATOR, townMeeting, type MeetingStep } from '../content/townMeeting';

/** Trust of the town in the investigators: starts in the middle, moves with every answer. */
export const TRUST_START = 50;
const TRUST_RIGHT = 10;
const TRUST_STREAK_BONUS = 3;
const TRUST_STREAK_CAP = 3;
const TRUST_WRONG = 10;

/** Share of the answers that must be right for the case to count as solved. */
export const SOLVED_SHARE = 0.7;

/** The clues shown as proof that have thoughts to choose from, in the order they were picked. */
export function cluesNeedingThoughts(proofAnswer: string | undefined): string[] {
  if (!proofAnswer || proofAnswer === 'none') return [];
  return proofAnswer.split(ANSWER_SEPARATOR).filter((id) => !!inferences[id]);
}

/** "clueId:cardId" pairs of an inference answer. */
export function inferencePairs(answer: string): { clue: string; card: string }[] {
  return answer.split(ANSWER_SEPARATOR).map((pair) => {
    const [clue, card] = pair.split(':');
    return { clue, card };
  });
}

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
    case 'proof':
      return answer === 'none' || (parts.length >= 1 && parts.length <= 3 && new Set(parts).size === parts.length && parts.every((id) => !!evidenceById[id]));
    case 'multi':
      return parts.length === (step.pickCount ?? 1) && new Set(parts).size === parts.length && parts.every((id) => step.options.some((o) => o.id === id));
    case 'inference': {
      if (answer === 'skip') return true;
      const pairs = inferencePairs(answer);
      return (
        pairs.length >= 1 &&
        pairs.length <= 3 &&
        new Set(pairs.map((p) => p.clue)).size === pairs.length &&
        pairs.every((p) => !!inferences[p.clue]?.cards.some((c) => c.id === p.card))
      );
    }
    case 'sentence': {
      const slots = step.sentence?.slots ?? [];
      return parts.length === slots.length && slots.every((slot, i) => slot.options.some((o) => o.id === parts[i]));
    }
  }
}

/** True when the answer is the right one. A proof is right when most of the clues shown really support the conclusion. */
export function isRight(step: MeetingStep, answer: string | undefined): boolean {
  if (step.kind === 'proof') {
    if (!answer || answer === 'none') return false;
    const picked = answer.split(ANSWER_SEPARATOR);
    const hits = picked.filter((id) => step.evidenceRefs.includes(id)).length;
    return hits >= Math.min(2, picked.length);
  }
  if (step.kind === 'multi') {
    if (!answer) return false;
    return [...answer.split(ANSWER_SEPARATOR)].sort().join(ANSWER_SEPARATOR) === [...step.correct.split(ANSWER_SEPARATOR)].sort().join(ANSWER_SEPARATOR);
  }
  if (step.kind === 'inference') {
    if (!answer || answer === 'skip') return false;
    const pairs = inferencePairs(answer);
    const supported = pairs.filter((p) => p.card === 'a').length;
    return supported >= Math.ceil(pairs.length / 2);
  }
  return answer === step.correct;
}

/** A step the player did not need to answer (none of the clues shown had thoughts to choose from). */
export const isSkipped = (answer: string | undefined) => answer === 'skip';

export interface MeetingStatus {
  /** 0 to 100. */
  trust: number;
  /** Right answers in a row, counting back from the last answer. */
  streak: number;
  bestStreak: number;
  /** Steps answered, including skipped ones. */
  answered: number;
  /** Steps answered and not skipped. */
  counted: number;
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
  let counted = 0;
  let right = 0;
  for (const step of townMeeting) {
    const answer = answers[step.id];
    if (answer === undefined) continue;
    answered += 1;
    // A skipped step is neutral: no trust gained or lost, and it does not count as right or wrong.
    if (isSkipped(answer)) continue;
    counted += 1;
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
  const key = (id: string) => answers[id] !== undefined && answers[id] === townMeeting.find((s) => s.id === id)?.correct;
  const solved = answered === townMeeting.length && key('R1') && key('R3') && counted > 0 && right / counted >= SOLVED_SHARE;
  return { trust, streak, bestStreak, answered, counted, right, solved };
}

/** The answer as words, for the profile and the review. */
export function describeAnswer(step: MeetingStep, answer: string | undefined): string {
  if (!answer) return 'No answer';
  if (answer === 'skip') return 'Not needed';
  const parts = answer.split(ANSWER_SEPARATOR);
  const label = (id: string) => step.options.find((o) => o.id === id)?.label ?? id;
  if (step.kind === 'order') return parts.map(label).join(' → ');
  if (step.kind === 'multi') return [...parts].sort().map(label).join(' · ');
  if (step.kind === 'proof') return answer === 'none' ? 'No clues shown' : parts.map((id) => evidenceById[id]?.title ?? id).join(' · ');
  if (step.kind === 'scale') return `${label(answer)} weighs more`;
  if (step.kind === 'inference') {
    return inferencePairs(answer)
      .map((p) => `${evidenceById[p.clue]?.title ?? p.clue}: ${inferences[p.clue]?.cards.find((c) => c.id === p.card)?.text ?? ''}`)
      .join(' · ');
  }
  if (step.kind === 'sentence' && step.sentence) {
    const { before, slots, joins, after } = step.sentence;
    const word = (i: number) => slots[i].options.find((o) => o.id === parts[i])?.text ?? '…';
    return `${before} ${word(0)} ${joins[0]} ${word(1)} ${joins[1]} ${word(2)}${after}`;
  }
  return label(answer);
}

/** The best-supported answer in words, for the review. */
export function describeBest(step: MeetingStep, answer: string | undefined): string {
  if (step.kind === 'inference') {
    if (!answer || answer === 'skip') return 'Not needed';
    return inferencePairs(answer)
      .map((p) => `${evidenceById[p.clue]?.title ?? p.clue}: ${inferences[p.clue]?.cards[0].text ?? ''}`)
      .join(' · ');
  }
  return describeAnswer(step, step.correct);
}

/** What Whatson says after an answer. Right answers get a comment; wrong ones a hint that never gives the answer away. */
export function whatsonSays(step: MeetingStep, answer: string, right: boolean): string {
  const { whatson } = step;
  if (step.kind === 'inference') {
    const pairs = inferencePairs(answer);
    const title = (id: string) => evidenceById[id]?.title ?? id;
    const firstGood = pairs.find((p) => p.card === 'a');
    const firstBad = pairs.find((p) => p.card !== 'a');
    const badWhy = firstBad && inferences[firstBad.clue]?.cards.find((c) => c.id === firstBad.card)?.why;
    const praise = firstGood ? inferences[firstGood.clue]?.right : '';
    const note = badWhy ? `About "${title(firstBad.clue)}": ${badWhy}` : '';
    return [praise, note].filter(Boolean).join(' ') || whatson.wrong;
  }
  if (right) return whatson.right;
  if (step.kind === 'multi') {
    const wrongOne = answer.split(ANSWER_SEPARATOR).find((id) => step.correct.split(ANSWER_SEPARATOR).indexOf(id) < 0);
    return (wrongOne && whatson.wrongBy?.[wrongOne]) || whatson.wrong;
  }
  if (step.kind === 'sentence' && step.sentence) {
    const chosen = answer.split(ANSWER_SEPARATOR);
    const wrongSlot = step.sentence.slots.find((slot, i) => chosen[i] !== slot.correct);
    return (wrongSlot && whatson.wrongBy?.[wrongSlot.id]) || whatson.wrong;
  }
  return whatson.wrongBy?.[answer] ?? whatson.wrong;
}
