import '../styles/components/HomeToolMap.css'

// ─── Three hub nodes ──────────────────────────────────────────────────────────
const HUBS = [
  {
    key: 'flow-map',
    label: 'Flow Map',
    x: 25,
    y: 48,
    color: 'silver',
    duration: '12s',
    delay: '0s',
  },
  {
    key: 'tools',
    label: 'Tools',
    x: 57,
    y: 28,
    color: 'yellow',
    duration: '14s',
    delay: '0.6s',
  },
  {
    key: 'skills',
    label: 'Skills',
    x: 73,
    y: 66,
    color: 'blue',
    duration: '13s',
    delay: '1.1s',
  },
]

// ─── Satellite dots (small labeled orbiters per hub) ─────────────────────────
const SATELLITES = [
  // Flow Map (silver) satellites
  { hub: 'flow-map', label: 'Recon',        angle:  30, radius: 14, duration: '18s', delay: '0s'    },
  { hub: 'flow-map', label: 'Enumeration',  angle: 130, radius: 12, duration: '20s', delay: '2.1s'  },
  { hub: 'flow-map', label: 'Exploitation', angle: 220, radius: 13, duration: '17s', delay: '1.2s'  },
  { hub: 'flow-map', label: 'API Testing',  angle: 310, radius: 11, duration: '21s', delay: '0.7s'  },

  // Tools (yellow) satellites
  { hub: 'tools', label: 'JWT Debugger',     angle:  50, radius: 13, duration: '19s', delay: '1.5s'  },
  { hub: 'tools', label: 'SQL Formatter',    angle: 155, radius: 12, duration: '16s', delay: '0.3s'  },
  { hub: 'tools', label: 'Hash Generator',   angle: 245, radius: 14, duration: '22s', delay: '1.8s'  },
  { hub: 'tools', label: 'CSP Generator',    angle: 340, radius: 11, duration: '18s', delay: '0.9s'  },

  // Skills (blue) satellites
  { hub: 'skills', label: 'XSS Detection',   angle:  20, radius: 13, duration: '20s', delay: '0.4s'  },
  { hub: 'skills', label: 'IDOR Testing',     angle: 110, radius: 11, duration: '17s', delay: '1.6s'  },
  { hub: 'skills', label: 'Priv Escalation',  angle: 200, radius: 14, duration: '19s', delay: '0.8s'  },
  { hub: 'skills', label: 'OSINT',            angle: 295, radius: 12, duration: '22s', delay: '2.0s'  },
]

// ─── Background particles ─────────────────────────────────────────────────────
const BACKGROUND_PARTICLES = [
  { x:  6, y: 16, size: 2, duration: '16s', delay: '0s'   },
  { x: 14, y: 40, size: 3, duration: '18s', delay: '1.2s' },
  { x: 27, y: 72, size: 2, duration: '14s', delay: '0.7s' },
  { x: 35, y: 31, size: 2, duration: '19s', delay: '1.8s' },
  { x: 41, y: 12, size: 3, duration: '15s', delay: '0.4s' },
  { x: 53, y: 58, size: 2, duration: '17s', delay: '1.5s' },
  { x: 61, y: 36, size: 3, duration: '20s', delay: '0.9s' },
  { x: 73, y: 16, size: 2, duration: '14s', delay: '2.1s' },
  { x: 81, y: 72, size: 3, duration: '18s', delay: '0.3s' },
  { x: 90, y: 38, size: 2, duration: '16s', delay: '1.7s' },
  { x: 11, y: 84, size: 2, duration: '17s', delay: '1.1s' },
  { x: 94, y: 14, size: 2, duration: '15s', delay: '0.6s' },
]

// Convert polar (angle in degrees, radius in %-units) relative to a hub center
// to absolute % coordinates inside the canvas
function satellitePos(hub, angle, radius) {
  const rad = (angle * Math.PI) / 180
  // radius is in %-canvas-width units, but we need to compensate for aspect
  // treat the canvas as 100×50 viewport ratio (canvas is ~900×420 ≈ 2.14:1)
  const scaleY = 2.14
  return {
    x: hub.x + radius * Math.cos(rad),
    y: hub.y + (radius / scaleY) * Math.sin(rad),
  }
}

