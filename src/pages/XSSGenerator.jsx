import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { xssPayloads, testingPayloads, getAllCategories, getPayloadsByCategory } from '../utils/xssGenerator'

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
  const [customPayload, setCustomPayload] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

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
    setPreviewMode(false)
  }

  const handleCopyCommand = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const filteredPayloads = payloadsInCategory.filter(([_, payload]) =>
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
          <div style={{
            backgroundColor: '#2a2a2a',
            border: '2px solid #ff6b6b',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#ff6b6b', marginTop: 0 }}>⚠️ LEGAL & ETHICAL DISCLAIMER</h3>
            <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>
              This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>
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
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8' }}>
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
                <div style={{ marginBottom: '1.5rem' }}>
                  <input
                    type="text"
                    placeholder="Search payloads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Payload List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredPayloads.map(([key, payload]) => (
                    <button
                      key={key}
                      onClick={() => handlePayloadSelect(key, payload)}
                      style={{
                        padding: '1rem',
                        backgroundColor: selectedPayload?.key === key ? '#2a2a2a' : '#1a1a1a',
                        border: selectedPayload?.key === key ? '2px solid #c0c0c0' : '1px solid #3a3a3a',
                        borderRadius: '8px',
                        color: '#e8e8e8',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedPayload?.key !== key) {
                          e.target.style.borderColor = '#808080'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedPayload?.key !== key) {
                          e.target.style.borderColor = '#3a3a3a'
                        }
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{payload.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#a0a0a0' }}>{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p style={{ color: '#808080', textAlign: 'center', padding: '1rem' }}>
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
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8' }}>
                        Available Variants
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {selectedPayload.payloads.map((payload, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleGeneratePayload(payload)}
                            style={{
                              padding: '0.75rem',
                              backgroundColor: '#1a1a1a',
                              border: '1px solid #3a3a3a',
                              borderRadius: '6px',
                              color: '#e8e8e8',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.3s ease',
                              fontSize: '0.9rem'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = '#c0c0c0'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = '#3a3a3a'
                            }}
                          >
                            {payload.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generated Payload */}
                    {generatedPayload && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8' }}>
                          Generated XSS Payload
                        </label>
                        <div
                          className="textarea output"
                          style={{
                            padding: '1rem',
                            backgroundColor: '#0f0f0f',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            color: '#a8d5ba',
                            minHeight: '150px',
                            maxHeight: '350px',
                            overflow: 'auto'
                          }}
                        >
                          {generatedPayload}
                        </div>
                        <button
                          onClick={() => handleCopyCommand(generatedPayload, -1)}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: copiedIndex === -1 ? '#4a7c4e' : '#c0c0c0',
                            border: 'none',
                            borderRadius: '6px',
                            color: copiedIndex === -1 ? '#e8e8e8' : '#0f0f0f',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            width: '100%'
                          }}
                        >
                          {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#808080' }}>
                    <p>Select an attack type and then choose a specific payload variant</p>
                  </div>
                )}

                {/* Quick Testing Payloads */}
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #3a3a3a' }}>
                  <h3 style={{ marginTop: 0, color: '#e8e8e8' }}>Quick Testing Payloads</h3>
                  <p style={{ fontSize: '0.9rem', color: '#d0d0d0' }}>Common payloads for initial vulnerability detection:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {testingPayloads.detection.map((payload, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#0f0f0f',
                          border: '1px solid #3a3a3a',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                      >
                        <code style={{
                          color: '#a8d5ba',
                          fontSize: '0.8rem',
                          overflow: 'auto',
                          flex: 1
                        }}>
                          {payload}
                        </code>
                        <button
                          onClick={() => handleCopyCommand(payload, idx)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            backgroundColor: copiedIndex === idx ? '#4a7c4e' : '#c0c0c0',
                            border: 'none',
                            borderRadius: '4px',
                            color: copiedIndex === idx ? '#e8e8e8' : '#0f0f0f',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                          }}
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
            <ul style={{ color: '#d0d0d0' }}>
              <li><strong>Session Hijacking:</strong> Steal authentication cookies and session tokens</li>
              <li><strong>Credential Theft:</strong> Capture user input through fake login forms</li>
              <li><strong>Malware Distribution:</strong> Inject malicious scripts that download malware</li>
              <li><strong>Website Defacement:</strong> Modify page content visible to users</li>
              <li><strong>Keylogging:</strong> Capture user keystrokes and form data</li>
              <li><strong>Redirect Attacks:</strong> Send users to phishing or malicious sites</li>
            </ul>

            <h4>Types of XSS:</h4>
            <ul style={{ color: '#d0d0d0' }}>
              <li><strong>Stored XSS:</strong> Payload stored in database, affects all users viewing it</li>
              <li><strong>Reflected XSS:</strong> Payload in URL/request, victim must click link</li>
              <li><strong>DOM-based XSS:</strong> Vulnerability in client-side JavaScript code</li>
            </ul>

            <h4>Common Vulnerable Functions:</h4>
            <ul style={{ color: '#d0d0d0' }}>
              <li><code>eval()</code>, <code>innerHTML</code>, <code>document.write()</code></li>
              <li>Unsafe use of <code>jQuery.html()</code>, <code>React.dangerouslySetInnerHTML</code></li>
              <li>Server-side template injection that outputs user input</li>
              <li>URL/redirect functions using user-controlled input</li>
            </ul>

            <h4>Prevention & Mitigation:</h4>
            <ul style={{ color: '#d0d0d0' }}>
              <li>Use Content Security Policy (CSP) headers</li>
              <li>Properly encode/escape all user input based on context (HTML, JS, URL, CSS)</li>
              <li>Use security libraries like DOMPurify for HTML sanitization</li>
              <li>Implement input validation and whitelisting</li>
              <li>Use modern frameworks with built-in XSS protection</li>
              <li>Enable HTTPOnly and Secure flags on cookies</li>
            </ul>

            <h4>Legal & Ethical Requirements:</h4>
            <div style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #ff6b6b', marginTop: '1rem' }}>
              <ul style={{ color: '#d0d0d0', margin: 0 }}>
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
