import { useState } from 'react'
import { useSEO } from './hooks/useSEO'
import Header from './components/Header'
import ToolCard from './components/ToolCard'
import ROT from './pages/ROT'
import Base64 from './pages/Base64'
import URLEncoder from './pages/URLEncoder'
import HashGenerator from './pages/HashGenerator'
import CronParser from './pages/CronParser'
import JWTDebugger from './pages/JWTDebugger'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'

export default function App() {
  const [currentTool, setCurrentTool] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')

  useSEO({
    title: 'Free Online Tools Suite - Encoding, Hashing, and More',
    description: 'CyberLock Tools - Free collection of online encoding tools, hash generators, and utilities. ROT cipher, Base64 encoder, URL encoder, hash generator, and cron parser. All tools run securely in your browser.',
    keywords: 'online tools, encoder decoder, hash generator, base64, rot13, url encoder, cron parser, free tools'
  })

  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (page === 'tools') {
      setCurrentTool(null)
    }
  }

  const handleToolClick = (title) => {
    setCurrentTool(title)
    setCurrentPage('tools')
  }

  const handleLogoClick = () => {
    setCurrentTool(null)
    setCurrentPage('home')
  }

  const tools = [
    {
      icon: '🔄',
      title: 'ROT',
      description: 'Encode and decode ROT13 and ROT47 cipher text.'
    },
    {
      icon: '📝',
      title: 'Base64',
      description: 'Encode and decode Base64 strings.'
    },
    {
      icon: '🔗',
      title: 'URL Encoder',
      description: 'Encode and decode URLs for safe web transmission.'
    },
    {
      icon: '#️⃣',
      title: 'Hash Generator',
      description: 'Generate MD5, SHA1, SHA256, and more hash algorithms.'
    },
    {
      icon: '⏰',
      title: 'Cron Parser',
      description: 'Parse and understand cron expressions easily.'
    },
    {
      icon: '🔐',
      title: 'JWT Debugger',
      description: 'Decode and debug JWT tokens to see their content.'
    }
  ]

  if (currentTool === 'ROT') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <ROT />
        </div>
      </div>
    )
  }

  if (currentTool === 'Base64') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <Base64 />
        </div>
      </div>
    )
  }

  if (currentTool === 'URL Encoder') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <URLEncoder />
        </div>
      </div>
    )
  }

  if (currentTool === 'Hash Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <HashGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'Cron Parser') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <CronParser />
        </div>
      </div>
    )
  }

  if (currentTool === 'JWT Debugger') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <JWTDebugger />
        </div>
      </div>
    )
  }

  if (currentPage === 'about') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <About />
        </div>
      </div>
    )
  }

  if (currentPage === 'contact') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <Contact />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
      <main className="main-content">
        <section className="hero">
          <h1>Welcome to CyberLock Tools</h1>
          <p>A free, all-in-one suite of online utilities for encoding, decoding, hashing, and automation. All tools are secure, private, and run completely in your browser.</p>
        </section>

        <section className="tools-grid">
          <h2>Our Online Tools</h2>
          <p className="tools-intro">Choose from our collection of free online tools designed for developers, security professionals, and students:</p>
          <div className="cards-container">
            {tools.map((tool, idx) => (
              <div 
                key={idx}
                onClick={() => handleToolClick(tool.title)}
              >
                <ToolCard 
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="features">
          <h2>Why Choose CyberLock Tools?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>🔒 100% Private & Secure</h3>
              <p>All tools run entirely in your browser. Your data never leaves your device or reaches our servers.</p>
            </div>
            <div className="feature-item">
              <h3>⚡ Lightning Fast</h3>
              <p>No waiting for uploads or downloads. Process your data instantly with browser-based computation.</p>
            </div>
            <div className="feature-item">
              <h3>📚 Educational</h3>
              <p>Learn about cryptography, encoding schemes, and scheduling with built-in explanations and examples.</p>
            </div>
            <div className="feature-item">
              <h3>🎨 User-Friendly</h3>
              <p>Intuitive interface with clear inputs, outputs, and helpful documentation for each tool.</p>
            </div>
          </div>
        </section>

        <section className="tool-overview">
          <h2>Tool Overview</h2>
          
          <div className="tool-detail">
            <h3>🔄 <a href="#rot">ROT13 and Caesar Cipher Tool</a></h3>
            <p>Encode and decode text using ROT13 and Caesar cipher with adjustable rotation amounts (0-25). Perfect for learning about basic cryptography and text transformation. The ROT13 variant uses a rotation of 13 positions and is commonly used for obfuscation.</p>
          </div>

          <div className="tool-detail">
            <h3>📝 <a href="#base64">Base64 Encoder and Decoder</a></h3>
            <p>Convert text to Base64 encoding or decode Base64 strings back to plain text. Base64 is widely used for email attachments, data transmission over text-only protocols, and API data encoding. Essential for web developers working with data that needs to be transmitted safely.</p>
          </div>

          <div className="tool-detail">
            <h3>🔗 <a href="#url">URL Encoder and Decoder</a></h3>
            <p>Encode text to URL-safe format (percent encoding) or decode URL-encoded strings. URL encoding is crucial for safe transmission of special characters in URLs, query parameters, and form data. Web developers rely on this for building secure, properly-formatted URLs.</p>
          </div>

          <div className="tool-detail">
            <h3>#️⃣ <a href="#hash">Hash Generator Tool</a></h3>
            <p>Generate cryptographic hashes using multiple algorithms: MD5, SHA-1, SHA-256, SHA-384, and SHA-512. Useful for data integrity verification, checksums, and learning cryptography. Includes educational warnings about using MD5 and SHA-1 only for non-security purposes.</p>
          </div>

          <div className="tool-detail">
            <h3>⏰ <a href="#cron">Cron Expression Parser and Generator</a></h3>
            <p>Create cron expressions with an intuitive dropdown interface or parse existing cron syntax into human-readable explanations. Essential for developers working with task schedulers, server automation, and cronjobs. Understand complex scheduling expressions with ease.</p>
          </div>

          <div className="tool-detail">
            <h3>🔐 <a href="#jwt">JWT Debugger and Decoder</a></h3>
            <p>Paste a JWT token and instantly see the decoded header, payload, and signature. Perfect for debugging and understanding JWT tokens during development. All decoding happens locally in your browser - no tokens are sent to any server.</p>
          </div>
        </section>

        <section className="cta">
          <h2>Ready to Get Started?</h2>
          <p>Select a tool above to begin encoding, decoding, hashing, parsing, or generating. All tools are completely free and work offline in your browser.</p>
          <button className="cta-button" onClick={() => handleToolClick('ROT')}>Explore Tools</button>
        </section>
      </main>
    </div>
  )
}
