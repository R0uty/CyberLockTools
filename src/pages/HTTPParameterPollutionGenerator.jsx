import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Copy01Icon } from 'hugeicons-react';
import {
  getAllCategories,
  getPayloadsByCategory,
  searchPayloads,
  BACKEND_PARSING_BEHAVIORS,
  LEGAL_DISCLAIMER
} from '../utils/httpParameterPollutionGenerator';

export default function HTTPParameterPollutionGenerator() {
  useSEO(
    'HTTP Parameter Pollution Generator - R0uty\'s Cyber Lab',
    'Educational HTTP parameter pollution payload generator. Learn about web server security vulnerabilities with tutorials and examples.'
  );

  const [selectedCategory, setSelectedCategory] = useState('GET_POLLUTION');
  const [selectedPayload, setSelectedPayload] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendType, setBackendType] = useState('PHP/Apache');
  const [showLegalWarning, setShowLegalWarning] = useState(true);

  const categories = getAllCategories();
  const currentPayloads = searchQuery
    ? searchPayloads(searchQuery)
    : getPayloadsByCategory(selectedCategory);

  const currentPayload = currentPayloads[selectedPayload] || null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (showLegalWarning) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <h1>HTTP Parameter Pollution Generator</h1>
        <div
          style={{
            backgroundColor: '#ff6b6b22',
            border: '2px solid #ff6b6b',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            color: '#d0d0d0',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.6'
          }}
        >
          {LEGAL_DISCLAIMER}
        </div>
        <button
          onClick={() => setShowLegalWarning(false)}
          style={{
            backgroundColor: '#c0c0c0',
            color: '#1a1a1a',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#d0d0d0')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#c0c0c0')}
        >
          I Understand & Accept
        </button>
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#2a2a2a',
            color: '#d0d0d0',
            border: '2px solid #c0c0c0',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#333333')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#2a2a2a')}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>HTTP Parameter Pollution Generator</h1>
      <p style={{ color: '#c0c0c0', marginBottom: '20px' }}>
        Learn HTTP Parameter Pollution (HPP) techniques for authorized security testing and educational purposes.
      </p>

      {/* Backend Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#d0d0d0', fontWeight: 'bold' }}>
          Target Backend Type:
        </label>
        <select
          value={backendType}
          onChange={(e) => setBackendType(e.target.value)}
          style={{
            backgroundColor: '#2a2a2a',
            color: '#d0d0d0',
            border: '2px solid #c0c0c0',
            padding: '10px',
            borderRadius: '6px',
            width: '100%',
            maxWidth: '400px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {BACKEND_PARSING_BEHAVIORS.map((backend) => (
            <option key={backend.backend} value={backend.backend}>
              {backend.backend}
            </option>
          ))}
        </select>
      </div>

      {/* Backend Info Card */}
      <div
        style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #c0c0c0',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '30px'
        }}
      >
        <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>{backendType} Behavior:</h3>
        <div>
          {BACKEND_PARSING_BEHAVIORS.filter(b => b.backend === backendType).map((b, idx) => (
            <div key={idx}>
              <p style={{ color: '#d0d0d0', margin: '8px 0' }}>
                <strong>Behavior:</strong> {b.behavior}
              </p>
              <div
                style={{
                  backgroundColor: '#1a1a1a',
                  padding: '10px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#c0c0c0'
                }}
              >
                Example: {b.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Left: Category & Payload Selection */}
        <div>
          <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>Attack Type</h3>

          {/* Search */}
          <input
            type="text"
            placeholder="Search payloads..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedPayload(0);
            }}
            style={{
              width: '100%',
              backgroundColor: '#2a2a2a',
              color: '#d0d0d0',
              border: '2px solid #c0c0c0',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px'
            }}
          />

          {/* Category Buttons */}
          {!searchQuery && (
            <div style={{ marginBottom: '15px' }}>
              {categories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setSelectedPayload(0);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: selectedCategory === key ? '#c0c0c0' : '#2a2a2a',
                    color: selectedCategory === key ? '#1a1a1a' : '#d0d0d0',
                    border: '2px solid #c0c0c0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== key) {
                      e.target.style.backgroundColor = '#444444';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== key) {
                      e.target.style.backgroundColor = '#2a2a2a';
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Payload List */}
          <div
            style={{
              backgroundColor: '#2a2a2a',
              border: '2px solid #c0c0c0',
              borderRadius: '8px',
              maxHeight: '500px',
              overflowY: 'auto'
            }}
          >
            {currentPayloads.length === 0 ? (
              <div style={{ padding: '20px', color: '#c0c0c0', textAlign: 'center' }}>
                No payloads found
              </div>
            ) : (
              currentPayloads.map((payload, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPayload(index)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 15px',
                    textAlign: 'left',
                    backgroundColor: selectedPayload === index ? '#444444' : '#2a2a2a',
                    color: selectedPayload === index ? '#d0d0d0' : '#c0c0c0',
                    border: 'none',
                    borderBottom: '1px solid #1a1a1a',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'all 0.1s',
                    fontWeight: selectedPayload === index ? 'bold' : 'normal'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#444444';
                    e.target.style.color = '#d0d0d0';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = selectedPayload === index ? '#444444' : '#2a2a2a';
                    e.target.style.color = selectedPayload === index ? '#d0d0d0' : '#c0c0c0';
                  }}
                >
                  <strong>{payload.name}</strong>
                  <div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '4px' }}>
                    {payload.description}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Payload Preview */}
        <div>
          <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>Payload Preview</h3>

          {currentPayload ? (
            <>
              {/* Payload Code */}
              <div
                style={{
                  backgroundColor: '#1a1a1a',
                  border: '2px solid #c0c0c0',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    color: '#d0d0d0',
                    lineHeight: '1.6',
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {currentPayload.payload}
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(currentPayload.payload)}
                style={{
                  width: '100%',
                  backgroundColor: '#c0c0c0',
                  color: '#1a1a1a',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#d0d0d0')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#c0c0c0')}
              >
                <Copy01Icon size={18} />
                Copy Payload
              </button>

              {/* Explanation */}
              <div
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '2px solid #c0c0c0',
                  borderRadius: '8px',
                  padding: '15px'
                }}
              >
                <h4 style={{ color: '#c0c0c0', marginTop: 0 }}>Explanation:</h4>
                <p style={{ color: '#c0c0c0', margin: '0', lineHeight: '1.6' }}>
                  {currentPayload.explanation}
                </p>
              </div>
            </>
          ) : (
            <div
              style={{
                backgroundColor: '#2a2a2a',
                border: '2px solid #c0c0c0',
                borderRadius: '8px',
                padding: '30px',
                textAlign: 'center',
                color: '#a0a0a0'
              }}
            >
              Select a payload to view details
            </div>
          )}
        </div>
      </div>

      {/* Backend Parsing Reference */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#c0c0c0' }}>Backend Parsing Differences Reference</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '15px'
          }}
        >
          {BACKEND_PARSING_BEHAVIORS.map((backend, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#2a2a2a',
                border: '2px solid #c0c0c0',
                borderRadius: '8px',
                padding: '15px'
              }}
            >
              <strong style={{ color: '#d0d0d0' }}>{backend.backend}</strong>
              <p style={{ color: '#a0a0a0', marginTop: '8px', margin: '8px 0 0 0', fontSize: '13px' }}>
                {backend.behavior}
              </p>
              <div
                style={{
                  backgroundColor: '#1a1a1a',
                  padding: '8px',
                  borderRadius: '4px',
                  marginTop: '8px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#c0c0c0'
                }}
              >
                {backend.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HPP Impact Matrix */}
      <div
        style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #c0c0c0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}
      >
        <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>HTTP Parameter Pollution Impact</h3>
        <ul style={{ color: '#c0c0c0', lineHeight: '1.8' }}>
          <li>✓ <strong>WAF Bypass:</strong> Fragment payloads across parameters to evade detection</li>
          <li>✓ <strong>Authentication Bypass:</strong> Override authentication parameters with duplicates</li>
          <li>✓ <strong>XSS via HPP:</strong> Bypass XSS filters by splitting payload across parameters</li>
          <li>✓ <strong>SQL Injection:</strong> Inject SQL fragments that reassemble in backend queries</li>
          <li>✓ <strong>Cache Poisoning:</strong> Exploit different cache key generation from parameters</li>
          <li>✓ <strong>Privilege Escalation:</strong> Duplicate role/permission parameters to elevate privileges</li>
          <li>✓ <strong>Rate Limiting Bypass:</strong> Distribute requests across duplicate parameters</li>
          <li>✓ <strong>Logic Bypass:</strong> Override business logic through parameter duplication</li>
        </ul>
      </div>

      {/* Security Recommendations */}
      <div
        style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #c0c0c0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}
      >
        <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>Security Best Practices</h3>
        <ul style={{ color: '#c0c0c0', lineHeight: '1.8' }}>
          <li>✓ Implement consistent parameter parsing across all components (frontend, WAF, backend)</li>
          <li>✓ Reject requests with duplicate parameter names instead of processing them</li>
          <li>✓ Validate and normalize parameter values on server-side before any processing</li>
          <li>✓ Use parameterized queries to prevent HPP-based SQL injection</li>
          <li>✓ Implement strict input validation for all parameters</li>
          <li>✓ Use security headers to prevent cache poisoning attacks</li>
          <li>✓ Log and monitor for suspicious parameter patterns</li>
          <li>✓ Conduct regular security testing for HPP vulnerabilities</li>
          <li>✓ Keep web application firewall rules up-to-date with HPP bypass techniques</li>
          <li>✓ Educate developers on secure parameter handling across different frameworks</li>
        </ul>
      </div>

      {/* Testing Methodology */}
      <div
        style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #c0c0c0',
          borderRadius: '8px',
          padding: '20px'
        }}
      >
        <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>Authorized HPP Security Testing Methodology</h3>
        <ol style={{ color: '#c0c0c0', lineHeight: '1.8' }}>
          <li><strong>Identify Critical Parameters:</strong> Map all input parameters and their security sensitivity</li>
          <li><strong>Test Duplication:</strong> Send duplicate parameters with different values systematically</li>
          <li><strong>Analyze Behavior:</strong> Document which parameter value is processed by each component</li>
          <li><strong>Identify Inconsistencies:</strong> Find mismatches between WAF, proxy, and backend processing</li>
          <li><strong>Craft Payloads:</strong> Create HPP payloads that bypass validation by fragmenting across parameters</li>
          <li><strong>Test Combinations:</strong> Combine HPP with other techniques (XSS, SQLi, cache poisoning)</li>
          <li><strong>Verify Impact:</strong> Confirm actual impact on security mechanisms</li>
          <li><strong>Document Findings:</strong> Record all vulnerabilities with clear proof-of-concept</li>
          <li><strong>Report Responsibly:</strong> Disclose through proper channels with remediation guidance</li>
        </ol>
      </div>
    </div>
  );
}
