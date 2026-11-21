import { describe, expect, it } from 'vitest';
import { characters } from '../src/content/characters';
import { meets } from '../src/content/conditions';
import { evidence, evidenceById } from '../src/content/evidence';
import { finalReport } from '../src/content/finalReport';
import { hypotheses } from '../src/content/hypotheses';
import { interviews } from '../src/content/interviews';
import { events, locations } from '../src/content/locations';
import { meetings } from '../src/content/meetings';
import { opening } from '../src/content/opening';
import { tipsByClass, tipsByQuestion } from '../src/content/tips';

const allQuestions = interviews.flatMap((i) => i.questions);
const hotspots = locations.flatMap((l) => l.hotspots);

function unique<T>(items: T[]): boolean {
  return new Set(items).size === items.length;
}

describe('content counts match the design documents', () => {
  it('has 64 evidence items', () => expect(evidence).toHaveLength(64));
  it('has 76 questions', () => expect(allQuestions).toHaveLength(76));
  it('has 8 final report questions', () => expect(finalReport).toHaveLength(8));
  it('has 9 locations and 9 characters', () => {
    expect(locations).toHaveLength(9);
    expect(characters).toHaveLength(9);
  });
  it('has the five hypotheses A to E', () => {
    expect(hypotheses.map((h) => h.letter).join('')).toBe('ABCDE');
  });
});

describe('ids', () => {
  it('are unique', () => {
    expect(unique(evidence.map((e) => e.id))).toBe(true);
    expect(unique(allQuestions.map((q) => q.id))).toBe(true);
    expect(unique(hotspots.map((h) => h.id))).toBe(true);
    expect(unique(interviews.map((i) => i.id))).toBe(true);
  });
});

describe('references', () => {
  it('every unlocked evidence id exists', () => {
    const refs = [
      ...allQuestions.flatMap((q) => q.unlocks ?? []),
      ...hotspots.flatMap((h) => h.unlocks),
      ...events.flatMap((e) => e.unlocks),
    ];
    for (const id of refs) expect(evidenceById[id], id).toBeDefined();
  });

  it('every evidence item can be obtained somewhere', () => {
    const obtainable = new Set([
      ...allQuestions.flatMap((q) => q.unlocks ?? []),
      ...hotspots.flatMap((h) => h.unlocks),
      ...events.flatMap((e) => e.unlocks),
    ]);
    for (const e of evidence) expect(obtainable.has(e.id), e.id).toBe(true);
  });

  it('27 items come from hotspots or events, 37 from questions', () => {
    const free = new Set([...hotspots.flatMap((h) => h.unlocks), ...events.flatMap((e) => e.unlocks)]);
    const asked = new Set(allQuestions.flatMap((q) => q.unlocks ?? []));
    expect(free.size).toBe(27);
    expect(asked.size).toBe(37);
  });

  it('every location interview exists and belongs to that location', () => {
    for (const l of locations) {
      for (const id of l.interviews) {
        const interview = interviews.find((i) => i.id === id);
        expect(interview, id).toBeDefined();
        expect(interview!.locationId).toBe(l.id);
      }
    }
  });

  it('every interview character exists', () => {
    const ids = characters.map((c) => c.id);
    for (const i of interviews) expect(ids).toContain(i.characterId);
  });

  it('final report answers and evidence references exist', () => {
    for (const q of finalReport) {
      expect(q.options.map((o) => o.id)).toContain(q.correct);
      for (const id of q.evidenceRefs) expect(evidenceById[id], `${q.id} → ${id}`).toBeDefined();
    }
  });

  it('conditions only refer to things that exist', () => {
    const questionIds = allQuestions.map((q) => q.id);
    const conditions = [
      ...allQuestions.map((q) => q.availableWhen),
      ...interviews.map((i) => i.availableWhen),
      ...locations.map((l) => l.availableWhen),
      ...events.map((e) => e.when),
      ...meetings.map((m) => m.availableWhen),
    ].filter(Boolean);
    const check = (c: NonNullable<(typeof conditions)[number]>): void => {
      for (const id of [...(c.hasEvidence ?? []), ...(c.anyEvidence ?? [])]) {
        expect(evidenceById[id], id).toBeDefined();
      }
      for (const id of c.askedQuestion ?? []) expect(questionIds).toContain(id);
      for (const sub of c.anyOf ?? []) check(sub);
    };
    conditions.forEach((c) => check(c!));
  });
});

describe('interview rules', () => {
  it('each interview allows fewer questions than it offers', () => {
    for (const i of interviews) expect(i.maxQuestions).toBeLessThan(i.questions.length);
  });

  it('every weak question class has a tip', () => {
    const weak = ['vague', 'opinion', 'leading', 'assumption', 'irrelevant', 'humorous'] as const;
    for (const c of weak) expect(tipsByClass[c], c).toBeTruthy();
    for (const id of Object.keys(tipsByQuestion)) {
      expect(allQuestions.some((q) => q.id === id), id).toBe(true);
    }
  });

  it('the report follow-up is hidden until the wastewater question is asked', () => {
    const t9 = allQuestions.find((q) => q.id === 'T9')!;
    const before = { evidence: [], visitedLocations: ['tucano'], askedQuestions: [] };
    const after = { ...before, askedQuestions: ['T4'] };
    expect(meets(t9.availableWhen, before)).toBe(false);
    expect(meets(t9.availableWhen, after)).toBe(true);
  });

  it("Dr. Ana's rat question is hidden until the player has seen rats", () => {
    const a5 = allQuestions.find((q) => q.id === 'A5')!;
    expect(meets(a5.availableWhen, { evidence: [], visitedLocations: ['clinic'], askedQuestions: [] })).toBe(false);
    expect(meets(a5.availableWhen, { evidence: [], visitedLocations: ['clinic', 'market'], askedQuestions: [] })).toBe(true);
    expect(meets(a5.availableWhen, { evidence: ['SQ-01'], visitedLocations: ['clinic'], askedQuestions: [] })).toBe(true);
  });

  it('the channel appears only after the chart or the wastewater answer', () => {
    const channel = locations.find((l) => l.id === 'channel')!;
    expect(meets(channel.availableWhen, { evidence: [], visitedLocations: [], askedQuestions: [] })).toBe(false);
    expect(meets(channel.availableWhen, { evidence: ['HAR-07'], visitedLocations: [], askedQuestions: [] })).toBe(true);
  });
});

