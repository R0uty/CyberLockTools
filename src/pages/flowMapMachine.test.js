import { describe, expect, it } from 'vitest'
import { resolveFlowTransition } from './flowMapMachine'

describe('flowMapMachine outcome profiles', () => {
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
})
