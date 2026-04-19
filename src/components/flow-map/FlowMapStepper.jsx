import React from 'react'

function FlowMapStepper({
  currentFlow,
  currentStage,
  currentStageIndex,
  currentStageLabel,
  toolbarCopy,
  selectedFlow,
  getStageLabel,
  onStageSelect,
  onRestart,
  onClearFlow
}) {
  return (
    <div className="flow-map-stepper" aria-label="Flow progress">
      <div className="flow-map-stepper-header">
        <div className="flow-map-stepper-title">
          <h2>{currentStage === 'start' ? 'Ready to begin' : currentStageLabel}</h2>
          <p className="flow-map-stepper-copy">{toolbarCopy}</p>
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

      <div className="flow-map-pipeline" aria-label="Flow steps">
        {currentFlow.stages.map((stageId, index) => {
          const isCompleted = index < currentStageIndex
          const isCurrent = stageId === currentStage
          const isLocked = index > currentStageIndex
          const label = getStageLabel(currentFlow, stageId)

          return (
            <React.Fragment key={`${selectedFlow}-${stageId}`}>
              {index > 0 && (
                <span
                  className={`flow-map-pipeline-line${isCompleted || isCurrent ? ' flow-map-pipeline-line--active' : ''}`}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                className={`flow-map-pipeline-step${isCompleted ? ' flow-map-pipeline-step--done' : ''}${isCurrent ? ' flow-map-pipeline-step--current' : ''}${isLocked ? ' flow-map-pipeline-step--locked' : ''}`}
                onClick={() => onStageSelect(stageId)}
                disabled={isLocked}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="flow-map-pipeline-dot" aria-hidden="true">
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span className="flow-map-pipeline-label">{label}</span>
              </button>
            </React.Fragment>
          )
        })}
      </div>

      <div className="flow-map-progress-track" aria-hidden="true">
        <span
          className="flow-map-progress-track-fill"
          style={{ width: `${currentFlow.stages.length > 1 ? (currentStageIndex / (currentFlow.stages.length - 1)) * 100 : 0}%` }}
        />
      </div>
    </div>
  )
}

export default React.memo(FlowMapStepper)
