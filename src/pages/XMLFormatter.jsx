import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { formatXML, getXMLStats, minifyXML } from '../utils/xmlFormatter'

export default function XMLFormatter() {
  useSEO({
    title: 'Online XML Formatter and Validator Tool',
    description: 'Free online XML formatter, validator, and minifier. Paste XML and instantly format with proper indentation, validate syntax, and identify errors. Perfect for developers and data processing.',
    keywords: 'xml formatter, xml validator, xml beautifier, xml minifier, online xml tool'
  })

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  const handleFormat = () => {
    setError('')
    setOutput('')
    setStats(null)

    try {
      if (!input.trim()) {
        setError('Please paste XML to format')
        return
      }

      const result = formatXML(input)

      if (result.success) {
        setOutput(result.formatted)
        const xmlStats = getXMLStats(input)
        setStats(xmlStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Formatting failed: ${err.message}`)
    }
  }

  const handleValidate = () => {
    setError('')
    setOutput('')
    setStats(null)

    try {
      if (!input.trim()) {
        setError('Please paste XML to validate')
        return
      }

      const result = formatXML(input)

      if (result.success) {
        setError('')
        setOutput('✅ Valid XML')
        const xmlStats = getXMLStats(input)
        setStats(xmlStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Validation failed: ${err.message}`)
    }
  }

  const handleMinify = () => {
    setError('')
    setOutput('')
    setStats(null)

    try {
      if (!input.trim()) {
        setError('Please paste XML to minify')
        return
      }

      const result = minifyXML(input)

      if (result.success) {
        setOutput(result.minified)
        const xmlStats = getXMLStats(input)
        setStats(xmlStats)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Minification failed: ${err.message}`)
    }
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy. Please format XML first.')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Copied to clipboard!')
  }

  const handleDownload = () => {
    if (!output) {
      setError('Nothing to download. Please format XML first.')
      return
    }
    const element = document.createElement('a')
    const file = new Blob([output], { type: 'application/xml' })
    element.href = URL.createObjectURL(file)
    element.download = 'formatted.xml'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setStats(null)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setError('')
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        🔒 All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>📄 Online XML Formatter and Validator</h1>
        <p>Paste raw XML and instantly format it with proper indentation for readability. The formatter also validates your XML structure, identifies errors, and provides helpful error messages. You can also minify XML to reduce file size. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <button onClick={handleFormat} className="action-btn encode-btn">
            📝 Format XML
          </button>
          <button onClick={handleValidate} className="action-btn encode-btn">
            ✓ Validate
          </button>
          <button onClick={handleMinify} className="action-btn encode-btn">
            ⚙️ Minify
          </button>
          <button onClick={handleClear} className="action-btn clear-btn">
            🗑️ Clear
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="tool-row">
          <div className="textarea-group">
            <label>Raw XML Input</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your XML here... (document structure with elements, attributes, etc.)"
              className="textarea"
              rows="10"
            />
            <div className="info-small">💡 Accepts any valid XML format with proper UTF-8 encoding</div>
          </div>

          <div className="textarea-group">
            <label>Formatted Output</label>
            <textarea
              value={output}
              readOnly
              className="textarea output"
              rows="10"
            />
            {output && output !== '✅ Valid XML' && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={handleCopy} className="copy-btn">
                  📋 Copy XML
                </button>
                <button onClick={handleDownload} className="copy-btn">
                  ⬇️ Download
                </button>
              </div>
            )}
          </div>
        </div>

        {stats && (
          <div className="info-box" style={{ backgroundColor: '#f0f0f0', marginTop: '20px' }}>
            <h4>📊 XML Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
              <div>
                <strong>Root Element:</strong> {stats.rootElement}
              </div>
              <div>
                <strong>Total Elements:</strong> {stats.elementCount}
              </div>
              <div>
                <strong>Total Attributes:</strong> {stats.attributeCount}
              </div>
              <div>
                <strong>Max Depth:</strong> {stats.depth}
              </div>
              <div>
                <strong>Original Size:</strong> {stats.originalSize} bytes
              </div>
              <div>
                <strong>Formatted Size:</strong> {stats.formattedSize} bytes
              </div>
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>ℹ️ About XML</h4>
          <p>
            XML (eXtensible Markup Language) is a text-based format designed for storing and transporting data. It emphasizes simplicity, generality, and usability across the internet. XML is widely used for configuration files, data interchange, document markup, and web services.
          </p>
          <p style={{ marginTop: '10px' }}>
            <strong>Key Features:</strong> Self-descriptive, hierarchical structure, human-readable, supports attributes and namespaces
          </p>
        </div>

        <div className="info-box" style={{ backgroundColor: '#f0f0f0', marginTop: '20px' }}>
          <h4>🧪 Test XML Examples</h4>
          
          <div style={{ marginTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
            <strong>Simple Document:</strong>
            <p style={{ fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', backgroundColor: '#fff', padding: '8px', borderRadius: '4px', margin: '5px 0' }}>
              {`<?xml version="1.0"?><root><person><name>John</name><age>30</age></person></root>`}
            </p>
          </div>

          <div style={{ marginTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
            <strong>Document with Attributes:</strong>
            <p style={{ fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', backgroundColor: '#fff', padding: '8px', borderRadius: '4px', margin: '5px 0' }}>
              {`<?xml version="1.0"?><library><book id="1" author="John Doe"><title>Learning XML</title></book></library>`}
            </p>
          </div>

          <div style={{ marginTop: '10px' }}>
            <strong>Complex Document:</strong>
            <p style={{ fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', backgroundColor: '#fff', padding: '8px', borderRadius: '4px', margin: '5px 0' }}>
              {`<?xml version="1.0"?><database><users><user id="1"><name>Alice</name><email>alice@example.com</email></user></users></database>`}
            </p>
          </div>

          <p style={{ fontSize: '12px', marginTop: '10px' }}>
            Copy any example above and paste it to see formatting in action!
          </p>
        </div>
      </div>
    </div>
  )
}
