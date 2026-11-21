/**
 * The two characters who move on the map, drawn in SVG so they stay sharp at any size.
 * Both are drawn standing on the bottom edge of their box: the map places that point on the ground.
 */

export function InvestigatorSprite() {
  return (
    <svg viewBox="0 0 30 48" aria-hidden="true">
      <ellipse cx="15" cy="46" rx="9" ry="2.5" fill="rgba(0,0,0,0.35)" />
      {/* legs */}
      <rect className="legL" x="10" y="33" width="4" height="12" rx="1.5" fill="#3a2c22" />
      <rect className="legR" x="16" y="33" width="4" height="12" rx="1.5" fill="#3a2c22" />
      {/* coat */}
      <path d="M8 20 Q15 16 22 20 L23 36 Q15 38 7 36 Z" fill="#8a6a43" stroke="#4b3a26" strokeWidth="1" />
      <path d="M15 19 L15 36" stroke="#4b3a26" strokeWidth="0.8" />
      {/* notebook arm */}
      <rect x="4" y="23" width="5" height="7" rx="1" fill="#f6efdf" stroke="#4b3a26" strokeWidth="0.8" />
      {/* magnifying glass */}
      <line x1="23" y1="27" x2="27" y2="22" stroke="#5a4630" strokeWidth="1.6" />
      <circle cx="27.5" cy="19.5" r="3.2" fill="rgba(200,235,255,0.6)" stroke="#c9a24a" strokeWidth="1.3" />
      {/* head */}
      <circle cx="15" cy="13" r="5.5" fill="#c68a5c" />
      <path d="M11.5 15.5 Q15 17.5 18.5 15.5" stroke="#3a2416" strokeWidth="1" fill="none" />
      {/* bowler hat */}
      <ellipse cx="15" cy="9" rx="8" ry="1.8" fill="#4b3a26" />
      <path d="M9.5 9 Q10 2.5 15 2.5 Q20 2.5 20.5 9 Z" fill="#5c4630" />
      <rect x="9.6" y="7" width="10.8" height="1.4" fill="#2e2318" />
    </svg>
  );
}

export function CatSprite() {
  return (
    <svg viewBox="0 0 40 30" aria-hidden="true">
      <ellipse cx="20" cy="28" rx="12" ry="2" fill="rgba(0,0,0,0.3)" />
      {/* tail */}
      <path d="M8 18 Q1 12 5 4" stroke="#c97b36" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      {/* body */}
      <ellipse cx="18" cy="19" rx="11" ry="6.5" fill="#d98b42" />
      <path d="M13 14 L13 24 M18 13 L18 25 M23 14 L23 24" stroke="#a85f24" strokeWidth="1.6" />
      {/* legs */}
      <rect x="10" y="22" width="3" height="6" rx="1.2" fill="#d98b42" />
      <rect x="23" y="22" width="3" height="6" rx="1.2" fill="#d98b42" />
      {/* head */}
      <circle cx="30" cy="13" r="6.5" fill="#e09a52" />
      <path d="M25 9 L26 2.5 L29.5 7.5 Z M31 7.5 L34.5 2.5 L35.5 9 Z" fill="#e09a52" stroke="#a85f24" strokeWidth="0.6" />
      {/* dizzy eyes: the cat is sick */}
      <path d="M27 12 l2 2 m0 -2 l-2 2 M32 12 l2 2 m0 -2 l-2 2" stroke="#3a2416" strokeWidth="0.9" />
      <path d="M29.5 16.5 Q31 17.5 32.5 16.5" stroke="#3a2416" strokeWidth="0.8" fill="none" />
    </svg>
  );
}
