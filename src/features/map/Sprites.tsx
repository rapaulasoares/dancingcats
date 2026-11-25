import styles from './Sprites.module.css';

/**
 * The two characters who move on the map, drawn in SVG so they stay sharp at any size. Every part that moves
 * is its own shape, so the walk cycle (legs, arms, body, hat) is done with CSS, and the contact shadow is a
 * separate element so it stays on the ground while the body bobs. The bottom middle of each box is the ground.
 *
 * The detective has three drawings: seen from the front, from the back and from the side (the side is mirrored
 * for west). The map chooses which one is visible with data-dir ("s", "n", "e", "w").
 */

const COAT = '#c9a46a';
const COAT_DARK = '#a3824f';
const COAT_LIGHT = '#dcbc84';
const SKIN = '#c68a5c';
const SKIN_DARK = '#a86d44';
const HAT = '#5c4630';
const HAT_BAND = '#2e2318';
const BOOT = '#3a2c22';
const INK = '#4b3a26';

function Magnifier({ x, y }: { x: number; y: number }) {
  return (
    <g className={styles.lens}>
      <line x1={x} y1={y} x2={x + 3.6} y2={y - 4.6} stroke="#5a4630" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={x + 4.4} cy={y - 7} r="3.2" fill="rgba(200,235,255,0.55)" stroke="#c9a24a" strokeWidth="1.3" />
      <path d="M2.4 -8.2 q1.2 -1.4 2.8 -1" transform={`translate(${x + 2.4} ${y + 1.6})`} stroke="#fff" strokeWidth="0.7" fill="none" opacity="0.8" />
    </g>
  );
}

function Front() {
  return (
    <g className={styles.viewS}>
      <g className={styles.legL}>
        <rect x="9.6" y="33" width="4.6" height="11" rx="1.6" fill={BOOT} />
        <ellipse cx="11.9" cy="44.6" rx="3.4" ry="1.6" fill="#241a14" />
      </g>
      <g className={styles.legR}>
        <rect x="15.8" y="33" width="4.6" height="11" rx="1.6" fill={BOOT} />
        <ellipse cx="18.1" cy="44.6" rx="3.4" ry="1.6" fill="#241a14" />
      </g>
      <g className={styles.body}>
        <g className={styles.armL}>
          <rect x="4.6" y="21" width="4" height="11" rx="2" fill={COAT_DARK} />
          <rect x="3.6" y="28.5" width="5.6" height="7" rx="1" fill="#f6efdf" stroke={INK} strokeWidth="0.8" />
          <path d="M4.6 30.5h3.6M4.6 32.5h3.6" stroke="#b9ad95" strokeWidth="0.5" />
        </g>
        <path d="M8 20 Q15 16.4 22 20 L23.2 37 Q15 39 6.8 37 Z" fill={COAT} stroke={INK} strokeWidth="0.9" />
        <path d="M15 19 L15 37" stroke={INK} strokeWidth="0.7" />
        <path d="M8.8 22 L15 27 L12 21 Z M21.2 22 L15 27 L18 21 Z" fill={COAT_LIGHT} stroke={INK} strokeWidth="0.5" />
        <rect x="7.4" y="29.2" width="15.2" height="2" fill="#6b4a2c" />
        <circle cx="15" cy="30.2" r="0.9" fill="#d9b24a" />
        <circle cx="15" cy="24" r="0.6" fill={INK} />
        <circle cx="15" cy="34" r="0.6" fill={INK} />
        <g className={styles.armR}>
          <rect x="21.4" y="21" width="4" height="11" rx="2" fill={COAT_DARK} />
          <circle cx="23.4" cy="32.6" r="1.8" fill={SKIN} />
          <Magnifier x={23.4} y={32} />
        </g>
        <g className={styles.head}>
          <circle cx="15" cy="13.4" r="5.6" fill={SKIN} />
          <ellipse cx="12.8" cy="13.2" rx="0.9" ry="1.2" fill="#2a1a10" />
          <ellipse cx="17.2" cy="13.2" rx="0.9" ry="1.2" fill="#2a1a10" />
          <path d="M11.6 11.4 q1.2 -0.9 2.4 -0.2 M16 11.2 q1.2 -0.7 2.4 0.2" stroke="#3a2416" strokeWidth="0.7" fill="none" strokeLinecap="round" />
          <path d="M12.6 16 Q15 17.8 17.4 16" stroke="#3a2416" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          <circle cx="11.2" cy="15" r="1" fill="#e0987a" opacity="0.5" />
          <circle cx="18.8" cy="15" r="1" fill="#e0987a" opacity="0.5" />
          <ellipse cx="15" cy="9.3" rx="8.2" ry="1.9" fill={HAT} />
          <path d="M9.4 9.3 Q9.8 2.6 15 2.6 Q20.2 2.6 20.6 9.3 Z" fill={HAT} />
          <rect x="9.5" y="7.1" width="11" height="1.4" fill={HAT_BAND} />
          <path d="M11.5 4.6 Q13.5 3.4 16 3.6" stroke="#8a6a4a" strokeWidth="0.7" fill="none" opacity="0.7" />
        </g>
      </g>
    </g>
  );
}

