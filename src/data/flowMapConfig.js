export const STORAGE_STAGE_KEY = 'flow-map-current-stage'
export const STORAGE_REVEALED_KEY = 'flow-map-revealed-stage'
export const STORAGE_TOOL_KEY = 'flow-map-selected-tool'
export const STORAGE_FEEDBACK_KEY = 'flow-map-feedback'
export const STORAGE_FLOW_KEY = 'flow-map-selected-flow'
export const STORAGE_ACTION_KEY = 'flow-map-selected-action'
export const STORAGE_OUTCOME_KEY = 'flow-map-selected-outcome'

export const MIN_ZOOM = 0.8
export const MAX_ZOOM = 1.8
export const ZOOM_STEP = 0.15
export const DEFAULT_ZOOM = 1
export const BASE_SCENE_WIDTH = 2200
export const BASE_SCENE_HEIGHT = 1240

export const FLOW_GROUPS = [
  ['recon', 'Recon Flows'],
  ['enumeration', 'Enumeration Flows'],
  ['entry-point', 'Entry Point Flows'],
  ['testing', 'Testing Flows'],
  ['vulnerability', 'Vulnerability Flows'],
  ['exploitation', 'Exploitation Flows'],
  // ['main', 'Main Flows'],
  // ['niche', 'Niche Flows']
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
    group: 'niche',
    summary: 'Follow a suspicious value from first glance to readable output using lightweight decoders.',
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
    tools: [
      { name: 'Nmap', purpose: 'Identify exposed ports, service versions, and useful NSE script output before deeper enumeration.' },
      { name: 'enum4linux-ng', purpose: 'Pull users, shares, and policy details from SMB-heavy targets.' },
      { name: 'smbclient', purpose: 'Browse accessible SMB shares and validate whether files or directories can be reached directly.' },
      { name: 'snmpwalk', purpose: 'Dump readable SNMP data when the target exposes community strings or weak SNMP access.' },
      { name: 'ldapsearch', purpose: 'Query LDAP-backed services for users, groups, and directory structure.' }
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
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay parameter changes quickly and compare how the target handles each input.' },
      { name: 'Browser DevTools', purpose: 'Watch DOM, console, and network changes while the page processes your input.' },
      { name: 'curl', purpose: 'Send controlled requests with isolated values when you want cleaner server-side comparisons.' }
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
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay API requests with controlled changes and compare status, body, and headers quickly.' },
      { name: 'Postman', purpose: 'Build repeatable request collections for endpoint, auth, and schema testing.' },
      { name: 'curl', purpose: 'Run minimal reproducible API requests from the terminal for clean before/after comparisons.' }
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
    label: 'Response Flow',
    group: 'niche',
    summary: 'Inspect response data, identify useful values, and decide what to investigate next.',
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
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Modify one request component at a time and compare responses with minimal noise.' },
      { name: 'curl', purpose: 'Reproduce and script request changes once you know which fields matter.' },
      { name: 'Browser DevTools', purpose: 'Inspect the original request shape, tokens, and front-end hints before tampering.' }
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
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay the exact proof request in a controlled way and confirm only the intended impact.' },
      { name: 'curl', purpose: 'Capture a minimal reproducible request that demonstrates the issue cleanly for verification.' },
      { name: 'Browser DevTools', purpose: 'Observe application-side effects, responses, and state changes while you validate impact.' }
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
  }
}

export const ACTIVE_FLOW_GROUP_KEYS = new Set(FLOW_GROUPS.map(([groupKey]) => groupKey))
