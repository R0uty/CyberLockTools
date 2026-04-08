import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'

export default function Contact() {
  useSEO({
    title: 'Contact R0uty - Cyber Lab',
    description: 'Get in touch with R0uty. Send me feedback, feature requests, bug reports, or general inquiries. I\'d love to hear from you!',
    keywords: 'contact, feedback, support, bug report, feature request'
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    // For now, just show a success message (no actual email sending)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1>Get In Touch</h1>
        <p>I'd love to hear from you. Send me your feedback, feature requests, or bug reports!</p>
      </div>

      <div className="tool-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        {submitted && (
          <div style={{
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '2px solid #4caf50',
            fontWeight: '600'
          }}>
            ✓ Thank you for your message! I appreciate your feedback and will review it soon.
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="textarea-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              style={{
                padding: '0.75rem',
                border: "2px solid #4a4a4a",
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = "#c0c0c0"}
              onBlur={(e) => e.target.style.borderColor = "#4a4a4a"}
            />
          </div>

          <div className="textarea-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={{
                padding: '0.75rem',
                border: "2px solid #4a4a4a",
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = "#c0c0c0"}
              onBlur={(e) => e.target.style.borderColor = "#4a4a4a"}
            />
          </div>

          <div className="textarea-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Feature Request, Bug Report"
              style={{
                padding: '0.75rem',
                border: "2px solid #4a4a4a",
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = "#c0c0c0"}
              onBlur={(e) => e.target.style.borderColor = "#4a4a4a"}
            />
          </div>

          <div className="textarea-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me what you think, request a feature, or report a bug..."
              className="textarea"
              rows="6"
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #c0c0c0 0%, #808080 100%)',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 12px rgba(192, 192, 192, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Send Message
          </button>
        </form>

        <section className="info-box" style={{ marginTop: '2rem' }}>
          <h2>Other Ways to Connect</h2>
          <p>
            Have a quick question or just want to chat? Here are some things you can do:
          </p>
          <ul>
            <li><strong>Report a Bug:</strong> Let me know if you find any issues with the tools</li>
            <li><strong>Request a Feature:</strong> Suggest new tools or improvements</li>
            <li><strong>Share Feedback:</strong> Tell me what you like or what could be better</li>
            <li><strong>Ask Questions:</strong> Confused about how something works? I'm here to help</li>
          </ul>
          <p style={{ marginTop: '1.5rem', color: '#666', fontSize: '0.95rem' }}>
            <strong>Note:</strong> This contact form is for demonstration purposes. In a production environment, messages would be sent to my email or stored in a database.
          </p>
        </section>
      </div>
    </div>
  )
}
