import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { commandInjectionPayloads as _commandInjectionPayloads, quickProbes, getAllCategories, getPayloadsByCategory } from '../utils/commandInjectionGenerator'
import './CommandInjectionGenerator.css'

export default function CommandInjectionGenerator() {
  useSEO({
    title: 'Online Command Injection Payload Generator - OS Command Testing Tool',
    description: 'Free command injection payload generator for authorized penetration testing. Generate Unix, Windows, filter bypass, and OOB exfiltration command injection payloads. Educational security testing tool.',
    keywords: 'command injection generator, OS command injection, RCE payload, penetration testing, command injection bypass, authorized testing'
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
        <h1>Command Injection Generator</h1>
        <p>Generate OS command injection payloads for authorized penetration testing and security research. Supports Unix/Linux, Windows, filter bypass, and out-of-band exfiltration techniques. All generation happens locally in your browser.</p>
      </div>

      {/* Disclaimer Box */}
      <div className="tool-container">
        <section className="tool-section">
          <div className="cmdi-disclaimer">
            <h3 className="cmdi-disclaimer-title">⚠️ LEGAL &amp; ETHICAL DISCLAIMER</h3>
            <p className="cmdi-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING &amp; EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="cmdi-disclaimer-text">
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ Command injection can lead to full server compromise and data destruction</li>
              <li>✓ Unauthorized command injection attacks are ILLEGAL</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="tool-content">
            <div className="two-column-layout">
              <div className="column">
                <h2>Command Injection Library</h2>

                <div className="cmdi-form-group">
                  <label className="cmdi-form-label">Injection Type</label>
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

                <div className="cmdi-form-group">
                  <input
                    type="text"
                    placeholder="Search payloads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input cmdi-input-full"
                  />
                </div>

                <div className="cmdi-payload-list">
                  {filteredPayloads.map(([key, payload]) => (
                    <button
                      key={key}
                      onClick={() => handlePayloadSelect(key, payload)}
                      className={`cmdi-payload-item${selectedPayload?.key === key ? ' cmdi-payload-item--selected' : ''}`}
                    >
                      <div className="cmdi-payload-item__name">{payload.name}</div>
                      <div className="cmdi-payload-item__desc">{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p className="cmdi-no-results">No payloads match your search</p>
                  )}
                </div>
              </div>

              <div className="column">
                {selectedPayload ? (
                  <>
                    <h2>{selectedPayload.name}</h2>

                    <div className="cmdi-form-group">
                      <label className="cmdi-form-label">Available Payloads</label>
                      <div className="cmdi-variant-list">
                        {selectedPayload.payloads.map((payload, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleGeneratePayload(payload)}
                            className="cmdi-variant-btn"
                          >
                            {payload.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {generatedPayload && (
                      <div className="cmdi-form-group">
                        <label className="cmdi-form-label">Generated Payload</label>
                        <div className="textarea output cmdi-code-output">
                          {generatedPayload}
                        </div>
                        <button
                          onClick={() => handleCopyCommand(generatedPayload, -1)}
                          className={`cmdi-copy-btn${copiedIndex === -1 ? ' cmdi-copy-btn--copied' : ''}`}
                        >
                          {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="cmdi-empty-state">
                    <p>Select an injection type and then choose a specific payload</p>
                  </div>
                )}

                {/* Quick Probes */}
                <div className="cmdi-quick-section">
                  <h3 className="cmdi-quick-section-title">Quick Detection Probes</h3>
                  <p className="cmdi-quick-section-desc">Common payloads for initial command injection detection:</p>
                  <div className="cmdi-quick-list">
                    {quickProbes.map((payload, idx) => (
                      <div key={idx} className="cmdi-quick-item">
                        <code className="cmdi-quick-code">{payload}</code>
                        <button
                          onClick={() => handleCopyCommand(payload, idx)}
                          className={`cmdi-quick-copy-btn${copiedIndex === idx ? ' cmdi-quick-copy-btn--copied' : ''}`}
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
            <h3>Understanding Command Injection</h3>
            <p>
              Command injection occurs when an attacker can inject and execute arbitrary OS commands through a vulnerable application. It typically results in complete server compromise.
            </p>
            <ul className="cmdi-info-list">
              <li><strong>Unix Operators:</strong> <code>;</code> <code>|</code> <code>&amp;&amp;</code> <code>||</code> <code>&amp;</code> chain commands together</li>
              <li><strong>Windows Operators:</strong> <code>&amp;</code> <code>&amp;&amp;</code> <code>|</code> <code>||</code> work similarly on Windows</li>
              <li><strong>Command Substitution:</strong> <code>$(cmd)</code> and backtick `` `cmd` `` execute and substitute command output</li>
              <li><strong>Filter Bypass:</strong> Quote insertion, environment variables, and encoding evade naive input filters</li>
              <li><strong>OOB Exfiltration:</strong> DNS/HTTP callbacks confirm blind command injection where output isn't reflected</li>
            </ul>

            <h4>Common Vulnerable Patterns:</h4>
            <ul className="cmdi-info-list">
              <li>Ping/nslookup utilities that accept user-supplied hostnames</li>
              <li>File conversion/processing tools passing filenames to shell</li>
              <li>Image/PDF processing using system() or exec() calls</li>
              <li>Log analysis scripts, backup utilities, server-side templating</li>
            </ul>

            <h4>Prevention &amp; Mitigation:</h4>
            <ul className="cmdi-info-list">
              <li>Avoid system(), exec(), shell_exec() with user input entirely</li>
              <li>Use parameterized APIs (e.g., subprocess with list args in Python)</li>
              <li>Strictly validate and whitelist allowed input characters</li>
              <li>Apply principle of least privilege to application processes</li>
              <li>Use Web Application Firewalls (WAF) to detect injection patterns</li>
            </ul>

            <h4>Legal &amp; Ethical Requirements:</h4>
            <div className="cmdi-legal-note">
              <ul className="cmdi-legal-note-list">
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
