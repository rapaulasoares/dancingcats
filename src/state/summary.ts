import { evidence } from '../content/evidence';
import { finalReport } from '../content/finalReport';
import { meetingStatus } from './meeting';
import { buildProfile } from './scoring';
import { PHASES, type SaveGame } from './store';

/**
 * An anonymous record of one game, for the teacher to export after a session.
 * It deliberately leaves out the team name and everything the students typed
 * (notes and meeting answers); only counts and the choices they made remain.
 */
export function buildSessionSummary(save: SaveGame) {
  const finished = PHASES.indexOf(save.phase) > PHASES.indexOf('report') || Object.keys(save.final.answers).length >= finalReport.length;
  const profile = finished ? buildProfile(save) : null;
  const classCounts: Record<string, number> = {};
  for (const entry of save.questionLog) classCounts[entry.class] = (classCounts[entry.class] ?? 0) + 1;

  const minutes = (ms: number | undefined) => Math.round(((ms ?? 0) / 60000) * 10) / 10;
  const tags = Object.values(save.board.items).reduce<Record<string, number>>((acc, item) => {
    if (item.tag) acc[item.tag] = (acc[item.tag] ?? 0) + 1;
    return acc;
  }, {});

  return {
    game: 'The Mystery of the Dancing Cats',
    summaryVersion: 1,
    exportedAt: new Date().toISOString(),
    phaseReached: save.phase,
    finished,
    minutes: {
      investigationAndReport: minutes(save.timing.playMs),
      byPhase: Object.fromEntries(PHASES.map((p) => [p, minutes(save.timing.phaseMs[p])])),
    },
    locationsVisited: save.visitedLocations,
    evidence: {
      collected: save.evidence.length,
      available: evidence.length,
      ids: save.evidence,
    },
    questions: {
      asked: save.questionLog.length,
      inOrder: save.questionLog.map((q) => ({ id: q.questionId, class: q.class })),
      byClass: classCounts,
      tipsShown: save.tipsShown.length,
    },
    board: {
      tagged: tags,
      notes: save.board.notes.filter((n) => n.kind !== 'conclusion').length,
      conclusions: save.board.notes.filter((n) => n.kind === 'conclusion').length,
      // How many conclusion cards are tied to at least one piece of evidence (the text itself is never exported).
      conclusionsWithEvidence: save.board.notes.filter(
        (n) => n.kind === 'conclusion' && save.board.links.some((l) => l.from === n.id || l.to === n.id),
      ).length,
      strings: save.board.links.length,
    },
    meetings: Object.fromEntries(
      Object.entries(save.meetings).map(([id, answers]) => [
        id,
        { promptsAnswered: Object.values(answers).filter((text) => text.trim()).length },
      ]),
    ),
    report: finished
      ? {
          solved: meetingStatus(save.final.answers).solved,
          bestStreak: meetingStatus(save.final.answers).bestStreak,
          correct: profile!.correctCount,
          outOf: finalReport.length,
          answers: profile!.answers.map((a) => ({ question: a.questionId, chosen: a.chosen, correct: a.isCorrect })),
          levels: Object.fromEntries(profile!.dimensions.map((d) => [d.id, d.level])),
        }
      : null,
  };
}

export type SessionSummary = ReturnType<typeof buildSessionSummary>;
