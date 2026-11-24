import { useState } from 'react';
import { ANSWER_SEPARATOR, type MeetingStep } from '../../content/townMeeting';
import { shuffled } from '../../state/scoring';
import { GameImage } from '../../ui/GameImage';
import styles from './TownMeeting.module.css';

interface Props {
  step: MeetingStep;
  /** Stable for this team, so a refresh shows the cards in the same order. */
  seed: string;
  /** The answer that was just locked, shown while the crowd reacts. */
  locked?: string;
  onChange: (answer: string | null) => void;
}

/**
 * The player's pieces for one step of the meeting. Cards are chosen by tapping; the
 * answer is only locked when the player presses the big button, so a mis-tap is never final.
 * Order, map and sentence steps get their own pieces in a later stage.
 */
export function StepInput({ step, seed, locked, onChange }: Props) {
  if (step.kind === 'order' || step.kind === 'sentence') {
    return <TemporaryPicker key={step.id} step={step} locked={locked} onChange={onChange} />;
  }
  return <CardChoice key={step.id} step={step} seed={seed} locked={locked} onChange={onChange} />;
}

function CardChoice({ step, seed, locked, onChange }: Props) {
  const [chosen, setChosen] = useState<string | null>(null);
  const cards = shuffled(step.options, `${seed}:${step.id}`);
  const current = locked ?? chosen;
  return (
    <ul className={styles.cards} role="radiogroup" aria-label="Choose one card">
      {cards.map((card) => {
        const on = current === card.id;
        const right = false; // the right card is not revealed here: the profile shows it at the end
        return (
          <li key={card.id}>
            <button
              type="button"
              role="radio"
              aria-checked={on}
              disabled={locked !== undefined}
              className={[styles.card, on ? styles.cardOn : '', right ? styles.cardRight : ''].join(' ')}
              onClick={() => {
                setChosen(card.id);
                onChange(card.id);
              }}
            >
              <GameImage file={card.image ?? 'card-none.webp'} alt="" ratio="1 / 1" className={styles.cardImage} />
              <span className={styles.cardLabel}>{card.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Stand-in for the order and sentence steps: plain selects. */
function TemporaryPicker({ step, locked, onChange }: Omit<Props, 'seed'>) {
  const count = step.kind === 'order' ? step.options.length : (step.sentence?.slots.length ?? 0);
  const [picked, setPicked] = useState<string[]>(Array(count).fill(''));
  const shown = locked ? locked.split(ANSWER_SEPARATOR) : picked;
  const choices = step.kind === 'order' ? step.options.map((o) => ({ id: o.id, text: o.label })) : null;
  return (
    <div className={styles.selects}>
      {shown.map((value, i) => (
        <select
          key={i}
          disabled={locked !== undefined}
          aria-label={step.kind === 'order' ? `Step ${i + 1}` : `Blank ${i + 1}`}
          value={value}
          onChange={(e) => {
            const next = picked.map((p, j) => (j === i ? e.target.value : p));
            setPicked(next);
            onChange(next.every(Boolean) ? next.join(ANSWER_SEPARATOR) : null);
          }}
        >
          <option value="">Choose…</option>
          {(choices ?? step.sentence!.slots[i].options).map((o) => (
            <option key={o.id} value={o.id}>
              {o.text}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
