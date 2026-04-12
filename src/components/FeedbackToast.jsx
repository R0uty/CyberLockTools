import { useEffect, useRef, useState } from 'react'
import { APP_FEEDBACK_EVENT } from '../utils/feedback'

export default function FeedbackToast() {
  const [feedback, setFeedback] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const clearExistingTimeout = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const handleFeedback = (event) => {
      const { message, type = 'success', timeout = 2400 } = event.detail ?? {}

      if (!message) {
        return
      }

      clearExistingTimeout()
      setFeedback({ message, type })

      timeoutRef.current = window.setTimeout(() => {
        setFeedback(null)
        timeoutRef.current = null
      }, timeout)
    }

    window.addEventListener(APP_FEEDBACK_EVENT, handleFeedback)

    return () => {
      window.removeEventListener(APP_FEEDBACK_EVENT, handleFeedback)
      clearExistingTimeout()
    }
  }, [])

  return (
    <div className="app-feedback-region" aria-live="polite" aria-atomic="true">
      {feedback ? (
        <div
          className={`app-feedback-toast app-feedback-toast--${feedback.type}`}
          role="status"
        >
          {feedback.message}
        </div>
      ) : null}
    </div>
  )
}
