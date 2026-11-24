import { evidenceById } from '../content/evidence';
import { finalReport } from '../content/finalReport';
import { classPoints } from '../content/interviews';
import type { Dimension } from '../content/types';
import type { SaveGame } from './store';

/**
 * Turns a finished game into an Investigator Profile. Nothing here runs
 * during the investigation: the player is never judged while still exploring.
 * Rules follow docs/04-final-report-and-logic-audit.md.
 */

export const LEVELS = ['Getting Started', 'On the Trail', 'Sharp Investigator', 'Master Investigator'] as const;
export type Level = (typeof LEVELS)[number];

export const DIMENSION_LABEL: Record<Dimension, string> = {
  questionQuality: 'Question Quality',
  evidenceAnalysis: 'Evidence Analysis',
  logicalReasoning: 'Logical Reasoning',
  sourceEvaluation: 'Source Evaluation',
  systemsThinking: 'Systems Thinking',
};

export interface DimensionResult {
  id: Dimension;
  label: string;
  /** 0 to 1. */
  score: number;
  level: Level;
  feedback: string[];
}

export interface AnswerResult {
  questionId: string;
  chosen: string | undefined;
  correct: string;
  isCorrect: boolean;
}

export interface Profile {
  dimensions: DimensionResult[];
  answers: AnswerResult[];
  correctCount: number;
  marks: MarkResults;
}

function levelFor(score: number): Level {
  if (score >= 0.85) return LEVELS[3];
  if (score >= 0.6) return LEVELS[2];
  if (score >= 0.35) return LEVELS[1];
  return LEVELS[0];
}

const average = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Two report answers count for most of a dimension; what the player did during the game adds the rest. */
function blend(correct: number, of: number, behaviour: number): number {
  return clamp01(0.8 * (correct / of) + 0.2 * behaviour);
}

