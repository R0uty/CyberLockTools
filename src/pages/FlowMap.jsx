import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useSEO } from '../hooks/useSEO'
import {
  STORAGE_STAGE_KEY,
  STORAGE_TOOL_KEY,
  STORAGE_FEEDBACK_KEY,
  STORAGE_FLOW_KEY,
  STORAGE_ACTION_KEY,
  STORAGE_OUTCOME_KEY,
  STORAGE_COMPLETED_KEY,
  DEFAULT_ZOOM,
  FLOW_GROUPS,
  FLOWS,
  ACTIVE_FLOW_GROUP_KEYS
} from '../data/flowMapConfig'
import { readSessionValue, writeSessionValue } from '../utils/sessionStorage'
import { renderFlowStoryContent, renderStartStoryContent } from './flowMapStoryContent'
import {
  DEFAULT_MACHINE_STATE,
  flowMapReducer,
  resolveFlowTransition,
  validateFlowConfigConsistency
} from './flowMapMachine'
import FlowMapStepper from '../components/flow-map/FlowMapStepper'
import '../styles/pages/FlowMap.css'

const DEFAULT_STAGE = 'start'

function getStageLabel(flow, stageId) {
  return flow?.nodes.find((node) => node.id === stageId)?.label ?? stageId
}

function getStoredValue(key, fallback = '') {
  return readSessionValue(key, fallback)
}

function getFlowByKey(flowKey) {
  return flowKey && flowKey in FLOWS && ACTIVE_FLOW_GROUP_KEYS.has(FLOWS[flowKey].group)
    ? FLOWS[flowKey]
    : null
}

function getValidStage(flow, stageId) {
  return flow?.stages.includes(stageId) ? stageId : DEFAULT_STAGE
}

function getStoredFlowKey() {
  const storedFlow = readSessionValue(STORAGE_FLOW_KEY)
  return getFlowByKey(storedFlow) ? storedFlow : ''
}

function getInitialFlowState() {
  const selectedFlow = getStoredFlowKey()
  const flow = getFlowByKey(selectedFlow)

  if (!flow) {
    return {
      selectedFlow: '',
      currentStage: DEFAULT_STAGE
    }
  }

  return {
    selectedFlow,
    currentStage: getValidStage(flow, getStoredValue(STORAGE_STAGE_KEY, DEFAULT_STAGE))
  }
}

function buildInitialMachineState() {
  const initialFlowState = getInitialFlowState()

  return {
    ...DEFAULT_MACHINE_STATE,
    selectedFlow: initialFlowState.selectedFlow,
    currentStage: initialFlowState.currentStage,
    selectedTool: getStoredValue(STORAGE_TOOL_KEY),
    feedback: getStoredValue(STORAGE_FEEDBACK_KEY),
    selectedAction: getStoredValue(STORAGE_ACTION_KEY),
    selectedOutcome: getStoredValue(STORAGE_OUTCOME_KEY),
    zoomLevel: DEFAULT_ZOOM
  }
}

const GROUP_ACCENT = {
  recon: '#22b8ff',
  enumeration: '#4dd9c0',
  'entry-point': '#57c7ff',
  testing: '#ffd240',
  vulnerability: '#ff9e4a',
  exploitation: '#ff6b6b',
  analysis: '#c0c0c0'
}

function getFlowAccent(flow) {
  return GROUP_ACCENT[flow?.group] ?? '#c0c0c0'
}

function readCompletedFlows() {
  try {
    const raw = readSessionValue(STORAGE_COMPLETED_KEY, '[]')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? new Set(parsed) : new Set()
  } catch {
    return new Set()
  }
}

function writeCompletedFlows(completedSet) {
  writeSessionValue(STORAGE_COMPLETED_KEY, JSON.stringify([...completedSet]))
}

const TOTAL_FLOWS = Object.entries(FLOWS).filter(([, f]) => ACTIVE_FLOW_GROUP_KEYS.has(f.group)).length

