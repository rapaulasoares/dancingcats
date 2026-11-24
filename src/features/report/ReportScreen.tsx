import { useEffect, useMemo, useRef, useState } from 'react';
import { finalReport } from '../../content/finalReport';
import { ANSWER_SEPARATOR, type MeetingStep } from '../../content/townMeeting';
import { isValidAnswer } from '../../state/meeting';
import { shuffled } from '../../state/scoring';
import { useGame } from '../../state/store';
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

        {(question.kind === 'order' || question.kind === 'sentence') && (
          <TemporaryPicker key={question.id} step={question} onChange={setSelected} />
        )}

        <fieldset className={styles.options} hidden={question.kind === 'order' || question.kind === 'sentence'}>
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
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        <footer className={styles.footer}>
          <button type="button" className="btn btn--quiet" onClick={() => setShowBoard(true)}>
            Look at the Evidence Board
          </button>
          <div className={styles.submit}>
            <span className={styles.lockNote}>Your answer is locked once you submit it.</span>
            <button type="submit" className="btn" disabled={!selected || !isValidAnswer(question, selected)}>
              {index === finalReport.length - 1 ? 'Submit and finish the report' : 'Submit answer'}
            </button>
          </div>
        </footer>
      </form>

      {showBoard && <BoardOverlay onClose={() => setShowBoard(false)} />}
    </main>
  );
}

/**
 * Stand-in until the meeting scene has its own pieces: order and sentence steps are filled in with
 * plain selects. Replaced in the next stage.
 */
function TemporaryPicker({ step, onChange }: { step: MeetingStep; onChange: (answer: string | null) => void }) {
  const count = step.kind === 'order' ? step.options.length : (step.sentence?.slots.length ?? 0);
  const [picked, setPicked] = useState<string[]>(Array(count).fill(''));
  const choices =
    step.kind === 'order'
      ? step.options.map((o) => ({ id: o.id, text: o.label }))
      : null;
  return (
    <div className={styles.options}>
      {picked.map((value, i) => (
        <select
          key={i}
          aria-label={step.kind === 'order' ? `Step ${i + 1}` : `Blank ${i + 1}`}
          value={value}
          onChange={(e) => {
            const next = picked.map((p, j) => (j === i ? e.target.value : p));
            setPicked(next);
            onChange(next.every(Boolean) ? next.join(ANSWER_SEPARATOR) : null);
          }}
        >
          <option value="">Choose…</option>
          {(choices ?? step.sentence!.slots[i].options).map((o) => (
            <option key={o.id} value={o.id}>
              {o.text}
            </option>
          ))}
        </select>
      ))}
    </div>
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

export function ReportScreen() {
  return <Questions />;
}
