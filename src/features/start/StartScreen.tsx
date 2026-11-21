import { useState, type FormEvent } from 'react';
import { hasSave, useGame } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import { TeacherPanel } from '../teacher/TeacherPanel';
import styles from './StartScreen.module.css';

function lastPlayed(at: number): string {
  if (!at) return '';
  return new Date(at).toLocaleString(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function StartScreen() {
  const saved = useGame(hasSave);
  const teamName = useGame((s) => s.teamName);
  const evidenceCount = useGame((s) => s.evidence.length);
  const lastPlayedAt = useGame((s) => s.timing.lastPlayedAt);
  const storageOk = useGame((s) => s.storageOk);
  const restoreFailed = useGame((s) => s.restoreFailed);
  const startNewGame = useGame((s) => s.startNewGame);
  const resume = useGame((s) => s.resume);

  // With a save present, the "new game" form is shown only on request.
  const [wantsNew, setWantsNew] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState(false);

  const showForm = !saved || wantsNew;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (saved && !confirming) {
      setConfirming(true);
      return;
    }
    startNewGame(name);
  }

  return (
    <main className={styles.screen}>
      <GameImage file="title-background.webp" alt="" ratio="auto" className={styles.backdrop} />
      <section className={styles.card}>
        <p className={styles.kicker}>Case file · Vila do Sol, Brazil</p>
        <h1 className={styles.title}>
          The Mystery of the <span>Dancing Cats</span>
        </h1>

        {restoreFailed && (
          <p className={styles.warning} role="alert">
            We could not open the saved investigation on this device. You can start a new one.
          </p>
        )}
        {!storageOk && (
          <p className={styles.warning} role="alert">
            This browser is not letting the game save. If the page is closed or refreshed, your
            progress will be lost. Ask your teacher before you begin.
          </p>
        )}

        {saved && !wantsNew && (
          <div className={styles.resume}>
            <p className={styles.saveInfo}>
              <strong>{teamName}</strong>
              <span>
                {evidenceCount} {evidenceCount === 1 ? 'piece' : 'pieces'} of evidence
                {lastPlayedAt ? ` · last played ${lastPlayed(lastPlayedAt)}` : ''}
              </span>
            </p>
            <button className="btn" onClick={resume}>
              Continue investigation
            </button>
            <button className="btn btn--quiet" onClick={() => setWantsNew(true)}>
              Start a new investigation
            </button>
          </div>
        )}

        {showForm && (
          <form className={styles.form} onSubmit={submit}>
            {!saved && (
              <p className={styles.blurb}>
                Something has changed in Vila do Sol. Walk its streets, ask careful questions, and
                follow the evidence.
              </p>
            )}
            <label className={styles.label} htmlFor="team-name">
              Investigator or team name
            </label>
            <input
              id="team-name"
              className={styles.input}
              value={name}
              maxLength={30}
              autoComplete="off"
              autoFocus
              onChange={(e) => {
                setName(e.target.value);
                setConfirming(false);
              }}
            />

            {confirming && (
              <p className={styles.warning} role="alert">
                This will erase the investigation saved for <strong>{teamName}</strong>. It cannot
                be undone.
              </p>
            )}

            <button className="btn" type="submit" disabled={!name.trim()}>
              {confirming ? 'Yes, erase and begin' : 'Begin the investigation'}
            </button>
            {saved && (
              <button
                className="btn btn--quiet"
                type="button"
                onClick={() => {
                  setWantsNew(false);
                  setConfirming(false);
                }}
              >
                Go back
              </button>
            )}
          </form>
        )}
      </section>
      <button className={styles.teacherLink} onClick={() => setTeacher(true)}>
        For teachers
      </button>
      {teacher && <TeacherPanel onClose={() => setTeacher(false)} />}
    </main>
  );
}
