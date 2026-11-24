import { beforeEach, describe, expect, it, vi } from 'vitest';

// A minimal localStorage, installed before the store module is loaded.
const disk = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (k: string) => disk.get(k) ?? null,
  setItem: (k: string, v: string) => void disk.set(k, v),
  removeItem: (k: string) => void disk.delete(k),
});

const {
  useGame,
  freshSave,
  hasSave,
  canSolve,
  questionsLeft,
  visibleQuestions,
  visibleLocations,
  availableMeetings,
  PHASES,
} = await import('../src/state/store');
const { flushSave, SAVE_KEY } = await import('../src/state/persistence');
const { evidence } = await import('../src/content/evidence');

const game = () => useGame.getState();

beforeEach(() => {
  disk.clear();
  useGame.setState({ ...freshSave(), sessionActive: false, restoreFailed: false });
});

describe('starting', () => {
  it('begins on the start screen with nothing to continue', () => {
    expect(game().phase).toBe('start');
    expect(hasSave(game())).toBe(false);
  });

  it('a new game opens the story and can be continued later', () => {
    game().startNewGame('  The Night Owls  ');
    expect(game().teamName).toBe('The Night Owls');
    expect(game().phase).toBe('opening');
    expect(game().sessionActive).toBe(true);
    expect(hasSave(game())).toBe(true);
  });

  it('lists phases in play order', () => {
    expect(PHASES.indexOf('report')).toBeGreaterThan(PHASES.indexOf('investigation'));
    expect(PHASES[PHASES.length - 1]).toBe('reflection');
  });
});

describe('interviews', () => {
  beforeEach(() => {
    game().startNewGame('Team');
    game().finishOpening();
    game().visit('harbor');
  });

  it('a strong question returns the answer and adds evidence to the board', () => {
    const result = game().ask('maria', 'M1');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.newEvidence).toEqual(['HAR-02']);
    expect(game().evidence).toEqual(['HAR-02']);
    expect(game().board.items['HAR-02']).toBeDefined();
  });

  it('a weak question adds no evidence and records its hidden class', () => {
    const result = game().ask('maria', 'M2');
    expect(result.ok && result.newEvidence).toEqual([]);
    expect(game().evidence).toEqual([]);
    expect(game().questionLog[0].class).toBe('vague');
  });

  it('stops at the question limit and refuses repeats', () => {
    expect(game().ask('maria', 'M1').ok).toBe(true);
    expect(game().ask('maria', 'M1')).toEqual({ ok: false, reason: 'alreadyAsked' });
    game().ask('maria', 'M2');
    game().ask('maria', 'M3');
    game().ask('maria', 'M4');
    expect(questionsLeft(game(), 'maria')).toBe(0);
    expect(game().ask('maria', 'M5')).toEqual({ ok: false, reason: 'noQuestionsLeft' });
  });

  it('hides the algae question until the player has read about algae', () => {
    const ids = () => visibleQuestions(game(), 'maria').map((q) => q.id);
    expect(ids()).not.toContain('M6');
    expect(game().ask('maria', 'M6')).toEqual({ ok: false, reason: 'notAvailable' });
    game().collect(['HAR-08']);
    expect(ids()).toContain('M6');
  });

  it('shows the report follow-up only after the wastewater question', () => {
    game().visit('tucano');
    expect(visibleQuestions(game(), 'santos').map((q) => q.id)).not.toContain('T9');
    game().ask('santos', 'T4');
    expect(visibleQuestions(game(), 'santos').map((q) => q.id)).toContain('T9');
    const report = game().ask('santos', 'T9');
    expect(report.ok && report.newEvidence).toEqual(['TUC-02']);
  });

  it('gives one tip per interview and one per weak class', () => {
    const first = game().ask('maria', 'M2'); // vague
    expect(first.ok && first.tip).toBeTruthy();
    const second = game().ask('maria', 'M4'); // opinion, same interview
    expect(second.ok && second.tip).toBeUndefined();
    game().visit('clinic');
    const third = game().ask('ana', 'A3'); // vague again
    expect(third.ok && third.tip).toBeUndefined();
    game().visit('market');
    const fourth = game().ask('carlos', 'C2'); // humorous, with its own text
    expect(fourth.ok && fourth.tip).toBe('Funny question. Not very useful evidence, though.');
  });
});

