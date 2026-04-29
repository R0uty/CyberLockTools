/* @vitest-environment jsdom */

import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import FlowMap from './FlowMap'

describe('FlowMap happy-path integration', () => {
  const writeTextMock = vi.fn()

  beforeEach(() => {
    window.scrollTo = vi.fn()
    window.sessionStorage.clear()
    writeTextMock.mockReset()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('completes decode flow end-to-end, triggers tool callback, and persists completion status', () => {
    const onToolClick = vi.fn()
    const { unmount } = render(<FlowMap onToolClick={onToolClick} />)
    const storyPanel = () => document.querySelector('.flow-map-story-panel')

    fireEvent.click(screen.getByRole('button', { name: 'Decode Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))

    expect(within(storyPanel()).getByRole('heading', { name: 'Possible Encoding' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Try decoding' }))
    expect(within(storyPanel()).getByRole('heading', { name: 'Decode' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Open Base64' }))

    expect(onToolClick).toHaveBeenCalledWith('Base64')
    expect(within(storyPanel()).getByRole('heading', { name: 'Result' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Readable text' }))
    expect(within(storyPanel()).getByRole('heading', { name: 'Success' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Change flow' }))
    expect(screen.getByText(/1\/\d+ completed/)).toBeTruthy()

    unmount()

    render(<FlowMap onToolClick={onToolClick} />)
    expect(screen.getByText(/1\/\d+ completed/)).toBeTruthy()
  })

  it('starts from finding quick-entry and exports a flow outcome summary', async () => {
    render(<FlowMap onToolClick={vi.fn()} />)
    const storyPanel = () => document.querySelector('.flow-map-story-panel')

    fireEvent.click(screen.getByRole('button', { name: 'I found a login page' }))

    expect(within(storyPanel()).getByRole('heading', { name: 'Login Page' })).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Observed role mismatch on admin endpoint' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Copy outcome summary' }))

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1)
    })
    const copiedText = writeTextMock.mock.calls[0][0]
    expect(copiedText).toContain('Flow Outcome Export')
    expect(copiedText).toContain('Login Entry Flow')
    expect(copiedText).toContain('Observed role mismatch on admin endpoint')
  })
})
