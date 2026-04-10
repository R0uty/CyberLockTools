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
  LockKeyIcon,
  CheckmarkBadge01Icon,
  BookOpen01Icon,
  SmileIcon,
  ArrowDataTransferHorizontalIcon,
  GlobeIcon,
  CommandLineIcon,
  AiSecurity02Icon,
  Bug02Icon,
  CodeIcon,
  GitPullRequestIcon,
  BinaryCodeIcon,
  CodeCircleIcon,
  InternetIcon,
  ComputerTerminal01Icon,
  FolderSecurityIcon
} from 'hugeicons-react'
import QRCodeGenerator from './pages/QRCodeGenerator'
import ColorConverter from './pages/ColorConverter'
import CSSBeautifier from './pages/CSSBeautifier'
import ReverseShellGenerator from './pages/ReverseShellGenerator'
import XXEGenerator from './pages/XXEGenerator'
import XSSGenerator from './pages/XSSGenerator'
import SQLInjectionGenerator from './pages/SQLInjectionGenerator'
import GraphQLInjectionGenerator from './pages/GraphQLInjectionGenerator'
import HTTPParameterPollutionGenerator from './pages/HTTPParameterPollutionGenerator'
import NumberBaseConverter from './pages/NumberBaseConverter'
import HTMLEncoder from './pages/HTMLEncoder'
import SSRFGenerator from './pages/SSRFGenerator'
import CommandInjectionGenerator from './pages/CommandInjectionGenerator'
import PathTraversalGenerator from './pages/PathTraversalGenerator'
import Tools from './pages/Tools'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'
import './App.extra.css'

