/* @vitest-environment jsdom */

import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import FlowMap from './FlowMap'
import {
  STORAGE_ACTION_KEY,
  STORAGE_DECISION_HISTORY_KEY,
  STORAGE_FLOW_KEY,
  STORAGE_NOTES_KEY,
  STORAGE_OUTCOME_KEY,
  STORAGE_STAGE_EVIDENCE_KEY,
  STORAGE_STAGE_HISTORY_KEY,
  STORAGE_STAGE_KEY,
  STORAGE_TOOL_KEY,
  STORAGE_IN_PROGRESS_KEY,
} from '../data/flowMapConfig'

describe('FlowMap happy-path integration', () => {
  const writeTextMock = vi.fn()
  const createObjectURLMock = vi.fn()
  const revokeObjectURLMock = vi.fn()
  const originalAnchorClick = HTMLAnchorElement.prototype.click

  beforeEach(() => {
    window.scrollTo = vi.fn()
    window.sessionStorage.clear()
    writeTextMock.mockReset()
    createObjectURLMock.mockReset()
    revokeObjectURLMock.mockReset()
    createObjectURLMock.mockReturnValue('blob:flow-export')
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    })

    Object.defineProperty(window.URL, 'createObjectURL', {
      value: createObjectURLMock,
      configurable: true,
      writable: true,
    })

    Object.defineProperty(window.URL, 'revokeObjectURL', {
      value: revokeObjectURLMock,
      configurable: true,
      writable: true,
    })

    Object.defineProperty(HTMLAnchorElement.prototype, 'click', {
      value: vi.fn(),
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(HTMLAnchorElement.prototype, 'click', {
      value: originalAnchorClick,
      configurable: true,
      writable: true,
    })
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

    expect(onToolClick).toHaveBeenCalledWith(
      'Base64',
      expect.objectContaining({
        source: 'flow-map',
        flowKey: 'decode',
        stageId: 'decode',
        recommendedStageId: 'result'
      })
    )
    const flowOrigin = JSON.parse(window.sessionStorage.getItem('flow-map-tool-origin') || '{}')
    expect(flowOrigin).toMatchObject({
      source: 'flow-map',
      toolTitle: 'Base64',
      flowKey: 'decode',
      stageId: 'decode',
      recommendedFlowKey: 'decode',
      recommendedStageId: 'result'
    })
    expect(within(storyPanel()).getByRole('heading', { name: 'Result' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Readable text' }))
    expect(within(storyPanel()).getByRole('heading', { name: 'Success' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Change flow' }))
    expect(document.querySelector('.flow-map-completed-counter')?.textContent).toMatch(/1\/\d+ completed/)

    unmount()

    render(<FlowMap onToolClick={onToolClick} />)
    expect(document.querySelector('.flow-map-completed-counter')?.textContent).toMatch(/1\/\d+ completed/)
  })

  it('starts from finding quick-entry and exports a flow outcome summary', async () => {
    render(<FlowMap onToolClick={vi.fn()} />)
    const storyPanel = () => document.querySelector('.flow-map-story-panel')

    fireEvent.click(screen.getByRole('button', { name: 'I found a login page' }))

    expect(within(storyPanel()).getByRole('heading', { name: 'Login Page' })).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Observed role mismatch on admin endpoint' }
    })
    fireEvent.change(screen.getByLabelText('Screenshot URL or file'), {
      target: { value: 'login-page-capture.png' }
    })
    fireEvent.change(screen.getByLabelText('Observed status code'), {
      target: { value: '200' }
    })
    fireEvent.change(screen.getByLabelText('Request or response snippet'), {
      target: { value: 'POST /login HTTP/1.1\nSet-Cookie: session=abc123' }
    })
    fireEvent.change(screen.getByLabelText('Reproduction note'), {
      target: { value: 'Submit valid creds then refresh to confirm token remains stable.' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Copy outcome summary' }))

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1)
    })
    const copiedText = writeTextMock.mock.calls[0][0]
    expect(copiedText).toContain('Flow Outcome Export')
    expect(copiedText).toContain('Login Entry Flow')
    expect(copiedText).toContain('Observed role mismatch on admin endpoint')
    expect(copiedText).toContain('Stage evidence:')
    expect(copiedText).toContain('Login Page (login-page)')
    expect(copiedText).toContain('Screenshot/File: login-page-capture.png')
    expect(copiedText).toContain('Observed Status Code: 200')
    expect(copiedText).toContain('Set-Cookie: session=abc123')

    const storedEvidence = JSON.parse(window.sessionStorage.getItem('flow-map-stage-evidence') || '{}')
    expect(storedEvidence['login-page']).toMatchObject({
      screenshot: 'login-page-capture.png',
      statusCode: '200',
      reproduction: 'Submit valid creds then refresh to confirm token remains stable.'
    })
  })

  it('records jump-in from finding as explicit stage and decision history', () => {
    render(<FlowMap onToolClick={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'I found a login page' }))

    const storyPanel = document.querySelector('.flow-map-story-panel')
    expect(within(storyPanel).getByRole('heading', { name: 'Login Page' })).toBeTruthy()

    const storedStageHistory = JSON.parse(window.sessionStorage.getItem(STORAGE_STAGE_HISTORY_KEY) || '[]')
    expect(storedStageHistory).toEqual(['start', 'login-page'])

    const storedDecisionHistory = JSON.parse(window.sessionStorage.getItem(STORAGE_DECISION_HISTORY_KEY) || '[]')
    expect(storedDecisionHistory.some((entry) => entry?.event === 'quickStart.select')).toBe(true)
  })

  it('supports changing flows mid-progress and preserves in-progress tracking', () => {
    render(<FlowMap onToolClick={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Login Entry Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Try common/default credentials' }))

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: 'Test Login' })).toBeTruthy()

    fireEvent.click(within(progressPanel).getByRole('button', { name: 'Change flow' }))

    expect(screen.getByRole('heading', { name: 'Guided Testing Flows' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Decode Flow' }))
    const decodeStory = document.querySelector('.flow-map-story-panel')
    expect(within(decodeStory).getByRole('heading', { name: 'Decode Flow' })).toBeTruthy()

    const storedInProgress = JSON.parse(window.sessionStorage.getItem(STORAGE_IN_PROGRESS_KEY) || '[]')
    expect(storedInProgress).toContain('login')
  })

  it('resumes selected flow and stage from session state', () => {
    window.sessionStorage.setItem(STORAGE_FLOW_KEY, 'login')
    window.sessionStorage.setItem(STORAGE_STAGE_KEY, 'test-login')
    window.sessionStorage.setItem(STORAGE_TOOL_KEY, 'Hydra')
    window.sessionStorage.setItem(STORAGE_ACTION_KEY, 'login.actionSelect')
    window.sessionStorage.setItem(STORAGE_OUTCOME_KEY, 'error-message')
    window.sessionStorage.setItem(STORAGE_NOTES_KEY, 'Resume integration seed')
    window.sessionStorage.setItem(STORAGE_STAGE_HISTORY_KEY, JSON.stringify(['start', 'login-page', 'test-login']))
    window.sessionStorage.setItem(STORAGE_DECISION_HISTORY_KEY, JSON.stringify([
      {
        event: 'login.actionSelect',
        fromStage: 'login-page',
        toStage: 'test-login',
        payload: null,
      }
    ]))

    render(<FlowMap onToolClick={vi.fn()} />)

    const progressPanel = screen.getByLabelText('Flow progress')
    expect(within(progressPanel).getByRole('heading', { name: 'Test Login' })).toBeTruthy()
    const breadcrumb = within(progressPanel).getByLabelText('Flow breadcrumb')
    expect(breadcrumb.textContent).toContain('login')
    expect(breadcrumb.textContent).toContain('start')
    expect(breadcrumb.textContent).toContain('login-page')
    expect(breadcrumb.textContent).toContain('test-login')
  })

  it('shows cross-flow handoff recommendations with typed outcome insight and navigates to selected follow-up flow', async () => {
    const onToolClick = vi.fn()
    render(<FlowMap onToolClick={onToolClick} />)
    const storyPanel = () => document.querySelector('.flow-map-story-panel')

    fireEvent.click(screen.getByRole('button', { name: 'Response Analysis Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Inspect the response' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Data Check' }))
    fireEvent.click(screen.getByRole('button', { name: 'Found token' }))

    expect(within(storyPanel()).getByRole('heading', { name: 'Investigate Value' })).toBeTruthy()
    const signalPanel = screen.getByLabelText('Outcome confidence and severity')
    expect(within(signalPanel).getByText(/Confidence:\s*High/i)).toBeTruthy()
    expect(within(signalPanel).getByText(/Severity:\s*High/i)).toBeTruthy()
    expect(within(signalPanel).getByText(/Reporting hint:/i)).toBeTruthy()
    expect(within(signalPanel).getByLabelText('Outcome evidence checklist')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Copy outcome summary' }))

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1)
    })
    expect(writeTextMock.mock.calls[0][0]).toContain('Outcome signal: confidence=high; severity=high')

    expect(screen.getByRole('button', { name: 'Continue to Decode Flow' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue to Session Testing Flow' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue to Authorization Testing Flow' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Open Burp Suite Repeater' }))
    expect(onToolClick).toHaveBeenCalledWith(
      'Burp Suite Repeater',
      expect.objectContaining({
        source: 'flow-map',
        flowKey: 'response',
        stageId: 'investigate-value'
      })
    )

    fireEvent.click(screen.getByRole('button', { name: 'Continue to Decode Flow' }))

    expect(within(storyPanel()).getByRole('heading', { name: 'Possible Encoding' })).toBeTruthy()
  })

  it('captures low-confidence outcome branch metadata for inconclusive results', () => {
    render(<FlowMap onToolClick={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Login Entry Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Try common/default credentials' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Result' }))
    fireEvent.click(screen.getByRole('button', { name: 'No change' }))

    const signalPanel = screen.getByLabelText('Outcome confidence and severity')
    expect(within(signalPanel).getByText(/Confidence:\s*Low/i)).toBeTruthy()
    expect(within(signalPanel).getByText(/Severity:\s*Low/i)).toBeTruthy()
    expect(within(signalPanel).getByText(/Reporting hint:/i)).toBeTruthy()
  })

  it('exports explicit stage and decision history after backtracking', async () => {
    render(<FlowMap onToolClick={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Login Entry Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Try common/default credentials' }))

    const stageTabs = screen.getByLabelText('Flow steps')
    fireEvent.click(within(stageTabs).getByRole('button', { name: /Login Page/i }))

    fireEvent.click(screen.getByRole('button', { name: 'Copy outcome summary' }))

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1)
    })

    const copiedText = writeTextMock.mock.calls[0][0]
    expect(copiedText).toContain('Visited stages:')
    expect(copiedText).toContain('Test Login (test-login)')
    expect(copiedText).toContain('Login Page (login-page)')
    expect(copiedText).toContain('Decision history:')
    expect(copiedText).toContain('login.actionSelect')

    const storedStageHistory = JSON.parse(window.sessionStorage.getItem('flow-map-stage-history') || '[]')
    expect(storedStageHistory).toContain('test-login')

    const storedDecisionHistory = JSON.parse(window.sessionStorage.getItem('flow-map-decision-history') || '[]')
    expect(storedDecisionHistory.some((entry) => entry?.event === 'login.actionSelect')).toBe(true)
  })

  it('exports with partial notes and partial stage evidence without dropping empty fields', async () => {
    render(<FlowMap onToolClick={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Login Entry Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))
    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Need one more repro pass before triage.' }
    })
    fireEvent.change(screen.getByLabelText('Screenshot URL or file'), {
      target: { value: 'login-check-1.png' }
    })

    fireEvent.click(screen.getByRole('button', { name: 'Copy outcome summary' }))

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1)
    })

    const copiedText = writeTextMock.mock.calls[0][0]
    expect(copiedText).toContain('Need one more repro pass before triage.')
    expect(copiedText).toContain('Screenshot/File: login-check-1.png')
    expect(copiedText).toContain('Request/Response Snippet: None')
    expect(copiedText).toContain('Observed Status Code: None')
    expect(copiedText).toContain('Reproduction Note: None')

    const storedEvidence = JSON.parse(window.sessionStorage.getItem(STORAGE_STAGE_EVIDENCE_KEY) || '{}')
    expect(storedEvidence['login-page']).toMatchObject({ screenshot: 'login-check-1.png' })
  })

  it('downloads Markdown and JSON artifacts from the outcome panel', async () => {
    render(<FlowMap onToolClick={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Login Entry Flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start flow' }))
    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Artifact export test note' }
    })

    fireEvent.click(screen.getByRole('button', { name: 'Download Markdown' }))
    fireEvent.click(screen.getByRole('button', { name: 'Download JSON' }))

    expect(createObjectURLMock).toHaveBeenCalledTimes(2)
    expect(revokeObjectURLMock).toHaveBeenCalledTimes(2)

    const markdownBlob = createObjectURLMock.mock.calls[0][0]
    const jsonBlob = createObjectURLMock.mock.calls[1][0]

    expect(markdownBlob).toBeInstanceOf(Blob)
    expect(jsonBlob).toBeInstanceOf(Blob)
    expect(markdownBlob.type).toContain('text/markdown')
    expect(jsonBlob.type).toContain('application/json')

    const markdownContent = await markdownBlob.text()
    expect(markdownContent).toContain('# Flow Outcome Export')
    expect(markdownContent).toContain('Artifact export test note')

    const jsonContent = await jsonBlob.text()
    const parsed = JSON.parse(jsonContent)
    expect(parsed.flow.key).toBe('login')
    expect(parsed.notes).toBe('Artifact export test note')
    expect(Array.isArray(parsed.visitedStages)).toBe(true)
  })
})
