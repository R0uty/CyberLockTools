import { useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'
import { createJWT, decodeJWT, verifyJWT } from '../utils/jwtEncoder'
import '../styles/pages/JWTEncoder.css'

export default function JWTEncoder() {
  useSEO({
    title: 'Online JWT Encoder and Signer Tool',
    description: 'Free online JWT encoder/signer. Create JWT tokens with custom header and payload, sign with HS256/HS512, and verify signatures. Perfect for testing authentication flows.',
    keywords: 'jwt encoder, jwt signer, jwt creator, jwt token, online jwt tool'
  })

  const [mode, setMode] = useState('encode') // 'encode' or 'verify'
  const [algorithm, setAlgorithm] = useState('HS256')
  const [secret, setSecret] = useState('')
  const [headerInput, setHeaderInput] = useState('{}')
  const [payloadInput, setPayloadInput] = useState('{}')
  const [verifyToken, setVerifyToken] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleEncode = () => {
    setError('')
    setResult(null)

    try {
      if (!secret.trim()) {
        setError('Secret key is required')
        return
      }

      let header, payload
      try {
        header = JSON.parse(headerInput.trim() || '{}')
      } catch {
        setError('Invalid header JSON')
        return
      }

      try {
        payload = JSON.parse(payloadInput.trim() || '{}')
      } catch {
        setError('Invalid payload JSON')
        return
      }

      const res = createJWT(header, payload, secret, algorithm)

      if (res.success) {
        setResult({
          type: 'encode',
          token: res.token,
          header: JSON.stringify(header, null, 2),
          payload: JSON.stringify(payload, null, 2)
        })
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError(`Encoding failed: ${err.message}`)
    }
  }

  const handleVerify = () => {
    setError('')
    setResult(null)

    try {
      if (!verifyToken.trim()) {
        setError('Please paste a JWT token')
        return
      }

      if (!secret.trim()) {
        setError('Secret key is required for verification')
        return
      }

      // First decode
      const decoded = decodeJWT(verifyToken.trim())
      if (!decoded.success) {
        setError(decoded.error)
        return
      }

      // Then verify signature
      const verification = verifyJWT(verifyToken.trim(), secret, algorithm)

      setResult({
        type: 'verify',
        decoded,
        verification
      })
    } catch (err) {
      setError(`Verification failed: ${err.message}`)
    }
  }

  const handleCopy = (text) => {
    copyText(text)
  }

  const handleClear = () => {
    setVerifyToken('')
    setResult(null)
    setError('')
    setSecret('')
  }

  const insertExpiration = () => {
    try {
      const payload = JSON.parse(payloadInput)
      payload.exp = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      setPayloadInput(JSON.stringify(payload, null, 2))
    } catch {
      setError('Invalid payload JSON')
    }
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1> JWT Encoder and Signer</h1>
        <p>Create and verify JWT (JSON Web Tokens) with custom header and payload. Sign tokens with HS256 or HS512 algorithms. Perfect for testing authentication flows and debugging token generation. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div className="mode-selector">
          <label className="mode-label">
            <input
              type="radio"
              value="encode"
              checked={mode === 'encode'}
              onChange={(e) => { setMode(e.target.value); setResult(null); setError('') }}
              className="mode-radio"
            />
            Create Token
          </label>
          <label className="mode-label">
            <input
              type="radio"
              value="verify"
              checked={mode === 'verify'}
              onChange={(e) => { setMode(e.target.value); setResult(null); setError('') }}
              className="mode-radio"
            />
            Verify Token
          </label>
        </div>

        <div className="form-section">
          <label className="field-label">
            Algorithm:
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="algo-select"
          >
            <option value="HS256">HS256 (SHA-256)</option>
            <option value="HS512">HS512 (SHA-512)</option>
          </select>
        </div>

        <div className="form-section">
          <label className="field-label">
            Secret Key:
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter your secret key"
            className="secret-input"
          />
        </div>

        {mode === 'encode' ? (
          <>
            <div className="jwt-input-grid">
              <div>
                <label className="field-label">
                  Header (JSON):
                </label>
                <textarea
                  value={headerInput}
                  onChange={(e) => setHeaderInput(e.target.value)}
                  className="jwt-textarea jwt-textarea--header"
                />
              </div>

              <div>
                <label className="field-label">
                  Payload (JSON):
                </label>
                <textarea
                  value={payloadInput}
                  onChange={(e) => setPayloadInput(e.target.value)}
                  className="jwt-textarea jwt-textarea--payload"
                />
              </div>
            </div>

            <div className="button-group">
              <button onClick={handleEncode} className="action-btn encode-btn">
                ✨ Create Token
              </button>
              <button onClick={insertExpiration} className="action-btn encode-btn">
                ⏱️ Add Expiration
              </button>
              <button onClick={handleClear} className="action-btn clear-btn">
                Clear
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="form-section">
              <label className="field-label">
                Token to Verify:
              </label>
              <textarea
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                placeholder="Paste JWT token here..."
                className="jwt-textarea jwt-textarea--verify"
              />
            </div>

            <div className="button-group">
              <button onClick={handleVerify} className="action-btn encode-btn">
                ✓ Verify Token
              </button>
              <button onClick={handleClear} className="action-btn clear-btn">
                Clear
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="error-message error-message--mt">
            {error}
          </div>
        )}

        {result && (
          <div className="info-box info-box--gray info-box--mt">
            <h4>Result</h4>

            {result.type === 'encode' && (
              <>
                <div className="jwt-token-section">
                  <strong>Generated Token:</strong>
                  <div className="jwt-token-display">
                    {result.token}
                    <button
                      onClick={() => handleCopy(result.token)}
                      className="jwt-copy-btn"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="jwt-result-grid">
                  <div>
                    <strong>Header:</strong>
                    <pre className="jwt-pre jwt-pre--scrollable">
                      {result.header}
                    </pre>
                  </div>
                  <div>
                    <strong>Payload:</strong>
                    <pre className="jwt-pre jwt-pre--scrollable">
                      {result.payload}
                    </pre>
                  </div>
                </div>
              </>
            )}

            {result.type === 'verify' && (
              <>
                <div className={result.verification.valid ? 'verify-status verify-status--valid' : 'verify-status verify-status--error'}>
                  {result.verification.message}
                </div>

                <div className="jwt-verify-section">
                  <strong>Header:</strong>
                  <pre className="jwt-pre">
                    {JSON.stringify(result.decoded.header, null, 2)}
                  </pre>
                </div>

                <div className="jwt-verify-section">
                  <strong>Payload:</strong>
                  <pre className="jwt-pre">
                    {JSON.stringify(result.decoded.payload, null, 2)}
                  </pre>
                </div>

                {result.decoded.expiresAt && (
                  <div className="jwt-expiration-info">
                    <strong>Expires:</strong> {result.decoded.expiresAt}<br/>
                    <strong>Status:</strong> {result.decoded.isExpired ? '❌ Expired' : '✅ Valid'}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="info-box info-box--mt">
          <h4>About JWT</h4>
          <p>
            JWT (JSON Web Token) is a compact, URL-safe means of representing claims between two parties. It consists of three parts: header (type and algorithm), payload (claims), and signature (for verification). Widely used for authentication and authorization.
          </p>
        </div>
      </div>
    </div>
  )
}
