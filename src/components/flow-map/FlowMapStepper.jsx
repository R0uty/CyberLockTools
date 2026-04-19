import React from 'react'

function FlowMapStepper({
  currentFlow,
  currentStage,
  currentStageIndex,
  currentStageLabel,
  selectedFlow,
  getStageLabel,
  onStageSelect,
  onRestart,
  onClearFlow
}) {
  const stages = currentFlow.stages
  const nodes = currentFlow.nodes ?? []
  const connections = currentFlow.connections ?? []
  const totalStages = stages.length

  // Build viewBox from node coordinates with padding
  const xs = nodes.map((n) => n.x)
  const ys = nodes.map((n) => n.y)
  const pad = 12
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  const maxX = Math.max(...xs) + pad
  const maxY = Math.max(...ys) + pad
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]))
  const stageIndexMap = Object.fromEntries(stages.map((s, i) => [s, i]))

  // Terminal breadcrumb: completed stages dimmed, current bright with cursor
  const breadcrumbParts = stages.slice(0, currentStageIndex + 1).map((stageId) => {
    const label = getStageLabel(currentFlow, stageId).toLowerCase().replace(/\s+/g, '-')
    return { label, isCurrent: stageId === currentStage }
  })

  return (
    <div className="flow-map-stepper" aria-label="Flow progress">
      <div className="flow-map-stepper-header">
        <div className="flow-map-stepper-title">
          <h2>{currentStage === 'start' ? 'Ready to begin' : currentStageLabel}</h2>
          {/* Terminal breadcrumb */}
          <p className="flow-map-breadcrumb" aria-label="Flow breadcrumb">
            <span className="flow-map-breadcrumb-flow">{selectedFlow}</span>
            {breadcrumbParts.map((part, i) => (
              <React.Fragment key={i}>
                <span className="flow-map-breadcrumb-sep"> › </span>
                <span className={part.isCurrent ? 'flow-map-breadcrumb-current' : 'flow-map-breadcrumb-done'}>
                  {part.label}
                </span>
              </React.Fragment>
            ))}
            <span className="flow-map-breadcrumb-cursor" aria-hidden="true">▌</span>
          </p>
        </div>
        <div className="flow-map-stepper-actions">
          <button type="button" className="flow-map-stepper-action" onClick={onRestart}>
            Restart
          </button>
          <button type="button" className="flow-map-stepper-action flow-map-stepper-action--ghost" onClick={onClearFlow}>
            Change flow
          </button>
        </div>
      </div>

      {/* SVG node graph */}
      <svg
        className="flow-map-node-graph"
        viewBox={viewBox}
        aria-label="Flow steps"
        role="group"
      >
        {/* Connection lines */}
        {connections.map(([fromId, toId]) => {
          const from = nodeById[fromId]
          const to = nodeById[toId]
          if (!from || !to) return null
          const toIdx = stageIndexMap[toId] ?? -1
          const isCompleted = toIdx <= currentStageIndex && toIdx >= 0
          return (
            <line
              key={`${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={`flow-map-edge${isCompleted ? ' flow-map-edge--done' : ''}`}
              strokeDasharray={isCompleted ? 'none' : '3 3'}
            />
          )
        })}
        {/* Nodes as clickable circles */}
        {nodes.map((node) => {
          const idx = stageIndexMap[node.id] ?? -1
          const isCompleted = idx >= 0 && idx < currentStageIndex
          const isCurrent = node.id === currentStage
          const isLocked = idx > currentStageIndex
          const label = getStageLabel(currentFlow, node.id)
          const r = 6

          return (
            <g key={`${selectedFlow}-${node.id}`} className="flow-map-node-group">
              {isCurrent && (
                <circle cx={node.x} cy={node.y} r={r + 3} className="flow-map-node-pulse" />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                className={`flow-map-node${isCompleted ? ' flow-map-node--done' : ''}${isCurrent ? ' flow-map-node--current' : ''}${isLocked ? ' flow-map-node--locked' : ''}`}
                tabIndex={isLocked ? -1 : 0}
                role="button"
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={label}
                aria-disabled={isLocked}
                onClick={() => !isLocked && onStageSelect(node.id)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
                    e.preventDefault()
                    onStageSelect(node.id)
                  }
                }}
              />
              {isCompleted && (
                <text x={node.x} y={node.y + 1.5} className="flow-map-node-check" aria-hidden="true">✓</text>
              )}
              <text
                x={node.x}
                y={node.y + r + 5}
                className={`flow-map-node-label${isCurrent ? ' flow-map-node-label--current' : ''}${isCompleted ? ' flow-map-node-label--done' : ''}`}
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Progress bar */}
      <div className="flow-map-progress-track" aria-hidden="true">
        <span
          className="flow-map-progress-track-fill"
          style={{ width: `${totalStages > 1 ? (currentStageIndex / (totalStages - 1)) * 100 : 0}%` }}
        />
      </div>

      {/* Keyboard hints */}
      <p className="flow-map-kbd-hints" aria-hidden="true">
        <kbd>←</kbd><kbd>→</kbd> navigate
        <span className="flow-map-kbd-sep">·</span>
        <kbd>R</kbd> restart
        <span className="flow-map-kbd-sep">·</span>
        <kbd>Esc</kbd> exit
      </p>
    </div>
  )
}

export default React.memo(FlowMapStepper)
