import { useEffect, useMemo, useRef, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import './FlowMap.css'

const STORAGE_STAGE_KEY = 'flow-map-current-stage'
const STORAGE_REVEALED_KEY = 'flow-map-revealed-stage'
const STORAGE_TOOL_KEY = 'flow-map-selected-tool'
const STORAGE_FEEDBACK_KEY = 'flow-map-feedback'
const STORAGE_FLOW_KEY = 'flow-map-selected-flow'
const STORAGE_ACTION_KEY = 'flow-map-selected-action'
const STORAGE_OUTCOME_KEY = 'flow-map-selected-outcome'
const MIN_ZOOM = 0.8
const MAX_ZOOM = 1.8
const ZOOM_STEP = 0.15
const DEFAULT_ZOOM = 1
const BASE_SCENE_WIDTH = 1760
const BASE_SCENE_HEIGHT = 980
const FLOW_GROUPS = [
  ['main', 'Main Flows'],
  ['niche', 'Niche Flows']
]

const BACKGROUND_STARS = [
  { x: 8, y: 14, size: 2, opacity: 0.28 },
  { x: 18, y: 66, size: 2, opacity: 0.2 },
  { x: 27, y: 24, size: 3, opacity: 0.18 },
  { x: 39, y: 78, size: 2, opacity: 0.24 },
  { x: 48, y: 16, size: 2, opacity: 0.22 },
  { x: 57, y: 64, size: 3, opacity: 0.16 },
  { x: 69, y: 20, size: 2, opacity: 0.24 },
  { x: 78, y: 72, size: 2, opacity: 0.2 },
  { x: 86, y: 30, size: 3, opacity: 0.18 },
  { x: 93, y: 12, size: 2, opacity: 0.22 }
]

const FLOWS = {
  decode: {
    label: 'Decode Flow',
    group: 'niche',
    stages: ['start', 'encoded', 'decode', 'result', 'success'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'encoded', label: 'Encoded?', x: 34, y: 30 },
      { id: 'decode', label: 'Decode', x: 62, y: 30 },
      { id: 'result', label: 'Result?', x: 76, y: 50 },
      { id: 'success', label: 'Success', x: 88, y: 50 }
    ],
    connections: [
      ['start', 'encoded'],
      ['encoded', 'decode'],
      ['decode', 'result'],
      ['result', 'success']
    ]
  },
  login: {
    label: 'Login Flow',
    group: 'main',
    stages: ['start', 'login-page', 'test-login', 'result', 'analyze-error', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'login-page', label: 'Login Page', x: 34, y: 30 },
      { id: 'test-login', label: 'Test Login', x: 58, y: 30 },
      { id: 'result', label: 'Result?', x: 74, y: 50 },
      { id: 'analyze-error', label: 'Analyze Error', x: 84, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 58 }
    ],
    connections: [
      ['start', 'login-page'],
      ['login-page', 'test-login'],
      ['test-login', 'result'],
      ['result', 'analyze-error'],
      ['analyze-error', 'next-step']
    ]
  },
  discovery: {
    label: 'Discovery Flow',
    group: 'main',
    stages: ['start', 'web-page-found', 'discovery', 'enumerate', 'result', 'investigate', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'web-page-found', label: 'Web Page Found', x: 30, y: 30 },
      { id: 'discovery', label: 'Discovery', x: 50, y: 26 },
      { id: 'enumerate', label: 'Enumerate', x: 68, y: 32 },
      { id: 'result', label: 'Result?', x: 78, y: 50 },
      { id: 'investigate', label: 'Investigate', x: 86, y: 26 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'web-page-found'],
      ['web-page-found', 'discovery'],
      ['discovery', 'enumerate'],
      ['enumerate', 'result'],
      ['result', 'investigate'],
      ['investigate', 'next-step']
    ]
  },
  input: {
    label: 'Input Flow',
    group: 'main',
    stages: ['start', 'input-field-found', 'test-input', 'response-change', 'analyze-behavior', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'input-field-found', label: 'Input Field Found', x: 30, y: 30 },
      { id: 'test-input', label: 'Test Input', x: 54, y: 28 },
      { id: 'response-change', label: 'Response Change?', x: 72, y: 46 },
      { id: 'analyze-behavior', label: 'Analyze Behavior', x: 84, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'input-field-found'],
      ['input-field-found', 'test-input'],
      ['test-input', 'response-change'],
      ['response-change', 'analyze-behavior'],
      ['analyze-behavior', 'next-step']
    ]
  },
  response: {
    label: 'Response Flow',
    group: 'niche',
    stages: ['start', 'response-data-found', 'analyze-data', 'interesting-data', 'investigate-value', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'response-data-found', label: 'Response Data Found', x: 28, y: 30 },
      { id: 'analyze-data', label: 'Analyze Data', x: 50, y: 26 },
      { id: 'interesting-data', label: 'Interesting Data?', x: 70, y: 42 },
      { id: 'investigate-value', label: 'Investigate Value', x: 84, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'response-data-found'],
      ['response-data-found', 'analyze-data'],
      ['analyze-data', 'interesting-data'],
      ['interesting-data', 'investigate-value'],
      ['investigate-value', 'next-step']
    ]
  },
  request: {
    label: 'Request Flow',
    group: 'main',
    stages: ['start', 'http-request-observed', 'tamper-request', 'response-changed', 'analyze-impact', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'http-request-observed', label: 'HTTP Request Observed', x: 28, y: 30 },
      { id: 'tamper-request', label: 'Tamper Request', x: 52, y: 28 },
      { id: 'response-changed', label: 'Response Changed?', x: 72, y: 46 },
      { id: 'analyze-impact', label: 'Analyze Impact', x: 84, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'http-request-observed'],
      ['http-request-observed', 'tamper-request'],
      ['tamper-request', 'response-changed'],
      ['response-changed', 'analyze-impact'],
      ['analyze-impact', 'next-step']
    ]
  }
}

