import { FLOWS } from './flowMapConfig'

const EXPLICIT_FLOW_LINKS = {
  ROT: [{ flowKey: 'decode', stageId: 'decode' }],
  Base64: [{ flowKey: 'decode', stageId: 'decode' }],
  'URL Encoder': [{ flowKey: 'decode', stageId: 'decode' }],
  'JWT Debugger': [{ flowKey: 'response', stageId: 'investigate-value' }],
  'JWT Encoder': [{ flowKey: 'request', stageId: 'tamper-request' }],
  'JSON Formatter': [{ flowKey: 'response', stageId: 'analyze-data' }],
  'YAML Formatter': [{ flowKey: 'response', stageId: 'analyze-data' }],
  'Markdown Preview': [{ flowKey: 'input', stageId: 'test-input' }],
  'Regex Tester': [{ flowKey: 'input', stageId: 'analyze-behavior' }],
  'HTTP Headers Parser': [{ flowKey: 'response', stageId: 'analyze-data' }],
  'Text / JSON Diff Viewer': [{ flowKey: 'request', stageId: 'response-changed' }],
  'CSP Generator & Analyzer': [{ flowKey: 'session', stageId: 'inspect-session' }],
  'CORS Analyzer': [{ flowKey: 'cors', stageId: 'cors-headers-observed' }],
  'Reverse Shell Generator': [{ flowKey: 'exploitation', stageId: 'execute-safely' }],
  'XXE Generator': [{ flowKey: 'input', stageId: 'analyze-behavior' }],
  'XSS Generator': [{ flowKey: 'input', stageId: 'analyze-behavior' }],
  'SQL Injection Generator': [{ flowKey: 'input', stageId: 'analyze-behavior' }],
  'NoSQL Injection Generator': [{ flowKey: 'input', stageId: 'analyze-behavior' }],
  'GraphQL Injection Generator': [{ flowKey: 'api', stageId: 'test-auth' }],
  'SSTI Generator & Analyzer': [{ flowKey: 'input', stageId: 'analyze-behavior' }],
  'HTTP Parameter Pollution Generator': [{ flowKey: 'request', stageId: 'tamper-request' }],
  'SSRF Generator': [{ flowKey: 'request', stageId: 'tamper-request' }],
  'Command Injection Generator': [{ flowKey: 'input', stageId: 'analyze-behavior' }],
  'LDAP Injection Generator': [{ flowKey: 'authz', stageId: 'role-switch-test' }],
  'Path Traversal Generator': [{ flowKey: 'discovery', stageId: 'investigate' }],
  'IP Subnet Calculator': [{ flowKey: 'discovery', stageId: 'enumerate' }]
}

const EXPLICIT_GUIDE_LINKS = {
  ROT: ['Browser DevTools'],
  Base64: ['Browser DevTools', 'Burp Suite'],
  'URL Encoder': ['Browser DevTools', 'Burp Suite'],
  'JWT Debugger': ['Browser DevTools', 'Burp Suite'],
  'JWT Encoder': ['Postman', 'Burp Suite Repeater'],
  'Regex Tester': ['Burp Suite Repeater', 'Browser DevTools'],
  'HTTP Headers Parser': ['Browser DevTools', 'curl', 'Burp Suite'],
  'CSP Generator & Analyzer': ['Browser DevTools', 'curl'],
  'CORS Analyzer': ['Browser DevTools', 'curl', 'Burp Suite Repeater'],
  'GraphQL Injection Generator': ['Postman', 'curl', 'Burp Suite Repeater'],
  'SQL Injection Generator': ['sqlmap', 'Burp Suite Repeater'],
  'NoSQL Injection Generator': ['Postman', 'Burp Suite Repeater'],
  'XSS Generator': ['Browser DevTools', 'Burp Suite Repeater'],
  'SSRF Generator': ['curl', 'Burp Suite Repeater'],
  'Command Injection Generator': ['curl', 'Burp Suite Repeater'],
  'Path Traversal Generator': ['curl', 'Burp Suite Repeater'],
  'LDAP Injection Generator': ['ldapsearch'],
  'HTTP Parameter Pollution Generator': ['Burp Suite Repeater'],
  'IP Subnet Calculator': ['Nmap']
}

const KEYWORD_FLOW_LINKS = [
  { regex: /(sql|nosql|xss|ssti|xxe|command injection|path traversal)/iu, links: [{ flowKey: 'input', stageId: 'test-input' }] },
  { regex: /(graphql|api|jwt)/iu, links: [{ flowKey: 'api', stageId: 'inspect-spec' }] },
  { regex: /(headers|response|json|yaml|xml|diff|cors)/iu, links: [{ flowKey: 'response', stageId: 'analyze-data' }] },
  { regex: /(enumeration|subnet|network|ldap|snmp|smb)/iu, links: [{ flowKey: 'enumeration', stageId: 'identify-service' }] }
]

const KEYWORD_GUIDE_LINKS = [
  { regex: /(api|graphql|jwt)/iu, guides: ['Postman', 'Burp Suite Repeater', 'curl'] },
  { regex: /(headers|request|response|parameter|cors)/iu, guides: ['Burp Suite Repeater', 'curl', 'Browser DevTools'] },
  { regex: /(xss|html|markdown|regex)/iu, guides: ['Browser DevTools', 'Burp Suite Repeater'] },
  { regex: /(sql)/iu, guides: ['sqlmap', 'Burp Suite Repeater'] }
]

function getStageLabel(flow, stageId) {
  return flow?.nodes.find((node) => node.id === stageId)?.label ?? stageId
}

function mergeUniqueLinks(links) {
  const seen = new Set()
  const output = []

  links.forEach(({ flowKey, stageId }) => {
    const key = `${flowKey}:${stageId}`
    if (seen.has(key)) {
      return
    }

    seen.add(key)
    output.push({ flowKey, stageId })
  })

  return output
}

function normalizeFlowLinks(links) {
  return links
    .map(({ flowKey, stageId }) => {
      const flow = FLOWS[flowKey]
      if (!flow || !flow.stages.includes(stageId)) {
        return null
      }

      return {
        flowKey,
        flowLabel: flow.label,
        stageId,
        stageLabel: getStageLabel(flow, stageId)
      }
    })
    .filter(Boolean)
}

export function getRelatedFlowStages(toolTitle = '') {
  const explicit = EXPLICIT_FLOW_LINKS[toolTitle] ?? []
  const keywordLinks = KEYWORD_FLOW_LINKS
    .filter(({ regex }) => regex.test(toolTitle))
    .flatMap(({ links }) => links)

  const merged = mergeUniqueLinks([...explicit, ...keywordLinks])
  return normalizeFlowLinks(merged)
}

function mergeUniqueGuides(guides) {
  return [...new Set(guides)]
}

export function getRelatedGuides(toolTitle = '') {
  const explicit = EXPLICIT_GUIDE_LINKS[toolTitle] ?? []
  const byKeyword = KEYWORD_GUIDE_LINKS
    .filter(({ regex }) => regex.test(toolTitle))
    .flatMap(({ guides }) => guides)

  return mergeUniqueGuides([...explicit, ...byKeyword])
}
