import React from 'react'

function FlowMapProgressPanel({
  currentFlow,
  currentStage,
  currentStageLabel,
  toolbarCopy,
  onPreviousStage,
  onRestart,
  currentStageIndex,
  totalStages,
  selectedFlow,
  getStageLabel,
  onStageSelect
}) {
  const progressDenominator = Math.max(totalStages - 1, 1)

  return (
    <div className="flow-map-progress-panel" aria-label="Flow progress">
      <div className="flow-map-progress-copy">
        <span className="flow-map-progress-kicker">{currentFlow.label}</span>
        <div>
          <h2>{currentStage === 'start' ? 'Ready to begin' : currentStageLabel}</h2>
          <p>{toolbarCopy}</p>
        </div>
      </div>
      <div className="flow-map-progress-actions">
        <button
          type="button"
          className="flow-map-utility-button"
          onClick={onPreviousStage}
          disabled={currentStage === 'start'}
        >
          Back
        </button>
        <button type="button" className="flow-map-utility-button" onClick={onRestart}>
          Restart
        </button>
      </div>
      <div className="flow-map-progress-bar" aria-hidden="true">
        <span
          className="flow-map-progress-bar-fill"
          style={{ width: `${totalStages ? (currentStageIndex / progressDenominator) * 100 : 0}%` }}
        />
      </div>
      <div className="flow-map-stage-tabs" aria-label="Flow steps">
        {currentFlow.stages.map((stageId, index) => {
          const isActive = stageId === currentStage

          return (
            <button
              key={`${selectedFlow}-${stageId}-tab`}
              type="button"
              className={`flow-map-stage-tab${isActive ? ' flow-map-stage-tab--active' : ''}`}
              onClick={() => onStageSelect(stageId)}
              disabled={index > currentStageIndex}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="flow-map-stage-tab-index">{index + 1}</span>
              <span>{getStageLabel(currentFlow, stageId)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(FlowMapProgressPanel)
