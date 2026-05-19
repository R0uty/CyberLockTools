import { FLOWS } from '../data/flowMapConfig'
import { readLocalValue, writeLocalValue } from './localStorage'
import { readFlowMapSessionState, writeFlowMapSessionState } from './flowMapSession'

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
  const { machineState } = readFlowMapSessionState()
  const flowKey = machineState.selectedFlow
  const flow = FLOWS[flowKey]

  if (!flow) {
    return null
  }

  const currentStageId = machineState.currentStage
  const selectedTool = machineState.selectedTool
  const selectedAction = machineState.selectedAction
  const selectedOutcome = machineState.selectedOutcome
  const notes = machineState.notes
  const stageHistory = Array.isArray(machineState.stageHistory) ? machineState.stageHistory : []
  const decisionHistory = Array.isArray(machineState.decisionHistory) ? machineState.decisionHistory : []
  const stageEvidence = machineState.stageEvidence && typeof machineState.stageEvidence === 'object'
    ? machineState.stageEvidence
    : {}
  const outcomeSignal = machineState.outcomeSignal && typeof machineState.outcomeSignal === 'object'
    ? machineState.outcomeSignal
    : {}
  const outcomeProfile = machineState.outcomeProfile && typeof machineState.outcomeProfile === 'object'
    ? machineState.outcomeProfile
    : {}
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

  const { progressState } = readFlowMapSessionState()

  writeFlowMapSessionState({
    machineState: {
      selectedFlow: snapshot.selectedFlow || '',
      currentStage: snapshot.currentStage || 'start',
      selectedTool: snapshot.selectedTool || '',
      selectedAction: snapshot.selectedAction || '',
      selectedOutcome: snapshot.selectedOutcome || '',
      notes: snapshot.notes || '',
      stageHistory: snapshot.stageHistory ?? [],
      decisionHistory: snapshot.decisionHistory ?? [],
      stageEvidence: snapshot.stageEvidence ?? {},
      outcomeSignal: snapshot.outcomeSignal ?? {},
      outcomeProfile: snapshot.outcomeProfile ?? {}
    },
    progressState
  })
}

export function buildWorkspaceExport(caseFiles) {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    caseCount: caseFiles.length,
    caseFiles
  }, null, 2)
}
