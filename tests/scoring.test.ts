import { describe, expect, it, vi } from 'vitest';

vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });

const { freshSave } = await import('../src/state/store');
const { buildProfile, judgeMarks, shuffled } = await import('../src/state/scoring');
const { finalReport } = await import('../src/content/finalReport');
const { interviews } = await import('../src/content/interviews');

type Save = ReturnType<typeof freshSave>;
const allQuestions = interviews.flatMap((i) => i.questions.map((q) => ({ ...q, interviewId: i.id })));

/** Builds a finished game from a list of question ids and report answers. */
function game(questionIds: string[], answers: Record<string, string>, extra: Partial<Save> = {}): Save {
  const save = freshSave();
  for (const id of questionIds) {
    const q = allQuestions.find((x) => x.id === id)!;
    (save.asked[q.interviewId] ??= []).push(id);
    save.questionLog.push({ questionId: id, interviewId: q.interviewId, class: q.class, at: 0 });
    save.evidence.push(...(q.unlocks ?? []));
  }
  save.final = { index: finalReport.length, answers };
  return { ...save, ...extra };
}

const allCorrect = { ...Object.fromEntries(finalReport.map((q) => [q.id, q.correct])), P2: 'SCI-09:a,SCI-10:a,TUC-03:a' };
const level = (save: Save, id: string) => buildProfile(save).dimensions.find((d) => d.id === id)!;

describe('investigator profile', () => {
  it('a careful investigation earns high levels and specific praise', () => {
    const strong = ['M1', 'M3', 'M5', 'M7', 'C1', 'C3', 'C5', 'C7', 'A2', 'A4', 'A6', 'T4', 'T9', 'P2', 'P4', 'P7'];
    const save = game(strong, allCorrect, {
      evidence: ['SQ-01', 'SCI-01', 'SCI-02', 'SCI-04', 'SCI-09', 'SCI-10'],
      // Sorted the evidence well on the board: key pieces Important, distractions set aside.
      board: {
        items: Object.fromEntries([
          ...['HAR-02', 'HAR-03', 'MKT-02', 'MKT-04', 'CLI-02', 'CLI-03', 'SCI-09', 'SCI-10'].map((id) => [
            id,
            { x: 0, y: 0, z: 1, tag: 'important' as const },
          ]),
          ...['RES-07', 'HAR-09'].map((id) => [id, { x: 0, y: 0, z: 1, tag: 'notRelevant' as const }]),
        ]),
        notes: [],
        links: [],
        topZ: 1,
      },
    });
    const profile = buildProfile(save);
    expect(profile.correctCount).toBe(9);
    for (const d of profile.dimensions) expect(d.level, d.id).toBe('Master Investigator');
    expect(level(save, 'questionQuality').feedback).toContain(
      'You asked several specific questions that produced useful evidence.',
    );
    expect(level(save, 'sourceEvaluation').feedback[0]).toMatch(/company statements from independent evidence/);
  });

  it('weak questions are reflected even when the report is perfect', () => {
    const weak = ['M2', 'M4', 'M8', 'C2', 'C4', 'C6', 'A3', 'A5', 'S1', 'S4', 'S6', 'T3'];
    const save = game(weak, allCorrect);
    const qq = level(save, 'questionQuality');
    expect(qq.level).toBe('Getting Started');
    expect(qq.feedback.join(' ')).toMatch(/guess the cause/);
    expect(qq.feedback.join(' ')).not.toMatch(/useful evidence/);
    expect(level(save, 'logicalReasoning').level).toBe('Master Investigator');
  });

  it('notices when questions improve during the game', () => {
    const improving = ['M2', 'M4', 'M8', 'C2', 'C1', 'C3', 'A2', 'A4'];
    const qq = level(game(improving, allCorrect), 'questionQuality');
    expect(qq.feedback).toContain('You became more specific with your questions as your investigation progressed.');
  });

  it('gives a pointed hint for each wrong explanation, never the answer itself', () => {
    const save = game(['M1'], { ...allCorrect, R1: 'b', R4: 'more,sick,fewer', R6: 'b', R7: 'c,a,d' });
    const profile = buildProfile(save);
    expect(profile.correctCount).toBe(5);
    expect(level(save, 'evidenceAnalysis').feedback[0]).toMatch(/Look at who cared for the sick|which came first/);
    expect(level(save, 'logicalReasoning').feedback.join(' ')).toMatch(/Follow them back to where they start/);
    expect(level(save, 'sourceEvaluation').feedback[0]).toMatch(/Who took the independent samples/);
    const everything = JSON.stringify(profile.dimensions);
    expect(everything).not.toMatch(/heavy metal|wastewater released by Tucano/i);
  });

  it('an empty game gets the lowest levels without crashing', () => {
    const profile = buildProfile(game([], {}));
    expect(profile.correctCount).toBe(0);
    for (const d of profile.dimensions) expect(d.level).toBe('Getting Started');
  });

  it('never gives more than two comments per dimension', () => {
    const save = game(['M2', 'M4', 'C6', 'S6', 'C4', 'A5', 'T3', 'S4'], { R1: 'a', R2: 'a', R3: 'a', R4: 'more,sick,fewer' });
    for (const d of buildProfile(save).dimensions) expect(d.feedback.length).toBeLessThanOrEqual(2);
  });
});

