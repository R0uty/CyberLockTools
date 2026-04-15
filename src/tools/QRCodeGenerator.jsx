import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useSEO } from '../hooks/useSEO'
import { showFeedback } from '../utils/feedback'
import '../styles/pages/QRCodeGenerator.css'

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
        showFeedback('QR code copied to clipboard!')
      })
    } catch (err) {
      showFeedback('Failed to copy: ' + err.message, 'error')
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
        <div className="qr-layout">
          {/* Left side: Controls */}
          <div>
            <div className="form-field">
              <label className="field-label">
                Text or URL:
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text, URL, contact info, WiFi credentials..."
                className="field-textarea"
              />
              <div className="char-count">
                {input.length} characters
              </div>
            </div>

            <div className="form-field">
              <label className="field-label--sm">
                Quick Templates:
              </label>
              <div className="templates-grid">
                {presetTexts.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset.value)}
                    className="template-btn"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="slider-section">
              <label className="field-label">
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="500"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="slider-range"
              />
            </div>

            <div className="error-correction-section">
              <label className="field-label">
                Error Correction Level:
              </label>
              <div className="error-correction-grid">
                {['L', 'M', 'Q', 'H'].map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setLevel(lv)}
                    className={`${level === lv ? 'action-btn encode-btn' : 'action-btn clear-btn'} error-correction-btn`}
                  >
                    {lv === 'L' && '7% Recovery'}
                    {lv === 'M' && '15% Recovery'}
                    {lv === 'Q' && '25% Recovery'}
                    {lv === 'H' && '30% Recovery'}
                  </button>
                ))}
              </div>
              <div className="hint-text">
                Higher levels allow recovery if QR code is partially damaged
              </div>
            </div>

            <div className="color-inputs">
              <div>
                <label className="field-label--sm">
                  Foreground:
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="color-input"
                />
              </div>
              <div>
                <label className="field-label--sm">
                  Background:
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="color-input"
                />
              </div>
            </div>

            <div className="margin-option">
              <label>
                <input
                  type="checkbox"
                  checked={includeMargin}
                  onChange={(e) => setIncludeMargin(e.target.checked)}
                  className="margin-checkbox"
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
            <div className="qr-preview">
              <div ref={qrRef} className="qr-ref-wrapper">
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
                <div className="qr-empty">
                  
                  <div>Enter text or URL above to generate QR code</div>
                </div>
              )}
            </div>

            <div className="info-box info-box--spaced">
              <h4>QR Code Info</h4>
              <div className="qr-info-grid">
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="info-box info-box--spaced">
          <h4>About QR Codes</h4>
          <ul className="about-list">
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
