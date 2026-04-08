import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { generateUUIDv4, generateUUIDv1, generateMultipleUUIDs, isValidUUID, getUUIDVersion } from '../utils/uuidGenerator'

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
    navigator.clipboard.writeText(uuids.join('\n'))
    alert('Copied all UUIDs to clipboard!')
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
    navigator.clipboard.writeText(uuid)
    alert('Copied to clipboard!')
  }

  const handleClear = () => {
    setUuids([])
    setValidateInput('')
    setValidateResult('')
    setError('')
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>UUID/GUID Generator</h1>
        <p>Generate unique identifiers instantly. Create single or bulk UUIDs (v1 and v4), validate existing UUIDs, and choose from multiple format options including braces. Perfect for developers, database design, and system integration. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Generation Panel */}
          <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Generate UUIDs</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '14px' }}>
                Format:
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                <option value="v4">UUID v4 (Random)</option>
                <option value="v1">UUID v1 (Timestamp)</option>
                <option value="v4-braces">UUID v4 with Braces</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '14px' }}>
                Count (1-1000):
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button onClick={handleGenerate} className="action-btn encode-btn" style={{ width: '100%' }}>
              ✨ Generate
            </button>
          </div>

          {/* Validation Panel */}
          <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>✓ Validate UUID</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '14px' }}>
                Paste UUID:
              </label>
              <input
                type="text"
                value={validateInput}
                onChange={(e) => setValidateInput(e.target.value)}
                onBlur={handleValidate}
                placeholder="Paste a UUID to validate..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {validateResult && (
              <div style={{
                padding: '1rem',
                backgroundColor: validateResult.includes('✅') ? '#d4edda' : '#f8d7da',
                borderRadius: '5px',
                border: `1px solid ${validateResult.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                color: validateResult.includes('✅') ? '#155724' : '#721c24',
                fontSize: '14px',
                marginBottom: '1rem'
              }}>
                {validateResult}
              </div>
            )}

            <button onClick={handleClear} className="action-btn clear-btn" style={{ width: '100%' }}>
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
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Generated UUIDs ({uuids.length})</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleCopyAll} className="copy-btn">
                  Copy All
                </button>
                <button onClick={handleDownload} className="copy-btn">
                  ⬇️ Download
                </button>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              padding: '1rem',
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #e0e0e0'
            }}>
              {uuids.map((uuid, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    marginBottom: '0.5rem',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <code style={{ fontSize: '12px', flex: 1, wordBreak: 'break-all' }}>
                    {uuid}
                  </code>
                  <button
                    onClick={() => handleCopyOne(uuid)}
                    style={{
                      marginLeft: '10px',
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      whiteSpace: 'nowrap'
                    }}
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
          <p style={{ marginTop: '10px' }}>
            <strong>UUID v1:</strong> Time-based, includes timestamp and MAC address<br/>
            <strong>UUID v4:</strong> Random-based, no personal information included (recommended for privacy)
          </p>
        </div>
      </div>
    </div>
  )
}
