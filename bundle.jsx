
// ===== specimens.jsx =====
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


// ===== tray.jsx =====
// tray.jsx — Field-guide specimen drawer on the left side.
// Each card is draggable; drag it into the jar to spawn an item.

const { useState, useRef } = React;

function SpecimenCard({ id, spec, onDragStart }) {
  const cardRef = useRef(null);
  const Render = spec.render;
  // Scale preview so largest dimension = 78px
  const maxDim = 78;
  const scale = Math.min(maxDim / spec.w, maxDim / spec.h);
  return (
    <div
      ref={cardRef}
      className="spec-card"
      onMouseDown={(e) => onDragStart(e, id)}
      onTouchStart={(e) => onDragStart(e, id)}
      style={{
        position: 'relative',
        background: '#f5ecd7',
        border: '0.5px solid #b9a77a',
        borderRadius: 3,
        padding: '8px 10px 10px',
        cursor: 'grab',
        userSelect: 'none',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        boxShadow: 'inset 0 0 20px rgba(139,110,70,0.06)',
      }}
    >
      {/* catalog number */}
      <div style={{
        position: 'absolute', top: 4, right: 6,
        fontFamily: 'Libre Caslon Text, serif',
        fontSize: 8, fontStyle: 'italic', color: '#7a6a4a',
        letterSpacing: '0.04em',
      }}>
        {id.padStart(3, '0')}
      </div>
      {/* illustration */}
      <div style={{
        width: 86, height: 86, flexShrink: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        borderRight: '0.5px dashed #c5b48a',
        paddingRight: 6,
      }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
          <Render w={spec.w} h={spec.h}/>
        </div>
      </div>
      {/* label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Libre Caslon Text, serif',
          fontSize: 13, fontWeight: 600, color: '#2a2620',
          lineHeight: 1.1,
        }}>{spec.name}</div>
        <div style={{
          fontFamily: 'Libre Caslon Text, serif',
          fontSize: 10, fontStyle: 'italic', color: '#6a5c42',
          marginTop: 2,
        }}>{spec.latin}</div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em',
          color: '#8a7a55', marginTop: 6,
        }}>{spec.cat}</div>
      </div>
    </div>
  );
}

function Tray({ onDragStart }) {
  const groups = {
    'Plantae': ['fern', 'succulent', 'moss', 'mushroom1', 'mushroom2'],
    'Lithos': ['rock1', 'rock2', 'rock3', 'pebbles'],
    'Lignum': ['driftwood', 'branch'],
    'Artefacta': ['lantern', 'sign', 'lights'],
  };
  return (
    <div style={{
      width: 280, height: '100%', flexShrink: 0,
      background: '#ece0c0',
      borderRight: '1px solid #8a7a55',
      display: 'flex', flexDirection: 'column',
      boxShadow: 'inset -8px 0 16px rgba(90,70,40,0.08)',
      position: 'relative',
    }}>
      {/* header */}
      <div style={{
        padding: '14px 18px 10px',
        borderBottom: '0.5px solid #b9a77a',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#8a7a55',
        }}>Vol. VII · Plate 12</div>
        <div style={{
          fontFamily: 'Libre Caslon Text, serif',
          fontSize: 19, fontWeight: 700, color: '#2a2620',
          marginTop: 3,
          fontStyle: 'italic',
        }}>Specimen Drawer</div>
        <div style={{
          fontFamily: 'Libre Caslon Text, serif',
          fontSize: 11, color: '#6a5c42',
          marginTop: 4, fontStyle: 'italic',
        }}>
          Drag a specimen into the vitrine to place it.
        </div>
      </div>
      {/* scrollable list */}
      <div className="tray-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '8px 12px 20px',
      }}>
        {Object.entries(groups).map(([groupName, ids]) => (
          <div key={groupName} style={{ marginTop: 10 }}>
            <div style={{
              fontFamily: 'Libre Caslon Text, serif',
              fontSize: 11, fontStyle: 'italic', color: '#6a5c42',
              padding: '6px 4px 4px',
              borderBottom: '0.5px dotted #b9a77a',
              marginBottom: 6,
              letterSpacing: '0.05em',
            }}>
              — {groupName} —
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ids.map((id, i) => (
                <SpecimenCard
                  key={id}
                  id={String(Object.keys(SPECIMENS).indexOf(id) + 1)}
                  spec={SPECIMENS[id]}
                  onDragStart={(e) => onDragStart(e, id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Tray = Tray;


// ===== jar.jsx =====
// jar.jsx — The terrarium vitrine (bell jar). Placed items render inside.
// Shape is defined by a clip path; soil mound sits at the bottom.

const { useEffect: useEffectJar, useRef: useRefJar, useState: useStateJar } = React;

// Bell-jar silhouette (origin at top-left, designed at 640x640)
// Returns { d, floorY, floorLeft, floorRight } for clipping + placement
function jarGeometry() {
  // path traces outer glass in local coords
  const d = `
    M 160 80
    Q 160 60 200 55
    L 440 55
    Q 480 60 480 80
    L 480 110
    Q 520 115 540 160
    Q 570 220 570 340
    Q 570 470 540 530
    Q 520 570 490 580
    L 150 580
    Q 120 570 100 530
    Q 70 470 70 340
    Q 70 220 100 160
    Q 120 115 160 110
    Z
  `.replace(/\s+/g, ' ').trim();
  return {
    d,
    floorY: 560,     // the soil line
    floorLeft: 140,
    floorRight: 500,
    jarW: 640, jarH: 640,
  };
}

function Jar({ items, setItems, selectedId, setSelectedId, mode, setMode }) {
  const svgRef = useRefJar(null);
  const geo = jarGeometry();

  // Drag-inside-jar state
  const dragRef = useRefJar(null);

  function localPoint(e) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
    pt.x = t.clientX; pt.y = t.clientY;
    const inv = svg.getScreenCTM().inverse();
    const p = pt.matrixTransform(inv);
    return { x: p.x, y: p.y };
  }

  function onItemPointerDown(e, item, action = 'move') {
    e.stopPropagation();
    setSelectedId(item.id);
    const p = localPoint(e);
    dragRef.current = {
      itemId: item.id,
      action,
      startPt: p,
      startItem: { ...item },
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }

  function onMove(e) {
    if (!dragRef.current) return;
    e.preventDefault && e.preventDefault();
    const p = localPoint(e);
    const d = dragRef.current;
    const dx = p.x - d.startPt.x;
    const dy = p.y - d.startPt.y;

    setItems((prev) => prev.map((it) => {
      if (it.id !== d.itemId) return it;
      if (d.action === 'move') {
        return { ...it, x: d.startItem.x + dx, y: d.startItem.y + dy };
      } else if (d.action === 'rotate') {
        const cx = d.startItem.x;
        const cy = d.startItem.y;
        const a = Math.atan2(p.y - cy, p.x - cx) * 180 / Math.PI;
        return { ...it, rot: a + 90 };
      } else if (d.action === 'scale') {
        const cx = d.startItem.x;
        const cy = d.startItem.y;
        const startDist = Math.hypot(d.startPt.x - cx, d.startPt.y - cy);
        const nowDist = Math.hypot(p.x - cx, p.y - cy);
        let s = d.startItem.scale * (nowDist / Math.max(20, startDist));
        s = Math.max(0.4, Math.min(2.0, s));
        return { ...it, scale: s };
      }
      return it;
    }));
  }

  function onUp() {
    dragRef.current = null;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', onUp);
  }

  function onBackgroundClick() {
    setSelectedId(null);
  }

  const selected = items.find((it) => it.id === selectedId);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 640 640"
      width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      data-jar-svg
      onMouseDown={onBackgroundClick}
      onTouchStart={onBackgroundClick}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* jar interior clip */}
        <clipPath id="jar-clip">
          <path d={geo.d}/>
        </clipPath>
        {/* glass gradient */}
        <linearGradient id="glass-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
          <stop offset="40%" stopColor="rgba(255,255,255,0.05)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.25)"/>
        </linearGradient>
        <radialGradient id="interior-grad" cx="0.5" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="var(--jar-interior-top, #fff8e6)"/>
          <stop offset="100%" stopColor="var(--jar-interior-bot, #f2e6c4)"/>
        </radialGradient>
        <linearGradient id="soil-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a412a"/>
          <stop offset="100%" stopColor="#3d2a18"/>
        </linearGradient>
        {/* cast shadow for items on the soil */}
        <radialGradient id="shadow-grad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.35)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
      </defs>

      {/* Pedestal (under jar) */}
      <ellipse cx="320" cy="600" rx="240" ry="14" fill="rgba(0,0,0,0.18)"/>
      <path d="M 90 582 L 550 582 L 560 604 Q 560 612 550 614 L 90 614 Q 80 612 80 604 Z"
        fill="#5a4a32" stroke="#2a2620" strokeWidth="1.2"/>
      <path d="M 90 582 L 550 582 L 552 588 L 88 588 Z" fill="#8a7350"/>

      {/* Interior background (sky inside jar) */}
      <path d={geo.d} fill="url(#interior-grad)"/>

      {/* Everything clipped to the jar */}
      <g clipPath="url(#jar-clip)">
        {/* Soil mound */}
        <path d="M 60 570 Q 160 520 320 530 Q 490 515 580 572 L 580 640 L 60 640 Z"
          fill="url(#soil-grad)"/>
        {/* soil speckles */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = 80 + (i * 12.3) % 500;
          const y = 540 + ((i * 7) % 80);
          const r = 0.6 + (i % 3) * 0.4;
          return <circle key={i} cx={x} cy={y} r={r} fill="rgba(200,180,140,0.4)"/>;
        })}

        {/* Items — sorted by z */}
        {[...items].sort((a, b) => a.z - b.z).map((it) => {
          const spec = SPECIMENS[it.kind];
          const Render = spec.render;
          const isSelected = it.id === selectedId;
          // sway animation only when checked
          return (
            <g key={it.id} className={spec.sway ? 'sway-item' : ''}
              style={{
                cursor: 'grab',
                '--sway-delay': `${(it.seed % 100) / 50}s`,
                '--sway-dur': `${3 + (it.seed % 30) / 10}s`,
              }}
              transform={`translate(${it.x} ${it.y}) rotate(${it.rot}) scale(${it.scale})`}
              onMouseDown={(e) => onItemPointerDown(e, it, 'move')}
              onTouchStart={(e) => onItemPointerDown(e, it, 'move')}
            >
              {/* cast shadow under item — anchored at base */}
              <ellipse cx="0" cy="4" rx={spec.w * 0.35} ry={spec.w * 0.1} fill="url(#shadow-grad)"/>
              {/* specimen drawn with its base at y=0 */}
              <g transform={`translate(${-spec.w / 2} ${-spec.h})`}>
                <Render w={spec.w} h={spec.h}/>
              </g>
              {/* selection indicator */}
              {isSelected && (
                <g>
                  <rect
                    x={-spec.w/2 - 6} y={-spec.h - 6}
                    width={spec.w + 12} height={spec.h + 12}
                    fill="none" stroke="#2a2620" strokeWidth="0.8"
                    strokeDasharray="3 3" opacity="0.5" pointerEvents="none"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* fog / atmosphere */}
        <rect x="0" y="0" width="640" height="640" fill="var(--jar-atmos, transparent)" pointerEvents="none"/>
      </g>

      {/* Glass shell (outside clip) */}
      <path d={geo.d}
        fill="url(#glass-grad)" opacity="0.5"
        stroke="rgba(60,70,80,0.7)" strokeWidth="1.5"
        pointerEvents="none"/>
      {/* glass highlight strokes */}
      <path d="M 110 200 Q 90 320 110 480" stroke="rgba(255,255,255,0.55)" strokeWidth="3" fill="none" opacity="0.7" pointerEvents="none"/>
      <path d="M 530 200 Q 550 320 530 480" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" opacity="0.6" pointerEvents="none"/>
      {/* jar knob/finial */}
      <ellipse cx="320" cy="48" rx="38" ry="8" fill="#d6c9a5" stroke="rgba(60,70,80,0.7)" strokeWidth="1.2"/>
      <path d="M 300 48 Q 300 30 320 28 Q 340 30 340 48" fill="#e4d8b4" stroke="rgba(60,70,80,0.7)" strokeWidth="1.2"/>

      {/* Selection handles outside clip so they sit above glass */}
      {selected && (() => {
        const spec = SPECIMENS[selected.kind];
        const halfW = (spec.w / 2) * selected.scale;
        const halfH = spec.h * selected.scale;
        const cos = Math.cos(selected.rot * Math.PI / 180);
        const sin = Math.sin(selected.rot * Math.PI / 180);
        // rotate points around item origin
        const rotPt = (px, py) => ({
          x: selected.x + px * cos - py * sin,
          y: selected.y + px * sin + py * cos,
        });
        const rotateHandle = rotPt(0, -halfH - 18);
        const scaleHandle  = rotPt(halfW + 10, -halfH - 4);
        return (
          <g>
            {/* rotate handle */}
            <line
              x1={selected.x} y1={selected.y - halfH}
              x2={rotateHandle.x} y2={rotateHandle.y}
              stroke="#2a2620" strokeWidth="0.8" opacity="0.4"
            />
            <circle
              cx={rotateHandle.x} cy={rotateHandle.y} r="7"
              fill="#f5ecd7" stroke="#2a2620" strokeWidth="1"
              onMouseDown={(e) => onItemPointerDown(e, selected, 'rotate')}
              onTouchStart={(e) => onItemPointerDown(e, selected, 'rotate')}
              style={{ cursor: 'grab' }}
            />
            <path d={`M ${rotateHandle.x - 3} ${rotateHandle.y - 1} a 3 3 0 1 0 3 -3`}
              stroke="#2a2620" strokeWidth="1" fill="none" pointerEvents="none"/>
            {/* scale handle */}
            <circle
              cx={scaleHandle.x} cy={scaleHandle.y} r="7"
              fill="#f5ecd7" stroke="#2a2620" strokeWidth="1"
              onMouseDown={(e) => onItemPointerDown(e, selected, 'scale')}
              onTouchStart={(e) => onItemPointerDown(e, selected, 'scale')}
              style={{ cursor: 'nwse-resize' }}
            />
            <path d={`M ${scaleHandle.x - 3} ${scaleHandle.y} L ${scaleHandle.x + 3} ${scaleHandle.y} M ${scaleHandle.x} ${scaleHandle.y - 3} L ${scaleHandle.x} ${scaleHandle.y + 3}`}
              stroke="#2a2620" strokeWidth="1" pointerEvents="none"/>
          </g>
        );
      })()}
    </svg>
  );
}

// Given a clientX/clientY on the jar SVG, return jar-local coords,
// or null if outside the jar interior.
function clientToJarLocal(clientX, clientY) {
  const svg = document.querySelector('[data-jar-svg]');
  if (!svg) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  const inv = svg.getScreenCTM().inverse();
  const p = pt.matrixTransform(inv);
  // rough check: inside 640x640
  if (p.x < 0 || p.x > 640 || p.y < 0 || p.y > 640) return null;
  return { x: p.x, y: p.y };
}

window.Jar = Jar;
window.clientToJarLocal = clientToJarLocal;
window.jarGeometry = jarGeometry;


// ===== app.jsx =====
// app.jsx — Main app: tray + jar + controls + tweaks + sound.

const { useState: useAppState, useEffect: useAppEffect, useRef: useAppRef, useCallback } = React;

// ─── Tweakable defaults ───────────────────────────────────────
const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showLabels": true,
  "ambientSound": true,
  "palette": "default",
  "timeOfDay": "auto"
}/*EDITMODE-END*/;

// ─── Audio helpers (WebAudio, lazily started) ─────────────────
let audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  return audioCtx;
}

function playDropSfx() {
  const ctx = getCtx(); if (!ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(380, t);
  o.frequency.exponentialRampToValueAtTime(180, t + 0.12);
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + 0.22);
}

function playPickSfx() {
  const ctx = getCtx(); if (!ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(700, t);
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(0.04, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + 0.1);
}

// Ambient: looping birdsong (day) or crickets (night)
class Ambient {
  constructor() { this.nodes = []; this.mode = 'off'; this.enabled = true; }
  setEnabled(v) { this.enabled = v; if (!v) this.stop(); else this.setMode(this.mode, true); }
  setMode(m, force = false) {
    if (m === this.mode && !force) return;
    this.stop();
    this.mode = m;
    if (!this.enabled || m === 'off') return;
    const ctx = getCtx(); if (!ctx) return;
    // wake
    if (ctx.state === 'suspended') ctx.resume();
    if (m === 'day') this.startDay(ctx);
    else this.startNight(ctx);
  }
  stop() {
    this.nodes.forEach(n => { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch(e){} });
    this.nodes = [];
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  }
  startDay(ctx) {
    // gentle pink-noise wind + sparse bird chirps
    const noiseLen = 2;
    const buf = ctx.createBuffer(1, ctx.sampleRate * noiseLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + 0.0555 * white;
      b1 = 0.96 * b1 + 0.2965 * white;
      b2 = 0.57 * b2 + 1.03 * white;
      data[i] = (b0 + b1 + b2 + white * 0.18) * 0.12;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 700;
    const gain = ctx.createGain(); gain.gain.value = 0.06;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    this.nodes.push(src, filter, gain);

    this._timer = setInterval(() => {
      if (!this.enabled || this.mode !== 'day') return;
      this.chirp(ctx);
    }, 1600 + Math.random() * 2000);
  }
  chirp(ctx) {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    const base = 1800 + Math.random() * 1600;
    o.frequency.setValueAtTime(base, t);
    o.frequency.exponentialRampToValueAtTime(base * 1.3, t + 0.08);
    o.frequency.exponentialRampToValueAtTime(base * 0.9, t + 0.18);
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.3);
    this.nodes.push(o, g);
  }
  startNight(ctx) {
    // brown noise bed + cricket pulses
    const noiseLen = 2;
    const buf = ctx.createBuffer(1, ctx.sampleRate * noiseLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 1.8;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 400;
    const gain = ctx.createGain(); gain.gain.value = 0.08;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    this.nodes.push(src, filter, gain);

    this._timer = setInterval(() => {
      if (!this.enabled || this.mode !== 'night') return;
      this.cricket(ctx);
    }, 500 + Math.random() * 900);
  }
  cricket(ctx) {
    const t = ctx.currentTime;
    // 4 quick chirps
    for (let i = 0; i < 4; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = 4200 + Math.random() * 400;
      const s = t + i * 0.07;
      g.gain.setValueAtTime(0.001, s);
      g.gain.exponentialRampToValueAtTime(0.025, s + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.04);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 0.05);
      this.nodes.push(o, g);
    }
  }
}
const ambient = new Ambient();
window.__ambient = ambient;

// ─── Palette presets ──────────────────────────────────────────
const PALETTES = {
  default: { paper: '#e8dcb4', ink: '#2a2620', accent: '#6b8758' },
  mossy:   { paper: '#d8d4b0', ink: '#2a3420', accent: '#4a6d3c' },
  dusk:    { paper: '#d9c9a0', ink: '#2a2430', accent: '#7a5a8a' },
};

// ─── App ──────────────────────────────────────────────────────
function App() {
  const [items, setItems] = useAppState([]);
  const [selectedId, setSelectedId] = useAppState(null);
  const [time, setTime] = useAppState('day'); // 'day' | 'night'
  const [tweaks, setTweaks] = useAppState(TWEAKS_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useAppState(false);
  const [isDragging, setIsDragging] = useAppState(false);
  const nextId = useAppRef(1);
  const nextZ = useAppRef(1);
  const ghostRef = useAppRef(null);

  // Tweak mode wire-up
  useAppEffect(() => {
    function onMsg(e) {
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === '__activate_edit_mode') setTweaksOpen(true);
      if (d.type === '__deactivate_edit_mode') setTweaksOpen(false);
    }
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  function updateTweak(key, val) {
    setTweaks((prev) => {
      const next = { ...prev, [key]: val };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
      return next;
    });
  }

  // Persisted save
  useAppEffect(() => {
    try {
      const saved = localStorage.getItem('terrarium-items-v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed);
        nextId.current = parsed.reduce((m, it) => Math.max(m, parseInt(it.id, 10) + 1 || 1), 1);
        nextZ.current = parsed.reduce((m, it) => Math.max(m, it.z + 1), 1);
      }
    } catch (e) {}
  }, []);
  useAppEffect(() => {
    try { localStorage.setItem('terrarium-items-v1', JSON.stringify(items)); } catch (e) {}
  }, [items]);

  // Time of day
  const effectiveTime = tweaks.timeOfDay === 'auto' ? time : tweaks.timeOfDay;
  useAppEffect(() => {
    ambient.setEnabled(tweaks.ambientSound);
    ambient.setMode(effectiveTime);
  }, [effectiveTime, tweaks.ambientSound]);

  // ─── Drag from tray → jar ───
  const dragStateRef = useAppRef(null);

  function onTrayDragStart(e, kind) {
    e.preventDefault();
    getCtx() && getCtx().resume && getCtx().resume();
    playPickSfx();
    const t = (e.touches && e.touches[0]) || e;
    dragStateRef.current = { kind, clientX: t.clientX, clientY: t.clientY };
    setIsDragging(true);
    window.addEventListener('mousemove', onTrayDragMove);
    window.addEventListener('mouseup', onTrayDragEnd);
    window.addEventListener('touchmove', onTrayDragMove, { passive: false });
    window.addEventListener('touchend', onTrayDragEnd);
    // show ghost
    updateGhost(t.clientX, t.clientY);
  }
  function onTrayDragMove(e) {
    if (!dragStateRef.current) return;
    e.preventDefault && e.preventDefault();
    const t = (e.touches && e.touches[0]) || e;
    dragStateRef.current.clientX = t.clientX;
    dragStateRef.current.clientY = t.clientY;
    updateGhost(t.clientX, t.clientY);
  }
  function onTrayDragEnd(e) {
    window.removeEventListener('mousemove', onTrayDragMove);
    window.removeEventListener('mouseup', onTrayDragEnd);
    window.removeEventListener('touchmove', onTrayDragMove);
    window.removeEventListener('touchend', onTrayDragEnd);
    setIsDragging(false);
    if (ghostRef.current) ghostRef.current.style.display = 'none';
    const d = dragStateRef.current;
    dragStateRef.current = null;
    if (!d) return;
    const t = (e.changedTouches && e.changedTouches[0]) || e;
    const local = window.clientToJarLocal(t.clientX, t.clientY);
    if (local) {
      // place!
      const spec = SPECIMENS[d.kind];
      const id = String(nextId.current++);
      const z = nextZ.current++;
      const seed = Math.floor(Math.random() * 1000);
      const newItem = {
        id, kind: d.kind, x: local.x, y: local.y,
        rot: (Math.random() - 0.5) * 8, scale: 1, z, seed,
      };
      setItems((prev) => [...prev, newItem]);
      setSelectedId(id);
      playDropSfx();
    }
  }
  function updateGhost(cx, cy) {
    if (!ghostRef.current || !dragStateRef.current) return;
    ghostRef.current.style.display = 'block';
    ghostRef.current.style.left = cx + 'px';
    ghostRef.current.style.top = cy + 'px';
    const spec = SPECIMENS[dragStateRef.current.kind];
    if (ghostRef.current.dataset.kind !== dragStateRef.current.kind) {
      ghostRef.current.dataset.kind = dragStateRef.current.kind;
      const Render = spec.render;
      // re-render via simple HTML — use an SVG wrapper
      const html = ReactDOMServer?.renderToStaticMarkup
        ? ReactDOMServer.renderToStaticMarkup(<Render w={spec.w} h={spec.h}/>)
        : '';
      ghostRef.current.innerHTML = html;
    }
  }

  // Layer ops
  function bringForward() {
    if (!selectedId) return;
    const z = nextZ.current++;
    setItems((prev) => prev.map((it) => it.id === selectedId ? { ...it, z } : it));
  }
  function sendBackward() {
    if (!selectedId) return;
    const minZ = items.reduce((m, it) => Math.min(m, it.z), 99999);
    setItems((prev) => prev.map((it) => it.id === selectedId ? { ...it, z: minZ - 1 } : it));
  }
  function deleteSelected() {
    if (!selectedId) return;
    setItems((prev) => prev.filter((it) => it.id !== selectedId));
    setSelectedId(null);
  }
  function clearAll() {
    if (!confirm('Empty the vitrine?')) return;
    setItems([]); setSelectedId(null);
  }

  // Keyboard shortcuts
  useAppEffect(() => {
    function onKey(e) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && e.target.tagName !== 'INPUT') { deleteSelected(); e.preventDefault(); }
      } else if (e.key === 'Escape') {
        setSelectedId(null);
      } else if (e.key === ']') {
        bringForward();
      } else if (e.key === '[') {
        sendBackward();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, items]);

  const palette = PALETTES[tweaks.palette] || PALETTES.default;
  const isNight = effectiveTime === 'night';

  // Interior colors based on time
  const interiorTop = isNight ? '#1a2332' : '#fff8e6';
  const interiorBot = isNight ? '#0e1620' : '#f2e6c4';
  const atmos = isNight ? 'rgba(30,50,80,0.35)' : 'transparent';

  const rootStyle = {
    '--paper': palette.paper,
    '--ink': palette.ink,
    '--accent': palette.accent,
    '--jar-interior-top': interiorTop,
    '--jar-interior-bot': interiorBot,
    '--jar-atmos': atmos,
  };

  const selected = items.find((it) => it.id === selectedId);

  return (
    <div className="app-root" style={rootStyle}>
      {/* Window chrome */}
      <div className="window">
        <div className="titlebar">
          <div className="traffic">
            <span className="dot red"/><span className="dot yel"/><span className="dot grn"/>
          </div>
          <div className="title">Herbarium Vitrinum · a naturalist's terrarium</div>
          <div className="sub-title">folio 12</div>
        </div>
        <div className="workspace">
          <Tray onDragStart={onTrayDragStart}/>
          <div className="stage" onMouseDown={() => setSelectedId(null)}>
            {/* vellum background with sketchy margins */}
            <div className="vellum" aria-hidden="true">
              <div className="margin-marks top"/>
              <div className="margin-marks left"/>
              <div className="margin-marks right"/>
              <div className="margin-marks bottom"/>
              {/* watermark */}
              <div className="watermark">
                <div className="wm-lat">Vitrinum · {isNight ? 'Nox' : 'Dies'}</div>
                <div className="wm-date">MMXXVI</div>
              </div>
            </div>
            <div className="jar-wrap">
              <Jar
                items={items}
                setItems={setItems}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            </div>
            {/* Floating toolbar */}
            <div className="toolbar">
              <button
                className="tool-btn tod-btn"
                onClick={(e) => { e.stopPropagation(); setTime(time === 'day' ? 'night' : 'day'); }}
                title="Toggle day/night"
              >
                {isNight ? <MoonGlyph/> : <SunGlyph/>}
                <span>{isNight ? 'Nox' : 'Dies'}</span>
              </button>
              <div className="tool-divider"/>
              <button className="tool-btn" disabled={!selectedId} onClick={(e) => { e.stopPropagation(); bringForward(); }} title="Bring forward (])">
                <LayerUpGlyph/>
              </button>
              <button className="tool-btn" disabled={!selectedId} onClick={(e) => { e.stopPropagation(); sendBackward(); }} title="Send back ([)">
                <LayerDnGlyph/>
              </button>
              <button className="tool-btn" disabled={!selectedId} onClick={(e) => { e.stopPropagation(); deleteSelected(); }} title="Remove specimen">
                <TrashGlyph/>
              </button>
              <div className="tool-divider"/>
              <button className="tool-btn" onClick={(e) => { e.stopPropagation(); clearAll(); }} title="Empty vitrine">
                <ClearGlyph/>
              </button>
            </div>

            {/* Info card for selected */}
            {selected && (
              <div className="info-card" onMouseDown={(e) => e.stopPropagation()}>
                <div className="info-num">No. {selected.id.padStart(3, '0')}</div>
                <div className="info-name">{SPECIMENS[selected.kind].name}</div>
                <div className="info-lat">{SPECIMENS[selected.kind].latin}</div>
                <div className="info-row">
                  <span>rot</span>
                  <input type="range" min="-180" max="180" value={selected.rot}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setItems((prev) => prev.map((it) => it.id === selected.id ? { ...it, rot: v } : it));
                    }}
                  />
                </div>
                <div className="info-row">
                  <span>size</span>
                  <input type="range" min="0.4" max="2" step="0.01" value={selected.scale}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setItems((prev) => prev.map((it) => it.id === selected.id ? { ...it, scale: v } : it));
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tweaks panel */}
            {tweaksOpen && (
              <div className="tweaks" onMouseDown={(e) => e.stopPropagation()}>
                <div className="tweaks-title">Tweaks</div>
                <label className="tweak-row">
                  <span>Ambient sound</span>
                  <input type="checkbox" checked={tweaks.ambientSound}
                    onChange={(e) => updateTweak('ambientSound', e.target.checked)}/>
                </label>
                <label className="tweak-row">
                  <span>Show labels</span>
                  <input type="checkbox" checked={tweaks.showLabels}
                    onChange={(e) => updateTweak('showLabels', e.target.checked)}/>
                </label>
                <div className="tweak-row">
                  <span>Palette</span>
                  <select value={tweaks.palette} onChange={(e) => updateTweak('palette', e.target.value)}>
                    <option value="default">Default</option>
                    <option value="mossy">Mossy</option>
                    <option value="dusk">Dusk</option>
                  </select>
                </div>
                <div className="tweak-row">
                  <span>Time</span>
                  <select value={tweaks.timeOfDay} onChange={(e) => updateTweak('timeOfDay', e.target.value)}>
                    <option value="auto">Auto (toolbar)</option>
                    <option value="day">Always day</option>
                    <option value="night">Always night</option>
                  </select>
                </div>
              </div>
            )}

            {/* Empty-state caption when jar is empty */}
            {items.length === 0 && (
              <div className="empty-caption">
                <div className="caption-ornament">✣</div>
                <div className="caption-text">
                  An empty vitrine awaits.<br/>
                  <em>Drag a specimen from the drawer to begin.</em>
                </div>
              </div>
            )}

            {/* Counter */}
            {tweaks.showLabels && (
              <div className="counter">
                <span className="counter-num">{items.length}</span>
                <span className="counter-lbl">specimens<br/>curated</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag ghost — SVG preview following cursor */}
      <div ref={ghostRef} className="drag-ghost" style={{ display: 'none' }}/>
    </div>
  );
}

// ─── Glyphs (hand-drawn-ish) ──────────────────────────────────
function SunGlyph() { return (
  <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
  {[0,45,90,135,180,225,270,315].map((a, i) => {
    const r1 = 4.5, r2 = 6.2;
    const rad = a * Math.PI / 180;
    return <line key={i} x1={8+Math.cos(rad)*r1} y1={8+Math.sin(rad)*r1} x2={8+Math.cos(rad)*r2} y2={8+Math.sin(rad)*r2} stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>;
  })}
  </svg>
);}
function MoonGlyph() { return (
  <svg width="16" height="16" viewBox="0 0 16 16"><path d="M 11 3 A 5 5 0 1 0 13 11 A 4 4 0 1 1 11 3 Z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
);}
function LayerUpGlyph() { return (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="6" y="6" width="7" height="7" fill="currentColor" fillOpacity="0.15"/></svg>
);}
function LayerDnGlyph() { return (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="7" height="7"/><rect x="3" y="3" width="7" height="7" fill="currentColor" fillOpacity="0.15"/></svg>
);}
function TrashGlyph() { return (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M 3 4 L 13 4"/><path d="M 5 4 L 5 13 L 11 13 L 11 4"/><path d="M 6 2 L 10 2"/><path d="M 7 6 L 7 11 M 9 6 L 9 11"/></svg>
);}
function ClearGlyph() { return (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M 3 8 Q 8 3 13 8 Q 8 13 3 8 Z"/><path d="M 5 8 L 11 8"/></svg>
);}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);

