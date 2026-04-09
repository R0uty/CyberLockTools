import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Copy01Icon } from 'hugeicons-react';
import {
  getAllCategories,
  getPayloadsByCategory,
  searchPayloads,
  GRAPHQL_ENDPOINTS,
  GRAPHQL_DEFENSE_BYPASS,
  LEGAL_DISCLAIMER
} from '../utils/graphqlInjectionGenerator';

export default function GraphQLInjectionGenerator() {
  useSEO(
    'GraphQL Injection Generator - R0uty\'s Cyber Lab',
    'Educational GraphQL injection and introspection payload generator. Learn about GraphQL API vulnerabilities with tutorials and examples.'
  );

  const [selectedCategory, setSelectedCategory] = useState('INTROSPECTION');
  const [selectedPayload, setSelectedPayload] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetEndpoint, setTargetEndpoint] = useState('/graphql');
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
        <h1>GraphQL Injection Generator</h1>
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
      <h1>GraphQL Injection Generator</h1>
      <p style={{ color: '#c0c0c0', marginBottom: '20px' }}>
        Learn GraphQL security vulnerabilities for authorized penetration testing and educational research.
      </p>

      {/* Target Endpoint Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#d0d0d0', fontWeight: 'bold' }}>
          Common GraphQL Endpoints:
        </label>
        <select
          value={targetEndpoint}
          onChange={(e) => setTargetEndpoint(e.target.value)}
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
          {GRAPHQL_ENDPOINTS.map((endpoint) => (
            <option key={endpoint.path} value={endpoint.path}>
              {endpoint.name} ({endpoint.path})
            </option>
          ))}
        </select>
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

      {/* Defense Bypass Techniques */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#c0c0c0' }}>Common Defense Bypass Techniques</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '15px'
          }}
        >
          {GRAPHQL_DEFENSE_BYPASS.map((defense, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#2a2a2a',
                border: '2px solid #c0c0c0',
                borderRadius: '8px',
                padding: '15px'
              }}
            >
              <strong style={{ color: '#d0d0d0' }}>Defense: {defense.technique}</strong>
              <p style={{ color: '#a0a0a0', marginTop: '8px', margin: '8px 0 0 0' }}>
                <em>Bypass:</em> {defense.bypass}
              </p>
            </div>
          ))}
        </div>
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
          <li>✓ Disable introspection queries in production environments</li>
          <li>✓ Implement proper authentication and authorization checks on all resolvers</li>
          <li>✓ Set query complexity limits and enforce depth restrictions</li>
          <li>✓ Implement rate limiting per user, IP, and endpoint</li>
          <li>✓ Validate and sanitize all input arguments and variables</li>
          <li>✓ Use field-level permissions for sensitive data access</li>
          <li>✓ Implement query timeout to prevent DoS attacks</li>
          <li>✓ Log all query attempts, especially introspection and failed auth</li>
          <li>✓ Use WhiteList for allowed queries in high-security environments</li>
          <li>✓ Monitor for unusual query patterns and resource consumption</li>
          <li>✓ Keep GraphQL libraries and dependencies updated</li>
          <li>✓ Conduct regular security audits and penetration testing</li>
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
        <h3 style={{ color: '#c0c0c0', marginTop: 0 }}>Authorized GraphQL Security Testing Methodology</h3>
        <ol style={{ color: '#c0c0c0', lineHeight: '1.8' }}>
          <li><strong>Reconnaissance:</strong> Identify GraphQL endpoints and enable introspection if possible</li>
          <li><strong>Schema Enumeration:</strong> Map all types, queries, mutations, and subscriptions</li>
          <li><strong>Authentication Analysis:</strong> Test for auth bypass in queries and mutations</li>
          <li><strong>Authorization Testing:</strong> Attempt accessing resources you shouldn't have access to</li>
          <li><strong>Input Validation:</strong> Test fuzzing on all input fields and arguments</li>
          <li><strong>DoS Testing:</strong> Test query complexity, batching, and recursion limits</li>
          <li><strong>Business Logic:</strong> Test mutations for improper privilege escalation</li>
          <li><strong>Data Exposure:</strong> Look for sensitive data in query results or error messages</li>
          <li><strong>Documentation:</strong> Record all findings with proof of concept</li>
          <li><strong>Disclosure:</strong> Report through responsible disclosure channel</li>
        </ol>
      </div>
    </div>
  );
}
