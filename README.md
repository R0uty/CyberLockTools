# 🔒 CyberLock Tools

A comprehensive, privacy-first suite of **free online tools** for developers, security professionals, and students. Featuring encoding/decoding utilities, cryptographic hash generators, penetration testing payload generators, and automation tools. **All processing happens in your browser** — no data is sent to any server, completely private and secure.

**🌐 Live Demo:** https://cyberlocktools.com (or your deployment URL)

## Release Notes - Sprint 9 to 14

### Summary
- Added a Flow Map testing baseline with deterministic interaction tests.
- Added utility tests for JSON formatter, number base converter, and HTTP headers parser.
- Introduced Vitest coverage wiring and test-specific ESLint globals.
- Normalized Flow Map copy and major formatter/parser page copy for consistency.
- Hardened responsive behavior for Flow Map and improved dark-theme consistency in formatter/JWT CSS.
- Completed a release-candidate QA sweep (automated checks clean; manual browser-tooling check deferred to human pass).

### Changed Areas (Changelog Style)
- Testing infrastructure:
  - Added `vitest`, `@testing-library/react`, `jsdom`, `@vitest/coverage-v8`.
  - Added scripts for `test`, `test:watch`, and `test:coverage`.
  - Added test lint globals in `eslint.config.js`.
  - Added `test` config block in `vite.config.js`.
- New tests:
  - `src/pages/FlowMap.test.jsx`
  - `src/utils/jsonFormatter.test.js`
  - `src/utils/numberBaseConverter.test.js`
  - `src/utils/httpHeadersParser.test.js`
- Flow Map consistency:
  - Standardized stage labels and action copy (`Start flow`, `Restart`, `Result`, `Continue to ...`).
  - Synced flow node labels in `src/data/flowMapConfig.js` and tests.
- Responsive and CSS hardening:
  - FlowMap mobile control/panel behavior improved for narrow viewports.
  - JSON/SQL/XML/CSV and JWT-related CSS updated to remove legacy light blocks and align with dark theme.

## Architecture Entry Points

- App shell and routing state: `src/App.jsx`
- Tool registry and title-to-component mapping: `src/data/toolRegistry.js`
- Flow engine configuration (stages/nodes/connections): `src/data/flowMapConfig.js`
- Flow story content renderer: `src/pages/flowMapStoryContent.jsx`
- Flow page orchestration + persisted flow state: `src/pages/FlowMap.jsx`
- Session storage wrapper used by FlowMap: `src/utils/sessionStorage.js`
- Shared SEO hook contract: `src/hooks/useSEO.js`
- Core formatter/parser utilities under test: `src/utils/*.js`

## ✨ Features

### 🔄 ROT13 & Caesar Cipher Tool
- Encode and decode ROT13, ROT47, and Caesar cipher variants
- Adjustable rotation amount (0-25 shift values)
- Real-time output with copy-to-clipboard
- Educational info about cipher mechanisms

### 📝 Base64 Encoder & Decoder
- Encode text to Base64 format
- Decode Base64 strings back to plain text
- Perfect for data transmission and API payloads
- Error handling for invalid Base64 input

### 🔗 URL Encoder & Decoder
- Encode text to URL-safe format (percent encoding)
- Decode URL-encoded strings
- Essential for query parameters and form data
- Handles special characters safely

### #️⃣ Hash Generator
- Generate hashes with multiple algorithms
- Supported: MD5, SHA-1, SHA-256, SHA-384, SHA-512
- Educational warnings for cryptographically broken algorithms
- Perfect for checksums and data integrity verification

### ⏰ Cron Expression Parser & Generator
- Build cron expressions with intuitive dropdowns
- Parse existing cron syntax into human-readable format
- Examples: "0 3 * * *" → "At 03:00 AM"
- Essential for task scheduling and automation

### 🔐 JWT Debugger & Decoder
- Decode JWT tokens to view header, payload, and signature
- Understand JWT structure and content
- Validate JWT format with helpful error messages
- Perfect for debugging authentication tokens
- Copy each JWT component to clipboard

