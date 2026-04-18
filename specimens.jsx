// specimens.jsx — SVG illustrations, field-guide style.
// Each specimen is a function that returns an <svg> given (id, swayAmt).
// Drawn in ink linework over muted watercolor washes.

const INK = '#2a2620';
const INK_SOFT = '#534a3e';

// Shared filter defs (watercolor texture) reused by reference
function Defs() {
  return (
    <defs>
      <filter id="paper" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>
        <feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.92  0 0 0 0 0.85  0 0 0 0.08 0"/>
        <feComposite in2="SourceGraphic" operator="in"/>
        <feBlend in="SourceGraphic" mode="multiply"/>
      </filter>
      <filter id="wash" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="7"/>
        <feDisplacementMap in="SourceGraphic" scale="1.5"/>
      </filter>
    </defs>
  );
}

// ─────────────────────────────────────────────────────────────
// Plants
// ─────────────────────────────────────────────────────────────

function Fern({ w = 120, h = 180 }) {
  // A Boston-style fern: central stem with alternating fronds
  const fronds = [];
  const count = 14;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const y = 160 - t * 140;
    const len = 8 + Math.sin(t * Math.PI) * 38;
    const side = i % 2 === 0 ? 1 : -1;
    fronds.push(
      <g key={i} style={{ transformOrigin: `60px ${y}px` }}>
        <path
          d={`M 60 ${y} Q ${60 + side * len * 0.5} ${y - 4} ${60 + side * len} ${y - 10}`}
          stroke={INK} strokeWidth="1.1" fill="none" strokeLinecap="round"
        />
        {/* leaflets */}
        {[0.25, 0.5, 0.75].map((s, j) => (
          <ellipse
            key={j}
            cx={60 + side * len * s}
            cy={y - 4 * s - 2}
            rx={3 + (1 - s) * 2}
            ry={1.6}
            fill="#6b8758"
            transform={`rotate(${side * (20 + j * 10)} ${60 + side * len * s} ${y - 4 * s - 2})`}
          />
        ))}
        <ellipse cx={60 + side * len} cy={y - 10} rx="5" ry="2.2" fill="#7a9465"
          transform={`rotate(${side * 45} ${60 + side * len} ${y - 10})`} />
      </g>
    );
  }
  return (
    <svg viewBox="0 0 120 180" width={w} height={h} style={{ overflow: 'visible' }}>
      <Defs/>
      {/* pot/soil indicator removed — plants live in open soil */}
      <path d="M 60 170 Q 58 120 60 30" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      {fronds}
    </svg>
  );
}

function Succulent({ w = 100, h = 110 }) {
  // Rosette echeveria
  const petals = [];
  const rings = [
    { r: 36, count: 8, color: '#8fa67a', stroke: INK },
    { r: 24, count: 7, color: '#a3b884', stroke: INK },
    { r: 14, count: 6, color: '#b8ca9c', stroke: INK_SOFT },
    { r: 6,  count: 4, color: '#cdd9ae', stroke: INK_SOFT },
  ];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.count; i++) {
      const a = (i / ring.count) * Math.PI * 2 + ri * 0.3;
      const cx = 50 + Math.cos(a) * ring.r * 0.55;
      const cy = 60 + Math.sin(a) * ring.r * 0.35;
      petals.push(
        <ellipse key={`${ri}-${i}`} cx={cx} cy={cy} rx={ring.r * 0.42} ry={ring.r * 0.22}
          fill={ring.color} stroke={ring.stroke} strokeWidth="0.8"
          transform={`rotate(${(a * 180 / Math.PI)} ${cx} ${cy})`} />
      );
    }
  });
  return (
    <svg viewBox="0 0 100 110" width={w} height={h} style={{ overflow: 'visible' }}>
      <Defs/>
      {petals}
      <circle cx="50" cy="60" r="3" fill="#d7a85c" stroke={INK} strokeWidth="0.6"/>
    </svg>
  );
}

