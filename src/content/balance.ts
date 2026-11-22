/**
 * Every number that controls how long the game takes and how hard it is.
 * Change values here after classroom playtests; nothing else needs editing.
 * See docs/08-playtest-guide.md for what each lever does.
 */
export const BALANCE = {
  /** Questions the player may ask each character (out of the 8 offered). */
  questions: {
    maria: 4,
    carlos: 4,
    ana: 4,
    silva: 4,
    joao: 4,
    marcos: 3,
    santos: 4,
    rosa: 4,
    roberto: 4,
    /** Professor Roberto's second conversation, after the lab results (out of 4). */
    roberto2: 2,
  },
  /** Evidence needed before the first Team Meeting can be called. */
  meeting1Evidence: 5,
  /** Evidence needed for the second Team Meeting (it also opens when the lab results arrive). */
  meeting2Evidence: 10,
  /**
   * When the mud and water samples from around the bay arrive. The tissue analysis comes as soon
   * as the dancing cat is brought to the Science Center; these come later, after more investigating.
   */
  bayResults: { evidenceCount: 12, locationsVisited: 5 },
  /**
   * When "Solve the Mystery" becomes available. Zero means from the first
   * moment: the player decides when they are ready, and may decide too early.
   */
  readyToSolve: { evidenceCount: 0, locationsVisited: 0 },
  /**
   * Below this much evidence, the "Have you solved the mystery?" screen adds a
   * neutral reminder of how little has been collected. It never blocks.
   */
  earlyWarningEvidence: 12,
  /** Most Investigator Tips in one game. */
  maxTips: 5,
  /** How long in a scene, without finding anything, before the objects show their labels. */
  lookAroundMs: 20_000,
} as const;
