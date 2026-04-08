import { useState } from 'react'
import { useSEO } from './hooks/useSEO'
import Header from './components/Header'
import ROT from './pages/ROT'
import Base64 from './pages/Base64'
import URLEncoder from './pages/URLEncoder'
import HashGenerator from './pages/HashGenerator'
import CronParser from './pages/CronParser'
import JWTDebugger from './pages/JWTDebugger'
import JSONFormatter from './pages/JSONFormatter'
import YAMLFormatter from './pages/YAMLFormatter'
import MarkdownPreview from './pages/MarkdownPreview'
import RegexTester from './pages/RegexTester'
import XMLFormatter from './pages/XMLFormatter'
import SQLFormatter from './pages/SQLFormatter'
import CSVFormatter from './pages/CSVFormatter'
import UUIDGenerator from './pages/UUIDGenerator'
import TimestampConverter from './pages/TimestampConverter'
import PasswordGenerator from './pages/PasswordGenerator'
import JWTEncoder from './pages/JWTEncoder'
import QRCodeGenerator from './pages/QRCodeGenerator'
import Tools from './pages/Tools'
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
    },
    {
      icon: '📋',
      title: 'JSON Formatter',
      description: 'Format and validate JSON with proper indentation.'
    },
    {
      icon: '📄',
      title: 'YAML Formatter',
      description: 'Format YAML files and convert to JSON.'
    },
    {
      icon: '📑',
      title: 'Markdown Preview',
      description: 'Convert and preview markdown with live rendering.'
    },
    {
      icon: '🔍',
      title: 'Regex Tester',
      description: 'Test regex patterns with live matching and highlighting.'
    },
    {
      icon: '📄',
      title: 'XML Formatter',
      description: 'Format and validate XML with proper indentation.'
    },
    {
      icon: '🗄️',
      title: 'SQL Formatter',
      description: 'Format and validate SQL queries with proper indentation.'
    },
    {
      icon: '📊',
      title: 'CSV Formatter',
      description: 'Parse, format, and convert CSV to/from JSON.'
    },
    {
      icon: '🆔',
      title: 'UUID Generator',
      description: 'Generate and validate UUID v1 and v4 identifiers.'
    },
    {
      icon: '🕐',
      title: 'Timestamp Converter',
      description: 'Convert between Unix timestamps and human-readable dates.'
    },
    {
      icon: '🔑',
      title: 'Password Generator',
      description: 'Generate secure passwords with customizable options and strength analysis.'
    },
    {
      icon: '🔑',
      title: 'JWT Encoder',
      description: 'Create and verify JWT tokens with custom payload and signature.'
    },
    {
      icon: '📱',
      title: 'QR Code Generator',
      description: 'Generate QR codes from text, URLs, and contact information.'
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

  if (currentTool === 'JSON Formatter') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <JSONFormatter />
        </div>
      </div>
    )
  }

  if (currentTool === 'YAML Formatter') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <YAMLFormatter />
        </div>
      </div>
    )
  }

  if (currentTool === 'Markdown Preview') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <MarkdownPreview />
        </div>
      </div>
    )
  }

  if (currentTool === 'Regex Tester') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <RegexTester />
        </div>
      </div>
    )
  }

  if (currentTool === 'XML Formatter') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <XMLFormatter />
        </div>
      </div>
    )
  }

  if (currentTool === 'SQL Formatter') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <SQLFormatter />
        </div>
      </div>
    )
  }

  if (currentTool === 'CSV Formatter') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <CSVFormatter />
        </div>
      </div>
    )
  }

  if (currentTool === 'UUID Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <UUIDGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'Timestamp Converter') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <TimestampConverter />
        </div>
      </div>
    )
  }

  if (currentTool === 'Password Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <PasswordGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'JWT Encoder') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <JWTEncoder />
        </div>
      </div>
    )
  }

  if (currentTool === 'QR Code Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <QRCodeGenerator />
        </div>
      </div>
    )
  }

  if (currentPage === 'tools' && !currentTool) {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <Tools tools={tools} onToolClick={handleToolClick} />
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

        <section className="cta">
          <h2>Ready to Get Started?</h2>
          <p>Choose from our collection of 18 free online tools for encoding, decoding, hashing, generating, and more.</p>
          <button className="cta-button" onClick={() => handlePageChange('tools')}>Browse All Tools</button>
        </section>
      </main>
    </div>
  )
}
