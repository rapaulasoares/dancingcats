import { useGame, type View } from '../../state/store';
import { BoardScreen } from '../board/BoardScreen';
import { InterviewScreen } from '../interview/InterviewScreen';
import { LocationScene } from '../location/LocationScene';
import { MapScreen } from '../map/MapScreen';
import { MeetingScreen } from '../meeting/MeetingScreen';
import { ReadyGate } from './ReadyGate';
import styles from './Investigation.module.css';
import { TopBar } from './TopBar';

function Screen({ view }: { view: View }) {
  switch (view.screen) {
    case 'map':
      return <MapScreen />;
    case 'location':
      return <LocationScene locationId={view.locationId} />;
    case 'interview':
      // The key gives each interview its own fresh screen.
      return <InterviewScreen key={view.interviewId} interviewId={view.interviewId} />;
    case 'board':
      return <BoardScreen />;
    case 'meeting':
      return <MeetingScreen />;
    case 'solve':
      return <ReadyGate />;
  }
}

export function Investigation() {
  const view = useGame((s) => s.view);
  return (
    <div className={styles.layout}>
      <TopBar />
      <div
        key={view.screen === 'location' ? view.locationId : view.screen}
        className="screen-enter screen-enter--fill"
      >
        <Screen view={view} />
      </div>
    </div>
  );
}