describe('option order', () => {
  it('is stable for the same team and question, and keeps every option', () => {
    const options = finalReport[0].options;
    const a = shuffled(options, 'team-1:R1');
    const b = shuffled(options, 'team-1:R1');
    expect(a).toEqual(b);
    expect([...a].sort((x, y) => x.id.localeCompare(y.id))).toEqual(options);
  });

  it('differs between teams', () => {
    const options = finalReport[0].options;
    const orders = new Set(['1', '2', '3', '4', '5', '6'].map((t) => shuffled(options, `team-${t}:R1`).map((o) => o.id).join('')));
    expect(orders.size).toBeGreaterThan(1);
  });
});

describe('marks on the Evidence Board', () => {
  const mark = (tags: Record<string, 'important' | 'unsure' | 'notRelevant'>) => {
    const save = freshSave();
    for (const [id, tag] of Object.entries(tags)) save.board.items[id] = { x: 0, y: 0, z: 1, tag };
    return save;
  };

  it('count as right when key evidence is Important and distractions are Not relevant', () => {
    const marks = judgeMarks(mark({ 'CLI-03': 'important', 'SCI-09': 'important', 'RES-07': 'notRelevant' }));
    expect(marks).toMatchObject({ judged: 3, right: 3, wrong: 0, accuracy: 1 });
    expect(marks.keyMarkedImportant).toEqual(['CLI-03', 'SCI-09']);
    expect(marks.distractionsMarkedNotRelevant).toEqual(['RES-07']);
  });

  it('count as wrong when a distraction is Important or key evidence is dismissed', () => {
    const marks = judgeMarks(mark({ 'RES-06': 'important', 'CLI-02': 'notRelevant' }));
    expect(marks).toMatchObject({ judged: 2, right: 0, wrong: 2, accuracy: 0, score: 0 });
    expect(marks.distractionsMarkedImportant).toEqual(['RES-06']);
    expect(marks.keyMarkedNotRelevant).toEqual(['CLI-02']);
  });

  it('never count Unsure, or evidence of middling value set aside, against the player', () => {
    const marks = judgeMarks(mark({ 'CLI-03': 'unsure', 'RES-06': 'unsure', 'HAR-01': 'notRelevant' }));
    expect(marks).toMatchObject({ judged: 0, wrong: 0, unsure: 2 });
  });

  it('need about eight marks for a full score, so a single lucky mark is not enough', () => {
    const one = judgeMarks(mark({ 'CLI-03': 'important' }));
    expect(one.accuracy).toBe(1);
    expect(one.score).toBeCloseTo(1 / 8);
  });

  it('decide half of Evidence Analysis', () => {
    const answers = allCorrect;
    const unmarked = game([], answers);
    const ea = (save: Save) => buildProfile(save).dimensions.find((d) => d.id === 'evidenceAnalysis')!;
    expect(ea(unmarked).score).toBeCloseTo(0.5);
    expect(ea(unmarked).feedback.join(' ')).toMatch(/did not mark any evidence/);
  });
});
