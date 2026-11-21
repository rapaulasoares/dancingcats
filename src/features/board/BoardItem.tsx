import type { KeyboardEvent } from 'react';
import type { Evidence } from '../../content/types';
import { CARD, type Tag } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import { FORMAT_LABEL } from '../evidence/EvidenceView';
import styles from './BoardItem.module.css';
import { useTapDrag } from './useTapDrag';

const KEY_STEP = 24;

export const TAG_LABEL: Record<Tag, string> = {
  important: 'Important',
  unsure: 'Unsure',
  notRelevant: 'Not relevant',
};

interface Props {
  evidence: Evidence;
  x: number;
  y: number;
  z: number;
  tag?: Tag;
  scale: number;
  dragging: boolean;
  /** Highlighted as the first end of a string being tied. */
  selected: boolean;
  onTap: (id: string) => void;
  /** Called when the card receives keyboard focus, so the board can pan to it. */
  onKeyboardFocus?: (x: number, y: number) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onDrop: (id: string, x: number, y: number) => void;
  onCancel: () => void;
}

/** A small, steady tilt per card so the board looks pinned by hand. */
function tilt(id: string): number {
  let sum = 0;
  for (const ch of id) sum += ch.charCodeAt(0);
  return ((sum % 7) - 3) * 0.7;
}

export function BoardItem({ evidence, x, y, z, tag, scale, dragging, selected, onTap, onKeyboardFocus, onDrag, onDrop, onCancel }: Props) {
  const id = evidence.id;
  const handlers = useTapDrag({
    x,
    y,
    scale,
    onTap: () => onTap(id),
    onDrag: (nx, ny) => onDrag(id, nx, ny),
    onDrop: (nx, ny) => onDrop(id, nx, ny),
    onCancel,
  });

  function key(e: KeyboardEvent<HTMLButtonElement>) {
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0],
      ArrowRight: [KEY_STEP, 0],
      ArrowUp: [0, -KEY_STEP],
      ArrowDown: [0, KEY_STEP],
    };
    const delta = step[e.key];
    if (delta) {
      e.preventDefault();
      onDrop(id, x + delta[0], y + delta[1]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTap(id);
    }
  }

  const classes = [
    styles.card,
    styles[evidence.format],
    dragging ? styles.dragging : '',
    selected ? styles.selected : '',
    tag ? styles[`tag-${tag}`] : '',
  ].join(' ');

  return (
    <button
      className={classes}
      style={{
        left: x,
        top: y,
        width: CARD.width,
        zIndex: dragging ? 100000 : z,
        transform: `rotate(${dragging ? 0 : tilt(id)}deg)`,
      }}
      aria-label={`${evidence.title}. ${FORMAT_LABEL[evidence.format]}.${tag ? ` Marked ${TAG_LABEL[tag]}.` : ''} Press Enter to read, arrow keys to move.`}
      {...handlers}
      onKeyDown={key}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) onKeyboardFocus?.(x, y);
      }}
    >
      <span className={styles.pin} aria-hidden="true" />
      {evidence.format === 'polaroid' && (
        <GameImage file={evidence.body.image ?? ''} alt="" ratio="16 / 10" className={styles.photo} />
      )}
      <span className={styles.kind}>{FORMAT_LABEL[evidence.format]}</span>
      <span className={styles.title}>{evidence.title}</span>
      <span className={styles.source}>{evidence.source}</span>
      {tag && (
        <span className={styles.stamp} aria-hidden="true">
          {tag === 'important' ? '★ ' : tag === 'unsure' ? '? ' : '✕ '}
          {TAG_LABEL[tag]}
        </span>
      )}
    </button>
  );
}
