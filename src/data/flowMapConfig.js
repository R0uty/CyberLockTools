export const STORAGE_STAGE_KEY = 'flow-map-current-stage'
export const STORAGE_REVEALED_KEY = 'flow-map-revealed-stage'
export const STORAGE_TOOL_KEY = 'flow-map-selected-tool'
export const STORAGE_FEEDBACK_KEY = 'flow-map-feedback'
export const STORAGE_FLOW_KEY = 'flow-map-selected-flow'
export const STORAGE_ACTION_KEY = 'flow-map-selected-action'
export const STORAGE_OUTCOME_KEY = 'flow-map-selected-outcome'
export const STORAGE_OUTCOME_SIGNAL_KEY = 'flow-map-outcome-signal'
export const STORAGE_OUTCOME_PROFILE_KEY = 'flow-map-outcome-profile'
export const STORAGE_NOTES_KEY = 'flow-map-notes'
export const STORAGE_STAGE_EVIDENCE_KEY = 'flow-map-stage-evidence'
export const STORAGE_COMPLETED_KEY = 'flow-map-completed'
export const STORAGE_IN_PROGRESS_KEY = 'flow-map-in-progress'
export const STORAGE_STAGE_HISTORY_KEY = 'flow-map-stage-history'
export const STORAGE_DECISION_HISTORY_KEY = 'flow-map-decision-history'
export const STORAGE_TOOL_FLOW_ORIGIN_KEY = 'flow-map-tool-origin'

export const MIN_ZOOM = 0.8
export const MAX_ZOOM = 1.8
export const ZOOM_STEP = 0.15
export const DEFAULT_ZOOM = 1
export const BASE_SCENE_WIDTH = 2200
export const BASE_SCENE_HEIGHT = 1240

export const FLOW_GROUPS = [
  ['recon', 'Reconnaissance'],
  ['enumeration', 'Enumeration'],
  ['entry-point', 'Entry Points'],
  ['testing', 'Testing'],
  ['vulnerability', 'Vulnerability Validation'],
  ['exploitation', 'Exploitation & Reporting'],
  ['analysis', 'Analysis'],
  ['ctf', 'CTF & Capture the Flag']
]

export const BACKGROUND_STARS = [
  { x: 8, y: 14, size: 2, opacity: 0.28 },
  { x: 18, y: 66, size: 2, opacity: 0.2 },
  { x: 27, y: 24, size: 3, opacity: 0.18 },
  { x: 39, y: 78, size: 2, opacity: 0.24 },
  { x: 48, y: 16, size: 2, opacity: 0.22 },
  { x: 57, y: 64, size: 3, opacity: 0.16 },
  { x: 69, y: 20, size: 2, opacity: 0.24 },
  { x: 78, y: 72, size: 2, opacity: 0.2 },
  { x: 86, y: 30, size: 3, opacity: 0.18 },
  { x: 93, y: 12, size: 2, opacity: 0.22 }
]

