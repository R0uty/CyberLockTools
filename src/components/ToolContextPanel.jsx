import React from 'react'

export default function ToolContextPanel({
  toolTitle,
  relatedGuides,
  relatedFlowStages,
  flowOriginContext,
  onOpenGuide,
  onOpenFlowStage,
}) {
  if (!toolTitle) {
    return null
  }

  return (
    <aside className="tool-context-panel" aria-label="Related references">
      <div className="tool-context-header">
        <h3>Related Next Steps</h3>
        <p>Jump to relevant pentesting guides or continue from a matching flow stage.</p>
      </div>

      {flowOriginContext?.flowKey && flowOriginContext?.stageId ? (
        <section className="tool-context-resume" aria-label="Resume flow from tool">
          <h4>Resume Flow</h4>
          <p>You opened this tool from Flow Map. Jump back to where you left off or continue at the recommended stage.</p>
          <div className="tool-context-resume-actions">
            <button
              type="button"
              className="tool-context-chip tool-context-chip--resume"
              onClick={() => onOpenFlowStage?.(flowOriginContext.flowKey, flowOriginContext.stageId)}
            >
              Return to current flow
            </button>
            {flowOriginContext.recommendedFlowKey && flowOriginContext.recommendedStageId ? (
              <button
                type="button"
                className="tool-context-chip tool-context-chip--resume-secondary"
                onClick={() => onOpenFlowStage?.(flowOriginContext.recommendedFlowKey, flowOriginContext.recommendedStageId)}
              >
                Continue at recommended stage
              </button>
            ) : null}
          </div>
          {flowOriginContext.recommendationReason ? (
            <p className="tool-context-resume-reason">{flowOriginContext.recommendationReason}</p>
          ) : null}
        </section>
      ) : null}

      <div className="tool-context-grid">
        <section className="tool-context-section" aria-label="Related guides">
          <h4>Related Guides</h4>
          {relatedGuides.length ? (
            <div className="tool-context-chip-list">
              {relatedGuides.map((guideName) => (
                <button
                  key={`${toolTitle}-guide-${guideName}`}
                  type="button"
                  className="tool-context-chip"
                  onClick={() => onOpenGuide?.(guideName)}
                >
                  {guideName}
                </button>
              ))}
            </div>
          ) : (
            <p className="tool-context-empty">No mapped guide yet for this tool.</p>
          )}
        </section>

        <section className="tool-context-section" aria-label="Related flow stages">
          <h4>Related Flow Stages</h4>
          {relatedFlowStages.length ? (
            <div className="tool-context-chip-list">
              {relatedFlowStages.map((flowStage) => (
                <button
                  key={`${toolTitle}-${flowStage.flowKey}-${flowStage.stageId}`}
                  type="button"
                  className="tool-context-chip tool-context-chip--flow"
                  onClick={() => onOpenFlowStage?.(flowStage.flowKey, flowStage.stageId)}
                >
                  <span>{flowStage.flowLabel}</span>
                  <strong>{flowStage.stageLabel}</strong>
                </button>
              ))}
            </div>
          ) : (
            <p className="tool-context-empty">No mapped flow stage yet for this tool.</p>
          )}
        </section>
      </div>
    </aside>
  )
}
