/* @vitest-environment jsdom */

import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Tools from './Tools'

const TOOLS_FIXTURE = [
  {
    category: 'Encoding',
    title: 'Base64',
    description: 'Encode and decode Base64 text.',
    iconName: 'RotateClockwiseIcon'
  },
  {
    category: 'Encoding',
    title: 'URL Encoder',
    description: 'Encode and decode URL components.',
    iconName: 'Link01Icon'
  },
  {
    category: 'Formatting',
    title: 'JSON Formatter',
    description: 'Format and validate JSON payloads.',
    iconName: 'File01Icon'
  }
]

describe('Tools accessibility', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders semantic buttons with ARIA labels for categories and tool cards', () => {
    render(<Tools tools={TOOLS_FIXTURE} onToolClick={() => {}} initialCategory="Encoding" />)

    const encodingTab = screen.getByRole('button', { name: 'Encoding' })
    const formattingTab = screen.getByRole('button', { name: 'Formatting' })

    expect(encodingTab.getAttribute('aria-pressed')).toBe('true')
    expect(formattingTab.getAttribute('aria-pressed')).toBe('false')

    const toolButtons = screen.getAllByRole('button', { name: /open .* tool/i })
    expect(toolButtons.length).toBe(2)

    expect(screen.getByRole('button', { name: 'Open Base64 tool' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Open URL Encoder tool' })).toBeTruthy()
  })

  it('supports keyboard activation of tool cards', () => {
    const onToolClick = vi.fn()
    render(<Tools tools={TOOLS_FIXTURE} onToolClick={onToolClick} initialCategory="Encoding" />)

    const base64Button = screen.getByRole('button', { name: 'Open Base64 tool' })

    base64Button.focus()
    expect(document.activeElement).toBe(base64Button)

    fireEvent.keyDown(base64Button, { key: 'Enter' })
    fireEvent.keyDown(base64Button, { key: ' ' })

    expect(onToolClick).toHaveBeenNthCalledWith(1, 'Base64')
    expect(onToolClick).toHaveBeenNthCalledWith(2, 'Base64')
  })
})