export const FLOWS = {
  decode: {
    label: 'Decode Flow',
    group: 'analysis',
    summary: 'Follow a suspicious value from first glance to readable output using lightweight decoders.',
    suggestedSkills: [
      { name: 'Encoding Identification', difficulty: 'beginner', reason: 'Quickly recognizing Base64, URL encoding, hex, and ROT patterns saves time during analysis.' },
      { name: 'Multi-Layer Decoding', difficulty: 'intermediate', reason: 'Some values are encoded multiple times; knowing when to chain decoders is key.' },
      { name: 'Hash vs Encoding Recognition', difficulty: 'beginner', reason: 'Avoids wasting time trying to decode values that are actually hashed and irreversible.' }
    ],
    tools: [
      { name: 'Browser DevTools', purpose: 'Inspect cookies, URL parameters, and hidden form values that may contain encoded data.' },
      { name: 'Burp Suite', purpose: 'Use the Decoder tab to try multiple encoding schemes on intercepted values quickly.' },
      { name: 'curl', purpose: 'Fetch raw responses to capture encoded values before the browser processes them.' },
      { name: 'Base64 Encoder/Decoder', purpose: 'Encode or decode Base64 strings directly in the browser.', toolTitle: 'Base64' },
      { name: 'URL Encoder/Decoder', purpose: 'Decode percent-encoded URL values and re-encode for comparison.', toolTitle: 'URL Encoder' },
      { name: 'HTML Encoder/Decoder', purpose: 'Decode HTML entities that may obscure injected content.', toolTitle: 'HTML Encoder' },
      { name: 'ROT Cipher', purpose: 'Brute-force ROT variants (ROT13, ROT47) on suspicious string values.', toolTitle: 'ROT' },
      { name: 'Number Base Converter', purpose: 'Convert hex/octal/binary values found in responses or tokens.', toolTitle: 'Number Base Converter' }
    ],
    stages: ['start', 'encoded', 'decode', 'result', 'success'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'encoded', label: 'Encoded?', x: 34, y: 30 },
      { id: 'decode', label: 'Decode', x: 62, y: 30 },
      { id: 'result', label: 'Result', x: 76, y: 50 },
      { id: 'success', label: 'Success', x: 88, y: 50 }
    ],
    connections: [
      ['start', 'encoded'],
      ['encoded', 'decode'],
      ['decode', 'result'],
      ['result', 'success']
    ]
  },
  login: {
    label: 'Login Entry Flow',
    group: 'entry-point',
    summary: 'Assess a discovered login page as a possible entry point and keep the next branch obvious as responses change.',
    suggestedSkills: [
      { name: 'User Enumeration', difficulty: 'beginner', reason: 'Helps confirm whether login behavior leaks valid usernames.' },
      { name: 'Rate Limiting Bypass', difficulty: 'intermediate', reason: 'Useful when testing repeated auth attempts and lockout controls.' },
      { name: 'Business Logic Testing', difficulty: 'advanced', reason: 'Supports deeper checks around login workflow assumptions and bypass paths.' }
    ],
    tools: [
      { name: 'Browser DevTools', purpose: 'Inspect form behavior, requests, and front-end validation before deeper testing.' },
      { name: 'Burp Suite', purpose: 'Intercept and replay login requests so you can compare auth behavior carefully.' },
      { name: 'curl', purpose: 'Recreate simple auth requests outside the browser when you want cleaner response comparisons.' }
    ],
    stages: ['start', 'login-page', 'test-login', 'result', 'analyze-error', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'login-page', label: 'Login Page', x: 34, y: 30 },
      { id: 'test-login', label: 'Test Login', x: 58, y: 30 },
      { id: 'result', label: 'Result', x: 74, y: 50 },
      { id: 'analyze-error', label: 'Analyze Error', x: 84, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 58 }
    ],
    connections: [
      ['start', 'login-page'],
      ['login-page', 'test-login'],
      ['test-login', 'result'],
      ['result', 'analyze-error'],
      ['analyze-error', 'next-step']
    ]
  },
  discovery: {
    label: 'Discovery Flow',
    group: 'recon',
    summary: 'Start from a newly found page or endpoint, enumerate hidden content, and branch into follow-up investigation with common recon tooling.',
    suggestedSkills: [
      { name: 'Port Scanning', difficulty: 'beginner', reason: 'Establishes exposed services before path/content probing.' },
      { name: 'Subdomain Enumeration', difficulty: 'intermediate', reason: 'Expands reachable attack surface linked to the discovered target.' },
      { name: 'Directory Bruteforcing', difficulty: 'beginner', reason: 'Directly supports hidden route and file discovery during recon.' }
    ],
    tools: [
      { name: 'Nmap', purpose: 'Find open ports, services, and basic version details before you start guessing paths.' },
      { name: 'ffuf', purpose: 'Run fast wordlist-based discovery for directories, files, vhosts, and parameter fuzzing.' },
      { name: 'dirb', purpose: 'Quickly brute-force common directories and filenames when you want a simpler pass.' },
      { name: 'curl', purpose: 'Inspect status codes, headers, redirects, and raw responses from anything you discover.' }
    ],
    stages: ['start', 'web-page-found', 'discovery', 'enumerate', 'result', 'investigate', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'web-page-found', label: 'Web Page Found', x: 30, y: 30 },
      { id: 'discovery', label: 'Discovery', x: 50, y: 26 },
      { id: 'enumerate', label: 'Enumerate', x: 68, y: 32 },
      { id: 'result', label: 'Result', x: 78, y: 50 },
      { id: 'investigate', label: 'Investigate', x: 86, y: 26 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'web-page-found'],
      ['web-page-found', 'discovery'],
      ['discovery', 'enumerate'],
      ['enumerate', 'result'],
      ['result', 'investigate'],
      ['investigate', 'next-step']
    ]
  },
  enumeration: {
    label: 'Enumeration Flow',
    group: 'enumeration',
    summary: 'Identify exposed services, enumerate them with the right protocol-aware tools, and decide which finding becomes the next entry point.',
    suggestedSkills: [
      { name: 'Banner Grabbing', difficulty: 'beginner', reason: 'Improves service and version identification quality early.' },
      { name: 'JavaScript Endpoint Analysis', difficulty: 'intermediate', reason: 'Adds hidden endpoint and token discovery to enumeration output.' },
      { name: 'API Schema Discovery', difficulty: 'intermediate', reason: 'Useful when enumeration reveals API-capable services.' }
    ],
    tools: [
      { name: 'Nmap', purpose: 'Identify exposed ports, service versions, and useful NSE script output before deeper enumeration.' },
      { name: 'enum4linux-ng', purpose: 'Pull users, shares, and policy details from SMB-heavy targets.' },
      { name: 'smbclient', purpose: 'Browse accessible SMB shares and validate whether files or directories can be reached directly.' },
      { name: 'snmpwalk', purpose: 'Dump readable SNMP data when the target exposes community strings or weak SNMP access.' },
      { name: 'ldapsearch', purpose: 'Query LDAP-backed services for users, groups, and directory structure.' },
      { name: 'LDAP Injection Generator', purpose: 'Generate LDAP injection payloads when the target exposes LDAP-backed authentication or search.', toolTitle: 'LDAP Injection Generator' },
      { name: 'IP Subnet Calculator', purpose: 'Calculate network ranges and CIDR blocks during internal network mapping.', toolTitle: 'IP Subnet Calculator' }
    ],
    stages: ['start', 'service-found', 'identify-service', 'enumerate-service', 'result', 'inspect-findings', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'service-found', label: 'Service Found', x: 28, y: 30 },
      { id: 'identify-service', label: 'Identify Service', x: 48, y: 26 },
      { id: 'enumerate-service', label: 'Enumerate Service', x: 68, y: 30 },
      { id: 'result', label: 'Result', x: 78, y: 50 },
      { id: 'inspect-findings', label: 'Inspect Findings', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'service-found'],
      ['service-found', 'identify-service'],
      ['identify-service', 'enumerate-service'],
      ['enumerate-service', 'result'],
      ['result', 'inspect-findings'],
      ['inspect-findings', 'next-step']
    ]
  },
  input: {
    label: 'Input Testing Flow',
    group: 'testing',
    summary: 'Test how a field handles normal and unusual values, compare responses, and decide which behavior is worth deeper follow-up.',
    suggestedSkills: [
      { name: 'XSS Detection', difficulty: 'beginner', reason: 'Natural follow-up when reflected input behavior changes.' },
      { name: 'SQL Injection Testing', difficulty: 'intermediate', reason: 'Applies when input handling indicates backend query interaction.' },
      { name: 'SSTI Detection', difficulty: 'intermediate', reason: 'Useful for templated render paths reacting to user input.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay parameter changes quickly and compare how the target handles each input.' },
      { name: 'Browser DevTools', purpose: 'Watch DOM, console, and network changes while the page processes your input.' },
      { name: 'curl', purpose: 'Send controlled requests with isolated values when you want cleaner server-side comparisons.' },
      { name: 'SQL Injection Generator', purpose: 'Generate SQL injection payloads for user-controlled fields.', toolTitle: 'SQL Injection Generator' },
      { name: 'XSS Generator', purpose: 'Generate XSS payloads tailored to the reflection context.', toolTitle: 'XSS Generator' },
      { name: 'SSTI Generator', purpose: 'Generate SSTI detection and exploitation payloads.', toolTitle: 'SSTI Generator & Analyzer' },
      { name: 'NoSQL Injection Generator', purpose: 'Generate NoSQL injection payloads when a non-relational backend is suspected.', toolTitle: 'NoSQL Injection Generator' },
      { name: 'Command Injection Generator', purpose: 'Generate OS command injection payloads for input fields that call system commands.', toolTitle: 'Command Injection Generator' }
    ],
    stages: ['start', 'input-field-found', 'test-input', 'response-change', 'analyze-behavior', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'input-field-found', label: 'Input Field Found', x: 30, y: 30 },
      { id: 'test-input', label: 'Test Input', x: 54, y: 28 },
      { id: 'response-change', label: 'Response Change', x: 72, y: 46 },
      { id: 'analyze-behavior', label: 'Analyze Behavior', x: 84, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'input-field-found'],
      ['input-field-found', 'test-input'],
      ['test-input', 'response-change'],
      ['response-change', 'analyze-behavior'],
      ['analyze-behavior', 'next-step']
    ]
  },
  api: {
    label: 'API Testing Flow',
    group: 'testing',
    summary: 'Assess an API endpoint from first discovery to risk classification by validating auth, input handling, and response behavior.',
    suggestedSkills: [
      { name: 'IDOR Testing', difficulty: 'intermediate', reason: 'Core API object-level authorization check during endpoint validation.' },
      { name: 'Mass Assignment Testing', difficulty: 'intermediate', reason: 'Useful when request bodies contain mutable user-controlled fields.' },
      { name: 'Broken Function Level Auth', difficulty: 'intermediate', reason: 'Supports role-based endpoint authorization validation.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay API requests with controlled changes and compare status, body, and headers quickly.' },
      { name: 'Postman', purpose: 'Build repeatable request collections for endpoint, auth, and schema testing.' },
      { name: 'curl', purpose: 'Run minimal reproducible API requests from the terminal for clean before/after comparisons.' },
      { name: 'GraphQL Injection Generator', purpose: 'Generate GraphQL injection and introspection payloads for GraphQL API endpoints.', toolTitle: 'GraphQL Injection Generator' },
      { name: 'HTTP Headers Parser', purpose: 'Parse and inspect response headers for security misconfigurations.', toolTitle: 'HTTP Headers Parser' },
      { name: 'HTTP Parameter Pollution Generator', purpose: 'Generate HPP payloads to bypass filters and test parameter duplication handling.', toolTitle: 'HTTP Parameter Pollution Generator' }
    ],
    stages: ['start', 'api-endpoint-found', 'inspect-spec', 'test-auth', 'response-review', 'classify-risk', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'api-endpoint-found', label: 'API Endpoint Found', x: 28, y: 30 },
      { id: 'inspect-spec', label: 'Inspect Spec', x: 48, y: 26 },
      { id: 'test-auth', label: 'Test Auth', x: 66, y: 30 },
      { id: 'response-review', label: 'Response Review', x: 78, y: 50 },
      { id: 'classify-risk', label: 'Classify Risk', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'api-endpoint-found'],
      ['api-endpoint-found', 'inspect-spec'],
      ['inspect-spec', 'test-auth'],
      ['test-auth', 'response-review'],
      ['response-review', 'classify-risk'],
      ['classify-risk', 'next-step']
    ]
  },
  response: {
    label: 'Response Analysis Flow',
    group: 'analysis',
    summary: 'Inspect response data, identify useful values, and decide what to investigate next.',
    suggestedSkills: [
      { name: 'Header Analysis', difficulty: 'beginner', reason: 'Reveals security headers, caching policy, and server fingerprints in every response.' },
      { name: 'Token Identification', difficulty: 'intermediate', reason: 'Helps classify embedded tokens, session IDs, and encoded values for follow-up testing.' },
      { name: 'Data Leakage Assessment', difficulty: 'intermediate', reason: 'Spots excessive data exposure, debug fields, and internal references in response bodies.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay requests and compare response differences field by field.' },
      { name: 'Browser DevTools', purpose: 'Inspect response headers, body, and timing in the Network tab.' },
      { name: 'curl', purpose: 'Fetch raw responses with full headers for clean comparison.' }
    ],
    stages: ['start', 'response-data-found', 'analyze-data', 'interesting-data', 'investigate-value', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'response-data-found', label: 'Response Data Found', x: 28, y: 30 },
      { id: 'analyze-data', label: 'Analyze Data', x: 50, y: 26 },
      { id: 'interesting-data', label: 'Interesting Data', x: 70, y: 42 },
      { id: 'investigate-value', label: 'Investigate Value', x: 84, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'response-data-found'],
      ['response-data-found', 'analyze-data'],
      ['analyze-data', 'interesting-data'],
      ['interesting-data', 'investigate-value'],
      ['investigate-value', 'next-step']
    ]
  },
  request: {
    label: 'Request Tampering Flow',
    group: 'vulnerability',
    summary: 'Modify observed requests, compare server reactions, and decide whether the behavior points to a real vulnerability path.',
    suggestedSkills: [
      { name: 'HTTP Request Smuggling', difficulty: 'advanced', reason: 'Advanced option when request parsing behavior looks inconsistent.' },
      { name: 'Open Redirect Testing', difficulty: 'beginner', reason: 'Fast follow-up for manipulated redirect-related parameters.' },
      { name: 'Parameter Discovery', difficulty: 'intermediate', reason: 'Finds hidden request inputs worth tampering with next.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Modify one request component at a time and compare responses with minimal noise.' },
      { name: 'curl', purpose: 'Reproduce and script request changes once you know which fields matter.' },
      { name: 'Browser DevTools', purpose: 'Inspect the original request shape, tokens, and front-end hints before tampering.' },
      { name: 'SSRF Generator', purpose: 'Generate SSRF payloads for URL parameters that may trigger server-side fetches.', toolTitle: 'SSRF Generator' },
      { name: 'HTTP Parameter Pollution Generator', purpose: 'Generate HPP payloads to test how duplicate parameters are parsed server-side.', toolTitle: 'HTTP Parameter Pollution Generator' },
      { name: 'URL Encoder', purpose: 'Encode and fuzz URL values to bypass WAF rules or parameter validation.', toolTitle: 'URL Encoder' }
    ],
    stages: ['start', 'http-request-observed', 'tamper-request', 'response-changed', 'analyze-impact', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'http-request-observed', label: 'HTTP Request Observed', x: 28, y: 30 },
      { id: 'tamper-request', label: 'Tamper Request', x: 52, y: 28 },
      { id: 'response-changed', label: 'Response Changed?', x: 72, y: 46 },
      { id: 'analyze-impact', label: 'Analyze Impact', x: 84, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'http-request-observed'],
      ['http-request-observed', 'tamper-request'],
      ['tamper-request', 'response-changed'],
      ['response-changed', 'analyze-impact'],
      ['analyze-impact', 'next-step']
    ]
  },
  authz: {
    label: 'Authorization Testing Flow',
    group: 'vulnerability',
    summary: 'Validate whether role and ownership checks are enforced by replaying privileged actions with lower-privileged contexts.',
    suggestedSkills: [
      { name: 'IDOR Testing', difficulty: 'intermediate', reason: 'Primary ownership-boundary validation method for object access.' },
      { name: 'Privilege Escalation', difficulty: 'advanced', reason: 'Helps reason about role boundary failures and impact scope.' },
      { name: 'Broken Function Level Auth', difficulty: 'intermediate', reason: 'Maps directly to missing endpoint-level authorization checks.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Swap tokens, IDs, and role-linked fields while preserving request shape.' },
      { name: 'Browser DevTools', purpose: 'Track session state, role hints, and front-end restrictions that may not exist server-side.' },
      { name: 'curl', purpose: 'Reproduce authorization checks as minimal requests for clean documentation.' }
    ],
    stages: ['start', 'privileged-action-found', 'baseline-request', 'role-switch-test', 'access-result', 'confirm-impact', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'privileged-action-found', label: 'Privileged Action Found', x: 28, y: 30 },
      { id: 'baseline-request', label: 'Baseline Request', x: 48, y: 26 },
      { id: 'role-switch-test', label: 'Role Switch Test', x: 68, y: 30 },
      { id: 'access-result', label: 'Access Result', x: 78, y: 50 },
      { id: 'confirm-impact', label: 'Confirm Impact', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'privileged-action-found'],
      ['privileged-action-found', 'baseline-request'],
      ['baseline-request', 'role-switch-test'],
      ['role-switch-test', 'access-result'],
      ['access-result', 'confirm-impact'],
      ['confirm-impact', 'next-step']
    ]
  },
  exploitation: {
    label: 'Controlled Exploitation Flow',
    group: 'exploitation',
    summary: 'Move from a confirmed finding to a controlled proof-of-impact in an authorized environment without losing containment or evidence.',
    suggestedSkills: [
      { name: 'PoC Writing', difficulty: 'intermediate', reason: 'Critical for proving impact with clear, reproducible evidence.' },
      { name: 'Vulnerability Severity Rating', difficulty: 'beginner', reason: 'Helps classify impact accurately after controlled validation.' },
      { name: 'Remediation Advice', difficulty: 'beginner', reason: 'Connects confirmed impact to actionable developer fixes.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay the exact proof request in a controlled way and confirm only the intended impact.' },
      { name: 'curl', purpose: 'Capture a minimal reproducible request that demonstrates the issue cleanly for verification.' },
      { name: 'Browser DevTools', purpose: 'Observe application-side effects, responses, and state changes while you validate impact.' },
      { name: 'Reverse Shell Generator', purpose: 'Generate reverse shell payloads for RCE confirmation in authorized environments.', toolTitle: 'Reverse Shell Generator' }
    ],
    stages: ['start', 'confirmed-finding', 'prepare-validation', 'execute-safely', 'impact-observed', 'document-impact', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'confirmed-finding', label: 'Confirmed Finding', x: 28, y: 30 },
      { id: 'prepare-validation', label: 'Prepare Validation', x: 48, y: 26 },
      { id: 'execute-safely', label: 'Execute Safely', x: 68, y: 30 },
      { id: 'impact-observed', label: 'Impact Observed', x: 78, y: 50 },
      { id: 'document-impact', label: 'Document Impact', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'confirmed-finding'],
      ['confirmed-finding', 'prepare-validation'],
      ['prepare-validation', 'execute-safely'],
      ['execute-safely', 'impact-observed'],
      ['impact-observed', 'document-impact'],
      ['document-impact', 'next-step']
    ]
  },
  'info-disclosure': {
    label: 'Information Disclosure Flow',
    group: 'recon',
    summary: 'Find and assess leaked information such as source comments, debug endpoints, exposed config files, error traces, and version headers.',
    suggestedSkills: [
      { name: 'Source Code Review', difficulty: 'beginner', reason: 'Catches developer comments, hardcoded secrets, and logic hints in client-side code.' },
      { name: 'Git Repository Mining', difficulty: 'intermediate', reason: 'Exposed .git directories can leak full source history, credentials, and internal paths.' },
      { name: 'Error-Based Information Gathering', difficulty: 'beginner', reason: 'Stack traces and verbose errors reveal frameworks, file paths, and database details.' }
    ],
    tools: [
      { name: 'Browser DevTools', purpose: 'Inspect page source, console output, and network responses for leaked data.' },
      { name: 'curl', purpose: 'Probe common sensitive paths like /.git/HEAD, /.env, /debug, and compare responses.' },
      { name: 'ffuf', purpose: 'Fuzz for backup files, config endpoints, and debug routes using targeted wordlists.' }
    ],
    stages: ['start', 'source-found', 'inspect-source', 'sensitive-data', 'assess-exposure', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'source-found', label: 'Source Found', x: 28, y: 30 },
      { id: 'inspect-source', label: 'Inspect Source', x: 48, y: 26 },
      { id: 'sensitive-data', label: 'Sensitive Data?', x: 68, y: 40 },
      { id: 'assess-exposure', label: 'Assess Exposure', x: 82, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'source-found'],
      ['source-found', 'inspect-source'],
      ['inspect-source', 'sensitive-data'],
      ['sensitive-data', 'assess-exposure'],
      ['assess-exposure', 'next-step']
    ]
  },
  session: {
    label: 'Session Testing Flow',
    group: 'testing',
    summary: 'Evaluate session management by inspecting cookie flags, testing fixation and expiry, and validating CSRF protections.',
    suggestedSkills: [
      { name: 'Cookie Security Analysis', difficulty: 'beginner', reason: 'Checks Secure, HttpOnly, SameSite flags and cookie scope for session tokens.' },
      { name: 'CSRF Testing', difficulty: 'intermediate', reason: 'Validates whether state-changing actions enforce anti-forgery tokens correctly.' },
      { name: 'Session Fixation', difficulty: 'intermediate', reason: 'Tests whether the application rotates session IDs after authentication.' }
    ],
    tools: [
      { name: 'Browser DevTools', purpose: 'Inspect cookie attributes, storage, and session behavior across tabs and domains.' },
      { name: 'Burp Suite Repeater', purpose: 'Replay requests with swapped or expired session tokens to test enforcement.' },
      { name: 'curl', purpose: 'Send requests with crafted cookie headers to verify server-side session handling.' }
    ],
    stages: ['start', 'session-captured', 'inspect-session', 'test-session', 'session-result', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'session-captured', label: 'Session Captured', x: 28, y: 30 },
      { id: 'inspect-session', label: 'Inspect Session', x: 48, y: 26 },
      { id: 'test-session', label: 'Test Session', x: 68, y: 34 },
      { id: 'session-result', label: 'Session Result', x: 80, y: 50 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'session-captured'],
      ['session-captured', 'inspect-session'],
      ['inspect-session', 'test-session'],
      ['test-session', 'session-result'],
      ['session-result', 'next-step']
    ]
  },
  upload: {
    label: 'File Upload Testing Flow',
    group: 'entry-point',
    summary: 'Test file upload endpoints for extension bypass, MIME confusion, path traversal in filenames, oversized payloads, and content-based execution.',
    suggestedSkills: [
      { name: 'File Type Bypass', difficulty: 'intermediate', reason: 'Tests whether the server relies on extension or Content-Type alone for filtering.' },
      { name: 'Webshell Detection', difficulty: 'intermediate', reason: 'Validates whether uploaded code can be executed through the web server.' },
      { name: 'Content-Type Manipulation', difficulty: 'beginner', reason: 'Changing MIME headers can bypass client-side and weak server-side checks.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Modify filename, Content-Type, and body in upload requests to test server filtering.' },
      { name: 'curl', purpose: 'Script upload attempts with controlled filenames and MIME types for clean comparisons.' },
      { name: 'Browser DevTools', purpose: 'Inspect client-side upload validation and observe where uploaded files are served.' },
      { name: 'Path Traversal Generator', purpose: 'Generate path traversal payloads for filenames to test directory escape via upload.', toolTitle: 'Path Traversal Generator' },
      { name: 'XXE Generator', purpose: 'Generate XXE payloads for XML-parsing upload endpoints (SVG, DOCX, etc.).', toolTitle: 'XXE Generator' }
    ],
    stages: ['start', 'upload-found', 'test-upload', 'upload-result', 'analyze-upload', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'upload-found', label: 'Upload Found', x: 28, y: 30 },
      { id: 'test-upload', label: 'Test Upload', x: 48, y: 26 },
      { id: 'upload-result', label: 'Upload Result', x: 68, y: 40 },
      { id: 'analyze-upload', label: 'Analyze Upload', x: 82, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'upload-found'],
      ['upload-found', 'test-upload'],
      ['test-upload', 'upload-result'],
      ['upload-result', 'analyze-upload'],
      ['analyze-upload', 'next-step']
    ]
  },

  jwt: {
    label: 'JWT Attack Flow',
    group: 'testing',
    summary: 'Inspect a discovered JWT, identify the signing algorithm, and test for alg:none bypass, weak secret, and key confusion attacks to forge a valid token.',
    suggestedSkills: [
      { name: 'JWT Structure Analysis', difficulty: 'beginner', reason: 'Understanding header, payload, and signature roles is required before any attack attempt.' },
      { name: 'Algorithm Confusion Attacks', difficulty: 'intermediate', reason: 'RS256-to-HS256 key confusion and alg:none bypass are the most common JWT weaknesses.' },
      { name: 'Weak Secret Cracking', difficulty: 'intermediate', reason: 'Many deployed JWTs use predictable HS256 secrets crackable with short wordlists.' }
    ],
    tools: [
      { name: 'jwt.io', purpose: 'Decode JWT header and payload, inspect claims, and manually craft test tokens.' },
      { name: 'hashcat / john', purpose: 'Crack weak HMAC secrets by brute-forcing the signature against known wordlists.' },
      { name: 'Burp Suite Repeater', purpose: 'Replay requests with forged or tampered JWTs and compare access outcomes.' },
      { name: 'JWT Debugger', purpose: 'Decode and inspect JWT header, payload, and signature fields inline.', toolTitle: 'JWT Debugger' },
      { name: 'JWT Encoder', purpose: 'Encode forged JWT tokens with custom claims and selected signing algorithms.', toolTitle: 'JWT Encoder' },
      { name: 'Base64 Decoder', purpose: 'Manually decode JWT segments to inspect raw claim content.', toolTitle: 'Base64' }
    ],
    stages: ['start', 'jwt-discovered', 'inspect-claims', 'test-attacks', 'forge-token', 'confirm-access', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'jwt-discovered', label: 'JWT Discovered', x: 28, y: 30 },
      { id: 'inspect-claims', label: 'Inspect Claims', x: 48, y: 26 },
      { id: 'test-attacks', label: 'Test Attacks', x: 66, y: 30 },
      { id: 'forge-token', label: 'Forge Token', x: 78, y: 50 },
      { id: 'confirm-access', label: 'Confirm Access', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'jwt-discovered'],
      ['jwt-discovered', 'inspect-claims'],
      ['inspect-claims', 'test-attacks'],
      ['test-attacks', 'forge-token'],
      ['forge-token', 'confirm-access'],
      ['confirm-access', 'next-step']
    ]
  },

  xxe: {
    label: 'XXE Injection Flow',
    group: 'vulnerability',
    summary: 'Identify XML parsing endpoints, inject external entity declarations, and probe for file read, SSRF, and out-of-band exfiltration primitives.',
    suggestedSkills: [
      { name: 'XML / DTD Structure', difficulty: 'beginner', reason: 'Understanding DOCTYPE declarations and entity references is the foundation of XXE.' },
      { name: 'Out-of-Band XXE', difficulty: 'intermediate', reason: 'Blind XXE via DNS/HTTP callbacks is the most reliable way to confirm impact without visible output.' },
      { name: 'XXE-to-SSRF Pivot', difficulty: 'advanced', reason: 'SYSTEM entities can target internal services — critical for post-exploitation scope expansion.' }
    ],
    tools: [
      { name: 'XXE Generator', purpose: 'Generate classic, blind, and OOB XXE payloads for common attack primitives.', toolTitle: 'XXE Generator' },
      { name: 'Burp Suite Repeater', purpose: 'Replay modified XML payloads and diff server responses for entity inclusion indicators.' },
      { name: 'interactsh / Burp Collaborator', purpose: 'Catch out-of-band DNS/HTTP callbacks to confirm blind XXE without visible output.' }
    ],
    stages: ['start', 'xml-input-found', 'inject-entity', 'test-file-read', 'test-ssrf-dtd', 'oob-exfil', 'confirm-xxe', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'xml-input-found', label: 'XML Input Found', x: 20, y: 35 },
      { id: 'inject-entity', label: 'Inject Entity', x: 38, y: 25 },
      { id: 'test-file-read', label: 'Test File Read', x: 56, y: 20 },
      { id: 'test-ssrf-dtd', label: 'Test SSRF via DTD', x: 70, y: 35 },
      { id: 'oob-exfil', label: 'OOB Exfil', x: 80, y: 52 },
      { id: 'confirm-xxe', label: 'Confirm XXE', x: 88, y: 30 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 65 }
    ],
    connections: [
      ['start', 'xml-input-found'],
      ['xml-input-found', 'inject-entity'],
      ['inject-entity', 'test-file-read'],
      ['test-file-read', 'test-ssrf-dtd'],
      ['test-ssrf-dtd', 'oob-exfil'],
      ['oob-exfil', 'confirm-xxe'],
      ['confirm-xxe', 'next-step']
    ]
  },

  ssrf: {
    label: 'SSRF Flow',
    group: 'vulnerability',
    summary: 'Identify server-side URL fetch parameters, probe internal network targets, enumerate cloud metadata services, and confirm unauthorized data access via SSRF.',
    suggestedSkills: [
      { name: 'URL Parameter Identification', difficulty: 'beginner', reason: 'SSRF lives in parameters that accept URLs or hostnames — knowing where to look is the first step.' },
      { name: 'Cloud Metadata Endpoints', difficulty: 'intermediate', reason: 'AWS/GCP/Azure metadata IPs are the highest-impact SSRF targets and must be tested methodically.' },
      { name: 'Blind SSRF Detection', difficulty: 'intermediate', reason: 'Many SSRF findings produce no visible output — OOB interaction is the primary confirmation method.' }
    ],
    tools: [
      { name: 'SSRF Generator', purpose: 'Generate SSRF payloads targeting localhost, internal IPs, and cloud metadata endpoints.', toolTitle: 'SSRF Generator' },
      { name: 'Burp Suite Collaborator / interactsh', purpose: 'Detect blind SSRF via DNS or HTTP callbacks from the vulnerable server.' },
      { name: 'Burp Suite Repeater', purpose: 'Replay SSRF payloads and compare response body, size, and latency for internal host indicators.' }
    ],
    stages: ['start', 'url-param-found', 'probe-loopback', 'probe-cloud-metadata', 'internal-host-scan', 'confirm-ssrf', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'url-param-found', label: 'URL Param Found', x: 22, y: 35 },
      { id: 'probe-loopback', label: 'Probe Loopback', x: 40, y: 22 },
      { id: 'probe-cloud-metadata', label: 'Probe Cloud Metadata', x: 60, y: 22 },
      { id: 'internal-host-scan', label: 'Internal Host Scan', x: 75, y: 38 },
      { id: 'confirm-ssrf', label: 'Confirm SSRF', x: 85, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'url-param-found'],
      ['url-param-found', 'probe-loopback'],
      ['probe-loopback', 'probe-cloud-metadata'],
      ['probe-cloud-metadata', 'internal-host-scan'],
      ['internal-host-scan', 'confirm-ssrf'],
      ['confirm-ssrf', 'next-step']
    ]
  },

  cors: {
    label: 'CORS Misconfiguration Flow',
    group: 'vulnerability',
    summary: 'Inspect CORS response headers, test origin reflection and wildcard policies, and confirm whether credentialed cross-origin requests can leak authenticated data.',
    suggestedSkills: [
      { name: 'CORS Header Analysis', difficulty: 'beginner', reason: 'Understanding Access-Control-Allow-Origin and Access-Control-Allow-Credentials is the foundation of CORS testing.' },
      { name: 'Origin Reflection Testing', difficulty: 'intermediate', reason: 'Many misconfigured servers reflect the incoming Origin header verbatim, enabling any site to make credentialed requests.' },
      { name: 'Null Origin Bypass', difficulty: 'intermediate', reason: 'Allowlisting the null origin is exploitable from sandboxed iframes and is a commonly overlooked misconfiguration.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay requests with modified Origin headers and compare Access-Control-Allow-Origin values.' },
      { name: 'HTTP Headers Parser', purpose: 'Parse and inspect CORS response headers inline.', toolTitle: 'HTTP Headers Parser' },
      { name: 'CORS Analyzer', purpose: 'Analyze Access-Control-* headers against a supplied Origin and credential mode in the browser.', toolTitle: 'CORS Analyzer' },
      { name: 'curl', purpose: 'Test origin reflection with custom -H "Origin: ..." headers from the command line.' }
    ],
    stages: ['start', 'cors-headers-observed', 'test-wildcard', 'test-null-origin', 'test-reflection', 'confirm-cors', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'cors-headers-observed', label: 'CORS Headers Observed', x: 20, y: 35 },
      { id: 'test-wildcard', label: 'Test Wildcard', x: 38, y: 22 },
      { id: 'test-null-origin', label: 'Test Null Origin', x: 55, y: 18 },
      { id: 'test-reflection', label: 'Test Reflection', x: 70, y: 30 },
      { id: 'confirm-cors', label: 'Confirm CORS', x: 82, y: 25 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'cors-headers-observed'],
      ['cors-headers-observed', 'test-wildcard'],
      ['test-wildcard', 'test-null-origin'],
      ['test-null-origin', 'test-reflection'],
      ['test-reflection', 'confirm-cors'],
      ['confirm-cors', 'next-step']
    ]
  },

  oauth: {
    label: 'OAuth / OIDC Testing Flow',
    group: 'testing',
    summary: 'Map the OAuth flow, test state parameter handling, probe redirect URI validation, and check for authorization code interception and token leakage.',
    suggestedSkills: [
      { name: 'OAuth 2.0 Grant Types', difficulty: 'beginner', reason: 'Understanding authorization code, implicit, and client credentials flows is required before testing any OAuth implementation.' },
      { name: 'State Parameter Validation', difficulty: 'intermediate', reason: 'Missing or predictable state values enable CSRF attacks that force victim account linking or code theft.' },
      { name: 'Redirect URI Manipulation', difficulty: 'intermediate', reason: 'Open redirect and partial-match bypass in redirect URIs are among the most exploitable OAuth weaknesses.' }
    ],
    tools: [
      { name: 'Burp Suite Proxy', purpose: 'Intercept and replay the full OAuth authorization code flow to map all redirects and parameters.' },
      { name: 'JWT Debugger', purpose: 'Decode OIDC ID tokens to inspect claims, issuer, audience, and expiry.', toolTitle: 'JWT Debugger' },
      { name: 'URL Encoder', purpose: 'Encode redirect URI bypass payloads for parameter manipulation.', toolTitle: 'URL Encoder' }
    ],
    stages: ['start', 'oauth-flow-found', 'map-endpoints', 'test-state-param', 'test-redirect-uri', 'test-code-reuse', 'confirm-oauth', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'oauth-flow-found', label: 'OAuth Flow Found', x: 18, y: 35 },
      { id: 'map-endpoints', label: 'Map Endpoints', x: 35, y: 22 },
      { id: 'test-state-param', label: 'Test State Param', x: 52, y: 15 },
      { id: 'test-redirect-uri', label: 'Test Redirect URI', x: 68, y: 22 },
      { id: 'test-code-reuse', label: 'Test Code Reuse', x: 80, y: 38 },
      { id: 'confirm-oauth', label: 'Confirm Finding', x: 88, y: 25 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'oauth-flow-found'],
      ['oauth-flow-found', 'map-endpoints'],
      ['map-endpoints', 'test-state-param'],
      ['test-state-param', 'test-redirect-uri'],
      ['test-redirect-uri', 'test-code-reuse'],
      ['test-code-reuse', 'confirm-oauth'],
      ['confirm-oauth', 'next-step']
    ]
  },

  privesc: {
    label: 'Privilege Escalation Flow',
    group: 'exploitation',
    summary: 'Starting from low-privilege access, enumerate role boundaries, test horizontal movement between accounts, and probe vertical escalation paths to admin or higher-privilege contexts.',
    suggestedSkills: [
      { name: 'Role Enumeration', difficulty: 'beginner', reason: 'Knowing what roles and permissions exist in the application is required before testing any escalation path.' },
      { name: 'IDOR / Horizontal Privilege Escalation', difficulty: 'intermediate', reason: 'Object-level authorization failures are the most common horizontal escalation vector in web apps.' },
      { name: 'Vertical Privilege Escalation', difficulty: 'advanced', reason: 'Exploiting function-level access control gaps to reach admin endpoints requires understanding how the app enforces privilege checks.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay requests with swapped user IDs, role parameters, or admin-only API paths to test enforcement gaps.' },
      { name: 'URL Encoder', purpose: 'Encode traversal or parameter manipulation payloads for privilege escalation probes.', toolTitle: 'URL Encoder' }
    ],
    stages: ['start', 'low-priv-access', 'enumerate-roles', 'test-horizontal', 'test-vertical', 'confirm-escalation', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'low-priv-access', label: 'Low-Priv Access', x: 20, y: 35 },
      { id: 'enumerate-roles', label: 'Enumerate Roles', x: 38, y: 22 },
      { id: 'test-horizontal', label: 'Test Horizontal', x: 56, y: 18 },
      { id: 'test-vertical', label: 'Test Vertical', x: 72, y: 28 },
      { id: 'confirm-escalation', label: 'Confirm Escalation', x: 85, y: 25 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'low-priv-access'],
      ['low-priv-access', 'enumerate-roles'],
      ['enumerate-roles', 'test-horizontal'],
      ['test-horizontal', 'test-vertical'],
      ['test-vertical', 'confirm-escalation'],
      ['confirm-escalation', 'next-step']
    ]
  },

  crypto: {
    label: 'Cryptography & Hash Analysis Flow',
    group: 'analysis',
    summary: 'Identify and classify cryptographic artifacts, determine hash algorithms, attempt wordlist and rainbow-table cracking, and assess cipher weaknesses in custom implementations.',
    suggestedSkills: [
      { name: 'Hash Identification', difficulty: 'beginner', reason: 'Recognising MD5, SHA-1, SHA-256, bcrypt, and NTLM hashes by length and character set is the first step in any crypto analysis.' },
      { name: 'Password Cracking', difficulty: 'intermediate', reason: 'Hashcat and John rules, wordlists, and mask attacks are the primary tools for recovering plaintext from unsalted or weakly-salted hashes.' },
      { name: 'Cipher Analysis', difficulty: 'advanced', reason: 'Custom or weak ciphers (ECB mode, short keys, predictable IV) require understanding block cipher properties to exploit effectively.' }
    ],
    tools: [
      { name: 'Hash Generator', purpose: 'Generate and compare hash values to fingerprint unknown algorithm outputs.', toolTitle: 'Hash Generator' },
      { name: 'Base64', purpose: 'Decode Base64-encoded blobs before hash identification or cipher analysis.', toolTitle: 'Base64' },
      { name: 'ROT Cipher', purpose: 'Test basic substitution ciphers and Caesar variants found in CTF challenges.', toolTitle: 'ROT Cipher' },
      { name: 'Number Base Converter', purpose: 'Convert hex-encoded hash or cipher output to decimal or binary for analysis.', toolTitle: 'Number Base Converter' },
      { name: 'hashcat / john', purpose: 'Crack identified hashes using wordlists, rules, and mask attacks.' },
      { name: 'CyberChef', purpose: 'Chain multiple decode/decrypt operations for layered encoding or custom cipher analysis.' }
    ],
    stages: ['start', 'hash-found', 'identify-type', 'check-known-list', 'wordlist-crack', 'rainbow-table', 'result', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'hash-found', label: 'Hash / Cipher Found', x: 18, y: 35 },
      { id: 'identify-type', label: 'Identify Type', x: 34, y: 22 },
      { id: 'check-known-list', label: 'Check Known List', x: 50, y: 15 },
      { id: 'wordlist-crack', label: 'Wordlist Crack', x: 65, y: 22 },
      { id: 'rainbow-table', label: 'Rainbow Table', x: 78, y: 35 },
      { id: 'result', label: 'Result', x: 86, y: 25 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'hash-found'],
      ['hash-found', 'identify-type'],
      ['identify-type', 'check-known-list'],
      ['check-known-list', 'wordlist-crack'],
      ['wordlist-crack', 'rainbow-table'],
      ['rainbow-table', 'result'],
      ['result', 'next-step']
    ]
  },

  race: {
    label: 'Race Condition & Business Logic Flow',
    group: 'testing',
    summary: 'Identify state-changing actions, establish a baseline, send concurrent requests to trigger race windows, and confirm whether logic flaws like double-spend or limit bypass are exploitable.',
    suggestedSkills: [
      { name: 'Concurrency & Race Windows', difficulty: 'intermediate', reason: 'Understanding TOCTOU (time-of-check to time-of-use) windows is required to reliably trigger race conditions in web apps.' },
      { name: 'Business Logic Analysis', difficulty: 'intermediate', reason: 'Race conditions only matter in the context of business logic constraints \u2014 coupons, balances, and rate limits are the highest-value targets.' },
      { name: 'Turbo Intruder / Last-Byte Sync', difficulty: 'advanced', reason: 'Precise timing via Burp Turbo Intruder or HTTP/2 last-byte synchronization is required to exploit tight race windows.' }
    ],
    tools: [
      { name: 'Burp Suite Turbo Intruder', purpose: 'Send parallelized requests with precise timing to hit race windows reliably.' },
      { name: 'Burp Suite Repeater', purpose: 'Baseline the state-changing action and observe normal sequential behavior before racing.' }
    ],
    stages: ['start', 'state-action-found', 'baseline', 'concurrent-requests', 'compare-outcomes', 'confirm-race', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'state-action-found', label: 'State Action Found', x: 18, y: 35 },
      { id: 'baseline', label: 'Baseline', x: 35, y: 22 },
      { id: 'concurrent-requests', label: 'Concurrent Requests', x: 53, y: 15 },
      { id: 'compare-outcomes', label: 'Compare Outcomes', x: 70, y: 22 },
      { id: 'confirm-race', label: 'Confirm Race', x: 83, y: 30 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'state-action-found'],
      ['state-action-found', 'baseline'],
      ['baseline', 'concurrent-requests'],
      ['concurrent-requests', 'compare-outcomes'],
      ['compare-outcomes', 'confirm-race'],
      ['confirm-race', 'next-step']
    ]
  },
  xss: {
    label: 'XSS Testing Flow',
    group: 'vulnerability',
    summary: 'Locate reflection points, identify rendering context, test stored and DOM-based variants, attempt filter bypass, and confirm exploitable script execution.',
    suggestedSkills: [
      { name: 'HTML Context Identification', difficulty: 'beginner', reason: 'XSS exploitability depends heavily on where reflection lands — HTML, attribute, JS string, or URL context each require different payloads.' },
      { name: 'CSP Bypass', difficulty: 'advanced', reason: 'Content Security Policy is the primary mitigation — understanding bypass techniques like unsafe-inline, nonce leakage, and trusted types is essential.' },
      { name: 'DOM-based XSS', difficulty: 'intermediate', reason: 'Client-side sinks like innerHTML, document.write, and eval are frequently missed by automated scanners.' }
    ],
    tools: [
      { name: 'XSS Generator', purpose: 'Generate context-specific XSS payloads including WAF bypass variants.', toolTitle: 'XSS Generator' },
      { name: 'Burp Suite Scanner', purpose: 'Identify reflected and stored XSS across all input parameters automatically.' },
      { name: 'Browser DevTools', purpose: 'Trace DOM manipulation sinks and source-to-sink flows for DOM-based XSS.' }
    ],
    stages: ['start', 'reflection-found', 'identify-context', 'test-stored', 'bypass-filters', 'confirm-xss', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'reflection-found', label: 'Reflection Found', x: 18, y: 35 },
      { id: 'identify-context', label: 'Identify Context', x: 35, y: 22 },
      { id: 'test-stored', label: 'Test Stored / DOM', x: 53, y: 15 },
      { id: 'bypass-filters', label: 'Bypass Filters', x: 70, y: 22 },
      { id: 'confirm-xss', label: 'Confirm XSS', x: 83, y: 30 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'reflection-found'],
      ['reflection-found', 'identify-context'],
      ['identify-context', 'test-stored'],
      ['test-stored', 'bypass-filters'],
      ['bypass-filters', 'confirm-xss'],
      ['confirm-xss', 'next-step']
    ]
  },
  csrf: {
    label: 'CSRF Testing Flow',
    group: 'vulnerability',
    summary: 'Identify state-changing actions, check CSRF token implementation and SameSite cookie attributes, craft a PoC payload, and confirm cross-origin request forgery.',
    suggestedSkills: [
      { name: 'SameSite Cookie Policy', difficulty: 'intermediate', reason: 'SameSite=Lax/Strict is the primary modern CSRF mitigation — understanding its inheritance rules and bypass conditions is critical.' },
      { name: 'CSRF Token Analysis', difficulty: 'beginner', reason: 'Token entropy, predictability, binding to session, and server-side validation are all testable properties.' },
      { name: 'Cross-Origin Requests', difficulty: 'intermediate', reason: 'CORS and CSRF overlap — knowing when simple vs. preflight requests apply determines which PoC vectors work.' }
    ],
    tools: [
      { name: 'Burp Suite CSRF PoC Generator', purpose: 'Generate an HTML PoC form for any captured state-changing request.' },
      { name: 'Burp Suite Repeater', purpose: 'Manipulate CSRF tokens to test validation — remove, reuse, or swap across sessions.' }
    ],
    stages: ['start', 'state-action-found', 'check-tokens', 'test-samesite', 'craft-poc', 'confirm-csrf', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'state-action-found', label: 'State Action Found', x: 18, y: 35 },
      { id: 'check-tokens', label: 'Check Tokens', x: 35, y: 22 },
      { id: 'test-samesite', label: 'Test SameSite', x: 53, y: 15 },
      { id: 'craft-poc', label: 'Craft PoC', x: 70, y: 22 },
      { id: 'confirm-csrf', label: 'Confirm CSRF', x: 83, y: 30 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'state-action-found'],
      ['state-action-found', 'check-tokens'],
      ['check-tokens', 'test-samesite'],
      ['test-samesite', 'craft-poc'],
      ['craft-poc', 'confirm-csrf'],
      ['confirm-csrf', 'next-step']
    ]
  },
  deserialize: {
    label: 'Deserialization Testing Flow',
    group: 'vulnerability',
    summary: 'Locate serialized data, identify the serialization format and library, inspect available gadget chains, craft a malicious payload, and confirm remote code execution or object injection.',
    suggestedSkills: [
      { name: 'Java/PHP/Python Serialization Formats', difficulty: 'advanced', reason: 'Each language has distinct serialization formats (Java ObjectInputStream, PHP serialize(), Python pickle) with different gadget chain tooling.' },
      { name: 'Gadget Chain Research', difficulty: 'advanced', reason: 'Exploitation depends on available classes in the classpath — tools like ysoserial (Java) and phpggc (PHP) automate gadget chain generation.' },
      { name: 'Object Injection Analysis', difficulty: 'intermediate', reason: 'Even without RCE, object injection can enable privilege escalation or authentication bypass through class manipulation.' }
    ],
    tools: [
      { name: 'ysoserial', purpose: 'Generate Java deserialization gadget chain payloads for common libraries (Commons Collections, Spring, etc.).' },
      { name: 'phpggc', purpose: 'Generate PHP deserialization gadget chain payloads for frameworks like Laravel, Symfony, and Guzzle.' },
      { name: 'Burp Suite', purpose: 'Intercept and replace serialized objects in requests to test server-side deserialization.' }
    ],
    stages: ['start', 'serialized-data-found', 'identify-format', 'inspect-gadgets', 'craft-payload', 'test-execution', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'serialized-data-found', label: 'Serialized Data Found', x: 18, y: 35 },
      { id: 'identify-format', label: 'Identify Format', x: 35, y: 22 },
      { id: 'inspect-gadgets', label: 'Inspect Gadgets', x: 53, y: 15 },
      { id: 'craft-payload', label: 'Craft Payload', x: 70, y: 22 },
      { id: 'test-execution', label: 'Test Execution', x: 83, y: 30 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'serialized-data-found'],
      ['serialized-data-found', 'identify-format'],
      ['identify-format', 'inspect-gadgets'],
      ['inspect-gadgets', 'craft-payload'],
      ['craft-payload', 'test-execution'],
      ['test-execution', 'next-step']
    ]
  },
  'ctf-stego': {
    label: 'Steganography & Forensics Flow',
    group: 'ctf',
    summary: 'Analyze a file artifact for hidden data: identify steganography techniques, extract metadata, decode hidden content, and recover the flag.',
    suggestedSkills: [
      { name: 'File Format Analysis', difficulty: 'beginner', reason: 'Understanding PNG, JPEG, WAV, and ZIP internal structure helps identify where hidden data can be embedded.' },
      { name: 'Steghide / zsteg / binwalk', difficulty: 'intermediate', reason: 'Standard stego tools cover the most common CTF hiding techniques — knowing which tool applies to each file type saves time.' },
      { name: 'Metadata Forensics', difficulty: 'beginner', reason: 'EXIF data, file comments, and appended data at EOF are common simple hiding spots in CTF challenges.' }
    ],
    tools: [
      { name: 'steghide', purpose: 'Extract data hidden in JPEG and BMP files, optionally passphrase-protected.' },
      { name: 'binwalk', purpose: 'Scan files for embedded file signatures and extract nested archives or blobs.' },
      { name: 'exiftool', purpose: 'Dump all metadata fields from images, audio, and documents.' },
      { name: 'zsteg', purpose: 'Detect and extract data hidden in PNG and BMP using LSB steganography.' }
    ],
    stages: ['start', 'artifact-found', 'identify-stego', 'extract-metadata', 'decode-hidden', 'confirm-flag', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'artifact-found', label: 'Artifact Found', x: 18, y: 35 },
      { id: 'identify-stego', label: 'Identify Technique', x: 35, y: 22 },
      { id: 'extract-metadata', label: 'Extract Metadata', x: 53, y: 15 },
      { id: 'decode-hidden', label: 'Decode Hidden Data', x: 70, y: 22 },
      { id: 'confirm-flag', label: 'Confirm Flag', x: 83, y: 30 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'artifact-found'],
      ['artifact-found', 'identify-stego'],
      ['identify-stego', 'extract-metadata'],
      ['extract-metadata', 'decode-hidden'],
      ['decode-hidden', 'confirm-flag'],
      ['confirm-flag', 'next-step']
    ]
  },
  'ctf-web': {
    label: 'Web CTF Chaining Flow',
    group: 'ctf',
    summary: 'Find source code or hint leaks, chain vulnerabilities across the application, pivot from initial access to privileged data, and extract the flag.',
    suggestedSkills: [
      { name: 'Source Code Analysis', difficulty: 'intermediate', reason: 'CTF web challenges often hide flags or credentials in JS files, comments, git repos, or backup files.' },
      { name: 'Vulnerability Chaining', difficulty: 'advanced', reason: 'Web CTFs rarely have a single exploit path — combining IDOR, SQLi, LFI, or SSTI findings into a chain is the expected approach.' },
      { name: 'Object Injection / SSTI', difficulty: 'intermediate', reason: 'Template injection is one of the most common CTF final-stage exploit vectors.' }
    ],
    tools: [
      { name: 'SSTI Generator & Analyzer', purpose: 'Generate server-side template injection payloads for Jinja2, Twig, Smarty, and other engines.', toolTitle: 'SSTI Generator & Analyzer' },
      { name: 'Path Traversal Generator', purpose: 'Test LFI paths to read flag files or application source code.', toolTitle: 'Path Traversal Generator' },
      { name: 'Burp Suite', purpose: 'Intercept and chain requests across the full exploit path.' }
    ],
    stages: ['start', 'source-hint-found', 'chain-first-vuln', 'chain-second-vuln', 'pivot', 'confirm-flag', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'source-hint-found', label: 'Source / Hint Found', x: 18, y: 35 },
      { id: 'chain-first-vuln', label: 'Chain First Vuln', x: 35, y: 22 },
      { id: 'chain-second-vuln', label: 'Chain Second Vuln', x: 53, y: 15 },
      { id: 'pivot', label: 'Pivot', x: 70, y: 22 },
      { id: 'confirm-flag', label: 'Confirm Flag', x: 83, y: 30 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'source-hint-found'],
      ['source-hint-found', 'chain-first-vuln'],
      ['chain-first-vuln', 'chain-second-vuln'],
      ['chain-second-vuln', 'pivot'],
      ['pivot', 'confirm-flag'],
      ['confirm-flag', 'next-step']
    ]
  }
}