export default function App() {
  const [currentTool, setCurrentTool] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')

  useSEO({
    title: "R0uty's Cyber Lab - My Free Online Tools Suite",
    description: "R0uty's Cyber Lab - My collection of powerful online utilities for encoding, hashing, formatting, and generation. All tools run securely in your browser with zero server uploads.",
    keywords: 'online tools, encoder decoder, hash generator, base64, rot13, url encoder, cron parser, free tools, r0uty'
  })

  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (page === 'tools') {
      setCurrentTool(null)
    } else if (page === 'home') {
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
    // General Utility Tools
    {
      category: 'General',
      iconName: 'RotateClockwiseIcon',
      title: 'ROT',
      description: 'Encode and decode ROT13 and ROT47 cipher text.'
    },
    {
      category: 'General',
      iconName: 'File01Icon',
      title: 'Base64',
      description: 'Encode and decode Base64 strings.'
    },
    {
      category: 'General',
      iconName: 'Link01Icon',
      title: 'URL Encoder',
      description: 'Encode and decode URLs for safe web transmission.'
    },
    {
      category: 'General',
      iconName: 'HashtagIcon',
      title: 'Hash Generator',
      description: 'Generate MD5, SHA1, SHA256, and more hash algorithms.'
    },
    {
      category: 'General',
      iconName: 'Clock01Icon',
      title: 'Cron Parser',
      description: 'Parse and understand cron expressions easily.'
    },
    {
      category: 'General',
      iconName: 'LockIcon',
      title: 'JWT Debugger',
      description: 'Decode and debug JWT tokens to see their content.'
    },
    {
      category: 'General',
      iconName: 'FileScriptIcon',
      title: 'JSON Formatter',
      description: 'Format and validate JSON with proper indentation.'
    },
    {
      category: 'General',
      iconName: 'File01Icon',
      title: 'YAML Formatter',
      description: 'Format YAML files and convert to JSON.'
    },
    {
      category: 'General',
      iconName: 'DocumentCodeIcon',
      title: 'Markdown Preview',
      description: 'Convert and preview markdown with live rendering.'
    },
    {
      category: 'General',
      iconName: 'Search01Icon',
      title: 'Regex Tester',
      description: 'Test regex patterns with live matching and highlighting.'
    },
    {
      category: 'General',
      iconName: 'Xml01Icon',
      title: 'XML Formatter',
      description: 'Format and validate XML with proper indentation.'
    },
    {
      category: 'General',
      iconName: 'Database01Icon',
      title: 'SQL Formatter',
      description: 'Format and validate SQL queries with proper indentation.'
    },
    {
      category: 'General',
      iconName: 'GridIcon',
      title: 'CSV Formatter',
      description: 'Parse, format, and convert CSV to/from JSON.'
    },
    {
      category: 'General',
      iconName: 'IdentityCardIcon',
      title: 'UUID Generator',
      description: 'Generate and validate UUID v1 and v4 identifiers.'
    },
    {
      category: 'General',
      iconName: 'Calendar01Icon',
      title: 'Timestamp Converter',
      description: 'Convert between Unix timestamps and human-readable dates.'
    },
    {
      category: 'General',
      iconName: 'PasswordValidationIcon',
      title: 'Password Generator',
      description: 'Generate secure passwords with customizable options and strength analysis.'
    },
    {
      category: 'General',
      iconName: 'Ticket01Icon',
      title: 'JWT Encoder',
      description: 'Create and verify JWT tokens with custom payload and signature.'
    },
    {
      category: 'General',
      iconName: 'MobileNavigator02Icon',
      title: 'QR Code Generator',
      description: 'Generate QR codes from text, URLs, and contact information.'
    },
    {
      category: 'General',
      iconName: 'IdeaIcon',
      title: 'Color Converter',
      description: 'Convert between HEX, RGB, HSL, and HSV color formats with live preview.'
    },
    {
      category: 'General',
      iconName: 'CssFile02Icon',
      title: 'CSS Beautifier',
      description: 'Format, minify, and validate CSS with file size optimization analysis.'
    },
    {
      category: 'General',
      iconName: 'BinaryCodeIcon',
      title: 'Number Base Converter',
      description: 'Convert numbers between binary, octal, decimal, and hexadecimal instantly.'
    },
    {
      category: 'General',
      iconName: 'CodeCircleIcon',
      title: 'HTML Encoder',
      description: 'Encode special characters to HTML entities and decode HTML entities back to text.'
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
      iconName: 'CodeIcon',
      title: 'GraphQL Injection Generator',
      description: 'Generate GraphQL injection and introspection payloads for authorized security testing. Includes schema enumeration, authentication bypass, and DoS techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'GitPullRequestIcon',
      title: 'HTTP Parameter Pollution Generator',
      description: 'Generate HTTP parameter pollution payloads for authorized security testing. Includes WAF bypass, cache poisoning, and backend confusion techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'InternetIcon',
      title: 'SSRF Generator',
      description: 'Generate Server-Side Request Forgery payloads for authorized security testing. Includes cloud metadata, internal services, file read, and bypass techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'ComputerTerminal01Icon',
      title: 'Command Injection Generator',
      description: 'Generate OS command injection payloads for authorized security testing. Includes Unix, Windows, filter bypass, and out-of-band exfiltration techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'FolderSecurityIcon',
      title: 'Path Traversal Generator',
      description: 'Generate path traversal and directory traversal payloads for authorized security testing. Includes Unix, Windows, encoded, and bypass techniques.'
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

  if (currentTool === 'Reverse Shell Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <ReverseShellGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'XXE Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <XXEGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'XSS Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <XSSGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'SQL Injection Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <SQLInjectionGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'GraphQL Injection Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <GraphQLInjectionGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'HTTP Parameter Pollution Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <HTTPParameterPollutionGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'Number Base Converter') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <NumberBaseConverter />
        </div>
      </div>
    )
  }

  if (currentTool === 'HTML Encoder') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <HTMLEncoder />
        </div>
      </div>
    )
  }

  if (currentTool === 'SSRF Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <SSRFGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'Command Injection Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <CommandInjectionGenerator />
        </div>
      </div>
    )
  }

  if (currentTool === 'Path Traversal Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="main-content">
          <PathTraversalGenerator />
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
        </section>

        <section className="features">
          <h2>Why I Built This Lab</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-wrapper"><LockKeyIcon size={32} color="#c0c0c0" /></div>
              <h3>100% Private & Secure</h3>
              <p>My tools run entirely in your browser. Your data never leaves your device or reaches my servers.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper"><CheckmarkBadge01Icon size={32} color="#c0c0c0" /></div>
              <h3>Lightning Fast</h3>
              <p>No waiting for uploads or downloads. Process your data instantly with browser-based computation.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper"><BookOpen01Icon size={32} color="#c0c0c0" /></div>
              <h3>Educational</h3>
              <p>Learn about cryptography, encoding schemes, and scheduling with built-in explanations and examples.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper"><SmileIcon size={32} color="#c0c0c0" /></div>
              <h3>User-Friendly</h3>
              <p>Intuitive interfaces with clear inputs, outputs, and helpful documentation for each tool.</p>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Explore My Lab</h2>
          <p>Pick from my collection of 25 specialized tools for all your encoding, hashing, formatting, and generation needs.</p>
          <button className="cta-button" onClick={() => handlePageChange('tools')}>Browse My Tools</button>
        </section>
      </main>
    </div>
  )
}
