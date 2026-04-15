import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { convertToAllBases, BASE_LABELS, BASE_PREFIXES, EXAMPLES } from '../utils/numberBaseConverter'
import '../styles/pages/NumberBaseConverter.css'

export default function NumberBaseConverter() {
  useSEO({
    title: 'Online Number Base Converter - Binary Octal Decimal Hex Converter',
    description: 'Free online number base converter. Convert between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16) instantly in your browser. Perfect for programmers and security professionals.',
    keywords: 'number base converter, binary to decimal, hex converter, octal, hexadecimal, base conversion, binary decimal hex octal',
  })

  const [input, setInput] = useState('')
  const [fromBase, setFromBase] = useState(10)
  const [copiedField, setCopiedField] = useState(null)

  const result = convertToAllBases(input, fromBase)

  const handleCopy = (value, field) => {
    if (!value) return
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const loadExample = (example) => {
    setFromBase(10)
    setInput(example.decimal)
  }

  const bases = [2, 8, 10, 16]

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Number Base Converter</h1>
        <p>Convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Instantly see all representations at once. Useful for programming, networking, and security work.</p>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="tool-content">
            {/* Input area */}
            <div className="nbc-input-row">
              <div className="nbc-from-group">
                <label className="nbc-label">Input Base</label>
                <select
                  value={fromBase}
                  onChange={(e) => {
                    setFromBase(parseInt(e.target.value, 10))
                    setInput('')
                  }}
                  className="select"
                >
                  {bases.map(b => (
                    <option key={b} value={b}>{BASE_LABELS[b]}</option>
                  ))}
                </select>
              </div>
              <div className="nbc-value-group">
                <label className="nbc-label">
                  Enter value ({BASE_LABELS[fromBase]})
                </label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={fromBase === 16 ? 'e.g. FF or 1A2B' : fromBase === 2 ? 'e.g. 10101100' : fromBase === 8 ? 'e.g. 377' : 'e.g. 255'}
                  className="input nbc-input-full"
                  spellCheck={false}
                />
              </div>
            </div>

            {result.error && (
              <div className="nbc-error">{result.error}</div>
            )}

            {/* Results grid */}
            <div className="nbc-results-grid">
              {bases.map(base => {
                const fieldName = base === 2 ? 'binary' : base === 8 ? 'octal' : base === 10 ? 'decimal' : 'hex'
                const value = result[fieldName]
                const isSource = base === fromBase
                return (
                  <div key={base} className={`nbc-result-card${isSource ? ' nbc-result-card--source' : ''}`}>
                    <div className="nbc-result-label">
                      {BASE_LABELS[base]}
                      {BASE_PREFIXES[base] && (
                        <span className="nbc-prefix-badge">{BASE_PREFIXES[base]}</span>
                      )}
                    </div>
                    <div className="nbc-result-value">
                      {value || <span className="nbc-result-placeholder">—</span>}
                    </div>
                    {value && (
                      <button
                        onClick={() => handleCopy(value, fieldName)}
                        className={`nbc-copy-btn${copiedField === fieldName ? ' nbc-copy-btn--copied' : ''}`}
                      >
                        {copiedField === fieldName ? '✓ Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="tool-section">
          <div className="info-box">
            <h3>Quick Examples</h3>
            <p>Click an example to load it:</p>
            <div className="nbc-examples-grid">
              {EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => loadExample(ex)}
                  className="nbc-example-btn"
                >
                  <div className="nbc-example-label">{ex.label}</div>
                  <div className="nbc-example-values">
                    <span><strong>Dec:</strong> {ex.decimal}</span>
                    <span><strong>Hex:</strong> {ex.hex}</span>
                    <span><strong>Bin:</strong> {ex.binary}</span>
                  </div>
                </button>
              ))}
            </div>

            <h3>Number Base Reference</h3>
            <div className="nbc-reference-table">
              <table className="nbc-table">
                <thead>
                  <tr>
                    <th>Base</th>
                    <th>Name</th>
                    <th>Digits Used</th>
                    <th>Common Prefix</th>
                    <th>Use Cases</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2</td>
                    <td>Binary</td>
                    <td>0, 1</td>
                    <td><code>0b</code></td>
                    <td>CPU flags, bitwise operations, network masks</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>Octal</td>
                    <td>0–7</td>
                    <td><code>0o</code></td>
                    <td>Unix file permissions, legacy systems</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>Decimal</td>
                    <td>0–9</td>
                    <td>—</td>
                    <td>General-purpose, human-readable numbers</td>
                  </tr>
                  <tr>
                    <td>16</td>
                    <td>Hexadecimal</td>
                    <td>0–9, A–F</td>
                    <td><code>0x</code></td>
                    <td>Memory addresses, color codes, byte encoding</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Tips for Security Professionals</h3>
            <ul className="nbc-info-list">
              <li><strong>Hex encoding:</strong> Shellcode and payloads are often represented in hex (e.g., <code>\x41</code> = 'A')</li>
              <li><strong>IP addresses:</strong> IPv4 addresses can be expressed as a single 32-bit hex integer</li>
              <li><strong>File permissions:</strong> Unix permissions like 755 or 644 are octal values</li>
              <li><strong>Bit flags:</strong> Security flags, permissions masks, and protocol fields use binary/hex representations</li>
              <li><strong>ASCII/Unicode:</strong> Character codes are often expressed in hex or decimal</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
