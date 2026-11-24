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
  /** Called with the answer as it stands, or null while it is incomplete. */
  onChange: (answer: string | null) => void;
}

/**
 * The player's pieces for one step of the meeting. Everything is done by tapping or with the keyboard
 * (no dragging needed, so it works on tablets and for everyone). The answer is only locked
 * when the player presses the big button, so a mis-tap is never final.
 */
export function StepInput(props: Props) {
  switch (props.step.kind) {
    case 'map':
      return <MapPins {...props} />;
    case 'order':
      return <OrderCards {...props} />;
    case 'scale':
      return <Balance {...props} />;
    case 'sentence':
      return <SentenceBuilder {...props} />;
    default:
      return <CardChoice {...props} />;
  }
}

/** One card to tap among several: rounds 1, 2 and the first question of round 5. */
function CardChoice({ step, seed, locked, onChange }: Props) {
  const [chosen, setChosen] = useState<string | null>(null);
  const cards = shuffled(step.options, `${seed}:${step.id}`);
  const current = locked ?? chosen;
  return (
    <ul className={styles.cards} role="radiogroup" aria-label="Choose one card">
      {cards.map((card) => (
        <li key={card.id}>
          <button
            type="button"
            role="radio"
            aria-checked={current === card.id}
            disabled={locked !== undefined}
            className={current === card.id ? `${styles.card} ${styles.cardOn}` : styles.card}
            onClick={() => {
              setChosen(card.id);
              onChange(card.id);
            }}
          >
            <GameImage file={card.image ?? 'card-none.webp'} alt="" ratio="1 / 1" className={styles.cardImage} />
            <span className={styles.cardLabel}>{card.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Round 3: tap the place on the map of the bay. */
function MapPins({ step, locked, onChange }: Props) {
  const [chosen, setChosen] = useState<string | null>(null);
  const current = locked ?? chosen;
  return (
    <div className={styles.bayMap}>
      <GameImage file="map-bay-sites.webp" alt="" ratio="16 / 10" className={styles.bayMapImage} />
      <div role="radiogroup" aria-label="Places on the map of the bay">
        {step.options.map((place) => (
          <button
            key={place.id}
            type="button"
            role="radio"
            aria-checked={current === place.id}
            disabled={locked !== undefined}
            className={current === place.id ? `${styles.pin} ${styles.pinOn}` : styles.pin}
            style={{ left: `${place.at?.x ?? 50}%`, top: `${place.at?.y ?? 50}%` }}
            onClick={() => {
              setChosen(place.id);
              onChange(place.id);
            }}
          >
            <span className={styles.pinDot} aria-hidden="true" />
            <span className={styles.pinLabel}>{place.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Round 4: tap the cards in the order things happened; tap a placed card to take it back. */
function OrderCards({ step, seed, locked, onChange }: Props) {
  const [placed, setPlaced] = useState<string[]>([]);
  const order = locked ? locked.split(ANSWER_SEPARATOR) : placed;
  const tray = shuffled(step.options, `${seed}:${step.id}`).filter((o) => !order.includes(o.id));
  const card = (id: string) => step.options.find((o) => o.id === id)!;

  const update = (next: string[]) => {
    setPlaced(next);
    onChange(next.length === step.options.length ? next.join(ANSWER_SEPARATOR) : null);
  };

  return (
    <div className={styles.orderArea}>
      <ol className={styles.slots} aria-label="Order of events">
        {step.options.map((_, i) => {
          const id = order[i];
          return (
            <li key={i} className={styles.slot}>
              <span className={styles.slotNumber} aria-hidden="true">
                {i + 1}
              </span>
              {id ? (
                <button
                  type="button"
                  className={styles.card}
                  disabled={locked !== undefined}
                  onClick={() => update(order.filter((x) => x !== id))}
                  aria-label={`${i + 1}: ${card(id).label}. Tap to take it back.`}
                >
                  <GameImage file={card(id).image ?? 'card-none.webp'} alt="" ratio="1 / 1" className={styles.cardImage} />
                  <span className={styles.cardLabel}>{card(id).label}</span>
                </button>
              ) : (
                <span className={styles.emptySlot}>Next</span>
              )}
            </li>
          );
        })}
      </ol>
      {!locked && (
        <ul className={styles.tray} aria-label="Cards to place">
          {tray.map((c) => (
            <li key={c.id}>
              <button type="button" className={styles.card} onClick={() => update([...order, c.id])}>
                <GameImage file={c.image ?? 'card-none.webp'} alt="" ratio="1 / 1" className={styles.cardImage} />
                <span className={styles.cardLabel}>{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Round 5, second question: put the paper that weighs more on the heavy side of the balance. */
function Balance({ step, seed, locked, onChange }: Props) {
  const [heavy, setHeavy] = useState<string | null>(null);
  const current = locked ?? heavy;
  const cards = shuffled(step.options, `${seed}:${step.id}`);
  const light = step.options.find((o) => o.id !== current);
  const card = (id: string | null | undefined) => step.options.find((o) => o.id === id);

  const pan = (id: string | undefined, side: 'heavy' | 'light') => {
    const c = card(id);
    return (
      <div className={styles.pan} data-side={side}>
        <span className={styles.panLabel}>{side === 'heavy' ? 'Heavier evidence' : 'Lighter evidence'}</span>
        <div className={styles.panCard}>
          {c ? (
            <>
              <GameImage file={c.image ?? 'card-none.webp'} alt="" ratio="1 / 1" className={styles.cardImage} />
              <span className={styles.cardLabel}>{c.label}</span>
            </>
          ) : (
            <span className={styles.emptySlot}>Empty</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.balance}>
      <div className={styles.beamWrap} aria-hidden="true">
        <div className={styles.beam} style={{ transform: `rotate(${current ? 7 : 0}deg)` }} />
        <div className={styles.post} />
      </div>
      <div className={styles.pans}>
        {pan(light && current ? light.id : undefined, 'light')}
        {pan(current ?? undefined, 'heavy')}
      </div>
      {!locked && (
        <>
          <p className={styles.balanceHint}>Tap the paper that should go on the heavier side.</p>
          <ul className={styles.tray} role="radiogroup" aria-label="Papers to weigh">
            {cards.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={current === c.id}
                  className={current === c.id ? `${styles.card} ${styles.cardOn}` : styles.card}
                  onClick={() => {
                    setHeavy(c.id);
                    onChange(c.id);
                  }}
                >
                  <GameImage file={c.image ?? 'card-none.webp'} alt="" ratio="1 / 1" className={styles.cardImage} />
                  <span className={styles.cardLabel}>{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/** Round 6: build the conclusion with a word bank. Tap a blank, then a word. */
function SentenceBuilder({ step, seed, locked, onChange }: Props) {
  const sentence = step.sentence!;
  const [picked, setPicked] = useState<string[]>(sentence.slots.map(() => ''));
  const [active, setActive] = useState(0);
  const shown = locked ? locked.split(ANSWER_SEPARATOR) : picked;
  const slot = sentence.slots[active];
  const bank = shuffled(slot.options, `${seed}:${step.id}:${slot.id}`);

  const choose = (id: string) => {
    const next = picked.map((p, i) => (i === active ? id : p));
    setPicked(next);
    onChange(next.every(Boolean) ? next.join(ANSWER_SEPARATOR) : null);
    const firstEmpty = next.findIndex((p) => !p);
    if (firstEmpty >= 0) setActive(firstEmpty);
  };

  const wordFor = (i: number) => sentence.slots[i].options.find((o) => o.id === shown[i])?.text;

  return (
    <div className={styles.sentenceArea}>
      <p className={styles.sentence}>
        {sentence.before}{' '}
        {sentence.slots.map((s, i) => (
          <span key={s.id}>
            <button
              type="button"
              disabled={locked !== undefined}
              aria-label={`Blank ${i + 1}: ${wordFor(i) ?? 'empty'}`}
              className={[styles.blank, i === active && !locked ? styles.blankActive : '', wordFor(i) ? styles.blankFilled : ''].join(' ')}
              onClick={() => setActive(i)}
            >
              {wordFor(i) ?? '…'}
            </button>{' '}
            {sentence.joins[i] ? `${sentence.joins[i]} ` : `${sentence.after}`}
          </span>
        ))}
      </p>
      {!locked && (
        <ul className={styles.bank} aria-label={`Words for blank ${active + 1}`}>
          {bank.map((o) => (
            <li key={o.id}>
              <button type="button" className={shown[active] === o.id ? `${styles.chip} ${styles.chipOn}` : styles.chip} onClick={() => choose(o.id)}>
                {o.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
