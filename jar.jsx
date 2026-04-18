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
