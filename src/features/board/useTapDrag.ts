import { useRef, type PointerEvent } from 'react';

/** A finger or mouse must travel this far (in screen pixels) before a tap becomes a drag. */
const DRAG_THRESHOLD = 6;

interface Options {
  x: number;
  y: number;
  /** Current zoom of the board, to convert screen movement into board units. */
  scale: number;
  onTap: () => void;
  onDrag: (x: number, y: number) => void;
  onDrop: (x: number, y: number) => void;
  onCancel: () => void;
}

/**
 * Pointer handlers for anything pinned to the board. A press that barely moves
 * is a tap; otherwise the object follows the pointer. Works the same for mouse,
 * touch and pen.
 */
export function useTapDrag({ x, y, scale, onTap, onDrag, onDrop, onCancel }: Options) {
  const start = useRef<{ px: number; py: number; x: number; y: number; moved: boolean; last: [number, number] } | null>(null);

  return {
    onPointerDown(e: PointerEvent<HTMLElement>) {
      if (e.button !== 0) return;
      e.stopPropagation(); // the board must not start panning
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Some browsers refuse capture for certain pointers; dragging still works while over the object.
      }
      start.current = { px: e.clientX, py: e.clientY, x, y, moved: false, last: [x, y] };
    },
    onPointerMove(e: PointerEvent<HTMLElement>) {
      const s = start.current;
      if (!s) return;
      const dx = e.clientX - s.px;
      const dy = e.clientY - s.py;
      if (!s.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      s.moved = true;
      s.last = [s.x + dx / scale, s.y + dy / scale];
      onDrag(...s.last);
    },
    onPointerUp(e: PointerEvent<HTMLElement>) {
      const s = start.current;
      start.current = null;
      if (!s) return;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
      if (s.moved) onDrop(...s.last);
      else onTap();
    },
    onPointerCancel() {
      start.current = null;
      onCancel();
    },
  };
}
