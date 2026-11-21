import { useState } from 'react';
import styles from './GameImage.module.css';

interface Props {
  /** File name inside /public/images, e.g. "harbor.webp". */
  file: string;
  /** Describes the picture for screen readers. Empty string for decoration. */
  alt: string;
  /** CSS aspect-ratio, e.g. "16 / 9". Keeps layout stable before art exists. */
  ratio?: string;
  className?: string;
}

/**
 * Shows an image from /public/images. Until the art file exists, it shows a
 * tinted paper placeholder with the file name, so layouts never break and
 * art can be dropped in at any time without code changes.
 */
export function GameImage({ file, alt, ratio = '16 / 9', className }: Props) {
  // Remember which file failed, so a different file gets a fresh attempt.
  const [missingFile, setMissingFile] = useState<string | null>(null);
  const missing = missingFile === file;
  const setMissing = (isMissing: boolean) => setMissingFile(isMissing ? file : null);
  const src = `${import.meta.env.BASE_URL}images/${file}`;

  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(' ')}
      style={{ aspectRatio: ratio }}
    >
      {missing ? (
        <div className={styles.placeholder} role="img" aria-label={alt || undefined}>
          <span className={styles.label}>image coming soon</span>
          <span className={styles.file}>{file}</span>
        </div>
      ) : (
        <img
          className={styles.img}
          src={src}
          alt={alt}
          draggable={false}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
