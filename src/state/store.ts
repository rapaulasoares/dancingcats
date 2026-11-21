import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { meets, type Progress } from '../content/conditions';
import { evidenceById } from '../content/evidence';
import { finalReport } from '../content/finalReport';
import { interviewById } from '../content/interviews';
import { events, locationById, locations, readyToSolve } from '../content/locations';
import { meetings } from '../content/meetings';
import { MAX_TIPS, tipsByClass, tipsByQuestion } from '../content/tips';
import type { LocationId, QuestionClass } from '../content/types';
import { SAVE_KEY, SAVE_VERSION, saveStorage, storageAvailable } from './persistence';

/**
 * The game moves through phases in one direction. There is no URL router:
 * once the Final Report begins, nothing may lead back to the investigation.
 */
export const PHASES = [
  'start',
  'opening',
  'investigation',
  'report',
  'profile',
  'reveal',
  'reflection',
] as const;

export type Phase = (typeof PHASES)[number];
export type Tag = 'important' | 'unsure' | 'notRelevant';

/** The written explanation before the report questions: shortest and longest accepted, in characters. */
export const EXPLANATION_MIN = 20;
export const EXPLANATION_MAX = 600;

/** The Evidence Board uses a fixed logical space so saves look the same on any screen. */
export const BOARD = { width: 2400, height: 1600 };
/** Size of an evidence card on the board, in the same logical units. */
export const CARD = { width: 240, height: 170 };
/** The top strip of the board holds its title. */
export const BOARD_HEADER = 90;

export interface BoardItem {
  x: number;
  y: number;
  z: number;
  tag?: Tag;
}

export type NoteKind = 'note' | 'conclusion';

/** Longest text for each kind of note. */
export const NOTE_LIMIT: Record<NoteKind, number> = { note: 140, conclusion: 240 };

export interface BoardNote {
  id: string;
  text: string;
  x: number;
  y: number;
  z: number;
  color: string;
  /** A conclusion is a note that also lists the evidence tied to it. Older saves have no kind: a plain note. */
  kind?: NoteKind;
}

export interface BoardLink {
  id: string;
  from: string;
  to: string;
}

/** Everything that is written to localStorage. */
export interface SaveGame {
  teamName: string;
  phase: Phase;
  openingPage: number;
  visitedLocations: LocationId[];
  /** interviewId → questionIds, in the order asked. */
  asked: Record<string, string[]>;
  questionLog: { questionId: string; interviewId: string; class: QuestionClass; at: number }[];
  tipsShown: { class: QuestionClass; interviewId: string }[];
  /** Collected evidence ids, in the order found. */
  evidence: string[];
  eventsFired: string[];
  eventsUnread: string[];
  /** The dancing cat has been caught on the map and brought to the Regional Science Center. */
  catDelivered: boolean;
  board: {
    items: Record<string, BoardItem>;
    notes: BoardNote[];
    links: BoardLink[];
    topZ: number;
  };
  /** meetingId → promptId → what the team wrote. */
  meetings: Record<string, Record<string, string>>;
  final: {
    index: number;
    answers: Record<string, string>;
    /** Written before the questions: "What do you think is happening in Vila do Sol, and why?" */
    explanation: string;
    explanationDone: boolean;
  };
  timing: {
    startedAt: number;
    lastPlayedAt: number;
    phaseStartedAt: Partial<Record<Phase, number>>;
    /** Time spent investigating and writing the report, in milliseconds. Counts only while the game is open. */
    playMs: number;
    /** Time with the game open in each phase, in milliseconds. For the teacher, not shown to players. */
    phaseMs: Partial<Record<Phase, number>>;
  };
}

export function freshSave(): SaveGame {
  return {
    teamName: '',
    phase: 'start',
    openingPage: 0,
    visitedLocations: [],
    asked: {},
    questionLog: [],
    tipsShown: [],
    evidence: [],
    eventsFired: [],
    eventsUnread: [],
    catDelivered: false,
    board: { items: {}, notes: [], links: [], topZ: 0 },
    meetings: {},
    final: { index: 0, answers: {}, explanation: '', explanationDone: false },
    timing: { startedAt: 0, lastPlayedAt: 0, phaseStartedAt: {}, playMs: 0, phaseMs: {} },
  };
}

