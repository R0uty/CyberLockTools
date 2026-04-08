import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { generatePassword, calculatePasswordStrength, generateMultiplePasswords } from '../utils/passwordGenerator'

export default function PasswordGenerator() {
  useSEO({
    title: 'Online Secure Password Generator Tool',
    description: 'Free online password generator. Create strong, secure passwords with customizable options. Includes password strength meter and security analysis. Generate locally - no data sent to servers.',
    keywords: 'password generator, secure password, random password, password strength, online password tool'
  })

  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(null)
  const [length, setLength] = useState('16')
  const [options, setOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false
  })
  const [passwords, setPasswords] = useState([])
  const [bulkCount, setBulkCount] = useState('5')
  const [error, setError] = useState('')

  const handleGenerate = () => {
    setError('')

    try {
      const len = parseInt(length, 10)
      if (isNaN(len) || len < 4 || len > 128) {
        setError('Length must be between 4 and 128')
        return
      }

      const pwd = generatePassword({ length: len, ...options })
      setPassword(pwd)
      const str = calculatePasswordStrength(pwd)
      setStrength(str)
      setPasswords([])
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGenerateBulk = () => {
    setError('')

    try {
      const len = parseInt(length, 10)
      const count = parseInt(bulkCount, 10)

      if (isNaN(len) || len < 4 || len > 128) {
        setError('Length must be between 4 and 128')
        return
      }

      if (isNaN(count) || count < 1 || count > 100) {
        setError('Count must be between 1 and 100')
        return
      }

      const pwds = generateMultiplePasswords(count, { length: len, ...options })
      setPasswords(pwds)
      setPassword('')
      setStrength(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const handleCopyAll = () => {
    if (passwords.length === 0) {
      setError('No passwords to copy')
      return
    }
    navigator.clipboard.writeText(passwords.join('\n'))
    alert('Copied all passwords!')
  }

  const handleDownload = () => {
    if (passwords.length === 0 && !password) {
      setError('No passwords to download')
      return
    }

    const content = passwords.length > 0 ? passwords.join('\n') : password
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'passwords.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleClear = () => {
    setPassword('')
    setPasswords([])
    setStrength(null)
    setError('')
  }

  const getStrengthColor = () => {
    if (!strength) return '#ddd'
    const score = strength.score
    if (score >= 80) return '#28a745'
    if (score >= 60) return '#17a2b8'
    if (score >= 40) return '#ffc107'
    return '#dc3545'
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1> Secure Password Generator</h1>
        <p>Generate strong, random passwords instantly with customizable options. Includes real-time password strength analysis, bulk generation, and security recommendations. All passwords are generated locally in your browser - no data is sent to any server.</p>
      </div>

      <div className="tool-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Settings */}
          <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <h3 style={{ marginTop: 0 }}>⚙️ Settings</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '14px' }}>
                Password Length: <span style={{ color: '#667eea', fontWeight: 'bold' }}>{length}</span>
              </label>
              <input
                type="range"
                min="4"
                max="128"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                  style={{ marginRight: '0.5rem' }}
                />
                Uppercase (A-Z)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                  style={{ marginRight: '0.5rem' }}
                />
                Lowercase (a-z)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                  style={{ marginRight: '0.5rem' }}
                />
                Numbers (0-9)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                  style={{ marginRight: '0.5rem' }}
                />
                Symbols (!@#$%...)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
                  style={{ marginRight: '0.5rem' }}
                />
                Exclude Ambiguous (i, l, 1, L, o, 0, O)
              </label>
            </div>

            <button onClick={handleGenerate} className="action-btn encode-btn" style={{ width: '100%' }}>
              ✨ Generate Password
            </button>
          </div>

          {/* Bulk Generation */}
          <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <h3 style={{ marginTop: 0 }}>Bulk Generate</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '14px' }}>
                Number of Passwords (1-100):
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={bulkCount}
                onChange={(e) => setBulkCount(e.target.value)}
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

            <button onClick={handleGenerateBulk} className="action-btn encode-btn" style={{ width: '100%' }}>
              Generate Multiple
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {password && (
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Generated Password</h3>
              <button onClick={() => handleCopy(password)} className="copy-btn">
                Copy
              </button>
            </div>

            <code style={{
              display: 'block',
              backgroundColor: '#fff',
              padding: '1rem',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              wordBreak: 'break-all',
              marginBottom: '1rem',
              border: '1px solid #ddd'
            }}>
              {password}
            </code>

            {strength && (
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Strength: </strong>
                  <span style={{ color: getStrengthColor(), fontWeight: 'bold' }}>
                    {strength.strength} ({strength.score}/100)
                  </span>
                </div>

                <div style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: `${strength.score}%`,
                    height: '100%',
                    backgroundColor: getStrengthColor(),
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <div style={{ fontSize: '12px' }}>
                  <strong>Characteristics:</strong>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    <li>{strength.length} characters</li>
                    <li>{strength.uniqueChars} unique characters</li>
                    {strength.hasUppercase && <li>✓ Has uppercase</li>}
                    {strength.hasLowercase && <li>✓ Has lowercase</li>}
                    {strength.hasNumbers && <li>✓ Has numbers</li>}
                    {strength.hasSymbols && <li>✓ Has symbols</li>}
                  </ul>
                  {strength.feedback.length > 0 && (
                    <>
                      <strong>Feedback:</strong>
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                        {strength.feedback.map((fb, idx) => <li key={idx}>{fb}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {passwords.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Generated Passwords ({passwords.length})</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleCopyAll} className="copy-btn">
                  Copy All
                </button>
                <button onClick={handleDownload} className="copy-btn">
                  ⬇️ Download
                </button>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              padding: '1rem',
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #e0e0e0'
            }}>
              {passwords.map((pwd, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#fff',
                  borderRadius: '5px',
                  marginBottom: '0.5rem',
                  border: '1px solid #e0e0e0',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>
                  <span style={{ flex: 1, wordBreak: 'break-all' }}>{pwd}</span>
                  <button
                    onClick={() => handleCopy(pwd)}
                    style={{
                      marginLeft: '10px',
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="button-group">
          <button onClick={handleClear} className="action-btn clear-btn">
            Clear All
          </button>
        </div>

        <div className="info-box" style={{ marginTop: '2rem' }}>
          <h4>Password Security Tips</h4>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>Use at least 12-16 characters for maximum security</li>
            <li>Include mix of uppercase, lowercase, numbers, and symbols</li>
            <li>Avoid dictionary words or predictable patterns</li>
            <li>Use unique passwords for each account</li>
            <li>Store passwords securely using a password manager</li>
            <li>Never share passwords over email or insecure channels</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
