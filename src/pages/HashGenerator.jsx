import { useState } from 'react'
import CryptoJS from 'crypto-js'
import { useSEO } from '../hooks/useSEO'

export default function HashGenerator() {
  useSEO({
    title: 'Online Hash Generator Tool - Generate Hashes',
    description: 'Free online hash generator for MD5, SHA-1, SHA-256, SHA-384, and SHA-512. Generate cryptographic hashes instantly from any text or string. Educational cryptography tool.',
    keywords: 'online hash tool, hash generator, sha256 generator, md5 hash, sha512, cryptographic hash, text hash'
  })
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA-256')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const algorithms = [
    { value: 'MD5', label: 'MD5 ⚠️ (Cryptographically broken)' },
    { value: 'SHA-1', label: 'SHA-1 ⚠️ (Deprecated)' },
    { value: 'SHA-256', label: 'SHA-256 (Recommended)' },
    { value: 'SHA-384', label: 'SHA-384' },
    { value: 'SHA-512', label: 'SHA-512' }
  ]

  const handleGenerateHash = () => {
    setError('')
    try {
      if (!input.trim()) {
        setError('Please enter text to hash')
        setOutput('')
        return
      }

      let hash = ''

      switch (algorithm) {
        case 'MD5':
          hash = CryptoJS.MD5(input).toString()
          break
        case 'SHA-1':
          hash = CryptoJS.SHA1(input).toString()
          break
        case 'SHA-256':
          hash = CryptoJS.SHA256(input).toString()
          break
        case 'SHA-384':
          hash = CryptoJS.SHA384(input).toString()
          break
        case 'SHA-512':
          hash = CryptoJS.SHA512(input).toString()
          break
        default:
          hash = CryptoJS.SHA256(input).toString()
      }

      setOutput(hash)
    } catch (err) {
      setError(`Hashing failed: ${err.message}`)
      setOutput('')
    }
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy. Please generate a hash first.')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Hash copied to clipboard!')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const showWarning = algorithm === 'MD5' || algorithm === 'SHA-1'

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        🔒 All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>#️⃣ Online Hash Generator Tool</h1>
        <p>Generate cryptographic hashes instantly using multiple algorithms including SHA-256, SHA-512, and more. Perfect for developers, security professionals, and students learning about cryptography and data integrity verification.</p>
      </div>

      <div className="tool-container">
        <div className="button-group">
          <select
            value={algorithm}
            onChange={(e) => {
              setAlgorithm(e.target.value)
              setOutput('')
              setError('')
            }}
            className="algorithm-select"
          >
            {algorithms.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
          <button onClick={handleGenerateHash} className="action-btn encode-btn">
            🔐 Generate Hash
          </button>
          <button onClick={handleClear} className="action-btn clear-btn">
            🗑️ Clear
          </button>
        </div>

        {showWarning && (
          <div className="warning-box">
            ⚠️ <strong>Security Warning:</strong> MD5 and SHA-1 are cryptographically broken and should not be used for password storage or any security-sensitive applications. This tool is for educational purposes only.
          </div>
        )}

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
              placeholder="Enter text to hash..."
              className="textarea"
              rows="10"
            />
          </div>

          <div className="textarea-group">
            <label>Output Hash ({algorithm})</label>
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
          <h4>ℹ️ About Hashing</h4>
          <p>
            Hash functions produce a fixed-size string of bytes from any input. The same input always produces the same hash, but it's computationally infeasible to reverse.
          </p>
          <ul>
            <li><strong>MD5:</strong> 128-bit hash. Broken, not recommended for any security use.</li>
            <li><strong>SHA-1:</strong> 160-bit hash. Deprecated due to collision vulnerabilities.</li>
            <li><strong>SHA-256:</strong> 256-bit hash. Widely used and considered secure.</li>
            <li><strong>SHA-384:</strong> 384-bit hash. Part of SHA-2 family.</li>
            <li><strong>SHA-512:</strong> 512-bit hash. Strongest in this tool, but slower.</li>
          </ul>
          <p><strong>Never use hashing alone for passwords</strong> — use bcrypt, scrypt, or Argon2 instead.</p>
        </div>
      </div>
    </div>
  )
}
