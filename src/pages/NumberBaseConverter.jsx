import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { convertToAllBases, BASES } from '../utils/numberBaseConverter'
import './NumberBaseConverter.css'

export default function NumberBaseConverter() {
  useSEO({
    title: 'Online Number Base Converter - Binary Octal Decimal Hex',
    description: 'Free online number base converter. Convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16) instantly. All conversions run locally in your browser.',
    keywords: 'number base converter, binary converter, hexadecimal converter, decimal to binary, hex to decimal, base conversion online'
  })

  const [input, setInput] = useState('')
  const [fromBase, setFromBase] = useState(10)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)

  const handleConvert = () => {
    setError('')
    setResult(null)

    if (!input.trim()) {
      setError('Please enter a number to convert')
      return
    }

    const res = convertToAllBases(input, fromBase)
    if (res.success) {
      setResult(res)
    } else {
      setError(res.error)
    }
  }

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
    setError('')
  }

  const loadExample = (example) => {
    setInput(example)
    setFromBase(10)
    setResult(null)
    setError('')
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Number Base Converter</h1>
        <p>Convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16) instantly. All conversions happen locally in your browser — no data is sent to any server.</p>
      </div>

      <div className="tool-container">
        <div className="base-input-section">
          <div className="base-from-selector">
            <label className="field-label">Input Base:</label>
            <div className="base-buttons">
              {Object.entries(BASES).map(([key, { label, base }]) => (
                <button
                  key={key}
                  onClick={() => { setFromBase(base); setResult(null); setError('') }}
                  className={`base-btn${fromBase === base ? ' base-btn--active' : ''}`}
                >
                  {label} ({base})
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">
              Enter {BASES[Object.keys(BASES).find(k => BASES[k].base === fromBase)]?.label} Number:
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setResult(null); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
              placeholder={`e.g. ${BASES[Object.keys(BASES).find(k => BASES[k].base === fromBase)]?.example}`}
              className="field-input base-input-full"
            />
          </div>
        </div>

        <div className="button-group">
          <button onClick={handleConvert} className="action-btn encode-btn">
            Convert
          </button>
          <button onClick={handleClear} className="action-btn clear-btn">
            Clear
          </button>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {result && (
          <div className="base-results">
            <h3 className="base-results-title">Conversion Results</h3>
            <div className="base-results-grid">
              {[
                { key: 'decimal', label: 'Decimal (Base 10)', value: result.decimal, prefix: '' },
                { key: 'binary', label: 'Binary (Base 2)', value: result.binary, prefix: '0b' },
                { key: 'octal', label: 'Octal (Base 8)', value: result.octal, prefix: '0o' },
                { key: 'hex', label: 'Hexadecimal (Base 16)', value: result.hex, prefix: '0x' }
              ].map(({ key, label, value, prefix }) => (
                <div key={key} className="base-result-card">
                  <div className="base-result-label">{label}</div>
                  <div className="base-result-value">
                    <span className="base-result-prefix">{prefix}</span>
                    <code className="base-result-code">{value}</code>
                  </div>
                  <button
                    onClick={() => handleCopy(prefix + value, key)}
                    className={`base-copy-btn${copiedKey === key ? ' base-copy-btn--copied' : ''}`}
                  >
                    {copiedKey === key ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>

            <div className="base-bit-info">
              <strong>Decimal value:</strong> {result.decimal} &nbsp;|&nbsp;
              <strong>Bit length:</strong> {result.binary.length} bits
            </div>
          </div>
        )}

        <div className="info-box info-box--spaced">
          <h4>🧪 Quick Examples</h4>
          <div className="base-examples">
            {[255, 42, 1024, 65535].map(n => (
              <button
                key={n}
                onClick={() => loadExample(String(n))}
                className="base-example-btn"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="info-box">
          <h4>About Number Bases</h4>
          <ul className="tips-list">
            <li><strong>Binary (Base 2):</strong> Uses digits 0–1. Foundation of all computer data, represented as bits.</li>
            <li><strong>Octal (Base 8):</strong> Uses digits 0–7. Common in Unix file permissions (e.g. chmod 755).</li>
            <li><strong>Decimal (Base 10):</strong> Uses digits 0–9. The standard human numbering system.</li>
            <li><strong>Hexadecimal (Base 16):</strong> Uses 0–9 and A–F. Widely used in memory addresses, color codes, and encoding.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