export const ACTIVE_FLOW_GROUP_KEYS = new Set(FLOW_GROUPS.map(([groupKey]) => groupKey))

export const FINDING_QUICK_STARTS = [
  {
    id: 'finding-token',
    label: 'I found a token/value',
    description: 'Jump into response analysis to classify and trace suspicious values.',
    category: 'analysis',
    flowKey: 'response',
    stageId: 'response-data-found',
    confidence: 'high'
  },
  {
    id: 'finding-login',
    label: 'I found a login page',
    description: 'Start directly at login testing for auth behavior checks.',
    category: 'authentication',
    flowKey: 'login',
    stageId: 'login-page',
    confidence: 'high'
  },
  {
    id: 'finding-403',
    label: 'I got 403 / access denied',
    description: 'Branch into authorization and request tampering validation.',
    category: 'authorization',
    flowKey: 'authz',
    stageId: 'privileged-action-found',
    confidence: 'medium'
  },
  {
    id: 'finding-api',
    label: 'I saw an API endpoint',
    description: 'Start from API inspection and auth behavior checks.',
    category: 'enumeration',
    flowKey: 'api',
    stageId: 'api-endpoint-found',
    confidence: 'medium'
  },
  {
    id: 'finding-upload',
    label: 'I found file upload',
    description: 'Jump into upload validation and controlled exploitation.',
    category: 'vulnerability',
    flowKey: 'upload',
    stageId: 'upload-found',
    confidence: 'high'
  },
  {
    id: 'finding-jwt',
    label: 'I found a JWT token',
    description: 'Decode the JWT and test for algorithm confusion, alg:none, and weak secret attacks.',
    category: 'authentication',
    flowKey: 'jwt',
    stageId: 'jwt-discovered',
    confidence: 'high'
  },
  {
    id: 'finding-xml',
    label: 'I see XML being parsed',
    description: 'Test for external entity injection to probe file read, SSRF, and out-of-band exfiltration.',
    category: 'vulnerability',
    flowKey: 'xxe',
    stageId: 'xml-input-found',
    confidence: 'high'
  },
  {
    id: 'finding-ssrf',
    label: 'I found a URL/host parameter',
    description: 'Probe the server-side fetch for loopback, cloud metadata, and internal host access.',
    category: 'vulnerability',
    flowKey: 'ssrf',
    stageId: 'url-param-found',
    confidence: 'high'
  },
  {
    id: 'finding-cors',
    label: 'I see CORS headers in the response',
    description: 'Test origin reflection, wildcard policy, and null origin to confirm credentialed cross-origin data leakage.',
    category: 'vulnerability',
    flowKey: 'cors',
    stageId: 'cors-headers-observed',
    confidence: 'high'
  },
  {
    id: 'finding-oauth',
    label: 'I found an OAuth / SSO login',
    description: 'Map the OAuth flow and test state parameter, redirect URI, and authorization code handling for auth bypass vectors.',
    category: 'authentication',
    flowKey: 'oauth',
    stageId: 'oauth-flow-found',
    confidence: 'high'
  },
  {
    id: 'finding-privesc',
    label: 'I have low-privilege access',
    description: 'Enumerate roles, test horizontal IDOR paths, and probe vertical escalation to admin context.',
    category: 'authorization',
    flowKey: 'privesc',
    stageId: 'low-priv-access',
    confidence: 'high'
  },
  {
    id: 'finding-hash',
    label: 'I found a hash or encoded value',
    description: 'Identify the algorithm, check known lists, and attempt wordlist or rainbow-table cracking.',
    category: 'analysis',
    flowKey: 'crypto',
    stageId: 'hash-found',
    confidence: 'high'
  },
  {
    id: 'finding-race',
    label: 'I found a state-changing action',
    description: 'Baseline the action, send concurrent requests, and confirm whether race windows produce logic flaws like double-spend or limit bypass.',
    category: 'testing',
    flowKey: 'race',
    stageId: 'state-action-found',
    confidence: 'medium'
  },
  {
    id: 'finding-graphql',
    label: 'I found a GraphQL endpoint',
    description: 'Probe for introspection, test authentication bypass, and inject malicious queries against the schema.',
    category: 'enumeration',
    flowKey: 'api',
    stageId: 'api-endpoint-found',
    confidence: 'high'
  },
  {
    id: 'finding-rce',
    label: 'I got a shell / RCE confirmed',
    description: 'Move into the exploitation flow to document impact, stabilize access, and prepare a report.',
    category: 'exploitation',
    flowKey: 'exploitation',
    stageId: 'confirmed-finding',
    confidence: 'high'
  },
  {
    id: 'finding-deserialize',
    label: 'I found serialized data in a request',
    description: 'Identify the serialization format, research gadget chains, and test for object injection or remote code execution.',
    category: 'vulnerability',
    flowKey: 'deserialize',
    stageId: 'serialized-data-found',
    confidence: 'high'
  }
]

