import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { commonTargets, getAllCategories, getPayloadsByCategory } from '../utils/xxeGenerator'
import '../styles/pages/XXEGenerator.css'

export default function XXEGenerator() {
  useSEO({
    title: 'Online XXE Payload Generator - XML External Entity Testing Tool',
    description: 'Free XXE (XML External Entity) payload generator for authorized penetration testing. Generate payloads for file disclosure, SSRF, blind XXE, and more. Educational tool for security professionals.',
    keywords: 'XXE generator, XML external entity, XXE attack, penetration testing, authorized testing, security research'
  })

  const [selectedPayload, setSelectedPayload] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Information Disclosure')
  const [targetFile, setTargetFile] = useState('/etc/passwd')
  const [attackerHost, setAttackerHost] = useState('attacker.com')
  const [generatedPayload, setGeneratedPayload] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCommonTargets, setShowCommonTargets] = useState(false)

  const categories = getAllCategories()
  const payloadsInCategory = getPayloadsByCategory(selectedCategory)

  const handlePayloadSelect = (key, payload) => {
    setSelectedPayload({ key, ...payload })
    setGeneratedPayload('')
    setCopiedIndex(null)
  }

  const handleGeneratePayload = (payloadObj) => {
    let generated = payloadObj.code
      .replace(/{TARGET_FILE}/g, targetFile)
      .replace(/file:\/\/\/etc\/passwd/g, `file://${targetFile}`)
      .replace(/attacker\.com/g, attackerHost)
    setGeneratedPayload(generated)
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
        <h1>XXE Payload Generator</h1>
        <p>Generate XML External Entity (XXE) attack payloads for authorized penetration testing and security research. Supports file disclosure, blind XXE, SSRF, and more. All payload generation happens locally in your browser.</p>
      </div>

      {/* Disclaimer Box */}
      <div className="tool-container">
        <section className="tool-section">
          <div className="xxe-disclaimer">
            <h3 className="xxe-disclaimer-title">⚠️ LEGAL & ETHICAL DISCLAIMER</h3>
            <p className="xxe-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="xxe-disclaimer-text">
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ XXE attacks can cause significant data breaches and system compromise</li>
              <li>✓ Unauthorized XXE attacks are ILLEGAL and may result in prosecution</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="tool-content">
            <div className="two-column-layout">
              <div className="column">
                <h2>Configuration</h2>

                {/* Target File */}
                <div className="xxe-form-group">
                  <label className="xxe-form-label">
                    Target File / Path
                  </label>
                  <input
                    type="text"
                    placeholder="/etc/passwd"
                    value={targetFile}
                    onChange={(e) => setTargetFile(e.target.value)}
                    className="input xxe-input-full"
                  />
                </div>

                {/* Common Targets */}
                {showCommonTargets && (
                  <div className="xxe-form-group">
                    <label className="xxe-form-label--small">
                      Quick Select
                    </label>
                    <div className="xxe-common-targets-list">
                      {commonTargets.linux.map((file, idx) => (
                        <button
                          key={`linux-${idx}`}
                          onClick={() => setTargetFile(file)}
                          className="xxe-target-btn"
                        >
                          {file}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowCommonTargets(!showCommonTargets)}
                  className="xxe-toggle-btn"
                >
                  {showCommonTargets ? '▼ Hide Common Targets' : '▶ Show Common Targets'}
                </button>

                {/* Attacker Host */}
                <div className="xxe-form-group">
                  <label className="xxe-form-label">
                    Attacker Host / Domain
                  </label>
                  <input
                    type="text"
                    placeholder="attacker.com"
                    value={attackerHost}
                    onChange={(e) => setAttackerHost(e.target.value)}
                    className="input xxe-input-full"
                  />
                </div>

                {/* Category Filter */}
                <div className="xxe-form-group">
                  <label className="xxe-form-label">
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
                <div className="xxe-form-group">
                  <input
                    type="text"
                    placeholder="Search payloads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input xxe-input-full"
                  />
                </div>

                {/* Payload List */}
                <div className="xxe-payload-list">
                  {filteredPayloads.map(([key, payload]) => (
                    <button
                      key={key}
                      onClick={() => handlePayloadSelect(key, payload)}
                      className={`xxe-payload-item${selectedPayload?.key === key ? ' xxe-payload-item--selected' : ''}`}
                    >
                      <div className="xxe-payload-item__name">{payload.name}</div>
                      <div className="xxe-payload-item__desc">{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p className="xxe-no-results">
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
                    <div className="xxe-form-group">
                      <label className="xxe-form-label">
                        Available Payloads
                      </label>
                      <div className="xxe-variant-list">
                        {selectedPayload.payloads.map((payload, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleGeneratePayload(payload)}
                            className="xxe-variant-btn"
                          >
                            {payload.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generated Payload */}
                    {generatedPayload && (
                      <div className="xxe-form-group">
                        <label className="xxe-form-label">
                          Generated XXE Payload
                        </label>
                        <div className="textarea output xxe-code-output">
                          {generatedPayload}
                        </div>
                        <button
                          onClick={() => handleCopyCommand(generatedPayload, -1)}
                          className={`xxe-copy-btn${copiedIndex === -1 ? ' xxe-copy-btn--copied' : ''}`}
                        >
                          {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="xxe-empty-state">
                    <p>Select an attack type and then choose a specific payload to generate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="tool-section">
          <div className="info-box">
            <h3>Understanding XXE Attacks</h3>
            <p>
              XML External Entity (XXE) attacks exploit the way XML parsers handle external entity declarations. When an application parses untrusted XML input without properly disabling external entity processing, attackers can:
            </p>
            <ul className="xxe-info-list">
              <li><strong>Disclose sensitive files</strong> - Read /etc/passwd, SSH keys, config files</li>
              <li><strong>Perform SSRF attacks</strong> - Access internal services, AWS metadata, etc.</li>
              <li><strong>Blind XXE</strong> - Extract data even without direct output via error/timing channels</li>
              <li><strong>Execute remote code</strong> - In some configurations with expect/PHP wrappers</li>
            </ul>

            <h4>Common Vulnerable Applications:</h4>
            <ul className="xxe-info-list">
              <li>SOAP web services</li>
              <li>XML API endpoints</li>
              <li>Document upload features (XML, Office files)</li>
              <li>Configuration file parsers</li>
              <li>SVG image upload processors</li>
            </ul>

            <h4>Prevention & Mitigation:</h4>
            <ul className="xxe-info-list">
              <li>Disable external entity processing in XML parsers</li>
              <li>Use whitelisting for allowed XML schemas</li>
              <li>Implement proper input validation</li>
              <li>Use modern XML libraries with secure defaults</li>
              <li>Run applications with least privilege</li>
            </ul>

            <h4>Legal & Ethical Requirements:</h4>
            <div className="xxe-legal-note">
              <ul className="xxe-legal-note-list">
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