const DECODE_TOOLS = ['ROT', 'Base64', 'URL Encoder']

function getStoredValue(key, fallback = '') {
  return window.sessionStorage.getItem(key) ?? fallback
}

function getStoredRevealedStage() {
  const storedIndex = Number(window.sessionStorage.getItem(STORAGE_REVEALED_KEY) ?? 0)
  return Number.isFinite(storedIndex) ? Math.max(0, storedIndex) : 0
}

function getStoredFlowKey() {
  const storedFlow = window.sessionStorage.getItem(STORAGE_FLOW_KEY) ?? ''
  return storedFlow in FLOWS ? storedFlow : ''
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
  useSEO({
    title: 'Flow Map - Workflow Layout',
    description: 'Guided flow maps for decode and login workflows with browser-based tools and step-by-step paths.',
    keywords: 'flow map, decode flow, login flow, workflow ui, browser tools'
  })

  const [selectedFlow, setSelectedFlow] = useState(getStoredFlowKey)
  const [currentStage, setCurrentStage] = useState(() => getStoredValue(STORAGE_STAGE_KEY, 'start'))
  const [revealedStageIndex, setRevealedStageIndex] = useState(getStoredRevealedStage)
  const [selectedTool, setSelectedTool] = useState(() => getStoredValue(STORAGE_TOOL_KEY))
  const [feedback, setFeedback] = useState(() => getStoredValue(STORAGE_FEEDBACK_KEY))
  const [selectedAction, setSelectedAction] = useState(() => getStoredValue(STORAGE_ACTION_KEY))
  const [selectedOutcome, setSelectedOutcome] = useState(() => getStoredValue(STORAGE_OUTCOME_KEY))
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM)
  const viewportRef = useRef(null)

  const currentFlow = selectedFlow ? FLOWS[selectedFlow] : null
  const groupedFlows = useMemo(
    () => FLOW_GROUPS.map(([groupKey, groupLabel]) => ({
      key: groupKey,
      label: groupLabel,
      flows: Object.entries(FLOWS).filter(([, flow]) => flow.group === groupKey)
    })),
    []
  )
  const stageIndex = useMemo(
    () => Object.fromEntries((currentFlow?.stages ?? ['start']).map((stage, index) => [stage, index])),
    [currentFlow]
  )

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_FLOW_KEY, selectedFlow)
  }, [selectedFlow])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_STAGE_KEY, currentStage)
  }, [currentStage])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_REVEALED_KEY, String(revealedStageIndex))
  }, [revealedStageIndex])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_TOOL_KEY, selectedTool)
  }, [selectedTool])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_FEEDBACK_KEY, feedback)
  }, [feedback])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_ACTION_KEY, selectedAction)
  }, [selectedAction])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_OUTCOME_KEY, selectedOutcome)
  }, [selectedOutcome])

  useEffect(() => {
    if (!currentFlow) {
      return
    }

    if (!(currentStage in stageIndex)) {
      setCurrentStage('start')
      setRevealedStageIndex(0)
    }
  }, [currentFlow, currentStage, stageIndex])

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
    setCurrentStage('start')
    setRevealedStageIndex(0)
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

  const goToStage = (nextStage) => {
    const nextIndex = stageIndex[nextStage] ?? 0
    setCurrentStage(nextStage)
    setRevealedStageIndex((previousIndex) => Math.max(previousIndex, nextIndex))
  }

  const handleStartClick = () => {
    setFeedback('')

    if (selectedFlow === 'login') {
      goToStage('login-page')
      return
    }

    if (selectedFlow === 'discovery') {
      goToStage('web-page-found')
      return
    }

    if (selectedFlow === 'input') {
      goToStage('input-field-found')
      return
    }

    if (selectedFlow === 'response') {
      goToStage('response-data-found')
      return
    }

    if (selectedFlow === 'request') {
      goToStage('http-request-observed')
      return
    }

    goToStage('encoded')
  }

  const handleContinueToDecode = () => {
    setFeedback('')
    goToStage('decode')
  }

  const handleDecoderOpen = (toolName) => {
    setSelectedTool(toolName)
    setFeedback(`You opened ${toolName}. Come back here after trying it, then choose what result you got.`)
    goToStage('result')
    onToolClick(toolName)
  }

  const handleDecodeResultChoice = (choice) => {
    if (choice === 'readable') {
      setFeedback('')
      goToStage('success')
      return
    }

    if (choice === 'still-encoded') {
      setFeedback('The output still looks encoded. Try another simple decoder and compare the result.')
      goToStage('decode')
      return
    }

    setFeedback('The output looks random. That usually means the wrong decoder or the wrong input format, so try another decoder next.')
    goToStage('decode')
  }

  const handleLoginActionSelect = (action) => {
    setSelectedAction(action)
    setFeedback('')
    goToStage('test-login')
  }

  const handleLoginTestContinue = () => {
    setFeedback('')
    goToStage('result')
  }

  const handleLoginResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'error-message') {
      goToStage('analyze-error')
      return
    }

    if (outcome === 'login-success') {
      setFeedback('A basic or default login working is already a strong sign of weak authentication and should be validated carefully.')
      goToStage('next-step')
      return
    }

    setFeedback('No visible change does not mean the login is safe. Small input changes, timing differences, and hidden validation issues can still matter.')
    goToStage('next-step')
  }

  const handleLoginNextStep = () => {
    setFeedback('Different login behaviors can reveal weaknesses, so the next step is to test basic injection or bypass ideas carefully.')
    goToStage('next-step')
  }

  const handleDiscoveryActionSelect = () => {
    setSelectedAction('hidden-content')
    setFeedback('')
    goToStage('discovery')
  }

  const handleDiscoveryEnumerate = () => {
    setFeedback('')
    goToStage('enumerate')
  }

  const handleDiscoveryResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'found-endpoint') {
      setFeedback('')
      goToStage('investigate')
      return
    }

    if (outcome === 'got-403') {
      setFeedback('A 403 can still be useful. It proves something exists there, so note it and keep exploring related paths or access patterns.')
      goToStage('next-step')
      return
    }

    setFeedback('Nothing found yet usually means the obvious guesses were not enough. Broaden the wordlist, vary extensions, and keep exploring adjacent paths.')
    goToStage('next-step')
  }

  const handleDiscoveryNextStep = () => {
    setFeedback('Keep exploring what you found and switch to other flows when the new content suggests login testing, decoding, or deeper inspection.')
    goToStage('next-step')
  }

  const handleInputActionSelect = () => {
    setSelectedAction('test-input-handling')
    setFeedback('')
    goToStage('test-input')
  }

  const handleInputContinue = () => {
    setFeedback('')
    goToStage('response-change')
  }

  const handleInputResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'page-changed' || outcome === 'error-shown') {
      setFeedback('')
      goToStage('analyze-behavior')
      return
    }

    setFeedback('No visible difference can still mean filtering or normalization is happening behind the scenes, so keep comparing how different inputs are handled.')
    goToStage('next-step')
  }

  const handleInputNextStep = () => {
    setFeedback('The next step is to test for common input handling weaknesses, such as injection or filtering issues, or switch into a more specific flow based on what changed.')
    goToStage('next-step')
  }

  const handleResponseActionSelect = () => {
    setSelectedAction('inspect-response')
    setFeedback('')
    goToStage('analyze-data')
  }

  const handleResponseContinue = () => {
    setFeedback('')
    goToStage('interesting-data')
  }

  const handleResponseResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'found-token' || outcome === 'found-encoded-value') {
      setFeedback('')
      goToStage('investigate-value')
      return
    }

    setFeedback('If nothing stands out yet, keep comparing fields, formatting the response, and checking whether hidden values appear in related requests.')
    goToStage('next-step')
  }

  const handleResponseNextStep = () => {
    setFeedback('Use the data you found in follow-up requests, validation points, or another flow that matches the value type you discovered.')
    goToStage('next-step')
  }

  const handleRequestActionSelect = () => {
    setSelectedAction('modify-request')
    setFeedback('')
    goToStage('tamper-request')
  }

  const handleRequestContinue = () => {
    setFeedback('')
    goToStage('response-changed')
  }

  const handleRequestResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'different-data-returned' || outcome === 'error-message') {
      setFeedback('')
      goToStage('analyze-impact')
      return
    }

    setFeedback('No visible change can still be useful. Keep adjusting one part of the request at a time and compare IDs, headers, methods, or removed fields carefully.')
    goToStage('next-step')
  }

  const handleRequestNextStep = () => {
    setFeedback('Keep manipulating the request and combine this with input testing or enumeration flows when the behavior suggests deeper validation or access control issues.')
    goToStage('next-step')
  }

  const renderDecodeStoryContent = () => {
    if (currentStage === 'encoded') {
      return (
        <>
          <span className="flow-map-story-step">Step 2</span>
          <h2>Encoded?</h2>
          <p>You found a suspicious string: <strong>uryyb</strong> — this might be encoded data.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleContinueToDecode}>
              Try decoding
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
              Reset flow
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'decode') {
      return (
        <>
          <span className="flow-map-story-step">Step 3</span>
          <h2>Decode</h2>
          <p>Use a simple decoder first. Try ROT, Base64, or URL decode and see if the suspicious string becomes readable.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            {DECODE_TOOLS.map((toolName) => (
              <button
                key={toolName}
                type="button"
                className="flow-map-button"
                onClick={() => handleDecoderOpen(toolName)}
              >
                Open {toolName}
              </button>
            ))}
          </div>
          {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
        </>
      )
    }

    if (currentStage === 'result') {
      return (
        <>
          <span className="flow-map-story-step">Step 4</span>
          <h2>Result?</h2>
          <p>
            {selectedTool
              ? `After trying ${selectedTool}, choose the result that matches what you saw.`
              : 'Choose the result that best matches what you got back from the decoder.'}
          </p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleDecodeResultChoice('readable')}>
              Readable text
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleDecodeResultChoice('still-encoded')}>
              Still encoded
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleDecodeResultChoice('random')}>
              Random output
            </button>
          </div>
          {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
        </>
      )
    }

    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Success</h2>
        <p>You decoded the string (<strong>hello</strong>) — this could be a flag, password, or key; next step is to use it in input fields or validation points.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={resetFlowState}>
            Restart flow
          </button>
        </div>
      </>
    )
  }

  const renderLoginStoryContent = () => {
    if (currentStage === 'login-page') {
      return (
        <>
          <span className="flow-map-story-step">Step 2</span>
          <h2>Login Page</h2>
          <p>You found a login form on a web page. Start simple and choose how you want to probe the behavior first.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleLoginActionSelect('common-creds')}>
              Try common/default credentials
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleLoginActionSelect('input-behavior')}>
              Test input behavior
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'test-login') {
      const description = selectedAction === 'input-behavior'
        ? 'Try basic usernames and passwords, then use slight variations and watch for changes in messaging, timing, or validation behavior.'
        : 'Start with simple combinations like admin/admin or admin/password, then try slight variations such as admin/admin123 or blank values.'

      return (
        <>
          <span className="flow-map-story-step">Step 3</span>
          <h2>Test Login</h2>
          <p>{description}</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleLoginTestContinue}>
              Continue to result
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
              Reset flow
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'result') {
      return (
        <>
          <span className="flow-map-story-step">Step 4</span>
          <h2>Result?</h2>
          <p>Choose what happened after testing the login form so the flow can guide the next branch.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleLoginResultChoice('login-success')}>
              Login success
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleLoginResultChoice('error-message')}>
              Error message
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleLoginResultChoice('no-change')}>
              No change
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'analyze-error') {
      return (
        <>
          <span className="flow-map-story-step">Step 5</span>
          <h2>Analyze Error</h2>
          <p>Look for differences like wrong username versus wrong password responses. Even small wording or timing changes can reveal useful behavior in the login logic.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleLoginNextStep}>
              Continue to next step
            </button>
          </div>
        </>
      )
    }

    const nextStepCopy = selectedOutcome === 'login-success'
      ? 'A successful login with simple credentials points to a real weakness. Next, verify what access was gained and whether weak defaults can be repeated elsewhere.'
      : selectedOutcome === 'error-message'
        ? 'Different login errors can reveal weakness in how authentication is checked. The next step is to test basic injection or bypass ideas and compare responses carefully.'
        : 'Even without visible changes, login behavior should still be tested further. Small bypass attempts or basic injection checks may expose weaknesses hidden behind generic responses.'

    return (
      <>
        <span className="flow-map-story-step">Step 6</span>
        <h2>Next Step</h2>
        <p>{nextStepCopy}</p>
        {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={resetFlowState}>
            Restart flow
          </button>
        </div>
      </>
    )
  }

  const renderDiscoveryStoryContent = () => {
    if (currentStage === 'web-page-found') {
      return (
        <>
          <span className="flow-map-story-step">Step 2</span>
          <h2>Web Page Found</h2>
          <p>You discovered a website or endpoint but nothing obvious is visible. Start by looking for hidden content that may not be linked directly.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleDiscoveryActionSelect}>
              Look for hidden content
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
              Reset flow
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'discovery') {
      return (
        <>
          <span className="flow-map-story-step">Step 3</span>
          <h2>Discovery</h2>
          <p>Check common paths, hidden files, backup names, and likely directories. A wordlist-based approach often reveals pages or files that are not visible in normal navigation.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleDiscoveryEnumerate}>
              Continue to enumerate
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'enumerate') {
      return (
        <>
          <span className="flow-map-story-step">Step 4</span>
          <h2>Enumerate</h2>
          <p>Try directory or file discovery with a wordlist-based workflow, such as using ffuf or manually guessing paths and extensions, then compare what changes in the responses.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={() => goToStage('result')}>
              Continue to result
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'result') {
      return (
        <>
          <span className="flow-map-story-step">Step 5</span>
          <h2>Result?</h2>
          <p>Select the outcome that best matches what happened during discovery so the flow can guide the next move.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleDiscoveryResultChoice('found-endpoint')}>
              Found new endpoint
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleDiscoveryResultChoice('got-403')}>
              Got forbidden / 403
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleDiscoveryResultChoice('nothing-found')}>
              Nothing found
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'investigate') {
      return (
        <>
          <span className="flow-map-story-step">Step 6</span>
          <h2>Investigate</h2>
          <p>Open the new endpoint, inspect the content, and look for clues such as parameters, downloadable files, references to hidden areas, or flag-like values.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleDiscoveryNextStep}>
              Continue to next step
            </button>
          </div>
        </>
      )
    }

    const nextStepCopy = selectedOutcome === 'found-endpoint'
      ? 'Keep exploring the content you discovered, then apply other flows if the new page suggests login testing, decoding, or deeper analysis.'
      : selectedOutcome === 'got-403'
        ? 'A forbidden response still reveals useful structure. Continue exploration around that area and apply other flows if the endpoint suggests authentication or hidden content.'
        : 'If nothing useful appeared yet, expand the discovery approach and keep exploring nearby paths. Switch to other flows when new clues appear.'

    return (
      <>
        <span className="flow-map-story-step">Step 7</span>
        <h2>Next Step</h2>
        <p>{nextStepCopy}</p>
        {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={resetFlowState}>
            Restart flow
          </button>
        </div>
      </>
    )
  }

  const renderInputStoryContent = () => {
    if (currentStage === 'input-field-found') {
      return (
        <>
          <span className="flow-map-story-step">Step 2</span>
          <h2>Input Field Found</h2>
          <p>You found a search box, form, or URL parameter that accepts user input. Start by checking how the application handles simple input changes.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleInputActionSelect}>
              Test how input is handled
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
              Reset flow
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'test-input') {
      return (
        <>
          <span className="flow-map-story-step">Step 3</span>
          <h2>Test Input</h2>
          <p>Enter simple values like normal text, special characters, or quotes such as <strong>&apos;</strong> or <strong>&quot;</strong> and watch how the page reacts.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleInputContinue}>
              Continue to response check
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'response-change') {
      return (
        <>
          <span className="flow-map-story-step">Step 4</span>
          <h2>Response Change?</h2>
          <p>Select the outcome that best matches what happened after you tested the input field.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleInputResultChoice('page-changed')}>
              Page changed
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleInputResultChoice('error-shown')}>
              Error shown
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleInputResultChoice('no-difference')}>
              No difference
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'analyze-behavior') {
      return (
        <>
          <span className="flow-map-story-step">Step 5</span>
          <h2>Analyze Behavior</h2>
          <p>A visible page change or error can indicate improper input handling. Compare responses carefully and consider trying structured inputs or encoded variations to learn how the field is processed.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleInputNextStep}>
              Continue to next step
            </button>
          </div>
        </>
      )
    }

    const nextStepCopy = selectedOutcome === 'no-difference'
      ? 'Even when nothing obvious changes, keep testing for common filtering issues or move into a more specific flow if later responses reveal more clues.'
      : 'Use what you observed to test for common vulnerabilities like injection or filtering issues, or switch into a more specific flow that matches the response behavior.'

    return (
      <>
        <span className="flow-map-story-step">Step 6</span>
        <h2>Next Step</h2>
        <p>{nextStepCopy}</p>
        {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={resetFlowState}>
            Restart flow
          </button>
        </div>
      </>
    )
  }

  const renderResponseStoryContent = () => {
    if (currentStage === 'response-data-found') {
      return (
        <>
          <span className="flow-map-story-step">Step 2</span>
          <h2>Response Data Found</h2>
          <p>You received a response from a server, API, request, or page that contains structured or unusual data. Start by inspecting the response closely.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleResponseActionSelect}>
              Inspect the response
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
              Reset flow
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'analyze-data') {
      return (
        <>
          <span className="flow-map-story-step">Step 3</span>
          <h2>Analyze Data</h2>
          <p>Look for patterns such as JSON structures, tokens, encoded values, IDs, hidden fields, or anything that seems reusable in later requests.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleResponseContinue}>
              Continue to data check
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'interesting-data') {
      return (
        <>
          <span className="flow-map-story-step">Step 4</span>
          <h2>Interesting Data?</h2>
          <p>Select the outcome that best matches what you found in the response.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleResponseResultChoice('found-token')}>
              Found token
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleResponseResultChoice('found-encoded-value')}>
              Found encoded value
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleResponseResultChoice('nothing-useful')}>
              Nothing useful
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'investigate-value') {
      return (
        <>
          <span className="flow-map-story-step">Step 5</span>
          <h2>Investigate Value</h2>
          <p>Try decoding, formatting, or identifying the value type. Check whether it looks like a JWT, Base64 blob, JSON object, token, or another reusable value with a clear purpose.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleResponseNextStep}>
              Continue to next step
            </button>
          </div>
        </>
      )
    }

    const nextStepCopy = selectedOutcome === 'nothing-useful'
      ? 'Keep reviewing related responses and compare values across requests. If more structure appears later, move into a more specific flow.'
      : 'Use the data you discovered in further requests, validation points, or another flow depending on whether it behaves like a token, encoded value, or structured object.'

    return (
      <>
        <span className="flow-map-story-step">Step 6</span>
        <h2>Next Step</h2>
        <p>{nextStepCopy}</p>
        {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={resetFlowState}>
            Restart flow
          </button>
        </div>
      </>
    )
  }

  const renderRequestStoryContent = () => {
    if (currentStage === 'http-request-observed') {
      return (
        <>
          <span className="flow-map-story-step">Step 2</span>
          <h2>HTTP Request Observed</h2>
          <p>You captured or noticed a request being sent to the server. Start by choosing whether you want to modify the request and see how the application reacts.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleRequestActionSelect}>
              Modify the request
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
              Reset flow
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'tamper-request') {
      return (
        <>
          <span className="flow-map-story-step">Step 3</span>
          <h2>Tamper Request</h2>
          <p>Change one part of the request at a time. Try adjusting parameters, headers, IDs, or values such as <strong>id=1</strong> to <strong>id=2</strong>, or remove and alter fields to compare the server response.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleRequestContinue}>
              Continue to response check
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'response-changed') {
      return (
        <>
          <span className="flow-map-story-step">Step 4</span>
          <h2>Response Changed?</h2>
          <p>Select the outcome that best matches what happened after you modified the request.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleRequestResultChoice('different-data-returned')}>
              Different data returned
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleRequestResultChoice('error-message')}>
              Error message
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleRequestResultChoice('no-change')}>
              No change
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'analyze-impact') {
      return (
        <>
          <span className="flow-map-story-step">Step 5</span>
          <h2>Analyze Impact</h2>
          <p>A changed response or error can indicate weak validation, missing access control, or trust in client-controlled values. Keep testing careful variations to learn what the server is really checking.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleRequestNextStep}>
              Continue to next step
            </button>
          </div>
        </>
      )
    }

    const nextStepCopy = selectedOutcome === 'no-change'
      ? 'Keep manipulating the request and compare one change at a time. If later responses shift, move into deeper testing with input or enumeration flows.'
      : 'Continue manipulating requests and combine what you learned with other flows like input testing or enumeration to deepen the finding.'

    return (
      <>
        <span className="flow-map-story-step">Step 6</span>
        <h2>Next Step</h2>
        <p>{nextStepCopy}</p>
        {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={resetFlowState}>
            Restart flow
          </button>
        </div>
      </>
    )
  }

  const renderStoryContent = () => {
    if (selectedFlow === 'login') {
      return renderLoginStoryContent()
    }

    if (selectedFlow === 'discovery') {
      return renderDiscoveryStoryContent()
    }

    if (selectedFlow === 'input') {
      return renderInputStoryContent()
    }

    if (selectedFlow === 'response') {
      return renderResponseStoryContent()
    }

    if (selectedFlow === 'request') {
      return renderRequestStoryContent()
    }

    return renderDecodeStoryContent()
  }

  const visibleNodes = currentFlow
    ? currentFlow.nodes.filter((node) => (stageIndex[node.id] ?? 0) <= revealedStageIndex)
    : []
  const activeNode = currentFlow?.nodes.find((node) => node.id === currentStage) ?? null
  const storyPosition = activeNode
    ? {
        left: `${Math.min(Math.max(activeNode.x, 24), 76)}%`,
        top: `${Math.min(activeNode.y + 9, 62)}%`
      }
    : null
  const sceneWidth = Math.round(BASE_SCENE_WIDTH * zoomLevel)
  const sceneHeight = Math.round(BASE_SCENE_HEIGHT * zoomLevel)

  return (
    <div className="tool-page flow-map-page">
      <div className="tool-header flow-map-header">
        <span className="flow-map-kicker">Workflow view</span>
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

      <section className="flow-map-stage" aria-label="Flow map canvas">
        <div className="flow-map-toolbar">
          <p className="flow-map-toolbar-copy">Scroll to explore the map. Hold Ctrl or Cmd while scrolling to zoom.</p>
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

        <div ref={viewportRef} className="flow-map-viewport" onWheel={handleViewportWheel}>
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

                  if ((stageIndex[startId] ?? 0) > revealedStageIndex || (stageIndex[endId] ?? 0) > revealedStageIndex) {
                    return null
                  }

                  return (
                    <line
                      key={`${selectedFlow}-${startId}-${endId}`}
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
                  <p>Select a flow above to load its first node.</p>
                </div>
              )}

              {visibleNodes.map((node) => {
                const isActive = currentStage === node.id
                const isComplete = (stageIndex[node.id] ?? 0) < (stageIndex[currentStage] ?? 0)
                const isClickable = node.id === 'start' && currentStage === 'start'

                return (
                  <button
                    key={`${selectedFlow}-${node.id}`}
                    type="button"
                    className={`flow-map-node${isActive ? ' flow-map-node--active' : ''}${isComplete ? ' flow-map-node--complete' : ''}${isClickable ? ' flow-map-node--clickable' : ''}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onMouseMove={handleMapPointerMove}
                    onMouseLeave={resetMapPointerMove}
                    onClick={isClickable ? handleStartClick : undefined}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={node.label}
                  >
                    <span className="flow-map-node-content">
                      <span className="flow-map-node-dot" />
                      <span className="flow-map-node-label">{node.label}</span>
                    </span>
                  </button>
                )
              })}

              {currentFlow && currentStage !== 'start' && storyPosition && (
                <div className="flow-map-story-overlay" style={storyPosition}>
                  <div className={`flow-map-story${currentStage === 'success' || currentStage === 'next-step' ? ' flow-map-story--success' : ''}`}>
                    {renderStoryContent()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
