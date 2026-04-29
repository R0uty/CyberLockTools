import { useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'
import {
  getAllCategories,
  getPayloadsByCategory,
  QUICK_TEST_PAYLOADS,
} from '../utils/pathTraversalGenerator'
import '../styles/pages/PathTraversalGenerator.css'

export default function PathTraversalGenerator() {
  useSEO({
    title: 'Online Path Traversal Generator - Directory Traversal Testing Tool',
    description: 'Free path traversal (directory traversal) payload generator for authorized penetration testing. Generate LFI, encoded bypass, Windows, and Linux traversal payloads. Educational security tool.',
    keywords: 'path traversal generator, directory traversal, LFI, local file inclusion, penetration testing, authorized testing, web security',
  })

  const [selectedCategory, setSelectedCategory] = useState('BASIC')
  const [selectedPayload, setSelectedPayload] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = getAllCategories()
  const payloadsInCategory = getPayloadsByCategory(selectedCategory)

  const filteredPayloads = payloadsInCategory.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopy = (text, index) => {
    copyText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Path Traversal Generator</h1>
        <p>Generate path traversal (directory traversal / LFI) payloads for authorized penetration testing and security research. Supports basic, encoded, filter-bypass, Windows, Linux, and null-byte techniques. All generation happens locally in your browser.</p>
      </div>

      {/* Disclaimer */}
      <div className="tool-container">
        <section className="tool-section">
          <div className="pt-disclaimer">
            <h3 className="pt-disclaimer-title">⚠️ LEGAL & ETHICAL DISCLAIMER</h3>
            <p className="pt-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="pt-disclaimer-text">
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ Path traversal can expose sensitive files and configuration data</li>
              <li>✓ Unauthorized attacks are ILLEGAL and may result in prosecution</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="tool-content">
            <div className="two-column-layout">
              {/* Left column */}
              <div className="column">
                <h2>Payload Library</h2>

                <div className="pt-form-group">
                  <label className="pt-form-label">Attack Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setSelectedPayload(null)
                      setSearchQuery('')
                    }}
                    className="select"
                  >
                    {categories.map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-form-group">
                  <input
                    type="text"
                    placeholder="Search payloads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pt-input-full"
                  />
                </div>

                <div className="pt-payload-list">
                  {filteredPayloads.map((payload, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPayload(payload)}
                      className={`pt-payload-item${selectedPayload === payload ? ' pt-payload-item--selected' : ''}`}
                    >
                      <div className="pt-payload-item__name">{payload.name}</div>
                      <div className="pt-payload-item__desc">{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p className="pt-no-results">No payloads match your search.</p>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="column">
                {selectedPayload ? (
                  <>
                    <h2>{selectedPayload.name}</h2>
                    <div className="pt-form-group">
                      <label className="pt-form-label">Payload</label>
                      <div className="textarea output pt-code-output">
                        {selectedPayload.payload}
                      </div>
                      <button
                        onClick={() => handleCopy(selectedPayload.payload, -1)}
                        className={`pt-copy-btn${copiedIndex === -1 ? ' pt-copy-btn--copied' : ''}`}
                      >
                        {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                      </button>
                    </div>
                    <div className="pt-form-group">
                      <label className="pt-form-label">How It Works</label>
                      <div className="pt-explanation">
                        {selectedPayload.explanation}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="pt-empty-state">
                    <p>Select a category and then choose a payload to view details.</p>
                  </div>
                )}

                {/* Quick test payloads */}
                <div className="pt-quick-section">
                  <h3 className="pt-quick-section-title">Quick Detection Payloads</h3>
                  <p className="pt-quick-section-desc">Common payloads for initial traversal detection:</p>
                  <div className="pt-quick-list">
                    {QUICK_TEST_PAYLOADS.map((payload, idx) => (
                      <div key={idx} className="pt-quick-item">
                        <code className="pt-quick-code">{payload}</code>
                        <button
                          onClick={() => handleCopy(payload, idx)}
                          className={`pt-quick-copy-btn${copiedIndex === idx ? ' pt-quick-copy-btn--copied' : ''}`}
                        >
                          {copiedIndex === idx ? '✓' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info section */}
        <section className="tool-section">
          <div className="info-box">
            <h3>Understanding Path Traversal</h3>
            <p>
              Path traversal (also known as directory traversal or Local File Inclusion/LFI) occurs when an application uses user-controlled input to construct a file path without proper validation. Attackers can use <code>../</code> sequences or absolute paths to read arbitrary files outside the intended directory.
            </p>
            <h4>Common Vulnerable Parameters:</h4>
            <ul className="pt-info-list">
              <li><code>?file=</code>, <code>?page=</code>, <code>?template=</code></li>
              <li><code>?path=</code>, <code>?dir=</code>, <code>?folder=</code></li>
              <li><code>?document=</code>, <code>?include=</code>, <code>?load=</code></li>
              <li>File download endpoints, image loading, and PDF generation parameters</li>
            </ul>
            <h4>High-Value Target Files:</h4>
            <ul className="pt-info-list">
              <li><strong>Linux:</strong> <code>/etc/passwd</code>, <code>/etc/shadow</code>, <code>/proc/self/environ</code>, <code>~/.ssh/id_rsa</code></li>
              <li><strong>Windows:</strong> <code>win.ini</code>, <code>boot.ini</code>, <code>web.config</code>, SAM database</li>
              <li><strong>Web configs:</strong> <code>config.php</code>, <code>.env</code>, <code>database.yml</code>, <code>settings.py</code></li>
              <li><strong>Logs (for log poisoning):</strong> Apache/Nginx access logs, PHP error logs</li>
            </ul>
            <h4>Prevention:</h4>
            <ul className="pt-info-list">
              <li>Use a whitelist of allowed file names or paths</li>
              <li>Resolve the canonical path and verify it starts with the intended base directory</li>
              <li>Avoid passing user input to file system APIs where possible</li>
              <li>Strip or reject <code>../</code>, <code>..\</code>, and URL-encoded variants</li>
              <li>Chroot or use sandboxed file system access</li>
              <li>Apply the principle of least privilege to the web server process</li>
            </ul>
            <h4>Legal & Ethical Requirements:</h4>
            <div className="pt-legal-note">
              <ul className="pt-legal-note-list">
                <li>⚠️ Use ONLY in authorized penetration testing engagements</li>
                <li>✓ Always get explicit written permission before testing</li>
                <li>✓ Test only on systems you own or have authorization for</li>
                <li>✓ Understand and comply with your local laws</li>
                <li>✓ Document all testing activities</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
