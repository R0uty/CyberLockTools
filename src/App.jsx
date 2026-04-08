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
import {
  RotateClockwiseIcon,
  File01Icon,
  Link01Icon,
  HashtagIcon,
  Clock01Icon,
  LockIcon,
  FileScriptIcon,
  DocumentCodeIcon,
  Search01Icon,
  Xml01Icon,
  Database01Icon,
  GridIcon,
  IdentityCardIcon,
  Calendar01Icon,
  PasswordValidationIcon,
  Ticket01Icon,
  MobileNavigator02Icon,
  IdeaIcon,
  CssFile02Icon,
  AiChemistry02Icon
} from 'hugeicons-react'
import QRCodeGenerator from './pages/QRCodeGenerator'
import ColorConverter from './pages/ColorConverter'
import CSSBeautifier from './pages/CSSBeautifier'
import Tools from './pages/Tools'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'

export default function App() {
  const [currentTool, setCurrentTool] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')

  useSEO({
    title: "R0uty's Cyber Lab - My Free Online Tools Suite",
    description: "R0uty's Cyber Lab - My collection of powerful online utilities for encoding, hashing, formatting, and generation. All tools run securely in your browser with zero server uploads.",
    keywords: 'online tools, encoder decoder, hash generator, base64, rot13, url encoder, cron parser, free tools, r0uty'
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
      iconName: 'RotateClockwiseIcon',
      title: 'ROT',
      description: 'Encode and decode ROT13 and ROT47 cipher text.'
    },
    {
      iconName: 'File01Icon',
      title: 'Base64',
      description: 'Encode and decode Base64 strings.'
    },
    {
      iconName: 'Link01Icon',
      title: 'URL Encoder',
      description: 'Encode and decode URLs for safe web transmission.'
    },
    {
      iconName: 'HashtagIcon',
      title: 'Hash Generator',
      description: 'Generate MD5, SHA1, SHA256, and more hash algorithms.'
    },
    {
      iconName: 'Clock01Icon',
      title: 'Cron Parser',
      description: 'Parse and understand cron expressions easily.'
    },
    {
      iconName: 'LockIcon',
      title: 'JWT Debugger',
      description: 'Decode and debug JWT tokens to see their content.'
    },
    {
      iconName: 'FileScriptIcon',
      title: 'JSON Formatter',
      description: 'Format and validate JSON with proper indentation.'
    },
    {
      iconName: 'File01Icon',
      title: 'YAML Formatter',
      description: 'Format YAML files and convert to JSON.'
    },
    {
      iconName: 'DocumentCodeIcon',
      title: 'Markdown Preview',
      description: 'Convert and preview markdown with live rendering.'
    },
    {
      iconName: 'Search01Icon',
      title: 'Regex Tester',
      description: 'Test regex patterns with live matching and highlighting.'
    },
    {
      iconName: 'Xml01Icon',
      title: 'XML Formatter',
      description: 'Format and validate XML with proper indentation.'
    },
    {
      iconName: 'Database01Icon',
      title: 'SQL Formatter',
      description: 'Format and validate SQL queries with proper indentation.'
    },
    {
      iconName: 'GridIcon',
      title: 'CSV Formatter',
      description: 'Parse, format, and convert CSV to/from JSON.'
    },
    {
      iconName: 'IdentityCardIcon',
      title: 'UUID Generator',
      description: 'Generate and validate UUID v1 and v4 identifiers.'
    },
    {
      iconName: 'Calendar01Icon',
      title: 'Timestamp Converter',
      description: 'Convert between Unix timestamps and human-readable dates.'
    },
    {
      iconName: 'PasswordValidationIcon',
      title: 'Password Generator',
      description: 'Generate secure passwords with customizable options and strength analysis.'
    },
    {
      iconName: 'Ticket01Icon',
      title: 'JWT Encoder',
      description: 'Create and verify JWT tokens with custom payload and signature.'
    },
    {
      iconName: 'MobileNavigator02Icon',
      title: 'QR Code Generator',
      description: 'Generate QR codes from text, URLs, and contact information.'
    },
    {
      iconName: 'IdeaIcon',
      title: 'Color Converter',
      description: 'Convert between HEX, RGB, HSL, and HSV color formats with live preview.'
    },
    {
      iconName: 'CssFile02Icon',
      title: 'CSS Beautifier',
      description: 'Format, minify, and validate CSS with file size optimization analysis.'
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

  if (currentTool === 'Color Converter') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <ColorConverter />
        </div>
      </div>
    )
  }

  if (currentTool === 'CSS Beautifier') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <CSSBeautifier />
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
          <h1>Welcome to My Cyber Lab</h1>
          <p>Hey there! I'm R0uty, and this is my personal collection of 20+ powerful online utilities for encoding, decoding, hashing, formatting, and generation. All my tools are secure, private, and run completely in your browser—no data ever touches my servers.</p>
          
          {/* Search Bar */}
          <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder=" Search tools... (e.g., 'hash', 'color', 'json')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setCurrentPage('tools')
                }
              }}
              style={{
                width: '100%',
                maxWidth: '600px',
                padding: '12px 20px',
                fontSize: '16px',
                border: '2px solid #c0c0c0',
                borderRadius: '8px',
                backgroundColor: '#1a1a1a',
                color: '#e8e8e8',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </section>

        <section className="features">
          <h2>Why I Built This Lab</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>100% Private & Secure</h3>
              <p>My tools run entirely in your browser. Your data never leaves your device or reaches my servers.</p>
            </div>
            <div className="feature-item">
              <h3>Lightning Fast</h3>
              <p>No waiting for uploads or downloads. Process your data instantly with browser-based computation.</p>
            </div>
            <div className="feature-item">
              <h3>Educational</h3>
              <p>Learn about cryptography, encoding schemes, and scheduling with built-in explanations and examples.</p>
            </div>
            <div className="feature-item">
              <h3>User-Friendly</h3>
              <p>Intuitive interfaces with clear inputs, outputs, and helpful documentation for each tool.</p>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Explore My Lab</h2>
          <p>Pick from my collection of 20 specialized tools for all your encoding, hashing, formatting, and generation needs.</p>
          <button className="cta-button" onClick={() => handlePageChange('tools')}>Browse My Tools</button>
        </section>
      </main>
    </div>
  )
}
