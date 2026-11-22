import type { LocationId } from '../../content/types';

/**
 * Where the investigator can walk on the illustrated map of Vila do Sol.
 * Every coordinate is in pixels of the map image (map-vila-do-sol.webp, 1312 × 776),
 * so the same numbers work at any screen size.
 *
 * The walkable area is the union of the roads (lines with a half-width) and the
 * open spaces (circles). Change these numbers if the map art changes.
 */
export const MAP_W = 1312;
export const MAP_H = 776;

export type Pt = [number, number];

export const ROADS: { pts: Pt[]; r: number }[] = [
  // The lane through the fishing community, east to the market.
  { pts: [[60, 465], [140, 455], [240, 412], [330, 398], [450, 385], [512, 425], [570, 452], [620, 446]], r: 28 },
  // A street all the way round the fish market.
  {
    pts: [[512, 425], [503, 370], [530, 333], [620, 322], [712, 332], [738, 385], [732, 440], [640, 460], [570, 452], [512, 425]],
    r: 20,
  },
  // The dirt lane below the community houses, along the beach to the harbor cobbles.
  { pts: [[200, 556], [330, 556], [420, 545], [470, 525]], r: 22 },
  // From the top of the market street up to the clinic, between the houses.
  { pts: [[625, 326], [632, 292], [640, 266]], r: 22 },
  // Down from the market to the harbor cobbles and the docks.
  { pts: [[620, 440], [560, 472], [480, 522], [430, 548]], r: 28 },
  { pts: [[560, 472], [540, 565]], r: 22 },
  // The market street east to the town square.
  { pts: [[620, 440], [720, 440], [800, 418], [850, 398]], r: 26 },
  // From the square down to the Science Center terrace, around the left of the building.
  { pts: [[930, 410], [950, 452], [960, 500], [990, 540], [1040, 572]], r: 20 },
  // Out along the long dock below the harbor.
  { pts: [[500, 585], [470, 640]], r: 16 },
  // The dirt road from the clinic up to Dona Rosa's house.
  { pts: [[612, 265], [520, 255], [420, 235], [335, 205], [330, 188]], r: 18 },
  // The road from the clinic up the hill to Tucano Industrial.
  { pts: [[612, 265], [690, 262], [720, 218], [800, 190], [870, 168], [905, 140], [880, 114], [840, 116]], r: 18 },
  // A path from the factory road to the channel at the north point.
  { pts: [[905, 140], [950, 158], [978, 172]], r: 16 },
  // From the west side of the square up to the clinic road.
  { pts: [[790, 330], [772, 285], [745, 245]], r: 18 },
];

export const PLAZAS: { c: Pt; r: number }[] = [
  { c: [870, 362], r: 95 }, // the town square around the big tree
  { c: [620, 446], r: 40 }, // in front of the market
  { c: [490, 527], r: 55 }, // the harbor cobbles
  { c: [1030, 572], r: 40 }, // the terrace in front of the Science Center
  { c: [640, 262], r: 35 }, // the clinic forecourt
  { c: [255, 420], r: 42 }, // the open ground in the fishing community
];

/** Places inside the walkable area that cannot be walked through. */
export const BLOCKS: { c: Pt; r: number }[] = [
  { c: [862, 335], r: 50 }, // the trunk and low branches of the big tree in the square
];

/** Buildings inside the walkable area: [left, top, right, bottom]. */
export const BLOCK_BOXES: [number, number, number, number][] = [
  [527, 343, 714, 430], // the fish market
];

/** Where the investigator stands to go into each place. */
export const ENTRIES: Record<LocationId, Pt> = {
  harbor: [540, 562],
  market: [620, 440],
  clinic: [612, 265],
  community: [255, 412],
  square: [850, 398],
  rosa: [330, 190],
  tucano: [840, 116],
  channel: [978, 172],
  science: [995, 540],
};

/** Where the investigator stands when the map opens for the first time. */
export const START: Pt = [520, 540];
/** Where the dancing cat starts. */
export const CAT_START: Pt = [720, 440];

/** How close (in map pixels) counts as "at" a place. */
export const ENTRY_RADIUS = 34;

function distToSegment(px: number, py: number, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / len2));
  return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
}

/** True when a point on the map is on a road or in an open space. */
export function isWalkable(x: number, y: number): boolean {
  for (const b of BLOCKS) if (Math.hypot(x - b.c[0], y - b.c[1]) < b.r) return false;
  for (const [l, t, r, btm] of BLOCK_BOXES) if (x > l && x < r && y > t && y < btm) return false;
  for (const p of PLAZAS) if (Math.hypot(x - p.c[0], y - p.c[1]) <= p.r) return true;
  for (const road of ROADS) {
    for (let i = 0; i < road.pts.length - 1; i++) {
      if (distToSegment(x, y, road.pts[i], road.pts[i + 1]) <= road.r) return true;
    }
  }
  return false;
}

