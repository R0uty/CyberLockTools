import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useSEO } from '../hooks/useSEO'

export default function QRCodeGenerator() {
  useSEO({
    title: 'Online QR Code Generator and Scanner',
    description: 'Free online QR code generator. Create QR codes from text, URLs, or contact info. Download as PNG, adjust size and format. Perfect for marketing, sharing, and business needs.',
    keywords: 'qr code generator, create qr code, qr code maker, online qr code'
  })

  const [input, setInput] = useState('https://github.com/Ayrton01/CyberLockTools')
  const [size, setSize] = useState(200)
  const [level, setLevel] = useState('H') // L, M, Q, H
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [includeMargin, setIncludeMargin] = useState(true)
  const qrRef = useRef()

  const downloadQRCode = (format) => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return

    if (format === 'png') {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-${Date.now()}.png`
      link.click()
    } else if (format === 'svg') {
      const svg = qrRef.current?.querySelector('svg')
      if (svg) {
        const svgString = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([svgString], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `qrcode-${Date.now()}.svg`
        link.click()
        URL.revokeObjectURL(url)
      }
    }
  }

  const copyToClipboard = async () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return

    try {
      canvas.toBlob((blob) => {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        alert('QR code copied to clipboard!')
      })
    } catch (err) {
      alert('Failed to copy: ' + err.message)
    }
  }

  const presetTexts = [
    { label: 'GitHub Profile', value: 'https://github.com' },
    { label: 'WiFi Connect', value: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
    { label: 'Email', value: 'mailto:example@example.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'SMS', value: 'smsto:+1234567890:Hello' },
    { label: 'vCard Contact', value: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEND:VCARD' }
  ]

  const applyPreset = (value) => {
    setInput(value)
  }

  const stats = {
    'Characters': input.length,
    'Format': 'QR Code (v1-40)',
    'Error Correction': level,
    'Size': `${size}×${size}px`
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1> QR Code Generator</h1>
        <p>Generate professional QR codes from text, URLs, contact info, WiFi credentials, and more. Customize colors, size, and error correction level. Download in PNG or SVG format, or copy directly to clipboard. Perfect for marketing materials, product packaging, event tickets, and business cards.</p>
      </div>

      <div className="tool-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left side: Controls */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Text or URL:
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text, URL, contact info, WiFi credentials..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '13px',
                  minHeight: '100px',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace'
                }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
                {input.length} characters
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '13px' }}>
                Quick Templates:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {presetTexts.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset.value)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      backgroundColor: '#f5f5f5',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="500"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Error Correction Level:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {['L', 'M', 'Q', 'H'].map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setLevel(lv)}
                    className={level === lv ? 'action-btn encode-btn' : 'action-btn clear-btn'}
                    style={{
                      padding: '0.5rem',
                      fontSize: '13px'
                    }}
                  >
                    {lv === 'L' && '7% Recovery'}
                    {lv === 'M' && '15% Recovery'}
                    {lv === 'Q' && '25% Recovery'}
                    {lv === 'H' && '30% Recovery'}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
                Higher levels allow recovery if QR code is partially damaged
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '13px' }}>
                  Foreground:
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: '100%', height: '40px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '13px' }}>
                  Background:
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: '100%', height: '40px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={includeMargin}
                  onChange={(e) => setIncludeMargin(e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Include Margin (Quiet Zone)
              </label>
            </div>

            <div className="button-group">
              <button onClick={() => downloadQRCode('png')} className="action-btn encode-btn">
                📥 Download PNG
              </button>
              <button onClick={() => downloadQRCode('svg')} className="action-btn encode-btn">
                📥 Download SVG
              </button>
            </div>

            <div className="button-group">
              <button onClick={copyToClipboard} className="action-btn copy-btn">
                Copy to Clipboard
              </button>
              <button onClick={() => { setInput(''); setSize(200); setLevel('H'); }} className="action-btn clear-btn">
                Clear
              </button>
            </div>
          </div>

          {/* Right side: Preview */}
          <div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              minHeight: '400px'
            }}>
              <div ref={qrRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {input && (
                  <QRCodeCanvas
                    value={input}
                    size={size}
                    level={level}
                    includeMargin={includeMargin}
                    fgColor={color}
                    bgColor={bgColor}
                  />
                )}
              </div>
              {!input && (
                <div style={{ color: '#999', textAlign: 'center' }}>
                  
                  <div>Enter text or URL above to generate QR code</div>
                </div>
              )}
            </div>

            <div className="info-box" style={{ marginTop: '1.5rem' }}>
              <h4>QR Code Info</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '13px' }}>
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="info-box" style={{ marginTop: '1.5rem' }}>
          <h4>About QR Codes</h4>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '13px' }}>
            <li><strong>Error Correction:</strong> Allows the QR code to work even if partially damaged (L: 7%, M: 15%, Q: 25%, H: 30%)</li>
            <li><strong>WiFi Format:</strong> Use WIFI:T:WPA;S:NetworkName;P:Password;; to share network credentials</li>
            <li><strong>Contact Format:</strong> Create vCard format for easy phone contact import</li>
            <li><strong>Max Data:</strong> ~2953 bytes for numeric, ~1852 for alphanumeric, ~1273 for binary</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
