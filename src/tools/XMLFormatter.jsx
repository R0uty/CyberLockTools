import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { showFeedback } from '../utils/feedback'
import { formatXML, getXMLStats, minifyXML } from '../utils/xmlFormatter'
import '../styles/pages/XMLFormatter.css'

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
    showFeedback('Copied to clipboard!')
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
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Online XML Formatter and Validator</h1>
        <p>Paste XML to format, validate, and minify it with clear output and error messages. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <button onClick={handleFormat} className="action-btn encode-btn">
            Format XML
          </button>
          <button onClick={handleValidate} className="action-btn encode-btn">
            Validate
          </button>
          <button onClick={handleMinify} className="action-btn encode-btn">
            Minify
          </button>
          <button onClick={handleClear} className="action-btn clear-btn">
            Clear
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="tool-row">
          <div className="textarea-group">
            <label>XML Input</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Paste XML input here (elements, attributes, and nested nodes)."
              className="textarea"
              rows="10"
            />
            <div className="info-small">Accepts valid XML with UTF-8 encoding.</div>
          </div>

          <div className="textarea-group">
            <label>Output</label>
            <textarea
              value={output}
              readOnly
              className="textarea output"
              rows="10"
            />
            {output && output !== '✅ Valid XML' && (
              <div className="btn-group-row">
                <button onClick={handleCopy} className="copy-btn">
                  Copy XML
                </button>
                <button onClick={handleDownload} className="copy-btn">
                  Download
                </button>
              </div>
            )}
          </div>
        </div>

        {stats && (
          <div className="info-box info-box--alt">
            <h4>XML Statistics</h4>
            <div className="stats-grid">
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
          <h4>About XML</h4>
          <p>
            XML (eXtensible Markup Language) is a text-based format designed for storing and transporting data. It emphasizes simplicity, generality, and usability across the internet. XML is widely used for configuration files, data interchange, document markup, and web services.
          </p>
          <p className="info-note">
            <strong>Key Features:</strong> Self-descriptive, hierarchical structure, human-readable, supports attributes and namespaces
          </p>
        </div>

        <div className="info-box info-box--alt">
          <h4>Test XML Examples</h4>
          
          <div className="example-block">
            <strong>Simple Document:</strong>
            <p className="code-snippet">
              {`<?xml version="1.0"?><root><person><name>John</name><age>30</age></person></root>`}
            </p>
          </div>

          <div className="example-block">
            <strong>Document with Attributes:</strong>
            <p className="code-snippet">
              {`<?xml version="1.0"?><library><book id="1" author="John Doe"><title>Learning XML</title></book></library>`}
            </p>
          </div>

          <div className="example-block--last">
            <strong>Complex Document:</strong>
            <p className="code-snippet">
              {`<?xml version="1.0"?><database><users><user id="1"><name>Alice</name><email>alice@example.com</email></user></users></database>`}
            </p>
          </div>

          <p className="example-note">
            Copy any example and paste it into the input to test formatting.
          </p>
        </div>
      </div>
    </div>
  )
}
