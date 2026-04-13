import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  BACKGROUND_STARS,
  FLOWS,
  ACTIVE_FLOW_GROUP_KEYS
} from '../data/flowMapConfig'
import { readSessionValue, writeSessionValue } from '../utils/sessionStorage'
import { renderFlowStoryContent, renderStartStoryContent } from './flowMapStoryContent'
import './FlowMap.css'

const DEFAULT_STAGE = 'start'
const DEFAULT_REVEALED_STAGE_INDEX = 0
const FLOW_START_STAGE_BY_KEY = {
  decode: 'encoded',
  login: 'login-page',
  discovery: 'web-page-found',
  enumeration: 'service-found',
  input: 'input-field-found',
  response: 'response-data-found',
  request: 'http-request-observed',
  exploitation: 'confirmed-finding'
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

export default function FlowMap({ onToolClick }) {
  const initialFlowState = getInitialFlowState()

  useSEO({
    title: 'Flow Map - Workflow Layout',
    description: 'Guided flow maps for recon, enumeration, entry-point, testing, vulnerability, and exploitation workflows.',
    keywords: 'flow map, recon flow, enumeration flow, entry point flow, testing flow, vulnerability flow, exploitation flow'
  })

  const [selectedFlow, setSelectedFlow] = useState(() => initialFlowState.selectedFlow)
  const [currentStage, setCurrentStage] = useState(() => initialFlowState.currentStage)
  const [selectedTool, setSelectedTool] = useState(() => getStoredValue(STORAGE_TOOL_KEY))
  const [feedback, setFeedback] = useState(() => getStoredValue(STORAGE_FEEDBACK_KEY))
  const [selectedAction, setSelectedAction] = useState(() => getStoredValue(STORAGE_ACTION_KEY))
  const [selectedOutcome, setSelectedOutcome] = useState(() => getStoredValue(STORAGE_OUTCOME_KEY))
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM)
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

  const resetFlowState = () => {
    setCurrentStage(DEFAULT_STAGE)
    setSelectedTool('')
    setFeedback('')
    setSelectedAction('')
    setSelectedOutcome('')
  }

  const clearFlow = () => {
    setSelectedFlow('')
    setZoomLevel(DEFAULT_ZOOM)
    resetFlowState()
  }

  const handleFlowSelect = (flowKey) => {
    if (!getFlowByKey(flowKey)) {
      return
    }

    setSelectedFlow(flowKey)
    setZoomLevel(DEFAULT_ZOOM)
    resetFlowState()
  }

  const clampZoomLevel = (nextZoomLevel) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoomLevel))

  const updateZoomLevel = (nextZoomLevel) => {
    setZoomLevel(clampZoomLevel(nextZoomLevel))
  }

  const handleViewportWheel = (event) => {
    if (!event.ctrlKey && !event.metaKey) {
      return
    }

    event.preventDefault()
    setZoomLevel((previousZoomLevel) => clampZoomLevel(previousZoomLevel + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)))
  }

  const stopViewportDrag = () => {
    dragStateRef.current.active = false
    dragStateRef.current.pointerId = null
    setIsDraggingViewport(false)
  }

  const handleViewportPointerDown = (event) => {
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
  }

  const handleViewportPointerMove = (event) => {
    const viewport = viewportRef.current

    if (!viewport || !dragStateRef.current.active || dragStateRef.current.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - dragStateRef.current.startX
    const deltaY = event.clientY - dragStateRef.current.startY

    viewport.scrollLeft = dragStateRef.current.scrollLeft - deltaX
    viewport.scrollTop = dragStateRef.current.scrollTop - deltaY
  }

  const handleViewportPointerUp = (event) => {
    const viewport = viewportRef.current

    if (!viewport || dragStateRef.current.pointerId !== event.pointerId) {
      return
    }

    viewport.releasePointerCapture(event.pointerId)
    stopViewportDrag()
  }

  const transitionToStage = (nextStage) => {
    if (!currentFlow || !currentFlow.stages.includes(nextStage)) {
      return false
    }

    setCurrentStage(nextStage)
    return true
  }

  const clearFeedbackAndTransition = (nextStage) => {
    setFeedback('')
    return transitionToStage(nextStage)
  }

  const handleStartClick = () => {
    clearFeedbackAndTransition(FLOW_START_STAGE_BY_KEY[selectedFlow] ?? 'encoded')
  }

  const handleContinueToDecode = () => {
    clearFeedbackAndTransition('decode')
  }

  const handleDecoderOpen = (toolName) => {
    setSelectedTool(toolName)
    setFeedback(`You opened ${toolName}. Come back here after trying it, then choose what result you got.`)
    transitionToStage('result')
    onToolClick(toolName)
  }

  const handleDecodeResultChoice = (choice) => {
    if (choice === 'readable') {
      setFeedback('')
      transitionToStage('success')
      return
    }

    if (choice === 'still-encoded') {
      setFeedback('The output still looks encoded. Try another simple decoder and compare the result.')
      transitionToStage('decode')
      return
    }

    setFeedback('The output looks random. That usually means the wrong decoder or the wrong input format, so try another decoder next.')
    transitionToStage('decode')
  }

  const handleLoginActionSelect = (action) => {
    setSelectedAction(action)
    clearFeedbackAndTransition('test-login')
  }

  const handleLoginTestContinue = () => {
    clearFeedbackAndTransition('result')
  }

  const handleLoginResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'error-message') {
      transitionToStage('analyze-error')
      return
    }

    if (outcome === 'login-success') {
      setFeedback('A basic or default login working is already a strong sign of weak authentication and should be validated carefully.')
      transitionToStage('next-step')
      return
    }

    setFeedback('No visible change does not mean the login is safe. Small input changes, timing differences, and hidden validation issues can still matter.')
    transitionToStage('next-step')
  }

  const handleLoginNextStep = () => {
    setFeedback('Different login behaviors can reveal weaknesses, so the next step is to test basic injection or bypass ideas carefully.')
    transitionToStage('next-step')
  }

  const handleDiscoveryActionSelect = () => {
    setSelectedAction('hidden-content')
    clearFeedbackAndTransition('discovery')
  }

  const handleDiscoveryEnumerate = () => {
    clearFeedbackAndTransition('enumerate')
  }

  const handleDiscoveryResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'found-endpoint') {
      setFeedback('')
      transitionToStage('investigate')
      return
    }

    if (outcome === 'got-403') {
      setFeedback('A 403 can still be useful. It proves something exists there, so note it and keep exploring related paths or access patterns.')
      transitionToStage('next-step')
      return
    }

    setFeedback('Nothing found yet usually means the obvious guesses were not enough. Broaden the wordlist, vary extensions, and keep exploring adjacent paths.')
    transitionToStage('next-step')
  }

  const handleDiscoveryNextStep = () => {
    setFeedback('Keep exploring what you found and switch to other flows when the new content suggests login testing, decoding, or deeper inspection.')
    transitionToStage('next-step')
  }

  const handleEnumerationActionSelect = (action) => {
    setSelectedAction(action)
    clearFeedbackAndTransition('identify-service')
  }

  const handleEnumerationContinue = () => {
    clearFeedbackAndTransition('enumerate-service')
  }

  const handleEnumerationResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'found-users' || outcome === 'found-share' || outcome === 'found-config') {
      setFeedback('')
      transitionToStage('inspect-findings')
      return
    }

    setFeedback('Even when enumeration looks quiet, record the service details and try a different protocol-specific tool or script set before moving on.')
    transitionToStage('next-step')
  }

  const handleEnumerationNextStep = () => {
    setFeedback('Use the strongest finding as your next entry point: valid usernames, readable shares, config files, and protocol details often unlock the next flow.')
    transitionToStage('next-step')
  }

  const handleInputActionSelect = () => {
    setSelectedAction('test-input-handling')
    clearFeedbackAndTransition('test-input')
  }

  const handleInputContinue = () => {
    clearFeedbackAndTransition('response-change')
  }

  const handleInputResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'page-changed' || outcome === 'error-shown') {
      setFeedback('')
      transitionToStage('analyze-behavior')
      return
    }

    setFeedback('No visible difference can still mean filtering or normalization is happening behind the scenes, so keep comparing how different inputs are handled.')
    transitionToStage('next-step')
  }

  const handleInputNextStep = () => {
    setFeedback('The next step is to test for common input handling weaknesses, such as injection or filtering issues, or switch into a more specific flow based on what changed.')
    transitionToStage('next-step')
  }

  const handleResponseActionSelect = () => {
    setSelectedAction('inspect-response')
    clearFeedbackAndTransition('analyze-data')
  }

  const handleResponseContinue = () => {
    clearFeedbackAndTransition('interesting-data')
  }

  const handleResponseResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'found-token' || outcome === 'found-encoded-value') {
      setFeedback('')
      transitionToStage('investigate-value')
      return
    }

    setFeedback('If nothing stands out yet, keep comparing fields, formatting the response, and checking whether hidden values appear in related requests.')
    transitionToStage('next-step')
  }

  const handleResponseNextStep = () => {
    setFeedback('Use the data you found in follow-up requests, validation points, or another flow that matches the value type you discovered.')
    transitionToStage('next-step')
  }

  const handleRequestActionSelect = () => {
    setSelectedAction('modify-request')
    clearFeedbackAndTransition('tamper-request')
  }

  const handleRequestContinue = () => {
    clearFeedbackAndTransition('response-changed')
  }

  const handleRequestResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'different-data-returned' || outcome === 'error-message') {
      setFeedback('')
      transitionToStage('analyze-impact')
      return
    }

    setFeedback('No visible change can still be useful. Keep adjusting one part of the request at a time and compare IDs, headers, methods, or removed fields carefully.')
    transitionToStage('next-step')
  }

  const handleRequestNextStep = () => {
    setFeedback('Keep manipulating the request and combine this with input testing or enumeration flows when the behavior suggests deeper validation or access control issues.')
    transitionToStage('next-step')
  }

  const handleExploitationActionSelect = (action) => {
    setSelectedAction(action)
    clearFeedbackAndTransition('prepare-validation')
  }

  const handleExploitationContinue = () => {
    clearFeedbackAndTransition('execute-safely')
  }

  const handleExploitationResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'confirmed-impact' || outcome === 'partial-impact') {
      setFeedback('')
      transitionToStage('document-impact')
      return
    }

    setFeedback('Pause and tighten the validation plan before retrying. A clean proof matters more than forcing the result.')
    transitionToStage('next-step')
  }

  const handleExploitationNextStep = () => {
    setFeedback('Preserve the exact proof, record scope, and hand off clear remediation details so the issue can be fixed without repeating unnecessary impact.')
    transitionToStage('next-step')
  }

  const currentStageIndex = stageIndex[currentStage] ?? 0
  const currentStageNumber = currentFlow ? currentStageIndex + 1 : 0
  const totalStages = currentFlow?.stages.length ?? 0
  const currentStageLabel = currentFlow ? getStageLabel(currentFlow, currentStage) : ''
  const nextStageId = currentFlow ? currentFlow.stages[Math.min(currentStageIndex + 1, totalStages - 1)] : ''
  const nextStageLabel = currentFlow && currentStage !== 'start' && currentStageNumber < totalStages
    ? getStageLabel(currentFlow, nextStageId)
    : ''
  const sceneWidth = Math.round(BASE_SCENE_WIDTH * zoomLevel)
  const sceneHeight = Math.round(BASE_SCENE_HEIGHT * zoomLevel)

  const handleStageSelect = (stageId) => {
    transitionToStage(stageId)
  }

  const handlePreviousStage = () => {
    if (!currentFlow) {
      return
    }

    const previousStageId = currentFlow.stages[(stageIndex[currentStage] ?? 0) - 1]

    if (previousStageId) {
      handleStageSelect(previousStageId)
    }
  }

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
    handleStartClick,
    handleContinueToDecode,
    handleDecoderOpen,
    handleDecodeResultChoice,
    handleLoginActionSelect,
    handleLoginTestContinue,
    handleLoginResultChoice,
    handleLoginNextStep,
    handleDiscoveryActionSelect,
    handleDiscoveryEnumerate,
    handleDiscoveryResultChoice,
    handleDiscoveryNextStep,
    handleEnumerationActionSelect,
    handleEnumerationContinue,
    handleEnumerationResultChoice,
    handleEnumerationNextStep,
    handleInputActionSelect,
    handleInputContinue,
    handleInputResultChoice,
    handleInputNextStep,
    handleResponseActionSelect,
    handleResponseContinue,
    handleResponseResultChoice,
    handleResponseNextStep,
    handleRequestActionSelect,
    handleRequestContinue,
    handleRequestResultChoice,
    handleRequestNextStep,
    handleExploitationActionSelect,
    handleExploitationContinue,
    handleExploitationResultChoice,
    handleExploitationNextStep
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
                onClick={handlePreviousStage}
                disabled={currentStage === 'start'}
              >
                Back
              </button>
              <button type="button" className="flow-map-utility-button" onClick={resetFlowState}>
                Restart
              </button>
            </div>
            <div className="flow-map-progress-bar" aria-hidden="true">
              <span
                className="flow-map-progress-bar-fill"
                style={{ width: `${totalStages ? (currentStageIndex / (totalStages - 1)) * 100 : 0}%` }}
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
                    onClick={() => handleStageSelect(stageId)}
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

        <div
          ref={viewportRef}
          className={`flow-map-viewport${isDraggingViewport ? ' flow-map-viewport--dragging' : ''}`}
          onWheel={handleViewportWheel}
          onPointerDown={handleViewportPointerDown}
          onPointerMove={handleViewportPointerMove}
          onPointerUp={handleViewportPointerUp}
          onPointerCancel={stopViewportDrag}
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
                {currentFlow?.connections.map(([startId, endId]) => {
                  const startNode = currentFlow.nodes.find((node) => node.id === startId)
                  const endNode = currentFlow.nodes.find((node) => node.id === endId)
                  const startIndex = stageIndex[startId] ?? 0
                  const endIndex = stageIndex[endId] ?? 0

                  // Defensive guard: skip malformed connections if config changes accidentally.
                  if (!startNode || !endNode) {
                    return null
                  }

                  // Only render edges where both ends have been reached.
                  if (startIndex > currentStageIndex || endIndex > currentStageIndex) {
                    return null
                  }

                  // Highlight the edge that leads into the active node; all others are passed.
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
                })}
              </svg>

              {!currentFlow && (
                <div className="flow-map-empty-state">
              <span className="flow-map-empty-kicker">Flow category</span>
              <p>Select a flow from the active categories above to load its first node.</p>
            </div>
          )}

              {(currentFlow?.nodes ?? []).map((node) => {
                const isRevealed = (stageIndex[node.id] ?? Infinity) <= currentStageIndex
                const isCurrent = currentStage === node.id

                return (
                  <button
                    key={`${selectedFlow}-${node.id}`}
                    type="button"
                    className={`flow-map-node${isRevealed ? ' flow-map-node--active-path' : ''}${isCurrent ? ' flow-map-node--current' : ''}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onMouseMove={handleMapPointerMove}
                    onMouseLeave={resetMapPointerMove}
                    onClick={() => handleStageSelect(node.id)}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={node.label}
                  >
                    <span className="flow-map-node-content">
                      <span className="flow-map-node-dot" />
                      <span className="flow-map-node-label">{node.label}</span>
                    </span>
                  </button>
                )
              })}


            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
