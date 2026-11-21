import { useState } from 'react';
import { OpeningBook } from './OpeningBook';
import styles from './StoryButton.module.css';

/** Lets the player read the opening story again, wherever they are. Nothing in the game changes. */
export function StoryButton({ className = 'btn btn--quiet' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        Story
      </button>
      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="The opening story">
          <OpeningBook onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
