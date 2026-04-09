import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Copy01Icon } from 'hugeicons-react';
import {
  getAllCategories,
  getPayloadsByCategory,
  searchPayloads,
  COMMON_VULNERABLE_PARAMETERS,
  DATABASE_INFO,
  LEGAL_DISCLAIMER
} from '../utils/sqlInjectionGenerator';

export default function SQLInjectionGenerator() {
  useSEO(
    'SQL Injection Generator - R0uty\'s Cyber Lab',
    'Educational SQL injection payload generator. Learn about database vulnerabilities with tutorials and examples.'
  );

  const [selectedCategory, setSelectedCategory] = useState('UNION_BASED');
  const [selectedPayload, setSelectedPayload] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [databaseType, setDatabaseType] = useState('MySQL');
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
        <h1>SQL Injection Generator</h1>
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
      <h1>SQL Injection Generator</h1>
      <p style={{ color: '#c0c0c0', marginBottom: '20px' }}>
        Learn SQL injection techniques for authorized security testing and educational purposes.
      </p>

      {/* Database Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#d0d0d0', fontWeight: 'bold' }}>
          Target Database Type:
        </label>
        <select
          value={databaseType}
          onChange={(e) => setDatabaseType(e.target.value)}
          style={{
            backgroundColor: '#2a2a2a',
            color: '#d0d0d0',
            border: '2px solid #c0c0c0',
            padding: '10px',
            borderRadius: '6px',
            width: '100%',
            maxWidth: '300px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {Object.keys(DATABASE_INFO).map((db) => (
            <option key={db} value={db}>
              {db}
            </option>
          ))}
        </select>
      </div>

      {/* Database Info Card */}
      <div
        style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #c0c0c0',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '30px'
        }}
      >
        <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>{databaseType} Commands:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {Object.entries(DATABASE_INFO[databaseType]).map(([key, value]) => (
            <div key={key}>
              <strong style={{ color: '#d0d0d0' }}>{key.replace(/_/g, ' ')}:</strong>
              <div
                style={{
                  backgroundColor: '#1a1a1a',
                  padding: '8px',
                  borderRadius: '4px',
                  marginTop: '5px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#c0c0c0',
                  wordBreak: 'break-all'
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Left: Category & Payload Selection */}
        <div>
          <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>Injection Type</h3>

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

      {/* Common Vulnerable Parameters */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#c0c0c0' }}>Common Vulnerable Parameters</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}
        >
          {COMMON_VULNERABLE_PARAMETERS.map((param, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#2a2a2a',
                border: '2px solid #c0c0c0',
                borderRadius: '8px',
                padding: '15px'
              }}
            >
              <strong style={{ color: '#d0d0d0' }}>{param.name}</strong>
              <p style={{ color: '#a0a0a0', marginTop: '8px', margin: '8px 0 0 0' }}>
                {param.example}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention Tips */}
      <div
        style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #c0c0c0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}
      >
        <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>Prevention Best Practices</h3>
        <ul style={{ color: '#c0c0c0', lineHeight: '1.8' }}>
          <li>✓ Use parameterized queries/prepared statements exclusively</li>
          <li>✓ Validate and sanitize all user input on both client and server</li>
          <li>✓ Implement whitelist validation for expected input types</li>
          <li>✓ Use least privilege database accounts (read-only when possible)</li>
          <li>✓ Enable SQL error suppression in production environments</li>
          <li>✓ Implement Web Application Firewall (WAF) rules</li>
          <li>✓ Perform regular security testing and code reviews</li>
          <li>✓ Keep database software updated with latest security patches</li>
          <li>✓ Log and monitor all database queries for anomalies</li>
          <li>✓ Use ORM frameworks that escape queries by default</li>
        </ul>
      </div>

      {/* Testing Tips */}
      <div
        style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #c0c0c0',
          borderRadius: '8px',
          padding: '20px'
        }}
      >
        <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>Authorized Security Testing Tips</h3>
        <ol style={{ color: '#c0c0c0', lineHeight: '1.8' }}>
          <li>Always start with least invasive techniques (error-based before blind)</li>
          <li>Document all discovered vulnerabilities with proof-of-concept</li>
          <li>Never modify or delete production data during testing</li>
          <li>Create a testing environment backup before running stacked query tests</li>
          <li>Use tools like SQLMap for automated vulnerability scanning</li>
          <li>Report findings through responsible disclosure process</li>
          <li>Provide remediation recommendations in your security report</li>
          <li>Follow your organization's security testing procedures</li>
        </ol>
      </div>
    </div>
  );
}
