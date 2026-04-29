import { useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'
import { getAllCategories, getPayloadsByCategory } from '../utils/ssrfGenerator'
import '../styles/pages/ReverseShellGenerator.css'
import '../styles/pages/SSRFGenerator.css'

export default function SSRFGenerator() {
  useSEO({
    title: 'Online SSRF Payload Generator - Server-Side Request Forgery Testing',
    description: 'Free SSRF payload generator for authorized penetration testing. Generate cloud metadata, internal service, file read, IP bypass, and protocol payloads. Educational security tool.',
    keywords: 'SSRF generator, server-side request forgery, SSRF payload, penetration testing, authorized testing, security tool'
  })

  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Cloud Metadata')
  const [selectedPayload, setSelectedPayload] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [callbackHost, setCallbackHost] = useState('attacker.com')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = getAllCategories()
  const groupsInCategory = getPayloadsByCategory(selectedCategory)

  const handleGroupSelect = (key, group) => {
    setSelectedGroup({ key, ...group })
    setSelectedPayload('')
    setCopiedIndex(null)
  }

  const handlePayloadSelect = (payloadObj) => {
    const code = payloadObj.code.replace(/\{CALLBACK_HOST\}/g, callbackHost)
    setSelectedPayload(code)
    setCopiedIndex(null)
  }

  const handleCopy = (text, index) => {
    copyText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const filteredGroups = groupsInCategory.filter(([, group]) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>SSRF Generator</h1>
        <p>Generate Server-Side Request Forgery (SSRF) payloads for authorized penetration testing and security research. Includes cloud metadata endpoints, internal service probes, file reads, IP encoding bypasses, protocol schemes, and DNS/OOB probes. All generation happens locally in your browser.</p>
      </div>

      {/* Disclaimer Box */}
      <div className="tool-container">
        <section className="tool-section">
          <div className="shell-disclaimer">
            <h3 className="shell-disclaimer-title">⚠️ LEGAL & ETHICAL DISCLAIMER</h3>
            <p className="shell-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="shell-disclaimer-text">
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ SSRF can expose cloud credentials, internal services, and sensitive files</li>
              <li>✓ Unauthorized use is ILLEGAL and may result in prosecution</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="two-column-layout">
            <div className="column">
              <h2>Payload Library</h2>

              {/* OOB Callback Host */}
              <div className="shell-form-group">
                <label className="shell-form-label">OOB Callback Host (for DNS/OOB payloads)</label>
                <input
                  type="text"
                  value={callbackHost}
                  onChange={(e) => setCallbackHost(e.target.value)}
                  placeholder="yourburpcollaborator.com"
                  className="input shell-input-full"
                />
              </div>

              {/* Category Filter */}
              <div className="shell-form-group">
                <label className="shell-form-label">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setSelectedGroup(null)
                    setSelectedPayload('')
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
              <div className="shell-form-group">
                <input
                  type="text"
                  placeholder="Search payload groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input shell-input-full"
                />
              </div>

              {/* Group List */}
              <div className="shell-payload-list">
                {filteredGroups.map(([key, group]) => (
                  <button
                    key={key}
                    onClick={() => handleGroupSelect(key, group)}
                    className={`shell-payload-item${selectedGroup?.key === key ? ' shell-payload-item--selected' : ''}`}
                  >
                    <div className="shell-payload-item__name">{group.name}</div>
                    <div className="shell-payload-item__desc">{group.description}</div>
                  </button>
                ))}
                {filteredGroups.length === 0 && (
                  <p className="shell-no-results">No groups match your search</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="column">
              {selectedGroup ? (
                <>
                  <h2>{selectedGroup.name}</h2>
                  <div className="shell-form-group">
                    <label className="shell-form-label">Select Payload</label>
                    <div className="shell-variant-list">
                      {selectedGroup.payloads.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePayloadSelect(p)}
                          className="shell-variant-btn"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPayload && (
                    <div className="shell-form-group">
                      <label className="shell-form-label">Generated Payload</label>
                      <div className="textarea output shell-code-output">
                        {selectedPayload}
                      </div>
                      <button
                        onClick={() => handleCopy(selectedPayload, -1)}
                        className={`shell-copy-btn${copiedIndex === -1 ? ' shell-copy-btn--copied' : ''}`}
                      >
                        {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="shell-empty-state">
                  <p>Select a payload category, then choose a group and individual payload to view.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="tool-section">
          <div className="info-box">
            <h3>About SSRF Vulnerabilities</h3>
            <ul className="shell-info-list-plain">
              <li><strong>Cloud Metadata:</strong> SSRF can reach instance metadata services (AWS IMDSv1/v2, GCP, Azure) and leak IAM credentials.</li>
              <li><strong>Internal Services:</strong> Attackers can access Redis, Elasticsearch, Docker API, and Kubernetes API servers behind firewalls.</li>
              <li><strong>File Read:</strong> Using <code>file://</code> scheme to read local files like <code>/etc/passwd</code>.</li>
              <li><strong>IP Bypasses:</strong> Filters blocking <code>127.0.0.1</code> can be evaded via decimal, hex, or octal representations.</li>
              <li><strong>Protocols:</strong> Gopher, DICT, and LDAP schemes allow interaction with non-HTTP services.</li>
              <li><strong>DNS/OOB:</strong> Out-of-band DNS callbacks confirm blind SSRF without visible response.</li>
            </ul>
            <div className="shell-legal-note">
              <ul className="shell-legal-note-list">
                <li>⚠️ Use ONLY in authorized penetration testing engagements</li>
                <li>✓ Always get written permission before testing</li>
                <li>✓ Document all testing activities</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
