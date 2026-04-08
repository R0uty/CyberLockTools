import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { createJWT, decodeJWT, verifyJWT } from '../utils/jwtEncoder'

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
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
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
        🔒 All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>🔑 JWT Encoder and Signer</h1>
        <p>Create and verify JWT (JSON Web Tokens) with custom header and payload. Sign tokens with HS256 or HS512 algorithms. Perfect for testing authentication flows and debugging token generation. All processing happens locally in your browser with no data transmission to any server.</p>
      </div>

      <div className="tool-container">
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}>
          <label style={{ marginRight: '2rem', fontSize: '14px' }}>
            <input
              type="radio"
              value="encode"
              checked={mode === 'encode'}
              onChange={(e) => { setMode(e.target.value); setResult(null); setError('') }}
              style={{ marginRight: '0.5rem' }}
            />
            Create Token
          </label>
          <label style={{ fontSize: '14px' }}>
            <input
              type="radio"
              value="verify"
              checked={mode === 'verify'}
              onChange={(e) => { setMode(e.target.value); setResult(null); setError('') }}
              style={{ marginRight: '0.5rem' }}
            />
            Verify Token
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Algorithm:
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="HS256">HS256 (SHA-256)</option>
            <option value="HS512">HS512 (SHA-512)</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Secret Key:
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter your secret key"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {mode === 'encode' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Header (JSON):
                </label>
                <textarea
                  value={headerInput}
                  onChange={(e) => setHeaderInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    minHeight: '120px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Payload (JSON):
                </label>
                <textarea
                  value={payloadInput}
                  onChange={(e) => setPayloadInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    minHeight: '120px',
                    boxSizing: 'border-box'
                  }}
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
                🗑️ Clear
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Token to Verify:
              </label>
              <textarea
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                placeholder="Paste JWT token here..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  minHeight: '100px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div className="button-group">
              <button onClick={handleVerify} className="action-btn encode-btn">
                ✓ Verify Token
              </button>
              <button onClick={handleClear} className="action-btn clear-btn">
                🗑️ Clear
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="error-message" style={{ marginTop: '1.5rem' }}>
            ⚠️ {error}
          </div>
        )}

        {result && (
          <div className="info-box" style={{ backgroundColor: '#f0f0f0', marginTop: '1.5rem' }}>
            <h4>📊 Result</h4>

            {result.type === 'encode' && (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <strong>Generated Token:</strong>
                  <div style={{
                    backgroundColor: '#fff',
                    padding: '1rem',
                    borderRadius: '5px',
                    marginTop: '0.5rem',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    wordBreak: 'break-all',
                    border: '1px solid #ddd'
                  }}>
                    {result.token}
                    <button
                      onClick={() => handleCopy(result.token)}
                      style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <strong>Header:</strong>
                    <pre style={{
                      backgroundColor: '#fff',
                      padding: '0.75rem',
                      borderRadius: '5px',
                      fontSize: '11px',
                      border: '1px solid #ddd',
                      maxHeight: '150px',
                      overflowY: 'auto'
                    }}>
                      {result.header}
                    </pre>
                  </div>
                  <div>
                    <strong>Payload:</strong>
                    <pre style={{
                      backgroundColor: '#fff',
                      padding: '0.75rem',
                      borderRadius: '5px',
                      fontSize: '11px',
                      border: '1px solid #ddd',
                      maxHeight: '150px',
                      overflowY: 'auto'
                    }}>
                      {result.payload}
                    </pre>
                  </div>
                </div>
              </>
            )}

            {result.type === 'verify' && (
              <>
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: result.verification.valid ? '#d4edda' : '#f8d7da', borderRadius: '5px', border: `1px solid ${result.verification.valid ? '#c3e6cb' : '#f5c6cb'}`, color: result.verification.valid ? '#155724' : '#721c24' }}>
                  {result.verification.message}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Header:</strong>
                  <pre style={{
                    backgroundColor: '#fff',
                    padding: '0.75rem',
                    borderRadius: '5px',
                    fontSize: '11px',
                    border: '1px solid #ddd'
                  }}>
                    {JSON.stringify(result.decoded.header, null, 2)}
                  </pre>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Payload:</strong>
                  <pre style={{
                    backgroundColor: '#fff',
                    padding: '0.75rem',
                    borderRadius: '5px',
                    fontSize: '11px',
                    border: '1px solid #ddd'
                  }}>
                    {JSON.stringify(result.decoded.payload, null, 2)}
                  </pre>
                </div>

                {result.decoded.expiresAt && (
                  <div style={{ fontSize: '13px' }}>
                    <strong>Expires:</strong> {result.decoded.expiresAt}<br/>
                    <strong>Status:</strong> {result.decoded.isExpired ? '❌ Expired' : '✅ Valid'}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="info-box" style={{ marginTop: '1.5rem' }}>
          <h4>ℹ️ About JWT</h4>
          <p>
            JWT (JSON Web Token) is a compact, URL-safe means of representing claims between two parties. It consists of three parts: header (type and algorithm), payload (claims), and signature (for verification). Widely used for authentication and authorization.
          </p>
        </div>
      </div>
    </div>
  )
}
