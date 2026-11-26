import { useEffect, useRef, type CSSProperties } from 'react';

interface Props {
  src: string;
  className?: string;
  style?: CSSProperties;
  /**
   * Seconds over which the end of the clip dissolves into its own beginning. With 0 the clip simply restarts
   * (a plain cut), which is the better choice when something moves across the picture: a dissolve shows it twice.
   */
  fade?: number;
  /** Called once the video is really playing. */
  onPlaying?: () => void;
  /** Called when the video cannot be loaded or played. */
  onFail?: () => void;
}

const smooth = (k: number) => k * k * (3 - 2 * k);

/**
 * A silent video that loops without a visible jump. Two copies of the clip take turns: while the first one plays its
 * last moments, the second starts from the beginning and fades in on top of it, so the end dissolves into the start.
 * The parent decides what to show instead when the video fails or when the user asked for less motion.
 */
export function LoopVideo({ src, className, style, fade = 0.5, onPlaying, onFail }: Props) {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const callbacks = useRef({ onPlaying, onFail });
  callbacks.current = { onPlaying, onFail };
  const cut = fade <= 0;

  useEffect(() => {
    const first = a.current;
    const second = b.current;
    if (!first || !second) return;
    let cur = first;
    let nxt = second;
    let raf = 0;
    let started = false;
    first.style.opacity = '1';
    first.style.zIndex = '0';
    second.style.opacity = '0';
    second.style.zIndex = '1';

    const frame = () => {
      const d = cur.duration || 1;
      const t = cur.currentTime;
      if (t >= d - fade) {
        if (nxt.paused) {
          nxt.currentTime = 0;
          nxt.play().catch(() => undefined);
        }
        nxt.style.opacity = String(smooth(Math.min(1, (t - (d - fade)) / fade)));
      }
      if (cur.ended || t >= d - 0.03) {
        // The other copy now covers this one completely: swap roles and rewind the one that finished.
        nxt.style.opacity = '1';
        nxt.style.zIndex = '1';
        cur.style.zIndex = '0';
        cur.pause();
        cur.currentTime = 0;
        cur.style.opacity = '0';
        [cur, nxt] = [nxt, cur];
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (started || first.readyState < 2 || (!cut && second.readyState < 2) || !first.duration) return;
      started = true;
      first
        .play()
        .then(() => {
          callbacks.current.onPlaying?.();
          if (!cut) frame();
        })
        .catch(() => callbacks.current.onFail?.());
    };

    first.addEventListener('canplay', start);
    second.addEventListener('canplay', start);
    start();
    return () => {
      cancelAnimationFrame(raf);
      first.removeEventListener('canplay', start);
      second.removeEventListener('canplay', start);
    };
  }, [src, fade, cut]);

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
          loop={cut}
          playsInline
          preload="auto"
          hidden={cut && i === 1}
          disablePictureInPicture
          onError={() => callbacks.current.onFail?.()}
        />
      ))}
    </>
  );
}
