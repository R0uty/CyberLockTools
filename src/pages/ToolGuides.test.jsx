/* @vitest-environment jsdom */

import React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import ToolGuides from './ToolGuides'

describe('ToolGuides', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders when opened without a selected tool', () => {
    render(<ToolGuides initialToolName={null} />)

    expect(screen.getByRole('heading', { name: 'Pentesting Tools for Recon and Testing' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'All' })).toBeTruthy()
  })

  it('highlights the matching guide when a tool name is provided', () => {
    const { container } = render(<ToolGuides initialToolName="Browser DevTools" />)

    const highlightedCard = container.querySelector('.tool-guides-card--highlighted')
    expect(highlightedCard?.id).toBe('tool-guide-browser-devtools')
  })
})
