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
})
