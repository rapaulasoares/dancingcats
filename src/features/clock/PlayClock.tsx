import { useEffect } from 'react';
import { useGame } from '../../state/store';
import styles from './PlayClock.module.css';

const TICK_MS = 1000;
/** A longer gap means the tab was asleep or the device was closed; that time is not counted. */
const MAX_GAP_MS = 3000;

/**
 * Runs the play clock. It starts when the player leaves the opening story and
 * enters Vila do Sol, and stops when the last report answer is submitted.
 * Only time with the game open and visible is counted.
 */
export function usePlayClock() {
  // Runs in every phase so the teacher can see time per phase; the store decides what the player's clock counts.
  const running = useGame((s) => s.sessionActive && s.phase !== 'start');
  const addPlayTime = useGame((s) => s.addPlayTime);

  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const gap = now - last;
      last = now;
      if (document.visibilityState === 'visible' && gap <= MAX_GAP_MS) addPlayTime(gap);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [running, addPlayTime]);
}

/** 754000 → "12:34"; an hour or more → "1:02:34". */
export function formatPlayTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h ? String(m).padStart(2, '0') : String(m);
  return `${h ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
}

/** The clock face shown during the investigation and the report. */
export function PlayClock({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const playMs = useGame((s) => s.timing.playMs);
  const minutes = Math.floor(playMs / 60000);
  return (
    <span
      className={tone === 'light' ? styles.clock : styles.clockDark}
      role="timer"
      aria-label={`Investigation time: ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`}
    >
      <span aria-hidden="true">⏱ {formatPlayTime(playMs)}</span>
    </span>
  );
}
