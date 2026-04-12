import { useEffect, useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import {
  analyzeSstiProbe,
  fillPayloadTemplate,
  getAllSstiEngines,
  getPayloadGroupsForEngine,
  getSampleForEngine
} from '../utils/sstiGenerator'
import './SSTIGenerator.css'

export default function SSTIGenerator() {
  useSEO({
    title: 'SSTI Generator & Analyzer',
    description: 'Generate Server-Side Template Injection probes and analyze pasted outputs or errors for Jinja2, Twig, Freemarker, Velocity, Smarty, Handlebars, and Liquid.',
    keywords: 'SSTI generator, server-side template injection, template injection analyzer, Jinja2, Twig, Freemarker, Velocity, Smarty, Handlebars, Liquid'
  })

  const engines = useMemo(() => getAllSstiEngines(), [])
  const [selectedEngineId, setSelectedEngineId] = useState('jinja2')
  const [selectedGroupKey, setSelectedGroupKey] = useState('')
  const [selectedPayloadName, setSelectedPayloadName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [variableName, setVariableName] = useState('name')
  const [variableValue, setVariableValue] = useState('R0uty')
  const [expression, setExpression] = useState('7*7')
  const [command, setCommand] = useState('id')
  const [copied, setCopied] = useState('')
  const [analysisInput, setAnalysisInput] = useState('')
  const [observedInput, setObservedInput] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)

  const selectedEngine = engines.find((engine) => engine.id === selectedEngineId) ?? engines[0]
  const payloadGroups = useMemo(
    () => getPayloadGroupsForEngine(selectedEngineId),
    [selectedEngineId]
  )

  useEffect(() => {
    if (!payloadGroups.some((group) => group.key === selectedGroupKey)) {
      setSelectedGroupKey(payloadGroups[0]?.key ?? '')
    }
  }, [payloadGroups, selectedGroupKey])

  const selectedGroup = payloadGroups.find((group) => group.key === selectedGroupKey) ?? payloadGroups[0]

  const filteredPayloads = useMemo(() => {
    if (!selectedGroup) return []

    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) return selectedGroup.payloads

    return selectedGroup.payloads.filter((payload) => (
      payload.name.toLowerCase().includes(normalizedQuery) ||
      payload.note.toLowerCase().includes(normalizedQuery) ||
      payload.template.toLowerCase().includes(normalizedQuery)
    ))
  }, [searchQuery, selectedGroup])

  useEffect(() => {
    if (!filteredPayloads.some((payload) => payload.name === selectedPayloadName)) {
      setSelectedPayloadName(filteredPayloads[0]?.name ?? '')
    }
  }, [filteredPayloads, selectedPayloadName])

  const selectedPayload = filteredPayloads.find((payload) => payload.name === selectedPayloadName) ?? filteredPayloads[0] ?? null

  const generatedPayload = selectedPayload
    ? fillPayloadTemplate(selectedPayload.template, {
      VARIABLE: variableName,
      VALUE: variableValue,
      EXPRESSION: expression,
      COMMAND: command
    })
    : ''

  const handleCopy = async (value, key) => {
    if (!value.trim()) return

    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(''), 1800)
  }

  const handleAnalyze = () => {
    setAnalysisResult(analyzeSstiProbe({
      templateInput: analysisInput,
      observedInput
    }))
  }

  const handleLoadSample = () => {
    const sample = getSampleForEngine(selectedEngineId)
    setAnalysisInput(sample.template)
    setObservedInput(sample.observed)
    setAnalysisResult(analyzeSstiProbe({
      templateInput: sample.template,
      observedInput: sample.observed
    }))
  }

  const handleClearAnalyzer = () => {
    setAnalysisInput('')
    setObservedInput('')
    setAnalysisResult(null)
  }

  return (
    <div className="tool-page ssti-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>

      <div className="tool-header">
        <span className="ssti-kicker">Template injection</span>
        <h1>SSTI Generator &amp; Analyzer</h1>
        <p>Generate Server-Side Template Injection probes for major engines, then analyze pasted output and error traces to narrow down likely matches and risky exposure paths.</p>
      </div>

      <div className="tool-container">
        <section className="tool-section ssti-panel">
          <div className="ssti-disclaimer">
            <h3>Authorized use only</h3>
            <p>This tool is for authorized security testing and education. Only use it on systems you own or have explicit permission to assess.</p>
          </div>

          <div className="ssti-engine-grid">
            <article className="ssti-engine-card">
              <span className="ssti-card-label">Engine</span>
              <strong>{selectedEngine.name}</strong>
              <p>{selectedEngine.description}</p>
            </article>
            <article className="ssti-engine-card">
              <span className="ssti-card-label">Family</span>
              <strong>{selectedEngine.family}</strong>
              <p>{selectedEngine.syntax}</p>
            </article>
            <article className="ssti-engine-card">
              <span className="ssti-card-label">Probe focus</span>
              <strong>{payloadGroups.length}</strong>
              <p>Detection, context discovery, and high-risk access chains.</p>
            </article>
          </div>
        </section>

        <section className="tool-section ssti-panel">
          <div className="ssti-section-header">
            <div>
              <span className="ssti-section-kicker">Generator</span>
              <h2>SSTI payload workbench</h2>
            </div>
          </div>

          <div className="ssti-controls-grid">
            <div className="textarea-group">
              <label htmlFor="ssti-engine-select">Template engine</label>
              <select
                id="ssti-engine-select"
                value={selectedEngineId}
                onChange={(event) => {
                  setSelectedEngineId(event.target.value)
                  setSearchQuery('')
                }}
                className="ssti-select"
              >
                {engines.map((engine) => (
                  <option key={engine.id} value={engine.id}>{engine.name}</option>
                ))}
              </select>
            </div>

            <div className="textarea-group">
              <label htmlFor="ssti-search">Search payloads</label>
              <input
                id="ssti-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search the current engine payloads..."
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="ssti-variable">Variable name</label>
              <input
                id="ssti-variable"
                type="text"
                value={variableName}
                onChange={(event) => setVariableName(event.target.value)}
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="ssti-value">Example value</label>
              <input
                id="ssti-value"
                type="text"
                value={variableValue}
                onChange={(event) => setVariableValue(event.target.value)}
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="ssti-expression">Expression probe</label>
              <input
                id="ssti-expression"
                type="text"
                value={expression}
                onChange={(event) => setExpression(event.target.value)}
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="ssti-command">Command placeholder</label>
              <input
                id="ssti-command"
                type="text"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
              />
            </div>
          </div>

          <div className="ssti-workbench">
            <div className="ssti-library-column">
              <div className="ssti-group-list">
                {payloadGroups.map((group) => (
                  <button
                    key={group.key}
                    onClick={() => setSelectedGroupKey(group.key)}
                    className={selectedGroup?.key === group.key ? 'ssti-group-btn ssti-group-btn--active' : 'ssti-group-btn'}
                  >
                    <strong>{group.name}</strong>
                  </button>
                ))}
              </div>

              <div className="ssti-payload-list">
                {filteredPayloads.map((payload) => (
                  <button
                    key={payload.name}
                    onClick={() => setSelectedPayloadName(payload.name)}
                    className={selectedPayload?.name === payload.name ? 'ssti-payload-card ssti-payload-card--active' : 'ssti-payload-card'}
                  >
                    <strong>{payload.name}</strong>
                    <span>{payload.note}</span>
                  </button>
                ))}
                {filteredPayloads.length === 0 && (
                  <div className="ssti-empty-list">No payloads match your search.</div>
                )}
              </div>
            </div>

            <div className="ssti-output-column">
              {selectedPayload ? (
                <>
                  <div className="ssti-selected-card">
                    <span className="ssti-card-label">Selected payload</span>
                    <h3>{selectedPayload.name}</h3>
                    <p>{selectedPayload.note}</p>
                  </div>

                  <div className="textarea-group">
                    <label htmlFor="ssti-generated-payload">Generated payload</label>
                    <textarea
                      id="ssti-generated-payload"
                      value={generatedPayload}
                      readOnly
                      className="textarea output ssti-generated-output"
                      rows={8}
                      spellCheck={false}
                    />
                  </div>

                  <button
                    onClick={() => handleCopy(generatedPayload, 'payload')}
                    className="action-btn encode-btn ssti-copy-btn"
                  >
                    {copied === 'payload' ? 'Copied Payload' : 'Copy Payload'}
                  </button>

                  <div className="ssti-probe-list">
                    <span className="ssti-card-label">Strong follow-up probes</span>
                    <ul>
                      {selectedEngine.nextProbes.map((probe) => (
                        <li key={probe}>
                          <code>{probe}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="ssti-selected-card">
                  <h3>No payload selected</h3>
                  <p>Choose a payload family and then a specific probe to generate it.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="tool-section ssti-panel">
          <div className="ssti-section-header">
            <div>
              <span className="ssti-section-kicker">Analyzer</span>
              <h2>Fingerprint pasted template behavior</h2>
            </div>
          </div>

          <div className="button-group">
            <button onClick={handleAnalyze} className="action-btn encode-btn">Analyze SSTI clues</button>
            <button onClick={handleLoadSample} className="action-btn decode-btn">Load {selectedEngine.name} sample</button>
            <button onClick={handleClearAnalyzer} className="action-btn clear-btn">Clear</button>
          </div>

          <div className="tool-row">
            <div className="textarea-group">
              <label htmlFor="ssti-analysis-input">Template probe or payload</label>
              <textarea
                id="ssti-analysis-input"
                value={analysisInput}
                onChange={(event) => setAnalysisInput(event.target.value)}
                placeholder="Paste the probe you used, such as {{7*7}} or ${7*7}..."
                className="textarea"
                rows={10}
                spellCheck={false}
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="ssti-observed-input">Observed output or error trace</label>
              <textarea
                id="ssti-observed-input"
                value={observedInput}
                onChange={(event) => setObservedInput(event.target.value)}
                placeholder="Paste rendered output, stack trace, or error text..."
                className="textarea"
                rows={10}
                spellCheck={false}
              />
            </div>
          </div>

          {analysisResult && (
            <div className="ssti-analysis-results">
              <div className="info-box info-box--alt ssti-summary-box">
                <h4>Analysis summary</h4>
                <p>{analysisResult.summary}</p>
              </div>

              <div className="ssti-analysis-grid">
                <article className="ssti-analysis-card">
                  <h3>Likely engines</h3>
                  {analysisResult.engineMatches.length > 0 ? (
                    <div className="ssti-badge-stack">
                      {analysisResult.engineMatches.map((match) => (
                        <div key={match.id} className={`ssti-engine-badge ssti-engine-badge--${match.confidence}`}>
                          <strong>{match.name}</strong>
                          <span>{match.family} • {match.confidence} confidence</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No engine-specific fingerprints were found yet.</p>
                  )}
                </article>

                <article className="ssti-analysis-card">
                  <h3>Findings</h3>
                  {analysisResult.findings.length > 0 ? (
                    <ul className="ssti-findings-list">
                      {analysisResult.findings.map((finding) => (
                        <li key={finding.message}>
                          <span className={`ssti-severity-tag ssti-severity-tag--${finding.severity}`}>{finding.severity}</span>
                          <span>{finding.message}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No clear SSTI signals were found in the pasted content.</p>
                  )}
                </article>
              </div>

              <article className="ssti-analysis-card ssti-analysis-card--full">
                <h3>Recommended next probes</h3>
                <div className="ssti-next-probes">
                  {analysisResult.nextSteps.map((probe) => (
                    <button
                      key={probe}
                      onClick={() => handleCopy(probe, probe)}
                      className="ssti-probe-chip"
                    >
                      <code>{probe}</code>
                      <span>{copied === probe ? 'Copied' : 'Copy'}</span>
                    </button>
                  ))}
                </div>
              </article>
            </div>
          )}
        </section>

        <div className="info-box">
          <h4>How to use it</h4>
          <p>Pick an engine, choose a payload family, and customize the placeholder fields to generate a probe. Then paste the rendered output or error message into the analyzer to narrow down likely template engines and identify risky exposure signals.</p>
          <ul>
            <li>Start with low-noise arithmetic or variable probes before touching high-risk chains.</li>
            <li>Engine-specific error text is often the fastest way to distinguish Jinja/Twig/Liquid or Freemarker/Velocity families.</li>
            <li>Treat context dumps, globals access, and command-oriented helpers as high-severity findings.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
