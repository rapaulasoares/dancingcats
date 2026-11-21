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
    <div className={styles.backdrop} onClick={onClose}>
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
