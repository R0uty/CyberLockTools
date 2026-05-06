/* @vitest-environment jsdom */

import { describe, expect, it, beforeEach } from 'vitest'
import {
  buildWorkspaceExport,
  clearWorkspaceCases,
  createWorkspaceCaseFromSession,
  deleteWorkspaceCase,
  readWorkspaceCases,
  restoreWorkspaceCaseSession,
  saveWorkspaceCase
} from './labWorkspace'

function createStorageMock() {
  let store = {}

  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value)
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
}

describe('labWorkspace utilities', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: createStorageMock(),
      configurable: true
    })
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('creates and saves a case file from current flow session state', () => {
    window.sessionStorage.setItem('flow-map-selected-flow', 'login')
    window.sessionStorage.setItem('flow-map-current-stage', 'test-login')
    window.sessionStorage.setItem('flow-map-notes', 'Observed role mismatch.')
    window.sessionStorage.setItem('flow-map-stage-history', JSON.stringify(['start', 'login-page', 'test-login']))
    window.sessionStorage.setItem('flow-map-decision-history', JSON.stringify([{ event: 'login.actionSelect' }]))
    window.sessionStorage.setItem('flow-map-stage-evidence', JSON.stringify({
      'test-login': { screenshot: 'login.png', snippet: '', statusCode: '200', reproduction: '' }
    }))

    const caseFile = createWorkspaceCaseFromSession({
      title: 'Admin login follow-up',
      tags: 'auth, login, auth'
    })
    const cases = saveWorkspaceCase(caseFile)

    expect(caseFile.flowKey).toBe('login')
    expect(caseFile.currentStageId).toBe('test-login')
    expect(caseFile.tags).toEqual(['auth', 'login'])
    expect(caseFile.evidenceCount).toBe(1)
    expect(cases).toHaveLength(1)
    expect(readWorkspaceCases()).toHaveLength(1)
  })

  it('restores a saved case back into session state', () => {
    const caseFile = {
      id: 'case-1',
      snapshot: {
        selectedFlow: 'decode',
        currentStage: 'result',
        selectedTool: 'Base64',
        selectedAction: 'decode.openTool',
        selectedOutcome: 'readable',
        notes: 'Decoded token.',
        stageHistory: ['start', 'encoded', 'decode', 'result'],
        decisionHistory: [{ event: 'decode.result' }],
        stageEvidence: { result: { snippet: 'hello', screenshot: '', statusCode: '', reproduction: '' } },
        outcomeSignal: { confidence: 'high', severity: 'low' },
        outcomeProfile: { confidence: 'high', severity: 'low', recommendedNextFlows: [] }
      }
    }

    restoreWorkspaceCaseSession(caseFile)

    expect(window.sessionStorage.getItem('flow-map-selected-flow')).toBe('decode')
    expect(window.sessionStorage.getItem('flow-map-current-stage')).toBe('result')
    expect(window.sessionStorage.getItem('flow-map-selected-tool')).toBe('Base64')
    expect(JSON.parse(window.sessionStorage.getItem('flow-map-stage-history') || '[]')).toEqual(['start', 'encoded', 'decode', 'result'])
  })

  it('deletes case files and exports workspace JSON', () => {
    const caseFile = {
      id: 'case-2',
      title: 'One case',
      createdAt: '2026-05-07T00:00:00.000Z',
      updatedAt: '2026-05-07T00:00:00.000Z',
      snapshot: {}
    }

    saveWorkspaceCase(caseFile)
    const afterDelete = deleteWorkspaceCase('case-2')

    expect(afterDelete).toEqual([])
    clearWorkspaceCases()
    expect(JSON.parse(buildWorkspaceExport([])).caseCount).toBe(0)
  })
})