### 📋 JSON Formatter & Validator
- Format raw JSON with 2-space indentation
- Validate JSON structure and show errors
- Display JSON statistics (type, size, depth, key count)
- Copy formatted JSON to clipboard
- Example JSON tokens included for testing

### 📄 YAML Formatter & Converter
- Format YAML files with proper indentation
- Convert YAML to JSON format
- Display YAML statistics and structure info
- Perfect for working with configuration files
- Example YAML configurations for testing

### 📑 Markdown Preview
- Live markdown editor with real-time preview
- Convert markdown to formatted HTML
- Copy markdown, HTML, or plain text to clipboard
- Download rendered HTML as a file
- Support for all markdown syntax features
- Perfect for documentation and content creation

### 🔍 Regex Tester
- Test regular expressions with live matching
- Support for regex flags (global, case-insensitive, multiline, single-line)
- Highlight matches in test string
- Extract capture groups automatically
- Test replace functionality with live preview
- Copy patterns, matches, or replaced text
- Download test results as text file

### 📋 XML Formatter & Validator
- Format XML with proper 2-space indentation
- Validate XML structure and syntax
- Minify XML to reduce file size
- Display XML statistics (element count, depth, attributes)
- Copy formatted XML or download as file
- Example XML documents for testing
- Perfect for API responses and configuration files

### 💉 Command Injection Generator
- Generate OS command injection payloads for authorized penetration testing
- Categories: Basic, Blind, Filter Bypass, Windows, Linux, Data Exfiltration, OOB
- Shell metacharacter reference and quick detection payloads
- Educational explanations for each technique

### 🗂️ LDAP Injection Generator
- Generate LDAP injection payloads for authorized security testing
- Categories: Authentication Bypass, Information Disclosure, Blind Injection, Search Filter Injection, Special Characters
- LDAP filter syntax reference
- Quick detection payloads for initial assessment

### 📂 Path Traversal Generator
- Generate path traversal (LFI/directory traversal) payloads for authorized testing
- Categories: Basic, Encoded, Filter Bypass, Windows Targets, Linux Targets, Null Byte
- High-value target file reference
- Encoded variants to bypass WAFs and input filters

### 🔢 Number Base Converter
- Convert between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16)
- Simultaneous conversion to all bases at once
- Quick examples with common values (ports, ASCII, IP octets)
- Reference table for each base system

### 🌐 IP Subnet Calculator
- Calculate subnet details from CIDR notation
- Network address, broadcast address, subnet mask, wildcard mask
- First/last usable host, total and usable host count
- Binary representation of IP and mask
- IP class detection and private range identification
- Common subnet quick-load examples and CIDR reference table

## 🎯 Use Cases

**For Developers:**
- Quick URL encoding/decoding for APIs
- Base64 encoding for data transmission
- Hash generation for checksums and verification
- Cron expression builder for scheduled tasks
- JWT token debugging for authentication flows
- JSON formatting for API responses
- YAML formatting for configuration files
- Markdown preview for documentation
- Regex testing for pattern matching
- XML formatting for data processing and APIs

**For Security Professionals:**
- Educational cryptography demonstrations
- Hash generation and analysis
- Encoding scheme exploration
- Regex pattern testing for security scanning

**For Students:**
- Learn about cryptography and encoding
- Understand cron scheduling
- Explore different cipher types
- Study cryptographic algorithms
- Practice regex patterns
- Work with data formats (JSON, XML, YAML)

## 🔒 Privacy & Security

✅ **100% Private:**
- All processing happens entirely in your browser using JavaScript
- No data is transmitted to any server
- No tracking cookies or analytics
- No account creation required
- Works completely offline

✅ **Open & Transparent:**
- Source code available on GitHub
- No hidden operations
- Educational warnings for weak algorithms
- Clear limitations documented

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/r0uty/CyberLockTools.git
cd CyberLockTools

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

