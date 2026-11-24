import { useGame } from '../../state/store';
import { formatPlayTime } from '../clock/PlayClock';
import styles from './CaseEnding.module.css';

/**
 * The end of the meeting. Solved: a case folder closes over its papers and a stamp lands on the cover,
 * with the time it took in big type. Not solved: the folder stays open and no time is shown.
 * Every animation ends in the finished picture, so with reduced motion the player simply sees that.
 */
export function CaseEnding({ solved, onContinue }: { solved: boolean; onContinue: () => void }) {
  const playMs = useGame((s) => s.timing.playMs);

  return (
    <main className={styles.scene}>
      <section className={styles.card} aria-labelledby="ending-title">
        <div className={solved ? styles.folder : styles.folderOpen} aria-hidden="true">
          <div className={styles.back} />
          <div className={styles.papers}>
            <span className={styles.paper} />
            <span className={styles.paper} />
            <span className={styles.paper} />
          </div>
          <div className={styles.cover}>
            <span className={styles.tab}>Vila do Sol</span>
            {solved && <span className={styles.stamp}>Case solved</span>}
          </div>
          {solved && (
            <>
              <span className={`${styles.star} ${styles.s1}`}>★</span>
              <span className={`${styles.star} ${styles.s2}`}>★</span>
              <span className={`${styles.star} ${styles.s3}`}>★</span>
            </>
          )}
        </div>

        {solved ? (
          <>
            <h1 id="ending-title" className={styles.title}>
              You solved the case in
            </h1>
            <p className={styles.time} role="timer" aria-label={`Time: ${formatPlayTime(playMs)}`}>
              {formatPlayTime(playMs)}
            </p>
            <p className={styles.fastest}>Were you the fastest in the class?</p>
            <p className={styles.text}>
              Tucano Industrial keeps operating, but it must improve its wastewater treatment to remove heavy metals,
              and its water will be tested regularly by an outside laboratory. João and Marcos are relieved.
            </p>
          </>
        ) : (
          <>
            <h1 id="ending-title" className={styles.title}>
              The mystery is not solved yet
            </h1>
            <p className={styles.text}>Some of the town's questions are still open. Let's find out what really happened.</p>
          </>
        )}

        <button className="btn" autoFocus onClick={onContinue}>
          Continue
        </button>
      </section>
    </main>
  );
}
