import { useEffect, useRef } from 'react';
import { NOTE_LIMIT, type BoardNote as NoteState, type NoteKind } from '../../state/store';
import styles from './BoardNote.module.css';
import { useTapDrag } from './useTapDrag';

/** Size on the board, in board units, for each kind of note. */
export const NOTE_SIZE: Record<NoteKind, { width: number; height: number }> = {
  note: { width: 230, height: 190 },
  conclusion: { width: 320, height: 220 },
};

interface Props {
  note: NoteState;
  x: number;
  y: number;
  scale: number;
  dragging: boolean;
  selected: boolean;
  editing: boolean;
  /** For a conclusion: titles of the evidence tied to it with string. */
  basedOn: string[];
  onTap: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onDrop: (id: string, x: number, y: number) => void;
  onCancel: () => void;
  onChange: (id: string, text: string) => void;
  onDoneEditing: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Something the player writes and pins to the board. A plain note is a
 * post-it. A conclusion also lists, under the player's words, every piece of
 * evidence it has been tied to.
 */
export function BoardNote(p: Props) {
  const { note, x, y, editing } = p;
  const kind: NoteKind = note.kind ?? 'note';
  const isConclusion = kind === 'conclusion';
  const size = NOTE_SIZE[kind];
  const textRef = useRef<HTMLTextAreaElement>(null);
  const handlers = useTapDrag({
    x,
    y,
    scale: p.scale,
    onTap: () => p.onTap(note.id),
    onDrag: (nx, ny) => p.onDrag(note.id, nx, ny),
    onDrop: (nx, ny) => p.onDrop(note.id, nx, ny),
    onCancel: p.onCancel,
  });

  useEffect(() => {
    if (editing) textRef.current?.focus();
  }, [editing]);

  const classes = [
    styles.note,
    isConclusion ? styles.conclusion : '',
    p.dragging ? styles.dragging : '',
    p.selected ? styles.selected : '',
  ].join(' ');

  const evidenceList = isConclusion && (
    <div className={styles.basedOn}>
      {p.basedOn.length > 0 ? (
        <>
          <span className={styles.basedOnLabel}>Based on</span>
          <ul>
            {p.basedOn.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        </>
      ) : (
        <span className={styles.basedOnEmpty}>Use Connect to tie this to the evidence that supports it.</span>
      )}
    </div>
  );

  return (
    <div
      className={classes}
      style={{ left: x, top: y, width: size.width, minHeight: size.height, zIndex: p.dragging ? 100000 : note.z }}
    >
      {isConclusion && <span className={styles.heading}>Conclusion</span>}
      {editing ? (
        <>
          <textarea
            ref={textRef}
            className={styles.text}
            value={note.text}
            maxLength={NOTE_LIMIT[kind]}
            aria-label={isConclusion ? 'Your conclusion' : 'Your note'}
            placeholder={isConclusion ? 'What have you concluded?' : 'Write a thought or a question…'}
            onChange={(e) => p.onChange(note.id, e.target.value)}
            onBlur={() => p.onDoneEditing(note.id)}
            // Typing and selecting text must not drag the note or pan the board.
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') e.currentTarget.blur();
            }}
          />
          {evidenceList}
          <button
            className={styles.delete}
            aria-label={isConclusion ? 'Throw this conclusion away' : 'Throw this note away'}
            // Runs before the textarea's blur, so the note is removed rather than saved.
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              p.onDelete(note.id);
            }}
            onClick={() => p.onDelete(note.id)}
          >
            ✕
          </button>
        </>
      ) : (
        <button
          className={styles.face}
          aria-label={`Your ${isConclusion ? 'conclusion' : 'note'}: ${note.text || 'empty'}.${
            isConclusion && p.basedOn.length ? ` Based on: ${p.basedOn.join(', ')}.` : ''
          } Press Enter to edit.`}
          {...handlers}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              p.onTap(note.id);
            }
          }}
        >
          <span className={styles.words}>
            {note.text || <span className={styles.placeholder}>Tap to write…</span>}
          </span>
          {evidenceList}
        </button>
      )}
    </div>
  );
}
