import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { xxePayloads, commonTargets, getAllCategories, getPayloadsByCategory, disclaimer } from '../utils/xxeGenerator'

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

  const filteredPayloads = payloadsInCategory.filter(([_, payload]) =>
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
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8' }}>
                    Target File / Path
                  </label>
                  <input
                    type="text"
                    placeholder="/etc/passwd"
                    value={targetFile}
                    onChange={(e) => setTargetFile(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Common Targets */}
                {showCommonTargets && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8', fontSize: '0.9rem' }}>
                      Quick Select
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {commonTargets.linux.map((file, idx) => (
                        <button
                          key={`linux-${idx}`}
                          onClick={() => setTargetFile(file)}
                          style={{
                            padding: '0.4rem 0.7rem',
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #3a3a3a',
                            borderRadius: '4px',
                            color: '#d0d0d0',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = '#c0c0c0'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = '#3a3a3a'
                          }}
                        >
                          {file}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowCommonTargets(!showCommonTargets)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #c0c0c0',
                    borderRadius: '6px',
                    color: '#d0d0d0',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    width: '100%',
                    fontSize: '0.9rem'
                  }}
                >
                  {showCommonTargets ? '▼ Hide Common Targets' : '▶ Show Common Targets'}
                </button>

                {/* Attacker Host */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8' }}>
                    Attacker Host / Domain
                  </label>
                  <input
                    type="text"
                    placeholder="attacker.com"
                    value={attackerHost}
                    onChange={(e) => setAttackerHost(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

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
                        Available Payloads
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                          Generated XXE Payload
                        </label>
                        <div
                          className="textarea output"
                          style={{
                            padding: '1rem',
                            backgroundColor: '#0f0f0f',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            color: '#a8d5ba',
                            minHeight: '200px',
                            maxHeight: '400px',
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
            <ul style={{ color: '#d0d0d0' }}>
              <li><strong>Disclose sensitive files</strong> - Read /etc/passwd, SSH keys, config files</li>
              <li><strong>Perform SSRF attacks</strong> - Access internal services, AWS metadata, etc.</li>
              <li><strong>Blind XXE</strong> - Extract data even without direct output via error/timing channels</li>
              <li><strong>Execute remote code</strong> - In some configurations with expect/PHP wrappers</li>
            </ul>

            <h4>Common Vulnerable Applications:</h4>
            <ul style={{ color: '#d0d0d0' }}>
              <li>SOAP web services</li>
              <li>XML API endpoints</li>
              <li>Document upload features (XML, Office files)</li>
              <li>Configuration file parsers</li>
              <li>SVG image upload processors</li>
            </ul>

            <h4>Prevention & Mitigation:</h4>
            <ul style={{ color: '#d0d0d0' }}>
              <li>Disable external entity processing in XML parsers</li>
              <li>Use whitelisting for allowed XML schemas</li>
              <li>Implement proper input validation</li>
              <li>Use modern XML libraries with secure defaults</li>
              <li>Run applications with least privilege</li>
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