function Back() {
  return (
    <g className={styles.viewN}>
      <g className={styles.legL}>
        <rect x="9.6" y="33" width="4.6" height="11" rx="1.6" fill={BOOT} />
        <ellipse cx="11.9" cy="44.6" rx="3.4" ry="1.6" fill="#241a14" />
      </g>
      <g className={styles.legR}>
        <rect x="15.8" y="33" width="4.6" height="11" rx="1.6" fill={BOOT} />
        <ellipse cx="18.1" cy="44.6" rx="3.4" ry="1.6" fill="#241a14" />
      </g>
      <g className={styles.body}>
        <g className={styles.armL}>
          <rect x="4.6" y="21" width="4" height="11" rx="2" fill={COAT_DARK} />
          <circle cx="6.6" cy="32.6" r="1.8" fill={SKIN} />
        </g>
        <path d="M8 20 Q15 16.4 22 20 L23.4 38 Q15 40 6.6 38 Z" fill={COAT_DARK} stroke={INK} strokeWidth="0.9" />
        <path d="M15 19 L15 39" stroke={INK} strokeWidth="0.7" />
        <path d="M9 22 L21 22 L20 25 L10 25 Z" fill={COAT} />
        <rect x="7.2" y="29.4" width="15.6" height="2" fill="#6b4a2c" />
        {/* the satchel strap and the bag at the hip */}
        <path d="M9 20.4 L22 31" stroke="#6b4a2c" strokeWidth="1.4" />
        <rect x="19" y="30" width="6.4" height="6" rx="1.2" fill="#8a5f3b" stroke={INK} strokeWidth="0.7" />
        <g className={styles.armR}>
          <rect x="21.4" y="21" width="4" height="11" rx="2" fill={COAT_DARK} />
          <circle cx="23.4" cy="32.6" r="1.8" fill={SKIN} />
        </g>
        <g className={styles.head}>
          <circle cx="15" cy="13.4" r="5.6" fill="#3a2416" />
          <path d="M9.8 15 q5.2 3.6 10.4 0" fill="#3a2416" />
          <ellipse cx="15" cy="9.3" rx="8.2" ry="1.9" fill={HAT} />
          <path d="M9.4 9.3 Q9.8 2.6 15 2.6 Q20.2 2.6 20.6 9.3 Z" fill={HAT} />
          <rect x="9.5" y="7.1" width="11" height="1.4" fill={HAT_BAND} />
        </g>
      </g>
    </g>
  );
}

function Side() {
  return (
    <g className={styles.viewE}>
      <g className={styles.legFar}>
        <rect x="13.4" y="33" width="4.6" height="11" rx="1.6" fill="#2a2018" />
        <ellipse cx="16.8" cy="44.6" rx="3.8" ry="1.5" fill="#1b130e" />
      </g>
      <g className={styles.body}>
        <g className={styles.armFar}>
          <rect x="13" y="21" width="3.8" height="11" rx="1.9" fill={COAT_DARK} />
        </g>
        <path d="M10 20 Q15 16.8 20 20 L21 37 Q15 38.6 9.4 37 Z" fill={COAT} stroke={INK} strokeWidth="0.9" />
        <rect x="9.6" y="29.2" width="11" height="2" fill="#6b4a2c" />
        <circle cx="19.2" cy="30.2" r="0.8" fill="#d9b24a" />
        <path d="M10 22 L9.2 36" stroke={COAT_LIGHT} strokeWidth="0.8" opacity="0.7" />
        <rect x="8.6" y="30" width="4.8" height="5.4" rx="1" fill="#8a5f3b" stroke={INK} strokeWidth="0.6" />
        <g className={styles.armNear}>
          <rect x="12.6" y="21" width="4" height="11" rx="2" fill={COAT_LIGHT} stroke={INK} strokeWidth="0.5" />
          <circle cx="14.6" cy="32.6" r="1.8" fill={SKIN} />
          <rect x="15" y="29" width="4.4" height="6" rx="0.8" fill="#f6efdf" stroke={INK} strokeWidth="0.7" />
        </g>
        <g className={styles.head}>
          <circle cx="15" cy="13.4" r="5.4" fill={SKIN} />
          <path d="M19.6 13.6 q1.6 0.8 0.4 2" fill={SKIN} stroke={SKIN_DARK} strokeWidth="0.5" />
          <ellipse cx="17.6" cy="12.8" rx="0.9" ry="1.2" fill="#2a1a10" />
          <path d="M16.2 11.1 q1.2 -0.8 2.4 0" stroke="#3a2416" strokeWidth="0.7" fill="none" strokeLinecap="round" />
          <path d="M16.6 16.2 Q18 17 19.2 16.2" stroke="#3a2416" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M10 11.4 Q8.8 14.6 11 16.4 Q11.4 13.4 12.4 11.2 Z" fill="#3a2416" />
          <ellipse cx="15.4" cy="9.3" rx="8.4" ry="1.9" fill={HAT} />
          <path d="M9.8 9.3 Q10.2 2.6 15.4 2.6 Q20.6 2.6 21 9.3 Z" fill={HAT} />
          <rect x="9.9" y="7.1" width="11.2" height="1.4" fill={HAT_BAND} />
        </g>
      </g>
      <g className={styles.legNear}>
        <rect x="11.2" y="33" width="4.8" height="11" rx="1.6" fill={BOOT} />
        <ellipse cx="14.9" cy="44.6" rx="4" ry="1.6" fill="#241a14" />
      </g>
      <g className={styles.lensNear}>
        <Magnifier x={19.6} y={31.4} />
      </g>
    </g>
  );
}

