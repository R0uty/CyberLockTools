import {
  STORAGE_ACTION_KEY,
  STORAGE_COMPLETED_KEY,
  STORAGE_DECISION_HISTORY_KEY,
  STORAGE_FEEDBACK_KEY,
  STORAGE_FLOW_KEY,
  STORAGE_IN_PROGRESS_KEY,
  STORAGE_NOTES_KEY,
  STORAGE_OUTCOME_KEY,
  STORAGE_OUTCOME_PROFILE_KEY,
  STORAGE_OUTCOME_SIGNAL_KEY,
  STORAGE_STAGE_EVIDENCE_KEY,
  STORAGE_STAGE_HISTORY_KEY,
  STORAGE_STAGE_KEY,
  STORAGE_TOOL_KEY
} from '../data/flowMapConfig'
import { hasSessionValue, readSessionValue, writeSessionValue } from './sessionStorage'

export const FLOW_MAP_SESSION_STORAGE_KEY = 'flow-map-session-v1'
export const FLOW_MAP_SESSION_VERSION = 1

const DEFAULT_MACHINE_STATE = {
  selectedFlow: '',
  currentStage: 'start',
  selectedTool: '',
  feedback: '',
  selectedAction: '',
  selectedOutcome: '',
  outcomeSignal: {},
  outcomeProfile: {},
  followUpFlows: [],
  stageHistory: [],
  decisionHistory: [],
  stageEvidence: {},
  notes: '',
  zoomLevel: 1
}

const DEFAULT_PROGRESS_STATE = {
  completedFlows: [],
  inProgressFlows: []
}

