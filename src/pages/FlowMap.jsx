import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import {
  STORAGE_STAGE_KEY,
  STORAGE_TOOL_KEY,
  STORAGE_FEEDBACK_KEY,
  STORAGE_FLOW_KEY,
  STORAGE_ACTION_KEY,
  STORAGE_OUTCOME_KEY,
  STORAGE_OUTCOME_SIGNAL_KEY,
  STORAGE_OUTCOME_PROFILE_KEY,
  STORAGE_NOTES_KEY,
  STORAGE_STAGE_EVIDENCE_KEY,
  STORAGE_COMPLETED_KEY,
  STORAGE_IN_PROGRESS_KEY,
  STORAGE_STAGE_HISTORY_KEY,
  STORAGE_DECISION_HISTORY_KEY,
  STORAGE_TOOL_FLOW_ORIGIN_KEY,
  DEFAULT_ZOOM,
  FLOW_GROUPS,
  FLOWS,
  ACTIVE_FLOW_GROUP_KEYS,
  FINDING_QUICK_STARTS,
  FLOW_OUTCOME_PHRASE_STARTS,
  VULNERABILITY_TYPE_STARTS
} from '../data/flowMapConfig'
import { copyText } from '../utils/clipboard'
import { showFeedback } from '../utils/feedback'
import { readSessionValue, writeSessionValue } from '../utils/sessionStorage'
import { renderFlowStoryContent, renderStartStoryContent } from './flowMapStoryContent'
import {
  DEFAULT_MACHINE_STATE,
  FLOW_START_STAGE_BY_KEY,
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

function getStoredJsonArray(key) {
  try {
    const raw = readSessionValue(key, '[]')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function getStoredJsonObject(key) {
  try {
    const raw = readSessionValue(key, '{}')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function isEvidenceRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function normalizeStageEvidence(rawEvidence = {}, flow) {
  if (!flow) {
    return {}
  }

  const normalized = {}

  for (const stageId of flow.stages) {
    const entry = rawEvidence[stageId]
    if (!isEvidenceRecord(entry)) {
      continue
    }

    const screenshot = typeof entry.screenshot === 'string' ? entry.screenshot : ''
    const snippet = typeof entry.snippet === 'string' ? entry.snippet : ''
    const statusCode = typeof entry.statusCode === 'string' ? entry.statusCode : ''
    const reproduction = typeof entry.reproduction === 'string' ? entry.reproduction : ''

    if (screenshot || snippet || statusCode || reproduction) {
      normalized[stageId] = {
        screenshot,
        snippet,
        statusCode,
        reproduction
      }
    }
  }

  return normalized
}

function getFlowByKey(flowKey) {
  return flowKey && flowKey in FLOWS && ACTIVE_FLOW_GROUP_KEYS.has(FLOWS[flowKey].group)
    ? FLOWS[flowKey]
    : null
}

function normalizeOutcomeSignal(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const confidence = typeof value.confidence === 'string' ? value.confidence : ''
  const severity = typeof value.severity === 'string' ? value.severity : ''

  if (!confidence || !severity) {
    return null
  }

  return {
    confidence,
    severity
  }
}

function normalizeOutcomeProfile(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const confidence = typeof value.confidence === 'string' ? value.confidence : ''
  const severity = typeof value.severity === 'string' ? value.severity : ''
  const recommendedNextFlows = Array.isArray(value.recommendedNextFlows)
    ? value.recommendedNextFlows.filter((entry) => entry && typeof entry.flowKey === 'string')
    : []
  const evidenceChecklist = Array.isArray(value.evidenceChecklist)
    ? value.evidenceChecklist.filter((entry) => typeof entry === 'string' && entry.trim().length > 0)
    : []
  const relatedTools = Array.isArray(value.relatedTools)
    ? value.relatedTools.filter((entry) => typeof entry === 'string' && entry.trim().length > 0)
    : []
  const reportingHint = typeof value.reportingHint === 'string' ? value.reportingHint : ''

  if (!confidence || !severity) {
    return null
  }

  return {
    confidence,
    severity,
    recommendedNextFlows,
    evidenceChecklist,
    relatedTools,
    reportingHint
  }
}

function formatSignalLabel(value = '') {
  if (!value) {
    return 'Unknown'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
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
  const initialStageHistory = getStoredJsonArray(STORAGE_STAGE_HISTORY_KEY)
  const initialDecisionHistory = getStoredJsonArray(STORAGE_DECISION_HISTORY_KEY)
  const initialStageEvidence = getStoredJsonObject(STORAGE_STAGE_EVIDENCE_KEY)
  const initialOutcomeSignal = normalizeOutcomeSignal(getStoredJsonObject(STORAGE_OUTCOME_SIGNAL_KEY))
  const initialOutcomeProfile = normalizeOutcomeProfile(getStoredJsonObject(STORAGE_OUTCOME_PROFILE_KEY))
  const initialFlow = getFlowByKey(initialFlowState.selectedFlow)
  const stageHistory = initialFlow
    ? initialStageHistory.filter((stageId) => initialFlow.stages.includes(stageId))
    : []
  const fallbackHistory = initialFlow
    ? (initialFlowState.currentStage === DEFAULT_STAGE
      ? [DEFAULT_STAGE]
      : [DEFAULT_STAGE, initialFlowState.currentStage])
    : []

  return {
    ...DEFAULT_MACHINE_STATE,
    selectedFlow: initialFlowState.selectedFlow,
    currentStage: initialFlowState.currentStage,
    stageHistory: stageHistory.length > 0 ? stageHistory : fallbackHistory,
    decisionHistory: initialFlow ? initialDecisionHistory : [],
    stageEvidence: normalizeStageEvidence(initialStageEvidence, initialFlow),
    outcomeSignal: initialFlow ? initialOutcomeSignal : null,
    outcomeProfile: initialFlow ? initialOutcomeProfile : null,
    selectedTool: getStoredValue(STORAGE_TOOL_KEY),
    feedback: getStoredValue(STORAGE_FEEDBACK_KEY),
    selectedAction: getStoredValue(STORAGE_ACTION_KEY),
    selectedOutcome: getStoredValue(STORAGE_OUTCOME_KEY),
    notes: getStoredValue(STORAGE_NOTES_KEY),
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

function readInProgressFlows() {
  try {
    const raw = readSessionValue(STORAGE_IN_PROGRESS_KEY, '[]')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? new Set(parsed) : new Set()
  } catch {
    return new Set()
  }
}

function writeInProgressFlows(inProgressSet) {
  writeSessionValue(STORAGE_IN_PROGRESS_KEY, JSON.stringify([...inProgressSet]))
}

const TOTAL_FLOWS = Object.entries(FLOWS).filter(([, f]) => ACTIVE_FLOW_GROUP_KEYS.has(f.group)).length

const COMMAND_RESULT_LIMIT = 9

const COMMAND_KIND_LABEL = {
  finding: 'Finding',
  tool: 'Tool',
  vulnerability: 'Vulnerability',
  outcome: 'Outcome',
  flow: 'Flow'
}

function normalizeSearchValue(value = '') {
  return value.trim().toLowerCase()
}

function scoreCommandOption(option, query) {
  if (!query) {
    return option.kind === 'finding' ? 100 : 60
  }

  const searchableText = option.searchText
  const label = option.label.toLowerCase()
  const flowLabel = option.flowLabel.toLowerCase()
  const stageLabel = option.stageLabel.toLowerCase()
  let score = 0

  if (label.startsWith(query)) {
    score += 130
  } else if (label.includes(query)) {
    score += 110
  }

  if (flowLabel.startsWith(query)) {
    score += 90
  } else if (flowLabel.includes(query)) {
    score += 70
  }

  if (stageLabel.includes(query)) {
    score += 40
  }

  if (searchableText.includes(query)) {
    score += 35
  }

  if (option.kind === 'finding') {
    score += 8
  }

  return score
}

function buildCommandOptions() {
  const options = []

  for (const [flowKey, flow] of Object.entries(FLOWS)) {
    if (!ACTIVE_FLOW_GROUP_KEYS.has(flow.group)) {
      continue
    }

    const startStage = FLOW_START_STAGE_BY_KEY[flowKey] ?? DEFAULT_STAGE
    const startStageLabel = getStageLabel(flow, startStage)

    options.push({
      id: `flow-${flowKey}`,
      kind: 'flow',
      label: flow.label,
      description: flow.summary,
      flowKey,
      flowLabel: flow.label,
      stageId: startStage,
      stageLabel: startStageLabel,
      confidence: 'medium',
      category: flow.group,
      searchText: normalizeSearchValue(
        `${flow.label} ${flow.summary} ${flow.group} ${startStageLabel} ${flow.stages.join(' ')}`
      )
    })

    for (const tool of flow.tools ?? []) {
      options.push({
        id: `tool-${flowKey}-${tool.name.toLowerCase().replace(/\s+/g, '-')}`,
        kind: 'tool',
        label: tool.name,
        description: tool.purpose,
        flowKey,
        flowLabel: flow.label,
        stageId: startStage,
        stageLabel: startStageLabel,
        confidence: 'medium',
        category: flow.group,
        searchText: normalizeSearchValue(
          `${tool.name} ${tool.purpose} ${flow.label} ${flow.summary} ${flow.group} tool`
        )
      })
    }
  }

  for (const finding of FINDING_QUICK_STARTS) {
    const flow = FLOWS[finding.flowKey]
    if (!flow || !ACTIVE_FLOW_GROUP_KEYS.has(flow.group)) {
      continue
    }

    options.push({
      id: `finding-${finding.id}`,
      kind: 'finding',
      label: finding.label,
      description: finding.description,
      flowKey: finding.flowKey,
      flowLabel: flow.label,
      stageId: finding.stageId,
      stageLabel: getStageLabel(flow, finding.stageId),
      confidence: finding.confidence,
      category: finding.category,
      searchText: normalizeSearchValue(
        `${finding.label} ${finding.description} ${finding.category} ${flow.label} finding`
      )
    })
  }

  for (const phrase of FLOW_OUTCOME_PHRASE_STARTS) {
    const flow = FLOWS[phrase.flowKey]
    if (!flow || !ACTIVE_FLOW_GROUP_KEYS.has(flow.group)) {
      continue
    }

    options.push({
      id: `outcome-${phrase.id}`,
      kind: 'outcome',
      label: phrase.phrase,
      description: phrase.description,
      flowKey: phrase.flowKey,
      flowLabel: flow.label,
      stageId: phrase.stageId,
      stageLabel: getStageLabel(flow, phrase.stageId),
      confidence: phrase.confidence,
      category: phrase.category,
      searchText: normalizeSearchValue(
        `${phrase.phrase} ${phrase.description} ${phrase.category} ${flow.label} outcome`
      )
    })
  }

  for (const vulnerability of VULNERABILITY_TYPE_STARTS) {
    const flow = FLOWS[vulnerability.flowKey]
    if (!flow || !ACTIVE_FLOW_GROUP_KEYS.has(flow.group)) {
      continue
    }

    options.push({
      id: `vulnerability-${vulnerability.id}`,
      kind: 'vulnerability',
      label: vulnerability.type,
      description: vulnerability.description,
      flowKey: vulnerability.flowKey,
      flowLabel: flow.label,
      stageId: vulnerability.stageId,
      stageLabel: getStageLabel(flow, vulnerability.stageId),
      confidence: vulnerability.confidence,
      category: vulnerability.category,
      searchText: normalizeSearchValue(
        `${vulnerability.type} ${vulnerability.description} ${vulnerability.category} ${flow.label} vulnerability`
      )
    })
  }

  return options
}

function buildFlowOutcomeSummary({
  selectedFlow,
  currentFlow,
  currentStage,
  stageHistory,
  decisionHistory,
  stageEvidence,
  outcomeSignal,
  outcomeProfile,
  selectedTool,
  selectedAction,
  selectedOutcome,
  feedback,
  notes,
}) {
  const stageTrail = (stageHistory ?? [])
    .map((stageId, index) => `${index + 1}. ${getStageLabel(currentFlow, stageId)} (${stageId})`)
    .join('\n')
  const decisionTrail = (decisionHistory ?? [])
    .map((decision, index) => {
      const payload = decision.payload === undefined || decision.payload === null
        ? ''
        : ` payload=${JSON.stringify(decision.payload)}`
      return `${index + 1}. ${decision.event} (${decision.fromStage} -> ${decision.toStage})${payload}`
    })
    .join('\n')
  const stageEvidenceLines = []
  const seenStageIds = new Set()
  for (const stageId of stageHistory ?? []) {
    if (seenStageIds.has(stageId)) {
      continue
    }
    seenStageIds.add(stageId)

    const evidence = stageEvidence?.[stageId]
    if (!evidence) {
      continue
    }

    const { screenshot = '', snippet = '', statusCode = '', reproduction = '' } = evidence
    if (!screenshot && !snippet && !statusCode && !reproduction) {
      continue
    }

    stageEvidenceLines.push(`- ${getStageLabel(currentFlow, stageId)} (${stageId})`)
    stageEvidenceLines.push(`  Screenshot/File: ${screenshot || 'None'}`)
    stageEvidenceLines.push(`  Request/Response Snippet: ${snippet || 'None'}`)
    stageEvidenceLines.push(`  Observed Status Code: ${statusCode || 'None'}`)
    stageEvidenceLines.push(`  Reproduction Note: ${reproduction || 'None'}`)
  }

  const lines = [
    'Flow Outcome Export',
    `Flow: ${currentFlow?.label ?? selectedFlow}`,
    `Current stage: ${getStageLabel(currentFlow, currentStage)} (${currentStage})`,
    selectedTool ? `Selected tool: ${selectedTool}` : 'Selected tool: None',
    selectedAction ? `Selected action: ${selectedAction}` : 'Selected action: None',
    selectedOutcome ? `Selected outcome: ${selectedOutcome}` : 'Selected outcome: None',
    outcomeSignal
      ? `Outcome signal: confidence=${outcomeSignal.confidence}; severity=${outcomeSignal.severity}`
      : 'Outcome signal: None',
    outcomeProfile
      ? `Outcome profile: next=${(outcomeProfile.recommendedNextFlows ?? []).map((entry) => entry.flowKey).join(', ') || 'none'}; checklist=${(outcomeProfile.evidenceChecklist ?? []).length}; hint=${outcomeProfile.reportingHint || 'None'}`
      : 'Outcome profile: None',
    '',
    'Visited stages:',
    stageTrail || 'No stages visited yet.',
    '',
    'Decision history:',
    decisionTrail || 'No explicit decisions recorded.',
    '',
    'Stage evidence:',
    stageEvidenceLines.join('\n') || 'No stage-level evidence captured.',
    '',
    'Feedback:',
    feedback || 'None',
    '',
    'Notes:',
    notes || 'None'
  ]

  return lines.join('\n')
}

function buildFlowOutcomeData({
  selectedFlow,
  currentFlow,
  currentStage,
  stageHistory,
  decisionHistory,
  stageEvidence,
  outcomeSignal,
  outcomeProfile,
  selectedTool,
  selectedAction,
  selectedOutcome,
  feedback,
  notes,
}) {
  const visitedStages = []
  const stageEvidenceArtifacts = []
  const seenStageIds = new Set()

  for (const stageId of stageHistory ?? []) {
    visitedStages.push({
      stageId,
      stageLabel: getStageLabel(currentFlow, stageId)
    })

    if (seenStageIds.has(stageId)) {
      continue
    }

    seenStageIds.add(stageId)
    const evidence = stageEvidence?.[stageId]
    if (!evidence) {
      continue
    }

    const screenshot = evidence.screenshot ?? ''
    const snippet = evidence.snippet ?? ''
    const statusCode = evidence.statusCode ?? ''
    const reproduction = evidence.reproduction ?? ''

    if (!screenshot && !snippet && !statusCode && !reproduction) {
      continue
    }

    stageEvidenceArtifacts.push({
      stageId,
      stageLabel: getStageLabel(currentFlow, stageId),
      screenshot,
      snippet,
      statusCode,
      reproduction
    })
  }

  const decisions = (decisionHistory ?? []).map((decision) => ({
    event: decision.event,
    fromStage: decision.fromStage,
    toStage: decision.toStage,
    payload: decision.payload ?? null,
    timestamp: decision.timestamp ?? null
  }))

  return {
    exportedAt: new Date().toISOString(),
    flow: {
      key: selectedFlow,
      label: currentFlow?.label ?? selectedFlow
    },
    currentStage: {
      stageId: currentStage,
      stageLabel: getStageLabel(currentFlow, currentStage)
    },
    selectedTool: selectedTool || null,
    selectedAction: selectedAction || null,
    selectedOutcome: selectedOutcome || null,
    outcomeSignal: outcomeSignal ?? null,
    outcomeProfile: outcomeProfile ?? null,
    visitedStages,
    decisionHistory: decisions,
    stageEvidence: stageEvidenceArtifacts,
    feedback: feedback || null,
    notes: notes || null
  }
}

function buildFlowOutcomeMarkdown(data) {
  const lines = [
    '# Flow Outcome Export',
    '',
    `- Exported at: ${data.exportedAt}`,
    `- Flow: ${data.flow.label} (${data.flow.key})`,
    `- Current stage: ${data.currentStage.stageLabel} (${data.currentStage.stageId})`,
    `- Selected tool: ${data.selectedTool ?? 'None'}`,
    `- Selected action: ${data.selectedAction ?? 'None'}`,
    `- Selected outcome: ${data.selectedOutcome ?? 'None'}`,
    data.outcomeSignal
      ? `- Outcome signal: confidence=${data.outcomeSignal.confidence}; severity=${data.outcomeSignal.severity}`
      : '- Outcome signal: None',
    data.outcomeProfile
      ? `- Outcome profile: next=${(data.outcomeProfile.recommendedNextFlows ?? []).map((entry) => entry.flowKey).join(', ') || 'none'}`
      : '- Outcome profile: None',
    '',
    '## Visited Stages',
  ]

  if (data.outcomeProfile?.reportingHint) {
    lines.push(`- Reporting hint: ${data.outcomeProfile.reportingHint}`)
  }

  if (data.outcomeProfile?.evidenceChecklist?.length) {
    lines.push('- Evidence checklist:')
    lines.push(...data.outcomeProfile.evidenceChecklist.map((item) => `  - ${item}`))
    lines.push('')
  }

  if (data.visitedStages.length > 0) {
    lines.push(...data.visitedStages.map((stage, index) => `${index + 1}. ${stage.stageLabel} (${stage.stageId})`))
  } else {
    lines.push('No stages visited yet.')
  }

  lines.push('', '## Decision History')
  if (data.decisionHistory.length > 0) {
    lines.push(...data.decisionHistory.map((decision, index) => {
      const payload = decision.payload === null ? '' : ` payload=${JSON.stringify(decision.payload)}`
      return `${index + 1}. ${decision.event} (${decision.fromStage} -> ${decision.toStage})${payload}`
    }))
  } else {
    lines.push('No explicit decisions recorded.')
  }

  lines.push('', '## Stage Evidence')
  if (data.stageEvidence.length > 0) {
    for (const evidence of data.stageEvidence) {
      lines.push(`- ${evidence.stageLabel} (${evidence.stageId})`)
      lines.push(`  - Screenshot/File: ${evidence.screenshot || 'None'}`)
      lines.push(`  - Request/Response Snippet: ${evidence.snippet || 'None'}`)
      lines.push(`  - Observed Status Code: ${evidence.statusCode || 'None'}`)
      lines.push(`  - Reproduction Note: ${evidence.reproduction || 'None'}`)
    }
  } else {
    lines.push('No stage-level evidence captured.')
  }

  lines.push('', '## Feedback', data.feedback ?? 'None', '', '## Notes', data.notes ?? 'None')

  return lines.join('\n')
}

function buildExportFilename(flowKey, extension) {
  const safeFlowKey = (flowKey || 'flow').toLowerCase().replace(/[^a-z0-9-]+/g, '-')
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${safeFlowKey}-outcome-${timestamp}.${extension}`
}

function downloadExportArtifact({ fileName, content, mimeType }) {
  const blob = new Blob([content], { type: mimeType })
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = objectUrl
  link.download = fileName
  link.rel = 'noopener'
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}

export default function FlowMap({ onToolClick, onToolReferenceClick }) {
  useSEO({
    title: 'Flow Map - Guided Testing Paths',
    description: 'Guided flow paths for recon, enumeration, entry-point analysis, testing, vulnerability validation, and exploitation in authorized environments.',
    keywords: 'flow map, recon flow, enumeration flow, entry point flow, testing flow, vulnerability flow, exploitation flow'
  })

  const [machineState, dispatch] = useReducer(flowMapReducer, undefined, buildInitialMachineState)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [activeCommandIndex, setActiveCommandIndex] = useState(0)
  const commandInputRef = useRef(null)
  const {
    selectedFlow,
    currentStage,
    selectedTool,
    feedback,
    selectedAction,
    selectedOutcome,
    outcomeSignal,
    outcomeProfile,
    followUpFlows,
    stageHistory,
    decisionHistory,
    stageEvidence,
    notes
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
  const completedFlows = readCompletedFlows()
  const inProgressFlows = readInProgressFlows()
  const groupedProgress = useMemo(
    () => groupedFlows.map((group) => {
      const total = group.flows.length
      const completed = group.flows.filter(([flowKey]) => completedFlows.has(flowKey)).length
      const inProgress = group.flows.filter(([flowKey]) => inProgressFlows.has(flowKey)).length
      const status = completed === total
        ? 'completed'
        : (completed > 0 || inProgress > 0)
          ? 'in-progress'
          : 'untouched'

      return {
        key: group.key,
        label: group.label,
        total,
        completed,
        inProgress,
        status
      }
    }),
    [completedFlows, groupedFlows, inProgressFlows]
  )
  const stageIndex = useMemo(
    () => Object.fromEntries((currentFlow?.stages ?? ['start']).map((stage, index) => [stage, index])),
    [currentFlow]
  )
  const commandOptions = useMemo(() => buildCommandOptions(), [])
  const commandQueryValue = normalizeSearchValue(commandQuery)
  const filteredCommandOptions = useMemo(() => {
    const scored = commandOptions
      .map((option) => ({ option, score: scoreCommandOption(option, commandQueryValue) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.option.label.localeCompare(b.option.label))
      .slice(0, COMMAND_RESULT_LIMIT)

    return scored.map((entry) => entry.option)
  }, [commandOptions, commandQueryValue])
  const activeCommandIndexSafe = filteredCommandOptions.length > 0
    ? Math.min(activeCommandIndex, filteredCommandOptions.length - 1)
    : 0
  const quickStartOptions = useMemo(
    () => FINDING_QUICK_STARTS.filter(({ flowKey }) => getFlowByKey(flowKey)),
    []
  )
  const followUpRecommendations = useMemo(
    () => {
      const sourceRecommendations = outcomeProfile?.recommendedNextFlows?.length
        ? outcomeProfile.recommendedNextFlows
        : (followUpFlows ?? [])

      return sourceRecommendations
      .filter((entry) => entry?.flowKey && entry.flowKey !== selectedFlow)
      .map((entry) => {
        const flow = getFlowByKey(entry.flowKey)
        if (!flow) {
          return null
        }

        return {
          flowKey: entry.flowKey,
          flowLabel: flow.label,
          reason: entry.reason || 'Follow this flow based on your latest result.',
          stageId: FLOW_START_STAGE_BY_KEY[entry.flowKey] ?? DEFAULT_STAGE
        }
      })
      .filter(Boolean)
    },
    [followUpFlows, outcomeProfile, selectedFlow]
  )

  useEffect(() => {
    const configIssues = validateFlowConfigConsistency({
      flows: FLOWS,
      activeGroupKeys: ACTIVE_FLOW_GROUP_KEYS,
      startStageByFlow: {
        ...FLOW_START_STAGE_BY_KEY
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
      const inProgress = readInProgressFlows()
      if (!completed.has(selectedFlow)) {
        completed.add(selectedFlow)
        writeCompletedFlows(completed)
      }

      if (inProgress.has(selectedFlow)) {
        inProgress.delete(selectedFlow)
        writeInProgressFlows(inProgress)
      }
    } else if (selectedFlow && currentStage !== DEFAULT_STAGE) {
      const completed = readCompletedFlows()
      if (!completed.has(selectedFlow)) {
        const inProgress = readInProgressFlows()
        if (!inProgress.has(selectedFlow)) {
          inProgress.add(selectedFlow)
          writeInProgressFlows(inProgress)
        }
      }
    }
  }, [currentStage, selectedFlow])

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
    writeSessionValue(STORAGE_OUTCOME_SIGNAL_KEY, JSON.stringify(outcomeSignal ?? {}))
  }, [outcomeSignal])

  useEffect(() => {
    writeSessionValue(STORAGE_OUTCOME_PROFILE_KEY, JSON.stringify(outcomeProfile ?? {}))
  }, [outcomeProfile])

  useEffect(() => {
    writeSessionValue(STORAGE_STAGE_HISTORY_KEY, JSON.stringify(stageHistory))
  }, [stageHistory])

  useEffect(() => {
    writeSessionValue(STORAGE_DECISION_HISTORY_KEY, JSON.stringify(decisionHistory))
  }, [decisionHistory])

  useEffect(() => {
    writeSessionValue(STORAGE_STAGE_EVIDENCE_KEY, JSON.stringify(stageEvidence))
  }, [stageEvidence])

  useEffect(() => {
    writeSessionValue(STORAGE_NOTES_KEY, notes)
  }, [notes])

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

  useEffect(() => {
    function handlePaletteShortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsCommandPaletteOpen((open) => !open)
      }
    }

    window.addEventListener('keydown', handlePaletteShortcut)
    return () => window.removeEventListener('keydown', handlePaletteShortcut)
  }, [])

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      return
    }

    const rafId = requestAnimationFrame(() => {
      commandInputRef.current?.focus()
    })

    return () => cancelAnimationFrame(rafId)
  }, [isCommandPaletteOpen])

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
      currentFlowTools: currentFlow.tools ?? [],
      payload
    })

    if (!transition) {
      return false
    }

    const patch = {}
    const nextStage = typeof transition.nextStage === 'string' ? transition.nextStage : null

    if (nextStage) {
      if (!currentFlow.stages.includes(nextStage)) {
        console.warn(`[FlowMap] blocked invalid transition for ${selectedFlow}: ${eventName} -> ${nextStage}`)
        return false
      }
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

    if (transition.outcomeSignal !== undefined) {
      patch.outcomeSignal = transition.outcomeSignal
    }

    if (transition.outcomeProfile !== undefined) {
      patch.outcomeProfile = transition.outcomeProfile
    }

    patch.followUpFlows = transition.followUpFlows ?? []

    dispatch({
      type: 'FLOW_EVENT_APPLY',
      patch,
      nextStage,
      decision: {
        event: eventName,
        payload,
        fromStage: currentStage,
        toStage: nextStage ?? currentStage,
        timestamp: new Date().toISOString()
      }
    })

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

  const handleQuickStart = useCallback((flowKey, stageId) => {
    const flow = getFlowByKey(flowKey)
    if (!flow) {
      return
    }

    dispatch({ type: 'FLOW_SELECT', flowKey, defaultZoom: DEFAULT_ZOOM })
    const validStage = getValidStage(flow, stageId)
    if (validStage !== DEFAULT_STAGE) {
      dispatch({ type: 'STAGE_SET', stage: validStage })
      dispatch({
        type: 'FLOW_EVENT_APPLY',
        decision: {
          event: 'quickStart.select',
          payload: { flowKey, stageId: validStage },
          fromStage: DEFAULT_STAGE,
          toStage: validStage,
          timestamp: new Date().toISOString()
        }
      })
    }
  }, [])

  const openCommandPalette = useCallback(() => {
    setCommandQuery('')
    setActiveCommandIndex(0)
    setIsCommandPaletteOpen(true)
  }, [])

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false)
    setCommandQuery('')
    setActiveCommandIndex(0)
  }, [])

  const selectCommandOption = useCallback((option) => {
    handleQuickStart(option.flowKey, option.stageId)
    closeCommandPalette()
  }, [closeCommandPalette, handleQuickStart])

  const handleCommandInputKeyDown = useCallback((event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (filteredCommandOptions.length > 0) {
        setActiveCommandIndex((index) => (index + 1) % filteredCommandOptions.length)
      }
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (filteredCommandOptions.length > 0) {
        setActiveCommandIndex((index) => (index - 1 + filteredCommandOptions.length) % filteredCommandOptions.length)
      }
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (filteredCommandOptions.length === 0) {
        return
      }
      selectCommandOption(filteredCommandOptions[activeCommandIndexSafe] ?? filteredCommandOptions[0])
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      closeCommandPalette()
    }
  }, [activeCommandIndexSafe, closeCommandPalette, filteredCommandOptions, selectCommandOption])

  const handleFollowUpRecommendation = useCallback((flowKey, stageId) => {
    const flow = getFlowByKey(flowKey)
    if (!flow) {
      return
    }

    dispatch({ type: 'FLOW_SELECT', flowKey, defaultZoom: DEFAULT_ZOOM })
    const targetStage = getValidStage(flow, stageId ?? FLOW_START_STAGE_BY_KEY[flowKey] ?? DEFAULT_STAGE)
    if (targetStage !== DEFAULT_STAGE) {
      dispatch({ type: 'STAGE_SET', stage: targetStage })
      dispatch({
        type: 'FLOW_EVENT_APPLY',
        decision: {
          event: 'followUpFlow.select',
          payload: { flowKey, stageId: targetStage },
          fromStage: DEFAULT_STAGE,
          toStage: targetStage,
          timestamp: new Date().toISOString()
        }
      })
    }
  }, [])

  const openToolFromFlow = useCallback((toolName, options = {}) => {
    if (!toolName || !currentFlow || !selectedFlow) {
      return
    }

    const originStageId = getValidStage(currentFlow, options.originStageId ?? currentStage)
    const recommendation = options.recommendation
      ?? outcomeProfile?.recommendedNextFlows?.[0]
      ?? null
    const recommendedFlowKey = recommendation?.flowKey && getFlowByKey(recommendation.flowKey)
      ? recommendation.flowKey
      : selectedFlow
    const recommendedFlow = getFlowByKey(recommendedFlowKey)
    const recommendedStageId = recommendedFlow
      ? getValidStage(recommendedFlow, recommendation?.stageId ?? options.recommendedStageId ?? originStageId)
      : originStageId

    writeSessionValue(STORAGE_TOOL_FLOW_ORIGIN_KEY, JSON.stringify({
      source: 'flow-map',
      toolTitle: toolName,
      flowKey: selectedFlow,
      stageId: originStageId,
      recommendedFlowKey,
      recommendedStageId,
      recommendationReason: recommendation?.reason ?? options.recommendationReason ?? '',
      timestamp: new Date().toISOString()
    }))

    onToolClick?.(toolName, {
      source: 'flow-map',
      flowKey: selectedFlow,
      stageId: originStageId,
      recommendedFlowKey,
      recommendedStageId
    })
  }, [currentFlow, currentStage, onToolClick, outcomeProfile, selectedFlow])

  const handleExportOutcome = useCallback(() => {
    if (!currentFlow) {
      return
    }

    const summary = buildFlowOutcomeSummary({
      selectedFlow,
      currentFlow,
      currentStage,
      stageHistory,
      decisionHistory,
      stageEvidence,
      outcomeSignal,
      outcomeProfile,
      selectedTool,
      selectedAction,
      selectedOutcome,
      feedback,
      notes,
    })

    copyText(summary, {
      successMessage: 'Flow outcome summary copied',
      errorMessage: 'Failed to export flow outcome'
    })
  }, [
    currentFlow,
    currentStage,
    decisionHistory,
    feedback,
    notes,
    outcomeSignal,
    outcomeProfile,
    selectedAction,
    selectedFlow,
    selectedOutcome,
    selectedTool,
    stageEvidence,
    stageHistory,
  ])

  const handleExportMarkdown = useCallback(() => {
    if (!currentFlow) {
      return
    }

    try {
      const outcomeData = buildFlowOutcomeData({
        selectedFlow,
        currentFlow,
        currentStage,
        stageHistory,
        decisionHistory,
        stageEvidence,
        outcomeSignal,
        outcomeProfile,
        selectedTool,
        selectedAction,
        selectedOutcome,
        feedback,
        notes,
      })
      const markdown = buildFlowOutcomeMarkdown(outcomeData)

      downloadExportArtifact({
        fileName: buildExportFilename(selectedFlow, 'md'),
        content: markdown,
        mimeType: 'text/markdown;charset=utf-8'
      })
      showFeedback('Markdown export downloaded')
    } catch {
      showFeedback('Failed to export Markdown artifact', 'error')
    }
  }, [
    currentFlow,
    currentStage,
    decisionHistory,
    feedback,
    notes,
    outcomeSignal,
    outcomeProfile,
    selectedAction,
    selectedFlow,
    selectedOutcome,
    selectedTool,
    stageEvidence,
    stageHistory,
  ])

  const handleExportJson = useCallback(() => {
    if (!currentFlow) {
      return
    }

    try {
      const outcomeData = buildFlowOutcomeData({
        selectedFlow,
        currentFlow,
        currentStage,
        stageHistory,
        decisionHistory,
        stageEvidence,
        outcomeSignal,
        outcomeProfile,
        selectedTool,
        selectedAction,
        selectedOutcome,
        feedback,
        notes,
      })
      const json = JSON.stringify(outcomeData, null, 2)

      downloadExportArtifact({
        fileName: buildExportFilename(selectedFlow, 'json'),
        content: json,
        mimeType: 'application/json;charset=utf-8'
      })
      showFeedback('JSON export downloaded')
    } catch {
      showFeedback('Failed to export JSON artifact', 'error')
    }
  }, [
    currentFlow,
    currentStage,
    decisionHistory,
    feedback,
    notes,
    outcomeSignal,
    outcomeProfile,
    selectedAction,
    selectedFlow,
    selectedOutcome,
    selectedTool,
    stageEvidence,
    stageHistory,
  ])

  const currentStageEvidenceEntry = stageEvidence?.[currentStage] ?? {}
  const currentStageEvidence = {
    screenshot: currentStageEvidenceEntry.screenshot ?? '',
    snippet: currentStageEvidenceEntry.snippet ?? '',
    statusCode: currentStageEvidenceEntry.statusCode ?? '',
    reproduction: currentStageEvidenceEntry.reproduction ?? ''
  }

  const updateCurrentStageEvidence = useCallback((field, value) => {
    dispatch({
      type: 'CONTEXT_PATCH',
      patch: {
        stageEvidence: {
          ...stageEvidence,
          [currentStage]: {
            ...(stageEvidence[currentStage] ?? {}),
            [field]: value
          }
        }
      }
    })
  }, [currentStage, stageEvidence])

  const currentStageLabel = currentFlow ? getStageLabel(currentFlow, currentStage) : ''

  const handleOutcomeRelatedToolOpen = useCallback((toolName) => {
    openToolFromFlow(toolName, {
      originStageId: currentStage,
      recommendedStageId: currentStage,
      recommendationReason: 'Resume this flow stage after using the suggested tool.'
    })
  }, [currentStage, openToolFromFlow])

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
      const originStageId = currentStage
      if (applyFlowEvent('decode.openTool', toolName)) {
        openToolFromFlow(toolName, {
          originStageId,
          recommendedStageId: 'result',
          recommendationReason: 'Return after trying a decoder and continue from the result stage.'
        })
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
            <button
              type="button"
              className="flow-map-command-open"
              onClick={openCommandPalette}
              aria-label="Open flow command palette"
            >
              Command Palette
            </button>
            {completedFlows.size > 0 && (
              <span className="flow-map-completed-counter">{completedFlows.size}/{TOTAL_FLOWS} completed</span>
            )}
          </div>
          <p className="flow-map-selector-copy">Pick a flow to walk through a structured testing path step by step.</p>
          <section className="flow-map-group-progress" aria-label="Flow group progress">
            <h2>Coverage by Group</h2>
            <div className="flow-map-group-progress-grid">
              {groupedProgress.map((group) => (
                <article
                  key={group.key}
                  className={`flow-map-group-progress-card flow-map-group-progress-card--${group.status}`}
                  aria-label={`${group.label} ${group.status}`}
                >
                  <p className="flow-map-group-progress-label">{group.label}</p>
                  <p className="flow-map-group-progress-status">
                    {group.status === 'completed'
                      ? 'Completed'
                      : group.status === 'in-progress'
                        ? 'In Progress'
                        : 'Untouched'}
                  </p>
                  <p className="flow-map-group-progress-meta">
                    {group.completed}/{group.total} completed
                    {group.inProgress > 0 ? ` · ${group.inProgress} active` : ''}
                  </p>
                </article>
              ))}
            </div>
          </section>
          <section className="flow-map-quick-start" aria-label="Start from finding">
            <h2>Start From Finding</h2>
            <p>Jump directly to the most likely flow stage based on what you observed.</p>
            <div className="flow-map-quick-grid">
              {quickStartOptions.map((finding) => (
                <button
                  key={finding.id}
                  type="button"
                  className="flow-map-quick-button"
                  aria-label={finding.label}
                  onClick={() => handleQuickStart(finding.flowKey, finding.stageId)}
                >
                  <span className="flow-map-quick-label">{finding.label}</span>
                  <span className="flow-map-quick-desc">{finding.description}</span>
                </button>
              ))}
            </div>
          </section>
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
          <div className="flow-map-command-row">
            <button
              type="button"
              className="flow-map-command-open"
              onClick={openCommandPalette}
              aria-label="Open flow command palette"
            >
              Command Palette
            </button>
          </div>

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

            <div className="flow-map-outcome-export" aria-label="Flow outcome export">
              {followUpRecommendations.length > 0 ? (
                <div className="flow-map-handoff" aria-label="Cross-flow recommendations">
                  <h3>Suggested Next Flows</h3>
                  <p>Your current result maps to these high-value follow-up flows.</p>
                  <div className="flow-map-handoff-grid">
                    {followUpRecommendations.map((recommendation) => (
                      <button
                        key={`${selectedFlow}-${recommendation.flowKey}`}
                        type="button"
                        className="flow-map-handoff-button"
                        onClick={() => handleFollowUpRecommendation(recommendation.flowKey, recommendation.stageId)}
                        aria-label={`Continue to ${recommendation.flowLabel}`}
                      >
                        <span className="flow-map-handoff-title">{recommendation.flowLabel}</span>
                        <span className="flow-map-handoff-reason">{recommendation.reason}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {outcomeProfile ? (
                <div
                  className={`flow-map-signal flow-map-signal--${outcomeProfile.severity}`}
                  aria-label="Outcome confidence and severity"
                >
                  <h4>Outcome Insight</h4>
                  <p>
                    Confidence: {formatSignalLabel(outcomeProfile.confidence)}
                    <span className="flow-map-signal-separator">|</span>
                    Severity: {formatSignalLabel(outcomeProfile.severity)}
                  </p>
                  {outcomeProfile.reportingHint ? (
                    <p className="flow-map-signal-hint">Reporting hint: {outcomeProfile.reportingHint}</p>
                  ) : null}
                  {outcomeProfile.evidenceChecklist?.length ? (
                    <ul className="flow-map-signal-checklist" aria-label="Outcome evidence checklist">
                      {outcomeProfile.evidenceChecklist.map((item) => (
                        <li key={`${selectedFlow}-${currentStage}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {outcomeProfile.relatedTools?.length ? (
                    <div className="flow-map-signal-tools" aria-label="Outcome related tools">
                      {outcomeProfile.relatedTools.map((toolName) => (
                        <button
                          key={`${selectedFlow}-${currentStage}-tool-${toolName}`}
                          type="button"
                          className="flow-map-related-tool"
                          onClick={() => handleOutcomeRelatedToolOpen(toolName)}
                        >
                          Open {toolName}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : outcomeSignal ? (
                <div
                  className={`flow-map-signal flow-map-signal--${outcomeSignal.severity}`}
                  aria-label="Outcome confidence and severity"
                >
                  <h4>Outcome Signal</h4>
                  <p>
                    Confidence: {formatSignalLabel(outcomeSignal.confidence)}
                    <span className="flow-map-signal-separator">|</span>
                    Severity: {formatSignalLabel(outcomeSignal.severity)}
                  </p>
                </div>
              ) : null}

              <h3>Flow Outcome Export</h3>
              <p>Capture your current steps, selected tools, and notes as a copyable summary.</p>
              <label htmlFor="flow-outcome-notes" className="flow-map-outcome-label">Notes</label>
              <textarea
                id="flow-outcome-notes"
                value={notes}
                onChange={(event) => dispatch({ type: 'CONTEXT_PATCH', patch: { notes: event.target.value } })}
                className="flow-map-outcome-notes"
                placeholder="Add observations, evidence references, or next-step notes..."
              />

              <div className="flow-map-evidence" aria-label="Stage evidence capture">
                <h4>Evidence for {currentStageLabel || currentStage}</h4>
                <p>Capture concrete artifacts for this stage to improve reporting quality.</p>
                <div className="flow-map-evidence-grid">
                  <div className="flow-map-evidence-field">
                    <label htmlFor="flow-evidence-screenshot" className="flow-map-outcome-label">Screenshot URL or file</label>
                    <input
                      id="flow-evidence-screenshot"
                      type="text"
                      className="flow-map-evidence-input"
                      value={currentStageEvidence.screenshot}
                      onChange={(event) => updateCurrentStageEvidence('screenshot', event.target.value)}
                      placeholder="e.g. screenshot-login-error.png"
                    />
                  </div>
                  <div className="flow-map-evidence-field">
                    <label htmlFor="flow-evidence-status" className="flow-map-outcome-label">Observed status code</label>
                    <input
                      id="flow-evidence-status"
                      type="text"
                      inputMode="numeric"
                      className="flow-map-evidence-input"
                      value={currentStageEvidence.statusCode}
                      onChange={(event) => updateCurrentStageEvidence('statusCode', event.target.value)}
                      placeholder="e.g. 403"
                    />
                  </div>
                  <div className="flow-map-evidence-field flow-map-evidence-field--full">
                    <label htmlFor="flow-evidence-snippet" className="flow-map-outcome-label">Request or response snippet</label>
                    <textarea
                      id="flow-evidence-snippet"
                      className="flow-map-evidence-textarea"
                      value={currentStageEvidence.snippet}
                      onChange={(event) => updateCurrentStageEvidence('snippet', event.target.value)}
                      placeholder="Paste a short request/response excerpt"
                    />
                  </div>
                  <div className="flow-map-evidence-field flow-map-evidence-field--full">
                    <label htmlFor="flow-evidence-reproduction" className="flow-map-outcome-label">Reproduction note</label>
                    <textarea
                      id="flow-evidence-reproduction"
                      className="flow-map-evidence-textarea"
                      value={currentStageEvidence.reproduction}
                      onChange={(event) => updateCurrentStageEvidence('reproduction', event.target.value)}
                      placeholder="Describe exact steps to reproduce this stage evidence"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="flow-map-button"
                onClick={handleExportOutcome}
              >
                Copy outcome summary
              </button>
              <div className="flow-map-export-actions" aria-label="Flow outcome artifact exports">
                <button
                  type="button"
                  className="flow-map-button flow-map-button--ghost"
                  onClick={handleExportMarkdown}
                >
                  Download Markdown
                </button>
                <button
                  type="button"
                  className="flow-map-button flow-map-button--ghost"
                  onClick={handleExportJson}
                >
                  Download JSON
                </button>
              </div>
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

      {isCommandPaletteOpen ? (
        <div
          className="flow-map-command-backdrop"
          role="presentation"
          onClick={closeCommandPalette}
        >
          <section
            className="flow-map-command-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Flow command palette"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flow-map-command-head">
              <h2>Flow Command Palette</h2>
              <button
                type="button"
                className="flow-map-command-close"
                onClick={closeCommandPalette}
                aria-label="Close flow command palette"
              >
                Close
              </button>
            </div>

            <label htmlFor="flow-command-search" className="flow-map-command-label">
              Search finding, tool, vulnerability type, or outcome phrase
            </label>
            <input
              ref={commandInputRef}
              id="flow-command-search"
              type="text"
              className="flow-map-command-input"
              value={commandQuery}
              onChange={(event) => {
                setCommandQuery(event.target.value)
                setActiveCommandIndex(0)
              }}
              onKeyDown={handleCommandInputKeyDown}
              placeholder="Try: token, Burp, SQL injection, 403 after role change"
            />

            {filteredCommandOptions.length > 0 ? (
              <ul className="flow-map-command-list" role="listbox" aria-label="Flow command results">
                {filteredCommandOptions.map((option, index) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      className={`flow-map-command-item${index === activeCommandIndexSafe ? ' flow-map-command-item--active' : ''}`}
                      onClick={() => selectCommandOption(option)}
                      aria-label={`Open ${option.flowLabel} at ${option.stageLabel}`}
                      aria-selected={index === activeCommandIndexSafe}
                    >
                      <span className="flow-map-command-item-top">
                        <span className="flow-map-command-item-label">{option.label}</span>
                        <span className={`flow-map-command-kind flow-map-command-kind--${option.kind}`}>
                          {COMMAND_KIND_LABEL[option.kind] ?? 'Flow'}
                        </span>
                      </span>
                      <span className="flow-map-command-item-meta">
                        {option.flowLabel} → {option.stageLabel} · confidence {option.confidence}
                      </span>
                      <span className="flow-map-command-item-desc">{option.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flow-map-command-empty">No matches yet. Try another phrase.</p>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
