# 🔒 CyberLock Tools

A fast, privacy-first toolkit for encoding, decoding, hashing, and automation utilities. All processing happens in your browser—no data is sent to any server.

## ✨ Features

- **🔄 ROT Cipher** - Encode and decode ROT13/ROT47 with adjustable shift (0-25)
- **📝 Base64** - Encode and decode Base64 strings with error handling
- **🔗 URL Encoder** - Coming soon
- **#️⃣ Hash Generator** - Coming soon
- **⏰ Cron Parser** - Coming soon

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/R0uty/CyberLockTools.git
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

## 📦 Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite 8
- **Styling:** CSS3 with animations
- **Package Manager:** npm

## 🔒 Privacy

All processing happens entirely in your browser. No data is transmitted to any server. Your sensitive information stays on your device.

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx      # Navigation header
│   └── ToolCard.jsx    # Tool card component
├── pages/
│   ├── ROT.jsx         # ROT cipher tool
│   └── Base64.jsx      # Base64 encoder/decoder
├── App.jsx             # Main app component with routing
├── App.css             # Global styles and animations
└── main.jsx            # React entry point
```

## 🎨 Design

- Modern gradient theme (purple/blue)
- Smooth animations and transitions
- Fully responsive design
- Accessible UI components
- Professional error handling

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

MIT

## 🎯 Roadmap

- [ ] URL Encoder tool
- [ ] Hash Generator (MD5, SHA1, SHA256, etc.)
- [ ] Cron Parser
- [ ] JWT Debugger
- [ ] JSON Formatter
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts
- [ ] Settings/preferences panel
