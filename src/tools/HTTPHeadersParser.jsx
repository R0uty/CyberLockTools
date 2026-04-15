import { useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { parseHttpHeaders, toHeadersJson } from '../utils/httpHeadersParser'
import '../styles/pages/HTTPHeadersParser.css'

const SAMPLE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: no-store
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; object-src 'none'
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax`

export default function HTTPHeadersParser() {
  useSEO({
    title: 'HTTP Headers Parser',
    description: 'Parse raw HTTP request or response headers in your browser, detect duplicates, and review common security headers.',
    keywords: 'http headers parser, response headers, request headers, security headers, browser parser'
  })

  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [parsedResult, setParsedResult] = useState(null)
  const [copied, setCopied] = useState('')

  const jsonOutput = useMemo(
    () => parsedResult ? toHeadersJson(parsedResult) : '',
    [parsedResult]
  )

  const handleParse = () => {
    setError('')

    try {
      const result = parseHttpHeaders(input)
      setParsedResult(result)
    } catch (err) {
      setError(err.message)
      setParsedResult(null)
    }
  }

  const handleClear = () => {
    setInput('')
    setError('')
    setParsedResult(null)
  }

  const handleLoadSample = () => {
    setInput(SAMPLE_RESPONSE)
    setError('')
    setParsedResult(null)
  }

  const handleCopy = async (value, key) => {
    if (!value.trim()) return

    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="tool-page headers-parser-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>

      <div className="tool-header">
        <h1>HTTP Headers Parser</h1>
        <p>Paste a raw HTTP request, response, or plain header block to get a structured view, duplicate detection, JSON output, and a quick security-header review.</p>
      </div>

      <div className="tool-container">
        <section className="tool-section headers-control-panel">
          <div className="button-group headers-button-group">
            <button onClick={handleParse} className="action-btn encode-btn">
              Parse Headers
            </button>
            <button onClick={handleLoadSample} className="action-btn decode-btn">
              Load Sample
            </button>
            <button onClick={handleClear} className="action-btn clear-btn">
              Clear
            </button>
          </div>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="tool-row headers-input-row">
          <div className="textarea-group">
            <label htmlFor="headers-parser-input">HTTP Headers Input</label>
            <textarea
              id="headers-parser-input"
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                setError('')
                setParsedResult(null)
              }}
              placeholder="Paste a raw request, response, or header block here..."
              className="textarea headers-textarea"
              rows={14}
              spellCheck={false}
            />
          </div>

          <div className="textarea-group">
            <label htmlFor="headers-parser-json">JSON Output</label>
            <textarea
              id="headers-parser-json"
              value={jsonOutput}
              readOnly
              className="textarea output headers-textarea"
              rows={14}
              spellCheck={false}
            />
            {jsonOutput && (
              <button onClick={() => handleCopy(jsonOutput, 'json')} className="copy-btn">
                {copied === 'json' ? 'Copied JSON' : 'Copy JSON'}
              </button>
            )}
          </div>
        </section>

        {parsedResult && (
          <>
            <section className="info-box info-box--alt headers-summary-box">
              <h4>Parse Summary</h4>
              <div className="headers-summary-grid">
                <div><strong>Kind</strong><span>{parsedResult.kind}</span></div>
                <div><strong>Total Headers</strong><span>{parsedResult.headerCount}</span></div>
                <div><strong>Unique Names</strong><span>{parsedResult.uniqueHeaderCount}</span></div>
                <div><strong>Duplicates</strong><span>{parsedResult.duplicateHeaders.length}</span></div>
              </div>
              {parsedResult.startLine && (
                <p className="headers-start-line"><strong>Start line:</strong> {parsedResult.startLine}</p>
              )}
            </section>

            {parsedResult.kind === 'response' && (
              <section className="tool-section headers-security-section">
                <div className="headers-security-grid">
                  <div className="headers-status-card">
                    <h3>Present security headers</h3>
                    {parsedResult.securityReview.present.length > 0 ? (
                      <ul>
                        {parsedResult.securityReview.present.map((headerName) => (
                          <li key={headerName}>{headerName}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>None of the tracked security headers were found.</p>
                    )}
                  </div>
                  <div className="headers-status-card headers-status-card--warning">
                    <h3>Missing security headers</h3>
                    {parsedResult.securityReview.missing.length > 0 ? (
                      <ul>
                        {parsedResult.securityReview.missing.map((headerName) => (
                          <li key={headerName}>{headerName}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>All tracked security headers are present.</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {parsedResult.invalidLines.length > 0 && (
              <section className="tool-section headers-invalid-section">
                <h3>Lines that could not be parsed</h3>
                <div className="headers-badge-list">
                  {parsedResult.invalidLines.map((line, index) => (
                    <span key={`${line}-${index}`} className="headers-badge headers-badge--invalid">{line}</span>
                  ))}
                </div>
              </section>
            )}

            {parsedResult.duplicateHeaders.length > 0 && (
              <section className="tool-section headers-duplicate-section">
                <h3>Duplicate headers</h3>
                <div className="headers-badge-list">
                  {parsedResult.duplicateHeaders.map((header) => (
                    <span key={header.name} className="headers-badge headers-badge--warning">
                      {header.name} x{header.count}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="tool-section headers-results-section">
              <div className="headers-results-header">
                <h3>Header list</h3>
                <button
                  onClick={() => handleCopy(parsedResult.structuredHeaders.map((header) => `${header.name}: ${header.value}`).join('\n'), 'list')}
                  className="action-btn clear-btn"
                >
                  {copied === 'list' ? 'Copied List' : 'Copy Header List'}
                </button>
              </div>

              <div className="headers-table">
                <div className="headers-table-head">
                  <span>Name</span>
                  <span>Value</span>
                </div>
                <div className="headers-table-body">
                  {parsedResult.structuredHeaders.map((header, index) => (
                    <div key={`${header.lowerName}-${index}`} className={header.duplicate ? 'headers-row headers-row--duplicate' : 'headers-row'}>
                      <div className="headers-cell headers-cell--name">
                        <strong>{header.name}</strong>
                        {header.duplicate && <span className="headers-duplicate-tag">Duplicate</span>}
                      </div>
                      <div className="headers-cell headers-cell--value">
                        <code>{header.value || '(empty)'}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <div className="info-box">
          <h4>How to use it</h4>
          <p>Paste a full HTTP request or response block, or just the headers. The parser accepts folded continuation lines, flags duplicates, and shows a quick security-header review for responses.</p>
        </div>
      </div>
    </div>
  )
}
