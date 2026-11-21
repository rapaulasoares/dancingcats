import type { Condition } from './types';

/** The part of the player's progress that conditions can look at. */
export interface Progress {
  evidence: string[];
  visitedLocations: string[];
  askedQuestions: string[];
}

export function meets(condition: Condition | undefined, p: Progress): boolean {
  if (!condition) return true;
  const c = condition;
  if (c.evidenceCount !== undefined && p.evidence.length < c.evidenceCount) return false;
  if (c.locationsVisited !== undefined && p.visitedLocations.length < c.locationsVisited) return false;
  if (c.hasEvidence && !c.hasEvidence.every((id) => p.evidence.includes(id))) return false;
  if (c.anyEvidence && !c.anyEvidence.some((id) => p.evidence.includes(id))) return false;
  if (c.askedQuestion && !c.askedQuestion.every((id) => p.askedQuestions.includes(id))) return false;
  if (c.visitedAny && !c.visitedAny.some((id) => p.visitedLocations.includes(id))) return false;
  if (c.anyOf && !c.anyOf.some((sub) => meets(sub, p))) return false;
  return true;
}