export type AskResult =
  | { ok: true; response: string; newEvidence: string[]; tip?: string }
  | { ok: false; reason: 'unknown' | 'alreadyAsked' | 'noQuestionsLeft' | 'notAvailable' };

/** Which screen of the investigation is open. Not saved: a refresh returns to the map. */
export type View =
  | { screen: 'map' }
  | { screen: 'location'; locationId: LocationId }
  | { screen: 'interview'; interviewId: string }
  | { screen: 'board' }
  | { screen: 'meeting' }
  | { screen: 'solve' };

interface Session {
  /** False until the player presses Begin or Continue on the start screen. Not saved. */
  sessionActive: boolean;
  view: View;
  /** False when the browser blocks saving (for example, private browsing). */
  storageOk: boolean;
  /** True when a save existed but could not be read. */
  restoreFailed: boolean;
}

interface Actions {
  startNewGame: (teamName: string) => void;
  resume: () => void;
  /** Opens a screen of the investigation. Opening a location also records the visit. */
  goTo: (view: View) => void;
  setOpeningPage: (page: number) => void;
  finishOpening: () => void;
  visit: (locationId: LocationId) => void;
  ask: (interviewId: string, questionId: string) => AskResult;
  collect: (ids: string[]) => string[];
  readEvent: (eventId: string) => void;
  /** The player brought the dancing cat to the Science Center: the lab results arrive. */
  deliverCat: () => void;

  moveItem: (id: string, x: number, y: number) => void;
  setTag: (id: string, tag: Tag | undefined) => void;
  addNote: (x: number, y: number, kind?: NoteKind) => string;
  updateNote: (id: string, text: string) => void;
  moveNote: (id: string, x: number, y: number) => void;
  deleteNote: (id: string) => void;
  addLink: (from: string, to: string) => void;
  removeLink: (id: string) => void;

  saveMeetingAnswer: (meetingId: string, promptId: string, text: string) => void;

  beginReport: () => boolean;
  /** Locks the written explanation and opens the questions. Returns false if it is too short. */
  submitExplanation: (text: string) => boolean;
  answerFinal: (optionId: string) => void;
  continueAfter: (phase: 'profile' | 'reveal') => void;
  /** After the report is finished, the closing screens can be visited in any order. */
  visitAfterGame: (phase: 'profile' | 'reveal' | 'reflection') => void;
  /** Adds to the play clock. Ignored outside the investigation and the report. */
  addPlayTime: (ms: number) => void;
  /** Erases the saved game on this device and returns to the start screen. */
  resetDevice: () => void;

  /** Development only. */
  devSetPhase: (phase: Phase) => void;
}

export type GameState = SaveGame & Session & Actions;

const SAVE_FIELDS = Object.keys(freshSave()) as (keyof SaveGame)[];

