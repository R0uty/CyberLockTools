import { useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'
import { generateUUIDv4, generateUUIDv1, generateMultipleUUIDs, isValidUUID, getUUIDVersion } from '../utils/uuidGenerator'
import '../styles/pages/UUIDGenerator.css'

export default function UUIDGenerator() {
  useSEO({
    title: 'Online UUID Generator Tool',
    description: 'Free online UUID/GUID generator. Generate v1 and v4 UUIDs instantly. Bulk generation, validation, and format options. Perfect for developers needing unique identifiers.',
    keywords: 'uuid generator, guid generator, uuid v4, uuid v1, online uuid tool'
  })

  const [uuids, setUuids] = useState([])
  const [format, setFormat] = useState('v4') // 'v1', 'v4', 'v4-braces'
  const [count, setCount] = useState('1')
  const [validateInput, setValidateInput] = useState('')
  const [validateResult, setValidateResult] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = () => {
    setError('')
    setValidateResult('')

    try {
      const num = parseInt(count, 10)

      if (isNaN(num) || num < 1) {
        setError('Count must be at least 1')
        return
      }

      if (num > 1000) {
        setError('Maximum 1000 UUIDs can be generated at once')
        return
      }

      let generated = []

      if (num === 1) {
        if (format === 'v1') {
          generated = [generateUUIDv1()]
        } else if (format === 'v4-braces') {
          generated = [`{${generateUUIDv4()}}`]
        } else {
          generated = [generateUUIDv4()]
        }
      } else {
        const base = format === 'v1' ? generateMultipleUUIDs(num, 'v1') : generateMultipleUUIDs(num, 'v4')
        if (format === 'v4-braces') {
          generated = base.map(uuid => `{${uuid}}`)
        } else {
          generated = base
        }
      }

      setUuids(generated)
    } catch (err) {
      setError(`Generation failed: ${err.message}`)
    }
  }

  const handleValidate = () => {
    setError('')

    if (!validateInput.trim()) {
      setValidateResult('')
      return
    }

    try {
      const input = validateInput.trim().replace(/[{}]/g, '')

      if (isValidUUID(input)) {
        const version = getUUIDVersion(input)
        setValidateResult(`✅ Valid UUID (v${version})`)
      } else {
        setValidateResult('❌ Invalid UUID format')
      }
    } catch (err) {
      setError(`Validation failed: ${err.message}`)
    }
  }

  const handleCopyAll = () => {
    if (uuids.length === 0) {
      setError('No UUIDs to copy. Generate some first.')
      return
    }
    copyText(uuids.join('\n'))
  }

  const handleDownload = () => {
    if (uuids.length === 0) {
      setError('No UUIDs to download. Generate some first.')
      return
    }
    const element = document.createElement('a')
    const file = new Blob([uuids.join('\n')], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'uuids.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleCopyOne = (uuid) => {
    copyText(uuid)
  }

  const handleClear = () => {
    setUuids([])
    setValidateInput('')
    setValidateResult('')
    setError('')
  }

  return (
    <div className="tool-page uuid-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <span className="uuid-kicker">Identifiers</span>
        <h1>UUID/GUID Generator</h1>
        <p>Generate unique identifiers instantly. Create single or bulk UUIDs (v1 and v4), validate existing UUIDs, and choose from multiple format options including braces. Perfect for developers, database design, and system integration. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div className="options-grid">
          {/* Generation Panel */}
          <div className="panel">
            <h3 className="panel-title">Generate UUIDs</h3>

            <div className="form-field">
              <label className="field-label">
                Format:
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="field-input"
              >
                <option value="v4">UUID v4 (Random)</option>
                <option value="v1">UUID v1 (Timestamp)</option>
                <option value="v4-braces">UUID v4 with Braces</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">
                Count (1-1000):
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="field-input"
              />
            </div>

            <button onClick={handleGenerate} className="action-btn encode-btn btn-full-width">
              Generate
            </button>
          </div>

          {/* Validation Panel */}
          <div className="panel">
            <h3 className="panel-title">✓ Validate UUID</h3>

            <div className="form-field">
              <label className="field-label">
                Paste UUID:
              </label>
              <input
                type="text"
                value={validateInput}
                onChange={(e) => setValidateInput(e.target.value)}
                onBlur={handleValidate}
                placeholder="Paste a UUID to validate..."
                className="field-input"
              />
            </div>

            {validateResult && (
              <div className={validateResult.includes('✅') ? 'validate-result validate-result--success' : 'validate-result validate-result--error'}>
                {validateResult}
              </div>
            )}

            <button onClick={handleClear} className="action-btn clear-btn btn-full-width">
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {uuids.length > 0 && (
          <div className="uuid-list-wrapper">
            <div className="list-header">
              <h3 className="list-title">Generated UUIDs ({uuids.length})</h3>
              <div className="list-actions">
                <button onClick={handleCopyAll} className="copy-btn">
                  Copy All
                </button>
                <button onClick={handleDownload} className="copy-btn">
                  Download
                </button>
              </div>
            </div>

            <div className="uuid-list">
              {uuids.map((uuid, idx) => (
                <div
                  key={idx}
                  className="uuid-item"
                >
                  <code className="uuid-code">
                    {uuid}
                  </code>
                  <button
                    onClick={() => handleCopyOne(uuid)}
                    className="uuid-copy-btn"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>About UUID</h4>
          <p>
            UUID (Universally Unique Identifier) or GUID (Globally Unique Identifier) is a 128-bit identifier used to uniquely identify information in distributed systems. UUIDs are widely used in databases, APIs, and distributed systems.
          </p>
          <p className="info-text">
            <strong>UUID v1:</strong> Time-based, includes timestamp and MAC address<br/>
            <strong>UUID v4:</strong> Random-based, no personal information included (recommended for privacy)
          </p>
        </div>
      </div>
    </div>
  )
}
