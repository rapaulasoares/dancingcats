import { useEffect, useRef, type CSSProperties } from 'react';

interface Props {
  src: string;
  className?: string;
  style?: CSSProperties;
  /** Seconds of soft transition on each side of the restart. Shorter shows less doubling of moving things. */
  fade?: number;
  /** Called once both copies are really playing. */
  onPlaying?: () => void;
  /** Called when the video cannot be loaded or played. */
  onFail?: () => void;
}

/**
 * A silent video that loops without a hard jump. Two copies play half a clip apart. Most of the time only the
 * first one is seen; just around the moment it restarts, the second one (which is in the middle of its clip) fades
 * in and out over a short window, so the cut from the last frame to the first is softened. The window is short on
 * purpose: a longer blend shows moving things (a running rat, a bird) twice, like a ghost.
 * The parent decides what to show instead when the video fails or when the user asked for less motion.
 */
export function LoopVideo({ src, className, style, fade = 0.2, onPlaying, onFail }: Props) {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const callbacks = useRef({ onPlaying, onFail });
  callbacks.current = { onPlaying, onFail };

  useEffect(() => {
    const va = a.current;
    const vb = b.current;
    if (!va || !vb) return;
    let raf = 0;
    let started = false;

    const frame = () => {
      const d = va.duration || 1;
      const t = va.currentTime % d;
      // How close the first copy is to its restart, from 0 (far) to 1 (right at it).
      const k = Math.max(0, 1 - Math.min(t, d - t) / fade);
      vb.style.opacity = String(k * k * (3 - 2 * k));
      // Keep the two copies half a clip apart if one of them drifts.
      const expected = (va.currentTime + d / 2) % d;
      const off = Math.abs(vb.currentTime - expected);
      if (off > 0.3 && off < d - 0.3) vb.currentTime = expected;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (started || va.readyState < 2 || vb.readyState < 2 || !va.duration) return;
      started = true;
      vb.currentTime = va.duration / 2;
      Promise.all([va.play(), vb.play()])
        .then(() => {
          callbacks.current.onPlaying?.();
          frame();
        })
        .catch(() => callbacks.current.onFail?.());
    };

    va.addEventListener('canplay', start);
    vb.addEventListener('canplay', start);
    start();
    return () => {
      cancelAnimationFrame(raf);
      va.removeEventListener('canplay', start);
      vb.removeEventListener('canplay', start);
    };
  }, [src]);

  return (
    <>
      {[a, b].map((ref, i) => (
        <video
          key={i}
          ref={ref}
          className={className}
          style={style}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onError={() => callbacks.current.onFail?.()}
        />
      ))}
    </>
  );
}