function Moss({ w = 140, h = 40 }) {
  const dots = [];
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 130 + 5;
    const y = 20 + Math.random() * 18;
    const r = 2 + Math.random() * 3;
    const greens = ['#6d8a52', '#7d9a62', '#8aa76f', '#96b77c', '#5e7a47'];
    dots.push(<circle key={i} cx={x} cy={y} r={r} fill={greens[i % greens.length]} opacity={0.85}/>);
  }
  return (
    <svg viewBox="0 0 140 40" width={w} height={h} style={{ overflow: 'visible' }}>
      <ellipse cx="70" cy="30" rx="62" ry="8" fill="#4a5e38" opacity="0.35"/>
      {dots}
    </svg>
  );
}

function Mushroom({ w = 70, h = 90 }) {
  return (
    <svg viewBox="0 0 70 90" width={w} height={h} style={{ overflow: 'visible' }}>
      <Defs/>
      {/* stem */}
      <path d="M 28 88 Q 26 60 30 45 L 40 45 Q 44 60 42 88 Z" fill="#f2ead6" stroke={INK} strokeWidth="1.2"/>
      {/* cap */}
      <path d="M 10 48 Q 10 20 35 18 Q 60 20 60 48 Q 35 55 10 48 Z" fill="#a83e33" stroke={INK} strokeWidth="1.3"/>
      {/* spots */}
      <ellipse cx="22" cy="32" rx="4" ry="3" fill="#f6eddb"/>
      <ellipse cx="40" cy="28" rx="5" ry="3.5" fill="#f6eddb"/>
      <ellipse cx="50" cy="38" rx="3" ry="2" fill="#f6eddb"/>
      <ellipse cx="30" cy="42" rx="2.5" ry="1.8" fill="#f6eddb"/>
    </svg>
  );
}

