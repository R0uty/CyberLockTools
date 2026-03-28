import { useState } from 'react'

export default function Base64() {
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
      const encoded = btoa(input)
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

      const decoded = atob(input)
      setOutput(decoded)
    } catch (err) {
      setError('Invalid Base64 input. Please check your input and try again.')
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
        🔒 All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h2>📝 Base64 Encoder/Decoder</h2>
        <p>Encode text to Base64 or decode Base64 strings back to text</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <button onClick={handleEncode} className="action-btn encode-btn">
            🔐 Encode
          </button>
          <button onClick={handleDecode} className="action-btn decode-btn">
            🔓 Decode
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
            <label>Input Text</label>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError('')
              }}
              placeholder="Enter text to encode or Base64 to decode..."
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
                📋 Copy to Clipboard
              </button>
            )}
          </div>
        </div>

        <div className="info-box">
          <h4>ℹ️ About Base64</h4>
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
            It's commonly used for encoding data for transmission over text-only protocols like email and HTTP.
          </p>
        </div>
      </div>
    </div>
  )
}
