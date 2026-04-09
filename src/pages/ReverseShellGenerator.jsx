import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { reverseShellPayloads, listenerCommands, getAllCategories, getPayloadsByCategory, generatePayload, disclaimer } from '../utils/reverseShellGenerator'

export default function ReverseShellGenerator() {
  useSEO({
    title: 'Online Reverse Shell Generator - Penetration Testing Tool',
    description: 'Free reverse shell generator for authorized penetration testing. Generate bash, python, PHP, perl, ruby, netcat, and PowerShell reverse shells. Educational tool for cybersecurity professionals.',
    keywords: 'reverse shell generator, penetration testing, authorized testing, security tool, bash shell, ethical hacking'
  })

  const [selectedPayload, setSelectedPayload] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Shell')
  const [lhost, setLhost] = useState('192.168.1.100')
  const [lport, setLport] = useState('4444')
  const [generatedPayload, setGeneratedPayload] = useState('')
  const [selectedListener, setSelectedListener] = useState('netcat')
  const [generatedListener, setGeneratedListener] = useState('')
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
    const generated = generatePayload(payloadObj.code, lhost, lport)
    setGeneratedPayload(generated)
    setCopiedIndex(null)
  }

  const handleGenerateListener = () => {
    const listener = listenerCommands[selectedListener]
    if (listener) {
      const generated = listener.command.replace(/{LPORT}/g, lport).replace(/{LHOST}/g, lhost)
      setGeneratedListener(generated)
    }
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
        <h1>Reverse Shell Generator</h1>
        <p>Generate reverse shell payloads for authorized penetration testing and educational purposes. Supports bash, python, PHP, perl, ruby, netcat, java, and PowerShell. All generation happens locally in your browser.</p>
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
            <p style={{ color: '#d0d0d0', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
              This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>
              <li>✓ Only use with explicit written authorization from system owner</li>
              <li>✓ Only test systems you own or have permission to test</li>
              <li>✓ Unauthorized access is ILLEGAL and may result in prosecution</li>
              <li>✓ Use responsibly and understand your local laws</li>
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

                {/* Attacker Configuration */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8' }}>
                    Attacker IP (LHOST)
                  </label>
                  <input
                    type="text"
                    placeholder="192.168.1.100"
                    value={lhost}
                    onChange={(e) => setLhost(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8' }}>
                    Listener Port (LPORT)
                  </label>
                  <input
                    type="text"
                    placeholder="4444"
                    value={lport}
                    onChange={(e) => setLport(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Category Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8' }}>
                    Payload Type
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
                          Generated Payload
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
                            minHeight: '120px',
                            maxHeight: '300px',
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
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#808080' }}>
                    <p>Select a payload type and then choose a specific payload to generate</p>
                  </div>
                )}

                {/* Listener Setup */}
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #3a3a3a' }}>
                  <h3 style={{ marginTop: 0, color: '#e8e8e8' }}>Step 1: Start Listener</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#e8e8e8', fontSize: '0.9rem' }}>
                      Listener Type
                    </label>
                    <select
                      value={selectedListener}
                      onChange={(e) => setSelectedListener(e.target.value)}
                      className="select"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      {Object.entries(listenerCommands).map(([key, cmd]) => (
                        <option key={key} value={key}>{cmd.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateListener}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #c0c0c0',
                      borderRadius: '6px',
                      color: '#e8e8e8',
                      cursor: 'pointer',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      width: '100%'
                    }}
                  >
                    Generate Listener Command
                  </button>

                  {generatedListener && (
                    <>
                      <div
                        className="textarea output"
                        style={{
                          padding: '1rem',
                          backgroundColor: '#0f0f0f',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          color: '#a8d5ba',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {generatedListener}
                      </div>
                      <button
                        onClick={() => handleCopyCommand(generatedListener, -2)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: copiedIndex === -2 ? '#4a7c4e' : '#c0c0c0',
                          border: 'none',
                          borderRadius: '6px',
                          color: copiedIndex === -2 ? '#e8e8e8' : '#0f0f0f',
                          cursor: 'pointer',
                          fontWeight: '600',
                          width: '100%'
                        }}
                      >
                        {copiedIndex === -2 ? '✓ Copied!' : 'Copy Listener'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="tool-section">
          <div className="info-box">
            <h3>How to Use Reverse Shells</h3>
            <h4>Step-by-Step Process:</h4>
            <ol style={{ color: '#d0d0d0', lineHeight: '1.8' }}>
              <li><strong>On Your Attacker Machine:</strong> Run the listener command with your IP and port</li>
              <li><strong>Generate Payload:</strong> Use this tool to create a payload with your IP/port</li>
              <li><strong>Execute Payload:</strong> Execute the generated payload on the target machine (within authorized testing)</li>
              <li><strong>Get Shell Access:</strong> You will receive a shell connection on your listener</li>
            </ol>

            <h4>Common Usage Scenarios:</h4>
            <ul style={{ color: '#d0d0d0' }}>
              <li><strong>Bash/Linux:</strong> For compromised Linux servers</li>
              <li><strong>Python:</strong> For systems with Python installed</li>
              <li><strong>PHP:</strong> For vulnerable web applications</li>
              <li><strong>PowerShell:</strong> For Windows systems</li>
              <li><strong>Netcat:</strong> Universal listener tool</li>
            </ul>

            <h4>IMPORTANT NOTES:</h4>
            <div style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #ff6b6b', marginTop: '1rem' }}>
              <ul style={{ color: '#d0d0d0', margin: 0 }}>
                <li>⚠️ Use ONLY in authorized penetration testing engagements</li>
                <li>✓ Always get written permission before testing</li>
                <li>✓ Test only on your own systems or authorized targets</li>
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
