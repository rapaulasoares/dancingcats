import type { EvidenceBody } from '../../content/types';
import styles from './diagrams.module.css';

/**
 * Drawings rendered from code, so they stay sharp, editable and readable by
 * screen readers. Each has a text alternative in the evidence body itself.
 */

/** The bay, shared by the harbor chart and the mud sampling map. North is up. */
function BayBase() {
  return (
    <>
      <rect width="400" height="250" className={styles.sea} />
      {/* Land: mountains to the north and west, the bay opening to the south-east. */}
      <path
        className={styles.land}
        d="M0,0 H400 V52 Q352,58 318,44 Q300,36 292,58 Q286,84 244,82 Q176,76 136,112 Q104,142 112,186 Q118,222 84,250 H0 Z"
      />
      {/* Hills between the town and the industrial area. */}
      <path className={styles.hill} d="M170,34 q14,-22 28,0 q12,-18 26,0 q14,-20 30,0" />
      <path className={styles.hill} d="M30,40 q14,-24 28,0 q12,-18 26,0" />
      {/* River */}
      <path className={styles.river} d="M0,150 Q50,140 78,160 Q98,172 112,178" />
      {/* Drainage channel arriving at the north point from beyond the hills. */}
      <path className={styles.channel} d="M360,8 Q330,22 304,46" />
    </>
  );
}

function Label({ x, y, children, anchor = 'start' }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={styles.label}>
      {children}
    </text>
  );
}

function HarborChart() {
  return (
    <svg viewBox="0 0 400 250" className={styles.svg} aria-hidden="true">
      <BayBase />
      <circle cx="128" cy="124" r="5" className={styles.town} />
      <Label x={120} y={118} anchor="end">Vila do Sol harbor</Label>
      <Label x={300} y={74}>North point</Label>
      <Label x={352} y={24} anchor="end">Drainage channel</Label>
      <Label x={6} y={144}>River</Label>
      <Label x={96} y={236} anchor="end">South beach</Label>
      <rect x="92" y="206" width="9" height="7" className={styles.yard} />
      <Label x={88} y={212} anchor="end">Boat-repair yard</Label>
      <Label x={22} y={62}>Serra reservoir</Label>
      <ellipse cx="56" cy="74" rx="14" ry="6" className={styles.river} style={{ fill: 'var(--sea-light)' }} />
      <g className={styles.grounds}>
        <ellipse cx="250" cy="150" rx="62" ry="34" />
        <ellipse cx="322" cy="98" rx="30" ry="18" />
      </g>
      <Label x={250} y={154} anchor="middle">Fishing grounds</Label>
      <text x="386" y="238" textAnchor="end" className={styles.compass}>N ↑</text>
    </svg>
  );
}

function SedimentMap() {
  const sites = [
    { id: 'A', x: 306, y: 60, value: 48 },
    { id: 'B', x: 236, y: 150, value: 17 },
    { id: 'C', x: 116, y: 214, value: 4 },
    { id: 'D', x: 124, y: 178, value: 2 },
  ];
  // Inside the channel there is a concrete bed and no mud, so it has no level on this map.
  const channelSite = { id: 'E', x: 366, y: 44 };
  return (
    <svg viewBox="0 0 400 250" className={styles.svg} aria-hidden="true">
      <BayBase />
      <Label x={352} y={24} anchor="end">Channel</Label>
      <Label x={6} y={144}>River</Label>
      <rect x="92" y="206" width="9" height="7" className={styles.yard} />
      {sites.map((s) => (
        <g key={s.id}>
          {/* Circle area grows with the measured level. */}
          <circle cx={s.x} cy={s.y} r={4 + Math.sqrt(s.value) * 2.6} className={styles.siteHalo} />
          <circle cx={s.x} cy={s.y} r="9" className={styles.site} />
          <text x={s.x} y={s.y + 4} textAnchor="middle" className={styles.siteId}>
            {s.id}
          </text>
          <text x={s.x + 14} y={s.y + 22} className={styles.siteValue}>
            {s.value}
          </text>
        </g>
      ))}
      <g>
        <circle cx={channelSite.x} cy={channelSite.y} r="9" className={styles.site} />
        <text x={channelSite.x} y={channelSite.y + 4} textAnchor="middle" className={styles.siteId}>
          {channelSite.id}
        </text>
      </g>
      <text x="386" y="238" textAnchor="end" className={styles.compass}>N ↑</text>
    </svg>
  );
}

