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
const BASE_SCENE_WIDTH = 2200
const BASE_SCENE_HEIGHT = 1240
const FLOW_GROUPS = [
  ['recon', 'Recon Flows'],
  ['enumeration', 'Enumeration Flows'],
  ['entry-point', 'Entry Point Flows'],
  ['testing', 'Testing Flows'],
  ['vulnerability', 'Vulnerability Flows'],
  ['exploitation', 'Exploitation Flows'],
  // ['main', 'Main Flows'],
  // ['niche', 'Niche Flows']
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
    summary: 'Follow a suspicious value from first glance to readable output using lightweight decoders.',
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
    label: 'Login Entry Flow',
    group: 'entry-point',
    summary: 'Assess a discovered login page as a possible entry point and keep the next branch obvious as responses change.',
    tools: [
      { name: 'Browser DevTools', purpose: 'Inspect form behavior, requests, and front-end validation before deeper testing.' },
      { name: 'Burp Suite', purpose: 'Intercept and replay login requests so you can compare auth behavior carefully.' },
      { name: 'curl', purpose: 'Recreate simple auth requests outside the browser when you want cleaner response comparisons.' }
    ],
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
    group: 'recon',
    summary: 'Start from a newly found page or endpoint, enumerate hidden content, and branch into follow-up investigation with common recon tooling.',
    tools: [
      { name: 'Nmap', purpose: 'Find open ports, services, and basic version details before you start guessing paths.' },
      { name: 'ffuf', purpose: 'Run fast wordlist-based discovery for directories, files, vhosts, and parameter fuzzing.' },
      { name: 'dirb', purpose: 'Quickly brute-force common directories and filenames when you want a simpler pass.' },
      { name: 'curl', purpose: 'Inspect status codes, headers, redirects, and raw responses from anything you discover.' }
    ],
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
  enumeration: {
    label: 'Enumeration Flow',
    group: 'enumeration',
    summary: 'Identify exposed services, enumerate them with the right protocol-aware tools, and decide which finding becomes the next entry point.',
    tools: [
      { name: 'Nmap', purpose: 'Identify exposed ports, service versions, and useful NSE script output before deeper enumeration.' },
      { name: 'enum4linux-ng', purpose: 'Pull users, shares, and policy details from SMB-heavy targets.' },
      { name: 'smbclient', purpose: 'Browse accessible SMB shares and validate whether files or directories can be reached directly.' },
      { name: 'snmpwalk', purpose: 'Dump readable SNMP data when the target exposes community strings or weak SNMP access.' },
      { name: 'ldapsearch', purpose: 'Query LDAP-backed services for users, groups, and directory structure.' }
    ],
    stages: ['start', 'service-found', 'identify-service', 'enumerate-service', 'result', 'inspect-findings', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'service-found', label: 'Service Found', x: 28, y: 30 },
      { id: 'identify-service', label: 'Identify Service', x: 48, y: 26 },
      { id: 'enumerate-service', label: 'Enumerate Service', x: 68, y: 30 },
      { id: 'result', label: 'Result?', x: 78, y: 50 },
      { id: 'inspect-findings', label: 'Inspect Findings', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'service-found'],
      ['service-found', 'identify-service'],
      ['identify-service', 'enumerate-service'],
      ['enumerate-service', 'result'],
      ['result', 'inspect-findings'],
      ['inspect-findings', 'next-step']
    ]
  },
  input: {
    label: 'Input Testing Flow',
    group: 'testing',
    summary: 'Test how a field handles normal and unusual values, compare responses, and decide which behavior is worth deeper follow-up.',
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay parameter changes quickly and compare how the target handles each input.' },
      { name: 'Browser DevTools', purpose: 'Watch DOM, console, and network changes while the page processes your input.' },
      { name: 'curl', purpose: 'Send controlled requests with isolated values when you want cleaner server-side comparisons.' }
    ],
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
    summary: 'Inspect response data, identify useful values, and decide what to investigate next.',
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
    label: 'Request Tampering Flow',
    group: 'vulnerability',
    summary: 'Modify observed requests, compare server reactions, and decide whether the behavior points to a real vulnerability path.',
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Modify one request component at a time and compare responses with minimal noise.' },
      { name: 'curl', purpose: 'Reproduce and script request changes once you know which fields matter.' },
      { name: 'Browser DevTools', purpose: 'Inspect the original request shape, tokens, and front-end hints before tampering.' }
    ],
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
  },
  exploitation: {
    label: 'Controlled Exploitation Flow',
    group: 'exploitation',
    summary: 'Move from a confirmed finding to a controlled proof-of-impact in an authorized environment without losing containment or evidence.',
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay the exact proof request in a controlled way and confirm only the intended impact.' },
      { name: 'curl', purpose: 'Capture a minimal reproducible request that demonstrates the issue cleanly for verification.' },
      { name: 'Browser DevTools', purpose: 'Observe application-side effects, responses, and state changes while you validate impact.' }
    ],
    stages: ['start', 'confirmed-finding', 'prepare-validation', 'execute-safely', 'impact-observed', 'document-impact', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'confirmed-finding', label: 'Confirmed Finding', x: 28, y: 30 },
      { id: 'prepare-validation', label: 'Prepare Validation', x: 48, y: 26 },
      { id: 'execute-safely', label: 'Execute Safely', x: 68, y: 30 },
      { id: 'impact-observed', label: 'Impact Observed?', x: 78, y: 50 },
      { id: 'document-impact', label: 'Document Impact', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'confirmed-finding'],
      ['confirmed-finding', 'prepare-validation'],
      ['prepare-validation', 'execute-safely'],
      ['execute-safely', 'impact-observed'],
      ['impact-observed', 'document-impact'],
      ['document-impact', 'next-step']
    ]
  }
}

