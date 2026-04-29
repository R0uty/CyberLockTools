import { useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'
import { encodeHTMLStandard, encodeHTMLFull, decodeHTML, getEncodingStats } from '../utils/htmlEncoder'
import '../styles/pages/HTMLEncoder.css'

const EXAMPLE_PLAIN = '<script>alert("Hello & Welcome!");</script>\n© 2024 R0uty\'s Lab — Free Tools'
const EXAMPLE_ENCODED = '&lt;div class=&quot;test&quot;&gt;Hello &amp; World&lt;/div&gt;'

export default function HTMLEncoder() {
  useSEO({
    title: 'Online HTML Encoder & Decoder - HTML Entity Converter',
    description: 'Free online HTML encoder and decoder. Encode text to HTML entities and decode HTML entities back to plain text. Supports named, decimal, and hex numeric entities.',
    keywords: 'html encoder, html decoder, html entities, html escape, html unescape, entity converter'
  })

  const [mode, setMode] = useState('encode')
  const [encodeMode, setEncodeMode] = useState('standard')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleProcess = () => {
    if (mode === 'encode') {
      const result = encodeMode === 'standard'
        ? encodeHTMLStandard(input)
        : encodeHTMLFull(input)
      setOutput(result)
    } else {
      setOutput(decodeHTML(input))
    }
  }

  const handleCopy = () => {
    copyText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  const stats = output ? getEncodingStats(input, output) : null

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>HTML Encoder &amp; Decoder</h1>
        <p>Encode plain text to HTML entities and decode HTML entities back to readable text. Supports standard encoding (critical chars), full encoding (all non-ASCII), and decoding of named, decimal, and hex numeric entities.</p>
      </div>

      <div className="tool-container">
        {/* Mode Selection */}
        <section className="tool-section">
          <div className="html-mode-tabs">
            <button
              onClick={() => { setMode('encode'); setInput(''); setOutput('') }}
              className={mode === 'encode' ? 'html-tab html-tab--active' : 'html-tab'}
            >
              Encode
            </button>
            <button
              onClick={() => { setMode('decode'); setInput(''); setOutput('') }}
              className={mode === 'decode' ? 'html-tab html-tab--active' : 'html-tab'}
            >
              Decode
            </button>
          </div>

          {mode === 'encode' && (
            <div className="html-encode-options">
              <label className="field-label">Encoding Mode:</label>
              <div className="html-radio-group">
                <label className="html-radio-label">
                  <input
                    type="radio"
                    value="standard"
                    checked={encodeMode === 'standard'}
                    onChange={() => setEncodeMode('standard')}
                  />
                  Standard — encode critical chars only (<code>&amp; &lt; &gt; &quot; &#39; / = `</code>)
                </label>
                <label className="html-radio-label">
                  <input
                    type="radio"
                    value="full"
                    checked={encodeMode === 'full'}
                    onChange={() => setEncodeMode('full')}
                  />
                  Full — encode all non-ASCII characters as <code>&amp;#NNN;</code>
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Input / Output */}
        <section className="tool-section">
          <div className="two-column-layout">
            <div className="column">
              <label className="field-label">
                {mode === 'encode' ? 'Plain Text Input' : 'HTML-Encoded Input'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode'
                  ? 'Enter plain text to encode...'
                  : 'Enter HTML entities to decode...'}
                className="textarea html-textarea"
                rows={8}
                spellCheck={false}
              />
              <div className="html-example-row">
                <button
                  onClick={() => { setInput(mode === 'encode' ? EXAMPLE_PLAIN : EXAMPLE_ENCODED); setOutput('') }}
                  className="action-btn"
                >
                  Load Example
                </button>
                <button onClick={handleClear} className="action-btn">Clear</button>
              </div>
            </div>

            <div className="column">
              <label className="field-label">
                {mode === 'encode' ? 'HTML-Encoded Output' : 'Decoded Plain Text'}
              </label>
              <textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
                className="textarea output html-textarea"
                rows={8}
                spellCheck={false}
              />
              {output && (
                <button onClick={handleCopy} className={`action-btn encode-btn${copied ? ' html-copied' : ''}`}>
                  {copied ? '✓ Copied!' : 'Copy to Clipboard'}
                </button>
              )}
            </div>
          </div>

          <div className="html-process-row">
            <button
              onClick={handleProcess}
              className="action-btn encode-btn html-process-btn"
              disabled={!input.trim()}
            >
              {mode === 'encode' ? '→ Encode' : '→ Decode'}
            </button>
          </div>

          {stats && (
            <div className="html-stats">
              <span>Original: <strong>{stats.originalLength}</strong> chars</span>
              <span>Result: <strong>{stats.encodedLength}</strong> chars</span>
              <span>Ratio: <strong>{stats.expansionRatio}×</strong></span>
              <span>Entities: <strong>{stats.entitiesCount}</strong></span>
            </div>
          )}
        </section>

        {/* About */}
        <section className="tool-section">
          <div className="info-box">
            <h3>About HTML Encoding</h3>
            <ul className="about-list">
              <li><strong>Standard Encoding:</strong> Encodes the 8 critical characters (<code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&quot;</code>, <code>&#39;</code>, <code>/</code>, <code>=</code>, <code>`</code>) that could allow XSS or HTML injection.</li>
              <li><strong>Full Encoding:</strong> Encodes all non-ASCII characters as decimal numeric entities (<code>&amp;#NNN;</code>) — safe for any charset context.</li>
              <li><strong>Decoding:</strong> Supports named entities (<code>&amp;amp;</code>), decimal numeric (<code>&amp;#38;</code>), and hex numeric (<code>&amp;#x26;</code>) entities.</li>
              <li><strong>Use Cases:</strong> Preventing XSS, safely inserting dynamic content in HTML, email templates, and XML documents.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
