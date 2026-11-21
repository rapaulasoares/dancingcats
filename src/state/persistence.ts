import type { StateStorage } from 'zustand/middleware';

/**
 * localStorage wrapper for the save game.
 * - Never throws: private browsing or blocked storage must not crash the game.
 * - Debounced: dragging on the Evidence Board changes state many times a second.
 * - Flushed when the page is hidden or closed, so nothing is lost on refresh.
 */

export const SAVE_KEY = 'dancing-cats:save';
export const SAVE_VERSION = 1;
const DEBOUNCE_MS = 300;

let pending: { name: string; value: string } | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

function write(name: string, value: string): void {
  try {
    localStorage.setItem(name, value);
  } catch {
    // Storage full or blocked. The game keeps running without saving.
  }
}

/** Write any waiting save immediately. */
export function flushSave(): void {
  if (timer) clearTimeout(timer);
  timer = undefined;
  if (pending) {
    write(pending.name, pending.value);
    pending = null;
  }
}

export const saveStorage: StateStorage = {
  getItem(name) {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    pending = { name, value };
    if (timer) clearTimeout(timer);
    timer = setTimeout(flushSave, DEBOUNCE_MS);
  },
  removeItem(name) {
    pending = null;
    if (timer) clearTimeout(timer);
    try {
      localStorage.removeItem(name);
    } catch {
      // Nothing to remove.
    }
  },
};

/** True when the browser lets us save. Checked once at start-up. */
export function storageAvailable(): boolean {
  try {
    const probe = '__dancing-cats-probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSave();
  });
}
