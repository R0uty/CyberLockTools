/* @vitest-environment jsdom */

import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import FlowMap from './FlowMap'
import {
  FINDING_QUICK_STARTS,
  FLOW_OUTCOME_PHRASE_STARTS,
  FLOWS,
  STORAGE_COMPLETED_KEY,
  STORAGE_IN_PROGRESS_KEY,
  VULNERABILITY_TYPE_STARTS
} from '../data/flowMapConfig'

function renderFlowMap() {
  const onToolClick = vi.fn()
  render(<FlowMap onToolClick={onToolClick} />)
  return { onToolClick }
}

describe('FINDING_QUICK_STARTS config', () => {
  it('every entry has the required fields', () => {
    for (const entry of FINDING_QUICK_STARTS) {
      expect(entry.id, `${entry.id} missing id`).toBeTruthy()
      expect(entry.label, `${entry.id} missing label`).toBeTruthy()
      expect(entry.description, `${entry.id} missing description`).toBeTruthy()
      expect(entry.category, `${entry.id} missing category`).toBeTruthy()
      expect(entry.flowKey, `${entry.id} missing flowKey`).toBeTruthy()
      expect(entry.stageId, `${entry.id} missing stageId`).toBeTruthy()
      expect(['low', 'medium', 'high']).toContain(entry.confidence)
    }
  })

  it('every flowKey references a real flow in FLOWS', () => {
    for (const entry of FINDING_QUICK_STARTS) {
      expect(FLOWS[entry.flowKey], `${entry.id} flowKey "${entry.flowKey}" not in FLOWS`).toBeTruthy()
    }
  })

  it('every stageId references a real stage in its flow', () => {
    for (const entry of FINDING_QUICK_STARTS) {
      const flow = FLOWS[entry.flowKey]
      if (!flow) continue
      expect(
        flow.stages.includes(entry.stageId),
        `${entry.id} stageId "${entry.stageId}" not found in flow "${entry.flowKey}" stages`
      ).toBe(true)
    }
  })

  it('all ids are unique', () => {
    const ids = FINDING_QUICK_STARTS.map(e => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('flow command datasets', () => {
  it('maps outcome phrase starts to valid flow stages', () => {
    for (const entry of FLOW_OUTCOME_PHRASE_STARTS) {
      const flow = FLOWS[entry.flowKey]
      expect(flow, `${entry.id} has unknown flow ${entry.flowKey}`).toBeTruthy()
      expect(flow.stages.includes(entry.stageId), `${entry.id} has unknown stage ${entry.stageId}`).toBe(true)
      expect(['low', 'medium', 'high']).toContain(entry.confidence)
    }
  })

  it('maps vulnerability starts to valid flow stages', () => {
    for (const entry of VULNERABILITY_TYPE_STARTS) {
      const flow = FLOWS[entry.flowKey]
      expect(flow, `${entry.id} has unknown flow ${entry.flowKey}`).toBeTruthy()
      expect(flow.stages.includes(entry.stageId), `${entry.id} has unknown stage ${entry.stageId}`).toBe(true)
      expect(['low', 'medium', 'high']).toContain(entry.confidence)
    }
  })
})

describe('FlowMap interactions', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
    window.sessionStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('allows selecting a flow and keeps future stage tabs locked before start', () => {
    renderFlowMap()

    fireEvent.click(screen.getByRole('button', { name: 'Login Entry Flow' }))

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: 'Ready to begin' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Why this matters' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'What would count as a real signal' })).toBeTruthy()

    const stageTabs = screen.getByLabelText('Flow steps')
    const startTab = within(stageTabs).getByRole('button', { name: /Start$/i })
    const loginPageTab = within(stageTabs).getByRole('button', { name: /Login Page/i })

    expect(startTab.getAttribute('aria-disabled')).not.toBe('true')
    expect(loginPageTab.getAttribute('aria-disabled')).toBe('true')

    fireEvent.click(loginPageTab)

    expect(within(progressPanel).getByRole('heading', { name: 'Ready to begin' })).toBeTruthy()
  })

  it('starts a flow, progresses through stages, and unlocks stage tabs', () => {
    renderFlowMap()

    fireEvent.click(screen.getByRole('button', { name: 'Login Entry Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: 'Login Page' })).toBeTruthy()

    const stageTabs = screen.getByLabelText('Flow steps')
    const loginPageTab = within(stageTabs).getByRole('button', { name: /Login Page/i })
    expect(loginPageTab.getAttribute('aria-disabled')).not.toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Try common/default credentials' }))
    expect(within(progressPanel).getByRole('heading', { name: 'Test Login' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Continue to Result' }))
    expect(within(progressPanel).getByRole('heading', { name: 'Result' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Error message' }))
    expect(within(progressPanel).getByRole('heading', { name: 'Analyze Error' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Continue to Next Step' }))
    expect(within(progressPanel).getByRole('heading', { name: 'Next Step' })).toBeTruthy()

    const nextStepTab = within(stageTabs).getByRole('button', { name: /Next Step/i })
    expect(nextStepTab.getAttribute('aria-disabled')).not.toBe('true')
  })

  it('restarts from progress panel and locks later stages again', () => {
    renderFlowMap()

    fireEvent.click(screen.getByRole('button', { name: 'Login Entry Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Try common/default credentials' }))

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: 'Test Login' })).toBeTruthy()

    fireEvent.click(within(progressPanel).getByRole('button', { name: 'Restart' }))

    expect(within(progressPanel).getByRole('heading', { name: 'Ready to begin' })).toBeTruthy()

    const stageTabs = screen.getByLabelText('Flow steps')
    const loginPageTab = within(stageTabs).getByRole('button', { name: /Login Page/i })
    const testLoginTab = within(stageTabs).getByRole('button', { name: /Test Login/i })

    expect(loginPageTab.getAttribute('aria-disabled')).toBe('true')
    expect(testLoginTab.getAttribute('aria-disabled')).toBe('true')
  })

  it.each([
    {
      flowButton: 'Discovery Flow',
      step2Heading: 'Web Page Found',
      step2Action: 'Look for hidden content',
      step3Heading: 'Discovery',
    },
    {
      flowButton: 'Enumeration Flow',
      step2Heading: 'Service Found',
      step2Action: 'SMB or Windows service',
      step3Heading: 'Identify Service',
    },
    {
      flowButton: 'Login Entry Flow',
      step2Heading: 'Login Page',
      step2Action: 'Try common/default credentials',
      step3Heading: 'Test Login',
    },
    {
      flowButton: 'Input Testing Flow',
      step2Heading: 'Input Field Found',
      step2Action: 'Test how input is handled',
      step3Heading: 'Test Input',
    },
    {
      flowButton: 'API Testing Flow',
      step2Heading: 'API Endpoint Found',
      step2Action: 'Check OpenAPI or docs',
      step3Heading: 'Inspect Spec',
    },
    {
      flowButton: 'Request Tampering Flow',
      step2Heading: 'HTTP Request Observed',
      step2Action: 'Modify the request',
      step3Heading: 'Tamper Request',
    },
    {
      flowButton: 'Authorization Testing Flow',
      step2Heading: 'Privileged Action Found',
      step2Action: 'Test role boundary',
      step3Heading: 'Baseline Request',
    },
    {
      flowButton: 'Controlled Exploitation Flow',
      step2Heading: 'Confirmed Finding',
      step2Action: 'Use a read-only proof',
      step3Heading: 'Prepare Validation',
    },
    {
      flowButton: 'Information Disclosure Flow',
      step2Heading: 'Source Found',
      step2Action: 'Review page source and JS files',
      step3Heading: 'Inspect Source',
    },
    {
      flowButton: 'Session Testing Flow',
      step2Heading: 'Session Captured',
      step2Action: 'Check cookie flags and scope',
      step3Heading: 'Inspect Session',
    },
    {
      flowButton: 'File Upload Testing Flow',
      step2Heading: 'Upload Found',
      step2Action: 'Test extension filtering',
      step3Heading: 'Test Upload',
    },
    {
      flowButton: 'Response Analysis Flow',
      step2Heading: 'Response Data Found',
      step2Action: 'Inspect the response',
      step3Heading: 'Analyze Data',
    },
    {
      flowButton: 'Decode Flow',
      step2Heading: 'Encoded?',
      step2Action: 'Try decoding',
      step3Heading: 'Decode',
    },
  ])('covers active flow family path: $flowButton', ({ flowButton, step2Heading, step2Action, step3Heading }) => {
    renderFlowMap()

    fireEvent.click(screen.getByRole('button', { name: flowButton }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: step2Heading })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: step2Action }))
    expect(within(progressPanel).getByRole('heading', { name: step3Heading })).toBeTruthy()
  })

  it('opens command palette with Ctrl+K and jumps using an outcome phrase', () => {
    renderFlowMap()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    const dialog = screen.getByRole('dialog', { name: 'Flow command palette' })
    const input = within(dialog).getByLabelText('Search finding, tool, vulnerability type, or outcome phrase')

    fireEvent.change(input, { target: { value: 'token found in response' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: 'Interesting Data' })).toBeTruthy()
  })

  it('supports searching by vulnerability type and selecting result by click', () => {
    renderFlowMap()

    fireEvent.click(screen.getByRole('button', { name: 'Open flow command palette' }))

    const dialog = screen.getByRole('dialog', { name: 'Flow command palette' })
    const input = within(dialog).getByLabelText('Search finding, tool, vulnerability type, or outcome phrase')
    fireEvent.change(input, { target: { value: 'SQL injection' } })

    const resultButtons = within(dialog).getAllByRole('button', { name: 'Open Input Testing Flow at Input Field Found' })
    fireEvent.click(resultButtons[0])

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: 'Input Field Found' })).toBeTruthy()
  })

  it('shows group-level completed, in-progress, and untouched states from persisted progress', () => {
    window.sessionStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(['discovery', 'info-disclosure']))
    window.sessionStorage.setItem(STORAGE_IN_PROGRESS_KEY, JSON.stringify(['input']))

    renderFlowMap()

    const groupProgress = screen.getByLabelText('Flow group progress')

    expect(within(groupProgress).getByLabelText('Reconnaissance completed')).toBeTruthy()
    expect(within(groupProgress).getByLabelText('Testing in-progress')).toBeTruthy()
    expect(within(groupProgress).getByLabelText('Vulnerability Validation untouched')).toBeTruthy()
  })

  it('shows a step visual inside the story panel for the active flow stage', () => {
    renderFlowMap()

    fireEvent.click(screen.getByRole('button', { name: 'Discovery Flow' }))

    const storyVisual = screen.getByLabelText('Discovery Flow step visual')
    expect(within(storyVisual).getByLabelText('Current step: Start')).toBeTruthy()
    expect(within(storyVisual).getByText('Web Page Found')).toBeTruthy()
  })

  it('shows dedicated story content for JWT flow instead of decode fallback copy', () => {
    renderFlowMap()

    fireEvent.click(screen.getByRole('button', { name: 'JWT Attack Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: 'JWT Discovered' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Start with alg:none / unsigned token' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Possible Encoding' })).toBeNull()
  })

  it('supports command palette outcome jumps for newer flow vocabulary', () => {
    renderFlowMap()

    fireEvent.click(screen.getByRole('button', { name: 'Open flow command palette' }))

    const dialog = screen.getByRole('dialog', { name: 'Flow command palette' })
    const input = within(dialog).getByLabelText('Search finding, tool, vulnerability type, or outcome phrase')
    fireEvent.change(input, { target: { value: 'script executed in browser' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: 'Confirm XSS' })).toBeTruthy()
  })
})
