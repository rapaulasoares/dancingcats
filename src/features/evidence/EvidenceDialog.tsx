import { useEffect, useRef, type ReactNode } from 'react';
import { evidenceById } from '../../content/evidence';
import { useFocusTrap } from '../../ui/useFocusTrap';
import { EvidenceView } from './EvidenceView';
import styles from './EvidenceDialog.module.css';

interface Props {
  evidenceId: string;
  /** True the first time this evidence is found: shows the "added" stamp. */
  isNew: boolean;
  onClose: () => void;
  /** False on the Evidence Board itself, where the status line would be noise. */
  showStatus?: boolean;
  /** Extra controls shown under the evidence, such as the classification buttons. */
  children?: ReactNode;
}

/** A piece of evidence held up for a close look. */
export function EvidenceDialog({ evidenceId, isNew, onClose, showStatus = true, children }: Props) {
  const evidence = evidenceById[evidenceId];
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const pressedBackdrop = useRef(false);
  useFocusTrap(dialogRef);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!evidence) return null;

  return (
    <div
      className={styles.backdrop}
      // Only a press that starts on the dark backdrop closes the window. On a touch screen the browser sends a
      // click after the finger lifts, and the card on the board opens this window on release: that click would
      // land on the backdrop and close it again at once (when the card is outside the centred window).
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        const intended = pressedBackdrop.current && e.target === e.currentTarget;
        pressedBackdrop.current = false;
        if (intended) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={evidence.title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.scroll}>
          <EvidenceView evidence={evidence} />
        </div>

        {children}

        <div className={styles.footer}>
          {isNew ? (
            <p className={styles.stamp} role="status">
              Added to your Evidence Board
            </p>
          ) : (
            <p className={styles.already}>{showStatus ? 'Already on your Evidence Board' : ''}</p>
          )}
          <button ref={closeRef} className="btn" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
