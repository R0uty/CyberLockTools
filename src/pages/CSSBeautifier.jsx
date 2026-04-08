import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { formatCSS, minifyCSS, validateCSS, getCSSStats, getCompressionRatio } from '../utils/cssFormatter'

export default function CSSBeautifier() {
  useSEO({
    title: 'Online CSS Beautifier & Minifier Tool',
    description: 'Free online CSS beautifier and minifier. Format CSS with proper indentation or compress for production. Validate syntax, check stats, and optimize stylesheet size instantly.',
    keywords: 'css beautifier, css minifier, css formatter, css optimizer, online css tool, format css'
  })

  const [input, setInput] = useState(`body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}`)
  const [mode, setMode] = useState('format') // 'format', 'minify', 'validate'
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState(null)
  const [validation, setValidation] = useState(null)
  const [compression, setCompression] = useState(null)
  const [error, setError] = useState('')

  const handleFormat = () => {
    setError('')
    setValidation(null)
    setCompression(null)

    const result = formatCSS(input)
    if (result.success) {
      setOutput(result.formatted)
      const stats = getCSSStats(result.formatted)
      setStats(stats)
    } else {
      setError(result.error)
      setOutput('')
    }
  }

  const handleMinify = () => {
    setError('')
    setValidation(null)

    const result = minifyCSS(input)
    if (result.success) {
      setOutput(result.minified)
      const stats = getCSSStats(result.minified)
      setStats(stats)
      const compression = getCompressionRatio(input, result.minified)
      setCompression(compression)
    } else {
      setError(result.error)
      setOutput('')
    }
  }

  const handleValidate = () => {
    setError('')
    setOutput('')
    setStats(null)
    setCompression(null)

    const validation = validateCSS(input)
    setValidation(validation)
  }

  const handleCopy = (text) => {
    if (!text) {
      setError('Nothing to copy')
      return
    }
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const handleDownload = (filename) => {
    const content = output || input
    if (!content) {
      setError('Nothing to download')
      return
    }

    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/css' })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setStats(null)
    setValidation(null)
    setCompression(null)
  }

  const handleLoadExample = () => {
    const example = `/* Example: Modern Card Layout */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .card {
    margin: 5px;
    padding: 15px;
  }
}`
    setInput(example)
    setOutput('')
    setStats(null)
    setValidation(null)
    setCompression(null)
  }

  const inputStats = getCSSStats(input)

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        🔒 All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>💅 CSS Beautifier & Minifier</h1>
        <p>Format CSS with proper indentation or minify for production. Validate syntax, check file size reduction, and analyze CSS complexity. Perfect for web developers and designers optimizing stylesheets.</p>
      </div>

      <div className="tool-container">
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}>
          <label style={{ marginRight: '1rem', fontSize: '14px' }}>
            <input
              type="radio"
              value="format"
              checked={mode === 'format'}
              onChange={(e) => { setMode(e.target.value); setOutput(''); setError('') }}
              style={{ marginRight: '0.5rem' }}
            />
            Format
          </label>
          <label style={{ marginRight: '1rem', fontSize: '14px' }}>
            <input
              type="radio"
              value="minify"
              checked={mode === 'minify'}
              onChange={(e) => { setMode(e.target.value); setOutput(''); setError('') }}
              style={{ marginRight: '0.5rem' }}
            />
            Minify
          </label>
          <label style={{ fontSize: '14px' }}>
            <input
              type="radio"
              value="validate"
              checked={mode === 'validate'}
              onChange={(e) => { setMode(e.target.value); setOutput(''); setError('') }}
              style={{ marginRight: '0.5rem' }}
            />
            Validate
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              CSS Input:
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your CSS here..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '12px',
                fontFamily: 'monospace',
                minHeight: '400px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
              {inputStats.characters} characters • {inputStats.lines} lines • {inputStats.rules} rules
            </div>
          </div>

          {/* Output */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {mode === 'validate' ? 'Validation Results' : 'Output:'}
            </label>
            {mode !== 'validate' && (
              <textarea
                value={output}
                readOnly
                placeholder="Output will appear here..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  minHeight: '400px',
                  boxSizing: 'border-box',
                  backgroundColor: '#f9f9f9',
                  color: '#333'
                }}
              />
            )}
            {mode === 'validate' && validation && (
              <div style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '5px',
                minHeight: '400px',
                boxSizing: 'border-box',
                backgroundColor: validation.valid ? '#f0fdf4' : '#fef2f2',
                overflowY: 'auto'
              }}>
                <div style={{
                  padding: '1rem',
                  borderRadius: '5px',
                  marginBottom: '1rem',
                  backgroundColor: validation.valid ? '#dcfce7' : '#fee2e2',
                  color: validation.valid ? '#166534' : '#991b1b',
                  fontWeight: 'bold'
                }}>
                  {validation.valid ? '✅ CSS is valid!' : '❌ CSS has errors'}
                </div>

                {validation.errors.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#991b1b' }}>Errors:</strong>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#7f1d1d' }}>
                      {validation.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validation.warnings && validation.warnings.length > 0 && (
                  <div>
                    <strong style={{ color: '#b45309' }}>Warnings:</strong>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#92400e' }}>
                      {validation.warnings.map((warn, idx) => (
                        <li key={idx}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
                  <strong>Statistics:</strong>
                  <div style={{ fontSize: '13px', marginTop: '0.5rem', color: '#333' }}>
                    <div>Rules: {validation.rules}</div>
                    <div>Selectors: {inputStats.selectors}</div>
                    <div>Properties: {inputStats.properties}</div>
                  </div>
                </div>
              </div>
            )}
            {mode !== 'validate' && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
                {output && `${output.length} characters • ${output.split('\n').length} lines`}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '1.5rem' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="button-group" style={{ marginBottom: '1.5rem' }}>
          {mode === 'format' && (
            <button onClick={handleFormat} className="action-btn encode-btn">
              ✨ Format CSS
            </button>
          )}
          {mode === 'minify' && (
            <button onClick={handleMinify} className="action-btn encode-btn">
              📦 Minify CSS
            </button>
          )}
          {mode === 'validate' && (
            <button onClick={handleValidate} className="action-btn encode-btn">
              ✓ Validate CSS
            </button>
          )}
          <button onClick={handleLoadExample} className="action-btn copy-btn">
            📋 Load Example
          </button>
          {output && (
            <>
              <button onClick={() => handleCopy(output)} className="action-btn copy-btn">
                📋 Copy Output
              </button>
              <button onClick={() => handleDownload(mode === 'minify' ? 'style.min.css' : 'style.css')} className="action-btn copy-btn">
                📥 Download
              </button>
            </>
          )}
          <button onClick={handleClear} className="action-btn clear-btn">
            🗑️ Clear
          </button>
        </div>

        {stats && (
          <div className="info-box" style={{ marginBottom: '1.5rem' }}>
            <h4>📊 CSS Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '13px' }}>
              <div><strong>Selectors:</strong> {stats.selectors}</div>
              <div><strong>Rules:</strong> {stats.rules}</div>
              <div><strong>Properties:</strong> {stats.properties}</div>
              <div><strong>Colors:</strong> {stats.colors}</div>
              <div><strong>Media Queries:</strong> {stats.mediaQueries}</div>
              <div><strong>Keyframes:</strong> {stats.keyframes}</div>
              <div><strong>Font-faces:</strong> {stats.fonts}</div>
              <div><strong>Imports:</strong> {stats.imports}</div>
              <div><strong>Complexity:</strong> {stats.complexity}</div>
              <div><strong>Lines:</strong> {stats.lines}</div>
            </div>
          </div>
        )}

        {compression && (
          <div className="info-box" style={{ marginBottom: '1.5rem' }}>
            <h4>📦 Compression Stats</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '13px' }}>
              <div><strong>Original Size:</strong> {compression.originalSizeKB} KB</div>
              <div><strong>Minified Size:</strong> {compression.minifiedSizeKB} KB</div>
              <div><strong>Reduction:</strong> {compression.reduction} bytes</div>
              <div><strong>Compression Ratio:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{compression.ratio}%</span></div>
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>ℹ️ Usage Tips</h4>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '13px' }}>
            <li><strong>Format:</strong> Beautifies CSS with proper indentation for readability and maintenance</li>
            <li><strong>Minify:</strong> Removes all whitespace and comments to reduce file size for production</li>
            <li><strong>Validate:</strong> Checks CSS syntax for errors and inconsistencies</li>
            <li><strong>Best Practice:</strong> Use formatted CSS during development, minify for production</li>
            <li><strong>File Size:</strong> Minified CSS can reduce by 20-80% depending on formatting</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
