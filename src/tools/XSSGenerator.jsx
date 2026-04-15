import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { testingPayloads, getAllCategories, getPayloadsByCategory } from '../utils/xssGenerator'
import '../styles/pages/XSSGenerator.css'

export default function XSSGenerator() {
  useSEO({
    title: 'Online XSS Payload Generator - Cross-Site Scripting Testing Tool',
    description: 'Free XSS (Cross-Site Scripting) payload generator for authorized penetration testing. Generate reflected, stored, DOM-based, and bypass payloads. Educational tool for security professionals.',
    keywords: 'XSS generator, cross-site scripting, XSS payload, penetration testing, authorized testing, web security'
  })

  const [selectedPayload, setSelectedPayload] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Stored XSS')
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
        <h1>XSS Payload Generator</h1>
        <p>Generate Cross-Site Scripting (XSS) attack payloads for authorized penetration testing and security research. Supports stored, reflected, DOM-based, SVG, and WAF bypass payloads. All payload generation happens locally in your browser.</p>
      </div>

      {/* Disclaimer Box */}
      <div className="tool-container">
        <section className="tool-section">
          <div className="xss-disclaimer">
            <h3 className="xss-disclaimer-title">⚠️ LEGAL & ETHICAL DISCLAIMER</h3>
            <p className="xss-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="xss-disclaimer-text">
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ XSS attacks can steal credentials, distribute malware, and compromise accounts</li>
              <li>✓ Unauthorized XSS attacks are ILLEGAL and may result in prosecution</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="tool-content">
            <div className="two-column-layout">
              <div className="column">
                <h2>XSS Payload Library</h2>

                {/* Category Filter */}
                <div className="xss-form-group">
                  <label className="xss-form-label">
                    Attack Type
                  </label>
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
                <div className="xss-form-group">
                  <input
                    type="text"
                    placeholder="Search payloads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input xss-input-full"
                  />
                </div>

                {/* Payload List */}
                <div className="xss-payload-list">
                  {filteredPayloads.map(([key, payload]) => (
                    <button
                      key={key}
                      onClick={() => handlePayloadSelect(key, payload)}
                      className={`xss-payload-item${selectedPayload?.key === key ? ' xss-payload-item--selected' : ''}`}
                    >
                      <div className="xss-payload-item__name">{payload.name}</div>
                      <div className="xss-payload-item__desc">{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p className="xss-no-results">
                      No payloads match your search
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Payload Generation */}
              <div className="column">
                {selectedPayload ? (
                  <>
                    <h2>{selectedPayload.name}</h2>

                    {/* Available Payloads */}
                    <div className="xss-form-group">
                      <label className="xss-form-label">
                        Available Variants
                      </label>
                      <div className="xss-variant-list">
                        {selectedPayload.payloads.map((payload, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleGeneratePayload(payload)}
                            className="xss-variant-btn"
                          >
                            {payload.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generated Payload */}
                    {generatedPayload && (
                      <div className="xss-form-group">
                        <label className="xss-form-label">
                          Generated XSS Payload
                        </label>
                        <div className="textarea output xss-code-output">
                          {generatedPayload}
                        </div>
                        <button
                          onClick={() => handleCopyCommand(generatedPayload, -1)}
                          className={`xss-copy-btn${copiedIndex === -1 ? ' xss-copy-btn--copied' : ''}`}
                        >
                          {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="xss-empty-state">
                    <p>Select an attack type and then choose a specific payload variant</p>
                  </div>
                )}

                {/* Quick Testing Payloads */}
                <div className="xss-quick-section">
                  <h3 className="xss-quick-section-title">Quick Testing Payloads</h3>
                  <p className="xss-quick-section-desc">Common payloads for initial vulnerability detection:</p>
                  <div className="xss-quick-list">
                    {testingPayloads.detection.map((payload, idx) => (
                      <div key={idx} className="xss-quick-item">
                        <code className="xss-quick-code">
                          {payload}
                        </code>
                        <button
                          onClick={() => handleCopyCommand(payload, idx)}
                          className={`xss-quick-copy-btn${copiedIndex === idx ? ' xss-quick-copy-btn--copied' : ''}`}
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
            <h3>Understanding XSS Attacks</h3>
            <p>
              Cross-Site Scripting (XSS) allows attackers to inject and execute arbitrary JavaScript code in a victim's browser within the context of a vulnerable web application. This can lead to:
            </p>
            <ul className="xss-info-list">
              <li><strong>Session Hijacking:</strong> Steal authentication cookies and session tokens</li>
              <li><strong>Credential Theft:</strong> Capture user input through fake login forms</li>
              <li><strong>Malware Distribution:</strong> Inject malicious scripts that download malware</li>
              <li><strong>Website Defacement:</strong> Modify page content visible to users</li>
              <li><strong>Keylogging:</strong> Capture user keystrokes and form data</li>
              <li><strong>Redirect Attacks:</strong> Send users to phishing or malicious sites</li>
            </ul>

            <h4>Types of XSS:</h4>
            <ul className="xss-info-list">
              <li><strong>Stored XSS:</strong> Payload stored in database, affects all users viewing it</li>
              <li><strong>Reflected XSS:</strong> Payload in URL/request, victim must click link</li>
              <li><strong>DOM-based XSS:</strong> Vulnerability in client-side JavaScript code</li>
            </ul>

            <h4>Common Vulnerable Functions:</h4>
            <ul className="xss-info-list">
              <li><code>eval()</code>, <code>innerHTML</code>, <code>document.write()</code></li>
              <li>Unsafe use of <code>jQuery.html()</code>, <code>React.dangerouslySetInnerHTML</code></li>
              <li>Server-side template injection that outputs user input</li>
              <li>URL/redirect functions using user-controlled input</li>
            </ul>

            <h4>Prevention & Mitigation:</h4>
            <ul className="xss-info-list">
              <li>Use Content Security Policy (CSP) headers</li>
              <li>Properly encode/escape all user input based on context (HTML, JS, URL, CSS)</li>
              <li>Use security libraries like DOMPurify for HTML sanitization</li>
              <li>Implement input validation and whitelisting</li>
              <li>Use modern frameworks with built-in XSS protection</li>
              <li>Enable HTTPOnly and Secure flags on cookies</li>
            </ul>

            <h4>Legal & Ethical Requirements:</h4>
            <div className="xss-legal-note">
              <ul className="xss-legal-note-list">
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
