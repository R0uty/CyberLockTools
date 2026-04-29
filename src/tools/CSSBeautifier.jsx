import { useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'
import { formatCSS, minifyCSS, validateCSS, getCSSStats, getCompressionRatio } from '../utils/cssFormatter'
import '../styles/pages/CSSBeautifier.css'

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
    copyText(text)
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
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1> CSS Beautifier & Minifier</h1>
        <p>Format CSS with proper indentation or minify for production. Validate syntax, check file size reduction, and analyze CSS complexity. Perfect for web developers and designers optimizing stylesheets.</p>
      </div>

      <div className="tool-container">
        <div className="mode-selector">
          <label className="mode-label">
            <input
              type="radio"
              value="format"
              checked={mode === 'format'}
              onChange={(e) => { setMode(e.target.value); setOutput(''); setError('') }}
              className="mode-radio"
            />
            Format
          </label>
          <label className="mode-label">
            <input
              type="radio"
              value="minify"
              checked={mode === 'minify'}
              onChange={(e) => { setMode(e.target.value); setOutput(''); setError('') }}
              className="mode-radio"
            />
            Minify
          </label>
          <label className="mode-label">
            <input
              type="radio"
              value="validate"
              checked={mode === 'validate'}
              onChange={(e) => { setMode(e.target.value); setOutput(''); setError('') }}
              className="mode-radio"
            />
            Validate
          </label>
        </div>

        <div className="two-col-grid">
          {/* Input */}
          <div>
            <label className="field-label">
              CSS Input:
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your CSS here..."
              className="css-textarea"
            />
            <div className="textarea-hint">
              {inputStats.characters} characters • {inputStats.lines} lines • {inputStats.rules} rules
            </div>
          </div>

          {/* Output */}
          <div>
            <label className="field-label">
              {mode === 'validate' ? 'Validation Results' : 'Output:'}
            </label>
            {mode !== 'validate' && (
              <textarea
                value={output}
                readOnly
                placeholder="Output will appear here..."
                className="css-textarea css-textarea--output"
              />
            )}
            {mode === 'validate' && validation && (
              <div className={`validation-result ${validation.valid ? 'validation-result--valid' : 'validation-result--error'}`}>
                <div className={`validation-badge ${validation.valid ? 'validation-badge--valid' : 'validation-badge--error'}`}>
                  {validation.valid ? '✅ CSS is valid!' : '❌ CSS has errors'}
                </div>

                {validation.errors.length > 0 && (
                  <div className="validation-section">
                    <strong className="validation-errors-title">Errors:</strong>
                    <ul className="validation-errors-list">
                      {validation.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validation.warnings && validation.warnings.length > 0 && (
                  <div>
                    <strong className="validation-warnings-title">Warnings:</strong>
                    <ul className="validation-warnings-list">
                      {validation.warnings.map((warn, idx) => (
                        <li key={idx}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="validation-stats">
                  <strong>Statistics:</strong>
                  <div className="validation-stats-content">
                    <div>Rules: {validation.rules}</div>
                    <div>Selectors: {inputStats.selectors}</div>
                    <div>Properties: {inputStats.properties}</div>
                  </div>
                </div>
              </div>
            )}
            {mode !== 'validate' && (
              <div className="textarea-hint">
                {output && `${output.length} characters • ${output.split('\n').length} lines`}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message error-message--mb">
            {error}
          </div>
        )}

        <div className="button-group button-group--mb">
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
            Load Example
          </button>
          {output && (
            <>
              <button onClick={() => handleCopy(output)} className="action-btn copy-btn">
                Copy Output
              </button>
              <button onClick={() => handleDownload(mode === 'minify' ? 'style.min.css' : 'style.css')} className="action-btn copy-btn">
                📥 Download
              </button>
            </>
          )}
          <button onClick={handleClear} className="action-btn clear-btn">
            Clear
          </button>
        </div>

        {stats && (
          <div className="info-box info-box--mb">
            <h4>CSS Statistics</h4>
            <div className="stats-grid">
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
          <div className="info-box info-box--mb">
            <h4>📦 Compression Stats</h4>
            <div className="stats-grid">
              <div><strong>Original Size:</strong> {compression.originalSizeKB} KB</div>
              <div><strong>Minified Size:</strong> {compression.minifiedSizeKB} KB</div>
              <div><strong>Reduction:</strong> {compression.reduction} bytes</div>
              <div><strong>Compression Ratio:</strong> <span className="compression-ratio">{compression.ratio}%</span></div>
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>Usage Tips</h4>
          <ul className="info-list">
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
