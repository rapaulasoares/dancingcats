import { useState } from 'react';
import { evidence } from '../../content/evidence';
import { DevGallery } from './DevGallery';
import { PHASES, useGame } from '../../state/store';
import styles from './DevPhaseSwitcher.module.css';

/** Development-only shortcuts. Never included in a production build. */
export function DevPhaseSwitcher() {
  const phase = useGame((s) => s.phase);
  const collected = useGame((s) => s.evidence);
  const devSetPhase = useGame((s) => s.devSetPhase);
  const collect = useGame((s) => s.collect);
  const [gallery, setGallery] = useState(false);

  function collectThree() {
    collect(
      evidence
        .map((e) => e.id)
        .filter((id) => !collected.includes(id))
        .slice(0, 3),
    );
  }

  if (gallery) return <DevGallery onClose={() => setGallery(false)} />;

  return (
    <nav className={styles.bar} aria-label="Developer shortcuts">
      <span className={styles.tag}>dev</span>
      {PHASES.map((p) => (
        <button
          key={p}
          className={p === phase ? styles.active : styles.item}
          aria-current={p === phase ? 'page' : undefined}
          onClick={() => devSetPhase(p)}
        >
          {p}
        </button>
      ))}
      <span className={styles.tag}>evidence: {collected.length}</span>
      <button className={styles.item} onClick={collectThree}>
        +3 evidence
      </button>
      <button className={styles.item} onClick={() => setGallery(true)}>
        all evidence
      </button>
    </nav>
  );
}
