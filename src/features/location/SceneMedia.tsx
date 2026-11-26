import { useMemo, useState } from 'react';
import { GameImage } from '../../ui/GameImage';
import { LoopVideo } from '../../ui/LoopVideo';
import styles from './SceneMedia.module.css';

interface Props {
  image: string;
  alt: string;
  /** A silent looping video of the same scene, same framing as the picture. */
  video?: string;
  /** Restart the loop with a plain cut instead of a soft blend. */
  cut?: boolean;
}

/**
 * The picture of a place. When the place has a video, it fades in over the still picture and loops; the still stays
 * underneath as the first thing shown, as the fallback if the video cannot play, and for people who asked their
 * device for less motion.
 */
export function SceneMedia({ image, alt, video, cut }: Props) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  return (
    <div className={styles.media}>
      <GameImage file={image} alt={alt} ratio="16 / 9" />
      {video && !reduced && !failed && (
        <div className={playing ? styles.layerOn : styles.layer} aria-hidden="true">
          <LoopVideo
            src={`${import.meta.env.BASE_URL}images/${video}`}
            className={styles.video}
            fade={cut ? 0 : undefined}
            onPlaying={() => setPlaying(true)}
            onFail={() => setFailed(true)}
          />
        </div>
      )}
    </div>
  );
}
