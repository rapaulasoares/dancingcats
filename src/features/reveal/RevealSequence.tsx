import { useEffect, useRef, useState, type ReactNode } from 'react';
import { factVsFiction, revealPages } from '../../content/reveal';
import { useGame } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import styles from './RevealSequence.module.css';

/** Turns **bold** markers into <strong>. */
function rich(text: string): ReactNode[] {
  return text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

/** The real case, told one page at a time, ending with what was fact and what was fiction. */
export function RevealSequence() {
  const continueAfter = useGame((s) => s.continueAfter);
  const [index, setIndex] = useState(0);
  const total = revealPages.length + 1; // the last page is facts vs. fiction
  const page = revealPages[index];
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  return (
    <main className={styles.screen}>
      <article
        className={page ? (page.image ? styles.split : styles.page) : styles.pageWide}
        aria-label={`Page ${index + 1} of ${total}`}
      >
        {page ? (
          <>
            {page.image && (
              <div className={styles.figure}>
                <GameImage file={page.image.file} alt={page.image.alt} ratio="16 / 9" className={styles.image} />
              </div>
            )}
            <div className={styles.copy}>
              {page.kicker && <p className={styles.kicker}>{page.kicker}</p>}
              <h1 className={index === 0 ? styles.titleFirst : styles.title} ref={headingRef} tabIndex={-1}>
                {page.title}
              </h1>
              {page.paragraphs.map((p, i) => (
                <p key={i} className={styles.text}>
                  {rich(p)}
                </p>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className={styles.kicker}>Before you go</p>
            <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
              {factVsFiction.title}
            </h1>
            <div className={styles.columns}>
              <section className={styles.facts}>
                <h2>{factVsFiction.facts.heading}</h2>
                <ul>
                  {factVsFiction.facts.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className={styles.adapted}>
                <h2>{factVsFiction.adapted.heading}</h2>
                <ul>
                  {factVsFiction.adapted.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        )}
      </article>

      <nav className={styles.controls} aria-label="Pages">
        <button className="btn btn--quiet" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Back
        </button>
        <span className={styles.count}>
          {index + 1} of {total}
        </span>
        {index < total - 1 ? (
          <button className="btn" onClick={() => setIndex(index + 1)}>
            Next
          </button>
        ) : (
          <button className="btn" onClick={() => continueAfter('reveal')}>
            Think it over
          </button>
        )}
      </nav>
    </main>
  );
}
