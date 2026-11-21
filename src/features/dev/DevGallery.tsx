import { evidence } from '../../content/evidence';
import { EvidenceView } from '../evidence/EvidenceView';
import styles from './DevGallery.module.css';

/** Development only: every piece of evidence on one page, for reviewing wording and looks. */
export function DevGallery({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.gallery}>
      <button className={`btn ${styles.close}`} onClick={onClose}>
        Close gallery
      </button>
      <div className={styles.grid}>
        {evidence.map((e) => (
          <figure key={e.id} className={styles.item}>
            <figcaption>
              {e.id} · {e.format} · {e.internal.relevance}
            </figcaption>
            <EvidenceView evidence={e} />
          </figure>
        ))}
      </div>
    </div>
  );
}
