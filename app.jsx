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