export const FLOW_OUTCOME_PHRASE_STARTS = [
  {
    id: 'outcome-token-extracted',
    phrase: 'token found in response',
    description: 'Investigate token semantics, replay behavior, and trust boundaries.',
    flowKey: 'response',
    stageId: 'interesting-data',
    confidence: 'high',
    category: 'analysis'
  },
  {
    id: 'outcome-authz-denied',
    phrase: '403 after role change',
    description: 'Validate access-control logic and ownership boundaries.',
    flowKey: 'authz',
    stageId: 'access-result',
    confidence: 'medium',
    category: 'authorization'
  },
  {
    id: 'outcome-upload-anomaly',
    phrase: 'upload accepted unexpected file type',
    description: 'Test extension and MIME handling for execution risk.',
    flowKey: 'upload',
    stageId: 'upload-result',
    confidence: 'high',
    category: 'vulnerability'
  },
  {
    id: 'outcome-input-anomaly',
    phrase: 'input changed server behavior',
    description: 'Branch into deeper input-validation and vulnerability analysis.',
    flowKey: 'input',
    stageId: 'response-change',
    confidence: 'medium',
    category: 'testing'
  },
  {
    id: 'outcome-session-weakness',
    phrase: 'session cookie missing secure flags',
    description: 'Assess session fixation, expiry, and cross-site protections.',
    flowKey: 'session',
    stageId: 'inspect-session',
    confidence: 'high',
    category: 'testing'
  }
]

