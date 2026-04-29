import { useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'
import {
  getAllCategories,
  getPayloadsByCategory,
  QUICK_TEST_PAYLOADS,
  LDAP_FILTER_SYNTAX,
} from '../utils/ldapInjectionGenerator'
import '../styles/pages/LDAPInjectionGenerator.css'

export default function LDAPInjectionGenerator() {
  useSEO({
    title: 'Online LDAP Injection Generator - LDAP Attack Payload Tool',
    description: 'Free LDAP injection payload generator for authorized penetration testing. Generate authentication bypass, information disclosure, blind injection, and filter injection payloads. Educational security tool.',
    keywords: 'LDAP injection generator, LDAP attack, authentication bypass, penetration testing, authorized testing, directory service security',
  })

  const [selectedCategory, setSelectedCategory] = useState('AUTHENTICATION_BYPASS')
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
        <h1>LDAP Injection Generator</h1>
        <p>Generate LDAP injection payloads for authorized penetration testing and security research. Supports authentication bypass, information disclosure, blind injection, and search filter manipulation. All generation happens locally in your browser.</p>
      </div>

      {/* Disclaimer */}
      <div className="tool-container">
        <section className="tool-section">
          <div className="ldap-disclaimer">
            <h3 className="ldap-disclaimer-title">⚠️ LEGAL & ETHICAL DISCLAIMER</h3>
            <p className="ldap-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="ldap-disclaimer-text">
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ LDAP injection can expose user credentials and directory data</li>
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

                <div className="ldap-form-group">
                  <label className="ldap-form-label">Attack Category</label>
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

                <div className="ldap-form-group">
                  <input
                    type="text"
                    placeholder="Search payloads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input ldap-input-full"
                  />
                </div>

                <div className="ldap-payload-list">
                  {filteredPayloads.map((payload, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPayload(payload)}
                      className={`ldap-payload-item${selectedPayload === payload ? ' ldap-payload-item--selected' : ''}`}
                    >
                      <div className="ldap-payload-item__name">{payload.name}</div>
                      <div className="ldap-payload-item__desc">{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p className="ldap-no-results">No payloads match your search.</p>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="column">
                {selectedPayload ? (
                  <>
                    <h2>{selectedPayload.name}</h2>
                    <div className="ldap-form-group">
                      <label className="ldap-form-label">Payload</label>
                      <div className="textarea output ldap-code-output">
                        {selectedPayload.payload}
                      </div>
                      <button
                        onClick={() => handleCopy(selectedPayload.payload, -1)}
                        className={`ldap-copy-btn${copiedIndex === -1 ? ' ldap-copy-btn--copied' : ''}`}
                      >
                        {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                      </button>
                    </div>
                    <div className="ldap-form-group">
                      <label className="ldap-form-label">How It Works</label>
                      <div className="ldap-explanation">
                        {selectedPayload.explanation}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="ldap-empty-state">
                    <p>Select a category and then choose a payload to view details.</p>
                  </div>
                )}

                {/* Quick test payloads */}
                <div className="ldap-quick-section">
                  <h3 className="ldap-quick-section-title">Quick Detection Payloads</h3>
                  <p className="ldap-quick-section-desc">Common payloads for initial LDAP injection detection:</p>
                  <div className="ldap-quick-list">
                    {QUICK_TEST_PAYLOADS.map((payload, idx) => (
                      <div key={idx} className="ldap-quick-item">
                        <code className="ldap-quick-code">{payload}</code>
                        <button
                          onClick={() => handleCopy(payload, idx)}
                          className={`ldap-quick-copy-btn${copiedIndex === idx ? ' ldap-quick-copy-btn--copied' : ''}`}
                        >
                          {copiedIndex === idx ? '✓' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LDAP filter syntax reference */}
                <div className="ldap-syntax-section">
                  <h3 className="ldap-syntax-title">LDAP Filter Syntax Reference</h3>
                  <div className="ldap-syntax-grid">
                    {Object.entries(LDAP_FILTER_SYNTAX).map(([key, syntax]) => (
                      <div key={key} className="ldap-syntax-item">
                        <span className="ldap-syntax-key">{key}:</span>
                        <code className="ldap-syntax-value">{syntax}</code>
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
            <h3>Understanding LDAP Injection</h3>
            <p>
              LDAP (Lightweight Directory Access Protocol) injection occurs when user-supplied input is incorporated into LDAP queries without proper sanitization. Attackers can manipulate these queries to bypass authentication, enumerate directory contents, or modify directory data.
            </p>
            <h4>Common LDAP Injection Scenarios:</h4>
            <ul className="ldap-info-list">
              <li><strong>Authentication Bypass:</strong> Manipulate login filters to authenticate without valid credentials</li>
              <li><strong>User Enumeration:</strong> Extract all user accounts and attributes from the directory</li>
              <li><strong>Group Membership Disclosure:</strong> Discover which users belong to privileged groups</li>
              <li><strong>Password Attribute Extraction:</strong> Retrieve password hashes if stored in LDAP</li>
              <li><strong>Blind LDAP Injection:</strong> Infer data character-by-character through boolean responses</li>
            </ul>
            <h4>LDAP Special Characters:</h4>
            <ul className="ldap-info-list">
              <li><code>*</code> — Wildcard matching any value</li>
              <li><code>(</code> and <code>)</code> — Filter grouping delimiters</li>
              <li><code>&</code> — AND operator</li>
              <li><code>|</code> — OR operator</li>
              <li><code>!</code> — NOT operator</li>
              <li><code>\</code> — Escape character (e.g., <code>\2a</code> = *)</li>
              <li><code>\00</code> — Null byte</li>
            </ul>
            <h4>Prevention:</h4>
            <ul className="ldap-info-list">
              <li>Escape all LDAP special characters in user input</li>
              <li>Use parameterized LDAP APIs where available</li>
              <li>Implement strict input validation and allowlisting</li>
              <li>Use least-privilege LDAP service accounts</li>
              <li>Enable LDAP query logging and monitoring</li>
              <li>Consider using a WAF with LDAP injection rules</li>
            </ul>
            <h4>Legal & Ethical Requirements:</h4>
            <div className="ldap-legal-note">
              <ul className="ldap-legal-note-list">
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
