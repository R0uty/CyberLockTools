import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { formatSQL, getSQLStats, minifySQL, validateSQL } from '../utils/sqlFormatter'
import './SQLFormatter.css'

export default function SQLFormatter() {
  useSEO({
    title: 'Online SQL Formatter and Validator Tool',
    description: 'Free online SQL formatter, validator, and minifier. Paste SQL and instantly format with proper indentation, validate syntax, and identify errors. Perfect for developers and database professionals.',
    keywords: 'sql formatter, sql validator, sql beautifier, sql minifier, online sql tool'
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
        setError('Please paste SQL to format')
        return
      }

      const result = formatSQL(input)

      if (result.success) {
        setOutput(result.formatted)
        const sqlStats = getSQLStats(input)
        setStats(sqlStats)
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
        setError('Please paste SQL to validate')
        return
      }

      const result = validateSQL(input)

      if (result.success) {
        setError('')
        setOutput(result.message)
        const sqlStats = getSQLStats(input)
        setStats(sqlStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Validation failed: ${err.message}`)
    }
  }

  const handleMinify = () => {
    setError('')
    setOutput('')
    setStats(null)

    try {
      if (!input.trim()) {
        setError('Please paste SQL to minify')
        return
      }

      const result = minifySQL(input)

      if (result.success) {
        setOutput(result.minified)
        const sqlStats = getSQLStats(input)
        setStats(sqlStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Minification failed: ${err.message}`)
    }
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy. Please format SQL first.')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Copied to clipboard!')
  }

  const handleDownload = () => {
    if (!output) {
      setError('Nothing to download. Please format SQL first.')
      return
    }
    const element = document.createElement('a')
    const file = new Blob([output], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'formatted.sql'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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
        <h1> Online SQL Formatter and Validator</h1>
        <p>Paste raw SQL and instantly format it with proper indentation for readability. The formatter also validates your SQL structure, identifies syntax errors, and provides helpful error messages. You can also minify SQL to reduce file size. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <button onClick={handleFormat} className="action-btn encode-btn">
            Format SQL
          </button>
          <button onClick={handleValidate} className="action-btn encode-btn">
            ✓ Validate
          </button>
          <button onClick={handleMinify} className="action-btn encode-btn">
            ⚙️ Minify
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
            <label>Raw SQL Input</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your SQL here... (SELECT, INSERT, UPDATE, DELETE, CREATE, etc.)"
              className="textarea"
              rows="10"
            />
            <div className="info-small">💡 Supports all SQL dialects (MySQL, PostgreSQL, SQL Server, Oracle, etc.)</div>
          </div>

          <div className="textarea-group">
            <label>Formatted Output</label>
            <textarea
              value={output}
              readOnly
              className="textarea output"
              rows="10"
            />
            {output && output !== '✅ Valid SQL syntax' && (
              <div className="btn-group-row">
                <button onClick={handleCopy} className="copy-btn">
                  Copy SQL
                </button>
                <button onClick={handleDownload} className="copy-btn">
                  ⬇️ Download
                </button>
              </div>
            )}
          </div>
        </div>

        {stats && (
          <div className="info-box info-box--alt">
            <h4>SQL Statistics</h4>
            <div className="stats-grid">
              <div>
                <strong>Query Type:</strong> {stats.queryType}
              </div>
              <div>
                <strong>Tables:</strong> {stats.tableCount}
              </div>
              <div>
                <strong>Columns:</strong> {stats.columnCount || 'N/A'}
              </div>
              <div>
                <strong>Joins:</strong> {stats.joinCount}
              </div>
              <div>
                <strong>Conditions:</strong> {stats.conditionCount}
              </div>
              <div>
                <strong>Has WHERE:</strong> {stats.whereClause ? '✓ Yes' : '✗ No'}
              </div>
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>About SQL</h4>
          <p>
            SQL (Structured Query Language) is the standard language for managing and querying relational databases. It's used in virtually every application that stores data. SQL supports various operations: SELECT for querying, INSERT for adding data, UPDATE for modifying, and DELETE for removing data.
          </p>
          <p className="info-note">
            <strong>Common SQL Dialects:</strong> MySQL, PostgreSQL, SQL Server, Oracle, SQLite, MariaDB, Redshift
          </p>
        </div>

        <div className="info-box info-box--alt">
          <h4>🧪 Test SQL Examples</h4>
          
          <div className="example-block">
            <strong>Simple SELECT:</strong>
            <p className="code-snippet">
              {`SELECT id, name, email FROM users WHERE active = 1 ORDER BY name`}
            </p>
          </div>

          <div className="example-block">
            <strong>JOIN Query:</strong>
            <p className="code-snippet">
              {`SELECT u.name, o.order_id FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.status = 'pending'`}
            </p>
          </div>

          <div className="example-block--last">
            <strong>Complex Query:</strong>
            <p className="code-snippet">
              {`SELECT u.id, u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id HAVING COUNT(o.id) > 0 ORDER BY order_count DESC`}
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