The optimized production build will be in the `dist/` directory.

## 📦 Tech Stack

- **Frontend Framework:** React 19 with Hooks
- **Build Tool:** Vite 8
- **Styling:** CSS3 with gradient animations
- **Cryptography:** crypto-js (MD5, SHA algorithms)
- **Cron Parsing:** cronstrue (human-readable explanations)
- **YAML Processing:** js-yaml (YAML parsing and dumping)
- **Package Manager:** npm
- **Linting:** ESLint 9

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header with active links
│   └── ToolCard.jsx        # Reusable tool card component
├── hooks/
│   └── useSEO.js           # Dynamic SEO metadata management
├── pages/
│   ├── ROT.jsx             # ROT cipher tool
│   ├── Base64.jsx          # Base64 encoder/decoder
│   ├── URLEncoder.jsx      # URL encoder/decoder
│   ├── HashGenerator.jsx   # Hash generator with multiple algorithms
│   ├── CronParser.jsx      # Cron expression parser & builder
│   ├── JWTDebugger.jsx     # JWT token decoder
│   ├── JSONFormatter.jsx   # JSON formatter and validator
│   ├── YAMLFormatter.jsx   # YAML formatter and converter
│   ├── MarkdownPreview.jsx # Markdown editor with live preview
│   ├── RegexTester.jsx     # Regex pattern tester and matcher
│   ├── XMLFormatter.jsx    # XML formatter and validator
│   ├── Tools.jsx           # Tools browsing page with grid
│   ├── About.jsx           # About page with mission and tech stack
│   └── Contact.jsx         # Contact form
├── utils/
│   ├── jwtDecoder.js       # JWT decoding utility
│   ├── jsonFormatter.js    # JSON formatting and validation
│   ├── yamlFormatter.js    # YAML formatting and conversion
│   └── xmlFormatter.js     # XML formatting and validation
├── App.jsx                 # Main app component with routing
├── App.css                 # Global styles and animations
└── main.jsx                # React entry point

