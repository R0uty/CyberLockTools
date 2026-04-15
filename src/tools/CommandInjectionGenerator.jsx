import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import {
  getAllCategories,
  getPayloadsByCategory,
  QUICK_TEST_PAYLOADS,
} from '../utils/commandInjectionGenerator'
import '../styles/pages/CommandInjectionGenerator.css'

export default function CommandInjectionGenerator() {
  useSEO({
    title: 'Online Command Injection Generator - OS Command Injection Testing Tool',
    description: 'Free command injection payload generator for authorized penetration testing. Generate bash, Windows CMD, filter bypass, and data exfiltration payloads. Educational tool for security professionals.',
    keywords: 'command injection generator, OS command injection, RCE, penetration testing, authorized testing, web security, ethical hacking',
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
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Command Injection Generator</h1>
        <p>Generate OS command injection payloads for authorized penetration testing and security research. Supports basic injection, blind detection, filter bypass, Windows, Linux, data exfiltration, and OOB techniques. All generation happens locally in your browser.</p>
      </div>

      {/* Disclaimer */}
      <div className="tool-container">
        <section className="tool-section">
          <div className="cmdi-disclaimer">
            <h3 className="cmdi-disclaimer-title">⚠️ LEGAL & ETHICAL DISCLAIMER</h3>
            <p className="cmdi-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="cmdi-disclaimer-text">
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ Command injection can lead to full system compromise</li>
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

                <div className="cmdi-form-group">
                  <label className="cmdi-form-label">Attack Category</label>
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
                  {filteredPayloads.map((payload, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPayload(payload)}
                      className={`cmdi-payload-item${selectedPayload === payload ? ' cmdi-payload-item--selected' : ''}`}
                    >
                      <div className="cmdi-payload-item__name">{payload.name}</div>
                      <div className="cmdi-payload-item__desc">{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p className="cmdi-no-results">No payloads match your search.</p>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="column">
                {selectedPayload ? (
                  <>
                    <h2>{selectedPayload.name}</h2>
                    <div className="cmdi-form-group">
                      <label className="cmdi-form-label">Payload</label>
                      <div className="textarea output cmdi-code-output">
                        {selectedPayload.payload}
                      </div>
                      <button
                        onClick={() => handleCopy(selectedPayload.payload, -1)}
                        className={`cmdi-copy-btn${copiedIndex === -1 ? ' cmdi-copy-btn--copied' : ''}`}
                      >
                        {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                      </button>
                    </div>
                    <div className="cmdi-form-group">
                      <label className="cmdi-form-label">How It Works</label>
                      <div className="cmdi-explanation">
                        {selectedPayload.explanation}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="cmdi-empty-state">
                    <p>Select a category and then choose a payload to view details.</p>
                  </div>
                )}

                {/* Quick test payloads */}
                <div className="cmdi-quick-section">
                  <h3 className="cmdi-quick-section-title">Quick Detection Payloads</h3>
                  <p className="cmdi-quick-section-desc">Common payloads for initial injection point detection:</p>
                  <div className="cmdi-quick-list">
                    {QUICK_TEST_PAYLOADS.map((payload, idx) => (
                      <div key={idx} className="cmdi-quick-item">
                        <code className="cmdi-quick-code">{payload}</code>
                        <button
                          onClick={() => handleCopy(payload, idx)}
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

        {/* Info section */}
        <section className="tool-section">
          <div className="info-box">
            <h3>Understanding Command Injection</h3>
            <p>
              Command injection (also called OS command injection) occurs when an application passes unsafe user data to a system shell. Attackers can inject shell metacharacters to execute arbitrary operating system commands with the privileges of the vulnerable application.
            </p>
            <h4>Common Injection Points:</h4>
            <ul className="cmdi-info-list">
              <li><strong>ping / traceroute utilities:</strong> Applications that run network diagnostics with user-supplied hostnames</li>
              <li><strong>File processing features:</strong> Convert, resize, or compress operations using CLI tools</li>
              <li><strong>Report generation:</strong> Tools like wkhtmltopdf or pdflatex fed user input</li>
              <li><strong>Search functionality:</strong> grep or find commands with user-supplied patterns</li>
              <li><strong>DNS lookups:</strong> nslookup/dig called with user input</li>
            </ul>
            <h4>Shell Metacharacters:</h4>
            <ul className="cmdi-info-list">
              <li><code>;</code> — Execute commands sequentially</li>
              <li><code>|</code> — Pipe output to next command</li>
              <li><code>&&</code> — Execute if previous succeeded</li>
              <li><code>||</code> — Execute if previous failed</li>
              <li><code>`cmd`</code> or <code>$(cmd)</code> — Command substitution</li>
              <li><code>&</code> — Background execution</li>
              <li><code>%0a</code> — URL-encoded newline</li>
            </ul>
            <h4>Prevention:</h4>
            <ul className="cmdi-info-list">
              <li>Avoid calling OS commands with user input whenever possible</li>
              <li>Use library functions instead of shell equivalents</li>
              <li>Strictly whitelist allowed characters</li>
              <li>Use parameterized APIs (e.g., <code>execFile()</code> with argument arrays)</li>
              <li>Escape shell metacharacters with a secure shell escaping library</li>
              <li>Run web server processes with minimal OS privileges</li>
            </ul>
            <h4>Legal & Ethical Requirements:</h4>
            <div className="cmdi-legal-note">
              <ul className="cmdi-legal-note-list">
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
