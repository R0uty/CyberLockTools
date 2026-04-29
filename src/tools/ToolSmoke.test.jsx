/* @vitest-environment jsdom */

import React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Base64 from './Base64'
import URLEncoder from './URLEncoder'
import JSONFormatter from './JSONFormatter'
import HashGenerator from './HashGenerator'

afterEach(() => {
  cleanup()
})

describe('Tool smoke tests', () => {
  it('Base64 renders, encodes, and shows decode error state', () => {
    const { container } = render(<Base64 />)

    expect(screen.getByRole('button', { name: 'Encode' })).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('Enter text to encode or Base64 to decode...'), {
      target: { value: 'hello' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Encode' }))

    expect(container.querySelector('.textarea.output')?.value).toBe('aGVsbG8=')

    fireEvent.change(screen.getByPlaceholderText('Enter text to encode or Base64 to decode...'), {
      target: { value: '%' }
    })
    fireEvent.click(screen.getByRole('button', { name: /decode/i }))

    expect(screen.getByText('Invalid Base64 input. Please check your input and try again.')).toBeTruthy()
  })

  it('URL Encoder renders, encodes, and shows decode error state', () => {
    const { container } = render(<URLEncoder />)

    expect(screen.getByRole('button', { name: 'Encode' })).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('Enter text to encode or URL-encoded text to decode...'), {
      target: { value: 'hello world' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Encode' }))

    expect(container.querySelector('.textarea.output')?.value).toBe('hello%20world')

    fireEvent.change(screen.getByPlaceholderText('Enter text to encode or URL-encoded text to decode...'), {
      target: { value: '%' }
    })
    fireEvent.click(screen.getByRole('button', { name: /decode/i }))

    expect(screen.getByText('Invalid URL-encoded input. Please check your input and try again.')).toBeTruthy()
  })

  it('JSON Formatter renders, formats, and shows empty-input error state', () => {
    const { container } = render(<JSONFormatter />)

    expect(screen.getByRole('button', { name: 'Format JSON' })).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('Paste JSON input here (objects, arrays, strings, or numbers).'), {
      target: { value: '{"a":1}' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }))

    expect(container.querySelector('.textarea.output')?.value).toContain('\n')

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))

    expect(screen.getByText('Please paste JSON to validate')).toBeTruthy()
  })

  it('Hash Generator renders, hashes input, and shows empty-input error state', () => {
    const { container } = render(<HashGenerator />)

    expect(screen.getByRole('button', { name: 'Generate Hash' })).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('Enter text to hash...'), {
      target: { value: 'hello' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Generate Hash' }))

    const hashValue = container.querySelector('.textarea.output')?.value ?? ''
    expect(hashValue.length).toBe(64)

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    fireEvent.click(screen.getByRole('button', { name: 'Generate Hash' }))

    expect(screen.getByText('Please enter text to hash')).toBeTruthy()
  })
})
