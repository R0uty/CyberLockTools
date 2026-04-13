import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { showFeedback } from '../utils/feedback'
import { formatJSON, getJSONStats } from '../utils/jsonFormatter'
import './JSONFormatter.css'

export default function JSONFormatter() {
  useSEO({
    title: 'Online JSON Formatter and Validator Tool',
    description: 'Free online JSON formatter, validator, and beautifier. Paste JSON and instantly format with proper indentation, validate syntax, and identify errors. Essential web development tool.',
    keywords: 'json formatter, json validator, json beautifier, json minifier, online json tool'
  })

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  const handleFormat = () => {
    setError('')
    setOutput('')
    setStats(null)

    try {
      if (!input.trim()) {
        setError('Please paste JSON to format')
        return
      }

      const result = formatJSON(input)

      if (result.success) {
        setOutput(result.formatted)
        const jsonStats = getJSONStats(input)
        setStats(jsonStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Formatting failed: ${err.message}`)
    }
  }

  const handleValidate = () => {
    setError('')
    setOutput('')
    setStats(null)

    try {
      if (!input.trim()) {
        setError('Please paste JSON to validate')
        return
      }

      const result = formatJSON(input)

      if (result.success) {
        setError('')
        setOutput('✅ Valid JSON')
        const jsonStats = getJSONStats(input)
        setStats(jsonStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Validation failed: ${err.message}`)
    }
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy. Please format JSON first.')
      return
    }
    navigator.clipboard.writeText(output)
    showFeedback('Copied to clipboard!')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setStats(null)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setError('')
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Online JSON Formatter and Validator</h1>
        <p>Paste JSON to format and validate it with clear output and error messages. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <button onClick={handleFormat} className="action-btn encode-btn">
            Format JSON
          </button>
          <button onClick={handleValidate} className="action-btn encode-btn">
            Validate
          </button>
          <button onClick={handleClear} className="action-btn clear-btn">
            Clear
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="tool-row">
          <div className="textarea-group">
            <label>JSON Input</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Paste JSON input here (objects, arrays, strings, or numbers)."
              className="textarea"
              rows="10"
            />
            <div className="info-small">Accepts any valid JSON format.</div>
          </div>

          <div className="textarea-group">
            <label>Output</label>
            <textarea
              value={output}
              readOnly
              className="textarea output"
              rows="10"
            />
            {output && output !== '✅ Valid JSON' && (
              <button onClick={handleCopy} className="copy-btn">
                Copy Formatted JSON
              </button>
            )}
          </div>
        </div>

        {stats && (
          <div className="info-box info-box--alt">
            <h4>JSON Statistics</h4>
            <div className="stats-grid">
              <div>
                <strong>Type:</strong> {stats.type}
              </div>
              <div>
                <strong>Original Size:</strong> {stats.originalSize} bytes
              </div>
              <div>
                <strong>Formatted Size:</strong> {stats.formattedSize} bytes
              </div>
              <div>
                <strong>Max Depth:</strong> {stats.depth}
              </div>
              <div className="stats-grid__full">
                <strong>Total Keys:</strong> {stats.keyCount}
              </div>
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>About JSON</h4>
          <p>
            JSON (JavaScript Object Notation) is a lightweight, text-based data format used for data interchange. It's human-readable and widely supported in programming languages and APIs.
          </p>
          <p className="info-note">
            <strong>Valid JSON types:</strong> Objects ({}), Arrays ([]), Strings (""), Numbers, Booleans (true/false), and null
          </p>
        </div>

        <div className="info-box info-box--alt">
          <h4>Test JSON Examples</h4>
          
          <div className="example-block">
            <strong>Simple Object:</strong>
            <p className="code-snippet">
              {`{"name":"John","age":30,"city":"New York"}`}
            </p>
          </div>

          <div className="example-block">
            <strong>Array with Objects:</strong>
            <p className="code-snippet">
              {`[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]`}
            </p>
          </div>

          <div className="example-block--last">
            <strong>Complex Nested Object:</strong>
            <p className="code-snippet">
              {`{"user":{"id":123,"profile":{"name":"John","email":"john@example.com"},"roles":["admin","user"]}}`}
            </p>
          </div>

          <p className="example-note">
            Copy any example and paste it into the input to test formatting.
          </p>
        </div>
      </div>
    </div>
  )
}
