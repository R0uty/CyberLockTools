import React, { useMemo, useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'
import { analyzeCorsResponse, toCorsAnalysisJson } from '../utils/corsAnalyzer'
import '../styles/pages/CORSAnalyzer.css'

const RISKY_SAMPLE = {
  requestOrigin: 'https://evil.example',
  credentialsRequested: true,
  requestMethod: 'GET',
  requestHeaders: 'Authorization',
  rawHeaders: `HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Cache-Control: public, max-age=600`
}

const SAFER_SAMPLE = {
  requestOrigin: 'https://evil.example',
  credentialsRequested: true,
  requestMethod: 'GET',
  requestHeaders: '',
  rawHeaders: `HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example
Access-Control-Allow-Methods: GET
Vary: Origin`
}

function toTitleCase(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function CORSAnalyzer() {
  useSEO({
    title: 'CORS Analyzer',
    description: 'Analyze Access-Control-* response headers in your browser against a supplied origin and credential mode to spot risky CORS behavior.',
    keywords: 'cors analyzer, access-control-allow-origin, cors misconfiguration, header analysis, browser-only security tool'
  })

  const [rawHeaders, setRawHeaders] = useState('')
  const [requestOrigin, setRequestOrigin] = useState('https://evil.example')
  const [credentialsRequested, setCredentialsRequested] = useState(true)
  const [requestMethod, setRequestMethod] = useState('GET')
  const [requestHeaders, setRequestHeaders] = useState('')
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [copiedKey, setCopiedKey] = useState('')

  const jsonOutput = useMemo(
    () => (analysis ? toCorsAnalysisJson(analysis) : ''),
    [analysis]
  )

  const handleAnalyze = () => {
    setError('')

    try {
      const result = analyzeCorsResponse({
        rawHeaders,
        requestOrigin,
        credentialsRequested,
        requestMethod,
        requestHeaders
      })
      setAnalysis(result)
    } catch (err) {
      setAnalysis(null)
      setError(err.message)
    }
  }

  const handleClear = () => {
    setRawHeaders('')
    setRequestOrigin('https://evil.example')
    setCredentialsRequested(true)
    setRequestMethod('GET')
    setRequestHeaders('')
    setError('')
    setAnalysis(null)
  }

  const handleLoadSample = (sample) => {
    setRawHeaders(sample.rawHeaders)
    setRequestOrigin(sample.requestOrigin)
    setCredentialsRequested(sample.credentialsRequested)
    setRequestMethod(sample.requestMethod)
    setRequestHeaders(sample.requestHeaders)
    setError('')
    setAnalysis(null)
  }

  const handleCopy = async (value, key) => {
    if (!value.trim()) {
      return
    }

    await copyText(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 1800)
  }

  return (
    <div className="tool-page cors-analyzer-page">
      <div className="privacy-badge">
        All processing happens in your browser · No data is sent to any server
      </div>

      <div className="tool-header">
        <h1>CORS Analyzer</h1>
        <p>Paste response headers, supply a test Origin, and check how the browser would treat the policy. The analyzer explains broken, public, reflected, and credentialed CORS combinations.</p>
      </div>

      <div className="tool-container">
        <section className="tool-section cors-control-panel">
          <div className="button-group cors-button-group">
            <button type="button" onClick={handleAnalyze} className="action-btn encode-btn">
              Analyze CORS
            </button>
            <button type="button" onClick={() => handleLoadSample(RISKY_SAMPLE)} className="action-btn decode-btn">
              Load Risky Sample
            </button>
            <button type="button" onClick={() => handleLoadSample(SAFER_SAMPLE)} className="action-btn decode-btn">
              Load Safer Sample
            </button>
            <button type="button" onClick={handleClear} className="action-btn clear-btn">
              Clear
            </button>
          </div>
        </section>

        <section className="tool-section cors-request-context">
          <div className="cors-context-grid">
            <div className="textarea-group">
              <label htmlFor="cors-request-origin">Test Origin</label>
              <input
                id="cors-request-origin"
                type="text"
                value={requestOrigin}
                onChange={(event) => setRequestOrigin(event.target.value)}
                placeholder="https://evil.example"
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="cors-request-method">Requested Method</label>
              <input
                id="cors-request-method"
                type="text"
                value={requestMethod}
                onChange={(event) => setRequestMethod(event.target.value)}
                placeholder="GET"
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="cors-request-headers">Requested Headers</label>
              <input
                id="cors-request-headers"
                type="text"
                value={requestHeaders}
                onChange={(event) => setRequestHeaders(event.target.value)}
                placeholder="Authorization, X-Api-Key"
              />
            </div>

            <label className="cors-checkbox">
              <input
                type="checkbox"
                checked={credentialsRequested}
                onChange={(event) => setCredentialsRequested(event.target.checked)}
              />
              <span>Credentials requested (cookies / Authorization / TLS client certs)</span>
            </label>
          </div>
        </section>

        {error ? <div className="error-message">{error}</div> : null}

        <section className="tool-row cors-textarea-row">
          <div className="textarea-group">
            <label htmlFor="cors-raw-headers">Response Headers</label>
            <textarea
              id="cors-raw-headers"
              value={rawHeaders}
              onChange={(event) => {
                setRawHeaders(event.target.value)
                setError('')
                setAnalysis(null)
              }}
              placeholder="Paste the raw response headers here..."
              className="textarea cors-textarea"
              rows={14}
              spellCheck={false}
            />
          </div>

          <div className="textarea-group">
            <label htmlFor="cors-json-output">Analysis JSON</label>
            <textarea
              id="cors-json-output"
              value={jsonOutput}
              readOnly
              className="textarea output cors-textarea"
              rows={14}
              spellCheck={false}
            />
            {jsonOutput ? (
              <button type="button" onClick={() => handleCopy(jsonOutput, 'json')} className="copy-btn">
                {copiedKey === 'json' ? 'Copied JSON' : 'Copy JSON'}
              </button>
            ) : null}
          </div>
        </section>

        {analysis ? (
          <>
            <section className="info-box info-box--alt cors-summary-box" aria-label="CORS summary">
              <h4>Assessment Summary</h4>
              <div className="cors-summary-grid">
                <div>
                  <strong>Browser Outcome</strong>
                  <span>{analysis.browserOutcome.allowed === true ? 'Allowed' : analysis.browserOutcome.allowed === false ? 'Blocked' : 'Needs Context'}</span>
                </div>
                <div>
                  <strong>Risk Level</strong>
                  <span>{toTitleCase(analysis.riskLevel)}</span>
                </div>
                <div>
                  <strong>Policy Type</strong>
                  <span>{analysis.policyType}</span>
                </div>
                <div>
                  <strong>ACAO</strong>
                  <span>{analysis.responsePolicy.allowOrigin || 'None'}</span>
                </div>
              </div>
              <p className="cors-summary-verdict">{analysis.browserOutcome.verdict}</p>
            </section>

            <section className="tool-section cors-findings-section">
              <div className="cors-results-header">
                <h3>Findings</h3>
                <button
                  type="button"
                  onClick={() => handleCopy(analysis.findings.map((finding) => `[${finding.level.toUpperCase()}] ${finding.title} - ${finding.detail}`).join('\n'), 'findings')}
                  className="action-btn clear-btn"
                >
                  {copiedKey === 'findings' ? 'Copied Findings' : 'Copy Findings'}
                </button>
              </div>

              <div className="cors-findings-grid">
                {analysis.findings.map((finding) => (
                  <article key={`${finding.level}-${finding.title}`} className={`cors-finding-card cors-finding-card--${finding.level}`}>
                    <span className="cors-finding-level">{finding.level}</span>
                    <h4>{finding.title}</h4>
                    <p>{finding.detail}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="tool-section cors-policy-section">
              <h3>Observed Policy Details</h3>
              <div className="cors-policy-grid">
                <div>
                  <strong>Allow-Credentials</strong>
                  <span>{analysis.responsePolicy.allowCredentials ? 'true' : 'false'}</span>
                </div>
                <div>
                  <strong>Allow-Methods</strong>
                  <span>{analysis.responsePolicy.allowMethods.join(', ') || 'Not specified'}</span>
                </div>
                <div>
                  <strong>Allow-Headers</strong>
                  <span>{analysis.responsePolicy.allowHeaders.join(', ') || 'Not specified'}</span>
                </div>
                <div>
                  <strong>Expose-Headers</strong>
                  <span>{analysis.responsePolicy.exposeHeaders.join(', ') || 'Not specified'}</span>
                </div>
                <div>
                  <strong>Vary</strong>
                  <span>{analysis.responsePolicy.vary.join(', ') || 'Not specified'}</span>
                </div>
                <div>
                  <strong>Origin Allowed?</strong>
                  <span>{analysis.evaluation.originAllowed === null ? 'No test origin' : analysis.evaluation.originAllowed ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </section>
          </>
        ) : null}

        <div className="info-box">
          <h4>How to use it</h4>
          <p>Paste response headers from DevTools, Burp, or curl; set the Origin you want to test; then compare wildcard, reflected, null-origin, and credentialed behaviors without leaving the browser.</p>
        </div>
      </div>
    </div>
  )
}
