import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { ssrfPayloads as _ssrfPayloads, quickProbes, getAllCategories, getPayloadsByCategory } from '../utils/ssrfGenerator'
import './SSRFGenerator.css'

export default function SSRFGenerator() {
  useSEO({
    title: 'Online SSRF Payload Generator - Server-Side Request Forgery Testing Tool',
    description: 'Free SSRF payload generator for authorized penetration testing. Generate cloud metadata, internal service, and file read payloads. Educational tool for security professionals and bug bounty hunters.',
    keywords: 'SSRF generator, server-side request forgery, SSRF payload, penetration testing, cloud metadata, AWS IMDSv2, security tool'
  })

  const [selectedPayload, setSelectedPayload] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Cloud Metadata')
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
        <h1>SSRF Payload Generator</h1>
        <p>Generate Server-Side Request Forgery (SSRF) payloads for authorized penetration testing and security research. Supports cloud metadata endpoints, internal services, file read, and filter bypass techniques. All generation happens locally in your browser.</p>
      </div>

      {/* Disclaimer Box */}
      <div className="tool-container">
        <section className="tool-section">
          <div className="ssrf-disclaimer">
            <h3 className="ssrf-disclaimer-title">⚠️ LEGAL &amp; ETHICAL DISCLAIMER</h3>
            <p className="ssrf-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING &amp; EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="ssrf-disclaimer-text">
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ SSRF can expose cloud credentials, internal services, and sensitive files</li>
              <li>✓ Unauthorized SSRF attacks are ILLEGAL and may result in prosecution</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="tool-content">
            <div className="two-column-layout">
              <div className="column">
                <h2>SSRF Payload Library</h2>

                {/* Category Filter */}
                <div className="ssrf-form-group">
                  <label className="ssrf-form-label">Attack Type</label>
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

                {/* Search */}
                <div className="ssrf-form-group">
                  <input
                    type="text"
                    placeholder="Search payloads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input ssrf-input-full"
                  />
                </div>

                {/* Payload List */}
                <div className="ssrf-payload-list">
                  {filteredPayloads.map(([key, payload]) => (
                    <button
                      key={key}
                      onClick={() => handlePayloadSelect(key, payload)}
                      className={`ssrf-payload-item${selectedPayload?.key === key ? ' ssrf-payload-item--selected' : ''}`}
                    >
                      <div className="ssrf-payload-item__name">{payload.name}</div>
                      <div className="ssrf-payload-item__desc">{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p className="ssrf-no-results">No payloads match your search</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="column">
                {selectedPayload ? (
                  <>
                    <h2>{selectedPayload.name}</h2>

                    <div className="ssrf-form-group">
                      <label className="ssrf-form-label">Available Payloads</label>
                      <div className="ssrf-variant-list">
                        {selectedPayload.payloads.map((payload, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleGeneratePayload(payload)}
                            className="ssrf-variant-btn"
                          >
                            {payload.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {generatedPayload && (
                      <div className="ssrf-form-group">
                        <label className="ssrf-form-label">Generated SSRF Payload</label>
                        <div className="textarea output ssrf-code-output">
                          {generatedPayload}
                        </div>
                        <button
                          onClick={() => handleCopyCommand(generatedPayload, -1)}
                          className={`ssrf-copy-btn${copiedIndex === -1 ? ' ssrf-copy-btn--copied' : ''}`}
                        >
                          {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="ssrf-empty-state">
                    <p>Select an attack type and then choose a specific payload</p>
                  </div>
                )}

                {/* Quick Probes */}
                <div className="ssrf-quick-section">
                  <h3 className="ssrf-quick-section-title">Quick Detection Probes</h3>
                  <p className="ssrf-quick-section-desc">Common payloads for initial SSRF detection:</p>
                  <div className="ssrf-quick-list">
                    {quickProbes.map((payload, idx) => (
                      <div key={idx} className="ssrf-quick-item">
                        <code className="ssrf-quick-code">{payload}</code>
                        <button
                          onClick={() => handleCopyCommand(payload, idx)}
                          className={`ssrf-quick-copy-btn${copiedIndex === idx ? ' ssrf-quick-copy-btn--copied' : ''}`}
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

        {/* Info Section */}
        <section className="tool-section">
          <div className="info-box">
            <h3>Understanding SSRF Attacks</h3>
            <p>
              Server-Side Request Forgery (SSRF) forces a server to make HTTP requests to an attacker-controlled target. This allows attackers to bypass firewalls, access internal services, and interact with cloud metadata APIs.
            </p>
            <ul className="ssrf-info-list">
              <li><strong>Cloud Metadata:</strong> Access AWS/GCP/Azure instance metadata to steal IAM credentials</li>
              <li><strong>Internal Services:</strong> Reach Redis, Elasticsearch, and other services not exposed publicly</li>
              <li><strong>File Read:</strong> Use file:// scheme to read arbitrary files from the server</li>
              <li><strong>Port Scanning:</strong> Enumerate internal network services and open ports</li>
              <li><strong>OOB Detection:</strong> Use DNS callbacks and Burp Collaborator to detect blind SSRF</li>
            </ul>

            <h4>Common Vulnerable Functions:</h4>
            <ul className="ssrf-info-list">
              <li>URL fetch functions: <code>file_get_contents()</code>, <code>curl</code>, <code>urllib</code></li>
              <li>Image/document import, PDF generators, webhooks</li>
              <li>XML parsers with external entity support (also XXE)</li>
              <li>Any server-side HTTP client that takes user-supplied URLs</li>
            </ul>

            <h4>Prevention &amp; Mitigation:</h4>
            <ul className="ssrf-info-list">
              <li>Allowlist permitted domains/IPs for outbound requests</li>
              <li>Block access to 169.254.169.254, 10.x.x.x, 172.16-31.x.x, 192.168.x.x</li>
              <li>Use IMDSv2 on AWS (requires token, prevents simple SSRF)</li>
              <li>Disable unused URL schemes (file://, dict://, gopher://)</li>
              <li>Validate and sanitize all user-supplied URLs</li>
            </ul>

            <h4>Legal &amp; Ethical Requirements:</h4>
            <div className="ssrf-legal-note">
              <ul className="ssrf-legal-note-list">
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
