import { useRef } from 'react';
import { useFocusTrap } from '../../ui/useFocusTrap';
import { BoardScreen } from '../board/BoardScreen';
import styles from './TownMeeting.module.css';

/** The team's own board, to consult during the meeting. Nothing on it can be changed. */
export function BoardOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);
  return (
    <div ref={ref} className={styles.boardOverlay} role="dialog" aria-modal="true" aria-label="Your Evidence Board, read only">
      <div className={styles.boardBar}>
        <span>Your Evidence Board. You can read it, but not change it</span>
        <button className="btn" autoFocus onClick={onClose}>
          Back to the meeting
        </button>
      </div>
      <BoardScreen readOnly />
    </div>
  );
}
