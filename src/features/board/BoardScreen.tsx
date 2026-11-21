import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { evidenceById } from '../../content/evidence';
import { BOARD, BOARD_HEADER, CARD, useGame, type NoteKind, type Tag } from '../../state/store';
import { EvidenceDialog } from '../evidence/EvidenceDialog';
import { BoardItem, TAG_LABEL } from './BoardItem';
import { BoardNote, NOTE_SIZE } from './BoardNote';
import styles from './BoardScreen.module.css';

interface Camera {
  scale: number;
  x: number;
  y: number;
}

const MAX_SCALE = 1.4;
const TAGS: Tag[] = ['important', 'unsure', 'notRelevant'];

/**
 * The Evidence Board: a corkboard of fixed logical size, seen through a
 * viewport that can pan and zoom. Everything on it is the player's own
 * arrangement; the game never judges it.
 */
export function BoardScreen({ readOnly = false }: { readOnly?: boolean }) {
  const save = useGame();
  const { evidence, board, moveItem, setTag, addNote, updateNote, moveNote, deleteNote, addLink, removeLink } = save;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [camera, setCamera] = useState<Camera | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  /** The object being dragged follows the pointer here; the save is written once on release. */
  const [live, setLive] = useState<{ id: string; x: number; y: number } | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);

  const fitScale = size.w ? Math.min(size.w / BOARD.width, size.h / BOARD.height) : 1;

  /** Keeps the board on screen: centred when smaller than the viewport, never dragged out of view. */
  const settle = useCallback(
    (c: Camera): Camera => {
      const scale = Math.min(MAX_SCALE, Math.max(fitScale, c.scale));
      const bw = BOARD.width * scale;
      const bh = BOARD.height * scale;
      const x = bw <= size.w ? (size.w - bw) / 2 : Math.min(0, Math.max(size.w - bw, c.x));
      const y = bh <= size.h ? (size.h - bh) / 2 : Math.min(0, Math.max(size.h - bh, c.y));
      return { scale, x, y };
    },
    [fitScale, size.w, size.h],
  );

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Start by showing the whole board; keep the view valid when the window changes.
  useEffect(() => {
    if (!size.w) return;
    setCamera((c) => settle(c ?? { scale: fitScale, x: 0, y: 0 }));
  }, [size.w, size.h, fitScale, settle]);

  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number) => {
      setCamera((c) => {
        if (!c) return c;
        const scale = Math.min(MAX_SCALE, Math.max(fitScale, c.scale * factor));
        const k = scale / c.scale;
        return settle({ scale, x: cx - (cx - c.x) * k, y: cy - (cy - c.y) * k });
      });
    },
    [fitScale, settle],
  );

  // Mouse wheel and trackpad zoom. Must be a non-passive listener to stop the page scrolling.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  // One finger on the cork pans; two fingers pinch to zoom.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number } | null>(null);

  function down(e: PointerEvent<HTMLDivElement>) {
    // Touching the cork finishes any note being written.
    if (editingNote) doneEditing(editingNote);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Panning still works while the pointer stays over the board.
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pinch.current = null;
  }

  function move(e: PointerEvent<HTMLDivElement>) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const now = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, now);
    const all = [...pointers.current.values()];

    if (all.length === 1) {
      setCamera((c) => c && settle({ ...c, x: c.x + now.x - prev.x, y: c.y + now.y - prev.y }));
    } else if (all.length === 2) {
      const [a, b] = all;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = e.currentTarget.getBoundingClientRect();
      if (pinch.current && pinch.current.dist > 0) {
        zoomAt(dist / pinch.current.dist, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
      }
      pinch.current = { dist };
    }
  }

  function up(e: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    pinch.current = null;
  }

  const centre = () => [size.w / 2, size.h / 2] as const;

  /** When a card gets keyboard focus while the board is zoomed in, pan so the card is on screen. */
  function bringIntoView(x: number, y: number) {
    setCamera((c) => {
      if (!c) return c;
      const left = x * c.scale + c.x;
      const top = y * c.scale + c.y;
      const visible =
        left >= 0 && top >= 0 && left + CARD.width * c.scale <= size.w && top + CARD.height * c.scale <= size.h;
      if (visible) return c;
      return settle({
        ...c,
        x: size.w / 2 - (x + CARD.width / 2) * c.scale,
        y: size.h / 2 - (y + CARD.height / 2) * c.scale,
      });
    });
  }
  const scale = camera?.scale ?? fitScale;

  // ── Positions ──
  const noteById = Object.fromEntries(board.notes.map((n) => [n.id, n]));

  function position(id: string): { x: number; y: number } | null {
    if (live?.id === id) return live;
    const item = board.items[id];
    // A save made on an older board size may hold positions outside the wall.
    if (item) return { x: Math.min(item.x, BOARD.width - CARD.width), y: Math.min(item.y, BOARD.height - CARD.height) };
    const note = noteById[id];
    return note ? { x: note.x, y: note.y } : null;
  }

  /** Titles of the evidence tied by string to a note, in the order the strings were tied. */
  function evidenceTiedTo(noteId: string): string[] {
    const titles: string[] = [];
    for (const link of board.links) {
      const other = link.from === noteId ? link.to : link.to === noteId ? link.from : null;
      const title = other ? evidenceById[other]?.title : undefined;
      if (title && !titles.includes(title)) titles.push(title);
    }
    return titles;
  }

  /** Where a string is tied: the pin of a card or note. */
  function anchor(id: string): { x: number; y: number } | null {
    const p = position(id);
    if (!p) return null;
    const note = noteById[id];
    const width = note ? NOTE_SIZE[note.kind ?? 'note'].width : CARD.width;
    return { x: p.x + width / 2, y: p.y + 4 };
  }

  // ── Taps ──
  /** In connect mode a tap picks an end of a string. Returns true when the tap was used. */
  function pick(id: string): boolean {
    if (!connecting) return false;
    if (!connectFrom) setConnectFrom(id);
    else if (connectFrom === id) setConnectFrom(null);
    else {
      addLink(connectFrom, id);
      setConnectFrom(null);
    }
    return true;
  }

  function toggleConnecting() {
    setConnecting((on) => !on);
    setConnectFrom(null);
    setEditingNote(null);
  }

  function newNote(kind: NoteKind) {
    if (!camera) return;
    const x = (size.w / 2 - camera.x) / camera.scale - NOTE_SIZE[kind].width / 2;
    const y = (size.h / 2 - camera.y) / camera.scale - NOTE_SIZE[kind].height / 2;
    setConnecting(false);
    setConnectFrom(null);
    setEditingNote(addNote(x, y, kind));
  }

  function doneEditing(id: string) {
    setEditingNote((current) => (current === id ? null : current));
    // An empty note is thrown away instead of littering the board.
    const note = useGame.getState().board.notes.find((n) => n.id === id);
    if (note && !note.text.trim()) deleteNote(id);
  }

  const drag = (id: string, x: number, y: number) => {
    if (!readOnly) setLive({ id, x, y });
  };
  const endDrag = () => setLive(null);

  const openTag = openId ? board.items[openId]?.tag : undefined;

  return (
    <section className={styles.screen} aria-label="Evidence Board">
      <div
        className={styles.viewport}
        ref={viewportRef}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div
          className={styles.board}
          style={{
            width: BOARD.width,
            height: BOARD.height,
            transform: camera ? `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})` : undefined,
            visibility: camera ? 'visible' : 'hidden',
            // A CSS url() inside a stylesheet is resolved against the stylesheet (dist/assets/), not the page,
            // so the address is made absolute here.
            ['--cork-texture' as string]: `url(${new URL(`${import.meta.env.BASE_URL}images/texture-corkboard.webp`, document.baseURI).href})`,
          }}
        >
          <div className={styles.header} style={{ height: BOARD_HEADER }}>
            <h1 className={styles.title}>Investigation Wall</h1>
            <p className={styles.subtitle}>Drag the evidence wherever it helps you think. Tap a piece to read it.</p>
          </div>

          {evidence.length === 0 && (
            <p className={styles.empty} style={{ top: BOARD_HEADER + 120 }}>
              Nothing here yet. Evidence you collect in Vila do Sol will be pinned to this wall.
            </p>
          )}

          {/* Strings lie on the cork, under the papers, tied from pin to pin. */}
          <svg className={styles.strings} width={BOARD.width} height={BOARD.height} aria-hidden={!connecting}>
            {board.links.map((link) => {
              const a = anchor(link.from);
              const b = anchor(link.to);
              if (!a || !b) return null;
              return (
                <g key={link.id}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={styles.string} />
                  {connecting && (
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      className={styles.stringHit}
                      role="button"
                      tabIndex={0}
                      aria-label="Cut this string"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => removeLink(link.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') removeLink(link.id);
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {evidence.map((id) => {
            const p = position(id);
            const ev = evidenceById[id];
            const item = board.items[id];
            if (!p || !ev || !item) return null;
            return (
              <BoardItem
                key={id}
                evidence={ev}
                x={p.x}
                y={p.y}
                z={item.z}
                tag={item.tag}
                scale={scale}
                dragging={live?.id === id}
                selected={connectFrom === id}
                onKeyboardFocus={bringIntoView}
                onTap={(tapped) => {
                  if (!pick(tapped)) setOpenId(tapped);
                }}
                onDrag={drag}
                onDrop={(dropped, x, y) => {
                  if (!readOnly) moveItem(dropped, x, y);
                  endDrag();
                }}
                onCancel={endDrag}
              />
            );
          })}

          {board.notes.map((note) => {
            const p = position(note.id) ?? note;
            return (
              <BoardNote
                key={note.id}
                note={note}
                x={p.x}
                y={p.y}
                scale={scale}
                dragging={live?.id === note.id}
                selected={connectFrom === note.id}
                editing={editingNote === note.id}
                basedOn={evidenceTiedTo(note.id)}
                onTap={(tapped) => {
                  if (!readOnly && !pick(tapped)) setEditingNote(tapped);
                }}
                onDrag={drag}
                onDrop={(dropped, x, y) => {
                  if (!readOnly) moveNote(dropped, x, y);
                  endDrag();
                }}
                onCancel={endDrag}
                onChange={updateNote}
                onDoneEditing={doneEditing}
                onDelete={(id) => {
                  setEditingNote(null);
                  deleteNote(id);
                }}
              />
            );
          })}
        </div>
      </div>

      {!readOnly && (
      <div className={styles.tools} role="group" aria-label="Board tools">
        <button className="btn btn--quiet" onClick={() => newNote('note')}>
          + Note
        </button>
        <button className="btn btn--quiet" onClick={() => newNote('conclusion')}>
          + Conclusion
        </button>
        <button className={connecting ? 'btn' : 'btn btn--quiet'} aria-pressed={connecting} onClick={toggleConnecting}>
          {connecting ? 'Done connecting' : 'Connect'}
        </button>
        {connecting && (
          <p className={styles.toolHint} role="status">
            {connectFrom ? 'Now tap what it connects to.' : 'Tap two things to tie a string. Tap a string to cut it.'}
          </p>
        )}
      </div>
      )}

      <div className={styles.zoom} role="group" aria-label="Zoom">
        <button className="btn btn--quiet" aria-label="Zoom out" onClick={() => zoomAt(1 / 1.3, ...centre())}>
          −
        </button>
        <button className="btn btn--quiet" onClick={() => setCamera(settle({ scale: fitScale, x: 0, y: 0 }))}>
          Whole wall
        </button>
        <button className="btn btn--quiet" aria-label="Zoom in" onClick={() => zoomAt(1.3, ...centre())}>
          +
        </button>
      </div>

      {openId && (
        <EvidenceDialog evidenceId={openId} isNew={false} showStatus={false} onClose={() => setOpenId(null)}>
          {!readOnly && (
          <div className={styles.tagRow} role="group" aria-label="How does this evidence look to you?">
            <span className={styles.tagAsk}>Mark it as (your marks count in your Investigator Profile)</span>
            <div className={styles.tagButtons}>
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`${styles.tagButton} ${styles[`tag-${tag}`]}`}
                  aria-pressed={openTag === tag}
                  onClick={() => setTag(openId, openTag === tag ? undefined : tag)}
                >
                  {tag === 'important' ? '★ ' : tag === 'unsure' ? '? ' : '✕ '}
                  {TAG_LABEL[tag]}
                </button>
              ))}
            </div>
          </div>
          )}
        </EvidenceDialog>
      )}
    </section>
  );
}
