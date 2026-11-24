import type { ReactNode } from 'react';
import { useGame, type Phase } from '../state/store';
import { EndGameNav } from './endgame/EndGameNav';
import { Investigation } from './investigation/Investigation';
import { OpeningBook } from './opening/OpeningBook';
import { ProfileScreen } from './profile/ProfileScreen';
import { ReflectionScreen } from './reflection/ReflectionScreen';
import { TownMeeting } from './town/TownMeeting';
import { RevealSequence } from './reveal/RevealSequence';
import { StartScreen } from './start/StartScreen';

const SCREENS: Record<Phase, ReactNode> = {
  start: <StartScreen />,
  opening: <OpeningBook />,
  investigation: <Investigation />,
  report: <TownMeeting />,
  profile: <ProfileScreen />,
  reveal: <RevealSequence />,
  reflection: <ReflectionScreen />,
};

/** The closing screens, open to free browsing once the report is finished. */
const AFTER_GAME: Phase[] = ['profile', 'reveal', 'reflection'];

export function PhaseRouter() {
  const phase = useGame((s) => s.phase);
  const sessionActive = useGame((s) => s.sessionActive);
  // Every visit begins on the start screen, where a saved game can be continued.
  if (!sessionActive) return <StartScreen />;

  if (AFTER_GAME.includes(phase)) {
    return (
      <div className="after-game">
        <EndGameNav />
        <div key={phase} className="screen-enter screen-enter--fill">
          {SCREENS[phase]}
        </div>
      </div>
    );
  }

  return (
    <div key={phase} className="screen-enter">
      {SCREENS[phase]}
    </div>
  );
}
