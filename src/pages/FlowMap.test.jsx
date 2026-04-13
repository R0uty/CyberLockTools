/* @vitest-environment jsdom */

import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import FlowMap from './FlowMap'

function renderFlowMap() {
  const onToolClick = vi.fn()
  render(<FlowMap onToolClick={onToolClick} />)
  return { onToolClick }
}

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

    const stageTabs = screen.getByLabelText('Flow steps')
    const startTab = within(stageTabs).getByRole('button', { name: /Start$/i })
    const loginPageTab = within(stageTabs).getByRole('button', { name: /Login Page/i })

    expect(startTab.disabled).toBe(false)
    expect(loginPageTab.disabled).toBe(true)

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
    expect(loginPageTab.disabled).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: 'Try common/default credentials' }))
    expect(within(progressPanel).getByRole('heading', { name: 'Test Login' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Continue to Result' }))
    expect(within(progressPanel).getByRole('heading', { name: 'Result' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Error message' }))
    expect(within(progressPanel).getByRole('heading', { name: 'Analyze Error' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Continue to Next Step' }))
    expect(within(progressPanel).getByRole('heading', { name: 'Next Step' })).toBeTruthy()

    const nextStepTab = within(stageTabs).getByRole('button', { name: /Next Step/i })
    expect(nextStepTab.disabled).toBe(false)
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

    expect(loginPageTab.disabled).toBe(true)
    expect(testLoginTab.disabled).toBe(true)
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
      flowButton: 'Request Tampering Flow',
      step2Heading: 'HTTP Request Observed',
      step2Action: 'Modify the request',
      step3Heading: 'Tamper Request',
    },
    {
      flowButton: 'Controlled Exploitation Flow',
      step2Heading: 'Confirmed Finding',
      step2Action: 'Use a read-only proof',
      step3Heading: 'Prepare Validation',
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
})