export function buildProfile(save: SaveGame): Profile {
  const chosen = (id: string) => save.final.answers[id];
  const right = (id: string) => {
    const q = finalReport.find((f) => f.id === id);
    return !!q && chosen(id) === q.correct;
  };
  const count = (...ids: string[]) => ids.filter(right).length;
  const asked = new Set(Object.values(save.asked).flat());
  const has = (id: string) => save.evidence.includes(id);

  // ── Question Quality: from the questions actually chosen ──
  const log = save.questionLog;
  const points = log.map((entry) => classPoints[entry.class] ?? 0);
  const n = log.length;
  const share = n ? log.filter((e) => e.class === 'strong' || e.class === 'useful').length / n : 0;
  const half = Math.floor(n / 2);
  const trend = n >= 6 ? average(points.slice(half)) - average(points.slice(0, half)) : 0;
  const opinions = log.filter((e) => e.class === 'opinion').length;
  const suggested = log.filter((e) => e.class === 'leading' || e.class === 'assumption').length;

  const qqFeedback: string[] = [];
  if (n === 0) {
    qqFeedback.push('You did not interview anyone. The people of Vila do Sol hold much of the evidence.');
  } else {
    if (share >= 0.6) qqFeedback.push('You asked several specific questions that produced useful evidence.');
    if (trend >= 0.75) qqFeedback.push('You became more specific with your questions as your investigation progressed.');
    if (opinions >= 3) {
      qqFeedback.push('You sometimes asked witnesses to guess the cause instead of asking what they observed.');
    }
    if (suggested >= 2) {
      qqFeedback.push('Some of your questions suggested their own answer. Neutral questions usually reveal more.');
    }
    if (qqFeedback.length === 0) {
      qqFeedback.push('You asked a mix of questions. Look back at which ones gave you evidence and which did not.');
    }
  }
  const qqScore = n ? clamp01(0.5 * (average(points) / 2.5) + 0.5 * share) : 0;

  // ── Evidence Analysis ──
  const marks = judgeMarks(save);

  const eaFeedback: string[] = [];
  const r1Hints: Record<string, string> = {
    a: 'A contagious illness was a reasonable idea at the start. Look at who cared for the sick, and who stayed well.',
    b: 'The rats and the illness appeared at about the same time. Look again at which came first.',
    d: 'The algae did multiply in January. Check when the first strange fish were seen, and what the laboratory found.',
    e: 'The statue broke in December. Check when the first strange fish were seen.',
  };
  const r2Hints: Record<string, string> = {
    a: "Check where the town's water comes from, and who drinks it.",
    b: 'Some people who never go near the sea became sick. Look at what they have in common with the fishing families.',
    c: 'Look at where the patients live, and at the health of the people who work in the factory all day.',
  };
  // One comment about the report answers, then one about the marks on the board.
  if (right('R1') && right('R2')) {
    eaFeedback.push('You connected the laboratory result, the animals, and what people eat.');
  } else if (!right('R1') && chosen('R1')) {
    eaFeedback.push(r1Hints[chosen('R1')!] ?? '');
  } else if (!right('R2') && chosen('R2')) {
    eaFeedback.push(r2Hints[chosen('R2')!] ?? '');
  }
  // r2Hints: a tap water, b skin, c chimney air.
  if (marks.judged === 0) {
    eaFeedback.push(
      'You did not mark any evidence on your board as Important or Not relevant. Sorting evidence is part of investigating.',
    );
  } else if (marks.accuracy >= 0.8 && marks.judged >= 6) {
    eaFeedback.push('Your marks on the Evidence Board separated the key evidence from the distractions.');
  } else if (marks.wrong > 0) {
    eaFeedback.push(
      'Some evidence you marked Important led nowhere, or evidence you set aside turned out to matter. See "How you sorted the evidence" below.',
    );
  } else {
    eaFeedback.push('The evidence you marked was sorted well. Marking more of it would show more of your thinking.');
  }

  // ── Logical Reasoning ──
  const lrFeedback: string[] = [];
  if (right('R7')) {
    lrFeedback.push(
      "You joined the whole chain of evidence into one clear conclusion, from the factory's wastewater to the symptoms.",
    );
  } else {
    // The sentence has three blanks: the substance, where it came from, how it reached people.
    const [substance, source, carrier] = (chosen('R7') ?? '').split(',');
    if (substance === 'b') {
      lrFeedback.push('Algae can release natural poisons, but the laboratory found no algae toxins in the animals. What did it find instead?');
    } else if (substance && substance !== 'c') {
      lrFeedback.push('Look again at what the laboratory found in the blood and tissues of the animals.');
    } else if (source && source !== 'c') {
      lrFeedback.push('Where were the highest amounts measured? Follow them back to where they start.');
    } else if (carrier && carrier !== 'd') {
      lrFeedback.push('Think about what the cats and the affected families all ate.');
    }
  }
  if (right('R5')) {
    lrFeedback.push("You drew a careful conclusion from João's case: no stronger than the evidence allows.");
  } else if (chosen('R5') === 'a' || chosen('R5') === 'd') {
    lrFeedback.push(
      "João's health tells you something about factory work. Does it tell you anything about what the factory releases?",
    );
  } else if (chosen('R5')) {
    lrFeedback.push("João's family is healthy and another factory family is not. What is different between them?");
  }

  // ── Source Evaluation ──
  const askedReport = asked.has('T9');
  const seBehaviour = (askedReport || asked.has('T6') ? 0.5 : 0) + (asked.has('P7') ? 0.5 : 0);
  const seFeedback: string[] = [];
  if (right('R6')) {
    seFeedback.push(
      askedReport
        ? 'You were careful about distinguishing company statements from independent evidence.'
        : "You judged the company's report by who produced it, without assuming it was false.",
    );
  } else if (chosen('R6')) {
    seFeedback.push(
      "The company's report may be true, but it was collected and tested by the company being investigated. Who took the independent samples?",
    );
  }

  // ── Systems Thinking ──
  const stBehaviour =
    (has('SQ-01') && has('SCI-02') ? 0.5 : 0) + (has('SCI-01') || has('SCI-04') ? 0.5 : 0);
  const stFeedback: string[] = [];
  if (right('R3') && right('R4')) {
    stFeedback.push('You identified relationships between different parts of the ecosystem.');
  }
  if (!right('R4') && chosen('R4')) {
    stFeedback.push('What happened to the cats just before the rats multiplied? Think about who normally keeps the rats away.');
  }
  if (!right('R3') && chosen('R3')) {
    const r3Hints: Record<string, string> = {
      a: 'The algae did multiply in January. Check when the first strange fish were seen, and what the laboratory found.',
      b: 'Look at the river mouth on the mud sampling map.',
      d: 'Look at the boat-repair yard on the mud sampling map.',
    };
    stFeedback.push(r3Hints[chosen('R3')!] ?? '');
  }

  const dimension = (id: Dimension, score: number, feedback: string[]): DimensionResult => ({
    id,
    label: DIMENSION_LABEL[id],
    score,
    level: levelFor(score),
    feedback: feedback.filter(Boolean).slice(0, 2),
  });

  const answers: AnswerResult[] = finalReport.map((q) => ({
    questionId: q.id,
    chosen: chosen(q.id),
    correct: q.correct,
    isCorrect: chosen(q.id) === q.correct,
  }));

  return {
    dimensions: [
      dimension('questionQuality', qqScore, qqFeedback),
      // Half from the report answers, half from how the player sorted evidence on the board.
      dimension('evidenceAnalysis', clamp01(0.5 * (count('R1', 'R2') / 2) + 0.5 * marks.score), eaFeedback),
      dimension('logicalReasoning', clamp01(count('R5', 'R7') / 2), lrFeedback),
      dimension('sourceEvaluation', blend(count('R6'), 1, seBehaviour), seFeedback),
      dimension('systemsThinking', blend(count('R3', 'R4'), 2, stBehaviour), stFeedback),
    ],
    answers,
    correctCount: answers.filter((a) => a.isCorrect).length,
    marks,
  };
}