function FoodChain() {
  const Box = ({ x, y, w, text }: { x: number; y: number; w: number; text: string }) => (
    <g>
      <rect x={x} y={y} width={w} height="30" rx="4" className={styles.box} />
      <text x={x + w / 2} y={y + 20} textAnchor="middle" className={styles.boxText}>
        {text}
      </text>
    </g>
  );
  const Arrow = ({ d }: { d: string }) => <path d={d} className={styles.arrow} markerEnd="url(#arrowhead)" />;
  return (
    <svg viewBox="0 0 400 250" className={styles.svg} aria-hidden="true">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className={styles.arrowHead} />
        </marker>
      </defs>
      <Box x={140} y={206} w={120} text="Plankton" />
      <Arrow d="M200,204 V182" />
      <Box x={110} y={150} w={180} text="Small fish and shellfish" />
      <Arrow d="M200,148 V126" />
      <Box x={140} y={94} w={120} text="Larger fish" />
      <Arrow d="M170,92 L78,48" />
      <Arrow d="M200,92 V48" />
      <Arrow d="M230,92 L322,48" />
      <Box x={24} y={16} w={104} text="Seabirds" />
      <Box x={148} y={16} w={104} text="Cats" />
      <Box x={272} y={16} w={104} text="People" />
      <text x="8" y="244" className={styles.compass}>
        An arrow means "is eaten by".
      </text>
    </svg>
  );
}

/** Bars drawn from the evidence's own table (first column label, second column number). */
function BarChart({ body }: { body: EvidenceBody }) {
  const rows = body.table?.rows ?? [];
  const values = rows.map((r) => Number(r[1]) || 0);
  const max = Math.max(1, ...values);
  const slot = 360 / Math.max(1, rows.length);
  return (
    <svg viewBox="0 0 400 220" className={styles.svg} aria-hidden="true">
      <line x1="30" y1="180" x2="390" y2="180" className={styles.axis} />
      {rows.map((r, i) => {
        const h = (values[i] / max) * 140;
        const x = 30 + i * slot + slot * 0.2;
        return (
          <g key={r[0]}>
            <rect x={x} y={180 - h} width={slot * 0.6} height={h} className={styles.bar} />
            <text x={x + slot * 0.3} y={172 - h} textAnchor="middle" className={styles.barValue}>
              {r[1]}
            </text>
            <text x={x + slot * 0.3} y={198} textAnchor="middle" className={styles.label}>
              {r[0].slice(0, 3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Weekly record, shown by month: July of last year to June of this year. */
function BayMonitoring() {
  const months = ['J', 'A', 'S', 'O', 'N', 'D', 'J', 'F', 'M', 'A', 'M', 'J'];
  const temperature = [22, 22.5, 23.5, 24.5, 25.5, 26.5, 28.6, 27, 26, 25, 24, 23];
  const algae = [10, 11, 10, 12, 11, 13, 46, 13, 11, 10, 11, 10];
  const x = (i: number) => 44 + i * 30;
  const line = (data: number[], y: (v: number) => number) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');
  const yTemp = (v: number) => 96 - (v - 20) * 7;
  const yAlgae = (v: number) => 214 - v * 1.4;
  return (
    <svg viewBox="0 0 400 240" className={styles.svg} aria-hidden="true">
      {/* Normal range for water temperature */}
      <rect x="40" y={yTemp(27.5)} width="340" height={yTemp(21) - yTemp(27.5)} className={styles.band} />
      <text x="44" y="16" className={styles.label}>Water temperature (shaded: normal range)</text>
      <path d={line(temperature, yTemp)} className={styles.lineWarm} />
      <text x="44" y="136" className={styles.label}>Algae in the water</text>
      <path d={line(algae, yAlgae)} className={styles.lineGreen} />
      <line x1="40" y1="216" x2="380" y2="216" className={styles.axis} />
      {months.map((m, i) => (
        <text key={i} x={x(i)} y="232" textAnchor="middle" className={styles.label}>
          {m}
        </text>
      ))}
    </svg>
  );
}

export function Diagram({ body }: { body: EvidenceBody }) {
  switch (body.diagram) {
    case 'harborChart':
      return <HarborChart />;
    case 'sedimentMap':
      return <SedimentMap />;
    case 'foodChain':
      return <FoodChain />;
    case 'casesChart':
      return <BarChart body={body} />;
    case 'bayMonitoring':
      return <BayMonitoring />;
    default:
      return null;
  }
}
