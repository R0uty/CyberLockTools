/* @vitest-environment jsdom */

import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import LabNotes from './LabNotes'
import { TOOL_CATALOG } from '../data/toolRegistry'

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

describe('LabNotes workspace', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: createStorageMock(),
      configurable: true
    })
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('saves a flow snapshot into the browser workspace and reopens it', () => {
    const onOpenWorkspaceCase = vi.fn()

    window.sessionStorage.setItem('flow-map-selected-flow', 'login')
    window.sessionStorage.setItem('flow-map-current-stage', 'test-login')
    window.sessionStorage.setItem('flow-map-notes', 'Need one more repro pass.')
    window.sessionStorage.setItem('flow-map-stage-history', JSON.stringify(['start', 'login-page', 'test-login']))
    window.sessionStorage.setItem('flow-map-decision-history', JSON.stringify([{ event: 'login.actionSelect' }]))

    render(
      <LabNotes
        tools={TOOL_CATALOG}
        onToolClick={vi.fn()}
        onOpenWorkspaceCase={onOpenWorkspaceCase}
      />
    )

    fireEvent.change(screen.getByLabelText('Case title'), {
      target: { value: 'Login role mismatch' }
    })
    fireEvent.change(screen.getByLabelText('Tags'), {
      target: { value: 'auth, login' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save current Flow Map snapshot' }))

    expect(screen.getByRole('heading', { name: 'Login role mismatch' })).toBeTruthy()
    expect(screen.getByText('Need one more repro pass.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Reopen in Flow Map' }))
    expect(onOpenWorkspaceCase).toHaveBeenCalledTimes(1)
  })
})
