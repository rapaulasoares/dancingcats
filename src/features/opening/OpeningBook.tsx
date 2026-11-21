import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from 'react';
import HTMLFlipBookTyped from 'react-pageflip';
import { opening, type OpeningPage } from '../../content/opening';
import { useGame } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import styles from './OpeningBook.module.css';

/** react-pageflip's prop types demand every optional prop, so it is typed loosely here. */
const HTMLFlipBook = HTMLFlipBookTyped as unknown as ComponentType<Record<string, unknown>>;

/** Turns **bold** markers into <strong>. */
function rich(text: string): ReactNode[] {
  return text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

/**
 * The flip library clones its direct children and needs a ref to each, so
 * every leaf is a forwardRef component with a plain div at its root.
 */
const PictureLeaf = forwardRef<HTMLDivElement, { page: OpeningPage }>(({ page }, ref) => (
  <div ref={ref} className={styles.leaf}>
    <div className={styles.picture}>
      <GameImage file={page.image} alt={page.imageAlt} ratio="auto" className={styles.image} />
    </div>
  </div>
));
PictureLeaf.displayName = 'PictureLeaf';

const TextLeaf = forwardRef<HTMLDivElement, { page: OpeningPage; number: number }>(
  ({ page, number }, ref) => (
    <div ref={ref} className={styles.leaf}>
      <article className={styles.page} aria-label={`Page ${number} of ${opening.length}`}>
        {page.heading && <h1 className={styles.heading}>{page.heading}</h1>}
        {page.subheading && <p className={styles.subheading}>{page.subheading}</p>}
        {page.paragraphs.map((p, i) => (
          <p key={i}>{rich(p)}</p>
        ))}
        {page.closing && <p className={styles.closing}>{page.closing}</p>}
      </article>
    </div>
  ),
);
TextLeaf.displayName = 'TextLeaf';

interface Props {
  /**
   * Re-reading the story later in the game: starts at the first page, changes
   * nothing in the saved game, and ends with Close instead of entering the town.
   */
  onClose?: () => void;
}

/** Width over height of one page of the book. */
const PAGE_RATIO = 520 / 640;
const MAX_PAGE_H = 900;

/** Each story page is two leaves: the picture, then the text. */
const LEAVES = opening.length * 2;

interface FlipApi {
  flipNext: () => void;
  flipPrev: () => void;
  getOrientation: () => string;
}
interface FlipRef {
  pageFlip: () => FlipApi | undefined;
}

export function OpeningBook({ onClose }: Props) {
  const rereading = !!onClose;
  const saved = useGame((s) => s.openingPage);
  const setOpeningPage = useGame((s) => s.setOpeningPage);
  const finishOpening = useGame((s) => s.finishOpening);

  const last = opening.length - 1;
  const startStory = rereading ? 0 : Math.min(saved, last);
  // Index of the leaf on the left of the open spread (or the single leaf shown on narrow screens).
  const [leaf, setLeaf] = useState(startStory * 2);
  const [narrow, setNarrow] = useState(false);
  const bookRef = useRef<FlipRef>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // The book is given an exact size that fits the space left on the screen. Left to itself the flip
  // library sizes the book from the window width alone, so on a short window it covers the buttons.
  const [book, setBook] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const pageH = Math.min(stage.clientHeight, stage.clientWidth / 2 / PAGE_RATIO, MAX_PAGE_H);
      const h = Math.max(Math.floor(pageH), 120);
      setBook((old) => {
        const w = Math.floor(h * PAGE_RATIO) * 2;
        return old && old.w === w && old.h === h ? old : { w, h };
      });
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const index = Math.min(Math.floor(leaf / 2), last);
  const atEnd = narrow ? leaf >= LEAVES - 1 : index >= last;
  const atStart = leaf <= 0;

  const next = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);
  const prev = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);

  // The flip library tells us when a turn finishes; keep the saved page in step.
  const onFlip = useCallback(
    (e: { data: number }) => {
      setLeaf(e.data);
      if (!rereading) setOpeningPage(Math.min(Math.floor(e.data / 2), last));
    },
    [rereading, setOpeningPage, last],
  );

  const onInit = useCallback(() => {
    setNarrow(bookRef.current?.pageFlip()?.getOrientation() === 'portrait');
  }, []);
  const onChangeOrientation = useCallback((e: { data: string }) => {
    setNarrow(e.data === 'portrait');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  return (
    <main className={styles.screen}>
      <div className={styles.stage} ref={stageRef}>
        {/* The announcement for screen readers; the turning pages are decoration. */}
        <p className={styles.srOnly} aria-live="polite">
          Page {index + 1} of {opening.length}
          {opening[index].heading ? `: ${opening[index].heading}` : ''}
        </p>

        {book && (
        <div
          className={styles.bookBox}
          style={{ ['--book-w' as string]: `${book.w}px`, ['--book-h' as string]: `${book.h}px` } as CSSProperties}
        >
        <HTMLFlipBook
          ref={bookRef}
          className={styles.flip}
          style={{}}
          width={520}
          height={640}
          size="stretch"
          minWidth={100}
          maxWidth={760}
          minHeight={200}
          maxHeight={900}
          showCover={false}
          usePortrait={false}
          startPage={startStory * 2}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          drawShadow={true}
          flippingTime={900}
          useMouseEvents={true}
          swipeDistance={30}
          clickEventForward={true}
          disableFlipByClick={true}
          showPageCorners={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          onInit={onInit}
          onChangeOrientation={onChangeOrientation}
        >
          {opening.flatMap((page, i) => [
            <PictureLeaf key={`p${i}`} page={page} />,
            <TextLeaf key={`t${i}`} page={page} number={i + 1} />,
          ])}
        </HTMLFlipBook>
        </div>
        )}
      </div>

      <nav className={styles.controls} aria-label="Story pages">
        <button className="btn btn--quiet" onClick={prev} disabled={atStart}>
          Back
        </button>

        <ol className={styles.dots} aria-hidden="true">
          {opening.map((_, i) => (
            <li key={i} className={i === index ? styles.dotActive : i < index ? styles.dotDone : styles.dot} />
          ))}
        </ol>
        <span className={styles.count}>
          Page {index + 1} of {opening.length}
        </span>

        {rereading && !atEnd && (
          <button className="btn btn--quiet" onClick={onClose}>
            Close the story
          </button>
        )}
        {!atEnd ? (
          <button className="btn" onClick={next}>
            Next
          </button>
        ) : rereading ? (
          <button className="btn" onClick={onClose}>
            Close the story
          </button>
        ) : (
          <button className="btn" onClick={finishOpening}>
            Enter Vila do Sol
          </button>
        )}
      </nav>
    </main>
  );
}
