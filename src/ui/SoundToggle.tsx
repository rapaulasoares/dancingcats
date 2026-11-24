import { setSoundEnabled, useSoundEnabled } from './sound';

/** Turns the game's optional sounds on or off. Off by default. */
export function SoundToggle({ className }: { className?: string }) {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      className={className ?? 'btn btn--quiet'}
      aria-pressed={on}
      title={on ? 'Sound is on' : 'Sound is off'}
      onClick={() => setSoundEnabled(!on)}
    >
      <span aria-hidden="true">{on ? '🔊' : '🔇'}</span> Sound {on ? 'on' : 'off'}
    </button>
  );
}
