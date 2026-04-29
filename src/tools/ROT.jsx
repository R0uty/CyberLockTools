import { useState } from 'react'
import { copyText } from '../utils/clipboard'
import { useSEO } from '../hooks/useSEO'

// ROT47 rotates all printable ASCII characters (33–126) by 47 positions.
// It is its own inverse, so encode and decode are the same operation.
const rot47 = (text) =>
  text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(((code - 33 + 47) % 94) + 33)
      }
      return char
    })
    .join('')

const rotCaesar = (text, shiftAmount, isEncode) => {
  const actualShift = isEncode ? shiftAmount : (26 - shiftAmount) % 26
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0)
        const isUpperCase = code <= 90
        const start = isUpperCase ? 65 : 97
        return String.fromCharCode(((code - start + actualShift) % 26) + start)
      }
      return char
    })
    .join('')
}

export default function ROT() {
  useSEO({
    title: 'Online Caesar Cipher Tool (ROT13 / ROT47) - Text Encoder',
    description: 'Free online ROT13, ROT47, and Caesar cipher encoder/decoder. Rotate letters in text, transform messages, and decode cipher text. Educational cryptography and text transformation tool.',
    keywords: 'online rot13 tool, caesar cipher, rot47, text encoder, cryptography tool, letter rotation'
  })
  const [input, setInput] = useState('')
  const [shift, setShift] = useState(13)
  const [mode, setMode] = useState('encode')
  const [cipherType, setCipherType] = useState('caesar')

  const output = cipherType === 'rot47'
    ? rot47(input)
    : rotCaesar(input, shift, mode === 'encode')

  const handleCopy = () => {
    copyText(output)
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Online ROT13, ROT47, and Caesar Cipher Tool</h1>
        <p>Rotate letters or printable ASCII characters in your text. ROT13 is a letter substitution cipher that replaces a letter with the one 13 positions later; ROT47 extends the same idea to all printable ASCII characters (33–126) with a shift of 47.</p>
      </div>

      <div className="tool-container">
        <div className="tool-row">
          <div className="control-group">
            <label>Cipher</label>
            <div className="mode-toggle">
              <button
                className={`toggle-btn ${cipherType === 'caesar' ? 'active' : ''}`}
                onClick={() => setCipherType('caesar')}
              >
                Caesar / ROT13
              </button>
              <button
                className={`toggle-btn ${cipherType === 'rot47' ? 'active' : ''}`}
                onClick={() => setCipherType('rot47')}
              >
                ROT47
              </button>
            </div>
          </div>

          {cipherType === 'caesar' && (
            <>
              <div className="control-group">
                <label>Shift Amount (0-25)</label>
                <div className="shift-control">
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={shift}
                    onChange={(e) => setShift(parseInt(e.target.value))}
                    className="slider"
                  />
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={shift}
                    onChange={(e) => setShift(Math.min(25, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="number-input"
                  />
                </div>
              </div>

              <div className="control-group">
                <label>Mode</label>
                <div className="mode-toggle">
                  <button
                    className={`toggle-btn ${mode === 'encode' ? 'active' : ''}`}
                    onClick={() => setMode('encode')}
                  >
                    Encode
                  </button>
                  <button
                    className={`toggle-btn ${mode === 'decode' ? 'active' : ''}`}
                    onClick={() => setMode('decode')}
                  >
                    Decode
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="tool-row">
          <div className="textarea-group">
            <label>Input Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to transform..."
              className="textarea"
              rows="8"
            />
          </div>

          <div className="textarea-group">
            <label>Output</label>
            <textarea
              value={output}
              readOnly
              className="textarea output"
              rows="8"
            />
            <button onClick={handleCopy} className="copy-btn">
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