/** Marks needed before the sorting score can reach its maximum. */
const MARKS_FOR_FULL_SCORE = 8;

export interface MarkResults {
  /** Marks that can be judged: Important or Not relevant. "Unsure" is never right or wrong. */
  judged: number;
  right: number;
  wrong: number;
  unsure: number;
  accuracy: number;
  /** 0 to 1: accuracy, scaled down when only a few pieces were marked. */
  score: number;
  /** Evidence ids, for the profile to list by title. */
  keyMarkedImportant: string[];
  distractionsMarkedImportant: string[];
  keyMarkedNotRelevant: string[];
  distractionsMarkedNotRelevant: string[];
}

/**
 * Compares the player's own marks on the Evidence Board with what each piece
 * of evidence turned out to be worth. Evidence of middling value is never
 * counted against the player.
 */
export function judgeMarks(save: SaveGame): MarkResults {
  const result: MarkResults = {
    judged: 0,
    right: 0,
    wrong: 0,
    unsure: 0,
    accuracy: 0,
    score: 0,
    keyMarkedImportant: [],
    distractionsMarkedImportant: [],
    keyMarkedNotRelevant: [],
    distractionsMarkedNotRelevant: [],
  };

  for (const [id, item] of Object.entries(save.board.items)) {
    const relevance = evidenceById[id]?.internal.relevance;
    if (!item.tag || !relevance) continue;
    const key = relevance === 'high';
    const distraction = relevance === 'low' || relevance === 'redHerring';

    if (item.tag === 'unsure') {
      result.unsure += 1;
    } else if (item.tag === 'important') {
      if (key) result.keyMarkedImportant.push(id);
      if (distraction) result.distractionsMarkedImportant.push(id);
      if (relevance === 'medium') result.right += 0.5;
      else if (key) result.right += 1;
      else result.wrong += 1;
      result.judged += relevance === 'medium' ? 0.5 : 1;
    } else if (item.tag === 'notRelevant') {
      if (key) {
        result.keyMarkedNotRelevant.push(id);
        result.wrong += 1;
        result.judged += 1;
      } else if (distraction) {
        result.distractionsMarkedNotRelevant.push(id);
        result.right += 1;
        result.judged += 1;
      }
    }
  }

  result.accuracy = result.judged ? result.right / result.judged : 0;
  result.score = clamp01(result.accuracy * Math.min(1, result.judged / MARKS_FOR_FULL_SCORE));
  return result;
}

/** A stable shuffle, so option order survives a refresh but differs between teams. */
export function shuffled<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const random = () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
