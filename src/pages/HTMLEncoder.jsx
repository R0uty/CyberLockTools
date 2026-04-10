import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { encodeHTML, encodeHTMLFull, decodeHTML, EXAMPLES } from '../utils/htmlEncoder'
import './HTMLEncoder.css'

export default function HTMLEncoder() {
  useSEO({
    title: 'Online HTML Encoder & Decoder Tool',
    description: 'Free online HTML encoder and decoder. Encode special characters to HTML entities and decode HTML entities back to plain text. Essential for web development and XSS prevention. All processing in your browser.',
    keywords: 'html encoder, html decoder, html entities, encode html, decode html, html escape, html unescape online'
  })

  const [input, setInput] = useState('')
  const [mode, setMode] = useState('encode')
  const [encodeMode, setEncodeMode] = useState('standard')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleProcess = () => {
    setError('')
    setResult(null)

    if (!input.trim()) {
      setError('Please enter text to ' + mode)
      return
    }

    let res
    if (mode === 'encode') {
      res = encodeMode === 'full' ? encodeHTMLFull(input) : encodeHTML(input)
    } else {
      res = decodeHTML(input)
    }

    if (res.success) {
      setResult(res)
    } else {
      setError(res.error)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
    setError('')
    setCopied(false)
  }

  const loadExample = (ex) => {
    setInput(ex.input)
    setMode('encode')
    setResult(null)
    setError('')
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>HTML Encoder &amp; Decoder</h1>
        <p>Encode special characters to HTML entities to prevent XSS attacks and ensure safe HTML rendering. Decode HTML entities back to readable text. Essential for web developers and security professionals. All processing happens locally in your browser.</p>
      </div>

      <div className="tool-container">
        <div className="html-mode-selector">
          <label className="radio-label">
            <input
              type="radio"
              value="encode"
              checked={mode === 'encode'}
              onChange={(e) => { setMode(e.target.value); setResult(null); setError('') }}
              className="radio-input"
            />
            Encode (Text → HTML Entities)
          </label>
          <label className="radio-label--last">
            <input
              type="radio"
              value="decode"
              checked={mode === 'decode'}
              onChange={(e) => { setMode(e.target.value); setResult(null); setError('') }}
              className="radio-input"
            />
            Decode (HTML Entities → Text)
          </label>
        </div>

        {mode === 'encode' && (
          <div className="html-encode-mode-selector">
            <label className="radio-label">
              <input
                type="radio"
                value="standard"
                checked={encodeMode === 'standard'}
                onChange={(e) => setEncodeMode(e.target.value)}
                className="radio-input"
              />
              Standard (encode &amp; &lt; &gt; &quot; &apos; / ` =)
            </label>
            <label className="radio-label--last">
              <input
                type="radio"
                value="full"
                checked={encodeMode === 'full'}
                onChange={(e) => setEncodeMode(e.target.value)}
                className="radio-input"
              />
              Full (encode all non-ASCII characters too)
            </label>
          </div>
        )}

        <div className="form-field">
          <label className="field-label">
            {mode === 'encode' ? 'Text to Encode:' : 'HTML Entities to Decode:'}
          </label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setResult(null); setError('') }}
            placeholder={mode === 'encode'
              ? 'Enter text with special characters, e.g.: <script>alert("XSS")</script>'
              : 'Enter HTML entities, e.g.: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
            }
            className="field-textarea"
            rows={5}
          />
        </div>

        <div className="button-group">
          <button onClick={handleProcess} className="action-btn encode-btn">
            {mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
          </button>
          <button onClick={handleClear} className="action-btn clear-btn">
            Clear
          </button>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {result && (
          <div className="html-result-box">
            <div className="html-result-header">
              <h3 className="html-result-title">
                {mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
              </h3>
              <div className="html-result-stats">
                {mode === 'encode'
                  ? `${result.charCount} → ${result.encodedCount} chars`
                  : `${result.charCount} → ${result.decodedCount} chars`
                }
              </div>
            </div>
            <textarea
              readOnly
              value={result.result}
              className="field-textarea html-result-textarea"
              rows={5}
            />
            <button
              onClick={handleCopy}
              className={`action-btn encode-btn${copied ? ' html-btn-copied' : ''}`}
            >
              {copied ? '✓ Copied!' : 'Copy Result'}
            </button>
          </div>
        )}

        <div className="info-box info-box--spaced">
          <h4>🧪 Quick Examples</h4>
          <div className="html-examples">
            {EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => loadExample(ex)}
                className="html-example-btn"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className="info-box">
          <h4>HTML Entity Reference</h4>
          <div className="html-entity-table">
            {[
              ['&', '&amp;'],
              ['<', '&lt;'],
              ['>', '&gt;'],
              ['"', '&quot;'],
              ["'", '&#39;'],
              ['/', '&#x2F;'],
              ['©', '&copy;'],
              ['®', '&reg;'],
              ['™', '&trade;'],
              ['€', '&euro;'],
              ['…', '&hellip;'],
              ['—', '&mdash;']
            ].map(([char, entity]) => (
              <div key={entity} className="html-entity-row">
                <code className="html-entity-char">{char}</code>
                <span className="html-entity-arrow">→</span>
                <code className="html-entity-code">{entity}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="info-box info-box--alt">
          <h4>Why HTML Encoding Matters</h4>
          <ul className="tips-list">
            <li><strong>XSS Prevention:</strong> Encoding user input prevents Cross-Site Scripting attacks by neutralising script tags and event handlers.</li>
            <li><strong>Safe Rendering:</strong> HTML entities ensure special characters like &lt; and &gt; render as text, not HTML markup.</li>
            <li><strong>Data Integrity:</strong> Preserves the exact content of user input when stored or displayed in HTML contexts.</li>
            <li><strong>Standard Compliance:</strong> Ensures your HTML is valid and parses correctly across all browsers.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
