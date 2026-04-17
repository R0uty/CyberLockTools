import '../styles/components/Header.css'

export default function Header({ onLogoClick, currentPage, onPageChange }) {
  const navItems = [
    ['home', 'Home'],
    ['flow-map', 'Flow Map'],
    ['tool-guides', 'Pentesting Tools'],
    ['skills', 'Agent Skills'],
    ['tools', 'General Tools & Payloads'],
    ['lab-notes', 'Lab Notes'],
    ['about', 'About'],
    ['contact', 'Contact']
  ]

  const handleNavClick = (page) => {
    onPageChange(page)
  }

  const handleNavLinkClick = (event, page) => {
    event.preventDefault()
    handleNavClick(page)
  }

  const getLinkClass = (page) => {
    return currentPage === page ? 'nav-link active' : 'nav-link'
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a
            href="#home"
            className="logo-heading"
            aria-label="Go to home page"
            onClick={(event) => {
              event.preventDefault()
              onLogoClick()
              handleNavClick('home')
            }}
          >
            <h1>R0uty's Cyber Lab</h1>
          </a>
        </div>
        <nav className="nav" aria-label="Primary navigation">
          {navItems.map(([page, label]) => (
            <a
              key={page}
              href={`#${page}`}
              className={getLinkClass(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              onClick={(event) => handleNavLinkClick(event, page)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
