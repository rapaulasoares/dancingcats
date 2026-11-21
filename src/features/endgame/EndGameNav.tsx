import { useGame } from '../../state/store';
import { StoryButton } from '../opening/StoryButton';
import styles from './EndGameNav.module.css';

const PAGES = [
  { phase: 'profile', label: 'Investigator Profile' },
  { phase: 'reveal', label: 'The real story' },
  { phase: 'reflection', label: 'Reflection' },
] as const;

/**
 * Shown once the Final Report is finished. From here on nothing can be lost or
 * spoiled, so the player may move freely between the closing screens and
 * re-read the opening story. The investigation and the report stay closed.
 */
export function EndGameNav() {
  const phase = useGame((s) => s.phase);
  const visitAfterGame = useGame((s) => s.visitAfterGame);

  return (
    <nav className={styles.bar} aria-label="After the investigation">
      {PAGES.map((page) => (
        <button
          key={page.phase}
          className={page.phase === phase ? styles.current : styles.link}
          aria-current={page.phase === phase ? 'page' : undefined}
          onClick={() => visitAfterGame(page.phase)}
        >
          {page.label}
        </button>
      ))}
      <StoryButton className={styles.link} />
    </nav>
  );
}
