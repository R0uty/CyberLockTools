import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { convertTextToDSL } from '../utils/textToDSL'

export default function TextToDSL() {
  useSEO({
    title: 'Text to DSL Converter - R0uty\'s Cyber Lab',
    description: 'Convert plain text descriptions into DSL (Domain-Specific Language) output.',
    keywords: 'text to dsl, dsl converter, domain specific language, text converter'
  })

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleConvert = () => {
    setError('')
    try {
      setOutput(convertTextToDSL(input))
    } catch (e) {
      setOutput('')
      setError(e.message)
    }
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Text to DSL Converter</h1>
        <p>Write one command per line using supported syntax, then click Convert to generate formatted DSL blocks.</p>
      </div>

      <div className="tool-container">
        <div className="info-box">
          <h4>Supported commands</h4>
          <p>Each line must match one of the patterns below:</p>
          <pre className="output-block"><code>{`scan target <value>
ping host <value>
connect host <value> [port <value>]
block ip <value>
auth user <value>
fuzz url <value>`}</code></pre>
        </div>

        <div className="tool-row">
          <div className="textarea-group">
            <label htmlFor="text-to-dsl-input">Input Text</label>
            <textarea
              id="text-to-dsl-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"e.g. scan target 192.168.1.1\nping host 10.0.0.1\nconnect host example.com port 443\nblock ip 1.2.3.4\nauth user admin\nfuzz url https://example.com"}
              className="textarea"
              rows="8"
            />
          </div>
        </div>

        <div className="tool-row">
          <button className="cta-button" onClick={handleConvert}>
            Convert
          </button>
        </div>

        {error && (
          <div className="tool-row">
            <div className="textarea-group">
              <label>Error</label>
              <pre className="output-block error-block"><code>{error}</code></pre>
            </div>
          </div>
        )}

        {output && (
          <div className="tool-row">
            <div className="textarea-group">
              <label>DSL Output</label>
              <pre className="output-block"><code>{output}</code></pre>
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>How conversion works</h4>
          <p>The converter processes your text in three steps: tokenize each non-empty line, parse command structure, then format each parsed command as a DSL block.</p>
          <p>Commands are case-insensitive (for example, <code>SCAN</code> and <code>scan</code> are treated the same), and blank lines are ignored.</p>
        </div>

        <div className="info-box">
          <h4>Why errors happen</h4>
          <p>If a line does not match a supported pattern exactly, conversion stops and the first parsing error is shown. This helps you fix input line-by-line quickly.</p>
        </div>
      </div>
    </div>
  )
}