describe('map and views', () => {
  beforeEach(() => {
    game().startNewGame('Team');
    game().finishOpening();
  });

  it('shows eight places at first; the channel appears once it is discovered', () => {
    const ids = () => visibleLocations(game()).map((l) => l.id);
    expect(ids()).toHaveLength(8);
    expect(ids()).not.toContain('channel');
    game().collect(['HAR-07']);
    expect(ids()).toContain('channel');
  });

  it('opening a place records the visit; a hidden place cannot be opened', () => {
    game().goTo({ screen: 'location', locationId: 'harbor' });
    expect(game().view).toEqual({ screen: 'location', locationId: 'harbor' });
    expect(game().visitedLocations).toEqual(['harbor']);
    game().goTo({ screen: 'location', locationId: 'channel' });
    expect(game().view).toEqual({ screen: 'location', locationId: 'harbor' });
    expect(game().visitedLocations).not.toContain('channel');
  });

  it('the first talk opens at five pieces of evidence and the second at ten', () => {
    expect(availableMeetings(game())).toHaveLength(0);
    game().collect(evidence.slice(0, 4).map((e) => e.id));
    expect(availableMeetings(game())).toHaveLength(0);
    game().collect(evidence.slice(4, 5).map((e) => e.id));
    expect(availableMeetings(game()).map((m) => m.id)).toEqual(['meeting1']);
    game().collect(evidence.slice(5, 10).map((e) => e.id));
    expect(availableMeetings(game()).map((m) => m.id)).toEqual(['meeting1', 'meeting2']);
  });

  it('views are not available outside the investigation', () => {
    useGame.setState({ phase: 'report', view: { screen: 'map' } });
    game().goTo({ screen: 'board' });
    expect(game().view).toEqual({ screen: 'map' });
  });
});

describe('progress events and the final report', () => {
  beforeEach(() => {
    game().startNewGame('Team');
    game().finishOpening();
  });

  it('brings the tissue analysis with the cat, and the mud and water samples after more investigating', () => {
    // The cat can be brought in straight away: the tissue analysis arrives at once.
    game().deliverCat();
    expect(game().catDelivered).toBe(true);
    expect(game().eventsUnread).toEqual(['labResults']);
    game().deliverCat();
    expect(game().eventsUnread).toEqual(['labResults']);
    game().readEvent('labResults');
    expect(game().evidence).toContain('SCI-09');
    expect(game().evidence).not.toContain('SCI-10');
    expect(game().eventsUnread).toEqual([]);
    // The mud and water samples wait for enough investigating.
    game().collect(evidence.slice(0, 12).map((e) => e.id));
    expect(game().eventsUnread).toEqual([]);
    (['harbor', 'market', 'clinic', 'community', 'square'] as const).forEach((l) => game().visit(l));
    expect(game().eventsUnread).toEqual(['bayResults']);
    game().readEvent('bayResults');
    expect(game().evidence).toContain('SCI-10');
  });

  it('the player may begin the report at any moment of the investigation, and it never leads back', () => {
    // Straight after the opening, with no evidence at all: the decision is the player's.
    expect(game().evidence).toEqual([]);
    expect(canSolve(game())).toBe(true);
    expect(game().beginReport()).toBe(true);
    expect(game().phase).toBe('report');
    game().finishOpening();
    game().goTo({ screen: 'map' });
    expect(game().phase).toBe('report');
    expect(game().beginReport()).toBe(false);
  });

  it('the report cannot be begun before the investigation starts', () => {
    useGame.setState({ phase: 'opening' });
    expect(canSolve(game())).toBe(false);
    expect(game().beginReport()).toBe(false);
    expect(game().phase).toBe('opening');
  });

  it('locks each answer and moves to the profile after the last one', () => {
    useGame.setState({ phase: 'report' });
    game().submitExplanation('We think the evidence shows what happened.');
    game().answerFinal('c');
    expect(game().final).toMatchObject({ index: 1, answers: { R1: 'c' } });
    game().answerFinal('not-an-option');
    expect(game().final.index).toBe(1);
    for (let i = 0; i < 7; i++) game().answerFinal('a');
    expect(game().final.index).toBe(8);
    expect(game().final.answers.R1).toBe('c');
    expect(game().phase).toBe('profile');
  });
});

