import { useSyncExternalStore } from 'react';

/**
 * Optional sounds, made by code (no audio files). Off until the player turns them on, and the
 * choice is remembered on this device. Nothing in the game depends on hearing them.
 */

const KEY = 'dancing-cats:sound';
const listeners = new Set<() => void>();
let enabled = false;
try {
  enabled = localStorage.getItem(KEY) === 'on';
} catch {
  enabled = false;
}

let context: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  context ??= new Ctor();
  if (context.state === 'suspended') void context.resume();
  return context;
}

export const soundEnabled = () => enabled;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // The choice is simply not remembered.
  }
  listeners.forEach((l) => l());
  if (on) play('pick');
}

/** For a toggle button: re-renders when the choice changes. */
export function useSoundEnabled(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => enabled,
    () => false,
  );
}

function tone(ctx: AudioContext, freq: number, start: number, length: number, type: OscillatorType = 'sine', volume = 0.15) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + length);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + length + 0.05);
}

/** A burst of filtered noise: clapping when bright and short, a murmur when dark and slow. */
function noise(ctx: AudioContext, start: number, length: number, freq: number, volume: number, pulses: number) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * length), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    // Many small pulses, like hands clapping out of step.
    const pulse = 0.4 + 0.6 * Math.abs(Math.sin(t * pulses * Math.PI));
    data[i] = (Math.random() * 2 - 1) * pulse * (1 - t);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(ctx.currentTime + start);
}

export type SoundName = 'pick' | 'applause' | 'murmur' | 'stamp' | 'medal';

export function play(name: SoundName) {
  if (!enabled) return;
  const ctx = audio();
  if (!ctx) return;
  switch (name) {
    case 'pick':
      tone(ctx, 660, 0, 0.08, 'triangle', 0.1);
      break;
    case 'applause':
      [523, 659, 784].forEach((f, i) => tone(ctx, f, i * 0.09, 0.25, 'triangle', 0.12));
      noise(ctx, 0.1, 1.2, 2500, 0.5, 40);
      break;
    case 'murmur':
      tone(ctx, 220, 0, 0.35, 'sine', 0.12);
      tone(ctx, 165, 0.25, 0.5, 'sine', 0.12);
      noise(ctx, 0, 1.2, 400, 0.6, 7);
      break;
    case 'stamp':
      tone(ctx, 90, 0, 0.25, 'sine', 0.4);
      noise(ctx, 0, 0.15, 900, 0.6, 3);
      break;
    case 'medal':
      [784, 988, 1319].forEach((f, i) => tone(ctx, f, i * 0.11, 0.4, 'sine', 0.12));
      break;
  }
}
