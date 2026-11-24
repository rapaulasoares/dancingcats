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
  if (on) {
    preload();
    play('pick');
  }
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

/**
 * Applause: hundreds of tiny claps at random moments, thickest in the middle and fading out.
 * Each clap is a few milliseconds of bright, decaying noise, so together they sound like hands.
 */
function applause(ctx: AudioContext, length = 2.4, volume = 1.6) {
  const rate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, Math.floor(rate * length), rate);
  const data = buffer.getChannelData(0);
  const claps = 260;
  for (let c = 0; c < claps; c++) {
    // More claps near the start, then a long tail.
    const t = Math.pow(Math.random(), 1.6) * (length - 0.1);
    const start = Math.floor(t * rate);
    const size = Math.floor(rate * (0.012 + Math.random() * 0.02));
    const loud = (0.4 + Math.random() * 0.6) * (1 - t / length);
    let last = 0;
    for (let i = 0; i < size && start + i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      // Differencing keeps the bright part of the noise, like the slap of palms.
      const bright = white - last;
      last = white;
      data[start + i] += bright * Math.exp((-6 * i) / size) * loud * 0.35;
    }
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2200;
  filter.Q.value = 0.5;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

/**
 * A worried murmur: several low "voices" (a buzzing tone through two vowel-like filters), each
 * rising and falling in syllables at its own pace, so it sounds like people talking quietly.
 */
function murmur(ctx: AudioContext, length = 1.9, volume = 0.25) {
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, ctx.currentTime);
  out.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.25);
  out.gain.setValueAtTime(volume, ctx.currentTime + length - 0.5);
  out.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + length);
  out.connect(ctx.destination);

  const vowels = [
    [730, 1090],
    [530, 1840],
    [270, 2290],
    [570, 840],
  ];
  for (let v = 0; v < 6; v++) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const pitch = 95 + Math.random() * 130;
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    // The pitch drifts a little, like speech.
    osc.frequency.linearRampToValueAtTime(pitch * (0.85 + Math.random() * 0.3), ctx.currentTime + length);

    const formantA = ctx.createBiquadFilter();
    const formantB = ctx.createBiquadFilter();
    formantA.type = formantB.type = 'bandpass';
    const [fa, fb] = vowels[Math.floor(Math.random() * vowels.length)];
    formantA.frequency.value = fa;
    formantB.frequency.value = fb;
    formantA.Q.value = formantB.Q.value = 6;

    // Syllables: the voice swells and fades three to five times a second.
    const voice = ctx.createGain();
    voice.gain.value = 0.0;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 2.5 + Math.random() * 3;
    const depth = ctx.createGain();
    depth.gain.value = 0.5;
    const level = ctx.createConstantSource();
    level.offset.value = 0.5;
    lfo.connect(depth).connect(voice.gain);
    level.connect(voice.gain);

    osc.connect(formantA).connect(voice);
    osc.connect(formantB).connect(voice);
    voice.connect(out);

    for (const node of [osc, lfo, level]) {
      node.start(ctx.currentTime);
      node.stop(ctx.currentTime + length + 0.1);
    }
  }
}

export type SoundName = 'pick' | 'applause' | 'murmur' | 'stamp' | 'medal';

/**
 * Real recordings win over the synthesized sounds: drop applause.mp3, murmur.mp3 (or stamp.mp3, medal.mp3)
 * into public/sounds/ and they are used instead. Keep them short (about 3 seconds). A missing file is not an error.
 */
const samples = new Map<SoundName, AudioBuffer | null>();
const loading = new Set<SoundName>();

async function loadSample(name: SoundName) {
  const ctx = audio();
  if (!ctx || samples.has(name) || loading.has(name)) return;
  loading.add(name);
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}sounds/${name}.mp3`);
    // A development server answers a missing file with the home page.
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || type.includes('text/html')) throw new Error('no recording');
    samples.set(name, await ctx.decodeAudioData(await res.arrayBuffer()));
  } catch {
    samples.set(name, null);
  } finally {
    loading.delete(name);
  }
}

function preload() {
  (['applause', 'murmur', 'stamp', 'medal'] as SoundName[]).forEach((n) => void loadSample(n));
}

function playSample(ctx: AudioContext, buffer: AudioBuffer) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  const end = Math.min(buffer.duration, 3.5);
  gain.gain.setValueAtTime(1, ctx.currentTime);
  gain.gain.setValueAtTime(1, ctx.currentTime + Math.max(0, end - 0.4));
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + end);
  source.connect(gain).connect(ctx.destination);
  source.start();
  source.stop(ctx.currentTime + end);
}

export function play(name: SoundName) {
  if (!enabled) return;
  const ctx = audio();
  if (!ctx) return;
  if (!samples.has(name)) void loadSample(name); // so a recording is ready next time
  const recording = samples.get(name);
  if (recording) {
    playSample(ctx, recording);
    return;
  }
  switch (name) {
    case 'pick':
      tone(ctx, 660, 0, 0.08, 'triangle', 0.1);
      break;
    case 'applause':
      applause(ctx);
      break;
    case 'murmur':
      murmur(ctx);
      break;
    case 'stamp':
      tone(ctx, 90, 0, 0.25, 'sine', 0.4);
      tone(ctx, 55, 0, 0.3, 'triangle', 0.3);
      break;
    case 'medal':
      [784, 988, 1319].forEach((f, i) => tone(ctx, f, i * 0.11, 0.4, 'sine', 0.12));
      break;
  }
}
