import { describe, expect, it } from 'vitest';
import { locations } from '../src/content/locations';
import { CAT_START, ENTRIES, START, findPath, isWalkable } from '../src/features/map/walkways';

describe('walking on the map', () => {
  it('every place has an entry point on walkable ground', () => {
    for (const l of locations) {
      const entry = ENTRIES[l.id];
      expect(entry, l.id).toBeDefined();
      expect(isWalkable(entry[0], entry[1]), l.id).toBe(true);
    }
    expect(isWalkable(START[0], START[1])).toBe(true);
    expect(isWalkable(CAT_START[0], CAT_START[1])).toBe(true);
  });

  it('every place can be reached on foot from the starting point', () => {
    for (const l of locations) {
      const route = findPath(START, ENTRIES[l.id]);
      expect(route, l.id).not.toBeNull();
      const end = route![route!.length - 1];
      expect(Math.hypot(end[0] - ENTRIES[l.id][0], end[1] - ENTRIES[l.id][1]), l.id).toBeLessThan(12);
    }
  });

  it('the sea is not walkable', () => {
    expect(isWalkable(700, 700)).toBe(false);
    expect(isWalkable(1250, 300)).toBe(false);
  });
});
