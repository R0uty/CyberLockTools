import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { calculateSubnet, COMMON_SUBNETS } from '../utils/subnetCalculator'
import './SubnetCalculator.css'

function SubnetResultRow({ label, value, field, mono = true, copiedField, onCopy }) {
  return (
    <div className="subnet-result-row">
      <span className="subnet-result-label">{label}</span>
      <div className="subnet-result-value-wrapper">
        <span className={mono ? 'subnet-result-value--mono' : 'subnet-result-value'}>{value}</span>
        {value && field && (
          <button
            onClick={() => onCopy(value, field)}
            className={`subnet-inline-copy${copiedField === field ? ' subnet-inline-copy--copied' : ''}`}
          >
            {copiedField === field ? '✓' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function SubnetCalculator() {
  useSEO({
    title: 'Online IP Subnet Calculator - CIDR Network Calculator',
    description: 'Free online IP subnet calculator. Calculate network address, broadcast address, subnet mask, usable hosts, and more from CIDR notation. Essential tool for network engineers and security professionals.',
    keywords: 'subnet calculator, CIDR calculator, IP calculator, network address, broadcast address, subnet mask, network engineering, security',
  })

  const [cidrInput, setCidrInput] = useState('192.168.1.0/24')
  const [result, setResult] = useState(null)
  const [copiedField, setCopiedField] = useState(null)

  const handleCalculate = () => {
    const r = calculateSubnet(cidrInput.trim())
    setResult(r)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCalculate()
  }

  const handleCopy = (value, field) => {
    if (!value) return
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const loadExample = (cidr) => {
    setCidrInput(cidr)
    const r = calculateSubnet(cidr)
    setResult(r)
  }

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>IP Subnet Calculator</h1>
        <p>Calculate subnet details from CIDR notation. Get the network address, broadcast address, subnet mask, usable host range, and more. Useful for network design, troubleshooting, and security assessments.</p>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="tool-content">
            <div className="subnet-input-group">
              <label className="subnet-label">CIDR Notation</label>
              <div className="subnet-input-row">
                <input
                  type="text"
                  value={cidrInput}
                  onChange={(e) => setCidrInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. 192.168.1.0/24"
                  className="input subnet-input"
                  spellCheck={false}
                />
                <button onClick={handleCalculate} className="subnet-calc-btn">
                  Calculate
                </button>
              </div>
              <p className="subnet-input-hint">Enter an IP address with prefix length (e.g. <code>10.0.0.0/8</code>)</p>
            </div>

            {result && result.error && (
              <div className="subnet-error">{result.error}</div>
            )}

            {result && !result.error && (
              <div className="subnet-results">
                <div className="subnet-results-grid">
                  <SubnetResultRow label="Network Address" value={result.networkAddress} field="network" copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow label="Broadcast Address" value={result.broadcastAddress} field="broadcast" copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow label="Subnet Mask" value={result.subnetMask} field="mask" copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow label="Wildcard Mask" value={result.wildcardMask} field="wildcard" copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow label="First Usable Host" value={result.firstHost} field="firstHost" copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow label="Last Usable Host" value={result.lastHost} field="lastHost" copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow label="Total Addresses" value={result.totalHosts.toLocaleString()} field={null} copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow label="Usable Hosts" value={result.usableHosts.toLocaleString()} field={null} copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow label="Prefix Length" value={`/${result.prefix}`} field={null} copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow label="IP Class" value={result.ipClass} field={null} mono={false} copiedField={copiedField} onCopy={handleCopy} />
                  <SubnetResultRow
                    label="Private Range"
                    value={result.isPrivate ? 'Yes (RFC 1918 / Loopback)' : 'No (Public)'}
                    field={null}
                    mono={false}
                    copiedField={copiedField}
                    onCopy={handleCopy}
                  />
                </div>

                <div className="subnet-binary-section">
                  <h4>Binary Representation</h4>
                  <div className="subnet-binary-row">
                    <span className="subnet-binary-label">IP Address:</span>
                    <code className="subnet-binary-value">{result.binaryIP}</code>
                  </div>
                  <div className="subnet-binary-row">
                    <span className="subnet-binary-label">Subnet Mask:</span>
                    <code className="subnet-binary-value">{result.binaryMask}</code>
                  </div>
                </div>

                <div className="subnet-cidr-display">
                  <span className="subnet-cidr-label">CIDR:</span>
                  <code className="subnet-cidr-value">{result.networkAddress}/{result.prefix}</code>
                  <button
                    onClick={() => handleCopy(`${result.networkAddress}/${result.prefix}`, 'cidr')}
                    className={`subnet-inline-copy${copiedField === 'cidr' ? ' subnet-inline-copy--copied' : ''}`}
                  >
                    {copiedField === 'cidr' ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Common subnets */}
        <section className="tool-section">
          <div className="info-box">
            <h3>Common Subnets</h3>
            <p>Click to calculate:</p>
            <div className="subnet-examples-list">
              {COMMON_SUBNETS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => loadExample(s.cidr)}
                  className="subnet-example-btn"
                >
                  <code className="subnet-example-cidr">{s.cidr}</code>
                  <span className="subnet-example-desc">{s.description}</span>
                </button>
              ))}
            </div>

            <h3>CIDR Reference</h3>
            <div className="subnet-ref-table-wrapper">
              <table className="subnet-ref-table">
                <thead>
                  <tr>
                    <th>Prefix</th>
                    <th>Subnet Mask</th>
                    <th>Total Hosts</th>
                    <th>Usable Hosts</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { p: 8,  mask: '255.0.0.0',       total: '16,777,216', usable: '16,777,214' },
                    { p: 16, mask: '255.255.0.0',     total: '65,536',     usable: '65,534' },
                    { p: 20, mask: '255.255.240.0',   total: '4,096',      usable: '4,094' },
                    { p: 24, mask: '255.255.255.0',   total: '256',        usable: '254' },
                    { p: 25, mask: '255.255.255.128', total: '128',        usable: '126' },
                    { p: 26, mask: '255.255.255.192', total: '64',         usable: '62' },
                    { p: 27, mask: '255.255.255.224', total: '32',         usable: '30' },
                    { p: 28, mask: '255.255.255.240', total: '16',         usable: '14' },
                    { p: 29, mask: '255.255.255.248', total: '8',          usable: '6' },
                    { p: 30, mask: '255.255.255.252', total: '4',          usable: '2' },
                    { p: 32, mask: '255.255.255.255', total: '1',          usable: '1 (host route)' },
                  ].map(row => (
                    <tr key={row.p}>
                      <td><code>/{row.p}</code></td>
                      <td><code>{row.mask}</code></td>
                      <td>{row.total}</td>
                      <td>{row.usable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Networking Tips for Security Professionals</h3>
            <ul className="subnet-info-list">
              <li><strong>Network Scanning:</strong> Use CIDR notation with tools like Nmap to scan an entire subnet (e.g., <code>nmap 192.168.1.0/24</code>)</li>
              <li><strong>Firewall Rules:</strong> CIDR notation is used in ACLs, iptables, and security groups to control access ranges</li>
              <li><strong>Private Ranges (RFC 1918):</strong> <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code></li>
              <li><strong>VLSM:</strong> Variable-Length Subnet Masking allows efficient IP space usage — subdivide a /24 into smaller subnets</li>
              <li><strong>Loopback:</strong> <code>127.0.0.0/8</code> is reserved for local loopback communication</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