function handleMapPointerMove(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const offsetX = event.clientX - rect.left - rect.width / 2
  const offsetY = event.clientY - rect.top - rect.height / 2
  event.currentTarget.style.setProperty('--tool-map-hover-x', `${Math.max(Math.min(-offsetX * 0.18, 14), -14)}px`)
  event.currentTarget.style.setProperty('--tool-map-hover-y', `${Math.max(Math.min(-offsetY * 0.18, 12), -12)}px`)
}

function resetMapPointerMove(event) {
  event.currentTarget.style.setProperty('--tool-map-hover-x', '0px')
  event.currentTarget.style.setProperty('--tool-map-hover-y', '0px')
}

export default function HomeToolMap({ onCategoryClick, onFlowMapClick }) {
  // Resolve satellite positions
  const resolvedSatellites = SATELLITES.map((sat) => {
    const hub = HUBS.find((h) => h.key === sat.hub)
    const pos = satellitePos(hub, sat.angle, sat.radius)
    return { ...sat, ...pos, hubColor: hub.color }
  })

  const handleHubClick = (hub) => {
    if (hub.key === 'flow-map') onFlowMapClick()
    else if (hub.key === 'tools') onCategoryClick && onCategoryClick(null)
    else if (hub.key === 'skills') onCategoryClick && onCategoryClick('skills')
  }

  return (
    <section className="tool-map-section" role="region" aria-label="Homepage navigation map">
      <div className="tool-map-canvas">
        <div className="tool-map-grid" />

        {BACKGROUND_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="tool-map-particle"
            aria-hidden="true"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--tool-map-particle-duration': p.duration,
              '--tool-map-particle-delay': p.delay,
            }}
          />
        ))}

        {/* Connection lines: hub-to-hub */}
        <svg className="tool-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {/* Hub ↔ hub lines */}
          {HUBS.map((hubA, i) =>
            HUBS.slice(i + 1).map((hubB) => (
              <line
                key={`${hubA.key}-${hubB.key}`}
                x1={hubA.x} y1={hubA.y}
                x2={hubB.x} y2={hubB.y}
              />
            ))
          )}
          {/* Hub → satellite lines */}
          {resolvedSatellites.map((sat) => {
            const hub = HUBS.find((h) => h.key === sat.hub)
            return (
              <line
                key={`${sat.hub}-${sat.label}`}
                className={`tool-map-sat-line tool-map-sat-line--${sat.hubColor}`}
                x1={hub.x} y1={hub.y}
                x2={sat.x} y2={sat.y}
              />
            )
          })}
        </svg>

        {/* Hub nodes */}
        {HUBS.map((hub) => (
          <button
            key={hub.key}
            type="button"
            className={`tool-map-hub-node tool-map-hub-node--${hub.color}`}
            style={{
              left: `${hub.x}%`,
              top: `${hub.y}%`,
              '--tool-map-hub-duration': hub.duration,
              '--tool-map-hub-delay': hub.delay,
            }}
            onMouseMove={handleMapPointerMove}
            onMouseLeave={resetMapPointerMove}
            onClick={() => handleHubClick(hub)}
            aria-label={`Open ${hub.label}`}
          >
            <span className="tool-map-hub-content">
              <span className="tool-map-hub-dot" />
              <span className="tool-map-hub-label">{hub.label}</span>
            </span>
          </button>
        ))}

        {/* Satellite dots */}
        {resolvedSatellites.map((sat) => (
          <span
            key={`${sat.hub}-${sat.label}`}
            className={`tool-map-satellite tool-map-satellite--${sat.hubColor}`}
            aria-hidden="true"
            style={{
              left: `${sat.x}%`,
              top: `${sat.y}%`,
              '--sat-duration': sat.duration,
              '--sat-delay': sat.delay,
            }}
          >
            <span className="tool-map-satellite-dot" />
            <span className="tool-map-satellite-label">{sat.label}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
