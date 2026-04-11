import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { getAllCategories, getPayloadsByCategory } from '../utils/commandInjectionGenerator'
import './ReverseShellGenerator.css'
import './CommandInjectionGenerator.css'

export default function CommandInjectionGenerator() {
  useSEO({
    title: 'Online Command Injection Generator - OS Command Injection Testing',
    description: 'Free command injection payload generator for authorized penetration testing. Generate Unix and Windows command injection payloads, filter bypasses, and OOB exfiltration techniques.',
    keywords: 'command injection generator, OS command injection, penetration testing, authorized testing, security tool, bash injection'
  })

  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Unix Operators')
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
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const filteredGroups = groupsInCategory.filter(([, group]) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Command Injection Generator</h1>
        <p>Generate OS command injection payloads for authorized penetration testing and security research. Includes Unix and Windows operators, file read payloads, network enumeration, filter bypass techniques, and OOB exfiltration. All generation happens locally in your browser.</p>
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
              <li>✓ Command injection gives full OS-level control of the vulnerable server</li>
              <li>✓ Unauthorized use is ILLEGAL and may result in criminal prosecution</li>
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
                <label className="shell-form-label">OOB Callback Host (for exfiltration payloads)</label>
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
                  <p>Select a category, then choose a payload group and individual payload to view.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="tool-section">
          <div className="info-box">
            <h3>About Command Injection</h3>
            <ul className="shell-info-list-plain">
              <li><strong>Unix Operators:</strong> Chaining operators like <code>;</code>, <code>&amp;&amp;</code>, <code>||</code>, <code>|</code>, and backticks to inject additional commands.</li>
              <li><strong>Windows Operators:</strong> <code>&amp;</code>, <code>&amp;&amp;</code>, <code>||</code>, and <code>|</code> for cmd.exe / PowerShell injection.</li>
              <li><strong>Filter Bypasses:</strong> IFS substitution, quote insertion, hex encoding, base64 execution, and newline injections to evade WAFs.</li>
              <li><strong>OOB Exfiltration:</strong> DNS or HTTP callbacks to confirm blind injection when no output is returned.</li>
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