// ───────────── A coarse grid, for finding a route to a clicked point ─────────────

export const CELL = 8;
const COLS = Math.ceil(MAP_W / CELL);
const ROWS = Math.ceil(MAP_H / CELL);

let grid: Uint8Array | null = null;
function walkGrid(): Uint8Array {
  if (grid) return grid;
  grid = new Uint8Array(COLS * ROWS);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r * COLS + c] = isWalkable(c * CELL + CELL / 2, r * CELL + CELL / 2) ? 1 : 0;
    }
  }
  return grid;
}

const cellOf = (x: number, y: number): [number, number] => [
  Math.max(0, Math.min(COLS - 1, Math.floor(x / CELL))),
  Math.max(0, Math.min(ROWS - 1, Math.floor(y / CELL))),
];
const centre = (c: number, r: number): Pt => [c * CELL + CELL / 2, r * CELL + CELL / 2];

/** The walkable cell nearest to a point, searching outwards ring by ring. */
function nearestOpenCell(x: number, y: number): [number, number] | null {
  const g = walkGrid();
  const [c0, r0] = cellOf(x, y);
  for (let ring = 0; ring < 40; ring++) {
    let best: [number, number] | null = null;
    let bestD = Infinity;
    for (let dr = -ring; dr <= ring; dr++) {
      for (let dc = -ring; dc <= ring; dc++) {
        if (Math.max(Math.abs(dr), Math.abs(dc)) !== ring) continue;
        const c = c0 + dc;
        const r = r0 + dr;
        if (c < 0 || r < 0 || c >= COLS || r >= ROWS || !g[r * COLS + c]) continue;
        const d = dc * dc + dr * dr;
        if (d < bestD) {
          bestD = d;
          best = [c, r];
        }
      }
    }
    if (best) return best;
  }
  return null;
}

/** The nearest walkable point to (x, y). */
export function nearestWalkable(x: number, y: number): Pt | null {
  if (isWalkable(x, y)) return [x, y];
  const cell = nearestOpenCell(x, y);
  return cell ? centre(cell[0], cell[1]) : null;
}

/** True when the straight line between two points stays on walkable ground. */
export function clearLine(a: Pt, b: Pt): boolean {
  const steps = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    if (!isWalkable(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)) return false;
  }
  return true;
}

/**
 * A walkable route from one point to another (the end is moved to the nearest
 * walkable point). Returns the points to walk through, or null if there is none.
 */
export function findPath(from: Pt, to: Pt): Pt[] | null {
  const g = walkGrid();
  const start = nearestOpenCell(from[0], from[1]);
  const goal = nearestOpenCell(to[0], to[1]);
  if (!start || !goal) return null;
  const startI = start[1] * COLS + start[0];
  const goalI = goal[1] * COLS + goal[0];
  const prev = new Int32Array(COLS * ROWS).fill(-1);
  prev[startI] = startI;
  const queue = new Int32Array(COLS * ROWS);
  let head = 0;
  let tail = 0;
  queue[tail++] = startI;
  const steps = [
    [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];
  while (head < tail) {
    const i = queue[head++];
    if (i === goalI) break;
    const c = i % COLS;
    const r = (i - c) / COLS;
    for (const [dc, dr] of steps) {
      const nc = c + dc;
      const nr = r + dr;
      if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) continue;
      const ni = nr * COLS + nc;
      if (!g[ni] || prev[ni] !== -1) continue;
      // No cutting corners between two blocked cells.
      if (dc && dr && (!g[r * COLS + nc] || !g[nr * COLS + c])) continue;
      prev[ni] = i;
      queue[tail++] = ni;
    }
  }
  if (prev[goalI] === -1) return null;

  const cells: Pt[] = [];
  for (let i = goalI; i !== startI; i = prev[i]) cells.push(centre(i % COLS, Math.floor(i / COLS)));
  cells.reverse();
  const end = nearestWalkable(to[0], to[1]) ?? cells[cells.length - 1];
  if (cells.length) cells[cells.length - 1] = end;
  else cells.push(end);

  // Straighten the route: skip every point that can be reached in a straight line.
  const route: Pt[] = [];
  let from0: Pt = from;
  let i = 0;
  while (i < cells.length) {
    let j = cells.length - 1;
    while (j > i && !clearLine(from0, cells[j])) j--;
    route.push(cells[j]);
    from0 = cells[j];
    i = j + 1;
  }
  return route;
}

/** A random walkable point within `radius` of (x, y), or anywhere if none is found. */
export function randomWalkableNear(x: number, y: number, radius: number): Pt {
  for (let tries = 0; tries < 60; tries++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * radius;
    const px = x + Math.cos(a) * d;
    const py = y + Math.sin(a) * d;
    if (isWalkable(px, py)) return [px, py];
  }
  return [x, y];
}
