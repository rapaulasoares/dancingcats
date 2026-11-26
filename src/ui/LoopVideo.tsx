import { useEffect, useRef, type CSSProperties } from 'react';

interface Props {
  src: string;
  className?: string;
  style?: CSSProperties;
  /** Called once both copies are really playing. */
  onPlaying?: () => void;
  /** Called when the video cannot be loaded or played. */
  onFail?: () => void;
}

/**
 * A silent video that loops without a visible jump. Two copies play half a clip apart, and the top one fades out
 * just as it reaches the end of its clip, so the cut from the last frame back to the first is never seen.
 * The parent decides what to show instead when the video fails or when the user asked for less motion.
 */
export function LoopVideo({ src, className, style, onPlaying, onFail }: Props) {
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
      const p = (va.currentTime % d) / d;
      const s = Math.sin(Math.PI * p);
      vb.style.opacity = String(1 - s * s);
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
