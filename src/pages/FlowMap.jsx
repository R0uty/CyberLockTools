import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import {
  STORAGE_STAGE_KEY,
  STORAGE_TOOL_KEY,
  STORAGE_FEEDBACK_KEY,
  STORAGE_FLOW_KEY,
  STORAGE_ACTION_KEY,
  STORAGE_OUTCOME_KEY,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
  DEFAULT_ZOOM,
  BASE_SCENE_WIDTH,
  BASE_SCENE_HEIGHT,
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
import FlowMapProgressPanel from '../components/flow-map/FlowMapProgressPanel'
import FlowMapCanvas from '../components/flow-map/FlowMapCanvas'
import './FlowMap.css'

const DEFAULT_STAGE = 'start'

function clampZoomLevel(nextZoomLevel) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoomLevel))
}

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

export default function FlowMap({ onToolClick }) {
  useSEO({
    title: 'Flow Map - Workflow Layout',
    description: 'Guided flow maps for recon, enumeration, entry-point, testing, vulnerability, and exploitation workflows.',
    keywords: 'flow map, recon flow, enumeration flow, entry point flow, testing flow, vulnerability flow, exploitation flow'
  })

  const [machineState, dispatch] = useReducer(flowMapReducer, undefined, buildInitialMachineState)
  const {
    selectedFlow,
    currentStage,
    selectedTool,
    feedback,
    selectedAction,
    selectedOutcome,
    zoomLevel
  } = machineState

  const [isDraggingViewport, setIsDraggingViewport] = useState(false)
  const viewportRef = useRef(null)
  const dragStateRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0
  })

  const currentFlow = getFlowByKey(selectedFlow)
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
  const availableCategoryCopy = groupedFlows.map((group) => group.label).join(', ')

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
        response: 'response-data-found',
        request: 'http-request-observed',
        exploitation: 'confirmed-finding'
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
  }, [currentStage])

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

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      viewport.scrollLeft = Math.max((viewport.scrollWidth - viewport.clientWidth) / 2, 0)
      viewport.scrollTop = Math.max((viewport.scrollHeight - viewport.clientHeight) / 2, 0)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [selectedFlow])

  const currentStageIndex = stageIndex[currentStage] ?? 0

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

  const updateZoomLevel = useCallback((nextZoomLevel) => {
    dispatch({ type: 'ZOOM_SET', zoomLevel: clampZoomLevel(nextZoomLevel) })
  }, [])

  const handleViewportWheel = useCallback((event) => {
    if (!event.ctrlKey && !event.metaKey) {
      return
    }

    event.preventDefault()
    const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
    dispatch({ type: 'ZOOM_SET', zoomLevel: clampZoomLevel(zoomLevel + delta) })
  }, [zoomLevel])

  const stopViewportDrag = useCallback(() => {
    dragStateRef.current.active = false
    dragStateRef.current.pointerId = null
    setIsDraggingViewport(false)
  }, [])

  const handleViewportPointerDown = useCallback((event) => {
    if (event.button !== 0) {
      return
    }

    if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, label')) {
      return
    }

    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop
    }

    viewport.setPointerCapture(event.pointerId)
    setIsDraggingViewport(true)
  }, [])

  const handleViewportPointerMove = useCallback((event) => {
    const viewport = viewportRef.current

    if (!viewport || !dragStateRef.current.active || dragStateRef.current.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - dragStateRef.current.startX
    const deltaY = event.clientY - dragStateRef.current.startY

    viewport.scrollLeft = dragStateRef.current.scrollLeft - deltaX
    viewport.scrollTop = dragStateRef.current.scrollTop - deltaY
  }, [])

  const handleViewportPointerUp = useCallback((event) => {
    const viewport = viewportRef.current

    if (!viewport || dragStateRef.current.pointerId !== event.pointerId) {
      return
    }

    viewport.releasePointerCapture(event.pointerId)
    stopViewportDrag()
  }, [stopViewportDrag])

  const currentStageNumber = currentFlow ? currentStageIndex + 1 : 0
  const totalStages = currentFlow?.stages.length ?? 0
  const currentStageLabel = currentFlow ? getStageLabel(currentFlow, currentStage) : ''
  const nextStageId = currentFlow ? currentFlow.stages[Math.min(currentStageIndex + 1, totalStages - 1)] : ''
  const nextStageLabel = currentFlow && currentStage !== 'start' && currentStageNumber < totalStages
    ? getStageLabel(currentFlow, nextStageId)
    : ''
  const sceneWidth = Math.round(BASE_SCENE_WIDTH * zoomLevel)
  const sceneHeight = Math.round(BASE_SCENE_HEIGHT * zoomLevel)

  const handlePreviousStage = useCallback(() => {
    if (!currentFlow) {
      return
    }

    const previousStageId = currentFlow.stages[(stageIndex[currentStage] ?? 0) - 1]

    if (previousStageId) {
      navigateToUnlockedStage(previousStageId)
    }
  }, [currentFlow, currentStage, navigateToUnlockedStage, stageIndex])

  const toolbarCopy = !currentFlow
    ? `Pick a flow from ${availableCategoryCopy} to load its guided path.`
    : currentStage === 'start'
      ? `Step 1 of ${totalStages}: review the flow summary, then begin when you are ready.`
      : nextStageLabel
        ? `Step ${currentStageNumber} of ${totalStages}: ${currentStageLabel}. Up next: ${nextStageLabel}.`
        : `Step ${currentStageNumber} of ${totalStages}: ${currentStageLabel}.`

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
    handleResponseActionSelect: () => applyFlowEvent('response.actionSelect'),
    handleResponseContinue: () => applyFlowEvent('response.continue'),
    handleResponseResultChoice: (outcome) => applyFlowEvent('response.result', outcome),
    handleResponseNextStep: () => applyFlowEvent('response.nextStep'),
    handleRequestActionSelect: () => applyFlowEvent('request.actionSelect'),
    handleRequestContinue: () => applyFlowEvent('request.continue'),
    handleRequestResultChoice: (outcome) => applyFlowEvent('request.result', outcome),
    handleRequestNextStep: () => applyFlowEvent('request.nextStep'),
    handleExploitationActionSelect: (action) => applyFlowEvent('exploitation.actionSelect', action),
    handleExploitationContinue: () => applyFlowEvent('exploitation.continue'),
    handleExploitationResultChoice: (outcome) => applyFlowEvent('exploitation.result', outcome),
    handleExploitationNextStep: () => applyFlowEvent('exploitation.nextStep')
  }

  return (
    <div className="tool-page flow-map-page">
      <div className="tool-header flow-map-header">
        <span className="flow-map-kicker">Flow categories</span>
        <p className="flow-map-header-copy">
          Active flow groups currently live here: <strong>{availableCategoryCopy}</strong>. Each category now has at least one flow ready to open.
        </p>
        <div className="flow-map-category-groups">
          {groupedFlows.map((group) => (
            <div key={group.key} className="flow-map-category-group">
              <span className="flow-map-category-group-title">{group.label}</span>
              <div className="flow-map-categories">
                {group.flows.map(([flowKey, flow]) => (
                  <button
                    key={flowKey}
                    type="button"
                    className={`flow-map-category-button${selectedFlow === flowKey ? ' flow-map-category-button--active' : ''}`}
                    onClick={() => handleFlowSelect(flowKey)}
                  >
                    {flow.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            className="flow-map-category-button flow-map-category-button--ghost"
            onClick={clearFlow}
          >
            Clear
          </button>
        </div>
      </div>

      <section className={`flow-map-stage${currentFlow ? ' flow-map-stage--active' : ''}`} aria-label="Flow map canvas">
        {currentFlow ? (
          <FlowMapProgressPanel
            currentFlow={currentFlow}
            currentStage={currentStage}
            currentStageLabel={currentStageLabel}
            toolbarCopy={toolbarCopy}
            onPreviousStage={handlePreviousStage}
            onRestart={resetFlowState}
            currentStageIndex={currentStageIndex}
            totalStages={totalStages}
            selectedFlow={selectedFlow}
            getStageLabel={getStageLabel}
            onStageSelect={navigateToUnlockedStage}
          />
        ) : null}

        {currentFlow && (
          <div className="flow-map-story-panel">
            <div className={`flow-map-story${currentStage === 'success' || currentStage === 'next-step' ? ' flow-map-story--success' : ''}`}>
              {currentStage === 'start'
                ? renderStartStoryContent(storyProps)
                : renderFlowStoryContent({ selectedFlow, storyProps })}
            </div>
          </div>
        )}

        {currentFlow?.tools?.length ? (
          <div className="flow-map-tools-panel" aria-label="Recommended tools">
            <div className="flow-map-tools-header">
              <span className="flow-map-tools-kicker">Recommended tools</span>
              <p>These are the concrete tools this flow expects you to reach for while working through the recon steps.</p>
            </div>
            <div className="flow-map-tools-grid">
              {currentFlow.tools.map((tool) => (
                <div key={`${selectedFlow}-${tool.name}`} className="flow-map-tool-card">
                  <h3>{tool.name}</h3>
                  <p>{tool.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flow-map-toolbar">
          <p className="flow-map-toolbar-copy">{toolbarCopy} Drag to explore the map. Hold Ctrl or Cmd while scrolling to zoom.</p>
          <div className="flow-map-zoom-controls" aria-label="Flow map zoom controls">
            <button type="button" className="flow-map-zoom-button" onClick={() => updateZoomLevel(zoomLevel - ZOOM_STEP)}>
              -
            </button>
            <span className="flow-map-zoom-value">{Math.round(zoomLevel * 100)}%</span>
            <button type="button" className="flow-map-zoom-button" onClick={() => updateZoomLevel(zoomLevel + ZOOM_STEP)}>
              +
            </button>
            <button type="button" className="flow-map-zoom-button flow-map-zoom-button--reset" onClick={() => updateZoomLevel(DEFAULT_ZOOM)}>
              Reset view
            </button>
          </div>
        </div>

        <FlowMapCanvas
          viewportRef={viewportRef}
          isDraggingViewport={isDraggingViewport}
          onWheel={handleViewportWheel}
          onPointerDown={handleViewportPointerDown}
          onPointerMove={handleViewportPointerMove}
          onPointerUp={handleViewportPointerUp}
          onPointerCancel={stopViewportDrag}
          sceneWidth={sceneWidth}
          sceneHeight={sceneHeight}
          currentFlow={currentFlow}
          selectedFlow={selectedFlow}
          stageIndex={stageIndex}
          currentStage={currentStage}
          currentStageIndex={currentStageIndex}
          onStageSelect={navigateToUnlockedStage}
        />
      </section>
    </div>
  )
}