const DECODE_TOOLS = ['ROT', 'Base64', 'URL Encoder']
const ACTIVE_FLOW_GROUP_KEYS = new Set(FLOW_GROUPS.map(([groupKey]) => groupKey))

function getStageLabel(flow, stageId) {
  return flow?.nodes.find((node) => node.id === stageId)?.label ?? stageId
}

function getStoredValue(key, fallback = '') {
  return window.sessionStorage.getItem(key) ?? fallback
}

function getStoredRevealedStage() {
  const storedIndex = Number(window.sessionStorage.getItem(STORAGE_REVEALED_KEY) ?? 0)
  return Number.isFinite(storedIndex) ? Math.max(0, storedIndex) : 0
}

function getStoredFlowKey() {
  const storedFlow = window.sessionStorage.getItem(STORAGE_FLOW_KEY) ?? ''
  return storedFlow in FLOWS && ACTIVE_FLOW_GROUP_KEYS.has(FLOWS[storedFlow].group) ? storedFlow : ''
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
    description: 'Guided flow maps for recon, enumeration, entry-point, testing, vulnerability, and exploitation workflows.',
    keywords: 'flow map, recon flow, enumeration flow, entry point flow, testing flow, vulnerability flow, exploitation flow'
  })

  const [selectedFlow, setSelectedFlow] = useState(getStoredFlowKey)
  const [currentStage, setCurrentStage] = useState(() => {
    const storedFlow = getStoredFlowKey()
    const storedStage = getStoredValue(STORAGE_STAGE_KEY, 'start')
    if (!storedFlow) return storedStage
    const flow = FLOWS[storedFlow]
    return flow && !flow.stages.includes(storedStage) ? 'start' : storedStage
  })
  const [revealedStageIndex, setRevealedStageIndex] = useState(() => {
    const storedFlow = getStoredFlowKey()
    const storedStage = getStoredValue(STORAGE_STAGE_KEY, 'start')
    if (storedFlow) {
      const flow = FLOWS[storedFlow]
      if (flow && !flow.stages.includes(storedStage)) return 0
    }
    return getStoredRevealedStage()
  })
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

  const currentFlow = selectedFlow ? FLOWS[selectedFlow] : null
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

    if (selectedFlow === 'enumeration') {
      goToStage('service-found')
      return
    }

    if (selectedFlow === 'exploitation') {
      goToStage('confirmed-finding')
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

  const handleEnumerationActionSelect = (action) => {
    setSelectedAction(action)
    setFeedback('')
    goToStage('identify-service')
  }

  const handleEnumerationContinue = () => {
    setFeedback('')
    goToStage('enumerate-service')
  }

  const handleEnumerationResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'found-users' || outcome === 'found-share' || outcome === 'found-config') {
      setFeedback('')
      goToStage('inspect-findings')
      return
    }

    setFeedback('Even when enumeration looks quiet, record the service details and try a different protocol-specific tool or script set before moving on.')
    goToStage('next-step')
  }

  const handleEnumerationNextStep = () => {
    setFeedback('Use the strongest finding as your next entry point: valid usernames, readable shares, config files, and protocol details often unlock the next flow.')
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

  const handleExploitationActionSelect = (action) => {
    setSelectedAction(action)
    setFeedback('')
    goToStage('prepare-validation')
  }

  const handleExploitationContinue = () => {
    setFeedback('')
    goToStage('execute-safely')
  }

  const handleExploitationResultChoice = (outcome) => {
    setSelectedOutcome(outcome)

    if (outcome === 'confirmed-impact' || outcome === 'partial-impact') {
      setFeedback('')
      goToStage('document-impact')
      return
    }

    setFeedback('Pause and tighten the validation plan before retrying. A clean proof matters more than forcing the result.')
    goToStage('next-step')
  }

  const handleExploitationNextStep = () => {
    setFeedback('Preserve the exact proof, record scope, and hand off clear remediation details so the issue can be fixed without repeating unnecessary impact.')
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
          <p>You discovered a website or endpoint but nothing obvious is visible. Start by checking host and service exposure with <strong>Nmap</strong>, then move into hidden content discovery.</p>
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
          <p>Check common paths, hidden files, backup names, and likely directories. Tools like <strong>ffuf</strong> or <strong>dirb</strong> make this faster by applying wordlists against likely routes and filenames.</p>
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
          <p>Run directory or file discovery with <strong>ffuf</strong> or <strong>dirb</strong>, and use <strong>curl</strong> to confirm status codes, redirects, headers, and response differences for interesting hits.</p>
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

  const renderEnumerationStoryContent = () => {
    if (currentStage === 'service-found') {
      return (
        <>
          <span className="flow-map-story-step">Step 2</span>
          <h2>Service Found</h2>
          <p>You found an exposed service or host worth exploring. Choose the service family first so the flow can point you toward the most useful enumeration path.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleEnumerationActionSelect('smb')}>
              SMB or Windows service
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationActionSelect('directory')}>
              LDAP or directory service
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationActionSelect('network')}>
              SNMP or generic network service
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'identify-service') {
      const description = selectedAction === 'smb'
        ? 'Confirm SMB versions, shares, and account exposure with Nmap scripts, enum4linux-ng, and smbclient.'
        : selectedAction === 'directory'
          ? 'Confirm bind options, naming context, and exposed users or groups with ldapsearch and basic service fingerprinting.'
          : 'Confirm ports, banners, and protocol details with Nmap plus service-aware checks like snmpwalk when they fit the target.'

      return (
        <>
          <span className="flow-map-story-step">Step 3</span>
          <h2>Identify Service</h2>
          <p>{description}</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleEnumerationContinue}>
              Continue to enumeration
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
              Reset flow
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'enumerate-service') {
      return (
        <>
          <span className="flow-map-story-step">Step 4</span>
          <h2>Enumerate Service</h2>
          <p>Pull concrete data now: usernames, shares, naming contexts, community strings, version details, or readable files that can become your next foothold.</p>
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
          <p>Select the strongest thing you uncovered during enumeration so the flow can steer the follow-up.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleEnumerationResultChoice('found-users')}>
              Found usernames or groups
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationResultChoice('found-share')}>
              Found accessible share or files
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationResultChoice('found-config')}>
              Found config or version detail
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationResultChoice('nothing-useful')}>
              Nothing useful yet
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'inspect-findings') {
      return (
        <>
          <span className="flow-map-story-step">Step 6</span>
          <h2>Inspect Findings</h2>
          <p>Validate what you found and decide how it can be reused. Usernames can feed login testing, shares can expose credentials or code, and config details can reveal the right vulnerability path.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleEnumerationNextStep}>
              Continue to next step
            </button>
          </div>
        </>
      )
    }

    const nextStepCopy = selectedOutcome === 'nothing-useful'
      ? 'Try another enumeration angle, widen the script set, or pivot back into recon until a better service or host stands out.'
      : 'Take the best artifact you found and pivot into the matching flow, such as an entry point, testing, or vulnerability path.'

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

  const renderExploitationStoryContent = () => {
    if (currentStage === 'confirmed-finding') {
      return (
        <>
          <span className="flow-map-story-step">Step 2</span>
          <h2>Confirmed Finding</h2>
          <p>You already have a validated issue in an authorized target. Start by deciding how to prove impact with the least-disruptive action that still demonstrates the problem clearly.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleExploitationActionSelect('read-only-proof')}>
              Use a read-only proof
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleExploitationActionSelect('bounded-change')}>
              Use a tightly bounded change
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'prepare-validation') {
      const description = selectedAction === 'bounded-change'
        ? 'Define the smallest allowed state change, how you will verify it, and how you will restore the target immediately after the proof.'
        : 'Use a minimal request or interaction that reveals the issue without changing data when possible, and capture exactly what success will look like.'

      return (
        <>
          <span className="flow-map-story-step">Step 3</span>
          <h2>Prepare Validation</h2>
          <p>{description}</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleExploitationContinue}>
              Continue to execution
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
              Reset flow
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'execute-safely') {
      return (
        <>
          <span className="flow-map-story-step">Step 4</span>
          <h2>Execute Safely</h2>
          <p>Run the proof once in a controlled way, watch the exact response, and avoid broad or repeated actions that go beyond the approved validation plan.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={() => goToStage('impact-observed')}>
              Continue to result
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'impact-observed') {
      return (
        <>
          <span className="flow-map-story-step">Step 5</span>
          <h2>Impact Observed?</h2>
          <p>Choose the outcome that best matches the controlled proof so the flow can guide the right wrap-up.</p>
          <div className="flow-map-actions flow-map-actions--stacked">
            <button type="button" className="flow-map-button" onClick={() => handleExploitationResultChoice('confirmed-impact')}>
              Clear impact confirmed
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleExploitationResultChoice('partial-impact')}>
              Partial impact only
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleExploitationResultChoice('no-safe-proof')}>
              No safe proof yet
            </button>
          </div>
        </>
      )
    }

    if (currentStage === 'document-impact') {
      return (
        <>
          <span className="flow-map-story-step">Step 6</span>
          <h2>Document Impact</h2>
          <p>Capture the exact request, response, observed effect, scope, and cleanup details. A good record should let another reviewer understand the issue without recreating broad impact.</p>
          <div className="flow-map-actions">
            <button type="button" className="flow-map-button" onClick={handleExploitationNextStep}>
              Continue to next step
            </button>
          </div>
        </>
      )
    }

    const nextStepCopy = selectedOutcome === 'no-safe-proof'
      ? 'Refine the validation plan, tighten scope, and return only when you can demonstrate impact safely and clearly.'
      : 'Package the proof with remediation notes, scope, and evidence so the finding can move cleanly into triage and fixing.'

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

  const renderStoryContent = () => {
    if (selectedFlow === 'login') {
      return renderLoginStoryContent()
    }

    if (selectedFlow === 'discovery') {
      return renderDiscoveryStoryContent()
    }

    if (selectedFlow === 'enumeration') {
      return renderEnumerationStoryContent()
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

    if (selectedFlow === 'exploitation') {
      return renderExploitationStoryContent()
    }

    return renderDecodeStoryContent()
  }

  const visibleNodes = currentFlow
    ? currentFlow.nodes.filter((node) => (stageIndex[node.id] ?? 0) <= revealedStageIndex)
    : []
  const activeNode = currentFlow?.nodes.find((node) => node.id === currentStage) ?? null
  const currentStageNumber = currentFlow ? (stageIndex[currentStage] ?? 0) + 1 : 0
  const totalStages = currentFlow?.stages.length ?? 0
  const currentStageLabel = currentFlow ? getStageLabel(currentFlow, currentStage) : ''
  const nextStageId = currentFlow ? currentFlow.stages[Math.min((stageIndex[currentStage] ?? 0) + 1, totalStages - 1)] : ''
  const nextStageLabel = currentFlow && currentStage !== 'start' && currentStageNumber < totalStages
    ? getStageLabel(currentFlow, nextStageId)
    : ''
  const storyPosition = activeNode
    ? {
        left: `${Math.min(Math.max(activeNode.x, 24), 76)}%`,
        top: `${Math.min(activeNode.y + 9, 62)}%`
      }
    : null
  const sceneWidth = Math.round(BASE_SCENE_WIDTH * zoomLevel)
  const sceneHeight = Math.round(BASE_SCENE_HEIGHT * zoomLevel)

  const handleStageSelect = (stageId) => {
    setCurrentStage(stageId)
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

  const renderStartStoryContent = () => (
    <>
      <span className="flow-map-story-step">Step 1</span>
      <h2>{currentFlow.label}</h2>
      <p>{currentFlow.summary}</p>
      <p className="flow-map-feedback">
        Begin here, then use the progress tracker or any unlocked node to move back through the flow without losing your place.
      </p>
      <div className="flow-map-actions">
        <button type="button" className="flow-map-button" onClick={handleStartClick}>
          Begin flow
        </button>
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={clearFlow}>
          Choose another flow
        </button>
      </div>
    </>
  )

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

      <section className="flow-map-stage" aria-label="Flow map canvas">
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
                style={{ width: `${totalStages ? (revealedStageIndex / (totalStages - 1)) * 100 : 0}%` }}
              />
            </div>
            <div className="flow-map-stage-tabs" aria-label="Flow steps">
              {currentFlow.stages.map((stageId, index) => {
                const isUnlocked = index <= revealedStageIndex
                const isActive = stageId === currentStage

                return (
                  <button
                    key={`${selectedFlow}-${stageId}-tab`}
                    type="button"
                    className={`flow-map-stage-tab${isActive ? ' flow-map-stage-tab--active' : ''}${isUnlocked ? '' : ' flow-map-stage-tab--locked'}`}
                    onClick={() => handleStageSelect(stageId)}
                    disabled={!isUnlocked}
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
              <p>Select a flow from the active categories above to load its first node.</p>
            </div>
          )}

              {visibleNodes.map((node) => {
                const isActive = currentStage === node.id
                const isComplete = (stageIndex[node.id] ?? 0) < (stageIndex[currentStage] ?? 0)
                const isClickable = (stageIndex[node.id] ?? 0) <= revealedStageIndex

                return (
                  <button
                    key={`${selectedFlow}-${node.id}`}
                    type="button"
                    className={`flow-map-node${isActive ? ' flow-map-node--active' : ''}${isComplete ? ' flow-map-node--complete' : ''}${isClickable ? ' flow-map-node--clickable' : ''}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onMouseMove={handleMapPointerMove}
                    onMouseLeave={resetMapPointerMove}
                    onClick={isClickable ? () => handleStageSelect(node.id) : undefined}
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

              {currentFlow && storyPosition && (
                <div className="flow-map-story-overlay" style={storyPosition}>
                  <div className={`flow-map-story${currentStage === 'success' || currentStage === 'next-step' ? ' flow-map-story--success' : ''}`}>
                    {currentStage === 'start' ? renderStartStoryContent() : renderStoryContent()}
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
