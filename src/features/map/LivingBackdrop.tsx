import { useEffect, useMemo, useRef, useState } from 'react';
import { GameImage } from '../../ui/GameImage';
import styles from './LivingBackdrop.module.css';

/**
 * The map of Vila do Sol as a living picture: a short silent video, looped without a visible jump. The still
 * map stays underneath as the first thing shown, as the fallback when the video cannot play, and as the
 * picture for people who asked their device for less motion.
 *
 * The video (vila-do-sol-video.mp4) is the same scene as the still map, framed a little differently: one
 * video pixel is 1 / 0.927 map pixels across and 1 / 0.892 map pixels down, and map y = 0 sits at video y = 41.
 * The numbers below place it so that every position of the game (roads, entrances, places) still lines up.
 */
const SRC = `${import.meta.env.BASE_URL}images/vila-do-sol-video.mp4`;
const VIDEO_W = 1280;
const VIDEO_H = 720;
const SCALE_X = 0.927;
const SCALE_Y = 0.892;
const TOP_OFFSET = 41;
const FIT = {
  left: '0%',
  top: `${(-TOP_OFFSET / SCALE_Y / 776) * 100}%`,
  width: `${(VIDEO_W / SCALE_X / 1312) * 100}%`,
  height: `${(VIDEO_H / SCALE_Y / 776) * 100}%`,
};

export function LivingBackdrop() {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    if (reduced || failed) return;
    const va = a.current;
    const vb = b.current;
    if (!va || !vb) return;
    let raf = 0;
    let started = false;

    // Two copies of the video play half a clip apart. The top one fades out just as it reaches the end of its
    // clip, so the jump from the last frame back to the first is never seen.
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
          setPlaying(true);
          frame();
        })
        .catch(() => setFailed(true));
    };

    va.addEventListener('canplay', start);
    vb.addEventListener('canplay', start);
    start();
    return () => {
      cancelAnimationFrame(raf);
      va.removeEventListener('canplay', start);
      vb.removeEventListener('canplay', start);
    };
  }, [reduced, failed]);

  return (
    <div className={styles.backdrop}>
      <GameImage
        file="map-vila-do-sol.webp"
        alt="Illustrated map of Vila do Sol: the bay and harbor, the town, the hills, and the industrial area beyond them."
        ratio="1312 / 776"
      />
      {!reduced && !failed && (
        <div className={playing ? styles.videoLayerOn : styles.videoLayer} aria-hidden="true">
          {[a, b].map((ref, i) => (
            <video
              key={i}
              ref={ref}
              className={styles.video}
              style={FIT}
              src={SRC}
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              onError={() => setFailed(true)}
            />
          ))}
          {/* The generator's mark sits in the open sea at the bottom right: a soft haze covers it. */}
          <div className={styles.haze} />
        </div>
      )}
    </div>
  );
}
