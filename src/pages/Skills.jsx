import { useState, useMemo } from 'react'
import { useSEO } from '../hooks/useSEO'
import '../styles/pages/Skills.css'

const SKILL_CATEGORIES = {
  recon:       'Reconnaissance',
  enumeration: 'Enumeration',
  web:         'Web Testing',
  api:         'API Testing',
  exploit:     'Exploitation',
  post:        'Post-Exploitation',
  bounty:      'Bug Bounty',
  report:      'Reporting',
}

const SKILLS = [
  {
    id: 1,
    name: 'Port Scanning',
    category: 'recon',
    difficulty: 'beginner',
    description: 'Identify open ports and running services on a target host using tools like Nmap. Foundational step before any further enumeration.',
    tags: ['nmap', 'network', 'service detection'],
    agentHint: 'Run a SYN scan on TCP ports 1-65535 with service version detection. Report any open ports grouped by service type.',
  },
  {
    id: 2,
    name: 'Subdomain Enumeration',
    category: 'recon',
    difficulty: 'intermediate',
    description: 'Discover subdomains of a target domain using passive sources (crt.sh, Shodan) and active tools (ffuf, amass, subfinder).',
    tags: ['amass', 'subfinder', 'dns', 'attack surface'],
    agentHint: 'Enumerate subdomains passively via crt.sh and SecurityTrails, then actively via brute-force with a wordlist. Deduplicate and resolve each result.',
  },
  {
    id: 3,
    name: 'Banner Grabbing',
    category: 'recon',
    difficulty: 'beginner',
    description: 'Collect service banners to identify software versions and potential CVEs. Can be done with netcat, curl, or Nmap scripts.',
    tags: ['netcat', 'curl', 'version detection'],
    agentHint: 'Connect to each open port and capture the banner. Cross-reference service versions against a CVE database. Flag anything outdated.',
  },
  {
    id: 4,
    name: 'Directory Bruteforcing',
    category: 'enumeration',
    difficulty: 'beginner',
    description: 'Discover hidden paths, admin panels, and backup files on a web server using tools like ffuf, dirb, or gobuster with curated wordlists.',
    tags: ['ffuf', 'gobuster', 'wordlist', 'web paths'],
    agentHint: 'Use a common wordlist (e.g. SecLists/Discovery/Web-Content/common.txt) and filter responses by status code. Flag 200, 301, 403s separately.',
  },
  {
    id: 5,
    name: 'Parameter Discovery',
    category: 'enumeration',
    difficulty: 'intermediate',
    description: 'Identify hidden query parameters on endpoints that are not visibly linked in the UI. Useful for uncovering IDOR and injection surfaces.',
    tags: ['arjun', 'parameters', 'GET/POST', 'hidden inputs'],
    agentHint: 'Run Arjun against each endpoint to discover GET and POST parameters. Flag parameters that reflect input or return different responses.',
  },
  {
    id: 6,
    name: 'JavaScript Endpoint Analysis',
    category: 'enumeration',
    difficulty: 'intermediate',
    description: 'Extract API endpoints, secrets, and internal paths from client-side JavaScript files using tools like LinkFinder or manual review.',
    tags: ['linkfinder', 'js analysis', 'endpoints', 'secrets'],
    agentHint: 'Download all JS bundles, extract URLs and API routes with a regex. Check for hardcoded keys, tokens, or internal-only paths.',
  },
  {
    id: 7,
    name: 'XSS Detection',
    category: 'web',
    difficulty: 'beginner',
    description: 'Test for Cross-Site Scripting by injecting payloads into reflected, stored, and DOM-based contexts. Confirm with alert() or out-of-band callbacks.',
    tags: ['xss', 'injection', 'burp suite', 'reflected', 'stored'],
    agentHint: 'Inject <script>alert(1)</script> and event-handler payloads into all input fields. Flag any response that reflects unescaped input.',
  },
  {
    id: 8,
    name: 'SQL Injection Testing',
    category: 'web',
    difficulty: 'intermediate',
    description: 'Identify SQL injection by testing error-based, blind boolean, and time-based conditions across all user-controlled inputs.',
    tags: ['sqli', 'sqlmap', 'error-based', 'blind', 'database'],
    agentHint: 'Append a single quote to each parameter. If an error or behavioral difference occurs, escalate to UNION and blind SQLi techniques.',
  },
  {
    id: 9,
    name: 'CSRF Identification',
    category: 'web',
    difficulty: 'intermediate',
    description: 'Verify whether state-changing requests are protected by anti-CSRF tokens or rely on SameSite cookies for defense.',
    tags: ['csrf', 'tokens', 'samesite', 'state-changing requests'],
    agentHint: 'Capture state-changing POST requests. Replay them from a third-party origin without the CSRF token. Flag any that succeed.',
  },
  {
    id: 10,
    name: 'SSRF Detection',
    category: 'web',
    difficulty: 'intermediate',
    description: 'Test parameters that accept URLs for Server-Side Request Forgery. Use an out-of-band callback server to confirm blind SSRF.',
    tags: ['ssrf', 'out-of-band', 'internal services', 'url parameters'],
    agentHint: 'Inject your Burp Collaborator or interactsh URL into every parameter that accepts a URL or hostname. Flag any DNS or HTTP callbacks.',
  },
  {
    id: 11,
    name: 'Business Logic Testing',
    category: 'web',
    difficulty: 'advanced',
    description: 'Identify flaws in the application workflow such as price manipulation, workflow bypass, or negative quantity tricks.',
    tags: ['logic flaws', 'workflow', 'price manipulation', 'race condition'],
    agentHint: 'Walk through multi-step flows and test boundary conditions at each step. Try skipping steps, repeating steps, and using unexpected values.',
  },
  {
    id: 12,
    name: 'IDOR Testing',
    category: 'api',
    difficulty: 'intermediate',
    description: 'Test Insecure Direct Object References by replacing your own identifiers with those of other users to check horizontal access control.',
    tags: ['idor', 'bola', 'object ids', 'access control'],
    agentHint: 'Log in as user A, capture a request referencing user A\'s resource ID, then replay with user B\'s session and user A\'s ID. Flag any successful access.',
  },
  {
    id: 13,
    name: 'API Authentication Bypass',
    category: 'api',
    difficulty: 'advanced',
    description: 'Probe authentication mechanisms for weaknesses: weak JWT secrets, missing signature validation, token reuse, or algorithm confusion.',
    tags: ['jwt', 'alg:none', 'token reuse', 'authentication'],
    agentHint: 'Decode the JWT header and payload. Test alg:none, HMAC-to-RSA confusion, and secret brute-force. Check if expired tokens are still accepted.',
  },
  {
    id: 14,
    name: 'Mass Assignment Testing',
    category: 'api',
    difficulty: 'intermediate',
    description: 'Send additional undocumented fields in JSON body parameters to elevate privileges or modify protected attributes.',
    tags: ['mass assignment', 'json body', 'privilege escalation', 'api'],
    agentHint: 'Capture a PUT/PATCH request. Add fields like role, isAdmin, or verified to the request body. Flag any that are accepted and reflected in the response.',
  },
  {
    id: 15,
    name: 'Privilege Escalation',
    category: 'exploit',
    difficulty: 'advanced',
    description: 'After initial access, enumerate SUID binaries, sudo rights, writable cron jobs, and kernel version to escalate to root.',
    tags: ['linux', 'suid', 'sudo', 'cron', 'privesc'],
    agentHint: 'Run LinPEAS/WinPEAS. Identify any SUID binaries, misconfigured sudo entries, or writable scripts run as root. Cross-check via GTFOBins.',
  },
  {
    id: 16,
    name: 'File Inclusion Testing',
    category: 'exploit',
    difficulty: 'intermediate',
    description: 'Test LFI and RFI vulnerabilities by manipulating path parameters to traverse directories or include remote content.',
    tags: ['lfi', 'rfi', 'path traversal', 'file inclusion'],
    agentHint: 'Inject ../../../../etc/passwd into file path parameters. Test null bytes, URL encoding, and double encoding. Try PHP wrapper for RCE with LFI.',
  },
  {
    id: 17,
    name: 'Scope Analysis',
    category: 'bounty',
    difficulty: 'beginner',
    description: 'Read program policies carefully to identify what is in scope, what is explicitly out of scope, and what severity of issues qualify for rewards.',
    tags: ['program policy', 'scope', 'targets', 'rules'],
    agentHint: 'Parse the program policy. Extract all in-scope domains, asset types, and excluded categories. Flag any ambiguous scope for human review.',
  },
  {
    id: 18,
    name: 'Rate Limiting Bypass',
    category: 'bounty',
    difficulty: 'intermediate',
    description: 'Attempt to bypass rate limiting using IP rotation, header manipulation (X-Forwarded-For), or account enumeration at scale.',
    tags: ['rate limiting', 'ip rotation', 'x-forwarded-for', 'otp bypass'],
    agentHint: 'Rotate X-Forwarded-For headers between requests. Test null Character and case variation in usernames. Flag any OTP or password reset that allows unlimited attempts.',
  },
  {
    id: 19,
    name: 'PoC Writing',
    category: 'report',
    difficulty: 'intermediate',
    description: 'Write a clear, reproducible proof-of-concept that demonstrates impact without overstepping. Include HTTP request/response evidence.',
    tags: ['poc', 'reproducibility', 'impact', 'evidence'],
    agentHint: 'Generate a step-by-step reproduction guide. Include raw HTTP requests, expected vs actual behavior, and a clear impact statement. Attach screenshots or HTTP logs.',
  },
  {
    id: 20,
    name: 'Vulnerability Severity Rating',
    category: 'report',
    difficulty: 'beginner',
    description: 'Apply CVSS scoring or program-specific criteria to rate a finding as Critical, High, Medium, or Low with justification.',
    tags: ['cvss', 'severity', 'impact', 'likelihood'],
    agentHint: 'Score the vulnerability using CVSS 3.1 base metrics. Document Attack Vector, Complexity, Privileges Required, User Interaction, Scope, and Impact scores.',
  },

  // --- Reconnaissance (additional) ---
  {
    id: 21,
    name: 'OSINT Profiling',
    category: 'recon',
    difficulty: 'beginner',
    description: 'Gather publicly available information about a target organization using search engines, LinkedIn, GitHub, WHOIS, and paste sites.',
    tags: ['osint', 'google dork', 'linkedin', 'github', 'whois'],
    agentHint: 'Dork for site:target.com filetype:pdf, search GitHub for the org name, pull WHOIS records, and check Shodan for exposed infrastructure. Summarize findings by category.',
  },
  {
    id: 22,
    name: 'Technology Fingerprinting',
    category: 'recon',
    difficulty: 'beginner',
    description: 'Identify the tech stack (CMS, frameworks, server software, CDN) of a target using response headers, cookies, and tools like Wappalyzer or WhatWeb.',
    tags: ['wappalyzer', 'whatweb', 'headers', 'cms detection'],
    agentHint: 'Fetch the target homepage. Inspect X-Powered-By, Server, Set-Cookie headers, and HTML meta tags. Cross-reference against known fingerprints for CVEs.',
  },
  {
    id: 23,
    name: 'WAF Detection',
    category: 'recon',
    difficulty: 'intermediate',
    description: 'Identify whether a Web Application Firewall is in place, which vendor, and what bypass techniques may apply using wafw00f or manual probing.',
    tags: ['wafw00f', 'waf bypass', 'firewall', 'detection'],
    agentHint: 'Run wafw00f against the target. Send a basic XSS payload and observe response codes and bodies. If blocked, identify vendor from error pages or headers.',
  },
  {
    id: 24,
    name: 'Certificate Transparency Search',
    category: 'recon',
    difficulty: 'beginner',
    description: 'Query CT logs via crt.sh or certspotter to find all TLS certificates issued for a domain, revealing subdomains not found via DNS brute-force.',
    tags: ['crt.sh', 'certificate', 'tls', 'subdomains'],
    agentHint: 'Query https://crt.sh/?q=%.target.com&output=json. Extract unique CN and SAN values. De-duplicate and resolve each discovered host.',
  },
  {
    id: 25,
    name: 'Cloud Storage Enumeration',
    category: 'recon',
    difficulty: 'intermediate',
    description: 'Discover misconfigured S3 buckets, Azure Blob containers, and GCS buckets that expose internal files or allow unauthenticated writes.',
    tags: ['s3', 'azure blob', 'gcs', 'cloud', 'misconfiguration'],
    agentHint: 'Construct common bucket names from the target (company-name-assets, company-backup, etc.). Check for public LIST/GET access. Flag any that return 200 or expose file listings.',
  },

  // --- Enumeration (additional) ---
  {
    id: 26,
    name: 'Virtual Host Enumeration',
    category: 'enumeration',
    difficulty: 'intermediate',
    description: 'Brute-force HTTP Host headers to discover virtual hosts sharing the same IP that are not publicly linked in DNS.',
    tags: ['vhost', 'host header', 'ffuf', 'internal apps'],
    agentHint: 'Use ffuf with a subdomain wordlist and -H "Host: FUZZ.target.com". Filter by response size differences from the default response to find valid virtual hosts.',
  },
  {
    id: 27,
    name: 'User Enumeration',
    category: 'enumeration',
    difficulty: 'beginner',
    description: 'Determine valid usernames or email addresses through login error messages, registration forms, password reset flows, or timing differences.',
    tags: ['user enum', 'login errors', 'password reset', 'timing attack'],
    agentHint: 'Send login requests for known-valid and known-invalid usernames. Compare response body, status code, and response time. Flag statistically significant differences.',
  },
  {
    id: 28,
    name: 'API Schema Discovery',
    category: 'enumeration',
    difficulty: 'intermediate',
    description: 'Locate exposed OpenAPI/Swagger docs, GraphQL introspection endpoints, and undocumented /api/ paths that reveal the full API surface.',
    tags: ['openapi', 'swagger', 'graphql introspection', 'api discovery'],
    agentHint: 'Probe /api-docs, /swagger.json, /openapi.yaml, and /graphql. Enable GraphQL introspection and dump the full schema. Map all operations and their parameters.',
  },

  // --- Web Testing (additional) ---
  {
    id: 29,
    name: 'Open Redirect Testing',
    category: 'web',
    difficulty: 'beginner',
    description: 'Identify parameters that redirect users to arbitrary external URLs, enabling phishing chains and OAuth token theft.',
    tags: ['open redirect', 'url redirect', 'phishing chain', 'oauth'],
    agentHint: 'Find all redirect parameters (next=, url=, return_to=). Inject https://evil.com as the value. Flag any 302 or meta-refresh that points to the injected URL.',
  },
  {
    id: 30,
    name: 'Clickjacking Testing',
    category: 'web',
    difficulty: 'beginner',
    description: 'Verify whether sensitive pages can be embedded in an iframe by a third-party site due to missing X-Frame-Options or CSP frame-ancestors.',
    tags: ['clickjacking', 'x-frame-options', 'csp', 'iframe'],
    agentHint: 'Check response headers for X-Frame-Options and CSP frame-ancestors on all authenticated pages. Embed the target in an iframe on your test server and confirm rendering.',
  },
  {
    id: 31,
    name: 'HTTP Request Smuggling',
    category: 'web',
    difficulty: 'advanced',
    description: 'Exploit discrepancies in how front-end and back-end servers parse Transfer-Encoding and Content-Length headers to smuggle requests.',
    tags: ['request smuggling', 'te.cl', 'cl.te', 'http/1.1'],
    agentHint: 'Send a CL.TE probe: set both Content-Length and Transfer-Encoding: chunked. Measure if the back-end consumes extra bytes from the next request. Use Burp\'s HTTP smuggling scanner.',
  },
  {
    id: 32,
    name: 'XXE Injection',
    category: 'web',
    difficulty: 'intermediate',
    description: 'Inject malicious XML external entities to read local files, perform SSRF, or cause denial of service via billion laughs.',
    tags: ['xxe', 'xml', 'external entity', 'file read', 'ssrf'],
    agentHint: 'Replace the XML body with a DOCTYPE defining a SYSTEM entity pointing to file:///etc/passwd. Check the response for the file content. Try OOB XXE if blind.',
  },
  {
    id: 33,
    name: 'SSTI Detection',
    category: 'web',
    difficulty: 'intermediate',
    description: 'Test template injection by injecting arithmetic expressions into user-controlled fields. Identify the engine then escalate to RCE.',
    tags: ['ssti', 'template injection', 'jinja2', 'twig', 'freemarker'],
    agentHint: 'Inject {{7*7}} and ${7*7} into all reflected inputs. If 49 appears in the response, identify the engine with polyglot probes and escalate to OS command execution.',
  },

  // --- API Testing (additional) ---
  {
    id: 34,
    name: 'Broken Function Level Auth',
    category: 'api',
    difficulty: 'intermediate',
    description: 'Access admin-only or privileged API functions as a low-privileged user by manipulating method or path, typically in REST APIs.',
    tags: ['bfla', 'function level auth', 'admin endpoints', 'http method'],
    agentHint: 'Enumerate all API endpoints as an admin, then replay each request with a standard user token. Flag any that return 200 instead of 403.',
  },
  {
    id: 35,
    name: 'GraphQL Injection',
    category: 'api',
    difficulty: 'intermediate',
    description: 'Exploit overly permissive GraphQL endpoints via introspection abuse, batching attacks, deep query nesting, or field-level injection.',
    tags: ['graphql', 'introspection', 'batching', 'injection', 'depth limit'],
    agentHint: 'Enable introspection and map the schema. Try batch queries to bypass rate limiting. Inject SQL or OS into string arguments. Test for nested query DoS with depth > 10.',
  },
  {
    id: 36,
    name: 'API Key Exposure',
    category: 'api',
    difficulty: 'beginner',
    description: 'Discover API keys and secrets exposed in client-side code, public repositories, response bodies, or error messages.',
    tags: ['api keys', 'secrets', 'github leaks', 'trufflehog'],
    agentHint: 'Search the target\'s GitHub org with TruffleHog. Scan JS bundles with regex for common key patterns (AIza, AKIA, sk_live_). Verify any found key is active via the relevant API.',
  },
  {
    id: 37,
    name: 'Race Condition Testing',
    category: 'api',
    difficulty: 'advanced',
    description: 'Exploit time-of-check to time-of-use windows by sending concurrent requests to trigger duplicate transactions, coupon reuse, or balance manipulation.',
    tags: ['race condition', 'toctou', 'concurrent requests', 'burp turbo intruder'],
    agentHint: 'Use Burp Turbo Intruder or Intruder\'s race mode to send 20+ simultaneous requests to a one-time-use endpoint (e.g. redeem coupon). Flag any that succeed more than once.',
  },

  // --- Exploitation (additional) ---
  {
    id: 38,
    name: 'Command Injection',
    category: 'exploit',
    difficulty: 'intermediate',
    description: 'Inject OS commands into parameters passed to system calls, achieving arbitrary command execution on the server.',
    tags: ['command injection', 'rce', 'os command', 'ping', 'blind injection'],
    agentHint: 'Append ; id, && id, and | id to all parameters that might feed shell commands (ping, nslookup, etc.). For blind injection, use out-of-band DNS callbacks.',
  },
  {
    id: 39,
    name: 'Deserialization Exploitation',
    category: 'exploit',
    difficulty: 'advanced',
    description: 'Exploit insecure deserialization in Java, PHP, Python, or .NET by crafting malicious serialized objects that execute code on deserialization.',
    tags: ['deserialization', 'java', 'php', 'ysoserial', 'pickle'],
    agentHint: 'Identify serialized data in cookies or request bodies (base64 AC ED magic bytes = Java). Generate a ysoserial payload for the identified gadget chain and test OOB execution.',
  },
  {
    id: 40,
    name: 'Password Spraying',
    category: 'exploit',
    difficulty: 'intermediate',
    description: 'Test a small set of common passwords against a large number of accounts to avoid lockout, targeting SSO, VPNs, and web apps.',
    tags: ['password spray', 'sso', 'lockout bypass', 'credential attack'],
    agentHint: 'Identify the lockout threshold (e.g. 5 attempts / 15 min). Spray only 2-3 passwords per account per window. Use common passwords like Season+Year and Company+123.',
  },
  {
    id: 41,
    name: 'Buffer Overflow (Basic)',
    category: 'exploit',
    difficulty: 'advanced',
    description: 'Overflow a stack buffer to overwrite the return address and redirect execution to shellcode or a ROP chain in a CTF or lab context.',
    tags: ['buffer overflow', 'stack', 'eip control', 'rop', 'shellcode'],
    agentHint: 'Fuzz the target with increasing input lengths. Identify crash offset with a cyclic pattern. Verify EIP control, find bad chars, locate suitable shellcode space or ROP gadgets.',
  },

  // --- Post-Exploitation ---
  {
    id: 42,
    name: 'Credential Dumping',
    category: 'post',
    difficulty: 'advanced',
    description: 'Extract credentials from memory, SAM database, LSASS process, or configuration files after gaining initial access to a Windows or Linux host.',
    tags: ['mimikatz', 'lsass', 'sam', 'secretsdump', 'credentials'],
    agentHint: 'On Windows, dump LSASS with Mimikatz sekurlsa::logonpasswords. On Linux, check /etc/shadow and application config files. Attempt secretsdump remotely if SMB is accessible.',
  },
  {
    id: 43,
    name: 'Lateral Movement',
    category: 'post',
    difficulty: 'advanced',
    description: 'Move from a compromised host to other systems on the network using harvested credentials, pass-the-hash, or trust relationships.',
    tags: ['lateral movement', 'pass-the-hash', 'psexec', 'wmi', 'smb'],
    agentHint: 'Use cracked or captured NTLM hashes with PsExec or CME. Test RDP with stolen credentials. Map accessible shares and pivot via WMI or scheduled tasks.',
  },
  {
    id: 44,
    name: 'Persistence Mechanisms',
    category: 'post',
    difficulty: 'advanced',
    description: 'Establish persistent access through scheduled tasks, registry run keys, cron jobs, SSH authorized_keys, or service creation.',
    tags: ['persistence', 'cron', 'registry', 'service', 'ssh'],
    agentHint: 'On Linux, add a public key to ~/.ssh/authorized_keys or a cron entry. On Windows, write a registry Run key or create a service. Verify the implant survives a reboot.',
  },
  {
    id: 45,
    name: 'Data Exfiltration',
    category: 'post',
    difficulty: 'intermediate',
    description: 'Transfer sensitive files out of a compromised environment over allowed protocols (DNS, HTTPS, ICMP) that bypass egress filtering.',
    tags: ['exfiltration', 'dns tunneling', 'https', 'icmp', 'data transfer'],
    agentHint: 'Identify allowed outbound protocols. Encode target files as base64 and exfiltrate via DNS TXT queries with dnscat2 or via HTTPS POST to a controlled endpoint.',
  },
  {
    id: 46,
    name: 'Active Directory Enumeration',
    category: 'post',
    difficulty: 'intermediate',
    description: 'Map the AD domain: enumerate users, groups, GPOs, SPNs, Kerberoastable accounts, and trust relationships using BloodHound or PowerView.',
    tags: ['active directory', 'bloodhound', 'powerview', 'kerberoasting', 'spn'],
    agentHint: 'Run SharpHound to collect AD data and ingest into BloodHound. Identify shortest paths to Domain Admin. Enumerate SPNs for Kerberoasting and find AS-REP roastable accounts.',
  },

  // --- Bug Bounty (additional) ---
  {
    id: 47,
    name: 'Duplicate & Prior Art Check',
    category: 'bounty',
    difficulty: 'beginner',
    description: 'Before submitting, search disclosed reports on HackerOne, Bugcrowd, and Google for the same vulnerability class on the same target.',
    tags: ['duplicates', 'disclosed reports', 'hackerone', 'bugcrowd', 'prior art'],
    agentHint: 'Query HackerOne Hacktivity and Bugcrowd\'s disclosed reports for the target program. Search for the same endpoint and vulnerability class. Flag likely duplicates before submission.',
  },
  {
    id: 48,
    name: 'Impact Chaining',
    category: 'bounty',
    difficulty: 'intermediate',
    description: 'Combine multiple low or informational findings to demonstrate a higher-impact attack path, increasing the severity and reward.',
    tags: ['impact chaining', 'attack chain', 'low to critical', 'combined exploits'],
    agentHint: 'List all findings. Identify pairs where one issue enables another (e.g. open redirect + OAuth = account takeover). Build a narrative showing the complete attack path.',
  },
  {
    id: 49,
    name: 'Subdomain Takeover',
    category: 'bounty',
    difficulty: 'intermediate',
    description: 'Identify dangling DNS records pointing to deprovisioned cloud services (S3, GitHub Pages, Heroku) and claim the resource.',
    tags: ['subdomain takeover', 'dangling cname', 's3', 'heroku', 'github pages'],
    agentHint: 'Enumerate all CNAMEs. Resolve each one. Flag subdomains pointing to services that return "No such bucket", "There is no app here", or similar unclaimed messages. Attempt to claim.',
  },

  // --- Reporting (additional) ---
  {
    id: 50,
    name: 'Remediation Advice',
    category: 'report',
    difficulty: 'beginner',
    description: 'Provide clear, actionable remediation steps for each finding, including code-level fixes, configuration changes, and compensating controls.',
    tags: ['remediation', 'fix recommendations', 'code fix', 'configuration'],
    agentHint: 'For each finding, generate: (1) a one-line root cause, (2) a specific code or config change, and (3) a verification step the developer can run to confirm the fix.',
  },
  {
    id: 51,
    name: 'Responsible Disclosure Timeline',
    category: 'report',
    difficulty: 'beginner',
    description: 'Follow a structured disclosure timeline: initial report, vendor acknowledgement, fix verification, and coordinated public disclosure after 90 days.',
    tags: ['disclosure', 'responsible disclosure', 'cve', 'timeline', '90 days'],
    agentHint: 'Record timestamp of initial report. Track vendor responses. If no fix in 90 days, prepare a limited public disclosure. Follow CVD norms and coordinate with CERT if critical.',
  },
]

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

