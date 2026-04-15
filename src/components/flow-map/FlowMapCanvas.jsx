import React, { useMemo } from 'react'
import { BACKGROUND_STARS } from '../../data/flowMapConfig'

function handleMapPointerMove(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const offsetX = event.clientX - rect.left - rect.width / 2
  const offsetY = event.clientY - rect.top - rect.height / 2

  event.currentTarget.style.setProperty('--flow-map-hover-x', `${Math.max(Math.min(-offsetX * 0.18, 14), -14)}px`)
  event.currentTarget.style.setProperty('--flow-map-hover-y', `${Math.max(Math.min(-offsetY * 0.18, 12), -12)}px`)
}

function resetMapPointerMove(event) {
  event.currentTarget.style.setProperty('--flow-map-hover-x', '0px')
  event.currentTarget.style.setProperty('--flow-map-hover-y', '0px')
}

function FlowMapCanvas({
  viewportRef,
  isDraggingViewport,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  sceneWidth,
  sceneHeight,
  currentFlow,
  selectedFlow,
  stageIndex,
  currentStage,
  currentStageIndex,
  onStageSelect
}) {
  const renderedLines = useMemo(() => {
    if (!currentFlow) {
      return null
    }

    return currentFlow.connections.map(([startId, endId]) => {
      const startNode = currentFlow.nodes.find((node) => node.id === startId)
      const endNode = currentFlow.nodes.find((node) => node.id === endId)
      const startIndex = stageIndex[startId] ?? 0
      const endIndex = stageIndex[endId] ?? 0

      if (!startNode || !endNode) {
        return null
      }

      if (startIndex > currentStageIndex || endIndex > currentStageIndex) {
        return null
      }

      const pathClassName = endId === currentStage
        ? 'flow-map-path--current'
        : 'flow-map-path--passed'

      return (
        <line
          key={`${selectedFlow}-${startId}-${endId}`}
          className={pathClassName}
          x1={startNode.x}
          y1={startNode.y}
          x2={endNode.x}
          y2={endNode.y}
        />
      )
    })
  }, [currentFlow, currentStage, currentStageIndex, selectedFlow, stageIndex])

  const renderedNodes = useMemo(() => {
    if (!currentFlow) {
      return null
    }

    return currentFlow.nodes.map((node) => {
      const isRevealed = (stageIndex[node.id] ?? Number.POSITIVE_INFINITY) <= currentStageIndex
      const isCurrent = currentStage === node.id

      return (
        <button
          key={`${selectedFlow}-${node.id}`}
          type="button"
          className={`flow-map-node${isRevealed ? ' flow-map-node--active-path' : ''}${isCurrent ? ' flow-map-node--current' : ''}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onMouseMove={handleMapPointerMove}
          onMouseLeave={resetMapPointerMove}
          onClick={() => onStageSelect(node.id)}
          aria-current={isCurrent ? 'step' : undefined}
          aria-label={node.label}
        >
          <span className="flow-map-node-content">
            <span className="flow-map-node-dot" />
            <span className="flow-map-node-label">{node.label}</span>
          </span>
        </button>
      )
    })
  }, [currentFlow, currentStage, currentStageIndex, onStageSelect, selectedFlow, stageIndex])

  return (
    <div
      ref={viewportRef}
      className={`flow-map-viewport${isDraggingViewport ? ' flow-map-viewport--dragging' : ''}`}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        className="flow-map-scene"
        style={{
          width: `${sceneWidth}px`,
          height: `${sceneHeight}px`
        }}
      >
        <div className="flow-map-canvas">
          <div className="flow-map-grid" />

          {BACKGROUND_STARS.map((star, index) => (
            <span
              key={`${star.x}-${star.y}-${index}`}
              className="flow-map-star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity
              }}
            />
          ))}

          <svg className="flow-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {renderedLines}
          </svg>

          {!currentFlow && (
            <div className="flow-map-empty-state">
              <span className="flow-map-empty-kicker">Flow category</span>
              <p>Select a flow from the active categories above to load its first node.</p>
            </div>
          )}

          {renderedNodes}
        </div>
      </div>
    </div>
  )
}

export default React.memo(FlowMapCanvas)
