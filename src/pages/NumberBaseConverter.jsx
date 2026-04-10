import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { convertBase, withPrefix, BASE_OPTIONS } from '../utils/numberBaseConverter'
import './NumberBaseConverter.css'

export default function NumberBaseConverter() {
  useSEO({
    title: 'Online Number Base Converter - Binary, Octal, Decimal, Hex',
    description: 'Free online number base converter. Convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16) instantly in your browser.',
    keywords: 'number base converter, binary converter, hex converter, octal converter, decimal converter, base conversion'
  })

  const [input, setInput] = useState('255')
  const [fromBase, setFromBase] = useState(10)
  const [copied, setCopied] = useState(null)

  const result = convertBase(input, fromBase)

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSwap = (toBase, value) => {
    setFromBase(toBase)
    setInput(value)
  }

  const outputs = [
    { label: 'Binary (Base 2)',      value: result.bin, base: 2  },
    { label: 'Octal (Base 8)',       value: result.oct, base: 8  },
    { label: 'Decimal (Base 10)',    value: result.dec, base: 10 },
    { label: 'Hex (Base 16)',        value: result.hex, base: 16 }
  ]

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Number Base Converter</h1>
        <p>Convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Instant conversion with prefixed output, bit-length info, and copy-to-clipboard support.</p>
      </div>

      <div className="tool-container">
        {/* Input Section */}
        <section className="tool-section">
          <div className="nbc-input-row">
            <div className="nbc-input-group">
              <label className="field-label">Source Base</label>
              <select
                value={fromBase}
                onChange={(e) => setFromBase(Number(e.target.value))}
                className="select"
              >
                {BASE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="nbc-input-group nbc-input-group--grow">
              <label className="field-label">Input Value</label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={fromBase === 16 ? 'e.g. FF' : fromBase === 2 ? 'e.g. 11111111' : 'e.g. 255'}
                className="input nbc-input"
                spellCheck={false}
              />
            </div>
          </div>
          {result.error && (
            <div className="error-message">{result.error}</div>
          )}
        </section>

        {/* Output Section */}
        <section className="tool-section">
          <h2>Conversion Results</h2>
          {result.bitLength && (
            <p className="nbc-bit-length">Bit length: <strong>{result.bitLength}</strong></p>
          )}
          <div className="nbc-results-grid">
            {outputs.map(({ label, value, base }) => (
              <div key={base} className={`nbc-result-card${fromBase === base ? ' nbc-result-card--active' : ''}`}>
                <div className="nbc-result-label">{label}</div>
                <div className="nbc-result-value">
                  <code>{value || '—'}</code>
                </div>
                {value && (
                  <div className="nbc-result-actions">
                    <button
                      onClick={() => handleCopy(value, `${base}-plain`)}
                      className="action-btn encode-btn nbc-copy-btn"
                    >
                      {copied === `${base}-plain` ? '✓ Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={() => handleCopy(withPrefix(value, base), `${base}-prefix`)}
                      className="action-btn decode-btn nbc-copy-btn"
                    >
                      {copied === `${base}-prefix` ? '✓ Copied' : `Copy with prefix${BASE_OPTIONS.find(o => o.value === base)?.prefix ? ` (${BASE_OPTIONS.find(o => o.value === base)?.prefix}...)` : ''}`}
                    </button>
                    {fromBase !== base && (
                      <button
                        onClick={() => handleSwap(base, value)}
                        className="action-btn nbc-swap-btn"
                      >
                        ↕ Use as input
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Examples */}
        <section className="tool-section">
          <div className="info-box">
            <h3>Quick Examples</h3>
            <div className="nbc-examples-grid">
              {[
                { label: 'Decimal 255',  input: '255',  base: 10 },
                { label: 'Hex FF',       input: 'FF',   base: 16 },
                { label: 'Binary 1111',  input: '1111', base: 2  },
                { label: 'Octal 377',    input: '377',  base: 8  },
                { label: 'Decimal 1024', input: '1024', base: 10 },
                { label: 'Hex DEADBEEF', input: 'DEADBEEF', base: 16 }
              ].map(ex => (
                <button
                  key={ex.label}
                  onClick={() => { setInput(ex.input); setFromBase(ex.base) }}
                  className="nbc-example-btn"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="tool-section">
          <div className="info-box">
            <h3>About Number Bases</h3>
            <ul className="about-list">
              <li><strong>Binary (Base 2):</strong> Uses digits 0–1. Used in computer architecture and low-level programming.</li>
              <li><strong>Octal (Base 8):</strong> Uses digits 0–7. Common in Unix file permissions (e.g., chmod 755).</li>
              <li><strong>Decimal (Base 10):</strong> Uses digits 0–9. The standard human-readable number system.</li>
              <li><strong>Hexadecimal (Base 16):</strong> Uses 0–9 and A–F. Widely used in memory addresses, color codes, and bytecode.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
