import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'

export default function ROT() {
  useSEO({
    title: 'Online ROT13 and Caesar Cipher Tool - Text Encoder',
    description: 'Free online ROT13, ROT47, and Caesar cipher encoder/decoder. Rotate letters in text, transform messages, and decode cipher text. Educational cryptography and text transformation tool.',
    keywords: 'online rot13 tool, caesar cipher, rot47, text encoder, cryptography tool, letter rotation'
  })
  const [input, setInput] = useState('')
  const [shift, setShift] = useState(13)
  const [mode, setMode] = useState('encode')

  const rotCipher = (text, shiftAmount, isEncode) => {
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

  const output = rotCipher(input, shift, mode === 'encode')

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    alert('Copied to clipboard!')
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1> Online ROT13 and Caesar Cipher Tool</h1>
        <p>Rotate letters in your text by a specified amount. ROT13 is a simple letter substitution cipher that replaces a letter with the letter 13 positions after it in the alphabet, commonly used for basic text transformation and educational purposes.</p>
      </div>

      <div className="tool-container">
        <div className="tool-row">
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
