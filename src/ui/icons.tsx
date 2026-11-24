/** Small drawn icons, so they stay sharp at any size and need no image files. */

export function Magnifier({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="13" cy="13" r="8.5" fill="rgba(255,255,255,0.55)" stroke="currentColor" strokeWidth="3" />
      <path d="M7.5 10a6.5 6.5 0 0 1 4-3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M20 20l8 8" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
}

/** A reel of red thread, the kind detectives tie between clues. */
export function YarnSpool({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      <rect x="7" y="6" width="24" height="5" rx="2.5" fill="#c9a36a" stroke="#5b3d28" strokeWidth="1.4" />
      <rect x="7" y="33" width="24" height="5" rx="2.5" fill="#c9a36a" stroke="#5b3d28" strokeWidth="1.4" />
      <rect x="10" y="11" width="18" height="22" fill="#c2463a" stroke="#7d251d" strokeWidth="1.4" />
      <path d="M10 15h18M10 19h18M10 23h18M10 27h18M10 31h18" stroke="#ec8c82" strokeWidth="1.3" />
      <path
        d="M28 26c7-1 6 6 11 7s3 6 3 6"
        stroke="#c2463a"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
