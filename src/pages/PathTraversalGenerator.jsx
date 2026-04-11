import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { pathTraversalPayloads as _pathTraversalPayloads, quickProbes, getAllCategories, getPayloadsByCategory } from '../utils/pathTraversalGenerator'
import './PathTraversalGenerator.css'

export default function PathTraversalGenerator() {
  useSEO({
    title: 'Online Path Traversal Payload Generator - Directory Traversal Testing Tool',
    description: 'Free path traversal and directory traversal payload generator for authorized penetration testing. Generate Unix, Windows, encoded, and filter bypass payloads. Educational security testing tool.',
    keywords: 'path traversal generator, directory traversal, dot dot slash, LFI payload, penetration testing, file inclusion, authorized testing'
  })

  const [selectedPayload, setSelectedPayload] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Unix Basic')
  const [generatedPayload, setGeneratedPayload] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = getAllCategories()
  const payloadsInCategory = getPayloadsByCategory(selectedCategory)

  const handlePayloadSelect = (key, payload) => {
    setSelectedPayload({ key, ...payload })
    setGeneratedPayload('')
    setCopiedIndex(null)
  }

  const handleGeneratePayload = (payloadObj) => {
    setGeneratedPayload(payloadObj.code)
    setCopiedIndex(null)
  }

  const handleCopyCommand = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const filteredPayloads = payloadsInCategory.filter(([, payload]) =>
    payload.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Path Traversal Generator</h1>
        <p>Generate path traversal and directory traversal payloads for authorized penetration testing. Supports Unix/Linux, Windows, URL-encoded, and filter bypass techniques to test file inclusion vulnerabilities. All generation happens locally in your browser.</p>
      </div>

      {/* Disclaimer Box */}
      <div className="tool-container">
        <section className="tool-section">
          <div className="pt-disclaimer">
            <h3 className="pt-disclaimer-title">⚠️ LEGAL &amp; ETHICAL DISCLAIMER</h3>
            <p className="pt-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING &amp; EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="pt-disclaimer-text">
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ Path traversal can expose passwords, keys, and application source code</li>
              <li>✓ Unauthorized directory traversal attacks are ILLEGAL</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="tool-content">
            <div className="two-column-layout">
              <div className="column">
                <h2>Path Traversal Library</h2>

                <div className="pt-form-group">
                  <label className="pt-form-label">Attack Type</label>
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
                      <option key={cat} value={cat}>{cat}</option>
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
                  {filteredPayloads.map(([key, payload]) => (
                    <button
                      key={key}
                      onClick={() => handlePayloadSelect(key, payload)}
                      className={`pt-payload-item${selectedPayload?.key === key ? ' pt-payload-item--selected' : ''}`}
                    >
                      <div className="pt-payload-item__name">{payload.name}</div>
                      <div className="pt-payload-item__desc">{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p className="pt-no-results">No payloads match your search</p>
                  )}
                </div>
              </div>

              <div className="column">
                {selectedPayload ? (
                  <>
                    <h2>{selectedPayload.name}</h2>

                    <div className="pt-form-group">
                      <label className="pt-form-label">Available Payloads</label>
                      <div className="pt-variant-list">
                        {selectedPayload.payloads.map((payload, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleGeneratePayload(payload)}
                            className="pt-variant-btn"
                          >
                            {payload.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {generatedPayload && (
                      <div className="pt-form-group">
                        <label className="pt-form-label">Generated Payload</label>
                        <div className="textarea output pt-code-output">
                          {generatedPayload}
                        </div>
                        <button
                          onClick={() => handleCopyCommand(generatedPayload, -1)}
                          className={`pt-copy-btn${copiedIndex === -1 ? ' pt-copy-btn--copied' : ''}`}
                        >
                          {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="pt-empty-state">
                    <p>Select an attack type and then choose a specific payload</p>
                  </div>
                )}

                {/* Quick Probes */}
                <div className="pt-quick-section">
                  <h3 className="pt-quick-section-title">Quick Detection Probes</h3>
                  <p className="pt-quick-section-desc">Common payloads for initial path traversal detection:</p>
                  <div className="pt-quick-list">
                    {quickProbes.map((payload, idx) => (
                      <div key={idx} className="pt-quick-item">
                        <code className="pt-quick-code">{payload}</code>
                        <button
                          onClick={() => handleCopyCommand(payload, idx)}
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

        <section className="tool-section">
          <div className="info-box">
            <h3>Understanding Path Traversal</h3>
            <p>
              Path traversal (also known as directory traversal) allows attackers to read files outside the intended web root directory by manipulating file path parameters with <code>../</code> sequences.
            </p>
            <ul className="pt-info-list">
              <li><strong>Unix Targets:</strong> <code>/etc/passwd</code>, <code>/etc/shadow</code>, SSH private keys, application configs</li>
              <li><strong>Windows Targets:</strong> <code>win.ini</code>, SAM file, web.config, IIS metabase</li>
              <li><strong>Encoding Bypass:</strong> URL-encode <code>.</code> as <code>%2e</code> and <code>/</code> as <code>%2f</code> to bypass filters</li>
              <li><strong>Null Byte:</strong> <code>%00</code> terminates strings in some languages (older PHP) to bypass extension checks</li>
              <li><strong>Double Encoding:</strong> <code>%252e%252e%252f</code> bypasses single-decode URL filters</li>
            </ul>

            <h4>Common Vulnerable Parameters:</h4>
            <ul className="pt-info-list">
              <li><code>?file=</code>, <code>?page=</code>, <code>?template=</code>, <code>?path=</code></li>
              <li>Image/document download handlers: <code>?download=</code>, <code>?img=</code></li>
              <li>Log viewing, configuration file loading</li>
              <li>Server-side includes (SSI) with user-controlled filenames</li>
            </ul>

            <h4>Prevention &amp; Mitigation:</h4>
            <ul className="pt-info-list">
              <li>Validate and canonicalize file paths before use (use <code>realpath()</code>)</li>
              <li>Implement an allowlist of permitted filenames or directories</li>
              <li>Chroot jail or containerize web applications</li>
              <li>Never concatenate user input directly into file paths</li>
              <li>Apply web server permissions to restrict readable files</li>
            </ul>

            <h4>Legal &amp; Ethical Requirements:</h4>
            <div className="pt-legal-note">
              <ul className="pt-legal-note-list">
                <li>⚠️ Use ONLY in authorized penetration testing engagements</li>
                <li>✓ Always get explicit written permission before testing</li>
                <li>✓ Test only on systems you own or have authorization for</li>
                <li>✓ Understand and comply with your local laws</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
