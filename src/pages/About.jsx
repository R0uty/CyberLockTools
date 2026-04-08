import { useSEO } from '../hooks/useSEO'

export default function About() {
  useSEO({
    title: 'About R0uty\'s Cyber Lab',
    description: 'Learn about R0uty\'s Cyber Lab - a free, secure collection of online utilities. My mission is to provide private, browser-based tools for encoding, hashing, and automation.',
    keywords: 'about r0utys cyber lab, online tools, free utilities, secure tools'
  })

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>About R0uty's Cyber Lab</h1>
        <p>My personal collection of secure, private online utilities</p>
      </div>

      <div className="tool-container">
        <section className="info-box">
          <h2>My Mission</h2>
          <p>
            R0uty's Cyber Lab exists to provide developers, security professionals, students, and anyone interested in cryptography with a collection of free, secure online utilities. I believe in privacy-first tools that run entirely in your browser.
          </p>
        </section>

        <section className="info-box">
          <h2>Why I Built This</h2>
          <p>
            Too many online tools sell your data or run untrusted code on servers. I created R0uty's Cyber Lab to offer a better alternative: a collection of utilities that are transparent, secure, and run 100% in your browser. Your data never leaves your device.
          </p>
        </section>

        <section className="info-box">
          <h2>My Tools</h2>
          <p>
            Each tool in my collection is designed with a specific purpose:
          </p>
          <ul>
            <li><strong>ROT13 & Caesar Cipher:</strong> Learn about letter substitution ciphers and text rotation</li>
            <li><strong>Base64 Encoder/Decoder:</strong> Encode and decode data in Base64 format for web transmission</li>
            <li><strong>URL Encoder/Decoder:</strong> Safely encode special characters in URLs and query parameters</li>
            <li><strong>Hash Generator:</strong> Generate cryptographic hashes with MD5, SHA-256, SHA-512, and more</li>
            <li><strong>Cron Parser:</strong> Build and understand cron expressions for task scheduling</li>
          </ul>
        </section>

        <section className="info-box">
          <h2>Privacy & Security</h2>
          <p>
            <strong>I take privacy seriously:</strong>
          </p>
          <ul>
            <li>All processing happens in your browser using JavaScript</li>
            <li>No data is sent to my servers or any third parties</li>
            <li>No cookies or tracking of any kind</li>
            <li>You can use these tools completely offline</li>
            <li>Your input is never logged or stored anywhere</li>
          </ul>
        </section>

        <section className="info-box">
          <h2>Educational Purpose</h2>
          <p>
            R0uty's Cyber Lab is designed with education in mind. Whether you're learning about cryptography, encoding schemes, or automation, my tools include explanations and examples to help you understand how they work.
          </p>
          <p>
            <strong>Important Note:</strong> Some algorithms like MD5 and SHA-1 are cryptographically broken. Tools that support them include warnings and are meant for educational purposes only, not for production security use.
          </p>
        </section>

        <section className="info-box">
          <h2>Technologies</h2>
          <p>
            R0uty's Cyber Lab is built with:
          </p>
          <ul>
            <li><strong>React:</strong> Modern JavaScript library for building user interfaces</li>
            <li><strong>Vite:</strong> Fast, next-generation build tool</li>
            <li><strong>Browser APIs:</strong> Native web APIs for cryptography and utilities</li>
            <li><strong>crypto-js:</strong> JavaScript library for cryptographic functions</li>
            <li><strong>cronstrue:</strong> Library for parsing cron expressions to English</li>
          </ul>
        </section>

        <section className="info-box">
          <h2>Free & Open Source Philosophy</h2>
          <p>
            These tools are provided completely free. I believe technology tools should be accessible to everyone, regardless of their budget. If you find R0uty's Cyber Lab useful, feel free to share it with others!
          </p>
        </section>
      </div>
    </div>
  )
}