function parseJsonValue(rawValue, fallback) {
  try {
    const parsed = JSON.parse(rawValue)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function normalizeStringArray(value) {
  const entries = Array.isArray(value) ? value : [...(value instanceof Set ? value : [])]
  return entries.filter((entry) => typeof entry === 'string' && entry.length > 0)
}

function normalizeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function normalizeMachineState(value = {}) {
  return {
    selectedFlow: typeof value.selectedFlow === 'string' ? value.selectedFlow : '',
    currentStage: typeof value.currentStage === 'string' ? value.currentStage : 'start',
    selectedTool: typeof value.selectedTool === 'string' ? value.selectedTool : '',
    feedback: typeof value.feedback === 'string' ? value.feedback : '',
    selectedAction: typeof value.selectedAction === 'string' ? value.selectedAction : '',
    selectedOutcome: typeof value.selectedOutcome === 'string' ? value.selectedOutcome : '',
    outcomeSignal: normalizeObject(value.outcomeSignal),
    outcomeProfile: normalizeObject(value.outcomeProfile),
    followUpFlows: Array.isArray(value.followUpFlows) ? value.followUpFlows : [],
    stageHistory: Array.isArray(value.stageHistory) ? value.stageHistory : [],
    decisionHistory: Array.isArray(value.decisionHistory) ? value.decisionHistory : [],
    stageEvidence: normalizeObject(value.stageEvidence),
    notes: typeof value.notes === 'string' ? value.notes : '',
    zoomLevel: Number.isFinite(value.zoomLevel) ? value.zoomLevel : 1
  }
}

function normalizeProgressState(value = {}) {
  return {
    completedFlows: normalizeStringArray(value.completedFlows),
    inProgressFlows: normalizeStringArray(value.inProgressFlows)
  }
}

function readSnapshotState() {
  if (!hasSessionValue(FLOW_MAP_SESSION_STORAGE_KEY)) {
    return null
  }

  const rawValue = readSessionValue(FLOW_MAP_SESSION_STORAGE_KEY, '')
  if (!rawValue) {
    return null
  }

  const parsed = parseJsonValue(rawValue, null)
  if (!parsed || typeof parsed !== 'object') {
    return null
  }

  return {
    machineState: normalizeMachineState(parsed.machineState),
    progressState: normalizeProgressState(parsed.progressState)
  }
}

function readLegacyMachineState() {
  const nextMachineState = {}

  if (hasSessionValue(STORAGE_FLOW_KEY)) {
    nextMachineState.selectedFlow = readSessionValue(STORAGE_FLOW_KEY, '')
  }

  if (hasSessionValue(STORAGE_STAGE_KEY)) {
    nextMachineState.currentStage = readSessionValue(STORAGE_STAGE_KEY, 'start')
  }

  if (hasSessionValue(STORAGE_TOOL_KEY)) {
    nextMachineState.selectedTool = readSessionValue(STORAGE_TOOL_KEY, '')
  }

  if (hasSessionValue(STORAGE_FEEDBACK_KEY)) {
    nextMachineState.feedback = readSessionValue(STORAGE_FEEDBACK_KEY, '')
  }

  if (hasSessionValue(STORAGE_ACTION_KEY)) {
    nextMachineState.selectedAction = readSessionValue(STORAGE_ACTION_KEY, '')
  }

  if (hasSessionValue(STORAGE_OUTCOME_KEY)) {
    nextMachineState.selectedOutcome = readSessionValue(STORAGE_OUTCOME_KEY, '')
  }

  if (hasSessionValue(STORAGE_OUTCOME_SIGNAL_KEY)) {
    nextMachineState.outcomeSignal = parseJsonValue(readSessionValue(STORAGE_OUTCOME_SIGNAL_KEY, '{}'), {})
  }

  if (hasSessionValue(STORAGE_OUTCOME_PROFILE_KEY)) {
    nextMachineState.outcomeProfile = parseJsonValue(readSessionValue(STORAGE_OUTCOME_PROFILE_KEY, '{}'), {})
  }

  if (hasSessionValue(STORAGE_STAGE_HISTORY_KEY)) {
    nextMachineState.stageHistory = parseJsonValue(readSessionValue(STORAGE_STAGE_HISTORY_KEY, '[]'), [])
  }

  if (hasSessionValue(STORAGE_DECISION_HISTORY_KEY)) {
    nextMachineState.decisionHistory = parseJsonValue(readSessionValue(STORAGE_DECISION_HISTORY_KEY, '[]'), [])
  }

  if (hasSessionValue(STORAGE_STAGE_EVIDENCE_KEY)) {
    nextMachineState.stageEvidence = parseJsonValue(readSessionValue(STORAGE_STAGE_EVIDENCE_KEY, '{}'), {})
  }

  if (hasSessionValue(STORAGE_NOTES_KEY)) {
    nextMachineState.notes = readSessionValue(STORAGE_NOTES_KEY, '')
  }

  return normalizeMachineState(nextMachineState)
}

function readLegacyProgressState() {
  const nextProgressState = {}

  if (hasSessionValue(STORAGE_COMPLETED_KEY)) {
    nextProgressState.completedFlows = parseJsonValue(readSessionValue(STORAGE_COMPLETED_KEY, '[]'), [])
  }

  if (hasSessionValue(STORAGE_IN_PROGRESS_KEY)) {
    nextProgressState.inProgressFlows = parseJsonValue(readSessionValue(STORAGE_IN_PROGRESS_KEY, '[]'), [])
  }

  return normalizeProgressState(nextProgressState)
}

export function readFlowMapSessionState() {
  const snapshotState = readSnapshotState()

  return {
    machineState: normalizeMachineState({
      ...DEFAULT_MACHINE_STATE,
      ...snapshotState?.machineState,
      ...readLegacyMachineState()
    }),
    progressState: normalizeProgressState({
      ...DEFAULT_PROGRESS_STATE,
      ...snapshotState?.progressState,
      ...readLegacyProgressState()
    })
  }
}

export function writeFlowMapSessionState({ machineState = {}, progressState = {} } = {}) {
  const normalizedMachineState = normalizeMachineState({
    ...DEFAULT_MACHINE_STATE,
    ...machineState
  })
  const normalizedProgressState = normalizeProgressState({
    ...DEFAULT_PROGRESS_STATE,
    ...progressState
  })

  writeSessionValue(FLOW_MAP_SESSION_STORAGE_KEY, JSON.stringify({
    version: FLOW_MAP_SESSION_VERSION,
    machineState: normalizedMachineState,
    progressState: normalizedProgressState
  }))

  writeSessionValue(STORAGE_FLOW_KEY, normalizedMachineState.selectedFlow)
  writeSessionValue(STORAGE_STAGE_KEY, normalizedMachineState.currentStage)
  writeSessionValue(STORAGE_TOOL_KEY, normalizedMachineState.selectedTool)
  writeSessionValue(STORAGE_FEEDBACK_KEY, normalizedMachineState.feedback)
  writeSessionValue(STORAGE_ACTION_KEY, normalizedMachineState.selectedAction)
  writeSessionValue(STORAGE_OUTCOME_KEY, normalizedMachineState.selectedOutcome)
  writeSessionValue(STORAGE_OUTCOME_SIGNAL_KEY, JSON.stringify(normalizedMachineState.outcomeSignal))
  writeSessionValue(STORAGE_OUTCOME_PROFILE_KEY, JSON.stringify(normalizedMachineState.outcomeProfile))
  writeSessionValue(STORAGE_STAGE_HISTORY_KEY, JSON.stringify(normalizedMachineState.stageHistory))
  writeSessionValue(STORAGE_DECISION_HISTORY_KEY, JSON.stringify(normalizedMachineState.decisionHistory))
  writeSessionValue(STORAGE_STAGE_EVIDENCE_KEY, JSON.stringify(normalizedMachineState.stageEvidence))
  writeSessionValue(STORAGE_NOTES_KEY, normalizedMachineState.notes)
  writeSessionValue(STORAGE_COMPLETED_KEY, JSON.stringify(normalizedProgressState.completedFlows))
  writeSessionValue(STORAGE_IN_PROGRESS_KEY, JSON.stringify(normalizedProgressState.inProgressFlows))
}

export function writeFlowMapRouteState({ flowKey = '', stageId = 'start' } = {}) {
  const { machineState, progressState } = readFlowMapSessionState()

  writeFlowMapSessionState({
    machineState: {
      ...machineState,
      selectedFlow: flowKey,
      currentStage: stageId
    },
    progressState
  })
}
