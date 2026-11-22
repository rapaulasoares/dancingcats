import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { locationById } from '../../content/locations';
import type { LocationId } from '../../content/types';
import { useGame, visibleLocations } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import { CatSprite, InvestigatorSprite } from './Sprites';
import {
  CAT_START,
  ENTRIES,
  ENTRY_RADIUS,
  MAP_H,
  MAP_W,
  START,
  clearLine,
  findPath,
  isWalkable,
  randomWalkableNear,
  type Pt,
} from './walkways';
import styles from './MapScreen.module.css';

/** Speeds in map pixels per second. The cat is slower than the investigator, and stops to "dance". */
const PLAYER_SPEED = 150;
const CAT_WANDER_SPEED = 45;
const CAT_FLEE_SPEED = 120;
/** The cat runs when the investigator comes this close. */
const CAT_SCARE = 110;
/** Close enough to pick the cat up. */
const CATCH = 22;

type CatMode = 'wander' | 'flee' | 'dance' | 'carried';

/**
 * Kept while the game is open, between visits to the map (not saved): where the
 * investigator stood and where the cat is. A reload starts them again at the harbor.
 */
const world = {
  player: [...START] as Pt,
  cat: { pos: [...CAT_START] as Pt, mode: 'wander' as CatMode, path: [] as Pt[], until: 0, nextDance: 0, rethink: 0 },
  /** The player has been told that the cat is loose. */
  catAnnounced: false,
};

const KEYS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  a: [-1, 0],
  d: [1, 0],
  w: [0, -1],
  s: [0, 1],
};

const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const pct = (p: Pt) => ({ left: `${(p[0] / MAP_W) * 100}%`, top: `${(p[1] / MAP_H) * 100}%` });

/**
 * Moves a point, sliding along the edge of the walkable area when blocked: if the
 * way straight ahead is closed, it tries turning a little to each side, so the
 * investigator follows a road that bends instead of getting stuck against its edge.
 */
const TURNS = [0, 0.35, -0.35, 0.7, -0.7, 1.05, -1.05, 1.4, -1.4];
function step(from: Pt, dx: number, dy: number): Pt {
  const len = Math.hypot(dx, dy);
  if (!len) return from;
  const angle = Math.atan2(dy, dx);
  for (const turn of TURNS) {
    // Turning costs a little speed, so walking into a wall slides slowly rather than racing sideways.
    const l = len * Math.cos(turn * 0.6);
    const nx = from[0] + Math.cos(angle + turn) * l;
    const ny = from[1] + Math.sin(angle + turn) * l;
    if (isWalkable(nx, ny)) return [nx, ny];
  }
  return from;
}

/** Walks along a route; returns the new position and the route left. */
function follow(pos: Pt, path: Pt[], speed: number, dt: number): [Pt, Pt[]] {
  let budget = speed * dt;
  let p = pos;
  const rest = [...path];
  while (rest.length && budget > 0) {
    const target = rest[0];
    const d = dist(p, target);
    if (d <= budget) {
      p = target;
      budget -= d;
      rest.shift();
    } else {
      p = [p[0] + ((target[0] - p[0]) / d) * budget, p[1] + ((target[1] - p[1]) / d) * budget];
      budget = 0;
    }
  }
  return [p, rest];
}

