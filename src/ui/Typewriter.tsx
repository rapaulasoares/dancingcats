import { useEffect, useRef, useState } from 'react';
import styles from './Typewriter.module.css';

interface Props {
  text: string;
  /** Milliseconds per letter. Punctuation pauses a little longer. */
  msPerChar?: number;
  /** Wait before the first letter, with "typing" dots shown meanwhile. */
  startDelay?: number;
  /** Called every few letters, so the page can keep the new text in view. */
  onTick?: () => void;
  /** Called once, when the last letter appears. */
  onDone?: () => void;
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Shows text letter by letter, as if someone were speaking or typing it now.
 * Screen readers get the whole text at once instead of letter by letter.
 * With reduced motion turned on, the text simply appears.
 */
export function Typewriter({ text, msPerChar = 16, startDelay = 0, onTick, onDone }: Props) {
  const instant = reducedMotion();
  const [count, setCount] = useState(instant ? text.length : 0);
  const [waiting, setWaiting] = useState(!instant && startDelay > 0);
  const callbacks = useRef({ onTick, onDone });
  callbacks.current = { onTick, onDone };

  useEffect(() => {
    if (instant) {
      callbacks.current.onDone?.();
      return;
    }
    let shown = 0;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      shown += 1;
      setCount(shown);
      if (shown % 4 === 0) callbacks.current.onTick?.();
      if (shown >= text.length) {
        callbacks.current.onTick?.();
        callbacks.current.onDone?.();
        return;
      }
      const letter = text[shown - 1];
      const pause = /[.!?…]/.test(letter) ? 9 : /[,;:—]/.test(letter) ? 5 : 1;
      timer = setTimeout(step, msPerChar * pause);
    };

    timer = setTimeout(() => {
      setWaiting(false);
      step();
    }, startDelay);
    return () => clearTimeout(timer);
  }, [text, msPerChar, startDelay, instant]);

  return (
    <>
      <span className={styles.sr}>{text}</span>
      <span aria-hidden="true">
        {waiting ? (
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
        ) : (
          <>
            {text.slice(0, count)}
            {count < text.length && <span className={styles.caret} />}
          </>
        )}
      </span>
    </>
  );
}
