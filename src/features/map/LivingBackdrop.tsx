import { useMemo, useState } from 'react';
import { GameImage } from '../../ui/GameImage';
import { LoopVideo } from '../../ui/LoopVideo';
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
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  return (
    <div className={styles.backdrop}>
      <GameImage
        file="map-vila-do-sol.webp"
        alt="Illustrated map of Vila do Sol: the bay and harbor, the town, the hills, and the industrial area beyond them."
        ratio="1312 / 776"
      />
      {!reduced && !failed && (
        <div className={playing ? styles.videoLayerOn : styles.videoLayer} aria-hidden="true">
          <LoopVideo src={SRC} className={styles.video} style={FIT} onPlaying={() => setPlaying(true)} onFail={() => setFailed(true)} />
          {/* The generator's mark sits in the open sea at the bottom right: a soft haze covers it. */}
          <div className={styles.haze} />
        </div>
      )}
    </div>
  );
}
