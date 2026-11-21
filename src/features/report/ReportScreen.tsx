import { useEffect, useMemo, useRef, useState } from 'react';
import { finalReport } from '../../content/finalReport';
import { shuffled } from '../../state/scoring';
import { EXPLANATION_MAX, EXPLANATION_MIN, useGame } from '../../state/store';
import { useFocusTrap } from '../../ui/useFocusTrap';
import { BoardScreen } from '../board/BoardScreen';
import { PlayClock } from '../clock/PlayClock';
import styles from './ReportScreen.module.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * The Final Investigation Report: one question per screen. An answer is locked
 * when submitted; there is no way back and no feedback until the whole report
 * is finished, so one answer cannot give away another.
 */
function Questions() {
  const index = useGame((s) => s.final.index);
  const startedAt = useGame((s) => s.timing.startedAt);
  const answerFinal = useGame((s) => s.answerFinal);

  const question = finalReport[Math.min(index, finalReport.length - 1)];
  // Stable for this team and question, so a refresh shows the same order.
  const options = useMemo(
    () => shuffled(question.options, `${startedAt}:${question.id}`),
    [question, startedAt],
  );

  const [selected, setSelected] = useState<string | null>(null);
  const [showBoard, setShowBoard] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Each new question starts with nothing selected and the focus on its text.
  useEffect(() => {
    setSelected(null);
    headingRef.current?.focus();
  }, [question.id]);

  return (
    <main className={styles.screen}>
      <form
        className={styles.sheet}
        onSubmit={(e) => {
          e.preventDefault();
          if (selected) answerFinal(selected);
        }}
      >
        <header className={styles.header}>
          <p className={styles.kicker}>Final Investigation Report</p>
          <PlayClock tone="dark" />
          <p className={styles.progress} aria-label={`Question ${index + 1} of ${finalReport.length}`}>
            {finalReport.map((q, i) => (
              <span key={q.id} className={i < index ? styles.stepDone : i === index ? styles.stepNow : styles.step} />
            ))}
            <span className={styles.progressText}>
              {index + 1} of {finalReport.length}
            </span>
          </p>
        </header>

        <h1 className={styles.prompt} ref={headingRef} tabIndex={-1}>
          {question.prompt}
        </h1>

        <fieldset className={styles.options}>
          <legend className={styles.srOnly}>Choose one answer</legend>
          {options.map((option, i) => (
            <label key={option.id} className={selected === option.id ? styles.optionChosen : styles.option}>
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
              />
              <span className={styles.letter} aria-hidden="true">
                {LETTERS[i]}
              </span>
              <span>{option.text}</span>
            </label>
          ))}
        </fieldset>

        <footer className={styles.footer}>
          <button type="button" className="btn btn--quiet" onClick={() => setShowBoard(true)}>
            Look at the Evidence Board
          </button>
          <div className={styles.submit}>
            <span className={styles.lockNote}>Your answer is locked once you submit it.</span>
            <button type="submit" className="btn" disabled={!selected}>
              {index === finalReport.length - 1 ? 'Submit and finish the report' : 'Submit answer'}
            </button>
          </div>
        </footer>
      </form>

      {showBoard && <BoardOverlay onClose={() => setShowBoard(false)} />}
    </main>
  );
}

/** The team's own board, to consult while answering. Nothing on it can be changed. */
function BoardOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);
  return (
    <div
      ref={ref}
      className={styles.boardOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="Your Evidence Board, read only"
    >
      <div className={styles.boardBar}>
        <span>Your Evidence Board — you can read it, but not change it</span>
        <button className="btn" autoFocus onClick={onClose}>
          Back to the report
        </button>
      </div>
      <BoardScreen readOnly />
    </div>
  );
}

/**
 * Before any question is shown, the player explains the case in their own
 * words. The answer is locked like the others, and appears in the profile.
 */
function ExplanationStep() {
  const submitExplanation = useGame((s) => s.submitExplanation);
  const [text, setText] = useState('');
  const [showBoard, setShowBoard] = useState(false);
  const length = text.trim().length;
  const ready = length >= EXPLANATION_MIN;

  return (
    <main className={styles.screen}>
      <form
        className={styles.sheet}
        onSubmit={(e) => {
          e.preventDefault();
          submitExplanation(text);
        }}
      >
        <header className={styles.header}>
          <p className={styles.kicker}>Final Investigation Report</p>
          <PlayClock tone="dark" />
          <p className={styles.progressText}>In your own words</p>
        </header>

        <label className={styles.prompt} htmlFor="explanation">
          What do you think is happening in Vila do Sol, and why?
        </label>
        <p className={styles.explainHelp}>
          Write two or three sentences. Say what you think is happening, and which evidence makes you think so.
        </p>
        <textarea
          id="explanation"
          className={styles.explanation}
          rows={5}
          maxLength={EXPLANATION_MAX}
          value={text}
          autoFocus
          onChange={(e) => setText(e.target.value)}
        />

        <footer className={styles.footer}>
          <button type="button" className="btn btn--quiet" onClick={() => setShowBoard(true)}>
            Look at the Evidence Board
          </button>
          <div className={styles.submit}>
            <span className={styles.lockNote}>
              {ready ? 'Your answer is locked once you submit it.' : 'Write a little more before you continue.'}
            </span>
            <button type="submit" className="btn" disabled={!ready}>
              Lock my answer and see the questions
            </button>
          </div>
        </footer>
      </form>

      {showBoard && <BoardOverlay onClose={() => setShowBoard(false)} />}
    </main>
  );
}

export function ReportScreen() {
  const explained = useGame((s) => s.final.explanationDone);
  return explained ? <Questions /> : <ExplanationStep />;
}
