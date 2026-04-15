import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { listenerCommands, getAllCategories, getPayloadsByCategory, generatePayload } from '../utils/reverseShellGenerator'
import '../styles/pages/ReverseShellGenerator.css'

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

  const filteredPayloads = payloadsInCategory.filter(([, payload]) =>
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
          <div className="shell-disclaimer">
            <h3 className="shell-disclaimer-title">⚠️ LEGAL & ETHICAL DISCLAIMER</h3>
            <p className="shell-disclaimer-text">
              This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.
            </p>
            <ul className="shell-disclaimer-text">
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
                <div className="shell-form-group">
                  <label className="shell-form-label">
                    Attacker IP (LHOST)
                  </label>
                  <input
                    type="text"
                    placeholder="192.168.1.100"
                    value={lhost}
                    onChange={(e) => setLhost(e.target.value)}
                    className="input shell-input-full"
                  />
                </div>

                <div className="shell-form-group">
                  <label className="shell-form-label">
                    Listener Port (LPORT)
                  </label>
                  <input
                    type="text"
                    placeholder="4444"
                    value={lport}
                    onChange={(e) => setLport(e.target.value)}
                    className="input shell-input-full"
                  />
                </div>

                {/* Category Filter */}
                <div className="shell-form-group">
                  <label className="shell-form-label">
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
                <div className="shell-form-group">
                  <input
                    type="text"
                    placeholder="Search payloads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input shell-input-full"
                  />
                </div>

                {/* Payload List */}
                <div className="shell-payload-list">
                  {filteredPayloads.map(([key, payload]) => (
                    <button
                      key={key}
                      onClick={() => handlePayloadSelect(key, payload)}
                      className={`shell-payload-item${selectedPayload?.key === key ? ' shell-payload-item--selected' : ''}`}
                    >
                      <div className="shell-payload-item__name">{payload.name}</div>
                      <div className="shell-payload-item__desc">{payload.description}</div>
                    </button>
                  ))}
                  {filteredPayloads.length === 0 && (
                    <p className="shell-no-results">
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
                    <div className="shell-form-group">
                      <label className="shell-form-label">
                        Available Payloads
                      </label>
                      <div className="shell-variant-list">
                        {selectedPayload.payloads.map((payload, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleGeneratePayload(payload)}
                            className="shell-variant-btn"
                          >
                            {payload.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generated Payload */}
                    {generatedPayload && (
                      <div className="shell-form-group">
                        <label className="shell-form-label">
                          Generated Payload
                        </label>
                        <div className="textarea output shell-code-output">
                          {generatedPayload}
                        </div>
                        <button
                          onClick={() => handleCopyCommand(generatedPayload, -1)}
                          className={`shell-copy-btn${copiedIndex === -1 ? ' shell-copy-btn--copied' : ''}`}
                        >
                          {copiedIndex === -1 ? '✓ Copied!' : 'Copy Payload'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="shell-empty-state">
                    <p>Select a payload type and then choose a specific payload to generate</p>
                  </div>
                )}

                {/* Listener Setup */}
                <div className="shell-listener-section">
                  <h3 className="shell-listener-title">Step 1: Start Listener</h3>
                  <div className="shell-listener-form-group">
                    <label className="shell-form-label--small">
                      Listener Type
                    </label>
                    <select
                      value={selectedListener}
                      onChange={(e) => setSelectedListener(e.target.value)}
                      className="select shell-select-mb"
                    >
                      {Object.entries(listenerCommands).map(([key, cmd]) => (
                        <option key={key} value={key}>{cmd.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateListener}
                    className="shell-generate-listener-btn"
                  >
                    Generate Listener Command
                  </button>

                  {generatedListener && (
                    <>
                      <div className="textarea output shell-listener-output">
                        {generatedListener}
                      </div>
                      <button
                        onClick={() => handleCopyCommand(generatedListener, -2)}
                        className={`shell-listener-copy-btn${copiedIndex === -2 ? ' shell-listener-copy-btn--copied' : ''}`}
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
            <ol className="shell-info-list">
              <li><strong>On Your Attacker Machine:</strong> Run the listener command with your IP and port</li>
              <li><strong>Generate Payload:</strong> Use this tool to create a payload with your IP/port</li>
              <li><strong>Execute Payload:</strong> Execute the generated payload on the target machine (within authorized testing)</li>
              <li><strong>Get Shell Access:</strong> You will receive a shell connection on your listener</li>
            </ol>

            <h4>Common Usage Scenarios:</h4>
            <ul className="shell-info-list-plain">
              <li><strong>Bash/Linux:</strong> For compromised Linux servers</li>
              <li><strong>Python:</strong> For systems with Python installed</li>
              <li><strong>PHP:</strong> For vulnerable web applications</li>
              <li><strong>PowerShell:</strong> For Windows systems</li>
              <li><strong>Netcat:</strong> Universal listener tool</li>
            </ul>

            <h4>IMPORTANT NOTES:</h4>
            <div className="shell-legal-note">
              <ul className="shell-legal-note-list">
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
