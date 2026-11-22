/** Content types. Content is static data; nothing here is saved. */

export type HypothesisId = 'contagious' | 'rats' | 'supernatural' | 'contamination' | 'natural';

/** Hidden from players. Used only for tips and the Investigator Profile. */
export type QuestionClass =
  | 'strong'
  | 'useful'
  | 'medium'
  | 'vague'
  | 'irrelevant'
  | 'leading'
  | 'assumption'
  | 'opinion'
  | 'humorous';

export type EvidenceFormat =
  | 'polaroid'
  | 'statement'
  | 'clipping'
  | 'labReport'
  | 'medicalNote'
  | 'companyDoc'
  | 'letter'
  | 'map'
  | 'table'
  | 'chart'
  | 'diagram'
  | 'notice'
  | 'handwritten';

export type LocationId =
  | 'harbor'
  | 'market'
  | 'clinic'
  | 'community'
  | 'square'
  | 'rosa'
  | 'tucano'
  | 'channel'
  | 'science';

export type CharacterId =
  | 'maria'
  | 'carlos'
  | 'ana'
  | 'silva'
  | 'joao'
  | 'santos'
  | 'rosa'
  | 'roberto'
  | 'marcos';

/**
 * A condition on the player's progress. All listed fields must hold;
 * `anyOf` holds when at least one of its conditions does.
 */
export interface Condition {
  evidenceCount?: number;
  locationsVisited?: number;
  hasEvidence?: string[];
  anyEvidence?: string[];
  askedQuestion?: string[];
  visitedAny?: LocationId[];
  /** True once the dancing cat has been brought to the Regional Science Center. */
  catDelivered?: true;
  anyOf?: Condition[];
}

export interface TableData {
  columns: string[];
  rows: string[][];
}

export interface EvidenceBody {
  /** Main text. For statements this is what the witness told the player. */
  text?: string;
  /** File name in /public/images, for photographs. */
  image?: string;
  imageAlt?: string;
  table?: TableData;
  /** Label/value lines, e.g. a lab report. */
  lines?: { label: string; value: string }[];
  /** A drawing rendered by the game from code. */
  diagram?: 'foodChain' | 'harborChart' | 'sedimentMap' | 'bayMonitoring' | 'casesChart';
  /** Small print at the bottom: who signed, who sampled, date. */
  footer?: string;
}

export interface Evidence {
  id: string;
  title: string;
  format: EvidenceFormat;
  locationId: LocationId;
  /** Shown to the player: who said or produced it. */
  source: string;
  body: EvidenceBody;
  /** NEVER rendered. */
  internal: {
    relevance: 'high' | 'medium' | 'low' | 'redHerring';
    supports: HypothesisId[];
    weakens: HypothesisId[];
  };
}

export interface Question {
  id: string;
  text: string;
  response: string;
  class: QuestionClass;
  unlocks?: string[];
  /** Follow-ups and knowledge-gated questions stay hidden until this holds. */
  availableWhen?: Condition;
}

export interface Interview {
  id: string;
  characterId: CharacterId;
  locationId: LocationId;
  maxQuestions: number;
  questions: Question[];
  availableWhen?: Condition;
}

export interface Hotspot {
  id: string;
  /** What the player sees when the object is highlighted. */
  label: string;
  /** Position as a percentage of the scene image. Tuned when art arrives. */
  x: number;
  y: number;
  unlocks: string[];
}

export interface Location {
  id: LocationId;
  name: string;
  image: string;
  imageAlt: string;
  mapPos: { x: number; y: number };
  /** One or two sentences read on arrival. */
  intro: string;
  interviews: string[];
  hotspots: Hotspot[];
  availableWhen?: Condition;
}

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  portrait: string;
}

export interface Hypothesis {
  id: HypothesisId;
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  title: string;
  description: string;
}

/** Something delivered to the player when a condition is met. */
export interface GameEvent {
  id: string;
  when: Condition;
  title: string;
  message: string;
  unlocks: string[];
}

export interface Meeting {
  id: string;
  /** Shown on the card in the list of talks. */
  title: string;
  /** What the partner says when the talk begins. */
  partnerSays: string;
  availableWhen: Condition;
  prompts: { id: string; text: string }[];
}

export type Dimension =
  | 'questionQuality'
  | 'evidenceAnalysis'
  | 'logicalReasoning'
  | 'sourceEvaluation'
  | 'systemsThinking';

export interface FinalQuestion {
  id: string;
  heading: string;
  prompt: string;
  options: { id: string; text: string }[];
  correct: string;
  dimension: Dimension;
  evidenceRefs: string[];
}

export interface Tip {
  id: string;
  text: string;
}