describe('evidence board', () => {
  beforeEach(() => {
    game().startNewGame('Team');
    game().collect(['HAR-01', 'HAR-06']);
  });

  it('moves, tags and untags evidence', () => {
    game().moveItem('HAR-01', 500, 400);
    game().setTag('HAR-01', 'important');
    expect(game().board.items['HAR-01']).toMatchObject({ x: 500, y: 400, tag: 'important' });
    game().setTag('HAR-01', undefined);
    expect(game().board.items['HAR-01'].tag).toBeUndefined();
  });

  it('keeps items inside the board', () => {
    game().moveItem('HAR-01', -50, 99999);
    expect(game().board.items['HAR-01']).toMatchObject({ x: 0, y: 1430 });
  });

  it('adds notes and strings; deleting a note removes its strings', () => {
    const note = game().addNote(100, 100);
    game().updateNote(note, 'Why is João healthy?');
    game().addLink(note, 'HAR-01');
    game().addLink('HAR-01', note); // same pair, ignored
    game().addLink('HAR-01', 'HAR-06');
    expect(game().board.links).toHaveLength(2);
    game().deleteNote(note);
    expect(game().board.notes).toHaveLength(0);
    expect(game().board.links).toHaveLength(1);
  });
});

describe('saving and restoring', () => {
  it('restores the exact state after a refresh', async () => {
    game().startNewGame('Team');
    game().finishOpening();
    game().visit('harbor');
    game().ask('maria', 'M1');
    game().moveItem('HAR-02', 640, 320);
    const note = game().addNote(200, 200);
    game().updateNote(note, 'Check the rats.');
    flushSave();
    expect(disk.has(SAVE_KEY)).toBe(true);

    // Simulate a fresh page load.
    useGame.setState({ ...freshSave(), sessionActive: false });
    await useGame.persist.rehydrate();

    expect(game().teamName).toBe('Team');
    expect(game().phase).toBe('investigation');
    expect(game().asked.maria).toEqual(['M1']);
    expect(game().evidence).toEqual(['HAR-02']);
    expect(game().board.items['HAR-02']).toMatchObject({ x: 640, y: 320 });
    expect(game().board.notes[0].text).toBe('Check the rats.');
    expect(game().sessionActive).toBe(false); // back on the start screen, ready to continue
    expect(hasSave(game())).toBe(true);
  });

  it('does not save the session flags', () => {
    game().startNewGame('Team');
    flushSave();
    const saved = JSON.parse(disk.get(SAVE_KEY)!);
    expect(saved.state.sessionActive).toBeUndefined();
    expect(saved.state.storageOk).toBeUndefined();
    expect(saved.version).toBe(1);
  });

  it('survives a corrupt save', async () => {
    disk.set(SAVE_KEY, '{ this is not json');
    await useGame.persist.rehydrate();
    await Promise.resolve();
    expect(game().phase).toBe('start');
    expect(game().restoreFailed).toBe(true);
  });

  it('discards a save from another version', async () => {
    disk.set(SAVE_KEY, JSON.stringify({ state: { phase: 'report', teamName: 'Old' }, version: 99 }));
    await useGame.persist.rehydrate();
    expect(game().phase).toBe('start');
    expect(game().teamName).toBe('');
  });

  it('fills in fields missing from a damaged save', async () => {
    disk.set(
      SAVE_KEY,
      JSON.stringify({ state: { phase: 'investigation', teamName: 'Half', timing: { startedAt: 5 } }, version: 1 }),
    );
    await useGame.persist.rehydrate();
    expect(game().teamName).toBe('Half');
    expect(game().evidence).toEqual([]);
    expect(game().board.notes).toEqual([]);
    expect(game().final).toEqual({ index: 0, answers: {}, explanation: '', explanationDone: false });
  });
});

