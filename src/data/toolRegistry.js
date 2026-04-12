export const TOOL_CATALOG = [
  // Encoding & Decoding
  {
    category: 'Encoding & Decoding',
    iconName: 'RotateClockwiseIcon',
    title: 'ROT',
    description: 'Encode and decode ROT13 and ROT47 cipher text.'
  },
  {
    category: 'Encoding & Decoding',
    iconName: 'File01Icon',
    title: 'Base64',
    description: 'Encode and decode Base64 strings.'
  },
  {
    category: 'Encoding & Decoding',
    iconName: 'Link01Icon',
    title: 'URL Encoder',
    description: 'Encode and decode URLs for safe web transmission.'
  },
  {
    category: 'Encoding & Decoding',
    iconName: 'HtmlFiveIcon',
    title: 'HTML Encoder',
    description: 'Encode text to HTML entities and decode HTML entities back to plain text.'
  },
  // Hashing & Tokens
  {
    category: 'Hashing & Tokens',
    iconName: 'HashtagIcon',
    title: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256, and more hash algorithms.'
  },
  {
    category: 'Hashing & Tokens',
    iconName: 'LockIcon',
    title: 'JWT Debugger',
    description: 'Decode and debug JWT tokens to see their content.'
  },
  {
    category: 'Hashing & Tokens',
    iconName: 'Ticket01Icon',
    title: 'JWT Encoder',
    description: 'Create and verify JWT tokens with custom payload and signature.'
  },
  // Formatters & Converters
  {
    category: 'Formatters & Converters',
    iconName: 'FileScriptIcon',
    title: 'JSON Formatter',
    description: 'Format and validate JSON with proper indentation.'
  },
  {
    category: 'Formatters & Converters',
    iconName: 'File01Icon',
    title: 'YAML Formatter',
    description: 'Format YAML files and convert to JSON.'
  },
  {
    category: 'Formatters & Converters',
    iconName: 'DocumentCodeIcon',
    title: 'Markdown Preview',
    description: 'Convert and preview markdown with live rendering.'
  },
  {
    category: 'Formatters & Converters',
    iconName: 'Xml01Icon',
    title: 'XML Formatter',
    description: 'Format and validate XML with proper indentation.'
  },
  {
    category: 'Formatters & Converters',
    iconName: 'Database01Icon',
    title: 'SQL Formatter',
    description: 'Format and validate SQL queries with proper indentation.'
  },
  {
    category: 'Formatters & Converters',
    iconName: 'GridIcon',
    title: 'CSV Formatter',
    description: 'Parse, format, and convert CSV to/from JSON.'
  },
  {
    category: 'Formatters & Converters',
    iconName: 'IdeaIcon',
    title: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, and HSV color formats with live preview.'
  },
  {
    category: 'Formatters & Converters',
    iconName: 'CssFile02Icon',
    title: 'CSS Beautifier',
    description: 'Format, minify, and validate CSS with file size optimization analysis.'
  },
  {
    category: 'Formatters & Converters',
    iconName: 'BinaryCodeIcon',
    title: 'Number Base Converter',
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal with prefix and bit-length output.'
  },
  // Generators
  {
    category: 'Generators',
    iconName: 'IdentityCardIcon',
    title: 'UUID Generator',
    description: 'Generate and validate UUID v1 and v4 identifiers.'
  },
  {
    category: 'Generators',
    iconName: 'PasswordValidationIcon',
    title: 'Password Generator',
    description: 'Generate secure passwords with customizable options and strength analysis.'
  },
  {
    category: 'Generators',
    iconName: 'MobileNavigator02Icon',
    title: 'QR Code Generator',
    description: 'Generate QR codes from text, URLs, and contact information.'
  },
  // Analyzers & Parsers
  {
    category: 'Analyzers & Parsers',
    iconName: 'Clock01Icon',
    title: 'Cron Parser',
    description: 'Parse and understand cron expressions easily.'
  },
  {
    category: 'Analyzers & Parsers',
    iconName: 'Search01Icon',
    title: 'Regex Tester',
    description: 'Test regex patterns with live matching and highlighting.'
  },
  {
    category: 'Analyzers & Parsers',
    iconName: 'ArrowDataTransferHorizontalIcon',
    title: 'Text / JSON Diff Viewer',
    description: 'Compare two versions of text or JSON side by side with normalized JSON formatting and line-by-line changes.'
  },
  {
    category: 'Analyzers & Parsers',
    iconName: 'GlobeIcon',
    title: 'HTTP Headers Parser',
    description: 'Parse raw HTTP request or response headers, detect duplicates, and review common security headers.'
  },
  {
    category: 'Analyzers & Parsers',
    iconName: 'Calendar01Icon',
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates.'
  },
  {
    category: 'Analyzers & Parsers',
    iconName: 'LockKeyIcon',
    title: 'CSP Generator & Analyzer',
    description: 'Build Content-Security-Policy headers, generate meta tags, and analyze pasted CSP strings for risky directives.'
  },
  // Penetration Testing Tools
  {
    category: 'Penetration Testing',
    iconName: 'CommandLineIcon',
    title: 'Reverse Shell Generator',
    description: 'Generate reverse shell payloads for authorized penetration testing. Supports bash, python, PHP, perl, ruby, netcat, and PowerShell.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'AiSecurity02Icon',
    title: 'XXE Generator',
    description: 'Generate XXE (XML External Entity) payloads for authorized security testing. Includes file disclosure, SSRF, and blind XXE techniques.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'Bug02Icon',
    title: 'XSS Generator',
    description: 'Generate XSS (Cross-Site Scripting) payloads for authorized web security testing. Includes stored, reflected, DOM-based, and WAF bypass techniques.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'Database01Icon',
    title: 'SQL Injection Generator',
    description: 'Generate SQL injection payloads for authorized security testing. Includes union-based, blind, time-based, and error-based techniques.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'DatabaseIcon',
    title: 'NoSQL Injection Generator',
    description: 'Generate NoSQL injection payloads for authorized security testing across MongoDB, CouchDB, Elasticsearch, and unsafe JSON-filter APIs.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'CodeIcon',
    title: 'GraphQL Injection Generator',
    description: 'Generate GraphQL injection and introspection payloads for authorized security testing. Includes schema enumeration, authentication bypass, and DoS techniques.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'DocumentCodeIcon',
    title: 'SSTI Generator & Analyzer',
    description: 'Generate SSTI probes and analyze pasted outputs or error traces for Jinja2, Twig, Freemarker, Velocity, Smarty, Handlebars, and Liquid.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'GitPullRequestIcon',
    title: 'HTTP Parameter Pollution Generator',
    description: 'Generate HTTP parameter pollution payloads for authorized security testing. Includes WAF bypass, cache poisoning, and backend confusion techniques.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'GlobeIcon',
    title: 'SSRF Generator',
    description: 'Generate SSRF payloads for authorized security testing, including cloud metadata, internal service, file read, IP bypass, protocol, and DNS/OOB probes.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'ComputerTerminal01Icon',
    title: 'Command Injection Generator',
    description: 'Generate OS command injection payloads for authorized security testing. Includes basic, blind, filter bypass, Windows, Linux, data exfiltration, and OOB techniques.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'DatabaseIcon',
    title: 'LDAP Injection Generator',
    description: 'Generate LDAP injection payloads for authorized security testing. Includes authentication bypass, information disclosure, blind injection, and search filter manipulation.'
  },
  {
    category: 'Penetration Testing',
    iconName: 'Folder01Icon',
    title: 'Path Traversal Generator',
    description: 'Generate path traversal (directory traversal / LFI) payloads for authorized security testing. Includes basic, encoded, filter-bypass, Windows, Linux, and null-byte techniques.'
  },
  {
    category: 'Analyzers & Parsers',
    iconName: 'CellularNetworkIcon',
    title: 'IP Subnet Calculator',
    description: 'Calculate subnet details from CIDR notation: network address, broadcast, subnet mask, usable hosts, and more.'
  }
]