function Mushroom2({ w = 60, h = 75 }) {
  // tall thin mushroom
  return (
    <svg viewBox="0 0 60 75" width={w} height={h} style={{ overflow: 'visible' }}>
      <path d="M 24 72 Q 22 45 27 35 L 34 35 Q 38 45 36 72 Z" fill="#ead8b0" stroke={INK} strokeWidth="1"/>
      <path d="M 12 38 Q 14 12 30 10 Q 48 14 48 38 Q 30 44 12 38 Z" fill="#d4a15a" stroke={INK} strokeWidth="1.1"/>
      <path d="M 15 36 Q 30 40 46 36" stroke={INK} strokeWidth="0.6" fill="none" opacity="0.5"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Rocks & pebbles
// ─────────────────────────────────────────────────────────────

function Rock({ w = 90, h = 60, variant = 0 }) {
  const shapes = [
    { d: 'M 8 48 Q 2 30 18 14 Q 40 4 62 10 Q 86 18 84 40 Q 78 56 52 56 Q 22 58 8 48 Z', fill: '#8a8376' },
    { d: 'M 10 45 Q 12 20 35 12 Q 62 10 78 28 Q 82 48 60 52 Q 30 54 10 45 Z', fill: '#6d6558' },
    { d: 'M 6 42 Q 10 25 26 18 Q 50 14 68 22 Q 82 38 72 50 Q 42 56 14 52 Q 6 48 6 42 Z', fill: '#a59b8a' },
  ];
  const s = shapes[variant % shapes.length];
  return (
    <svg viewBox="0 0 90 60" width={w} height={h} style={{ overflow: 'visible' }}>
      <path d={s.d} fill={s.fill} stroke={INK} strokeWidth="1.2"/>
      {/* highlight */}
      <path d="M 20 20 Q 35 14 52 16" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* cracks */}
      <path d="M 30 30 L 42 38 M 50 28 L 58 34" stroke={INK} strokeWidth="0.6" opacity="0.4"/>
    </svg>
  );
}

function Pebbles({ w = 80, h = 36 }) {
  return (
    <svg viewBox="0 0 80 36" width={w} height={h} style={{ overflow: 'visible' }}>
      <ellipse cx="18" cy="22" rx="14" ry="10" fill="#b5ad9e" stroke={INK} strokeWidth="0.9"/>
      <ellipse cx="42" cy="26" rx="11" ry="8" fill="#938a7a" stroke={INK} strokeWidth="0.9"/>
      <ellipse cx="62" cy="20" rx="13" ry="9" fill="#a89d8b" stroke={INK} strokeWidth="0.9"/>
      <ellipse cx="12" cy="18" rx="3" ry="1.5" fill="rgba(255,255,255,0.5)"/>
      <ellipse cx="38" cy="23" rx="3" ry="1.2" fill="rgba(255,255,255,0.5)"/>
      <ellipse cx="58" cy="17" rx="3" ry="1.4" fill="rgba(255,255,255,0.5)"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Driftwood / branches
// ─────────────────────────────────────────────────────────────

function Driftwood({ w = 160, h = 50 }) {
  return (
    <svg viewBox="0 0 160 50" width={w} height={h} style={{ overflow: 'visible' }}>
      <path d="M 6 32 Q 20 20 50 22 Q 90 24 120 18 Q 145 14 155 22 Q 158 32 145 34 Q 115 38 85 36 Q 55 38 28 42 Q 10 42 6 32 Z"
        fill="#8a6f50" stroke={INK} strokeWidth="1.2"/>
      {/* grain */}
      <path d="M 20 28 Q 60 24 100 26 Q 130 26 145 28" stroke={INK_SOFT} strokeWidth="0.7" fill="none" opacity="0.6"/>
      <path d="M 30 34 Q 70 32 110 32 Q 130 32 140 34" stroke={INK_SOFT} strokeWidth="0.6" fill="none" opacity="0.5"/>
      {/* knot */}
      <circle cx="70" cy="28" r="3" fill="#5a4733" stroke={INK} strokeWidth="0.6"/>
      <circle cx="115" cy="26" r="2" fill="#5a4733" stroke={INK} strokeWidth="0.5"/>
    </svg>
  );
}

function Branch({ w = 120, h = 80 }) {
  return (
    <svg viewBox="0 0 120 80" width={w} height={h} style={{ overflow: 'visible' }}>
      <path d="M 10 70 Q 30 55 50 45 Q 70 38 95 20 Q 105 15 112 12"
        stroke="#6d553d" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M 50 45 Q 55 35 60 25" stroke="#6d553d" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 70 32 Q 78 38 85 45" stroke="#6d553d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* outline */}
      <path d="M 10 70 Q 30 55 50 45 Q 70 38 95 20 Q 105 15 112 12"
        stroke={INK} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Accessories
// ─────────────────────────────────────────────────────────────

function Lantern({ w = 50, h = 80 }) {
  return (
    <svg viewBox="0 0 50 80" width={w} height={h} style={{ overflow: 'visible' }}>
      <Defs/>
      {/* hook */}
      <path d="M 25 4 Q 25 10 25 14" stroke={INK} strokeWidth="1.4" fill="none"/>
      <path d="M 14 14 L 36 14" stroke={INK} strokeWidth="1.4"/>
      {/* body */}
      <path d="M 12 18 L 38 18 L 36 58 L 14 58 Z" fill="#d4a574" stroke={INK} strokeWidth="1.2"/>
      {/* glass */}
      <rect x="16" y="22" width="18" height="32" fill="#fff4c4" stroke={INK} strokeWidth="0.8"/>
      {/* flame */}
      <ellipse cx="25" cy="40" rx="3" ry="6" fill="#f5c04a" className="flame"/>
      <ellipse cx="25" cy="42" rx="1.5" ry="3" fill="#fff4c4"/>
      {/* base */}
      <path d="M 10 58 L 40 58 L 38 66 L 12 66 Z" fill="#b58655" stroke={INK} strokeWidth="1.2"/>
    </svg>
  );
}

function Sign({ w = 80, h = 90 }) {
  return (
    <svg viewBox="0 0 80 90" width={w} height={h} style={{ overflow: 'visible' }}>
      {/* post */}
      <rect x="37" y="40" width="6" height="50" fill="#8a6f50" stroke={INK} strokeWidth="1"/>
      {/* plank */}
      <path d="M 10 18 L 60 14 L 70 30 L 14 34 Z" fill="#c9a67a" stroke={INK} strokeWidth="1.2"/>
      <path d="M 18 22 L 56 19" stroke={INK_SOFT} strokeWidth="0.8" opacity="0.5"/>
      <path d="M 18 27 L 58 24" stroke={INK_SOFT} strokeWidth="0.8" opacity="0.5"/>
      {/* text scribbles */}
      <path d="M 20 24 Q 25 22 30 24 M 34 23 Q 40 21 46 23 M 20 28 Q 28 26 36 28"
        stroke={INK} strokeWidth="0.8" fill="none" opacity="0.6"/>
    </svg>
  );
}

function FairyLights({ w = 180, h = 40 }) {
  const bulbs = [];
  const count = 7;
  for (let i = 0; i < count; i++) {
    const x = 15 + i * 25;
    const y = 18 + Math.sin(i) * 3;
    bulbs.push(
      <g key={i}>
        <line x1={x} y1={y - 6} x2={x} y2={y - 2} stroke={INK} strokeWidth="0.6"/>
        <ellipse cx={x} cy={y + 2} rx="3" ry="4" fill="#ffe89a" stroke={INK} strokeWidth="0.7" className="bulb"/>
      </g>
    );
  }
  return (
    <svg viewBox="0 0 180 40" width={w} height={h} style={{ overflow: 'visible' }}>
      <path d="M 8 14 Q 50 22 90 16 Q 130 10 172 18" stroke={INK} strokeWidth="0.8" fill="none"/>
      {bulbs}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Registry — the catalog of specimens
// ─────────────────────────────────────────────────────────────
const SPECIMENS = {
  fern:       { name: 'Nephrolepis',  latin: 'exaltata',      cat: 'Filicopsida',     w: 120, h: 180, render: Fern,        sway: true,  base: 0.92 },
  succulent:  { name: 'Echeveria',    latin: 'elegans',       cat: 'Crassulaceae',    w: 100, h: 110, render: Succulent,   sway: false, base: 0.85 },
  moss:       { name: 'Hypnum',       latin: 'cupressiforme', cat: 'Bryophyta',       w: 140, h: 40,  render: Moss,        sway: false, base: 0.98 },
  mushroom1:  { name: 'Amanita',      latin: 'muscaria',      cat: 'Basidiomycota',   w: 70,  h: 90,  render: Mushroom,    sway: false, base: 0.9 },
  mushroom2:  { name: 'Cortinarius',  latin: 'caperatus',     cat: 'Basidiomycota',   w: 60,  h: 75,  render: Mushroom2,   sway: false, base: 0.92 },
  rock1:      { name: 'Granite',      latin: 'lapis',         cat: 'Igneous',         w: 90,  h: 60,  render: (p) => <Rock {...p} variant={0}/>, sway: false, base: 0.98 },
  rock2:      { name: 'Basalt',       latin: 'lapis niger',   cat: 'Volcanic',        w: 90,  h: 60,  render: (p) => <Rock {...p} variant={1}/>, sway: false, base: 0.98 },
  rock3:      { name: 'Sandstone',    latin: 'arenaria',      cat: 'Sedimentary',     w: 90,  h: 60,  render: (p) => <Rock {...p} variant={2}/>, sway: false, base: 0.98 },
  pebbles:    { name: 'Pebbles',      latin: 'calculi',       cat: 'Alluvial',        w: 80,  h: 36,  render: Pebbles,     sway: false, base: 0.98 },
  driftwood:  { name: 'Driftwood',    latin: 'lignum maris',  cat: 'Flotsam',         w: 160, h: 50,  render: Driftwood,   sway: false, base: 0.96 },
  branch:     { name: 'Twig',         latin: 'ramus',         cat: 'Deadfall',        w: 120, h: 80,  render: Branch,      sway: false, base: 0.96 },
  lantern:    { name: 'Lantern',      latin: 'lucerna',       cat: 'Artefact',        w: 50,  h: 80,  render: Lantern,     sway: true,  base: 0.9 },
  sign:       { name: 'Wayfinder',    latin: 'signum viae',   cat: 'Artefact',        w: 80,  h: 90,  render: Sign,        sway: false, base: 0.94 },
  lights:     { name: 'String Lamps', latin: 'lux serta',     cat: 'Artefact',        w: 180, h: 40,  render: FairyLights, sway: true,  base: 0.86 },
};

window.SPECIMENS = SPECIMENS;
