import { useSEO } from '../hooks/useSEO';
import ToolCard from '../components/ToolCard';

export default function Tools({ tools, onToolClick }) {
  useSEO({
    title: 'All Online Tools - Free Encoder, Decoder, Generator, Formatter',
    description: 'Browse all free online tools - ROT13, Base64, URL Encoder, Hash Generator, Cron Parser, JWT Debugger, JSON/YAML Formatter, Markdown Preview, and Regex Tester. Everything runs in your browser.',
    keywords: 'online tools, encoder, decoder, formatter, generator, parser, free tools, browser tools, utilities',
  });

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>🛠️ Our Online Tools</h1>
        <p>Browse our complete collection of free online utilities for developers, security professionals, and students. All tools are secure, private, and run entirely in your browser.</p>
      </div>

      <div className="tool-container">
        <section className="tools-grid">
          <div className="tools-intro">
            <p>Choose from {tools.length} powerful tools designed to make your work easier:</p>
          </div>

          <div className="cards-container">
            {tools.map((tool, idx) => (
              <div
                key={idx}
                onClick={() => onToolClick(tool.title)}
                className="tool-card-wrapper"
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

        <section className="tools-benefits">
          <h2>📊 Tool Categories</h2>
          <div className="category-grid">
            <div className="category-item">
              <h3>🔄 Encoders & Decoders</h3>
              <ul>
                <li>ROT13 / Caesar Cipher</li>
                <li>Base64 Encoder/Decoder</li>
                <li>URL Encoder/Decoder</li>
              </ul>
            </div>
            <div className="category-item">
              <h3>#️⃣ Hash & Cryptography</h3>
              <ul>
                <li>Hash Generator (MD5, SHA-1-512)</li>
                <li>JWT Debugger & Decoder</li>
              </ul>
            </div>
            <div className="category-item">
              <h3>📝 Formatters & Converters</h3>
              <ul>
                <li>JSON Formatter & Validator</li>
                <li>YAML Formatter & Converter</li>
                <li>Markdown Preview</li>
              </ul>
            </div>
            <div className="category-item">
              <h3>🔍 Testers & Parsers</h3>
              <ul>
                <li>Regex Tester & Matcher</li>
                <li>Cron Expression Parser</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="tools-features">
          <h2>Why These Tools?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔒 100% Private & Secure</h3>
              <p>All processing happens in your browser. Your data never reaches our servers or leaves your device.</p>
            </div>
            <div className="feature-card">
              <h3>⚡ Lightning Fast</h3>
              <p>Instant results with no waiting. All computations run locally in your web browser.</p>
            </div>
            <div className="feature-card">
              <h3>📚 Educational</h3>
              <p>Learn about encoding, hashing, formatting, and pattern matching with built-in explanations.</p>
            </div>
            <div className="feature-card">
              <h3>🎨 User-Friendly</h3>
              <p>Intuitive interfaces with clear inputs, live previews, and helpful tips for each tool.</p>
            </div>
            <div className="feature-card">
              <h3>💯 Free & Open</h3>
              <p>Completely free with no ads, registrations, or subscriptions required.</p>
            </div>
            <div className="feature-card">
              <h3>🌐 Browser-Based</h3>
              <p>Works on any device with a modern web browser. No installation or downloads needed.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
