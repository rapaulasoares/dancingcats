import { useEffect, useState } from 'react';
import { BALANCE } from '../../content/balance';
import { characters } from '../../content/characters';
import { meets } from '../../content/conditions';
import { interviewById } from '../../content/interviews';
import { locationById } from '../../content/locations';
import type { LocationId } from '../../content/types';
import { progressOf, questionsLeft, useGame } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import { EvidenceDialog } from '../evidence/EvidenceDialog';
import styles from './LocationScene.module.css';

/** After this long without finding anything new, the objects show their labels. */
const LOOK_AROUND_MS = BALANCE.lookAroundMs;

export function LocationScene({ locationId }: { locationId: LocationId }) {
  const location = locationById[locationId];
  const save = useGame();
  const { collect, goTo } = save;
  const [open, setOpen] = useState<{ id: string; isNew: boolean } | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const found = (ids: string[]) => ids.every((id) => save.evidence.includes(id));
  const remaining = location.hotspots.filter((h) => !found(h.unlocks)).length;

  // The hint timer restarts whenever something is found or the place changes.
  useEffect(() => {
    setShowLabels(false);
    if (remaining === 0) return;
    const timer = setTimeout(() => setShowLabels(true), LOOK_AROUND_MS);
    return () => clearTimeout(timer);
  }, [locationId, remaining]);

  function examine(unlocks: string[]) {
    const fresh = collect(unlocks);
    setOpen({ id: fresh[0] ?? unlocks[0], isNew: fresh.length > 0 });
  }

  const progress = progressOf(save);
  const people = location.interviews
    .map((id) => interviewById[id])
    .filter((interview) => interview && meets(interview.availableWhen, progress));

  return (
    <section className={styles.screen} aria-label={location.name}>
      <div className={styles.scene}>
        <GameImage file={location.image} alt={location.imageAlt} ratio="16 / 9" />

        <ul className={styles.hotspots}>
          {location.hotspots.map((h) => {
            const done = found(h.unlocks);
            return (
              <li key={h.id} className={styles.spot} style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                <button
                  className={done ? styles.hotspotDone : styles.hotspot}
                  data-labels={showLabels || undefined}
                  onClick={() => examine(h.unlocks)}
                >
                  <span className={styles.ring} aria-hidden="true">
                    {done ? '✓' : ''}
                  </span>
                  <span className={styles.label}>
                    {h.label}
                    {done && <span className={styles.srOnly}> (already examined)</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <h1 className={styles.name}>{location.name}</h1>
      </div>

      <div className={styles.panel}>
        <p className={styles.intro}>{location.intro}</p>

        <div className={styles.people}>
          {people.map((interview) => {
            const who = characters.find((c) => c.id === interview.characterId)!;
            const left = questionsLeft(save, interview.id);
            const isFollowUp = interview.id === 'roberto2';
            return (
              <button
                key={interview.id}
                className={styles.person}
                onClick={() => goTo({ screen: 'interview', interviewId: interview.id })}
              >
                <GameImage file={who.portrait} alt="" ratio="1 / 1" className={styles.portrait} />
                <span className={styles.personText}>
                  <strong>{isFollowUp ? `Ask ${who.name} about the results` : `Talk to ${who.name}`}</strong>
                  <span>
                    {who.role} ·{' '}
                    {left > 0 ? `${left} ${left === 1 ? 'question' : 'questions'} left` : 'no questions left'}
                  </span>
                </span>
              </button>
            );
          })}
          {location.hotspots.length > 0 && (
            <p className={styles.lookAround}>
              {remaining > 0
                ? showLabels
                  ? 'Look around: some things here are worth a closer look.'
                  : 'Look around. Tap anything that catches your eye.'
                : 'You have examined everything here.'}
            </p>
          )}
        </div>
      </div>

      {open && <EvidenceDialog evidenceId={open.id} isNew={open.isNew} onClose={() => setOpen(null)} />}
    </section>
  );
}
