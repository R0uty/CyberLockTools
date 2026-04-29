import { useRef, useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'
import {
  hexToRgb, rgbToHex, rgbToHsl, hslToRgb, rgbToHsv, hsvToRgb,
  formatRgb, formatHsl, formatHsv, getColorInfo
} from '../utils/colorConverter'
import '../styles/pages/ColorConverter.css'

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
    copyText(text)
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
        <div className="color-grid">
          {/* Left: Color Inputs */}
          <div>
            {/* Color Picker */}
            <div className="form-section">
              <label className="field-label">
                Pick Color:
              </label>
              <div className="color-picker-row">
                <input
                  ref={colorInputRef}
                  type="color"
                  value={hexInput}
                  onChange={handleColorPicked}
                  className="color-input-native"
                />
                <button onClick={handleRandom} className="action-btn encode-btn">
                  🎲 Random Color
                </button>
              </div>
            </div>

            {/* HEX Input */}
            <div className="form-section">
              <label className="field-label">
                HEX:
              </label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#FF5733"
                className="hex-input"
              />
              <button
                onClick={() => handleCopy(hexInput)}
                className="copy-small-btn"
              >
                Copy HEX
              </button>
            </div>

            {/* RGB Sliders */}
            <div className="slider-section slider-section--rgb">
              <label className="slider-section-label">
                RGB: ({rgbR}, {rgbG}, {rgbB})
              </label>
              <div className="slider-item">
                <label>Red: {rgbR}</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbR}
                  onChange={(e) => handleRgbChange(parseInt(e.target.value), rgbG, rgbB)}
                />
              </div>
              <div className="slider-item">
                <label>Green: {rgbG}</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbG}
                  onChange={(e) => handleRgbChange(rgbR, parseInt(e.target.value), rgbB)}
                />
              </div>
              <div className="slider-item">
                <label>Blue: {rgbB}</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbB}
                  onChange={(e) => handleRgbChange(rgbR, rgbG, parseInt(e.target.value))}
                />
              </div>
              <button
                onClick={() => handleCopy(formatRgb(currentRgb))}
                className="copy-small-btn copy-small-btn--full"
              >
                Copy RGB
              </button>
            </div>

            {/* HSL Sliders */}
            <div className="slider-section slider-section--hsl">
              <label className="slider-section-label">
                HSL: ({hslH}°, {hslS}%, {hslL}%)
              </label>
              <div className="slider-item">
                <label>Hue: {hslH}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hslH}
                  onChange={(e) => handleHslChange(parseInt(e.target.value), hslS, hslL)}
                />
              </div>
              <div className="slider-item">
                <label>Saturation: {hslS}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hslS}
                  onChange={(e) => handleHslChange(hslH, parseInt(e.target.value), hslL)}
                />
              </div>
              <div className="slider-item">
                <label>Lightness: {hslL}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hslL}
                  onChange={(e) => handleHslChange(hslH, hslS, parseInt(e.target.value))}
                />
              </div>
              <button
                onClick={() => handleCopy(formatHsl({ h: hslH, s: hslS, l: hslL }))}
                className="copy-small-btn copy-small-btn--full"
              >
                Copy HSL
              </button>
            </div>

            {/* HSV Sliders */}
            <div className="slider-section slider-section--hsv">
              <label className="slider-section-label">
                HSV: ({hsvH}°, {hsvS}%, {hsvV}%)
              </label>
              <div className="slider-item">
                <label>Hue: {hsvH}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsvH}
                  onChange={(e) => handleHsvChange(parseInt(e.target.value), hsvS, hsvV)}
                />
              </div>
              <div className="slider-item">
                <label>Saturation: {hsvS}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsvS}
                  onChange={(e) => handleHsvChange(hsvH, parseInt(e.target.value), hsvV)}
                />
              </div>
              <div className="slider-item">
                <label>Value: {hsvV}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsvV}
                  onChange={(e) => handleHsvChange(hsvH, hsvS, parseInt(e.target.value))}
                />
              </div>
              <button
                onClick={() => handleCopy(formatHsv({ h: hsvH, s: hsvS, v: hsvV }))}
                className="copy-small-btn copy-small-btn--full"
              >
                Copy HSV
              </button>
            </div>
          </div>

          {/* Right: Preview & Info */}
          <div>
            {/* Main Color Preview */}
            <div className="preview-container">
              {/* Current Color */}
              <div
                className="color-preview-main"
                style={{ backgroundColor: colorInfo.hex }}
              />

              {/* Complementary Color */}
              <div>
                <div className="complementary-label">
                  Complementary Color:
                </div>
                <div
                  className="complementary-preview"
                  style={{
                    backgroundColor: colorInfo.complementary,
                    color: colorInfo.isDark ? '#fff' : '#000'
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
              <div className="color-info-content">
                <div><strong>HEX:</strong> <code>{colorInfo.hex}</code></div>
                <div><strong>RGB:</strong> <code>{colorInfo.rgb}</code></div>
                <div><strong>HSL:</strong> <code>{colorInfo.hsl}</code></div>
                <div><strong>HSV:</strong> <code>{colorInfo.hsv}</code></div>
                <div><strong>Brightness:</strong> {colorInfo.brightness}/255 ({colorInfo.isDark ? 'Dark' : 'Light'})</div>
                <div><strong>Complementary:</strong> <code>{colorInfo.complementary}</code></div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="info-box info-box--mt">
              <h4>Color Palette</h4>
              <div className="palette-grid">
                {[10, 30, 50, 70, 90].map((lightness) => {
                  const rgb = hslToRgb(hslH, hslS, lightness)
                  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
                  return (
                    <div
                      key={lightness}
                      className="palette-item"
                      style={{
                        backgroundColor: hex,
                        color: lightness > 50 ? '#000' : '#fff'
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
              <div className="error-message error-message--mt">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="info-box info-box--mt">
          <h4>About Color Formats</h4>
          <ul className="about-list">
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
