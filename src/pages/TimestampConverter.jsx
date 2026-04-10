import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { timestampToDate, dateToTimestamp, getCurrentTimestamp, dateDifference } from '../utils/timestampConverter'
import './TimestampConverter.css'

export default function TimestampConverter() {
  useSEO({
    title: 'Online Unix Timestamp Converter Tool',
    description: 'Free online Unix timestamp converter. Convert between Unix timestamps and dates instantly. Supports both seconds and milliseconds. Calculate date differences with timezone support.',
    keywords: 'unix timestamp, timestamp converter, date converter, epoch converter, online timestamp tool'
  })

  const [mode, setMode] = useState('ts-to-date') // 'ts-to-date', 'date-to-ts', 'difference'
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleConvert = () => {
    setError('')
    setResult(null)

    if (!input.trim()) {
      setError('Please enter a value')
      return
    }

    try {
      if (mode === 'ts-to-date') {
        const res = timestampToDate(input)
        if (res.success) {
          setResult(res)
        } else {
          setError(res.error)
        }
      } else if (mode === 'date-to-ts') {
        const res = dateToTimestamp(input)
        if (res.success) {
          setResult(res)
        } else {
          setError(res.error)
        }
      }
    } catch (err) {
      setError(`Conversion error: ${err.message}`)
    }
  }

  const handleGetCurrent = () => {
    setError('')
    setInput('')
    const current = getCurrentTimestamp(false)
    setResult({
      timestamp: current.timestampS,
      iso: current.iso,
      locale: current.readable,
      utc: new Date(current.timestampMs).toUTCString()
    })
  }

  const handleDateDifference = () => {
    if (!input.trim()) {
      setError('Please enter two dates/timestamps separated by | or comma')
      return
    }

    try {
      const parts = input.includes('|') ? input.split('|') : input.split(',')
      if (parts.length !== 2) {
        setError('Please provide exactly 2 dates/timestamps')
        return
      }

      const res = dateDifference(parts[0].trim(), parts[1].trim())
      if (res.success) {
        setResult(res)
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError(`Calculation error: ${err.message}`)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
    setError('')
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Unix Timestamp Converter</h1>
        <p>Convert between Unix timestamps and human-readable dates instantly. Support for both seconds and milliseconds. Calculate differences between dates, get current timestamp, and work with timezones. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div className="mode-selector">
          <label className="radio-label">
            <input
              type="radio"
              value="ts-to-date"
              checked={mode === 'ts-to-date'}
              onChange={(e) => { setMode(e.target.value); setResult(null); setError('') }}
              className="radio-input"
            />
            Timestamp → Date
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="date-to-ts"
              checked={mode === 'date-to-ts'}
              onChange={(e) => { setMode(e.target.value); setResult(null); setError('') }}
              className="radio-input"
            />
            Date → Timestamp
          </label>
          <label className="radio-label--last">
            <input
              type="radio"
              value="difference"
              checked={mode === 'difference'}
              onChange={(e) => { setMode(e.target.value); setResult(null); setError('') }}
              className="radio-input"
            />
            Date Difference
          </label>
        </div>

        <div className="form-field">
          <label className="field-label">
            {mode === 'ts-to-date' && 'Enter Unix Timestamp (seconds or milliseconds):'}
            {mode === 'date-to-ts' && 'Enter Date (e.g., 2024-01-15 or 2024-01-15 10:30:00):'}
            {mode === 'difference' && 'Enter two dates/timestamps (separated by | or comma):'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'ts-to-date' ? '1704067200 or 1704067200000' :
              mode === 'date-to-ts' ? '2024-01-15 or 2024-01-15 10:30:00' :
              '2024-01-15 | 2024-01-20'
            }
            className="field-textarea"
          />
        </div>

        <div className="button-group">
          {mode === 'difference' ? (
            <button onClick={handleDateDifference} className="action-btn encode-btn">
              🔢 Calculate
            </button>
          ) : (
            <button onClick={handleConvert} className="action-btn encode-btn">
              Convert
            </button>
          )}
          {mode === 'ts-to-date' && (
            <button onClick={handleGetCurrent} className="action-btn encode-btn">
              ⏱️ Current Time
            </button>
          )}
          <button onClick={handleClear} className="action-btn clear-btn">
            Clear
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className="info-box info-box--result">
            <h4>Result</h4>
            <div className="result-grid">
              {mode === 'ts-to-date' && (
                <>
                  <div>
                    <strong>ISO Format:</strong>
                    <div className="mono-value">
                      {result.iso}
                      <button
                        onClick={() => handleCopy(result.iso)}
                        className="inline-copy-btn"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <strong>UTC Format:</strong>
                    <div className="mono-value">
                      {result.utc}
                      <button
                        onClick={() => handleCopy(result.utc)}
                        className="inline-copy-btn"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="grid-full-width">
                    <strong>Local Format:</strong>
                    <div className="mono-value">
                      {result.locale}
                    </div>
                  </div>
                  <div>
                    <strong>Date Components:</strong>
                    <div className="value-details">
                      Year: {result.year}<br/>
                      Month: {result.month}<br/>
                      Day: {result.day}
                    </div>
                  </div>
                  <div>
                    <strong>Time Components:</strong>
                    <div className="value-details">
                      Hour: {result.hour}<br/>
                      Minute: {result.minute}<br/>
                      Second: {result.second}
                    </div>
                  </div>
                </>
              )}
              {mode === 'date-to-ts' && (
                <>
                  <div>
                    <strong>Timestamp (seconds):</strong>
                    <div className="mono-value mono-value--large">
                      {result.timestampS}
                      <button
                        onClick={() => handleCopy(result.timestampS.toString())}
                        className="inline-copy-btn"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <strong>Timestamp (milliseconds):</strong>
                    <div className="mono-value mono-value--medium">
                      {result.timestampMs}
                      <button
                        onClick={() => handleCopy(result.timestampMs.toString())}
                        className="inline-copy-btn"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </>
              )}
              {mode === 'difference' && (
                <>
                  <div>
                    <strong>Difference:</strong>
                    <div className="value-details">
                      Days: {result.days}<br/>
                      Hours: {result.hours}<br/>
                      Minutes: {result.minutes}<br/>
                      Seconds: {result.seconds}
                    </div>
                  </div>
                  <div>
                    <strong>Formatted:</strong>
                    <div className="mono-value">
                      {result.formatted}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="info-box info-box--spaced">
          <h4>About Unix Timestamp</h4>
          <p>
            Unix Timestamp (also called Epoch time or POSIX time) is the number of seconds (or milliseconds) since January 1, 1970, 00:00:00 UTC. It's widely used in programming, databases, and system logs for tracking time.
          </p>
          <p className="info-text">
            <strong>Seconds vs Milliseconds:</strong> JavaScript typically uses milliseconds, while many systems use seconds. This tool auto-detects based on value size.
          </p>
        </div>

        <div className="info-box info-box--alt">
          <h4>🧪 Examples</h4>
          <p className="examples-text">
            <code>1704067200</code> → January 1, 2024<br/>
            <code>1704067200000</code> → January 1, 2024 (milliseconds)<br/>
            <code>2024-01-15 10:30:00</code> → 1705316400 (timestamp)
          </p>
        </div>
      </div>
    </div>
  )
}
