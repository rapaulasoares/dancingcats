import { useRef, useState } from 'react';
import { events } from '../../content/locations';
import type { GameEvent } from '../../content/types';
import { useGame } from '../../state/store';
import { useFocusTrap } from '../../ui/useFocusTrap';
import { EvidenceDialog } from '../evidence/EvidenceDialog';
import styles from './Messages.module.css';

function Letter({ event, onLater, onRead }: { event: GameEvent; onLater: () => void; onRead: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);
  return (
    <div className={styles.backdrop} onClick={onLater}>
      <div
        ref={ref}
        className={styles.letter}
        role="dialog"
        aria-modal="true"
        aria-label={event.title}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onLater();
        }}
      >
        <p className={styles.kicker}>Message</p>
        <h2 className={styles.title}>{event.title}</h2>
        <p className={styles.body}>{event.message}</p>
        <div className={styles.actions}>
          <button className="btn btn--quiet" onClick={onLater}>
            Later
          </button>
          <button className="btn" autoFocus onClick={onRead}>
            Read the results
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Messages that reach the player during the investigation. The lab results
 * arrive this way, so every team receives them whatever questions they asked.
 */
export function Messages() {
  const unread = useGame((s) => s.eventsUnread);
  const readEvent = useGame((s) => s.readEvent);
  const [openEvent, setOpenEvent] = useState<string | null>(null);
  /** Evidence still to be shown, one piece at a time. */
  const [queue, setQueue] = useState<string[]>([]);

  const event = events.find((e) => e.id === (openEvent ?? ''));
  const waiting = events.find((e) => unread.includes(e.id));

  function read() {
    if (!event) return;
    readEvent(event.id);
    setQueue(event.unlocks);
    setOpenEvent(null);
  }

  return (
    <>
      {waiting && !openEvent && queue.length === 0 && (
        <button className={styles.envelope} onClick={() => setOpenEvent(waiting.id)}>
          <span aria-hidden="true">✉</span> New message
        </button>
      )}

      {event && <Letter event={event} onLater={() => setOpenEvent(null)} onRead={read} />}

      {queue.length > 0 && (
        <EvidenceDialog
          key={queue[0]}
          evidenceId={queue[0]}
          isNew
          onClose={() => setQueue((rest) => rest.slice(1))}
        />
      )}
    </>
  );
}