function difficultyClass(d) {
  return `skills-badge skills-badge--${d}`
}

function SkillCard({ skill, onCopy }) {
  return (
    <article className="skills-card">
      <div className="skills-card-header">
        <div className="skills-card-labels">
          <span className="skills-cat-badge">{SKILL_CATEGORIES[skill.category]}</span>
          <span className={difficultyClass(skill.difficulty)}>{skill.difficulty}</span>
        </div>
        <button
          className="skills-copy-btn"
          title="Copy skill as JSON"
          onClick={() => onCopy(skill)}
        >
          Copy
        </button>
      </div>
      <h3 className="skills-card-name">{skill.name}</h3>
      <p className="skills-card-desc">{skill.description}</p>
      <div className="skills-agent-hint">
        <span className="skills-agent-label">Agent hint</span>
        <p>{skill.agentHint}</p>
      </div>
      <div className="skills-tags">
        {skill.tags.map(tag => (
          <span key={tag} className="skills-tag">{tag}</span>
        ))}
      </div>
    </article>
  )
}

export default function Skills() {
  useSEO({
    title: 'Agent Skills — R0uty\'s Cyber Lab',
    description: 'My pentesting and bug bounty skill library for agent-assisted workflows. Browse, filter, and export structured skill definitions.',
    keywords: 'agent skills, pentesting skills, bug bounty skills, ai agents, security skill library, recon, exploitation, reporting',
  })

  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [copied, setCopied] = useState(null)

  const filtered = useMemo(() => {
    return SKILLS.filter(s => {
      const catOk = activeCategory === 'all' || s.category === activeCategory
      const diffOk = activeDifficulty === 'all' || s.difficulty === activeDifficulty
      return catOk && diffOk
    })
  }, [activeCategory, activeDifficulty])

  const copySkill = (skill) => {
    const json = JSON.stringify(skill, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      setCopied(skill.id)
      setTimeout(() => setCopied(null), 1800)
    })
  }

  const copyAll = () => {
    const json = JSON.stringify(filtered, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      setCopied('all')
      setTimeout(() => setCopied(null), 1800)
    })
  }

  return (
    <div className="tool-page skills-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <span className="skills-kicker">Personal skill library</span>
        <h1>Pentesting &amp; Bug Bounty Agent Skills</h1>
        <p>This is my structured skill collection for agent-assisted testing. Each skill includes a practical hint you can paste into a prompt or tool call.</p>
        <div className="skills-header-meta">
          <div className="skills-header-pill"><span>Agent Skills</span><strong>{SKILLS.length}</strong></div>
          <div className="skills-header-pill"><span>Categories</span><strong>{Object.keys(SKILL_CATEGORIES).length}</strong></div>
          <div className="skills-header-pill"><span>Format</span><strong>JSON-ready</strong></div>
        </div>
      </div>

      <div className="skills-controls">
        <div className="skills-filter-group">
          <span className="skills-filter-label">Category</span>
          <div className="skills-filter-pills">
            <button
              className={activeCategory === 'all' ? 'skills-filter-pill active' : 'skills-filter-pill'}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {Object.entries(SKILL_CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                className={activeCategory === key ? 'skills-filter-pill active' : 'skills-filter-pill'}
                onClick={() => setActiveCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="skills-filter-group">
          <span className="skills-filter-label">Difficulty</span>
          <div className="skills-filter-pills">
            <button
              className={activeDifficulty === 'all' ? 'skills-filter-pill active' : 'skills-filter-pill'}
              onClick={() => setActiveDifficulty('all')}
            >
              All
            </button>
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                className={activeDifficulty === d ? 'skills-filter-pill active' : 'skills-filter-pill'}
                onClick={() => setActiveDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="skills-controls-actions">
          <span className="skills-result-count">{filtered.length} skill{filtered.length !== 1 ? 's' : ''}</span>
          <button className="skills-export-btn" onClick={copyAll}>
            {copied === 'all' ? 'Copied!' : `Copy ${filtered.length} as JSON`}
          </button>
        </div>
      </div>

      <div className="skills-grid">
        {filtered.map(skill => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onCopy={(s) => copySkill(s)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="skills-empty">No skills match the current filters.</p>
        )}
      </div>
    </div>
  )
}
