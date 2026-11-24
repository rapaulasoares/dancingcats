import { useEffect, useRef, useState } from 'react';
import { characters } from '../../content/characters';
import { ROUND_COUNT, townMeeting } from '../../content/townMeeting';
import { meetingStatus } from '../../state/meeting';
import { useGame } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import { PlayClock } from '../clock/PlayClock';
import { CaseEnding } from './CaseEnding';
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

  if (finished) return <CaseEnding solved={status.solved} onContinue={finishMeeting} />;

  const lock = () => {
    if (!draft || reaction) return;
    const after = meetingStatus({ ...answers, [step.id]: draft });
    const right = after.right > status.right;
    answerFinal(draft);
    setReaction({ index: shownIndex, right, streak: after.streak });
  };

  const lockedAnswer = reaction ? answers[step.id] : undefined;

  return (
    <main className={styles.scene}>
      <header className={styles.hud}>
        <PlayClock />
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
            {step.prompt}
          </p>
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
          <p className={styles.reactText}>
            {reaction.right
              ? reaction.streak >= 2
                ? `👏 The crowd applauds! ${reaction.streak} in a row!`
                : '👏 The crowd applauds!'
              : '😟 A worried murmur runs through the square…'}
          </p>
          <button className="btn" autoFocus onClick={() => setReaction(null)}>
            Continue
          </button>
        </footer>
      ) : (
        <footer className={styles.actions}>
          <button type="button" className="btn btn--quiet" onClick={() => setShowBoard(true)}>
            Look at the Evidence Board
          </button>
          <button type="button" className={`btn ${styles.answer}`} disabled={!draft} onClick={lock}>
            Answer
          </button>
        </footer>
      )}

      {showBoard && <BoardOverlay onClose={() => setShowBoard(false)} />}
    </main>
  );
}
