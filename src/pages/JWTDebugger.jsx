import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { decodeJWT, formatJSON } from '../utils/jwtDecoder'

export default function JWTDebugger() {
  useSEO({
    title: 'Online JWT Debugger and Decoder Tool',
    description: 'Free online JWT debugger and decoder. Paste any JSON Web Token and instantly decode the header, payload, and verify the signature. Perfect for debugging JWT tokens locally in your browser.',
    keywords: 'jwt debugger, jwt decoder, jwt validator, online jwt tool, json web token decoder'
  })

  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState(null)
  const [error, setError] = useState('')

  const handleDecode = () => {
    setError('')
    setDecoded(null)

    try {
      if (!input.trim()) {
        setError('Please paste a JWT token to decode')
        return
      }

      const result = decodeJWT(input)
      setDecoded(result)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const handleClear = () => {
    setInput('')
    setDecoded(null)
    setError('')
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setError('')
    setDecoded(null)
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        🔒 All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>🔐 Online JWT Debugger and Decoder</h1>
        <p>Paste a JWT token and instantly see the decoded header, payload, and signature. JWT (JSON Web Token) is a compact, URL-safe way to represent claims to be transferred between two parties. This tool helps you debug and understand JWT tokens without sending them to any server.</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <button onClick={handleDecode} className="action-btn encode-btn">
            🔓 Decode JWT
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
            <label>JWT Token Input</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your JWT token here (format: header.payload.signature)..."
              className="textarea"
              rows="6"
            />
            <div className="info-small">💡 Format: Three Base64-encoded parts separated by dots (.)</div>
          </div>

          {decoded && (
            <>
              <div className="textarea-group">
                <label>Header</label>
                <textarea
                  value={formatJSON(decoded.header)}
                  readOnly
                  className="textarea output"
                  rows="6"
                />
                {decoded.header && (
                  <button onClick={() => handleCopy(formatJSON(decoded.header))} className="copy-btn">
                    📋 Copy Header
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {decoded && (
          <div className="tool-row">
            <div className="textarea-group">
              <label>Payload</label>
              <textarea
                value={formatJSON(decoded.payload)}
                readOnly
                className="textarea output"
                rows="8"
              />
              {decoded.payload && (
                <button onClick={() => handleCopy(formatJSON(decoded.payload))} className="copy-btn">
                  📋 Copy Payload
                </button>
              )}
            </div>

            <div className="textarea-group">
              <label>Signature (Raw)</label>
              <textarea
                value={decoded.signature}
                readOnly
                className="textarea output"
                rows="8"
              />
              {decoded.signature && (
                <button onClick={() => handleCopy(decoded.signature)} className="copy-btn">
                  📋 Copy Signature
                </button>
              )}
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>ℹ️ About JWT Tokens</h4>
          <p>
            A JWT consists of three Base64-encoded parts separated by dots:
          </p>
          <ul style={{ marginTop: '10px', marginBottom: '10px', paddingLeft: '20px' }}>
            <li><strong>Header:</strong> Contains the token type (JWT) and hashing algorithm used</li>
            <li><strong>Payload:</strong> Contains claims (user data, roles, permissions, etc.)</li>
            <li><strong>Signature:</strong> Cryptographic signature to verify token integrity</li>
          </ul>
          <p>
            <strong>Note:</strong> This tool only decodes the token. It does not verify the signature. For security-critical applications, always verify the signature on your backend using your secret key.
          </p>
        </div>

        <div className="info-box" style={{ backgroundColor: '#f0f0f0', marginTop: '20px' }}>
          <h4>🧪 Test Token (Example)</h4>
          <p style={{ fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
          </p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Paste this token above to see how JWT decoding works!
          </p>
        </div>
      </div>
    </div>
  )
}
