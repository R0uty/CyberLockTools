import { showFeedback } from './feedback'

const DEFAULT_SUCCESS_MESSAGE = 'Copied to clipboard!'
const DEFAULT_ERROR_MESSAGE = 'Failed to copy to clipboard'

function fallbackCopyViaExecCommand(text) {
  if (typeof document === 'undefined') {
    return false
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.top = '-9999px'
  textArea.style.left = '-9999px'

  document.body.appendChild(textArea)
  textArea.select()

  let copied = false
  try {
    copied = Boolean(document.execCommand('copy'))
  } catch {
    copied = false
  }

  document.body.removeChild(textArea)
  return copied
}

export async function copyText(
  text,
  {
    successMessage = DEFAULT_SUCCESS_MESSAGE,
    errorMessage = DEFAULT_ERROR_MESSAGE,
    showSuccess = true,
    showError = true,
  } = {}
) {
  if (typeof text !== 'string' || text.length === 0) {
    if (showError) {
      showFeedback(errorMessage, 'error')
    }
    return false
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const copied = fallbackCopyViaExecCommand(text)
      if (!copied) {
        throw new Error('Clipboard API unavailable and fallback copy failed')
      }
    }

    if (showSuccess) {
      showFeedback(successMessage)
    }
    return true
  } catch (err) {
    if (showError) {
      showFeedback(
        err?.message ? `${errorMessage}: ${err.message}` : errorMessage,
        'error'
      )
    }
    return false
  }
}