export function MapScreen() {
  const save = useGame();
  const places = visibleLocations(save);
  const { goTo, deliverCat, catDelivered, visitedLocations } = save;
  // The cat is in town from the start until it is brought to the Science Center.
  const catHere = !catDelivered;

  const playerEl = useRef<HTMLDivElement>(null);
  const catEl = useRef<HTMLDivElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const keys = useRef(new Set<string>());
  const route = useRef<Pt[] | null>(null);
  const pendingEnter = useRef<LocationId | null>(null);

  const [near, setNear] = useState<LocationId | null>(null);
  const [carrying, setCarrying] = useState(world.cat.mode === 'carried');
  const [toast, setToast] = useState<string | null>(null);

  // The loop reads these through refs, so it never has to restart.
  const live = useRef({ places, catHere, near, goTo, deliverCat });
  live.current = { places, catHere, near, goTo, deliverCat };

  function enter(id: LocationId) {
    world.player = [...ENTRIES[id]] as Pt;
    live.current.goTo({ screen: 'location', locationId: id });
  }

  function say(text: string) {
    setToast(text);
    window.clearTimeout((say as unknown as { t?: number }).t);
    (say as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 5000);
  }

  useEffect(() => {
    let last = performance.now();
    let frame = 0;
    let nearNow: LocationId | null = null;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const L = live.current;

      // ── The investigator ──
      let vx = 0;
      let vy = 0;
      keys.current.forEach((k) => {
        const v = KEYS[k];
        if (v) {
          vx += v[0];
          vy += v[1];
        }
      });
      let moving = false;
      let facing = 0;
      if (vx || vy) {
        route.current = null;
        pendingEnter.current = null;
        const n = Math.hypot(vx, vy);
        const next = step(world.player, (vx / n) * PLAYER_SPEED * dt, (vy / n) * PLAYER_SPEED * dt);
        moving = next !== world.player;
        facing = vx;
        world.player = next;
      } else if (route.current) {
        const before = world.player;
        const [p, rest] = follow(world.player, route.current, PLAYER_SPEED, dt);
        world.player = p;
        moving = true;
        facing = p[0] - before[0];
        route.current = rest.length ? rest : null;
        if (!route.current && pendingEnter.current) {
          const id = pendingEnter.current;
          pendingEnter.current = null;
          if (dist(world.player, ENTRIES[id]) <= ENTRY_RADIUS) {
            enter(id);
            return;
          }
        }
      }

      // ── The dancing cat ──
      const cat = world.cat;
      if (L.catHere) {
        if (cat.mode === 'carried') {
          cat.pos = [world.player[0] - 10, world.player[1] - 2];
          if (dist(world.player, ENTRIES.science) <= ENTRY_RADIUS + 10) {
            L.deliverCat();
            cat.mode = 'wander';
            setCarrying(false);
            say('Professor Roberto takes the cat into the laboratory. The results are in your messages.');
          }
        } else {
          const d = dist(world.player, cat.pos);
          if (d <= CATCH) {
            cat.mode = 'carried';
            setCarrying(true);
            say('You caught the dancing cat! Take it to the Regional Science Center.');
          } else if (cat.mode === 'dance') {
            if (now >= cat.until) cat.mode = d < CAT_SCARE ? 'flee' : 'wander';
          } else if (d < CAT_SCARE) {
            // Run away from the investigator, but stop now and then to spin: that is the moment to catch it.
            if (cat.mode !== 'flee') {
              cat.mode = 'flee';
              cat.nextDance = now + 900 + Math.random() * 1200;
            }
            if (now >= cat.nextDance) {
              cat.mode = 'dance';
              cat.until = now + 1300;
            } else {
              if (now >= cat.rethink || !cat.path.length) {
                cat.rethink = now + 350;
                let best: Pt | null = null;
                let bestScore = -Infinity;
                for (let i = 0; i < 14; i++) {
                  const c = randomWalkableNear(cat.pos[0], cat.pos[1], 150);
                  if (!clearLine(cat.pos, c)) continue;
                  const score = dist(c, world.player) - dist(c, cat.pos) * 0.2;
                  if (score > bestScore) {
                    bestScore = score;
                    best = c;
                  }
                }
                cat.path = best ? [best] : [];
                if (!best) {
                  // Cornered: it spins on the spot.
                  cat.mode = 'dance';
                  cat.until = now + 1500;
                }
              }
              [cat.pos, cat.path] = follow(cat.pos, cat.path, CAT_FLEE_SPEED, dt);
            }
          } else {
            cat.mode = 'wander';
            if (now >= cat.nextDance) {
              cat.mode = 'dance';
              cat.until = now + 1600;
              cat.nextDance = now + 4000 + Math.random() * 4000;
            } else {
              if (!cat.path.length) cat.path = findPath(cat.pos, randomWalkableNear(cat.pos[0], cat.pos[1], 160)) ?? [];
              [cat.pos, cat.path] = follow(cat.pos, cat.path, CAT_WANDER_SPEED, dt);
            }
          }
        }
      }

      // ── Draw ──
      const pe = playerEl.current;
      if (pe) {
        Object.assign(pe.style, pct(world.player));
        pe.style.zIndex = String(1000 + Math.round(world.player[1]));
        pe.classList.toggle(styles.walking, moving);
        if (facing) pe.classList.toggle(styles.facingLeft, facing < 0);
      }
      const ce = catEl.current;
      if (ce) {
        Object.assign(ce.style, pct(cat.pos));
        ce.style.zIndex = String(1000 + Math.round(cat.pos[1]) + (cat.mode === 'carried' ? 2 : 0));
        ce.classList.toggle(styles.dancing, cat.mode === 'dance');
        ce.classList.toggle(styles.carried, cat.mode === 'carried');
      }

      // ── Which place is the investigator standing at? ──
      let found: LocationId | null = null;
      for (const place of L.places) {
        if (dist(world.player, ENTRIES[place.id]) <= ENTRY_RADIUS) found = place.id;
      }
      if (found !== nearNow) {
        nearNow = found;
        setNear(found);
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard: arrows or WASD to walk, E or Enter to go into the place you are standing at.
  useEffect(() => {
    const typing = (e: KeyboardEvent) =>
      e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    const down = (e: KeyboardEvent) => {
      if (typing(e) || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (KEYS[k]) {
        keys.current.add(k);
        e.preventDefault();
      } else if ((k === 'e' || k === 'Enter') && live.current.near) {
        // Enter on a focused button already presses that button.
        if (k === 'Enter' && e.target instanceof HTMLButtonElement) return;
        e.preventDefault();
        enter(live.current.near);
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys.current.delete(k);
    };
    const clear = () => keys.current.clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The first time the cat is on the map, say so.
  useEffect(() => {
    if (catHere && !world.catAnnounced) {
      world.catAnnounced = true;
      say('A cat is spinning and stumbling near the market. Catch it and take it to the Regional Science Center.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catHere]);

  function walkTo(target: Pt, thenEnter: LocationId | null) {
    route.current = findPath(world.player, target);
    pendingEnter.current = thenEnter;
  }

  function onMapPointer(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || !mapEl.current) return;
    const r = mapEl.current.getBoundingClientRect();
    walkTo([((e.clientX - r.left) / r.width) * MAP_W, ((e.clientY - r.top) / r.height) * MAP_H], null);
  }

  const nearPlace = near ? locationById[near] : null;

  return (
    <section className={styles.screen} aria-label="Map of Vila do Sol">
      <div className={styles.map} ref={mapEl} onPointerDown={onMapPointer}>
        <GameImage
          file="map-vila-do-sol.webp"
          alt="Illustrated map of Vila do Sol: the bay and harbor, the town, the hills, and the industrial area beyond them."
          ratio="1312 / 776"
        />

        <ul className={styles.places}>
          {places.map((place) => {
            const seen = visitedLocations.includes(place.id);
            return (
              <li key={place.id} className={styles.placeSpot} style={pct(ENTRIES[place.id])}>
                <button
                  className={`${styles.place} ${seen ? styles.placeVisited : ''} ${near === place.id ? styles.placeHere : ''}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => walkTo(ENTRIES[place.id], place.id)}
                >
                  {seen && <span aria-hidden="true">✓ </span>}
                  {place.name}
                  <span className={styles.srOnly}>{seen ? ' (visited)' : ' (not visited yet)'}. Walk there.</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div ref={playerEl} className={styles.player} style={pct(world.player)}>
          <InvestigatorSprite />
        </div>
        {catHere && (
          <div ref={catEl} className={styles.cat} style={pct(world.cat.pos)}>
            <CatSprite />
          </div>
        )}

        {toast && (
          <p className={styles.toast} role="status">
            {toast}
          </p>
        )}
      </div>

      <div className={styles.bar}>
        {nearPlace ? (
          <button className="btn" onClick={() => enter(nearPlace.id)}>
            Enter {nearPlace.name} <span className={styles.key}>E</span>
          </button>
        ) : (
          <p className={styles.hint}>
            Walk with the arrow keys or W A S D, or click where you want to go. Walk up to a place to go in.
          </p>
        )}
        {catHere && (
          <p className={styles.goal}>
            {carrying
              ? 'You are carrying the dancing cat. Take it to the Regional Science Center.'
              : 'A dancing cat is loose in town. Catch it and take it to the Regional Science Center.'}
          </p>
        )}
      </div>
    </section>
  );
}