describe('opening story', () => {
  const text = JSON.stringify(opening);
  const words = opening
    .flatMap((p) => [...p.paragraphs, p.closing ?? ''])
    .join(' ')
    .split(/\s+/).length;

  it('has four pages and reads in about two minutes', () => {
    expect(opening).toHaveLength(4);
    expect(words).toBeGreaterThan(250);
    expect(words).toBeLessThan(380);
  });

  it('ends by sending the player to find the truth', () => {
    expect(opening[opening.length - 1].closing).toBe('Find it.');
  });

  it('does not mention rats or any theory about the cause', () => {
    expect(text).not.toMatch(/\brats?\b/i);
    expect(text).not.toMatch(/contagious|pollut|poison|contaminat|wastewater|algae/i);
  });

  it('does not reveal the real case', () => {
    expect(text).not.toMatch(/minamata|mercury|methylmercury|japan|chisso/i);
  });
});

describe('the competing hypotheses are never listed for the player', () => {
  it('no screen imports the hypothesis list', async () => {
    const { readdirSync, readFileSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.tsx?$/.test(name)) files.push(path);
      }
    };
    walk(join(__dirname, '..', 'src', 'features'));
    for (const file of files) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/content\/hypotheses/);
    }
  });
});

describe('nothing reveals the real case before the reveal', () => {
  // "Methylmercury" now appears in the laboratory results, by the author's decision.
  // The place, the company and the word "mercury" on its own still wait for the reveal.
  const forbidden = /minamata|\bmercury\b|japan|chisso/i;

  it('no forbidden word appears in investigation content', () => {
    const everything = JSON.stringify({
      evidence,
      interviews,
      locations,
      events,
      meetings,
      finalReport,
      hypotheses,
      characters,
      tipsByClass,
      tipsByQuestion,
    });
    expect(everything).not.toMatch(forbidden);
  });
});

describe('reveal and reflection', () => {
  it('names the real case only here, and separates fact from fiction', async () => {
    const { revealPages, factVsFiction } = await import('../src/content/reveal');
    const text = JSON.stringify(revealPages);
    for (const word of ['Minamata', 'Chisso', 'mercury', 'methylmercury', 'Japan', 'bioaccumulation', 'biomagnification']) {
      expect(text, word).toContain(word);
    }
    expect(revealPages[0].title).toBe('The case is closed. But it has happened before.');
    expect(factVsFiction.facts.items.length).toBeGreaterThanOrEqual(6);
    // The rise in rats after the cats died is history, not invention.
    expect(factVsFiction.facts.items.join(' ')).toMatch(/rats multiplied/);
    expect(factVsFiction.adapted.items.join(' ')).toContain('The rise in rats itself was real');
    const adapted = factVsFiction.adapted.items.join(' ');
    for (const invented of ['Vila do Sol', 'Tucano', 'character', 'monthly counts of cats and rats']) {
      expect(adapted, invented).toContain(invented);
    }
  });

  it('has four themes of discussion questions, with two starting points', async () => {
    const { reflection } = await import('../src/content/reflection');
    expect(reflection).toHaveLength(4);
    // Ecosystems has a sixth card, on laws, limits and inspection.
    for (const theme of reflection) expect(theme.cards, theme.id).toHaveLength(theme.id === 'ecosystems' ? 6 : 5);
    const cards = reflection.flatMap((t) => t.cards);
    expect(new Set(cards.map((c) => c.id)).size).toBe(21);
    expect(cards.filter((c) => c.startHere).map((c) => c.id)).toEqual(['1.5', '2.5']);
    const all = JSON.stringify(reflection);
    expect(all).toContain('what can happen to other species in the same region');
  });
});

describe('historical context', () => {
  it('tells the real rat story, the early contagion scare, and the Amazon today', async () => {
    const { revealPages, factVsFiction } = await import('../src/content/reveal');
    const text = JSON.stringify(revealPages);
    expect(text).toMatch(/gnawed the fishing nets/);
    expect(text).toMatch(/August 1, 1954/);
    expect(text).toMatch(/not contagious/);
    for (const word of ['garimpo', 'Amazon', 'Munduruku', 'Tapajós', 'Fiocruz']) expect(text, word).toContain(word);
    expect(factVsFiction.facts.items.join(' ')).toMatch(/first treated as contagious/);
  });

  it('keeps every reveal claim listed in the sources document', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const sources = readFileSync(join(__dirname, '..', 'docs', '09-fontes-historicas.md'), 'utf8');
    for (const topic of ['1932', '1954', '1956', '1959', '1961', '1968', '2013', 'Munduruku', 'Não confirmada']) {
      expect(sources, topic).toContain(topic);
    }
  });
});