describe('play clock', () => {
  it('counts from entering Vila do Sol until the last report answer', () => {
    game().startNewGame('Team');
    game().addPlayTime(5000); // still reading the opening story
    expect(game().timing.playMs).toBe(0);

    game().finishOpening();
    game().addPlayTime(60_000);
    expect(game().timing.playMs).toBe(60_000);

    useGame.setState({ phase: 'report' });
    game().submitExplanation('We think the evidence shows what happened.');
    game().addPlayTime(30_000);
    expect(game().timing.playMs).toBe(90_000);

    for (let i = 0; i < 8; i++) game().answerFinal('a');
    expect(game().phase).toBe('profile');
    game().addPlayTime(10_000); // the report is finished: the clock has stopped
    expect(game().timing.playMs).toBe(90_000);
  });

  it('does not count while the game sits on the start screen', () => {
    game().startNewGame('Team');
    game().finishOpening();
    useGame.setState({ sessionActive: false });
    game().addPlayTime(10_000);
    expect(game().timing.playMs).toBe(0);
  });

  it('is kept across a refresh', async () => {
    game().startNewGame('Team');
    game().finishOpening();
    game().addPlayTime(125_000);
    flushSave();
    useGame.setState({ ...freshSave(), sessionActive: false });
    await useGame.persist.rehydrate();
    expect(game().timing.playMs).toBe(125_000);
  });
});

describe('teacher tools', () => {
  it('times every phase but keeps the player clock to investigation and report', () => {
    game().startNewGame('Team');
    game().addPlayTime(40_000); // opening story
    game().finishOpening();
    game().addPlayTime(600_000);
    expect(game().timing.phaseMs).toEqual({ opening: 40_000, investigation: 600_000 });
    expect(game().timing.playMs).toBe(600_000);
  });

  it('erases the saved game and returns to the start screen', async () => {
    game().startNewGame('Team');
    game().finishOpening();
    game().collect(['HAR-01']);
    game().resetDevice();
    expect(hasSave(game())).toBe(false);
    expect(game().sessionActive).toBe(false);
    flushSave();
    await useGame.persist.rehydrate();
    expect(game().evidence).toEqual([]);
    expect(game().teamName).toBe('');
  });

  it('exports a summary without the team name or anything the students typed', async () => {
    const { buildSessionSummary } = await import('../src/state/summary');
    game().startNewGame('Secret Team Name');
    game().finishOpening();
    game().visit('harbor');
    game().ask('maria', 'M1');
    game().ask('maria', 'M2');
    const note = game().addNote(10, 10);
    game().updateNote(note, 'private note text');
    game().saveMeetingAnswer('meeting1', 'm1-pattern', 'private meeting text');
    game().setTag('HAR-02', 'important');
    game().addPlayTime(120_000);

    const summary = buildSessionSummary(game());
    const text = JSON.stringify(summary);
    expect(text).not.toContain('Secret Team Name');
    expect(text).not.toContain('private note text');
    expect(text).not.toContain('private meeting text');
    expect(summary.finished).toBe(false);
    expect(summary.report).toBeNull();
    expect(summary.questions.byClass).toEqual({ strong: 1, vague: 1 });
    expect(summary.board).toEqual({ tagged: { important: 1 }, notes: 1, conclusions: 0, strings: 0 });
    expect(summary.meetings.meeting1.promptsAnswered).toBe(1);
    expect(summary.minutes.investigationAndReport).toBe(2);

    useGame.setState({ phase: 'report' });
    game().submitExplanation('We think the evidence shows what happened.');
    for (let i = 0; i < 8; i++) game().answerFinal('c');
    const done = buildSessionSummary(game());
    expect(done.finished).toBe(true);
    expect(done.report?.outOf).toBe(8);
    expect(Object.keys(done.report!.levels)).toHaveLength(5);
  });
});

