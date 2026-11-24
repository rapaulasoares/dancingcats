import { useEffect, useRef, useState } from 'react';
import { characters } from '../../content/characters';
import { partner } from '../../content/meetings';
import { ROUND_COUNT, townMeeting } from '../../content/townMeeting';
import { cluesNeedingThoughts, meetingStatus, whatsonSays } from '../../state/meeting';
import { useGame } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import { Typewriter } from '../../ui/Typewriter';
import { play } from '../../ui/sound';
import { SoundToggle } from '../../ui/SoundToggle';
import { PlayClock } from '../clock/PlayClock';
import { CaseEnding } from './CaseEnding';
import { MeetingIntro } from './MeetingIntro';
import { BoardOverlay } from './BoardOverlay';
import { StepInput } from './StepInput';
import styles from './TownMeeting.module.css';

const portraitOf = (speaker: string) =>
  characters.find((c) => speaker.replace('Prof.', 'Professor') === c.name || speaker === c.name)?.portrait ?? 'char-partner.webp';

/** What the crowd does after an answer. Nothing here says what the right answer was. */
interface Reaction {
  /** Which step it belongs to. */
  index: number;
  right: boolean;
  streak: number;
  /** What Whatson says about this answer. */
  comment: string;
}

/**
 * The town meeting in the square: the new ending. One answer at a time, with an immediate reaction
 * from the crowd, a trust bar for the whole town and a streak. There is no retry.
 */
export function TownMeeting() {
  const index = useGame((s) => s.final.index);
  const answers = useGame((s) => s.final.answers);
  const startedAt = useGame((s) => s.timing.startedAt);
  const answerFinal = useGame((s) => s.answerFinal);
  const finishMeeting = useGame((s) => s.finishMeeting);

  // The meeting opens on its own screen. A game that is already under way skips it.
  const [started, setStarted] = useState(index > 0);
  const [draft, setDraft] = useState<string | null>(null);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [showBoard, setShowBoard] = useState(false);
  const bubbleRef = useRef<HTMLParagraphElement>(null);

  const status = meetingStatus(answers);
  // While the crowd reacts, the answered step stays on screen; the store has already moved on.
  const shownIndex = reaction ? reaction.index : index;
  const step = townMeeting[shownIndex];
  const finished = !step;

  useEffect(() => {
    setDraft(null);
    bubbleRef.current?.focus();
  }, [shownIndex]);

  // The thoughts step only exists for clues that have thoughts to choose from; otherwise it is skipped silently.
  const skipThoughts = !finished && !reaction && step.kind === 'inference' && cluesNeedingThoughts(answers.P1).length === 0;
  useEffect(() => {
    if (skipThoughts) answerFinal('skip');
  }, [skipThoughts, answerFinal]);
  if (skipThoughts) return null;

  if (!started && !finished) {
    return (
      <>
        <MeetingIntro onStart={() => setStarted(true)} onBoard={() => setShowBoard(true)} />
        {showBoard && <BoardOverlay onClose={() => setShowBoard(false)} />}
      </>
    );
  }
  if (finished) return <CaseEnding solved={status.solved} onContinue={finishMeeting} />;

  const lock = () => {
    if (!draft || reaction) return;
    const after = meetingStatus({ ...answers, [step.id]: draft });
    const right = after.right > status.right;
    answerFinal(draft);
    setReaction({ index: shownIndex, right, streak: after.streak, comment: whatsonSays(step, draft, right) });
    play(right ? 'applause' : 'murmur');
  };

  const lockedAnswer = reaction ? answers[step.id] : undefined;

  return (
    <main className={styles.scene}>
      <header className={styles.hud}>
        <PlayClock />
        <SoundToggle className={styles.soundToggle} />
        <ol className={styles.rounds} aria-label={`Round ${step.round} of ${ROUND_COUNT}`}>
          {Array.from({ length: ROUND_COUNT }, (_, i) => (
            <li key={i} className={i + 1 < step.round ? styles.roundDone : i + 1 === step.round ? styles.roundNow : styles.round} />
          ))}
        </ol>
        <div className={styles.trust}>
          <span className={styles.trustLabel}>The town trusts you</span>
          <div
            className={styles.trustBar}
            role="meter"
            aria-label="Trust of the town"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={status.trust}
          >
            <span className={styles.trustFill} style={{ width: `${status.trust}%` }} />
          </div>
          {status.streak >= 2 && (
            <span className={styles.streak} key={status.streak}>
              ×{status.streak}
            </span>
          )}
        </div>
      </header>

      <section className={styles.stage}>
        <div className={styles.speaker}>
          <GameImage file={portraitOf(step.speaker)} alt={step.speaker} ratio="3 / 4" className={styles.portrait} />
          <p className={styles.speakerName}>{step.speaker}</p>
        </div>
        <div className={styles.talk}>
          <p className={styles.bubble} ref={bubbleRef} tabIndex={-1}>
            {/* The full text keeps the bubble the same size while the letters appear on top of it. */}
            <span className={styles.ghost} aria-hidden="true">
              {step.prompt}
            </span>
            <span className={styles.typed}>
              <Typewriter key={step.id} text={step.prompt} msPerChar={16} />
            </span>
          </p>
          <p className={styles.hint}>{step.hint}</p>
          <StepInput
            key={step.id}
            step={step}
            seed={`${startedAt}`}
            locked={lockedAnswer}
            onChange={setDraft}
          />
        </div>
      </section>

      {reaction ? (
        <footer className={reaction.right ? styles.reactRight : styles.reactWrong} role="status">
          <div className={styles.reactBody}>
            <p className={styles.reactText}>
              {reaction.right
                ? reaction.streak >= 2
                  ? `👏 The crowd applauds! ${reaction.streak} in a row!`
                  : '👏 The crowd applauds!'
                : '😟 A worried murmur runs through the square…'}
            </p>
            <p className={styles.whatsonSays}>
              <strong>Whatson:</strong> {reaction.comment}
            </p>
          </div>
          <div className={styles.corner}>
            <WhatsonCorner />
            <button className="btn" autoFocus onClick={() => setReaction(null)}>
              Continue
            </button>
          </div>
        </footer>
      ) : (
        <footer className={styles.actions}>
          <button type="button" className="btn btn--quiet" onClick={() => setShowBoard(true)}>
            Look at the Evidence Board
          </button>
          <div className={styles.corner}>
            <WhatsonCorner />
            <button type="button" className={`btn ${styles.answer}`} disabled={!draft} onClick={lock}>
              Answer
            </button>
          </div>
        </footer>
      )}

      {showBoard && <BoardOverlay onClose={() => setShowBoard(false)} />}
    </main>
  );
}

/** Whatson Urmind, always in the corner of the question screens. */
function WhatsonCorner() {
  return (
    <div className={styles.whatson}>
      <GameImage file={partner.portrait} alt="Whatson Urmind, your thinking partner" ratio="1 / 1" className={styles.whatsonPortrait} />
      <span className={styles.whatsonName}>Whatson</span>
    </div>
  );
}
