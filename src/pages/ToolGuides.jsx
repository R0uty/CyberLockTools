import React, { useEffect, useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import '../styles/pages/Skills.css'
import '../styles/pages/ToolGuides.css'

const TOOL_GUIDES = [
  {
    id: 'nmap',
    name: 'Nmap',
    category: 'network recon',
    description: 'Network scanner for discovering open ports, service versions, and common exposure paths before deeper testing.',
    examples: [
      'nmap -sV target.example',
      'nmap -sC -sV -p- target.example'
    ]
  },
  {
    id: 'ffuf',
    name: 'ffuf',
    category: 'web recon',
    description: 'Fast fuzzing tool for directories, files, virtual hosts, and parameter discovery with wordlists.',
    examples: [
      'ffuf -u https://target.example/FUZZ -w /path/to/wordlist.txt',
      'ffuf -u https://target.example -H "Host: FUZZ.target.example" -w /path/to/subdomains.txt'
    ]
  },
  {
    id: 'gobuster',
    name: 'Gobuster',
    category: 'web recon',
    description: 'Fast brute-force tool for discovering directories, files, DNS subdomains, and virtual hosts with wordlists.',
    examples: [
      'gobuster dir -u https://target.example -w /path/to/wordlist.txt',
      'gobuster vhost -u https://target.example -w /path/to/subdomains.txt --append-domain'
    ]
  },
  {
    id: 'feroxbuster',
    name: 'feroxbuster',
    category: 'web recon',
    description: 'Content discovery scanner for recursive enumeration of hidden paths and files across web applications.',
    examples: [
      'feroxbuster -u https://target.example -w /path/to/wordlist.txt',
      'feroxbuster -u https://target.example --depth 2 -x php,txt,bak'
    ]
  },
  {
    id: 'wfuzz',
    name: 'wfuzz',
    category: 'web recon',
    description: 'Flexible web fuzzer for parameter discovery, payload testing, and response-based filtering.',
    examples: [
      'wfuzz -c -w /path/to/wordlist.txt --hc 404 https://target.example/FUZZ',
      'wfuzz -c -z file,/path/to/payloads.txt -d "id=FUZZ" https://target.example/item'
    ]
  },
  {
    id: 'dirb',
    name: 'dirb',
    category: 'web recon',
    description: 'Simple directory brute-force utility for quick checks on common paths and hidden resources.',
    examples: [
      'dirb https://target.example/',
      'dirb https://target.example/ /usr/share/wordlists/dirb/common.txt'
    ]
  },
  {
    id: 'dirbuster',
    name: 'DirBuster',
    category: 'web recon',
    description: 'GUI-based directory and file brute-forcing tool useful for interactive discovery sessions.',
    examples: [
      'Select target URL, set wordlist, then run brute force in DirBuster GUI',
      'Use extension list (php, asp, aspx, txt, bak) and review 200/301/403 results'
    ]
  },
  {
    id: 'burp-suite',
    name: 'Burp Suite',
    category: 'web testing',
    description: 'Web security proxy for intercepting traffic, repeating requests, and validating behavior changes in controlled tests.',
    copyEnabled: false,
    examples: [
      'Proxy browser traffic through Burp and send one request to Repeater',
      'Modify one parameter per request in Repeater and compare status/body changes'
    ]
  },
  {
    id: 'burp-suite-repeater',
    name: 'Burp Suite Repeater',
    category: 'web testing',
    description: 'Burp module focused on replaying and modifying captured requests one variable at a time.',
    copyEnabled: false,
    examples: [
      'Capture baseline request, send to Repeater, change id=1 to id=2',
      'Replay with different tokens and compare authorization responses'
    ]
  },
  {
    id: 'nikto',
    name: 'Nikto',
    category: 'web testing',
    description: 'Web server scanner for identifying common misconfigurations, outdated software, and known risky files.',
    examples: [
      'nikto -h https://target.example',
      'nikto -h target.example -p 80,443 -ssl'
    ]
  },
  {
    id: 'sqlmap',
    name: 'sqlmap',
    category: 'web testing',
    description: 'Automated SQL injection testing tool for validating injectable parameters in authorized targets.',
    examples: [
      'sqlmap -u "https://target.example/item?id=1"',
      'sqlmap -r request.txt --batch'
    ]
  },
  {
    id: 'nuclei',
    name: 'Nuclei',
    category: 'web testing',
    description: 'Template-based scanner for detecting known exposures and misconfigurations using curated checks.',
    examples: [
      'nuclei -u https://target.example',
      'nuclei -u https://target.example -tags cve,misconfig'
    ]
  },
  {
    id: 'curl',
    name: 'curl',
    category: 'request validation',
    description: 'Terminal HTTP client for minimal, reproducible request/response testing and evidence collection.',
    examples: [
      'curl -i "https://target.example/api/items?id=1"',
      'curl -i -X POST "https://target.example/login" -d "user=test&pass=test"'
    ]
  },
  {
    id: 'enum4linux-ng',
    name: 'enum4linux-ng',
    category: 'smb enumeration',
    description: 'SMB-focused enumeration utility for users, shares, domain policy, and host metadata.',
    examples: [
      'enum4linux-ng -A target.example',
      'enum4linux-ng -A -u guest -p "" target.example'
    ]
  },
  {
    id: 'smbclient',
    name: 'smbclient',
    category: 'smb enumeration',
    description: 'Command-line SMB client for listing shares and validating readable or writable access.',
    examples: [
      'smbclient -L //target.example -N',
      'smbclient //target.example/public -N'
    ]
  },
  {
    id: 'snmpwalk',
    name: 'snmpwalk',
    category: 'network enumeration',
    description: 'SNMP query utility to extract device and service information when community strings are exposed.',
    examples: [
      'snmpwalk -v2c -c public target.example',
      'snmpwalk -v2c -c public target.example 1.3.6.1.2.1.1'
    ]
  },
  {
    id: 'ldapsearch',
    name: 'ldapsearch',
    category: 'directory services',
    description: 'LDAP query tool for enumerating directory entries, users, groups, and service structure.',
    examples: [
      'ldapsearch -x -H ldap://target.example -b "dc=example,dc=local"',
      'ldapsearch -x -H ldap://target.example -D "cn=admin,dc=example,dc=local" -W -b "dc=example,dc=local"'
    ]
  },
  {
    id: 'postman',
    name: 'Postman',
    category: 'api testing',
    description: 'API client for building repeatable request collections and validating auth/input behavior quickly.',
    examples: [
      'Create a saved request collection for one endpoint and duplicate test cases',
      'Run collection with environment variables to compare role-based responses'
    ]
  },
  {
    id: 'browser-devtools',
    name: 'Browser DevTools',
    category: 'browser analysis',
    description: 'Built-in browser inspector for request tracing, client-side behavior checks, and debugging front-end logic.',
    examples: [
      'Open Network tab, submit one action, inspect request headers and response body',
      'Use Console + Sources tabs to trace client-side validation and API calls'
    ]
  }
]

const CATEGORY_ORDER = ['all', ...new Set(TOOL_GUIDES.map((tool) => tool.category))]

function slugify(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ToolGuides({ initialToolName = '' }) {
  useSEO({
    title: 'Pentesting Tools — R0uty\'s Cyber Lab',
    description: 'My pentesting tool quick-reference with concise usage examples and practical notes.',
    keywords: 'nmap, dirbuster, ffuf, burp suite, recon tools, security tool examples'
  })

  const [copiedExampleKey, setCopiedExampleKey] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const highlightedId = useMemo(() => slugify(initialToolName), [initialToolName])

  const visibleTools = useMemo(() => (
    activeCategory === 'all'
      ? TOOL_GUIDES
      : TOOL_GUIDES.filter((tool) => tool.category === activeCategory)
  ), [activeCategory])

  useEffect(() => {
    if (!highlightedId) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const card = document.getElementById(`tool-guide-${highlightedId}`)
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [highlightedId])

  const copyExample = (example, key) => {
    navigator.clipboard.writeText(example).then(() => {
      setCopiedExampleKey(key)
      window.setTimeout(() => setCopiedExampleKey(''), 1400)
    })
  }

  return (
    <div className="tool-page skills-page tool-guides-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>

      <div className="tool-header">
        <span className="skills-kicker">Pentesting reference</span>
        <h1>Pentesting Tools for Recon and Testing</h1>
        <p>This is my quick-reference list. Examples are shown at the top of each card; command-style entries can be copied directly.</p>
        <div className="skills-header-meta">
          <div className="skills-header-pill"><span>Pentesting Tools</span><strong>{TOOL_GUIDES.length}</strong></div>
          <div className="skills-header-pill"><span>Categories</span><strong>{CATEGORY_ORDER.length - 1}</strong></div>
          <div className="skills-header-pill"><span>Format</span><strong>Examples + notes</strong></div>
        </div>
      </div>

      <div className="skills-controls">
        <div className="skills-filter-group">
          <span className="skills-filter-label">Category</span>
          <div className="skills-filter-pills">
            {CATEGORY_ORDER.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'skills-filter-pill active' : 'skills-filter-pill'}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="skills-grid">
        {visibleTools.map((tool) => (
          <article
            key={tool.id}
            id={`tool-guide-${tool.id}`}
            className={`skills-card tool-guides-card${highlightedId === tool.id ? ' tool-guides-card--highlighted' : ''}`}
          >
            <div className="skills-card-header">
              <div className="skills-card-labels">
                <span className="skills-cat-badge">{tool.category}</span>
              </div>
            </div>

            <h3 className="skills-card-name">{tool.name}</h3>

            <div className="tool-guides-examples" aria-label={`${tool.name} examples`}>
              <span className="tool-guides-examples-label">Examples</span>
              {tool.examples.map((example, index) => {
                const copyKey = `${tool.id}-${index}`
                return (
                  <div key={copyKey} className="tool-guides-example-row">
                    <code>{example}</code>
                    {tool.copyEnabled !== false && (
                      <button
                        type="button"
                        className="skills-copy-btn"
                        onClick={() => copyExample(example, copyKey)}
                      >
                        {copiedExampleKey === copyKey ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="skills-card-desc tool-guides-description">{tool.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
