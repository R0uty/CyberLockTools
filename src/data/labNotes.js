export const labNotesByTool = {
  ROT: {
    what: 'A classic letter-substitution cipher tool for rotating alphabetic characters by a fixed amount, mainly ROT13 and ROT47.',
    usedFor: 'Used in basic cryptography lessons, simple puzzle solving, CTF warmups, and quickly decoding obfuscated text found in forums or challenges.',
    example: 'Common when someone hides spoilers or challenge hints with ROT13.'
  },
  Base64: {
    what: 'A converter for Base64, the text-safe encoding format often used to represent binary data as ASCII characters.',
    usedFor: 'Used in APIs, HTTP headers, JWT segments, email MIME content, and anywhere binary bytes need to travel through text-only systems.',
    example: 'Useful when inspecting Authorization headers, inline images, or encoded blobs in requests.'
  },
  'URL Encoder': {
    what: 'A utility that percent-encodes and decodes reserved URL characters so they can safely live inside paths and query strings.',
    usedFor: 'Used when building links, crafting requests, debugging query parameters, and making sure special characters do not break routing or parsing.',
    example: 'Helpful when spaces, ampersands, slashes, or Unicode characters appear inside a query parameter.'
  },
  'HTML Encoder': {
    what: 'A tool for converting raw characters into HTML entities and decoding those entities back into readable text.',
    usedFor: 'Used when working with rendered markup, preventing unsafe HTML output, and understanding how user input is transformed inside pages or templates.',
    example: 'Useful when you need <, >, ", or & to display as text instead of being interpreted as markup.'
  },
  'Hash Generator': {
    what: 'A browser-side hashing tool for generating common cryptographic digests like MD5, SHA-1, SHA-256, and SHA-512.',
    usedFor: 'Used for integrity checks, file verification, quick comparisons, and learning how different hash algorithms represent the same input.',
    example: 'Useful when comparing a downloaded file hash with a published checksum.'
  },
  'JWT Debugger': {
    what: 'A decoder for JSON Web Tokens that breaks the token into header, payload, and signature sections for inspection.',
    usedFor: 'Used when debugging authentication flows, checking claims, reading expiration data, and understanding what an application stores inside a token.',
    example: 'Helpful when verifying exp, aud, iss, sub, or role claims during API testing.'
  },
  'JWT Encoder': {
    what: 'A tool for building and signing JSON Web Tokens with custom claims and secret material.',
    usedFor: 'Used for local auth testing, reproducing token formats in development, and understanding how signed JWTs are assembled.',
    example: 'Useful when testing a local API that expects a custom JWT structure.'
  },
  'JSON Formatter': {
    what: 'A formatter and validator for JSON documents that turns minified or messy JSON into readable structured data.',
    usedFor: 'Used in API debugging, config review, payload inspection, and quickly spotting broken commas, braces, or nesting issues.',
    example: 'Helpful when copying raw API responses from logs or browser dev tools.'
  },
  'YAML Formatter': {
    what: 'A formatter for YAML with conversion support for JSON-style workflows.',
    usedFor: 'Used with CI/CD configs, Docker Compose, Kubernetes manifests, GitHub Actions files, and other indentation-sensitive configuration formats.',
    example: 'Useful when cleaning up a misaligned YAML file before committing it.'
  },
  'Markdown Preview': {
    what: 'A live Markdown rendering tool that turns plain-text markdown into readable formatted output.',
    usedFor: 'Used when drafting documentation, README files, notes, changelogs, and issue content before publishing it.',
    example: 'Helpful for checking headings, code blocks, links, and lists before pushing docs.'
  },
  'XML Formatter': {
    what: 'A formatter and validator for XML documents with readable indentation and structure cleanup.',
    usedFor: 'Used with SOAP requests, legacy APIs, SAML data, config files, and any workflow where raw XML is difficult to read.',
    example: 'Useful when inspecting API responses that arrive as one long XML line.'
  },
  'SQL Formatter': {
    what: 'A query formatter that restructures SQL into readable clauses and indentation.',
    usedFor: 'Used when reviewing large queries, debugging joins, understanding nested statements, and cleaning SQL before sharing it with others.',
    example: 'Helpful when a logged query is too compressed to read safely.'
  },
  'CSV Formatter': {
    what: 'A parser and converter for comma-separated data that helps normalize tables and switch between CSV and JSON-style views.',
    usedFor: 'Used with exports, spreadsheets, quick data cleanup, and bulk data handling during development or analysis.',
    example: 'Useful when an export contains quoting or delimiter issues and needs quick inspection.'
  },
  'Color Converter': {
    what: 'A color utility for translating between HEX, RGB, HSL, and HSV formats while previewing the result.',
    usedFor: 'Used in frontend development, design cleanup, theme work, and converting colors between design tools and CSS.',
    example: 'Helpful when a design hands you RGB but your stylesheet needs HEX or HSL.'
  },
  'CSS Beautifier': {
    what: 'A formatter and cleanup tool for CSS that improves readability and highlights size or structure issues.',
    usedFor: 'Used when auditing stylesheets, cleaning minified CSS, and understanding how selectors and declarations are organized.',
    example: 'Useful when pasting compressed CSS from production to inspect a broken rule.'
  },
  'Number Base Converter': {
    what: 'A converter for moving values between binary, octal, decimal, and hexadecimal number systems.',
    usedFor: 'Used in low-level debugging, bitwise work, protocol analysis, memory offsets, and learning number representations used in code and systems.',
    example: 'Helpful when translating hex values from logs into decimal or binary for troubleshooting.'
  },
  'UUID Generator': {
    what: 'A tool for generating and validating UUID/GUID identifiers, especially common random and time-based variants.',
    usedFor: 'Used when seeding test data, mocking identifiers, generating object IDs, and checking if a string matches expected UUID structure.',
    example: 'Useful when an API requires a valid UUID before it will accept a request.'
  },
  'Password Generator': {
    what: 'A configurable password generator with strength-focused settings for length and character variety.',
    usedFor: 'Used for creating secure credentials, demo accounts, test fixtures, and one-off secrets without reusing unsafe patterns.',
    example: 'Helpful when provisioning a lab account or rotating a local admin password.'
  },
  'QR Code Generator': {
    what: 'A tool for turning text, URLs, or contact-style data into scannable QR codes.',
    usedFor: 'Used in sharing links, Wi-Fi details, quick mobile testing, printed handoffs, and demos where camera-based transfer is easier than typing.',
    example: 'Useful when moving a local dev URL from desktop to phone.'
  },
  'Cron Parser': {
    what: 'A cron expression helper that explains or generates scheduled task syntax in human-readable form.',
    usedFor: 'Used when configuring automation jobs, system tasks, scheduled scripts, and CI maintenance work that depends on cron timing.',
    example: 'Helpful when translating */15 * * * * into plain English.'
  },
  'Regex Tester': {
    what: 'A live regex workbench for testing patterns, flags, replacements, and matches against sample text.',
    usedFor: 'Used in validation, parsing, log analysis, input cleanup, and debugging complex pattern behavior before using it in code.',
    example: 'Useful when checking whether a pattern captures the exact group you expect.'
  },
  'Text / JSON Diff Viewer': {
    what: 'A side-by-side comparison tool for plain text and normalized JSON content.',
    usedFor: 'Used when reviewing config changes, comparing API payloads, inspecting output drift, or seeing exactly what changed between two versions.',
    example: 'Helpful when two JSON responses look similar but behave differently.'
  },
  'HTTP Headers Parser': {
    what: 'A parser that turns raw request or response headers into structured fields and highlights duplicate or missing security-related values.',
    usedFor: 'Used during API debugging, proxy analysis, response hardening review, and header cleanup when reading traffic captures or logs.',
    example: 'Useful when pasting a full response to quickly see missing security headers.'
  },
  'Timestamp Converter': {
    what: 'A converter between Unix timestamps and readable date/time values.',
    usedFor: 'Used when reading logs, API events, JWT times, database values, and any workflow where raw epoch times need human interpretation.',
    example: 'Helpful when a token expiration or log field is stored as a raw epoch value.'
  },
  'CSP Generator & Analyzer': {
    what: 'A tool for building and reviewing Content-Security-Policy rules for browsers.',
    usedFor: 'Used in frontend security hardening, header tuning, inline script reduction, and reviewing risky directives that weaken page protections.',
    example: 'Useful when tightening script-src or checking whether unsafe-inline is present.'
  },
  'CORS Analyzer': {
    what: 'A browser-side analyzer for Access-Control-* response headers that checks how a supplied Origin and credential mode interact with browser CORS rules.',
    usedFor: 'Used in authorized testing when reviewing API responses, origin reflection behavior, wildcard policies, null-origin handling, and credentialed cross-origin data exposure.',
    example: 'Helpful when a response returns Access-Control-Allow-Origin and you want to see whether a specific untrusted origin would actually be able to read it in the browser.'
  },
  'Reverse Shell Generator': {
    what: 'A payload generator for reverse shell command variants across several languages and environments.',
    usedFor: 'Used in authorized red-team, pentest, and lab scenarios when preparing controlled shell callbacks for approved targets.',
    example: 'Helpful when switching between bash, Python, PowerShell, or netcat payloads in a test environment.'
  },
  'XXE Generator': {
    what: 'A payload reference for XML External Entity testing across disclosure, SSRF, and blind XXE cases.',
    usedFor: 'Used in authorized assessments of XML parsers, SOAP endpoints, upload handlers, and document-processing workflows.',
    example: 'Useful when testing whether an XML parser resolves external entities unsafely.'
  },
  'XSS Generator': {
    what: 'A browser-side payload library for reflected, stored, DOM-based, and bypass-oriented XSS testing.',
    usedFor: 'Used in authorized web application testing to check output encoding, client-side rendering paths, and sanitization weaknesses.',
    example: 'Helpful when moving from a simple alert-style probe to context-specific payload variants.'
  },
  'SQL Injection Generator': {
    what: 'A curated set of SQL injection payloads spanning union, boolean, error-based, and time-based techniques.',
    usedFor: 'Used in authorized database-layer testing when checking input handling, query concatenation, and backend error behavior.',
    example: 'Useful when a parameter behaves differently under quote, union, or sleep-based probes.'
  },
  'NoSQL Injection Generator': {
    what: 'A payload library for NoSQL-style query abuse across MongoDB, CouchDB, Elasticsearch, and unsafe object-based filters.',
    usedFor: 'Used in authorized testing of JSON APIs, search endpoints, login handlers, and update routes that may merge user input directly into query objects.',
    example: 'Helpful when a backend accepts nested JSON and reacts differently to operators like $ne, $regex, $or, or wildcard query objects.'
  },
  'GraphQL Injection Generator': {
    what: 'A payload and probe set for GraphQL-focused misuse, including introspection, schema discovery, and injection-style testing paths.',
    usedFor: 'Used in authorized API assessments where GraphQL resolvers, filters, and query depth controls need security review.',
    example: 'Helpful when checking whether introspection or weak resolver filtering is exposed in production.'
  },
  'SSTI Generator & Analyzer': {
    what: 'A tool for generating Server-Side Template Injection probes and fingerprinting likely template engines from output or errors.',
    usedFor: 'Used in authorized testing of server-rendered templates, especially when trying to distinguish engines like Jinja2, Twig, Freemarker, or Liquid.',
    example: 'Useful when a rendered value changes after arithmetic probes or leaks engine-specific error text.'
  },
  'HTTP Parameter Pollution Generator': {
    what: 'A payload generator for duplicated or conflicting parameters that different backends may interpret in different ways.',
    usedFor: 'Used in authorized testing of proxies, WAFs, frameworks, and application servers where duplicate parameter handling can cause bypasses or confusion.',
    example: 'Helpful when frontend and backend disagree on which repeated parameter wins.'
  },
  'SSRF Generator': {
    what: 'A payload library for Server-Side Request Forgery testing across metadata services, internal hosts, alternate schemes, and OOB callbacks.',
    usedFor: 'Used in authorized testing of fetchers, webhooks, URL importers, and any feature that makes server-side outbound requests.',
    example: 'Useful when checking access to cloud metadata or localhost-only services through a URL input.'
  },
  'Command Injection Generator': {
    what: 'A payload reference for OS command injection testing with Linux, Windows, blind, and bypass-oriented examples.',
    usedFor: 'Used in authorized testing when user input may reach shell commands, wrappers, job runners, or system utilities.',
    example: 'Helpful when exploring separator, subshell, or delayed execution behavior in a vulnerable parameter.'
  },
  'LDAP Injection Generator': {
    what: 'A payload library for testing unsafe LDAP filter construction and directory-query manipulation.',
    usedFor: 'Used in authorized assessments of auth flows, user lookups, and enterprise applications that build LDAP queries from user input.',
    example: 'Useful when checking whether login or search filters can be broadened or bypassed.'
  },
  'Path Traversal Generator': {
    what: 'A set of directory traversal payloads for reading unintended files through path handling weaknesses.',
    usedFor: 'Used in authorized testing of download endpoints, file viewers, image handlers, and archive extraction logic.',
    example: 'Helpful when trying plain ../ probes, encoded traversal, or platform-specific path styles.'
  },
  'IP Subnet Calculator': {
    what: 'A network calculation tool that breaks CIDR notation into subnet masks, ranges, usable hosts, and related addressing details.',
    usedFor: 'Used in networking, infrastructure planning, firewall reviews, VPN setup, and quickly understanding address boundaries during troubleshooting.',
    example: 'Useful when checking host range and broadcast details for a /24 or /27 network.'
  }
}

export const getLabNote = (tool) => {
  const note = labNotesByTool[tool.title]

  if (note) {
    return note
  }

  return {
    what: tool.description,
    usedFor: `Used in ${tool.category.toLowerCase()} workflows when you need quick browser-side access to this utility.`,
    example: 'Open the tool directly to explore its inputs, outputs, and common workflows.'
  }
}