index.html                  # HTML template with SEO meta tags
```

## 🎨 Design & UX

- **Modern Design:** Purple/blue gradient theme
- **Smooth Animations:** Professional transitions and hover effects
- **Fully Responsive:** Works perfectly on desktop, tablet, and mobile
- **Accessible:** Semantic HTML and keyboard-friendly
- **Professional:** Error handling and helpful user feedback
- **Privacy Badge:** On every tool page showing data stays local

## 🛠️ Available Scripts

```bash
npm run dev       # Start development server with HMR
npm run build     # Build optimized production bundle
npm run preview   # Preview production build locally
npm run lint      # Run ESLint to check code quality
npm run test       # Run Vitest test suite once
npm run test:watch # Run Vitest in watch mode
npm run test:coverage # Run tests with V8 coverage report
```

Recommended release gate:

```bash
npm run test && npm run lint && npm run build
```

## 🔧 Features & Implementation

### Dynamic SEO Optimization
- Unique page titles and meta descriptions for each tool
- Keywords targeting "online [tool]" searches
- H1 tags and semantic HTML
- Open Graph tags for social sharing
- Dynamic metadata updates on page navigation

### Navigation System
- Header with active link highlighting
- Four main pages: Home, Tools, About, Contact
- Logo returns to home
- Tool cards navigate to individual tool pages
- Smooth page transitions

### Form Validation
- Contact form with required field validation
- Email format validation
- Success and error messages
- Form submission handling
- Professional user feedback

### Error Handling
- Input validation on all tools
- Clear error messages
- Graceful degradation
- User-friendly feedback

## 📊 SEO Implementation

### SEO Implementation
All pages are optimized for search engines:

- **Homepage:** Targets "online tools" and general keywords
- **Tools Page:** Targets "online tools" and tool browsing keywords
- **ROT Tool:** Targets "online rot13 tool", "caesar cipher"
- **Base64 Tool:** Targets "base64 encoder", "base64 decoder"
- **URL Tool:** Targets "online url tool", "url encoder"
- **Hash Tool:** Targets "hash generator", "sha256", "md5"
- **Cron Tool:** Targets "cron parser", "cron expression"
- **JWT Tool:** Targets "jwt debugger", "jwt decoder"
- **JSON Tool:** Targets "json formatter", "json validator"
- **YAML Tool:** Targets "yaml formatter", "yaml converter"
- **Markdown Tool:** Targets "markdown preview", "markdown editor"
- **Regex Tool:** Targets "regex tester", "regex tester online"
- **XML Tool:** Targets "xml formatter", "xml validator"

Each page includes:
- Unique, descriptive title (50-60 chars)
- Meta description (155-160 chars)
- Relevant keywords
- H1 tag with main keyword
- Internal links
- Rich content with examples

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the LICENSE file for details

## 🎯 Roadmap

### Completed ✅
- ✅ ROT13 & Caesar Cipher
- ✅ Base64 Encoder/Decoder
- ✅ URL Encoder/Decoder
- ✅ Hash Generator (MD5, SHA1, SHA256, SHA384, SHA512)
- ✅ Cron Parser & Generator
- ✅ JWT Debugger & Decoder
- ✅ JSON Formatter & Validator
- ✅ YAML Formatter & Converter
- ✅ Markdown Preview with live rendering
- ✅ Regex Tester with pattern matching
- ✅ XML Formatter & Validator
- ✅ SQL Formatter & Validator
- ✅ CSV Formatter & JSON converter
- ✅ UUID Generator (v1, v4)
- ✅ Unix Timestamp Converter
- ✅ Secure Password Generator
- ✅ JWT Encoder (create & verify)
- ✅ QR Code Generator
- ✅ Color Converter (HEX/RGB/HSL/HSV)
- ✅ CSS Beautifier & Minifier
- ✅ **Number Base Converter** (binary/octal/decimal/hex)
- ✅ **HTML Encoder & Decoder** (HTML entities)
- ✅ Reverse Shell Generator *(Pentest)*
- ✅ XXE Generator *(Pentest)*
- ✅ XSS Generator *(Pentest)*
- ✅ SQL Injection Generator *(Pentest)*
- ✅ GraphQL Injection Generator *(Pentest)*
- ✅ HTTP Parameter Pollution Generator *(Pentest)*
- ✅ **SSRF Generator** *(Pentest)*
- ✅ **Command Injection Generator** *(Pentest)*
- ✅ **Path Traversal Generator** *(Pentest)*
- ✅ Tools Browsing Page
- ✅ About Page
- ✅ Contact Page
- ✅ SEO Optimization
- ✅ Navigation System
- ✅ Responsive Design
- ✅ SQL Formatter & Validator
- ✅ CSV Parser & Formatter
- ✅ UUID Generator
- ✅ Timestamp Converter
- ✅ Password Generator
- ✅ JWT Encoder
- ✅ QR Code Generator
- ✅ Color Converter
- ✅ CSS Beautifier
- ✅ Reverse Shell Generator
- ✅ XXE Generator
- ✅ XSS Generator
- ✅ SQL Injection Generator
- ✅ GraphQL Injection Generator
- ✅ HTTP Parameter Pollution Generator
- ✅ Command Injection Generator
- ✅ LDAP Injection Generator
- ✅ Path Traversal Generator
- ✅ Number Base Converter
- ✅ IP Subnet Calculator

### Planned Features 🔜
- [ ] Dark Mode Toggle
- [ ] Keyboard Shortcuts
- [ ] Settings/Preferences Panel
- [ ] History of Recent Operations
- [ ] More Hash Algorithms (BLAKE2, Argon2)
- [ ] API Documentation

## Deferred Backlog

- Expand Flow Map interaction tests to cover additional flow families beyond current baseline scenarios.
- Add CI workflow with required `test`, `lint`, and `build` gates.
- Enforce minimum coverage thresholds in CI and publish coverage artifacts.
- Add route-level smoke automation (Playwright/Cypress) for key pages and top-risk interactions.
- Perform final manual cross-device visual QA pass in browser tooling before release sign-off.

## 💡 Usage Examples

### ROT13 Example
```
Input: "Hello World"
Shift: 13
Output: "Uryyb Jbeyq"
```

### Base64 Example
```
Input: "Hello World"
Action: Encode
Output: "SGVsbG8gV29ybGQ="
```

### URL Encoding Example
```
Input: "Hello World & More"
Action: Encode
Output: "Hello%20World%20%26%20More"
```

### Hash Example
```
Input: "password123"
Algorithm: SHA-256
Output: "ef92b778bafe771e89245d171bce4c4c5c8e7d5c..."
```

### Cron Expression Example
```
Dropdowns: 0 minute, 3 hour, * day, * month, * weekday
Expression: "0 3 * * *"
Meaning: "At 03:00 AM every day"
```

### JWT Debugger Example
```
Input: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

