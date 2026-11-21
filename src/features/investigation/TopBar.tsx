import { interviewById } from '../../content/interviews';
import { availableMeetings, canSolve, useGame } from '../../state/store';
import { PlayClock } from '../clock/PlayClock';
import { StoryButton } from '../opening/StoryButton';
import { Messages } from './Messages';
import styles from './TopBar.module.css';

/** Always visible during the investigation. */
export function TopBar() {
  const save = useGame();
  const { view, goTo, teamName } = save;
  const evidenceCount = save.evidence.length;
  const meetingReady = availableMeetings(save).length > 0;
  const solveReady = canSolve(save);
  const onMap = view.screen === 'map';

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        {onMap ? (
          <span className={styles.place}>Vila do Sol</span>
        ) : (
          <button
            className="btn btn--quiet"
            onClick={() => {
              // Leaving an interview returns to the place where it happens.
              const interview = view.screen === 'interview' ? interviewById[view.interviewId] : undefined;
              goTo(interview ? { screen: 'location', locationId: interview.locationId } : { screen: 'map' });
            }}
          >
            {view.screen === 'interview' ? '← Back' : '← Map'}
          </button>
        )}
        <span className={styles.team}>{teamName}</span>
        <PlayClock />
        <StoryButton />
      </div>

      <nav className={styles.actions} aria-label="Investigation">
        <Messages />
        <button
          className="btn btn--quiet"
          aria-current={view.screen === 'board' ? 'page' : undefined}
          onClick={() => goTo({ screen: 'board' })}
        >
          Evidence Board
          <span className={styles.count} aria-label={`${evidenceCount} pieces of evidence`}>
            {evidenceCount}
          </span>
        </button>

        <button
          className="btn btn--quiet"
          disabled={!meetingReady}
          title={meetingReady ? undefined : 'Collect more evidence before you talk it over with your partner.'}
          onClick={() => goTo({ screen: 'meeting' })}
        >
          Talk to your partner
        </button>

        <button
          className="btn"
          disabled={!solveReady}
          title={solveReady ? undefined : 'Available during the investigation.'}
          onClick={() => goTo({ screen: 'solve' })}
        >
          Solve the Mystery
        </button>
      </nav>
    </header>
  );
}
