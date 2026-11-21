import { useMemo, useState } from 'react';
import { reflection } from '../../content/reflection';
import { buildProfile } from '../../state/scoring';
import { useGame } from '../../state/store';
import { formatPlayTime } from '../clock/PlayClock';
import styles from './ReflectionScreen.module.css';

/**
 * Discussion cards for the classroom. On screen: one theme at a time, in large
 * type for reading aloud. On paper: the team's profile and every question.
 */
export function ReflectionScreen() {
  const save = useGame();
  const profile = useMemo(() => buildProfile(save), [save]);
  const [themeId, setThemeId] = useState(reflection[0].id);
  const theme = reflection.find((t) => t.id === themeId) ?? reflection[0];

  return (
    <main className={styles.screen}>
      <div className={styles.onScreen}>
        <header className={styles.header}>
          <p className={styles.kicker}>For the whole class</p>
          <h1 className={styles.title}>The case is closed. The thinking isn't.</h1>
          <p className={styles.lead}>
            Pick a theme and talk about the questions together. There are no right or wrong answers, and
            nothing here is scored.
          </p>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Themes">
          {reflection.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={t.id === theme.id}
              className={t.id === theme.id ? styles.tabActive : styles.tab}
              onClick={() => setThemeId(t.id)}
            >
              <span className={styles.tabNumber}>{i + 1}</span>
              {t.title}
            </button>
          ))}
        </div>

        <ol className={styles.cards}>
          {theme.cards.map((card) => (
            <li key={card.id} className={styles.card}>
              {card.startHere && <span className={styles.startHere}>Good place to start</span>}
              <p className={styles.question}>{card.question}</p>
              <details className={styles.hint}>
                <summary>Think about…</summary>
                <p>{card.hint}</p>
              </details>
            </li>
          ))}
        </ol>

        <footer className={styles.footer}>
          <button className="btn btn--quiet" onClick={() => useGame.setState({ sessionActive: false })}>
            Back to the start screen
          </button>
          <button className="btn" onClick={() => window.print()}>
            Print profile and questions
          </button>
        </footer>
      </div>

      {/* Printed sheet: hidden on screen. */}
      <div className={styles.onPaper}>
        <h1>The Mystery of the Dancing Cats</h1>
        <p>
          <strong>{save.teamName}</strong> · investigation time {formatPlayTime(save.timing.playMs)} ·{' '}
          {save.evidence.length} pieces of evidence
        </p>
        <h2>Investigator Profile</h2>
        <ul>
          {profile.dimensions.map((d) => (
            <li key={d.id}>
              <strong>
                {d.label}: {d.level}.
              </strong>{' '}
              {d.feedback.join(' ')}
            </li>
          ))}
        </ul>
        {reflection.map((t, i) => (
          <section key={t.id}>
            <h2>
              {i + 1}. {t.title}
            </h2>
            <ol>
              {t.cards.map((card) => (
                <li key={card.id}>{card.question}</li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