Output:
Header: {"alg": "HS256", "typ": "JWT"}
Payload: {"sub": "1234567890", "name": "John Doe"}
Signature: TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

### JSON Formatter Example
```
Input: {"name":"John","age":30,"city":"New York"}

Output:
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

### YAML Formatter Example
```
Input: app: MyApp
version: 1.0
debug: true

Output:
app: MyApp
version: 1.0
debug: true
```

### Markdown Preview Example
```
Input: 
# Hello World
This is **bold** and this is *italic*

Output:
<h1>Hello World</h1>
<p>This is <strong>bold</strong> and this is <em>italic</em></p>
```

### Regex Tester Example
```
Pattern: \d{3}-\d{4}
Test String: "Call 555-1234 or 555-5678"
Flags: global

Matches:
- 555-1234
- 555-5678
```

### XML Formatter Example
```
Input: <?xml version="1.0"?><root><user><name>John</name></user></root>

Output:
<?xml version="1.0"?>
<root>
  <user>
    <name>John</name>
  </user>
</root>
```

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature suggestion? 

1. **GitHub Issues:** Open an issue on the repository
2. **Contact Form:** Use the contact page on the website
3. **Email:** Include feature requests or bug reports

## 📊 Performance

- **Build Size:** ~451 KB JavaScript + 20 KB CSS
- **Gzipped:** ~137.75 KB JavaScript + 4.14 KB CSS (~142 KB total)
- **Load Time:** < 2 seconds on modern connections
- **Runtime:** No external server calls, instant processing
- **Caching:** All dependencies cached in dist/
- **11 Tools:** All integrated in a single optimized bundle
- **Module Count:** 77 modules bundled efficiently

## 🔐 Security Considerations

### What We Do
- ✅ All processing in browser (no server transmission)
- ✅ No persistent data storage
- ✅ No tracking or analytics
- ✅ No external API calls
- ✅ Educational warnings for weak algorithms

### What We Don't Do
- ❌ Store any user data
- ❌ Use cookies for tracking
- ❌ Send data to analytics services
- ❌ Require user accounts
- ❌ Recommend weak algorithms for security

### Important Notes
- **MD5 & SHA-1:** Cryptographically broken. Educational use only.
- **Production Use:** For real security, use bcrypt, scrypt, or Argon2
- **No Session Storage:** Data is cleared when browser tab closes

## 📞 Support

Have questions or need help?

- 📖 Check the About page for more information
- 💬 Use the Contact form to reach out
- 🐛 Report bugs on GitHub
- 📚 Read the tool descriptions for usage tips

## 👨‍💻 Author

**CyberLock Tools** - Built with ❤️ for developers and security enthusiasts

## ⭐ If you found this helpful

Please consider starring the repository to help others discover this project!

---

**Made with React, Vite, and a passion for open-source tools. Happy hashing! 🔐**
