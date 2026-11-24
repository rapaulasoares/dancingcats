import { describe, expect, it, vi } from 'vitest';

const disk = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (k: string) => disk.get(k) ?? null,
  setItem: (k: string, v: string) => void disk.set(k, v),
  removeItem: (k: string) => void disk.delete(k),
});

const { soundEnabled, setSoundEnabled, play } = await import('../src/ui/sound');

describe('optional sound', () => {
  it('is off by default, remembers the choice, and never fails where there is no audio', () => {
    expect(soundEnabled()).toBe(false);
    expect(() => play('applause')).not.toThrow();
    setSoundEnabled(true);
    expect(soundEnabled()).toBe(true);
    expect(disk.get('dancing-cats:sound')).toBe('on');
    expect(() => play('stamp')).not.toThrow();
    setSoundEnabled(false);
    expect(disk.get('dancing-cats:sound')).toBe('off');
  });
});
