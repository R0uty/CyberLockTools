import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { showFeedback } from '../utils/feedback'
import { formatYAML, getYAMLStats, yamlToJSON } from '../utils/yamlFormatter'
import '../styles/pages/YAMLFormatter.css'

export default function YAMLFormatter() {
  useSEO({
    title: 'Online YAML Formatter and Converter Tool',
    description: 'Free online YAML formatter, beautifier, and converter. Format YAML with perfect indentation, validate syntax, and convert to JSON. Essential DevOps and configuration tool.',
    keywords: 'yaml formatter, yaml beautifier, yaml to json, online yaml tool, yaml converter'
  })

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [mode, setMode] = useState('format') // 'format' or 'json'

  const handleFormat = () => {
    setError('')
    setOutput('')
    setStats(null)
    setMode('format')

    try {
      if (!input.trim()) {
        setError('Please paste YAML to format')
        return
      }

      const result = formatYAML(input)

      if (result.success) {
        setOutput(result.formatted)
        const yamlStats = getYAMLStats(input)
        setStats(yamlStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Formatting failed: ${err.message}`)
    }
  }

  const handleConvertJSON = () => {
    setError('')
    setOutput('')
    setStats(null)
    setMode('json')

    try {
      if (!input.trim()) {
        setError('Please paste YAML to convert')
        return
      }

      const result = yamlToJSON(input)

      if (result.success) {
        setOutput(result.json)
        const yamlStats = getYAMLStats(input)
        setStats(yamlStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Conversion failed: ${err.message}`)
    }
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy. Please format or convert YAML first.')
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
    <div className="tool-page yaml-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <span className="yaml-kicker">Config formatting</span>
        <h1> Online YAML Formatter and Converter</h1>
        <p>Paste raw YAML and instantly format it with proper indentation for readability. You can also convert YAML to JSON format. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <button onClick={handleFormat} className="action-btn encode-btn">
            Format YAML
          </button>
          <button onClick={handleConvertJSON} className="action-btn encode-btn">
            Convert to JSON
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
            <label>Raw YAML Input</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your YAML here... (objects, lists, strings, etc.)"
              className="textarea"
              rows="10"
            />
            <div className="info-small">💡 Supports standard YAML syntax with proper indentation</div>
          </div>

          <div className="textarea-group">
            <label>
              {mode === 'format' ? 'Formatted YAML Output' : 'JSON Output'}
            </label>
            <textarea
              value={output}
              readOnly
              className="textarea output"
              rows="10"
            />
            {output && (
              <button onClick={handleCopy} className="copy-btn">
                Copy Output
              </button>
            )}
          </div>
        </div>

        {stats && (
          <div className="info-box info-box--alt">
            <h4>YAML Statistics</h4>
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
          <h4>About YAML</h4>
          <p>
            YAML (YAML Ain't Markup Language) is a human-friendly data serialization format used for configuration files and data exchange. It uses indentation and simple syntax to represent structured data.
          </p>
          <p className="info-note">
            <strong>Key features:</strong> Whitespace-sensitive, supports lists, mappings (key-value pairs), strings, numbers, booleans, and null values
          </p>
        </div>

        <div className="info-box info-box--alt">
          <h4>Test YAML Examples</h4>
          
          <div className="example-block">
            <strong>Simple Configuration:</strong>
            <p className="code-snippet">
              {`app: MyApp\nversion: 1.0\ndebug: true\nport: 8080`}
            </p>
          </div>

          <div className="example-block">
            <strong>List Example:</strong>
            <p className="code-snippet">
              {`users:\n  - name: Alice\n    role: admin\n  - name: Bob\n    role: user`}
            </p>
          </div>

          <div className="example-block--last">
            <strong>Nested Structure:</strong>
            <p className="code-snippet">
              {`database:\n  host: localhost\n  port: 5432\n  credentials:\n    username: admin\n    password: secret`}
            </p>
          </div>

          <p className="example-note">
            Copy any example above and paste it to see formatting in action!
          </p>
        </div>
      </div>
    </div>
  )
}
