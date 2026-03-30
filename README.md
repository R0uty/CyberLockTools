# 🔒 CyberLock Tools

A comprehensive, privacy-first suite of **free online tools** for developers, security professionals, and students. Featuring encoding/decoding utilities, cryptographic hash generators, and automation tools. **All processing happens in your browser** — no data is sent to any server, completely private and secure.

**🌐 Live Demo:** https://cyberlocktools.com (or your deployment URL)

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

## 🎯 Use Cases

**For Developers:**
- Quick URL encoding/decoding for APIs
- Base64 encoding for data transmission
- Hash generation for checksums and verification
- Cron expression builder for scheduled tasks

**For Security Professionals:**
- Educational cryptography demonstrations
- Hash generation and analysis
- Encoding scheme exploration

**For Students:**
- Learn about cryptography and encoding
- Understand cron scheduling
- Explore different cipher types
- Study cryptographic algorithms

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
│   ├── About.jsx           # About page with mission and tech stack
│   └── Contact.jsx         # Contact form
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

All pages are optimized for search engines:

- **Homepage:** Targets "online tools" and general keywords
- **ROT Tool:** Targets "online rot13 tool", "caesar cipher"
- **Base64 Tool:** Targets "base64 encoder", "base64 decoder"
- **URL Tool:** Targets "online url tool", "url encoder"
- **Hash Tool:** Targets "hash generator", "sha256", "md5"
- **Cron Tool:** Targets "cron parser", "cron expression"

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
- ✅ About Page
- ✅ Contact Page
- ✅ SEO Optimization
- ✅ Navigation System
- ✅ Responsive Design

### Planned Features 🔜
- [ ] JWT Debugger / Validator
- [ ] JSON Formatter & Validator
- [ ] YAML Formatter
- [ ] Markdown Preview
- [ ] Dark Mode Toggle
- [ ] Keyboard Shortcuts
- [ ] Settings/Preferences Panel
- [ ] History of Recent Operations
- [ ] Export/Download Results
- [ ] More Hash Algorithms (BLAKE2, Argon2)
- [ ] Regex Tester
- [ ] XML Formatter
- [ ] API Documentation

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

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature suggestion? 

1. **GitHub Issues:** Open an issue on the repository
2. **Contact Form:** Use the contact page on the website
3. **Email:** Include feature requests or bug reports

## 📈 Performance

- **Build Size:** ~320 KB JavaScript + 13.6 KB CSS
- **Gzipped:** ~103 KB total
- **Load Time:** < 2 seconds on modern connections
- **Runtime:** No external server calls, instant processing
- **Caching:** All dependencies cached in dist/

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
