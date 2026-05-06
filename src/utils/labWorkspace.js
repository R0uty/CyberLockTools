import {
  FLOWS,
  STORAGE_ACTION_KEY,
  STORAGE_FLOW_KEY,
  STORAGE_NOTES_KEY,
  STORAGE_OUTCOME_KEY,
  STORAGE_OUTCOME_PROFILE_KEY,
  STORAGE_OUTCOME_SIGNAL_KEY,
  STORAGE_STAGE_EVIDENCE_KEY,
  STORAGE_STAGE_HISTORY_KEY,
  STORAGE_STAGE_KEY,
  STORAGE_DECISION_HISTORY_KEY,
  STORAGE_TOOL_KEY
} from '../data/flowMapConfig'
import { readLocalValue, writeLocalValue } from './localStorage'
import { readSessionValue, writeSessionValue } from './sessionStorage'

export const LAB_WORKSPACE_STORAGE_KEY = 'lab-workspace-cases'

function parseJsonValue(rawValue, fallback) {
  try {
    const parsed = JSON.parse(rawValue)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function getStageLabel(flow, stageId) {
  return flow?.nodes.find((node) => node.id === stageId)?.label ?? stageId
}

function normalizeTags(tags = '') {
  return [...new Set(
    tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  )]
}

function buildCaseId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `case-${Date.now()}`
}

function getEvidenceCount(stageEvidence = {}) {
  return Object.values(stageEvidence).filter((entry) => (
    entry && typeof entry === 'object' && Object.values(entry).some(Boolean)
  )).length
}

function normalizeCaseFile(caseFile) {
  if (!caseFile || typeof caseFile !== 'object') {
    return null
  }

  return {
    ...caseFile,
    tags: Array.isArray(caseFile.tags) ? caseFile.tags.filter(Boolean) : [],
    snapshot: caseFile.snapshot && typeof caseFile.snapshot === 'object' ? caseFile.snapshot : {}
  }
}

export function readWorkspaceCases() {
  const rawValue = readLocalValue(LAB_WORKSPACE_STORAGE_KEY, '[]')
  const parsed = parseJsonValue(rawValue, [])

  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed
    .map(normalizeCaseFile)
    .filter(Boolean)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
}

export function writeWorkspaceCases(caseFiles) {
  writeLocalValue(LAB_WORKSPACE_STORAGE_KEY, JSON.stringify(caseFiles))
}

export function getCurrentWorkspaceDraft() {
  const flowKey = readSessionValue(STORAGE_FLOW_KEY)
  const flow = FLOWS[flowKey]

  if (!flow) {
    return null
  }

  const currentStageId = readSessionValue(STORAGE_STAGE_KEY, 'start')
  const selectedTool = readSessionValue(STORAGE_TOOL_KEY)
  const selectedAction = readSessionValue(STORAGE_ACTION_KEY)
  const selectedOutcome = readSessionValue(STORAGE_OUTCOME_KEY)
  const notes = readSessionValue(STORAGE_NOTES_KEY)
  const stageHistory = parseJsonValue(readSessionValue(STORAGE_STAGE_HISTORY_KEY, '[]'), [])
  const decisionHistory = parseJsonValue(readSessionValue(STORAGE_DECISION_HISTORY_KEY, '[]'), [])
  const stageEvidence = parseJsonValue(readSessionValue(STORAGE_STAGE_EVIDENCE_KEY, '{}'), {})
  const outcomeSignal = parseJsonValue(readSessionValue(STORAGE_OUTCOME_SIGNAL_KEY, '{}'), {})
  const outcomeProfile = parseJsonValue(readSessionValue(STORAGE_OUTCOME_PROFILE_KEY, '{}'), {})
  const currentStageLabel = getStageLabel(flow, currentStageId)

  return {
    flowKey,
    flowLabel: flow.label,
    currentStageId,
    currentStageLabel,
    selectedTool,
    selectedAction,
    selectedOutcome,
    notes,
    stageHistory,
    decisionHistory,
    stageEvidence,
    outcomeSignal,
    outcomeProfile,
    evidenceCount: getEvidenceCount(stageEvidence),
    decisionCount: decisionHistory.length,
    visitedStageCount: stageHistory.length,
    titleSuggestion: `${flow.label} - ${currentStageLabel}`
  }
}

export function createWorkspaceCaseFromSession({ title = '', tags = '' } = {}) {
  const draft = getCurrentWorkspaceDraft()

  if (!draft) {
    throw new Error('Open a Flow Map path first so there is a current case to save.')
  }

  const timestamp = new Date().toISOString()

  return {
    id: buildCaseId(),
    title: title.trim() || draft.titleSuggestion,
    tags: normalizeTags(tags),
    createdAt: timestamp,
    updatedAt: timestamp,
    flowKey: draft.flowKey,
    flowLabel: draft.flowLabel,
    currentStageId: draft.currentStageId,
    currentStageLabel: draft.currentStageLabel,
    selectedTool: draft.selectedTool,
    selectedOutcome: draft.selectedOutcome,
    notes: draft.notes,
    evidenceCount: draft.evidenceCount,
    decisionCount: draft.decisionCount,
    visitedStageCount: draft.visitedStageCount,
    snapshot: {
      selectedFlow: draft.flowKey,
      currentStage: draft.currentStageId,
      selectedTool: draft.selectedTool,
      selectedAction: draft.selectedAction,
      selectedOutcome: draft.selectedOutcome,
      notes: draft.notes,
      stageHistory: draft.stageHistory,
      decisionHistory: draft.decisionHistory,
      stageEvidence: draft.stageEvidence,
      outcomeSignal: draft.outcomeSignal,
      outcomeProfile: draft.outcomeProfile
    }
  }
}

export function saveWorkspaceCase(caseFile) {
  const caseFiles = readWorkspaceCases()
  const nextCaseFiles = [caseFile, ...caseFiles]
  writeWorkspaceCases(nextCaseFiles)
  return nextCaseFiles
}

export function deleteWorkspaceCase(caseId) {
  const nextCaseFiles = readWorkspaceCases().filter((caseFile) => caseFile.id !== caseId)
  writeWorkspaceCases(nextCaseFiles)
  return nextCaseFiles
}

export function clearWorkspaceCases() {
  writeWorkspaceCases([])
  return []
}

export function restoreWorkspaceCaseSession(caseFile) {
  const snapshot = caseFile?.snapshot

  if (!snapshot || typeof snapshot !== 'object') {
    return
  }

  writeSessionValue(STORAGE_FLOW_KEY, snapshot.selectedFlow || '')
  writeSessionValue(STORAGE_STAGE_KEY, snapshot.currentStage || 'start')
  writeSessionValue(STORAGE_TOOL_KEY, snapshot.selectedTool || '')
  writeSessionValue(STORAGE_ACTION_KEY, snapshot.selectedAction || '')
  writeSessionValue(STORAGE_OUTCOME_KEY, snapshot.selectedOutcome || '')
  writeSessionValue(STORAGE_NOTES_KEY, snapshot.notes || '')
  writeSessionValue(STORAGE_STAGE_HISTORY_KEY, JSON.stringify(snapshot.stageHistory ?? []))
  writeSessionValue(STORAGE_DECISION_HISTORY_KEY, JSON.stringify(snapshot.decisionHistory ?? []))
  writeSessionValue(STORAGE_STAGE_EVIDENCE_KEY, JSON.stringify(snapshot.stageEvidence ?? {}))
  writeSessionValue(STORAGE_OUTCOME_SIGNAL_KEY, JSON.stringify(snapshot.outcomeSignal ?? {}))
  writeSessionValue(STORAGE_OUTCOME_PROFILE_KEY, JSON.stringify(snapshot.outcomeProfile ?? {}))
}

export function buildWorkspaceExport(caseFiles) {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    caseCount: caseFiles.length,
    caseFiles
  }, null, 2)
}
