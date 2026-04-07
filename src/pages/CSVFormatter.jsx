import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { formatCSV, getCSVStats, validateCSV, csvToJSON, jsonToCSV } from '../utils/csvFormatter'

export default function CSVFormatter() {
  useSEO({
    title: 'Online CSV Parser and Formatter Tool',
    description: 'Free online CSV parser, formatter, and converter. Paste CSV and instantly format, validate, convert to JSON, or convert JSON to CSV. Perfect for data processing and spreadsheet work.',
    keywords: 'csv formatter, csv parser, csv converter, json to csv, csv to json, online csv tool'
  })

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [mode, setMode] = useState('csv') // 'csv' or 'json'

  const handleFormat = () => {
    setError('')
    setOutput('')
    setStats(null)

    try {
      if (!input.trim()) {
        setError('Please paste CSV to format')
        return
      }

      const result = formatCSV(input)

      if (result.success) {
        setOutput(result.formatted)
        const csvStats = getCSVStats(input)
        setStats(csvStats)
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
        setError('Please paste CSV to validate')
        return
      }

      const result = validateCSV(input)

      if (result.success) {
        setError('')
        setOutput(result.message)
        const csvStats = getCSVStats(input)
        setStats(csvStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Validation failed: ${err.message}`)
    }
  }

  const handleConvert = () => {
    setError('')
    setOutput('')
    setStats(null)

    try {
      if (!input.trim()) {
        setError('Please paste data to convert')
        return
      }

      let result
      if (mode === 'csv') {
        result = csvToJSON(input)
        if (result.success) {
          setOutput(result.json)
        }
      } else {
        result = jsonToCSV(input)
        if (result.success) {
          setOutput(result.csv)
        }
      }

      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError(`Conversion failed: ${err.message}`)
    }
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy. Please format or convert first.')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Copied to clipboard!')
  }

  const handleDownload = () => {
    if (!output) {
      setError('Nothing to download. Please format or convert first.')
      return
    }
    const element = document.createElement('a')
    const ext = mode === 'csv' && output.includes('{') ? 'json' : 'csv'
    const file = new Blob([output], { type: ext === 'json' ? 'application/json' : 'text/csv' })
    element.href = URL.createObjectURL(file)
    element.download = `formatted.${ext}`
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
        🔒 All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>📊 Online CSV Parser and Formatter</h1>
        <p>Paste CSV or JSON data and instantly format, validate, or convert between formats. The parser handles quoted fields, special characters, and complex data structures. Display statistics about your data including row/column counts and data types. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <button onClick={handleFormat} className="action-btn encode-btn">
            📝 Format CSV
          </button>
          <button onClick={handleValidate} className="action-btn encode-btn">
            ✓ Validate
          </button>
          <button onClick={handleConvert} className="action-btn encode-btn">
            🔄 {mode === 'csv' ? 'CSV → JSON' : 'JSON → CSV'}
          </button>
          <button onClick={handleClear} className="action-btn clear-btn">
            🗑️ Clear
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}>
          <label style={{ marginRight: '2rem', fontSize: '14px' }}>
            <input
              type="radio"
              value="csv"
              checked={mode === 'csv'}
              onChange={(e) => setMode(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />
            CSV Input
          </label>
          <label style={{ fontSize: '14px' }}>
            <input
              type="radio"
              value="json"
              checked={mode === 'json'}
              onChange={(e) => setMode(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />
            JSON Input
          </label>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="tool-row">
          <div className="textarea-group">
            <label>Raw {mode === 'csv' ? 'CSV' : 'JSON'} Input</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder={mode === 'csv' 
                ? "Paste your CSV here... (headers with values)"
                : "Paste your JSON array here... ([{col1: val1, col2: val2}, ...])"
              }
              className="textarea"
              rows="10"
            />
            <div className="info-small">💡 {mode === 'csv' 
              ? 'Supports quoted fields, commas, and special characters' 
              : 'Must be an array of objects'
            }</div>
          </div>

          <div className="textarea-group">
            <label>Formatted Output</label>
            <textarea
              value={output}
              readOnly
              className="textarea output"
              rows="10"
            />
            {output && output !== '✅ Valid CSV' && !output.startsWith('✅') && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={handleCopy} className="copy-btn">
                  📋 Copy
                </button>
                <button onClick={handleDownload} className="copy-btn">
                  ⬇️ Download
                </button>
              </div>
            )}
          </div>
        </div>

        {stats && (
          <div className="info-box" style={{ backgroundColor: '#f0f0f0', marginTop: '20px' }}>
            <h4>📊 CSV Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
              <div>
                <strong>Rows:</strong> {stats.rows}
              </div>
              <div>
                <strong>Columns:</strong> {stats.columns}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Headers:</strong> {stats.headers}
              </div>
              {Object.keys(stats.dataTypes).length > 0 && (
                <div style={{ gridColumn: '1 / -1', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
                  <strong>Data Types by Column:</strong>
                  <div style={{ marginTop: '8px', fontSize: '13px' }}>
                    {Object.entries(stats.dataTypes).map(([header, type]) => (
                      <div key={header} style={{ margin: '4px 0' }}>
                        {header}: <code style={{ backgroundColor: '#fff', padding: '2px 4px', borderRadius: '3px' }}>{type}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>ℹ️ About CSV</h4>
          <p>
            CSV (Comma-Separated Values) is a simple text-based format for storing tabular data. It's widely used for data interchange between applications, spreadsheets, and databases. Each line represents a row, and values are separated by commas.
          </p>
          <p style={{ marginTop: '10px' }}>
            <strong>Features:</strong> Human-readable, lightweight, supports quoted fields with special characters, widely compatible with Excel/Google Sheets
          </p>
        </div>

        <div className="info-box" style={{ backgroundColor: '#f0f0f0', marginTop: '20px' }}>
          <h4>🧪 Test CSV Examples</h4>
          
          <div style={{ marginTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
            <strong>Simple CSV:</strong>
            <p style={{ fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', backgroundColor: '#fff', padding: '8px', borderRadius: '4px', margin: '5px 0' }}>
              {`id,name,email,age\n1,John,john@example.com,30\n2,Jane,jane@example.com,28`}
            </p>
          </div>

          <div style={{ marginTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
            <strong>CSV with Quoted Fields:</strong>
            <p style={{ fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', backgroundColor: '#fff', padding: '8px', borderRadius: '4px', margin: '5px 0' }}>
              {`name,description,price\n"Product A","Has, comma in text",9.99\n"Product B","Normal desc",19.99`}
            </p>
          </div>

          <div style={{ marginTop: '10px' }}>
            <strong>Sample JSON for conversion:</strong>
            <p style={{ fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', backgroundColor: '#fff', padding: '8px', borderRadius: '4px', margin: '5px 0' }}>
              {`[{"id":1,"name":"Alice","city":"NYC"},{"id":2,"name":"Bob","city":"LA"}]`}
            </p>
          </div>

          <p style={{ fontSize: '12px', marginTop: '10px' }}>
            Copy any example above and paste it to see parsing/conversion in action!
          </p>
        </div>
      </div>
    </div>
  )
}
