import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'

export default function URLEncoder() {
  useSEO({
    title: 'Online URL Encoder and Decoder - Encode URLs',
    description: 'Free online URL encoder and decoder. Convert text to URL-safe format, encode query parameters, and decode percent-encoded strings. Essential web development tool for URI encoding.',
    keywords: 'online url tool, url encoder, url decoder, uri encoder, percent encoding, url converter'
  })
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleEncode = () => {
    setError('')
    try {
      if (!input.trim()) {
        setError('Please enter text to encode')
        setOutput('')
        return
      }
      const encoded = encodeURIComponent(input)
      setOutput(encoded)
    } catch (err) {
      setError(`Encoding failed: ${err.message}`)
      setOutput('')
    }
  }

  const handleDecode = () => {
    setError('')
    try {
      if (!input.trim()) {
        setError('Please enter text to decode')
        setOutput('')
        return
      }

      const decoded = decodeURIComponent(input)
      setOutput(decoded)
    } catch {
      setError('Invalid URL-encoded input. Please check your input and try again.')
      setOutput('')
    }
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy. Please encode or decode first.')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Copied to clipboard!')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>🔗 Online URL Encoder and Decoder Tool</h1>
        <p>Instantly encode text to URL-safe format or decode URL-encoded strings back to readable text. URL encoding (percent encoding) is essential for safe web transmission of special characters in URLs, query parameters, and form data.</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <button onClick={handleEncode} className="action-btn encode-btn">
            Encode
          </button>
          <button onClick={handleDecode} className="action-btn decode-btn">
            🔓 Decode
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
            <label>Input Text</label>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError('')
              }}
              placeholder="Enter text to encode or URL-encoded text to decode..."
              className="textarea"
              rows="10"
            />
          </div>

          <div className="textarea-group">
            <label>Output</label>
            <textarea
              value={output}
              readOnly
              className="textarea output"
              rows="10"
            />
            {output && (
              <button onClick={handleCopy} className="copy-btn">
                Copy to Clipboard
              </button>
            )}
          </div>
        </div>

        <div className="info-box">
          <h4>About URL Encoding</h4>
          <p>
            URL encoding (also called percent encoding) converts special characters into a format that can be safely transmitted over the internet.
            Characters like spaces become %20, and special characters are replaced with %xx where xx is the hexadecimal value.
            This is essential for URLs, query parameters, and form data.
          </p>
        </div>
      </div>
    </div>
  )
}