/** The investigator: three views in one drawing, only the one for the direction of travel is shown. */
export function InvestigatorSprite() {
  return (
    <svg viewBox="0 0 30 48" aria-hidden="true" className={styles.investigator}>
      <Front />
      <Back />
      <Side />
    </svg>
  );
}

/** A soft shadow on the ground: flattened to match the tilt of the map, and cool in colour, like the light. */
export function ContactShadow({ width = 70 }: { width?: number }) {
  return <span className={styles.shadow} style={{ width: `${width}%` }} aria-hidden="true" />;
}

export function CatSprite() {
  return (
    <svg viewBox="0 0 40 30" aria-hidden="true" className={styles.catSvg}>
      {/* far legs, a little darker, behind the body */}
      <g className={styles.catLegBackFar}>
        <rect x="8" y="20.5" width="3.2" height="9" rx="1.4" fill="#b9702f" />
      </g>
      <g className={styles.catLegFrontFar}>
        <rect x="23" y="20.5" width="3.2" height="9" rx="1.4" fill="#b9702f" />
      </g>
      <g className={styles.catTail}>
        <path d="M8 18 Q1 12 5 4" stroke="#c97b36" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M3.6 8.5 l2.4 1.2 M2.6 12 l2.6 0.8" stroke="#8a4f1c" strokeWidth="0.9" />
      </g>
      <g className={styles.catBody}>
        <ellipse cx="18" cy="19" rx="11" ry="6.5" fill="#d98b42" />
        <path d="M13 13.8 L13 24 M18 13 L18 25 M23 13.8 L23 24" stroke="#a85f24" strokeWidth="1.6" />
        <ellipse cx="19.5" cy="22.4" rx="6" ry="2.6" fill="#f2dfc2" opacity="0.8" />
        <g className={styles.catHead}>
          <circle cx="30" cy="13" r="6.5" fill="#e09a52" />
          <path d="M25 9 L26 2.5 L29.5 7.5 Z M31 7.5 L34.5 2.5 L35.5 9 Z" fill="#e09a52" stroke="#a85f24" strokeWidth="0.6" />
          <path d="M26.2 7.6 L26.6 4.6 L28.4 7 Z M32 7 L34 4.6 L34.6 7.6 Z" fill="#e8a8a0" opacity="0.8" />
          <path d="M27 12 l2 2 m0 -2 l-2 2 M32 12 l2 2 m0 -2 l-2 2" stroke="#3a2416" strokeWidth="0.9" />
          <path d="M29.5 16.5 Q31 17.5 32.5 16.5" stroke="#3a2416" strokeWidth="0.8" fill="none" />
          <path d="M33 14.6 l3.4 -0.6 M33 15.6 l3.4 0.6" stroke="#f2e6d0" strokeWidth="0.5" />
        </g>
      </g>
      <g className={styles.catLegBackNear}>
        <rect x="10" y="21" width="3.6" height="8.8" rx="1.5" fill="#d98b42" />
      </g>
      <g className={styles.catLegFrontNear}>
        <rect x="21.4" y="21" width="3.6" height="8.8" rx="1.5" fill="#d98b42" />
      </g>
    </svg>
  );
}
