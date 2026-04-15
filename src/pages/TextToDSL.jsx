import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'

const MOCK_DSL_OUTPUT = `// DSL output will appear here
rule "example-rule" {
  match: input contains "keyword"
  action: flag(severity=HIGH)
}`

export default function TextToDSL() {
  useSEO({
    title: 'Text to DSL Converter - R0uty\'s Cyber Lab',
    description: 'Convert plain text descriptions into DSL (Domain-Specific Language) output.',
    keywords: 'text to dsl, dsl converter, domain specific language, text converter'
  })

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const handleConvert = () => {
    setOutput(MOCK_DSL_OUTPUT)
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Text to DSL Converter</h1>
        <p>Enter plain text below and click Convert to see the DSL output.</p>
      </div>

      <div className="tool-container">
        <div className="tool-row">
          <div className="textarea-group">
            <label htmlFor="text-to-dsl-input">Input Text</label>
            <textarea
              id="text-to-dsl-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to convert to DSL..."
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

        {output && (
          <div className="tool-row">
            <div className="textarea-group">
              <label>DSL Output</label>
              <pre className="output-block"><code>{output}</code></pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