describe('after the report', () => {
  it('lets the closing screens be visited in any order, and nothing else', () => {
    game().startNewGame('Team');
    game().finishOpening();

    // Not during the investigation: there is no shortcut to the report or beyond.
    game().visitAfterGame('profile');
    expect(game().phase).toBe('investigation');

    useGame.setState({ phase: 'report' });
    game().submitExplanation('We think the evidence shows what happened.');
    game().visitAfterGame('reveal');
    expect(game().phase).toBe('report');

    for (let i = 0; i < 8; i++) game().answerFinal('a');
    expect(game().phase).toBe('profile');
    game().visitAfterGame('reflection');
    expect(game().phase).toBe('reflection');
    game().visitAfterGame('profile');
    expect(game().phase).toBe('profile');

    // Still no way back into the investigation or the report.
    game().finishOpening();
    game().goTo({ screen: 'map' });
    expect(game().beginReport()).toBe(false);
    expect(game().phase).toBe('profile');
  });
});

describe('explaining before answering', () => {
  beforeEach(() => {
    game().startNewGame('Team');
    game().finishOpening();
    game().beginReport();
  });

  it('no question can be answered until the explanation is written and locked', () => {
    game().answerFinal('c');
    expect(game().final.index).toBe(0);
    expect(game().submitExplanation('  too short ')).toBe(false);
    expect(game().submitExplanation('The fish are making people and cats sick, I think.')).toBe(true);
    expect(game().final.explanation).toBe('The fish are making people and cats sick, I think.');
    game().answerFinal('c');
    expect(game().final.index).toBe(1);
  });

  it('the explanation cannot be changed once locked, and survives the rest of the report', () => {
    game().submitExplanation('The fish are making people and cats sick, I think.');
    expect(game().submitExplanation('A completely different idea, written later.')).toBe(false);
    for (let i = 0; i < 8; i++) game().answerFinal('a');
    expect(game().phase).toBe('profile');
    expect(game().final.explanation).toBe('The fish are making people and cats sick, I think.');
  });
});

describe('conclusions on the board', () => {
  it('are notes of their own kind, with room for a longer text', () => {
    game().startNewGame('Team');
    const note = game().addNote(10, 10);
    const conclusion = game().addNote(10, 10, 'conclusion');
    const long = 'x'.repeat(300);
    game().updateNote(note, long);
    game().updateNote(conclusion, long);
    const byId = Object.fromEntries(game().board.notes.map((n) => [n.id, n]));
    expect(byId[note].kind).toBe('note');
    expect(byId[note].text).toHaveLength(140);
    expect(byId[conclusion].kind).toBe('conclusion');
    expect(byId[conclusion].text).toHaveLength(240);
  });
});

describe('the Evidence Board asks for attention', () => {
  it('counts new evidence as unseen until the player looks at the board', () => {
    game().startNewGame('Team');
    game().finishOpening();
    expect(game().boardSeen).toBe(0);
    game().collect(['HAR-01', 'HAR-02']);
    expect(game().evidence.length).toBeGreaterThan(game().boardSeen);
    game().markBoardSeen();
    expect(game().boardSeen).toBe(2);
    game().collect(['HAR-03']);
    expect(game().evidence.length).toBeGreaterThan(game().boardSeen);
  });

  it('is remembered across a refresh, and older saves start at zero', async () => {
    game().startNewGame('Team');
    game().collect(['HAR-01']);
    game().markBoardSeen();
    flushSave();
    useGame.setState({ ...freshSave(), sessionActive: false });
    await useGame.persist.rehydrate();
    expect(game().boardSeen).toBe(1);

    disk.set(SAVE_KEY, JSON.stringify({ state: { phase: 'investigation', teamName: 'Old', timing: { startedAt: 5 } }, version: 1 }));
    await useGame.persist.rehydrate();
    expect(game().boardSeen).toBe(0);
  });
});
