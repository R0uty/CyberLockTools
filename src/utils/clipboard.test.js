/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const showFeedbackMock = vi.fn()

vi.mock('./feedback', () => ({
  showFeedback: (...args) => showFeedbackMock(...args),
}))

import { copyText } from './clipboard'

describe('clipboard utility', () => {
  let originalClipboard
  let originalExecCommand

  beforeEach(() => {
    showFeedbackMock.mockReset()
    originalClipboard = navigator.clipboard
    originalExecCommand = document.execCommand
  })

  afterEach(() => {
    navigator.clipboard = originalClipboard
    document.execCommand = originalExecCommand
  })

  it('copies text with Clipboard API and shows success feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    navigator.clipboard = { writeText }

    const copied = await copyText('hello world')

    expect(copied).toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello world')
    expect(showFeedbackMock).toHaveBeenCalledWith('Copied to clipboard!')
  })

  it('shows error feedback when Clipboard API rejects (permission failure)', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('NotAllowedError'))
    navigator.clipboard = { writeText }

    const copied = await copyText('secret')

    expect(copied).toBe(false)
    expect(showFeedbackMock).toHaveBeenCalledWith(
      'Failed to copy to clipboard: NotAllowedError',
      'error'
    )
  })

  it('falls back to execCommand when Clipboard API is unavailable', async () => {
    navigator.clipboard = undefined
    document.execCommand = vi.fn().mockReturnValue(true)

    const copied = await copyText('fallback text')

    expect(copied).toBe(true)
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(showFeedbackMock).toHaveBeenCalledWith('Copied to clipboard!')
  })
})