export function progressOf(s: SaveGame): Progress {
  return {
    evidence: s.evidence,
    visitedLocations: s.visitedLocations,
    askedQuestions: Object.values(s.asked).flat(),
    catDelivered: s.catDelivered,
  };
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * New evidence is laid out in rows below the header, in the order it was found,
 * so it never lands on top of another new piece. The player drags it from there.
 */
function inboxPosition(index: number): { x: number; y: number } {
  const perRow = 9;
  const rows = 6;
  const row = Math.floor(index / perRow) % rows;
  return {
    x: 40 + (index % perRow) * 260 + (row % 2) * 14,
    y: BOARD_HEADER + 30 + row * 222 + (index % 2) * 10,
  };
}

const boardX = (x: number) => Math.round(clamp(x, 0, BOARD.width - CARD.width));
const boardY = (y: number) => Math.round(clamp(y, 0, BOARD.height - CARD.height));

/** Fires any progress events whose condition is now met. */
function withEvents(s: SaveGame): Pick<SaveGame, 'eventsFired' | 'eventsUnread'> {
  const p = progressOf(s);
  const due = events.filter((e) => !s.eventsFired.includes(e.id) && meets(e.when, p)).map((e) => e.id);
  return {
    eventsFired: [...s.eventsFired, ...due],
    eventsUnread: [...s.eventsUnread, ...due],
  };
}

function enterPhase(s: SaveGame, phase: Phase): Pick<SaveGame, 'phase' | 'timing'> {
  const now = Date.now();
  return {
    phase,
    timing: {
      ...s.timing,
      lastPlayedAt: now,
      phaseStartedAt: { ...s.timing.phaseStartedAt, [phase]: s.timing.phaseStartedAt[phase] ?? now },
    },
  };
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      ...freshSave(),
      sessionActive: false,
      view: { screen: 'map' },
      storageOk: storageAvailable(),
      restoreFailed: false,

      goTo: (view) => {
        if (get().phase !== 'investigation') return;
        if (view.screen === 'location') {
          const location = locationById[view.locationId];
          if (!location || !meets(location.availableWhen, progressOf(get()))) return;
          get().visit(view.locationId);
        }
        if (view.screen === 'interview') {
          const interview = interviewById[view.interviewId];
          if (!interview || !meets(interview.availableWhen, progressOf(get()))) return;
        }
        set({ view });
      },

      startNewGame: (teamName) => {
        const now = Date.now();
        set({
          ...freshSave(),
          teamName: teamName.trim().slice(0, 30),
          phase: 'opening',
          timing: { startedAt: now, lastPlayedAt: now, phaseStartedAt: { opening: now }, playMs: 0, phaseMs: {} },
          sessionActive: true,
          view: { screen: 'map' },
          restoreFailed: false,
        });
      },

      resume: () => set({ sessionActive: true, view: { screen: 'map' } }),

      setOpeningPage: (page) => set({ openingPage: Math.max(0, page) }),

      finishOpening: () => {
        if (get().phase === 'opening') set((s) => enterPhase(s, 'investigation'));
      },

      visit: (locationId) =>
        set((s) => {
          if (s.visitedLocations.includes(locationId)) return {};
          const next = { ...s, visitedLocations: [...s.visitedLocations, locationId] };
          return { visitedLocations: next.visitedLocations, ...withEvents(next) };
        }),

      ask: (interviewId, questionId) => {
        const s = get();
        const interview = interviewById[interviewId];
        const question = interview?.questions.find((q) => q.id === questionId);
        if (!interview || !question) return { ok: false, reason: 'unknown' };

        const asked = s.asked[interviewId] ?? [];
        if (asked.includes(questionId)) return { ok: false, reason: 'alreadyAsked' };
        if (asked.length >= interview.maxQuestions) return { ok: false, reason: 'noQuestionsLeft' };
        const p = progressOf(s);
        if (!meets(interview.availableWhen, p) || !meets(question.availableWhen, p)) {
          return { ok: false, reason: 'notAvailable' };
        }

        // Tip rules: first time for each weak class, one per interview, MAX_TIPS per game.
        let tip: string | undefined;
        const classTip = tipsByClass[question.class];
        const eligible =
          classTip &&
          s.tipsShown.length < MAX_TIPS &&
          !s.tipsShown.some((t) => t.class === question.class) &&
          !s.tipsShown.some((t) => t.interviewId === interviewId);
        if (eligible) tip = tipsByQuestion[question.id] ?? classTip;

        set({
          asked: { ...s.asked, [interviewId]: [...asked, questionId] },
          questionLog: [
            ...s.questionLog,
            { questionId, interviewId, class: question.class, at: Date.now() },
          ],
          tipsShown: tip ? [...s.tipsShown, { class: question.class, interviewId }] : s.tipsShown,
          timing: { ...s.timing, lastPlayedAt: Date.now() },
        });

        const newEvidence = get().collect(question.unlocks ?? []);
        return { ok: true, response: question.response, newEvidence, tip };
      },

      collect: (ids) => {
        const s = get();
        const fresh = [...new Set(ids)].filter((id) => evidenceById[id] && !s.evidence.includes(id));
        if (fresh.length === 0) {
          // An answer with no evidence can still be the question that fires an event.
          set(withEvents(s));
          return [];
        }
        const items = { ...s.board.items };
        let topZ = s.board.topZ;
        fresh.forEach((id, i) => {
          topZ += 1;
          items[id] = { ...inboxPosition(s.evidence.length + i), z: topZ };
        });
        const next: SaveGame = {
          ...s,
          evidence: [...s.evidence, ...fresh],
          board: { ...s.board, items, topZ },
        };
        set({
          evidence: next.evidence,
          board: next.board,
          timing: { ...s.timing, lastPlayedAt: Date.now() },
          ...withEvents(next),
        });
        return fresh;
      },

      deliverCat: () =>
        set((s) => {
          if (s.phase !== 'investigation' || s.catDelivered) return {};
          const next = { ...s, catDelivered: true };
          return { catDelivered: true, ...withEvents(next) };
        }),

      readEvent: (eventId) => {
        const event = events.find((e) => e.id === eventId);
        if (!event || !get().eventsUnread.includes(eventId)) return;
        set((s) => ({ eventsUnread: s.eventsUnread.filter((id) => id !== eventId) }));
        get().collect(event.unlocks);
      },

      moveItem: (id, x, y) =>
        set((s) => {
          const item = s.board.items[id];
          if (!item) return {};
          const topZ = s.board.topZ + 1;
          return {
            board: {
              ...s.board,
              topZ,
              items: {
                ...s.board.items,
                [id]: { ...item, x: boardX(x), y: boardY(y), z: topZ },
              },
            },
          };
        }),

      setTag: (id, tag) =>
        set((s) => {
          const item = s.board.items[id];
          if (!item) return {};
          const { tag: _old, ...rest } = item;
          return {
            board: { ...s.board, items: { ...s.board.items, [id]: tag ? { ...rest, tag } : rest } },
          };
        }),

      addNote: (x, y, kind = 'note') => {
        const id = newId('note');
        set((s) => {
          const topZ = s.board.topZ + 1;
          return {
            board: {
              ...s.board,
              topZ,
              notes: [
                ...s.board.notes,
                { id, text: '', x: boardX(x), y: boardY(y), z: topZ, color: 'yellow', kind },
              ],
            },
          };
        });
        return id;
      },

      updateNote: (id, text) =>
        set((s) => ({
          board: {
            ...s.board,
            notes: s.board.notes.map((n) =>
              n.id === id ? { ...n, text: text.slice(0, NOTE_LIMIT[n.kind ?? 'note']) } : n,
            ),
          },
        })),

      moveNote: (id, x, y) =>
        set((s) => {
          const topZ = s.board.topZ + 1;
          return {
            board: {
              ...s.board,
              topZ,
              notes: s.board.notes.map((n) =>
                n.id === id
                  ? { ...n, x: boardX(x), y: boardY(y), z: topZ }
                  : n,
              ),
            },
          };
        }),

      deleteNote: (id) =>
        set((s) => ({
          board: {
            ...s.board,
            notes: s.board.notes.filter((n) => n.id !== id),
            // Strings attached to a deleted note go with it.
            links: s.board.links.filter((l) => l.from !== id && l.to !== id),
          },
        })),

      addLink: (from, to) =>
        set((s) => {
          if (from === to) return {};
          const exists = s.board.links.some(
            (l) => (l.from === from && l.to === to) || (l.from === to && l.to === from),
          );
          if (exists) return {};
          return { board: { ...s.board, links: [...s.board.links, { id: newId('link'), from, to }] } };
        }),

      removeLink: (id) =>
        set((s) => ({ board: { ...s.board, links: s.board.links.filter((l) => l.id !== id) } })),


      saveMeetingAnswer: (meetingId, promptId, text) =>
        set((s) => ({
          meetings: {
            ...s.meetings,
            [meetingId]: { ...s.meetings[meetingId], [promptId]: text.slice(0, 500) },
          },
        })),

      beginReport: () => {
        const s = get();
        if (s.phase !== 'investigation' || !meets(readyToSolve, progressOf(s))) return false;
        set(enterPhase(s, 'report'));
        return true;
      },

      submitExplanation: (text) => {
        const s = get();
        const clean = text.trim().slice(0, EXPLANATION_MAX);
        if (s.phase !== 'report' || s.final.explanationDone || clean.length < EXPLANATION_MIN) return false;
        set({ final: { ...s.final, explanation: clean, explanationDone: true } });
        return true;
      },

      answerFinal: (optionId) =>
        set((s) => {
          if (s.phase !== 'report' || !s.final.explanationDone) return {};
          const question = finalReport[s.final.index];
          if (!question || !question.options.some((o) => o.id === optionId)) return {};
          const final = {
            ...s.final,
            index: s.final.index + 1,
            answers: { ...s.final.answers, [question.id]: optionId },
          };
          const done = final.index >= finalReport.length;
          return done ? { final, ...enterPhase(s, 'profile') } : { final };
        }),

      addPlayTime: (ms) =>
        set((s) => {
          if (!s.sessionActive || s.phase === 'start' || ms <= 0) return {};
          const counts = s.phase === 'investigation' || s.phase === 'report';
          return {
            timing: {
              ...s.timing,
              playMs: s.timing.playMs + (counts ? ms : 0),
              // Every phase is timed for the teacher, including the opening and the reveal.
              phaseMs: { ...s.timing.phaseMs, [s.phase]: (s.timing.phaseMs[s.phase] ?? 0) + ms },
            },
          };
        }),

      resetDevice: () => set({ ...freshSave(), sessionActive: false, view: { screen: 'map' }, restoreFailed: false }),

      visitAfterGame: (phase) =>
        set((s) => {
          const closing: Phase[] = ['profile', 'reveal', 'reflection'];
          // Only once the report is done; never a way into, or back to, an earlier phase.
          if (!closing.includes(s.phase) || !closing.includes(phase)) return {};
          return enterPhase(s, phase);
        }),

      continueAfter: (phase) =>
        set((s) => {
          if (s.phase !== phase) return {};
          return enterPhase(s, phase === 'profile' ? 'reveal' : 'reflection');
        }),

      devSetPhase: (phase) =>
        set((s) => ({ ...enterPhase(s, phase), sessionActive: true, view: { screen: 'map' } })),
    }),
    {
      name: SAVE_KEY,
      version: SAVE_VERSION,
      storage: createJSONStorage(() => saveStorage),
      partialize: (s) =>
        Object.fromEntries(SAVE_FIELDS.map((k) => [k, s[k]])) as unknown as GameState,
      // A save from an unknown version is discarded instead of half-loaded.
      migrate: (persisted, version) =>
        (version === SAVE_VERSION ? persisted : freshSave()) as GameState,
      // Fill in any field a save is missing, so a damaged save cannot crash the game.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SaveGame>;
        const base = freshSave();
        const valid = typeof saved === 'object' && PHASES.includes(saved.phase as Phase);
        if (!valid) return current;
        return {
          ...current,
          ...base,
          ...saved,
          board: { ...base.board, ...saved.board },
          final: { ...base.final, ...saved.final },
          timing: { ...base.timing, ...saved.timing },
        };
      },
      onRehydrateStorage: () => (_state, error) => {
        // Deferred: with synchronous storage this runs while the store is still being created.
        if (error) queueMicrotask(() => useGame.setState({ ...freshSave(), restoreFailed: true }));
      },
    },
  ),
);

// ───────────── Selectors ─────────────

/** True when a game in progress can be continued. */
export const hasSave = (s: SaveGame) => s.phase !== 'start' && s.timing.startedAt > 0;

export const canSolve = (s: SaveGame) =>
  s.phase === 'investigation' && meets(readyToSolve, progressOf(s));

/** Locations shown on the map right now. The channel stays hidden until it is discovered. */
export function visibleLocations(s: SaveGame) {
  const p = progressOf(s);
  return locations.filter((l) => meets(l.availableWhen, p));
}

/** Team meetings the player may call right now. */
export function availableMeetings(s: SaveGame) {
  const p = progressOf(s);
  return meetings.filter((m) => meets(m.availableWhen, p));
}

export function questionsLeft(s: SaveGame, interviewId: string): number {
  const interview = interviewById[interviewId];
  if (!interview) return 0;
  return interview.maxQuestions - (s.asked[interviewId]?.length ?? 0);
}

/** Questions the player may see right now (follow-ups and gated ones stay hidden). */
export function visibleQuestions(s: SaveGame, interviewId: string) {
  const interview = interviewById[interviewId];
  if (!interview) return [];
  const p = progressOf(s);
  return interview.questions.filter((q) => meets(q.availableWhen, p));
}
