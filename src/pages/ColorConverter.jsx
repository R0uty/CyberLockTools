import { useState, useRef } from 'react'
import { useSEO } from '../hooks/useSEO'
import {
  hexToRgb, rgbToHex, rgbToHsl, hslToRgb, rgbToHsv, hsvToRgb,
  formatRgb, formatHsl, formatHsv, getColorInfo
} from '../utils/colorConverter'

export default function ColorConverter() {
  useSEO({
    title: 'Online Color Converter Tool - HEX, RGB, HSL, HSV',
    description: 'Free online color converter. Convert between HEX, RGB, HSL, and HSV color formats instantly. Live color preview with complementary colors, brightness analysis, and more.',
    keywords: 'color converter, hex to rgb, color format, hsl converter, hsv converter, online color tool'
  })

  const [hexInput, setHexInput] = useState('#FF5733')
  const [rgbR, setRgbR] = useState(255)
  const [rgbG, setRgbG] = useState(87)
  const [rgbB, setRgbB] = useState(51)
  const [hslH, setHslH] = useState(0)
  const [hslS, setHslS] = useState(100)
  const [hslL, setHslL] = useState(60)
  const [hsvH, setHsvH] = useState(0)
  const [hsvS, setHsvS] = useState(100)
  const [hsvV, setHsvV] = useState(100)
  const [error, setError] = useState('')
  const colorInputRef = useRef()

  const currentRgb = { r: rgbR, g: rgbG, b: rgbB }
  const colorInfo = getColorInfo(currentRgb)

  const handleHexChange = (value) => {
    setHexInput(value)
    setError('')

    const cleanHex = value.replace(/^#/, '')
    if (/^[0-9A-F]{6}$/i.test(cleanHex)) {
      const rgb = hexToRgb(value)
      if (rgb) {
        setRgbR(rgb.r)
        setRgbG(rgb.g)
        setRgbB(rgb.b)

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        setHslH(hsl.h)
        setHslS(hsl.s)
        setHslL(hsl.l)

        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
        setHsvH(hsv.h)
        setHsvS(hsv.s)
        setHsvV(hsv.v)
      }
    }
  }

  const handleRgbChange = (r, g, b) => {
    setRgbR(r)
    setRgbG(g)
    setRgbB(b)
    setError('')

    setHexInput(rgbToHex(r, g, b))

    const hsl = rgbToHsl(r, g, b)
    setHslH(hsl.h)
    setHslS(hsl.s)
    setHslL(hsl.l)

    const hsv = rgbToHsv(r, g, b)
    setHsvH(hsv.h)
    setHsvS(hsv.s)
    setHsvV(hsv.v)
  }

  const handleHslChange = (h, s, l) => {
    setHslH(h)
    setHslS(s)
    setHslL(l)
    setError('')

    const rgb = hslToRgb(h, s, l)
    setRgbR(rgb.r)
    setRgbG(rgb.g)
    setRgbB(rgb.b)

    setHexInput(rgbToHex(rgb.r, rgb.g, rgb.b))

    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    setHsvH(hsv.h)
    setHsvS(hsv.s)
    setHsvV(hsv.v)
  }

  const handleHsvChange = (h, s, v) => {
    setHsvH(h)
    setHsvS(s)
    setHsvV(v)
    setError('')

    const rgb = hsvToRgb(h, s, v)
    setRgbR(rgb.r)
    setRgbG(rgb.g)
    setRgbB(rgb.b)

    setHexInput(rgbToHex(rgb.r, rgb.g, rgb.b))

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    setHslH(hsl.h)
    setHslS(hsl.s)
    setHslL(hsl.l)
  }

  const handleColorPicked = (e) => {
    const color = e.target.value
    handleHexChange(color)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const handleRandom = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    handleRgbChange(r, g, b)
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Color Converter</h1>
        <p>Convert colors between HEX, RGB, HSL, and HSV formats instantly. See live color preview, complementary colors, brightness analysis, and more. Perfect for web designers, developers, and color enthusiasts.</p>
      </div>

      <div className="tool-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left: Color Inputs */}
          <div>
            {/* Color Picker */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Pick Color:
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  ref={colorInputRef}
                  type="color"
                  value={hexInput}
                  onChange={handleColorPicked}
                  style={{
                    width: '80px',
                    height: '60px',
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                />
                <button onClick={handleRandom} className="action-btn encode-btn">
                  🎲 Random Color
                </button>
              </div>
            </div>

            {/* HEX Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                HEX:
              </label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#FF5733"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => handleCopy(hexInput)}
                style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '12px', cursor: 'pointer' }}
              >
                Copy HEX
              </button>
            </div>

            {/* RGB Sliders */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold' }}>
                RGB: ({rgbR}, {rgbG}, {rgbB})
              </label>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '12px' }}>Red: {rgbR}</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbR}
                  onChange={(e) => handleRgbChange(parseInt(e.target.value), rgbG, rgbB)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '12px' }}>Green: {rgbG}</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbG}
                  onChange={(e) => handleRgbChange(rgbR, parseInt(e.target.value), rgbB)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px' }}>Blue: {rgbB}</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbB}
                  onChange={(e) => handleRgbChange(rgbR, rgbG, parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <button
                onClick={() => handleCopy(formatRgb(currentRgb))}
                style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '12px', cursor: 'pointer', width: '100%' }}
              >
                Copy RGB
              </button>
            </div>

            {/* HSL Sliders */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f5f0', borderRadius: '5px' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold' }}>
                HSL: ({hslH}°, {hslS}%, {hslL}%)
              </label>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '12px' }}>Hue: {hslH}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hslH}
                  onChange={(e) => handleHslChange(parseInt(e.target.value), hslS, hslL)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '12px' }}>Saturation: {hslS}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hslS}
                  onChange={(e) => handleHslChange(hslH, parseInt(e.target.value), hslL)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px' }}>Lightness: {hslL}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hslL}
                  onChange={(e) => handleHslChange(hslH, hslS, parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <button
                onClick={() => handleCopy(formatHsl({ h: hslH, s: hslS, l: hslL }))}
                style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '12px', cursor: 'pointer', width: '100%' }}
              >
                Copy HSL
              </button>
            </div>

            {/* HSV Sliders */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5f0f5', borderRadius: '5px' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold' }}>
                HSV: ({hsvH}°, {hsvS}%, {hsvV}%)
              </label>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '12px' }}>Hue: {hsvH}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsvH}
                  onChange={(e) => handleHsvChange(parseInt(e.target.value), hsvS, hsvV)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '12px' }}>Saturation: {hsvS}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsvS}
                  onChange={(e) => handleHsvChange(hsvH, parseInt(e.target.value), hsvV)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px' }}>Value: {hsvV}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsvV}
                  onChange={(e) => handleHsvChange(hsvH, hsvS, parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <button
                onClick={() => handleCopy(formatHsv({ h: hsvH, s: hsvS, v: hsvV }))}
                style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '12px', cursor: 'pointer', width: '100%' }}
              >
                Copy HSV
              </button>
            </div>
          </div>

          {/* Right: Preview & Info */}
          <div>
            {/* Main Color Preview */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              {/* Current Color */}
              <div style={{
                backgroundColor: colorInfo.hex,
                height: '200px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }} />

              {/* Complementary Color */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Complementary Color:
                </div>
                <div style={{
                  backgroundColor: colorInfo.complementary,
                  height: '80px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colorInfo.isDark ? '#fff' : '#000',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => handleCopy(colorInfo.complementary)}
                >
                  {colorInfo.complementary}
                </div>
              </div>
            </div>

            {/* Color Info */}
            <div className="info-box">
              <h4>Color Information</h4>
              <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                <div><strong>HEX:</strong> <code>{colorInfo.hex}</code></div>
                <div><strong>RGB:</strong> <code>{colorInfo.rgb}</code></div>
                <div><strong>HSL:</strong> <code>{colorInfo.hsl}</code></div>
                <div><strong>HSV:</strong> <code>{colorInfo.hsv}</code></div>
                <div><strong>Brightness:</strong> {colorInfo.brightness}/255 ({colorInfo.isDark ? 'Dark' : 'Light'})</div>
                <div><strong>Complementary:</strong> <code>{colorInfo.complementary}</code></div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="info-box" style={{ marginTop: '1.5rem' }}>
              <h4>Color Palette</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {[10, 30, 50, 70, 90].map((lightness) => {
                  const rgb = hslToRgb(hslH, hslS, lightness)
                  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
                  return (
                    <div
                      key={lightness}
                      style={{
                        backgroundColor: hex,
                        height: '50px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        padding: '4px',
                        fontSize: '10px',
                        color: lightness > 50 ? '#000' : '#fff',
                        fontWeight: 'bold'
                      }}
                      onClick={() => handleHexChange(hex)}
                      title={`Lightness: ${lightness}%`}
                    >
                      {lightness}%
                    </div>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="error-message" style={{ marginTop: '1.5rem' }}>
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="info-box" style={{ marginTop: '1.5rem' }}>
          <h4>About Color Formats</h4>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '13px' }}>
            <li><strong>HEX:</strong> Hexadecimal color notation (#RRGGBB) - most common in web</li>
            <li><strong>RGB:</strong> Red, Green, Blue values (0-255) - standard for screens</li>
            <li><strong>HSL:</strong> Hue (0-360°), Saturation (0-100%), Lightness (0-100%) - intuitive color selection</li>
            <li><strong>HSV:</strong> Hue (0-360°), Saturation (0-100%), Value (0-100%) - used in design tools</li>
            <li><strong>Complementary:</strong> Opposite color on the color wheel for contrast</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
