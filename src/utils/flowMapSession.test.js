/* @vitest-environment jsdom */

import { describe, expect, it, beforeEach } from 'vitest'
import { FLOW_MAP_SESSION_STORAGE_KEY, readFlowMapSessionState, writeFlowMapRouteState, writeFlowMapSessionState } from './flowMapSession'

describe('flowMapSession helpers', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('writes a versioned snapshot and mirrors legacy keys', () => {
    writeFlowMapSessionState({
      machineState: {
        selectedFlow: 'login',
        currentStage: 'test-login',
        selectedTool: 'Burp Suite',
        stageHistory: ['start', 'login-page', 'test-login'],
        notes: 'Need another repro pass.'
      },
      progressState: {
        completedFlows: ['decode'],
        inProgressFlows: ['login']
      }
    })

    const storedSnapshot = JSON.parse(window.sessionStorage.getItem(FLOW_MAP_SESSION_STORAGE_KEY) || '{}')
    expect(storedSnapshot.version).toBe(1)
    expect(storedSnapshot.machineState.selectedFlow).toBe('login')
    expect(window.sessionStorage.getItem('flow-map-selected-flow')).toBe('login')
    expect(window.sessionStorage.getItem('flow-map-current-stage')).toBe('test-login')
    expect(JSON.parse(window.sessionStorage.getItem('flow-map-in-progress') || '[]')).toEqual(['login'])
  })

  it('merges legacy route updates over the shared snapshot', () => {
    writeFlowMapSessionState({
      machineState: {
        selectedFlow: 'decode',
        currentStage: 'result',
        stageHistory: ['start', 'encoded', 'decode', 'result']
      },
      progressState: {
        completedFlows: ['decode']
      }
    })

    writeFlowMapRouteState({ flowKey: 'login', stageId: 'login-page' })

    const state = readFlowMapSessionState()
    expect(state.machineState.selectedFlow).toBe('login')
    expect(state.machineState.currentStage).toBe('login-page')
    expect(state.machineState.stageHistory).toEqual(['start', 'encoded', 'decode', 'result'])
    expect(state.progressState.completedFlows).toEqual(['decode'])
  })
})
