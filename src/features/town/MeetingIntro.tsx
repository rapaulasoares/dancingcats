import { characters } from '../../content/characters';
import { GameImage } from '../../ui/GameImage';
import { PlayClock } from '../clock/PlayClock';
import styles from './MeetingIntro.module.css';

/**
 * The first screen of the ending: the whole town is in the square and the investigator is about to
 * present the solution. The play clock keeps running from the moment the player entered the map.
 */
export function MeetingIntro({ onStart, onBoard }: { onStart: () => void; onBoard: () => void }) {
  // Everyone the investigator met is in the square, not only those who will ask a question.
  const people = characters;
  return (
    <main className={styles.scene}>
      <header className={styles.hud}>
        <PlayClock />
      </header>

      <section className={styles.card} aria-labelledby="meeting-title">
        <p className={styles.kicker}>Vila do Sol · the town square</p>
        <h1 id="meeting-title" className={styles.title}>
          The town meeting
        </h1>
        <p className={styles.text}>
          Evening has come, and the whole town has gathered in the square. Everyone is waiting for you. It is time to
          present your solution to the case.
        </p>
        <p className={styles.text}>
          The residents have questions for you. Answer them with what the evidence shows.
        </p>

        <ul className={styles.crowd} aria-label="Everyone gathered at the meeting">
          {people.map((c) => (
            <li key={c.id} className={styles.person}>
              <GameImage file={c.portrait} alt="" ratio="3 / 4" className={styles.portrait} />
              <span className={styles.name}>{c.name.replace('Professor', 'Prof.')}</span>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button type="button" className="btn btn--quiet" onClick={onBoard}>
            Look at the Evidence Board
          </button>
          <button type="button" className="btn" autoFocus onClick={onStart}>
            Face the town
          </button>
        </div>
      </section>
    </main>
  );
}
