import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { getAllCategories, getPayloadsByCategory } from '../utils/pathTraversalGenerator'
import './ReverseShellGenerator.css'
import './PathTraversalGenerator.css'

export default function PathTraversalGenerator() {
  useSEO({
    title: 'Online Path Traversal Generator - Directory Traversal Testing Tool',
    description: 'Free path traversal (directory traversal) payload generator for authorized penetration testing. Generate Unix and Windows file targets, URL-encoded bypasses, null byte bypasses, and web app config targets.',
    keywords: 'path traversal generator, directory traversal, LFI, local file inclusion, penetration testing, authorized testing, security tool'
  })

  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Unix Targets')
  const [selectedPayload, setSelectedPayload] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = getAllCategories()
  const groupsInCategory = getPayloadsByCategory(selectedCategory)

  const handleGroupSelect = (key, group) => {
    setSelectedGroup({ key, ...group })
    setSelectedPayload('')
    setCopiedIndex(null)
  }

  const handlePayloadSelect = (payloadObj) => {
    setSelectedPayload(payloadObj.code)
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
        <h1>Path Traversal Generator</h1>
        <p>Generate path traversal (directory traversal) payloads for authorized penetration testing and security research. Includes Unix and Windows file targets, URL and double-encoded bypasses, null-byte techniques, overlong UTF-8, and web application config targets. All generation happens locally in your browser.</p>
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
              <li>✓ Path traversal can expose sensitive system and application files</li>
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
            <h3>About Path Traversal Vulnerabilities</h3>
            <ul className="shell-info-list-plain">
              <li><strong>Unix / Linux Targets:</strong> Classic files like <code>/etc/passwd</code>, <code>/proc/self/environ</code>, and SSH keys.</li>
              <li><strong>Windows Targets:</strong> System files including <code>win.ini</code>, <code>SAM</code> database, and IIS configuration.</li>
              <li><strong>URL Encoding:</strong> Single and double URL-encoding of <code>../</code> to bypass input filters.</li>
              <li><strong>Null Byte:</strong> Appending <code>%00.jpg</code> to terminate file extension checks in older languages (PHP &lt;5.3).</li>
              <li><strong>Web App Configs:</strong> Target application-specific files like <code>.env</code>, <code>wp-config.php</code>, and <code>WEB-INF/web.xml</code>.</li>
              <li><strong>Depth Variations:</strong> Try different traversal depths to reach the root depending on the web root location.</li>
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
