import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { generatePassword, calculatePasswordStrength, generateMultiplePasswords } from '../utils/passwordGenerator'
import './PasswordGenerator.css'

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
    <div className="tool-page password-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <span className="password-kicker">Password security</span>
        <h1> Secure Password Generator</h1>
        <p>Generate strong, random passwords instantly with customizable options. Includes real-time password strength analysis, bulk generation, and security recommendations. All passwords are generated locally in your browser - no data is sent to any server.</p>
      </div>

      <div className="tool-container">
        <div className="options-grid">
          {/* Settings */}
          <div className="panel">
            <h3 className="panel-title">Settings</h3>

            <div className="form-field">
              <label className="field-label">
                Password Length: <span className="length-value">{length}</span>
              </label>
              <input
                type="range"
                min="4"
                max="128"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="field-range"
              />
            </div>

            <div className="form-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                  className="checkbox-input"
                />
                Uppercase (A-Z)
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                  className="checkbox-input"
                />
                Lowercase (a-z)
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                  className="checkbox-input"
                />
                Numbers (0-9)
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                  className="checkbox-input"
                />
                Symbols (!@#$%...)
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
                  className="checkbox-input"
                />
                Exclude Ambiguous (i, l, 1, L, o, 0, O)
              </label>
            </div>

            <button onClick={handleGenerate} className="action-btn encode-btn btn-full-width">
              Generate Password
            </button>
          </div>

          {/* Bulk Generation */}
          <div className="panel">
            <h3 className="panel-title">Bulk Generate</h3>

            <div className="form-field">
              <label className="field-label">
                Number of Passwords (1-100):
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={bulkCount}
                onChange={(e) => setBulkCount(e.target.value)}
                className="field-input"
              />
            </div>

            <button onClick={handleGenerateBulk} className="action-btn encode-btn btn-full-width">
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
          <div className="password-display">
            <div className="display-header">
              <h3 className="display-title">Generated Password</h3>
              <button onClick={() => handleCopy(password)} className="copy-btn">
                Copy
              </button>
            </div>

            <code className="password-code">
              {password}
            </code>

            {strength && (
              <div>
                <div className="strength-label">
                  <strong>Strength: </strong>
                  <span style={{ color: getStrengthColor(), fontWeight: 'bold' }}>
                    {strength.strength} ({strength.score}/100)
                  </span>
                </div>

                <div className="strength-bar">
                  <div
                    className="strength-bar-fill"
                    style={{ width: `${strength.score}%`, backgroundColor: getStrengthColor() }}
                  />
                </div>

                <div className="strength-details">
                  <strong>Characteristics:</strong>
                  <ul className="strength-list">
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
                      <ul className="strength-list">
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
          <div className="passwords-list-wrapper">
            <div className="list-header">
              <h3 className="list-title">Generated Passwords ({passwords.length})</h3>
              <div className="list-actions">
                <button onClick={handleCopyAll} className="copy-btn">
                  Copy All
                </button>
                <button onClick={handleDownload} className="copy-btn">
                  Download
                </button>
              </div>
            </div>

            <div className="passwords-list">
              {passwords.map((pwd, idx) => (
                <div key={idx} className="password-item">
                  <span className="password-text">{pwd}</span>
                  <button
                    onClick={() => handleCopy(pwd)}
                    className="item-copy-btn"
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

        <div className="info-box info-box--spaced">
          <h4>Password Security Tips</h4>
          <ul className="tips-list">
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