const TOOL_COMPONENT_KEYS = {
  ROT: 'ROT',
  Base64: 'Base64',
  'URL Encoder': 'URLEncoder',
  'Hash Generator': 'HashGenerator',
  'Cron Parser': 'CronParser',
  'JWT Debugger': 'JWTDebugger',
  'JSON Formatter': 'JSONFormatter',
  'YAML Formatter': 'YAMLFormatter',
  'Markdown Preview': 'MarkdownPreview',
  'Regex Tester': 'RegexTester',
  'Text / JSON Diff Viewer': 'DiffViewer',
  'HTTP Headers Parser': 'HTTPHeadersParser',
  'XML Formatter': 'XMLFormatter',
  'SQL Formatter': 'SQLFormatter',
  'CSV Formatter': 'CSVFormatter',
  'UUID Generator': 'UUIDGenerator',
  'Timestamp Converter': 'TimestampConverter',
  'Password Generator': 'PasswordGenerator',
  'JWT Encoder': 'JWTEncoder',
  'QR Code Generator': 'QRCodeGenerator',
  'Color Converter': 'ColorConverter',
  'CSS Beautifier': 'CSSBeautifier',
  'HTML Encoder': 'HTMLEncoder',
  'CSP Generator & Analyzer': 'CSPGenerator',
  'Reverse Shell Generator': 'ReverseShellGenerator',
  'XXE Generator': 'XXEGenerator',
  'XSS Generator': 'XSSGenerator',
  'SQL Injection Generator': 'SQLInjectionGenerator',
  'NoSQL Injection Generator': 'NoSQLInjectionGenerator',
  'GraphQL Injection Generator': 'GraphQLInjectionGenerator',
  'SSTI Generator & Analyzer': 'SSTIGenerator',
  'HTTP Parameter Pollution Generator': 'HTTPParameterPollutionGenerator',
  'SSRF Generator': 'SSRFGenerator',
  'Command Injection Generator': 'CommandInjectionGenerator',
  'LDAP Injection Generator': 'LDAPInjectionGenerator',
  'Path Traversal Generator': 'PathTraversalGenerator',
  'Number Base Converter': 'NumberBaseConverter',
  'IP Subnet Calculator': 'SubnetCalculator'
}

export function buildToolComponents(componentLibrary) {
  return Object.fromEntries(
    Object.entries(TOOL_COMPONENT_KEYS).map(([toolTitle, componentName]) => [toolTitle, componentLibrary[componentName]])
  )
}
