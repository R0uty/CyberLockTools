export const APP_FEEDBACK_EVENT = 'app-feedback'

export function showFeedback(message, type = 'success', timeout = 2400) {
  if (!message) {
    return
  }

  window.dispatchEvent(new CustomEvent(APP_FEEDBACK_EVENT, {
    detail: { message, type, timeout }
  }))
}
