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