export const VULNERABILITY_TYPE_STARTS = [
  {
    id: 'vuln-sqli',
    type: 'SQL injection',
    description: 'Test user input and backend query behavior for SQLi indicators.',
    flowKey: 'input',
    stageId: 'input-field-found',
    confidence: 'medium',
    category: 'vulnerability'
  },
  {
    id: 'vuln-broken-access-control',
    type: 'Broken access control',
    description: 'Validate role and object authorization enforcement paths.',
    flowKey: 'authz',
    stageId: 'privileged-action-found',
    confidence: 'high',
    category: 'authorization'
  },
  {
    id: 'vuln-info-disclosure',
    type: 'Information disclosure',
    description: 'Investigate leaked source, configs, and verbose error artifacts.',
    flowKey: 'info-disclosure',
    stageId: 'source-found',
    confidence: 'high',
    category: 'recon'
  },
  {
    id: 'vuln-insecure-upload',
    type: 'Insecure file upload',
    description: 'Check upload filters and server-side execution controls.',
    flowKey: 'upload',
    stageId: 'upload-found',
    confidence: 'high',
    category: 'vulnerability'
  },
  {
    id: 'vuln-session-management',
    type: 'Session management weakness',
    description: 'Assess cookie attributes, fixation, and expiration enforcement.',
    flowKey: 'session',
    stageId: 'session-captured',
    confidence: 'medium',
    category: 'testing'
  },
  {
    id: 'vuln-ssrf',
    type: 'SSRF behavior',
    description: 'Probe server-side URL fetch parameters for loopback, cloud metadata, and internal host access.',
    flowKey: 'ssrf',
    stageId: 'url-param-found',
    confidence: 'high',
    category: 'vulnerability'
  },
  {
    id: 'vuln-jwt',
    type: 'JWT vulnerability',
    description: 'Test JWT tokens for algorithm confusion, alg:none bypass, and weak signing secrets.',
    flowKey: 'jwt',
    stageId: 'jwt-discovered',
    confidence: 'high',
    category: 'authentication'
  },
  {
    id: 'vuln-xxe',
    type: 'XXE injection',
    description: 'Inject external entities into XML input to test for file read, SSRF, and OOB exfiltration.',
    flowKey: 'xxe',
    stageId: 'xml-input-found',
    confidence: 'high',
    category: 'vulnerability'
  },
  {
    id: 'vuln-cors',
    type: 'CORS misconfiguration',
    description: 'Test origin reflection, wildcard headers, and credentialed cross-origin access to sensitive endpoints.',
    flowKey: 'cors',
    stageId: 'cors-headers-observed',
    confidence: 'high',
    category: 'vulnerability'
  },
  {
    id: 'vuln-oauth',
    type: 'OAuth / OIDC weakness',
    description: 'Test state parameter, redirect URI validation, and authorization code reuse for authentication bypass.',
    flowKey: 'oauth',
    stageId: 'oauth-flow-found',
    confidence: 'high',
    category: 'authentication'
  },
  {
    id: 'vuln-privesc',
    type: 'Privilege escalation',
    description: 'Test horizontal and vertical access control gaps from a low-privilege starting point.',
    flowKey: 'privesc',
    stageId: 'low-priv-access',
    confidence: 'high',
    category: 'authorization'
  },
  {
    id: 'vuln-crypto',
    type: 'Weak cryptography / hash',
    description: 'Identify hash algorithms, test for weak or unsalted hashes, and attempt plaintext recovery.',
    flowKey: 'crypto',
    stageId: 'hash-found',
    confidence: 'medium',
    category: 'analysis'
  },
  {
    id: 'vuln-race',
    type: 'Race condition / business logic',
    description: 'Test concurrent state-changing actions for logic flaws like coupon reuse, balance manipulation, or rate-limit bypass.',
    flowKey: 'race',
    stageId: 'state-action-found',
    confidence: 'medium',
    category: 'testing'
  },
  {
    id: 'vuln-xss',
    type: 'Cross-site scripting (XSS)',
    description: 'Test input reflection for HTML, attribute, JavaScript, and DOM context XSS including stored and filter-bypass variants.',
    flowKey: 'xss',
    stageId: 'reflection-found',
    confidence: 'high',
    category: 'vulnerability'
  },
  {
    id: 'vuln-csrf',
    type: 'Cross-site request forgery (CSRF)',
    description: 'Verify CSRF token presence and binding, test SameSite cookie enforcement, and confirm whether PoC requests execute state changes.',
    flowKey: 'csrf',
    stageId: 'state-action-found',
    confidence: 'medium',
    category: 'vulnerability'
  },
  {
    id: 'vuln-deserialize',
    type: 'Insecure deserialization',
    description: 'Identify serialized objects in requests, research gadget chains for the detected language and framework, and test for object injection or RCE.',
    flowKey: 'deserialize',
    stageId: 'serialized-data-found',
    confidence: 'high',
    category: 'vulnerability'
  }
]
