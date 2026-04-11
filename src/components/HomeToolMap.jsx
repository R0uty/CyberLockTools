import './HomeToolMap.css'

const TOOL_MAP_NODES = [
  { title: 'ROT', x: 8, y: 24, duration: '9s', delay: '0s' },
  { title: 'Base64', x: 22, y: 56, duration: '11s', delay: '1s' },
  { title: 'URL Encoder', x: 31, y: 18, duration: '10s', delay: '0.5s' },
  { title: 'Hash Generator', x: 44, y: 42, duration: '12s', delay: '1.4s' },
  { title: 'JSON Formatter', x: 57, y: 22, duration: '9.5s', delay: '0.8s' },
  { title: 'Regex Tester', x: 67, y: 62, duration: '10.5s', delay: '1.8s' },
  { title: 'UUID Generator', x: 78, y: 28, duration: '11.5s', delay: '0.3s' },
  { title: 'QR Code Generator', x: 87, y: 54, duration: '9.8s', delay: '1.1s' },
  { title: 'CSP Generator & Analyzer', x: 50, y: 74, duration: '12.5s', delay: '0.6s' },
  { title: 'IP Subnet Calculator', x: 21, y: 78, duration: '10.8s', delay: '1.5s' }
]

const TOOL_MAP_CONNECTIONS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 9],
  [2, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [3, 8],
  [4, 6],
  [5, 6],
  [5, 7],
  [5, 8],
  [6, 7],
  [8, 9]
]

const CATEGORY_MAP_NODES = {
  'Encoding & Decoding': { x: 12, y: 70, duration: '13s', delay: '0.4s' },
  'Hashing & Tokens': { x: 34, y: 12, duration: '14s', delay: '1s' },
  'Formatters & Converters': { x: 62, y: 14, duration: '12.5s', delay: '0.7s' },
  'Generators': { x: 84, y: 36, duration: '13.5s', delay: '1.4s' },
  'Analyzers & Parsers': { x: 70, y: 80, duration: '15s', delay: '0.9s' },
  'Penetration Testing': { x: 28, y: 86, duration: '14.5s', delay: '1.2s' }
}

const BACKGROUND_PARTICLES = [
  { x: 6, y: 16, size: 2, duration: '16s', delay: '0s' },
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
  { x: 94, y: 14, size: 2, duration: '15s', delay: '0.6s' }
]

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

export default function HomeToolMap({ tools, onToolClick, onCategoryClick }) {
  const availableTools = new Set(tools.map((tool) => tool.title))
  const availableCategories = [...new Set(tools.map((tool) => tool.category))]
  const visibleNodes = TOOL_MAP_NODES.filter((node) => availableTools.has(node.title))
  const visibleCategoryNodes = availableCategories
    .map((category) => CATEGORY_MAP_NODES[category] ? { category, ...CATEGORY_MAP_NODES[category] } : null)
    .filter(Boolean)

  return (
    <section className="tool-map-section">
      <div className="tool-map-canvas">
        <div className="tool-map-grid" />

        {BACKGROUND_PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="tool-map-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              '--tool-map-particle-duration': particle.duration,
              '--tool-map-particle-delay': particle.delay,
            }}
          />
        ))}

        <svg className="tool-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {TOOL_MAP_CONNECTIONS.map(([startIndex, endIndex]) => {
            const startNode = TOOL_MAP_NODES[startIndex]
            const endNode = TOOL_MAP_NODES[endIndex]

            if (!availableTools.has(startNode.title) || !availableTools.has(endNode.title)) {
              return null
            }

            return (
              <line
                key={`${startNode.title}-${endNode.title}`}
                x1={startNode.x}
                y1={startNode.y}
                x2={endNode.x}
                y2={endNode.y}
              />
            )
          })}
        </svg>

        {visibleNodes.map((node) => (
          <button
            key={node.title}
            type="button"
            className="tool-map-node"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              '--tool-map-node-duration': node.duration,
              '--tool-map-node-delay': node.delay,
            }}
            onMouseMove={handleMapPointerMove}
            onMouseLeave={resetMapPointerMove}
            onClick={() => onToolClick(node.title)}
            aria-label={`Open ${node.title}`}
          >
            <span className="tool-map-node-content">
              <span className="tool-map-node-dot" />
              <span className="tool-map-node-label">{node.title}</span>
            </span>
          </button>
        ))}

        {visibleCategoryNodes.map((node) => (
          <button
            key={node.category}
            type="button"
            className="tool-map-category-node"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              '--tool-map-category-duration': node.duration,
              '--tool-map-category-delay': node.delay,
            }}
            onMouseMove={handleMapPointerMove}
            onMouseLeave={resetMapPointerMove}
            onClick={() => onCategoryClick(node.category)}
            aria-label={`Browse ${node.category} tools`}
          >
            <span className="tool-map-category-content">
              <span className="tool-map-category-dot" />
              <span className="tool-map-category-label">{node.category}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
