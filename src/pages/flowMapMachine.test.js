import { describe, expect, it } from 'vitest'
import { ACTIVE_FLOW_GROUP_KEYS, FLOWS, getFlowStartStage } from '../data/flowMapConfig'
import { resolveFlowTransition, validateFlowConfigConsistency } from './flowMapMachine'

describe('flowMapMachine outcome profiles', () => {
  it('derives start-flow transitions from the flow config order', () => {
    expect(getFlowStartStage('login')).toBe('login-page')
    expect(getFlowStartStage('ctf-web')).toBe('source-hint-found')

    const transition = resolveFlowTransition('startFlow', {
      selectedFlow: 'login'
    })

    expect(transition?.nextStage).toBe('login-page')
  })

  it('attaches a typed outcome profile for response token findings', () => {
    const transition = resolveFlowTransition('response.result', {
      payload: 'found-token',
      currentFlowTools: [
        { name: 'Burp Suite Repeater' },
        { name: 'Browser DevTools' }
      ]
    })

    expect(transition?.outcomeProfile).toBeTruthy()
    expect(transition.outcomeProfile.confidence).toBe('high')
    expect(transition.outcomeProfile.severity).toBe('high')
    expect(transition.outcomeProfile.reportingHint).toMatch(/token/i)
    expect(transition.outcomeProfile.evidenceChecklist.length).toBeGreaterThan(1)
    expect(transition.outcomeProfile.recommendedNextFlows.some((entry) => entry.flowKey === 'decode')).toBe(true)
    expect(transition.followUpFlows.some((entry) => entry.flowKey === 'decode')).toBe(true)
  })

  it('falls back to flow tool names when profile does not define related tools', () => {
    const transition = resolveFlowTransition('request.result', {
      payload: 'different-data-returned',
      currentFlowTools: [
        { name: 'Burp Suite Repeater' },
        { name: 'curl' },
        { name: 'Browser DevTools' }
      ]
    })

    expect(transition?.outcomeProfile?.relatedTools).toEqual([
      'Burp Suite Repeater',
      'curl',
      'Browser DevTools'
    ])
  })

  it('keeps the shipped flow config internally consistent', () => {
    expect(validateFlowConfigConsistency({
      flows: FLOWS,
      activeGroupKeys: ACTIVE_FLOW_GROUP_KEYS
    })).toEqual([])
  })

  it('flags active flows that do not keep start as the first stage', () => {
    expect(validateFlowConfigConsistency({
      flows: {
        broken: {
          group: 'testing',
          stages: ['test-input', 'start'],
          nodes: [
            { id: 'start', label: 'Start' },
            { id: 'test-input', label: 'Test Input' }
          ],
          connections: [['start', 'test-input']]
        }
      },
      activeGroupKeys: new Set(['testing'])
    })).toContain('[broken] must declare "start" as the first stage.')
  })
})
