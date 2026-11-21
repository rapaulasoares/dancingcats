import { PhaseRouter } from './features/PhaseRouter';
import { usePlayClock } from './features/clock/PlayClock';
import { DevPhaseSwitcher } from './features/dev/DevPhaseSwitcher';
import { ErrorBoundary } from './ui/ErrorBoundary';

/**
 * The developer shortcuts can jump straight to any phase, which would let a
 * player skip the investigation. They are never part of the published game,
 * and even while developing they appear only when the address ends in "?dev".
 */
const showDevTools = import.meta.env.DEV && new URLSearchParams(window.location.search).has('dev');

export function App() {
  usePlayClock();
  return (
    <>
      <ErrorBoundary>
        <PhaseRouter />
      </ErrorBoundary>

      {/* Shown by CSS only on screens too narrow for the game. */}
      <div className="too-small" role="alert">
        <p>
          <strong>This game needs a bigger screen.</strong>
        </p>
        <p>Use a tablet or a computer. If you are on a tablet, turn it sideways.</p>
      </div>

      {showDevTools && <DevPhaseSwitcher />}
    </>
  );
}
