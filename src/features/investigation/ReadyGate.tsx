import { BALANCE } from '../../content/balance';
import { canSolve, useGame } from '../../state/store';
import styles from './ReadyGate.module.css';

/**
 * The last stop before the Final Investigation Report. The player must decide
 * that the mystery is solved; no question is shown until they say so, and
 * there is no way back afterwards.
 */
export function ReadyGate() {
  const ready = useGame(canSolve);
  const unreadMessage = useGame((s) => s.eventsUnread.length > 0);
  const evidenceCount = useGame((s) => s.evidence.length);
  const placesVisited = useGame((s) => s.visitedLocations.length);
  const goTo = useGame((s) => s.goTo);
  const beginReport = useGame((s) => s.beginReport);

  return (
    <section className={styles.screen} aria-label="Have you solved the mystery?">
      <div className={styles.folder}>
        <p className={styles.stamp} aria-hidden="true">
          Case file
        </p>
        <h1 className={styles.title}>Have you solved the mystery?</h1>

        <p>
          Begin the Final Investigation Report <strong>only when you believe you know what is happening in Vila do
          Sol</strong> and can explain it with your evidence.
        </p>
        <p>If you are not sure yet, keep investigating. There is no hurry.</p>

        <ul className={styles.rules}>
          <li>The questions appear only after you begin.</li>
          <li>
            Once you begin, you <strong>cannot return to Vila do Sol</strong>.
          </li>
          <li>Each answer is locked when you submit it.</li>
        </ul>

        {unreadMessage && (
          <p className={styles.warning} role="alert">
            You have a message you have not read yet. It may hold evidence you need.
          </p>
        )}
        {evidenceCount < BALANCE.earlyWarningEvidence && (
          <p className={styles.warning} role="alert">
            So far you have collected {evidenceCount} {evidenceCount === 1 ? 'piece' : 'pieces'} of evidence and
            visited {placesVisited} of 9 places. You may begin now if you wish, but you will not be able to come
            back for more.
          </p>
        )}

        <div className={styles.actions}>
          <div className={styles.notYet}>
            <button className="btn btn--quiet" onClick={() => goTo({ screen: 'map' })}>
              Not yet — keep investigating
            </button>
            <button className="btn btn--quiet" onClick={() => goTo({ screen: 'board' })}>
              Review evidence
            </button>
          </div>
          <button className={`btn ${styles.begin}`} disabled={!ready} onClick={() => beginReport()}>
            I believe I have solved the mystery
            <span>Begin the Final Report</span>
          </button>
        </div>
      </div>
    </section>
  );
}
