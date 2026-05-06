/* @vitest-environment jsdom */

import React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import CORSAnalyzer from './CORSAnalyzer'

afterEach(() => {
  cleanup()
})

describe('CORSAnalyzer', () => {
  it('loads a sample and analyzes risky credentialed CORS behavior', () => {
    const { container } = render(<CORSAnalyzer />)

    fireEvent.click(screen.getByRole('button', { name: 'Load Risky Sample' }))
    fireEvent.click(screen.getByRole('button', { name: 'Analyze CORS' }))

    expect(screen.getByText('Credentialed cross-origin access allowed for tested origin')).toBeTruthy()
    expect(screen.getByText('Missing Vary: Origin')).toBeTruthy()
    expect(container.querySelector('#cors-json-output')?.value).toContain('"policyType": "credentialed-specific-origin"')
  })
})