export default function FlowMap({ onToolClick, onToolReferenceClick }) {
  useSEO({
    title: 'Flow Map - Guided Testing Paths',
    description: 'Guided flow paths for recon, enumeration, entry-point analysis, testing, vulnerability validation, and exploitation in authorized environments.',
    keywords: 'flow map, recon flow, enumeration flow, entry point flow, testing flow, vulnerability flow, exploitation flow'
  })

  const [machineState, dispatch] = useReducer(flowMapReducer, undefined, buildInitialMachineState)
  const {
    selectedFlow,
    currentStage,
    selectedTool,
    feedback,
    selectedAction,
    selectedOutcome
  } = machineState

  const currentFlow = getFlowByKey(selectedFlow)
  const activeRef = useRef(null)
  const groupedFlows = useMemo(
    () => FLOW_GROUPS
      .map(([groupKey, groupLabel]) => ({
        key: groupKey,
        label: groupLabel,
        flows: Object.entries(FLOWS).filter(([, flow]) => flow.group === groupKey)
      }))
      .filter((group) => group.flows.length > 0),
    []
  )
  const stageIndex = useMemo(
    () => Object.fromEntries((currentFlow?.stages ?? ['start']).map((stage, index) => [stage, index])),
    [currentFlow]
  )

  useEffect(() => {
    const configIssues = validateFlowConfigConsistency({
      flows: FLOWS,
      activeGroupKeys: ACTIVE_FLOW_GROUP_KEYS,
      startStageByFlow: {
        decode: 'encoded',
        login: 'login-page',
        discovery: 'web-page-found',
        enumeration: 'service-found',
        input: 'input-field-found',
        api: 'api-endpoint-found',
        response: 'response-data-found',
        request: 'http-request-observed',
        authz: 'privileged-action-found',
        exploitation: 'confirmed-finding',
        'info-disclosure': 'source-found',
        session: 'session-captured',
        upload: 'upload-found'
      }
    })

    if (configIssues.length > 0) {
      console.warn('[FlowMap] flow config consistency issues detected:', configIssues)
    }
  }, [])

  useEffect(() => {
    writeSessionValue(STORAGE_FLOW_KEY, selectedFlow)
  }, [selectedFlow])

  useEffect(() => {
    writeSessionValue(STORAGE_STAGE_KEY, currentStage)
    if (selectedFlow && (currentStage === 'success' || currentStage === 'next-step')) {
      const completed = readCompletedFlows()
      if (!completed.has(selectedFlow)) {
        completed.add(selectedFlow)
        writeCompletedFlows(completed)
      }
    }
  }, [currentStage, selectedFlow])

  // Re-read completed flows when stage/flow changes (deps trigger re-read after sessionStorage write above)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const completedFlows = useMemo(() => readCompletedFlows(), [selectedFlow, currentStage])

  useEffect(() => {
    writeSessionValue(STORAGE_TOOL_KEY, selectedTool)
  }, [selectedTool])

  useEffect(() => {
    writeSessionValue(STORAGE_FEEDBACK_KEY, feedback)
  }, [feedback])

  useEffect(() => {
    writeSessionValue(STORAGE_ACTION_KEY, selectedAction)
  }, [selectedAction])

  useEffect(() => {
    writeSessionValue(STORAGE_OUTCOME_KEY, selectedOutcome)
  }, [selectedOutcome])

  const currentStageIndex = stageIndex[currentStage] ?? 0

  // Keyboard navigation
  useEffect(() => {
    const el = activeRef.current
    if (!el || !currentFlow) return

    function handleKeyDown(e) {
      const stages = currentFlow.stages
      const idx = stageIndex[currentStage] ?? 0

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (idx + 1 <= currentStageIndex && idx + 1 < stages.length) {
          dispatch({ type: 'STAGE_SET', stage: stages[idx + 1] })
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (idx - 1 >= 0) {
          dispatch({ type: 'STAGE_SET', stage: stages[idx - 1] })
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        dispatch({ type: 'FLOW_CLEAR', defaultZoom: DEFAULT_ZOOM })
      } else if (e.key === 'r' || e.key === 'R') {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
        e.preventDefault()
        dispatch({ type: 'FLOW_RESET' })
      }
    }

    el.addEventListener('keydown', handleKeyDown)
    el.focus({ preventScroll: true })
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [currentFlow, currentStage, currentStageIndex, stageIndex])

  const transitionToStage = useCallback((nextStage) => {
    if (!currentFlow || !currentFlow.stages.includes(nextStage)) {
      return false
    }

    dispatch({ type: 'STAGE_SET', stage: nextStage })
    return true
  }, [currentFlow])

  const navigateToUnlockedStage = useCallback((nextStage) => {
    if (!currentFlow || !currentFlow.stages.includes(nextStage)) {
      return false
    }

    if ((stageIndex[nextStage] ?? Number.POSITIVE_INFINITY) > currentStageIndex) {
      return false
    }

    dispatch({ type: 'STAGE_SET', stage: nextStage })
    return true
  }, [currentFlow, currentStageIndex, stageIndex])

  const applyFlowEvent = useCallback((eventName, payload) => {
    if (!currentFlow) {
      return false
    }

    const transition = resolveFlowTransition(eventName, {
      selectedFlow,
      currentStage,
      selectedTool,
      selectedAction,
      selectedOutcome,
      feedback,
      payload
    })

    if (!transition) {
      return false
    }

    const patch = {}

    if (typeof transition.nextStage === 'string') {
      if (!currentFlow.stages.includes(transition.nextStage)) {
        console.warn(`[FlowMap] blocked invalid transition for ${selectedFlow}: ${eventName} -> ${transition.nextStage}`)
        return false
      }

      patch.currentStage = transition.nextStage
    }

    if (transition.feedback !== undefined) {
      patch.feedback = transition.feedback
    }

    if (transition.selectedTool !== undefined) {
      patch.selectedTool = transition.selectedTool
    }

    if (transition.selectedAction !== undefined) {
      patch.selectedAction = transition.selectedAction
    }

    if (transition.selectedOutcome !== undefined) {
      patch.selectedOutcome = transition.selectedOutcome
    }

    if (Object.keys(patch).length > 0) {
      dispatch({ type: 'CONTEXT_PATCH', patch })
    }

    return true
  }, [
    currentFlow,
    selectedFlow,
    currentStage,
    selectedTool,
    selectedAction,
    selectedOutcome,
    feedback
  ])

  const resetFlowState = useCallback(() => {
    dispatch({ type: 'FLOW_RESET' })
  }, [])

  const clearFlow = useCallback(() => {
    dispatch({ type: 'FLOW_CLEAR', defaultZoom: DEFAULT_ZOOM })
  }, [])

  const handleFlowSelect = useCallback((flowKey) => {
    if (!getFlowByKey(flowKey)) {
      return
    }

    dispatch({ type: 'FLOW_SELECT', flowKey, defaultZoom: DEFAULT_ZOOM })
  }, [])

  const currentStageLabel = currentFlow ? getStageLabel(currentFlow, currentStage) : ''

  const storyProps = {
    currentFlow,
    currentStage,
    selectedAction,
    selectedOutcome,
    selectedTool,
    feedback,
    goToStage: transitionToStage,
    clearFlow,
    resetFlowState,
    handleStartClick: () => applyFlowEvent('startFlow'),
    handleContinueToDecode: () => applyFlowEvent('decode.continue'),
    handleDecoderOpen: (toolName) => {
      if (applyFlowEvent('decode.openTool', toolName)) {
        onToolClick(toolName)
      }
    },
    handleDecodeResultChoice: (choice) => applyFlowEvent('decode.result', choice),
    handleLoginActionSelect: (action) => applyFlowEvent('login.actionSelect', action),
    handleLoginTestContinue: () => applyFlowEvent('login.testContinue'),
    handleLoginResultChoice: (outcome) => applyFlowEvent('login.result', outcome),
    handleLoginNextStep: () => applyFlowEvent('login.nextStep'),
    handleDiscoveryActionSelect: () => applyFlowEvent('discovery.actionSelect'),
    handleDiscoveryEnumerate: () => applyFlowEvent('discovery.enumerate'),
    handleDiscoveryResultChoice: (outcome) => applyFlowEvent('discovery.result', outcome),
    handleDiscoveryNextStep: () => applyFlowEvent('discovery.nextStep'),
    handleEnumerationActionSelect: (action) => applyFlowEvent('enumeration.actionSelect', action),
    handleEnumerationContinue: () => applyFlowEvent('enumeration.continue'),
    handleEnumerationResultChoice: (outcome) => applyFlowEvent('enumeration.result', outcome),
    handleEnumerationNextStep: () => applyFlowEvent('enumeration.nextStep'),
    handleInputActionSelect: () => applyFlowEvent('input.actionSelect'),
    handleInputContinue: () => applyFlowEvent('input.continue'),
    handleInputResultChoice: (outcome) => applyFlowEvent('input.result', outcome),
    handleInputNextStep: () => applyFlowEvent('input.nextStep'),
    handleApiActionSelect: (action) => applyFlowEvent('api.actionSelect', action),
    handleApiContinue: () => applyFlowEvent('api.continue'),
    handleApiResultChoice: (outcome) => applyFlowEvent('api.result', outcome),
    handleApiNextStep: () => applyFlowEvent('api.nextStep'),
    handleResponseActionSelect: () => applyFlowEvent('response.actionSelect'),
    handleResponseContinue: () => applyFlowEvent('response.continue'),
    handleResponseResultChoice: (outcome) => applyFlowEvent('response.result', outcome),
    handleResponseNextStep: () => applyFlowEvent('response.nextStep'),
    handleRequestActionSelect: () => applyFlowEvent('request.actionSelect'),
    handleRequestContinue: () => applyFlowEvent('request.continue'),
    handleRequestResultChoice: (outcome) => applyFlowEvent('request.result', outcome),
    handleRequestNextStep: () => applyFlowEvent('request.nextStep'),
    handleAuthzActionSelect: (action) => applyFlowEvent('authz.actionSelect', action),
    handleAuthzContinue: () => applyFlowEvent('authz.continue'),
    handleAuthzResultChoice: (outcome) => applyFlowEvent('authz.result', outcome),
    handleAuthzNextStep: () => applyFlowEvent('authz.nextStep'),
    handleExploitationActionSelect: (action) => applyFlowEvent('exploitation.actionSelect', action),
    handleExploitationContinue: () => applyFlowEvent('exploitation.continue'),
    handleExploitationResultChoice: (outcome) => applyFlowEvent('exploitation.result', outcome),
    handleExploitationNextStep: () => applyFlowEvent('exploitation.nextStep'),
    handleInfoDisclosureActionSelect: (action) => applyFlowEvent('info-disclosure.actionSelect', action),
    handleInfoDisclosureContinue: () => applyFlowEvent('info-disclosure.continue'),
    handleInfoDisclosureResultChoice: (outcome) => applyFlowEvent('info-disclosure.result', outcome),
    handleInfoDisclosureNextStep: () => applyFlowEvent('info-disclosure.nextStep'),
    handleSessionActionSelect: (action) => applyFlowEvent('session.actionSelect', action),
    handleSessionContinue: () => applyFlowEvent('session.continue'),
    handleSessionResultChoice: (outcome) => applyFlowEvent('session.result', outcome),
    handleSessionNextStep: () => applyFlowEvent('session.nextStep'),
    handleUploadActionSelect: (action) => applyFlowEvent('upload.actionSelect', action),
    handleUploadContinue: () => applyFlowEvent('upload.continue'),
    handleUploadResultChoice: (outcome) => applyFlowEvent('upload.result', outcome),
    handleUploadNextStep: () => applyFlowEvent('upload.nextStep'),
    handleFollowUpFlow: handleFlowSelect
  }

  return (
    <div className="tool-page flow-map-page">
      {!currentFlow ? (
        <div className="flow-map-selector">
          <div className="flow-map-selector-head">
            <h1 className="flow-map-selector-title">Guided Testing Flows</h1>
            {completedFlows.size > 0 && (
              <span className="flow-map-completed-counter">{completedFlows.size}/{TOTAL_FLOWS} completed</span>
            )}
          </div>
          <p className="flow-map-selector-copy">Pick a flow to walk through a structured testing path step by step.</p>
          <div className="flow-map-groups">
            {groupedFlows.map((group) => (
              <div key={group.key} className="flow-map-group">
                <span className="flow-map-group-label">{group.label}</span>
                <div className="flow-map-group-flows">
                  {group.flows.map(([flowKey, flow]) => (
                    <button
                      key={flowKey}
                      type="button"
                      className={`flow-map-flow-button${completedFlows.has(flowKey) ? ' flow-map-flow-button--done' : ''}`}
                      aria-label={flow.label}
                      onClick={() => handleFlowSelect(flowKey)}
                    >
                      <span className="flow-map-flow-name">
                        {completedFlows.has(flowKey) && <span className="flow-map-flow-badge" aria-label="completed">✓</span>}
                        {flow.label}
                      </span>
                      <span className="flow-map-flow-summary">{flow.summary}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <section
          ref={activeRef}
          className="flow-map-active"
          aria-label="Flow map canvas"
          style={{ '--flow-accent': getFlowAccent(currentFlow) }}
          tabIndex={-1}
        >
          <FlowMapStepper
            currentFlow={currentFlow}
            currentStage={currentStage}
            currentStageIndex={currentStageIndex}
            currentStageLabel={currentStageLabel}
            selectedFlow={selectedFlow}
            getStageLabel={getStageLabel}
            onStageSelect={navigateToUnlockedStage}
            onRestart={resetFlowState}
            onClearFlow={clearFlow}
          />

          <div className="flow-map-story-panel">
            <div className={`flow-map-story${currentStage === 'success' || currentStage === 'next-step' ? ' flow-map-story--success' : ''}`}>
              {currentStage === 'start'
                ? renderStartStoryContent(storyProps)
                : renderFlowStoryContent({ selectedFlow, storyProps })}
            </div>
          </div>

          {currentFlow.tools?.length || currentFlow.suggestedSkills?.length ? (
            <div className="flow-map-extras">
              {currentFlow.tools?.length ? (
                <details className="flow-map-details">
                  <summary className="flow-map-details-summary">
                    Recommended Tools
                    <span className="flow-map-details-count">{currentFlow.tools.length}</span>
                  </summary>
                  <div className="flow-map-details-grid">
                    {currentFlow.tools.map((tool) => (
                      <div key={`${selectedFlow}-${tool.name}`} className="flow-map-detail-card">
                        <h3>
                          <button
                            type="button"
                            className="flow-map-tool-link"
                            onClick={() => onToolReferenceClick?.(tool.name)}
                          >
                            {tool.name}
                          </button>
                        </h3>
                        <p>{tool.purpose}</p>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}

              {currentFlow.suggestedSkills?.length ? (
                <details className="flow-map-details">
                  <summary className="flow-map-details-summary">
                    Suggested Skills
                    <span className="flow-map-details-count">{currentFlow.suggestedSkills.length}</span>
                  </summary>
                  <div className="flow-map-details-grid">
                    {currentFlow.suggestedSkills.map((skill) => (
                      <article key={`${selectedFlow}-${skill.name}`} className="flow-map-detail-card">
                        <h3>{skill.name}</h3>
                        <span className={`flow-map-skill-difficulty flow-map-skill-difficulty--${skill.difficulty}`}>
                          {skill.difficulty}
                        </span>
                        <p>{skill.reason}</p>
                      </article>
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}
